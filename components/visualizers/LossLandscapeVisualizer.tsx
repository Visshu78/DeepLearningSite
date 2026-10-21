'use client';

import React, { useState, useMemo } from 'react';
import { mseLoss, datasetMse } from '@/lib/math/loss';
import { RotateCcw, BookOpen, Plus, Trash2 } from 'lucide-react';

export function LossLandscapeVisualizer() {
  const [target, setTarget] = useState<number>(1.0);
  const [prediction, setPrediction] = useState<number>(0.4);

  // Editable multi-sample dataset
  const [dataset, setDataset] = useState<Array<{ id: number; target: number; prediction: number }>>([
    { id: 1, target: 1.0, prediction: 0.4 },
    { id: 2, target: 2.5, prediction: 2.0 },
    { id: 3, target: -0.5, prediction: -0.2 },
    { id: 4, target: 3.0, prediction: 3.3 }
  ]);

  const singleResult = useMemo(() => {
    return mseLoss(target, prediction);
  }, [target, prediction]);

  const dsMseResult = useMemo(() => {
    return datasetMse(dataset);
  }, [dataset]);

  // Coordinate mapping for 1D Loss Parabola:
  // L(y_hat) = 0.5 * (y_hat - target)^2
  const domainMin = -2.0;
  const domainMax = 4.0;
  const rangeMin = 0.0;
  const rangeMax = 6.0;

  const width = 440;
  const height = 260;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;

  const toSvgX = React.useCallback((x: number) => {
    return padLeft + ((x - domainMin) / (domainMax - domainMin)) * (width - padLeft - padRight);
  }, [domainMin]);

  const toSvgY = React.useCallback((y: number) => {
    return height - padBottom - ((y - rangeMin) / (rangeMax - rangeMin)) * (height - padTop - padBottom);
  }, []);

  // Parabolic path that terminates cleanly at rangeMax without false flattening
  const parabolaPath = useMemo(() => {
    const steps = 100;
    const stepSize = (domainMax - domainMin) / steps;
    let d = '';
    let isDrawing = false;

    for (let i = 0; i <= steps; i++) {
      const x = domainMin + i * stepSize;
      const y = 0.5 * Math.pow(x - target, 2);

      if (y <= rangeMax) {
        const px = toSvgX(x);
        const py = toSvgY(y);
        if (!isDrawing) {
          d += `M ${px.toFixed(1)} ${py.toFixed(1)}`;
          isDrawing = true;
        } else {
          d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
        }
      } else {
        isDrawing = false;
      }
    }
    return d;
  }, [target, domainMin, toSvgX, toSvgY]);

  // Tangent line at current prediction
  const tangentPoints = useMemo(() => {
    const delta = 0.8;
    const x1 = prediction - delta;
    const y1 = singleResult.loss - singleResult.derivative * delta;
    const x2 = prediction + delta;
    const y2 = singleResult.loss + singleResult.derivative * delta;
    return {
      x1: toSvgX(x1),
      y1: toSvgY(y1),
      x2: toSvgX(x2),
      y2: toSvgY(y2)
    };
  }, [prediction, singleResult, toSvgX, toSvgY]);

  const loadWorkedExample = () => {
    setTarget(1.0);
    setPrediction(0.4);
    setDataset([
      { id: 1, target: 1.0, prediction: 0.4 },
      { id: 2, target: 2.5, prediction: 2.0 },
      { id: 3, target: -0.5, prediction: -0.2 },
      { id: 4, target: 3.0, prediction: 3.3 }
    ]);
  };

  const updateDatasetItem = (id: number, field: 'target' | 'prediction', val: number) => {
    setDataset(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const addDatasetItem = () => {
    const newId = dataset.length > 0 ? Math.max(...dataset.map(d => d.id)) + 1 : 1;
    setDataset(prev => [...prev, { id: newId, target: 1.5, prediction: 1.2 }]);
  };

  const removeDatasetItem = (id: number) => {
    if (dataset.length <= 1) return;
    setDataset(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-lg shadow-xs overflow-hidden">
      <div className="border-b border-[#EAE2D5] bg-[#FAF5EE] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#7A1C30]" aria-hidden="true"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1F191B]">
            Mean Squared Error & Residual Surface
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadWorkedExample}
            className="flex items-center gap-1 text-xs text-[#7A1C30] hover:text-[#5F1424] px-2 py-1 rounded border border-[#EEDAA2] bg-[#FAF2E6] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Load Example</span>
          </button>
          <button
            type="button"
            onClick={loadWorkedExample}
            className="text-xs text-[#54484E] hover:text-[#1F191B] p-1.5 rounded border border-[#EAE2D5] bg-white"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#EAE2D5]">
        {/* Left: 1D Parabolic Loss Curve */}
        <div className="lg:col-span-6 p-4 bg-[#FCFCFA] flex flex-col items-center justify-center">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full max-w-[440px] h-auto select-none"
            role="img"
            aria-label="1D Parabolic MSE loss surface curve with prediction marker and gradient slope"
          >
            <title>1D Squared Error Curve</title>
            <desc>
              Parabolic curve representing error as a function of prediction, with the global minimum at target y.
            </desc>

            {/* Grid & Axis */}
            {[-2, -1, 0, 1, 2, 3, 4].map(x => (
              <g key={`x-${x}`}>
                <line x1={toSvgX(x)} y1={padTop} x2={toSvgX(x)} y2={height - padBottom} stroke="#EFEFEA" strokeWidth="1" />
                <text x={toSvgX(x)} y={height - padBottom + 16} textAnchor="middle" fontSize="10" fill="#6E7682" className="font-mono-num">
                  {x}
                </text>
              </g>
            ))}

            {[0, 1, 2, 3, 4, 5, 6].map(y => (
              <g key={`y-${y}`}>
                <line x1={padLeft} y1={toSvgY(y)} x2={width - padRight} y2={toSvgY(y)} stroke="#EFEFEA" strokeWidth="1" />
                <text x={padLeft - 8} y={toSvgY(y) + 3} textAnchor="end" fontSize="10" fill="#6E7682" className="font-mono-num">
                  {y}
                </text>
              </g>
            ))}

            {/* Zero Axis */}
            <line x1={padLeft} y1={toSvgY(0)} x2={width - padRight} y2={toSvgY(0)} stroke="#D1D1C7" strokeWidth="1.5" />
            <line x1={toSvgX(0)} y1={padTop} x2={toSvgX(0)} y2={height - padBottom} stroke="#D1D1C7" strokeWidth="1.5" />

            {/* Parabola curve */}
            <path d={parabolaPath} fill="none" stroke="#7A1C30" strokeWidth="2.5" />

            {/* Target indicator */}
            <line x1={toSvgX(target)} y1={padTop} x2={toSvgX(target)} y2={height - padBottom} stroke="#15803D" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x={toSvgX(target)} y={padTop + 10} textAnchor="middle" fontSize="10" fill="#15803D" fontWeight="bold">
              Target y={target.toFixed(1)}
            </text>

            {/* Tangent line at current point */}
            <line x1={tangentPoints.x1} y1={tangentPoints.y1} x2={tangentPoints.x2} y2={tangentPoints.y2} stroke="#B8860B" strokeWidth="1.5" strokeDasharray="3,2" />

            {/* Current operating point */}
            {singleResult.loss <= rangeMax && (
              <circle
                cx={toSvgX(prediction)}
                cy={toSvgY(singleResult.loss)}
                r="6"
                fill="#7A1C30"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            )}
          </svg>

          <div className="flex items-center gap-4 mt-2 text-xs text-[#54484E]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-[#7A1C30] rounded-full inline-block"></span>
              L = ½(ŷ - y)²
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 border-t border-dashed border-[#B8860B] inline-block"></span>
              Gradient ∂L/∂ŷ = ŷ - y
            </span>
          </div>
        </div>

        {/* Right: Controls & Interactive Dataset Residual Table */}
        <div className="lg:col-span-6 p-4 space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="loss-pred-slider" className="text-xs font-semibold text-[#1F191B]">
                  Model Prediction (ŷ)
                </label>
                <span className="text-xs font-mono-num font-bold text-[#7A1C30]">
                  ŷ = {prediction.toFixed(2)}
                </span>
              </div>
              <input
                id="loss-pred-slider"
                type="range"
                min="-1.5"
                max="3.5"
                step="0.05"
                value={prediction}
                onChange={e => setPrediction(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="loss-target-slider" className="text-xs font-semibold text-[#1F191B]">
                  Ground Truth Target (y)
                </label>
                <span className="text-xs font-mono-num font-bold text-[#15803D]">
                  y = {target.toFixed(2)}
                </span>
              </div>
              <input
                id="loss-target-slider"
                type="range"
                min="-1.0"
                max="3.0"
                step="0.1"
                value={target}
                onChange={e => setTarget(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Current single-sample calculation */}
          <div className="bg-[#FAF5EE] border border-[#EAE2D5] rounded p-2.5 text-xs space-y-1 font-mono-num">
            <div className="flex justify-between">
              <span className="text-[#54484E]">Error Residual (ŷ - y):</span>
              <span className="font-semibold text-[#1F191B]">
                {prediction.toFixed(2)} - {target.toFixed(2)} = {(prediction - target).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#54484E]">Loss L = ½(ŷ - y)²:</span>
              <span className="font-bold text-[#7A1C30]">
                {singleResult.loss.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#EAE2D5]">
              <span className="text-[#54484E]">Gradient Signal ∂L/∂ŷ:</span>
              <span className="font-bold text-[#B8860B]">
                {singleResult.derivative.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Real Interactive Dataset Residual Table */}
          <div className="space-y-2 pt-2 border-t border-[#EAE2D5]">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#1F191B]">Dataset Residuals Table</span>
                <span className="text-[10px] text-[#6E7682]">(N={dataset.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono-num font-bold text-xs bg-[#FAF2E6] text-[#7A1C30] px-2 py-0.5 rounded">
                  Avg MSE = {dsMseResult.totalMse.toFixed(4)}
                </span>
                <button
                  type="button"
                  onClick={addDatasetItem}
                  className="p-1 rounded border border-[#EAE2D5] text-[#7A1C30] hover:bg-[#FAF5EE]"
                  title="Add sample"
                  aria-label="Add dataset sample"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="max-h-36 overflow-y-auto border border-[#EAE2D5] rounded text-xs font-mono-num bg-white">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#FAF5EE] text-[10px] text-[#54484E] uppercase tracking-wider border-b border-[#EAE2D5]">
                  <tr>
                    <th className="p-1.5">Sample</th>
                    <th className="p-1.5">Target y</th>
                    <th className="p-1.5">Pred ŷ</th>
                    <th className="p-1.5">Error (ŷ-y)²</th>
                    <th className="p-1.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D5]">
                  {dataset.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-[#FCFCFA]">
                      <td className="p-1.5 text-[#6E7682]">#{idx + 1}</td>
                      <td className="p-1.5">
                        <input
                          type="number"
                          step="0.1"
                          aria-label={`Target for sample ${idx + 1}`}
                          value={row.target}
                          onChange={e => updateDatasetItem(row.id, 'target', parseFloat(e.target.value) || 0)}
                          className="w-14 px-1 py-0.5 border border-[#EAE2D5] rounded text-xs"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="number"
                          step="0.1"
                          aria-label={`Prediction for sample ${idx + 1}`}
                          value={row.prediction}
                          onChange={e => updateDatasetItem(row.id, 'prediction', parseFloat(e.target.value) || 0)}
                          className="w-14 px-1 py-0.5 border border-[#EAE2D5] rounded text-xs"
                        />
                      </td>
                      <td className="p-1.5 font-bold text-[#7A1C30]">
                        {Math.pow(row.prediction - row.target, 2).toFixed(3)}
                      </td>
                      <td className="p-1.5 text-right">
                        <button
                          type="button"
                          onClick={() => removeDatasetItem(row.id)}
                          disabled={dataset.length <= 1}
                          className="text-[#6E7682] hover:text-[#B91C1C] disabled:opacity-30"
                          aria-label={`Delete sample ${idx + 1}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
