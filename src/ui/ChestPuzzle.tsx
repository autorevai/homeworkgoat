/**
 * ChestPuzzle Component
 * Modal UI for solving the math puzzle to unlock a treasure chest.
 * Mobile-responsive design.
 */

import { useState, useMemo } from 'react';
import type { TreasureChestDef } from '../persistence/types';
import { CHEST_RARITY_CONFIG, getChestRarityInfo, generateChestPuzzle } from '../exploration/treasureChests';
import { SpeakerButton } from './SpeakerButton';
import { isTouchDevice } from './MobileControls';

interface ChestPuzzleProps {
  chest: TreasureChestDef;
  onSuccess: (xp: number, coins: number, cosmetic?: string) => void;
  onClose: () => void;
}

export function ChestPuzzle({ chest, onSuccess, onClose }: ChestPuzzleProps) {
  const [puzzle, setPuzzle] = useState(() => generateChestPuzzle(chest.rarity));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const isMobile = useMemo(() => isTouchDevice(), []);

  const config = CHEST_RARITY_CONFIG[chest.rarity];
  const rarityInfo = getChestRarityInfo(chest.rarity);

  const handleAnswer = (choice: number) => {
    if (showResult) return;

    setSelectedAnswer(choice);
    setShowResult(true);
    const correct = choice === puzzle.answer;
    setIsCorrect(correct);

    if (correct) {
      // Calculate rewards
      const xp = chest.rewards.xp;
      const coins = chest.rewards.coins || 0;

      // Delay success callback to show celebration
      setTimeout(() => {
        onSuccess(xp, coins, chest.rewards.cosmetic);
      }, 2000);
    } else {
      setAttempts((prev) => prev + 1);
      // Auto-generate new puzzle after 3 wrong attempts
      if (attempts >= 2) {
        setTimeout(() => {
          setPuzzle(generateChestPuzzle(chest.rarity));
          setSelectedAnswer(null);
          setShowResult(false);
          setShowHint(false);
          setAttempts(0);
        }, 1500);
      } else {
        setTimeout(() => {
          setSelectedAnswer(null);
          setShowResult(false);
        }, 1500);
      }
    }
  };

  return (
    <div
      className="menu-scrollable"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: isMobile ? '15px' : '20px',
        paddingTop: isMobile ? '30px' : '20px',
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: `linear-gradient(135deg, #1a1a2e 0%, ${config.color}33 100%)`,
          borderRadius: '20px',
          padding: isMobile ? '20px' : '30px',
          maxWidth: '500px',
          width: '100%',
          border: `3px solid ${config.color}`,
          boxShadow: `0 0 40px ${config.glowColor}66`,
          animation: 'slideUp 0.3s ease-out',
          marginBottom: isMobile ? '30px' : '0',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <span style={{ fontSize: '60px' }}>{rarityInfo.emoji}</span>
          <h2
            style={{
              color: config.color,
              margin: '10px 0 5px 0',
              fontSize: '28px',
              textShadow: `0 0 15px ${config.glowColor}`,
            }}
          >
            {rarityInfo.label} Chest
          </h2>
          <p style={{ color: '#888', margin: 0 }}>{rarityInfo.description}</p>
          <p style={{ color: '#FFD700', marginTop: '10px', fontSize: '14px' }}>
            Solve the puzzle to unlock!
          </p>
        </div>

        {/* Puzzle */}
        {!isCorrect && (
          <>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '20px',
                position: 'relative',
              }}
            >
              <p
                style={{
                  fontSize: '32px',
                  textAlign: 'center',
                  margin: 0,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {puzzle.prompt}
              </p>
              <SpeakerButton
                text={puzzle.prompt}
                size="medium"
                style={{ position: 'absolute', top: '15px', right: '15px' }}
              />
            </div>

            {/* Choices - larger tap targets on mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '10px' : '12px', marginBottom: '20px' }}>
              {puzzle.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(choice)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    if (!showResult) handleAnswer(choice);
                  }}
                  disabled={showResult}
                  style={{
                    padding: isMobile ? '20px 15px' : '18px',
                    fontSize: isMobile ? '20px' : '24px',
                    fontWeight: 'bold',
                    minHeight: isMobile ? '60px' : 'auto',
                    background: showResult
                      ? choice === puzzle.answer
                        ? 'rgba(76, 175, 80, 0.4)'
                        : selectedAnswer === choice
                        ? 'rgba(244, 67, 54, 0.4)'
                        : 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: `2px solid ${
                      showResult && choice === puzzle.answer
                        ? '#4CAF50'
                        : showResult && selectedAnswer === choice && !isCorrect
                        ? '#f44336'
                        : 'rgba(255, 255, 255, 0.2)'
                    }`,
                    borderRadius: '12px',
                    color: 'white',
                    cursor: showResult ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    touchAction: 'manipulation',
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>

            {/* Hint */}
            {!showHint && !showResult && (
              <button
                onClick={() => setShowHint(true)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(255, 193, 7, 0.2)',
                  border: '1px solid #FFC107',
                  borderRadius: '8px',
                  color: '#FFC107',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                💡 Need a hint?
              </button>
            )}

            {showHint && (
              <div
                style={{
                  background: 'rgba(255, 193, 7, 0.1)',
                  border: '1px solid #FFC107',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <span style={{ color: '#FFC107' }}>💡 {puzzle.hint}</span>
              </div>
            )}

            {/* Wrong answer feedback */}
            {showResult && !isCorrect && (
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '15px',
                  color: '#f44336',
                }}
              >
                <p style={{ margin: 0, fontSize: '18px' }}>Not quite! Try again!</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#888' }}>
                  {3 - attempts} attempt{3 - attempts !== 1 ? 's' : ''} remaining
                </p>
              </div>
            )}
          </>
        )}

        {/* Success */}
        {isCorrect && (
          <div
            style={{
              textAlign: 'center',
              animation: 'bounceIn 0.5s ease-out',
            }}
          >
            <span style={{ fontSize: '80px' }}>🎉</span>
            <h3 style={{ color: '#4CAF50', fontSize: '28px', margin: '10px 0' }}>
              UNLOCKED!
            </h3>
            <div
              style={{
                background: 'rgba(76, 175, 80, 0.2)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <p style={{ color: '#FFD700', fontSize: '24px', margin: '0 0 10px 0' }}>
                +{chest.rewards.xp} XP
              </p>
              {chest.rewards.coins && (
                <p style={{ color: '#FFC107', fontSize: '20px', margin: '0 0 10px 0' }}>
                  +{chest.rewards.coins} Coins
                </p>
              )}
              {chest.rewards.cosmetic && (
                <p style={{ color: '#E040FB', fontSize: '18px', margin: 0 }}>
                  🎁 New Cosmetic: {chest.rewards.cosmetic}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Close button */}
        {!isCorrect && (
          <button
            onClick={onClose}
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#888',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Close (Try later)
          </button>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounceIn {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
