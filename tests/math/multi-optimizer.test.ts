import { describe, it, expect } from 'vitest';
import {
  RAVINE_LANDSCAPE,
  initOptimizerState2D,
  stepOptimizer2D
} from '../../lib/math/optimizer';

describe('Multi-Optimizer Benchmark Engine (2D Ravine)', () => {
  it('initializes optimizer state at default coordinates', () => {
    const state = initOptimizerState2D('adam', -3, 1);
    expect(state.algorithm).toBe('adam');
    expect(state.x).toBe(-3);
    expect(state.y).toBe(1);
    expect(state.step).toBe(0);
    expect(state.history.length).toBe(1);
  });

  it('runs Adam steps and reduces loss on ravine landscape', () => {
    let state = initOptimizerState2D('adam', -3.0, 1.5);
    const initialLoss = state.history[0].loss;

    for (let i = 0; i < 20; i++) {
      state = stepOptimizer2D(state, RAVINE_LANDSCAPE, 0.1);
    }

    const finalLoss = state.history[state.history.length - 1].loss;
    expect(finalLoss).toBeLessThan(initialLoss);
    expect(Math.abs(state.x)).toBeLessThan(3.0);
  });

  it('momentum accumulates velocity in consistent gradient directions', () => {
    let state = initOptimizerState2D('momentum', -2.0, 0.0);
    state = stepOptimizer2D(state, RAVINE_LANDSCAPE, 0.05, 0.9);
    // Gradient gx = -2.0, so velocity vx becomes negative (moving in +x direction)
    expect(state.vx).toBeLessThan(0);
  });
});
