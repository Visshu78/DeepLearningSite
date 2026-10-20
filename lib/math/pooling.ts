import { Matrix2D } from './convolution';

export type PoolingType = 'max' | 'average';

export interface PoolingStepBreakdown {
  outRow: number;
  outCol: number;
  inRowStart: number;
  inColStart: number;
  windowSize: number;
  windowValues: number[];
  result: number;
}

export interface PoolingResult {
  output: Matrix2D;
  outHeight: number;
  outWidth: number;
  steps: PoolingStepBreakdown[];
}

export function computePooling2D(
  input: Matrix2D,
  poolSize: number = 2,
  stride: number = 2,
  type: PoolingType = 'max'
): PoolingResult {
  const inHeight = input.length;
  const inWidth = input[0].length;

  const outHeight = Math.floor((inHeight - poolSize) / stride) + 1;
  const outWidth = Math.floor((inWidth - poolSize) / stride) + 1;

  const output: Matrix2D = Array.from({ length: outHeight }, () => Array(outWidth).fill(0));
  const steps: PoolingStepBreakdown[] = [];

  for (let outR = 0; outR < outHeight; outR++) {
    for (let outC = 0; outC < outWidth; outC++) {
      const inRStart = outR * stride;
      const inCStart = outC * stride;

      const windowValues: number[] = [];

      for (let pr = 0; pr < poolSize; pr++) {
        for (let pc = 0; pc < poolSize; pc++) {
          windowValues.push(input[inRStart + pr][inCStart + pc]);
        }
      }

      let resVal = 0;
      if (type === 'max') {
        resVal = Math.max(...windowValues);
      } else {
        const sum = windowValues.reduce((acc, v) => acc + v, 0);
        resVal = Math.round((sum / windowValues.length) * 100) / 100;
      }

      output[outR][outC] = resVal;

      steps.push({
        outRow: outR,
        outCol: outC,
        inRowStart: inRStart,
        inColStart: inCStart,
        windowSize: poolSize,
        windowValues,
        result: resVal
      });
    }
  }

  return {
    output,
    outHeight,
    outWidth,
    steps
  };
}

export interface LayerSpec {
  name: string;
  kernelSize: number;
  stride: number;
}

export interface ReceptiveFieldStep {
  layerIndex: number;
  layerName: string;
  kernelSize: number;
  stride: number;
  cumulativeStride: number;
  receptiveField: number;
}

/**
 * Calculates receptive field growth across stacked convolution and pooling layers:
 * RF_{l} = RF_{l-1} + (k_l - 1) * S_{cumulative, l-1}
 * S_{cumulative, l} = S_{cumulative, l-1} * s_l
 */
export function calculateReceptiveFieldHierarchy(layers: LayerSpec[]): ReceptiveFieldStep[] {
  let rf = 1;
  let cumStride = 1;
  const result: ReceptiveFieldStep[] = [];

  layers.forEach((layer, idx) => {
    rf = rf + (layer.kernelSize - 1) * cumStride;
    result.push({
      layerIndex: idx + 1,
      layerName: layer.name,
      kernelSize: layer.kernelSize,
      stride: layer.stride,
      cumulativeStride: cumStride,
      receptiveField: rf
    });
    cumStride = cumStride * layer.stride;
  });

  return result;
}
