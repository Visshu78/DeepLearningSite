export type FunctionPreset = 'convex_quadratic' | 'double_well' | 'sinusoidal';

export interface OptimizationLandscape {
  id: FunctionPreset;
  name: string;
  formula: string;
  latexFormula: string;
  derivativeFormula: string;
  latexDerivative: string;
  description: string;
  recommendedRange: [number, number];
  globalMinimum: number;
  localMinimum?: number;
  evaluate: (theta: number) => number;
  derivative: (theta: number) => number;
}

export const LANDSCAPE_PRESETS: Record<FunctionPreset, OptimizationLandscape> = {
  convex_quadratic: {
    id: 'convex_quadratic',
    name: 'Convex Quadratic Bowl',
    formula: 'L(θ) = 0.5 · (θ - 2)²',
    latexFormula: 'L(\\theta) = \\frac{1}{2}(\\theta - 2)^2',
    derivativeFormula: "L'(θ) = θ - 2",
    latexDerivative: "\\frac{dL}{d\\theta} = \\theta - 2",
    description: 'A smooth convex bowl with a single unique global minimum at θ = 2.0. Clean convergence for any η < 2.0.',
    recommendedRange: [-2, 6],
    globalMinimum: 2.0,
    evaluate: (theta: number) => 0.5 * Math.pow(theta - 2, 2),
    derivative: (theta: number) => theta - 2
  },
  double_well: {
    id: 'double_well',
    name: 'Double-Well Potential (Asymmetric)',
    formula: 'L(θ) = 0.25 · θ⁴ - 0.5 · θ² + 0.1 · θ + 0.6',
    latexFormula: 'L(\\theta) = 0.25\\theta^4 - 0.5\\theta^2 + 0.1\\theta + 0.6',
    derivativeFormula: "L'(θ) = θ³ - θ + 0.1",
    latexDerivative: "\\frac{dL}{d\\theta} = \\theta^3 - \\theta + 0.1",
    description: 'Two valleys separated by a barrier at θ ≈ 0.10. Global minimum lies at θ ≈ -1.05 (L ≈ 0.25), while θ ≈ 0.95 is a higher local minimum (L ≈ 0.45).',
    recommendedRange: [-2.2, 2.2],
    globalMinimum: -1.05,
    localMinimum: 0.95,
    evaluate: (theta: number) => 0.25 * Math.pow(theta, 4) - 0.5 * Math.pow(theta, 2) + 0.1 * theta + 0.6,
    derivative: (theta: number) => Math.pow(theta, 3) - theta + 0.1
  },
  sinusoidal: {
    id: 'sinusoidal',
    name: 'Sinusoidal Ripple (Multi-Modal)',
    formula: 'L(θ) = 0.15 · θ² + 0.7 · sin(2θ) + 1.2',
    latexFormula: 'L(\\theta) = 0.15\\theta^2 + 0.7\\sin(2\\theta) + 1.2',
    derivativeFormula: "L'(θ) = 0.3 · θ + 1.4 · cos(2θ)",
    latexDerivative: "\\frac{dL}{d\\theta} = 0.3\\theta + 1.4\\cos(2\\theta)",
    description: 'Multiple ripples create alternating local basins. Demonstrates the difficulty of navigating rugged non-convex error surfaces.',
    recommendedRange: [-4, 4],
    globalMinimum: -0.72,
    evaluate: (theta: number) => 0.15 * Math.pow(theta, 2) + 0.7 * Math.sin(2 * theta) + 1.2,
    derivative: (theta: number) => 0.3 * theta + 1.4 * Math.cos(2 * theta)
  }
};

export interface OptimizationStep {
  step: number;
  theta: number;
  loss: number;
  gradient: number;
  update: number; // - lr * gradient
  nextTheta: number;
  isDiverged?: boolean;
}

export function performOptimizationStep(
  landscape: OptimizationLandscape,
  currentTheta: number,
  learningRate: number,
  stepNumber: number
): OptimizationStep {
  const isDiverged = Math.abs(currentTheta) > 40;
  const loss = isDiverged ? Infinity : landscape.evaluate(currentTheta);
  const gradient = isDiverged ? 0 : landscape.derivative(currentTheta);
  const update = -learningRate * gradient;
  const nextTheta = isDiverged ? currentTheta : currentTheta + update;

  return {
    step: stepNumber,
    theta: currentTheta,
    loss,
    gradient,
    update,
    nextTheta,
    isDiverged
  };
}

export type OptimizerAlgorithm = 'sgd' | 'momentum' | 'rmsprop' | 'adam';

