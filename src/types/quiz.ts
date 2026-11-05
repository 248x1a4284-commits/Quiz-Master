export type CategoryId = 
  | 'programming'
  | 'computer-science'
  | 'general-knowledge'
  | 'science'
  | 'mathematics'
  | 'technology'
  | 'custom';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  question: string;
  category: CategoryId;
  options: [string, string, string, string];
  correctAnswerIndex: number; // 0, 1, 2, 3
  explanation?: string;
  isCustom?: boolean;
  difficulty?: DifficultyLevel;
  createdAt?: string;
}

export interface QuizCategory {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
  color: string;
  gradient: string;
  accentColor: string;
  questionCount?: number;
  apiCategoryId?: number; // OpenTDB category ID
}

export interface QuizResult {
  id: string;
  categoryId: CategoryId;
  categoryName: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: string;
  answers: {
    questionId: string;
    questionText: string;
    options: string[];
    userAnswerIndex: number;
    correctAnswerIndex: number;
    isCorrect: boolean;
    explanation?: string;
  }[];
}

export interface QuizScoreRecord {
  id: string;
  category: CategoryId;
  categoryName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
}

export interface QuizState {
  currentCategory: QuizCategory | null;
  questions: QuizQuestion[];
  currentIndex: number;
  selectedAnswerIndex: number | null;
  isAnswerSubmitted: boolean;
  score: number;
  correctCount: number;
  incorrectCount: number;
  answersHistory: {
    questionId: string;
    questionText: string;
    options: string[];
    userAnswerIndex: number;
    correctAnswerIndex: number;
    isCorrect: boolean;
    explanation?: string;
  }[];
  isCompleted: boolean;
  timeRemaining: number;
  timerActive: boolean;
  eliminatedOptions: number[]; // 50:50 lifeline
}
