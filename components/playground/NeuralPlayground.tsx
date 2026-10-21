'use client';

import React, { useState, useMemo } from 'react';
import { ActivationType, applyActivation } from '@/lib/math/activations';
import { RotateCcw, Play, RefreshCw, ChevronRight, Sliders, ChevronLeft } from 'lucide-react';

// Seeded deterministic pseudo-random generator
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function NeuralPlayground() {
  const [numInputs, setNumInputs] = useState<number>(2);
  const [numHidden, setNumHidden] = useState<number>(3);
  const [activation, setActivation] = useState<ActivationType>('relu');
  const [seed, setSeed] = useState<number>(42);

  // Input vector (up to 4)
  const [inputs, setInputs] = useState<number[]>([1.0, -0.5, 0.8, -1.2]);

  // Hidden weights matrix: 6 x 4
  const [weightsHidden, setWeightsHidden] = useState<number[][]>([
    [0.8, -0.6, 0.4, -0.2],
    [-0.5, 0.9, -0.3, 0.7],
    [0.3, -0.4, 0.6, -0.8],
    [-0.7, 0.2, -0.5, 0.4],
    [0.4, -0.8, 0.3, -0.6],
    [-0.2, 0.5, -0.4, 0.9]
  ]);

  // Hidden biases
  const [biasesHidden, setBiasesHidden] = useState<number[]>([0.1, -0.2, 0.3, 0.0, -0.1, 0.2]);

  // Output weights & bias
  const [weightsOutput, setWeightsOutput] = useState<number[]>([0.7, -0.5, 0.6, -0.4, 0.8, -0.3]);
  const [biasOutput, setBiasOutput] = useState<number>(0.1);

  // Stepping state: 0 = Inputs, 1 = Hidden Layer, 2 = Output
  const [activeStep, setActiveStep] = useState<number>(2);

  // Selected connection to edit directly
  const [editingTarget, setEditingTarget] = useState<{ type: 'hidden' | 'output'; h: number; i?: number }>({
    type: 'hidden',
    h: 0,
    i: 0
  });

  // Forward computation
  const computation = useMemo(() => {
    const activeInputs = inputs.slice(0, numInputs);

    const hiddenZ: number[] = [];
    const hiddenA: number[] = [];
    const hiddenProducts: number[][] = [];

    for (let h = 0; h < numHidden; h++) {
      const prods: number[] = [];
      let sum = 0;
      for (let i = 0; i < numInputs; i++) {
        const p = activeInputs[i] * weightsHidden[h][i];
        prods.push(p);
        sum += p;
      }
      const z = sum + biasesHidden[h];
      const a = applyActivation(activation, z);
      hiddenProducts.push(prods);
      hiddenZ.push(z);
      hiddenA.push(a);
    }

    let outSum = 0;
    const outProds: number[] = [];
    for (let h = 0; h < numHidden; h++) {
      const p = hiddenA[h] * weightsOutput[h];
      outProds.push(p);
      outSum += p;
    }
    const outZ = outSum + biasOutput;
    const prediction = applyActivation(activation, outZ);

    return {
      activeInputs,
      hiddenProducts,
      hiddenZ,
      hiddenA,
      outProds,
      outZ,
      prediction
    };
  }, [numInputs, numHidden, inputs, weightsHidden, biasesHidden, weightsOutput, biasOutput, activation]);

  // Deterministic seeded randomizer
  const randomizeWeights = () => {
    let currentSeed = seed + 1;
    setSeed(currentSeed);

    setWeightsHidden(prev =>
      prev.map(row =>
        row.map(() => {
          const val = seededRandom(currentSeed++) * 2 - 1;
          return parseFloat(val.toFixed(2));
        })
      )
    );
    setWeightsOutput(prev =>
      prev.map(() => {
        const val = seededRandom(currentSeed++) * 2 - 1;
        return parseFloat(val.toFixed(2));
      })
    );
    setBiasesHidden(prev =>
      prev.map(() => {
        const val = seededRandom(currentSeed++) * 1 - 0.5;
        return parseFloat(val.toFixed(2));
      })
    );
    setBiasOutput(parseFloat((seededRandom(currentSeed++) * 1 - 0.5).toFixed(2)));
  };

  const resetDefaults = () => {
    setNumInputs(2);
    setNumHidden(3);
    setActivation('relu');
    setSeed(42);
    setInputs([1.0, -0.5, 0.8, -1.2]);
    setWeightsHidden([
      [0.8, -0.6, 0.4, -0.2],
      [-0.5, 0.9, -0.3, 0.7],
      [0.3, -0.4, 0.6, -0.8],
      [-0.7, 0.2, -0.5, 0.4],
      [0.4, -0.8, 0.3, -0.6],
      [-0.2, 0.5, -0.4, 0.9]
    ]);
    setBiasesHidden([0.1, -0.2, 0.3, 0.0, -0.1, 0.2]);
    setWeightsOutput([0.7, -0.5, 0.6, -0.4, 0.8, -0.3]);
    setBiasOutput(0.1);
    setActiveStep(2);
  };

  const svgWidth = 560;
  const svgHeight = 340;
  const xInput = 80;
  const xHidden = 280;
  const xOutput = 480;

  const getYCoords = (count: number) => {
    const spacing = 280 / (count + 1);
    const coords: number[] = [];
    for (let i = 1; i <= count; i++) {
      coords.push(30 + i * spacing);
    }
    return coords;
  };

  const inputYCoords = getYCoords(numInputs);
  const hiddenYCoords = getYCoords(numHidden);
  const outputY = svgHeight / 2;

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-lg shadow-xs overflow-hidden">
      {/* Sandbox Toolbar */}
      <div className="p-4 border-b border-[#EAE2D5] bg-[#FAF5EE] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#7A1C30]" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1F191B]">
              Neural Sandbox
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#54484E]">Inputs:</span>
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setNumInputs(n)}
                className={`w-6 h-6 rounded text-xs font-mono-num font-medium border ${
                  numInputs === n
                    ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                    : 'bg-white border-[#EAE2D5] text-[#1F191B] hover:border-[#7A1C30]'
                }`}
                aria-label={`Set ${n} inputs`}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#54484E]">Hidden:</span>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setNumHidden(n)}
                className={`w-6 h-6 rounded text-xs font-mono-num font-medium border ${
                  numHidden === n
                    ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                    : 'bg-white border-[#EAE2D5] text-[#1F191B] hover:border-[#7A1C30]'
                }`}
                aria-label={`Set ${n} hidden neurons`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Stepper buttons */}
          <div className="flex items-center gap-1 bg-white border border-[#EAE2D5] rounded p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="p-1 text-[#54484E] hover:text-[#1F191B] disabled:opacity-30"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono-num text-[11px] font-semibold text-[#7A1C30]">
              {activeStep === 0 ? 'Inputs' : (activeStep === 1 ? 'Hidden' : 'Output')}
            </span>
            <button
              type="button"
              onClick={() => setActiveStep(prev => Math.min(2, prev + 1))}
              disabled={activeStep === 2}
              className="p-1 text-[#54484E] hover:text-[#1F191B] disabled:opacity-30"
              aria-label="Next step"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[#7A1C30] text-white hover:bg-[#5F1424]"
          >
            <Play className="w-3 h-3" />
            <span>Run Pass</span>
          </button>

          {/* Activation selector */}
          <select
            aria-label="Playground activation function"
            value={activation}
            onChange={e => setActivation(e.target.value as ActivationType)}
            className="text-xs bg-white border border-[#D1D1C7] rounded px-2 py-1 text-[#1F191B]"
          >
            <option value="relu">ReLU</option>
            <option value="sigmoid">Sigmoid</option>
            <option value="tanh">Tanh</option>
            <option value="leaky_relu">Leaky ReLU</option>
          </select>

          <button
            type="button"
            onClick={randomizeWeights}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-[#EAE2D5] bg-white text-[#1F191B] hover:border-[#7A1C30]"
            title={`Seeded random parameters (Seed: ${seed})`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#54484E]" />
            <span>Randomize</span>
          </button>

          <button
            type="button"
            onClick={resetDefaults}
            className="text-xs text-[#54484E] hover:text-[#1F191B] p-1.5 rounded border border-[#EAE2D5] bg-white"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#EAE2D5]">
        {/* SVG Network Graph */}
        <div className="lg:col-span-7 p-4 bg-[#FCFCFA] flex flex-col items-center justify-center min-h-[400px]">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full max-w-[560px] h-auto select-none"
            role="img"
            aria-label="Interactive configurable neural network architecture diagram"
          >
            <title>Neural Architecture Diagram</title>
            <desc>
              Configurable network showing inputs, hidden neurons, and output neuron with weighted synapses.
            </desc>

            {/* Layer Column Titles */}
            <text x={xInput} y="20" textAnchor="middle" fontSize="10" fontWeight="600" fill="#54484E">
              INPUT ({numInputs})
            </text>
            <text x={xHidden} y="20" textAnchor="middle" fontSize="10" fontWeight="600" fill="#54484E">
              HIDDEN LAYER ({numHidden})
            </text>
            <text x={xOutput} y="20" textAnchor="middle" fontSize="10" fontWeight="600" fill="#54484E">
              OUTPUT (1)
            </text>

            {/* Connections: Input -> Hidden */}
            {inputYCoords.map((iy, iIdx) =>
              hiddenYCoords.map((hy, hIdx) => {
                const w = weightsHidden[hIdx][iIdx];
                const isSelected = editingTarget.type === 'hidden' && editingTarget.h === hIdx && editingTarget.i === iIdx;
                return (
                  <line
                    key={`in-${iIdx}-hid-${hIdx}`}
                    x1={xInput + 20}
                    y1={iy}
                    x2={xHidden - 20}
                    y2={hy}
                    stroke={isSelected ? '#1F191B' : (w >= 0 ? '#7A1C30' : '#B8860B')}
                    strokeWidth={isSelected ? 4 : Math.max(1, Math.min(4, Math.abs(w) * 2.5))}
                    strokeDasharray={w >= 0 ? undefined : '4,3'}
                    opacity={activeStep >= 1 ? 0.85 : 0.2}
                    className="cursor-pointer"
                    onClick={() => setEditingTarget({ type: 'hidden', h: hIdx, i: iIdx })}
                  />
                );
              })
            )}

            {/* Connections: Hidden -> Output */}
            {hiddenYCoords.map((hy, hIdx) => {
              const w = weightsOutput[hIdx];
              const isSelected = editingTarget.type === 'output' && editingTarget.h === hIdx;
              return (
                <line
                  key={`hid-${hIdx}-out`}
                  x1={xHidden + 20}
                  y1={hy}
                  x2={xOutput - 24}
                  y2={outputY}
                  stroke={isSelected ? '#1F191B' : (w >= 0 ? '#7A1C30' : '#B8860B')}
                  strokeWidth={isSelected ? 4 : Math.max(1, Math.min(4, Math.abs(w) * 2.5))}
                  strokeDasharray={w >= 0 ? undefined : '4,3'}
                  opacity={activeStep >= 2 ? 0.85 : 0.2}
                  className="cursor-pointer"
                  onClick={() => setEditingTarget({ type: 'output', h: hIdx })}
                />
              );
            })}

            {/* Input Neurons */}
            {inputYCoords.map((iy, iIdx) => (
              <g key={`node-in-${iIdx}`} transform={`translate(${xInput}, ${iy})`}>
                <circle r="20" fill="#FFFFFF" stroke="#7A1C30" strokeWidth={activeStep === 0 ? 3 : 1.5} />
                <text x="0" y="-2" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1F191B">
                  x{iIdx + 1}
                </text>
                <text x="0" y="10" textAnchor="middle" fontSize="9" className="font-mono-num font-semibold" fill="#7A1C30">
                  {inputs[iIdx].toFixed(1)}
                </text>
              </g>
            ))}

            {/* Hidden Neurons */}
            {hiddenYCoords.map((hy, hIdx) => (
              <g key={`node-hid-${hIdx}`} transform={`translate(${xHidden}, ${hy})`}>
                <circle r="20" fill="#FAF2E6" stroke="#7A1C30" strokeWidth={activeStep === 1 ? 3 : 1.5} />
                <text x="0" y="-3" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1F191B">
                  h{hIdx + 1}
                </text>
                <text x="0" y="9" textAnchor="middle" fontSize="9" className="font-mono-num font-bold" fill="#7A1C30">
                  {activeStep >= 1 ? computation.hiddenA[hIdx].toFixed(2) : '?'}
                </text>
              </g>
            ))}

            {/* Output Neuron */}
            <g transform={`translate(${xOutput}, ${outputY})`}>
              <circle r="24" fill="#FFFFFF" stroke="#7A1C30" strokeWidth={activeStep === 2 ? 3 : 1.5} />
              <text x="0" y="-4" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1F191B">
                ŷ
              </text>
              <text x="0" y="10" textAnchor="middle" fontSize="11" className="font-mono-num font-bold" fill="#7A1C30">
                {activeStep >= 2 ? computation.prediction.toFixed(3) : '?'}
              </text>
            </g>
          </svg>

          {/* Color + Stroke Legend */}
          <div className="flex items-center gap-6 mt-3 text-xs text-[#54484E]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#7A1C30] inline-block"></span>
              Positive (solid)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-[#B8860B] inline-block"></span>
              Negative (dashed)
            </span>
            <span className="text-[#6E7682]">Click any connection to edit weight</span>
          </div>
        </div>

        {/* Live Parameter & Individual Weight Inspector */}
        <div className="lg:col-span-5 p-4 space-y-4 max-h-[500px] overflow-y-auto">
          {/* Individual Synapse Editor */}
          <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded p-3 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1F191B]">Selected Connection Weight</span>
              <span className="font-mono-num text-[11px] text-[#7A1C30] font-bold">
                {editingTarget.type === 'hidden'
                  ? `x${(editingTarget.i || 0) + 1} → h${editingTarget.h + 1}: ${weightsHidden[editingTarget.h][editingTarget.i || 0].toFixed(2)}`
                  : `h${editingTarget.h + 1} → ŷ: ${weightsOutput[editingTarget.h].toFixed(2)}`}
              </span>
            </div>

            {editingTarget.type === 'hidden' ? (
              <input
                type="range"
                min="-2.0"
                max="2.0"
                step="0.05"
                aria-label="Adjust selected hidden connection weight"
                value={weightsHidden[editingTarget.h][editingTarget.i || 0]}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  setWeightsHidden(prev => {
                    const next = prev.map(r => [...r]);
                    next[editingTarget.h][editingTarget.i || 0] = val;
                    return next;
                  });
                }}
                className="w-full"
              />
            ) : (
              <input
                type="range"
                min="-2.0"
                max="2.0"
                step="0.05"
                aria-label="Adjust selected output connection weight"
                value={weightsOutput[editingTarget.h]}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  setWeightsOutput(prev => {
                    const next = [...prev];
                    next[editingTarget.h] = val;
                    return next;
                  });
                }}
                className="w-full"
              />
            )}
          </div>

          {/* Input Feature Sliders */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#54484E]">
              Input Feature Values
            </h4>
            <div className="space-y-1.5">
              {computation.activeInputs.map((val, idx) => (
                <div key={idx} className="bg-[#FAF5EE] p-2 rounded border border-[#EAE2D5]">
                  <div className="flex justify-between text-xs mb-1">
                    <label htmlFor={`pg-in-${idx}`} className="font-medium text-[#1F191B]">Feature x{idx + 1}</label>
                    <span className="font-mono-num font-semibold text-[#7A1C30]">{val.toFixed(2)}</span>
                  </div>
                  <input
                    id={`pg-in-${idx}`}
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.1"
                    value={val}
                    onChange={e => {
                      const next = [...inputs];
                      next[idx] = parseFloat(e.target.value);
                      setInputs(next);
                    }}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hidden Layer Biases */}
          <div className="space-y-2 pt-2 border-t border-[#EAE2D5]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#54484E]">
              Hidden Biases
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {biasesHidden.slice(0, numHidden).map((b, h) => (
                <div key={h} className="bg-[#FFFDF5] p-1.5 rounded border border-[#FCD34D]">
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <label htmlFor={`pg-bh-${h}`} className="text-[#B8860B]">b_h{h + 1}</label>
                    <span className="font-mono-num text-[#B8860B] font-bold">{b.toFixed(2)}</span>
                  </div>
                  <input
                    id={`pg-bh-${h}`}
                    type="range"
                    min="-1.5"
                    max="1.5"
                    step="0.1"
                    value={b}
                    onChange={e => {
                      const next = [...biasesHidden];
                      next[h] = parseFloat(e.target.value);
                      setBiasesHidden(next);
                    }}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Output Bias */}
          <div className="bg-[#FFFDF5] p-2 rounded border border-[#FCD34D]">
            <div className="flex justify-between text-xs mb-1">
              <label htmlFor="pg-bout" className="text-[#B8860B] font-medium">Output Bias b_out</label>
              <span className="font-mono-num text-[#B8860B] font-bold">{biasOutput.toFixed(2)}</span>
            </div>
            <input
              id="pg-bout"
              type="range"
              min="-1.5"
              max="1.5"
              step="0.1"
              value={biasOutput}
              onChange={e => setBiasOutput(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Final Output Summary */}
          <div className="p-3 bg-[#FAF2E6] border border-[#EEDAA2] rounded space-y-1 text-xs">
            <div className="font-semibold text-[#7A1C30]">Output Prediction:</div>
            <div className="font-mono-num text-[11px] text-[#1F191B]">
              ŷ = {activation}(z_out = {computation.outZ.toFixed(3)}) = <strong className="text-sm font-bold text-[#7A1C30]">{computation.prediction.toFixed(4)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
