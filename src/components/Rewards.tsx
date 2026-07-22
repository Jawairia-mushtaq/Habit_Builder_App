/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Achievement, UserProfile } from '../types';
import IconComponent from './IconComponent';

interface RewardsProps {
  achievements: Achievement[];
  profile: UserProfile;
}

// Student level titles for teenagers
const LEVEL_TITLES: Record<number, string> = {
  1: 'Active Starter 🌟',
  2: 'Daily Seeder 🌱',
  3: 'Habit Disciple 📚',
  4: 'Streak Commando 🔥',
  5: 'Academic Overachiever 🎓',
  6: 'Zen Mind Scholar 🧘',
  7: 'Sovereign Ritual Master ⚡',
  8: 'The Ultimate Habit Guru 👑',
};

export default function Rewards({ achievements, profile }: RewardsProps) {
  // Level limits: level 1 needs 100XP, level 2 needs 200XP, level X needs X*100 XP
  // Total XP needed for current level:
  const getXpThresholdForNextLevel = (lvl: number) => lvl * 100;
  
  const xpNeeded = getXpThresholdForNextLevel(profile.level);
  
  // Calculate relative progress in level
  // Lets keep it easy for demonstration:
  // e.g. xp in level = total accumulated xp of level minus previous level sums
  // A simpler way: user's relative XP in current level is (profile.xp % previous levels)
  // Let's model XP as cumulative. For level L, previous cumulative threshold is sum_1^(L-1)(i*100)
  const getCumulativeXpNeeded = (lvl: number) => {
    let sum = 0;
    for (let i = 1; i < lvl; i++) {
      sum += i * 100;
    }
    return sum;
  };

  const currentLevelFloor = getCumulativeXpNeeded(profile.level);
  const nextLevelCeil = currentLevelFloor + xpNeeded;
  
  const relativeXpInLevel = Math.max(0, profile.xp - currentLevelFloor);
  const xpProgressPercent = Math.min(100, Math.round((relativeXpInLevel / xpNeeded) * 100));

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      
      {/* XP & Current Level card */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-650 p-6 rounded-3xl text-white shadow-lg overflow-hidden relative">
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="absolute top-2 right-4 text-xs font-bold bg-white/25 text-white/90 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wide">
          Gamified Path
        </div>

        <div className="flex gap-5 items-center">
          {/* Level Circle Frame */}
          <div className="w-18 h-18 rounded-2xl bg-white/10 flex flex-col items-center justify-center border border-white/20 relative shadow-inner">
            <span className="text-[10px] text-violet-200 font-bold uppercase tracking-wider">Lvl</span>
            <span className="text-3xl font-extrabold tracking-tight">{profile.level}</span>
          </div>

          <div className="flex-1 space-y-1.5">
            <span className="text-[10px] font-bold text-violet-200 tracking-widest uppercase">
              Current Student Title
            </span>
            <h3 className="text-lg font-black tracking-tight drop-shadow-xs">
              {LEVEL_TITLES[profile.level] || 'Elite Scholar 🌟'}
            </h3>
            
            {/* XP Bar */}
            <div className="space-y-1 pt-1.5">
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${xpProgressPercent}%` }}
                  className="bg-gradient-to-r from-amber-400 to-orange-400 h-full rounded-full"
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono font-bold text-violet-100">
                <span>{relativeXpInLevel} / {xpNeeded} XP for next level</span>
                <span>{xpProgressPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats of Accomplishments */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-xl flex items-center justify-center">
            <IconComponent name="Award" size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Achievement Badges</h4>
            <p className="text-[10px] text-slate-450 dark:text-slate-400">Unlock milestones to earn massive XP buffs</p>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
          <span>{unlockedCount}</span>
          <span className="opacity-40 select-none">/</span>
          <span>{totalCount} Unlocked</span>
        </div>
      </div>

      {/* Unlocked Badges (The Trophy Case) */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-850 dark:text-white text-sm">Your Trophy Drawer</h3>

        <div className="grid grid-cols-2 gap-3.5">
          {achievements.map((item) => {
            const isUnlocked = item.unlocked;

            return (
              <div
                key={item.id}
                id={`achievement-card-${item.id}`}
                className={`border rounded-2xl p-4 flex flex-col items-center text-center relative transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-white to-amber-50/20 border-amber-200/60 dark:from-slate-900 dark:to-slate-850 dark:border-amber-900/40 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-60'
                }`}
              >
                {/* Badge Icon Decorator */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                    isUnlocked
                      ? 'bg-amber-100/80 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                  }`}
                >
                  <IconComponent name={item.iconName} size={24} />
                </div>

                {/* Achievement metadata */}
                <h4 className="text-xs font-extrabold text-slate-850 dark:text-white leading-tight">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-1 mb-2.5 max-w-[130px] line-clamp-2">
                  {item.description}
                </p>

                {/* Locked / Unlocked Flag */}
                <div className="mt-auto w-full pt-2 border-t border-slate-100 dark:border-slate-850 flex items-center justify-center">
                  {isUnlocked ? (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono">
                      + {item.xpReward} XP Earned
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-450 dark:text-slate-500 flex items-center gap-1">
                      <IconComponent name="Lock" size={10} />
                      <span>{item.targetValue} completions</span>
                    </span>
                  )}
                </div>

                {/* Floating unlocked tag decoration */}
                {isUnlocked && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white p-0.5 rounded-full shadow-xs">
                    <IconComponent name="Check" size={8} className="stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone Rewards description */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
        <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-1">
          <IconComponent name="Trophy" className="text-amber-500" size={14} />
          Upcoming Milestone Rewards
        </h4>
        <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-2 list-disc pl-4 leading-relaxed">
          <li><strong>Unlock 7-Day Warrior Badge</strong>: Earns you +250 XP instantly (perfect to fast-track Level 4).</li>
          <li><strong>Explore 4 focus categories</strong>: Completing habits in Study, Reading, Sleep, and Exercise grants you the <em>All-Rounder</em> badge.</li>
        </ul>
      </div>

    </div>
  );
}
