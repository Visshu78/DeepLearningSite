/**
 * Pure analytical mathematical engine for the remaining lessons across
 * Track 2 (2.7), Track 4 (4.5, 4.8, 4.9, 4.10), and Track 6 (6.3, 6.4, 6.5):
 * - 2.7 Universal Approximation (Piecewise Linear ReLU Hinges & Depth Regions)
 * - 4.5 From LeNet to VGG (Stacked 3x3 vs 5x5/7x7 Receptive Field & Parameters)
 * - 4.8 Transfer Learning (Frozen Backbone vs Trainable Head Budgets)
 * - 4.9 Object Detection YOLO (Intersection over Union IoU & Non-Maximum Suppression)
 * - 4.10 Image Segmentation U-Net (Soft Dice Coefficient & Analytical Gradient)
 * - 6.3 Positional Encoding (Sinusoidal Frequencies & RoPE Relative Dot Product)
 * - 6.4 BERT vs GPT (Bidirectional vs Causal Masking Attention Weights)
 * - 6.5 Vision Transformer ViT (Patch Tokenization N = HW / P^2 & Sequence Length)
 *
 * Every equation and derivative is verified via automated unit tests.
 */

const EPS = 1e-12;

// ============================================================================
// LESSON 2.7: UNIVERSAL APPROXIMATION AND DEPTH (RELU HINGES & REGIONS)
// ============================================================================

export interface UniversalApproxResult {
  yApprox: number;
  dy_dx: number;
  activeHinges: number;
  shallowLinearRegions: number;
  deepLinearRegions: number;
}

/**
 * Evaluates a 1D ReLU hinge expansion:
 *   f(x) = sum_{i=1}^H v_i * max(0, w_i * x + b_i)
 * and compares theoretical 1D linear regions of a shallow network of width L*N
 * (1 + L*N regions) vs an L-layer deep network of width N ((N + 1)^L regions, Montufar 2014).
 */
export function computeUniversalApproxHinges(
  x: number,
  hinges: { v: number; w: number; b: number }[],
  widthPerLayer: number = 8,
  depthLayers: number = 4
): UniversalApproxResult {
  let yApprox = 0;
  let dy_dx = 0;
  let activeHinges = 0;

  for (const h of hinges) {
    const z = h.w * x + h.b;
    if (z > 0) {
      yApprox += h.v * z;
      dy_dx += h.v * h.w;
      activeHinges++;
    }
  }

  const shallowLinearRegions = 1 + widthPerLayer * depthLayers;
  const deepLinearRegions = Math.pow(widthPerLayer + 1, depthLayers);

  return {
    yApprox,
    dy_dx,
    activeHinges,
    shallowLinearRegions,
    deepLinearRegions,
  };
}

// ============================================================================
// LESSON 4.5: FROM LENET TO VGG (STACKED 3x3 VS SINGLE LARGE KERNEL)
// ============================================================================

export interface VggStackResult {
  effectiveReceptiveField: number;
  stacked3x3Params: number;
  singleLargeKernelParams: number;
  paramSavingsPercent: number;
  numNonlinearities: number;
}

/**
 * Compares N_stack stacked 3x3 convolutional layers (each with C channels)
 * against a single K_eq x K_eq layer of the same effective receptive field:
 *   RF = 1 + 2 * N_stack
 *   Params(stacked 3x3) = N_stack * (3 * 3 * C * C) = 9 * N_stack * C^2
 *   Params(single RFxRF) = RF^2 * C^2
 */
export function computeVggKernelComparison(
  numStacked3x3: number,
  channels: number
): VggStackResult {
  const n = Math.max(1, Math.round(numStacked3x3));
  const c = Math.max(1, channels);
  const effectiveReceptiveField = 1 + 2 * n;
  const stacked3x3Params = n * 9 * c * c;
  const singleLargeKernelParams =
    effectiveReceptiveField * effectiveReceptiveField * c * c;
  const paramSavingsPercent =
    singleLargeKernelParams > 0
      ? ((singleLargeKernelParams - stacked3x3Params) /
          singleLargeKernelParams) *
        100
      : 0;

  return {
    effectiveReceptiveField,
    stacked3x3Params,
    singleLargeKernelParams,
    paramSavingsPercent,
    numNonlinearities: n,
  };
}

// ============================================================================
// LESSON 4.8: TRANSFER LEARNING (BACKBONE FREEZING & DIFFERENTIAL LR)
// ============================================================================

export interface TransferLearningResult {
  headParams: number;
  unfrozenBackboneParams: number;
  totalTrainableParams: number;
  trainablePercent: number;
  effectiveBackboneStep: number;
  effectiveHeadStep: number;
}

/**
 * Computes trainable parameter budget and differential learning rate step sizes
 * when replacing a classification head (dFeat x numClasses) and unfreezing
 * k top blocks out of 4 backbone stages.
 */
