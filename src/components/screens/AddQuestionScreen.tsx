import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Eye,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import { CategoryId } from '../../types/quiz';

interface FormErrors {
  question?: string;
  category?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer?: string;
}

export const AddQuestionScreen: React.FC = () => {
  const { categories, addCustomQuestion, navigateTo } = useQuiz();

  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState<CategoryId>('programming');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!questionText.trim()) {
      newErrors.question = 'Question text is required.';
    } else if (questionText.trim().length < 8) {
      newErrors.question = 'Question must be at least 8 characters long.';
    }

    if (!category) {
      newErrors.category = 'Please choose a category.';
    }

    if (!optionA.trim()) newErrors.optionA = 'Option A is required.';
    if (!optionB.trim()) newErrors.optionB = 'Option B is required.';
    if (!optionC.trim()) newErrors.optionC = 'Option C is required.';
    if (!optionD.trim()) newErrors.optionD = 'Option D is required.';

    // Check for duplicate options
    const rawOptions = [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()].filter(Boolean);
    const uniqueOptions = new Set(rawOptions.map((o) => o.toLowerCase()));
    if (rawOptions.length === 4 && uniqueOptions.size < 4) {
      newErrors.optionD = 'All 4 options must be unique and distinct.';
    }

    if (correctAnswerIndex < 0 || correctAnswerIndex > 3) {
      newErrors.correctAnswer = 'Please select which option is correct.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = addCustomQuestion({
      question: questionText.trim(),
      category: category,
      options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()],
      correctAnswerIndex,
      explanation: explanation.trim() || undefined,
    });

    if (success) {
      setIsSuccess(true);
      // Reset form
      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setExplanation('');
      setCorrectAnswerIndex(0);
      setErrors({});
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
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
              Add Custom Question
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create your own verified quiz questions with instant preview
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
        </button>
      </div>

      {/* Success Notification */}
      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold">Question Saved Successfully!</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Your question has been stored locally and added to My Quizzes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSuccess(false)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Add Another
            </button>
            <button
              onClick={() => navigateTo('my-quizzes')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              View My Quizzes
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5"
        >
          {/* Question Text */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-200">
              Question Title / Prompt <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. Which keyword in Dart defines a compile-time constant?"
              className={`w-full p-3 rounded-xl border text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                errors.question
                  ? 'border-rose-400 dark:border-rose-600'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.question && (
              <p className="text-[11px] text-rose-500 font-medium">{errors.question}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-200">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryId)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories
                .filter((c) => c.id !== 'custom')
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Four Options & Radio for Correct Answer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-200">
                Multiple-Choice Options & Correct Answer <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Select the correct radio</span>
            </div>

            {[
              { letter: 'A', value: optionA, setter: setOptionA, err: errors.optionA, idx: 0 },
              { letter: 'B', value: optionB, setter: setOptionB, err: errors.optionB, idx: 1 },
              { letter: 'C', value: optionC, setter: setOptionC, err: errors.optionC, idx: 2 },
              { letter: 'D', value: optionD, setter: setOptionD, err: errors.optionD, idx: 3 },
            ].map(({ letter, value, setter, err, idx }) => (
              <div key={letter} className="space-y-1">
                <div
                  className={`flex items-center gap-2 p-2 rounded-xl border transition-colors ${
                    correctAnswerIndex === idx
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer pl-1">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctAnswerIndex === idx}
                      onChange={() => setCorrectAnswerIndex(idx)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {letter}
                    </span>
                  </label>

                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={`Enter Option ${letter}`}
                    className="flex-1 bg-transparent border-0 text-xs sm:text-sm focus:outline-none px-2 py-1"
                  />

                  {correctAnswerIndex === idx && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pr-2 whitespace-nowrap">
                      Correct
                    </span>
                  )}
                </div>
                {err && <p className="text-[11px] text-rose-500 font-medium pl-1">{err}</p>}
              </div>
            ))}
          </div>

          {/* Explanation (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-200">
                Explanation (Optional)
              </label>
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain why this answer is correct for the review screen"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Save Question</span>
          </button>
        </form>

        {/* Live Preview Card */}
        {showPreview && (
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Live Quiz Preview</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                {category}
              </span>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                {questionText || 'Your question prompt will appear here...'}
              </h3>

              <div className="space-y-2">
                {[
                  { l: 'A', text: optionA, idx: 0 },
                  { l: 'B', text: optionB, idx: 1 },
                  { l: 'C', text: optionC, idx: 2 },
                  { l: 'D', text: optionD, idx: 3 },
                ].map(({ l, text, idx }) => (
                  <div
                    key={l}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      correctAnswerIndex === idx
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[11px]">
                        {l}
                      </span>
                      <span>{text || `Option ${l}`}</span>
                    </div>
                    {correctAnswerIndex === idx && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        (Correct Answer)
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {explanation && (
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-[11px] text-indigo-800 dark:text-indigo-300">
                  <span className="font-bold">Explanation: </span>
                  {explanation}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
