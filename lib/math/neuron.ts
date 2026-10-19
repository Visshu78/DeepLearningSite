import { ActivationType, applyActivation, applyActivationDerivative } from './activations';

export interface SingleNeuronInput {
  inputs: number[];
  weights: number[];
  bias: number;
  activation: ActivationType;
}

export interface SingleNeuronResult {
  products: number[];
  sumProducts: number;
  bias: number;
  z: number; // Pre-activation: sum(w_i * x_i) + b
  a: number; // Post-activation: phi(z)
  activationDerivative: number; // phi'(z)
  weightGradients: number[]; // d a / d w_i = phi'(z) * x_i
  biasGradient: number; // d a / d b = phi'(z)
  inputGradients: number[]; // d a / d x_i = phi'(z) * w_i
}

/**
 * Computes exact single neuron forward propagation and local analytical derivatives.
 */
export function computeSingleNeuron(data: SingleNeuronInput): SingleNeuronResult {
  const { inputs, weights, bias, activation } = data;
  if (inputs.length !== weights.length) {
    throw new Error(`Input length (${inputs.length}) must match weights length (${weights.length})`);
  }

  const products = inputs.map((x, i) => x * weights[i]);
  const sumProducts = products.reduce((acc, val) => acc + val, 0);
  const z = sumProducts + bias;
  const a = applyActivation(activation, z);
  const activationDerivative = applyActivationDerivative(activation, z);

  const weightGradients = inputs.map(x => activationDerivative * x);
  const biasGradient = activationDerivative;
  const inputGradients = weights.map(w => activationDerivative * w);

  return {
    products,
    sumProducts,
    bias,
    z,
    a,
    activationDerivative,
    weightGradients,
    biasGradient,
    inputGradients
  };
}
