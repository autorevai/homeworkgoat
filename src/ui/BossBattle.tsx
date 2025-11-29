/**
 * BossBattle Component
 * Epic boss fight UI with multi-phase battles and dramatic presentation.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import type { BossBattle as BossBattleType } from '../conquest/bosses';
import { getCurrentBossPhase, calculateBossDamage, getDifficultyInfo } from '../conquest/bosses';
import { getQuestionsByIds } from '../learning/questions';
import type { Question } from '../learning/types';
import { SpeakerButton } from './SpeakerButton';

/**
 * Speed bonus tiers for answering questions quickly
 */
interface SpeedTier {
  name: string;
  multiplier: number;
  color: string;
  emoji: string;
  maxTime: number; // in seconds
}

const SPEED_TIERS: SpeedTier[] = [
  { name: 'LEGENDARY', multiplier: 2.0, color: '#FFD700', emoji: '⚡', maxTime: 3 },
  { name: 'EPIC', multiplier: 1.5, color: '#9C27B0', emoji: '🔥', maxTime: 5 },
  { name: 'GREAT', multiplier: 1.25, color: '#2196F3', emoji: '💨', maxTime: 10 },
  { name: 'GOOD', multiplier: 1.0, color: '#4CAF50', emoji: '✓', maxTime: 20 },
  { name: 'SLOW', multiplier: 0.75, color: '#FF9800', emoji: '🐢', maxTime: Infinity },
];

function getSpeedTier(timeSeconds: number): SpeedTier {
  for (const tier of SPEED_TIERS) {
    if (timeSeconds < tier.maxTime) {
      return tier;
    }
  }
  return SPEED_TIERS[SPEED_TIERS.length - 1];
}

interface BossBattleProps {
  boss: BossBattleType;
  onClose: () => void;
}

type BattlePhase = 'intro' | 'fighting' | 'victory' | 'defeat';

