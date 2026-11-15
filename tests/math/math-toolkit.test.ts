import { describe, it, expect } from 'vitest';
import {
  computeVectorAndMatrixOps,
  computeSurfaceGradientStep,
  computeChainRuleDag,
  computeProbabilityAndLikelihood,
} from '../../lib/math/mathToolkit';

describe('Track 0: Math Toolkit Analytical Math Engine', () => {
  it('0.1 Dot product, cosine similarity, angle, and 2x2 determinant', () => {
    const res = computeVectorAndMatrixOps(
      [3, 4],
      [4, -3],
      [
        [2, 1],
        [1, 3],
      ]
    );
    expect(res.normA).toBeCloseTo(5, 8);
    expect(res.normB).toBeCloseTo(5, 8);
    expect(res.dotProduct).toBeCloseTo(0, 8);
    expect(res.cosineSimilarity).toBeCloseTo(0, 8);
    expect(res.angleDegrees).toBeCloseTo(90, 8);
    expect(res.matrixTransformedA).toEqual([10, 15]);
    expect(res.matrixDeterminant).toBeCloseTo(5, 8);
  });

  it('0.2 Partial derivatives of 2D surface match finite differences and step reduces f(x,y)', () => {
    const x = 1.8;
    const y = -1.2;
    const res = computeSurfaceGradientStep(x, y, 1.5, 0.8, 2.0, 0.05);
    expect(res.fAfterStep).toBeLessThan(res.fValue);

    const h = 1e-6;
    const fdX =
      (computeSurfaceGradientStep(x + h, y, 1.5, 0.8, 2.0).fValue -
        computeSurfaceGradientStep(x - h, y, 1.5, 0.8, 2.0).fValue) /
      (2 * h);
    const fdY =
      (computeSurfaceGradientStep(x, y + h, 1.5, 0.8, 2.0).fValue -
        computeSurfaceGradientStep(x, y - h, 1.5, 0.8, 2.0).fValue) /
      (2 * h);

    expect(res.df_dx).toBeCloseTo(fdX, 6);
    expect(res.df_dy).toBeCloseTo(fdY, 6);
  });

  it('0.3 Multi-path Chain Rule DAG total derivative matches finite differences', () => {
    const x = 1.3;
    const dag = computeChainRuleDag(x, 1.5, 0.4);
    const h = 1e-6;
    const fd =
      (computeChainRuleDag(x + h, 1.5, 0.4).z -
        computeChainRuleDag(x - h, 1.5, 0.4).z) /
      (2 * h);
    expect(dag.totalDz_Dx).toBeCloseTo(fd, 6);
  });

  it('0.4 Bernoulli and Gaussian Negative Log-Likelihood derivatives match finite differences', () => {
    const p = 0.65;
    const mu = 1.2;
    const sigma = 0.85;
    const xObs = 2.0;
    const res = computeProbabilityAndLikelihood(p, 1, xObs, mu, sigma);

    const h = 1e-6;
    const fdP =
      (computeProbabilityAndLikelihood(p + h, 1, xObs, mu, sigma).bernoulliNll -
        computeProbabilityAndLikelihood(p - h, 1, xObs, mu, sigma).bernoulliNll) /
      (2 * h);
    const fdMu =
      (computeProbabilityAndLikelihood(p, 1, xObs, mu + h, sigma).gaussianNll -
        computeProbabilityAndLikelihood(p, 1, xObs, mu - h, sigma).gaussianNll) /
      (2 * h);
    const fdSigma =
      (computeProbabilityAndLikelihood(p, 1, xObs, mu, sigma + h).gaussianNll -
        computeProbabilityAndLikelihood(p, 1, xObs, mu, sigma - h).gaussianNll) /
      (2 * h);

    expect(res.dBernoulliNll_dp).toBeCloseTo(fdP, 6);
    expect(res.dGaussianNll_dMu).toBeCloseTo(fdMu, 6);
    expect(res.dGaussianNll_dSigma).toBeCloseTo(fdSigma, 6);
  });
});
