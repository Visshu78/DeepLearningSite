import { describe, it, expect } from 'vitest';
import {
  computeVectorAndMatrixOps,
  computeSurfaceGradientStep,
  computeChainRuleDag,
  computeProbabilityAndLikelihood,
  computeMatrixAlgebra2x2,
  multiplyMat2x2,
  computeNormsAndDistances,
  computeSymmetric2x2EigenPCA,
  computeJacobianAndHessian,
  computeBayesTheorem,
  computeCovarianceAndCorrelation,
  computeBinomialPmf,
  computeUniformPdf,
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

  it('0.5 Matrix multiplication, transpose, inverse, and non-commutativity', () => {
    const A: [[number, number], [number, number]] = [
      [2, 1],
      [1, 3],
    ];
    const B: [[number, number], [number, number]] = [
      [0, -1],
      [1, 0],
    ];
    const res = computeMatrixAlgebra2x2(A, B, [1, 2]);
    expect(res.commutes).toBe(false);
    expect(res.determinantA).toBeCloseTo(5, 8);
    expect(res.isInvertible).toBe(true);
    expect(res.transposeA).toEqual([
      [2, 1],
      [1, 3],
    ]);
    const eye = multiplyMat2x2(A, res.inverseA!);
    expect(eye[0][0]).toBeCloseTo(1, 8);
    expect(eye[0][1]).toBeCloseTo(0, 8);
    expect(eye[1][0]).toBeCloseTo(0, 8);
    expect(eye[1][1]).toBeCloseTo(1, 8);

    const singular = computeMatrixAlgebra2x2(
      [
        [1, 2],
        [2, 4],
      ],
      B,
      [1, 1]
    );
    expect(singular.isInvertible).toBe(false);
    expect(singular.inverseA).toBeNull();
  });

  it('0.6 L1/L2 norms, Euclidean distance, and 2x2 PCA eigendecomposition', () => {
    const nd = computeNormsAndDistances([3, -4], [0, 0]);
    expect(nd.l1NormU).toBeCloseTo(7, 8);
    expect(nd.l2NormU).toBeCloseTo(5, 8);
    expect(nd.l2Distance).toBeCloseTo(5, 8);

    const pca = computeSymmetric2x2EigenPCA(2.0, 2.0, 1.2);
    expect(pca.lambda1).toBeCloseTo(3.2, 8);
    expect(pca.lambda2).toBeCloseTo(0.8, 8);
    expect(pca.explainedVarianceRatio1 + pca.explainedVarianceRatio2).toBeCloseTo(1, 8);
    // Eigenvectors are orthogonal
    const dot = pca.eigvec1[0] * pca.eigvec2[0] + pca.eigvec1[1] * pca.eigvec2[1];
    expect(dot).toBeCloseTo(0, 8);
  });

  it('0.7 Jacobian and Hessian match finite differences and classify saddle/minimum', () => {
    const x = 1.1;
    const y = -0.7;
    const res = computeJacobianAndHessian(x, y, 2.0, 0.5, 1.0);
    expect(res.curvatureType).toBe('minimum');
    expect(res.conditionNumber).toBeGreaterThanOrEqual(1);

    const h = 1e-6;
    const fpx = computeJacobianAndHessian(x + h, y, 2.0, 0.5, 1.0).fVec;
    const fmx = computeJacobianAndHessian(x - h, y, 2.0, 0.5, 1.0).fVec;
    const fpy = computeJacobianAndHessian(x, y + h, 2.0, 0.5, 1.0).fVec;
    const fmy = computeJacobianAndHessian(x, y - h, 2.0, 0.5, 1.0).fVec;

    expect(res.jacobian[0][0]).toBeCloseTo((fpx[0] - fmx[0]) / (2 * h), 5);
    expect(res.jacobian[0][1]).toBeCloseTo((fpy[0] - fmy[0]) / (2 * h), 5);
    expect(res.jacobian[1][0]).toBeCloseTo((fpx[1] - fmx[1]) / (2 * h), 5);
    expect(res.jacobian[1][1]).toBeCloseTo((fpy[1] - fmy[1]) / (2 * h), 5);

    const saddle = computeJacobianAndHessian(x, y, 1.0, 0.0, -1.0);
    expect(saddle.curvatureType).toBe('saddle');
  });

  it('0.8 Bayes theorem, covariance/correlation, Binomial PMF, and Uniform PDF', () => {
    const bayes = computeBayesTheorem(0.01, 0.99, 0.05);
    // 0.0099 / (0.0099 + 0.0495) = 0.166666...
    expect(bayes.posteriorHgivenE).toBeCloseTo(1 / 6, 5);

    const corr = computeCovarianceAndCorrelation([1, 2, 3, 4], [2, 4, 6, 8]);
    expect(corr.correlationR).toBeCloseTo(1, 8);
    expect(corr.covariance).toBeCloseTo(2.5, 8);

    const binom = computeBinomialPmf(5, 0.5);
    expect(binom.length).toBe(6);
    expect(binom.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 8);

    const unif = computeUniformPdf(2.5, 1, 5);
    expect(unif.pdf).toBeCloseTo(0.25, 8);
    expect(unif.mean).toBeCloseTo(3, 8);
  });
});
