/**
 * Pure analytical mathematical engine for Track 7: Generative Models
 * (Lessons 7.1 to 7.4: Autoencoders, VAEs, GANs, and Diffusion Models).
 *
 * Every forward computation, KL divergence, reparameterization gradient,
 * GAN minimax derivative, and DDPM forward/reverse step is derived from
 * exact analytical equations and verified via automated unit tests.
 */

const EPS = 1e-12;

// ============================================================================
// LESSON 7.1: AUTOENCODERS (BOTTLENECK COMPRESSION & RECONSTRUCTION)
// ============================================================================

export interface AutoencoderResult {
  latentCode: number[];
  reconstructed: number[];
  mseLoss: number;
  gradWDec: number[][];
  compressionRatio: number;
}

/**
 * Computes a 1-hidden-layer Autoencoder pass:
 *   z = tanh(W_enc * x)      in R^d
 *   x_hat = W_dec * z        in R^D
 *   L_MSE = (1 / D) * sum_{i=1}^D (x_hat_i - x_i)^2
 * And exact analytical gradient w.r.t decoder weights:
 *   dL / dW_dec[i][j] = (2 / D) * (x_hat_i - x_i) * z_j
 */
export function computeAutoencoderPass(
  x: number[],
  wEnc: number[][],
  wDec: number[][]
): AutoencoderResult {
  const D = x.length;
  const d = wEnc.length;

  const latentCode = wEnc.map(row => {
    const sum = row.reduce((acc, w, j) => acc + w * (x[j] ?? 0), 0);
    return Math.tanh(sum);
  });

  const reconstructed = wDec.map(row =>
    row.reduce((acc, w, k) => acc + w * (latentCode[k] ?? 0), 0)
  );

  let sqErrSum = 0;
  for (let i = 0; i < D; i++) {
    const diff = (reconstructed[i] ?? 0) - (x[i] ?? 0);
    sqErrSum += diff * diff;
  }
  const mseLoss = D > 0 ? sqErrSum / D : 0;

  const gradWDec: number[][] = [];
  for (let i = 0; i < D; i++) {
    const dL_dxHat = (2 / D) * ((reconstructed[i] ?? 0) - (x[i] ?? 0));
    gradWDec.push(latentCode.map(z_k => dL_dxHat * z_k));
  }

  return {
    latentCode,
    reconstructed,
    mseLoss,
    gradWDec,
    compressionRatio: d > 0 ? D / d : 1,
  };
}

// ============================================================================
// LESSON 7.2: VARIATIONAL AUTOENCODERS (VAEs, REPARAMETERIZATION & KL)
// ============================================================================

export interface VaeStepResult {
  sigma: number;
  zSample: number;
  klDivergence: number;
  dz_dMu: number;
  dz_dLogVar: number;
  dKl_dMu: number;
  dKl_dLogVar: number;
  totalElboLoss: number;
}

/**
 * Evaluates a 1D Variational Autoencoder latent Gaussian N(mu, sigma^2)
 * parameterized by mu and s = log(sigma^2):
 *   sigma = exp(0.5 * s)
 *   z = mu + sigma * eps     (Reparameterization Trick, eps ~ N(0, 1))
 *   D_KL(N(mu, sigma^2) || N(0, 1)) = -0.5 * (1 + s - mu^2 - exp(s))
 * Analytical derivatives:
 *   dz / dmu = 1
 *   dz / ds  = 0.5 * sigma * eps
 *   dKL / dmu = mu
 *   dKL / ds  = 0.5 * (exp(s) - 1)
 */
export function computeVaeLatentStep(
  mu: number,
  logVar: number,
  eps: number,
  reconMse: number = 0.25,
  betaKl: number = 1.0
): VaeStepResult {
  const sigma = Math.exp(0.5 * logVar);
  const zSample = mu + sigma * eps;
  const variance = Math.exp(logVar);
  const klDivergence = -0.5 * (1 + logVar - mu * mu - variance);

  return {
    sigma,
    zSample,
    klDivergence,
    dz_dMu: 1.0,
    dz_dLogVar: 0.5 * sigma * eps,
    dKl_dMu: mu,
    dKl_dLogVar: 0.5 * (variance - 1),
    totalElboLoss: reconMse + betaKl * klDivergence,
  };
}

// ============================================================================
// LESSON 7.3: GENERATIVE ADVERSARIAL NETWORKS (MINIMAX & NON-SATURATING LOSS)
// ============================================================================

