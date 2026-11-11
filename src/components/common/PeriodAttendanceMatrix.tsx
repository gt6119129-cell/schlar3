import React, { useState, useMemo, useEffect } from 'react';
import {
  UserCheck,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Search,
  Filter,
  Check,
  X,
  RotateCcw,
  Save,
  Send,
  Eye,
  Lock,
  ChevronDown,
  Sparkles,
  FileCheck,
  Download,
  BookOpen,
  Info,
  HelpCircle,
  Users
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import {
  Student,
  TimetableSlot,
  AttendanceRecord,
  AttendanceSessionEntity,
  RoleType
} from '../../types/school';
import { getThemeClasses } from '../../utils/themeHelper';
import { StudentProfileModal } from './StudentProfileModal';

export interface PeriodAttendanceMatrixProps {
  initialClass?: string;
  initialDate?: string;
  allowedClasses?: string[];
  readOnly?: boolean;
}

export const PeriodAttendanceMatrix: React.FC<PeriodAttendanceMatrixProps> = ({
  initialClass = '8-A',
  initialDate,
  allowedClasses,
  readOnly = false
}) => {
  const {
    currentRole,
    themeColor,
    students,
    teachers,
    timetables,
    attendance,
    attendanceSessions,
    correctionRequests,
    saveAttendanceSession,
    submitCorrectionRequest,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Class and Date Selection State
  const [selectedClassStr, setSelectedClassStr] = useState<string>(initialClass);
  const [selectedDate, setSelectedDate] = useState<string>(
    () => initialDate || new Date().toISOString().split('T')[0]
  );
  const [academicYear, setAcademicYear] = useState<string>('2026–2027');
  const [term, setTerm] = useState<string>('Term 2');

  // Breakdown standard and section
  const [selectedStd, selectedSec] = useMemo(() => {
    const parts = selectedClassStr.split('-');
    return [parseInt(parts[0], 10) || 8, (parts[1] as 'A' | 'B') || 'A'];
  }, [selectedClassStr]);

  // Enrolled students for selected class
  const classStudents = useMemo(() => {
    return students
      .filter(s => s.standard === selectedStd && s.section === selectedSec && s.status === 'Active')
      .sort((a, b) => a.rollNo - b.rollNo);
  }, [students, selectedStd, selectedSec]);

  // Calculate day of week for selected date
  const dayOfWeek = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(selectedDate + 'T00:00:00');
    return days[d.getDay()] || 'Monday';
  }, [selectedDate]);

  // Load scheduled timetable slots for this class and day of week
  const scheduledPeriods = useMemo(() => {
    const slots = timetables
      .filter(t => t.standard === selectedStd && t.section === selectedSec && t.day === dayOfWeek)
      .sort((a, b) => a.period - b.period);

    if (slots.length > 0) return slots;

    // Fallback standard 6-period school day if timetable has no slots for Sunday/custom date
    return [
      { id: 'def-1', standard: selectedStd, section: selectedSec, day: dayOfWeek, period: 1, time: '08:30 - 09:15', subject: 'Mathematics', teacherName: 'Mrs. Shalini Verma', teacherId: 'tch-01', room: 'Room 204' },
      { id: 'def-2', standard: selectedStd, section: selectedSec, day: dayOfWeek, period: 2, time: '09:15 - 10:00', subject: 'Science', teacherName: 'Dr. Alok Sen', teacherId: 'tch-02', room: 'Physics Lab' },
      { id: 'def-3', standard: selectedStd, section: selectedSec, day: dayOfWeek, period: 3, time: '10:15 - 11:00', subject: 'English', teacherName: "Ms. Rebecca D'Souza", teacherId: 'tch-03', room: 'Room 204' },
      { id: 'def-4', standard: selectedStd, section: selectedSec, day: dayOfWeek, period: 4, time: '11:00 - 11:45', subject: 'Social Studies', teacherName: 'Mr. Arvind Saxena', teacherId: 'tch-04', room: 'Room 204' },
      { id: 'def-5', standard: selectedStd, section: selectedSec, day: dayOfWeek, period: 5, time: '12:30 - 01:15', subject: 'Computer Science', teacherName: 'Ms. Neha Gupta', teacherId: 'tch-05', room: 'Computer Lab' },
      { id: 'def-6', standard: selectedStd, section: selectedSec, day: dayOfWeek, period: 6, time: '01:15 - 02:00', subject: 'Physical Education', teacherName: 'Coach Vikram Rawat', teacherId: 'tch-07', room: 'Main Field' }
    ] as TimetableSlot[];
  }, [timetables, selectedStd, selectedSec, dayOfWeek]);

  // Active period column selected for single-period bulk actions
  const [selectedPeriodNum, setSelectedPeriodNum] = useState<number>(1);

  // Sync selectedPeriodNum when periods change
  useEffect(() => {
    if (scheduledPeriods.length > 0) {
      if (!scheduledPeriods.some(p => p.period === selectedPeriodNum)) {
        setSelectedPeriodNum(scheduledPeriods[0].period);
      }
    }
  }, [scheduledPeriods, selectedPeriodNum]);

  // Matrix marks state: key is `${studentId}-p${period}` => 'present' | 'absent' | 'not_marked'
  const [matrixMarks, setMatrixMarks] = useState<Record<string, AttendanceRecord['status']>>({});
  const [matrixRemarks, setMatrixRemarks] = useState<Record<string, string>>({});

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent' | 'not_marked' | 'at_risk'>('all');

  // Modals state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [confirmAllPresentModal, setConfirmAllPresentModal] = useState(false);
  const [confirmClearModal, setConfirmClearModal] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Correction request modal state
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [correctionTarget, setCorrectionTarget] = useState<{
    student: Student;
    period: number;
    currentStatus: AttendanceRecord['status'];
  } | null>(null);
  const [correctionProposedStatus, setCorrectionProposedStatus] = useState<AttendanceRecord['status']>('present');
  const [correctionReason, setCorrectionReason] = useState('');

  // Synchronize matrix marks whenever Class, Date, or underlying attendance changes
  useEffect(() => {
    const newMarks: Record<string, AttendanceRecord['status']> = {};
    const newRemarks: Record<string, string> = {};

    classStudents.forEach(student => {
      scheduledPeriods.forEach(slot => {
        const key = `${student.id}-p${slot.period}`;
        // Find existing record matching student, date, and period
        const existing = attendance.find(
          a => a.studentId === student.id && a.date === selectedDate && a.period === slot.period
        );

        if (existing) {
          newMarks[key] = existing.status;
          if (existing.remarks) newRemarks[key] = existing.remarks;
        } else {
          // If no period record exists yet, check if there's a morning roll-call record as fallback for Period 1
          const morningRec = attendance.find(
            a => a.studentId === student.id && a.date === selectedDate && (a.session === 'morning' || !a.session)
          );
          if (slot.period === 1 && morningRec) {
            newMarks[key] = morningRec.status === 'not_marked' ? 'not_marked' : morningRec.status;
          } else {
            newMarks[key] = 'not_marked';
          }
        }
      });
    });

    setMatrixMarks(newMarks);
    setMatrixRemarks(newRemarks);
  }, [selectedStd, selectedSec, selectedDate, classStudents, scheduledPeriods, attendance]);

  // Session entity lookup for each scheduled period
  const periodSessionEntities = useMemo(() => {
    const map: Record<number, AttendanceSessionEntity | undefined> = {};
    scheduledPeriods.forEach(slot => {
      const sessionId = `${selectedStd}-${selectedSec}-${selectedDate}-period_${slot.period}`;
      const found = attendanceSessions.find(s => s.id === sessionId);
      map[slot.period] = found;
    });
    return map;
  }, [attendanceSessions, selectedStd, selectedSec, selectedDate, scheduledPeriods]);

  // Currently active slot object
  const activeSlot = useMemo(() => {
    return scheduledPeriods.find(p => p.period === selectedPeriodNum) || scheduledPeriods[0];
  }, [scheduledPeriods, selectedPeriodNum]);

  // Current session entity for active period
  const activePeriodEntity = periodSessionEntities[selectedPeriodNum];
  const isPeriodSubmitted = activePeriodEntity?.status === 'submitted';

  // Toggle mark for single student-period cell
  const handleCellClick = (student: Student, periodNum: number) => {
    const isSubmitted = periodSessionEntities[periodNum]?.status === 'submitted';
    const key = `${student.id}-p${periodNum}`;
    const current = matrixMarks[key] || 'not_marked';

    if (isSubmitted) {
      // If already submitted, open correction workflow
      setCorrectionTarget({
        student,
        period: periodNum,
        currentStatus: current
      });
      setCorrectionProposedStatus(current === 'present' ? 'absent' : 'present');
      setCorrectionReason('');
      setCorrectionModalOpen(true);
      return;
    }

    if (readOnly) return;

    // Cycle status: not_marked -> present -> absent -> not_marked
    let next: AttendanceRecord['status'] = 'present';
    if (current === 'present') next = 'absent';
    else if (current === 'absent') next = 'not_marked';
    else next = 'present';

    setMatrixMarks(prev => ({ ...prev, [key]: next }));
  };

  // Explicit status set for single cell
  const handleSetCellStatus = (
    studentId: string,
    periodNum: number,
    status: AttendanceRecord['status']
  ) => {
    const isSubmitted = periodSessionEntities[periodNum]?.status === 'submitted';
    if (isSubmitted || readOnly) return;

    const key = `${studentId}-p${periodNum}`;
    setMatrixMarks(prev => ({ ...prev, [key]: status }));
  };

  // Selected period statistics calculation
  const periodStats = useMemo(() => {
    const map: Record<number, {
      total: number;
      present: number;
      absent: number;
      notMarked: number;
      marked: number;
      completion: number;
      absentStudents: Array<{ id: string; name: string; rollNo: number; admissionNo: string }>;
    }> = {};

    scheduledPeriods.forEach(slot => {
      let present = 0;
      let absent = 0;
      let notMarked = 0;
      const absentStudents: Array<{ id: string; name: string; rollNo: number; admissionNo: string }> = [];

      classStudents.forEach(student => {
        const key = `${student.id}-p${slot.period}`;
        const st = matrixMarks[key] || 'not_marked';
        if (st === 'present') present++;
        else if (st === 'absent') {
          absent++;
          absentStudents.push({
            id: student.id,
            name: student.name,
            rollNo: student.rollNo,
            admissionNo: student.admissionNo
          });
        } else {
          notMarked++;
        }
      });

      const total = classStudents.length;
      const marked = present + absent;
      const completion = total > 0 ? Math.round((marked / total) * 100) : 0;

      map[slot.period] = {
        total,
        present,
        absent,
        notMarked,
        marked,
        completion,
        absentStudents
      };
    });

    return map;
  }, [scheduledPeriods, classStudents, matrixMarks]);

  const activeStats = periodStats[selectedPeriodNum] || {
    total: classStudents.length,
    present: 0,
    absent: 0,
    notMarked: classStudents.length,
    marked: 0,
    completion: 0,
    absentStudents: []
  };

  // Column Actions
  const handleTriggerMarkAllPresent = () => {
    if (isPeriodSubmitted) {
      showToast('Period attendance has already been finalized and locked.', 'warning');
      return;
    }
    // Check if there are existing absentees in this period
    if (activeStats.absent > 0) {
      setConfirmAllPresentModal(true);
    } else {
      executeMarkAllPresent();
    }
  };

  const executeMarkAllPresent = () => {
    const updated = { ...matrixMarks };
    classStudents.forEach(s => {
      updated[`${s.id}-p${selectedPeriodNum}`] = 'present';
    });
    setMatrixMarks(updated);
    setConfirmAllPresentModal(false);
    showToast(`Marked all students Present for Period ${selectedPeriodNum}.`, 'info');
  };

  const handleTriggerClearPeriod = () => {
    if (isPeriodSubmitted) {
      showToast('Period attendance has already been finalized and locked.', 'warning');
      return;
    }
    setConfirmClearModal(true);
  };

  const executeClearPeriod = () => {
    const updated = { ...matrixMarks };
    classStudents.forEach(s => {
      updated[`${s.id}-p${selectedPeriodNum}`] = 'not_marked';
    });
    setMatrixMarks(updated);
    setConfirmClearModal(false);
    showToast(`Reset draft marks for Period ${selectedPeriodNum}.`, 'info');
  };

  // Save Draft for Selected Period
  const handleSaveDraft = () => {
    const records = classStudents.map(s => {
      const key = `${s.id}-p${selectedPeriodNum}`;
      return {
        studentId: s.id,
        studentName: s.name,
        rollNo: s.rollNo,
        status: matrixMarks[key] || 'not_marked',
        period: selectedPeriodNum,
        remarks: matrixRemarks[key] || ''
      };
    });

    const res = saveAttendanceSession({
      standard: selectedStd,
      section: selectedSec,
      date: selectedDate,
      session: `period_${selectedPeriodNum}`,
      period: selectedPeriodNum,
      isDraft: true,
      records,
      submittedByName: currentRole === 'teacher_web' ? 'Mrs. Shalini Verma' : 'Prof. Marcus Vance'
    });

    showToast(`Period ${selectedPeriodNum} draft saved (${records.length} records).`, 'success');
  };

  // Submit Period Attendance
  const handleOpenReviewModal = () => {
    setReviewModalOpen(true);
  };

  const handleFinalSubmitPeriod = () => {
    if (activeStats.notMarked > 0) {
      showToast(`Cannot submit: ${activeStats.notMarked} student(s) remain Not Marked. Complete marking or save as draft.`, 'warning');
      return;
    }

    const records = classStudents.map(s => {
      const key = `${s.id}-p${selectedPeriodNum}`;
      return {
        studentId: s.id,
        studentName: s.name,
        rollNo: s.rollNo,
        status: matrixMarks[key] || 'not_marked',
        period: selectedPeriodNum,
        remarks: matrixRemarks[key] || ''
      };
    });

    saveAttendanceSession({
      standard: selectedStd,
      section: selectedSec,
      date: selectedDate,
      session: `period_${selectedPeriodNum}`,
      period: selectedPeriodNum,
      isDraft: false,
      records,
      submittedByName: currentRole === 'teacher_web' ? 'Mrs. Shalini Verma' : 'Prof. Marcus Vance'
    });

    setReviewModalOpen(false);
    showToast(`Period ${selectedPeriodNum} attendance successfully verified and locked!`, 'success');
  };

  // Correction Request Submission
  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionTarget || !correctionReason.trim()) {
      showToast('Please provide a substantive reason for the correction.', 'warning');
      return;
    }

    submitCorrectionRequest({
      studentId: correctionTarget.student.id,
      studentName: correctionTarget.student.name,
      standard: selectedStd,
      section: selectedSec,
      date: selectedDate,
      session: `Period ${correctionTarget.period}`,
      originalStatus: correctionTarget.currentStatus,
      requestedStatus: correctionProposedStatus as any,
      reason: correctionReason,
      requestedByRole: currentRole as RoleType,
      requestedByName: currentRole === 'teacher_web' ? 'Mrs. Shalini Verma' : 'Faculty Member'
    });

    setCorrectionModalOpen(false);
    setCorrectionTarget(null);
    setCorrectionReason('');
  };

  // Filtered Students for Matrix display
  const filteredStudents = useMemo(() => {
    return classStudents.filter(student => {
      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.admissionNo.toLowerCase().includes(q) ||
        student.rollNo.toString().includes(q);

      if (!matchSearch) return false;

      // Status filter relative to active selected period
      if (statusFilter === 'all') return true;
      if (statusFilter === 'at_risk') return student.attendanceRate < 85;

      const key = `${student.id}-p${selectedPeriodNum}`;
      const st = matrixMarks[key] || 'not_marked';
      return st === statusFilter;
    });
  }, [classStudents, searchQuery, statusFilter, selectedPeriodNum, matrixMarks]);

  // Derived Daily Summary for each student
  const studentDailyTallies = useMemo(() => {
    const tallies: Record<string, { present: number; absent: number; notMarked: number; total: number; dailyStatus: string }> = {};

    classStudents.forEach(student => {
      let pCount = 0;
      let aCount = 0;
      let uCount = 0;

      scheduledPeriods.forEach(slot => {
        const key = `${student.id}-p${slot.period}`;
        const st = matrixMarks[key] || 'not_marked';
        if (st === 'present') pCount++;
        else if (st === 'absent') aCount++;
        else uCount++;
      });

      const total = scheduledPeriods.length;
      let dailyStatus = 'Not Marked';
      if (pCount === total && total > 0) dailyStatus = 'Full Day';
      else if (pCount >= total / 2) dailyStatus = 'Present';
      else if (pCount > 0) dailyStatus = 'Half Day';
      else if (aCount === total && total > 0) dailyStatus = 'Absent';
      else if (uCount === total) dailyStatus = 'Not Marked';
      else dailyStatus = `${pCount}/${total} P`;

      tallies[student.id] = {
        present: pCount,
        absent: aCount,
        notMarked: uCount,
        total,
        dailyStatus
      };
    });

    return tallies;
  }, [classStudents, scheduledPeriods, matrixMarks]);

  // Class list options (Teacher or School Admin)
  const availableClassOptions = useMemo(() => {
    if (allowedClasses && allowedClasses.length > 0) {
      return allowedClasses;
    }
    return ['8-A', '8-B', '9-A', '9-B', '10-A', '5-B', '6-A', '7-A'];
  }, [allowedClasses]);

  return (
    <div className="space-y-4">
      {/* 1. TOP SELECTORS & ACTION CONTROLS CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>Student-by-Period Attendance Matrix</span>
                  <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Period Matrix View
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Simultaneous horizontal timetable roll-call · Independent period tracking with draft and submission governance
                </p>
              </div>
            </div>
          </div>

          {/* Quick Date Jumps & Status Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Class Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {availableClassOptions.map(cls => (
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

            {/* Date Controls with Today & Yesterday Shortcuts */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(d.toISOString().split('T')[0]);
                }}
                className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded-lg text-[11px] font-semibold"
                title="Previous Day"
              >
                Yesterday
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="px-2 py-1 bg-white text-blue-700 shadow-2xs border border-slate-200 rounded-lg text-[11px] font-bold"
              >
                Today
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="text-xs py-1 px-2 border-0 bg-transparent font-mono text-slate-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Schedule Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-700">
              📅 {dayOfWeek}, {selectedDate}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600">
              Academic Session: <strong>{academicYear}</strong> ({term})
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600">
              Lead Class Faculty: <strong>Mrs. Shalini Verma</strong>
            </span>
            <span className="text-slate-400">·</span>
            <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-bold">
              {scheduledPeriods.length} Scheduled Periods Today
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Active Action Focus:</span>
            <select
              value={selectedPeriodNum}
              onChange={e => setSelectedPeriodNum(Number(e.target.value))}
              className="text-xs font-bold py-1 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 shadow-2xs"
            >
              {scheduledPeriods.map(p => (
                <option key={p.period} value={p.period}>
                  Period {p.period}: {p.subject} ({p.time})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. PERIOD-SPECIFIC COMMAND BAR & STATUS HUD */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="border-r border-slate-700 pr-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-mono text-xs font-bold border border-blue-400/30">
                Period {selectedPeriodNum}
              </span>
              <h3 className="font-bold text-sm text-white">
                {activeSlot.subject}
              </h3>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
              ⏱ {activeSlot.time} · 📍 {activeSlot.room || 'Room 204'} · 👤 {activeSlot.teacherName}
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-3 text-xs">
            <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total</span>
              <strong className="text-base font-bold font-mono text-white leading-tight">
                {activeStats.total}
              </strong>
            </div>
            <div className="bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/60">
              <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Present</span>
              <strong className="text-base font-bold font-mono text-emerald-300 leading-tight">
                {activeStats.present}
              </strong>
            </div>
            <div className="bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-800/60">
              <span className="text-[10px] text-rose-400 uppercase font-semibold block">Absent</span>
              <strong className="text-base font-bold font-mono text-rose-300 leading-tight">
                {activeStats.absent}
              </strong>
            </div>
            <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Unmarked</span>
              <strong className={`text-base font-bold font-mono leading-tight ${activeStats.notMarked > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {activeStats.notMarked}
              </strong>
            </div>
            <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Completion</span>
              <strong className={`text-base font-bold font-mono leading-tight ${activeStats.completion === 100 ? 'text-emerald-400' : 'text-amber-300'}`}>
                {activeStats.completion}%
              </strong>
            </div>
          </div>
        </div>

        {/* Action Buttons for Period */}
        <div className="flex flex-wrap items-center gap-2 justify-end">
          {isPeriodSubmitted ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Period {selectedPeriodNum} Submitted</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                ({activePeriodEntity?.submittedBy || 'Faculty'})
              </span>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleTriggerMarkAllPresent}
                disabled={readOnly}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
                title={`Mark all students Present for Period ${selectedPeriodNum} only`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark All Present</span>
              </button>

              <button
                type="button"
                onClick={handleTriggerClearPeriod}
                disabled={readOnly}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 disabled:opacity-50"
                title={`Clear all marks for Period ${selectedPeriodNum} only`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={readOnly}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
              >
                <Save className="w-3.5 h-3.5 text-blue-400" />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={handleOpenReviewModal}
                disabled={readOnly}
                className="px-4 py-1.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Review & Submit</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3. SEARCH & MATRIX DISPLAY FILTERS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or roll #..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter relative to Active Period */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 text-xs font-semibold text-slate-600">
            <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Filter Period {selectedPeriodNum}:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              All ({classStudents.length})
            </button>
            <button
              onClick={() => setStatusFilter('present')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === 'present' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Present ({activeStats.present})
            </button>
            <button
              onClick={() => setStatusFilter('absent')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === 'absent' ? 'bg-rose-700 text-white shadow-xs' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              Absent ({activeStats.absent})
            </button>
            <button
              onClick={() => setStatusFilter('not_marked')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === 'not_marked' ? 'bg-slate-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Unmarked ({activeStats.notMarked})
            </button>
            <button
              onClick={() => setStatusFilter('at_risk')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === 'at_risk' ? 'bg-rose-900 text-white shadow-xs' : 'bg-rose-50/70 text-rose-900 border border-rose-200'
              }`}
              title="Students with cumulative rate < 85%"
            >
              ⚠️ At-Risk ({classStudents.filter(s => s.attendanceRate < 85).length})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end text-xs text-slate-500">
          <span className="font-mono">
            Showing {filteredStudents.length} of {classStudents.length} students
          </span>
        </div>
      </div>

      {/* 4. MAIN ATTENDANCE MATRIX TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold">
                {/* Fixed/Sticky Student Column */}
                <th className="py-3 px-3.5 sticky left-0 z-10 bg-slate-100/95 backdrop-blur-xs min-w-[200px] border-r border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span>Student Dossier</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Roll #</span>
                  </div>
                </th>

                {/* Period Columns */}
                {scheduledPeriods.map(slot => {
                  const isActive = slot.period === selectedPeriodNum;
                  const entity = periodSessionEntities[slot.period];
                  const isSubmitted = entity?.status === 'submitted';
                  const isDraft = entity?.status === 'draft';
                  const stat = periodStats[slot.period];

                  return (
                    <th
                      key={slot.period}
                      onClick={() => setSelectedPeriodNum(slot.period)}
                      className={`py-2.5 px-3 min-w-[145px] text-center cursor-pointer transition-all border-r border-slate-200 ${
                        isActive
                          ? 'bg-blue-50/80 ring-2 ring-blue-500 ring-inset'
                          : 'hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            P{slot.period}
                          </span>
                          {isSubmitted ? (
                            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5" title="Submitted & Verified">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Done</span>
                            </span>
                          ) : isDraft ? (
                            <span className="text-[10px] text-amber-700 font-semibold" title="Draft saved">
                              Draft
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              Open
                            </span>
                          )}
                        </div>

                        <div className="font-bold text-slate-900 truncate" title={slot.subject}>
                          {slot.subject}
                        </div>

                        <div className="text-[10px] text-slate-500 font-mono">
                          {slot.time.split(' - ')[0]}
                        </div>

                        {/* Progress meter in header */}
                        {stat && (
                          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-200/60">
                            <span className="text-emerald-700 font-bold">{stat.present}P</span>
                            <span className="text-rose-700 font-bold">{stat.absent}A</span>
                            <span className="text-slate-400">{stat.completion}%</span>
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}

                {/* Final Column: Daily Summary */}
                <th className="py-3 px-3 text-center min-w-[110px] bg-slate-50 font-bold border-l border-slate-200">
                  <span>Daily Tally</span>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={scheduledPeriods.length + 2}
                    className="py-12 text-center text-slate-400 bg-white"
                  >
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">No students match current search or filters.</p>
                    <p className="text-xs text-slate-400">Try clearing the search query or selecting 'All' students.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const daily = studentDailyTallies[student.id];
                  const isAtRisk = student.attendanceRate < 85;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Fixed Left Student Dossier Cell */}
                      <td className="py-2.5 px-3.5 sticky left-0 z-10 bg-white hover:bg-slate-50/90 border-r border-slate-200 shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setViewingStudent(student)}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 font-bold flex items-center justify-center text-xs shrink-0 transition-colors"
                            title="View Student Profile"
                          >
                            {student.name.charAt(0)}
                          </button>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                onClick={() => setViewingStudent(student)}
                                className="font-bold text-slate-900 hover:text-blue-700 cursor-pointer truncate block"
                                title="Open Student Profile"
                              >
                                {student.name}
                              </span>
                              {isAtRisk && (
                                <span className="text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-1 py-0.2 rounded shrink-0">
                                  Risk
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                              <span>#{student.rollNo}</span>
                              <span>·</span>
                              <span>{student.admissionNo}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Period Cells */}
                      {scheduledPeriods.map(slot => {
                        const key = `${student.id}-p${slot.period}`;
                        const status = matrixMarks[key] || 'not_marked';
                        const isSelectedCol = slot.period === selectedPeriodNum;
                        const isSubmitted = periodSessionEntities[slot.period]?.status === 'submitted';

                        return (
                          <td
                            key={slot.period}
                            className={`py-2 px-2.5 text-center border-r border-slate-100 transition-colors ${
                              isSelectedCol ? 'bg-blue-50/20' : ''
                            }`}
                          >
                            {/* In-Cell Interactive Attendance Button Control */}
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                disabled={readOnly}
                                onClick={() => handleCellClick(student, slot.period)}
                                className={`w-full py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs ${
                                  status === 'present'
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-1 ring-emerald-500'
                                    : status === 'absent'
                                    ? 'bg-rose-600 hover:bg-rose-700 text-white ring-1 ring-rose-500'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border border-dashed border-slate-300'
                                } ${isSubmitted ? 'cursor-pointer hover:ring-2 hover:ring-purple-400' : ''}`}
                                title={
                                  isSubmitted
                                    ? `Status: ${status.toUpperCase()} (Submitted) · Click to request correction`
                                    : `Click to toggle status for Period ${slot.period}`
                                }
                              >
                                {status === 'present' ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                    <span>Present</span>
                                  </>
                                ) : status === 'absent' ? (
                                  <>
                                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                    <span>Absent</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-slate-400 font-mono">—</span>
                                    <span className="text-[11px] text-slate-500">Unmarked</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        );
                      })}

                      {/* Daily Tally Column */}
                      <td className="py-2.5 px-3 text-center border-l border-slate-200 bg-slate-50/50">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                          daily?.dailyStatus === 'Full Day' || daily?.dailyStatus === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : daily?.dailyStatus === 'Absent'
                            ? 'bg-rose-100 text-rose-800'
                            : daily?.dailyStatus === 'Half Day'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {daily?.dailyStatus || '—'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Matrix Footer: Compact Summary Row for Every Period Column */}
            <tfoot>
              <tr className="bg-slate-100/95 font-bold border-t-2 border-slate-300 text-slate-800 text-xs">
                <td className="py-3 px-3.5 sticky left-0 z-10 bg-slate-200/95 border-r border-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="uppercase tracking-wider text-[11px]">Period Completion</span>
                    <span className="text-[10px] text-slate-500 font-mono">Roll-Call</span>
                  </div>
                </td>

                {scheduledPeriods.map(slot => {
                  const stat = periodStats[slot.period];
                  const isSubmitted = periodSessionEntities[slot.period]?.status === 'submitted';

                  return (
                    <td key={slot.period} className="py-2.5 px-2 text-center border-r border-slate-200">
                      {stat ? (
                        <div className="space-y-0.5 font-mono text-[11px]">
                          <div className="flex justify-center items-center gap-1.5">
                            <span className="text-emerald-700">{stat.present}P</span>
                            <span>·</span>
                            <span className="text-rose-700">{stat.absent}A</span>
                          </div>
                          <div className={`text-[10px] font-bold ${stat.completion === 100 ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {stat.completion}% marked
                          </div>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                  );
                })}

                <td className="py-2.5 px-3 text-center border-l border-slate-300 font-mono text-[11px] text-slate-600">
                  Class 8-A
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 5. SELECTED PERIOD ABSENTEES & INTERVENTION DRAWER */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <Users className="w-4 h-4" />
            </span>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Period {selectedPeriodNum} Absentees & Intervention Roster ({activeSlot.subject})
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
            {activeStats.absent} Student(s) Absent
          </span>
        </div>

        {activeStats.absentStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {activeStats.absentStudents.map(student => (
              <div
                key={student.id}
                className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-200 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{student.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">#{student.rollNo}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {student.admissionNo} · Period {selectedPeriodNum}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const fullStudent = students.find(s => s.id === student.id);
                    if (fullStudent) setViewingStudent(fullStudent);
                  }}
                  className="px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
                >
                  Dossier &rarr;
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Zero absentees recorded for Period {selectedPeriodNum}! Full turnout.</span>
          </div>
        )}
      </div>

      {/* 6. MODALS: REVIEW & SUBMISSION FOR SELECTED PERIOD */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Review & Submit Period Attendance
                </h3>
                <p className="text-xs text-slate-500">
                  Confirm attendance register verification for Greenfield Academic Records
                </p>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Session Info Table */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Class & Section:</span>
                <strong className="text-slate-900">Std {selectedStd}-{selectedSec}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <strong className="text-slate-900">{selectedDate} ({dayOfWeek})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Period Slot:</span>
                <strong className="text-blue-700 font-bold">
                  Period {selectedPeriodNum}: {activeSlot.subject} ({activeSlot.time})
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Faculty:</span>
                <strong className="text-slate-900">{activeSlot.teacherName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submitting Demo Role:</span>
                <strong className="text-slate-900">{currentRole} (Mrs. Shalini Verma)</strong>
              </div>
            </div>

            {/* Counts HUD */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-100 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total</span>
                <strong className="text-sm font-bold font-mono text-slate-900">{activeStats.total}</strong>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-emerald-600 uppercase font-bold block">Present</span>
                <strong className="text-sm font-bold font-mono">{activeStats.present}</strong>
              </div>
              <div className="p-2 bg-rose-50 text-rose-800 rounded-xl border border-rose-200">
                <span className="text-[10px] text-rose-600 uppercase font-bold block">Absent</span>
                <strong className="text-sm font-bold font-mono">{activeStats.absent}</strong>
              </div>
              <div className={`p-2 rounded-xl border ${activeStats.notMarked > 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-700'}`}>
                <span className="text-[10px] uppercase font-bold block">Unmarked</span>
                <strong className="text-sm font-bold font-mono">{activeStats.notMarked}</strong>
              </div>
            </div>

            {/* Unmarked Validation Warning */}
            {activeStats.notMarked > 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Incomplete Register Notice:</strong>
                  <p className="mt-0.5">
                    {activeStats.notMarked} student(s) remain Not Marked. School compliance policy prohibits finalizing an incomplete register. Please mark all students or click 'Save Draft' to resume later.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All {activeStats.total} students marked. Ready for permanent verification.</span>
              </div>
            )}

            {/* Absent Student List */}
            {activeStats.absentStudents.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700">Absentees for Period {selectedPeriodNum}:</span>
                <div className="max-h-24 overflow-y-auto space-y-1 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  {activeStats.absentStudents.map(s => (
                    <div key={s.id} className="flex justify-between items-center text-slate-700">
                      <span>{s.name} (#{s.rollNo})</span>
                      <span className="font-mono text-[10px] text-slate-400">{s.admissionNo}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Back to Matrix
              </button>

              <button
                type="button"
                disabled={activeStats.notMarked > 0}
                onClick={handleFinalSubmitPeriod}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm"
              >
                Confirm & Lock Period {selectedPeriodNum}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. CONFIRM MARK ALL PRESENT MODAL */}
      {confirmAllPresentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-5 space-y-3 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm">Overwrite Existing Absentees?</h3>
            </div>
            <p className="text-xs text-slate-600">
              There are currently <strong>{activeStats.absent}</strong> student(s) marked Absent in Period {selectedPeriodNum}. Marking all present will change their status to Present.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmAllPresentModal(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeMarkAllPresent}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                Yes, Mark All Present
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. CONFIRM CLEAR DRAFT MODAL */}
      {confirmClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-5 space-y-3 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-sm">Reset Period {selectedPeriodNum} Marks?</h3>
            </div>
            <p className="text-xs text-slate-600">
              This will reset all student marks for <strong>Period {selectedPeriodNum}</strong> back to 'Not Marked'. Other periods will remain completely untouched.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmClearModal(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeClearPeriod}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Reset Period {selectedPeriodNum}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. ATTENDANCE CORRECTION REQUEST MODAL FOR SUBMITTED MARKS */}
      {correctionModalOpen && correctionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-5 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Request Attendance Correction
                </h3>
                <p className="text-xs text-slate-500">
                  Period {correctionTarget.period} is finalized. Submit an authorized change request.
                </p>
              </div>
              <button
                onClick={() => setCorrectionModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCorrectionSubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div>Student: <strong className="text-slate-900">{correctionTarget.student.name} (#{correctionTarget.student.rollNo})</strong></div>
                <div>Session: <span className="font-mono">{selectedDate} · Period {correctionTarget.period}</span></div>
                <div>Current Mark: <span className="font-bold uppercase font-mono text-slate-700">{correctionTarget.currentStatus}</span></div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Requested New Status:</label>
                <select
                  value={correctionProposedStatus}
                  onChange={e => setCorrectionProposedStatus(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800"
                >
                  <option value="present">Present (✓)</option>
                  <option value="absent">Absent (✕)</option>
                  <option value="late">Late Arrival</option>
                  <option value="excused">Excused Absence</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Justification / Reason:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Student reported late with Gate Pass slip #GP-2026-104..."
                  value={correctionReason}
                  onChange={e => setCorrectionReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCorrectionModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. STUDENT PROFILE MODAL INTEGRATION */}
      {viewingStudent && (
        <StudentProfileModal
          isOpen={!!viewingStudent}
          onClose={() => setViewingStudent(null)}
          student={viewingStudent}
          initialTab="attendance"
        />
      )}
    </div>
  );
};
