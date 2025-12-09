/**
 * AccessibilitySettings Component
 * Provides options for users with different accessibility needs.
 */

import { useGameState } from '../hooks/useGameState';

interface AccessibilitySettingsProps {
  onBack: () => void;
}

export function AccessibilitySettings({ onBack }: AccessibilitySettingsProps) {
  const { saveData, updateSaveData } = useGameState();

  const settings = saveData.accessibilitySettings || {
    largeText: false,
    highContrast: false,
    reducedMotion: false,
    colorBlindMode: 'none' as 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia',
    screenReaderMode: false,
  };

  const updateSetting = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
    updateSaveData({
      accessibilitySettings: {
        ...settings,
        [key]: value,
      },
    });
  };

  return (
    <div
      className="menu-scrollable"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '20px',
      }}
    >
      <div
        className="panel"
        style={{
          maxWidth: '500px',
          width: '100%',
          padding: '30px',
          margin: '20px 0',
        }}
      >
        <h2
          style={{
            color: '#FFD700',
            margin: '0 0 10px 0',
            fontSize: settings.largeText ? '32px' : '28px',
            textAlign: 'center',
          }}
        >
          Accessibility
        </h2>
        <p
          style={{
            color: '#888',
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: settings.largeText ? '18px' : '14px',
          }}
        >
          Customize your experience
        </p>

        {/* Large Text */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            <div>
              <span
                style={{
                  color: 'white',
                  fontSize: settings.largeText ? '20px' : '16px',
                  fontWeight: 'bold',
                }}
              >
                Large Text
              </span>
              <p
                style={{
                  color: '#888',
                  margin: '5px 0 0 0',
                  fontSize: settings.largeText ? '16px' : '12px',
                }}
              >
                Makes all text bigger and easier to read
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.largeText}
              onChange={(e) => updateSetting('largeText', e.target.checked)}
              style={{ width: '24px', height: '24px', cursor: 'pointer' }}
            />
          </label>
        </div>

        {/* High Contrast */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            <div>
              <span
                style={{
                  color: 'white',
                  fontSize: settings.largeText ? '20px' : '16px',
                  fontWeight: 'bold',
                }}
              >
                High Contrast
              </span>
              <p
                style={{
                  color: '#888',
                  margin: '5px 0 0 0',
                  fontSize: settings.largeText ? '16px' : '12px',
                }}
              >
                Increases color contrast for better visibility
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSetting('highContrast', e.target.checked)}
              style={{ width: '24px', height: '24px', cursor: 'pointer' }}
            />
          </label>
        </div>

        {/* Reduced Motion */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            <div>
              <span
                style={{
                  color: 'white',
                  fontSize: settings.largeText ? '20px' : '16px',
                  fontWeight: 'bold',
                }}
              >
                Reduced Motion
              </span>
              <p
                style={{
                  color: '#888',
                  margin: '5px 0 0 0',
                  fontSize: settings.largeText ? '16px' : '12px',
                }}
              >
                Minimizes animations and movement
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
              style={{ width: '24px', height: '24px', cursor: 'pointer' }}
            />
          </label>
        </div>

        {/* Color Blind Mode */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
            }}
          >
            <span
              style={{
                color: 'white',
                fontSize: settings.largeText ? '20px' : '16px',
                fontWeight: 'bold',
              }}
            >
              Color Blind Mode
            </span>
            <p
              style={{
                color: '#888',
                margin: '5px 0 15px 0',
                fontSize: settings.largeText ? '16px' : '12px',
              }}
            >
              Adjust colors for different types of color blindness
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { value: 'none', label: 'None' },
                { value: 'protanopia', label: 'Protanopia (Red-Blind)' },
                { value: 'deuteranopia', label: 'Deuteranopia (Green-Blind)' },
                { value: 'tritanopia', label: 'Tritanopia (Blue-Blind)' },
              ].map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                    background:
                      settings.colorBlindMode === option.value
                        ? 'rgba(76, 175, 80, 0.2)'
                        : 'transparent',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border:
                      settings.colorBlindMode === option.value
                        ? '1px solid #4CAF50'
                        : '1px solid transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="colorBlindMode"
                    value={option.value}
                    checked={settings.colorBlindMode === option.value}
                    onChange={() =>
                      updateSetting('colorBlindMode', option.value as typeof settings.colorBlindMode)
                    }
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span
                    style={{
                      color: 'white',
                      fontSize: settings.largeText ? '16px' : '14px',
                    }}
                  >
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Screen Reader Mode */}
        <div style={{ marginBottom: '30px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            <div>
              <span
                style={{
                  color: 'white',
                  fontSize: settings.largeText ? '20px' : '16px',
                  fontWeight: 'bold',
                }}
              >
                Screen Reader Support
              </span>
              <p
                style={{
                  color: '#888',
                  margin: '5px 0 0 0',
                  fontSize: settings.largeText ? '16px' : '12px',
                }}
              >
                Adds extra labels for screen readers
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.screenReaderMode}
              onChange={(e) => updateSetting('screenReaderMode', e.target.checked)}
              style={{ width: '24px', height: '24px', cursor: 'pointer' }}
            />
          </label>
        </div>

        {/* Back Button */}
        <button
          className="btn btn-secondary"
          onClick={onBack}
          style={{
            width: '100%',
            padding: settings.largeText ? '18px' : '14px',
            fontSize: settings.largeText ? '18px' : '16px',
          }}
        >
          Back to Options
        </button>
      </div>
    </div>
  );
}
