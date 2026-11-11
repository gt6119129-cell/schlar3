import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  Eye,
  Edit2,
  Printer,
  ChevronRight,
  HelpCircle,
  Settings as SettingsIcon,
  Send,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRightLeft,
  CheckCheck,
  Info,
  CalendarDays,
  FileCheck,
  FileDown
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import {
  Student,
  Teacher,
  AttendanceRecord,
  StaffAttendanceRecord,
  StudentMovementRecord,
  AttendanceCorrectionRequest,
  StaffLeaveRequest,
  RoleType
} from '../../types/school';
import { getThemeClasses } from '../../utils/themeHelper';
import { StudentProfileModal } from './StudentProfileModal';
import { PeriodAttendanceMatrix } from './PeriodAttendanceMatrix';

export interface AttendanceManagerProps {
  initialTab?: 'dashboard' | 'student_attendance' | 'staff_attendance' | 'corrections' | 'daily_operations' | 'leave_management' | 'reports' | 'settings';
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  initialTab = 'dashboard'
}) => {
  const {
    currentRole,
    themeColor,
    students,
    teachers,
    attendance,
    staffAttendance,
    studentMovements,
    correctionRequests,
    attendanceSessions,
    attendanceSettings,
    leaveRequests,
    academicYears,
    classes,
    logStudentMovement,
    updateStudentMovement,
    submitCorrectionRequest,
    reviewCorrectionRequest,
    markStaffAttendance,
    bulkMarkStaffAttendance,
    saveAttendanceSession,
    updateAttendanceSettings,
    submitLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    cancelLeaveRequest,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Active navigation tab within Attendance workspace
  const [activeSubTab, setActiveSubTab] = useState<
    'dashboard' | 'student_attendance' | 'staff_attendance' | 'corrections' | 'daily_operations' | 'leave_management' | 'reports' | 'settings'
  >(initialTab);

  const [studentAttendanceMode, setStudentAttendanceMode] = useState<'period_matrix' | 'session_register'>('period_matrix');

  // Filter & Selection State
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2026–2027');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedClassStr, setSelectedClassStr] = useState<string>('8-A');
  const [selectedSession, setSelectedSession] = useState<string>('morning');

  // Student Profile Modal Target
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Class selection breakdown
  const [selectedStd, selectedSec] = useMemo(() => {
    const parts = selectedClassStr.split('-');
    return [parseInt(parts[0], 10) || 8, (parts[1] as 'A' | 'B') || 'A'];
  }, [selectedClassStr]);

  // Enrolled students for selected class
  const classStudents = useMemo(() => {
    return students.filter(s => s.standard === selectedStd && s.section === selectedSec && s.status === 'Active');
  }, [students, selectedStd, selectedSec]);

  // Current session's roll-call draft state: { [studentId]: status }
  const [rollCallDraft, setRollCallDraft] = useState<Record<string, AttendanceRecord['status']>>({});
  const [arrivalTimes, setArrivalTimes] = useState<Record<string, string>>({});
  const [departureTimes, setDepartureTimes] = useState<Record<string, string>>({});
  const [remarksDraft, setRemarksDraft] = useState<Record<string, string>>({});
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [unmarkedModalOpen, setUnmarkedModalOpen] = useState(false);

  // Synchronize rollCallDraft when class or date or session changes
  React.useEffect(() => {
    const draftStatus: Record<string, AttendanceRecord['status']> = {};
    const draftTimes: Record<string, string> = {};
    const draftDep: Record<string, string> = {};
    const draftRemarks: Record<string, string> = {};

    classStudents.forEach(s => {
      const existing = attendance.find(
        a => a.studentId === s.id && a.date === selectedDate && (a.session === selectedSession || (!a.session && selectedSession === 'morning'))
      );
      if (existing) {
        draftStatus[s.id] = existing.status;
        if (existing.arrivalTime) draftTimes[s.id] = existing.arrivalTime;
        if (existing.departureTime) draftDep[s.id] = existing.departureTime;
        if (existing.remarks) draftRemarks[s.id] = existing.remarks;
      } else {
        draftStatus[s.id] = 'not_marked';
      }
    });

    setRollCallDraft(draftStatus);
    setArrivalTimes(draftTimes);
    setDepartureTimes(draftDep);
    setRemarksDraft(draftRemarks);
  }, [selectedStd, selectedSec, selectedDate, selectedSession, classStudents, attendance]);

  // Current session entity info
  const currentSessionEntity = useMemo(() => {
    const sessionId = `${selectedStd}-${selectedSec}-${selectedDate}-${selectedSession}`;
    return attendanceSessions.find(s => s.id === sessionId);
  }, [attendanceSessions, selectedStd, selectedSec, selectedDate, selectedSession]);

  // Handlers for Roll Call Marking
  const handleMarkStatus = (studentId: string, status: AttendanceRecord['status']) => {
    setRollCallDraft(prev => ({ ...prev, [studentId]: status }));
    if (status === 'late' && !arrivalTimes[studentId]) {
      setArrivalTimes(prev => ({ ...prev, [studentId]: '08:45 AM' }));
    }
    if (status === 'half_day' && !departureTimes[studentId]) {
      setDepartureTimes(prev => ({ ...prev, [studentId]: '12:30 PM' }));
    }
  };

  const handleBulkMarkPresent = () => {
    const newStatuses: Record<string, AttendanceRecord['status']> = { ...rollCallDraft };
    classStudents.forEach(s => {
      newStatuses[s.id] = 'present';
    });
    setRollCallDraft(newStatuses);
    showToast(`Marked all ${classStudents.length} students as Present. Click 'Save Draft' or 'Submit Attendance' to commit.`, 'info');
  };

  const handleBulkClear = () => {
    const newStatuses: Record<string, AttendanceRecord['status']> = { ...rollCallDraft };
    classStudents.forEach(s => {
      newStatuses[s.id] = 'not_marked';
    });
    setRollCallDraft(newStatuses);
    showToast('Cleared roll-call statuses for this session.', 'info');
  };

  const handleSaveDraft = () => {
    const records = classStudents.map(s => ({
      studentId: s.id,
      studentName: s.name,
      rollNo: s.rollNo,
      status: rollCallDraft[s.id] || 'not_marked',
      arrivalTime: arrivalTimes[s.id],
      departureTime: departureTimes[s.id],
      remarks: remarksDraft[s.id]
    }));

    saveAttendanceSession({
      standard: selectedStd,
      section: selectedSec,
      date: selectedDate,
      session: selectedSession,
      isDraft: true,
      records,
      submittedByName: currentRole === 'teacher_web' ? 'Mrs. Shalini Verma' : 'Prof. Marcus Vance'
    });
  };

  const handleSubmitAttendance = (force = false) => {
    const unmarked = classStudents.filter(s => !rollCallDraft[s.id] || rollCallDraft[s.id] === 'not_marked');
    if (unmarked.length > 0 && !force) {
      setUnmarkedModalOpen(true);
      return;
    }

    const records = classStudents.map(s => ({
      studentId: s.id,
      studentName: s.name,
      rollNo: s.rollNo,
      status: rollCallDraft[s.id] || 'not_marked',
      arrivalTime: arrivalTimes[s.id],
      departureTime: departureTimes[s.id],
      remarks: remarksDraft[s.id]
    }));

    saveAttendanceSession({
      standard: selectedStd,
      section: selectedSec,
      date: selectedDate,
      session: selectedSession,
      isDraft: false,
      records,
      submittedByName: currentRole === 'teacher_web' ? 'Mrs. Shalini Verma' : 'Prof. Marcus Vance'
    });
    setUnmarkedModalOpen(false);
  };

  // Correction Request Modal
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [correctionTargetStudent, setCorrectionTargetStudent] = useState<Student | null>(null);
  const [correctionForm, setCorrectionForm] = useState({
    requestedStatus: 'present' as AttendanceCorrectionRequest['requestedStatus'],
    reason: ''
  });

  const handleOpenCorrection = (student: Student) => {
    setCorrectionTargetStudent(student);
    setCorrectionForm({
      requestedStatus: 'present',
      reason: ''
    });
    setCorrectionModalOpen(true);
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionTargetStudent || !correctionForm.reason.trim()) {
      showToast('Please provide a substantive justification for the attendance correction.', 'error');
      return;
    }

    const original = rollCallDraft[correctionTargetStudent.id] || 'not_marked';

    submitCorrectionRequest({
      studentId: correctionTargetStudent.id,
      studentName: correctionTargetStudent.name,
      standard: selectedStd,
      section: selectedSec,
      date: selectedDate,
      session: selectedSession,
      originalStatus: original,
      requestedStatus: correctionForm.requestedStatus,
      reason: correctionForm.reason.trim(),
      requestedByRole: (currentRole || 'teacher_web') as RoleType,
      requestedByName: currentRole === 'teacher_web' ? 'Mrs. Shalini Verma' : 'Prof. Marcus Vance'
    });

    setCorrectionModalOpen(false);
  };

  // Review Correction Modal for Admin / VP
  const [reviewModalRequest, setReviewModalRequest] = useState<AttendanceCorrectionRequest | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');

  const handleExecuteReview = (status: 'approved' | 'rejected') => {
    if (!reviewModalRequest) return;
    reviewCorrectionRequest(
      reviewModalRequest.id,
      status,
      currentRole === 'principal' ? 'Dr. Evelyn Montgomery (Principal)' : 'Prof. Marcus Vance (Vice Principal)',
      reviewRemarks || undefined
    );
    setReviewModalRequest(null);
    setReviewRemarks('');
  };

  // Daily Operations: New Gate Pass / Movement Modal
  const [gatePassModalOpen, setGatePassModalOpen] = useState(false);
  const [viewingPass, setViewingPass] = useState<StudentMovementRecord | null>(null);
  const [gatePassForm, setGatePassForm] = useState({
    studentId: 'stu-101',
    type: 'late_arrival' as StudentMovementRecord['type'],
    time: '08:50 AM',
    reason: 'Heavy traffic on Eastern Express Highway school bus corridor.',
    category: 'Transport Delay' as StudentMovementRecord['category'],
    pickupPersonName: 'Dr. Rajesh Sharma',
    pickupPersonPhone: '+91 98765 43210',
    pickupRelationship: 'Father'
  });

  const handleGatePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = students.find(s => s.id === gatePassForm.studentId);
    if (!targetStudent) return;

    const newPass = logStudentMovement({
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      standard: targetStudent.standard,
      section: targetStudent.section,
      type: gatePassForm.type,
      date: selectedDate,
      time: gatePassForm.time,
      reason: gatePassForm.reason,
      category: gatePassForm.category,
      authorizedBy: currentRole === 'receptionist' ? 'Ms. Clara Martinez (Receptionist)' : 'Prof. Marcus Vance (VP)',
      pickupPersonName: gatePassForm.pickupPersonName || undefined,
      pickupPersonPhone: gatePassForm.pickupPersonPhone || undefined,
      pickupRelationship: gatePassForm.pickupRelationship || undefined,
      status: 'approved'
    });

    setGatePassModalOpen(false);
    setViewingPass(newPass);
  };

  // Leave Management Application Modal
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    staffId: 'tch-01',
    leaveType: 'Casual Leave' as StaffLeaveRequest['leaveType'],
    startDate: selectedDate,
    endDate: selectedDate,
    reason: 'Attending university academic symposium and curriculum workshop.',
    attachmentName: 'Symposium_Invitation.pdf'
  });

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = teachers.find(t => t.id === leaveForm.staffId);
    if (!staff) return;

    submitLeaveRequest(
      staff.id,
      staff.name,
      leaveForm.leaveType,
      leaveForm.startDate,
      leaveForm.endDate,
      leaveForm.reason,
      leaveForm.attachmentName
    );

    setLeaveModalOpen(false);
  };

  // Staff Attendance marking form state
  const [staffAttDate, setStaffAttDate] = useState<string>(selectedDate);
  const [staffDeptFilter, setStaffDeptFilter] = useState<string>('all');

  const filteredStaff = useMemo(() => {
    return teachers.filter(t => {
      if (staffDeptFilter === 'all') return true;
      return t.department === staffDeptFilter;
    });
  }, [teachers, staffDeptFilter]);

  // Real Working CSV Export Generator
  const handleExportCSV = (reportType: string) => {
    let csvContent = '';
    let filename = `SCHLAR_Attendance_${reportType}_${selectedDate}.csv`;

    if (reportType === 'daily_class') {
      csvContent = 'Admission No,Roll No,Student Name,Class,Status,Arrival Time,Departure Time,Remarks\n';
      classStudents.forEach(s => {
        const st = rollCallDraft[s.id] || 'not_marked';
        const arr = arrivalTimes[s.id] || '';
        const dep = departureTimes[s.id] || '';
        const rem = remarksDraft[s.id] || '';
        csvContent += `"${s.admissionNo}","${s.rollNo}","${s.name}","Std ${s.standard}-${s.section}","${st}","${arr}","${dep}","${rem.replace(/"/g, '""')}"\n`;
      });
    } else if (reportType === 'low_attendance') {
      csvContent = 'Admission No,Student Name,Class,Attendance Rate %,CBSE Status,Parent Contact\n';
      students.filter(s => s.attendanceRate < 85).forEach(s => {
        const risk = s.attendanceRate < 75 ? 'Critical (Board Exam Risk)' : 'At-Risk (Warning)';
        csvContent += `"${s.admissionNo}","${s.name}","Std ${s.standard}-${s.section}","${s.attendanceRate}%","${risk}","${s.parentPhone}"\n`;
      });
    } else if (reportType === 'gate_passes') {
      csvContent = 'Pass No,Date,Time,Student Name,Class,Type,Category,Authorized By,Reason\n';
      studentMovements.forEach(m => {
        csvContent += `"${m.passNo}","${m.date}","${m.time}","${m.studentName}","Std ${m.standard}-${m.section}","${m.type}","${m.category}","${m.authorizedBy}","${m.reason.replace(/"/g, '""')}"\n`;
      });
    } else if (reportType === 'staff_attendance') {
      csvContent = 'Emp ID,Staff Name,Department,Category,Status,Check-In,Check-Out,Remarks\n';
      teachers.forEach(t => {
        const rec = staffAttendance.find(sa => sa.staffId === t.id && sa.date === staffAttDate);
        const st = rec?.status || (t.employmentStatus === 'On Leave' ? 'on_leave' : 'present');
        csvContent += `"${t.empId}","${t.name}","${t.department}","${t.staffCategory}","${st}","${rec?.checkInTime || '07:50 AM'}","${rec?.checkOutTime || '03:45 PM'}","${rec?.remarks || ''}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filename} successfully.`, 'success');
  };

  // Quick live summary counts for selected class
  const classStats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let halfDay = 0;
    let excused = 0;
    let unmarked = 0;

    classStudents.forEach(s => {
      const st = rollCallDraft[s.id];
      if (st === 'present') present++;
      else if (st === 'absent') absent++;
      else if (st === 'late') late++;
      else if (st === 'half_day') halfDay++;
      else if (st === 'excused') excused++;
      else unmarked++;
    });

    const total = classStudents.length || 1;
    const effectivePresent = present + late + excused + halfDay * 0.5;
    const rate = Math.round((effectivePresent / total) * 100);

    return {
      present,
      absent,
      late,
      halfDay,
      excused,
      unmarked,
      total: classStudents.length,
      rate
    };
  }, [classStudents, rollCallDraft]);

  // Overall Schoolwide metrics for Dashboard
  const schoolwideMetrics = useMemo(() => {
    const totalEnrolled = students.filter(s => s.status === 'Active').length;
    const recordsOnDate = attendance.filter(a => a.date === selectedDate);
    const presentOnDate = recordsOnDate.filter(r => r.status === 'present').length;
    const absentOnDate = recordsOnDate.filter(r => r.status === 'absent').length;
    const lateOnDate = recordsOnDate.filter(r => r.status === 'late').length;
    const halfDayOnDate = recordsOnDate.filter(r => r.status === 'half_day').length;
    const excusedOnDate = recordsOnDate.filter(r => r.status === 'excused').length;
    const unmarkedEst = Math.max(0, totalEnrolled - recordsOnDate.length);

    const avgRate = (students.reduce((acc, s) => acc + s.attendanceRate, 0) / (students.length || 1)).toFixed(1);
    const criticalCount = students.filter(s => s.attendanceRate < 75).length;
    const warningCount = students.filter(s => s.attendanceRate >= 75 && s.attendanceRate < 85).length;
    const pendingCorrectionsCount = correctionRequests.filter(c => c.status === 'pending').length;

    return {
      totalEnrolled,
      presentOnDate,
      absentOnDate,
      lateOnDate,
      halfDayOnDate,
      excusedOnDate,
      unmarkedEst,
      avgRate,
      criticalCount,
      warningCount,
      pendingCorrectionsCount
    };
  }, [students, attendance, selectedDate, correctionRequests]);

  // Permissions check
  const isLeadership = currentRole === 'principal' || currentRole === 'vice_principal';
  const isTeacher = currentRole === 'teacher_web' || currentRole === 'teacher_mobile';
  const isFrontOffice = currentRole === 'receptionist';
  const isAccountant = currentRole === 'accountant';

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <span>Greenfield International School</span>
              <span>/</span>
              <span>Academic Operations</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">Attendance & Student Movement Master</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Attendance & Daily School Operations</span>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
                CBSE Compliant
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Official roll-call registry, real-time gate pass management, biometric staff attendance, leave governance, and audit trails
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isFrontOffice && (
              <button
                onClick={() => setGatePassModalOpen(true)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-all shadow-sm active:scale-95`}
              >
                <Plus className="w-4 h-4" />
                <span>Issue Student Gate Pass</span>
              </button>
            )}

            {isLeadership && (
              <button
                onClick={() => setLeaveModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                <CalendarDays className="w-4 h-4 text-slate-600" />
                <span>Apply Faculty Leave</span>
              </button>
            )}

            <button
              onClick={() => handleExportCSV(activeSubTab === 'daily_operations' ? 'gate_passes' : activeSubTab === 'staff_attendance' ? 'staff_attendance' : 'daily_class')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-2xs"
            >
              <FileDown className="w-4 h-4 text-slate-500" />
              <span>Export CSV Ledger</span>
            </button>
          </div>
        </div>

        {/* Workspace Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'dashboard' ? 'bg-slate-900 text-white shadow-xs' : 'hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Attendance Dashboard</span>
          </button>

          {!isAccountant && (
            <button
              onClick={() => setActiveSubTab('student_attendance')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeSubTab === 'student_attendance' ? 'bg-slate-900 text-white shadow-xs' : 'hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Class Roll-Call Register</span>
            </button>
          )}

          <button
            onClick={() => setActiveSubTab('staff_attendance')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'staff_attendance' ? 'bg-slate-900 text-white shadow-xs' : 'hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff Attendance</span>
          </button>

          {!isAccountant && (
            <button
              onClick={() => setActiveSubTab('corrections')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeSubTab === 'corrections' ? 'bg-slate-900 text-white shadow-xs' : 'hover:bg-slate-100'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Corrections & Approvals</span>
              {schoolwideMetrics.pendingCorrectionsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {schoolwideMetrics.pendingCorrectionsCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setActiveSubTab('daily_operations')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'daily_operations' ? 'bg-slate-900 text-white shadow-xs' : 'hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Gate Passes & Movement</span>
          </button>

          <button
            onClick={() => setActiveSubTab('leave_management')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'leave_management' ? 'bg-slate-900 text-white shadow-xs' : 'hover:bg-slate-100'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Staff Leave Desk</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reports')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'reports' ? 'bg-slate-900 text-white shadow-xs' : 'hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Reports & Exports</span>
          </button>

          {isLeadership && (
            <button
              onClick={() => setActiveSubTab('settings')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeSubTab === 'settings' ? 'bg-slate-900 text-white shadow-xs' : 'hover:bg-slate-100'
              }`}
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Policies & Rules</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: ATTENDANCE DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Top Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Analytics Scope:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 font-mono text-slate-800 bg-slate-50 focus:bg-white"
              />
              <select
                value={selectedAcademicYear}
                onChange={e => setSelectedAcademicYear(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-white"
              >
                <option value="2026–2027">AY 2026–2027 (Active)</option>
                <option value="2025–2026">AY 2025–2026 (Archived)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Showing records calculated live from shared database</span>
            </div>
          </div>

          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Strength</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-slate-900">{schoolwideMetrics.totalEnrolled}</span>
                <span className="text-[10px] font-bold text-slate-400">Enrolled</span>
              </div>
              <p className="text-[11px] text-slate-400">Across 20 sections</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs space-y-1 bg-emerald-50/20">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">Present Today</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-emerald-700">{schoolwideMetrics.presentOnDate}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  {Math.round((schoolwideMetrics.presentOnDate / (schoolwideMetrics.totalEnrolled || 1)) * 100)}%
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 font-medium">In classroom sessions</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs space-y-1 bg-rose-50/20">
              <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider block">Absences</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-rose-700">{schoolwideMetrics.absentOnDate}</span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">Unexcused</span>
              </div>
              <p className="text-[11px] text-rose-600 font-medium">Requires follow-up</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1 bg-amber-50/20">
              <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">Late Arrivals</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-amber-700">{schoolwideMetrics.lateOnDate}</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">Gate Passes</span>
              </div>
              <p className="text-[11px] text-amber-700 font-medium">After 08:30 AM bell</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-2xs space-y-1 bg-purple-50/20">
              <span className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider block">Excused / Leave</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-purple-700">{schoolwideMetrics.excusedOnDate + schoolwideMetrics.halfDayOnDate}</span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">Authorized</span>
              </div>
              <p className="text-[11px] text-purple-700 font-medium">Medical / Tour leave</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Campus Average</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-blue-700">{schoolwideMetrics.avgRate}%</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">Term 2</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Institutional standing</p>
            </div>
          </div>

          {/* Alerts & Critical Follow-ups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Critical Board Exam Risk List */}
            <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Critical CBSE Attendance Alert (&lt;75%)</h3>
                    <p className="text-[11px] text-rose-600">Students facing board examination debarment warning</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                  {schoolwideMetrics.criticalCount} Students
                </span>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {students.filter(s => s.attendanceRate < 75).length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No students currently below the critical 75% threshold.
                  </div>
                ) : (
                  students
                    .filter(s => s.attendanceRate < 75)
                    .map(student => (
                      <div
                        key={student.id}
                        className="p-2.5 rounded-xl border border-rose-100 bg-rose-50/30 flex items-center justify-between text-xs hover:bg-rose-50/70 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 font-bold flex items-center justify-center shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <button
                              onClick={() => setViewingStudent(student)}
                              className="font-bold text-slate-900 hover:text-blue-700 text-left"
                            >
                              {student.name}
                            </button>
                            <div className="text-[10px] text-slate-500 font-mono">
                              Std {student.standard}-{student.section} · Roll #{student.rollNo} · {student.parentPhone}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-rose-700 text-sm">{student.attendanceRate}%</span>
                          <span className="block text-[10px] text-rose-600">Notice Pending</span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Incomplete Class Roll-Calls */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                    <Clock className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Today's Class Roll-Call Completion</h3>
                    <p className="text-[11px] text-slate-500">Live submission status across standards for {selectedDate}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSubTab('student_attendance')}
                  className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
                >
                  <span>Open Register</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {[
                  { std: 8, sec: 'A', teacher: 'Mrs. Shalini Verma', count: 10, status: 'Submitted', rate: 90 },
                  { std: 8, sec: 'B', teacher: 'Mr. Arvind Saxena', count: 10, status: 'Draft Saved', rate: 85 },
                  { std: 9, sec: 'A', teacher: 'Mrs. Shalini Verma', count: 10, status: 'Submitted', rate: 95 },
                  { std: 9, sec: 'B', teacher: 'Mrs. Shalini Verma', count: 10, status: 'Not Started', rate: 0 },
                  { std: 10, sec: 'A', teacher: 'Dr. Alok Sen', count: 10, status: 'Submitted', rate: 98 }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        Std {item.std}-{item.sec} · {item.teacher}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.count} Enrolled students</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.status === 'Submitted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Draft Saved'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedClassStr(`${item.std}-${item.sec}`);
                          setActiveSubTab('student_attendance');
                        }}
                        className="p-1 text-slate-400 hover:text-blue-700"
                        title="Open class roll call"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: STUDENT ATTENDANCE (CLASS ROLL-CALL REGISTER) */}
      {activeSubTab === 'student_attendance' && (
        <div className="space-y-4">
          {/* Mode Switcher Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Display Layout:</span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setStudentAttendanceMode('period_matrix')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    studentAttendanceMode === 'period_matrix'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Period-Wise Matrix (Horizontal)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStudentAttendanceMode('session_register')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    studentAttendanceMode === 'session_register'
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Single Session Register</span>
                </button>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-mono hidden md:inline">
              {studentAttendanceMode === 'period_matrix' ? 'Period 1 to 6 scheduled matrix' : 'Individual session roll-call'}
            </span>
          </div>

          {studentAttendanceMode === 'period_matrix' ? (
            <PeriodAttendanceMatrix />
          ) : (
            <div className="space-y-4">
              {/* Controls Bar: Class, Session, Date */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Class selector */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  {['8-A', '8-B', '9-A', '9-B', '10-A', '5-B'].map(cls => (
                    <button
                      key={cls}
                      onClick={() => setSelectedClassStr(cls)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        selectedClassStr === cls
                          ? 'bg-white text-slate-900 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Class {cls}
                    </button>
                  ))}
                </div>

                {/* Session selector */}
                <select
                  value={selectedSession}
                  onChange={e => setSelectedSession(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 font-semibold text-slate-700 bg-white"
                >
                  <option value="morning">🌅 Morning Assembly Roll-Call</option>
                  <option value="afternoon">☀️ Afternoon Session</option>
                  <option value="period_1">📐 Period 1: Mathematics</option>
                  <option value="period_2">🔬 Period 2: Science</option>
                </select>

                {/* Date control */}
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 font-mono text-slate-700 bg-white"
                />
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                {currentSessionEntity?.status === 'submitted' ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Submitted by {currentSessionEntity.submittedBy || 'Class Teacher'}</span>
                  </span>
                ) : currentSessionEntity?.status === 'draft' ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Unsaved / Draft in Progress</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Not Yet Finalized</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Live Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-3 font-semibold">
                <span className="text-slate-600 font-bold">Session Strength: {classStats.total}</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Present: {classStats.present}</span>
                <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">Absent: {classStats.absent}</span>
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Late: {classStats.late}</span>
                <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">Excused: {classStats.excused}</span>
                {classStats.unmarked > 0 && (
                  <span className="text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md font-bold animate-pulse">
                    Unmarked: {classStats.unmarked}
                  </span>
                )}
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkMarkPresent}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark All Present</span>
                </button>
                <button
                  onClick={handleBulkClear}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-2xs"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handleSubmitAttendance(false)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-all shadow-sm active:scale-95`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Submit Attendance</span>
                </button>
              </div>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3.5 w-16 text-center">Roll #</th>
                    <th className="py-3 px-4">Student Dossier</th>
                    <th className="py-3 px-3">Cumulative Rate</th>
                    <th className="py-3 px-4 text-center">Session Roll-Call Status</th>
                    <th className="py-3 px-4">Timing & Permitted Remarks</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {classStudents.map(student => {
                    const status = rollCallDraft[student.id] || 'not_marked';
                    const isAtRisk = student.attendanceRate < 85;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3.5 text-center font-mono font-bold text-slate-900">
                          #{student.rollNo}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                              status === 'absent' ? 'bg-rose-100 text-rose-800' :
                              status === 'late' ? 'bg-amber-100 text-amber-800' :
                              status === 'half_day' ? 'bg-sky-100 text-sky-800' :
                              status === 'excused' ? 'bg-purple-100 text-purple-800' :
                              'bg-slate-200 text-slate-600'
                            }`}>
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <button
                                onClick={() => setViewingStudent(student)}
                                className="font-bold text-slate-900 hover:text-blue-700 flex items-center gap-1 text-left"
                              >
                                <span>{student.name}</span>
                                {isAtRisk && (
                                  <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1 rounded">
                                    At-Risk
                                  </span>
                                )}
                              </button>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {student.admissionNo} · Guardian: {student.parentName}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono">
                          <span className={`font-bold ${
                            student.attendanceRate >= 90 ? 'text-emerald-700' :
                            student.attendanceRate >= 80 ? 'text-blue-700' : 'text-rose-700'
                          }`}>
                            {student.attendanceRate}%
                          </span>
                        </td>

                        {/* Status Toggle Buttons */}
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1 bg-slate-100/90 p-1 rounded-xl w-fit mx-auto border border-slate-200/60">
                            <button
                              type="button"
                              onClick={() => handleMarkStatus(student.id, 'present')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                status === 'present'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:bg-slate-200'
                              }`}
                              title="Present"
                            >
                              P
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkStatus(student.id, 'absent')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                status === 'absent'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:bg-slate-200'
                              }`}
                              title="Absent"
                            >
                              A
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkStatus(student.id, 'late')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                status === 'late'
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:bg-slate-200'
                              }`}
                              title="Late Arrival"
                            >
                              L
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkStatus(student.id, 'half_day')}
                              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                                status === 'half_day'
                                  ? 'bg-sky-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:bg-slate-200'
                              }`}
                              title="Half Day"
                            >
                              HD
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkStatus(student.id, 'excused')}
                              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                                status === 'excused'
                                  ? 'bg-purple-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:bg-slate-200'
                              }`}
                              title="Excused Absence / Tour"
                            >
                              Exc
                            </button>
                          </div>
                        </td>

                        {/* Timing & Remarks input */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            {status === 'late' && (
                              <input
                                type="text"
                                placeholder="Time (08:45 AM)"
                                value={arrivalTimes[student.id] || ''}
                                onChange={e => setArrivalTimes({ ...arrivalTimes, [student.id]: e.target.value })}
                                className="w-24 text-[11px] font-mono py-1 px-2 rounded-lg border border-amber-300 bg-amber-50/50"
                              />
                            )}
                            {status === 'half_day' && (
                              <input
                                type="text"
                                placeholder="Dep. Time"
                                value={departureTimes[student.id] || ''}
                                onChange={e => setDepartureTimes({ ...departureTimes, [student.id]: e.target.value })}
                                className="w-24 text-[11px] font-mono py-1 px-2 rounded-lg border border-sky-300 bg-sky-50/50"
                              />
                            )}
                            <input
                              type="text"
                              placeholder="Reason / Excuse note..."
                              value={remarksDraft[student.id] || ''}
                              onChange={e => setRemarksDraft({ ...remarksDraft, [student.id]: e.target.value })}
                              className="w-full text-xs py-1 px-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                            />
                          </div>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenCorrection(student)}
                              className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Request Formal Correction"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setViewingStudent(student)}
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Student Dossier"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: STAFF ATTENDANCE */}
      {activeSubTab === 'staff_attendance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Date:</span>
              <input
                type="date"
                value={staffAttDate}
                onChange={e => setStaffAttDate(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 font-mono text-slate-800 bg-slate-50"
              />
              <span className="text-xs font-bold text-slate-700 ml-2">Department:</span>
              <select
                value={staffDeptFilter}
                onChange={e => setStaffDeptFilter(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-white"
              >
                <option value="all">All Departments ({teachers.length})</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English & Literature">English</option>
                <option value="Social Science">Social Science</option>
                <option value="Administration">Administration</option>
                <option value="Front Office">Front Office</option>
                <option value="Library">Library</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const bulk = filteredStaff.map(t => ({
                    staffId: t.id,
                    staffName: t.name,
                    empId: t.empId,
                    department: t.department,
                    staffCategory: t.staffCategory,
                    date: staffAttDate,
                    status: 'present' as StaffAttendanceRecord['status'],
                    checkInTime: '07:50 AM',
                    checkOutTime: '03:45 PM',
                    markedBy: 'Front Desk Biometric'
                  }));
                  bulkMarkStaffAttendance(bulk);
                }}
                className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all"
              >
                Mark All Present ({filteredStaff.length})
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3.5">Employee ID</th>
                    <th className="py-3 px-4">Faculty / Staff Member</th>
                    <th className="py-3 px-3">Department & Role</th>
                    <th className="py-3 px-3">Check-In / Out</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Remarks / Leave Integration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStaff.map(staff => {
                    const existing = staffAttendance.find(sa => sa.staffId === staff.id && sa.date === staffAttDate);
                    const activeLeave = leaveRequests.find(
                      l => l.staffId === staff.id && l.status === 'approved' && staffAttDate >= l.startDate && staffAttDate <= l.endDate
                    );
                    const currentStatus = activeLeave ? 'on_leave' : existing?.status || 'present';

                    return (
                      <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3.5 font-mono font-bold text-slate-900">{staff.empId}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{staff.name}</div>
                          <div className="text-[11px] text-slate-400">{staff.designation}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-800">{staff.department}</span>
                          <span className="block text-[10px] text-slate-400 font-mono">{staff.staffCategory}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                          {existing?.checkInTime || '07:50 AM'} - {existing?.checkOutTime || '03:45 PM'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase inline-block ${
                              currentStatus === 'present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : currentStatus === 'on_leave'
                                ? 'bg-purple-100 text-purple-800'
                                : currentStatus === 'late'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {currentStatus === 'on_leave' ? 'Approved Leave' : currentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {activeLeave ? (
                            <span className="text-purple-700 font-semibold text-[11px]">
                              {activeLeave.leaveType}: {activeLeave.reason}
                            </span>
                          ) : (
                            <span>{existing?.remarks || 'Biometric gate verified'}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CORRECTIONS & APPROVALS WORKFLOW */}
      {activeSubTab === 'corrections' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Attendance Correction & Reconciliation Queue</h3>
                <p className="text-xs text-slate-500">
                  Audited workflow for rectifying erroneously logged absences or status disputes
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                {correctionRequests.length} Total Requests
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Req ID</th>
                    <th className="py-3 px-4">Student & Class</th>
                    <th className="py-3 px-3">Date & Session</th>
                    <th className="py-3 px-3">Original &rarr; Requested</th>
                    <th className="py-3 px-4">Reason / Evidence</th>
                    <th className="py-3 px-3">Requester</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    {isLeadership && <th className="py-3 px-3 text-right">Review Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {correctionRequests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{req.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{req.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Std {req.standard}-{req.section}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {req.date} · <span className="capitalize">{req.session}</span>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="uppercase text-rose-700 font-semibold">{req.originalStatus}</span>
                        <span className="mx-1 text-slate-400">&rarr;</span>
                        <span className="uppercase text-emerald-700 font-bold">{req.requestedStatus}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs">{req.reason}</td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800">{req.requestedByName}</span>
                        <span className="block text-[10px] text-slate-400 font-mono capitalize">
                          {req.requestedByRole.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            req.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      {isLeadership && (
                        <td className="py-3 px-3 text-right">
                          {req.status === 'pending' ? (
                            <button
                              onClick={() => {
                                setReviewModalRequest(req);
                                setReviewRemarks('');
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              Decide
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Reviewed by {req.reviewedBy}
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: DAILY OPERATIONS (GATE PASSES & STUDENT MOVEMENT) */}
      {activeSubTab === 'daily_operations' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Filter Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 font-mono text-slate-800 bg-slate-50"
              />
            </div>

            <button
              onClick={() => setGatePassModalOpen(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-all shadow-sm active:scale-95`}
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Movement Pass</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3.5">Gate Pass #</th>
                    <th className="py-3 px-4">Student Dossier</th>
                    <th className="py-3 px-3">Date & Time</th>
                    <th className="py-3 px-3">Movement Type</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-4">Reason / Pickup Guardian</th>
                    <th className="py-3 px-3">Authorized By</th>
                    <th className="py-3 px-3 text-right">Slip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {studentMovements.map(mov => (
                    <tr key={mov.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900">{mov.passNo}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{mov.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Std {mov.standard}-{mov.section}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {mov.date} · <strong>{mov.time}</strong>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            mov.type === 'late_arrival'
                              ? 'bg-amber-100 text-amber-800'
                              : mov.type === 'early_departure'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {mov.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{mov.category}</td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs">
                        <div>{mov.reason}</div>
                        {mov.pickupPersonName && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Pickup: {mov.pickupPersonName} ({mov.pickupRelationship}) · {mov.pickupPersonPhone}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{mov.authorizedBy}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setViewingPass(mov)}
                          className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Digital Pass Slip"
                        >
                          <Eye className="w-4 h-4" />
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

      {/* SUB-TAB 6: STAFF LEAVE MANAGEMENT */}
      {activeSubTab === 'leave_management' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Faculty & Staff Leave Applications</h3>
              <p className="text-xs text-slate-500">Official leave tracking with automatic attendance synchronization</p>
            </div>
            <button
              onClick={() => setLeaveModalOpen(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-all shadow-sm active:scale-95`}
            >
              <Plus className="w-4 h-4" />
              <span>Apply Leave</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3.5">Leave ID</th>
                    <th className="py-3 px-4">Faculty Member</th>
                    <th className="py-3 px-3">Leave Type</th>
                    <th className="py-3 px-3">Date Range</th>
                    <th className="py-3 px-2 text-center">Days</th>
                    <th className="py-3 px-4">Reason & Evidence</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {leaveRequests.map(lvr => (
                    <tr key={lvr.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900">{lvr.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{lvr.staffName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Applied: {lvr.appliedAt}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{lvr.leaveType}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {lvr.startDate} &rarr; {lvr.endDate}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold">{lvr.daysCount}</td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs">
                        <div>{lvr.reason}</div>
                        {lvr.attachmentName && (
                          <span className="text-[10px] text-blue-700 font-mono block mt-0.5">
                            📎 {lvr.attachmentName} ({lvr.attachmentSize || '1.2 MB'})
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            lvr.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lvr.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : lvr.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {lvr.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {isLeadership && lvr.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => approveLeaveRequest(lvr.id, 'Dr. Evelyn Montgomery', 'Approved')}
                              className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectLeaveRequest(lvr.id, 'Dr. Evelyn Montgomery', 'Academic conflicts')}
                              className="px-2.5 py-1 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : lvr.status === 'pending' ? (
                          <button
                            onClick={() => cancelLeaveRequest(lvr.id)}
                            className="text-xs text-rose-600 hover:underline"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            {lvr.reviewedBy ? `Reviewed by ${lvr.reviewedBy}` : 'Concluded'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: REPORTS & EXPORTS */}
      {activeSubTab === 'reports' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Daily Class Attendance Summary</h4>
                  <p className="text-[11px] text-slate-500">Full roster breakdown for selected class and date</p>
                </div>
              </div>
              <button
                onClick={() => handleExportCSV('daily_class')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV ({selectedClassStr})</span>
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-2xs space-y-3 bg-rose-50/10">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-100 text-rose-700">
                  <AlertTriangle className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">CBSE Attendance Risk Report</h4>
                  <p className="text-[11px] text-rose-600">All students below 85% and 75% thresholds</p>
                </div>
              </div>
              <button
                onClick={() => handleExportCSV('low_attendance')}
                className="w-full py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export At-Risk Report CSV</span>
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
                  <Clock className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Daily Gate Pass & Movement Log</h4>
                  <p className="text-[11px] text-slate-500">Late arrivals and early departures ledger</p>
                </div>
              </div>
              <button
                onClick={() => handleExportCSV('gate_passes')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Gate Passes CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 8: ATTENDANCE SETTINGS */}
      {activeSubTab === 'settings' && isLeadership && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-slate-900">Configurable Attendance Rules & CBSE Parameters</h3>
            <p className="text-xs text-slate-500">Institutional thresholds and roll-call validation policies</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <span className="font-bold text-slate-900 block">Late Arrival Cut-Off Time</span>
                <span className="text-slate-500">Arrivals after this time require a Gate Pass entry</span>
              </div>
              <input
                type="text"
                value={attendanceSettings.lateCutoffTime}
                onChange={e => updateAttendanceSettings({ lateCutoffTime: e.target.value })}
                className="w-24 text-center font-mono font-bold py-1 px-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <span className="font-bold text-slate-900 block">CBSE Critical Warning Threshold (%)</span>
                <span className="text-slate-500">Generates formal exam debarment notifications below this percentage</span>
              </div>
              <input
                type="number"
                value={attendanceSettings.warningAttendancePercent}
                onChange={e => updateAttendanceSettings({ warningAttendancePercent: Number(e.target.value) })}
                className="w-24 text-center font-mono font-bold py-1 px-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <span className="font-bold text-slate-900 block">Attendance Rate Formula Mode</span>
                <span className="text-slate-500">Defines how late, excused, and half-day sessions contribute to aggregate percentage</span>
              </div>
              <select
                value={attendanceSettings.attendanceRateFormula}
                onChange={e => updateAttendanceSettings({ attendanceRateFormula: e.target.value as 'cbse_standard' | 'strict_present_only' })}
                className="py-1 px-3 border border-slate-200 rounded-lg font-semibold"
              >
                <option value="cbse_standard">CBSE Standard (Late & Excused count full, Half Day counts 0.5)</option>
                <option value="strict_present_only">Strict (Only Present counts)</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-bold text-slate-900 block">Mandatory Absence Reason Requirement</span>
                <span className="text-slate-500">Teachers must provide an explanation note when logging unexcused absences</span>
              </div>
              <input
                type="checkbox"
                checked={attendanceSettings.requireRemarkForAbsence}
                onChange={e => updateAttendanceSettings({ requireRemarkForAbsence: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UNMARKED STUDENTS REVIEW WARNING */}
      {unmarkedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-700">
              <span className="p-2 rounded-xl bg-amber-100">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900">Unmarked Students Detected</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              There are <strong className="text-slate-900">{classStats.unmarked} student(s)</strong> whose attendance status remains "Not Marked". School regulations recommend reviewing all students before formal submission.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setUnmarkedModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Return & Review
              </button>
              <button
                onClick={() => handleSubmitAttendance(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FORMAL ATTENDANCE CORRECTION REQUEST */}
      {correctionModalOpen && correctionTargetStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Request Attendance Correction</h3>
              <button onClick={() => setCorrectionModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCorrectionSubmit} className="space-y-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Student:</span>
                <span className="font-bold text-slate-900 block text-sm">{correctionTargetStudent.name}</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Admission #{correctionTargetStudent.admissionNo} · Std {selectedStd}-{selectedSec}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Date & Session:</label>
                <div className="font-mono text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  {selectedDate} · <span className="capitalize">{selectedSession}</span> (Current status:{' '}
                  <strong className="uppercase">{rollCallDraft[correctionTargetStudent.id] || 'not_marked'}</strong>)
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Requested Corrected Status:</label>
                <select
                  value={correctionForm.requestedStatus}
                  onChange={e => setCorrectionForm({ ...correctionForm, requestedStatus: e.target.value as any })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 font-semibold text-slate-800"
                >
                  <option value="present">Present</option>
                  <option value="late">Late Arrival</option>
                  <option value="half_day">Half Day</option>
                  <option value="excused">Excused Absence</option>
                  <option value="absent">Absent</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Substantive Justification / Evidence:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Student arrived at 08:52 AM via Route 14 bus with Gate Pass #GP-2026-101. Was incorrectly flagged absent before gate arrival sync."
                  value={correctionForm.reason}
                  onChange={e => setCorrectionForm({ ...correctionForm, reason: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCorrectionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-bold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADMIN REVIEW CORRECTION */}
      {reviewModalRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Administrative Correction Adjudication</h3>
              <button onClick={() => setReviewModalRequest(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">{reviewModalRequest.studentName}</div>
                <div className="text-slate-500 font-mono">
                  {reviewModalRequest.date} · Std {reviewModalRequest.standard}-{reviewModalRequest.section}
                </div>
                <div className="text-slate-700 pt-1">
                  Requested Change: <strong className="uppercase text-rose-700">{reviewModalRequest.originalStatus}</strong>{' '}
                  &rarr; <strong className="uppercase text-emerald-700">{reviewModalRequest.requestedStatus}</strong>
                </div>
                <div className="text-slate-600 italic pt-1">"{reviewModalRequest.reason}"</div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Administrative Remarks / Decision Note:</label>
                <input
                  type="text"
                  placeholder="e.g. Verified with Route 14 bus monitor logs."
                  value={reviewRemarks}
                  onChange={e => setReviewRemarks(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleExecuteReview('rejected')}
                  className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl"
                >
                  Decline Request
                </button>
                <button
                  type="button"
                  onClick={() => handleExecuteReview('approved')}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs"
                >
                  Approve & Ratify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW GATE PASS (DAILY OPERATIONS) */}
      {gatePassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Issue Student Movement & Gate Pass</h3>
                <p className="text-[11px] text-slate-500">Official security clearance slip for late entry or early dismissal</p>
              </div>
              <button onClick={() => setGatePassModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGatePassSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Student:</label>
                  <select
                    value={gatePassForm.studentId}
                    onChange={e => {
                      const sid = e.target.value;
                      const s = students.find(stu => stu.id === sid);
                      setGatePassForm({
                        ...gatePassForm,
                        studentId: sid,
                        pickupPersonName: s?.parentName || '',
                        pickupPersonPhone: s?.parentPhone || ''
                      });
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-semibold"
                  >
                    {students.slice(0, 30).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} (Std {s.standard}-{s.section})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Movement Type:</label>
                  <select
                    value={gatePassForm.type}
                    onChange={e => setGatePassForm({ ...gatePassForm, type: e.target.value as any })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-semibold"
                  >
                    <option value="late_arrival">Late Arrival Entry</option>
                    <option value="early_departure">Authorized Early Dismissal</option>
                    <option value="temporary_pass">Temporary Pass (Clinic / Event)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time of Gate Transit:</label>
                  <input
                    type="text"
                    value={gatePassForm.time}
                    onChange={e => setGatePassForm({ ...gatePassForm, time: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category:</label>
                  <select
                    value={gatePassForm.category}
                    onChange={e => setGatePassForm({ ...gatePassForm, category: e.target.value as any })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-semibold"
                  >
                    <option value="Transport Delay">Transport Delay</option>
                    <option value="Medical">Medical / Health Clinic</option>
                    <option value="Family Emergency">Family Emergency</option>
                    <option value="School Event">School Event / Deputation</option>
                    <option value="Other">Other Verified Reason</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason / Notes:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flight delay / Dental consultation at Apollo Dental."
                  value={gatePassForm.reason}
                  onChange={e => setGatePassForm({ ...gatePassForm, reason: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200"
                />
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-800 block mb-2">Escort / Authorized Guardian Details:</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={gatePassForm.pickupPersonName}
                    onChange={e => setGatePassForm({ ...gatePassForm, pickupPersonName: e.target.value })}
                    className="py-1.5 px-2.5 rounded-lg border border-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Relationship"
                    value={gatePassForm.pickupRelationship}
                    onChange={e => setGatePassForm({ ...gatePassForm, pickupRelationship: e.target.value })}
                    className="py-1.5 px-2.5 rounded-lg border border-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={gatePassForm.pickupPersonPhone}
                    onChange={e => setGatePassForm({ ...gatePassForm, pickupPersonPhone: e.target.value })}
                    className="py-1.5 px-2.5 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGatePassModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-bold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  Issue Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW DIGITAL GATE PASS SLIP */}
      {viewingPass && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="text-center border-b border-slate-200 pb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Greenfield International School
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">OFFICIAL GATE PASS</h3>
              <span className="inline-block mt-1 text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
                {viewingPass.passNo}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Student Name:</span>
                <span className="font-bold text-slate-900">{viewingPass.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Class & Section:</span>
                <span className="font-mono font-bold">Std {viewingPass.standard}-{viewingPass.section}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Transit Date & Time:</span>
                <span className="font-mono">{viewingPass.date} · {viewingPass.time}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Transit Type:</span>
                <span className="font-bold uppercase text-blue-700">{viewingPass.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Reason:</span>
                <span className="text-right max-w-[180px] font-medium">{viewingPass.reason}</span>
              </div>
              {viewingPass.pickupPersonName && (
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Authorized Escort:</span>
                  <span className="font-medium">{viewingPass.pickupPersonName} ({viewingPass.pickupRelationship})</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Authorized Officer:</span>
                <span className="font-medium text-slate-800">{viewingPass.authorizedBy}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => {
                  showToast(`Sending print command for Gate Pass ${viewingPass.passNo}...`, 'info');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
              <button
                onClick={() => setViewingPass(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: STAFF LEAVE APPLICATION */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Apply for Staff Leave</h3>
              <button onClick={() => setLeaveModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Staff Member:</label>
                <select
                  value={leaveForm.staffId}
                  onChange={e => setLeaveForm({ ...leaveForm, staffId: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 font-semibold"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department} - {t.empId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Leave Category:</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={e => setLeaveForm({ ...leaveForm, leaveType: e.target.value as any })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 font-semibold"
                >
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Sick Leave">Sick / Medical Leave (ML)</option>
                  <option value="Academic / Duty Leave">Academic / On-Duty Leave (OD)</option>
                  <option value="Maternity / Paternity">Maternity / Paternity</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date:</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Date:</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason / Purpose:</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Specify academic or personal necessity..."
                  value={leaveForm.reason}
                  onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Supporting Document Attachment:</label>
                <input
                  type="text"
                  placeholder="Document filename (e.g. Medical_Certificate.pdf)"
                  value={leaveForm.attachmentName}
                  onChange={e => setLeaveForm({ ...leaveForm, attachmentName: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLeaveModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-bold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT PROFILE DOSSIER MODAL */}
      <StudentProfileModal
        isOpen={Boolean(viewingStudent)}
        onClose={() => setViewingStudent(null)}
        student={viewingStudent}
        initialTab="attendance"
      />
    </div>
  );
};
