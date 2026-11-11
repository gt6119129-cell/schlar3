export type PlatformType = 'web' | 'mobile';

export type RoleType =
  // 10 Approved Roles (with Teacher & Parent dual platforms)
  | 'admin'             // 1. Admin (Principal / School Governance)
  | 'principal'         // Backward-compatible alias for admin
  | 'vice_principal'    // 2. Vice Principal (Academic Dean)
  | 'teacher_web'       // 3. Teacher — Web Portal
  | 'teacher_mobile'    // 3. Teacher — Mobile App
  | 'parent_web'        // 4. Parent — Web Portal
  | 'parent_mobile'     // 4. Parent — Mobile App
  | 'accountant'        // 5. Accountant / Fee Manager
  | 'hr_manager'        // 6. HR / Staff Manager
  | 'librarian'         // 7. Librarian
  | 'transport_manager' // 8. Transport Manager
  | 'receptionist'      // 9. Receptionist / Front Office
  | 'exam_coordinator'; // 10. Exam Coordinator

export type TopLevelRoleChoice =
  | 'admin'
  | 'vice_principal'
  | 'teacher'
  | 'parent'
  | 'accountant'
  | 'hr_manager'
  | 'librarian'
  | 'transport_manager'
  | 'receptionist'
  | 'exam_coordinator';

export type ThemeColor =
  | 'palette_1'
  | 'palette_2'
  | 'palette_3'
  | 'palette_4'
  | 'palette_5'
  | 'palette_6'
  | 'palette_7'
  | 'palette_8'
  | 'palette_9'
  | 'palette_10'
  | 'palette_11'
  | 'palette_12'
  | 'navy'
  | 'slate'
  | 'emerald'
  | 'indigo'
  | 'amber'
  | 'rose'
  | 'custom'
  | string;

export interface ThemeConfig {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  lightBg: string;
  border: string;
  ring: string;
  badge: string;
  accentText: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  name: string;
  standard: number; // 1 to 10
  section: 'A' | 'B';
  rollNo: number;
  gender: 'Male' | 'Female';
  dob: string;
  admissionDate: string;
  status: 'Active' | 'Transferred' | 'Withdrawn' | 'Graduated';
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  attendanceRate: number; // percentage
  feeStatus: 'paid' | 'pending' | 'overdue';
  bloodGroup: string;
  emergencyContact: string;
  previousClass?: string;
  documentsSubmitted: string[];
  // Extended fields for guardian & health
  parentRelationship?: 'Father' | 'Mother' | 'Legal Guardian';
  guardianName?: string;
  guardianPhone?: string;
  secondaryGuardianName?: string;
  secondaryGuardianPhone?: string;
  secondaryGuardianRelationship?: string;
  medicalAlerts?: string;
  profilePhoto?: string;
  transportRoute?: string;
}

export interface Teacher {
  id: string;
  empId: string;
  name: string;
  designation: string;
  department: string;
  staffCategory: 'Teaching' | 'Non-Teaching' | 'Administrative';
  qualification: string;
  experience: string;
  joiningDate: string;
  employmentStatus: 'Active' | 'On Leave' | 'Inactive';
  subjects: string[];
  classesAssigned: string[]; // e.g., ["8-A", "8-B", "9-B"]
  classTeacherOf?: string; // e.g., "8-A"
  maxWeeklyWorkload: number; // max periods (default 26)
  currentWeeklyWorkload: number;
  phone: string;
  email: string;
  emergencyContact?: string;
  // Extended fields for general staff & employment tracking
  employmentType?: 'Full-Time' | 'Part-Time' | 'Contract' | 'Probation';
  workLocation?: string;
  reportingManager?: string;
  jobResponsibilities?: string;
  certifications?: string[];
  profilePhoto?: string;
  linkedUserAccountId?: string;
}

export type StaffMember = Teacher;

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  standard: number;
  section: 'A' | 'B';
  studentId: string;
  studentName: string;
  rollNo: number;
  status: 'present' | 'absent' | 'late' | 'excused' | 'half_day' | 'not_marked';
  session?: 'morning' | 'afternoon' | 'full_day' | string;
  period?: number;
  arrivalTime?: string; // e.g. "08:42"
  departureTime?: string; // e.g. "13:30"
  remarks?: string;
  markedBy?: string;
  academicYear?: string;
  term?: string;
  isDraft?: boolean;
}

