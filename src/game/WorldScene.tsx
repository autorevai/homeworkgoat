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
import { TreasureChest } from './TreasureChest';
import { CrystalShard } from './CrystalShard';
import { useGameState } from '../hooks/useGameState';
import { getQuestsForWorld } from '../learning/quests';
import { worlds } from '../worlds/worldDefinitions';
import { getBossesForWorld } from '../conquest/bosses';
import { getChestsForWorld } from '../exploration/treasureChests';
import { getShardsForWorld } from '../exploration/crystalShards';
import { updatePlayerPosition } from '../testing/agentTestAPI';
import type { Quest } from '../learning/types';
import type { BossBattle } from '../conquest/bosses';
import type { TreasureChestDef, CrystalShardDef } from '../persistence/types';

interface WorldSceneProps {
  onStartQuest: (quest: Quest) => void;
  onStartBoss: (boss: BossBattle) => void;
  onOpenChest: (chest: TreasureChestDef) => void;
  onCollectShard: (shard: CrystalShardDef) => void;
  isQuestActive: boolean;
}

// World size configuration - 40x40 playable area
export const WORLD_BOUNDS = {
  minX: -20,
  maxX: 20,
  minZ: -20,
  maxZ: 20,
};

// NPC positions per world - spread across larger map
const NPC_POSITIONS: Record<string, Record<string, [number, number, number]>> = {
  'world-school': {
    'quest-power-crystals': [-8, 0, -6],
    'quest-treasure-hunt': [8, 0, -6],
    'quest-garden': [-12, 0, 4],
    'quest-library': [12, 0, 4],
    'quest-robot-repair': [-4, 0, -12],
    'quest-lunch-count': [4, 0, -12],
  },
  'world-forest': {
    'quest-forest-path': [-10, 0, -5],
    'quest-enchanted-grove': [10, 0, -5],
    'quest-mushroom-ring': [0, 0, -10],
    'quest-fairy-lights': [-14, 0, 2],
    'quest-owl-wisdom': [14, 0, -8],
    'quest-forest-guardian': [0, 0, -16],
  },
  'world-castle': {
    'quest-royal-vault': [-8, 0, -8],
    'quest-knight-training': [8, 0, -8],
    'quest-wizard-potions': [-12, 0, 0],
    'quest-dragon-eggs': [12, 0, -12],
  },
  'world-space': {
    'quest-asteroid-belt': [-10, 0, -6],
    'quest-lunar-base': [10, 0, -6],
    'quest-asteroid-count': [-6, 0, -14],
    'quest-fuel-calculation': [6, 0, -14],
    'quest-alien-decoder': [-14, 0, 0],
    'quest-gravity-math': [14, 0, -10],
  },
  'world-underwater': {
    'quest-pearl-counting': [-8, 0, -8],
    'quest-treasure-dive': [8, 0, -8],
    'quest-coral-calculation': [0, 0, -14],
    'quest-whale-song': [-12, 0, 0],
  },
};

// Boss positions per world - at the far end of the map
const BOSS_POSITIONS: Record<string, Record<string, [number, number, number]>> = {
  'world-school': {
    'boss-multiplication-monster': [0, 0, -18],
  },
  'world-forest': {
    'boss-forest-guardian': [0, 0, -18],
    'boss-tree-spirit': [-10, 0, -16],
  },
  'world-castle': {
    'boss-math-dragon': [0, 0, -18],
  },
  'world-space': {
    'boss-cosmic-calculator': [0, 0, -18],
  },
  'world-underwater': {
    'boss-kraken-king': [0, 0, -18],
  },
};

