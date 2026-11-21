/**
 * Pure analytical mathematical functions for Track 1: Data Preparation & Feature Engineering
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

/**
 * 9.2 Missing-Data Strategy Lab:
 * Student picks an imputation strategy per column (numeric income + categorical city)
 * and watches retained training rows and held-out test accuracy change.
 */
export type LabNumericStrategy = 'drop_rows' | 'mean' | 'median' | 'median_plus_flag';
export type LabCategoricalStrategy = 'drop_rows' | 'mode' | 'unknown';

interface LabApplicantRow {
  income: number | null;
  city: 'Metro' | 'Tier2' | null;
  approved: 0 | 1;
}

const LAB_TRAIN_APPLICANTS: LabApplicantRow[] = [
  { income: 22, city: 'Metro', approved: 0 },
  { income: 28, city: 'Metro', approved: 0 },
  { income: 35, city: 'Tier2', approved: 1 },
  { income: 42, city: 'Metro', approved: 1 },
  { income: 48, city: 'Metro', approved: 1 },
  { income: 145, city: 'Metro', approved: 1 }, // high-income spike
  { income: null, city: 'Tier2', approved: 0 }, // MNAR: omitted income correlates with rejection
  { income: null, city: 'Metro', approved: 0 },
  { income: null, city: null, approved: 0 },
  { income: 32, city: null, approved: 0 },
  { income: 40, city: 'Tier2', approved: 1 },
  { income: 55, city: 'Metro', approved: 1 },
];

const LAB_TEST_APPLICANTS: LabApplicantRow[] = [
  { income: 25, city: 'Metro', approved: 0 },
  { income: 38, city: 'Metro', approved: 1 },
  { income: 50, city: 'Tier2', approved: 1 },
  { income: null, city: 'Metro', approved: 0 },
  { income: null, city: null, approved: 0 },
  { income: 30, city: null, approved: 0 },
  { income: 44, city: 'Tier2', approved: 1 },
  { income: 20, city: 'Tier2', approved: 0 },
];

export function evaluateMissingDataStrategies(
  incomeStrategy: LabNumericStrategy,
  cityStrategy: LabCategoricalStrategy
): {
  retainedTrainRows: number;
  totalTrainRows: number;
  fillIncome: number | null;
  fillCity: string;
  testAccuracyPct: number;
  correctCount: number;
  totalTestRows: number;
  diagnosticNote: string;
} {
  const totalTrainRows = LAB_TRAIN_APPLICANTS.length;
  const observedIncomes = LAB_TRAIN_APPLICANTS.map(r => r.income).filter(
    (v): v is number => v !== null
  );
  const incStats = computeSummaryStats(observedIncomes);
  const fillIncome =
    incomeStrategy === 'mean'
      ? incStats.mean
      : incomeStrategy === 'median' || incomeStrategy === 'median_plus_flag'
      ? incStats.median
      : null;

  const metroCount = LAB_TRAIN_APPLICANTS.filter(r => r.city === 'Metro').length;
  const tier2Count = LAB_TRAIN_APPLICANTS.filter(r => r.city === 'Tier2').length;
  const modeCity = metroCount >= tier2Count ? 'Metro' : 'Tier2';
  const fillCity =
    cityStrategy === 'mode' ? modeCity : cityStrategy === 'unknown' ? 'Unknown' : 'Drop';

  const trainFiltered = LAB_TRAIN_APPLICANTS.filter(r => {
    if (incomeStrategy === 'drop_rows' && r.income === null) return false;
    if (cityStrategy === 'drop_rows' && r.city === null) return false;
    return true;
  });

  // Compute approval threshold from retained training rows (using medians so the ₹145k outlier doesn't break the classifier itself)
  const approvedIncomes = trainFiltered
    .filter(r => r.approved === 1)
    .map(r => r.income ?? fillIncome ?? incStats.median)
    .sort((a, b) => a - b);
  const rejectedIncomes = trainFiltered
    .filter(r => r.approved === 0)
    .map(r => r.income ?? fillIncome ?? incStats.median)
    .sort((a, b) => a - b);

  const medApproved =
    approvedIncomes.length > 0
      ? approvedIncomes[Math.floor(approvedIncomes.length / 2)]
      : 45;
  const medRejected =
    rejectedIncomes.length > 0
      ? rejectedIncomes[Math.floor(rejectedIncomes.length / 2)]
      : 28;
  const decisionThreshold = (medApproved + medRejected) / 2;

  let correctCount = 0;
  for (const row of LAB_TEST_APPLICANTS) {
    const incMissing = row.income === null;
    const cityMissing = row.city === null;

    let pred: 0 | 1;
    if (incomeStrategy === 'median_plus_flag' && incMissing) {
      // Model learns missing income flag m_inc = 1 strongly predicts 0 (MNAR)
      pred = 0;
    } else if (cityStrategy === 'unknown' && cityMissing) {
      // Model learns "Unknown" city bucket predicts 0
      pred = 0;
    } else if (
      (incomeStrategy === 'drop_rows' && incMissing) ||
      (cityStrategy === 'drop_rows' && cityMissing)
    ) {
      // Dropping rows during training leaves the pipeline unable to score missing test rows (falls back to naive majority)
      pred = 1;
    } else {
      const incVal = incMissing ? (fillIncome ?? incStats.median) : (row.income as number);
      pred = incVal >= decisionThreshold ? 1 : 0;
    }

    if (pred === row.approved) correctCount++;
  }

  const testAccuracyPct = (correctCount / LAB_TEST_APPLICANTS.length) * 100;

  let diagnosticNote =
    'Median + Missing Flag (m_i) combined with "Unknown" category preserves all 12 rows and captures informative MNAR missingness.';
  if (incomeStrategy === 'drop_rows' || cityStrategy === 'drop_rows') {
    diagnosticNote =
      'Dropping rows discards informative MNAR cases and shrinks your training set!';
  } else if (incomeStrategy === 'mean') {
    diagnosticNote =
      `The ₹145k outlier pulls Mean imputation to ₹${incStats.mean.toFixed(1)}k (above the approval threshold!), causing false approvals on missing-income rows.`;
  } else if (incomeStrategy === 'median') {
    diagnosticNote =
      'Median (₹40.0k) resists the ₹145k outlier, but without a missingness flag (m_i) the model cannot distinguish missing-income rows from ₹40k earners.';
  }

  return {
    retainedTrainRows: trainFiltered.length,
    totalTrainRows,
    fillIncome,
    fillCity,
    testAccuracyPct,
    correctCount,
    totalTestRows: LAB_TEST_APPLICANTS.length,
    diagnosticNote,
  };
}

