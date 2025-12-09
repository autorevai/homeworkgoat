/**
 * Tutorial System
 * Interactive step-by-step guide for new players.
 * Mobile-aware with joystick instructions.
 */

import { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { isTouchDevice } from './MobileControls';

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  mobileContent?: string; // Alternative content for mobile
  highlight?: 'controls' | 'hud' | 'npc' | 'chest' | 'menu';
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
  action?: 'move' | 'interact' | 'answer' | 'none';
  completionCheck?: () => boolean;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Homework GOAT!',
    content: 'Ready to become a Math Master? Let me show you how to play!',
    position: 'center',
    action: 'none',
  },
  {
    id: 'movement',
    title: 'Moving Around',
    content: 'Use WASD or Arrow Keys to move your character. Try walking around!',
    mobileContent: 'Use the joystick in the bottom-left corner to move your character. Try walking around!',
    highlight: 'controls',
    position: 'bottom',
    action: 'move',
  },
  {
    id: 'look-around',
    title: 'Explore the World',
    content: 'Great job! You can explore this whole world. Look for glowing NPCs, chests, and crystals!',
    position: 'center',
    action: 'none',
  },
  {
    id: 'find-npc',
    title: 'Talk to NPCs',
    content: 'See those characters with names above them? Walk up to one and press E to start a math quest!',
    mobileContent: 'See those characters with names above them? Walk up to one and tap the yellow E button to start a math quest!',
    highlight: 'npc',
    position: 'top',
    action: 'interact',
  },
  {
    id: 'hud-intro',
    title: 'Your Progress',
    content: 'Check the top-left corner to see your level, XP, and completed quests. Answer questions correctly to earn XP!',
    highlight: 'hud',
    position: 'center',
    action: 'none',
  },
  {
    id: 'chests',
    title: 'Treasure Chests',
    content: 'Find glowing chests around the world. Solve their math puzzles to unlock rewards and coins!',
    highlight: 'chest',
    position: 'center',
    action: 'none',
  },
  {
    id: 'crystals',
    title: 'Crystal Shards',
    content: 'Collect all 5 crystal shards in each world for special rewards. They glow and float in the air!',
    position: 'center',
    action: 'none',
  },
  {
    id: 'menu',
    title: 'Menu & Worlds',
    content: 'Click the Menu button to access settings, change worlds, or take a break. Have fun learning!',
    mobileContent: 'Tap the Menu button to access settings, change worlds, or take a break. Have fun learning!',
    highlight: 'menu',
    position: 'center',
    action: 'none',
  },
  {
    id: 'complete',
    title: 'You\'re Ready!',
    content: 'That\'s everything! Now go explore, solve math problems, and become the greatest Math Hero!',
    position: 'center',
    action: 'none',
  },
];

