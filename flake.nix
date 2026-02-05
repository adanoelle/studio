{
  description = "Glitch Feminist Design System - Web components grounded in feminist theory";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    claude-code-overlay.url = "github:ryoppippi/claude-code-overlay";
  };

  outputs = { self, nixpkgs, flake-utils, claude-code-overlay, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ claude-code-overlay.overlays.default ];
          config.allowUnfreePredicate = pkg: (pkg.pname or "") == "claude-code";
        };
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

            # Claude Code (native binary from overlay)
            claude-code
          ];

          shellHook = ''
            echo ""
            figlet -f slant "glitch"
            echo ""
            echo "  Node:   $(node --version)"
            echo "  pnpm:   $(pnpm --version)"
            echo "  Claude: $(claude --version 2>/dev/null | head -1 || echo 'available')"
            echo ""
            echo "  Run 'just' to see available commands"
            echo ""
          '';
        };
      }
    );
}
