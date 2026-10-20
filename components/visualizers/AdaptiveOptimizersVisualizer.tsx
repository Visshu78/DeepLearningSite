'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  RAVINE_LANDSCAPE,
  OptimizerAlgorithm,
  OptimizerState2D,
  initOptimizerState2D,
  stepOptimizer2D
} from '@/lib/math/optimizer';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

interface OptimizerMeta {
  id: OptimizerAlgorithm;
  name: string;
  color: string;
  formula: string;
  description: string;
}

const OPTIMIZER_METAS: OptimizerMeta[] = [
  {
    id: 'sgd',
    name: 'Standard SGD',
    color: '#B91C1C', // Red
    formula: '\\theta_{t+1} = \\theta_t - \\eta \\nabla L(\\theta_t)',
    description: 'Oscillates violently across the steep vertical canyon walls while making slow progress toward the basin.'
  },
  {
    id: 'momentum',
    name: 'SGD + Momentum',
    color: '#B45309', // Amber
    formula: 'v_t = \\beta v_{t-1} + (1-\\beta) g_t, \\quad \\theta_{t+1} = \\theta_t - \\eta v_t',
    description: 'Accumulates velocity in consistent directions, dampening high-frequency orthogonal oscillations.'
  },
  {
    id: 'rmsprop',
    name: 'RMSprop',
    color: '#2563EB', // Blue
    formula: 's_t = \\beta s_{t-1} + (1-\\beta) g_t^2, \\quad \\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{s_t + \\epsilon}} g_t',
    description: 'Divides the gradient by the running root-mean-square of recent gradients, equalizing step sizes across axes.'
  },
  {
    id: 'adam',
    name: 'Adam (Adaptive Moments)',
    color: '#0D6E6E', // Teal
    formula: '\\hat{m}_t, \\hat{v}_t \\text{ with bias correction}, \\quad \\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t',
    description: 'Combines momentum with adaptive per-parameter learning rate scaling and initialization bias correction.'
  }
];

