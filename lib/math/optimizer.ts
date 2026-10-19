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
