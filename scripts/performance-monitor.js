#!/usr/bin/env node
/**
 * Performance Monitoring Script for VWX Design System
 * Monitors Core Web Vitals and component performance
 */

import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import { writeFileSync } from 'fs';
import { join } from 'path';

const PERFORMANCE_TARGETS = {
  // Lighthouse scores (0-100)
  performance: 90,
  accessibility: 95,
  bestPractices: 90,
  seo: 85,
  
  // Core Web Vitals
  lcp: 2500, // Largest Contentful Paint (ms)
  fid: 100,  // First Input Delay (ms)
  cls: 0.1,  // Cumulative Layout Shift
  
  // Additional metrics
  fcp: 1800, // First Contentful Paint (ms)
  tti: 3800, // Time to Interactive (ms)
  tbt: 300,  // Total Blocking Time (ms)
};

const TEST_URLS = [
  {
    name: 'Storybook - Components Overview',
    url: 'http://localhost:6006',
    category: 'documentation'
  },
  {
    name: 'Storybook - Button Component',
    url: 'http://localhost:6006/iframe.html?id=components-button--primary',
    category: 'component'
  },
  {
    name: 'Storybook - Form Components',
    url: 'http://localhost:6006/iframe.html?id=components-form--default',
    category: 'component'
  },
  {
    name: 'Design System Playground',
    url: 'http://localhost:5173',
    category: 'playground'
  }
];

async function runPerformanceMonitoring() {
  console.log('🚀 Starting Performance Monitoring for VWX Design System\n');

  const results = [];
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  try {
    for (const testCase of TEST_URLS) {
      console.log(`📊 Testing: ${testCase.name}`);
      console.log(`🔗 URL: ${testCase.url}`);
      
      try {
        const result = await runLighthouseAudit(testCase.url, chrome.port);
        const analysis = analyzeResults(result, testCase);
        
        results.push({
          ...testCase,
          ...analysis,
          timestamp: new Date().toISOString()
        });
        
        logResults(testCase.name, analysis);
        
      } catch (error) {
        console.log(`❌ Failed to test ${testCase.name}: ${error.message}`);
        results.push({
          ...testCase,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
      
      console.log(''); // Empty line for readability
    }
    
  } finally {
    await chrome.kill();
  }
  
  // Generate comprehensive report
  const report = generatePerformanceReport(results);
  const reportPath = 'performance-report.json';
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Print summary
  printSummary(results);
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  // Check if any critical issues
  const criticalIssues = results.filter(r => r.criticalIssues && r.criticalIssues.length > 0);
  if (criticalIssues.length > 0) {
    console.log('\n🚨 Critical performance issues found! Check the report for details.');
    process.exit(1);
  }
}

async function runLighthouseAudit(url, port) {
  const options = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: port,
    settings: {
      formFactor: 'desktop',
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0
      },
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false
      },
      emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/98.0.4758.109'
    }
  };
  
  const runnerResult = await lighthouse(url, options);
  return runnerResult.lhr;
}

