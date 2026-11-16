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

// ============================================================================
// LESSON 0.5: MATRIX OPERATIONS & LINEAR TRANSFORMATIONS
// ============================================================================

export type Mat2x2 = [[number, number], [number, number]];

export interface MatrixAlgebra2x2Result {
  productAB: Mat2x2;
  productBA: Mat2x2;
  transposeA: Mat2x2;
  determinantA: number;
  isInvertible: boolean;
  inverseA: Mat2x2 | null;
  transformedV: [number, number];
  commutes: boolean;
}

export function multiplyMat2x2(A: Mat2x2, B: Mat2x2): Mat2x2 {
  return [
    [
      A[0][0] * B[0][0] + A[0][1] * B[1][0],
      A[0][0] * B[0][1] + A[0][1] * B[1][1],
    ],
    [
      A[1][0] * B[0][0] + A[1][1] * B[1][0],
      A[1][0] * B[0][1] + A[1][1] * B[1][1],
    ],
  ];
}

/**
 * Computes 2x2 matrix multiplication (AB and BA), transpose A^T, determinant,
 * inverse A^-1 (when det(A) != 0), and linear transformation A * v.
 */
export function computeMatrixAlgebra2x2(
  A: Mat2x2,
  B: Mat2x2,
  v: [number, number]
): MatrixAlgebra2x2Result {
  const productAB = multiplyMat2x2(A, B);
  const productBA = multiplyMat2x2(B, A);
  const transposeA: Mat2x2 = [
    [A[0][0], A[1][0]],
    [A[0][1], A[1][1]],
  ];
  const determinantA = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  const isInvertible = Math.abs(determinantA) > 1e-8;
  const inverseA: Mat2x2 | null = isInvertible
    ? [
        [A[1][1] / determinantA, -A[0][1] / determinantA],
        [-A[1][0] / determinantA, A[0][0] / determinantA],
      ]
    : null;

  const transformedV: [number, number] = [
    A[0][0] * v[0] + A[0][1] * v[1],
    A[1][0] * v[0] + A[1][1] * v[1],
  ];

  const commutes =
    Math.abs(productAB[0][0] - productBA[0][0]) < 1e-6 &&
    Math.abs(productAB[0][1] - productBA[0][1]) < 1e-6 &&
    Math.abs(productAB[1][0] - productBA[1][0]) < 1e-6 &&
    Math.abs(productAB[1][1] - productBA[1][1]) < 1e-6;

  return {
    productAB,
    productBA,
    transposeA,
    determinantA,
    isInvertible,
    inverseA,
    transformedV,
    commutes,
  };
}

// ============================================================================
// LESSON 0.6: NORMS, DISTANCES & EIGENVALUES / PCA
// ============================================================================

export interface NormsDistancesResult {
  l1NormU: number;
  l2NormU: number;
  l1Distance: number;
  l2Distance: number;
}

export function computeNormsAndDistances(
  u: [number, number],
  v: [number, number]
): NormsDistancesResult {
  const l1NormU = Math.abs(u[0]) + Math.abs(u[1]);
  const l2NormU = Math.hypot(u[0], u[1]);
  const dx = u[0] - v[0];
  const dy = u[1] - v[1];
  const l1Distance = Math.abs(dx) + Math.abs(dy);
  const l2Distance = Math.hypot(dx, dy);
  return { l1NormU, l2NormU, l1Distance, l2Distance };
}

export interface EigenPCAResult {
  lambda1: number;
  lambda2: number;
  eigvec1: [number, number];
  eigvec2: [number, number];
  explainedVarianceRatio1: number;
  explainedVarianceRatio2: number;
  trace: number;
  determinant: number;
}

/**
 * Exact eigendecomposition of a 2x2 symmetric matrix [[a, b], [b, c]]
 * (such as a 2D covariance matrix for PCA).
 * Eigenvalues are ordered lambda1 >= lambda2.
 */
