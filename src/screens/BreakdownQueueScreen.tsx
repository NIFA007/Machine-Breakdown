import React, { useState, useEffect } from 'react';
import { BreakdownIncident } from '../types';

interface BreakdownQueueScreenProps {
  incidents: BreakdownIncident[];
  onOpenTicket: (id: string) => void;
  onAssignTech: (incidentId: string) => void;
  onNavigateTab: (tab: 'dashboard' | 'report' | 'reports') => void;
}

export const BreakdownQueueScreen: React.FC<BreakdownQueueScreenProps> = ({
  incidents,
  onOpenTicket,
  onAssignTech,
  onNavigateTab,
}) => {
  const [filter, setFilter] = useState<'all' | 'open' | 'critical' | 'in_progress' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tickerSecs, setTickerSecs] = useState(38 * 60 + 18);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerSecs((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTicker = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredIncidents = incidents.filter((item) => {
    if (filter === 'open' && item.status === 'resolved') return false;
    if (filter === 'critical' && item.severity !== 'critical') return false;
    if (filter === 'in_progress' && item.status !== 'in_progress') return false;
    if (filter === 'resolved' && item.status !== 'resolved') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.id.toLowerCase().includes(q) ||
        item.machineId.toLowerCase().includes(q) ||
        item.machineName.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const counts = {
    all: incidents.length,
    open: incidents.filter((i) => i.status !== 'resolved').length,
    critical: incidents.filter((i) => i.severity === 'critical').length,
    in_progress: incidents.filter((i) => i.status === 'in_progress').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
  };

  return (
    <div className="flex flex-col w-full pb-28 bg-[#f8f9ff]">
      {/* Header & Quick Filter Header */}
      <div className="px-3 sm:px-4 pt-3 pb-2 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Plant 02 • Realtime Queue
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0b1c30] flex items-center gap-2 tracking-tight">
              <span>Active Breakdowns</span>
              <span className="inline-flex items-center justify-center bg-[#b61722] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                {counts.open} Open
              </span>
            </h1>
          </div>
          <button
            onClick={() => {
              setTickerSecs(38 * 60 + 20);
            }}
            aria-label="Refresh Queue"
            className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all active:scale-95 shadow-sm border border-slate-200"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">sync</span>
          </button>
        </div>

        {/* Search & Quick Filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID (e.g. BD-0842) or Machine..."
              className="w-full h-11 bg-white text-[#0b1c30] text-xs sm:text-sm pl-10 pr-3 rounded-xl shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 border border-slate-200"
            />
          </div>
          <button
            onClick={() => setFilter('critical')}
            aria-label="Filter parameters"
            className="h-11 px-3 rounded-xl bg-white text-slate-700 flex items-center gap-1 text-xs font-semibold active:scale-95 shadow-sm border border-slate-200"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span className="hidden xs:inline">Crit Only</span>
          </button>
        </div>

        {/* Filter Tabs (Horizontal Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-3 px-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shadow-sm transition-all ${
              filter === 'all'
                ? 'bg-[#131b2e] text-white'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
            type="button"
          >
            <span>All</span>
            <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setFilter('open')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shadow-sm transition-all ${
              filter === 'open'
                ? 'bg-[#131b2e] text-white'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
            type="button"
          >
            <span>Open</span>
            <span className="bg-[#b61722] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {counts.open}
            </span>
          </button>

          <button
            onClick={() => setFilter('critical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shadow-sm transition-all ${
              filter === 'critical'
                ? 'bg-[#131b2e] text-white'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
            type="button"
          >
            <span className="w-2 h-2 rounded-full bg-[#b61722]"></span>
            <span>Critical</span>
            <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {counts.critical}
            </span>
          </button>

          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shadow-sm transition-all ${
              filter === 'in_progress'
                ? 'bg-[#131b2e] text-white'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
            type="button"
          >
            <span>In Progress</span>
            <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {counts.in_progress}
            </span>
          </button>

          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shadow-sm transition-all ${
              filter === 'resolved'
                ? 'bg-[#131b2e] text-white'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
            type="button"
          >
            <span>Resolved</span>
            <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {counts.resolved}
            </span>
          </button>
        </div>
      </div>

      {/* Incident Cards Feed */}
      <div className="px-3 sm:px-4 flex flex-col gap-3 mt-1">
        {filteredIncidents.map((incident) => {
          const isCritical = incident.severity === 'critical';
          const isResolved = incident.status === 'resolved';
          const isHold = incident.status === 'on_hold';

          return (
            <article
              key={incident.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden relative transition-all active:scale-[0.99] flex flex-col border border-slate-200/90 ${
                isResolved ? 'opacity-90' : ''
              }`}
            >
              {/* Top status color bar */}
              <div
                className={`h-1.5 w-full ${
                  isCritical
                    ? 'bg-[#b61722]'
                    : incident.severity === 'high'
                    ? 'bg-[#d95f00]'
                    : isResolved
                    ? 'bg-emerald-600'
                    : 'bg-slate-400'
                }`}
              ></div>

              <div className="p-3 sm:p-4 flex flex-col gap-2.5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm sm:text-base font-extrabold text-[#0b1c30]">
                        {incident.id}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase flex items-center gap-1 ${
                          isCritical
                            ? 'bg-red-100 text-[#b61722]'
                            : incident.severity === 'high'
                            ? 'bg-orange-100 text-[#d95f00]'
                            : isResolved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isCritical && <span className="w-1.5 h-1.5 rounded-full bg-[#b61722] animate-ping"></span>}
                        {incident.severity}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5">
                      {incident.title} • {incident.line}
                    </span>
                  </div>

                  {/* Live ticker or status badge */}
                  {isCritical ? (
                    <div className="bg-[#eff4ff] px-2.5 py-1 rounded-lg flex items-center gap-1 text-[#b61722] font-mono text-xs font-bold border border-red-100 shadow-sm">
                      <span className="material-symbols-outlined text-[15px]">timer</span>
                      <span>{formatTicker(tickerSecs)}</span>
                    </div>
                  ) : isResolved ? (
                    <div className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Downtime: 42m
                    </div>
                  ) : isHold ? (
                    <span className="bg-amber-100 text-amber-900 px-2 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                      Spare Requisition
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-orange-600">engineering</span>
                      In Progress
                    </span>
                  )}
                </div>

                {/* Machine graphic & detail tile */}
                <div
                  onClick={() => onOpenTicket(incident.id)}
                  className="bg-[#f8f9ff] hover:bg-[#eff4ff] rounded-xl p-2.5 flex items-center gap-3 cursor-pointer transition-colors border border-slate-200/60"
                >
                  <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0 relative">
                    <img
                      src={incident.machineImage}
                      alt={incident.machineName}
                      className="w-full h-full object-cover"
                    />
                    {isCritical && (
                      <div className="absolute inset-0 bg-red-600/10 mix-blend-multiply"></div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-bold text-[#0b1c30] truncate">
                      {incident.machineName}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        {incident.reportedAt}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 bg-white px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-700 border border-slate-200">
                        <span className="material-symbols-outlined text-[12px] text-blue-600">
                          {incident.subsystem === 'Hydraulic'
                            ? 'water_drop'
                            : incident.subsystem === 'Electrical'
                            ? 'bolt'
                            : 'settings'}
                        </span>
                        {incident.subsystem}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">
                    chevron_right
                  </span>
                </div>

                {/* Allocation / Footer Row */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-800 border border-slate-200">
                      {incident.assignedTechInitials ? (
                        incident.assignedTechInitials
                      ) : (
                        <span className="material-symbols-outlined text-[16px] text-slate-400">
                          person_off
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        {isResolved
                          ? 'RESOLVED BY'
                          : isHold
                          ? 'ON HOLD ASSIGNEE'
                          : 'TECHNICIAN'}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          incident.assignedTech ? 'text-slate-800' : 'text-[#b61722]'
                        }`}
                      >
                        {incident.assignedTech || 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  {/* Contextual Action Button */}
                  {!incident.assignedTech ? (
                    <button
                      onClick={() => onAssignTech(incident.id)}
                      className="h-10 px-4 rounded-lg bg-[#d95f00] hover:bg-[#c25400] text-white text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 shadow active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[18px]">person_add</span>
                      <span>Assign Now</span>
                    </button>
                  ) : isResolved ? (
                    <button
                      onClick={() => onOpenTicket(incident.id)}
                      className="h-9 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                      <span>Sign-off Report</span>
                    </button>
                  ) : isHold ? (
                    <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                      PO #49281 Pending
                    </span>
                  ) : (
                    <button
                      onClick={() => onOpenTicket(incident.id)}
                      className="h-9 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      <span>View Logs</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination & MTTR Footnote */}
      <div className="px-3 sm:px-4 pt-5 pb-4 flex flex-col items-center gap-3">
        <div className="flex items-center justify-between w-full text-xs text-slate-600">
          <span>
            Showing <strong className="text-slate-900">1–{filteredIncidents.length}</strong> of{' '}
            <strong className="text-slate-900">{incidents.length}</strong> incidents
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              aria-label="Previous Page"
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="text-xs px-2 font-bold text-slate-800">Page {currentPage} of 2</span>
            <button
              onClick={() => setCurrentPage(2)}
              disabled={currentPage === 2}
              aria-label="Next Page"
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Quick Shift Summary Banner */}
        <div className="w-full bg-[#eff4ff] border border-blue-200/80 rounded-xl p-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-blue-900 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">speed</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                MTTR SHIFT AVG
              </span>
              <span className="text-sm font-extrabold text-[#0b1c30]">
                34 mins <span className="text-xs font-normal text-emerald-700">(-12% vs target)</span>
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('reports')}
            className="text-xs text-blue-700 font-bold underline hover:text-blue-900"
          >
            Shift Metrics
          </button>
        </div>
      </div>
    </div>
  );
};
