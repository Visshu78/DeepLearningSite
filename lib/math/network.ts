import { ActivationType, applyActivation, applyActivationDerivative } from './activations';
import { mseLoss } from './loss';

export interface NetworkConfig {
  inputs: [number, number];
  // W1: hidden neurons h0 and h1
  // wHidden[0] = weights for hidden neuron 0: [w00, w01] (from input0, input1)
  // wHidden[1] = weights for hidden neuron 1: [w10, w11] (from input0, input1)
  wHidden: [[number, number], [number, number]];
  bHidden: [number, number];
  // W2: output neuron weights: [wOut0, wOut1] (from h0, h1)
  wOutput: [number, number];
  bOutput: number;
  activation: ActivationType;
}

export interface ForwardStepResult {
  inputs: [number, number];
  // Hidden layer details
  hiddenProducts: [[number, number], [number, number]];
  zHidden: [number, number];
  aHidden: [number, number];
  hiddenDerivatives: [number, number]; // phi'(zHidden)
  // Output layer details
  outputProducts: [number, number];
  zOutput: number;
  prediction: number; // aOutput
  outputDerivative: number; // phi'(zOutput)
}

export interface BackpropResult {
  forward: ForwardStepResult;
  loss: number;
  target: number;
  // Gradients
  dL_dPred: number;
  dL_dzOutput: number;
  dL_dwOutput: [number, number];
  dL_dbOutput: number;
  dL_daHidden: [number, number];
  dL_dzHidden: [number, number];
  dL_dwHidden: [[number, number], [number, number]];
  dL_dbHidden: [number, number];
  dL_dInputs: [number, number];
}

/**
 * Analytical forward propagation through a 2-2-1 network.
 */
export function forwardPropagate(config: NetworkConfig): ForwardStepResult {
  const [x0, x1] = config.inputs;
  const { wHidden, bHidden, wOutput, bOutput, activation } = config;

  // Hidden neuron 0
  const h0_p0 = x0 * wHidden[0][0];
  const h0_p1 = x1 * wHidden[0][1];
  const zH0 = h0_p0 + h0_p1 + bHidden[0];
  const aH0 = applyActivation(activation, zH0);
  const dH0 = applyActivationDerivative(activation, zH0);

  // Hidden neuron 1
  const h1_p0 = x0 * wHidden[1][0];
  const h1_p1 = x1 * wHidden[1][1];
  const zH1 = h1_p0 + h1_p1 + bHidden[1];
  const aH1 = applyActivation(activation, zH1);
  const dH1 = applyActivationDerivative(activation, zH1);

  // Output neuron
  const out_p0 = aH0 * wOutput[0];
  const out_p1 = aH1 * wOutput[1];
  const zOut = out_p0 + out_p1 + bOutput;
  // Using sigmoid for output to keep predictions bounded in (0,1), or same activation
  const prediction = applyActivation(activation, zOut);
  const outD = applyActivationDerivative(activation, zOut);

  return {
    inputs: [x0, x1],
    hiddenProducts: [
      [h0_p0, h0_p1],
      [h1_p0, h1_p1]
    ],
    zHidden: [zH0, zH1],
    aHidden: [aH0, aH1],
    hiddenDerivatives: [dH0, dH1],
    outputProducts: [out_p0, out_p1],
    zOutput: zOut,
    prediction,
    outputDerivative: outD
  };
}

/**
 * Analytical backpropagation using exact chain rule.
 * Loss = 0.5 * (prediction - target)^2
 */
