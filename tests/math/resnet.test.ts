import { describe, it, expect } from 'vitest';
import {
  simulateResNetGradientFlow,
  computeResidualBlock1D,
  compareResNetBlocks
} from '../../lib/math/resnet';

describe('ResNet Mathematical Engine', () => {
  it('demonstrates vanishing gradient in plain networks vs stable gradient highway in ResNet', () => {
    const totalLayers = 25;
    const steps = simulateResNetGradientFlow(totalLayers, 0.7, 1.0);

    expect(steps.length).toBe(totalLayers);

    // Layer 1 (earliest input layer): plain network gradient should be tiny (0.7^25 ~ 1.3e-4)
    const layer1 = steps[0];
    expect(layer1.plainGradientMagnitude).toBeLessThan(0.001);

    // ResNet gradient at layer 1 should remain healthy and non-vanishing
    expect(layer1.resnetGradientMagnitude).toBeGreaterThan(0.5);

    // Output layer (layer 25): both start at 1.0
    const outputLayer = steps[steps.length - 1];
    expect(outputLayer.plainGradientMagnitude).toBe(1.0);
    expect(outputLayer.resnetGradientMagnitude).toBe(1.0);
  });

  it('evaluates forward residual addition H(x) = F(x) + x with gradient highway factor dF/dx + 1', () => {
    // x = 2.0, w1 = 0.5, b1 = 0.0 -> z1 = 1.0, a1 = 1.0
    // w2 = 0.4, b2 = 0.0 -> z2 = 0.4 -> F(x) = 0.4
    // H(x) = F(x) + x = 0.4 + 2.0 = 2.4
    const res = computeResidualBlock1D(2.0, 0.5, 0.4, 0.0, 0.0);
    expect(res.fx).toBeCloseTo(0.4, 4);
    expect(res.hx).toBeCloseTo(2.4, 4);

    // dF/dx = w1 * w2 = 0.20
    // Total dH/dx = dF/dx + 1 = 1.20
    expect(res.gradientHighwayFactor).toBeCloseTo(1.20, 4);
  });

  it('computes parameter savings of bottleneck residual blocks vs. standard wide convolutions', () => {
    const comparison = compareResNetBlocks(64, 56);
    // Two 3x3 on 256 channels would require 2 * 9 * 256 * 256 = 1,179,648 parameters
    // Bottleneck uses (1*256*64) + (9*64*64) + (1*64*256) = 16,384 + 36,864 + 16,384 = 69,632 parameters!
    // That is > 90% savings!
    expect(comparison.flavourSavingsPercent).toBeGreaterThan(80);
    expect(comparison.bottleneckBlock.parameters).toBeLessThan(comparison.basicBlock.parameters * 2);
  });
});
