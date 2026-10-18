import React, { useState } from 'react';
import { Subsystem, Severity, BreakdownIncident } from '../types';

interface ReportBreakdownScreenProps {
  onBack: () => void;
  onSubmitBreakdown: (newIncident: Partial<BreakdownIncident>) => void;
}

export const ReportBreakdownScreen: React.FC<ReportBreakdownScreenProps> = ({
  onBack,
  onSubmitBreakdown,
}) => {
  const [plant, setPlant] = useState('Omega Auto Ltd - Pune Plant');
  const [department, setDepartment] = useState('Press & Stamping Shop');
  const [line, setLine] = useState('Line 2 - High Tonnage Press');
  const [machine, setMachine] = useState('P-04 • 800T Komatsu Stamping Press');
  const [startTime, setStartTime] = useState('Today, 10:35 AM');
  const [subsystem, setSubsystem] = useState<Subsystem>('Hydraulic');
  const [severity, setSeverity] = useState<Severity>('critical');
  const [description, setDescription] = useState(
    'Continuous hydraulic hiss heard near manifold block #2. Pressure dropped from 210 bar to 45 bar during stroke down-travel. Emergency cycle stop triggered.'
  );
  const [escalateSms, setEscalateSms] = useState(true);
  const [attachedPhoto, setAttachedPhoto] = useState<boolean>(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const setTimestampToNow = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    setStartTime(`Today, ${formattedHours}:${minutes} ${ampm}`);
  };

  const handleAppendTag = (tag: string) => {
    if (!description.includes(`[${tag}]`)) {
      setDescription((prev) => (prev ? `${prev} [${tag}]` : `[${tag}] `));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessModal(true);
  };

  const handleConfirmDone = () => {
    setShowSuccessModal(false);
    onSubmitBreakdown({
      title: `${machine.split('•')[0].trim()} - ${subsystem} Breakdown`,
      plant,
      department,
      line,
      machineId: machine.split('•')[0].trim(),
      machineName: machine,
      reportedAt: startTime,
      problemSummary: description,
      subsystem,
      severity,
      escalateAlert: escalateSms,
    });
  };

  return (
    <div className="flex flex-col w-full pb-32 bg-[#f8f9ff]">
      {/* Top Incident Status Notification Strip */}
      <section className="px-4 py-2 bg-[#dce9ff] border-b border-blue-200">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b61722] animate-pulse"></span>
            <span className="font-extrabold uppercase tracking-wider text-[#b61722] text-[10px]">
              New Stoppage Logging
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-600 font-medium text-[11px]">
            <span className="material-symbols-outlined text-[15px]">schedule</span>
            <span>Auto-sync active</span>
          </div>
        </div>
      </section>

      {/* Incident ID Banner */}
      <header className="px-4 pt-3 pb-2 bg-[#eff4ff] border-b border-slate-200/60">
        <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Incident ID</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-800 font-mono text-[10px] font-bold">
                DRAFT
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#0b1c30]">
              BD-2025-0842
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">history</span>
              Generated at 10:48 AM, 25 Feb 2025
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <span className="material-symbols-outlined text-[28px] material-symbols-filled">
              precision_manufacturing
            </span>
          </div>
        </div>
      </header>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="px-4 py-3 space-y-4">
        {/* Equipment & Location Section */}
        <fieldset className="space-y-2">
          <legend className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px] text-slate-500">apartment</span>
            Equipment &amp; Location
          </legend>

          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 space-y-3">
            {/* Factory Plant */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Factory Plant</label>
              <div className="relative">
                <select
                  value={plant}
                  onChange={(e) => setPlant(e.target.value)}
                  className="w-full h-11 pl-3 pr-10 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-[#0b1c30] appearance-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900"
                >
                  <option>Omega Auto Ltd - Pune Plant</option>
                  <option>Omega Auto Ltd - Sanand Plant</option>
                  <option>Omega Auto Ltd - Chennai Plant</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-slate-500 text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Department */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Shop / Department</label>
              <div className="relative">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-11 pl-3 pr-10 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-[#0b1c30] appearance-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900"
                >
                  <option>Press &amp; Stamping Shop</option>
                  <option>Weld Shop - Line 1</option>
                  <option>Paint Shop - Automated Cell</option>
                  <option>Final Assembly Division</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-slate-500 text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Production Line */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Production Line</label>
              <div className="relative">
                <select
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className="w-full h-11 pl-3 pr-10 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-[#0b1c30] appearance-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900"
                >
                  <option>Line 2 - High Tonnage Press</option>
                  <option>Line 1 - Transfer Press</option>
                  <option>Line 3 - Blanking Unit</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-slate-500 text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Target Machine */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-600">Target Machine</label>
                <span className="text-[9px] font-bold text-[#b61722] uppercase font-mono">
                  Critical Node
                </span>
              </div>
              <div className="relative">
                <select
                  value={machine}
                  onChange={(e) => setMachine(e.target.value)}
                  className="w-full h-11 pl-3 pr-10 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-[#0b1c30] appearance-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900"
                >
                  <option>P-04 • 800T Komatsu Stamping Press</option>
                  <option>P-02 • 1200T Hydraulic Punch</option>
                  <option>P-05 • Aida Servo Feeder</option>
                  <option>C-01 • Scrap Conveyor Belt</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-slate-500 text-[18px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Stoppage Commencement */}
        <fieldset className="space-y-2">
          <div className="flex items-center justify-between">
            <legend className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5 uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px] text-slate-500">alarm</span>
              Stoppage Commencement
            </legend>
            <span className="text-[10px] font-mono text-slate-500">IST (UTC+5:30)</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-sm sm:text-base font-bold text-[#0b1c30] focus:outline-none focus:bg-white"
                />
                <div className="text-[11px] text-slate-500 mt-1">
                  Downtime timer will begin from this log
                </div>
              </div>
              <button
                type="button"
                onClick={setTimestampToNow}
                className="h-11 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform flex-shrink-0 border border-slate-200"
              >
                <span className="material-symbols-outlined text-[16px]">update</span>
                <span>Set to Now</span>
              </button>
            </div>
          </div>
        </fieldset>

        {/* Primary Subsystem Affected */}
        <fieldset className="space-y-2">
          <div className="flex items-center justify-between">
            <legend className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5 uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px] text-slate-500">tune</span>
              Primary Subsystem Affected
            </legend>
            <span className="text-[11px] text-slate-400">Tap to pick</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'Mechanical', icon: 'settings', label: 'Mechanical' },
              { id: 'Electrical', icon: 'bolt', label: 'Electrical' },
              { id: 'Pneumatic', icon: 'air', label: 'Pneumatic' },
              { id: 'Hydraulic', icon: 'water_drop', label: 'Hydraulic' },
              { id: 'Instrumentation', icon: 'sensors', label: 'Instrumentation' },
              { id: 'Other', icon: 'category', label: 'Other' },
            ].map((cat) => {
              const isSelected = subsystem === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSubsystem(cat.id as Subsystem)}
                  className={`h-13 rounded-xl px-3 flex items-center gap-2.5 text-left shadow-sm active:scale-95 transition-all border ${
                    isSelected
                      ? 'bg-[#131b2e] text-white border-[#131b2e] ring-2 ring-blue-500'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isSelected ? 'text-amber-300' : 'text-slate-500'
                    }`}
                  >
                    {cat.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold block truncate">{cat.label}</span>
                    {isSelected && (
                      <span className="text-[9px] text-slate-300 uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px] text-blue-400">
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Severity Level Selector */}
        <fieldset className="space-y-2">
          <legend className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px] text-slate-500">
              emergency_heat
            </span>
            Severity Level
          </legend>

          <div className="grid grid-cols-4 gap-1.5">
            {(['low', 'medium', 'high', 'critical'] as Severity[]).map((level) => {
              const isSelected = severity === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSeverity(level)}
                  className={`py-2 rounded-lg flex flex-col items-center justify-center gap-1 shadow-sm transition-all border ${
                    isSelected && level === 'critical'
                      ? 'bg-[#b61722] text-white border-[#b61722]'
                      : isSelected && level === 'high'
                      ? 'bg-[#d95f00] text-white border-[#d95f00]'
                      : isSelected
                      ? 'bg-[#131b2e] text-white border-[#131b2e]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      level === 'critical'
                        ? 'bg-red-500'
                        : level === 'high'
                        ? 'bg-orange-500'
                        : level === 'medium'
                        ? 'bg-blue-400'
                        : 'bg-slate-400'
                    }`}
                  ></span>
                  <span className="text-[11px] font-bold capitalize">{level}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Alert Callout Banner */}
          {severity === 'critical' ? (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-950 flex items-start gap-2.5 shadow-sm">
              <span className="material-symbols-outlined text-[#b61722] text-[24px] flex-shrink-0 material-symbols-filled">
                report_problem
              </span>
              <div className="space-y-0.5">
                <div className="text-xs font-extrabold text-[#b61722] uppercase tracking-wide">
                  Production Line Halted
                </div>
                <p className="text-xs text-red-900 leading-snug">
                  Immediate stop broadcasted to Line 2 upstream cells. Line takt time buffer: 14 mins
                  remaining before total facility slowdown.
                </p>
              </div>
            </div>
          ) : severity === 'high' ? (
            <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 flex items-start gap-2.5 shadow-sm">
              <span className="material-symbols-outlined text-orange-600 text-[24px] flex-shrink-0">
                warning
              </span>
              <div className="space-y-0.5">
                <div className="text-xs font-extrabold text-orange-800 uppercase tracking-wide">
                  High Throughput Impact
                </div>
                <p className="text-xs text-orange-900 leading-snug">
                  Machine running at reduced cycle speed. Requires dispatch within 20 mins.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-start gap-2">
              <span className="material-symbols-outlined text-slate-500 text-[20px] flex-shrink-0">
                info
              </span>
              <div className="text-xs">
                Breakdown logged for scheduled batch repair window without immediate line stoppage.
              </div>
            </div>
          )}
        </fieldset>

        {/* Defect Symptoms & Codes */}
        <fieldset className="space-y-2">
          <div className="flex items-center justify-between">
            <legend className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5 uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px] text-slate-500">
                description
              </span>
              Defect Symptoms &amp; Codes
            </legend>
            <span className="text-[11px] text-slate-400">Field Log</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 space-y-2.5">
            {/* Common Presets Chips */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Common Presets
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { tag: 'Overheating', icon: 'local_fire_department' },
                  { tag: 'Oil Leak', icon: 'opacity' },
                  { tag: 'Motor Tripped', icon: 'power_off' },
                  { tag: 'Sensor Jam', icon: 'sensors_off' },
                ].map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => handleAppendTag(item.tag)}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold active:scale-95 transition-all flex items-center gap-1 border border-slate-200"
                  >
                    <span className="material-symbols-outlined text-[13px]">{item.icon}</span>
                    <span>{item.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe symptom, unusual sound, error codes (e.g. Error E-104 Hydraulic pressure drop)..."
              className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-[#0b1c30] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 leading-relaxed"
            />

            <div className="flex items-center justify-between pt-0.5 text-slate-500 text-[11px]">
              <div className="flex items-center gap-1 text-slate-600">
                <span className="material-symbols-outlined text-[15px] text-blue-600">mic</span>
                <span>Voice input ready</span>
              </div>
              <span className="font-mono">{description.length} chars</span>
            </div>
          </div>
        </fieldset>

        {/* Visual Evidence Photo */}
        <fieldset className="space-y-2">
          <div className="flex items-center justify-between">
            <legend className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5 uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px] text-slate-500">
                photo_camera
              </span>
              Visual Evidence (Optional)
            </legend>
            <span className="text-[11px] text-slate-400">
              {attachedPhoto ? '1 attached' : '0 attached'}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAttachedPhoto(true)}
                className="h-11 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-slate-200"
              >
                <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
                Take Photo
              </button>
              <button
                type="button"
                onClick={() => setAttachedPhoto(true)}
                className="h-11 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-slate-200"
              >
                <span className="material-symbols-outlined text-[18px]">attach_file</span>
                Attach File
              </button>
            </div>

            {attachedPhoto && (
              <div className="relative rounded-lg overflow-hidden bg-slate-50 border border-slate-200 p-2 flex items-center gap-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-wG6nDlkN8W5WjTsO1Je0tO6FmMQhoZaba06qNZTDK_Ksuw10nVt1O6isSbcF9PttaxQ6lksWZ45MSM7zqCGYXlusQfV4K-G1jD3wNBXF8ckufb3NvjBdHpbT9WWv_J9CshjZFxsvXqUnKyWzOK23TiULch5Q3T_HZXlbkSwNNeafByBzsshs1aStmTuXa9NkuyojkHrVw60NIrOCbLBGZDZgouFWOTJD4ibgKTC_ytwgYXvuJhnNZQ"
                  alt="Hydraulic valve leak close up"
                  className="w-14 h-14 rounded-md object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    hydraulic_valve_leak_04.jpg
                  </div>
                  <div className="text-[11px] text-slate-500">2.4 MB • Stamped with Geo-tag</div>
                  <div className="flex items-center gap-1 mt-0.5 text-[#b61722] text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[12px]">warning</span>
                    Active oil accumulation visible
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedPhoto(false)}
                  aria-label="Remove image"
                  className="w-7 h-7 rounded-full bg-slate-200 hover:bg-red-100 hover:text-red-700 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}
          </div>
        </fieldset>

        {/* Immediate Escalation Toggle */}
        <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-[#b61722] mt-0.5 material-symbols-filled">
              notifications_active
            </span>
            <div className="space-y-0.5 text-left">
              <div className="text-xs font-bold text-[#0b1c30]">Escalate Immediate Alert</div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Alert on-duty maintenance supervisor via SMS &amp; WhatsApp priority broadcast
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={escalateSms}
              onChange={(e) => setEscalateSms(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b61722]"></div>
          </label>
        </div>

        {/* Supervisor preview pill */}
        <div className="px-3 py-2 bg-[#eff4ff] rounded-lg border border-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <span className="material-symbols-outlined text-[16px] text-slate-500">person</span>
            <span>
              Assigned on shift: <strong className="font-bold">Rajesh M. (Lead Hydraulics)</strong>
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#b61722]"></span>
        </div>

        {/* Submit & Discard CTAs */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            type="submit"
            className="w-full h-13 rounded-xl bg-[#b61722] hover:bg-[#9e131d] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-700/20 active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">crisis_alert</span>
            <span>Submit Breakdown Alert</span>
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Discard Draft &amp; Return to Floor
          </button>
        </div>
      </form>

      {/* Submission Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white rounded-2xl p-5 shadow-2xl flex flex-col items-center text-center space-y-3 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-[#b61722]">
              <span className="material-symbols-outlined text-[32px] material-symbols-filled">
                check_circle
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-base font-bold text-[#0b1c30]">Ticket Broadcasted</div>
              <p className="text-xs text-slate-600 leading-snug">
                Incident <strong className="font-mono text-slate-900">BD-2025-0842</strong> assigned
                to Hydraulics Team. Response timer started.
              </p>
            </div>
            <button
              type="button"
              onClick={handleConfirmDone}
              className="w-full h-11 rounded-lg bg-[#131b2e] text-white text-xs font-bold uppercase tracking-wider shadow"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
