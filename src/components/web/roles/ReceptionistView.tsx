import React, { useState, useMemo } from 'react';
import {
  PhoneCall,
  Users,
  Search,
  Plus,
  Clock,
  CheckCircle,
  FileText,
  Calendar,
  AlertCircle,
  LogOut,
  UserCheck,
  Send,
  Eye,
  BadgeCheck,
  Printer,
  ShieldCheck,
  Bell,
  MapPin,
  Edit2,
  X,
  CheckSquare,
  AlertTriangle,
  Download,
  Filter,
  ArrowRight,
  HelpCircle,
  User,
  Building2,
  MessageSquare,
  Sparkles,
  PhoneIncoming,
  PhoneOutgoing,
  CalendarCheck,
  ChevronRight,
  Briefcase,
  Layers,
  Inbox,
  RefreshCw
} from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import {
  VisitorEntry,
  VisitorCategory,
  AdmissionEnquiry,
  EnquirySource,
  EnquiryStatus,
  ReceptionAppointment,
  PhoneCallLog,
  ReceptionRequest,
  ReceptionRequestCategory,
  ReceptionRequestPriority,
  ReceptionRequestStatus,
  FrontOfficeDocumentRequest,
  FrontOfficeDocType,
  FrontOfficeDocStatus,
  Student
} from '../../../types/school';
import { getThemeClasses } from '../../../utils/themeHelper';

