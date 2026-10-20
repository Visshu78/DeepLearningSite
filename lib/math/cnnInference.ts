import { Matrix2D } from './convolution';

export interface DigitPreset {
  id: string;
  label: string;
  description: string;
  grid: Matrix2D;
}

// 8x8 normalized grayscale pixel grids (0 to 1) for representative digits
export const DIGIT_PRESETS: DigitPreset[] = [
  {
    id: 'digit-0',
    label: 'Digit "0"',
    description: 'Enclosed loop with hollow center and strong outer boundaries.',
    grid: [
      [0.0, 0.2, 0.9, 0.9, 0.9, 0.2, 0.0, 0.0],
      [0.0, 0.9, 0.9, 0.1, 0.9, 0.9, 0.0, 0.0],
      [0.9, 0.9, 0.0, 0.0, 0.0, 0.9, 0.9, 0.0],
      [0.9, 0.9, 0.0, 0.0, 0.0, 0.9, 0.9, 0.0],
      [0.9, 0.9, 0.0, 0.0, 0.0, 0.9, 0.9, 0.0],
      [0.9, 0.9, 0.0, 0.0, 0.0, 0.9, 0.9, 0.0],
      [0.0, 0.9, 0.9, 0.1, 0.9, 0.9, 0.0, 0.0],
      [0.0, 0.2, 0.9, 0.9, 0.9, 0.2, 0.0, 0.0]
    ]
  },
  {
    id: 'digit-1',
    label: 'Digit "1"',
    description: 'Clean vertical central column with minimal horizontal features.',
    grid: [
      [0.0, 0.0, 0.2, 0.9, 0.9, 0.0, 0.0, 0.0],
      [0.0, 0.2, 0.9, 0.9, 0.9, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.1, 0.9, 0.9, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.9, 0.9, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.9, 0.9, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.9, 0.9, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.9, 0.9, 0.0, 0.0, 0.0],
      [0.0, 0.2, 0.9, 0.9, 0.9, 0.9, 0.2, 0.0]
    ]
  },
  {
    id: 'digit-4',
    label: 'Digit "4"',
    description: 'Intersecting vertical stroke and central crossbar.',
    grid: [
      [0.0, 0.0, 0.9, 0.1, 0.9, 0.9, 0.0, 0.0],
      [0.0, 0.9, 0.9, 0.1, 0.9, 0.9, 0.0, 0.0],
      [0.9, 0.9, 0.1, 0.1, 0.9, 0.9, 0.0, 0.0],
      [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.0],
      [0.0, 0.0, 0.0, 0.0, 0.9, 0.9, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.0, 0.9, 0.9, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.0, 0.9, 0.9, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.0, 0.9, 0.9, 0.0, 0.0]
    ]
  },
  {
    id: 'digit-7',
    label: 'Digit "7"',
    description: 'Strong top horizontal bar leading into a downward right stem.',
    grid: [
      [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.0],
      [0.0, 0.0, 0.0, 0.0, 0.2, 0.9, 0.9, 0.0],
      [0.0, 0.0, 0.0, 0.1, 0.9, 0.9, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.9, 0.9, 0.1, 0.0, 0.0],
      [0.0, 0.0, 0.9, 0.9, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.1, 0.9, 0.9, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.9, 0.9, 0.0, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.9, 0.9, 0.0, 0.0, 0.0, 0.0, 0.0]
    ]
  }
];

export interface ConvFilterSpec {
  id: string;
  name: string;
  description: string;
  kernel: Matrix2D;
  bias: number;
}

export const INFERENCE_FILTERS: ConvFilterSpec[] = [
  {
    id: 'vertical-edges',
    name: 'Vertical Edge Detector',
    description: 'Activates strongly on vertical column transitions (typical of 1, 4, 7 stems).',
    kernel: [
      [-1.0, 0.0, 1.0],
      [-1.5, 0.0, 1.5],
      [-1.0, 0.0, 1.0]
    ],
    bias: 0.1
  },
  {
    id: 'horizontal-edges',
    name: 'Horizontal Bar Detector',
    description: 'Activates on horizontal strokes (such as the top bar of 7 or crossbar of 4).',
    kernel: [
      [ 1.0,  1.5,  1.0],
      [ 0.0,  0.0,  0.0],
      [-1.0, -1.5, -1.0]
    ],
    bias: 0.1
  },
  {
    id: 'loop-center',
    name: 'Enclosed Loop Detector',
    description: 'Detects hollow centers surrounded by intense perimeter pixels (characteristic of 0).',
    kernel: [
      [ 0.8,  1.0,  0.8],
      [ 1.0, -2.5,  1.0],
      [ 0.8,  1.0,  0.8]
    ],
    bias: -0.2
  }
];

