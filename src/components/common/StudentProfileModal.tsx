import React, { useState, useMemo } from 'react';
import {
  X,
  User,
  GraduationCap,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Award,
  CreditCard,
  FileText,
  Phone,
  Mail,
  MapPin,
  Heart,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Edit2,
  Printer,
  ChevronRight,
  Receipt,
  AlertCircle,
  ArrowRightLeft,
  Download
} from 'lucide-react';
import { Student, FeeInvoice, FeeConcession } from '../../types/school';
import { useSchool } from '../../context/SchoolContext';
import { getThemeClasses } from '../../utils/themeHelper';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onEdit?: (student: Student) => void;
  initialTab?: 'overview' | 'guardians' | 'academics' | 'attendance' | 'marks' | 'fees' | 'documents' | 'timeline';
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  onEdit,
  initialTab = 'overview'
}) => {
  const {
    currentRole,
    themeColor,
    teachers,
    attendance,
    studentMovements,
    correctionRequests,
    marks,
    fees,
    feeConcessions,
    transfers,
    updateStudent,
    showToast
  } = useSchool();

  const [attendanceDateRange, setAttendanceDateRange] = useState<'all' | '30days' | '7days'>('all');

  const [activeTab, setActiveTab] = useState<'overview' | 'guardians' | 'academics' | 'attendance' | 'marks' | 'fees' | 'documents' | 'timeline'>(initialTab);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<Student['status']>('Active');
  const [statusReason, setStatusReason] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState<FeeInvoice | null>(null);

  // Sync initial tab when student changes
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, student?.id]);

  if (!isOpen || !student) return null;

  const themeClasses = getThemeClasses(themeColor);

  // Permissions
  const canEdit = currentRole === 'principal' || currentRole === 'admin' || currentRole === 'vice_principal' || currentRole === 'receptionist';
  const canChangeStatus = currentRole === 'principal' || currentRole === 'admin';
  const canViewFinances = currentRole === 'principal' || currentRole === 'admin' || currentRole === 'vice_principal' || currentRole === 'accountant';
  const isTeacher = currentRole === 'teacher_web' || currentRole === 'teacher_mobile';

  // Associated Data
  const classTeacher = teachers.find(t => t.classTeacherOf === `${student.standard}-${student.section}`);
  const studentAttendance = attendance.filter(a => a.studentId === student.id);
  const studentMovementsList = useMemo(() => studentMovements.filter(m => m.studentId === student.id), [studentMovements, student.id]);
  const studentCorrectionsList = useMemo(() => correctionRequests.filter(c => c.studentId === student.id), [correctionRequests, student.id]);

  const filteredAttendance = useMemo(() => {
    if (attendanceDateRange === '7days') return studentAttendance.slice(0, 7);
    if (attendanceDateRange === '30days') return studentAttendance.slice(0, 30);
    return studentAttendance;
  }, [studentAttendance, attendanceDateRange]);

  const attPresentCount = filteredAttendance.filter(a => a.status === 'present').length;
  const attAbsentCount = filteredAttendance.filter(a => a.status === 'absent').length;
  const attLateCount = filteredAttendance.filter(a => a.status === 'late').length;
  const attExcusedCount = filteredAttendance.filter(a => a.status === 'excused').length;
  const attHalfDayCount = filteredAttendance.filter(a => a.status === 'half_day').length;
  const isSensitiveRoleRestricted = currentRole === 'accountant' || currentRole === 'librarian';
  const studentMarks = marks.filter(m => m.studentId === student.id);
  const studentFees = fees.filter(f => f.studentId === student.id || f.studentName.toLowerCase() === student.name.toLowerCase());
  const studentConcessions = useMemo(() => {
    return feeConcessions.filter(c => c.studentId === student.id && c.status === 'active');
  }, [feeConcessions, student.id]);

  const feeLedgerSummary = useMemo(() => {
    const totalBilled = studentFees.reduce((acc, f) => acc + f.amount, 0);
    const totalPaid = studentFees.reduce((acc, f) => acc + (f.paidAmount || (f.status === 'paid' ? f.amount : 0)), 0);
    const totalOutstanding = studentFees.reduce((acc, f) => acc + (f.status === 'paid' ? 0 : (f.remainingBalance ?? f.amount)), 0);
    const totalConcessions = studentConcessions.reduce((acc, c) => acc + c.calculatedDeduction, 0);
    return { totalBilled, totalPaid, totalOutstanding, totalConcessions };
  }, [studentFees, studentConcessions]);
  const studentTransfers = transfers.filter(t => t.studentId === student.id);

  // Stats calculation
  const totalMarks = studentMarks.reduce((acc, m) => acc + m.marksObtained, 0);
  const maxPossibleMarks = studentMarks.reduce((acc, m) => acc + m.maxMarks, 0);
  const marksAvg = maxPossibleMarks > 0 ? ((totalMarks / maxPossibleMarks) * 100).toFixed(1) : null;

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleStatusChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusReason.trim()) {
      showToast('Please provide an administrative reason for the lifecycle status transition.', 'warning');
      return;
    }
    updateStudent(student.id, { status: newStatus });
    setShowStatusModal(false);
    setStatusReason('');
  };

  const handleSimulatePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      showToast(`Student dossier for ${student.name} (${student.admissionNo}) exported for official documentation.`, 'success');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/90 overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 font-bold text-sm">
              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{student.name}</h2>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  {student.admissionNo}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Standard {student.standard}-{student.section}</span>
                <span>·</span>
                <span>Roll #{student.rollNo}</span>
                <span>·</span>
                <span className="text-slate-300">Greenfield International School</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(student);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit Dossier</span>
              </button>
            )}

            <button
              onClick={handleSimulatePrint}
              disabled={isPrinting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              title="Print or export student dossier"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isPrinting ? 'Exporting...' : 'Export'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Highlights Ribbon */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Status:</span>
              <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] uppercase ${
                student.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : student.status === 'Transferred'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : student.status === 'Graduated'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {student.status}
              </span>
              {canChangeStatus && (
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="text-[10px] text-blue-600 hover:underline font-semibold ml-1"
                >
                  Change
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Attendance:</span>
              <span className="font-bold text-slate-900 tabular-nums">{student.attendanceRate}%</span>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${student.attendanceRate >= 90 ? 'bg-emerald-500' : student.attendanceRate >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`}
                  style={{ width: `${student.attendanceRate}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Fee Ledger:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                student.feeStatus === 'paid'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : student.feeStatus === 'pending'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {student.feeStatus}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Blood Group:</span>
              <span className="font-bold text-slate-800 px-1.5 py-0.5 rounded bg-slate-200/70 font-mono text-[11px]">
                {student.bloodGroup}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            Enrolled: <span className="font-medium text-slate-700">{student.admissionDate}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 border-b border-slate-200 overflow-x-auto bg-white shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal & Medical</span>
          </button>

          <button
            onClick={() => setActiveTab('guardians')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'guardians'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Family & Guardians</span>
          </button>

          <button
            onClick={() => setActiveTab('academics')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'academics'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Placement</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'attendance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Attendance Log ({studentAttendance.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('marks')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'marks'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Exams & Marks ({studentMarks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'fees'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Fee Ledger</span>
            {!canViewFinances && (
              <span className="text-[10px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-mono">RBAC</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documents ({student.documentsSubmitted?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'timeline'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Lifecycle History</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">

          {/* TAB 1: OVERVIEW & MEDICAL */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Health and Medical Alerts Banner */}
              {student.medicalAlerts ? (
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/70 flex items-start gap-3">
                  <Heart className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">Health & Medical Alert on File</h4>
                    <p className="text-xs text-rose-800 mt-0.5 font-medium leading-relaxed">
                      {student.medicalAlerts}
                    </p>
                    <p className="text-[11px] text-rose-600 mt-1">
                      Staff must notify the school infirmary immediately in the event of an allergic or respiratory episode.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs text-emerald-800 font-medium">
                    No chronic medical conditions or severe food allergies recorded in health dossier.
                  </span>
                </div>
              )}

              {/* Personal Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Demographic Information
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Full Legal Name:</span>
                      <span className="font-semibold text-slate-900">{student.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Gender:</span>
                      <span className="font-medium text-slate-800">{student.gender}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Date of Birth:</span>
                      <span className="font-medium text-slate-800 font-mono">
                        {student.dob} ({calculateAge(student.dob)} years old)
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Blood Group:</span>
                      <span className="font-bold text-slate-900 font-mono">{student.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Nationality:</span>
                      <span className="font-medium text-slate-800">Indian</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Admission & Address Registry
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Admission Number:</span>
                      <span className="font-bold font-mono text-slate-900">{student.admissionNo}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Admission Date:</span>
                      <span className="font-medium text-slate-800 font-mono">{student.admissionDate}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Residential Address:</span>
                      <span className="font-medium text-slate-800 text-right max-w-[220px] leading-tight">
                        {student.address}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">School Bus Transport:</span>
                      <span className="font-medium text-blue-700">Route 14 (Greenfield Sector 8)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GUARDIANS & CONTACTS */}
          {activeTab === 'guardians' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primary Guardian Card */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                        P1
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Primary Guardian (Authorized)
                      </h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                      {student.parentRelationship || 'Father'}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <div className="text-slate-400 text-[11px]">Guardian Full Name</div>
                      <div className="text-sm font-bold text-slate-900">{student.parentName}</div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone:
                      </span>
                      <a
                        href={`tel:${student.parentPhone}`}
                        className="font-mono font-semibold text-blue-600 hover:underline"
                      >
                        {student.parentPhone}
                      </a>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
                      </span>
                      <a
                        href={`mailto:${student.parentEmail}`}
                        className="font-medium text-blue-600 hover:underline truncate max-w-[200px]"
                      >
                        {student.parentEmail}
                      </a>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Legal Custody:</span>
                      <span className="font-semibold text-emerald-700">Joint Parental Custody</span>
                    </div>
                  </div>
                </div>

                {/* Secondary Guardian & Emergency */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                        P2
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Secondary & Emergency Contact
                      </h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                      {student.secondaryGuardianRelationship || 'Mother'}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <div className="text-slate-400 text-[11px]">Secondary Guardian Name</div>
                      <div className="text-sm font-semibold text-slate-900">
                        {student.secondaryGuardianName || 'Mrs. Sunita ' + student.name.split(' ').slice(1).join(' ')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> Secondary Contact:
                      </span>
                      <span className="font-mono text-slate-800">
                        {student.secondaryGuardianPhone || student.emergencyContact}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wide">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Campus Emergency Protocol
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        In medical emergencies, call Primary ({student.parentPhone}). If unreachable within 5 minutes, proceed to Emergency ({student.emergencyContact}).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACADEMIC PLACEMENT */}
          {activeTab === 'academics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase">Current Class Allocation</div>
                  <div className="text-2xl font-bold text-slate-900">
                    Standard {student.standard}-{student.section}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">Roll Number #{student.rollNo}</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase">Assigned Class Teacher</div>
                  <div className="text-base font-bold text-slate-900 truncate">
                    {classTeacher?.name || 'Class Mentor Unassigned'}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {classTeacher?.email || 'faculty@greenfield.edu'}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase">Academic Standing</div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {marksAvg ? `${marksAvg}% Avg` : 'Active Term'}
                  </div>
                  <div className="text-xs text-slate-500">Academic Year 2026–2027</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Enrolled Subjects (CBSE Curriculum)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {['Mathematics', 'Science (Physics/Chem/Bio)', 'English Language & Lit', 'Social Science', 'Hindi / Regional Language', 'Computer Applications', 'Physical Education', 'Art & Design'].map((sub, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-medium text-slate-800 text-[11px] truncate">{sub}</span>
                    </div>
                  ))}
                </div>

                {student.previousClass && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="text-slate-500">Previous Academic History:</span>
                    <span className="font-semibold text-slate-800">{student.previousClass}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ATTENDANCE LOG & DAILY OPERATIONS */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              {/* Header & Compliance Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Official Roll-Call & Movement Record</h4>
                  <p className="text-xs text-slate-500">Term 2 Daily Attendance Register & Gate Pass Audit for {student.name}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setAttendanceDateRange('all')}
                      className={`px-2.5 py-1 rounded-md transition-all ${attendanceDateRange === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                    >
                      All Records
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendanceDateRange('30days')}
                      className={`px-2.5 py-1 rounded-md transition-all ${attendanceDateRange === '30days' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                    >
                      30 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendanceDateRange('7days')}
                      className={`px-2.5 py-1 rounded-md transition-all ${attendanceDateRange === '7days' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                    >
                      7 Days
                    </button>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
                    student.attendanceRate >= 90 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                    student.attendanceRate >= 75 ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                    'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {student.attendanceRate}% Aggregate
                  </span>
                </div>
              </div>

              {/* Attendance Breakdown Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Total Logs</span>
                  <strong className="text-base font-bold font-mono text-slate-900">{filteredAttendance.length}</strong>
                </div>
                <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 font-semibold block uppercase">Present</span>
                  <strong className="text-base font-bold font-mono text-emerald-800">{attPresentCount}</strong>
                </div>
                <div className="p-2.5 bg-rose-50 text-rose-900 rounded-xl border border-rose-200">
                  <span className="text-[10px] text-rose-700 font-semibold block uppercase">Absent</span>
                  <strong className="text-base font-bold font-mono text-rose-800">{attAbsentCount}</strong>
                </div>
                <div className="p-2.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-200">
                  <span className="text-[10px] text-amber-700 font-semibold block uppercase">Late</span>
                  <strong className="text-base font-bold font-mono text-amber-800">{attLateCount}</strong>
                </div>
                <div className="p-2.5 bg-purple-50 text-purple-900 rounded-xl border border-purple-200">
                  <span className="text-[10px] text-purple-700 font-semibold block uppercase">Excused</span>
                  <strong className="text-base font-bold font-mono text-purple-800">{attExcusedCount}</strong>
                </div>
                <div className="p-2.5 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-200">
                  <span className="text-[10px] text-indigo-700 font-semibold block uppercase">Half Day</span>
                  <strong className="text-base font-bold font-mono text-indigo-800">{attHalfDayCount}</strong>
                </div>
              </div>

              {/* Daily Attendance Ledger Table */}
              <div className="space-y-1.5">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Session Roll-Call Log</h5>
                {filteredAttendance.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Session</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Timing</th>
                          <th className="py-2.5 px-3">Marked By</th>
                          <th className="py-2.5 px-3">Remarks / Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredAttendance.map((rec) => (
                          <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-medium text-slate-900">{rec.date}</td>
                            <td className="py-2.5 px-3 capitalize text-slate-600">{rec.session || 'Morning Assembly'}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                rec.status === 'present'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : rec.status === 'absent'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : rec.status === 'late'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : rec.status === 'half_day'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}>
                                {rec.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                              {rec.arrivalTime ? `In: ${rec.arrivalTime}` : rec.departureTime ? `Out: ${rec.departureTime}` : 'On Time'}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">{rec.markedBy || classTeacher?.name || 'Class Teacher'}</td>
                            <td className="py-2.5 px-3 text-slate-500">
                              {isSensitiveRoleRestricted ? (
                                <span className="text-[10px] italic text-slate-400">[Administrative Log]</span>
                              ) : (
                                rec.remarks || <span className="text-slate-400 italic">Standard presence verified</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
                    <Clock className="w-5 h-5 text-slate-400 mx-auto" />
                    <p className="font-semibold text-slate-700">No session attendance records found for this period.</p>
                  </div>
                )}
              </div>

              {/* Linked Campus Gate Passes & Movement */}
              {studentMovementsList.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Authorized Gate Passes & Campus Movement</span>
                    </h5>
                    <span className="text-[11px] font-mono text-slate-400">{studentMovementsList.length} Pass(es) Issued</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {studentMovementsList.map(m => (
                      <div key={m.id} className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {m.passNo}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            m.type === 'late_arrival' ? 'bg-amber-100 text-amber-800' :
                            m.type === 'early_departure' ? 'bg-rose-100 text-rose-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {m.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          <strong>Date:</strong> {m.date} at {m.time} · <span className="text-slate-500">Category: {m.category}</span>
                        </div>
                        <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg italic">
                          "{m.reason}"
                        </p>
                        <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-100">
                          <span>Auth: {m.authorizedBy}</span>
                          {m.pickupPersonName && <span>Pickup: {m.pickupPersonName} ({m.pickupRelationship})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Correction Requests Audit */}
              {studentCorrectionsList.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span>Attendance Corrections & Audit Trail</span>
                    </h5>
                    <span className="text-[11px] font-mono text-slate-400">{studentCorrectionsList.length} Request(s)</span>
                  </div>

                  <div className="space-y-2">
                    {studentCorrectionsList.map(c => (
                      <div key={c.id} className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-purple-950">
                            Date: {c.date} ({c.session}) · Status adjustment: <span className="font-mono uppercase font-bold text-slate-600">{c.originalStatus}</span> &rarr; <span className="font-mono uppercase font-bold text-purple-700">{c.requestedStatus}</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            c.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            c.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-purple-900 italic">"{c.reason}"</p>
                        <div className="flex justify-between text-[10px] text-purple-800/80 pt-1 border-t border-purple-200/50">
                          <span>Requested by: {c.requestedByName}</span>
                          {c.reviewedBy && <span>Reviewed by: {c.reviewedBy}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
                    )}

          {/* TAB 5: EXAMS & MARKS */}
          {activeTab === 'marks' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Examination Performance</h4>
                  <p className="text-xs text-slate-500">Unit Tests & Mid-Term Evaluations</p>
                </div>
                {marksAvg && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">Calculated GPA / Aggregate:</span>
                    <span className="text-sm font-bold text-emerald-700 font-mono">{marksAvg}%</span>
                  </div>
                )}
              </div>

              {studentMarks.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Examination</th>
                        <th className="py-2.5 px-3">Subject</th>
                        <th className="py-2.5 px-3">Marks Scored</th>
                        <th className="py-2.5 px-3">Percentage</th>
                        <th className="py-2.5 px-3">Grade</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Teacher Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {studentMarks.map((m) => {
                        const pct = ((m.marksObtained / m.maxMarks) * 100).toFixed(0);
                        return (
                          <tr key={m.id} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{m.examName}</td>
                            <td className="py-2.5 px-3 font-medium text-slate-800">{m.subject}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                              {m.marksObtained} / {m.maxMarks}
                            </td>
                            <td className="py-2.5 px-3 font-mono">{pct}%</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-blue-50 text-blue-800 border border-blue-200">
                                {m.grade}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                m.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {m.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 italic max-w-[200px] truncate">
                              {m.remarks || 'Consistent subject comprehension.'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
                  <Award className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="font-semibold text-slate-700">No published mark entries for the current session.</p>
                  <p className="text-[11px]">Subject teachers will publish Mid-Term grades following departmental moderation.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: FEE LEDGER (ROLE PROTECTED) */}
          {activeTab === 'fees' && (
            <div className="space-y-4">
              {!canViewFinances ? (
                <div className="p-8 text-center bg-white rounded-xl border border-amber-200 text-xs space-y-3">
                  <ShieldAlert className="w-8 h-8 text-amber-600 mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Clearance Restriction · Confidential Ledger</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                      Detailed tuition ledger cards, installment arrears, and parent payment receipts are restricted to the
                      Bursar (Accountant) and Institutional Leadership under SCHLAR Data Privacy Rules.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                    Role Clearance Level: {currentRole} (Restricted)
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Tuition Fee Ledger</h4>
                      <p className="text-xs text-slate-500">Official bursar record for {student.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Institutional Balance:</span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono uppercase ${
                        feeLedgerSummary.totalOutstanding === 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                      }`}>
                        {feeLedgerSummary.totalOutstanding === 0 ? 'Clear · Zero Arrears' : `Pending: ₹${feeLedgerSummary.totalOutstanding.toLocaleString()}`}
                      </span>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">Total Fees Billed</span>
                      <span className="text-base font-bold font-mono text-slate-900">
                        ₹{feeLedgerSummary.totalBilled.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                      <span className="text-[11px] text-emerald-800 block">Total Paid to Date</span>
                      <span className="text-base font-bold font-mono text-emerald-800">
                        ₹{feeLedgerSummary.totalPaid.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200">
                      <span className="text-[11px] text-rose-800 block">Total Outstanding Due</span>
                      <span className="text-base font-bold font-mono text-rose-800">
                        ₹{feeLedgerSummary.totalOutstanding.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                      <span className="text-[11px] text-amber-800 block">Concessions / Aid</span>
                      <span className="text-base font-bold font-mono text-amber-800">
                        ₹{feeLedgerSummary.totalConcessions.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Active Concessions & Scholarships */}
                  {studentConcessions.length > 0 && (
                    <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-amber-700" />
                          <span>Approved Concessions & Scholarships for this Student</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
                          Active AY 2026–27
                        </span>
                      </div>
                      {studentConcessions.map(c => (
                        <div key={c.id} className="p-2.5 bg-white rounded-lg border border-amber-200 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-900">{c.concessionType}</span>
                            <span className="text-slate-500 text-[11px] block">{c.reason} · Ref: {c.concessionNo}</span>
                          </div>
                          <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                            {c.discountType === 'percentage' ? `${c.discountValue}% Discount` : `-₹${c.discountValue.toLocaleString()}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {studentFees.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Invoice No</th>
                            <th className="py-2.5 px-3">Fee Particular</th>
                            <th className="py-2.5 px-3">Total Amount</th>
                            <th className="py-2.5 px-3">Paid / Due</th>
                            <th className="py-2.5 px-3">Due Date</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Receipt & Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {studentFees.map((fee) => (
                            <tr key={fee.id} className="hover:bg-slate-50/60">
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{fee.invoiceNo}</td>
                              <td className="py-2.5 px-3">
                                <span className="font-medium text-slate-900">{fee.feeType}</span>
                                {fee.concessionApplied && (
                                  <span className="block text-[10px] text-amber-700">Less {fee.concessionType}: -₹{fee.concessionApplied.toLocaleString()}</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                                ₹{fee.amount.toLocaleString()}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-[11px]">
                                <span className="text-emerald-700 block">Paid: ₹{(fee.paidAmount || (fee.status === 'paid' ? fee.amount : 0)).toLocaleString()}</span>
                                {fee.remainingBalance !== undefined && fee.remainingBalance > 0 && (
                                  <span className="text-rose-700 block">Due: ₹{fee.remainingBalance.toLocaleString()}</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-600">{fee.dueDate}</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  fee.status === 'paid'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : fee.status === 'partial'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : fee.status === 'pending'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                  {fee.status === 'partial' ? 'Partially Paid' : fee.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                {fee.status === 'paid' || fee.status === 'partial' || fee.receiptNo ? (
                                  <button
                                    onClick={() => setReceiptPreview(fee)}
                                    className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg inline-flex items-center gap-1 transition-colors"
                                  >
                                    <Receipt className="w-3.5 h-3.5" />
                                    <span>View Receipt</span>
                                  </button>
                                ) : (
                                  <span className="text-slate-400 font-mono text-[11px]">No Receipt</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
                      No standalone invoice records created yet. Default annual fee structure applies.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: DOCUMENTS & ATTACHMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Verified Enrollment Documents
                </h4>
                <p className="text-xs text-slate-500">
                  Archived physical and digitized copies verified by the front registry desk.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {(student.documentsSubmitted || [
                  'Birth Certificate',
                  'Previous Academic Records',
                  'Immunization Card',
                  'Address Proof'
                ]).map((docName, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{docName}</div>
                        <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                          <CheckCircle className="w-3 h-3" /> Digitally Verified
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast(`Document "${docName}" previewed locally.`, 'info')}
                      className="px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-50 rounded"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: LIFECYCLE & TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Student Lifecycle Milestones</h4>
                <p className="text-xs text-slate-500">Chronological history of enrollment, section transfers, and academic progression</p>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {/* Milestone 1 */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-200" />
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">Current Academic Enrollment Active</span>
                      <span className="text-[11px] text-slate-400 font-mono">Academic Year 2026–2027</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Student active in Standard {student.standard}, Section {student.section}. Attendance compliance rate: {student.attendanceRate}%.
                    </p>
                  </div>
                </div>

                {/* Milestone 2: Section transfers if any */}
                {studentTransfers.map((trf) => (
                  <div key={trf.id} className="relative">
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-200" />
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">Class Transfer: {trf.fromClass} &rarr; {trf.toClass}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{trf.effectiveDate}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">Reason: {trf.reason} (Authorized by {trf.authorizedBy})</p>
                    </div>
                  </div>
                ))}

                {/* Milestone 3: Initial Admission */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-400 border-2 border-white ring-2 ring-slate-200" />
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">Initial Institutional Admission</span>
                      <span className="text-[11px] text-slate-400 font-mono">{student.admissionDate}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Enrolled under Admission No {student.admissionNo}. Initial dossier registered by Front Office.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
            ID: {student.id} · Version: 3.2 · Strict RBAC Active
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {canEdit && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(student);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors shadow-sm`}
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Student Record</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Close Dossier
            </button>
          </div>
        </div>

      </div>

      {/* Lifecycle Status Change Sub-Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Transition Student Lifecycle Status</h3>
                <p className="text-xs text-slate-500">Update official status for {student.name} ({student.admissionNo})</p>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStatusChangeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Active">Active (Regular attendance & classes)</option>
                  <option value="Transferred">Transferred (Relocated to another institution)</option>
                  <option value="Withdrawn">Withdrawn (Formal exit / TC issued)</option>
                  <option value="Graduated">Graduated (Standard 10 completion)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Administrative Reason / TC Note *</label>
                <textarea
                  rows={3}
                  value={statusReason}
                  onChange={e => setStatusReason(e.target.value)}
                  placeholder="e.g., Parent job relocation to Pune. Transfer Certificate #TC-2026-44 issued."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                <strong>Policy notice:</strong> Marking as Transferred or Withdrawn removes the student from daily roll-call registers while preserving past academic and fee ledger history.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Confirm Status Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW / PRINT OFFICIAL FEE RECEIPT */}
      {receiptPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Official Tuition Fee Receipt
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={() => {
                    showToast(`Receipt PDF saved: ${receiptPreview.receiptNo || 'Receipt'}.pdf`, 'success');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} flex items-center gap-1.5 shadow-2xs`}
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
                <button
                  onClick={() => setReceiptPreview(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formal Letterhead */}
            <div className="border border-slate-300 p-5 rounded-xl bg-white space-y-3.5 text-xs">
              <div className="text-center space-y-1 border-b pb-3 border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-blue-900 text-white font-bold font-serif flex items-center justify-center mx-auto text-base shadow-xs">
                  GIS
                </div>
                <h3 className="text-base font-bold font-serif text-slate-900 uppercase">
                  Greenfield International School
                </h3>
                <p className="text-[11px] text-slate-500">
                  Affiliated to CBSE, New Delhi (Affiliation: 1930284 · School Code: 45129)
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Sector 12, Pradhikaran Campus, Pune, Maharashtra 411044 · accounts@greenfield.edu.in
                </p>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500">Receipt No: </span>
                  <strong className="font-mono text-slate-900">{receiptPreview.receiptNo || 'RCP-88310'}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Date of Settlement: </span>
                  <strong className="font-mono text-slate-900">{receiptPreview.paidDate || '2026-10-14'}</strong>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <strong className="text-slate-900">{student.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class & Section:</span>
                  <span>Std {student.standard}-{student.section} (Roll #{student.rollNo})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admission No:</span>
                  <span className="font-mono">{student.admissionNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Academic Term:</span>
                  <span>AY 2026–2027 · {receiptPreview.term || 'Term 2'}</span>
                </div>
              </div>

              {/* Particulars Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-semibold text-slate-700">
                    <tr>
                      <th className="py-2 px-3">Fee Particular / Component</th>
                      <th className="py-2 px-3 text-right">Sanctioned</th>
                      <th className="py-2 px-3 text-right">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">{receiptPreview.feeType}</td>
                      <td className="py-2 px-3 font-mono text-right text-slate-600">₹{receiptPreview.amount.toLocaleString()}</td>
                      <td className="py-2 px-3 font-mono text-right font-bold text-slate-900">
                        ₹{(receiptPreview.paidAmount || receiptPreview.amount).toLocaleString()}
                      </td>
                    </tr>
                    {receiptPreview.concessionApplied && (
                      <tr className="bg-amber-50/50">
                        <td className="py-1.5 px-3 text-amber-800 text-[11px]">
                          Less Concession: {receiptPreview.concessionType}
                        </td>
                        <td className="py-1.5 px-3 text-right font-mono text-amber-800 text-[11px]">-₹{receiptPreview.concessionApplied.toLocaleString()}</td>
                        <td className="py-1.5 px-3 text-right font-mono text-amber-800 text-[11px]">Adjusted</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td className="py-2 px-3 text-slate-900">Total Settled in Transaction:</td>
                      <td colSpan={2} className="py-2 px-3 text-right font-mono text-emerald-700 text-sm">
                        ₹{(receiptPreview.paidAmount || receiptPreview.amount).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 text-slate-500 font-normal">Remaining Arrears:</td>
                      <td colSpan={2} className="py-1.5 px-3 text-right font-mono text-slate-700">
                        ₹{(receiptPreview.remainingBalance ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                <span>Payment Mode: <strong>{receiptPreview.paymentMethod || 'UPI / Bank Transfer'}</strong></span>
                <span>Ref / Cheque: <strong className="font-mono">{receiptPreview.referenceNo || 'UPI-REF-894101'}</strong></span>
              </div>

              <div className="pt-4 flex justify-between items-end border-t border-slate-200">
                <div className="text-[10px] text-slate-400">
                  <p>Computer-generated official receipt.</p>
                  <p>Preserve this document for institutional records.</p>
                </div>
                <div className="text-center font-serif">
                  <span className="italic font-bold text-slate-700 block">David Reynolds</span>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block border-t border-slate-400 pt-0.5">
                    Authorized Bursar Seal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
