'use client';

import React, { useState, useMemo } from 'react';
import {
  computeInitializationPropagation,
  computeNormalizationForwardBackward,
  computeLearningRateAtStep,
  computeTrainingDiagnostics,
} from '@/lib/math/trainingDynamics';
import { Gauge } from 'lucide-react';

export type TrainingTab = 'init' | 'norm' | 'schedule' | 'debugging';

interface TrainingDynamicsVisualizerProps {
  defaultTab?: TrainingTab;
}

export function TrainingDynamicsVisualizer({
  defaultTab = 'init',
}: TrainingDynamicsVisualizerProps) {
  const [activeTab, setActiveTab] = useState<TrainingTab>(defaultTab);

  // 3.1 Initialization State
  const [fanIn, setFanIn] = useState<number>(64);
  const [sigmaW, setSigmaW] = useState<number>(0.15);
  const initRes = useMemo(
    () => computeInitializationPropagation(fanIn, sigmaW, 10),
    [fanIn, sigmaW]
  );

  // 3.2 Normalization State
  const [gamma, setGamma] = useState<number>(1.0);
  const [beta, setBeta] = useState<number>(0.0);
  const [rawExamScore0, setRawExamScore0] = useState<number>(42);
  const normRes = useMemo(
    () =>
      computeNormalizationForwardBackward(
        [rawExamScore0, 58, 74, 90],
        gamma,
        beta,
        [1.0, -0.5, 0.2, 0.8]
      ),
    [rawExamScore0, gamma, beta]
  );

  // 3.5 LR Schedule State
  const [currentStep, setCurrentStep] = useState<number>(30);
  const [warmupSteps, setWarmupSteps] = useState<number>(20);
  const schedPoint = useMemo(
    () => computeLearningRateAtStep(currentStep, 100, warmupSteps, 0.01, 0.0005),
    [currentStep, warmupSteps]
  );

  // 3.6 Debugging State
  const [capacity, setCapacity] = useState<number>(4.0);
  const [lrDebug, setLrDebug] = useState<number>(0.25);
  const [maxGradNorm, setMaxGradNorm] = useState<number>(2.0);
  const debugRes = useMemo(
    () =>
      computeTrainingDiagnostics(
        capacity,
        lrDebug,
        [3.0, 4.0],
        maxGradNorm,
        [-1.5, 0.8, -0.2, 1.4, 0.3, -0.9]
      ),
    [capacity, lrDebug, maxGradNorm]
  );

  const tabs: { id: TrainingTab; label: string }[] = [
    { id: 'init', label: '4.1 Weight Init' },
    { id: 'norm', label: '4.2 Batch & LayerNorm' },
    { id: 'schedule', label: '4.5 LR Warmup & Cosine' },
    { id: 'debugging', label: '4.6 Loss Curves & Debug' },
  ];

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl overflow-hidden shadow-xs">
      <div className="bg-[#FAF5EE] border-b border-[#EAE2D5] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-[#7A1C30]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F191B]">
            Track 4 Training Stability, Normalization &amp; Diagnostics Workbench
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
        {/* TAB 3.1: WEIGHT INITIALIZATION */}
        {activeTab === 'init' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Xavier √(1/n_in)</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {initRes.xavierStd.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">He √(2/n_in)</div>
                  <div className="text-base font-bold text-[#166534]">
                    {initRes.heStd.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Layer 10 Linear Var</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {initRes.finalRatioLinear.toExponential(2)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Layer 10 ReLU Var</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {initRes.finalRatioRelu.toExponential(2)}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSigmaW(Number(initRes.xavierStd.toFixed(3)))}
                  className="px-3 py-1.5 rounded bg-[#FAF5EE] border border-[#EAE2D5] text-xs font-bold text-[#7A1C30] hover:bg-[#F3ECE0]"
                >
                  Snap to Xavier √(1/n_in) = {initRes.xavierStd.toFixed(3)}
                </button>
                <button
                  type="button"
                  onClick={() => setSigmaW(Number(initRes.heStd.toFixed(3)))}
                  className="px-3 py-1.5 rounded bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-bold text-[#166534] hover:bg-[#DCFCE7]"
                >
                  Snap to Kaiming / He √(2/n_in) = {initRes.heStd.toFixed(3)}
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="init-sigma-slider" className="font-bold text-[#1D1819]">
                      Starting Weight Spread / Std Dev (σ_w)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{sigmaW.toFixed(3)}</span>
                  </div>
                  <input
                    id="init-sigma-slider"
                    type="range"
                    min="0.020"
                    max="0.300"
                    step="0.005"
                    value={sigmaW}
                    onChange={e => setSigmaW(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="init-fanin-slider" className="font-bold text-[#1D1819]">
                      Incoming Connections / Layer Width (n_in)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{fanIn}</span>
                  </div>
                  <input
                    id="init-fanin-slider"
                    type="range"
                    min="16"
                    max="256"
                    step="16"
                    value={fanIn}
                    onChange={e => setFanIn(parseInt(e.target.value, 10))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3.2: BATCH & LAYER NORMALIZATION */}
        {activeTab === 'norm' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Batch Mean (μ_B)</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {normRes.mean.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Batch Variance (σ_B²)</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {normRes.variance.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Grad ∂L/∂γ | ∂L/∂β</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {normRes.gradGamma.toFixed(2)} | {normRes.gradBeta.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg text-xs font-mono-num space-y-1">
                <div>
                  Standardized x̂ = [{normRes.xHat.map(v => v.toFixed(3)).join(', ')}]
                </div>
                <div className="text-[#7A1C30] font-bold">
                  Curved Output y = γ·x̂ + β = [{normRes.yOut.map(v => v.toFixed(3)).join(', ')}]
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="norm-x0-slider" className="font-bold text-[#1D1819]">
                      Student 1 Raw Marks (x₁)
                    </label>
                    <span className="font-mono-num font-bold text-[#1D1819]">{rawExamScore0}</span>
                  </div>
                  <input
                    id="norm-x0-slider"
                    type="range"
                    min="10"
                    max="95"
                    step="1"
                    value={rawExamScore0}
                    onChange={e => setRawExamScore0(parseInt(e.target.value, 10))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="norm-gamma-slider" className="font-bold text-[#1D1819]">
                      Curved Spread Multiplier / Scale (γ)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{gamma.toFixed(2)}</span>
                  </div>
                  <input
                    id="norm-gamma-slider"
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.1"
                    value={gamma}
                    onChange={e => setGamma(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="norm-beta-slider" className="font-bold text-[#1D1819]">
                      Grace Marks Offset / Shift (β)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{beta.toFixed(2)}</span>
                  </div>
                  <input
                    id="norm-beta-slider"
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.1"
                    value={beta}
                    onChange={e => setBeta(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3.5: LR SCHEDULES */}
        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Warmup + Cosine η(t)</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {schedPoint.warmupCosineLr.toFixed(5)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Step Decay η(t)</div>
                  <div className="text-base font-bold text-[#C28E38]">
                    {schedPoint.stepDecayLr.toFixed(5)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Exponential Decay</div>
                  <div className="text-base font-bold text-[#166534]">
                    {schedPoint.exponentialLr.toFixed(5)}
                  </div>
                </div>
              </div>
              <div className="p-3.5 bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg text-xs">
                {currentStep <= warmupSteps
                  ? `Warmup Phase (Step ${currentStep}/${warmupSteps}): linearly ramping η from 0 up to η_max = 0.0100 so Adam second-moment v_t stabilizes before full strides!`
                  : `Cosine Annealing Phase (Step ${currentStep}/100): smoothly gliding η along a half-cosine curve down toward η_min = 0.0005.`}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="sched-step-slider" className="font-bold text-[#1D1819]">
                      Current Training Epoch / Step (t)
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{currentStep} / 100</span>
                  </div>
                  <input
                    id="sched-step-slider"
                    type="range"
                    min="0"
                    max="100"
                    step="2"
                    value={currentStep}
                    onChange={e => setCurrentStep(parseInt(e.target.value, 10))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="sched-warmup-slider" className="font-bold text-[#1D1819]">
                      Warmup Ramp Duration (W steps)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{warmupSteps}</span>
                  </div>
                  <input
                    id="sched-warmup-slider"
                    type="range"
                    min="5"
                    max="40"
                    step="5"
                    value={warmupSteps}
                    onChange={e => setWarmupSteps(parseInt(e.target.value, 10))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3.6: DEBUGGING */}
        {activeTab === 'debugging' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-num">
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Train Loss</div>
                  <div className="text-base font-bold text-[#1D1819]">
                    {debugRes.trainLoss.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Validation Loss</div>
                  <div className="text-base font-bold text-[#7A1C30]">
                    {debugRes.valLoss.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded">
                  <div className="text-[#786970]">Clipped ||g||₂</div>
                  <div className="text-base font-bold text-[#166534]">
                    {debugRes.gradNormClipped.toFixed(2)} / {debugRes.gradNormRaw.toFixed(1)}
                  </div>
                </div>
                <div className="p-3 bg-[#FBF6EB] border border-[#E8D3A8] rounded">
                  <div className="text-[#8E6523]">Doctor Diagnosis</div>
                  <div className="text-xs font-bold text-[#7A1C30] mt-1">
                    {debugRes.diagnosis}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="dbg-cap-slider" className="font-bold text-[#1D1819]">
                      Model Capacity / Depth
                    </label>
                    <span className="font-mono-num font-bold text-[#7A1C30]">{capacity.toFixed(1)}</span>
                  </div>
                  <input
                    id="dbg-cap-slider"
                    type="range"
                    min="1.0"
                    max="9.0"
                    step="0.5"
                    value={capacity}
                    onChange={e => setCapacity(parseFloat(e.target.value))}
                    className="w-full accent-[#7A1C30]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="dbg-lr-slider" className="font-bold text-[#1D1819]">
                      Step Size / Learning Rate (η)
                    </label>
                    <span className="font-mono-num font-bold text-[#C28E38]">{lrDebug.toFixed(2)}</span>
                  </div>
                  <input
                    id="dbg-lr-slider"
                    type="range"
                    min="0.05"
                    max="1.20"
                    step="0.05"
                    value={lrDebug}
                    onChange={e => setLrDebug(parseFloat(e.target.value))}
                    className="w-full accent-[#C28E38]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor="dbg-clip-slider" className="font-bold text-[#1D1819]">
                      Gradient Clip Ceiling (c)
                    </label>
                    <span className="font-mono-num font-bold text-[#166534]">{maxGradNorm.toFixed(1)}</span>
                  </div>
                  <input
                    id="dbg-clip-slider"
                    type="range"
                    min="0.5"
                    max="6.0"
                    step="0.5"
                    value={maxGradNorm}
                    onChange={e => setMaxGradNorm(parseFloat(e.target.value))}
                    className="w-full accent-[#166534]"
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
