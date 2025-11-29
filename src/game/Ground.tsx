/**
 * Ground Component
 * Creates the school courtyard environment with ground, decorations, and boundaries.
 */

import { useMemo } from 'react';

interface TreeProps {
  position: [number, number, number];
}

function Tree({ position }: TreeProps) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 1.5, 0.4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Leaves - stacked blocks */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <meshStandardMaterial color="#2E8B2E" />
      </mesh>
      <mesh position={[0, 3.4, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#32CD32" />
      </mesh>
    </group>
  );
}

interface RockProps {
  position: [number, number, number];
  scale?: number;
}

function Rock({ position, scale = 1 }: RockProps) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[0.5 * scale, 0.3 * scale, 0.4 * scale]} />
      <meshStandardMaterial color="#808080" />
    </mesh>
  );
}

interface FlowerProps {
  position: [number, number, number];
  color: string;
}

function Flower({ position, color }: FlowerProps) {
  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.05, 0.3, 0.05]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      {/* Petals */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.2, 0.15, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function SchoolBuilding() {
  return (
    <group position={[0, 0, -15]}>
      {/* Main building */}
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[20, 6, 8]} />
        <meshStandardMaterial color="#D4A574" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 6.5, 0]} castShadow>
        <boxGeometry args={[22, 1, 10]} />
        <meshStandardMaterial color="#8B0000" />
      </mesh>
      {/* Windows */}
      {[-6, -2, 2, 6].map((x, i) => (
        <mesh key={i} position={[x, 3, 4.1]}>
          <boxGeometry args={[2, 2, 0.2]} />
          <meshStandardMaterial color="#87CEEB" />
        </mesh>
      ))}
      {/* Door */}
      <mesh position={[0, 1.5, 4.1]}>
        <boxGeometry args={[3, 3, 0.2]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      {/* Sign */}
      <mesh position={[0, 5.5, 4.2]}>
        <boxGeometry args={[6, 1, 0.1]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </group>
  );
}

function Fence() {
  const posts: [number, number, number][] = useMemo(() => {
    const p: [number, number, number][] = [];
    // Left and right sides
    for (let z = -10; z <= 10; z += 2) {
      p.push([-18, 0.5, z]);
      p.push([18, 0.5, z]);
    }
    // Front side (with gap for entrance)
    for (let x = -18; x <= -4; x += 2) {
      p.push([x, 0.5, 12]);
    }
    for (let x = 4; x <= 18; x += 2) {
      p.push([x, 0.5, 12]);
    }
    return p;
  }, []);

  return (
    <group>
      {posts.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      ))}
    </group>
  );
}

function PathStones() {
  const stones: [number, number, number][] = useMemo(() => {
    const s: [number, number, number][] = [];
    for (let z = -10; z <= 10; z += 1.5) {
      s.push([0, 0.02, z]);
      if (z % 3 === 0) {
        s.push([1, 0.02, z]);
        s.push([-1, 0.02, z]);
      }
    }
    return s;
  }, []);

  return (
    <group>
      {stones.map((pos, i) => (
        <mesh key={i} position={pos} receiveShadow rotation={[0, Math.random() * 0.3, 0]}>
          <boxGeometry args={[0.8, 0.04, 0.8]} />
          <meshStandardMaterial color="#A0A0A0" />
        </mesh>
      ))}
    </group>
  );
}

export function Ground() {
  // Tree positions
  const treePositions: [number, number, number][] = [
    [-12, 0, -5],
    [-14, 0, 5],
    [12, 0, -5],
    [14, 0, 5],
    [-10, 0, 8],
    [10, 0, 8],
  ];

  // Rock positions
  const rockPositions: Array<{ pos: [number, number, number]; scale: number }> = [
    { pos: [-8, 0.15, 3], scale: 1 },
    { pos: [9, 0.15, -2], scale: 1.2 },
    { pos: [-6, 0.15, -7], scale: 0.8 },
    { pos: [7, 0.15, 6], scale: 1.1 },
  ];

  // Flower positions and colors
  const flowers: Array<{ pos: [number, number, number]; color: string }> = [
    { pos: [-5, 0, 5], color: '#FF69B4' },
    { pos: [-5.5, 0, 5.3], color: '#FFD700' },
    { pos: [5, 0, 5], color: '#FF6347' },
    { pos: [5.3, 0, 5.5], color: '#9370DB' },
    { pos: [-7, 0, -3], color: '#00CED1' },
    { pos: [7, 0, -4], color: '#FF69B4' },
  ];

  return (
    <group>
      {/* Main ground - grass */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>

      {/* Darker grass patches for variety */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-8, 0.01, 3]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#388E3C" />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[8, 0.01, -3]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="#43A047" />
      </mesh>

      {/* School building */}
      <SchoolBuilding />

      {/* Path to school */}
      <PathStones />

      {/* Trees */}
      {treePositions.map((pos, i) => (
        <Tree key={i} position={pos} />
      ))}

      {/* Rocks */}
      {rockPositions.map((rock, i) => (
        <Rock key={i} position={rock.pos} scale={rock.scale} />
      ))}

      {/* Flowers */}
      {flowers.map((flower, i) => (
        <Flower key={i} position={flower.pos} color={flower.color} />
      ))}

      {/* Fence */}
      <Fence />

      {/* Benches */}
      <group position={[-10, 0, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[2, 0.15, 0.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.8, 0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.4]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.8, 0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.4]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>

      <group position={[10, 0, 0]} rotation={[0, Math.PI, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[2, 0.15, 0.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.8, 0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.4]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0.8, 0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.4]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>
    </group>
  );
}