export interface MarkCorrectionAudit {
  oldMarks: number;
  newMarks: number;
  oldStatus?: string;
  newStatus?: string;
  reason: string;
  changedBy: string;
  timestamp: string;
}

export interface MarkRecord {
  id: string;
  examId?: string;
  examName: string;
  assessmentId?: string;
  studentId: string;
  studentName: string;
  rollNo?: number;
  admissionNo?: string;
  standard: number;
  section: 'A' | 'B';
  subject: string;
  subjectCode?: string;
  writtenMarks?: number | null;
  practicalMarks?: number | null;
  internalMarks?: number | null;
  marksObtained: number;
  maxMarks: number;
  percentage?: number;
  grade: string;
  status: 'not_entered' | 'entered' | 'absent' | 'exempt' | 'draft' | 'submitted' | 'under_review' | 'endorsed' | 'approved' | 'published';
  isAbsent?: boolean;
  isExempt?: boolean;
  teacherRemarks?: string;
  remarks?: string;
  teacherId?: string;
  teacherName?: string;
  lastUpdated?: string;
  history?: MarkCorrectionAudit[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNo: number;
  admissionNo?: string;
  submittedDate: string;
  status: 'submitted' | 'late' | 'graded' | 'pending';
  marksObtained?: number;
  maxMarks?: number;
  grade?: string;
  teacherFeedback?: string;
  attachmentName?: string;
}

export interface Assignment {
  id: string;
  title: string;
  standard: number;
  section: 'A' | 'B';
  subject: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  submissionCount: number;
  totalStudents: number;
  teacherId?: string;
  teacherName: string;
  maxMarks?: number;
  attachmentName?: string;
  attachmentSize?: string;
  status: 'draft' | 'published' | 'closed' | 'archived';
}

export interface TimetableSlot {
  id: string;
  standard: number;
  section: 'A' | 'B' | 'C' | string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number; // 1 to 8
  time: string;
  subject: string;
  subjectCode?: string;
  teacherId?: string;
  teacherName: string;
  room: string;
  isBreak?: boolean;
  academicYear?: string;
  term?: string;
  notes?: string;
  status?: 'draft' | 'published';
}

export interface TimetableConflict {
  id: string;
  type: 'teacher_double_booked' | 'room_clash' | 'class_clash' | 'workload_exceeded' | 'unavailable' | 'duplicate_entry';
  severity: 'blocking' | 'warning';
  day: string;
  period: number;
  time: string;
  entityName: string; // teacher name, class or room
  description: string;
  resolutionSuggestion: string;
  slotIds?: string[];
}

export interface TimetableVersion {
  id: string;
  academicYear: string;
  term: string;
  status: 'draft' | 'under_review' | 'published' | 'superseded';
  publishedAt?: string;
  publishedBy?: string;
  conflictsCount: number;
  versionNo?: string;
  notes?: string;
}

export interface AcademicTerm {
  id: string;
  name: string; // e.g., "Term 1", "Term 2", "Term 3"
  code: string; // e.g., "T1", "T2"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  examStartDate?: string;
  examEndDate?: string;
  isCurrent?: boolean;
  status: 'active' | 'upcoming' | 'completed';
}

export interface AcademicYear {
  id: string;
  name: string; // e.g., "2026–2027"
  code: string; // e.g., "AY-2026-27"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: 'active' | 'upcoming' | 'archived';
  terms: AcademicTerm[];
  totalWorkingDays: number;
  description?: string;
  examinationWindowsCount?: number;
}

export interface SectionEntity {
  id: string;
  classId: string;
  standard: number;
  section: string; // "A", "B", "C"
  name: string; // e.g. "8-A"
  classTeacherId?: string;
  classTeacherName?: string;
  room: string;
  capacity: number;
  enrolledCount: number;
  status: 'active' | 'archived';
}

export interface ClassEntity {
  id: string;
  standard: number;
  name: string; // e.g. "Standard 8"
  code: string; // e.g. "STD-08"
  wing: 'Primary Wing' | 'Middle Wing' | 'Secondary Wing' | 'Senior Secondary';
  academicYear: string;
  coordinatorId?: string;
  coordinatorName?: string;
  sections: SectionEntity[];
  status: 'active' | 'archived';
}

export interface SubjectEntity {
  id: string;
  name: string; // "Mathematics", "Science (Physics)"
  code: string; // "MATH-08", "SCI-PHY"
  category: 'Core Academic' | 'Science & Tech' | 'Languages' | 'Social Sciences' | 'Arts & Co-Curricular' | 'Physical Education';
  applicableStandards: number[]; // e.g. [6, 7, 8, 9, 10]
  weeklyPeriodsRequired: number; // e.g. 5
  description?: string;
  status: 'active' | 'inactive';
}

export interface SubjectAllocation {
  id: string;
  academicYear: string;
  standard: number;
  section: string; // "A", "B"
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  teacherId?: string;
  teacherName?: string;
  weeklyPeriods: number;
  room?: string;
  status: 'assigned' | 'unassigned';
}

export interface PeriodDefinition {
  id: string;
  periodNumber: number;
  name: string; // "Period 1", "Morning Assembly", "Recess", "Lunch Break"
  startTime: string; // "08:30"
  endTime: string; // "09:15"
  type: 'lesson' | 'break' | 'lunch' | 'assembly';
  displayOrder: number;
  isActive: boolean;
  applicableDays: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[];
}

export interface TimetableRevision {
  id: string;
  versionNo: string; // "v2.1", "v2.0"
  academicYear: string;
  term: string;
  status: 'draft' | 'under_review' | 'published' | 'superseded';
  createdAt: string;
  createdBy: string;
  publishedAt?: string;
  publishedBy?: string;
  notes?: string;
  slotsCount: number;
  conflictsCount: number;
}

export interface ClassroomRoom {
  id: string;
  roomNumber: string; // "Room 204", "Physics Lab 1"
  wing: string; // "West Wing", "Science Block"
  floor: string; // "1st Floor", "Ground Floor"
  type: 'Classroom' | 'Science Lab' | 'Computer Lab' | 'Library' | 'Art Studio' | 'Auditorium' | 'Sports Field';
  capacity: number;
}

export interface StaffLeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  leaveType: 'Casual Leave' | 'Sick Leave' | 'Academic / Duty Leave' | 'Maternity / Paternity';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedAt: string;
  reviewedBy?: string;
  reviewRemarks?: string;
  affectedPeriodsCount: number;
  attachmentName?: string;
  attachmentSize?: string;
  cancelledAt?: string;
}

