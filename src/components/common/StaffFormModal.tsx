import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Briefcase,
  BookOpen,
  Shield,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  AlertTriangle,
  Check,
  Save,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import { Teacher, RoleType } from '../../types/school';
import { useSchool } from '../../context/SchoolContext';
import { getThemeClasses } from '../../utils/themeHelper';

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  staffToEdit?: Teacher | null;
  defaultCategory?: Teacher['staffCategory'];
  onSaved?: (staff: Teacher) => void;
}

export const StaffFormModal: React.FC<StaffFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  staffToEdit,
  defaultCategory = 'Teaching',
  onSaved
}) => {
  const {
    teachers,
    timetables,
    currentRole,
    themeColor,
    addTeacher,
    updateTeacher
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Tabs
  const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'teaching' | 'account'>('personal');

  // Form State
  const [formData, setFormData] = useState({
    empId: '',
    name: '',
    phone: '',
    email: '',
    emergencyContact: '',
    address: 'Greenfield City',
    // Employment
    designation: 'Faculty',
    department: 'Mathematics',
    staffCategory: defaultCategory,
    employmentType: 'Full-Time' as 'Full-Time' | 'Part-Time' | 'Contract' | 'Probation',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentStatus: 'Active' as Teacher['employmentStatus'],
    reportingManager: 'Dr. Evelyn Montgomery (Principal)',
    workLocation: 'Main Campus - Academic Wing A',
    qualification: 'M.Sc., B.Ed.',
    experience: '6 Years',
    // Teaching Specific
    subjects: 'Mathematics',
    classesAssigned: '8-A, 8-B',
    classTeacherOf: '',
    maxWeeklyWorkload: 26,
    // General Staff Specific
    jobResponsibilities: 'Instruction, classroom curriculum execution, continuous student evaluation.',
    certifications: 'CBSE Secondary Teacher Certification'
  });

  // Validation & Warnings
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consequenceWarning, setConsequenceWarning] = useState<string | null>(null);

  // Check role authorization: Only Principal or Vice Principal can add/edit staff
  const isPrincipal = currentRole === 'principal' || currentRole === 'admin';
  const isVicePrincipal = currentRole === 'vice_principal';
  const isHRManager = currentRole === 'hr_manager';
  const isAuthorized = isPrincipal || isVicePrincipal || isHRManager;

  // Calculate existing timetable periods assigned to this staff member
  const assignedPeriods = staffToEdit
    ? timetables.filter(s => s.teacherId === staffToEdit.id)
    : [];

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setHasUnsavedChanges(false);
      setConsequenceWarning(null);
      return;
    }

    if (mode === 'edit' && staffToEdit) {
      setFormData({
        empId: staffToEdit.empId || '',
        name: staffToEdit.name || '',
        phone: staffToEdit.phone || '',
        email: staffToEdit.email || '',
        emergencyContact: staffToEdit.emergencyContact || '',
        address: 'Greenfield City',
        designation: staffToEdit.designation || 'Faculty',
        department: staffToEdit.department || 'Mathematics',
        staffCategory: staffToEdit.staffCategory || defaultCategory,
        employmentType: staffToEdit.employmentType || 'Full-Time',
        joiningDate: staffToEdit.joiningDate || new Date().toISOString().split('T')[0],
        employmentStatus: staffToEdit.employmentStatus || 'Active',
        reportingManager: staffToEdit.reportingManager || (staffToEdit.staffCategory === 'Teaching' ? 'Prof. Marcus Vance (VP Academic)' : 'Dr. Evelyn Montgomery (Principal)'),
        workLocation: staffToEdit.workLocation || 'Main Campus',
        qualification: staffToEdit.qualification || '',
        experience: staffToEdit.experience || '',
        subjects: staffToEdit.subjects ? staffToEdit.subjects.join(', ') : '',
        classesAssigned: staffToEdit.classesAssigned ? staffToEdit.classesAssigned.join(', ') : '',
        classTeacherOf: staffToEdit.classTeacherOf || '',
        maxWeeklyWorkload: staffToEdit.maxWeeklyWorkload || 26,
        jobResponsibilities: staffToEdit.jobResponsibilities || 'Instructional and academic duties.',
        certifications: staffToEdit.certifications ? staffToEdit.certifications.join(', ') : ''
      });
      setHasUnsavedChanges(false);
    } else {
      // Auto-generate fresh unique employee ID
      const prefix = defaultCategory === 'Teaching' ? 'TCH' : defaultCategory === 'Administrative' ? 'ADM' : 'STF';
      const nextNum = teachers.length + 110;
      const autoEmpId = `${prefix}-2026-${String(nextNum).padStart(3, '0')}`;

      setFormData({
        empId: autoEmpId,
        name: '',
        phone: '+91 98765 00000',
        email: '',
        emergencyContact: '+91 98765 99999',
        address: 'Greenfield City',
        designation: defaultCategory === 'Teaching' ? 'Faculty' : defaultCategory === 'Administrative' ? 'Coordinator' : 'Staff Executive',
        department: defaultCategory === 'Teaching' ? 'Mathematics' : 'Front Desk & Operations',
        staffCategory: defaultCategory,
        employmentType: 'Full-Time',
        joiningDate: new Date().toISOString().split('T')[0],
        employmentStatus: 'Active',
        reportingManager: 'Prof. Marcus Vance (VP Academic)',
        workLocation: 'Main Campus',
        qualification: 'M.Sc., B.Ed.',
        experience: '5 Years',
        subjects: defaultCategory === 'Teaching' ? 'Mathematics' : '',
        classesAssigned: defaultCategory === 'Teaching' ? '8-A, 8-B' : '',
        classTeacherOf: '',
        maxWeeklyWorkload: defaultCategory === 'Teaching' ? 26 : 0,
        jobResponsibilities: defaultCategory === 'Teaching' ? 'Curriculum instruction, assignment grading, and attendance.' : 'General operations and student service support.',
        certifications: 'Standard Institutional Accreditation'
      });
      setHasUnsavedChanges(false);
    }
  }, [isOpen, mode, staffToEdit, defaultCategory, teachers]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Consequence checking when status changes
      if (field === 'employmentStatus' && mode === 'edit' && staffToEdit && value !== 'Active') {
        const warnings: string[] = [];
        if (assignedPeriods.length > 0) {
          warnings.push(`This staff member has ${assignedPeriods.length} active timetable periods assigned across classes.`);
        }
        if (staffToEdit.classTeacherOf) {
          warnings.push(`Currently serves as Class Teacher for Class ${staffToEdit.classTeacherOf}. An acting class teacher will need to be designated.`);
        }
        setConsequenceWarning(warnings.length > 0 ? warnings.join(' ') : null);
      } else if (field === 'employmentStatus' && value === 'Active') {
        setConsequenceWarning(null);
      }

      // If category changes to Non-Teaching, adjust workload
      if (field === 'staffCategory' && value === 'Non-Teaching') {
        updated.maxWeeklyWorkload = 0;
      } else if (field === 'staffCategory' && value === 'Teaching' && updated.maxWeeklyWorkload === 0) {
        updated.maxWeeklyWorkload = 26;
      }

      return updated;
    });

    setHasUnsavedChanges(true);

    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Personal & ID
    if (!formData.name.trim()) {
      newErrors.name = 'Full staff name is required.';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    }

    if (!formData.empId.trim()) {
      newErrors.empId = 'Staff / Employee ID is required.';
    } else {
      const conflict = teachers.find(
        t => t.empId.toLowerCase() === formData.empId.trim().toLowerCase() &&
             (mode === 'create' || (staffToEdit && t.id !== staffToEdit.id))
      );
      if (conflict) {
        newErrors.empId = `Staff ID "${formData.empId}" is already held by ${conflict.name}.`;
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact telephone is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Official work email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format (e.g. name@greenfield.edu).';
    }

    // 2. Employment
    if (!formData.designation.trim()) {
      newErrors.designation = 'Official designation is required.';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required.';
    }

    // 3. Teaching specific
    if (formData.staffCategory === 'Teaching') {
      if (!formData.subjects.trim()) {
        newErrors.subjects = 'Teaching faculty must have at least one assigned subject.';
      }

      if (Number(formData.maxWeeklyWorkload) < 1 || Number(formData.maxWeeklyWorkload) > 36) {
        newErrors.maxWeeklyWorkload = 'Workload limit must be between 1 and 36 periods per week.';
      }

      // Check if lowering workload below currently assigned timetable slots
      if (mode === 'edit' && assignedPeriods.length > Number(formData.maxWeeklyWorkload)) {
        newErrors.maxWeeklyWorkload = `Workload cannot be set below currently assigned periods (${assignedPeriods.length} active periods in timetable).`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthorized) {
      setErrors({ form: 'Permission Denied: Only School Leadership (Principal / Vice Principal) can add or edit staff members.' });
      return;
    }

    if (!validateForm()) {
      if (errors.name || errors.empId || errors.phone || errors.email) setActiveTab('personal');
      else if (errors.designation || errors.department) setActiveTab('employment');
      else if (errors.subjects || errors.maxWeeklyWorkload) setActiveTab('teaching');
      return;
    }

    setIsSubmitting(true);

    try {
      const subjectsArray = formData.subjects ? formData.subjects.split(',').map(s => s.trim()).filter(Boolean) : [];
      const classesArray = formData.classesAssigned ? formData.classesAssigned.split(',').map(c => c.trim()).filter(Boolean) : [];
      const certsArray = formData.certifications ? formData.certifications.split(',').map(c => c.trim()).filter(Boolean) : [];

      if (mode === 'create') {
        const payload: Omit<Teacher, 'id' | 'currentWeeklyWorkload'> = {
          empId: formData.empId.trim(),
          name: formData.name.trim(),
          designation: formData.designation.trim(),
          department: formData.department.trim(),
          staffCategory: formData.staffCategory,
          qualification: formData.qualification.trim(),
          experience: formData.experience.trim(),
          joiningDate: formData.joiningDate,
          employmentStatus: formData.employmentStatus,
          subjects: subjectsArray,
          classesAssigned: classesArray,
          classTeacherOf: formData.classTeacherOf.trim() || undefined,
          maxWeeklyWorkload: Number(formData.maxWeeklyWorkload) || 0,
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          emergencyContact: formData.emergencyContact.trim() || undefined,
          employmentType: formData.employmentType,
          workLocation: formData.workLocation.trim(),
          reportingManager: formData.reportingManager.trim(),
          jobResponsibilities: formData.jobResponsibilities.trim(),
          certifications: certsArray
        };

        addTeacher(payload);
      } else if (mode === 'edit' && staffToEdit) {
        const updatePayload: Partial<Teacher> = {
          empId: formData.empId.trim(),
          name: formData.name.trim(),
          designation: formData.designation.trim(),
          department: formData.department.trim(),
          staffCategory: formData.staffCategory,
          qualification: formData.qualification.trim(),
          experience: formData.experience.trim(),
          joiningDate: formData.joiningDate,
          employmentStatus: formData.employmentStatus,
          subjects: subjectsArray,
          classesAssigned: classesArray,
          classTeacherOf: formData.classTeacherOf.trim() || undefined,
          maxWeeklyWorkload: Number(formData.maxWeeklyWorkload) || 0,
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          emergencyContact: formData.emergencyContact.trim() || undefined,
          employmentType: formData.employmentType,
          workLocation: formData.workLocation.trim(),
          reportingManager: formData.reportingManager.trim(),
          jobResponsibilities: formData.jobResponsibilities.trim(),
          certifications: certsArray
        };

        updateTeacher(staffToEdit.id, updatePayload);
      }

      setHasUnsavedChanges(false);
      onClose();
    } catch (err: any) {
      setErrors({ form: err?.message || 'Error saving staff record.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes in the staff profile. Discard changes and close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${themeClasses.primaryBg} text-white flex items-center justify-center font-bold shadow-md`}>
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {mode === 'create'
                    ? formData.staffCategory === 'Teaching'
                      ? 'Appoint New Teaching Faculty'
                      : 'Register New Staff Member'
                    : `Edit Staff Profile: ${staffToEdit?.name}`}
                </h3>
                {mode === 'edit' && staffToEdit && (
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    {staffToEdit.empId}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Institutional Staff & Faculty HR Management · Greenfield International School
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              {isPrincipal ? 'Principal Authority' : 'VP Academic Oversight'}
            </span>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {errors.form && (
          <div className="p-3 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Consequence Warning */}
        {consequenceWarning && (
          <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{consequenceWarning}</span>
          </div>
        )}

        {/* Section Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 px-5 bg-white shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'personal'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            1. Personal & Contact
            {(errors.name || errors.empId || errors.phone || errors.email) && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('employment')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'employment'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            2. Employment & Role
            {(errors.designation || errors.department) && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
          </button>

          {formData.staffCategory === 'Teaching' ? (
            <button
              type="button"
              onClick={() => setActiveTab('teaching')}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'teaching'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              3. Teaching & Workload
              {(errors.subjects || errors.maxWeeklyWorkload) && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('teaching')}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'teaching'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              3. Operational Duties
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'account'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            4. Access & Permissions
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* TAB 1: PERSONAL & CONTACT */}
          {activeTab === 'personal' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Employee / Staff ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TCH-2026-118"
                    value={formData.empId}
                    onChange={e => handleChange('empId', e.target.value)}
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.empId ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                    } font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.empId && <p className="text-[11px] text-rose-600 mt-1">{errors.empId}</p>}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Full Name & Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Harish Chandra"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.name ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Official Work Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="first.last@greenfield.edu"
                      value={formData.email}
                      onChange={e => handleChange('email', e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                        errors.email ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Primary Telephone <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                        errors.phone ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                      } font-mono`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Emergency Contact Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={formData.emergencyContact}
                    onChange={e => handleChange('emergencyContact', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => handleChange('address', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMPLOYMENT & ROLE */}
          {activeTab === 'employment' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Staff Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.staffCategory}
                    onChange={e => handleChange('staffCategory', e.target.value as Teacher['staffCategory'])}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    <option value="Teaching">Teaching Faculty</option>
                    <option value="Non-Teaching">Non-Teaching Staff</option>
                    <option value="Administrative">Administrative Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={e => handleChange('department', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English & Literature">English & Literature</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Computer Science & AI">Computer Science & AI</option>
                    <option value="Hindi & Sanskrit">Hindi & Sanskrit</option>
                    <option value="Sports & Athletics">Sports & Athletics</option>
                    <option value="Fine Arts & Craft">Fine Arts & Craft</option>
                    <option value="Front Desk & Reception">Front Desk & Reception</option>
                    <option value="Library Sciences">Library Sciences</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="School Leadership">School Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Official Designation <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Faculty / Executive"
                    value={formData.designation}
                    onChange={e => handleChange('designation', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                  {errors.designation && <p className="text-[11px] text-rose-600 mt-1">{errors.designation}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Employment Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.employmentStatus}
                    onChange={e => handleChange('employmentStatus', e.target.value as Teacher['employmentStatus'])}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
                  >
                    <option value="Active">Active Duty</option>
                    <option value="On Leave">On Leave (Sanctioned)</option>
                    <option value="Inactive">Inactive / Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Employment Type
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={e => handleChange('employmentType', e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Full-Time">Full-Time Regular</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contractual (Annual)</option>
                    <option value="Probation">Probationary Period</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={e => handleChange('joiningDate', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Academic Qualifications & Degrees
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. M.Sc. Physics, B.Ed., CTET Certified"
                    value={formData.qualification}
                    onChange={e => handleChange('qualification', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Teaching / Professional Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8 Years"
                    value={formData.experience}
                    onChange={e => handleChange('experience', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Reporting Manager
                  </label>
                  <input
                    type="text"
                    value={formData.reportingManager}
                    onChange={e => handleChange('reportingManager', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Work Location / Room
                  </label>
                  <input
                    type="text"
                    value={formData.workLocation}
                    onChange={e => handleChange('workLocation', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEACHING OR OPERATIONAL DUTIES */}
          {activeTab === 'teaching' && (
            <div className="space-y-4 animate-in fade-in">
              {formData.staffCategory === 'Teaching' ? (
                <>
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2 text-emerald-900">
                    <BookOpen className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Academic Teaching Allocations</p>
                      <p className="text-[11px] text-emerald-800">
                        Assigned classes dictate which classrooms Mrs./Mr. {formData.name || 'this faculty'} can mark roll calls for in SCHLAR Web & Mobile portals.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Assigned Subjects (comma-separated) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mathematics, Vedic Math, Statistics"
                      value={formData.subjects}
                      onChange={e => handleChange('subjects', e.target.value)}
                      className={`w-full p-2.5 rounded-xl border ${
                        errors.subjects ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                      }`}
                    />
                    {errors.subjects && <p className="text-[11px] text-rose-600 mt-1">{errors.subjects}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Assigned Classes (e.g. 8-A, 8-B, 9-B)
                      </label>
                      <input
                        type="text"
                        placeholder="8-A, 8-B, 9-A"
                        value={formData.classesAssigned}
                        onChange={e => handleChange('classesAssigned', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Class Teacher Responsibility
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 8-A (or leave blank)"
                        value={formData.classTeacherOf}
                        onChange={e => handleChange('classTeacherOf', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Max Weekly Workload Limit (Periods / Week)
                      </label>
                      <div className="relative">
                        <Clock className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="number"
                          min={1}
                          max={36}
                          value={formData.maxWeeklyWorkload}
                          onChange={e => handleChange('maxWeeklyWorkload', Number(e.target.value))}
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                            errors.maxWeeklyWorkload ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                          } font-mono font-bold`}
                        />
                      </div>
                      {errors.maxWeeklyWorkload && <p className="text-[11px] text-rose-600 mt-1">{errors.maxWeeklyWorkload}</p>}
                      <p className="text-[11px] text-slate-400 mt-1">Default CBSE limit: 26 periods per week.</p>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Current Timetable Allotment
                      </label>
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700 flex justify-between items-center">
                        <span>Active Slots in Schedule:</span>
                        <strong className="text-slate-900 font-bold">{assignedPeriods.length} Periods</strong>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl flex items-start gap-2 text-purple-900">
                    <Award className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Operational Non-Teaching Responsibilities</p>
                      <p className="text-[11px] text-purple-800">
                        Staff members in Front Desk, Library, and Bursar/Accounts have specialized operations bounded strictly to their department.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Key Job Responsibilities & Operational Duties
                    </label>
                    <textarea
                      rows={3}
                      value={formData.jobResponsibilities}
                      onChange={e => handleChange('jobResponsibilities', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Professional Certifications & Registrations
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UGC-NET Library Science, First Aid Certified, Tally ERP Certification"
                      value={formData.certifications}
                      onChange={e => handleChange('certifications', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 4: ACCESS & PERMISSIONS */}
          {activeTab === 'account' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Shield className="w-4 h-4 text-blue-700" />
                  <span>Institutional RBAC Zero-Trust Enforcement</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  In SCHLAR, appointing or updating a staff record does <strong>not</strong> grant arbitrary administrative or financial clearance. Permissions are bound to verified roles:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <strong className="text-slate-800 block">Teaching Faculty</strong>
                    <span className="text-slate-500">Classroll access only for assigned sections. Cannot change admission IDs or financial fees.</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <strong className="text-slate-800 block">General Staff</strong>
                    <span className="text-slate-500">Front desk, library, or support roles cannot alter student grades or official master schedules.</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  <strong>Account Provisioning Note:</strong> Software credentials are sent securely to the employee's official work email (<code>{formData.email || 'first.last@greenfield.edu'}</code>) following Principal HR endorsement.
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400">
              {hasUnsavedChanges ? (
                <span className="text-amber-600 font-medium">⚠️ Unsaved changes in staff profile</span>
              ) : (
                <span>All modifications synchronized</span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isAuthorized}
                className={`flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} shadow-md active:scale-95 disabled:opacity-50 transition-all`}
              >
                <Save className="w-4 h-4" />
                {isSubmitting
                  ? 'Saving Staff...'
                  : mode === 'create'
                  ? 'Appoint Staff'
                  : 'Save Updates'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
