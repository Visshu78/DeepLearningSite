import { describe, it, expect } from 'vitest';
import {
  runCNNInferencePipeline,
  DIGIT_PRESETS,
  getConvCellTrace,
  getPoolCellTrace,
  getFeatureProvenance
} from '../../lib/math/cnnInference';

describe('End-to-End CNN Inference Engine', () => {
  it('correctly predicts Digit 0 with high confidence on canonical preset', () => {
    const digit0 = DIGIT_PRESETS.find(d => d.id === 'digit-0')!.grid;
    const result = runCNNInferencePipeline(digit0);

    expect(result.convFeatureMaps.length).toBe(3); // 3 filters
    expect(result.convFeatureMaps[0].map.length).toBe(6); // 8-3+1 = 6
    expect(result.pooledFeatureMaps.length).toBe(3);
    expect(result.pooledFeatureMaps[0].length).toBe(3); // 6/2 = 3
    expect(result.flattenedVector.length).toBe(27); // 3 * 3 * 3 = 27
    expect(result.logits.length).toBe(4);
    expect(result.probabilities.length).toBe(4);

    // Sum of probabilities must equal ~1.0
    const sumP = result.probabilities.reduce((acc, p) => acc + p.probability, 0);
    expect(sumP).toBeCloseTo(1.0, 2);

    expect(result.predictedClass).toBe('0');
    expect(result.confidencePercent).toBeGreaterThan(60);
  });

  it('correctly predicts Digit 1 on canonical preset', () => {
    const digit1 = DIGIT_PRESETS.find(d => d.id === 'digit-1')!.grid;
    const result = runCNNInferencePipeline(digit1);
    expect(result.predictedClass).toBe('1');
    expect(result.confidencePercent).toBeGreaterThan(50);
  });

  it('correctly predicts Digit 4 on canonical preset', () => {
    const digit4 = DIGIT_PRESETS.find(d => d.id === 'digit-4')!.grid;
    const result = runCNNInferencePipeline(digit4);
    expect(result.predictedClass).toBe('4');
  });

  it('correctly predicts Digit 7 on canonical preset', () => {
    const digit7 = DIGIT_PRESETS.find(d => d.id === 'digit-7')!.grid;
    const result = runCNNInferencePipeline(digit7);
    expect(result.predictedClass).toBe('7');
  });

  it('correctly computes step-by-step arithmetic in getConvCellTrace', () => {
    const digit0 = DIGIT_PRESETS.find(d => d.id === 'digit-0')!.grid;
    const trace = getConvCellTrace(digit0, 0, 1, 1);

    expect(trace.inputPatch.length).toBe(3);
    expect(trace.inputPatch[0].length).toBe(3);
    expect(trace.kernel.length).toBe(3);
    expect(trace.products.length).toBe(3);
    expect(trace.preActivation).toBe(Math.round((trace.productSum + trace.bias) * 100) / 100);
    expect(trace.reluOutput).toBe(Math.max(0, trace.preActivation));
  });

  it('correctly traces max pooling downsampling quad and winner', () => {
    const mockRelu: number[][] = [
      [0.0, 1.5, 0.2, 0.0, 0.0, 0.0],
      [2.8, 0.5, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    ];
    const trace = getPoolCellTrace(mockRelu, 0, 0);
    expect(trace.rStart).toBe(0);
    expect(trace.cStart).toBe(0);
    expect(trace.poolQuad).toEqual([
      [0.0, 1.5],
      [2.8, 0.5]
    ]);
    expect(trace.maxVal).toBe(2.8);
    expect(trace.maxCoordOffset).toEqual([1, 0]);
  });

  it('correctly maps flattened vector index back to source filter and coordinates', () => {
    const mockVector = Array.from({ length: 27 }, (_, i) => i * 0.1);
    // Index 13 should be:
    // filterIndex = floor(13/9) = 1 (Filter 2: Horizontal Bar)
    // rem = 13 % 9 = 4
    // poolRow = floor(4/3) = 1
    // poolCol = 4 % 3 = 1
    const prov = getFeatureProvenance(mockVector, 13);
    expect(prov.filterIndex).toBe(1);
    expect(prov.poolRow).toBe(1);
    expect(prov.poolCol).toBe(1);
    expect(prov.featureValue).toBeCloseTo(1.3, 2);
  });
});

