/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Habit, UserProfile, Category } from '../types';
import { CATEGORY_DETAILS, playChime } from '../constants';
import IconComponent from './IconComponent';

interface ProgressDashboardProps {
  habits: Habit[];
  profile: UserProfile;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export default function ProgressDashboard({
  habits,
  profile,
  selectedDate,
  onSelectDate,
}: ProgressDashboardProps) {
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth()); // 0-11

  // Switch month helper code
  const handlePrevMonth = () => {
    playChime('click');
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((prev) => prev - 1);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    playChime('click');
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((prev) => prev + 1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };

  // Format date key: YYYY-MM-DD
  const makeDateKey = (year: number, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Get days in selected month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get starting weekday of selected month (Sunday = 0)
  const getStartingDayInMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const startDayOffset = getStartingDayInMonth(calendarYear, calendarMonth);

  // Calculate completion percentage for a specific date
  const getDateAnalytics = (dateStr: string) => {
    const dayOfWeekIdx = new Date(dateStr + 'T00:00:00').getDay();
    
    // Habits scheduled for that day
    const scheduled = habits.filter((h) => {
      if (h.frequency === 'daily') return true;
      if (h.frequency === 'custom' && h.daysOfWeek) {
        return h.daysOfWeek.includes(dayOfWeekIdx);
      }
      return true;
    });

    if (scheduled.length === 0) return { scheduled: 0, completed: 0, percentage: 0 };

    const completed = scheduled.filter((h) => h.history[dateStr]).length;
    return {
      scheduled: scheduled.length,
      completed,
      percentage: Math.round((completed / scheduled.length) * 100),
    };
  };

  // 1. Weekly Progress (last 7 days)
  const last7Days = Array.from({ length: 7 })
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    })
    .map((dateStr) => {
      const stats = getDateAnalytics(dateStr);
      const label = new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short' });
      return { dateStr, stats, label };
    });

  // 2. Category Statistics
  const categoryStats = (Object.keys(CATEGORY_DETAILS) as Category[]).map((catName) => {
    // Total completions in this category across all historic records
    let totalCompletions = 0;
    const associatedHabits = habits.filter((h) => h.category === catName);
    
    associatedHabits.forEach((h) => {
      Object.keys(h.history).forEach((dateKey) => {
        if (h.history[dateKey]) totalCompletions++;
      });
    });

    return {
      category: catName,
      details: CATEGORY_DETAILS[catName],
      activeHabitCount: associatedHabits.length,
      completions: totalCompletions,
    };
  });

  const totalCompletionsAllTime = habits.reduce((sum, h) => {
    const completionsCount = Object.values(h.history).filter(Boolean).length;
    return sum + completionsCount;
  }, 0);

  const bestStreakAllTime = habits.reduce((best, h) => Math.max(best, h.bestStreak), 0);

