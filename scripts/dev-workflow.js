#!/usr/bin/env node
/**
 * Developer Workflow Automation for VWX Design System
 * Simplified version for common development tasks
 */

import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

// Available workflows
const workflows = {
  'quick-check': () => quickQualityCheck(),
  'full-check': () => fullQualityCheck(),
  'dev-setup': () => developmentSetup(),
  'clean-slate': () => cleanSlate(),
  'release-prep': () => prepareRelease()
};

// Get command from arguments
const command = process.argv[2];

if (!command || !workflows[command]) {
  console.log('🎯 VWX Design System Developer Workflow\n');
  console.log('Available commands:');
  console.log('  quick-check   - Run fast quality checks');
  console.log('  full-check    - Run comprehensive checks');
  console.log('  dev-setup     - Set up development environment');
  console.log('  clean-slate   - Clean and reinstall everything');
  console.log('  release-prep  - Prepare for release');
  console.log('\nUsage: node scripts/dev-workflow.js <command>');
  process.exit(1);
}

// Run the selected workflow
workflows[command]().catch((error) => {
  console.error('❌ Workflow failed:', error.message);
  process.exit(1);
});

async function quickQualityCheck() {
  console.log('⚡ Running quick quality checks...\n');
  
  await runCommand('pnpm typecheck', 'TypeScript check');
  await runCommand('pnpm lint', 'ESLint');
  await runCommand('pnpm format:check', 'Prettier check');
  await runCommand('pnpm test:unit --run', 'Unit tests');
  
  console.log('\n✅ All quick checks passed!');
}

async function fullQualityCheck() {
  console.log('🔍 Running comprehensive quality checks...\n');
  
  await quickQualityCheck();
  
  console.log('\n🔍 Running additional checks...');
  await runCommand('pnpm test:coverage', 'Coverage check');
  await runCommand('pnpm analyze:bundle', 'Bundle analysis');
  
  console.log('\n✅ All comprehensive checks passed!');
}

async function developmentSetup() {
  console.log('🛠️  Setting up development environment...\n');
  
  await runCommand('pnpm install', 'Installing dependencies');
  await runCommand('pnpm build:tokens', 'Building design tokens');
  await runCommand('pnpm prepare', 'Setting up git hooks');
  await runCommand('pnpm typecheck', 'Verifying setup');
  
  console.log('\n🎉 Development environment setup complete!');
  console.log('   🚀 You can now run:');
  console.log('   • pnpm storybook - Start Storybook');
  console.log('   • pnpm dev - Start development server');
  console.log('   • pnpm test:watch - Run tests in watch mode');
}

async function cleanSlate() {
  console.log('🧹 Cleaning up...\n');
  
  console.log('🗑️  Removing build artifacts and dependencies...');
  await runCommand('rm -rf node_modules packages/*/node_modules packages/*/dist apps/*/dist coverage .nyc_output', 'Cleaning');
  
  await runCommand('pnpm install', 'Fresh installation');
  await runCommand('pnpm build:tokens', 'Rebuilding tokens');
  
  console.log('\n✨ Clean slate complete!');
}

async function prepareRelease() {
  console.log('🚀 Preparing for release...\n');
  
  await fullQualityCheck();
  
  console.log('\n📦 Building all packages...');
  await runCommand('pnpm build', 'Building packages');
  
  console.log('\n🎉 Release preparation complete!');
  console.log('   Next steps:');
  console.log('   1. Review the generated reports');
  console.log('   2. Update version numbers');
  console.log('   3. Create release PR');
  console.log('   4. Tag release after merge');
}

async function runCommand(command, description) {
  console.log(`   ${description}...`);
  
  return new Promise((resolve, reject) => {
    const child = spawn('sh', ['-c', command], {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`   ✅ ${description} completed`);
        resolve();
      } else {
        reject(new Error(`${description} failed with exit code ${code}`));
      }
    });
  });
}