export interface SubstitutionAssignment {
  id: string;
  leaveRequestId: string;
  originalTeacherId: string;
  originalTeacherName: string;
  substituteTeacherId: string;
  substituteTeacherName: string;
  date: string;
  day: string;
  period: number;
  time: string;
  standard: number;
  section: 'A' | 'B';
  subject: string;
  room: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  empId: string;
  department: string;
  staffCategory: 'Teaching' | 'Non-Teaching' | 'Administrative';
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
  checkInTime?: string; // e.g. "07:55 AM"
  checkOutTime?: string; // e.g. "03:45 PM"
  remarks?: string;
  markedBy?: string;
  leaveRequestId?: string;
  leaveType?: string;
}

export interface StudentMovementRecord {
  id: string;
  passNo: string; // e.g. "GP-2026-104"
  studentId: string;
  studentName: string;
  standard: number;
  section: 'A' | 'B';
  type: 'late_arrival' | 'early_departure' | 'temporary_pass';
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:15 AM"
  reason: string;
  category: 'Medical' | 'Family Emergency' | 'Transport Delay' | 'School Event' | 'Disciplinary' | 'Other';
  authorizedBy: string;
  pickupPersonName?: string;
  pickupPersonPhone?: string;
  pickupRelationship?: string;
  linkedAttendanceId?: string;
  status: 'recorded' | 'approved' | 'cancelled';
  createdAt: string;
}

export interface AttendanceCorrectionRequest {
  id: string;
  attendanceRecordId?: string;
  studentId: string;
  studentName: string;
  standard: number;
  section: 'A' | 'B';
  date: string;
  session: string;
  originalStatus: 'present' | 'absent' | 'late' | 'excused' | 'half_day' | 'not_marked';
  requestedStatus: 'present' | 'absent' | 'late' | 'excused' | 'half_day';
  reason: string;
  requestedByRole: RoleType;
  requestedByName: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewDecisionDate?: string;
  reviewRemarks?: string;
}

export interface AttendanceSessionEntity {
  id: string; // e.g. "8-A-2026-10-14-morning"
  standard: number;
  section: 'A' | 'B';
  date: string;
  session: string;
  status: 'draft' | 'submitted';
  submittedBy?: string;
  submittedAt?: string;
  lastSavedAt: string;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  halfDayCount: number;
  unmarkedCount: number;
  totalStudents: number;
}

