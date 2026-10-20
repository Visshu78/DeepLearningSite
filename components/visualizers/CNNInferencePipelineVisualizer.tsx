'use client';

import React, { useState, useMemo } from 'react';
import {
  DIGIT_PRESETS,
  INFERENCE_FILTERS,
  runCNNInferencePipeline,
  getConvCellTrace,
  getPoolCellTrace,
  getFeatureProvenance,
  type ConvCellTrace,
  type PoolCellTrace,
  type FeatureProvenance
} from '@/lib/math/cnnInference';
import type { Matrix2D } from '@/lib/math/convolution';
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Zap,
  Eye,
  Info,
  CheckCircle2,
  Layers,
  ChevronRight
} from 'lucide-react';

export function CNNInferencePipelineVisualizer() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('digit-0');
  const [inputGrid, setInputGrid] = useState<Matrix2D>(
    DIGIT_PRESETS.find(d => d.id === 'digit-0')!.grid.map(r => [...r])
  );
  const [activeStage, setActiveStage] = useState<number>(1); // Start at Conv2D to show action
  const [selectedFilterIdx, setSelectedFilterIdx] = useState<number>(0);
  const [selectedConvCoord, setSelectedConvCoord] = useState<[number, number]>([1, 1]);
  const [selectedPoolCoord, setSelectedPoolCoord] = useState<[number, number]>([0, 0]);
  const [selectedFeatureIdx, setSelectedFeatureIdx] = useState<number>(0);
  const [selectedClassLabel, setSelectedClassLabel] = useState<string>('0');

  // Run CNN forward inference pipeline
  const inference = useMemo(() => {
    return runCNNInferencePipeline(inputGrid);
  }, [inputGrid]);

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = DIGIT_PRESETS.find(d => d.id === presetId);
    if (found) {
      setInputGrid(found.grid.map(r => [...r]));
    }
  };

  const handleCellToggle = (r: number, c: number) => {
    setInputGrid(prev => {
      const next = prev.map((row, ri) =>
        row.map((val, ci) => {
          if (ri === r && ci === c) {
            return val > 0.4 ? 0.0 : 0.9;
          }
          return val;
        })
      );
      setSelectedPresetId('custom');
      return next;
    });
  };

  const handleClear = () => {
    setInputGrid(Array.from({ length: 8 }, () => Array(8).fill(0.0)));
    setSelectedPresetId('custom');
  };

  // Traces for the currently selected cell/feature
  const convTrace: ConvCellTrace = useMemo(() => {
    return getConvCellTrace(
      inputGrid,
      selectedFilterIdx,
      selectedConvCoord[0],
      selectedConvCoord[1]
    );
  }, [inputGrid, selectedFilterIdx, selectedConvCoord]);

  const poolTrace: PoolCellTrace = useMemo(() => {
    const reluMap = inference.reluFeatureMaps[selectedFilterIdx] || inference.reluFeatureMaps[0];
    return getPoolCellTrace(reluMap, selectedPoolCoord[0], selectedPoolCoord[1]);
  }, [inference, selectedFilterIdx, selectedPoolCoord]);

  const featureProvenance: FeatureProvenance = useMemo(() => {
    return getFeatureProvenance(inference.flattenedVector, selectedFeatureIdx);
  }, [inference, selectedFeatureIdx]);

  const STAGES = [
    {
      id: 0,
      name: '1. Input Tensor',
      badge: '1 × 8 × 8',
      summary: 'Raw 2D grayscale pixel array entering the network.'
    },
    {
      id: 1,
      name: '2. 3D Conv2D',
      badge: '3 × 6 × 6',
      summary: 'Sliding 3×3 kernels compute local spatial dot-products.'
    },
    {
      id: 2,
      name: '3. ReLU Rectification',
      badge: '3 × 6 × 6',
      summary: 'Negative pre-activations are suppressed to zero: max(0, z).'
    },
    {
      id: 3,
      name: '4. Max Pooling',
      badge: '3 × 3 × 3',
      summary: '2×2 quads downsampled by selecting maximum local response.'
    },
    {
      id: 4,
      name: '5. Flattening',
      badge: '1 × 27',
      summary: 'Spatial 3D volume unrolled into a continuous 1D feature vector.'
    },
    {
      id: 5,
      name: '6. Dense Layer',
      badge: '1 × 4',
      summary: 'Fully connected linear matrix multiply z = W · f + b.'
    },
    {
      id: 6,
      name: '7. Softmax Output',
      badge: 'Probabilities',
      summary: 'Logits normalized into a calibrated probability distribution.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-[#EEF7F7] border border-[#B7E2E2] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-mono-num font-bold text-[#0D6E6E] uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>How Data is Actually Inferred in a CNN: Interactive Pipeline</span>
          </div>
          <p className="text-xs text-[#5C626B]">
            Inference in a CNN is a deterministic feed-forward arithmetic cascade. Watch raw pixels get transformed step-by-step through convolution kernels, non-linear gating, spatial pooling, tensor flattening, and dense softmax classification.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handlePresetSelect('digit-0')}
            className="px-3 py-1.5 text-xs font-semibold rounded border border-[#0D6E6E] text-[#0D6E6E] bg-white hover:bg-[#EEF7F7] transition-colors"
          >
            Reset Digit 0
          </button>
        </div>
      </div>

      {/* Preset Selector & Digit Drawing Canvas */}
      <div className="p-4 bg-white border border-[#E6E6E0] rounded-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-[#18191B]">Choose Input Digit or Draw Custom Pixels:</h3>
            <p className="text-xs text-[#5C626B]">Select a known digit preset or click squares in the 8×8 grid to add/remove ink:</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {DIGIT_PRESETS.map(d => (
              <button
                key={d.id}
                onClick={() => handlePresetSelect(d.id)}
                className={`px-3 py-1 text-xs font-semibold rounded border transition-colors ${
                  selectedPresetId === d.id
                    ? 'bg-[#0D6E6E] text-white border-[#0D6E6E]'
                    : 'bg-[#FAF8F5] text-[#18191B] border-[#E6E6E0] hover:bg-[#F0EEEB]'
                }`}
              >
                {d.label}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="px-2.5 py-1 text-xs font-semibold rounded border border-[#E6E6E0] text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Pipeline Stage Bar with Next/Previous Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#18191B]">Inference Step:</span>
              <span className="font-mono-num font-semibold text-[#0D6E6E]">
                {activeStage + 1} of {STAGES.length}: {STAGES[activeStage].name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStage(s => Math.max(0, s - 1))}
                disabled={activeStage === 0}
                className="px-2.5 py-1 text-xs font-semibold rounded border border-[#E6E6E0] bg-[#FAF8F5] text-[#18191B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F0EEEB] transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Prev Step</span>
              </button>
              <button
                onClick={() => setActiveStage(s => Math.min(STAGES.length - 1, s + 1))}
                disabled={activeStage === STAGES.length - 1}
                className="px-2.5 py-1 text-xs font-semibold rounded border border-[#0D6E6E] bg-[#0D6E6E] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#085252] transition-colors flex items-center gap-1"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto pb-1">
            <div className="flex items-center gap-1.5 min-w-[700px] p-1.5 bg-[#FAF8F5] border border-[#E6E6E0] rounded-md">
              {STAGES.map((s, idx) => {
                const isActive = activeStage === s.id;
                return (
                  <React.Fragment key={s.id}>
                    <button
                      onClick={() => setActiveStage(s.id)}
                      className={`flex-1 py-1.5 px-2 text-center rounded border transition-all ${
                        isActive
                          ? 'bg-[#0D6E6E] text-white border-[#0D6E6E] shadow-sm font-bold'
                          : 'bg-white text-[#4A525D] border-[#E6E6E0] hover:bg-[#F4F4F1]'
                      }`}
                    >
                      <div className="text-[11px] leading-tight truncate">{s.name}</div>
                      <div className={`text-[9px] font-mono-num ${isActive ? 'text-teal-100' : 'text-[#878E99]'}`}>
                        {s.badge}
                      </div>
                    </button>
                    {idx < STAGES.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-[#A0A096] shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Pixel Canvas & Receptive Field Overlay */}
        <div className="lg:col-span-4 bg-white border border-[#E6E6E0] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-[#18191B]">Input Layer: 8×8 Pixels</h3>
              <p className="text-[11px] text-[#5C626B]">Click any cell to toggle ink</p>
            </div>
            <span className="text-[11px] font-mono-num text-[#0D6E6E] font-bold">1 Channel × 64 Pixels</span>
          </div>

          {/* 8x8 Grid with Receptive Field Highlighting */}
          <div className="flex justify-center p-3 bg-[#FAF8F5] border border-[#E6E6E0] rounded-md relative">
            <div className="grid grid-cols-8 gap-1 relative">
              {inputGrid.map((row, r) =>
                row.map((val, c) => {
                  // Determine if this cell is inside the active 3x3 receptive field
                  const inReceptivePatch =
                    (activeStage === 1 || activeStage === 2) &&
                    r >= selectedConvCoord[0] &&
                    r < selectedConvCoord[0] + 3 &&
                    c >= selectedConvCoord[1] &&
                    c < selectedConvCoord[1] + 3;

                  return (
                    <button
                      key={`cell-${r}-${c}`}
                      onClick={() => handleCellToggle(r, c)}
                      title={`Pixel (${r},${c}): ${val.toFixed(1)}${inReceptivePatch ? ' [In Active Receptive Field]' : ''}`}
                      style={{
                        backgroundColor: val > 0.4 ? '#18191B' : '#FFFFFF',
                        borderColor: inReceptivePatch ? '#0D6E6E' : '#D1D1C7'
                      }}
                      className={`w-7 h-7 rounded-sm border transition-all ${
                        inReceptivePatch
                          ? 'ring-2 ring-[#0D6E6E] ring-offset-1 z-10'
                          : 'hover:ring-1 hover:ring-[#A0A096]'
                      }`}
                    />
                  );
                })
              )}
            </div>
          </div>

          {(activeStage === 1 || activeStage === 2) && (
            <div className="p-3 bg-[#EEF7F7] border border-[#B7E2E2] rounded text-[11px] text-[#0D6E6E] space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Active 3×3 Receptive Window:</span>
              </div>
              <p className="leading-relaxed">
                The highlighted 3×3 patch on the 8×8 grid is currently being dotted with{' '}
                <strong>{INFERENCE_FILTERS[selectedFilterIdx].name}</strong> at row{' '}
                {selectedConvCoord[0]}, column {selectedConvCoord[1]}.
              </p>
            </div>
          )}

          <div className="p-3 bg-[#FAF8F5] border border-[#E6E6E0] rounded text-[11px] text-[#5C626B] leading-relaxed">
            <span className="font-semibold text-[#18191B]">How Inference Works:</span> During inference, the weights in all filters and dense layers are <em>fixed</em>. As you modify pixels above, changes propagate forward through each layer in real time.
          </div>
        </div>

        {/* Center: Stage Tensor Inspector & Live Numerical Arithmetic */}
        <div className="lg:col-span-5 bg-white border border-[#E6E6E0] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E6E0] pb-2">
            <div>
              <h3 className="text-sm font-bold text-[#18191B]">{STAGES[activeStage].name}</h3>
              <p className="text-[11px] text-[#5C626B]">{STAGES[activeStage].summary}</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono-num font-bold rounded bg-[#EEF7F7] text-[#0D6E6E] border border-[#B7E2E2]">
              {STAGES[activeStage].badge}
            </span>
          </div>

          {/* STAGE 0: INPUT TENSOR */}
          {activeStage === 0 && (
            <div className="space-y-4 text-xs text-[#5C626B]">
              <p>
                An input image in computer vision is represented as a numerical tensor with dimensions:
                <code className="mx-1 px-1.5 py-0.5 bg-[#FAF8F5] border border-[#E6E6E0] rounded font-mono-num text-[#18191B]">
                  [Batch, Channels, Height, Width]
                </code>
              </p>
              <div className="p-3 bg-[#FAF8F5] border border-[#E6E6E0] rounded space-y-2 font-mono-num text-[11px]">
                <div className="font-bold text-[#18191B] font-sans">Current Input Tensor Dimensions:</div>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Channels (C_in): 1 (Grayscale)</li>
                  <li>Height (H): 8 pixels</li>
                  <li>Width (W): 8 pixels</li>
                  <li>Pixel Range: [0.0 = Background, 1.0 = Ink]</li>
                  <li>Total Input Scalar Values: 64 numbers</li>
                </ul>
              </div>
              <p>
                Click <strong>&quot;Next Step&quot;</strong> above to watch the first Convolutional Layer slide feature detectors across this tensor.
              </p>
            </div>
          )}

          {/* STAGE 1: CONVOLUTION & STAGE 2: RELU */}
          {(activeStage === 1 || activeStage === 2) && (
            <div className="space-y-4">
              {/* Filter Selector Tabs */}
              <div className="flex items-center gap-1.5 border-b border-[#E6E6E0] pb-2 overflow-x-auto">
                {INFERENCE_FILTERS.map((filt, idx) => (
                  <button
                    key={filt.id}
                    onClick={() => setSelectedFilterIdx(idx)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors whitespace-nowrap ${
                      selectedFilterIdx === idx
                        ? 'bg-[#0D6E6E] text-white border-[#0D6E6E]'
                        : 'bg-[#FAF8F5] text-[#5C626B] border-[#E6E6E0] hover:bg-[#F0EEEB]'
                    }`}
                  >
                    Filter {idx + 1}: {filt.name}
                  </button>
                ))}
              </div>

              {/* 6x6 Feature Map with Clickable Cells */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#18191B]">
                    {activeStage === 1 ? 'Pre-Activation Map (z)' : 'ReLU Post-Activation Map (a = max(0, z))'}:
                  </span>
                  <span className="text-[11px] text-[#5C626B] font-mono-num">Click any cell to inspect</span>
                </div>

                <div className="flex justify-center p-3 bg-[#FAF8F5] border border-[#E6E6E0] rounded-md">
                  <div className="grid grid-cols-6 gap-1">
                    {(activeStage === 1
                      ? inference.convFeatureMaps[selectedFilterIdx].map
                      : inference.reluFeatureMaps[selectedFilterIdx]
                    ).map((row, r) =>
                      row.map((val, c) => {
                        const isSelected =
                          selectedConvCoord[0] === r && selectedConvCoord[1] === c;
                        const norm = Math.min(1, Math.max(0, val / 4.0));
                        return (
                          <button
                            key={`map-cell-${r}-${c}`}
                            onClick={() => setSelectedConvCoord([r, c])}
                            title={`Cell (${r}, ${c}): value = ${val}`}
                            style={{
                              backgroundColor: norm > 0 ? `rgba(13, 110, 110, ${norm})` : '#FFFFFF',
                              color: norm > 0.5 ? '#FFFFFF' : '#18191B',
                              borderColor: isSelected ? '#0D6E6E' : '#E6E6E0'
                            }}
                            className={`w-8 h-8 flex items-center justify-center font-mono-num text-[10px] font-bold rounded-sm border transition-all ${
                              isSelected
                                ? 'ring-2 ring-[#0D6E6E] ring-offset-1 z-10'
                                : 'hover:scale-105'
                            }`}
                          >
                            {val.toFixed(1)}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Arithmetic Breakdown for Selected Cell */}
              <div className="p-3 bg-[#FAF8F5] border border-[#E6E6E0] rounded space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-[#E6E6E0] pb-1.5">
                  <span className="font-bold text-[#18191B]">
                    Mathematical Trace at Cell ({convTrace.row}, {convTrace.col}):
                  </span>
                  <span className="font-mono-num text-[10px] text-[#0D6E6E]">
                    Kernel: 3×3 | Bias: {convTrace.bias.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="font-semibold text-[#5C626B] block mb-1">Input Patch (3×3):</span>
                    <div className="grid grid-cols-3 gap-0.5 bg-white p-1 rounded border border-[#E6E6E0] text-center font-mono-num text-[9px]">
                      {convTrace.inputPatch.map(r =>
                        r.map((v, i) => (
                          <div key={i} className="py-0.5 bg-[#FAF8F5]">
                            {v.toFixed(1)}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-[#5C626B] block mb-1">Filter Weights (3×3):</span>
                    <div className="grid grid-cols-3 gap-0.5 bg-white p-1 rounded border border-[#E6E6E0] text-center font-mono-num text-[9px]">
                      {convTrace.kernel.map(r =>
                        r.map((w, i) => (
                          <div key={i} className="py-0.5 bg-[#FAF8F5] text-[#0D6E6E] font-bold">
                            {w.toFixed(1)}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-2 bg-white rounded border border-[#E6E6E0] font-mono-num text-[11px] space-y-1">
                  <div>
                    <span className="text-[#5C626B]">Dot Product Sum: </span>
                    <strong>{convTrace.productSum.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-[#5C626B]">Pre-activation z = Sum + Bias: </span>
                    <strong className="text-[#0D6E6E]">{convTrace.preActivation.toFixed(2)}</strong>
                  </div>
                  {activeStage === 2 && (
                    <div className="pt-1 border-t border-[#EFEFEA] text-[#18191B]">
                      <span className="text-[#5C626B]">ReLU a = max(0, z): </span>
                      <strong className="text-[#0D6E6E]">{convTrace.reluOutput.toFixed(2)}</strong>
                      <span className="text-[10px] text-[#5C626B] ml-1">
                        ({convTrace.preActivation < 0 ? 'Suppressed negative value to 0' : 'Positive excitation preserved'})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: MAX POOLING */}
          {activeStage === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 border-b border-[#E6E6E0] pb-2 overflow-x-auto">
                {INFERENCE_FILTERS.map((filt, idx) => (
                  <button
                    key={filt.id}
                    onClick={() => setSelectedFilterIdx(idx)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors whitespace-nowrap ${
                      selectedFilterIdx === idx
                        ? 'bg-[#0D6E6E] text-white border-[#0D6E6E]'
                        : 'bg-[#FAF8F5] text-[#5C626B] border-[#E6E6E0] hover:bg-[#F0EEEB]'
                    }`}
                  >
                    Filter {idx + 1}: {filt.name}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#18191B]">3×3 Max-Pooled Channel:</span>
                  <span className="text-[11px] text-[#5C626B] font-mono-num">Click cell to inspect 2×2 quad</span>
                </div>

                <div className="flex justify-center p-3 bg-[#FAF8F5] border border-[#E6E6E0] rounded-md">
                  <div className="grid grid-cols-3 gap-2">
                    {inference.pooledFeatureMaps[selectedFilterIdx].map((row, pr) =>
                      row.map((val, pc) => {
                        const isSelected =
                          selectedPoolCoord[0] === pr && selectedPoolCoord[1] === pc;
                        return (
                          <button
                            key={`pool-${pr}-${pc}`}
                            onClick={() => setSelectedPoolCoord([pr, pc])}
                            className={`w-12 h-12 flex flex-col items-center justify-center font-mono-num rounded border transition-all ${
                              isSelected
                                ? 'bg-[#0D6E6E] text-white border-[#0D6E6E] ring-2 ring-[#0D6E6E] ring-offset-1'
                                : 'bg-white text-[#18191B] border-[#E6E6E0] hover:border-[#0D6E6E]'
                            }`}
                          >
                            <span className="text-[10px] font-bold">{val.toFixed(1)}</span>
                            <span className={`text-[8px] ${isSelected ? 'text-teal-200' : 'text-[#878E99]'}`}>
                              ({pr},{pc})
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* 2x2 Downsampling Quad Breakdown */}
              <div className="p-3 bg-[#FAF8F5] border border-[#E6E6E0] rounded space-y-2 text-xs">
                <div className="font-bold text-[#18191B] flex items-center justify-between">
                  <span>Downsampling 2×2 Window from ReLU Map:</span>
                  <span className="text-[10px] font-mono-num text-[#5C626B]">
                    Rows [{poolTrace.rStart}..{poolTrace.rStart + 1}], Cols [{poolTrace.cStart}..{poolTrace.cStart + 1}]
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="grid grid-cols-2 gap-1 p-2 bg-white rounded border border-[#E6E6E0]">
                    {poolTrace.poolQuad.map((r, ri) =>
                      r.map((v, ci) => {
                        const isWinner =
                          poolTrace.maxCoordOffset[0] === ri && poolTrace.maxCoordOffset[1] === ci;
                        return (
                          <div
                            key={`quad-${ri}-${ci}`}
                            className={`w-10 h-10 flex items-center justify-center font-mono-num text-[11px] rounded border ${
                              isWinner
                                ? 'bg-[#0D6E6E] text-white font-bold border-[#0D6E6E]'
                                : 'bg-[#FAF8F5] text-[#5C626B] border-[#E6E6E0]'
                            }`}
                          >
                            {v.toFixed(1)}
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="text-[#5C626B]">Max Operation:</div>
                    <div className="font-mono-num font-bold text-[#18191B]">
                      max({poolTrace.poolQuad.flat().map(v => v.toFixed(1)).join(', ')}) ={' '}
                      <span className="text-[#0D6E6E]">{poolTrace.maxVal.toFixed(1)}</span>
                    </div>
                    <div className="text-[10px] text-[#5C626B]">
                      Preserves strongest feature response while discarding exact position.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: FLATTENING */}
          {activeStage === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-[#5C626B]">
                The Flattening operation reshapes the 3D tensor volume of shape <code className="px-1 py-0.5 bg-[#FAF8F5] border border-[#E6E6E0] rounded font-mono-num text-[#18191B]">[3 channels × 3 rows × 3 cols]</code> into a single 1D feature vector of length <strong>27</strong> (3 × 3 × 3 = 27):
              </p>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#18191B]">Click any feature to trace its origin:</span>
                <div className="grid grid-cols-9 gap-1 p-2 bg-[#FAF8F5] border border-[#E6E6E0] rounded">
                  {inference.flattenedVector.map((val, idx) => {
                    const isSelected = selectedFeatureIdx === idx;
                    return (
                      <button
                        key={`feat-${idx}`}
                        onClick={() => setSelectedFeatureIdx(idx)}
                        className={`h-7 flex items-center justify-center font-mono-num text-[10px] rounded border transition-colors ${
                          isSelected
                            ? 'bg-[#0D6E6E] text-white border-[#0D6E6E] font-bold ring-2 ring-[#0D6E6E]'
                            : 'bg-white text-[#18191B] border-[#E6E6E0] hover:bg-[#F0EEEB]'
                        }`}
                      >
                        {val.toFixed(1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Provenance Box */}
              <div className="p-3 bg-[#FAF8F5] border border-[#E6E6E0] rounded space-y-1.5 text-xs">
                <div className="font-bold text-[#18191B] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#0D6E6E]" />
                  <span>Feature Origin: Vector Index [{featureProvenance.index}]</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E6E6E0] font-mono-num text-[11px] space-y-1">
                  <div>
                    <span className="text-[#5C626B]">Source Filter: </span>
                    <strong className="text-[#18191B]">{featureProvenance.filterName}</strong>
                  </div>
                  <div>
                    <span className="text-[#5C626B]">Pooled Coordinate: </span>
                    <strong className="text-[#18191B]">Row {featureProvenance.poolRow}, Col {featureProvenance.poolCol}</strong>
                  </div>
                  <div>
                    <span className="text-[#5C626B]">Activation Value: </span>
                    <strong className="text-[#0D6E6E]">{featureProvenance.featureValue.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 5: DENSE LAYER & STAGE 6: SOFTMAX */}
          {(activeStage === 5 || activeStage === 6) && (
            <div className="space-y-4">
              <div className="text-xs text-[#5C626B]">
                {activeStage === 5 ? (
                  <>
                    The Dense layer computes logits <code className="px-1 py-0.5 bg-[#FAF8F5] border border-[#E6E6E0] rounded font-mono-num text-[#18191B]">z = W · f + b</code> for all 4 digit candidates by taking dot products between the 27 spatial features and learned class prototype weights.
                  </>
                ) : (
                  <>
                    Softmax converts raw real-valued logits <code className="px-1 py-0.5 bg-[#FAF8F5] border border-[#E6E6E0] rounded font-mono-num text-[#18191B]">z</code> into normalized class probabilities <code className="px-1 py-0.5 bg-[#FAF8F5] border border-[#E6E6E0] rounded font-mono-num text-[#18191B]">P(y=c)</code> that sum to exactly 100%.
                  </>
                )}
              </div>

              {/* Class Logits & Probabilities Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#18191B]">Class Scores & Numerical Flow:</span>
                <div className="space-y-2">
                  {inference.logits.map(l => {
                    const prob = inference.probabilities.find(p => p.classLabel === l.classLabel);
                    const isWinner = l.classLabel === inference.predictedClass;
                    const isSelected = selectedClassLabel === l.classLabel;

                    return (
                      <button
                        key={l.classLabel}
                        onClick={() => setSelectedClassLabel(l.classLabel)}
                        className={`w-full p-2.5 rounded border text-left transition-all ${
                          isSelected
                            ? 'bg-[#EEF7F7] border-[#0D6E6E] ring-1 ring-[#0D6E6E]'
                            : 'bg-[#FAF8F5] border-[#E6E6E0] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#18191B]">Digit &quot;{l.classLabel}&quot;</span>
                            {isWinner && (
                              <span className="px-1.5 py-0.2 bg-[#0D6E6E] text-white text-[9px] font-bold rounded">
                                Winner
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 font-mono-num text-[11px]">
                            <span className="text-[#5C626B]">Logit z: <strong>{l.logit.toFixed(3)}</strong></span>
                            <span className="text-[#0D6E6E] font-bold">
                              {(prob ? prob.probability * 100 : 0).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Softmax Formula Box */}
              {activeStage === 6 && (
                <div className="p-3 bg-white border border-[#E6E6E0] rounded space-y-2 text-xs font-mono-num">
                  <div className="font-sans font-bold text-[#18191B]">Softmax Equation:</div>
                  <div className="p-2 bg-[#FAF8F5] rounded border border-[#E6E6E0] text-[11px] text-[#0D6E6E] overflow-x-auto">
                    P(class = c) = exp(z_c) / Σ_k exp(z_k)
                  </div>
                  <p className="font-sans text-[11px] text-[#5C626B] leading-relaxed">
                    Exponentiation forces negative logits to become strictly positive numbers, while dividing by the sum ensures the total probability is always 100%.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Softmax Predictions & Live Leaderboard */}
        <div className="lg:col-span-3 bg-white border border-[#E6E6E0] rounded-lg p-5 space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#18191B]">Final Prediction</h3>
            <p className="text-[11px] text-[#5C626B]">Softmax output distribution:</p>
          </div>

          {/* Prediction Box */}
          <div className="p-4 bg-[#FAF8F5] border border-[#B7E2E2] rounded-lg text-center space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-[#5C626B] font-semibold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0D6E6E]" />
              <span>Predicted Digit</span>
            </div>
            <div className="text-4xl font-extrabold text-[#0D6E6E] font-mono-num">
              {inference.predictedClass}
            </div>
            <div className="text-xs font-semibold text-[#18191B]">
              Confidence: {inference.confidencePercent}%
            </div>
          </div>

          {/* Softmax Probability Bars */}
          <div className="space-y-3">
            {inference.probabilities.map(prob => {
              const isWinner = prob.classLabel === inference.predictedClass;
              const barPercent = Math.round(prob.probability * 100);

              return (
                <div key={prob.classLabel} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-bold ${isWinner ? 'text-[#0D6E6E]' : 'text-[#18191B]'}`}>
                      Digit &quot;{prob.classLabel}&quot;
                    </span>
                    <span className="font-mono-num text-[11px] text-[#5C626B]">
                      {(prob.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E6E6E0]">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        isWinner ? 'bg-[#0D6E6E]' : 'bg-[#D1D1C7]'
                      }`}
                      style={{ width: `${Math.max(2, barPercent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E6E6E0] space-y-1 text-xs text-[#5C626B]">
            <span className="font-bold text-[#18191B] flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#0D6E6E]" />
              <span>Inference Summary:</span>
            </span>
            <p className="text-[11px] leading-relaxed">
              Inference uses zero gradients or backward passes. Data flows unidirectionally from pixels to class probabilities in microseconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
