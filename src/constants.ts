/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, Achievement } from './types';

export const CATEGORY_DETAILS: Record<
  Category,
  {
    icon: string;
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    badgeBg: string;
    gradient: string;
  }
> = {
  Study: {
    icon: 'BookOpen',
    label: 'Study',
    bgClass: 'bg-blue-50 dark:bg-blue-950/30',
    textClass: 'text-blue-600 dark:text-blue-400',
    borderClass: 'border-blue-100 dark:border-blue-900/35',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
    gradient: 'from-blue-500 to-indigo-600',
  },
  Exercise: {
    icon: 'Dumbbell',
    label: 'Exercise',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/30',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    borderClass: 'border-emerald-100 dark:border-emerald-900/35',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
    gradient: 'from-emerald-500 to-teal-600',
  },
  Reading: {
    icon: 'Book',
    label: 'Reading',
    bgClass: 'bg-amber-50 dark:bg-amber-950/30',
    textClass: 'text-amber-600 dark:text-amber-400',
    borderClass: 'border-amber-100 dark:border-amber-900/35',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
    gradient: 'from-amber-500 to-orange-600',
  },
  'Water Intake': {
    icon: 'Droplet',
    label: 'Water Intake',
    bgClass: 'bg-sky-50 dark:bg-sky-950/30',
    textClass: 'text-sky-600 dark:text-sky-400',
    borderClass: 'border-sky-100 dark:border-sky-900/35',
    badgeBg: 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300',
    gradient: 'from-sky-500 to-blue-600',
  },
  Sleep: {
    icon: 'Moon',
    label: 'Sleep',
    bgClass: 'bg-indigo-50 dark:bg-indigo-950/30',
    textClass: 'text-indigo-600 dark:text-indigo-400',
    borderClass: 'border-indigo-100 dark:border-indigo-900/35',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300',
    gradient: 'from-indigo-500 to-purple-600',
  },
  Prayer: {
    icon: 'Sparkles',
    label: 'Prayer & Mindfulness',
    bgClass: 'bg-purple-50 dark:bg-purple-950/30',
    textClass: 'text-purple-600 dark:text-purple-400',
    borderClass: 'border-purple-100 dark:border-purple-900/35',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
    gradient: 'from-purple-500 to-pink-600',
  },
  Journaling: {
    icon: 'PenTool',
    label: 'Journaling',
    bgClass: 'bg-rose-50 dark:bg-rose-950/30',
    textClass: 'text-rose-600 dark:text-rose-400',
    borderClass: 'border-rose-100 dark:border-rose-900/35',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300',
    gradient: 'from-rose-500 to-pink-500',
  },
  Custom: {
    icon: 'Target',
    label: 'Custom Habit',
    bgClass: 'bg-slate-100 dark:bg-slate-800/50',
    textClass: 'text-slate-600 dark:text-slate-350',
    borderClass: 'border-slate-200 dark:border-slate-700',
    badgeBg: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    gradient: 'from-slate-600 to-slate-800',
  },
};

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first habit activity of the day!',
    unlocked: false,
    xpReward: 50,
    iconName: 'Award',
    metric: 'total_habits_completed',
    targetValue: 1,
  },
  {
    id: 'habit_builder',
    title: 'Habit Builder',
    description: 'Create at least 3 active habits in your list.',
    unlocked: false,
    xpReward: 100,
    iconName: 'PlusCircle',
    metric: 'habits_created',
    targetValue: 3,
  },
  {
    id: 'consistency_champ',
    title: 'Consistency Champ',
    description: 'Complete 10 habits in total.',
    unlocked: false,
    xpReward: 150,
    iconName: 'CheckCircle2',
    metric: 'total_habits_completed',
    targetValue: 10,
  },
  {
    id: 'relentless',
    title: 'Relentless Student',
    description: 'Complete 50 habit activities.',
    unlocked: false,
    xpReward: 500,
    iconName: 'Flame',
    metric: 'total_habits_completed',
    targetValue: 50,
  },
  {
    id: 'streak_novice',
    title: '3-Day Fire',
    description: 'Reach a habit streak of 3 consecutive days.',
    unlocked: false,
    xpReward: 100,
    iconName: 'Zap',
    metric: 'streak_reached',
    targetValue: 3,
  },
  {
    id: 'streak_master',
    title: '7-Day Warrior',
    description: 'Reach a habit streak of 7 consecutive days!',
    unlocked: false,
    xpReward: 250,
    iconName: 'TrendingUp',
    metric: 'streak_reached',
    targetValue: 7,
  },
  {
    id: 'versatile',
    title: 'All-Rounder',
    description: 'Track habits across 4 or more different categories.',
    unlocked: false,
    xpReward: 200,
    iconName: 'Layers',
    metric: 'categories_explored',
    targetValue: 4,
  },
];

// Play high-quality audio notifications/sounds using the safe Web Audio API (cross-browser)
export function playChime(type: 'complete' | 'levelUp' | 'click' | 'badge') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'complete') {
      // Elegant positive double-ping chord
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now); // E5
      osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6

      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } else if (type === 'levelUp') {
      // Arpeggio chime representing level-up victory
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5]; // C4 major scale notes plus higher octaves
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + idx * 0.08 + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } else if (type === 'badge') {
      // A dramatic double fanfare beep for badge unlocking
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sawtooth';
      
      // Filter out harsh highs for an elegant retro feel
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);

      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.setValueAtTime(554.37, now + 0.08); // C#5
      osc.frequency.setValueAtTime(659.25, now + 0.16); // E5
      osc.frequency.setValueAtTime(880, now + 0.24); // A5

      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.005, now + 0.65);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } else if (type === 'click') {
      // Simple organic soft tap
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch (err) {
    console.error('Audio initialization failed or blocked:', err);
  }
}
