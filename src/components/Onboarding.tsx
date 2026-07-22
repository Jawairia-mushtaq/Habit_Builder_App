/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Category, UserProfile } from '../types';
import { CATEGORY_DETAILS, playChime } from '../constants';
import IconComponent from './IconComponent';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedCats, setSelectedCats] = useState<Category[]>(['Study', 'Sleep', 'Exercise']);
  const [dailyGoal, setDailyGoal] = useState<number>(50); // XP
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsConsent, setNotificationsConsent] = useState(true);

  const categories = Object.keys(CATEGORY_DETAILS) as Category[];

  const handleToggleCategory = (cat: Category) => {
    playChime('click');
    if (selectedCats.includes(cat)) {
      setSelectedCats(selectedCats.filter((c) => c !== cat));
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const handleNextStep = () => {
    playChime('click');
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    playChime('click');
    setStep(step - 1);
  };

  const handleFinish = () => {
    if (soundEnabled) {
      playChime('levelUp');
    }
    const finalProfile: UserProfile = {
      xp: 0,
      level: 1,
      isOnboarded: true,
      selectedCategories: selectedCats.length > 0 ? selectedCats : ['Study'],
      dailyXpGoal: dailyGoal,
      notificationConsent: notificationsConsent,
      soundEnabled: soundEnabled,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    onComplete(finalProfile);
  };

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-100 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden relative">
        
        {/* Progress Bar Header */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 flex">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`h-full flex-1 transition-all duration-300 ${
                num <= step
                  ? 'bg-gradient-to-r from-violet-500 to-indigo-600'
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="p-8">
          {step === 1 && (
            <motion.div
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6 text-center"
            >
              <div className="mx-auto w-20 h-20 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <IconComponent name="Flame" size={44} className="animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 tracking-wider uppercase">
                  Habit Builder for Students
                </span>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Build Brainpower, Streaks & Good Habits
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Welcome to your customized growth journey! Set your routine, track daily metrics, earn experience points (XP), and collect achievement awards.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 text-left space-y-2">
                <div className="flex gap-2.5 items-start text-xs text-slate-600 dark:text-slate-350">
                  <div className="text-amber-500 mt-0.5 font-bold">★</div>
                  <span><strong>Maximize XP:</strong> Earn 10 XP for each completed habit and build daily streaks!</span>
                </div>
                <div className="flex gap-2.5 items-start text-xs text-slate-600 dark:text-slate-350">
                  <div className="text-amber-500 mt-0.5 font-bold">★</div>
                  <span><strong>Level Up:</strong> Unlock badges and custom milestones along the student path.</span>
                </div>
              </div>

              <button
                id="onboarding-btn-1"
                onClick={handleNextStep}
                className="w-full flex items-center justify-center gap-1.5 cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all"
              >
                <span>Get Started</span>
                <IconComponent name="ChevronRight" size={16} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-5"
            >
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Pick Your Focus Areas
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select at least one category to seed your habit list (you can always add or customize more later).
                </p>
              </div>

              {/* Grid of Standard Student Categories */}
              <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const details = CATEGORY_DETAILS[cat];
                  const isSelected = selectedCats.includes(cat);

                  return (
                    <button
                      key={cat}
                      id={`opt-cat-${cat}`}
                      onClick={() => handleToggleCategory(cat)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? `border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-500/60`
                          : `border-slate-100 hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800/40`
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 ${
                          isSelected
                            ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400'
                            : `${details.bgClass} ${details.textClass}`
                        }`}
                      >
                        <IconComponent name={details.icon} size={18} />
                      </div>
                      <span className="text-xs font-semibold">{details.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  id="onboarding-back-2"
                  onClick={handlePrevStep}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
                >
                  Back
                </button>
                <button
                  id="onboarding-next-2"
                  onClick={handleNextStep}
                  disabled={selectedCats.length === 0}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-xs hover:opacity-95 shadow-md shadow-indigo-100 dark:shadow-none font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Set Your Daily Target
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-450">
                  How many habits do you aim to complete each day? Standard completes grant 10 XP each.
                </p>
              </div>

              {/* Goal level slider/selector */}
              <div className="space-y-3">
                {[
                  { value: 20, label: 'Easy Growth (20 XP)', desc: 'Complete 2 habits daily' },
                  { value: 50, label: 'Standard Balance (50 XP)', desc: 'Complete 5 habits daily' },
                  { value: 80, label: 'Dedicated Mindset (80 XP)', desc: 'Complete 8 habits daily' },
                  { value: 120, label: 'Elite Scholar (120 XP)', desc: 'Complete 12 habits or high difficulty tasks' },
                ].map((g) => (
                  <button
                    key={g.value}
                    id={`goal-btn-${g.value}`}
                    onClick={() => {
                      playChime('click');
                      setDailyGoal(g.value);
                    }}
                    className={`w-full p-3.5 text-left rounded-xl border transition-all cursor-pointer ${
                      dailyGoal === g.value
                        ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-950/20 text-violet-900 dark:text-white font-semibold'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{g.label}</span>
                      {dailyGoal === g.value && (
                        <div className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center">
                          <IconComponent name="Check" className="text-white" size={10} />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-normal text-slate-450 mt-1 dark:text-slate-400">
                      {g.desc}
                    </p>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  id="onboarding-back-3"
                  onClick={handlePrevStep}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
                >
                  Back
                </button>
                <button
                  id="onboarding-next-3"
                  onClick={handleNextStep}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-xs hover:opacity-95 shadow-md shadow-indigo-100 dark:shadow-none font-medium cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="mx-auto w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500 mb-2">
                  <IconComponent name="Bell" size={28} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Preferences & Tuning
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-450">
                  Configure sound and reminder preferences. Tap below to feel the gamification effects.
                </p>
              </div>

              {/* Reminders / Audio Toggles */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-medium text-sm text-slate-900 dark:text-white">
                      <IconComponent name="Volume2" className="text-violet-500" size={16} />
                      Sound effects
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Plays rewarding audio pings on completions</p>
                  </div>
                  <button
                    id="toggle-onboard-sound"
                    onClick={() => {
                      const mode = !soundEnabled;
                      setSoundEnabled(mode);
                      if (mode) playChime('complete');
                    }}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center relative p-0.5 cursor-pointer ${
                      soundEnabled ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-sm transform duration-200 ${
                        soundEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-medium text-sm text-slate-900 dark:text-white">
                      <IconComponent name="Bell" className="text-indigo-500" size={16} />
                      Daily Reminders
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Enables student dashboard reminders & alerts</p>
                  </div>
                  <button
                    id="toggle-onboard-notif"
                    onClick={() => {
                      playChime('click');
                      setNotificationsConsent(!notificationsConsent);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center relative p-0.5 cursor-pointer ${
                      notificationsConsent ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-sm transform duration-200 ${
                        notificationsConsent ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  id="onboarding-back-4"
                  onClick={handlePrevStep}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
                >
                  Back
                </button>
                <button
                  id="onboarding-finish"
                  onClick={handleFinish}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-xs hover:opacity-95 shadow-md shadow-indigo-100 dark:shadow-none font-medium cursor-pointer"
                >
                  Let's Begin!
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
