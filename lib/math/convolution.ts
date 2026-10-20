export type Matrix2D = number[][];

export interface KernelPreset {
  id: string;
  name: string;
  description: string;
  kernel: Matrix2D;
}

export const KERNEL_PRESETS: KernelPreset[] = [
  {
    id: 'sobel-horizontal',
    name: 'Sobel Horizontal (Edges)',
    description: 'Detects horizontal boundaries by computing the vertical gradient (changes along rows).',
    kernel: [
      [-1, -2, -1],
      [ 0,  0,  0],
      [ 1,  2,  1]
    ]
  },
  {
    id: 'sobel-vertical',
    name: 'Sobel Vertical (Edges)',
    description: 'Detects vertical boundaries by computing the horizontal gradient (changes along columns).',
    kernel: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ]
  },
  {
    id: 'ridge-detection',
    name: 'Laplacian / Ridge',
    description: 'Highlights rapid intensity changes in all directions, emphasizing sharp outlines.',
    kernel: [
      [-1, -1, -1],
      [-1,  8, -1],
      [-1, -1, -1]
    ]
  },
  {
    id: 'sharpen',
    name: 'Sharpen',
    description: 'Enhances contrast around edges to make fine details pop out.',
    kernel: [
      [ 0, -1,  0],
      [-1,  5, -1],
      [ 0, -1,  0]
    ]
  },
  {
    id: 'gaussian-blur',
    name: 'Gaussian Blur (Normalized)',
    description: 'Weighted local average that attenuates high-frequency noise.',
    kernel: [
      [1/16, 2/16, 1/16],
      [2/16, 4/16, 2/16],
      [1/16, 2/16, 1/16]
    ]
  },
  {
    id: 'identity',
    name: 'Identity Pass-through',
    description: 'Preserves the central pixel unaltered.',
    kernel: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0]
    ]
  }
];

export interface InputImagePreset {
  id: string;
  name: string;
  data: Matrix2D;
}

export const INPUT_PRESETS: InputImagePreset[] = [
  {
    id: 'vertical-stripe',
    name: 'Vertical Stripe (6x6)',
    data: [
      [10, 10, 90, 90, 10, 10],
      [10, 10, 90, 90, 10, 10],
      [10, 10, 90, 90, 10, 10],
      [10, 10, 90, 90, 10, 10],
      [10, 10, 90, 90, 10, 10],
      [10, 10, 90, 90, 10, 10]
    ]
  },
  {
    id: 'horizontal-stripe',
    name: 'Horizontal Stripe (6x6)',
    data: [
      [10, 10, 10, 10, 10, 10],
      [10, 10, 10, 10, 10, 10],
      [90, 90, 90, 90, 90, 90],
      [90, 90, 90, 90, 90, 90],
      [10, 10, 10, 10, 10, 10],
      [10, 10, 10, 10, 10, 10]
    ]
  },
  {
    id: 'diagonal-cross',
    name: 'Cross Pattern (6x6)',
    data: [
      [90, 10, 10, 10, 10, 90],
      [10, 90, 10, 10, 90, 10],
      [10, 10, 90, 90, 10, 10],
      [10, 10, 90, 90, 10, 10],
      [10, 90, 10, 10, 90, 10],
      [90, 10, 10, 10, 10, 90]
    ]
  },
  {
    id: 'box-corner',
    name: 'Corner / L-Shape (6x6)',
    data: [
      [90, 90, 90, 90, 10, 10],
      [90, 90, 90, 90, 10, 10],
      [90, 90, 10, 10, 10, 10],
      [90, 90, 10, 10, 10, 10],
      [10, 10, 10, 10, 10, 10],
      [10, 10, 10, 10, 10, 10]
    ]
  }
];

export interface ConvolutionStepBreakdown {
  outRow: number;
  outCol: number;
  inRowStart: number;
  inColStart: number;
  terms: Array<{
    inputVal: number;
    kernelVal: number;
    product: number;
  }>;
  sum: number;
  bias: number;
  preActivation: number;
  postActivation: number; // ReLU
}

export function padMatrix(input: Matrix2D, padSize: number): Matrix2D {
  if (padSize <= 0) return input.map(r => [...r]);
  const rows = input.length;
  const cols = input[0].length;
  const newRows = rows + 2 * padSize;
  const newCols = cols + 2 * padSize;

  const padded: Matrix2D = Array.from({ length: newRows }, () => Array(newCols).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      padded[r + padSize][c + padSize] = input[r][c];
    }
  }
  return padded;
}

export interface ConvolutionResult {
  output: Matrix2D;
  paddedInput: Matrix2D;
  outHeight: number;
  outWidth: number;
  steps: ConvolutionStepBreakdown[];
}

export function computeConvolution2D(
  input: Matrix2D,
  kernel: Matrix2D,
  padding: number = 0,
  stride: number = 1,
  bias: number = 0,
  activation: 'relu' | 'none' = 'relu'
): ConvolutionResult {
  const paddedInput = padMatrix(input, padding);
  const inHeight = paddedInput.length;
  const inWidth = paddedInput[0].length;
  const kHeight = kernel.length;
  const kWidth = kernel[0].length;

  const outHeight = Math.floor((inHeight - kHeight) / stride) + 1;
  const outWidth = Math.floor((inWidth - kWidth) / stride) + 1;

  const output: Matrix2D = Array.from({ length: outHeight }, () => Array(outWidth).fill(0));
  const steps: ConvolutionStepBreakdown[] = [];

  for (let outR = 0; outR < outHeight; outR++) {
    for (let outC = 0; outC < outWidth; outC++) {
      const inRStart = outR * stride;
      const inCStart = outC * stride;

      let sum = 0;
      const terms: ConvolutionStepBreakdown['terms'] = [];

      for (let kr = 0; kr < kHeight; kr++) {
        for (let kc = 0; kc < kWidth; kc++) {
          const inVal = paddedInput[inRStart + kr][inCStart + kc];
          const kVal = kernel[kr][kc];
          const prod = inVal * kVal;
          terms.push({ inputVal: inVal, kernelVal: kVal, product: prod });
          sum += prod;
        }
      }

      const preAct = sum + bias;
      const postAct = activation === 'relu' ? Math.max(0, preAct) : preAct;
      output[outR][outC] = Math.round(postAct * 100) / 100;

      steps.push({
        outRow: outR,
        outCol: outC,
        inRowStart: inRStart,
        inColStart: inCStart,
        terms,
        sum: Math.round(sum * 100) / 100,
        bias,
        preActivation: Math.round(preAct * 100) / 100,
        postActivation: Math.round(postAct * 100) / 100
      });
    }
  }

  return {
    output,
    paddedInput,
    outHeight,
    outWidth,
    steps
  };
}
