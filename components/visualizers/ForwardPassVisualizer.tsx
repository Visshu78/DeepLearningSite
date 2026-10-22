'use client';

import React, { useState, useMemo } from 'react';
import { ActivationType } from '@/lib/math/activations';
import { forwardPropagate, NetworkConfig, ForwardStepResult } from '@/lib/math/network';
import { RotateCcw, ChevronRight, ChevronLeft, BookOpen, Box } from 'lucide-react';
import { IsometricNetworkStackView } from './IsometricNetworkStackView';

export function ForwardPassVisualizer() {
  const [inputs, setInputs] = useState<[number, number]>([0.5, -0.4]);
  const [wHidden, setWHidden] = useState<[[number, number], [number, number]]>([
    [0.7, -0.5],
    [-0.4, 0.8]
  ]);
  const [bHidden, setBHidden] = useState<[number, number]>([0.1, -0.2]);
  const [wOutput, setWOutput] = useState<[number, number]>([0.9, -0.6]);
  const [bOutput, setBOutput] = useState<number>(0.2);
  const [activation, setActivation] = useState<ActivationType>('sigmoid');

  // View mode: 3D Wafer Stack vs 2D Schematic
  const [viewMode, setViewMode] = useState<'3d-stack' | '2d-schematic'>('3d-stack');

  // Control tabs for full parameter adjustability
  const [paramTab, setParamTab] = useState<'inputs' | 'hidden' | 'output'>('inputs');

  // Step state: 0=Inputs, 1=Hidden z, 2=Hidden a, 3=Output z, 4=Output a
  const [currentStep, setCurrentStep] = useState<number>(0);

  const config: NetworkConfig = useMemo(() => ({
    inputs,
    wHidden,
    bHidden,
    wOutput,
    bOutput,
    activation
  }), [inputs, wHidden, bHidden, wOutput, bOutput, activation]);

  const fwdResult: ForwardStepResult = useMemo(() => {
    return forwardPropagate(config);
  }, [config]);

  const stepNames = [
    '0. Input Features (x)',
    '1. Hidden Pre-activations (z^[1])',
    '2. Hidden Activations (a^[1])',
    '3. Output Pre-activation (z^[2])',
    '4. Final Prediction (y_hat)'
  ];

  const loadWorkedExample = () => {
    setInputs([0.5, -0.4]);
    setWHidden([
      [0.7, -0.5],
      [-0.4, 0.8]
    ]);
    setBHidden([0.1, -0.2]);
    setWOutput([0.9, -0.6]);
    setBOutput(0.2);
    setActivation('sigmoid');
    setCurrentStep(0);
  };

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-lg shadow-xs overflow-hidden">
      {/* Visualizer Header */}
      <div className="border-b border-[#EAE2D5] bg-[#FAF5EE] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#7A1C30]" aria-hidden="true"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1F191B]">
            2-2-1 Forward Propagation Engine
          </span>
        </div>

        {/* Stepper controls */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white p-0.5 rounded border border-[#EAE2D5] mr-1">
            <button
              type="button"
              onClick={() => setViewMode('3d-stack')}
              className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded transition-colors ${
                viewMode === '3d-stack'
                  ? 'bg-[#7A1C30] text-white shadow-2xs'
                  : 'text-[#54484E] hover:text-[#1F191B]'
              }`}
            >
              <Box className="w-3 h-3" />
              3D Wafer Stack
            </button>
            <button
              type="button"
              onClick={() => setViewMode('2d-schematic')}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded transition-colors ${
                viewMode === '2d-schematic'
                  ? 'bg-[#7A1C30] text-white shadow-2xs'
                  : 'text-[#54484E] hover:text-[#1F191B]'
              }`}
            >
              2D Flat
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-[#EAE2D5] bg-white text-[#1F191B] disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <span className="text-xs font-mono-num font-semibold px-2 py-1 bg-[#FAF2E6] text-[#7A1C30] rounded">
            Step {currentStep} / 4
          </span>

          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
            disabled={currentStep === 4}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[#7A1C30] text-white hover:bg-[#5F1424] disabled:opacity-40"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={loadWorkedExample}
            className="flex items-center gap-1 text-xs text-[#7A1C30] hover:text-[#5F1424] px-2 py-1 rounded border border-[#EEDAA2] bg-[#FAF2E6] transition-colors"
            title="Load worked example numbers"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Load Example</span>
          </button>

          <button
            type="button"
            onClick={loadWorkedExample}
            className="text-xs text-[#54484E] hover:text-[#1F191B] p-1.5 rounded border border-[#EAE2D5] bg-white"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#EAE2D5]">
        {/* Network Diagram View (3D Stack or 2D Schematic) */}
        <div className="lg:col-span-7 p-4 bg-[#FCFCFA] flex flex-col items-center justify-center min-h-[380px]">
          {viewMode === '3d-stack' ? (
            <IsometricNetworkStackView
              inputs={inputs}
              wHidden={wHidden}
              bHidden={bHidden}
              wOutput={wOutput}
              bOutput={bOutput}
              currentStep={currentStep}
              fwdResult={fwdResult}
            />
          ) : (
            <svg
              viewBox="0 0 540 300"
              className="w-full max-w-[540px] h-auto select-none"
              role="img"
              aria-label="Feedforward neural network diagram with 2 inputs, 2 hidden neurons, and 1 output neuron"
            >
              <title>2-2-1 Neural Network Forward Propagation</title>
              <desc>
                Interactive multi-layer perceptron showing signal transmission through input layer, hidden layer, and output neuron with current step highlighting.
              </desc>

              {/* Stage Column Labels */}
              <text x="70" y="25" textAnchor="middle" fontSize="11" fontWeight="600" fill="#54484E">INPUTS</text>
              <text x="270" y="25" textAnchor="middle" fontSize="11" fontWeight="600" fill="#54484E">HIDDEN LAYER (l=1)</text>
              <text x="470" y="25" textAnchor="middle" fontSize="11" fontWeight="600" fill="#54484E">OUTPUT (l=2)</text>

            {/* Connections: Input to Hidden 0 */}
            <path
              d="M 95 100 L 245 100"
              stroke={currentStep >= 1 ? (wHidden[0][0] >= 0 ? '#7A1C30' : '#B8860B') : '#D1D1C7'}
              strokeWidth={Math.max(1.5, Math.abs(wHidden[0][0]) * 3)}
              strokeDasharray={wHidden[0][0] >= 0 ? undefined : '5,3'}
              opacity={currentStep >= 1 ? '1' : '0.4'}
            />
            <path
              d="M 95 200 L 245 100"
              stroke={currentStep >= 1 ? (wHidden[0][1] >= 0 ? '#7A1C30' : '#B8860B') : '#D1D1C7'}
              strokeWidth={Math.max(1.5, Math.abs(wHidden[0][1]) * 3)}
              strokeDasharray={wHidden[0][1] >= 0 ? undefined : '5,3'}
              opacity={currentStep >= 1 ? '1' : '0.4'}
            />

            {/* Connections: Input to Hidden 1 */}
            <path
              d="M 95 100 L 245 200"
              stroke={currentStep >= 1 ? (wHidden[1][0] >= 0 ? '#7A1C30' : '#B8860B') : '#D1D1C7'}
              strokeWidth={Math.max(1.5, Math.abs(wHidden[1][0]) * 3)}
              strokeDasharray={wHidden[1][0] >= 0 ? undefined : '5,3'}
              opacity={currentStep >= 1 ? '1' : '0.4'}
            />
            <path
              d="M 95 200 L 245 200"
              stroke={currentStep >= 1 ? (wHidden[1][1] >= 0 ? '#7A1C30' : '#B8860B') : '#D1D1C7'}
              strokeWidth={Math.max(1.5, Math.abs(wHidden[1][1]) * 3)}
              strokeDasharray={wHidden[1][1] >= 0 ? undefined : '5,3'}
              opacity={currentStep >= 1 ? '1' : '0.4'}
            />

            {/* Connections: Hidden to Output */}
            <path
              d="M 295 100 L 445 150"
              stroke={currentStep >= 3 ? (wOutput[0] >= 0 ? '#7A1C30' : '#B8860B') : '#D1D1C7'}
              strokeWidth={Math.max(1.5, Math.abs(wOutput[0]) * 3)}
              strokeDasharray={wOutput[0] >= 0 ? undefined : '5,3'}
              opacity={currentStep >= 3 ? '1' : '0.4'}
            />
            <path
              d="M 295 200 L 445 150"
              stroke={currentStep >= 3 ? (wOutput[1] >= 0 ? '#7A1C30' : '#B8860B') : '#D1D1C7'}
              strokeWidth={Math.max(1.5, Math.abs(wOutput[1]) * 3)}
              strokeDasharray={wOutput[1] >= 0 ? undefined : '5,3'}
              opacity={currentStep >= 3 ? '1' : '0.4'}
            />

            {/* Input Neurons */}
            <g transform="translate(70, 100)">
              <circle r="25" fill="#FFFFFF" stroke="#7A1C30" strokeWidth={currentStep === 0 ? 3 : 1.5} />
              <text x="0" y="-3" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1F191B">x₁</text>
              <text x="0" y="11" textAnchor="middle" fontSize="10" className="font-mono-num" fill="#54484E">{inputs[0].toFixed(2)}</text>
            </g>

            <g transform="translate(70, 200)">
              <circle r="25" fill="#FFFFFF" stroke="#7A1C30" strokeWidth={currentStep === 0 ? 3 : 1.5} />
              <text x="0" y="-3" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1F191B">x₂</text>
              <text x="0" y="11" textAnchor="middle" fontSize="10" className="font-mono-num" fill="#54484E">{inputs[1].toFixed(2)}</text>
            </g>

            {/* Hidden Neuron 0 */}
            <g transform="translate(270, 100)">
              <circle
                r="26"
                fill={currentStep >= 2 ? '#FAF2E6' : '#FFFFFF'}
                stroke={currentStep === 1 || currentStep === 2 ? '#7A1C30' : '#D1D1C7'}
                strokeWidth={currentStep === 1 || currentStep === 2 ? 3 : 1.5}
              />
              <text x="0" y="-5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1F191B">h₁</text>
              <text x="0" y="8" textAnchor="middle" fontSize="9" className="font-mono-num font-semibold" fill="#7A1C30">
                {currentStep >= 2 ? `a=${fwdResult.aHidden[0].toFixed(2)}` : (currentStep >= 1 ? `z=${fwdResult.zHidden[0].toFixed(2)}` : '?')}
              </text>
              <text x="0" y="38" textAnchor="middle" fontSize="9" fill="#6E7682">b={bHidden[0].toFixed(2)}</text>
            </g>

            {/* Hidden Neuron 1 */}
            <g transform="translate(270, 200)">
              <circle
                r="26"
                fill={currentStep >= 2 ? '#FAF2E6' : '#FFFFFF'}
                stroke={currentStep === 1 || currentStep === 2 ? '#7A1C30' : '#D1D1C7'}
                strokeWidth={currentStep === 1 || currentStep === 2 ? 3 : 1.5}
              />
              <text x="0" y="-5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1F191B">h₂</text>
              <text x="0" y="8" textAnchor="middle" fontSize="9" className="font-mono-num font-semibold" fill="#7A1C30">
                {currentStep >= 2 ? `a=${fwdResult.aHidden[1].toFixed(2)}` : (currentStep >= 1 ? `z=${fwdResult.zHidden[1].toFixed(2)}` : '?')}
              </text>
              <text x="0" y="38" textAnchor="middle" fontSize="9" fill="#6E7682">b={bHidden[1].toFixed(2)}</text>
            </g>

            {/* Output Neuron */}
            <g transform="translate(470, 150)">
              <circle
                r="28"
                fill={currentStep >= 4 ? '#FAF2E6' : '#FFFFFF'}
                stroke={currentStep === 3 || currentStep === 4 ? '#7A1C30' : '#D1D1C7'}
                strokeWidth={currentStep === 3 || currentStep === 4 ? 3 : 1.5}
              />
              <text x="0" y="-6" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1F191B">Output</text>
              <text x="0" y="9" textAnchor="middle" fontSize="11" className="font-mono-num font-bold" fill="#7A1C30">
                {currentStep >= 4 ? fwdResult.prediction.toFixed(3) : (currentStep >= 3 ? `z=${fwdResult.zOutput.toFixed(2)}` : '?')}
              </text>
              <text x="0" y="40" textAnchor="middle" fontSize="9" fill="#6E7682">b={bOutput.toFixed(2)}</text>
            </g>
          </svg>
        )}

          {/* Stepper progress dots */}
          <div className="flex items-center gap-2 mt-3">
            {[0, 1, 2, 3, 4].map(idx => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx
                    ? 'w-6 bg-[#7A1C30]'
                    : (currentStep > idx ? 'w-2 bg-[#54484E]' : 'w-2 bg-[#D1D1C7]')
                }`}
                title={stepNames[idx]}
                aria-label={stepNames[idx]}
              />
            ))}
          </div>
        </div>

        {/* Step Calculation Breakdown & Comprehensive Parameter Controls */}
        <div className="lg:col-span-5 p-4 space-y-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7A1C30] mb-0.5">
              Current Calculation Stage
            </div>
            <h4 className="text-sm font-bold text-[#1F191B]">
              {stepNames[currentStep]}
            </h4>
          </div>

          {/* Contextual math breakdown for the current step */}
          <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded p-3 text-xs space-y-2">
            {currentStep === 0 && (
              <div>
                <p className="text-[#54484E] mb-2">
                  The network receives raw input vector <span className="font-mono-num font-medium text-[#1F191B]">x = [{inputs[0].toFixed(2)}, {inputs[1].toFixed(2)}]</span>.
                </p>
                <div className="text-[11px] text-[#6E7682]">
                  No computation has occurred yet. These values feed into the incoming synapses of hidden layer 1.
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-2">
                <div className="font-medium text-[#1F191B]">Computing Hidden Linear Pre-activations:</div>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#EAE2D5] space-y-1">
                  <div>z_h1 = (x₁·w₁₁) + (x₂·w₁₂) + b_h1</div>
                  <div className="text-[#7A1C30]">
                    = ({inputs[0]}×{wHidden[0][0]}) + ({inputs[1]}×{wHidden[0][1]}) + {bHidden[0]} = <strong>{fwdResult.zHidden[0].toFixed(3)}</strong>
                  </div>
                  <div className="pt-1 border-t border-[#EAE2D5]">z_h2 = (x₁·w₂₁) + (x₂·w₂₂) + b_h2</div>
                  <div className="text-[#7A1C30]">
                    = ({inputs[0]}×{wHidden[1][0]}) + ({inputs[1]}×{wHidden[1][1]}) + {bHidden[1]} = <strong>{fwdResult.zHidden[1].toFixed(3)}</strong>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-2">
                <div className="font-medium text-[#1F191B]">Applying Non-Linear Activation φ:</div>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#EAE2D5] space-y-1">
                  <div>a_h1 = φ({fwdResult.zHidden[0].toFixed(3)}) = <strong className="text-[#7A1C30]">{fwdResult.aHidden[0].toFixed(4)}</strong></div>
                  <div>a_h2 = φ({fwdResult.zHidden[1].toFixed(3)}) = <strong className="text-[#7A1C30]">{fwdResult.aHidden[1].toFixed(4)}</strong></div>
                </div>
                <p className="text-[11px] text-[#54484E]">
                  These post-activations form the hidden representation vector <span className="font-mono-num text-[#1F191B]">a^[1]</span>.
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-2">
                <div className="font-medium text-[#1F191B]">Computing Output Pre-activation:</div>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#EAE2D5] space-y-1">
                  <div>z_out = (a_h1 · w_out1) + (a_h2 · w_out2) + b_out</div>
                  <div className="text-[#7A1C30]">
                    = ({fwdResult.aHidden[0].toFixed(3)} × {wOutput[0]}) + ({fwdResult.aHidden[1].toFixed(3)} × {wOutput[1]}) + {bOutput} = <strong>{fwdResult.zOutput.toFixed(3)}</strong>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-2">
                <div className="font-medium text-[#1F191B]">Final Prediction Inference:</div>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#EAE2D5] space-y-1">
                  <div>ŷ = φ(z_out) = φ({fwdResult.zOutput.toFixed(3)}) = <strong className="text-base text-[#7A1C30]">{fwdResult.prediction.toFixed(4)}</strong></div>
                </div>
                <p className="text-[11px] text-[#54484E]">
                  Forward propagation is complete! The network converted 2 input dimensions into a single continuous scalar prediction.
                </p>
              </div>
            )}
          </div>

          {/* Full Parameter Adjustment Tabs */}
          <div className="pt-2 border-t border-[#EAE2D5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1F191B]">Full Parameter Controls:</span>
              <div className="inline-flex rounded border border-[#EAE2D5] bg-white p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setParamTab('inputs')}
                  className={`px-2 py-0.5 rounded ${paramTab === 'inputs' ? 'bg-[#7A1C30] text-white' : 'text-[#54484E]'}`}
                >
                  Inputs & Act
                </button>
                <button
                  type="button"
                  onClick={() => setParamTab('hidden')}
                  className={`px-2 py-0.5 rounded ${paramTab === 'hidden' ? 'bg-[#7A1C30] text-white' : 'text-[#54484E]'}`}
                >
                  Hidden Layer
                </button>
                <button
                  type="button"
                  onClick={() => setParamTab('output')}
                  className={`px-2 py-0.5 rounded ${paramTab === 'output' ? 'bg-[#7A1C30] text-white' : 'text-[#54484E]'}`}
                >
                  Output Layer
                </button>
              </div>
            </div>

            {paramTab === 'inputs' && (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#FAF5EE] p-2 rounded border border-[#EAE2D5]">
                    <div className="flex justify-between mb-1">
                      <label htmlFor="fwd-in-x1" className="text-[#54484E]">Input x₁</label>
                      <span className="font-mono-num font-semibold text-[#7A1C30]">{inputs[0].toFixed(2)}</span>
                    </div>
                    <input
                      id="fwd-in-x1"
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={inputs[0]}
                      onChange={e => setInputs([parseFloat(e.target.value), inputs[1]])}
                      className="w-full"
                    />
                  </div>
                  <div className="bg-[#FAF5EE] p-2 rounded border border-[#EAE2D5]">
                    <div className="flex justify-between mb-1">
                      <label htmlFor="fwd-in-x2" className="text-[#54484E]">Input x₂</label>
                      <span className="font-mono-num font-semibold text-[#7A1C30]">{inputs[1].toFixed(2)}</span>
                    </div>
                    <input
                      id="fwd-in-x2"
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={inputs[1]}
                      onChange={e => setInputs([inputs[0], parseFloat(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="bg-[#FAF5EE] p-2 rounded border border-[#EAE2D5] flex justify-between items-center">
                  <label htmlFor="fwd-activation" className="text-[#1F191B] font-medium">Network Activation φ</label>
                  <select
                    id="fwd-activation"
                    value={activation}
                    onChange={e => setActivation(e.target.value as ActivationType)}
                    className="text-xs bg-white border border-[#D1D1C7] rounded px-2 py-1 text-[#1F191B]"
                  >
                    <option value="sigmoid">Sigmoid (σ)</option>
                    <option value="relu">ReLU</option>
                    <option value="tanh">Tanh</option>
                    <option value="leaky_relu">Leaky ReLU</option>
                  </select>
                </div>
              </div>
            )}

            {paramTab === 'hidden' && (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#FAF5EE] p-2 rounded border border-[#EAE2D5]">
                    <div className="flex justify-between mb-0.5">
                      <label htmlFor="fwd-w00" className="text-[11px] text-[#54484E]">w₁₁ ({wHidden[0][0]})</label>
                    </div>
                    <input
                      id="fwd-w00"
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={wHidden[0][0]}
                      onChange={e => setWHidden([[parseFloat(e.target.value), wHidden[0][1]], wHidden[1]])}
                      className="w-full"
                    />
                  </div>
                  <div className="bg-[#FAF5EE] p-2 rounded border border-[#EAE2D5]">
                    <div className="flex justify-between mb-0.5">
                      <label htmlFor="fwd-w01" className="text-[11px] text-[#54484E]">w₁₂ ({wHidden[0][1]})</label>
                    </div>
                    <input
                      id="fwd-w01"
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={wHidden[0][1]}
                      onChange={e => setWHidden([[wHidden[0][0], parseFloat(e.target.value)], wHidden[1]])}
                      className="w-full"
                    />
                  </div>
                  <div className="bg-[#FAF5EE] p-2 rounded border border-[#EAE2D5]">
                    <div className="flex justify-between mb-0.5">
                      <label htmlFor="fwd-w10" className="text-[11px] text-[#54484E]">w₂₁ ({wHidden[1][0]})</label>
                    </div>
                    <input
                      id="fwd-w10"
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={wHidden[1][0]}
                      onChange={e => setWHidden([wHidden[0], [parseFloat(e.target.value), wHidden[1][1]]])}
                      className="w-full"
                    />
                  </div>
                  <div className="bg-[#FAF5EE] p-2 rounded border border-[#EAE2D5]">
                    <div className="flex justify-between mb-0.5">
                      <label htmlFor="fwd-w11" className="text-[11px] text-[#54484E]">w₂₂ ({wHidden[1][1]})</label>
                    </div>
                    <input
                      id="fwd-w11"
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={wHidden[1][1]}
                      onChange={e => setWHidden([wHidden[0], [wHidden[1][0], parseFloat(e.target.value)]])}
                      className="w-full"
                    />
                  </div>
                  <div className="bg-[#FFFDF5] p-2 rounded border border-[#FCD34D]">
                    <div className="flex justify-between mb-0.5">
                      <label htmlFor="fwd-bh0" className="text-[11px] text-[#B8860B]">b_h1 ({bHidden[0]})</label>
                    </div>
                    <input
                      id="fwd-bh0"
                      type="range"
                      min="-1.5"
                      max="1.5"
                      step="0.1"
                      value={bHidden[0]}
                      onChange={e => setBHidden([parseFloat(e.target.value), bHidden[1]])}
                      className="w-full"
                    />
                  </div>
                  <div className="bg-[#FFFDF5] p-2 rounded border border-[#FCD34D]">
                    <div className="flex justify-between mb-0.5">
                      <label htmlFor="fwd-bh1" className="text-[11px] text-[#B8860B]">b_h2 ({bHidden[1]})</label>
                    </div>
                    <input
                      id="fwd-bh1"
                      type="range"
                      min="-1.5"
                      max="1.5"
                      step="0.1"
                      value={bHidden[1]}
                      onChange={e => setBHidden([bHidden[0], parseFloat(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {paramTab === 'output' && (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#FAF5EE] p-2 rounded border border-[#EAE2D5]">
                    <div className="flex justify-between mb-0.5">
                      <label htmlFor="fwd-wout0" className="text-[11px] text-[#54484E]">w_out1 ({wOutput[0]})</label>
                    </div>
                    <input
                      id="fwd-wout0"
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={wOutput[0]}
                      onChange={e => setWOutput([parseFloat(e.target.value), wOutput[1]])}
                      className="w-full"
                    />
                  </div>
                  <div className="bg-[#FAF5EE] p-2 rounded border border-[#EAE2D5]">
                    <div className="flex justify-between mb-0.5">
                      <label htmlFor="fwd-wout1" className="text-[11px] text-[#54484E]">w_out2 ({wOutput[1]})</label>
                    </div>
                    <input
                      id="fwd-wout1"
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={wOutput[1]}
                      onChange={e => setWOutput([wOutput[0], parseFloat(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="bg-[#FFFDF5] p-2 rounded border border-[#FCD34D]">
                  <div className="flex justify-between mb-0.5">
                    <label htmlFor="fwd-bout" className="text-[11px] text-[#B8860B]">b_output ({bOutput})</label>
                  </div>
                  <input
                    id="fwd-bout"
                    type="range"
                    min="-1.5"
                    max="1.5"
                    step="0.1"
                    value={bOutput}
                    onChange={e => setBOutput(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
