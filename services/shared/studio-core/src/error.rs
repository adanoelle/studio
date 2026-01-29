//! Error types for the Studio backend

use thiserror::Error;

/// Main error type for Studio services
#[derive(Error, Debug)]
pub enum StudioError {
    /// Configuration error
    #[error("configuration error: {0}")]
    Config(String),

    /// Validation error
    #[error("validation error: {0}")]
    Validation(String),

    /// Not found error
    #[error("not found: {0}")]
    NotFound(String),

    /// Internal error
    #[error("internal error: {0}")]
    Internal(String),

    /// AWS SDK error
    #[error("aws error: {message}")]
    Aws {
        message: String,
        #[source]
        source: Option<Box<dyn std::error::Error + Send + Sync>>,
    },

    /// Serialization error
    #[error("serialization error: {0}")]
    Serialization(#[from] serde_json::Error),
}

impl StudioError {
    /// Returns the HTTP status code for this error
    pub fn status_code(&self) -> u16 {
        match self {
            StudioError::Config(_) => 500,
            StudioError::Validation(_) => 400,
            StudioError::NotFound(_) => 404,
            StudioError::Internal(_) => 500,
            StudioError::Aws { .. } => 502,
            StudioError::Serialization(_) => 400,
        }
    }

    /// Create an AWS error from a message
    pub fn aws(message: impl Into<String>) -> Self {
        StudioError::Aws {
            message: message.into(),
            source: None,
        }
    }

    /// Create an AWS error with a source error
    pub fn aws_with_source(
        message: impl Into<String>,
        source: impl std::error::Error + Send + Sync + 'static,
    ) -> Self {
        StudioError::Aws {
            message: message.into(),
            source: Some(Box::new(source)),
        }
    }
}