export interface MultiOptimizerConfig {
  algorithm: OptimizerAlgorithm;
  lr: number;
  beta1?: number; // Momentum coefficient or Adam first moment (default 0.9)
  beta2?: number; // Adam second moment or RMSprop decay (default 0.999 / 0.9)
  epsilon?: number; // (default 1e-8)
}

export interface OptimizerState2D {
  algorithm: OptimizerAlgorithm;
  x: number;
  y: number;
  vx: number; // velocity / first moment
  vy: number;
  sx: number; // second moment
  sy: number;
  step: number;
  history: Array<{ x: number; y: number; loss: number }>;
}

export interface Landscape2D {
  id: string;
  name: string;
  formula: string;
  evaluate: (x: number, y: number) => number;
  gradient: (x: number, y: number) => [number, number];
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number };
  globalMin: [number, number];
}

export const RAVINE_LANDSCAPE: Landscape2D = {
  id: 'ravine',
  name: 'Anisotropic Ravine (Elongated Valley)',
  formula: 'L(x, y) = 0.5 · x² + 8.0 · y²',
  evaluate: (x: number, y: number) => 0.5 * x * x + 8.0 * y * y,
  gradient: (x: number, y: number) => [x, 16.0 * y],
  bounds: { xMin: -4.5, xMax: 4.5, yMin: -2.5, yMax: 2.5 },
  globalMin: [0, 0]
};

export function initOptimizerState2D(
  algorithm: OptimizerAlgorithm,
  startX: number = -3.8,
  startY: number = 1.8
): OptimizerState2D {
  const initialLoss = RAVINE_LANDSCAPE.evaluate(startX, startY);
  return {
    algorithm,
    x: startX,
    y: startY,
    vx: 0,
    vy: 0,
    sx: 0,
    sy: 0,
    step: 0,
    history: [{ x: startX, y: startY, loss: initialLoss }]
  };
}

export function stepOptimizer2D(
  state: OptimizerState2D,
  landscape: Landscape2D,
  lr: number,
  beta1: number = 0.9,
  beta2: number = 0.999,
  eps: number = 1e-8
): OptimizerState2D {
  const [gx, gy] = landscape.gradient(state.x, state.y);
  let newX = state.x;
  let newY = state.y;
  let newVx = state.vx;
  let newVy = state.vy;
  let newSx = state.sx;
  let newSy = state.sy;
  const t = state.step + 1;

  switch (state.algorithm) {
    case 'sgd': {
      newX = state.x - lr * gx;
      newY = state.y - lr * gy;
      break;
    }
    case 'momentum': {
      newVx = beta1 * state.vx + (1 - beta1) * gx;
      newVy = beta1 * state.vy + (1 - beta1) * gy;
      newX = state.x - lr * newVx;
      newY = state.y - lr * newVy;
      break;
    }
    case 'rmsprop': {
      newSx = beta1 * state.sx + (1 - beta1) * (gx * gx);
      newSy = beta1 * state.sy + (1 - beta1) * (gy * gy);
      newX = state.x - (lr / (Math.sqrt(newSx) + eps)) * gx;
      newY = state.y - (lr / (Math.sqrt(newSy) + eps)) * gy;
      break;
    }
    case 'adam': {
      // First moment
      newVx = beta1 * state.vx + (1 - beta1) * gx;
      newVy = beta1 * state.vy + (1 - beta1) * gy;
      // Second moment
      newSx = beta2 * state.sx + (1 - beta2) * (gx * gx);
      newSy = beta2 * state.sy + (1 - beta2) * (gy * gy);
      // Bias correction
      const bc1 = 1 - Math.pow(beta1, t);
      const bc2 = 1 - Math.pow(beta2, t);
      const mHatX = newVx / (bc1 > 1e-10 ? bc1 : 1);
      const mHatY = newVy / (bc1 > 1e-10 ? bc1 : 1);
      const vHatX = newSx / (bc2 > 1e-10 ? bc2 : 1);
      const vHatY = newSy / (bc2 > 1e-10 ? bc2 : 1);

      newX = state.x - (lr / (Math.sqrt(vHatX) + eps)) * mHatX;
      newY = state.y - (lr / (Math.sqrt(vHatY) + eps)) * mHatY;
      break;
    }
  }

  // Clip extreme divergence
  if (Math.abs(newX) > 30) newX = Math.sign(newX) * 30;
  if (Math.abs(newY) > 30) newY = Math.sign(newY) * 30;

  const currentLoss = landscape.evaluate(newX, newY);

  return {
    algorithm: state.algorithm,
    x: Math.round(newX * 1000) / 1000,
    y: Math.round(newY * 1000) / 1000,
    vx: newVx,
    vy: newVy,
    sx: newSx,
    sy: newSy,
    step: t,
    history: [...state.history, { x: newX, y: newY, loss: currentLoss }]
  };
}
