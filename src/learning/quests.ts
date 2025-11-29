/**
 * Quest Definitions
 * Contains all available quests in the game.
 */

import type { Quest } from './types';

export const quests: Quest[] = [
  {
    id: 'quest-power-crystals',
    title: 'Fix the Power Crystals',
    description: 'Help Professor Pixel restore power to the school by solving math challenges!',
    npcName: 'Professor Pixel',
    npcIntro: `Oh thank goodness you're here, young hero!

The school's Power Crystals have gone haywire! They run on mathematical energy, and I need someone clever to recalibrate them.

Each crystal needs a specific number to power it up. Get the answers right, and we'll restore power to the whole school!

Are you ready to help?`,
    questionIds: ['add-001', 'mult-001', 'sub-003', 'word-002'],
    rewardXp: 100,
    completionMessage: `AMAZING! You did it!

All the Power Crystals are glowing bright again! The school has power once more, all thanks to your math skills!

You've earned 100 XP and proven yourself a true Math Hero!`,
  },
  {
    id: 'quest-treasure-hunt',
    title: 'The Number Treasure Hunt',
    description: 'Decode the treasure map by solving tricky math puzzles!',
    npcName: 'Captain Calculator',
    npcIntro: `Ahoy there, matey!

I've found an ancient treasure map, but the directions are all in math riddles! My old brain can't figure them out anymore.

Help me decode these number puzzles, and I'll share the treasure with you!

What do you say, ready to hunt for treasure?`,
    questionIds: ['add-002', 'sub-001', 'mult-003', 'div-002', 'word-001'],
    rewardXp: 150,
    completionMessage: `Shiver me timbers! You cracked the code!

The treasure is ours! Well, mostly yours - you did all the hard work!

You've earned 150 XP and the title of Master Decoder!`,
  },
];

/**
 * Get a quest by its ID
 */
export function getQuestById(id: string): Quest | undefined {
  return quests.find((q) => q.id === id);
}

/**
 * Get all available quests
 */
export function getAllQuests(): Quest[] {
  return quests;
}

/**
 * Get quests that haven't been completed yet
 */
export function getIncompleteQuests(completedQuestIds: string[]): Quest[] {
  return quests.filter((q) => !completedQuestIds.includes(q.id));
}