export interface AttendanceSettingsConfig {
  lateCutoffTime: string; // "08:45"
  warningAttendancePercent: number; // 75
  healthyAttendancePercent: number; // 90
  allowTeacherDraftSave: boolean;
  requireRemarkForAbsence: boolean;
  enableHalfDay: boolean;
  enableExcusedAbsence: boolean;
  attendanceRateFormula: 'cbse_standard' | 'strict_present_only';
  defaultAttendanceMode: 'daily_sessions' | 'period_based';
}

export interface FeePayment {
  id: string;
  invoiceId: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  amountPaid: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash' | 'Cheque';
  chequeNo?: string;
  transactionRef?: string;
  paymentDate: string;
  collectedBy: string;
  notes?: string;
}

export interface FeeInvoice {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  standard: number;
  section: 'A' | 'B';
  feeType: 'Tuition Fee' | 'Term Fee' | 'Lab & Library' | 'Transport' | 'Annual Activity' | 'Composite Annual Fee' | 'Examination Fee';
  amount: number;
  paidAmount?: number;
  remainingBalance?: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paidDate?: string;
  paymentMethod?: 'UPI' | 'Card' | 'NetBanking' | 'Cash' | 'Cheque';
  receiptNo?: string;
  referenceNo?: string;
  academicYear?: string;
  term?: string;
  concessionApplied?: number;
  concessionType?: string;
  receiptNumbers?: string[];
  installments?: FeePayment[];
}

export interface FeeStructureComponent {
  id: string;
  name: 'Tuition Fee' | 'Laboratory & Computer' | 'School Transport' | 'Sports & Co-Curricular' | 'Annual Development' | 'Examination Fee' | 'Library & Learning';
  term: 'Term 1' | 'Term 2' | 'Annual' | 'Monthly';
  amount: number;
  mandatory: boolean;
}

export interface FeeStructureItem {
  id: string;
  tierName: string;
  wingName: 'Primary Wing' | 'Junior Wing' | 'Middle Wing' | 'Secondary Wing' | 'Senior Secondary Wing';
  applicableStandards: number[];
  academicYear: string;
  components: FeeStructureComponent[];
  totalAnnualAmount: number;
  dueDateTerm1: string;
  dueDateTerm2: string;
  status: 'active' | 'draft' | 'archived';
}

export interface FeeConcession {
  id: string;
  concessionNo: string;
  studentId: string;
  studentName: string;
  standard: number;
  section: 'A' | 'B';
  concessionType: 'Merit Scholarship' | 'Sibling Discount' | 'Staff Ward Concession' | 'EWS / Need-Based Waiver' | 'Sports & Arts Excellence' | 'Special Management Discretion';
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 25% or ₹10000
  appliedComponent: 'Tuition Fee' | 'Composite Annual Fee' | 'Transport' | 'Total Fees';
  calculatedDeduction: number;
  validAcademicYear: string;
  status: 'active' | 'revoked' | 'pending_approval';
  approvedBy: string;
  approvedDate: string;
  reason: string;
  certificateRef?: string;
}

export interface ExpenseRecord {
  id: string;
  voucherNo: string;
  category: 'Faculty & Staff Salaries' | 'Campus Infrastructure & Utilities' | 'Science & Computer Labs' | 'Library & Learning Resources' | 'Sports & Co-Curricular' | 'Administration & Compliance' | 'School Transport & Fleet' | 'Repairs & Facility Maintenance';
  vendorName: string;
  description: string;
  amount: number;
  expenseDate: string;
  paymentMethod: 'NetBanking' | 'Cheque' | 'UPI' | 'Cash';
  chequeOrRefNo: string;
  invoiceBillNo: string;
  status: 'approved' | 'pending_approval' | 'rejected';
  recordedBy: string;
  approvedBy?: string;
  approvedDate?: string;
  receiptAttachment?: string;
  fiscalQuarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  notes?: string;
}

export interface BudgetCategory {
  id: string;
  categoryName: ExpenseRecord['category'];
  academicYear: string;
  allocatedAmount: number;
  spentAmount: number;
  committedAmount: number;
  alertThresholdPct: number; // e.g. 85%
  departmentHead: string;
  fiscalQuarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Full Year';
}

