# Studio Services

Rust Lambda functions.

---

## Structure

```
services/
  shared/
    studio-core/         Shared library (error types, utilities)
  lambdas/
    api/                 API Gateway handler
    media-upload/        S3 media processing
```

---

## Prerequisites

- Rust toolchain via [rustup](https://rustup.rs)
- [cargo-lambda](https://www.cargo-lambda.info/) for Lambda development

```
cargo install cargo-lambda
```

---

## Development

Build:

```
just build
```

Run locally:

```
just watch
```

Test:

```
just test
```

---

## Building for Deployment

```
just build-lambdas
```

Outputs `bootstrap` binaries to `services/target/lambda/`, compatible with AWS
Lambda's `provided.al2023` runtime.

---

## Code Guidelines

### Error Handling

Use types from `studio-core`:

```rust
use studio_core::error::{StudioError, Result};

async fn handler() -> Result<Response> {
    let data = fetch_data()
        .map_err(|e| StudioError::External(e.to_string()))?;
    Ok(Response::new(data))
}
```

### No Panics

Workspace configured with `clippy::unwrap_used = "deny"` and
`clippy::expect_used = "deny"`. Handle errors properly:

```rust
// Will fail clippy
let value = map.get("key").unwrap();

// Correct
let value = map.get("key").ok_or(StudioError::NotFound("key"))?;
```

### Logging

Use `tracing` for structured logs:

```rust
use tracing::{info, instrument};

#[instrument(skip(event))]
async fn handler(event: Request) -> Result<Response> {
    info!(path = %event.path(), "handling request");
    // ...
}
```

---

MIT
