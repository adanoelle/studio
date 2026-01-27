# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                        GLITCH MONOREPO - ROOT JUSTFILE                       ║
# ╠══════════════════════════════════════════════════════════════════════════════╣
# ║                                                                              ║
# ║  This is the SINGLE ENTRY POINT for all development tasks in the Glitch     ║
# ║  monorepo. Use `just <command>` rather than invoking tools directly.         ║
# ║                                                                              ║
# ║  ARCHITECTURE                                                                ║
# ║  ────────────────────────────────────────────────────────────────────────    ║
# ║  This monorepo contains three types of packages:                             ║
# ║                                                                              ║
# ║    packages/     TypeScript libraries (design-system, tokens)                ║
# ║    apps/         TypeScript applications (website)                           ║
# ║    services/     Rust Lambda functions (api, media-upload)                   ║
# ║                                                                              ║
# ║  TOOLING                                                                     ║
# ║  ────────────────────────────────────────────────────────────────────────    ║
# ║  • Turborepo    Orchestrates TypeScript builds with caching & parallelism   ║
# ║  • pnpm         Package management for TypeScript workspace                  ║
# ║  • Cargo        Rust workspace management                                    ║
# ║  • just         Unified command interface (this file)                        ║
# ║                                                                              ║
# ║  COMMON VERBS                                                                ║
# ║  ────────────────────────────────────────────────────────────────────────    ║
# ║  Every justfile in this repo uses consistent command names:                  ║
# ║                                                                              ║
# ║    dev        Start development server(s)                                    ║
# ║    build      Build for production                                           ║
# ║    test       Run tests                                                      ║
# ║    lint       Run linter                                                     ║
# ║    typecheck  Type check (TypeScript) or `check` (Rust)                      ║
# ║    fmt        Format code                                                    ║
# ║    clean      Remove build artifacts                                         ║
# ║                                                                              ║
# ║  You can run these commands:                                                 ║
# ║    • From root: `just dev` runs all dev servers                              ║
# ║    • From package: `cd apps/website && just dev` runs website only           ║
# ║                                                                              ║
# ║  QUICK START                                                                 ║
# ║  ────────────────────────────────────────────────────────────────────────    ║
# ║    just doctor    Check your environment has required tools                  ║
# ║    just setup     Install all dependencies                                   ║
# ║    just dev       Start development servers                                  ║
# ║    just check     Run all quality checks (CI equivalent)                     ║
# ║    just build     Build everything for production                            ║
# ║                                                                              ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Default recipe: show help
default:
    @just --list

# ═══════════════════════════════════════════════════════════════════════════════
# ENVIRONMENT & SETUP
# ═══════════════════════════════════════════════════════════════════════════════

# Check that all required tools are installed
[doc("Verify your development environment has all required tools")]
doctor:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "🩺 Checking development environment..."
    echo ""
    errors=0

    check_required() {
        if command -v "$1" &> /dev/null; then
            version=$($2 2>&1 | head -1)
            echo "  ✓ $1: $version"
        else
            echo "  ✗ $1: NOT FOUND"
            errors=$((errors + 1))
        fi
    }

    echo "Required tools (TypeScript):"
    check_required "node" "node --version"
    check_required "pnpm" "pnpm --version"
    check_required "just" "just --version"

    echo ""
    echo "Turborepo (installed via pnpm):"
    if pnpm list turbo --depth=0 2>/dev/null | grep -q turbo; then
        echo "  ✓ turbo: $(pnpm exec turbo --version)"
    else
        echo "  ○ turbo: not installed (run 'just setup')"
    fi

    echo ""
    echo "Optional tools (Rust services):"
    if command -v cargo &> /dev/null; then
        echo "  ✓ cargo: $(cargo --version)"
    else
        echo "  ○ cargo: not installed (https://rustup.rs)"
    fi
    if command -v cargo-lambda &> /dev/null; then
        echo "  ✓ cargo-lambda: $(cargo-lambda --version 2>/dev/null | head -1)"
    else
        echo "  ○ cargo-lambda: not installed (cargo install cargo-lambda)"
    fi

    echo ""
    echo "Optional tools (Development):"
    if command -v claude &> /dev/null; then
        echo "  ✓ claude: $(claude --version 2>/dev/null | head -1 || echo 'installed')"
    else
        echo "  ○ claude: not installed (brew install claude-code)"
    fi

    echo ""
    if [ $errors -gt 0 ]; then
        echo "❌ $errors required tool(s) missing!"
        echo "   Install missing tools or enter Nix shell with 'nix develop'"
        exit 1
    else
        echo "✅ All required tools available!"
    fi

# Install all dependencies (TypeScript + Rust)
[doc("Install all project dependencies")]
setup:
    @echo "📦 Installing TypeScript dependencies..."
    pnpm install
    @echo ""
    @if command -v cargo &> /dev/null; then \
        echo "📦 Fetching Rust dependencies..."; \
        cd services && cargo fetch; \
    else \
        echo "⏭️  Skipping Rust setup (cargo not installed)"; \
    fi
    @echo ""
    @echo "✅ Setup complete! Run 'just dev' to start developing."

# ═══════════════════════════════════════════════════════════════════════════════
# DEVELOPMENT
# ═══════════════════════════════════════════════════════════════════════════════

# Start all development servers
[doc("Start all development servers (website + design system)")]
dev:
    pnpm dev

# Start only the website development server
[doc("Start only the website dev server")]
dev-website:
    just apps::website::dev

# Start only the design system development server
[doc("Start only the design system dev server")]
dev-design-system:
    just packages::design-system::dev

# Preview the production build locally
[doc("Build and preview the production website")]
preview: build
    just apps::website::preview

