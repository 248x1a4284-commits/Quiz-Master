import { QuizCategory } from '../types/quiz';

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: 'programming',
    name: 'Programming',
    description: 'Algorithms, data structures, languages & syntax',
    iconName: 'Code2',
    color: 'from-blue-600 to-indigo-600',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
    accentColor: '#3b82f6',
    apiCategoryId: 18, // Computers
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    description: 'Hardware, OS, networking & architecture',
    iconName: 'Cpu',
    color: 'from-violet-600 to-purple-600',
    gradient: 'bg-gradient-to-br from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20',
    accentColor: '#8b5cf6',
    apiCategoryId: 18,
  },
  {
    id: 'general-knowledge',
    name: 'General Knowledge',
    description: 'World history, geography, trivia & culture',
    iconName: 'Globe',
    color: 'from-amber-600 to-orange-600',
    gradient: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
    accentColor: '#f59e0b',
    apiCategoryId: 9, // General Knowledge
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Physics, chemistry, biology & cosmos',
    iconName: 'FlaskConical',
    color: 'from-emerald-600 to-teal-600',
    gradient: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
    accentColor: '#10b981',
    apiCategoryId: 17, // Science & Nature
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Algebra, geometry, logic & calculus',
    iconName: 'Calculator',
    color: 'from-rose-600 to-pink-600',
    gradient: 'bg-gradient-to-br from-rose-500/10 to-pink-500/10 dark:from-rose-500/20 dark:to-pink-500/20',
    accentColor: '#f43f5e',
    apiCategoryId: 19, // Science: Mathematics
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'AI, cloud, cybersecurity & mobile innovations',
    iconName: 'Smartphone',
    color: 'from-cyan-600 to-blue-600',
    gradient: 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20',
    accentColor: '#06b6d4',
    apiCategoryId: 30, // Science: Gadgets
  },
  {
    id: 'custom',
    name: 'My Custom Quizzes',
    description: 'Questions authored and tailored by you',
    iconName: 'Sparkles',
    color: 'from-amber-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-amber-500/10 to-emerald-500/10 dark:from-amber-500/20 dark:to-emerald-500/20',
    accentColor: '#eab308',
  },
];
