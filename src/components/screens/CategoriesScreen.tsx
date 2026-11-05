import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import {
  Code2,
  Cpu,
  Globe,
  FlaskConical,
  Calculator,
  Smartphone,
  Sparkles,
  ArrowRight,
  Trophy,
  Wifi,
  Database,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { DifficultyLevel, QuizCategory } from '../../types/quiz';
import { storageService } from '../../services/storageService';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Code2,
  Cpu,
  Globe,
  FlaskConical,
  Calculator,
  Smartphone,
  Sparkles,
};

export const CategoriesScreen: React.FC = () => {
  const {
    categories,
    startQuiz,
    navigateTo,
    isLoading,
    apiError,
    setApiError,
  } = useQuiz();

  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [useLiveApi, setUseLiveApi] = useState<boolean>(false);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  const handleCategoryClick = async (category: QuizCategory) => {
    setSelectedCatId(category.id);
    const diff = selectedDifficulty === 'all' ? undefined : selectedDifficulty;
    await startQuiz(category, useLiveApi && category.id !== 'custom', diff);
    setSelectedCatId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Top Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            aria-label="Back to Home"
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Quiz Categories
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a domain and customize your challenge settings
            </p>
          </div>
        </div>

        {/* Source Mode Toggle: Curated Offline vs Live Public API */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setUseLiveApi(false)}
            className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              !useLiveApi
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Curated Bank
          </button>
          <button
            onClick={() => setUseLiveApi(true)}
            className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              useLiveApi
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            Live Trivia API
          </button>
        </div>
      </div>

      {/* Difficulty Filter Tabs */}
      <div className="flex items-center gap-2 pb-2 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1 shrink-0">
          Difficulty:
        </span>
        {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={`min-h-[36px] px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize whitespace-nowrap shrink-0 ${
              selectedDifficulty === diff
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* API Notice / Error Banner */}
      {apiError && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{apiError}</span>
          </div>
          <button
            onClick={() => setApiError(null)}
            className="text-amber-700 hover:text-amber-900 font-bold px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = iconMap[category.iconName] || Code2;
          const bestScore = storageService.getBestScoreForCategory(category.id);
          const isCurrentLoading = isLoading && selectedCatId === category.id;

          return (
            <div
              key={category.id}
              onClick={() => !isLoading && handleCategoryClick(category)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!isLoading) handleCategoryClick(category);
                }
              }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 hover:border-indigo-500/50 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer relative overflow-hidden min-h-[170px]"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${category.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="text-right">
                  {bestScore > 0 ? (
                    <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold tabular-nums">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{bestScore} pts</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-500">Unplayed</span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>{isCurrentLoading ? 'Loading questions...' : 'Start 5-Question Quiz'}</span>
                {isCurrentLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
