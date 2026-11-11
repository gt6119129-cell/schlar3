import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Clock,
  UserCheck,
  CheckSquare,
  User,
  Calendar,
  Award,
  FileText,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCheck,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  LogOut,
  Bell,
  Save,
  ShieldCheck,
  Eye,
  BookOpen,
  Briefcase,
  ArrowRight,
  Lock,
  MessageSquare,
  MoreHorizontal,
  ChevronLeft,
  TrendingUp,
  Settings,
  Sliders,
  Palette
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { getThemeClasses } from '../../utils/themeHelper';
import { AttendanceRecord, Student, Assignment, MarkRecord, StaffLeaveRequest } from '../../types/school';
import { SCHLAR_PALETTES, getPaletteById } from '../../theme/palettes';
import {
  applyThemeToDom,
  saveStoredActivePaletteId,
  saveStoredActiveColors
} from '../../theme/themeEngine';

export const TeacherMobileView: React.FC = () => {
  const {
    themeColor,
    students,
    timetables,
    assignments,
    marks,
    notices,
    attendance,
    attendanceSessions,
    substitutions,
    leaveRequests,
    attendanceDiscrepancies,
    saveBulkAttendance,
    saveAttendanceSession,
    createAssignment,
    saveMark,
    submitLeaveRequest,
    updateAttendanceDiscrepancy,
    signOut,
    switchRole,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Bottom navigation tab (4 primary destinations: Home, Classes, Attendance, More per Prompt 4)
  const [mobileTab, setMobileTab] = useState<
    | 'home'
    | 'classes'
    | 'attendance'
    | 'more'
    | 'more_timetable'
    | 'more_assignments'
    | 'more_exams'
    | 'more_marks'
    | 'more_progress'
    | 'more_notices'
    | 'more_settings'
  >('home');

  const [activePaletteId, setActivePaletteId] = useState<string>('palette-7');
  const [noticeCategoryFilter, setNoticeCategoryFilter] = useState<'all' | 'Academic' | 'Administrative' | 'Event' | 'Examination'>('all');
  const [examTabFilter, setExamTabFilter] = useState<'duties' | 'datesheet'>('duties');

  // Notification Drawer
  const [showNotifications, setShowNotifications] = useState(false);

  // Active Class Selection
  const [selectedClassStd, setSelectedClassStd] = useState<number>(8);
  const [selectedClassSec, setSelectedClassSec] = useState<'A' | 'B'>('A');

  // Timetable view mode within Classes tab: 'today' | 'week'
  const [ttViewMode, setTtViewMode] = useState<'today' | 'week'>('today');
  const [ttSelectedDay, setTtSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Wednesday');

  // Classes sub-tab: 'roster' | 'timetable' | 'assignments' | 'marks'
  const [classSubTab, setClassSubTab] = useState<'roster' | 'timetable' | 'assignments' | 'marks'>('roster');

  // Student Detail Modal (Privacy-Respecting: no financial or internal admin notes)
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterSort, setRosterSort] = useState<'roll' | 'name' | 'attendance'>('roll');

  // ATTENDANCE STATE & WORKFLOW
  const classStudents = useMemo(() => {
    return students
      .filter(s => s.standard === selectedClassStd && s.section === selectedClassSec)
      .sort((a, b) => a.rollNo - b.rollNo);
  }, [students, selectedClassStd, selectedClassSec]);

  const [attendanceDate, setAttendanceDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [attendanceSession, setAttendanceSession] = useState<'morning' | 'afternoon'>('morning');
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(1); // Default to Period 1

  // Day of week from attendanceDate
  const dayOfWeek = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(attendanceDate + 'T00:00:00');
    return days[d.getDay()] || 'Monday';
  }, [attendanceDate]);

  // Scheduled slots for this class and date
  const scheduledPeriods = useMemo(() => {
    return timetables
      .filter(t => t.standard === selectedClassStd && t.section === selectedClassSec && t.day === dayOfWeek)
      .sort((a, b) => a.period - b.period);
  }, [timetables, selectedClassStd, selectedClassSec, dayOfWeek]);

  // Roll-call status dictionary
  const [rollCall, setRollCall] = useState<Record<string, AttendanceRecord['status']>>({});
  const [mobileRemarks, setMobileRemarks] = useState<Record<string, string>>({});
  const [mobileAttendanceSearch, setMobileAttendanceSearch] = useState('');
  const [isAttendanceFinalized, setIsAttendanceFinalized] = useState(false);
  const [hasUnsavedAttendance, setHasUnsavedAttendance] = useState(false);
  const [attendanceSuccessToast, setAttendanceSuccessToast] = useState<string | null>(null);
  const [confirmMarkAllModal, setConfirmMarkAllModal] = useState(false);

  // Initialize or synchronize rollCall whenever class, period, or date changes
  React.useEffect(() => {
    const init: Record<string, AttendanceRecord['status']> = {};
    const remarks: Record<string, string> = {};

    const sessionKey = selectedPeriod !== null ? `period_${selectedPeriod}` : attendanceSession;
    const sessionId = `${selectedClassStd}-${selectedClassSec}-${attendanceDate}-${sessionKey}`;
    const sessEntity = attendanceSessions.find(s => s.id === sessionId);
    setIsAttendanceFinalized(sessEntity?.status === 'submitted');

    classStudents.forEach(s => {
      // Find matching record
      const existing = attendance.find(a => {
        if (a.studentId !== s.id || a.date !== attendanceDate) return false;
        if (selectedPeriod !== null) {
          return a.period === selectedPeriod;
        }
        return a.session === attendanceSession || (!a.session && attendanceSession === 'morning');
      });

      if (existing) {
        init[s.id] = existing.status;
        if (existing.remarks) remarks[s.id] = existing.remarks;
      } else {
        // If session was submitted, default to present, otherwise not_marked
        init[s.id] = sessEntity ? 'present' : 'not_marked';
      }
    });

    setRollCall(init);
    setMobileRemarks(remarks);
    setHasUnsavedAttendance(false);
  }, [selectedClassStd, selectedClassSec, attendanceDate, attendanceSession, selectedPeriod, attendance, attendanceSessions, classStudents]);

  const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => {
    if (isAttendanceFinalized) return;
    setRollCall(prev => ({ ...prev, [studentId]: status }));
    setHasUnsavedAttendance(true);
  };

  const handleSaveAttendance = (finalize = false) => {
    const sessionKey = selectedPeriod !== null ? `period_${selectedPeriod}` : attendanceSession;
    
    // Check for unmarked students if finalizing
    const unmarkedList = classStudents.filter(s => !rollCall[s.id] || rollCall[s.id] === 'not_marked');
    if (finalize && unmarkedList.length > 0) {
      showToast?.(`Incomplete Register: ${unmarkedList.length} student(s) remain Not Marked. Please mark them as Present or Absent before final submission, or save as Draft.`);
      return;
    }

    const sessionRecords = classStudents.map(s => ({
      studentId: s.id,
      studentName: s.name,
      rollNo: s.rollNo,
      status: rollCall[s.id] && rollCall[s.id] !== 'not_marked' ? rollCall[s.id] : 'present',
      period: selectedPeriod !== null ? selectedPeriod : undefined,
      remarks: mobileRemarks[s.id] || (finalize ? `Submitted via Teacher Mobile App (${selectedPeriod !== null ? 'Period ' + selectedPeriod : 'Session'})` : 'Draft Entry')
    }));

    const result = saveAttendanceSession({
      standard: selectedClassStd,
      section: selectedClassSec,
      date: attendanceDate,
      session: sessionKey,
      period: selectedPeriod !== null ? selectedPeriod : undefined,
      isDraft: !finalize,
      records: sessionRecords,
      submittedByName: 'Mrs. Shalini Verma'
    });

    setHasUnsavedAttendance(false);
    if (finalize) {
      setIsAttendanceFinalized(true);
      setAttendanceSuccessToast(result.message || 'Period register submitted and synchronized with central web matrix!');
    } else {
      setAttendanceSuccessToast(result.message || 'Draft period attendance saved successfully.');
    }
    setTimeout(() => setAttendanceSuccessToast(null), 3500);
  };

  const handleConfirmMarkAll = () => {
    const init: Record<string, AttendanceRecord['status']> = { ...rollCall };
    classStudents.forEach(s => {
      init[s.id] = 'present';
    });
    setRollCall(init);
    setHasUnsavedAttendance(true);
    setConfirmMarkAllModal(false);
  };

  // ASSIGNMENTS STATE
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgSubject, setNewAsgSubject] = useState('Mathematics');
  const [newAsgDue, setNewAsgDue] = useState('2026-10-22');
  const [newAsgMaxMarks, setNewAsgMaxMarks] = useState(25);
  const [newAsgDesc, setNewAsgDesc] = useState('');
  const [newAsgStatus, setNewAsgStatus] = useState<'published' | 'draft'>('published');
  const [selectedAsgForSubmissions, setSelectedAsgForSubmissions] = useState<Assignment | null>(null);
  const [assignmentFeedbackDraft, setAssignmentFeedbackDraft] = useState<Record<string, { marks: number; feedback: string }>>({
    'stu-101': { marks: 24, feedback: 'Excellent step-by-step algebraic substitution.' },
    'stu-103': { marks: 21, feedback: 'Good effort, recheck question 4 signs.' }
  });

  const handleCreateAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle.trim()) return;
    createAssignment({
      title: newAsgTitle.trim(),
      standard: selectedClassStd,
      section: selectedClassSec,
      subject: newAsgSubject,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: newAsgDue,
      description: newAsgDesc || 'Review textbook chapter exercises and submit in assignment notebook.',
      submissionCount: 0,
      totalStudents: classStudents.length,
      teacherName: 'Mrs. Shalini Verma',
      status: newAsgStatus
    });
    setNewAsgTitle('');
    setNewAsgDesc('');
    setShowAddAssignmentModal(false);
    setAttendanceSuccessToast(`Homework "${newAsgTitle}" ${newAsgStatus === 'published' ? 'published to students & parents' : 'saved as draft'}.`);
    setTimeout(() => setAttendanceSuccessToast(null), 3000);
  };

  // MARKS ENTRY STATE
  const [marksExamName, setMarksExamName] = useState('Mid-Term Examination');
  const [marksMaxScore, setMarksMaxScore] = useState(100);
  const [enteredMarks, setEnteredMarks] = useState<Record<string, { score: number | ''; grade: string; remarks: string }>>({});
  const [marksValidationErrors, setMarksValidationErrors] = useState<Record<string, string>>({});
  const [marksSavedToast, setMarksSavedToast] = useState(false);

  // Initialize marks for selected class and exam
  React.useEffect(() => {
    const initMarks: Record<string, { score: number | ''; grade: string; remarks: string }> = {};
    classStudents.forEach(s => {
      const existing = marks.find(m => m.studentId === s.id && m.examName === marksExamName && m.subject === 'Mathematics');
      if (existing) {
        initMarks[s.id] = { score: existing.marksObtained, grade: existing.grade, remarks: existing.remarks || '' };
      } else {
        // Sample default grade
        const randomScore = s.id === 'stu-101' ? 92 : s.id === 'stu-102' ? 88 : 78;
        initMarks[s.id] = { score: randomScore, grade: randomScore >= 90 ? 'A1' : randomScore >= 80 ? 'A2' : 'B1', remarks: 'Good grasp of concepts' };
      }
    });
    setEnteredMarks(initMarks);
  }, [classStudents, marksExamName, marks]);

  const handleMarksScoreChange = (studentId: string, valStr: string) => {
    if (valStr === '') {
      setEnteredMarks(prev => ({ ...prev, [studentId]: { ...prev[studentId], score: '', grade: '-' } }));
      setMarksValidationErrors(prev => ({ ...prev, [studentId]: 'Score required' }));
      return;
    }
    const num = Number(valStr);
    if (isNaN(num)) return;

    if (num < 0) {
      setMarksValidationErrors(prev => ({ ...prev, [studentId]: 'Cannot be negative' }));
      return;
    }
    if (num > marksMaxScore) {
      setMarksValidationErrors(prev => ({ ...prev, [studentId]: `Cannot exceed max (${marksMaxScore})` }));
      return;
    }

    setMarksValidationErrors(prev => {
      const copy = { ...prev };
      delete copy[studentId];
      return copy;
    });

    const grade = num >= 90 ? 'A1' : num >= 80 ? 'A2' : num >= 70 ? 'B1' : num >= 60 ? 'B2' : num >= 50 ? 'C1' : 'D';
    setEnteredMarks(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], score: num, grade }
    }));
  };

  const handleSaveMarksBatch = () => {
    if (Object.keys(marksValidationErrors).length > 0) {
      showToast('Please correct validation errors before saving marks.', 'error');
      return;
    }

    classStudents.forEach(s => {
      const item = enteredMarks[s.id];
      if (item && item.score !== '') {
        saveMark({
          studentId: s.id,
          studentName: s.name,
          standard: s.standard,
          section: s.section,
          examName: marksExamName,
          subject: 'Mathematics',
          marksObtained: Number(item.score),
          maxMarks: marksMaxScore,
          grade: item.grade,
          remarks: item.remarks || 'Evaluated by Mrs. Shalini Verma',
          status: 'published',
          teacherId: 'tch-01'
        });
      }
    });

    setMarksSavedToast(true);
    setTimeout(() => setMarksSavedToast(false), 3000);
  };

  // FACULTY LEAVE STATE
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState<StaffLeaveRequest['leaveType']>('Casual Leave');
  const [leaveStart, setLeaveStart] = useState('2026-10-24');
  const [leaveEnd, setLeaveEnd] = useState('2026-10-25');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSuccessToast, setLeaveSuccessToast] = useState(false);

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;
    submitLeaveRequest('tch-01', 'Mrs. Shalini Verma', leaveType, leaveStart, leaveEnd, leaveReason.trim());
    setShowApplyLeaveModal(false);
    setLeaveReason('');
    setLeaveSuccessToast(true);
    setTimeout(() => setLeaveSuccessToast(false), 3000);
  };

  // DISCREPANCY REVIEW DRAWER
  const [showDiscrepanciesModal, setShowDiscrepanciesModal] = useState(false);

  // Derived filtered students for roster
  const filteredRoster = useMemo(() => {
    let list = classStudents.filter(s =>
      s.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      s.rollNo.toString().includes(rosterSearch) ||
      s.admissionNo.toLowerCase().includes(rosterSearch.toLowerCase())
    );
    if (rosterSort === 'roll') {
      list = [...list].sort((a, b) => a.rollNo - b.rollNo);
    } else if (rosterSort === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (rosterSort === 'attendance') {
      list = [...list].sort((a, b) => b.attendanceRate - a.attendanceRate);
    }
    return list;
  }, [classStudents, rosterSearch, rosterSort]);

  // Timetable for Shalini Verma
  const teacherTimetable = useMemo(() => {
    return timetables.filter(t => t.teacherName?.toLowerCase().includes('shalini') || t.teacherId === 'tch-01');
  }, [timetables]);

  const todayClasses = useMemo(() => {
    return teacherTimetable.filter(t => t.day === 'Wednesday');
  }, [teacherTimetable]);

  const teacherSubstitutions = useMemo(() => {
    return substitutions.filter(s => s.substituteTeacherName?.toLowerCase().includes('shalini'));
  }, [substitutions]);

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 pb-20 select-none">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-full ${themeClasses.primaryBg} text-white font-bold text-xs flex items-center justify-center shadow-xs`}>
            SV
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 leading-tight">Mrs. Shalini Verma</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                8-A Lead
              </span>
            </div>
            <div className="text-[11px] text-slate-500">Greenfield International School</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Notification Button */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Web View Switch */}
          <button
            onClick={() => switchRole('teacher_web')}
            className="text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-xl border border-blue-200 transition-colors"
          >
            Web Portal
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* TAB 1: HOME DASHBOARD */}
        {mobileTab === 'home' && (
          <div className="space-y-3.5">
            {/* Today's Hero Timetable Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  TODAY'S SCHEDULE · WEDNESDAY
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                  {todayClasses.length + teacherSubstitutions.length} Periods Scheduled
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono text-blue-400 font-semibold">Current / Next Up: Period 1</span>
                <h3 className="text-base font-bold text-white mt-0.5">Class 8-A · Mathematics</h3>
                <p className="text-xs text-slate-300">08:30 AM – 09:15 AM · Room 204 · Linear Equations</p>
              </div>

              {/* Fast Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedClassStd(8);
                    setSelectedClassSec('A');
                    setMobileTab('attendance');
                  }}
                  className={`flex-1 py-2 text-xs font-bold text-white rounded-xl ${themeClasses.primaryBg} flex items-center justify-center gap-1.5 shadow-sm active:scale-98`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Take Morning Attendance</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedClassStd(8);
                    setSelectedClassSec('A');
                    setClassSubTab('roster');
                    setMobileTab('classes');
                  }}
                  className="px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl"
                >
                  Roster
                </button>
              </div>
            </div>

            {/* Substitution Coverage Notice if applicable */}
            {teacherSubstitutions.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Substitution Period Assigned Today</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Covering for {teacherSubstitutions[0].originalTeacherName}: <strong>Std {teacherSubstitutions[0].standard}-{teacherSubstitutions[0].section} ({teacherSubstitutions[0].subject})</strong> at {teacherSubstitutions[0].time} in {teacherSubstitutions[0].room}.
                </p>
              </div>
            )}

            {/* Daily Operational Summary Ribbon */}
            <div className="grid grid-cols-2 gap-2.5">
              <div
                onClick={() => setMobileTab('attendance')}
                className="bg-white p-3 rounded-2xl border border-slate-200/90 hover:border-blue-400 cursor-pointer transition-colors shadow-2xs"
              >
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-semibold">Roll Call</span>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
                  {classStudents.filter(s => rollCall[s.id] === 'present').length} / {classStudents.length}
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Std 8-A Morning Register</span>
              </div>

              <div
                onClick={() => setMobileTab('more_assignments')}
                className="bg-white p-3 rounded-2xl border border-slate-200/90 hover:border-blue-400 cursor-pointer transition-colors shadow-2xs"
              >
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-semibold">Pending Tasks</span>
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
                  {assignments.length + (attendanceDiscrepancies.filter(d => d.status === 'pending').length)}
                </div>
                <span className="text-[10px] text-blue-700 font-medium">Reviews & Actions Due</span>
              </div>
            </div>

            {/* Discrepancy Alert Banner if parent reported discrepancy */}
            {attendanceDiscrepancies.filter(d => d.status === 'pending').length > 0 && (
              <div
                onClick={() => setShowDiscrepanciesModal(true)}
                className="bg-purple-50 border border-purple-200 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-purple-100/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-purple-700 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-purple-900 block">Attendance Discrepancy Inquiry</span>
                    <span className="text-[11px] text-purple-700">1 parent inquiry waiting for your review</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-600" />
              </div>
            )}

            {/* Quick Actions Grid */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fast Faculty Actions</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    setShowAddAssignmentModal(true);
                  }}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-2 font-semibold text-slate-800 transition-colors"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Create Homework</span>
                </button>
                <button
                  onClick={() => {
                    setMobileTab('more_marks');
                  }}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-2 font-semibold text-slate-800 transition-colors"
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Enter Exam Marks</span>
                </button>
                <button
                  onClick={() => {
                    setShowApplyLeaveModal(true);
                  }}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-2 font-semibold text-slate-800 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-rose-600" />
                  <span>Apply Faculty Leave</span>
                </button>
                <button
                  onClick={() => {
                    setMobileTab('classes');
                    setClassSubTab('timetable');
                  }}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-2 font-semibold text-slate-800 transition-colors"
                >
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Weekly Timetable</span>
                </button>
              </div>
            </div>

            {/* Today's Teaching Periods Timeline */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Today's Class Schedule</h4>
                <span className="text-[11px] text-slate-500 font-mono">Period 1–6</span>
              </div>

              <div className="space-y-2">
                {todayClasses.map(slot => (
                  <div
                    key={slot.id}
                    onClick={() => {
                      setSelectedClassStd(slot.standard);
                      setSelectedClassSec((slot.section as 'A' | 'B') || 'A');
                      setMobileTab('classes');
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        P{slot.period}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{slot.subject}</div>
                        <div className="text-[11px] text-slate-500">Std {slot.standard}-{slot.section} · {slot.room}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono font-semibold text-slate-700 block">{slot.time}</span>
                      <span className="text-[10px] text-blue-600 font-semibold">View Class &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Institutional Circulars Feed */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Faculty Circulars</h4>
                <span className="text-[10px] font-mono text-slate-400">Greenfield Admin Desk</span>
              </div>
              <div className="space-y-2">
                {notices.slice(0, 2).map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY CLASSES & ROSTER */}
        {mobileTab === 'classes' && (
          <div className="space-y-3.5">
            {/* Class Picker Horizontal Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => { setSelectedClassStd(8); setSelectedClassSec('A'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedClassStd === 8 && selectedClassSec === 'A'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Class 8-A (Math · Lead)
              </button>
              <button
                onClick={() => { setSelectedClassStd(8); setSelectedClassSec('B'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedClassStd === 8 && selectedClassSec === 'B'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Class 8-B (Math)
              </button>
              <button
                onClick={() => { setSelectedClassStd(9); setSelectedClassSec('A'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedClassStd === 9 && selectedClassSec === 'A'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Class 9-A (Math)
              </button>
              <button
                onClick={() => { setSelectedClassStd(9); setSelectedClassSec('B'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedClassStd === 9 && selectedClassSec === 'B'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Class 9-B (Vedic Math)
              </button>
            </div>

            {/* Class Hero Info */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Standard {selectedClassStd} — Section {selectedClassSec}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Subject: Mathematics · {classStudents.length} Students Enrolled
                  </p>
                </div>
                {selectedClassStd === 8 && selectedClassSec === 'A' && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Class Teacher Duty
                  </span>
                )}
              </div>

              {/* Sub-tab segmented control */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setClassSubTab('roster')}
                  className={`py-1.5 rounded-lg transition-colors ${classSubTab === 'roster' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                >
                  Roster
                </button>
                <button
                  onClick={() => setClassSubTab('timetable')}
                  className={`py-1.5 rounded-lg transition-colors ${classSubTab === 'timetable' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                >
                  Timetable
                </button>
                <button
                  onClick={() => setClassSubTab('assignments')}
                  className={`py-1.5 rounded-lg transition-colors ${classSubTab === 'assignments' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                >
                  Homework
                </button>
                <button
                  onClick={() => setClassSubTab('marks')}
                  className={`py-1.5 rounded-lg transition-colors ${classSubTab === 'marks' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                >
                  Marks
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Student Roster */}
            {classSubTab === 'roster' && (
              <div className="space-y-3">
                {/* Search & Sort Controls */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search name / roll #..."
                      value={rosterSearch}
                      onChange={e => setRosterSearch(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={rosterSort}
                    onChange={e => setRosterSort(e.target.value as any)}
                    className="p-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700"
                  >
                    <option value="roll">Sort: Roll #</option>
                    <option value="name">Sort: Name</option>
                    <option value="attendance">Sort: Attendance %</option>
                  </select>
                </div>

                {/* Student Cards List */}
                <div className="space-y-2">
                  {filteredRoster.map(s => (
                    <div
                      key={s.id}
                      onClick={() => setViewingStudent(s)}
                      className="bg-white p-3 rounded-xl border border-slate-200 hover:border-blue-400 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                          #{s.rollNo}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{s.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{s.admissionNo} · {s.gender}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[11px] font-mono font-bold block ${
                          s.attendanceRate >= 90 ? 'text-emerald-700' : s.attendanceRate >= 75 ? 'text-blue-700' : 'text-rose-700'
                        }`}>
                          {s.attendanceRate}% Att.
                        </span>
                        <span className="text-[10px] text-blue-600 flex items-center gap-0.5 justify-end">
                          Dossier <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab 2: Timetable Module */}
            {classSubTab === 'timetable' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const).map(d => (
                      <button
                        key={d}
                        onClick={() => setTtSelectedDay(d)}
                        className={`px-2 py-1 text-[11px] font-bold rounded-lg ${
                          ttSelectedDay === d ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600'
                        }`}
                      >
                        {d.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {timetables
                    .filter(t => t.standard === selectedClassStd && t.section === selectedClassSec && t.day === ttSelectedDay)
                    .map(slot => (
                      <div key={slot.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold font-mono text-xs flex items-center justify-center">
                            P{slot.period}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900">{slot.subject}</div>
                            <div className="text-[11px] text-slate-500">{slot.teacherName} · {slot.room}</div>
                          </div>
                        </div>
                        <span className="font-mono text-[11px] text-slate-600">{slot.time}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Sub-tab 3: Assignments List */}
            {classSubTab === 'assignments' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Assigned Homework & Projects</span>
                  <button
                    onClick={() => setShowAddAssignmentModal(true)}
                    className="px-2.5 py-1 text-xs font-bold text-white bg-blue-700 rounded-xl flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Task</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {assignments
                    .filter(a => a.standard === selectedClassStd && a.section === selectedClassSec)
                    .map(asg => (
                      <div key={asg.id} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{asg.title}</h4>
                            <span className="text-[11px] text-slate-500 font-mono">
                              Due: {asg.dueDate} · {asg.subject}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            asg.status === 'published' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {asg.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{asg.description}</p>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">
                            Submissions: <strong>28 / {asg.totalStudents}</strong>
                          </span>
                          <button
                            onClick={() => setSelectedAsgForSubmissions(asg)}
                            className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-0.5"
                          >
                            Review Work &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Sub-tab 4: Marks Quick View */}
            {classSubTab === 'marks' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Mid-Term Grade Summary</span>
                  <button
                    onClick={() => setMobileTab('more_marks')}
                    className="text-xs font-semibold text-blue-700 hover:underline"
                  >
                    Open Full Marks Ledger &rarr;
                  </button>
                </div>

                <div className="space-y-2">
                  {classStudents.slice(0, 8).map(s => {
                    const rec = marks.find(m => m.studentId === s.id && m.subject === 'Mathematics');
                    return (
                      <div key={s.id} className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{s.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Roll #{s.rollNo}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-blue-700">
                            {rec ? `${rec.marksObtained} / ${rec.maxMarks}` : '92 / 100'}
                          </span>
                          <span className="block text-[10px] font-bold text-emerald-600">
                            Grade {rec ? rec.grade : 'A1'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ATTENDANCE FULL WORKFLOW */}
        {mobileTab === 'attendance' && (() => {
          const totalEligible = classStudents.length;
          const presentCount = classStudents.filter(s => rollCall[s.id] === 'present').length;
          const absentCount = classStudents.filter(s => rollCall[s.id] === 'absent').length;
          const lateCount = classStudents.filter(s => rollCall[s.id] === 'late').length;
          const excusedCount = classStudents.filter(s => rollCall[s.id] === 'excused').length;
          const notMarkedCount = classStudents.filter(s => !rollCall[s.id] || rollCall[s.id] === 'not_marked').length;
          const markedCount = totalEligible - notMarkedCount;
          const completionRate = totalEligible > 0 ? Math.round((markedCount / totalEligible) * 100) : 0;

          const absentStudents = classStudents.filter(s => rollCall[s.id] === 'absent');

          const filtered = classStudents.filter(s => {
            if (!mobileAttendanceSearch) return true;
            return s.name.toLowerCase().includes(mobileAttendanceSearch.toLowerCase()) ||
                   s.rollNo.toString().includes(mobileAttendanceSearch) ||
                   s.admissionNo.toLowerCase().includes(mobileAttendanceSearch.toLowerCase());
          });

          const currentSlot = scheduledPeriods.find(p => p.period === selectedPeriod);

          return (
            <div className="space-y-3.5">
              {/* Header Card & Class / Date Pickers */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Period Register — Class {selectedClassStd}-{selectedClassSec}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {selectedPeriod !== null 
                        ? `Period ${selectedPeriod}: ${currentSlot?.subject || 'Class Subject'} (${currentSlot?.time || '08:30 - 09:15'})`
                        : 'Morning Assembly Roll-Call'}
                    </p>
                  </div>
                  {isAttendanceFinalized ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <Lock className="w-3 h-3" /> Submitted
                    </span>
                  ) : hasUnsavedAttendance ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                      Draft Unsaved
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                      Draft Saved
                    </span>
                  )}
                </div>

                {/* Class & Date Selector */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block font-semibold mb-0.5">Class & Section</label>
                    <select
                      value={`${selectedClassStd}-${selectedClassSec}`}
                      onChange={e => {
                        const [std, sec] = e.target.value.split('-');
                        setSelectedClassStd(Number(std));
                        setSelectedClassSec(sec as 'A' | 'B');
                      }}
                      className="w-full p-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                    >
                      <option value="8-A">Class 8-A (Class Teacher)</option>
                      <option value="8-B">Class 8-B</option>
                      <option value="9-A">Class 9-A</option>
                      <option value="9-B">Class 9-B</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-semibold mb-0.5">Date</label>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={e => setAttendanceDate(e.target.value)}
                      className="w-full p-1.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* Timetable Period Carousel */}
                <div className="space-y-1 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Select Scheduled Period ({dayOfWeek})
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold">
                      {scheduledPeriods.length} Periods Today
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPeriod(null);
                        setAttendanceSession('morning');
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all shrink-0 ${
                        selectedPeriod === null && attendanceSession === 'morning'
                          ? 'bg-blue-600 text-white shadow-xs font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Assembly Roll
                    </button>
                    {scheduledPeriods.map(slot => {
                      const isSelected = selectedPeriod === slot.period;
                      const sKey = `period_${slot.period}`;
                      const sId = `${selectedClassStd}-${selectedClassSec}-${attendanceDate}-${sKey}`;
                      const sEntity = attendanceSessions.find(s => s.id === sId);
                      const isSub = sEntity?.status === 'submitted';

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedPeriod(slot.period)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] whitespace-nowrap transition-all shrink-0 flex items-center gap-1 ${
                            isSelected
                              ? 'bg-slate-900 text-white font-bold shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <span>P{slot.period}: {slot.subject}</span>
                          {isSub && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Tally HUD */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]">
                  <div className="bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-100 font-bold">
                    <span className="text-sm font-mono block leading-none">{presentCount}</span>
                    <span className="text-[9px] uppercase tracking-wider text-emerald-700 mt-1 block">Present</span>
                  </div>
                  <div className="bg-rose-50 text-rose-800 p-2 rounded-xl border border-rose-100 font-bold">
                    <span className="text-sm font-mono block leading-none">{absentCount}</span>
                    <span className="text-[9px] uppercase tracking-wider text-rose-700 mt-1 block">Absent</span>
                  </div>
                  <div className="bg-slate-100 text-slate-800 p-2 rounded-xl border border-slate-200 font-bold">
                    <span className="text-sm font-mono block leading-none">{notMarkedCount}</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-600 mt-1 block">Unmarked</span>
                  </div>
                  <div className="bg-blue-50 text-blue-800 p-2 rounded-xl border border-blue-100 font-bold">
                    <span className="text-sm font-mono block leading-none">{completionRate}%</span>
                    <span className="text-[9px] uppercase tracking-wider text-blue-700 mt-1 block">Progress</span>
                  </div>
                </div>

                {/* Absent Summary List */}
                {absentStudents.length > 0 && (
                  <div className="p-2 bg-rose-50/80 rounded-xl border border-rose-200/80 text-[11px] text-rose-800">
                    <span className="font-bold">Absent in this period ({absentStudents.length}):</span>{' '}
                    <span>{absentStudents.map(s => `${s.name} (#${s.rollNo})`).join(', ')}</span>
                  </div>
                )}

                {/* Fast Controls & Search Bar */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search roll # or student name..."
                      value={mobileAttendanceSearch}
                      onChange={e => setMobileAttendanceSearch(e.target.value)}
                      className="w-full pl-8 pr-2 py-1 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleConfirmMarkAll()}
                    disabled={isAttendanceFinalized}
                    className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl shrink-0 flex items-center gap-1 disabled:opacity-50"
                  >
                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                    <span>All Present</span>
                  </button>
                </div>
              </div>

              {/* Student Roll Cards */}
              <div className="space-y-2">
                {filtered.map(student => {
                  const status = rollCall[student.id] || 'not_marked';
                  return (
                    <div
                      key={student.id}
                      className={`bg-white p-3 rounded-2xl border transition-all ${
                        status === 'present' ? 'border-emerald-200/80 bg-emerald-50/10' :
                        status === 'absent' ? 'border-rose-200 bg-rose-50/20' :
                        status === 'late' ? 'border-amber-200 bg-amber-50/20' :
                        status === 'excused' ? 'border-purple-200 bg-purple-50/20' :
                        'border-slate-200 bg-white'
                      } space-y-2`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                            status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                            status === 'absent' ? 'bg-rose-100 text-rose-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            #{student.rollNo}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{student.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{student.admissionNo}</div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          student.attendanceRate >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {student.attendanceRate}% Att.
                        </span>
                      </div>

                      {/* 3-State Status Controls: Present, Absent, Not Marked */}
                      <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          disabled={isAttendanceFinalized}
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`py-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 ${
                            status === 'present'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          } disabled:opacity-70`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>
                        <button
                          type="button"
                          disabled={isAttendanceFinalized}
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`py-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 ${
                            status === 'absent'
                              ? 'bg-rose-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          } disabled:opacity-70`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>
                        <button
                          type="button"
                          disabled={isAttendanceFinalized}
                          onClick={() => handleStatusChange(student.id, 'not_marked')}
                          className={`py-1.5 rounded-xl font-bold text-xs transition-all ${
                            status === 'not_marked' || !status
                              ? 'bg-slate-700 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          } disabled:opacity-70`}
                        >
                          Reset
                        </button>
                      </div>

                      {status === 'absent' && (
                        <input
                          type="text"
                          placeholder="Absence reason (e.g. sick leave, travel)..."
                          value={mobileRemarks[student.id] || ''}
                          onChange={e => {
                            setMobileRemarks(prev => ({ ...prev, [student.id]: e.target.value }));
                            setHasUnsavedAttendance(true);
                          }}
                          className="w-full text-[11px] py-1 px-2.5 rounded-xl border border-rose-200 bg-rose-50/50"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Sticky Action Bar for Period Attendance Submission */}
              <div className="sticky bottom-20 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-lg flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveAttendance(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveAttendance(true)}
                  disabled={isAttendanceFinalized}
                  className={`flex-1 py-2 text-xs font-bold text-white rounded-xl ${
                    isAttendanceFinalized ? 'bg-slate-400 cursor-not-allowed' : themeClasses.primaryBg
                  } shadow-sm active:scale-98 transition-transform flex items-center justify-center gap-1`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isAttendanceFinalized ? 'Submitted & Locked' : 'Review & Submit'}</span>
                </button>
              </div>
            </div>
          );
        })()}

        {/* TAB 4: MORE HUB & 7 SPECIALIZED SUB-SCREENS */}
        {mobileTab === 'more' && (
          <div className="space-y-3.5">
            {/* Faculty Identity Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${themeClasses.primaryBg} text-white font-bold text-base flex items-center justify-center shadow-xs shrink-0`}>
                  SV
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">Mrs. Shalini Verma</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Senior Faculty — Mathematics & Vedic Math</p>
                  <div className="text-[10px] font-mono text-slate-600 mt-0.5">Emp ID: TCH-2016-042 · Class Teacher 8-A</div>
                </div>
              </div>
            </div>

            {/* Teaching Hub & Tools Launcher: 7 Dedicated Destinations */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Teacher Workstation</h4>
                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  7 Core Modules
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-1">
                {/* 1. Timetable */}
                <button
                  onClick={() => setMobileTab('more_timetable')}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Timetable & Schedule</div>
                      <div className="text-[10px] text-slate-500">Weekly teaching timetable & daily room allocations</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* 2. Assignments */}
                <button
                  onClick={() => setMobileTab('more_assignments')}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Assignments & Homework</div>
                      <div className="text-[10px] text-slate-500">Publish homework, evaluate & review notebook work</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* 3. Examinations */}
                <button
                  onClick={() => setMobileTab('more_exams')}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Examinations & Invigilation</div>
                      <div className="text-[10px] text-slate-500">Exam datesheet, hall supervisor duties & seating</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* 4. Marks & Results */}
                <button
                  onClick={() => setMobileTab('more_marks')}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Marks & Results Entry</div>
                      <div className="text-[10px] text-slate-500">Grading terminal, score validations & endorsement</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* 5. Student Progress */}
                <button
                  onClick={() => setMobileTab('more_progress')}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Student Progress & Profiles</div>
                      <div className="text-[10px] text-slate-500">Academic analytics, attendance warnings & dossiers</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* 6. Announcements */}
                <button
                  onClick={() => setMobileTab('more_notices')}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Announcements & Circulars</div>
                      <div className="text-[10px] text-slate-500">Official staff notices, circulars & school memos</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* 7. Profile & Settings */}
                <button
                  onClick={() => setMobileTab('more_settings')}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Profile & Settings</div>
                      <div className="text-[10px] text-slate-500">Faculty details, 12-palette color theme & preferences</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              </div>
            </div>

            {/* Leave Entitlement Desk */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Leave Entitlement</h4>
                <button
                  onClick={() => setShowApplyLeaveModal(true)}
                  className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Apply Leave
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="text-[10px] text-blue-700 block font-semibold">Casual Leave</span>
                  <span className="font-bold font-mono text-sm text-blue-950">8 / 12</span>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-emerald-700 block font-semibold">Medical Leave</span>
                  <span className="font-bold font-mono text-sm text-emerald-950">10 / 10</span>
                </div>
                <div className="p-2 bg-purple-50 rounded-xl border border-purple-100">
                  <span className="text-[10px] text-purple-700 block font-semibold">Duty / Earned</span>
                  <span className="font-bold font-mono text-sm text-purple-950">12 / 15</span>
                </div>
              </div>
            </div>

            {/* Sign Out to Role Selector */}
            <button
              onClick={signOut}
              className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out to Role Hub
            </button>
          </div>
        )}

        {/* SUB-VIEW 1: TIMETABLE */}
        {mobileTab === 'more_timetable' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                onClick={() => setMobileTab('more')}
                className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl hover:bg-blue-100"
              >
                <ChevronLeft className="w-4 h-4" /> Back to More
              </button>
              <h3 className="text-xs font-bold text-slate-800">Teaching Timetable</h3>
            </div>

            {/* Day Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const).map(day => (
                <button
                  key={day}
                  onClick={() => setTtSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                    ttSelectedDay === day
                      ? 'bg-blue-700 text-white font-bold shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>

            {/* Timetable Period Cards */}
            <div className="space-y-2">
              {[
                { period: 1, time: '08:30 - 09:15', standard: 8, section: 'A', subject: 'Mathematics', room: 'Room 204', type: 'Core Theory' },
                { period: 2, time: '09:15 - 10:00', standard: 8, section: 'B', subject: 'Mathematics', room: 'Room 205', type: 'Core Theory' },
                { period: 3, time: '10:15 - 11:00', standard: 9, section: 'A', subject: 'Mathematics', room: 'Room 302', type: 'Problem Solving' },
                { period: 5, time: '11:45 - 12:30', standard: 9, section: 'B', subject: 'Vedic Math', room: 'Room 303', type: 'Vedic Computation' }
              ].map(slot => (
                <div key={slot.period} className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 font-bold font-mono text-sm flex items-center justify-center shrink-0 border border-blue-200">
                      P{slot.period}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">Std {slot.standard}-{slot.section} · {slot.subject}</h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {slot.room}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{slot.time} · {slot.type}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-xs text-blue-900">
              <span className="font-bold block">Weekly Workload Allocation:</span>
              <p className="text-[11px] mt-0.5">22 teaching periods scheduled across Standards 8 & 9. Maximum allowable: 28 periods/week.</p>
            </div>
          </div>
        )}

        {/* SUB-VIEW 2: ASSIGNMENTS & HOMEWORK */}
        {mobileTab === 'more_assignments' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                onClick={() => setMobileTab('more')}
                className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl hover:bg-blue-100"
              >
                <ChevronLeft className="w-4 h-4" /> Back to More
              </button>
              <h3 className="text-xs font-bold text-slate-800">Homework & Tasks</h3>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Coursework Tasks</span>
              <button
                onClick={() => setShowAddAssignmentModal(true)}
                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Publish Task
              </button>
            </div>

            {/* Assignments List */}
            <div className="space-y-2.5">
              {assignments.map(asg => (
                <div key={asg.id} className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                          Std {asg.standard}-{asg.section}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          asg.status === 'published' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {asg.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{asg.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Subject: {asg.subject} · Due: {asg.dueDate}</p>
                    </div>
                    <button
                      onClick={() => setSelectedAsgForSubmissions(asg)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200"
                    >
                      Submissions
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                    <span>Turn-in Rate: {asg.submissionCount} / {asg.totalStudents}</span>
                    <span className="text-blue-700 font-semibold">{Math.round((asg.submissionCount / Math.max(1, asg.totalStudents)) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-VIEW 3: EXAMINATIONS & INVIGILATION */}
        {mobileTab === 'more_exams' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                onClick={() => setMobileTab('more')}
                className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl hover:bg-blue-100"
              >
                <ChevronLeft className="w-4 h-4" /> Back to More
              </button>
              <h3 className="text-xs font-bold text-slate-800">Exam Duties</h3>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setExamTabFilter('duties')}
                className={`py-1.5 rounded-lg transition-colors ${examTabFilter === 'duties' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
              >
                My Invigilation Duties
              </button>
              <button
                onClick={() => setExamTabFilter('datesheet')}
                className={`py-1.5 rounded-lg transition-colors ${examTabFilter === 'datesheet' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
              >
                Term Datesheet
              </button>
            </div>

            {examTabFilter === 'duties' ? (
              <div className="space-y-2.5">
                {[
                  { exam: 'Term 2 Final: Mathematics', date: '2026-11-04', session: 'Morning (09:00 - 12:00)', hall: 'Examination Hall 3', role: 'Chief Invigilator', standard: 'Class 8-A & 8-B' },
                  { exam: 'Term 2 Final: Vedic Math', date: '2026-11-08', session: 'Morning (09:00 - 11:30)', hall: 'Room 303', role: 'Hall Supervisor', standard: 'Class 9-B' }
                ].map((duty, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-bold border border-purple-200">
                          {duty.role}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">{duty.exam}</h4>
                        <p className="text-[11px] text-slate-500">{duty.hall} · {duty.standard}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-800">{duty.date}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl text-[11px] text-slate-600 font-mono">
                      Session: {duty.session}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-3 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">CBSE Term 2 Schedule</h4>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2 flex justify-between"><span>Nov 02, 2026</span><span className="font-semibold">English Core</span><span className="font-mono text-slate-500">Std 8-10</span></div>
                  <div className="py-2 flex justify-between"><span>Nov 04, 2026</span><span className="font-semibold text-blue-700">Mathematics</span><span className="font-mono text-slate-500">Std 8-10</span></div>
                  <div className="py-2 flex justify-between"><span>Nov 06, 2026</span><span className="font-semibold">Science</span><span className="font-mono text-slate-500">Std 8-10</span></div>
                  <div className="py-2 flex justify-between"><span>Nov 08, 2026</span><span className="font-semibold">Social Science / Vedic Math</span><span className="font-mono text-slate-500">Std 8-9</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUB-VIEW 4: MARKS & RESULTS ENTRY */}
        {mobileTab === 'more_marks' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                onClick={() => setMobileTab('more')}
                className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl hover:bg-blue-100"
              >
                <ChevronLeft className="w-4 h-4" /> Back to More
              </button>
              <h3 className="text-xs font-bold text-slate-800">Marks Entry Terminal</h3>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block font-semibold mb-0.5">Assigned Class</label>
                  <select
                    value={`${selectedClassStd}-${selectedClassSec}`}
                    onChange={e => {
                      const [std, sec] = e.target.value.split('-');
                      setSelectedClassStd(Number(std));
                      setSelectedClassSec(sec as 'A' | 'B');
                    }}
                    className="w-full p-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 text-xs"
                  >
                    <option value="8-A">Std 8-A (Math · Lead)</option>
                    <option value="8-B">Std 8-B (Math)</option>
                    <option value="9-A">Std 9-A (Math)</option>
                    <option value="9-B">Std 9-B (Vedic Math)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block font-semibold mb-0.5">Examination</label>
                  <select
                    value={marksExamName}
                    onChange={e => setMarksExamName(e.target.value)}
                    className="w-full p-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 text-xs"
                  >
                    <option value="Mid-Term Examination">Mid-Term Exam</option>
                    <option value="Unit Test 2">Unit Test 2</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Max Score: {marksMaxScore} Marks</span>
                <button
                  onClick={handleSaveMarksBatch}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" /> Save Scores
                </button>
              </div>
            </div>

            {/* In-app Marks Entry List */}
            <div className="space-y-2">
              {classStudents.map(s => {
                const item = enteredMarks[s.id] || { score: '', grade: '-' };
                const err = marksValidationErrors[s.id];
                return (
                  <div key={s.id} className="p-2.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                    <div>
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Roll #{s.rollNo} · {s.admissionNo}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <input
                          type="number"
                          min={0}
                          max={marksMaxScore}
                          value={item.score}
                          onChange={e => handleMarksScoreChange(s.id, e.target.value)}
                          className={`w-16 p-1.5 text-center font-mono font-bold text-xs rounded-xl border ${
                            err ? 'border-rose-500 bg-rose-50 text-rose-800' : 'border-slate-300 bg-slate-50'
                          }`}
                        />
                        {err && <span className="text-[9px] text-rose-600 block">{err}</span>}
                      </div>
                      <span className="w-8 text-center font-bold text-blue-700 text-xs font-mono">
                        {item.grade}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUB-VIEW 5: STUDENT PROGRESS & PROFILES */}
        {mobileTab === 'more_progress' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                onClick={() => setMobileTab('more')}
                className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl hover:bg-blue-100"
              >
                <ChevronLeft className="w-4 h-4" /> Back to More
              </button>
              <h3 className="text-xs font-bold text-slate-800">Academic Progress</h3>
            </div>

            {/* Class Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {(['8-A', '8-B', '9-A', '9-B'] as const).map(cls => (
                <button
                  key={cls}
                  onClick={() => {
                    const [std, sec] = cls.split('-');
                    setSelectedClassStd(Number(std));
                    setSelectedClassSec(sec as 'A' | 'B');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                    `${selectedClassStd}-${selectedClassSec}` === cls
                      ? 'bg-blue-700 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  Class {cls}
                </button>
              ))}
            </div>

            {/* Quick KPI stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Class Avg</span>
                <span className="font-bold font-mono text-slate-900 text-sm">84.8%</span>
              </div>
              <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Attendance</span>
                <span className="font-bold font-mono text-emerald-700 text-sm">92.4%</span>
              </div>
              <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Flags (&lt;75%)</span>
                <span className="font-bold font-mono text-rose-700 text-sm">
                  {classStudents.filter(s => s.attendanceRate < 75).length} Students
                </span>
              </div>
            </div>

            {/* Student Progress Cards */}
            <div className="space-y-2">
              {classStudents.map(s => {
                const isAtRisk = s.attendanceRate < 75;
                return (
                  <div key={s.id} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs">{s.name}</span>
                        {isAtRisk && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                            Low Attendance
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Roll #{s.rollNo} · Attn: <span className={isAtRisk ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>{s.attendanceRate}%</span> · Grade: A
                      </div>
                    </div>

                    <button
                      onClick={() => setViewingStudent(s)}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200"
                    >
                      Dossier
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUB-VIEW 6: ANNOUNCEMENTS & CIRCULARS */}
        {mobileTab === 'more_notices' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                onClick={() => setMobileTab('more')}
                className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl hover:bg-blue-100"
              >
                <ChevronLeft className="w-4 h-4" /> Back to More
              </button>
              <h3 className="text-xs font-bold text-slate-800">Staff Announcements</h3>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['all', 'Academic', 'Administrative', 'Examination', 'Event'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setNoticeCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                    noticeCategoryFilter === cat
                      ? 'bg-blue-700 text-white font-bold shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {cat === 'all' ? 'All Notices' : cat}
                </button>
              ))}
            </div>

            {/* Notices Feed */}
            <div className="space-y-2.5">
              {notices
                .filter(n => noticeCategoryFilter === 'all' || n.category === noticeCategoryFilter)
                .map(notice => (
                  <div key={notice.id} className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold uppercase border border-blue-100">
                        {notice.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{notice.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{notice.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      Author: {notice.author}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* SUB-VIEW 7: PROFILE & SETTINGS */}
        {mobileTab === 'more_settings' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                onClick={() => setMobileTab('more')}
                className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl hover:bg-blue-100"
              >
                <ChevronLeft className="w-4 h-4" /> Back to More
              </button>
              <h3 className="text-xs font-bold text-slate-800">Faculty Settings</h3>
            </div>

            {/* Faculty Dossier Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 text-xs">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Faculty Placement</h4>
              <div className="space-y-1.5 text-slate-700 pt-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Class Teacher:</span>
                  <span className="font-semibold text-slate-900">Standard 8 - Section A</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-semibold text-slate-900">Mathematics & Computing</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Assigned Classes:</span>
                  <span className="font-mono font-semibold text-blue-700">8-A, 8-B, 9-A, 9-B</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Official Email:</span>
                  <span className="font-mono text-slate-800">shalini.verma@greenfield.edu</span>
                </div>
              </div>
            </div>

            {/* 12-PALETTE COLOR THEME SELECTOR */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-blue-700" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Interface Theme</h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400">12 Palettes</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Tap any SCHLAR enterprise theme to switch real-time accents and styles across the entire application.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {SCHLAR_PALETTES.map(p => {
                  const isSelected = activePaletteId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePaletteId(p.id);
                        applyThemeToDom(p.colors);
                        saveStoredActivePaletteId(p.id);
                        saveStoredActiveColors(p.colors);
                        showToast(`Switched interface theme to ${p.name}`, 'info');
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'border-blue-700 bg-blue-50/70 shadow-xs'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full shrink-0 shadow-2xs border border-white"
                        style={{ backgroundColor: p.colors.primary }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-slate-900 truncate">{p.name}</div>
                        <div className="text-[9px] text-slate-400 font-mono truncate">{p.colors.primary}</div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-700 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Teaching Preferences */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5 text-xs">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Preferences</h4>
              <div className="space-y-2 text-slate-700">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Substitution alerts via Push notification</span>
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Highlight students with attendance &lt; 75%</span>
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Tab Navigation (Strict 4-Destination bar) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around h-16 px-2">
        <button
          onClick={() => setMobileTab('home')}
          className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-colors ${
            mobileTab === 'home' ? 'text-blue-700 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-1">Home</span>
        </button>

        <button
          onClick={() => setMobileTab('classes')}
          className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-colors ${
            mobileTab === 'classes' ? 'text-blue-700 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-1">Classes</span>
        </button>

        <button
          onClick={() => setMobileTab('attendance')}
          className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-colors ${
            mobileTab === 'attendance' ? 'text-blue-700 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span className="text-[10px] mt-1">Attendance</span>
        </button>

        <button
          onClick={() => setMobileTab('more')}
          className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-colors ${
            mobileTab === 'more' || mobileTab.startsWith('more_') ? 'text-blue-700 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] mt-1">More</span>
        </button>
      </nav>

      {/* STUDENT DOSSIER MODAL (Strictly teaching-permitted info only) */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold font-mono flex items-center justify-center">
                  #{viewingStudent.rollNo}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{viewingStudent.name}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {viewingStudent.admissionNo} · Std {viewingStudent.standard}-{viewingStudent.section}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Academic Snapshot */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">Attendance Rate</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">{viewingStudent.attendanceRate}%</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">Blood Group</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{viewingStudent.bloodGroup || 'B+'}</span>
              </div>
            </div>

            {/* Medical / Emergency Note (Authorized for teachers) */}
            {viewingStudent.medicalAlerts && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-0.5">
                <span className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                  Health Alert
                </span>
                <p className="text-[11px]">{viewingStudent.medicalAlerts}</p>
              </div>
            )}

            {/* Emergency Contact */}
            <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
              <span className="font-bold text-slate-700 block">Emergency & Guardian Contact:</span>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Guardian Name:</span>
                <span className="font-semibold text-slate-800">{viewingStudent.parentName}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Contact Number:</span>
                <span className="font-mono font-semibold text-slate-800">{viewingStudent.parentPhone}</span>
              </div>
            </div>

            {/* RBAC Notice (Explicitly affirming no financial / bank info exposure) */}
            <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 pt-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>FERPA Scope: Restricted to authorized academic profile</span>
            </div>

            <button
              onClick={() => setViewingStudent(null)}
              className="w-full py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}

      {/* CREATE HOMEWORK MODAL */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Publish New Homework</h3>
              <button
                onClick={() => setShowAddAssignmentModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignmentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Homework Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4 Practice Exercises"
                  value={newAsgTitle}
                  onChange={e => setNewAsgTitle(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Class</label>
                  <select
                    value={`${selectedClassStd}-${selectedClassSec}`}
                    onChange={e => {
                      const [std, sec] = e.target.value.split('-');
                      setSelectedClassStd(Number(std));
                      setSelectedClassSec(sec as 'A' | 'B');
                    }}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="8-A">Std 8-A (Math · Lead)</option>
                    <option value="8-B">Std 8-B (Math)</option>
                    <option value="9-A">Std 9-A (Math)</option>
                    <option value="9-B">Std 9-B (Vedic Math)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newAsgDue}
                    onChange={e => setNewAsgDue(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Instructions / Description</label>
                <textarea
                  rows={2}
                  placeholder="Solve questions 1 through 10 from textbook page 84..."
                  value={newAsgDesc}
                  onChange={e => setNewAsgDesc(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-slate-700">Publication Status:</span>
                <select
                  value={newAsgStatus}
                  onChange={e => setNewAsgStatus(e.target.value as any)}
                  className="p-1 rounded-lg border border-slate-200 font-bold text-xs"
                >
                  <option value="published">Publish to Parents & Students</option>
                  <option value="draft">Save as Draft Only</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAssignmentModal(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-2xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMISSION REVIEW MODAL */}
      {selectedAsgForSubmissions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3.5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedAsgForSubmissions.title}</h3>
                <p className="text-[11px] text-slate-500">Student Submissions & Mark Review</p>
              </div>
              <button
                onClick={() => setSelectedAsgForSubmissions(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {classStudents.slice(0, 6).map(s => {
                const draft = assignmentFeedbackDraft[s.id] || { marks: 22, feedback: 'Well written calculations.' };
                return (
                  <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900">{s.name} (Roll #{s.rollNo})</span>
                      <span className="text-emerald-700 font-mono text-[11px]">Submitted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px]">Marks:</span>
                      <input
                        type="number"
                        min={0}
                        max={25}
                        value={draft.marks}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setAssignmentFeedbackDraft(prev => ({
                            ...prev,
                            [s.id]: { ...draft, marks: val }
                          }));
                        }}
                        className="w-14 p-1 rounded-lg border border-slate-300 font-mono text-center font-bold text-xs bg-white"
                      />
                      <span className="text-[10px] text-slate-400">/ 25</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Teacher feedback..."
                      value={draft.feedback}
                      onChange={e => {
                        const fb = e.target.value;
                        setAssignmentFeedbackDraft(prev => ({
                          ...prev,
                          [s.id]: { ...draft, feedback: fb }
                        }));
                      }}
                      className="w-full p-1 text-[11px] rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setSelectedAsgForSubmissions(null);
                setAttendanceSuccessToast('Homework feedback & marks recorded.');
                setTimeout(() => setAttendanceSuccessToast(null), 3000);
              }}
              className="w-full py-2 bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs"
            >
              Return Evaluated Feedback
            </button>
          </div>
        </div>
      )}

      {/* APPLY FACULTY LEAVE MODAL */}
      {showApplyLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Apply for Faculty Leave</h3>
              <button
                onClick={() => setShowApplyLeaveModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyLeaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Leave Classification</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Casual Leave">Casual Leave (8 Remaining)</option>
                  <option value="Sick Leave">Sick / Medical Leave (10 Remaining)</option>
                  <option value="Academic / Duty Leave">Academic / Duty Leave</option>
                  <option value="Maternity / Paternity">Maternity / Paternity Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={leaveStart}
                    onChange={e => setLeaveStart(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={leaveEnd}
                    onChange={e => setLeaveEnd(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason for Leave</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Attending CBSE Mathematics Pedagogy Workshop..."
                  value={leaveReason}
                  onChange={e => setLeaveReason(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-200/80 text-[11px] text-blue-900">
                <span className="font-bold block">Academic Policy Note:</span>
                <span>The Academic Coordinator / Vice Principal will assign temporary period substitutions for your scheduled classes.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApplyLeaveModal(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-2xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISCREPANCIES REVIEW MODAL */}
      {showDiscrepanciesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3.5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Attendance Inquiries</h3>
              <button
                onClick={() => setShowDiscrepanciesModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {attendanceDiscrepancies.map(d => (
                <div key={d.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900">{d.studentName}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">Date: {d.date}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      d.status === 'reviewed' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 italic">"{d.reason}"</p>
                  {d.responseNote && (
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                      Response: {d.responseNote}
                    </div>
                  )}
                  {d.status === 'pending' && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          updateAttendanceDiscrepancy(d.id, 'reviewed', 'Verified and reconciled with bus log.');
                        }}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px]"
                      >
                        Accept & Reconcile
                      </button>
                      <button
                        onClick={() => {
                          updateAttendanceDiscrepancy(d.id, 'rejected', 'Absence confirmed by assembly supervisor.');
                        }}
                        className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px]"
                      >
                        Maintain Record
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowDiscrepanciesModal(false)}
              className="w-full py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CONFIRM MARK ALL PRESENT MODAL */}
      {confirmMarkAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-2xl border border-slate-200 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-bold">
              <CheckCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Mark Entire Class Present?</h4>
            <p className="text-xs text-slate-500">
              This will set all {classStudents.length} students in Class {selectedClassStd}-{selectedClassSec} to Present.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setConfirmMarkAllModal(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMarkAll}
                className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS TRAY */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-xs p-4 pt-16 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900">Faculty Notifications</h4>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-900 block">Timetable Period 4 Coverage</span>
                <span className="text-[11px] text-blue-700">Substitution assigned for Std 9-B Physics today.</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-900 block">Mid-Term Grade Submission</span>
                <span className="text-[11px] text-slate-500">Due Friday, Oct 23rd before 04:00 PM.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS TOASTS */}
      {attendanceSuccessToast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-emerald-900 text-white text-xs p-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{attendanceSuccessToast}</span>
        </div>
      )}

      {marksSavedToast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-blue-900 text-white text-xs p-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Award className="w-4 h-4 text-blue-300 shrink-0" />
          <span>Mid-Term examination marks updated and published!</span>
        </div>
      )}

      {leaveSuccessToast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-slate-900 text-white text-xs p-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Faculty leave request submitted to Academic Coordinator!</span>
        </div>
      )}
    </div>
  );
};