export function WorldScene({ onStartQuest, onStartBoss, onOpenChest, onCollectShard, isQuestActive }: WorldSceneProps) {
  const { saveData, currentWorldId } = useGameState();
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0, 8));
  const [nearbyQuest, setNearbyQuest] = useState<Quest | null>(null);
  const [nearbyBoss, setNearbyBoss] = useState<BossBattle | null>(null);
  const [nearbyChest, setNearbyChest] = useState<TreasureChestDef | null>(null);
  const [nearbyShard, setNearbyShard] = useState<CrystalShardDef | null>(null);

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

  const worldChests = useMemo(() => {
    return getChestsForWorld(currentWorldId);
  }, [currentWorldId]);

  const worldShards = useMemo(() => {
    return getShardsForWorld(currentWorldId);
  }, [currentWorldId]);

  const npcPositions = NPC_POSITIONS[currentWorldId] || NPC_POSITIONS['world-school'];
  const bossPositions = BOSS_POSITIONS[currentWorldId] || {};

  const handlePositionChange = useCallback((position: THREE.Vector3) => {
    setPlayerPosition(position);
    // Update test API with player position
    updatePlayerPosition(position.x, position.y, position.z);
  }, []);

  // Handle E key for interaction
  useEffect(() => {
    if (isQuestActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key.toLowerCase() === 'e') {
        e.preventDefault(); // Prevent any default behavior

        if (nearbyQuest) {
          onStartQuest(nearbyQuest);
        } else if (nearbyBoss) {
          onStartBoss(nearbyBoss);
        } else if (nearbyChest && !saveData.openedChestIds?.includes(nearbyChest.id)) {
          onOpenChest(nearbyChest);
        } else if (nearbyShard && !saveData.collectedShardIds?.includes(nearbyShard.id)) {
          onCollectShard(nearbyShard);
        }
      }
    };

    // Use capture phase to ensure we get the event first
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [nearbyQuest, nearbyBoss, nearbyChest, nearbyShard, onStartQuest, onStartBoss, onOpenChest, onCollectShard, isQuestActive, saveData.openedChestIds, saveData.collectedShardIds]);

  // Check which NPC/Boss/Chest/Shard is nearby
  useEffect(() => {
    let closestQuest: Quest | null = null;
    let closestBoss: BossBattle | null = null;
    let closestChest: TreasureChestDef | null = null;
    let closestShard: CrystalShardDef | null = null;
    let closestDist = 4; // Interaction distance (increased for better UX)

    // Check quest NPCs
    for (const quest of worldQuests) {
      const npcPos = npcPositions[quest.id];
      if (!npcPos) continue;

      const dist = playerPosition.distanceTo(new THREE.Vector3(...npcPos));
      if (dist < closestDist) {
        closestQuest = quest;
        closestBoss = null;
        closestChest = null;
        closestShard = null;
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
        closestChest = null;
        closestShard = null;
        closestDist = dist;
      }
    }

    // Check treasure chests
    for (const chest of worldChests) {
      const dist = playerPosition.distanceTo(new THREE.Vector3(...chest.position));
      if (dist < closestDist) {
        closestChest = chest;
        closestQuest = null;
        closestBoss = null;
        closestShard = null;
        closestDist = dist;
      }
    }

    // Check crystal shards
    for (const shard of worldShards) {
      // Skip already collected shards
      if (saveData.collectedShardIds?.includes(shard.id)) continue;

      const dist = playerPosition.distanceTo(new THREE.Vector3(...shard.position));
      if (dist < closestDist) {
        closestShard = shard;
        closestQuest = null;
        closestBoss = null;
        closestChest = null;
        closestDist = dist;
      }
    }

    setNearbyQuest(closestQuest);
    setNearbyBoss(closestBoss);
    setNearbyChest(closestChest);
    setNearbyShard(closestShard);
  }, [playerPosition, worldQuests, worldBosses, worldChests, worldShards, npcPositions, bossPositions, saveData.collectedShardIds]);

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

        {/* Treasure Chests */}
        {worldChests.map((chest) => (
          <TreasureChest
            key={chest.id}
            chest={chest}
            isOpened={saveData.openedChestIds?.includes(chest.id) || false}
            playerPosition={playerPosition}
            onInteract={() => onOpenChest(chest)}
            hideTooltip={isQuestActive}
          />
        ))}

        {/* Crystal Shards */}
        {worldShards.map((shard) => (
          <CrystalShard
            key={shard.id}
            shard={shard}
            isCollected={saveData.collectedShardIds?.includes(shard.id) || false}
            playerPosition={playerPosition}
            onInteract={() => onCollectShard(shard)}
            hideTooltip={isQuestActive}
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
