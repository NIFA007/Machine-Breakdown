import React, { useState } from 'react';
import { APP_LOGO } from '../data/mockData';
import { UserRole, ShiftType } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole, shift: ShiftType, plant: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedPlant, setSelectedPlant] = useState('Omega Auto Components Ltd - Pune Plant (Unit 02)');
  const [selectedShift, setSelectedShift] = useState<ShiftType>('Shift A');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Operator');
  const [empId, setEmpId] = useState('EMP-MH-4092');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const rolePrefixes: Record<UserRole, string> = {
    Operator: 'EMP-OP-4092',
    Technician: 'TECH-MH-8114',
    Supervisor: 'SUP-PN-1029',
    Admin: 'SYS-ADM-0001',
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmpId(rolePrefixes[role]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole, selectedShift, selectedPlant);
  };

  return (
    <div className="flex flex-col w-full pb-8 bg-[#f8f9ff] min-h-screen">
      <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col gap-4">
        {/* Top System Diagnostic Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#e5eeff] text-[#0b1c30]">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#da3437] animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#45464d]">
              Shop Floor Net
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#45464d]">
            <span className="material-symbols-outlined text-[14px]">wifi</span>
            <span>Online (14ms)</span>
          </div>
        </div>

        {/* Header & Brand Block */}
        <div className="flex flex-col items-center text-center pt-1">
          <div className="relative w-16 h-16 rounded-xl bg-white p-2 shadow-sm flex items-center justify-center mb-2.5 border border-slate-100">
            <img
              alt="Breakdown Tracker Logo"
              className="w-full h-full object-contain"
              src={APP_LOGO}
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#131b2e] text-white text-[9px] font-bold">
              2.4
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0b1c30] tracking-tight">
            Breakdown Tracker
          </h1>
          <p className="text-xs font-medium text-[#45464d] mt-0.5">
            Centralized Plant Maintenance System
          </p>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 sm:p-5 flex flex-col gap-4">
          {/* Facility / Unit Selector */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-bold uppercase text-[#45464d] flex items-center gap-1.5"
              htmlFor="plant-selector"
            >
              <span className="material-symbols-outlined text-[16px]">factory</span>
              Plant &amp; Facility Unit
            </label>
            <div className="relative bg-[#eff4ff] rounded-lg">
              <select
                id="plant-selector"
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                className="w-full h-12 pl-3 pr-10 bg-transparent text-xs sm:text-sm text-[#0b1c30] appearance-none focus:outline-none focus:bg-[#e5eeff] cursor-pointer font-medium"
              >
                <option value="Omega Auto Components Ltd - Pune Plant (Unit 02)">
                  Omega Auto Components Ltd - Pune Plant (Unit 02)
                </option>
                <option value="Omega Auto Components Ltd - Pune Plant (Unit 01)">
                  Omega Auto Components Ltd - Pune Plant (Unit 01)
                </option>
                <option value="Omega Stamping & Press - Sanand Unit">
                  Omega Stamping &amp; Press - Sanand Unit
                </option>
                <option value="Omega Powertrain Division - Manesar Plant">
                  Omega Powertrain Division - Manesar Plant
                </option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#45464d]">
                <span className="material-symbols-outlined text-[20px]">expand_more</span>
              </div>
            </div>
          </div>

          {/* Shift Selection Pills */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase text-[#45464d] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                Current Shift
              </label>
              <span className="text-[11px] text-[#b61722] font-bold">
                Active: {selectedShift}
              </span>
            </div>
            <div aria-label="Shift Selection" className="grid grid-cols-3 gap-2" role="radiogroup">
              {/* Shift A */}
              <button
                type="button"
                onClick={() => setSelectedShift('Shift A')}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg transition-all text-center ${
                  selectedShift === 'Shift A'
                    ? 'bg-[#131b2e] text-white shadow-sm'
                    : 'bg-[#e5eeff] text-[#0b1c30] hover:bg-[#dce9ff]'
                }`}
              >
                <span className="text-[11px] font-bold">Shift A</span>
                <span className="text-[10px] opacity-80 mt-0.5">06:00 - 14:30</span>
              </button>
              {/* Shift B */}
              <button
                type="button"
                onClick={() => setSelectedShift('Shift B')}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg transition-all text-center ${
                  selectedShift === 'Shift B'
                    ? 'bg-[#131b2e] text-white shadow-sm'
                    : 'bg-[#e5eeff] text-[#0b1c30] hover:bg-[#dce9ff]'
                }`}
              >
                <span className="text-[11px] font-bold">Shift B</span>
                <span className="text-[10px] opacity-80 mt-0.5">14:30 - 23:00</span>
              </button>
              {/* Shift C */}
              <button
                type="button"
                onClick={() => setSelectedShift('Shift C')}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg transition-all text-center ${
                  selectedShift === 'Shift C'
                    ? 'bg-[#131b2e] text-white shadow-sm'
                    : 'bg-[#e5eeff] text-[#0b1c30] hover:bg-[#dce9ff]'
                }`}
              >
                <span className="text-[11px] font-bold">Shift C</span>
                <span className="text-[10px] opacity-80 mt-0.5">Night Run</span>
              </button>
            </div>
          </div>

          {/* Credentials Form */}
          <form className="flex flex-col gap-3.5 mt-1" onSubmit={handleSubmit}>
            {/* Employee ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase text-[#45464d]" htmlFor="emp-id">
                Employee ID / Username
              </label>
              <div className="relative flex items-center bg-[#eff4ff] rounded-lg focus-within:bg-[#e5eeff] transition-colors border border-transparent focus-within:border-slate-300">
                <div className="pl-3.5 pr-2 flex items-center text-[#45464d]">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <input
                  id="emp-id"
                  type="text"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  placeholder="e.g. EMP-4092"
                  required
                  className="w-full h-12 bg-transparent pr-3 text-xs sm:text-sm text-[#0b1c30] font-semibold uppercase tracking-wide focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase text-[#45464d]" htmlFor="password-input">
                  Password / Terminal PIN
                </label>
                <button
                  type="button"
                  onClick={() => alert('Demo Terminal Pin: 1234 or leave default')}
                  className="text-[11px] font-semibold text-[#b61722] hover:underline py-0.5"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative flex items-center bg-[#eff4ff] rounded-lg focus-within:bg-[#e5eeff] transition-colors border border-transparent focus-within:border-slate-300">
                <div className="pl-3.5 pr-2 flex items-center text-[#45464d]">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure PIN or password"
                  required
                  className="w-full h-12 bg-transparent pr-12 text-xs sm:text-sm text-[#0b1c30] focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center text-[#45464d] hover:text-[#0b1c30]"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <label className="flex items-center gap-3 py-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#131b2e] rounded accent-[#131b2e]"
              />
              <span className="text-xs sm:text-sm text-[#0b1c30]">
                Remember me on this shop floor device
              </span>
            </label>

            {/* Primary Action CTA */}
            <button
              type="submit"
              className="w-full h-12 mt-1 rounded-lg bg-[#131b2e] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-slate-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to Shift</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </form>

          {/* Industrial Shift Safety Notice */}
          <div className="p-3 rounded-lg bg-[#eff4ff] flex items-start gap-2.5 border border-blue-100">
            <span className="material-symbols-outlined text-[#b61722] text-[20px] shrink-0 mt-0.5">
              verified_user
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-[#0b1c30]">
                Safety Briefing Acknowledged
              </span>
              <span className="text-[11px] text-[#45464d] mt-0.5 leading-snug">
                By signing in, you confirm compliance with Factory SOP 104-B PPE requirements.
              </span>
            </div>
          </div>
        </div>

        {/* Quick Role Switcher for Staging / Shop Floor Testing */}
        <div className="flex flex-col items-center gap-2 mt-1">
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#45464d] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">tune</span>
            <span>Quick Role Simulator</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 w-full">
            {(['Operator', 'Technician', 'Supervisor', 'Admin'] as UserRole[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleSelect(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                  selectedRole === role
                    ? 'bg-[#131b2e] text-white ring-2 ring-blue-500'
                    : 'bg-[#e5eeff] text-[#0b1c30] hover:bg-[#dce9ff]'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Footer System Status Info */}
        <div className="text-center pt-2">
          <p className="text-xs text-[#45464d]">
            Shop Floor Server: <strong className="text-[#0b1c30]">Connected</strong> (Ping 14ms) • App v2.4.1
          </p>
          <p className="text-[10px] text-[#45464d]/70 mt-0.5">
            Industrial Terminal #PUN-BAY2-K08 • Strict Safety Protocol Enforced
          </p>
        </div>
      </div>
    </div>
  );
};
