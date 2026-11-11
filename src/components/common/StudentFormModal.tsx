import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  GraduationCap,
  Users,
  FileText,
  AlertCircle,
  Check,
  Shield,
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Save,
  AlertTriangle
} from 'lucide-react';
import { Student, RoleType } from '../../types/school';
import { useSchool } from '../../context/SchoolContext';
import { getThemeClasses } from '../../utils/themeHelper';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  studentToEdit?: Student | null;
  onSaved?: (student: Student) => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  studentToEdit,
  onSaved
}) => {
  const {
    students,
    currentRole,
    themeColor,
    addStudent,
    updateStudent
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Active form section tab
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'guardian' | 'documents'>('personal');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male' as 'Male' | 'Female',
    dob: '2013-05-15',
    bloodGroup: 'O+',
    address: '',
    medicalAlerts: '',
    // Academic & Admission
    admissionNo: '',
    admissionDate: new Date().toISOString().split('T')[0],
    standard: 8,
    section: 'A' as 'A' | 'B',
    rollNo: 1,
    status: 'Active' as Student['status'],
    previousClass: '',
    // Guardian
    parentName: '',
    parentRelationship: 'Father' as 'Father' | 'Mother' | 'Legal Guardian',
    parentPhone: '',
    parentEmail: '',
    emergencyContact: '',
    secondaryGuardianName: '',
    secondaryGuardianRelationship: 'Mother',
    secondaryGuardianPhone: '',
    // Documents
    documentsSubmitted: ['Birth Certificate', 'Previous Academic Records'] as string[]
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusChangeWarning, setStatusChangeWarning] = useState<string | null>(null);

  // Available documents checklist
  const AVAILABLE_DOCUMENTS = [
    'Birth Certificate',
    'Previous Academic Records',
    'Transfer Certificate (TC)',
    'Immunization Card',
    'Address Proof',
    'Aadhaar / National ID',
    'Passport Copy',
    'Medical Clearance Form'
  ];

  // Role permissions evaluation
  const isPrincipal = currentRole === 'principal' || currentRole === 'admin';
  const isVicePrincipal = currentRole === 'vice_principal';
  const isReceptionist = currentRole === 'receptionist';
  const isAuthorized = isPrincipal || isVicePrincipal || isReceptionist;

  // Field editability based on role
  // Receptionist: can only edit guardian contacts, emergency phone, address, and add new admission enquiries/intake.
  // Vice Principal: can edit academic (standard, section, rollNo, status), cannot change admissionNo or fee status.
  // Principal: full access.
  const canEditAcademic = isPrincipal || isVicePrincipal || mode === 'create';
  const canEditAdmissionNo = isPrincipal || mode === 'create';
  const canEditPersonal = isPrincipal || isReceptionist || mode === 'create';
  const canEditGuardian = isPrincipal || isReceptionist || mode === 'create';
  const canEditStatus = isPrincipal || isVicePrincipal;

  // Initialize or reset form data when modal opens or studentToEdit changes
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setHasUnsavedChanges(false);
      setStatusChangeWarning(null);
      return;
    }

    if (mode === 'edit' && studentToEdit) {
      setFormData({
        name: studentToEdit.name || '',
        gender: studentToEdit.gender || 'Male',
        dob: studentToEdit.dob || '2013-05-15',
        bloodGroup: studentToEdit.bloodGroup || 'O+',
        address: studentToEdit.address || '',
        medicalAlerts: studentToEdit.medicalAlerts || '',
        admissionNo: studentToEdit.admissionNo || '',
        admissionDate: studentToEdit.admissionDate || new Date().toISOString().split('T')[0],
        standard: studentToEdit.standard || 8,
        section: studentToEdit.section || 'A',
        rollNo: studentToEdit.rollNo || 1,
        status: studentToEdit.status || 'Active',
        previousClass: studentToEdit.previousClass || '',
        parentName: studentToEdit.parentName || '',
        parentRelationship: studentToEdit.parentRelationship || 'Father',
        parentPhone: studentToEdit.parentPhone || '',
        parentEmail: studentToEdit.parentEmail || '',
        emergencyContact: studentToEdit.emergencyContact || '',
        secondaryGuardianName: studentToEdit.secondaryGuardianName || '',
        secondaryGuardianRelationship: studentToEdit.secondaryGuardianRelationship || 'Mother',
        secondaryGuardianPhone: studentToEdit.secondaryGuardianPhone || '',
        documentsSubmitted: studentToEdit.documentsSubmitted || ['Birth Certificate']
      });
      setHasUnsavedChanges(false);
    } else {
      // Auto-generate fresh unique admission number
      const nextNum = students.length + 101;
      const autoAdmissionNo = `GIS-2026-${String(nextNum).padStart(4, '0')}`;
      
      // Calculate next roll number for default Class 8-A
      const class8AStudents = students.filter(s => s.standard === 8 && s.section === 'A');
      const maxRoll = class8AStudents.reduce((max, s) => Math.max(max, s.rollNo), 0);

      setFormData({
        name: '',
        gender: 'Male',
        dob: '2013-05-15',
        bloodGroup: 'O+',
        address: 'Greenfield City, Sector 4',
        medicalAlerts: '',
        admissionNo: autoAdmissionNo,
        admissionDate: new Date().toISOString().split('T')[0],
        standard: 8,
        section: 'A',
        rollNo: maxRoll + 1,
        status: 'Active',
        previousClass: 'Class 7-A (Promoted)',
        parentName: '',
        parentRelationship: 'Father',
        parentPhone: '',
        parentEmail: '',
        emergencyContact: '',
        secondaryGuardianName: '',
        secondaryGuardianRelationship: 'Mother',
        secondaryGuardianPhone: '',
        documentsSubmitted: ['Birth Certificate', 'Previous Academic Records', 'Address Proof']
      });
      setHasUnsavedChanges(false);
    }
  }, [isOpen, mode, studentToEdit, students]);

  if (!isOpen) return null;

  // Track change
  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto warn on status change
      if (field === 'status' && mode === 'edit' && studentToEdit && value !== studentToEdit.status) {
        if (value === 'Withdrawn' || value === 'Transferred') {
          setStatusChangeWarning(`Marking student as ${value} will revoke class roster privileges and stop attendance roll-calls.`);
        } else {
          setStatusChangeWarning(null);
        }
      }

      return updated;
    });
    setHasUnsavedChanges(true);

    // Clear error for field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleDocument = (doc: string) => {
    setFormData(prev => {
      const exists = prev.documentsSubmitted.includes(doc);
      const updated = exists
        ? prev.documentsSubmitted.filter(d => d !== doc)
        : [...prev.documentsSubmitted, doc];
      return { ...prev, documentsSubmitted: updated };
    });
    setHasUnsavedChanges(true);
  };

  // Deep validation logic
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Personal
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Student name must have at least 2 characters.';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required.';
    } else {
      const birthYear = new Date(formData.dob).getFullYear();
      const currentYear = new Date().getFullYear();
      if (birthYear > currentYear - 3 || birthYear < currentYear - 20) {
        newErrors.dob = `Invalid birth date for school enrollment (must be between 3 and 20 years old).`;
      }
    }

    // 2. Admission & Academic
    if (!formData.admissionNo.trim()) {
      newErrors.admissionNo = 'Admission number is required.';
    } else {
      // Check uniqueness across other students
      const conflict = students.find(
        s => s.admissionNo.toLowerCase() === formData.admissionNo.trim().toLowerCase() &&
             (mode === 'create' || (studentToEdit && s.id !== studentToEdit.id))
      );
      if (conflict) {
        newErrors.admissionNo = `Admission No. "${formData.admissionNo}" is already assigned to ${conflict.name}.`;
      }
    }

    if (formData.standard < 1 || formData.standard > 10) {
      newErrors.standard = 'Standard must be between 1 and 10.';
    }

    if (!formData.section || !['A', 'B'].includes(formData.section)) {
      newErrors.section = 'Valid section (A or B) must be selected.';
    }

    if (!formData.rollNo || formData.rollNo < 1) {
      newErrors.rollNo = 'Roll number must be a positive integer.';
    } else {
      // Check duplicate roll number within the same standard and section
      const rollConflict = students.find(
        s => s.standard === formData.standard &&
             s.section === formData.section &&
             s.rollNo === Number(formData.rollNo) &&
             (mode === 'create' || (studentToEdit && s.id !== studentToEdit.id))
      );
      if (rollConflict) {
        newErrors.rollNo = `Roll #${formData.rollNo} is already occupied in Std ${formData.standard}-${formData.section} by ${rollConflict.name}.`;
      }
    }

    // 3. Parent / Guardian
    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Primary guardian full name is required.';
    }

    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = 'Parent contact phone number is required.';
    } else if (!/^[0-9+ -]{7,16}$/.test(formData.parentPhone.trim())) {
      newErrors.parentPhone = 'Enter a valid telephone or mobile number with digits.';
    }

    if (formData.parentEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail.trim())) {
      newErrors.parentEmail = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Emergency phone contact is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthorized) {
      setErrors({ form: 'Permission Denied: Your current role is not authorized to add or edit student records.' });
      return;
    }

    if (!validateForm()) {
      // Find which section has error to switch tab
      if (errors.name || errors.dob) setActiveTab('personal');
      else if (errors.admissionNo || errors.standard || errors.rollNo) setActiveTab('academic');
      else if (errors.parentName || errors.parentPhone || errors.emergencyContact || errors.parentEmail) setActiveTab('guardian');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        const studentPayload: Omit<Student, 'id' | 'status'> = {
          admissionNo: formData.admissionNo.trim(),
          name: formData.name.trim(),
          standard: Number(formData.standard),
          section: formData.section,
          rollNo: Number(formData.rollNo),
          gender: formData.gender,
          dob: formData.dob,
          admissionDate: formData.admissionDate,
          parentName: formData.parentName.trim(),
          parentRelationship: formData.parentRelationship,
          parentPhone: formData.parentPhone.trim(),
          parentEmail: formData.parentEmail.trim() || `parent.${formData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
          address: formData.address.trim() || 'Greenfield City',
          attendanceRate: 98,
          feeStatus: 'pending',
          bloodGroup: formData.bloodGroup,
          emergencyContact: formData.emergencyContact.trim(),
          secondaryGuardianName: formData.secondaryGuardianName.trim() || undefined,
          secondaryGuardianRelationship: formData.secondaryGuardianRelationship || undefined,
          secondaryGuardianPhone: formData.secondaryGuardianPhone.trim() || undefined,
          medicalAlerts: formData.medicalAlerts.trim() || undefined,
          previousClass: formData.previousClass.trim() || undefined,
          documentsSubmitted: formData.documentsSubmitted
        };

        addStudent(studentPayload);
      } else if (mode === 'edit' && studentToEdit) {
        // Prepare safe partial payload that preserves role boundaries
        const updatePayload: Partial<Student> = {
          name: formData.name.trim(),
          gender: formData.gender,
          dob: formData.dob,
          bloodGroup: formData.bloodGroup,
          address: formData.address.trim(),
          medicalAlerts: formData.medicalAlerts.trim() || undefined,
          parentName: formData.parentName.trim(),
          parentRelationship: formData.parentRelationship,
          parentPhone: formData.parentPhone.trim(),
          parentEmail: formData.parentEmail.trim(),
          emergencyContact: formData.emergencyContact.trim(),
          secondaryGuardianName: formData.secondaryGuardianName.trim() || undefined,
          secondaryGuardianRelationship: formData.secondaryGuardianRelationship || undefined,
          secondaryGuardianPhone: formData.secondaryGuardianPhone.trim() || undefined,
          documentsSubmitted: formData.documentsSubmitted
        };

        // Only allow academic changes if role permits
        if (canEditAcademic) {
          updatePayload.standard = Number(formData.standard);
          updatePayload.section = formData.section;
          updatePayload.rollNo = Number(formData.rollNo);
          updatePayload.previousClass = formData.previousClass.trim() || undefined;
        }

        if (canEditAdmissionNo) {
          updatePayload.admissionNo = formData.admissionNo.trim();
          updatePayload.admissionDate = formData.admissionDate;
        }

        if (canEditStatus) {
          updatePayload.status = formData.status;
        }

        updateStudent(studentToEdit.id, updatePayload);
      }

      setHasUnsavedChanges(false);
      onClose();
    } catch (err: any) {
      setErrors({ form: err?.message || 'An unexpected error occurred while saving the student record.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes in the student dossier. Discard changes and close?')) {
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
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {mode === 'create' ? 'Enroll New Student' : `Edit Student: ${studentToEdit?.name}`}
                </h3>
                {mode === 'edit' && studentToEdit && (
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    {studentToEdit.admissionNo}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Institutional Student Dossier Management · Greenfield International School
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Active role clearance pill */}
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              {isPrincipal ? 'Principal Access' : isVicePrincipal ? 'VP Academic Access' : isReceptionist ? 'Reception Desk' : 'Restricted Role'}
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

        {/* Status Change Warning */}
        {statusChangeWarning && (
          <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{statusChangeWarning}</span>
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
            1. Personal Details
            {(errors.name || errors.dob) && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'academic'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            2. Admission & Academic
            {(errors.admissionNo || errors.standard || errors.rollNo) && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guardian')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'guardian'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            3. Guardian & Emergency
            {(errors.parentName || errors.parentPhone || errors.emergencyContact || errors.parentEmail) && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            4. Documents & Health
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === 'personal' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Student Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!canEditPersonal}
                    placeholder="e.g. Aarav Sharma"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.name ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    disabled={!canEditPersonal}
                    value={formData.gender}
                    onChange={e => handleChange('gender', e.target.value as 'Male' | 'Female')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white disabled:bg-slate-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Date of Birth <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    disabled={!canEditPersonal}
                    value={formData.dob}
                    onChange={e => handleChange('dob', e.target.value)}
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.dob ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                    } font-mono disabled:bg-slate-100`}
                  />
                  {errors.dob && <p className="text-[11px] text-rose-600 mt-1">{errors.dob}</p>}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Blood Group
                  </label>
                  <select
                    disabled={!canEditPersonal}
                    value={formData.bloodGroup}
                    onChange={e => handleChange('bloodGroup', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-mono disabled:bg-slate-100"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  placeholder="Street, Building / House #, Sector, City"
                  value={formData.address}
                  onChange={e => handleChange('address', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Health & Medical Alerts / Allergies (Restricted Access)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mild asthmatic; peanut allergy; carries inhaler in backpack"
                  value={formData.medicalAlerts}
                  onChange={e => handleChange('medicalAlerts', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Disclosed strictly to School Infirmary and class teachers.</p>
              </div>
            </div>
          )}

          {/* TAB 2: ADMISSION & ACADEMIC */}
          {activeTab === 'academic' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Admission Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!canEditAdmissionNo}
                    placeholder="e.g. GIS-2026-0142"
                    value={formData.admissionNo}
                    onChange={e => handleChange('admissionNo', e.target.value)}
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.admissionNo ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                    } font-mono font-bold text-slate-900 disabled:bg-slate-100 disabled:text-slate-500`}
                  />
                  {errors.admissionNo && <p className="text-[11px] text-rose-600 mt-1">{errors.admissionNo}</p>}
                  {!canEditAdmissionNo && (
                    <p className="text-[11px] text-slate-400 mt-1">Official admission numbers can only be altered by Principal.</p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Admission Date
                  </label>
                  <input
                    type="date"
                    disabled={!canEditAdmissionNo}
                    value={formData.admissionDate}
                    onChange={e => handleChange('admissionDate', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Class / Standard <span className="text-rose-500">*</span>
                  </label>
                  <select
                    disabled={!canEditAcademic}
                    value={formData.standard}
                    onChange={e => handleChange('standard', Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold disabled:bg-slate-100"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                      <option key={s} value={s}>Standard {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Section <span className="text-rose-500">*</span>
                  </label>
                  <select
                    disabled={!canEditAcademic}
                    value={formData.section}
                    onChange={e => handleChange('section', e.target.value as 'A' | 'B')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold disabled:bg-slate-100"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Roll Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    disabled={!canEditAcademic}
                    value={formData.rollNo}
                    onChange={e => handleChange('rollNo', Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.rollNo ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                    } font-mono font-bold disabled:bg-slate-100`}
                  />
                  {errors.rollNo && <p className="text-[11px] text-rose-600 mt-1">{errors.rollNo}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Enrollment Status
                  </label>
                  <select
                    disabled={!canEditStatus}
                    value={formData.status}
                    onChange={e => handleChange('status', e.target.value as Student['status'])}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold disabled:bg-slate-100"
                  >
                    <option value="Active">Active (Currently Enrolled)</option>
                    <option value="Transferred">Transferred (Section/School Change)</option>
                    <option value="Withdrawn">Withdrawn (TC Issued)</option>
                    <option value="Graduated">Graduated (Alumni)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Previous Class / Institution
                  </label>
                  <input
                    type="text"
                    disabled={!canEditAcademic}
                    placeholder="e.g. Class 7-A (92% aggregate) or Delhi Public School"
                    value={formData.previousClass}
                    onChange={e => handleChange('previousClass', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 disabled:bg-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GUARDIAN & EMERGENCY */}
          {activeTab === 'guardian' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-2 text-blue-900">
                <Users className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Guardians linked here receive real-time SMS attendance alerts, examination mark notifications, and secure access to the SCHLAR Parent Portal.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Primary Guardian Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.parentName}
                    onChange={e => handleChange('parentName', e.target.value)}
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.parentName ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.parentName && <p className="text-[11px] text-rose-600 mt-1">{errors.parentName}</p>}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Guardian Relationship
                  </label>
                  <select
                    value={formData.parentRelationship}
                    onChange={e => handleChange('parentRelationship', e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Legal Guardian">Legal Guardian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Primary Phone (WhatsApp / SMS) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.parentPhone}
                      onChange={e => handleChange('parentPhone', e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                        errors.parentPhone ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                      } font-mono`}
                    />
                  </div>
                  {errors.parentPhone && <p className="text-[11px] text-rose-600 mt-1">{errors.parentPhone}</p>}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Primary Email
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      placeholder="guardian@example.com"
                      value={formData.parentEmail}
                      onChange={e => handleChange('parentEmail', e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                        errors.parentEmail ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.parentEmail && <p className="text-[11px] text-rose-600 mt-1">{errors.parentEmail}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Emergency Contact Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 00000"
                    value={formData.emergencyContact}
                    onChange={e => handleChange('emergencyContact', e.target.value)}
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.emergencyContact ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                    } font-mono`}
                  />
                  {errors.emergencyContact && <p className="text-[11px] text-rose-600 mt-1">{errors.emergencyContact}</p>}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Secondary Guardian / Authorized Pickup
                  </label>
                  <input
                    type="text"
                    placeholder="Secondary contact name & phone"
                    value={formData.secondaryGuardianName}
                    onChange={e => handleChange('secondaryGuardianName', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTS & HEALTH */}
          {activeTab === 'documents' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="font-semibold text-slate-800 block mb-2">
                  Mandatory & Supporting Admission Documents
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AVAILABLE_DOCUMENTS.map(doc => {
                    const isChecked = formData.documentsSubmitted.includes(doc);
                    return (
                      <button
                        type="button"
                        key={doc}
                        onClick={() => toggleDocument(doc)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <FileText className={`w-3.5 h-3.5 ${isChecked ? 'text-blue-700' : 'text-slate-400'}`} />
                          {doc}
                        </span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">CBSE Compliance Verification:</span>
                <p>
                  All submitted student records are retained in compliance with state education department guidelines and CBSE by-laws for a minimum of 10 academic years.
                </p>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400">
              {hasUnsavedChanges ? (
                <span className="text-amber-600 font-medium">⚠️ Unsaved changes in form</span>
              ) : (
                <span>All changes synchronized</span>
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
                  ? 'Saving Record...'
                  : mode === 'create'
                  ? 'Enroll Student'
                  : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
