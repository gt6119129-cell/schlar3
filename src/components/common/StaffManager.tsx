import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserCheck,
  Award,
  ArrowRightLeft,
  Eye,
  Edit2,
  Trash2,
  Briefcase,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  ShieldAlert
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Teacher, StaffLeaveRequest, SubstitutionAssignment } from '../../types/school';
import { getThemeClasses } from '../../utils/themeHelper';
import { StaffFormModal } from './StaffFormModal';
import { StaffProfileModal } from './StaffProfileModal';

interface StaffManagerProps {
  canApproveLeave?: boolean;
  canAssignSubstitutes?: boolean;
  canEditStaff?: boolean;
  defaultSubTab?: 'teachers' | 'staff' | 'leaves' | 'substitutions';
}

export const StaffManager: React.FC<StaffManagerProps> = ({
  canApproveLeave = true,
  canAssignSubstitutes = true,
  canEditStaff = true,
  defaultSubTab = 'teachers'
}) => {
  const {
    currentRole,
    teachers,
    leaveRequests,
    substitutions,
    timetables,
    themeColor,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    updateTeacherWorkloadLimit,
    submitLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    assignSubstitute,
    cancelSubstitute,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Tabs: dedicated Teachers vs dedicated General Staff vs Leaves vs Substitutions
  const [activeSubTab, setActiveSubTab] = useState<'teachers' | 'staff' | 'leaves' | 'substitutions'>(defaultSubTab);

  // Search & Filter State for Teachers
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherDeptFilter, setTeacherDeptFilter] = useState('all');
  const [teacherStatusFilter, setTeacherStatusFilter] = useState('all');
  const [teacherSortBy, setTeacherSortBy] = useState<'name' | 'empId' | 'workload' | 'joiningDate'>('name');
  const [teacherSortOrder, setTeacherSortOrder] = useState<'asc' | 'desc'>('asc');
  const [teacherPage, setTeacherPage] = useState(1);
  const [teacherPageSize, setTeacherPageSize] = useState(10);

  // Search & Filter State for General Staff
  const [staffSearch, setStaffSearch] = useState('');
  const [staffDeptFilter, setStaffDeptFilter] = useState('all');
  const [staffStatusFilter, setStaffStatusFilter] = useState('all');
  const [staffTypeFilter, setStaffTypeFilter] = useState('all');
  const [staffSortBy, setStaffSortBy] = useState<'name' | 'empId' | 'joiningDate' | 'department'>('name');
  const [staffSortOrder, setStaffSortOrder] = useState<'asc' | 'desc'>('asc');
  const [staffPage, setStaffPage] = useState(1);
  const [staffPageSize, setStaffPageSize] = useState(10);

  // Modals
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [addStaffCategory, setAddStaffCategory] = useState<Teacher['staffCategory']>('Teaching');
  const [viewingStaff, setViewingStaff] = useState<Teacher | null>(null);
  const [editingStaff, setEditingStaff] = useState<Teacher | null>(null);

  // Safe Archive Confirmation Dialog State
  const [staffToArchive, setStaffToArchive] = useState<Teacher | null>(null);

  // Substitution Modal State
  const [showSubstituteModal, setShowSubstituteModal] = useState(false);
  const [selectedLeaveForSub, setSelectedLeaveForSub] = useState<StaffLeaveRequest | null>(null);
  const [subForm, setSubForm] = useState({
    leaveRequestId: '',
    originalTeacherId: '',
    originalTeacherName: '',
    substituteTeacherId: 'tch-07',
    date: '2026-10-14',
    day: 'Wednesday',
    period: 3,
    time: '10:15 - 11:00',
    standard: 8,
    section: 'A' as 'A' | 'B',
    subject: 'English (Reading Practice)',
    room: 'Room 204',
    notes: 'Covering reading exercise during medical absence'
  });

  // Separate teaching faculty vs non-teaching/administrative staff
  const teachingStaff = useMemo(() => teachers.filter(t => t.staffCategory === 'Teaching'), [teachers]);
  const generalStaff = useMemo(() => teachers.filter(t => t.staffCategory !== 'Teaching'), [teachers]);

  // Unique departments for filtering
  const teacherDepartments = useMemo(() => {
    return Array.from(new Set(teachingStaff.map(t => t.department))).sort();
  }, [teachingStaff]);

  const generalStaffDepartments = useMemo(() => {
    return Array.from(new Set(generalStaff.map(t => t.department))).sort();
  }, [generalStaff]);

  // Filtered & Sorted Teachers
  const filteredTeachers = useMemo(() => {
    return teachingStaff
      .filter(t => {
        const matchesSearch =
          t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
          t.empId.toLowerCase().includes(teacherSearch.toLowerCase()) ||
          t.department.toLowerCase().includes(teacherSearch.toLowerCase()) ||
          t.subjects.some(s => s.toLowerCase().includes(teacherSearch.toLowerCase()));
        const matchesDept = teacherDeptFilter === 'all' || t.department === teacherDeptFilter;
        const matchesStatus = teacherStatusFilter === 'all' || t.employmentStatus === teacherStatusFilter;
        return matchesSearch && matchesDept && matchesStatus;
      })
      .sort((a, b) => {
        let valA: string | number = a.name;
        let valB: string | number = b.name;
        if (teacherSortBy === 'empId') {
          valA = a.empId;
          valB = b.empId;
        } else if (teacherSortBy === 'workload') {
          valA = a.currentWeeklyWorkload;
          valB = b.currentWeeklyWorkload;
        } else if (teacherSortBy === 'joiningDate') {
          valA = a.joiningDate;
          valB = b.joiningDate;
        }

        if (valA < valB) return teacherSortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return teacherSortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [teachingStaff, teacherSearch, teacherDeptFilter, teacherStatusFilter, teacherSortBy, teacherSortOrder]);

  // Paginated Teachers
  const paginatedTeachers = useMemo(() => {
    const startIndex = (teacherPage - 1) * teacherPageSize;
    return filteredTeachers.slice(startIndex, startIndex + teacherPageSize);
  }, [filteredTeachers, teacherPage, teacherPageSize]);

  const totalTeacherPages = Math.ceil(filteredTeachers.length / teacherPageSize) || 1;

  // Filtered & Sorted General Staff
  const filteredGeneralStaff = useMemo(() => {
    return generalStaff
      .filter(s => {
        const matchesSearch =
          s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
          s.empId.toLowerCase().includes(staffSearch.toLowerCase()) ||
          s.department.toLowerCase().includes(staffSearch.toLowerCase()) ||
          s.designation.toLowerCase().includes(staffSearch.toLowerCase());
        const matchesDept = staffDeptFilter === 'all' || s.department === staffDeptFilter;
        const matchesStatus = staffStatusFilter === 'all' || s.employmentStatus === staffStatusFilter;
        const matchesType = staffTypeFilter === 'all' || (s.employmentType || 'Full-Time') === staffTypeFilter;
        return matchesSearch && matchesDept && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        let valA: string = a.name;
        let valB: string = b.name;
        if (staffSortBy === 'empId') {
          valA = a.empId;
          valB = b.empId;
        } else if (staffSortBy === 'department') {
          valA = a.department;
          valB = b.department;
        } else if (staffSortBy === 'joiningDate') {
          valA = a.joiningDate;
          valB = b.joiningDate;
        }

        if (valA < valB) return staffSortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return staffSortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [generalStaff, staffSearch, staffDeptFilter, staffStatusFilter, staffTypeFilter, staffSortBy, staffSortOrder]);

  // Paginated General Staff
  const paginatedGeneralStaff = useMemo(() => {
    const startIndex = (staffPage - 1) * staffPageSize;
    return filteredGeneralStaff.slice(startIndex, startIndex + staffPageSize);
  }, [filteredGeneralStaff, staffPage, staffPageSize]);

  const totalStaffPages = Math.ceil(filteredGeneralStaff.length / staffPageSize) || 1;

  // Safe Archive Execution
  const handleConfirmArchive = () => {
    if (!staffToArchive) return;
    deleteTeacher(staffToArchive.id);
    setStaffToArchive(null);
  };

  const handleConfirmSubstitute = (e: React.FormEvent) => {
    e.preventDefault();
    const subTeacher = teachers.find(t => t.id === subForm.substituteTeacherId);
    if (!subTeacher) return;

    assignSubstitute({
      leaveRequestId: subForm.leaveRequestId,
      originalTeacherId: subForm.originalTeacherId,
      originalTeacherName: subForm.originalTeacherName,
      substituteTeacherId: subTeacher.id,
      substituteTeacherName: subTeacher.name,
      date: subForm.date,
      day: subForm.day,
      period: subForm.period,
      time: subForm.time,
      standard: subForm.standard,
      section: subForm.section,
      subject: subForm.subject,
      room: subForm.room,
      notes: subForm.notes
    });

    setShowSubstituteModal(false);
    setSelectedLeaveForSub(null);
  };

  const handleOpenAssignSubModal = (leave: StaffLeaveRequest) => {
    setSelectedLeaveForSub(leave);
    setSubForm({
      leaveRequestId: leave.id,
      originalTeacherId: leave.staffId,
      originalTeacherName: leave.staffName,
      substituteTeacherId: teachers.find(t => t.id !== leave.staffId && t.employmentStatus === 'Active')?.id || 'tch-07',
      date: leave.startDate,
      day: 'Wednesday',
      period: 3,
      time: '10:15 - 11:00',
      standard: 8,
      section: 'A',
      subject: 'English (Reading Practice)',
      room: 'Room 204',
      notes: `Covering classes during approved leave (${leave.leaveType})`
    });
    setShowSubstituteModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Top Module Sub-Navigation Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('teachers')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'teachers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Academic Faculty ({teachingStaff.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('staff')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'staff' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>General Staff ({generalStaff.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('leaves')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'leaves' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>Faculty Leaves</span>
            {leaveRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('substitutions')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'substitutions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
            <span>Substitution Matrix ({substitutions.length})</span>
          </button>
        </div>

        {canEditStaff && (
          <div className="flex items-center gap-2">
            {activeSubTab === 'teachers' && (
              <button
                onClick={() => {
                  setAddStaffCategory('Teaching');
                  setShowAddStaffModal(true);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-sm transition-all`}
              >
                <Plus className="w-4 h-4" /> Appoint Faculty
              </button>
            )}

            {activeSubTab === 'staff' && (
              <button
                onClick={() => {
                  setAddStaffCategory('Non-Teaching');
                  setShowAddStaffModal(true);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-sm transition-all`}
              >
                <Plus className="w-4 h-4" /> Add General Staff
              </button>
            )}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 1. ACADEMIC FACULTY DIRECTORY (TEACHING STAFF)                 */}
      {/* ============================================================== */}
      {activeSubTab === 'teachers' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Academic Faculty Roster</h3>
              <p className="text-xs text-slate-500">
                Teaching faculty, assigned classes, subject curriculum & weekly teaching period quotas
              </p>
            </div>
            <div className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-800">{filteredTeachers.length}</span> teaching staff
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search faculty name, emp ID, or subject..."
                value={teacherSearch}
                onChange={e => {
                  setTeacherSearch(e.target.value);
                  setTeacherPage(1);
                }}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>

            <div>
              <select
                value={teacherDeptFilter}
                onChange={e => {
                  setTeacherDeptFilter(e.target.value);
                  setTeacherPage(1);
                }}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {teacherDepartments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={teacherStatusFilter}
                onChange={e => {
                  setTeacherStatusFilter(e.target.value);
                  setTeacherPage(1);
                }}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Employment Statuses</option>
                <option value="Active">Active On Duty</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive / Suspended</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={teacherSortBy}
                onChange={e => setTeacherSortBy(e.target.value as any)}
                className="flex-1 py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="name">Sort by Name</option>
                <option value="empId">Sort by Emp ID</option>
                <option value="workload">Sort by Workload</option>
                <option value="joiningDate">Sort by Joining Date</option>
              </select>

              <button
                onClick={() => setTeacherSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-2.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100"
                title="Toggle sort direction"
              >
                {teacherSortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* Faculty Table */}
          {filteredTeachers.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Faculty ID</th>
                    <th className="py-3 px-4">Teacher Name</th>
                    <th className="py-3 px-4">Department & Role</th>
                    <th className="py-3 px-4">Assigned Classes</th>
                    <th className="py-3 px-4">Teaching Subjects</th>
                    <th className="py-3 px-4">Workload Quota</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedTeachers.map(teacher => {
                    const workloadPct = teacher.maxWeeklyWorkload > 0
                      ? Math.round((teacher.currentWeeklyWorkload / teacher.maxWeeklyWorkload) * 100)
                      : 0;

                    return (
                      <tr key={teacher.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">{teacher.empId}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{teacher.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{teacher.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{teacher.department}</div>
                          <div className="text-[10px] text-slate-500">{teacher.designation}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {teacher.classesAssigned && teacher.classesAssigned.length > 0 ? (
                              teacher.classesAssigned.map(c => (
                                <span key={c} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-mono text-[10px] font-semibold">
                                  Std {c}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 italic">None</span>
                            )}
                          </div>
                          {teacher.classTeacherOf && (
                            <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-700">
                              Mentor: Std {teacher.classTeacherOf}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-800 font-medium">
                            {teacher.subjects && teacher.subjects.length > 0 ? teacher.subjects.join(', ') : '—'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold tabular-nums">
                              {teacher.currentWeeklyWorkload}/{teacher.maxWeeklyWorkload}
                            </span>
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${workloadPct > 90 ? 'bg-rose-500' : workloadPct > 75 ? 'bg-amber-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(workloadPct, 100)}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400">periods/wk</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            teacher.employmentStatus === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : teacher.employmentStatus === 'On Leave'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {teacher.employmentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewingStaff(teacher)}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors"
                              title="View Faculty Dossier"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {canEditStaff && (
                              <button
                                onClick={() => setEditingStaff(teacher)}
                                className="p-1.5 hover:bg-blue-50 rounded text-slate-600 hover:text-blue-600 transition-colors"
                                title="Edit Faculty Profile"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {canEditStaff && (
                              <button
                                onClick={() => setStaffToArchive(teacher)}
                                className="p-1.5 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors"
                                title="Archive Faculty Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-800">No faculty members match your filter criteria.</p>
              <button
                onClick={() => {
                  setTeacherSearch('');
                  setTeacherDeptFilter('all');
                  setTeacherStatusFilter('all');
                }}
                className="px-3 py-1.5 text-xs text-blue-600 font-semibold hover:underline"
              >
                Reset Search & Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredTeachers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div>
                Showing {(teacherPage - 1) * teacherPageSize + 1} to {Math.min(teacherPage * teacherPageSize, filteredTeachers.length)} of {filteredTeachers.length} faculty
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTeacherPage(p => Math.max(1, p - 1))}
                  disabled={teacherPage === 1}
                  className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-slate-700">
                  Page {teacherPage} of {totalTeacherPages}
                </span>
                <button
                  onClick={() => setTeacherPage(p => Math.min(totalTeacherPages, p + 1))}
                  disabled={teacherPage === totalTeacherPages}
                  className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. GENERAL STAFF DIRECTORY (NON-TEACHING & ADMINISTRATIVE)     */}
      {/* ============================================================== */}
      {activeSubTab === 'staff' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">General Staff & Administration</h3>
              <p className="text-xs text-slate-500">
                Front desk, library sciences, bursar finance, school operations & administrative staff
              </p>
            </div>
            <div className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-800">{filteredGeneralStaff.length}</span> staff members
            </div>
          </div>

          {/* Filters Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search staff name, emp ID, or role..."
                value={staffSearch}
                onChange={e => {
                  setStaffSearch(e.target.value);
                  setStaffPage(1);
                }}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>

            <div>
              <select
                value={staffDeptFilter}
                onChange={e => {
                  setStaffDeptFilter(e.target.value);
                  setStaffPage(1);
                }}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {generalStaffDepartments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={staffTypeFilter}
                onChange={e => {
                  setStaffTypeFilter(e.target.value);
                  setStaffPage(1);
                }}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Employment Types</option>
                <option value="Full-Time">Full-Time Permanent</option>
                <option value="Contract">Contractual</option>
                <option value="Probation">Probationary</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={staffSortBy}
                onChange={e => setStaffSortBy(e.target.value as any)}
                className="flex-1 py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="name">Sort by Name</option>
                <option value="empId">Sort by Emp ID</option>
                <option value="department">Sort by Department</option>
                <option value="joiningDate">Sort by Joining Date</option>
              </select>

              <button
                onClick={() => setStaffSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-2.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100"
                title="Toggle sort direction"
              >
                {staffSortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* General Staff Table */}
          {filteredGeneralStaff.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Employee ID</th>
                    <th className="py-3 px-4">Staff Name</th>
                    <th className="py-3 px-4">Department & Unit</th>
                    <th className="py-3 px-4">Official Designation</th>
                    <th className="py-3 px-4">Employment Type</th>
                    <th className="py-3 px-4">Joining Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedGeneralStaff.map(staff => (
                    <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">{staff.empId}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{staff.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{staff.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{staff.department}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{staff.designation}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {staff.employmentType || 'Full-Time'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{staff.joiningDate}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          staff.employmentStatus === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : staff.employmentStatus === 'On Leave'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {staff.employmentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingStaff(staff)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors"
                            title="View Staff Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canEditStaff && (
                            <button
                              onClick={() => setEditingStaff(staff)}
                              className="p-1.5 hover:bg-blue-50 rounded text-slate-600 hover:text-blue-600 transition-colors"
                              title="Edit Staff File"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {canEditStaff && (
                            <button
                              onClick={() => setStaffToArchive(staff)}
                              className="p-1.5 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors"
                              title="Archive Staff File"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-800">No staff records match your search criteria.</p>
              <button
                onClick={() => {
                  setStaffSearch('');
                  setStaffDeptFilter('all');
                  setStaffStatusFilter('all');
                }}
                className="px-3 py-1.5 text-xs text-blue-600 font-semibold hover:underline"
              >
                Reset Search & Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredGeneralStaff.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div>
                Showing {(staffPage - 1) * staffPageSize + 1} to {Math.min(staffPage * staffPageSize, filteredGeneralStaff.length)} of {filteredGeneralStaff.length} staff
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStaffPage(p => Math.max(1, p - 1))}
                  disabled={staffPage === 1}
                  className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-slate-700">
                  Page {staffPage} of {totalStaffPages}
                </span>
                <button
                  onClick={() => setStaffPage(p => Math.min(totalStaffPages, p + 1))}
                  disabled={staffPage === totalStaffPages}
                  className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. FACULTY LEAVES TAB                                          */}
      {/* ============================================================== */}
      {activeSubTab === 'leaves' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Faculty Leave Requests</h3>
              <p className="text-xs text-slate-500">Official leave register, administrative endorsements & substitution triggers</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold">
              {leaveRequests.length} Total Applications
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Endorsement Remarks</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {leaveRequests.map(leave => (
                  <tr key={leave.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{leave.staffName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Applied: {leave.appliedAt}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{leave.leaveType}</td>
                    <td className="py-3 px-4 font-mono">
                      <div>{leave.startDate} &rarr; {leave.endDate}</div>
                      <span className="text-[10px] text-slate-500 font-bold">{leave.daysCount} Day(s)</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">{leave.reason}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        leave.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : leave.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 italic max-w-[180px] truncate">
                      {leave.reviewRemarks || 'Pending review'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {canApproveLeave && leave.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approveLeaveRequest(leave.id, 'Principal Montgomery', 'Approved')}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectLeaveRequest(leave.id, 'Principal Montgomery', 'Schedule conflict')}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {canAssignSubstitutes && leave.status === 'approved' && (
                          <button
                            onClick={() => handleOpenAssignSubModal(leave)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg"
                          >
                            Assign Substitute
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

      {/* ============================================================== */}
      {/* 4. TIMETABLE SUBSTITUTION MATRIX                               */}
      {/* ============================================================== */}
      {activeSubTab === 'substitutions' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Faculty Substitution Assignments</h3>
              <p className="text-xs text-slate-500">Live roster coverage for faculty on medical or casual absence</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold">
              {substitutions.length} Active Coverages
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date & Period</th>
                  <th className="py-3 px-4">Absent Faculty</th>
                  <th className="py-3 px-4">Substitute Assigned</th>
                  <th className="py-3 px-4">Class & Room</th>
                  <th className="py-3 px-4">Subject & Coverage Scope</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {substitutions.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      <div>{sub.date}</div>
                      <div className="text-[10px] text-slate-500">{sub.day} · Period {sub.period} ({sub.time})</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-rose-700">{sub.originalTeacherName}</div>
                      <div className="text-[10px] text-slate-400">On Approved Leave</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-emerald-800">{sub.substituteTeacherName}</div>
                      <div className="text-[10px] text-slate-500">Covering Faculty</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">Std {sub.standard}-{sub.section}</div>
                      <div className="text-[10px] text-slate-500">{sub.room}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{sub.subject}</div>
                      <div className="text-[10px] text-slate-500 italic truncate max-w-[200px]">{sub.notes}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {canAssignSubstitutes && (
                        <button
                          onClick={() => cancelSubstitute(sub.id)}
                          className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded"
                        >
                          Cancel Coverage
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODALS & DIALOGS                                               */}
      {/* ============================================================== */}

      {/* 1. Add / Edit Staff Modal */}
      <StaffFormModal
        isOpen={showAddStaffModal || !!editingStaff}
        onClose={() => {
          setShowAddStaffModal(false);
          setEditingStaff(null);
        }}
        mode={editingStaff ? 'edit' : 'create'}
        staffToEdit={editingStaff}
        defaultCategory={addStaffCategory}
        onSaved={() => {
          setShowAddStaffModal(false);
          setEditingStaff(null);
        }}
      />

      {/* 2. Staff & Faculty Dossier Modal */}
      <StaffProfileModal
        isOpen={!!viewingStaff}
        onClose={() => setViewingStaff(null)}
        staff={viewingStaff}
        onEdit={(staff) => {
          setViewingStaff(null);
          setEditingStaff(staff);
        }}
        onAssignSubstitute={(staff) => {
          setViewingStaff(null);
          const leave = leaveRequests.find(l => l.staffId === staff.id);
          if (leave) {
            handleOpenAssignSubModal(leave);
          } else {
            showToast(`No pending leave requests found for ${staff.name}.`, 'info');
          }
        }}
      />

      {/* 3. Safe Archive Confirmation Modal (replacing window.confirm) */}
      {staffToArchive && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Archive Staff Member Record?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm archival for <strong>{staffToArchive.name}</strong> ({staffToArchive.empId})
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-semibold">{staffToArchive.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="font-semibold">{staffToArchive.designation}</span>
              </div>
              {timetables.filter(s => s.teacherId === staffToArchive.id).length > 0 && (
                <div className="p-2 rounded bg-amber-50 text-amber-800 text-[11px] font-medium mt-1">
                  ⚠️ This faculty member currently has active timetable slots assigned across school classes. Archiving will leave these periods unassigned until covered.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStaffToArchive(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmArchive}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Confirm Archival
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Assign Substitute Modal */}
      {showSubstituteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Assign Teaching Substitute</h3>
                <p className="text-xs text-slate-500">Deploy replacement faculty for approved medical or casual leave</p>
              </div>
              <button
                onClick={() => setShowSubstituteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSubstitute} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Absent Faculty</label>
                  <input
                    type="text"
                    disabled
                    value={subForm.originalTeacherName}
                    className="w-full p-2 rounded-xl bg-slate-100 border border-slate-200 font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Substitute Faculty *</label>
                  <select
                    value={subForm.substituteTeacherId}
                    onChange={e => setSubForm({ ...subForm, substituteTeacherId: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    {teachingStaff
                      .filter(t => t.id !== subForm.originalTeacherId && t.employmentStatus === 'Active')
                      .map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.department} - {t.currentWeeklyWorkload}/{t.maxWeeklyWorkload} p/wk)
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Date</label>
                  <input
                    type="date"
                    value={subForm.date}
                    onChange={e => setSubForm({ ...subForm, date: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Period Number</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={subForm.period}
                    onChange={e => setSubForm({ ...subForm, period: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Standard & Sec</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={subForm.standard}
                      onChange={e => setSubForm({ ...subForm, standard: Number(e.target.value) })}
                      className="w-1/2 p-2 rounded-xl border border-slate-200 font-mono"
                    />
                    <select
                      value={subForm.section}
                      onChange={e => setSubForm({ ...subForm, section: e.target.value as any })}
                      className="w-1/2 p-2 rounded-xl border border-slate-200 font-mono"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Subject & Lesson Instruction</label>
                <input
                  type="text"
                  value={subForm.subject}
                  onChange={e => setSubForm({ ...subForm, subject: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubstituteModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
