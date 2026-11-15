/**
 * Pure analytical mathematical engine for Track 0: Math Toolkit
 * (Lessons 0.1 to 0.4: Vectors, Matrices & Dot Products, Derivatives & Gradients,
 * The Chain Rule, and Probability & Distributions).
 *
 * Every equation and derivative is verified via automated unit tests.
 */

const EPS = 1e-12;

// ============================================================================
// LESSON 0.1: VECTORS, MATRICES AND DOT PRODUCTS
// ============================================================================

export interface VectorMatrixResult {
  dotProduct: number;
  normA: number;
  normB: number;
  cosineSimilarity: number;
  angleDegrees: number;
  matrixTransformedA: [number, number];
  matrixDeterminant: number;
}

/**
 * Evaluates 2D dot product, L2 norms, cosine similarity, angle in degrees,
 * and 2x2 matrix linear transformation y = M * a with determinant det(M).
 */
export function computeVectorAndMatrixOps(
  a: [number, number],
  b: [number, number],
  matM: [[number, number], [number, number]]
): VectorMatrixResult {
  const dotProduct = a[0] * b[0] + a[1] * b[1];
  const normA = Math.hypot(a[0], a[1]);
  const normB = Math.hypot(b[0], b[1]);
  const denom = normA * normB;
  const rawCos = denom > EPS ? dotProduct / denom : 0;
  const cosineSimilarity = Math.max(-1, Math.min(1, rawCos));
  const angleDegrees = (Math.acos(cosineSimilarity) * 180) / Math.PI;

  const y0 = matM[0][0] * a[0] + matM[0][1] * a[1];
  const y1 = matM[1][0] * a[0] + matM[1][1] * a[1];
  const matrixDeterminant =
    matM[0][0] * matM[1][1] - matM[0][1] * matM[1][0];

  return {
    dotProduct,
    normA,
    normB,
    cosineSimilarity,
    angleDegrees,
    matrixTransformedA: [y0, y1],
    matrixDeterminant,
  };
}

// ============================================================================
// LESSON 0.2: DERIVATIVES AND GRADIENTS
// ============================================================================

export interface GradientSurfaceResult {
  fValue: number;
  df_dx: number;
  df_dy: number;
  gradientNorm: number;
  steepestDescentStep: [number, number];
  fAfterStep: number;
}

/**
 * Evaluates a 2D quadratic bowl f(x, y) = a * x^2 + b * x * y + c * y^2:
 *   df/dx = 2 * a * x + b * y
 *   df/dy = b * x + 2 * c * y
 * and takes one steepest descent step (x, y) - lr * grad(f).
 */
export function computeSurfaceGradientStep(
  x: number,
  y: number,
  a: number = 1.0,
  b: number = 0.5,
  c: number = 2.0,
  lr: number = 0.1
): GradientSurfaceResult {
  const fValue = a * x * x + b * x * y + c * y * y;
  const df_dx = 2 * a * x + b * y;
  const df_dy = b * x + 2 * c * y;
  const gradientNorm = Math.hypot(df_dx, df_dy);

  const nx = x - lr * df_dx;
  const ny = y - lr * df_dy;
  const fAfterStep = a * nx * nx + b * nx * ny + c * ny * ny;

  return {
    fValue,
    df_dx,
    df_dy,
    gradientNorm,
    steepestDescentStep: [nx, ny],
    fAfterStep,
  };
}

// ============================================================================
// LESSON 0.3: THE CHAIN RULE (COMPOSITE FUNCTIONS & MULTI-PATH DAGS)
// ============================================================================

export interface ChainRuleDagResult {
  u: number;
  v: number;
  z: number;
  du_dx: number;
  dv_dx: number;
  dz_du: number;
  dz_dv: number;
  path1Contrib: number;
  path2Contrib: number;
  totalDz_Dx: number;
}

