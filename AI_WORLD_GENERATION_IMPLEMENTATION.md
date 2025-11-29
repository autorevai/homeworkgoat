# AI World Generation Implementation

**Date:** November 29, 2024  
**Feature:** Self-Evolving Educational Game Worlds Using AI

## Overview

This document describes the complete implementation of an AI-powered world generation system for Homework GOAT. The system uses OpenAI's GPT models to automatically create new worlds, quests, and questions that adapt to each student's learning progress, making the game truly self-evolving and educational.

---

## Table of Contents

1. [What Was Built](#what-was-built)
2. [Files Created/Modified](#files-createdmodified)
3. [How It Works](#how-it-works)
4. [API Key Setup](#api-key-setup)
5. [Usage Guide](#usage-guide)
6. [Cost Considerations](#cost-considerations)
7. [Security Notes](#security-notes)
8. [Future Improvements](#future-improvements)

---

## What Was Built

### Core Feature
An AI-powered world generator that:
- **Creates new worlds** with themes, descriptions, and unlock requirements
- **Generates quests** with NPCs, storylines, and XP rewards
- **Produces questions** that target weak skills while maintaining confidence with strong skills
- **Scales difficulty** based on player level and mastery (0-100%)
- **Adapts in real-time** as students get smarter

### Key Components

1. **`worldGenerator.ts`** - Main AI generation module
2. **`createPlayerProfileFromGameState()`** - Bridges adaptive learning system to AI
3. **Environment variable setup** - Secure API key management
4. **Vercel deployment guide** - Production setup instructions

---

## Files Created/Modified

### New Files

1. **`src/ai/worldGenerator.ts`** (261 lines)
   - Main AI world generation module
   - Exports `generateWorldForPlayer()` function
   - Exports `createPlayerProfileFromGameState()` helper
   - Uses OpenAI GPT-4.1-mini for cost-effective generation

2. **`.env.local`** (gitignored)
   - Stores API keys locally
   - Template created with placeholder values
   - **NEVER committed to git**

3. **`VERCEL_SETUP.md`**
   - Instructions for adding API keys to Vercel
   - Environment variable configuration guide

4. **`AI_WORLD_GENERATION_IMPLEMENTATION.md`** (this file)
   - Complete documentation of the implementation

### Modified Files

- **`.gitignore`** - Already had `.env*` patterns (no changes needed)

---

## How It Works

### Architecture Flow

```
Player Progress (SaveData + AdaptiveLearningState)
    ↓
createPlayerProfileFromGameState()
    ↓
PlayerProfile { level, XP, weakSkills, strongSkills, mastery }
    ↓
generateWorldForPlayer(profile)
    ↓
OpenAI API Call (GPT-4.1-mini)
    ↓
GeneratedWorldBundle { world, quests, questions }
    ↓
Game Integration (store in persistence, show in WorldSelector)
```

### Adaptive Learning Integration

The system reads from your existing adaptive learning engine:

1. **Weak Skills Detection**
   - Skills with mastery < 60% OR accuracy < 60%
   - AI focuses 60-70% of questions on these

2. **Strong Skills Detection**
   - Skills with mastery ≥ 75% OR accuracy ≥ 75%
   - AI uses 20-30% of questions here for confidence

3. **Difficulty Scaling**
   - **Easy mode**: Level 1-3 OR mastery < 60%
   - **Medium mode**: Level 4+ AND mastery > 60%
   - Questions get progressively harder as player improves

### AI Prompt Engineering

The system sends a carefully crafted prompt to OpenAI that includes:

- **Player constraints**: Grade, level, XP, mastery percentage
- **Skill targeting**: Weak skills (focus), strong skills (confidence)
- **Difficulty rules**: When to use easy vs medium
- **Content rules**: Age-appropriate (8-12), positive, educational
- **JSON schema**: Strict format matching your TypeScript types

### Cost Optimization

- Uses **GPT-4.1-mini** (cheapest model)
- Limits to **900 tokens** per generation
- Generates **1 world + 2-3 quests + 8-12 questions** per call
- Estimated cost: **~$0.001-0.002 per generation**

---

## API Key Setup

### Local Development

1. **Create `.env.local`** in project root:
   ```bash
   VITE_OPENAI_API_KEY=your_openai_key_here
   VITE_ANTHROPIC_API_KEY=your_anthropic_key_here
   ```

2. **Rotate your keys** (if you shared them in chat):
   - OpenAI: https://platform.openai.com/api-keys
   - Anthropic: https://console.anthropic.com/settings/keys

3. **Verify gitignore**:
   ```bash
   git check-ignore .env.local
   # Should output: .env.local
   ```

### Vercel Production

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `VITE_OPENAI_API_KEY` = your key
   - `VITE_ANTHROPIC_API_KEY` = your key
3. Select environments: Production, Preview, Development
4. Redeploy your app

**See `VERCEL_SETUP.md` for detailed instructions.**

---

## Usage Guide

### Basic Usage

```typescript
import { 
  generateWorldForPlayer, 
  createPlayerProfileFromGameState 
} from './ai/worldGenerator';
import { useGameState } from './hooks/useGameState';
import type { AdaptiveLearningState } from './learning/adaptiveLearning';

// In your component
const { saveData } = useGameState();
const adaptiveState: AdaptiveLearningState = /* get from your state */;

// Create profile from game state
const profile = createPlayerProfileFromGameState(saveData, adaptiveState);

// Generate new world
try {
  const bundle = await generateWorldForPlayer(profile);
  
  // bundle.world - ready to add to worldDefinitions
  // bundle.quests - ready to add to quests array
  // bundle.questions - ready to add to questionBank
  
  console.log('Generated:', bundle);
} catch (error) {
  console.error('Generation failed:', error);
}
```

### Integration Points

1. **World Selector UI**
   - Add "Generate AI World" button
   - Call `generateWorldForPlayer()` on click
   - Show loading state during generation
   - Add generated world to `worldDefinitions.ts` or store in Firestore

2. **Persistence Layer**
   - Store generated worlds in Firestore
   - Link to player's save data
   - Track which worlds are AI-generated vs hand-crafted

3. **Adaptive Learning Hook**
   - Connect `AdaptiveLearningState` to world generator
   - Trigger generation when player hits milestones
   - Pre-generate next 2-3 worlds to reduce latency

### Example: Generate World on Milestone

```typescript
// When player completes a world
async function onWorldComplete(worldId: string) {
  const { saveData } = useGameState();
  const adaptiveState = getAdaptiveState(); // your function
  
  // Generate next world
  const profile = createPlayerProfileFromGameState(saveData, adaptiveState);
  const bundle = await generateWorldForPlayer(profile);
  
  // Store in Firestore or add to local world list
  await saveGeneratedWorld(bundle);
  
  // Show in WorldSelector
  showNewWorld(bundle.world);
}
```

---

## Cost Considerations

### Per-Player Cost Estimates

- **One generation**: ~$0.001-0.002 (1-2 cents)
- **Per week** (if generating 2-3 worlds): ~$0.003-0.006
- **Per month**: ~$0.01-0.02 per active player

### Cost Control Strategies

1. **Batch Generation**: Generate 2-3 worlds at once when player hits milestones
2. **Caching**: Store generated worlds, reuse for similar player profiles
3. **Rate Limiting**: Max 5 generations per player per week
4. **Fallback**: Use pre-built worlds if generation fails or hits limit

### Monitoring

Track usage in your analytics:
- Number of generations per player
- Total API calls per day
- Cost per active user

---

## Security Notes

### Current Implementation (Client-Side)

⚠️ **For prototyping only**: The current code calls OpenAI directly from the browser using `VITE_OPENAI_API_KEY`.

**Risks:**
- API key exposed in client bundle (even if env var)
- Users could extract key from browser dev tools
- No server-side validation

### Production Recommendation

**Move LLM calls to a backend:**

1. Create Vercel serverless function: `/api/generate-world.ts`
2. Store API keys in Vercel env vars (server-side only)
3. Client calls your API endpoint, not OpenAI directly
4. Add rate limiting, validation, error handling

**Example backend structure:**
```
/api/
  generate-world.ts  # Serverless function
  validate-profile.ts  # Input validation
```

---

## Type Definitions

### PlayerProfile

```typescript
interface PlayerProfile {
  level: number;
  totalXp: number;
  grade: number;
  weakSkills: QuestionSkill[];
  strongSkills: QuestionSkill[];
  preferredThemes?: WorldTheme[];
  averageMastery?: number; // 0-100
}
```

### GeneratedWorldBundle

```typescript
interface GeneratedWorldBundle {
  world: World;        // Matches your World type
  quests: Quest[];    // Matches your Quest type
  questions: Question[]; // Matches your Question type
}
```

---

## Error Handling

The system includes error handling for:

- **Missing API key**: Clear error message
- **API failures**: Network errors, rate limits
- **Invalid JSON**: Parsing errors from LLM
- **Type mismatches**: Validation before returning

**Example error handling:**
```typescript
try {
  const bundle = await generateWorldForPlayer(profile);
} catch (error) {
  if (error.message.includes('VITE_OPENAI_API_KEY')) {
    // Show: "API key not configured"
  } else if (error.message.includes('OpenAI API error')) {
    // Show: "Generation failed, please try again"
  } else {
    // Show: "Something went wrong"
  }
}
```

---

## Future Improvements

### Short Term

1. **Backend API Route**: Move LLM calls to serverless function
2. **Caching Layer**: Store generated worlds, avoid regenerating similar content
3. **UI Integration**: Add "Generate World" button to WorldSelector
4. **Progress Tracking**: Show generation progress, loading states

### Medium Term

1. **Multi-Model Support**: Use Claude for narrative, GPT for math questions
2. **Question Validation**: Verify math correctness before adding to bank
3. **Difficulty Tuning**: A/B test different difficulty curves
4. **Player Feedback**: Let players rate AI-generated content

### Long Term

1. **Fully Procedural**: Generate infinite worlds on-demand
2. **Collaborative Learning**: Worlds adapt based on all players' performance
3. **Teacher Dashboard**: Review and approve AI-generated content
4. **Custom Themes**: Let players request specific world themes

---

## Testing

### Manual Testing

1. **Test with different player profiles:**
   ```typescript
   // New player (no skills)
   const newPlayer = { level: 1, totalXp: 0, grade: 3, ... };
   
   // Advanced player
   const advancedPlayer = { level: 10, totalXp: 5000, grade: 5, ... };
   ```

2. **Verify output structure:**
   - World has all required fields
   - Quests reference correct question IDs
   - Questions have valid math (test a few manually)

3. **Check difficulty scaling:**
   - Low level → mostly easy questions
   - High level + high mastery → medium questions

### Automated Testing (Future)

- Unit tests for `createPlayerProfileFromGameState()`
- Integration tests for API calls (mock OpenAI)
- Validation tests for generated content structure

---

## Troubleshooting

### "VITE_OPENAI_API_KEY is not set"

**Solution:** Add key to `.env.local` and restart dev server

### "OpenAI API error: 401"

**Solution:** Invalid API key - check it's correct and not expired

### "OpenAI API error: 429"

**Solution:** Rate limit hit - add retry logic or reduce generation frequency

### Generated content is invalid

**Solution:** 
- Check prompt is being sent correctly
- Verify JSON schema in prompt matches your types
- Add more validation in `worldGenerator.ts`

---

## Summary

This implementation provides a complete AI-powered world generation system that:

✅ Adapts to each student's learning progress  
✅ Scales difficulty as students improve  
✅ Focuses on weak skills while maintaining confidence  
✅ Uses cost-effective AI models  
✅ Integrates with existing adaptive learning system  
✅ Includes security best practices  
✅ Has clear documentation and usage examples  

The system is ready for integration into your game UI and can be extended with backend API routes for production use.

---

## Questions or Issues?

If you encounter any problems or have questions about this implementation, check:

1. API key setup (`.env.local` or Vercel)
2. Error messages in console
3. Network tab for API call details
4. This documentation

For production deployment, prioritize moving LLM calls to a backend API route.

