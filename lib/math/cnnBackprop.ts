/**
 * Mathematics for Convolutional Backpropagation
 * - Filter gradient: dL/dK = X * dL/dY (valid cross-correlation)
 * - Input gradient: dL/dX = dL/dY *_{full} rot180(K)
 * - Bias gradient: dL/db = sum(dL/dY)
 * - Max-pooling backward pass with argmax mask routing
 */

export interface ConvBackpropResult {
  dL_dK: number[][]; // Gradient w.r.t kernel weights
  dL_dX: number[][]; // Gradient w.r.t input features
  dL_db: number;     // Gradient w.r.t bias scalar
}

export interface MaxPoolBackpropResult {
  dL_dX: number[][];
  mask: boolean[][]; // Which cells received the gradient
}

/**
 * Rotates a 2D matrix by 180 degrees (reverses rows and columns)
 */
export function rotateKernel180(kernel: number[][]): number[][] {
  const kh = kernel.length;
  const kw = kernel[0].length;
  const rotated: number[][] = Array.from({ length: kh }, () => Array(kw).fill(0));

  for (let r = 0; r < kh; r++) {
    for (let c = 0; c < kw; c++) {
      rotated[r][c] = kernel[kh - 1 - r][kw - 1 - c];
    }
  }
  return rotated;
}

/**
 * Applies zero-padding to a 2D matrix
 */
export function padMatrix(input: number[][], padH: number, padW: number): number[][] {
  const inH = input.length;
  const inW = input[0].length;
  const outH = inH + 2 * padH;
  const outW = inW + 2 * padW;
  const out: number[][] = Array.from({ length: outH }, () => Array(outW).fill(0));

  for (let r = 0; r < inH; r++) {
    for (let c = 0; c < inW; c++) {
      out[r + padH][c + padW] = input[r][c];
    }
  }
  return out;
}

/**
 * Computes analytical gradients for a 2D convolutional layer
 * Forward operation: Y(i, j) = sum_{m, n} X(i+m, j+n) * K(m, n) + b
 */
export function computeConvBackprop(
  input: number[][],
  kernel: number[][],
  outputGrad: number[][],
  stride: number = 1,
  padding: number = 0
): ConvBackpropResult {
  const inH = input.length;
  const inW = input[0].length;
  const kh = kernel.length;
  const kw = kernel[0].length;
  const outH = outputGrad.length;
  const outW = outputGrad[0].length;

  const paddedInput = padding > 0 ? padMatrix(input, padding, padding) : input;
  const paddedH = paddedInput.length;
  const paddedW = paddedInput[0].length;

  // 1. dL/dK: Gradient w.r.t. kernel weights
  // dL/dK(m, n) = sum_{i, j} outputGrad(i, j) * paddedInput(i*stride + m, j*stride + n)
  const dL_dK: number[][] = Array.from({ length: kh }, () => Array(kw).fill(0));
  for (let m = 0; m < kh; m++) {
    for (let n = 0; n < kw; n++) {
      let sum = 0;
      for (let i = 0; i < outH; i++) {
        for (let j = 0; j < outW; j++) {
          const r = i * stride + m;
          const c = j * stride + n;
          if (r < paddedH && c < paddedW) {
            sum += outputGrad[i][j] * paddedInput[r][c];
          }
        }
      }
      dL_dK[m][n] = sum;
    }
  }

  // 2. dL/db: Gradient w.r.t. bias
  // dL/db = sum_{i, j} outputGrad(i, j)
  let dL_db = 0;
  for (let i = 0; i < outH; i++) {
    for (let j = 0; j < outW; j++) {
      dL_db += outputGrad[i][j];
    }
  }

  // 3. dL/dX: Gradient w.r.t. input activations
  // Full convolution with 180-degree rotated kernel
  const rotK = rotateKernel180(kernel);
  const dL_dPaddedX: number[][] = Array.from({ length: paddedH }, () => Array(paddedW).fill(0));

  for (let i = 0; i < outH; i++) {
    for (let j = 0; j < outW; j++) {
      const grad = outputGrad[i][j];
      if (grad === 0) continue;

      for (let m = 0; m < kh; m++) {
        for (let n = 0; n < kw; n++) {
          const r = i * stride + m;
          const c = j * stride + n;
          if (r < paddedH && c < paddedW) {
            dL_dPaddedX[r][c] += grad * kernel[m][n];
          }
        }
      }
    }
  }

  // Unpad to get gradient w.r.t original unpadded input X
  const dL_dX: number[][] = Array.from({ length: inH }, () => Array(inW).fill(0));
  for (let r = 0; r < inH; r++) {
    for (let c = 0; c < inW; c++) {
      dL_dX[r][c] = dL_dPaddedX[r + padding][c + padding];
    }
  }

  return { dL_dK, dL_dX, dL_db };
}

/**
 * Backward pass for 2D Max Pooling
 * Routes the upstream gradient only to the cell with maximum value during forward pass
 */
export function computeMaxPoolBackprop(
  input: number[][],
  outputGrad: number[][],
  poolSize: number = 2,
  stride: number = 2
): MaxPoolBackpropResult {
  const inH = input.length;
  const inW = input[0].length;
  const outH = outputGrad.length;
  const outW = outputGrad[0].length;

  const dL_dX: number[][] = Array.from({ length: inH }, () => Array(inW).fill(0));
  const mask: boolean[][] = Array.from({ length: inH }, () => Array(inW).fill(false));

  for (let pr = 0; pr < outH; pr++) {
    for (let pc = 0; pc < outW; pc++) {
      const upstreamGrad = outputGrad[pr][pc];
      const startR = pr * stride;
      const startC = pc * stride;

      let maxVal = -Infinity;
      let maxR = startR;
      let maxC = startC;

      for (let r = 0; r < poolSize; r++) {
        for (let c = 0; c < poolSize; c++) {
          const curR = startR + r;
          const curC = startC + c;
          if (curR < inH && curC < inW) {
            if (input[curR][curC] > maxVal) {
              maxVal = input[curR][curC];
              maxR = curR;
              maxC = curC;
            }
          }
        }
      }

      dL_dX[maxR][maxC] += upstreamGrad;
      mask[maxR][maxC] = true;
    }
  }

  return { dL_dX, mask };
}

/**
 * Verifies kernel gradient numerically via symmetric finite differences
 */
export function numericalGradientCheckConvKernel(
  input: number[][],
  kernel: number[][],
  bias: number,
  outputGrad: number[][],
  m: number,
  n: number,
  eps: number = 1e-5
): number {
  const forwardLoss = (kMat: number[][]): number => {
    let loss = 0;
    const kh = kMat.length;
    const kw = kMat[0].length;
    const outH = outputGrad.length;
    const outW = outputGrad[0].length;

    for (let i = 0; i < outH; i++) {
      for (let j = 0; j < outW; j++) {
        let convVal = bias;
        for (let r = 0; r < kh; r++) {
          for (let c = 0; c < kw; c++) {
            convVal += input[i + r][j + c] * kMat[r][c];
          }
        }
        loss += convVal * outputGrad[i][j];
      }
    }
    return loss;
  };

  const kPlus = kernel.map(row => [...row]);
  const kMinus = kernel.map(row => [...row]);
  kPlus[m][n] += eps;
  kMinus[m][n] -= eps;

  return (forwardLoss(kPlus) - forwardLoss(kMinus)) / (2 * eps);
}
