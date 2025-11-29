/**
 * WorldSelector Component
 * Allows players to choose which world to explore.
 * Now includes AI-generated worlds!
 */

import { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { worlds, getUnlockedWorlds, getNextWorldToUnlock } from '../worlds/worldDefinitions';
import { isWorldUnlocked, getUnlockProgress, getUnlockDescription } from '../worlds/types';
import { getWorldQuestStats } from '../learning/quests';
import { generateAndCacheWorld, addWorldToCache } from '../ai/worldCacheManager';
import type { World } from '../worlds/types';
import type { GeneratedWorldData } from '../persistence/types';

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

// Minimum level to unlock AI world generation
const AI_WORLDS_UNLOCK_LEVEL = 3;

// Fun loading messages for world generation
const LOADING_MESSAGES = [
  "Creating a world just for YOU...",
  "Summoning epic quests...",
  "Teaching dragons math...",
  "Building your adventure...",
  "Crafting legendary challenges...",
  "Spawning friendly NPCs...",
];

export function WorldSelector({ onSelectWorld, onBack }: WorldSelectorProps) {
  const { level, saveData, updateSaveData } = useGameState();
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);

  const totalXp = saveData.xp;
  const completedQuestIds = saveData.completedQuestIds;
  const generatedWorlds = saveData.generatedWorlds || [];
  const canGenerateWorlds = level >= AI_WORLDS_UNLOCK_LEVEL;

  const handleSelectWorld = (world: World) => {
    if (isWorldUnlocked(world, level, completedQuestIds, totalXp)) {
      setSelectedWorld(world.id);
    }
  };

  const handleSelectAIWorld = (worldData: GeneratedWorldData) => {
    setSelectedWorld(worldData.world.id);
  };

  const handleEnterWorld = () => {
    if (selectedWorld) {
      onSelectWorld(selectedWorld);
    }
  };

  const handleGenerateWorld = async () => {
    if (isGenerating || !canGenerateWorlds) return;

    setIsGenerating(true);
    setError(null);

    // Cycle through fun loading messages
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[messageIndex]);
    }, 2000);

    try {
      // Generate a new world based on player's current skills
      const newWorldData = await generateAndCacheWorld(saveData);

      // Add to cache and update save data
      const updatedWorlds = addWorldToCache(generatedWorlds, newWorldData);
      updateSaveData({ generatedWorlds: updatedWorlds });

      // Auto-select the new world
      setSelectedWorld(newWorldData.world.id);

      console.log('Generated new AI world:', newWorldData.world.name);
    } catch (err) {
      console.error('Failed to generate world:', err);
      setError('Oops! Something went wrong. Try again!');
    } finally {
      clearInterval(messageInterval);
      setIsGenerating(false);
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

      {/* World Grid - Standard Worlds */}
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

      {/* AI-Generated Worlds Section */}
      {canGenerateWorlds && (
        <div style={{ width: '100%', maxWidth: '900px', marginBottom: '30px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
            }}
          >
            <span style={{ fontSize: '24px' }}>✨</span>
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
                color: '#FFD700',
                fontWeight: 'bold',
              }}
            >
              AI Worlds - Made Just For You!
            </h2>
            <span style={{ fontSize: '24px' }}>✨</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Existing AI Worlds */}
            {generatedWorlds.map((worldData) => {
              const questStats = {
                completed: worldData.quests.filter((q) =>
                  completedQuestIds.includes(q.id)
                ).length,
                total: worldData.quests.length,
              };

              return (
                <div
                  key={worldData.world.id}
                  onClick={() => handleSelectAIWorld(worldData)}
                  style={{
                    background:
                      selectedWorld === worldData.world.id
                        ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1))'
                        : 'linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(79, 70, 229, 0.1))',
                    border: `3px solid ${
                      selectedWorld === worldData.world.id
                        ? '#FFD700'
                        : 'rgba(147, 51, 234, 0.4)'
                    }`,
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: selectedWorld === worldData.world.id ? 'scale(1.02)' : 'scale(1)',
                    boxShadow:
                      selectedWorld === worldData.world.id
                        ? '0 0 20px rgba(255, 215, 0, 0.3)'
                        : '0 4px 12px rgba(0,0,0,0.3)',
                    position: 'relative',
                  }}
                >
                  {/* AI Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'linear-gradient(135deg, #9333ea, #4f46e5)',
                      color: '#fff',
                      fontSize: '10px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    AI Generated
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '40px' }}>{WORLD_ICONS[worldData.world.theme] || '🌟'}</span>
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '18px',
                          color: '#fff',
                          fontWeight: 'bold',
                        }}
                      >
                        {worldData.world.name}
                      </h3>
                      <p
                        style={{
                          margin: '4px 0 0 0',
                          fontSize: '12px',
                          color: '#a78bfa',
                        }}
                      >
                        {worldData.world.description}
                      </p>
                    </div>
                  </div>

                  {/* Quest Progress */}
                  <div style={{ marginTop: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#b8b8b8' }}>Quests</span>
                      <span style={{ fontSize: '12px', color: '#a78bfa' }}>
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
                          background: 'linear-gradient(90deg, #9333ea, #4f46e5)',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                  </div>

                  {/* Skills Targeted */}
                  <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {worldData.playerProfileUsed.weakSkills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#fca5a5',
                          fontSize: '10px',
                          padding: '2px 8px',
                          borderRadius: '8px',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Generate New World Button */}
            <div
              onClick={isGenerating ? undefined : handleGenerateWorld}
              style={{
                background: isGenerating
                  ? 'rgba(50, 50, 50, 0.5)'
                  : 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.1))',
                border: '3px dashed rgba(34, 197, 94, 0.5)',
                borderRadius: '16px',
                padding: '30px 20px',
                cursor: isGenerating ? 'wait' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '180px',
              }}
            >
              {isGenerating ? (
                <>
                  <div
                    style={{
                      fontSize: '40px',
                      marginBottom: '15px',
                      animation: 'spin 2s linear infinite',
                    }}
                  >
                    🌀
                  </div>
                  <p
                    style={{
                      margin: 0,
                      color: '#22c55e',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    {loadingMessage}
                  </p>
                  <style>
                    {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
                  </style>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '50px', marginBottom: '10px' }}>🚀</div>
                  <p
                    style={{
                      margin: 0,
                      color: '#22c55e',
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    Generate New World
                  </p>
                  <p
                    style={{
                      margin: '8px 0 0 0',
                      color: '#86efac',
                      fontSize: '12px',
                      textAlign: 'center',
                    }}
                  >
                    AI creates a world based on YOUR skills!
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#fca5a5',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}
        </div>
      )}

      {/* AI Worlds Unlock Hint (if not unlocked yet) */}
      {!canGenerateWorlds && (
        <div
          style={{
            background: 'rgba(147, 51, 234, 0.1)',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            borderRadius: '12px',
            padding: '15px 25px',
            marginBottom: '25px',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, color: '#a78bfa', fontSize: '14px' }}>
            ✨ Reach <strong>Level {AI_WORLDS_UNLOCK_LEVEL}</strong> to unlock AI-generated worlds made just for you!
          </p>
        </div>
      )}

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