export interface CNNPipelineResult {
  inputGrid: Matrix2D;
  // Stage 1: Conv2D Feature Maps (3 channels, 6x6 each)
  convFeatureMaps: Array<{
    filter: ConvFilterSpec;
    map: Matrix2D;
  }>;
  // Stage 2: ReLU Feature Maps (3 channels, 6x6 each)
  reluFeatureMaps: Matrix2D[];
  // Stage 3: Max Pooling (3 channels, 3x3 each)
  pooledFeatureMaps: Matrix2D[];
  // Stage 4: Flattened Feature Vector (length 27)
  flattenedVector: number[];
  // Stage 5: Dense / Fully-Connected Logits (4 classes: 0, 1, 4, 7)
  logits: Array<{ classLabel: string; logit: number }>;
  // Stage 6: Softmax Probabilities
  probabilities: Array<{ classLabel: string; probability: number }>;
  predictedClass: string;
  confidencePercent: number;
}

/**
 * Pre-calibrated weights for Dense layer mapping 27 pooled spatial features
 * to 4 classes ['0', '1', '4', '7'].
 * High positive weights correspond to expected spatial activation motifs.
 */
// Normalized prototype feature weights for classes 0, 1, 4, 7
const PROTOTYPES: Record<string, number[]> = {
  '0': [1.45,3.15,1.45,0,3.25,3.25,1.45,3.15,1.45,1.65,3.25,0.1,0.1,0.1,0.1,1.15,0,2.15,3.12,3.69,2.48,2.14,2.14,1.69,3.12,3.69,2.48],
  '1': [3.05,2.2,0.1,3.25,3.25,0.1,3.25,3.25,0.1,1.65,1,0.1,0.25,0.2,0.1,0.1,0.1,0.1,2.95,2.83,2.14,2.24,1.77,2.14,3.2,2.41,3.2],
  '4': [1.55,2.9,0,0.1,2.35,0,0.1,3.25,0,0.4,0.9,0.1,3.25,2.35,1.45,0.1,0.1,0.1,4.59,4.43,3.04,2.14,3.76,3.04,0,2.14,2.14],
  '7': [1.15,2.55,0.25,3.15,1.45,0,3.25,0,0.1,3.25,2.2,2.25,0,1.55,2.35,0.2,1.45,0.1,2.22,4.24,2.61,2.4,3.12,2.07,2.79,3.04,0]
};

function computeDenseLogits(features: number[]): Record<string, number> {
  let inNorm = 0;
  for (let i = 0; i < features.length; i++) {
    inNorm += features[i] * features[i];
  }
  const inMag = Math.sqrt(inNorm) || 1e-6;

  const logits: Record<string, number> = {};
  const scale = 14.0; // Softmax temperature scale

  (['0', '1', '4', '7'] as const).forEach(c => {
    const proto = PROTOTYPES[c];
    let dot = 0;
    let protoNorm = 0;
    for (let i = 0; i < features.length; i++) {
      dot += features[i] * proto[i];
      protoNorm += proto[i] * proto[i];
    }
    const protoMag = Math.sqrt(protoNorm) || 1e-6;
    const cosSim = dot / (inMag * protoMag);
    logits[c] = (cosSim - 0.75) * scale;
  });

  return logits;
}

export function runCNNInferencePipeline(input: Matrix2D): CNNPipelineResult {
  const inH = input.length;
  const inW = input[0].length;
  const kSize = 3;

  // 1. Convolution Stage
  const convFeatureMaps: CNNPipelineResult['convFeatureMaps'] = [];
  const reluFeatureMaps: Matrix2D[] = [];
  const pooledFeatureMaps: Matrix2D[] = [];

  INFERENCE_FILTERS.forEach(filt => {
    const outH = inH - kSize + 1; // 6
    const outW = inW - kSize + 1; // 6
    const convMap: Matrix2D = Array.from({ length: outH }, () => Array(outW).fill(0));
    const reluMap: Matrix2D = Array.from({ length: outH }, () => Array(outW).fill(0));

    for (let r = 0; r < outH; r++) {
      for (let c = 0; c < outW; c++) {
        let sum = filt.bias;
        for (let kr = 0; kr < kSize; kr++) {
          for (let kc = 0; kc < kSize; kc++) {
            sum += input[r + kr][c + kc] * filt.kernel[kr][kc];
          }
        }
        convMap[r][c] = Math.round(sum * 100) / 100;
        reluMap[r][c] = Math.round(Math.max(0, sum) * 100) / 100;
      }
    }

    convFeatureMaps.push({ filter: filt, map: convMap });
    reluFeatureMaps.push(reluMap);

    // 2. Max Pooling (2x2, stride 2 -> 3x3)
    const poolH = Math.floor(outH / 2); // 3
    const poolW = Math.floor(outW / 2); // 3
    const pMap: Matrix2D = Array.from({ length: poolH }, () => Array(poolW).fill(0));

    for (let pr = 0; pr < poolH; pr++) {
      for (let pc = 0; pc < poolW; pc++) {
        const rStart = pr * 2;
        const cStart = pc * 2;
        const maxVal = Math.max(
          reluMap[rStart][cStart],
          reluMap[rStart][cStart + 1],
          reluMap[rStart + 1][cStart],
          reluMap[rStart + 1][cStart + 1]
        );
        pMap[pr][pc] = Math.round(maxVal * 100) / 100;
      }
    }
    pooledFeatureMaps.push(pMap);
  });

  // 3. Flattening
  const flattenedVector: number[] = [];
  pooledFeatureMaps.forEach(pMap => {
    for (let r = 0; r < pMap.length; r++) {
      for (let c = 0; c < pMap[0].length; c++) {
        flattenedVector.push(pMap[r][c]);
      }
    }
  });

  // 4. Dense Logits
  const rawLogits = computeDenseLogits(flattenedVector);
  const classes = ['0', '1', '4', '7'];
  const logits = classes.map(c => ({
    classLabel: c,
    logit: Math.round(rawLogits[c] * 1000) / 1000
  }));

  // 5. Softmax Probabilities: P_c = e^{z_c} / sum(e^{z_k})
  const maxLogit = Math.max(...logits.map(l => l.logit));
  const expVals = logits.map(l => Math.exp(l.logit - maxLogit)); // Numerical stability
  const sumExp = expVals.reduce((acc, v) => acc + v, 0);

  const probabilities = classes.map((c, i) => ({
    classLabel: c,
    probability: Math.round((expVals[i] / sumExp) * 1000) / 1000
  }));

  // Prediction
  let bestClass = classes[0];
  let bestProb = -1;
  probabilities.forEach(p => {
    if (p.probability > bestProb) {
      bestProb = p.probability;
      bestClass = p.classLabel;
    }
  });

  return {
    inputGrid: input,
    convFeatureMaps,
    reluFeatureMaps,
    pooledFeatureMaps,
    flattenedVector,
    logits,
    probabilities,
    predictedClass: bestClass,
    confidencePercent: Math.round(bestProb * 1000) / 10
  };
}