export function AdaptiveOptimizersVisualizer() {
  const [activeAlgorithms, setActiveAlgorithms] = useState<Record<OptimizerAlgorithm, boolean>>({
    sgd: true,
    momentum: true,
    rmsprop: true,
    adam: true
  });
  const [learningRate, setLearningRate] = useState<number>(0.12);
  const [beta1, setBeta1] = useState<number>(0.9);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [stepCount, setStepCount] = useState<number>(0);

  // States for each algorithm
  const [states, setStates] = useState<Record<OptimizerAlgorithm, OptimizerState2D>>({
    sgd: initOptimizerState2D('sgd'),
    momentum: initOptimizerState2D('momentum'),
    rmsprop: initOptimizerState2D('rmsprop'),
    adam: initOptimizerState2D('adam')
  });

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setStepCount(0);
    setStates({
      sgd: initOptimizerState2D('sgd'),
      momentum: initOptimizerState2D('momentum'),
      rmsprop: initOptimizerState2D('rmsprop'),
      adam: initOptimizerState2D('adam')
    });
  }, []);

  const handleStep = useCallback(() => {
    setStates(prev => {
      const next: Record<OptimizerAlgorithm, OptimizerState2D> = { ...prev };
      (Object.keys(prev) as OptimizerAlgorithm[]).forEach(algo => {
        if (activeAlgorithms[algo]) {
          next[algo] = stepOptimizer2D(prev[algo], RAVINE_LANDSCAPE, learningRate, beta1);
        }
      });
      return next;
    });
    setStepCount(c => c + 1);
  }, [activeAlgorithms, learningRate, beta1]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStepCount(c => {
        if (c >= 70) {
          setIsPlaying(false);
          return c;
        }
        return c;
      });
      handleStep();
    }, 150);
    return () => clearInterval(timer);
  }, [isPlaying, handleStep]);

  const toggleAlgorithm = (algo: OptimizerAlgorithm) => {
    setActiveAlgorithms(prev => ({
      ...prev,
      [algo]: !prev[algo]
    }));
  };

  // SVG coordinate transformation
  const svgWidth = 540;
  const svgHeight = 320;
  const pad = 35;
  const { xMin, xMax, yMin, yMax } = RAVINE_LANDSCAPE.bounds;

  const toSvgX = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (svgWidth - 2 * pad);
  const toSvgY = (y: number) => svgHeight - pad - ((y - yMin) / (yMax - yMin)) * (svgHeight - 2 * pad);

  // Contour rings for ravine L(x, y) = 0.5 x^2 + 8.0 y^2 = C
  const contourLevels = [0.5, 2.0, 5.0, 10.0, 18.0, 28.0];
  const contourEllipses = contourLevels.map(c => {
    const rx = Math.sqrt((2 * c) / 0.5);
    const ry = Math.sqrt(c / 8.0);
    const cx = toSvgX(0);
    const cy = toSvgY(0);
    const svgRx = ((rx) / (xMax - xMin)) * (svgWidth - 2 * pad);
    const svgRy = ((ry) / (yMax - yMin)) * (svgHeight - 2 * pad);
    return { c, cx, cy, svgRx, svgRy };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-[#EEF7F7] border border-[#B7E2E2] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-mono-num font-bold text-[#0D6E6E] uppercase tracking-wider">
            Adaptive Optimizers Benchmark Arena
          </div>
          <p className="text-xs text-[#5C626B]">
            Race SGD, Momentum, RMSprop, and Adam simultaneously across an anisotropic ravine valley to observe oscillation dampening and adaptive per-parameter scaling.
          </p>
        </div>
        <button
          onClick={() => {
            handleReset();
            setLearningRate(0.15);
            setBeta1(0.9);
          }}
          className="px-3 py-1.5 text-xs font-semibold rounded border border-[#0D6E6E] text-[#0D6E6E] bg-white hover:bg-[#EEF7F7] transition-colors shrink-0"
        >
          Reset Arena
        </button>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border border-[#E6E6E0] rounded-lg">
        {/* Active Optimizers Toggle */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#18191B] block">Active Contenders</label>
          <div className="grid grid-cols-2 gap-1.5">
            {OPTIMIZER_METAS.map(opt => {
              const active = activeAlgorithms[opt.id];
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleAlgorithm(opt.id)}
                  className={`flex items-center gap-2 p-1.5 rounded border text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[#FAF8F5] border-[#D1D1C7]'
                      : 'bg-[#F4F4F1] border-[#E6E6E0] opacity-50'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: opt.color }}
                  />
                  <span className="truncate">{opt.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Learning rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#18191B]">Learning Rate (η)</span>
            <span className="font-mono-num font-bold text-[#0D6E6E]">{learningRate.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.02"
            max="0.25"
            step="0.01"
            value={learningRate}
            onChange={e => setLearningRate(parseFloat(e.target.value))}
            className="w-full accent-[#0D6E6E]"
          />
          <div className="flex justify-between text-[10px] text-[#878E99]">
            <span>0.02 (Slow)</span>
            <span>0.12 (Standard)</span>
            <span>0.25 (Oscillatory)</span>
          </div>
        </div>

        {/* Momentum Beta */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#18191B]">Momentum Beta (β₁)</span>
            <span className="font-mono-num font-bold text-[#0D6E6E]">{beta1.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="0.98"
            step="0.02"
            value={beta1}
            onChange={e => setBeta1(parseFloat(e.target.value))}
            className="w-full accent-[#0D6E6E]"
          />
          <div className="flex justify-between text-[10px] text-[#878E99]">
            <span>0.50 (Low Inertia)</span>
            <span>0.90 (Default)</span>
            <span>0.98 (High Inertia)</span>
          </div>
        </div>
      </div>

      {/* Main Contour Arena & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2D Contour Plot */}
        <div className="lg:col-span-8 bg-white border border-[#E6E6E0] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#18191B]">2D Ravine Trajectory: L(x, y) = 0.5x² + 8y²</h3>
            <span className="text-xs font-mono-num text-[#5C626B]">
              Step: <strong className="text-[#18191B]">{stepCount}</strong> / 70
            </span>
          </div>

          <div className="border border-[#E6E6E0] rounded-md bg-[#FAF8F5] p-2 flex justify-center">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-80 overflow-visible">
              {/* Elliptical Contours */}
              {contourEllipses.map((ell, i) => (
                <ellipse
                  key={i}
                  cx={ell.cx}
                  cy={ell.cy}
                  rx={ell.svgRx}
                  ry={ell.svgRy}
                  fill="none"
                  stroke="#E2E2D9"
                  strokeWidth="1.2"
                />
              ))}

              {/* Axes */}
              <line
                x1={toSvgX(xMin)}
                y1={toSvgY(0)}
                x2={toSvgX(xMax)}
                y2={toSvgY(0)}
                stroke="#D1D1C7"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <line
                x1={toSvgX(0)}
                y1={toSvgY(yMin)}
                x2={toSvgX(0)}
                y2={toSvgY(yMax)}
                stroke="#D1D1C7"
                strokeWidth="1"
                strokeDasharray="2 2"
              />

              {/* Center Minimum Marker */}
              <circle
                cx={toSvgX(0)}
                cy={toSvgY(0)}
                r="4"
                fill="#15803D"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />

              {/* Optimizer Trajectories */}
              {OPTIMIZER_METAS.map(opt => {
                if (!activeAlgorithms[opt.id]) return null;
                const hist = states[opt.id].history;
                if (hist.length < 1) return null;

                const pathData = hist
                  .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${toSvgX(pt.x).toFixed(1)} ${toSvgY(pt.y).toFixed(1)}`)
                  .join(' ');

                const currentPt = hist[hist.length - 1];

                return (
                  <g key={opt.id}>
                    <path
                      d={pathData}
                      fill="none"
                      stroke={opt.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.85"
                    />
                    <circle
                      cx={toSvgX(currentPt.x)}
                      cy={toSvgY(currentPt.y)}
                      r="5"
                      fill={opt.color}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded bg-[#0D6E6E] text-white text-xs font-semibold hover:bg-[#085252] transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Race' : 'Run Race'}</span>
            </button>
            <button
              onClick={handleStep}
              className="p-2 px-3 flex items-center gap-1.5 rounded border border-[#E6E6E0] bg-white text-xs font-semibold text-[#18191B] hover:border-[#0D6E6E] transition-colors"
            >
              <span>Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded border border-[#E6E6E0] bg-white text-[#18191B] hover:border-[#0D6E6E] transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Convergence Leaderboard */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#E6E6E0] rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#18191B]">Convergence Leaderboard</h3>

            <div className="space-y-3">
              {OPTIMIZER_METAS.map(opt => {
                const active = activeAlgorithms[opt.id];
                const state = states[opt.id];
                const currentLoss = state.history[state.history.length - 1].loss;
                const distToMin = Math.sqrt(state.x * state.x + state.y * state.y);

                return (
                  <div
                    key={opt.id}
                    className={`p-3 rounded border space-y-2 transition-all ${
                      active
                        ? 'bg-white border-[#E6E6E0]'
                        : 'bg-[#F9F9F7] border-[#EAEAE5] opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: opt.color }}
                        />
                        <span className="text-xs font-bold text-[#18191B]">{opt.name}</span>
                      </div>
                      <span className="text-[10px] font-mono-num text-[#878E99]">
                        (x={state.x.toFixed(2)}, y={state.y.toFixed(2)})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono-num pt-1 border-t border-[#F0EEEB]">
                      <div>
                        <span className="text-[10px] text-[#878E99] block font-sans">Loss:</span>
                        <strong className="text-[#18191B]">{currentLoss.toFixed(4)}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#878E99] block font-sans">Distance to (0,0):</span>
                        <strong className="text-[#0D6E6E]">{distToMin.toFixed(3)}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-[#FAF8F5] border border-[#E6E6E0] rounded-lg text-xs text-[#5C626B] space-y-2">
            <span className="font-bold text-[#18191B] block">Why Adam Outperforms:</span>
            <p className="text-[11px] leading-relaxed">
              In elongated ravines, the vertical gradient ∂L/∂y is 16× steeper than the horizontal gradient ∂L/∂x. Adam divides by the square root of second moments, automatically shrinking the step along steep axes while taking full strides along gentle slopes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
