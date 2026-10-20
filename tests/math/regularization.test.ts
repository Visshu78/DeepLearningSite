import { describe, it, expect } from 'vitest';
import { fitPolynomialRidge, evaluatePolynomial, calculateMSE, simulateInvertedDropout } from '../../lib/math/regularization';

describe('Regularization & Generalization Engine', () => {
  const points = [
    { x: -1, y: 1 },
    { x: 0, y: 0 },
    { x: 1, y: 1 }
  ];

  it('fits unregularized polynomial without penalty', () => {
    // Parabola y = x^2 (degree 2)
    const weights = fitPolynomialRidge(points, 2, 0);
    expect(weights.length).toBe(3);
    expect(Math.abs(weights[0])).toBeLessThan(0.01); // w_0 ≈ 0
    expect(Math.abs(weights[1])).toBeLessThan(0.01); // w_1 ≈ 0
    expect(Math.abs(weights[2] - 1.0)).toBeLessThan(0.01); // w_2 ≈ 1
  });

  it('dampens high polynomial weights when L2 lambda is applied', () => {
    const unregularized = fitPolynomialRidge(points, 2, 0);
    const regularized = fitPolynomialRidge(points, 2, 10.0);
    // Large lambda shrinks w_2
    expect(Math.abs(regularized[2])).toBeLessThan(Math.abs(unregularized[2]));
  });

  it('evaluates polynomial predictions and MSE correctly', () => {
    const weights = [1, 2]; // y = 1 + 2x
    expect(evaluatePolynomial(weights, 3)).toBe(7);
    const mse = calculateMSE(weights, [{ x: 3, y: 7 }, { x: 0, y: 1 }]);
    expect(mse).toBe(0);
  });

  it('applies inverted dropout scaling factor 1/(1-p)', () => {
    const activations = [1.0, 2.0, 3.0, 4.0];
    const res = simulateInvertedDropout(activations, 0.5, 42);
    expect(res.scaleFactor).toBe(2.0);
    expect(res.scaledActivations.length).toBe(4);
    // Active neurons should be scaled by 2.0, dropped neurons should be 0
    res.scaledActivations.forEach((val, i) => {
      if (res.mask[i] === 1) {
        expect(val).toBeCloseTo(activations[i] * 2.0, 1);
      } else {
        expect(val).toBe(0);
      }
    });
  });
});
