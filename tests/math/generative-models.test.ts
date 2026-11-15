import { describe, it, expect } from 'vitest';
import {
  computeAutoencoderPass,
  computeVaeLatentStep,
  computeGanObjectives,
  computeDiffusionClosedForm,
} from '../../lib/math/generativeModels';

describe('Track 7: Generative Models Analytical Math Engine', () => {
  it('7.1 Autoencoder reconstruction MSE and analytical decoder gradient match finite differences', () => {
    const x = [0.8, -0.4, 0.5, 0.2];
    const wEnc = [
      [0.5, -0.2, 0.3, 0.1],
      [-0.3, 0.6, 0.2, -0.4],
    ];
    const wDec = [
      [0.6, -0.2],
      [-0.4, 0.5],
      [0.3, 0.3],
      [0.1, -0.5],
    ];

    const res = computeAutoencoderPass(x, wEnc, wDec);
    expect(res.compressionRatio).toBe(2);

    const h = 1e-6;
    const wDecPlus = wDec.map((row, r) =>
      row.map((val, c) => (r === 1 && c === 0 ? val + h : val))
    );
    const wDecMinus = wDec.map((row, r) =>
      row.map((val, c) => (r === 1 && c === 0 ? val - h : val))
    );
    const fdGrad =
      (computeAutoencoderPass(x, wEnc, wDecPlus).mseLoss -
        computeAutoencoderPass(x, wEnc, wDecMinus).mseLoss) /
      (2 * h);
    expect(res.gradWDec[1][0]).toBeCloseTo(fdGrad, 6);
  });

  it('7.2 VAE KL divergence and reparameterization derivatives match finite differences', () => {
    const mu = 0.7;
    const logVar = -0.4;
    const eps = 1.25;
    const step = computeVaeLatentStep(mu, logVar, eps);

    // At standard normal (mu=0, logVar=0), KL divergence is exactly 0
    expect(computeVaeLatentStep(0, 0, eps).klDivergence).toBeCloseTo(0, 9);

    const h = 1e-6;
    const fdKlMu =
      (computeVaeLatentStep(mu + h, logVar, eps).klDivergence -
        computeVaeLatentStep(mu - h, logVar, eps).klDivergence) /
      (2 * h);
    const fdKlLogVar =
      (computeVaeLatentStep(mu, logVar + h, eps).klDivergence -
        computeVaeLatentStep(mu, logVar - h, eps).klDivergence) /
      (2 * h);
    const fdZLogVar =
      (computeVaeLatentStep(mu, logVar + h, eps).zSample -
        computeVaeLatentStep(mu, logVar - h, eps).zSample) /
      (2 * h);

    expect(step.dKl_dMu).toBeCloseTo(fdKlMu, 6);
    expect(step.dKl_dLogVar).toBeCloseTo(fdKlLogVar, 6);
    expect(step.dz_dLogVar).toBeCloseTo(fdZLogVar, 6);
  });

  it('7.3 GAN minimax vs non-saturating gradients and Nash equilibrium D*(x) = 0.5', () => {
    const realLogit = 1.5;
    const fakeLogit = -3.0; // Discriminator rejects fake strongly
    const res = computeGanObjectives(realLogit, fakeLogit, 0.4, 0.4);

    // At p_data = p_g = 0.4, optimal discriminator is 0.5
    expect(res.optimalDiscriminatorAtDensity).toBeCloseTo(0.5, 8);

    // Non-saturating loss has much stronger gradient magnitude when D(G(z)) is small
    expect(Math.abs(res.dGenNonSat_dFakeLogit)).toBeGreaterThan(
      10 * Math.abs(res.dGenMinimax_dFakeLogit)
    );

    const h = 1e-6;
    const fdMinimax =
      (computeGanObjectives(realLogit, fakeLogit + h).generatorMinimaxLoss -
        computeGanObjectives(realLogit, fakeLogit - h).generatorMinimaxLoss) /
      (2 * h);
    const fdNonSat =
      (computeGanObjectives(realLogit, fakeLogit + h).generatorNonSaturatingLoss -
        computeGanObjectives(realLogit, fakeLogit - h).generatorNonSaturatingLoss) /
      (2 * h);

    expect(res.dGenMinimax_dFakeLogit).toBeCloseTo(fdMinimax, 6);
    expect(res.dGenNonSat_dFakeLogit).toBeCloseTo(fdNonSat, 6);
  });

  it('7.4 DDPM closed-form noisy sample and exact x0 reconstruction when epsPred == epsTrue', () => {
    const x0 = 0.85;
    const alphaBar = 0.36;
    const epsTrue = -0.6;
    const perfect = computeDiffusionClosedForm(x0, alphaBar, epsTrue, epsTrue);

    expect(perfect.signalScale).toBeCloseTo(0.6, 6);
    expect(perfect.noiseScale).toBeCloseTo(0.8, 6);
    expect(perfect.x0Reconstructed).toBeCloseTo(x0, 6);
    expect(perfect.scoreLossMse).toBeCloseTo(0, 9);

    const noisyPred = computeDiffusionClosedForm(x0, alphaBar, epsTrue, 0.1);
    const h = 1e-6;
    const fdGrad =
      (computeDiffusionClosedForm(x0, alphaBar, epsTrue, 0.1 + h).scoreLossMse -
        computeDiffusionClosedForm(x0, alphaBar, epsTrue, 0.1 - h).scoreLossMse) /
      (2 * h);
    expect(noisyPred.dLoss_dEpsPred).toBeCloseTo(fdGrad, 6);
  });
});
