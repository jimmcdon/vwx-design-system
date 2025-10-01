import { CostTracker } from '../router/CostTracker';

export interface BudgetAlert {
  level: 'warning' | 'critical';
  message: string;
  currentSpend: number;
  limit: number;
  percentage: number;
  timestamp: Date;
}

/**
 * Budget Management System
 *
 * Monitors spending and generates alerts when approaching limits
 */
export class BudgetManager {
  private costTracker: CostTracker;
  private alerts: BudgetAlert[] = [];
  private config: {
    dailyLimit?: number;
    monthlyLimit?: number;
    warningThreshold: number; // 0-1
    criticalThreshold: number; // 0-1
  };

  constructor(
    costTracker: CostTracker,
    config: {
      dailyLimit?: number;
      monthlyLimit?: number;
      warningThreshold?: number;
      criticalThreshold?: number;
    }
  ) {
    this.costTracker = costTracker;
    this.config = {
      dailyLimit: config.dailyLimit,
      monthlyLimit: config.monthlyLimit,
      warningThreshold: config.warningThreshold || 0.8,
      criticalThreshold: config.criticalThreshold || 0.95,
    };
  }

  /**
   * Check budget status and generate alerts if needed
   */
  checkBudget(): BudgetAlert[] {
    const newAlerts: BudgetAlert[] = [];
    const dailyCost = this.costTracker.getDailyCost();
    const monthlyCost = this.costTracker.getMonthlyCost();

    // Check daily budget
    if (this.config.dailyLimit) {
      const dailyPercent = dailyCost / this.config.dailyLimit;

      if (dailyPercent >= this.config.criticalThreshold) {
        newAlerts.push({
          level: 'critical',
          message: `Critical: Daily budget at ${(dailyPercent * 100).toFixed(1)}% of limit`,
          currentSpend: dailyCost,
          limit: this.config.dailyLimit,
          percentage: dailyPercent * 100,
          timestamp: new Date(),
        });
      } else if (dailyPercent >= this.config.warningThreshold) {
        newAlerts.push({
          level: 'warning',
          message: `Warning: Daily budget at ${(dailyPercent * 100).toFixed(1)}% of limit`,
          currentSpend: dailyCost,
          limit: this.config.dailyLimit,
          percentage: dailyPercent * 100,
          timestamp: new Date(),
        });
      }
    }

    // Check monthly budget
    if (this.config.monthlyLimit) {
      const monthlyPercent = monthlyCost / this.config.monthlyLimit;

      if (monthlyPercent >= this.config.criticalThreshold) {
        newAlerts.push({
          level: 'critical',
          message: `Critical: Monthly budget at ${(monthlyPercent * 100).toFixed(1)}% of limit`,
          currentSpend: monthlyCost,
          limit: this.config.monthlyLimit,
          percentage: monthlyPercent * 100,
          timestamp: new Date(),
        });
      } else if (monthlyPercent >= this.config.warningThreshold) {
        newAlerts.push({
          level: 'warning',
          message: `Warning: Monthly budget at ${(monthlyPercent * 100).toFixed(1)}% of limit`,
          currentSpend: monthlyCost,
          limit: this.config.monthlyLimit,
          percentage: monthlyPercent * 100,
          timestamp: new Date(),
        });
      }
    }

    // Store alerts
    this.alerts.push(...newAlerts);

    return newAlerts;
  }

  /**
   * Get remaining budget
   */
  getRemainingBudget(): {
    daily: { remaining: number; limit: number; percentage: number } | null;
    monthly: { remaining: number; limit: number; percentage: number } | null;
  } {
    const dailyCost = this.costTracker.getDailyCost();
    const monthlyCost = this.costTracker.getMonthlyCost();

    return {
      daily: this.config.dailyLimit
        ? {
            remaining: Math.max(0, this.config.dailyLimit - dailyCost),
            limit: this.config.dailyLimit,
            percentage: ((this.config.dailyLimit - dailyCost) / this.config.dailyLimit) * 100,
          }
        : null,
      monthly: this.config.monthlyLimit
        ? {
            remaining: Math.max(0, this.config.monthlyLimit - monthlyCost),
            limit: this.config.monthlyLimit,
            percentage:
              ((this.config.monthlyLimit - monthlyCost) / this.config.monthlyLimit) * 100,
          }
        : null,
    };
  }

  /**
   * Estimate if a task can fit within budget
   */
  canAffordTask(estimatedCost: number): {
    canAfford: boolean;
    reason?: string;
  } {
    const dailyCost = this.costTracker.getDailyCost();
    const monthlyCost = this.costTracker.getMonthlyCost();

    if (this.config.dailyLimit && dailyCost + estimatedCost > this.config.dailyLimit) {
      return {
        canAfford: false,
        reason: `Would exceed daily budget ($${(dailyCost + estimatedCost).toFixed(2)} > $${this.config.dailyLimit.toFixed(2)})`,
      };
    }

    if (
      this.config.monthlyLimit &&
      monthlyCost + estimatedCost > this.config.monthlyLimit
    ) {
      return {
        canAfford: false,
        reason: `Would exceed monthly budget ($${(monthlyCost + estimatedCost).toFixed(2)} > $${this.config.monthlyLimit.toFixed(2)})`,
      };
    }

    return { canAfford: true };
  }

  /**
   * Get all alerts
   */
  getAlerts(level?: 'warning' | 'critical'): BudgetAlert[] {
    if (level) {
      return this.alerts.filter((a) => a.level === level);
    }
    return [...this.alerts];
  }

  /**
   * Clear old alerts
   */
  clearAlerts(olderThan?: Date): void {
    if (olderThan) {
      this.alerts = this.alerts.filter((a) => a.timestamp >= olderThan);
    } else {
      this.alerts = [];
    }
  }

  /**
   * Get budget utilization summary
   */
  getSummary(): {
    daily: { spent: number; limit: number | null; remaining: number | null };
    monthly: { spent: number; limit: number | null; remaining: number | null };
    alertCount: { warning: number; critical: number };
  } {
    const dailyCost = this.costTracker.getDailyCost();
    const monthlyCost = this.costTracker.getMonthlyCost();

    return {
      daily: {
        spent: dailyCost,
        limit: this.config.dailyLimit || null,
        remaining: this.config.dailyLimit ? this.config.dailyLimit - dailyCost : null,
      },
      monthly: {
        spent: monthlyCost,
        limit: this.config.monthlyLimit || null,
        remaining: this.config.monthlyLimit ? this.config.monthlyLimit - monthlyCost : null,
      },
      alertCount: {
        warning: this.alerts.filter((a) => a.level === 'warning').length,
        critical: this.alerts.filter((a) => a.level === 'critical').length,
      },
    };
  }
}
