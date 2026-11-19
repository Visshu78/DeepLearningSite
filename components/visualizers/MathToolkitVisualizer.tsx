'use client';

import React, { useState, useMemo } from 'react';
import {
  computeVectorAndMatrixOps,
  computeSurfaceGradientStep,
  computeChainRuleDag,
  computeProbabilityAndLikelihood,
  computeMatrixAlgebra2x2,
  computeNormsAndDistances,
  computeSymmetric2x2EigenPCA,
  computeJacobianAndHessian,
  computeBayesTheorem,
  computeCovarianceAndCorrelation,
  computeBinomialPmf,
  computeUniformPdf,
  type Mat2x2,
} from '@/lib/math/mathToolkit';
import { Compass } from 'lucide-react';

export type MathToolkitTab =
  | 'vectors'
  | 'gradients'
  | 'chainrule'
  | 'probability'
  | 'matrix-transforms'
  | 'norms-eigen'
  | 'jacobian-hessian'
  | 'bayes-distributions';

interface MathToolkitVisualizerProps {
  defaultTab?: MathToolkitTab;
}

export function MathToolkitVisualizer({
  defaultTab = 'vectors',
}: MathToolkitVisualizerProps) {
  const [activeTab, setActiveTab] = useState<MathToolkitTab>(defaultTab);

  // 0.1 Vectors State
  const [vecAx, setVecAx] = useState<number>(0.8);
  const [vecAy, setVecAy] = useState<number>(0.6);
  const vecRes = useMemo(
    () =>
      computeVectorAndMatrixOps(
        [vecAx, vecAy],
        [0.9, 0.2],
        [
          [1.5, 0.5],
          [-0.5, 1.2],
        ]
      ),
    [vecAx, vecAy]
  );

  // 0.2 Gradients State
  const [posX, setPosX] = useState<number>(1.5);
  const [posY, setPosY] = useState<number>(-1.2);
  const gradRes = useMemo(
    () => computeSurfaceGradientStep(posX, posY, 1.0, 0.5, 2.0, 0.1),
    [posX, posY]
  );

  // 0.3 Chain Rule State
  const [chainX, setChainX] = useState<number>(1.2);
  const [chainW1, setChainW1] = useState<number>(1.5);
  const chainRes = useMemo(
    () => computeChainRuleDag(chainX, chainW1, 0.5),
    [chainX, chainW1]
  );

  // 0.4 Probability State
  const [rainProbP, setRainProbP] = useState<number>(0.7);
  const [gaussMu, setGaussMu] = useState<number>(1.0);
  const [gaussSigma, setGaussSigma] = useState<number>(0.8);
  const probRes = useMemo(
    () => computeProbabilityAndLikelihood(rainProbP, 1, 1.8, gaussMu, gaussSigma),
    [rainProbP, gaussMu, gaussSigma]
  );

  // 0.5 Matrix Operations & Linear Transformations State
  const [matA, setMatA] = useState<Mat2x2>([
    [1.2, 0.6],
    [-0.3, 1.1],
  ]);
  const matB: Mat2x2 = useMemo(
    () => [
      [0, -1],
      [1, 0],
    ],
    []
  );
  const matAlgebraRes = useMemo(
    () => computeMatrixAlgebra2x2(matA, matB, [1, 1]),
    [matA, matB]
  );

  // 0.6 Norms, Distances & Eigenvalues (PCA) State
  const [normPtX, setNormPtX] = useState<number>(1.5);
  const [normPtY, setNormPtY] = useState<number>(1.0);
  const normRes = useMemo(
    () => computeNormsAndDistances([normPtX, normPtY], [0.5, -0.5]),
    [normPtX, normPtY]
  );
  const [pcaCov, setPcaCov] = useState<number>(0.85);
  const pcaRes = useMemo(
    () => computeSymmetric2x2EigenPCA(1.4, 0.9, pcaCov),
    [pcaCov]
  );

  // 0.7 Partial Derivatives, Jacobian & Hessian State
  const [jhX, setJhX] = useState<number>(0.8);
  const [jhY, setJhY] = useState<number>(0.6);
  const [hessA, setHessA] = useState<number>(1.5);
  const [hessB, setHessB] = useState<number>(0.6);
  const [hessC, setHessC] = useState<number>(0.8);
  const jhRes = useMemo(
    () => computeJacobianAndHessian(jhX, jhY, hessA, hessB, hessC),
    [jhX, jhY, hessA, hessB, hessC]
  );

  // 0.8 Conditional Prob, Bayes, Covariance & Distributions State
  const [bayesPrior, setBayesPrior] = useState<number>(0.02);
  const [bayesSens, setBayesSens] = useState<number>(0.95);
  const [bayesFpr, setBayesFpr] = useState<number>(0.05);
  const bayesRes = useMemo(
    () => computeBayesTheorem(bayesPrior, bayesSens, bayesFpr),
    [bayesPrior, bayesSens, bayesFpr]
  );
  const [corrTargetR, setCorrTargetR] = useState<number>(0.8);
  const corrSamplePts = useMemo(() => {
    const baseXs = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
    const baseNoise = [0.4, -0.5, 0.3, -0.2, 0.5, -0.4, 0.2, -0.3, 0.1];
    const ys = baseXs.map(
      (x, i) => corrTargetR * x + Math.sqrt(Math.max(0.02, 1 - corrTargetR * corrTargetR)) * baseNoise[i]
    );
    return { xs: baseXs, ys };
  }, [corrTargetR]);
  const corrRes = useMemo(
    () => computeCovarianceAndCorrelation(corrSamplePts.xs, corrSamplePts.ys),
    [corrSamplePts]
  );
  const [distKind, setDistKind] = useState<'bernoulli' | 'binomial' | 'gaussian' | 'uniform'>('binomial');
  const [distP, setDistP] = useState<number>(0.6);
  const [distN, setDistN] = useState<number>(8);
  const binomPmf = useMemo(() => computeBinomialPmf(distN, distP), [distN, distP]);
  const unifSample = useMemo(() => computeUniformPdf(1.5, 0.5, 3.5), []);

  const tabs: { id: MathToolkitTab; label: string }[] = [
    { id: 'vectors', label: '0.1 Vectors & Dot Product' },
    { id: 'gradients', label: '0.2 Derivatives & Gradients' },
    { id: 'chainrule', label: '0.3 The Chain Rule' },
    { id: 'probability', label: '0.4 Probability & Likelihood' },
    { id: 'matrix-transforms', label: '0.5 Matrix Ops & Transforms' },
    { id: 'norms-eigen', label: '0.6 Norms & Eigen/PCA' },
    { id: 'jacobian-hessian', label: '0.7 Jacobian & Hessian' },
    { id: 'bayes-distributions', label: '0.8 Bayes & Distributions' },
  ];

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl overflow-hidden shadow-xs">
      <div className="bg-[#FAF5EE] border-b border-[#EAE2D5] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#7A1C30]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F191B]">
            Track 0 Math Toolkit: Linear Algebra, Calculus &amp; Probability Workbench
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
        {/* TAB 0.1: VECTORS & MATRICES */}
        {activeTab === 'vectors' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Dot Product a · b</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {vecRes.dotProduct.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Cosine cos(θ)</div>
                  <div className="text-base font-bold text-[#166534]">
                    {vecRes.cosineSimilarity.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Angle θ</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {vecRes.angleDegrees.toFixed(1)}°
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Matrix W · a</div>
                  <div className="text-xs font-bold text-[#1D1819] mt-1">
                    [{vecRes.matrixTransformedA[0].toFixed(2)},{' '}
                    {vecRes.matrixTransformedA[1].toFixed(2)}]
                  </div>
                </div>
              </div>

              {/* Live Formula Trace & 2D Vector Geometry */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-3.5 items-center">
                <div className="sm:col-span-7 space-y-2 text-xs font-mono-num text-[#1D1819]">
                  <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#625956]">
                    Live Formula Trace
                  </div>
                  <div className="p-2 bg-white border border-[#E8E2D9] rounded leading-relaxed">
                    <div>
                      <span className="text-[#786970]">a · b</span> = ({vecAx.toFixed(2)})(0.90) + ({vecAy.toFixed(2)})(0.20) ={' '}
                      <strong className="text-[#7A1C30]">{vecRes.dotProduct.toFixed(4)}</strong>
                    </div>
                    <div>
                      <span className="text-[#786970]">cos(θ)</span> = {vecRes.dotProduct.toFixed(4)} / ({vecRes.normA.toFixed(4)} · {vecRes.normB.toFixed(4)}) ={' '}
                      <strong className="text-[#166534]">{vecRes.cosineSimilarity.toFixed(4)}</strong>
                    </div>
                    <div className="text-[10px] text-[#786970]">
                      (Full precision used internally; values shown rounded to 4 decimals.)
                    </div>
                    <div>
                      <span className="text-[#786970]">W · a</span> = [1.5({vecAx.toFixed(2)})+0.5({vecAy.toFixed(2)}), -0.5({vecAx.toFixed(2)})+1.2({vecAy.toFixed(2)})]
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-5">
                  <svg viewBox="0 0 180 120" className="w-full h-28 bg-white rounded border border-[#E8E2D9]">
                    <line x1="90" y1="8" x2="90" y2="112" stroke="#E8E2D9" strokeWidth="1" />
                    <line x1="12" y1="60" x2="168" y2="60" stroke="#E8E2D9" strokeWidth="1" />
                    {/* Friend vector b = [0.9, 0.2] */}
                    <line x1="90" y1="60" x2={90 + 0.9 * 55} y2={60 - 0.2 * 45} stroke="#166534" strokeWidth="2.5" />
                    <circle cx={90 + 0.9 * 55} cy={60 - 0.2 * 45} r="3.5" fill="#166534" />
                    <text x={94 + 0.9 * 55} y={58 - 0.2 * 45} fontSize="9" fontWeight="bold" fill="#166534">b</text>
                    {/* User vector a */}
                    <line x1="90" y1="60" x2={90 + vecAx * 55} y2={60 - vecAy * 45} stroke="#7A1C30" strokeWidth="2.5" />
                    <circle cx={90 + vecAx * 55} cy={60 - vecAy * 45} r="4" fill="#7A1C30" />
                    <text x={94 + vecAx * 55} y={56 - vecAy * 45} fontSize="9" fontWeight="bold" fill="#7A1C30">a</text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="vec-ax-slider" className="font-bold text-[#1D1819]">
                      Your Playlist Indie Score (a₁)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{vecAx.toFixed(2)}</span>
                  </div>
                  <input
                    id="vec-ax-slider"
                    type="range"
                    min="-1.0"
                    max="1.0"
                    step="0.05"
                    value={vecAx}
                    onChange={e => setVecAx(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="vec-ay-slider" className="font-bold text-[#1D1819]">
                      Your Playlist Classical Score (a₂)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{vecAy.toFixed(2)}</span>
                  </div>
                  <input
                    id="vec-ay-slider"
                    type="range"
                    min="-1.0"
                    max="1.0"
                    step="0.05"
                    value={vecAy}
                    onChange={e => setVecAy(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 0.2: DERIVATIVES & GRADIENTS */}
        {activeTab === 'gradients' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Elevation f(x, y)</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {gradRes.fValue.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">East Slope ∂f/∂x</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {gradRes.df_dx.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">North Slope ∂f/∂y</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {gradRes.df_dy.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded">
                  <div className="text-[#166534]">After -0.1·∇f Step</div>
                  <div className="text-base font-bold text-[#166534]">
                    {gradRes.fAfterStep.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="grad-x-slider" className="font-bold text-[#1D1819]">
                      Hill East-West Coordinate (x)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{posX.toFixed(2)}</span>
                  </div>
                  <input
                    id="grad-x-slider"
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.1"
                    value={posX}
                    onChange={e => setPosX(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="grad-y-slider" className="font-bold text-[#1D1819]">
                      Hill North-South Coordinate (y)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{posY.toFixed(2)}</span>
                  </div>
                  <input
                    id="grad-y-slider"
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.1"
                    value={posY}
                    onChange={e => setPosY(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 0.3: CHAIN RULE */}
        {activeTab === 'chainrule' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Path 1 (∂z/∂u · du/dx)</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {chainRes.path1Contrib.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Path 2 (∂z/∂v · dv/dx)</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {chainRes.path2Contrib.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded">
                  <div className="text-[#166534]">Total dz/dx</div>
                  <div className="text-base font-bold text-[#166534]">
                    {chainRes.totalDz_Dx.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="chain-x-slider" className="font-bold text-[#1D1819]">
                      Input Amount / Variable (x)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{chainX.toFixed(2)}</span>
                  </div>
                  <input
                    id="chain-x-slider"
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.1"
                    value={chainX}
                    onChange={e => setChainX(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="chain-w-slider" className="font-bold text-[#1D1819]">
                      Exchange Rate Multiplier (w₁)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{chainW1.toFixed(2)}</span>
                  </div>
                  <input
                    id="chain-w-slider"
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.1"
                    value={chainW1}
                    onChange={e => setChainW1(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 0.4: PROBABILITY */}
        {activeTab === 'probability' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Bernoulli Entropy</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {probRes.bernoulliEntropyBits.toFixed(3)} bits
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Gaussian PDF(1.8)</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {probRes.gaussianPdf.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Gaussian NLL</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {probRes.gaussianNll.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded">
                  <div className="text-[#166534]">Grad ∂NLL/∂μ</div>
                  <div className="text-base font-bold text-[#166534]">
                    {probRes.dGaussianNll_dMu.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="prob-p-slider" className="font-bold text-[#1D1819]">
                      Forecast Rain Probability (p)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{rainProbP.toFixed(2)}</span>
                  </div>
                  <input
                    id="prob-p-slider"
                    type="range"
                    min="0.05"
                    max="0.95"
                    step="0.05"
                    value={rainProbP}
                    onChange={e => setRainProbP(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="prob-mu-slider" className="font-bold text-[#1D1819]">
                      Gaussian Center / Mean (μ)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{gaussMu.toFixed(2)}</span>
                  </div>
                  <input
                    id="prob-mu-slider"
                    type="range"
                    min="0.0"
                    max="3.0"
                    step="0.1"
                    value={gaussMu}
                    onChange={e => setGaussMu(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 0.5: MATRIX OPERATIONS & LINEAR TRANSFORMATIONS */}
        {activeTab === 'matrix-transforms' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-3">
                <div className="text-xs font-bold text-[#1D1819] mb-2">
                  Geometric Linear Transformation of the Unit Square &amp; Basis Vectors
                </div>
                <svg viewBox="0 0 320 220" className="w-full h-56 bg-white rounded border border-[#E8E2D9]">
                  {/* Grid & axes */}
                  <line x1="160" y1="10" x2="160" y2="210" stroke="#E8E2D9" strokeWidth="1" />
                  <line x1="20" y1="110" x2="300" y2="110" stroke="#E8E2D9" strokeWidth="1" />
                  {/* Original unit square */}
                  <polygon
                    points="160,110 210,110 210,60 160,60"
                    fill="#968A86"
                    fillOpacity="0.12"
                    stroke="#968A86"
                    strokeDasharray="3,3"
                    strokeWidth="1"
                  />
                  {/* Transformed unit square under A */}
                  <polygon
                    points={`160,110 ${160 + matA[0][0] * 50},${110 - matA[1][0] * 50} ${160 + (matA[0][0] + matA[0][1]) * 50},${110 - (matA[1][0] + matA[1][1]) * 50} ${160 + matA[0][1] * 50},${110 - matA[1][1] * 50}`}
                    fill="#7A1C30"
                    fillOpacity="0.18"
                    stroke="#7A1C30"
                    strokeWidth="2"
                  />
                  {/* Transformed i-hat & j-hat */}
                  <line
                    x1="160"
                    y1="110"
                    x2={160 + matA[0][0] * 50}
                    y2={110 - matA[1][0] * 50}
                    stroke="#7A1C30"
                    strokeWidth="2.5"
                  />
                  <line
                    x1="160"
                    y1="110"
                    x2={160 + matA[0][1] * 50}
                    y2={110 - matA[1][1] * 50}
                    stroke="#C28E38"
                    strokeWidth="2.5"
                  />
                  <text x={165 + matA[0][0] * 50} y={108 - matA[1][0] * 50} fontSize="10" fill="#7A1C30" fontWeight="bold">
                    A·î
                  </text>
                  <text x={165 + matA[0][1] * 50} y={108 - matA[1][1] * 50} fontSize="10" fill="#C28E38" fontWeight="bold">
                    A·ĵ
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">det(A) (Area Scale)</div>
                  <div className="text-sm font-bold text-[#7A1C30]">{matAlgebraRes.determinantA.toFixed(3)}</div>
                </div>
                <div className="p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Invertible?</div>
                  <div className={`text-sm font-bold ${matAlgebraRes.isInvertible ? 'text-[#166534]' : 'text-[#991B1B]'}`}>
                    {matAlgebraRes.isInvertible ? 'Yes (A⁻¹ exists)' : 'Singular (No A⁻¹)'}
                  </div>
                </div>
                <div className="p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">A·[1, 1]ᵀ</div>
                  <div className="text-sm font-bold text-[#1D1819]">
                    [{matAlgebraRes.transformedV[0].toFixed(2)}, {matAlgebraRes.transformedV[1].toFixed(2)}]
                  </div>
                </div>
                <div className="p-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">AB = BA?</div>
                  <div className="text-sm font-bold text-[#C28E38]">
                    {matAlgebraRes.commutes ? 'Commutes' : 'AB ≠ BA'}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div className="text-xs font-bold text-[#1D1819]">Matrix A Presets</div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setMatA([[0.866, -0.5], [0.5, 0.866]])}
                    className="px-2 py-1.5 rounded bg-white border border-[#EAE2D5] hover:border-[#7A1C30]"
                  >
                    30° Rotation
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatA([[1.2, 0.8], [0, 1.0]])}
                    className="px-2 py-1.5 rounded bg-white border border-[#EAE2D5] hover:border-[#7A1C30]"
                  >
                    Horizontal Shear
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatA([[1.6, 0], [0, 0.6]])}
                    className="px-2 py-1.5 rounded bg-white border border-[#EAE2D5] hover:border-[#7A1C30]"
                  >
                    Anisotropic Scale
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatA([[1.0, 1.0], [0.5, 0.5]])}
                    className="px-2 py-1.5 rounded bg-white border border-[#EAE2D5] hover:border-[#7A1C30]"
                  >
                    Singular (det=0)
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono-num">
                  <div className="p-2.5 bg-white border border-[#E8E2D9] rounded">
                    <div className="text-[#786970] mb-1">Transpose Aᵀ</div>
                    <div>[{matAlgebraRes.transposeA[0][0].toFixed(2)}, {matAlgebraRes.transposeA[0][1].toFixed(2)}]</div>
                    <div>[{matAlgebraRes.transposeA[1][0].toFixed(2)}, {matAlgebraRes.transposeA[1][1].toFixed(2)}]</div>
                  </div>
                  <div className="p-2.5 bg-white border border-[#E8E2D9] rounded">
                    <div className="text-[#786970] mb-1">Inverse A⁻¹</div>
                    {matAlgebraRes.inverseA ? (
                      <>
                        <div>[{matAlgebraRes.inverseA[0][0].toFixed(2)}, {matAlgebraRes.inverseA[0][1].toFixed(2)}]</div>
                        <div>[{matAlgebraRes.inverseA[1][0].toFixed(2)}, {matAlgebraRes.inverseA[1][1].toFixed(2)}]</div>
                      </>
                    ) : (
                      <div className="text-[#991B1B]">Undefined (det = 0)</div>
                    )}
                  </div>
                </div>

                <div className="p-2.5 bg-white border border-[#E8E2D9] rounded text-[11px] font-mono-num">
                  <div className="text-[#786970] mb-1">Non-Commutativity vs 90° Rotation B:</div>
                  <div>AB = [{matAlgebraRes.productAB[0][0].toFixed(2)}, {matAlgebraRes.productAB[0][1].toFixed(2)}; {matAlgebraRes.productAB[1][0].toFixed(2)}, {matAlgebraRes.productAB[1][1].toFixed(2)}]</div>
                  <div>BA = [{matAlgebraRes.productBA[0][0].toFixed(2)}, {matAlgebraRes.productBA[0][1].toFixed(2)}; {matAlgebraRes.productBA[1][0].toFixed(2)}, {matAlgebraRes.productBA[1][1].toFixed(2)}]</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 0.6: NORMS, DISTANCES & EIGENVALUES (PCA) */}
        {activeTab === 'norms-eigen' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-4">
              <div className="text-xs font-bold text-[#1D1819]">L1 (Diamond) vs L2 (Circle) Norms &amp; Distance</div>
              <svg viewBox="0 0 240 200" className="w-full h-48 bg-white rounded border border-[#E8E2D9]">
                <line x1="120" y1="10" x2="120" y2="190" stroke="#E8E2D9" strokeWidth="1" />
                <line x1="20" y1="100" x2="220" y2="100" stroke="#E8E2D9" strokeWidth="1" />
                {/* L1 Unit Ball (diamond radius 50px) */}
                <polygon points="120,50 170,100 120,150 70,100" fill="none" stroke="#C28E38" strokeWidth="2" strokeDasharray="4,2" />
                {/* L2 Unit Ball (circle radius 50px) */}
                <circle cx="120" cy="100" r="50" fill="none" stroke="#7A1C30" strokeWidth="2" />
                {/* Vector u */}
                <line x1="120" y1="100" x2={120 + normPtX * 40} y2={100 - normPtY * 40} stroke="#1D1819" strokeWidth="2.5" />
                <circle cx={120 + normPtX * 40} cy={100 - normPtY * 40} r="4.5" fill="#7A1C30" />
              </svg>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-num">
                <div className="p-2 bg-white border border-[#E8E2D9] rounded">
                  L1 Norm ||u||₁: <strong className="text-[#C28E38]">{normRes.l1NormU.toFixed(2)}</strong>
                </div>
                <div className="p-2 bg-white border border-[#E8E2D9] rounded">
                  L2 Norm ||u||₂: <strong className="text-[#7A1C30]">{normRes.l2NormU.toFixed(2)}</strong>
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <label className="flex justify-between">
                  <span>u_x = {normPtX.toFixed(2)}</span>
                </label>
                <input type="range" min="-2" max="2" step="0.1" value={normPtX} onChange={e => setNormPtX(parseFloat(e.target.value))} className="w-full accent-[#7A1C30]" />
                <label className="flex justify-between">
                  <span>u_y = {normPtY.toFixed(2)}</span>
                </label>
                <input type="range" min="-2" max="2" step="0.1" value={normPtY} onChange={e => setNormPtY(parseFloat(e.target.value))} className="w-full accent-[#7A1C30]" />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-4">
              <div className="text-xs font-bold text-[#1D1819]">Eigenvalues &amp; PCA Principal Directions</div>
              <svg viewBox="0 0 240 200" className="w-full h-48 bg-white rounded border border-[#E8E2D9]">
                <line x1="120" y1="10" x2="120" y2="190" stroke="#E8E2D9" strokeWidth="1" />
                <line x1="20" y1="100" x2="220" y2="100" stroke="#E8E2D9" strokeWidth="1" />
                {/* Eigenvector 1 (PC1) */}
                <line
                  x1={120 - pcaRes.eigvec1[0] * Math.sqrt(pcaRes.lambda1) * 45}
                  y1={100 + pcaRes.eigvec1[1] * Math.sqrt(pcaRes.lambda1) * 45}
                  x2={120 + pcaRes.eigvec1[0] * Math.sqrt(pcaRes.lambda1) * 45}
                  y2={100 - pcaRes.eigvec1[1] * Math.sqrt(pcaRes.lambda1) * 45}
                  stroke="#7A1C30"
                  strokeWidth="3"
                />
                {/* Eigenvector 2 (PC2) */}
                <line
                  x1={120 - pcaRes.eigvec2[0] * Math.sqrt(Math.max(0.05, pcaRes.lambda2)) * 45}
                  y1={100 + pcaRes.eigvec2[1] * Math.sqrt(Math.max(0.05, pcaRes.lambda2)) * 45}
                  x2={120 + pcaRes.eigvec2[0] * Math.sqrt(Math.max(0.05, pcaRes.lambda2)) * 45}
                  y2={100 - pcaRes.eigvec2[1] * Math.sqrt(Math.max(0.05, pcaRes.lambda2)) * 45}
                  stroke="#C28E38"
                  strokeWidth="2.5"
                />
              </svg>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-num">
                <div className="p-2 bg-white border border-[#E8E2D9] rounded">
                  PC1 λ₁: <strong className="text-[#7A1C30]">{pcaRes.lambda1.toFixed(2)}</strong> ({(pcaRes.explainedVarianceRatio1 * 100).toFixed(1)}%)
                </div>
                <div className="p-2 bg-white border border-[#E8E2D9] rounded">
                  PC2 λ₂: <strong className="text-[#C28E38]">{pcaRes.lambda2.toFixed(2)}</strong> ({(pcaRes.explainedVarianceRatio2 * 100).toFixed(1)}%)
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <label className="flex justify-between font-bold text-[#1D1819]">
                  <span>Covariance Cov(X, Y)</span>
                  <span className="font-mono-num text-[#7A1C30]">{pcaCov.toFixed(2)}</span>
                </label>
                <input type="range" min="-1.0" max="1.0" step="0.05" value={pcaCov} onChange={e => setPcaCov(parseFloat(e.target.value))} className="w-full accent-[#7A1C30]" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 0.7: PARTIAL DERIVATIVES, JACOBIAN & HESSIAN */}
        {activeTab === 'jacobian-hessian' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1D1819]">
                    2×2 Jacobian of F(x, y) = [x² + y, sin(x)·y]
                  </span>
                  <span className="text-xs font-mono-num text-[#7A1C30] font-bold">
                    det(J) = {jhRes.jacobianDet.toFixed(3)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono-num bg-white p-3 rounded border border-[#E8E2D9]">
                  <div>∂F₁/∂x = <strong>{jhRes.jacobian[0][0].toFixed(3)}</strong></div>
                  <div>∂F₁/∂y = <strong>{jhRes.jacobian[0][1].toFixed(3)}</strong></div>
                  <div>∂F₂/∂x = <strong>{jhRes.jacobian[1][0].toFixed(3)}</strong></div>
                  <div>∂F₂/∂y = <strong>{jhRes.jacobian[1][1].toFixed(3)}</strong></div>
                </div>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1D1819]">
                    Hessian Curvature of f(x, y) = ax² + bxy + cy²
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                      jhRes.curvatureType === 'minimum'
                        ? 'bg-[#EEF5F0] text-[#1D4E35]'
                        : jhRes.curvatureType === 'saddle'
                        ? 'bg-[#FEF3C7] text-[#92400E]'
                        : 'bg-[#FDF2F2] text-[#7A1C30]'
                    }`}
                  >
                    {jhRes.curvatureType}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono-num bg-white p-3 rounded border border-[#E8E2D9]">
                  <div>λ₁ = <strong>{jhRes.hessianEigenvalues[0].toFixed(2)}</strong></div>
                  <div>λ₂ = <strong>{jhRes.hessianEigenvalues[1].toFixed(2)}</strong></div>
                  <div>
                    κ = <strong>{Number.isFinite(jhRes.conditionNumber) ? jhRes.conditionNumber.toFixed(2) : '∞'}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3 bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>x coordinate</span>
                  <span className="font-mono-num text-[#7A1C30]">{jhX.toFixed(2)}</span>
                </div>
                <input type="range" min="-2" max="2" step="0.1" value={jhX} onChange={e => setJhX(parseFloat(e.target.value))} className="w-full accent-[#7A1C30]" />
              </div>
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>y coordinate</span>
                  <span className="font-mono-num text-[#7A1C30]">{jhY.toFixed(2)}</span>
                </div>
                <input type="range" min="-2" max="2" step="0.1" value={jhY} onChange={e => setJhY(parseFloat(e.target.value))} className="w-full accent-[#7A1C30]" />
              </div>
              <div className="pt-2 border-t border-[#EAE2D5] space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Curvature a (x²)</span>
                  <span className="font-mono-num">{hessA.toFixed(1)}</span>
                </div>
                <input type="range" min="-2" max="2" step="0.2" value={hessA} onChange={e => setHessA(parseFloat(e.target.value))} className="w-full accent-[#7A1C30]" />
                <div className="flex justify-between font-bold">
                  <span>Cross-term b (xy)</span>
                  <span className="font-mono-num">{hessB.toFixed(1)}</span>
                </div>
                <input type="range" min="-2" max="2" step="0.2" value={hessB} onChange={e => setHessB(parseFloat(e.target.value))} className="w-full accent-[#C28E38]" />
                <div className="flex justify-between font-bold">
                  <span>Curvature c (y²)</span>
                  <span className="font-mono-num">{hessC.toFixed(1)}</span>
                </div>
                <input type="range" min="-2" max="2" step="0.2" value={hessC} onChange={e => setHessC(parseFloat(e.target.value))} className="w-full accent-[#7A1C30]" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 0.8: BAYES, COVARIANCE & COMMON DISTRIBUTIONS */}
        {activeTab === 'bayes-distributions' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Bayes Panel */}
              <div className="lg:col-span-6 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#1D1819]">Bayes&apos; Theorem Updater</span>
                  <span className="px-2 py-0.5 rounded bg-[#7A1C30] text-white text-xs font-mono-num font-bold">
                    Posterior P(H|E) = {(bayesRes.posteriorHgivenE * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-4 rounded overflow-hidden flex bg-[#E8E2D9]">
                  <div
                    style={{ width: `${bayesRes.posteriorHgivenE * 100}%` }}
                    className="bg-[#7A1C30] h-full transition-all"
                  />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Prior P(H): {(bayesPrior * 100).toFixed(1)}%</span>
                    <span>Sensitivity P(E|H): {(bayesSens * 100).toFixed(0)}%</span>
                    <span>FPR P(E|¬H): {(bayesFpr * 100).toFixed(0)}%</span>
                  </div>
                  <input type="range" min="0.01" max="0.5" step="0.01" value={bayesPrior} onChange={e => setBayesPrior(parseFloat(e.target.value))} className="w-full accent-[#7A1C30]" />
                  <input type="range" min="0.5" max="0.99" step="0.01" value={bayesSens} onChange={e => setBayesSens(parseFloat(e.target.value))} className="w-full accent-[#166534]" />
                  <input type="range" min="0.01" max="0.3" step="0.01" value={bayesFpr} onChange={e => setBayesFpr(parseFloat(e.target.value))} className="w-full accent-[#C28E38]" />
                </div>
              </div>

              {/* Covariance & Correlation Panel */}
              <div className="lg:col-span-6 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#1D1819]">Covariance &amp; Correlation</span>
                  <span className="font-mono-num font-bold text-[#7A1C30]">
                    Cov = {corrRes.covariance.toFixed(2)} | r = {corrRes.correlationR.toFixed(2)}
                  </span>
                </div>
                <svg viewBox="0 0 240 120" className="w-full h-28 bg-white rounded border border-[#E8E2D9]">
                  <line x1="120" y1="5" x2="120" y2="115" stroke="#E8E2D9" />
                  <line x1="10" y1="60" x2="230" y2="60" stroke="#E8E2D9" />
                  {corrSamplePts.xs.map((x, idx) => (
                    <circle
                      key={idx}
                      cx={120 + x * 45}
                      cy={60 - corrSamplePts.ys[idx] * 22}
                      r="3.5"
                      fill="#7A1C30"
                    />
                  ))}
                </svg>
                <input
                  type="range"
                  min="-0.95"
                  max="0.95"
                  step="0.05"
                  value={corrTargetR}
                  onChange={e => setCorrTargetR(parseFloat(e.target.value))}
                  className="w-full accent-[#7A1C30]"
                />
              </div>
            </div>

            {/* Common Distributions Switcher */}
            <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#1D1819]">Common Distributions Explorer</span>
                <div className="flex gap-1.5 text-xs">
                  {(['bernoulli', 'binomial', 'gaussian', 'uniform'] as const).map(k => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setDistKind(k)}
                      className={`px-2.5 py-1 rounded capitalize font-semibold border ${
                        distKind === k
                          ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                          : 'bg-white text-[#4A3B3E] border-[#EAE2D5]'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              {distKind === 'binomial' && (
                <div className="space-y-2">
                  <div className="flex items-end gap-1.5 h-24 bg-white p-3 rounded border border-[#E8E2D9]">
                    {binomPmf.map((prob, k) => (
                      <div key={k} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div
                          style={{ height: `${Math.max(4, prob * 180)}%` }}
                          className="w-full bg-[#7A1C30] rounded-t"
                          title={`k=${k}: ${prob.toFixed(3)}`}
                        />
                        <span className="text-[10px] font-mono-num text-[#54484E] mt-1">{k}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span>n = {distN} trials</span>
                      <input type="range" min="2" max="14" step="1" value={distN} onChange={e => setDistN(parseInt(e.target.value, 10))} className="w-full accent-[#7A1C30]" />
                    </div>
                    <div>
                      <span>p = {distP.toFixed(2)}</span>
                      <input type="range" min="0.1" max="0.9" step="0.05" value={distP} onChange={e => setDistP(parseFloat(e.target.value))} className="w-full accent-[#7A1C30]" />
                    </div>
                  </div>
                </div>
              )}

              {distKind === 'bernoulli' && (
                <div className="text-xs font-mono-num bg-white p-3 rounded border border-[#E8E2D9] flex justify-between">
                  <span>P(X=1) = {distP.toFixed(2)} | P(X=0) = {(1 - distP).toFixed(2)}</span>
                  <span>Mean = {distP.toFixed(2)} | Var = {(distP * (1 - distP)).toFixed(3)}</span>
                </div>
              )}

              {distKind === 'gaussian' && (
                <div className="text-xs font-mono-num bg-white p-3 rounded border border-[#E8E2D9] flex justify-between">
                  <span>Bell curve N(μ={gaussMu.toFixed(1)}, σ={gaussSigma.toFixed(1)})</span>
                  <span>68% within μ ± σ | Peak PDF = {(1 / (Math.sqrt(2 * Math.PI) * gaussSigma)).toFixed(3)}</span>
                </div>
              )}

              {distKind === 'uniform' && (
                <div className="text-xs font-mono-num bg-white p-3 rounded border border-[#E8E2D9] flex justify-between">
                  <span>Uniform U(0.5, 3.5): constant density f(x) = {unifSample.pdf.toFixed(3)}</span>
                  <span>Mean = {unifSample.mean.toFixed(2)} | Var = {unifSample.variance.toFixed(3)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
