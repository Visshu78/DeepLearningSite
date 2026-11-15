/**
 * Pure analytical mathematical engine for Track 3: Training Neural Networks Well
 * (Lessons 3.1, 3.2, 3.5, 3.6: Weight Initialization, Batch/Layer Normalization,
 * Learning Rate Schedules & Warmup, and Loss Curve Diagnostics & Gradient Clipping).
 *
 * Every equation and backward derivative is verified via automated unit tests.
 */

const EPS = 1e-12;

// ============================================================================
// LESSON 3.1: WEIGHT INITIALIZATION (XAVIER / GLOROT & KAIMING / HE)
// ============================================================================

export interface InitVarianceResult {
  xavierStd: number;
  heStd: number;
  layerVariancesLinear: number[];
  layerVariancesRelu: number[];
  finalRatioLinear: number;
  finalRatioRelu: number;
}

/**
 * Computes activation variance propagation across L layers of width fanIn:
 * - For linear/Tanh regime (small z): Var(z^(l)) = (fanIn * sigma_w^2) * Var(z^(l-1))
 *   Xavier sets sigma_w = sqrt(1 / fanIn) so fanIn * sigma_w^2 = 1.
 * - For ReLU regime: symmetric inputs lose half their variance at max(0, z),
 *   so Var(a^(l)) = 0.5 * (fanIn * sigma_w^2) * Var(a^(l-1)).
 *   Kaiming / He sets sigma_w = sqrt(2 / fanIn) so 0.5 * fanIn * sigma_w^2 = 1.
 */
export function computeInitializationPropagation(
  fanIn: number,
  sigmaW: number,
  numLayers: number = 10
): InitVarianceResult {
  const safeFanIn = Math.max(1, fanIn);
  const xavierStd = Math.sqrt(1 / safeFanIn);
  const heStd = Math.sqrt(2 / safeFanIn);

  const linearFactor = safeFanIn * sigmaW * sigmaW;
  const reluFactor = 0.5 * safeFanIn * sigmaW * sigmaW;

  const layerVariancesLinear: number[] = [];
  const layerVariancesRelu: number[] = [];

  let vLin = 1.0;
  let vRelu = 1.0;
  for (let l = 1; l <= numLayers; l++) {
    vLin *= linearFactor;
    vRelu *= reluFactor;
    layerVariancesLinear.push(vLin);
    layerVariancesRelu.push(vRelu);
  }

  return {
    xavierStd,
    heStd,
    layerVariancesLinear,
    layerVariancesRelu,
    finalRatioLinear: vLin,
    finalRatioRelu: vRelu,
  };
}

// ============================================================================
// LESSON 3.2: BATCH NORMALIZATION & LAYER NORMALIZATION
// ============================================================================

export interface NormalizationPassResult {
  mean: number;
  variance: number;
  stdInv: number;
  xHat: number[];
  yOut: number[];
  gradGamma: number;
  gradBeta: number;
  gradX: number[];
}

/**
 * Evaluates 1D Batch/Layer Normalization forward and exact analytical backward pass:
 *   mu      = (1 / N) * sum_i x_i
 *   var     = (1 / N) * sum_i (x_i - mu)^2
 *   xHat_i  = (x_i - mu) / sqrt(var + eps)
 *   y_i     = gamma * xHat_i + beta
 *
 * Given upstream gradient dL/dy_i = dy_i:
 *   dL/dgamma = sum_i dy_i * xHat_i
 *   dL/dbeta  = sum_i dy_i
 *   dL/dx_i   = (gamma / (N * sqrt(var + eps))) * (N * dy_i - sum_j dy_j - xHat_i * sum_j (dy_j * xHat_j))
 */
export function computeNormalizationForwardBackward(
  x: number[],
  gamma: number,
  beta: number,
  upstreamDy: number[],
  eps: number = 1e-5
): NormalizationPassResult {
  const N = x.length;
  if (N === 0) {
    return {
      mean: 0,
      variance: 0,
      stdInv: 1,
      xHat: [],
      yOut: [],
      gradGamma: 0,
      gradBeta: 0,
      gradX: [],
    };
  }

  const mean = x.reduce((a, b) => a + b, 0) / N;
  const variance = x.reduce((acc, v) => acc + (v - mean) * (v - mean), 0) / N;
  const stdInv = 1 / Math.sqrt(variance + eps);

  const xHat = x.map(v => (v - mean) * stdInv);
  const yOut = xHat.map(xh => gamma * xh + beta);

  let gradGamma = 0;
  let gradBeta = 0;
  for (let i = 0; i < N; i++) {
    const dy = upstreamDy[i] ?? 0;
    gradBeta += dy;
    gradGamma += dy * xHat[i];
  }

  const scale = (gamma * stdInv) / N;
  const gradX = xHat.map((xh, i) => {
    const dy = upstreamDy[i] ?? 0;
    return scale * (N * dy - gradBeta - xh * gradGamma);
  });

  return {
    mean,
    variance,
    stdInv,
    xHat,
    yOut,
    gradGamma,
    gradBeta,
    gradX,
  };
}

