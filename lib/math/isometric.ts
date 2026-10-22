/**
 * Isometric & 3D Vector Geometry Engine for Deep Learning Tensors
 * Inspired by Anatomy vector projection architecture (wheresryan22/anatomy).
 * 
 * Provides zero-dependency 3D projection, depth sorting (Painter's algorithm),
 * face polygon generation, and diffuse lighting for 3D tensor volumes,
 * exploded channel planes, and convolutional kernel prisms.
 */

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface ScreenPoint {
  x: number;
  y: number;
  depth: number;
}

export interface Camera3D {
  originX: number;
  originY: number;
  scale: number;
  yawDeg: number;   // Horizontal rotation around Y axis (-180 to 180)
  pitchDeg: number; // Vertical tilt around X axis (-90 to 90)
}

export interface PolygonFace {
  id: string;
  points: ScreenPoint[];
  avgDepth: number;
  normal: Vector3D;
  faceType: 'top' | 'front' | 'side' | 'back' | 'plane';
  channelIndex?: number;
  cellCoord?: [number, number];
  value?: number;
  color?: string;
}

export interface Voxel3D {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  value: number;
  channelIndex: number;
  cellCoord: [number, number];
}

export interface ReceptiveRay3D {
  from: ScreenPoint;
  to: ScreenPoint;
}

/**
 * Normalizes a 3D vector to unit length
 */
export function normalizeVector3D(v: Vector3D): Vector3D {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  if (len === 0) return { x: 0, y: 1, z: 0 };
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

/**
 * Projects a 3D coordinate (x, y, z) to 2D screen coordinate (x, y) with depth
 */
export function project3DPoint(
  pt: Vector3D,
  center: Vector3D,
  camera: Camera3D
): ScreenPoint {
  const yawRad = (camera.yawDeg * Math.PI) / 180;
  const pitchRad = (camera.pitchDeg * Math.PI) / 180;

  // Translate relative to center of tensor
  const dx = pt.x - center.x;
  const dy = pt.y - center.y;
  const dz = pt.z - center.z;

  // 1. Rotate around Y axis (Yaw)
  const cosY = Math.cos(yawRad);
  const sinY = Math.sin(yawRad);
  const x1 = dx * cosY - dz * sinY;
  const y1 = dy;
  const z1 = dx * sinY + dz * cosY;

  // 2. Rotate around X axis (Pitch)
  const cosP = Math.cos(pitchRad);
  const sinP = Math.sin(pitchRad);
  const x2 = x1;
  const y2 = y1 * cosP - z1 * sinP;
  const z2 = y1 * sinP + z1 * cosP;

  // 3. Screen Orthographic / Isometric Projection
  return {
    x: camera.originX + x2 * camera.scale,
    y: camera.originY + y2 * camera.scale,
    depth: z2
  };
}

/**
 * Default directional light from top-left front
 */
const DEFAULT_LIGHT: Vector3D = normalizeVector3D({ x: -0.4, y: -0.8, z: 0.5 });

/**
 * Computes diffuse lighting multiplier [0.4 to 1.0] for a given face normal
 */
export function calculateFaceShading(
  normal: Vector3D,
  light: Vector3D = DEFAULT_LIGHT,
  ambient = 0.55
): number {
  const n = normalizeVector3D(normal);
  const dot = n.x * light.x + n.y * light.y + n.z * light.z;
  const diffuse = Math.max(0, dot);
  return Math.min(1, ambient + (1 - ambient) * diffuse);
}

/**
 * Generates an SVG path string from an array of ScreenPoints
 */
export function pointsToSvgPath(points: ScreenPoint[]): string {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  return `M ${first.x.toFixed(1)} ${first.y.toFixed(1)} ` +
    rest.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') +
    ' Z';
}

/**
 * Builds faces for an individual voxel / cell in a 3D tensor volume
 */
export function buildVoxelFaces(
  voxel: Voxel3D,
  center: Vector3D,
  camera: Camera3D,
  baseColorRgb = [122, 28, 48] // Bordeaux primary
): PolygonFace[] {
  const { x, y, z, width, height, depth, value, channelIndex, cellCoord } = voxel;

  // 8 vertices of the voxel cube
  const p000 = project3DPoint({ x, y, z }, center, camera);
  const p100 = project3DPoint({ x: x + width, y, z }, center, camera);
  const p110 = project3DPoint({ x: x + width, y: y + height, z }, center, camera);
  const p010 = project3DPoint({ x, y: y + height, z }, center, camera);

  const p001 = project3DPoint({ x, y, z: z + depth }, center, camera);
  const p101 = project3DPoint({ x: x + width, y, z: z + depth }, center, camera);
  const p111 = project3DPoint({ x: x + width, y: y + height, z: z + depth }, center, camera);
  const p011 = project3DPoint({ x, y: y + height, z: z + depth }, center, camera);

  const faces: PolygonFace[] = [];

  // Helper to calculate face average depth
  const avgDepth = (pts: ScreenPoint[]) =>
    pts.reduce((sum, p) => sum + p.depth, 0) / pts.length;

  // Top Face (y = y)
  const topPoints = [p000, p100, p101, p001];
  faces.push({
    id: `v-${channelIndex}-${cellCoord[0]}-${cellCoord[1]}-top`,
    points: topPoints,
    avgDepth: avgDepth(topPoints),
    normal: { x: 0, y: -1, z: 0 },
    faceType: 'top',
    channelIndex,
    cellCoord,
    value
  });

  // Front Face (z = z + depth)
  const frontPoints = [p001, p101, p111, p011];
  faces.push({
    id: `v-${channelIndex}-${cellCoord[0]}-${cellCoord[1]}-front`,
    points: frontPoints,
    avgDepth: avgDepth(frontPoints),
    normal: { x: 0, y: 0, z: 1 },
    faceType: 'front',
    channelIndex,
    cellCoord,
    value
  });

  // Right Side Face (x = x + width)
  const rightPoints = [p100, p101, p111, p110];
  faces.push({
    id: `v-${channelIndex}-${cellCoord[0]}-${cellCoord[1]}-side`,
    points: rightPoints,
    avgDepth: avgDepth(rightPoints),
    normal: { x: 1, y: 0, z: 0 },
    faceType: 'side',
    channelIndex,
    cellCoord,
    value
  });

  return faces;
}

/**
 * Builds an isometric planar channel sheet (like a floating glass circuit wafer)
 */
export function buildChannelSliceSheet(
  channelIndex: number,
  channelName: string,
  grid: number[][],
  zPos: number,
  sliceThickness: number,
  center: Vector3D,
  camera: Camera3D,
  activeCell?: [number, number]
): {
  faces: PolygonFace[];
  labelAnchor: ScreenPoint;
} {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const faces: PolygonFace[] = [];

  // Build each cell in the slice
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = grid[r][c];
      const voxel: Voxel3D = {
        x: c,
        y: r,
        z: zPos,
        width: 0.94, // slight spacing gap between cells for high-end micro-contrast
        height: 0.94,
        depth: sliceThickness,
        value: val,
        channelIndex,
        cellCoord: [r, c]
      };

      const cellFaces = buildVoxelFaces(voxel, center, camera);
      faces.push(...cellFaces);
    }
  }

  // Label anchor positioned at top-left edge of the channel slice
  const labelAnchor = project3DPoint(
    { x: -0.8, y: -0.6, z: zPos + sliceThickness / 2 },
    center,
    camera
  );

  return { faces, labelAnchor };
}

