import { describe, it, expect, beforeEach } from 'vitest';
import { CostTracker } from '../../src/router/CostTracker';

describe('CostTracker', () => {
  let tracker: CostTracker;

  beforeEach(() => {
    tracker = new CostTracker({
      enabled: true,
      dailyLimit: 10.0,
      monthlyLimit: 100.0,
      alertThreshold: 0.8,
    });
  });

  describe('Budget Checks', () => {
    it('should allow requests when under budget', () => {
      expect(tracker.canProceed({})).toBe(true);
    });

    it('should block requests when daily limit exceeded', () => {
      // Record costs exceeding daily limit
      for (let i = 0; i < 11; i++) {
        tracker.record({
          cost: 1.0,
          provider: 'test',
          timestamp: new Date(),
        });
      }

      expect(tracker.canProceed({})).toBe(false);
    });

    it('should allow requests when tracking disabled', () => {
      const untracked = new CostTracker({ enabled: false });

      // Record high costs
      for (let i = 0; i < 100; i++) {
        untracked.record({
          cost: 10.0,
          provider: 'test',
          timestamp: new Date(),
        });
      }

      expect(untracked.canProceed({})).toBe(true);
    });
  });

  describe('Cost Recording', () => {
    it('should record costs', () => {
      tracker.record({
        cost: 1.5,
        provider: 'test',
        timestamp: new Date(),
      });

      expect(tracker.getDailyCost()).toBe(1.5);
    });

    it('should accumulate costs', () => {
      tracker.record({
        cost: 1.0,
        provider: 'test',
        timestamp: new Date(),
      });

      tracker.record({
        cost: 2.0,
        provider: 'test',
        timestamp: new Date(),
      });

      expect(tracker.getDailyCost()).toBe(3.0);
    });
  });

  describe('Cost Reporting', () => {
    it('should calculate daily cost', () => {
      const today = new Date();
      tracker.record({
        cost: 5.0,
        provider: 'test',
        timestamp: today,
      });

      expect(tracker.getDailyCost()).toBe(5.0);
    });

    it('should calculate monthly cost', () => {
      const thisMonth = new Date();
      tracker.record({
        cost: 10.0,
        provider: 'test',
        timestamp: thisMonth,
      });

      expect(tracker.getMonthlyCost()).toBe(10.0);
    });

    it('should report costs by provider', () => {
      tracker.record({
        cost: 1.0,
        provider: 'provider-1',
        timestamp: new Date(),
      });

      tracker.record({
        cost: 2.0,
        provider: 'provider-2',
        timestamp: new Date(),
      });

      const byProvider = tracker.getCostsByProvider();
      expect(byProvider['provider-1']).toBe(1.0);
      expect(byProvider['provider-2']).toBe(2.0);
    });

    it('should report costs by task type', () => {
      tracker.record({
        cost: 1.0,
        provider: 'test',
        timestamp: new Date(),
        taskType: 'prompt-generation',
      });

      tracker.record({
        cost: 2.0,
        provider: 'test',
        timestamp: new Date(),
        taskType: 'image-analysis',
      });

      const byType = tracker.getCostsByTaskType();
      expect(byType['prompt-generation']).toBe(1.0);
      expect(byType['image-analysis']).toBe(2.0);
    });
  });

  describe('Budget Usage', () => {
    it('should calculate budget usage percentage', () => {
      tracker.record({
        cost: 8.0,
        provider: 'test',
        timestamp: new Date(),
      });

      const usage = tracker.getBudgetUsage();
      expect(usage.daily?.percentage).toBe(80);
    });

    it('should show remaining budget', () => {
      tracker.record({
        cost: 3.0,
        provider: 'test',
        timestamp: new Date(),
      });

      const usage = tracker.getBudgetUsage();
      expect(usage.daily?.used).toBe(3.0);
      expect(usage.daily?.limit).toBe(10.0);
    });
  });

  describe('Cost History', () => {
    it('should return cost history for date range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const midMonth = new Date('2024-01-15');

      tracker.record({
        cost: 5.0,
        provider: 'test',
        timestamp: midMonth,
      });

      const history = tracker.getCostHistory(start, end);
      expect(history.length).toBe(1);
      expect(history[0].amount).toBe(5.0);
    });

    it('should filter history by date range', () => {
      const jan1 = new Date('2024-01-01');
      const jan15 = new Date('2024-01-15');
      const feb1 = new Date('2024-02-01');

      tracker.record({
        cost: 1.0,
        provider: 'test',
        timestamp: jan1,
      });

      tracker.record({
        cost: 2.0,
        provider: 'test',
        timestamp: feb1,
      });

      const history = tracker.getCostHistory(jan1, jan15);
      expect(history.length).toBe(1);
      expect(history[0].amount).toBe(1.0);
    });
  });

  describe('Data Management', () => {
    it('should clear all cost records', () => {
      tracker.record({
        cost: 5.0,
        provider: 'test',
        timestamp: new Date(),
      });

      expect(tracker.getDailyCost()).toBe(5.0);

      tracker.clear();

      expect(tracker.getDailyCost()).toBe(0);
    });

    it('should export cost data', () => {
      tracker.record({
        cost: 1.0,
        provider: 'test',
        timestamp: new Date(),
        taskType: 'prompt-generation',
      });

      const exported = tracker.export();
      expect(exported.length).toBe(1);
      expect(exported[0].amount).toBe(1.0);
    });
  });
});
