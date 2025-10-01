import { CostRecord, AITaskType } from '../config/types';

/**
 * Cost Tracking System
 *
 * Tracks AI provider costs across all requests
 * Enforces budget limits and provides usage analytics
 */
export class CostTracker {
  private costs: CostRecord[] = [];
  private config: any;

  constructor(config: any) {
    this.config = config || { enabled: true };
  }

  /**
   * Check if a task can proceed based on budget limits
   */
  canProceed(_task?: any): boolean {
    if (!this.config.enabled) return true;

    const today = this.getDailyCost();
    const month = this.getMonthlyCost();

    if (this.config.dailyLimit && today >= this.config.dailyLimit) {
      return false;
    }

    if (this.config.monthlyLimit && month >= this.config.monthlyLimit) {
      return false;
    }

    return true;
  }

  /**
   * Record a cost from an AI request
   */
  record(metadata: {
    cost: number;
    provider: string;
    timestamp: number;
    taskType?: AITaskType;
  }): void {
    this.costs.push({
      timestamp: metadata.timestamp,
      cost: metadata.cost,
      provider: metadata.provider,
      taskType: metadata.taskType,
    });

    // Check if we're approaching limits
    this.checkAlerts();
  }

  /**
   * Get total cost for today
   */
  getDailyCost(): number {
    const today = new Date().setHours(0, 0, 0, 0);
    return this.costs
      .filter((c) => c.timestamp >= today)
      .reduce((sum, c) => sum + c.cost, 0);
  }

  /**
   * Get total cost for this month
   */
  getMonthlyCost(): number {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const thisMonthTimestamp = thisMonth.getTime();

    return this.costs
      .filter((c) => c.timestamp >= thisMonthTimestamp)
      .reduce((sum, c) => sum + c.cost, 0);
  }

  /**
   * Get costs by provider
   */
  getCostsByProvider(): Record<string, number> {
    const byProvider: Record<string, number> = {};

    for (const cost of this.costs) {
      byProvider[cost.provider] = (byProvider[cost.provider] || 0) + cost.cost;
    }

    return byProvider;
  }

  /**
   * Get costs by task type
   */
  getCostsByTaskType(): Record<AITaskType, number> {
    const byType: Record<string, number> = {};

    for (const cost of this.costs) {
      if (cost.taskType) {
        byType[cost.taskType] = (byType[cost.taskType] || 0) + cost.cost;
      }
    }

    return byType as Record<AITaskType, number>;
  }

  /**
   * Get cost history for a specific time period
   */
  getCostHistory(
    startDate: Date,
    endDate: Date
  ): { date: number; amount: number; provider: string }[] {
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    return this.costs
      .filter((c) => c.timestamp >= startTimestamp && c.timestamp <= endTimestamp)
      .map((c) => ({
        date: c.timestamp,
        amount: c.cost,
        provider: c.provider,
      }));
  }

  /**
   * Check if we're approaching budget limits and trigger alerts
   */
  private checkAlerts(): void {
    if (!this.config.alertThreshold) return;

    const dailyCost = this.getDailyCost();
    const monthlyCost = this.getMonthlyCost();

    if (this.config.dailyLimit) {
      const dailyPercent = dailyCost / this.config.dailyLimit;
      if (dailyPercent >= this.config.alertThreshold) {
        console.warn(
          `Daily cost alert: ${(dailyPercent * 100).toFixed(1)}% of limit reached ($${dailyCost.toFixed(2)} / $${this.config.dailyLimit.toFixed(2)})`
        );
      }
    }

    if (this.config.monthlyLimit) {
      const monthlyPercent = monthlyCost / this.config.monthlyLimit;
      if (monthlyPercent >= this.config.alertThreshold) {
        console.warn(
          `Monthly cost alert: ${(monthlyPercent * 100).toFixed(1)}% of limit reached ($${monthlyCost.toFixed(2)} / $${this.config.monthlyLimit.toFixed(2)})`
        );
      }
    }
  }

  /**
   * Get percentage of budget used
   */
  getBudgetUsage(): {
    daily: { used: number; limit: number; percentage: number } | null;
    monthly: { used: number; limit: number; percentage: number } | null;
  } {
    const daily = this.config.dailyLimit
      ? {
          used: this.getDailyCost(),
          limit: this.config.dailyLimit,
          percentage: (this.getDailyCost() / this.config.dailyLimit) * 100,
        }
      : null;

    const monthly = this.config.monthlyLimit
      ? {
          used: this.getMonthlyCost(),
          limit: this.config.monthlyLimit,
          percentage: (this.getMonthlyCost() / this.config.monthlyLimit) * 100,
        }
      : null;

    return { daily, monthly };
  }

  /**
   * Clear all cost records
   */
  clear(): void {
    this.costs = [];
  }

  /**
   * Export cost data for analysis
   */
  export(): CostRecord[] {
    return [...this.costs];
  }
}