export function computeSymmetric2x2EigenPCA(
  varX: number,
  varY: number,
  covXY: number
): EigenPCAResult {
  const a = varX;
  const b = covXY;
  const c = varY;
  const trace = a + c;
  const determinant = a * c - b * b;
  const disc = Math.sqrt(Math.max(0, (a - c) * (a - c) + 4 * b * b));
  const lambda1 = 0.5 * (trace + disc);
  const lambda2 = 0.5 * (trace - disc);

  let eigvec1: [number, number];
  if (Math.abs(b) > 1e-10) {
    const vx = lambda1 - c;
    const vy = b;
    const len = Math.hypot(vx, vy) || 1;
    eigvec1 = [vx / len, vy / len];
  } else {
    eigvec1 = a >= c ? [1, 0] : [0, 1];
  }
  const eigvec2: [number, number] = [-eigvec1[1], eigvec1[0]];

  const totalPosVar = Math.max(EPS, Math.max(0, lambda1) + Math.max(0, lambda2));
  const explainedVarianceRatio1 = Math.max(0, lambda1) / totalPosVar;
  const explainedVarianceRatio2 = Math.max(0, lambda2) / totalPosVar;

  return {
    lambda1,
    lambda2,
    eigvec1,
    eigvec2,
    explainedVarianceRatio1,
    explainedVarianceRatio2,
    trace,
    determinant,
  };
}

// ============================================================================
// LESSON 0.7: PARTIAL DERIVATIVES, JACOBIAN & HESSIAN
// ============================================================================

export type HessianCurvatureType = 'minimum' | 'maximum' | 'saddle' | 'degenerate';

export interface JacobianHessianResult {
  fVec: [number, number];
  jacobian: Mat2x2;
  jacobianDet: number;
  fScalar: number;
  grad: [number, number];
  hessian: Mat2x2;
  hessianEigenvalues: [number, number];
  curvatureType: HessianCurvatureType;
  conditionNumber: number;
}

/**
 * Evaluates:
 * 1) Vector-valued map F(x, y) = [x^2 + y, sin(x) * y] and its exact 2x2 Jacobian:
 *      J = [[2x, 1], [cos(x)*y, sin(x)]]
 * 2) Quadratic scalar surface f(x, y) = a*x^2 + b*x*y + c*y^2, its gradient,
 *    exact Hessian H = [[2a, b], [b, 2c]], Hessian eigenvalues, and curvature classification.
 */
export function computeJacobianAndHessian(
  x: number,
  y: number,
  a: number = 1.5,
  b: number = 0.8,
  c: number = 0.5
): JacobianHessianResult {
  const fVec: [number, number] = [x * x + y, Math.sin(x) * y];
  const jacobian: Mat2x2 = [
    [2 * x, 1],
    [Math.cos(x) * y, Math.sin(x)],
  ];
  const jacobianDet =
    jacobian[0][0] * jacobian[1][1] - jacobian[0][1] * jacobian[1][0];

  const fScalar = a * x * x + b * x * y + c * y * y;
  const grad: [number, number] = [2 * a * x + b * y, b * x + 2 * c * y];
  const hessian: Mat2x2 = [
    [2 * a, b],
    [b, 2 * c],
  ];

  const eigen = computeSymmetric2x2EigenPCA(2 * a, 2 * c, b);
  const l1 = eigen.lambda1;
  const l2 = eigen.lambda2;

  let curvatureType: HessianCurvatureType;
  if (l1 > 1e-6 && l2 > 1e-6) {
    curvatureType = 'minimum';
  } else if (l1 < -1e-6 && l2 < -1e-6) {
    curvatureType = 'maximum';
  } else if (l1 * l2 < -1e-6) {
    curvatureType = 'saddle';
  } else {
    curvatureType = 'degenerate';
  }

  const absMin = Math.min(Math.abs(l1), Math.abs(l2));
  const absMax = Math.max(Math.abs(l1), Math.abs(l2));
  const conditionNumber = absMin > 1e-6 ? absMax / absMin : Infinity;

  return {
    fVec,
    jacobian,
    jacobianDet,
    fScalar,
    grad,
    hessian,
    hessianEigenvalues: [l1, l2],
    curvatureType,
    conditionNumber,
  };
}

