/**
 * WorldSelector Component
 * Allows players to choose which world to explore.
 */

import { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { worlds, getUnlockedWorlds, getNextWorldToUnlock } from '../worlds/worldDefinitions';
import { isWorldUnlocked, getUnlockProgress, getUnlockDescription } from '../worlds/types';
import { getWorldQuestStats } from '../learning/quests';
import type { World } from '../worlds/types';

interface WorldSelectorProps {
  onSelectWorld: (worldId: string) => void;
  onBack: () => void;
}

// World theme icons
const WORLD_ICONS: Record<string, string> = {
  school: '🏫',
  forest: '🌲',
  castle: '🏰',
  space: '🚀',
  underwater: '🌊',
};

// World theme colors
const WORLD_COLORS: Record<string, { primary: string; secondary: string; glow: string }> = {
  school: { primary: '#4CAF50', secondary: '#81C784', glow: 'rgba(76, 175, 80, 0.4)' },
  forest: { primary: '#2E7D32', secondary: '#66BB6A', glow: 'rgba(46, 125, 50, 0.4)' },
  castle: { primary: '#7B1FA2', secondary: '#BA68C8', glow: 'rgba(123, 31, 162, 0.4)' },
  space: { primary: '#1565C0', secondary: '#42A5F5', glow: 'rgba(21, 101, 192, 0.4)' },
  underwater: { primary: '#00838F', secondary: '#26C6DA', glow: 'rgba(0, 131, 143, 0.4)' },
};

function WorldCard({
  world,
  isUnlocked,
  unlockProgress,
  questStats,
  onSelect,
  isSelected,
}: {
  world: World;
  isUnlocked: boolean;
  unlockProgress: number;
  questStats: { completed: number; total: number };
  onSelect: () => void;
  isSelected: boolean;
}) {
  const colors = WORLD_COLORS[world.theme];
  const icon = WORLD_ICONS[world.theme];

  return (
    <div
      onClick={isUnlocked ? onSelect : undefined}
      style={{
        background: isUnlocked
          ? `linear-gradient(135deg, ${colors.primary}22, ${colors.secondary}11)`
          : 'rgba(50, 50, 50, 0.5)',
        border: `3px solid ${isSelected ? colors.primary : isUnlocked ? colors.secondary + '66' : '#444'}`,
        borderRadius: '16px',
        padding: '20px',
        cursor: isUnlocked ? 'pointer' : 'not-allowed',
        transition: 'all 0.3s ease',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isSelected ? `0 0 20px ${colors.glow}` : '0 4px 12px rgba(0,0,0,0.3)',
        opacity: isUnlocked ? 1 : 0.6,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Lock overlay for locked worlds */}
      {!isUnlocked && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '24px',
          }}
        >
          🔒
        </div>
      )}

      {/* World icon and name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ fontSize: '40px' }}>{icon}</span>
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: '20px',
              color: isUnlocked ? '#fff' : '#888',
              fontWeight: 'bold',
            }}
          >
            {world.name}
          </h3>
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: '12px',
              color: isUnlocked ? colors.secondary : '#666',
            }}
          >
            {world.description}
          </p>
        </div>
      </div>

      {/* Quest progress or unlock progress */}
      {isUnlocked ? (
        <div style={{ marginTop: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: '#b8b8b8' }}>Quests</span>
            <span style={{ fontSize: '12px', color: colors.secondary }}>
              {questStats.completed}/{questStats.total} ✓
            </span>
          </div>
          <div
            style={{
              height: '6px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(questStats.completed / questStats.total) * 100}%`,
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                transition: 'width 0.3s',
              }}
            />
          </div>
          {questStats.completed === questStats.total && (
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#FFD700', textAlign: 'center' }}>
              ⭐ World Complete! ⭐
            </p>
          )}
        </div>
      ) : (
        <div style={{ marginTop: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>
              {getUnlockDescription(world)}
            </span>
            <span style={{ fontSize: '12px', color: '#888' }}>
              {Math.round(unlockProgress)}%
            </span>
          </div>
          <div
            style={{
              height: '6px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${unlockProgress}%`,
                background: 'linear-gradient(90deg, #666, #888)',
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function WorldSelector({ onSelectWorld, onBack }: WorldSelectorProps) {
  const { level, saveData } = useGameState();
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);

  const totalXp = saveData.xp;
  const completedQuestIds = saveData.completedQuestIds;

  const handleSelectWorld = (world: World) => {
    if (isWorldUnlocked(world, level, completedQuestIds, totalXp)) {
      setSelectedWorld(world.id);
    }
  };

  const handleEnterWorld = () => {
    if (selectedWorld) {
      onSelectWorld(selectedWorld);
    }
  };

  const nextWorld = getNextWorldToUnlock(level, completedQuestIds, totalXp);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0f2040 100%)',
        padding: '20px',
        overflow: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1
          style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#FFD700',
            textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
            margin: 0,
          }}
        >
          🗺️ Choose Your World
        </h1>
        <p style={{ color: '#b8b8b8', marginTop: '10px' }}>
          Complete quests to unlock new adventures!
        </p>
      </div>

      {/* World Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          maxWidth: '900px',
          width: '100%',
          marginBottom: '30px',
        }}
      >
        {worlds.map((world) => {
          const unlocked = isWorldUnlocked(world, level, completedQuestIds, totalXp);
          const progress = getUnlockProgress(world, level, completedQuestIds, totalXp);
          const questStats = getWorldQuestStats(world.questIds, completedQuestIds);

          return (
            <WorldCard
              key={world.id}
              world={world}
              isUnlocked={unlocked}
              unlockProgress={progress}
              questStats={questStats}
              onSelect={() => handleSelectWorld(world)}
              isSelected={selectedWorld === world.id}
            />
          );
        })}
      </div>

      {/* Next unlock hint */}
      {nextWorld && (
        <div
          style={{
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '12px',
            padding: '15px 25px',
            marginBottom: '25px',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, color: '#FFD700', fontSize: '14px' }}>
            🔓 Next unlock: <strong>{nextWorld.name}</strong> — {getUnlockDescription(nextWorld)}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '15px' }}>
        <button
          className="btn btn-secondary"
          onClick={onBack}
          style={{ padding: '15px 30px' }}
        >
          ← Back
        </button>
        <button
          className="btn btn-primary"
          onClick={handleEnterWorld}
          disabled={!selectedWorld}
          style={{
            padding: '15px 40px',
            opacity: selectedWorld ? 1 : 0.5,
            cursor: selectedWorld ? 'pointer' : 'not-allowed',
          }}
        >
          Enter World →
        </button>
      </div>

      {/* World count */}
      <p
        style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '12px',
          marginTop: '30px',
        }}
      >
        {getUnlockedWorlds(level, completedQuestIds, totalXp).length} of {worlds.length} worlds unlocked
      </p>
    </div>
  );
}
