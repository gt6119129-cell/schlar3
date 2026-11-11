import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Plus,
  Search,
  Users,
  Check,
  X,
  AlertCircle,
  Save,
  MessageSquare,
  Send,
  Trash2,
  Edit2,
  Award,
  Bell,
  DoorOpen,
  PhoneCall,
  UserCheck,
  LayoutGrid,
  List,
  Download,
  Printer,
  Sparkles,
  TrendingUp,
  UserX,
  Share2,
  FileSpreadsheet,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageCircle,
  ShieldCheck,
  SendHorizontal,
  GraduationCap,
  Settings,
  Sliders,
  CheckSquare,
  School
} from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { AttendanceRecord, MarkRecord, Assignment, Student } from '../../../types/school';
import { getThemeClasses } from '../../../utils/themeHelper';
import { StudentProfileModal } from '../../common/StudentProfileModal';
import { PeriodAttendanceMatrix } from '../../common/PeriodAttendanceMatrix';
import { ExaminationManager } from '../../common/ExaminationManager';
import { SCHLAR_PALETTES, getPaletteById } from '../../../theme/palettes';
import {
  applyThemeToDom,
  getStoredActivePaletteId,
  saveStoredActivePaletteId,
  saveStoredActiveColors
} from '../../../theme/themeEngine';