export interface GanStepResult {
  dRealProb: number;
  dFakeProb: number;
  discriminatorLoss: number;
  generatorMinimaxLoss: number;
  generatorNonSaturatingLoss: number;
  dGenMinimax_dFakeLogit: number;
  dGenNonSat_dFakeLogit: number;
  optimalDiscriminatorAtDensity: number;
}

function sigmoid(z: number): number {
  if (z >= 0) {
    const ez = Math.exp(-z);
    return 1 / (1 + ez);
  }
  const ez = Math.exp(z);
  return ez / (1 + ez);
}

/**
 * Evaluates GAN Discriminator and Generator objectives from logits:
 *   D(x)    = sigma(realLogit)
 *   D(G(z)) = sigma(fakeLogit)
 *   L_D     = -(log D(x) + log(1 - D(G(z))))
 *   L_G^minimax = log(1 - D(G(z)))
 *   L_G^nonsat  = -log(D(G(z)))
 * Analytical derivatives w.r.t fakeLogit z_fake (since d sigma(z)/dz = D(1-D)):
 *   d L_G^minimax / d z_fake = -D(G(z))
 *   d L_G^nonsat  / d z_fake = D(G(z)) - 1
 * Notice that when the Discriminator easily rejects fakes (D(G(z)) -> 0):
 *   d L_G^minimax / d z_fake -> 0 (vanishes!), whereas
 *   d L_G^nonsat  / d z_fake -> -1 (strong learning signal!).
 */
export function computeGanObjectives(
  realLogit: number,
  fakeLogit: number,
  pData: number = 0.5,
  pGen: number = 0.5
): GanStepResult {
  const dRealProb = Math.min(1 - EPS, Math.max(EPS, sigmoid(realLogit)));
  const dFakeProb = Math.min(1 - EPS, Math.max(EPS, sigmoid(fakeLogit)));

  const discriminatorLoss = -(Math.log(dRealProb) + Math.log(1 - dFakeProb));
  const generatorMinimaxLoss = Math.log(1 - dFakeProb);
  const generatorNonSaturatingLoss = -Math.log(dFakeProb);

  const rawD = sigmoid(fakeLogit);
  const dGenMinimax_dFakeLogit = -rawD;
  const dGenNonSat_dFakeLogit = rawD - 1;

  const denom = pData + pGen;
  const optimalDiscriminatorAtDensity = denom > EPS ? pData / denom : 0.5;

  return {
    dRealProb,
    dFakeProb,
    discriminatorLoss,
    generatorMinimaxLoss,
    generatorNonSaturatingLoss,
    dGenMinimax_dFakeLogit,
    dGenNonSat_dFakeLogit,
    optimalDiscriminatorAtDensity,
  };
}

// ============================================================================
// LESSON 7.4: DENOISING DIFFUSION PROBABILITY MODELS (DDPM CLOSED-FORM)
// ============================================================================

export interface DiffusionStepResult {
  alphaBar: number;
  signalScale: number;
  noiseScale: number;
  xNoisy: number;
  x0Reconstructed: number;
  scoreLossMse: number;
  dLoss_dEpsPred: number;
}

/**
 * Evaluates the closed-form DDPM forward marginal q(x_t | x_0):
 *   x_t = sqrt(alphaBar_t) * x_0 + sqrt(1 - alphaBar_t) * eps
 * And reconstructs x_0 from predicted noise eps_theta(x_t, t):
 *   xHat_0 = (x_t - sqrt(1 - alphaBar_t) * epsPred) / sqrt(alphaBar_t)
 * Simple denoising MSE loss:
 *   L_simple = (epsPred - epsTrue)^2
 *   dL_simple / d(epsPred) = 2 * (epsPred - epsTrue)
 */
export function computeDiffusionClosedForm(
  x0: number,
  alphaBar: number,
  epsTrue: number,
  epsPred: number
): DiffusionStepResult {
  const clampedAlphaBar = Math.min(1 - 1e-6, Math.max(1e-6, alphaBar));
  const signalScale = Math.sqrt(clampedAlphaBar);
  const noiseScale = Math.sqrt(1 - clampedAlphaBar);

  const xNoisy = signalScale * x0 + noiseScale * epsTrue;
  const x0Reconstructed = (xNoisy - noiseScale * epsPred) / signalScale;

  const diff = epsPred - epsTrue;
  const scoreLossMse = diff * diff;
  const dLoss_dEpsPred = 2 * diff;

  return {
    alphaBar: clampedAlphaBar,
    signalScale,
    noiseScale,
    xNoisy,
    x0Reconstructed,
    scoreLossMse,
    dLoss_dEpsPred,
  };
}
