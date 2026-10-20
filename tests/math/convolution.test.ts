import { describe, it, expect } from 'vitest';
import { computeConvolution2D, padMatrix, KERNEL_PRESETS } from '../../lib/math/convolution';

describe('2D Convolution Engine', () => {
  it('pads a matrix correctly with zeros', () => {
    const input = [
      [1, 2],
      [3, 4]
    ];
    const padded = padMatrix(input, 1);
    expect(padded.length).toBe(4);
    expect(padded[0].length).toBe(4);
    expect(padded[0]).toEqual([0, 0, 0, 0]);
    expect(padded[1]).toEqual([0, 1, 2, 0]);
    expect(padded[2]).toEqual([0, 3, 4, 0]);
    expect(padded[3]).toEqual([0, 0, 0, 0]);
  });

  it('computes valid convolution dimensions and outputs accurately', () => {
    // 4x4 input convolved with 3x3 kernel, valid padding (0), stride 1 -> 2x2 output
    const input = [
      [1, 2, 3, 0],
      [0, 1, 2, 3],
      [3, 0, 1, 2],
      [2, 3, 0, 1]
    ];
    const kernel = [
      [2, 0, 1],
      [0, 1, 0],
      [1, 0, 2]
    ];

    const result = computeConvolution2D(input, kernel, 0, 1, 0, 'none');
    expect(result.outHeight).toBe(2);
    expect(result.outWidth).toBe(2);

    // Window 0,0:
    // 1*2 + 2*0 + 3*1 + 0*0 + 1*1 + 2*0 + 3*1 + 0*0 + 1*2 = 2 + 0 + 3 + 0 + 1 + 0 + 3 + 0 + 2 = 11
    expect(result.output[0][0]).toBe(11);
  });

  it('detects vertical edges using Sobel vertical kernel', () => {
    const sobelV = KERNEL_PRESETS.find(k => k.id === 'sobel-vertical')!.kernel;
    // Strong vertical edge in the middle (bright left, dark right)
    const input = [
      [100, 100, 0, 0],
      [100, 100, 0, 0],
      [100, 100, 0, 0],
      [100, 100, 0, 0]
    ];
    const result = computeConvolution2D(input, sobelV, 0, 1, 0, 'none');
    // Output should register negative / strong gradient at transition
    expect(result.outHeight).toBe(2);
    expect(result.output[0][0]).toBeLessThan(-200);
  });
});
