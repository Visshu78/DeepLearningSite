/**
 * Pure analytical mathematical functions for Track 9:
 * Data Preparation and Feature Engineering (Lessons 9.1 – 9.6)
 */

export interface SummaryStats {
  count: number;
  mean: number;
  median: number;
  variance: number;
  stdDev: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
}

/**
 * Compute exact linear-interpolated quantile p in [0, 1] on a sorted array.
 */
export function computeQuantileSorted(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const clampedP = Math.max(0, Math.min(1, p));
  const idx = clampedP * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  const weight = idx - lo;
  return sorted[lo] * (1 - weight) + sorted[hi] * weight;
}

/**
 * 9.1 Exploring Data (EDA): Summary statistics, quartiles, IQR, and sample skewness.
 */
export function computeSummaryStats(values: number[]): SummaryStats {
  const n = values.length;
  if (n === 0) {
    return {
      count: 0,
      mean: 0,
      median: 0,
      variance: 0,
      stdDev: 0,
      min: 0,
      max: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
      skewness: 0,
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;

  const variance =
    values.reduce((acc, v) => acc + (v - mean) * (v - mean), 0) / n;
  const stdDev = Math.sqrt(variance);

  const median = computeQuantileSorted(sorted, 0.5);
  const q1 = computeQuantileSorted(sorted, 0.25);
  const q3 = computeQuantileSorted(sorted, 0.75);
  const iqr = q3 - q1;

  let skewness = 0;
  if (stdDev > 1e-12) {
    const m3 =
      values.reduce((acc, v) => acc + Math.pow(v - mean, 3), 0) / n;
    skewness = m3 / Math.pow(stdDev, 3);
  }

  return {
    count: n,
    mean,
    median,
    variance,
    stdDev,
    min: sorted[0],
    max: sorted[n - 1],
    q1,
    q3,
    iqr,
    skewness,
  };
}

/**
 * 9.2 Missing Data Imputation & Missingness Indicator Flag
 */
export type ImputationStrategy = 'mean' | 'median' | 'zero';

export interface ImputedRow {
  original: number | null;
  imputed: number;
  wasMissing: 0 | 1;
}

export function imputeColumnWithIndicator(
  rawValues: (number | null)[],
  strategy: ImputationStrategy
): {
  fillValue: number;
  rows: ImputedRow[];
} {
  const observed = rawValues.filter((v): v is number => v !== null && !Number.isNaN(v));
  const stats = computeSummaryStats(observed);

  let fillValue = 0;
  if (strategy === 'mean') fillValue = stats.mean;
  else if (strategy === 'median') fillValue = stats.median;
  else fillValue = 0;

  const rows: ImputedRow[] = rawValues.map(val => {
    const isMiss = val === null || Number.isNaN(val);
    return {
      original: val,
      imputed: isMiss ? fillValue : val,
      wasMissing: isMiss ? 1 : 0,
    };
  });

  return { fillValue, rows };
}

/**
 * 9.2 Outlier Detection via Tukey IQR fences and Z-Score threshold
 */
export interface OutlierAnalysisPoint {
  value: number;
  zScore: number;
  isIqrOutlier: boolean;
  isZOutlier: boolean;
  clippedIqrValue: number;
}

export function analyzeOutliers(
  values: number[],
  iqrMultiplier = 1.5,
  zThreshold = 2.5
): {
  lowerFence: number;
  upperFence: number;
  mean: number;
  stdDev: number;
  points: OutlierAnalysisPoint[];
} {
  const stats = computeSummaryStats(values);
  const lowerFence = stats.q1 - iqrMultiplier * stats.iqr;
  const upperFence = stats.q3 + iqrMultiplier * stats.iqr;

  const points: OutlierAnalysisPoint[] = values.map(v => {
    const zScore = stats.stdDev > 1e-12 ? (v - stats.mean) / stats.stdDev : 0;
    const isIqrOutlier = v < lowerFence || v > upperFence;
    const isZOutlier = Math.abs(zScore) > zThreshold;
    const clippedIqrValue = Math.max(lowerFence, Math.min(upperFence, v));

    return {
      value: v,
      zScore,
      isIqrOutlier,
      isZOutlier,
      clippedIqrValue,
    };
  });

  return {
    lowerFence,
    upperFence,
    mean: stats.mean,
    stdDev: stats.stdDev,
    points,
  };
}

/**
 * 9.3 Feature Scaling & Normalization
 * - Min-Max: (x - min) / (max - min)
 * - Z-Score (StandardScaler): (x - μ) / σ
 * - RobustScaler: (x - median) / IQR
 * - Log1p Transform: ln(1 + max(0, x))
 */
export type ScalingMethod = 'minmax' | 'zscore' | 'robust' | 'log1p';

export function scaleFeatureVector(
  values: number[],
  method: ScalingMethod
): {
  scaled: number[];
  centerParam: number;
  scaleParam: number;
  formulaLabel: string;
} {
  const stats = computeSummaryStats(values);

  if (method === 'minmax') {
    const range = stats.max - stats.min;
    const denom = Math.abs(range) > 1e-12 ? range : 1;
    return {
      scaled: values.map(x => (x - stats.min) / denom),
      centerParam: stats.min,
      scaleParam: denom,
      formulaLabel: 'x_scaled = (x - x_min) / (x_max - x_min)',
    };
  }

  if (method === 'zscore') {
    const denom = stats.stdDev > 1e-12 ? stats.stdDev : 1;
    return {
      scaled: values.map(x => (x - stats.mean) / denom),
      centerParam: stats.mean,
      scaleParam: denom,
      formulaLabel: 'x_scaled = (x - μ) / σ',
    };
  }

  if (method === 'robust') {
    const denom = stats.iqr > 1e-12 ? stats.iqr : 1;
    return {
      scaled: values.map(x => (x - stats.median) / denom),
      centerParam: stats.median,
      scaleParam: denom,
      formulaLabel: 'x_scaled = (x - median) / IQR',
    };
  }

  // log1p
  return {
    scaled: values.map(x => Math.log1p(Math.max(0, x))),
    centerParam: 0,
    scaleParam: 1,
    formulaLabel: 'x_scaled = ln(1 + x)',
  };
}

/**
 * 9.4 Categorical Variable Encoding: Smoothed Target Encoding (Additive Smoothing)
 * y_hat_c = (n_c * mean_c + m * global_mean) / (n_c + m)
 */
export interface TargetEncodedCategory {
  category: string;
  count: number;
  positiveCount: number;
  rawCategoryMean: number;
  smoothedEncoding: number;
}

export function computeSmoothedTargetEncoding(
  records: { category: string; target: number }[],
  smoothingWeightM: number
): {
  globalMean: number;
  categories: TargetEncodedCategory[];
} {
  if (records.length === 0) {
    return { globalMean: 0, categories: [] };
  }

  const m = Math.max(0, smoothingWeightM);
  const globalMean =
    records.reduce((acc, r) => acc + r.target, 0) / records.length;

  const grouped = new Map<string, { count: number; sum: number }>();
  for (const r of records) {
    const prev = grouped.get(r.category) ?? { count: 0, sum: 0 };
    grouped.set(r.category, { count: prev.count + 1, sum: prev.sum + r.target });
  }

  const categories: TargetEncodedCategory[] = [];
  for (const [category, info] of grouped.entries()) {
    const rawCategoryMean = info.sum / info.count;
    const smoothedEncoding =
      (info.count * rawCategoryMean + m * globalMean) / (info.count + m);
    categories.push({
      category,
      count: info.count,
      positiveCount: info.sum,
      rawCategoryMean,
      smoothedEncoding,
    });
  }

  return { globalMean, categories };
}

/**
 * 9.5 Data Splitting & Preventing Data Leakage
 * Demonstrates how fitting a scaler or target statistic on the full dataset
 * leaks test-set distribution parameters into training and inflates apparent metrics.
 */
export interface LeakageComparisonResult {
  trainMeanClean: number;
  trainStdClean: number;
  fullMeanLeaked: number;
  fullStdLeaked: number;
  scaledTestClean: number[];
  scaledTestLeaked: number[];
  maxAbsoluteDistortion: number;
}

export function compareCleanVsLeakedScaling(
  trainValues: number[],
  testValues: number[]
): LeakageComparisonResult {
  const trainStats = computeSummaryStats(trainValues);
  const fullStats = computeSummaryStats([...trainValues, ...testValues]);

  const cleanStd = trainStats.stdDev > 1e-12 ? trainStats.stdDev : 1;
  const leakedStd = fullStats.stdDev > 1e-12 ? fullStats.stdDev : 1;

  const scaledTestClean = testValues.map(x => (x - trainStats.mean) / cleanStd);
  const scaledTestLeaked = testValues.map(x => (x - fullStats.mean) / leakedStd);

  let maxAbsoluteDistortion = 0;
  for (let i = 0; i < testValues.length; i++) {
    const diff = Math.abs(scaledTestClean[i] - scaledTestLeaked[i]);
    if (diff > maxAbsoluteDistortion) maxAbsoluteDistortion = diff;
  }

  return {
    trainMeanClean: trainStats.mean,
    trainStdClean: trainStats.stdDev,
    fullMeanLeaked: fullStats.mean,
    fullStdLeaked: fullStats.stdDev,
    scaledTestClean,
    scaledTestLeaked,
    maxAbsoluteDistortion,
  };
}

/**
 * 9.6 Class Imbalance: Weighted Binary Cross-Entropy & SMOTE Linear Interpolation
 * Weighted BCE: L = - [ w_pos * y * ln(p) + w_neg * (1 - y) * ln(1 - p) ]
 * Balanced class weight formula (scikit-learn convention):
 * w_c = N_total / (2 * N_c)
 */
export function computeBalancedClassWeights(
  nNegative: number,
  nPositive: number
): {
  wNegative: number;
  wPositive: number;
  imbalanceRatio: number;
} {
  const neg = Math.max(1, nNegative);
  const pos = Math.max(1, nPositive);
  const total = neg + pos;

  return {
    wNegative: total / (2 * neg),
    wPositive: total / (2 * pos),
    imbalanceRatio: neg / pos,
  };
}

export function computeWeightedBCE(
  yTrue: 0 | 1,
  pPred: number,
  wPositive: number,
  wNegative = 1.0
): {
  loss: number;
  dL_dz: number; // Gradient w.r.t. logit z where p = sigmoid(z)
} {
  const eps = 1e-7;
  const p = Math.max(eps, Math.min(1 - eps, pPred));

  if (yTrue === 1) {
    const loss = -wPositive * Math.log(p);
    // Since d(-ln(sigmoid(z)))/dz = p - 1:
    const dL_dz = wPositive * (p - 1);
    return { loss, dL_dz };
  } else {
    const loss = -wNegative * Math.log(1 - p);
    // Since d(-ln(1 - sigmoid(z)))/dz = p:
    const dL_dz = wNegative * p;
    return { loss, dL_dz };
  }
}

/**
 * 9.6 SMOTE Synthetic Sample Interpolation between minority point x_i and neighbor x_nn:
 * x_new = x_i + λ * (x_nn - x_i), where λ ∈ [0, 1]
 */
export function generateSmotePoint(
  xi: [number, number],
  xNeighbor: [number, number],
  lambda: number
): [number, number] {
  const t = Math.max(0, Math.min(1, lambda));
  return [
    xi[0] + t * (xNeighbor[0] - xi[0]),
    xi[1] + t * (xNeighbor[1] - xi[1]),
  ];
}

/**
 * 9.7 Feature Engineering: Cyclical Trigonometric Encoding for Periodic Features (Hour, Month, Day)
 * x_sin = sin(2π * t / T), x_cos = cos(2π * t / T)
 */
export function computeCyclicalEncoding(
  value: number,
  period: number
): {
  angleRad: number;
  sinVal: number;
  cosVal: number;
  distanceToZero: number;
} {
  const p = Math.max(1e-9, period);
  const angleRad = (2 * Math.PI * value) / p;
  const sinVal = Math.sin(angleRad);
  const cosVal = Math.cos(angleRad);
  // Euclidean distance on unit circle to t=0 (where sin=0, cos=1):
  const distanceToZero = Math.sqrt(sinVal * sinVal + (cosVal - 1) * (cosVal - 1));
  return {
    angleRad,
    sinVal,
    cosVal,
    distanceToZero,
  };
}

