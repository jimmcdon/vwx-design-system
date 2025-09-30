#!/usr/bin/env node

/**
 * Bundle Size Checker
 * Verifies that bundle sizes stay within acceptable limits
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BUNDLE_SIZE_LIMITS = {
  // Maximum bundle sizes in KB
  'packages/components/dist/index.js': 500,
  'packages/tokens/dist/index.js': 50,
  'packages/themes/dist/index.js': 100,
  'packages/utils/dist/index.js': 100,
};

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(2) + ' KB';
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return null;
  }
}

function getGzipSize(filePath) {
  try {
    const gzipSize = execSync(`gzip -c ${filePath} | wc -c`, {
      encoding: 'utf-8',
    });
    return parseInt(gzipSize.trim());
  } catch (error) {
    return null;
  }
}

function checkBundleSizes() {
  console.log(`\n${COLORS.blue}📦 Checking Bundle Sizes...${COLORS.reset}\n`);

  let hasError = false;
  const results = [];

  for (const [file, limitKB] of Object.entries(BUNDLE_SIZE_LIMITS)) {
    const filePath = path.join(process.cwd(), file);
    const size = getFileSize(filePath);

    if (size === null) {
      console.log(
        `${COLORS.yellow}⚠ File not found: ${file}${COLORS.reset}`
      );
      continue;
    }

    const gzipSize = getGzipSize(filePath);
    const sizeKB = size / 1024;
    const gzipSizeKB = gzipSize ? gzipSize / 1024 : null;
    const limitBytes = limitKB * 1024;
    const isOverLimit = size > limitBytes;

    if (isOverLimit) {
      hasError = true;
    }

    results.push({
      file,
      size,
      gzipSize,
      sizeKB,
      gzipSizeKB,
      limitKB,
      isOverLimit,
    });

    const status = isOverLimit
      ? `${COLORS.red}✗ OVER LIMIT${COLORS.reset}`
      : `${COLORS.green}✓ OK${COLORS.reset}`;

    const sizeDisplay = isOverLimit
      ? `${COLORS.red}${formatBytes(size)}${COLORS.reset}`
      : `${COLORS.green}${formatBytes(size)}${COLORS.reset}`;

    const gzipDisplay = gzipSizeKB
      ? ` (gzip: ${formatBytes(gzipSize)})`
      : '';

    console.log(
      `${status} ${file}\n   Size: ${sizeDisplay}${gzipDisplay} / Limit: ${limitKB} KB`
    );
  }

  console.log('');

  if (hasError) {
    console.log(
      `${COLORS.red}❌ Bundle size check failed. Some bundles exceed their limits.${COLORS.reset}\n`
    );
    process.exit(1);
  } else {
    console.log(
      `${COLORS.green}✅ All bundles are within size limits.${COLORS.reset}\n`
    );
    process.exit(0);
  }
}

// Calculate total bundle size
function calculateTotalSize() {
  let total = 0;
  let totalGzip = 0;

  for (const file of Object.keys(BUNDLE_SIZE_LIMITS)) {
    const filePath = path.join(process.cwd(), file);
    const size = getFileSize(filePath);
    const gzipSize = getGzipSize(filePath);

    if (size) total += size;
    if (gzipSize) totalGzip += gzipSize;
  }

  console.log(`\n${COLORS.blue}📊 Total Bundle Size${COLORS.reset}`);
  console.log(`   Raw: ${formatBytes(total)}`);
  console.log(`   Gzip: ${formatBytes(totalGzip)}\n`);
}

// Run checks
checkBundleSizes();
calculateTotalSize();
