/**
 * DailyChallenge Component
 * A special daily quest with streak tracking and bonus rewards.
 */

import { useState, useEffect, useCallback } from 'react';
import { useGameState } from '../hooks/useGameState';
import { getNextStreakMilestone, createInitialDailyProgress } from '../daily/dailyChallenge';
import { generateQuestion } from '../learning/questionGenerator';
import type { Question, QuestionSkill, Difficulty } from '../learning/types';
import { SpeakerButton } from './SpeakerButton';

interface DailyChallengeProps {
  onClose: () => void;
}

type ChallengePhase = 'intro' | 'question' | 'feedback' | 'complete';

export function DailyChallenge({ onClose }: DailyChallengeProps) {
  const { saveData, completeDailyAction, recordAnswer, tickAbilityCooldowns } = useGameState();
  const [phase, setPhase] = useState<ChallengePhase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [completionResult, setCompletionResult] = useState<{
    xpBonus: number;
    streakReward: { title: string; cosmetic?: string } | null;
  } | null>(null);

  const dailyProgress = saveData.dailyProgress || createInitialDailyProgress();
  const currentStreak = dailyProgress.currentStreak || 0;
  const streakMessage = currentStreak > 0 ? `Keep your ${currentStreak} day streak going!` : null;
  const nextMilestone = getNextStreakMilestone(currentStreak);

  // Generate questions on mount
  useEffect(() => {
    const questionCount = 5;
    const difficulty: Difficulty = 'easy';
    const skills: QuestionSkill[] = ['addition', 'subtraction', 'multiplication', 'division', 'wordProblem'];
    const generatedQuestions = skills
      .slice(0, questionCount)
      .map((skill) => generateQuestion(skill, difficulty));
    setQuestions(generatedQuestions);
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (!currentQuestion || phase !== 'question') return;

      const isCorrect = answerIndex === currentQuestion.correctIndex;
      setLastAnswerCorrect(isCorrect);
      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }

      // Record the answer
      recordAnswer(currentQuestion.skill, isCorrect);
      tickAbilityCooldowns();

      setPhase('feedback');
    },
    [currentQuestion, phase, recordAnswer, tickAbilityCooldowns]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setPhase('question');
    } else {
      // Challenge complete
      const result = completeDailyAction();
      setCompletionResult(result);
      setPhase('complete');
    }
  }, [currentIndex, questions.length, completeDailyAction]);

  const startChallenge = () => {
    setPhase('question');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        className="panel animate-fade-in"
        style={{
          maxWidth: '550px',
          width: '100%',
          padding: '30px',
        }}
      >
        {/* Intro phase */}
        {phase === 'intro' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <span style={{ fontSize: '64px' }}>☀️</span>
              <h2 style={{ color: '#FFD700', margin: '15px 0', fontSize: '28px' }}>
                Daily Challenge
              </h2>
              <p style={{ color: '#b8b8b8', fontSize: '16px' }}>
                Complete today's challenge to keep your streak going!
              </p>
            </div>

            {/* Streak info */}
            <div
              style={{
                background: currentStreak > 0 ? 'rgba(255, 152, 0, 0.1)' : 'rgba(100, 100, 100, 0.1)',
                border: `2px solid ${currentStreak > 0 ? 'rgba(255, 152, 0, 0.3)' : 'rgba(100, 100, 100, 0.3)'}`,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '25px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '36px', margin: 0 }}>
                {currentStreak > 0 ? `🔥 ${currentStreak}` : '0'}
              </p>
              <p style={{ color: '#b8b8b8', margin: '5px 0 0 0', fontSize: '14px' }}>
                {currentStreak > 0 ? 'Day Streak' : 'Start your streak today!'}
              </p>
              {streakMessage && (
                <p style={{ color: '#FF9800', margin: '10px 0 0 0', fontSize: '12px' }}>
                  {streakMessage}
                </p>
              )}
            </div>

            {/* Next milestone */}
            {nextMilestone && (
              <div
                style={{
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '25px',
                  textAlign: 'center',
                }}
              >
                <p style={{ margin: 0, color: '#4CAF50', fontSize: '14px' }}>
                  🎯 {nextMilestone.daysAway} more days to unlock:{' '}
                  <strong>{nextMilestone.reward.title}</strong>
                </p>
              </div>
            )}

            {/* Challenge info */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '25px',
              }}
            >
              <p style={{ margin: 0, fontSize: '14px', color: '#b8b8b8' }}>
                📋 <strong>{questions.length} Questions</strong> • 🎁{' '}
                <strong>Bonus XP + Streak Rewards</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                Later
              </button>
              <button className="btn btn-primary" onClick={startChallenge} style={{ flex: 2 }}>
                Start Challenge! ⚡
              </button>
            </div>
          </>
        )}

        {/* Question phase */}
        {phase === 'question' && currentQuestion && (
          <>
            {/* Progress */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
              }}
            >
              <span style={{ color: '#b8b8b8', fontSize: '14px' }}>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span style={{ color: '#4CAF50', fontSize: '14px' }}>✓ {correctCount} correct</span>
            </div>

            {/* Progress bar */}
            <div
              style={{
                height: '8px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                marginBottom: '25px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(currentIndex / questions.length) * 100}%`,
                  background: 'linear-gradient(90deg, #FF9800, #FFD700)',
                  transition: 'width 0.3s',
                }}
              />
            </div>

            {/* Question */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                padding: '25px',
                marginBottom: '25px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', lineHeight: '1.4' }}>
                {currentQuestion.prompt}
              </p>
              <SpeakerButton
                text={currentQuestion.prompt}
                size="medium"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              />
            </div>

            {/* Choices */}
            <div style={{ marginBottom: '20px' }}>
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  className="choice-btn"
                  onClick={() => handleAnswer(index)}
                  style={{ display: 'block' }}
                >
                  {choice}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Feedback phase */}
        {phase === 'feedback' && currentQuestion && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <span style={{ fontSize: '64px' }}>{lastAnswerCorrect ? '🎉' : '🤔'}</span>
              <h2
                style={{
                  color: lastAnswerCorrect ? '#4CAF50' : '#FF9800',
                  margin: '15px 0 10px 0',
                  fontSize: '28px',
                }}
              >
                {lastAnswerCorrect ? 'Correct!' : 'Not Quite!'}
              </h2>
            </div>

            {!lastAnswerCorrect && (
              <div
                style={{
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                <p style={{ margin: 0, color: '#4CAF50' }}>
                  The correct answer was:{' '}
                  <strong>{currentQuestion.choices[currentQuestion.correctIndex]}</strong>
                </p>
              </div>
            )}

            <button className="btn btn-primary" onClick={handleNext} style={{ width: '100%' }}>
              {currentIndex < questions.length - 1 ? 'Next Question →' : 'See Results 🏆'}
            </button>
          </>
        )}

        {/* Complete phase */}
        {phase === 'complete' && completionResult && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <span style={{ fontSize: '80px' }}>🏆</span>
              <h2 style={{ color: '#FFD700', margin: '15px 0', fontSize: '32px' }}>
                Challenge Complete!
              </h2>
              <p style={{ color: '#b8b8b8', fontSize: '18px' }}>
                You got {correctCount} out of {questions.length} correct!
              </p>
            </div>

            {/* Rewards */}
            <div
              style={{
                background: 'rgba(255, 215, 0, 0.1)',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '25px',
                textAlign: 'center',
              }}
            >
              <p style={{ color: '#FFD700', fontSize: '24px', margin: 0 }}>
                +{completionResult.xpBonus} XP
              </p>
              {completionResult.streakReward && (
                <div style={{ marginTop: '15px' }}>
                  <p style={{ color: '#4CAF50', margin: 0, fontSize: '16px' }}>
                    🎁 Streak Reward: <strong>{completionResult.streakReward.title}</strong>
                  </p>
                  {completionResult.streakReward.cosmetic && (
                    <p style={{ color: '#b8b8b8', margin: '5px 0 0 0', fontSize: '14px' }}>
                      New cosmetic unlocked: {completionResult.streakReward.cosmetic}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Updated streak */}
            <div
              style={{
                background: 'rgba(255, 152, 0, 0.1)',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '25px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '24px', margin: 0 }}>
                🔥 {(dailyProgress?.currentStreak || 0) + 1} Day Streak!
              </p>
              <p style={{ color: '#b8b8b8', fontSize: '12px', margin: '5px 0 0 0' }}>
                Come back tomorrow to keep it going!
              </p>
            </div>

            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
}
