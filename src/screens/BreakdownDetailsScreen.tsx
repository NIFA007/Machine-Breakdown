import React, { useState, useEffect } from 'react';
import { BreakdownIncident, Technician } from '../types';

interface BreakdownDetailsScreenProps {
  incident: BreakdownIncident;
  technicians: Technician[];
  onBack: () => void;
  onUpdateIncident: (updated: BreakdownIncident) => void;
}

export const BreakdownDetailsScreen: React.FC<BreakdownDetailsScreenProps> = ({
  incident,
  technicians,
  onBack,
  onUpdateIncident,
}) => {
  const [seconds, setSeconds] = useState(incident.downtimeSeconds || 4466);
  const [isEditingRootCause, setIsEditingRootCause] = useState(false);
  const [rootCauseText, setRootCauseText] = useState(
    incident.rootCause || 'Failed O-ring seal on high-pressure return valve manifold causing pressure bypass.'
  );
  const [isEditingCorrective, setIsEditingCorrective] = useState(false);
  const [correctiveText, setCorrectiveText] = useState(
    incident.correctiveAction || 'Replaced nitrile seal with Viton high-temp seal, refilled ISO VG 68 oil.'
  );
  const [spareParts, setSpareParts] = useState(incident.spareParts || []);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [holdReason, setHoldReason] = useState('Awaiting Specialized Spare Part');
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showLogPartModal, setShowLogPartModal] = useState(false);
  const [newPartName, setNewPartName] = useState('');
  const [newPartBin, setNewPartBin] = useState('');
  const [newPartQty, setNewPartQty] = useState('1');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [status, setStatus] = useState(incident.status);

  // Live timer ticks when not resolved or on hold
  useEffect(() => {
    if (status === 'resolved' || status === 'on_hold') return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  const formatTimer = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSaveRootCause = () => {
    setIsEditingRootCause(false);
    onUpdateIncident({ ...incident, rootCause: rootCauseText });
  };

  const handleSaveCorrective = () => {
    setIsEditingCorrective(false);
    onUpdateIncident({ ...incident, correctiveAction: correctiveText });
  };

  const handleConfirmHold = () => {
    setStatus('on_hold');
    setShowHoldModal(false);
    onUpdateIncident({
      ...incident,
      status: 'on_hold',
      holdReason,
    });
  };

  const handleResumeRepair = () => {
    setStatus('in_progress');
    onUpdateIncident({
      ...incident,
      status: 'in_progress',
      holdReason: undefined,
    });
  };

  const handleResolve = () => {
    setStatus('resolved');
    onUpdateIncident({
      ...incident,
      status: 'resolved',
    });
  };

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim()) return;
    const newPart = {
      id: `p-${Date.now()}`,
      name: newPartName,
      bin: newPartBin || 'Store Bin A-1',
      qty: newPartQty,
      stockStatus: 'Verified Stock',
    };
    const updated = [...spareParts, newPart];
    setSpareParts(updated);
    onUpdateIncident({ ...incident, spareParts: updated });
    setNewPartName('');
    setNewPartBin('');
    setShowLogPartModal(false);
  };

  const handleReassign = (tech: Technician) => {
    setShowReassignModal(false);
    onUpdateIncident({
      ...incident,
      assignedTech: `${tech.name} (${tech.id})`,
      assignedTechInitials: tech.initials,
    });
  };

  return (
    <div className="flex flex-col w-full pb-36 bg-[#f8f9ff]">
      <div className="px-3 sm:px-4 pt-3 flex flex-col gap-3">
        {/* Ticket Identifier Header Box */}
        <div className="flex items-center justify-between gap-2 bg-[#eff4ff] p-3 sm:p-4 rounded-xl border border-blue-200/70 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Ticket Identifier
            </span>
            <span className="text-xl sm:text-2xl font-mono font-extrabold text-[#0b1c30] tracking-tight">
              {incident.id}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-100 text-[#b61722] text-[10px] font-extrabold tracking-wider uppercase border border-red-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b61722] animate-pulse"></span>
              {incident.severity}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wider uppercase border ${
                status === 'resolved'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : status === 'on_hold'
                  ? 'bg-amber-100 text-amber-900 border-amber-200'
                  : 'bg-orange-100 text-[#d95f00] border-orange-200'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">
                {status === 'resolved'
                  ? 'check_circle'
                  : status === 'on_hold'
                  ? 'pause_circle'
                  : 'engineering'}
              </span>
              {status === 'resolved'
                ? 'Resolved'
                : status === 'on_hold'
                ? 'On Hold'
                : 'In Progress'}
            </span>
          </div>
        </div>

        {/* Machine Unit Card */}
        <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-[#131b2e] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-blue-300">
                <span className="material-symbols-outlined text-[22px]">precision_manufacturing</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Asset Unit
                </span>
                <span className="text-sm font-bold text-white truncate">{incident.machineName}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Zone
              </span>
              <span className="text-xs font-semibold text-blue-200">{incident.zone}</span>
            </div>
          </div>

          <div className="p-3.5 flex flex-col gap-3">
            {/* Active Downtime Live Counter */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 text-red-950 border border-red-200 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#b61722] text-[26px] animate-pulse">
                  timer
                </span>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b61722]">
                    Active Downtime
                  </span>
                  <span className="text-xs text-red-800">Shift loss rate: $140/min</span>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-mono font-extrabold tracking-tight text-[#b61722]">
                {formatTimer(seconds)}
              </div>
            </div>

            {/* Reporter & Lead Tech Tiles */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col p-2.5 bg-[#eff4ff] rounded-lg border border-blue-100">
                <span className="text-[10px] font-bold uppercase text-slate-500">Reported By</span>
                <span className="text-xs font-bold text-[#0b1c30] mt-0.5">{incident.reportedBy}</span>
                <span className="text-[11px] text-slate-500">{incident.reportedAt}</span>
              </div>
              <div className="flex flex-col p-2.5 bg-[#eff4ff] rounded-lg border border-blue-100">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  Lead Technician
                </span>
                <span className="text-xs font-bold text-[#0b1c30] mt-0.5">
                  {incident.assignedTech || 'Rajesh S. (TECH-44)'}
                </span>
                <span className="text-[11px] text-slate-500">Dispatched 10:48 AM</span>
              </div>
            </div>

            {/* Reported Problem Summary */}
            <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 border border-slate-200 text-left">
              <div className="flex items-center gap-1.5 text-[#b61722]">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wide">
                  Reported Problem Summary
                </span>
              </div>
              <p className="text-xs text-[#0b1c30] leading-relaxed mt-0.5">
                {incident.problemSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Lifecycle Timeline */}
        <div className="flex flex-col bg-white p-3.5 sm:p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Lifecycle Timeline
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              {status === 'resolved' ? 'Step 4 of 4' : 'Step 3 of 4'}
            </span>
          </div>

          <div className="flex flex-col gap-y-0 relative text-left">
            {/* Step 1 */}
            <div className="flex gap-3 relative pb-5">
              <div className="w-8 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#131b2e] text-white flex items-center justify-center z-10 text-xs font-bold shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
                <div className="w-0.5 h-full bg-[#131b2e] absolute top-7"></div>
              </div>
              <div className="flex flex-col pt-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">Reported</span>
                  <span className="text-[11px] text-slate-500">10:35 AM</span>
                </div>
                <span className="text-[11px] text-slate-500 leading-snug">
                  Logged by Operator Ramesh K. via Shop Terminal
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 relative pb-5">
              <div className="w-8 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#131b2e] text-white flex items-center justify-center z-10 text-xs font-bold shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
                <div className="w-0.5 h-full bg-[#131b2e] absolute top-7"></div>
              </div>
              <div className="flex flex-col pt-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">Acknowledged</span>
                  <span className="text-[11px] text-slate-500">10:42 AM</span>
                </div>
                <span className="text-[11px] text-slate-500 leading-snug">
                  Confirmed by Shift Supervisor S. Mehta
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3 relative pb-5">
              <div className="w-8 flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full text-white flex items-center justify-center z-10 text-xs font-bold shadow-sm ${
                    status === 'resolved'
                      ? 'bg-[#131b2e]'
                      : 'bg-[#da3437] animate-bounce'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {status === 'resolved' ? 'check' : 'build'}
                  </span>
                </div>
                <div className="w-0.5 h-full bg-slate-200 absolute top-7"></div>
              </div>
              <div className="flex flex-col pt-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-bold ${
                      status === 'resolved' ? 'text-slate-900' : 'text-[#b61722]'
                    }`}
                  >
                    Repair In Progress
                  </span>
                  <span className="text-[11px] text-slate-500">10:50 AM</span>
                </div>
                <span className="text-[11px] text-slate-700 leading-snug">
                  Rajesh S. actively inspecting manifold valve ring
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3 relative">
              <div className="w-8 flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center z-10 text-xs font-bold ${
                    status === 'resolved'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                </div>
              </div>
              <div className="flex flex-col pt-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-bold ${
                      status === 'resolved' ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    Resolved &amp; Verified
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {status === 'resolved' ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 leading-snug">
                  {status === 'resolved'
                    ? 'Line cycle test verified & supervisor sign-off recorded'
                    : 'Awaiting line cycle test and supervisor sign-off'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Technician Action Hub */}
        <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-left">
          <div className="p-3 bg-[#eff4ff] border-b border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-800 text-[18px]">handyman</span>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Technician Action Hub
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-white border border-blue-200 text-slate-700 text-[10px] font-bold">
              Active Session
            </span>
          </div>

          <div className="p-3.5 flex flex-col gap-3">
            {/* Root Cause Analysis */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  Root Cause Analysis
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingRootCause(!isEditingRootCause)}
                  className="text-blue-700 text-[11px] font-bold hover:underline flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[13px]">edit</span>
                  {isEditingRootCause ? 'Save' : 'Edit'}
                </button>
              </div>
              {isEditingRootCause ? (
                <div className="flex flex-col gap-1.5">
                  <textarea
                    rows={2}
                    value={rootCauseText}
                    onChange={(e) => setRootCauseText(e.target.value)}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    onClick={handleSaveRootCause}
                    className="self-end px-3 py-1 bg-slate-900 text-white rounded text-xs font-bold"
                  >
                    Save Analysis
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-blue-100 text-xs text-slate-800 leading-snug">
                  {rootCauseText}
                </div>
              )}
            </div>

            {/* Corrective Action */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  Corrective Action
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingCorrective(!isEditingCorrective)}
                  className="text-blue-700 text-[11px] font-bold hover:underline flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[13px]">edit</span>
                  {isEditingCorrective ? 'Save' : 'Edit'}
                </button>
              </div>
              {isEditingCorrective ? (
                <div className="flex flex-col gap-1.5">
                  <textarea
                    rows={2}
                    value={correctiveText}
                    onChange={(e) => setCorrectiveText(e.target.value)}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    onClick={handleSaveCorrective}
                    className="self-end px-3 py-1 bg-slate-900 text-white rounded text-xs font-bold"
                  >
                    Save Action
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-blue-100 text-xs text-slate-800 leading-snug">
                  {correctiveText}
                </div>
              )}
            </div>

            {/* Spare Parts Consumed */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  Spare Parts Consumed ({spareParts.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowLogPartModal(true)}
                  className="text-blue-700 text-[11px] font-bold flex items-center gap-0.5 hover:underline"
                >
                  <span className="material-symbols-outlined text-[15px]">add_circle</span>
                  Log Part
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                {spareParts.map((part) => (
                  <div
                    key={part.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#eff4ff] border border-blue-100"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-slate-500 text-[18px]">
                        donut_large
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-900 truncate">{part.name}</span>
                        <span className="text-[10px] text-slate-500">{part.bin}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-900">
                      Qty: {part.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attached Defect Photos */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  Attached Defect Photos (2)
                </span>
                <button
                  type="button"
                  onClick={() => alert('Camera simulated: New macro photo added to ticket.')}
                  className="text-blue-700 text-[11px] font-bold flex items-center gap-0.5 hover:underline"
                >
                  <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                  Add Photo
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Photo 1: Ruptured O-Ring */}
                <div
                  onClick={() =>
                    setZoomedImage(
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuBDfRgjW6VnB9IlIGQWKL41ObC0oGuR_-HfMZSOzwMjndxATiOS8HkapBykpeSno1CiTGQrVTxdRCPF9tAyG-tUyturwLruxhpIZbNPokng0mDNr4OBRssJya_ht6zE30hjk0HQM6o1RZugsRnj4GEUwcnSoaBHCEgd4M9IsGufmzQAWg2goqobpE5T1RHA2XdDApXafvDii2g_tfFIaVBZZ1HS_dD_WODJDAJvRtPYnPnn-M1zQ0zTSg'
                    )
                  }
                  className="relative group rounded-xl overflow-hidden h-28 bg-slate-100 cursor-pointer shadow-sm border border-slate-200"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDfRgjW6VnB9IlIGQWKL41ObC0oGuR_-HfMZSOzwMjndxATiOS8HkapBykpeSno1CiTGQrVTxdRCPF9tAyG-tUyturwLruxhpIZbNPokng0mDNr4OBRssJya_ht6zE30hjk0HQM6o1RZugsRnj4GEUwcnSoaBHCEgd4M9IsGufmzQAWg2goqobpE5T1RHA2XdDApXafvDii2g_tfFIaVBZZ1HS_dD_WODJDAJvRtPYnPnn-M1zQ0zTSg"
                    alt="Ruptured O-Ring"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                    <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-slate-900 shadow">
                      <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-white bg-black/75 px-1.5 py-0.5 rounded">
                    Ruptured O-Ring
                  </span>
                </div>

                {/* Photo 2: Manifold Leak Area */}
                <div
                  onClick={() =>
                    setZoomedImage(
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9XiNv0gnx-Gqs5GlfvLZo9iLt97cv_3qYXFs_-i6F6HdGV7uVXipwnQ7_yoVc1zZGzWaOoeRhghtyNGOXbRkIjd7CBCs3fdqqlAYjt4zVy3cnaT_ozIz_ipxe8JksHCGF2QMi6zd_1os146ZsOSZmQ7OeTVnRzUWKyZ9mXP0u4vd9LK1oIj6TZhEKF0BJhBKV5_tFLYHYfb49rI7jTf13k9T71LpTW4Vr-fI0yx_ukZXe7AzPbdwFew'
                    )
                  }
                  className="relative group rounded-xl overflow-hidden h-28 bg-slate-100 cursor-pointer shadow-sm border border-slate-200"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9XiNv0gnx-Gqs5GlfvLZo9iLt97cv_3qYXFs_-i6F6HdGV7uVXipwnQ7_yoVc1zZGzWaOoeRhghtyNGOXbRkIjd7CBCs3fdqqlAYjt4zVy3cnaT_ozIz_ipxe8JksHCGF2QMi6zd_1os146ZsOSZmQ7OeTVnRzUWKyZ9mXP0u4vd9LK1oIj6TZhEKF0BJhBKV5_tFLYHYfb49rI7jTf13k9T71LpTW4Vr-fI0yx_ukZXe7AzPbdwFew"
                    alt="Manifold Leak Area"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                    <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-slate-900 shadow">
                      <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-white bg-black/75 px-1.5 py-0.5 rounded">
                    Manifold Leak Area
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Command Grid */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-slate-200 p-3 max-w-lg mx-auto flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled
            className="h-11 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center gap-1 text-xs font-bold uppercase cursor-not-allowed border border-slate-200"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Acknowledged
          </button>
          {status === 'on_hold' ? (
            <button
              type="button"
              onClick={handleResumeRepair}
              className="h-11 rounded-lg bg-blue-600 text-white shadow-sm flex items-center justify-center gap-1 text-xs font-bold uppercase active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              Resume Repair
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowHoldModal(true)}
              className="h-11 rounded-lg bg-white text-slate-800 shadow-sm border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-1 text-xs font-bold uppercase active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[#b61722] text-[18px]">
                pause_circle
              </span>
              Put On Hold
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setShowReassignModal(true)}
            className="h-11 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1 text-xs font-bold uppercase active:scale-95 transition-transform border border-slate-200"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Re-Assign
          </button>
          <button
            type="button"
            onClick={handleResolve}
            className={`h-11 rounded-lg text-white flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wide shadow-md active:scale-95 transition-transform ${
              status === 'resolved'
                ? 'bg-emerald-700'
                : 'bg-[#131b2e] hover:bg-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">task_alt</span>
            {status === 'resolved' ? 'Ticket Closed' : 'Mark Resolved'}
          </button>
        </div>
      </div>

      {/* Put On Hold Modal */}
      {showHoldModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-2xl flex flex-col gap-3 text-left border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#b61722]">
                <span className="material-symbols-outlined">pause_circle</span>
                <span className="font-bold text-sm text-[#0b1c30]">Put Breakdown On Hold</span>
              </div>
              <button
                onClick={() => setShowHoldModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Select standard reason to pause active MTTR calculation:
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                'Awaiting Specialized Spare Part',
                'External OEM Specialist Required',
                'Shift Change Handover Stoppage',
                'Safety Isolation Clearance Required',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100"
                >
                  <input
                    type="radio"
                    name="hold_reason"
                    checked={holdReason === reason}
                    onChange={() => setHoldReason(reason)}
                    className="w-4 h-4 text-slate-900"
                  />
                  <span className="text-xs font-medium text-slate-800">{reason}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowHoldModal(false)}
                className="flex-1 h-10 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmHold}
                className="flex-1 h-10 rounded-lg bg-[#b61722] text-white text-xs font-bold uppercase shadow"
              >
                Confirm Pause
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Re-Assign Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-2xl flex flex-col gap-3 text-left border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">person_add</span>
                <span className="font-bold text-sm text-[#0b1c30]">Dispatch Technician</span>
              </div>
              <button
                onClick={() => setShowReassignModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {technicians.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleReassign(t)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#131b2e] text-white flex items-center justify-center text-xs font-bold">
                      {t.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">{t.name}</span>
                      <span className="text-[10px] text-slate-500">{t.role}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Avg MTTR: {t.avgMttrMin}m
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Log Part Modal */}
      {showLogPartModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white rounded-2xl p-4 shadow-2xl flex flex-col gap-3 border border-slate-200 text-left">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase">Log Replacement Part</span>
              <button
                onClick={() => setShowLogPartModal(false)}
                className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddPart} className="flex flex-col gap-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500">Part Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Parker Check Valve Ring"
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  className="w-full h-9 px-2 text-xs rounded bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500">Location Bin</label>
                  <input
                    type="text"
                    placeholder="Bin B-14"
                    value={newPartBin}
                    onChange={(e) => setNewPartBin(e.target.value)}
                    className="w-full h-9 px-2 text-xs rounded bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500">Quantity</label>
                  <input
                    type="text"
                    value={newPartQty}
                    onChange={(e) => setNewPartQty(e.target.value)}
                    className="w-full h-9 px-2 text-xs rounded bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full h-10 mt-1 bg-[#131b2e] text-white text-xs font-bold rounded-lg uppercase shadow"
              >
                Add to Ticket Ledger
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Zoom Image Lightbox */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-sm w-full">
            <img
              src={zoomedImage}
              alt="Zoomed Defect Photo"
              className="w-full rounded-2xl shadow-2xl border border-slate-700"
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
