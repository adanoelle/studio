# Glitch Services

Rust Lambda functions for the Glitch platform.

## Structure

```
services/
├── shared/
│   └── glitch-core/      # Shared library (error types, utilities)
└── lambdas/
    ├── api/              # API Gateway Lambda
    └── media-upload/     # S3 media upload handler
```

## Prerequisites

- Rust toolchain (via [rustup](https://rustup.rs))
- [cargo-lambda](https://www.cargo-lambda.info/) for Lambda development

```bash
# Install cargo-lambda
cargo install cargo-lambda
```

## Development

### Building

```bash
# From repo root
just build-rust

# Or from this directory
just build
```

### Running Locally

```bash
# Start local Lambda runtime
just watch

# In another terminal, invoke the function
cargo lambda invoke api --data-ascii '{"httpMethod": "GET", "path": "/health"}'
```

### Testing

```bash
# From repo root
just test-rust

# Or from this directory
just test
```

## Building for Deployment

Lambda functions must be built with `cargo-lambda` for the correct target:

```bash
# From repo root
just build-lambdas

# Outputs to services/target/lambda/
```

The build produces `bootstrap` binaries compatible with AWS Lambda's `provided.al2023` runtime.

## Code Guidelines

### Error Handling

Use the error types from `glitch-core`:

```rust
use glitch_core::error::{GlitchError, Result};

async fn handler() -> Result<Response> {
    let data = fetch_data()
        .map_err(|e| GlitchError::External(e.to_string()))?;
    Ok(Response::new(data))
}
```

### No Panics

The workspace is configured with `clippy::unwrap_used = "deny"` and `clippy::expect_used = "deny"`. Use proper error handling:

```rust
// Bad - will fail clippy
let value = map.get("key").unwrap();

// Good
let value = map.get("key").ok_or(GlitchError::NotFound("key"))?;
```

### Logging

Use `tracing` for structured logging:

```rust
use tracing::{info, error, instrument};

#[instrument(skip(event))]
async fn handler(event: Request) -> Result<Response> {
    info!(path = %event.path(), "handling request");
    // ...
}
```

## Workspace Configuration

The `Cargo.toml` at the services root configures:

- Workspace members and shared dependencies
- Strict lints (`unsafe_code = "deny"`, `unwrap_used = "deny"`)
- Release profile optimized for Lambda (LTO, single codegen unit, stripped)

## Architecture

### glitch-core

Shared library containing:
- Error types (`GlitchError`)
- Common utilities
- Shared configuration

### api Lambda

Handles API Gateway requests. Entry point for the web API.

### media-upload Lambda

Handles S3 event triggers for media processing.

## License

MIT
