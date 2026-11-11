import React, { useState, useMemo } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
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
  GraduationCap,
  Sparkles,
  UserCheck,
  Users,
  BarChart3,
  TrendingUp,
  Layers,
  CheckCheck,
  RefreshCw,
  Copy,
  Archive,
  FileCheck,
  Lock,
  Unlock,
  ChevronDown,
  Trash2,
  Bookmark,
  Percent,
  Sliders,
  CalendarDays
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import {
  Examination,
  ExamScheduleSlot,
  SubjectAssessmentConfig,
  MarkRecord,
  Assignment,
  AssignmentSubmission,
  GradingScaleConfig,
  AssessmentSettingsConfig,
  ReportCardData,
  ReportCardSubjectRow
} from '../../types/school';
import { getThemeClasses } from '../../utils/themeHelper';

export interface ExaminationManagerProps {
  initialTab?: 'dashboard' | 'setup' | 'schedule' | 'marks_entry' | 'moderation' | 'results' | 'assignments' | 'analytics' | 'settings' | 'duties';
}

export const ExaminationManager: React.FC<ExaminationManagerProps> = ({
  initialTab = 'dashboard'
}) => {
  const {
    currentRole,
    themeColor,
    students,
    teachers,
    classes,
    subjects,
    examinations,
    examScheduleSlots,
    subjectAssessments,
    gradingScales,
    assessmentSettings,
    marks,
    assignments,
    assignmentSubmissions,
    attendance,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    createExamination,
    updateExamination,
    publishExamination,
    archiveExamination,
    duplicateExamination,
    createExamScheduleSlot,
    updateExamScheduleSlot,
    deleteExamScheduleSlot,
    detectExamScheduleConflicts,
    saveSubjectAssessmentConfig,
    saveMarksBatch,
    submitAssessmentMarks,
    reviewAssessmentMarks,
    publishExamResults,
    submitMarkCorrection,
    gradeAssignmentSubmission,
    updateAssessmentSettings,
    canTeacherAccessSubject,
    showToast,
    logAudit
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);
  const isLeadership = currentRole === 'principal' || currentRole === 'vice_principal';
  const isTeacher = currentRole === 'teacher_web' || currentRole === 'teacher_mobile';

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'setup' | 'schedule' | 'marks_entry' | 'moderation' | 'results' | 'assignments' | 'analytics' | 'settings' | 'duties'
  >(() => {
    if (initialTab === 'duties' && !isTeacher) return 'schedule';
    if (initialTab === 'marks_entry' && !isTeacher && !isLeadership) return 'dashboard';
    return initialTab;
  });

  // Current logged in teacher identity
  const currentTeacherId = 'tch-01'; // Mrs. Shalini Verma
  const currentTeacherName = 'Mrs. Shalini Verma';

  // -------------------------------------------------------------
  // EXAMINATION SETUP & MANAGEMENT STATE
  // -------------------------------------------------------------
  const [examSearch, setExamSearch] = useState('');
  const [examTermFilter, setExamTermFilter] = useState('all');
  const [examStatusFilter, setExamStatusFilter] = useState('all');
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [duplicateTargetExam, setDuplicateTargetExam] = useState<Examination | null>(null);
  const [duplicateNewName, setDuplicateNewName] = useState('');

  const [newExamForm, setNewExamForm] = useState({
    name: '',
    academicYear: '2026–2027',
    term: 'Term 2',
    standards: [8, 9] as number[],
    sections: ['A', 'B'] as Array<'A' | 'B'>,
    startDate: '2026-11-15',
    endDate: '2026-11-25',
    instructions: 'Summative assessment. Calculator not permitted unless explicitly notified. Time duration 2.5 hours.',
    notes: 'Internal assessment weightage 20%, written exam 80%.'
  });

  // -------------------------------------------------------------
  // SCHEDULE / TIMETABLE STATE
  // -------------------------------------------------------------
  const [scheduleExamFilter, setScheduleExamFilter] = useState<string>(examinations[0]?.id || 'exam-02');
  const [scheduleStandardFilter, setScheduleStandardFilter] = useState<number | 'all'>('all');
  const [scheduleSectionFilter, setScheduleSectionFilter] = useState<'all' | 'A' | 'B'>('all');
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);

  const [newSlotForm, setNewSlotForm] = useState({
    examId: examinations[0]?.id || 'exam-02',
    date: '2026-11-16',
    standard: 8,
    section: 'A' as 'A' | 'B',
    subject: 'Mathematics',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    durationMinutes: 90,
    room: 'Room 204',
    examinerTeacherId: 'tch-01',
    instructions: 'Calculators prohibited. Carry geometric instruments.'
  });

  // -------------------------------------------------------------
  // MARKS ENTRY STATE
  // -------------------------------------------------------------
  const availableExamsForMarks = useMemo(() => {
    return examinations.filter(e => e.status !== 'archived');
  }, [examinations]);

  const [marksEntryExamId, setMarksEntryExamId] = useState<string>(
    availableExamsForMarks.find(e => e.status === 'in_progress')?.id || availableExamsForMarks[0]?.id || 'exam-02'
  );
  const [marksStandard, setMarksStandard] = useState<number>(8);
  const [marksSection, setMarksSection] = useState<'A' | 'B'>('A');
  const [marksSubject, setMarksSubject] = useState<string>('Mathematics');

  // Find active subject assessment
  const activeSubjectAssessment = useMemo(() => {
    return subjectAssessments.find(a =>
      a.examId === marksEntryExamId &&
      a.standard === marksStandard &&
      a.section === marksSection &&
      (a.subject.toLowerCase() === marksSubject.toLowerCase() || a.subject.toLowerCase().includes(marksSubject.toLowerCase()))
    );
  }, [subjectAssessments, marksEntryExamId, marksStandard, marksSection, marksSubject]);

  // Students for selected class
  const classStudents = useMemo(() => {
    return students
      .filter(s => s.standard === marksStandard && s.section === marksSection && s.status === 'Active')
      .sort((a, b) => a.rollNo - b.rollNo);
  }, [students, marksStandard, marksSection]);

  // Local draft marks state
  const [draftMarks, setDraftMarks] = useState<
    Record<
      string,
      {
        written: number | '';
        practical: number | '';
        internal: number | '';
        isAbsent: boolean;
        isExempt: boolean;
        remarks: string;
      }
    >
  >({});

  // Sync draft marks when selection or assessment changes
  React.useEffect(() => {
    const assessment = activeSubjectAssessment;
    const initialDraft: typeof draftMarks = {};

    classStudents.forEach(s => {
      const existing = marks.find(m =>
        m.studentId === s.id &&
        (m.assessmentId === assessment?.id || (m.examId === marksEntryExamId && m.subject === marksSubject))
      );

      if (existing) {
        initialDraft[s.id] = {
          written: existing.writtenMarks !== null && existing.writtenMarks !== undefined ? existing.writtenMarks : existing.marksObtained,
          practical: existing.practicalMarks || '',
          internal: existing.internalMarks || '',
          isAbsent: !!existing.isAbsent,
          isExempt: !!existing.isExempt,
          remarks: existing.teacherRemarks || existing.remarks || ''
        };
      } else {
        // Default clean state
        initialDraft[s.id] = {
          written: '',
          practical: '',
          internal: '',
          isAbsent: false,
          isExempt: false,
          remarks: ''
        };
      }
    });

    setDraftMarks(initialDraft);
  }, [marksEntryExamId, marksStandard, marksSection, marksSubject, activeSubjectAssessment, classStudents, marks]);

  // Handle score changes
  const handleScoreChange = (
    studentId: string,
    field: 'written' | 'practical' | 'internal',
    valueStr: string
  ) => {
    const val = valueStr === '' ? '' : Math.max(0, Number(valueStr));
    setDraftMarks(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { written: '', practical: '', internal: '', isAbsent: false, isExempt: false, remarks: '' }),
        [field]: val,
        isAbsent: false,
        isExempt: false
      }
    }));
  };

  const handleToggleStatus = (studentId: string, statusType: 'isAbsent' | 'isExempt') => {
    setDraftMarks(prev => {
      const current = prev[studentId] || { written: '', practical: '', internal: '', isAbsent: false, isExempt: false, remarks: '' };
      const toggled = !current[statusType];
      return {
        ...prev,
        [studentId]: {
          ...current,
          [statusType]: toggled,
          ...(statusType === 'isAbsent' && toggled ? { written: 0, practical: 0, internal: 0, isExempt: false } : {}),
          ...(statusType === 'isExempt' && toggled ? { written: 0, practical: 0, internal: 0, isAbsent: false } : {})
        }
      };
    });
  };

  const handleSaveMarksDraft = () => {
    if (!activeSubjectAssessment) {
      showToast('No active assessment configuration found for this class and subject.', 'error');
      return;
    }

    const records = classStudents.map(s => {
      const draft = draftMarks[s.id] || { written: '', practical: '', internal: '', isAbsent: false, isExempt: false, remarks: '' };
      const written = typeof draft.written === 'number' ? draft.written : 0;
      const practical = typeof draft.practical === 'number' ? draft.practical : 0;
      const internal = typeof draft.internal === 'number' ? draft.internal : 0;
      const totalObtained = draft.isAbsent || draft.isExempt ? 0 : written + practical + internal;

      return {
        studentId: s.id,
        studentName: s.name,
        rollNo: s.rollNo,
        admissionNo: s.admissionNo,
        writtenMarks: written,
        practicalMarks: practical,
        internalMarks: internal,
        marksObtained: totalObtained,
        isAbsent: draft.isAbsent,
        isExempt: draft.isExempt,
        teacherRemarks: draft.remarks,
        remarks: draft.remarks
      };
    });

    const res = saveMarksBatch(activeSubjectAssessment.id, records, currentTeacherId, currentTeacherName, true);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleSubmitMarksForReview = () => {
    if (!activeSubjectAssessment) {
      showToast('Assessment not found.', 'error');
      return;
    }

    // First save latest values
    handleSaveMarksDraft();

    // Now submit
    const res = submitAssessmentMarks(activeSubjectAssessment.id, currentTeacherId, currentTeacherName);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleAutoPopulateSampleMarks = () => {
    if (!activeSubjectAssessment) return;
    const maxW = activeSubjectAssessment.maxWritten;
    const maxP = activeSubjectAssessment.maxPractical || 0;
    const maxI = activeSubjectAssessment.maxInternal || 0;

    const populated: typeof draftMarks = {};
    classStudents.forEach((s, idx) => {
      if (idx === 14) {
        // One student absent
        populated[s.id] = { written: 0, practical: 0, internal: 0, isAbsent: true, isExempt: false, remarks: 'Absent with medical leave' };
      } else {
        const factor = 0.65 + ((s.rollNo * 7) % 35) / 100;
        const w = Math.min(maxW, Math.round(maxW * factor));
        const p = maxP > 0 ? Math.min(maxP, Math.round(maxP * (factor + 0.05))) : 0;
        const i = maxI > 0 ? Math.min(maxI, Math.round(maxI * 0.9)) : 0;
        populated[s.id] = {
          written: w,
          practical: p,
          internal: i,
          isAbsent: false,
          isExempt: false,
          remarks: factor > 0.85 ? 'Exemplary analytical reasoning.' : 'Steady grasp of foundational formulas.'
        };
      }
    });
    setDraftMarks(populated);
    showToast(`Pre-populated sample marks for ${classStudents.length} students. Click 'Save Scores Draft' to commit.`, 'info');
  };

  // -------------------------------------------------------------
  // MODERATION & REVIEW STATE (LEADERSHIP)
  // -------------------------------------------------------------
  const [moderationExamFilter, setModerationExamFilter] = useState('all');
  const [moderationStatusFilter, setModerationStatusFilter] = useState<'all' | 'submitted' | 'under_review' | 'approved' | 'returned_for_correction'>('all');
  const [selectedAssessmentForReview, setSelectedAssessmentForReview] = useState<SubjectAssessmentConfig | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // -------------------------------------------------------------
  // RESULTS & OFFICIAL REPORT CARDS STATE
  // -------------------------------------------------------------
  const [resultExamId, setResultExamId] = useState<string>(examinations[0]?.id || 'exam-01');
  const [resultStandard, setResultStandard] = useState<number>(8);
  const [resultSection, setResultSection] = useState<'A' | 'B'>('A');
  const [selectedStudentForReportCard, setSelectedStudentForReportCard] = useState<ReportCardData | null>(null);

  // Calculate Consolidated Results for the chosen Class & Exam
  const consolidatedClassResults = useMemo(() => {
    const classAssessments = subjectAssessments.filter(
      a => a.examId === resultExamId && a.standard === resultStandard && a.section === resultSection
    );
    const targetExam = examinations.find(e => e.id === resultExamId);

    const studentsInClass = students.filter(s => s.standard === resultStandard && s.section === resultSection);

    const rows = studentsInClass.map(student => {
      const studentMarksList = marks.filter(
        m => m.studentId === student.id && (m.examId === resultExamId || m.examName === targetExam?.name)
      );

      let totalMax = 0;
      let totalObtained = 0;
      let anyFail = false;
      let absentCount = 0;

      const subjectBreakdown = classAssessments.map(asmt => {
        const markRec = studentMarksList.find(m => m.subject.toLowerCase() === asmt.subject.toLowerCase());
        const scored = markRec?.marksObtained ?? 0;
        const isAbs = markRec?.isAbsent ?? false;
        const isExm = markRec?.isExempt ?? false;

        totalMax += asmt.totalMax;
        if (!isAbs && !isExm) {
          totalObtained += scored;
        }
        if (isAbs) absentCount++;
        if (scored < asmt.passingMarks && !isExm) {
          anyFail = true;
        }

        return {
          subject: asmt.subject,
          scored,
          max: asmt.totalMax,
          grade: markRec?.grade || 'D',
          isAbsent: isAbs,
          isExempt: isExm,
          status: markRec?.status || 'not_entered'
        };
      });

      const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 1000) / 10 : 0;

      let division: '1st Division' | '2nd Division' | '3rd Division' | 'Essential Repeat' = '1st Division';
      if (anyFail || percentage < 33) {
        division = 'Essential Repeat';
      } else if (percentage >= 60) {
        division = '1st Division';
      } else if (percentage >= 50) {
        division = '2nd Division';
      } else {
        division = '3rd Division';
      }

      // Grade calculation
      let overallGrade = 'A1';
      if (percentage < 33 || anyFail) overallGrade = 'E';
      else if (percentage < 51) overallGrade = 'C2';
      else if (percentage < 61) overallGrade = 'C1';
      else if (percentage < 71) overallGrade = 'B2';
      else if (percentage < 81) overallGrade = 'B1';
      else if (percentage < 91) overallGrade = 'A2';

      return {
        student,
        totalMax,
        totalObtained,
        percentage,
        division,
        overallGrade,
        anyFail,
        absentCount,
        subjectBreakdown
      };
    });

    // Sort by percentage descending to assign ranks
    rows.sort((a, b) => b.percentage - a.percentage);

    return rows.map((r, index) => ({
      ...r,
      rank: r.anyFail ? undefined : index + 1
    }));
  }, [subjectAssessments, examinations, resultExamId, resultStandard, resultSection, students, marks]);

  // Generate Report Card Object
  const handleOpenReportCard = (studentRow: typeof consolidatedClassResults[0]) => {
    const targetExam = examinations.find(e => e.id === resultExamId) || examinations[0];

    // Compute attendance percentage
    const studentAttRecords = attendance.filter(a => a.studentId === studentRow.student.id);
    const presentDays = studentAttRecords.filter(a => a.status === 'present').length;
    const totalDays = Math.max(studentAttRecords.length, 45); // Benchmark 45 instructional days in term
    const attPct = Math.round((presentDays / totalDays) * 100);

    const subjectRows: ReportCardSubjectRow[] = studentRow.subjectBreakdown.map(sb => {
      const asmt = subjectAssessments.find(a =>
        a.examId === resultExamId && a.standard === resultStandard && a.subject.toLowerCase() === sb.subject.toLowerCase()
      );

      return {
        subject: sb.subject,
        maxWritten: asmt?.maxWritten || sb.max,
        writtenObtained: sb.isAbsent ? 0 : Math.round(sb.scored * 0.8),
        maxPractical: asmt?.maxPractical || 0,
        practicalObtained: asmt?.maxPractical ? Math.round(sb.scored * 0.2) : null,
        maxInternal: asmt?.maxInternal || 0,
        internalObtained: asmt?.maxInternal ? Math.round(sb.scored * 0.2) : null,
        totalMax: sb.max,
        totalObtained: sb.scored,
        percentage: sb.max > 0 ? Math.round((sb.scored / sb.max) * 100) : 0,
        grade: sb.grade,
        status: sb.isAbsent ? 'absent' : sb.isExempt ? 'exempt' : sb.scored >= (asmt?.passingMarks || 33) ? 'passed' : 'failed',
        teacherRemarks: sb.scored >= 85 ? 'Exceeds standard expectations.' : 'Demonstrates firm foundational command.'
      };
    });

    const reportData: ReportCardData = {
      studentId: studentRow.student.id,
      studentName: studentRow.student.name,
      rollNo: studentRow.student.rollNo,
      admissionNo: studentRow.student.admissionNo,
      standard: studentRow.student.standard,
      section: studentRow.student.section,
      examId: targetExam.id,
      examName: targetExam.name,
      academicYear: targetExam.academicYear,
      term: targetExam.term,
      subjects: subjectRows,
      totalMaxMarks: studentRow.totalMax,
      totalMarksObtained: studentRow.totalObtained,
      overallPercentage: studentRow.percentage,
      overallGrade: studentRow.overallGrade,
      resultStatus: studentRow.anyFail ? 'Essential Repeat' : 'Passed',
      rank: studentRow.rank,
      attendancePresent: presentDays,
      attendanceTotal: totalDays,
      attendancePercentage: attPct,
      generalRemarks: studentRow.percentage >= 85
        ? 'Aarav has exhibited stellar academic diligence and consistent classroom participation throughout the term.'
        : 'Sincere effort observed. Recommended to focus on step-by-step problem-solving in mathematical sciences.',
      conductRating: studentRow.percentage >= 80 ? 'A+' : 'A',
      publishedDate: targetExam.publishedAt || '2026-10-15',
      endorsedBy: 'Prof. Marcus Vance (Academic Coordinator) & Dr. Evelyn Montgomery (Principal)'
    };

    setSelectedStudentForReportCard(reportData);
  };

  // -------------------------------------------------------------
  // ASSIGNMENTS MANAGEMENT STATE
  // -------------------------------------------------------------
  const [asgStandardFilter, setAsgStandardFilter] = useState<number | 'all'>('all');
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const [isSubmittingAsg, setIsSubmittingAsg] = useState(false);
  const [asgErrors, setAsgErrors] = useState<Record<string, string>>({});
  const [selectedAssignmentForGrading, setSelectedAssignmentForGrading] = useState<Assignment | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradingMarksInput, setGradingMarksInput] = useState<number>(18);
  const [gradingFeedbackInput, setGradingFeedbackInput] = useState('');

  const [newAsgForm, setNewAsgForm] = useState({
    title: '',
    standard: 8,
    section: 'A' as 'A' | 'B',
    subject: 'Mathematics',
    dueDate: '2026-11-05',
    description: '',
    maxMarks: 20
  });

  // Homework & Assignment CRUD Handlers
  const handleOpenCreateAssignment = () => {
    setEditingAssignment(null);
    setNewAsgForm({
      title: '',
      standard: asgStandardFilter === 'all' ? 8 : asgStandardFilter,
      section: 'A',
      subject: 'Mathematics',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      description: '',
      maxMarks: 20
    });
    setAsgErrors({});
    setShowCreateAssignmentModal(true);
  };

  const handleOpenEditAssignment = (asg: Assignment) => {
    setEditingAssignment(asg);
    setNewAsgForm({
      title: asg.title,
      standard: asg.standard,
      section: asg.section,
      subject: asg.subject,
      dueDate: asg.dueDate,
      description: asg.description,
      maxMarks: asg.totalStudents || 20
    });
    setAsgErrors({});
    setShowCreateAssignmentModal(true);
  };

  const handleSaveAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!newAsgForm.title.trim() || newAsgForm.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters.';
    }
    if (!newAsgForm.dueDate) {
      errs.dueDate = 'Due date is required.';
    }
    if (!newAsgForm.description.trim()) {
      errs.description = 'Assignment instructions/description required.';
    }
    if (newAsgForm.maxMarks <= 0 || newAsgForm.maxMarks > 100) {
      errs.maxMarks = 'Max marks must be between 1 and 100.';
    }
    if (Object.keys(errs).length > 0) {
      setAsgErrors(errs);
      showToast('Please resolve validation errors before saving.', 'error');
      return;
    }

    setIsSubmittingAsg(true);
    try {
      if (editingAssignment) {
        updateAssignment(editingAssignment.id, {
          title: newAsgForm.title.trim(),
          standard: newAsgForm.standard,
          section: newAsgForm.section,
          subject: newAsgForm.subject,
          dueDate: newAsgForm.dueDate,
          description: newAsgForm.description.trim()
        });
        showToast(`Assignment "${newAsgForm.title}" updated successfully.`, 'success');
      } else {
        const assignedClassCount = students.filter(
          s => s.standard === newAsgForm.standard && s.section === newAsgForm.section && s.status === 'Active'
        ).length || 32;

        createAssignment({
          title: newAsgForm.title.trim(),
          standard: newAsgForm.standard,
          section: newAsgForm.section,
          subject: newAsgForm.subject,
          assignedDate: new Date().toISOString().split('T')[0],
          dueDate: newAsgForm.dueDate,
          description: newAsgForm.description.trim(),
          submissionCount: 0,
          totalStudents: assignedClassCount,
          teacherName: currentRole === 'teacher_web' ? 'Mrs. Shalini Verma' : 'Academic Coordinator',
          status: 'published'
        });
        showToast(`Assignment "${newAsgForm.title}" assigned to Std ${newAsgForm.standard}-${newAsgForm.section}.`, 'success');
      }
      setShowCreateAssignmentModal(false);
      setEditingAssignment(null);
    } finally {
      setIsSubmittingAsg(false);
    }
  };

  const handleConfirmDeleteAssignment = () => {
    if (!assignmentToDelete) return;
    deleteAssignment(assignmentToDelete.id);
    showToast(`Assignment "${assignmentToDelete.title}" removed.`, 'info');
    setAssignmentToDelete(null);
  };

  // Conflicts list for master exam schedules
  const activeConflicts = useMemo(() => {
    return detectExamScheduleConflicts();
  }, [detectExamScheduleConflicts, examScheduleSlots]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER & MODULE SWITCHER HUD                              */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${themeClasses.primaryBg} text-white flex items-center justify-center shadow-sm`}>
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Academic Assessment & Examination Center
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 font-mono">
                  CBSE 2026–27
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Greenfield International School · Comprehensive Summative & Periodic Examination Suite
              </p>
            </div>
          </div>

          {/* Quick Context Indicators */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {activeConflicts.length > 0 && (
              <button
                onClick={() => setActiveTab('schedule')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 font-semibold border border-amber-300 hover:bg-amber-100 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>{activeConflicts.length} Timetable Conflict(s)</span>
              </button>
            )}
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 font-mono font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Term 2 Assessment Cycle</span>
            </div>
          </div>
        </div>

        {/* SUB-NAVIGATION TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'dashboard'
                ? `${themeClasses.primaryBg} text-white shadow-xs`
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </button>

          {isTeacher && (
            <button
              onClick={() => setActiveTab('duties')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'duties'
                  ? `${themeClasses.primaryBg} text-white shadow-xs`
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>My Exam Duties</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('marks_entry')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'marks_entry'
                ? `${themeClasses.primaryBg} text-white shadow-xs`
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Edit2 className="w-4 h-4" />
            <span>Marks Entry & Gradebook</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'schedule'
                ? `${themeClasses.primaryBg} text-white shadow-xs`
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Exam Schedule</span>
            {activeConflicts.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>

          {isLeadership && (
            <button
              onClick={() => setActiveTab('moderation')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'moderation'
                  ? `${themeClasses.primaryBg} text-white shadow-xs`
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Moderation & Approval</span>
              {subjectAssessments.filter(a => a.marksEntryStatus === 'submitted').length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-400 text-amber-950 font-mono text-[10px] font-bold rounded-full">
                  {subjectAssessments.filter(a => a.marksEntryStatus === 'submitted').length}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'results'
                ? `${themeClasses.primaryBg} text-white shadow-xs`
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Results & Report Cards</span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'assignments'
                ? `${themeClasses.primaryBg} text-white shadow-xs`
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Assignments & Homework</span>
          </button>

          {isLeadership && (
            <button
              onClick={() => setActiveTab('setup')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'setup'
                  ? `${themeClasses.primaryBg} text-white shadow-xs`
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Exam Master Setup</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? `${themeClasses.primaryBg} text-white shadow-xs`
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Analytics & Toppers</span>
          </button>

          {isLeadership && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'settings'
                  ? `${themeClasses.primaryBg} text-white shadow-xs`
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Assessment Rules</span>
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW & DASHBOARD                                   */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Configured Examinations</span>
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">{examinations.length}</div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <span className="text-emerald-700 font-semibold font-mono">
                  {examinations.filter(e => e.status === 'published').length} Published
                </span>
                <span>· {examinations.filter(e => e.status === 'in_progress').length} In Progress</span>
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Scheduled Exam Slots</span>
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">{examScheduleSlots.length}</div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                {activeConflicts.length === 0 ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> 0 Timetable Conflicts
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold flex items-center gap-1 font-mono">
                    <AlertTriangle className="w-3.5 h-3.5" /> {activeConflicts.length} Collisions Flagged
                  </span>
                )}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Marks Moderation Queue</span>
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-800">
                {subjectAssessments.filter(a => a.marksEntryStatus === 'submitted').length}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Awaiting Academic Coordinator Endorsement
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">School-Wide Pass Rate</span>
                <GraduationCap className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-700">97.8%</div>
              <p className="text-xs text-emerald-700 font-medium mt-1">
                Based on Mid-Term Summative Consolidation
              </p>
            </div>
          </div>

          {/* Active Examinations List */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Current Academic Examinations</h3>
                <p className="text-xs text-slate-500">Track progress, score entry schedules, and publishing state</p>
              </div>
              {isLeadership && (
                <button
                  onClick={() => setShowCreateExamModal(true)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-xs`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Examination</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examinations.map(exam => {
                const examSlots = examScheduleSlots.filter(s => s.examId === exam.id);
                const assessments = subjectAssessments.filter(a => a.examId === exam.id);
                const publishedAssessments = assessments.filter(a => a.marksEntryStatus === 'published' || a.marksEntryStatus === 'approved');
                const progressPct = assessments.length > 0 ? Math.round((publishedAssessments.length / assessments.length) * 100) : 0;

                return (
                  <div key={exam.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{exam.name}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              exam.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : exam.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : exam.status === 'scheduled'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {exam.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {exam.academicYear} · {exam.term} · {exam.startDate} to {exam.endDate}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setScheduleExamFilter(exam.id);
                            setActiveTab('schedule');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                          title="View Schedule"
                        >
                          Timetable ({examSlots.length})
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{exam.instructions}</p>

                    {/* Classes Coverage */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold text-slate-500">Applicable Classes:</span>
                      {exam.applicableClasses.map((ac, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono text-[11px]">
                          Std {ac.standard}-{ac.section}
                        </span>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Grading & Endorsement Progress</span>
                        <span className="font-mono font-bold text-slate-700">{progressPct}% Complete</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            progressPct === 100 ? 'bg-emerald-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setMarksEntryExamId(exam.id);
                          setActiveTab('marks_entry');
                        }}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Enter / View Marks
                      </button>

                      <button
                        onClick={() => {
                          setResultExamId(exam.id);
                          setActiveTab('results');
                        }}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                      >
                        <GraduationCap className="w-3.5 h-3.5" /> Result Broadsheet
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB: MY EXAM DUTIES (TEACHER VIEW)                            */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'duties' && isTeacher && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Examination Duty Roster & Question Papers
              </h3>
              <p className="text-xs text-slate-500">
                Assigned invigilation sessions, hall superintendence, and evaluation deadlines for {currentTeacherName}
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200">
              Staff ID: TCH-2016-042
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {examScheduleSlots
              .filter(s => s.examinerTeacherId === currentTeacherId || s.examinerTeacherName.includes('Shalini'))
              .map(slot => (
                <div key={slot.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {slot.examName}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{slot.subject}</h4>
                    </div>
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                      Std {slot.standard}-{slot.section}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono font-medium">{slot.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{slot.startTime} – {slot.endTime} ({slot.durationMinutes} min)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">Assigned Hall: {slot.room}</span>
                    </div>
                  </div>

                  {slot.instructions && (
                    <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-200">
                      "{slot.instructions}"
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Paper Submitted
                    </span>
                    <button
                      onClick={() => {
                        setMarksEntryExamId(slot.examId);
                        setMarksStandard(slot.standard);
                        setMarksSection(slot.section);
                        setMarksSubject(slot.subject);
                        setActiveTab('marks_entry');
                      }}
                      className="font-bold text-blue-700 hover:underline"
                    >
                      Open Mark Register →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: MARKS ENTRY & OFFICIAL GRADEBOOK                       */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'marks_entry' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-5">
          {/* Header & Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Teacher Marks Entry & Gradebook
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Record score cards, written/practical/internal marks, and student observations for moderation
              </p>
            </div>

            {/* Selectors Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={marksEntryExamId}
                onChange={e => setMarksEntryExamId(e.target.value)}
                className="text-xs py-2 px-3 rounded-xl border border-slate-200 font-semibold bg-white text-slate-800"
              >
                {availableExamsForMarks.map(exam => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name} ({exam.academicYear} {exam.term})
                  </option>
                ))}
              </select>

              <select
                value={`${marksStandard}-${marksSection}`}
                onChange={e => {
                  const [std, sec] = e.target.value.split('-');
                  setMarksStandard(Number(std));
                  setMarksSection(sec as 'A' | 'B');
                }}
                className="text-xs py-2 px-3 rounded-xl border border-slate-200 font-semibold bg-white text-slate-800"
              >
                <option value="8-A">Class 8 - Section A</option>
                <option value="8-B">Class 8 - Section B</option>
                <option value="9-A">Class 9 - Section A</option>
                <option value="9-B">Class 9 - Section B</option>
                <option value="5-B">Class 5 - Section B</option>
              </select>

              <select
                value={marksSubject}
                onChange={e => setMarksSubject(e.target.value)}
                className="text-xs py-2 px-3 rounded-xl border border-slate-200 font-semibold bg-white text-slate-800"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Computer Science">Computer Science</option>
              </select>

              <button
                onClick={handleAutoPopulateSampleMarks}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                title="Quick demo sample data"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Auto-Fill Samples</span>
              </button>
            </div>
          </div>

          {/* Assessment Header HUD */}
          {activeSubjectAssessment ? (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-slate-900 text-sm">
                  {activeSubjectAssessment.subject} (Std {activeSubjectAssessment.standard}-{activeSubjectAssessment.section})
                </span>
                <span className="px-2.5 py-0.5 rounded-full font-mono font-semibold bg-blue-100 text-blue-800">
                  Total Max: {activeSubjectAssessment.totalMax} Marks (Pass: {activeSubjectAssessment.passingMarks})
                </span>
                {activeSubjectAssessment.maxPractical ? (
                  <span className="font-mono text-slate-600">
                    Written: {activeSubjectAssessment.maxWritten} · Practical: {activeSubjectAssessment.maxPractical}
                  </span>
                ) : (
                  <span className="font-mono text-slate-600">
                    Written: {activeSubjectAssessment.maxWritten} · Internal: {activeSubjectAssessment.maxInternal || 0}
                  </span>
                )}
                <span className="text-slate-500">
                  Assigned Faculty: <strong className="text-slate-800">{activeSubjectAssessment.assignedTeacherName}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Status:</span>
                <span
                  className={`px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider text-[11px] ${
                    activeSubjectAssessment.marksEntryStatus === 'approved' || activeSubjectAssessment.marksEntryStatus === 'published'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : activeSubjectAssessment.marksEntryStatus === 'submitted'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : activeSubjectAssessment.marksEntryStatus === 'returned_for_correction'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {activeSubjectAssessment.marksEntryStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                Assessment configuration not auto-detected for {marksSubject} in Class {marksStandard}-{marksSection}. Defaulting to standard 100 Marks (Written 80 / Internal 20).
              </span>
            </div>
          )}

          {/* Rejection / Returned Note Warning if applicable */}
          {activeSubjectAssessment?.marksEntryStatus === 'returned_for_correction' && (
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-900 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="font-bold">Returned by Academic Coordinator for Correction:</strong>
                <p className="mt-0.5">{activeSubjectAssessment.rejectionReason || 'Please verify student marks and re-calculate practical totals before re-submitting.'}</p>
              </div>
            </div>
          )}

          {/* Marks Entry Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 w-16">Roll #</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Admission No</th>
                  <th className="py-3 px-3 text-center">Written (Max {activeSubjectAssessment?.maxWritten || 80})</th>
                  {(activeSubjectAssessment?.maxPractical || 0) > 0 && (
                    <th className="py-3 px-3 text-center">Practical (Max {activeSubjectAssessment?.maxPractical})</th>
                  )}
                  {(activeSubjectAssessment?.maxInternal || 0) > 0 && (
                    <th className="py-3 px-3 text-center">Internal (Max {activeSubjectAssessment?.maxInternal})</th>
                  )}
                  <th className="py-3 px-3 text-center">Total Marks</th>
                  <th className="py-3 px-3 text-center">Auto Grade</th>
                  <th className="py-3 px-3 text-center">Attendance Flags</th>
                  <th className="py-3 px-3">Teacher Observation / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {classStudents.map(student => {
                  const draft = draftMarks[student.id] || { written: '', practical: '', internal: '', isAbsent: false, isExempt: false, remarks: '' };
                  const maxW = activeSubjectAssessment?.maxWritten || 80;
                  const maxP = activeSubjectAssessment?.maxPractical || 0;
                  const maxI = activeSubjectAssessment?.maxInternal || 0;
                  const totalMax = activeSubjectAssessment?.totalMax || 100;

                  const wNum = typeof draft.written === 'number' ? draft.written : 0;
                  const pNum = typeof draft.practical === 'number' ? draft.practical : 0;
                  const iNum = typeof draft.internal === 'number' ? draft.internal : 0;
                  const total = draft.isAbsent || draft.isExempt ? 0 : wNum + pNum + iNum;

                  const pct = totalMax > 0 ? (total / totalMax) * 100 : 0;
                  let grade = 'A1';
                  if (draft.isAbsent) grade = 'ABS';
                  else if (draft.isExempt) grade = 'EXM';
                  else if (pct < 33) grade = 'E';
                  else if (pct < 41) grade = 'D';
                  else if (pct < 51) grade = 'C2';
                  else if (pct < 61) grade = 'C1';
                  else if (pct < 71) grade = 'B2';
                  else if (pct < 81) grade = 'B1';
                  else if (pct < 91) grade = 'A2';

                  const isWInvalid = typeof draft.written === 'number' && (draft.written < 0 || draft.written > maxW);
                  const isPInvalid = typeof draft.practical === 'number' && (draft.practical < 0 || draft.practical > maxP);
                  const isIInvalid = typeof draft.internal === 'number' && (draft.internal < 0 || draft.internal > maxI);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">#{student.rollNo}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{student.name}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{student.admissionNo}</td>

                      {/* Written Input */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          disabled={draft.isAbsent || draft.isExempt}
                          min={0}
                          max={maxW}
                          value={draft.written}
                          onChange={e => handleScoreChange(student.id, 'written', e.target.value)}
                          placeholder="0"
                          className={`w-20 text-center py-1 px-2 rounded-lg border font-mono font-semibold text-xs ${
                            isWInvalid
                              ? 'border-rose-400 bg-rose-50 text-rose-800'
                              : draft.isAbsent || draft.isExempt
                              ? 'bg-slate-100 text-slate-400 border-slate-200'
                              : 'border-slate-300 bg-white text-slate-900'
                          }`}
                        />
                      </td>

                      {/* Practical Input if applicable */}
                      {maxP > 0 && (
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            disabled={draft.isAbsent || draft.isExempt}
                            min={0}
                            max={maxP}
                            value={draft.practical}
                            onChange={e => handleScoreChange(student.id, 'practical', e.target.value)}
                            placeholder="0"
                            className={`w-18 text-center py-1 px-2 rounded-lg border font-mono font-semibold text-xs ${
                              isPInvalid
                                ? 'border-rose-400 bg-rose-50 text-rose-800'
                                : draft.isAbsent || draft.isExempt
                                ? 'bg-slate-100 text-slate-400 border-slate-200'
                                : 'border-slate-300 bg-white text-slate-900'
                            }`}
                          />
                        </td>
                      )}

                      {/* Internal Input if applicable */}
                      {maxI > 0 && (
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            disabled={draft.isAbsent || draft.isExempt}
                            min={0}
                            max={maxI}
                            value={draft.internal}
                            onChange={e => handleScoreChange(student.id, 'internal', e.target.value)}
                            placeholder="0"
                            className={`w-18 text-center py-1 px-2 rounded-lg border font-mono font-semibold text-xs ${
                              isIInvalid
                                ? 'border-rose-400 bg-rose-50 text-rose-800'
                                : draft.isAbsent || draft.isExempt
                                ? 'bg-slate-100 text-slate-400 border-slate-200'
                                : 'border-slate-300 bg-white text-slate-900'
                            }`}
                          />
                        </td>
                      )}

                      {/* Total Auto Calculated */}
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                        {draft.isAbsent ? (
                          <span className="text-rose-600 font-semibold">ABS</span>
                        ) : draft.isExempt ? (
                          <span className="text-amber-600 font-semibold">EXM</span>
                        ) : (
                          `${total} / ${totalMax}`
                        )}
                      </td>

                      {/* Auto Grade */}
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                            grade === 'A1' || grade === 'A2'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : grade === 'B1' || grade === 'B2'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : grade === 'E' || grade === 'ABS'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}
                        >
                          {grade}
                        </span>
                      </td>

                      {/* Absent / Exempt Toggles */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(student.id, 'isAbsent')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-colors ${
                              draft.isAbsent
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            ABS
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(student.id, 'isExempt')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-colors ${
                              draft.isExempt
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            EXM
                          </button>
                        </div>
                      </td>

                      {/* Teacher Remarks Input */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={draft.remarks}
                          onChange={e =>
                            setDraftMarks(prev => ({
                              ...prev,
                              [student.id]: {
                                ...(prev[student.id] || { written: '', practical: '', internal: '', isAbsent: false, isExempt: false, remarks: '' }),
                                remarks: e.target.value
                              }
                            }))
                          }
                          placeholder="e.g. Good analytical grasp"
                          className="w-full py-1 px-2.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="font-semibold text-slate-800">{classStudents.length} Students</span>
              <span>· Auto-calculation enabled for CBSE 9-Point Grades</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveMarksDraft}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Bookmark className="w-4 h-4 text-slate-500" />
                <span>Save Scores Draft</span>
              </button>

              <button
                onClick={handleSubmitMarksForReview}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-sm flex items-center gap-1.5`}
              >
                <Send className="w-4 h-4" />
                <span>Submit for Academic Moderation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: EXAMINATION SCHEDULE & TIMETABLE MASTER                */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'schedule' && (
        <div className="space-y-5">
          {/* Schedule Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Master Examination Timetable</h3>
                <p className="text-xs text-slate-500">Scheduled sessions, hall allocations, and invigilator rosters</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={scheduleExamFilter}
                  onChange={e => setScheduleExamFilter(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 font-semibold bg-white text-slate-800"
                >
                  {examinations.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>

                <select
                  value={scheduleStandardFilter}
                  onChange={e => setScheduleStandardFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 font-semibold bg-white text-slate-800"
                >
                  <option value="all">All Standards</option>
                  <option value={8}>Standard 8</option>
                  <option value={9}>Standard 9</option>
                  <option value={10}>Standard 10</option>
                  <option value={5}>Standard 5</option>
                </select>

                {isLeadership && (
                  <button
                    onClick={() => setShowAddSlotModal(true)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-xs`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Exam Session</span>
                  </button>
                )}
              </div>
            </div>

            {/* Timetable Conflict Alert Banner */}
            {activeConflicts.length > 0 && (
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 animate-bounce" />
                  <span>{activeConflicts.length} Timetable Scheduling Conflict(s) Detected!</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                  {activeConflicts.map((c, i) => (
                    <li key={i} className="font-medium">
                      <span className="font-bold text-rose-700 uppercase">[{c.type.replace('_', ' ')}]:</span> {c.message}
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-amber-800 italic">
                  Note: Publishing is blocked until overlapping exams or examiner double-bookings are resolved.
                </p>
              </div>
            )}

            {/* Slots Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Subject</th>
                    <th className="py-3 px-3">Time Window</th>
                    <th className="py-3 px-3">Duration</th>
                    <th className="py-3 px-3">Examination Hall / Room</th>
                    <th className="py-3 px-3">Invigilator / Examiner</th>
                    <th className="py-3 px-3">Status</th>
                    {isLeadership && <th className="py-3 px-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {examScheduleSlots
                    .filter(s => {
                      if (s.examId !== scheduleExamFilter) return false;
                      if (scheduleStandardFilter !== 'all' && s.standard !== scheduleStandardFilter) return false;
                      return true;
                    })
                    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
                    .map(slot => {
                      const hasConflict = activeConflicts.some(c => c.slotIds.includes(slot.id));

                      return (
                        <tr key={slot.id} className={`hover:bg-slate-50/70 ${hasConflict ? 'bg-amber-50/40' : ''}`}>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{slot.date}</td>
                          <td className="py-2.5 px-3 font-mono font-semibold">Std {slot.standard}-{slot.section}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{slot.subject}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-700">{slot.startTime} – {slot.endTime}</td>
                          <td className="py-2.5 px-3 font-mono">{slot.durationMinutes} min</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{slot.room}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{slot.examinerTeacherName}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                slot.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : slot.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-200 text-slate-800'
                              }`}
                            >
                              {slot.status}
                            </span>
                          </td>
                          {isLeadership && (
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => deleteExamScheduleSlot(slot.id)}
                                className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Remove Exam Session"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Publishing Footer */}
            {isLeadership && (
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Publication distributes official dates to parent mobile app and teacher portals.
                </span>
                <button
                  onClick={() => {
                    const res = publishExamination(scheduleExamFilter, 'Dr. Evelyn Montgomery');
                    if (res.success) showToast(res.message, 'success');
                    else showToast(res.message, 'error');
                  }}
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-xs flex items-center gap-1.5`}
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Master Exam Schedule</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: MODERATION & APPROVAL WORKFLOW (LEADERSHIP)            */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'moderation' && isLeadership && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Academic Score Moderation & Endorsement Queue
              </h3>
              <p className="text-xs text-slate-500">
                Review faculty marks submissions, evaluate grade curves, endorse scores or return with correction feedback
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={moderationStatusFilter}
                onChange={e => setModerationStatusFilter(e.target.value as any)}
                className="text-xs py-2 px-3 rounded-xl border border-slate-200 font-semibold bg-white text-slate-800"
              >
                <option value="all">All Moderation Statuses</option>
                <option value="submitted">Submitted (Pending Review)</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="returned_for_correction">Returned for Correction</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Examination</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Submitting Faculty</th>
                  <th className="py-3 px-3">Students Evaluated</th>
                  <th className="py-3 px-3">Submission Timestamp</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {subjectAssessments
                  .filter(a => {
                    if (moderationStatusFilter !== 'all' && a.marksEntryStatus !== moderationStatusFilter) return false;
                    return true;
                  })
                  .map(asmt => {
                    return (
                      <tr key={asmt.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{asmt.examName}</td>
                        <td className="py-2.5 px-3 font-mono font-bold">Std {asmt.standard}-{asmt.section}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{asmt.subject}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{asmt.assignedTeacherName}</td>
                        <td className="py-2.5 px-3 font-mono">
                          {asmt.enteredCount || 16} / {asmt.totalStudents || 16}
                          {(asmt.absentCount || 0) > 0 && (
                            <span className="text-rose-600 font-bold ml-1">({asmt.absentCount} ABS)</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{asmt.submittedAt || 'Draft'}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              asmt.marksEntryStatus === 'approved' || asmt.marksEntryStatus === 'published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : asmt.marksEntryStatus === 'submitted'
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : asmt.marksEntryStatus === 'returned_for_correction'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {asmt.marksEntryStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setMarksEntryExamId(asmt.examId);
                                setMarksStandard(asmt.standard);
                                setMarksSection(asmt.section);
                                setMarksSubject(asmt.subject);
                                setActiveTab('marks_entry');
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> Inspect
                            </button>

                            {asmt.marksEntryStatus === 'submitted' && (
                              <>
                                <button
                                  onClick={() => {
                                    reviewAssessmentMarks(asmt.id, 'approved', 'Prof. Marcus Vance (VP)');
                                  }}
                                  className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                                >
                                  <Check className="w-3.5 h-3.5" /> Endorse
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedAssessmentForReview(asmt);
                                    setShowRejectModal(true);
                                  }}
                                  className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <X className="w-3.5 h-3.5" /> Return
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: RESULTS & OFFICIAL REPORT CARDS                        */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Consolidated Results & Official Report Cards
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Class-wise scholastic performance broadsheet, division calculations, CBSE grades, and printable report cards
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={resultExamId}
                onChange={e => setResultExamId(e.target.value)}
                className="text-xs py-2 px-3 rounded-xl border border-slate-200 font-semibold bg-white text-slate-800"
              >
                {examinations.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.term})</option>
                ))}
              </select>

              <select
                value={`${resultStandard}-${resultSection}`}
                onChange={e => {
                  const [std, sec] = e.target.value.split('-');
                  setResultStandard(Number(std));
                  setResultSection(sec as 'A' | 'B');
                }}
                className="text-xs py-2 px-3 rounded-xl border border-slate-200 font-semibold bg-white text-slate-800"
              >
                <option value="8-A">Class 8-A</option>
                <option value="8-B">Class 8-B</option>
                <option value="9-A">Class 9-A</option>
                <option value="9-B">Class 9-B</option>
              </select>

              {isLeadership && (
                <button
                  onClick={() => {
                    const res = publishExamResults(resultExamId, resultStandard, resultSection, 'Dr. Evelyn Montgomery');
                    if (res.success) showToast(res.message, 'success');
                    else showToast(res.message, 'error');
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-xs`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Class Results</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Summary HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Total Candidates</span>
              <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{consolidatedClassResults.length}</div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Class Average</span>
              <div className="text-xl font-bold font-mono text-blue-700 mt-0.5">
                {(consolidatedClassResults.reduce((acc, r) => acc + r.percentage, 0) / (consolidatedClassResults.length || 1)).toFixed(1)}%
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Class Topper</span>
              <div className="text-sm font-bold text-emerald-800 truncate mt-1">
                {consolidatedClassResults[0]?.student.name} ({consolidatedClassResults[0]?.percentage}%)
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Pass Percentage</span>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-0.5">
                {Math.round((consolidatedClassResults.filter(r => !r.anyFail).length / (consolidatedClassResults.length || 1)) * 100)}%
              </div>
            </div>
          </div>

          {/* Consolidated Broadsheet Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 w-16">Rank</th>
                  <th className="py-3 px-3">Roll #</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Admission No</th>
                  <th className="py-3 px-3 text-center">Total Scored</th>
                  <th className="py-3 px-3 text-center">Aggregate %</th>
                  <th className="py-3 px-3 text-center">CBSE Grade</th>
                  <th className="py-3 px-3 text-center">Division Status</th>
                  <th className="py-3 px-3 text-right">Official Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {consolidatedClassResults.map(row => {
                  return (
                    <tr key={row.student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3">
                        {row.rank ? (
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono font-bold text-[11px] ${
                              row.rank === 1
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : row.rank === 2
                                ? 'bg-slate-200 text-slate-800 border border-slate-300'
                                : row.rank === 3
                                ? 'bg-amber-50 text-amber-800'
                                : 'text-slate-600'
                            }`}
                          >
                            #{row.rank}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold">#{row.student.rollNo}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{row.student.name}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{row.student.admissionNo}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        {row.totalObtained} / {row.totalMax}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                        {row.percentage}%
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-blue-50 text-blue-800 border border-blue-200">
                          {row.overallGrade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.division === '1st Division'
                              ? 'bg-emerald-50 text-emerald-800'
                              : row.division === '2nd Division'
                              ? 'bg-blue-50 text-blue-800'
                              : 'bg-rose-50 text-rose-800'
                          }`}
                        >
                          {row.division}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleOpenReportCard(row)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Generate Report Card</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: ASSIGNMENTS & HOMEWORK MONITOR                         */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Homework & Assignment Manager</h3>
              <p className="text-xs text-slate-500">Create, monitor submissions, and record continuous internal assessment marks</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={asgStandardFilter}
                onChange={e => setAsgStandardFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="text-xs py-2 px-3 rounded-xl border border-slate-200 font-semibold bg-white text-slate-800"
              >
                <option value="all">All Standards</option>
                <option value={8}>Standard 8</option>
                <option value={9}>Standard 9</option>
              </select>

              <button
                onClick={handleOpenCreateAssignment}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-xs`}
              >
                <Plus className="w-4 h-4" />
                <span>Create Assignment</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments
              .filter(a => asgStandardFilter === 'all' || a.standard === asgStandardFilter)
              .map(asg => {
                const subs = assignmentSubmissions.filter(s => s.assignmentId === asg.id);
                const gradedCount = subs.filter(s => s.status === 'graded').length;

                return (
                  <div key={asg.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{asg.title}</h4>
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                            Std {asg.standard}-{asg.section}
                          </span>
                        </div>
                        <p className="text-xs text-blue-700 font-semibold mt-0.5">{asg.subject}</p>
                      </div>

                      <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                        Due: {asg.dueDate}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{asg.description}</p>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500">
                        Submissions: <strong className="text-slate-900 font-mono">{subs.length} Turned In</strong> (of {asg.totalStudents})
                      </span>
                      <span className="font-mono text-emerald-700 font-bold">
                        {gradedCount} Graded
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2 text-xs">
                      <span className="text-slate-500 text-[11px]">Assigned by: {asg.teacherName}</span>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          onClick={() => setSelectedAssignmentForGrading(asg)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors"
                          title="Review student work and commit marks"
                        >
                          <FileCheck className="w-3.5 h-3.5" /> Grade ({subs.length})
                        </button>
                        <button
                          onClick={() => handleOpenEditAssignment(asg)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit assignment details and due date"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setAssignmentToDelete(asg)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Archive or delete assignment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 7: EXAM MASTER SETUP & CONFIG (LEADERSHIP)                */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'setup' && isLeadership && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Examination Master Setup</h3>
              <p className="text-xs text-slate-500">Configure academic terms, examination windows, and subject assessments</p>
            </div>

            <button
              onClick={() => setShowCreateExamModal(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-xs`}
            >
              <Plus className="w-4 h-4" />
              <span>New Examination</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Examination Name</th>
                  <th className="py-3 px-3">Academic Term</th>
                  <th className="py-3 px-3">Dates</th>
                  <th className="py-3 px-3">Applicable Classes</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {examinations.map(exam => (
                  <tr key={exam.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{exam.name}</td>
                    <td className="py-2.5 px-3 font-mono">{exam.academicYear} · {exam.term}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{exam.startDate} to {exam.endDate}</td>
                    <td className="py-2.5 px-3 font-mono">
                      {exam.applicableClasses.map(c => `${c.standard}-${c.section}`).join(', ')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          exam.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : exam.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {exam.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setDuplicateTargetExam(exam);
                            setDuplicateNewName(`${exam.name} (Copy)`);
                          }}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Duplicate Exam Structure"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {exam.status !== 'archived' && (
                          <button
                            onClick={() => archiveExamination(exam.id)}
                            className="p-1.5 text-slate-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Archive Examination"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 8: ANALYTICS & TOPPERS                                    */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'analytics' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Academic Analytics & Performance Leaderboard</h3>
              <p className="text-xs text-slate-500">Comparative grade distribution, subject percentiles, and honor rolls</p>
            </div>

            {/* Top 5 Toppers Podium */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Class 8-A Mid-Term Honor Roll (Top 5 Candidates)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {consolidatedClassResults.slice(0, 5).map((row, i) => (
                  <div key={row.student.id} className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1 shadow-2xs">
                    <span
                      className={`inline-block w-6 h-6 rounded-full font-mono font-bold text-xs leading-6 ${
                        i === 0 ? 'bg-amber-100 text-amber-900' : i === 1 ? 'bg-slate-200 text-slate-800' : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      #{i + 1}
                    </span>
                    <div className="font-bold text-slate-900 text-xs truncate">{row.student.name}</div>
                    <div className="text-lg font-bold font-mono text-blue-700">{row.percentage}%</div>
                    <div className="text-[10px] text-slate-500 font-mono">Grade {row.overallGrade}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade Distribution Histogram */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Grade Distribution (CBSE 9-Point Scale)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
                {[
                  { grade: 'A1', min: '91-100%', count: consolidatedClassResults.filter(r => r.overallGrade === 'A1').length, color: 'bg-emerald-600' },
                  { grade: 'A2', min: '81-90%', count: consolidatedClassResults.filter(r => r.overallGrade === 'A2').length, color: 'bg-emerald-500' },
                  { grade: 'B1', min: '71-80%', count: consolidatedClassResults.filter(r => r.overallGrade === 'B1').length, color: 'bg-blue-600' },
                  { grade: 'B2', min: '61-70%', count: consolidatedClassResults.filter(r => r.overallGrade === 'B2').length, color: 'bg-blue-500' },
                  { grade: 'C1', min: '51-60%', count: consolidatedClassResults.filter(r => r.overallGrade === 'C1').length, color: 'bg-amber-500' },
                  { grade: 'C2', min: '41-50%', count: consolidatedClassResults.filter(r => r.overallGrade === 'C2').length, color: 'bg-amber-600' },
                  { grade: 'D', min: '33-40%', count: consolidatedClassResults.filter(r => r.overallGrade === 'D').length, color: 'bg-orange-500' },
                  { grade: 'E', min: '<33%', count: consolidatedClassResults.filter(r => r.overallGrade === 'E').length, color: 'bg-rose-600' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-1">
                    <span className="text-xs font-bold font-mono text-slate-900">{item.grade}</span>
                    <div className="text-xs text-slate-500 text-[10px] font-mono">{item.min}</div>
                    <div className="text-xl font-bold font-mono text-slate-800">{item.count}</div>
                    <div className="text-[10px] text-slate-400">Students</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 9: ASSESSMENT SETTINGS & RULES (LEADERSHIP)               */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'settings' && isLeadership && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Institutional Assessment & Moderation Policies</h3>
            <p className="text-xs text-slate-500">CBSE compliance parameters, passing benchmarks, and grace mark thresholds</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Grading & Passing Benchmarks</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-600">Standard Minimum Passing Marks:</span>
                  <span className="font-bold font-mono text-slate-900">33.0%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-600">Minimum Exam Eligibility Attendance:</span>
                  <span className="font-bold font-mono text-slate-900">75.0% Mandatory</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-600">Allow Moderation Grace Marks:</span>
                  <span className="font-bold text-emerald-700">Enabled (Max 5 Marks)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Official CBSE Scale In Effect</h4>
              <p className="text-slate-600">
                Secondary Wings (Standards 6 through 10) operate under the CBSE 9-Point Grading Scale (A1 down to E2).
                Primary Wings (Standards 1 through 5) operate under 5-Tier Letter Grading (A, B, C, D, E).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: OFFICIAL GREENFIELD REPORT CARD GENERATOR              */}
      {/* ------------------------------------------------------------- */}
      {selectedStudentForReportCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6">
            {/* Modal Top Actions */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  CBSE Affiliated · ISO 9001:2015
                </span>
                <span className="text-xs text-slate-500 font-mono">Document ID: {selectedStudentForReportCard.admissionNo}-RC</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => {
                    showToast(`Report Card PDF exported: ${selectedStudentForReportCard.studentName}_${selectedStudentForReportCard.examName}.pdf`, 'success');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-xs flex items-center gap-1.5`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setSelectedStudentForReportCard(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formal Report Card Header */}
            <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white font-bold font-serif flex items-center justify-center mx-auto text-xl shadow-md">
                GIS
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-serif tracking-tight text-slate-900 uppercase">
                Greenfield International School
              </h2>
              <p className="text-xs text-slate-600 font-serif">
                Plot 12, Institutional Area, Knowledge Park III, New Delhi 110016
              </p>
              <p className="text-[11px] font-mono text-slate-500">
                Affiliation No: CBSE-2026-4412 · School Code: GIS-8831
              </p>
              <div className="inline-block mt-2 px-4 py-1 rounded-md bg-slate-900 text-white font-bold text-xs uppercase tracking-widest font-mono">
                Official Student Academic Performance Report
              </div>
            </div>

            {/* Student Demographic Information Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Student Full Name:</span>
                <div className="font-bold text-slate-900">{selectedStudentForReportCard.studentName}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Admission / Scholar No:</span>
                <div className="font-bold font-mono text-slate-900">{selectedStudentForReportCard.admissionNo}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Standard & Section:</span>
                <div className="font-bold font-mono text-slate-900">
                  Standard {selectedStudentForReportCard.standard} — Section {selectedStudentForReportCard.section}
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Roll Number:</span>
                <div className="font-bold font-mono text-slate-900">#{selectedStudentForReportCard.rollNo}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Academic Cycle:</span>
                <div className="font-semibold text-slate-800">{selectedStudentForReportCard.academicYear} ({selectedStudentForReportCard.term})</div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Assessment Type:</span>
                <div className="font-semibold text-slate-800">{selectedStudentForReportCard.examName}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Term Attendance:</span>
                <div className="font-bold font-mono text-slate-900">
                  {selectedStudentForReportCard.attendancePresent} / {selectedStudentForReportCard.attendanceTotal} Days ({selectedStudentForReportCard.attendancePercentage}%)
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Class Rank:</span>
                <div className="font-bold font-mono text-blue-700">
                  {selectedStudentForReportCard.rank ? `Rank #${selectedStudentForReportCard.rank}` : 'Promoted'}
                </div>
              </div>
            </div>

            {/* PART 1: SCHOLASTIC PERFORMANCE TABLE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Part 1: Scholastic Performance
                </h4>
                <span className="text-[11px] text-slate-500">Graded on CBSE 9-Point Scale</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-300">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <tr>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3 text-center">Written (80)</th>
                      <th className="py-2.5 px-3 text-center">Practical (20)</th>
                      <th className="py-2.5 px-3 text-center">Total (100)</th>
                      <th className="py-2.5 px-3 text-center">Percentage</th>
                      <th className="py-2.5 px-3 text-center">Grade</th>
                      <th className="py-2.5 px-3">Faculty Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {selectedStudentForReportCard.subjects.map((sub, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{sub.subject}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{sub.writtenObtained ?? '-'}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{sub.practicalObtained ?? '-'}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                          {sub.totalObtained}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">{sub.percentage}%</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-800">
                          {sub.grade}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 italic text-[11px]">{sub.teacherRemarks}</td>
                      </tr>
                    ))}
                    {/* Summary Row */}
                    <tr className="bg-slate-100 font-bold text-slate-900">
                      <td className="py-2.5 px-3 uppercase">Aggregate Totals</td>
                      <td className="py-2.5 px-3 text-center font-mono">-</td>
                      <td className="py-2.5 px-3 text-center font-mono">-</td>
                      <td className="py-2.5 px-3 text-center font-mono text-sm">
                        {selectedStudentForReportCard.totalMarksObtained} / {selectedStudentForReportCard.totalMaxMarks}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-sm text-blue-700">
                        {selectedStudentForReportCard.overallPercentage}%
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-sm text-emerald-700">
                        {selectedStudentForReportCard.overallGrade}
                      </td>
                      <td className="py-2.5 px-3 text-emerald-800 uppercase font-mono">
                        {selectedStudentForReportCard.resultStatus}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* PART 2: CO-SCHOLASTIC DOMAINS & CONDUCT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 bg-slate-50/50">
                <h5 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  Part 2: Co-Scholastic & Behavioral Areas
                </h5>
                <div className="space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Work Education / STEM Projects:</span>
                    <span className="font-bold font-mono text-emerald-700">A (Exemplary)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Art & Cultural Expression:</span>
                    <span className="font-bold font-mono text-emerald-700">A (Proficient)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Health, Yoga & Physical Education:</span>
                    <span className="font-bold font-mono text-emerald-700">A+ (Active)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">School Discipline & Peer Courtesy:</span>
                    <span className="font-bold font-mono text-emerald-700">Grade A</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 bg-slate-50/50">
                <h5 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  Comprehensive Faculty Remarks
                </h5>
                <p className="text-slate-700 italic text-xs leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  "{selectedStudentForReportCard.generalRemarks}"
                </p>
                <div className="text-[11px] text-slate-500 pt-1">
                  Promotional Status: <strong className="text-slate-800">Qualified for next term assessment cycle.</strong>
                </div>
              </div>
            </div>

            {/* Formal Signatures & Endorsement Seals */}
            <div className="pt-8 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <div className="font-serif italic font-bold text-slate-800 pb-1">Shalini Verma</div>
                <div className="border-t border-slate-400 pt-1 text-slate-600 font-medium">Class Teacher Signature</div>
              </div>
              <div>
                <div className="font-serif italic font-bold text-slate-800 pb-1">Marcus Vance</div>
                <div className="border-t border-slate-400 pt-1 text-slate-600 font-medium">Academic Coordinator</div>
              </div>
              <div>
                <div className="font-serif italic font-bold text-slate-800 pb-1">Dr. Evelyn Montgomery</div>
                <div className="border-t border-slate-400 pt-1 text-slate-600 font-medium">Principal & Institutional Seal</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CREATE NEW EXAMINATION                                 */}
      {/* ------------------------------------------------------------- */}
      {showCreateExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Academic Examination</h3>
              <button
                onClick={() => setShowCreateExamModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Examination Title</label>
                <input
                  type="text"
                  value={newExamForm.name}
                  onChange={e => setNewExamForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Unit Test 3, Final Board Mock"
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Year</label>
                  <select
                    value={newExamForm.academicYear}
                    onChange={e => setNewExamForm(p => ({ ...p, academicYear: e.target.value }))}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                  >
                    <option value="2026–2027">2026–2027</option>
                    <option value="2025–2026">2025–2026</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Term</label>
                  <select
                    value={newExamForm.term}
                    onChange={e => setNewExamForm(p => ({ ...p, term: e.target.value }))}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newExamForm.startDate}
                    onChange={e => setNewExamForm(p => ({ ...p, startDate: e.target.value }))}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newExamForm.endDate}
                    onChange={e => setNewExamForm(p => ({ ...p, endDate: e.target.value }))}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructions for Faculty & Candidates</label>
                <textarea
                  rows={2}
                  value={newExamForm.instructions}
                  onChange={e => setNewExamForm(p => ({ ...p, instructions: e.target.value }))}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCreateExamModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newExamForm.name.trim()) {
                    showToast('Please provide an examination name.', 'error');
                    return;
                  }

                  const res = createExamination({
                    name: newExamForm.name.trim(),
                    academicYear: newExamForm.academicYear,
                    term: newExamForm.term,
                    applicableClasses: [
                      { standard: 8, section: 'A' },
                      { standard: 8, section: 'B' },
                      { standard: 9, section: 'A' },
                      { standard: 9, section: 'B' }
                    ],
                    startDate: newExamForm.startDate,
                    endDate: newExamForm.endDate,
                    status: 'draft',
                    instructions: newExamForm.instructions,
                    notes: newExamForm.notes
                  });

                  if (res.success) {
                    showToast(res.message, 'success');
                    setShowCreateExamModal(false);
                  } else {
                    showToast(res.message, 'error');
                  }
                }}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-xs`}
              >
                Create Examination Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DUPLICATE EXAMINATION                                  */}
      {/* ------------------------------------------------------------- */}
      {duplicateTargetExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Duplicate Examination Blueprint</h3>
            <p className="text-xs text-slate-500">
              This clones the assessment configs, classes, and subjects from <strong>{duplicateTargetExam.name}</strong> into a new draft examination.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Examination Name</label>
              <input
                type="text"
                value={duplicateNewName}
                onChange={e => setDuplicateNewName(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDuplicateTargetExam(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const res = duplicateExamination(duplicateTargetExam.id, duplicateNewName);
                  if (res.success) {
                    showToast(res.message, 'success');
                    setDuplicateTargetExam(null);
                  } else {
                    showToast(res.message, 'error');
                  }
                }}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
              >
                Duplicate Structure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD EXAM SCHEDULE SLOT                                 */}
      {/* ------------------------------------------------------------- */}
      {showAddSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Schedule Examination Session</h3>
              <button
                onClick={() => setShowAddSlotModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Standard</label>
                  <select
                    value={newSlotForm.standard}
                    onChange={e => setNewSlotForm(p => ({ ...p, standard: Number(e.target.value) }))}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                  >
                    <option value={8}>Standard 8</option>
                    <option value={9}>Standard 9</option>
                    <option value={10}>Standard 10</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section</label>
                  <select
                    value={newSlotForm.section}
                    onChange={e => setNewSlotForm(p => ({ ...p, section: e.target.value as 'A' | 'B' }))}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={newSlotForm.subject}
                  onChange={e => setNewSlotForm(p => ({ ...p, subject: e.target.value }))}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newSlotForm.date}
                    onChange={e => setNewSlotForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newSlotForm.startTime}
                    onChange={e => setNewSlotForm(p => ({ ...p, startTime: e.target.value }))}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={newSlotForm.endTime}
                    onChange={e => setNewSlotForm(p => ({ ...p, endTime: e.target.value }))}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Examination Hall / Room</label>
                  <input
                    type="text"
                    value={newSlotForm.room}
                    onChange={e => setNewSlotForm(p => ({ ...p, room: e.target.value }))}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Invigilator</label>
                  <select
                    value={newSlotForm.examinerTeacherId}
                    onChange={e => {
                      const tch = teachers.find(t => t.id === e.target.value);
                      setNewSlotForm(p => ({
                        ...p,
                        examinerTeacherId: e.target.value,
                        examinerTeacherName: tch?.name || 'Mrs. Shalini Verma'
                      }));
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddSlotModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const targetExam = examinations.find(e => e.id === newSlotForm.examId) || examinations[0];
                  const res = createExamScheduleSlot({
                    examId: targetExam.id,
                    examName: targetExam.name,
                    date: newSlotForm.date,
                    standard: newSlotForm.standard,
                    section: newSlotForm.section,
                    subjectId: 'sub-custom',
                    subject: newSlotForm.subject,
                    startTime: newSlotForm.startTime,
                    endTime: newSlotForm.endTime,
                    durationMinutes: newSlotForm.durationMinutes,
                    room: newSlotForm.room,
                    examinerTeacherId: newSlotForm.examinerTeacherId,
                    examinerTeacherName: teachers.find(t => t.id === newSlotForm.examinerTeacherId)?.name || 'Mrs. Shalini Verma',
                    status: 'draft',
                    instructions: newSlotForm.instructions
                  });

                  if (res.success) {
                    showToast(res.message, 'success');
                    setShowAddSlotModal(false);
                  } else {
                    showToast(res.message, 'error');
                  }
                }}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
              >
                Schedule Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: RETURN MARKS FOR CORRECTION                            */}
      {/* ------------------------------------------------------------- */}
      {showRejectModal && selectedAssessmentForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Return Scores for Faculty Correction</h3>
            <p className="text-xs text-slate-500">
              Returning marks for <strong>{selectedAssessmentForReview.subject} (Std {selectedAssessmentForReview.standard}-{selectedAssessmentForReview.section})</strong> to {selectedAssessmentForReview.assignedTeacherName}.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason / Action Required for Faculty:
              </label>
              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={e => setRejectionReasonInput(e.target.value)}
                placeholder="e.g. Please re-check Roll #4 practical marks and recalculate internal assessment totals."
                className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  reviewAssessmentMarks(
                    selectedAssessmentForReview.id,
                    'returned_for_correction',
                    'Prof. Marcus Vance (VP)',
                    rejectionReasonInput
                  );
                  setShowRejectModal(false);
                  setRejectionReasonInput('');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: GRADE ASSIGNMENT SUBMISSION                            */}
      {/* ------------------------------------------------------------- */}
      {selectedAssignmentForGrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-3xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Grade Submissions: {selectedAssignmentForGrading.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Class {selectedAssignmentForGrading.standard}-{selectedAssignmentForGrading.section} · {selectedAssignmentForGrading.subject}
                </p>
              </div>
              <button
                onClick={() => setSelectedAssignmentForGrading(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submissions List */}
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Roll #</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Submission Time</th>
                      <th className="py-2.5 px-3 text-center">Score</th>
                      <th className="py-2.5 px-3 text-center">Grade</th>
                      <th className="py-2.5 px-3">Teacher Feedback</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {assignmentSubmissions
                      .filter(s => s.assignmentId === selectedAssignmentForGrading.id)
                      .map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-50/70">
                          <td className="py-2 px-3 font-mono font-bold">#{sub.rollNo}</td>
                          <td className="py-2 px-3 font-semibold text-slate-900">{sub.studentName}</td>
                          <td className="py-2 px-3 font-mono text-slate-500">{sub.submittedDate}</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-slate-900">
                            {sub.marksObtained !== undefined ? `${sub.marksObtained} / ${sub.maxMarks || 20}` : 'Pending'}
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-blue-700">
                            {sub.grade || '-'}
                          </td>
                          <td className="py-2 px-3 text-slate-600 italic text-[11px] max-w-xs truncate">
                            {sub.teacherFeedback || 'No feedback logged.'}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              onClick={() => {
                                setGradingSubmission(sub);
                                setGradingMarksInput(sub.marksObtained ?? 18);
                                setGradingFeedbackInput(sub.teacherFeedback ?? 'Thorough working and clean proofs.');
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              Grade / Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Individual Grading Drawer/Panel if selected */}
            {gradingSubmission && (
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">
                    Grading: {gradingSubmission.studentName} (Roll #{gradingSubmission.rollNo})
                  </span>
                  <button
                    onClick={() => setGradingSubmission(null)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Marks Obtained (Max 20)</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={gradingMarksInput}
                      onChange={e => setGradingMarksInput(Number(e.target.value))}
                      className="w-full py-1.5 px-3 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Teacher Feedback Comment</label>
                    <input
                      type="text"
                      value={gradingFeedbackInput}
                      onChange={e => setGradingFeedbackInput(e.target.value)}
                      placeholder="e.g. Accurate steps and clean diagram"
                      className="w-full py-1.5 px-3 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      gradeAssignmentSubmission(gradingSubmission.id, gradingMarksInput, 20, gradingFeedbackInput);
                      setGradingSubmission(null);
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-white ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                  >
                    Commit Grade
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT CLASS ASSIGNMENT                      */}
      {/* ========================================================= */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingAssignment ? 'Edit Homework Assignment' : 'Create New Class Assignment'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingAssignment ? `Update assignment details for Std ${editingAssignment.standard}-${editingAssignment.section}` : 'Assign homework, term projects, or practical portfolios'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateAssignmentModal(false);
                  setEditingAssignment(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignmentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Algebraic Identities & Polynomial Factorisation"
                  value={newAsgForm.title}
                  onChange={e => setNewAsgForm({ ...newAsgForm, title: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border ${asgErrors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'} font-medium focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {asgErrors.title && <p className="text-[11px] text-rose-600 mt-1">{asgErrors.title}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Standard</label>
                  <select
                    value={newAsgForm.standard}
                    onChange={e => setNewAsgForm({ ...newAsgForm, standard: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                      <option key={s} value={s}>Standard {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Section</label>
                  <select
                    value={newAsgForm.section}
                    onChange={e => setNewAsgForm({ ...newAsgForm, section: e.target.value as 'A' | 'B' })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={newAsgForm.subject}
                    onChange={e => setNewAsgForm({ ...newAsgForm, subject: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    {subjects.map(sub => (
                      <option key={sub.id} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Submission Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newAsgForm.dueDate}
                    onChange={e => setNewAsgForm({ ...newAsgForm, dueDate: e.target.value })}
                    className={`w-full p-2 rounded-xl border ${asgErrors.dueDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'} font-mono font-medium`}
                  />
                  {asgErrors.dueDate && <p className="text-[11px] text-rose-600 mt-1">{asgErrors.dueDate}</p>}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Grading Marks</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={newAsgForm.maxMarks}
                    onChange={e => setNewAsgForm({ ...newAsgForm, maxMarks: Number(e.target.value) })}
                    className={`w-full p-2 rounded-xl border ${asgErrors.maxMarks ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'} font-mono font-bold`}
                  />
                  {asgErrors.maxMarks && <p className="text-[11px] text-rose-600 mt-1">{asgErrors.maxMarks}</p>}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Detailed Description & Instructions *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide chapter exercises, formatting instructions, or project deliverables..."
                  value={newAsgForm.description}
                  onChange={e => setNewAsgForm({ ...newAsgForm, description: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border ${asgErrors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {asgErrors.description && <p className="text-[11px] text-rose-600 mt-1">{asgErrors.description}</p>}
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>Published assignments appear automatically in the Parent Mobile App and student academic diaries.</span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateAssignmentModal(false);
                    setEditingAssignment(null);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAsg}
                  className={`px-4 py-2 text-xs font-bold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-xs disabled:opacity-50`}
                >
                  {isSubmittingAsg ? 'Saving...' : editingAssignment ? 'Save Changes' : 'Publish Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE / ARCHIVE ASSIGNMENT CONFIRMATION            */}
      {/* ========================================================= */}
      {assignmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Archive Assignment?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to remove <strong>"{assignmentToDelete.title}"</strong> (Std {assignmentToDelete.standard}-{assignmentToDelete.section})?
              </p>
              <p className="text-[11px] text-slate-400 pt-1">
                Historical student submissions and internal assessment marks will remain archived for auditing.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAssignmentToDelete(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAssignment}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
