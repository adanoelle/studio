//! Glitch Core Library
//!
//! Shared domain logic for the Glitch backend services.
//!
//! This crate contains common types, utilities, and business logic
//! used across multiple Lambda functions.

pub mod error;

pub use error::GlitchError;

/// Result type alias using GlitchError
pub type Result<T> = std::result::Result<T, GlitchError>;

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert!(true);
    }
}
