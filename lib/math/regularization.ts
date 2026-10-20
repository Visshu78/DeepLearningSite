export interface DataPoint {
  x: number;
  y: number;
  isTest?: boolean;
}

// Fixed canonical dataset: true function f(x) = sin(pi * x) + noise
export const CANONICAL_TRAIN_POINTS: DataPoint[] = [
  { x: -0.90, y: -0.35 },
  { x: -0.70, y: -0.85 },
  { x: -0.45, y: -0.95 },
  { x: -0.20, y: -0.50 },
  { x:  0.05, y:  0.18 },
  { x:  0.30, y:  0.82 },
  { x:  0.55, y:  0.96 },
  { x:  0.80, y:  0.62 },
  { x:  0.95, y:  0.15 }
];

export const CANONICAL_TEST_POINTS: DataPoint[] = [
  { x: -0.80, y: -0.65, isTest: true },
  { x: -0.55, y: -0.99, isTest: true },
  { x: -0.10, y: -0.32, isTest: true },
  { x:  0.20, y:  0.60, isTest: true },
  { x:  0.45, y:  0.98, isTest: true },
  { x:  0.70, y:  0.80, isTest: true },
  { x:  0.88, y:  0.38, isTest: true }
];

/**
 * Ridge Regression (L2 regularization) on polynomial feature expansion:
 * w = (X^T X + lambda * I)^(-1) X^T y
 */
export function fitPolynomialRidge(
  points: DataPoint[],
  degree: number,
  lambdaL2: number
): number[] {
  const n = points.length;
  const d = degree + 1; // number of coefficients w_0, ..., w_degree

  // Construct Vandermonde matrix X: shape [n, d]
  const X: number[][] = [];
  const y: number[] = [];

  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    let power = 1;
    for (let j = 0; j < d; j++) {
      row.push(power);
      power *= points[i].x;
    }
    X.push(row);
    y.push(points[i].y);
  }

  // Compute A = X^T X + lambda * I (exclude bias w_0 from regularization)
  const A: number[][] = Array.from({ length: d }, () => Array(d).fill(0));
  for (let r = 0; r < d; r++) {
    for (let c = 0; c < d; c++) {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        sum += X[i][r] * X[i][c];
      }
      A[r][c] = sum;
    }
    // Add L2 penalty to diagonal (do not regularize bias w_0)
    if (r > 0) {
      A[r][r] += lambdaL2;
    }
  }

  // Compute bVec = X^T y
  const bVec: number[] = Array(d).fill(0);
  for (let r = 0; r < d; r++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += X[i][r] * y[i];
    }
    bVec[r] = sum;
  }

  // Solve linear system A * w = bVec using Gaussian elimination with partial pivoting
  return solveLinearSystem(A, bVec);
}

function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M: number[][] = A.map((row, i) => [...row, b[i]]);

  for (let i = 0; i < n; i++) {
    // Pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k;
      }
    }
    const temp = M[i];
    M[i] = M[maxRow];
    M[maxRow] = temp;

    if (Math.abs(M[i][i]) < 1e-12) {
      M[i][i] = 1e-12; // Prevent divide-by-zero
    }

    for (let k = i + 1; k < n; k++) {
      const factor = M[k][i] / M[i][i];
      for (let j = i; j <= n; j++) {
        M[k][j] -= factor * M[i][j];
      }
    }
  }

  // Back-substitution
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= M[i][j] * x[j];
    }
    x[i] = sum / M[i][i];
  }

  return x;
}

export function evaluatePolynomial(weights: number[], x: number): number {
  let y = 0;
  let power = 1;
  for (let i = 0; i < weights.length; i++) {
    y += weights[i] * power;
    power *= x;
  }
  return y;
}

export function calculateMSE(weights: number[], points: DataPoint[]): number {
  if (points.length === 0) return 0;
  const sumSq = points.reduce((acc, p) => {
    const yHat = evaluatePolynomial(weights, p.x);
    return acc + Math.pow(yHat - p.y, 2);
  }, 0);
  return Math.round((sumSq / points.length) * 1000) / 1000;
}

export interface InvertedDropoutResult {
  originalActivations: number[];
  dropoutRate: number;
  mask: number[]; // 1 for active, 0 for dropped
  scaledActivations: number[];
  scaleFactor: number;
}

export function simulateInvertedDropout(
  activations: number[],
  dropoutRate: number,
  rngSeed: number = 42
): InvertedDropoutResult {
  if (dropoutRate <= 0) {
    return {
      originalActivations: activations,
      dropoutRate: 0,
      mask: activations.map(() => 1),
      scaledActivations: activations,
      scaleFactor: 1
    };
  }

  const scaleFactor = 1 / (1 - dropoutRate);
  let state = rngSeed;
  const pseudoRandom = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };

  const mask: number[] = [];
  const scaledActivations: number[] = [];

  for (let i = 0; i < activations.length; i++) {
    const keep = pseudoRandom() >= dropoutRate ? 1 : 0;
    mask.push(keep);
    scaledActivations.push(keep ? Math.round(activations[i] * scaleFactor * 100) / 100 : 0);
  }

  return {
    originalActivations: activations,
    dropoutRate,
    mask,
    scaledActivations,
    scaleFactor: Math.round(scaleFactor * 100) / 100
  };
}
