import React, { useState, useMemo } from 'react';
import {
  Users,
  GraduationCap,
  Calendar,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  DollarSign,
  BookOpen,
  Bell,
  Settings,
  Trash2,
  Edit,
  Eye,
  FileText,
  Clock,
  ChevronRight,
  TrendingUp,
  Download,
  School,
  Award,
  Printer,
  ShieldCheck,
  Layers,
  ArrowRightLeft,
  Edit2,
  ChevronLeft,
  ShieldAlert
} from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { Student, Teacher, Notice, SchoolEvent } from '../../../types/school';
import { getThemeClasses } from '../../../utils/themeHelper';
import { StaffManager } from '../../common/StaffManager';
import { TimetableEditor } from '../../common/TimetableEditor';
import { StudentFormModal } from '../../common/StudentFormModal';
import { StudentProfileModal } from '../../common/StudentProfileModal';
import { AttendanceManager } from '../../common/AttendanceManager';
import { ExaminationManager } from '../../common/ExaminationManager';
import { FinanceManager } from '../../common/FinanceManager';

export const PrincipalView: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    themeColor,
    students,
    teachers,
    attendance,
    fees,
    notices,
    events,
    marks,
    assignments,
    timetables,
    addStudent,
    deleteStudent,
    updateStudent,
    addTeacher,
    deleteTeacher,
    addNotice,
    deleteNotice,
    showToast,
    enquiries,
    admitStudentFromLead
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Local state for modals and filters
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStandard, setSelectedStandard] = useState<number | 'all'>('all');
  const [selectedSection, setSelectedSection] = useState<'all' | 'A' | 'B'>('all');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | Student['status']>('all');
  const [studentSortBy, setStudentSortBy] = useState<'name' | 'admissionNo' | 'standard' | 'attendance' | 'feeStatus'>('standard');
  const [studentSortOrder, setStudentSortOrder] = useState<'asc' | 'desc'>('asc');
  const [studentPage, setStudentPage] = useState(1);
  const [studentPageSize, setStudentPageSize] = useState(10);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [viewStudentModal, setViewStudentModal] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form states
  const [newStudent, setNewStudent] = useState({
    name: '',
    standard: 8,
    section: 'A' as 'A' | 'B',
    rollNo: 15,
    gender: 'Male' as 'Male' | 'Female',
    dob: '2013-01-01',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: 'Greenfield City',
    bloodGroup: 'O+',
    attendanceRate: 95,
    feeStatus: 'paid' as 'paid' | 'pending' | 'overdue'
  });

  const [newTeacherForm, setNewTeacherForm] = useState({
    name: '',
    designation: 'Faculty',
    department: 'Science',
    qualification: 'M.Sc., B.Ed.',
    experience: '5 Years',
    subjects: 'Science, Biology',
    classesAssigned: '7-A, 8-A',
    phone: '+91 98765 00000',
    email: ''
  });

  const [newNoticeForm, setNewNoticeForm] = useState({
    title: '',
    category: 'Academic' as Notice['category'],
    audience: 'all' as Notice['audience'],
    content: '',
    priority: 'normal' as Notice['priority']
  });

  // Filtered and Sorted students
  const filteredStudents = useMemo(() => {
    return students
      .filter(s => {
        const matchesSearch =
          s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
          s.admissionNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
          s.parentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
          s.parentPhone.includes(studentSearch);
        const matchesStd = selectedStandard === 'all' || s.standard === selectedStandard;
        const matchesSec = selectedSection === 'all' || s.section === selectedSection;
        const matchesFee = selectedFeeStatus === 'all' || s.feeStatus === selectedFeeStatus;
        const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
        return matchesSearch && matchesStd && matchesSec && matchesFee && matchesStatus;
      })
      .sort((a, b) => {
        let valA: string | number = a.name;
        let valB: string | number = b.name;
        if (studentSortBy === 'admissionNo') {
          valA = a.admissionNo;
          valB = b.admissionNo;
        } else if (studentSortBy === 'standard') {
          valA = a.standard * 100 + (a.section === 'A' ? 1 : 2) * 10 + a.rollNo;
          valB = b.standard * 100 + (b.section === 'A' ? 1 : 2) * 10 + b.rollNo;
        } else if (studentSortBy === 'attendance') {
          valA = a.attendanceRate;
          valB = b.attendanceRate;
        } else if (studentSortBy === 'feeStatus') {
          valA = a.feeStatus;
          valB = b.feeStatus;
        }

        if (valA < valB) return studentSortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return studentSortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [students, studentSearch, selectedStandard, selectedSection, selectedFeeStatus, selectedStatus, studentSortBy, studentSortOrder]);

  // Paginated students
  const paginatedStudents = useMemo(() => {
    const startIndex = (studentPage - 1) * studentPageSize;
    return filteredStudents.slice(startIndex, startIndex + studentPageSize);
  }, [filteredStudents, studentPage, studentPageSize]);

  const totalStudentPages = Math.ceil(filteredStudents.length / studentPageSize) || 1;

  // Analytics calculations
  const totalStudents = students.length;
  const totalFaculty = teachers.length;
  const avgAttendance = (students.reduce((acc, s) => acc + s.attendanceRate, 0) / (students.length || 1)).toFixed(1);
  const totalFeeCollected = fees.filter(f => f.status === 'paid').reduce((acc, f) => acc + f.amount, 0);
  const totalFeePending = fees.filter(f => f.status !== 'paid').reduce((acc, f) => acc + f.amount, 0);
  const collectionRate = Math.round((totalFeeCollected / ((totalFeeCollected + totalFeePending) || 1)) * 100);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.parentName) return;
    addStudent({
      ...newStudent,
      admissionNo: `GIS-2026-${String(students.length + 101).padStart(4, '0')}`,
      admissionDate: new Date().toISOString().split('T')[0],
      emergencyContact: newStudent.parentPhone || '+91 98765 43210',
      documentsSubmitted: ['Birth Certificate', 'Previous Academic Records', 'Address Proof']
    });
    setShowAddStudentModal(false);
    setNewStudent({
      name: '',
      standard: 8,
      section: 'A',
      rollNo: 20,
      gender: 'Male',
      dob: '2013-01-01',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      address: 'Greenfield City',
      bloodGroup: 'O+',
      attendanceRate: 95,
      feeStatus: 'paid'
    });
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherForm.name) return;
    addTeacher({
      empId: `TCH-2026-${String(teachers.length + 120).padStart(3, '0')}`,
      name: newTeacherForm.name,
      designation: newTeacherForm.designation,
      department: newTeacherForm.department,
      staffCategory: 'Teaching',
      qualification: newTeacherForm.qualification,
      experience: newTeacherForm.experience,
      joiningDate: new Date().toISOString().split('T')[0],
      employmentStatus: 'Active',
      maxWeeklyWorkload: 26,
      subjects: newTeacherForm.subjects.split(',').map(s => s.trim()),
      classesAssigned: newTeacherForm.classesAssigned.split(',').map(s => s.trim()),
      phone: newTeacherForm.phone,
      email: newTeacherForm.email || `${newTeacherForm.name.toLowerCase().replace(/\s+/g, '.')}@greenfield.edu`
    });
    setShowAddTeacherModal(false);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeForm.title || !newNoticeForm.content) return;
    addNotice({
      ...newNoticeForm,
      date: new Date().toISOString().split('T')[0],
      author: 'Principal Dr. Evelyn Montgomery',
      status: 'published'
    });
    setShowAddNoticeModal(false);
    setNewNoticeForm({
      title: '',
      category: 'Academic',
      audience: 'all',
      content: '',
      priority: 'normal'
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{totalStudents}</h3>
                <span className="text-xs text-emerald-600 font-medium">Standards 1 to 10 Active</span>
              </div>
              <div className={`w-12 h-12 rounded-xl ${themeClasses.lightBg} ${themeClasses.textColor} flex items-center justify-center`}>
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty Staff</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{totalFaculty}</h3>
                <span className="text-xs text-blue-600 font-medium">100% Present Today</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div
              onClick={() => setActiveTab('attendance')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all group"
            >
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-emerald-700">Attendance Rate</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{avgAttendance}%</h3>
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> High Campus Health &rarr;
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fee Collection</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{collectionRate}%</h3>
                <span className="text-xs text-slate-500 font-medium font-mono">₹{totalFeeCollected.toLocaleString()}</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Quick Administrator Actions:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowAddStudentModal(true)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors shadow-sm`}
              >
                <Plus className="w-4 h-4" /> Add Student
              </button>
              <button
                onClick={() => setShowAddTeacherModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Teacher
              </button>
              <button
                onClick={() => setShowAddNoticeModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <Bell className="w-4 h-4" /> Publish Circular
              </button>
            </div>
          </div>

          {/* Two-Column Institutional Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Standards Breakdown (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Standard 1 to 10 Roster Summary</h3>
                  <p className="text-xs text-slate-500">Class capacity, section distributions and attendance health</p>
                </div>
                <button
                  onClick={() => setActiveTab('classes')}
                  className={`text-xs font-semibold ${themeClasses.textColor} hover:underline`}
                >
                  View All Classes &rarr;
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(std => {
                  const stdCount = students.filter(s => s.standard === std).length;
                  return (
                    <div
                      key={std}
                      onClick={() => {
                        setSelectedStandard(std);
                        setActiveTab('students');
                      }}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 cursor-pointer transition-all text-center group"
                    >
                      <div className="text-xs font-bold text-slate-500 group-hover:text-blue-700">Std {std}</div>
                      <div className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">{stdCount || 28}</div>
                      <div className="text-[10px] text-slate-400">Sec A & B</div>
                    </div>
                  );
                })}
              </div>

              {/* Recent School Circulars inside Dashboard */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Institutional Circulars</h4>
                  <button onClick={() => setActiveTab('notices')} className="text-xs text-blue-600 hover:underline">
                    View Noticeboard
                  </button>
                </div>
                <div className="space-y-2.5">
                  {notices.slice(0, 3).map(n => (
                    <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${n.priority === 'urgent' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'}`}>
                            {n.category}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{n.title}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{n.content}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono shrink-0">{n.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Upcoming Events & Calendar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">Academic Calendar</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">Term 2</span>
                </div>

                <div className="space-y-3">
                  {events.map(ev => (
                    <div key={ev.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-800">{ev.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">{ev.category}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ev.date} · {ev.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1.5">{ev.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center justify-between mb-1">
                  <span>Affiliation Code:</span>
                  <span className="font-mono text-slate-800 font-semibold">CBSE-992014</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Working Campus Days:</span>
                  <span className="font-semibold text-slate-800">210 / 220</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance & Daily Operations Workspace */}
      {activeTab === 'attendance' && (
        <AttendanceManager initialTab="dashboard" />
      )}

      {/* Students Management Tab */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Institutional Student Directory</h3>
              <p className="text-xs text-slate-500">
                Official enrollment registry across Standards 1–10, demographic records, guardian contacts & fee clearance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddStudentModal(true)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors shadow-sm`}
              >
                <Plus className="w-4 h-4" /> Enroll New Student
              </button>
            </div>
          </div>

          {/* Cross-Role Admissions Pipeline Banner */}
          {enquiries.filter(e => e.status === 'converted' && !e.admittedStudentId).length > 0 && (
            <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {enquiries.filter(e => e.status === 'converted' && !e.admittedStudentId).length}
                </div>
                <div>
                  <div className="font-bold text-slate-900">Front Office Admissions Pipeline</div>
                  <div className="text-[11px] text-slate-600">
                    {enquiries.filter(e => e.status === 'converted' && !e.admittedStudentId).length} candidate(s) converted from Reception Enquiries awaiting official class enrollment & fee allocation.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {enquiries.filter(e => e.status === 'converted' && !e.admittedStudentId).slice(0, 2).map(lead => (
                  <button
                    key={lead.id}
                    onClick={() => {
                      admitStudentFromLead(lead.id, lead.standardApplying || 8, 'A');
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors shadow-2xs"
                  >
                    Enroll {lead.candidateName} (Std {lead.standardApplying || 8})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filters & Sorting Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 pt-1">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, admission no, parent, phone..."
                value={studentSearch}
                onChange={e => {
                  setStudentSearch(e.target.value);
                  setStudentPage(1);
                }}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>

            {/* Standard Filter */}
            <div>
              <select
                value={selectedStandard}
                onChange={e => {
                  setSelectedStandard(e.target.value === 'all' ? 'all' : Number(e.target.value));
                  setStudentPage(1);
                }}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Standards (1-10)</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                  <option key={s} value={s}>Standard {s}</option>
                ))}
              </select>
            </div>

            {/* Section Filter */}
            <div>
              <select
                value={selectedSection}
                onChange={e => {
                  setSelectedSection(e.target.value as any);
                  setStudentPage(1);
                }}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Sections (A & B)</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>

            {/* Fee Status Filter */}
            <div>
              <select
                value={selectedFeeStatus}
                onChange={e => {
                  setSelectedFeeStatus(e.target.value as any);
                  setStudentPage(1);
                }}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Fee Statuses</option>
                <option value="paid">Fee Paid</option>
                <option value="pending">Fee Pending</option>
                <option value="overdue">Fee Overdue</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-1.5">
              <select
                value={studentSortBy}
                onChange={e => setStudentSortBy(e.target.value as any)}
                className="flex-1 text-xs py-2 px-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="standard">Class Order</option>
                <option value="name">Name</option>
                <option value="admissionNo">Admission No</option>
                <option value="attendance">Attendance</option>
                <option value="feeStatus">Fee Status</option>
              </select>
              <button
                onClick={() => setStudentSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100"
                title="Toggle sort order"
              >
                {studentSortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <div>
              Showing <span className="font-semibold text-slate-800">{filteredStudents.length}</span> students
              {filteredStudents.length !== students.length && (
                <span> (filtered from {students.length} total institutional records)</span>
              )}
            </div>
            {(studentSearch || selectedStandard !== 'all' || selectedSection !== 'all' || selectedFeeStatus !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setStudentSearch('');
                  setSelectedStandard('all');
                  setSelectedSection('all');
                  setSelectedFeeStatus('all');
                  setSelectedStatus('all');
                  setStudentPage(1);
                }}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Students Table */}
          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Admission No</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Class & Sec</th>
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Parent / Contact</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4">Fee Ledger</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">{student.admissionNo}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {student.gender} · Blood {student.bloodGroup}
                          {student.medicalAlerts && (
                            <span className="ml-1 text-rose-600 font-semibold">· Medical Alert</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold font-mono">
                          Std {student.standard}-{student.section}
                        </span>
                      </td>
                      <td className="py-3 px-4 tabular-nums font-mono font-medium">#{student.rollNo}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{student.parentName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{student.parentPhone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold tabular-nums">{student.attendanceRate}%</span>
                          <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${student.attendanceRate >= 90 ? 'bg-emerald-500' : student.attendanceRate >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`}
                              style={{ width: `${student.attendanceRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          student.feeStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : student.feeStatus === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {student.feeStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          student.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-800'
                            : student.status === 'Transferred'
                            ? 'bg-blue-50 text-blue-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewStudentModal(student)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors"
                            title="Open Student Profile Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingStudent(student)}
                            className="p-1.5 hover:bg-blue-50 rounded text-slate-600 hover:text-blue-600 transition-colors"
                            title="Edit Student Dossier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setStudentToDelete(student)}
                            className="p-1.5 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors"
                            title="Archive Student Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2">
              <GraduationCap className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-800">No students match your filter criteria.</p>
              <button
                onClick={() => {
                  setStudentSearch('');
                  setSelectedStandard('all');
                  setSelectedSection('all');
                  setSelectedFeeStatus('all');
                  setSelectedStatus('all');
                }}
                className="px-3 py-1.5 text-xs text-blue-600 font-semibold hover:underline"
              >
                Reset Search & Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredStudents.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  value={studentPageSize}
                  onChange={e => {
                    setStudentPageSize(Number(e.target.value));
                    setStudentPage(1);
                  }}
                  className="py-1 px-2 rounded border border-slate-200 bg-white"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <span>
                  Showing {(studentPage - 1) * studentPageSize + 1} to {Math.min(studentPage * studentPageSize, filteredStudents.length)} of {filteredStudents.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStudentPage(p => Math.max(1, p - 1))}
                  disabled={studentPage === 1}
                  className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-slate-700">
                  Page {studentPage} of {totalStudentPages}
                </span>
                <button
                  onClick={() => setStudentPage(p => Math.min(totalStudentPages, p + 1))}
                  disabled={studentPage === totalStudentPages}
                  className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Teachers & Staff Management Tab */}
      {activeTab === 'teachers' && (
        <StaffManager
          canApproveLeave={true}
          canAssignSubstitutes={true}
          canEditStaff={true}
        />
      )}

      {/* Classes & Academics Tab */}
      {activeTab === 'classes' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Academic Wing: Standards 1 through 10</h3>
              <p className="text-xs text-slate-500">Capacity planning, enrolled rosters, and class teacher allocations</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold">
              20 Active Class Sections
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(std => {
              const studentsInStd = students.filter(s => s.standard === std);
              const secACount = studentsInStd.filter(s => s.section === 'A').length;
              const secBCount = studentsInStd.filter(s => s.section === 'B').length;

              return (
                <div key={std} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg ${themeClasses.primaryBg} text-white font-bold flex items-center justify-center text-xs`}>
                        {std}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Standard {std}</h4>
                        <span className="text-[11px] text-slate-500">Primary & Secondary Wing</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 tabular-nums font-mono">
                      {studentsInStd.length || 32} Enrolled
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <div className="flex items-center justify-between font-semibold">
                        <span>Section A</span>
                        <span className="text-blue-700 font-mono">{secACount || 16} Students</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Class Teacher: Mrs. Shalini Verma</p>
                      <p className="text-[10px] text-slate-400">Room 204 · West Wing</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <div className="flex items-center justify-between font-semibold">
                        <span>Section B</span>
                        <span className="text-blue-700 font-mono">{secBCount || 16} Students</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Class Teacher: Mr. Arvind Saxena</p>
                      <p className="text-[10px] text-slate-400">Room 205 · West Wing</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Master Timetable Tab */}
      {activeTab === 'timetable' && (
        <TimetableEditor
          allowPublish={true}
          canEdit={true}
        />
      )}

      {/* School-Wide Exams & Assessments Tab */}
      {activeTab === 'exams' && (
        <ExaminationManager initialTab="dashboard" />
      )}

      {/* School-Wide Assignments Monitor Tab */}
      {activeTab === 'assignments' && (
        <ExaminationManager initialTab="assignments" />
      )}

      {/* Campus Events Calendar Tab */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Greenfield International School Events Calendar</h3>
              <p className="text-xs text-slate-500">Inter-school tournaments, science exhibitions, celebrations, and governance assemblies</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
              Term 2 Schedule (2026–2027)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {events.map(ev => (
              <div key={ev.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    ev.category === 'Sports' ? 'bg-amber-100 text-amber-800' : ev.category === 'Cultural' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {ev.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ev.date} · {ev.time}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium">Location: {ev.location}</div>
                <p className="text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-200">{ev.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notices & Events Tab */}
      {activeTab === 'notices' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Institutional Notices & Circulars</h3>
              <p className="text-xs text-slate-500">Official broadcasts for teachers, parents, and school administration</p>
            </div>
            <button
              onClick={() => setShowAddNoticeModal(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors shadow-sm`}
            >
              <Plus className="w-4 h-4" /> Publish New Circular
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {notices.map(notice => (
              <div key={notice.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      notice.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : notice.priority === 'high'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {notice.priority}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium font-mono">
                      Audience: {notice.audience}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{notice.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 pt-1">{notice.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>
                  <p className="text-[11px] text-slate-400 font-medium">Issued by: {notice.author}</p>
                </div>

                <button
                  onClick={() => deleteNotice(notice.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 text-xs shrink-0"
                  title="Delete Circular"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Finance Overview Tab */}
      {activeTab === 'finance' && (
        <FinanceManager initialTab="overview" />
      )}

      {/* Institutional Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Executive Institutional Reports & Analytics</h3>
              <p className="text-xs text-slate-500">Board governance summaries, accreditation metrics, and statutory compliance audits</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Exporting Official Greenfield Institutional Dossier (PDF)...', 'info')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors shadow-sm`}
              >
                <Download className="w-4 h-4" /> Export Executive Dossier (PDF)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Academic Excellence</h4>
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between"><span>Campus Cumulative GPA:</span><strong className="text-slate-900">8.9 / 10</strong></div>
                <div className="flex justify-between"><span>Students with &gt;90% Marks:</span><strong className="text-emerald-700">38.4%</strong></div>
                <div className="flex justify-between"><span>Olympiad Qualifiers:</span><strong className="text-blue-700">42 Students</strong></div>
                <div className="flex justify-between"><span>Remedial Completion Rate:</span><strong className="text-slate-900">96.5%</strong></div>
              </div>
              <button
                onClick={() => showToast('Generating Academic Division Report CSV...', 'info')}
                className="w-full mt-2 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg"
              >
                Download Academic CSV
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Attendance & Health</h4>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between"><span>Overall Student Attendance:</span><strong className="text-emerald-700">94.8%</strong></div>
                <div className="flex justify-between"><span>Faculty Attendance Rate:</span><strong className="text-slate-900">99.1%</strong></div>
                <div className="flex justify-between"><span>Chronic Absenteeism:</span><strong className="text-amber-700">1.2% (&lt;75%)</strong></div>
                <div className="flex justify-between"><span>Parent Absence Notifications:</span><strong className="text-slate-900">100% Sent</strong></div>
              </div>
              <button
                onClick={() => showToast('Generating Campus Attendance Audit Sheet...', 'info')}
                className="w-full mt-2 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg"
              >
                Download Attendance Audit
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Bursar Collections & Dues</h4>
                <DollarSign className="w-4 h-4 text-amber-600" />
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between"><span>Term 2 Realization:</span><strong className="text-emerald-700">₹{totalFeeCollected.toLocaleString()}</strong></div>
                <div className="flex justify-between"><span>Outstanding Balance:</span><strong className="text-amber-700">₹{totalFeePending.toLocaleString()}</strong></div>
                <div className="flex justify-between"><span>Collection Velocity:</span><strong className="text-slate-900">82.6% Cleared</strong></div>
                <div className="flex justify-between"><span>Late Payment Surcharges:</span><strong className="text-slate-900">₹4,200</strong></div>
              </div>
              <button
                onClick={() => showToast('Generating Bursar Financial Realization Ledger...', 'info')}
                className="w-full mt-2 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg"
              >
                Download Financial Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* School Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Greenfield International School Institutional Settings</h3>
            <p className="text-xs text-slate-500">Campus profile, academic terms, grading scales, and accreditation configuration</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Institution Profile</h4>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-500 block mb-0.5">School Name</label>
                  <input type="text" readOnly value="Greenfield International School" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold" />
                </div>
                <div>
                  <label className="text-slate-500 block mb-0.5">Academic Standards Covered</label>
                  <input type="text" readOnly value="Classes 1 to 10 (Primary & Secondary)" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800" />
                </div>
                <div>
                  <label className="text-slate-500 block mb-0.5">Board Affiliation</label>
                  <input type="text" readOnly value="Central Board of Secondary Education (CBSE)" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800" />
                </div>
                <div>
                  <label className="text-slate-500 block mb-0.5">Campus Address</label>
                  <input type="text" readOnly value="Plot 42, Academic Boulevard, Greenfield Knowledge Park" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Academic Term & Grading Scale</h4>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-500 block mb-0.5">Current Academic Year</label>
                  <input type="text" readOnly value="2026 – 2027" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono" />
                </div>
                <div>
                  <label className="text-slate-500 block mb-0.5">Active Term</label>
                  <input type="text" readOnly value="Term 2 (September to February)" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800" />
                </div>
                <div>
                  <label className="text-slate-500 block mb-0.5">Grading Metric Scale</label>
                  <input type="text" readOnly value="A1 (91-100), A2 (81-90), B1 (71-80), B2 (61-70), C1 (51-60), D (Pass)" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-[11px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      <StudentFormModal
        isOpen={showAddStudentModal}
        mode="create"
        onClose={() => setShowAddStudentModal(false)}
      />

      {/* Edit Student Modal */}
      <StudentFormModal
        isOpen={!!editingStudent}
        mode="edit"
        studentToEdit={editingStudent}
        onClose={() => setEditingStudent(null)}
      />

      {/* Add Teacher Modal */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Faculty Member</h3>
            <p className="text-xs text-slate-500 mb-4">Register new teaching faculty into department roster</p>

            <form onSubmit={handleCreateTeacher} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Teacher Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Mehra"
                  value={newTeacherForm.name}
                  onChange={e => setNewTeacherForm({ ...newTeacherForm, name: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={newTeacherForm.department}
                    onChange={e => setNewTeacherForm({ ...newTeacherForm, department: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English & Literature">English</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Computer Science & AI">Computer Science</option>
                    <option value="Hindi & Sanskrit">Hindi</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Experience</label>
                  <input
                    type="text"
                    value={newTeacherForm.experience}
                    onChange={e => setNewTeacherForm({ ...newTeacherForm, experience: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subjects (comma-separated)</label>
                <input
                  type="text"
                  value={newTeacherForm.subjects}
                  onChange={e => setNewTeacherForm({ ...newTeacherForm, subjects: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assigned Classes (e.g. 7-A, 8-B)</label>
                <input
                  type="text"
                  value={newTeacherForm.classesAssigned}
                  onChange={e => setNewTeacherForm({ ...newTeacherForm, classesAssigned: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  Save Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Notice Modal */}
      {showAddNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Publish School Circular</h3>
            <p className="text-xs text-slate-500 mb-4">Broadcast official notification across portal roles</p>

            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Break Schedule Notification"
                  value={newNoticeForm.title}
                  onChange={e => setNewNoticeForm({ ...newNoticeForm, title: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newNoticeForm.category}
                    onChange={e => setNewNoticeForm({ ...newNoticeForm, category: e.target.value as Notice['category'] })}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Exam">Exam</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Fee">Fee</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Audience</label>
                  <select
                    value={newNoticeForm.audience}
                    onChange={e => setNewNoticeForm({ ...newNoticeForm, audience: e.target.value as Notice['audience'] })}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Everyone</option>
                    <option value="teachers">Teachers Only</option>
                    <option value="parents">Parents Only</option>
                    <option value="admin">Admin Only</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newNoticeForm.priority}
                    onChange={e => setNewNoticeForm({ ...newNoticeForm, priority: e.target.value as Notice['priority'] })}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Circular Content *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter detailed notice content..."
                  value={newNoticeForm.content}
                  onChange={e => setNewNoticeForm({ ...newNoticeForm, content: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddNoticeModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Dossier Modal */}
      <StudentProfileModal
        isOpen={!!viewStudentModal}
        student={viewStudentModal}
        onClose={() => setViewStudentModal(null)}
        onEdit={(student) => {
          setViewStudentModal(null);
          setEditingStudent(student);
        }}
      />

      {/* Student Archive Confirmation Dialog */}
      {studentToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Archive Student Record?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm archival for <strong>{studentToDelete.name}</strong> ({studentToDelete.admissionNo})
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Placement:</span>
                <span className="font-semibold">Standard {studentToDelete.standard}-{studentToDelete.section} (Roll #{studentToDelete.rollNo})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Guardian:</span>
                <span className="font-semibold">{studentToDelete.parentName} ({studentToDelete.parentPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fee Status:</span>
                <span className="uppercase font-semibold">{studentToDelete.feeStatus}</span>
              </div>
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 leading-relaxed">
                Archiving will remove this student from active attendance registers and class rosters while preserving historical grades and tuition receipts.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Confirm Archival
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
