import { CostRecord, UsageReport, AITaskType } from '../config/types';
import { CostAnalytics } from './CostAnalytics';

/**
 * Usage Reporting System
 *
 * Generates comprehensive usage reports for AI integration
 */
export class UsageReporter {
  private analytics: CostAnalytics;

  constructor(costs: CostRecord[]) {
    this.analytics = new CostAnalytics(costs);
  }

  /**
   * Generate daily usage report
   */
  generateDailyReport(date?: Date): UsageReport {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    return this.generateReport(startOfDay, endOfDay, 'daily');
  }

  /**
   * Generate monthly usage report
   */
  generateMonthlyReport(date?: Date): UsageReport {
    const targetDate = date || new Date();
    const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

    return this.generateReport(startOfMonth, endOfMonth, 'monthly');
  }

  /**
   * Generate custom period report
   */
  generateCustomReport(
    startDate: Date,
    endDate: Date,
    period: 'daily' | 'monthly'
  ): UsageReport {
    return this.generateReport(startDate, endDate, period);
  }

  /**
   * Generate a usage report for a specific time period
   */
  private generateReport(
    startDate: Date,
    endDate: Date,
    period: 'daily' | 'monthly'
  ): UsageReport {
    const stats = this.analytics.getStats(startDate, endDate);
    const providerBreakdown = this.analytics.getProviderBreakdown(startDate, endDate);
    const taskTypeBreakdown = this.analytics.getTaskTypeBreakdown(startDate, endDate);

    const byProvider: Record<string, { cost: number; requests: number }> = {};
    for (const item of providerBreakdown) {
      byProvider[item.provider] = {
        cost: item.cost,
        requests: item.requests,
      };
    }

    const byTaskType: Record<AITaskType, { cost: number; requests: number }> = {} as any;
    for (const item of taskTypeBreakdown) {
      byTaskType[item.taskType] = {
        cost: item.cost,
        requests: item.requests,
      };
    }

    return {
      period,
      totalCost: stats.total,
      requestCount: stats.requestCount,
      byProvider,
      byTaskType,
    };
  }

  /**
   * Generate detailed analytics report
   */
  generateDetailedReport(startDate: Date, endDate: Date): {
    summary: {
      totalCost: number;
      requestCount: number;
      averageCost: number;
      medianCost: number;
    };
    breakdown: {
      byProvider: {
        provider: string;
        cost: number;
        requests: number;
        percentage: number;
      }[];
      byTaskType: {
        taskType: AITaskType;
        cost: number;
        requests: number;
        percentage: number;
      }[];
    };
    trends: {
      daily: { date: string; cost: number }[];
    };
    topExpensive: CostRecord[];
  } {
    const stats = this.analytics.getStats(startDate, endDate);
    const providerBreakdown = this.analytics.getProviderBreakdown(startDate, endDate);
    const taskTypeBreakdown = this.analytics.getTaskTypeBreakdown(startDate, endDate);
    const dailyTrend = this.analytics.getDailyTrend(startDate, endDate);
    const topExpensive = this.analytics.getTopExpensiveRequests(10);

    return {
      summary: {
        totalCost: stats.total,
        requestCount: stats.requestCount,
        averageCost: stats.average,
        medianCost: stats.median,
      },
      breakdown: {
        byProvider: providerBreakdown,
        byTaskType: taskTypeBreakdown,
      },
      trends: {
        daily: dailyTrend,
      },
      topExpensive,
    };
  }

  /**
   * Generate cost optimization recommendations
   */
  generateRecommendations(startDate: Date, endDate: Date): string[] {
    const recommendations: string[] = [];
    const providerBreakdown = this.analytics.getProviderBreakdown(startDate, endDate);
    const taskTypeBreakdown = this.analytics.getTaskTypeBreakdown(startDate, endDate);

    // Check for expensive providers
    const sortedProviders = providerBreakdown.sort((a, b) => b.cost - a.cost);
    if (sortedProviders.length > 0 && sortedProviders[0].percentage > 60) {
      recommendations.push(
        `Consider diversifying providers: ${sortedProviders[0].provider} accounts for ${sortedProviders[0].percentage.toFixed(1)}% of costs`
      );
    }

    // Check for high-volume task types
    const sortedTasks = taskTypeBreakdown.sort((a, b) => b.requests - a.requests);
    if (sortedTasks.length > 0) {
      const topTask = sortedTasks[0];
      if (topTask.requests > 100) {
        recommendations.push(
          `High volume of ${topTask.taskType} requests (${topTask.requests}): Consider caching or batch processing`
        );
      }
    }

    // Check average cost per request
    const stats = this.analytics.getStats(startDate, endDate);
    if (stats.average > 0.1) {
      recommendations.push(
        `Average cost per request is $${stats.average.toFixed(4)}: Review task configurations for optimization opportunities`
      );
    }

    // Check for cost spikes
    const dailyTrend = this.analytics.getDailyTrend(startDate, endDate);
    if (dailyTrend.length > 1) {
      const avgCost = dailyTrend.reduce((sum, day) => sum + day.cost, 0) / dailyTrend.length;
      const maxCost = Math.max(...dailyTrend.map((day) => day.cost));
      if (maxCost > avgCost * 2) {
        recommendations.push(
          `Detected cost spike: Maximum daily cost ($${maxCost.toFixed(2)}) is more than 2x the average`
        );
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('Usage patterns look optimal. Continue monitoring for changes.');
    }

    return recommendations;
  }

  /**
   * Export report as JSON
   */
  exportToJSON(report: UsageReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Format report as text
   */
  formatAsText(report: UsageReport): string {
    const lines: string[] = [];

    lines.push(`=== ${report.period.toUpperCase()} USAGE REPORT ===`);
    lines.push('');
    lines.push(`Total Cost: $${report.totalCost.toFixed(2)}`);
    lines.push(`Total Requests: ${report.requestCount}`);
    lines.push('');

    lines.push('By Provider:');
    for (const [provider, data] of Object.entries(report.byProvider)) {
      lines.push(
        `  ${provider}: $${data.cost.toFixed(2)} (${data.requests} requests)`
      );
    }
    lines.push('');

    lines.push('By Task Type:');
    for (const [taskType, data] of Object.entries(report.byTaskType)) {
      lines.push(
        `  ${taskType}: $${data.cost.toFixed(2)} (${data.requests} requests)`
      );
    }

    return lines.join('\n');
  }
}
