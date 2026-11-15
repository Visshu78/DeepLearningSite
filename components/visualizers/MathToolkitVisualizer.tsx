'use client';

import React, { useState, useMemo } from 'react';
import {
  computeVectorAndMatrixOps,
  computeSurfaceGradientStep,
  computeChainRuleDag,
  computeProbabilityAndLikelihood,
} from '@/lib/math/mathToolkit';
import { Compass } from 'lucide-react';

export type MathToolkitTab = 'vectors' | 'gradients' | 'chainrule' | 'probability';

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

  const tabs: { id: MathToolkitTab; label: string }[] = [
    { id: 'vectors', label: '0.1 Vectors & Dot Product' },
    { id: 'gradients', label: '0.2 Derivatives & Gradients' },
    { id: 'chainrule', label: '0.3 The Chain Rule' },
    { id: 'probability', label: '0.4 Probability & Likelihood' },
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
      </div>
    </div>
  );
}
