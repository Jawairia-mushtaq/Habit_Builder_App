/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit, Category, UserProfile } from '../types';
import { CATEGORY_DETAILS, playChime } from '../constants';
import IconComponent from './IconComponent';

interface DashboardProps {
  habits: Habit[];
  profile: UserProfile;
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  onToggleHabit: (habitId: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onAddHabitClick: () => void;
  onAddDefaultRoutine: () => void;
}

const STUDY_TIPS = [
  "Take a 5-minute stretch for every 25 minutes of studying (Pomodoro rule!).",
  "Drinking space-pure water boosts exam-time memory and mental response by 14%.",
  "Reading non-textbook material for just 15 minutes a day lowers stress hormones.",
  "Sleep triggers neurological consolidation. Rest up to score higher!",
  "Tracking your progress boosts consistency by up to 3x. Keep those streaks alive!",
  "A clutter-free desk reduces ambient anxiety and improves academic output.",
  "Writing down three things you are grateful for today boosts long-term happiness.",
];

export default function Dashboard({
  habits,
  profile,
  selectedDate,
  onSelectDate,
  onToggleHabit,
  onEditHabit,
  onDeleteHabit,
  onAddHabitClick,
  onAddDefaultRoutine,
}: DashboardProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [catFilter, setCatFilter] = useState<Category | 'all'>('all');
  const [currentTipIdx, setCurrentTipIdx] = useState(0);

  // Parse local date label
  const getLocalDateLabel = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    if (dateStr === tomorrow) return 'Tomorrow';

    const parsed = new Date(dateStr + 'T00:00:00');
    return parsed.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Switch tips
  const nextTip = () => {
    playChime('click');
    setCurrentTipIdx((prev) => (prev + 1) % STUDY_TIPS.length);
  };

  // Convert Date to string YYYY-MM-DD
  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const changeDay = (offset: number) => {
    playChime('click');
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() + offset);
    onSelectDate(formatDateString(current));
  };

  // Filter habits for the selected day based on custom frequency constraints
  const dayOfWeekIndex = new Date(selectedDate + 'T00:00:00').getDay(); // 0-6

  const applicableHabits = habits.filter((h) => {
    if (h.frequency === 'daily') return true;
    if (h.frequency === 'custom' && h.daysOfWeek) {
      return h.daysOfWeek.includes(dayOfWeekIndex);
    }
    // For weekly, we show it on weekends or all days to let them complete any day, let's show all days
    return true;
  });

  // Apply filters
  const filteredHabits = applicableHabits.filter((h) => {
    const isCompleted = !!h.history[selectedDate];
    const matchesFilter =
      filter === 'all' ||
      (filter === 'completed' && isCompleted) ||
      (filter === 'pending' && !isCompleted);

    const matchesCat = catFilter === 'all' || h.category === catFilter;

    return matchesFilter && matchesCat;
  });

  const totalActiveCount = applicableHabits.length;
  const completedCount = applicableHabits.filter((h) => h.history[selectedDate]).length;
  const percentage = totalActiveCount > 0 ? Math.round((completedCount / totalActiveCount) * 105 - 5) : 0; // standard cap
  const safePercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="space-y-6">
      
      {/* Date Switcher Ribbon */}
      <div className="flex bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 items-center justify-between shadow-xs">
        <button
          id="date-prev"
          onClick={() => changeDay(-1)}
          className="p-1 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 text-xs font-semibold cursor-pointer"
        >
          <IconComponent name="ChevronLeft" size={16} />
          <span>Past</span>
        </button>

        <div className="text-center font-bold text-slate-800 dark:text-slate-100 text-sm flex flex-col">
          <span>{getLocalDateLabel(selectedDate)}</span>
          <span className="text-[10px] font-mono text-slate-400 font-normal mt-0.5">
            {selectedDate}
          </span>
        </div>

        <button
          id="date-next"
          onClick={() => changeDay(1)}
          className="p-1 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 text-xs font-semibold cursor-pointer"
        >
          <span>Ahead</span>
          <IconComponent name="ChevronRight" size={16} />
        </button>
      </div>

