# Development Guide

Complete guide for developing the VW Xperience Design System.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Development Tools](#development-tools)
- [Building](#building)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: v20.0.0 or higher
- **pnpm**: v8.0.0 or higher (preferred package manager)
- **Git**: Latest version

### Recommended Tools

- **VS Code**: Latest version with recommended extensions
- **Chrome/Firefox/Safari**: For cross-browser testing

### Installation

1. **Install Node.js**

   Download from [nodejs.org](https://nodejs.org/) or use a version manager:

   ```bash
   # Using nvm
   nvm install 20
   nvm use 20

   # Using fnm
   fnm install 20
   fnm use 20
   ```

2. **Install pnpm**

   ```bash
   npm install -g pnpm
   ```

3. **Install VS Code Extensions**

   Open the project in VS Code and install recommended extensions when prompted,
   or run:

   ```bash
   code --install-extension dbaeumer.vscode-eslint
   code --install-extension esbenp.prettier-vscode
   code --install-extension stylelint.vscode-stylelint
   code --install-extension runem.lit-plugin
   ```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd vwx-design-system
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for the monorepo and set up Git hooks.

### 3. Start Development Server

```bash
# Start Storybook (component development)
pnpm storybook

# Start demo app (full application)
pnpm dev
```

Storybook will be available at: `http://localhost:6006`

## Development Workflow

### Daily Workflow

1. **Pull Latest Changes**

   ```bash
   git pull origin main
   pnpm install  # Update dependencies if needed
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/component-name
   ```

3. **Develop Component**
   - Create component in appropriate package
   - Write unit tests
   - Create Storybook stories
   - Test manually in Storybook

4. **Run Quality Checks**

   ```bash
   # Quick quality check (recommended for daily development)
   pnpm workflow:quick

   # OR run individual checks
   pnpm lint       # Lint code
   pnpm typecheck  # Check types
   pnpm test       # Run tests
   pnpm format     # Format code
   ```

5. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat(component): add new component"
   ```

   Commit messages must follow
   [Conventional Commits](https://www.conventionalcommits.org/).

6. **Push and Create PR**

   ```bash
   git push origin feature/component-name
   ```

   Create a pull request on GitHub.

## Project Structure

```
vwx-design-system/
├── .github/              # GitHub workflows and templates
│   └── workflows/        # CI/CD workflows
├── .husky/              # Git hooks
├── .vscode/             # VS Code configuration
├── apps/                # Applications
│   └── demo/            # Demo application
├── packages/            # Design system packages
│   ├── components/      # UI components (Lit)
│   ├── tokens/          # Design tokens
│   ├── themes/          # Theme configurations
│   └── utils/           # Utility functions
├── tests/               # Test utilities and E2E tests
│   ├── e2e/            # Playwright E2E tests
│   └── utils/          # Test helpers
├── scripts/            # Build and utility scripts
├── docs/               # Documentation
└── package.json        # Root package configuration
```

### Package Structure

Each package follows this structure:

```
packages/components/
├── src/
│   ├── button/
│   │   ├── Button.ts          # Component implementation
│   │   ├── Button.test.ts     # Unit tests
│   │   ├── Button.stories.ts  # Storybook stories
│   │   ├── Button.scss        # Styles
│   │   └── index.ts           # Exports
│   └── index.ts               # Package exports
├── dist/                      # Build output
├── package.json
├── tsconfig.json
└── README.md
```

## Available Scripts

### Root Level Scripts

```bash
# Development
pnpm dev              # Start demo app
pnpm storybook        # Start Storybook

# Building
pnpm build            # Build all packages
pnpm build:tokens     # Build tokens package
pnpm build:components # Build components package

# Testing
pnpm test             # Run all unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:e2e         # Run E2E tests
pnpm test:coverage    # Run tests with coverage

# Quality & Analysis
pnpm lint             # Lint code
pnpm lint:fix         # Fix lint issues
pnpm format           # Format code
pnpm format:check     # Check formatting
pnpm typecheck        # Check TypeScript types
pnpm analyze:bundle   # Analyze bundle sizes
pnpm analyze:performance # Run performance tests

# Workflow Automation (Recommended)
pnpm workflow         # Show available workflows
pnpm workflow:quick   # Quick quality checks
pnpm workflow:full    # Comprehensive checks
pnpm workflow:setup   # Setup dev environment
pnpm workflow:clean   # Clean and reinstall
pnpm workflow:release # Prepare for release
pnpm test:coverage    # Run tests with coverage
pnpm test:e2e         # Run E2E tests

# Code Quality
pnpm lint             # Lint all code
pnpm lint:fix         # Fix linting issues
pnpm typecheck        # Type check all packages
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting

# Quality Gates
pnpm quality-gates    # Run all quality checks
pnpm bundle-size      # Check bundle sizes
```

### Package-Specific Scripts

```bash
# Run script in specific package
pnpm --filter @vwx/components test
pnpm --filter @vwx/tokens build
```

## Development Tools

### VS Code

The project includes VS Code configuration with:

- **Auto-formatting** on save
- **Auto-fixing** ESLint errors on save
- **IntelliSense** for TypeScript and Lit
- **Debug configurations** for tests and Storybook

### ESLint

Enforces code quality and consistency:

```bash
# Lint code
pnpm lint

# Fix auto-fixable issues
pnpm lint:fix
```

Configuration: `.eslintrc.js`

### Prettier

Formats code for consistency:

```bash
# Format all files
pnpm format

# Check formatting
pnpm format:check
```

Configuration: `.prettierrc`

### Stylelint

Lints CSS/SCSS:

```bash
# Lint styles
pnpm stylelint

# Fix style issues
pnpm stylelint:fix
```

Configuration: `.stylelintrc.json`

### TypeScript

Strict type checking enabled:

```bash
# Check types
pnpm typecheck
```

Configuration: `tsconfig.json`

### Git Hooks

Automated checks via Husky:

- **pre-commit**: Runs lint-staged (format, lint)
- **commit-msg**: Validates commit message format
- **pre-push**: Runs type check and tests

## Building

### Build All Packages

```bash
pnpm build
```

This builds packages in dependency order:

1. Tokens
2. Utils
3. Themes
4. Components

### Build Output

```
packages/components/dist/
├── index.js           # ES module build
├── index.d.ts         # TypeScript declarations
├── index.js.map       # Source map
└── styles/            # Compiled styles
```

### Production Build

```bash
NODE_ENV=production pnpm build
```

Optimizations:

- Minification
- Tree shaking
- Dead code elimination
- Source maps (external)

## Troubleshooting

### Port Already in Use

**Error**: `Port 6006 is already in use`

**Solution**:

```bash
# Find and kill the process
lsof -ti:6006 | xargs kill -9

# Or use a different port
pnpm storybook --port 6007
```

### Dependency Installation Errors

**Error**: `Cannot find module` or `ERESOLVE unable to resolve dependency tree`

**Solution**:

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors

**Error**: Type errors in VS Code but not in terminal

**Solution**:

```bash
# Restart TypeScript server in VS Code
# Command Palette (Cmd+Shift+P) > "TypeScript: Restart TS Server"

# Or reload VS Code window
# Command Palette > "Developer: Reload Window"
```

### Build Failures

**Error**: Build fails with cryptic error

**Solution**:

```bash
# Clean all build artifacts
pnpm clean

# Rebuild everything
pnpm build
```

### Git Hooks Not Running

**Error**: Commits succeed without running checks

**Solution**:

```bash
# Reinstall Husky hooks
pnpm husky install
```

### Test Failures

**Error**: Tests fail unexpectedly

**Solution**:

```bash
# Clear test cache
pnpm test --clearCache

# Run tests with verbose output
pnpm test --verbose
```

### Storybook Won't Start

**Error**: Storybook fails to start

**Solution**:

```bash
# Clear Storybook cache
rm -rf node_modules/.cache

# Reinstall dependencies
pnpm install

# Start with verbose logging
pnpm storybook --debug
```

## Platform-Specific Notes

### macOS

- No special configuration needed
- Use `pnpm` for best performance

### Windows

- Use Git Bash or WSL2 for best compatibility
- Line endings: Set `core.autocrlf=input` in Git config
- File paths: Use forward slashes in scripts

### Linux

- Ensure you have build tools installed:
  ```bash
  sudo apt-get install build-essential
  ```

## Next Steps

- [Testing Guide](./TESTING.md) - Learn about testing practices
- [Contributing Guide](./CONTRIBUTING.md) - Learn how to contribute
- [Component Templates](./templates/) - Use templates for new components

## Getting Help

- **Documentation**: Check `/docs` directory
- **Issues**: Search existing GitHub issues
- **Team**: Ask in team Slack channel
- **Code Review**: Request review from team members