export interface FinancialDaybookEntry {
  id: string;
  timestamp: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  referenceNo: string; // Receipt No or Voucher No
  partyName: string; // Student or Vendor
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash' | 'Cheque';
  debitAmount: number; // Outflow (Expense)
  creditAmount: number; // Inflow (Fee)
  runningBalance: number;
  recordedBy: string;
  narration: string;
}

export type VisitorCategory = 
  | 'Parent / Guardian' 
  | 'Prospective Parent' 
  | 'Vendor / Supplier' 
  | 'Delivery Personnel' 
  | 'Guest / Speaker' 
  | 'Service Provider' 
  | 'Former Student' 
  | 'Other';

export interface VisitorEntry {
  id: string;
  passNo: string;
  name: string;
  phone: string;
  category?: VisitorCategory;
  organization?: string;
  email?: string;
  purpose: string;
  meetingWith: string;
  department?: string;
  appointmentRef?: string;
  visitorsCount?: number;
  vehicleNo?: string;
  notes?: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  idProof: string;
  status: 'inside' | 'completed';
}

export type EnquirySource = 'Walk-in' | 'Phone' | 'Website' | 'Referral' | 'School Event' | 'Email' | 'Other';
export type EnquiryStatus = 'new' | 'contacted' | 'admitted' | 'closed' | 'followup_required' | 'visit_scheduled' | 'info_shared' | 'converted';

export interface EnquiryFollowUp {
  id: string;
  date: string;
  note: string;
  staff: string;
  nextFollowUpDate?: string;
}

export interface AdmissionEnquiry {
  id: string;
  enquiryNo: string;
  candidateName: string;
  standardApplying: number;
  parentName: string;
  phone: string;
  email: string;
  date: string;
  source?: EnquirySource;
  academicYear?: string;
  assignedStaff?: string;
  status: EnquiryStatus;
  notes: string;
  followUpDate: string;
  documentsProvided: string[];
  followUpNotes?: EnquiryFollowUp[];
  convertedLeadId?: string;
  admittedStudentId?: string;
}

export interface LibraryBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  locationRack: string;
  publisher: string;
  edition?: string;
  publicationYear?: number;
  language?: string;
  description?: string;
  status?: 'active' | 'archived';
}

export interface BookIssue {
  id: string;
  issueNo: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  memberRole: 'Student' | 'Teacher';
  issuedDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  fineAmount: number;
  copyBarcode?: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Academic' | 'Exam' | 'Holiday' | 'Fee' | 'General';
  audience: 'all' | 'teachers' | 'parents' | 'admin';
  date: string;
  content: string;
  author: string;
  priority: 'normal' | 'high' | 'urgent';
  status: 'draft' | 'published';
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'Sports' | 'Cultural' | 'Academic' | 'Meeting';
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  receiverId: string;
  receiverName: string;
  timestamp: string;
  text: string;
  isRead: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorRole: string;
  actorName: string;
  action: string;
  module: string;
  entityId?: string;
  details: string;
}

export interface StudentTransferRecord {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  fromClass: string;
  toClass: string;
  effectiveDate: string;
  reason: string;
  authorizedBy: string;
}

export interface StudentPromotionPreview {
  studentId: string;
  studentName: string;
  currentStandard: number;
  currentSection: 'A' | 'B';
  proposedStandard: number;
  proposedSection: 'A' | 'B';
  academicAverage: number;
  attendanceRate: number;
  decision: 'Promote' | 'Retain' | 'Graduate';
  status: 'pending' | 'confirmed';
}

export interface AttendanceDiscrepancyRequest {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  reportedStatus: 'present' | 'absent' | 'late';
  parentClaim: 'present' | 'excused';
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
  submittedAt: string;
  reviewedBy?: string;
  responseNote?: string;
}

export interface StudentInfoChangeRequest {
  id: string;
  studentId: string;
  studentName: string;
  requestType: 'Address Update' | 'Emergency Contact' | 'Health / Allergy Note' | 'Spelling Correction';
  requestedChanges: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewRemarks?: string;
}

export interface RoleMeta {
  id: RoleType;
  title: string;
  subtitle: string;
  platform: PlatformType;
  description: string;
  modules: string[];
  demoUser: {
    name: string;
    designation: string;
    email: string;
  };
  iconName: string;
}

