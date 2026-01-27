//! API Lambda Function
//!
//! Main API handler for the Glitch website backend.

use aws_sdk_dynamodb::Client as DynamoClient;
use lambda_http::{run, service_fn, Body, Error, Request, Response};
use tracing_subscriber::EnvFilter;

/// Handler state initialized once at Lambda cold start
struct AppState {
    #[allow(dead_code)]
    dynamo: DynamoClient,
}

async fn handler(_state: &AppState, _event: Request) -> Result<Response<Body>, Error> {
    // Placeholder implementation
    let resp = Response::builder()
        .status(200)
        .header("content-type", "application/json")
        .body(Body::from(r#"{"message": "api lambda ready"}"#))
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
        dynamo: DynamoClient::new(&config),
    };

    run(service_fn(|event| handler(&state, event))).await
}
