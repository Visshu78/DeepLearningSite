import { describe, it, expect } from 'vitest';
import {
  project3DPoint,
  calculateFaceShading,
  pointsToSvgPath,
  buildVoxelFaces,
  sortFacesByDepth,
  buildReceptiveFieldRays,
  buildWaferPlate,
  buildSynapticConduit,
  type Camera3D,
  type Vector3D
} from '../../lib/math/isometric';

describe('Isometric & 3D Vector Geometry Engine', () => {
  const camera: Camera3D = {
    originX: 200,
    originY: 150,
    scale: 20,
    yawDeg: 35,
    pitchDeg: 25
  };
  const center: Vector3D = { x: 3, y: 3, z: 1 };

  it('projects 3D points deterministically to screen coordinates', () => {
    const ptA = project3DPoint({ x: 0, y: 0, z: 0 }, center, camera);
    const ptB = project3DPoint({ x: 3, y: 3, z: 1 }, center, camera);

    // Center point should map directly to camera origin
    expect(ptB.x).toBeCloseTo(200, 2);
    expect(ptB.y).toBeCloseTo(150, 2);
    expect(ptB.depth).toBeCloseTo(0, 2);

    // Different point should produce valid finite screen coordinates
    expect(Number.isFinite(ptA.x)).toBe(true);
    expect(Number.isFinite(ptA.y)).toBe(true);
    expect(Number.isFinite(ptA.depth)).toBe(true);
  });

  it('calculates diffuse shading between ambient lower bound and 1.0', () => {
    const topNormal = { x: 0, y: -1, z: 0 };
    const bottomNormal = { x: 0, y: 1, z: 0 };

    const topShade = calculateFaceShading(topNormal);
    const bottomShade = calculateFaceShading(bottomNormal);

    expect(topShade).toBeGreaterThanOrEqual(0.55);
    expect(topShade).toBeLessThanOrEqual(1.0);
    expect(bottomShade).toBeGreaterThanOrEqual(0.55);
    // Face pointing upwards toward the light should be brighter than face pointing down
    expect(topShade).toBeGreaterThan(bottomShade);
  });

  it('formats SVG path strings correctly with closed loops', () => {
    const pts = [
      { x: 10, y: 20, depth: 1 },
      { x: 30, y: 20, depth: 2 },
      { x: 30, y: 40, depth: 3 },
      { x: 10, y: 40, depth: 2 }
    ];
    const pathStr = pointsToSvgPath(pts);
    expect(pathStr).toBe('M 10.0 20.0 L 30.0 20.0 L 30.0 40.0 L 10.0 40.0 Z');
  });

  it('builds voxel faces with top, front, and side polygons', () => {
    const faces = buildVoxelFaces(
      {
        x: 1,
        y: 2,
        z: 0,
        width: 1,
        height: 1,
        depth: 0.5,
        value: 0.8,
        channelIndex: 0,
        cellCoord: [2, 1]
      },
      center,
      camera
    );

    expect(faces.length).toBe(3);
    const types = faces.map(f => f.faceType);
    expect(types).toContain('top');
    expect(types).toContain('front');
    expect(types).toContain('side');
    expect(faces[0].points.length).toBe(4);
  });

  it('sorts faces by Painter algorithm depth from farthest to closest', () => {
    const mockFaces = [
      { id: 'near', points: [], avgDepth: 10, normal: { x: 0, y: 0, z: 1 }, faceType: 'front' as const },
      { id: 'far', points: [], avgDepth: -5, normal: { x: 0, y: 0, z: 1 }, faceType: 'front' as const },
      { id: 'mid', points: [], avgDepth: 2, normal: { x: 0, y: 0, z: 1 }, faceType: 'front' as const }
    ];

    const sorted = sortFacesByDepth(mockFaces);
    expect(sorted.map(f => f.id)).toEqual(['far', 'mid', 'near']);
  });

  it('builds 4 receptive field rays projecting from input patch corners to target cell', () => {
    const rays = buildReceptiveFieldRays(
      [1, 1],
      3,
      -2,
      [1, 1],
      2,
      center,
      camera
    );

    expect(rays.length).toBe(4);
    rays.forEach(ray => {
      expect(Number.isFinite(ray.from.x)).toBe(true);
      expect(Number.isFinite(ray.to.x)).toBe(true);
    });
  });

  it('builds wafer plate with faces and anchored node points', () => {
    const wafer = buildWaferPlate(
      1,
      'Hidden Layer',
      { x: 0, y: 0, z: 2 },
      3,
      5,
      0.4,
      [
        { nodeId: 'h1', label: 'h1', val: 0.7 },
        { nodeId: 'h2', label: 'h2', val: -0.3 }
      ],
      center,
      camera
    );

    expect(wafer.faces.length).toBe(3);
    expect(wafer.nodeAnchors.length).toBe(2);
    expect(wafer.nodeAnchors[0].nodeId).toBe('h1');
    expect(wafer.nodeAnchors[1].nodeId).toBe('h2');
    expect(Number.isFinite(wafer.labelAnchor.x)).toBe(true);
  });

  it('builds synaptic conduit between 3D points', () => {
    const conduit = buildSynapticConduit(
      { x: 0, y: 1, z: 0 },
      { x: 0, y: 1, z: 4 },
      0.85,
      'x1',
      'h1',
      center,
      camera
    );

    expect(conduit.id).toBe('conduit-x1->h1');
    expect(conduit.weight).toBe(0.85);
    expect(Number.isFinite(conduit.fromScreen.x)).toBe(true);
    expect(Number.isFinite(conduit.toScreen.x)).toBe(true);
  });
});