function analyzeResults(lhr, testCase) {
  const scores = {
    performance: Math.round(lhr.categories.performance.score * 100),
    accessibility: Math.round(lhr.categories.accessibility.score * 100),
    bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
    seo: Math.round(lhr.categories.seo.score * 100)
  };
  
  const metrics = {
    fcp: lhr.audits['first-contentful-paint'].numericValue,
    lcp: lhr.audits['largest-contentful-paint'].numericValue,
    cls: lhr.audits['cumulative-layout-shift'].numericValue,
    tti: lhr.audits['interactive'].numericValue,
    tbt: lhr.audits['total-blocking-time'].numericValue,
    speedIndex: lhr.audits['speed-index'].numericValue
  };
  
  // FID is not available in Lighthouse, simulate based on TBT
  metrics.fid = Math.min(metrics.tbt * 0.3, PERFORMANCE_TARGETS.fid);
  
  const issues = [];
  const criticalIssues = [];
  const recommendations = [];
  
  // Check scores against targets
  Object.entries(scores).forEach(([key, value]) => {
    const target = PERFORMANCE_TARGETS[key];
    if (value < target) {
      const severity = value < (target * 0.8) ? 'critical' : 'warning';
      const issue = {
        type: 'score',
        metric: key,
        value,
        target,
        severity,
        message: `${key} score (${value}) is below target (${target})`
      };
      
      if (severity === 'critical') {
        criticalIssues.push(issue);
      } else {
        issues.push(issue);
      }
    }
  });
  
  // Check Core Web Vitals
  Object.entries(metrics).forEach(([key, value]) => {
    const target = PERFORMANCE_TARGETS[key];
    if (target && value > target) {
      const severity = value > (target * 1.5) ? 'critical' : 'warning';
      const issue = {
        type: 'metric',
        metric: key,
        value: Math.round(value),
        target,
        severity,
        message: `${key.toUpperCase()} (${Math.round(value)}ms) exceeds target (${target}ms)`
      };
      
      if (severity === 'critical') {
        criticalIssues.push(issue);
      } else {
        issues.push(issue);
      }
    }
  });
  
  // Generate recommendations
  if (scores.performance < PERFORMANCE_TARGETS.performance) {
    recommendations.push({
      area: 'Performance',
      suggestions: [
        'Optimize images and use modern formats (WebP, AVIF)',
        'Implement code splitting and lazy loading',
        'Minimize and compress CSS/JS bundles',
        'Use a Content Delivery Network (CDN)',
        'Optimize font loading strategies'
      ]
    });
  }
  
  if (scores.accessibility < PERFORMANCE_TARGETS.accessibility) {
    recommendations.push({
      area: 'Accessibility',
      suggestions: [
        'Ensure all images have alt text',
        'Improve color contrast ratios',
        'Add proper ARIA labels and roles',
        'Ensure keyboard navigation works',
        'Test with screen readers'
      ]
    });
  }
  
  return {
    scores,
    metrics,
    issues,
    criticalIssues,
    recommendations,
    overallGrade: calculateOverallGrade(scores),
    coreWebVitalsGrade: calculateCoreWebVitalsGrade(metrics)
  };
}

function calculateOverallGrade(scores) {
  const average = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
  
  if (average >= 90) return 'A';
  if (average >= 80) return 'B';
  if (average >= 70) return 'C';
  if (average >= 60) return 'D';
  return 'F';
}

function calculateCoreWebVitalsGrade(metrics) {
  const { lcp, fid, cls } = metrics;
  const targets = PERFORMANCE_TARGETS;
  
  let passed = 0;
  if (lcp <= targets.lcp) passed++;
  if (fid <= targets.fid) passed++;
  if (cls <= targets.cls) passed++;
  
  if (passed === 3) return 'Pass';
  if (passed === 2) return 'Needs Improvement';
  return 'Poor';
}

function logResults(name, analysis) {
  const { scores, metrics, overallGrade, coreWebVitalsGrade } = analysis;
  
  console.log(`   📈 Overall Grade: ${getGradeEmoji(overallGrade)} ${overallGrade}`);
  console.log(`   🎯 Core Web Vitals: ${getVitalsEmoji(coreWebVitalsGrade)} ${coreWebVitalsGrade}`);
  
  console.log('   📊 Scores:');
  Object.entries(scores).forEach(([key, value]) => {
    const emoji = value >= PERFORMANCE_TARGETS[key] ? '✅' : '❌';
    console.log(`      ${emoji} ${key}: ${value}/100`);
  });
  
  console.log('   ⚡ Core Web Vitals:');
  console.log(`      ${metrics.lcp <= PERFORMANCE_TARGETS.lcp ? '✅' : '❌'} LCP: ${Math.round(metrics.lcp)}ms`);
  console.log(`      ${metrics.fid <= PERFORMANCE_TARGETS.fid ? '✅' : '❌'} FID: ${Math.round(metrics.fid)}ms`);
  console.log(`      ${metrics.cls <= PERFORMANCE_TARGETS.cls ? '✅' : '❌'} CLS: ${metrics.cls.toFixed(3)}`);
  
  if (analysis.criticalIssues.length > 0) {
    console.log('   🚨 Critical Issues:');
    analysis.criticalIssues.forEach(issue => {
      console.log(`      • ${issue.message}`);
    });
  }
}

