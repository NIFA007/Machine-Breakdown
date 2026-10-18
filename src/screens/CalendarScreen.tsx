import React, { useState } from 'react';
import { CALENDAR_EVENTS } from '../data/mockData';
import { BreakdownIncident } from '../types';

interface CalendarScreenProps {
  onOpenTicket: (ticketId: string) => void;
  onReportClick: () => void;
  currentIncident: BreakdownIncident;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  onOpenTicket,
  onReportClick,
  currentIncident,
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDay, setSelectedDay] = useState(25);
  const [selectedTicketId, setSelectedTicketId] = useState('BD-2025-0842');

  const daysInFeb = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col w-full pb-32 bg-[#f8f9ff]">
      <div className="px-3 sm:px-4 space-y-3 pt-2">
        {/* Header Banner Section */}
        <section className="flex flex-col gap-2 pt-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b61722] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#b61722] animate-pulse"></span>
                Plant Stoppage Logs
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0b1c30] tracking-tight mt-0.5">
                Breakdown Event Calendar
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Historical &amp; Real-time Factory Incident Timeline (IST)
              </p>
            </div>
            <button
              onClick={onReportClick}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#b61722] text-white rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-transform flex-shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">add_alert</span>
              <span>Report BD</span>
            </button>
          </div>

          {/* View Switcher Segmented Bar */}
          <div className="flex items-center p-1 bg-slate-200/80 rounded-xl gap-1">
            <button
              onClick={() => setViewMode('month')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-center text-xs font-bold transition-all ${
                viewMode === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-center text-xs font-bold transition-all ${
                viewMode === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-center text-xs font-bold transition-all ${
                viewMode === 'day' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Day
            </button>
          </div>
        </section>

        {/* Navigation & Date Shortcuts Card */}
        <section className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                aria-label="Previous Month"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-700 active:bg-slate-200"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                aria-label="Next Month"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-700 active:bg-slate-200"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-slate-900">February 2025</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                Shift A • IST
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedDay(25)}
                className="px-2.5 py-1 rounded-lg bg-[#131b2e] text-white text-[11px] font-bold active:scale-95 shadow-sm"
              >
                Today
              </button>
              <button
                aria-label="Date Picker"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-700"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              </button>
            </div>
          </div>

          {/* Quick Legend Strip */}
          <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100 text-[10px] font-bold text-slate-600 uppercase">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#b61722]"></span> Crit
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span> High
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#eab308]"></span> Med
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span> Low
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span> Res
            </span>
          </div>
        </section>

        {/* Filter Badges Row */}
        <section className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-full text-slate-800 shadow-sm border border-slate-200 whitespace-nowrap">
            <span className="text-slate-400">Factory:</span>
            <span className="font-bold">Pune Plant 02</span>
            <span className="material-symbols-outlined text-[13px]">expand_more</span>
          </button>
          <button className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-full text-slate-800 shadow-sm border border-slate-200 whitespace-nowrap">
            <span className="text-slate-400">Line:</span>
            <span className="font-bold">Line 2 - Stamping</span>
            <span className="material-symbols-outlined text-[13px]">expand_more</span>
          </button>
          <button className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-full text-slate-800 shadow-sm border border-slate-200 whitespace-nowrap">
            <span className="text-slate-400">Status:</span>
            <span className="font-bold">Active &amp; Res</span>
            <span className="material-symbols-outlined text-[13px]">expand_more</span>
          </button>
        </section>

        {/* Calendar Grid: Month View */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 sm:p-3 flex flex-col">
          {/* Day Headers (Mon - Sun) */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase pb-2">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span className="text-[#b61722]">S</span>
            <span className="text-[#b61722]">S</span>
          </div>

          {/* Days Matrix (February 2025 starts on Saturday Feb 1 -> 5 empty days Jan 27-31) */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Filler Jan 27-31 */}
            {[27, 28, 29, 30, 31].map((d) => (
              <div
                key={`jan-${d}`}
                className="h-13 p-1 rounded-lg bg-slate-50/60 opacity-30 flex flex-col items-center justify-between text-[10px] text-slate-400"
              >
                <span>{d}</span>
              </div>
            ))}

            {/* Feb 1 to 28 */}
            {daysInFeb.map((day) => {
              const events = CALENDAR_EVENTS[day];
              const isSelected = selectedDay === day;
              const isToday = day === 25;

              return (
                <div
                  key={`feb-${day}`}
                  onClick={() => setSelectedDay(day)}
                  className={`h-13 p-1 rounded-lg flex flex-col justify-between items-center cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#131b2e] text-white shadow-md ring-2 ring-[#b61722] scale-[1.03]'
                      : isToday
                      ? 'bg-blue-50 text-blue-900 border border-blue-200'
                      : events
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                      : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full px-0.5">
                    <span className="text-[10px] font-bold">{day}</span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b61722] animate-ping"></span>
                    )}
                  </div>

                  {/* Micro event indicator pill */}
                  {events ? (
                    <div className="w-full flex flex-col gap-0.5">
                      <div className="flex gap-0.5 w-full">
                        {events.map((e, idx) => (
                          <span
                            key={idx}
                            className={`flex-1 h-1.5 rounded-full ${
                              e.severity === 'critical'
                                ? 'bg-[#b61722]'
                                : e.severity === 'high'
                                ? 'bg-[#f97316]'
                                : e.severity === 'medium'
                                ? 'bg-[#eab308]'
                                : 'bg-[#10b981]'
                            }`}
                          ></span>
                        ))}
                      </div>
                      <span
                        className={`text-[8px] font-bold leading-none truncate ${
                          isSelected ? 'text-amber-200' : 'text-slate-600'
                        }`}
                      >
                        {events[0].duration}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[8px] text-transparent select-none">-</span>
                  )}
                </div>
              );
            })}

            {/* Next Month Filler: Mar 1 & 2 */}
            {[1, 2].map((d) => (
              <div
                key={`mar-${d}`}
                className="h-13 p-1 rounded-lg bg-slate-50/60 opacity-30 flex flex-col items-center justify-between text-[10px] text-slate-400"
              >
                <span>{d}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Selected Day Events List */}
        <section className="flex flex-col gap-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Events on {selectedDay} Feb {selectedDay === 25 ? '(Today)' : ''}
            </span>
            <span className="text-xs text-[#b61722] font-bold">
              Total Downtime: {selectedDay === 25 ? '01h 52m' : '0h 42m'}
            </span>
          </div>

          {/* Active Incident Card 1 */}
          <div
            onClick={() => setSelectedTicketId('BD-2025-0842')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedTicketId === 'BD-2025-0842'
                ? 'bg-white border-l-4 border-l-[#b61722] border-slate-200 shadow-md ring-1 ring-slate-900/10'
                : 'bg-white/80 border border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-red-100 text-[#b61722] text-[9px] font-extrabold uppercase">
                  Critical
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">BD-2025-0842</span>
              </div>
              <span className="text-xs font-bold text-[#b61722] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b61722] animate-pulse"></span>
                Active (38m)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-700 mt-1">
              <span className="font-bold">Press P-04 • 800T Komatsu</span>
              <span className="text-slate-500 text-[11px]">Line 2 - Stamping</span>
            </div>
          </div>

          {/* Active Incident Card 2 */}
          <div
            onClick={() => setSelectedTicketId('BD-2025-0839')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedTicketId === 'BD-2025-0839'
                ? 'bg-white border-l-4 border-l-[#f97316] border-slate-200 shadow-md ring-1 ring-slate-900/10'
                : 'bg-white/80 border border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-orange-100 text-[#c2410c] text-[9px] font-extrabold uppercase">
                  High
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">BD-2025-0839</span>
              </div>
              <span className="text-xs font-bold text-[#c2410c]">In Progress</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-700 mt-1">
              <span className="font-bold">CNC Mill-02 • Mazak VC</span>
              <span className="text-slate-500 text-[11px]">Spindle Overheat</span>
            </div>
          </div>
        </section>

        {/* Selected Breakdown Details Focus Panel */}
        <section className="bg-white rounded-xl shadow-md border border-slate-200 p-3.5 flex flex-col gap-2.5 relative overflow-hidden text-left">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#b61722]"></div>

          <div className="flex items-start justify-between gap-2 pt-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-sm font-bold text-slate-900">
                  #{selectedTicketId}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-red-100 text-[#b61722] text-[9px] font-bold uppercase">
                  Critical - Line Halted
                </span>
                <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[9px] font-bold uppercase">
                  Open
                </span>
              </div>
              <span className="text-xs font-bold text-slate-700 mt-0.5">
                Press P-04 • 800T Komatsu Stamping Press (Bay 4, Line 2)
              </span>
            </div>
          </div>

          {/* Downtime Counter & Loss Rate */}
          <div className="bg-[#eff4ff] p-2.5 rounded-lg border border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#b61722] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[16px]">timer</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">
                  Active Downtime
                </span>
                <span className="font-mono font-extrabold text-sm sm:text-base text-[#b61722]">
                  01h 14m 26s
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Loss Rate</span>
              <span className="font-mono font-bold text-xs sm:text-sm text-[#b61722]">
                $140 / min
              </span>
            </div>
          </div>

          {/* Machine Photo Snapshot */}
          <div className="w-full h-28 rounded-lg overflow-hidden relative shadow-inner">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmfYrJmjB0rjNGj6MUKWnoSMeTu3rToEW01wuksxX5QM_z0LFbhlKL3Mdul0b019OGjPPHScu7DUho7ZPhrJpapa7plr1SoCnhWKewUmlC6fBOj2EvyNhYjM-ZDc9chOJYIoQAyJQurgbBpjOPpptvCOKpfxhF22DXBtydwsc3oY76GzovFfl_qJKv53f7rKmSKdZ8NGuqf_MMxWPzgEk1nTWZP4nBztJxbDz0m4vIeNNITm-5iFAk5Q"
              alt="Operator Snapshot"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[10px] flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">photo_camera</span>
              Operator Snapshot • Manifold Block #2
            </div>
          </div>

          {/* Diagnostic Assessment */}
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <strong>Root Cause:</strong> High-pressure O-ring rupture on valve manifold return port
            #B4. Replacement seal kit dispatched.
          </div>

          {/* Assigned Specialist */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxhzfjQHPmJKYP2vOC5a1U71If9sDoBTT-WEBA0UL8gzRzUcSyJDurfXpSpD7MDppcSdmcIJuPDnkssgpOWSZiLqkUnA-hsH2SfwUaV-o4dWFVFh7ElrbCnqgWAYRpyzM4E5_dn00AvAeYInYOSlbGyIsbKa6pY0m8HimPh-vFU8yfkd-5GFoqDZpkB_XJmem1FqxGIEYAbXOAnr2IdJN_tXEnoG79Nh6M3C7Iro8PP7WFzjn1j9wZoA"
                alt="Rajesh S."
                className="w-8 h-8 rounded-full object-cover border border-slate-300"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Rajesh S.</span>
                <span className="text-[10px] text-slate-500">Lead Hydraulics Specialist</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Dispatched
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => onOpenTicket(selectedTicketId)}
              className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-slate-200"
            >
              <span className="material-symbols-outlined text-[15px]">article</span>
              Ticket
            </button>
            <button
              onClick={() => alert('Technician reassignment menu opened for ticket.')}
              className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-slate-200"
            >
              <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
              Reassign
            </button>
            <button
              onClick={() => alert('Marked resolved & supervisor notified.')}
              className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              Resolve
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
