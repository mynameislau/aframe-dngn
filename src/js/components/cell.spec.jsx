import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import Cell from './cell';

// Mock the child components
vi.mock('./wall', () => ({ default: ({ cell, clickHandler }) => <div data-testid="wall">Wall</div> }));
vi.mock('./pillar', () => ({ default: ({ cell, clickHandler }) => <div data-testid="pillar">Pillar</div> }));
vi.mock('./floor', () => ({ default: ({ cell, clickHandler }) => <div data-testid="floor">Floor</div> }));
vi.mock('./door', () => ({ default: ({ cell, clickHandler }) => <div data-testid="door">Door</div> }));
vi.mock('./foe', () => ({ default: ({ cell, clickHandler }) => <div data-testid="foe">Foe</div> }));
vi.mock('./worm', () => ({ default: ({ cell, clickHandler }) => <div data-testid="worm">Worm</div> }));

// Mock aframe-react Entity component
vi.mock('aframe-react', () => ({
  Entity: ({ children, position }) => (
    <div data-testid="entity" data-position={position}>
      {children}
    </div>
  )
}));

describe('Cell Component', () => {
  const mockClickHandler = vi.fn();
  const mockBoard = [
    [{ x: 0, y: 0, terrain: '0' }]
  ];

  it('should render a Wall for terrain type B', () => {
    const cell = { x: 1, y: 2, terrain: 'B' };
    const { getByTestId } = render(
      <Cell cell={cell} clickHandler={mockClickHandler} board={mockBoard} />
    );

    expect(getByTestId('wall')).toBeDefined();
  });

  it('should render a Pillar for terrain type P', () => {
    const cell = { x: 1, y: 2, terrain: 'P' };
    const { getByTestId } = render(
      <Cell cell={cell} clickHandler={mockClickHandler} board={mockBoard} />
    );

    expect(getByTestId('pillar')).toBeDefined();
  });

  it('should render a Door for terrain type D', () => {
    const cell = { x: 1, y: 2, terrain: 'D' };
    const { getByTestId } = render(
      <Cell cell={cell} clickHandler={mockClickHandler} board={mockBoard} />
    );

    expect(getByTestId('door')).toBeDefined();
  });

  it('should render a Worm for terrain type W', () => {
    const cell = { x: 1, y: 2, terrain: 'W' };
    const { getByTestId } = render(
      <Cell cell={cell} clickHandler={mockClickHandler} board={mockBoard} />
    );

    expect(getByTestId('worm')).toBeDefined();
  });

  it('should render a Foe for terrain type F', () => {
    const cell = { x: 1, y: 2, terrain: 'F' };
    const { getByTestId } = render(
      <Cell cell={cell} clickHandler={mockClickHandler} board={mockBoard} />
    );

    expect(getByTestId('foe')).toBeDefined();
  });

  it('should render a Floor for terrain type @', () => {
    const cell = { x: 1, y: 2, terrain: '@' };
    const { getByTestId } = render(
      <Cell cell={cell} clickHandler={mockClickHandler} board={mockBoard} />
    );

    expect(getByTestId('floor')).toBeDefined();
  });

  it('should render a Floor for terrain type .', () => {
    const cell = { x: 1, y: 2, terrain: '.' };
    const { getByTestId } = render(
      <Cell cell={cell} clickHandler={mockClickHandler} board={mockBoard} />
    );

    expect(getByTestId('floor')).toBeDefined();
  });

  it('should position the entity correctly', () => {
    const cell = { x: 3, y: 5, terrain: 'B' };
    const { getByTestId } = render(
      <Cell cell={cell} clickHandler={mockClickHandler} board={mockBoard} />
    );

    const entity = getByTestId('entity');
    expect(entity.getAttribute('data-position')).toBe('3 0 -5');
  });

  it('should render an Entity for unknown terrain types', () => {
    const cell = { x: 1, y: 2, terrain: 'X' };
    const { getAllByTestId } = render(
      <Cell cell={cell} clickHandler={mockClickHandler} board={mockBoard} />
    );

    const entities = getAllByTestId('entity');
    expect(entities.length).toBeGreaterThan(0);
  });
});
