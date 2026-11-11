import React, { useState } from 'react';
import {
  X,
  User,
  Briefcase,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Award,
  Phone,
  Mail,
  MapPin,
  Shield,
  ShieldCheck,
  Edit2,
  Printer,
  ArrowRightLeft,
  Layers,
  FileText,
  UserCheck
} from 'lucide-react';
import { Teacher, StaffLeaveRequest, SubstitutionAssignment } from '../../types/school';
import { useSchool } from '../../context/SchoolContext';
import { getThemeClasses } from '../../utils/themeHelper';

interface StaffProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Teacher | null;
  onEdit?: (staff: Teacher) => void;
  onAssignSubstitute?: (staff: Teacher) => void;
}

export const StaffProfileModal: React.FC<StaffProfileModalProps> = ({
  isOpen,
  onClose,
  staff,
  onEdit,
  onAssignSubstitute
}) => {
  const {
    currentRole,
    themeColor,
    timetables,
    leaveRequests,
    substitutions,
    showToast
  } = useSchool();

  const isTeaching = staff?.staffCategory === 'Teaching';
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'duties' | 'qualifications' | 'leaves' | 'personal'>('overview');
  const [isExporting, setIsExporting] = useState(false);

  // Set default tab when staff changes
  React.useEffect(() => {
    setActiveTab('overview');
  }, [staff?.id]);

  if (!isOpen || !staff) return null;

  const themeClasses = getThemeClasses(themeColor);

  const canEdit = currentRole === 'principal' || currentRole === 'admin' || currentRole === 'vice_principal' || currentRole === 'hr_manager';
  const isPrincipal = currentRole === 'principal' || currentRole === 'admin';

  // Timetable periods assigned to this teacher
  const assignedSlots = timetables.filter(slot => slot.teacherId === staff.id);

  // Staff leaves
  const staffLeaves = leaveRequests.filter(l => l.staffId === staff.id);

  // Substitutions involving this teacher
  const staffSubstitutions = substitutions.filter(
    s => s.originalTeacherId === staff.id || s.substituteTeacherId === staff.id
  );

  const handleSimulateExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast(`Personnel Dossier for ${staff.name} (${staff.empId}) exported.`, 'success');
    }, 850);
  };

  const workloadPercentage = staff.maxWeeklyWorkload > 0
    ? Math.round((staff.currentWeeklyWorkload / staff.maxWeeklyWorkload) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/90 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
              isTeaching
                ? 'bg-blue-600/30 border border-blue-400/40 text-blue-300'
                : 'bg-emerald-600/30 border border-emerald-400/40 text-emerald-300'
            }`}>
              {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{staff.name}</h2>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  {staff.empId}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                  isTeaching
                    ? 'bg-blue-900/60 text-blue-300 border border-blue-700'
                    : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                }`}>
                  {staff.staffCategory}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{staff.designation}</span>
                <span>·</span>
                <span>{staff.department}</span>
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
                  onEdit(staff);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
            )}

            <button
              onClick={handleSimulateExport}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              title="Print or export staff dossier"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
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

        {/* Highlights Ribbon */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Employment Status:</span>
              <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] uppercase ${
                staff.employmentStatus === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : staff.employmentStatus === 'On Leave'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {staff.employmentStatus}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Employment Type:</span>
              <span className="font-semibold text-slate-800 px-2 py-0.5 rounded bg-slate-200/70 text-[11px]">
                {staff.employmentType || 'Full-Time'}
              </span>
            </div>

            {isTeaching && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Workload:</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {staff.currentWeeklyWorkload} / {staff.maxWeeklyWorkload} periods/wk
                </span>
                <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${workloadPercentage > 90 ? 'bg-rose-500' : workloadPercentage > 75 ? 'bg-amber-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {staff.classTeacherOf && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Class Mentor:</span>
                <span className="font-bold text-blue-700 px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-[11px]">
                  Std {staff.classTeacherOf}
                </span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500">
            Joined: <span className="font-medium text-slate-700">{staff.joiningDate}</span> ({staff.experience})
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
            <Briefcase className="w-3.5 h-3.5" />
            <span>Professional Overview</span>
          </button>

          {isTeaching ? (
            <button
              onClick={() => setActiveTab('academics')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'academics'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Academic Allocations & Timetable</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('duties')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'duties'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Operations & Scope of Work</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('qualifications')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'qualifications'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Qualifications & Credentials</span>
          </button>

          <button
            onClick={() => setActiveTab('leaves')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'leaves'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Leaves & Substitutions ({staffLeaves.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('personal')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'personal'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Contact & Emergency</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Employment Details
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Employee ID:</span>
                      <span className="font-bold font-mono text-slate-900">{staff.empId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Designation:</span>
                      <span className="font-semibold text-slate-800">{staff.designation}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Department:</span>
                      <span className="font-semibold text-slate-800">{staff.department}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Staff Category:</span>
                      <span className="font-medium text-slate-800">{staff.staffCategory}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Employment Type:</span>
                      <span className="font-medium text-slate-800">{staff.employmentType || 'Full-Time Permanent'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Date of Joining:</span>
                      <span className="font-medium text-slate-800 font-mono">{staff.joiningDate}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Reporting & Work Station
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Reporting Officer:</span>
                      <span className="font-semibold text-slate-800">
                        {staff.reportingManager || 'Dr. Evelyn Montgomery (Principal)'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Campus Location:</span>
                      <span className="font-medium text-slate-800">
                        {staff.workLocation || 'Main Campus — Faculty Wing Block A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Official Email:</span>
                      <a href={`mailto:${staff.email}`} className="font-mono text-blue-600 hover:underline">
                        {staff.email}
                      </a>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Work Phone:</span>
                      <span className="font-mono text-slate-800">{staff.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC ALLOCATIONS (TEACHING STAFF) */}
          {activeTab === 'academics' && isTeaching && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase">Subjects Taught</div>
                  <div className="text-base font-bold text-slate-900">
                    {staff.subjects && staff.subjects.length > 0 ? staff.subjects.join(', ') : 'Not Allocated'}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">Department of {staff.department}</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase">Classes Assigned</div>
                  <div className="text-base font-bold text-slate-900">
                    {staff.classesAssigned && staff.classesAssigned.length > 0
                      ? staff.classesAssigned.map(c => `Std ${c}`).join(', ')
                      : 'None'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {staff.classTeacherOf ? `Class Teacher: Std ${staff.classTeacherOf}` : 'Subject Instructor'}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <div className="text-[11px] text-slate-500 font-semibold uppercase">Workload Capacity</div>
                  <div className="text-2xl font-bold text-slate-900 font-mono">
                    {staff.currentWeeklyWorkload} / {staff.maxWeeklyWorkload}
                  </div>
                  <div className="text-xs text-slate-500">
                    {workloadPercentage}% weekly period quota utilized
                  </div>
                </div>
              </div>

              {/* Master Timetable Slots for this teacher */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Weekly Teaching Timetable ({assignedSlots.length} Scheduled Slots)
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">Academic Year 2026–2027</span>
                </div>

                {assignedSlots.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Day</th>
                          <th className="py-2.5 px-3">Period</th>
                          <th className="py-2.5 px-3">Time</th>
                          <th className="py-2.5 px-3">Class</th>
                          <th className="py-2.5 px-3">Subject</th>
                          <th className="py-2.5 px-3">Room</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {assignedSlots.map((slot) => (
                          <tr key={slot.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{slot.day}</td>
                            <td className="py-2.5 px-3 font-mono font-bold">P{slot.period}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-500">{slot.time}</td>
                            <td className="py-2.5 px-3 font-semibold text-blue-700">Std {slot.standard}-{slot.section}</td>
                            <td className="py-2.5 px-3 font-medium text-slate-800">{slot.subject}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-600">{slot.room}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                    No individual timetable periods currently assigned.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DUTIES & SCOPE (NON-TEACHING STAFF) */}
          {activeTab === 'duties' && !isTeaching && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Department Operational Responsibilities</h4>
                    <p className="text-xs text-slate-500">{staff.department} Operations</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-700">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed">
                    <p className="font-semibold text-slate-900 mb-1">Assigned Operational Scope:</p>
                    {staff.jobResponsibilities ||
                      `${staff.designation} duties in the ${staff.department} unit, supporting institutional administration, registry records, and school governance compliance.`}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                      <span className="text-[11px] text-slate-400 font-semibold uppercase">Daily Shift Timings</span>
                      <p className="font-bold text-slate-900">08:00 AM – 04:30 PM (Mon–Fri)</p>
                      <p className="text-[11px] text-slate-500">Includes front coverage during student drop-off.</p>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                      <span className="text-[11px] text-slate-400 font-semibold uppercase">Assigned Work Station</span>
                      <p className="font-bold text-slate-900">{staff.workLocation || 'Administration Block, Desk #3'}</p>
                      <p className="text-[11px] text-slate-500">Terminal with institutional clearance credentials.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUALIFICATIONS */}
          {activeTab === 'qualifications' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Academic Degrees & Professional Certifications
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40 space-y-1">
                    <div className="font-bold text-blue-900 text-sm">{staff.qualification}</div>
                    <div className="text-slate-600">Total Teaching/Work Experience: <strong>{staff.experience}</strong></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                      <span className="text-[11px] text-slate-400 font-semibold uppercase">Board / Verification</span>
                      <p className="font-semibold text-slate-900">CBSE Affiliation Standards Compliant</p>
                      <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Credentials Verified by HR
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                      <span className="text-[11px] text-slate-400 font-semibold uppercase">Professional Certifications</span>
                      <p className="font-semibold text-slate-900">
                        {staff.certifications ? staff.certifications.join(', ') : 'State Board of Education Credential'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEAVES & SUBSTITUTIONS */}
          {activeTab === 'leaves' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Leave Applications & Absences</h4>
                  <p className="text-xs text-slate-500">Official leave register for {staff.name}</p>
                </div>
                {isTeaching && staff.employmentStatus === 'On Leave' && onAssignSubstitute && (
                  <button
                    onClick={() => {
                      onClose();
                      onAssignSubstitute(staff);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-sm"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Assign Substitute</span>
                  </button>
                )}
              </div>

              {staffLeaves.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Leave Type</th>
                        <th className="py-2.5 px-3">Duration</th>
                        <th className="py-2.5 px-3">Days</th>
                        <th className="py-2.5 px-3">Reason</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Review Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {staffLeaves.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{l.leaveType}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{l.startDate} &rarr; {l.endDate}</td>
                          <td className="py-2.5 px-3 font-mono font-bold">{l.daysCount} d</td>
                          <td className="py-2.5 px-3 text-slate-700 max-w-[200px] truncate">{l.reason}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              l.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : l.status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {l.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 italic max-w-[200px] truncate">
                            {l.reviewRemarks || 'Under leadership review'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                  No leave requests recorded for this employee in the current academic term.
                </div>
              )}

              {/* Substitutions list if teaching staff */}
              {isTeaching && staffSubstitutions.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Substitution Coverage Records
                  </h4>
                  <div className="space-y-2">
                    {staffSubstitutions.map(sub => (
                      <div key={sub.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-900">
                            {sub.originalTeacherId === staff.id ? `Covered by ${sub.substituteTeacherName}` : `Covered for ${sub.originalTeacherName}`}
                          </span>
                          <span className="text-slate-500 ml-2">({sub.date} · Period {sub.period} · {sub.subject})</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-semibold uppercase">
                          {sub.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PERSONAL & EMERGENCY */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Confidential Contact Information
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Primary Phone:
                    </span>
                    <a href={`tel:${staff.phone}`} className="font-mono font-semibold text-blue-600 hover:underline">
                      {staff.phone}
                    </a>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> Official Email:
                    </span>
                    <a href={`mailto:${staff.email}`} className="font-mono text-blue-600 hover:underline">
                      {staff.email}
                    </a>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Emergency Contact:
                    </span>
                    <span className="font-mono text-slate-800">
                      {staff.emergencyContact || '+91 98111 00000 (Spouse/Family)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Residential Address:
                    </span>
                    <span className="font-medium text-slate-800 text-right max-w-[220px]">
                      Greenfield City, Faculty Quarters Block C
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
            Personnel Key: {staff.id} · Department of {staff.department}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {canEdit && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(staff);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors shadow-sm`}
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Personnel File</span>
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
    </div>
  );
};
