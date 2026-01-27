# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                           APPS MODULE - JUSTFILE                             ║
# ╠══════════════════════════════════════════════════════════════════════════════╣
# ║                                                                              ║
# ║  This module imports justfiles from all application packages.                ║
# ║                                                                              ║
# ║  APPLICATIONS                                                                ║
# ║  ────────────────────────────────────────────────────────────────────────    ║
# ║    website     Personal website built with the Glitch design system          ║
# ║                                                                              ║
# ║  USAGE                                                                       ║
# ║  ────────────────────────────────────────────────────────────────────────    ║
# ║  From the repository root:                                                   ║
# ║    just apps::website::dev      Start website dev server                       ║
# ║    just apps::website::build    Build website for production                   ║
# ║                                                                              ║
# ║  From this directory (apps/):                                                ║
# ║    just website::dev           Start website dev server                       ║
# ║                                                                              ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

mod website
