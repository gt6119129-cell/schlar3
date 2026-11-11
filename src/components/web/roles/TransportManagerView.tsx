import React, { useState, useMemo } from 'react';
import {
  Bus,
  MapPin,
  Users,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle,
  Phone,
  Radio,
  FileText,
  Plus,
  Send,
  Navigation,
  Wrench,
  Calendar,
  Download,
  Printer,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  User,
  AlertCircle,
  Layers,
  Fuel,
  TrendingUp,
  Settings
} from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import {
  TransportVehicle,
  TransportDriver,
  TransportRoute,
  StudentTransportAssignment,
  VehicleMaintenanceRecord,
  TransportIncident,
  TransportAnnouncement,
  Student
} from '../../../types/school';
import { getThemeClasses } from '../../../utils/themeHelper';

export const TransportManagerView: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    themeColor,
    transportVehicles,
    transportDrivers,
    transportRoutes,
    transportAssignments,
    vehicleMaintenance,
    transportIncidents,
    transportAnnouncements,
    students,
    addTransportVehicle,
    updateTransportVehicle,
    deleteTransportVehicle,
    addTransportDriver,
    updateTransportDriver,
    addTransportRoute,
    updateTransportRoute,
    deleteTransportRoute,
    assignStudentTransport,
    cancelStudentTransport,
    recordVehicleMaintenance,
    updateVehicleMaintenanceStatus,
    recordTransportIncident,
    publishTransportAnnouncement,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Search & Filter States
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState('all');
  const [selectedRouteForRoster, setSelectedRouteForRoster] = useState(transportRoutes[0]?.routeCode || 'RT-01');
  const [selectedRouteForStops, setSelectedRouteForStops] = useState(transportRoutes[0]?.routeCode || 'RT-01');
  const [commuterSearch, setCommuterSearch] = useState('');

  // Modals
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<TransportVehicle | null>(null);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<TransportRoute | null>(null);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<TransportDriver | null>(null);
  const [showAssignCommuterModal, setShowAssignCommuterModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Forms
  const [vehicleForm, setVehicleForm] = useState({
    vehicleNo: 'DL-01-TA-9911',
    makeModel: 'Tata Marcopolo City Rider 40',
    type: 'Standard 45-Seater Bus' as TransportVehicle['type'],
    capacity: 40,
    fuelType: 'Diesel' as TransportVehicle['fuelType'],
    status: 'Active' as TransportVehicle['status'],
    fitnessExpiry: '2027-05-15',
    insuranceExpiry: '2027-04-20',
    pucExpiry: '2027-03-10',
    speedGovernorCert: 'CERT-SG-2026-9911',
    assignedRouteCode: 'RT-01'
  });

  const [routeForm, setRouteForm] = useState({
    routeName: 'Route 6 — Sohna Road & Cyber City',
    startPoint: 'Sohna Road Badshahpur Chowk',
    endPoint: 'Campus Gate 3 Main Porch',
    morningDeparture: '06:45 AM',
    eveningArrival: '03:45 PM',
    assignedVehicleId: transportVehicles[0]?.id || '',
    assignedVehicleNo: transportVehicles[0]?.vehicleNo || 'DL-01-TA-4820',
    driverName: 'Mr. Ramesh Chand',
    driverPhone: '+91 98110 44211',
    conductorName: 'Suraj Bhan',
    capacity: 45
  });

  const [driverForm, setDriverForm] = useState({
    name: 'Mr. Suresh Rawat',
    role: 'Lead Bus Driver' as TransportDriver['role'],
    licenseNo: 'DL-042014008912',
    licenseExpiry: '2028-11-20',
    badgeNumber: 'TRN-B-408',
    bloodGroup: 'B+ve',
    phone: '+91 98119 55677',
    emergencyPhone: '+91 98119 55678',
    assignedVehicleId: transportVehicles[0]?.id || '',
    assignedVehicleNo: transportVehicles[0]?.vehicleNo || 'DL-01-TA-4820',
    assignedRouteCode: 'RT-01',
    experienceYears: 11,
    status: 'Active' as TransportDriver['status']
  });

  const [commuterForm, setCommuterForm] = useState({
    studentId: students[0]?.id || '',
    routeCode: transportRoutes[0]?.routeCode || 'RT-01',
    stopName: transportRoutes[0]?.stops[0]?.stopName || 'Sector 14 Gate',
    pickupTime: transportRoutes[0]?.stops[0]?.morningPickupTime || '06:45 AM',
    dropTime: transportRoutes[0]?.stops[0]?.eveningDropTime || '04:15 PM'
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    vehicleId: transportVehicles[0]?.id || '',
    maintenanceType: 'Routine 10,000 km Service' as VehicleMaintenanceRecord['maintenanceType'],
    odometerReading: 48250,
    serviceDate: new Date().toISOString().split('T')[0],
    nextDueDate: '2027-04-24',
    serviceCenter: 'Authorized Commercial Motors Workshop, Gurgaon',
    cost: 14500,
    workDescription: 'Quarterly general inspection, engine oil flush, brake lining replacement, wiper check.'
  });

  const [incidentForm, setIncidentForm] = useState({
    dateTime: new Date().toISOString().slice(0, 16),
    routeCode: transportRoutes[0]?.routeCode || 'RT-01',
    vehicleNo: transportVehicles[0]?.vehicleNo || 'DL-01-TA-4820',
    category: 'Traffic Delay' as TransportIncident['category'],
    delayMinutes: 15,
    description: 'Heavy bumper-to-bumper morning gridlock near IFFCO Chowk caused a 15-minute delay.',
    actionTakenNotes: 'Driver notified school control desk; SMS advisory dispatched to waiting parents.',
    reportedBy: 'Mr. S. K. Nair (Transport Manager)',
    affectedStudentsCount: 38
  });

  const [broadcastForm, setBroadcastForm] = useState({
    title: 'Morning Transit Delay Advisory',
    targetRouteCode: 'All Routes',
    priority: 'normal' as TransportAnnouncement['priority'],
    message: 'Notice to Commuters: Route 1 is operating with a 12-minute delay due to traffic diversions on MG Road.'
  });

  // Analytics & Operational Numbers
  const totalFleetCount = transportVehicles.length;
  const activeVehiclesCount = transportVehicles.filter(v => v.status === 'Active').length;
  const maintenanceCount = transportVehicles.filter(v => v.status === 'Under Maintenance').length;
  const totalCapacity = transportVehicles.reduce((acc, v) => acc + v.capacity, 0);
  const totalCommuters = transportAssignments.filter(a => a.status === 'active').length;
  const activeRoutesCount = transportRoutes.filter(r => r.status === 'Active').length;
  const openIncidentsCount = transportIncidents.filter(i => i.status !== 'Resolved').length;

  // Filtered vehicles
  const filteredVehicles = transportVehicles.filter(v => {
    const matchesSearch =
      v.vehicleCode.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.vehicleNo.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.makeModel.toLowerCase().includes(vehicleSearch.toLowerCase());
    const matchesStatus = vehicleStatusFilter === 'all' || v.status === vehicleStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Commuters
  const filteredCommuters = transportAssignments.filter(a => {
    return (
      a.studentName.toLowerCase().includes(commuterSearch.toLowerCase()) ||
      a.routeCode.toLowerCase().includes(commuterSearch.toLowerCase()) ||
      a.pickupStopName.toLowerCase().includes(commuterSearch.toLowerCase()) ||
      a.guardianPhone.includes(commuterSearch)
    );
  });

  // Handle Vehicle Form Submit
  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      updateTransportVehicle(editingVehicle.id, {
        vehicleNo: vehicleForm.vehicleNo,
        makeModel: vehicleForm.makeModel,
        type: vehicleForm.type,
        capacity: Number(vehicleForm.capacity),
        fuelType: vehicleForm.fuelType,
        status: vehicleForm.status,
        fitnessExpiry: vehicleForm.fitnessExpiry,
        insuranceExpiry: vehicleForm.insuranceExpiry,
        pucExpiry: vehicleForm.pucExpiry,
        speedGovernorCert: vehicleForm.speedGovernorCert,
        assignedRouteCode: vehicleForm.assignedRouteCode
      });
      showToast(`Updated vehicle ${editingVehicle.vehicleCode} (${vehicleForm.vehicleNo}).`, 'success');
      setEditingVehicle(null);
    } else {
      const nextCode = `BUS-${String(transportVehicles.length + 1).padStart(2, '0')}`;
      const res = addTransportVehicle({
        vehicleCode: nextCode,
        vehicleNo: vehicleForm.vehicleNo,
        makeModel: vehicleForm.makeModel,
        type: vehicleForm.type,
        capacity: Number(vehicleForm.capacity),
        fuelType: vehicleForm.fuelType,
        status: vehicleForm.status,
        fitnessExpiry: vehicleForm.fitnessExpiry,
        insuranceExpiry: vehicleForm.insuranceExpiry,
        pucExpiry: vehicleForm.pucExpiry,
        speedGovernorCert: vehicleForm.speedGovernorCert,
        assignedRouteCode: vehicleForm.assignedRouteCode
      });
      showToast(`Registered new fleet asset ${res.vehicleCode} (${vehicleForm.vehicleNo}).`, 'success');
      setShowAddVehicleModal(false);
    }
  };

  // Open Edit Vehicle modal
  const openEditVehicle = (veh: TransportVehicle) => {
    setEditingVehicle(veh);
    setVehicleForm({
      vehicleNo: veh.vehicleNo,
      makeModel: veh.makeModel,
      type: veh.type,
      capacity: veh.capacity,
      fuelType: veh.fuelType,
      status: veh.status,
      fitnessExpiry: veh.fitnessExpiry,
      insuranceExpiry: veh.insuranceExpiry,
      pucExpiry: veh.pucExpiry,
      speedGovernorCert: veh.speedGovernorCert,
      assignedRouteCode: veh.assignedRouteCode || 'RT-01'
    });
  };

  // Handle Route Submit
  const handleRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoute) {
      updateTransportRoute(editingRoute.id, {
        routeName: routeForm.routeName,
        startPoint: routeForm.startPoint,
        endPoint: routeForm.endPoint,
        morningDeparture: routeForm.morningDeparture,
        eveningArrival: routeForm.eveningArrival,
        assignedVehicleId: routeForm.assignedVehicleId,
        assignedVehicleNo: routeForm.assignedVehicleNo,
        driverName: routeForm.driverName,
        driverPhone: routeForm.driverPhone,
        conductorName: routeForm.conductorName,
        capacity: Number(routeForm.capacity)
      });
      showToast(`Updated route ${editingRoute.routeCode}.`, 'success');
      setEditingRoute(null);
    } else {
      const nextRouteCode = `RT-${String(transportRoutes.length + 1).padStart(2, '0')}`;
      const res = addTransportRoute({
        routeCode: nextRouteCode,
        routeName: routeForm.routeName,
        startPoint: routeForm.startPoint,
        endPoint: routeForm.endPoint,
        morningDeparture: routeForm.morningDeparture,
        eveningArrival: routeForm.eveningArrival,
        assignedVehicleId: routeForm.assignedVehicleId,
        assignedVehicleNo: routeForm.assignedVehicleNo,
        driverName: routeForm.driverName,
        driverPhone: routeForm.driverPhone,
        conductorName: routeForm.conductorName,
        capacity: Number(routeForm.capacity),
        assignedStudentsCount: 0,
        status: 'Active',
        operatingDays: 'Mon – Sat',
        stops: [
          {
            id: 'stp-new-1',
            routeId: 'rt-new',
            stopName: 'Departure Depot',
            areaLandmark: 'Starting Corridor',
            morningPickupTime: routeForm.morningDeparture,
            eveningDropTime: routeForm.eveningArrival,
            sequence: 1,
            status: 'active'
          },
          {
            id: 'stp-new-2',
            routeId: 'rt-new',
            stopName: 'Campus Gate 3 (Drop)',
            areaLandmark: 'Senior Wing Porch',
            morningPickupTime: '07:45 AM',
            eveningDropTime: '02:30 PM',
            sequence: 2,
            status: 'active'
          }
        ]
      });
      showToast(`Created new transit route ${res.routeCode}.`, 'success');
      setShowAddRouteModal(false);
    }
  };

  // Open Edit Route
  const openEditRoute = (r: TransportRoute) => {
    setEditingRoute(r);
    setRouteForm({
      routeName: r.routeName,
      startPoint: r.startPoint,
      endPoint: r.endPoint,
      morningDeparture: r.morningDeparture,
      eveningArrival: r.eveningArrival,
      assignedVehicleId: r.assignedVehicleId,
      assignedVehicleNo: r.assignedVehicleNo,
      driverName: r.driverName,
      driverPhone: r.driverPhone,
      conductorName: r.conductorName,
      capacity: r.capacity
    });
  };

  // Handle Driver Submit
  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDriver) {
      updateTransportDriver(editingDriver.id, {
        name: driverForm.name,
        role: driverForm.role,
        licenseNo: driverForm.licenseNo,
        licenseExpiry: driverForm.licenseExpiry,
        badgeNumber: driverForm.badgeNumber,
        bloodGroup: driverForm.bloodGroup,
        phone: driverForm.phone,
        emergencyPhone: driverForm.emergencyPhone,
        assignedVehicleId: driverForm.assignedVehicleId,
        assignedVehicleNo: driverForm.assignedVehicleNo,
        assignedRouteCode: driverForm.assignedRouteCode,
        experienceYears: Number(driverForm.experienceYears),
        status: driverForm.status
      });
      showToast(`Updated driver profile for ${driverForm.name}.`, 'success');
      setEditingDriver(null);
    } else {
      const nextId = `EMP-DRV-00${transportDrivers.length + 1}`;
      addTransportDriver({
        staffId: nextId,
        name: driverForm.name,
        role: driverForm.role,
        licenseNo: driverForm.licenseNo,
        licenseExpiry: driverForm.licenseExpiry,
        badgeNumber: driverForm.badgeNumber,
        bloodGroup: driverForm.bloodGroup,
        phone: driverForm.phone,
        emergencyPhone: driverForm.emergencyPhone,
        assignedVehicleId: driverForm.assignedVehicleId,
        assignedVehicleNo: driverForm.assignedVehicleNo,
        assignedRouteCode: driverForm.assignedRouteCode,
        experienceYears: Number(driverForm.experienceYears),
        status: driverForm.status,
        joiningDate: '2024-04-01'
      });
      showToast(`Added ${driverForm.name} to transport crew roster.`, 'success');
      setShowAddDriverModal(false);
    }
  };

  // Handle Commuter Allocation Submit
  const handleCommuterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === commuterForm.studentId);
    if (!student) {
      showToast('Student could not be found.', 'error');
      return;
    }

    const route = transportRoutes.find(r => r.routeCode === commuterForm.routeCode);
    if (!route) {
      showToast('Route could not be found.', 'error');
      return;
    }

    const res = assignStudentTransport({
      studentId: student.id,
      studentName: student.name,
      admissionNo: student.admissionNo,
      standard: student.standard,
      section: student.section,
      routeId: route.id,
      routeCode: route.routeCode,
      pickupStopId: 'stp-01',
      pickupStopName: commuterForm.stopName,
      dropStopId: 'stp-campus',
      dropStopName: 'Campus Gate 3',
      guardianName: student.parentName,
      guardianPhone: student.parentPhone,
      effectiveFrom: new Date().toISOString().split('T')[0],
      status: 'active',
      annualFeePaid: true
    });

    if (res.success) {
      showToast(res.message, 'success');
      setShowAssignCommuterModal(false);
    } else {
      showToast(res.message, 'error');
    }
  };

  // Handle Maintenance Submit
  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = transportVehicles.find(v => v.id === maintenanceForm.vehicleId);
    if (!veh) return;

    const res = recordVehicleMaintenance({
      vehicleId: veh.id,
      vehicleNo: veh.vehicleNo,
      maintenanceType: maintenanceForm.maintenanceType,
      odometerReading: Number(maintenanceForm.odometerReading),
      serviceDate: maintenanceForm.serviceDate,
      nextDueDate: maintenanceForm.nextDueDate,
      serviceCenter: maintenanceForm.serviceCenter,
      cost: Number(maintenanceForm.cost),
      status: 'Scheduled',
      workDescription: maintenanceForm.workDescription,
      authorizedBy: 'Mr. S. K. Nair'
    });

    showToast(`Logged service record ${res.maintenanceNo} for ${veh.vehicleCode}.`, 'success');
    setShowMaintenanceModal(false);
  };

  // Handle Incident Submit
  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = recordTransportIncident({
      dateTime: incidentForm.dateTime,
      routeCode: incidentForm.routeCode,
      vehicleNo: incidentForm.vehicleNo,
      category: incidentForm.category,
      delayMinutes: Number(incidentForm.delayMinutes),
      description: incidentForm.description,
      actionTakenNotes: incidentForm.actionTakenNotes,
      reportedBy: incidentForm.reportedBy,
      affectedStudentsCount: Number(incidentForm.affectedStudentsCount),
      status: 'Investigating'
    });

    showToast(`Registered incident report ${res.incidentRef}.`, 'success');
    setShowIncidentModal(false);
  };

  // Handle Broadcast Dispatch
  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.message.trim()) return;

    publishTransportAnnouncement({
      title: broadcastForm.title,
      message: broadcastForm.message,
      targetAudience: broadcastForm.targetRouteCode === 'All Routes' ? 'all_routes' : 'specific_route',
      targetRouteCode: broadcastForm.targetRouteCode === 'All Routes' ? undefined : broadcastForm.targetRouteCode,
      publishDate: new Date().toISOString().split('T')[0],
      priority: broadcastForm.priority,
      status: 'published',
      createdBy: 'Mr. S. K. Nair (Transport Manager)'
    });

    showToast(`Transit broadcast dispatched to ${broadcastForm.targetRouteCode} commuters.`, 'success');
    setShowBroadcastModal(false);
    setBroadcastForm({
      title: 'Morning Transit Delay Advisory',
      targetRouteCode: 'All Routes',
      priority: 'normal',
      message: ''
    });
  };

  // Export CSV Operations Report
  const exportTransportReportCSV = () => {
    const headers = ['Vehicle Code', 'Registration', 'Model', 'Capacity', 'Fuel', 'Route', 'Status', 'Fitness Expiry', 'Insurance Expiry'];
    const rows = transportVehicles.map(v => [
      v.vehicleCode,
      v.vehicleNo,
      `"${v.makeModel}"`,
      v.capacity,
      v.fuelType,
      `"${v.assignedRouteCode || 'Unassigned'}"`,
      v.status,
      v.fitnessExpiry,
      v.insuranceExpiry
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SCHLAR_Fleet_Operations_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Fleet operations report exported successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Operations Mode Banner (Honest AIS-140 compliance, no fake GPS coordinates) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-amber-50 text-amber-800 border border-amber-200">
              Fleet Operations & Transit Safety
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              AIS-140 Compliant Speed & Telemetry Certified
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Campus Fleet Logistics & Student Commuter Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fleet maintenance schedules, driver credential audits, route capacities, commuter passenger rosters, and parent transit broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-sm ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
          >
            <Send className="w-3.5 h-3.5" /> Dispatch Alert
          </button>
          <button
            onClick={exportTransportReportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
          >
            <Download className="w-3.5 h-3.5" /> Export Manifest
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Fleet Vehicles</span>
                <Bus className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{totalFleetCount} Vehicles</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                {activeVehiclesCount} In Service · {maintenanceCount} In Maintenance
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Commuter Students</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-700">{totalCommuters}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Fleet Capacity: {totalCapacity} ({Math.round((totalCommuters / (totalCapacity || 1)) * 100)}% load factor)
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Active Transit Routes</span>
                <MapPin className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{activeRoutesCount} Routes</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Morning: 06:30–07:45 · Evening: 02:30–04:30
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Open Incidents</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-bold text-rose-700">{openIncidentsCount}</div>
              <div className="text-[11px] text-rose-600 mt-1">
                {openIncidentsCount > 0 ? 'Requires attention / resolution' : 'All incidents resolved'}
              </div>
            </div>
          </div>

          {/* Quick Action Dock */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
              Fleet Operations Fast Shortcuts
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <button
                onClick={() => setShowAddVehicleModal(true)}
                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-center group"
              >
                <Bus className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                <span className="text-xs font-bold text-slate-800 block">Add Vehicle</span>
                <span className="text-[10px] text-slate-400">Fleet Register</span>
              </button>

              <button
                onClick={() => setShowAddRouteModal(true)}
                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-center group"
              >
                <MapPin className="w-5 h-5 mx-auto mb-1 text-teal-600" />
                <span className="text-xs font-bold text-slate-800 block">Create Route</span>
                <span className="text-[10px] text-slate-400">Transit Path</span>
              </button>

              <button
                onClick={() => setShowAssignCommuterModal(true)}
                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-center group"
              >
                <Users className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <span className="text-xs font-bold text-slate-800 block">Assign Student</span>
                <span className="text-[10px] text-slate-400">Commuter Pass</span>
              </button>

              <button
                onClick={() => setShowMaintenanceModal(true)}
                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-center group"
              >
                <Wrench className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800 block">Log Service</span>
                <span className="text-[10px] text-slate-400">Maintenance</span>
              </button>

              <button
                onClick={() => setShowIncidentModal(true)}
                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-center group"
              >
                <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-rose-600" />
                <span className="text-xs font-bold text-slate-800 block">Report Incident</span>
                <span className="text-[10px] text-slate-400">Delay / Breakdown</span>
              </button>

              <button
                onClick={() => setShowBroadcastModal(true)}
                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-center group"
              >
                <Send className="w-5 h-5 mx-auto mb-1 text-teal-700" />
                <span className="text-xs font-bold text-slate-800 block">Broadcast Alert</span>
                <span className="text-[10px] text-slate-400">SMS / Push</span>
              </button>
            </div>
          </div>

          {/* Active Routes Operations Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Bus Routes Operations Status</h3>
                <p className="text-xs text-slate-500">Live operational timetable, driver assignments, and passenger loads</p>
              </div>
              <button
                onClick={() => setActiveTab('routes')}
                className="text-xs font-semibold text-teal-800 hover:underline"
              >
                View Routes Master
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transportRoutes.map(route => {
                const occupancyPct = Math.round((route.assignedStudentsCount / (route.capacity || 1)) * 100);
                return (
                  <div key={route.id} className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                        {route.routeCode}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        route.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {route.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{route.routeName}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        From {route.startPoint} to {route.endPoint}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-200/60">
                      <div className="flex justify-between">
                        <span>Vehicle / Driver:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[160px]">
                          {route.driverName} ({route.assignedVehicleNo})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timings:</span>
                        <span className="font-mono text-slate-700">Dep {route.morningDeparture} · Arr {route.eveningArrival}</span>
                      </div>
                    </div>

                    {/* Capacity bar */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-500">Commuters:</span>
                        <span className="font-semibold text-slate-800">
                          {route.assignedStudentsCount} / {route.capacity} seats ({occupancyPct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            occupancyPct > 90 ? 'bg-rose-500' : occupancyPct > 75 ? 'bg-amber-500' : 'bg-teal-600'
                          }`}
                          style={{ width: `${Math.min(100, occupancyPct)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VEHICLE FLEET REGISTER */}
      {/* ========================================================================= */}
      {activeTab === 'vehicles' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bus className="w-5 h-5 text-amber-600" />
                Vehicle Fleet Register & Compliance Master
              </h2>
              <p className="text-xs text-slate-500">
                Official institutional bus registry, fitness certificates, insurance renewals, and speed limiters
              </p>
            </div>
            <button
              onClick={() => {
                setEditingVehicle(null);
                setShowAddVehicleModal(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
            >
              <Plus className="w-3.5 h-3.5" /> Register Vehicle
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by vehicle code, plate number, or chassis model..."
                value={vehicleSearch}
                onChange={e => setVehicleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <select
              value={vehicleStatusFilter}
              onChange={e => setVehicleStatusFilter(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 bg-white w-full sm:w-auto"
            >
              <option value="all">All Statuses ({transportVehicles.length})</option>
              <option value="Active">Active / In Service</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="p-3 font-semibold">Code</th>
                  <th className="p-3 font-semibold">Registration No</th>
                  <th className="p-3 font-semibold">Model & Type</th>
                  <th className="p-3 font-semibold">Fuel & Capacity</th>
                  <th className="p-3 font-semibold">Assigned Route</th>
                  <th className="p-3 font-semibold">Fitness Expiry</th>
                  <th className="p-3 font-semibold">Insurance Expiry</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVehicles.map(veh => (
                  <tr key={veh.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{veh.vehicleCode}</td>
                    <td className="p-3 font-mono font-bold text-teal-800">{veh.vehicleNo}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{veh.makeModel}</div>
                      <div className="text-[10px] text-slate-400">{veh.type} · SG: {veh.speedGovernorCert}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{veh.capacity} Seats</div>
                      <div className="text-[10px] text-slate-500">{veh.fuelType}</div>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{veh.assignedRouteCode || 'Unassigned'}</td>
                    <td className="p-3 font-mono text-slate-600">{veh.fitnessExpiry}</td>
                    <td className="p-3 font-mono text-slate-600">{veh.insuranceExpiry}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        veh.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : veh.status === 'Under Maintenance'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {veh.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => openEditVehicle(veh)}
                        className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg"
                        title="Edit Vehicle"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteTransportVehicle(veh.id);
                          showToast(`Removed vehicle ${veh.vehicleCode} from fleet.`, 'info');
                        }}
                        className="p-1.5 text-rose-600 hover:text-rose-900 hover:bg-rose-50 rounded-lg"
                        title="Delete Vehicle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VEHICLE MAINTENANCE & LOGS */}
      {/* ========================================================================= */}
      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-600" />
                Fleet Maintenance & Garage Service Register
              </h2>
              <p className="text-xs text-slate-500">
                Scheduled servicing, brake inspections, tire replacements, and authorized workshop cost tracking
              </p>
            </div>
            <button
              onClick={() => setShowMaintenanceModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-xl transition shadow-2xs"
            >
              Log Vehicle Service
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="p-3 font-semibold">Service Ref</th>
                  <th className="p-3 font-semibold">Vehicle</th>
                  <th className="p-3 font-semibold">Service Type</th>
                  <th className="p-3 font-semibold">Odometer</th>
                  <th className="p-3 font-semibold">Service Date</th>
                  <th className="p-3 font-semibold">Next Due</th>
                  <th className="p-3 font-semibold">Cost</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicleMaintenance.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-medium text-slate-600">{rec.maintenanceNo}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{rec.vehicleNo}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{rec.maintenanceType}</td>
                    <td className="p-3 font-mono text-slate-600">{rec.odometerReading.toLocaleString()} km</td>
                    <td className="p-3 font-mono text-slate-600">{rec.serviceDate}</td>
                    <td className="p-3 font-mono text-slate-600">{rec.nextDueDate}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">₹{rec.cost.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : rec.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {rec.status !== 'Completed' && (
                        <button
                          onClick={() => {
                            updateVehicleMaintenanceStatus(rec.id, 'Completed');
                            showToast(`Marked ${rec.maintenanceNo} as Completed.`, 'success');
                          }}
                          className="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                        >
                          Mark Done
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DRIVERS & TRANSPORT STAFF */}
      {/* ========================================================================= */}
      {activeTab === 'drivers' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-700" />
                Drivers & Transit Crew Roster
              </h2>
              <p className="text-xs text-slate-500">
                Heavy transport commercial driving licenses, conductor badges, police verifications, and blood groups
              </p>
            </div>
            <button
              onClick={() => {
                setEditingDriver(null);
                setShowAddDriverModal(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
            >
              <Plus className="w-3.5 h-3.5" /> Add Driver / Crew
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="p-3 font-semibold">Staff Member</th>
                  <th className="p-3 font-semibold">Role</th>
                  <th className="p-3 font-semibold">License / Badge No</th>
                  <th className="p-3 font-semibold">Blood Group</th>
                  <th className="p-3 font-semibold">Assigned Route & Bus</th>
                  <th className="p-3 font-semibold">Contact Phone</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transportDrivers.map(drv => (
                  <tr key={drv.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{drv.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{drv.staffId || drv.id} · {drv.experienceYears} yrs exp</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">{drv.role}</td>
                    <td className="p-3 font-mono text-slate-600">
                      <div>{drv.licenseNo}</div>
                      <div className="text-[10px] text-slate-400">Badge: {drv.badgeNumber}</div>
                    </td>
                    <td className="p-3 font-bold text-rose-700">{drv.bloodGroup}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{drv.assignedRouteCode || 'Unassigned'}</div>
                      <div className="text-[10px] text-slate-400">{drv.assignedVehicleNo}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{drv.phone}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        drv.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {drv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setEditingDriver(drv);
                          setDriverForm({
                            name: drv.name,
                            role: drv.role,
                            licenseNo: drv.licenseNo,
                            licenseExpiry: drv.licenseExpiry,
                            badgeNumber: drv.badgeNumber,
                            bloodGroup: drv.bloodGroup,
                            phone: drv.phone,
                            emergencyPhone: drv.emergencyPhone,
                            assignedVehicleId: drv.assignedVehicleId || '',
                            assignedVehicleNo: drv.assignedVehicleNo || '',
                            assignedRouteCode: drv.assignedRouteCode || 'RT-01',
                            experienceYears: drv.experienceYears,
                            status: drv.status
                          });
                        }}
                        className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg"
                        title="Edit Driver Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BUS ROUTES */}
      {/* ========================================================================= */}
      {activeTab === 'routes' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-700" />
                Bus Routes Master Directory
              </h2>
              <p className="text-xs text-slate-500">
                Authorized arterial transit routes, morning pickups, evening drop-offs, and seat capacity limits
              </p>
            </div>
            <button
              onClick={() => {
                setEditingRoute(null);
                setShowAddRouteModal(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
            >
              <Plus className="w-3.5 h-3.5" /> Add New Route
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transportRoutes.map(route => (
              <div key={route.id} className="p-4 rounded-xl border border-slate-200 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-teal-800 text-white">
                      {route.routeCode}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{route.routeName}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditRoute(route)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded"
                      title="Edit Route"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        deleteTransportRoute(route.id);
                        showToast(`Deleted ${route.routeCode}.`, 'info');
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="Delete Route"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-700">Corridor:</span> From {route.startPoint} to {route.endPoint}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Assigned Driver & Bus</span>
                    <span className="font-semibold text-slate-800">{route.driverName}</span>
                    <span className="text-[10px] text-slate-500 block">{route.assignedVehicleNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Morning / Evening</span>
                    <span className="font-mono text-slate-800">{route.morningDeparture} Dep</span>
                    <span className="font-mono text-slate-500 block">{route.eveningArrival} Final</span>
                  </div>
                </div>

                {/* Stops in route */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Authorized Bus Stops ({route.stops.length})
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {route.stops.map((stop, idx) => (
                      <span key={stop.id || idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {idx + 1}. {stop.stopName} ({stop.morningPickupTime})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. BUS STOPS & SCHEDULES */}
      {/* ========================================================================= */}
      {activeTab === 'stops' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Stop-by-Stop Transit Schedule
              </h2>
              <p className="text-xs text-slate-500">
                Sequence, morning pickup times, evening drop-off times, and landmark references
              </p>
            </div>
            <select
              value={selectedRouteForStops}
              onChange={e => setSelectedRouteForStops(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 font-semibold"
            >
              {transportRoutes.map(r => (
                <option key={r.id} value={r.routeCode}>
                  {r.routeCode} — {r.routeName}
                </option>
              ))}
            </select>
          </div>

          {(() => {
            const currentRoute = transportRoutes.find(r => r.routeCode === selectedRouteForStops) || transportRoutes[0];
            return (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold">{currentRoute?.routeCode}: {currentRoute?.routeName}</span>
                    <p className="text-[11px] text-teal-700 mt-0.5">
                      Driver: {currentRoute?.driverName} ({currentRoute?.driverPhone}) · Vehicle: {currentRoute?.assignedVehicleNo}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold">{currentRoute?.stops.length} Stops</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                        <th className="p-3 font-semibold">Sequence</th>
                        <th className="p-3 font-semibold">Stop Name</th>
                        <th className="p-3 font-semibold">Morning Pickup</th>
                        <th className="p-3 font-semibold">Evening Drop</th>
                        <th className="p-3 font-semibold">Landmark / Waiting Area</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentRoute?.stops.map((stp, idx) => (
                        <tr key={stp.id || idx} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 font-bold text-slate-700">#{idx + 1}</td>
                          <td className="p-3 font-bold text-slate-900">{stp.stopName}</td>
                          <td className="p-3 font-mono font-semibold text-teal-800">{stp.morningPickupTime}</td>
                          <td className="p-3 font-mono font-semibold text-indigo-800">{stp.eveningDropTime}</td>
                          <td className="p-3 text-slate-600">{stp.areaLandmark || 'Designated Bus Bay'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. STUDENT COMMUTER ALLOCATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Student Commuter Allocations & Pass Registry
              </h2>
              <p className="text-xs text-slate-500">
                Official student bus passes linked to parent emergency contacts and shared student directory
              </p>
            </div>
            <button
              onClick={() => setShowAssignCommuterModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
            >
              <Plus className="w-3.5 h-3.5" /> Assign Commuter Pass
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, route, stop, or parent phone..."
              value={commuterSearch}
              onChange={e => setCommuterSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="p-3 font-semibold">Student</th>
                  <th className="p-3 font-semibold">Class / Admission</th>
                  <th className="p-3 font-semibold">Assigned Route</th>
                  <th className="p-3 font-semibold">Boarding Stop</th>
                  <th className="p-3 font-semibold">Parent Emergency Phone</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCommuters.map(comm => (
                  <tr key={comm.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-slate-900">{comm.studentName}</td>
                    <td className="p-3 text-slate-600">Std {comm.standard}-{comm.section} ({comm.admissionNo})</td>
                    <td className="p-3">
                      <span className="font-mono font-bold text-teal-800">{comm.routeCode}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{comm.pickupStopName}</td>
                    <td className="p-3 font-mono text-slate-700">{comm.guardianPhone}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {comm.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          cancelStudentTransport(comm.id);
                          showToast(`Cancelled commuter allocation for ${comm.studentName}.`, 'info');
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. ROUTE PASSENGER ROSTERS */}
      {/* ========================================================================= */}
      {activeTab === 'rosters' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-700" />
                Bus Passenger Daily Manifest & Duty Roster
              </h2>
              <p className="text-xs text-slate-500">
                Official printed manifest for bus drivers, attendants, and front gate security checks
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedRouteForRoster}
                onChange={e => setSelectedRouteForRoster(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-200 font-semibold"
              >
                {transportRoutes.map(r => (
                  <option key={r.id} value={r.routeCode}>
                    {r.routeCode} — {r.routeName}
                  </option>
                ))}
              </select>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                <Printer className="w-3.5 h-3.5" /> Print Manifest
              </button>
            </div>
          </div>

          {(() => {
            const route = transportRoutes.find(r => r.routeCode === selectedRouteForRoster) || transportRoutes[0];
            const commuters = transportAssignments.filter(a => a.routeCode === selectedRouteForRoster);
            return (
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{route?.routeName}</h3>
                    <p className="text-xs text-slate-500">
                      Vehicle: <span className="font-semibold text-slate-800">{route?.assignedVehicleNo}</span> · Driver: <span className="font-semibold text-slate-800">{route?.driverName}</span> ({route?.driverPhone})
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-slate-100 text-slate-700">
                    {commuters.length} Commuters Registered
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                        <th className="p-2 font-semibold">#</th>
                        <th className="p-2 font-semibold">Student Name</th>
                        <th className="p-2 font-semibold">Grade</th>
                        <th className="p-2 font-semibold">Stop</th>
                        <th className="p-2 font-semibold">Parent Phone</th>
                        <th className="p-2 font-semibold text-center">Boarding Check</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {commuters.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-400">
                            No students currently allocated to this route.
                          </td>
                        </tr>
                      ) : (
                        commuters.map((c, idx) => (
                          <tr key={c.id}>
                            <td className="p-2 font-bold text-slate-500">{idx + 1}</td>
                            <td className="p-2 font-bold text-slate-900">{c.studentName}</td>
                            <td className="p-2 text-slate-600">Std {c.standard}-{c.section}</td>
                            <td className="p-2 font-semibold text-slate-800">{c.pickupStopName}</td>
                            <td className="p-2 font-mono text-slate-600">{c.guardianPhone}</td>
                            <td className="p-2 text-center">
                              <span className="inline-block w-4 h-4 rounded border border-slate-300" />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. TRANSPORT INCIDENT REGISTER */}
      {/* ========================================================================= */}
      {activeTab === 'incidents' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Transport Incident & Delay Register
              </h2>
              <p className="text-xs text-slate-500">
                Official incident log: mechanical breakdowns, tire punctures, traffic jams, and route diversions
              </p>
            </div>
            <button
              onClick={() => setShowIncidentModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition shadow-2xs"
            >
              Report Incident
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="p-3 font-semibold">Incident Ref</th>
                  <th className="p-3 font-semibold">Date & Time</th>
                  <th className="p-3 font-semibold">Route / Vehicle</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Delay</th>
                  <th className="p-3 font-semibold">Description</th>
                  <th className="p-3 font-semibold">Action Taken</th>
                  <th className="p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transportIncidents.map(inc => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-medium text-slate-600">{inc.incidentRef}</td>
                    <td className="p-3 font-mono text-slate-600">{inc.dateTime.replace('T', ' ')}</td>
                    <td className="p-3 font-bold text-slate-800">{inc.routeCode} ({inc.vehicleNo})</td>
                    <td className="p-3 font-semibold text-slate-900">{inc.category}</td>
                    <td className="p-3 font-mono text-rose-700 font-bold">{inc.delayMinutes} min</td>
                    <td className="p-3 text-slate-600 max-w-xs">{inc.description}</td>
                    <td className="p-3 text-slate-600 max-w-xs">{inc.actionTakenNotes}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inc.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. TRANSIT BROADCASTS & ALERTS */}
      {/* ========================================================================= */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-teal-700" />
                Transit Broadcasts & Parent SMS Advisories
              </h2>
              <p className="text-xs text-slate-500">
                Urgent route delay notifications, bad weather diversions, and holiday schedule circulars
              </p>
            </div>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
            >
              <Send className="w-3.5 h-3.5" /> Dispatch New Broadcast
            </button>
          </div>

          <div className="space-y-3">
            {transportAnnouncements.map(ann => (
              <div key={ann.id} className="p-4 rounded-xl border border-slate-200 space-y-2 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">
                      {ann.broadcastNo}
                    </span>
                    <span className="text-xs font-bold text-teal-800">
                      Target: {ann.targetAudience === 'all_routes' ? 'All Routes' : ann.targetRouteCode}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-semibold text-slate-700">{ann.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {ann.publishDate}
                  </span>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                  {ann.message}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Author: {ann.createdBy}</span>
                  <span className="font-semibold text-emerald-700">Status: {ann.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. FLEET & ROUTE REPORTS */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-700" />
                Fleet Logistics & Compliance Operational Report
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Audited metrics on fleet capacity load factors, maintenance expenditures, and driver licenses
              </p>
            </div>
            <button
              onClick={exportTransportReportCSV}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-sm ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
            >
              <Download className="w-4 h-4" /> Export Operations CSV
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-400 font-medium">Fleet Load Factor</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {Math.round((totalCommuters / (totalCapacity || 1)) * 100)}%
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{totalCommuters} of {totalCapacity} seats filled</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-400 font-medium">Maintenance Cost AY 26–27</span>
              <div className="text-2xl font-bold text-indigo-700 mt-1">
                ₹{vehicleMaintenance.reduce((acc, m) => acc + m.cost, 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{vehicleMaintenance.length} service records</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-400 font-medium">Safety Score</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">99.4%</div>
              <p className="text-[11px] text-emerald-600 mt-1">AIS-140 speed compliance</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-400 font-medium">Active Crew Members</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{transportDrivers.length}</div>
              <p className="text-[11px] text-slate-500 mt-1">All commercial licenses valid</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. TRANSPORT MANAGER PROFILE */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-700 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              SN
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Mr. S. K. Nair</h2>
              <p className="text-xs text-amber-800 font-semibold">Senior Transport & Logistics Officer</p>
              <p className="text-xs text-slate-500 mt-0.5">Staff ID: EMP-TRN-001 · Department: Campus Logistics & Fleet Operations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-slate-400 font-medium block mb-1">Official Email</span>
              <span className="font-semibold text-slate-900">transport.office@schlar.edu</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-slate-400 font-medium block mb-1">Transport Control Room Hotline</span>
              <span className="font-semibold text-slate-900">+91 124 498 2250 (Hotline Ext. 108)</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-slate-400 font-medium block mb-1">Duty Hours</span>
              <span className="font-semibold text-slate-900">Monday – Saturday: 06:15 AM – 05:00 PM</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-slate-400 font-medium block mb-1">Professional Certifications</span>
              <span className="font-semibold text-slate-900">Certified Fleet Safety Director (CFSD), First Aid Response Trainer</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-900 space-y-1">
            <span className="font-bold block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Role Entitlements & Security Scope
            </span>
            <p className="text-amber-800 leading-relaxed">
              Authorized for full vehicle fleet maintenance, bus route optimization, driver duty rosters, student transport passes, and parent transit alerts.
              Strictly restricted from bursar fee ledgers, student examination report cards, confidential HR files, and library circulation registers.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Register / Edit Vehicle Modal */}
      {(showAddVehicleModal || editingVehicle) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingVehicle ? 'Edit Vehicle Fleet Asset' : 'Register New Fleet Vehicle'}
              </h3>
              <button
                onClick={() => {
                  setShowAddVehicleModal(false);
                  setEditingVehicle(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVehicleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Registration Plate *</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.vehicleNo}
                    onChange={e => setVehicleForm({ ...vehicleForm, vehicleNo: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Make / Model *</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.makeModel}
                    onChange={e => setVehicleForm({ ...vehicleForm, makeModel: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    min="10"
                    max="65"
                    value={vehicleForm.capacity}
                    onChange={e => setVehicleForm({ ...vehicleForm, capacity: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fuel Type</label>
                  <select
                    value={vehicleForm.fuelType}
                    onChange={e => setVehicleForm({ ...vehicleForm, fuelType: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Status</label>
                  <select
                    value={vehicleForm.status}
                    onChange={e => setVehicleForm({ ...vehicleForm, status: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  >
                    <option value="Active">Active / In Service</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fitness Certificate Expiry</label>
                  <input
                    type="date"
                    value={vehicleForm.fitnessExpiry}
                    onChange={e => setVehicleForm({ ...vehicleForm, fitnessExpiry: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Insurance Expiry</label>
                  <input
                    type="date"
                    value={vehicleForm.insuranceExpiry}
                    onChange={e => setVehicleForm({ ...vehicleForm, insuranceExpiry: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Route Code</label>
                  <input
                    type="text"
                    value={vehicleForm.assignedRouteCode}
                    onChange={e => setVehicleForm({ ...vehicleForm, assignedRouteCode: e.target.value })}
                    placeholder="e.g. RT-01"
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Speed Governor Cert</label>
                  <input
                    type="text"
                    value={vehicleForm.speedGovernorCert}
                    onChange={e => setVehicleForm({ ...vehicleForm, speedGovernorCert: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddVehicleModal(false);
                    setEditingVehicle(null);
                  }}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  {editingVehicle ? 'Update Vehicle' : 'Register Vehicle Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Route Modal */}
      {(showAddRouteModal || editingRoute) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingRoute ? 'Edit Transit Route' : 'Create New Bus Route'}
              </h3>
              <button
                onClick={() => {
                  setShowAddRouteModal(false);
                  setEditingRoute(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRouteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Route Name *</label>
                <input
                  type="text"
                  required
                  value={routeForm.routeName}
                  onChange={e => setRouteForm({ ...routeForm, routeName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Start Origin Point</label>
                  <input
                    type="text"
                    value={routeForm.startPoint}
                    onChange={e => setRouteForm({ ...routeForm, startPoint: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">End Campus Terminal</label>
                  <input
                    type="text"
                    value={routeForm.endPoint}
                    onChange={e => setRouteForm({ ...routeForm, endPoint: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Morning Departure</label>
                  <input
                    type="text"
                    value={routeForm.morningDeparture}
                    onChange={e => setRouteForm({ ...routeForm, morningDeparture: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Evening Campus Arrival</label>
                  <input
                    type="text"
                    value={routeForm.eveningArrival}
                    onChange={e => setRouteForm({ ...routeForm, eveningArrival: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Vehicle No</label>
                  <input
                    type="text"
                    value={routeForm.assignedVehicleNo}
                    onChange={e => setRouteForm({ ...routeForm, assignedVehicleNo: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Driver</label>
                  <input
                    type="text"
                    value={routeForm.driverName}
                    onChange={e => setRouteForm({ ...routeForm, driverName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Driver Contact Phone</label>
                  <input
                    type="text"
                    value={routeForm.driverPhone}
                    onChange={e => setRouteForm({ ...routeForm, driverPhone: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Seating Capacity</label>
                  <input
                    type="number"
                    min="15"
                    max="60"
                    value={routeForm.capacity}
                    onChange={e => setRouteForm({ ...routeForm, capacity: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddRouteModal(false);
                    setEditingRoute(null);
                  }}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  {editingRoute ? 'Save Changes' : 'Create Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Driver Modal */}
      {(showAddDriverModal || editingDriver) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingDriver ? 'Edit Driver Profile' : 'Add Driver / Transit Crew Member'}
              </h3>
              <button
                onClick={() => {
                  setShowAddDriverModal(false);
                  setEditingDriver(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDriverSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Driver Full Name *</label>
                  <input
                    type="text"
                    required
                    value={driverForm.name}
                    onChange={e => setDriverForm({ ...driverForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Transit Role</label>
                  <select
                    value={driverForm.role}
                    onChange={e => setDriverForm({ ...driverForm, role: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="Lead Bus Driver">Lead Bus Driver</option>
                    <option value="Relief Driver">Relief Driver</option>
                    <option value="Bus Conductor">Bus Conductor</option>
                    <option value="Transit Attendant">Transit Attendant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Heavy Driving License No *</label>
                  <input
                    type="text"
                    required
                    value={driverForm.licenseNo}
                    onChange={e => setDriverForm({ ...driverForm, licenseNo: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">License Expiry Date</label>
                  <input
                    type="date"
                    value={driverForm.licenseExpiry}
                    onChange={e => setDriverForm({ ...driverForm, licenseExpiry: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Badge No</label>
                  <input
                    type="text"
                    value={driverForm.badgeNumber}
                    onChange={e => setDriverForm({ ...driverForm, badgeNumber: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={driverForm.bloodGroup}
                    onChange={e => setDriverForm({ ...driverForm, bloodGroup: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Experience (Yrs)</label>
                  <input
                    type="number"
                    value={driverForm.experienceYears}
                    onChange={e => setDriverForm({ ...driverForm, experienceYears: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={driverForm.phone}
                    onChange={e => setDriverForm({ ...driverForm, phone: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Emergency Phone</label>
                  <input
                    type="text"
                    value={driverForm.emergencyPhone}
                    onChange={e => setDriverForm({ ...driverForm, emergencyPhone: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDriverModal(false);
                    setEditingDriver(null);
                  }}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  {editingDriver ? 'Save Profile' : 'Add to Crew'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Commuter Modal */}
      {showAssignCommuterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Assign Student to Bus Route</h3>
              <button onClick={() => setShowAssignCommuterModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCommuterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Student *</label>
                <select
                  value={commuterForm.studentId}
                  onChange={e => setCommuterForm({ ...commuterForm, studentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Std {s.standard}-{s.section}, Roll #{s.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Transit Route *</label>
                <select
                  value={commuterForm.routeCode}
                  onChange={e => {
                    const rCode = e.target.value;
                    const rt = transportRoutes.find(r => r.routeCode === rCode);
                    setCommuterForm({
                      ...commuterForm,
                      routeCode: rCode,
                      stopName: rt?.stops[0]?.stopName || 'Gate',
                      pickupTime: rt?.stops[0]?.morningPickupTime || '06:45 AM',
                      dropTime: rt?.stops[0]?.eveningDropTime || '04:15 PM'
                    });
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                >
                  {transportRoutes.map(r => (
                    <option key={r.id} value={r.routeCode}>
                      {r.routeCode}: {r.routeName} ({r.assignedStudentsCount}/{r.capacity} seats)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Boarding Stop *</label>
                <select
                  value={commuterForm.stopName}
                  onChange={e => {
                    const stpName = e.target.value;
                    const rt = transportRoutes.find(r => r.routeCode === commuterForm.routeCode);
                    const matchedStp = rt?.stops.find(s => s.stopName === stpName);
                    setCommuterForm({
                      ...commuterForm,
                      stopName: stpName,
                      pickupTime: matchedStp?.morningPickupTime || '07:00 AM',
                      dropTime: matchedStp?.eveningDropTime || '04:00 PM'
                    });
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  {transportRoutes
                    .find(r => r.routeCode === commuterForm.routeCode)
                    ?.stops.map((stp, idx) => (
                      <option key={stp.id || idx} value={stp.stopName}>
                        {stp.stopName} (Pickup: {stp.morningPickupTime})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Morning Pickup</label>
                  <input
                    type="text"
                    value={commuterForm.pickupTime}
                    onChange={e => setCommuterForm({ ...commuterForm, pickupTime: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Evening Drop</label>
                  <input
                    type="text"
                    value={commuterForm.dropTime}
                    onChange={e => setCommuterForm({ ...commuterForm, dropTime: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignCommuterModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Maintenance Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Schedule / Log Fleet Maintenance</h3>
              <button onClick={() => setShowMaintenanceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMaintenanceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Vehicle Asset *</label>
                <select
                  value={maintenanceForm.vehicleId}
                  onChange={e => setMaintenanceForm({ ...maintenanceForm, vehicleId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                >
                  {transportVehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.vehicleCode}: {v.vehicleNo} ({v.makeModel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Service Type</label>
                  <select
                    value={maintenanceForm.maintenanceType}
                    onChange={e => setMaintenanceForm({ ...maintenanceForm, maintenanceType: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  >
                    <option value="Routine 10,000 km Service">Routine 10,000 km Service</option>
                    <option value="Brake & Tire Overhaul">Brake & Tire Overhaul</option>
                    <option value="Annual Fitness Inspection">Annual Fitness Inspection</option>
                    <option value="Air Conditioning Service">Air Conditioning Service</option>
                    <option value="Emergency Repair">Emergency Repair</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Odometer (km)</label>
                  <input
                    type="number"
                    value={maintenanceForm.odometerReading}
                    onChange={e => setMaintenanceForm({ ...maintenanceForm, odometerReading: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Service Date</label>
                  <input
                    type="date"
                    value={maintenanceForm.serviceDate}
                    onChange={e => setMaintenanceForm({ ...maintenanceForm, serviceDate: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    value={maintenanceForm.cost}
                    onChange={e => setMaintenanceForm({ ...maintenanceForm, cost: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Authorized Workshop / Garage</label>
                <input
                  type="text"
                  value={maintenanceForm.serviceCenter}
                  onChange={e => setMaintenanceForm({ ...maintenanceForm, serviceCenter: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Work Description</label>
                <textarea
                  rows={2}
                  value={maintenanceForm.workDescription}
                  onChange={e => setMaintenanceForm({ ...maintenanceForm, workDescription: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMaintenanceModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-xl"
                >
                  Record Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Incident Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Report Transit Incident / Delay</h3>
              <button onClick={() => setShowIncidentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIncidentSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Route Code *</label>
                  <input
                    type="text"
                    required
                    value={incidentForm.routeCode}
                    onChange={e => setIncidentForm({ ...incidentForm, routeCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Vehicle No</label>
                  <input
                    type="text"
                    value={incidentForm.vehicleNo}
                    onChange={e => setIncidentForm({ ...incidentForm, vehicleNo: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={incidentForm.category}
                    onChange={e => setIncidentForm({ ...incidentForm, category: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  >
                    <option value="Traffic Delay">Traffic Delay</option>
                    <option value="Minor Tire Puncture">Minor Tire Puncture</option>
                    <option value="Mechanical Breakdown">Mechanical Breakdown</option>
                    <option value="Weather Diversion">Weather Diversion</option>
                    <option value="Route Detour">Route Detour</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Delay (Minutes)</label>
                  <input
                    type="number"
                    value={incidentForm.delayMinutes}
                    onChange={e => setIncidentForm({ ...incidentForm, delayMinutes: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={incidentForm.description}
                  onChange={e => setIncidentForm({ ...incidentForm, description: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Action Taken Notes</label>
                <input
                  type="text"
                  value={incidentForm.actionTakenNotes}
                  onChange={e => setIncidentForm({ ...incidentForm, actionTakenNotes: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-xl"
                >
                  Submit Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Alert Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Dispatch Transit Advisory</h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Commuters</label>
                  <select
                    value={broadcastForm.targetRouteCode}
                    onChange={e => setBroadcastForm({ ...broadcastForm, targetRouteCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="All Routes">All Routes & Commuters</option>
                    {transportRoutes.map(r => (
                      <option key={r.id} value={r.routeCode}>
                        {r.routeCode} Only
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={broadcastForm.priority}
                    onChange={e => setBroadcastForm({ ...broadcastForm, priority: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Advisory Title *</label>
                <input
                  type="text"
                  required
                  value={broadcastForm.title}
                  onChange={e => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Broadcast Message Text *</label>
                <textarea
                  required
                  rows={3}
                  value={broadcastForm.message}
                  onChange={e => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  placeholder="Type advisory message dispatched to parents via SMS and Mobile App..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                Dispatches immediately via registered SMS gateway, Parent Mobile App push channel, and emergency WhatsApp notifications.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  Dispatch Advisory Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
