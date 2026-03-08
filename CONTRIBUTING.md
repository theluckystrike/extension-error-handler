# Contributing to extension-error-handler

Thank you for your interest in contributing. This project welcomes contributions from the community.

## REPORTING ISSUES

When reporting bugs or requesting features, please use the GitHub issue templates. Include the following:

- A clear description of the issue or feature request
- Steps to reproduce (for bugs)
- Environment details (Chrome version, manifest version)
- Any relevant error messages or stack traces

## HOW TO FORK AND CLONE

1. Fork the repository by clicking the "Fork" button on GitHub
2. Clone your forked repository:

```bash
git clone https://github.com/YOUR_USERNAME/extension-error-handler.git
cd extension-error-handler
```

3. Add the original repository as a remote:

```bash
git remote add upstream https://github.com/theluckystrike/extension-error-handler.git
```

4. Keep your fork synced:

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

## DEVELOPMENT WORKFLOW

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Ensure tests pass (if any exist)
5. Submit a pull request

### Building

```bash
npm install
npm run build
```

### Testing

```bash
npm test
```

## CODE STYLE

- Use TypeScript with strict mode enabled
- Follow existing code patterns in the repository
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and small

## TESTING

Before submitting a pull request:

1. Run the build to ensure no TypeScript errors
2. Test your changes in a Chrome extension environment
3. Verify ErrorHandler, ErrorStorage, and RetryHelper work correctly

## LICENSE

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Built at [zovo.one](https://zovo.one) by [theluckystrike](https://github.com/theluckystrike)
