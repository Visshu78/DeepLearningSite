import { describe, it, expect } from 'vitest';
import { computeSingleNeuron } from '../../lib/math/neuron';
import { sigmoid, sigmoidDerivative } from '../../lib/math/activations';

describe('Single Neuron Computation', () => {
  it('computes z = w1*x1 + w2*x2 + b and ReLU activation accurately', () => {
    const res = computeSingleNeuron({
      inputs: [1.5, -0.8],
      weights: [0.8, -1.2],
      bias: 0.2,
      activation: 'relu'
    });
    // 1.5 * 0.8 = 1.2
    // -0.8 * -1.2 = 0.96
    // sum = 2.16
    // z = 2.16 + 0.2 = 2.36
    expect(res.sumProducts).toBeCloseTo(2.16, 6);
    expect(res.z).toBeCloseTo(2.36, 6);
    expect(res.a).toBeCloseTo(2.36, 6);
    expect(res.activationDerivative).toBe(1.0);
  });

  it('computes sigmoid output and local derivatives for single neuron', () => {
    const res = computeSingleNeuron({
      inputs: [1.0, 2.0],
      weights: [0.5, 0.25],
      bias: 0.0,
      activation: 'sigmoid'
    });
    // z = 1.0 * 0.5 + 2.0 * 0.25 + 0.0 = 1.0
    expect(res.z).toBeCloseTo(1.0, 6);
    expect(res.a).toBeCloseTo(sigmoid(1.0), 6);
    expect(res.activationDerivative).toBeCloseTo(sigmoidDerivative(1.0), 6);
    expect(res.weightGradients[0]).toBeCloseTo(sigmoidDerivative(1.0) * 1.0, 6);
  });
});
