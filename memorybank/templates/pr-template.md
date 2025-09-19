# Pull Request Template

## Summary
Brief description of what this PR accomplishes.

## Changes Made
- [ ] Feature implementation
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring
- [ ] Testing improvements
- [ ] Performance optimization

## Technical Details
### Components Modified
- List of components, files, or modules changed
- Brief explanation of changes made

### API Changes
- New endpoints added
- Modified request/response formats
- Breaking changes (if any)

### Database Changes
- Schema modifications
- Migration scripts included
- Data seeding updates

## RTL/Internationalization
- [ ] RTL layout tested and working
- [ ] Arabic text displays correctly
- [ ] Language switching works properly
- [ ] CSS logical properties used instead of directional
- [ ] Icons mirror appropriately for RTL

## Testing
### Manual Testing
- [ ] Tested in Arabic (RTL) mode
- [ ] Tested in English (LTR) mode
- [ ] Tested on mobile devices
- [ ] Tested in multiple browsers

### Automated Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] E2E tests added for new features
- [ ] RTL-specific tests included

### Accessibility
- [ ] Screen reader compatible
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

## Performance
- [ ] No performance regressions
- [ ] Bundle size impact acceptable
- [ ] API response times acceptable
- [ ] Mobile performance tested

## Documentation
- [ ] Code comments added where needed
- [ ] API documentation updated
- [ ] README updated (if applicable)
- [ ] ADR created for architectural changes

## Quality Checklist
- [ ] Linting passes
- [ ] TypeScript compilation successful
- [ ] No console errors or warnings
- [ ] Code follows project conventions
- [ ] Secrets/keys not exposed

## Decision Updates
- [ ] Progress.md updated with completion status
- [ ] DecisionLog.md updated (if architectural decisions made)
- [ ] Related ADRs cross-referenced

## Deployment Notes
### Environment Variables
List any new environment variables needed:
- `VARIABLE_NAME`: Description of purpose

### Configuration Changes
- Database migrations required: Yes/No
- Cache clearing needed: Yes/No
- Third-party service updates: Yes/No

### Rollback Plan
Brief description of how to rollback this change if issues arise.

## Screenshots/Videos
Include screenshots or videos demonstrating:
- New features in action
- RTL layout working correctly
- Mobile responsive behavior
- Before/after comparisons (for fixes)

## Related Issues
- Closes #123
- Fixes #456
- Related to #789

## Additional Notes
Any other context, concerns, or considerations for reviewers.

---

## Reviewer Guidelines

### Code Review Focus Areas
1. **RTL Compliance**: Verify Arabic layout works correctly
2. **Performance**: Check for potential performance impacts
3. **Security**: Ensure no sensitive data exposure
4. **Accessibility**: Confirm WCAG compliance
5. **Testing Coverage**: Adequate test coverage for changes

### Testing Instructions
1. Check out the branch
2. Run `npm install` if dependencies changed
3. Test in both Arabic and English modes
4. Verify mobile responsiveness
5. Run full test suite: `npm test`

### Approval Criteria
- [ ] Code quality meets project standards
- [ ] RTL functionality working correctly
- [ ] Tests pass and provide adequate coverage
- [ ] Documentation updated appropriately
- [ ] No security or performance concerns