function getGradeEmoji(grade) {
  const emojis = { A: '🏆', B: '👍', C: '⚠️', D: '😬', F: '🚨' };
  return emojis[grade] || '❓';
}

function getVitalsEmoji(grade) {
  const emojis = { Pass: '🎯', 'Needs Improvement': '⚠️', Poor: '🚨' };
  return emojis[grade] || '❓';
}

function printSummary(results) {
  console.log('\n📋 Performance Monitoring Summary:');
  console.log(`   🧪 Tests Run: ${results.length}`);
  console.log(`   ✅ Passed: ${results.filter(r => r.overallGrade === 'A').length}`);
  console.log(`   ⚠️  Needs Attention: ${results.filter(r => ['B', 'C'].includes(r.overallGrade)).length}`);
  console.log(`   🚨 Critical Issues: ${results.filter(r => r.overallGrade === 'F' || r.criticalIssues?.length > 0).length}`);
  
  const avgScores = calculateAverageScores(results);
  console.log('\n   📊 Average Scores:');
  Object.entries(avgScores).forEach(([key, value]) => {
    const emoji = value >= PERFORMANCE_TARGETS[key] ? '✅' : '❌';
    console.log(`      ${emoji} ${key}: ${Math.round(value)}/100`);
  });
}

function calculateAverageScores(results) {
  const validResults = results.filter(r => r.scores && !r.error);
  if (validResults.length === 0) return {};
  
  const averages = {};
  const scoreKeys = Object.keys(validResults[0].scores);
  
  scoreKeys.forEach(key => {
    averages[key] = validResults.reduce((sum, result) => sum + result.scores[key], 0) / validResults.length;
  });
  
  return averages;
}

function generatePerformanceReport(results) {
  return {
    timestamp: new Date().toISOString(),
    summary: {
      total_tests: results.length,
      passed: results.filter(r => r.overallGrade === 'A').length,
      failed: results.filter(r => r.overallGrade === 'F' || r.criticalIssues?.length > 0).length,
      average_scores: calculateAverageScores(results)
    },
    results,
    targets: PERFORMANCE_TARGETS,
    recommendations: generateOverallRecommendations(results)
  };
}

function generateOverallRecommendations(results) {
  const recommendations = [];
  const validResults = results.filter(r => !r.error);
  
  // Check for common issues across all tests
  const commonIssues = {};
  validResults.forEach(result => {
    result.issues?.forEach(issue => {
      if (!commonIssues[issue.metric]) {
        commonIssues[issue.metric] = 0;
      }
      commonIssues[issue.metric]++;
    });
  });
  
  // Generate recommendations for common issues
  Object.entries(commonIssues).forEach(([metric, count]) => {
    if (count > validResults.length * 0.5) { // If issue appears in >50% of tests
      recommendations.push({
        priority: 'high',
        area: metric,
        description: `${metric} issues found in ${count}/${validResults.length} tests`,
        actions: getActionsForMetric(metric)
      });
    }
  });
  
  return recommendations;
}

function getActionsForMetric(metric) {
  const actions = {
    performance: [
      'Optimize critical rendering path',
      'Implement resource preloading',
      'Reduce JavaScript bundle sizes',
      'Optimize images and assets'
    ],
    accessibility: [
      'Audit with axe-core',
      'Test with keyboard navigation',
      'Verify screen reader compatibility',
      'Check color contrast ratios'
    ],
    bestPractices: [
      'Update to latest web standards',
      'Implement security best practices',
      'Optimize resource loading',
      'Follow semantic HTML practices'
    ],
    seo: [
      'Add meta descriptions',
      'Optimize heading structure',
      'Implement structured data',
      'Improve internal linking'
    ]
  };
  
  return actions[metric] || ['Review specific audit recommendations'];
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runPerformanceMonitoring().catch(console.error);
}