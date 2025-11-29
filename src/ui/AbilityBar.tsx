/**
 * AbilityBar Component
 * Displays available abilities during quest battles with cooldown indicators.
 */

import { useGameState } from '../hooks/useGameState';
import { abilities, canUseAbility, type AbilityEffect } from '../abilities/abilities';

interface AbilityBarProps {
  onUseAbility: (abilityId: string, effect: AbilityEffect) => void;
}

export function AbilityBar({ onUseAbility }: AbilityBarProps) {
  const { saveData, useAbilityAction } = useGameState();
  const abilityStates = saveData.abilityStates || {};

  const handleUseAbility = (abilityId: string) => {
    const ability = abilities.find((a) => a.id === abilityId);
    const state = abilityStates[abilityId];

    if (!ability || !state) return;
    if (!canUseAbility(state)) return;

    // Use the ability (updates state)
    useAbilityAction(abilityId);

    // Trigger the effect in the parent component
    onUseAbility(abilityId, ability.effect);
  };

  // Filter to only unlocked abilities
  const unlockedAbilities = abilities.filter((ability) => {
    const state = abilityStates[ability.id];
    return state?.isUnlocked;
  });

  if (unlockedAbilities.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        padding: '10px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        marginTop: '15px',
      }}
    >
      <span style={{ color: '#888', fontSize: '12px', alignSelf: 'center', marginRight: '5px' }}>
        Abilities:
      </span>
      {unlockedAbilities.map((ability) => {
        const state = abilityStates[ability.id];
        const canUse = canUseAbility(state);
        const isOnCooldown = state.currentCooldown > 0;

        return (
          <button
            key={ability.id}
            onClick={() => handleUseAbility(ability.id)}
            disabled={!canUse}
            title={`${ability.name}: ${ability.description}${isOnCooldown ? ` (${state.currentCooldown} turns)` : ''}`}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '10px',
              border: 'none',
              background: canUse
                ? `linear-gradient(135deg, ${getAbilityColor(ability.effect)}, ${getAbilityColorDark(ability.effect)})`
                : 'rgba(100, 100, 100, 0.5)',
              color: 'white',
              fontSize: '24px',
              cursor: canUse ? 'pointer' : 'not-allowed',
              position: 'relative',
              transition: 'all 0.2s',
              opacity: canUse ? 1 : 0.5,
            }}
          >
            <span>{ability.icon}</span>

            {/* Cooldown overlay */}
            {isOnCooldown && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {state.currentCooldown}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function getAbilityColor(effect: AbilityEffect): string {
  switch (effect) {
    case 'fifty-fifty':
      return '#E91E63';
    case 'hint':
      return '#FFD700';
    case 'time-freeze':
      return '#2196F3';
    case 'skip':
      return '#9C27B0';
    case 'double-xp':
      return '#4CAF50';
    case 'second-chance':
      return '#FF9800';
    default:
      return '#607D8B';
  }
}

function getAbilityColorDark(effect: AbilityEffect): string {
  switch (effect) {
    case 'fifty-fifty':
      return '#AD1457';
    case 'hint':
      return '#F57C00';
    case 'time-freeze':
      return '#1565C0';
    case 'skip':
      return '#6A1B9A';
    case 'double-xp':
      return '#2E7D32';
    case 'second-chance':
      return '#E65100';
    default:
      return '#455A64';
  }
}
