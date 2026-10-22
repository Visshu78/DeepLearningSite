import { describe, it, expect } from 'vitest';
import {
  rotateKernel180,
  computeConvBackprop,
  computeMaxPoolBackprop,
  numericalGradientCheckConvKernel
} from '../../lib/math/cnnBackprop';

describe('CNN Backpropagation Math', () => {
  it('correctly rotates a 2D kernel by 180 degrees', () => {
    const kernel = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const rotated = rotateKernel180(kernel);
    expect(rotated).toEqual([
      [9, 8, 7],
      [6, 5, 4],
      [3, 2, 1]
    ]);
  });

  it('computes exact analytical kernel gradients matching numerical gradient checks', () => {
    const input = [
      [1.0, 2.0, 0.5],
      [0.0, 1.5, 3.0],
      [2.5, 0.5, 1.0]
    ];
    const kernel = [
      [0.5, -0.2],
      [1.0, 0.4]
    ];
    const outputGrad = [
      [1.0, -0.5],
      [0.8, 2.0]
    ];

    const { dL_dK, dL_db } = computeConvBackprop(input, kernel, outputGrad, 1, 0);

    // Check dL_db = sum(outputGrad) = 1.0 - 0.5 + 0.8 + 2.0 = 3.3
    expect(dL_db).toBeCloseTo(3.3, 5);

    // Verify each kernel weight gradient matches numerical finite differences
    for (let m = 0; m < 2; m++) {
      for (let n = 0; n < 2; n++) {
        const numGrad = numericalGradientCheckConvKernel(input, kernel, 0.1, outputGrad, m, n);
        expect(dL_dK[m][n]).toBeCloseTo(numGrad, 4);
      }
    }
  });

  it('routes upstream gradients strictly to argmax positions during max pooling backpropagation', () => {
    const input = [
      [10, 25, 5, 30],
      [8, 12, 18, 4],
      [40, 50, 15, 20],
      [35, 10, 80, 70]
    ];
    const outputGrad = [
      [2.0, -1.5],
      [3.0, 4.0]
    ];

    const { dL_dX, mask } = computeMaxPoolBackprop(input, outputGrad, 2, 2);

    // Quad (0,0): max is input[0][1] = 25 -> receives 2.0
    expect(mask[0][1]).toBe(true);
    expect(dL_dX[0][1]).toBe(2.0);
    expect(dL_dX[0][0]).toBe(0.0);

    // Quad (0,1): max is input[0][3] = 30 -> receives -1.5
    expect(mask[0][3]).toBe(true);
    expect(dL_dX[0][3]).toBe(-1.5);

    // Quad (1,0): max is input[2][1] = 50 -> receives 3.0
    expect(mask[2][1]).toBe(true);
    expect(dL_dX[2][1]).toBe(3.0);

    // Quad (1,1): max is input[3][2] = 80 -> receives 4.0
    expect(mask[3][2]).toBe(true);
    expect(dL_dX[3][2]).toBe(4.0);
  });
});