  // Month labels
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      
      {/* High-Level Overview Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl text-center shadow-xs">
          <div className="mx-auto w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-2">
            <IconComponent name="CheckCircle2" size={18} />
          </div>
          <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold block uppercase tracking-wider">
            Total Done
          </span>
          <span className="text-xl font-extrabold text-slate-850 dark:text-white mt-1 block">
            {totalCompletionsAllTime}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl text-center shadow-xs">
          <div className="mx-auto w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-orange-500 flex items-center justify-center mb-2">
            <IconComponent name="Flame" size={18} />
          </div>
          <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold block uppercase tracking-wider">
            Best Streak
          </span>
          <span className="text-xl font-extrabold text-slate-850 dark:text-white mt-1 block">
            {bestStreakAllTime} days
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl text-center shadow-xs">
          <div className="mx-auto w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center mb-2">
            <IconComponent name="Trophy" size={18} />
          </div>
          <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold block uppercase tracking-wider">
            XP Level
          </span>
          <span className="text-xl font-extrabold text-slate-850 dark:text-white mt-1 block">
            Lvl {profile.level}
          </span>
        </div>
      </div>

      {/* Weekly Completion Bar Charts */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">
          Weekly Progress History
        </h3>

        <div className="flex justify-between items-end h-28 pt-2">
          {last7Days.map((v) => {
            const isToday = v.dateStr === new Date().toISOString().split('T')[0];
            const heightPct = v.stats.percentage > 0 ? `${v.stats.percentage}%` : '4%';

            return (
              <div key={v.dateStr} className="flex-1 flex flex-col items-center group space-y-2">
                
                {/* Visual Bar widget wrapper */}
                <div className="w-8 bg-slate-50 dark:bg-slate-800 h-20 rounded-lg flex items-end overflow-hidden border border-slate-100 dark:border-slate-800/80 relative">
                  <div
                    style={{ height: heightPct }}
                    className={`w-full rounded-t-sm transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-violet-600 to-indigo-500'
                        : 'bg-indigo-400/80 dark:bg-indigo-600/60'
                    }`}
                  />
                  
                  {/* Floating tooltip */}
                  <span className="absolute bottom-1 bg-slate-950 text-white rounded-md text-[9px] font-mono px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none left-1/2 transform -translate-x-1/2 scale-90">
                    {v.stats.percentage}%
                  </span>
                </div>

                <div className="text-center">
                  <span className={`text-[10px] font-bold ${isToday ? 'text-violet-600' : 'text-slate-400 dark:text-slate-500'}`}>
                    {v.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Monthly Grid Calendar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
            <IconComponent name="Calendar" className="text-violet-500" size={16} />
            <span>Monthly Habit Density</span>
          </h3>

          <div className="flex gap-1.5 items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
            <button
              id="cal-prev"
              onClick={handlePrevMonth}
              className="p-1 rounded bg-white hover:bg-slate-50 shadow-xs text-slate-500 dark:bg-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <IconComponent name="ChevronLeft" size={14} />
            </button>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 px-2 min-w-28 text-center uppercase">
              {MONTH_NAMES[calendarMonth]} {calendarYear}
            </span>
            <button
              id="cal-next"
              onClick={handleNextMonth}
              className="p-1 rounded bg-white hover:bg-slate-50 shadow-xs text-slate-500 dark:bg-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <IconComponent name="ChevronRight" size={14} />
            </button>
          </div>
        </div>

        {/* Days of week titles */}
        <div className="grid grid-cols-7 gap-1.5 text-center mb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Grid calendar cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Calendar padding spaces */}
          {Array.from({ length: startDayOffset }).map((_, idx) => (
            <div key={`offset-${idx}`} className="aspect-square opacity-0 pointer-events-none" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const fullDateStr = makeDateKey(calendarYear, calendarMonth, dayNum);
            const isToday = fullDateStr === new Date().toISOString().split('T')[0];
            const isTargeted = fullDateStr === selectedDate;
            const analytics = getDateAnalytics(fullDateStr);

            // Calculate density color
            let densityBg = 'bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-slate-300';
            if (analytics.scheduled > 0) {
              if (analytics.percentage === 100) {
                densityBg = 'bg-emerald-500 hover:bg-emerald-600 text-white';
              } else if (analytics.percentage > 50) {
                densityBg = 'bg-emerald-200 hover:bg-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-300';
              } else if (analytics.percentage > 0) {
                densityBg = 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-450';
              } else {
                densityBg = 'bg-slate-150 hover:bg-slate-200 text-slate-500 dark:bg-slate-800 dark:hover:bg-slate-750';
              }
            }

            return (
              <button
                key={dayNum}
                id={`calendar-day-${fullDateStr}`}
                onClick={() => {
                  playChime('click');
                  onSelectDate(fullDateStr);
                }}
                title={`${fullDateStr}: ${analytics.completed}/${analytics.scheduled} Habits completed`}
                className={`aspect-square text-[10px] font-bold rounded-lg flex flex-col items-center justify-center relative cursor-pointer transition-all ${densityBg} ${
                  isTargeted ? 'ring-2 ring-violet-500 ring-offset-1 dark:ring-offset-slate-900' : ''
                }`}
              >
                <span>{dayNum}</span>
                {isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 absolute bottom-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Focus Area completions breakdown statistics */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">
          Completions by Focus Area
        </h3>

        <div className="space-y-3">
          {categoryStats
            .filter((c) => c.completions > 0 || c.activeHabitCount > 0)
            .sort((a, b) => b.completions - a.completions)
            .map((c) => (
              <div key={c.category} className="space-y-1">
                <div className="flex justify-between text-xs items-center">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${c.details.badgeBg}`}>
                      <IconComponent name={c.details.icon} size={12} />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{c.category}</span>
                  </div>
                  <div className="text-[10px] text-slate-450 dark:text-slate-400 font-bold font-mono">
                    {c.completions} completions ({c.activeHabitCount} active)
                  </div>
                </div>

                <div className="w-full bg-slate-50 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${Math.min(100, (c.completions / Math.max(1, totalCompletionsAllTime)) * 100)}%`,
                    }}
                    className={`h-full rounded-full bg-gradient-to-r ${c.details.gradient || 'from-violet-500 to-indigo-600'}`}
                  />
                </div>
              </div>
            ))}
          {totalCompletionsAllTime === 0 && (
            <p className="text-xs text-slate-400 text-center py-4">
              Complete your student habits to generate deep visual metrics and stats!
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
