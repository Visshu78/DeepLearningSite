import { describe, it, expect } from 'vitest';
import {
  computeCompoundScaling,
  compareSeparableConvolution,
  computeSqueezeExcitation,
  EFFICIENTNET_MODELS,
  simulateMBConvBlock,
  EFFICIENTNET_B0_STAGES
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

  it('correctly simulates MBConv block parameters, skip connection status, and savings', () => {
    // Case 1: MBConv6 with stride 1, Cin=32, Cout=32 (has skip connection)
    const blockWithSkip = simulateMBConvBlock({
      inChannels: 32,
      outChannels: 32,
      expansionFactor: 6,
      kernelSize: 3,
      stride: 1,
      seReductionRatio: 4,
      inputHeight: 28,
      inputWidth: 28
    });

    expect(blockWithSkip.expandedChannels).toBe(192);
    expect(blockWithSkip.hasSkipConnection).toBe(true);
    expect(blockWithSkip.outputHeight).toBe(28);
    expect(blockWithSkip.channelProbes.length).toBe(8);
    expect(blockWithSkip.totalBlockParams).toBeLessThan(blockWithSkip.standardExpandedParams);
    expect(blockWithSkip.expandedSavingsPercent).toBeGreaterThan(80);

    // Case 2: MBConv6 with stride 2 (downsampling, no skip connection)
    const blockStride2 = simulateMBConvBlock({
      inChannels: 32,
      outChannels: 64,
      expansionFactor: 6,
      kernelSize: 3,
      stride: 2,
      seReductionRatio: 4,
      inputHeight: 28,
      inputWidth: 28
    });

    expect(blockStride2.hasSkipConnection).toBe(false);
    expect(blockStride2.outputHeight).toBe(14);
    expect(blockStride2.outputWidth).toBe(14);
  });

  it('validates EfficientNet-B0 architectural stages table', () => {
    expect(EFFICIENTNET_B0_STAGES.length).toBe(9);
    expect(EFFICIENTNET_B0_STAGES[0].operator).toBe('Conv3x3');
    expect(EFFICIENTNET_B0_STAGES[1].operator).toBe('MBConv1');
    expect(EFFICIENTNET_B0_STAGES[8].channels).toBe(1280);
  });
});

