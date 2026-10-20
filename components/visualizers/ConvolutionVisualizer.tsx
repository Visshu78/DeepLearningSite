'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  KERNEL_PRESETS,
  INPUT_PRESETS,
  computeConvolution2D,
  Matrix2D,
  ConvolutionStepBreakdown
} from '@/lib/math/convolution';
import { Play, Pause, RotateCcw, ChevronRight, Info } from 'lucide-react';

export function ConvolutionVisualizer() {
  const [selectedInputId, setSelectedInputId] = useState<string>('vertical-stripe');
  const [selectedKernelId, setSelectedKernelId] = useState<string>('sobel-vertical');
  const [customKernel, setCustomKernel] = useState<Matrix2D>(
    KERNEL_PRESETS.find(k => k.id === 'sobel-vertical')!.kernel
  );
  const [padding, setPadding] = useState<number>(0);
  const [stride, setStride] = useState<number>(1);
  const [bias, setBias] = useState<number>(0);
  const [activation, setActivation] = useState<'relu' | 'none'>('none');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Selected input data
  const inputData = useMemo(() => {
    return INPUT_PRESETS.find(p => p.id === selectedInputId)!.data;
  }, [selectedInputId]);

  // Compute convolution
  const convResult = useMemo(() => {
    return computeConvolution2D(inputData, customKernel, padding, stride, bias, activation);
  }, [inputData, customKernel, padding, stride, bias, activation]);

  // Auto-run playback
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev + 1 >= convResult.steps.length) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  }, [isPlaying, convResult.steps.length]);

  const safeStepIndex = currentStepIndex < convResult.steps.length ? currentStepIndex : 0;
  const activeStep: ConvolutionStepBreakdown | undefined = convResult.steps[safeStepIndex];

  // Helper to color input cells based on brightness (0 to 100)
  const getCellColor = (val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    const intensity = Math.round(255 - (clamped / 100) * 180);
    return `rgb(${intensity}, ${intensity}, ${intensity})`;
  };

  const getTextColor = (val: number) => (val > 50 ? '#FFFFFF' : '#18191B');

  const handleKernelPresetChange = (presetId: string) => {
    setSelectedKernelId(presetId);
    const found = KERNEL_PRESETS.find(k => k.id === presetId);
    if (found) {
      setCustomKernel(found.kernel.map(r => [...r]));
      setCurrentStepIndex(0);
    }
  };

  const handleCustomKernelCellChange = (r: number, c: number, valStr: string) => {
    const parsed = parseFloat(valStr) || 0;
    const updated = customKernel.map((row, ri) =>
      row.map((colVal, ci) => (ri === r && ci === c ? parsed : colVal))
    );
    setSelectedKernelId('custom');
    setCustomKernel(updated);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Context */}
      <div className="p-4 bg-[#EEF7F7] border border-[#B7E2E2] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-mono-num font-bold text-[#0D6E6E] uppercase tracking-wider">
            Spatial Feature Extraction Workbench
          </div>
          <p className="text-xs text-[#5C626B]">
            Observe how sliding a 3×3 kernel across an input matrix computes localized spatial dot-products to construct high-level feature maps.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setSelectedInputId('vertical-stripe');
              handleKernelPresetChange('sobel-vertical');
              setPadding(0);
              setStride(1);
              setBias(0);
              setActivation('none');
              setCurrentStepIndex(0);
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded border border-[#0D6E6E] text-[#0D6E6E] bg-white hover:bg-[#EEF7F7] transition-colors"
          >
            Load Edge Preset
          </button>
        </div>
      </div>

      {/* Control Configuration Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white border border-[#E6E6E0] rounded-lg">
        {/* Input pattern */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#18191B] block">Input Image Pattern</label>
          <select
            value={selectedInputId}
            onChange={e => {
              setSelectedInputId(e.target.value);
              setCurrentStepIndex(0);
            }}
            className="w-full text-xs p-2 rounded border border-[#E6E6E0] bg-[#FAF8F5] text-[#18191B] focus:border-[#0D6E6E] outline-none"
          >
            {INPUT_PRESETS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Filter selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#18191B] block">Convolution Filter / Kernel</label>
          <select
            value={selectedKernelId}
            onChange={e => handleKernelPresetChange(e.target.value)}
            className="w-full text-xs p-2 rounded border border-[#E6E6E0] bg-[#FAF8F5] text-[#18191B] focus:border-[#0D6E6E] outline-none"
          >
            {KERNEL_PRESETS.map(k => (
              <option key={k.id} value={k.id}>{k.name}</option>
            ))}
            <option value="custom">Custom Weights</option>
          </select>
        </div>

        {/* Padding & Stride */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#18191B] block">Padding (P)</label>
            <div className="flex gap-1">
              {[0, 1].map(p => (
                <button
                  key={p}
                  onClick={() => { setPadding(p); setCurrentStepIndex(0); }}
                  className={`flex-1 py-1.5 text-xs font-mono-num font-semibold rounded border transition-colors ${
                    padding === p
                      ? 'bg-[#0D6E6E] text-white border-[#0D6E6E]'
                      : 'bg-[#FAF8F5] text-[#4A525D] border-[#E6E6E0] hover:bg-[#F0EEEB]'
                  }`}
                >
                  {p === 0 ? 'Valid (0)' : 'Same (1)'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#18191B] block">Stride (S)</label>
            <div className="flex gap-1">
              {[1, 2].map(s => (
                <button
                  key={s}
                  onClick={() => { setStride(s); setCurrentStepIndex(0); }}
                  className={`flex-1 py-1.5 text-xs font-mono-num font-semibold rounded border transition-colors ${
                    stride === s
                      ? 'bg-[#0D6E6E] text-white border-[#0D6E6E]'
                      : 'bg-[#FAF8F5] text-[#4A525D] border-[#E6E6E0] hover:bg-[#F0EEEB]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activation */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#18191B] block">Non-Linear Activation</label>
          <div className="flex gap-1">
            <button
              onClick={() => setActivation('none')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-colors ${
                activation === 'none'
                  ? 'bg-[#0D6E6E] text-white border-[#0D6E6E]'
                  : 'bg-[#FAF8F5] text-[#4A525D] border-[#E6E6E0] hover:bg-[#F0EEEB]'
              }`}
            >
              Linear
            </button>
            <button
              onClick={() => setActivation('relu')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-colors ${
                activation === 'relu'
                  ? 'bg-[#0D6E6E] text-white border-[#0D6E6E]'
                  : 'bg-[#FAF8F5] text-[#4A525D] border-[#E6E6E0] hover:bg-[#F0EEEB]'
              }`}
            >
              ReLU
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Image Grid with Kernel Overlay */}
        <div className="lg:col-span-5 bg-white border border-[#E6E6E0] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-[#18191B]">Padded Input Image</h3>
              <p className="text-[11px] text-[#5C626B]">
                Shape: {convResult.paddedInput.length} × {convResult.paddedInput[0].length} (Cyan box: current receptive field)
              </p>
            </div>
          </div>

          {/* Grid display */}
          <div className="flex justify-center p-2 bg-[#FAF8F5] border border-[#E6E6E0] rounded-md overflow-x-auto">
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${convResult.paddedInput[0].length}, minmax(32px, 38px))`
              }}
            >
              {convResult.paddedInput.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  const isInField =
                    activeStep &&
                    rIdx >= activeStep.inRowStart &&
                    rIdx < activeStep.inRowStart + 3 &&
                    cIdx >= activeStep.inColStart &&
                    cIdx < activeStep.inColStart + 3;

                  return (
                    <div
                      key={`in-${rIdx}-${cIdx}`}
                      style={{
                        backgroundColor: getCellColor(val),
                        color: getTextColor(val)
                      }}
                      className={`h-9 flex items-center justify-center font-mono-num text-[11px] font-bold rounded transition-all ${
                        isInField
                          ? 'ring-2 ring-[#0D6E6E] ring-offset-1 scale-105 z-10'
                          : 'opacity-90'
                      }`}
                    >
                      {val}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 3x3 Kernel Editor */}
          <div className="space-y-2 pt-2 border-t border-[#E6E6E0]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#18191B]">Filter Kernel (3×3)</span>
              <span className="text-[11px] text-[#5C626B]">Editable synapse weights</span>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-1.5 p-2 bg-[#FAF8F5] border border-[#E6E6E0] rounded-md">
                {customKernel.map((row, r) =>
                  row.map((val, c) => (
                    <input
                      key={`k-${r}-${c}`}
                      type="number"
                      step="0.5"
                      value={val}
                      onChange={e => handleCustomKernelCellChange(r, c, e.target.value)}
                      className="w-12 h-8 text-center font-mono-num text-xs font-semibold bg-white border border-[#E6E6E0] rounded text-[#0D6E6E] focus:border-[#0D6E6E] outline-none"
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Computation / Math Decomposition */}
        <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#E6E6E0] rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#0D6E6E]" />
              <h3 className="text-xs font-bold text-[#18191B] uppercase tracking-wider">
                Step-by-Step Dot Product
              </h3>
            </div>

            {activeStep ? (
              <div className="space-y-3 text-xs">
                <div className="p-2.5 bg-white border border-[#E6E6E0] rounded space-y-1">
                  <div className="text-[11px] text-[#5C626B]">
                    Output Position: Cell ({activeStep.outRow}, {activeStep.outCol})
                  </div>
                  <div className="font-mono-num text-[11px] text-[#18191B]">
                    Input Window: [{activeStep.inRowStart}:{activeStep.inRowStart + 3}, {activeStep.inColStart}:{activeStep.inColStart + 3}]
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-[#5C626B] block">Element-wise Multiplications:</span>
                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1 font-mono-num text-[11px]">
                    {activeStep.terms.map((term, tIdx) => (
                      <div key={tIdx} className="flex items-center justify-between py-0.5 px-2 bg-white rounded border border-[#EFEFEA]">
                        <span>{term.inputVal} × {term.kernelVal}</span>
                        <span className="font-bold text-[#0D6E6E]">= {term.product}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#B7E2E2] rounded space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#5C626B]">Sum of Products:</span>
                    <span className="font-mono-num font-bold text-[#18191B]">{activeStep.sum}</span>
                  </div>
                  {bias !== 0 && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#5C626B]">Bias offset (+b):</span>
                      <span className="font-mono-num text-[#0D6E6E]">+{bias}</span>
                    </div>
                  )}
                  <div className="pt-1.5 border-t border-[#E6E6E0] flex justify-between items-center text-xs">
                    <span className="font-bold text-[#18191B]">Output Value:</span>
                    <span className="font-mono-num font-extrabold text-sm text-[#0D6E6E]">
                      {activeStep.postActivation}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Stepper Controls */}
          <div className="space-y-2 pt-3 border-t border-[#E6E6E0]">
            <div className="flex items-center justify-between text-xs text-[#5C626B]">
              <span>Window {currentStepIndex + 1} of {convResult.steps.length}</span>
              <span>{(convResult.outHeight)} × {(convResult.outWidth)} Map</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#0D6E6E] text-white text-xs font-semibold hover:bg-[#085252] transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Auto Slide'}</span>
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(prev => (prev + 1) % convResult.steps.length);
                }}
                className="p-2 rounded border border-[#E6E6E0] bg-white text-[#18191B] hover:border-[#0D6E6E] transition-colors"
                title="Next Step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                className="p-2 rounded border border-[#E6E6E0] bg-white text-[#18191B] hover:border-[#0D6E6E] transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Output Feature Map */}
        <div className="lg:col-span-3 bg-white border border-[#E6E6E0] rounded-lg p-5 space-y-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-[#18191B]">Output Feature Map</h3>
            <p className="text-[11px] text-[#5C626B]">
              Shape: {convResult.outHeight} × {convResult.outWidth} (Click any cell to inspect)
            </p>
          </div>

          <div className="flex justify-center p-2 bg-[#FAF8F5] border border-[#E6E6E0] rounded-md">
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${convResult.outWidth}, minmax(42px, 50px))`
              }}
            >
              {convResult.output.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  const isCurrent =
                    activeStep &&
                    activeStep.outRow === rIdx &&
                    activeStep.outCol === cIdx;

                  // Find step index for this cell
                  const targetStepIdx = convResult.steps.findIndex(
                    s => s.outRow === rIdx && s.outCol === cIdx
                  );

                  return (
                    <button
                      key={`out-${rIdx}-${cIdx}`}
                      onClick={() => {
                        setIsPlaying(false);
                        if (targetStepIdx !== -1) setCurrentStepIndex(targetStepIdx);
                      }}
                      className={`h-11 flex flex-col items-center justify-center font-mono-num rounded border text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-[#0D6E6E] text-white border-[#0D6E6E] shadow-sm scale-105'
                          : 'bg-white text-[#18191B] border-[#E6E6E0] hover:border-[#0D6E6E]'
                      }`}
                    >
                      <span className="text-[11px]">{val}</span>
                      <span className={`text-[8px] font-normal ${isCurrent ? 'text-teal-100' : 'text-[#878E99]'}`}>
                        ({rIdx},{cIdx})
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-[#E6E6E0] rounded text-[11px] text-[#5C626B] leading-relaxed">
            <span className="font-bold text-[#18191B]">Dimension Formula:</span>
            <div className="font-mono-num mt-1 text-[#0D6E6E] font-semibold">
              W_out = ⌊(W_in - K + 2P) / S⌋ + 1
            </div>
            <div className="mt-1">
              ⌊({inputData[0].length} - 3 + {2 * padding}) / {stride}⌋ + 1 = <strong className="text-[#18191B]">{convResult.outWidth}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