export const TeacherWebView: React.FC = () => {
  const {
    activeTab,
    themeColor,
    students,
    attendance,
    marks,
    assignments,
    timetables,
    messages,
    notices,
    saveBulkAttendance,
    saveAttendanceSession,
    saveMark,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    sendMessage,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Assigned Classes for Mrs. Shalini Verma
  const teacherAssignedClasses = ['8-A', '8-B', '9-A', '9-B'];
  const [selectedClass, setSelectedClass] = useState<string>('8-A');
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [studentSearch, setStudentSearch] = useState('');

  const [selectedStd, selectedSec] = useMemo(() => {
    const parts = selectedClass.split('-');
    return [parseInt(parts[0], 10) || 8, (parts[1] as 'A' | 'B') || 'A'];
  }, [selectedClass]);

  // Class students for currently selected assigned class
  const classStudents = useMemo(() => {
    return students
      .filter(s => s.standard === selectedStd && s.section === selectedSec && s.status === 'Active')
      .sort((a, b) => a.rollNo - b.rollNo);
  }, [students, selectedStd, selectedSec]);

  const [rollCallState, setRollCallState] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>(() => {
    const initial: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
    classStudents.forEach(s => {
      initial[s.id] = 'present';
    });
    return initial;
  });

  // Attendance enhanced state
  const [attendanceViewMode, setAttendanceViewMode] = useState<'grid' | 'table'>('table');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'present' | 'absent' | 'late' | 'excused' | 'at_risk'>('all');
  const [attendanceSession, setAttendanceSession] = useState<'morning' | 'afternoon' | 'period_1'>('morning');
  const [attendanceRemarks, setAttendanceRemarks] = useState<Record<string, string>>({
    'std-8a-02': 'Parent called: Viral fever medical leave',
    'std-8a-05': 'School bus #4 breakdown delay (15 min)'
  });
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notificationSentToast, setNotificationSentToast] = useState(false);
  const [attendanceHistoryStudent, setAttendanceHistoryStudent] = useState<Student | null>(null);

  const [attendanceSavedToast, setAttendanceSavedToast] = useState(false);
  const [marksSavedToast, setMarksSavedToast] = useState(false);
  const [selectedStudentDossier, setSelectedStudentDossier] = useState<Student | null>(null);

  // New assignment modal
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [isSubmittingAsg, setIsSubmittingAsg] = useState(false);
  const [newAsg, setNewAsg] = useState({
    title: '',
    subject: 'Mathematics',
    dueDate: '2026-10-20',
    description: ''
  });

  // Marks entry state
  const [selectedExam, setSelectedExam] = useState('Mid-Term Exam');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [editableMarks, setEditableMarks] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    marks.forEach(m => {
      map[m.studentId] = m.marksObtained;
    });
    return map;
  });

  // Chat message input
  const [chatInput, setChatInput] = useState('');

  // Handle Bulk Attendance Save
  const handleSaveAttendance = () => {
    const std = parseInt(selectedClass.split('-')[0], 10);
    const sec = (selectedClass.split('-')[1] as 'A' | 'B') || 'A';
    const sess = attendanceSession === 'morning' ? 'morning' : attendanceSession === 'afternoon' ? 'afternoon' : 'morning';

    const records = classStudents.map(s => ({
      studentId: s.id,
      studentName: s.name,
      rollNo: s.rollNo,
      status: rollCallState[s.id] || 'present',
      remarks: attendanceRemarks[s.id] || ''
    }));

    saveAttendanceSession({
      standard: std,
      section: sec,
      date: attendanceDate,
      session: sess,
      isDraft: false,
      records,
      submittedByName: 'Mrs. Shalini Verma'
    });

    setAttendanceSavedToast(true);
    setTimeout(() => setAttendanceSavedToast(false), 3000);
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
    classStudents.forEach(s => {
      updated[s.id] = 'present';
    });
    setRollCallState(updated);
  };

  const handleMarkAllAbsent = () => {
    const updated: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
    classStudents.forEach(s => {
      updated[s.id] = 'absent';
    });
    setRollCallState(updated);
  };

  const handleQuickDateJump = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setAttendanceDate(d.toISOString().split('T')[0]);
  };

  const handleExportCSV = () => {
    const headers = ['Roll No', 'Student Name', 'Admission No', 'Date', 'Session', 'Status', 'Remarks', 'Historical Rate'];
    const rows = classStudents.map(s => [
      s.rollNo,
      `"${s.name}"`,
      s.admissionNo,
      attendanceDate,
      attendanceSession,
      rollCallState[s.id] || 'present',
      `"${attendanceRemarks[s.id] || ''}"`,
      `${s.attendanceRate}%`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Std_${selectedClass}_${attendanceDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveMarks = () => {
    classStudents.forEach(s => {
      const val = editableMarks[s.id] ?? 85;
      let grade = 'A1';
      if (val < 50) grade = 'D';
      else if (val < 65) grade = 'C1';
      else if (val < 75) grade = 'B2';
      else if (val < 85) grade = 'B1';
      else if (val < 91) grade = 'A2';

      saveMark({
        studentId: s.id,
        studentName: s.name,
        standard: s.standard,
        section: s.section,
        examName: selectedExam,
        subject: selectedSubject,
        marksObtained: val,
        maxMarks: 100,
        grade,
        status: 'submitted',
        remarks: val >= 90 ? 'Outstanding analytical skills' : 'Satisfactory progress'
      });
    });
    setMarksSavedToast(true);
    setTimeout(() => setMarksSavedToast(false), 3000);
  };

  const handleCreateAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsg.title.trim() || !newAsg.dueDate) {
      showToast('Assignment title and due date are required.', 'error');
      return;
    }
    setIsSubmittingAsg(true);
    try {
      createAssignment({
        title: newAsg.title.trim(),
        standard: selectedStd,
        section: selectedSec,
        subject: newAsg.subject,
        assignedDate: new Date().toISOString().split('T')[0],
        dueDate: newAsg.dueDate,
        description: newAsg.description.trim() || 'Complete prescribed textbook exercises and verify steps.',
        submissionCount: 0,
        totalStudents: classStudents.length || 32,
        teacherName: 'Mrs. Shalini Verma',
        status: 'published'
      });
      setShowAddAssignmentModal(false);
      setNewAsg({ title: '', subject: 'Mathematics', dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], description: '' });
      showToast(`Assignment "${newAsg.title}" published for Class ${selectedClass}.`, 'success');
    } finally {
      setIsSubmittingAsg(false);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage(chatInput, 'parent-01', 'Dr. Rajesh Sharma');
    setChatInput('');
  };

  // Weekly teacher timetable
  const teacherTimetable = timetables.filter(t => t.teacherId === 'tch-01' || t.teacherName?.includes('Shalini'));

  return (
    <div className="space-y-6">
      {/* Overview Teacher Home Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Classes</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">8-A, 8-B, 9-A, 9-B</h3>
              <p className="text-xs text-blue-600 font-medium">Class Teacher: Std 8-A</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{classStudents.length} Students</h3>
              <p className="text-xs text-emerald-600 font-medium">96% Class Attendance</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Teaching Periods</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">4 Periods</h3>
              <p className="text-xs text-slate-500 font-medium">Rooms 204 & 302</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignments Due</span>
              <h3 className="text-2xl font-bold text-amber-700 mt-1 tabular-nums">1 Pending</h3>
              <p className="text-xs text-slate-500 font-medium">Due Thursday Oct 20</p>
            </div>
          </div>

          {/* Quick Schedule Today */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Today's Class Teaching Schedule</h3>
                <p className="text-xs text-slate-500">Bell timetable and classroom locations for Mrs. Shalini Verma</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-semibold">Monday Bell Schedule</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
                <div className="flex justify-between font-bold text-blue-900">
                  <span>Period 1: 08:30 – 09:15</span>
                  <span>Room 204</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">Class 8-A · Mathematics</div>
                <div className="text-[11px] text-slate-600">Topic: Linear Equations in One Variable</div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Period 2: 09:15 – 10:00</span>
                  <span>Room 302</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">Class 9-B · Mathematics</div>
                <div className="text-[11px] text-slate-600">Topic: Coordinate Geometry & Cartesian Plane</div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Period 4: 11:00 – 11:45</span>
                  <span>Room 204</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">Class 8-A · Vedic Math Workshop</div>
                <div className="text-[11px] text-slate-600">Topic: Mental Multiplication Sutras</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Classes Roster Tab */}
      {activeTab === 'classes' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">My Class Rosters</h3>
              <p className="text-xs text-slate-500">Assigned sections and student registers</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {teacherAssignedClasses.map(cls => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    selectedClass === cls ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Class {cls} {cls === '8-A' ? '(Class Teacher)' : '(Subject Faculty)'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {classStudents.map(student => (
              <div key={student.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{student.name}</h4>
                    <span className="text-[10px] font-mono text-slate-500">{student.admissionNo} · Roll #{student.rollNo}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold font-mono">
                    {student.attendanceRate}% Att.
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 text-slate-600 space-y-1">
                  <div>Parent: <span className="font-semibold text-slate-800">{student.parentName}</span></div>
                  <div>Phone: <span className="font-mono text-slate-800">{student.parentPhone}</span></div>
                  <div>Blood Group: <span className="font-semibold text-slate-800">{student.bloodGroup}</span></div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() => setSelectedStudentDossier(student)}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded"
                  >
                    View Academic Dossier &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Progress & Profiles Tab */}
      {(activeTab === 'progress' || activeTab === 'students') && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Student Progress & Academic Profiles</h3>
              <p className="text-xs text-slate-500">Marks trajectories, CBSE attendance thresholds, homework submissions, and student dossiers</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {teacherAssignedClasses.map(cls => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    selectedClass === cls ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Class {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Progress KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Class Roster</span>
              <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{classStudents.length} Students</div>
              <span className="text-[10px] text-blue-700 font-medium">Std {selectedClass} Active</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
              <span className="text-[10px] text-emerald-700 font-semibold uppercase">Avg Attendance</span>
              <div className="text-xl font-bold font-mono text-emerald-900 mt-0.5">
                {classStudents.length > 0
                  ? Math.round(classStudents.reduce((acc, s) => acc + s.attendanceRate, 0) / classStudents.length)
                  : 94}%
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">CBSE &ge; 75% Compliant</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
              <span className="text-[10px] text-blue-700 font-semibold uppercase">Subject Avg</span>
              <div className="text-xl font-bold font-mono text-blue-900 mt-0.5">88.4 / 100</div>
              <span className="text-[10px] text-blue-700 font-medium">Mathematics Term 2</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
              <span className="text-[10px] text-amber-700 font-semibold uppercase">Tasks Turn-In</span>
              <div className="text-xl font-bold font-mono text-amber-900 mt-0.5">97%</div>
              <span className="text-[10px] text-amber-700 font-medium">Homework Completed</span>
            </div>
          </div>

          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student by name or roll number..."
              value={studentSearch}
              onChange={e => setStudentSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Roll #</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Admission ID</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Attendance Rate</th>
                  <th className="py-2.5 px-3">Mathematics Score</th>
                  <th className="py-2.5 px-3">Academic Standing</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {classStudents
                  .filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.rollNo.toString().includes(studentSearch))
                  .map(student => {
                    const studentMark = marks.find(m => m.studentId === student.id && m.subject === 'Mathematics');
                    const score = studentMark ? studentMark.marksObtained : 85 + (student.rollNo % 12);
                    const grade = studentMark ? studentMark.grade : score >= 90 ? 'A1' : score >= 80 ? 'A2' : 'B1';
                    return (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold">#{student.rollNo}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{student.name}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{student.admissionNo}</td>
                        <td className="py-2.5 px-3 font-mono">Std {student.standard}-{student.section}</td>
                        <td className="py-2.5 px-3 font-mono font-bold">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            student.attendanceRate >= 75 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                          }`}>
                            {student.attendanceRate}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                          {score} / 100 <span className="text-blue-700 font-semibold ml-1">({grade})</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {score >= 90 ? 'Exemplary Understanding' : score >= 80 ? 'Steady Progress' : 'Needs Practice in Algebra'}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setSelectedStudentDossier(student)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded"
                          >
                            View Dossier &rarr;
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

      {/* Student-by-Period Attendance Matrix Tab */}
      {activeTab === 'attendance' && (
        <PeriodAttendanceMatrix
          initialClass={selectedClass}
          allowedClasses={teacherAssignedClasses}
        />
      )}

      {/* Marks & Gradebook Tab */}
      {activeTab === 'marks' && (
        <ExaminationManager initialTab="marks_entry" />
      )}

      {/* Homework & Assignments Tab */}
      {activeTab === 'assignments' && (
        <ExaminationManager initialTab="assignments" />
      )}

      {/* Weekly Timetable Tab */}
      {activeTab === 'timetable' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">My Weekly Teaching Timetable</h3>
              <p className="text-xs text-slate-500">Assigned periods, laboratory sessions, and free planning slots</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 bg-slate-100 rounded-lg text-slate-700 font-semibold">
              Faculty: Mrs. Shalini Verma (Emp ID: TCH-2016-042)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { day: 'Monday', period: 'Period 1 (08:30 – 09:15)', class: 'Std 8-A', room: 'Room 204', subject: 'Mathematics' },
              { day: 'Monday', period: 'Period 2 (09:15 – 10:00)', class: 'Std 9-B', room: 'Room 302', subject: 'Mathematics' },
              { day: 'Tuesday', period: 'Period 3 (10:15 – 11:00)', class: 'Std 8-A', room: 'Room 204', subject: 'Mathematics' },
              { day: 'Wednesday', period: 'Period 1 (08:30 – 09:15)', class: 'Std 8-A', room: 'Room 204', subject: 'Vedic Math' },
              { day: 'Thursday', period: 'Period 4 (11:00 – 11:45)', class: 'Std 9-B', room: 'Room 302', subject: 'Mathematics' },
              { day: 'Friday', period: 'Period 2 (09:15 – 10:00)', class: 'Std 8-A', room: 'Room 204', subject: 'Mathematics' }
            ].map((slot, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{slot.day}</span>
                  <span className="font-mono text-blue-700">{slot.room}</span>
                </div>
                <div className="text-slate-500">{slot.period}</div>
                <div className="font-bold text-slate-800 text-sm pt-1">{slot.class} · {slot.subject}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exam Schedules & Duties Tab */}
      {activeTab === 'exams' && (
        <ExaminationManager initialTab="duties" />
      )}

      {/* Staff Circulars Tab */}
      {activeTab === 'notices' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Institutional Faculty Circulars</h3>
            <p className="text-xs text-slate-500">Official circulars, staff meeting agendas, and campus advisories</p>
          </div>

          <div className="space-y-3 pt-2">
            {notices.map(notice => (
              <div key={notice.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    notice.priority === 'urgent' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {notice.priority}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{notice.title}</span>
                  <span className="text-xs text-slate-400 font-mono ml-auto">{notice.date}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">{notice.content}</p>
                <span className="text-[10px] text-slate-400 block pt-1">From: {notice.author}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parent Messages Tab */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Parent-Teacher Communication Channel</h3>
            <p className="text-xs text-slate-500">Direct consultation messaging thread with parents of Class 8-A</p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col h-96">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Active Thread: Dr. Rajesh Sharma (Parent of Aarav Sharma, 8-A)</span>
              <span className="text-[11px] text-emerald-600 font-semibold">Online</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
              {messages.map(m => {
                const isMe = m.senderRole === 'Teacher';
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="text-[10px] text-slate-400 font-mono mb-0.5">{m.senderName} · {m.timestamp}</div>
                    <div className={`p-3 rounded-2xl max-w-md text-xs ${
                      isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendChat} className="p-2 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Type reply to parent..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white ${themeClasses.primaryBg} flex items-center gap-1.5`}
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile & Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${themeClasses.primaryBg} text-white font-bold text-xl flex items-center justify-center shadow-md`}>
                  SV
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Mrs. Shalini Verma</h3>
                  <p className="text-xs text-blue-700 font-semibold">Senior Faculty · Department of Mathematics</p>
                  <span className="text-[11px] font-mono text-slate-500">Employee ID: TCH-2016-042 · Class Teacher (Std 8-A)</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
                Active Faculty Status
              </span>
            </div>

            {/* Academic Placement Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Class In-Charge</span>
                <div className="text-sm font-bold text-slate-900">Class 8 - Section A</div>
                <p className="text-slate-500">Full pedagogical and attendance governance responsibility</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subject Allocations</span>
                <div className="text-sm font-bold text-slate-900">Mathematics & Vedic Math</div>
                <p className="text-slate-500">Standards 8-A, 8-B, 9-A, 9-B (22 periods weekly)</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Qualifications & Experience</span>
                <div className="text-sm font-bold text-slate-900">M.Sc. Mathematics, B.Ed.</div>
                <p className="text-slate-500">12 Years Senior Faculty at Greenfield Int. School</p>
              </div>
            </div>

            {/* Official Contact & Campus Coordinates */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/30 text-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Faculty Directory Record</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block">Official Email:</span>
                  <span className="font-mono text-slate-800 font-medium">shalini.verma@greenfield.edu</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Extension / Mobile:</span>
                  <span className="font-mono text-slate-800 font-medium">+91 98221 44550 (Ext: 204)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Classroom Base:</span>
                  <span className="text-slate-800 font-medium">Academic Wing 2 · Room 204</span>
                </div>
              </div>
            </div>

            {/* Theme & Palette Studio */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Institutional Brand Palette</h4>
                  <p className="text-xs text-slate-500">Select any of the 12 SCHLAR design token palettes to customize your portal view</p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
                  Palette: {themeColor}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
                {SCHLAR_PALETTES.map(p => {
                  const isSelected = themeColor === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        saveStoredActivePaletteId(p.id);
                        saveStoredActiveColors(p.colors);
                        applyThemeToDom(p.colors);
                        showToast(`Theme updated to ${p.name}`, 'success');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center -space-x-1 mb-2">
                        <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: p.colors.primary }} />
                        <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: p.colors.secondary }} />
                        <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: p.colors.accent }} />
                      </div>
                      <span className="text-xs font-bold text-slate-900 truncate">{p.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">P{p.paletteNumber}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Teaching Preferences */}
            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Classroom Operational Preferences</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-slate-700">Display periods horizontally as columns with student rows in daily roll-call</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-slate-700">Prompt parent SMS absence broadcast confirmation on final roll-call submission</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-slate-700">Enforce CBSE 9-point grading scale (A1, A2, B1, B2, C1, C2, D, E) for term gradebooks</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Create Class Assignment</h3>
            <p className="text-xs text-slate-500 mb-4">Assign homework or project to Class 8-A</p>

            <form onSubmit={handleCreateAssignmentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Factorisation & Identities Practice 2"
                  value={newAsg.title}
                  onChange={e => setNewAsg({ ...newAsg, title: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={newAsg.subject}
                    onChange={e => setNewAsg({ ...newAsg, subject: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Vedic Math">Vedic Math</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newAsg.dueDate}
                    onChange={e => setNewAsg({ ...newAsg, dueDate: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed guidelines for students..."
                  value={newAsg.description}
                  onChange={e => setNewAsg({ ...newAsg, description: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAssignmentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  Publish to Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Dossier Modal */}
      <StudentProfileModal
        isOpen={!!selectedStudentDossier}
        student={selectedStudentDossier}
        onClose={() => setSelectedStudentDossier(null)}
      />

      {/* Absent Parent Broadcast Alert Modal */}
      {showNotifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-rose-600 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Parent Absence Alert Broadcast</h3>
                  <p className="text-xs text-slate-500">Automated SMS & App Push to parents of absent students</p>
                </div>
              </div>
              <button
                onClick={() => setShowNotifyModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
                <span className="font-semibold text-slate-700 block">Identified Absentees for Today ({attendanceDate}):</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {classStudents.filter(s => (rollCallState[s.id] || 'present') === 'absent').map(s => (
                    <div key={s.id} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                      <div>
                        <strong className="text-slate-900">#{s.rollNo} {s.name}</strong>
                        <span className="text-[11px] text-slate-400 ml-2 font-mono">Parent: {s.parentName}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {s.parentPhone}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Preview SMS / WhatsApp Message Template
                </label>
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-slate-700 space-y-1">
                  <p className="font-medium">
                    "Dear Parent, your ward is marked <strong>ABSENT</strong> for the morning assembly session on <strong>{attendanceDate}</strong> at Greenfield International School. If this was unexcused or unexpected, please contact the class teacher or school desk at +91 98765 43200."
                  </p>
                  <p className="text-[11px] text-amber-800 font-mono pt-1">
                    Channel: Official DLT-Registered Gateway · Instant Delivery
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowNotifyModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowNotifyModal(false);
                  setNotificationSentToast(true);
                  setTimeout(() => setNotificationSentToast(false), 4000);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <SendHorizontal className="w-3.5 h-3.5" />
                <span>Dispatch Instant Alerts</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student 30-Day Attendance Dossier Modal */}
      {attendanceHistoryStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg">
                  {attendanceHistoryStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{attendanceHistoryStudent.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Std {attendanceHistoryStudent.standard}-{attendanceHistoryStudent.section} · Roll #{attendanceHistoryStudent.rollNo} · Adm: {attendanceHistoryStudent.admissionNo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAttendanceHistoryStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400">Working Days</span>
                <div className="text-lg font-bold font-mono text-slate-800">24</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-700">Present</span>
                <div className="text-lg font-bold font-mono text-emerald-800">23</div>
              </div>
              <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-rose-700">Absences</span>
                <div className="text-lg font-bold font-mono text-rose-800">1</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-blue-700">CBSE Health</span>
                <div className="text-lg font-bold font-mono text-blue-800">{attendanceHistoryStudent.attendanceRate}%</div>
              </div>
            </div>

            {/* Calendar / Log History */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 block">October 2026 Academic Register Log</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-mono font-medium text-slate-800">2026-10-14 (Today)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                    {rollCallState[attendanceHistoryStudent.id] || 'present'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-mono font-medium text-slate-800">2026-10-13</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    PRESENT
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50/50 border border-rose-200 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span className="font-mono font-medium text-slate-800">2026-10-12</span>
                    </div>
                    <p className="text-[10px] text-slate-400 pl-4">Parent call logged: Viral fever recuperation</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">
                    ABSENT (EXCUSED)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-mono font-medium text-slate-800">2026-10-10</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    PRESENT
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/50 border border-amber-200 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span className="font-mono font-medium text-slate-800">2026-10-09</span>
                    </div>
                    <p className="text-[10px] text-slate-400 pl-4">Late: 15 min bus delay (North route)</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                    LATE
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Parent: {attendanceHistoryStudent.parentName} ({attendanceHistoryStudent.parentPhone})</span>
              <button
                onClick={() => setAttendanceHistoryStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      {attendanceSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-700 text-emerald-100 text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-300" />
          <span>Attendance register saved and locked for {selectedClass} on {attendanceDate}!</span>
        </div>
      )}
      {notificationSentToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCheck className="w-4 h-4 text-emerald-400" />
          <span>Parent absence SMS notices dispatched via official gateway!</span>
        </div>
      )}
      {marksSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 border border-emerald-700 text-emerald-100 text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-300" />
          <span>Gradebook scores saved and published to academic records!</span>
        </div>
      )}
    </div>
  );
};