export function BossBattle({ boss, onClose }: BossBattleProps) {
  const { defeatBoss, recordAnswer, tickAbilityCooldowns } = useGameState();
  const [battlePhase, setBattlePhase] = useState<BattlePhase>('intro');
  const [bossHealth, setBossHealth] = useState(100);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(boss.timeLimit || 0);
  const [currentDialogue, setCurrentDialogue] = useState('');

  // Speed bonus tracking
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [questionElapsed, setQuestionElapsed] = useState<number>(0);
  const [lastSpeedTier, setLastSpeedTier] = useState<SpeedTier | null>(null);
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const damagePerHit = calculateBossDamage(boss);
  const currentBossPhase = getCurrentBossPhase(boss, bossHealth);
  const difficultyInfo = getDifficultyInfo(boss.difficulty);

  // Generate random questions for the boss fight
  useEffect(() => {
    // For now, use the quest questions as a pool
    // In a real implementation, you'd generate based on boss difficulty
    const allQuestionIds = [
      'add-008', 'add-010', 'mult-011', 'mult-015', 'div-008', 'div-009',
      'sub-007', 'sub-009', 'word-006', 'word-008', 'mult-013', 'div-011',
      'add-014', 'add-017', 'mult-016', 'mult-017',
    ];

    // Shuffle and take the number needed for the boss
    const shuffled = [...allQuestionIds].sort(() => Math.random() - 0.5);
    const selectedIds = shuffled.slice(0, boss.questionCount);
    const loadedQuestions = getQuestionsByIds(selectedIds);
    setQuestions(loadedQuestions);
  }, [boss.questionCount]);

  // Timer logic
  useEffect(() => {
    if (battlePhase !== 'fighting' || !boss.timeLimit) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setBattlePhase('defeat');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [battlePhase, boss.timeLimit]);

  // Update dialogue when phase changes
  useEffect(() => {
    setCurrentDialogue(currentBossPhase.dialogue);
  }, [currentBossPhase.name]);

  // Per-question timer - starts when question changes, stops on feedback
  useEffect(() => {
    if (battlePhase !== 'fighting' || showFeedback) {
      // Clear timer when not actively answering
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }
      return;
    }

    // Start fresh timer for new question
    const startTime = Date.now();
    setQuestionStartTime(startTime);
    setQuestionElapsed(0);

    questionTimerRef.current = setInterval(() => {
      setQuestionElapsed((Date.now() - startTime) / 1000);
    }, 100);

    return () => {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }
    };
  }, [battlePhase, currentQuestionIndex, showFeedback]);

  const startBattle = useCallback(() => {
    setBattlePhase('fighting');
    setCurrentDialogue(boss.phases[0].dialogue);
  }, [boss]);

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (showFeedback || battlePhase !== 'fighting') return;

      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = answerIndex === currentQuestion.correctIndex;

      // Calculate time taken and speed tier
      const timeTaken = (Date.now() - questionStartTime) / 1000;
      const speedTier = getSpeedTier(timeTaken);
      setLastSpeedTier(speedTier);

      setLastAnswerCorrect(isCorrect);
      setShowFeedback(true);

      // Record the answer for learning stats
      recordAnswer(currentQuestion.skill, isCorrect);
      tickAbilityCooldowns();

      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);

        // Apply speed multiplier to damage
        const speedDamage = Math.ceil(damagePerHit * speedTier.multiplier);
        setTotalDamageDealt((prev) => prev + speedDamage);

        const newHealth = Math.max(0, bossHealth - speedDamage);
        setBossHealth(newHealth);

        if (newHealth <= 0) {
          // Victory!
          setTimeout(() => {
            setBattlePhase('victory');
            defeatBoss(boss.id, boss.rewards.xp);
          }, 1500);
          return;
        }
      }

      // Move to next question after feedback
      setTimeout(() => {
        setShowFeedback(false);
        setLastSpeedTier(null);
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        } else {
          // Out of questions - check if boss defeated
          if (bossHealth <= 0) {
            setBattlePhase('victory');
          } else {
            setBattlePhase('defeat');
          }
        }
      }, 1800); // Slightly longer to show speed bonus
    },
    [
      showFeedback,
      battlePhase,
      questions,
      currentQuestionIndex,
      questionStartTime,
      bossHealth,
      damagePerHit,
      recordAnswer,
      tickAbilityCooldowns,
      boss,
      defeatBoss,
    ]
  );

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${boss.backgroundColor} 0%, #0a0a1a 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background particles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${boss.accentColor}22 0%, transparent 60%)`,
          animation: 'pulse 3s ease-in-out infinite',
        }}
      />

      {/* Intro phase */}
      {battlePhase === 'intro' && (
        <div
          className="animate-fade-in"
          style={{
            textAlign: 'center',
            maxWidth: '600px',
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: '100px' }}>{boss.bossEmoji}</span>
          <h1
            style={{
              fontSize: '48px',
              color: boss.accentColor,
              textShadow: `0 0 20px ${boss.accentColor}`,
              margin: '20px 0',
            }}
          >
            {boss.bossName}
          </h1>
          <p style={{ color: '#b8b8b8', fontSize: '18px', marginBottom: '10px' }}>
            {boss.description}
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '30px',
            }}
          >
            <span
              style={{
                background: difficultyInfo.color,
                padding: '5px 15px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              {difficultyInfo.label}
            </span>
            <span
              style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '5px 15px',
                borderRadius: '20px',
                fontSize: '14px',
              }}
            >
              {boss.questionCount} Questions
            </span>
            {boss.timeLimit && (
              <span
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '14px',
                }}
              >
                {Math.floor(boss.timeLimit / 60)}:{(boss.timeLimit % 60).toString().padStart(2, '0')} Time Limit
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Not Ready
            </button>
            <button className="btn btn-primary" onClick={startBattle}>
              Begin Battle!
            </button>
          </div>
        </div>
      )}

      {/* Fighting phase */}
      {battlePhase === 'fighting' && currentQuestion && (
        <div
          style={{
            width: '100%',
            maxWidth: '700px',
            zIndex: 1,
          }}
        >
          {/* Boss header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '60px' }}>{boss.bossEmoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: boss.accentColor }}>{boss.bossName}</h2>
                {boss.timeLimit && (
                  <span
                    style={{
                      color: timeRemaining < 30 ? '#f44336' : '#FFD700',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                  >
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>
              {/* Health bar */}
              <div
                style={{
                  height: '20px',
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginTop: '10px',
                  border: `2px solid ${boss.accentColor}`,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${bossHealth}%`,
                    background: `linear-gradient(90deg, #f44336, ${boss.accentColor})`,
                    transition: 'width 0.5s ease-out',
                  }}
                />
              </div>
              <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '12px' }}>
                Phase: {currentBossPhase.name}
              </p>
            </div>
          </div>

          {/* Boss dialogue */}
          <div
            style={{
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '20px',
              borderLeft: `4px solid ${boss.accentColor}`,
              position: 'relative',
            }}
          >
            <p style={{ margin: 0, fontStyle: 'italic', color: '#b8b8b8' }}>{currentDialogue}</p>
            <SpeakerButton
              text={currentDialogue}
              size="small"
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            />
          </div>

          {/* Question */}
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '25px',
              marginBottom: '20px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#888' }}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span style={{ color: '#4CAF50' }}>{correctCount} hits</span>
            </div>

            {/* Speed Timer Bar */}
            {!showFeedback && (
              <div
                style={{
                  marginBottom: '15px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    height: '8px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.max(0, 100 - (questionElapsed / 20) * 100)}%`,
                      background: questionElapsed < 3
                        ? 'linear-gradient(90deg, #FFD700, #FFA500)'
                        : questionElapsed < 5
                        ? 'linear-gradient(90deg, #9C27B0, #E040FB)'
                        : questionElapsed < 10
                        ? 'linear-gradient(90deg, #2196F3, #03A9F4)'
                        : questionElapsed < 20
                        ? 'linear-gradient(90deg, #4CAF50, #8BC34A)'
                        : 'linear-gradient(90deg, #FF9800, #FF5722)',
                      transition: 'width 0.1s linear',
                      boxShadow: questionElapsed < 3
                        ? '0 0 10px #FFD700'
                        : questionElapsed < 5
                        ? '0 0 8px #9C27B0'
                        : 'none',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '4px',
                    fontSize: '11px',
                    color: '#666',
                  }}
                >
                  <span
                    style={{
                      color: questionElapsed < 3 ? '#FFD700' : '#666',
                      fontWeight: questionElapsed < 3 ? 'bold' : 'normal',
                    }}
                  >
                    {questionElapsed < 3 ? '⚡ LEGENDARY!' : questionElapsed < 5 ? '🔥 EPIC!' : questionElapsed < 10 ? '💨 Great!' : ''}
                  </span>
                  <span style={{ color: questionElapsed < 5 ? '#FFD700' : '#888' }}>
                    {questionElapsed.toFixed(1)}s
                  </span>
                </div>
              </div>
            )}
            <p
              style={{
                fontSize: '24px',
                textAlign: 'center',
                margin: '0 0 20px 0',
                fontWeight: 'bold',
              }}
            >
              {currentQuestion.prompt}
            </p>
            <SpeakerButton
              text={currentQuestion.prompt}
              size="medium"
              style={{ position: 'absolute', top: '15px', right: '15px' }}
            />

            {/* Choices */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                  style={{
                    padding: '15px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    background: showFeedback
                      ? index === currentQuestion.correctIndex
                        ? 'rgba(76, 175, 80, 0.3)'
                        : lastAnswerCorrect
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(244, 67, 54, 0.3)'
                      : 'rgba(255,255,255,0.1)',
                    border: '2px solid',
                    borderColor: showFeedback
                      ? index === currentQuestion.correctIndex
                        ? '#4CAF50'
                        : 'transparent'
                      : 'rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: showFeedback ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback with Speed Bonus */}
          {showFeedback && (
            <div
              className="animate-fade-in"
              style={{
                textAlign: 'center',
                padding: '20px',
                background: lastAnswerCorrect
                  ? `linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, ${lastSpeedTier ? lastSpeedTier.color + '33' : 'rgba(76, 175, 80, 0.2)'} 100%)`
                  : 'rgba(244, 67, 54, 0.2)',
                borderRadius: '12px',
                border: lastAnswerCorrect && lastSpeedTier && lastSpeedTier.multiplier > 1
                  ? `2px solid ${lastSpeedTier.color}`
                  : 'none',
              }}
            >
              {lastAnswerCorrect && lastSpeedTier ? (
                <>
                  {/* Speed tier banner */}
                  {lastSpeedTier.multiplier > 1 && (
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: lastSpeedTier.color,
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        marginBottom: '8px',
                        textShadow: `0 0 10px ${lastSpeedTier.color}`,
                      }}
                    >
                      {lastSpeedTier.emoji} {lastSpeedTier.name} SPEED {lastSpeedTier.emoji}
                    </div>
                  )}
                  <span style={{ fontSize: '40px' }}>
                    {lastSpeedTier.multiplier >= 2 ? '⚡💥⚡' : lastSpeedTier.multiplier >= 1.5 ? '🔥💥🔥' : '💥'}
                  </span>
                  <p
                    style={{
                      margin: '10px 0 0 0',
                      color: lastSpeedTier.color,
                      fontSize: lastSpeedTier.multiplier > 1 ? '20px' : '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    -{Math.ceil(damagePerHit * lastSpeedTier.multiplier)} HP
                    {lastSpeedTier.multiplier > 1 && (
                      <span style={{ fontSize: '14px', marginLeft: '8px', opacity: 0.8 }}>
                        ({lastSpeedTier.multiplier}x damage!)
                      </span>
                    )}
                  </p>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '32px' }}>🛡️</span>
                  <p style={{ margin: '10px 0 0 0', color: '#f44336' }}>
                    The boss blocked your attack!
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Victory phase */}
      {battlePhase === 'victory' && (
        <div className="animate-fade-in" style={{ textAlign: 'center', zIndex: 1 }}>
          <span style={{ fontSize: '100px' }}>🏆</span>
          <h1
            style={{
              fontSize: '48px',
              color: '#FFD700',
              textShadow: '0 0 20px rgba(255,215,0,0.5)',
              margin: '20px 0',
            }}
          >
            VICTORY!
          </h1>
          <p style={{ color: '#b8b8b8', fontSize: '20px', marginBottom: '20px' }}>
            You defeated {boss.bossName}!
          </p>
          <div
            style={{
              background: 'rgba(255,215,0,0.1)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '30px',
            }}
          >
            <p style={{ color: '#FFD700', fontSize: '24px', margin: 0 }}>+{boss.rewards.xp} XP</p>
            {totalDamageDealt > 100 && (
              <p style={{ color: '#9C27B0', marginTop: '10px', fontSize: '14px' }}>
                Total Damage: {totalDamageDealt} (Speed Bonus Active!)
              </p>
            )}
            {boss.rewards.title && (
              <p style={{ color: '#b8b8b8', marginTop: '10px' }}>New Title: {boss.rewards.title}</p>
            )}
            {boss.rewards.cosmetics.length > 0 && (
              <p style={{ color: '#b8b8b8', marginTop: '5px' }}>
                New Cosmetics: {boss.rewards.cosmetics.join(', ')}
              </p>
            )}
          </div>
          <button className="btn btn-primary" onClick={onClose}>
            Continue
          </button>
        </div>
      )}

      {/* Defeat phase */}
      {battlePhase === 'defeat' && (
        <div className="animate-fade-in" style={{ textAlign: 'center', zIndex: 1 }}>
          <span style={{ fontSize: '100px' }}>{boss.bossEmoji}</span>
          <h1
            style={{
              fontSize: '48px',
              color: '#f44336',
              margin: '20px 0',
            }}
          >
            Defeated...
          </h1>
          <p style={{ color: '#b8b8b8', fontSize: '18px', marginBottom: '30px' }}>
            {boss.bossName} was too powerful this time. Train more and try again!
          </p>
          <button className="btn btn-primary" onClick={onClose}>
            Return to World
          </button>
        </div>
      )}

      {/* Animation styles */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes speedPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
        `}
      </style>
    </div>
  );
}
