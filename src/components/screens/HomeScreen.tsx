import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import {
  Code2,
  Cpu,
  Globe,
  FlaskConical,
  Calculator,
  Smartphone,
  Sparkles,
  Trophy,
  PlusCircle,
  FolderHeart,
  Play,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Code2,
  Cpu,
  Globe,
  FlaskConical,
  Calculator,
  Smartphone,
  Sparkles,
};

export const HomeScreen: React.FC = () => {
  const {
    categories,
    navigateTo,
    startQuiz,
    userStats,
    highScores,
    customQuestions,
  } = useQuiz();

  const highestScore = userStats.bestOverallScore || (highScores[0]?.score ?? 0);
  const featuredCategories = categories.slice(0, 6);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fadeIn">
      {/* Hero Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/20">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">QuizMaster</h1>
              <p className="text-xs text-indigo-200 font-medium">Test your skills across 6 master domains</p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
            Welcome back! Challenge yourself with interactive quizzes, beat your personal records, or craft custom questions to test others.
          </p>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-indigo-200">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white tabular-nums">{highestScore} pts</span>
              <span>Highest Score</span>
            </div>
            <span className="opacity-40" aria-hidden="true">·</span>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="font-semibold text-white tabular-nums">{userStats.streakDays} Day</span>
              <span>Streak</span>
            </div>
            <span className="opacity-40" aria-hidden="true">·</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white tabular-nums">{userStats.quizzesPlayed}</span>
              <span>Completed</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                const randomCat = categories[Math.floor(Math.random() * (categories.length - 1))];
                startQuiz(randomCat);
              }}
              className="min-h-[44px] px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-indigo-900" />
              Quick Play
            </button>
            <button
              onClick={() => navigateTo('categories')}
              className="min-h-[44px] px-4 py-2.5 bg-indigo-700/50 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm rounded-xl transition-all border border-indigo-500/30 flex items-center gap-2"
            >
              Browse All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Shortcut Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <button
          onClick={() => navigateTo('add-question')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-left hover:border-indigo-500/50 hover:shadow-md transition-all group flex flex-col justify-between min-h-[96px]"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Add Questions</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Author custom trivia</p>
          </div>
        </button>

        <button
          onClick={() => navigateTo('my-quizzes')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-left hover:border-indigo-500/50 hover:shadow-md transition-all group flex flex-col justify-between min-h-[96px]"
        >
          <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FolderHeart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">My Quizzes</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {customQuestions.length} custom {customQuestions.length === 1 ? 'question' : 'questions'}
            </p>
          </div>
        </button>

        <button
          onClick={() => navigateTo('leaderboard')}
          className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-left hover:border-indigo-500/50 hover:shadow-md transition-all group flex flex-col justify-between min-h-[96px]"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Leaderboard</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">View your best records</p>
          </div>
        </button>
      </section>

      {/* Available Quiz Categories */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Featured Categories
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select a domain to start a 5-question round
            </p>
          </div>
          <button
            onClick={() => navigateTo('categories')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            See all
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {featuredCategories.map((category) => {
            const Icon = iconMap[category.iconName] || Code2;
            return (
              <div
                key={category.id}
                onClick={() => startQuiz(category)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    startQuiz(category);
                  }
                }}
                className="group relative p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 hover:border-indigo-500/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${category.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                    {category.questionCount ?? 5} Qs
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Start Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
