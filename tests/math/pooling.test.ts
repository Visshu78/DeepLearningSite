import { describe, it, expect } from 'vitest';
import { computePooling2D, calculateReceptiveFieldHierarchy } from '../../lib/math/pooling';

describe('Pooling & Receptive Field Engine', () => {
  it('computes 2x2 max pooling with stride 2', () => {
    const input = [
      [12, 20, 30, 0],
      [8,  12, 2,  0],
      [34, 70, 37, 4],
      [112, 100, 25, 12]
    ];
    const result = computePooling2D(input, 2, 2, 'max');
    expect(result.outHeight).toBe(2);
    expect(result.outWidth).toBe(2);
    expect(result.output[0][0]).toBe(20);
    expect(result.output[0][1]).toBe(30);
    expect(result.output[1][0]).toBe(112);
    expect(result.output[1][1]).toBe(37);
  });

  it('computes average pooling', () => {
    const input = [
      [10, 20],
      [30, 40]
    ];
    const result = computePooling2D(input, 2, 2, 'average');
    expect(result.output[0][0]).toBe(25);
  });

  it('computes receptive field growth across stacked conv and pooling layers', () => {
    const layers = [
      { name: 'Conv1 (3x3, s=1)', kernelSize: 3, stride: 1 },
      { name: 'Pool1 (2x2, s=2)', kernelSize: 2, stride: 2 },
      { name: 'Conv2 (3x3, s=1)', kernelSize: 3, stride: 1 }
    ];
    const hierarchy = calculateReceptiveFieldHierarchy(layers);
    // Conv1: rf = 1 + (3 - 1)*1 = 3
    expect(hierarchy[0].receptiveField).toBe(3);
    // Pool1: rf = 3 + (2 - 1)*1 = 4
    expect(hierarchy[1].receptiveField).toBe(4);
    // Conv2: rf = 4 + (3 - 1)*2 = 8
    expect(hierarchy[2].receptiveField).toBe(8);
  });
});
