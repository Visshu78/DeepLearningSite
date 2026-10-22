'use client';

import React, { useState, useMemo } from 'react';
import {
  project3DPoint,
  calculateFaceShading,
  pointsToSvgPath,
  buildWaferPlate,
  buildSynapticConduit,
  sortFacesByDepth,
  type Camera3D,
  type Vector3D,
  type PolygonFace,
  type WaferPlate3D,
  type SynapticConduit3D
} from '@/lib/math/isometric';
import { ForwardStepResult } from '@/lib/math/network';
import {
  RotateCcw,
  Sparkles,
  Layers,
  Zap,
  Compass,
  Eye,
  Info
} from 'lucide-react';

interface IsometricNetworkStackViewProps {
  inputs: [number, number];
  wHidden: [[number, number], [number, number]];
  bHidden: [number, number];
  wOutput: [number, number];
  bOutput: number;
  currentStep: number;
  fwdResult: ForwardStepResult;
  bpResult?: any; // BackpropResult
  mode?: 'forward' | 'backprop';
  target?: number;
  onSelectNode?: (nodeType: 'input' | 'hidden' | 'output', index: number) => void;
  selectedNode?: { type: 'input' | 'hidden' | 'output'; index: number } | null;
}

export function IsometricNetworkStackView({
  inputs,
  wHidden,
  bHidden,
  wOutput,
  bOutput,
  currentStep,
  fwdResult,
  bpResult,
  mode = 'forward',
  target = 0.9,
  onSelectNode,
  selectedNode
}: IsometricNetworkStackViewProps) {
  const isBackpropMode = mode === 'backprop';
  const [yawDeg, setYawDeg] = useState<number>(36);
  const [pitchDeg, setPitchDeg] = useState<number>(22);
  const [zoomScale, setZoomScale] = useState<number>(24);
  const [explodeDist, setExplodeDist] = useState<number>(50);
  const [hoveredItem, setHoveredItem] = useState<{
    title: string;
    detail: string;
    val?: string;
  } | null>(null);

  // Global center of the 3-layer network stack
  const center: Vector3D = useMemo(() => {
    const totalZ = 2 * (1.2 + explodeDist / 14);
    return {
      x: 0,
      y: 0,
      z: totalZ / 2
    };
  }, [explodeDist]);

  const camera: Camera3D = useMemo(() => {
    return {
      originX: 270,
      originY: 170,
      scale: zoomScale,
      yawDeg,
      pitchDeg
    };
  }, [zoomScale, yawDeg, pitchDeg]);

  // Build the 3 layer wafer plates
  const { wafers, conduits } = useMemo(() => {
    const layerSpacing = 1.2 + explodeDist / 14;

    // Layer 0: Input Wafer (Z = 2 * layerSpacing, positioned on the left)
    const inputZ = 2 * layerSpacing;
    const inputWafer = buildWaferPlate(
      0,
      'INPUT LAYER',
      { x: 0, y: 0, z: inputZ },
      3.2,
      5.2,
      0.3,
      [
        { nodeId: 'x1', label: 'x₁', val: inputs[0], subText: `x₁=${inputs[0].toFixed(2)}` },
        { nodeId: 'x2', label: 'x₂', val: inputs[1], subText: `x₂=${inputs[1].toFixed(2)}` }
      ],
      center,
      camera
    );

    // Layer 1: Hidden Wafer (Z = 1 * layerSpacing, positioned in the middle)
    const hiddenZ = layerSpacing;
    const hiddenWafer = buildWaferPlate(
      1,
      'HIDDEN (l=1)',
      { x: 0, y: 0, z: hiddenZ },
      3.6,
      5.6,
      0.35,
      [
        {
          nodeId: 'h1',
          label: 'h₁',
          val: isBackpropMode && currentStep === 5 && bpResult
            ? bpResult.dL_dzHidden[0]
            : currentStep >= 2
            ? fwdResult.aHidden[0]
            : fwdResult.zHidden[0],
          subText: isBackpropMode && currentStep === 5 && bpResult
            ? `δ₁=${bpResult.dL_dzHidden[0].toFixed(3)}`
            : `a₁=${fwdResult.aHidden[0].toFixed(2)}`
        },
        {
          nodeId: 'h2',
          label: 'h₂',
          val: isBackpropMode && currentStep === 5 && bpResult
            ? bpResult.dL_dzHidden[1]
            : currentStep >= 2
            ? fwdResult.aHidden[1]
            : fwdResult.zHidden[1],
          subText: isBackpropMode && currentStep === 5 && bpResult
            ? `δ₂=${bpResult.dL_dzHidden[1].toFixed(3)}`
            : `a₂=${fwdResult.aHidden[1].toFixed(2)}`
        }
      ],
      center,
      camera
    );

    // Layer 2: Output Wafer (Z = 0, positioned on the right)
    const outputZ = 0;
    const outputWafer = buildWaferPlate(
      2,
      'OUTPUT (l=2)',
      { x: 0, y: 0, z: outputZ },
      3.2,
      4.2,
      0.3,
      [
        {
          nodeId: 'y_out',
          label: 'ŷ',
          val: isBackpropMode && currentStep >= 4 && bpResult
            ? bpResult.dL_dzOutput
            : fwdResult.prediction,
          subText: isBackpropMode && currentStep >= 4 && bpResult
            ? `δ=${bpResult.dL_dzOutput.toFixed(3)}`
            : `ŷ=${fwdResult.prediction.toFixed(3)}`
        }
      ],
      center,
      camera
    );

    // 3D Synaptic Conduits
    // Input node positions in 3D
    const inPts: Vector3D[] = [
      { x: 0, y: -1.3, z: inputZ + 0.35 },
      { x: 0, y: 1.3, z: inputZ + 0.35 }
    ];

    // Hidden node positions in 3D
    const hidPts: Vector3D[] = [
      { x: 0, y: -1.4, z: hiddenZ + 0.38 },
      { x: 0, y: 1.4, z: hiddenZ + 0.38 }
    ];

    // Output node position in 3D
    const outPt: Vector3D = { x: 0, y: 0, z: outputZ + 0.35 };

    const conduitList: SynapticConduit3D[] = [];

    // Input to Hidden conduits
    conduitList.push(
      buildSynapticConduit(inPts[0], hidPts[0], wHidden[0][0], 'x1', 'h1', center, camera),
      buildSynapticConduit(inPts[1], hidPts[0], wHidden[0][1], 'x2', 'h1', center, camera),
      buildSynapticConduit(inPts[0], hidPts[1], wHidden[1][0], 'x1', 'h2', center, camera),
      buildSynapticConduit(inPts[1], hidPts[1], wHidden[1][1], 'x2', 'h2', center, camera)
    );

    // Hidden to Output conduits
    conduitList.push(
      buildSynapticConduit(hidPts[0], outPt, wOutput[0], 'h1', 'y_out', center, camera),
      buildSynapticConduit(hidPts[1], outPt, wOutput[1], 'h2', 'y_out', center, camera)
    );

    return {
      wafers: [inputWafer, hiddenWafer, outputWafer],
      conduits: conduitList
    };
  }, [inputs, wHidden, bHidden, wOutput, bOutput, currentStep, fwdResult, explodeDist, center, camera]);

  const setPresetAngle = (preset: 'standard' | 'lateral' | 'top') => {
    if (preset === 'standard') {
      setYawDeg(36);
      setPitchDeg(22);
      setZoomScale(24);
    } else if (preset === 'lateral') {
      setYawDeg(68);
      setPitchDeg(12);
      setZoomScale(22);
    } else if (preset === 'top') {
      setYawDeg(18);
      setPitchDeg(46);
      setZoomScale(25);
    }
  };

  const handleResetCamera = () => {
    setYawDeg(36);
    setPitchDeg(22);
    setZoomScale(24);
    setExplodeDist(50);
  };

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl overflow-hidden shadow-2xs space-y-0 w-full">
      {/* Top Header Bar */}
      <div className="px-3.5 py-2.5 bg-[#FAF5EE] border-b border-[#EAE2D5] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[#FAF2E6] text-[#7A1C30] border border-[#EEDAA2]">
            <Zap className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold text-[#1F191B]">
            3D Isometric Layer Stack
          </span>
          <span className="px-1.5 py-0.2 text-[9px] font-mono-num font-bold rounded bg-white text-[#7A1C30] border border-[#DFCDB6]">
            2-2-1 Architecture
          </span>
        </div>

        {/* Angle Presets */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPresetAngle('standard')}
            className={`px-2 py-0.5 text-[10px] font-semibold rounded border transition-colors ${
              yawDeg === 36 && pitchDeg === 22
                ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                : 'bg-white text-[#54484E] border-[#EAE2D5] hover:bg-[#FAF2E6]'
            }`}
          >
            36° Iso
          </button>
          <button
            onClick={() => setPresetAngle('lateral')}
            className={`px-2 py-0.5 text-[10px] font-semibold rounded border transition-colors ${
              yawDeg === 68 && pitchDeg === 12
                ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                : 'bg-white text-[#54484E] border-[#EAE2D5] hover:bg-[#FAF2E6]'
            }`}
          >
            Lateral
          </button>
          <button
            onClick={() => setPresetAngle('top')}
            className={`px-2 py-0.5 text-[10px] font-semibold rounded border transition-colors ${
              yawDeg === 18 && pitchDeg === 46
                ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                : 'bg-white text-[#54484E] border-[#EAE2D5] hover:bg-[#FAF2E6]'
            }`}
          >
            Top
          </button>
          <button
            onClick={handleResetCamera}
            title="Reset Camera"
            className="p-1 rounded border border-[#EAE2D5] bg-white text-[#54484E] hover:text-[#7A1C30] hover:bg-[#FAF2E6]"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Interactive SVG Canvas */}
      <div className="relative w-full h-[340px] bg-[#FAF8F5] overflow-hidden select-none">
        {/* Dotted Grid Texture */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#D6CCC0 0.75px, transparent 0.75px)`,
            backgroundSize: '16px 16px'
          }}
        />

        <svg
          viewBox="0 0 540 340"
          className="w-full h-full relative cursor-crosshair"
          onMouseLeave={() => setHoveredItem(null)}
        >
          <defs>
            <filter id="wafer-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#1F191B" floodOpacity="0.09" />
            </filter>
            <filter id="glow-pulse" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Conduits Behind / Between Wafers */}
          {conduits.map(conduit => {
            const isHiddenLayerConduit = conduit.toNodeId === 'h1' || conduit.toNodeId === 'h2';
            let isActiveConduit = false;
            let isBackwardPulse = false;

            if (isBackpropMode) {
              if (currentStep === 1) {
                // Forward: input to hidden
                isActiveConduit = isHiddenLayerConduit;
              } else if (currentStep === 2) {
                // Forward: hidden to output
                isActiveConduit = !isHiddenLayerConduit;
              } else if (currentStep === 4) {
                // Backward: output to hidden
                isActiveConduit = !isHiddenLayerConduit;
                isBackwardPulse = true;
              } else if (currentStep === 5) {
                // Backward: hidden to input
                isActiveConduit = isHiddenLayerConduit;
                isBackwardPulse = true;
              } else if (currentStep === 6) {
                // Update
                isActiveConduit = true;
              }
            } else {
              isActiveConduit =
                (isHiddenLayerConduit && currentStep >= 1) ||
                (!isHiddenLayerConduit && currentStep >= 3);
            }

            const isPositive = conduit.weight >= 0;
            const strokeColor = isActiveConduit
              ? isBackwardPulse
                ? '#B8860B'
                : isPositive
                ? '#7A1C30'
                : '#B8860B'
              : '#D6CCC0';

            const strokeW = Math.max(1.4, Math.min(3.8, Math.abs(conduit.weight) * 2.8));

            // Pulse progress midpoint for active electrical transmission
            const midX = (conduit.fromScreen.x + conduit.toScreen.x) / 2;
            const midY = (conduit.fromScreen.y + conduit.toScreen.y) / 2;

            return (
              <g key={conduit.id}>
                {/* Synaptic Wire */}
                <line
                  x1={conduit.fromScreen.x}
                  y1={conduit.fromScreen.y}
                  x2={conduit.toScreen.x}
                  y2={conduit.toScreen.y}
                  stroke={strokeColor}
                  strokeWidth={strokeW}
                  strokeDasharray={!isPositive || isBackwardPulse ? '4 3' : undefined}
                  opacity={isActiveConduit ? 0.95 : 0.35}
                  className="cursor-pointer transition-all hover:stroke-[#1F191B]"
                  onMouseEnter={() => {
                    setHoveredItem({
                      title: `Weight w(${conduit.fromNodeId} → ${conduit.toNodeId})`,
                      detail: isBackwardPulse
                        ? `Error gradient flow: δ(${conduit.toNodeId}) → dL/dw`
                        : isPositive
                        ? 'Excitatory connection'
                        : 'Inhibitory connection',
                      val: isBackwardPulse && bpResult
                        ? `dL/dw = ${
                            conduit.fromNodeId === 'x1' && conduit.toNodeId === 'h1'
                              ? bpResult.dL_dwHidden[0][0].toFixed(3)
                              : conduit.fromNodeId === 'x2' && conduit.toNodeId === 'h1'
                              ? bpResult.dL_dwHidden[0][1].toFixed(3)
                              : conduit.fromNodeId === 'x1' && conduit.toNodeId === 'h2'
                              ? bpResult.dL_dwHidden[1][0].toFixed(3)
                              : conduit.fromNodeId === 'x2' && conduit.toNodeId === 'h2'
                              ? bpResult.dL_dwHidden[1][1].toFixed(3)
                              : conduit.fromNodeId === 'h1'
                              ? bpResult.dL_dwOutput[0].toFixed(3)
                              : bpResult.dL_dwOutput[1].toFixed(3)
                          }`
                        : conduit.weight.toFixed(2)
                    });
                  }}
                />

                {/* Animated Electrical / Gradient Pulse Particle */}
                {isActiveConduit && (
                  <circle
                    cx={midX}
                    cy={midY}
                    r={strokeW + 1}
                    fill={isBackwardPulse ? '#B8860B' : isPositive ? '#E5B23A' : '#7A1C30'}
                    filter="url(#glow-pulse)"
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}

          {/* Render Wafer Plates with Painter's Depth Sorting */}
          {wafers.map(wafer => {
            const isInputLayer = wafer.layerIndex === 0;
            const isHiddenLayer = wafer.layerIndex === 1;
            const isOutputLayer = wafer.layerIndex === 2;

            let isLayerActive = false;
            let activeColor = '#7A1C30'; // default Bordeaux for forward

            if (isBackpropMode) {
              if (currentStep === 0) {
                isLayerActive = isInputLayer;
                activeColor = '#7A1C30';
              } else if (currentStep === 1) {
                isLayerActive = isHiddenLayer;
                activeColor = '#7A1C30';
              } else if (currentStep === 2) {
                isLayerActive = isOutputLayer;
                activeColor = '#7A1C30';
              } else if (currentStep === 3) {
                isLayerActive = isOutputLayer;
                activeColor = '#B8860B'; // Gold for loss
              } else if (currentStep === 4) {
                isLayerActive = isOutputLayer || isHiddenLayer;
                activeColor = '#B8860B'; // Amber for backprop wave
              } else if (currentStep === 5) {
                isLayerActive = isHiddenLayer || isInputLayer;
                activeColor = '#B8860B'; // Amber for hidden backprop
              } else if (currentStep === 6) {
                isLayerActive = true;
                activeColor = '#15803D'; // Green for parameter update
              }
            } else {
              isLayerActive =
                (isInputLayer && currentStep === 0) ||
                (isHiddenLayer && (currentStep === 1 || currentStep === 2)) ||
                (isOutputLayer && currentStep >= 3);
            }

            return (
              <g key={wafer.id} filter="url(#wafer-shadow)">
                {/* Wafer 3D Faces */}
                {wafer.faces.map(face => {
                  const shade = calculateFaceShading(face.normal);

                  let fillColor = '#FFFFFF';
                  if (face.faceType === 'top') {
                    fillColor = isLayerActive ? (activeColor === '#15803D' ? '#F0FDF4' : activeColor === '#B8860B' ? '#FEF9EE' : '#FBF4E8') : '#FAF6F0';
                  } else if (face.faceType === 'side') {
                    fillColor = isLayerActive ? (activeColor === '#15803D' ? '#DCFCE7' : activeColor === '#B8860B' ? '#F7ECD3' : '#E6DDD0') : '#EAE2D5';
                  } else {
                    // Front Face
                    fillColor = isLayerActive ? (activeColor === '#15803D' ? '#F0FDF4' : activeColor === '#B8860B' ? '#FEF9EE' : '#FAF2E6') : '#FFFFFF';
                  }

                  const pathStr = pointsToSvgPath(face.points);

                  return (
                    <path
                      key={face.id}
                      d={pathStr}
                      fill={fillColor}
                      stroke={isLayerActive ? activeColor : '#D6CCC0'}
                      strokeWidth={isLayerActive ? '1.5' : '0.8'}
                      strokeLinejoin="round"
                    />
                  );
                })}

                {/* Layer Title Floating Banner */}
                <g
                  transform={`translate(${wafer.labelAnchor.x.toFixed(1)}, ${wafer.labelAnchor.y.toFixed(1)})`}
                  className="pointer-events-none"
                >
                  <rect
                    x="-48"
                    y="-15"
                    width="96"
                    height="18"
                    rx="3"
                    fill={isLayerActive ? activeColor : '#FFFFFF'}
                    stroke={isLayerActive ? activeColor : '#DFCDB6'}
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="-3"
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    fill={isLayerActive ? '#FFFFFF' : '#1F191B'}
                  >
                    {wafer.layerName}
                  </text>
                </g>

                {/* Node Contact Pads on the Wafer Face */}
                {wafer.nodeAnchors.map((node, nodeIdx) => {
                  const isNodeActive = isLayerActive;

                  return (
                    <g
                      key={node.nodeId}
                      transform={`translate(${node.screenPt.x.toFixed(1)}, ${node.screenPt.y.toFixed(1)})`}
                      className="cursor-pointer"
                      onClick={() => {
                        if (onSelectNode) {
                          onSelectNode(
                            isInputLayer ? 'input' : isHiddenLayer ? 'hidden' : 'output',
                            nodeIdx
                          );
                        }
                      }}
                      onMouseEnter={() => {
                        setHoveredItem({
                          title: `Neuron ${node.nodeId.toUpperCase()}`,
                          detail: isInputLayer ? 'Input feature' : isHiddenLayer ? 'Hidden activation' : 'Final prediction',
                          val: node.val.toFixed(3)
                        });
                      }}
                    >
                      {/* Contact Ring */}
                      <circle
                        r="14"
                        fill={isNodeActive ? '#FFFFFF' : '#FAF5EE'}
                        stroke={isNodeActive ? activeColor : '#DFCDB6'}
                        strokeWidth={isNodeActive ? '2.2' : '1.2'}
                        className="transition-transform duration-150 hover:scale-110"
                      />

                      {/* Beacon Glow on active stage */}
                      {isNodeActive && (
                        <circle
                          r="18"
                          fill="none"
                          stroke={activeColor === '#15803D' ? '#16A34A' : activeColor === '#B8860B' ? '#E5B23A' : '#7A1C30'}
                          strokeWidth="1.2"
                          strokeDasharray="3 3"
                          className="animate-spin"
                          style={{ animationDuration: '6s' }}
                        />
                      )}

                      {/* Node Label */}
                      <text
                        x="0"
                        y="-1"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#1F191B"
                      >
                        {node.nodeId}
                      </text>

                      {/* Numerical Reading */}
                      <text
                        x="0"
                        y="9"
                        textAnchor="middle"
                        fontSize="7.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                        fill={isNodeActive ? '#7A1C30' : '#54484E'}
                      >
                        {node.val.toFixed(2)}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Target & Loss Box in 3D (visible in backprop mode) */}
          {isBackpropMode && (() => {
            const targetPt: Vector3D = { x: 0, y: 0, z: -1.4 };
            const targetScreen = project3DPoint(targetPt, center, camera);
            const isLossActive = currentStep >= 3;

            return (
              <g
                transform={`translate(${targetScreen.x.toFixed(1)}, ${targetScreen.y.toFixed(1)})`}
                filter="url(#wafer-shadow)"
                className="cursor-pointer"
                onMouseEnter={() => {
                  setHoveredItem({
                    title: 'Target & Loss Objective',
                    detail: `Target y = ${target.toFixed(2)}, Loss L = 0.5*(ŷ - y)²`,
                    val: bpResult ? `L = ${bpResult.loss.toFixed(4)}` : undefined
                  });
                }}
              >
                <rect
                  x="-36"
                  y="-26"
                  width="72"
                  height="52"
                  rx="5"
                  fill={isLossActive ? '#FAF2E6' : '#FFFFFF'}
                  stroke={isLossActive ? '#B8860B' : '#DFCDB6'}
                  strokeWidth={isLossActive ? '2' : '1'}
                />
                <text x="0" y="-13" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#54484E">
                  TARGET y
                </text>
                <text x="0" y="0" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#15803D" className="font-mono-num">
                  {target.toFixed(2)}
                </text>
                <text x="0" y="12" textAnchor="middle" fontSize="8" fontWeight="bold" fill={isLossActive ? '#7A1C30' : '#54484E'} className="font-mono-num">
                  L={bpResult ? bpResult.loss.toFixed(3) : '0.000'}
                </text>
                {isLossActive && bpResult && (
                  <text x="0" y="21" textAnchor="middle" fontSize="7.5" fill="#B8860B" fontWeight="bold">
                    dL/dŷ={bpResult.dL_dPred.toFixed(3)}
                  </text>
                )}
              </g>
            );
          })()}
        </svg>

        {/* Hover Tooltip Overlay (Top-Left) */}
        {hoveredItem && (
          <div className="absolute top-3 left-3 bg-[#1F191B] text-white text-[11px] px-2.5 py-1.5 rounded shadow-lg pointer-events-none flex items-center gap-2 border border-black/20">
            <span className="font-semibold text-[#E5B23A]">{hoveredItem.title}:</span>
            <span className="text-[#DFCDB6]">{hoveredItem.detail}</span>
            {hoveredItem.val && (
              <span className="font-mono-num font-bold text-white bg-[#7A1C30] px-1.5 py-0.2 rounded">
                {hoveredItem.val}
              </span>
            )}
          </div>
        )}

        {/* Explode Distance Slider (Bottom Right HUD) */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs border border-[#EAE2D5] rounded-lg p-2 shadow-xs flex items-center gap-2 text-xs">
          <span className="text-[11px] font-semibold text-[#1F191B] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#B8860B]" />
            Explode:
          </span>
          <input
            type="range"
            min="0"
            max="90"
            value={explodeDist}
            onChange={e => setExplodeDist(Number(e.target.value))}
            className="w-20 accent-[#7A1C30] cursor-pointer"
            title="Separate layer wafers along depth axis"
          />
          <span className="text-[10px] font-mono-num text-[#54484E] w-6">
            {explodeDist}px
          </span>
        </div>
      </div>

      {/* Bottom Fine-Tuning Drawer */}
      <div className="px-3.5 py-2 bg-[#FAF5EE] border-t border-[#EAE2D5] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-[#54484E]">
            <span className="font-semibold text-[#1F191B]">Yaw:</span>
            <input
              type="range"
              min="-180"
              max="180"
              value={yawDeg}
              onChange={e => setYawDeg(Number(e.target.value))}
              className="w-16 accent-[#7A1C30] cursor-pointer"
            />
            <span className="font-mono-num text-[10px] w-7">{yawDeg}°</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#54484E]">
            <span className="font-semibold text-[#1F191B]">Pitch:</span>
            <input
              type="range"
              min="-60"
              max="80"
              value={pitchDeg}
              onChange={e => setPitchDeg(Number(e.target.value))}
              className="w-16 accent-[#7A1C30] cursor-pointer"
            />
            <span className="font-mono-num text-[10px] w-7">{pitchDeg}°</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#54484E]">
            <span className="font-semibold text-[#1F191B]">Zoom:</span>
            <input
              type="range"
              min="16"
              max="34"
              value={zoomScale}
              onChange={e => setZoomScale(Number(e.target.value))}
              className="w-16 accent-[#7A1C30] cursor-pointer"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] text-[#54484E]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-[#7A1C30] rounded-full inline-block" />
            <span>Excitatory (+w)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 border-b border-[#B8860B] border-dashed inline-block" />
            <span>Inhibitory (-w)</span>
          </span>
        </div>
      </div>
    </div>
  );
}
