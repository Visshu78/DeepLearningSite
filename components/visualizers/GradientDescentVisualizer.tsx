'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  FunctionPreset,
  LANDSCAPE_PRESETS,
  performOptimizationStep,
  OptimizationStep
} from '@/lib/math/optimizer';
import { Play, Pause, RotateCcw, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';

export function GradientDescentVisualizer() {
  const [selectedPreset, setSelectedPreset] = useState<FunctionPreset>('convex_quadratic');
  const [learningRate, setLearningRate] = useState<number>(0.2);
  const [currentTheta, setCurrentTheta] = useState<number>(5.0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [history, setHistory] = useState<OptimizationStep[]>([]);

  const landscape = LANDSCAPE_PRESETS[selectedPreset];

  // SVG dimensions
  const width = 480;
  const height = 270;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;

  const [minX, maxX] = landscape.recommendedRange;
  const minY = 0;
  const maxY = selectedPreset === 'convex_quadratic' ? 8.0 : (selectedPreset === 'sinusoidal' ? 4.0 : 2.5);

  const toSvgX = useCallback((x: number) => {
    return padLeft + ((x - minX) / (maxX - minX)) * (width - padLeft - padRight);
  }, [minX, maxX]);

  const toSvgY = useCallback((y: number) => {
    const clamped = Math.max(minY, Math.min(maxY, y));
    return height - padBottom - ((clamped - minY) / (maxY - minY)) * (height - padTop - padBottom);
  }, [maxY]);

  // Generate curve path
  const curvePath = useMemo(() => {
    const steps = 120;
    const stepSize = (maxX - minX) / steps;
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const x = minX + i * stepSize;
      const y = landscape.evaluate(x);
      const px = toSvgX(x);
      const py = toSvgY(y);
      if (i === 0) d += `M ${px.toFixed(1)} ${py.toFixed(1)}`;
      else d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
    }
    return d;
  }, [landscape, maxX, minX, toSvgX, toSvgY]);

  // Current step calculation
  const currentStep = useMemo(() => {
    return performOptimizationStep(landscape, currentTheta, learningRate, history.length + 1);
  }, [landscape, currentTheta, learningRate, history.length]);

  const isDiverged = Math.abs(currentTheta) > 30;

  const stepOnce = useCallback(() => {
    setCurrentTheta(prevTheta => {
      if (Math.abs(prevTheta) > 30) {
        setIsRunning(false);
        return prevTheta;
      }
      const step = performOptimizationStep(landscape, prevTheta, learningRate, history.length + 1);
      setHistory(prevHist => [step, ...prevHist.slice(0, 19)]);
      if (step.isDiverged) {
        setIsRunning(false);
      }
      return step.nextTheta;
    });
  }, [landscape, learningRate, history.length]);

  // Auto-play timer without synchronous setState in effect body
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && !isDiverged) {
      timer = setInterval(() => {
        stepOnce();
      }, 350);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, isDiverged, stepOnce]);

  const resetExperiment = (initTheta: number = 5.0) => {
    setIsRunning(false);
    setCurrentTheta(initTheta);
    setHistory([]);
  };

  const loadWorkedExample = () => {
    setIsRunning(false);
    setSelectedPreset('convex_quadratic');
    setLearningRate(0.20);
    resetExperiment(5.0);
  };

  const setScenario = (preset: 'optimal' | 'small' | 'divergence') => {
    setIsRunning(false);
    if (preset === 'optimal') {
      setSelectedPreset('convex_quadratic');
      setLearningRate(0.20);
      resetExperiment(5.0);
    } else if (preset === 'small') {
      setSelectedPreset('convex_quadratic');
      setLearningRate(0.02);
      resetExperiment(5.0);
    } else if (preset === 'divergence') {
      setSelectedPreset('convex_quadratic');
      setLearningRate(2.15);
      resetExperiment(4.5);
    }
  };

  // Tangent line for visualization
  const tangentPoints = useMemo(() => {
    const delta = 0.7;
    const x1 = currentTheta - delta;
    const y1 = currentStep.loss - currentStep.gradient * delta;
    const x2 = currentTheta + delta;
    const y2 = currentStep.loss + currentStep.gradient * delta;
    return {
      x1: toSvgX(x1),
      y1: toSvgY(y1),
      x2: toSvgX(x2),
      y2: toSvgY(y2)
    };
  }, [currentTheta, currentStep, toSvgX, toSvgY]);

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-lg shadow-xs overflow-hidden">
      {/* Visualizer Header */}
      <div className="border-b border-[#EAE2D5] bg-[#FAF5EE] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#7A1C30]" aria-hidden="true"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1F191B]">
            Gradient Descent Laboratory
          </span>
        </div>

        {/* Experiment Scenarios */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[#54484E]">Behaviors:</span>
          <button
            type="button"
            onClick={() => setScenario('optimal')}
            className="px-2 py-0.5 rounded border border-[#EAE2D5] bg-white text-xs hover:border-[#7A1C30] text-[#1F191B]"
          >
            Optimal Step
          </button>
          <button
            type="button"
            onClick={() => setScenario('small')}
            className="px-2 py-0.5 rounded border border-[#EAE2D5] bg-white text-xs hover:border-[#54484E] text-[#54484E]"
          >
            Slow Crawling
          </button>
          <button
            type="button"
            onClick={() => setScenario('divergence')}
            className="px-2 py-0.5 rounded border border-[#B8860B] bg-[#FFFDF5] text-xs font-semibold text-[#B8860B]"
          >
            Divergence (η &gt; 2.0)
          </button>

          <button
            type="button"
            onClick={loadWorkedExample}
            className="flex items-center gap-1 text-xs text-[#7A1C30] hover:text-[#5F1424] px-2 py-1 rounded border border-[#EEDAA2] bg-[#FAF2E6] ml-2"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Example</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#EAE2D5]">
        {/* Left: SVG Coordinate Plot */}
        <div className="lg:col-span-7 p-4 bg-[#FCFCFA] flex flex-col items-center justify-center">
          {/* Landscape Selector Tabs */}
          <div className="w-full max-w-[480px] flex items-center justify-between mb-2">
            <span className="text-[11px] text-[#54484E] font-medium">Error Landscape:</span>
            <div className="inline-flex rounded border border-[#EAE2D5] bg-white p-0.5 text-[11px]">
              {(['convex_quadratic', 'double_well', 'sinusoidal'] as FunctionPreset[]).map(key => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(key);
                    resetExperiment(key === 'convex_quadratic' ? 5.0 : (key === 'double_well' ? 1.8 : 2.5));
                  }}
                  className={`px-2 py-0.5 rounded ${selectedPreset === key ? 'bg-[#7A1C30] text-white' : 'text-[#54484E]'}`}
                >
                  {key === 'convex_quadratic' ? 'Convex Bowl' : (key === 'double_well' ? 'Double-Well' : 'Sinusoidal')}
                </button>
              ))}
            </div>
          </div>

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full max-w-[480px] h-auto select-none"
            role="img"
            aria-label={`Optimization landscape plot for ${landscape.name}`}
          >
            <title>{`${landscape.name} Loss Curve`}</title>
            <desc>
              Coordinate curve of loss as a function of theta, showing gradient descent update steps and trajectory.
            </desc>

            {/* Grid & Axis */}
            <line x1={padLeft} y1={toSvgY(0)} x2={width - padRight} y2={toSvgY(0)} stroke="#D1D1C7" strokeWidth="1.5" />
            <line x1={toSvgX(0)} y1={padTop} x2={toSvgX(0)} y2={height - padBottom} stroke="#D1D1C7" strokeWidth="1" />

            {/* Objective Function Curve */}
            <path d={curvePath} fill="none" stroke="#7A1C30" strokeWidth="2.5" />

            {/* Tangent slope at current theta */}
            {!isDiverged && (
              <line x1={tangentPoints.x1} y1={tangentPoints.y1} x2={tangentPoints.x2} y2={tangentPoints.y2} stroke="#B8860B" strokeWidth="1.5" strokeDasharray="3,2" />
            )}

            {/* Trajectory history breadcrumbs */}
            {history.map((h, i) => (
              <circle
                key={`hist-${i}`}
                cx={toSvgX(h.theta)}
                cy={toSvgY(h.loss)}
                r={Math.max(2, 4 - i * 0.2)}
                fill="#54484E"
                opacity={0.6 - i * 0.025}
              />
            ))}

            {/* Next step vector arrow */}
            {!isDiverged && (
              <line
                x1={toSvgX(currentTheta)}
                y1={toSvgY(currentStep.loss)}
                x2={toSvgX(currentStep.nextTheta)}
                y2={toSvgY(landscape.evaluate(currentStep.nextTheta))}
                stroke="#B8860B"
                strokeWidth="2"
              />
            )}

            {/* Current Parameter Marker */}
            {!isDiverged && (
              <circle
                cx={toSvgX(currentTheta)}
                cy={toSvgY(currentStep.loss)}
                r="6"
                fill="#7A1C30"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            )}

            {/* Global Minimum indicator */}
            <text
              x={toSvgX(landscape.globalMinimum)}
              y={toSvgY(landscape.evaluate(landscape.globalMinimum)) + 16}
              textAnchor="middle"
              fontSize="10"
              fill="#15803D"
              fontWeight="600"
            >
              Min θ={landscape.globalMinimum}
            </text>
          </svg>

          {/* Divergence Notification Banner */}
          {isDiverged && (
            <div className="w-full max-w-[480px] mt-2 p-2.5 rounded bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Divergence Detected (|θ| &gt; 30):</strong> The learning rate (η = {learningRate.toFixed(2)}) exceeded the mathematical stability bound (2 / curvature). Each step overshot the valley walls until loss exploded. Click Reset or reduce η.
              </span>
            </div>
          )}

          {/* Player controls */}
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={stepOnce}
              disabled={isDiverged}
              className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded bg-[#7A1C30] text-white hover:bg-[#5F1424] disabled:opacity-40"
            >
              <span>Take 1 Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              disabled={isDiverged}
              className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded border border-[#EAE2D5] bg-white text-[#1F191B] hover:bg-[#FAF5EE] disabled:opacity-40"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5 text-[#B8860B]" /> : <Play className="w-3.5 h-3.5 text-[#7A1C30]" />}
              <span>{isRunning ? 'Pause' : 'Auto Run'}</span>
            </button>

            <button
              type="button"
              onClick={() => resetExperiment(selectedPreset === 'convex_quadratic' ? 5.0 : 1.8)}
              className="flex items-center gap-1 text-xs text-[#54484E] hover:text-[#1F191B] px-2.5 py-1.5 rounded border border-[#EAE2D5] bg-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <span className="text-xs font-mono-num text-[#54484E] ml-2">
              Steps: <strong>{history.length}</strong>
            </span>
          </div>
        </div>

        {/* Right: Hyperparameter Sliders & Step Log */}
        <div className="lg:col-span-5 p-4 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="gd-lr-slider" className="text-xs font-semibold text-[#1F191B]">
                Learning Rate (η)
              </label>
              <span className="text-xs font-mono-num font-bold text-[#7A1C30]">
                η = {learningRate.toFixed(2)}
              </span>
            </div>
            <input
              id="gd-lr-slider"
              type="range"
              min="0.01"
              max="2.50"
              step="0.01"
              value={learningRate}
              onChange={e => setLearningRate(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="gd-theta-slider" className="text-xs font-semibold text-[#1F191B]">
                Current Position (θ)
              </label>
              <span className="text-xs font-mono-num font-bold text-[#1F191B]">
                θ = {currentTheta.toFixed(3)}
              </span>
            </div>
            <input
              id="gd-theta-slider"
              type="range"
              min={minX}
              max={maxX}
              step="0.05"
              value={Math.max(minX, Math.min(maxX, currentTheta))}
              onChange={e => {
                setIsRunning(false);
                setCurrentTheta(parseFloat(e.target.value));
              }}
              className="w-full"
            />
          </div>

          {/* Current Step Math Breakdown */}
          <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded p-3 text-xs space-y-1.5 font-mono-num">
            <div className="flex justify-between">
              <span className="text-[#54484E]">Current Loss L(θ):</span>
              <span className="font-semibold text-[#1F191B]">
                {isDiverged ? 'Infinity' : currentStep.loss.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#54484E]">Gradient dL/dθ:</span>
              <span className="font-bold text-[#B8860B]">
                {isDiverged ? 'N/A' : currentStep.gradient.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#54484E]">Update (-η × grad):</span>
              <span className="font-semibold text-[#7A1C30]">
                {isDiverged ? 'N/A' : currentStep.update.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#EAE2D5]">
              <span className="text-[#54484E]">Next Position θ_next:</span>
              <span className="font-bold text-sm text-[#7A1C30]">
                {isDiverged ? 'Diverged' : currentStep.nextTheta.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Recent History Table */}
          <div className="space-y-1 pt-1 border-t border-[#EAE2D5]">
            <div className="text-[11px] font-semibold text-[#54484E] uppercase tracking-wider">
              Optimization Trajectory
            </div>
            {history.length === 0 ? (
              <div className="text-xs text-[#6E7682] italic">Click &quot;Take 1 Step&quot; or &quot;Auto Run&quot; to begin optimization.</div>
            ) : (
              <div className="max-h-24 overflow-y-auto border border-[#EAE2D5] rounded divide-y divide-[#EAE2D5] bg-white text-[11px] font-mono-num">
                {history.slice(0, 4).map((h, idx) => (
                  <div key={idx} className="flex justify-between px-2 py-1">
                    <span className="text-[#54484E]">Step #{h.step}</span>
                    <span>θ = {h.theta.toFixed(3)}</span>
                    <span className="text-[#7A1C30]">L = {h.loss.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
