import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { Volume2, VolumeX, Smartphone, Monitor, Code } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    isSoundMuted,
    toggleSound,
    isDeviceMode,
    toggleDeviceMode,
  } = useQuiz();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line */}
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <span className="font-extrabold text-base tracking-wider">QM</span>
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
            QuizMaster
          </span>
        </button>

        {/* Zone 2: 4-5 nav links, 1-2 word labels, single-line */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => navigateTo('home')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 ${
              currentScreen === 'home' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('categories')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 ${
              currentScreen === 'categories' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => navigateTo('leaderboard')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 ${
              currentScreen === 'leaderboard' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => navigateTo('add-question')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 ${
              currentScreen === 'add-question' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Create
          </button>
          <button
            onClick={() => navigateTo('flutter-code')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentScreen === 'flutter-code' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            <Code className="w-4 h-4 text-indigo-500" />
            Flutter Code
          </button>
        </nav>

        {/* Zone 3: 1 primary action area */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleDeviceMode}
            title={isDeviceMode ? 'Switch to Full Desktop View' : 'Preview in Android Phone Frame'}
            aria-label="Toggle Android Device Frame"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isDeviceMode ? (
              <Monitor className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <Smartphone className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={toggleSound}
            title={isSoundMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            aria-label="Toggle Sound Effects"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isSoundMuted ? (
              <VolumeX className="w-5 h-5 text-rose-500" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            )}
          </button>

          <button
            onClick={() => navigateTo('categories')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-600/20 whitespace-nowrap shrink-0"
          >
            Play Quiz
          </button>
        </div>
      </div>
    </header>
  );
};
