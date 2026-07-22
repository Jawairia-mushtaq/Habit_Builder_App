/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { Habit, Category, Frequency } from '../types';
import { CATEGORY_DETAILS, playChime } from '../constants';
import IconComponent from './IconComponent';

interface HabitFormProps {
  habitToEdit?: Habit | null;
  onSave: (habitData: {
    name: string;
    category: Category;
    frequency: Frequency;
    daysOfWeek?: number[];
    reminderTime: string;
    color: string;
  }) => void;
  onCancel: () => void;
}

const COLORS = [
  'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500',
  'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
  'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
  'bg-sky-500 hover:bg-sky-600 focus:ring-sky-500',
  'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500',
  'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500',
  'bg-rose-500 hover:bg-rose-600 focus:ring-rose-500',
  'bg-slate-600 hover:bg-slate-700 focus:ring-slate-600',
];

const WEEKDAYS = [
  { value: 0, label: 'S' },
  { value: 1, label: 'M' },
  { value: 2, label: 'T' },
  { value: 3, label: 'W' },
  { value: 4, label: 'T' },
  { value: 5, label: 'F' },
  { value: 6, label: 'S' },
];

export default function HabitForm({ habitToEdit, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Study');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 2, 3, 4, 5]); // Default weekdays
  const [reminderTime, setReminderTime] = useState('08:00');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name);
      setCategory(habitToEdit.category);
      setFrequency(habitToEdit.frequency);
      setDaysOfWeek(habitToEdit.daysOfWeek || [1, 2, 3, 4, 5]);
      setReminderTime(habitToEdit.reminderTime);
      setSelectedColor(habitToEdit.color);
    } else {
      setName('');
      setCategory('Study');
      setFrequency('daily');
      setDaysOfWeek([1, 2, 3, 4, 5]);
      setReminderTime('08:00');
      setSelectedColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }
  }, [habitToEdit]);

  // Sync category with color as a helpful preset if adding
  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    if (!habitToEdit) {
      // Pick color preset matching category profile
      switch (cat) {
        case 'Study':
          setSelectedColor(COLORS[1]); // Blue
          break;
        case 'Exercise':
          setSelectedColor(COLORS[0]); // Emerald
          break;
        case 'Reading':
          setSelectedColor(COLORS[2]); // Amber
          break;
        case 'Water Intake':
          setSelectedColor(COLORS[3]); // Sky
          break;
        case 'Sleep':
          setSelectedColor(COLORS[4]); // Indigo
          break;
        case 'Prayer':
          setSelectedColor(COLORS[5]); // Purple
          break;
        case 'Journaling':
          setSelectedColor(COLORS[6]); // Rose
          break;
        default:
          setSelectedColor(COLORS[7]); // Slate
      }
    }
  };

  const toggleDay = (day: number) => {
    playChime('click');
    if (daysOfWeek.includes(day)) {
      if (daysOfWeek.length > 1) {
        setDaysOfWeek(daysOfWeek.filter((d) => d !== day));
      }
    } else {
      setDaysOfWeek([...daysOfWeek, day].sort());
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      category,
      frequency,
      daysOfWeek: frequency === 'custom' ? daysOfWeek : undefined,
      reminderTime,
      color: selectedColor,
    });
  };

  const categories = Object.keys(CATEGORY_DETAILS) as Category[];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-150 dark:border-slate-800 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <IconComponent
              name={habitToEdit ? 'Edit2' : 'PlusCircle'}
              className="text-violet-600"
              size={20}
            />
            {habitToEdit ? 'Edit Student Habit' : 'Build Custom Habit'}
          </h3>
          <button
            id="modal-close"
            onClick={() => {
              playChime('click');
              onCancel();
            }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <IconComponent name="X" size={18} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              What habit are you aiming for?
            </label>
            <input
              id="habit-input-name"
              type="text"
              required
              placeholder="e.g. Review Flashcards or Drink water..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>

          {/* Category SELECTOR */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Habit Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => {
                const details = CATEGORY_DETAILS[cat];
                const isSelected = category === cat;

                return (
                  <button
                    key={cat}
                    id={`form-cat-${cat}`}
                    type="button"
                    onClick={() => {
                      playChime('click');
                      handleCategoryChange(cat);
                    }}
                    title={details.label}
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? `border-violet-500 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 font-medium`
                        : `border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-450`
                    }`}
                  >
                    <IconComponent name={details.icon} size={18} className="mb-1" />
                    <span className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frequency & Custom Day Picker */}
          <div className="space-y-2">
            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                  Frequency
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-lg">
                  {(['daily', 'weekly', 'custom'] as Frequency[]).map((freq) => (
                    <button
                      key={freq}
                      id={`freq-choice-${freq}`}
                      type="button"
                      onClick={() => {
                        playChime('click');
                        setFrequency(freq);
                      }}
                      className={`text-xs py-1.5 px-2 rounded-md capitalize transition-all cursor-pointer ${
                        frequency === freq
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reminder Time */}
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                  Reminder Time
                </label>
                <input
                  id="habit-reminder-time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>
            </div>

            {/* If Custom selected: Show weekday buttons */}
            {frequency === 'custom' && (
              <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-lg space-y-1.5 animate-in fade-in duration-200">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase block">
                  Repeat On:
                </span>
                <div className="flex justify-between">
                  {WEEKDAYS.map((wd) => {
                    const isSelected = daysOfWeek.includes(wd.value);
                    return (
                      <button
                        key={wd.value}
                        id={`wd-btn-${wd.value}`}
                        type="button"
                        onClick={() => toggleDay(wd.value)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-violet-600 text-white'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {wd.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Theme Color Decorator */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Aesthetic Theme Color
            </label>
            <div className="flex gap-2 justify-between">
              {COLORS.map((colorClass) => {
                const pureColor = colorClass.split(' ')[0];
                return (
                  <button
                    key={colorClass}
                    id={`color-choice-${pureColor}`}
                    type="button"
                    onClick={() => {
                      playChime('click');
                      setSelectedColor(colorClass);
                    }}
                    className={`w-7 h-7 rounded-xl transition-all cursor-pointer relative flex items-center justify-center ${pureColor} ${
                      selectedColor === colorClass ? 'ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-slate-950 scale-110' : ''
                    }`}
                  >
                    {selectedColor === colorClass && (
                      <IconComponent name="Check" className="text-white font-bold" size={12} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit/Cancel Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-medium">
            <button
              id="form-btn-cancel"
              type="button"
              onClick={() => {
                playChime('click');
                onCancel();
              }}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="form-btn-save"
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white shadow-md shadow-indigo-100 dark:shadow-none cursor-pointer"
            >
              {habitToEdit ? 'Save Changes' : 'Build Habit'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
