import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  QuizCategory,
  QuizQuestion,
  QuizResult,
  QuizScoreRecord,
  CategoryId,
  DifficultyLevel,
} from '../types/quiz';
import { QUIZ_CATEGORIES } from '../data/categories';
import { INITIAL_QUESTIONS } from '../data/initialQuestions';
import { storageService, UserStats } from '../services/storageService';
import { fetchQuestionsFromApi } from '../services/openTdbService';
import { soundFX } from '../utils/audio';

export type ScreenType =
  | 'home'
  | 'categories'
  | 'question'
  | 'results'
  | 'add-question'
  | 'leaderboard'
  | 'my-quizzes'
  | 'flutter-code';

interface QuizContextType {
  // Navigation
  currentScreen: ScreenType;
  navigateTo: (screen: ScreenType) => void;

  // Categories & Questions
  categories: QuizCategory[];
  activeCategory: QuizCategory | null;
  activeQuestions: QuizQuestion[];
  currentIndex: number;
  currentQuestion: QuizQuestion | null;

  // Question State
  selectedOption: number | null;
  isSubmitted: boolean;
  score: number;
  correctCount: number;
  incorrectCount: number;
  timeRemaining: number;
  timerEnabled: boolean;
  setTimerEnabled: (enabled: boolean) => void;
  eliminatedOptions: number[];
  usedLifelineFiftyFifty: boolean;

  // Quiz Lifecycle Actions
  startQuiz: (category: QuizCategory, useApi?: boolean, difficulty?: DifficultyLevel) => Promise<void>;
  selectOption: (index: number) => void;
  confirmAnswer: () => void;
  nextQuestion: () => void;
  restartQuiz: () => void;
  applyFiftyFifty: () => void;
  skipQuestion: () => void;

  // Results & History
  lastResult: QuizResult | null;
  highScores: QuizScoreRecord[];
  userStats: UserStats;
  clearAllScores: () => void;

  // Custom Questions
  customQuestions: QuizQuestion[];
  addCustomQuestion: (question: Omit<QuizQuestion, 'id'>) => boolean;
  deleteCustomQuestion: (id: string) => boolean;

  // Settings & Audio
  isSoundMuted: boolean;
  toggleSound: () => void;
  isLoading: boolean;
  apiError: string | null;
  setApiError: (err: string | null) => void;
  isDeviceMode: boolean;
  toggleDeviceMode: () => void;
}

const QuizContext = createContext<QuizContextType | null>(null);

