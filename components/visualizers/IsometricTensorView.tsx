'use client';

import React, { useState, useMemo } from 'react';
import {
  project3DPoint,
  calculateFaceShading,
  pointsToSvgPath,
  buildChannelSliceSheet,
  buildReceptiveFieldRays,
  sortFacesByDepth,
  type Camera3D,
  type Vector3D,
  type PolygonFace
} from '@/lib/math/isometric';
import {
  RotateCcw,
  Sliders,
  Layers,
  Sparkles,
  Maximize2,
  Compass,
  Eye
} from 'lucide-react';

interface IsometricTensorViewProps {
  channels: {
    id: string;
    name: string;
    grid: number[][]; // [H x W]
  }[];
  selectedFilterIdx: number;
  selectedCoord: [number, number]; // [row, col]
  onSelectCell?: (filterIdx: number, coord: [number, number]) => void;
  inputGrid?: number[][]; // 8x8 input image grid for receptive rays
  kernelSize?: number;    // 3
  stageTitle?: string;
  stageBadge?: string;
}

export function IsometricTensorView({
  channels,
  selectedFilterIdx,
  selectedCoord,
  onSelectCell,
  inputGrid,
  kernelSize = 3,
  stageTitle = '3D Isometric Activation Tensor',
  stageBadge = '3 × 6 × 6'
}: IsometricTensorViewProps) {
  // Camera angles
  const [yawDeg, setYawDeg] = useState<number>(38);
  const [pitchDeg, setPitchDeg] = useState<number>(26);
  const [zoomScale, setZoomScale] = useState<number>(22);
  const [explodeDist, setExplodeDist] = useState<number>(45); // Exploded separation
  const [showRays, setShowRays] = useState<boolean>(true);
  const [hoveredCell, setHoveredCell] = useState<{
    filterIdx: number;
    coord: [number, number];
    value: number;
    screenX: number;
    screenY: number;
  } | null>(null);

  const numChannels = channels.length;
  const rows = channels[0]?.grid.length || 6;
  const cols = channels[0]?.grid[0]?.length || 6;

  // Center of the tensor geometry
  const center: Vector3D = useMemo(() => {
    const totalZ = (numChannels - 1) * (1 + explodeDist / 18);
    return {
      x: cols / 2,
      y: rows / 2,
      z: totalZ / 2
    };
  }, [cols, rows, numChannels, explodeDist]);

  const camera: Camera3D = useMemo(() => {
    return {
      originX: 280,
      originY: 175, // Centered vertically in 360px height
      scale: zoomScale,
      yawDeg,
      pitchDeg
    };
  }, [zoomScale, yawDeg, pitchDeg]);

  // Generate 3D faces for each channel slice with exploded distance
  const { allFaces, sliceLabels } = useMemo(() => {
    const faces: PolygonFace[] = [];
    const labels: {
      channelIndex: number;
      name: string;
      x: number;
      y: number;
      isSelected: boolean;
    }[] = [];

    channels.forEach((ch, chIdx) => {
      const zPos = chIdx * (0.8 + explodeDist / 16);
      const isSelectedChannel = chIdx === selectedFilterIdx;

      const { faces: sliceFaces, labelAnchor } = buildChannelSliceSheet(
        chIdx,
        ch.name,
        ch.grid,
        zPos,
        0.35, // slice thickness
        center,
        camera,
        isSelectedChannel ? selectedCoord : undefined
      );

      faces.push(...sliceFaces);

      labels.push({
        channelIndex: chIdx,
        name: ch.name,
        x: labelAnchor.x,
        y: labelAnchor.y,
        isSelected: isSelectedChannel
      });
    });

    return {
      allFaces: sortFacesByDepth(faces),
      sliceLabels: labels
    };
  }, [channels, explodeDist, selectedFilterIdx, selectedCoord, center, camera]);

  // Compute receptive rays from input layer (if provided)
  const receptiveRays = useMemo(() => {
    if (!showRays || !inputGrid) return [];

    const targetZ = selectedFilterIdx * (0.8 + explodeDist / 16);
    const inputZ = -3.5 - (explodeDist / 14);

    return buildReceptiveFieldRays(
      selectedCoord,
      kernelSize,
      inputZ,
      selectedCoord,
      targetZ,
      center,
      camera
    );
  }, [showRays, inputGrid, selectedCoord, kernelSize, selectedFilterIdx, explodeDist, center, camera]);

  // Presets
  const setPresetAngle = (preset: 'standard' | 'top' | 'profile') => {
    if (preset === 'standard') {
      setYawDeg(38);
      setPitchDeg(26);
      setZoomScale(22);
    } else if (preset === 'top') {
      setYawDeg(22);
      setPitchDeg(48);
      setZoomScale(24);
    } else if (preset === 'profile') {
      setYawDeg(62);
      setPitchDeg(14);
      setZoomScale(21);
    }
  };

  const handleResetCamera = () => {
    setYawDeg(38);
    setPitchDeg(26);
    setZoomScale(22);
    setExplodeDist(45);
  };

  return (
    <div className="bg-white border border-[#EAE2D5] rounded-xl overflow-hidden shadow-2xs space-y-0">
      {/* Top Header Bar */}
      <div className="px-3.5 py-2.5 bg-[#FAF5EE] border-b border-[#EAE2D5] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[#FAF2E6] text-[#7A1C30] border border-[#EEDAA2]">
            <Layers className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold text-[#1F191B]">{stageTitle}</span>
          <span className="px-1.5 py-0.2 text-[9px] font-mono-num font-bold rounded bg-white text-[#7A1C30] border border-[#DFCDB6]">
            {stageBadge}
          </span>
        </div>

        {/* Preset Angle Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPresetAngle('standard')}
            className={`px-2 py-0.5 text-[10px] font-semibold rounded border transition-colors ${
              yawDeg === 38 && pitchDeg === 26
                ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                : 'bg-white text-[#54484E] border-[#EAE2D5] hover:bg-[#FAF2E6]'
            }`}
          >
            38° Iso
          </button>
          <button
            onClick={() => setPresetAngle('top')}
            className={`px-2 py-0.5 text-[10px] font-semibold rounded border transition-colors ${
              yawDeg === 22 && pitchDeg === 48
                ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                : 'bg-white text-[#54484E] border-[#EAE2D5] hover:bg-[#FAF2E6]'
            }`}
          >
            Top
          </button>
          <button
            onClick={() => setPresetAngle('profile')}
            className={`px-2 py-0.5 text-[10px] font-semibold rounded border transition-colors ${
              yawDeg === 62 && pitchDeg === 14
                ? 'bg-[#7A1C30] text-white border-[#7A1C30]'
                : 'bg-white text-[#54484E] border-[#EAE2D5] hover:bg-[#FAF2E6]'
            }`}
          >
            Profile
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
      <div className="relative w-full h-[360px] bg-[#FAF8F5] overflow-hidden select-none">
        {/* Subtle Isometric Grid Texture */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#D6CCC0 0.75px, transparent 0.75px)`,
            backgroundSize: '16px 16px'
          }}
        />

        <svg
          viewBox="0 0 560 360"
          className="w-full h-full relative cursor-crosshair"
          onMouseLeave={() => setHoveredCell(null)}
        >
          <defs>
            {/* Soft Ambient Shadow Filter */}
            <filter id="tensor-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1F191B" floodOpacity="0.08" />
            </filter>

            {/* Glowing Projection Beam Marker */}
            <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B8860B" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#7A1C30" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Receptive Field Projection Cones / Rays */}
          {receptiveRays.map((ray, idx) => (
            <line
              key={`ray-${idx}`}
              x1={ray.from.x}
              y1={ray.from.y}
              x2={ray.to.x}
              y2={ray.to.y}
              stroke="url(#rayGradient)"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              className="animate-pulse"
            />
          ))}

          {/* 3D Polygon Faces (Sorted Painter's Algorithm) */}
          <g filter="url(#tensor-shadow)">
            {allFaces.map(face => {
              const val = face.value ?? 0;
              const chIdx = face.channelIndex ?? 0;
              const isSelected =
                face.channelIndex === selectedFilterIdx &&
                face.cellCoord?.[0] === selectedCoord[0] &&
                face.cellCoord?.[1] === selectedCoord[1];

              // Normal diffuse shading multiplier
              const shade = calculateFaceShading(face.normal);

              // Normalize activation value [0 to 4.0]
              const norm = Math.min(1, Math.max(0, val / 3.5));

              // Color determination
              let fillColor = '#FFFFFF';
              if (isSelected) {
                // Gold highlight for active receptive target cell
                fillColor = face.faceType === 'top'
                  ? '#E5B23A'
                  : face.faceType === 'side'
                  ? '#C28E25'
                  : '#D49D2F';
              } else if (norm > 0) {
                // Bordeaux palette with dynamic shade falloff
                const r = Math.round(122 * norm * shade + (1 - norm) * 255 * shade);
                const g = Math.round(28 * norm * shade + (1 - norm) * 250 * shade);
                const b = Math.round(48 * norm * shade + (1 - norm) * 245 * shade);
                fillColor = `rgb(${r}, ${g}, ${b})`;
              } else {
                // Inactive cell background tint with face shade
                const base = Math.round(245 * shade);
                fillColor = `rgb(${base}, ${base - 4}, ${base - 8})`;
              }

              // Stroke styling
              const strokeColor = isSelected
                ? '#7A1C30'
                : face.channelIndex === selectedFilterIdx
                ? '#DFCDB6'
                : '#ECE5DC';

              const pathStr = pointsToSvgPath(face.points);

              return (
                <path
                  key={face.id}
                  d={pathStr}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? '1.5' : '0.6'}
                  strokeLinejoin="round"
                  className="transition-colors duration-150 cursor-pointer hover:opacity-90"
                  onClick={() => {
                    if (face.cellCoord && onSelectCell) {
                      onSelectCell(chIdx, face.cellCoord);
                    }
                  }}
                  onMouseEnter={e => {
                    if (face.cellCoord) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredCell({
                        filterIdx: chIdx,
                        coord: face.cellCoord,
                        value: val,
                        screenX: rect.left + rect.width / 2,
                        screenY: rect.top
                      });
                    }
                  }}
                />
              );
            })}
          </g>

          {/* Channel Slice Labels in 3D Space */}
          {sliceLabels.map(lbl => (
            <g
              key={`lbl-${lbl.channelIndex}`}
              transform={`translate(${lbl.x.toFixed(1)}, ${lbl.y.toFixed(1)})`}
              className="pointer-events-none"
            >
              <rect
                x="-4"
                y="-14"
                width="84"
                height="18"
                rx="3"
                fill={lbl.isSelected ? '#7A1C30' : '#FFFFFF'}
                stroke={lbl.isSelected ? '#7A1C30' : '#DFCDB6'}
                strokeWidth="1"
                opacity="0.95"
              />
              <text
                x="4"
                y="-2"
                fontSize="9"
                fontFamily="sans-serif"
                fontWeight="bold"
                fill={lbl.isSelected ? '#FFFFFF' : '#1F191B'}
              >
                Ch {lbl.channelIndex + 1}: {lbl.name.split(' ')[0]}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredCell && (
          <div className="absolute top-3 left-3 bg-[#1F191B] text-white text-[11px] px-2.5 py-1.5 rounded shadow-lg pointer-events-none flex items-center gap-2 border border-black/20">
            <span className="font-semibold text-[#E5B23A]">
              Filter {hoveredCell.filterIdx + 1}
            </span>
            <span className="text-[#DFCDB6]">
              Coord: [{hoveredCell.coord[0]}, {hoveredCell.coord[1]}]
            </span>
            <span className="font-mono-num font-bold text-white">
              Val: {hoveredCell.value.toFixed(2)}
            </span>
          </div>
        )}

        {/* Floating Controls HUD (Bottom Right) */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs border border-[#EAE2D5] rounded-lg p-2 shadow-xs flex items-center gap-3 text-xs">
          {/* Explode Distance Slider */}
          <div className="flex items-center gap-2">
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
              title="Separate channels along depth axis"
            />
            <span className="text-[10px] font-mono-num text-[#54484E] w-6">
              {explodeDist}px
            </span>
          </div>

          <div className="h-4 w-[1px] bg-[#EAE2D5]" />

          {/* Receptive Rays Toggle */}
          <button
            onClick={() => setShowRays(prev => !prev)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
              showRays
                ? 'bg-[#FAF2E6] text-[#7A1C30] border-[#EEDAA2]'
                : 'bg-white text-[#54484E] border-[#EAE2D5]'
            }`}
          >
            <Eye className="w-3 h-3 text-[#B8860B]" />
            Rays: {showRays ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Bottom Controls / Fine-Tuning Drawer */}
      <div className="p-3 bg-[#FAF5EE] border-t border-[#EAE2D5] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Rotation Sliders */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-[#54484E]">
            <span className="font-semibold text-[#1F191B]">Yaw:</span>
            <input
              type="range"
              min="-180"
              max="180"
              value={yawDeg}
              onChange={e => setYawDeg(Number(e.target.value))}
              className="w-20 accent-[#7A1C30] cursor-pointer"
            />
            <span className="font-mono-num text-[10px] w-8">{yawDeg}°</span>
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
            <span className="font-mono-num text-[10px] w-8">{pitchDeg}°</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#54484E]">
            <span className="font-semibold text-[#1F191B]">Zoom:</span>
            <input
              type="range"
              min="14"
              max="34"
              value={zoomScale}
              onChange={e => setZoomScale(Number(e.target.value))}
              className="w-16 accent-[#7A1C30] cursor-pointer"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] text-[#54484E]">
          <span>0.0 Inactive</span>
          <div className="h-2 w-16 rounded bg-gradient-to-r from-[#FFFFFF] via-[#D18E9B] to-[#7A1C30] border border-[#DFCDB6]" />
          <span>3.5+ Peak Activation</span>
        </div>
      </div>
    </div>
  );
}
