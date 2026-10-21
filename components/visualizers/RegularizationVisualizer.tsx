'use client';

import React, { useState, useMemo } from 'react';
import {
  CANONICAL_TRAIN_POINTS,
  CANONICAL_TEST_POINTS,
  fitPolynomialRidge,
  evaluatePolynomial,
  calculateMSE,
  simulateInvertedDropout
} from '@/lib/math/regularization';

export function RegularizationVisualizer() {
  const [degree, setDegree] = useState<number>(7);
  const [lambdaL2, setLambdaL2] = useState<number>(0.0);
  const [dropoutRate, setDropoutRate] = useState<number>(0.0);
  const [dropoutSeed, setDropoutSeed] = useState<number>(42);

  // Fit polynomial
  const weights = useMemo(() => {
    return fitPolynomialRidge(CANONICAL_TRAIN_POINTS, degree, lambdaL2);
  }, [degree, lambdaL2]);

  // Train and Test MSE
  const trainMSE = useMemo(() => {
    return calculateMSE(weights, CANONICAL_TRAIN_POINTS);
  }, [weights]);

  const testMSE = useMemo(() => {
    return calculateMSE(weights, CANONICAL_TEST_POINTS);
  }, [weights]);

  // Generalization Diagnosis
  const diagnosis = useMemo(() => {
    if (degree <= 2) {
      return {
        label: 'Underfitting Regime (High Bias)',
        color: 'text-[#B8860B] bg-[#FEF3C7] border-[#FCD34D]',
        desc: 'Model capacity is too rigid to capture the underlying sinusoidal curvature. Both training and testing losses are elevated.'
      };
    }
    const generalizationGap = testMSE - trainMSE;
    if (generalizationGap > 0.45 && lambdaL2 < 0.005) {
      return {
        label: 'Severe Overfitting (High Variance)',
        color: 'text-[#B91C1C] bg-[#FEE2E2] border-[#FCA5A5]',
        desc: 'Model fits training points closely by developing erratic polynomial oscillations, but fails dramatically on held-out test points.'
      };
    }
    return {
      label: 'Optimal Generalization (Balanced)',
      color: 'text-[#15803D] bg-[#DCFCE7] border-[#86EFAC]',
      desc: 'L2 regularization dampens coefficient magnitudes, suppressing spurious oscillations and minimizing out-of-sample test error.'
    };
  }, [degree, trainMSE, testMSE, lambdaL2]);

  // Inverted Dropout simulation on a 8-neuron hidden layer
  const sampleActivations = useMemo(() => [0.8, 1.4, 2.1, 0.5, 1.9, 0.2, 1.2, 2.8], []);
  const dropoutResult = useMemo(() => {
    return simulateInvertedDropout(sampleActivations, dropoutRate, dropoutSeed);
  }, [sampleActivations, dropoutRate, dropoutSeed]);

  // Generate SVG curve points for x in [-1.0, 1.0]
  const svgWidth = 560;
  const svgHeight = 280;
  const paddingX = 40;
  const paddingY = 30;

  const toSvgX = (x: number) => paddingX + ((x + 1.1) / 2.2) * (svgWidth - 2 * paddingX);
  const toSvgY = (y: number) => svgHeight - paddingY - ((y + 1.4) / 2.8) * (svgHeight - 2 * paddingY);

  const curvePath = useMemo(() => {
    const pts: string[] = [];
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const x = -1.0 + (i / steps) * 2.0;
      const y = Math.max(-1.4, Math.min(1.4, evaluatePolynomial(weights, x)));
      const sx = toSvgX(x);
      const sy = toSvgY(y);
      pts.push(`${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [weights]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-[#FAF2E6] border border-[#EEDAA2] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-mono-num font-bold text-[#7A1C30] uppercase tracking-wider">
            Generalization & Regularization Lab
          </div>
          <p className="text-xs text-[#54484E]">
            Control model capacity with polynomial degree, and observe how L2 weight decay shrinks weights to tame overfitting on unseen test data.
          </p>
        </div>
        <button
          onClick={() => {
            setDegree(7);
            setLambdaL2(0.015);
            setDropoutRate(0.0);
          }}
          className="px-3 py-1.5 text-xs font-semibold rounded border border-[#7A1C30] text-[#7A1C30] bg-white hover:bg-[#FAF2E6] transition-colors shrink-0"
        >
          Load Optimal L2 Preset
        </button>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white border border-[#EAE2D5] rounded-lg">
        {/* Model Capacity Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#1F191B]">Model Capacity (Polynomial Degree d)</span>
            <span className="font-mono-num font-bold text-[#7A1C30]">Degree {degree} ({degree + 1} params)</span>
          </div>
          <input
            type="range"
            min="1"
            max="9"
            step="1"
            value={degree}
            onChange={e => setDegree(parseInt(e.target.value))}
            className="w-full accent-[#7A1C30]"
          />
          <div className="flex justify-between text-[10px] text-[#878E99]">
            <span>d=1 (Linear / Underfit)</span>
            <span>d=4 (Cubic)</span>
            <span>d=9 (High Variance / Overfit)</span>
          </div>
        </div>

        {/* L2 Weight Decay Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#1F191B]">L2 Regularization Penalty (λ)</span>
            <span className="font-mono-num font-bold text-[#7A1C30]">λ = {lambdaL2.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.05"
            step="0.001"
            value={lambdaL2}
            onChange={e => setLambdaL2(parseFloat(e.target.value))}
            className="w-full accent-[#7A1C30]"
          />
          <div className="flex justify-between text-[10px] text-[#878E99]">
            <span>λ=0 (No Penalty)</span>
            <span>λ=0.015 (Balanced)</span>
            <span>λ=0.05 (Heavy Penalty)</span>
          </div>
        </div>
      </div>

      {/* Main Plot & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: SVG Fitted Curve Plot */}
        <div className="lg:col-span-8 bg-white border border-[#EAE2D5] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1F191B]">Polynomial Fit vs Out-of-Sample Test Data</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 text-[#1F191B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1F191B]" />
                Train Points (N=9)
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#B8860B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B]" />
                Test Points (N=7)
              </span>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="border border-[#EAE2D5] rounded-md bg-[#FAF5EE] p-2 flex justify-center">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-64 overflow-visible">
              {/* Grid axes */}
              <line
                x1={toSvgX(-1.0)}
                y1={toSvgY(0)}
                x2={toSvgX(1.0)}
                y2={toSvgY(0)}
                stroke="#D1D1C7"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1={toSvgX(0)}
                y1={toSvgY(-1.2)}
                x2={toSvgX(0)}
                y2={toSvgY(1.2)}
                stroke="#D1D1C7"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Fitted Curve */}
              <path
                d={curvePath}
                fill="none"
                stroke="#7A1C30"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Training points */}
              {CANONICAL_TRAIN_POINTS.map((pt, i) => (
                <circle
                  key={`train-${i}`}
                  cx={toSvgX(pt.x)}
                  cy={toSvgY(pt.y)}
                  r="4.5"
                  fill="#1F191B"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              ))}

              {/* Test points */}
              {CANONICAL_TEST_POINTS.map((pt, i) => (
                <circle
                  key={`test-${i}`}
                  cx={toSvgX(pt.x)}
                  cy={toSvgY(pt.y)}
                  r="4.5"
                  fill="#B8860B"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          </div>

          {/* Diagnosis Badge */}
          <div className={`p-3 rounded border text-xs leading-relaxed ${diagnosis.color}`}>
            <span className="font-bold block mb-0.5">{diagnosis.label}</span>
            <p className="text-[11px] opacity-90">{diagnosis.desc}</p>
          </div>
        </div>

        {/* Right: Metrics & Weight Coefficients */}
        <div className="lg:col-span-4 space-y-6">
          {/* Loss Metrics Panel */}
          <div className="bg-white border border-[#EAE2D5] rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#1F191B]">Generalization Metrics</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[#FAF5EE] border border-[#EAE2D5] rounded flex justify-between items-center">
                <span className="text-xs text-[#54484E]">Training Loss (MSE):</span>
                <span className="font-mono-num font-bold text-sm text-[#1F191B]">{trainMSE.toFixed(4)}</span>
              </div>
              <div className="p-3 bg-[#FAF5EE] border border-[#EAE2D5] rounded flex justify-between items-center">
                <span className="text-xs text-[#54484E]">Test Loss (MSE):</span>
                <span className="font-mono-num font-bold text-sm text-[#B8860B]">{testMSE.toFixed(4)}</span>
              </div>
              <div className="p-3 bg-white border border-[#EEDAA2] rounded flex justify-between items-center">
                <span className="text-xs text-[#54484E]">Generalization Gap:</span>
                <span className={`font-mono-num font-extrabold text-sm ${testMSE - trainMSE > 0.4 ? 'text-[#B91C1C]' : 'text-[#7A1C30]'}`}>
                  {(testMSE - trainMSE).toFixed(4)}
                </span>
              </div>
            </div>
          </div>

          {/* Inverted Dropout Simulator */}
          <div className="bg-white border border-[#EAE2D5] rounded-lg p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#1F191B]">Inverted Dropout Simulator</h3>
              <p className="text-[11px] text-[#54484E]">
                Randomly deactivates neurons during training to prevent co-adaptation.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#1F191B]">Dropout Rate (p)</span>
                <span className="font-mono-num font-bold text-[#7A1C30]">{(dropoutRate * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.7"
                step="0.1"
                value={dropoutRate}
                onChange={e => setDropoutRate(parseFloat(e.target.value))}
                className="w-full accent-[#7A1C30]"
              />
              <div className="flex justify-between items-center text-[11px] text-[#54484E]">
                <span>Scaling factor 1/(1-p): <strong className="text-[#7A1C30] font-mono-num">{dropoutResult.scaleFactor}x</strong></span>
                <button
                  onClick={() => setDropoutSeed(s => s + 1)}
                  className="text-[10px] text-[#7A1C30] hover:underline"
                >
                  Resample Mask
                </button>
              </div>
            </div>

            {/* Neuron Mask Grid */}
            <div className="grid grid-cols-4 gap-1.5 p-2 bg-[#FAF5EE] border border-[#EAE2D5] rounded-md">
              {dropoutResult.scaledActivations.map((val, idx) => {
                const isActive = dropoutResult.mask[idx] === 1;
                return (
                  <div
                    key={idx}
                    className={`h-11 flex flex-col items-center justify-center font-mono-num text-[10px] rounded border transition-all ${
                      isActive
                        ? 'bg-white text-[#7A1C30] border-[#7A1C30] font-bold'
                        : 'bg-[#F4F4F1] text-[#A0A096] border-[#D1D1C7] border-dashed line-through opacity-60'
                    }`}
                  >
                    <span>{val}</span>
                    <span className="text-[8px]">{isActive ? 'kept' : 'drop'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