# ═══════════════════════════════════════════════════════════════════════════════
# BUILDING
# ═══════════════════════════════════════════════════════════════════════════════

# Build all packages for production
[doc("Build all packages for production")]
build: build-ts build-rust

# Build TypeScript packages (uses Turborepo for caching/parallelism)
[doc("Build all TypeScript packages")]
build-ts:
    pnpm build

# Build Rust services
[doc("Build Rust services for development")]
build-rust:
    @if command -v cargo &> /dev/null; then \
        just services::build; \
    else \
        echo "⏭️  Skipping Rust build (cargo not installed)"; \
    fi

# Build Lambda functions for deployment
[doc("Build Lambda functions with cargo-lambda (release mode)")]
build-lambdas:
    just services::build-lambdas

# ═══════════════════════════════════════════════════════════════════════════════
# QUALITY CHECKS
# ═══════════════════════════════════════════════════════════════════════════════

# Run ALL quality checks (equivalent to CI)
[doc("Run all quality checks (typecheck, lint, test) - CI equivalent")]
check: typecheck lint test
    @echo ""
    @echo "════════════════════════════════════════"
    @echo "✅ All checks passed!"
    @echo "════════════════════════════════════════"

# Type check TypeScript code
[doc("Type check all TypeScript packages")]
typecheck:
    pnpm typecheck

# Lint TypeScript code
[doc("Lint all TypeScript packages")]
lint:
    pnpm lint

# Check Rust code (type check + clippy)
[doc("Check Rust code with cargo check and clippy")]
check-rust:
    @if command -v cargo &> /dev/null; then \
        just services::check; \
    else \
        echo "⏭️  Skipping Rust check (cargo not installed)"; \
    fi

# ═══════════════════════════════════════════════════════════════════════════════
# TESTING
# ═══════════════════════════════════════════════════════════════════════════════

# Run all tests
[doc("Run all tests (TypeScript + Rust)")]
test: test-ts test-rust

# Run TypeScript tests
[doc("Run TypeScript tests")]
test-ts:
    pnpm test

# Run Rust tests
[doc("Run Rust tests")]
test-rust:
    @if command -v cargo &> /dev/null; then \
        just services::test; \
    else \
        echo "⏭️  Skipping Rust tests (cargo not installed)"; \
    fi

# ═══════════════════════════════════════════════════════════════════════════════
# FORMATTING
# ═══════════════════════════════════════════════════════════════════════════════

# Format all code
[doc("Format all code (TypeScript + Rust)")]
fmt: fmt-ts fmt-rust

# Format TypeScript code
[doc("Format TypeScript code with Prettier")]
fmt-ts:
    pnpm format

# Format Rust code
[doc("Format Rust code with cargo fmt")]
fmt-rust:
    @if command -v cargo &> /dev/null; then \
        just services::fmt; \
    else \
        echo "⏭️  Skipping Rust format (cargo not installed)"; \
    fi

# Check formatting without making changes
[doc("Check code formatting without making changes")]
fmt-check:
    pnpm format:check
    @if command -v cargo &> /dev/null; then \
        just services::fmt-check; \
    fi

# ═══════════════════════════════════════════════════════════════════════════════
# CLEANUP
# ═══════════════════════════════════════════════════════════════════════════════

# Clean all build artifacts
[doc("Remove all build artifacts")]
clean:
    @echo "🧹 Cleaning build artifacts..."
    pnpm clean
    rm -rf .turbo
    @if command -v cargo &> /dev/null; then \
        just services::clean; \
    fi
    @echo "✅ Clean complete!"

# Full reset: clean + remove node_modules + reinstall
[doc("Full reset: clean everything and reinstall dependencies")]
reset: clean
    @echo "🔄 Removing all dependencies..."
    rm -rf node_modules
    rm -rf apps/*/node_modules
    rm -rf packages/*/node_modules
    rm -rf tools/*/node_modules
    pnpm install
    @echo "✅ Full reset complete!"

# ═══════════════════════════════════════════════════════════════════════════════
# PACKAGE-SPECIFIC COMMANDS
# ═══════════════════════════════════════════════════════════════════════════════

# Run a command in a specific TypeScript package
[doc("Run a pnpm command in a specific package (e.g., just pkg design-system add lodash)")]
pkg package *args:
    pnpm --filter @glitch/{{package}} {{args}}

# Add a dependency to a package
[doc("Add a dependency to a package (e.g., just add website lodash)")]
add package dep:
    pnpm --filter @glitch/{{package}} add {{dep}}

# Add a dev dependency to a package
[doc("Add a dev dependency to a package")]
add-dev package dep:
    pnpm --filter @glitch/{{package}} add -D {{dep}}

# ═══════════════════════════════════════════════════════════════════════════════
# CI/CD
# ═══════════════════════════════════════════════════════════════════════════════

# Run the full CI pipeline locally
[doc("Simulate the full CI pipeline locally")]
ci: doctor
    @echo ""
    @echo "════════════════════════════════════════════════════════════════════"
    @echo "🚀 Running CI pipeline..."
    @echo "════════════════════════════════════════════════════════════════════"
    pnpm install
    just fmt-check
    just check
    just build
    @echo ""
    @echo "════════════════════════════════════════════════════════════════════"
    @echo "✅ CI simulation complete! Safe to push."
    @echo "════════════════════════════════════════════════════════════════════"

# ═══════════════════════════════════════════════════════════════════════════════
# SUBMODULE IMPORTS
# ═══════════════════════════════════════════════════════════════════════════════
# Import justfiles from subdirectories to enable commands like:
#   just apps::website::dev
#   just services::build

mod apps
mod packages
mod services
