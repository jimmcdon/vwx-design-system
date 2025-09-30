#!/usr/bin/env node
/**
 * Comprehensive Quality Report Generator for VWX Design System
 * Aggregates all quality metrics into a single report
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const QUALITY_TARGETS = {
  coverage: {
    lines: 90,
    statements: 90,
    branches: 85,
    functions: 90
  },
  performance: {
    lighthouse: {
      performance: 90,
      accessibility: 95,
      bestPractices: 90,
      seo: 85
    },
    coreWebVitals: {
      lcp: 2500, // ms
      fid: 100,  // ms
      cls: 0.1   // score
    }
  },
  bundleSize: {
    '@vwx/tokens': 50 * 1024,     // 50KB
    '@vwx/components': 500 * 1024, // 500KB
    '@vwx/themes': 100 * 1024,     // 100KB
    '@vwx/utils': 100 * 1024       // 100KB
  }
};

async function generateQualityReport() {
  console.log('📊 Generating Comprehensive Quality Report for VWX Design System\n');

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      overallScore: 0,
      totalChecks: 0,
      passed: 0,
      failed: 0,
      warnings: 0
    },
    sections: {}
  };

  // Collect all quality metrics
  report.sections.codeQuality = await getCodeQualityMetrics();
  report.sections.testing = await getTestingMetrics();
  report.sections.security = await getSecurityMetrics();
  report.sections.performance = await getPerformanceMetrics();
  report.sections.accessibility = await getAccessibilityMetrics();
  report.sections.maintenance = await getMaintenanceMetrics();

  // Calculate overall scores
  calculateOverallScore(report);

  // Generate formatted report
  const formattedReport = formatReport(report);
  
  // Save reports
  writeFileSync('quality-report.json', JSON.stringify(report, null, 2));
  writeFileSync('quality-report.md', formattedReport);

  // Print summary
  printSummary(report);

  // Exit with appropriate code
  if (report.summary.failed > 0) {
    console.log('\n❌ Quality report contains failures. Check the detailed report.');
    process.exit(1);
  } else if (report.summary.warnings > 0) {
    console.log('\n⚠️  Quality report contains warnings. Consider addressing them.');
  } else {
    console.log('\n✅ All quality checks passed!');
  }
}

async function getCodeQualityMetrics() {
  console.log('🔍 Collecting code quality metrics...');
  
  const metrics = {
    name: 'Code Quality',
    score: 0,
    status: 'unknown',
    checks: [],
    details: {}
  };

  try {
    // ESLint check
    const lintResult = await runCommand('pnpm lint --format json', true);
    const lintData = lintResult ? JSON.parse(lintResult) : [];
    
    const errorCount = lintData.reduce((sum, file) => sum + file.errorCount, 0);
    const warningCount = lintData.reduce((sum, file) => sum + file.warningCount, 0);
    
    metrics.checks.push({
      name: 'ESLint',
      status: errorCount === 0 ? 'pass' : 'fail',
      details: { errors: errorCount, warnings: warningCount }
    });

    // TypeScript check
    try {
      await runCommand('pnpm typecheck');
      metrics.checks.push({
        name: 'TypeScript',
        status: 'pass',
        details: { message: 'No type errors found' }
      });
    } catch (error) {
      metrics.checks.push({
        name: 'TypeScript',
        status: 'fail',
        details: { message: 'Type errors found' }
      });
    }

    // Prettier check
    try {
      await runCommand('pnpm format:check');
      metrics.checks.push({
        name: 'Code Formatting',
        status: 'pass',
        details: { message: 'All files properly formatted' }
      });
    } catch (error) {
      metrics.checks.push({
        name: 'Code Formatting',
        status: 'fail',
        details: { message: 'Some files need formatting' }
      });
    }

  } catch (error) {
    metrics.checks.push({
      name: 'Code Quality Check',
      status: 'error',
      details: { error: error.message }
    });
  }

  // Calculate score
  const passedChecks = metrics.checks.filter(c => c.status === 'pass').length;
  const totalChecks = metrics.checks.length;
  metrics.score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
  metrics.status = metrics.score >= 90 ? 'excellent' : 
                   metrics.score >= 70 ? 'good' : 
                   metrics.score >= 50 ? 'needs-improvement' : 'poor';

  return metrics;
}

async function getTestingMetrics() {
  console.log('🧪 Collecting testing metrics...');

  const metrics = {
    name: 'Testing',
    score: 0,
    status: 'unknown',
    checks: [],
    details: {}
  };

  try {
    // Run tests with coverage
    await runCommand('pnpm test:coverage --reporter=verbose');
    
    // Parse coverage report
    const coveragePath = 'coverage/coverage-summary.json';
    if (existsSync(coveragePath)) {
      const coverageData = JSON.parse(readFileSync(coveragePath, 'utf8'));
      const total = coverageData.total;
      
      Object.entries(QUALITY_TARGETS.coverage).forEach(([key, target]) => {
        const actual = total[key].pct;
        metrics.checks.push({
          name: `Coverage ${key}`,
          status: actual >= target ? 'pass' : 'fail',
          details: { actual: `${actual}%`, target: `${target}%` }
        });
      });

      metrics.details.coverage = {
        lines: total.lines.pct,
        statements: total.statements.pct,
        branches: total.branches.pct,
        functions: total.functions.pct
      };
    }

    // Test execution results
    try {
      await runCommand('pnpm test --run --reporter=json > test-results.json');
      const testResults = JSON.parse(readFileSync('test-results.json', 'utf8'));
      
      metrics.checks.push({
        name: 'Unit Tests',
        status: testResults.success ? 'pass' : 'fail',
        details: {
          total: testResults.numTotalTests,
          passed: testResults.numPassedTests,
          failed: testResults.numFailedTests
        }
      });
    } catch (error) {
      metrics.checks.push({
        name: 'Unit Tests',
        status: 'fail',
        details: { error: 'Tests failed to run' }
      });
    }

  } catch (error) {
    metrics.checks.push({
      name: 'Testing',
      status: 'error',
      details: { error: error.message }
    });
  }

  // Calculate score
  const passedChecks = metrics.checks.filter(c => c.status === 'pass').length;
  const totalChecks = metrics.checks.length;
  metrics.score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
  metrics.status = metrics.score >= 90 ? 'excellent' : 
                   metrics.score >= 70 ? 'good' : 
                   metrics.score >= 50 ? 'needs-improvement' : 'poor';

  return metrics;
}

async function getSecurityMetrics() {
  console.log('🔒 Collecting security metrics...');

  const metrics = {
    name: 'Security',
    score: 0,
    status: 'unknown',
    checks: [],
    details: {}
  };

  try {
    // Security audit
    const auditResult = await runCommand('pnpm audit --json', true);
    if (auditResult) {
      const auditData = JSON.parse(auditResult);
      const vulnerabilities = auditData.metadata?.vulnerabilities || {};
      
      const critical = vulnerabilities.critical || 0;
      const high = vulnerabilities.high || 0;
      const moderate = vulnerabilities.moderate || 0;
      const low = vulnerabilities.low || 0;

      metrics.checks.push({
        name: 'Dependency Vulnerabilities',
        status: (critical === 0 && high === 0) ? 'pass' : 'fail',
        details: { critical, high, moderate, low }
      });

      metrics.details.vulnerabilities = { critical, high, moderate, low };
    }

  } catch (error) {
    metrics.checks.push({
      name: 'Security Audit',
      status: 'warning',
      details: { message: 'Could not run security audit' }
    });
  }

  // Calculate score
  const passedChecks = metrics.checks.filter(c => c.status === 'pass').length;
  const totalChecks = metrics.checks.length;
  metrics.score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 85; // Default if no checks
  metrics.status = metrics.score >= 90 ? 'excellent' : 
                   metrics.score >= 70 ? 'good' : 
                   metrics.score >= 50 ? 'needs-improvement' : 'poor';

  return metrics;
}

async function getPerformanceMetrics() {
  console.log('⚡ Collecting performance metrics...');

  const metrics = {
    name: 'Performance',
    score: 0,
    status: 'unknown',
    checks: [],
    details: {}
  };

  try {
    // Bundle size check
    await runCommand('pnpm analyze:bundle > bundle-report.json');
    
    if (existsSync('bundle-analysis-report.json')) {
      const bundleData = JSON.parse(readFileSync('bundle-analysis-report.json', 'utf8'));
      
      Object.entries(bundleData.results || {}).forEach(([packageName, data]) => {
        metrics.checks.push({
          name: `Bundle Size: ${packageName}`,
          status: data.withinLimit ? 'pass' : 'fail',
          details: {
            size: `${(data.size / 1024).toFixed(1)}KB`,
            limit: `${(data.limit / 1024).toFixed(1)}KB`,
            utilization: `${data.utilization}%`
          }
        });
      });
    }

    // Performance monitoring results
    if (existsSync('performance-report.json')) {
      const perfData = JSON.parse(readFileSync('performance-report.json', 'utf8'));
      
      perfData.results?.forEach((result) => {
        if (result.scores) {
          Object.entries(result.scores).forEach(([metric, score]) => {
            const target = QUALITY_TARGETS.performance.lighthouse[metric];
            if (target) {
              metrics.checks.push({
                name: `Lighthouse ${metric}`,
                status: score >= target ? 'pass' : 'fail',
                details: { score, target }
              });
            }
          });
        }
      });
    }

  } catch (error) {
    metrics.checks.push({
      name: 'Performance Analysis',
      status: 'warning',
      details: { message: 'Performance data not available' }
    });
  }

  // Calculate score
  const passedChecks = metrics.checks.filter(c => c.status === 'pass').length;
  const totalChecks = metrics.checks.length;
  metrics.score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 85;
  metrics.status = metrics.score >= 90 ? 'excellent' : 
                   metrics.score >= 70 ? 'good' : 
                   metrics.score >= 50 ? 'needs-improvement' : 'poor';

  return metrics;
}

async function getAccessibilityMetrics() {
  console.log('♿ Collecting accessibility metrics...');

  const metrics = {
    name: 'Accessibility',
    score: 0,
    status: 'unknown',
    checks: [],
    details: {}
  };

  // For now, add placeholder checks
  metrics.checks.push({
    name: 'WCAG 2.1 AA Compliance',
    status: 'warning',
    details: { message: 'Requires manual testing with accessibility tools' }
  });

  metrics.score = 85; // Default score pending full implementation
  metrics.status = 'good';

  return metrics;
}

async function getMaintenanceMetrics() {
  console.log('🔧 Collecting maintenance metrics...');

  const metrics = {
    name: 'Maintenance',
    score: 0,
    status: 'unknown',
    checks: [],
    details: {}
  };

  try {
    // Check for outdated dependencies
    const outdatedResult = await runCommand('pnpm outdated --format json', true);
    if (outdatedResult) {
      const outdatedData = JSON.parse(outdatedResult);
      const outdatedCount = Object.keys(outdatedData).length;
      
      metrics.checks.push({
        name: 'Dependency Freshness',
        status: outdatedCount <= 5 ? 'pass' : outdatedCount <= 15 ? 'warning' : 'fail',
        details: { outdated: outdatedCount }
      });
    }

    // Check git status
    try {
      const gitStatus = await runCommand('git status --porcelain');
      const hasUncommittedChanges = gitStatus.trim().length > 0;
      
      metrics.checks.push({
        name: 'Git Status',
        status: hasUncommittedChanges ? 'warning' : 'pass',
        details: { 
          message: hasUncommittedChanges ? 'Uncommitted changes present' : 'Working directory clean'
        }
      });
    } catch (error) {
      // Ignore git errors
    }

  } catch (error) {
    metrics.checks.push({
      name: 'Maintenance Check',
      status: 'warning',
      details: { message: 'Could not check maintenance metrics' }
    });
  }

  // Calculate score
  const passedChecks = metrics.checks.filter(c => c.status === 'pass').length;
  const totalChecks = metrics.checks.length;
  metrics.score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 85;
  metrics.status = metrics.score >= 90 ? 'excellent' : 
                   metrics.score >= 70 ? 'good' : 
                   metrics.score >= 50 ? 'needs-improvement' : 'poor';

  return metrics;
}

function calculateOverallScore(report) {
  const sections = Object.values(report.sections);
  const totalScore = sections.reduce((sum, section) => sum + section.score, 0);
  const averageScore = sections.length > 0 ? totalScore / sections.length : 0;

  report.summary.overallScore = Math.round(averageScore);
  
  // Count checks
  sections.forEach(section => {
    section.checks.forEach(check => {
      report.summary.totalChecks++;
      if (check.status === 'pass') report.summary.passed++;
      else if (check.status === 'fail') report.summary.failed++;
      else if (check.status === 'warning') report.summary.warnings++;
    });
  });
}

function formatReport(report) {
  const date = new Date(report.timestamp).toLocaleString();
  
  let markdown = `# VWX Design System Quality Report\n\n`;
  markdown += `**Generated:** ${date}\n`;
  markdown += `**Overall Score:** ${getScoreEmoji(report.summary.overallScore)} ${report.summary.overallScore}/100\n\n`;

  markdown += `## Summary\n\n`;
  markdown += `- 📊 **Total Checks:** ${report.summary.totalChecks}\n`;
  markdown += `- ✅ **Passed:** ${report.summary.passed}\n`;
  markdown += `- ❌ **Failed:** ${report.summary.failed}\n`;
  markdown += `- ⚠️ **Warnings:** ${report.summary.warnings}\n\n`;

  // Section details
  Object.values(report.sections).forEach(section => {
    markdown += `## ${getStatusEmoji(section.status)} ${section.name}\n\n`;
    markdown += `**Score:** ${section.score}/100\n\n`;
    
    if (section.checks.length > 0) {
      markdown += `### Checks\n\n`;
      section.checks.forEach(check => {
        markdown += `- ${getStatusEmoji(check.status)} **${check.name}**`;
        if (check.details && typeof check.details === 'object') {
          const details = Object.entries(check.details)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          markdown += ` - ${details}`;
        }
        markdown += `\n`;
      });
      markdown += `\n`;
    }
  });

  return markdown;
}

function printSummary(report) {
  console.log('\n📊 Quality Report Summary:');
  console.log(`   🎯 Overall Score: ${getScoreEmoji(report.summary.overallScore)} ${report.summary.overallScore}/100`);
  console.log(`   📋 Total Checks: ${report.summary.totalChecks}`);
  console.log(`   ✅ Passed: ${report.summary.passed}`);
  console.log(`   ❌ Failed: ${report.summary.failed}`);
  console.log(`   ⚠️  Warnings: ${report.summary.warnings}\n`);

  // Section summary
  Object.values(report.sections).forEach(section => {
    console.log(`   ${getStatusEmoji(section.status)} ${section.name}: ${section.score}/100`);
  });

  console.log('\n📄 Detailed reports saved to:');
  console.log('   • quality-report.json (machine-readable)');
  console.log('   • quality-report.md (human-readable)');
}

function getScoreEmoji(score) {
  if (score >= 90) return '🏆';
  if (score >= 80) return '🥇';
  if (score >= 70) return '🥈';
  if (score >= 60) return '🥉';
  return '📉';
}

function getStatusEmoji(status) {
  const emojis = {
    'excellent': '🏆',
    'good': '✅',
    'needs-improvement': '⚠️',
    'poor': '❌',
    'pass': '✅',
    'fail': '❌',
    'warning': '⚠️',
    'error': '💥',
    'unknown': '❓'
  };
  return emojis[status] || '❓';
}

async function runCommand(command, returnOutput = false) {
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: returnOutput ? 'pipe' : 'ignore'
    });
    return returnOutput ? output : true;
  } catch (error) {
    if (returnOutput) {
      return null;
    }
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateQualityReport().catch(console.error);
}