export interface PermissionRule {
  module: string;
  role: RoleType;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canSubmit: boolean;
  canApprove: boolean;
  canPublish: boolean;
  canArchive: boolean;
  canExport: boolean;
  scope: 'school_wide' | 'assigned_records' | 'linked_child' | 'finance_only' | 'front_office' | 'library_only';
  notes?: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
}

export interface Examination {
  id: string;
  name: string;
  academicYear: string;
  term: string;
  applicableClasses: Array<{ standard: number; section: 'A' | 'B' }>;
  startDate: string;
  endDate: string;
  status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'results_pending' | 'results_approved' | 'published' | 'archived';
  instructions?: string;
  publishedAt?: string;
  publishedBy?: string;
  totalAssessmentsCount?: number;
  completedAssessmentsCount?: number;
  notes?: string;
}

export interface ExamScheduleSlot {
  id: string;
  examId: string;
  examName: string;
  date: string;
  standard: number;
  section: 'A' | 'B';
  subjectId: string;
  subject: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  room: string;
  examinerTeacherId: string;
  examinerTeacherName: string;
  status: 'draft' | 'published' | 'completed';
  instructions?: string;
}

export interface SubjectAssessmentConfig {
  id: string;
  examId: string;
  examName: string;
  standard: number;
  section: 'A' | 'B';
  subjectId: string;
  subject: string;
  maxWritten: number;
  maxPractical?: number;
  maxInternal?: number;
  totalMax: number;
  passingMarks: number;
  examDate: string;
  assignedTeacherId: string;
  assignedTeacherName: string;
  marksEntryStatus: 'not_started' | 'draft' | 'submitted' | 'under_review' | 'returned_for_correction' | 'approved' | 'published';
  submittedAt?: string;
  submittedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  totalStudents?: number;
  enteredCount?: number;
  absentCount?: number;
  exemptCount?: number;
}

export interface GradingScaleBoundary {
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  gradePoint: number;
  description: string;
  isPassing: boolean;
}

export interface GradingScaleConfig {
  id: string;
  name: string;
  boundaries: GradingScaleBoundary[];
}

export interface AssessmentSettingsConfig {
  passingPercentage: number;
  minAttendanceRequiredForExam: number;
  allowGraceMarks: boolean;
  maxGraceMarks: number;
  requireDualModeration: boolean;
  publishDiscrepancyWindowDays: number;
}

export interface ReportCardSubjectRow {
  subject: string;
  subjectCode?: string;
  maxWritten: number;
  writtenObtained: number | null;
  maxPractical: number;
  practicalObtained: number | null;
  maxInternal: number;
  internalObtained: number | null;
  totalMax: number;
  totalObtained: number | null;
  percentage: number | null;
  grade: string;
  status: 'passed' | 'failed' | 'absent' | 'exempt' | 'incomplete';
  teacherRemarks?: string;
}

export interface ReportCardData {
  studentId: string;
  studentName: string;
  rollNo: number;
  admissionNo: string;
  standard: number;
  section: 'A' | 'B';
  examId: string;
  examName: string;
  academicYear: string;
  term: string;
  subjects: ReportCardSubjectRow[];
  totalMaxMarks: number;
  totalMarksObtained: number;
  overallPercentage: number;
  overallGrade: string;
  resultStatus: 'Passed' | 'Failed' | 'Incomplete' | 'Essential Repeat';
  rank?: number;
  attendancePresent: number;
  attendanceTotal: number;
  attendancePercentage: number;
  generalRemarks: string;
  conductRating: 'A+' | 'A' | 'B+' | 'B';
  publishedDate: string;
  endorsedBy: string;
}

// ==========================================
// LIBRARY MANAGEMENT DOMAIN TYPES
// ==========================================

export interface LibraryBookCopy {
  id: string; // e.g. "cpy-01-1"
  bookId: string; // e.g. "bk-01"
  barcode: string; // e.g. "BC-0104-01"
  shelfRack: string;
  status: 'Available' | 'Issued' | 'Reserved' | 'Lost' | 'Damaged' | 'Archived';
  currentBorrowerId?: string;
  currentBorrowerName?: string;
  currentBorrowerRole?: 'Student' | 'Teacher';
  currentIssueId?: string;
  acquisitionDate: string;
  condition: 'Mint' | 'Good' | 'Fair' | 'Worn' | 'Damaged';
  notes?: string;
}

