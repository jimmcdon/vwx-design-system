# Pull Request

## Description

Brief description of changes and the problem they solve.

Fixes # (issue number)

## Type of Change

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality
      to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🔧 Maintenance/refactoring
- [ ] 🎨 Style changes (formatting, missing semi colons, etc; no code change)
- [ ] ⚡ Performance improvements
- [ ] 🔒 Security improvements

## Quality Checklist

### Code Quality

- [ ] Code follows the established style guidelines
- [ ] Self-review of code has been performed
- [ ] Code is well-documented with clear comments where needed
- [ ] No TODO comments left in production code
- [ ] All console.log statements removed

### Testing

- [ ] Unit tests added/updated for new functionality
- [ ] All existing tests pass
- [ ] Test coverage meets minimum requirements (90%)
- [ ] Edge cases have been considered and tested
- [ ] Accessibility tests pass (WCAG 2.1 AA)

### Performance

- [ ] Bundle size impact assessed (if applicable)
- [ ] No performance regressions introduced
- [ ] Images optimized (if applicable)
- [ ] Code splitting considered for large features

### Accessibility

- [ ] Components are keyboard navigable
- [ ] Proper ARIA attributes implemented
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus management implemented correctly
- [ ] Screen reader compatibility tested

### Security

- [ ] No sensitive information exposed
- [ ] Input validation implemented where needed
- [ ] Dependencies updated to latest secure versions
- [ ] Security best practices followed

### Documentation

- [ ] Component documentation updated
- [ ] Storybook stories added/updated
- [ ] README updated (if applicable)
- [ ] Migration guide provided (for breaking changes)
- [ ] CHANGELOG updated

## Breaking Changes

If this PR introduces breaking changes, describe them here:

- List breaking changes
- Explain migration path
- Provide code examples

## Screenshots/Videos

If applicable, add screenshots or videos to help explain your changes.

## Testing Instructions

Step-by-step instructions on how to test the changes:

1.
2.
3.

## Reviewer Notes

Any specific areas you'd like reviewers to focus on:

-
-
-

## Performance Impact

- **Bundle size**: [Increase/Decrease/No change] by X KB
- **Runtime performance**: [Better/Same/Worse] - explain if applicable
- **Build time**: [Faster/Same/Slower] - explain if applicable

## Deployment Notes

Any special deployment considerations:

- Database migrations needed
- Feature flags to be enabled
- Configuration changes required
- Dependencies to update

---

## Automated Checks

The following automated checks must pass before merging:

- ✅ All CI/CD quality gates pass
- ✅ Code review approval from 2+ team members
- ✅ No merge conflicts
- ✅ Branch is up to date with target branch

## Post-Merge Actions

- [ ] Monitor error rates and performance metrics
- [ ] Update team on new features/changes
- [ ] Schedule follow-up work if needed
