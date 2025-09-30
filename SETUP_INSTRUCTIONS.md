# Setup Instructions

## Environment Setup

### Prerequisites

1. **Node.js 20.x or higher** (currently system has v18.20.4)
   ```bash
   # Using nvm (recommended)
   nvm install 20
   nvm use 20

   # Or download from https://nodejs.org/
   ```

2. **pnpm 8.x or higher**
   ```bash
   # Enable corepack (comes with Node.js 16.10+)
   corepack enable

   # Install pnpm
   corepack prepare pnpm@8.15.0 --activate

   # Or install globally
   npm install -g pnpm@8
   ```

### Initial Setup

Once Node.js 20+ and pnpm are installed:

1. **Install dependencies**
   ```bash
   cd /Users/mcdpro/vwx/vwx-design-system
   pnpm install
   ```

2. **Build design tokens**
   ```bash
   pnpm build:tokens
   ```

   This will generate CSS custom properties in `packages/tokens/dist/css/`

3. **Verify the build**
   ```bash
   # Check that tokens were generated
   ls -la packages/tokens/dist/css/

   # You should see:
   # - base.css
   # - variables.css
   # - themes/bw.css
   # - themes/color.css
   # - themes/patina.css
   ```

4. **Start Storybook**
   ```bash
   pnpm storybook
   ```

   This will open Storybook at http://localhost:6006

5. **Run tests** (optional)
   ```bash
   pnpm test:unit
   ```

### Troubleshooting

#### Corepack Issues

If you encounter corepack errors:

```bash
# Disable corepack
corepack disable

# Install pnpm directly
npm install -g pnpm@8

# Try installation again
pnpm install
```

#### Node Version Issues

The project requires Node.js 20+. If you see TypeScript or build errors, verify:

```bash
node --version  # Should show v20.x.x
```

#### Installation Fails

If `pnpm install` fails:

1. Clear pnpm cache:
   ```bash
   pnpm store prune
   ```

2. Delete `node_modules` and lockfile:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   ```

3. Reinstall:
   ```bash
   pnpm install
   ```

### GitHub Repository Setup

After successful local setup:

1. **Create GitHub repository**
   - Go to https://github.com/new
   - Name: `vwx-design-system`
   - Make it public or private
   - Do NOT initialize with README (we have one)

2. **Push to GitHub**
   ```bash
   cd /Users/mcdpro/vwx/vwx-design-system

   # Initialize git (if not already done)
   git init

   # Add all files
   git add .

   # Create initial commit
   git commit -m "feat: initial VWX Design System setup

   - Complete monorepo structure
   - Design token system with Style Dictionary
   - Storybook 8 with theme switcher
   - CI/CD pipelines
   - Development tooling (ESLint, Prettier, Husky)
   - Comprehensive documentation"

   # Add remote (replace with your GitHub URL)
   git remote add origin https://github.com/YOUR_USERNAME/vwx-design-system.git

   # Push to main branch
   git branch -M main
   git push -u origin main
   ```

3. **Set up GitHub Pages** (for Storybook deployment)
   - Go to repository Settings > Pages
   - Source: GitHub Actions
   - The workflow will automatically deploy on pushes to main

4. **Enable GitHub Actions**
   - Go to Actions tab
   - Enable workflows if prompted
   - The CI/CD pipeline will run automatically

### Development Workflow

Now you're ready to develop:

```bash
# Start Storybook for component development
pnpm storybook

# In another terminal, watch token changes
pnpm --filter @vwx/tokens dev

# Run tests continuously
pnpm test:unit --watch

# Lint and format
pnpm lint
pnpm format
```

### Next Steps

1. **Agent 2** will implement core components (Button, Input, Card, etc.)
2. **Agent 3** will build complex organisms (Header, Navigation, etc.)
3. **Agent 4** will add AI integration hooks and advanced features

### Verification Checklist

- [ ] Node.js 20+ installed
- [ ] pnpm 8+ installed
- [ ] Dependencies installed (`pnpm install`)
- [ ] Tokens built (`pnpm build:tokens`)
- [ ] Storybook runs (`pnpm storybook`)
- [ ] Tests pass (`pnpm test:unit`)
- [ ] Linting passes (`pnpm lint`)
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] GitHub Actions enabled

## Common Commands Reference

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm build` | Build all packages |
| `pnpm build:tokens` | Build design tokens only |
| `pnpm storybook` | Start Storybook dev server |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint code |
| `pnpm format` | Format code |
| `pnpm typecheck` | Type check TypeScript |

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review error messages carefully
3. Ensure all prerequisites are met
4. Check GitHub Issues for similar problems
5. Create a new issue with reproduction steps
