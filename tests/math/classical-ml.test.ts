import { describe, it, expect } from 'vitest';
import {
  computeLinearRegression,
  computeLogisticRegressionStep,
  computeBiasVarianceDecomposition,
  computeDecisionTreeSplit,
  computeKMeansAndPca,
} from '../../lib/math/classicalMl';

describe('Track 1: Classical ML Analytical Math Engine', () => {
  it('1.1 Linear Regression OLS optimum has zero gradient and matches finite differences', () => {
    const xs = [1, 2, 3, 4, 5];
    const ys = [35, 50, 65, 80, 95]; // Exact line y = 15x + 20
    const opt = computeLinearRegression(xs, ys, 15, 20);

    expect(opt.wOpt).toBeCloseTo(15, 8);
    expect(opt.bOpt).toBeCloseTo(20, 8);
    expect(opt.mseLoss).toBeCloseTo(0, 8);
    expect(opt.rSquared).toBeCloseTo(1.0, 8);
    expect(opt.gradW).toBeCloseTo(0, 8);
    expect(opt.gradB).toBeCloseTo(0, 8);

    // Check gradients at non-optimal (w=12, b=15) against finite differences
    const nonOpt = computeLinearRegression(xs, ys, 12, 15);
    const h = 1e-6;
    const fdW =
      (computeLinearRegression(xs, ys, 12 + h, 15).mseLoss -
        computeLinearRegression(xs, ys, 12 - h, 15).mseLoss) /
      (2 * h);
    const fdB =
      (computeLinearRegression(xs, ys, 12, 15 + h).mseLoss -
        computeLinearRegression(xs, ys, 12, 15 - h).mseLoss) /
      (2 * h);
    expect(nonOpt.gradW).toBeCloseTo(fdW, 6);
    expect(nonOpt.gradB).toBeCloseTo(fdB, 6);
  });

  it('1.2 Logistic Regression BCE loss derivatives match finite differences', () => {
    const x = 2.5;
    const y: 0 | 1 = 1;
    const w = 0.6;
    const b = -0.4;
    const step = computeLogisticRegressionStep(x, y, w, b);

    const h = 1e-6;
    const fdW =
      (computeLogisticRegressionStep(x, y, w + h, b).bceLoss -
        computeLogisticRegressionStep(x, y, w - h, b).bceLoss) /
      (2 * h);
    const fdB =
      (computeLogisticRegressionStep(x, y, w, b + h).bceLoss -
        computeLogisticRegressionStep(x, y, w, b - h).bceLoss) /
      (2 * h);

    expect(step.gradW).toBeCloseTo(fdW, 6);
    expect(step.gradB).toBeCloseTo(fdB, 6);
  });

  it('1.3 Bias-Variance Decomposition equals Bias^2 + Variance + Noise', () => {
    const bv = computeBiasVarianceDecomposition(3.5, 0.4);
    expect(bv.irreducibleNoise).toBeCloseTo(0.16, 8);
    expect(bv.expectedTestError).toBeCloseTo(
      bv.biasSquared + bv.variance + bv.irreducibleNoise,
      9
    );
    expect(bv.regime).toBe('Optimal Trade-off');
  });

  it('1.4 Decision Tree Gini Impurity, Entropy, and Pure Split Information Gain', () => {
    // 5 positive, 5 negative split into pure left (5,0) and pure right (0,5)
    const pureSplit = computeDecisionTreeSplit(5, 0, 0, 5, 100, 0.2);
    expect(pureSplit.parentGini).toBeCloseTo(0.5, 8);
    expect(pureSplit.parentEntropyBits).toBeCloseTo(1.0, 8);
    expect(pureSplit.leftGini).toBeCloseTo(0.0, 8);
    expect(pureSplit.rightGini).toBeCloseTo(0.0, 8);
    expect(pureSplit.giniGain).toBeCloseTo(0.5, 8);
    expect(pureSplit.informationGainBits).toBeCloseTo(1.0, 8);
  });

  it('1.5 k-Means inertia and 2D PCA eigenvalues sum to trace of covariance matrix', () => {
    const pts: [number, number][] = [
      [-2, -2],
      [-1, -1],
      [1, 1],
      [2, 2],
    ];
    const res = computeKMeansAndPca(pts, [-1.5, -1.5], [1.5, 1.5]);
    expect(res.assignments).toEqual([0, 0, 1, 1]);
    // Points lie strictly on y = x, so 100% of variance is along PC1 (1/sqrt(2), 1/sqrt(2))
    expect(res.explainedVarianceRatio1).toBeCloseTo(1.0, 8);
    expect(res.lambda2).toBeCloseTo(0.0, 8);
  });
});
