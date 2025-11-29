/**
 * ShardPuzzle Component
 * Modal UI for solving the math puzzle to collect a crystal shard.
 */

import { useState } from 'react';
import type { CrystalShardDef } from '../persistence/types';
import { CRYSTAL_COLORS, type CrystalColor, generateShardPuzzle, getShardProgress } from '../exploration/crystalShards';
import { SpeakerButton } from './SpeakerButton';

interface ShardPuzzleProps {
  shard: CrystalShardDef;
  worldId: string;
  collectedShardIds: string[];
  onSuccess: () => void;
  onClose: () => void;
}

export function ShardPuzzle({ shard, worldId, collectedShardIds, onSuccess, onClose }: ShardPuzzleProps) {
  const [puzzle] = useState(() => generateShardPuzzle(shard.color));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const colorKey = shard.color as CrystalColor;
  const crystalColor = CRYSTAL_COLORS[colorKey] || CRYSTAL_COLORS.blue;
  const progress = getShardProgress(worldId, collectedShardIds);
  const isGolden = shard.color === 'gold';

  const handleAnswer = (choice: number) => {
    if (showResult) return;

    setSelectedAnswer(choice);
    setShowResult(true);
    const correct = choice === puzzle.answer;
    setIsCorrect(correct);

    if (correct) {
      // Delay success callback to show celebration
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      // Close after showing wrong answer
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: `linear-gradient(135deg, #1a1a2e 0%, ${crystalColor.hex}22 100%)`,
          borderRadius: '20px',
          padding: '30px',
          maxWidth: '450px',
          width: '90%',
          border: `3px solid ${crystalColor.hex}`,
          boxShadow: `0 0 40px ${crystalColor.glow}66`,
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <span style={{ fontSize: '50px' }}>💎</span>
          <h2
            style={{
              color: crystalColor.hex,
              margin: '10px 0 5px 0',
              fontSize: '24px',
              textShadow: `0 0 15px ${crystalColor.glow}`,
            }}
          >
            {isGolden ? 'Golden ' : ''}{crystalColor.hex === CRYSTAL_COLORS.gold.hex ? 'Master ' : ''}Crystal Shard
          </h2>
          <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
            {progress.collected + 1} of {progress.total} shards
          </p>
          {isGolden && (
            <p style={{ color: '#FFD700', marginTop: '8px', fontSize: '12px' }}>
              This is the final shard! Collect it to unlock a secret!
            </p>
          )}
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
                  fontSize: '28px',
                  textAlign: 'center',
                  margin: 0,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {puzzle.prompt}
              </p>
              <SpeakerButton
                text={puzzle.prompt.replace('×', 'times').replace('÷', 'divided by')}
                size="medium"
                style={{ position: 'absolute', top: '12px', right: '12px' }}
              />
            </div>

            {/* Choices */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              {puzzle.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(choice)}
                  disabled={showResult}
                  style={{
                    padding: '16px',
                    fontSize: '22px',
                    fontWeight: 'bold',
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
                    borderRadius: '10px',
                    color: 'white',
                    cursor: showResult ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>

            {/* Hint */}
            <div
              style={{
                background: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                fontSize: '13px',
              }}
            >
              <span style={{ color: '#FFC107' }}>💡 {puzzle.hint}</span>
            </div>

            {/* Wrong answer feedback */}
            {showResult && !isCorrect && (
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '15px',
                  color: '#f44336',
                }}
              >
                <p style={{ margin: 0, fontSize: '16px' }}>Not quite! The crystal fades away...</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#888' }}>
                  It will reappear soon. Try again later!
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
            <span style={{ fontSize: '60px' }}>✨💎✨</span>
            <h3 style={{ color: crystalColor.hex, fontSize: '24px', margin: '10px 0' }}>
              SHARD COLLECTED!
            </h3>
            <p style={{ color: '#888', fontSize: '14px' }}>
              {progress.collected + 1 === progress.total
                ? 'You collected all the shards! A secret has been unlocked!'
                : `${progress.total - progress.collected - 1} more shard${progress.total - progress.collected - 1 !== 1 ? 's' : ''} to find...`}
            </p>
          </div>
        )}

        {/* Close button */}
        {!isCorrect && !showResult && (
          <button
            onClick={onClose}
            style={{
              marginTop: '15px',
              width: '100%',
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#888',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Close
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
