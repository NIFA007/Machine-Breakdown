import React, { useState } from 'react';
import { APP_LOGO, USER_AVATAR } from '../data/mockData';
import { UserRole, ShiftType } from '../types';

interface TopHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  currentRole: UserRole;
  currentShift: ShiftType;
  currentPlant: string;
  onSelectPlant: (plant: string) => void;
  onSelectShift: (shift: ShiftType) => void;
  onRoleClick?: () => void;
  notificationCount?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title = 'Breakdown Tracker',
  subtitle,
  showBack = false,
  onBack,
  currentRole,
  currentShift,
  currentPlant,
  onSelectPlant,
  onRoleClick,
  notificationCount = 3,
}) => {
  const [showPlantMenu, setShowPlantMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const plants = [
    'Pune Auto Plant - Plant 02',
    'Pune Auto Plant - Plant 01',
    'Sanand Stamping Unit',
    'Manesar Powertrain Facility',
  ];

  const notifications = [
    { id: 1, title: 'CRITICAL ALERT: Press P-04', time: '10:35 AM', desc: 'Hydraulic leak halted Line 2. Response timer running.', unread: true },
    { id: 2, title: 'SLA Warning: CNC Mill-02', time: '09:45 AM', desc: 'Response threshold exceeded 30 mins.', unread: true },
    { id: 3, title: 'Part Arrived: Viton O-Ring', time: '09:12 AM', desc: 'Store released Bin B-14 stock.', unread: false },
  ];

  return (
    <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)] select-none">
      <div className="h-16 sm:h-20 px-3 sm:px-4 flex items-center justify-between gap-2">
        {/* Left: Back or Brand Logo */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack ? (
            <button
              onClick={onBack}
              aria-label="Go back"
              className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 transition-all flex-shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : null}

          <img
            alt="Breakdown Tracker Logo"
            className="h-7 w-auto object-contain flex-shrink-0"
            src={APP_LOGO}
          />

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-tight truncate">
                {title}
              </span>
              {subtitle && (
                <span className="text-[11px] text-slate-500 font-normal truncate hidden xs:inline">
                  • {subtitle}
                </span>
              )}
            </div>

            {/* Plant Selector & Shift Status */}
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <div className="relative">
                <button
                  onClick={() => setShowPlantMenu(!showPlantMenu)}
                  className="inline-flex items-center gap-0.5 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 text-[11px] font-semibold max-w-[140px] sm:max-w-[170px] truncate transition-colors"
                  type="button"
                >
                  <span className="truncate">{currentPlant}</span>
                  <span className="material-symbols-outlined text-[13px] leading-none text-slate-500">
                    expand_more
                  </span>
                </button>

                {showPlantMenu && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50">
                    <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Select Facility
                    </div>
                    {plants.map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          onSelectPlant(p);
                          setShowPlantMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                          p === currentPlant ? 'text-blue-700 font-bold bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate">{p}</span>
                        {p === currentPlant && (
                          <span className="material-symbols-outlined text-[16px] text-blue-600">
                            check
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Current Shift Indicator */}
              <span className="inline-flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b61722] animate-pulse"></span>
                {currentShift} • Running
              </span>
            </div>
          </div>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-1.5 flex-shrink-0 relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 relative transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {notificationCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#b61722] ring-2 ring-white"></span>
            )}
          </button>

          {/* User Profile avatar with role chip */}
          <button
            onClick={onRoleClick}
            aria-label="User profile and role menu"
            className="flex items-center gap-1 p-0.5 rounded-full hover:ring-2 hover:ring-slate-300 transition-all active:scale-95"
            type="button"
          >
            <div className="relative">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                src={USER_AVATAR}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-slate-900 text-white text-[8px] font-bold flex items-center justify-center">
                {currentRole[0]}
              </span>
            </div>
          </button>

          {/* Notification dropdown drawer */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-xs uppercase text-slate-800 tracking-wider">
                  Live Incident Alerts
                </span>
                <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                  2 Active
                </span>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 rounded-lg text-left transition-colors ${
                      n.unread ? 'bg-red-50/70 border border-red-100' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full mt-2 py-1 text-center text-xs font-semibold text-blue-600 hover:underline"
              >
                Close Alerts
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
