'use client';

import React, { useState, useMemo } from 'react';
import {
  computeConvBackprop,
  computeMaxPoolBackprop,
  rotateKernel180
} from '@/lib/math/cnnBackprop';
import { ArrowLeft, RotateCw, RefreshCw, Zap, Eye, CheckCircle2 } from 'lucide-react';

type BackpropMode = 'kernel-grad' | 'input-grad' | 'pool-routing';

export function CNNBackpropagationVisualizer() {
  const [mode, setMode] = useState<BackpropMode>('kernel-grad');
  const [learningRate, setLearningRate] = useState<number>(0.1);
  const [selectedPatch, setSelectedPatch] = useState<{ r: number; c: number }>({ r: 0, c: 0 });

  // 4x4 sample input activation map
  const [inputMap, setInputMap] = useState<number[][]>([
    [1.5, 0.8, 2.0, 0.2],
    [0.4, 2.5, 1.2, 0.0],
    [0.9, 1.8, 0.5, 2.2],
    [1.0, 0.2, 1.4, 0.6]
  ]);

  // 2x2 learnable kernel weights
  const [kernel, setKernel] = useState<number[][]>([
    [0.8, -0.4],
    [1.2, 0.5]
  ]);

  // 3x3 upstream output gradient (dL/dY) from subsequent layer
  const [outputGrad, setOutputGrad] = useState<number[][]>([
    [1.0, -0.5, 0.8],
    [0.2, 1.5, -0.2],
    [-0.4, 0.6, 1.2]
  ]);

  // Compute analytical gradients
  const { dL_dK, dL_dX, dL_db } = useMemo(() => {
    return computeConvBackprop(inputMap, kernel, outputGrad, 1, 0);
  }, [inputMap, kernel, outputGrad]);

  // Compute max-pool backpropagation for a 4x4 input down to 2x2
  const poolGradResult = useMemo(() => {
    const poolUpstream = [
      [outputGrad[0][0], outputGrad[0][1]],
      [outputGrad[1][0], outputGrad[1][1]]
    ];
    return computeMaxPoolBackprop(inputMap, poolUpstream, 2, 2);
  }, [inputMap, outputGrad]);

  const rotK = useMemo(() => rotateKernel180(kernel), [kernel]);

  // Calculate updated kernel after gradient step
  const updatedKernel = useMemo(() => {
    return kernel.map((row, r) =>
      row.map((val, c) => val - learningRate * dL_dK[r][c])
    );
  }, [kernel, dL_dK, learningRate]);

  return (
    <div className="bg-[#FCFAF7] border border-[#E8E2D9] rounded-xl overflow-hidden shadow-sm">
      {/* Visualizer Header */}
      <div className="px-5 py-4 border-b border-[#E8E2D9] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6E1A2B] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6E1A2B]">
              CNN BACKPROPAGATION LAB
            </span>
          </div>
          <p className="text-xs text-[#625956]">
            Interactive filter gradient calculation, 180° rotated convolution, and pooling mask routing
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-[#EFE9DF] p-1 rounded-lg">
          <button
            onClick={() => setMode('kernel-grad')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              mode === 'kernel-grad'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            1. Kernel Gradients (∂L/∂K)
          </button>
          <button
            onClick={() => setMode('input-grad')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              mode === 'input-grad'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            2. Input Gradients (rot180)
          </button>
          <button
            onClick={() => setMode('pool-routing')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              mode === 'pool-routing'
                ? 'bg-[#6E1A2B] text-white shadow-2xs'
                : 'text-[#54484E] hover:text-[#1D1819] hover:bg-white/60'
            }`}
          >
            3. Max-Pool Mask Routing
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Tensor Matrices */}
        <div className="lg:col-span-7 space-y-6">
          {mode === 'kernel-grad' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#625956]">
                  Filter Gradient Cross-Correlation: ∂L/∂K = X ⋆ δ_out
                </h4>
                <span className="text-[11px] font-mono-num text-[#8E6523] bg-[#FBF6EB] px-2 py-0.5 rounded border border-[#E8D3A8]">
                  Bias Gradient ∂L/∂b = {dL_db.toFixed(3)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {/* Input Tensor X */}
                <div className="bg-white border border-[#E8E2D9] rounded-lg p-3 space-y-2">
                  <div className="text-[11px] font-bold text-[#1D1819] flex justify-between">
                    <span>Input Map X (4×4)</span>
                    <span className="text-[#8E6523] font-mono-num">Select patch</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {inputMap.map((row, r) =>
                      row.map((val, c) => {
                        const inPatch =
                          r >= selectedPatch.r &&
                          r < selectedPatch.r + 2 &&
                          c >= selectedPatch.c &&
                          c < selectedPatch.c + 2;
                        return (
                          <button
                            key={`x-${r}-${c}`}
                            onClick={() => {
                              if (r <= 2 && c <= 2) {
                                setSelectedPatch({ r, c });
                              }
                            }}
                            className={`p-1.5 text-center text-xs font-mono-num rounded border transition-all ${
                              inPatch
                                ? 'bg-[#FBF6EB] border-[#C28E38] font-bold text-[#8E6523] scale-105 shadow-2xs'
                                : 'bg-[#FAF8F5] border-[#E8E2D9] text-[#1D1819]'
                            }`}
                          >
                            {val.toFixed(1)}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Upstream Output Gradient Tensor */}
                <div className="bg-white border border-[#E8E2D9] rounded-lg p-3 space-y-2">
                  <div className="text-[11px] font-bold text-[#1D1819] flex justify-between">
                    <span>Upstream δ_out (3×3)</span>
                    <span className="text-[#6E1A2B] font-mono-num">∂L/∂Y</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {outputGrad.map((row, r) =>
                      row.map((val, c) => {
                        const isSelected = selectedPatch.r === r && selectedPatch.c === c;
                        return (
                          <div
                            key={`g-${r}-${c}`}
                            className={`p-2 text-center text-xs font-mono-num rounded border transition-all ${
                              isSelected
                                ? 'bg-[#6E1A2B] text-white border-[#6E1A2B] font-bold shadow-2xs scale-105'
                                : val >= 0
                                ? 'bg-[#FCFAF7] border-[#E8E2D9] text-[#6E1A2B]'
                                : 'bg-[#FBF6EB] border-[#E8D3A8] text-[#C28E38]'
                            }`}
                          >
                            {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Kernel Gradient Result Matrix */}
                <div className="bg-white border-2 border-[#6E1A2B]/40 rounded-lg p-3 space-y-2 shadow-2xs">
                  <div className="text-[11px] font-bold text-[#6E1A2B] flex justify-between">
                    <span>Gradient ∂L/∂K (2×2)</span>
                    <span className="font-mono-num">Accumulated</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {dL_dK.map((row, r) =>
                      row.map((val, c) => (
                        <div
                          key={`dk-${r}-${c}`}
                          className="p-3 text-center rounded bg-[#FAF8F5] border border-[#E8E2D9] text-xs font-mono-num font-bold text-[#1D1819]"
                        >
                          <div className="text-[9px] text-[#625956]">∂L/∂K[{r},{c}]</div>
                          <div className={val >= 0 ? 'text-[#6E1A2B]' : 'text-[#C28E38]'}>
                            {val.toFixed(2)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Step explanation */}
              <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg p-3.5 text-xs text-[#625956] leading-relaxed space-y-1">
                <div className="font-bold text-[#1D1819] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#C28E38]" />
                  Mathematical Derivation:
                </div>
                <div>
                  Each kernel parameter <code className="bg-white px-1 py-0.5 rounded border text-[#6E1A2B]">K[m,n]</code> was multiplied by the corresponding patch pixels across all spatial locations during the forward pass. Therefore, by the chain rule, its gradient is the sum of products between overlapping input pixels and upstream output error deltas:
                </div>
                <div className="font-mono-num text-[11px] text-[#1D1819] bg-white p-2 rounded border border-[#E8E2D9]">
                  ∂L/∂K[m,n] = ∑_(i,j) δ_out[i,j] × X[i+m, j+n]
                </div>
              </div>
            </div>
          )}

          {mode === 'input-grad' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#625956]">
                  Backpropagating to Inputs: Full Conv with 180° Rotated Kernel
                </h4>
                <span className="text-[11px] font-mono-num text-[#6E1A2B] bg-[#F9ECEF] px-2 py-0.5 rounded border border-[#6E1A2B]/20">
                  Full Convolution: δ_in = δ_out ⋆ rot180(K)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 180° Rotated Kernel */}
                <div className="bg-white border border-[#E8E2D9] rounded-lg p-4 space-y-2">
                  <div className="text-xs font-bold text-[#1D1819] flex items-center justify-between">
                    <span>Rotated Kernel rot180(K)</span>
                    <span className="text-[10px] text-[#8E6523] font-mono-num">Flipped rows & cols</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {rotK.map((row, r) =>
                      row.map((val, c) => (
                        <div
                          key={`rotk-${r}-${c}`}
                          className="p-3 text-center rounded bg-[#FBF6EB] border border-[#E8D3A8] text-xs font-mono-num font-bold text-[#8E6523]"
                        >
                          <div className="text-[9px] text-[#625956]">K[{1-r},{1-c}]</div>
                          <div>{val.toFixed(2)}</div>
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-[11px] text-[#625956] leading-tight pt-1">
                    In backpropagation, reversing kernel coordinates flips the spatial directional flow, accurately routing error gradients backward to the input neurons that produced them.
                  </p>
                </div>

                {/* Resulting Input Gradient dL/dX */}
                <div className="bg-white border border-[#E8E2D9] rounded-lg p-4 space-y-2">
                  <div className="text-xs font-bold text-[#1D1819] flex items-center justify-between">
                    <span>Input Activation Gradient ∂L/∂X (4×4)</span>
                    <span className="text-[10px] text-[#6E1A2B] font-mono-num">Propagates to prev layer</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {dL_dX.map((row, r) =>
                      row.map((val, c) => (
                        <div
                          key={`dx-${r}-${c}`}
                          className="p-1.5 text-center text-xs font-mono-num rounded border bg-[#FAF8F5] border-[#E8E2D9] text-[#1D1819]"
                        >
                          {val.toFixed(2)}
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-[11px] text-[#625956] leading-tight pt-1">
                    These gradients ∂L/∂X flow into earlier layers or activation derivatives (e.g. ReLU gating δ ⊙ 𝕀(z &gt; 0)).
                  </p>
                </div>
              </div>
            </div>
          )}

          {mode === 'pool-routing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#625956]">
                  Max-Pooling Backward Pass: Argmax Gradient Mask Routing
                </h4>
                <span className="text-[11px] font-mono-num text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#86EFAC]">
                  Only Maxima Receive Gradients
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Forward Pass with Argmax Highlighted */}
                <div className="bg-white border border-[#E8E2D9] rounded-lg p-4 space-y-2">
                  <div className="text-xs font-bold text-[#1D1819] flex items-center justify-between">
                    <span>Input Activations & Winning Maxima</span>
                    <span className="text-[10px] text-[#8E6523] font-mono-num">Gold = Argmax Winner</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {inputMap.map((row, r) =>
                      row.map((val, c) => {
                        const isMax = poolGradResult.mask[r][c];
                        return (
                          <div
                            key={`pool-in-${r}-${c}`}
                            className={`p-2 text-center text-xs font-mono-num rounded border transition-all ${
                              isMax
                                ? 'bg-[#FBF6EB] border-[#C28E38] text-[#8E6523] font-bold ring-2 ring-[#C28E38]/30 shadow-2xs'
                                : 'bg-[#FAF8F5] border-[#E8E2D9] text-[#625956]/70'
                            }`}
                          >
                            {val.toFixed(1)}
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="text-[11px] text-[#625956] pt-1">
                    2×2 non-overlapping pooling windows. The maximum neuron in each window is saved in a backward index cache.
                  </div>
                </div>

                {/* Routed Gradients */}
                <div className="bg-white border border-[#E8E2D9] rounded-lg p-4 space-y-2">
                  <div className="text-xs font-bold text-[#1D1819] flex items-center justify-between">
                    <span>Backpropagated Gradients ∂L/∂X</span>
                    <span className="text-[10px] text-[#6E1A2B] font-mono-num">Non-maxima receive 0.0</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {poolGradResult.dL_dX.map((row, r) =>
                      row.map((val, c) => {
                        const isMax = poolGradResult.mask[r][c];
                        return (
                          <div
                            key={`pool-grad-${r}-${c}`}
                            className={`p-2 text-center text-xs font-mono-num rounded border ${
                              isMax
                                ? 'bg-[#6E1A2B] text-white border-[#6E1A2B] font-bold shadow-2xs'
                                : 'bg-[#FAF8F5] border-[#E8E2D9] text-[#625956]/40'
                            }`}
                          >
                            {val.toFixed(1)}
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="text-[11px] text-[#625956] pt-1">
                    All non-max coordinates receive an exact gradient of <strong>0.00</strong> because altering them would have zero impact on the forward loss.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Controls, Weights & Parameter Update */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E8E2D9] rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#625956]">
              Parameter Gradient Descent Step
            </h4>

            {/* Current Kernel Weights */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#1D1819]">Current Weights K</span>
                <span className="font-mono-num text-[11px] text-[#625956]">Prior to update</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {kernel.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`cur-k-${r}-${c}`}
                      className="p-2.5 rounded bg-[#FAF8F5] border border-[#E8E2D9] flex justify-between items-center text-xs font-mono-num"
                    >
                      <span className="text-[#625956] text-[10px]">w[{r},{c}]</span>
                      <span className="font-bold text-[#1D1819]">{val.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Learning Rate Slider */}
            <div className="space-y-1.5 pt-2 border-t border-[#E8E2D9]">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="lr-slider" className="font-semibold text-[#1D1819]">
                  Learning Rate η
                </label>
                <span className="font-mono-num font-bold text-[#6E1A2B]">
                  {learningRate.toFixed(2)}
                </span>
              </div>
              <input
                id="lr-slider"
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={learningRate}
                onChange={e => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-[#6E1A2B] cursor-pointer"
              />
            </div>

            {/* Updated Kernel Weights: K_next = K - eta * dL/dK */}
            <div className="space-y-2 pt-2 border-t border-[#E8E2D9]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#15803D] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Updated Weights K_next
                </span>
                <span className="font-mono-num text-[10px] text-[#625956]">K - η · ∂L/∂K</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {updatedKernel.map((row, r) =>
                  row.map((val, c) => {
                    const diff = val - kernel[r][c];
                    return (
                      <div
                        key={`up-k-${r}-${c}`}
                        className="p-2.5 rounded bg-[#DCFCE7]/40 border border-[#86EFAC] flex justify-between items-center text-xs font-mono-num"
                      >
                        <span className="text-[#166534] text-[10px]">w[{r},{c}]</span>
                        <div className="text-right">
                          <div className="font-bold text-[#15803D]">{val.toFixed(2)}</div>
                          <div className="text-[9px] text-[#625956]">
                            ({diff >= 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)})
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Arithmetic Trace Formula */}
            <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-lg space-y-1.5 text-xs text-[#625956]">
              <div className="font-bold text-[#1D1819] text-[11px] uppercase tracking-wide">
                Gradient Descent Update Rule
              </div>
              <div className="font-mono-num text-[11px] text-[#1D1819]">
                K_new = K_old - {learningRate.toFixed(2)} × [∂L/∂K]
              </div>
              <p className="text-[11px] leading-relaxed">
                Notice that if a kernel parameter contributed to a positive prediction error, its gradient is positive, driving the weight downward to minimize loss on the next step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