export interface ConvCellTrace {
  filter: ConvFilterSpec;
  row: number;
  col: number;
  inputPatch: Matrix2D;
  kernel: Matrix2D;
  products: Matrix2D;
  productSum: number;
  bias: number;
  preActivation: number;
  reluOutput: number;
}

export function getConvCellTrace(
  input: Matrix2D,
  filterIndex: number,
  r: number,
  c: number
): ConvCellTrace {
  const filter = INFERENCE_FILTERS[filterIndex] || INFERENCE_FILTERS[0];
  const kSize = 3;
  const inputPatch: Matrix2D = [];
  const products: Matrix2D = [];
  let productSum = 0;

  for (let kr = 0; kr < kSize; kr++) {
    const patchRow: number[] = [];
    const prodRow: number[] = [];
    for (let kc = 0; kc < kSize; kc++) {
      const inVal = input[r + kr]?.[c + kc] ?? 0;
      const kVal = filter.kernel[kr][kc];
      const prod = Math.round(inVal * kVal * 100) / 100;
      patchRow.push(inVal);
      prodRow.push(prod);
      productSum += inVal * kVal;
    }
    inputPatch.push(patchRow);
    products.push(prodRow);
  }

  const preActivation = Math.round((productSum + filter.bias) * 100) / 100;
  const reluOutput = Math.max(0, preActivation);

  return {
    filter,
    row: r,
    col: c,
    inputPatch,
    kernel: filter.kernel,
    products,
    productSum: Math.round(productSum * 100) / 100,
    bias: filter.bias,
    preActivation,
    reluOutput
  };
}

export interface PoolCellTrace {
  poolRow: number;
  poolCol: number;
  rStart: number;
  cStart: number;
  poolQuad: Matrix2D;
  maxVal: number;
  maxCoordOffset: [number, number];
}

export function getPoolCellTrace(reluMap: Matrix2D, pr: number, pc: number): PoolCellTrace {
  const rStart = pr * 2;
  const cStart = pc * 2;
  const quad: Matrix2D = [
    [reluMap[rStart]?.[cStart] ?? 0, reluMap[rStart]?.[cStart + 1] ?? 0],
    [reluMap[rStart + 1]?.[cStart] ?? 0, reluMap[rStart + 1]?.[cStart + 1] ?? 0]
  ];

  let maxVal = -Infinity;
  let maxOffset: [number, number] = [0, 0];

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      if (quad[r][c] > maxVal) {
        maxVal = quad[r][c];
        maxOffset = [r, c];
      }
    }
  }

  return {
    poolRow: pr,
    poolCol: pc,
    rStart,
    cStart,
    poolQuad: quad,
    maxVal,
    maxCoordOffset: maxOffset
  };
}

export interface FeatureProvenance {
  index: number;
  filterIndex: number;
  filterName: string;
  poolRow: number;
  poolCol: number;
  featureValue: number;
}

export function getFeatureProvenance(
  flattenedVector: number[],
  index: number
): FeatureProvenance {
  const clampedIndex = Math.max(0, Math.min(flattenedVector.length - 1, index));
  const filterIndex = Math.floor(clampedIndex / 9);
  const rem = clampedIndex % 9;
  const poolRow = Math.floor(rem / 3);
  const poolCol = rem % 3;

  return {
    index: clampedIndex,
    filterIndex,
    filterName: INFERENCE_FILTERS[filterIndex]?.name ?? `Filter ${filterIndex + 1}`,
    poolRow,
    poolCol,
    featureValue: flattenedVector[clampedIndex] ?? 0
  };
}
