/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { UserProfile } from '../types';
import { playChime } from '../constants';
import IconComponent from './IconComponent';

interface SettingsProps {
  profile: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onResetProgress: () => void;
}

export default function Settings({
  profile,
  darkMode,
  onToggleDarkMode,
  onUpdateProfile,
  onResetProgress,
}: SettingsProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleToggleSound = () => {
    const updated = { ...profile, soundEnabled: !profile.soundEnabled };
    onUpdateProfile(updated);
    if (updated.soundEnabled) {
      playChime('complete');
    } else {
      playChime('click');
    }
  };

  const handleToggleNotif = () => {
    playChime('click');
    const updated = { ...profile, notificationConsent: !profile.notificationConsent };
    onUpdateProfile(updated);
  };

  const handleReset = () => {
    playChime('levelUp');
    onResetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Configuration Group */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">App Customization</h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          
          {/* Dark Mode Toggle */}
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 dark:text-slate-150 block">Dark appearance</span>
              <span className="text-xs text-slate-450 dark:text-slate-400">Switches theme to midnight canvas styling</span>
            </div>
            <button
              id="set-dark-mode"
              onClick={() => {
                playChime('click');
                onToggleDarkMode();
              }}
              className={`w-11 h-6 rounded-full transition-colors flex items-center relative p-0.5 cursor-pointer ${
                darkMode ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-sm transform duration-200 ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 dark:text-slate-150 block">Sound effects</span>
              <span className="text-xs text-slate-450 dark:text-slate-400 font-normal">Plays satisfying chimes when completed</span>
            </div>
            <button
              id="set-sound-effects"
              onClick={handleToggleSound}
              className={`w-11 h-6 rounded-full transition-colors flex items-center relative p-0.5 cursor-pointer ${
                profile.soundEnabled ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-sm transform duration-200 ${
                  profile.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 dark:text-slate-150 block">Weekly Reminders</span>
              <span className="text-xs text-slate-450 dark:text-slate-400 font-normal">Consents to showing helpful tips & task alerts</span>
            </div>
            <button
              id="set-consent"
              onClick={handleToggleNotif}
              className={`w-11 h-6 rounded-full transition-colors flex items-center relative p-0.5 cursor-pointer ${
                profile.notificationConsent ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-sm transform duration-200 ${
                  profile.notificationConsent ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

        </div>
      </div>

      {/* Dangerous/Reset Settings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm">Account & Progress Control</h3>
        
        {showResetConfirm ? (
          <div className="bg-rose-50 dark:bg-rose-950/20 p-4 border border-rose-100 dark:border-rose-900/50 rounded-xl space-y-3 animate-in slide-in-from-top duration-200 text-xs">
            <p className="font-bold text-rose-800 dark:text-rose-450 leading-relaxed">
              Are you absolutely sure? This will permanently delete your habits list, zero your Level/XP metrics, erase your streak calendars, and safely reinitialize the application onboarding.
            </p>
            <div className="flex gap-2">
              <button
                id="reset-confirm-btn"
                onClick={handleReset}
                className="py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer"
              >
                Yes, Reset Everything
              </button>
              <button
                id="reset-cancel-btn"
                onClick={() => {
                  playChime('click');
                  setShowResetConfirm(false);
                }}
                className="py-1.5 px-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-lg cursor-pointer font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-150">Reset User State</h4>
              <p className="text-[10px] text-slate-450 dark:text-slate-400">Wipe habit logs, reset level progress & achievements</p>
            </div>
            <button
              id="req-reset-btn"
              onClick={() => {
                playChime('click');
                setShowResetConfirm(true);
              }}
              className="py-2 px-3 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 border border-rose-100 dark:bg-rose-950/15 dark:text-rose-400 dark:border-rose-900/40 text-xs font-bold rounded-xl cursor-pointer"
            >
              Reset Progress
            </button>
          </div>
        )}
      </div>

      {/* About App Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs text-center space-y-3">
        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <IconComponent name="Flame" size={24} className="animate-pulse" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-slate-800 dark:text-white">Habit Builder for Students</h4>
          <p className="text-[11px] text-slate-405 dark:text-slate-400">Version 1.1.0 • Stable Release</p>
        </div>
        <p className="text-xs text-slate-450 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          Designed specifically for teenagers and college students to master daily routines, optimize focus, track consistency streaks, and level up study metrics. Built with premium Vite-infused React hooks.
        </p>
      </div>

    </div>
  );
}
