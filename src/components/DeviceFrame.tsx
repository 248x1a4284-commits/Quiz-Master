import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDeviceMode } = useQuiz();

  if (!isDeviceMode) {
    return <div className="w-full min-h-[calc(100vh-4rem)]">{children}</div>;
  }

  // Simulated Current Time for Android Status Bar
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] py-8 px-4 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 transition-colors">
      <div className="text-center mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Simulated Android Device (Pixel 8 Pro)
        </span>
      </div>

      {/* Android Device Outer Bezel */}
      <div className="relative w-full max-w-[412px] h-[860px] bg-slate-900 rounded-[48px] p-3 shadow-2xl shadow-indigo-950/30 border-4 border-slate-700/60 flex flex-col overflow-hidden">
        {/* Android Punch Hole Camera */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 border border-slate-800 pointer-events-none" />

        {/* Android Status Bar */}
        <div className="w-full h-8 px-6 pt-1 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-medium select-none z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-t-[36px]">
          <span className="text-[11px] font-semibold">{currentTime}</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* Screen Viewport Inside Frame */}
        <div className="relative flex-1 w-full bg-slate-50 dark:bg-slate-900 overflow-y-auto overscroll-contain">
          {children}
        </div>

        {/* Android Bottom Navigation Gesture Bar */}
        <div className="w-full h-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center rounded-b-[36px] z-40">
          <div className="w-28 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