export interface BookReservation {
  id: string;
  reservationNo: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  memberRole: 'Student' | 'Teacher';
  reservationDate: string;
  queuePosition: number;
  status: 'active' | 'fulfilled' | 'cancelled' | 'expired';
  notifiedAt?: string;
  notes?: string;
}

export interface LostDamagedBookRecord {
  id: string;
  incidentNo: string;
  bookId: string;
  bookTitle: string;
  copyBarcode: string;
  memberId?: string;
  memberName?: string;
  memberRole?: 'Student' | 'Teacher';
  type: 'Lost' | 'Damaged';
  dateReported: string;
  description: string;
  assessedCost: number;
  fineStatus: 'waived' | 'pending' | 'cleared';
  recordedBy: string;
  status: 'investigating' | 'confirmed' | 'written_off' | 'repaired';
  resolutionNotes?: string;
}

export interface LibraryTransaction {
  id: string;
  txnNo: string;
  timestamp: string;
  type: 'ISSUE' | 'RETURN' | 'RESERVATION' | 'DAMAGE_RECORDED' | 'LOST_RECORDED' | 'FINE_COLLECTED' | 'COPY_ADDED';
  bookTitle: string;
  copyBarcode?: string;
  memberId: string;
  memberName: string;
  memberRole: 'Student' | 'Teacher';
  dueDate?: string;
  returnCondition?: string;
  fineAmount?: number;
  recordedBy: string;
  notes?: string;
}

// ==========================================
// TRANSPORT MANAGEMENT DOMAIN TYPES
// ==========================================

export interface TransportVehicle {
  id: string;
  vehicleNo: string; // e.g. "DL-01-TA-4820"
  vehicleCode: string; // e.g. "BUS-01"
  type: 'Standard 45-Seater Bus' | 'Mini Bus 30-Seater' | 'Van 18-Seater' | 'Electric Shuttle 24-Seater';
  makeModel: string;
  capacity: number;
  assignedRouteId?: string;
  assignedRouteCode?: string;
  primaryDriverId?: string;
  primaryDriverName?: string;
  status: 'Active' | 'Under Maintenance' | 'Inactive';
  insuranceExpiry: string;
  fitnessExpiry: string;
  pucExpiry: string;
  speedGovernorCert: string;
  fuelType: 'Diesel' | 'CNG' | 'Electric';
  lastServiceDate?: string;
  notes?: string;
}

export interface TransportDriver {
  id: string;
  staffId?: string;
  name: string;
  role: 'Lead Bus Driver' | 'Relief Driver' | 'Bus Conductor' | 'Transit Attendant';
  phone: string;
  emergencyPhone: string;
  licenseNo: string;
  licenseExpiry: string;
  assignedVehicleId?: string;
  assignedVehicleNo?: string;
  assignedRouteCode?: string;
  status: 'Active' | 'On Leave' | 'Off-Duty';
  joiningDate: string;
  badgeNumber: string;
  bloodGroup: string;
  experienceYears: number;
}

export interface TransportStop {
  id: string;
  routeId: string;
  stopName: string;
  areaLandmark: string;
  morningPickupTime: string;
  eveningDropTime: string;
  sequence: number;
  status: 'active' | 'inactive';
}

export interface TransportRoute {
  id: string;
  routeCode: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  assignedVehicleId: string;
  assignedVehicleNo: string;
  driverName: string;
  driverPhone: string;
  conductorName: string;
  capacity: number;
  assignedStudentsCount: number;
  morningDeparture: string;
  eveningArrival: string;
  status: 'Active' | 'Under Maintenance' | 'Suspended';
  operatingDays: string;
  stops: TransportStop[];
}

export interface StudentTransportAssignment {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  standard: number;
  section: 'A' | 'B';
  routeId: string;
  routeCode: string;
  pickupStopId: string;
  pickupStopName: string;
  dropStopId: string;
  dropStopName: string;
  guardianName: string;
  guardianPhone: string;
  effectiveFrom: string;
  status: 'active' | 'suspended' | 'cancelled';
  annualFeePaid: boolean;
}

export interface VehicleMaintenanceRecord {
  id: string;
  maintenanceNo: string;
  vehicleId: string;
  vehicleNo: string;
  maintenanceType: 'Routine 10,000 km Service' | 'Brake & Tire Overhaul' | 'Annual Fitness Inspection' | 'Air Conditioning Service' | 'Emergency Repair';
  serviceDate: string;
  nextDueDate: string;
  serviceCenter: string;
  cost: number;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  odometerReading: number;
  workDescription: string;
  technicianNotes?: string;
  authorizedBy: string;
}

