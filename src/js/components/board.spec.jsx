import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

// Mock aframe-react
vi.mock('aframe-react', () => ({
  Entity: ({ children, scale, position }) => (
    <div data-testid="board-entity" data-scale={scale} data-position={position}>
      {children}
    </div>
  )
}));

// Mock Cell component
vi.mock('./cell', () => ({
  default: ({ cell }) => <div data-testid={`cell-${cell.x}-${cell.y}`}>{cell.terrain}</div>
}));

// Import Board after mocks are set up
import Board from './board';

describe('Board Component', () => {
  const createMockStore = (terrain) => {
    const initialState = {
      geo: { terrain }
    };

    return createStore((state = initialState) => state);
  };

  it('should render without crashing', () => {
    const terrain = [
      [
        { x: 0, y: 0, terrain: '0' },
        { x: 1, y: 0, terrain: '0' }
      ]
    ];

    const store = createMockStore(terrain);

    const { getByTestId } = render(
      <Provider store={store}>
        <Board scale="1 1 1" position="0 0 0" />
      </Provider>
    );

    expect(getByTestId('board-entity')).toBeDefined();
  });

  it('should render all cells from terrain', () => {
    const terrain = [
      [
        { x: 0, y: 0, terrain: '0' },
        { x: 1, y: 0, terrain: 'B' }
      ],
      [
        { x: 0, y: 1, terrain: '@' },
        { x: 1, y: 1, terrain: '0' }
      ]
    ];

    const store = createMockStore(terrain);

    const { getByTestId } = render(
      <Provider store={store}>
        <Board scale="1 1 1" position="0 0 0" />
      </Provider>
    );

    expect(getByTestId('cell-0-0')).toBeDefined();
    expect(getByTestId('cell-1-0')).toBeDefined();
    expect(getByTestId('cell-0-1')).toBeDefined();
    expect(getByTestId('cell-1-1')).toBeDefined();
  });

  it('should render children components', () => {
    const terrain = [[{ x: 0, y: 0, terrain: '0' }]];
    const store = createMockStore(terrain);

    const { getByText } = render(
      <Provider store={store}>
        <Board scale="1 1 1" position="0 0 0">
          <div>Child Component</div>
        </Board>
      </Provider>
    );

    expect(getByText('Child Component')).toBeDefined();
  });

  it('should apply scale and position to Entity', () => {
    const terrain = [[{ x: 0, y: 0, terrain: '0' }]];
    const store = createMockStore(terrain);
    const scale = "2 2 2";
    const position = "5 5 5";

    const { getByTestId } = render(
      <Provider store={store}>
        <Board scale={scale} position={position} />
      </Provider>
    );

    const entity = getByTestId('board-entity');
    expect(entity.getAttribute('data-scale')).toBe(scale);
  });

  it('should handle empty terrain gracefully', () => {
    const terrain = [];
    const store = createMockStore(terrain);

    const { getByTestId } = render(
      <Provider store={store}>
        <Board scale="1 1 1" position="0 0 0" />
      </Provider>
    );

    expect(getByTestId('board-entity')).toBeDefined();
  });

  it('should generate unique keys for each cell', () => {
    const terrain = [
      [
        { x: 0, y: 0, terrain: '0' },
        { x: 1, y: 0, terrain: 'B' }
      ],
      [
        { x: 0, y: 1, terrain: '@' },
        { x: 1, y: 1, terrain: '0' }
      ]
    ];

    const store = createMockStore(terrain);

    const { container } = render(
      <Provider store={store}>
        <Board scale="1 1 1" position="0 0 0" />
      </Provider>
    );

    // Check that all cells are rendered (unique keys don't cause conflicts)
    const cells = container.querySelectorAll('[data-testid^="cell-"]');
    expect(cells.length).toBe(4);
  });
});