interface TutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function Tutorial({ onComplete, onSkip }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const isMobile = isTouchDevice();

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  // Get the appropriate content based on device
  const stepContent = isMobile && step.mobileContent ? step.mobileContent : step.content;

  // Listen for movement to complete movement step (keyboard or touch)
  useEffect(() => {
    if (step.action !== 'move') return;

    // Keyboard detection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
        setHasMoved(true);
      }
    };

    // Touch detection - check if joystick is being used
    const checkMobileMovement = () => {
      // Import the mobile input state to check for movement
      import('../game/PlayerController').then(({ mobileInputState }) => {
        if (mobileInputState.forward !== 0 || mobileInputState.turn !== 0) {
          setHasMoved(true);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    // For mobile, poll for joystick movement
    let mobileInterval: ReturnType<typeof setInterval>;
    if (isMobile) {
      mobileInterval = setInterval(checkMobileMovement, 200);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (mobileInterval) clearInterval(mobileInterval);
    };
  }, [step.action, isMobile]);

  // Auto-advance after movement
  useEffect(() => {
    if (hasMoved && step.action === 'move') {
      const timer = setTimeout(() => {
        handleNext();
        setHasMoved(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasMoved, step.action]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Get highlight styles - adjusted for mobile
  const getHighlightStyle = (): React.CSSProperties => {
    switch (step.highlight) {
      case 'hud':
        return { top: '10px', left: '10px', width: isMobile ? '200px' : '280px', height: isMobile ? '100px' : '120px' };
      case 'menu':
        return { top: '10px', right: '10px', width: '100px', height: '50px' };
      case 'controls':
        // On mobile, highlight the joystick area
        if (isMobile) {
          return { bottom: '20px', left: '20px', width: '140px', height: '140px', borderRadius: '50%' };
        }
        return { bottom: '10px', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '60px' };
      default:
        return {};
    }
  };

  // Get modal position - centered on mobile for better UX
  const getModalPosition = (): React.CSSProperties => {
    if (isMobile) {
      // Always center on mobile for better readability
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
    switch (step.position) {
      case 'top':
        return { top: '20%', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom':
        return { bottom: '20%', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { top: '50%', left: '20%', transform: 'translateY(-50%)' };
      case 'right':
        return { top: '50%', right: '20%', transform: 'translateY(-50%)' };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        pointerEvents: 'none',
      }}
    >
      {/* Dimmed overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          pointerEvents: 'auto',
        }}
      />

      {/* Highlight box */}
      {step.highlight && (
        <div
          style={{
            position: 'absolute',
            ...getHighlightStyle(),
            border: '3px solid #FFD700',
            borderRadius: '12px',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
            animation: 'tutorialPulse 2s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Tutorial modal */}
      <div
        style={{
          position: 'absolute',
          ...getModalPosition(),
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '20px',
          padding: '30px',
          maxWidth: '450px',
          width: '90%',
          border: '3px solid #4CAF50',
          boxShadow: '0 0 40px rgba(76, 175, 80, 0.3)',
          pointerEvents: 'auto',
          animation: 'slideIn 0.3s ease-out',
        }}
      >
        {/* Progress bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px 20px 0 0',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Step indicator */}
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            right: '20px',
            background: '#4CAF50',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {currentStep + 1} / {TUTORIAL_STEPS.length}
        </div>

        {/* Content */}
        <div style={{ textAlign: 'center' }}>
          <h2
            style={{
              color: '#FFD700',
              fontSize: '24px',
              margin: '0 0 15px 0',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
            }}
          >
            {step.title}
          </h2>
          <p
            style={{
              color: '#e0e0e0',
              fontSize: isMobile ? '14px' : '16px',
              lineHeight: 1.6,
              margin: '0 0 25px 0',
            }}
          >
            {stepContent}
          </p>

          {/* Action hint */}
          {step.action === 'move' && !hasMoved && (
            <div
              style={{
                background: 'rgba(255, 193, 7, 0.2)',
                border: '1px solid #FFC107',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '20px',
              }}
            >
              <span style={{ color: '#FFC107' }}>
                {isMobile
                  ? 'Use the joystick to move!'
                  : 'Press W, A, S, D or Arrow Keys to move!'}
              </span>
            </div>
          )}

          {step.action === 'move' && hasMoved && (
            <div
              style={{
                background: 'rgba(76, 175, 80, 0.2)',
                border: '1px solid #4CAF50',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '20px',
              }}
            >
              <span style={{ color: '#4CAF50' }}>Great job! You're moving!</span>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={step.action === 'move' && !hasMoved}
              style={{
                padding: '12px 32px',
                background: step.action === 'move' && !hasMoved
                  ? 'rgba(76, 175, 80, 0.3)'
                  : 'linear-gradient(135deg, #4CAF50, #45a049)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: step.action === 'move' && !hasMoved ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              {isLastStep ? 'Start Playing!' : 'Next'}
            </button>
          </div>

          {/* Skip button */}
          <button
            onClick={onSkip}
            style={{
              marginTop: '20px',
              padding: '8px 16px',
              background: 'transparent',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              fontSize: '12px',
              textDecoration: 'underline',
            }}
          >
            Skip Tutorial
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes tutorialPulse {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
            50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
        `}
      </style>
    </div>
  );
}

/**
 * Hook to manage tutorial state
 */
export function useTutorial() {
  const { saveData, updateSaveData } = useGameState();
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Show tutorial for new players who haven't completed it
    if (saveData.playerName && !saveData.tutorialCompleted) {
      setShowTutorial(true);
    }
  }, [saveData.playerName, saveData.tutorialCompleted]);

  const completeTutorial = () => {
    updateSaveData({ tutorialCompleted: true });
    setShowTutorial(false);
  };

  const skipTutorial = () => {
    updateSaveData({ tutorialCompleted: true });
    setShowTutorial(false);
  };

  const resetTutorial = () => {
    updateSaveData({ tutorialCompleted: false });
    setShowTutorial(true);
  };

  return {
    showTutorial,
    completeTutorial,
    skipTutorial,
    resetTutorial,
  };
}
