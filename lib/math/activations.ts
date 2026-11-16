export type ActivationType = 'sigmoid' | 'tanh' | 'relu' | 'leaky_relu';

export interface ActivationInfo {
  id: ActivationType;
  name: string;
  formula: string;
  derivativeFormula: string;
  outputRange: string;
  description: string;
  saturationBehavior: string;
}

export const ACTIVATION_METADATA: Record<ActivationType, ActivationInfo> = {
  sigmoid: {
    id: 'sigmoid',
    name: 'Sigmoid',
    formula: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
    derivativeFormula: "\\sigma'(z) = \\sigma(z) \\cdot (1 - \\sigma(z))",
    outputRange: '(0, 1)',
    description: 'S-shaped curve smoothly mapping any real input into a probability-like range between 0 and 1.',
    saturationBehavior: 'Saturates for large |z|, leading to near-zero gradients (vanishing gradient problem).'
  },
  tanh: {
    id: 'tanh',
    name: 'Hyperbolic Tangent (Tanh)',
    formula: '\\tanh(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}}',
    derivativeFormula: "\\tanh'(z) = 1 - \\tanh^2(z)",
    outputRange: '(-1, 1)',
    description: 'Zero-centered S-shaped curve. Often converges faster than sigmoid because average activations are centered near zero.',
    saturationBehavior: 'Strongly saturates when |z| > 2.5, causing gradients to diminish rapidly.'
  },
  relu: {
    id: 'relu',
    name: 'Rectified Linear Unit (ReLU)',
    formula: '\\text{ReLU}(z) = \\max(0, z)',
    derivativeFormula: "\\text{ReLU}'(z) = \\begin{cases} 1 & z > 0 \\\\ 0 & z \\le 0 \\end{cases}",
    outputRange: '[0, ∞)',
    description: 'The standard activation for modern deep networks. Highly efficient to compute and avoids saturation for positive values.',
    saturationBehavior: 'Completely flat (gradient = 0) for negative inputs, which can cause dead neurons.'
  },
  leaky_relu: {
    id: 'leaky_relu',
    name: 'Leaky ReLU',
    formula: '\\text{LeakyReLU}(z) = \\begin{cases} z & z > 0 \\\\ \\alpha z & z \\le 0 \\end{cases}',
    derivativeFormula: "\\text{LeakyReLU}'(z) = \\begin{cases} 1 & z > 0 \\\\ \\alpha & z \\le 0 \\end{cases}",
    outputRange: '(-∞, ∞)',
    description: 'Variation of ReLU that allows a small, non-zero gradient (α ≈ 0.01) when z < 0 to prevent dead neurons.',
    saturationBehavior: 'Never completely saturates; keeps a small constant slope for negative values.'
  }
};

export function sigmoid(z: number): number {
  if (z >= 40) return 1;
  if (z <= -40) return 0;
  return 1 / (1 + Math.exp(-z));
}

export function sigmoidDerivative(z: number): number {
  const s = sigmoid(z);
  return s * (1 - s);
}

export function tanh(z: number): number {
  if (z >= 20) return 1;
  if (z <= -20) return -1;
  return Math.tanh(z);
}

export function tanhDerivative(z: number): number {
  const t = tanh(z);
  return 1 - t * t;
}

export function relu(z: number): number {
  return Math.max(0, z);
}

export function reluDerivative(z: number): number {
  return z > 0 ? 1 : 0;
}

export function leakyRelu(z: number, alpha: number = 0.01): number {
  return z > 0 ? z : alpha * z;
}

export function leakyReluDerivative(z: number, alpha: number = 0.01): number {
  return z > 0 ? 1 : alpha;
}

export function applyActivation(type: ActivationType, z: number, alpha: number = 0.01): number {
  switch (type) {
    case 'sigmoid':
      return sigmoid(z);
    case 'tanh':
      return tanh(z);
    case 'relu':
      return relu(z);
    case 'leaky_relu':
      return leakyRelu(z, alpha);
  }
}

export function applyActivationDerivative(type: ActivationType, z: number, alpha: number = 0.01): number {
  switch (type) {
    case 'sigmoid':
      return sigmoidDerivative(z);
    case 'tanh':
      return tanhDerivative(z);
    case 'relu':
      return reluDerivative(z);
    case 'leaky_relu':
      return leakyReluDerivative(z, alpha);
  }
}
