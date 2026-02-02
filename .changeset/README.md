# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs.

## For Contributors

When making changes to `@studio/design-system` or `@studio/tokens`:

1. **Make your changes** with conventional commits
2. **Add a changeset** describing your changes:
   ```bash
   just changeset
   ```
3. **Select the packages** affected by your changes
4. **Choose the bump type**:
   - `patch`: Bug fixes, documentation, internal changes
   - `minor`: New features, non-breaking enhancements
   - `major`: Breaking changes
5. **Write a summary** describing the change for the changelog
6. **Commit the changeset file** (`.changeset/*.md`) with your PR

## What Happens Next

1. CI validates that PRs modifying packages include a changeset
2. When your PR merges, a "Version Packages" PR is automatically created
3. Merging the Version PR bumps versions, updates changelogs, and creates a GitHub release

## Versioning Strategy

The `@studio/design-system` and `@studio/tokens` packages are versioned together (fixed versioning). When one is bumped, the other receives the same version bump.

## Examples

**Bug fix** (patch):
```
just changeset
# Select: @studio/design-system
# Type: patch
# Summary: Fix isConnected guard in glitch-border setupIntersectionObserver
```

**New feature** (minor):
```
just changeset
# Select: @studio/design-system
# Type: minor
# Summary: Add keyboard navigation to glitch-text component
```

**Breaking change** (major):
```
just changeset
# Select: @studio/design-system
# Type: major
# Summary: Remove deprecated `world` property from glitch components
```
