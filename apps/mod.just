# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                           APPS MODULE - JUSTFILE                             ║
# ╠══════════════════════════════════════════════════════════════════════════════╣
# ║                                                                              ║
# ║  This module imports justfiles from all application packages.                ║
# ║                                                                              ║
# ║  APPLICATIONS                                                                ║
# ║  ────────────────────────────────────────────────────────────────────────    ║
# ║    website     Personal website (glitch aesthetic)                           ║
# ║    journal     Music learning journal (analog aesthetic)                     ║
# ║                                                                              ║
# ║  USAGE                                                                       ║
# ║  ────────────────────────────────────────────────────────────────────────    ║
# ║  From the repository root:                                                   ║
# ║    just apps::website::dev      Start website dev server                     ║
# ║    just apps::journal::dev      Start journal dev server                     ║
# ║                                                                              ║
# ║  From this directory (apps/):                                                ║
# ║    just website::dev            Start website dev server                     ║
# ║    just journal::dev            Start journal dev server                     ║
# ║                                                                              ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

mod website
mod journal
