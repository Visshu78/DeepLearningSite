/**
 * Pure analytical mathematical engine for Track 1: Classical ML
 * (Lessons 1.1 to 1.5: Linear Regression, Logistic Regression, Bias-Variance &
 * Evaluation Metrics, Decision Trees & Random Forests, and k-Means & PCA).
 *
 * Every equation and backward derivative is verified via automated unit tests.
 */

const EPS = 1e-12;

// ============================================================================
// LESSON 1.1: LINEAR REGRESSION (OLS NORMAL EQUATIONS & GRADIENT DESCENT)
// ============================================================================

export interface LinearRegressionResult {
  wOpt: number;
  bOpt: number;
  predictions: number[];
  mseLoss: number;
  rmse: number;
  rSquared: number;
  gradW: number;
  gradB: number;
}

/**
 * Evaluates 1D Linear Regression yHat_i = w * x_i + b:
 * - Closed-form Ordinary Least Squares (OLS):
 *     w* = Cov(x, y) / Var(x) = sum (x_i - xBar)(y_i - yBar) / sum (x_i - xBar)^2
 *     b* = yBar - w* * xBar
 * - Mean Squared Error:
 *     L(w, b) = (1 / N) * sum (w * x_i + b - y_i)^2
 * - Analytical derivatives:
 *     dL/dw = (2 / N) * sum (yHat_i - y_i) * x_i
 *     dL/db = (2 / N) * sum (yHat_i - y_i)
 * - Coefficient of Determination:
 *     R^2 = 1 - SS_res / SS_tot
 */
export function computeLinearRegression(
  xs: number[],
  ys: number[],
  w: number,
  b: number
): LinearRegressionResult {
  const N = Math.min(xs.length, ys.length);
  if (N === 0) {
    return {
      wOpt: 0,
      bOpt: 0,
      predictions: [],
      mseLoss: 0,
      rmse: 0,
      rSquared: 0,
      gradW: 0,
      gradB: 0,
    };
  }

  const xBar = xs.reduce((a, c) => a + c, 0) / N;
  const yBar = ys.reduce((a, c) => a + c, 0) / N;

  let covXY = 0;
  let varX = 0;
  let ssTot = 0;
  for (let i = 0; i < N; i++) {
    const dx = xs[i] - xBar;
    const dy = ys[i] - yBar;
    covXY += dx * dy;
    varX += dx * dx;
    ssTot += dy * dy;
  }

  const wOpt = varX > EPS ? covXY / varX : 0;
  const bOpt = yBar - wOpt * xBar;

  const predictions: number[] = [];
  let ssRes = 0;
  let gradWSum = 0;
  let gradBSum = 0;

  for (let i = 0; i < N; i++) {
    const yHat = w * xs[i] + b;
    predictions.push(yHat);
    const err = yHat - ys[i];
    ssRes += err * err;
    gradWSum += err * xs[i];
    gradBSum += err;
  }

  const mseLoss = ssRes / N;
  const rmse = Math.sqrt(mseLoss);
  const rSquared = ssTot > EPS ? 1 - ssRes / ssTot : 1;

  return {
    wOpt,
    bOpt,
    predictions,
    mseLoss,
    rmse,
    rSquared,
    gradW: (2 / N) * gradWSum,
    gradB: (2 / N) * gradBSum,
  };
}

// ============================================================================
// LESSON 1.2: LOGISTIC REGRESSION (SIGMOID, LOG-ODDS & BCE GRADIENTS)
// ============================================================================