export interface TransportIncident {
  id: string;
  incidentRef: string;
  dateTime: string;
  routeCode: string;
  vehicleNo: string;
  category: 'Traffic Delay' | 'Mechanical Breakdown' | 'Minor Tire Puncture' | 'Weather Diversion' | 'Student Medical Care' | 'Route Detour';
  description: string;
  delayMinutes: number;
  status: 'Investigating' | 'Resolved' | 'Action Taken';
  actionTakenNotes: string;
  reportedBy: string;
  affectedStudentsCount: number;
}

export interface TransportAnnouncement {
  id: string;
  broadcastNo: string;
  title: string;
  message: string;
  targetAudience: 'all_routes' | 'specific_route';
  targetRouteCode?: string;
  publishDate: string;
  priority: 'normal' | 'high' | 'urgent';
  status: 'published' | 'draft';
  createdBy: string;
}

// ==========================================
// FRONT OFFICE / RECEPTIONIST DOMAIN TYPES
// ==========================================

export interface ReceptionAppointment {
  id: string;
  appointmentNo: string; // e.g. "APT-2026-104"
  visitorName: string;
  visitorPhone: string;
  visitorCategory: VisitorCategory;
  organization?: string;
  staffId: string;
  staffName: string;
  department: string;
  purpose: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "10:30 AM"
  endTime: string; // "11:00 AM"
  status: 'scheduled' | 'checked_in' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  linkedVisitorPass?: string;
  createdAt: string;
  createdBy: string;
}

export interface PhoneCallLog {
  id: string;
  callNo: string; // e.g. "CAL-2026-089"
  dateTime: string; // e.g. "2026-10-14 10:15 AM"
  date: string; // YYYY-MM-DD
  type: 'incoming' | 'outgoing';
  callerName: string;
  callerPhone: string;
  callerCategory: 'Parent' | 'Prospective Parent' | 'Vendor' | 'Education Board' | 'General' | 'Staff';
  relatedStudentName?: string;
  relatedStudentId?: string;
  purpose: string;
  summary: string;
  assignedStaff?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  status: 'logged' | 'pending_followup' | 'resolved';
  recordedBy: string;
}

export type ReceptionRequestCategory = 
  | 'Teacher Meeting' 
  | 'Department Contact' 
  | 'Document Enquiry' 
  | 'Parent Complaint' 
  | 'Lost & Found' 
  | 'Campus Maintenance' 
  | 'General';

export type ReceptionRequestPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ReceptionRequestStatus = 'New' | 'Assigned' | 'In Progress' | 'Waiting Response' | 'Resolved' | 'Closed';

export interface ReceptionRequest {
  id: string;
  ticketNo: string; // e.g. "REQ-2026-042"
  date: string;
  category: ReceptionRequestCategory;
  requesterName: string;
  requesterPhone: string;
  requesterRole: 'Parent' | 'Visitor' | 'Staff' | 'Student';
  studentReference?: string;
  summary: string;
  description: string;
  assignedDepartment: 'Academic' | 'Accounts' | 'Transport' | 'Administration' | 'Examination' | 'Front Office';
  assignedStaff?: string;
  priority: ReceptionRequestPriority;
  status: ReceptionRequestStatus;
  resolutionNotes?: string;
  resolvedAt?: string;
}

export type FrontOfficeDocType = 
  | 'Bonafide Certificate' 
  | 'Transfer Certificate Enquiry' 
  | 'Study Certificate' 
  | 'Fee Receipt Copy' 
  | 'Character Certificate' 
  | 'General Request';

export type FrontOfficeDocStatus = 
  | 'Submitted' 
  | 'Under Review' 
  | 'Referred to Department' 
  | 'Ready for Collection' 
  | 'Completed' 
  | 'Rejected';

export interface FrontOfficeDocumentRequest {
  id: string;
  requestNo: string; // e.g. "DOC-2026-015"
  requesterName: string;
  requesterPhone: string;
  studentId: string;
  studentName: string;
  standard: number;
  section: 'A' | 'B';
  documentType: FrontOfficeDocType;
  requestDate: string;
  assignedDepartment: string;
  status: FrontOfficeDocStatus;
  followUpDate?: string;
  purposeRemarks: string;
  resolutionNotes?: string;
  rejectionReason?: string;
}




