import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock AFRAME for tests
global.AFRAME = {
  registerComponent: () => {},
  registerSystem: () => {},
  registerShader: () => {},
  schema: {
    process: (val) => val
  }
};

// Mock window.localStorage
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
};
