/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category =
  | 'Study'
  | 'Exercise'
  | 'Reading'
  | 'Water Intake'
  | 'Sleep'
  | 'Prayer'
  | 'Journaling'
  | 'Custom';

export type Frequency = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  name: string;
  category: Category;
  frequency: Frequency;
  daysOfWeek?: number[]; // [0, 1, 2, 3, 4, 5, 6] (0 = Sunday, etc.) if frequency is custom/specific
  reminderTime: string; // "HH:MM"
  createdAt: string; // ISO date string
  history: { [dateStr: string]: boolean }; // YYYY-MM-DD -> completed (true)
  streak: number; // current consecutive days
  bestStreak: number; // historical best streak
  color: string; // tailwind color class prefix or hex
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  iconName: string; // Lucide icon identifier
  metric: 'total_habits_completed' | 'streak_reached' | 'habits_created' | 'categories_explored';
  targetValue: number;
}

export interface UserProfile {
  xp: number;
  level: number;
  isOnboarded: boolean;
  selectedCategories: Category[];
  dailyXpGoal: number; // e.g. 50 XP
  notificationConsent: boolean;
  soundEnabled: boolean;
  streakDays: number; // total overall app daily log-in streak
  lastActiveDate?: string; // YYYY-MM-DD of last log-in or interaction
}
