'use client';

import React, { useState, useMemo } from 'react';
import {
  ActivationType,
  ACTIVATION_METADATA,
  applyActivation,
  applyActivationDerivative
} from '@/lib/math/activations';
import { MathEquation } from '@/components/equations/MathEquation';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export function ActivationGraphVisualizer() {
  const [selectedActivation, setSelectedActivation] = useState<ActivationType>('sigmoid');
  const [zProbe, setZProbe] = useState<number>(0.5);

  const meta = ACTIVATION_METADATA[selectedActivation];

  // Dynamic range based on activation function to prevent ANY curve clipping
  const domainMin = -5;
  const domainMax = 5;

  const { rangeMin, rangeMax, yGridTicks } = useMemo(() => {
    switch (selectedActivation) {
      case 'relu':
        return { rangeMin: -0.5, rangeMax: 5.5, yGridTicks: [0, 1, 2, 3, 4, 5] };
      case 'leaky_relu':
        return { rangeMin: -1.0, rangeMax: 5.5, yGridTicks: [-1, 0, 1, 2, 3, 4, 5] };
      case 'tanh':
        return { rangeMin: -1.3, rangeMax: 1.3, yGridTicks: [-1.0, -0.5, 0, 0.5, 1.0] };
      case 'sigmoid':
      default:
        return { rangeMin: -0.2, rangeMax: 1.2, yGridTicks: [0, 0.25, 0.5, 0.75, 1.0] };
    }
  }, [selectedActivation]);

  // Viewbox coordinates: 460 x 280
  const width = 460;
  const height = 280;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;

  const toSvgX = React.useCallback((z: number) => {
    return padLeft + ((z - domainMin) / (domainMax - domainMin)) * (width - padLeft - padRight);
  }, [domainMin]);

  const toSvgY = React.useCallback((val: number) => {
    return height - padBottom - ((val - rangeMin) / (rangeMax - rangeMin)) * (height - padTop - padBottom);
  }, [rangeMin, rangeMax]);

  // Generate paths from mathematical evaluation
  const { curvePath, derivPath } = useMemo(() => {
    const steps = 120;
    const stepSize = (domainMax - domainMin) / steps;

    let path = '';
    let dPath = '';

    for (let i = 0; i <= steps; i++) {
      const z = domainMin + i * stepSize;
      const y = applyActivation(selectedActivation, z);
      const dy = applyActivationDerivative(selectedActivation, z);

      const px = toSvgX(z);
      const py = toSvgY(y);
      const pdy = toSvgY(dy);

      if (i === 0) {
        path += `M ${px.toFixed(1)} ${py.toFixed(1)}`;
        dPath += `M ${px.toFixed(1)} ${pdy.toFixed(1)}`;
      } else {
        path += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
        dPath += ` L ${px.toFixed(1)} ${pdy.toFixed(1)}`;
      }
    }
    return { curvePath: path, derivPath: dPath };
  }, [selectedActivation, domainMin, toSvgX, toSvgY]);

  // Current probe values
  const currentY = applyActivation(selectedActivation, zProbe);
  const currentDeriv = applyActivationDerivative(selectedActivation, zProbe);

  // Tangent line segment
  const tangentPoints = useMemo(() => {
    const delta = 1.0;
    const x1 = zProbe - delta;
    const y1 = currentY - currentDeriv * delta;
    const x2 = zProbe + delta;
    const y2 = currentY + currentDeriv * delta;
    return {
      x1: toSvgX(x1),
      y1: toSvgY(y1),
      x2: toSvgX(x2),
      y2: toSvgY(y2)
    };
  }, [zProbe, currentY, currentDeriv, toSvgX, toSvgY]);

  // Precise diagnostic classification (distinguishing vanishing gradient from dead neuron)
  const diagnostic = useMemo(() => {
    if (selectedActivation === 'relu' && zProbe <= 0) {
      return {
        type: 'dead_neuron',
        title: 'Dead Neuron Regime',
        message: 'Because z ≤ 0, standard ReLU zeroes both output and gradient (φ\' = 0). The neuron cannot transmit any backpropagation signal.',
        style: 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]',
        icon: AlertCircle
      };
    }
    if (selectedActivation === 'leaky_relu' && zProbe <= 0) {
      return {
        type: 'leaky',
        title: 'Leaky Linear Regime',
        message: 'A constant small slope (α = 0.01) is preserved for negative inputs, preventing permanent dead neuron deactivation.',
        style: 'bg-[#FFFDF5] border-[#FCD34D] text-[#B45309]',
        icon: Info
      };
    }
    if ((selectedActivation === 'sigmoid' || selectedActivation === 'tanh') && Math.abs(currentDeriv) < 0.05) {
      return {
        type: 'vanishing',
        title: 'Saturation & Vanishing Gradient',
        message: `At z = ${zProbe.toFixed(2)}, the curve saturates asymptotically. The local slope φ'(z) = ${currentDeriv.toFixed(4)} is near zero, causing upstream gradients to vanish across layers.`,
        style: 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]',
        icon: AlertCircle
      };
    }
    return {
      type: 'healthy',
      title: 'Active Transmission Regime',
      message: `Healthy derivative φ'(z) = ${currentDeriv.toFixed(4)}. Learning signals flow freely through this neuron during backpropagation.`,
      style: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]',
      icon: CheckCircle2
    };
  }, [selectedActivation, zProbe, currentDeriv]);

  const DiagIcon = diagnostic.icon;

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-lg shadow-xs overflow-hidden">
      {/* Top Header / Activation Selector Tabs */}
      <div className="border-b border-[#EAE2D5] bg-[#FAF5EE] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#7A1C30]" aria-hidden="true"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1F191B]">
            Activation & Derivative Plotter
          </span>
        </div>

        {/* Tab options */}
        <div className="inline-flex rounded border border-[#EAE2D5] bg-white p-0.5 text-xs">
          {(['sigmoid', 'tanh', 'relu', 'leaky_relu'] as ActivationType[]).map(act => (
            <button
              key={act}
              type="button"
              onClick={() => setSelectedActivation(act)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedActivation === act
                  ? 'bg-[#7A1C30] text-[#FAF2E6]'
                  : 'text-[#54484E] hover:text-[#1F191B]'
              }`}
            >
              {act === 'sigmoid' ? 'Sigmoid' : act === 'tanh' ? 'Tanh' : act === 'relu' ? 'ReLU' : 'Leaky ReLU'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#EAE2D5]">
        {/* SVG Coordinate Plane */}
        <div className="lg:col-span-7 p-4 bg-[#FDFBF7] flex flex-col items-center justify-center">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full max-w-[480px] h-auto select-none"
            role="img"
            aria-label={`Mathematical plot of ${meta.name} activation and its derivative curve`}
          >
            <title>{`${meta.name} Function and Derivative Plot`}</title>
            <desc>
              Coordinate graph plotting pre-activation z on horizontal axis and activation phi(z) and derivative phi prime(z) on vertical axis.
            </desc>

            {/* X Grid Lines */}
            {[-4, -2, 0, 2, 4].map(x => (
              <g key={`x-${x}`}>
                <line
                  x1={toSvgX(x)}
                  y1={padTop}
                  x2={toSvgX(x)}
                  y2={height - padBottom}
                  stroke="#EAE2D5"
                  strokeWidth="1"
                />
                <text
                  x={toSvgX(x)}
                  y={height - padBottom + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#786970"
                  className="font-mono-num"
                >
                  {x}
                </text>
              </g>
            ))}

            {/* Y Grid ticks based on dynamic range */}
            {yGridTicks.map(y => (
              <g key={`y-${y}`}>
                <line
                  x1={padLeft}
                  y1={toSvgY(y)}
                  x2={width - padRight}
                  y2={toSvgY(y)}
                  stroke="#EAE2D5"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={toSvgY(y) + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#786970"
                  className="font-mono-num"
                >
                  {y.toFixed(1)}
                </text>
              </g>
            ))}

            {/* Zero Axes */}
            {rangeMin <= 0 && rangeMax >= 0 && (
              <line
                x1={padLeft}
                y1={toSvgY(0)}
                x2={width - padRight}
                y2={toSvgY(0)}
                stroke="#DFCDB6"
                strokeWidth="1.5"
              />
            )}
            <line
              x1={toSvgX(0)}
              y1={padTop}
              x2={toSvgX(0)}
              y2={height - padBottom}
              stroke="#DFCDB6"
              strokeWidth="1.5"
            />

            {/* Derivative Curve (dashed gold) */}
            <path
              d={derivPath}
              fill="none"
              stroke="#B8860B"
              strokeWidth="1.75"
              strokeDasharray="4,3"
              opacity="0.9"
            />

            {/* Activation Function Curve (solid burgundy) */}
            <path
              d={curvePath}
              fill="none"
              stroke="#7A1C30"
              strokeWidth="2.5"
            />

            {/* Tangent line at probe */}
            <line
              x1={tangentPoints.x1}
              y1={tangentPoints.y1}
              x2={tangentPoints.x2}
              y2={tangentPoints.y2}
              stroke="#1F191B"
              strokeWidth="1.5"
              strokeDasharray="2,2"
              opacity="0.6"
            />

            {/* Probe vertical guide */}
            <line
              x1={toSvgX(zProbe)}
              y1={padTop}
              x2={toSvgX(zProbe)}
              y2={height - padBottom}
              stroke="#54484E"
              strokeWidth="1"
              strokeDasharray="3,3"
              opacity="0.5"
            />

            {/* Probe Point on Curve */}
            <circle
              cx={toSvgX(zProbe)}
              cy={toSvgY(currentY)}
              r="5.5"
              fill="#7A1C30"
              stroke="#FFFFFF"
              strokeWidth="2"
            />

            {/* Probe Point on Derivative */}
            <circle
              cx={toSvgX(zProbe)}
              cy={toSvgY(currentDeriv)}
              r="4.5"
              fill="#B8860B"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </svg>

          {/* Graph Legend */}
          <div className="flex items-center gap-5 mt-2 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-[#7A1C30] inline-block"></span>
              <span className="text-[#1F191B] font-medium">φ(z) Activation</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 border-t border-dashed border-[#B8860B] inline-block"></span>
              <span className="text-[#B8860B] font-medium">φ&apos;(z) Derivative</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 border-t border-dotted border-[#1F191B] inline-block"></span>
              <span className="text-[#54484E]">Tangent Slope</span>
            </span>
          </div>
        </div>

        {/* Right: Interactive Probe & Technical Inspection */}
        <div className="lg:col-span-5 p-4 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="act-probe-slider" className="text-xs font-semibold text-[#1F191B] uppercase tracking-wider">
                Probe Pre-Activation (z)
              </label>
              <span className="text-sm font-mono-num font-bold text-[#7A1C30]">
                z = {zProbe.toFixed(2)}
              </span>
            </div>
            <input
              id="act-probe-slider"
              type="range"
              min={domainMin}
              max={domainMax}
              step="0.05"
              value={zProbe}
              onChange={e => setZProbe(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-[#786970] font-mono-num mt-1">
              <span>-5.0 (Negative)</span>
              <span>0.0 (Origin)</span>
              <span>+5.0 (Positive)</span>
            </div>
          </div>

          {/* Numerical readout card */}
          <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#54484E]">Activation Output φ({zProbe.toFixed(2)}):</span>
              <span className="text-sm font-mono-num font-bold text-[#7A1C30]">
                {currentY.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#54484E]">Derivative φ&apos;({zProbe.toFixed(2)}):</span>
              <span className="text-sm font-mono-num font-bold text-[#B8860B]">
                {currentDeriv.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#54484E]">Output Range:</span>
              <span className="font-mono-num text-[#18191B]">{meta.outputRange}</span>
            </div>
          </div>

          {/* Diagnostic Banner */}
          <div className={`p-3 rounded border text-xs leading-relaxed ${diagnostic.style}`}>
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <DiagIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{diagnostic.title}</span>
            </div>
            <p>{diagnostic.message}</p>
          </div>

          {/* Mathematical definition */}
          <div className="space-y-1.5 text-xs">
            <div className="font-semibold text-[#18191B]">{meta.name} Definition:</div>
            <div className="bg-white border border-[#E6E6E0] rounded px-2.5 py-1.5 text-[#18191B]">
              <MathEquation math={meta.formula} block />
            </div>
            <p className="text-[#4A525D] text-[11px] leading-relaxed pt-1">
              {meta.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