export function backPropagate(config: NetworkConfig, target: number): BackpropResult {
  const forward = forwardPropagate(config);
  const { loss, derivative: dL_dPred } = mseLoss(target, forward.prediction);

  // Output layer chain rule:
  // dL/dzOut = dL/dPred * phi'(zOut)
  const dL_dzOutput = dL_dPred * forward.outputDerivative;

  // dL/dwOutput_i = dL/dzOut * aHidden_i
  const dL_dwOutput: [number, number] = [
    dL_dzOutput * forward.aHidden[0],
    dL_dzOutput * forward.aHidden[1]
  ];

  // dL/dbOutput = dL/dzOut * 1
  const dL_dbOutput = dL_dzOutput;

  // Hidden layer chain rule:
  // dL/daHidden_0 = dL/dzOut * wOutput_0
  // dL/daHidden_1 = dL/dzOut * wOutput_1
  const dL_daHidden: [number, number] = [
    dL_dzOutput * config.wOutput[0],
    dL_dzOutput * config.wOutput[1]
  ];

  // dL/dzHidden_i = dL/daHidden_i * phi'(zHidden_i)
  const dL_dzHidden: [number, number] = [
    dL_daHidden[0] * forward.hiddenDerivatives[0],
    dL_daHidden[1] * forward.hiddenDerivatives[1]
  ];

  // dL/dwHidden_i_j = dL/dzHidden_i * input_j
  const dL_dwHidden: [[number, number], [number, number]] = [
    [dL_dzHidden[0] * config.inputs[0], dL_dzHidden[0] * config.inputs[1]],
    [dL_dzHidden[1] * config.inputs[0], dL_dzHidden[1] * config.inputs[1]]
  ];

  // dL/dbHidden_i = dL/dzHidden_i * 1
  const dL_dbHidden: [number, number] = [
    dL_dzHidden[0],
    dL_dzHidden[1]
  ];

  // Optional: input gradients
  const dL_dInputs: [number, number] = [
    dL_dzHidden[0] * config.wHidden[0][0] + dL_dzHidden[1] * config.wHidden[1][0],
    dL_dzHidden[0] * config.wHidden[0][1] + dL_dzHidden[1] * config.wHidden[1][1]
  ];

  return {
    forward,
    loss,
    target,
    dL_dPred,
    dL_dzOutput,
    dL_dwOutput,
    dL_dbOutput,
    dL_daHidden,
    dL_dzHidden,
    dL_dwHidden,
    dL_dbHidden,
    dL_dInputs
  };
}

/**
 * Apply Gradient Descent Step:
 * theta_new = theta - lr * gradient
 */
export function applyGradients(config: NetworkConfig, grads: BackpropResult, lr: number): NetworkConfig {
  return {
    inputs: config.inputs,
    activation: config.activation,
    wHidden: [
      [
        config.wHidden[0][0] - lr * grads.dL_dwHidden[0][0],
        config.wHidden[0][1] - lr * grads.dL_dwHidden[0][1]
      ],
      [
        config.wHidden[1][0] - lr * grads.dL_dwHidden[1][0],
        config.wHidden[1][1] - lr * grads.dL_dwHidden[1][1]
      ]
    ],
    bHidden: [
      config.bHidden[0] - lr * grads.dL_dbHidden[0],
      config.bHidden[1] - lr * grads.dL_dbHidden[1]
    ],
    wOutput: [
      config.wOutput[0] - lr * grads.dL_dwOutput[0],
      config.wOutput[1] - lr * grads.dL_dwOutput[1]
    ],
    bOutput: config.bOutput - lr * grads.dL_dbOutput
  };
}

/**
 * Computes numerical gradient for any parameter using finite difference:
 * [L(theta + eps) - L(theta - eps)] / (2 * eps)
 * Used to verify analytical gradients mathematically.
 */
export function numericalGradientCheck(
  config: NetworkConfig,
  target: number,
  paramAccessor: {
    get: (c: NetworkConfig) => number;
    set: (c: NetworkConfig, val: number) => NetworkConfig;
  },
  eps: number = 1e-5
): number {
  const currentVal = paramAccessor.get(config);

  const configPlus = paramAccessor.set(config, currentVal + eps);
  const lossPlus = mseLoss(target, forwardPropagate(configPlus).prediction).loss;

  const configMinus = paramAccessor.set(config, currentVal - eps);
  const lossMinus = mseLoss(target, forwardPropagate(configMinus).prediction).loss;

  return (lossPlus - lossMinus) / (2 * eps);
}
