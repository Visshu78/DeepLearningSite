import { describe, it, expect } from 'vitest';
import { LANDSCAPE_PRESETS, performOptimizationStep } from '../../lib/math/optimizer';

describe('1D Optimization Landscapes & Gradient Descent', () => {
  it('correctly calculates step on convex quadratic bowl', () => {
    const landscape = LANDSCAPE_PRESETS.convex_quadratic;
    // L(theta) = 0.5 * (theta - 2)^2. Min at theta = 2.
    // At theta = 5, L = 0.5 * 9 = 4.5, grad = 3.
    const step = performOptimizationStep(landscape, 5, 0.2, 1);
    expect(step.loss).toBeCloseTo(4.5, 6);
    expect(step.gradient).toBeCloseTo(3.0, 6);
    expect(step.update).toBeCloseTo(-0.6, 6);
    expect(step.nextTheta).toBeCloseTo(4.4, 6);
  });

  it('correctly evaluates true double-well potential global minimum near -1.05', () => {
    const landscape = LANDSCAPE_PRESETS.double_well;
    // Derivative at theta = -1.0467 should be approximately zero
    const gradNearGlobalMin = landscape.derivative(-1.0467);
    expect(Math.abs(gradNearGlobalMin)).toBeLessThan(0.01);

    const lossGlobal = landscape.evaluate(-1.0467);
    const lossLocal = landscape.evaluate(0.9462);
    // Global minimum loss must be lower than local minimum loss
    expect(lossGlobal).toBeLessThan(lossLocal);
  });

  it('flags divergence when theta exceeds stability threshold', () => {
    const landscape = LANDSCAPE_PRESETS.convex_quadratic;
    const step = performOptimizationStep(landscape, 45, 0.2, 1);
    expect(step.isDiverged).toBe(true);
  });
});
