'use client';

import React, { useState, useMemo } from 'react';
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
  compareEncodingExplosion,
  type ImputationStrategy,
  type ScalingMethod,
} from '@/lib/math/dataPrep';
import { AlertTriangle, CheckCircle2, Database } from 'lucide-react';

export type DataPrepTab =
  | 'eda'
  | 'missing-outliers'
  | 'scaling'
  | 'encoding'
  | 'leakage'
  | 'imbalance'
  | 'pipelines';

interface DataPrepVisualizerProps {
  defaultTab?: DataPrepTab;
}

export function DataPrepVisualizer({ defaultTab = 'eda' }: DataPrepVisualizerProps) {
  const [activeTab, setActiveTab] = useState<DataPrepTab>(defaultTab);

  // 9.1 EDA State: Hostel food / rent survey with controllable outlier bill
  const [edaSpikeBill, setEdaSpikeBill] = useState<number>(65);
  const edaDataset = useMemo(
    () => [12, 14, 15, 16, 18, 19, 20, 22, 24, edaSpikeBill],
    [edaSpikeBill]
  );
  const edaStats = useMemo(() => computeSummaryStats(edaDataset), [edaDataset]);

  // 9.2 Missing & Outlier State
  const [iqrMultiplier, setIqrMultiplier] = useState<number>(1.5);
  const [imputeStrategy, setImputeStrategy] = useState<ImputationStrategy>('median');
  const rawAttendanceIncomes: (number | null)[] = useMemo(
    () => [18, null, 21, 22, null, 25, 27, 140],
    []
  );
  const imputationResult = useMemo(
    () => imputeColumnWithIndicator(rawAttendanceIncomes, imputeStrategy),
    [rawAttendanceIncomes, imputeStrategy]
  );
  const outlierResult = useMemo(
    () =>
      analyzeOutliers(
        imputationResult.rows.map(r => r.imputed),
        iqrMultiplier,
        2.0
      ),
    [imputationResult, iqrMultiplier]
  );

  // 9.3 Scaling State
  const [scalingMethod, setScalingMethod] = useState<ScalingMethod>('zscore');
  const [outlierRoomRent, setOutlierRoomRent] = useState<number>(95);
  const rawRents = useMemo(
    () => [10, 14, 18, 22, 26, 30, outlierRoomRent],
    [outlierRoomRent]
  );
  const scaledRents = useMemo(
    () => scaleFeatureVector(rawRents, scalingMethod),
    [rawRents, scalingMethod]
  );

  // 9.4 Categorical Encoding State
  const [smoothingM, setSmoothingM] = useState<number>(5);
  const [encodingCardinalityK, setEncodingCardinalityK] = useState<number>(500);
  const encodingExplosion = useMemo(
    () => compareEncodingExplosion(encodingCardinalityK, 32),
    [encodingCardinalityK]
  );
  const cityOrders = useMemo(
    () => [
      { category: 'Bengaluru (n=6)', target: 1 },
      { category: 'Bengaluru (n=6)', target: 1 },
      { category: 'Bengaluru (n=6)', target: 1 },
      { category: 'Bengaluru (n=6)', target: 0 },
      { category: 'Bengaluru (n=6)', target: 0 },
      { category: 'Bengaluru (n=6)', target: 0 },
      { category: 'Pune (n=4)', target: 1 },
      { category: 'Pune (n=4)', target: 0 },
      { category: 'Pune (n=4)', target: 0 },
      { category: 'Pune (n=4)', target: 0 },
      { category: 'NewPinCode (n=1)', target: 1 },
    ],
    []
  );
  const targetEncodingResult = useMemo(
    () => computeSmoothedTargetEncoding(cityOrders, smoothingM),
    [cityOrders, smoothingM]
  );

  // 9.5 Leakage State
  const [testOutlierMagnitude, setTestOutlierMagnitude] = useState<number>(180);
  const trainMarks = useMemo(() => [50, 55, 60, 65, 70], []);
  const testMarks = useMemo(() => [58, 64, testOutlierMagnitude], [testOutlierMagnitude]);
  const leakageResult = useMemo(
    () => compareCleanVsLeakedScaling(trainMarks, testMarks),
    [trainMarks, testMarks]
  );

  // 9.6 Class Imbalance State
  const [minorityCount, setMinorityCount] = useState<number>(20);
  const [smoteLambda, setSmoteLambda] = useState<number>(0.45);
  const majorityCount = 980;
  const classWeights = useMemo(
    () => computeBalancedClassWeights(majorityCount, minorityCount),
    [majorityCount, minorityCount]
  );
  const weightedBceSample = useMemo(
    () => computeWeightedBCE(1, 0.2, classWeights.wPositive, classWeights.wNegative),
    [classWeights]
  );
  const unweightedBceSample = useMemo(
    () => computeWeightedBCE(1, 0.2, 1.0, 1.0),
    []
  );
  const smotePoint = useMemo(
    () => generateSmotePoint([2.0, 2.5], [7.0, 6.5], smoteLambda),
    [smoteLambda]
  );

  // 9.7 Feature Engineering & Cyclical Time State
  const [hourOfDay, setHourOfDay] = useState<number>(22);
  const cyclicalHour = useMemo(
    () => computeCyclicalEncoding(hourOfDay, 24),
    [hourOfDay]
  );

  const tabs: { id: DataPrepTab; label: string }[] = [
    { id: 'eda', label: '9.1 EDA' },
    { id: 'missing-outliers', label: '9.2 Missing' },
    { id: 'scaling', label: '9.3 Scaling' },
    { id: 'encoding', label: '9.4 Encoding' },
    { id: 'leakage', label: '9.5 Leakage' },
    { id: 'imbalance', label: '9.6 Imbalance' },
    { id: 'pipelines', label: '9.7 Pipelines' },
  ];

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl overflow-hidden shadow-xs">
      {/* Top Toolbar */}
      <div className="bg-[#FAF5EE] border-b border-[#EAE2D5] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#7A1C30]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F191B]">
            Track 9 Data Preparation &amp; Feature Engineering Workbench
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
        {/* TAB 9.1: EDA */}
        {activeTab === 'eda' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1D1819]">
                    Distribution of 10 Student Monthly Mess Bills (₹ in thousands)
                  </span>
                  <span className="font-mono-num text-[#7A1C30] font-semibold">
                    Skewness γ₁ = {edaStats.skewness.toFixed(2)}
                  </span>
                </div>

                <svg viewBox="0 0 460 170" className="w-full h-auto select-none">
                  <line x1="25" y1="130" x2="435" y2="130" stroke="#D6CCC0" strokeWidth="2" />
                  {/* IQR Box */}
                  {(() => {
                    const scaleX = (v: number) => 25 + ((v - 10) / 140) * 410;
                    const q1X = scaleX(edaStats.q1);
                    const q3X = scaleX(edaStats.q3);
                    const medX = scaleX(edaStats.median);
                    const meanX = scaleX(edaStats.mean);

                    return (
                      <>
                        <rect
                          x={q1X}
                          y="45"
                          width={Math.max(4, q3X - q1X)}
                          height="50"
                          rx="4"
                          fill="#FAF2E6"
                          stroke="#C28E38"
                          strokeWidth="2"
                        />
                        {/* Median Line */}
                        <line x1={medX} y1="35" x2={medX} y2="105" stroke="#166534" strokeWidth="3" />
                        <text x={medX} y="27" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#166534">
                          Median={edaStats.median.toFixed(1)}
                        </text>

                        {/* Mean Line */}
                        <line
                          x1={meanX}
                          y1="35"
                          x2={meanX}
                          y2="105"
                          stroke="#7A1C30"
                          strokeWidth="2.5"
                          strokeDasharray="4,2"
                        />
                        <text x={meanX} y="118" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7A1C30">
                          Mean μ={edaStats.mean.toFixed(1)}
                        </text>

                        {/* Individual Student Points */}
                        {edaDataset.map((val, idx) => (
                          <circle
                            key={idx}
                            cx={scaleX(val)}
                            cy="130"
                            r={idx === edaDataset.length - 1 ? 6 : 4.5}
                            fill={idx === edaDataset.length - 1 ? '#7A1C30' : '#1D1819'}
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                          />
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FBF6EB] border border-[#E8D3A8] text-xs text-[#4A3B3E] leading-relaxed">
                <strong>EDA Insight:</strong> Watch how dragging the 10th student&apos;s bill pulls the{' '}
                <strong className="text-[#7A1C30]">Mean (μ)</strong> and{' '}
                <strong className="text-[#7A1C30]">Standard Deviation (σ)</strong> toward the outlier, while the{' '}
                <strong className="text-[#166534]">Median (Q₂)</strong> and{' '}
                <strong>Interquartile Range (IQR)</strong> stay completely anchored!
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="eda-spike-slider" className="font-bold text-[#1D1819]">
                    10th Student&apos;s Bill / Extreme Value (x₁₀)
                  </label>
                  <span className="font-mono-num font-bold text-[#7A1C30]">₹{edaSpikeBill}k</span>
                </div>
                <input
                  id="eda-spike-slider"
                  type="range"
                  min="24"
                  max="140"
                  step="2"
                  value={edaSpikeBill}
                  onChange={e => setEdaSpikeBill(parseFloat(e.target.value))}
                  className="w-full accent-[#7A1C30]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono-num">
                <div className="p-3 rounded border border-[#EAE2D5] bg-white">
                  <div className="text-[#786970]">Mean (μ)</div>
                  <div className="text-base font-bold text-[#7A1C30]">{edaStats.mean.toFixed(2)}</div>
                </div>
                <div className="p-3 rounded border border-[#EAE2D5] bg-white">
                  <div className="text-[#786970]">Median (Q₂)</div>
                  <div className="text-base font-bold text-[#166534]">{edaStats.median.toFixed(2)}</div>
                </div>
                <div className="p-3 rounded border border-[#EAE2D5] bg-white">
                  <div className="text-[#786970]">Std Dev (σ)</div>
                  <div className="text-base font-bold text-[#1D1819]">{edaStats.stdDev.toFixed(2)}</div>
                </div>
                <div className="p-3 rounded border border-[#EAE2D5] bg-white">
                  <div className="text-[#786970]">IQR (Q₃ - Q₁)</div>
                  <div className="text-base font-bold text-[#C28E38]">{edaStats.iqr.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9.2: MISSING DATA & OUTLIERS */}
        {activeTab === 'missing-outliers' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              {/* Visual Tukey IQR Fence & Winsorization Plot */}
              <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-3">
                <div className="flex justify-between items-center text-[11px] font-mono-num text-[#625956] mb-1.5">
                  <span>Tukey IQR Fence &amp; Winsorization Strip (₹0k – ₹150k)</span>
                  <span className="text-[#7A1C30] font-semibold">Upper Fence = ₹{outlierResult.upperFence.toFixed(1)}k</span>
                </div>
                <svg viewBox="0 0 500 95" className="w-full h-24 bg-white rounded border border-[#E8E2D9]">
                  {(() => {
                    const imputedStats = computeSummaryStats(imputationResult.rows.map(r => r.imputed));
                    const toX = (v: number) => 24 + (Math.min(150, Math.max(0, v)) / 150) * 452;
                    const fenceX = toX(outlierResult.upperFence);
                    const q1X = toX(imputedStats.q1);
                    const q3X = toX(imputedStats.q3);
                    return (
                      <>
                        <line x1="24" y1="55" x2="476" y2="55" stroke="#D6CCC0" strokeWidth="1.5" />
                        <rect x={q1X} y="38" width={Math.max(4, q3X - q1X)} height="34" rx="3" fill="#FAF2E6" stroke="#C28E38" strokeWidth="1.5" />
                        <line x1={fenceX} y1="15" x2={fenceX} y2="80" stroke="#991B1B" strokeWidth="2" strokeDasharray="4,2" />
                        <text x={Math.min(440, fenceX)} y="12" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#991B1B">
                          Fence ({outlierResult.upperFence.toFixed(1)}k)
                        </text>
                        {imputationResult.rows.map((row, idx) => {
                          const outPt = outlierResult.points[idx];
                          const rawX = toX(row.imputed);
                          const clipX = toX(outPt.clippedIqrValue);
                          return (
                            <g key={idx}>
                              {outPt.isIqrOutlier && (
                                <line x1={rawX} y1="55" x2={clipX} y2="55" stroke="#7A1C30" strokeWidth="2" strokeDasharray="2,2" />
                              )}
                              <circle
                                cx={rawX}
                                cy={row.wasMissing ? 42 : 55}
                                r={outPt.isIqrOutlier ? 5.5 : 4}
                                fill={row.wasMissing ? '#C28E38' : outPt.isIqrOutlier ? '#991B1B' : '#1D1819'}
                                stroke="#FFFFFF"
                                strokeWidth="1"
                              />
                              {outPt.isIqrOutlier && (
                                <circle cx={clipX} cy="55" r="4.5" fill="#166534" stroke="#FFFFFF" strokeWidth="1" />
                              )}
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="overflow-x-auto border border-[#E8E2D9] rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF5EE] border-b border-[#E8E2D9] font-mono-num text-[#6E1A2B]">
                      <th className="py-2.5 px-3">Row</th>
                      <th className="py-2.5 px-3">Raw Income (x)</th>
                      <th className="py-2.5 px-3">Imputed (x̂)</th>
                      <th className="py-2.5 px-3">Missing Flag (m)</th>
                      <th className="py-2.5 px-3">IQR Outlier?</th>
                      <th className="py-2.5 px-3">Winsorized / Clipped</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFEAE2] font-mono-num">
                    {imputationResult.rows.map((row, idx) => {
                      const outPt = outlierResult.points[idx];
                      return (
                        <tr key={idx} className={row.wasMissing ? 'bg-[#FBF6EB]' : ''}>
                          <td className="py-2 px-3 font-bold">#{idx + 1}</td>
                          <td className="py-2 px-3">
                            {row.original === null ? (
                              <span className="text-[#991B1B] font-bold">NaN (Blank)</span>
                            ) : (
                              `₹${row.original}k`
                            )}
                          </td>
                          <td className="py-2 px-3 font-bold text-[#7A1C30]">
                            ₹{row.imputed.toFixed(1)}k
                          </td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-1.5 py-0.5 rounded font-bold ${
                                row.wasMissing
                                  ? 'bg-[#7A1C30] text-white'
                                  : 'bg-[#F4EFEB] text-[#625956]'
                              }`}
                            >
                              m={row.wasMissing}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            {outPt.isIqrOutlier ? (
                              <span className="text-[#991B1B] font-bold">Yes (&gt;{outlierResult.upperFence.toFixed(1)})</span>
                            ) : (
                              <span className="text-[#166534]">Normal</span>
                            )}
                          </td>
                          <td className="py-2 px-3 font-semibold">
                            ₹{outPt.clippedIqrValue.toFixed(1)}k
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label htmlFor="iqr-fence-slider" className="font-bold text-[#1D1819]">
                      Fence Width / Tukey Multiplier (k)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">k = {iqrMultiplier.toFixed(1)}</span>
                  </div>
                  <input
                    id="iqr-fence-slider"
                    type="range"
                    min="1.0"
                    max="3.0"
                    step="0.1"
                    value={iqrMultiplier}
                    onChange={e => setIqrMultiplier(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-[#1D1819] block">
                    Blank-Cell Fill Rule / Imputation Strategy:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['median', 'mean', 'zero'] as ImputationStrategy[]).map(strat => (
                      <button
                        key={strat}
                        type="button"
                        onClick={() => setImputeStrategy(strat)}
                        className={`py-1.5 rounded text-xs font-semibold capitalize border ${
                          imputeStrategy === strat
                            ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                            : 'bg-white text-[#54484E] border-[#EAE2D5]'
                        }`}
                      >
                        {strat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-[#E8E2D9] text-xs space-y-1.5 font-mono-num">
                <div className="flex justify-between">
                  <span className="text-[#54484E]">Fill Value ({imputeStrategy}):</span>
                  <strong className="text-[#7A1C30]">₹{imputationResult.fillValue.toFixed(2)}k</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#54484E]">Upper Fence Q₃ + k·IQR:</span>
                  <strong>₹{outlierResult.upperFence.toFixed(2)}k</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9.3: FEATURE SCALING */}
        {activeTab === 'scaling' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1D1819]">Raw vs Scaled Feature Values</span>
                  <span className="font-mono-num text-[#7A1C30] font-semibold">
                    {scaledRents.formulaLabel}
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center font-mono-num text-xs">
                  {rawRents.map((raw, i) => (
                    <div key={i} className="bg-white border border-[#E8E2D9] rounded p-2 space-y-1">
                      <div className="text-[10px] text-[#786970]">Raw ₹{raw}k</div>
                      <div className="font-bold text-[#7A1C30]">
                        {scaledRents.scaled[i].toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Visual 1D Compression Strip */}
                <div className="pt-1">
                  <div className="text-[11px] text-[#625956] mb-1">
                    Normalized Coordinate Strip (6 normal rooms in dark/gold vs outlier x₇ in wine):
                  </div>
                  <svg viewBox="0 0 500 72" className="w-full h-18 bg-white rounded border border-[#E8E2D9]">
                    {(() => {
                      const minS = Math.min(...scaledRents.scaled);
                      const maxS = Math.max(...scaledRents.scaled);
                      const span = Math.max(1e-6, maxS - minS);
                      const toX = (v: number) => 28 + ((v - minS) / span) * 444;
                      return (
                        <>
                          <line x1="28" y1="36" x2="472" y2="36" stroke="#D6CCC0" strokeWidth="1.5" />
                          {scaledRents.scaled.map((val, i) => {
                            const isOutlier = i === scaledRents.scaled.length - 1;
                            const cx = toX(val);
                            return (
                              <g key={i}>
                                <circle
                                  cx={cx}
                                  cy="36"
                                  r={isOutlier ? 6.5 : 4.5}
                                  fill={isOutlier ? '#7A1C30' : '#C28E38'}
                                  stroke="#FFFFFF"
                                  strokeWidth="1.5"
                                />
                                {(i === 0 || i === 5 || isOutlier) && (
                                  <text x={cx} y={isOutlier ? 20 : 58} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={isOutlier ? '#7A1C30' : '#4A3B3E'}>
                                    {val.toFixed(2)}
                                  </text>
                                )}
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FBF6EB] border border-[#E8D3A8] text-xs text-[#4A3B3E] leading-relaxed">
                <strong>Notice the Outlier Compression:</strong> When the 7th apartment rent is a massive outlier (₹{outlierRoomRent}k),{' '}
                <strong>Min-Max Scaling</strong> squashes all 6 normal student rooms into a tiny sliver near 0, whereas{' '}
                <strong>RobustScaler (Median / IQR)</strong> keeps normal rooms well-separated!
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="scaling-outlier-slider" className="font-bold text-[#1D1819]">
                    Penthouse Rent Outlier / Max Value (x₇)
                  </label>
                  <span className="font-mono-num font-bold text-[#7A1C30]">₹{outlierRoomRent}k</span>
                </div>
                <input
                  id="scaling-outlier-slider"
                  type="range"
                  min="35"
                  max="250"
                  step="5"
                  value={outlierRoomRent}
                  onChange={e => setOutlierRoomRent(parseFloat(e.target.value))}
                  className="w-full accent-[#7A1C30]"
                />

                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-[#1D1819] block">
                    Yardstick Transform / Scaling Formula:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(
                      [
                        { id: 'zscore', name: 'Z-Score (μ, σ)' },
                        { id: 'minmax', name: 'Min-Max [0, 1]' },
                        { id: 'robust', name: 'Robust (IQR)' },
                        { id: 'log1p', name: 'Log1p ln(1+x)' },
                      ] as const
                    ).map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setScalingMethod(m.id)}
                        className={`py-1.5 px-2 rounded text-xs font-semibold border ${
                          scalingMethod === m.id
                            ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                            : 'bg-white text-[#54484E] border-[#EAE2D5]'
                        }`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9.4: CATEGORICAL ENCODING */}
        {activeTab === 'encoding' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="overflow-x-auto border border-[#E8E2D9] rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF5EE] border-b border-[#E8E2D9] font-mono-num text-[#6E1A2B]">
                      <th className="py-2.5 px-3">City / PIN Category (c)</th>
                      <th className="py-2.5 px-3">Sample Count (n_c)</th>
                      <th className="py-2.5 px-3">Raw Target Mean (ȳ_c)</th>
                      <th className="py-2.5 px-3">Smoothed Encoding (ŷ_c)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFEAE2] font-mono-num">
                    {targetEncodingResult.categories.map(cat => (
                      <tr key={cat.category}>
                        <td className="py-2.5 px-3 font-bold text-[#1D1819]">{cat.category}</td>
                        <td className="py-2.5 px-3">{cat.count}</td>
                        <td className="py-2.5 px-3 text-[#8E6523]">{cat.rawCategoryMean.toFixed(3)}</td>
                        <td className="py-2.5 px-3 font-bold text-[#7A1C30]">
                          {cat.smoothedEncoding.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3.5 rounded-lg bg-[#FBF6EB] border border-[#E8D3A8] text-xs text-[#4A3B3E]">
                <strong>Why Smoothed Target Encoding Prevents Overfitting:</strong>{' '}
                <code>NewPinCode (n=1)</code> had 1 order that happened to be positive (raw mean = 1.000). Increasing the smoothing weight <code>m</code> pulls that noisy 1-sample category toward the global average ({targetEncodingResult.globalMean.toFixed(3)}).
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="encoding-m-slider" className="font-bold text-[#1D1819]">
                    Skepticism Prior / Smoothing Weight (m)
                  </label>
                  <span className="font-mono-num font-bold text-[#7A1C30]">m = {smoothingM}</span>
                </div>
                <input
                  id="encoding-m-slider"
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={smoothingM}
                  onChange={e => setSmoothingM(parseFloat(e.target.value))}
                  className="w-full accent-[#7A1C30]"
                />
                <p className="text-[11px] text-[#54484E]">
                  At m = 0, encoding equals raw category mean (memorizing rare categories). At m = 10, a category needs 10 samples to get 50% weight against the global mean.
                </p>
              </div>

              {/* Cardinality Explosion Bar Comparison */}
              <div className="bg-white border border-[#E8E2D9] rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="cardinality-k-slider" className="font-bold text-[#1D1819]">
                    Unique Categories (K)
                  </label>
                  <span className="font-mono-num font-bold text-[#7A1C30]">K = {encodingCardinalityK.toLocaleString()}</span>
                </div>
                <input
                  id="cardinality-k-slider"
                  type="range"
                  min="4"
                  max="10000"
                  step="50"
                  value={encodingCardinalityK}
                  onChange={e => setEncodingCardinalityK(parseInt(e.target.value, 10))}
                  className="w-full accent-[#7A1C30]"
                />
                <div className="space-y-1.5 pt-1 text-[10px] font-mono-num">
                  {[
                    { label: 'One-Hot', count: encodingExplosion.oneHotColumns, color: 'bg-[#7A1C30]' },
                    { label: 'Hashing', count: encodingExplosion.hashingColumns, color: 'bg-[#C28E38]' },
                    { label: 'Binary', count: encodingExplosion.binaryColumns, color: 'bg-[#1D4E35]' },
                    { label: 'Target', count: encodingExplosion.targetEncodingColumns, color: 'bg-[#1D1819]' },
                  ].map(bar => {
                    const widthPct = Math.max(
                      3,
                      (Math.log10(Math.max(1, bar.count)) / Math.log10(Math.max(10, encodingExplosion.oneHotColumns))) * 100
                    );
                    return (
                      <div key={bar.label} className="flex items-center gap-2">
                        <span className="w-14 text-[#54484E]">{bar.label}</span>
                        <div className="flex-1 h-2.5 bg-[#F4EFEB] rounded overflow-hidden">
                          <div style={{ width: `${widthPct}%` }} className={`h-full ${bar.color} transition-all`} />
                        </div>
                        <span className="w-12 text-right font-bold">{bar.count.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9.5: DATA LEAKAGE */}
        {activeTab === 'leakage' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#166534]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Zero-Leakage Pipeline (Fit on Train Only)</span>
                  </div>
                  <div className="text-xs font-mono-num space-y-1 text-[#1D1819]">
                    <div>Train Mean μ_train = <strong>{leakageResult.trainMeanClean.toFixed(2)}</strong></div>
                    <div>Train Std σ_train = <strong>{leakageResult.trainStdClean.toFixed(2)}</strong></div>
                    <div>Scaled Test Vector: <strong>[{leakageResult.scaledTestClean.map(v => v.toFixed(2)).join(', ')}]</strong></div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#991B1B]">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Leaked Pipeline (Fit Before Split)</span>
                  </div>
                  <div className="text-xs font-mono-num space-y-1 text-[#1D1819]">
                    <div>Full Mean μ_full = <strong>{leakageResult.fullMeanLeaked.toFixed(2)}</strong></div>
                    <div>Full Std σ_full = <strong>{leakageResult.fullStdLeaked.toFixed(2)}</strong></div>
                    <div>Scaled Test Vector: <strong>[{leakageResult.scaledTestLeaked.map(v => v.toFixed(2)).join(', ')}]</strong></div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2D9] text-xs font-mono-num flex justify-between items-center">
                <span>Max Coordinate Distortion from Pre-Split Leakage:</span>
                <strong className="text-sm text-[#7A1C30]">
                  Δz = {leakageResult.maxAbsoluteDistortion.toFixed(3)} σ
                </strong>
              </div>

              {/* Visual Distribution Pull Diagram */}
              <div className="bg-white border border-[#E8E2D9] rounded-lg p-3">
                <div className="text-[11px] font-bold text-[#1D1819] mb-1">
                  How Pre-Split Leakage Pulls the Scaler&apos;s Mean (μ) Toward the Test Outlier
                </div>
                <svg viewBox="0 0 500 84" className="w-full h-20 bg-[#FAF8F5] rounded border border-[#E8E2D9]">
                  {(() => {
                    const toX = (v: number) => 24 + (Math.min(300, Math.max(40, v)) - 40) / 260 * 452;
                    const cleanX = toX(leakageResult.trainMeanClean);
                    const leakX = toX(leakageResult.fullMeanLeaked);
                    const testX = toX(testOutlierMagnitude);
                    return (
                      <>
                        <line x1="24" y1="45" x2="476" y2="45" stroke="#D6CCC0" strokeWidth="1.5" />
                        <line x1={cleanX} y1="45" x2={leakX} y2="45" stroke="#991B1B" strokeWidth="3" />
                        <circle cx={cleanX} cy="45" r="5" fill="#166534" />
                        <text x={cleanX} y="24" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#166534">
                          Clean μ={leakageResult.trainMeanClean.toFixed(1)}
                        </text>
                        <circle cx={leakX} cy="45" r="5" fill="#991B1B" />
                        <text x={leakX} y="70" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#991B1B">
                          Leaked μ={leakageResult.fullMeanLeaked.toFixed(1)}
                        </text>
                        <circle cx={testX} cy="45" r="5.5" fill="#7A1C30" stroke="#FFFFFF" strokeWidth="1.5" />
                        <text x={Math.min(450, testX)} y="24" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#7A1C30">
                          x_test={testOutlierMagnitude}
                        </text>
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="leakage-outlier-slider" className="font-bold text-[#1D1819]">
                    Unseen Exam Spike / Test Outlier Value (x_test)
                  </label>
                  <span className="font-mono-num font-bold text-[#7A1C30]">{testOutlierMagnitude}</span>
                </div>
                <input
                  id="leakage-outlier-slider"
                  type="range"
                  min="75"
                  max="300"
                  step="5"
                  value={testOutlierMagnitude}
                  onChange={e => setTestOutlierMagnitude(parseFloat(e.target.value))}
                  className="w-full accent-[#7A1C30]"
                />
                <p className="text-[11px] text-[#54484E]">
                  When you call <code>scaler.fit_transform(X)</code> before <code>train_test_split</code>, the unseen test spike contaminates the training mean and standard deviation!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9.6: CLASS IMBALANCE */}
        {activeTab === 'imbalance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-num">
                <div className="p-3.5 rounded-lg border border-[#E8E2D9] bg-[#FAF8F5] space-y-1">
                  <div className="text-[#786970]">Unweighted Fraud Miss Loss (w₁ = 1)</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    L = {unweightedBceSample.loss.toFixed(3)} (∂L/∂z = {unweightedBceSample.dL_dz.toFixed(2)})
                  </div>
                </div>
                <div className="p-3.5 rounded-lg border border-[#EEDAA2] bg-[#FAF2E6] space-y-1">
                  <div className="text-[#7A1C30] font-bold">
                    Balanced Weighted Loss (w₁ = {classWeights.wPositive.toFixed(1)}×)
                  </div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    L = {weightedBceSample.loss.toFixed(3)} (∂L/∂z = {weightedBceSample.dL_dz.toFixed(2)})
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-[#E8E2D9] bg-white space-y-3 text-xs">
                <div className="font-bold text-[#1D1819]">
                  SMOTE Line-Segment Interpolation: x_new = x_i + λ(x_nn - x_i)
                </div>
                <svg viewBox="0 0 360 130" className="w-full h-32 bg-[#FAF8F5] rounded border border-[#E8E2D9]">
                  {/* Majority points background */}
                  {[
                    [45, 95], [70, 102], [95, 88], [115, 105], [140, 92], [175, 98], [210, 105], [240, 95],
                  ].map(([mx, my], i) => (
                    <circle key={i} cx={mx} cy={my} r="3.5" fill="#968A86" opacity="0.65" />
                  ))}
                  {/* Interpolation line between x_i (2, 2.5) and x_nn (7, 6.5) */}
                  <line x1="80" y1="85" x2="280" y2="25" stroke="#C28E38" strokeWidth="2" strokeDasharray="4,3" />
                  <circle cx="80" cy="85" r="5.5" fill="#1D4E35" />
                  <text x="80" y="102" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1D4E35">x_i [2.0, 2.5]</text>
                  <circle cx="280" cy="25" r="5.5" fill="#1D4E35" />
                  <text x="280" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1D4E35">x_nn [7.0, 6.5]</text>
                  {/* Live synthetic point */}
                  <circle
                    cx={80 + smoteLambda * 200}
                    cy={85 - smoteLambda * 60}
                    r="6.5"
                    fill="#7A1C30"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text
                    x={80 + smoteLambda * 200}
                    y={85 - smoteLambda * 60 - 11}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#7A1C30"
                  >
                    x_new [{smotePoint[0].toFixed(1)}, {smotePoint[1].toFixed(1)}]
                  </text>
                </svg>
                <div className="font-mono-num text-[#54484E]">
                  Minority Anchor x_i = [2.0, 2.5] • Neighbor x_nn = [7.0, 6.5] →{' '}
                  <strong className="text-[#7A1C30]">
                    Synthetic Point x_new = [{smotePoint[0].toFixed(2)}, {smotePoint[1].toFixed(2)}]
                  </strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="imbalance-pos-slider" className="font-bold text-[#1D1819]">
                      Rare Fraud Cases / Minority Count (N_pos out of 1,000)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{minorityCount}</span>
                  </div>
                  <input
                    id="imbalance-pos-slider"
                    type="range"
                    min="5"
                    max="250"
                    step="5"
                    value={minorityCount}
                    onChange={e => setMinorityCount(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="smote-lambda-slider" className="font-bold text-[#1D1819]">
                      Bridge Position / SMOTE Interpolation (λ)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{smoteLambda.toFixed(2)}</span>
                  </div>
                  <input
                    id="smote-lambda-slider"
                    type="range"
                    min="0.05"
                    max="0.95"
                    step="0.05"
                    value={smoteLambda}
                    onChange={e => setSmoteLambda(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9.7: FEATURE ENGINEERING & PIPELINES */}
        {activeTab === 'pipelines' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1D1819]">
                    24-Hour Clock Circle: Why 23:00 is Next Door to 00:00
                  </span>
                  <span className="font-mono-num text-[#7A1C30] font-semibold">
                    (sin θ, cos θ) = ({cyclicalHour.sinVal.toFixed(2)}, {cyclicalHour.cosVal.toFixed(2)})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-num">
                  <div className="p-3 bg-white border border-[#E8E2D9] rounded">
                    <div className="text-[#786970]">Raw Hour Gap |t - 0|</div>
                    <div className="text-base font-bold text-[#991B1B]">{hourOfDay} hrs</div>
                  </div>
                  <div className="p-3 bg-white border border-[#E8E2D9] rounded">
                    <div className="text-[#786970]">sin(2π·t / 24)</div>
                    <div className="text-base font-bold text-[#7A1C30]">{cyclicalHour.sinVal.toFixed(3)}</div>
                  </div>
                  <div className="p-3 bg-white border border-[#E8E2D9] rounded">
                    <div className="text-[#786970]">Circle Dist to 00:00</div>
                    <div className="text-base font-bold text-[#166534]">{cyclicalHour.distanceToZero.toFixed(3)}</div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FBF6EB] border border-[#E8D3A8] text-xs text-[#4A3B3E] leading-relaxed">
                <strong>Why Raw Hours Trick Linear Models:</strong> A raw integer hour thinks 23:00 (11 PM) and 00:00 (Midnight) are 23 units apart! Mapping time onto the unit circle via{' '}
                <code>(sin(2πt/24), cos(2πt/24))</code> places 23:00 right next to 00:00 (distance = 0.261, identical to 01:00).
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="pipeline-hour-slider" className="font-bold text-[#1D1819]">
                    Order Timestamp / Hour of Day (t ∈ [0, 23])
                  </label>
                  <span className="font-mono-num font-bold text-[#7A1C30]">{hourOfDay}:00</span>
                </div>
                <input
                  id="pipeline-hour-slider"
                  type="range"
                  min="0"
                  max="23"
                  step="1"
                  value={hourOfDay}
                  onChange={e => setHourOfDay(parseFloat(e.target.value))}
                  className="w-full accent-[#7A1C30]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
