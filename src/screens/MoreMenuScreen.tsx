import React, { useState } from 'react';
import { UserRole, ShiftType, DevicePlatform } from '../types';
import { USER_AVATAR } from '../data/mockData';

interface MoreMenuScreenProps {
  currentRole: UserRole;
  currentShift: ShiftType;
  currentPlant: string;
  platform: DevicePlatform;
  onRoleChange: (role: UserRole) => void;
  onShiftChange: (shift: ShiftType) => void;
  onPlatformChange: (platform: DevicePlatform) => void;
  onLogout: () => void;
}

export const MoreMenuScreen: React.FC<MoreMenuScreenProps> = ({
  currentRole,
  currentShift,
  currentPlant,
  platform,
  onRoleChange,
  onShiftChange,
  onPlatformChange,
  onLogout,
}) => {
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [showSopModal, setShowSopModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [handoverNote, setHandoverNote] = useState('');

  const handleForceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('Floor IoT Nodes & PLC telemetry synchronized successfully (14ms latency).');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-32 bg-[#f8f9ff]">
      <div className="px-3 sm:px-4 space-y-4 pt-3 text-left">
        {/* User Profile Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={USER_AVATAR}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-sm"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">Ramesh K. (EMP-MH-4092)</span>
              <span className="text-xs text-slate-500">{currentPlant}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-2 py-0.5 rounded bg-[#131b2e] text-white text-[10px] font-bold uppercase tracking-wider">
                  Role: {currentRole}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold">
                  {currentShift}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 transition-colors"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>

        {/* Quick Role Simulator */}
        <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Switch Role Simulator
            </span>
            <span className="text-[10px] text-slate-400">Preview UI as role</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['Operator', 'Technician', 'Supervisor', 'Admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => onRoleChange(r)}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                  currentRole === r
                    ? 'bg-[#131b2e] text-white border-[#131b2e] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Shift Handover & Floor Operations */}
        <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Shift Operations &amp; Logs
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => setShowHandoverModal(true)}
              className="p-3 rounded-lg bg-slate-50 hover:bg-[#eff4ff] border border-slate-200 text-left flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-blue-700 text-[20px]">
                  assignment_turned_in
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Shift Handover Log</div>
                  <div className="text-[10px] text-slate-500">Record open tickets &amp; notes</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
            </button>

            <button
              onClick={() => setShowSopModal(true)}
              className="p-3 rounded-lg bg-slate-50 hover:bg-[#eff4ff] border border-slate-200 text-left flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#b61722] text-[20px]">
                  menu_book
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Factory SOP Library</div>
                  <div className="text-[10px] text-slate-500">Safety manuals &amp; guidelines</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Device Shell & Presentation Switcher */}
        <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Mobile Platform Simulator
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onPlatformChange('android')}
              className={`p-2.5 rounded-lg flex flex-col items-center gap-1 border transition-all ${
                platform === 'android'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-lg">🤖</span>
              <span className="text-xs">Android Frame</span>
            </button>
            <button
              onClick={() => onPlatformChange('ios')}
              className={`p-2.5 rounded-lg flex flex-col items-center gap-1 border transition-all ${
                platform === 'ios'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-lg">🍎</span>
              <span className="text-xs">iOS 18 Frame</span>
            </button>
            <button
              onClick={() => onPlatformChange('responsive')}
              className={`p-2.5 rounded-lg flex flex-col items-center gap-1 border transition-all ${
                platform === 'responsive'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-lg">🖥️</span>
              <span className="text-xs">Full Screen</span>
            </button>
          </div>
        </div>

        {/* Shop Floor Diagnostics & Manual Force Sync */}
        <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900">Floor Network Connection</span>
              <span className="text-[11px] text-slate-500 block">Ping: 14ms • Server: Online</span>
            </div>
            <button
              onClick={handleForceSync}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-lg bg-[#131b2e] text-white text-xs font-bold flex items-center gap-1 active:scale-95 disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isSyncing ? 'Syncing...' : 'Force Sync'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shift Handover Modal */}
      {showHandoverModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 space-y-3 text-left">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase">
                Create Shift Handover Note
              </span>
              <button
                onClick={() => setShowHandoverModal(false)}
                className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Handover from <strong>{currentShift}</strong> to next incoming shift team:
            </p>
            <textarea
              rows={4}
              value={handoverNote}
              onChange={(e) => setHandoverNote(e.target.value)}
              placeholder="e.g. Press P-04 O-ring replaced, viton seal cure period ends at 11:30. CNC Mill-02 coolant chiller flushed..."
              className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
            />
            <button
              onClick={() => {
                alert('Handover note logged and broadcasted to incoming Shift B supervisor.');
                setShowHandoverModal(false);
              }}
              className="w-full h-10 bg-[#131b2e] text-white text-xs font-bold uppercase rounded-lg shadow"
            >
              Broadcast Handover
            </button>
          </div>
        </div>
      )}

      {/* SOP Modal */}
      {showSopModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 space-y-3 text-left max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase">Factory SOP Library</span>
              <button
                onClick={() => setShowSopModal(false)}
                className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900">SOP 104-B: Personal Protective Equipment</div>
                <div className="text-slate-600 text-[11px] mt-0.5">Steel toe boots, safety goggles, and high-temp gloves in Stamping Bay.</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900">SOP 208: Hydraulic Circuit Lockout-Tagout</div>
                <div className="text-slate-600 text-[11px] mt-0.5">Depressurize accumulator cylinder before loosening manifold bolts.</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900">SOP 312: Robotic Cell Light Curtain Bypass</div>
                <div className="text-slate-600 text-[11px] mt-0.5">Authorized keyholder required for teach pendant manual jog mode.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
