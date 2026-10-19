import { describe, it, expect } from 'vitest';
import {
  forwardPropagate,
  backPropagate,
  applyGradients,
  numericalGradientCheck,
  NetworkConfig
} from '../../lib/math/network';
import { mseLoss } from '../../lib/math/loss';
import { sigmoid } from '../../lib/math/activations';

describe('Neural Network Forward & Analytical Backpropagation', () => {
  const initialConfig: NetworkConfig = {
    inputs: [0.6, -0.3],
    wHidden: [
      [0.5, -0.4],
      [-0.6, 0.7]
    ],
    bHidden: [0.1, -0.1],
    wOutput: [0.8, -0.5],
    bOutput: 0.15,
    activation: 'sigmoid'
  };

  it('calculates deterministic forward pass through 2-2-1 network', () => {
    const fwd = forwardPropagate(initialConfig);
    // Hidden 0: z = 0.6 * 0.5 + (-0.3)*(-0.4) + 0.1 = 0.30 + 0.12 + 0.10 = 0.52
    expect(fwd.zHidden[0]).toBeCloseTo(0.52, 6);
    expect(fwd.aHidden[0]).toBeCloseTo(sigmoid(0.52), 6);

    // Hidden 1: z = 0.6 * (-0.6) + (-0.3)*(0.7) - 0.1 = -0.36 - 0.21 - 0.1 = -0.67
    expect(fwd.zHidden[1]).toBeCloseTo(-0.67, 6);
    expect(fwd.aHidden[1]).toBeCloseTo(sigmoid(-0.67), 6);
  });

  it('verifies analytical gradients against finite-difference checks for ALL 9 parameters', () => {
    const target = 0.90;
    const bp = backPropagate(initialConfig, target);

    // 1. Output Weight 0
    const num_wOut0 = numericalGradientCheck(initialConfig, target, {
      get: c => c.wOutput[0],
      set: (c, v) => ({ ...c, wOutput: [v, c.wOutput[1]] })
    });
    expect(bp.dL_dwOutput[0]).toBeCloseTo(num_wOut0, 4);

    // 2. Output Weight 1
    const num_wOut1 = numericalGradientCheck(initialConfig, target, {
      get: c => c.wOutput[1],
      set: (c, v) => ({ ...c, wOutput: [c.wOutput[0], v] })
    });
    expect(bp.dL_dwOutput[1]).toBeCloseTo(num_wOut1, 4);

    // 3. Output Bias
    const num_bOut = numericalGradientCheck(initialConfig, target, {
      get: c => c.bOutput,
      set: (c, v) => ({ ...c, bOutput: v })
    });
    expect(bp.dL_dbOutput).toBeCloseTo(num_bOut, 4);

    // 4. Hidden Weight w00
    const num_wH00 = numericalGradientCheck(initialConfig, target, {
      get: c => c.wHidden[0][0],
      set: (c, v) => ({ ...c, wHidden: [[v, c.wHidden[0][1]], c.wHidden[1]] })
    });
    expect(bp.dL_dwHidden[0][0]).toBeCloseTo(num_wH00, 4);

    // 5. Hidden Weight w01
    const num_wH01 = numericalGradientCheck(initialConfig, target, {
      get: c => c.wHidden[0][1],
      set: (c, v) => ({ ...c, wHidden: [[c.wHidden[0][0], v], c.wHidden[1]] })
    });
    expect(bp.dL_dwHidden[0][1]).toBeCloseTo(num_wH01, 4);

    // 6. Hidden Weight w10
    const num_wH10 = numericalGradientCheck(initialConfig, target, {
      get: c => c.wHidden[1][0],
      set: (c, v) => ({ ...c, wHidden: [c.wHidden[0], [v, c.wHidden[1][1]]] })
    });
    expect(bp.dL_dwHidden[1][0]).toBeCloseTo(num_wH10, 4);

    // 7. Hidden Weight w11
    const num_wH11 = numericalGradientCheck(initialConfig, target, {
      get: c => c.wHidden[1][1],
      set: (c, v) => ({ ...c, wHidden: [c.wHidden[0], [c.wHidden[1][0], v]] })
    });
    expect(bp.dL_dwHidden[1][1]).toBeCloseTo(num_wH11, 4);

    // 8. Hidden Bias bH0
    const num_bH0 = numericalGradientCheck(initialConfig, target, {
      get: c => c.bHidden[0],
      set: (c, v) => ({ ...c, bHidden: [v, c.bHidden[1]] })
    });
    expect(bp.dL_dbHidden[0]).toBeCloseTo(num_bH0, 4);

    // 9. Hidden Bias bH1
    const num_bH1 = numericalGradientCheck(initialConfig, target, {
      get: c => c.bHidden[1],
      set: (c, v) => ({ ...c, bHidden: [c.bHidden[0], v] })
    });
    expect(bp.dL_dbHidden[1]).toBeCloseTo(num_bH1, 4);
  });

  it('gradient check holds for Tanh activation', () => {
    const tanhConfig: NetworkConfig = {
      ...initialConfig,
      activation: 'tanh'
    };
    const target = 0.5;
    const bp = backPropagate(tanhConfig, target);

    const num_wOut0 = numericalGradientCheck(tanhConfig, target, {
      get: c => c.wOutput[0],
      set: (c, v) => ({ ...c, wOutput: [v, c.wOutput[1]] })
    });
    expect(bp.dL_dwOutput[0]).toBeCloseTo(num_wOut0, 4);
  });

  it('gradient step strictly decreases loss', () => {
    const target = 0.90;
    const bp = backPropagate(initialConfig, target);
    const initialLoss = bp.loss;

    const nextConfig = applyGradients(initialConfig, bp, 0.5);
    const nextFwd = forwardPropagate(nextConfig);
    const nextLoss = mseLoss(target, nextFwd.prediction).loss;

    expect(nextLoss).toBeLessThan(initialLoss);
  });
});
