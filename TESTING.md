# Testing Guide

This project uses [Vitest](https://vitest.dev/) for testing. Vitest is a blazing fast unit test framework powered by Vite.

## Running Tests

```bash
# Run tests in watch mode (interactive)
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

The test suite includes comprehensive coverage for:

### Utility Functions
- **terrain-utils.spec.js** - Tests for terrain creation and manipulation
- **terrain-utils-extra.spec.js** - Tests for orientation, rotation, and wall detection
- **utils.spec.js** - Tests for general utility functions
- **cartesian-grid.spec.js** - Tests for grid operations (neighbors, flood fill, etc.)

### Redux State Management
- **main.actions.spec.js** - Tests for Redux action creators
- **main.reducer.spec.js** - Tests for Redux reducer logic

### React Components
- **cell.spec.jsx** - Tests for Cell component rendering
- **board.spec.jsx** - Tests for Board component and terrain rendering

## Test Coverage

The test suite covers 60 test cases including:
- Terrain parsing and creation from strings
- Grid neighbor calculations and pathfinding
- Redux state management and player movement
- React component rendering with various terrain types
- Utility functions for orientation and rotation

## Writing New Tests

Follow these conventions when adding new tests:

```javascript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

## Mocking

The test suite uses Vitest's built-in mocking capabilities:

```javascript
import { vi } from 'vitest';

// Mock a module
vi.mock('./module', () => ({
  default: () => 'mocked'
}));

// Mock a function
const mockFn = vi.fn();
```

## Configuration

Test configuration is defined in `vitest.config.js`. The setup includes:
- jsdom environment for DOM testing
- Global test setup in `src/test/setup.js`
- Coverage reporting with text, JSON, and HTML formats

## CI/CD Integration

Tests can be integrated into CI/CD pipelines using:

```bash
npm run test:run
```

This command runs all tests once and exits with the appropriate status code.
