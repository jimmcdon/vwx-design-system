import { CostRecord, AITaskType } from '../config/types';

/**
 * Cost Analytics Engine
 *
 * Provides detailed analytics and insights on AI usage costs
 */
export class CostAnalytics {
  private costs: CostRecord[];

  constructor(costs: CostRecord[]) {
    this.costs = costs;
  }

  /**
   * Get total cost for a time period
   */
  getTotalCost(startDate: Date, endDate: Date): number {
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    return this.costs
      .filter((c) => c.timestamp >= startTimestamp && c.timestamp <= endTimestamp)
      .reduce((sum, c) => sum + c.cost, 0);
  }

  /**
   * Get cost breakdown by provider
   */
  getProviderBreakdown(startDate: Date, endDate: Date): {
    provider: string;
    cost: number;
    requests: number;
    percentage: number;
  }[] {
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    const filtered = this.costs.filter(
      (c) => c.timestamp >= startTimestamp && c.timestamp <= endTimestamp
    );

    const total = filtered.reduce((sum, c) => sum + c.cost, 0);
    const byProvider = new Map<string, { cost: number; requests: number }>();

    for (const cost of filtered) {
      const current = byProvider.get(cost.provider) || { cost: 0, requests: 0 };
      byProvider.set(cost.provider, {
        cost: current.cost + cost.cost,
        requests: current.requests + 1,
      });
    }

    return Array.from(byProvider.entries()).map(([provider, data]) => ({
      provider,
      cost: data.cost,
      requests: data.requests,
      percentage: total > 0 ? (data.cost / total) * 100 : 0,
    }));
  }

  /**
   * Get cost breakdown by task type
   */
  getTaskTypeBreakdown(startDate: Date, endDate: Date): {
    taskType: AITaskType;
    cost: number;
    requests: number;
    percentage: number;
  }[] {
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    const filtered = this.costs.filter(
      (c) => c.timestamp >= startTimestamp && c.timestamp <= endTimestamp && c.taskType
    );

    const total = filtered.reduce((sum, c) => sum + c.cost, 0);
    const byType = new Map<AITaskType, { cost: number; requests: number }>();

    for (const cost of filtered) {
      if (cost.taskType) {
        const current = byType.get(cost.taskType) || { cost: 0, requests: 0 };
        byType.set(cost.taskType, {
          cost: current.cost + cost.cost,
          requests: current.requests + 1,
        });
      }
    }

    return Array.from(byType.entries()).map(([taskType, data]) => ({
      taskType,
      cost: data.cost,
      requests: data.requests,
      percentage: total > 0 ? (data.cost / total) * 100 : 0,
    }));
  }

  /**
   * Get daily cost trend
   */
  getDailyTrend(startDate: Date, endDate: Date): { date: string; cost: number }[] {
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    const filtered = this.costs.filter(
      (c) => c.timestamp >= startTimestamp && c.timestamp <= endTimestamp
    );

    const byDay = new Map<string, number>();

    for (const cost of filtered) {
      const dateKey = new Date(cost.timestamp).toISOString().split('T')[0];
      byDay.set(dateKey, (byDay.get(dateKey) || 0) + cost.cost);
    }

    return Array.from(byDay.entries())
      .map(([date, cost]) => ({ date, cost }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get cost statistics
   */
  getStats(startDate: Date, endDate: Date): {
    total: number;
    average: number;
    median: number;
    min: number;
    max: number;
    requestCount: number;
  } {
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    const filtered = this.costs.filter(
      (c) => c.timestamp >= startTimestamp && c.timestamp <= endTimestamp
    );

    if (filtered.length === 0) {
      return { total: 0, average: 0, median: 0, min: 0, max: 0, requestCount: 0 };
    }

    const amounts = filtered.map((c) => c.cost).sort((a, b) => a - b);
    const total = amounts.reduce((sum, a) => sum + a, 0);

    return {
      total,
      average: total / amounts.length,
      median: amounts[Math.floor(amounts.length / 2)],
      min: amounts[0],
      max: amounts[amounts.length - 1],
      requestCount: filtered.length,
    };
  }

  /**
   * Compare costs between two time periods
   */
  comparePeriods(
    period1Start: Date,
    period1End: Date,
    period2Start: Date,
    period2End: Date
  ): {
    period1: number;
    period2: number;
    change: number;
    changePercent: number;
  } {
    const cost1 = this.getTotalCost(period1Start, period1End);
    const cost2 = this.getTotalCost(period2Start, period2End);

    const change = cost2 - cost1;
    const changePercent = cost1 > 0 ? (change / cost1) * 100 : 0;

    return {
      period1: cost1,
      period2: cost2,
      change,
      changePercent,
    };
  }

  /**
   * Find the most expensive requests
   */
  getTopExpensiveRequests(limit: number = 10): CostRecord[] {
    return [...this.costs].sort((a, b) => b.cost - a.cost).slice(0, limit);
  }

  /**
   * Get cost forecast based on historical data
   */
  getForecast(daysAhead: number): { date: string; estimatedCost: number }[] {
    // Simple moving average forecast
    const lastNDays = 7;
    const recentCosts = this.getDailyTrend(
      new Date(Date.now() - lastNDays * 24 * 60 * 60 * 1000),
      new Date()
    );

    if (recentCosts.length === 0) return [];

    const avgDailyCost =
      recentCosts.reduce((sum, day) => sum + day.cost, 0) / recentCosts.length;

    const forecast: { date: string; estimatedCost: number }[] = [];
    for (let i = 1; i <= daysAhead; i++) {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      forecast.push({
        date: date.toISOString().split('T')[0],
        estimatedCost: avgDailyCost,
      });
    }

    return forecast;
  }
}
