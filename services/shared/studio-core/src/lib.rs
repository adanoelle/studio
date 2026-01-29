//! Studio Core Library
//!
//! Shared domain logic for the Studio backend services.
//!
//! This crate contains common types, utilities, and business logic
//! used across multiple Lambda functions.

pub mod error;

pub use error::StudioError;

/// Result type alias using StudioError
pub type Result<T> = std::result::Result<T, StudioError>;

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert!(true);
    }
}