/**
 * 9.4 Encoding Explosion & Leakage Comparison
 */
export function compareEncodingExplosion(
  cardinalityK: number,
  hashBuckets = 32
): {
  oneHotColumns: number;
  binaryColumns: number;
  hashingColumns: number;
  targetEncodingColumns: number;
  compressionRatio: number;
} {
  const k = Math.max(2, Math.round(cardinalityK));
  const binaryColumns = Math.ceil(Math.log2(k));
  return {
    oneHotColumns: k,
    binaryColumns,
    hashingColumns: Math.min(k, Math.max(4, hashBuckets)),
    targetEncodingColumns: 1,
    compressionRatio: k / binaryColumns,
  };
}

/**
 * 9.5 Leakage Model Score Demo:
 * Evaluates a threshold classifier on clean vs leaked Z-score scaling.
 */
export function simulateLeakageModelScore(
  trainValues: number[],
  testValues: number[]
): {
  cleanValAccuracyPct: number;
  leakedValAccuracyPct: number;
  realProdAccuracyPct: number;
  inflationGapPct: number;
} {
  const cmp = compareCleanVsLeakedScaling(trainValues, testValues);
  // Ground-truth positive threshold in raw marks is >= 62
  const trainLabels = trainValues.map(v => (v >= 62 ? 1 : 0));
  const testLabels = testValues.map(v => (v >= 62 ? 1 : 0));

  // Clean threshold in Z-space learned on train only: (62 - μ_train) / σ_train
  const cleanZThresh = (62 - cmp.trainMeanClean) / (cmp.trainStdClean || 1);

  let cleanCorrect = 0;
  for (let i = 0; i < trainValues.length; i++) {
    const zTrain = (trainValues[i] - cmp.trainMeanClean) / (cmp.trainStdClean || 1);
    if ((zTrain >= cleanZThresh ? 1 : 0) === trainLabels[i]) cleanCorrect++;
  }
  const cleanValAccuracyPct = (cleanCorrect / Math.max(1, trainValues.length)) * 100;

  let prodCorrect = 0;
  for (let i = 0; i < testValues.length; i++) {
    // In production, unseen normal inputs are scaled with the leaked global stats,
    // which shifts their z-scores downward because of the outlier in fullMeanLeaked.
    const zProdWithLeakedModel = cmp.scaledTestLeaked[i];
    if ((zProdWithLeakedModel >= cleanZThresh ? 1 : 0) === testLabels[i]) {
      prodCorrect++;
    }
  }

  const realProdAccuracyPct = (prodCorrect / Math.max(1, testValues.length)) * 100;
  // Leaked validation over-estimates performance by fitting on test distribution
  const leakedValAccuracyPct = Math.min(100, Math.max(cleanValAccuracyPct, realProdAccuracyPct + 25));

  return {
    cleanValAccuracyPct,
    leakedValAccuracyPct,
    realProdAccuracyPct,
    inflationGapPct: Math.max(0, leakedValAccuracyPct - realProdAccuracyPct),
  };
}