// ============================================================================
// LESSON 3.5: LEARNING RATE SCHEDULES & LINEAR WARMUP
// ============================================================================

export interface SchedulePoint {
  step: number;
  warmupCosineLr: number;
  stepDecayLr: number;
  exponentialLr: number;
}

/**
 * Evaluates Learning Rate at step t across total steps T with warmup W:
 * 1. Linear Warmup + Cosine Annealing:
 *    - If t <= W: lr(t) = lrMax * (t / W)
 *    - If t > W:  lr(t) = lrMin + 0.5 * (lrMax - lrMin) * (1 + cos(pi * (t - W) / (T - W)))
 * 2. Step Decay (halving every T/3 steps)
 * 3. Exponential Decay: lrMax * exp(-decayRate * t / T)
 */
export function computeLearningRateAtStep(
  step: number,
  totalSteps: number,
  warmupSteps: number,
  lrMax: number,
  lrMin: number = 0.0
): SchedulePoint {
  const safeTotal = Math.max(1, totalSteps);
  const safeWarmup = Math.max(1, Math.min(safeTotal - 1, warmupSteps));
  const clampedStep = Math.max(0, Math.min(safeTotal, step));

  let warmupCosineLr: number;
  if (clampedStep <= safeWarmup) {
    warmupCosineLr = lrMax * (clampedStep / safeWarmup);
  } else {
    const progress = (clampedStep - safeWarmup) / (safeTotal - safeWarmup);
    warmupCosineLr =
      lrMin + 0.5 * (lrMax - lrMin) * (1 + Math.cos(Math.PI * progress));
  }

  const milestoneInterval = Math.max(1, Math.floor(safeTotal / 3));
  const numDrops = Math.floor(clampedStep / milestoneInterval);
  const stepDecayLr = lrMax * Math.pow(0.5, numDrops);
  const exponentialLr = lrMax * Math.exp(-3.0 * (clampedStep / safeTotal));

  return {
    step: clampedStep,
    warmupCosineLr,
    stepDecayLr,
    exponentialLr,
  };
}

// ============================================================================
// LESSON 3.6: READING LOSS CURVES & DEBUGGING TRAINING
// ============================================================================

export interface TrainingDiagnosticsResult {
  trainLoss: number;
  valLoss: number;
  generalizationGap: number;
  gradNormRaw: number;
  gradNormClipped: number;
  clipScaleFactor: number;
  deadReluFraction: number;
  diagnosis: 'Underfitting' | 'Sweet Spot' | 'Overfitting' | 'Diverging / Unstable';
}

/**
 * Evaluates loss curve diagnostics, generalization gap, dead ReLU fraction,
 * and analytical global gradient norm clipping:
 *   g_clipped = g * min(1, maxNorm / ||g||_2)
 */
export function computeTrainingDiagnostics(
  capacityLevel: number,
  learningRate: number,
  gradVector: number[],
  maxGradNorm: number,
  preActivations: number[]
): TrainingDiagnosticsResult {
  // Analytical U-shaped validation curve + instability spike when lr > 0.8
  const instability = learningRate > 0.8 ? Math.pow((learningRate - 0.8) * 5, 2) : 0;
  const trainLoss = 1.4 * Math.exp(-0.45 * capacityLevel) + 0.05 + instability;
  const overfitPenalty = 0.035 * Math.pow(Math.max(0, capacityLevel - 4), 2);
  const valLoss = trainLoss + 0.08 + overfitPenalty + instability * 1.2;
  const generalizationGap = valLoss - trainLoss;

  const gradNormRaw = Math.sqrt(
    gradVector.reduce((acc, g) => acc + g * g, 0)
  );
  const safeMax = Math.max(EPS, maxGradNorm);
  const clipScaleFactor = gradNormRaw > safeMax ? safeMax / gradNormRaw : 1.0;
  const gradNormClipped = gradNormRaw * clipScaleFactor;

  const deadCount = preActivations.filter(z => z <= 0).length;
  const deadReluFraction =
    preActivations.length > 0 ? deadCount / preActivations.length : 0;

  let diagnosis: TrainingDiagnosticsResult['diagnosis'] = 'Sweet Spot';
  if (instability > 0.25) {
    diagnosis = 'Diverging / Unstable';
  } else if (capacityLevel < 2.5) {
    diagnosis = 'Underfitting';
  } else if (capacityLevel > 6.0) {
    diagnosis = 'Overfitting';
  }

  return {
    trainLoss,
    valLoss,
    generalizationGap,
    gradNormRaw,
    gradNormClipped,
    clipScaleFactor,
    deadReluFraction,
    diagnosis,
  };
}
