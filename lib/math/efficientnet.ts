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

export interface MBConvBlockParams {
  inChannels: number;
  outChannels: number;
  expansionFactor: number; // typically 1 or 6
  kernelSize: number;      // 3 or 5
  stride: number;          // 1 or 2
  seReductionRatio: number;// typically 4 or 24
  inputHeight: number;
  inputWidth: number;
}

export interface ChannelAttentionProbe {
  channelIndex: number;
  gapValue: number;
  seWeight: number;
  recalibratedValue: number;
  state: 'amplified' | 'balanced' | 'attenuated';
}

export interface MBConvSimulationResult {
  expandedChannels: number;
  outputHeight: number;
  outputWidth: number;
  hasSkipConnection: boolean;
  expansionParams: number;
  depthwiseParams: number;
  seParams: number;
  projectionParams: number;
  totalBlockParams: number;
  totalBlockFlops: number;
  standardExpandedParams: number;
  standardExpandedFlops: number;
  expandedSavingsPercent: number;
  directConvParams: number;
  directConvFlops: number;
  channelProbes: ChannelAttentionProbe[];
}

export interface EfficientNetStage {
  stage: number;
  operator: string;
  kernelSize: number;
  stride: number;
  resolution: string;
  channels: number;
  numLayers: number;
  seRatio: number;
  description: string;
}

/**
 * Standard EfficientNet-B0 baseline macro-architecture stages
 * Source: Tan & Le (2019), Table 1
 */
export const EFFICIENTNET_B0_STAGES: EfficientNetStage[] = [
  { stage: 1, operator: 'Conv3x3', kernelSize: 3, stride: 2, resolution: '224x224', channels: 32, numLayers: 1, seRatio: 0, description: 'Stem standard convolution + BN + Swish' },
  { stage: 2, operator: 'MBConv1', kernelSize: 3, stride: 1, resolution: '112x112', channels: 16, numLayers: 1, seRatio: 4, description: 'Mobile inverted bottleneck, expansion t=1 with SE' },
  { stage: 3, operator: 'MBConv6', kernelSize: 3, stride: 2, resolution: '112x112', channels: 24, numLayers: 2, seRatio: 4, description: 'Expansion t=6, downsampling stride 2' },
  { stage: 4, operator: 'MBConv6', kernelSize: 5, stride: 2, resolution: '56x56', channels: 40, numLayers: 2, seRatio: 4, description: '5x5 spatial receptive field filter + SE' },
  { stage: 5, operator: 'MBConv6', kernelSize: 3, stride: 2, resolution: '28x28', channels: 80, numLayers: 3, seRatio: 4, description: 'Deep feature extraction across 3 repeated blocks' },
  { stage: 6, operator: 'MBConv6', kernelSize: 5, stride: 1, resolution: '14x14', channels: 112, numLayers: 3, seRatio: 4, description: 'High-level pattern representation at full resolution' },
  { stage: 7, operator: 'MBConv6', kernelSize: 5, stride: 2, resolution: '14x14', channels: 192, numLayers: 4, seRatio: 4, description: 'Coarse semantic abstraction before classification' },
  { stage: 8, operator: 'MBConv6', kernelSize: 3, stride: 1, resolution: '7x7', channels: 320, numLayers: 1, seRatio: 4, description: 'Top bottleneck representation' },
  { stage: 9, operator: 'Conv1x1 + GAP + FC', kernelSize: 1, stride: 1, resolution: '7x7', channels: 1280, numLayers: 1, seRatio: 0, description: 'Pointwise expansion to 1280, GAP, and 1000-class classifier' }
];

/**
 * Simulates an MBConv block with Squeeze-and-Excitation
 */
export function simulateMBConvBlock(params: MBConvBlockParams): MBConvSimulationResult {
  const {
    inChannels,
    outChannels,
    expansionFactor,
    kernelSize,
    stride,
    seReductionRatio,
    inputHeight,
    inputWidth
  } = params;

  const expandedChannels = inChannels * expansionFactor;
  const outputHeight = Math.floor(inputHeight / stride);
  const outputWidth = Math.floor(inputWidth / stride);

  // Identity skip connection exists only if stride == 1 and Cin == Cout
  const hasSkipConnection = (stride === 1 && inChannels === outChannels);

  // 1. Expansion 1x1 Conv (Cin -> expandedChannels)
  const expansionParams = expansionFactor > 1 ? inChannels * expandedChannels : 0;
  const expansionFlops = expansionParams * inputHeight * inputWidth;

  // 2. Depthwise Conv kxk on expanded channels
  const depthwiseParams = kernelSize * kernelSize * expandedChannels;
  const depthwiseFlops = depthwiseParams * outputHeight * outputWidth;

  // 3. Squeeze & Excitation (expandedChannels -> reduced -> expandedChannels)
  const seReduced = Math.max(1, Math.floor(expandedChannels / seReductionRatio));
  const seParams = (expandedChannels * seReduced) + (seReduced * expandedChannels);
  const seFlops = seParams; // GAP is 1x1 vector

  // 4. Pointwise Linear Projection (expandedChannels -> Cout)
  const projectionParams = expandedChannels * outChannels;
  const projectionFlops = projectionParams * outputHeight * outputWidth;

  const totalBlockParams = expansionParams + depthwiseParams + seParams + projectionParams;
  const totalBlockFlops = expansionFlops + depthwiseFlops + seFlops + projectionFlops;

  // Direct Standard Conv equivalent: kernelSize * kernelSize * inChannels * outChannels
  const directConvParams = kernelSize * kernelSize * inChannels * outChannels;
  const directConvFlops = directConvParams * outputHeight * outputWidth;

  // Standard Conv in the expanded manifold space (K x K x C_exp x C_exp)
  const standardExpandedParams = kernelSize * kernelSize * expandedChannels * expandedChannels;
  const standardExpandedFlops = standardExpandedParams * outputHeight * outputWidth;

  const expandedSavingsPercent = standardExpandedParams > 0
    ? Math.max(0, ((standardExpandedParams - totalBlockParams) / standardExpandedParams) * 100)
    : 0;

  // Synthetic channel activations for visual attention probing
  const baseSignals = [0.85, 0.22, 1.45, 0.38, 1.10, 0.15, 0.92, 0.60];
  const seOutput = computeSqueezeExcitation(baseSignals, seReductionRatio);

  const channelProbes: ChannelAttentionProbe[] = baseSignals.map((sig, i) => {
    const seWeight = seOutput.excitationScale[i] ?? 0.5;
    const recalibratedValue = Number((sig * seWeight).toFixed(3));
    let state: 'amplified' | 'balanced' | 'attenuated' = 'balanced';
    if (seWeight >= 0.70) state = 'amplified';
    else if (seWeight <= 0.35) state = 'attenuated';

    return {
      channelIndex: i + 1,
      gapValue: sig,
      seWeight,
      recalibratedValue,
      state
    };
  });

  return {
    expandedChannels,
    outputHeight,
    outputWidth,
    hasSkipConnection,
    expansionParams,
    depthwiseParams,
    seParams,
    projectionParams,
    totalBlockParams,
    totalBlockFlops,
    standardExpandedParams,
    standardExpandedFlops,
    expandedSavingsPercent: Number(expandedSavingsPercent.toFixed(1)),
    directConvParams,
    directConvFlops,
    channelProbes
  };
}