/**
 * Evaluates a 2-path computational DAG from input x to output z:
 *   Path 1: u(x) = w1 * x + b1
 *   Path 2: v(x) = x^2
 *   Combine: z(u, v) = sin(u) + u * v
 * By the Multivariate Chain Rule:
 *   dz/du = cos(u) + v
 *   dz/dv = u
 *   du/dx = w1
 *   dv/dx = 2 * x
 *   dz/dx = (dz/du)(du/dx) + (dz/dv)(dv/dx)
 */
export function computeChainRuleDag(
  x: number,
  w1: number = 1.5,
  b1: number = 0.5
): ChainRuleDagResult {
  const u = w1 * x + b1;
  const v = x * x;
  const z = Math.sin(u) + u * v;

  const du_dx = w1;
  const dv_dx = 2 * x;
  const dz_du = Math.cos(u) + v;
  const dz_dv = u;

  const path1Contrib = dz_du * du_dx;
  const path2Contrib = dz_dv * dv_dx;
  const totalDz_Dx = path1Contrib + path2Contrib;

  return {
    u,
    v,
    z,
    du_dx,
    dv_dx,
    dz_du,
    dz_dv,
    path1Contrib,
    path2Contrib,
    totalDz_Dx,
  };
}

// ============================================================================
// LESSON 0.4: PROBABILITY, DISTRIBUTIONS & MAXIMUM LOG-LIKELIHOOD
// ============================================================================

export interface ProbabilityLikelihoodResult {
  bernoulliEntropyBits: number;
  bernoulliNll: number;
  dBernoulliNll_dp: number;
  gaussianPdf: number;
  gaussianNll: number;
  dGaussianNll_dMu: number;
  dGaussianNll_dSigma: number;
}

/**
 * Evaluates Bernoulli(p) and Gaussian N(mu, sigma^2) density, Negative Log-Likelihood
 * (NLL), and exact analytical derivatives w.r.t distribution parameters:
 * 1. Bernoulli(p) at observation y in {0, 1}:
 *    NLL(p) = -(y * log(p) + (1 - y) * log(1 - p))
 *    dNLL/dp = -y/p + (1 - y)/(1 - p) = (p - y) / (p * (1 - p))
 * 2. Gaussian N(mu, sigma^2) at observation x:
 *    NLL(mu, sigma) = 0.5 * log(2 * pi) + log(sigma) + (x - mu)^2 / (2 * sigma^2)
 *    dNLL/dmu    = (mu - x) / sigma^2
 *    dNLL/dsigma = 1/sigma - (x - mu)^2 / sigma^3
 */
export function computeProbabilityAndLikelihood(
  bernoulliP: number,
  observedY: 0 | 1,
  observedX: number,
  gaussianMu: number,
  gaussianSigma: number
): ProbabilityLikelihoodResult {
  const p = Math.min(1 - 1e-6, Math.max(1e-6, bernoulliP));
  const q = 1 - p;
  const bernoulliEntropyBits = -(p * Math.log2(p) + q * Math.log2(q));
  const bernoulliNll = -(observedY * Math.log(p) + (1 - observedY) * Math.log(q));
  const dBernoulliNll_dp = (p - observedY) / (p * q);

  const s = Math.max(0.05, gaussianSigma);
  const diff = observedX - gaussianMu;
  const zSq = (diff * diff) / (s * s);
  const gaussianPdf =
    (1 / (Math.sqrt(2 * Math.PI) * s)) * Math.exp(-0.5 * zSq);
  const gaussianNll =
    0.5 * Math.log(2 * Math.PI) + Math.log(s) + 0.5 * zSq;
  const dGaussianNll_dMu = (gaussianMu - observedX) / (s * s);
  const dGaussianNll_dSigma = 1 / s - (diff * diff) / (s * s * s);

  return {
    bernoulliEntropyBits,
    bernoulliNll,
    dBernoulliNll_dp,
    gaussianPdf,
    gaussianNll,
    dGaussianNll_dMu,
    dGaussianNll_dSigma,
  };
}
