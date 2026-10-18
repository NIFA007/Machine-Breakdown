export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type TicketStatus = 'open' | 'in_progress' | 'on_hold' | 'resolved';
export type Subsystem = 'Mechanical' | 'Electrical' | 'Pneumatic' | 'Hydraulic' | 'Instrumentation' | 'Other';
export type MachineStatus = 'running' | 'down' | 'maintenance';
export type UserRole = 'Operator' | 'Technician' | 'Supervisor' | 'Admin';
export type ShiftType = 'Shift A' | 'Shift B' | 'Shift C';
export type DevicePlatform = 'android' | 'ios' | 'responsive';
export type TabType = 'dashboard' | 'breakdowns' | 'report' | 'machines' | 'calendar' | 'reports' | 'details' | 'more';

export interface SparePart {
  id: string;
  name: string;
  bin: string;
  qty: string;
  stockStatus: string;
}

export interface BreakdownIncident {
  id: string;
  title: string;
  plant: string;
  department: string;
  line: string;
  machineId: string;
  machineName: string;
  machineImage: string;
  reportedAt: string;
  reportedTimestamp: number; // Unix timestamp in ms
  reportedBy: string;
  assignedTech?: string;
  assignedTechInitials?: string;
  status: TicketStatus;
  severity: Severity;
  subsystem: Subsystem;
  downtimeSeconds: number;
  problemSummary: string;
  rootCause?: string;
  correctiveAction?: string;
  spareParts: SparePart[];
  photos: {
    url: string;
    caption: string;
    size?: string;
  }[];
  escalateAlert: boolean;
  zone: string;
  lossRatePerMin: number;
  holdReason?: string;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  line: string;
  department: string;
  status: MachineStatus;
  monthDowntime: string;
  mtbf: string;
  healthIndex?: number;
  oee?: string;
  continuousHours?: number;
  nextPmDays?: number;
  imageUrl: string;
  activeBreakdownId?: string;
  criticality: 'A' | 'B' | 'C';
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatar?: string;
  assignedCount: number;
  avgAckMin: number;
  avgMttrMin: number;
  resolvedCount: number;
  pendingCount: number;
  efficiency: number;
  specialty: string;
}

export interface CalendarEvent {
  date: string; // '2025-02-25'
  dayNumber: number;
  incidents: {
    id: string;
    machineName: string;
    severity: Severity;
    duration: string;
    status: TicketStatus;
  }[];
}
