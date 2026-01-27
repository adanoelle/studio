# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                         PACKAGES MODULE - JUSTFILE                           ║
# ╠══════════════════════════════════════════════════════════════════════════════╣
# ║                                                                              ║
# ║  This module imports justfiles from all library packages.                    ║
# ║                                                                              ║
# ║  PACKAGES                                                                    ║
# ║  ────────────────────────────────────────────────────────────────────────    ║
# ║    design-system   Lit web components grounded in feminist theory            ║
# ║    tokens          CSS custom properties (design tokens)                     ║
# ║                                                                              ║
# ║  USAGE                                                                       ║
# ║  ────────────────────────────────────────────────────────────────────────    ║
# ║  From the repository root:                                                   ║
# ║    just packages::design-system::dev     Start design system dev server        ║
# ║    just packages::design-system::build   Build design system                   ║
# ║    just packages::tokens::build          Build tokens (no-op for CSS)          ║
# ║                                                                              ║
# ║  From this directory (packages/):                                            ║
# ║    just design-system::dev              Start design system dev server        ║
# ║                                                                              ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

mod design-system
mod tokens
