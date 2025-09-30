# VW Xperience Design System

> Automotive-inspired design system with AI integration built on Web Components (Lit)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## Overview

The VW Xperience Design System is a comprehensive collection of reusable components, design tokens, and guidelines for building automotive-inspired digital experiences. Built with modern web standards and technologies, it provides a solid foundation for creating consistent, accessible, and performant user interfaces.

### Key Features

- **Web Components**: Framework-agnostic components built with Lit
- **Three Unique Themes**: B&W, Color, and Patina aesthetics
- **Design Tokens**: Centralized design decisions using Style Dictionary
- **TypeScript**: Full type safety across all packages
- **Monorepo Architecture**: Efficient workspace management with pnpm
- **Comprehensive Documentation**: Interactive Storybook documentation
- **CI/CD Ready**: Automated testing, linting, and deployment workflows

## Project Structure

```
vwx-design-system/
├── packages/
│   ├── tokens/              # Design tokens (spacing, typography, colors)
│   ├── components/          # Web Components (atoms, molecules, organisms)
│   ├── themes/              # Theme implementations (B&W, Color, Patina)
│   └── utils/               # Shared utilities
├── apps/
│   ├── docs/                # Storybook documentation
│   └── playground/          # Development playground
├── .github/workflows/       # CI/CD pipelines
└── ...
```

## Prerequisites

- **Node.js**: >= 20.0.0
- **pnpm**: >= 8.0.0

## Quick Start

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vwx-design-system
```

2. Install dependencies:
```bash
pnpm install
```

3. Build design tokens:
```bash
pnpm build:tokens
```

4. Start Storybook:
```bash
pnpm storybook
```

Storybook will open at `http://localhost:6006`

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server for components |
| `pnpm build` | Build all packages |
| `pnpm build:tokens` | Build design tokens only |
| `pnpm build:components` | Build components only |
| `pnpm build:storybook` | Build Storybook for production |
| `pnpm storybook` | Start Storybook development server |
| `pnpm test` | Run all tests |
| `pnpm test:unit` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |
| `pnpm lint` | Lint all files |
| `pnpm format` | Format all files with Prettier |
| `pnpm typecheck` | Run TypeScript type checking |

### Building for Production

Build all packages:
```bash
pnpm build
```

Build Storybook for deployment:
```bash
pnpm build:storybook
```

## Using the Design System

### Installing Published Packages

Once published to npm:

```bash
npm install @vwx/components @vwx/tokens @vwx/themes
```

### Basic Usage

```html
<!DOCTYPE html>
<html data-theme="bw">
<head>
  <link rel="stylesheet" href="node_modules/@vwx/tokens/dist/css/variables.css">
  <script type="module" src="node_modules/@vwx/components/dist/index.js"></script>
</head>
<body>
  <!-- Your components here -->
</body>
</html>
```

### Theme Switching

Apply themes using the `data-theme` attribute:

```javascript
// Switch to Color theme
document.documentElement.setAttribute('data-theme', 'color');

// Or use the utility function
import { applyTheme } from '@vwx/tokens';
applyTheme('patina');
```

Available themes:
- `bw` - Black & White (minimalist monochrome)
- `color` - VW brand colors (blue accents)
- `patina` - Aged aesthetic (rust and bronze tones)

## Packages

### @vwx/tokens

Design tokens providing spacing, typography, colors, and theme definitions.

```typescript
import { spacing, typography } from '@vwx/tokens';
import '@vwx/tokens/css'; // Import CSS custom properties
```

### @vwx/components

Web Components built with Lit.

```typescript
import '@vwx/components';
// or import specific components
import '@vwx/components/atoms/button';
```

### @vwx/themes

Theme implementations for B&W, Color, and Patina.

```typescript
import { bwTheme, colorTheme, patinaTheme } from '@vwx/themes';
```

### @vwx/utils

Shared utility functions.

```typescript
import { classNames, debounce, throttle } from '@vwx/utils';
```

## Testing

Run all tests:
```bash
pnpm test
```

Run unit tests with Vitest:
```bash
pnpm test:unit
```

Run E2E tests with Playwright:
```bash
pnpm test:e2e
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Create a feature branch from `develop`
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## CI/CD

The project includes three GitHub Actions workflows:

- **CI/CD Pipeline** (`ci.yml`): Runs on all pushes and PRs
- **Deploy Storybook** (`deploy-storybook.yml`): Deploys to GitHub Pages on main branch
- **Quality Gates** (`quality-gates.yml`): Additional quality checks for PRs

## Architecture Decisions

- **Web Components (Lit)**: Framework-agnostic, standards-based components
- **pnpm Workspaces**: Efficient monorepo management
- **Style Dictionary**: Token-based design system architecture
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tooling
- **Storybook 8**: Component documentation and development

## Roadmap

### Phase 1 (Week 1-3) - ✅ Complete
- [x] Repository setup
- [x] Design token system
- [x] Storybook configuration
- [x] CI/CD pipelines

### Phase 2 (Week 4-6) - In Progress
- [ ] Core components (Button, Input, Card, etc.)
- [ ] Component testing
- [ ] Accessibility audits

### Phase 3 (Week 7-9) - Planned
- [ ] Advanced components
- [ ] AI integration hooks
- [ ] Performance optimization

### Phase 4 (Week 10-12) - Planned
- [ ] Documentation enhancements
- [ ] NPM publishing
- [ ] Example applications

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For questions or issues, please open an issue on GitHub.

---

**Built with passion for automotive design and modern web standards**
