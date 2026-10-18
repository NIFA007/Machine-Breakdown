import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  openCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  openCount = 4,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-2px_12px_rgba(0,0,0,0.05)] select-none">
      <div className="h-16 px-2 flex items-center justify-around relative max-w-lg mx-auto">
        {/* Dashboard Tab */}
        <button
          onClick={() => onTabChange('dashboard')}
          aria-label="Dashboard"
          className={`flex flex-col items-center justify-center min-w-[52px] h-12 transition-colors active:scale-95 ${
            activeTab === 'dashboard'
              ? 'text-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          type="button"
        >
          <span
            className={`material-symbols-outlined text-[22px] ${
              activeTab === 'dashboard' ? 'material-symbols-filled' : ''
            }`}
          >
            dashboard
          </span>
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Dashboard</span>
        </button>

        {/* Breakdowns Queue Tab */}
        <button
          onClick={() => onTabChange('breakdowns')}
          aria-label="Breakdowns"
          className={`flex flex-col items-center justify-center min-w-[52px] h-12 relative transition-colors active:scale-95 ${
            activeTab === 'breakdowns'
              ? 'text-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          type="button"
        >
          <div className="relative leading-none">
            <span
              className={`material-symbols-outlined text-[22px] ${
                activeTab === 'breakdowns' ? 'material-symbols-filled' : ''
              }`}
            >
              handyman
            </span>
            {openCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#b61722] text-white text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center leading-none shadow-sm">
                {openCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Breakdowns</span>
        </button>

        {/* Elevated REPORT (+) Action Button */}
        <div className="flex items-center justify-center px-1 -mt-5">
          <button
            onClick={() => onTabChange('report')}
            aria-label="Report Breakdown"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#d95f00] hover:bg-[#c25400] text-white flex flex-col items-center justify-center shadow-lg shadow-orange-700/30 active:scale-95 transition-all ring-4 ring-white"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">add</span>
            <span className="text-[9px] font-extrabold tracking-tight uppercase leading-none -mt-0.5">
              Report
            </span>
          </button>
        </div>

        {/* Machines Fleet Tab */}
        <button
          onClick={() => onTabChange('machines')}
          aria-label="Machines"
          className={`flex flex-col items-center justify-center min-w-[52px] h-12 transition-colors active:scale-95 ${
            activeTab === 'machines'
              ? 'text-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          type="button"
        >
          <span
            className={`material-symbols-outlined text-[22px] ${
              activeTab === 'machines' ? 'material-symbols-filled' : ''
            }`}
          >
            precision_manufacturing
          </span>
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Machines</span>
        </button>

        {/* Calendar Tab */}
        <button
          onClick={() => onTabChange('calendar')}
          aria-label="Maintenance Calendar"
          className={`flex flex-col items-center justify-center min-w-[52px] h-12 transition-colors active:scale-95 ${
            activeTab === 'calendar'
              ? 'text-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          type="button"
        >
          <span
            className={`material-symbols-outlined text-[22px] ${
              activeTab === 'calendar' ? 'material-symbols-filled' : ''
            }`}
          >
            calendar_today
          </span>
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Calendar</span>
        </button>

        {/* Plant Reports Tab */}
        <button
          onClick={() => onTabChange('reports')}
          aria-label="Reports"
          className={`flex flex-col items-center justify-center min-w-[52px] h-12 transition-colors active:scale-95 ${
            activeTab === 'reports' || activeTab === 'more'
              ? 'text-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          type="button"
        >
          <span
            className={`material-symbols-outlined text-[22px] ${
              activeTab === 'reports' || activeTab === 'more' ? 'material-symbols-filled' : ''
            }`}
          >
            analytics
          </span>
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">Reports</span>
        </button>
      </div>
    </nav>
  );
};
