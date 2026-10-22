'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  NetworkConfig,
  backPropagate,
  applyGradients,
  numericalGradientCheck,
  BackpropResult
} from '@/lib/math/network';
import {
  CheckCircle2,
  RotateCcw,
  Zap,
  BookOpen,
  AlertCircle,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Box,
  ArrowRight,
  ArrowLeft,
  FastForward,
  Gauge,
  Sparkles
} from 'lucide-react';
import { IsometricNetworkStackView } from './IsometricNetworkStackView';

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

  // Propagation Focus Mode:
  // 'full': 7-step complete loop (Forward -> Loss -> Backward -> Update)
  // 'forward': 3-step feed-forward pass (Inputs -> Hidden -> Output)
  // 'backward': 4-step reverse gradient wave (Loss -> Output Grads -> Hidden Grads -> Update)
  const [propagationFocus, setPropagationFocus] = useState<'full' | 'forward' | 'backward'>('full');

  // View mode: 3D Wafer Stack vs 2D Schematic
  const [viewMode, setViewMode] = useState<'3d-stack' | '2d-schematic'>('3d-stack');

  // Auto-play state and speed
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<1 | 1.5 | 2>(1);

  // Selected parameter to verify via finite-difference gradient check
  const [verifyParam, setVerifyParam] = useState<'wOut0' | 'wOut1' | 'bOut' | 'wH00' | 'wH01' | 'wH10' | 'wH11' | 'bH0' | 'bH1'>('wOut0');

  const bpResult: BackpropResult = useMemo(() => {
    return backPropagate(config, target);
  }, [config, target]);

  // Determine active step range based on propagation focus
  const stepMin = propagationFocus === 'backward' ? 3 : 0;
  const stepMax = propagationFocus === 'forward' ? 2 : 6;

  // Auto-stepping timer with configurable playback speed
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = playSpeed === 2 ? 600 : playSpeed === 1.5 ? 950 : 1400;

    const interval = setInterval(() => {
      setBpStep(prev => {
        if (prev >= stepMax) {
          setIsPlaying(false);
          return stepMax;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, stepMax]);

  const handleToggleAutoPlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (bpStep >= stepMax || bpStep < stepMin) {
        setBpStep(stepMin);
      }
      setIsPlaying(true);
    }
  };

  const handleSelectFocus = (focus: 'full' | 'forward' | 'backward') => {
    setIsPlaying(false);
    setPropagationFocus(focus);
    if (focus === 'forward') {
      if (bpStep > 2) setBpStep(0);
    } else if (focus === 'backward') {
      if (bpStep < 3) setBpStep(3);
    }
  };

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
    '0. Input Features Vector (x₁ = 0.60, x₂ = -0.30)',
    '1. Hidden Layer Linear Combinations & Activations (z^[1], a^[1])',
    '2. Output Layer Linear Combination & Prediction (z^[2], ŷ = 0.638)',
    '3. Loss Evaluation & Output Error Delta (dL/dŷ = ŷ - y)',
    '4. Output Error Delta & Weight Gradients (δ_out, dL/dw_out)',
    '5. Hidden Layer Error Propagation (δ_hidden, dL/dw_hidden)',
    '6. Gradient Descent Parameter Updates (θ <- θ - η·grad)'
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
    setIsPlaying(false);
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
    setIsPlaying(false);
    setLastUpdateNotice(null);
  };

  // Determine current macro phase
  const currentPhase: 'forward' | 'loss' | 'backward' | 'update' =
    bpStep <= 2 ? 'forward' : bpStep === 3 ? 'loss' : bpStep <= 5 ? 'backward' : 'update';

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl shadow-xs overflow-hidden space-y-0">
      {/* Visualizer Top Header */}
      <div className="border-b border-[#EAE2D5] bg-[#FAF5EE] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#7A1C30]" aria-hidden="true"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F191B]">
            Interactive Propagation Engine
          </span>
          <span className="text-xs text-[#54484E] hidden sm:inline">
            — Forward Pass, Backward Error Wave & Full Cycle
          </span>
        </div>

        {/* View Mode Toggle: 3D Wafer Stack vs 2D Flat */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white p-0.5 rounded border border-[#EAE2D5]">
            <button
              type="button"
              onClick={() => setViewMode('3d-stack')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                viewMode === '3d-stack'
                  ? 'bg-[#7A1C30] text-white shadow-2xs'
                  : 'text-[#54484E] hover:text-[#1F191B]'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Wafer Stack</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('2d-schematic')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                viewMode === '2d-schematic'
                  ? 'bg-[#7A1C30] text-white shadow-2xs'
                  : 'text-[#54484E] hover:text-[#1F191B]'
              }`}
            >
              2D Flat Circuit
            </button>
          </div>

          <button
            type="button"
            onClick={loadWorkedExample}
            className="flex items-center gap-1 text-xs text-[#7A1C30] hover:text-[#5F1424] px-2.5 py-1 rounded border border-[#EEDAA2] bg-[#FAF2E6]"
            title="Load textbook worked example"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Example</span>
          </button>

          <button
            type="button"
            onClick={loadWorkedExample}
            className="text-xs text-[#54484E] hover:text-[#1F191B] p-1.5 rounded border border-[#EAE2D5] bg-white"
            title="Reset to initial values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Propagation Mode Selector Bar */}
      <div className="bg-[#FAF8F5] border-b border-[#EAE2D5] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-[#1F191B] uppercase tracking-wider mr-1">
            Mode:
          </span>
          <button
            type="button"
            onClick={() => handleSelectFocus('full')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
              propagationFocus === 'full'
                ? 'bg-[#7A1C30] text-white'
                : 'bg-white text-[#54484E] border border-[#EAE2D5] hover:bg-[#FAF2E6] hover:text-[#1F191B]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Full Propagation Cycle</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectFocus('forward')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
              propagationFocus === 'forward'
                ? 'bg-[#7A1C30] text-white'
                : 'bg-white text-[#54484E] border border-[#EAE2D5] hover:bg-[#FAF2E6] hover:text-[#1F191B]'
            }`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Forward Propagation</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectFocus('backward')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
              propagationFocus === 'backward'
                ? 'bg-[#B8860B] text-white'
                : 'bg-white text-[#54484E] border border-[#EAE2D5] hover:bg-[#FAF2E6] hover:text-[#1F191B]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Backward Propagation</span>
          </button>
        </div>

        {/* Playback Controls & Speed Toggle */}
        <div className="flex items-center gap-2">
          {/* Speed selector */}
          <div className="flex items-center bg-white border border-[#EAE2D5] rounded px-1 py-0.5 text-[10px]">
            <Gauge className="w-3 h-3 text-[#54484E] mr-1" />
            <button
              onClick={() => setPlaySpeed(1)}
              className={`px-1.5 py-0.2 rounded font-semibold ${playSpeed === 1 ? 'bg-[#7A1C30] text-white' : 'text-[#54484E]'}`}
            >
              1x
            </button>
            <button
              onClick={() => setPlaySpeed(1.5)}
              className={`px-1.5 py-0.2 rounded font-semibold ${playSpeed === 1.5 ? 'bg-[#7A1C30] text-white' : 'text-[#54484E]'}`}
            >
              1.5x
            </button>
            <button
              onClick={() => setPlaySpeed(2)}
              className={`px-1.5 py-0.2 rounded font-semibold ${playSpeed === 2 ? 'bg-[#7A1C30] text-white' : 'text-[#54484E]'}`}
            >
              2x
            </button>
          </div>

          {/* Run Cycle / Pass Button */}
          <button
            type="button"
            onClick={handleToggleAutoPlay}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition-all shadow-xs ${
              isPlaying
                ? 'bg-[#B8860B] text-white animate-pulse'
                : propagationFocus === 'backward'
                ? 'bg-[#B8860B] text-white hover:bg-[#92400E]'
                : 'bg-[#7A1C30] text-white hover:bg-[#5F1424]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {propagationFocus === 'full'
                    ? 'Run Full Cycle'
                    : propagationFocus === 'forward'
                    ? 'Run Forward Pass'
                    : 'Run Backward Pass'}
                </span>
              </>
            )}
          </button>

          {/* Stepper Buttons */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setBpStep(prev => Math.max(stepMin, prev - 1));
            }}
            disabled={bpStep <= stepMin}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-[#EAE2D5] bg-white text-[#1F191B] disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <span className="text-xs font-mono-num font-bold text-[#7A1C30] bg-[#FAF2E6] px-2 py-1 rounded border border-[#EEDAA2]">
            Step {bpStep} / 6
          </span>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setBpStep(prev => Math.min(stepMax, prev + 1));
            }}
            disabled={bpStep >= stepMax}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[#7A1C30] text-white hover:bg-[#5F1424] disabled:opacity-40"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Macro Sequence Diagram Banner */}
      <div className="bg-[#FAF5EE] border-b border-[#EAE2D5] px-4 py-2 flex items-center justify-between gap-2 text-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            type="button"
            onClick={() => { setIsPlaying(false); setBpStep(0); }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              currentPhase === 'forward'
                ? 'bg-[#7A1C30] text-white shadow-2xs'
                : 'bg-white text-[#54484E] border border-[#EAE2D5] hover:bg-[#FAF2E6]'
            }`}
          >
            <ArrowRight className="w-3 h-3 text-[#EEDAA2]" />
            <span>1. Forward Pass (Steps 0–2)</span>
          </button>

          <span className="text-[#968A86]">→</span>

          <button
            type="button"
            onClick={() => { setIsPlaying(false); setBpStep(3); }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              currentPhase === 'loss'
                ? 'bg-[#B8860B] text-white shadow-2xs'
                : 'bg-white text-[#54484E] border border-[#EAE2D5] hover:bg-[#FAF2E6]'
            }`}
          >
            <span>2. Loss & Error (Step 3)</span>
          </button>

          <span className="text-[#968A86]">→</span>

          <button
            type="button"
            onClick={() => { setIsPlaying(false); setBpStep(4); }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              currentPhase === 'backward'
                ? 'bg-[#B8860B] text-white shadow-2xs'
                : 'bg-white text-[#54484E] border border-[#EAE2D5] hover:bg-[#FAF2E6]'
            }`}
          >
            <ArrowLeft className="w-3 h-3 text-[#FEF3C7]" />
            <span>3. Backward Wave (Steps 4–5)</span>
          </button>

          <span className="text-[#968A86]">→</span>

          <button
            type="button"
            onClick={() => { setIsPlaying(false); setBpStep(6); }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              currentPhase === 'update'
                ? 'bg-[#15803D] text-white shadow-2xs'
                : 'bg-white text-[#54484E] border border-[#EAE2D5] hover:bg-[#FAF2E6]'
            }`}
          >
            <Zap className="w-3 h-3 text-[#BBF7D0]" />
            <span>4. Parameter Update (Step 6)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#EAE2D5]">
        {/* Network Diagram View: 3D Wafer Stack or 2D Schematic */}
        <div className="lg:col-span-7 p-4 bg-[#FCFCFA] flex flex-col items-center justify-center min-h-[400px]">
          {viewMode === '3d-stack' ? (
            <IsometricNetworkStackView
              inputs={config.inputs}
              wHidden={config.wHidden}
              bHidden={config.bHidden}
              wOutput={config.wOutput}
              bOutput={config.bOutput}
              currentStep={bpStep}
              fwdResult={bpResult.forward}
              bpResult={bpResult}
              mode="backprop"
              target={target}
            />
          ) : (
            <div className="w-full flex flex-col items-center">
              <svg
                viewBox="0 0 540 310"
                className="w-full max-w-[540px] h-auto select-none"
                role="img"
                aria-label="2D Neural Network schematic showing forward signals and backward error propagation"
              >
                <defs>
                  {/* Arrow markers */}
                  <marker id="fwd-arrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill="#7A1C30" />
                  </marker>
                  <marker id="back-arrow" markerWidth="6" markerHeight="6" refX="2" refY="3" orient="auto">
                    <polygon points="6 0, 0 3, 6 6" fill="#B8860B" />
                  </marker>
                  <marker id="update-arrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill="#15803D" />
                  </marker>
                </defs>

                {/* Layer Headers */}
                <text x="80" y="24" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#54484E">
                  INPUT LAYER (l=0)
                </text>
                <text x="260" y="24" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#54484E">
                  HIDDEN LAYER (l=1)
                </text>
                <text x="430" y="24" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#54484E">
                  OUTPUT & LOSS
                </text>

                {/* SYNAPTIC WIRES: INPUT -> HIDDEN */}
                {/* Synapse: x1 -> h1 */}
                <line
                  x1="104"
                  y1="95"
                  x2="234"
                  y2="95"
                  stroke={bpStep === 1 ? '#7A1C30' : bpStep === 5 ? '#B8860B' : bpStep === 6 ? '#15803D' : '#D1D1C7'}
                  strokeWidth={bpStep === 1 || bpStep === 5 || bpStep === 6 ? 2.5 : 1.2}
                  strokeDasharray={bpStep === 5 ? '4 3' : undefined}
                />
                {/* Synapse: x1 -> h2 */}
                <line
                  x1="104"
                  y1="95"
                  x2="234"
                  y2="205"
                  stroke={bpStep === 1 ? '#7A1C30' : bpStep === 5 ? '#B8860B' : bpStep === 6 ? '#15803D' : '#D1D1C7'}
                  strokeWidth={bpStep === 1 || bpStep === 5 || bpStep === 6 ? 2.5 : 1.2}
                  strokeDasharray={bpStep === 5 ? '4 3' : undefined}
                />
                {/* Synapse: x2 -> h1 */}
                <line
                  x1="104"
                  y1="205"
                  x2="234"
                  y2="95"
                  stroke={bpStep === 1 ? '#7A1C30' : bpStep === 5 ? '#B8860B' : bpStep === 6 ? '#15803D' : '#D1D1C7'}
                  strokeWidth={bpStep === 1 || bpStep === 5 || bpStep === 6 ? 2.5 : 1.2}
                  strokeDasharray={bpStep === 5 ? '4 3' : undefined}
                />
                {/* Synapse: x2 -> h2 */}
                <line
                  x1="104"
                  y1="205"
                  x2="234"
                  y2="205"
                  stroke={bpStep === 1 ? '#7A1C30' : bpStep === 5 ? '#B8860B' : bpStep === 6 ? '#15803D' : '#D1D1C7'}
                  strokeWidth={bpStep === 1 || bpStep === 5 || bpStep === 6 ? 2.5 : 1.2}
                  strokeDasharray={bpStep === 5 ? '4 3' : undefined}
                />

                {/* SYNAPTIC WIRES: HIDDEN -> OUTPUT */}
                {/* Synapse: h1 -> y_out */}
                <line
                  x1="286"
                  y1="95"
                  x2="402"
                  y2="150"
                  stroke={bpStep === 2 ? '#7A1C30' : bpStep === 4 ? '#B8860B' : bpStep === 6 ? '#15803D' : '#D1D1C7'}
                  strokeWidth={bpStep === 2 || bpStep === 4 || bpStep === 6 ? 2.5 : 1.2}
                  strokeDasharray={bpStep === 4 ? '4 3' : undefined}
                />
                {/* Synapse: h2 -> y_out */}
                <line
                  x1="286"
                  y1="205"
                  x2="402"
                  y2="150"
                  stroke={bpStep === 2 ? '#7A1C30' : bpStep === 4 ? '#B8860B' : bpStep === 6 ? '#15803D' : '#D1D1C7'}
                  strokeWidth={bpStep === 2 || bpStep === 4 || bpStep === 6 ? 2.5 : 1.2}
                  strokeDasharray={bpStep === 4 ? '4 3' : undefined}
                />

                {/* CONNECTION: OUTPUT -> TARGET / LOSS */}
                <line
                  x1="458"
                  y1="150"
                  x2="480"
                  y2="150"
                  stroke={bpStep >= 3 ? '#B8860B' : '#D1D1C7'}
                  strokeWidth={bpStep >= 3 ? 2 : 1}
                />

                {/* Directional Propagation Arrows */}
                {bpStep === 1 && (
                  <>
                    <polygon points="175 92, 183 95, 175 98" fill="#7A1C30" />
                    <polygon points="175 202, 183 205, 175 208" fill="#7A1C30" />
                  </>
                )}
                {bpStep === 2 && (
                  <>
                    <polygon points="345 120, 353 124, 347 128" fill="#7A1C30" />
                    <polygon points="345 180, 353 176, 347 172" fill="#7A1C30" />
                  </>
                )}
                {bpStep === 4 && (
                  <>
                    <polygon points="353 120, 345 124, 351 128" fill="#B8860B" />
                    <polygon points="353 180, 345 176, 351 172" fill="#B8860B" />
                  </>
                )}
                {bpStep === 5 && (
                  <>
                    <polygon points="183 92, 175 95, 183 98" fill="#B8860B" />
                    <polygon points="183 202, 175 205, 183 208" fill="#B8860B" />
                  </>
                )}

                {/* Input Neurons */}
                <g transform="translate(80, 95)">
                  <circle
                    r="24"
                    fill={bpStep === 0 ? '#FAF2E6' : '#FFFFFF'}
                    stroke={bpStep === 0 ? '#7A1C30' : '#D1D1C7'}
                    strokeWidth={bpStep === 0 ? 2.5 : 1.5}
                  />
                  <text x="0" y="-3" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1F191B">x₁</text>
                  <text x="0" y="11" textAnchor="middle" fontSize="10" className="font-mono-num font-bold" fill="#7A1C30">
                    {config.inputs[0].toFixed(2)}
                  </text>
                </g>

                <g transform="translate(80, 205)">
                  <circle
                    r="24"
                    fill={bpStep === 0 ? '#FAF2E6' : '#FFFFFF'}
                    stroke={bpStep === 0 ? '#7A1C30' : '#D1D1C7'}
                    strokeWidth={bpStep === 0 ? 2.5 : 1.5}
                  />
                  <text x="0" y="-3" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1F191B">x₂</text>
                  <text x="0" y="11" textAnchor="middle" fontSize="10" className="font-mono-num font-bold" fill="#7A1C30">
                    {config.inputs[1].toFixed(2)}
                  </text>
                </g>

                {/* Hidden Neurons */}
                <g transform="translate(260, 95)">
                  <circle
                    r="26"
                    fill={bpStep === 1 ? '#FAF2E6' : bpStep === 5 ? '#FEF9EE' : bpStep === 6 ? '#F0FDF4' : '#FFFFFF'}
                    stroke={bpStep === 1 ? '#7A1C30' : bpStep === 5 ? '#B8860B' : bpStep === 6 ? '#15803D' : '#D1D1C7'}
                    strokeWidth={bpStep === 1 || bpStep === 5 || bpStep === 6 ? 2.5 : 1.5}
                  />
                  <text x="0" y="-5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1F191B">h₁</text>
                  <text x="0" y="8" textAnchor="middle" fontSize="9" className="font-mono-num" fill="#54484E">
                    a={bpResult.forward.aHidden[0].toFixed(2)}
                  </text>
                  {bpStep >= 5 && (
                    <text x="0" y="38" textAnchor="middle" fontSize="9" className="font-mono-num font-bold" fill="#B8860B">
                      δ₁={bpResult.dL_dzHidden[0].toFixed(3)}
                    </text>
                  )}
                </g>

                <g transform="translate(260, 205)">
                  <circle
                    r="26"
                    fill={bpStep === 1 ? '#FAF2E6' : bpStep === 5 ? '#FEF9EE' : bpStep === 6 ? '#F0FDF4' : '#FFFFFF'}
                    stroke={bpStep === 1 ? '#7A1C30' : bpStep === 5 ? '#B8860B' : bpStep === 6 ? '#15803D' : '#D1D1C7'}
                    strokeWidth={bpStep === 1 || bpStep === 5 || bpStep === 6 ? 2.5 : 1.5}
                  />
                  <text x="0" y="-5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1F191B">h₂</text>
                  <text x="0" y="8" textAnchor="middle" fontSize="9" className="font-mono-num" fill="#54484E">
                    a={bpResult.forward.aHidden[1].toFixed(2)}
                  </text>
                  {bpStep >= 5 && (
                    <text x="0" y="38" textAnchor="middle" fontSize="9" className="font-mono-num font-bold" fill="#B8860B">
                      δ₂={bpResult.dL_dzHidden[1].toFixed(3)}
                    </text>
                  )}
                </g>

                {/* Output Neuron */}
                <g transform="translate(430, 150)">
                  <circle
                    r="28"
                    fill={bpStep === 2 ? '#FAF2E6' : bpStep === 3 || bpStep === 4 ? '#FEF9EE' : bpStep === 6 ? '#F0FDF4' : '#FFFFFF'}
                    stroke={bpStep === 2 ? '#7A1C30' : bpStep === 3 || bpStep === 4 ? '#B8860B' : bpStep === 6 ? '#15803D' : '#D1D1C7'}
                    strokeWidth={bpStep >= 2 ? 2.5 : 1.5}
                  />
                  <text x="0" y="-6" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1F191B">ŷ</text>
                  <text x="0" y="8" textAnchor="middle" fontSize="11" className="font-mono-num font-bold" fill="#7A1C30">
                    {bpResult.forward.prediction.toFixed(3)}
                  </text>
                  {bpStep >= 4 && (
                    <text x="0" y="42" textAnchor="middle" fontSize="9" className="font-mono-num font-bold" fill="#B8860B">
                      δ_out={bpResult.dL_dzOutput.toFixed(3)}
                    </text>
                  )}
                </g>

                {/* Target & Loss Box */}
                <g transform="translate(510, 150)">
                  <rect
                    x="-26"
                    y="-24"
                    width="52"
                    height="48"
                    rx="4"
                    fill={bpStep >= 3 ? '#FEF9EE' : '#FFFFFF'}
                    stroke={bpStep >= 3 ? '#B8860B' : '#D1D1C7'}
                    strokeWidth={bpStep >= 3 ? 2 : 1}
                  />
                  <text x="0" y="-9" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#54484E">Target y</text>
                  <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#15803D" className="font-mono-num">{target.toFixed(1)}</text>
                  <text x="0" y="17" textAnchor="middle" fontSize="8.5" className="font-mono-num font-bold" fill="#B8860B">L={bpResult.loss.toFixed(3)}</text>
                </g>
              </svg>
            </div>
          )}

          {/* Finite-Difference Gradient Check Verification Box */}
          <div className="w-full max-w-[500px] mt-3 p-2.5 bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1F191B]">Finite-Difference Gradient Verification:</span>
              <select
                aria-label="Parameter to check with finite difference"
                value={verifyParam}
                onChange={e => setVerifyParam(e.target.value as any)}
                className="text-xs bg-white border border-[#D1D1C7] rounded px-2 py-0.5 text-[#1F191B]"
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

            <div className="flex items-center justify-between font-mono-num text-[11px] pt-1 border-t border-[#EAE2D5]">
              <span>Analytical ∂L/∂θ: <strong>{gradCheckData.analytical.toFixed(5)}</strong></span>
              <span>Numerical (ε=1e-5): <strong>{gradCheckData.numerical.toFixed(5)}</strong></span>
              <span className={`font-bold flex items-center gap-1 ${gradCheckData.isExact ? 'text-[#166534]' : 'text-[#B91C1C]'}`}>
                {gradCheckData.isExact ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Exact Match</span>
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
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A1C30] mb-0.5 flex items-center justify-between">
              <span>Current Step Details</span>
              <span className="font-mono-num text-[10px] text-[#54484E] bg-white px-2 py-0.5 rounded border border-[#EAE2D5]">
                Phase: {currentPhase.toUpperCase()}
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#1F191B]">
              {stepLabels[bpStep]}
            </h4>
          </div>

          {/* Contextual math equations for current step */}
          <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded-lg p-3 text-xs space-y-2">
            {bpStep === 0 && (
              <div className="space-y-1">
                <div className="font-bold text-[#1F191B]">Forward Pass 1: Input Vector Injection</div>
                <p className="text-[#54484E]">
                  Raw feature signals enter the network through the input layer:
                </p>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#EAE2D5] space-y-0.5">
                  <div>Input x₁ = <strong className="text-[#7A1C30]">{config.inputs[0].toFixed(2)}</strong></div>
                  <div>Input x₂ = <strong className="text-[#7A1C30]">{config.inputs[1].toFixed(2)}</strong></div>
                </div>
                <p className="text-[11px] text-[#54484E]">
                  In the next step, these input features will multiply along the synaptic weights to excite the hidden layer.
                </p>
              </div>
            )}

            {bpStep === 1 && (
              <div className="space-y-1">
                <div className="font-bold text-[#1F191B]">Forward Pass 2: Hidden Layer Linear Combinations & Activations</div>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#EAE2D5] space-y-1">
                  <div>z_h1 = w₁₁x₁ + w₁₂x₂ + b_h1 = <strong className="text-[#7A1C30]">{bpResult.forward.zHidden[0].toFixed(3)}</strong></div>
                  <div>a_h1 = σ(z_h1) = <strong className="text-[#7A1C30]">{bpResult.forward.aHidden[0].toFixed(3)}</strong></div>
                  <div className="pt-1 border-t border-[#EAE2D5]">z_h2 = w₂₁x₁ + w₂₂x₂ + b_h2 = <strong className="text-[#7A1C30]">{bpResult.forward.zHidden[1].toFixed(3)}</strong></div>
                  <div>a_h2 = σ(z_h2) = <strong className="text-[#7A1C30]">{bpResult.forward.aHidden[1].toFixed(3)}</strong></div>
                </div>
                <p className="text-[11px] text-[#54484E]">
                  Forward electrical signals travel into the hidden wafer along the synaptic conduits.
                </p>
              </div>
            )}

            {bpStep === 2 && (
              <div className="space-y-1">
                <div className="font-bold text-[#1F191B]">Forward Pass 3: Output Prediction Generation</div>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#EAE2D5] space-y-1">
                  <div>z_out = w_out1·a_h1 + w_out2·a_h2 + b_out = <strong className="text-[#7A1C30]">{bpResult.forward.zOutput.toFixed(3)}</strong></div>
                  <div>ŷ = σ(z_out) = <strong className="text-[#7A1C30]">{bpResult.forward.prediction.toFixed(4)}</strong></div>
                </div>
                <p className="text-[11px] text-[#54484E]">
                  The forward pass is complete! The model has generated prediction <strong>ŷ = {bpResult.forward.prediction.toFixed(3)}</strong>.
                </p>
              </div>
            )}

            {bpStep === 3 && (
              <div className="space-y-1">
                <div className="font-bold text-[#1F191B]">Loss Evaluation & Objective Comparison</div>
                <p className="text-[#54484E]">
                  Comparing model prediction <strong>ŷ = {bpResult.forward.prediction.toFixed(4)}</strong> against ground truth <strong>y = {target.toFixed(2)}</strong>:
                </p>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#EAE2D5] space-y-1">
                  <div>Loss L = 0.5 × (ŷ - y)² = <strong className="text-[#B8860B]">{bpResult.loss.toFixed(4)}</strong></div>
                  <div>Initial Loss Derivative: ∂L/∂ŷ = ŷ - y = <strong className="text-[#B8860B]">{bpResult.dL_dPred.toFixed(4)}</strong></div>
                </div>
                <p className="text-[11px] text-[#54484E]">
                  This discrepancy (∂L/∂ŷ) is the anchor gradient that initiates reverse backpropagation!
                </p>
              </div>
            )}

            {bpStep === 4 && (
              <div className="space-y-1">
                <div className="font-bold text-[#1F191B]">Backward Wave 1: Output Error Delta & Weight Gradients</div>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#EAE2D5] space-y-1">
                  <div>δ_out = (∂L/∂ŷ) · σ&apos;(z_out) = {bpResult.dL_dPred.toFixed(3)} × {bpResult.forward.outputDerivative.toFixed(3)} = <strong className="text-[#B8860B]">{bpResult.dL_dzOutput.toFixed(4)}</strong></div>
                  <div className="pt-1 border-t border-[#EAE2D5]">∂L/∂w_out1 = δ_out · a_h1 = <strong className="text-[#B8860B]">{bpResult.dL_dwOutput[0].toFixed(4)}</strong></div>
                  <div>∂L/∂w_out2 = δ_out · a_h2 = <strong className="text-[#B8860B]">{bpResult.dL_dwOutput[1].toFixed(4)}</strong></div>
                  <div>∂L/∂b_out = δ_out · 1 = <strong className="text-[#B8860B]">{bpResult.dL_dbOutput.toFixed(4)}</strong></div>
                </div>
                <p className="text-[11px] text-[#54484E]">
                  Output error δ_out reflects backward to determine output weight sensitivities.
                </p>
              </div>
            )}

            {bpStep === 5 && (
              <div className="space-y-1">
                <div className="font-bold text-[#1F191B]">Backward Wave 2: Hidden Layer Error Deltas & Weight Gradients</div>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#EAE2D5] space-y-1">
                  <div>δ_h1 = (δ_out · w_out1) · σ&apos;(z_h1) = <strong className="text-[#B8860B]">{bpResult.dL_dzHidden[0].toFixed(4)}</strong></div>
                  <div>δ_h2 = (δ_out · w_out2) · σ&apos;(z_h2) = <strong className="text-[#B8860B]">{bpResult.dL_dzHidden[1].toFixed(4)}</strong></div>
                  <div className="pt-1 border-t border-[#EAE2D5]">∂L/∂w₁₁ = δ_h1 · x₁ = <strong className="text-[#B8860B]">{bpResult.dL_dwHidden[0][0].toFixed(4)}</strong></div>
                  <div>∂L/∂w₁₂ = δ_h1 · x₂ = <strong className="text-[#B8860B]">{bpResult.dL_dwHidden[0][1].toFixed(4)}</strong></div>
                  <div>∂L/∂w₂₁ = δ_h2 · x₁ = <strong className="text-[#B8860B]">{bpResult.dL_dwHidden[1][0].toFixed(4)}</strong></div>
                  <div>∂L/∂w₂₂ = δ_h2 · x₂ = <strong className="text-[#B8860B]">{bpResult.dL_dwHidden[1][1].toFixed(4)}</strong></div>
                </div>
              </div>
            )}

            {bpStep === 6 && (
              <div className="space-y-1">
                <div className="font-bold text-[#1F191B]">Parameter Update Rule: θ_new = θ - η(dL/dθ)</div>
                <p className="text-[11px] text-[#54484E]">
                  All analytical gradients are computed. Gradient descent updates weights in the descent direction:
                </p>
                <div className="font-mono-num text-[11px] bg-white p-2 rounded border border-[#EAE2D5] space-y-0.5">
                  <div>w_out1: {config.wOutput[0].toFixed(3)} → <strong className="text-[#15803D]">{(config.wOutput[0] - learningRate * bpResult.dL_dwOutput[0]).toFixed(3)}</strong></div>
                  <div>w_out2: {config.wOutput[1].toFixed(3)} → <strong className="text-[#15803D]">{(config.wOutput[1] - learningRate * bpResult.dL_dwOutput[1]).toFixed(3)}</strong></div>
                  <div>w₁₁: {config.wHidden[0][0].toFixed(3)} → <strong className="text-[#15803D]">{(config.wHidden[0][0] - learningRate * bpResult.dL_dwHidden[0][0]).toFixed(3)}</strong></div>
                  <div>w₂₁: {config.wHidden[1][0].toFixed(3)} → <strong className="text-[#15803D]">{(config.wHidden[1][0] - learningRate * bpResult.dL_dwHidden[1][0]).toFixed(3)}</strong></div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Workbench Inputs & Optimization Action */}
          <div className="space-y-2.5 pt-1 border-t border-[#EAE2D5]">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label htmlFor="bp-target-slider" className="text-[#1F191B] font-semibold">Target y ({target.toFixed(2)})</label>
                <input
                  id="bp-target-slider"
                  type="range"
                  min="0.1"
                  max="0.95"
                  step="0.05"
                  value={target}
                  onChange={e => setTarget(parseFloat(e.target.value))}
                  className="w-full accent-[#7A1C30] cursor-pointer"
                />
              </div>

              <div>
                <label htmlFor="bp-lr-slider" className="text-[#B8860B] font-semibold">Learning Rate η ({learningRate})</label>
                <input
                  id="bp-lr-slider"
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.1"
                  value={learningRate}
                  onChange={e => setLearningRate(parseFloat(e.target.value))}
                  className="w-full accent-[#B8860B] cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label htmlFor="bp-x1" className="text-[#54484E] font-medium">Input x₁ ({config.inputs[0]})</label>
                <input
                  id="bp-x1"
                  type="range"
                  min="-1.5"
                  max="1.5"
                  step="0.1"
                  value={config.inputs[0]}
                  onChange={e => setConfig(prev => ({ ...prev, inputs: [parseFloat(e.target.value), prev.inputs[1]] }))}
                  className="w-full accent-[#7A1C30] cursor-pointer"
                />
              </div>
              <div>
                <label htmlFor="bp-x2" className="text-[#54484E] font-medium">Input x₂ ({config.inputs[1]})</label>
                <input
                  id="bp-x2"
                  type="range"
                  min="-1.5"
                  max="1.5"
                  step="0.1"
                  value={config.inputs[1]}
                  onChange={e => setConfig(prev => ({ ...prev, inputs: [prev.inputs[0], parseFloat(e.target.value)] }))}
                  className="w-full accent-[#7A1C30] cursor-pointer"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={applyOneOptimizationStep}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-lg bg-[#7A1C30] text-white hover:bg-[#5F1424] transition-all shadow-2xs mt-2"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Apply 1 Gradient Step & Update Parameters</span>
            </button>
            {lastUpdateNotice && (
              <div className="text-[11px] text-[#15803D] font-medium pt-1 text-center bg-[#F0FDF4] border border-[#DCFCE7] p-1.5 rounded">
                {lastUpdateNotice}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
