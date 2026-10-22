/**
 * Mathematics for Residual Networks (ResNet) & Skip Connections
 * - The Degradation Problem & Vanishing Gradients
 * - Identity Mapping & The Gradient Highway
 * - Basic Residual Block vs. Bottleneck Block complexity
 */

export interface LayerGradientStep {
  layerIndex: number;
  plainGradientMagnitude: number;
  resnetGradientMagnitude: number;
  plainSignal: number;
  resnetSignal: number;
}

export interface BlockComplexityComparison {
  blockType: 'basic' | 'bottleneck';
  inputChannels: number;
  outputChannels: number;
  parameters: number;
  flops: number;
  description: string;
}

/**
 * Simulates gradient flow through a plain stacked feedforward network vs.
 * a ResNet architecture with identity skip connections across L layers.
 * 
 * In a plain network: dL/dx_l = dL/dx_{l+1} * W_l^T * phi'(z_l)
 * If average local factor is gamma < 1, gradient magnitude scales as gamma^(L - l).
 * 
 * In ResNet: dL/dx_l = dL/dx_{l+1} * (dF/dx_l + I) = dL/dx_{l+1} * dF/dx_l + dL/dx_{l+1}
 * The identity component '+ I' guarantees an additive gradient highway directly to early layers.
 */
export function simulateResNetGradientFlow(
  totalLayers: number = 20,
  averageLocalGradient: number = 0.75, // Local slope phi'(z)*w < 1
  initialLossGradient: number = 1.0
): LayerGradientStep[] {
  const steps: LayerGradientStep[] = [];

  let plainGrad = initialLossGradient;
  let resnetGrad = initialLossGradient;

  // Track backward from output layer (totalLayers) to input layer (1)
  for (let l = totalLayers; l >= 1; l--) {
    steps.push({
      layerIndex: l,
      plainGradientMagnitude: plainGrad,
      resnetGradientMagnitude: resnetGrad,
      plainSignal: Math.max(plainGrad, 1e-12),
      resnetSignal: resnetGrad
    });

    // Plain network: multiplicative compounding causes exponential decay
    plainGrad = plainGrad * averageLocalGradient;

    // ResNet network: additive skip connection maintains gradient highway
    // dL/dx_l = dL/dx_{l+1} * (localFactor + 1) normalized or stabilized
    // Even if localFactor -> 0 (dead residual), the skip connection preserves 100% of the gradient
    resnetGrad = resnetGrad * (0.15 * averageLocalGradient + 1.0);
    // In practice, Batch Normalization keeps variance bounded ~ 1.0
    resnetGrad = Math.min(Math.max(resnetGrad, 0.85), 1.25);
  }

  return steps.reverse(); // Return from layer 1 (input) to layer L (output)
}

/**
 * Evaluates a 1D scalar/vector forward residual mapping: H(x) = F(x) + x
 */
export function computeResidualBlock1D(
  x: number,
  w1: number = 0.5,
  w2: number = -0.4,
  b1: number = 0.1,
  b2: number = -0.05
): {
  x: number;
  z1: number;
  a1: number;
  z2: number;
  fx: number;
  hx: number;
  gradientHighwayFactor: number;
} {
  // First conv/dense: z1 = w1*x + b1, a1 = ReLU(z1)
  const z1 = w1 * x + b1;
  const a1 = Math.max(0, z1);

  // Second conv/dense: z2 = w2*a1 + b2, F(x) = z2
  const z2 = w2 * a1 + b2;
  const fx = z2;

  // Residual addition: H(x) = F(x) + x
  const hx = fx + x;

  // Local derivative dF/dx = w2 * (z1 > 0 ? 1 : 0) * w1
  const dF_dx = (z1 > 0 ? 1 : 0) * w1 * w2;

  // Total backward derivative dH/dx = dF/dx + 1 (the 1 is the gradient highway)
  const gradientHighwayFactor = dF_dx + 1.0;

  return {
    x,
    z1,
    a1,
    z2,
    fx,
    hx,
    gradientHighwayFactor
  };
}

/**
 * Calculates parameters and FLOPs for Basic Block vs. Bottleneck Block (e.g. ResNet-34 vs ResNet-50)
 */
export function compareResNetBlocks(
  channels: number = 64,
  featureMapSize: number = 56
): {
  basicBlock: BlockComplexityComparison;
  bottleneckBlock: BlockComplexityComparison;
  flavourSavingsPercent: number;
} {
  // Basic Block: Two 3x3 Conv layers with C channels
  // Params: 2 * (3 * 3 * C * C) + 2 * C (biases)
  const basicParams = 2 * (3 * 3 * channels * channels) + 2 * channels;
  const basicFlops = 2 * (3 * 3 * channels * channels * featureMapSize * featureMapSize);

  // Bottleneck Block:
  // 1x1 Conv (4C -> C): 1 * 1 * 4C * C
  // 3x3 Conv (C -> C):  3 * 3 * C * C
  // 1x1 Conv (C -> 4C): 1 * 1 * C * 4C
  // Total: 4C^2 + 9C^2 + 4C^2 = 17C^2, handling a 4C = 256 channel representation!
  const bottleneckInChannels = channels * 4;
  const bottleneckMidChannels = channels;
  const bottleneckOutChannels = channels * 4;

  const conv1Params = 1 * 1 * bottleneckInChannels * bottleneckMidChannels;
  const conv2Params = 3 * 3 * bottleneckMidChannels * bottleneckMidChannels;
  const conv3Params = 1 * 1 * bottleneckMidChannels * bottleneckOutChannels;
  const bottleneckParams = conv1Params + conv2Params + conv3Params;

  const bottleneckFlops = (conv1Params + conv2Params + conv3Params) * (featureMapSize * featureMapSize);

  // If we had used two 3x3 layers for the same 4C channels:
  const equivalentTwo3x3Params = 2 * (3 * 3 * bottleneckInChannels * bottleneckInChannels);

  const savings = ((equivalentTwo3x3Params - bottleneckParams) / equivalentTwo3x3Params) * 100;

  return {
    basicBlock: {
      blockType: 'basic',
      inputChannels: channels,
      outputChannels: channels,
      parameters: basicParams,
      flops: basicFlops,
      description: `Two 3×3 conv layers (Channels: ${channels} → ${channels})`
    },
    bottleneckBlock: {
      blockType: 'bottleneck',
      inputChannels: bottleneckInChannels,
      outputChannels: bottleneckOutChannels,
      parameters: bottleneckParams,
      flops: bottleneckFlops,
      description: `Bottleneck 1×1 (${bottleneckInChannels}→${bottleneckMidChannels}) → 3×3 (${bottleneckMidChannels}) → 1×1 (${bottleneckMidChannels}→${bottleneckOutChannels})`
    },
    flavourSavingsPercent: savings
  };
}
