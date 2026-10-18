import React, { useState, useEffect } from 'react';
import { BreakdownIncident } from '../types';
import { BAY_SCAN_IMAGE } from '../data/mockData';

interface DashboardScreenProps {
  incidents: BreakdownIncident[];
  onOpenTicket: (id: string) => void;
  onDispatchTech: (incidentId: string) => void;
  onNavigateTab: (tab: 'breakdowns' | 'report' | 'machines' | 'reports') => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  incidents,
  onOpenTicket,
  onDispatchTech,
  onNavigateTab,
}) => {
  const [selectedLine, setSelectedLine] = useState('all');
  const [alertSeconds, setAlertSeconds] = useState(38 * 60 + 14);

  // Live timer tick for critical alert banner
  useEffect(() => {
    const timer = setInterval(() => {
      setAlertSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  const criticalIncident = incidents.find((i) => i.id === 'BD-2025-0842') || incidents[0];

  return (
    <div className="flex flex-col w-full pb-28 bg-[#f8f9ff]">
      {/* Plant & Live Stream Status Header Strip */}
      <section className="px-4 pt-3 pb-2.5 bg-[#eff4ff] border-b border-slate-200/60 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#b61722] text-[20px] material-symbols-filled">
              factory
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[#0b1c30] truncate">
              Plant 02 • Chassis Line
            </h2>
          </div>
          <div className="flex items-center gap-1.5 bg-[#dce9ff] px-2.5 py-0.5 rounded-full flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#b61722] animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#131b2e]">
              Live Stream
            </span>
          </div>
        </div>

        {/* Quick Filter Line Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4">
          {[
            { id: 'all', label: 'All Lines' },
            { id: 'press', label: 'Press Shop' },
            { id: 'assembly', label: 'Assembly' },
            { id: 'paint', label: 'Paint Shop' },
            { id: 'welding', label: 'Welding' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setSelectedLine(pill.id)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all active:scale-95 ${
                selectedLine === pill.id
                  ? 'bg-[#131b2e] text-white font-bold shadow-sm'
                  : 'bg-[#dce9ff] text-slate-700 font-medium hover:bg-slate-300'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </section>

      {/* High-priority Alert Ticker (Press P-04 Critical) */}
      <div className="mx-3 sm:mx-4 mt-3 bg-[#da3437] text-white rounded-xl p-3 shadow-md flex items-center justify-between gap-2.5 overflow-hidden relative">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow">
            <span className="material-symbols-outlined text-[#da3437] text-[20px] animate-bounce material-symbols-filled">
              warning
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-white text-[#da3437] text-[10px] px-1.5 py-0.2 rounded font-extrabold uppercase tracking-wider">
                Critical
              </span>
              <span className="text-xs font-bold truncate">Press P-04 (Line 2)</span>
            </div>
            <p className="text-[11px] opacity-95 truncate mt-0.5">
              Hydraulic Leak — Unassigned ({formatTimer(alertSeconds)} elapsed)
            </p>
          </div>
        </div>
        <button
          onClick={() => onDispatchTech(criticalIncident.id)}
          className="flex-shrink-0 bg-white text-[#da3437] text-xs px-3 py-2 rounded-lg font-bold uppercase tracking-wider shadow active:scale-95 transition-transform"
        >
          Dispatch
        </button>
      </div>

      {/* Overdue SLA Warning Banner */}
      <div className="mx-3 sm:mx-4 mt-2.5 bg-[#ffdbca] border border-orange-200/70 p-3 rounded-xl shadow-sm flex flex-col gap-2">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#783200] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]">notification_important</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-[#783200] uppercase">
                Overdue SLA Warning
              </span>
              <span className="bg-[#b61722] text-white text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                1 Ticket
              </span>
            </div>
            <p className="text-xs text-[#341100] mt-0.5 leading-snug">
              CNC Mill-02 spindle error exceeds 30m response threshold without technician assigned.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-orange-300/40">
          <button
            onClick={() => alert('Escalation SMS and siren alert sent to Line Lead S. Mehta.')}
            className="px-2.5 py-1.5 rounded-lg bg-white text-[#0b1c30] text-xs font-semibold active:scale-95 shadow-sm border border-slate-200"
          >
            Escalate to Line Lead
          </button>
          <button
            onClick={() => onDispatchTech('BD-2025-0839')}
            className="px-3 py-1.5 rounded-lg bg-[#131b2e] text-white text-xs font-bold flex items-center gap-1 active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            Quick-Assign
          </button>
        </div>
      </div>

      {/* Exact 6 Key Performance Metric Cards */}
      <div className="px-3 sm:px-4 mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Line Metrics (Shift A)
          </span>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">sync</span> Sync: Just now
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Breakdowns Today */}
          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Breakdowns Today</span>
              <span className="material-symbols-outlined text-slate-400 text-[18px]">build</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] leading-none font-mono">
                8
              </div>
              <div className="flex items-center gap-1 mt-1 text-[#b61722] text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>+2 vs yday</span>
              </div>
            </div>
          </div>

          {/* Card 2: Open Tickets */}
          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Open Tickets</span>
              <span className="material-symbols-outlined text-slate-400 text-[18px]">pending_actions</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] leading-none font-mono">
                4
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-bold flex-wrap">
                <span className="inline-flex items-center gap-1 text-[#b61722]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b61722]"></span>2 Crit
                </span>
                <span className="inline-flex items-center gap-1 text-[#d95f00]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d95f00]"></span>1 High
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Critical Stoppages */}
          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Critical Stoppages</span>
              <span className="bg-red-100 text-[#b61722] text-[9px] px-1 py-0.5 rounded font-extrabold uppercase">
                Alert
              </span>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#b61722] leading-none font-mono">
                2
              </div>
              <div className="text-[11px] text-slate-600 mt-1 truncate">
                Chassis Main &amp; Bay 3
              </div>
            </div>
          </div>

          {/* Card 4: Total Downtime */}
          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Total Downtime</span>
              <span className="material-symbols-outlined text-orange-500 text-[18px]">timer_off</span>
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-extrabold text-[#d95f00] leading-none font-mono">
                3h 42m
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                Target &lt; 2h 30m
              </div>
            </div>
          </div>

          {/* Card 5 & 6 Full-Width Span: Average MTTR */}
          <div className="col-span-2 bg-white p-3.5 rounded-xl shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">speed</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Average MTTR (Mean Time to Repair)
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#0b1c30] font-mono">
                    46 mins
                  </span>
                  <span className="text-xs font-bold text-[#b61722]">
                    +1m over target
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block font-medium">Target</span>
              <span className="text-sm font-bold text-slate-800 font-mono">45m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Downtime by Machine (Current Shift Horizontal Bars) */}
      <div className="mx-3 sm:mx-4 mt-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#131b2e] text-[20px]">bar_chart</span>
            <h3 className="text-sm font-bold text-[#0b1c30]">Downtime by Machine</h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">Current Shift</span>
        </div>

        <div className="flex flex-col gap-3">
          {/* Press P-04 */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#b61722]"></span> Press P-04
              </span>
              <span className="text-[#b61722] font-mono font-bold">112m</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#b61722] rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>

          {/* CNC Mill-02 */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#d95f00]"></span> CNC Mill-02
              </span>
              <span className="text-slate-800 font-mono font-bold">45m</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#d95f00] rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>

          {/* Robotic Welder W-01 */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#131b2e]"></span> Robotic Welder W-01
              </span>
              <span className="text-slate-800 font-mono font-bold">38m</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#131b2e] rounded-full" style={{ width: '34%' }}></div>
            </div>
          </div>

          {/* Conveyor C-3 */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span> Conveyor C-3
              </span>
              <span className="text-slate-800 font-mono font-bold">27m</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-500 rounded-full" style={{ width: '24%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Fault Distribution (6 Subsystems) */}
      <div className="mx-3 sm:mx-4 mt-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-bold text-[#0b1c30]">Fault Distribution</h3>
          <span className="text-xs text-slate-500">8 incidents</span>
        </div>

        {/* Multi segmented bar */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
          <div className="h-full bg-[#131b2e]" style={{ width: '45%' }} title="Mechanical 45%"></div>
          <div className="h-full bg-[#b61722]" style={{ width: '30%' }} title="Electrical 30%"></div>
          <div className="h-full bg-[#d95f00]" style={{ width: '15%' }} title="Hydraulic 15%"></div>
          <div className="h-full bg-slate-500" style={{ width: '10%' }} title="Pneumatic 10%"></div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded bg-[#131b2e]"></span> Mechanical
            </span>
            <span className="font-bold text-slate-900 font-mono">45%</span>
          </div>
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded bg-[#b61722]"></span> Electrical
            </span>
            <span className="font-bold text-slate-900 font-mono">30%</span>
          </div>
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded bg-[#d95f00]"></span> Hydraulic
            </span>
            <span className="font-bold text-slate-900 font-mono">15%</span>
          </div>
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded bg-slate-500"></span> Pneumatic
            </span>
            <span className="font-bold text-slate-900 font-mono">10%</span>
          </div>
        </div>
      </div>

      {/* Active Bay Floor Scan with Live Cam */}
      <div className="mx-3 sm:mx-4 mt-4 bg-white p-3.5 rounded-xl shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#131b2e]">photo_camera</span>
            Active Bay Floor Scan
          </span>
          <span className="text-xs text-[#b61722] font-semibold">Line 02 Restricted</span>
        </div>
        <div className="relative w-full h-32 rounded-lg overflow-hidden shadow-inner">
          <img
            src={BAY_SCAN_IMAGE}
            alt="Active Plant Bay Floor Scan"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2.5">
            <div className="flex items-center justify-between w-full text-white text-xs">
              <span className="font-bold uppercase tracking-wider text-[11px]">
                PRESS P-04 ZONE ISOLATED
              </span>
              <span className="text-[10px] font-mono bg-[#b61722] px-2 py-0.5 rounded font-bold">
                CAM-04 LIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Active Breakdowns Feed */}
      <div className="mx-3 sm:mx-4 mt-5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0b1c30]">Recent Active Breakdowns</h3>
          <button
            onClick={() => onNavigateTab('breakdowns')}
            className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-0.5"
          >
            View All ({incidents.length}){' '}
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {incidents.slice(0, 3).map((incident) => (
          <div
            key={incident.id}
            onClick={() => onOpenTicket(incident.id)}
            className="bg-white rounded-xl shadow-sm p-3.5 flex flex-col gap-2 border-l-4 border-[#b61722] hover:bg-slate-50 transition-all cursor-pointer active:scale-[0.99] border border-slate-200/70"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-slate-800">
                {incident.machineId} • {incident.department}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  incident.severity === 'critical'
                    ? 'bg-red-100 text-[#b61722]'
                    : incident.severity === 'high'
                    ? 'bg-orange-100 text-[#d95f00]'
                    : 'bg-blue-100 text-blue-900'
                }`}
              >
                {incident.severity}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-[#0b1c30] leading-snug">
              {incident.title}
            </h4>
            <p className="text-xs text-slate-600 line-clamp-1">{incident.problemSummary}</p>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {incident.reportedAt}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  incident.assignedTech
                    ? 'bg-slate-100 text-slate-800'
                    : 'bg-red-50 text-[#b61722] font-extrabold'
                }`}
              >
                {incident.assignedTech ? incident.assignedTech : 'UNASSIGNED'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Shop Safety Status Footer Widget */}
      <div className="mx-3 sm:mx-4 mt-4 p-3 rounded-xl bg-[#eff4ff] border border-blue-200/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#b61722] text-[22px] material-symbols-filled">
            health_and_safety
          </span>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-900">Shop Safety Status: LEVEL 2</div>
            <div className="text-[11px] text-slate-600">3 technicians deployed in Bay 2 and 3</div>
          </div>
        </div>
        <button
          onClick={() => alert('Safety Protocol: Level 2 active due to hydraulic pressure drop on high tonnage press. Eye protection & non-slip steel toe boots mandatory.')}
          className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">info</span>
        </button>
      </div>
    </div>
  );
};