const QUESTION_TIMER_SECONDS = 20;

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [categories, setCategories] = useState<QuizCategory[]>(QUIZ_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<QuizCategory | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [answersHistory, setAnswersHistory] = useState<QuizResult['answers']>([]);

  const [timeRemaining, setTimeRemaining] = useState<number>(QUESTION_TIMER_SECONDS);
  const [timerEnabled, setTimerEnabled] = useState<boolean>(true);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [usedLifelineFiftyFifty, setUsedLifelineFiftyFifty] = useState<boolean>(false);

  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [highScores, setHighScores] = useState<QuizScoreRecord[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(storageService.getUserStats());
  const [customQuestions, setCustomQuestions] = useState<QuizQuestion[]>([]);

  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(soundFX.getMuted());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isDeviceMode, setIsDeviceMode] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const quizStartTimeRef = useRef<number>(Date.now());

  // Load storage data on init
  useEffect(() => {
    const custom = storageService.getCustomQuestions();
    setCustomQuestions(custom);
    setHighScores(storageService.getHighScores());
    setUserStats(storageService.getUserStats());
  }, []);

  // Recalculate question counts per category
  useEffect(() => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === 'custom') {
          return { ...cat, questionCount: customQuestions.length };
        }
        const count = INITIAL_QUESTIONS.filter((q) => q.category === cat.id).length;
        return { ...cat, questionCount: count };
      })
    );
  }, [customQuestions]);

  const toggleSound = useCallback(() => {
    const muted = soundFX.toggleMute();
    setIsSoundMuted(muted);
  }, []);

  const toggleDeviceMode = useCallback(() => {
    setIsDeviceMode((prev) => !prev);
  }, []);

  const navigateTo = useCallback((screen: ScreenType) => {
    soundFX.playTap();
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentQuestion = activeQuestions[currentIndex] || null;

  // Complete Quiz & Compute Results
  const finishQuiz = useCallback(
    (finalScore: number, finalCorrect: number, finalIncorrect: number, finalHistory: QuizResult['answers']) => {
      if (timerRef.current) clearInterval(timerRef.current);

      const total = activeQuestions.length;
      const percentage = total > 0 ? Math.round((finalCorrect / total) * 100) : 0;
      const timeSpent = Math.max(1, Math.round((Date.now() - quizStartTimeRef.current) / 1000));

      const result: QuizResult = {
        id: `result-${Date.now()}`,
        categoryId: activeCategory?.id || 'programming',
        categoryName: activeCategory?.name || 'Quiz',
        totalQuestions: total,
        correctAnswers: finalCorrect,
        incorrectAnswers: finalIncorrect,
        score: finalScore,
        percentage,
        timeSpentSeconds: timeSpent,
        completedAt: new Date().toISOString(),
        answers: finalHistory,
      };

      setLastResult(result);

      // Save high score record
      const scoreRecord: QuizScoreRecord = {
        id: `score-${Date.now()}`,
        category: result.categoryId,
        categoryName: result.categoryName,
        score: finalScore,
        totalQuestions: total,
        percentage,
        date: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };
      storageService.saveScore(scoreRecord);
      setHighScores(storageService.getHighScores());
      setUserStats(storageService.getUserStats());

      if (percentage >= 70) {
        soundFX.playFanfare();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        soundFX.playTap();
      }

      setCurrentScreen('results');
    },
    [activeCategory, activeQuestions.length]
  );

  // Confirm / Submit Current Answer
  const confirmAnswer = useCallback(() => {
    if (!currentQuestion || isSubmitted) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const userAns = selectedOption !== null ? selectedOption : -1;
    const isCorrect = userAns === currentQuestion.correctAnswerIndex;

    const newScore = isCorrect ? score + 100 : score;
    const newCorrect = isCorrect ? correctCount + 1 : correctCount;
    const newIncorrect = !isCorrect ? incorrectCount + 1 : incorrectCount;

    setScore(newScore);
    setCorrectCount(newCorrect);
    setIncorrectCount(newIncorrect);
    setIsSubmitted(true);

    const historyItem = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      options: [...currentQuestion.options],
      userAnswerIndex: userAns,
      correctAnswerIndex: currentQuestion.correctAnswerIndex,
      isCorrect,
      explanation: currentQuestion.explanation,
    };

    setAnswersHistory((prev) => [...prev, historyItem]);

    if (isCorrect) {
      soundFX.playCorrect();
    } else {
      soundFX.playIncorrect();
    }
  }, [currentQuestion, isSubmitted, selectedOption, score, correctCount, incorrectCount]);

  // Next Question logic
  const nextQuestion = useCallback(() => {
    soundFX.playTap();
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setTimeRemaining(QUESTION_TIMER_SECONDS);
      setEliminatedOptions([]);
    } else {
      // Last question finished
      finishQuiz(score, correctCount, incorrectCount, answersHistory);
    }
  }, [currentIndex, activeQuestions.length, finishQuiz, score, correctCount, incorrectCount, answersHistory]);

  // Timer countdown hook
  useEffect(() => {
    if (currentScreen !== 'question' || !timerEnabled || isSubmitted || activeQuestions.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          confirmAnswer();
          return 0;
        }
        if (prev <= 5) {
          soundFX.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentScreen, timerEnabled, isSubmitted, currentIndex, activeQuestions.length, confirmAnswer]);

  // Start a Quiz
  const startQuiz = useCallback(
    async (category: QuizCategory, useApi: boolean = false, difficulty?: DifficultyLevel) => {
      setIsLoading(true);
      setApiError(null);
      setActiveCategory(category);
      quizStartTimeRef.current = Date.now();

      let questionsToPlay: QuizQuestion[] = [];

      try {
        if (category.id === 'custom') {
          const stored = storageService.getCustomQuestions();
          if (stored.length === 0) {
            setApiError('No custom questions found. Create some questions first!');
            setIsLoading(false);
            return;
          }
          questionsToPlay = [...stored];
        } else if (useApi && category.apiCategoryId) {
          try {
            questionsToPlay = await fetchQuestionsFromApi(category.id, category.apiCategoryId, 5, difficulty);
          } catch (err) {
            console.warn('API fetch failed, falling back to local questions', err);
            setApiError('Live Trivia API was busy or offline. Loaded offline curated questions!');
            // Fallback to local
            questionsToPlay = INITIAL_QUESTIONS.filter((q) => q.category === category.id);
          }
        } else {
          // Local curated questions
          questionsToPlay = INITIAL_QUESTIONS.filter((q) => q.category === category.id);
          if (difficulty) {
            const filtered = questionsToPlay.filter((q) => q.difficulty === difficulty);
            if (filtered.length >= 3) {
              questionsToPlay = filtered;
            }
          }
        }

        // Shuffle questions
        for (let i = questionsToPlay.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questionsToPlay[i], questionsToPlay[j]] = [questionsToPlay[j], questionsToPlay[i]];
        }

        // Take 5 questions per session for an engaging mobile quiz round
        const sessionQuestions = questionsToPlay.slice(0, 5);

        if (sessionQuestions.length === 0) {
          setApiError('No questions available in this category.');
          setIsLoading(false);
          return;
        }

        setActiveQuestions(sessionQuestions);
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsSubmitted(false);
        setScore(0);
        setCorrectCount(0);
        setIncorrectCount(0);
        setAnswersHistory([]);
        setTimeRemaining(QUESTION_TIMER_SECONDS);
        setEliminatedOptions([]);
        setUsedLifelineFiftyFifty(false);

        soundFX.playTap();
        setCurrentScreen('question');
      } catch (err) {
        console.error('Failed to start quiz:', err);
        setApiError('Could not start quiz. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const selectOption = useCallback(
    (index: number) => {
      if (isSubmitted) return; // Prevent changing after submission
      soundFX.playTap();
      setSelectedOption(index);
    },
    [isSubmitted]
  );

  const restartQuiz = useCallback(() => {
    if (activeCategory) {
      startQuiz(activeCategory, false);
    } else {
      navigateTo('categories');
    }
  }, [activeCategory, startQuiz, navigateTo]);

  // 50:50 Lifeline: removes 2 incorrect options
  const applyFiftyFifty = useCallback(() => {
    if (usedLifelineFiftyFifty || !currentQuestion || isSubmitted) return;
    soundFX.playTap();

    const correct = currentQuestion.correctAnswerIndex;
    const incorrectIndices = [0, 1, 2, 3].filter((i) => i !== correct);

    // Shuffle and pick 2 to eliminate
    for (let i = incorrectIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [incorrectIndices[i], incorrectIndices[j]] = [incorrectIndices[j], incorrectIndices[i]];
    }

    const toEliminate = incorrectIndices.slice(0, 2);
    setEliminatedOptions(toEliminate);
    setUsedLifelineFiftyFifty(true);
  }, [usedLifelineFiftyFifty, currentQuestion, isSubmitted]);

  // Skip Question Lifeline
  const skipQuestion = useCallback(() => {
    if (isSubmitted) return;
    soundFX.playTap();
    // Record as skipped (incorrect)
    const historyItem = {
      questionId: currentQuestion?.id || `skip-${Date.now()}`,
      questionText: currentQuestion?.question || 'Question Skipped',
      options: currentQuestion ? [...currentQuestion.options] : [],
      userAnswerIndex: -1,
      correctAnswerIndex: currentQuestion?.correctAnswerIndex ?? 0,
      isCorrect: false,
      explanation: 'Question was skipped by user.',
    };
    setAnswersHistory((prev) => [...prev, historyItem]);
    setIncorrectCount((prev) => prev + 1);

    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setTimeRemaining(QUESTION_TIMER_SECONDS);
      setEliminatedOptions([]);
    } else {
      finishQuiz(score, correctCount, incorrectCount + 1, [...answersHistory, historyItem]);
    }
  }, [isSubmitted, currentQuestion, currentIndex, activeQuestions.length, finishQuiz, score, correctCount, incorrectCount, answersHistory]);

  const addCustomQuestion = useCallback((q: Omit<QuizQuestion, 'id'>): boolean => {
    const newQuestion: QuizQuestion = {
      ...q,
      id: `custom-${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    const saved = storageService.saveCustomQuestion(newQuestion);
    if (saved) {
      setCustomQuestions(storageService.getCustomQuestions());
    }
    return saved;
  }, []);

  const deleteCustomQuestion = useCallback((id: string): boolean => {
    const success = storageService.deleteCustomQuestion(id);
    if (success) {
      setCustomQuestions(storageService.getCustomQuestions());
    }
    return success;
  }, []);

  const clearAllScores = useCallback(() => {
    storageService.clearHighScores();
    setHighScores([]);
  }, []);

  return (
    <QuizContext.Provider
      value={{
        currentScreen,
        navigateTo,
        categories,
        activeCategory,
        activeQuestions,
        currentIndex,
        currentQuestion,
        selectedOption,
        isSubmitted,
        score,
        correctCount,
        incorrectCount,
        timeRemaining,
        timerEnabled,
        setTimerEnabled,
        eliminatedOptions,
        usedLifelineFiftyFifty,
        startQuiz,
        selectOption,
        confirmAnswer,
        nextQuestion,
        restartQuiz,
        applyFiftyFifty,
        skipQuestion,
        lastResult,
        highScores,
        userStats,
        clearAllScores,
        customQuestions,
        addCustomQuestion,
        deleteCustomQuestion,
        isSoundMuted,
        toggleSound,
        isLoading,
        apiError,
        setApiError,
        isDeviceMode,
        toggleDeviceMode,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
