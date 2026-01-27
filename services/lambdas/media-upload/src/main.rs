//! Media Upload Lambda Function
//!
//! Handles file uploads to S3 for the Glitch website.

use aws_sdk_s3::Client as S3Client;
use lambda_http::{run, service_fn, Body, Error, Request, Response};
use tracing_subscriber::EnvFilter;

/// Handler state initialized once at Lambda cold start
struct AppState {
    #[allow(dead_code)]
    s3: S3Client,
}

async fn handler(_state: &AppState, _event: Request) -> Result<Response<Body>, Error> {
    // Placeholder implementation
    let resp = Response::builder()
        .status(200)
        .header("content-type", "application/json")
        .body(Body::from(r#"{"message": "media-upload lambda ready"}"#))
        .map_err(Box::new)?;

    Ok(resp)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .json()
        .init();

    // Initialize AWS clients once at cold start
    let config = aws_config::load_defaults(aws_config::BehaviorVersion::latest()).await;
    let state = AppState {
        s3: S3Client::new(&config),
    };

    run(service_fn(|event| handler(&state, event))).await
}
