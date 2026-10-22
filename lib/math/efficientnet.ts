/**
 * Mathematics for EfficientNet & Compound Model Scaling
 * - Compound Scaling: Depth (alpha^phi), Width (beta^phi), Resolution (gamma^phi)
 * - Standard vs. Depthwise Separable Convolution efficiency analysis
 * - MBConv (Mobile Inverted Bottleneck) & Squeeze-and-Excitation (SE) channel attention
 */

export interface EfficientNetVariant {
  name: string;
  phi: number;
  depthScale: number;
  widthScale: number;
  resolution: number;
  paramsMillion: number;
  gflops: number;
  top1Accuracy: number;
}

export interface SeparableConvComparison {
  kernelSize: number;
  inChannels: number;
  outChannels: number;
  height: number;
  width: number;
  standardParams: number;
  standardFlops: number;
  separableParams: number;
  separableFlops: number;
  paramReductionPercent: number;
  flopReductionPercent: number;
  theoreticalRatio: number;
}

export interface SqueezeExcitationResult {
  expandedChannels: number;
  reducedChannels: number;
  globalAvgPool: number[];
  squeezeWeights: number[];
  excitationScale: number[];
}

// Baseline scaling constants from Tan & Le (2019)
export const ALPHA = 1.2;  // Depth factor
export const BETA = 1.1;   // Width factor
export const GAMMA = 1.15; // Resolution factor

/**
 * Standard EfficientNet model family profiles (B0 - B7)
 */
export const EFFICIENTNET_MODELS: EfficientNetVariant[] = [
  { name: 'EfficientNet-B0', phi: 0, depthScale: 1.0, widthScale: 1.0, resolution: 224, paramsMillion: 5.3, gflops: 0.39, top1Accuracy: 77.1 },
  { name: 'EfficientNet-B1', phi: 1, depthScale: 1.2, widthScale: 1.1, resolution: 240, paramsMillion: 7.8, gflops: 0.70, top1Accuracy: 79.1 },
  { name: 'EfficientNet-B2', phi: 2, depthScale: 1.4, widthScale: 1.2, resolution: 260, paramsMillion: 9.2, gflops: 1.0, top1Accuracy: 80.1 },
  { name: 'EfficientNet-B3', phi: 3, depthScale: 1.7, widthScale: 1.3, resolution: 300, paramsMillion: 12.0, gflops: 1.8, top1Accuracy: 81.6 },
  { name: 'EfficientNet-B4', phi: 4, depthScale: 2.1, widthScale: 1.5, resolution: 380, paramsMillion: 19.0, gflops: 4.2, top1Accuracy: 82.9 },
  { name: 'EfficientNet-B5', phi: 5, depthScale: 2.5, widthScale: 1.6, resolution: 456, paramsMillion: 30.0, gflops: 9.9, top1Accuracy: 83.6 },
  { name: 'EfficientNet-B6', phi: 6, depthScale: 3.0, widthScale: 1.8, resolution: 528, paramsMillion: 43.0, gflops: 19.0, top1Accuracy: 84.0 },
  { name: 'EfficientNet-B7', phi: 7, depthScale: 3.6, widthScale: 2.0, resolution: 600, paramsMillion: 66.0, gflops: 37.0, top1Accuracy: 84.3 },
];

/**
 * Calculates compound scaling dimensions for any arbitrary user phi
 */
export function computeCompoundScaling(
  phi: number,
  baseResolution: number = 224,
  baseParams: number = 5.3,
  baseGflops: number = 0.39
): EfficientNetVariant {
  const depthScale = Math.pow(ALPHA, phi);
  const widthScale = Math.pow(BETA, phi);
  const resolutionScale = Math.pow(GAMMA, phi);

  const resolution = Math.round(baseResolution * resolutionScale);
  const paramsMillion = baseParams * Math.pow(ALPHA, phi) * Math.pow(BETA, 2 * phi);
  const gflops = baseGflops * Math.pow(2, phi);

  // Empirical accuracy projection based on ImageNet curve
  const top1Accuracy = Math.min(84.5, 77.1 + 1.2 * Math.log2(1 + phi));

  return {
    name: `Custom (φ = ${phi.toFixed(1)})`,
    phi,
    depthScale: Number(depthScale.toFixed(2)),
    widthScale: Number(widthScale.toFixed(2)),
    resolution,
    paramsMillion: Number(paramsMillion.toFixed(1)),
    gflops: Number(gflops.toFixed(2)),
    top1Accuracy: Number(top1Accuracy.toFixed(1))
  };
}

/**
 * Compares standard 2D convolution against Depthwise Separable convolution
 */
export function compareSeparableConvolution(
  inChannels: number = 64,
  outChannels: number = 128,
  kernelSize: number = 3,
  height: number = 28,
  width: number = 28
): SeparableConvComparison {
  // Standard Conv: K * K * Cin * Cout
  const standardParams = kernelSize * kernelSize * inChannels * outChannels;
  const standardFlops = standardParams * height * width;

  // Depthwise Separable Conv:
  // 1. Depthwise: K * K * Cin
  // 2. Pointwise: 1 * 1 * Cin * Cout
  const depthwiseParams = kernelSize * kernelSize * inChannels;
  const pointwiseParams = 1 * 1 * inChannels * outChannels;
  const separableParams = depthwiseParams + pointwiseParams;
  const separableFlops = separableParams * height * width;

  const paramReductionPercent = ((standardParams - separableParams) / standardParams) * 100;
  const flopReductionPercent = ((standardFlops - separableFlops) / standardFlops) * 100;

  // Theoretical ratio: 1/Cout + 1/K^2
  const theoreticalRatio = (1 / outChannels) + (1 / (kernelSize * kernelSize));

  return {
    kernelSize,
    inChannels,
    outChannels,
    height,
    width,
    standardParams,
    standardFlops,
    separableParams,
    separableFlops,
    paramReductionPercent,
    flopReductionPercent,
    theoreticalRatio
  };
}

/**
 * Computes Squeeze-and-Excitation channel gating factors
 * Inputs: sample average activations across expanded channels
 */
export function computeSqueezeExcitation(
  sampleChannelActivations: number[],
  reductionRatio: number = 4
): SqueezeExcitationResult {
  const expandedChannels = sampleChannelActivations.length;
  const reducedChannels = Math.max(1, Math.floor(expandedChannels / reductionRatio));

  // 1. Squeeze: Global Average Pooling (using input sample mean per channel)
  const globalAvgPool = [...sampleChannelActivations];

  // 2. Linear projection down + ReLU
  const squeezeWeights: number[] = [];
  for (let r = 0; r < reducedChannels; r++) {
    // Deterministic simulation weights
    let sum = 0;
    for (let c = 0; c < expandedChannels; c++) {
      const weight = Math.cos((c + 1) * (r + 1)) * 0.2;
      sum += globalAvgPool[c] * weight;
    }
    squeezeWeights.push(Math.max(0, sum + 0.1)); // ReLU
  }

  // 3. Excitation: Linear projection back up + Sigmoid
  const excitationScale: number[] = [];
  for (let c = 0; c < expandedChannels; c++) {
    let sum = 0;
    for (let r = 0; r < reducedChannels; r++) {
      const weight = Math.sin((c + 1) * (r + 1)) * 0.3;
      sum += squeezeWeights[r] * weight;
    }
    // Sigmoid: 1 / (1 + exp(-sum))
    const sig = 1 / (1 + Math.exp(-sum));
    excitationScale.push(Number(sig.toFixed(3)));
  }

  return {
    expandedChannels,
    reducedChannels,
    globalAvgPool,
    squeezeWeights,
    excitationScale
  };
}
