/**
 * ForestGround Component
 * Magical enchanted forest environment with trees, mushrooms, fairy lights, and mystical elements.
 */

import { useMemo } from 'react';

// Magical floating light component - now static to prevent dizziness
function FairyLight({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <pointLight color={color} intensity={0.4} distance={4} />
      <mesh>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

// Enchanted tree with glowing elements
function EnchantedTree({ position, seed }: { position: [number, number, number]; seed: number }) {
  // Use seed-based values instead of random to prevent re-renders causing jitter
  const scale = useMemo(() => 0.8 + (seed % 100) / 250, [seed]);
  const rotation = useMemo(() => (seed % 628) / 100, [seed]);

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Twisted trunk */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 3, 8]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>
      {/* Trunk detail */}
      <mesh position={[0.2, 1, 0.2]} castShadow rotation={[0.2, 0, 0.3]}>
        <cylinderGeometry args={[0.15, 0.2, 1.5, 6]} />
        <meshStandardMaterial color="#3d2d1f" roughness={0.9} />
      </mesh>
      {/* Magical foliage layers */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[1.5, 2, 8]} />
        <meshStandardMaterial color="#1a5c1a" />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[1.2, 1.5, 8]} />
        <meshStandardMaterial color="#2d7d2d" />
      </mesh>
      <mesh position={[0, 5.3, 0]} castShadow>
        <coneGeometry args={[0.8, 1.2, 8]} />
        <meshStandardMaterial color="#3d8d3d" emissive="#1a3d1a" emissiveIntensity={0.2} />
      </mesh>
      {/* Glowing spots on tree */}
      <pointLight position={[0, 3, 0.5]} color="#90EE90" intensity={0.3} distance={3} />
    </group>
  );
}

// Giant magical mushroom
function GiantMushroom({ position, color, seed }: { position: [number, number, number]; color: string; seed: number }) {
  const scale = useMemo(() => 0.6 + (seed % 100) / 166, [seed]);
  // Pre-calculate spot positions
  const spotOffsets = useMemo(() => [0.05, 0.1, 0.15, 0.08, 0.12], []);

  return (
    <group position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 1.6, 8]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[0.8, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Spots - fixed positions */}
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(i * 1.2) * 0.5,
            1.9 + spotOffsets[i],
            Math.sin(i * 1.2) * 0.5,
          ]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      {/* Underglow */}
      <pointLight position={[0, 1.2, 0]} color={color} intensity={0.4} distance={3} />
    </group>
  );
}

// Small decorative mushroom cluster - fixed positions
function MushroomCluster({ position }: { position: [number, number, number] }) {
  // Pre-calculated fixed offsets for the 3 mushrooms
  const offsets = useMemo(() => [
    [-0.15, 0.1],
    [0.1, -0.12],
    [0.05, 0.18],
  ], []);

  return (
    <group position={position}>
      {offsets.map((offset, i) => (
        <group key={i} position={[offset[0], 0, offset[1]]}>
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.07, 0.3, 6]} />
            <meshStandardMaterial color="#d4c4a8" />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <sphereGeometry args={[0.12, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Mystical stone with runes - static glow to prevent dizziness
function RuneStone({ position, seed }: { position: [number, number, number]; seed: number }) {
  const rotation = useMemo(() => (seed % 314) / 100, [seed]);

  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow rotation={[0.1, rotation, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.3]} />
        <meshStandardMaterial color="#555555" emissive="#4CAF50" emissiveIntensity={0.4} />
      </mesh>
      <pointLight position={[0, 0.8, 0.3]} color="#4CAF50" intensity={0.4} distance={2} />
    </group>
  );
}

// Fairy circle (ring of mushrooms)
function FairyCircle({ position }: { position: [number, number, number] }) {
  const radius = 3;
  const count = 12;

  return (
    <group position={position}>
      {/* Glowing ground circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <ringGeometry args={[radius - 0.3, radius + 0.3, 32]} />
        <meshStandardMaterial color="#4CAF50" emissive="#4CAF50" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>
      {/* Mushrooms around the circle */}
      {[...Array(count)].map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <MushroomCluster key={i} position={[x, 0, z]} />
        );
      })}
      {/* Center light */}
      <pointLight position={[0, 1, 0]} color="#90EE90" intensity={1} distance={5} />
    </group>
  );
}

// Fallen log
function FallenLog({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.35, 3, 8]} />
        <meshStandardMaterial color="#5d4037" roughness={0.9} />
      </mesh>
      {/* Moss patches */}
      <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, 0.5]}>
        <sphereGeometry args={[0.2, 6, 6]} />
        <meshStandardMaterial color="#4a7c4e" />
      </mesh>
      <mesh position={[-0.3, 0.45, 0.2]}>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshStandardMaterial color="#5a8c5e" />
      </mesh>
    </group>
  );
}

