import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import {
  Trophy,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Target,
} from 'lucide-react';

export const ResultsScreen: React.FC = () => {
  const { lastResult, restartQuiz, navigateTo } = useQuiz();
  const [showReview, setShowReview] = useState<boolean>(false);

  if (!lastResult) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-sm text-slate-500">No recent quiz result found.</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Go Home
        </button>
      </div>
    );
  }

  const {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    score,
    percentage,
    timeSpentSeconds,
    categoryName,
    answers,
  } = lastResult;

  // Derive encouraging performance message based on percentage
  let performanceTitle = 'Keep Practicing!';
  let performanceMessage = 'Good attempt! Review the answers below to strengthen your understanding.';
  let badgeColor = 'text-amber-500';

  if (percentage === 100) {
    performanceTitle = 'Flawless Victory!';
    performanceMessage = 'Incredible mastery! You scored 100% on this quiz round.';
    badgeColor = 'text-amber-400';
  } else if (percentage >= 80) {
    performanceTitle = 'Mastermind!';
    performanceMessage = 'Outstanding performance! You have a deep grasp of this subject.';
    badgeColor = 'text-indigo-500';
  } else if (percentage >= 60) {
    performanceTitle = 'Well Done!';
    performanceMessage = 'Solid score! With a little more review, you will hit top tier.';
    badgeColor = 'text-emerald-500';
  }

  // Format time (e.g., "1m 12s" or "45s")
  const minutes = Math.floor(timeSpentSeconds / 60);
  const seconds = timeSpentSeconds % 60;
  const timeFormatted = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Primary Result Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xl shadow-indigo-950/5 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-800/50">
            <Trophy className={`w-8 h-8 sm:w-10 sm:h-10 ${badgeColor}`} />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            {categoryName}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {performanceTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {performanceMessage}
          </p>
        </div>

        {/* Circular Score & Percentage Display */}
        <div className="py-2">
          <div className="inline-flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-indigo-600/20 bg-indigo-50/50 dark:bg-indigo-950/30">
            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {percentage}%
            </span>
            <span className="text-xs font-semibold text-slate-500 tabular-nums">
              {score} points
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-1">
              <Target className="w-3.5 h-3.5" />
              <span>Questions</span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
              {totalQuestions}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Correct</span>
            </div>
            <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {correctAnswers}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-700 dark:text-rose-400 mb-1">
              <XCircle className="w-3.5 h-3.5" />
              <span>Incorrect</span>
            </div>
            <div className="text-lg font-bold text-rose-700 dark:text-rose-400 tabular-nums">
              {incorrectAnswers}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Time</span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
              {timeFormatted}
            </div>
          </div>
        </div>

        {/* Action Buttons: Restart & Home */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60">
          <button
            onClick={restartQuiz}
            className="flex-1 min-h-[48px] rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Quiz</span>
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="flex-1 min-h-[48px] rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>

      {/* Review Answers Accordion */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <button
          onClick={() => setShowReview(!showReview)}
          className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Review Question Answers ({answers.length})</span>
          </div>
          {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showReview && (
          <div className="p-5 pt-0 space-y-4 border-t border-slate-100 dark:border-slate-700/60">
            {answers.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Q{idx + 1}.
                  </span>
                  {item.isCorrect ? (
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Correct</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs font-semibold text-rose-600">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Incorrect</span>
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {item.questionText}
                </p>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 w-24 shrink-0">Your Answer:</span>
                    <span
                      className={`font-semibold ${
                        item.isCorrect ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {item.userAnswerIndex >= 0
                        ? item.options[item.userAnswerIndex]
                        : 'Skipped'}
                    </span>
                  </div>

                  {!item.isCorrect && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 w-24 shrink-0">Correct Answer:</span>
                      <span className="font-semibold text-emerald-600">
                        {item.options[item.correctAnswerIndex]}
                      </span>
                    </div>
                  )}
                </div>

                {item.explanation && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{item.explanation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
