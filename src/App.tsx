/**
 * App Component
 * Main application entry point that handles screen routing and game initialization.
 */

import { useEffect, useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { useQuestRunner } from './hooks/useQuestRunner';
import { useAuth } from './hooks/useAuth';
import { MainMenu } from './ui/MainMenu';
import { AvatarCustomization } from './ui/AvatarCustomization';
import { NameSetup } from './ui/NameSetup';
import { GradeLevelPicker } from './ui/GradeLevelPicker';
import { OptionsMenu } from './ui/OptionsMenu';
import { WorldScene } from './game/WorldScene';
import { Hud } from './ui/Hud';
import { QuestDialog } from './ui/QuestDialog';
import { QuestComplete } from './ui/QuestComplete';
import { WorldSelector } from './ui/WorldSelector';
import { BossBattle } from './ui/BossBattle';
import { ChestPuzzle } from './ui/ChestPuzzle';
import { ShardPuzzle } from './ui/ShardPuzzle';
import { initAnalytics } from './firebase/config';
import { initializeGameTestAPI } from './testing/agentTestAPI';
import type { Quest } from './learning/types';
import type { BossBattle as BossBattleType } from './conquest/bosses';
import type { TreasureChestDef, CrystalShardDef } from './persistence/types';
import { areAllShardsCollected, getShardCollectionReward } from './exploration/crystalShards';

function LoadingScreen() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      }}
    >
      <h1 style={{ color: '#FFD700', fontSize: '48px', marginBottom: '20px' }}>
        🐐 Homework GOAT
      </h1>
      <div
        style={{
          width: '200px',
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '50%',
            height: '100%',
            background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
            animation: 'loading 1s ease-in-out infinite',
          }}
        />
      </div>
      <p style={{ color: '#b8b8b8', marginTop: '20px' }}>Loading...</p>
      <style>
        {`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}
      </style>
    </div>
  );
}

function App() {
  const { screen, initialize, setScreen, setCurrentWorld, addXp, updateSaveData, saveData } = useGameState();
  const { endQuest } = useQuestRunner();
  const { signIn } = useAuth();
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [activeBoss, setActiveBoss] = useState<BossBattleType | null>(null);
  const [activeChest, setActiveChest] = useState<TreasureChestDef | null>(null);
  const [activeShard, setActiveShard] = useState<CrystalShardDef | null>(null);

  // Initialize Firebase Analytics, Auth, and Test API on mount
  useEffect(() => {
    initAnalytics();
    // Auto sign-in anonymously for cloud save
    signIn();
    // Initialize Agent Testing API (accessible via window.gameTestAPI)
    initializeGameTestAPI();
  }, []);

  // Initialize game state on mount
  useEffect(() => {
    // Small delay to show loading screen and wait for auth
    const timer = setTimeout(() => {
      initialize();
    }, 500);

    return () => clearTimeout(timer);
  }, [initialize]);

  const handleStartQuest = (quest: Quest) => {
    setActiveQuest(quest);
  };

  const handleCloseQuest = () => {
    endQuest();
    setActiveQuest(null);
  };

  const handleSelectWorld = (worldId: string) => {
    setCurrentWorld(worldId);
    setScreen('playing');
  };

  const handleStartBoss = (boss: BossBattleType) => {
    setActiveBoss(boss);
    setScreen('bossBattle');
  };

  const handleCloseBoss = () => {
    setActiveBoss(null);
    setScreen('playing');
  };

  const handleOpenChest = (chest: TreasureChestDef) => {
    setActiveChest(chest);
  };

  const handleChestSuccess = (xp: number, coins: number, cosmetic?: string) => {
    if (!activeChest) return;

    // Add XP
    addXp(xp);

    // Update coins and mark chest as opened
    const updates: Partial<typeof saveData> = {
      coins: (saveData.coins || 0) + coins,
      openedChestIds: [...(saveData.openedChestIds || []), activeChest.id],
    };

    // Add cosmetic if earned
    if (cosmetic) {
      updates.unlockedCosmetics = [...(saveData.unlockedCosmetics || []), cosmetic];
    }

    updateSaveData(updates);
    setActiveChest(null);
  };

  const handleCloseChest = () => {
    setActiveChest(null);
  };

  const handleCollectShard = (shard: CrystalShardDef) => {
    setActiveShard(shard);
  };

  const handleShardSuccess = () => {
    if (!activeShard) return;

    // Add shard to collected
    const newCollectedShards = [...(saveData.collectedShardIds || []), activeShard.id];

    // Check if all shards in this world are now collected
    const worldId = activeShard.worldId;
    const allCollected = areAllShardsCollected(worldId, newCollectedShards);

    let updates: Partial<typeof saveData> = {
      collectedShardIds: newCollectedShards,
    };

    // Award bonus for completing all shards
    if (allCollected) {
      const reward = getShardCollectionReward(worldId);
      updates = {
        ...updates,
        coins: (saveData.coins || 0) + reward.coins,
        unlockedCosmetics: [...(saveData.unlockedCosmetics || []), reward.cosmetic],
        unlockedTitles: [...(saveData.unlockedTitles || []), reward.title],
      };
      // Add XP separately to trigger level up checks
      addXp(reward.xp);
    }

    updateSaveData(updates);
    setActiveShard(null);
  };

  const handleCloseShard = () => {
    setActiveShard(null);
  };

  // Clear activeQuest when quest complete screen is dismissed
  useEffect(() => {
    if (screen === 'playing' && activeQuest) {
      // If we're back to playing but had an active quest, it means quest was completed
      // and dismissed - clear the activeQuest
      endQuest();
      setActiveQuest(null);
    }
  }, [screen]);

  // Render based on current screen
  const renderScreen = () => {
    switch (screen) {
      case 'loading':
        return <LoadingScreen />;

      case 'mainMenu':
        return <MainMenu />;

      case 'avatarSetup':
        return <AvatarCustomization />;

      case 'nameSetup':
        return <NameSetup />;

      case 'gradeLevelSetup':
        return <GradeLevelPicker onComplete={() => setScreen('worldSelector')} />;

      case 'options':
        return <OptionsMenu />;

      case 'worldSelector':
        return (
          <WorldSelector
            onSelectWorld={handleSelectWorld}
            onBack={() => setScreen('mainMenu')}
          />
        );

      case 'bossBattle':
        return activeBoss ? (
          <BossBattle
            boss={activeBoss}
            onClose={handleCloseBoss}
          />
        ) : (
          <LoadingScreen />
        );

      case 'playing':
      case 'questComplete':
        return (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <WorldScene
              onStartQuest={handleStartQuest}
              onStartBoss={handleStartBoss}
              onOpenChest={handleOpenChest}
              onCollectShard={handleCollectShard}
              isQuestActive={activeQuest !== null || activeChest !== null || activeShard !== null}
            />
            <Hud />
            {activeQuest && screen !== 'questComplete' && (
              <QuestDialog
                quest={activeQuest}
                onClose={handleCloseQuest}
              />
            )}
            {activeChest && (
              <ChestPuzzle
                chest={activeChest}
                onSuccess={handleChestSuccess}
                onClose={handleCloseChest}
              />
            )}
            {activeShard && (
              <ShardPuzzle
                shard={activeShard}
                worldId={activeShard.worldId}
                collectedShardIds={saveData.collectedShardIds || []}
                onSuccess={handleShardSuccess}
                onClose={handleCloseShard}
              />
            )}
            {screen === 'questComplete' && <QuestComplete />}
          </div>
        );

      default:
        return <LoadingScreen />;
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {renderScreen()}
    </div>
  );
}

export default App;