export function computeTransferLearningBudget(
  backboneTotalParams: number,
  featureDim: number,
  numClasses: number,
  unfrozenStages: number,
  headLr: number = 1e-3,
  backboneLrMultiplier: number = 0.1
): TransferLearningResult {
  const headParams = featureDim * numClasses + numClasses;
  const clampedStages = Math.max(0, Math.min(4, unfrozenStages));
  const unfrozenBackboneParams = Math.round(
    backboneTotalParams * (clampedStages / 4)
  );
  const totalTrainableParams = headParams + unfrozenBackboneParams;
  const totalModelParams = backboneTotalParams + headParams;
  const trainablePercent =
    totalModelParams > 0 ? (totalTrainableParams / totalModelParams) * 100 : 0;

  return {
    headParams,
    unfrozenBackboneParams,
    totalTrainableParams,
    trainablePercent,
    effectiveHeadStep: headLr,
    effectiveBackboneStep:
      clampedStages > 0 ? headLr * backboneLrMultiplier : 0,
  };
}

// ============================================================================
// LESSON 4.9: OBJECT DETECTION (YOLO, BOUNDING BOX IoU & NMS)
// ============================================================================

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface YoloIouNmsResult {
  intersectionArea: number;
  unionArea: number;
  iou: number;
  suppressedByNms: boolean;
}

/**
 * Computes exact 2D Bounding Box Intersection over Union (IoU) and
 * Non-Maximum Suppression (NMS) decision against threshold tau_nms.
 */
export function computeYoloIouAndNms(
  boxA: BoundingBox,
  boxB: BoundingBox,
  nmsThreshold: number = 0.5
): YoloIouNmsResult {
  const interX1 = Math.max(boxA.x1, boxB.x1);
  const interY1 = Math.max(boxA.y1, boxB.y1);
  const interX2 = Math.min(boxA.x2, boxB.x2);
  const interY2 = Math.min(boxA.y2, boxB.y2);

  const interW = Math.max(0, interX2 - interX1);
  const interH = Math.max(0, interY2 - interY1);
  const intersectionArea = interW * interH;

  const areaA = Math.max(0, boxA.x2 - boxA.x1) * Math.max(0, boxA.y2 - boxA.y1);
  const areaB = Math.max(0, boxB.x2 - boxB.x1) * Math.max(0, boxB.y2 - boxB.y1);
  const unionArea = areaA + areaB - intersectionArea;
  const iou = unionArea > EPS ? intersectionArea / unionArea : 0;

  return {
    intersectionArea,
    unionArea,
    iou,
    suppressedByNms: iou >= nmsThreshold,
  };
}

// ============================================================================
// LESSON 4.10: IMAGE SEGMENTATION (U-NET SOFT DICE LOSS & GRADIENT)
// ============================================================================

export interface UnetDiceResult {
  intersectionSum: number;
  denomSum: number;
  diceCoefficient: number;
  diceLoss: number;
  gradPreds: number[];
}

/**
 * Evaluates Soft Dice Coefficient and Dice Loss for pixel probabilities p_i in [0, 1]
 * and binary ground-truth mask g_i in {0, 1}:
 *   Dice(p, g) = (2 * sum p_i g_i + smooth) / (sum p_i + sum g_i + smooth)
 *   L_Dice = 1 - Dice(p, g)
 * Exact analytical derivative w.r.t p_k:
 *   d L_Dice / d p_k = -(2 * g_k * D - N) / D^2
 *   where N = 2 * sum p_i g_i + smooth, D = sum p_i + sum g_i + smooth.
 */
export function computeUnetDiceLossAndGrad(
  preds: number[],
  targets: number[],
  smooth: number = 1e-5
): UnetDiceResult {
  const len = Math.min(preds.length, targets.length);
  let inter = 0;
  let sumP = 0;
  let sumG = 0;

  for (let i = 0; i < len; i++) {
    inter += preds[i] * targets[i];
    sumP += preds[i];
    sumG += targets[i];
  }

  const N = 2 * inter + smooth;
  const D = sumP + sumG + smooth;
  const diceCoefficient = N / D;
  const diceLoss = 1 - diceCoefficient;

  const gradPreds: number[] = [];
  for (let k = 0; k < len; k++) {
    const gk = targets[k];
    const dDice_dpk = (2 * gk * D - N) / (D * D);
    gradPreds.push(-dDice_dpk);
  }

  return {
    intersectionSum: inter,
    denomSum: sumP + sumG,
    diceCoefficient,
    diceLoss,
    gradPreds,
  };
}

// ============================================================================
// LESSON 6.3: POSITIONAL ENCODING (SINUSOIDAL & ROTARY RoPE)
// ============================================================================

export interface PositionalEncodingResult {
  pePosA: [number, number, number, number];
  pePosB: [number, number, number, number];
  ropeRelativeDotProduct: number;
}

