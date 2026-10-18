import React, { useState } from 'react';
import { Technician } from '../types';

interface PlantReportsScreenProps {
  technicians: Technician[];
  onOpenTicket: (ticketId: string) => void;
}

export const PlantReportsScreen: React.FC<PlantReportsScreenProps> = ({
  technicians,
  onOpenTicket,
}) => {
  const [temporalScope, setTemporalScope] = useState('past_7_days');
  const [startDate, setStartDate] = useState('19/02/2025');
  const [endDate, setEndDate] = useState('25/02/2025');
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerPage, setLedgerPage] = useState(1);

  // Download client-side CSV for audited reports
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Incident_ID,Machine,Line,Department,Severity,Subsystem,Downtime_Minutes,Status,Assigned_Tech\n' +
      'BD-2025-0842,Press P-04,Line 2,Stamping,Critical,Hydraulic,74,In Progress,Rajesh Sharma\n' +
      'BD-2025-0839,CNC Mill-02,Line 1,Machining,High,Electrical,118,In Progress,Deepak Joshi\n' +
      'BD-2025-0835,Welder WR-01,Line 3,Welding,Medium,Pneumatic,192,On Hold,Amit Patil\n' +
      'BD-2025-0828,Conveyor CD-3,Line 3,Packaging,Low,Mechanical,42,Resolved,Sunil Verma\n' +
      'BD-2025-0819,Press P-02,Line 2,Stamping,Critical,Hydraulic,135,Resolved,Rajesh Sharma\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Omega_Plant02_Breakdowns_Audit_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const ledgerData = [
    { id: 'P-04', name: '800T Komatsu Press', breakdowns: 6, downtime: '5.2h', mttr: '52 mins', status: 'DOWN', statusColor: 'bg-red-100 text-[#b61722]' },
    { id: 'CNC-02', name: '5-Axis Milling Center', breakdowns: 5, downtime: '3.8h', mttr: '45 mins', status: 'IN REPAIR', statusColor: 'bg-orange-100 text-[#d95f00]' },
    { id: 'WR-01', name: 'Robotic Spot Welder', breakdowns: 4, downtime: '2.5h', mttr: '38 mins', status: 'ON HOLD', statusColor: 'bg-amber-100 text-amber-900' },
    { id: 'CD-03', name: 'High-Speed Conveyor', breakdowns: 3, downtime: '1.9h', mttr: '38 mins', status: 'OPERATIONAL', statusColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'INJ-08', name: '450T Injection Molder', breakdowns: 2, downtime: '1.1h', mttr: '33 mins', status: 'OPERATIONAL', statusColor: 'bg-emerald-100 text-emerald-800' },
  ];

  const filteredLedger = ledgerData.filter(
    (row) =>
      row.id.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      row.name.toLowerCase().includes(ledgerSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full pb-32 bg-[#f8f9ff]">
      <div className="px-3 sm:px-4 space-y-4 pt-2">
        {/* Top Reporting Scope Selector Card */}
        <section className="bg-white p-3.5 sm:p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">date_range</span>
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Temporal Scope
                </span>
                <h2 className="text-base font-bold text-[#0b1c30]">Plant Operations Analytics</h2>
              </div>
            </div>

            <div className="relative min-w-[160px]">
              <select
                value={temporalScope}
                onChange={(e) => setTemporalScope(e.target.value)}
                className="w-full h-10 pl-3 pr-8 bg-slate-50 text-xs font-bold text-[#0b1c30] rounded-lg border border-slate-200 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="past_7_days">Past 7 Days</option>
                <option value="past_30_days">Past 30 Days</option>
                <option value="this_month">This Month</option>
                <option value="custom">Custom Date Range</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-slate-500 pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Active Range Pill */}
          <div className="flex flex-wrap items-center justify-between gap-1 px-3 py-1.5 bg-[#eff4ff] rounded-lg border border-blue-100 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#b61722]"></span>
              <span>
                Selected Period: <strong className="font-bold text-slate-900">19 Feb 2025 – 25 Feb 2025 (IST)</strong>
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Asia/Kolkata (UTC+5:30)</span>
          </div>

          {/* Custom Date Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-left">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                Start Date
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 text-xs font-mono rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                End Date
              </label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 text-xs font-mono rounded-lg"
              />
            </div>
            <div className="col-span-2 flex items-end gap-1.5">
              <button
                type="button"
                onClick={() => alert(`Applied filters for ${startDate} - ${endDate}`)}
                className="flex-1 h-9 bg-[#131b2e] text-white text-xs font-bold rounded-lg uppercase shadow active:scale-95 transition-transform"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={() => {
                  setStartDate('19/02/2025');
                  setEndDate('25/02/2025');
                }}
                className="h-9 px-3 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        {/* Audited Reports Export Suite */}
        <section className="bg-white p-3.5 sm:p-4 rounded-xl shadow-sm border border-slate-200 space-y-2 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Audited Reports Suite
              </span>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                Exports reflect currently filtered <strong className="text-slate-900 font-bold">28 records</strong>. Generated: 25 Feb 2025, 11:45 AM IST by Shift Supervisor S. Mehta.
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={handleExportCSV}
                className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1 border border-slate-200 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-700">table_view</span>
                <span>Export (.xlsx)</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1 border border-slate-200 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-red-600">picture_as_pdf</span>
                <span>Export PDF</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1 border border-slate-200 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-blue-700">download</span>
                <span>CSV</span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION A: BREAKDOWN SUMMARY OVERVIEW */}
        <section className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-4 rounded-full bg-[#b61722]"></span>
              <h3 className="text-sm font-bold text-[#0b1c30]">A. Breakdown Summary Overview</h3>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Plant-Wide
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Total Breakdowns */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Breakdowns</span>
                <span className="material-symbols-outlined text-slate-400 text-[16px]">build</span>
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#0b1c30]">28</div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#b61722] mt-0.5">
                  <span className="material-symbols-outlined text-[13px]">trending_up</span>
                  <span>+14% vs prev week</span>
                </div>
              </div>
            </div>

            {/* Active / Open */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Active / Open</span>
                <span className="material-symbols-outlined text-[#b61722] text-[16px]">warning</span>
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#b61722]">04</div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">2 Crit • 1 High • 1 Med</div>
              </div>
            </div>

            {/* Resolved */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Resolved</span>
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#0b1c30]">22</div>
                <div className="text-[10px] text-emerald-700 font-bold mt-0.5">91.6% res. rate</div>
              </div>
            </div>

            {/* Line Halt Impact */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Line Halt Impact</span>
                <span className="material-symbols-outlined text-red-600 text-[16px]">timer_off</span>
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#b61722]">3.2h</div>
                <div className="text-[10px] text-red-800 font-semibold mt-0.5">2 Critical stops</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION B: DOWNTIME & PRODUCTION IMPACT */}
        <section className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-4 rounded-full bg-[#d95f00]"></span>
              <h3 className="text-sm font-bold text-[#0b1c30]">B. Downtime &amp; Production Impact Analysis</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Cumulative: 18h 45m</span>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-slate-100">
              <span className="text-xs font-bold text-slate-900">Machine-Wise Downtime Contribution</span>
              <span className="text-[10px] text-slate-500">Top 5 Equipment</span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Press P-04 (Stamping Main)', duration: '5.2h', pct: '27.7%', width: '27.7%', color: 'bg-[#b61722]' },
                { name: 'CNC Mill-02 (Machining 5-Axis)', duration: '3.8h', pct: '20.3%', width: '20.3%', color: 'bg-[#d95f00]' },
                { name: 'Robotic Welder WR-01', duration: '2.5h', pct: '13.3%', width: '13.3%', color: 'bg-[#131b2e]' },
                { name: 'Conveyor Drive CD-3', duration: '1.9h', pct: '10.1%', width: '10.1%', color: 'bg-slate-500' },
                { name: 'Injection Molding INJ-08', duration: '1.1h', pct: '5.9%', width: '5.9%', color: 'bg-slate-400' },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-900">{item.name}</span>
                    <span className="font-mono font-bold text-slate-900">
                      {item.duration} <span className="font-normal text-slate-500">({item.pct})</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: item.width }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily downtime trend mini-bars */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Daily Downtime Trend (Hours)
                </span>
                <span className="text-xs font-bold text-[#b61722]">Peak: Tue (4.4h)</span>
              </div>
              <div className="flex items-end justify-between h-20 gap-2 px-1">
                {[
                  { day: 'Wed', h: '2.4', bar: '54%' },
                  { day: 'Thu', h: '1.8', bar: '40%' },
                  { day: 'Fri', h: '3.6', bar: '81%' },
                  { day: 'Sat', h: '2.1', bar: '47%' },
                  { day: 'Sun', h: '0.8', bar: '18%' },
                  { day: 'Mon', h: '3.9', bar: '88%' },
                  { day: 'Tue', h: '4.4', bar: '100%', peak: true },
                ].map((col) => (
                  <div key={col.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className={`text-[9px] font-mono ${col.peak ? 'text-[#b61722] font-bold' : 'text-slate-500'}`}>
                      {col.h}
                    </span>
                    <div
                      className={`w-full rounded-t ${col.peak ? 'bg-[#b61722]' : 'bg-slate-300'}`}
                      style={{ height: col.bar }}
                    ></div>
                    <span className={`text-[10px] ${col.peak ? 'font-bold text-[#b61722]' : 'text-slate-600'}`}>
                      {col.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Line-wise loss distribution */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Line-Wise Loss Distribution
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-red-50 rounded-lg border border-red-100 flex items-center justify-between">
                  <span className="font-bold text-slate-900">Line 2 (Press)</span>
                  <span className="font-mono font-bold text-[#b61722]">7.4h</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-900">Line 1 (Milling)</span>
                  <span className="font-mono font-bold text-slate-800">4.6h</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-900">Line 3 (Welding)</span>
                  <span className="font-mono font-bold text-slate-800">4.4h</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-900">Line 4 (Plastics)</span>
                  <span className="font-mono font-bold text-slate-800">2.1h</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION C: MACHINE PERFORMANCE LEDGER */}
        <section className="space-y-2 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-4 rounded-full bg-[#131b2e]"></span>
              <h3 className="text-sm font-bold text-[#0b1c30]">C. Machine Performance Ledger</h3>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search machine ID or model..."
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                className="w-full sm:w-60 h-9 pl-8 pr-2.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <span className="material-symbols-outlined absolute left-2 top-2 text-slate-400 text-[18px]">
                search
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-3">Machine ID</th>
                    <th className="py-2.5 px-3">Model</th>
                    <th className="py-2.5 px-3 text-center">Breakdowns</th>
                    <th className="py-2.5 px-3 text-center">Downtime</th>
                    <th className="py-2.5 px-3 text-center">MTTR</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLedger.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{row.id}</td>
                      <td className="py-2.5 px-3 text-slate-700">{row.name}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{row.breakdowns}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-[#b61722]">
                        {row.downtime}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">{row.mttr}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Showing 1-5 of 18 machines</span>
              <div className="flex items-center gap-1">
                <span>Page {ledgerPage} of 4</span>
                <button
                  onClick={() => setLedgerPage(Math.max(1, ledgerPage - 1))}
                  className="w-6 h-6 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-600"
                >
                  ‹
                </button>
                <button
                  onClick={() => setLedgerPage(Math.min(4, ledgerPage + 1))}
                  className="w-6 h-6 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-600"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION D: ROOT CAUSE ANALYSIS (RCA) */}
        <section className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-4 rounded-full bg-[#131b2e]"></span>
              <h3 className="text-sm font-bold text-[#0b1c30]">D. Root Cause Analysis (RCA)</h3>
            </div>
            <span className="text-[10px] text-slate-500">Subsystem Breakdown</span>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Fault Distribution by Subsystem</h4>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-0.5">
                  <span>Mechanical (10 incidents)</span>
                  <span className="font-bold">35%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#131b2e] h-full" style={{ width: '35%' }}></div>
                </div>
                <span className="text-[10px] text-slate-500">High-wear bearings &amp; drive belts</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-0.5">
                  <span>Electrical (7 incidents)</span>
                  <span className="font-bold">25%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#b61722] h-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-[10px] text-slate-500">Inverter trip &amp; sensor signal noise</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-0.5">
                  <span>Pneumatic (5 incidents)</span>
                  <span className="font-bold">18%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full" style={{ width: '18%' }}></div>
                </div>
                <span className="text-[10px] text-slate-500">Pressure drop &amp; air solenoid leakage</span>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-0.5">
                  <span>Hydraulic (3 incidents)</span>
                  <span className="font-bold">11%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: '11%' }}></div>
                </div>
                <span className="text-[10px] text-slate-500">High-pressure seal failure &amp; valve clogging</span>
              </div>
            </div>

            {/* Top 3 recurring root causes */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Top Recurring Root Causes &amp; Corrective Actions
              </span>
              {[
                { title: '1. O-Ring / Nitrile Seal Degradation', count: '4 Times', desc: 'High heat on 800T press causes rapid embrittlement.', action: 'Standardized Viton seal upgrade scheduled for Week 09.' },
                { title: '2. Spindle Drive Thermal Overload', count: '3 Times', desc: 'Coolant lines clogging leading to spindle overheating.', action: 'Chiller coolant filtration scheduled weekly on Mondays.' },
                { title: '3. Pneumatic Solenoid Valve Jam', count: '3 Times', desc: 'Water moisture carryover from centralized compressor line.', action: 'Air line moisture filter replaced & auto-drain valve added.' },
              ].map((item) => (
                <div key={item.title} className="p-2.5 bg-[#eff4ff] rounded-lg border border-blue-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    <span className="text-[9px] font-bold bg-white text-slate-800 px-1.5 py-0.2 rounded border border-slate-200">
                      {item.count}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{item.desc}</p>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-blue-900 pt-0.5">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                    <span><strong>Action:</strong> {item.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION E: MAINTENANCE CREW EFFICIENCY SCORECARD */}
        <section className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-4 rounded-full bg-[#131b2e]"></span>
              <h3 className="text-sm font-bold text-[#0b1c30]">
                E. Maintenance Crew Efficiency Scorecard
              </h3>
            </div>
            <span className="text-[10px] text-slate-500">4 Active Leads</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {technicians.map((t) => (
              <div
                key={t.id}
                className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#131b2e] text-white flex items-center justify-center font-bold text-xs">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <span className="text-[10px] text-slate-500">{t.role}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1 py-1 text-center">
                  <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[8px] uppercase text-slate-400 font-bold block">Assigned</span>
                    <span className="text-xs font-mono font-bold text-slate-900">{t.assignedCount}</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[8px] uppercase text-slate-400 font-bold block">Ack</span>
                    <span className="text-xs font-mono font-bold text-slate-900">{t.avgAckMin}m</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[8px] uppercase text-slate-400 font-bold block">MTTR</span>
                    <span className="text-xs font-mono font-bold text-slate-900">{t.avgMttrMin}m</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[8px] uppercase text-slate-400 font-bold block">Resolved</span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {t.resolvedCount}/{t.pendingCount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Efficiency: <strong>{t.efficiency}%</strong></span>
                  <span className={t.pendingCount > 0 ? 'text-[#b61722] font-bold' : 'text-emerald-700 font-bold'}>
                    {t.pendingCount} Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION F: PENDING & OVERDUE SLA QUEUE */}
        <section className="space-y-2 text-left pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-4 rounded-full bg-[#b61722]"></span>
              <h3 className="text-sm font-bold text-[#0b1c30]">F. Pending &amp; Overdue SLA Queue</h3>
            </div>
            <span className="text-[10px] bg-red-100 text-[#b61722] px-2 py-0.5 rounded font-bold">
              4 Requires Action
            </span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'BD-2025-0842', machine: 'Press P-04', severity: 'CRITICAL', desc: 'Hydraulic ram cylinder seal failure on 800T Komatsu Press • Main line halted', tech: 'Rajesh S.', duration: '01h 14m', overdue: 'OVERDUE by 44m', overdueColor: 'bg-red-100 text-[#b61722]' },
              { id: 'BD-2025-0839', machine: 'CNC Mill-02', severity: 'HIGH', desc: 'Spindle drive temperature excursion trip & axis servo alarm #214', tech: 'Deepak J.', duration: '01h 58m', overdue: 'OVERDUE by 28m', overdueColor: 'bg-orange-100 text-[#d95f00]' },
              { id: 'BD-2025-0835', machine: 'Welder WR-01', severity: 'MEDIUM', desc: 'Electrode tip dresser pneumatics locked • Awaiting spares PO #49281', tech: 'Amit P.', duration: '03h 12m', overdue: 'ON HOLD', overdueColor: 'bg-slate-100 text-slate-700' },
              { id: 'BD-2025-0831', machine: 'Conveyor C-1', severity: 'LOW', desc: 'Minor drive belt slippage detected by photoelectric pulse counter', tech: 'Unassigned', duration: '04h 30m', overdue: 'PENDING REVIEW', overdueColor: 'bg-slate-100 text-slate-700' },
            ].map((queueItem) => (
              <div
                key={queueItem.id}
                onClick={() => onOpenTicket(queueItem.id)}
                className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-1.5 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-slate-900">{queueItem.id}</span>
                    <span className="text-xs font-bold text-slate-700">• {queueItem.machine}</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-red-100 text-[#b61722] uppercase">
                      {queueItem.severity}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${queueItem.overdueColor}`}>
                    {queueItem.overdue}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">{queueItem.desc}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                  <span>Assigned: <strong>{queueItem.tech}</strong></span>
                  <span>Duration: <strong className="font-mono">{queueItem.duration}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
