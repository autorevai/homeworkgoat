/**
 * SpeakerButton Component
 * A button that reads text aloud for students who need audio support.
 */

import { useSpeech } from '../audio/useSpeech';

interface SpeakerButtonProps {
  text: string;
  size?: 'small' | 'medium' | 'large';
  style?: React.CSSProperties;
}

export function SpeakerButton({ text, size = 'medium', style }: SpeakerButtonProps) {
  const { speaking, speakText } = useSpeech();

  const sizeMap = {
    small: { button: '32px', icon: '16px' },
    medium: { button: '44px', icon: '22px' },
    large: { button: '56px', icon: '28px' },
  };

  const dimensions = sizeMap[size];

  return (
    <button
      onClick={() => speakText(text)}
      title={speaking ? 'Stop reading' : 'Read aloud'}
      style={{
        width: dimensions.button,
        height: dimensions.button,
        borderRadius: '50%',
        border: 'none',
        background: speaking
          ? 'linear-gradient(135deg, #FF9800, #F57C00)'
          : 'linear-gradient(135deg, #4CAF50, #388E3C)',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: dimensions.icon,
        transition: 'all 0.2s ease',
        boxShadow: speaking
          ? '0 0 12px rgba(255, 152, 0, 0.5)'
          : '0 2px 8px rgba(0, 0, 0, 0.2)',
        ...style,
      }}
    >
      {speaking ? '⏹️' : '🔊'}
    </button>
  );
}