export function ForestGround() {
  // All positions are pre-computed and stable - no Math.random() during render!

  // Generate tree positions deterministically
  const enchantedTrees = useMemo(() => {
    const positions: { pos: [number, number, number]; seed: number }[] = [];
    // Outer ring of trees - evenly distributed
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const radiusOffset = (i * 7) % 3; // Deterministic variation
      const radius = 15 + radiusOffset;
      positions.push({
        pos: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        seed: i * 137,
      });
    }
    // Inner trees - fixed positions
    const innerAngles = [0.5, 1.2, 2.1, 3.0, 3.8, 4.5, 5.3, 6.0];
    for (let i = 0; i < 8; i++) {
      const angle = innerAngles[i];
      const radius = 8 + (i % 3) * 1.5;
      positions.push({
        pos: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        seed: (i + 100) * 137,
      });
    }
    return positions;
  }, []);

  const giantMushrooms = useMemo(() => [
    { pos: [-6, 0, 4] as [number, number, number], color: '#FF6B6B', seed: 1 },
    { pos: [7, 0, -3] as [number, number, number], color: '#9C27B0', seed: 2 },
    { pos: [-4, 0, -7] as [number, number, number], color: '#FF9800', seed: 3 },
    { pos: [5, 0, 6] as [number, number, number], color: '#E91E63', seed: 4 },
  ], []);

  // Fixed fairy light positions
  const fairyLights = useMemo(() => {
    const lights: { pos: [number, number, number]; color: string }[] = [];
    const colors = ['#90EE90', '#00FFFF', '#FFD700', '#FF69B4', '#87CEEB'];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 5 + (i % 2) * 4;
      lights.push({
        pos: [Math.cos(angle) * radius, 1.5 + (i % 3) * 0.5, Math.sin(angle) * radius],
        color: colors[i % colors.length],
      });
    }
    return lights;
  }, []);

  const runeStones = useMemo(() => [
    { pos: [-8, 0, -2] as [number, number, number], seed: 10 },
    { pos: [9, 0, 2] as [number, number, number], seed: 20 },
    { pos: [2, 0, -9] as [number, number, number], seed: 30 },
  ], []);

  const fallenLogs = useMemo(() => [
    { pos: [-10, 0, 5] as [number, number, number], rot: 0.5 },
    { pos: [8, 0, -8] as [number, number, number], rot: 1.2 },
  ], []);

  // Pre-computed moss patch positions
  const mossPatches = useMemo(() => {
    const patches: { pos: [number, number, number]; rot: number; size: number }[] = [];
    for (let i = 0; i < 20; i++) {
      // Use deterministic positions based on index
      const angle = (i / 20) * Math.PI * 2 + (i % 3) * 0.5;
      const radius = 5 + (i % 7) * 2;
      patches.push({
        pos: [Math.cos(angle) * radius, 0.01, Math.sin(angle) * radius],
        rot: (i * 31) % 628 / 100,
        size: 0.5 + (i % 5) * 0.2,
      });
    }
    return patches;
  }, []);

  // Pre-computed mushroom cluster positions
  const mushroomClusters = useMemo(() => {
    const clusters: { pos: [number, number, number]; seed: number }[] = [];
    for (let i = 0; i < 15; i++) {
      // Deterministic positions spread across the map
      const angle = (i / 15) * Math.PI * 2 + 0.3;
      const radius = 4 + (i % 5) * 2.5;
      clusters.push({
        pos: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        seed: i * 41,
      });
    }
    return clusters;
  }, []);

  return (
    <group>
      {/* Forest floor - darker, mossy ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#2d4a2d" />
      </mesh>

      {/* Moss patches on ground - fixed positions */}
      {mossPatches.map((patch, i) => (
        <mesh
          key={`moss-${i}`}
          rotation={[-Math.PI / 2, patch.rot, 0]}
          position={patch.pos}
          receiveShadow
        >
          <circleGeometry args={[patch.size, 8]} />
          <meshStandardMaterial color="#3d5a3d" />
        </mesh>
      ))}

      {/* Enchanted trees */}
      {enchantedTrees.map((tree, i) => (
        <EnchantedTree key={`tree-${i}`} position={tree.pos} seed={tree.seed} />
      ))}

      {/* Giant magical mushrooms */}
      {giantMushrooms.map((m, i) => (
        <GiantMushroom key={`giantmush-${i}`} position={m.pos} color={m.color} seed={m.seed} />
      ))}

      {/* Fairy circle in the center */}
      <FairyCircle position={[0, 0, 0]} />

      {/* Floating fairy lights */}
      {fairyLights.map((light, i) => (
        <FairyLight key={`fairy-${i}`} position={light.pos} color={light.color} />
      ))}

      {/* Rune stones */}
      {runeStones.map((stone, i) => (
        <RuneStone key={`rune-${i}`} position={stone.pos} seed={stone.seed} />
      ))}

      {/* Fallen logs */}
      {fallenLogs.map((log, i) => (
        <FallenLog key={`log-${i}`} position={log.pos} rotation={log.rot} />
      ))}

      {/* Mushroom clusters - fixed positions */}
      {mushroomClusters.map((cluster, i) => (
        <MushroomCluster key={`cluster-${i}`} position={cluster.pos} />
      ))}
    </group>
  );
}
