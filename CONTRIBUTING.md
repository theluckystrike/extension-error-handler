# Contributing to Extension Error Handler

Thank you for your interest in contributing to Extension Error Handler! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### 1. Fork the Repository

Click the "Fork" button on the repository page to create your own copy of the repository.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/extension-error-handler.git
cd extension-error-handler
```

### 3. Create a Feature Branch

Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 4. Make Your Changes

Make your changes to the codebase. Be sure to:

- Follow the existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Write clear, descriptive commit messages

### 5. Run Tests

Before submitting a pull request, make sure all tests pass:

```bash
npm install
npm test
```

### 6. Commit Your Changes

```bash
git add .
git commit -m "Add your descriptive commit message"
```

### 7. Push Your Branch

Push your changes to your fork:

```bash
git push origin feature/your-feature-name
```

### 8. Create a Pull Request

1. Navigate to the original repository
2. Click "New Pull Request"
3. Select your branch and review your changes
4. Fill in the PR template with details about your changes
5. Submit the pull request

## Development Setup

```bash
# Clone the repo
git clone https://github.com/theluckystrike/extension-error-handler.git
cd extension-error-handler

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linter
npm run lint
```

## Project Structure

```
extension-error-handler/
├── src/
│   ├── index.ts         # Main exports
│   ├── handler.ts      # ErrorHandler class & ErrorStorage
│   ├── retry.ts        # RetryHelper class
│   └── storage.ts      # Storage utilities
├── tests/              # Test files
├── package.json
└── tsconfig.json
```

## Commit Message Guidelines

- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Keep the first line under 72 characters
- Reference issues when applicable

Example:
```
Add retry logic with exponential backoff

Implemented RetryHelper.withBackoff() method that doubles
delay between each retry attempt. Added tests for edge cases.

Fixes #42
```

## Reporting Bugs

When reporting bugs, please include:

1. A clear description of the issue
2. Steps to reproduce the bug
3. Expected behavior vs actual behavior
4. Your environment (OS, Node version, browser, etc.)
5. Any relevant error messages or logs

## Suggesting Features

We welcome feature suggestions! When proposing a new feature:

1. Explain the problem you're trying to solve
2. Describe your proposed solution
3. Consider alternatives
4. Explain why this feature would be beneficial

## Questions?

If you have questions about contributing, feel free to:

- Open an issue for discussion
- Reach out through GitHub discussions

## Thank You

Thank you for taking the time to contribute! Your efforts help make this project better for everyone.
