#!/usr/bin/env node
/**
 * Bundle Analysis Script for VWX Design System
 * Analyzes bundle sizes and provides optimization recommendations
 */

import { spawn } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const BUNDLE_SIZE_LIMITS = {
  '@vwx/tokens': 50 * 1024, // 50KB
  '@vwx/components': 500 * 1024, // 500KB
  '@vwx/themes': 100 * 1024, // 100KB
  '@vwx/utils': 100 * 1024, // 100KB
};

async function analyzeBundles() {
  console.log('🔍 Analyzing bundle sizes...\n');

  const results = {};
  const warnings = [];
  const errors = [];

  // Build all packages first
  console.log('📦 Building packages...');
  await runCommand('pnpm', ['build']);

  // Analyze each package
  for (const [packageName, limit] of Object.entries(BUNDLE_SIZE_LIMITS)) {
    console.log(`\n📊 Analyzing ${packageName}...`);
    
    const packagePath = join(process.cwd(), 'packages', packageName.split('/')[1]);
    const distPath = join(packagePath, 'dist');
    
    if (!existsSync(distPath)) {
      warnings.push(`⚠️  No dist folder found for ${packageName}`);
      continue;
    }

    try {
      // Get bundle size using bundlesize
      const size = await getBundleSize(distPath);
      results[packageName] = {
        size,
        limit,
        withinLimit: size <= limit,
        utilization: ((size / limit) * 100).toFixed(1)
      };

      // Log results
      const status = size <= limit ? '✅' : '❌';
      const sizeKB = (size / 1024).toFixed(1);
      const limitKB = (limit / 1024).toFixed(1);
      
      console.log(`${status} ${packageName}: ${sizeKB}KB / ${limitKB}KB (${results[packageName].utilization}%)`);
      
      if (size > limit) {
        errors.push(`Bundle size exceeded for ${packageName}: ${sizeKB}KB > ${limitKB}KB`);
      }

    } catch (error) {
      warnings.push(`⚠️  Could not analyze ${packageName}: ${error.message}`);
    }
  }

  // Generate detailed report
  const report = generateReport(results, warnings, errors);
  writeFileSync('bundle-analysis-report.json', JSON.stringify(report, null, 2));
  
  // Print summary
  console.log('\n📋 Bundle Analysis Summary:');
  console.log(`✅ Passed: ${Object.values(results).filter(r => r.withinLimit).length}`);
  console.log(`❌ Failed: ${Object.values(results).filter(r => !r.withinLimit).length}`);
  console.log(`⚠️  Warnings: ${warnings.length}`);
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(warning => console.log(`   ${warning}`));
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(error => console.log(`   ${error}`));
    process.exit(1);
  }
  
  console.log('\n📄 Detailed report saved to: bundle-analysis-report.json');
  
  // Suggest optimizations
  suggestOptimizations(results);
}

async function getBundleSize(distPath) {
  // Simple file size calculation - in real implementation would use bundlesize
  const { execSync } = require('child_process');
  const output = execSync(`du -sb ${distPath}`, { encoding: 'utf8' });
  return parseInt(output.split('\t')[0]);
}

async function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit' });
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

function generateReport(results, warnings, errors) {
  return {
    timestamp: new Date().toISOString(),
    summary: {
      total_packages: Object.keys(BUNDLE_SIZE_LIMITS).length,
      analyzed: Object.keys(results).length,
      passed: Object.values(results).filter(r => r.withinLimit).length,
      failed: Object.values(results).filter(r => !r.withinLimit).length,
      warnings: warnings.length,
      errors: errors.length
    },
    results,
    warnings,
    errors,
    recommendations: generateRecommendations(results)
  };
}

function generateRecommendations(results) {
  const recommendations = [];
  
  for (const [packageName, data] of Object.entries(results)) {
    if (!data.withinLimit) {
      recommendations.push({
        package: packageName,
        issue: 'Bundle size exceeded',
        suggestions: [
          'Review imported dependencies for unused code',
          'Use tree-shaking to eliminate dead code',
          'Consider code splitting for large components',
          'Optimize asset imports (images, fonts)',
          'Use dynamic imports for optional functionality'
        ]
      });
    } else if (data.utilization > 80) {
      recommendations.push({
        package: packageName,
        issue: 'Approaching bundle size limit',
        suggestions: [
          'Monitor bundle size in future changes',
          'Consider proactive optimization',
          'Review dependency usage'
        ]
      });
    }
  }
  
  return recommendations;
}

function suggestOptimizations(results) {
  console.log('\n💡 Optimization Suggestions:');
  
  const highUtilization = Object.entries(results)
    .filter(([_, data]) => data.utilization > 70)
    .sort((a, b) => b[1].utilization - a[1].utilization);
  
  if (highUtilization.length === 0) {
    console.log('   🎉 All packages are well within their bundle size limits!');
    return;
  }
  
  highUtilization.forEach(([packageName, data]) => {
    console.log(`\n   📦 ${packageName} (${data.utilization}% of limit):`);
    
    if (data.utilization > 90) {
      console.log('     🚨 Critical: Consider immediate optimization');
    } else if (data.utilization > 80) {
      console.log('     ⚠️  Warning: Monitor closely');
    } else {
      console.log('     ℹ️  Info: Room for improvement');
    }
    
    console.log('     • Review unused imports');
    console.log('     • Optimize asset usage');
    console.log('     • Consider dynamic imports');
  });
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeBundles().catch(console.error);
}