// ============================================================================
// LESSON 0.8: CONDITIONAL PROBABILITY, BAYES' THEOREM, COVARIANCE & DISTRIBUTIONS
// ============================================================================

export interface BayesResult {
  priorH: number;
  pEvidence: number;
  posteriorHgivenE: number;
  jointTruePositive: number;
  jointFalsePositive: number;
  bayesFactor: number;
}

export function computeBayesTheorem(
  priorH: number,
  sensitivityEgivenH: number,
  falsePositiveEgivenNotH: number
): BayesResult {
  const pH = Math.min(1 - 1e-6, Math.max(1e-6, priorH));
  const pE_H = Math.min(1, Math.max(0, sensitivityEgivenH));
  const pE_notH = Math.min(1, Math.max(0, falsePositiveEgivenNotH));

  const jointTruePositive = pE_H * pH;
  const jointFalsePositive = pE_notH * (1 - pH);
  const pEvidence = Math.max(EPS, jointTruePositive + jointFalsePositive);
  const posteriorHgivenE = jointTruePositive / pEvidence;
  const bayesFactor = pE_notH > EPS ? pE_H / pE_notH : Infinity;

  return {
    priorH: pH,
    pEvidence,
    posteriorHgivenE,
    jointTruePositive,
    jointFalsePositive,
    bayesFactor,
  };
}

export interface CovarianceCorrelationResult {
  meanX: number;
  meanY: number;
  covariance: number;
  stdX: number;
  stdY: number;
  correlationR: number;
}

export function computeCovarianceAndCorrelation(
  xs: number[],
  ys: number[]
): CovarianceCorrelationResult {
  const n = Math.min(xs.length, ys.length);
  if (n === 0) {
    return { meanX: 0, meanY: 0, covariance: 0, stdX: 0, stdY: 0, correlationR: 0 };
  }
  const meanX = xs.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const meanY = ys.slice(0, n).reduce((a, b) => a + b, 0) / n;

  let covSum = 0;
  let varXSum = 0;
  let varYSum = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    covSum += dx * dy;
    varXSum += dx * dx;
    varYSum += dy * dy;
  }

  const covariance = covSum / n;
  const stdX = Math.sqrt(varXSum / n);
  const stdY = Math.sqrt(varYSum / n);
  const denom = stdX * stdY;
  const correlationR = denom > EPS ? Math.max(-1, Math.min(1, covariance / denom)) : 0;

  return { meanX, meanY, covariance, stdX, stdY, correlationR };
}

function binomialCoeff(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = (res * (n - i + 1)) / i;
  }
  return res;
}

export function computeBinomialPmf(n: number, p: number): number[] {
  const clampedN = Math.max(1, Math.min(20, Math.round(n)));
  const clampedP = Math.max(0, Math.min(1, p));
  const probs: number[] = [];
  for (let k = 0; k <= clampedN; k++) {
    probs.push(
      binomialCoeff(clampedN, k) *
        Math.pow(clampedP, k) *
        Math.pow(1 - clampedP, clampedN - k)
    );
  }
  return probs;
}

export function computeUniformPdf(x: number, a: number, b: number): {
  pdf: number;
  mean: number;
  variance: number;
} {
  const low = Math.min(a, b);
  const high = Math.max(a, b) > low + 1e-6 ? Math.max(a, b) : low + 1;
  const width = high - low;
  const pdf = x >= low && x <= high ? 1 / width : 0;
  return {
    pdf,
    mean: 0.5 * (low + high),
    variance: (width * width) / 12,
  };
}
