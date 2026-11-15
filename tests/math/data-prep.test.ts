import { describe, it, expect } from 'vitest';
import {
  computeSummaryStats,
  imputeColumnWithIndicator,
  analyzeOutliers,
  scaleFeatureVector,
  computeSmoothedTargetEncoding,
  compareCleanVsLeakedScaling,
  computeBalancedClassWeights,
  computeWeightedBCE,
  generateSmotePoint,
  computeCyclicalEncoding,
  evaluateMissingDataStrategies,
  compareEncodingExplosion,
  simulateLeakageModelScore,
} from '../../lib/math/dataPrep';

describe('Track 9 Math Engine: Data Preparation & Feature Engineering', () => {
  it('computes exact summary statistics, quartiles, IQR, and skewness', () => {
    const data = [10, 20, 30, 40, 50];
    const stats = computeSummaryStats(data);
    expect(stats.count).toBe(5);
    expect(stats.mean).toBeCloseTo(30, 6);
    expect(stats.median).toBeCloseTo(30, 6);
    expect(stats.q1).toBeCloseTo(20, 6);
    expect(stats.q3).toBeCloseTo(40, 6);
    expect(stats.iqr).toBeCloseTo(20, 6);
    expect(stats.skewness).toBeCloseTo(0, 6);
  });

  it('imputes missing values with mean/median and creates exact binary missingness indicator flags', () => {
    const raw = [10, null, 20, 30, 100];
    // Observed: [10, 20, 30, 100] -> mean = 40, median = 25
    const meanResult = imputeColumnWithIndicator(raw, 'mean');
    expect(meanResult.fillValue).toBeCloseTo(40, 6);
    expect(meanResult.rows[1]).toEqual({ original: null, imputed: 40, wasMissing: 1 });
    expect(meanResult.rows[0].wasMissing).toBe(0);

    const medianResult = imputeColumnWithIndicator(raw, 'median');
    expect(medianResult.fillValue).toBeCloseTo(25, 6);
    expect(medianResult.rows[1]).toEqual({ original: null, imputed: 25, wasMissing: 1 });
  });

  it('detects Tukey IQR outliers and clips extreme spikes accurately', () => {
    const values = [10, 12, 14, 15, 16, 18, 20, 150];
    const analysis = analyzeOutliers(values, 1.5, 2.0);
    const spike = analysis.points[analysis.points.length - 1];
    expect(spike.isIqrOutlier).toBe(true);
    expect(spike.isZOutlier).toBe(true);
    expect(spike.clippedIqrValue).toBeCloseTo(analysis.upperFence, 6);
  });

  it('scales feature vectors via Min-Max, Z-Score, Robust, and Log1p transforms', () => {
    const x = [0, 10, 20, 30, 40];
    const mm = scaleFeatureVector(x, 'minmax');
    expect(mm.scaled[0]).toBeCloseTo(0, 6);
    expect(mm.scaled[2]).toBeCloseTo(0.5, 6);
    expect(mm.scaled[4]).toBeCloseTo(1.0, 6);

    const zs = scaleFeatureVector(x, 'zscore');
    const zsMean = zs.scaled.reduce((a, b) => a + b, 0) / zs.scaled.length;
    expect(zsMean).toBeCloseTo(0, 6);

    const rb = scaleFeatureVector([10, 20, 30, 40, 500], 'robust');
    // Median is 30 -> scaled median index 2 is 0
    expect(rb.scaled[2]).toBeCloseTo(0, 6);
  });

  it('computes smoothed target encoding pulling rare categories toward the global prior', () => {
    const records = [
      { category: 'Mumbai', target: 1 },
      { category: 'Mumbai', target: 1 },
      { category: 'Mumbai', target: 0 },
      { category: 'Mumbai', target: 0 },
      { category: 'RareTown', target: 1 },
    ];
    // Global mean = 3/5 = 0.6. RareTown has n=1, mean=1.0
    const res = computeSmoothedTargetEncoding(records, 4);
    expect(res.globalMean).toBeCloseTo(0.6, 6);
    const rare = res.categories.find(c => c.category === 'RareTown')!;
    // (1 * 1.0 + 4 * 0.6) / (1 + 4) = 3.4 / 5 = 0.68
    expect(rare.rawCategoryMean).toBeCloseTo(1.0, 6);
    expect(rare.smoothedEncoding).toBeCloseTo(0.68, 6);
  });

  it('quantifies train/test scaling leakage when test outliers contaminate global mean and std', () => {
    const train = [10, 12, 14, 16, 18];
    const test = [15, 250];
    const cmp = compareCleanVsLeakedScaling(train, test);
    expect(cmp.fullMeanLeaked).toBeGreaterThan(cmp.trainMeanClean);
    expect(cmp.maxAbsoluteDistortion).toBeGreaterThan(1.0);
  });

  it('verifies balanced class weights, Weighted BCE analytical logit gradient against finite differences, and SMOTE interpolation', () => {
    const weights = computeBalancedClassWeights(950, 50);
    expect(weights.imbalanceRatio).toBeCloseTo(19, 6);
    expect(weights.wPositive).toBeCloseTo(1000 / 100, 6); // 10.0
    expect(weights.wNegative).toBeCloseTo(1000 / 1900, 6);

    // Finite-difference check on Weighted BCE w.r.t. logit z
    const z = -0.7;
    const sigmoid = (val: number) => 1 / (1 + Math.exp(-val));
    const eps = 1e-6;
    const wPos = 10.0;
    const wNeg = 0.526;

    for (const yTrue of [0, 1] as const) {
      const { dL_dz } = computeWeightedBCE(yTrue, sigmoid(z), wPos, wNeg);
      const lossPlus = computeWeightedBCE(yTrue, sigmoid(z + eps), wPos, wNeg).loss;
      const lossMinus = computeWeightedBCE(yTrue, sigmoid(z - eps), wPos, wNeg).loss;
      const numericalGrad = (lossPlus - lossMinus) / (2 * eps);
      expect(dL_dz).toBeCloseTo(numericalGrad, 5);
    }

    const syn = generateSmotePoint([2, 4], [6, 12], 0.25);
    expect(syn[0]).toBeCloseTo(3, 6);
    expect(syn[1]).toBeCloseTo(6, 6);
  });

  it('encodes cyclical periodic features (e.g. hour 23 vs hour 0) smoothly on the unit circle', () => {
    const h23 = computeCyclicalEncoding(23, 24);
    const h1 = computeCyclicalEncoding(1, 24);
    // Hour 23 and Hour 1 are equidistant from midnight (Hour 0)
    expect(h23.distanceToZero).toBeCloseTo(h1.distanceToZero, 6);
    expect(h23.sinVal * h23.sinVal + h23.cosVal * h23.cosVal).toBeCloseTo(1.0, 6);
  });

  it('evaluates missing-data lab strategies and shows median_plus_flag + unknown preserves rows and boosts accuracy', () => {
    const dropRes = evaluateMissingDataStrategies('drop_rows', 'drop_rows');
    const flagRes = evaluateMissingDataStrategies('median_plus_flag', 'unknown');
    expect(dropRes.retainedTrainRows).toBeLessThan(dropRes.totalTrainRows);
    expect(flagRes.retainedTrainRows).toBe(flagRes.totalTrainRows);
    expect(flagRes.testAccuracyPct).toBeGreaterThanOrEqual(dropRes.testAccuracyPct);
    expect(flagRes.fillCity).toBe('Unknown');
  });

  it('compares encoding column explosion across One-Hot, Binary, Hashing, and Target encoding', () => {
    const res = compareEncodingExplosion(1024, 32);
    expect(res.oneHotColumns).toBe(1024);
    expect(res.binaryColumns).toBe(10); // ceil(log2(1024))
    expect(res.hashingColumns).toBe(32);
    expect(res.targetEncodingColumns).toBe(1);
    expect(res.compressionRatio).toBeCloseTo(102.4, 1);
  });

  it('simulates leakage model score showing leaked validation exceeds real production accuracy', () => {
    const res = simulateLeakageModelScore([50, 55, 60, 65, 70], [58, 64, 180]);
    expect(res.leakedValAccuracyPct).toBeGreaterThan(res.realProdAccuracyPct);
    expect(res.inflationGapPct).toBeCloseTo(
      res.leakedValAccuracyPct - res.realProdAccuracyPct,
      4
    );
  });
});
