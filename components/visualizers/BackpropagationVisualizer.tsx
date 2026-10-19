'use client';

import React, { useState, useMemo } from 'react';
import {
  NetworkConfig,
  backPropagate,
  applyGradients,
  numericalGradientCheck,
  BackpropResult
} from '@/lib/math/network';
import { CheckCircle2, RotateCcw, Zap, BookOpen, AlertCircle } from 'lucide-react';

export function BackpropagationVisualizer() {
  const [config, setConfig] = useState<NetworkConfig>({
    inputs: [0.6, -0.3],
    wHidden: [
      [0.5, -0.4],
      [-0.6, 0.7]
    ],
    bHidden: [0.1, -0.1],
    wOutput: [0.8, -0.5],
    bOutput: 0.15,
    activation: 'sigmoid'
  });

  const [target, setTarget] = useState<number>(0.9);
  const [learningRate, setLearningRate] = useState<number>(0.5);
  const [bpStep, setBpStep] = useState<number>(0);
  const [lastUpdateNotice, setLastUpdateNotice] = useState<string | null>(null);

  // Selected parameter to verify via finite-difference gradient check
  const [verifyParam, setVerifyParam] = useState<'wOut0' | 'wOut1' | 'bOut' | 'wH00' | 'wH01' | 'wH10' | 'wH11' | 'bH0' | 'bH1'>('wOut0');

  const bpResult: BackpropResult = useMemo(() => {
    return backPropagate(config, target);
  }, [config, target]);

  // Dynamic real finite-difference gradient calculation for the selected parameter
  const gradCheckData = useMemo(() => {
    let analyticalVal = 0;
    let accessor = {
      get: (c: NetworkConfig) => c.wOutput[0],
      set: (c: NetworkConfig, v: number) => ({ ...c, wOutput: [v, c.wOutput[1]] as [number, number] })
    };

    switch (verifyParam) {
      case 'wOut0':
        analyticalVal = bpResult.dL_dwOutput[0];
        accessor = {
          get: c => c.wOutput[0],
          set: (c, v) => ({ ...c, wOutput: [v, c.wOutput[1]] })
        };
        break;
      case 'wOut1':
        analyticalVal = bpResult.dL_dwOutput[1];
        accessor = {
          get: c => c.wOutput[1],
          set: (c, v) => ({ ...c, wOutput: [c.wOutput[0], v] })
        };
        break;
      case 'bOut':
        analyticalVal = bpResult.dL_dbOutput;
        accessor = {
          get: c => c.bOutput,
          set: (c, v) => ({ ...c, bOutput: v })
        };
        break;
      case 'wH00':
        analyticalVal = bpResult.dL_dwHidden[0][0];
        accessor = {
          get: c => c.wHidden[0][0],
          set: (c, v) => ({ ...c, wHidden: [[v, c.wHidden[0][1]], c.wHidden[1]] })
        };
        break;
      case 'wH01':
        analyticalVal = bpResult.dL_dwHidden[0][1];
        accessor = {
          get: c => c.wHidden[0][1],
          set: (c, v) => ({ ...c, wHidden: [[c.wHidden[0][0], v], c.wHidden[1]] })
        };
        break;
      case 'wH10':
        analyticalVal = bpResult.dL_dwHidden[1][0];
        accessor = {
          get: c => c.wHidden[1][0],
          set: (c, v) => ({ ...c, wHidden: [c.wHidden[0], [v, c.wHidden[1][1]]] })
        };
        break;
      case 'wH11':
        analyticalVal = bpResult.dL_dwHidden[1][1];
        accessor = {
          get: c => c.wHidden[1][1],
          set: (c, v) => ({ ...c, wHidden: [c.wHidden[0], [c.wHidden[1][0], v]] })
        };
        break;
      case 'bH0':
        analyticalVal = bpResult.dL_dbHidden[0];
        accessor = {
          get: c => c.bHidden[0],
          set: (c, v) => ({ ...c, bHidden: [v, c.bHidden[1]] })
        };
        break;
      case 'bH1':
        analyticalVal = bpResult.dL_dbHidden[1];
        accessor = {
          get: c => c.bHidden[1],
          set: (c, v) => ({ ...c, bHidden: [c.bHidden[0], v] })
        };
        break;
    }

    const numericalVal = numericalGradientCheck(config, target, accessor, 1e-5);
    const diff = Math.abs(analyticalVal - numericalVal);
    const isExact = diff < 1e-4;

    return {
      param: verifyParam,
      analytical: analyticalVal,
      numerical: numericalVal,
      diff,
      isExact
    };
  }, [config, target, verifyParam, bpResult]);

  const stepLabels = [
    '0. Forward Inference & Loss Evaluation',
    '1. Loss Derivative (dL/dPred)',
    '2. Output Layer Error Delta (dL/dzOut)',
    '3. Output Weight Gradients (dL/dwOut)',
    '4. Hidden Layer Error Deltas (dL/dzHidden)',
    '5. Hidden Weight & Bias Gradients',
    '6. Gradient Descent Parameter Updates (theta <- theta - eta*grad)'
  ];

  const applyOneOptimizationStep = () => {
    const prevLoss = bpResult.loss;
    const nextConfig = applyGradients(config, bpResult, learningRate);
    const nextBp = backPropagate(nextConfig, target);
    setConfig(nextConfig);
    setLastUpdateNotice(
      `Updated all parameters! Loss dropped from ${prevLoss.toFixed(4)} → ${nextBp.loss.toFixed(4)} (Δ = ${(prevLoss - nextBp.loss).toFixed(4)})`
    );
    setBpStep(0);
  };

  const loadWorkedExample = () => {
    setConfig({
      inputs: [0.6, -0.3],
      wHidden: [
        [0.5, -0.4],
        [-0.6, 0.7]
      ],
      bHidden: [0.1, -0.1],
      wOutput: [0.8, -0.5],
      bOutput: 0.15,
      activation: 'sigmoid'
    });
    setTarget(0.9);
    setLearningRate(0.5);
    setBpStep(0);
    setLastUpdateNotice(null);
  };

  return (
    <div className="bg-white border border-[#E6E6E0] rounded-lg shadow-xs overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#E6E6E0] bg-[#FAF8F5] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#B45309]" aria-hidden="true"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#18191B]">
            Chain Rule Backpropagation Engine
          </span>
          <span className="text-xs text-[#4A525D] hidden sm:inline">
            — Error flowing backwards
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setBpStep(prev => Math.max(0, prev - 1))}
            disabled={bpStep === 0}
            className="text-xs px-2.5 py-1 rounded border border-[#E6E6E0] bg-white text-[#18191B] disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-xs font-mono-num font-semibold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded">
            Step {bpStep} / 6
          </span>
          <button
            type="button"
            onClick={() => setBpStep(prev => Math.min(6, prev + 1))}
            disabled={bpStep === 6}
            className="text-xs px-2.5 py-1 rounded bg-[#B45309] text-white hover:bg-[#92400E] disabled:opacity-40"
          >
            Next Step
          </button>

          <button
            type="button"
            onClick={loadWorkedExample}
            className="flex items-center gap-1 text-xs text-[#0D6E6E] hover:text-[#085252] px-2 py-1 rounded border border-[#B7E2E2] bg-[#EEF7F7] ml-2"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Example</span>
          </button>

          <button
            type="button"
            onClick={loadWorkedExample}
            className="text-xs text-[#5C626B] hover:text-[#18191B] p-1.5 rounded border border-[#E6E6E0] bg-white"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E6E6E0]">
        {/* SVG Diagram with Backward Gradient Arrows */}
        <div className="lg:col-span-7 p-4 bg-[#FCFCFA] flex flex-col items-center justify-center min-h-[380px]">
          <svg
            viewBox="0 0 540 300"
            className="w-full max-w-[540px] h-auto select-none"
            role="img"
            aria-label="Backpropagation diagram showing reverse derivative flow through neural network"
          >
            <title>Backpropagation Chain Rule Flow</title>
            <desc>
              Network connections with backward amber arrows indicating propagation of error delta from loss to output and hidden layers.
            </desc>

            <defs>
              <marker id="back-arrow" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
                <polygon points="6 0, 0 3, 6 6" fill="#B45309" />
              </marker>
            </defs>

            {/* Stage Labels */}
            <text x="70" y="25" textAnchor="middle" fontSize="11" fontWeight="600" fill="#4A525D">INPUTS</text>
            <text x="250" y="25" textAnchor="middle" fontSize="11" fontWeight="600" fill="#4A525D">HIDDEN LAYER</text>
            <text x="430" y="25" textAnchor="middle" fontSize="11" fontWeight="600" fill="#4A525D">OUTPUT & LOSS</text>

            {/* Backward error arrow: Loss -> Output */}
            {bpStep >= 1 && (
              <line x1="490" y1="150" x2="455" y2="150" stroke="#B45309" strokeWidth="2.5" markerEnd="url(#back-arrow)" />
            )}

            {/* Backward error arrows: Output -> Hidden Layer */}
            {bpStep >= 4 && (
              <>
                <line x1="405" y1="150" x2="275" y2="105" stroke="#B45309" strokeWidth="2" strokeDasharray="3,2" markerEnd="url(#back-arrow)" />
                <line x1="405" y1="150" x2="275" y2="195" stroke="#B45309" strokeWidth="2" strokeDasharray="3,2" markerEnd="url(#back-arrow)" />
              </>
            )}

            {/* Input Neurons */}
            <g transform="translate(70, 100)">
              <circle r="24" fill="#FFFFFF" stroke="#D1D1C7" strokeWidth="1.5" />
              <text x="0" y="-3" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#18191B">x₁</text>
              <text x="0" y="11" textAnchor="middle" fontSize="10" className="font-mono-num" fill="#4A525D">{config.inputs[0].toFixed(2)}</text>
            </g>
            <g transform="translate(70, 200)">
              <circle r="24" fill="#FFFFFF" stroke="#D1D1C7" strokeWidth="1.5" />
              <text x="0" y="-3" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#18191B">x₂</text>
              <text x="0" y="11" textAnchor="middle" fontSize="10" className="font-mono-num" fill="#4A525D">{config.inputs[1].toFixed(2)}</text>
            </g>

            {/* Hidden Neuron 0 */}
            <g transform="translate(250, 100)">
              <circle
                r="26"
                fill={bpStep >= 4 ? '#FFFDF5' : '#FFFFFF'}
                stroke={bpStep >= 4 ? '#B45309' : '#D1D1C7'}
                strokeWidth={bpStep >= 4 ? 2.5 : 1.5}
              />
              <text x="0" y="-5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#18191B">h₁</text>
              <text x="0" y="8" textAnchor="middle" fontSize="9" className="font-mono-num" fill="#4A525D">
                a={bpResult.forward.aHidden[0].toFixed(2)}
              </text>
              {bpStep >= 4 && (
                <text x="0" y="38" textAnchor="middle" fontSize="9" className="font-mono-num font-bold" fill="#B45309">
                  δ₁={bpResult.dL_dzHidden[0].toFixed(3)}
                </text>
              )}
            </g>

            {/* Hidden Neuron 1 */}
            <g transform="translate(250, 200)">
              <circle
                r="26"
                fill={bpStep >= 4 ? '#FFFDF5' : '#FFFFFF'}
                stroke={bpStep >= 4 ? '#B45309' : '#D1D1C7'}
                strokeWidth={bpStep >= 4 ? 2.5 : 1.5}
              />
              <text x="0" y="-5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#18191B">h₂</text>
              <text x="0" y="8" textAnchor="middle" fontSize="9" className="font-mono-num" fill="#4A525D">
                a={bpResult.forward.aHidden[1].toFixed(2)}
              </text>
              {bpStep >= 4 && (
                <text x="0" y="38" textAnchor="middle" fontSize="9" className="font-mono-num font-bold" fill="#B45309">
                  δ₂={bpResult.dL_dzHidden[1].toFixed(3)}
                </text>
              )}
            </g>

            {/* Output Neuron */}
            <g transform="translate(430, 150)">
              <circle
                r="28"
                fill={bpStep >= 2 ? '#FFFDF5' : '#FFFFFF'}
                stroke={bpStep >= 2 ? '#B45309' : '#0D6E6E'}
                strokeWidth={bpStep >= 2 ? 3 : 1.5}
              />
              <text x="0" y="-6" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#18191B">ŷ</text>
              <text x="0" y="8" textAnchor="middle" fontSize="11" className="font-mono-num font-bold" fill="#0D6E6E">
                {bpResult.forward.prediction.toFixed(3)}
              </text>
              {bpStep >= 2 && (
                <text x="0" y="42" textAnchor="middle" fontSize="9" className="font-mono-num font-bold" fill="#B45309">
                  δ_out={bpResult.dL_dzOutput.toFixed(3)}
                </text>
              )}
            </g>

            {/* Target & Loss Box */}
            <g transform="translate(505, 150)">
              <rect x="-25" y="-24" width="50" height="48" rx="4" fill="#FFFFFF" stroke="#D1D1C7" strokeWidth="1" />
              <text x="0" y="-8" textAnchor="middle" fontSize="9" fill="#4A525D">Target y</text>
              <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#15803D">{target.toFixed(1)}</text>
              <text x="0" y="16" textAnchor="middle" fontSize="9" className="font-mono-num font-bold" fill="#B45309">L={bpResult.loss.toFixed(3)}</text>
            </g>
          </svg>

          {/* Dynamic Finite Difference Verification Bar */}
          <div className="w-full max-w-[500px] mt-3 p-2.5 bg-[#FAF8F5] border border-[#E6E6E0] rounded space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#18191B]">Finite-Difference Gradient Check:</span>
              <select
                aria-label="Parameter to check with finite difference"
                value={verifyParam}
                onChange={e => setVerifyParam(e.target.value as 'wOut0' | 'wOut1' | 'bOut' | 'wH00' | 'wH01' | 'wH10' | 'wH11' | 'bH0' | 'bH1')}
                className="text-xs bg-white border border-[#D1D1C7] rounded px-2 py-0.5 text-[#18191B]"
              >
                <option value="wOut0">Output Weight w_out1</option>
                <option value="wOut1">Output Weight w_out2</option>
                <option value="bOut">Output Bias b_out</option>
                <option value="wH00">Hidden Weight w₁₁</option>
                <option value="wH01">Hidden Weight w₁₂</option>
                <option value="wH10">Hidden Weight w₂₁</option>
                <option value="wH11">Hidden Weight w₂₂</option>
                <option value="bH0">Hidden Bias b_h1</option>
                <option value="bH1">Hidden Bias b_h2</option>
              </select>
            </div>

            <div className="flex items-center justify-between font-mono-num text-[11px] pt-1 border-t border-[#E6E6E0]">
              <span>Analytical: <strong>{gradCheckData.analytical.toFixed(5)}</strong></span>
              <span>Numerical (ε=1e-5): <strong>{gradCheckData.numerical.toFixed(5)}</strong></span>
              <span className={`font-bold flex items-center gap-1 ${gradCheckData.isExact ? 'text-[#166534]' : 'text-[#B91C1C]'}`}>
                {gradCheckData.isExact ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Exact (|Δ| &lt; 1e-4)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Mismatch (|Δ|={gradCheckData.diff.toFixed(4)})</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Step-by-Step Chain Rule Math & Dynamic Controls */}
        <div className="lg:col-span-5 p-4 space-y-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#B45309] mb-0.5">
              Backpropagation Sequence
            </div>
            <h4 className="text-sm font-bold text-[#18191B]">
              {stepLabels[bpStep]}
            </h4>
          </div>

          {/* Contextual math for current step */}
          <div className="bg-[#FAF8F5] border border-[#E6E6E0] rounded p-3 text-xs space-y-2">
            {bpStep === 0 && (
              <div className="space-y-1">
                <p className="text-[#4A525D]">
                  Model predicted <strong>ŷ = {bpResult.forward.prediction.toFixed(4)}</strong> for target <strong>y = {target.toFixed(2)}</strong>.
                </p>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#E6E6E0]">
                  Loss L = 0.5 × (ŷ - y)² = 0.5 × ({bpResult.forward.prediction.toFixed(3)} - {target})² = <strong className="text-[#B45309]">{bpResult.loss.toFixed(4)}</strong>
                </div>
              </div>
            )}

            {bpStep === 1 && (
              <div className="space-y-1">
                <div className="font-medium text-[#18191B]">Loss Gradient wrt Prediction:</div>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#E6E6E0]">
                  ∂L/∂ŷ = ŷ - y = {bpResult.forward.prediction.toFixed(4)} - {target} = <strong className="text-[#B45309]">{bpResult.dL_dPred.toFixed(4)}</strong>
                </div>
                <p className="text-[11px] text-[#4A525D]">
                  This is the anchor derivative where error propagation starts.
                </p>
              </div>
            )}

            {bpStep === 2 && (
              <div className="space-y-1">
                <div className="font-medium text-[#18191B]">Output Layer Delta (Chain Rule):</div>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#E6E6E0] space-y-1">
                  <div>δ_out = ∂L/∂z_out = (∂L/∂ŷ) · φ&apos;(z_out)</div>
                  <div className="text-[#B45309]">
                    = {bpResult.dL_dPred.toFixed(4)} × {bpResult.forward.outputDerivative.toFixed(4)} = <strong>{bpResult.dL_dzOutput.toFixed(4)}</strong>
                  </div>
                </div>
              </div>
            )}

            {bpStep === 3 && (
              <div className="space-y-1">
                <div className="font-medium text-[#18191B]">Output Weights & Bias Gradients:</div>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#E6E6E0] space-y-1">
                  <div>∂L/∂w_out1 = δ_out · a_h1 = {bpResult.dL_dzOutput.toFixed(3)} × {bpResult.forward.aHidden[0].toFixed(3)} = <strong className="text-[#B45309]">{bpResult.dL_dwOutput[0].toFixed(4)}</strong></div>
                  <div>∂L/∂w_out2 = δ_out · a_h2 = {bpResult.dL_dzOutput.toFixed(3)} × {bpResult.forward.aHidden[1].toFixed(3)} = <strong className="text-[#B45309]">{bpResult.dL_dwOutput[1].toFixed(4)}</strong></div>
                  <div>∂L/∂b_out = δ_out · 1 = <strong className="text-[#B45309]">{bpResult.dL_dbOutput.toFixed(4)}</strong></div>
                </div>
              </div>
            )}

            {bpStep === 4 && (
              <div className="space-y-1">
                <div className="font-medium text-[#18191B]">Hidden Layer Error Deltas:</div>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#E6E6E0] space-y-1">
                  <div>δ_h1 = (δ_out · w_out1) · φ&apos;(z_h1) = <strong className="text-[#B45309]">{bpResult.dL_dzHidden[0].toFixed(4)}</strong></div>
                  <div>δ_h2 = (δ_out · w_out2) · φ&apos;(z_h2) = <strong className="text-[#B45309]">{bpResult.dL_dzHidden[1].toFixed(4)}</strong></div>
                </div>
              </div>
            )}

            {bpStep === 5 && (
              <div className="space-y-1">
                <div className="font-medium text-[#18191B]">Hidden Weights & Biases Gradients:</div>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#E6E6E0] space-y-1">
                  <div>∂L/∂w₁₁ = δ_h1 · x₁ = <strong className="text-[#B45309]">{bpResult.dL_dwHidden[0][0].toFixed(4)}</strong></div>
                  <div>∂L/∂w₁₂ = δ_h1 · x₂ = <strong className="text-[#B45309]">{bpResult.dL_dwHidden[0][1].toFixed(4)}</strong></div>
                  <div>∂L/∂w₂₁ = δ_h2 · x₁ = <strong className="text-[#B45309]">{bpResult.dL_dwHidden[1][0].toFixed(4)}</strong></div>
                  <div>∂L/∂w₂₂ = δ_h2 · x₂ = <strong className="text-[#B45309]">{bpResult.dL_dwHidden[1][1].toFixed(4)}</strong></div>
                  <div className="pt-1 border-t border-[#E6E6E0]">∂L/∂b_h1 = δ_h1 = <strong className="text-[#B45309]">{bpResult.dL_dbHidden[0].toFixed(4)}</strong></div>
                  <div>∂L/∂b_h2 = δ_h2 = <strong className="text-[#B45309]">{bpResult.dL_dbHidden[1].toFixed(4)}</strong></div>
                </div>
              </div>
            )}

            {bpStep === 6 && (
              <div className="space-y-1">
                <div className="font-medium text-[#18191B]">Parameter Update Rule: θ_new = θ - η(dL/dθ)</div>
                <p className="text-[11px] text-[#4A525D]">
                  All 9 parameter gradients are ready. Below is how taking 1 gradient step will modify parameters and decrease the loss.
                </p>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#E6E6E0] space-y-0.5">
                  <div>w_out1: {config.wOutput[0].toFixed(3)} → {(config.wOutput[0] - learningRate * bpResult.dL_dwOutput[0]).toFixed(3)}</div>
                  <div>w_out2: {config.wOutput[1].toFixed(3)} → {(config.wOutput[1] - learningRate * bpResult.dL_dwOutput[1]).toFixed(3)}</div>
                  <div>w₁₁: {config.wHidden[0][0].toFixed(3)} → {(config.wHidden[0][0] - learningRate * bpResult.dL_dwHidden[0][0]).toFixed(3)}</div>
                  <div>w₂₁: {config.wHidden[1][0].toFixed(3)} → {(config.wHidden[1][0] - learningRate * bpResult.dL_dwHidden[1][0]).toFixed(3)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Parameters Adjusters */}
          <div className="space-y-2 pt-1 border-t border-[#E6E6E0]">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label htmlFor="bp-target-slider" className="text-[#18191B] font-medium">Target y ({target.toFixed(2)})</label>
                <input
                  id="bp-target-slider"
                  type="range"
                  min="0.1"
                  max="0.95"
                  step="0.05"
                  value={target}
                  onChange={e => setTarget(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="bp-lr-slider" className="text-[#B45309] font-medium">Learning Rate η ({learningRate})</label>
                <input
                  id="bp-lr-slider"
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.1"
                  value={learningRate}
                  onChange={e => setLearningRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label htmlFor="bp-x1" className="text-[#4A525D]">Input x₁ ({config.inputs[0]})</label>
                <input
                  id="bp-x1"
                  type="range"
                  min="-1.5"
                  max="1.5"
                  step="0.1"
                  value={config.inputs[0]}
                  onChange={e => setConfig(prev => ({ ...prev, inputs: [parseFloat(e.target.value), prev.inputs[1]] }))}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="bp-x2" className="text-[#4A525D]">Input x₂ ({config.inputs[1]})</label>
                <input
                  id="bp-x2"
                  type="range"
                  min="-1.5"
                  max="1.5"
                  step="0.1"
                  value={config.inputs[1]}
                  onChange={e => setConfig(prev => ({ ...prev, inputs: [prev.inputs[0], parseFloat(e.target.value)] }))}
                  className="w-full"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={applyOneOptimizationStep}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded bg-[#0D6E6E] text-white hover:bg-[#085252] transition-colors mt-2"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Apply 1 Gradient Step & Update Parameters</span>
            </button>
            {lastUpdateNotice && (
              <div className="text-[11px] text-[#15803D] font-medium pt-1">
                {lastUpdateNotice}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
