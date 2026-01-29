# Contributing to Studio

Thank you for your interest in contributing to the Studio design system.

## Development Setup

### Prerequisites

- Node.js 20+
- pnpm 9+
- just (command runner)
- Rust toolchain (optional, for Lambda services)

### Getting Started

```bash
# Verify your environment has all required tools
just doctor

# Install dependencies
just setup

# Start development servers
just dev
```

## Project Structure

```
studio/
├── apps/
│   ├── website/          # Personal website (glitch aesthetic)
│   └── journal/          # Learning journal (analog aesthetic)
├── packages/
│   ├── design-system/    # Web components (Lit)
│   └── tokens/           # Design tokens
├── services/             # Rust Lambda functions
│   ├── shared/studio-core/
│   └── lambdas/
└── docs/                 # Documentation
    ├── glitch/           # Theoretical framework
    └── analog/           # Journal format, study plan
```

## Development Workflow

### Running Quality Checks

```bash
# Run all checks (equivalent to CI)
just check

# Individual checks
just typecheck    # TypeScript type checking
just lint         # Linting
just test         # Tests
just fmt-check    # Format checking
```

### Building

```bash
# Build everything
just build

# Build only TypeScript packages
just build-ts

# Build only Rust services
just build-rust
```

## Code Style

### TypeScript/Lit Components

- Use TypeScript strict mode
- Follow existing component patterns (see `glitch-text.ts` as reference)
- Document theoretical grounding in component JSDoc
- Include accessibility features (keyboard nav, ARIA, reduced motion)
- Use CSS custom properties from `@studio/tokens`

### Rust

- Run `cargo clippy` before committing
- No `unwrap()` or `expect()` in production code (use proper error handling)
- Follow the error types defined in `studio-core`

### Formatting

```bash
# Format all code
just fmt

# Check formatting without changes
just fmt-check
```

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

Examples:

```
feat(design-system): add glitch-button component
fix(tokens): correct warm palette contrast ratios
docs: update component API reference
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run `just ci` to ensure all checks pass
4. Push and open a PR
5. Ensure CI passes
6. Request review

### PR Guidelines

- Keep PRs focused on a single concern
- Update documentation if adding/changing features
- Add tests for new functionality
- Ensure accessibility requirements are met

## For AI Agents

If you're a Claude Code agent working on this codebase, see [CLAUDE.md](CLAUDE.md)
for detailed instructions including:

- Theoretical grounding requirements
- Component patterns and templates
- Performance optimization guidelines
- Accessibility requirements

## Design Philosophy

Every contribution should align with the project's feminist theoretical framework:

- **Glitch as refusal**: Errors are intentional acts of resistance
- **Worldtraveling**: Support for multiple identities/contexts
- **Warmth in digital spaces**: Intimate, analog aesthetics

If you can't explain how a design decision embodies the theory, reconsider it.

## Getting Help

- Read the [documentation](docs/)
- Check existing components for patterns
- Open an issue for questions or discussion

## License

By contributing, you agree that your contributions will be licensed under the MIT
License.
