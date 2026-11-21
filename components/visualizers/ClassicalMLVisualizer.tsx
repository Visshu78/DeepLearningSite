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

export type ClassicalMlTab = 'linreg' | 'logreg' | 'biasvar' | 'trees' | 'kmeans-pca' | 'knn-svm-nb';

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

  // 2.6 k-NN, SVM & Naive Bayes State
  const [queryX, setQueryX] = useState<number>(0.4);
  const [knnK, setKnnK] = useState<number>(3);
  const [svmMargin, setSvmMargin] = useState<number>(1.0);
  const knnSvmNbRes = useMemo(() => {
    const pts: { x: number; label: 'A' | 'B' }[] = [
      { x: -1.8, label: 'A' },
      { x: -1.0, label: 'A' },
      { x: -0.2, label: 'A' },
      { x: 0.3, label: 'B' },
      { x: 1.1, label: 'B' },
      { x: 1.9, label: 'B' },
    ];
    const sorted = [...pts]
      .map(p => ({ ...p, dist: Math.abs(queryX - p.x) }))
      .sort((a, b) => a.dist - b.dist);
    const neighbors = sorted.slice(0, knnK);
    const votesB = neighbors.filter(n => n.label === 'B').length;
    const knnPred = votesB > knnK / 2 ? 'Class B' : 'Class A';

    const wSvm = 2 / svmMargin;
    const svmScore = wSvm * queryX;
    const inMargin = Math.abs(svmScore) < 1;

    const sigma = 0.65;
    const llA = -0.5 * Math.pow((queryX - -1.0) / sigma, 2);
    const llB = -0.5 * Math.pow((queryX - 1.1) / sigma, 2);
    const pB = 1 / (1 + Math.exp(llA - llB));
    return { neighbors, votesB, knnPred, wSvm, svmScore, inMargin, pB };
  }, [queryX, knnK, svmMargin]);

  const tabs: { id: ClassicalMlTab; label: string }[] = [
    { id: 'linreg', label: '2.1 Linear Regression' },
    { id: 'logreg', label: '2.2 Logistic Regression' },
    { id: 'biasvar', label: '2.3 Bias-Variance' },
    { id: 'trees', label: '2.4 Trees & Forests' },
    { id: 'kmeans-pca', label: '2.5 k-Means & PCA' },
    { id: 'knn-svm-nb', label: '2.6 k-NN, SVM & NB' },
  ];

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl overflow-hidden shadow-xs">
      <div className="bg-[#FAF5EE] border-b border-[#EAE2D5] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LineChart className="w-4 h-4 text-[#7A1C30]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F191B]">
            Track 2 Classical Machine Learning &amp; Tabular Algorithms Workbench
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
              {/* Live OLS Scatter + Residuals SVG */}
              <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-3">
                <div className="flex justify-between items-center text-[11px] font-mono-num text-[#625956] mb-1.5">
                  <span>Auto-Rickshaw Scatter, Fitted Line &amp; Vertical Residuals (yᵢ - ŷᵢ)</span>
                  <span className="text-[#166534] font-semibold">Dashed Green = True OLS (15x + 30)</span>
                </div>
                <svg viewBox="0 0 460 210" className="w-full h-52 bg-white rounded border border-[#E8E2D9]">
                  {(() => {
                    const toX = (d: number) => 42 + (d / 9) * 395;
                    const toY = (fare: number) => 185 - ((fare - 20) / 150) * 165;
                    const y0Fit = slopeW * 0 + interceptB;
                    const y9Fit = slopeW * 9 + interceptB;
                    const y0Ols = linRes.wOpt * 0 + linRes.bOpt;
                    const y9Ols = linRes.wOpt * 9 + linRes.bOpt;
                    return (
                      <>
                        {/* Axes */}
                        <line x1="42" y1="185" x2="437" y2="185" stroke="#D6CCC0" strokeWidth="1.5" />
                        <line x1="42" y1="15" x2="42" y2="185" stroke="#D6CCC0" strokeWidth="1.5" />
                        <text x="240" y="203" textAnchor="middle" fontSize="10" fill="#625956">Distance x (km)</text>
                        <text x="16" y="100" textAnchor="middle" fontSize="10" fill="#625956" transform="rotate(-90 16 100)">Fare ₹</text>
                        {/* Closed-form OLS reference */}
                        <line x1={toX(0)} y1={toY(y0Ols)} x2={toX(9)} y2={toY(y9Ols)} stroke="#166534" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6" />
                        {/* Current fitted line */}
                        <line x1={toX(0)} y1={toY(y0Fit)} x2={toX(9)} y2={toY(y9Fit)} stroke="#7A1C30" strokeWidth="2.5" />
                        {/* Residuals and data points */}
                        {autoDistances.map((d, i) => {
                          const yTrue = autoFares[i];
                          const yPred = slopeW * d + interceptB;
                          return (
                            <g key={i}>
                              <line
                                x1={toX(d)}
                                y1={toY(yTrue)}
                                x2={toX(d)}
                                y2={toY(yPred)}
                                stroke="#C28E38"
                                strokeWidth="2"
                                strokeDasharray="2,2"
                              />
                              <circle cx={toX(d)} cy={toY(yTrue)} r="5" fill="#1D1819" stroke="#FFFFFF" strokeWidth="1.5" />
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>

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
              {/* Live Sigmoid S-Curve & Threshold SVG */}
              <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-3">
                <div className="flex justify-between items-center text-[11px] font-mono-num text-[#625956] mb-1.5">
                  <span>Logistic Sigmoid Curve σ(wx - 1) &amp; Decision Threshold τ</span>
                  <span className="text-[#166534] font-semibold">τ = {(thresholdTau * 100).toFixed(0)}%</span>
                </div>
                <svg viewBox="0 0 460 190" className="w-full h-48 bg-white rounded border border-[#E8E2D9]">
                  {(() => {
                    const toX = (x: number) => 40 + ((x + 2) / 6) * 395;
                    const toY = (p: number) => 165 - p * 140;
                    const pts: string[] = [];
                    for (let i = 0; i <= 60; i++) {
                      const x = -2 + (i / 60) * 6;
                      const z = logWeightW * x - 1.0;
                      const p = 1 / (1 + Math.exp(-z));
                      pts.push(`${toX(x).toFixed(1)},${toY(p).toFixed(1)}`);
                    }
                    const tauY = toY(thresholdTau);
                    const ptX = toX(rainLevelX);
                    const ptY = toY(logRes.probability);
                    return (
                      <>
                        <line x1="40" y1="165" x2="435" y2="165" stroke="#D6CCC0" strokeWidth="1.5" />
                        <line x1="40" y1="20" x2="40" y2="165" stroke="#D6CCC0" strokeWidth="1.5" />
                        <line x1="40" y1={tauY} x2="435" y2={tauY} stroke="#166534" strokeWidth="1.5" strokeDasharray="4,3" />
                        <text x="430" y={tauY - 4} textAnchor="end" fontSize="9" fontWeight="bold" fill="#166534">
                          Threshold τ = {thresholdTau.toFixed(2)}
                        </text>
                        <polyline points={pts.join(' ')} fill="none" stroke="#7A1C30" strokeWidth="2.5" />
                        <circle cx={ptX} cy={ptY} r="6" fill="#7A1C30" stroke="#FFFFFF" strokeWidth="2" />
                        <text x={Math.min(390, Math.max(85, ptX))} y={Math.max(20, ptY - 10)} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#7A1C30">
                          p = {(logRes.probability * 100).toFixed(1)}%
                        </text>
                        <text x="240" y="182" textAnchor="middle" fontSize="10" fill="#625956">Rain Intensity x (-2 to +4)</text>
                      </>
                    );
                  })()}
                </svg>
              </div>

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
              {/* Live U-Shaped Bias-Variance Curve SVG */}
              <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-3">
                <div className="flex justify-between items-center text-[11px] font-mono-num text-[#625956] mb-1.5">
                  <span>U-Shaped Bias-Variance Tradeoff Across Polynomial Degree (d = 1..9)</span>
                  <span className="text-[#7A1C30] font-semibold">Current d = {polyDegree.toFixed(1)}</span>
                </div>
                <svg viewBox="0 0 460 190" className="w-full h-48 bg-white rounded border border-[#E8E2D9]">
                  {(() => {
                    const toX = (d: number) => 40 + ((d - 1) / 8) * 395;
                    const maxErr = 2.2;
                    const toY = (e: number) => 165 - Math.min(1, e / maxErr) * 140;
                    const biasPts: string[] = [];
                    const varPts: string[] = [];
                    const totPts: string[] = [];
                    for (let i = 0; i <= 32; i++) {
                      const d = 1 + (i / 32) * 8;
                      const res = computeBiasVarianceDecomposition(d, noiseStd);
                      biasPts.push(`${toX(d).toFixed(1)},${toY(res.biasSquared).toFixed(1)}`);
                      varPts.push(`${toX(d).toFixed(1)},${toY(res.variance).toFixed(1)}`);
                      totPts.push(`${toX(d).toFixed(1)},${toY(res.expectedTestError).toFixed(1)}`);
                    }
                    const curX = toX(polyDegree);
                    return (
                      <>
                        <line x1="40" y1="165" x2="435" y2="165" stroke="#D6CCC0" strokeWidth="1.5" />
                        <line x1="40" y1="20" x2="40" y2="165" stroke="#D6CCC0" strokeWidth="1.5" />
                        <line x1={curX} y1="20" x2={curX} y2="165" stroke="#1D1819" strokeWidth="1.5" strokeDasharray="3,3" />
                        <polyline points={biasPts.join(' ')} fill="none" stroke="#7A1C30" strokeWidth="2" strokeDasharray="4,2" />
                        <polyline points={varPts.join(' ')} fill="none" stroke="#C28E38" strokeWidth="2" strokeDasharray="4,2" />
                        <polyline points={totPts.join(' ')} fill="none" stroke="#1D1819" strokeWidth="2.5" />
                        <circle cx={curX} cy={toY(bvRes.expectedTestError)} r="5.5" fill="#1D1819" stroke="#FFFFFF" strokeWidth="1.5" />
                        <text x="60" y="34" fontSize="9" fontWeight="bold" fill="#7A1C30">--- Bias²</text>
                        <text x="115" y="34" fontSize="9" fontWeight="bold" fill="#C28E38">--- Variance</text>
                        <text x="180" y="34" fontSize="9" fontWeight="bold" fill="#1D1819">━━ Total Error</text>
                        <text x="240" y="182" textAnchor="middle" fontSize="10" fill="#625956">Model Complexity / Degree (d)</text>
                      </>
                    );
                  })()}
                </svg>
              </div>

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
              {/* Live Decision Tree Split & Purity Diagram SVG */}
              <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-3">
                <div className="flex justify-between items-center text-[11px] font-mono-num text-[#625956] mb-1.5">
                  <span>CART Binary Split Tree &amp; Child Node Class Purity</span>
                  <span className="text-[#7A1C30] font-semibold">ΔG = +{treeRes.giniGain.toFixed(3)}</span>
                </div>
                <svg viewBox="0 0 460 175" className="w-full h-44 bg-white rounded border border-[#E8E2D9]">
                  {/* Edges */}
                  <line x1="230" y1="54" x2="120" y2="105" stroke="#968A86" strokeWidth="2" />
                  <line x1="230" y1="54" x2="340" y2="105" stroke="#968A86" strokeWidth="2" />
                  {/* Root Node */}
                  <rect x="155" y="14" width="150" height="42" rx="6" fill="#FAF5EE" stroke="#C28E38" strokeWidth="1.5" />
                  <text x="230" y="31" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1D1819">Root: 10+ / 10-</text>
                  <text x="230" y="46" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#7A1C30">Gini = {treeRes.parentGini.toFixed(3)}</text>
                  {/* Left Child */}
                  <rect x="45" y="105" width="150" height="52" rx="6" fill="#F0FDF4" stroke="#166534" strokeWidth="1.5" />
                  <text x="120" y="123" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#166534">Left: {leftPos}+ / {leftNeg}-</text>
                  <rect x="65" y="133" width="110" height="8" rx="2" fill="#E8E2D9" />
                  <rect x="65" y="133" width={(leftPos / (leftPos + leftNeg)) * 110} height="8" rx="2" fill="#166534" />
                  {/* Right Child */}
                  <rect x="265" y="105" width="150" height="52" rx="6" fill="#FDF2F2" stroke="#7A1C30" strokeWidth="1.5" />
                  <text x="340" y="123" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7A1C30">Right: {10 - leftPos}+ / {10 - leftNeg}-</text>
                  <rect x="285" y="133" width="110" height="8" rx="2" fill="#E8E2D9" />
                  <rect x="285" y="133" width={((10 - leftPos) / (20 - leftPos - leftNeg)) * 110} height="8" rx="2" fill="#7A1C30" />
                </svg>
              </div>

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
              {/* Live 2D k-Means Clusters + PCA Axes SVG */}
              <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-3">
                <div className="flex justify-between items-center text-[11px] font-mono-num text-[#625956] mb-1.5">
                  <span>2D Cluster Assignment &amp; Centroids (★) + Top PCA Axis</span>
                  <span className="text-[#166534] font-semibold">PC1 captures {(kmPcaRes.explainedVarianceRatio1 * 100).toFixed(1)}% var</span>
                </div>
                <svg viewBox="0 0 460 200" className="w-full h-48 bg-white rounded border border-[#E8E2D9]">
                  {(() => {
                    const toX = (x: number) => 230 + x * 62;
                    const toY = (y: number) => 100 - y * 36;
                    const c0: [number, number] = [c0X, -1.3];
                    const c1: [number, number] = [c1X, 1.5];
                    return (
                      <>
                        <line x1="230" y1="10" x2="230" y2="190" stroke="#E8E2D9" strokeWidth="1" />
                        <line x1="20" y1="100" x2="440" y2="100" stroke="#E8E2D9" strokeWidth="1" />
                        {/* PC1 Principal Axis */}
                        <line
                          x1={toX(-kmPcaRes.principalAxis1[0] * 2.8)}
                          y1={toY(-kmPcaRes.principalAxis1[1] * 2.8)}
                          x2={toX(kmPcaRes.principalAxis1[0] * 2.8)}
                          y2={toY(kmPcaRes.principalAxis1[1] * 2.8)}
                          stroke="#166534"
                          strokeWidth="2"
                          strokeDasharray="5,3"
                        />
                        {/* Guest points & assignment lines */}
                        {sampleGuests.map(([gx, gy], idx) => {
                          const d0 = (gx - c0[0]) ** 2 + (gy - c0[1]) ** 2;
                          const d1 = (gx - c1[0]) ** 2 + (gy - c1[1]) ** 2;
                          const target = d0 <= d1 ? c0 : c1;
                          const col = d0 <= d1 ? '#7A1C30' : '#C28E38';
                          return (
                            <g key={idx}>
                              <line x1={toX(gx)} y1={toY(gy)} x2={toX(target[0])} y2={toY(target[1])} stroke={col} strokeWidth="1.5" strokeDasharray="3,2" opacity="0.7" />
                              <circle cx={toX(gx)} cy={toY(gy)} r="5" fill={col} stroke="#FFFFFF" strokeWidth="1.5" />
                            </g>
                          );
                        })}
                        {/* Centroids */}
                        <circle cx={toX(c0[0])} cy={toY(c0[1])} r="7" fill="#7A1C30" stroke="#1D1819" strokeWidth="2" />
                        <text x={toX(c0[0])} y={toY(c0[1]) + 17} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#7A1C30">μ₁</text>
                        <circle cx={toX(c1[0])} cy={toY(c1[1])} r="7" fill="#C28E38" stroke="#1D1819" strokeWidth="2" />
                        <text x={toX(c1[0])} y={toY(c1[1]) - 11} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#C28E38">μ₂</text>
                      </>
                    );
                  })()}
                </svg>
              </div>

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

        {/* TAB 2.6: k-NN, SVM & NAIVE BAYES */}
        {activeTab === 'knn-svm-nb' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">k-NN (k={knnK})</div>
                  <div className="text-base font-bold text-[#7A1C30]">{knnSvmNbRes.knnPred}</div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">SVM Score w·x</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {knnSvmNbRes.svmScore.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Margin 2/||w||</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {svmMargin.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Naive Bayes P(B|x)</div>
                  <div className="text-base font-bold text-[#166534]">
                    {(knnSvmNbRes.pB * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg text-xs text-[#5C4E4F] space-y-1">
                <div>
                  <strong>k-NN Nearest Neighbors:</strong>{' '}
                  {knnSvmNbRes.neighbors.map(n => `${n.label}(${n.x.toFixed(1)}, d=${n.dist.toFixed(2)})`).join(', ')}
                </div>
                <div>
                  <strong>SVM Margin Status:</strong>{' '}
                  {knnSvmNbRes.inMargin
                    ? 'Inside margin street (|w·x| < 1)'
                    : 'Outside margin street (|w·x| ≥ 1)'}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="knn-x-slider" className="font-bold text-[#1D1819]">
                      Query Point (x)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{queryX.toFixed(2)}</span>
                  </div>
                  <input
                    id="knn-x-slider"
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.1"
                    value={queryX}
                    onChange={e => setQueryX(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="knn-k-slider" className="font-bold text-[#1D1819]">
                      Neighbors (k)
                    </label>
                    <span className="font-mono-num font-bold text-[#166534]">{knnK}</span>
                  </div>
                  <input
                    id="knn-k-slider"
                    type="range"
                    min="1"
                    max="5"
                    step="2"
                    value={knnK}
                    onChange={e => setKnnK(parseInt(e.target.value, 10))}
                    className="w-full accent-[#166534]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="svm-m-slider" className="font-bold text-[#1D1819]">
                      SVM Margin Width (2/||w||)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{svmMargin.toFixed(2)}</span>
                  </div>
                  <input
                    id="svm-m-slider"
                    type="range"
                    min="0.4"
                    max="2.0"
                    step="0.2"
                    value={svmMargin}
                    onChange={e => setSvmMargin(parseFloat(e.target.value))}
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