      {/* Progress & Daily Checklist Tracker Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-950/60 dark:to-indigo-950/70 p-6 rounded-3xl text-white relative overflow-hidden shadow-lg shadow-indigo-150 dark:shadow-none">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
          <IconComponent name="Flame" size={120} />
        </div>

        <div className="relative space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-violet-100 uppercase">
                Goal Completion
              </span>
              <h3 className="text-xl font-extrabold tracking-tight">Today's Academic Fuel</h3>
            </div>
            <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1">
              <span>{completedCount}</span>
              <span className="opacity-50">/</span>
              <span>{totalActiveCount} Done</span>
            </div>
          </div>

          {/* Progress Slider Bar */}
          <div className="space-y-1">
            <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
              <motion.div
                className="bg-amber-400 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${safePercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-violet-100 font-semibold font-mono">
              <span>{safePercentage}% completed</span>
              <span>{completedCount * 10} XP accumulated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Student Encouragement Card */}
      <div className="bg-amber-50/50 dark:bg-amber-950/15 border border-amber-100/60 dark:border-amber-900/40 p-4 rounded-2xl flex gap-3.5 relative overflow-hidden">
        <div className="text-amber-500 mt-0.5">
          <IconComponent name="Info" size={18} />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-center pr-2">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wide">
              Student Hack & Insight
            </span>
            <button
              id="hack-next-btn"
              onClick={nextTip}
              className="text-[10px] text-amber-500 hover:text-amber-700 font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              Next <IconComponent name="ChevronRight" size={10} />
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic pr-4">
            "{STUDY_TIPS[currentTipIdx]}"
          </p>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        
        {/* Status Filters */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl gap-0.5">
          {['all', 'pending', 'completed'].map((status) => (
            <button
              key={status}
              id={`filter-status-${status}`}
              onClick={() => {
                playChime('click');
                setFilter(status as any);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                filter === status
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Category Filters Toggle */}
        <select
          id="filter-category"
          value={catFilter}
          onChange={(e) => {
            playChime('click');
            setCatFilter(e.target.value as any);
          }}
          className="text-xs bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-2 rounded-xl text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
        >
          <option value="all">All Categories</option>
          {Object.keys(CATEGORY_DETAILS).map((catName) => (
            <option key={catName} value={catName}>
              {catName}
            </option>
          ))}
        </select>
      </div>

      {/* Habits List Container */}
      <div className="space-y-3.5">
        <AnimatePresence mode="popLayout">
          {filteredHabits.length > 0 ? (
            filteredHabits.map((h) => {
              const worksOnCat = CATEGORY_DETAILS[h.category];
              const isCompleted = !!h.history[selectedDate];

              return (
                <motion.div
                  key={h.id}
                  id={`habit-card-${h.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className={`border rounded-2xl p-4 flex items-center justify-between transition-all bg-white dark:bg-slate-900 ${
                    isCompleted
                      ? 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 opacity-80'
                      : 'border-slate-150 dark:border-slate-800 shadow-xs'
                  }`}
                >
                  <div className="flex gap-4 items-center flex-1 mr-4">
                    {/* Tick Checkbox */}
                    <button
                      id={`check-habit-${h.id}`}
                      onClick={() => onToggleHabit(h.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                        isCompleted
                          ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-100 dark:shadow-none'
                          : 'border-slate-200 dark:border-slate-700 hover:border-violet-500 hover:bg-violet-50/20'
                      }`}
                    >
                      {isCompleted ? (
                        <IconComponent name="Check" size={20} className="stroke-[3]" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                      )}
                    </button>

                    {/* Meta details */}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-bold ${
                            isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {h.name}
                        </span>
                        
                        {/* Repeated / Custom frequency Indicator */}
                        {h.frequency === 'custom' && h.daysOfWeek && (
                          <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-sm">
                            Custom Days
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 text-[10px] text-slate-450 dark:text-slate-400 font-semibold flex-wrap">
                        {/* Category badge */}
                        <span className={`px-2 py-0.5 rounded-full ${worksOnCat.badgeBg} text-[9px] font-bold`}>
                          {h.category}
                        </span>

                        {/* Alarm clock Reminder icon */}
                        <span className="flex items-center gap-1">
                          <IconComponent name="Bell" size={10} className="text-indigo-400" />
                          <span>{h.reminderTime}</span>
                        </span>

                        {/* Flame Streak tracker badge */}
                        {h.streak > 0 && (
                          <span className="flex items-center gap-0.5 text-orange-500 font-bold bg-orange-50 dark:bg-orange-950/30 px-1.5 py-0.5 rounded-full text-[9px]">
                            <IconComponent name="Flame" size={10} />
                            <span>{h.streak}d streak</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div className="flex gap-1.5 items-center">
                    <button
                      id={`edit-habit-${h.id}`}
                      onClick={() => {
                        playChime('click');
                        onEditHabit(h);
                      }}
                      title="Edit Habit"
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <IconComponent name="Edit2" size={14} />
                    </button>
                    <button
                      id={`delete-habit-${h.id}`}
                      onClick={() => {
                        playChime('click');
                        onDeleteHabit(h.id);
                      }}
                      title="Delete Habit"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                    >
                      <IconComponent name="Trash2" size={14} />
                    </button>
                  </div>

                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-850 flex items-center justify-center text-slate-350 dark:text-slate-600">
                <IconComponent name="Calendar" size={32} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No student habits scheduled</h4>
                <p className="text-xs text-slate-450 dark:text-slate-400 max-w-xs mx-auto">
                  {filter !== 'all' || catFilter !== 'all'
                    ? "Try resetting filters or category search above to discover tasks."
                    : "No habits added yet! Build custom student habits manually or click below to launch our expert student daily routine template."}
                </p>
              </div>

              {filter === 'all' && catFilter === 'all' && habits.length === 0 && (
                <div className="flex flex-col gap-2.5 w-full max-w-xs pt-2">
                  <button
                    id="add-default-routine-btn"
                    onClick={onAddDefaultRoutine}
                    className="w-full py-2.5 px-4 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer dark:bg-violet-950/40 dark:text-violet-300"
                  >
                    <IconComponent name="Award" size={14} />
                    <span>Import Default Routine</span>
                  </button>
                  
                  <span className="text-[10px] text-slate-400">or</span>

                  <button
                    id="add-habit-empty-btn"
                    onClick={onAddHabitClick}
                    className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer dark:hover:bg-slate-800/20"
                  >
                    <IconComponent name="Plus" size={14} />
                    <span>Build Custom Habit</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
