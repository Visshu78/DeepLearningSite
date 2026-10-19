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
    formula: 'σ(z) = 1 / (1 + e^(-z))',
    derivativeFormula: "σ'(z) = σ(z) · (1 - σ(z))",
    outputRange: '(0, 1)',
    description: 'S-shaped curve smoothly mapping any real input into a probability-like range between 0 and 1.',
    saturationBehavior: 'Saturates for large |z|, leading to near-zero gradients (vanishing gradient problem).'
  },
  tanh: {
    id: 'tanh',
    name: 'Hyperbolic Tangent (Tanh)',
    formula: 'tanh(z) = (e^z - e^(-z)) / (e^z + e^(-z))',
    derivativeFormula: "tanh'(z) = 1 - tanh²(z)",
    outputRange: '(-1, 1)',
    description: 'Zero-centered S-shaped curve. Often converges faster than sigmoid because average activations are centered near zero.',
    saturationBehavior: 'Strongly saturates when |z| > 2.5, causing gradients to diminish rapidly.'
  },
  relu: {
    id: 'relu',
    name: 'Rectified Linear Unit (ReLU)',
    formula: 'ReLU(z) = max(0, z)',
    derivativeFormula: "ReLU'(z) = 1 if z > 0 else 0",
    outputRange: '[0, ∞)',
    description: 'The standard activation for modern deep networks. Highly efficient to compute and avoids saturation for positive values.',
    saturationBehavior: 'Completely flat (gradient = 0) for negative inputs, which can cause dead neurons.'
  },
  leaky_relu: {
    id: 'leaky_relu',
    name: 'Leaky ReLU',
    formula: 'LeakyReLU(z) = z if z > 0 else α · z',
    derivativeFormula: "LeakyReLU'(z) = 1 if z > 0 else α",
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