export interface LogisticRegressionResult {
  logit: number;
  odds: number;
  probability: number;
  bceLoss: number;
  gradW: number;
  gradB: number;
  predictedClass: 0 | 1;
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
 * Evaluates 1D Logistic Regression p = sigma(w * x + b) on target y in {0, 1}
 * with decision threshold tau in (0, 1):
 *   L_BCE(w, b) = -(y * log(p) + (1 - y) * log(1 - p))
 *   dL/dw = (p - y) * x
 *   dL/db = (p - y)
 */
export function computeLogisticRegressionStep(
  x: number,
  y: 0 | 1,
  w: number,
  b: number,
  threshold: number = 0.5
): LogisticRegressionResult {
  const logit = w * x + b;
  const odds = Math.exp(Math.min(20, Math.max(-20, logit)));
  const rawP = sigmoid(logit);
  const pClamped = Math.min(1 - EPS, Math.max(EPS, rawP));

  const bceLoss = -(y * Math.log(pClamped) + (1 - y) * Math.log(1 - pClamped));
  const dz = rawP - y;

  return {
    logit,
    odds,
    probability: rawP,
    bceLoss,
    gradW: dz * x,
    gradB: dz,
    predictedClass: rawP >= threshold ? 1 : 0,
  };
}

// ============================================================================
// LESSON 1.3: BIAS-VARIANCE DECOMPOSITION
// ============================================================================

export interface BiasVarianceResult {
  biasSquared: number;
  variance: number;
  irreducibleNoise: number;
  expectedTestError: number;
  regime: 'Underfitting (High Bias)' | 'Optimal Trade-off' | 'Overfitting (High Variance)';
}

/**
 * Evaluates the analytical Bias-Variance Decomposition as a function of
 * polynomial degree / model complexity d in [1, 10]:
 *   E[(y - fHat(x))^2] = Bias^2 + Variance + sigma_noise^2
 */
export function computeBiasVarianceDecomposition(
  degree: number,
  noiseStd: number = 0.3
): BiasVarianceResult {
  const d = Math.max(1, degree);
  const biasSquared = 1.2 * Math.exp(-0.65 * (d - 1));
  const variance = 0.015 * Math.pow(d, 1.85);
  const irreducibleNoise = noiseStd * noiseStd;
  const expectedTestError = biasSquared + variance + irreducibleNoise;

  let regime: BiasVarianceResult['regime'] = 'Optimal Trade-off';
  if (d <= 2.2) {
    regime = 'Underfitting (High Bias)';
  } else if (d >= 5.5) {
    regime = 'Overfitting (High Variance)';
  }

  return {
    biasSquared,
    variance,
    irreducibleNoise,
    expectedTestError,
    regime,
  };
}

// ============================================================================
// LESSON 1.4: DECISION TREES (GINI IMPURITY, ENTROPY & INFORMATION GAIN)
// ============================================================================

export interface TreeSplitResult {
  parentGini: number;
  parentEntropyBits: number;
  leftGini: number;
  rightGini: number;
  weightedChildGini: number;
  giniGain: number;
  informationGainBits: number;
  ensembleVarianceReductionFactor: number;
}

function giniFromCounts(pos: number, neg: number): number {
  const tot = pos + neg;
  if (tot <= 0) return 0;
  const p1 = pos / tot;
  const p0 = neg / tot;
  return 1 - (p1 * p1 + p0 * p0);
}

function entropyBitsFromCounts(pos: number, neg: number): number {
  const tot = pos + neg;
  if (tot <= 0) return 0;
  const p1 = pos / tot;
  const p0 = neg / tot;
  const e1 = p1 > EPS ? -p1 * Math.log2(p1) : 0;
  const e0 = p0 > EPS ? -p0 * Math.log2(p0) : 0;
  return e1 + e0;
}

/**
 * Computes exact Gini Impurity, Shannon Entropy (in bits), Information Gain,
 * and Random Forest bagging variance multiplier:
 *   Var(average of B trees with pairwise correlation rho) = (rho + (1 - rho)/B) * sigma^2
 */
export function computeDecisionTreeSplit(
  leftPos: number,
  leftNeg: number,
  rightPos: number,
  rightNeg: number,
  numTreesB: number = 100,
  treeCorrelationRho: number = 0.15
): TreeSplitResult {
  const totalPos = leftPos + rightPos;
  const totalNeg = leftNeg + rightNeg;
  const nTotal = Math.max(1, totalPos + totalNeg);
  const nLeft = leftPos + leftNeg;
  const nRight = rightPos + rightNeg;

  const parentGini = giniFromCounts(totalPos, totalNeg);
  const parentEntropyBits = entropyBitsFromCounts(totalPos, totalNeg);

  const leftGini = giniFromCounts(leftPos, leftNeg);
  const rightGini = giniFromCounts(rightPos, rightNeg);
  const weightedChildGini = (nLeft / nTotal) * leftGini + (nRight / nTotal) * rightGini;
  const giniGain = parentGini - weightedChildGini;

  const leftEnt = entropyBitsFromCounts(leftPos, leftNeg);
  const rightEnt = entropyBitsFromCounts(rightPos, rightNeg);
  const weightedChildEnt = (nLeft / nTotal) * leftEnt + (nRight / nTotal) * rightEnt;
  const informationGainBits = parentEntropyBits - weightedChildEnt;

  const safeB = Math.max(1, numTreesB);
  const clampedRho = Math.max(0, Math.min(1, treeCorrelationRho));
  const ensembleVarianceReductionFactor = clampedRho + (1 - clampedRho) / safeB;

  return {
    parentGini,
    parentEntropyBits,
    leftGini,
    rightGini,
    weightedChildGini,
    giniGain,
    informationGainBits,
    ensembleVarianceReductionFactor,
  };
}

// ============================================================================
// LESSON 1.5: k-MEANS INERTIA & 2D PCA EIGENDECOMPOSITION
// ============================================================================

export interface KMeansAndPcaResult {
  assignments: (0 | 1)[];
  newCentroid0: [number, number];
  newCentroid1: [number, number];
  inertia: number;
  lambda1: number;
  lambda2: number;
  explainedVarianceRatio1: number;
  principalAxis1: [number, number];
}

/**
 * Evaluates 1 step of 2-centroid k-Means (assignments, new means, inertia)
 * and exact closed-form 2x2 Covariance Eigendecomposition for PCA:
 *   For Cov = [[a, b], [b, c]], eigenvalues are:
 *   lambda_{1,2} = 0.5 * ((a + c) +/- sqrt((a - c)^2 + 4 * b^2))
 */
export function computeKMeansAndPca(
  points: [number, number][],
  c0: [number, number],
  c1: [number, number]
): KMeansAndPcaResult {
  const N = points.length;
  const assignments: (0 | 1)[] = [];
  let inertia = 0;

  let sum0X = 0,
    sum0Y = 0,
    count0 = 0;
  let sum1X = 0,
    sum1Y = 0,
    count1 = 0;

  for (const [px, py] of points) {
    const d0 = (px - c0[0]) ** 2 + (py - c0[1]) ** 2;
    const d1 = (px - c1[0]) ** 2 + (py - c1[1]) ** 2;
    if (d0 <= d1) {
      assignments.push(0);
      inertia += d0;
      sum0X += px;
      sum0Y += py;
      count0++;
    } else {
      assignments.push(1);
      inertia += d1;
      sum1X += px;
      sum1Y += py;
      count1++;
    }
  }

  const newCentroid0: [number, number] =
    count0 > 0 ? [sum0X / count0, sum0Y / count0] : c0;
  const newCentroid1: [number, number] =
    count1 > 0 ? [sum1X / count1, sum1Y / count1] : c1;

  // 2D PCA Covariance Matrix
  const meanX = points.reduce((s, p) => s + p[0], 0) / Math.max(1, N);
  const meanY = points.reduce((s, p) => s + p[1], 0) / Math.max(1, N);

  let covXX = 0,
    covXY = 0,
    covYY = 0;
  const denom = Math.max(1, N - 1);
  for (const [px, py] of points) {
    const dx = px - meanX;
    const dy = py - meanY;
    covXX += (dx * dx) / denom;
    covXY += (dx * dy) / denom;
    covYY += (dy * dy) / denom;
  }

  const trace = covXX + covYY;
  const disc = Math.sqrt((covXX - covYY) ** 2 + 4 * covXY * covXY);
  const lambda1 = 0.5 * (trace + disc);
  const lambda2 = Math.max(0, 0.5 * (trace - disc));
  const explainedVarianceRatio1 =
    lambda1 + lambda2 > EPS ? lambda1 / (lambda1 + lambda2) : 1;

  let vx = covXY;
  let vy = lambda1 - covXX;
  if (Math.hypot(vx, vy) < EPS) {
    vx = 1;
    vy = 0;
  } else {
    const norm = Math.hypot(vx, vy);
    vx /= norm;
    vy /= norm;
  }

  return {
    assignments,
    newCentroid0,
    newCentroid1,
    inertia,
    lambda1,
    lambda2,
    explainedVarianceRatio1,
    principalAxis1: [vx, vy],
  };
}