/**
 * Computes 4D Sinusoidal Positional Encoding at positions posA and posB,
 * and demonstrates Rotary Position Embedding (RoPE) relative-distance invariance:
 *   (R_{posA} q) . (R_{posB} k) depends solely on relative offset (posA - posB).
 */
export function computePositionalEncodingAndRope(
  posA: number,
  posB: number,
  qVec: [number, number] = [1.0, 0.5],
  kVec: [number, number] = [0.8, -0.2],
  thetaBase: number = 0.25
): PositionalEncodingResult {
  const w0 = 1.0;
  const w1 = 1 / Math.pow(10000, 2 / 4); // 1 / 100 = 0.01

  const pePosA: [number, number, number, number] = [
    Math.sin(posA * w0),
    Math.cos(posA * w0),
    Math.sin(posA * w1),
    Math.cos(posA * w1),
  ];
  const pePosB: [number, number, number, number] = [
    Math.sin(posB * w0),
    Math.cos(posB * w0),
    Math.sin(posB * w1),
    Math.cos(posB * w1),
  ];

  const rotate2D = (v: [number, number], angle: number): [number, number] => [
    v[0] * Math.cos(angle) - v[1] * Math.sin(angle),
    v[0] * Math.sin(angle) + v[1] * Math.cos(angle),
  ];

  const qRot = rotate2D(qVec, posA * thetaBase);
  const kRot = rotate2D(kVec, posB * thetaBase);
  const ropeRelativeDotProduct = qRot[0] * kRot[0] + qRot[1] * kRot[1];

  return {
    pePosA,
    pePosB,
    ropeRelativeDotProduct,
  };
}

// ============================================================================
// LESSON 6.4: BERT VS GPT (BIDIRECTIONAL VS CAUSAL MASKING)
// ============================================================================

export interface BertVsGptMaskResult {
  bertWeightsRow: number[];
  gptCausalWeightsRow: number[];
}

/**
 * Computes Softmax attention weights for query token at queryPos in {0..T-1}
 * over raw score row:
 * - BERT (Bidirectional): attends to all positions j in {0..T-1}
 * - GPT (Causal Decoder): masks j > queryPos with -Infinity so future weights are strictly 0.
 */
export function computeBertVsGptAttentionRow(
  rawScores: number[],
  queryPos: number
): BertVsGptMaskResult {
  const maxAll = Math.max(...rawScores, 0);
  const expsAll = rawScores.map(s => Math.exp(s - maxAll));
  const sumAll = expsAll.reduce((a, b) => a + b, 0) || 1;
  const bertWeightsRow = expsAll.map(e => e / sumAll);

  const visibleScores = rawScores.slice(0, queryPos + 1);
  const maxVis = Math.max(...visibleScores, 0);
  const expsCausal = rawScores.map((s, j) =>
    j <= queryPos ? Math.exp(s - maxVis) : 0
  );
  const sumCausal = expsCausal.reduce((a, b) => a + b, 0) || 1;
  const gptCausalWeightsRow = expsCausal.map(e => e / sumCausal);

  return {
    bertWeightsRow,
    gptCausalWeightsRow,
  };
}

// ============================================================================
// LESSON 6.5: VISION TRANSFORMER (ViT PATCHIFICATION & ATTENTION COMPLEXITY)
// ============================================================================

export interface VitPatchResult {
  gridWidth: number;
  numPatches: number;
  sequenceLengthWithCls: number;
  patchVectorDim: number;
  linearProjectionParams: number;
  selfAttentionPairs: number;
}

/**
 * Computes Vision Transformer (ViT) patch tokenization geometry:
 *   N = (H / P) * (W / P) = (H * W) / P^2
 *   Sequence Length L = N + 1 (including prepended [CLS] token)
 *   Patch Flattened Dim = P * P * C
 *   Linear Patch Projection Params = (P^2 * C) * d_model + d_model
 *   Self-Attention Pairwise Matrix Size = L^2
 */
export function computeVitPatchGeometry(
  imageSizeH: number = 224,
  patchSizeP: number = 16,
  channelsC: number = 3,
  dModel: number = 768
): VitPatchResult {
  const safeP = Math.max(1, patchSizeP);
  const gridWidth = Math.floor(imageSizeH / safeP);
  const numPatches = gridWidth * gridWidth;
  const sequenceLengthWithCls = numPatches + 1;
  const patchVectorDim = safeP * safeP * channelsC;
  const linearProjectionParams = patchVectorDim * dModel + dModel;
  const selfAttentionPairs = sequenceLengthWithCls * sequenceLengthWithCls;

  return {
    gridWidth,
    numPatches,
    sequenceLengthWithCls,
    patchVectorDim,
    linearProjectionParams,
    selfAttentionPairs,
  };
}
