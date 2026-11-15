import { describe, it, expect } from 'vitest';
import {
  computeInitializationPropagation,
  computeNormalizationForwardBackward,
  computeLearningRateAtStep,
  computeTrainingDiagnostics,
} from '../../lib/math/trainingDynamics';

describe('Track 3: Training Neural Networks Well Analytical Math Engine', () => {
  it('3.1 Xavier preserves linear variance (=1) and He preserves ReLU variance (=1) across 10 layers', () => {
    const fanIn = 64;
    const xavierSigma = Math.sqrt(1 / fanIn);
    const heSigma = Math.sqrt(2 / fanIn);

    const xavierRun = computeInitializationPropagation(fanIn, xavierSigma, 10);
    expect(xavierRun.finalRatioLinear).toBeCloseTo(1.0, 9);
    // Under ReLU, Xavier halves variance every layer: (0.5)^10 = 1/1024
    expect(xavierRun.finalRatioRelu).toBeCloseTo(Math.pow(0.5, 10), 9);

    const heRun = computeInitializationPropagation(fanIn, heSigma, 10);
    expect(heRun.finalRatioRelu).toBeCloseTo(1.0, 9);
  });

  it('3.2 BatchNorm / LayerNorm forward statistics and analytical backward gradients match finite differences', () => {
    const x = [2.0, -1.0, 0.5, 4.5];
    const gamma = 1.4;
    const beta = -0.3;
    const dy = [0.7, -0.2, 1.1, -0.5]; // non-uniform upstream gradients

    const res = computeNormalizationForwardBackward(x, gamma, beta, dy, 1e-5);

    // Normalized xHat has zero mean and unit variance
    const xHatMean = res.xHat.reduce((a, b) => a + b, 0) / x.length;
    const xHatVar = res.xHat.reduce((a, b) => a + b * b, 0) / x.length;
    expect(xHatMean).toBeCloseTo(0, 9);
    expect(xHatVar).toBeCloseTo(1, 4);

    // Verify dL/dx_i against central finite differences of L = sum_j dy_j * y_j
    const lossFn = (xVec: number[], g: number, b: number) => {
      const out = computeNormalizationForwardBackward(xVec, g, b, dy, 1e-5);
      return out.yOut.reduce((acc, yVal, idx) => acc + yVal * dy[idx], 0);
    };

    const h = 1e-6;
    for (let i = 0; i < x.length; i++) {
      const xPlus = x.map((v, idx) => (idx === i ? v + h : v));
      const xMinus = x.map((v, idx) => (idx === i ? v - h : v));
      const fdGradX = (lossFn(xPlus, gamma, beta) - lossFn(xMinus, gamma, beta)) / (2 * h);
      expect(res.gradX[i]).toBeCloseTo(fdGradX, 6);
    }

    const fdGamma = (lossFn(x, gamma + h, beta) - lossFn(x, gamma - h, beta)) / (2 * h);
    const fdBeta = (lossFn(x, gamma, beta + h) - lossFn(x, gamma, beta - h)) / (2 * h);
    expect(res.gradGamma).toBeCloseTo(fdGamma, 6);
    expect(res.gradBeta).toBeCloseTo(fdBeta, 6);
  });

  it('3.5 Linear warmup + Cosine annealing hits exact boundary values at t=0, t=W, Midpoint, and t=T', () => {
    const T = 100;
    const W = 20;
    const lrMax = 0.01;
    const lrMin = 0.001;

    expect(computeLearningRateAtStep(0, T, W, lrMax, lrMin).warmupCosineLr).toBeCloseTo(0, 9);
    expect(computeLearningRateAtStep(10, T, W, lrMax, lrMin).warmupCosineLr).toBeCloseTo(0.005, 9);
    expect(computeLearningRateAtStep(W, T, W, lrMax, lrMin).warmupCosineLr).toBeCloseTo(lrMax, 9);
    // Halfway through cosine phase (step 60 out of [20..100]), cos(pi/2) = 0 -> midpoint (lrMax+lrMin)/2
    expect(computeLearningRateAtStep(60, T, W, lrMax, lrMin).warmupCosineLr).toBeCloseTo(
      0.5 * (lrMax + lrMin),
      9
    );
    expect(computeLearningRateAtStep(T, T, W, lrMax, lrMin).warmupCosineLr).toBeCloseTo(lrMin, 9);
  });

  it('3.6 Training diagnostics and global gradient norm clipping', () => {
    const diag = computeTrainingDiagnostics(8.0, 0.2, [3.0, 4.0], 2.5, [-1.2, 0.5, -0.1, 2.0]);
    expect(diag.gradNormRaw).toBeCloseTo(5.0, 8);
    expect(diag.gradNormClipped).toBeCloseTo(2.5, 8);
    expect(diag.clipScaleFactor).toBeCloseTo(0.5, 8);
    expect(diag.deadReluFraction).toBeCloseTo(0.5, 8);
    expect(diag.diagnosis).toBe('Overfitting');
  });
});
