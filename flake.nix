{
  description = "Glitch Feminist Design System - Web components grounded in feminist theory";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js ecosystem
            nodejs_22
            pnpm

            # Build orchestration
            just

            # Dev tools
            figlet
            git
            gh
            direnv
          ];

          shellHook = ''
            # Project-local npm global prefix
            export PATH="$PWD/.npm-tools/bin:$PATH"
            export NPM_CONFIG_PREFIX="$PWD/.npm-tools"

            echo ""
            figlet -f slant "glitch"
            echo ""
            echo "  Node:  $(node --version)"
            echo "  pnpm:  $(pnpm --version)"

            # Claude Code setup (project-local)
            if [ -n "$CI" ]; then
              echo "  Claude: (skipped in CI)"
            elif [[ -f "$PWD/.npm-tools/bin/claude" ]]; then
              echo "  Claude: $(claude --version 2>/dev/null | head -1 || echo 'installed')"
            else
              echo "  Installing Claude Code CLI..."
              mkdir -p "$PWD/.npm-tools"
              if npm install -g @anthropic-ai/claude-code@latest 2>/dev/null; then
                echo "  Claude: installed successfully"
              else
                echo "  Claude: auto-install failed"
                echo "  Try: npm install -g @anthropic-ai/claude-code"
              fi
            fi

            echo ""
            echo "  Run 'just' to see available commands"
            echo ""
          '';
        };
      }
    );
}
