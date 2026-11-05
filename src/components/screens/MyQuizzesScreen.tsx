import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import {
  FolderHeart,
  ArrowLeft,
  PlusCircle,
  Play,
  Trash2,
  Search,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const MyQuizzesScreen: React.FC = () => {
  const { customQuestions, deleteCustomQuestion, navigateTo, startQuiz, categories } = useQuiz();
  const [searchQuery, setSearchQuery] = useState('');

  const customCategory = categories.find((c) => c.id === 'custom') || categories[0];

  const filteredQuestions = customQuestions.filter((q) => {
    const qMatches = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const optMatches = q.options.some((o) => o.toLowerCase().includes(searchQuery.toLowerCase()));
    return qMatches || optMatches;
  });

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
              My Quizzes & Questions
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage custom questions you have created on this device
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {customQuestions.length > 0 && (
            <button
              onClick={() => startQuiz(customCategory)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Play Custom Quiz</span>
            </button>
          )}

          <button
            onClick={() => navigateTo('add-question')}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      {customQuestions.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search custom questions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Empty State */}
      {customQuestions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-violet-50 dark:bg-violet-950/40 text-violet-500 mx-auto flex items-center justify-center">
            <FolderHeart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Custom Questions Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              Create your own questions with verified options to build your personal quiz deck!
            </p>
          </div>
          <button
            onClick={() => navigateTo('add-question')}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white inline-flex items-center gap-2"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Create First Question
          </button>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500">
          No custom questions match &ldquo;{searchQuery}&rdquo;.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-400/50 transition-colors space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                    {q.category} · Question #{idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                    {q.question}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Delete this custom question?')) {
                      deleteCustomQuestion(q.id);
                    }
                  }}
                  aria-label="Delete Question"
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Options list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                {q.options.map((opt, optIdx) => {
                  const isCorrect = q.correctAnswerIndex === optIdx;
                  return (
                    <div
                      key={optIdx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isCorrect
                          ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {['A', 'B', 'C', 'D'][optIdx]}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
