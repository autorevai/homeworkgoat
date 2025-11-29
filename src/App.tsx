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
import { OptionsMenu } from './ui/OptionsMenu';
import { WorldScene } from './game/WorldScene';
import { Hud } from './ui/Hud';
import { QuestDialog } from './ui/QuestDialog';
import { QuestComplete } from './ui/QuestComplete';
import { WorldSelector } from './ui/WorldSelector';
import { BossBattle } from './ui/BossBattle';
import { initAnalytics } from './firebase/config';
import type { Quest } from './learning/types';
import type { BossBattle as BossBattleType } from './conquest/bosses';

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
  const { screen, initialize, setScreen, setCurrentWorld } = useGameState();
  const { endQuest } = useQuestRunner();
  const { signIn } = useAuth();
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [activeBoss, setActiveBoss] = useState<BossBattleType | null>(null);

  // Initialize Firebase Analytics and Auth on mount
  useEffect(() => {
    initAnalytics();
    // Auto sign-in anonymously for cloud save
    signIn();
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
              isQuestActive={activeQuest !== null}
            />
            <Hud />
            {activeQuest && screen !== 'questComplete' && (
              <QuestDialog
                quest={activeQuest}
                onClose={handleCloseQuest}
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
