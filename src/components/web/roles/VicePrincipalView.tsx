import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Plus,
  Search,
  Users,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  BarChart2,
  CheckSquare,
  ShieldCheck,
  ArrowRightLeft,
  UserCheck,
  Bell,
  Download,
  AlertCircle,
  X,
  SendHorizontal,
  Phone,
  CheckCheck,
  Eye,
  Edit2,
  GraduationCap,
  School,
  Settings,
  Sliders,
  Palette,
  Check,
  Edit,
  Trash2,
  Layers
} from 'lucide-react';
import { Student, Teacher, SubjectEntity, SubjectAllocation } from '../../../types/school';
import { useSchool } from '../../../context/SchoolContext';
import { getThemeClasses } from '../../../utils/themeHelper';
import { StaffManager } from '../../common/StaffManager';
import { TimetableEditor } from '../../common/TimetableEditor';
import { StaffFormModal } from '../../common/StaffFormModal';
import { StudentProfileModal } from '../../common/StudentProfileModal';
import { StaffProfileModal } from '../../common/StaffProfileModal';
import { AttendanceManager } from '../../common/AttendanceManager';
import { ExaminationManager } from '../../common/ExaminationManager';
import { SCHLAR_PALETTES, getPaletteById } from '../../../theme/palettes';
import {
  applyThemeToDom,
  saveStoredActivePaletteId,
  saveStoredActiveColors
} from '../../../theme/themeEngine';

