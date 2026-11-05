import React from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { Header } from './components/Header';
import { DeviceFrame } from './components/DeviceFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { CategoriesScreen } from './components/screens/CategoriesScreen';
import { QuestionScreen } from './components/screens/QuestionScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { AddQuestionScreen } from './components/screens/AddQuestionScreen';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen';
import { MyQuizzesScreen } from './components/screens/MyQuizzesScreen';
import { FlutterCodeViewer } from './components/screens/FlutterCodeViewer';
import {
  Home,
  Grid,
  Trophy,
  PlusCircle,
  FileCode,
} from 'lucide-react';

const ScreenRouter: React.FC = () => {
  const { currentScreen, navigateTo } = useQuiz();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'question':
        return <QuestionScreen />;
      case 'results':
        return <ResultsScreen />;
      case 'add-question':
        return <AddQuestionScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'my-quizzes':
        return <MyQuizzesScreen />;
      case 'flutter-code':
        return <FlutterCodeViewer />;
      default:
        return <HomeScreen />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'add-question', label: 'Create', icon: PlusCircle },
    { id: 'leaderboard', label: 'Scores', icon: Trophy },
    { id: 'flutter-code', label: 'Flutter', icon: FileCode },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors pb-16 md:pb-0">
      <Header />

      <main className="flex-1">
        <DeviceFrame>{renderActiveScreen()}</DeviceFrame>
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (Thumb Zone) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-5 items-center h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight mt-1">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Desktop Clean Editorial Footer */}
      <footer className="hidden md:block py-6 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-xs text-slate-500 dark:text-slate-400 text-center">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>QuizMaster Android & Web Application</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('flutter-code')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
            >
              Flutter Project Code
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => navigateTo('my-quizzes')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
            >
              My Quizzes
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => navigateTo('leaderboard')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
            >
              Best Scores
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <QuizProvider>
      <ScreenRouter />
    </QuizProvider>
  );
}
