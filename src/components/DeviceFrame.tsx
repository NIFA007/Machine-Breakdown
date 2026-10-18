import React, { useState, useEffect } from 'react';
import { DevicePlatform } from '../types';

interface DeviceFrameProps {
  platform: DevicePlatform;
  onPlatformChange: (platform: DevicePlatform) => void;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  platform,
  onPlatformChange,
  children,
}) => {
  const [currentTime, setCurrentTime] = useState('10:48');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  if (platform === 'responsive') {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
        {/* Top Platform Switcher Floating Bar */}
        <header className="sticky top-0 z-50 bg-[#131b2e] text-white px-4 py-2 flex items-center justify-between text-xs shadow-md border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold tracking-wider uppercase text-[11px] text-slate-200">
              Breakdown Tracker • Shop Floor Terminal
            </span>
          </div>
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => onPlatformChange('android')}
              className="px-2.5 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 flex items-center gap-1 transition-all"
              title="Switch to Android Shell"
            >
              <span>🤖</span>
              <span className="font-medium">Android</span>
            </button>
            <button
              onClick={() => onPlatformChange('ios')}
              className="px-2.5 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 flex items-center gap-1 transition-all"
              title="Switch to iOS Shell"
            >
              <span>🍎</span>
              <span className="font-medium">iOS</span>
            </button>
            <button
              onClick={() => onPlatformChange('responsive')}
              className="px-2.5 py-1 rounded bg-slate-900 text-white font-bold shadow flex items-center gap-1"
              title="Fullscreen Responsive View"
            >
              <span>🖥️</span>
              <span className="font-medium">Desktop/Tablet</span>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto shadow-sm bg-white">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-2 sm:p-6 flex flex-col items-center justify-start overflow-x-hidden selection:bg-slate-300">
      {/* Top Device Platform Switcher Toolbar */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-xs shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm">{platform === 'android' ? '🤖' : '🍎'}</span>
          <span className="font-bold text-slate-200 text-[11px] uppercase tracking-wider">
            {platform === 'android' ? 'Android Rugged Frame' : 'iOS 18 Frame'}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => onPlatformChange('android')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              platform === 'android'
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Android
          </button>
          <button
            onClick={() => onPlatformChange('ios')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              platform === 'ios'
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            iOS
          </button>
          <button
            onClick={() => onPlatformChange('responsive')}
            className="px-2 py-1 rounded text-slate-400 hover:text-slate-200"
            title="Expand Fullscreen"
          >
            Full
          </button>
        </div>
      </div>

      {/* Realistic Mobile Device Container */}
      <div
        className={`w-full max-w-[430px] bg-black shadow-2xl relative transition-all duration-300 flex flex-col ${
          platform === 'android'
            ? 'rounded-[38px] border-[10px] border-[#222938] ring-1 ring-slate-700/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
            : 'rounded-[50px] border-[11px] border-[#1e2330] ring-1 ring-slate-600/40 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)]'
        }`}
        style={{ minHeight: '884px' }}
      >
        {/* Android / iOS Speaker Grille / Antenna Accents */}
        {platform === 'ios' && (
          <>
            {/* Left volume buttons simulation */}
            <div className="hidden sm:block absolute -left-[14px] top-28 w-[3px] h-10 bg-slate-700 rounded-l"></div>
            <div className="hidden sm:block absolute -left-[14px] top-42 w-[3px] h-12 bg-slate-700 rounded-l"></div>
            <div className="hidden sm:block absolute -left-[14px] top-58 w-[3px] h-12 bg-slate-700 rounded-l"></div>
            {/* Right power button simulation */}
            <div className="hidden sm:block absolute -right-[14px] top-36 w-[3px] h-16 bg-slate-700 rounded-r"></div>
          </>
        )}

        {/* STATUS BAR */}
        {platform === 'ios' ? (
          /* iOS Dynamic Island Status Bar */
          <div className="h-11 bg-white flex items-center justify-between px-6 select-none relative z-50 text-[#0b1c30]">
            <span className="font-semibold text-xs tracking-tight">{currentTime}</span>
            {/* Dynamic Island pill */}
            <div className="w-24 h-6 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1e293b] border border-[#334155]"></span>
              <span className="w-2 h-2 rounded-full bg-[#059669]/60"></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
              <span className="material-symbols-outlined text-[14px]">wifi</span>
              <span className="material-symbols-outlined text-[16px]">battery_full</span>
            </div>
          </div>
        ) : (
          /* Android Status Bar */
          <div className="h-9 bg-white flex items-center justify-between px-5 select-none relative z-50 text-[#0b1c30] border-b border-slate-100">
            <span className="font-semibold text-xs tracking-tight">{currentTime}</span>
            {/* Center camera punch hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-black shadow-inner"></div>
            <div className="flex items-center gap-1.5 text-xs text-slate-700">
              <span className="text-[10px] font-bold">5G</span>
              <span className="material-symbols-outlined text-[15px]">wifi</span>
              <span className="material-symbols-outlined text-[16px]">battery_std</span>
            </div>
          </div>
        )}

        {/* SCREEN APP CONTENT CONTAINER */}
        <div className="flex-1 w-full bg-[#f8f9ff] flex flex-col relative overflow-y-auto no-scrollbar">
          {children}
        </div>

        {/* SYSTEM NAVIGATION BAR AT BOTTOM */}
        {platform === 'ios' ? (
          /* iOS Home Indicator Bar */
          <div className="h-6 bg-white/95 backdrop-blur-md flex items-center justify-center select-none border-t border-slate-100">
            <div className="w-32 h-1 bg-slate-900 rounded-full opacity-80"></div>
          </div>
        ) : (
          /* Android 3-Button or Gesture Nav Bar */
          <div className="h-7 bg-white/95 backdrop-blur-md flex items-center justify-around px-10 select-none border-t border-slate-100 text-slate-500">
            <button className="text-slate-400 hover:text-slate-800 active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-[18px]">menu</span>
            </button>
            <button className="text-slate-400 hover:text-slate-800 active:scale-90 transition-transform">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-current"></div>
            </button>
            <button className="text-slate-400 hover:text-slate-800 active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