export const VicePrincipalView: React.FC = () => {
  const {
    activeTab,
    themeColor,
    students,
    teachers,
    marks,
    assignments,
    timetables,
    notices,
    attendance,
    fees,
    subjects,
    subjectAllocations,
    classes,
    addSubject,
    updateSubject,
    deleteSubject,
    saveSubjectAllocation,
    deleteSubjectAllocation,
    updateSection,
    saveMark,
    addNotice,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [viewingStaff, setViewingStaff] = useState<Teacher | null>(null);
  const [reportSubTab, setReportSubTab] = useState<'standing' | 'dues_clearance'>('standing');
  const [clearanceSearch, setClearanceSearch] = useState<string>('');

  // Filters
  const [selectedStandard, setSelectedStandard] = useState<number>(8);
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [showModerationToast, setShowModerationToast] = useState<string | null>(null);

  // Subject & Curriculum CRUD state
  const [subjectViewMode, setSubjectViewMode] = useState<'catalogue' | 'allocations' | 'pacing'>('catalogue');
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectEntity | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<SubjectEntity | null>(null);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [allocationToDelete, setAllocationToDelete] = useState<SubjectAllocation | null>(null);
  const [showEditSectionModal, setShowEditSectionModal] = useState(false);

  // Subject Form
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    category: 'Core Academic' as SubjectEntity['category'],
    applicableStandards: [6, 7, 8, 9, 10] as number[],
    weeklyPeriodsRequired: 5,
    description: '',
    status: 'active' as 'active' | 'inactive'
  });
  const [subjectErrors, setSubjectErrors] = useState<Record<string, string>>({});

  // Allocation Form
  const [allocForm, setAllocForm] = useState({
    academicYear: '2026–2027',
    standard: 8,
    section: 'A',
    subjectId: '',
    teacherId: '',
    weeklyPeriods: 5,
    room: 'Room 204'
  });

  // Section Edit Form
  const [sectionEditForm, setSectionEditForm] = useState({
    classTeacherId: '',
    room: '',
    capacity: 38
  });

  const handleOpenAddSubject = () => {
    setEditingSubject(null);
    setSubjectForm({
      name: '',
      code: '',
      category: 'Core Academic',
      applicableStandards: [6, 7, 8, 9, 10],
      weeklyPeriodsRequired: 5,
      description: '',
      status: 'active'
    });
    setSubjectErrors({});
    setShowSubjectModal(true);
  };

  const handleOpenEditSubject = (subj: SubjectEntity) => {
    setEditingSubject(subj);
    setSubjectForm({
      name: subj.name,
      code: subj.code,
      category: subj.category,
      applicableStandards: subj.applicableStandards,
      weeklyPeriodsRequired: subj.weeklyPeriodsRequired,
      description: subj.description || '',
      status: subj.status
    });
    setSubjectErrors({});
    setShowSubjectModal(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!subjectForm.name.trim() || subjectForm.name.trim().length < 3) {
      errs.name = 'Subject name must be at least 3 characters.';
    }
    if (!subjectForm.code.trim()) {
      errs.code = 'Subject curriculum code is required.';
    } else {
      const codeDuplicate = subjects.find(
        s => s.code.toLowerCase() === subjectForm.code.trim().toLowerCase() && s.id !== editingSubject?.id
      );
      if (codeDuplicate) {
        errs.code = `Code "${subjectForm.code}" already used by ${codeDuplicate.name}.`;
      }
    }
    if (subjectForm.applicableStandards.length === 0) {
      errs.applicableStandards = 'Select at least one applicable standard.';
    }
    if (subjectForm.weeklyPeriodsRequired < 1 || subjectForm.weeklyPeriodsRequired > 12) {
      errs.weeklyPeriodsRequired = 'Weekly periods must be between 1 and 12.';
    }

    if (Object.keys(errs).length > 0) {
      setSubjectErrors(errs);
      showToast('Please fix validation errors before saving.', 'error');
      return;
    }

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        name: subjectForm.name.trim(),
        code: subjectForm.code.trim().toUpperCase(),
        category: subjectForm.category,
        applicableStandards: subjectForm.applicableStandards,
        weeklyPeriodsRequired: subjectForm.weeklyPeriodsRequired,
        description: subjectForm.description.trim(),
        status: subjectForm.status
      });
      showToast(`Subject "${subjectForm.name}" updated successfully.`, 'success');
    } else {
      addSubject({
        name: subjectForm.name.trim(),
        code: subjectForm.code.trim().toUpperCase(),
        category: subjectForm.category,
        applicableStandards: subjectForm.applicableStandards,
        weeklyPeriodsRequired: subjectForm.weeklyPeriodsRequired,
        description: subjectForm.description.trim(),
        status: subjectForm.status
      });
      showToast(`Subject "${subjectForm.name}" registered in CBSE curriculum.`, 'success');
    }
    setShowSubjectModal(false);
    setEditingSubject(null);
  };

  const handleConfirmDeleteSubject = () => {
    if (!subjectToDelete) return;
    deleteSubject(subjectToDelete.id);
    showToast(`Subject "${subjectToDelete.name}" removed from curriculum.`, 'info');
    setSubjectToDelete(null);
  };

  const handleOpenAllocationModal = (std: number, sec: string) => {
    setAllocForm({
      academicYear: '2026–2027',
      standard: std,
      section: sec,
      subjectId: subjects[0]?.id || '',
      teacherId: teachers[0]?.id || '',
      weeklyPeriods: 5,
      room: `Room ${std}0${sec === 'A' ? '1' : '2'}`
    });
    setShowAllocationModal(true);
  };

  const handleSaveAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    const subj = subjects.find(s => s.id === allocForm.subjectId);
    const teacher = teachers.find(t => t.id === allocForm.teacherId);
    if (!subj) {
      showToast('Select a valid subject.', 'error');
      return;
    }

    const res = saveSubjectAllocation({
      academicYear: allocForm.academicYear,
      standard: allocForm.standard,
      section: allocForm.section,
      subjectId: subj.id,
      subjectName: subj.name,
      subjectCode: subj.code,
      teacherId: teacher?.id,
      teacherName: teacher?.name || 'Unassigned',
      weeklyPeriods: allocForm.weeklyPeriods,
      room: allocForm.room,
      status: teacher ? 'assigned' : 'unassigned'
    });

    if (res.success) {
      setShowAllocationModal(false);
    }
  };

  // Subject management curriculum state
  const curriculumTracks = [
    { standard: 8, subject: 'Mathematics', teacher: 'Mrs. Shalini Verma', syllabusCovered: 78, nextTopic: 'Factorisation & Algebraic Identities', status: 'On Track', periodsWeek: 6 },
    { standard: 8, subject: 'Science', teacher: 'Dr. Alok Sen', syllabusCovered: 82, nextTopic: 'Chemical Effects of Electric Current', status: 'Ahead', periodsWeek: 6 },
    { standard: 8, subject: 'English', teacher: 'Ms. Rebecca D\'Souza', syllabusCovered: 74, nextTopic: 'Direct and Indirect Speech', status: 'On Track', periodsWeek: 5 },
    { standard: 8, subject: 'Social Science', teacher: 'Mr. Arvind Saxena', syllabusCovered: 72, nextTopic: 'Judiciary & Criminal Justice System', status: 'On Track', periodsWeek: 5 },
    { standard: 9, subject: 'Mathematics', teacher: 'Mrs. Shalini Verma', syllabusCovered: 70, nextTopic: 'Surface Areas and Volumes', status: 'Review Needed', periodsWeek: 6 },
    { standard: 9, subject: 'Science', teacher: 'Dr. Alok Sen', syllabusCovered: 76, nextTopic: 'Gravitation & Floatation', status: 'On Track', periodsWeek: 6 },
    { standard: 10, subject: 'Science', teacher: 'Dr. Alok Sen', syllabusCovered: 88, nextTopic: 'Heredity and Evolution', status: 'Ahead', periodsWeek: 7 },
    { standard: 10, subject: 'Mathematics', teacher: 'Mrs. Shalini Verma', syllabusCovered: 84, nextTopic: 'Quadratic Equations & AP', status: 'Ahead', periodsWeek: 7 }
  ];

  // Marks filtered by standard
  const filteredMarks = marks.filter(m => m.standard === selectedStandard);

  const handleModerateMarks = (markId: string) => {
    setShowModerationToast(`Score endorsement recorded. Status updated to 'endorsed'.`);
    setTimeout(() => setShowModerationToast(null), 3000);
  };

  // Chronically low attendance (<88%)
  const lowAttendanceStudents = students.filter(s => s.attendanceRate < 88);
  const [warningLetterStudent, setWarningLetterStudent] = useState<Student | null>(null);
  const [attendanceRiskFilter, setAttendanceRiskFilter] = useState<'all' | 'critical' | 'warning'>('all');
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [warningSentToast, setWarningSentToast] = useState<string | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [appraisalToast, setAppraisalToast] = useState<string | null>(null);

  // States for Prompt 4 Vice Principal modules
  const [academicOpsTerm, setAcademicOpsTerm] = useState<'Term 1' | 'Term 2' | 'Term 3'>('Term 2');
  const [academicOpsFilter, setAcademicOpsFilter] = useState<'all' | 'Ahead' | 'On Track' | 'Review Needed'>('all');
  const [selectedClassKey, setSelectedClassKey] = useState<string>('8-A');
  const [progressStdFilter, setProgressStdFilter] = useState<number>(8);
  const [progressSearch, setProgressSearch] = useState<string>('');
  const [progressTabFilter, setProgressTabFilter] = useState<'all' | 'top' | 'at_risk'>('all');
  const [noticeFilter, setNoticeFilter] = useState<'all' | 'Academic' | 'Exam' | 'Holiday' | 'Fee' | 'General'>('all');
  const [showCreateNoticeModal, setShowCreateNoticeModal] = useState<boolean>(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<'Academic' | 'Exam' | 'Holiday' | 'Fee' | 'General'>('Academic');
  const [newNoticeAudience, setNewNoticeAudience] = useState<'all' | 'teachers' | 'parents' | 'admin'>('all');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [activePaletteId, setActivePaletteId] = useState<string>('palette-7');
  const [governancePacingThreshold, setGovernancePacingThreshold] = useState<number>(75);
  const [autoLockAttendanceHours, setAutoLockAttendanceHours] = useState<number>(24);

  return (
    <div className="space-y-6">
      {/* Overview Academic Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Top Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Curriculum Pacing</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">78.4%</h3>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" /> Term 2 Syllabus on Schedule
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Assignments</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{assignments.length}</h3>
              <p className="text-xs text-blue-600 font-medium mt-0.5">Across Standards 5 to 10</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty Coverage</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">100%</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Substitution Schedule Active</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Grade Average</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">89.2%</h3>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">Class 8-A Mid-Term Top Group</p>
            </div>
          </div>

          {/* Curriculum Pacing Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Syllabus Completion & Faculty Tracking</h3>
                <p className="text-xs text-slate-500">Term 2 academic milestones monitored across core subject departments</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">Standards 8 to 10</span>
            </div>

            <div className="space-y-3">
              {curriculumTracks.slice(0, 4).map((track, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Std {track.standard} · {track.subject}</span>
                      <span className="text-slate-400">({track.teacher})</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      track.status === 'Ahead' ? 'bg-blue-100 text-blue-800' : track.status === 'On Track' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {track.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${themeClasses.primaryBg}`} style={{ width: `${track.syllabusCovered}%` }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-800">{track.syllabusCovered}%</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>Next Milestone: {track.nextTopic}</span>
                    <span className="font-mono">{track.periodsWeek} periods/wk</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Academic Operations & Syllabus Milestones Review */}
      {activeTab === 'academic_ops' && (
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Academic Operations & Syllabus Milestones</h3>
                <p className="text-xs text-slate-500">Curriculum pacing audits, periodic assessment timelines, and departmental reviews</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  {(['Term 1', 'Term 2', 'Term 3'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setAcademicOpsTerm(t)}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${academicOpsTerm === t ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100">
                <span className="text-[11px] font-semibold text-blue-700 uppercase">Average Coverage</span>
                <div className="text-2xl font-bold font-mono text-blue-950 mt-0.5">78.4%</div>
                <span className="text-[10px] text-blue-600 font-medium">Term 2 target: 75% (Ahead)</span>
              </div>
              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                <span className="text-[11px] font-semibold text-emerald-700 uppercase">On-Schedule Tracks</span>
                <div className="text-2xl font-bold font-mono text-emerald-950 mt-0.5">7 / 8</div>
                <span className="text-[10px] text-emerald-600 font-medium">Standards 8 to 10</span>
              </div>
              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-100">
                <span className="text-[11px] font-semibold text-amber-700 uppercase">Review Required</span>
                <div className="text-2xl font-bold font-mono text-amber-950 mt-0.5">1 Subject</div>
                <span className="text-[10px] text-amber-600 font-medium">Std 9 Mathematics</span>
              </div>
              <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-100">
                <span className="text-[11px] font-semibold text-purple-700 uppercase">Faculty Reviews</span>
                <div className="text-2xl font-bold font-mono text-purple-950 mt-0.5">100%</div>
                <span className="text-[10px] text-purple-600 font-medium">Mid-term audit completed</span>
              </div>
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-500">Filter by Status:</span>
              {(['all', 'Ahead', 'On Track', 'Review Needed'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setAcademicOpsFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    academicOpsFilter === st
                      ? 'bg-blue-700 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'All Departments' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Curriculum Tracks Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {academicOpsTerm} Department Syllabus Audits & Pacing
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {curriculumTracks
                .filter(t => academicOpsFilter === 'all' || t.status === academicOpsFilter)
                .map((track, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                            Std {track.standard}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{track.subject}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Lead Faculty: {track.teacher}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        track.status === 'Ahead'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : track.status === 'On Track'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {track.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600 font-medium">Syllabus Completion</span>
                        <span className="font-bold font-mono text-slate-900">{track.syllabusCovered}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${themeClasses.primaryBg}`} style={{ width: `${track.syllabusCovered}%` }} />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400">Current Milestone:</span>
                        <div className="font-semibold text-slate-800 truncate max-w-xs">{track.nextTopic}</div>
                      </div>
                      <button
                        onClick={() => {
                          showToast(`Syllabus pacing audit recorded for Std ${track.standard} ${track.subject}.`, 'success');
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg shrink-0"
                      >
                        Audit Pacing
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Class & Section Oversight */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          {/* Class Switcher & Overview Header */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Class & Section Oversight</h3>
                <p className="text-xs text-slate-500">Monitor roster enrollments, class teachers, attendance standing, and subject allocations</p>
              </div>

              {/* Class Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {(['8-A', '8-B', '9-A', '9-B', '10-A', '10-B'] as const).map(cls => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClassKey(cls)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                      selectedClassKey === cls
                        ? 'bg-blue-700 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Class {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Class Details Banner */}
            {(() => {
              const [std, sec] = selectedClassKey.split('-');
              const classRoster = students.filter(s => s.standard === Number(std) && s.section === sec);
              const classTeacherName =
                selectedClassKey === '8-A' ? 'Mrs. Shalini Verma' :
                selectedClassKey === '8-B' ? 'Dr. Alok Sen' :
                selectedClassKey === '9-A' ? 'Ms. Rebecca D\'Souza' :
                selectedClassKey === '9-B' ? 'Mr. Arvind Saxena' :
                selectedClassKey === '10-A' ? 'Mrs. Shalini Verma' : 'Dr. Alok Sen';
              const avgAttn = classRoster.length > 0
                ? Math.round(classRoster.reduce((acc, s) => acc + s.attendanceRate, 0) / classRoster.length)
                : 91;

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Class Teacher</span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">{classTeacherName}</div>
                    <span className="text-[10px] text-blue-700 font-medium">Faculty Lead</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Enrolled Strength</span>
                    <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">{classRoster.length} Students</div>
                    <span className="text-[10px] text-slate-500 font-medium">Sanctioned: 35</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Average Attendance</span>
                    <div className="text-sm font-bold font-mono text-emerald-700 mt-0.5">{avgAttn}%</div>
                    <span className="text-[10px] text-emerald-600 font-medium">CBSE threshold: 75%</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Classroom Wing</span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">Wing B · Room {std === '8' ? '20' + (sec === 'A' ? '4' : '5') : '30' + (sec === 'A' ? '2' : '3')}</div>
                    <span className="text-[10px] text-slate-500 font-medium">Smart Classroom Active</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Student Roster Table */}
          {(() => {
            const [std, sec] = selectedClassKey.split('-');
            const classRoster = students.filter(s => s.standard === Number(std) && s.section === sec);

            return (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Class {selectedClassKey} Student Roster ({classRoster.length} Students)
                  </h4>
                  <span className="text-xs text-slate-500">Authorized for Academic Governance</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Roll #</th>
                        <th className="py-2.5 px-3">Admission No</th>
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3">Gender</th>
                        <th className="py-2.5 px-3">Attendance Rate</th>
                        <th className="py-2.5 px-3">Parent / Guardian</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {classRoster.map(s => {
                        const isAtRisk = s.attendanceRate < 75;
                        return (
                          <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">#{s.rollNo}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-600">{s.admissionNo}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{s.name}</td>
                            <td className="py-2.5 px-3 text-slate-600">{s.gender}</td>
                            <td className="py-2.5 px-3">
                              <span className={`inline-flex items-center gap-1 font-mono font-bold ${
                                isAtRisk ? 'text-rose-600' : 'text-emerald-700'
                              }`}>
                                {s.attendanceRate}%
                                {isAtRisk && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                                    Low
                                  </span>
                                )}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">{s.parentName} ({s.parentPhone})</td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => setViewingStudent(s)}
                                className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                              >
                                View Dossier
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Class & Teacher Pacing Coordination */}
      {activeTab === 'coordination' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Class & Teacher Academic Coordination</h3>
              <p className="text-xs text-slate-500">Teacher workloads, subject distributions, and class teacher reviews</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {teachers.map(teacher => (
              <div key={teacher.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{teacher.name}</h4>
                    <span className="text-xs text-blue-700 font-medium">{teacher.designation}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {teacher.department}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between"><span>Weekly Workload:</span><strong className="text-slate-900 font-mono">{teacher.currentWeeklyWorkload} / {teacher.maxWeeklyWorkload} Periods</strong></div>
                  <div className="flex justify-between"><span>Experience:</span><span className="font-medium">{teacher.experience}</span></div>
                  <div className="flex justify-between"><span>Assigned Classes:</span><span className="font-mono font-semibold">{teacher.classesAssigned.join(', ')}</span></div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setViewingStaff(teacher)}
                      className="p-1.5 hover:bg-slate-200/70 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                      title="View Faculty Dossier"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingTeacher(teacher)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Allocation
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setAppraisalToast(`Academic appraisal recorded for ${teacher.name} (${teacher.designation}). Endorsed into faculty records.`);
                      setTimeout(() => setAppraisalToast(null), 3500);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Conduct Appraisal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff Leaves & Substitutions Tab */}
      {activeTab === 'substitutions' && (
        <StaffManager
          canApproveLeave={true}
          canAssignSubstitutes={true}
          canEditStaff={false}
        />
      )}

      {/* Subject Management Tab */}
      {/* Subjects & Curriculum Master CRUD */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">CBSE Curriculum & Subject Faculty Allocations</h3>
              <p className="text-xs text-slate-500">Manage prescribed subjects, credit hours, faculty-subject assignments, and pacing</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setSubjectViewMode('catalogue')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${subjectViewMode === 'catalogue' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
                >
                  Subjects Catalogue ({subjects.length})
                </button>
                <button
                  onClick={() => setSubjectViewMode('allocations')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${subjectViewMode === 'allocations' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
                >
                  Faculty Allocations ({subjectAllocations.length})
                </button>
                <button
                  onClick={() => setSubjectViewMode('pacing')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${subjectViewMode === 'pacing' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
                >
                  Syllabus Pacing
                </button>
              </div>

              {subjectViewMode === 'catalogue' && (
                <button
                  onClick={handleOpenAddSubject}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-2xs`}
                >
                  <Plus className="w-4 h-4" /> Add Subject
                </button>
              )}

              {subjectViewMode === 'allocations' && (
                <button
                  onClick={() => handleOpenAllocationModal(8, 'A')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-2xs`}
                >
                  <Plus className="w-4 h-4" /> Allocate Faculty
                </button>
              )}
            </div>
          </div>

          {/* Sub-view 1: Subjects Catalogue */}
          {subjectViewMode === 'catalogue' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {subjects.map(subj => (
                  <div key={subj.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all space-y-2.5">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          {subj.code}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{subj.name}</h4>
                        <span className="text-[11px] text-slate-500 font-medium">{subj.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditSubject(subj)}
                          className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-200 transition-colors"
                          title="Edit subject properties"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSubjectToDelete(subj)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                          title="Archive or delete subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{subj.description || 'CBSE prescribed course syllabus.'}</p>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Standards: <strong className="text-slate-800">{subj.applicableStandards.join(', ')}</strong>
                      </span>
                      <span className="font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {subj.weeklyPeriodsRequired} periods/wk
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-view 2: Faculty Allocations */}
          {subjectViewMode === 'allocations' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Class & Section</th>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Curriculum Code</th>
                      <th className="py-2.5 px-3">Assigned Faculty</th>
                      <th className="py-2.5 px-3">Weekly Periods</th>
                      <th className="py-2.5 px-3">Assigned Room</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {subjectAllocations.map(alloc => (
                      <tr key={alloc.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">Std {alloc.standard}-{alloc.section}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{alloc.subjectName}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{alloc.subjectCode}</td>
                        <td className="py-2.5 px-3">
                          <span className={`font-semibold ${alloc.teacherName === 'Unassigned' ? 'text-amber-700 italic' : 'text-blue-700'}`}>
                            {alloc.teacherName}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono">{alloc.weeklyPeriods} periods</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{alloc.room || 'Standard Classroom'}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setAllocationToDelete(alloc)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                            title="Remove allocation"
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

          {/* Sub-view 3: Syllabus Pacing & Audits */}
          {subjectViewMode === 'pacing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {curriculumTracks.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Std {item.standard} · {item.subject}</h4>
                      <span className="text-xs text-slate-500">Instructor: {item.teacher}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.status === 'Ahead' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Syllabus Completion</span>
                      <span className="font-bold text-slate-900 font-mono">{item.syllabusCovered}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${themeClasses.primaryBg}`} style={{ width: `${item.syllabusCovered}%` }} />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 flex justify-between">
                    <span>Target Chapter: {item.nextTopic}</span>
                    <span className="font-mono font-semibold">{item.periodsWeek} periods/week</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Attendance & Daily Operations Master */}
      {activeTab === 'attendance' && (
        <AttendanceManager initialTab="dashboard" />
      )}

      {/* Student Academic Progress & Risk Intervention (Standards 8 to 10) */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* Header & KPI Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Student Progress & Risk Monitoring (Standards 8–10)</h3>
                <p className="text-xs text-slate-500">Monitor academic performance indicators, identify students requiring remediation, and dispatch CBSE attendance warnings</p>
              </div>
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                {([8, 9, 10] as const).map(std => (
                  <button
                    key={std}
                    onClick={() => setProgressStdFilter(std)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      progressStdFilter === std
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Standard {std}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics HUD */}
            {(() => {
              const stdStudents = students.filter(s => s.standard === progressStdFilter);
              const atRiskCount = stdStudents.filter(s => s.attendanceRate < 75).length;
              const topPerformers = stdStudents.filter(s => s.attendanceRate >= 90).length;

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Enrolled Cohort</span>
                    <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">{stdStudents.length} Students</div>
                    <span className="text-[10px] text-slate-500 font-medium">Std {progressStdFilter} Sections A & B</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Average Attendance</span>
                    <div className="text-2xl font-bold font-mono text-emerald-700 mt-0.5">91.6%</div>
                    <span className="text-[10px] text-emerald-600 font-medium">CBSE compliant</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Attendance Risk (&lt;75%)</span>
                    <div className="text-2xl font-bold font-mono text-rose-700 mt-0.5">{atRiskCount} Students</div>
                    <span className="text-[10px] text-rose-600 font-medium">CBSE warning notice required</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Honors Standing (&ge;90%)</span>
                    <div className="text-2xl font-bold font-mono text-blue-700 mt-0.5">{topPerformers} Students</div>
                    <span className="text-[10px] text-blue-600 font-medium">Exemplary attendance & grades</span>
                  </div>
                </div>
              );
            })()}

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students by name, roll number, or admission ID..."
                  value={progressSearch}
                  onChange={e => setProgressSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold shrink-0">
                <button
                  onClick={() => setProgressTabFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${progressTabFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
                >
                  All ({students.filter(s => s.standard === progressStdFilter).length})
                </button>
                <button
                  onClick={() => setProgressTabFilter('at_risk')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${progressTabFilter === 'at_risk' ? 'bg-white text-rose-700 shadow-2xs font-bold' : 'text-slate-600'}`}
                >
                  At-Risk (&lt;75%)
                </button>
                <button
                  onClick={() => setProgressTabFilter('top')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${progressTabFilter === 'top' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600'}`}
                >
                  High Achievers
                </button>
              </div>
            </div>
          </div>

          {/* Student Progress Roster Table */}
          {(() => {
            const list = students
              .filter(s => s.standard === progressStdFilter)
              .filter(s => {
                if (progressTabFilter === 'at_risk') return s.attendanceRate < 75;
                if (progressTabFilter === 'top') return s.attendanceRate >= 90;
                return true;
              })
              .filter(s => {
                const q = progressSearch.toLowerCase();
                return s.name.toLowerCase().includes(q) || s.admissionNo.toLowerCase().includes(q) || String(s.rollNo).includes(q);
              });

            return (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Standard {progressStdFilter} Academic & Attendance Roster ({list.length} Students)
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">Passing Criteria: 33% Subject Mark · 75% Attendance</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3">Roll & Class</th>
                        <th className="py-2.5 px-3">Admission No</th>
                        <th className="py-2.5 px-3">Attendance Standing</th>
                        <th className="py-2.5 px-3">Academic Standing</th>
                        <th className="py-2.5 px-3">Guardian Contact</th>
                        <th className="py-2.5 px-3 text-right">Intervention / Dossier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {list.map(s => {
                        const isAtRisk = s.attendanceRate < 75;
                        return (
                          <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{s.name}</td>
                            <td className="py-2.5 px-3 font-mono">Std {s.standard}-{s.section} (Roll #{s.rollNo})</td>
                            <td className="py-2.5 px-3 font-mono text-slate-600">{s.admissionNo}</td>
                            <td className="py-2.5 px-3">
                              <span className={`inline-flex items-center gap-1 font-mono font-bold ${
                                isAtRisk ? 'text-rose-600' : 'text-emerald-700'
                              }`}>
                                {s.attendanceRate}%
                                {isAtRisk && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-bold">
                                    Below 75% CBSE
                                  </span>
                                )}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="font-semibold text-slate-800">Term 1: Grade A</span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{s.parentPhone}</td>
                            <td className="py-2.5 px-3 text-right space-x-1.5">
                              {isAtRisk && (
                                <button
                                  onClick={() => setWarningLetterStudent(s)}
                                  className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                                >
                                  Issue Notice
                                </button>
                              )}
                              <button
                                onClick={() => setViewingStudent(s)}
                                className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                              >
                                View Dossier
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Exams & Marks Moderation Tab */}
      {(activeTab === 'marks' || activeTab === 'exams') && (
        <ExaminationManager initialTab="moderation" />
      )}

      {/* Assignment Monitoring Tab */}
      {activeTab === 'assignments' && (
        <ExaminationManager initialTab="assignments" />
      )}

      {/* Timetable Coordination Tab */}
      {activeTab === 'timetable' && (
        <TimetableEditor
          allowPublish={false}
          canEdit={true}
        />
      )}

      {/* Academic Reports & Notices Tab */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Academic Standing & Examination Eligibility</h3>
              <p className="text-xs text-slate-500">Term 2 consolidated academic standing, official circulars, and hall ticket dues status</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setReportSubTab('standing')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    reportSubTab === 'standing' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Circulars & Notices
                </button>
                <button
                  onClick={() => setReportSubTab('dues_clearance')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    reportSubTab === 'dues_clearance' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Admit Card Dues Clearance
                </button>
              </div>
            </div>
          </div>

          {reportSubTab === 'standing' ? (
            <div className="space-y-3">
              <div className="flex justify-end">
                <button
                  onClick={() => showToast('Consolidated Academic Standing Report generated.', 'success')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  <Download className="w-4 h-4" /> Export Report (CSV)
                </button>
              </div>
              <div className="space-y-3 pt-1">
                {notices.map(n => (
                  <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold uppercase">{n.category}</span>
                        <span className="text-xs font-bold text-slate-900">{n.title}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{n.content}</p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">Date: {n.date} · Author: {n.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Academic Coordinator Read-Only Terminal:</strong>
                  <p className="text-blue-800 text-[11px] mt-0.5">
                    This registry provides verification of student fee clearance for Term 2 Final Examination hall tickets. Modifications to fee assignments, fee collections, concessions, and vouchers are strictly managed by the Accountant.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Filter student by name, admission number, or roll number..."
                    value={clearanceSearch}
                    onChange={e => setClearanceSearch(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <select
                  value={selectedStandard}
                  onChange={e => setSelectedStandard(Number(e.target.value))}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value={8}>Standard 8</option>
                  <option value={9}>Standard 9</option>
                  <option value={10}>Standard 10</option>
                </select>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Class & Section</th>
                      <th className="py-2.5 px-3">Admission No</th>
                      <th className="py-2.5 px-3">Fee Status</th>
                      <th className="py-2.5 px-3">Outstanding Dues</th>
                      <th className="py-2.5 px-3 text-right">Admit Card Eligibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {students
                      .filter(s => s.standard === selectedStandard)
                      .filter(s => {
                        const q = clearanceSearch.toLowerCase();
                        return (
                          s.name.toLowerCase().includes(q) ||
                          s.admissionNo.toLowerCase().includes(q) ||
                          String(s.rollNo).includes(q)
                        );
                      })
                      .map(s => {
                        const studentInvoices = fees.filter(f => f.studentId === s.id);
                        const outstanding = studentInvoices.reduce((acc, f) => acc + (f.status === 'paid' ? 0 : (f.remainingBalance ?? f.amount)), 0);
                        const isClear = outstanding === 0;

                        return (
                          <tr key={s.id} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{s.name}</td>
                            <td className="py-2.5 px-3">Std {s.standard}-{s.section} (Roll #{s.rollNo})</td>
                            <td className="py-2.5 px-3 font-mono text-slate-600">{s.admissionNo}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                isClear ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                              }`}>
                                {isClear ? 'Fees Cleared' : 'Dues Pending'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                              {outstanding > 0 ? `₹${outstanding.toLocaleString()}` : '₹0'}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {isClear ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Hall Ticket Eligible</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  <span>Clearance Hold</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Announcements & Institutional Circulars Hub */}
      {activeTab === 'notices' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Academic Announcements & Official Circulars</h3>
                <p className="text-xs text-slate-500">Broadcast official institutional circulars to faculty, students, and guardians</p>
              </div>

              <button
                onClick={() => setShowCreateNoticeModal(true)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-xs transition-colors`}
              >
                <Plus className="w-4 h-4" /> Issue Academic Circular
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {(['all', 'Academic', 'Exam', 'General', 'Holiday', 'Fee'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setNoticeFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                    noticeFilter === cat
                      ? 'bg-blue-700 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat === 'all' ? 'All Circulars' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notices Grid */}
          <div className="space-y-3">
            {notices
              .filter(n => noticeFilter === 'all' || n.category === noticeFilter)
              .map(notice => (
                <div key={notice.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        notice.category === 'Academic' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        notice.category === 'Exam' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        notice.category === 'General' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        notice.category === 'Holiday' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}>
                        {notice.category}
                      </span>
                      {notice.audience && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          Audience: {notice.audience}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400">{notice.date}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{notice.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Issued By: <strong className="text-slate-800">{notice.author}</strong></span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle className="w-3.5 h-3.5" /> Dispatched to Portals
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Vice Principal Profile & Governance Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* VP Profile Dossier */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className={`w-14 h-14 rounded-full ${themeClasses.primaryBg} text-white font-bold text-lg flex items-center justify-center shadow-md`}>
                  MV
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Prof. Marcus Vance</h3>
                  <p className="text-xs text-slate-500 font-medium">Vice Principal & Dean of Academic Governance</p>
                  <div className="text-xs font-mono text-blue-700 mt-0.5">Ph.D. in Educational Leadership · Employee ID: TCH-ADM-02</div>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-full border border-emerald-200">
                Active Governance Duty
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-semibold">Campus Office</span>
                <span className="font-semibold text-slate-800">Administrative Block · Room 102</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-semibold">Official Email</span>
                <span className="font-mono font-semibold text-slate-800">marcus.vance@greenfield.edu</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-semibold">Primary Wing Oversight</span>
                <span className="font-semibold text-slate-800">Senior Wing (Standards 8 to 12)</span>
              </div>
            </div>
          </div>

          {/* 12-PALETTE REAL-TIME THEME SWITCHER */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-700" />
                <h3 className="text-base font-bold text-slate-900">Enterprise Visual Palette (12 Curated Themes)</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">Live DOM CSS Engine</span>
            </div>
            <p className="text-xs text-slate-500">
              Select any of the 12 SCHLAR enterprise color systems. Changes apply immediately to CSS variables without reloading. Default: Palette 7 (Petrol & Copper).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
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
                      showToast(`Switched active theme to ${p.name}`, 'info');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'border-blue-700 bg-blue-50/70 shadow-sm ring-1 ring-blue-700'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full shrink-0 shadow-2xs border-2 border-white"
                      style={{ backgroundColor: p.colors.primary }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{p.colors.primary}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-700 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Academic Governance Policies */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Academic Governance Enforcement Policies</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <label className="font-semibold text-slate-800 block">Syllabus Pacing Alert Threshold</label>
                <p className="text-[11px] text-slate-500">Flags subjects falling below target milestone %</p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="range"
                    min={60}
                    max={90}
                    value={governancePacingThreshold}
                    onChange={e => setGovernancePacingThreshold(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="font-mono font-bold text-slate-900">{governancePacingThreshold}%</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <label className="font-semibold text-slate-800 block">Attendance Ledger Auto-Lock</label>
                <p className="text-[11px] text-slate-500">Lock roll call registers for teacher edits</p>
                <select
                  value={autoLockAttendanceHours}
                  onChange={e => setAutoLockAttendanceHours(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white font-semibold text-xs mt-1"
                >
                  <option value={12}>12 Hours after period end</option>
                  <option value={24}>24 Hours (Next Morning Roll Call)</option>
                  <option value={48}>48 Hours</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => showToast('Academic governance policies updated and enforced across system.', 'success')}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-xs`}
              >
                Save Policies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CIRCULAR MODAL */}
      {showCreateNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-700" />
                <h3 className="text-base font-bold text-slate-900">Issue Academic Circular</h3>
              </div>
              <button
                onClick={() => setShowCreateNoticeModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (!newNoticeTitle.trim() || !newNoticeContent.trim()) return;
                addNotice({
                  title: newNoticeTitle.trim(),
                  category: newNoticeCategory,
                  audience: newNoticeAudience,
                  content: newNoticeContent.trim(),
                  date: new Date().toISOString().split('T')[0],
                  author: 'Prof. Marcus Vance (Vice Principal)',
                  priority: 'normal',
                  status: 'published'
                });
                setShowCreateNoticeModal(false);
                setNewNoticeTitle('');
                setNewNoticeContent('');
                showToast('Official circular broadcasted successfully!', 'success');
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Circular Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Term 2 Periodic Assessment Review"
                  value={newNoticeTitle}
                  onChange={e => setNewNoticeTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newNoticeCategory}
                    onChange={e => setNewNoticeCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-xs"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Exam">Exam</option>
                    <option value="General">General</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Fee">Fee</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Audience</label>
                  <select
                    value={newNoticeAudience}
                    onChange={e => setNewNoticeAudience(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-xs"
                  >
                    <option value="all">All School Community</option>
                    <option value="teachers">Faculty & Staff Only</option>
                    <option value="parents">Parents Only</option>
                    <option value="admin">Admin Governance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notice Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter official circular details, academic guidelines, and reporting dates..."
                  value={newNoticeContent}
                  onChange={e => setNewNoticeContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateNoticeModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs"
                >
                  Broadcast Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official CBSE Warning Notice Modal */}
      {warningLetterStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-rose-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">CBSE Attendance Warning Notice</h3>
                  <p className="text-xs text-slate-500 font-mono">Ref: GIS/ACAD/ATTN/2026-10/{warningLetterStudent.rollNo}</p>
                </div>
              </div>
              <button
                onClick={() => setWarningLetterStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between"><span className="text-slate-500">Student Name:</span><strong className="text-slate-900">{warningLetterStudent.name}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Standard / Roll:</span><span>Std {warningLetterStudent.standard}-{warningLetterStudent.section} (Roll #{warningLetterStudent.rollNo})</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Admission No:</span><span className="font-mono">{warningLetterStudent.admissionNo}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Current Cumulative Rate:</span><strong className="text-rose-700 font-bold">{warningLetterStudent.attendanceRate}% (Threshold: 75%)</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Parent / Guardian:</span><span>{warningLetterStudent.parentName} ({warningLetterStudent.parentPhone})</span></div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-slate-700 space-y-1">
                <span className="font-bold text-amber-900 block">Notice Body:</span>
                <p>
                  "This is an official communication from Greenfield International School Academic Governance. Student <strong>{warningLetterStudent.name}</strong> currently has an attendance rating of <strong>{warningLetterStudent.attendanceRate}%</strong>, which is below the required CBSE criteria. You are requested to attend a mandatory parent-faculty consultation with the Vice Principal within 3 working days."
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setWarningLetterStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const studentName = warningLetterStudent.name;
                  setWarningLetterStudent(null);
                  setWarningSentToast(`Official CBSE Warning Notice dispatched to ${studentName}'s parent.`);
                  setTimeout(() => setWarningSentToast(null), 4000);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <SendHorizontal className="w-3.5 h-3.5" />
                <span>Issue & Dispatch Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Toast */}
      {showModerationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-700 text-emerald-100 text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>{showModerationToast}</span>
        </div>
      )}

      {/* Warning Notice Toast */}
      {warningSentToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCheck className="w-4 h-4 text-emerald-400" />
          <span>{warningSentToast}</span>
        </div>
      )}

      {/* Appraisal Toast */}
      {appraisalToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-900 border border-blue-700 text-blue-100 text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Award className="w-4 h-4 text-blue-300" />
          <span>{appraisalToast}</span>
        </div>
      )}

      {/* Staff / Teacher Academic Allocation Modal */}
      <StaffFormModal
        isOpen={!!editingTeacher}
        mode="edit"
        staffToEdit={editingTeacher}
        onClose={() => setEditingTeacher(null)}
      />

      {/* Student Dossier Modal */}
      <StudentProfileModal
        isOpen={!!viewingStudent}
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        initialTab="attendance"
      />

      {/* Faculty Dossier Modal */}
      <StaffProfileModal
        isOpen={!!viewingStaff}
        staff={viewingStaff}
        onClose={() => setViewingStaff(null)}
        onEdit={(staff) => {
          setViewingStaff(null);
          setEditingTeacher(staff);
        }}
      />
      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT SUBJECT                               */}
      {/* ========================================================= */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingSubject ? 'Edit Subject Curriculum' : 'Add Subject to CBSE Curriculum'}
                </h3>
                <p className="text-xs text-slate-500">Define course code, category, and prescribed weekly periods</p>
              </div>
              <button
                onClick={() => {
                  setShowSubjectModal(false);
                  setEditingSubject(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Environmental Science & Ecology"
                  value={subjectForm.name}
                  onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border ${subjectErrors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'} font-medium focus:ring-2 focus:ring-blue-500`}
                />
                {subjectErrors.name && <p className="text-[11px] text-rose-600 mt-1">{subjectErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Curriculum Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SCI-ENV"
                    value={subjectForm.code}
                    onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
                    className={`w-full p-2 rounded-xl border ${subjectErrors.code ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'} font-mono uppercase font-bold`}
                  />
                  {subjectErrors.code && <p className="text-[11px] text-rose-600 mt-1">{subjectErrors.code}</p>}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Weekly Periods *</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={subjectForm.weeklyPeriodsRequired}
                    onChange={e => setSubjectForm({ ...subjectForm, weeklyPeriodsRequired: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject Category</label>
                <select
                  value={subjectForm.category}
                  onChange={e => setSubjectForm({ ...subjectForm, category: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Core Academic">Core Academic</option>
                  <option value="Science & Tech">Science & Tech</option>
                  <option value="Languages">Languages</option>
                  <option value="Social Sciences">Social Sciences</option>
                  <option value="Arts & Co-Curricular">Arts & Co-Curricular</option>
                  <option value="Physical Education">Physical Education</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description & Learning Scope</label>
                <textarea
                  rows={2}
                  placeholder="Outline syllabus units, lab prerequisites, and board guidelines..."
                  value={subjectForm.description}
                  onChange={e => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubjectModal(false);
                    setEditingSubject(null);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 text-xs font-bold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-xs`}
                >
                  {editingSubject ? 'Save Changes' : 'Register Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ALLOCATE FACULTY TO SUBJECT & SECTION               */}
      {/* ========================================================= */}
      {showAllocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Allocate Faculty to Subject</h3>
                <p className="text-xs text-slate-500">Assign teacher and weekly timetable hours for Std {allocForm.standard}-{allocForm.section}</p>
              </div>
              <button
                onClick={() => setShowAllocationModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAllocation} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Standard</label>
                  <select
                    value={allocForm.standard}
                    onChange={e => setAllocForm({ ...allocForm, standard: Number(e.target.value) })}
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
                    value={allocForm.section}
                    onChange={e => setAllocForm({ ...allocForm, section: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject *</label>
                <select
                  value={allocForm.subjectId}
                  onChange={e => setAllocForm({ ...allocForm, subjectId: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assign Faculty Member *</label>
                <select
                  value={allocForm.teacherId}
                  onChange={e => setAllocForm({ ...allocForm, teacherId: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="">-- Leave Unassigned --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.department} - {t.empId})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Weekly Periods</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={allocForm.weeklyPeriods}
                    onChange={e => setAllocForm({ ...allocForm, weeklyPeriods: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Room / Lab</label>
                  <input
                    type="text"
                    value={allocForm.room}
                    onChange={e => setAllocForm({ ...allocForm, room: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAllocationModal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 text-xs font-bold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-xs`}
                >
                  Save Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE SUBJECT CONFIRMATION                         */}
      {/* ========================================================= */}
      {subjectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Remove Subject?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to remove <strong>"{subjectToDelete.name}"</strong> ({subjectToDelete.code}) from the curriculum?
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSubjectToDelete(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSubject}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE ALLOCATION CONFIRMATION                      */}
      {/* ========================================================= */}
      {allocationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Remove Faculty Allocation?</h3>
              <p className="text-xs text-slate-600">
                Unassign <strong>{allocationToDelete.teacherName}</strong> from Std {allocationToDelete.standard}-{allocationToDelete.section} ({allocationToDelete.subjectName})?
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAllocationToDelete(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteSubjectAllocation(allocationToDelete.id);
                  setAllocationToDelete(null);
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Confirm Unassign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
