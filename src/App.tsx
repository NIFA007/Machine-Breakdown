import { useState } from 'react';
import { DeviceFrame } from './components/DeviceFrame';
import { TopHeader } from './components/TopHeader';
import { BottomNav } from './components/BottomNav';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { BreakdownQueueScreen } from './screens/BreakdownQueueScreen';
import { ReportBreakdownScreen } from './screens/ReportBreakdownScreen';
import { BreakdownDetailsScreen } from './screens/BreakdownDetailsScreen';
import { MachinesScreen } from './screens/MachinesScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { PlantReportsScreen } from './screens/PlantReportsScreen';
import { MoreMenuScreen } from './screens/MoreMenuScreen';
import {
  INITIAL_INCIDENTS,
  INITIAL_MACHINES,
  INITIAL_TECHNICIANS,
} from './data/mockData';
import {
  TabType,
  UserRole,
  ShiftType,
  DevicePlatform,
  BreakdownIncident,
  Machine,
  Technician,
} from './types';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [platform, setPlatform] = useState<DevicePlatform>('android');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [previousTab, setPreviousTab] = useState<TabType>('dashboard');

  const [currentRole, setCurrentRole] = useState<UserRole>('Operator');
  const [currentShift, setCurrentShift] = useState<ShiftType>('Shift A');
  const [currentPlant, setCurrentPlant] = useState('Pune Auto Plant - Plant 02');

  const [incidents, setIncidents] = useState<BreakdownIncident[]>(INITIAL_INCIDENTS);
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [technicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('BD-2025-0842');

  // Handle Tab Navigation
  const handleTabChange = (tab: TabType) => {
    setPreviousTab(activeTab);
    setActiveTab(tab);
  };

  // Open Ticket Details
  const handleOpenTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setPreviousTab(activeTab);
    setActiveTab('details');
  };

  // Quick Dispatch Technician
  const handleDispatchTech = (incidentId: string) => {
    setSelectedTicketId(incidentId);
    setPreviousTab(activeTab);
    setActiveTab('details');
  };

  // Submit new breakdown alert
  const handleSubmitBreakdown = (newPartial: Partial<BreakdownIncident>) => {
    const newId = `BD-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullIncident: BreakdownIncident = {
      id: newId,
      title: newPartial.title || 'Emergency Stoppage Alert',
      plant: newPartial.plant || currentPlant,
      department: newPartial.department || 'Press & Stamping Shop',
      line: newPartial.line || 'Line 2 - High Tonnage Press',
      machineId: newPartial.machineId || 'P-04',
      machineName: newPartial.machineName || '800T Komatsu Stamping Press',
      machineImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDUANDuA9Ppw4wBtpn3Tt8WCQnL20xTxCTfFL9Ro30V_uqQV6HYMru5vQ04gHG4aHHIUZJvIjctaTr_tmaVuv_OkrRk1NyP5AAgSamW4wOZVHMOUlcXGjrqYx9vmHGmj1XJc8eaQC9gRaYip2UsvpZhLAgwtpquWJ8VaBoFoxUoNOZFguSNqqGEWO9Ugkdu8oAntgugt6-Mqec6Y5dVWVgguRn13XEPRFEvPc0mXqw0YJzTHWIbnOMohA',
      reportedAt: newPartial.reportedAt || 'Just Now',
      reportedTimestamp: Date.now(),
      reportedBy: `Ramesh K. (${currentRole})`,
      status: 'open',
      severity: newPartial.severity || 'critical',
      subsystem: newPartial.subsystem || 'Hydraulic',
      downtimeSeconds: 1,
      problemSummary: newPartial.problemSummary || 'Breakdown reported on shop floor terminal.',
      spareParts: [],
      photos: [],
      escalateAlert: newPartial.escalateAlert ?? true,
      zone: 'Bay 4 • Line 2',
      lossRatePerMin: 140,
    };

    setIncidents([fullIncident, ...incidents]);
    setSelectedTicketId(newId);
    setActiveTab('breakdowns');
  };

  // Update existing incident
  const handleUpdateIncident = (updated: BreakdownIncident) => {
    setIncidents((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  // Add new machine
  const handleAddNewMachine = (newMachine: Machine) => {
    setMachines([newMachine, ...machines]);
  };

  // Login handler
  const handleLogin = (role: UserRole, shift: ShiftType, plant: string) => {
    setCurrentRole(role);
    setCurrentShift(shift);
    setCurrentPlant(plant);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const currentIncident =
    incidents.find((i) => i.id === selectedTicketId) || incidents[0];

  const getSubheading = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'breakdowns':
        return 'Breakdowns';
      case 'report':
        return 'Report Breakdown';
      case 'details':
        return 'Breakdown Details';
      case 'machines':
        return 'Machines';
      case 'calendar':
        return 'Maintenance Calendar';
      case 'reports':
        return 'Plant Reports';
      case 'more':
        return 'Settings & Role';
      default:
        return '';
    }
  };

  const isDetailOrReport = activeTab === 'details' || activeTab === 'report';

  return (
    <DeviceFrame platform={platform} onPlatformChange={setPlatform}>
      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <div className="flex flex-col min-h-full w-full relative">
          {/* Universal Header */}
          <TopHeader
            subtitle={getSubheading()}
            showBack={isDetailOrReport}
            onBack={() => setActiveTab(previousTab === 'report' || previousTab === 'details' ? 'dashboard' : previousTab)}
            currentRole={currentRole}
            currentShift={currentShift}
            currentPlant={currentPlant}
            onSelectPlant={setCurrentPlant}
            onSelectShift={setCurrentShift}
            onRoleClick={() => setActiveTab('more')}
            notificationCount={incidents.filter((i) => i.severity === 'critical' && i.status !== 'resolved').length}
          />

          {/* Active Screen Content */}
          <main className="flex-1 w-full">
            {activeTab === 'dashboard' && (
              <DashboardScreen
                incidents={incidents}
                onOpenTicket={handleOpenTicket}
                onDispatchTech={handleDispatchTech}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'breakdowns' && (
              <BreakdownQueueScreen
                incidents={incidents}
                onOpenTicket={handleOpenTicket}
                onAssignTech={handleDispatchTech}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'report' && (
              <ReportBreakdownScreen
                onBack={() => setActiveTab(previousTab)}
                onSubmitBreakdown={handleSubmitBreakdown}
              />
            )}

            {activeTab === 'details' && (
              <BreakdownDetailsScreen
                incident={currentIncident}
                technicians={technicians}
                onBack={() => setActiveTab(previousTab)}
                onUpdateIncident={handleUpdateIncident}
              />
            )}

            {activeTab === 'machines' && (
              <MachinesScreen
                machines={machines}
                onOpenTicket={handleOpenTicket}
                onAddNewMachine={handleAddNewMachine}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarScreen
                onOpenTicket={handleOpenTicket}
                onReportClick={() => setActiveTab('report')}
                currentIncident={currentIncident}
              />
            )}

            {activeTab === 'reports' && (
              <PlantReportsScreen
                technicians={technicians}
                onOpenTicket={handleOpenTicket}
              />
            )}

            {activeTab === 'more' && (
              <MoreMenuScreen
                currentRole={currentRole}
                currentShift={currentShift}
                currentPlant={currentPlant}
                platform={platform}
                onRoleChange={setCurrentRole}
                onShiftChange={setCurrentShift}
                onPlatformChange={setPlatform}
                onLogout={handleLogout}
              />
            )}
          </main>

          {/* Universal Bottom Navigation */}
          {!isDetailOrReport && (
            <BottomNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              openCount={incidents.filter((i) => i.status !== 'resolved').length}
            />
          )}
        </div>
      )}
    </DeviceFrame>
  );
}
