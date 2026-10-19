import { describe, it, expect } from 'vitest';
import {
  sigmoid,
  sigmoidDerivative,
  tanh,
  tanhDerivative,
  relu,
  reluDerivative,
  leakyRelu,
  leakyReluDerivative
} from '../../lib/math/activations';

describe('Activation Functions & Derivatives', () => {
  it('sigmoid maps zero to 0.5 and calculates exact derivative', () => {
    expect(sigmoid(0)).toBeCloseTo(0.5, 6);
    expect(sigmoidDerivative(0)).toBeCloseTo(0.25, 6);
    expect(sigmoid(10)).toBeGreaterThan(0.999);
    expect(sigmoid(-10)).toBeLessThan(0.001);
  });

  it('tanh maps zero to 0 and calculates derivative 1 - tanh^2', () => {
    expect(tanh(0)).toBeCloseTo(0, 6);
    expect(tanhDerivative(0)).toBeCloseTo(1, 6);
    expect(tanh(3)).toBeGreaterThan(0.99);
    expect(tanh(-3)).toBeLessThan(-0.99);
  });

  it('relu zeroes negative numbers and passes positive numbers', () => {
    expect(relu(-4)).toBe(0);
    expect(relu(0)).toBe(0);
    expect(relu(3.5)).toBe(3.5);
    expect(reluDerivative(-2)).toBe(0);
    expect(reluDerivative(2)).toBe(1);
  });

  it('leaky relu retains slope alpha for negative numbers', () => {
    expect(leakyRelu(-4, 0.01)).toBeCloseTo(-0.04, 6);
    expect(leakyRelu(4, 0.01)).toBe(4);
    expect(leakyReluDerivative(-4, 0.01)).toBe(0.01);
    expect(leakyReluDerivative(4, 0.01)).toBe(1);
  });
});