/**
 * Builds 3D Receptive Field Pyramid Rays connecting an input patch to a target output cell
 */
export function buildReceptiveFieldRays(
  inputCoord: [number, number], // [topRow, leftCol]
  kernelSize: number,           // 3
  inputZ: number,
  outputCoord: [number, number], // [row, col]
  outputZ: number,
  center: Vector3D,
  camera: Camera3D
): ReceptiveRay3D[] {
  // 4 corners of the input receptive patch
  const patchCorners: Vector3D[] = [
    { x: inputCoord[1], y: inputCoord[0], z: inputZ },
    { x: inputCoord[1] + kernelSize, y: inputCoord[0], z: inputZ },
    { x: inputCoord[1] + kernelSize, y: inputCoord[0] + kernelSize, z: inputZ },
    { x: inputCoord[1], y: inputCoord[0] + kernelSize, z: inputZ }
  ];

  // Target output feature cell center
  const targetPt: Vector3D = {
    x: outputCoord[1] + 0.5,
    y: outputCoord[0] + 0.5,
    z: outputZ
  };

  const projectedTarget = project3DPoint(targetPt, center, camera);

  return patchCorners.map(corner => ({
    from: project3DPoint(corner, center, camera),
    to: projectedTarget
  }));
}

/**
 * Sorts polygon faces by depth from farthest (draw first) to nearest (draw last)
 * using Painter's algorithm
 */
export function sortFacesByDepth(faces: PolygonFace[]): PolygonFace[] {
  return [...faces].sort((a, b) => a.avgDepth - b.avgDepth);
}

export interface WaferPlateNode {
  nodeId: string;
  label: string;
  val: number;
  subText?: string;
}

