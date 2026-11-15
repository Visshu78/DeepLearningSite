'use client';

import React, { useState, useMemo } from 'react';
import {
  computeLinearRegression,
  computeLogisticRegressionStep,
  computeBiasVarianceDecomposition,
  computeDecisionTreeSplit,
  computeKMeansAndPca,
} from '@/lib/math/classicalMl';
import { LineChart } from 'lucide-react';

export type ClassicalMlTab = 'linreg' | 'logreg' | 'biasvar' | 'trees' | 'kmeans-pca';

interface ClassicalMLVisualizerProps {
  defaultTab?: ClassicalMlTab;
}

export function ClassicalMLVisualizer({
  defaultTab = 'linreg',
}: ClassicalMLVisualizerProps) {
  const [activeTab, setActiveTab] = useState<ClassicalMlTab>(defaultTab);

  // 1.1 Linear Regression State (Auto-rickshaw distance vs fare)
  const [slopeW, setSlopeW] = useState<number>(13.0);
  const [interceptB, setInterceptB] = useState<number>(25.0);
  const autoDistances = useMemo(() => [1, 2, 4, 6, 8], []);
  const autoFares = useMemo(() => [45, 60, 90, 120, 150], []); // True OLS: w*=15, b*=30
  const linRes = useMemo(
    () => computeLinearRegression(autoDistances, autoFares, slopeW, interceptB),
    [autoDistances, autoFares, slopeW, interceptB]
  );

  // 1.2 Logistic Regression State
  const [rainLevelX, setRainLevelX] = useState<number>(2.0);
  const [logWeightW, setLogWeightW] = useState<number>(1.2);
  const [thresholdTau, setThresholdTau] = useState<number>(0.5);
  const logRes = useMemo(
    () => computeLogisticRegressionStep(rainLevelX, 1, logWeightW, -1.0, thresholdTau),
    [rainLevelX, logWeightW, thresholdTau]
  );

  // 1.3 Bias-Variance State
  const [polyDegree, setPolyDegree] = useState<number>(3.5);
  const [noiseStd, setNoiseStd] = useState<number>(0.3);
  const bvRes = useMemo(
    () => computeBiasVarianceDecomposition(polyDegree, noiseStd),
    [polyDegree, noiseStd]
  );

  // 1.4 Decision Trees & Random Forest State
  const [leftPos, setLeftPos] = useState<number>(8);
  const [leftNeg, setLeftNeg] = useState<number>(2);
  const [numTreesB, setNumTreesB] = useState<number>(50);
  const treeRes = useMemo(
    () => computeDecisionTreeSplit(leftPos, leftNeg, 10 - leftPos, 10 - leftNeg, numTreesB, 0.15),
    [leftPos, leftNeg, numTreesB]
  );

  // 1.5 k-Means & PCA State
  const [c0X, setC0X] = useState<number>(-1.2);
  const [c1X, setC1X] = useState<number>(1.4);
  const sampleGuests: [number, number][] = useMemo(
    () => [
      [-2.0, -1.8],
      [-1.5, -1.2],
      [-1.0, -0.9],
      [1.2, 1.0],
      [1.8, 1.6],
      [2.2, 2.0],
    ],
    []
  );
  const kmPcaRes = useMemo(
    () => computeKMeansAndPca(sampleGuests, [c0X, -1.3], [c1X, 1.5]),
    [sampleGuests, c0X, c1X]
  );

  const tabs: { id: ClassicalMlTab; label: string }[] = [
    { id: 'linreg', label: '1.1 Linear Regression' },
    { id: 'logreg', label: '1.2 Logistic Regression' },
    { id: 'biasvar', label: '1.3 Bias-Variance' },
    { id: 'trees', label: '1.4 Trees & Forests' },
    { id: 'kmeans-pca', label: '1.5 k-Means & PCA' },
  ];

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl overflow-hidden shadow-xs">
      <div className="bg-[#FAF5EE] border-b border-[#EAE2D5] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LineChart className="w-4 h-4 text-[#7A1C30]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F191B]">
            Track 1 Classical Machine Learning &amp; Tabular Algorithms Workbench
          </span>
        </div>

        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg border border-[#EAE2D5]">
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                activeTab === t.id
                  ? 'bg-[#7A1C30] text-white'
                  : 'text-[#54484E] hover:text-[#1F191B]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* TAB 1.1: LINEAR REGRESSION */}
        {activeTab === 'linreg' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">MSE Loss</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {linRes.mseLoss.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">R² Score</div>
                  <div className="text-base font-bold text-[#166534]">
                    {linRes.rSquared.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Grad ∂L/∂w</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {linRes.gradW.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">OLS Optimum (w*, b*)</div>
                  <div className="text-sm font-bold text-[#1D1819]">
                    ({linRes.wOpt.toFixed(1)}, {linRes.bOpt.toFixed(1)})
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSlopeW(linRes.wOpt);
                  setInterceptB(linRes.bOpt);
                }}
                className="px-3 py-1.5 rounded bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-bold text-[#166534] hover:bg-[#DCFCE7]"
              >
                Snap to Closed-Form OLS Solution (w* = ₹15/km, b* = ₹30 base fare)
              </button>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="lin-w-slider" className="font-bold text-[#1D1819]">
                      Per-Kilometer Rate / Slope (w)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">₹{slopeW.toFixed(1)}/km</span>
                  </div>
                  <input
                    id="lin-w-slider"
                    type="range"
                    min="5.0"
                    max="25.0"
                    step="0.5"
                    value={slopeW}
                    onChange={e => setSlopeW(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="lin-b-slider" className="font-bold text-[#1D1819]">
                      Base Meter Flag-Down / Intercept (b)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">₹{interceptB.toFixed(1)}</span>
                  </div>
                  <input
                    id="lin-b-slider"
                    type="range"
                    min="0.0"
                    max="50.0"
                    step="1.0"
                    value={interceptB}
                    onChange={e => setInterceptB(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1.2: LOGISTIC REGRESSION */}
        {activeTab === 'logreg' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Log-Odds z = wx+b</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {logRes.logit.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Probability σ(z)</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {(logRes.probability * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">BCE Loss (y=1)</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {logRes.bceLoss.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded">
                  <div className="text-[#166534]">Decision (p ≥ τ)</div>
                  <div className="text-base font-bold text-[#166534]">
                    Class {logRes.predictedClass}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="log-x-slider" className="font-bold text-[#1D1819]">
                      Morning Rain Intensity / Feature (x)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{rainLevelX.toFixed(1)}</span>
                  </div>
                  <input
                    id="log-x-slider"
                    type="range"
                    min="-2.0"
                    max="4.0"
                    step="0.2"
                    value={rainLevelX}
                    onChange={e => setRainLevelX(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="log-w-slider" className="font-bold text-[#1D1819]">
                      Rain Sensitivity / Weight (w)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{logWeightW.toFixed(1)}</span>
                  </div>
                  <input
                    id="log-w-slider"
                    type="range"
                    min="-1.0"
                    max="3.0"
                    step="0.2"
                    value={logWeightW}
                    onChange={e => setLogWeightW(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="log-tau-slider" className="font-bold text-[#1D1819]">
                      Classification Cutoff / Threshold (τ)
                    </label>
                    <span className="font-mono-num font-bold text-[#166534]">{thresholdTau.toFixed(2)}</span>
                  </div>
                  <input
                    id="log-tau-slider"
                    type="range"
                    min="0.10"
                    max="0.90"
                    step="0.05"
                    value={thresholdTau}
                    onChange={e => setThresholdTau(parseFloat(e.target.value))}
                    className="w-full accent-[#166534]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1.3: BIAS-VARIANCE */}
        {activeTab === 'biasvar' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Bias² (Underfit)</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {bvRes.biasSquared.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Variance (Overfit)</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {bvRes.variance.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Total Test Error</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {bvRes.expectedTestError.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FBF6EB] border border-[#E8D3A8] rounded">
                  <div className="text-[#8E6523]">Regime</div>
                  <div className="text-[11px] font-bold text-[#7A1C30] mt-1">
                    {bvRes.regime}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="bv-deg-slider" className="font-bold text-[#1D1819]">
                      Model Flexibility / Polynomial Degree (d)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{polyDegree.toFixed(1)}</span>
                  </div>
                  <input
                    id="bv-deg-slider"
                    type="range"
                    min="1.0"
                    max="9.0"
                    step="0.5"
                    value={polyDegree}
                    onChange={e => setPolyDegree(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="bv-noise-slider" className="font-bold text-[#1D1819]">
                      Irreducible Data Noise (σ_ε)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{noiseStd.toFixed(2)}</span>
                  </div>
                  <input
                    id="bv-noise-slider"
                    type="range"
                    min="0.10"
                    max="0.80"
                    step="0.05"
                    value={noiseStd}
                    onChange={e => setNoiseStd(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1.4: DECISION TREES & RANDOM FORESTS */}
        {activeTab === 'trees' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Parent Gini (10+,10-)</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {treeRes.parentGini.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Gini Gain ΔG</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    +{treeRes.giniGain.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Info Gain (Bits)</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    +{treeRes.informationGainBits.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded">
                  <div className="text-[#166534]">Forest Var Multiplier</div>
                  <div className="text-base font-bold text-[#166534]">
                    {treeRes.ensembleVarianceReductionFactor.toFixed(3)}×
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="tree-lpos-slider" className="font-bold text-[#1D1819]">
                      Left Branch Positives (out of 10)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{leftPos}</span>
                  </div>
                  <input
                    id="tree-lpos-slider"
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={leftPos}
                    onChange={e => setLeftPos(parseInt(e.target.value, 10))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="tree-b-slider" className="font-bold text-[#1D1819]">
                      Number of Friends Polled / Forest Trees (B)
                    </label>
                    <span className="font-mono-num font-bold text-[#166534]">{numTreesB}</span>
                  </div>
                  <input
                    id="tree-b-slider"
                    type="range"
                    min="1"
                    max="200"
                    step="5"
                    value={numTreesB}
                    onChange={e => setNumTreesB(parseInt(e.target.value, 10))}
                    className="w-full accent-[#166534]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1.5: K-MEANS & PCA */}
        {activeTab === 'kmeans-pca' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">k-Means Inertia J</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {kmPcaRes.inertia.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">PCA Eigenvalue λ₁</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {kmPcaRes.lambda1.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">PCA Eigenvalue λ₂</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {kmPcaRes.lambda2.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded">
                  <div className="text-[#166534]">PC1 Variance %</div>
                  <div className="text-base font-bold text-[#166534]">
                    {(kmPcaRes.explainedVarianceRatio1 * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="km-c0-slider" className="font-bold text-[#1D1819]">
                      Wedding Table 1 Center (μ₁_x)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{c0X.toFixed(2)}</span>
                  </div>
                  <input
                    id="km-c0-slider"
                    type="range"
                    min="-3.0"
                    max="0.5"
                    step="0.1"
                    value={c0X}
                    onChange={e => setC0X(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="km-c1-slider" className="font-bold text-[#1D1819]">
                      Wedding Table 2 Center (μ₂_x)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{c1X.toFixed(2)}</span>
                  </div>
                  <input
                    id="km-c1-slider"
                    type="range"
                    min="-0.5"
                    max="3.0"
                    step="0.1"
                    value={c1X}
                    onChange={e => setC1X(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
