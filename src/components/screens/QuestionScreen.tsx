import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import {
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  FastForward,
  X,
} from 'lucide-react';

export const QuestionScreen: React.FC = () => {
  const {
    activeCategory,
    activeQuestions,
    currentIndex,
    currentQuestion,
    selectedOption,
    selectOption,
    confirmAnswer,
    nextQuestion,
    isSubmitted,
    score,
    timeRemaining,
    timerEnabled,
    eliminatedOptions,
    usedLifelineFiftyFifty,
    applyFiftyFifty,
    skipQuestion,
    navigateTo,
  } = useQuiz();

  if (!currentQuestion) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-sm text-slate-500">No active quiz question.</p>
        <button
          onClick={() => navigateTo('categories')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Choose Category
        </button>
      </div>
    );
  }

  const totalQuestions = activeQuestions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const isLastQuestion = currentIndex + 1 >= totalQuestions;

  // Option letter prefixes
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Top Bar: Progress, Timer, and Quit Action */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to exit this quiz? Current progress will be lost.')) {
              navigateTo('categories');
            }
          }}
          aria-label="Quit quiz"
          className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-rose-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress Display: Question 3 of 5 */}
        <div className="text-center">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
            {activeCategory?.name || 'Quiz'}
          </span>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
            Question {currentIndex + 1} of {totalQuestions}
          </div>
        </div>

        {/* Score & Timer Badges */}
        <div className="flex items-center gap-2">
          {timerEnabled && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold tabular-nums transition-colors ${
                timeRemaining <= 5
                  ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 animate-pulse'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>{timeRemaining}s</span>
            </div>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold tabular-nums">
            {score} pts
          </div>
        </div>
      </div>

      {/* Visual Linear Progress Bar */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Lifeline Buttons */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-slate-400 dark:text-slate-500">Lifelines:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={applyFiftyFifty}
            disabled={usedLifelineFiftyFifty || isSubmitted}
            className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              usedLifelineFiftyFifty || isSubmitted
                ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                : 'bg-white dark:bg-slate-800 text-amber-600 border-amber-200 dark:border-amber-800/80 hover:bg-amber-50 shadow-sm'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            50:50 Lifeline
          </button>

          <button
            onClick={skipQuestion}
            disabled={isSubmitted}
            className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isSubmitted
                ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <FastForward className="w-3.5 h-3.5" />
            Skip
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-900/5 space-y-6">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* Four Multiple-Choice Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((optionText, index) => {
            const isEliminated = eliminatedOptions.includes(index);
            const isSelected = selectedOption === index;
            const isCorrect = currentQuestion.correctAnswerIndex === index;

            let cardStyle =
              'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500';

            let badgeStyle =
              'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200';

            if (isSelected && !isSubmitted) {
              cardStyle =
                'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-600/20';
              badgeStyle = 'bg-indigo-600 text-white';
            }

            if (isSubmitted) {
              if (isCorrect) {
                cardStyle =
                  'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20';
                badgeStyle = 'bg-emerald-600 text-white';
              } else if (isSelected && !isCorrect) {
                cardStyle =
                  'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20';
                badgeStyle = 'bg-rose-600 text-white';
              } else {
                cardStyle = 'opacity-50 border-slate-200 dark:border-slate-800 text-slate-400';
              }
            }

            if (isEliminated) {
              return (
                <div
                  key={index}
                  className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 opacity-30 select-none text-xs text-slate-400 flex items-center gap-3"
                >
                  <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold">
                    {optionLetters[index]}
                  </span>
                  <span>Option eliminated</span>
                </div>
              );
            }

            return (
              <button
                key={index}
                onClick={() => selectOption(index)}
                disabled={isSubmitted}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-4 transition-all min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${cardStyle}`}
              >
                <div className="flex items-center gap-3.5 flex-1">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${badgeStyle}`}
                  >
                    {optionLetters[index]}
                  </span>
                  <span className="text-sm font-medium leading-snug">{optionText}</span>
                </div>

                {/* State Icons */}
                {isSubmitted && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Post-Submission Explanation */}
        {isSubmitted && currentQuestion.explanation && (
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 space-y-1 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300">
              <HelpCircle className="w-4 h-4" />
              <span>Explanation</span>
            </div>
            <p className="leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Primary Action Button (Submit or Next) */}
      <div className="pt-2">
        {!isSubmitted ? (
          <button
            onClick={confirmAnswer}
            disabled={selectedOption === null}
            className={`w-full min-h-[48px] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              selectedOption !== null
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 active:scale-[0.98]'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="w-full min-h-[48px] rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
          >
            <span>{isLastQuestion ? 'View Results' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
