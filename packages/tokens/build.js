const StyleDictionary = require('style-dictionary');
const fs = require('fs');
const path = require('path');

// Custom format for CSS custom properties
StyleDictionary.registerFormat({
  name: 'css/variables-theme',
  formatter: function ({ dictionary, options }) {
    const selector = options.selector || ':root';
    return `${selector} {\n${dictionary.allProperties
      .map(prop => `  --${prop.name}: ${prop.value};`)
      .join('\n')}\n}\n`;
  }
});

// Custom transform for name formatting
StyleDictionary.registerTransform({
  name: 'name/cti/kebab-theme',
  type: 'name',
  transformer: function(prop) {
    return prop.path.join('-');
  }
});

// Register transform group
StyleDictionary.registerTransformGroup({
  name: 'css/theme',
  transforms: ['attribute/cti', 'name/cti/kebab-theme', 'size/rem', 'color/css']
});

// Build configuration for base tokens
const buildBase = StyleDictionary.extend({
  source: ['src/base/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css/theme',
      buildPath: 'dist/css/',
      files: [{
        destination: 'base.css',
        format: 'css/variables-theme',
        options: {
          selector: ':root'
        }
      }]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [{
        destination: 'base.js',
        format: 'javascript/es6'
      }]
    }
  }
});

// Build configuration for B&W theme
const buildBW = StyleDictionary.extend({
  source: ['src/base/**/*.json', 'src/themes/bw.json'],
  platforms: {
    css: {
      transformGroup: 'css/theme',
      buildPath: 'dist/css/themes/',
      files: [{
        destination: 'bw.css',
        format: 'css/variables-theme',
        options: {
          selector: '[data-theme="bw"], .theme-bw'
        }
      }]
    }
  }
});

// Build configuration for Color theme
const buildColor = StyleDictionary.extend({
  source: ['src/base/**/*.json', 'src/themes/color.json'],
  platforms: {
    css: {
      transformGroup: 'css/theme',
      buildPath: 'dist/css/themes/',
      files: [{
        destination: 'color.css',
        format: 'css/variables-theme',
        options: {
          selector: '[data-theme="color"], .theme-color'
        }
      }]
    }
  }
});

// Build configuration for Patina theme
const buildPatina = StyleDictionary.extend({
  source: ['src/base/**/*.json', 'src/themes/patina.json'],
  platforms: {
    css: {
      transformGroup: 'css/theme',
      buildPath: 'dist/css/themes/',
      files: [{
        destination: 'patina.css',
        format: 'css/variables-theme',
        options: {
          selector: '[data-theme="patina"], .theme-patina'
        }
      }]
    }
  }
});

// Create dist directories
const distDirs = ['dist/css', 'dist/css/themes', 'dist/js'];
distDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Build all configurations
console.log('Building design tokens...');
buildBase.buildAllPlatforms();
buildBW.buildAllPlatforms();
buildColor.buildAllPlatforms();
buildPatina.buildAllPlatforms();

// Create index CSS file that imports all themes
const indexCss = `/* VWX Design System - Design Tokens */
@import './base.css';
@import './themes/bw.css';
@import './themes/color.css';
@import './themes/patina.css';
`;

fs.writeFileSync(path.join(__dirname, 'dist/css/variables.css'), indexCss);

console.log('✅ Design tokens built successfully!');
