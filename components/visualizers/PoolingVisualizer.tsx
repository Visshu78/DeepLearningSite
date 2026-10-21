'use client';

import React, { useState, useMemo } from 'react';
import {
  computePooling2D,
  calculateReceptiveFieldHierarchy,
  PoolingType,
  LayerSpec
} from '@/lib/math/pooling';
import { Matrix2D } from '@/lib/math/convolution';
import { Info } from 'lucide-react';

const SAMPLE_FEATURE_MAP: Matrix2D = [
  [12, 20, 30,  0, 15,  8],
  [ 8, 12,  2,  0, 24, 18],
  [34, 70, 37,  4, 85, 42],
  [112, 100, 25, 12, 90, 65],
  [45, 60, 18, 55, 30, 10],
  [22, 14, 80, 75, 40, 25]
];

const DEFAULT_CNN_STACK: LayerSpec[] = [
  { name: 'Input Layer', kernelSize: 1, stride: 1 },
  { name: 'Conv2D Layer 1 (3×3, S=1)', kernelSize: 3, stride: 1 },
  { name: 'Max Pool 1 (2×2, S=2)', kernelSize: 2, stride: 2 },
  { name: 'Conv2D Layer 2 (3×3, S=1)', kernelSize: 3, stride: 1 },
  { name: 'Max Pool 2 (2×2, S=2)', kernelSize: 2, stride: 2 }
];

