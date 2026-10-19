import { describe, it, expect } from 'vitest';
import { mseLoss, datasetMse, binaryCrossEntropy } from '../../lib/math/loss';

describe('Loss Functions & Derivatives', () => {
  it('computes single-sample scaled MSE L = 0.5(y_hat - y)^2 and derivative y_hat - y', () => {
    const target = 1.0;
    const prediction = 0.4;
    const { loss, derivative } = mseLoss(target, prediction);
    expect(loss).toBeCloseTo(0.18, 6); // 0.5 * (-0.6)^2 = 0.18
    expect(derivative).toBeCloseTo(-0.6, 6);
  });

  it('computes dataset MSE', () => {
    const data = [
      { target: 1.0, prediction: 0.5 }, // (0.5)^2 = 0.25
      { target: 2.0, prediction: 1.0 }, // (1.0)^2 = 1.00
      { target: 3.0, prediction: 4.0 }, // (1.0)^2 = 1.00
    ];
    const { totalMse, itemErrors } = datasetMse(data);
    expect(itemErrors[0]).toBeCloseTo(0.25, 6);
    expect(totalMse).toBeCloseTo((0.25 + 1.0 + 1.0) / 3, 6);
  });

  it('computes binary cross entropy loss and derivative', () => {
    const { loss, derivative } = binaryCrossEntropy(1.0, 0.8);
    expect(loss).toBeCloseTo(-Math.log(0.8), 5);
    expect(derivative).toBeCloseTo((0.8 - 1.0) / (0.8 * 0.2), 4);
  });
});
