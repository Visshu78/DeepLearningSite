import { describe, it, expect } from 'vitest';
import {
  computeCompoundScaling,
  compareSeparableConvolution,
  computeSqueezeExcitation,
  EFFICIENTNET_MODELS
} from '../../lib/math/efficientnet';

describe('EfficientNet Mathematical Engine', () => {
  it('correctly models compound scaling coefficients and baseline configurations', () => {
    // B0 should match base specs
    const b0 = EFFICIENTNET_MODELS[0];
    expect(b0.phi).toBe(0);
    expect(b0.depthScale).toBe(1.0);
    expect(b0.resolution).toBe(224);

    // B1: depth scales by 1.2, width by 1.1, resolution to 240
    const customB1 = computeCompoundScaling(1.0);
    expect(customB1.depthScale).toBeCloseTo(1.2, 1);
    expect(customB1.widthScale).toBeCloseTo(1.1, 1);
    expect(customB1.resolution).toBe(258); // 224 * 1.15 = 257.6 ~ 258
    expect(customB1.gflops).toBeCloseTo(0.78, 1);
  });

  it('demonstrates ~8x to 9x parameter and FLOP reduction with Depthwise Separable Convolutions', () => {
    // Standard conv: 3x3, Cin=64, Cout=128
    // Standard params = 9 * 64 * 128 = 73,728
    // Separable params = (9 * 64) + (64 * 128) = 576 + 8192 = 8,768
    // Reduction = (73728 - 8768)/73728 = 88.1% savings!
    const comp = compareSeparableConvolution(64, 128, 3, 28, 28);
    expect(comp.standardParams).toBe(73728);
    expect(comp.separableParams).toBe(8768);
    expect(comp.paramReductionPercent).toBeGreaterThan(85);
    expect(comp.flopReductionPercent).toBeGreaterThan(85);

    // Theoretical ratio: 1/128 + 1/9 = 0.0078 + 0.1111 = 0.1189 (~ 8.4x reduction)
    expect(comp.theoreticalRatio).toBeCloseTo(0.1189, 3);
  });

  it('evaluates Squeeze-and-Excitation channel gating factors between 0 and 1', () => {
    const activations = [0.8, 0.2, 1.5, 0.4, 0.9, 0.1, 1.2, 0.7];
    const se = computeSqueezeExcitation(activations, 4);

    expect(se.expandedChannels).toBe(8);
    expect(se.reducedChannels).toBe(2);
    expect(se.excitationScale.length).toBe(8);

    // Every gating weight must be between 0 and 1 (from Sigmoid)
    se.excitationScale.forEach(val => {
      expect(val).toBeGreaterThan(0);
      expect(val).toBeLessThan(1);
    });
  });
});
