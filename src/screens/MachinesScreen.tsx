import React, { useState } from 'react';
import { Machine } from '../types';

interface MachinesScreenProps {
  machines: Machine[];
  onOpenTicket: (ticketId: string) => void;
  onAddNewMachine: (newMachine: Machine) => void;
}

export const MachinesScreen: React.FC<MachinesScreenProps> = ({
  machines,
  onOpenTicket,
  onAddNewMachine,
}) => {
  const [filter, setFilter] = useState<'all' | 'running' | 'down' | 'maintenance'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAddMachineDrawer, setShowAddMachineDrawer] = useState(false);
  const [sortDescending, setSortDescending] = useState(true);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // New Machine Form State
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newLine, setNewLine] = useState('Line 1 - Machining');
  const [newCriticality, setNewCriticality] = useState<'A' | 'B' | 'C'>('A');

  const filtered = machines.filter((m) => {
    if (filter === 'running' && m.status !== 'running') return false;
    if (filter === 'down' && m.status !== 'down') return false;
    if (filter === 'maintenance' && m.status !== 'maintenance') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.id.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.line.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const displayedMachines = [...filtered].sort((a, b) => {
    if (sortDescending) {
      const priority = { down: 3, maintenance: 2, running: 1 };
      return priority[b.status] - priority[a.status];
    }
    return a.id.localeCompare(b.id);
  });

  const handleSimulateScan = () => {
    setShowQrModal(false);
    setHighlightedId('P-04');
    setTimeout(() => {
      const el = document.getElementById('machine-P-04');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
    setTimeout(() => setHighlightedId(null), 3000);
  };

  const handleCreateMachine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim() || !newName.trim()) return;
    const created: Machine = {
      id: newId,
      name: newName,
      type: 'Industrial Station',
      line: newLine,
      department: newLine.includes('Machining') ? 'Tool Room' : 'Assembly',
      status: 'running',
      monthDowntime: '0h 00m',
      mtbf: '380 hrs',
      criticality: newCriticality,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBiC-Lr_kxpHrBH3W6NkggZHdxoD0lILCzkucL2afS46kJRvxWKrWDWLpYlCkm2ckFa8fQXX4MgTg2VSIseYBCvt1IpNEAPD7c1w8K0AEqR25lMp1QIDgCKmqEtZxQkc40w_5XI8TWMw9SsYU152UrMKIdlOIoJhKxg4K2lx0MQxAdn2kSdycqwzpV1QO3H8GxtEEmx0bnEr7sx-Amshz4LR6MMGNEbFF-dPZlBQ20_plvUanJFQJPcBQ',
      oee: '95.0%',
      continuousHours: 12,
      nextPmDays: 30,
    };
    onAddNewMachine(created);
    setShowAddMachineDrawer(false);
    setNewId('');
    setNewName('');
  };

  return (
    <div className="flex flex-col w-full pb-32 bg-[#f8f9ff]">
      {/* Search & QR Scanner Row */}
      <section className="px-3 sm:px-4 pt-3 pb-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-white shadow-sm rounded-xl px-3 h-11 border border-slate-200 focus-within:ring-2 focus-within:ring-slate-900 transition-all">
            <span className="material-symbols-outlined text-[20px] text-slate-400 flex-shrink-0">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search machine, asset tag, line..."
              className="w-full bg-transparent text-xs sm:text-sm text-[#0b1c30] placeholder:text-slate-400 focus:outline-none ml-2"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setShowQrModal(true)}
            aria-label="Scan Machine QR"
            className="h-11 w-11 flex-shrink-0 rounded-xl bg-white text-slate-800 flex items-center justify-center active:scale-95 transition-all shadow-sm border border-slate-200 relative"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#b61722]"></span>
            </span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setFilter('all')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all ${
              filter === 'all'
                ? 'bg-[#131b2e] text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <span>All</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px] font-mono">
              42
            </span>
          </button>
          <button
            onClick={() => setFilter('running')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all ${
              filter === 'running'
                ? 'bg-[#131b2e] text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Running</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono">
              36
            </span>
          </button>
          <button
            onClick={() => setFilter('down')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all ${
              filter === 'down'
                ? 'bg-[#131b2e] text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#b61722]"></span>
            <span>Down</span>
            <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-[#b61722] text-[10px] font-mono font-bold">
              4
            </span>
          </button>
          <button
            onClick={() => setFilter('maintenance')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all ${
              filter === 'maintenance'
                ? 'bg-[#131b2e] text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Maintenance</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono">
              2
            </span>
          </button>
        </div>
      </section>

      {/* Fleet Vitality Overview Strip */}
      <section className="px-3 sm:px-4 py-1">
        <div className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-200 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#d95f00] text-[18px]">
                analytics
              </span>
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Fleet Vitality
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Plant 02 • Real-time
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-0.5">
            <div className="flex flex-col bg-[#eff4ff] rounded-lg p-2 text-left border border-blue-100">
              <span className="text-[10px] text-slate-500 font-semibold">Total Assets</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-xl font-mono font-extrabold text-[#0b1c30]">
                  42
                </span>
                <span className="text-[10px] text-slate-500 font-normal">units</span>
              </div>
            </div>

            <div className="flex flex-col bg-[#eff4ff] rounded-lg p-2 text-left border border-blue-100">
              <span className="text-[10px] text-slate-500 font-semibold">Availability</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-xl font-mono font-extrabold text-[#0b1c30]">
                  85.7
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">%</span>
              </div>
            </div>

            <div className="flex flex-col bg-red-50 rounded-lg p-2 text-left border border-red-200 relative">
              <span className="text-[10px] text-[#b61722] font-bold">Breakdown</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg sm:text-xl font-mono font-extrabold text-[#b61722]">
                  4
                </span>
                <span className="text-[10px] text-[#b61722] font-semibold">crit</span>
              </div>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#b61722] animate-pulse"></span>
            </div>
          </div>

          {/* Linear Status Distribution Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
            <div className="bg-emerald-600 h-full" style={{ width: '85.7%' }}></div>
            <div className="bg-amber-400 h-full" style={{ width: '4.8%' }}></div>
            <div className="bg-[#b61722] h-full" style={{ width: '9.5%' }}></div>
          </div>
        </div>
      </section>

      {/* Machines Registry Header */}
      <section className="px-3 sm:px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#0b1c30]">Registered Machines</span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
            {displayedMachines.length} shown
          </span>
        </div>
        <button
          onClick={() => setSortDescending(!sortDescending)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <span className="material-symbols-outlined text-[16px]">swap_vert</span>
          <span>{sortDescending ? 'Severity' : 'ID Order'}</span>
        </button>
      </section>

      {/* Asset Cards Feed */}
      <div className="px-3 sm:px-4 flex flex-col gap-3 mt-1">
        {displayedMachines.map((m) => {
          const isDown = m.status === 'down';
          const isMaintenance = m.status === 'maintenance';
          const isHighlighted = highlightedId === m.id;

          return (
            <article
              id={`machine-${m.id}`}
              key={m.id}
              className={`bg-white rounded-xl shadow-sm p-3.5 flex flex-col gap-2.5 relative border transition-all ${
                isHighlighted ? 'ring-4 ring-blue-500 scale-[1.01]' : 'border-slate-200'
              } ${
                isDown
                  ? 'border-l-4 border-l-[#b61722]'
                  : isMaintenance
                  ? 'border-l-4 border-l-amber-500'
                  : 'border-l-4 border-l-emerald-600'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-2.5 items-start">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden relative border border-slate-200">
                    <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                    {isDown && <div className="absolute inset-0 bg-red-600/20 mix-blend-multiply"></div>}
                  </div>
                  <div className="flex flex-col min-w-0 text-left">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-extrabold text-[#0b1c30] tracking-tight">
                        {m.id}
                      </span>
                      <span className="text-xs text-slate-500 truncate">• {m.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-[11px] mt-0.5">
                      <span className="material-symbols-outlined text-[13px]">factory</span>
                      <span>{m.line}</span>
                      <span>•</span>
                      <span>{m.department}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase flex-shrink-0 ${
                    isDown
                      ? 'bg-red-100 text-[#b61722]'
                      : isMaintenance
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isDown
                        ? 'bg-[#b61722] animate-ping'
                        : isMaintenance
                        ? 'bg-amber-500'
                        : 'bg-emerald-600'
                    }`}
                  ></span>
                  {m.status.toUpperCase()}
                </span>
              </div>

              {/* Status Context Sub-box */}
              {isDown ? (
                <div className="bg-red-50/70 border border-red-200 rounded-lg p-2.5 flex flex-col gap-1 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#b61722] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {m.activeBreakdownId || 'BD-2025-0842'}
                    </span>
                    <span className="text-[11px] font-semibold text-[#b61722]">Elapsed: 42m</span>
                  </div>
                  <p className="text-xs text-[#0b1c30] font-medium leading-snug">
                    Hydraulic pressure drop on main ram piston. Relief valve seals breached.
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">person</span>
                      Tech: R. Sharma (Dispatched)
                    </span>
                    <button
                      onClick={() => onOpenTicket(m.activeBreakdownId || 'BD-2025-0842')}
                      className="text-[#b61722] font-bold hover:underline flex items-center gap-0.5"
                    >
                      Ticket View{' '}
                      <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ) : isMaintenance ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex flex-col gap-1 text-left">
                  <span className="text-[11px] font-bold text-amber-900">
                    Spare Parts Requisition #PR-902
                  </span>
                  <p className="text-xs text-amber-950">
                    Waiting for pneumatic valve replacement from central store. Expected 14:30.
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600">
                    <span>Assigned: Tooling Maintenance Squad</span>
                    <button
                      onClick={() => alert('Tracking PR-902: In Transit from Central Store.')}
                      className="text-slate-900 font-bold hover:underline"
                    >
                      Track Part
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#eff4ff] border border-blue-100 rounded-lg p-2 flex items-center justify-between text-left">
                  <div className="flex items-center gap-1.5 text-xs text-slate-800 font-medium">
                    <span className="material-symbols-outlined text-emerald-600 text-[16px]">
                      verified
                    </span>
                    <span>Zero active breakdowns today</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded shadow-xs text-xs">
                    <span className="text-[10px] text-slate-500 font-semibold">OEE:</span>
                    <span className="font-bold text-emerald-800 font-mono">{m.oee || '92.4%'}</span>
                  </div>
                </div>
              )}

              {/* Machine Metrics Row */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-left text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Month Downtime
                    </span>
                    <span className="font-mono font-bold text-slate-900">{m.monthDowntime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-[16px]">vital_signs</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Mean Time Between
                    </span>
                    <span className="font-mono font-bold text-slate-900">{m.mtbf}</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Floating Add Machine Action Button */}
      <div className="fixed right-4 bottom-20 z-40">
        <button
          onClick={() => setShowAddMachineDrawer(true)}
          aria-label="Add New Machine"
          className="h-12 px-4 rounded-full bg-[#131b2e] hover:bg-slate-900 text-white flex items-center gap-2 shadow-xl active:scale-95 transition-all ring-2 ring-white"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span className="text-xs tracking-wider uppercase font-bold">Add Machine</span>
        </button>
      </div>

      {/* QR Scanner Viewfinder Simulation Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end p-3 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-4 flex flex-col gap-3 shadow-2xl max-w-sm mx-auto w-full text-center border border-slate-200">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-1"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b61722] text-[22px]">
                  qr_code_scanner
                </span>
                <h3 className="font-bold text-sm text-slate-900">Plant Asset QR Scanner</h3>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Viewfinder frame */}
            <div className="w-full h-52 bg-[#131b2e] rounded-xl flex flex-col items-center justify-center relative overflow-hidden p-4">
              <div className="w-36 h-36 border-2 border-dashed border-amber-300/80 rounded-xl relative flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-amber-200 text-4xl">
                  center_focus_weak
                </span>
                {/* Scanning laser line */}
                <div className="absolute left-2 right-2 h-0.5 bg-red-500 shadow-lg shadow-red-500 animate-bounce"></div>
              </div>
              <span className="text-[11px] text-blue-200 mt-2 font-medium">
                Align physical machine tag QR inside viewfinder
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSimulateScan}
                className="flex-1 h-11 rounded-lg bg-[#131b2e] text-white text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 shadow"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                Simulate Scan (P-04)
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="px-3 h-11 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Machine Drawer Form Modal */}
      {showAddMachineDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end p-3 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-2xl max-w-sm mx-auto w-full text-left border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-1"></div>
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#131b2e]">precision_manufacturing</span>
                <h3 className="font-bold text-sm text-[#0b1c30]">Register New Machine</h3>
              </div>
              <button
                onClick={() => setShowAddMachineDrawer(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMachine} className="flex flex-col gap-2.5">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">
                  Machine ID / Asset Tag *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., CNC-PUN-09"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-lg bg-slate-50 border border-slate-200 font-bold focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">
                  Machine Name &amp; Model *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Multi-Spindle Lathe Station"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">
                    Assembly Line
                  </label>
                  <select
                    value={newLine}
                    onChange={(e) => setNewLine(e.target.value)}
                    className="w-full h-10 px-2 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:outline-none"
                  >
                    <option>Line 1 - Machining</option>
                    <option>Line 2 - Stamping</option>
                    <option>Line 3 - Body Welding</option>
                    <option>Line 4 - Plastics</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">
                    Criticality
                  </label>
                  <select
                    value={newCriticality}
                    onChange={(e) => setNewCriticality(e.target.value as 'A' | 'B' | 'C')}
                    className="w-full h-10 px-2 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:outline-none"
                  >
                    <option value="A">A - Bottleneck</option>
                    <option value="B">B - Standard</option>
                    <option value="C">C - Auxiliary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">
                  Upload Photo / Tag
                </label>
                <div className="h-16 rounded-lg bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-100">
                  <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                  <span className="text-[10px] mt-0.5">Attach photo or spec sheet</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 mt-2 bg-[#131b2e] text-white text-xs font-bold uppercase rounded-lg shadow"
              >
                Save Machine Asset
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