export interface WaferPlate3D {
  id: string;
  layerIndex: number;
  layerName: string;
  faces: PolygonFace[];
  nodeAnchors: {
    nodeId: string;
    screenPt: ScreenPoint;
    val: number;
    subText?: string;
  }[];
  labelAnchor: ScreenPoint;
  avgDepth: number;
}

export interface SynapticConduit3D {
  id: string;
  fromScreen: ScreenPoint;
  toScreen: ScreenPoint;
  weight: number;
  avgDepth: number;
  fromNodeId: string;
  toNodeId: string;
}

/**
 * Builds an isometric floating circuit wafer plate representing a neural layer
 */
export function buildWaferPlate(
  layerIndex: number,
  layerName: string,
  centerPt: Vector3D,
  width: number,
  height: number,
  thickness: number,
  nodes: WaferPlateNode[],
  globalCenter: Vector3D,
  camera: Camera3D
): WaferPlate3D {
  const x = centerPt.x - width / 2;
  const y = centerPt.y - height / 2;
  const z = centerPt.z - thickness / 2;

  // 8 vertices of the wafer plate
  const p000 = project3DPoint({ x, y, z }, globalCenter, camera);
  const p100 = project3DPoint({ x: x + width, y, z }, globalCenter, camera);
  const p110 = project3DPoint({ x: x + width, y: y + height, z }, globalCenter, camera);
  const p010 = project3DPoint({ x, y: y + height, z }, globalCenter, camera);

  const p001 = project3DPoint({ x, y, z: z + thickness }, globalCenter, camera);
  const p101 = project3DPoint({ x: x + width, y, z: z + thickness }, globalCenter, camera);
  const p111 = project3DPoint({ x: x + width, y: y + height, z: z + thickness }, globalCenter, camera);
  const p011 = project3DPoint({ x, y: y + height, z: z + thickness }, globalCenter, camera);

  const avgDepth = (pts: ScreenPoint[]) =>
    pts.reduce((sum, p) => sum + p.depth, 0) / pts.length;

  const faces: PolygonFace[] = [
    // Top Face
    {
      id: `wafer-${layerIndex}-top`,
      points: [p000, p100, p101, p001],
      avgDepth: avgDepth([p000, p100, p101, p001]),
      normal: { x: 0, y: -1, z: 0 },
      faceType: 'top'
    },
    // Front Face (the main board surface facing positive Z)
    {
      id: `wafer-${layerIndex}-front`,
      points: [p001, p101, p111, p011],
      avgDepth: avgDepth([p001, p101, p111, p011]),
      normal: { x: 0, y: 0, z: 1 },
      faceType: 'front'
    },
    // Right Side Face
    {
      id: `wafer-${layerIndex}-side`,
      points: [p100, p101, p111, p110],
      avgDepth: avgDepth([p100, p101, p111, p110]),
      normal: { x: 1, y: 0, z: 0 },
      faceType: 'side'
    }
  ];

  // Node contact anchors distributed vertically along the wafer face
  const nodeAnchors = nodes.map((node, i) => {
    const nodeY = y + ((i + 1) * height) / (nodes.length + 1);
    const nodeX = centerPt.x;
    const nodeZ = z + thickness + 0.05; // slightly in front of the front face

    const screenPt = project3DPoint(
      { x: nodeX, y: nodeY, z: nodeZ },
      globalCenter,
      camera
    );

    return {
      nodeId: node.nodeId,
      screenPt,
      val: node.val,
      subText: node.subText
    };
  });

  // Top header label anchor
  const labelAnchor = project3DPoint(
    { x: centerPt.x, y: y - 0.5, z: z + thickness / 2 },
    globalCenter,
    camera
  );

  return {
    id: `wafer-${layerIndex}`,
    layerIndex,
    layerName,
    faces,
    nodeAnchors,
    labelAnchor,
    avgDepth: avgDepth([p000, p111])
  };
}

/**
 * Builds a synaptic connection conduit between two node 3D anchors
 */
export function buildSynapticConduit(
  fromPt: Vector3D,
  toPt: Vector3D,
  weight: number,
  fromNodeId: string,
  toNodeId: string,
  globalCenter: Vector3D,
  camera: Camera3D
): SynapticConduit3D {
  const fromScreen = project3DPoint(fromPt, globalCenter, camera);
  const toScreen = project3DPoint(toPt, globalCenter, camera);

  return {
    id: `conduit-${fromNodeId}->${toNodeId}`,
    fromScreen,
    toScreen,
    weight,
    avgDepth: (fromScreen.depth + toScreen.depth) / 2,
    fromNodeId,
    toNodeId
  };
}