export const ReceptionistView: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    themeColor,
    visitors,
    enquiries,
    students,
    teachers,
    notices,
    checkInVisitor,
    checkOutVisitor,
    addEnquiry,
    updateEnquiryStatus,
    addEnquiryFollowUp,
    convertEnquiryToLead,
    appointments,
    scheduleAppointment,
    updateAppointmentStatus,
    rescheduleAppointment,
    callLogs,
    logPhoneCall,
    updateCallLogStatus,
    receptionRequests,
    createReceptionRequest,
    updateReceptionRequestStatus,
    assignReceptionRequest,
    documentRequests,
    createDocumentRequest,
    updateDocumentRequestStatus,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);
  const todayStr = '2026-10-14';

  // Search & Filter States
  const [visitorSearch, setVisitorSearch] = useState('');
  const [visitorCategoryFilter, setVisitorCategoryFilter] = useState<string>('all');
  const [visitorStatusFilter, setVisitorStatusFilter] = useState<'all' | 'inside' | 'completed'>('all');

  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('all');
  const [enquiryGradeFilter, setEnquiryGradeFilter] = useState<string>('all');

  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentTab, setAppointmentTab] = useState<'today' | 'upcoming' | 'all'>('today');

  const [callSearch, setCallSearch] = useState('');
  const [callTypeFilter, setCallTypeFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');

  const [requestSearch, setRequestSearch] = useState('');
  const [requestCategoryFilter, setRequestCategoryFilter] = useState<string>('all');
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('all');

  const [docSearch, setDocSearch] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState<string>('all');

  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryTab, setDirectoryTab] = useState<'students' | 'parents' | 'staff'>('students');

  // Modals & Active Detail States
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [activeVisitorPass, setActiveVisitorPass] = useState<VisitorEntry | null>(null);
  const [showCheckOutModal, setShowCheckOutModal] = useState<VisitorEntry | null>(null);
  const [checkOutNotes, setCheckOutNotes] = useState('');

  const [showAddEnquiryModal, setShowAddEnquiryModal] = useState(false);
  const [selectedEnquiryDetail, setSelectedEnquiryDetail] = useState<AdmissionEnquiry | null>(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState<AdmissionEnquiry | null>(null);
  const [followUpNoteText, setFollowUpNoteText] = useState('');
  const [followUpDateInput, setFollowUpDateInput] = useState('');

  const [showScheduleAppointmentModal, setShowScheduleAppointmentModal] = useState(false);
  const [appointmentConflictWarning, setAppointmentConflictWarning] = useState<ReceptionAppointment | null>(null);
  const [reschedulingAppointment, setReschedulingAppointment] = useState<ReceptionAppointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleStartTime, setRescheduleStartTime] = useState('');
  const [rescheduleEndTime, setRescheduleEndTime] = useState('');

  const [showLogCallModal, setShowLogCallModal] = useState(false);
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
  const [showCreateDocModal, setShowCreateDocModal] = useState(false);

  // Form states
  const [visitorForm, setVisitorForm] = useState({
    name: '',
    phone: '',
    category: 'Parent / Guardian' as VisitorCategory,
    organization: '',
    email: '',
    purpose: 'Parent-Teacher Interaction',
    meetingWith: teachers[0]?.name || 'Mrs. Shalini Verma',
    department: 'Senior Academic Faculty',
    appointmentRef: '',
    visitorsCount: 1,
    vehicleNo: '',
    idProof: 'National ID / Aadhaar Card',
    notes: ''
  });

  const [enquiryForm, setEnquiryForm] = useState({
    candidateName: '',
    standardApplying: 6,
    parentName: '',
    phone: '',
    email: '',
    date: todayStr,
    source: 'Walk-in' as EnquirySource,
    academicYear: '2026-2027',
    assignedStaff: 'Ms. Clara Martinez',
    status: 'new' as EnquiryStatus,
    notes: '',
    followUpDate: '2026-10-18',
    documentsProvided: [] as string[]
  });

  const [appointmentForm, setAppointmentForm] = useState({
    visitorName: '',
    visitorPhone: '',
    visitorCategory: 'Parent / Guardian' as VisitorCategory,
    organization: '',
    staffId: teachers[0]?.id || 'tch-01',
    staffName: teachers[0]?.name || 'Mrs. Shalini Verma',
    department: 'Senior Academic Faculty',
    purpose: 'Academic Performance & Subject Progress Discussion',
    date: todayStr,
    startTime: '11:00 AM',
    endTime: '11:30 AM',
    status: 'scheduled' as const,
    notes: ''
  });

  const [callForm, setCallForm] = useState({
    type: 'incoming' as 'incoming' | 'outgoing',
    callerName: '',
    callerPhone: '',
    callerCategory: 'Parent' as const,
    relatedStudentName: '',
    relatedStudentId: '',
    purpose: '',
    summary: '',
    assignedStaff: 'Ms. Clara Martinez',
    followUpRequired: false,
    followUpDate: '',
    date: todayStr,
    dateTime: `${todayStr} 10:30 AM`,
    status: 'logged' as const,
    recordedBy: 'Ms. Clara Martinez'
  });

  const [requestForm, setRequestForm] = useState({
    category: 'Teacher Meeting' as ReceptionRequestCategory,
    requesterName: '',
    requesterPhone: '',
    requesterRole: 'Parent' as const,
    studentReference: '',
    summary: '',
    description: '',
    assignedDepartment: 'Academic' as const,
    assignedStaff: '',
    priority: 'medium' as ReceptionRequestPriority,
    status: 'New' as ReceptionRequestStatus,
    date: todayStr
  });

  const [docForm, setDocForm] = useState({
    requesterName: '',
    requesterPhone: '',
    studentId: students[0]?.id || 'std-01',
    studentName: students[0]?.name || 'Aarav Sharma',
    standard: students[0]?.standard || 8,
    section: (students[0]?.section || 'A') as 'A' | 'B',
    documentType: 'Bonafide Certificate' as FrontOfficeDocType,
    requestDate: todayStr,
    assignedDepartment: 'Administration Office',
    status: 'Submitted' as FrontOfficeDocStatus,
    followUpDate: '2026-10-16',
    purposeRemarks: ''
  });

  // Derived Dashboard Metrics
  const activeVisitorsInside = useMemo(() => visitors.filter(v => v.status === 'inside'), [visitors]);
  const totalVisitorsToday = useMemo(() => visitors.filter(v => v.date === todayStr), [visitors]);
  const appointmentsToday = useMemo(() => appointments.filter(a => a.date === todayStr), [appointments]);
  const pendingEnquiries = useMemo(() => enquiries.filter(e => e.status !== 'admitted' && e.status !== 'closed' && e.status !== 'converted'), [enquiries]);
  const followUpsDueToday = useMemo(() => enquiries.filter(e => e.followUpDate === todayStr && e.status !== 'admitted' && e.status !== 'closed'), [enquiries]);
  const overdueFollowUps = useMemo(() => enquiries.filter(e => e.followUpDate < todayStr && e.status !== 'admitted' && e.status !== 'closed'), [enquiries]);
  const openRequests = useMemo(() => receptionRequests.filter(r => r.status !== 'Resolved' && r.status !== 'Closed'), [receptionRequests]);
  const callsToday = useMemo(() => callLogs.filter(c => c.date === todayStr), [callLogs]);
  const pendingDocRequests = useMemo(() => documentRequests.filter(d => d.status !== 'Completed' && d.status !== 'Rejected'), [documentRequests]);

  // Handlers
  const handleRegisterVisitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorForm.name.trim() || !visitorForm.phone.trim() || !visitorForm.purpose.trim()) {
      showToast('Please fill in visitor name, contact phone, and purpose.', 'error');
      return;
    }

    // Duplicate check-in prevention
    const existingActive = activeVisitorsInside.find(
      v => v.phone.replace(/[^0-9]/g, '') === visitorForm.phone.replace(/[^0-9]/g, '')
    );
    if (existingActive) {
      showToast(`Duplicate blocked: ${existingActive.name} is already checked in with active pass ${existingActive.passNo}.`, 'warning');
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    checkInVisitor({
      name: visitorForm.name,
      phone: visitorForm.phone,
      category: visitorForm.category,
      organization: visitorForm.organization,
      email: visitorForm.email,
      purpose: visitorForm.purpose,
      meetingWith: visitorForm.meetingWith,
      department: visitorForm.department,
      appointmentRef: visitorForm.appointmentRef || undefined,
      visitorsCount: Number(visitorForm.visitorsCount) || 1,
      vehicleNo: visitorForm.vehicleNo,
      date: todayStr,
      checkIn: timeStr,
      idProof: visitorForm.idProof,
      notes: visitorForm.notes
    });

    setShowCheckInModal(false);
    setTimeout(() => {
      const latest = visitors[0];
      if (latest) {
        setActiveVisitorPass(latest);
      }
    }, 100);

    setVisitorForm({
      name: '',
      phone: '',
      category: 'Parent / Guardian',
      organization: '',
      email: '',
      purpose: 'Parent-Teacher Interaction',
      meetingWith: teachers[0]?.name || 'Mrs. Shalini Verma',
      department: 'Senior Academic Faculty',
      appointmentRef: '',
      visitorsCount: 1,
      vehicleNo: '',
      idProof: 'National ID / Aadhaar Card',
      notes: ''
    });
  };

  const handleConfirmCheckOut = () => {
    if (!showCheckOutModal) return;
    checkOutVisitor(showCheckOutModal.id, checkOutNotes);
    setShowCheckOutModal(null);
    setCheckOutNotes('');
  };

  const handleCreateEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.candidateName.trim() || !enquiryForm.parentName.trim() || !enquiryForm.phone.trim()) {
      showToast('Please enter candidate name, parent name, and contact phone.', 'error');
      return;
    }

    addEnquiry({
      candidateName: enquiryForm.candidateName,
      standardApplying: Number(enquiryForm.standardApplying),
      parentName: enquiryForm.parentName,
      phone: enquiryForm.phone,
      email: enquiryForm.email,
      date: enquiryForm.date,
      source: enquiryForm.source,
      academicYear: enquiryForm.academicYear,
      assignedStaff: enquiryForm.assignedStaff,
      status: enquiryForm.status,
      notes: enquiryForm.notes,
      followUpDate: enquiryForm.followUpDate,
      documentsProvided: enquiryForm.documentsProvided
    });

    setShowAddEnquiryModal(false);
    setEnquiryForm({
      candidateName: '',
      standardApplying: 6,
      parentName: '',
      phone: '',
      email: '',
      date: todayStr,
      source: 'Walk-in',
      academicYear: '2026-2027',
      assignedStaff: 'Ms. Clara Martinez',
      status: 'new',
      notes: '',
      followUpDate: '2026-10-18',
      documentsProvided: []
    });
  };

  const handleScheduleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentForm.visitorName.trim() || !appointmentForm.visitorPhone.trim() || !appointmentForm.purpose.trim()) {
      showToast('Please complete visitor name, phone, and purpose.', 'error');
      return;
    }

    const selectedTeacher = teachers.find(t => t.id === appointmentForm.staffId);
    const staffName = selectedTeacher ? selectedTeacher.name : appointmentForm.staffName;

    const res = scheduleAppointment({
      visitorName: appointmentForm.visitorName,
      visitorPhone: appointmentForm.visitorPhone,
      visitorCategory: appointmentForm.visitorCategory,
      organization: appointmentForm.organization,
      staffId: appointmentForm.staffId,
      staffName,
      department: appointmentForm.department,
      purpose: appointmentForm.purpose,
      date: appointmentForm.date,
      startTime: appointmentForm.startTime,
      endTime: appointmentForm.endTime,
      status: 'scheduled',
      notes: appointmentForm.notes
    });

    if (!res.success && res.conflict) {
      setAppointmentConflictWarning(res.conflict);
      showToast(`Faculty schedule conflict detected for ${staffName} on ${appointmentForm.date} at ${appointmentForm.startTime}.`, 'warning');
      return;
    }

    setAppointmentConflictWarning(null);
    setShowScheduleAppointmentModal(false);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingAppointment || !rescheduleDate || !rescheduleStartTime) return;

    const res = rescheduleAppointment(
      reschedulingAppointment.id,
      rescheduleDate,
      rescheduleStartTime,
      rescheduleEndTime || '11:30 AM'
    );

    if (!res.success && res.conflict) {
      showToast(`Conflict: Faculty already has appointment ${res.conflict.appointmentNo} at that slot.`, 'error');
      return;
    }

    setReschedulingAppointment(null);
  };

  const handleLogCallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callForm.callerName.trim() || !callForm.callerPhone.trim() || !callForm.purpose.trim()) {
      showToast('Please provide caller name, contact phone, and call purpose.', 'error');
      return;
    }

    logPhoneCall({
      type: callForm.type,
      callerName: callForm.callerName,
      callerPhone: callForm.callerPhone,
      callerCategory: callForm.callerCategory,
      relatedStudentName: callForm.relatedStudentName || undefined,
      relatedStudentId: callForm.relatedStudentId || undefined,
      purpose: callForm.purpose,
      summary: callForm.summary,
      assignedStaff: callForm.assignedStaff,
      followUpRequired: callForm.followUpRequired,
      followUpDate: callForm.followUpRequired ? (callForm.followUpDate || '2026-10-16') : undefined,
      date: todayStr,
      dateTime: `${todayStr} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: callForm.followUpRequired ? 'pending_followup' : 'resolved',
      recordedBy: 'Ms. Clara Martinez'
    });

    setShowLogCallModal(false);
    setCallForm({
      type: 'incoming',
      callerName: '',
      callerPhone: '',
      callerCategory: 'Parent',
      relatedStudentName: '',
      relatedStudentId: '',
      purpose: '',
      summary: '',
      assignedStaff: 'Ms. Clara Martinez',
      followUpRequired: false,
      followUpDate: '',
      date: todayStr,
      dateTime: '',
      status: 'logged',
      recordedBy: 'Ms. Clara Martinez'
    });
  };

  const handleCreateRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.requesterName.trim() || !requestForm.summary.trim()) {
      showToast('Please fill in requester name and summary.', 'error');
      return;
    }

    createReceptionRequest({
      category: requestForm.category,
      requesterName: requestForm.requesterName,
      requesterPhone: requestForm.requesterPhone,
      requesterRole: requestForm.requesterRole,
      studentReference: requestForm.studentReference || undefined,
      summary: requestForm.summary,
      description: requestForm.description,
      assignedDepartment: requestForm.assignedDepartment,
      assignedStaff: requestForm.assignedStaff || undefined,
      priority: requestForm.priority,
      status: 'New',
      date: todayStr
    });

    setShowCreateRequestModal(false);
    setRequestForm({
      category: 'Teacher Meeting',
      requesterName: '',
      requesterPhone: '',
      requesterRole: 'Parent',
      studentReference: '',
      summary: '',
      description: '',
      assignedDepartment: 'Academic',
      assignedStaff: '',
      priority: 'medium',
      status: 'New',
      date: todayStr
    });
  };

  const handleCreateDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.requesterName.trim() || !docForm.studentName.trim() || !docForm.purposeRemarks.trim()) {
      showToast('Please enter requester name, student name, and purpose.', 'error');
      return;
    }

    createDocumentRequest({
      requesterName: docForm.requesterName,
      requesterPhone: docForm.requesterPhone,
      studentId: docForm.studentId,
      studentName: docForm.studentName,
      standard: Number(docForm.standard),
      section: docForm.section,
      documentType: docForm.documentType,
      requestDate: todayStr,
      assignedDepartment: docForm.assignedDepartment,
      status: 'Submitted',
      followUpDate: docForm.followUpDate,
      purposeRemarks: docForm.purposeRemarks
    });

    setShowCreateDocModal(false);
  };

  const handleExportVisitorsCSV = () => {
    const headers = ['Pass No', 'Name', 'Phone', 'Category', 'Organization', 'Meeting With', 'Department', 'Date', 'Check In', 'Check Out', 'Status', 'ID Proof', 'Notes'];
    const rows = visitors.map(v => [
      v.passNo,
      `"${v.name}"`,
      `"${v.phone}"`,
      `"${v.category || 'Visitor'}"`,
      `"${v.organization || '-'}"`,
      `"${v.meetingWith}"`,
      `"${v.department || '-'}"`,
      v.date,
      v.checkIn,
      v.checkOut || '-',
      v.status,
      `"${v.idProof}"`,
      `"${(v.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `schlar_daily_reception_register_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Daily visitor register exported as CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Operational Station Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${themeClasses.lightBg} ${themeClasses.textColor} flex items-center justify-center`}>
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Front Office & Reception Hub</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Terminal Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Main Reception Gate 1 · Terminal #02 · Shift: 07:45 AM - 04:30 PM · Officer: Ms. Clara Martinez
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowCheckInModal(true)}
            className={`px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
          >
            <Plus className="w-4 h-4" />
            Register Visitor
          </button>
          <button
            onClick={() => setShowAddEnquiryModal(true)}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4 text-slate-600" />
            New Enquiry
          </button>
          <button
            onClick={() => setShowScheduleAppointmentModal(true)}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-slate-600" />
            Book Slot
          </button>
          <button
            onClick={() => setShowLogCallModal(true)}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <PhoneIncoming className="w-4 h-4 text-slate-600" />
            Log Call
          </button>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Real Live Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              onClick={() => setActiveTab('visitors')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Visitors Inside</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">{activeVisitorsInside.length}</span>
                <span className="text-xs text-emerald-600 font-medium">Currently on campus</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Total today: {totalVisitorsToday.length} registered</p>
            </div>

            <div 
              onClick={() => setActiveTab('appointments')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Visits</span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">{appointmentsToday.length}</span>
                <span className="text-xs text-blue-600 font-medium">Scheduled</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {appointmentsToday.filter(a => a.status === 'checked_in').length} arrived · {appointmentsToday.filter(a => a.status === 'completed').length} completed
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('followups')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Follow-ups Due</span>
                <div className={`p-2 rounded-xl ${overdueFollowUps.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'}`}>
                  <CheckSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">{followUpsDueToday.length + overdueFollowUps.length}</span>
                {overdueFollowUps.length > 0 ? (
                  <span className="text-xs text-rose-600 font-medium">{overdueFollowUps.length} Overdue</span>
                ) : (
                  <span className="text-xs text-amber-600 font-medium">Due Today</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">From {pendingEnquiries.length} active enquiries</p>
            </div>

            <div 
              onClick={() => setActiveTab('requests')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Requests</span>
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">{openRequests.length}</span>
                <span className="text-xs text-purple-600 font-medium">Front-desk tickets</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{pendingDocRequests.length} certificate requests pending</p>
            </div>
          </div>

          {/* Quick Actions Fast Dock */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Front-Desk Fast Action Dock</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              <button
                onClick={() => setShowCheckInModal(true)}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/70 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">Check In Visitor</div>
                <div className="text-[10px] text-slate-500">Issue digital gate badge</div>
              </button>

              <button
                onClick={() => setActiveTab('visitors')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/70 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <LogOut className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">Check Out Visitor</div>
                <div className="text-[10px] text-slate-500">{activeVisitorsInside.length} inside campus</div>
              </button>

              <button
                onClick={() => setShowAddEnquiryModal(true)}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/70 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">New Enquiry</div>
                <div className="text-[10px] text-slate-500">Log prospective lead</div>
              </button>

              <button
                onClick={() => setShowScheduleAppointmentModal(true)}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/70 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">Book Meeting</div>
                <div className="text-[10px] text-slate-500">Faculty/Principal slot</div>
              </button>

              <button
                onClick={() => setActiveTab('directory')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/70 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Search className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">Quick Directory</div>
                <div className="text-[10px] text-slate-500">Student & guardian lookup</div>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/70 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Printer className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">Daily Register</div>
                <div className="text-[10px] text-slate-500">View log & print sheet</div>
              </button>
            </div>
          </div>

          {/* Two-Column Operational Hub */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Active Visitors & Today's Appointments */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Visitors Currently Inside */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <h2 className="text-sm font-bold text-slate-900">Currently Inside Campus ({activeVisitorsInside.length})</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('visitors')}
                    className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                  >
                    View All Passes <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {activeVisitorsInside.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <UserCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">No active visitors currently on campus</p>
                    <p className="text-[11px] text-slate-400 mt-1">All checked-in visitors have checked out.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {activeVisitorsInside.map(v => (
                      <div key={v.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs">{v.name}</span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {v.passNo}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                              {v.category || 'Visitor'}
                            </span>
                            {v.visitorsCount && v.visitorsCount > 1 && (
                              <span className="text-[10px] text-slate-500">+{v.visitorsCount - 1} guests</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-1">
                            <span className="font-medium text-slate-700">Meeting:</span> {v.meetingWith} ({v.department || 'Campus'}) · <span className="font-medium text-slate-700">Purpose:</span> {v.purpose}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              In: {v.checkIn} ({v.date})
                            </span>
                            <span>·</span>
                            <span>Phone: {v.phone}</span>
                            {v.vehicleNo && <span>· Vehicle: {v.vehicleNo}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setActiveVisitorPass(v)}
                            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-all"
                            title="View / Print Digital Badge"
                          >
                            <BadgeCheck className="w-3.5 h-3.5 text-slate-600" />
                            Pass
                          </button>
                          <button
                            onClick={() => setShowCheckOutModal(v)}
                            className="px-2.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1 transition-all"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Check Out
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Today's Scheduled Appointments */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-blue-600" />
                    <h2 className="text-sm font-bold text-slate-900">Today's Appointments ({appointmentsToday.length})</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                  >
                    View Calendar <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {appointmentsToday.map(appt => (
                    <div key={appt.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-xs">{appt.visitorName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                            {appt.appointmentNo}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            appt.status === 'checked_in' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            appt.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                            appt.status === 'cancelled' ? 'bg-rose-50 text-rose-700' :
                            'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {appt.status === 'checked_in' ? 'Arrived / Inside' :
                             appt.status === 'completed' ? 'Completed' :
                             appt.status === 'cancelled' ? 'Cancelled' : 'Scheduled'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          With <span className="font-medium text-slate-800">{appt.staffName}</span> ({appt.department}) · {appt.purpose}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Time Slot: {appt.startTime} – {appt.endTime} · Phone: {appt.visitorPhone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {appt.status === 'scheduled' && (
                          <button
                            onClick={() => {
                              setVisitorForm({
                                name: appt.visitorName,
                                phone: appt.visitorPhone,
                                category: appt.visitorCategory,
                                organization: appt.organization || '',
                                email: '',
                                purpose: appt.purpose,
                                meetingWith: appt.staffName,
                                department: appt.department,
                                appointmentRef: appt.appointmentNo,
                                visitorsCount: 1,
                                vehicleNo: '',
                                idProof: 'National ID / Aadhaar Card',
                                notes: `Linked to scheduled appointment ${appt.appointmentNo}`
                              });
                              setShowCheckInModal(true);
                            }}
                            className="px-2.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Arrived · Check In
                          </button>
                        )}
                        {appt.status === 'checked_in' && (
                          <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                            Active Pass Issued
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Follow-ups & Clearance Notice */}
            <div className="space-y-6">
              {/* Overdue / Due Follow-ups Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <h2 className="text-sm font-bold text-slate-900">Enquiry Follow-ups</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('followups')}
                    className="text-xs font-bold text-blue-700 hover:text-blue-800"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {overdueFollowUps.length > 0 && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Overdue Calls ({overdueFollowUps.length})
                        </span>
                        <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded font-bold">Action Needed</span>
                      </div>
                      {overdueFollowUps.slice(0, 2).map(ef => (
                        <div key={ef.id} className="pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{ef.candidateName} (Std {ef.standardApplying})</p>
                            <p className="text-[11px] text-slate-500">Parent: {ef.parentName} · {ef.phone}</p>
                          </div>
                          <button
                            onClick={() => {
                              setShowFollowUpModal(ef);
                              setFollowUpDateInput(todayStr);
                            }}
                            className="px-2 py-1 bg-white hover:bg-rose-100 text-rose-800 font-bold text-[10px] rounded border border-rose-300"
                          >
                            Follow Up
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    {followUpsDueToday.map(ef => (
                      <div key={ef.id} className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{ef.candidateName} (Std {ef.standardApplying})</span>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Due Today</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1">{ef.notes}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-500">{ef.parentName} · {ef.phone}</span>
                          <button
                            onClick={() => {
                              setShowFollowUpModal(ef);
                              setFollowUpDateInput(todayStr);
                            }}
                            className="px-2 py-1 bg-white hover:bg-amber-100 text-slate-800 font-bold text-[10px] rounded border border-amber-300"
                          >
                            Log Note
                          </button>
                        </div>
                      </div>
                    ))}
                    {followUpsDueToday.length === 0 && overdueFollowUps.length === 0 && (
                      <div className="p-4 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
                        No pending follow-ups due today.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Clearance & Permission Guard Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Clearance & Privacy Boundaries</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  As Front Office Executive, your account possesses <span className="font-semibold text-slate-800">Clearance Level 2</span>.
                  You can register visitors, schedule appointments, log enquiries, and route front-desk certificate requests.
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Authorized: Passes, Enquiries, Calls, Intake
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Restricted: Marks, Bursar accounts, HR dossiers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISITOR OPERATIONS: ACTIVE VISITOR PASSES (`visitors`) */}
      {activeTab === 'visitors' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Active Visitors on Campus</h2>
                <p className="text-xs text-slate-500">
                  Real-time physical gate passes currently open. All checked-in individuals are recorded below.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCheckInModal(true)}
                  className={`px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
                >
                  <Plus className="w-4 h-4" />
                  Check In New Visitor
                </button>
                <button
                  onClick={handleExportVisitorsCSV}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by visitor name, pass #, phone, or host..."
                  value={visitorSearch}
                  onChange={e => setVisitorSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>
              <select
                value={visitorCategoryFilter}
                onChange={e => setVisitorCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
              >
                <option value="all">All Categories</option>
                <option value="Parent / Guardian">Parent / Guardian</option>
                <option value="Prospective Parent">Prospective Parent</option>
                <option value="Vendor / Supplier">Vendor / Supplier</option>
                <option value="Guest / Speaker">Guest / Speaker</option>
                <option value="Service Provider">Service Provider</option>
                <option value="Delivery Personnel">Delivery Personnel</option>
              </select>
            </div>
          </div>

          {/* Active Visitors Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Pass No & Photo</th>
                    <th className="py-3 px-4">Visitor & Contact</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Meeting With & Dept</th>
                    <th className="py-3 px-4">Check-in Time</th>
                    <th className="py-3 px-4">ID Proof</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {activeVisitorsInside
                    .filter(v => {
                      const q = visitorSearch.toLowerCase();
                      const matchQ = v.name.toLowerCase().includes(q) ||
                        v.passNo.toLowerCase().includes(q) ||
                        v.phone.includes(q) ||
                        v.meetingWith.toLowerCase().includes(q);
                      const matchCat = visitorCategoryFilter === 'all' || v.category === visitorCategoryFilter;
                      return matchQ && matchCat;
                    })
                    .map(v => (
                      <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
                              {v.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-mono font-bold text-slate-900">{v.passNo}</div>
                              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                INSIDE
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{v.name}</div>
                          <div className="text-[11px] text-slate-500">{v.phone}</div>
                          {v.organization && (
                            <div className="text-[10px] text-slate-400">{v.organization}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {v.category || 'Visitor'}
                          </span>
                          {v.visitorsCount && v.visitorsCount > 1 && (
                            <div className="text-[10px] text-slate-400 mt-0.5">Group: {v.visitorsCount}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800">{v.meetingWith}</div>
                          <div className="text-[11px] text-slate-500">{v.department || 'Administration'}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1 italic">{v.purpose}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800">{v.checkIn}</div>
                          <div className="text-[10px] text-slate-400">{v.date}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-[11px] text-slate-700">{v.idProof}</div>
                          {v.vehicleNo && (
                            <div className="text-[10px] text-slate-400 font-mono">Veh: {v.vehicleNo}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setActiveVisitorPass(v)}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1"
                              title="Print Visitor Badge"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              Badge
                            </button>
                            <button
                              onClick={() => setShowCheckOutModal(v)}
                              className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              Check Out
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {activeVisitorsInside.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No active visitors inside campus matching the search criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VISIT HISTORY REGISTER (`visitor_history`) */}
      {activeTab === 'visitor_history' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Historical Visitor Register</h2>
                <p className="text-xs text-slate-500">
                  Permanent front-office record of all past and completed campus visits.
                </p>
              </div>
              <button
                onClick={handleExportVisitorsCSV}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-4 h-4 text-slate-600" />
                Export Full Register (CSV)
              </button>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter name, pass #, phone..."
                  value={visitorSearch}
                  onChange={e => setVisitorSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>

              <select
                value={visitorCategoryFilter}
                onChange={e => setVisitorCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
              >
                <option value="all">All Visitor Categories</option>
                <option value="Parent / Guardian">Parent / Guardian</option>
                <option value="Prospective Parent">Prospective Parent</option>
                <option value="Vendor / Supplier">Vendor / Supplier</option>
                <option value="Guest / Speaker">Guest / Speaker</option>
                <option value="Service Provider">Service Provider</option>
              </select>

              <select
                value={visitorStatusFilter}
                onChange={e => setVisitorStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
              >
                <option value="all">All Statuses (Active & Completed)</option>
                <option value="inside">Currently Inside Campus</option>
                <option value="completed">Checked Out & Completed</option>
              </select>
            </div>
          </div>

          {/* Full History Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Pass No</th>
                    <th className="py-3 px-4">Visitor Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Purpose & Host</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">In / Out Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {visitors
                    .filter(v => {
                      const q = visitorSearch.toLowerCase();
                      const matchQ = v.name.toLowerCase().includes(q) ||
                        v.passNo.toLowerCase().includes(q) ||
                        v.phone.includes(q) ||
                        v.meetingWith.toLowerCase().includes(q);
                      const matchCat = visitorCategoryFilter === 'all' || v.category === visitorCategoryFilter;
                      const matchStat = visitorStatusFilter === 'all' || v.status === visitorStatusFilter;
                      return matchQ && matchCat && matchStat;
                    })
                    .map(v => (
                      <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{v.passNo}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{v.name}</div>
                          <div className="text-[11px] text-slate-500">{v.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {v.category || 'Visitor'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800">{v.meetingWith}</div>
                          <div className="text-[11px] text-slate-500">{v.purpose}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{v.date}</td>
                        <td className="py-3 px-4">
                          <div className="text-slate-800 font-medium">In: {v.checkIn}</div>
                          <div className="text-slate-500 text-[11px]">Out: {v.checkOut || '–'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            v.status === 'inside'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {v.status === 'inside' ? 'Active Inside' : 'Completed'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setActiveVisitorPass(v)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" /> Pass
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ENQUIRIES & LEADS CRM (`enquiries`) */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Admission Enquiries Pipeline</h2>
                <p className="text-xs text-slate-500">
                  Front-office intake and prospective student enquiries for Academic Year 2026-2027.
                </p>
              </div>
              <button
                onClick={() => setShowAddEnquiryModal(true)}
                className={`px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
              >
                <Plus className="w-4 h-4" />
                Record New Enquiry
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidate, parent, enquiry #..."
                  value={enquirySearch}
                  onChange={e => setEnquirySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>

              <select
                value={enquiryStatusFilter}
                onChange={e => setEnquiryStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
              >
                <option value="all">All Enquiry Statuses</option>
                <option value="new">New Enquiry</option>
                <option value="contacted">Contacted</option>
                <option value="followup_required">Follow-up Required</option>
                <option value="visit_scheduled">Visit Scheduled</option>
                <option value="info_shared">Info Shared</option>
                <option value="converted">Converted to Admission</option>
                <option value="admitted">Admitted</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={enquiryGradeFilter}
                onChange={e => setEnquiryGradeFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
              >
                <option value="all">All Standards (Grades 1-12)</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                  <option key={g} value={String(g)}>Standard {g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Enquiries Grid / List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enquiries
              .filter(e => {
                const q = enquirySearch.toLowerCase();
                const matchQ = e.candidateName.toLowerCase().includes(q) ||
                  e.parentName.toLowerCase().includes(q) ||
                  e.enquiryNo.toLowerCase().includes(q) ||
                  e.phone.includes(q);
                const matchStatus = enquiryStatusFilter === 'all' || e.status === enquiryStatusFilter;
                const matchGrade = enquiryGradeFilter === 'all' || String(e.standardApplying) === enquiryGradeFilter;
                return matchQ && matchStatus && matchGrade;
              })
              .map(enq => (
                <div key={enq.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm">{enq.candidateName}</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            Std {enq.standardApplying}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Enquiry #{enq.enquiryNo} · Date: {enq.date} · Source: {enq.source || 'Walk-in'}
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        enq.status === 'converted' || enq.status === 'admitted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : enq.status === 'followup_required'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : enq.status === 'visit_scheduled'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {enq.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-700">Guardian:</span>
                        <span>{enq.parentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-700">Contact:</span>
                        <span>{enq.phone}</span>
                      </div>
                      {enq.email && (
                        <div className="flex justify-between">
                          <span className="font-medium text-slate-700">Email:</span>
                          <span className="text-[11px] truncate max-w-[200px]">{enq.email}</span>
                        </div>
                      )}
                      <div className="pt-1.5 border-t border-slate-200 text-slate-700">
                        <span className="font-semibold text-slate-800">Notes:</span> {enq.notes}
                      </div>
                    </div>

                    {enq.followUpDate && (
                      <div className="mt-2.5 flex items-center justify-between text-xs px-1">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Follow-up: <strong className="text-slate-700">{enq.followUpDate}</strong>
                        </span>
                        {enq.convertedLeadId && (
                          <span className="text-[11px] font-mono font-bold text-emerald-700">
                            Lead #{enq.convertedLeadId}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Dock */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setShowFollowUpModal(enq);
                        setFollowUpDateInput(enq.followUpDate || todayStr);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1 transition-all"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      Add Note
                    </button>

                    <div className="flex items-center gap-2">
                      {enq.status !== 'converted' && enq.status !== 'admitted' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Convert enquiry ${enq.enquiryNo} for ${enq.candidateName} to an official school Admission Lead?`)) {
                              convertEnquiryToLead(enq.id);
                            }
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all"
                        >
                          Convert Lead
                        </button>
                      )}

                      <select
                        value={enq.status}
                        onChange={e => updateEnquiryStatus(enq.id, e.target.value as any)}
                        className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="followup_required">Follow-up Req</option>
                        <option value="visit_scheduled">Visit Scheduled</option>
                        <option value="info_shared">Info Shared</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* DEDICATED FOLLOW-UPS TRACKER (`followups`) */}
      {activeTab === 'followups' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Enquiry Follow-ups Queue</h2>
              <p className="text-xs text-slate-500">
                Scheduled parent call-backs and verification follow-ups categorized by urgency.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                {overdueFollowUps.length} Overdue
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {followUpsDueToday.length} Due Today
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Overdue Section */}
            {overdueFollowUps.length > 0 && (
              <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-rose-800">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="text-sm font-bold">Overdue Follow-ups ({overdueFollowUps.length})</h3>
                </div>
                <div className="divide-y divide-rose-100">
                  {overdueFollowUps.map(item => (
                    <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{item.candidateName}</span>
                          <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                            Due {item.followUpDate}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">#{item.enquiryNo}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{item.parentName} · {item.phone}</p>
                        <p className="text-[11px] text-slate-500 italic mt-0.5">{item.notes}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowFollowUpModal(item);
                          setFollowUpDateInput(todayStr);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shrink-0 shadow-xs"
                      >
                        Record Interaction
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Due Today & Upcoming Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold">Scheduled Follow-ups</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {enquiries
                  .filter(e => e.followUpDate >= todayStr && e.status !== 'admitted' && e.status !== 'closed')
                  .sort((a, b) => a.followUpDate.localeCompare(b.followUpDate))
                  .map(item => (
                    <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{item.candidateName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.followUpDate === todayStr
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.followUpDate === todayStr ? 'Due Today' : item.followUpDate}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">#{item.enquiryNo}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Parent: <strong className="text-slate-800">{item.parentName}</strong> · Phone: {item.phone} · Std {item.standardApplying}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.notes}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowFollowUpModal(item);
                          setFollowUpDateInput(item.followUpDate || todayStr);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl shrink-0"
                      >
                        Add Progress Note
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPOINTMENTS SCHEDULE (`appointments`) */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Faculty & Office Appointments</h2>
                <p className="text-xs text-slate-500">
                  Scheduled parent-teacher meetings, prospective family tours, and administrative visits.
                </p>
              </div>
              <button
                onClick={() => setShowScheduleAppointmentModal(true)}
                className={`px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
              >
                <Plus className="w-4 h-4" />
                Schedule Appointment
              </button>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setAppointmentTab('today')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    appointmentTab === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Today ({appointmentsToday.length})
                </button>
                <button
                  onClick={() => setAppointmentTab('upcoming')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    appointmentTab === 'upcoming' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upcoming ({appointments.filter(a => a.date > todayStr).length})
                </button>
                <button
                  onClick={() => setAppointmentTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    appointmentTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({appointments.length})
                </button>
              </div>

              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search visitor, staff, appointment #..."
                  value={appointmentSearch}
                  onChange={e => setAppointmentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Appointments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments
              .filter(a => {
                if (appointmentTab === 'today') return a.date === todayStr;
                if (appointmentTab === 'upcoming') return a.date > todayStr;
                return true;
              })
              .filter(a => {
                const q = appointmentSearch.toLowerCase();
                return a.visitorName.toLowerCase().includes(q) ||
                  a.staffName.toLowerCase().includes(q) ||
                  a.appointmentNo.toLowerCase().includes(q) ||
                  a.purpose.toLowerCase().includes(q);
              })
              .map(appt => (
                <div key={appt.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{appt.visitorName}</span>
                          <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {appt.appointmentNo}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {appt.visitorCategory} · Phone: {appt.visitorPhone}
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        appt.status === 'checked_in' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        appt.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                        appt.status === 'cancelled' ? 'bg-rose-50 text-rose-700' :
                        appt.status === 'no_show' ? 'bg-amber-50 text-amber-700' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {appt.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-600">Staff Member:</span>
                        <strong className="text-slate-900">{appt.staffName}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-600">Department:</span>
                        <span>{appt.department}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-600">Scheduled Slot:</span>
                        <span className="font-bold text-blue-800">{appt.date} · {appt.startTime} – {appt.endTime}</span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-200">
                        <span className="font-semibold text-slate-800">Purpose:</span> {appt.purpose}
                      </div>
                    </div>

                    {appt.linkedVisitorPass && (
                      <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Linked to Visitor Pass #{appt.linkedVisitorPass}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {appt.status === 'scheduled' && (
                      <button
                        onClick={() => {
                          setVisitorForm({
                            name: appt.visitorName,
                            phone: appt.visitorPhone,
                            category: appt.visitorCategory,
                            organization: appt.organization || '',
                            email: '',
                            purpose: appt.purpose,
                            meetingWith: appt.staffName,
                            department: appt.department,
                            appointmentRef: appt.appointmentNo,
                            visitorsCount: 1,
                            vehicleNo: '',
                            idProof: 'National ID / Aadhaar Card',
                            notes: `Arrival linked to appointment ${appt.appointmentNo}`
                          });
                          setShowCheckInModal(true);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Arrived · Check In
                      </button>
                    )}

                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => {
                          setReschedulingAppointment(appt);
                          setRescheduleDate(appt.date);
                          setRescheduleStartTime(appt.startTime);
                          setRescheduleEndTime(appt.endTime);
                        }}
                        className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                      >
                        Reschedule
                      </button>

                      <select
                        value={appt.status}
                        onChange={e => updateAppointmentStatus(appt.id, e.target.value as any)}
                        className="px-2 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="checked_in">Checked In</option>
                        <option value="completed">Completed</option>
                        <option value="no_show">No Show</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CALL LOG (`call_log`) */}
      {activeTab === 'call_log' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Front Desk Phone Call Registry</h2>
                <p className="text-xs text-slate-500">
                  Daily incoming & outgoing parent inquiries, department hand-offs, and board queries.
                </p>
              </div>
              <button
                onClick={() => setShowLogCallModal(true)}
                className={`px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
              >
                <Plus className="w-4 h-4" />
                Log New Call
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search caller name, phone, purpose..."
                  value={callSearch}
                  onChange={e => setCallSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>

              <select
                value={callTypeFilter}
                onChange={e => setCallTypeFilter(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
              >
                <option value="all">All Call Types</option>
                <option value="incoming">Incoming Calls</option>
                <option value="outgoing">Outgoing Calls</option>
              </select>
            </div>
          </div>

          {/* Calls Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Call ID & Type</th>
                    <th className="py-3 px-4">Caller / Recipient</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Call Purpose & Summary</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Follow-up</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {callLogs
                    .filter(c => {
                      const q = callSearch.toLowerCase();
                      const matchQ = c.callerName.toLowerCase().includes(q) ||
                        c.callerPhone.includes(q) ||
                        c.purpose.toLowerCase().includes(q) ||
                        c.callNo.toLowerCase().includes(q);
                      const matchType = callTypeFilter === 'all' || c.type === callTypeFilter;
                      return matchQ && matchType;
                    })
                    .map(call => (
                      <tr key={call.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-slate-900">{call.callNo}</div>
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            call.type === 'incoming'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}>
                            {call.type === 'incoming' ? <PhoneIncoming className="w-3 h-3" /> : <PhoneOutgoing className="w-3 h-3" />}
                            {call.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{call.callerName}</div>
                          <div className="text-[11px] text-slate-500">{call.callerPhone}</div>
                          {call.relatedStudentName && (
                            <div className="text-[10px] text-slate-400">Student: {call.relatedStudentName}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {call.callerCategory}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-medium text-slate-800">{call.purpose}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-2">{call.summary}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-slate-800 font-medium">{call.dateTime}</div>
                          <div className="text-[10px] text-slate-400">By {call.recordedBy}</div>
                        </td>
                        <td className="py-3 px-4">
                          {call.followUpRequired ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              Due: {call.followUpDate || 'Pending'}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">None</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={call.status}
                            onChange={e => updateCallLogStatus(call.id, e.target.value as any)}
                            className="px-2 py-1 text-[11px] rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
                          >
                            <option value="logged">Logged</option>
                            <option value="pending_followup">Pending Follow-up</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RECEPTION REQUESTS HELPDESK (`requests`) */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Front Desk Requests & Helpdesk</h2>
                <p className="text-xs text-slate-500">
                  Track inquiries, teacher meeting requests, parent complaints, lost & found, and department referrals.
                </p>
              </div>
              <button
                onClick={() => setShowCreateRequestModal(true)}
                className={`px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
              >
                <Plus className="w-4 h-4" />
                New Request Ticket
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search requester, summary, ticket #..."
                  value={requestSearch}
                  onChange={e => setRequestSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>

              <select
                value={requestCategoryFilter}
                onChange={e => setRequestCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
              >
                <option value="all">All Categories</option>
                <option value="Teacher Meeting">Teacher Meeting</option>
                <option value="Department Contact">Department Contact</option>
                <option value="Document Enquiry">Document Enquiry</option>
                <option value="Parent Complaint">Parent Complaint</option>
                <option value="Lost & Found">Lost & Found</option>
                <option value="Campus Maintenance">Campus Maintenance</option>
                <option value="General">General</option>
              </select>

              <select
                value={requestStatusFilter}
                onChange={e => setRequestStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Waiting Response">Waiting Response</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Request Tickets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {receptionRequests
              .filter(r => {
                const q = requestSearch.toLowerCase();
                const matchQ = r.requesterName.toLowerCase().includes(q) ||
                  r.summary.toLowerCase().includes(q) ||
                  r.ticketNo.toLowerCase().includes(q);
                const matchCat = requestCategoryFilter === 'all' || r.category === requestCategoryFilter;
                const matchStatus = requestStatusFilter === 'all' || r.status === requestStatusFilter;
                return matchQ && matchCat && matchStatus;
              })
              .map(req => (
                <div key={req.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{req.summary}</span>
                          <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {req.ticketNo}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {req.category} · {req.requesterRole}: <strong>{req.requesterName}</strong> ({req.requesterPhone})
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        req.priority === 'urgent' ? 'bg-rose-100 text-rose-800' :
                        req.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {req.priority.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-700">
                      <p className="leading-relaxed">{req.description}</p>
                      {req.studentReference && (
                        <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                          Ref: {req.studentReference}
                        </p>
                      )}
                      <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Assigned: <strong>{req.assignedDepartment}</strong> {req.assignedStaff ? `(${req.assignedStaff})` : ''}</span>
                        <span>Date: {req.date}</span>
                      </div>
                    </div>

                    {req.resolutionNotes && (
                      <div className="mt-2 text-xs text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                        <strong className="text-emerald-900">Resolution Note:</strong> {req.resolutionNotes}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        const note = prompt('Add resolution or progress note:', req.resolutionNotes || '');
                        if (note !== null) {
                          updateReceptionRequestStatus(req.id, req.status, note);
                        }
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      Update Note
                    </button>

                    <select
                      value={req.status}
                      onChange={e => updateReceptionRequestStatus(req.id, e.target.value as any)}
                      className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
                    >
                      <option value="New">New</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Waiting Response">Waiting Response</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* DIRECTORY LOOKUP WITH ROLE-BASED PRIVACY BOUNDARIES (`directory`) */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Front-Office Directory Lookup</h2>
                <p className="text-xs text-slate-500">
                  Role-scoped directory for parent verification, student verification, and staff contact.
                </p>
              </div>

              {/* Privacy Warning Banner */}
              <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Privacy Guard:</strong> Marks, report cards, fees, and HR dossiers are restricted.
                </span>
              </div>
            </div>

            {/* Sub-tab selection */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setDirectoryTab('students')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    directoryTab === 'students' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Student Registry ({students.length})
                </button>
                <button
                  onClick={() => setDirectoryTab('parents')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    directoryTab === 'parents' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Parent Contacts
                </button>
                <button
                  onClick={() => setDirectoryTab('staff')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    directoryTab === 'staff' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Faculty & Staff ({teachers.length})
                </button>
              </div>

              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, roll, class, or contact..."
                  value={directorySearch}
                  onChange={e => setDirectorySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Directory Content */}
          {directoryTab === 'students' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Student & Roll</th>
                      <th className="py-3 px-4">Class & Section</th>
                      <th className="py-3 px-4">Guardian Name</th>
                      <th className="py-3 px-4">Emergency Contact</th>
                      <th className="py-3 px-4">Blood Group</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Pass History</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {students
                      .filter(s => {
                        const q = directorySearch.toLowerCase();
                        return s.name.toLowerCase().includes(q) ||
                          s.rollNo.toString().includes(q) ||
                          (s.parentName || s.guardianName || '—').toLowerCase().includes(q) ||
                          (s.parentPhone || s.guardianPhone || '—').includes(q) ||
                          `${s.standard}-${s.section}`.toLowerCase().includes(q);
                      })
                      .slice(0, 20)
                      .map(st => (
                        <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{st.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">Roll: #{st.rollNo}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
                              Standard {st.standard}-{st.section}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">{(st.parentName || st.guardianName || "")}</td>
                          <td className="py-3 px-4">
                            <div className="font-mono text-slate-800">{(st.parentPhone || st.guardianPhone || "")}</div>
                            <div className="text-[10px] text-slate-400">Primary Contact</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700">
                              {st.bloodGroup}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              Active
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setVisitorForm({
                                  ...visitorForm,
                                  name: (st.parentName || st.guardianName || ""),
                                  phone: (st.parentPhone || st.guardianPhone || ""),
                                  purpose: `Pickup / Interaction for ${st.name} (Std ${st.standard}-${st.section})`,
                                  meetingWith: 'Class Teacher',
                                  category: 'Parent / Guardian'
                                });
                                setShowCheckInModal(true);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg ml-auto"
                            >
                              Issue Pass
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {directoryTab === 'parents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students
                .filter(s => {
                  const q = directorySearch.toLowerCase();
                  return (s.parentName || s.guardianName || '—').toLowerCase().includes(q) ||
                    (s.parentPhone || s.guardianPhone || '—').includes(q) ||
                    s.name.toLowerCase().includes(q);
                })
                .slice(0, 15)
                .map(st => (
                  <div key={st.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{(st.parentName || st.guardianName || "")}</h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{(st.parentPhone || st.guardianPhone || "")}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                        Parent
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
                      <div className="text-slate-600">
                        Linked Ward: <strong className="text-slate-800">{st.name}</strong>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Standard {st.standard}-{st.section} · Roll #{st.rollNo}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setCallForm({
                            ...callForm,
                            callerName: (st.parentName || st.guardianName || ""),
                            callerPhone: (st.parentPhone || st.guardianPhone || ""),
                            relatedStudentName: st.name,
                            relatedStudentId: st.id,
                            type: 'outgoing'
                          });
                          setShowLogCallModal(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" /> Log Call
                      </button>
                      <button
                        onClick={() => {
                          setVisitorForm({
                            ...visitorForm,
                            name: (st.parentName || st.guardianName || ""),
                            phone: (st.parentPhone || st.guardianPhone || ""),
                            purpose: `Interaction for ${st.name}`,
                            category: 'Parent / Guardian'
                          });
                          setShowCheckInModal(true);
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                      >
                        Check In
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {directoryTab === 'staff' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers
                .filter(t => {
                  const q = directorySearch.toLowerCase();
                  return t.name.toLowerCase().includes(q) ||
                    t.department.toLowerCase().includes(q) ||
                    t.empId.toLowerCase().includes(q);
                })
                .map(tch => (
                  <div key={tch.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{tch.name}</h3>
                        <p className="text-xs text-slate-500">{tch.designation} · {tch.empId}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        On Campus
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600">
                      <div>Department: <strong className="text-slate-800">{tch.department}</strong></div>
                      <div>Contact: {tch.phone}</div>
                      <div className="text-[11px] text-slate-500 truncate">{tch.email}</div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setAppointmentForm({
                            ...appointmentForm,
                            staffId: tch.id,
                            staffName: tch.name,
                            department: tch.department
                          });
                          setShowScheduleAppointmentModal(true);
                        }}
                        className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg w-full text-center"
                      >
                        Book Visitor Meeting
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* DOCUMENT REQUESTS INTAKE REGISTER (`documents`) */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Certificate & Document Intake Register</h2>
                <p className="text-xs text-slate-500">
                  Front-office intake desk for Bonafide, Study, and Transfer Certificate requests.
                </p>
              </div>
              <button
                onClick={() => setShowCreateDocModal(true)}
                className={`px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
              >
                <Plus className="w-4 h-4" />
                Submit Document Request
              </button>
            </div>

            {/* Statutory Disclaimer */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                <strong>Operational Boundary:</strong> Reception handles submission and hand-off. Official certificate stamping and signoff requires Principal / Administrative authorization.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student, requester, request #..."
                  value={docSearch}
                  onChange={e => setDocSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>

              <select
                value={docTypeFilter}
                onChange={e => setDocTypeFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
              >
                <option value="all">All Document Types</option>
                <option value="Bonafide Certificate">Bonafide Certificate</option>
                <option value="Transfer Certificate Enquiry">Transfer Certificate Enquiry</option>
                <option value="Study Certificate">Study Certificate</option>
                <option value="Fee Receipt Copy">Fee Receipt Copy</option>
                <option value="Character Certificate">Character Certificate</option>
              </select>
            </div>
          </div>

          {/* Document Requests Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentRequests
              .filter(d => {
                const q = docSearch.toLowerCase();
                const matchQ = d.studentName.toLowerCase().includes(q) ||
                  d.requesterName.toLowerCase().includes(q) ||
                  d.requestNo.toLowerCase().includes(q);
                const matchType = docTypeFilter === 'all' || d.documentType === docTypeFilter;
                return matchQ && matchType;
              })
              .map(doc => (
                <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{doc.documentType}</span>
                          <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {doc.requestNo}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Student: <strong className="text-slate-800">{doc.studentName}</strong> (Std {doc.standard}-{doc.section})
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        doc.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        doc.status === 'Ready for Collection' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        doc.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {doc.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Requester:</span>
                        <span className="font-medium text-slate-800">{doc.requesterName} ({doc.requesterPhone})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Assigned Dept:</span>
                        <span>{doc.assignedDepartment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Submitted On:</span>
                        <span>{doc.requestDate}</span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-200 text-slate-800">
                        <span className="font-semibold text-slate-900">Purpose:</span> {doc.purposeRemarks}
                      </div>
                    </div>

                    {doc.resolutionNotes && (
                      <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                        <strong>Resolution:</strong> {doc.resolutionNotes}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        const notes = prompt('Update resolution remarks:', doc.resolutionNotes || '');
                        if (notes !== null) {
                          updateDocumentRequestStatus(doc.id, doc.status, notes);
                        }
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      Add Note
                    </button>

                    <select
                      value={doc.status}
                      onChange={e => updateDocumentRequestStatus(doc.id, e.target.value as any)}
                      className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Referred to Department">Referred to Dept</option>
                      <option value="Ready for Collection">Ready for Collection</option>
                      <option value="Completed">Completed & Handed Over</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* DAILY REGISTER AND RECEPTION REPORTS (`reports`) */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Daily Reception Activity Register</h2>
              <p className="text-xs text-slate-500">
                Official audit-ready front-desk log for date: <strong className="text-slate-800">{todayStr}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                Print Register Sheet
              </button>
              <button
                onClick={handleExportVisitorsCSV}
                className={`px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            </div>
          </div>

          {/* Daily Aggregate Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Visitors Today</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalVisitorsToday.length}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">{activeVisitorsInside.length} currently inside</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">Enquiries Recorded</span>
              <div className="text-2xl font-extrabold text-blue-700 mt-1">{enquiries.filter(e => e.date === todayStr).length}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">{enquiries.length} total active</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">Appointments Held</span>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">{appointmentsToday.length}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">{appointmentsToday.filter(a => a.status === 'completed').length} completed</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">Front-Desk Calls</span>
              <div className="text-2xl font-extrabold text-purple-700 mt-1">{callsToday.length}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">{callLogs.length} total in log</p>
            </div>
          </div>

          {/* Printable Daily Sheet View */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">GREENFIELD PUBLIC SCHOOL · DAILY VISITOR LOG</h3>
                <p className="text-xs text-slate-500">Security Gate #1 Registry · Date: {todayStr} · Term 1</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-700">REG-2026-10-14</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-2.5 px-3">Pass No</th>
                    <th className="py-2.5 px-3">Visitor Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Person Visited</th>
                    <th className="py-2.5 px-3">In Time</th>
                    <th className="py-2.5 px-3">Out Time</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">ID Proof Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {totalVisitorsToday.map(v => (
                    <tr key={v.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{v.passNo}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{v.name}</td>
                      <td className="py-2.5 px-3">{v.category || 'Visitor'}</td>
                      <td className="py-2.5 px-3">{v.meetingWith}</td>
                      <td className="py-2.5 px-3">{v.checkIn}</td>
                      <td className="py-2.5 px-3">{v.checkOut || '–'}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          v.status === 'inside' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {v.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-500">{v.idProof}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div>
                Certified true front-desk record by: <strong className="text-slate-800">Ms. Clara Martinez</strong> (Reception Officer)
              </div>
              <div className="text-right">
                Authorized Front-Office Station Seal · Greenfield Campus
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FRONT OFFICE PROFILE (`profile`) */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                CM
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Ms. Clara Martinez</h2>
                <p className="text-xs text-slate-500 font-medium">Front Office Coordinator & Reception Executive</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Clearance Level 2 · Front Desk & Registry
                  </span>
                  <span className="text-xs text-slate-500">Emp ID: REC-2021-019</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">Station Information</h3>
                <div className="flex justify-between">
                  <span className="text-slate-500">Terminal:</span>
                  <strong className="text-slate-800">Main Administration Gate 1 (Terminal #02)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shift Timings:</span>
                  <span>07:45 AM – 04:30 PM (Mon – Sat)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Official Desk Extension:</span>
                  <span className="font-mono">Ext. 102</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span>reception@greenfield.edu</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">Campus Emergency Hotlines</h3>
                <div className="flex justify-between">
                  <span className="text-slate-500">Main Gate Security Post:</span>
                  <strong className="text-slate-800">Ext. 100</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Infirmary & Campus Ambulance:</span>
                  <strong className="text-slate-800">Ext. 112</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Principal Secretariat:</span>
                  <span>Ext. 101</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Police / Fire / City Emergency:</span>
                  <span className="font-bold text-rose-700">112 / 101</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER VISITOR */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${themeClasses.lightBg} ${themeClasses.textColor}`}>
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Register & Check In Visitor</h3>
                  <p className="text-xs text-slate-500">Issue official digital visitor gate badge</p>
                </div>
              </div>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterVisitorSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Visitor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Rajesh Mehra"
                    value={visitorForm.name}
                    onChange={e => setVisitorForm({ ...visitorForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Contact Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={visitorForm.phone}
                    onChange={e => setVisitorForm({ ...visitorForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Visitor Category</label>
                  <select
                    value={visitorForm.category}
                    onChange={e => setVisitorForm({ ...visitorForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Parent / Guardian">Parent / Guardian</option>
                    <option value="Prospective Parent">Prospective Parent</option>
                    <option value="Vendor / Supplier">Vendor / Supplier</option>
                    <option value="Guest / Speaker">Guest / Speaker</option>
                    <option value="Service Provider">Service Provider</option>
                    <option value="Delivery Personnel">Delivery Personnel</option>
                    <option value="Former Student">Former Student</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Organization (Optional)</label>
                  <input
                    type="text"
                    placeholder="Company or school name"
                    value={visitorForm.organization}
                    onChange={e => setVisitorForm({ ...visitorForm, organization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Purpose of Visit *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Admission inquiry & campus lab tour"
                  value={visitorForm.purpose}
                  onChange={e => setVisitorForm({ ...visitorForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Person / Host to Visit</label>
                  <select
                    value={visitorForm.meetingWith}
                    onChange={e => setVisitorForm({ ...visitorForm, meetingWith: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.name}>{t.name} ({t.designation})</option>
                    ))}
                    <option value="Principal Dr. Evelyn Montgomery">Principal Dr. Evelyn Montgomery</option>
                    <option value="Vice Principal Mr. Robert Sterling">Vice Principal Mr. Robert Sterling</option>
                    <option value="Front Office / Admissions">Front Office / Admissions Desk</option>
                    <option value="Accounts / Bursar Office">Accounts / Bursar Office</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Department</label>
                  <input
                    type="text"
                    value={visitorForm.department}
                    onChange={e => setVisitorForm({ ...visitorForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Group Size</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={visitorForm.visitorsCount}
                    onChange={e => setVisitorForm({ ...visitorForm, visitorsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Vehicle No (If any)</label>
                  <input
                    type="text"
                    placeholder="e.g. DL-04-AB-1234"
                    value={visitorForm.vehicleNo}
                    onChange={e => setVisitorForm({ ...visitorForm, vehicleNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ID Proof Type</label>
                  <select
                    value={visitorForm.idProof}
                    onChange={e => setVisitorForm({ ...visitorForm, idProof: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Driver License">Driver License</option>
                    <option value="Passport">Passport</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Parent ID Badge">Parent ID Badge</option>
                    <option value="Company / Official ID">Company ID</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Notes / Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Security notes or special instructions..."
                  value={visitorForm.notes}
                  onChange={e => setVisitorForm({ ...visitorForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
                >
                  Confirm Check-In & Issue Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHECK OUT CONFIRMATION */}
      {showCheckOutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 text-rose-700 rounded-xl">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Check Out Visitor</h3>
                <p className="text-xs text-slate-500">Close active visit #{showCheckOutModal.passNo}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-700">
              <div>Visitor: <strong className="text-slate-900">{showCheckOutModal.name}</strong></div>
              <div>Host Visited: {showCheckOutModal.meetingWith}</div>
              <div>Checked In: {showCheckOutModal.checkIn} ({showCheckOutModal.date})</div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Closing Remark / Gate Check Note (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Visitor badge returned safely at Gate 1."
                value={checkOutNotes}
                onChange={e => setCheckOutNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCheckOutModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCheckOut}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Confirm Gate Check-Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DIGITAL VISITOR PASS / PRINTABLE BADGE */}
      {activeVisitorPass && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
            {/* Top Pass Header */}
            <div className="bg-slate-900 text-white p-5 text-center relative">
              <button
                onClick={() => setActiveVisitorPass(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-[10px] tracking-widest uppercase font-bold text-amber-400">Greenfield Public School</div>
              <h2 className="text-base font-extrabold tracking-tight mt-0.5">VISITOR PASS</h2>
              <div className="inline-block mt-2 px-3 py-1 bg-amber-400/20 text-amber-300 font-mono text-xs font-bold rounded-full border border-amber-400/40">
                {activeVisitorPass.passNo}
              </div>
            </div>

            {/* Badge Body */}
            <div className="p-6 space-y-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 text-slate-800 font-extrabold text-xl flex items-center justify-center border-2 border-slate-300 shadow-inner">
                {activeVisitorPass.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-slate-900">{activeVisitorPass.name}</h3>
                <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {activeVisitorPass.category || 'Visitor'}
                </span>
                {activeVisitorPass.organization && (
                  <p className="text-xs text-slate-500 mt-1">{activeVisitorPass.organization}</p>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Meeting:</span>
                  <strong className="text-slate-900">{activeVisitorPass.meetingWith}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Purpose:</span>
                  <span className="text-slate-700 text-right truncate max-w-[170px]">{activeVisitorPass.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & In:</span>
                  <span>{activeVisitorPass.date} · {activeVisitorPass.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ID Verified:</span>
                  <span className="font-semibold text-emerald-700">{activeVisitorPass.idProof}</span>
                </div>
              </div>

              {/* Barcode Mock Visual */}
              <div className="py-1">
                <div className="h-8 bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_5px,#000_5px,#000_9px,#fff_9px,#fff_12px)] opacity-70 rounded"></div>
                <div className="text-[9px] font-mono text-slate-400 mt-1 tracking-widest">{activeVisitorPass.passNo}</div>
              </div>

              <p className="text-[10px] text-slate-400 leading-tight">
                Please wear this badge visibly while inside the school premises. Hand over at Main Gate 1 upon exit.
              </p>
            </div>

            {/* Print & Action Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" /> Print Badge
              </button>
              <button
                onClick={() => setActiveVisitorPass(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW ADMISSION ENQUIRY */}
      {showAddEnquiryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${themeClasses.lightBg} ${themeClasses.textColor}`}>
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Record Admission Enquiry</h3>
                  <p className="text-xs text-slate-500">Capture prospective student and family interest</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddEnquiryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEnquirySubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Candidate Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Candidate full name"
                    value={enquiryForm.candidateName}
                    onChange={e => setEnquiryForm({ ...enquiryForm, candidateName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Standard / Grade Applying *</label>
                  <select
                    value={enquiryForm.standardApplying}
                    onChange={e => setEnquiryForm({ ...enquiryForm, standardApplying: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                      <option key={g} value={g}>Standard {g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Father / Mother / Guardian"
                    value={enquiryForm.parentName}
                    onChange={e => setEnquiryForm({ ...enquiryForm, parentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Contact Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={enquiryForm.phone}
                    onChange={e => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Enquiry Source</label>
                  <select
                    value={enquiryForm.source}
                    onChange={e => setEnquiryForm({ ...enquiryForm, source: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Walk-in">Walk-in</option>
                    <option value="Phone">Phone</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="School Event">School Event</option>
                    <option value="Email">Email</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Academic Year</label>
                  <input
                    type="text"
                    value={enquiryForm.academicYear}
                    onChange={e => setEnquiryForm({ ...enquiryForm, academicYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Initial Follow-up Date</label>
                  <input
                    type="date"
                    value={enquiryForm.followUpDate}
                    onChange={e => setEnquiryForm({ ...enquiryForm, followUpDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="parent@example.com"
                  value={enquiryForm.email}
                  onChange={e => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Enquiry Notes & Details</label>
                <textarea
                  rows={2}
                  placeholder="Previous school, relocation reasons, special curriculum preferences..."
                  value={enquiryForm.notes}
                  onChange={e => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEnquiryModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
                >
                  Save Enquiry Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD FOLLOW-UP NOTE */}
      {showFollowUpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <CheckSquare className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-bold text-base text-slate-900">Log Follow-up Note</h3>
                <p className="text-xs text-slate-500">
                  {showFollowUpModal.candidateName} (#{showFollowUpModal.enquiryNo})
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Interaction Summary / Outcome *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Spoke with parent on phone. Confirmed campus visit date and answered fee questions..."
                  value={followUpNoteText}
                  onChange={e => setFollowUpNoteText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Next Follow-up Date (Optional)</label>
                <input
                  type="date"
                  value={followUpDateInput}
                  onChange={e => setFollowUpDateInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowFollowUpModal(null);
                  setFollowUpNoteText('');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!followUpNoteText.trim()) {
                    showToast('Please enter an interaction note.', 'error');
                    return;
                  }
                  addEnquiryFollowUp(showFollowUpModal.id, followUpNoteText, followUpDateInput || undefined);
                  setShowFollowUpModal(null);
                  setFollowUpNoteText('');
                }}
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
              >
                Save Follow-up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE APPOINTMENT */}
      {showScheduleAppointmentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-base text-slate-900">Schedule School Visit / Meeting</h3>
                  <p className="text-xs text-slate-500">Book slot with faculty or administration</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowScheduleAppointmentModal(false);
                  setAppointmentConflictWarning(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {appointmentConflictWarning && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Faculty Slot Conflict Detected!
                </div>
                <p>
                  {appointmentConflictWarning.staffName} already has appointment #{appointmentConflictWarning.appointmentNo} with {appointmentConflictWarning.visitorName} scheduled on {appointmentConflictWarning.date} at {appointmentConflictWarning.startTime}.
                </p>
                <p className="font-medium text-slate-700">Please choose an alternate time or day.</p>
              </div>
            )}

            <form onSubmit={handleScheduleAppointmentSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Visitor / Parent Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={appointmentForm.visitorName}
                    onChange={e => setAppointmentForm({ ...appointmentForm, visitorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Contact Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={appointmentForm.visitorPhone}
                    onChange={e => setAppointmentForm({ ...appointmentForm, visitorPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Staff Member to Visit *</label>
                  <select
                    value={appointmentForm.staffId}
                    onChange={e => {
                      const sel = teachers.find(t => t.id === e.target.value);
                      setAppointmentForm({
                        ...appointmentForm,
                        staffId: e.target.value,
                        staffName: sel ? sel.name : 'Mrs. Shalini Verma',
                        department: sel ? sel.department : 'Senior Academic Faculty'
                      });
                      setAppointmentConflictWarning(null);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                    ))}
                    <option value="admin-01">Principal Dr. Evelyn Montgomery</option>
                    <option value="vp-01">Vice Principal Mr. Robert Sterling</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Visitor Category</label>
                  <select
                    value={appointmentForm.visitorCategory}
                    onChange={e => setAppointmentForm({ ...appointmentForm, visitorCategory: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Parent / Guardian">Parent / Guardian</option>
                    <option value="Prospective Parent">Prospective Parent</option>
                    <option value="Guest / Speaker">Guest / Speaker</option>
                    <option value="Vendor / Supplier">Vendor / Supplier</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Meeting Date *</label>
                  <input
                    type="date"
                    required
                    value={appointmentForm.date}
                    onChange={e => {
                      setAppointmentForm({ ...appointmentForm, date: e.target.value });
                      setAppointmentConflictWarning(null);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Start Time *</label>
                  <select
                    value={appointmentForm.startTime}
                    onChange={e => {
                      setAppointmentForm({ ...appointmentForm, startTime: e.target.value });
                      setAppointmentConflictWarning(null);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="08:30 AM">08:30 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">End Time</label>
                  <select
                    value={appointmentForm.endTime}
                    onChange={e => setAppointmentForm({ ...appointmentForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="02:45 PM">02:45 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Purpose of Appointment *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Discuss term 1 mathematics results and homework mentorship"
                  value={appointmentForm.purpose}
                  onChange={e => setAppointmentForm({ ...appointmentForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleAppointmentModal(false);
                    setAppointmentConflictWarning(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
                >
                  Confirm & Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESCHEDULE APPOINTMENT */}
      {reschedulingAppointment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-base text-slate-900">Reschedule Appointment</h3>
                <p className="text-xs text-slate-500">#{reschedulingAppointment.appointmentNo} · {reschedulingAppointment.visitorName}</p>
              </div>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">New Date *</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">New Start Time *</label>
                  <select
                    value={rescheduleStartTime}
                    onChange={e => setRescheduleStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">New End Time</label>
                  <select
                    value={rescheduleEndTime}
                    onChange={e => setRescheduleEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:45 PM">02:45 PM</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReschedulingAppointment(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
                >
                  Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG PHONE CALL */}
      {showLogCallModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PhoneIncoming className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-bold text-base text-slate-900">Log Phone Call</h3>
                  <p className="text-xs text-slate-500">Front-office telephone inquiry or dispatch record</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogCallModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogCallSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Call Type *</label>
                  <select
                    value={callForm.type}
                    onChange={e => setCallForm({ ...callForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="incoming">Incoming Call</option>
                    <option value="outgoing">Outgoing Call</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Caller Category</label>
                  <select
                    value={callForm.callerCategory}
                    onChange={e => setCallForm({ ...callForm, callerCategory: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Prospective Parent">Prospective Parent</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Education Board">Education Board</option>
                    <option value="General">General</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Caller / Recipient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={callForm.callerName}
                    onChange={e => setCallForm({ ...callForm, callerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={callForm.callerPhone}
                    onChange={e => setCallForm({ ...callForm, callerPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Purpose of Call *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bus delay query, Olympiad syllabus, standard 6 admission tour"
                  value={callForm.purpose}
                  onChange={e => setCallForm({ ...callForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detailed Summary *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Information discussed, answers provided, or instructions given..."
                  value={callForm.summary}
                  onChange={e => setCallForm({ ...callForm, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={callForm.followUpRequired}
                    onChange={e => setCallForm({ ...callForm, followUpRequired: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Follow-up action required for this call</span>
                </label>
                {callForm.followUpRequired && (
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <label className="font-bold text-slate-600">Follow-up Due Date</label>
                    <input
                      type="date"
                      value={callForm.followUpDate}
                      onChange={e => setCallForm({ ...callForm, followUpDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogCallModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
                >
                  Save Call Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE RECEPTION REQUEST */}
      {showCreateRequestModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="font-bold text-base text-slate-900">New Front Desk Request Ticket</h3>
                  <p className="text-xs text-slate-500">Route inquiries or issues to appropriate department</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateRequestModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequestSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category *</label>
                  <select
                    value={requestForm.category}
                    onChange={e => setRequestForm({ ...requestForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Teacher Meeting">Teacher Meeting</option>
                    <option value="Department Contact">Department Contact</option>
                    <option value="Document Enquiry">Document Enquiry</option>
                    <option value="Parent Complaint">Parent Complaint</option>
                    <option value="Lost & Found">Lost & Found</option>
                    <option value="Campus Maintenance">Campus Maintenance</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Priority Level</label>
                  <select
                    value={requestForm.priority}
                    onChange={e => setRequestForm({ ...requestForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Requester Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={requestForm.requesterName}
                    onChange={e => setRequestForm({ ...requestForm, requesterName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Contact Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98XXX XXXXX"
                    value={requestForm.requesterPhone}
                    onChange={e => setRequestForm({ ...requestForm, requesterPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Brief Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lost Parker fountain pen in corridor"
                  value={requestForm.summary}
                  onChange={e => setRequestForm({ ...requestForm, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detailed Description</label>
                <textarea
                  rows={2}
                  placeholder="Additional context or notes..."
                  value={requestForm.description}
                  onChange={e => setRequestForm({ ...requestForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Assign to Department</label>
                  <select
                    value={requestForm.assignedDepartment}
                    onChange={e => setRequestForm({ ...requestForm, assignedDepartment: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Transport">Transport</option>
                    <option value="Administration">Administration</option>
                    <option value="Examination">Examination</option>
                    <option value="Front Office">Front Office</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Student Reference (If any)</label>
                  <input
                    type="text"
                    placeholder="e.g. Std 8-A · Aarav Sharma"
                    value={requestForm.studentReference}
                    onChange={e => setRequestForm({ ...requestForm, studentReference: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRequestModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
                >
                  Create Request Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT DOCUMENT REQUEST */}
      {showCreateDocModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-base text-slate-900">Certificate / Document Intake</h3>
                  <p className="text-xs text-slate-500">Record parent certificate or receipt request</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateDocModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Select Student *</label>
                <select
                  value={docForm.studentId}
                  onChange={e => {
                    const sel = students.find(s => s.id === e.target.value);
                    if (sel) {
                      setDocForm({
                        ...docForm,
                        studentId: sel.id,
                        studentName: sel.name,
                        standard: sel.standard,
                        section: sel.section,
                        requesterName: (sel.parentName || sel.guardianName || ""),
                        requesterPhone: (sel.parentPhone || sel.guardianPhone || "")
                      });
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Std {s.standard}-{s.section} · Roll #{s.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Document Type *</label>
                  <select
                    value={docForm.documentType}
                    onChange={e => setDocForm({ ...docForm, documentType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Bonafide Certificate">Bonafide Certificate</option>
                    <option value="Study Certificate">Study Certificate</option>
                    <option value="Fee Receipt Copy">Fee Receipt Copy</option>
                    <option value="Transfer Certificate Enquiry">Transfer Certificate Enquiry</option>
                    <option value="Character Certificate">Character Certificate</option>
                    <option value="General Request">General Request</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Target Department</label>
                  <select
                    value={docForm.assignedDepartment}
                    onChange={e => setDocForm({ ...docForm, assignedDepartment: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Administration Office">Administration Office</option>
                    <option value="Accounts Dept">Accounts Dept</option>
                    <option value="Senior Academic Faculty">Senior Academic Faculty</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Requester Name *</label>
                  <input
                    type="text"
                    required
                    value={docForm.requesterName}
                    onChange={e => setDocForm({ ...docForm, requesterName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Requester Phone</label>
                  <input
                    type="tel"
                    value={docForm.requesterPhone}
                    onChange={e => setDocForm({ ...docForm, requesterPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Purpose / Application Details *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Passport renewal, defense child allowance, visa application..."
                  value={docForm.purposeRemarks}
                  onChange={e => setDocForm({ ...docForm, purposeRemarks: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateDocModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs ${'bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg shadow-xs transition-colors'}`}
                >
                  Submit Document Intake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
