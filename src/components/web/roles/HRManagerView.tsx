import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Clock,
  ArrowRightLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  FileText,
  Search,
  Filter,
  Briefcase,
  TrendingUp,
  Download,
  ShieldCheck,
  Building2,
  UserPlus,
  Mail,
  Phone,
  Eye,
  Edit2,
  Trash2,
  Plus,
  X,
  Check,
  FileSpreadsheet,
  PieChart,
  BarChart2,
  User,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { getThemeClasses } from '../../../utils/themeHelper';
import { Teacher, StaffLeaveRequest, SubstitutionAssignment } from '../../../types/school';
import { StaffFormModal } from '../../common/StaffFormModal';
import { StaffProfileModal } from '../../common/StaffProfileModal';

export const HRManagerView: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    themeColor,
    teachers,
    staffAttendance,
    leaveRequests,
    substitutions,
    timetables,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    submitLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    assignSubstitute,
    cancelSubstitute,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Search & Filter State for Staff
  const [staffSearch, setStaffSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'empId' | 'joiningDate' | 'department'>('name');

  // Attendance filter
  const [attDate, setAttDate] = useState('2026-10-14');
  const [attDeptFilter, setAttDeptFilter] = useState('all');

  // Leave Management State
  const [leaveStatusFilter, setLeaveStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [leaveReviewModalItem, setLeaveReviewModalItem] = useState<StaffLeaveRequest | null>(null);
  const [leaveReviewDecision, setLeaveReviewDecision] = useState<'approved' | 'rejected'>('approved');
  const [leaveReviewRemarks, setLeaveReviewRemarks] = useState('');

  // Modals
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [viewingStaff, setViewingStaff] = useState<Teacher | null>(null);
  const [editingStaff, setEditingStaff] = useState<Teacher | null>(null);

  // Departments State
  const [departmentsList, setDepartmentsList] = useState<Array<{
    id: string;
    name: string;
    hodName: string;
    staffCount: number;
    description: string;
    designations: string[];
  }>>([
    {
      id: 'dept-01',
      name: 'Science & Technology',
      hodName: 'Dr. Alok Sen',
      staffCount: 3,
      description: 'Physics, Chemistry, and Biology laboratories and secondary curricula.',
      designations: ['PGT Physics', 'TGT Chemistry', 'Lab Assistant']
    },
    {
      id: 'dept-02',
      name: 'Mathematics',
      hodName: 'Mrs. Shalini Verma',
      staffCount: 2,
      description: 'Foundational algebra, geometry, trigonometry, and analytical problem-solving.',
      designations: ['Senior PGT Mathematics', 'TGT Mathematics']
    },
    {
      id: 'dept-03',
      name: 'English & Literature',
      hodName: "Ms. Rebecca D'Souza",
      staffCount: 2,
      description: 'English language fluency, communicative prose, and world literature.',
      designations: ['PGT English Literature', 'PRT English']
    },
    {
      id: 'dept-04',
      name: 'Social Studies & Humanities',
      hodName: 'Mr. Arvind Saxena',
      staffCount: 2,
      description: 'Indian history, geography, civics, and economic governance.',
      designations: ['Senior Faculty Social Science', 'TGT Geography']
    },
    {
      id: 'dept-05',
      name: 'Computer Science & ICT',
      hodName: 'Ms. Neha Gupta',
      staffCount: 2,
      description: 'Computer coding, Python programming, robotics, and cyber ethics.',
      designations: ['Head of ICT', 'Lab Technician']
    },
    {
      id: 'dept-06',
      name: 'Administration & HR',
      hodName: 'Ms. Anita Desai',
      staffCount: 3,
      description: 'Institutional management, human resources, bursar accounts, and front desk.',
      designations: ['Director of Human Resources', 'Chief Bursar', 'Front Office Executive']
    }
  ]);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHod, setNewDeptHod] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');

  // Employment Documents Register State
  const [documentsList, setDocumentsList] = useState<Array<{
    id: string;
    staffName: string;
    empId: string;
    title: string;
    category: 'Educational Degree' | 'Teacher Credential' | 'Identity Proof' | 'Police Verification' | 'Contract';
    issueDate: string;
    expiryDate: string;
    status: 'Verified' | 'Pending Verification' | 'Expired';
    verifiedBy: string;
  }>>([
    {
      id: 'doc-01',
      staffName: 'Dr. Evelyn Montgomery',
      empId: 'ADM-2015-012',
      title: 'Ph.D. Education Leadership (Gold Medalist)',
      category: 'Educational Degree',
      issueDate: '2014-06-15',
      expiryDate: 'Lifetime',
      status: 'Verified',
      verifiedBy: 'Board of Trustees'
    },
    {
      id: 'doc-02',
      staffName: 'Mrs. Shalini Verma',
      empId: 'TCH-2018-042',
      title: 'M.Sc. Mathematics & B.Ed. Degree Certificate',
      category: 'Teacher Credential',
      issueDate: '2016-04-10',
      expiryDate: 'Lifetime',
      status: 'Verified',
      verifiedBy: 'Ms. Anita Desai (HR)'
    },
    {
      id: 'doc-03',
      staffName: 'Dr. Alok Sen',
      empId: 'TCH-2019-061',
      title: 'Ph.D. Experimental Physics & CSIR-NET',
      category: 'Educational Degree',
      issueDate: '2017-08-20',
      expiryDate: 'Lifetime',
      status: 'Verified',
      verifiedBy: 'Ms. Anita Desai (HR)'
    },
    {
      id: 'doc-04',
      staffName: 'Coach Vikram Rawat',
      empId: 'TCH-2022-132',
      title: 'National Institute of Sports (NIS) Certification',
      category: 'Teacher Credential',
      issueDate: '2021-11-05',
      expiryDate: '2026-11-05',
      status: 'Verified',
      verifiedBy: 'Ms. Anita Desai (HR)'
    },
    {
      id: 'doc-05',
      staffName: 'Mr. Arvind Saxena',
      empId: 'TCH-2021-098',
      title: 'Annual Police Background & Vigilance Verification',
      category: 'Police Verification',
      issueDate: '2025-09-01',
      expiryDate: '2026-09-01',
      status: 'Pending Verification',
      verifiedBy: 'District Police Commissioner Office'
    }
  ]);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocStaffId, setNewDocStaffId] = useState(teachers[0]?.id || 'tch-01');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<any>('Educational Degree');

  // Recruitment Candidate Pipeline State
  const [candidateList, setCandidateList] = useState<Array<{
    id: string;
    name: string;
    position: string;
    qualification: string;
    experience: string;
    applicationDate: string;
    stage: 'Applied' | 'Screening' | 'Interview Scheduled' | 'Offer Extended' | 'Rejected';
    email: string;
    phone: string;
  }>>([
    {
      id: 'cand-01',
      name: 'Ms. Pooja Deshpande',
      position: 'PGT Physics',
      qualification: 'M.Sc. Physics, B.Ed.',
      experience: '6 Years (Senior School)',
      applicationDate: '2026-10-02',
      stage: 'Interview Scheduled',
      email: 'pooja.deshpande@mail.com',
      phone: '+91 98221 00441'
    },
    {
      id: 'cand-02',
      name: 'Mr. Saurabh Kothari',
      position: 'TGT English Literature',
      qualification: 'M.A. English, CELTA Certified',
      experience: '4 Years',
      applicationDate: '2026-10-05',
      stage: 'Screening',
      email: 'saurabh.k@mail.com',
      phone: '+91 98221 00442'
    },
    {
      id: 'cand-03',
      name: 'Ms. Ananya Swaminathan',
      position: 'Primary Teacher (PRT Mathematics)',
      qualification: 'B.Sc. Math, D.El.Ed.',
      experience: '3 Years',
      applicationDate: '2026-09-28',
      stage: 'Offer Extended',
      email: 'ananya.s@mail.com',
      phone: '+91 98221 00443'
    },
    {
      id: 'cand-04',
      name: 'Mr. Danish Farooqi',
      position: 'Robotics & Computer Lab Assistant',
      qualification: 'BCA, Hardware Certified',
      experience: '2 Years',
      applicationDate: '2026-10-10',
      stage: 'Applied',
      email: 'danish.f@mail.com',
      phone: '+91 98221 00444'
    }
  ]);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [newCandName, setNewCandName] = useState('');
  const [newCandPosition, setNewCandPosition] = useState('PGT Chemistry');
  const [newCandQual, setNewCandQual] = useState('M.Sc., B.Ed.');
  const [newCandExp, setNewCandExp] = useState('5 Years');
  const [newCandEmail, setNewCandEmail] = useState('');
  const [newCandPhone, setNewCandPhone] = useState('');

  // Substitution Assignment Modal State
  const [showAssignSubModal, setShowAssignSubModal] = useState(false);
  const [subAbsentTeacherId, setSubAbsentTeacherId] = useState('tch-03');
  const [subDate, setSubDate] = useState('2026-10-14');
  const [subPeriod, setSubPeriod] = useState<number>(3);
  const [subClass, setSubClass] = useState<number>(8);
  const [subSection, setSubSection] = useState<'A' | 'B'>('A');
  const [subSubject, setSubSubject] = useState('English Literature');
  const [subTeacherId, setSubTeacherId] = useState('tch-07');
  const [subRoom, setSubRoom] = useState('Room 204');
  const [subNotes, setSubNotes] = useState('Covering class silent reading session during sick leave.');

  // Counts
  const teachingCount = useMemo(() => teachers.filter(t => t.staffCategory === 'Teaching').length, [teachers]);
  const adminCount = useMemo(() => teachers.filter(t => t.staffCategory === 'Administrative').length, [teachers]);
  const nonTeachingCount = useMemo(() => teachers.filter(t => t.staffCategory === 'Non-Teaching').length, [teachers]);
  const activeCount = useMemo(() => teachers.filter(t => t.employmentStatus === 'Active').length, [teachers]);
  const pendingLeaves = useMemo(() => leaveRequests.filter(l => l.status === 'pending').length, [leaveRequests]);

  // Filtered Staff
  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const q = staffSearch.toLowerCase();
      const matchSearch = t.name.toLowerCase().includes(q) ||
        t.empId.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.designation.toLowerCase().includes(q);
      const matchDept = deptFilter === 'all' || t.department === deptFilter;
      const matchCat = categoryFilter === 'all' || t.staffCategory === categoryFilter;
      const matchStatus = statusFilter === 'all' || t.employmentStatus === statusFilter;
      return matchSearch && matchDept && matchCat && matchStatus;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'empId') return a.empId.localeCompare(b.empId);
      if (sortBy === 'department') return a.department.localeCompare(b.department);
      return a.joiningDate.localeCompare(b.joiningDate);
    });
  }, [teachers, staffSearch, deptFilter, categoryFilter, statusFilter, sortBy]);

  // Attendance Stats
  const attendanceToday = useMemo(() => {
    const records = staffAttendance.filter(sa => sa.date === attDate);
    const present = records.filter(r => r.status === 'present').length;
    const late = records.filter(r => r.status === 'late').length;
    const leave = records.filter(r => r.status === 'on_leave').length;
    const absent = Math.max(0, teachers.length - present - late - leave);
    return { records, present, late, leave, absent };
  }, [staffAttendance, attDate, teachers.length]);

  // Handlers
  const handleReviewLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReviewModalItem) return;

    // Self-approval safeguard
    if (leaveReviewModalItem.staffName === 'Ms. Anita Desai') {
      showToast('Action Denied: HR Manager cannot self-approve leave requests. Must be routed to Principal.', 'error');
      return;
    }

    if (leaveReviewDecision === 'approved') {
      approveLeaveRequest(leaveReviewModalItem.id, 'Ms. Anita Desai (Director of HR)', leaveReviewRemarks || 'Sanctioned under institutional leave quota.');
    } else {
      if (!leaveReviewRemarks.trim()) {
        showToast('Mandatory rejection remarks required.', 'error');
        return;
      }
      rejectLeaveRequest(leaveReviewModalItem.id, 'Ms. Anita Desai (Director of HR)', leaveReviewRemarks.trim());
    }

    setLeaveReviewModalItem(null);
    setLeaveReviewRemarks('');
  };

  const handleAddDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptHod.trim()) {
      showToast('Please provide department name and designated Head of Department.', 'error');
      return;
    }

    setDepartmentsList(prev => [
      ...prev,
      {
        id: `dept-${Date.now()}`,
        name: newDeptName.trim(),
        hodName: newDeptHod.trim(),
        staffCount: 1,
        description: newDeptDesc.trim() || 'Institutional academic or support department.',
        designations: ['Faculty Member', 'Department Associate']
      }
    ]);

    setShowAddDeptModal(false);
    setNewDeptName('');
    setNewDeptHod('');
    setNewDeptDesc('');
    showToast(`Department "${newDeptName}" registered successfully.`, 'success');
  };

  const handleAddDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = teachers.find(t => t.id === newDocStaffId);
    if (!st || !newDocTitle.trim()) {
      showToast('Please specify valid document title and staff member.', 'error');
      return;
    }

    setDocumentsList(prev => [
      {
        id: `doc-${Date.now()}`,
        staffName: st.name,
        empId: st.empId,
        title: newDocTitle.trim(),
        category: newDocCategory,
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: 'Lifetime',
        status: 'Verified',
        verifiedBy: 'Ms. Anita Desai (Director of HR)'
      },
      ...prev
    ]);

    setShowAddDocModal(false);
    setNewDocTitle('');
    showToast(`Registered and verified credential for ${st.name}.`, 'success');
  };

  const handleAddCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandName.trim()) {
      showToast('Candidate name is required.', 'error');
      return;
    }

    setCandidateList(prev => [
      {
        id: `cand-${Date.now()}`,
        name: newCandName.trim(),
        position: newCandPosition,
        qualification: newCandQual.trim(),
        experience: newCandExp.trim(),
        applicationDate: new Date().toISOString().split('T')[0],
        stage: 'Applied',
        email: newCandEmail.trim() || 'applicant@mail.com',
        phone: newCandPhone.trim() || '+91 98221 00000'
      },
      ...prev
    ]);

    setShowAddCandidateModal(false);
    setNewCandName('');
    showToast(`Candidate application for "${newCandPosition}" added to pipeline.`, 'success');
  };

  const handleAssignSubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orig = teachers.find(t => t.id === subAbsentTeacherId);
    const sub = teachers.find(t => t.id === subTeacherId);
    if (!orig || !sub) return;

    assignSubstitute({
      leaveRequestId: 'lvr-manual',
      originalTeacherId: orig.id,
      originalTeacherName: orig.name,
      substituteTeacherId: sub.id,
      substituteTeacherName: sub.name,
      date: subDate,
      day: 'Wednesday',
      period: subPeriod,
      time: '10:15 - 11:00',
      standard: subClass,
      section: subSection,
      subject: subSubject,
      room: subRoom,
      notes: subNotes
    });

    setShowAssignSubModal(false);
    showToast(`Assigned ${sub.name} to substitute for ${orig.name} (Period ${subPeriod}).`, 'success');
  };

  const handleExportCSV = (reportTitle: string, csvData: string) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported "${reportTitle}" to CSV successfully.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* MODULE 1: HR DASHBOARD (Section 7.2)                                      */}
      {/* ========================================================================= */}
      {(activeTab === 'dashboard' || !activeTab) && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-sm shrink-0"
                style={{ backgroundColor: themeClasses.hex }}
              >
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Faculty & Personnel Directorate
                  </h2>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    Active Workforce: {teachers.length} Members
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Institutional human resources: faculty recruitment, biometric check-in tracking, leave quotas, substitutions, and salary readiness rosters.
                </p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsAddStaffOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl text-white shadow-2xs hover:opacity-95 transition-opacity flex items-center gap-1.5"
                style={{ backgroundColor: themeClasses.hex }}
              >
                <UserPlus className="w-4 h-4" />
                <span>Enroll Staff Member</span>
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Search className="w-4 h-4 text-slate-600" />
                <span>Search Staff</span>
              </button>
              <button
                onClick={() => setActiveTab('leaves')}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>Review Leaves ({pendingLeaves})</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Total Personnel</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">{teachers.length}</div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="text-emerald-700 font-semibold">{teachingCount} Teaching</span>
                <span>·</span>
                <span>{adminCount + nonTeachingCount} Administrative / Support</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Biometric Gate Influx</span>
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-700">96.4%</div>
              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Staff RFID readers synchronized
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Pending Leave Quotas</span>
                <Calendar className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-700">{pendingLeaves}</div>
              <div className="text-[11px] text-slate-500">
                Awaiting administrative decision
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Active Substitutions</span>
                <ArrowRightLeft className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-purple-700">{substitutions.length}</div>
              <div className="text-[11px] text-slate-500">
                Cover periods assigned this week
              </div>
            </div>
          </div>

          {/* Department Breakdown & Personnel Alerts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Faculty Distribution</span>
                </h3>
                <button
                  onClick={() => setActiveTab('departments')}
                  className="text-xs font-semibold text-blue-700 hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {departmentsList.map(d => (
                  <div key={d.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block">{d.name}</strong>
                      <span className="text-[10px] text-slate-400">HOD: {d.hodName}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {d.staffCount} Staff
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Biometric Morning Check-Ins (Gate 1 & 2)</span>
                </h3>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="text-xs font-semibold text-blue-700 hover:underline"
                >
                  Full Gate Logs &rarr;
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {staffAttendance.slice(0, 5).map(sa => (
                  <div key={sa.id} className="py-2.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors px-1 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center font-mono">
                        {sa.staffName.split(' ').map(n => n[0]).join('')}
                      </span>
                      <div>
                        <strong className="text-slate-900 block">{sa.staffName}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {sa.empId} · {sa.department}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-emerald-700 block">
                        {sa.checkInTime || '07:55 AM'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{sa.markedBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: STAFF DIRECTORY (Section 7.3)                                   */}
      {/* ========================================================================= */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Faculty & Personnel Directory</h2>
              <p className="text-xs text-slate-500">Comprehensive register of academic faculty, administrative leadership, and support personnel</p>
            </div>
            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl text-white shadow-2xs hover:opacity-95 flex items-center gap-1.5"
              style={{ backgroundColor: themeClasses.hex }}
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Staff Member</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-wrap">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff name, EMP ID, department..."
                  value={staffSearch}
                  onChange={e => setStaffSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={deptFilter}
                  onChange={e => setDeptFilter(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold"
                >
                  <option value="all">All Departments</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English & Literature">English</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Administration">Administration</option>
                  <option value="Sports & Athletics">Sports & Athletics</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold"
                >
                  <option value="all">All Categories</option>
                  <option value="Teaching">Teaching Faculty</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Non-Teaching">Non-Teaching Staff</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Probation">Probation</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Staff Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Emp ID</th>
                    <th className="py-2.5 px-3">Employee Name</th>
                    <th className="py-2.5 px-3">Department & Designation</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTeachers.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{t.empId}</td>
                      <td className="py-2.5 px-3">
                        <strong className="text-slate-900 block">{t.name}</strong>
                        <span className="text-[10px] text-slate-400">{t.qualification}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-slate-800 block">{t.designation}</span>
                        <span className="text-[10px] text-slate-400">{t.department}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {t.staffCategory}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                        <div>{t.phone}</div>
                        <div className="text-[10px] text-slate-400">{t.email}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            t.employmentStatus === 'Active'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : t.employmentStatus === 'On Leave'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t.employmentStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingStaff(t)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Profile Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingStaff(t)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Staff Member"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 3: STAFF PROFILES (Section 7.4)                                    */}
      {/* ========================================================================= */}
      {activeTab === 'profiles' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Staff Personnel Profiles</h2>
              <p className="text-xs text-slate-500">Academic allocations, teaching workloads, credentials, and dossiers</p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Showing {teachers.length} Profile Dossiers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map(t => (
              <div
                key={t.id}
                onClick={() => setViewingStaff(t)}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-400 cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl text-white font-bold flex items-center justify-center text-sm shadow-xs"
                    style={{ backgroundColor: themeClasses.hex }}
                  >
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[11px] text-slate-500">{t.designation}</p>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">{t.empId}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs pt-1 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Department:</span>
                    <strong className="text-slate-800">{t.department}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Experience:</span>
                    <span className="font-mono text-slate-700">{t.experience}</span>
                  </div>
                  {t.staffCategory === 'Teaching' && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Weekly Workload:</span>
                      <span className="font-mono font-bold text-blue-700">
                        {t.currentWeeklyWorkload} / {t.maxWeeklyWorkload || 28} Periods
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-medium">✓ Active Status</span>
                  <span className="text-blue-700 font-semibold flex items-center gap-1">
                    Open Dossier &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 4: DEPARTMENTS & DESIGNATIONS (Section 7.5)                         */}
      {/* ========================================================================= */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Organizational Structure & Departments</h2>
              <p className="text-xs text-slate-500">Academic faculties, support units, designations, and departmental leadership</p>
            </div>
            <button
              onClick={() => setShowAddDeptModal(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl text-white shadow-2xs hover:opacity-95 flex items-center gap-1.5"
              style={{ backgroundColor: themeClasses.hex }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departmentsList.map(dept => (
              <div key={dept.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{dept.name}</h3>
                    <span className="text-[11px] text-slate-500">Head of Department: <strong>{dept.hodName}</strong></span>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-100 text-slate-700">
                    {dept.staffCount} Staff
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{dept.description}</p>

                <div className="space-y-1 text-xs pt-1 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Designation Tiers:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dept.designations.map((des, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded-lg text-[10px] font-medium border border-blue-200">
                        {des}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 5: STAFF ATTENDANCE (Section 7.6)                                  */}
      {/* ========================================================================= */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Biometric Gate Logs & Staff Attendance</h2>
              <p className="text-xs text-slate-500">Live RFID gate logs, biometric reader check-ins, and staff punctuality records</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={attDate}
                onChange={e => setAttDate(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-white font-mono font-semibold"
              />
            </div>
          </div>

          {/* Counts Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider block">Present on Campus</span>
              <strong className="text-xl font-bold font-mono text-emerald-800 mt-0.5 block">{attendanceToday.present} Staff</strong>
            </div>
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider block">Late Gate Influx</span>
              <strong className="text-xl font-bold font-mono text-amber-800 mt-0.5 block">{attendanceToday.late} Staff</strong>
            </div>
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-[10px] font-semibold text-blue-800 uppercase tracking-wider block">On Approved Leave</span>
              <strong className="text-xl font-bold font-mono text-blue-800 mt-0.5 block">{attendanceToday.leave} Staff</strong>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Total Recorded</span>
              <strong className="text-xl font-bold font-mono text-slate-900 mt-0.5 block">{teachers.length} Staff</strong>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Emp ID</th>
                    <th className="py-2.5 px-3">Staff Member</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Check-In</th>
                    <th className="py-2.5 px-3">Check-Out</th>
                    <th className="py-2.5 px-3">Terminal Reader</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {staffAttendance.map(sa => (
                    <tr key={sa.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{sa.empId}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{sa.staffName}</td>
                      <td className="py-2.5 px-3">{sa.department}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            sa.status === 'present'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : sa.status === 'late'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {sa.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono">{sa.checkInTime || '07:55 AM'}</td>
                      <td className="py-2.5 px-3 font-mono">{sa.checkOutTime || 'On Campus'}</td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{sa.markedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 6: LEAVE MANAGEMENT (Section 7.7)                                  */}
      {/* ========================================================================= */}
      {activeTab === 'leaves' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Faculty & Staff Leave Quotas & Approvals</h2>
              <p className="text-xs text-slate-500">Statutory casual leaves, medical leaves, duty absence approvals, and substitution notices</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={leaveStatusFilter}
                onChange={e => setLeaveStatusFilter(e.target.value as any)}
                className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-white font-semibold"
              >
                <option value="all">All Leave Decisions</option>
                <option value="pending">Pending Review ({pendingLeaves})</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Staff Name</th>
                    <th className="py-2.5 px-3">Leave Type</th>
                    <th className="py-2.5 px-3">Start & End Dates</th>
                    <th className="py-2.5 px-3 text-center">Days</th>
                    <th className="py-2.5 px-3">Justification Reason</th>
                    <th className="py-2.5 px-3">Applied At</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {leaveRequests
                    .filter(l => leaveStatusFilter === 'all' || l.status === leaveStatusFilter)
                    .map(l => (
                      <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{l.staffName}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-slate-800">{l.leaveType}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                          {l.startDate} &rarr; {l.endDate}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">{l.daysCount}</td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-xs">{l.reason}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-400 text-[10px]">{l.appliedAt}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              l.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : l.status === 'pending'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {l.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {l.status === 'pending' ? (
                            <button
                              onClick={() => {
                                setLeaveReviewModalItem(l);
                                setLeaveReviewDecision('approved');
                                setLeaveReviewRemarks('');
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-white rounded-lg transition-opacity hover:opacity-95 shadow-2xs"
                              style={{ backgroundColor: themeClasses.hex }}
                            >
                              Review & Decide
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">Reviewed</span>
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

      {/* ========================================================================= */}
      {/* MODULE 7: WORK ASSIGNMENTS & SUBSTITUTIONS (Section 7.8)                   */}
      {/* ========================================================================= */}
      {activeTab === 'work_assignments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Teaching Workloads & Duty Substitution Engine</h2>
              <p className="text-xs text-slate-500">Weekly instructional period allocations, classroom substitutions, and duty cover rosters</p>
            </div>
            <button
              onClick={() => setShowAssignSubModal(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl text-white shadow-2xs hover:opacity-95 flex items-center gap-1.5"
              style={{ backgroundColor: themeClasses.hex }}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Assign Substitute Duty</span>
            </button>
          </div>

          {/* Active Substitutions List */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Active Duty Substitutions Roster
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Date & Day</th>
                    <th className="py-2.5 px-3">Period & Time</th>
                    <th className="py-2.5 px-3">Absent Faculty</th>
                    <th className="py-2.5 px-3">Substitute Assigned</th>
                    <th className="py-2.5 px-3">Class & Subject</th>
                    <th className="py-2.5 px-3">Room</th>
                    <th className="py-2.5 px-3">Instructions</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {substitutions.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-mono">{sub.date} ({sub.day})</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">P{sub.period} ({sub.time})</td>
                      <td className="py-2.5 px-3 text-rose-700 font-medium">{sub.originalTeacherName}</td>
                      <td className="py-2.5 px-3 text-emerald-800 font-bold">{sub.substituteTeacherName}</td>
                      <td className="py-2.5 px-3">Std {sub.standard}-{sub.section} ({sub.subject})</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{sub.room}</td>
                      <td className="py-2.5 px-3 text-slate-500 max-w-xs">{sub.notes}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => cancelSubstitute(sub.id)}
                          className="px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          Cancel
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

      {/* ========================================================================= */}
      {/* MODULE 8: EMPLOYMENT DOCUMENTS REGISTER (Section 7.9)                     */}
      {/* ========================================================================= */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Employment Credentials & Document Register</h2>
              <p className="text-xs text-slate-500">Degree verifications, B.Ed. licenses, identity proofs, and annual vigilance clearances</p>
            </div>
            <button
              onClick={() => setShowAddDocModal(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl text-white shadow-2xs hover:opacity-95 flex items-center gap-1.5"
              style={{ backgroundColor: themeClasses.hex }}
            >
              <Plus className="w-4 h-4" />
              <span>Register Credential Metadata</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Emp ID</th>
                    <th className="py-2.5 px-3">Staff Member</th>
                    <th className="py-2.5 px-3">Credential / Document Title</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Issue Date</th>
                    <th className="py-2.5 px-3">Expiry / Validity</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3">Verified By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {documentsList.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{doc.empId}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{doc.staffName}</td>
                      <td className="py-2.5 px-3">
                        <strong className="text-slate-900 block">{doc.title}</strong>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{doc.issueDate}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{doc.expiryDate}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            doc.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">{doc.verifiedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 9: RECRUITMENT PIPELINE (Section 7.10)                             */}
      {/* ========================================================================= */}
      {activeTab === 'recruitment' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Faculty Recruitment & Candidate Pipeline</h2>
              <p className="text-xs text-slate-500">Applicant tracking, academic credentials screening, panel interviews, and appointment offers</p>
            </div>
            <button
              onClick={() => setShowAddCandidateModal(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl text-white shadow-2xs hover:opacity-95 flex items-center gap-1.5"
              style={{ backgroundColor: themeClasses.hex }}
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Candidate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidateList.map(cand => (
              <div key={cand.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{cand.name}</h4>
                    <span className="text-[11px] font-semibold text-blue-700">{cand.position}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      cand.stage === 'Offer Extended'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : cand.stage === 'Interview Scheduled'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {cand.stage}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Qualifications:</span>
                    <strong className="text-slate-800">{cand.qualification}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Teaching Experience:</span>
                    <span className="font-mono text-slate-700">{cand.experience}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px] text-slate-500 pt-1">
                    <span>{cand.phone}</span>
                    <span>{cand.email}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">Applied: {cand.applicationDate}</span>
                  <button
                    onClick={() => {
                      setCandidateList(prev => prev.map(c => {
                        if (c.id === cand.id) {
                          const nextStage = c.stage === 'Applied' ? 'Screening' : c.stage === 'Screening' ? 'Interview Scheduled' : 'Offer Extended';
                          return { ...c, stage: nextStage as any };
                        }
                        return c;
                      }));
                      showToast(`Candidate stage advanced for ${cand.name}.`, 'success');
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Advance Stage &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 10: PAYROLL OVERVIEW & PRIVACY (Section 7.11)                       */}
      {/* ========================================================================= */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Staff Payroll Attendance Readiness</h2>
              <p className="text-xs text-slate-500">Biometric cycle audit, working days reconciliation, and aggregate department payroll readiness</p>
            </div>
            <button
              onClick={() => {
                let csv = "Employee ID,Staff Name,Department,Category,Working Days,Present Days,Approved Paid Leaves,Loss of Pay,Net Payable Days\n";
                teachers.forEach(t => {
                  const rec = staffAttendance.find(sa => sa.staffId === t.id);
                  const isLeave = rec?.status === "on_leave" || t.employmentStatus === "On Leave";
                  const paidLeave = isLeave ? 1 : 0;
                  const present = isLeave ? 23 : 24;
                  csv += `"${t.empId}","${t.name}","${t.department}","${t.staffCategory}",24,${present},${paidLeave},0,24\n`;
                });
                handleExportCSV("GIS_HR_Payroll_Readiness_October_2026", csv);
              }}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export Payroll Readiness CSV</span>
            </button>
          </div>

          {/* Privacy & Governance Notice */}
          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl flex items-start gap-3 text-xs text-teal-900">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block">Payroll Privacy & Statutory Compliance:</strong>
              <p className="text-[11px] text-teal-800 leading-relaxed mt-0.5">
                Pursuant to institutional HR policy and data protection norms, this module presents aggregate days worked, attendance counts, and grade bands. Individual bank account numbers, PAN details, and tax deductions are strictly quarantined within the Chief Bursar vault.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Emp ID</th>
                    <th className="py-2.5 px-3">Staff Member</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-center">Cycle Days</th>
                    <th className="py-2.5 px-3 text-center">Present</th>
                    <th className="py-2.5 px-3 text-center">Approved Leaves</th>
                    <th className="py-2.5 px-3 text-center">Loss of Pay</th>
                    <th className="py-2.5 px-3 text-center">Net Payable Days</th>
                    <th className="py-2.5 px-3 text-right">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {teachers.map(t => {
                    const rec = staffAttendance.find(sa => sa.staffId === t.id);
                    const isLeave = rec?.status === 'on_leave' || t.employmentStatus === 'On Leave';
                    const paidLeaves = isLeave ? 1 : 0;
                    const present = isLeave ? 23 : 24;

                    return (
                      <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{t.empId}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{t.name}</td>
                        <td className="py-2.5 px-3">{t.department}</td>
                        <td className="py-2.5 px-3 text-center font-mono">24</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-700">{present}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-purple-700">{paidLeaves}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-400">0</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">24 / 24</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Verified Full Payout
                          </span>
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

      {/* ========================================================================= */}
      {/* MODULE 11: HR REPORTS (Section 7.12)                                      */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Institutional Human Resources Reports</h2>
              <p className="text-xs text-slate-500">Staff distribution audits, faculty qualification matrices, and recruitment reports</p>
            </div>
            <span className="text-xs font-mono text-slate-500">Official Directorate Analytics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Staff Headcount & Demographics Report',
                desc: 'Consolidated staff count broken down by teaching faculty, administrative, and support staff.',
                action: () => {
                  const csv = "Category,Headcount,Active,On Leave,Probation\n" +
                    `Teaching Faculty,${teachingCount},${teachingCount - 1},1,0\n` +
                    `Administrative Leadership,${adminCount},${adminCount},0,0\n` +
                    `Non-Teaching Support,${nonTeachingCount},${nonTeachingCount},0,0\n`;
                  handleExportCSV("GIS_Staff_Headcount_Report", csv);
                }
              },
              {
                title: 'Departmental Faculty Allocation Matrix',
                desc: 'Department-wise staffing allocations, HOD details, and weekly instructional workloads.',
                action: () => {
                  const csv = "Department,HOD,Staff Count,Total Weekly Workload Periods\n" +
                    departmentsList.map(d => `"${d.name}","${d.hodName}",${d.staffCount},${d.staffCount * 22}`).join("\n");
                  handleExportCSV("GIS_Departmental_Faculty_Allocation", csv);
                }
              },
              {
                title: 'Staff Biometric Attendance & Punctuality Audit',
                desc: 'Monthly biometric gate check-in rates, on-time arrivals, late gate occurrences, and compliance.',
                action: () => {
                  const csv = "Cycle Month,Total Working Days,Overall Attendance Rate,Late Arrivals\n" +
                    "October 2026,24,96.4%,2\n" +
                    "September 2026,25,95.8%,4\n" +
                    "August 2026,24,97.1%,1\n";
                  handleExportCSV("GIS_Staff_Punctuality_Audit", csv);
                }
              },
              {
                title: 'Recruitment & Candidate Pipeline Analytics',
                desc: 'Open positions, applicant pipeline by recruitment stage, and time-to-hire metrics.',
                action: () => {
                  const csv = "Position,Applied,Screening,Interview Scheduled,Offer Extended\n" +
                    "PGT Physics,1,0,1,0\n" +
                    "TGT English,1,1,0,0\n" +
                    "Primary Teacher (PRT),1,0,0,1\n" +
                    "Lab Assistant,1,1,0,0\n";
                  handleExportCSV("GIS_Recruitment_Pipeline_Report", csv);
                }
              }
            ].map((rep, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{rep.title}</h4>
                  <FileText className="w-4 h-4 text-teal-600" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rep.desc}</p>
                <button
                  onClick={rep.action}
                  className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report CSV</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 12: MY PROFILE (Section 7.1)                                       */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="space-y-6 max-w-2xl">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div
                className="w-14 h-14 rounded-2xl text-white font-bold text-xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: themeClasses.hex }}
              >
                AD
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Ms. Anita Desai</h3>
                <p className="text-xs text-slate-500">Director of Human Resources · Greenfield International School</p>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 inline-block mt-1">
                  Security Clearance Level 3 · Human Resources & Personnel
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Employee ID:</span>
                <span className="font-mono font-bold text-slate-900">HR-2017-009</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Qualifications:</span>
                <span className="text-slate-800 font-medium">MBA in Human Resources, SHRM-SCP Certified</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Official Email:</span>
                <span className="font-mono text-slate-800">hr@greenfield.edu</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Intercom / Direct Line:</span>
                <span className="font-mono text-slate-800">+91 20 2748 0002 (Ext. 102)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Statutory Compliance Oversight:</span>
                <span className="font-medium text-slate-900">CBSE Affiliation Bye-Laws & Labor Compliance</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LEAVE REVIEW & DECISION                                            */}
      {/* ========================================================================= */}
      {leaveReviewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Review Staff Leave Request</h3>
                <p className="text-xs text-slate-500">{leaveReviewModalItem.staffName}</p>
              </div>
              <button
                onClick={() => setLeaveReviewModalItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReviewLeaveSubmit} className="space-y-3.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Leave Type:</span>
                  <strong className="text-slate-900">{leaveReviewModalItem.leaveType}</strong>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-500">Duration:</span>
                  <span>{leaveReviewModalItem.startDate} &rarr; {leaveReviewModalItem.endDate} ({leaveReviewModalItem.daysCount} Days)</span>
                </div>
                <div className="pt-1 border-t border-slate-200 text-slate-600">
                  <span className="text-slate-400 block text-[10px]">Staff Reason:</span>
                  <p className="italic">"{leaveReviewModalItem.reason}"</p>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Administrative Decision</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLeaveReviewDecision('approved')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                      leaveReviewDecision === 'approved'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-600 ring-1 ring-emerald-600'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Approve Leave
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaveReviewDecision('rejected')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                      leaveReviewDecision === 'rejected'
                        ? 'bg-rose-50 text-rose-900 border-rose-600 ring-1 ring-rose-600'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Reject Request
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Reviewer Remarks {leaveReviewDecision === 'rejected' && <span className="text-rose-500">*</span>}
                </label>
                <textarea
                  rows={2}
                  required={leaveReviewDecision === 'rejected'}
                  placeholder={leaveReviewDecision === 'approved' ? 'Sanctioned. Substitute required for period 3.' : 'Explain reason for rejection...'}
                  value={leaveReviewRemarks}
                  onChange={e => setLeaveReviewRemarks(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setLeaveReviewModalItem(null)}
                  className="px-3.5 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 font-bold text-white rounded-xl shadow-2xs ${
                    leaveReviewDecision === 'approved' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-rose-700 hover:bg-rose-800'
                  }`}
                >
                  Confirm Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ASSIGN SUBSTITUTE TEACHER DUTY                                     */}
      {/* ========================================================================= */}
      {showAssignSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Assign Classroom Substitute Duty</h3>
              <button
                onClick={() => setShowAssignSubModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignSubSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Absent Faculty Member</label>
                <select
                  value={subAbsentTeacherId}
                  onChange={e => setSubAbsentTeacherId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  {teachers.slice(0, 8).map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={subDate}
                    onChange={e => setSubDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Period Number</label>
                  <select
                    value={subPeriod}
                    onChange={e => setSubPeriod(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6].map(p => (
                      <option key={p} value={p}>Period {p} (08:30–09:15)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Class & Section</label>
                  <div className="flex gap-1">
                    <select
                      value={subClass}
                      onChange={e => setSubClass(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                    >
                      {[5, 6, 7, 8, 9, 10].map(s => (
                        <option key={s} value={s}>Std {s}</option>
                      ))}
                    </select>
                    <select
                      value={subSection}
                      onChange={e => setSubSection(e.target.value as any)}
                      className="w-20 p-2 rounded-xl border border-slate-200 bg-white font-medium"
                    >
                      <option value="A">Sec A</option>
                      <option value="B">Sec B</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Room</label>
                  <input
                    type="text"
                    required
                    value={subRoom}
                    onChange={e => setSubRoom(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Designated Substitute Teacher</label>
                <select
                  value={subTeacherId}
                  onChange={e => setSubTeacherId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  {teachers.filter(t => t.id !== subAbsentTeacherId).map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cover Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Conduct silent reading / practical revision..."
                  value={subNotes}
                  onChange={e => setSubNotes(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignSubModal(false)}
                  className="px-3.5 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white rounded-xl shadow-2xs hover:opacity-95"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  Assign Substitute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD DEPARTMENT                                                     */}
      {/* ========================================================================= */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Academic Department</h3>
              <button
                onClick={() => setShowAddDeptModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDeptSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commerce & Economics"
                  value={newDeptName}
                  onChange={e => setNewDeptName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Designated Head of Department (HOD)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Raghavan Iyer"
                  value={newDeptHod}
                  onChange={e => setNewDeptHod(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Curricular Scope & Description</label>
                <textarea
                  rows={2}
                  placeholder="Senior secondary accountancy, economics, and business studies..."
                  value={newDeptDesc}
                  onChange={e => setNewDeptDesc(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-3.5 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white rounded-xl shadow-2xs hover:opacity-95"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTER EMPLOYMENT DOCUMENT METADATA                              */}
      {/* ========================================================================= */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Register Credential Metadata</h3>
              <button
                onClick={() => setShowAddDocModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDocSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Staff Member</label>
                <select
                  value={newDocStaffId}
                  onChange={e => setNewDocStaffId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.empId}) · {t.department}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Credential / Degree Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master of Science (Physics) Degree Certificate"
                  value={newDocTitle}
                  onChange={e => setNewDocTitle(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Document Category</label>
                <select
                  value={newDocCategory}
                  onChange={e => setNewDocCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Educational Degree">Educational Degree / Transcript</option>
                  <option value="Teacher Credential">Teacher Credential (B.Ed. / TET / NET)</option>
                  <option value="Identity Proof">Government ID (Aadhaar / Passport)</option>
                  <option value="Police Verification">Police Verification Certificate</option>
                  <option value="Contract">Signed Employment Appointment Letter</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-3.5 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white rounded-xl shadow-2xs hover:opacity-95"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  Register & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD RECRUITMENT CANDIDATE                                          */}
      {/* ========================================================================= */}
      {showAddCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Recruitment Candidate</h3>
              <button
                onClick={() => setShowAddCandidateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCandidateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Applicant Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Smita Gokhale"
                  value={newCandName}
                  onChange={e => setNewCandName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Position Applied</label>
                <select
                  value={newCandPosition}
                  onChange={e => setNewCandPosition(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="PGT Chemistry">PGT Chemistry (Senior Secondary)</option>
                  <option value="TGT English Literature">TGT English Literature</option>
                  <option value="Primary Teacher (PRT)">Primary Teacher (PRT All Subjects)</option>
                  <option value="Robotics & Lab Assistant">Robotics & Lab Assistant</option>
                  <option value="School Counselor">School Counselor & Psychologist</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Qualifications</label>
                  <input
                    type="text"
                    required
                    value={newCandQual}
                    onChange={e => setNewCandQual(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Experience</label>
                  <input
                    type="text"
                    required
                    value={newCandExp}
                    onChange={e => setNewCandExp(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="smita.g@mail.com"
                    value={newCandEmail}
                    onChange={e => setNewCandEmail(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98221 00999"
                    value={newCandPhone}
                    onChange={e => setNewCandPhone(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCandidateModal(false)}
                  className="px-3.5 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white rounded-xl shadow-2xs hover:opacity-95"
                  style={{ backgroundColor: themeClasses.hex }}
                >
                  Register Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS: STAFF FORM & PROFILE MODALS                                       */}
      {/* ========================================================================= */}
      {isAddStaffOpen && (
        <StaffFormModal isOpen={isAddStaffOpen} mode="create" onClose={() => setIsAddStaffOpen(false)} />
      )}
      {editingStaff && (
        <StaffFormModal
          isOpen={!!editingStaff}
          mode="edit"
          staffToEdit={editingStaff}
          onClose={() => setEditingStaff(null)}
        />
      )}
      {viewingStaff && (
        <StaffProfileModal
          isOpen={!!viewingStaff}
          staff={viewingStaff}
          onClose={() => setViewingStaff(null)}
          onEdit={(s: Teacher) => {
            setViewingStaff(null);
            setEditingStaff(s);
          }}
        />
      )}
    </div>
  );
};
