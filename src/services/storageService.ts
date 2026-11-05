import { QuizQuestion, QuizScoreRecord, CategoryId } from '../types/quiz';

const CUSTOM_QUESTIONS_KEY = 'quizmaster_custom_questions';
const HIGH_SCORES_KEY = 'quizmaster_high_scores';
const STATS_KEY = 'quizmaster_user_stats';

export interface UserStats {
  quizzesPlayed: number;
  totalCorrect: number;
  totalAnswered: number;
  bestOverallScore: number;
  streakDays: number;
  lastPlayedDate: string;
}

export const storageService = {
  // Custom Questions
  getCustomQuestions(): QuizQuestion[] {
    try {
      const data = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load custom questions', e);
      return [];
    }
  },

  saveCustomQuestion(question: QuizQuestion): boolean {
    try {
      const questions = this.getCustomQuestions();
      questions.unshift(question);
      localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(questions));
      return true;
    } catch (e) {
      console.error('Failed to save custom question', e);
      return false;
    }
  },

  deleteCustomQuestion(id: string): boolean {
    try {
      const questions = this.getCustomQuestions().filter((q) => q.id !== id);
      localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(questions));
      return true;
    } catch (e) {
      console.error('Failed to delete custom question', e);
      return false;
    }
  },

  // High Scores / Leaderboard
  getHighScores(): QuizScoreRecord[] {
    try {
      const data = localStorage.getItem(HIGH_SCORES_KEY);
      if (!data) return [];
      const scores: QuizScoreRecord[] = JSON.parse(data);
      // Sort highest score first, then percentage
      return scores.sort((a, b) => b.score - a.score || b.percentage - a.percentage);
    } catch (e) {
      console.error('Failed to load high scores', e);
      return [];
    }
  },

  saveScore(record: QuizScoreRecord): void {
    try {
      const scores = this.getHighScores();
      scores.unshift(record);
      // Keep top 50 scores
      const trimmed = scores.slice(0, 50);
      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(trimmed));

      // Update aggregate stats
      this.updateUserStats(record);
    } catch (e) {
      console.error('Failed to save score record', e);
    }
  },

  clearHighScores(): void {
    localStorage.removeItem(HIGH_SCORES_KEY);
  },

  getBestScoreForCategory(categoryId: CategoryId): number {
    const scores = this.getHighScores();
    const categoryScores = scores.filter((s) => s.category === categoryId);
    if (categoryScores.length === 0) return 0;
    return Math.max(...categoryScores.map((s) => s.score));
  },

  getOverallHighestScore(): number {
    const scores = this.getHighScores();
    if (scores.length === 0) return 0;
    return Math.max(...scores.map((s) => s.score));
  },

  // Aggregated Stats
  getUserStats(): UserStats {
    try {
      const data = localStorage.getItem(STATS_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return {
      quizzesPlayed: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      bestOverallScore: 0,
      streakDays: 1,
      lastPlayedDate: new Date().toISOString(),
    };
  },

  updateUserStats(newRecord: QuizScoreRecord): void {
    const current = this.getUserStats();
    const today = new Date().toISOString().split('T')[0];
    const lastDate = current.lastPlayedDate ? current.lastPlayedDate.split('T')[0] : '';
    
    let newStreak = current.streakDays;
    if (lastDate !== today) {
      newStreak = current.streakDays + 1;
    }

    const updated: UserStats = {
      quizzesPlayed: current.quizzesPlayed + 1,
      totalCorrect: current.totalCorrect + Math.round((newRecord.score / 100)),
      totalAnswered: current.totalAnswered + newRecord.totalQuestions,
      bestOverallScore: Math.max(current.bestOverallScore, newRecord.score),
      streakDays: newStreak,
      lastPlayedDate: new Date().toISOString(),
    };
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  },
};