export function PoolingVisualizer() {
  const [poolingType, setPoolingType] = useState<PoolingType>('max');
  const [poolSize, setPoolSize] = useState<number>(2);
  const [stride, setStride] = useState<number>(2);
  const [activeWindowIndex, setActiveWindowIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'pooling' | 'receptive-field'>('pooling');

  const poolingResult = useMemo(() => {
    return computePooling2D(SAMPLE_FEATURE_MAP, poolSize, stride, poolingType);
  }, [poolSize, stride, poolingType]);

  const activeStep = poolingResult.steps[activeWindowIndex] || poolingResult.steps[0];

  const rfHierarchy = useMemo(() => {
    return calculateReceptiveFieldHierarchy(DEFAULT_CNN_STACK.slice(1));
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-[#FAF2E6] border border-[#EEDAA2] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-mono-num font-bold text-[#7A1C30] uppercase tracking-wider">
            Downsampling & Spatial Invariance Lab
          </div>
          <p className="text-xs text-[#54484E]">
            Investigate how pooling contracts spatial dimensionality, introduces local translational invariance, and causes receptive fields to expand hierarchically.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pooling')}
            className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
              activeTab === 'pooling'
                ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                : 'bg-white text-[#54484E] border-[#EAE2D5] hover:bg-[#F4F4F1]'
            }`}
          >
            Pooling Operations
          </button>
          <button
            onClick={() => setActiveTab('receptive-field')}
            className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
              activeTab === 'receptive-field'
                ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                : 'bg-white text-[#54484E] border-[#EAE2D5] hover:bg-[#F4F4F1]'
            }`}
          >
            Receptive Field Hierarchy
          </button>
        </div>
      </div>

      {activeTab === 'pooling' ? (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border border-[#EAE2D5] rounded-lg">
            {/* Pooling Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1F191B] block">Downsampling Strategy</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPoolingType('max')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-colors ${
                    poolingType === 'max'
                      ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                      : 'bg-[#FAF5EE] text-[#54484E] border-[#EAE2D5] hover:bg-[#F0EEEB]'
                  }`}
                >
                  Max Pooling
                </button>
                <button
                  onClick={() => setPoolingType('average')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-colors ${
                    poolingType === 'average'
                      ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                      : 'bg-[#FAF5EE] text-[#54484E] border-[#EAE2D5] hover:bg-[#F0EEEB]'
                  }`}
                >
                  Average Pooling
                </button>
              </div>
            </div>

            {/* Window Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1F191B] block">Pool Window Size</label>
              <div className="flex gap-2">
                {[2, 3].map(sz => (
                  <button
                    key={sz}
                    onClick={() => { setPoolSize(sz); setActiveWindowIndex(0); }}
                    className={`flex-1 py-1.5 text-xs font-mono-num font-semibold rounded border transition-colors ${
                      poolSize === sz
                        ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                        : 'bg-[#FAF5EE] text-[#54484E] border-[#EAE2D5] hover:bg-[#F0EEEB]'
                    }`}
                  >
                    {sz} × {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Stride */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1F191B] block">Window Stride</label>
              <div className="flex gap-2">
                {[1, 2].map(st => (
                  <button
                    key={st}
                    onClick={() => { setStride(st); setActiveWindowIndex(0); }}
                    className={`flex-1 py-1.5 text-xs font-mono-num font-semibold rounded border transition-colors ${
                      stride === st
                        ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                        : 'bg-[#FAF5EE] text-[#54484E] border-[#EAE2D5] hover:bg-[#F0EEEB]'
                    }`}
                  >
                    Stride = {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grids Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Feature Map */}
            <div className="lg:col-span-6 bg-white border border-[#EAE2D5] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1F191B]">Incoming Feature Map</h3>
                  <p className="text-[11px] text-[#54484E]">6×6 Activation values (Teal outline: active pooling window)</p>
                </div>
              </div>

              <div className="flex justify-center p-3 bg-[#FAF5EE] border border-[#EAE2D5] rounded-md">
                <div className="grid grid-cols-6 gap-1.5">
                  {SAMPLE_FEATURE_MAP.map((row, rIdx) =>
                    row.map((val, cIdx) => {
                      const isInWindow =
                        activeStep &&
                        rIdx >= activeStep.inRowStart &&
                        rIdx < activeStep.inRowStart + poolSize &&
                        cIdx >= activeStep.inColStart &&
                        cIdx < activeStep.inColStart + poolSize;

                      const isSelectedMax =
                        poolingType === 'max' &&
                        isInWindow &&
                        val === activeStep.result;

                      return (
                        <div
                          key={`map-${rIdx}-${cIdx}`}
                          className={`w-10 h-10 flex flex-col items-center justify-center font-mono-num rounded text-xs transition-all ${
                            isSelectedMax
                              ? 'bg-[#7A1C30] text-white font-extrabold ring-2 ring-[#7A1C30] ring-offset-1 scale-105 z-10'
                              : isInWindow
                              ? 'bg-[#FAF2E6] text-[#7A1C30] font-bold border border-[#7A1C30]'
                              : 'bg-white text-[#1F191B] border border-[#EAE2D5]'
                          }`}
                        >
                          <span>{val}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="p-3 bg-[#FAF5EE] border border-[#EAE2D5] rounded text-xs text-[#54484E] space-y-1">
                <span className="font-semibold text-[#1F191B]">Why downsample?</span>
                <p className="text-[11px] leading-relaxed">
                  Pooling reduces the parameter count and computational footprint by discarding redundant fine-grained location details while preserving dominant structural features.
                </p>
              </div>
            </div>

            {/* Math Inspector & Output */}
            <div className="lg:col-span-6 space-y-6">
              {/* Math breakdown */}
              <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#7A1C30]" />
                  <h3 className="text-xs font-bold text-[#1F191B] uppercase tracking-wider">
                    Window Reduction Calculation
                  </h3>
                </div>

                {activeStep && (
                  <div className="p-4 bg-white border border-[#EEDAA2] rounded space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#54484E]">Values in current {poolSize}×{poolSize} window:</span>
                      <span className="font-mono-num font-bold text-[#1F191B]">
                        [{activeStep.windowValues.join(', ')}]
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#EAE2D5] flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#1F191B]">
                        {poolingType === 'max' ? 'Maximum Value:' : 'Arithmetic Mean:'}
                      </span>
                      <span className="font-mono-num font-extrabold text-base text-[#7A1C30]">
                        {activeStep.result}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Downsampled Output Grid */}
              <div className="bg-white border border-[#EAE2D5] rounded-lg p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1F191B]">Downsampled Output Map</h3>
                  <p className="text-[11px] text-[#54484E]">
                    Dimensions: {poolingResult.outHeight} × {poolingResult.outWidth} (Click cell to inspect input window)
                  </p>
                </div>

                <div className="flex justify-center p-3 bg-[#FAF5EE] border border-[#EAE2D5] rounded-md">
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${poolingResult.outWidth}, minmax(44px, 52px))`
                    }}
                  >
                    {poolingResult.output.map((row, rIdx) =>
                      row.map((val, cIdx) => {
                        const stepIdx = poolingResult.steps.findIndex(
                          s => s.outRow === rIdx && s.outCol === cIdx
                        );
                        const isCurrent = stepIdx === activeWindowIndex;

                        return (
                          <button
                            key={`pool-out-${rIdx}-${cIdx}`}
                            onClick={() => {
                              if (stepIdx !== -1) setActiveWindowIndex(stepIdx);
                            }}
                            className={`h-12 flex flex-col items-center justify-center font-mono-num rounded border text-xs font-bold transition-all ${
                              isCurrent
                                ? 'bg-[#7A1C30] text-white border-[#7A1C30] shadow-sm scale-105'
                                : 'bg-white text-[#1F191B] border-[#EAE2D5] hover:border-[#7A1C30]'
                            }`}
                          >
                            <span>{val}</span>
                            <span className={`text-[8px] font-normal ${isCurrent ? 'text-teal-100' : 'text-[#878E99]'}`}>
                              ({rIdx},{cIdx})
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Receptive Field Hierarchy Tab */
        <div className="bg-white border border-[#EAE2D5] rounded-lg p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#1F191B]">Receptive Field Expansion Across Deep CNN Layers</h3>
            <p className="text-xs text-[#54484E] leading-relaxed max-w-2xl">
              A neuron in the early convolutional layers perceives only a small local patch of the input. As convolutions and pooling layers stack, the cumulative stride multiplies, enabling higher-level neurons to integrate global contextual information across wide pixel regions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EAE2D5] bg-[#FAF5EE] text-[#54484E]">
                  <th className="py-2.5 px-4 font-semibold">Layer</th>
                  <th className="py-2.5 px-4 font-semibold">Filter Size (k)</th>
                  <th className="py-2.5 px-4 font-semibold">Stride (s)</th>
                  <th className="py-2.5 px-4 font-semibold">Cumulative Stride</th>
                  <th className="py-2.5 px-4 font-semibold text-[#7A1C30]">Receptive Field (RF)</th>
                  <th className="py-2.5 px-4 font-semibold">Input Area Covered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D5] font-mono-num">
                <tr className="bg-white">
                  <td className="py-3 px-4 font-sans font-medium text-[#1F191B]">Input Layer</td>
                  <td className="py-3 px-4">1 × 1</td>
                  <td className="py-3 px-4">1</td>
                  <td className="py-3 px-4">1</td>
                  <td className="py-3 px-4 font-bold text-[#7A1C30]">1 × 1</td>
                  <td className="py-3 px-4 text-[#54484E]">1 pixel</td>
                </tr>
                {rfHierarchy.map((step, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF5EE] transition-colors">
                    <td className="py-3 px-4 font-sans font-medium text-[#1F191B]">{step.layerName}</td>
                    <td className="py-3 px-4">{step.kernelSize} × {step.kernelSize}</td>
                    <td className="py-3 px-4">{step.stride}</td>
                    <td className="py-3 px-4">{step.cumulativeStride}</td>
                    <td className="py-3 px-4 font-extrabold text-[#7A1C30] text-sm">
                      {step.receptiveField} × {step.receptiveField}
                    </td>
                    <td className="py-3 px-4 text-[#54484E]">
                      {step.receptiveField * step.receptiveField} pixels ({((step.receptiveField * step.receptiveField) / (32 * 32) * 100).toFixed(1)}% of 32×32 image)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#FAF5EE] border border-[#EAE2D5] rounded-md text-xs space-y-2">
            <div className="font-bold text-[#1F191B]">The Recursive Receptive Field Formula:</div>
            <div className="font-mono-num text-[#7A1C30]">
              RF_{'{l}'} = RF_{'{l-1}'} + (k_{'{l}'} - 1) × S_{'{cumulative, l-1}'}
            </div>
            <p className="text-[11px] text-[#54484E] leading-relaxed">
              Pooling layers accelerate receptive field expansion dramatically because their stride (typically s = 2) doubles the cumulative stride for all downstream convolutions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
