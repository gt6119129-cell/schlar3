import React, { useState, useMemo, useEffect } from 'react';
import {
  Home,
  Calendar,
  Award,
  CreditCard,
  Grid,
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  User,
  Users,
  LogOut,
  Bell,
  Receipt,
  Plus,
  X,
  FileText,
  Check,
  CheckCircle,
  CheckCheck,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  Send,
  Download,
  Phone,
  Mail,
  MapPin,
  Bus,
  Library,
  MessageSquare,
  Settings,
  DollarSign,
  Search,
  Printer,
  Shield,
  Info,
  Palette,
  CheckSquare,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { getThemeClasses } from '../../utils/themeHelper';
import {
  Student,
  AttendanceDiscrepancyRequest,
  StudentInfoChangeRequest,
  FeeInvoice,
  Assignment,
  Notice,
  SchoolEvent,
  DirectMessage
} from '../../types/school';
import { SCHLAR_PALETTES, getPaletteById } from '../../theme/palettes';
import {
  applyThemeToDom,
  getStoredActivePaletteId,
  saveStoredActivePaletteId,
  saveStoredActiveColors
} from '../../theme/themeEngine';

export type ParentMobileTab =
  | 'home'
  | 'attendance'
  | 'academics'
  | 'fees'
  | 'more'
  | 'more_timetable'
  | 'more_assignments'
  | 'more_results'
  | 'more_notices'
  | 'more_leave'
  | 'more_events'
  | 'more_transport'
  | 'more_library'
  | 'more_messages'
  | 'more_documents'
  | 'more_settings'
  | 'more_help';

export const ParentMobileView: React.FC = () => {
  const {
    themeColor,
    students,
    attendance,
    marks,
    assignments,
    timetables,
    fees,
    feeConcessions,
    recordFeePayment,
    notices,
    events,
    messages,
    studentMovements,
    attendanceDiscrepancies,
    studentInfoRequests,
    sendMessage,
    submitAttendanceDiscrepancy,
    submitStudentInfoRequest,
    signOut,
    switchRole,
    showToast,
    activeChildId,
    setActiveChildId,
    transportAssignments,
    transportRoutes,
    transportVehicles,
    transportDrivers,
    bookIssues,
    books
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Active Child Switcher: 'stu-101' (Aarav Sharma - Std 8-A) vs 'stu-102' (Ananya Sharma - Std 5-B)
  const [selectedChildId, setSelectedChildIdState] = useState<string>(activeChildId || 'stu-101');
  const [mobileTab, setMobileTab] = useState<ParentMobileTab>('home');

  // Academic Sub-Tab
  const [academicSubTab, setAcademicSubTab] = useState<'assignments' | 'syllabus' | 'resources'>('assignments');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Timetable Day Selector
  const [timetableDay, setTimetableDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Wednesday');

  // Attendance Month Filter
  const [attendanceMonth, setAttendanceMonth] = useState<'2026-10' | '2026-09' | '2026-08'>('2026-10');

  // Theme Studio State
  const [currentPaletteId, setCurrentPaletteId] = useState<string>(getStoredActivePaletteId);

  // Active Child identification & safety
  const siblingChildren = useMemo(() => {
    const list = students.filter(s => s.parentName === 'Dr. Rajesh Sharma');
    if (list.length > 0) return list;
    // Fallback if demo data modified
    return students.filter(s => s.id === 'stu-101' || s.id === 'stu-102');
  }, [students]);

  const activeChild = useMemo(() => {
    return siblingChildren.find(s => s.id === selectedChildId) || siblingChildren[0] || students[0];
  }, [siblingChildren, selectedChildId, students]);

  const handleSelectChild = (id: string) => {
    setSelectedChildIdState(id);
    if (setActiveChildId) {
      setActiveChildId(id);
    }
  };

  // Scoped Data strictly for the selected child
  const childMarks = useMemo(() => {
    return marks.filter(m => m.studentId === activeChild.id && m.status === 'published');
  }, [marks, activeChild.id]);

  const childAttendance = useMemo(() => {
    return attendance.filter(a => a.studentId === activeChild.id);
  }, [attendance, activeChild.id]);

  const filteredAttendance = useMemo(() => {
    return childAttendance.filter(a => a.date.startsWith(attendanceMonth));
  }, [childAttendance, attendanceMonth]);

  const attendanceStats = useMemo(() => {
    const total = filteredAttendance.length;
    const present = filteredAttendance.filter(a => a.status === 'present').length;
    const absent = filteredAttendance.filter(a => a.status === 'absent').length;
    const late = filteredAttendance.filter(a => a.status === 'late').length;
    const halfDay = filteredAttendance.filter(a => a.status === 'half_day').length;
    const rate = total > 0 ? Math.round(((present + halfDay * 0.5) / total) * 100) : activeChild.attendanceRate;
    return { total, present, absent, late, halfDay, rate };
  }, [filteredAttendance, activeChild.attendanceRate]);

  const childFees = useMemo(() => {
    return fees.filter(f => f.studentId === activeChild.id);
  }, [fees, activeChild.id]);

  const childConcessions = useMemo(() => {
    return feeConcessions.filter(c => c.studentId === activeChild.id && c.status === 'active');
  }, [feeConcessions, activeChild.id]);

  const feeSummary = useMemo(() => {
    const totalAssigned = childFees.reduce((acc, f) => acc + f.amount, 0);
    const totalPaid = childFees.reduce((acc, f) => acc + (f.paidAmount || (f.status === 'paid' ? f.amount : 0)), 0);
    const totalOutstanding = childFees.reduce((acc, f) => acc + (f.status === 'paid' ? 0 : (f.remainingBalance ?? f.amount)), 0);
    return { totalAssigned, totalPaid, totalOutstanding };
  }, [childFees]);

  const childAssignments = useMemo(() => {
    return assignments.filter(a => a.standard === activeChild.standard && a.status === 'published');
  }, [assignments, activeChild.standard]);

  const childTimetable = useMemo(() => {
    return timetables.filter(t => t.standard === activeChild.standard && t.section === activeChild.section);
  }, [timetables, activeChild.standard, activeChild.section]);

  // Shared Transport Integration for selected child
  const childTransportAssignment = useMemo(() => {
    return transportAssignments.find(a => a.studentId === activeChild.id && a.status === 'active');
  }, [transportAssignments, activeChild.id]);

  const childRoute = useMemo(() => {
    if (!childTransportAssignment) return null;
    return transportRoutes.find(r => r.id === childTransportAssignment.routeId || r.routeCode === childTransportAssignment.routeCode) || null;
  }, [childTransportAssignment, transportRoutes]);

  const childVehicle = useMemo(() => {
    if (!childRoute) return null;
    return transportVehicles.find(v => v.id === childRoute.assignedVehicleId || v.vehicleNo === childRoute.assignedVehicleNo) || null;
  }, [childRoute, transportVehicles]);

  const childDriver = useMemo(() => {
    if (!childRoute) return null;
    return transportDrivers.find(d => d.name === childRoute.driverName || d.phone === childRoute.driverPhone) || null;
  }, [childRoute, transportDrivers]);

  // Shared Library Borrowings Integration for selected child
  const childBookIssues = useMemo(() => {
    return bookIssues.filter(b => b.memberId === activeChild.id && (b.status === 'borrowed' || b.status === 'overdue'));
  }, [bookIssues, activeChild.id]);

  const totalLibraryFines = useMemo(() => {
    return bookIssues.filter(b => b.memberId === activeChild.id).reduce((acc, b) => acc + (b.fineAmount || 0), 0);
  }, [bookIssues, activeChild.id]);

  const timetableForSelectedDay = useMemo(() => {
    return childTimetable
      .filter(t => t.day === timetableDay)
      .sort((a, b) => a.period - b.period);
  }, [childTimetable, timetableDay]);

  const childDiscrepancies = useMemo(() => {
    return attendanceDiscrepancies.filter(d => d.studentId === activeChild.id);
  }, [attendanceDiscrepancies, activeChild.id]);

  const childMovements = useMemo(() => {
    return studentMovements.filter(m => m.studentId === activeChild.id);
  }, [studentMovements, activeChild.id]);

  const childInfoRequests = useMemo(() => {
    return studentInfoRequests.filter(r => r.studentId === activeChild.id);
  }, [studentInfoRequests, activeChild.id]);

  // Messages input
  const [chatInput, setChatInput] = useState('');

  // Payment state
  const [payingInvoice, setPayingInvoice] = useState<FeeInvoice | null>(null);
  const [payingMethod, setPayingMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [payingAmount, setPayingAmount] = useState<number>(0);
  const [paySuccessToast, setPaySuccessToast] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<any | null>(null);

  // Student Leave Application Modal
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);
  const [leaveStartDate, setLeaveStartDate] = useState('2026-10-20');
  const [leaveEndDate, setLeaveEndDate] = useState('2026-10-21');
  const [leaveCategory, setLeaveCategory] = useState<'Medical / Illness' | 'Family Function' | 'Urgent Travel' | 'Other'>('Medical / Illness');
  const [leaveReasonText, setLeaveReasonText] = useState('');
  const [leaveSubmittedToast, setLeaveSubmittedToast] = useState(false);
  const [appliedLeavesList, setAppliedLeavesList] = useState<Array<{
    id: string;
    category: string;
    from: string;
    to: string;
    reason: string;
    status: 'Approved' | 'Pending Verification';
  }>>([
    {
      id: 'lvr-p01',
      category: 'Medical / Viral Illness',
      from: '2026-09-14',
      to: '2026-09-15',
      reason: 'Seasonal viral influenza. Doctor advised home rest.',
      status: 'Approved'
    }
  ]);

  // Attendance Discrepancy Modal
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);
  const [discDate, setDiscDate] = useState('2026-10-14');
  const [discReportedStatus, setDiscReportedStatus] = useState<'absent' | 'late'>('absent');
  const [discReason, setDiscReason] = useState('');
  const [discSubmittedToast, setDiscSubmittedToast] = useState(false);

  // Student Info Correction Request Modal
  const [showInfoRequestModal, setShowInfoRequestModal] = useState(false);
  const [reqType, setReqType] = useState<StudentInfoChangeRequest['requestType']>('Emergency Contact');
  const [reqChanges, setReqChanges] = useState('');
  const [reqReason, setReqReason] = useState('');
  const [infoReqSubmittedToast, setInfoReqSubmittedToast] = useState(false);

  // School Events Calendar View Mode
  const [eventsViewMode, setEventsViewMode] = useState<'agenda' | 'holidays'>('agenda');

  // Notifications Drawer
  const [showNotifications, setShowNotifications] = useState(false);

  // Settings Notification toggles
  const [notifSmsAttendance, setNotifSmsAttendance] = useState(true);
  const [notifPushHomework, setNotifPushHomework] = useState(true);
  const [notifEmailFees, setNotifEmailFees] = useState(true);
  const [notifChatAlerts, setNotifChatAlerts] = useState(true);

  const handleOpenPayModal = (inv: FeeInvoice) => {
    setPayingInvoice(inv);
    setPayingAmount(inv.remainingBalance ?? (inv.status === 'paid' ? 0 : inv.amount));
    setPayingMethod('UPI');
  };

  const handleConfirmMobilePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice || isSubmittingPayment) return;

    if (payingAmount <= 0) {
      showToast('Payment amount must be greater than zero.', 'error');
      return;
    }

    const currentDue = payingInvoice.remainingBalance ?? payingInvoice.amount;
    if (payingAmount > currentDue) {
      showToast(`Amount cannot exceed remaining balance of ₹${currentDue.toLocaleString()}.`, 'error');
      return;
    }

    setIsSubmittingPayment(true);
    try {
      const res = recordFeePayment(
        payingInvoice.id,
        payingAmount,
        payingMethod,
        payingMethod === 'UPI' ? `UPI-MOB-${Date.now().toString().slice(-6)}` : `TXN-${Date.now().toString().slice(-6)}`,
        undefined,
        `Online payment completed via Parent Mobile App (${payingMethod})`,
        'Parent Mobile App'
      );
      const updated = fees.find(f => f.id === payingInvoice.id);
      setPayingInvoice(null);
      setPaySuccessToast(true);
      setTimeout(() => setPaySuccessToast(false), 3500);
      if (updated) {
        setViewingReceipt({
          ...updated,
          receiptNo: res.receiptNo,
          paidDate: new Date().toISOString().split('T')[0],
          paymentMethod: payingMethod,
          paidAmount: payingAmount
        });
      }
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const teacherName = activeChild.standard === 8 ? 'Mrs. Shalini Verma' : 'Mrs. Priya Nair';
    sendMessage(chatInput.trim(), 'tch-01', `${teacherName} (Class Teacher)`);
    setChatInput('');
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingLeave) return;
    if (!leaveReasonText.trim()) {
      showToast('Please specify the reason for absence.', 'error');
      return;
    }
    if (leaveEndDate < leaveStartDate) {
      showToast('End date cannot be prior to start date.', 'error');
      return;
    }

    setIsSubmittingLeave(true);
    try {
      setAppliedLeavesList(prev => [
        {
          id: `lvr-${Date.now().toString().slice(-5)}`,
          category: leaveCategory,
          from: leaveStartDate,
          to: leaveEndDate,
          reason: leaveReasonText.trim(),
          status: 'Pending Verification'
        },
        ...prev
      ]);
      setShowLeaveModal(false);
      setLeaveReasonText('');
      setLeaveSubmittedToast(true);
      setTimeout(() => setLeaveSubmittedToast(false), 3500);
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  const handleSubmitDiscrepancy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discReason.trim()) return;
    submitAttendanceDiscrepancy({
      studentId: activeChild.id,
      studentName: activeChild.name,
      date: discDate,
      reportedStatus: discReportedStatus,
      parentClaim: 'present',
      reason: discReason.trim()
    });
    setShowDiscrepancyModal(false);
    setDiscReason('');
    setDiscSubmittedToast(true);
    setTimeout(() => setDiscSubmittedToast(false), 3500);
  };

  const handleSubmitInfoRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqChanges.trim() || !reqReason.trim()) return;
    submitStudentInfoRequest({
      studentId: activeChild.id,
      studentName: activeChild.name,
      requestType: reqType,
      requestedChanges: reqChanges.trim(),
      reason: reqReason.trim()
    });
    setShowInfoRequestModal(false);
    setReqChanges('');
    setReqReason('');
    setInfoReqSubmittedToast(true);
    setTimeout(() => setInfoReqSubmittedToast(false), 3500);
  };

  const handleSelectPalette = (paletteId: string) => {
    const palette = getPaletteById(paletteId);
    setCurrentPaletteId(paletteId);
    saveStoredActivePaletteId(paletteId);
    saveStoredActiveColors(palette.colors);
    applyThemeToDom(palette.colors);
    showToast(`Theme switched to "${palette.name}" (Palette ${palette.paletteNumber})`, 'success');
  };

  // Check if current tab is a sub-view of More
  const isMoreSubView = mobileTab.startsWith('more_');

  // Next class calculation for today's summary
  const nextClass = useMemo(() => {
    const wednesdayClasses = childTimetable.filter(t => t.day === 'Wednesday');
    return wednesdayClasses[1] || wednesdayClasses[0] || null;
  }, [childTimetable]);

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 pb-20 select-none">
      {/* Mobile Top App Bar with Child Switcher */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-2xs">
        {/* Child Selector Dropdown */}
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs"
            style={{ backgroundColor: themeClasses.hex }}
          >
            {activeChild.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Linked Ward:</div>
            <select
              value={activeChild.id}
              onChange={e => handleSelectChild(e.target.value)}
              className="text-xs font-bold py-0.5 px-1 -ml-1 rounded-lg bg-transparent border-0 focus:ring-1 focus:ring-blue-500 text-slate-900 cursor-pointer font-sans"
            >
              {siblingChildren.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} (Std {child.standard}-{child.section})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors"
            title="School Notifications"
          >
            <Bell className="w-4 h-4" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: themeClasses.accentHex }}
            />
          </button>

          <button
            onClick={signOut}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-200 transition-colors flex items-center gap-1"
            title="Switch User / Exit to Role Selection Hub"
          >
            <LogOut className="w-3 h-3 text-slate-500" />
            <span>Roles</span>
          </button>
        </div>
      </header>

      {/* Main Screen Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* SUB-VIEW TOP HEADER IF IN A MORE SUB-SCREEN */}
        {isMoreSubView && (
          <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <button
              onClick={() => setMobileTab('more')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-500" />
              <span>Back to More Hub</span>
            </button>
            <span className="text-[11px] font-bold text-slate-400 font-mono">
              Std {activeChild.standard}-{activeChild.section}
            </span>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: PARENT HOME SCREEN (Section 6)                    */}
        {/* ======================================================== */}
        {mobileTab === 'home' && (
          <div className="space-y-3.5">
            {/* A. Welcome Banner & Greeting */}
            <div
              className="text-white rounded-2xl p-4 shadow-sm space-y-3"
              style={{ backgroundColor: themeClasses.hex }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-white/80 font-medium block">
                    Welcome back,
                  </span>
                  <h3 className="text-base font-bold text-white">Dr. Rajesh Sharma</h3>
                  <p className="text-[11px] text-white/80">
                    Greenfield International School · AY 2026–2027
                  </p>
                </div>
                <div className="text-right bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                  <span className="text-lg font-bold font-mono text-white block">
                    {activeChild.attendanceRate}%
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/80">
                    ✓ Attendance
                  </span>
                </div>
              </div>

              {/* Child Switcher Pills if Multiple Children */}
              {siblingChildren.length > 1 && (
                <div className="pt-2 border-t border-white/20 flex items-center gap-2">
                  <span className="text-[10px] text-white/70">Wards:</span>
                  <div className="flex gap-1.5 flex-1">
                    {siblingChildren.map(child => (
                      <button
                        key={child.id}
                        onClick={() => handleSelectChild(child.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          activeChild.id === child.id
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {child.name.split(' ')[0]} ({child.standard}-{child.section})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* B. Child Summary Card */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center text-sm shadow-xs"
                    style={{ backgroundColor: themeClasses.secondaryHex }}
                  >
                    {activeChild.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{activeChild.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      Standard {activeChild.standard} · Section {activeChild.section} · Roll #{activeChild.rollNo}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {activeChild.admissionNo}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Class Teacher:</span>
                  <span className="font-semibold text-slate-800">
                    {activeChild.standard === 8 ? 'Mrs. Shalini Verma' : 'Mrs. Priya Nair'}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Blood Group & House:</span>
                  <span className="font-semibold text-slate-800">
                    {activeChild.bloodGroup || 'O+'} · Tagore House
                  </span>
                </div>
              </div>
            </div>

            {/* C. Today's Summary */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Today's Highlights (Wednesday)</span>
                </h4>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ✓ Present
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Morning Roll Call</div>
                      <div className="text-[10px] text-slate-500">Checked in at 08:25 AM · Main Gate</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">08:25 AM</span>
                </div>

                {nextClass && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-[10px] font-mono"
                        style={{ backgroundColor: themeClasses.hex }}
                      >
                        P{nextClass.period}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{nextClass.subject}</div>
                        <div className="text-[10px] text-slate-500">
                          {nextClass.teacherName} · {nextClass.room}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono">{nextClass.time}</span>
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Pending Homework</div>
                      <div className="text-[10px] text-slate-500">
                        {childAssignments.length} active tasks assigned for Standard {activeChild.standard}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileTab('academics')}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                  >
                    View &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* D. Fee Summary Card */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-slate-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Tuition Fee Ledger</h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    feeSummary.totalOutstanding > 0
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {feeSummary.totalOutstanding > 0 ? 'Pending Dues' : 'Fully Settled'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Outstanding Balance:</span>
                  <span className="text-base font-bold font-mono text-slate-900">
                    ₹{feeSummary.totalOutstanding.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Total Paid to Date:</span>
                  <span className="text-base font-bold font-mono text-emerald-700">
                    ₹{feeSummary.totalPaid.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setMobileTab('fees')}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-95 flex items-center justify-center gap-1.5 shadow-2xs"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Open Fee Details & Pay</span>
                </button>
              </div>
            </div>

            {/* E. Quick Actions Grid (6 Actions) */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 mb-2">
                Quick Shortcuts
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setMobileTab('attendance')}
                  className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center text-center gap-1.5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 text-[11px]">Attendance</span>
                </button>

                <button
                  onClick={() => setMobileTab('academics')}
                  className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center text-center gap-1.5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 text-[11px]">Academics</span>
                </button>

                <button
                  onClick={() => setMobileTab('more_timetable')}
                  className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center text-center gap-1.5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 text-[11px]">Timetable</span>
                </button>

                <button
                  onClick={() => setMobileTab('more_results')}
                  className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center text-center gap-1.5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 text-[11px]">Results</span>
                </button>

                <button
                  onClick={() => setMobileTab('fees')}
                  className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center text-center gap-1.5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 text-[11px]">Fee Dues</span>
                </button>

                <button
                  onClick={() => setShowLeaveModal(true)}
                  className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center text-center gap-1.5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 text-[11px]">Apply Leave</span>
                </button>
              </div>
            </div>

            {/* F. School Announcement Card */}
            {notices.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-700" />
                    <span>Important Circular</span>
                  </span>
                  <span className="text-[10px] text-amber-700 font-mono">{notices[0].date}</span>
                </div>
                <h5 className="text-xs font-bold text-amber-950">{notices[0].title}</h5>
                <p className="text-[11px] text-amber-900 leading-relaxed line-clamp-2">
                  {notices[0].content}
                </p>
                <button
                  onClick={() => setMobileTab('more_notices')}
                  className="text-[11px] font-bold text-amber-950 hover:underline pt-0.5 block"
                >
                  Read full circular &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ATTENDANCE EXPERIENCE (Section 8)                 */}
        {/* ======================================================== */}
        {mobileTab === 'attendance' && (
          <div className="space-y-3.5">
            {/* Header / Read-Only Badge */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Attendance Records</h3>
                <p className="text-[11px] text-slate-500">
                  {activeChild.name} · Standard {activeChild.standard}-{activeChild.section}
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Read-Only
              </span>
            </div>

            {/* Attendance Summary Stat Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Term Attendance Rate
                  </span>
                  <div className="text-2xl font-bold font-mono text-slate-900">
                    {attendanceStats.rate}%
                  </div>
                  <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle className="w-3 h-3" /> CBSE 75% Statutory Compliance Maintained
                  </span>
                </div>

                <div className="text-right">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex flex-col items-center justify-center font-mono">
                    <span className="text-sm font-bold">{attendanceStats.present}</span>
                    <span className="text-[8px] uppercase">Days ✓</span>
                  </div>
                </div>
              </div>

              {/* Counts Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 font-medium block">✓ Present</span>
                  <span className="text-sm font-bold font-mono text-emerald-900">{attendanceStats.present}</span>
                </div>
                <div className="p-2 bg-rose-50/60 rounded-xl border border-rose-100">
                  <span className="text-[10px] text-rose-800 font-medium block">X Absent</span>
                  <span className="text-sm font-bold font-mono text-rose-900">{attendanceStats.absent}</span>
                </div>
                <div className="p-2 bg-amber-50/60 rounded-xl border border-amber-100">
                  <span className="text-[10px] text-amber-800 font-medium block">Late Arrival</span>
                  <span className="text-sm font-bold font-mono text-amber-900">{attendanceStats.late}</span>
                </div>
              </div>
            </div>

            {/* Month Filter Selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Filter Roll Month:</span>
              <div className="flex gap-1">
                {[
                  { id: '2026-10', label: 'Oct 2026' },
                  { id: '2026-09', label: 'Sep 2026' },
                  { id: '2026-08', label: 'Aug 2026' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setAttendanceMonth(m.id as any)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      attendanceMonth === m.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date-wise Roll History */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Date-wise Morning Roll</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {filteredAttendance.length} Recorded Sessions
                </span>
              </div>

              {filteredAttendance.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 space-y-1">
                  <Calendar className="w-6 h-6 mx-auto text-slate-300" />
                  <p>No roll-call sessions recorded for this month.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredAttendance.map(att => {
                    const isPresent = att.status === 'present';
                    const isAbsent = att.status === 'absent';
                    const isLate = att.status === 'late';
                    return (
                      <div
                        key={att.id}
                        className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-lg font-bold text-[11px] flex items-center justify-center font-mono ${
                              isPresent
                                ? 'bg-emerald-100 text-emerald-800'
                                : isAbsent
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isPresent ? '✓' : isAbsent ? 'X' : 'L'}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-900 block font-mono">{att.date}</span>
                            <span className="text-[10px] text-slate-500">
                              {isPresent
                                ? 'Full day attendance'
                                : isAbsent
                                ? 'Marked absent by Class Teacher'
                                : 'Late gate entry (bus delay)'}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPresent
                              ? 'bg-emerald-100/80 text-emerald-800'
                              : isAbsent
                              ? 'bg-rose-100/80 text-rose-800'
                              : 'bg-amber-100/80 text-amber-800'
                          }`}
                        >
                          {isPresent ? '✓ Present' : isAbsent ? 'X Absent' : 'Late Arrival'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Attendance Discrepancy Action */}
            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-purple-900">Notice an Attendance Discrepancy?</h5>
                <p className="text-[10px] text-purple-700">
                  Submit an inquiry if your child was marked absent incorrectly.
                </p>
              </div>
              <button
                onClick={() => setShowDiscrepancyModal(true)}
                className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors shrink-0"
              >
                Inquire
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ACADEMICS & HOMEWORK (Section 9)                  */}
        {/* ======================================================== */}
        {mobileTab === 'academics' && (
          <div className="space-y-3.5">
            {/* Academic Sub-Tab Navigation */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setAcademicSubTab('assignments')}
                className={`py-1.5 rounded-lg transition-colors ${
                  academicSubTab === 'assignments' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Homework
              </button>
              <button
                onClick={() => setAcademicSubTab('syllabus')}
                className={`py-1.5 rounded-lg transition-colors ${
                  academicSubTab === 'syllabus' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Syllabus
              </button>
              <button
                onClick={() => setAcademicSubTab('resources')}
                className={`py-1.5 rounded-lg transition-colors ${
                  academicSubTab === 'resources' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Resources
              </button>
            </div>

            {/* 1. HOMEWORK & ASSIGNMENTS LIST */}
            {academicSubTab === 'assignments' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Class Assignments (Std {activeChild.standard})
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {childAssignments.length} Published
                  </span>
                </div>

                {childAssignments.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
                    <BookOpen className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                    <p>No active assignments posted for Standard {activeChild.standard}.</p>
                  </div>
                ) : (
                  childAssignments.map(asg => (
                    <div
                      key={asg.id}
                      onClick={() => setSelectedAssignment(asg)}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-400 cursor-pointer transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                          {asg.subject}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Due: {asg.dueDate}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900">{asg.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {asg.description}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                        <span className="text-slate-500">Teacher: {asg.teacherName}</span>
                        <span className="font-semibold text-blue-600 flex items-center gap-1">
                          View Details &rarr;
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 2. SYLLABUS & CURRICULUM */}
            {academicSubTab === 'syllabus' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    CBSE Curriculum Breakdown
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">AY 2026–2027</span>
                </div>

                {[
                  {
                    subject: 'Mathematics',
                    topics: 'Linear Equations, Algebraic Expressions, Quadrilaterals, Mensuration',
                    progress: 75
                  },
                  {
                    subject: 'Science (Physics & Chemistry)',
                    topics: 'Force & Pressure, Combustion & Flame, Chemical Effects of Electric Current',
                    progress: 80
                  },
                  {
                    subject: 'English Literature',
                    topics: 'Honeydew Prose (Chapters 1–6), It So Happened, Formal Letter Writing',
                    progress: 70
                  },
                  {
                    subject: 'Social Studies',
                    topics: 'The Indian Constitution, Judiciary, Mineral & Power Resources',
                    progress: 65
                  },
                  {
                    subject: 'Computer Science',
                    topics: 'Python Fundamentals, Loops & Conditionals, Cybersecurity & Digital Ethics',
                    progress: 85
                  }
                ].map(s => (
                  <div key={s.subject} className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">{s.subject}</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-700">{s.progress}% Covered</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all"
                        style={{ width: `${s.progress}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed pt-0.5">
                      {s.topics}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 3. STUDY RESOURCES */}
            {academicSubTab === 'resources' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Digital Learning Materials
                  </span>
                  <span className="text-[10px] text-slate-500">Curated by GIS Faculty</span>
                </div>

                {[
                  { title: 'CBSE Class 8 Mathematics Revision Exemplar', subject: 'Mathematics', size: '2.4 MB PDF' },
                  { title: 'Science Lab Manual & Experiment Worksheets', subject: 'Science', size: '4.1 MB PDF' },
                  { title: 'Grammar Reference Workbook: Term 2', subject: 'English', size: '1.8 MB PDF' },
                  { title: 'History & Civics Concept Maps', subject: 'Social Studies', size: '3.0 MB PDF' }
                ].map((res, i) => (
                  <div key={i} className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900">{res.title}</h5>
                        <span className="text-[10px] text-slate-400">{res.subject} · {res.size}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast(`Downloading ${res.title}...`, 'success')}
                      className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download Resource"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: FEES & TUITION PAYMENT (Section 13)               */}
        {/* ======================================================== */}
        {mobileTab === 'fees' && (
          <div className="space-y-3.5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tuition & Accounts Ledger</h3>
                <p className="text-[11px] text-slate-500">
                  {activeChild.name} · Standard {activeChild.standard}-{activeChild.section}
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-500">AY 2026–2027</span>
            </div>

            {/* Total Balance Overview Card */}
            <div
              className="text-white rounded-2xl p-4 shadow-sm space-y-3"
              style={{ backgroundColor: themeClasses.hex }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                    Total Outstanding Dues
                  </span>
                  <div className="text-2xl font-bold font-mono text-white mt-0.5">
                    ₹{feeSummary.totalOutstanding.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/80 block">Total Sanctioned:</span>
                  <span className="text-sm font-bold font-mono text-white">
                    ₹{feeSummary.totalAssigned.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Concessions Notification if Any */}
              {childConcessions.length > 0 && (
                <div className="p-2 bg-white/10 rounded-xl border border-white/20 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                    <span className="text-[11px] text-white">
                      Sanctioned {childConcessions[0].concessionType} ({childConcessions[0].discountValue}% Concession)
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-amber-200 font-bold">
                    -₹{childConcessions[0].calculatedDeduction.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Invoices List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Itemized Fee Invoices
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {childFees.length} Scheduled
                </span>
              </div>

              {childFees.map(inv => {
                const isPaid = inv.status === 'paid';
                return (
                  <div
                    key={inv.id}
                    className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block">{inv.invoiceNo}</span>
                        <h4 className="text-xs font-bold text-slate-900">{inv.feeType}</h4>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isPaid ? '✓ Paid' : 'Pending'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2 rounded-xl">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Due Date:</span>
                        <span className="font-mono text-slate-700">{inv.dueDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Billed Amount:</span>
                        <span className="font-bold font-mono text-slate-900">
                          ₹{inv.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      {isPaid ? (
                        <button
                          onClick={() => setViewingReceipt(inv)}
                          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5 text-slate-600" />
                          <span>View Official Receipt</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenPayModal(inv)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay Now (UPI / Card / NetBanking)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: MORE MENU & LAUNCHER HUB (Section 5)              */}
        {/* ======================================================== */}
        {mobileTab === 'more' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl text-white font-bold flex items-center justify-center text-sm shadow-xs"
                style={{ backgroundColor: themeClasses.hex }}
              >
                {activeChild.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">{activeChild.name}</h4>
                <p className="text-[11px] text-slate-500">
                  Standard {activeChild.standard} · Section {activeChild.section} · Roll #{activeChild.rollNo}
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  ✓ Active Enrollment (GIS AY 2026–2027)
                </span>
              </div>
            </div>

            {/* 12 AUTHORIZED FEATURES GRID */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 mb-2">
                Authorized Services & Portals
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  {
                    id: 'more_timetable',
                    title: 'Timetable',
                    desc: 'Weekly class schedule & rooms',
                    icon: Clock,
                    color: 'bg-blue-50 text-blue-700'
                  },
                  {
                    id: 'more_assignments',
                    title: 'Homework Tasks',
                    desc: 'Subject tasks & submission status',
                    icon: BookOpen,
                    color: 'bg-emerald-50 text-emerald-700'
                  },
                  {
                    id: 'more_results',
                    title: 'Results & Exams',
                    desc: 'CBSE term scorecards & dates',
                    icon: Award,
                    color: 'bg-amber-50 text-amber-700'
                  },
                  {
                    id: 'more_notices',
                    title: 'Circulars & Notices',
                    desc: 'Official campus announcements',
                    icon: FileText,
                    color: 'bg-purple-50 text-purple-700'
                  },
                  {
                    id: 'more_leave',
                    title: 'Leave Requests',
                    desc: 'Apply student leave & track status',
                    icon: Plus,
                    color: 'bg-teal-50 text-teal-700'
                  },
                  {
                    id: 'more_events',
                    title: 'School Calendar',
                    desc: 'Sports meet, breaks & holidays',
                    icon: Calendar,
                    color: 'bg-rose-50 text-rose-700'
                  },
                  {
                    id: 'more_transport',
                    title: 'Bus & Transport',
                    desc: 'Route #4, driver & pickup times',
                    icon: Bus,
                    color: 'bg-orange-50 text-orange-700'
                  },
                  {
                    id: 'more_library',
                    title: 'Library Borrowings',
                    desc: 'Issued books, due dates & fines',
                    icon: Library,
                    color: 'bg-indigo-50 text-indigo-700'
                  },
                  {
                    id: 'more_messages',
                    title: 'Teacher Chat',
                    desc: 'Direct consultation with class teacher',
                    icon: MessageSquare,
                    color: 'bg-cyan-50 text-cyan-700'
                  },
                  {
                    id: 'more_documents',
                    title: 'ID & Certificates',
                    desc: 'Student ID, Admit card & reports',
                    icon: ShieldCheck,
                    color: 'bg-lime-50 text-lime-700'
                  },
                  {
                    id: 'more_settings',
                    title: 'Profile & Settings',
                    desc: 'Contact details & 12 Theme Palettes',
                    icon: Settings,
                    color: 'bg-slate-100 text-slate-700'
                  },
                  {
                    id: 'more_help',
                    title: 'Help & Helpline',
                    desc: 'Campus directory & FAQs',
                    icon: HelpCircle,
                    color: 'bg-pink-50 text-pink-700'
                  }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setMobileTab(item.id as ParentMobileTab)}
                      className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs text-left transition-all flex flex-col justify-between group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs">{item.title}</h5>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exit to Role Hub */}
            <button
              onClick={signOut}
              className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out to Role Selector Hub
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 1: TIMETABLE (Section 10)                       */}
        {/* ======================================================== */}
        {mobileTab === 'more_timetable' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Student Timetable</h3>
                <p className="text-[11px] text-slate-500">
                  Standard {activeChild.standard} · Section {activeChild.section} · Room 204
                </p>
              </div>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                AY 2026–2027
              </span>
            </div>

            {/* Day Selector Pills */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const).map(day => (
                <button
                  key={day}
                  onClick={() => setTimetableDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    timetableDay === day
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {day.slice(0, 3)}
                  {day === 'Wednesday' && ' (Today)'}
                </button>
              ))}
            </div>

            {/* Periods List */}
            {timetableForSelectedDay.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
                <Clock className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                <p>No instructional periods scheduled for {timetableDay}.</p>
                <span className="text-[10px] text-slate-400">Co-curricular activities or weekend break.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {timetableForSelectedDay.map(slot => (
                  <div
                    key={slot.id}
                    className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: themeClasses.hex }}
                      >
                        P{slot.period}
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900">{slot.subject}</h5>
                        <p className="text-[10px] text-slate-500">
                          {slot.teacherName} · {slot.room}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-slate-600 font-medium">
                      {slot.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 2: HOMEWORK & ASSIGNMENTS DIRECTORY             */}
        {/* ======================================================== */}
        {mobileTab === 'more_assignments' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Homework & Assignments</h3>
                <p className="text-[11px] text-slate-500">
                  Standard {activeChild.standard}-{activeChild.section}
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {childAssignments.length} Active Tasks
              </span>
            </div>

            {childAssignments.map(asg => (
              <div
                key={asg.id}
                onClick={() => setSelectedAssignment(asg)}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-400 cursor-pointer transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    {asg.subject}
                  </span>
                  <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold">
                    Due {asg.dueDate}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{asg.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {asg.description}
                </p>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                  <span>Assigned by {asg.teacherName}</span>
                  <span className="text-blue-600 font-semibold">View Task &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 3: EXAMINATIONS & CBSE RESULTS (Section 11)     */}
        {/* ======================================================== */}
        {mobileTab === 'more_results' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">CBSE Term 1 Scorecard</h3>
                <p className="text-[11px] text-slate-500">
                  {activeChild.name} · Standard {activeChild.standard}-{activeChild.section}
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Published
              </span>
            </div>

            {/* Scorecard Summary Banner */}
            <div
              className="text-white rounded-2xl p-4 shadow-sm flex items-center justify-between"
              style={{ backgroundColor: themeClasses.hex }}
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-white/80 block">Cumulative Score</span>
                <div className="text-2xl font-bold font-mono text-white mt-0.5">
                  {activeChild.standard === 8 ? '91.4%' : '88.5%'}
                </div>
                <span className="text-[10px] text-white/80 block">Overall CBSE Grade: A1 (Outstanding)</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/80 block">Rank in Section:</span>
                <span className="text-base font-bold font-mono text-white">#2 of 25</span>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800 flex justify-between">
                <span>Subject Assessment</span>
                <span>Marks / Grade</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {[
                  { subject: 'Mathematics', marks: activeChild.standard === 8 ? 94 : 88, max: 100, grade: 'A1' },
                  { subject: 'Science (Physics/Chem)', marks: activeChild.standard === 8 ? 92 : 89, max: 100, grade: 'A1' },
                  { subject: 'English Literature', marks: activeChild.standard === 8 ? 89 : 92, max: 100, grade: 'A2' },
                  { subject: 'Social Studies', marks: activeChild.standard === 8 ? 88 : 85, max: 100, grade: 'A2' },
                  { subject: 'Hindi & Sanskrit', marks: activeChild.standard === 8 ? 91 : 86, max: 100, grade: 'A1' },
                  { subject: 'Computer Science', marks: activeChild.standard === 8 ? 96 : 94, max: 100, grade: 'A1' }
                ].map((row, i) => (
                  <div key={i} className="p-3 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900">{row.subject}</h5>
                      <span className="text-[10px] text-slate-400">Max Marks: {row.max}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold font-mono text-slate-900 text-xs">{row.marks}/{row.max}</span>
                      <span className="block text-[10px] font-bold text-emerald-700">Grade {row.grade}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">Class Teacher Remarks:</span>
                <p className="text-[11px] text-slate-600 italic leading-relaxed">
                  "Exemplary dedication in STEM subjects and analytical thinking. Consistent active participation in classroom discussions."
                </p>
                <div className="pt-2 text-right">
                  <span className="text-[10px] text-slate-500">
                    Endorsed by Dr. Evelyn Montgomery (Principal)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 4: CIRCULARS & NOTICES                          */}
        {/* ======================================================== */}
        {mobileTab === 'more_notices' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">School Circulars & Notices</h3>
                <p className="text-[11px] text-slate-500">Official Greenfield International Feed</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{notices.length} Published</span>
            </div>

            <div className="space-y-2.5">
              {notices.map(n => (
                <div key={n.id} className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                      {n.category || 'General Circular'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{n.content}</p>
                  <div className="pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                    Authorized by: {n.author || 'School Administration'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 5: LEAVE REQUESTS                               */}
        {/* ======================================================== */}
        {mobileTab === 'more_leave' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Student Leave Applications</h3>
                <p className="text-[11px] text-slate-500">{activeChild.name}</p>
              </div>
              <button
                onClick={() => setShowLeaveModal(true)}
                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Apply</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {appliedLeavesList.map(item => (
                <div key={item.id} className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.category}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span>From: {item.from}</span>
                    <span>&bull;</span>
                    <span>To: {item.to}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 6: SCHOOL EVENTS & CALENDAR                     */}
        {/* ======================================================== */}
        {mobileTab === 'more_events' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">School Events & Holidays</h3>
                <p className="text-[11px] text-slate-500">Academic Year 2026–2027</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEventsViewMode('agenda')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                    eventsViewMode === 'agenda' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border'
                  }`}
                >
                  Events
                </button>
                <button
                  onClick={() => setEventsViewMode('holidays')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                    eventsViewMode === 'holidays' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border'
                  }`}
                >
                  Holidays
                </button>
              </div>
            </div>

            {eventsViewMode === 'agenda' ? (
              <div className="space-y-2.5">
                {events.map(ev => (
                  <div key={ev.id} className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{ev.title}</span>
                      <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                        {ev.date}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{ev.description}</p>
                    <span className="text-[10px] text-slate-400 font-mono block">Location: {ev.location}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 text-xs">
                {[
                  { name: 'Gandhi Jayanti', date: 'Oct 02, 2026', type: 'National Holiday' },
                  { name: 'Dussehra Break', date: 'Oct 20, 2026', type: 'Festival Break' },
                  { name: 'Diwali Vacation', date: 'Nov 08–12, 2026', type: 'Term Holiday' },
                  { name: 'Guru Nanak Jayanti', date: 'Nov 27, 2026', type: 'Observance' },
                  { name: 'Winter Break', date: 'Dec 24, 2026 – Jan 02, 2027', type: 'Vacation' }
                ].map((h, i) => (
                  <div key={i} className="p-3 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900">{h.name}</h5>
                      <span className="text-[10px] text-slate-400">{h.type}</span>
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-slate-700">{h.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 7: TRANSPORT & BUS ROUTE (Shared Integration)     */}
        {/* ======================================================== */}
        {mobileTab === 'more_transport' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Campus Transport Route</h3>
                <p className="text-[11px] text-slate-500">
                  {childTransportAssignment ? `${childRoute?.routeCode || childTransportAssignment.routeCode}: ${childRoute?.routeName || 'Assigned Transit'}` : `${activeChild.name} · Self Commuter`}
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                childTransportAssignment
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {childTransportAssignment ? 'Scheduled Transit' : 'Self Commuter'}
              </span>
            </div>

            {childTransportAssignment ? (
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Assigned Vehicle:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {childVehicle ? `${childVehicle.vehicleNo} (${childVehicle.vehicleCode})` : childRoute?.assignedVehicleNo || 'Greenfield Fleet Bus'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Route Roster:</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      {childRoute ? `${childRoute.assignedStudentsCount} / ${childRoute.capacity} Commuters` : 'Allocated'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Morning Pickup:</span>
                    <span className="font-bold text-slate-900">{childRoute?.morningDeparture || '07:30 AM'}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{childTransportAssignment.pickupStopName}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Afternoon Drop:</span>
                    <span className="font-bold text-slate-900">{childRoute?.eveningArrival || '03:15 PM'}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{childTransportAssignment.dropStopName}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Assigned Driver:</span>
                    <strong className="text-slate-900">{childDriver?.name || 'Mr. Balwant Singh'}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Driver Contact:</span>
                    <a href={`tel:${childRoute?.driverPhone || childDriver?.phone || '+91 98220 12345'}`} className="font-mono text-blue-700 font-bold hover:underline">
                      {childRoute?.driverPhone || childDriver?.phone || '+91 98220 12345'}
                    </a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Safety Compliance:</span>
                    <span className="text-[11px] font-semibold text-emerald-700">Certified Speed Governor & CCTV</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Integrated Transport Source of Truth:</span>
                    <span>Route allocation managed by Transport Manager. All pickup and boarding events are logged independently from academic roll-call.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Bus className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">No Campus Transport Assigned</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeChild.name} is currently designated as a self-commuter. To register for campus bus service, contact the Transport Manager or Front Office.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 8: LIBRARY BORROWINGS (Shared Integration)      */}
        {/* ======================================================== */}
        {mobileTab === 'more_library' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Student Library Card</h3>
                <p className="text-[11px] text-slate-500">
                  {activeChild.name} · Member #{activeChild.admissionNo}
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Active Member
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Currently Checked Out Books
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {childBookIssues.length} on loan
                </span>
              </div>

              {childBookIssues.length > 0 ? (
                childBookIssues.map(issue => (
                  <div key={issue.id} className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-slate-900 leading-snug">{issue.bookTitle}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                        issue.status === 'overdue'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {issue.status === 'overdue' ? 'Overdue - Fine Accruing' : 'Within Loan Period'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Issue #{issue.issueNo} {issue.copyBarcode ? `· Barcode: ${issue.copyBarcode}` : ''}
                    </p>
                    <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 font-mono">
                      <span>Issued: {issue.issuedDate}</span>
                      <span>Return Due: {issue.dueDate}</span>
                    </div>
                    {issue.fineAmount > 0 && (
                      <div className="text-[10px] font-bold text-rose-600 bg-rose-50 p-1.5 rounded-lg flex items-center justify-between">
                        <span>Accrued Late Fine:</span>
                        <span>₹{issue.fineAmount}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Library className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">No Books Currently Checked Out</h4>
                  <p className="text-[11px] text-slate-500">
                    Books borrowed by {activeChild.name} from the library repository will appear here automatically when checked out by the librarian.
                  </p>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
                <span className="text-slate-600">Outstanding Library Fines:</span>
                <span className={`font-bold font-mono ${totalLibraryFines > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {totalLibraryFines > 0 ? `₹${totalLibraryFines.toLocaleString()} (Payment Due)` : '₹0.00 (No Dues)'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 9: TEACHER MESSAGES / CHAT (Section 15)         */}
        {/* ======================================================== */}
        {mobileTab === 'more_messages' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                  SV
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {activeChild.standard === 8 ? 'Mrs. Shalini Verma' : 'Mrs. Priya Nair'}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Class Teacher · Standard {activeChild.standard}-{activeChild.section}
                  </p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
            </div>

            {/* Chat Bubble Feed */}
            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto p-1 text-xs">
              <div className="flex flex-col items-start max-w-[85%] space-y-1">
                <div className="p-3 rounded-2xl rounded-tl-xs bg-white border border-slate-200 text-slate-800 shadow-2xs">
                  Good day Dr. Sharma. Aarav has been exceptionally attentive in mathematics this week. Just a quick reminder about the science practical journal submission next Tuesday.
                </div>
                <span className="text-[9px] text-slate-400 px-1 font-mono">10:14 AM</span>
              </div>

              <div className="flex flex-col items-end max-w-[85%] ml-auto space-y-1">
                <div
                  className="p-3 rounded-2xl rounded-tr-xs text-white shadow-2xs"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  Thank you Mrs. Verma. We have reviewed the journal index at home and he is ready for Tuesday.
                </div>
                <div className="flex items-center gap-1 text-[9px] text-slate-400 px-1 font-mono">
                  <span>10:22 AM</span>
                  <CheckCheck className="w-3 h-3 text-blue-600" />
                </div>
              </div>

              {messages.filter(m => m.receiverName?.includes('Teacher')).map(msg => (
                <div key={msg.id} className="flex flex-col items-end max-w-[85%] ml-auto space-y-1">
                  <div
                    className="p-3 rounded-2xl rounded-tr-xs text-white shadow-2xs"
                    style={{ backgroundColor: themeClasses.hex }}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-slate-400 px-1 font-mono">
                    <span>Just now</span>
                    <CheckCheck className="w-3 h-3 text-blue-600" />
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-200">
              <input
                type="text"
                placeholder="Type your message to class teacher..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="px-4 py-2.5 text-white font-bold rounded-xl transition-opacity disabled:opacity-50 flex items-center justify-center shadow-2xs"
                style={{ backgroundColor: themeClasses.hex }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 10: ID & CERTIFICATES                           */}
        {/* ======================================================== */}
        {mobileTab === 'more_documents' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Documents & Digital Badges</h3>
                <p className="text-[11px] text-slate-500">{activeChild.name}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Official Dossier</span>
            </div>

            {/* Student ID Card Preview */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 shadow-md border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 font-bold flex items-center justify-center text-xs">
                    GIS
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider font-serif">
                    Greenfield International
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                  Verified Student
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg font-bold text-slate-300">
                  {activeChild.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-xs space-y-0.5">
                  <h4 className="font-bold text-white text-sm">{activeChild.name}</h4>
                  <p className="text-[10px] text-slate-400">
                    Standard {activeChild.standard}-{activeChild.section} · Roll #{activeChild.rollNo}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">ID: {activeChild.admissionNo}</p>
                  <p className="text-[10px] text-slate-400">Blood Group: {activeChild.bloodGroup || 'O+'}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                <span>Emergency: +91 98765 43211</span>
                <span>Valid: 2026–2027</span>
              </div>
            </div>

            {/* Document Download Items */}
            <div className="space-y-2">
              {[
                { title: 'CBSE Term 1 Admit Card (Fee Cleared)', desc: 'Roll verified with Bursar clearance stamp' },
                { title: 'Annual Fee Clearance Certificate', desc: 'Financial record for income tax 80C' },
                { title: 'Official Term 1 Grade Report Card', desc: 'Signed by Principal and Exam Controller' }
              ].map((doc, i) => (
                <div key={i} className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900">{doc.title}</h5>
                    <p className="text-[10px] text-slate-500">{doc.desc}</p>
                  </div>
                  <button
                    onClick={() => showToast(`Downloaded ${doc.title} as PDF.`, 'success')}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 11: PROFILE & 12 THEME PALETTES (Section 4)     */}
        {/* ======================================================== */}
        {mobileTab === 'more_settings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Parent Profile & Settings</h3>
                <p className="text-[11px] text-slate-500">Dr. Rajesh Sharma</p>
              </div>
              <button
                onClick={() => setShowInfoRequestModal(true)}
                className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-100"
              >
                Update Details
              </button>
            </div>

            {/* Profile Contact Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Primary Guardian:</span>
                <strong className="text-slate-900">Dr. Rajesh Sharma, MD, MBBS</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Contact Number:</span>
                <span className="font-mono text-slate-800">+91 98765 43210</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Email Address:</span>
                <span className="font-mono text-slate-800">rajesh.sharma@medmail.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Residence:</span>
                <span className="text-slate-800 text-right">Flat 402, Oakwood Enclave, Pune</span>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-xs">Notification Preferences</h4>

              {[
                { label: 'Morning Attendance Alerts (SMS & App)', val: notifSmsAttendance, setVal: setNotifSmsAttendance },
                { label: 'Homework Task Reminders', val: notifPushHomework, setVal: setNotifPushHomework },
                { label: 'Tuition Fee Due Notices', val: notifEmailFees, setVal: setNotifEmailFees },
                { label: 'Class Teacher Direct Messages', val: notifChatAlerts, setVal: setNotifChatAlerts }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-slate-700">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={item.val}
                    onChange={e => item.setVal(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            {/* LIVE 12-PALETTE THEME SELECTOR */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-500" />
                  <h4 className="font-bold text-slate-900 text-xs">SCHLAR Design Tokens & Themes</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">12 Palettes</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Choose from SCHLAR's 12 professional school palettes. Switching instantly updates the application header, active highlights, and buttons.
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {SCHLAR_PALETTES.map(p => {
                  const isActive = currentPaletteId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPalette(p.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isActive
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 text-[11px] truncate">
                          {p.name}
                        </span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>

                      {/* Color Swatch Dots */}
                      <div className="flex gap-1">
                        <span
                          className="w-4 h-4 rounded-full border border-black/10"
                          style={{ backgroundColor: p.colors.primary }}
                          title={`Primary: ${p.colors.primary}`}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/10"
                          style={{ backgroundColor: p.colors.secondary }}
                          title={`Secondary: ${p.colors.secondary}`}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/10"
                          style={{ backgroundColor: p.colors.accent }}
                          title={`Accent: ${p.colors.accent}`}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/10"
                          style={{ backgroundColor: p.colors.surface }}
                          title={`Surface: ${p.colors.surface}`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-VIEW 12: HELP & CAMPUS DIRECTORY                     */}
        {/* ======================================================== */}
        {mobileTab === 'more_help' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Campus Helpline & Support</h3>
                <p className="text-[11px] text-slate-500">Greenfield International School</p>
              </div>
              <span className="text-[10px] font-mono text-slate-500">24/7 Desk</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Emergency & Office Contacts
              </h4>

              <div className="space-y-2">
                {[
                  { title: 'Main Campus Reception', phone: '+91 20 2748 0000', email: 'reception@greenfield.edu' },
                  { title: 'Accounts & Tuition Bursar', phone: '+91 20 2748 0005', email: 'accounts@greenfield.edu' },
                  { title: 'Fleet & Transit Dispatch', phone: '+91 20 2748 0008', email: 'transport@greenfield.edu' },
                  { title: 'School Infirmary & Medical', phone: '+91 20 2748 0012', email: 'health@greenfield.edu' }
                ].map((item, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-xl flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-slate-900">{item.title}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">{item.email}</span>
                    </div>
                    <a
                      href={`tel:${item.phone}`}
                      className="font-mono font-bold text-blue-700 bg-white px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100"
                    >
                      {item.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Parent FAQs */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Frequently Asked Questions
              </h4>

              <div className="space-y-2 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-900 block">How do I report an attendance discrepancy?</span>
                  <span className="text-[11px]">
                    Go to Attendance tab and tap "Inquire". Your note is routed to the class teacher and bus monitor.
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-900 block">Where can I download the fee receipt?</span>
                  <span className="text-[11px]">
                    Under Fees tab, tap "View Official Receipt" on any paid invoice to download or save as PDF.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* PERSISTENT 5-DESTINATION BOTTOM NAVIGATION (Section 5)   */}
      {/* ======================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around h-16 px-1 shadow-lg">
        {/* 1. HOME */}
        <button
          onClick={() => setMobileTab('home')}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-colors ${
            mobileTab === 'home'
              ? 'text-slate-900 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
          style={{ color: mobileTab === 'home' ? themeClasses.hex : undefined }}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Home</span>
        </button>

        {/* 2. ATTENDANCE */}
        <button
          onClick={() => setMobileTab('attendance')}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-colors ${
            mobileTab === 'attendance'
              ? 'text-slate-900 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
          style={{ color: mobileTab === 'attendance' ? themeClasses.hex : undefined }}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-1">Attendance</span>
        </button>

        {/* 3. ACADEMICS */}
        <button
          onClick={() => setMobileTab('academics')}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-colors ${
            mobileTab === 'academics'
              ? 'text-slate-900 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
          style={{ color: mobileTab === 'academics' ? themeClasses.hex : undefined }}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px] mt-1">Academics</span>
        </button>

        {/* 4. FEES */}
        <button
          onClick={() => setMobileTab('fees')}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-colors ${
            mobileTab === 'fees'
              ? 'text-slate-900 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
          style={{ color: mobileTab === 'fees' ? themeClasses.hex : undefined }}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px] mt-1">Fees</span>
        </button>

        {/* 5. MORE */}
        <button
          onClick={() => setMobileTab('more')}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-colors ${
            mobileTab === 'more' || isMoreSubView
              ? 'text-slate-900 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
          style={{ color: (mobileTab === 'more' || isMoreSubView) ? themeClasses.hex : undefined }}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-1">More</span>
        </button>
      </nav>

      {/* ======================================================== */}
      {/* MODAL 1: APPLY FOR STUDENT LEAVE                         */}
      {/* ======================================================== */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Apply for Student Leave</h3>
                <p className="text-[11px] text-slate-500">
                  {activeChild.name} (Std {activeChild.standard}-{activeChild.section})
                </p>
              </div>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitLeave} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Leave Category</label>
                <select
                  value={leaveCategory}
                  onChange={e => setLeaveCategory(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Medical / Illness">Medical / Viral Illness</option>
                  <option value="Family Function">Family Event / Function</option>
                  <option value="Urgent Travel">Urgent Outstation Travel</option>
                  <option value="Other">Other Personal Reason</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={leaveStartDate}
                    onChange={e => setLeaveStartDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={leaveEndDate}
                    onChange={e => setLeaveEndDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason for Absence</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Doctor advised 2 days rest for seasonal fever..."
                  value={leaveReasonText}
                  onChange={e => setLeaveReasonText(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/80 text-[11px] text-blue-900">
                <span className="font-bold block">CBSE Protocol:</span>
                <span>Medical certificates can be submitted upon physical return to Class Teacher.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLeave}
                  className="px-4 py-1.5 font-bold text-white rounded-xl shadow-2xs disabled:opacity-50"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  {isSubmittingLeave ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: REPORT ATTENDANCE DISCREPANCY                   */}
      {/* ======================================================== */}
      {showDiscrepancyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Report Attendance Discrepancy</h3>
                <p className="text-[11px] text-slate-500">{activeChild.name}</p>
              </div>
              <button
                onClick={() => setShowDiscrepancyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitDiscrepancy} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Session Date</label>
                  <input
                    type="date"
                    required
                    value={discDate}
                    onChange={e => setDiscDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Recorded Status</label>
                  <select
                    value={discReportedStatus}
                    onChange={e => setDiscReportedStatus(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="absent">Marked Absent</option>
                    <option value="late">Marked Late</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Discrepancy Explanation</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Aarav was present in class after morning bus delay; please verify with bus log..."
                  value={discReason}
                  onChange={e => setDiscReason(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/80 text-[11px] text-purple-900">
                <span className="font-bold block">Resolution Notice:</span>
                <span>Submitting an inquiry notifies the class teacher for verification against the campus bus and gate log.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDiscrepancyModal(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-2xs"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: STUDENT INFO UPDATE REQUEST                     */}
      {/* ======================================================== */}
      {showInfoRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Request Record Correction</h3>
                <p className="text-[11px] text-slate-500">{activeChild.name}</p>
              </div>
              <button
                onClick={() => setShowInfoRequestModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitInfoRequest} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Record Category</label>
                <select
                  value={reqType}
                  onChange={e => setReqType(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Emergency Contact">Emergency Phone Number</option>
                  <option value="Residential Address">Residential Address</option>
                  <option value="Medical Notes">Medical Condition / Allergy Note</option>
                  <option value="Parent Name / Spelling">Parent / Guardian Dossier</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Requested Corrections</label>
                <textarea
                  rows={2}
                  required
                  placeholder="New phone number: +91 98765 43212..."
                  value={reqChanges}
                  onChange={e => setReqChanges(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason for Request</label>
                <input
                  type="text"
                  required
                  placeholder="Updated office clinic contact number"
                  value={reqReason}
                  onChange={e => setReqReason(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInfoRequestModal(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white rounded-xl shadow-2xs"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: ONLINE FEE PAYMENT SIMULATION (UPI / CARD)      */}
      {/* ======================================================== */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Online Fee Payment</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Invoice: {payingInvoice.invoiceNo}</span>
                </div>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmMobilePayment} className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-900">{activeChild.name} (Std {activeChild.standard}-{activeChild.section})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fee Particular:</span>
                  <span className="font-semibold text-slate-800">{payingInvoice.feeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Billed:</span>
                  <span className="font-mono text-slate-700">₹{payingInvoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                  <span className="text-slate-900">Remaining Balance:</span>
                  <span className="text-rose-700 font-mono text-sm">
                    ₹{(payingInvoice.remainingBalance ?? payingInvoice.amount).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  min={100}
                  max={payingInvoice.remainingBalance ?? payingInvoice.amount}
                  value={payingAmount}
                  onChange={e => setPayingAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Payment Gateway / Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / QR', desc: 'GPay · PhonePe' },
                    { id: 'Card', label: 'Card (POS)', desc: 'Debit / Credit' },
                    { id: 'NetBanking', label: 'NetBanking', desc: 'Direct NEFT' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayingMethod(m.id as any)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        payingMethod === m.id
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-bold block text-xs">{m.label}</span>
                      <span className="text-[9px] text-slate-400 block">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-[11px] space-y-0.5">
                <span className="font-bold block">Instant Digital Receipt Guarantee:</span>
                <p className="text-blue-800">
                  Secured by 256-bit institutional encryption. Instant automated reconciliation with GIS Bursar ledger.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="flex-1 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmittingPayment ? 'Processing...' : `Confirm & Pay ₹${payingAmount.toLocaleString()}`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: OFFICIAL BURSAR TUITION RECEIPT                 */}
      {/* ======================================================== */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3.5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Official Tuition Fee Receipt
              </span>
              <button
                onClick={() => setViewingReceipt(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="border border-slate-300 p-4 rounded-xl bg-slate-50/50 space-y-3 text-xs">
              <div className="text-center space-y-1 border-b pb-2.5 border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-blue-900 text-white font-bold font-serif flex items-center justify-center mx-auto text-sm">
                  GIS
                </div>
                <h3 className="text-sm font-bold font-serif text-slate-900 uppercase">
                  Greenfield International School
                </h3>
                <p className="text-[10px] text-slate-500">
                  Affiliated to CBSE, New Delhi (Affiliation: 1930284 · Code: 45129)
                </p>
                <p className="text-[9px] text-slate-400 font-mono">
                  accounts@greenfield.edu · Sector 12, Pune
                </p>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <div>
                  <span className="text-slate-500">Receipt No: </span>
                  <strong className="font-mono text-slate-900">{viewingReceipt.receiptNo || 'RCP-78291'}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Date: </span>
                  <strong className="font-mono text-slate-900">{viewingReceipt.paidDate || '2026-10-14'}</strong>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <strong className="text-slate-900">{activeChild.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admission No:</span>
                  <span className="font-mono">{activeChild.admissionNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class & Section:</span>
                  <span>Std {activeChild.standard}-{activeChild.section} (Roll #{activeChild.rollNo})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fee Particular:</span>
                  <span className="font-semibold text-slate-800">{viewingReceipt.feeType}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <div className="p-2 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Sanctioned Amount:</span>
                    <span className="font-mono">₹{viewingReceipt.amount.toLocaleString()}</span>
                  </div>
                  {viewingReceipt.concessionApplied && (
                    <div className="flex justify-between text-amber-800">
                      <span>Less Concession ({viewingReceipt.concessionType}):</span>
                      <span className="font-mono">-₹{viewingReceipt.concessionApplied.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1">
                    <span>Amount Paid:</span>
                    <span className="font-mono text-emerald-700 text-xs">
                      ₹{(viewingReceipt.paidAmount || viewingReceipt.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>Remaining Balance:</span>
                    <span className="font-mono">₹{(viewingReceipt.remainingBalance ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                <span>Method: <strong>{viewingReceipt.paymentMethod || 'UPI'}</strong></span>
                <span>Ref: <strong className="font-mono">{viewingReceipt.referenceNo || 'UPI-APP-SUCCESS'}</strong></span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-end text-[10px]">
                <div className="text-slate-400">
                  <p>Computer-generated receipt.</p>
                  <p>Valid for tax exemption under 80C.</p>
                </div>
                <div className="text-center font-serif">
                  <span className="italic font-bold text-slate-700 block">David Reynolds</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block border-t border-slate-300 pt-0.5">
                    Authorized Bursar Seal
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  showToast(`Receipt ${viewingReceipt.receiptNo || 'Receipt'} downloaded as PDF.`, 'success');
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save PDF</span>
              </button>
              <button
                onClick={() => setViewingReceipt(null)}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: ASSIGNMENT DETAIL MODAL (Section 9)             */}
      {/* ======================================================== */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                {selectedAssignment.subject}
              </span>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="text-sm font-bold text-slate-900">{selectedAssignment.title}</h4>
              <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-xl font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] block">Assigned:</span>
                  <span>{selectedAssignment.assignedDate}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">Due Date:</span>
                  <span className="font-bold text-rose-700">{selectedAssignment.dueDate}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Instructions:</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {selectedAssignment.description}
                </p>
              </div>

              <div className="p-2 bg-blue-50/70 rounded-xl border border-blue-100 text-blue-900 text-[11px] flex justify-between items-center">
                <span>Faculty: <strong>{selectedAssignment.teacherName}</strong></span>
                <span className="font-mono">Max Marks: {selectedAssignment.maxMarks || 25}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedAssignment(null)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* NOTIFICATIONS DRAWER                                     */}
      {/* ======================================================== */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-xs p-4 pt-16 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900">Parent Notifications</h4>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                <span className="font-bold text-emerald-900 block">Attendance Marked Present</span>
                <span className="text-[11px] text-emerald-700">
                  {activeChild.name} checked in during morning roll call today.
                </span>
              </div>
              <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-900 block">Mid-Term Grade Card Published</span>
                <span className="text-[11px] text-blue-700">Consolidated CBSE scorecards available for review.</span>
              </div>
              <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-100">
                <span className="font-bold text-amber-900 block">Bus Route #4 Update</span>
                <span className="text-[11px] text-amber-700">Evening drop departure scheduled at 03:20 PM as normal.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* INTERACTIVE SUCCESS TOASTS                               */}
      {/* ======================================================== */}
      {paySuccessToast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-emerald-900 text-white text-xs p-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>Fee paid successfully! Official receipt generated in tuition ledger.</span>
        </div>
      )}

      {leaveSubmittedToast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-slate-900 text-white text-xs p-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Student leave application submitted to Class Teacher!</span>
        </div>
      )}

      {discSubmittedToast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-purple-950 text-white text-xs p-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <HelpCircle className="w-4 h-4 text-purple-300 shrink-0" />
          <span>Attendance discrepancy submitted to Class Teacher for verification!</span>
        </div>
      )}

      {infoReqSubmittedToast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-blue-950 text-white text-xs p-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-blue-300 shrink-0" />
          <span>Student record change request filed with Admissions Registry!</span>
        </div>
      )}
    </div>
  );
};
