/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit, UserProfile, Achievement, Category } from './types';
import { DEFAULT_ACHIEVEMENTS, playChime } from './constants';

import IconComponent from './components/IconComponent';
import Onboarding from './components/Onboarding';
import HabitForm from './components/HabitForm';
import Dashboard from './components/Dashboard';
import ProgressDashboard from './components/ProgressDashboard';
import Rewards from './components/Rewards';
import Settings from './components/Settings';

// Helper to count streak consecutive days
const countStreak = (history: { [dateStr: string]: boolean }) => {
  let streak = 0;
  const todayStr = new Date().toISOString().split('T')[0];
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const startFromToday = !!history[todayStr];
  const startFromYesterday = !startFromToday && !!history[yesterdayStr];

  if (!startFromToday && !startFromYesterday) {
    // Current streak is indeed 0
  } else {
    // Count reverse chronological order
    const checkDate = startFromToday ? new Date() : yesterday;
    while (true) {
      const key = checkDate.toISOString().split('T')[0];
      if (history[key]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Best streak all-time
  const sortedDates = Object.keys(history)
    .filter((k) => history[k])
    .map((k) => new Date(k + 'T00:00:00').getTime())
    .sort((a, b) => a - b);
  
  let best = 0;
  let running = 0;
  let lastTime: number | null = null;
  const ONE_DAY = 24 * 60 * 60 * 1000;

  sortedDates.forEach((time) => {
    if (lastTime === null) {
      running = 1;
    } else {
      const diff = time - lastTime;
      // Accounting for daylight savings or small time variance
      if (diff >= ONE_DAY - 3600000 && diff <= ONE_DAY + 3600000) {
        running++;
      } else if (diff > ONE_DAY + 3600000) {
        running = 1;
      }
    }
    best = Math.max(best, running);
    lastTime = time;
  });

  best = Math.max(best, streak);

  return { current: streak, best };
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'progress' | 'rewards' | 'settings'>('today');
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // Forms handles
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

  // Celebration banners
  const [celebrationBadge, setCelebrationBadge] = useState<Achievement | null>(null);
  const [levelUpCelebration, setLevelUpCelebration] = useState<{ old: number; new: number } | null>(null);

  // Load state on startup
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    setSelectedDate(todayStr);

    try {
      const savedProfile = localStorage.getItem('student_habit_profile');
      const savedHabits = localStorage.getItem('student_habit_list');
      const savedAchievements = localStorage.getItem('student_habit_achievements');
      const savedDark = localStorage.getItem('student_habit_dark');

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      }
      if (savedDark) {
        setDarkMode(JSON.parse(savedDark));
      }
    } catch (e) {
      console.error('Failed to parse localStorage settings:', e);
    }
  }, []);

  // Save to locale storage on alterations
  useEffect(() => {
    if (profile) {
      localStorage.setItem('student_habit_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('student_habit_list', JSON.stringify(habits));
    }
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('student_habit_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('student_habit_dark', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Seed default student routine
  const handleAddDefaultRoutine = () => {
    const defaultRoutine: Habit[] = [
      {
        id: 'def-1',
        name: 'Review class formulas & notes (30m)',
        category: 'Study',
        frequency: 'daily',
        reminderTime: '16:00',
        createdAt: new Date().toISOString(),
        history: {},
        streak: 0,
        bestStreak: 0,
        color: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
      },
      {
        id: 'def-2',
        name: 'Daily physical stretch or workout',
        category: 'Exercise',
        frequency: 'daily',
        reminderTime: '07:30',
        createdAt: new Date().toISOString(),
        history: {},
        streak: 0,
        bestStreak: 0,
        color: 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500',
      },
      {
        id: 'def-3',
        name: 'Drink 6 glasses of clear water',
        category: 'Water Intake',
        frequency: 'daily',
        reminderTime: '12:00',
        createdAt: new Date().toISOString(),
        history: {},
        streak: 0,
        bestStreak: 0,
        color: 'bg-sky-500 hover:bg-sky-600 focus:ring-sky-500',
      },
      {
        id: 'def-4',
        name: 'Consistently rest 8 full hours',
        category: 'Sleep',
        frequency: 'daily',
        reminderTime: '22:30',
        createdAt: new Date().toISOString(),
        history: {},
        streak: 0,
        bestStreak: 0,
        color: 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500',
      },
      {
        id: 'def-5',
        name: 'Write down 3 daily gratitudes',
        category: 'Journaling',
        frequency: 'daily',
        reminderTime: '21:30',
        createdAt: new Date().toISOString(),
        history: {},
        streak: 0,
        bestStreak: 0,
        color: 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-500',
      },
    ];

    setHabits(defaultRoutine);
    playChime('levelUp');
    checkGamifiedMetrics(defaultRoutine, achievements, profile);
  };

  // Complete onboarding profile creation
  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    
    // Seed initial focus area goals as simple starter habits
    const initialSeed: Habit[] = newProfile.selectedCategories.map((cat, idx) => {
      let name = `Perform customized ${cat}`;
      let alarm = '08:00';
      
      switch (cat) {
        case 'Study':
          name = 'Focus study block (Pomodoro 25m)';
          alarm = '16:30';
          break;
        case 'Exercise':
          name = 'Complete morning workout routine';
          alarm = '07:00';
          break;
        case 'Water Intake':
          name = 'Hydrate full student water bottle';
          alarm = '10:00';
          break;
        case 'Sleep':
          name = 'Wind down tech & sleep 8 hours';
          alarm = '22:15';
          break;
        case 'Reading':
          name = 'Read 10 pages of selected book';
          alarm = '20:30';
          break;
        case 'Journaling':
          name = 'Reflect on student daily summary log';
          alarm = '21:45';
          break;
      }

      return {
        id: `seed-${idx}`,
        name,
        category: cat,
        frequency: 'daily',
        reminderTime: alarm,
        createdAt: new Date().toISOString(),
        history: {},
        streak: 0,
        bestStreak: 0,
        color: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
      };
    });

    setHabits(initialSeed);
    checkGamifiedMetrics(initialSeed, achievements, newProfile);
  };

  // Safe level calculation logic
  const calculateLevelForXp = (xpPoints: number) => {
    // Cumulative sums required:
    // lvl 1: 0 - 99 XP
    // lvl 2: 100 - 299 XP (requires +100 to level up)
    // lvl 3: 300 - 599 XP (requires +200 to level up)
    // lvl 4: 600 - 999 XP (requires +300 to level up)
    // Formula for cumulative threshold level-up: sum_{i=1}^{L-1}(i * 100)
    let tempLevel = 1;
    let requiredSum = 0;
    while (true) {
      requiredSum += tempLevel * 100;
      if (xpPoints >= requiredSum) {
        tempLevel++;
      } else {
        break;
      }
    }
    return tempLevel;
  };

  // Main habit completion check logger
  const handleToggleHabit = (habitId: string) => {
    if (!profile) return;

    let xpDelta = 0;

    const updatedHabits = habits.map((h) => {
      if (h.id === habitId) {
        const wasCompleted = !!h.history[selectedDate];
        const nextHistory = { ...h.history, [selectedDate]: !wasCompleted };
        
        // Recalculate streaks dynamically
        const { current, best } = countStreak(nextHistory);

        xpDelta = !wasCompleted ? 10 : -10; // grant 10 XP on completion, deduct 10 on reversal

        return {
          ...h,
          history: nextHistory,
          streak: current,
          bestStreak: best,
        };
      }
      return h;
    });

    setHabits(updatedHabits);

    if (xpDelta > 0 && profile.soundEnabled) {
      playChime('complete');
    } else {
      playChime('click');
    }

    // Update user profile XP and Level
    const nextXp = Math.max(0, profile.xp + xpDelta);
    const nextLevel = calculateLevelForXp(nextXp);

    const updatedProfile: UserProfile = {
      ...profile,
      xp: nextXp,
      level: nextLevel,
    };

    if (nextLevel > profile.level) {
      if (profile.soundEnabled) {
        playChime('levelUp');
      }
      setLevelUpCelebration({ old: profile.level, new: nextLevel });
    }

    setProfile(updatedProfile);

    // Verify gamification rewards metrics
    checkGamifiedMetrics(updatedHabits, achievements, updatedProfile);
  };

  // Central Verification for locked achievement progress
  const checkGamifiedMetrics = (
    currentList: Habit[],
    currentAchievements: Achievement[],
    currentProfile: UserProfile
  ) => {
    // Total completions count
    const totalCompletions = currentList.reduce((sum, h) => {
      const counts = Object.values(h.history).filter(Boolean).length;
      return sum + counts;
    }, 0);

    // Max streak of any individual habit
    const maxHabitStreak = currentList.reduce((max, h) => Math.max(max, h.streak), 0);
    
    // Created list length
    const totalCreated = currentList.length;

    // Explored categories count
    const uniqueExploredCategories = new Set(currentList.map((h) => h.category)).size;

    let grantedBonusXp = 0;
    let newlyUnlockedBadge: Achievement | null = null;

    const nextAchievements = currentAchievements.map((ach) => {
      if (ach.unlocked) return ach;

      let currentVal = 0;
      switch (ach.metric) {
        case 'total_habits_completed':
          currentVal = totalCompletions;
          break;
        case 'streak_reached':
          currentVal = maxHabitStreak;
          break;
        case 'habits_created':
          currentVal = totalCreated;
          break;
        case 'categories_explored':
          currentVal = uniqueExploredCategories;
          break;
      }

      if (currentVal >= ach.targetValue) {
        grantedBonusXp += ach.xpReward;
        newlyUnlockedBadge = {
          ...ach,
          unlocked: true,
          unlockedAt: new Date().toISOString().split('T')[0],
        };
        return newlyUnlockedBadge;
      }

      return ach;
    });

    if (newlyUnlockedBadge) {
      setAchievements(nextAchievements);

      // Add XP bonus to profile
      const finalXp = currentProfile.xp + grantedBonusXp;
      const finalLevel = calculateLevelForXp(finalXp);

      setProfile({
        ...currentProfile,
        xp: finalXp,
        level: finalLevel,
      });

      if (currentProfile.soundEnabled) {
        playChime('badge');
      }
      setCelebrationBadge(newlyUnlockedBadge);

      if (finalLevel > currentProfile.level) {
        setLevelUpCelebration({ old: currentProfile.level, new: finalLevel });
      }
    } else {
      // Just save standard achievements state mapping
      setAchievements(nextAchievements);
    }
  };

  // Create or save edited habit inputs
  const handleSaveHabit = (data: {
    name: string;
    category: Category;
    frequency: 'daily' | 'weekly' | 'custom';
    daysOfWeek?: number[];
    reminderTime: string;
    color: string;
  }) => {
    const updated = [...habits];

    if (habitToEdit) {
      // Edit mode
      const idx = updated.findIndex((h) => h.id === habitToEdit.id);
      if (idx !== -1) {
        updated[idx] = {
          ...updated[idx],
          name: data.name,
          category: data.category,
          frequency: data.frequency,
          daysOfWeek: data.daysOfWeek,
          reminderTime: data.reminderTime,
          color: data.color,
        };
      }
      playChime('complete');
    } else {
      // Add mode
      const newHabit: Habit = {
        id: `custom-${Date.now()}`,
        name: data.name,
        category: data.category,
        frequency: data.frequency,
        daysOfWeek: data.daysOfWeek,
        reminderTime: data.reminderTime,
        createdAt: new Date().toISOString(),
        history: {},
        streak: 0,
        bestStreak: 0,
        color: data.color,
      };
      updated.push(newHabit);
      playChime('levelUp');
    }

    setHabits(updated);
    setHabitToEdit(null);
    setIsFormOpen(false);

    if (profile) {
      checkGamifiedMetrics(updated, achievements, profile);
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    const updated = habits.filter((h) => h.id !== habitId);
    setHabits(updated);
    playChime('click');
    if (profile) {
      checkGamifiedMetrics(updated, achievements, profile);
    }
  };

  // Reset Progress entirely
  const handleResetProgress = () => {
    setProfile(null);
    setHabits([]);
    setAchievements(DEFAULT_ACHIEVEMENTS);
    setActiveTab('today');
    localStorage.removeItem('student_habit_profile');
    localStorage.removeItem('student_habit_list');
    localStorage.removeItem('student_habit_achievements');
  };

  // Onboarding guard: Show onboarding if not finished
  if (!profile || !profile.isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-violet-500/10 select-none pb-20 md:pb-0 md:pl-64">
      
      {/* Lateral Sidebar (Desktop Screen Sizes) */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-150 dark:border-slate-800/80 p-5 hidden md:flex flex-col z-20">
        <div className="flex items-center gap-2.5 px-2 py-3.5 mb-6">
          <div className="w-9 h-9 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm">
            <IconComponent name="Flame" size={20} className="animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-tight">
              Aura Habits
            </h1>
            <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold block uppercase tracking-wider">
              Student Track
            </span>
          </div>
        </div>

        {/* Sidebar Nav Buttons */}
        <nav className="space-y-1.5 flex-1">
          {[
            { id: 'today', icon: 'CheckCircle2', label: "Today's Routine" },
            { id: 'progress', icon: 'Calendar', label: 'Progress Analytics' },
            { id: 'rewards', icon: 'Trophy', label: 'Trophy Cabinet' },
            { id: 'settings', icon: 'Settings', label: 'App Settings' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`sidebar-tab-${tab.id}`}
                onClick={() => {
                  playChime('click');
                  setActiveTab(tab.id as any);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/45 dark:text-violet-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50/80 dark:hover:bg-slate-900/40 hover:text-slate-900'
                }`}
              >
                <IconComponent name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Floating Quick Add Button */}
        <button
          id="sidebar-add-btn"
          onClick={() => {
            playChime('click');
            setHabitToEdit(null);
            setIsFormOpen(true);
          }}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 shadow-md shadow-indigo-100 dark:shadow-none cursor-pointer mt-auto"
        >
          <IconComponent name="Plus" size={14} />
          <span>New Custom Habit</span>
        </button>
      </aside>

      {/* Main Panel Content Wrapper */}
      <main className="w-full max-w-2xl mx-auto px-4 py-6 md:py-10 space-y-6 flex-1 flex flex-col">
        
        {/* Profile Header Block */}
        <header className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-violet-600 dark:text-violet-400 font-mono tracking-widest pl-0.5">
              Grade & Energy Optimization
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeTab === 'today' && "Student Dashboard"}
              {activeTab === 'progress' && "Routine Analytics"}
              {activeTab === 'rewards' && "Trophy Hall"}
              {activeTab === 'settings' && "App Settings"}
            </h2>
          </div>

          {/* Mini level circle indicators for non-rewards tabs */}
          {activeTab !== 'rewards' && (
            <button
              id="header-profile-btn"
              onClick={() => {
                playChime('click');
                setActiveTab('rewards');
              }}
              className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-1.5 pr-3 rounded-xl text-left cursor-pointer hover:bg-slate-50 transition-all shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center">
                {profile.level}
              </div>
              <div className="hidden sm:block text-[10px] leading-snug">
                <span className="font-extrabold text-slate-850 dark:text-slate-200 block">Class Level</span>
                <span className="text-slate-400 font-mono">{profile.xp} XP total</span>
              </div>
            </button>
          )}
        </header>

        {/* Primary View Route Switcher */}
        <div className="flex-1">
          {activeTab === 'today' && (
            <Dashboard
              habits={habits}
              profile={profile}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onToggleHabit={handleToggleHabit}
              onEditHabit={(habit) => {
                setHabitToEdit(habit);
                setIsFormOpen(true);
              }}
              onDeleteHabit={handleDeleteHabit}
              onAddHabitClick={() => {
                setHabitToEdit(null);
                setIsFormOpen(true);
              }}
              onAddDefaultRoutine={handleAddDefaultRoutine}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressDashboard
              habits={habits}
              profile={profile}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          )}

          {activeTab === 'rewards' && <Rewards achievements={achievements} profile={profile} />}

          {activeTab === 'settings' && (
            <Settings
              profile={profile}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              onUpdateProfile={setProfile}
              onResetProgress={handleResetProgress}
            />
          )}
        </div>

      </main>

      {/* Mobile Foot Nav Ribbon Tab-links (Phone Screens Only) */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-150 dark:border-slate-800/80 p-2.5 flex justify-around md:hidden z-30">
        {[
          { id: 'today', icon: 'CheckCircle2', label: 'Today' },
          { id: 'progress', icon: 'Calendar', label: 'Progress' },
          { id: 'add', icon: 'PlusCircle', label: 'Add', action: true },
          { id: 'rewards', icon: 'Trophy', label: 'Trophies' },
          { id: 'settings', icon: 'Settings', label: 'Settings' },
        ].map((item) => {
          if (item.action) {
            return (
              <button
                key={item.id}
                id="mobile-nav-add-btn"
                onClick={() => {
                  playChime('click');
                  setHabitToEdit(null);
                  setIsFormOpen(true);
                }}
                className="w-11 h-11 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
              >
                <IconComponent name="Plus" size={20} />
              </button>
            );
          }

          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => {
                playChime('click');
                setActiveTab(item.id as any);
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <IconComponent name={item.icon} size={18} />
              <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Custom Customization Form Modal (Floating Dialog Overlay) */}
      <AnimatePresence>
        {isFormOpen && (
          <HabitForm
            habitToEdit={habitToEdit}
            onSave={handleSaveHabit}
            onCancel={() => {
              setHabitToEdit(null);
              setIsFormOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Gamification Popups Celebrations */}
      <AnimatePresence>
        
        {/* Banner Award Unlock modal celebration */}
        {celebrationBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-amber-200 dark:border-amber-900/50 max-w-sm w-full text-center space-y-4 shadow-2xl relative overflow-hidden"
            >
              {/* Confetti decoration */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-50/20 via-transparent to-indigo-50/10 pointer-events-none" />

              <div className="relative space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                  <IconComponent name={celebrationBadge.iconName} size={32} />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
                    Badge Earned!
                  </span>
                  <h3 className="text-xl font-black text-slate-850 dark:text-white">
                    {celebrationBadge.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    "{celebrationBadge.description}"
                  </p>
                </div>

                <div className="inline-block bg-amber-100 text-amber-850 dark:bg-amber-950/30 dark:text-amber-300 font-mono font-bold text-xs px-3.5 py-1.5 rounded-xl">
                  + {celebrationBadge.xpReward} XP Milestone Reward Claimed!
                </div>

                <button
                  id="claim-badge-btn"
                  onClick={() => {
                    playChime('complete');
                    setCelebrationBadge(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs hover:opacity-95 shadow-lg shadow-indigo-150 dark:shadow-none cursor-pointer"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Level Up alert celebration modal */}
        {levelUpCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-3xl p-6 border border-indigo-500/30 max-w-sm w-full text-center space-y-4 shadow-2xl relative overflow-hidden text-white"
            >
              <div className="relative space-y-4">
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner animate-pulse">
                  <IconComponent name="Zap" size={32} />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                    Academic Growth Boost!
                  </span>
                  <h3 className="text-2xl font-black">
                    Level Up achieved!
                  </h3>
                  <p className="text-xs text-indigo-200">
                    You advanced from Class Level {levelUpCelebration.old} to <strong className="text-amber-400">Level {levelUpCelebration.new}</strong>!
                  </p>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed italic px-2">
                  "Your constant focus is expanding your cognitive fuel. Keep ticking off routines to rise up the scholar ladder!"
                </p>

                <button
                  id="claim-level-btn"
                  onClick={() => {
                    playChime('click');
                    setLevelUpCelebration(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:opacity-95 shadow-lg cursor-pointer"
                >
                  Continue Journey
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
