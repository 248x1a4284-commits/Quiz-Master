import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import {
  Trophy,
  ArrowLeft,
  Medal,
  Calendar,
  Trash2,
  Play,
} from 'lucide-react';
import { CategoryId } from '../../types/quiz';

export const LeaderboardScreen: React.FC = () => {
  const { highScores, clearAllScores, categories, navigateTo, startQuiz } = useQuiz();
  const [filterCategory, setFilterCategory] = useState<CategoryId | 'all'>('all');

  const filteredScores =
    filterCategory === 'all'
      ? highScores
      : highScores.filter((s) => s.category === filterCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Top Header */}
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
              Leaderboard & Best Scores
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your highest quiz achievements stored permanently on device
            </p>
          </div>
        </div>

        {highScores.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear all score records from local storage?')) {
                clearAllScores();
              }
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 p-2 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Scores</span>
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterCategory('all')}
          className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            filterCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          All Domains
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Scores List */}
      {filteredScores.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 mx-auto flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Scores Recorded Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              Play a quiz round to record your high score on this leaderboard!
            </p>
          </div>
          <button
            onClick={() => navigateTo('categories')}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white inline-flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Play Quiz Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredScores.map((record, index) => {
            let rankBadge = (
              <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-xs tabular-nums">
                #{index + 1}
              </span>
            );

            if (index === 0) {
              rankBadge = (
                <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xs shadow-sm">
                  <Medal className="w-4 h-4 fill-slate-900" />
                </div>
              );
            } else if (index === 1) {
              rankBadge = (
                <div className="w-7 h-7 rounded-xl bg-slate-300 text-slate-900 flex items-center justify-center font-bold text-xs">
                  <Medal className="w-4 h-4" />
                </div>
              );
            } else if (index === 2) {
              rankBadge = (
                <div className="w-7 h-7 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold text-xs">
                  <Medal className="w-4 h-4" />
                </div>
              );
            }

            return (
              <div
                key={record.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 hover:border-indigo-400 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  {rankBadge}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {record.categoryName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{record.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{record.totalQuestions} Questions</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {record.score} pts
                  </div>
                  <div className="text-xs font-semibold text-slate-500 tabular-nums">
                    {record.percentage}% accuracy
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
