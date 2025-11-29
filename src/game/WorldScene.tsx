/**
 * WorldScene Component
 * The main 3D game world containing the environment, player, and NPCs.
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { Ground } from './Ground';
import { ForestGround } from './worlds/ForestGround';
import { PlayerController } from './PlayerController';
import { NPC } from './NPC';
import { BossNPC } from './BossNPC';
import { useGameState } from '../hooks/useGameState';
import { getQuestsForWorld } from '../learning/quests';
import { worlds } from '../worlds/worldDefinitions';
import { getBossesForWorld } from '../conquest/bosses';
import type { Quest } from '../learning/types';
import type { BossBattle } from '../conquest/bosses';

interface WorldSceneProps {
  onStartQuest: (quest: Quest) => void;
  onStartBoss: (boss: BossBattle) => void;
  isQuestActive: boolean;
}

// NPC positions per world
const NPC_POSITIONS: Record<string, Record<string, [number, number, number]>> = {
  'world-school': {
    'quest-power-crystals': [-5, 0, -5],
    'quest-treasure-hunt': [5, 0, -5],
    'quest-garden': [-7, 0, 3],
    'quest-library': [7, 0, 3],
  },
  'world-forest': {
    'quest-forest-path': [-6, 0, -4],
    'quest-enchanted-grove': [6, 0, -4],
    'quest-mushroom-ring': [0, 0, -8],
  },
  'world-space': {
    'quest-asteroid-belt': [-5, 0, -5],
    'quest-lunar-base': [5, 0, -5],
  },
};

// Boss positions per world
const BOSS_POSITIONS: Record<string, Record<string, [number, number, number]>> = {
  'world-school': {
    'boss-multiplication-monster': [0, 0, -10],
  },
  'world-forest': {
    'boss-forest-guardian': [0, 0, -12],
  },
  'world-space': {
    'boss-cosmic-calculator': [0, 0, -10],
  },
};

export function WorldScene({ onStartQuest, onStartBoss, isQuestActive }: WorldSceneProps) {
  const { saveData, currentWorldId } = useGameState();
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0, 8));
  const [nearbyQuest, setNearbyQuest] = useState<Quest | null>(null);
  const [nearbyBoss, setNearbyBoss] = useState<BossBattle | null>(null);

  // Get current world configuration
  const currentWorld = useMemo(() => {
    return worlds.find((w) => w.id === currentWorldId) || worlds[0];
  }, [currentWorldId]);

  // Get quests and bosses for current world
  const worldQuests = useMemo(() => {
    return getQuestsForWorld(currentWorldId);
  }, [currentWorldId]);

  const worldBosses = useMemo(() => {
    return getBossesForWorld(currentWorldId);
  }, [currentWorldId]);

  const npcPositions = NPC_POSITIONS[currentWorldId] || NPC_POSITIONS['world-school'];
  const bossPositions = BOSS_POSITIONS[currentWorldId] || {};

  const handlePositionChange = useCallback((position: THREE.Vector3) => {
    setPlayerPosition(position);
  }, []);

  // Handle E key for interaction
  useEffect(() => {
    if (isQuestActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e') {
        if (nearbyQuest) {
          onStartQuest(nearbyQuest);
        } else if (nearbyBoss) {
          onStartBoss(nearbyBoss);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearbyQuest, nearbyBoss, onStartQuest, onStartBoss, isQuestActive]);

  // Check which NPC/Boss is nearby
  useEffect(() => {
    let closestQuest: Quest | null = null;
    let closestBoss: BossBattle | null = null;
    let closestDist = 3; // Interaction distance

    // Check quest NPCs
    for (const quest of worldQuests) {
      const npcPos = npcPositions[quest.id];
      if (!npcPos) continue;

      const dist = playerPosition.distanceTo(new THREE.Vector3(...npcPos));
      if (dist < closestDist) {
        closestQuest = quest;
        closestBoss = null;
        closestDist = dist;
      }
    }

    // Check boss NPCs
    for (const boss of worldBosses) {
      const bossPos = bossPositions[boss.id];
      if (!bossPos) continue;

      const dist = playerPosition.distanceTo(new THREE.Vector3(...bossPos));
      if (dist < closestDist) {
        closestBoss = boss;
        closestQuest = null;
        closestDist = dist;
      }
    }

    setNearbyQuest(closestQuest);
    setNearbyBoss(closestBoss);
  }, [playerPosition, worldQuests, worldBosses, npcPositions, bossPositions]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [0, 5, 15], fov: 60 }}
        style={{ background: '#87CEEB' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />

        {/* Sky - use world-specific sky settings */}
        <Sky
          distance={450000}
          sunPosition={currentWorld.skyConfig?.sunPosition || [100, 20, 100]}
          inclination={currentWorld.skyConfig?.inclination || 0.6}
          azimuth={currentWorld.skyConfig?.azimuth || 0.25}
        />

        {/* Environment - render based on current world */}
        {currentWorldId === 'world-forest' ? <ForestGround /> : <Ground />}

        {/* Player */}
        <PlayerController
          avatarConfig={saveData.avatarConfig}
          onPositionChange={handlePositionChange}
          disabled={isQuestActive}
        />

        {/* Quest NPCs */}
        {worldQuests.map((quest) => (
          <NPC
            key={quest.id}
            quest={quest}
            position={npcPositions[quest.id] || [0, 0, 0]}
            isCompleted={saveData.completedQuestIds.includes(quest.id)}
            onInteract={() => onStartQuest(quest)}
            playerPosition={playerPosition}
          />
        ))}

        {/* Boss NPCs */}
        {worldBosses.map((boss) => (
          <BossNPC
            key={boss.id}
            boss={boss}
            position={bossPositions[boss.id] || [0, 0, -10]}
            isDefeated={saveData.defeatedBossIds?.includes(boss.id) || false}
            onInteract={() => onStartBoss(boss)}
            playerPosition={playerPosition}
          />
        ))}
      </Canvas>

      {/* Controls hint */}
      {!isQuestActive && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
          }}
        >
          <strong>Controls:</strong> WASD or Arrow Keys to move | E or Click NPC to talk
        </div>
      )}
    </div>
  );
}
