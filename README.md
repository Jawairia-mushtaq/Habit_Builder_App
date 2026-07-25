# 🎯 Habit Builder for Students

A polished, mobile-responsive habit-tracking and gamification app built specifically for high school and college students. Habit Builder turns daily routines — studying, exercising, reading, hydration, sleep, prayer, journaling — into a game you actually want to play, with streaks, XP, levels, and unlockable achievements.

## ✨ Features

- **Custom Habit Creation** — Add habits across built-in categories (Study, Exercise, Reading, Water Intake, Sleep, Prayer, Journaling) or create your own custom category, with daily, weekly, or specific-day scheduling and reminder times.
- **Student Dashboard** — A "Today" view for quickly checking off habits and staying on top of your daily routine.
- **Streak Tracking** — Automatic current-streak and best-streak tracking per habit to keep you motivated to stay consistent.
- **XP & Leveling System** — Earn XP for completed habits, hit daily XP goals, and level up as you build consistency.
- **Progress Analytics** — A dedicated Routine Analytics view for visualizing habit history and trends over time.
- **Trophy Cabinet / Achievements** — Unlock milestone badges for total habits completed, streaks reached, habits created, and categories explored.
- **Guided Onboarding** — A first-run flow to pick focus categories and set up your profile before diving in.
- **Personalization** — Toggle notifications and sound, set a daily XP goal, and tune the app to your habits.
- **Dark Mode Ready** — Styled throughout for both light and dark themes.
- **Mobile-First Design** — Responsive layout with a bottom tab bar on phones and a full nav on larger screens.

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** for build tooling and dev server
- **Tailwind CSS 4** for styling
- **Motion** for animations
- **Lucide React** for icons
- **Express** (server-side scaffold)
- **Google GenAI SDK** included for future AI-powered features

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

```bash
git clone https://github.com/Jawairia-mushtaq/Habit_Builder_App.git
cd Habit_Builder_App
npm install
```

### Run the app

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build for production

```bash
npm run build
npm run preview
```

### Lint / type-check

```bash
npm run lint
```

## 📁 Project Structure

```
Habit_Builder_App/
├── index.html
├── metadata.json
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── App.tsx              # Main app shell, navigation, and state
    ├── main.tsx              # App entry point
    ├── types.ts               # Core TypeScript types (Habit, Achievement, UserProfile)
    ├── constants.ts           # Category metadata and achievement definitions
    ├── index.css              # Global styles
    └── components/
        ├── Onboarding.tsx       # First-run onboarding flow
        ├── Dashboard.tsx         # Today's habit dashboard
        ├── HabitForm.tsx         # Create / edit habit form
        ├── ProgressDashboard.tsx # Analytics and progress charts
        ├── Rewards.tsx            # Trophy cabinet / achievements view
        ├── Settings.tsx            # App settings and preferences
        └── IconComponent.tsx       # Shared icon renderer
```

## 🗺️ Roadmap Ideas

- Cloud sync / account-based habit storage
- Push notification reminders
- AI-powered habit suggestions (Google GenAI SDK is already wired into dependencies)
- Social/study-group accountability features

## 📄 License

This project is licensed under the Apache-2.0 License (as noted in source file headers).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.
