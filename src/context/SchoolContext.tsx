import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PlatformType,
  RoleType,
  ThemeColor,
  Student,
  Teacher,
  AttendanceRecord,
  MarkRecord,
  Assignment,
  TimetableSlot,
  TimetableConflict,
  TimetableVersion,
  StaffLeaveRequest,
  SubstitutionAssignment,
  FeeInvoice,
  VisitorEntry,
  AdmissionEnquiry,
  LibraryBook,
  BookIssue,
  Notice,
  SchoolEvent,
  DirectMessage,
  AuditLogEntry,
  StudentTransferRecord,
  StudentPromotionPreview,
  AttendanceDiscrepancyRequest,
  StudentInfoChangeRequest,
  ToastNotification,
  AcademicYear,
  AcademicTerm,
  ClassEntity,
  SectionEntity,
  SubjectEntity,
  SubjectAllocation,
  PeriodDefinition,
  TimetableRevision,
  ClassroomRoom,
  StaffAttendanceRecord,
  StudentMovementRecord,
  AttendanceCorrectionRequest,
  AttendanceSessionEntity,
  AttendanceSettingsConfig,
  Examination,
  ExamScheduleSlot,
  SubjectAssessmentConfig,
  GradingScaleConfig,
  GradingScaleBoundary,
  AssessmentSettingsConfig,
  AssignmentSubmission,
  ReportCardData,
  MarkCorrectionAudit,
  FeePayment,
  FeeStructureItem,
  FeeConcession,
  ExpenseRecord,
  BudgetCategory,
  FinancialDaybookEntry,
  LibraryBookCopy,
  BookReservation,
  LostDamagedBookRecord,
  LibraryTransaction,
  TransportVehicle,
  TransportDriver,
  TransportStop,
  TransportRoute,
  StudentTransportAssignment,
  VehicleMaintenanceRecord,
  TransportIncident,
  TransportAnnouncement,
  ReceptionAppointment,
  PhoneCallLog,
  ReceptionRequest,
  ReceptionRequestStatus,
  FrontOfficeDocumentRequest,
  FrontOfficeDocStatus,
  EnquiryFollowUp
} from '../types/school';
import {
  THEME_CONFIGS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_ATTENDANCE,
  INITIAL_MARKS,
  INITIAL_ASSIGNMENTS,
  INITIAL_TIMETABLE,
  INITIAL_TIMETABLE_VERSION,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_SUBSTITUTIONS,
  INITIAL_FEES,
  INITIAL_VISITORS,
  INITIAL_ENQUIRIES,
  INITIAL_BOOKS,
  INITIAL_BOOK_ISSUES,
  INITIAL_NOTICES,
  INITIAL_EVENTS,
  INITIAL_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_TRANSFERS,
  INITIAL_ACADEMIC_YEARS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_SUBJECT_ALLOCATIONS,
  INITIAL_PERIOD_DEFINITIONS,
  INITIAL_ROOMS,
  INITIAL_TIMETABLE_REVISIONS,
  INITIAL_STUDENT_MOVEMENTS,
  INITIAL_CORRECTION_REQUESTS,
  INITIAL_STAFF_ATTENDANCE,
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_ATTENDANCE_SETTINGS,
  INITIAL_EXAMINATIONS,
  INITIAL_EXAM_SCHEDULE_SLOTS,
  INITIAL_SUBJECT_ASSESSMENTS,
  INITIAL_GRADING_SCALES,
  INITIAL_ASSESSMENT_SETTINGS,
  INITIAL_ASSIGNMENT_SUBMISSIONS,
  INITIAL_FEE_STRUCTURES,
  INITIAL_FEE_CONCESSIONS,
  INITIAL_EXPENSES,
  INITIAL_BUDGETS,
  INITIAL_DAYBOOK_ENTRIES,
  INITIAL_BOOK_COPIES,
  INITIAL_BOOK_RESERVATIONS,
  INITIAL_LOST_DAMAGED_BOOKS,
  INITIAL_LIBRARY_TRANSACTIONS,
  INITIAL_TRANSPORT_VEHICLES,
  INITIAL_TRANSPORT_DRIVERS,
  INITIAL_TRANSPORT_ROUTES,
  INITIAL_TRANSPORT_ASSIGNMENTS,
  INITIAL_VEHICLE_MAINTENANCE,
  INITIAL_TRANSPORT_INCIDENTS,
  INITIAL_TRANSPORT_ANNOUNCEMENTS,
  INITIAL_RECEPTION_APPOINTMENTS,
  INITIAL_PHONE_CALL_LOGS,
  INITIAL_RECEPTION_REQUESTS,
  INITIAL_DOCUMENT_REQUESTS
} from '../data/mockData';
import { BRANDING } from '../constants/branding';
import { DEFAULT_PALETTE, getPaletteById, SCHLAR_PALETTES } from '../theme/palettes';
import {
  applyThemeToDom,
  getStoredActiveColors,
  getStoredActivePaletteId,
  saveStoredActiveColors,
  saveStoredActivePaletteId
} from '../theme/themeEngine';

const STORAGE_KEY = BRANDING.storageKey;
const LEGACY_STORAGE_KEY = BRANDING.legacyStorageKey;

function loadStoredItem<T>(keySuffix: string, fallback: T): T {
  try {
    const primary = localStorage.getItem(`${STORAGE_KEY}_${keySuffix}`);
    if (primary) return JSON.parse(primary);
    const legacy = localStorage.getItem(`${LEGACY_STORAGE_KEY}_${keySuffix}`);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      try {
        localStorage.setItem(`${STORAGE_KEY}_${keySuffix}`, legacy);
      } catch (_) {}
      return parsed;
    }
  } catch (e) {
    console.warn(`Failed to parse storage item for ${keySuffix}`, e);
  }
  return fallback;
}

interface SchoolContextType {
  // Navigation & Role
  currentPlatform: PlatformType;
  setCurrentPlatform: (platform: PlatformType) => void;
  currentRole: RoleType | null;
  setCurrentRole: (role: RoleType | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  phoneFrameMode: boolean;
  setPhoneFrameMode: (enabled: boolean) => void;

  // Active Parent Child (for Parent Mobile experience)
  activeChildId: string;
  setActiveChildId: (id: string) => void;

  // Global search
  globalSearch: string;
  setGlobalSearch: (term: string) => void;

  // Data Collections
  students: Student[];
  teachers: Teacher[];
  attendance: AttendanceRecord[];
  marks: MarkRecord[];
  assignments: Assignment[];
  timetables: TimetableSlot[];
  timetableVersion: TimetableVersion;
  timetableConflicts: TimetableConflict[];
  leaveRequests: StaffLeaveRequest[];
  substitutions: SubstitutionAssignment[];
  fees: FeeInvoice[];
  visitors: VisitorEntry[];
  enquiries: AdmissionEnquiry[];
  books: LibraryBook[];
  bookIssues: BookIssue[];
  notices: Notice[];
  events: SchoolEvent[];
  messages: DirectMessage[];
  auditLogs: AuditLogEntry[];
  transfers: StudentTransferRecord[];

  // Academic Management Entities (Prompt 3)
  academicYears: AcademicYear[];
  activeAcademicYearId: string;
  classes: ClassEntity[];
  subjects: SubjectEntity[];
  subjectAllocations: SubjectAllocation[];
  periodDefinitions: PeriodDefinition[];
  rooms: ClassroomRoom[];
  timetableRevisions: TimetableRevision[];

  // Academic Year Actions
  setActiveAcademicYearId: (id: string) => void;
  addAcademicYear: (year: Omit<AcademicYear, 'id'>) => { success: boolean; message: string };
  updateAcademicYear: (id: string, data: Partial<AcademicYear>) => { success: boolean; message: string };
  archiveAcademicYear: (id: string) => void;

  // Class & Section Actions
  addClass: (cls: Omit<ClassEntity, 'id' | 'sections'>) => void;
  updateClass: (id: string, data: Partial<ClassEntity>) => void;
  addSection: (classId: string, section: Omit<SectionEntity, 'id' | 'classId' | 'enrolledCount' | 'status'>) => { success: boolean; message: string };
  updateSection: (sectionId: string, data: Partial<SectionEntity>) => void;
  archiveSection: (sectionId: string) => void;

  // Subject & Allocation Actions
  addSubject: (subj: Omit<SubjectEntity, 'id'>) => void;
  updateSubject: (id: string, data: Partial<SubjectEntity>) => void;
  deleteSubject: (id: string) => void;
  saveSubjectAllocation: (alloc: Omit<SubjectAllocation, 'id'>) => { success: boolean; message: string };
  deleteSubjectAllocation: (id: string) => void;

  // Period / Bell Schedule Actions
  updatePeriodDefinition: (id: string, data: Partial<PeriodDefinition>) => void;
  addPeriodDefinition: (period: Omit<PeriodDefinition, 'id'>) => void;

  // Timetable Revision Lifecycle
  createTimetableRevision: (notes: string) => void;

  // Academic Calendar Events CRUD
  addSchoolEvent: (event: Omit<SchoolEvent, 'id'>) => void;
  updateSchoolEvent: (id: string, data: Partial<SchoolEvent>) => void;
  deleteSchoolEvent: (id: string) => void;

  // Student Actions
  addStudent: (student: Omit<Student, 'id' | 'status'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  transferStudent: (studentId: string, toClass: string, reason: string, authorizedBy: string) => void;
  withdrawStudent: (studentId: string, reason: string, authorizedBy: string) => void;
  previewPromotion: (fromStandard: number) => StudentPromotionPreview[];
  executePromotionRollover: (promotions: StudentPromotionPreview[]) => void;

  // Teacher / Staff Actions
  addTeacher: (teacher: Omit<Teacher, 'id' | 'currentWeeklyWorkload'>) => void;
  updateTeacher: (id: string, data: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  updateTeacherWorkloadLimit: (teacherId: string, limit: number) => void;

  // Staff Leave & Substitution Actions
  submitLeaveRequest: (staffId: string, staffName: string, leaveType: StaffLeaveRequest['leaveType'], startDate: string, endDate: string, reason: string, attachmentName?: string) => { success: boolean; message: string };
  approveLeaveRequest: (requestId: string, reviewerName: string, remarks?: string) => void;
  rejectLeaveRequest: (requestId: string, reviewerName: string, remarks?: string) => void;
  cancelLeaveRequest: (requestId: string) => void;
  assignSubstitute: (subData: Omit<SubstitutionAssignment, 'id' | 'status'>) => void;
  cancelSubstitute: (subId: string) => void;

  // Timetable Actions & Conflict Engine
  updateTimetableSlot: (slotId: string, data: Partial<TimetableSlot>) => void;
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  deleteTimetableSlot: (slotId: string) => void;
  swapTimetableSlots: (slotId1: string, slotId2: string) => void;
  validateTimetableConflicts: () => TimetableConflict[];
  publishTimetable: (publisherName: string) => { success: boolean; message: string; conflicts: TimetableConflict[] };
  rollbackTimetable: () => void;

  // Attendance & Daily Operations (Prompt 4)
  studentMovements: StudentMovementRecord[];
  correctionRequests: AttendanceCorrectionRequest[];
  staffAttendance: StaffAttendanceRecord[];
  attendanceSessions: AttendanceSessionEntity[];
  attendanceSettings: AttendanceSettingsConfig;
  logStudentMovement: (movement: Omit<StudentMovementRecord, 'id' | 'passNo' | 'createdAt'>) => StudentMovementRecord;
  updateStudentMovement: (id: string, data: Partial<StudentMovementRecord>) => void;
  submitCorrectionRequest: (request: Omit<AttendanceCorrectionRequest, 'id' | 'requestedAt' | 'status'>) => void;
  reviewCorrectionRequest: (requestId: string, status: 'approved' | 'rejected', reviewerName: string, remarks?: string) => void;
  markStaffAttendance: (record: Omit<StaffAttendanceRecord, 'id'>) => void;
  bulkMarkStaffAttendance: (records: Omit<StaffAttendanceRecord, 'id'>[]) => void;
  saveAttendanceSession: (sessionData: {
    standard: number;
    section: 'A' | 'B';
    date: string;
    session: string;
    period?: number;
    isDraft: boolean;
    records: Array<{
      studentId: string;
      studentName: string;
      rollNo: number;
      status: AttendanceRecord['status'];
      period?: number;
      arrivalTime?: string;
      departureTime?: string;
      remarks?: string;
    }>;
    submittedByName: string;
  }) => { success: boolean; message: string; unmarkedCount: number };
  updateAttendanceSettings: (settings: Partial<AttendanceSettingsConfig>) => void;

  // Academic Actions
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  saveBulkAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  saveMark: (mark: Omit<MarkRecord, 'id'>) => void;
  createAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, data: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  // Examination & Academic Assessment State & Actions (Prompt 5)
  examinations: Examination[];
  examScheduleSlots: ExamScheduleSlot[];
  subjectAssessments: SubjectAssessmentConfig[];
  gradingScales: GradingScaleConfig[];
  assessmentSettings: AssessmentSettingsConfig;
  assignmentSubmissions: AssignmentSubmission[];

  canTeacherAccessSubject: (teacherId: string, standard: number, section: 'A' | 'B', subject: string) => boolean;
  createExamination: (exam: Omit<Examination, 'id'>) => { success: boolean; message: string; exam?: Examination };
  updateExamination: (id: string, data: Partial<Examination>) => void;
  publishExamination: (id: string, publisherName: string) => { success: boolean; message: string };
  archiveExamination: (id: string) => void;
  duplicateExamination: (id: string, newName: string) => { success: boolean; message: string };

  createExamScheduleSlot: (slot: Omit<ExamScheduleSlot, 'id'>) => { success: boolean; message: string };
  updateExamScheduleSlot: (id: string, data: Partial<ExamScheduleSlot>) => { success: boolean; message: string };
  deleteExamScheduleSlot: (id: string) => void;
  detectExamScheduleConflicts: () => Array<{ type: 'class_overlap' | 'teacher_overlap' | 'room_overlap'; message: string; slotIds: string[] }>;

  saveSubjectAssessmentConfig: (config: Omit<SubjectAssessmentConfig, 'id'>) => void;
  saveMarksBatch: (assessmentId: string, records: Array<Partial<MarkRecord> & { studentId: string; marksObtained: number }>, teacherId: string, teacherName: string, isDraft?: boolean) => { success: boolean; message: string };
  submitAssessmentMarks: (assessmentId: string, teacherId: string, teacherName: string) => { success: boolean; message: string; missingCount: number };
  reviewAssessmentMarks: (assessmentId: string, decision: 'approved' | 'returned_for_correction', reviewerName: string, remarks?: string) => { success: boolean; message: string };
  publishExamResults: (examId: string, standard?: number, section?: 'A' | 'B', publisherName?: string) => { success: boolean; message: string };
  submitMarkCorrection: (markId: string, newMarks: number, reason: string, requestedByName: string) => void;
  gradeAssignmentSubmission: (submissionId: string, marksObtained: number, maxMarks: number, feedback: string) => void;
  updateAssessmentSettings: (settings: Partial<AssessmentSettingsConfig>) => void;
  updateGradingScale: (scaleId: string, boundaries: GradingScaleBoundary[]) => void;

  // Finance & Bursar State & Actions (Prompt 6)
  feeStructures: FeeStructureItem[];
  feeConcessions: FeeConcession[];
  expenses: ExpenseRecord[];
  budgets: BudgetCategory[];
  daybookEntries: FinancialDaybookEntry[];

  createFeeStructure: (structure: Omit<FeeStructureItem, 'id'>) => void;
  updateFeeStructure: (id: string, data: Partial<FeeStructureItem>) => void;
  deleteFeeStructure: (id: string) => void;
  assignFeeStructureToClass: (structureId: string, standard: number, section?: 'A' | 'B') => { count: number; message: string };
  applyFeeConcession: (concession: Omit<FeeConcession, 'id' | 'concessionNo'>) => void;
  revokeFeeConcession: (concessionId: string, reason: string) => void;
  createFeeInvoice: (invoice: Omit<FeeInvoice, 'id'>) => void;
  collectFee: (invoiceId: string, paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash' | 'Cheque') => void;
  recordFeePayment: (
    invoiceId: string,
    amount: number,
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash' | 'Cheque',
    transactionRef?: string,
    chequeNo?: string,
    notes?: string,
    collectedBy?: string
  ) => { success: boolean; receiptNo: string; remainingBalance: number };
  sendFeeReminder: (invoiceId: string, channel?: 'SMS' | 'WhatsApp' | 'Email') => { success: boolean; message: string };
  recordExpense: (expense: Omit<ExpenseRecord, 'id' | 'voucherNo'>) => { voucherNo: string };
  approveExpense: (expenseId: string, approvedBy: string) => void;
  rejectExpense: (expenseId: string, reason: string) => void;
  updateBudgetCategory: (budgetId: string, allocatedAmount: number, alertThresholdPct?: number) => void;

  // Front Office Actions & State (Prompt 8)
  checkInVisitor: (visitor: Omit<VisitorEntry, 'id' | 'passNo' | 'status'>) => void;
  checkOutVisitor: (id: string, notes?: string) => void;
  addEnquiry: (enquiry: Omit<AdmissionEnquiry, 'id' | 'enquiryNo'>) => void;
  updateEnquiryStatus: (id: string, status: AdmissionEnquiry['status']) => void;
  addEnquiryFollowUp: (enquiryId: string, note: string, nextFollowUpDate?: string) => void;
  convertEnquiryToLead: (enquiryId: string) => { success: boolean; leadId: string };
  admitStudentFromLead: (enquiryId: string, standard: number, section: 'A' | 'B', rollNo?: number) => { success: boolean; student?: Student; message: string };
  appointments: ReceptionAppointment[];
  scheduleAppointment: (data: Omit<ReceptionAppointment, 'id' | 'appointmentNo' | 'createdAt' | 'createdBy'>) => { success: boolean; conflict?: ReceptionAppointment; appointmentId?: string };
  updateAppointmentStatus: (id: string, status: ReceptionAppointment['status'], notes?: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newStartTime: string, newEndTime: string) => { success: boolean; conflict?: ReceptionAppointment };
  callLogs: PhoneCallLog[];
  logPhoneCall: (data: Omit<PhoneCallLog, 'id' | 'callNo'>) => void;
  updateCallLogStatus: (id: string, status: PhoneCallLog['status']) => void;
  receptionRequests: ReceptionRequest[];
  createReceptionRequest: (data: Omit<ReceptionRequest, 'id' | 'ticketNo'>) => void;
  updateReceptionRequestStatus: (id: string, status: ReceptionRequestStatus, resolutionNotes?: string) => void;
  assignReceptionRequest: (id: string, department: ReceptionRequest['assignedDepartment'], staff?: string) => void;
  documentRequests: FrontOfficeDocumentRequest[];
  createDocumentRequest: (data: Omit<FrontOfficeDocumentRequest, 'id' | 'requestNo'>) => void;
  updateDocumentRequestStatus: (id: string, status: FrontOfficeDocStatus, notes?: string, rejectionReason?: string) => void;

  // Library Actions & Extended State (Prompt 7)
  bookCopies: LibraryBookCopy[];
  bookReservations: BookReservation[];
  lostDamagedBooks: LostDamagedBookRecord[];
  libraryTransactions: LibraryTransaction[];
  addBook: (book: Omit<LibraryBook, 'id'>) => void;
  updateBook: (id: string, updates: Partial<LibraryBook>) => void;
  deleteBook: (id: string) => void;
  issueBook: (issue: Omit<BookIssue, 'id' | 'issueNo' | 'status' | 'fineAmount'>) => void;
  returnBook: (issueId: string, condition?: string, fineAmount?: number) => void;
  addBookCopy: (copy: Omit<LibraryBookCopy, 'id'>) => void;
  updateBookCopyStatus: (copyId: string, status: LibraryBookCopy['status'], notes?: string) => void;
  createReservation: (res: Omit<BookReservation, 'id' | 'reservationNo'>) => void;
  cancelReservation: (id: string) => void;
  fulfillReservation: (id: string) => void;
  recordLostOrDamagedBook: (record: Omit<LostDamagedBookRecord, 'id' | 'incidentNo'>) => void;
  addLibraryTransaction: (txn: Omit<LibraryTransaction, 'id' | 'txnNo' | 'timestamp'>) => void;

  // Transport Operations (Prompt 7)
  transportVehicles: TransportVehicle[];
  transportDrivers: TransportDriver[];
  transportRoutes: TransportRoute[];
  transportAssignments: StudentTransportAssignment[];
  vehicleMaintenance: VehicleMaintenanceRecord[];
  transportIncidents: TransportIncident[];
  transportAnnouncements: TransportAnnouncement[];
  addTransportVehicle: (veh: Omit<TransportVehicle, 'id'>) => { vehicleCode: string };
  updateTransportVehicle: (id: string, updates: Partial<TransportVehicle>) => void;
  deleteTransportVehicle: (id: string) => void;
  addTransportDriver: (drv: Omit<TransportDriver, 'id'>) => void;
  updateTransportDriver: (id: string, updates: Partial<TransportDriver>) => void;
  addTransportRoute: (route: Omit<TransportRoute, 'id'>) => { routeCode: string };
  updateTransportRoute: (id: string, updates: Partial<TransportRoute>) => void;
  deleteTransportRoute: (id: string) => void;
  assignStudentTransport: (assign: Omit<StudentTransportAssignment, 'id'>) => { success: boolean; message: string };
  cancelStudentTransport: (id: string) => void;
  recordVehicleMaintenance: (maint: Omit<VehicleMaintenanceRecord, 'id' | 'maintenanceNo'>) => { maintenanceNo: string };
  updateVehicleMaintenanceStatus: (id: string, status: VehicleMaintenanceRecord['status']) => void;
  recordTransportIncident: (inc: Omit<TransportIncident, 'id' | 'incidentRef'>) => { incidentRef: string };
  publishTransportAnnouncement: (ann: Omit<TransportAnnouncement, 'id' | 'broadcastNo'>) => void;

  // Notices & Messages
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  deleteNotice: (id: string) => void;
  sendMessage: (text: string, receiverId: string, receiverName: string) => void;

  // Parent Requests & Service Workflows
  attendanceDiscrepancies: AttendanceDiscrepancyRequest[];
  studentInfoRequests: StudentInfoChangeRequest[];
  submitAttendanceDiscrepancy: (data: Omit<AttendanceDiscrepancyRequest, 'id' | 'status' | 'submittedAt'>) => void;
  submitStudentInfoRequest: (data: Omit<StudentInfoChangeRequest, 'id' | 'status' | 'submittedAt'>) => void;
  updateAttendanceDiscrepancy: (id: string, status: AttendanceDiscrepancyRequest['status'], responseNote?: string) => void;
  updateStudentInfoRequest: (id: string, status: StudentInfoChangeRequest['status'], reviewRemarks?: string) => void;

  // Audit Log Action
  logAudit: (actorRole: string, actorName: string, action: string, module: string, details: string, entityId?: string) => void;

  // Control Actions
  resetDemoData: () => void;
  switchRole: (role: RoleType) => void;
  signOut: () => void;

  // Enterprise UI Feedback & Toasts
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const INITIAL_DISCREPANCIES: AttendanceDiscrepancyRequest[] = [
  {
    id: 'dis-01',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    date: '2026-10-12',
    reportedStatus: 'absent',
    parentClaim: 'present',
    reason: 'Aarav arrived late via Route 4 School Bus (delayed due to flyover construction) and was present for all periods after assembly.',
    status: 'reviewed',
    submittedAt: '2026-10-12T09:45:00Z',
    reviewedBy: 'Mrs. Shalini Verma',
    responseNote: 'Verified with Route 4 bus monitor log. Attendance reconciled to late arrival.'
  }
];

const INITIAL_INFO_REQUESTS: StudentInfoChangeRequest[] = [
  {
    id: 'req-01',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    requestType: 'Emergency Contact',
    requestedChanges: 'Secondary Contact: Dr. Meenakshi Sharma (Mother, Pediatrician) - +91 98765 43211',
    reason: 'Update mother hospital contact number for priority emergency notifications.',
    status: 'approved',
    submittedAt: '2026-10-08T11:20:00Z',
    reviewRemarks: 'Verified and updated in student registry dossier.'
  }
];

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPlatform, setCurrentPlatform] = useState<PlatformType>('web');
  const [currentRole, setCurrentRole] = useState<RoleType | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [themeColor, setThemeColor] = useState<ThemeColor>('navy');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [phoneFrameMode, setPhoneFrameMode] = useState<boolean>(true);
  const [activeChildId, setActiveChildId] = useState<string>('stu-101');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Primary Data State with LocalStorage (safe parsing & automatic migration)
  const [students, setStudents] = useState<Student[]>(() => loadStoredItem('students', INITIAL_STUDENTS));
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadStoredItem('teachers', INITIAL_TEACHERS));
  const [timetables, setTimetables] = useState<TimetableSlot[]>(() => loadStoredItem('timetables', INITIAL_TIMETABLE));
  const [timetableVersion, setTimetableVersion] = useState<TimetableVersion>(() => loadStoredItem('tt_version', INITIAL_TIMETABLE_VERSION));
  const [timetableConflicts, setTimetableConflicts] = useState<TimetableConflict[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<StaffLeaveRequest[]>(() => loadStoredItem('leaves', INITIAL_LEAVE_REQUESTS));
  const [substitutions, setSubstitutions] = useState<SubstitutionAssignment[]>(() => loadStoredItem('substitutions', INITIAL_SUBSTITUTIONS));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadStoredItem('attendance', INITIAL_ATTENDANCE));
  const [marks, setMarks] = useState<MarkRecord[]>(() => loadStoredItem('marks', INITIAL_MARKS));
  const [assignments, setAssignments] = useState<Assignment[]>(() => loadStoredItem('assignments', INITIAL_ASSIGNMENTS));
  const [fees, setFees] = useState<FeeInvoice[]>(() => loadStoredItem('fees', INITIAL_FEES));
  const [visitors, setVisitors] = useState<VisitorEntry[]>(() => loadStoredItem('visitors', INITIAL_VISITORS));
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>(() => loadStoredItem('enquiries', INITIAL_ENQUIRIES));
  const [books, setBooks] = useState<LibraryBook[]>(() => loadStoredItem('books', INITIAL_BOOKS));
  const [bookIssues, setBookIssues] = useState<BookIssue[]>(() => loadStoredItem('book_issues', INITIAL_BOOK_ISSUES));
  const [notices, setNotices] = useState<Notice[]>(() => loadStoredItem('notices', INITIAL_NOTICES));
  const [events, setEvents] = useState<SchoolEvent[]>(() => loadStoredItem('events', INITIAL_EVENTS));
  const [messages, setMessages] = useState<DirectMessage[]>(() => loadStoredItem('messages', INITIAL_MESSAGES));
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => loadStoredItem('audit', INITIAL_AUDIT_LOGS));
  const [transfers, setTransfers] = useState<StudentTransferRecord[]>(() => loadStoredItem('transfers', INITIAL_TRANSFERS));
  const [attendanceDiscrepancies, setAttendanceDiscrepancies] = useState<AttendanceDiscrepancyRequest[]>(() => loadStoredItem('discrepancies', INITIAL_DISCREPANCIES));
  const [studentInfoRequests, setStudentInfoRequests] = useState<StudentInfoChangeRequest[]>(() => loadStoredItem('info_requests', INITIAL_INFO_REQUESTS));
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Academic Management State (Prompt 3)
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() => loadStoredItem('academic_years', INITIAL_ACADEMIC_YEARS));
  const [activeAcademicYearId, setActiveAcademicYearId] = useState<string>(() => loadStoredItem('active_ay_id', 'ay-2026-27'));
  const [classes, setClasses] = useState<ClassEntity[]>(() => loadStoredItem('classes', INITIAL_CLASSES));
  const [subjects, setSubjects] = useState<SubjectEntity[]>(() => loadStoredItem('subjects', INITIAL_SUBJECTS));
  const [subjectAllocations, setSubjectAllocations] = useState<SubjectAllocation[]>(() => loadStoredItem('subject_allocations', INITIAL_SUBJECT_ALLOCATIONS));
  const [periodDefinitions, setPeriodDefinitions] = useState<PeriodDefinition[]>(() => loadStoredItem('period_definitions', INITIAL_PERIOD_DEFINITIONS));
  const [rooms, setRooms] = useState<ClassroomRoom[]>(() => loadStoredItem('rooms', INITIAL_ROOMS));
  const [timetableRevisions, setTimetableRevisions] = useState<TimetableRevision[]>(() => loadStoredItem('timetable_revisions', INITIAL_TIMETABLE_REVISIONS));

  // Attendance & Daily Operations State (Prompt 4)
  const [studentMovements, setStudentMovements] = useState<StudentMovementRecord[]>(() => loadStoredItem('student_movements', INITIAL_STUDENT_MOVEMENTS));
  const [correctionRequests, setCorrectionRequests] = useState<AttendanceCorrectionRequest[]>(() => loadStoredItem('correction_requests', INITIAL_CORRECTION_REQUESTS));
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendanceRecord[]>(() => loadStoredItem('staff_attendance', INITIAL_STAFF_ATTENDANCE));
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSessionEntity[]>(() => loadStoredItem('attendance_sessions', INITIAL_ATTENDANCE_SESSIONS));
  const [attendanceSettings, setAttendanceSettings] = useState<AttendanceSettingsConfig>(() => loadStoredItem('attendance_settings', INITIAL_ATTENDANCE_SETTINGS));

  // Examination & Assessment State (Prompt 5)
  const [examinations, setExaminations] = useState<Examination[]>(() => loadStoredItem('examinations', INITIAL_EXAMINATIONS));
  const [examScheduleSlots, setExamScheduleSlots] = useState<ExamScheduleSlot[]>(() => loadStoredItem('exam_schedule_slots', INITIAL_EXAM_SCHEDULE_SLOTS));
  const [subjectAssessments, setSubjectAssessments] = useState<SubjectAssessmentConfig[]>(() => loadStoredItem('subject_assessments', INITIAL_SUBJECT_ASSESSMENTS));
  const [gradingScales, setGradingScales] = useState<GradingScaleConfig[]>(() => loadStoredItem('grading_scales', INITIAL_GRADING_SCALES));
  const [assessmentSettings, setAssessmentSettings] = useState<AssessmentSettingsConfig>(() => loadStoredItem('assessment_settings', INITIAL_ASSESSMENT_SETTINGS));
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<AssignmentSubmission[]>(() => loadStoredItem('assignment_submissions', INITIAL_ASSIGNMENT_SUBMISSIONS));

  // Finance & Bursar State (Prompt 6)
  const [feeStructures, setFeeStructures] = useState<FeeStructureItem[]>(() => loadStoredItem('fee_structures', INITIAL_FEE_STRUCTURES));
  const [feeConcessions, setFeeConcessions] = useState<FeeConcession[]>(() => loadStoredItem('fee_concessions', INITIAL_FEE_CONCESSIONS));
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => loadStoredItem('expenses', INITIAL_EXPENSES));
  const [budgets, setBudgets] = useState<BudgetCategory[]>(() => loadStoredItem('budgets', INITIAL_BUDGETS));
  const [daybookEntries, setDaybookEntries] = useState<FinancialDaybookEntry[]>(() => loadStoredItem('daybook_entries', INITIAL_DAYBOOK_ENTRIES));

  // Library Management Extensions (Prompt 7)
  const [bookCopies, setBookCopies] = useState<LibraryBookCopy[]>(() => loadStoredItem('book_copies', INITIAL_BOOK_COPIES));
  const [bookReservations, setBookReservations] = useState<BookReservation[]>(() => loadStoredItem('book_reservations', INITIAL_BOOK_RESERVATIONS));
  const [lostDamagedBooks, setLostDamagedBooks] = useState<LostDamagedBookRecord[]>(() => loadStoredItem('lost_damaged_books', INITIAL_LOST_DAMAGED_BOOKS));
  const [libraryTransactions, setLibraryTransactions] = useState<LibraryTransaction[]>(() => loadStoredItem('library_transactions', INITIAL_LIBRARY_TRANSACTIONS));

  // Transport Management Operations (Prompt 7)
  const [transportVehicles, setTransportVehicles] = useState<TransportVehicle[]>(() => loadStoredItem('transport_vehicles', INITIAL_TRANSPORT_VEHICLES));
  const [transportDrivers, setTransportDrivers] = useState<TransportDriver[]>(() => loadStoredItem('transport_drivers', INITIAL_TRANSPORT_DRIVERS));
  const [transportRoutes, setTransportRoutes] = useState<TransportRoute[]>(() => loadStoredItem('transport_routes', INITIAL_TRANSPORT_ROUTES));
  const [transportAssignments, setTransportAssignments] = useState<StudentTransportAssignment[]>(() => loadStoredItem('transport_assignments', INITIAL_TRANSPORT_ASSIGNMENTS));
  const [vehicleMaintenance, setVehicleMaintenance] = useState<VehicleMaintenanceRecord[]>(() => loadStoredItem('vehicle_maintenance', INITIAL_VEHICLE_MAINTENANCE));
  const [transportIncidents, setTransportIncidents] = useState<TransportIncident[]>(() => loadStoredItem('transport_incidents', INITIAL_TRANSPORT_INCIDENTS));
  const [transportAnnouncements, setTransportAnnouncements] = useState<TransportAnnouncement[]>(() => loadStoredItem('transport_announcements', INITIAL_TRANSPORT_ANNOUNCEMENTS));

  // Front Office & Reception Operations (Prompt 8)
  const [appointments, setAppointments] = useState<ReceptionAppointment[]>(() => loadStoredItem('reception_appointments', INITIAL_RECEPTION_APPOINTMENTS));
  const [callLogs, setCallLogs] = useState<PhoneCallLog[]>(() => loadStoredItem('reception_call_logs', INITIAL_PHONE_CALL_LOGS));
  const [receptionRequests, setReceptionRequests] = useState<ReceptionRequest[]>(() => loadStoredItem('reception_requests', INITIAL_RECEPTION_REQUESTS));
  const [documentRequests, setDocumentRequests] = useState<FrontOfficeDocumentRequest[]>(() => loadStoredItem('reception_document_requests', INITIAL_DOCUMENT_REQUESTS));

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastNotification = { id, message, type, timestamp: Date.now() };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
      localStorage.setItem(`${STORAGE_KEY}_teachers`, JSON.stringify(teachers));
      localStorage.setItem(`${STORAGE_KEY}_timetables`, JSON.stringify(timetables));
      localStorage.setItem(`${STORAGE_KEY}_tt_version`, JSON.stringify(timetableVersion));
      localStorage.setItem(`${STORAGE_KEY}_leaves`, JSON.stringify(leaveRequests));
      localStorage.setItem(`${STORAGE_KEY}_substitutions`, JSON.stringify(substitutions));
      localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendance));
      localStorage.setItem(`${STORAGE_KEY}_marks`, JSON.stringify(marks));
      localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(assignments));
      localStorage.setItem(`${STORAGE_KEY}_fees`, JSON.stringify(fees));
      localStorage.setItem(`${STORAGE_KEY}_visitors`, JSON.stringify(visitors));
      localStorage.setItem(`${STORAGE_KEY}_enquiries`, JSON.stringify(enquiries));
      localStorage.setItem(`${STORAGE_KEY}_books`, JSON.stringify(books));
      localStorage.setItem(`${STORAGE_KEY}_book_issues`, JSON.stringify(bookIssues));
      localStorage.setItem(`${STORAGE_KEY}_notices`, JSON.stringify(notices));
      localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
      localStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(messages));
      localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY}_transfers`, JSON.stringify(transfers));
      localStorage.setItem(`${STORAGE_KEY}_discrepancies`, JSON.stringify(attendanceDiscrepancies));
      localStorage.setItem(`${STORAGE_KEY}_info_requests`, JSON.stringify(studentInfoRequests));
      localStorage.setItem(`${STORAGE_KEY}_academic_years`, JSON.stringify(academicYears));
      localStorage.setItem(`${STORAGE_KEY}_active_ay_id`, JSON.stringify(activeAcademicYearId));
      localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
      localStorage.setItem(`${STORAGE_KEY}_subjects`, JSON.stringify(subjects));
      localStorage.setItem(`${STORAGE_KEY}_subject_allocations`, JSON.stringify(subjectAllocations));
      localStorage.setItem(`${STORAGE_KEY}_period_definitions`, JSON.stringify(periodDefinitions));
      localStorage.setItem(`${STORAGE_KEY}_rooms`, JSON.stringify(rooms));
      localStorage.setItem(`${STORAGE_KEY}_timetable_revisions`, JSON.stringify(timetableRevisions));
      localStorage.setItem(`${STORAGE_KEY}_student_movements`, JSON.stringify(studentMovements));
      localStorage.setItem(`${STORAGE_KEY}_correction_requests`, JSON.stringify(correctionRequests));
      localStorage.setItem(`${STORAGE_KEY}_staff_attendance`, JSON.stringify(staffAttendance));
      localStorage.setItem(`${STORAGE_KEY}_attendance_sessions`, JSON.stringify(attendanceSessions));
      localStorage.setItem(`${STORAGE_KEY}_attendance_settings`, JSON.stringify(attendanceSettings));
      localStorage.setItem(`${STORAGE_KEY}_examinations`, JSON.stringify(examinations));
      localStorage.setItem(`${STORAGE_KEY}_exam_schedule_slots`, JSON.stringify(examScheduleSlots));
      localStorage.setItem(`${STORAGE_KEY}_subject_assessments`, JSON.stringify(subjectAssessments));
      localStorage.setItem(`${STORAGE_KEY}_grading_scales`, JSON.stringify(gradingScales));
      localStorage.setItem(`${STORAGE_KEY}_assessment_settings`, JSON.stringify(assessmentSettings));
      localStorage.setItem(`${STORAGE_KEY}_assignment_submissions`, JSON.stringify(assignmentSubmissions));
      localStorage.setItem(`${STORAGE_KEY}_fee_structures`, JSON.stringify(feeStructures));
      localStorage.setItem(`${STORAGE_KEY}_fee_concessions`, JSON.stringify(feeConcessions));
      localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
      localStorage.setItem(`${STORAGE_KEY}_budgets`, JSON.stringify(budgets));
      localStorage.setItem(`${STORAGE_KEY}_daybook_entries`, JSON.stringify(daybookEntries));
      localStorage.setItem(`${STORAGE_KEY}_book_copies`, JSON.stringify(bookCopies));
      localStorage.setItem(`${STORAGE_KEY}_book_reservations`, JSON.stringify(bookReservations));
      localStorage.setItem(`${STORAGE_KEY}_lost_damaged_books`, JSON.stringify(lostDamagedBooks));
      localStorage.setItem(`${STORAGE_KEY}_library_transactions`, JSON.stringify(libraryTransactions));
      localStorage.setItem(`${STORAGE_KEY}_transport_vehicles`, JSON.stringify(transportVehicles));
      localStorage.setItem(`${STORAGE_KEY}_transport_drivers`, JSON.stringify(transportDrivers));
      localStorage.setItem(`${STORAGE_KEY}_transport_routes`, JSON.stringify(transportRoutes));
      localStorage.setItem(`${STORAGE_KEY}_transport_assignments`, JSON.stringify(transportAssignments));
      localStorage.setItem(`${STORAGE_KEY}_vehicle_maintenance`, JSON.stringify(vehicleMaintenance));
      localStorage.setItem(`${STORAGE_KEY}_transport_incidents`, JSON.stringify(transportIncidents));
      localStorage.setItem(`${STORAGE_KEY}_transport_announcements`, JSON.stringify(transportAnnouncements));
      localStorage.setItem(`${STORAGE_KEY}_reception_appointments`, JSON.stringify(appointments));
      localStorage.setItem(`${STORAGE_KEY}_reception_call_logs`, JSON.stringify(callLogs));
      localStorage.setItem(`${STORAGE_KEY}_reception_requests`, JSON.stringify(receptionRequests));
      localStorage.setItem(`${STORAGE_KEY}_reception_document_requests`, JSON.stringify(documentRequests));
      localStorage.setItem(`${STORAGE_KEY}_theme`, themeColor);
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [students, teachers, timetables, timetableVersion, leaveRequests, substitutions, attendance, marks, assignments, fees, visitors, enquiries, books, bookIssues, notices, events, messages, auditLogs, transfers, attendanceDiscrepancies, studentInfoRequests, academicYears, activeAcademicYearId, classes, subjects, subjectAllocations, periodDefinitions, rooms, timetableRevisions, studentMovements, correctionRequests, staffAttendance, attendanceSessions, attendanceSettings, examinations, examScheduleSlots, subjectAssessments, gradingScales, assessmentSettings, assignmentSubmissions, feeStructures, feeConcessions, expenses, budgets, daybookEntries, bookCopies, bookReservations, lostDamagedBooks, libraryTransactions, transportVehicles, transportDrivers, transportRoutes, transportAssignments, vehicleMaintenance, transportIncidents, transportAnnouncements, appointments, callLogs, receptionRequests, documentRequests, themeColor]);

  // Load saved theme on boot
  useEffect(() => {
    const savedTheme = localStorage.getItem(`${STORAGE_KEY}_theme`) as ThemeColor | null;
    if (savedTheme && THEME_CONFIGS[savedTheme]) {
      setThemeColor(savedTheme);
    }
  }, []);

  // Set default tab when role changes
  useEffect(() => {
    if (currentRole) {
      setActiveTab('dashboard');
    }
  }, [currentRole]);

  // Central Timetable Conflict Engine
  const validateTimetableConflicts = (): TimetableConflict[] => {
    const conflicts: TimetableConflict[] = [];

    // Map by slot key: Day + Period
    const slotsByDayPeriod: Record<string, TimetableSlot[]> = {};
    timetables.forEach(slot => {
      const key = `${slot.day}_P${slot.period}`;
      if (!slotsByDayPeriod[key]) slotsByDayPeriod[key] = [];
      slotsByDayPeriod[key].push(slot);
    });

    Object.entries(slotsByDayPeriod).forEach(([key, slots]) => {
      // 1. Check Teacher double-booking
      const teacherCounts: Record<string, TimetableSlot[]> = {};
      slots.forEach(s => {
        if (!s.isBreak && s.teacherId) {
          if (!teacherCounts[s.teacherId]) teacherCounts[s.teacherId] = [];
          teacherCounts[s.teacherId].push(s);
        }
      });

      Object.entries(teacherCounts).forEach(([teacherId, tSlots]) => {
        if (tSlots.length > 1) {
          const tName = tSlots[0].teacherName;
          const classes = tSlots.map(s => `Std ${s.standard}-${s.section}`).join(' and ');
          conflicts.push({
            id: `cnf-tch-${key}-${teacherId}`,
            type: 'teacher_double_booked',
            severity: 'blocking',
            day: tSlots[0].day,
            period: tSlots[0].period,
            time: tSlots[0].time,
            entityName: tName,
            description: `${tName} is double-booked across ${classes} during Period ${tSlots[0].period} (${tSlots[0].time}) on ${tSlots[0].day}.`,
            resolutionSuggestion: `Reassign one of the periods to another subject faculty or shift to an available free period.`,
            slotIds: tSlots.map(s => s.id)
          });
        }
      });

      // 2. Check Class & Section double-booking (same class & section scheduled for 2 subjects simultaneously)
      const classCounts: Record<string, TimetableSlot[]> = {};
      slots.forEach(s => {
        if (!s.isBreak) {
          const classKey = `${s.standard}-${s.section}`;
          if (!classCounts[classKey]) classCounts[classKey] = [];
          classCounts[classKey].push(s);
        }
      });

      Object.entries(classCounts).forEach(([classKey, cSlots]) => {
        if (cSlots.length > 1) {
          const subjectsList = cSlots.map(s => s.subject).join(' and ');
          conflicts.push({
            id: `cnf-cls-${key}-${classKey}`,
            type: 'class_clash',
            severity: 'blocking',
            day: cSlots[0].day,
            period: cSlots[0].period,
            time: cSlots[0].time,
            entityName: `Class ${classKey}`,
            description: `Class ${classKey} has two simultaneous lessons scheduled (${subjectsList}) during Period ${cSlots[0].period} on ${cSlots[0].day}.`,
            resolutionSuggestion: `Remove duplicate period assignment or shift one lesson to an empty period.`,
            slotIds: cSlots.map(s => s.id)
          });
        }
      });

      // 3. Check Room clashes (excluding expansive outdoor / multi-batch areas)
      const roomCounts: Record<string, TimetableSlot[]> = {};
      slots.forEach(s => {
        if (!s.isBreak && s.room && s.room !== 'Main Field' && s.room !== 'Auditorium') {
          if (!roomCounts[s.room]) roomCounts[s.room] = [];
          roomCounts[s.room].push(s);
        }
      });

      Object.entries(roomCounts).forEach(([room, rSlots]) => {
        if (rSlots.length > 1) {
          const classes = rSlots.map(s => `Std ${s.standard}-${s.section} (${s.subject})`).join(' and ');
          conflicts.push({
            id: `cnf-rm-${key}-${room.replace(/\s+/g, '_')}`,
            type: 'room_clash',
            severity: 'blocking',
            day: rSlots[0].day,
            period: rSlots[0].period,
            time: rSlots[0].time,
            entityName: room,
            description: `Room ${room} is simultaneously assigned to ${classes} during Period ${rSlots[0].period} on ${rSlots[0].day}.`,
            resolutionSuggestion: `Change room allocation for one of the classes to an unassigned classroom.`,
            slotIds: rSlots.map(s => s.id)
          });
        }
      });
    });

    // 4. Teacher Weekly Workload Limits
    const teacherLoads: Record<string, number> = {};
    timetables.forEach(slot => {
      if (!slot.isBreak && slot.teacherId) {
        teacherLoads[slot.teacherId] = (teacherLoads[slot.teacherId] || 0) + 1;
      }
    });

    teachers.forEach(t => {
      const load = teacherLoads[t.id] || 0;
      if (load > t.maxWeeklyWorkload) {
        conflicts.push({
          id: `cnf-wk-${t.id}`,
          type: 'workload_exceeded',
          severity: 'warning',
          day: 'Weekly Schedule',
          period: 0,
          time: 'All Periods',
          entityName: t.name,
          description: `${t.name} exceeds max teaching allocation (${load} periods assigned vs max limit of ${t.maxWeeklyWorkload}).`,
          resolutionSuggestion: `Redistribute teaching periods to another department faculty member or adjust workload quota.`
        });
      }
    });

    // 5. Approved Faculty Leave Clash (Unavailable)
    leaveRequests.filter(l => l.status === 'approved').forEach(leave => {
      const teacherSlots = timetables.filter(s => s.teacherId === leave.staffId);
      if (teacherSlots.length > 0) {
        conflicts.push({
          id: `cnf-leave-${leave.id}`,
          type: 'unavailable',
          severity: 'warning',
          day: `${leave.startDate} to ${leave.endDate}`,
          period: 0,
          time: 'Leave Period',
          entityName: leave.staffName,
          description: `${leave.staffName} has approved ${leave.leaveType} (${leave.startDate} to ${leave.endDate}) with ${teacherSlots.length} weekly periods requiring substitution.`,
          resolutionSuggestion: `Deploy substitute faculty via the Leaves & Substitutions panel to avoid classroom downtime.`
        });
      }
    });

    return conflicts;
  };

  // Run validation whenever timetable slots change
  useEffect(() => {
    const c = validateTimetableConflicts();
    setTimetableConflicts(c);
  }, [timetables, teachers]);

  // Audit logging helper
  const logAudit = (
    actorRole: string,
    actorName: string,
    action: string,
    module: string,
    details: string,
    entityId?: string
  ) => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp,
      actorRole,
      actorName,
      action,
      module,
      details,
      entityId
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Timetable Operations
  const updateTimetableSlot = (slotId: string, data: Partial<TimetableSlot>) => {
    setTimetables(prev =>
      prev.map(s => {
        if (s.id === slotId) {
          const updated = { ...s, ...data };
          // If teacher changed, update teacherName
          if (data.teacherId) {
            const t = teachers.find(tch => tch.id === data.teacherId);
            if (t) updated.teacherName = t.name;
          }
          return updated;
        }
        return s;
      })
    );
    setTimetableVersion(prev => ({ ...prev, status: 'draft' }));
    logAudit('Vice Principal', 'Prof. Marcus Vance', 'TIMETABLE_SLOT_EDITED', 'Timetable Management', `Modified timetable slot ${slotId}`);
  };

  const addTimetableSlot = (slot: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...slot,
      id: `tt-${Date.now()}`
    };
    setTimetables(prev => [...prev, newSlot]);
    setTimetableVersion(prev => ({ ...prev, status: 'draft' }));
    logAudit('Vice Principal', 'Prof. Marcus Vance', 'TIMETABLE_SLOT_ADDED', 'Timetable Management', `Added ${slot.subject} for Std ${slot.standard}-${slot.section}`);
  };

  const deleteTimetableSlot = (slotId: string) => {
    setTimetables(prev => prev.filter(s => s.id !== slotId));
    setTimetableVersion(prev => ({ ...prev, status: 'draft' }));
    logAudit('Vice Principal', 'Prof. Marcus Vance', 'TIMETABLE_SLOT_DELETED', 'Timetable Management', `Deleted timetable slot ${slotId}`);
  };

  const swapTimetableSlots = (slotId1: string, slotId2: string) => {
    setTimetables(prev => {
      const s1 = prev.find(s => s.id === slotId1);
      const s2 = prev.find(s => s.id === slotId2);
      if (!s1 || !s2) return prev;

      return prev.map(s => {
        if (s.id === slotId1) {
          return { ...s, period: s2.period, time: s2.time, day: s2.day };
        }
        if (s.id === slotId2) {
          return { ...s, period: s1.period, time: s1.time, day: s1.day };
        }
        return s;
      });
    });
    setTimetableVersion(prev => ({ ...prev, status: 'draft' }));
    logAudit('Vice Principal', 'Prof. Marcus Vance', 'TIMETABLE_SLOTS_SWAPPED', 'Timetable Management', `Swapped slots ${slotId1} and ${slotId2}`);
  };

  const publishTimetable = (publisherName: string) => {
    const conflicts = validateTimetableConflicts();
    const blockingConflicts = conflicts.filter(c => c.severity === 'blocking');

    if (blockingConflicts.length > 0) {
      return {
        success: false,
        message: `Publication blocked: ${blockingConflicts.length} critical timetable clash(es) must be resolved first.`,
        conflicts: blockingConflicts
      };
    }

    const now = new Date();
    const publishedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setTimetableVersion({
      id: `tv-${Date.now()}`,
      academicYear: '2026–2027',
      term: 'Term 2',
      status: 'published',
      publishedAt,
      publishedBy: publisherName,
      conflictsCount: conflicts.length
    });

    logAudit('Principal', publisherName, 'TIMETABLE_PUBLISHED', 'Timetable Management', `Published Term 2 Master Timetable (${timetables.length} periods active across classes)`);

    return {
      success: true,
      message: 'Master Timetable published successfully! All student and faculty schedules updated.',
      conflicts: []
    };
  };

  const rollbackTimetable = () => {
    setTimetableVersion(prev => ({ ...prev, status: 'draft' }));
    logAudit('Vice Principal', 'Prof. Marcus Vance', 'TIMETABLE_REVISED', 'Timetable Management', 'Returned published timetable to draft state for scheduling revisions.');
    showToast('Timetable returned to Draft mode for editing.', 'info');
  };

  // ========================================================
  // ACADEMIC MANAGEMENT HANDLERS (PROMPT 3)
  // ========================================================

  const addAcademicYear = (yearData: Omit<AcademicYear, 'id'>) => {
    if (new Date(yearData.endDate) <= new Date(yearData.startDate)) {
      showToast('Validation failed: Academic year end date must be after start date.', 'error');
      return { success: false, message: 'Academic year end date must be after start date.' };
    }

    const newYear: AcademicYear = {
      ...yearData,
      id: `ay-${Date.now()}`
    };

    if (newYear.status === 'active') {
      setAcademicYears(prev => [
        newYear,
        ...prev.map(y => (y.status === 'active' ? { ...y, status: 'archived' as const } : y))
      ]);
      setActiveAcademicYearId(newYear.id);
    } else {
      setAcademicYears(prev => [newYear, ...prev]);
    }

    logAudit('Principal', 'Dr. Evelyn Montgomery', 'ACADEMIC_YEAR_CREATED', 'Academic Governance', `Created academic session ${newYear.name} (${newYear.startDate} to ${newYear.endDate})`, newYear.id);
    showToast(`Academic Year ${newYear.name} created successfully.`, 'success');
    return { success: true, message: 'Academic year registered.' };
  };

  const updateAcademicYear = (id: string, data: Partial<AcademicYear>) => {
    const existing = academicYears.find(y => y.id === id);
    if (!existing) return { success: false, message: 'Academic year not found.' };

    const newStart = data.startDate || existing.startDate;
    const newEnd = data.endDate || existing.endDate;

    if (new Date(newEnd) <= new Date(newStart)) {
      showToast('Validation error: End date must be strictly after start date.', 'error');
      return { success: false, message: 'End date must be after start date.' };
    }

    setAcademicYears(prev =>
      prev.map(y => {
        if (y.id === id) {
          return { ...y, ...data };
        }
        if (data.status === 'active' && y.id !== id && y.status === 'active') {
          return { ...y, status: 'archived' as const };
        }
        return y;
      })
    );

    if (data.status === 'active') {
      setActiveAcademicYearId(id);
    }

    logAudit('Principal', 'Dr. Evelyn Montgomery', 'ACADEMIC_YEAR_UPDATED', 'Academic Governance', `Updated academic session ${existing.name}`, id);
    showToast(`Academic Year ${existing.name} updated successfully.`, 'success');
    return { success: true, message: 'Academic year updated.' };
  };

  const archiveAcademicYear = (id: string) => {
    const target = academicYears.find(y => y.id === id);
    if (!target) return;
    setAcademicYears(prev => prev.map(y => (y.id === id ? { ...y, status: 'archived' as const } : y)));
    logAudit('Principal', 'Dr. Evelyn Montgomery', 'ACADEMIC_YEAR_ARCHIVED', 'Academic Governance', `Archived academic year ${target.name}`, id);
    showToast(`Academic Year ${target.name} archived. Historical records preserved.`, 'info');
  };

  // Class & Section Handlers
  const addClass = (clsData: Omit<ClassEntity, 'id' | 'sections'>) => {
    const newClass: ClassEntity = {
      ...clsData,
      id: `cls-${Date.now()}`,
      sections: [
        {
          id: `sec-${Date.now()}-a`,
          classId: `cls-${Date.now()}`,
          standard: clsData.standard,
          section: 'A',
          name: `${clsData.standard}-A`,
          room: `Room ${clsData.standard}01`,
          capacity: 40,
          enrolledCount: 0,
          status: 'active'
        }
      ]
    };
    setClasses(prev => [...prev, newClass]);
    logAudit('Vice Principal', 'Prof. Marcus Vance', 'CLASS_CREATED', 'Curriculum Management', `Created ${clsData.name} (${clsData.wing})`, newClass.id);
    showToast(`Created ${clsData.name} with default Section A.`, 'success');
  };

  const updateClass = (id: string, data: Partial<ClassEntity>) => {
    setClasses(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));
    logAudit('Vice Principal', 'Prof. Marcus Vance', 'CLASS_UPDATED', 'Curriculum Management', `Updated class configuration ${id}`);
    showToast('Class configuration updated.', 'success');
  };

  const addSection = (classId: string, sectionData: Omit<SectionEntity, 'id' | 'classId' | 'enrolledCount' | 'status'>) => {
    const targetClass = classes.find(c => c.id === classId);
    if (!targetClass) {
      showToast('Class not found.', 'error');
      return { success: false, message: 'Class not found.' };
    }

    const secUpper = sectionData.section.trim().toUpperCase();
    const isDuplicate = targetClass.sections.some(
      s => s.section.toUpperCase() === secUpper && s.status !== 'archived'
    );

    if (isDuplicate) {
      showToast(`Section ${secUpper} already exists for ${targetClass.name}. Duplicate section codes are not permitted.`, 'error');
      return { success: false, message: `Section ${secUpper} already exists in this standard.` };
    }

    const newSec: SectionEntity = {
      ...sectionData,
      id: `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      classId,
      section: secUpper,
      name: `${targetClass.standard}-${secUpper}`,
      enrolledCount: 0,
      status: 'active'
    };

    setClasses(prev =>
      prev.map(c => (c.id === classId ? { ...c, sections: [...c.sections, newSec] } : c))
    );

    logAudit('Vice Principal', 'Prof. Marcus Vance', 'SECTION_CREATED', 'Curriculum Management', `Added Section ${newSec.name} to ${targetClass.name}`, newSec.id);
    showToast(`Section ${newSec.name} registered under ${targetClass.name}.`, 'success');
    return { success: true, message: 'Section created successfully.' };
  };

  const updateSection = (sectionId: string, data: Partial<SectionEntity>) => {
    setClasses(prev =>
      prev.map(c => ({
        ...c,
        sections: c.sections.map(s => (s.id === sectionId ? { ...s, ...data } : s))
      }))
    );
    showToast('Section details and faculty assignment updated.', 'success');
  };

  const archiveSection = (sectionId: string) => {
    setClasses(prev =>
      prev.map(c => ({
        ...c,
        sections: c.sections.map(s => (s.id === sectionId ? { ...s, status: 'archived' as const } : s))
      }))
    );
    logAudit('Vice Principal', 'Prof. Marcus Vance', 'SECTION_ARCHIVED', 'Curriculum Management', `Archived section ${sectionId}`);
    showToast('Section archived. Enrolled roster remains protected.', 'info');
  };

  // Subject Handlers
  const addSubject = (subjData: Omit<SubjectEntity, 'id'>) => {
    const newSubj: SubjectEntity = {
      ...subjData,
      id: `sub-${Date.now()}`
    };
    setSubjects(prev => [...prev, newSubj]);
    logAudit('Vice Principal', 'Prof. Marcus Vance', 'SUBJECT_ADDED', 'Curriculum Management', `Added subject ${newSubj.name} (${newSubj.code})`, newSubj.id);
    showToast(`Subject ${newSubj.name} added to curriculum register.`, 'success');
  };

  const updateSubject = (id: string, data: Partial<SubjectEntity>) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));
    showToast('Subject specifications updated.', 'success');
  };

  const deleteSubject = (id: string) => {
    const s = subjects.find(sub => sub.id === id);
    setSubjects(prev => prev.filter(sub => sub.id !== id));
    logAudit('Vice Principal', 'Prof. Marcus Vance', 'SUBJECT_DELETED', 'Curriculum Management', `Removed subject ${s?.name || id}`);
    showToast(`Subject ${s?.name || ''} removed from active curriculum.`, 'info');
  };

  const saveSubjectAllocation = (allocData: Omit<SubjectAllocation, 'id'>) => {
    const existingIndex = subjectAllocations.findIndex(
      a =>
        a.standard === allocData.standard &&
        a.section === allocData.section &&
        a.subjectId === allocData.subjectId &&
        a.academicYear === allocData.academicYear
    );

    if (existingIndex >= 0) {
      setSubjectAllocations(prev =>
        prev.map((a, idx) => (idx === existingIndex ? { ...a, ...allocData } : a))
      );
      showToast(`Updated allocation for Std ${allocData.standard}-${allocData.section} · ${allocData.subjectName}.`, 'success');
    } else {
      const newAlloc: SubjectAllocation = {
        ...allocData,
        id: `sa-${Date.now()}`
      };
      setSubjectAllocations(prev => [...prev, newAlloc]);
      showToast(`Allocated ${allocData.teacherName || 'Faculty'} to Std ${allocData.standard}-${allocData.section} (${allocData.subjectName}).`, 'success');
    }

    logAudit('Vice Principal', 'Prof. Marcus Vance', 'SUBJECT_ALLOCATED', 'Academic Allocations', `Allocated ${allocData.teacherName} for Std ${allocData.standard}-${allocData.section} · ${allocData.subjectName}`);
    return { success: true, message: 'Subject allocation saved.' };
  };

  const deleteSubjectAllocation = (id: string) => {
    setSubjectAllocations(prev => prev.filter(a => a.id !== id));
    showToast('Subject faculty allocation removed.', 'info');
  };

  // Bell Schedule & Period Handlers
  const updatePeriodDefinition = (id: string, data: Partial<PeriodDefinition>) => {
    setPeriodDefinitions(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
    logAudit('Vice Principal', 'Prof. Marcus Vance', 'PERIOD_CONFIG_UPDATED', 'Bell Schedule', `Updated period schedule for ${id}`);
    showToast('Bell schedule period updated.', 'success');
  };

  const addPeriodDefinition = (periodData: Omit<PeriodDefinition, 'id'>) => {
    const newPeriod: PeriodDefinition = {
      ...periodData,
      id: `prd-${Date.now()}`
    };
    setPeriodDefinitions(prev => [...prev, newPeriod].sort((a, b) => a.displayOrder - b.displayOrder));
    logAudit('Vice Principal', 'Prof. Marcus Vance', 'PERIOD_CONFIG_ADDED', 'Bell Schedule', `Added period ${newPeriod.name}`, newPeriod.id);
    showToast(`Added ${newPeriod.name} to school bell schedule.`, 'success');
  };

  // Timetable Revision Lifecycle
  const createTimetableRevision = (notes: string) => {
    const nextVer = `v2.${timetableRevisions.length + 1}`;
    const newRev: TimetableRevision = {
      id: `rev-${Date.now()}`,
      versionNo: nextVer,
      academicYear: '2026–2027',
      term: 'Term 2',
      status: 'draft',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      createdBy: 'Prof. Marcus Vance',
      notes,
      slotsCount: timetables.length,
      conflictsCount: timetableConflicts.filter(c => c.severity === 'blocking').length
    };
    setTimetableRevisions(prev => [newRev, ...prev]);
    setTimetableVersion({
      id: newRev.id,
      academicYear: '2026–2027',
      term: 'Term 2',
      status: 'draft',
      conflictsCount: newRev.conflictsCount,
      versionNo: nextVer,
      notes
    });
    logAudit('Vice Principal', 'Prof. Marcus Vance', 'TIMETABLE_REVISION_DRAFTED', 'Timetable Management', `Initialized timetable revision draft ${nextVer}: ${notes}`, newRev.id);
    showToast(`Draft revision ${nextVer} initialized. Modifications will remain draft until published.`, 'success');
  };

  // Academic Calendar Event Actions
  const addSchoolEvent = (eventData: Omit<SchoolEvent, 'id'>) => {
    const newEvent: SchoolEvent = {
      ...eventData,
      id: `evt-${Date.now()}`
    };
    setEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    logAudit('Principal', 'Dr. Evelyn Montgomery', 'CALENDAR_EVENT_ADDED', 'Academic Calendar', `Added event: ${newEvent.title} on ${newEvent.date}`, newEvent.id);
    showToast(`Event '${newEvent.title}' scheduled on ${newEvent.date}.`, 'success');
  };

  const updateSchoolEvent = (id: string, data: Partial<SchoolEvent>) => {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...data } : e)));
    logAudit('Principal', 'Dr. Evelyn Montgomery', 'CALENDAR_EVENT_UPDATED', 'Academic Calendar', `Updated event ${id}`);
    showToast('Academic calendar event updated.', 'success');
  };

  const deleteSchoolEvent = (id: string) => {
    const ev = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    logAudit('Principal', 'Dr. Evelyn Montgomery', 'CALENDAR_EVENT_DELETED', 'Academic Calendar', `Deleted event: ${ev?.title || id}`);
    showToast(`Event '${ev?.title || ''}' removed from calendar.`, 'info');
  };

  // Staff Leave & Substitution Actions
  const submitLeaveRequest = (
    staffId: string,
    staffName: string,
    leaveType: StaffLeaveRequest['leaveType'],
    startDate: string,
    endDate: string,
    reason: string,
    attachmentName?: string
  ): { success: boolean; message: string } => {
    if (!startDate || !endDate || !reason.trim()) {
      showToast('Validation error: Please complete all required leave application fields.', 'error');
      return { success: false, message: 'All required fields must be filled.' };
    }
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      showToast('Validation error: End date cannot be prior to start date.', 'error');
      return { success: false, message: 'End date cannot be prior to start date.' };
    }

    // Overlap validation
    const hasOverlap = leaveRequests.some(r => {
      if (r.staffId !== staffId || r.status === 'rejected' || r.status === 'cancelled') return false;
      return startDate <= r.endDate && endDate >= r.startDate;
    });
    if (hasOverlap) {
      showToast('Conflict: An active or pending leave application already exists covering these dates.', 'error');
      return { success: false, message: 'Conflict: Overlapping leave application already exists.' };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysCount = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);

    const now = new Date();
    const appliedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newReq: StaffLeaveRequest = {
      id: `lvr-${Date.now()}`,
      staffId,
      staffName,
      leaveType,
      startDate,
      endDate,
      daysCount,
      reason,
      status: 'pending',
      appliedAt,
      affectedPeriodsCount: Math.min(18, daysCount * 4),
      attachmentName: attachmentName || undefined,
      attachmentSize: attachmentName ? '1.4 MB' : undefined
    };
    setLeaveRequests(prev => [newReq, ...prev]);
    logAudit('Teacher', staffName, 'LEAVE_REQUESTED', 'Staff Management', `Requested ${leaveType} from ${startDate} to ${endDate} (${daysCount} days)`, newReq.id);
    showToast(`Leave application submitted successfully for ${daysCount} day(s).`, 'success');
    return { success: true, message: 'Leave application submitted successfully.' };
  };

  const cancelLeaveRequest = (requestId: string) => {
    const req = leaveRequests.find(r => r.id === requestId);
    if (!req) return;
    if (req.status !== 'pending') {
      showToast('Only pending leave requests can be cancelled.', 'warning');
      return;
    }
    setLeaveRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'cancelled', cancelledAt: new Date().toISOString() } : r));
    logAudit('Staff', req.staffName, 'LEAVE_CANCELLED', 'Staff Management', `Cancelled pending leave request ${requestId}`);
    showToast('Leave application withdrawn and cancelled.', 'info');
  };

  const approveLeaveRequest = (requestId: string, reviewerName: string, remarks?: string) => {
    setLeaveRequests(prev =>
      prev.map(r =>
        r.id === requestId
          ? {
              ...r,
              status: 'approved',
              reviewedBy: reviewerName,
              reviewRemarks: remarks || 'Leave approved. Substitution planning initiated.'
            }
          : r
      )
    );

    // Update teacher employment status to 'On Leave'
    const target = leaveRequests.find(r => r.id === requestId);
    if (target) {
      setTeachers(prev =>
        prev.map(t => (t.id === target.staffId ? { ...t, employmentStatus: 'On Leave' } : t))
      );

      // Auto-reflect in staff attendance
      setStaffAttendance(prev => {
        const copy = [...prev];
        const existingIdx = copy.findIndex(s => s.staffId === target.staffId && s.date === target.startDate);
        const tObj = teachers.find(t => t.id === target.staffId);
        const recordData: StaffAttendanceRecord = {
          id: existingIdx >= 0 ? copy[existingIdx].id : `stf-att-${Date.now()}`,
          staffId: target.staffId,
          staffName: target.staffName,
          empId: tObj?.empId || 'STAFF',
          department: tObj?.department || 'Faculty',
          staffCategory: 'Teaching',
          date: target.startDate,
          status: 'on_leave',
          leaveType: target.leaveType,
          leaveRequestId: target.id,
          remarks: `Approved ${target.leaveType}: ${target.reason}`,
          markedBy: reviewerName
        };
        if (existingIdx >= 0) copy[existingIdx] = recordData;
        else copy.unshift(recordData);
        return copy;
      });

      logAudit('Principal', reviewerName, 'LEAVE_APPROVED', 'Staff Management', `Approved leave for ${target.staffName}`, requestId);
      showToast(`Leave approved for ${target.staffName}. Staff attendance updated.`, 'success');
    }
  };

  const rejectLeaveRequest = (requestId: string, reviewerName: string, remarks?: string) => {
    setLeaveRequests(prev =>
      prev.map(r =>
        r.id === requestId
          ? {
              ...r,
              status: 'rejected',
              reviewedBy: reviewerName,
              reviewRemarks: remarks || 'Leave request declined due to academic scheduling.'
            }
          : r
      )
    );
    logAudit('Principal', reviewerName, 'LEAVE_REJECTED', 'Staff Management', `Declined leave request ${requestId}`, requestId);
    showToast(`Leave request declined by ${reviewerName}.`, 'warning');
  };

  const assignSubstitute = (subData: Omit<SubstitutionAssignment, 'id' | 'status'>) => {
    const newSub: SubstitutionAssignment = {
      ...subData,
      id: `sub-${Date.now()}`,
      status: 'scheduled'
    };
    setSubstitutions(prev => [newSub, ...prev]);
    logAudit('Vice Principal', 'Prof. Marcus Vance', 'SUBSTITUTION_ASSIGNED', 'Timetable Coordination', `Assigned ${subData.substituteTeacherName} to cover Period ${subData.period} (Std ${subData.standard}-${subData.section}) for ${subData.originalTeacherName}`, newSub.id);
  };

  const cancelSubstitute = (subId: string) => {
    setSubstitutions(prev => prev.filter(s => s.id !== subId));
    logAudit('Vice Principal', 'Prof. Marcus Vance', 'SUBSTITUTION_CANCELLED', 'Timetable Coordination', `Cancelled substitution ${subId}`);
  };

  // Student Transfers & Withdrawals
  const transferStudent = (studentId: string, toClass: string, reason: string, authorizedBy: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const fromClass = `Class ${student.standard}-${student.section}`;
    const [stdStr, secStr] = toClass.replace(/Class\s*/i, '').split('-');
    const newStd = Number(stdStr);
    const newSec = (secStr || 'A') as 'A' | 'B';

    // Update student class while preserving records
    setStudents(prev =>
      prev.map(s =>
        s.id === studentId
          ? {
              ...s,
              standard: newStd,
              section: newSec,
              previousClass: fromClass
            }
          : s
      )
    );

    const now = new Date().toISOString().split('T')[0];
    const newRecord: StudentTransferRecord = {
      id: `trf-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      admissionNo: student.admissionNo,
      fromClass,
      toClass,
      effectiveDate: now,
      reason,
      authorizedBy
    };
    setTransfers(prev => [newRecord, ...prev]);
    logAudit('Principal', authorizedBy, 'STUDENT_SECTION_TRANSFERRED', 'Student Management', `Transferred ${student.name} from ${fromClass} to ${toClass}. Reason: ${reason}`, student.id);
    showToast(`Transferred ${student.name} from ${fromClass} to ${toClass}.`, 'success');
  };

  const withdrawStudent = (studentId: string, reason: string, authorizedBy: string) => {
    const student = students.find(s => s.id === studentId);
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, status: 'Withdrawn' } : s))
    );
    logAudit('Principal', authorizedBy, 'STUDENT_WITHDRAWN', 'Student Management', `Student ${studentId} marked Withdrawn. Reason: ${reason}`);
    showToast(`Student ${student?.name || studentId} marked as Withdrawn.`, 'info');
  };

  // Student Promotion Preview and Execution
  const previewPromotion = (fromStandard: number): StudentPromotionPreview[] => {
    const candidates = students.filter(s => s.standard === fromStandard && s.status === 'Active');
    return candidates.map(s => {
      const isGraduating = s.standard >= 10;
      const isFailing = s.attendanceRate < 70;
      const decision: 'Promote' | 'Retain' | 'Graduate' = isGraduating
        ? 'Graduate'
        : isFailing
        ? 'Retain'
        : 'Promote';

      return {
        studentId: s.id,
        studentName: s.name,
        currentStandard: s.standard,
        currentSection: s.section,
        proposedStandard: isGraduating ? 10 : isFailing ? s.standard : s.standard + 1,
        proposedSection: s.section,
        academicAverage: 88,
        attendanceRate: s.attendanceRate,
        decision,
        status: 'pending'
      };
    });
  };

  const executePromotionRollover = (promotions: StudentPromotionPreview[]) => {
    setStudents(prev =>
      prev.map(s => {
        const promo = promotions.find(p => p.studentId === s.id);
        if (!promo) return s;

        if (promo.decision === 'Graduate') {
          return { ...s, status: 'Graduated' };
        }
        if (promo.decision === 'Promote') {
          return {
            ...s,
            standard: promo.proposedStandard,
            section: promo.proposedSection,
            previousClass: `Class ${s.standard}-${s.section}`
          };
        }
        return s;
      })
    );

    logAudit('Principal', 'Dr. Evelyn Montgomery', 'CLASS_PROMOTION_ROLLOVER', 'Academic Rollover', `Executed annual rollover for ${promotions.length} students into academic year 2027–28.`);
  };

  // Staff Workload limit
  const updateTeacherWorkloadLimit = (teacherId: string, limit: number) => {
    setTeachers(prev =>
      prev.map(t => (t.id === teacherId ? { ...t, maxWeeklyWorkload: limit } : t))
    );
    logAudit('Principal', 'Dr. Evelyn Montgomery', 'STAFF_WORKLOAD_LIMIT_UPDATED', 'Staff Management', `Updated max weekly workload limit to ${limit} for teacher ${teacherId}`);
  };

  // Existing CRUD Actions
  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  const addStudent = (studentData: Omit<Student, 'id' | 'status'>) => {
    // Permission check: parents, accountants, librarians, teachers cannot enroll official students
    if (currentRole === 'parent_mobile' || currentRole === 'accountant' || currentRole === 'librarian' || currentRole === 'teacher_web' || currentRole === 'teacher_mobile') {
      logAudit(currentRole || 'Unknown', 'Security Guard', 'UNAUTHORIZED_STUDENT_ENROLL_ATTEMPT', 'Security', `Blocked unauthorized attempt by role ${currentRole} to enroll student.`);
      showToast(`Unauthorized: Role "${currentRole}" does not have student enrollment clearance.`, 'error');
      return;
    }

    // Uniqueness validation
    const existing = students.find(s => s.admissionNo.toLowerCase() === studentData.admissionNo.toLowerCase().trim());
    if (existing) {
      logAudit(currentRole || 'Principal', 'Admin User', 'STUDENT_ENROLL_CONFLICT', 'Student Management', `Attempted duplicate enrollment with admission number ${studentData.admissionNo}.`);
      showToast(`Admission conflict: Admission number "${studentData.admissionNo}" already exists for ${existing.name}.`, 'error');
      return;
    }

    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`,
      status: 'Active'
    };
    setStudents(prev => [newStudent, ...prev]);
    logAudit(currentRole === 'receptionist' ? 'Receptionist' : currentRole === 'vice_principal' ? 'Vice Principal' : 'Principal', 'Institutional Admin', 'STUDENT_ENROLLED', 'Student Management', `Enrolled ${studentData.name} (${studentData.admissionNo}) in Std ${studentData.standard}-${studentData.section}`, newStudent.id);
    showToast(`Student ${newStudent.name} (${newStudent.admissionNo}) enrolled in Std ${newStudent.standard}-${newStudent.section}.`, 'success');
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    if (currentRole === 'parent_mobile' || currentRole === 'accountant' || currentRole === 'librarian' || currentRole === 'teacher_web' || currentRole === 'teacher_mobile') {
      logAudit(currentRole || 'Unknown', 'Security Guard', 'UNAUTHORIZED_STUDENT_EDIT_ATTEMPT', 'Security', `Blocked unauthorized attempt by role ${currentRole} to edit student ${id}.`);
      showToast(`Unauthorized: Role "${currentRole}" cannot modify official student records.`, 'error');
      return;
    }

    const existing = students.find(s => s.id === id);
    if (!existing) {
      showToast(`Error: Student record not found.`, 'error');
      return;
    }

    // Field-level restrictions: if receptionist, only allow demographic & guardian fields
    let safeData = { ...data };
    if (currentRole === 'receptionist') {
      safeData = {
        name: data.name ?? existing.name,
        dob: data.dob ?? existing.dob,
        bloodGroup: data.bloodGroup ?? existing.bloodGroup,
        address: data.address ?? existing.address,
        medicalAlerts: data.medicalAlerts ?? existing.medicalAlerts,
        parentName: data.parentName ?? existing.parentName,
        parentRelationship: data.parentRelationship ?? existing.parentRelationship,
        parentPhone: data.parentPhone ?? existing.parentPhone,
        parentEmail: data.parentEmail ?? existing.parentEmail,
        emergencyContact: data.emergencyContact ?? existing.emergencyContact,
        secondaryGuardianName: data.secondaryGuardianName ?? existing.secondaryGuardianName,
        secondaryGuardianRelationship: data.secondaryGuardianRelationship ?? existing.secondaryGuardianRelationship,
        secondaryGuardianPhone: data.secondaryGuardianPhone ?? existing.secondaryGuardianPhone,
        documentsSubmitted: data.documentsSubmitted ?? existing.documentsSubmitted
      };
    }

    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...safeData } : s)));
    logAudit(currentRole === 'receptionist' ? 'Receptionist' : currentRole === 'vice_principal' ? 'Vice Principal' : 'Principal', 'Institutional Admin', 'STUDENT_UPDATED', 'Student Management', `Updated student details for ${existing.name} (${existing.admissionNo})`, id);
    showToast(`Student dossier for ${existing.name} (${existing.admissionNo}) updated successfully.`, 'success');
  };

  const deleteStudent = (id: string) => {
    if (currentRole !== 'principal') {
      logAudit(currentRole || 'Unknown', 'Security Guard', 'UNAUTHORIZED_STUDENT_DELETE_ATTEMPT', 'Security', `Blocked unauthorized attempt by role ${currentRole} to delete student ${id}.`);
      showToast(`Unauthorized: Only the Principal can archive or remove student records.`, 'error');
      return;
    }
    const s = students.find(stu => stu.id === id);
    setStudents(prev => prev.filter(stu => stu.id !== id));
    logAudit('Principal', 'Dr. Evelyn Montgomery', 'STUDENT_DELETED', 'Student Management', `Archived/removed student record ${s?.name || id}`, id);
    showToast(`Student record for ${s?.name || id} has been archived.`, 'info');
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'currentWeeklyWorkload'>) => {
    if (currentRole !== 'principal' && currentRole !== 'vice_principal' && currentRole !== 'admin' && currentRole !== 'hr_manager') {
      logAudit(currentRole || 'Unknown', 'Security Guard', 'UNAUTHORIZED_STAFF_APPOINT_ATTEMPT', 'Security', `Blocked unauthorized attempt by role ${currentRole} to appoint staff.`);
      showToast(`Unauthorized: Only Principal and Vice Principal can appoint staff.`, 'error');
      return;
    }

    const conflict = teachers.find(t => t.empId.toLowerCase() === teacherData.empId.toLowerCase().trim());
    if (conflict) {
      logAudit(currentRole || 'Principal', 'School Leadership', 'STAFF_APPOINT_CONFLICT', 'Staff Management', `Attempted duplicate staff creation with emp ID ${teacherData.empId}.`);
      showToast(`Conflict: Employee ID "${teacherData.empId}" is already assigned to ${conflict.name}.`, 'error');
      return;
    }

    const newTeacher: Teacher = {
      ...teacherData,
      id: `tch-${Date.now()}`,
      currentWeeklyWorkload: teacherData.staffCategory === 'Teaching' ? 18 : 0
    };
    setTeachers(prev => [newTeacher, ...prev]);
    logAudit(currentRole === 'vice_principal' ? 'Vice Principal' : 'Principal', 'School Leadership', 'STAFF_APPOINTED', 'Staff Management', `Appointed ${teacherData.name} (${teacherData.designation}) in ${teacherData.department} [${teacherData.empId}]`, newTeacher.id);
    showToast(`${teacherData.staffCategory === 'Teaching' ? 'Faculty member' : 'Staff member'} ${teacherData.name} (${teacherData.empId}) appointed to ${teacherData.department}.`, 'success');
  };

  const updateTeacher = (id: string, data: Partial<Teacher>) => {
    if (currentRole !== 'principal' && currentRole !== 'vice_principal' && currentRole !== 'admin' && currentRole !== 'hr_manager') {
      logAudit(currentRole || 'Unknown', 'Security Guard', 'UNAUTHORIZED_STAFF_EDIT_ATTEMPT', 'Security', `Blocked unauthorized attempt by role ${currentRole} to edit staff ${id}.`);
      showToast(`Unauthorized: Only School Leadership can edit employee records.`, 'error');
      return;
    }

    const existing = teachers.find(t => t.id === id);
    if (!existing) {
      showToast(`Error: Employee record not found.`, 'error');
      return;
    }

    let safeData = { ...data };
    if (currentRole === 'vice_principal') {
      safeData = {
        ...safeData,
        employmentStatus: data.employmentStatus || existing.employmentStatus
      };
    }

    // Sync all related staff references across school modules if name changed
    if (data.name && data.name !== existing.name) {
      const newStaffName = data.name;
      setTimetables(prev => prev.map(slot => slot.teacherId === id ? { ...slot, teacherName: newStaffName } : slot));
      setSubstitutions(prev => prev.map(sub => {
        let updated = { ...sub };
        if (sub.originalTeacherId === id) updated.originalTeacherName = newStaffName;
        if (sub.substituteTeacherId === id) updated.substituteTeacherName = newStaffName;
        return updated;
      }));
      setSubjectAllocations(prev => prev.map(a => a.teacherId === id ? { ...a, teacherName: newStaffName } : a));
      setAppointments(prev => prev.map(apt => apt.staffId === id ? { ...apt, staffName: newStaffName } : apt));
      setReceptionRequests(prev => prev.map(req => req.assignedStaff === existing.name ? { ...req, assignedStaff: newStaffName } : req));
      setExamScheduleSlots(prev => prev.map(slot => slot.examinerTeacherId === id ? { ...slot, examinerTeacherName: newStaffName } : slot));
      setClasses(prev => prev.map(c => {
        let updatedClass = { ...c };
        if (c.coordinatorId === id) updatedClass.coordinatorName = newStaffName;
        if (c.sections) {
          updatedClass.sections = c.sections.map(sec => sec.classTeacherId === id ? { ...sec, classTeacherName: newStaffName } : sec);
        }
        return updatedClass;
      }));
      setTransportDrivers(prev => prev.map(drv => (drv.id === id || drv.name === existing.name) ? { ...drv, name: newStaffName } : drv));
    }

    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...safeData } : t)));
    logAudit(currentRole === 'vice_principal' ? 'Vice Principal' : 'Principal', 'School Leadership', 'STAFF_UPDATED', 'Staff Management', `Modified staff record ${existing.name} (${existing.empId})`, id);
    showToast(`Staff record for ${existing.name} (${existing.empId}) updated successfully.`, 'success');
  };

  const deleteTeacher = (id: string) => {
    if (currentRole !== 'principal') {
      logAudit(currentRole || 'Unknown', 'Security Guard', 'UNAUTHORIZED_STAFF_DELETE_ATTEMPT', 'Security', `Blocked unauthorized attempt by role ${currentRole} to archive staff ${id}.`);
      showToast(`Unauthorized: Only the Principal can archive faculty and staff.`, 'error');
      return;
    }
    const t = teachers.find(tch => tch.id === id);
    setTeachers(prev => prev.filter(tch => tch.id !== id));
    logAudit('Principal', 'Dr. Evelyn Montgomery', 'STAFF_ARCHIVED', 'Staff Management', `Archived staff member ${t?.name || id}`, id);
    showToast(`Staff record for ${t?.name || id} archived.`, 'info');
  };

  // Attendance & Daily Operations Handlers (Prompt 4)
  const saveAttendanceSession = (sessionData: {
    standard: number;
    section: 'A' | 'B';
    date: string;
    session: string;
    period?: number;
    isDraft: boolean;
    records: Array<{
      studentId: string;
      studentName: string;
      rollNo: number;
      status: AttendanceRecord['status'];
      period?: number;
      arrivalTime?: string;
      departureTime?: string;
      remarks?: string;
    }>;
    submittedByName: string;
  }): { success: boolean; message: string; unmarkedCount: number } => {
    const sessionKey = sessionData.period !== undefined ? `period_${sessionData.period}` : sessionData.session;
    const sessionId = `${sessionData.standard}-${sessionData.section}-${sessionData.date}-${sessionKey}`;
    const unmarkedCount = sessionData.records.filter(r => r.status === 'not_marked' || !r.status).length;

    // Upsert individual attendance records preserving existing IDs
    setAttendance(prev => {
      const updated = [...prev];
      sessionData.records.forEach(rec => {
        const pNum = rec.period !== undefined ? rec.period : sessionData.period;
        const idx = updated.findIndex(a => {
          if (a.studentId !== rec.studentId || a.date !== sessionData.date) return false;
          if (pNum !== undefined) {
            return a.period === pNum;
          }
          return a.session === sessionData.session || (!a.session && sessionData.session === 'morning');
        });

        const recordData: AttendanceRecord = {
          id: idx >= 0 ? updated[idx].id : `att-${Date.now()}-${rec.studentId}-${pNum !== undefined ? `p${pNum}` : 'm'}`,
          date: sessionData.date,
          standard: sessionData.standard,
          section: sessionData.section,
          studentId: rec.studentId,
          studentName: rec.studentName,
          rollNo: rec.rollNo,
          status: rec.status,
          session: sessionKey,
          period: pNum,
          arrivalTime: rec.arrivalTime,
          departureTime: rec.departureTime,
          remarks: rec.remarks,
          markedBy: sessionData.submittedByName,
          isDraft: sessionData.isDraft
        };
        if (idx >= 0) {
          updated[idx] = recordData;
        } else {
          updated.unshift(recordData);
        }
      });
      return updated;
    });

    // Compute session counts
    const presentCount = sessionData.records.filter(r => r.status === 'present').length;
    const absentCount = sessionData.records.filter(r => r.status === 'absent').length;
    const lateCount = sessionData.records.filter(r => r.status === 'late').length;
    const excusedCount = sessionData.records.filter(r => r.status === 'excused').length;
    const halfDayCount = sessionData.records.filter(r => r.status === 'half_day').length;

    const newSessionEntity: AttendanceSessionEntity = {
      id: sessionId,
      standard: sessionData.standard,
      section: sessionData.section,
      date: sessionData.date,
      session: sessionKey,
      status: sessionData.isDraft ? 'draft' : 'submitted',
      submittedBy: sessionData.isDraft ? undefined : sessionData.submittedByName,
      submittedAt: sessionData.isDraft ? undefined : new Date().toISOString(),
      lastSavedAt: new Date().toISOString(),
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      halfDayCount,
      unmarkedCount,
      totalStudents: sessionData.records.length
    };

    setAttendanceSessions(prev => {
      const idx = prev.findIndex(s => s.id === sessionId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newSessionEntity;
        return copy;
      }
      return [newSessionEntity, ...prev];
    });

    if (sessionData.isDraft) {
      logAudit(currentRole || 'Teacher', sessionData.submittedByName, 'ATTENDANCE_DRAFT_SAVED', 'Attendance', `Saved draft attendance for Std ${sessionData.standard}-${sessionData.section} (${sessionData.date})`, sessionId);
      showToast(`Draft attendance saved for Std ${sessionData.standard}-${sessionData.section}.`, 'info');
      return { success: true, message: 'Draft saved successfully.', unmarkedCount };
    } else {
      // Recalculate student attendanceRate for enrolled students
      setStudents(prev => {
        return prev.map(stu => {
          if (stu.standard === sessionData.standard && stu.section === sessionData.section) {
            const studentRecords = attendance.filter(a => a.studentId === stu.id && !a.isDraft);
            const currentRec = sessionData.records.find(r => r.studentId === stu.id);
            const total = studentRecords.length + (currentRec && currentRec.status !== 'not_marked' ? 1 : 0);
            if (total === 0) return stu;
            let presentEquivalent = studentRecords.filter(r => r.status === 'present' || r.status === 'late' || r.status === 'excused').length +
              (studentRecords.filter(r => r.status === 'half_day').length * 0.5);
            if (currentRec) {
              if (currentRec.status === 'present' || currentRec.status === 'late' || currentRec.status === 'excused') presentEquivalent += 1;
              else if (currentRec.status === 'half_day') presentEquivalent += 0.5;
            }
            const rate = Math.min(100, Math.round((presentEquivalent / total) * 100));
            return { ...stu, attendanceRate: rate };
          }
          return stu;
        });
      });

      logAudit(currentRole || 'Teacher', sessionData.submittedByName, 'ATTENDANCE_SUBMITTED', 'Attendance', `Finalized and submitted attendance for Std ${sessionData.standard}-${sessionData.section} on ${sessionData.date} (${presentCount} present, ${absentCount} absent, ${lateCount} late)`, sessionId);
      showToast(`Attendance finalized and submitted for Std ${sessionData.standard}-${sessionData.section}.`, 'success');
      return { success: true, message: 'Attendance finalized and submitted successfully.', unmarkedCount };
    }
  };

  const logStudentMovement = (movement: Omit<StudentMovementRecord, 'id' | 'passNo' | 'createdAt'>): StudentMovementRecord => {
    const passNo = `GP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: StudentMovementRecord = {
      ...movement,
      id: `mov-${Date.now()}`,
      passNo,
      createdAt: new Date().toISOString()
    };
    setStudentMovements(prev => [newRecord, ...prev]);

    // Sensible attendance sync: If late_arrival recorded, update today's morning attendance record if student was absent/not marked
    if (movement.type === 'late_arrival') {
      setAttendance(prev => {
        const copy = [...prev];
        const idx = copy.findIndex(
          a => a.studentId === movement.studentId && a.date === movement.date
        );
        if (idx >= 0 && (copy[idx].status === 'absent' || copy[idx].status === 'not_marked')) {
          copy[idx] = {
            ...copy[idx],
            status: 'late',
            arrivalTime: movement.time,
            remarks: `Late arrival verified via Gate Pass ${passNo}: ${movement.reason}`
          };
        }
        return copy;
      });
    }

    logAudit('Front Office', movement.authorizedBy, 'STUDENT_MOVEMENT_LOGGED', 'Daily Operations', `Logged ${movement.type.replace('_', ' ')} Gate Pass ${passNo} for ${movement.studentName} (Std ${movement.standard}-${movement.section})`, newRecord.id);
    showToast(`Gate Pass ${passNo} logged for ${movement.studentName} (${movement.type === 'late_arrival' ? 'Late Arrival' : movement.type === 'early_departure' ? 'Early Departure' : 'Pass'}).`, 'success');
    return newRecord;
  };

  const updateStudentMovement = (id: string, data: Partial<StudentMovementRecord>) => {
    setStudentMovements(prev => prev.map(m => (m.id === id ? { ...m, ...data } : m)));
    showToast('Gate Pass record updated.', 'info');
  };

  const submitCorrectionRequest = (request: Omit<AttendanceCorrectionRequest, 'id' | 'requestedAt' | 'status'>) => {
    const newReq: AttendanceCorrectionRequest = {
      ...request,
      id: `cor-${Date.now()}`,
      requestedAt: new Date().toISOString(),
      status: 'pending'
    };
    setCorrectionRequests(prev => [newReq, ...prev]);
    logAudit(request.requestedByRole, request.requestedByName, 'ATTENDANCE_CORRECTION_REQUESTED', 'Attendance Audit', `Requested attendance change for ${request.studentName} on ${request.date} (${request.originalStatus} -> ${request.requestedStatus}): ${request.reason}`, newReq.id);
    showToast(`Correction request submitted for ${request.studentName}. Awaiting administrative approval.`, 'info');
  };

  const reviewCorrectionRequest = (requestId: string, status: 'approved' | 'rejected', reviewerName: string, remarks?: string) => {
    const target = correctionRequests.find(c => c.id === requestId);
    if (!target) return;

    setCorrectionRequests(prev =>
      prev.map(c =>
        c.id === requestId
          ? {
              ...c,
              status,
              reviewedBy: reviewerName,
              reviewDecisionDate: new Date().toISOString(),
              reviewRemarks: remarks || (status === 'approved' ? 'Correction ratified after verification.' : 'Correction declined.')
            }
          : c
      )
    );

    if (status === 'approved') {
      // Reconcile underlying attendance record
      setAttendance(prev => {
        const copy = [...prev];
        const idx = copy.findIndex(a => a.studentId === target.studentId && a.date === target.date);
        if (idx >= 0) {
          copy[idx] = {
            ...copy[idx],
            status: target.requestedStatus,
            remarks: `Corrected from ${target.originalStatus} by ${reviewerName} (${remarks || 'Approved correction'})`
          };
        } else {
          copy.unshift({
            id: `att-${Date.now()}`,
            date: target.date,
            standard: target.standard,
            section: target.section,
            studentId: target.studentId,
            studentName: target.studentName,
            rollNo: 1,
            status: target.requestedStatus,
            remarks: `Approved correction by ${reviewerName}: ${remarks || ''}`,
            markedBy: reviewerName
          });
        }
        return copy;
      });

      // Recalculate student rate
      setStudents(prev =>
        prev.map(s => {
          if (s.id === target.studentId) {
            const studentRecords = attendance.filter(a => a.studentId === s.id);
            const total = Math.max(1, studentRecords.length);
            const presentCount = studentRecords.filter(r => r.status === 'present' || r.status === 'late' || r.status === 'excused').length;
            return { ...s, attendanceRate: Math.min(100, Math.round((presentCount / total) * 100)) };
          }
          return s;
        })
      );

      logAudit('School Leadership', reviewerName, 'ATTENDANCE_CORRECTION_APPROVED', 'Attendance Audit', `Approved attendance correction for ${target.studentName} on ${target.date} to ${target.requestedStatus}`, requestId);
      showToast(`Correction approved for ${target.studentName}. Attendance record updated.`, 'success');
    } else {
      logAudit('School Leadership', reviewerName, 'ATTENDANCE_CORRECTION_REJECTED', 'Attendance Audit', `Declined attendance correction for ${target.studentName} on ${target.date}: ${remarks || ''}`, requestId);
      showToast(`Correction request rejected for ${target.studentName}.`, 'warning');
    }
  };

  const markStaffAttendance = (record: Omit<StaffAttendanceRecord, 'id'>) => {
    setStaffAttendance(prev => {
      const idx = prev.findIndex(s => s.staffId === record.staffId && s.date === record.date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...record };
        return copy;
      }
      return [{ ...record, id: `stf-att-${Date.now()}` }, ...prev];
    });
    showToast(`Staff attendance updated for ${record.staffName}.`, 'success');
  };

  const bulkMarkStaffAttendance = (records: Omit<StaffAttendanceRecord, 'id'>[]) => {
    if (records.length === 0) return;
    const date = records[0].date;
    setStaffAttendance(prev => {
      const staffIds = new Set(records.map(r => r.staffId));
      const filtered = prev.filter(s => !(s.date === date && staffIds.has(s.staffId)));
      const newEntries: StaffAttendanceRecord[] = records.map((r, idx) => ({
        ...r,
        id: `stf-att-${Date.now()}-${idx}`
      }));
      return [...newEntries, ...filtered];
    });
    logAudit(currentRole || 'Admin', 'Staff HR Desk', 'STAFF_ATTENDANCE_BULK_SAVED', 'Staff Attendance', `Bulk marked ${records.length} faculty and staff members on ${date}`);
    showToast(`Staff attendance register saved for ${records.length} members.`, 'success');
  };

  const updateAttendanceSettings = (settings: Partial<AttendanceSettingsConfig>) => {
    setAttendanceSettings(prev => ({ ...prev, ...settings }));
    logAudit(currentRole || 'Principal', 'School Leadership', 'ATTENDANCE_SETTINGS_UPDATED', 'Settings', 'Updated school attendance policies and calculation thresholds');
    showToast('Attendance rules and policies updated successfully.', 'success');
  };

  const markAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    const existingIndex = attendance.findIndex(
      a => a.studentId === record.studentId && a.date === record.date
    );
    if (existingIndex >= 0) {
      setAttendance(prev => {
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], ...record };
        return copy;
      });
    } else {
      setAttendance(prev => [{ ...record, id: `att-${Date.now()}-${Math.random()}` }, ...prev]);
    }
  };

  const saveBulkAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const today = records[0]?.date;
    if (!today) return;

    setAttendance(prev => {
      const studentIds = new Set(records.map(r => r.studentId));
      const filtered = prev.filter(a => !(a.date === today && studentIds.has(a.studentId)));
      const newEntries: AttendanceRecord[] = records.map((r, idx) => ({
        ...r,
        id: `att-${Date.now()}-${idx}`
      }));
      return [...newEntries, ...filtered];
    });

    logAudit('Teacher', 'Mrs. Shalini Verma', 'ATTENDANCE_REGISTER_SUBMITTED', 'Attendance Register', `Submitted attendance for ${records.length} students in Std ${records[0].standard}-${records[0].section}`);
  };

  const saveMark = (markData: Omit<MarkRecord, 'id'>) => {
    const existingIndex = marks.findIndex(
      m => m.studentId === markData.studentId && m.examName === markData.examName && m.subject === markData.subject
    );
    if (existingIndex >= 0) {
      setMarks(prev => {
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], ...markData };
        return copy;
      });
    } else {
      setMarks(prev => [{ ...markData, id: `mrk-${Date.now()}` }, ...prev]);
    }
  };

  const createAssignment = (assignmentData: Omit<Assignment, 'id'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `asg-${Date.now()}`
    };
    setAssignments(prev => [newAssignment, ...prev]);
    logAudit('Teacher', assignmentData.teacherName, 'ASSIGNMENT_PUBLISHED', 'Academics', `Published homework "${assignmentData.title}" for Std ${assignmentData.standard}-${assignmentData.section}`, newAssignment.id);
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const updateAssignment = (id: string, data: Partial<Assignment>) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    logAudit('Teacher', 'Faculty', 'ASSIGNMENT_UPDATED', 'Academics', `Updated homework task ${id}`, id);
  };

  // Examination & Assessment Methods (Prompt 5)
  const canTeacherAccessSubject = (teacherId: string, standard: number, section: 'A' | 'B', subject: string): boolean => {
    if (currentRole === 'principal' || currentRole === 'vice_principal') return true;
    const match = subjectAllocations.find(a => 
      a.teacherId === teacherId &&
      a.standard === standard &&
      a.section === section &&
      (a.subjectName.toLowerCase() === subject.toLowerCase() ||
       a.subjectName.toLowerCase().includes(subject.toLowerCase()) ||
       subject.toLowerCase().includes(a.subjectName.toLowerCase()))
    );
    return Boolean(match);
  };

  const calculateGradeFromPercentage = (percentage: number): { grade: string; isPassing: boolean; gradePoint: number } => {
    const scale = gradingScales[0] || INITIAL_GRADING_SCALES[0];
    const boundary = scale.boundaries.find(b => percentage >= b.minPercentage && percentage <= b.maxPercentage);
    if (boundary) {
      return { grade: boundary.grade, isPassing: boundary.isPassing, gradePoint: boundary.gradePoint };
    }
    if (percentage >= 33) return { grade: 'D', isPassing: true, gradePoint: 4.0 };
    return { grade: 'E2', isPassing: false, gradePoint: 0.0 };
  };

  const createExamination = (examData: Omit<Examination, 'id'>): { success: boolean; message: string; exam?: Examination } => {
    const exists = examinations.some(e => 
      e.name.toLowerCase().trim() === examData.name.toLowerCase().trim() &&
      e.academicYear === examData.academicYear &&
      e.term === examData.term
    );
    if (exists) {
      return { success: false, message: `An examination named "${examData.name}" already exists for ${examData.academicYear} ${examData.term}.` };
    }

    if (new Date(examData.endDate) < new Date(examData.startDate)) {
      return { success: false, message: 'Examination end date cannot be earlier than start date.' };
    }

    const newExam: Examination = {
      ...examData,
      id: `exam-${Date.now()}`,
      status: examData.status || 'draft',
      totalAssessmentsCount: 0,
      completedAssessmentsCount: 0
    };

    const newAssessments: SubjectAssessmentConfig[] = [];
    examData.applicableClasses.forEach(cls => {
      const classAllocations = subjectAllocations.filter(a => a.standard === cls.standard && a.section === cls.section);
      classAllocations.forEach(alloc => {
        newAssessments.push({
          id: `sa-${newExam.id}-${cls.standard}${cls.section}-${alloc.subjectId}`,
          examId: newExam.id,
          examName: newExam.name,
          standard: cls.standard,
          section: cls.section,
          subjectId: alloc.subjectId,
          subject: alloc.subjectName,
          maxWritten: 80,
          maxPractical: alloc.subjectName.toLowerCase().includes('science') || alloc.subjectName.toLowerCase().includes('computer') ? 20 : 0,
          maxInternal: alloc.subjectName.toLowerCase().includes('science') || alloc.subjectName.toLowerCase().includes('computer') ? 0 : 20,
          totalMax: 100,
          passingMarks: 33,
          examDate: newExam.startDate,
          assignedTeacherId: alloc.teacherId || 't1',
          assignedTeacherName: alloc.teacherName || 'Assigned Teacher',
          marksEntryStatus: 'not_started',
          totalStudents: students.filter(s => s.standard === cls.standard && s.section === cls.section).length,
          enteredCount: 0,
          absentCount: 0,
          exemptCount: 0
        });
      });
    });

    newExam.totalAssessmentsCount = newAssessments.length;

    setExaminations(prev => [newExam, ...prev]);
    if (newAssessments.length > 0) {
      setSubjectAssessments(prev => [...newAssessments, ...prev]);
    }

    logAudit('Administrator', 'Dr. Evelyn Montgomery', 'EXAMINATION_CREATED', 'Examinations', `Created examination "${newExam.name}" (${newExam.academicYear}) with ${newAssessments.length} assessment modules.`, newExam.id);
    return { success: true, message: `Examination "${newExam.name}" created with ${newAssessments.length} subject assessment configurations.`, exam: newExam };
  };

  const updateExamination = (id: string, data: Partial<Examination>) => {
    setExaminations(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    logAudit('Administrator', 'Academic Coordinator', 'EXAMINATION_UPDATED', 'Examinations', `Updated examination settings for exam ${id}`, id);
  };

  const publishExamination = (id: string, publisherName: string): { success: boolean; message: string } => {
    const exam = examinations.find(e => e.id === id);
    if (!exam) return { success: false, message: 'Examination not found.' };

    const slots = examScheduleSlots.filter(s => s.examId === id);
    if (slots.length === 0) {
      return { success: false, message: 'Cannot publish examination without any scheduled examination sessions.' };
    }

    const conflicts = detectExamScheduleConflicts().filter(c => c.slotIds.some(sid => slots.some(s => s.id === sid)));
    if (conflicts.length > 0) {
      return { success: false, message: `Cannot publish: ${conflicts.length} schedule conflict(s) detected. Resolve overlapping sessions before publishing.` };
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setExaminations(prev => prev.map(e => e.id === id ? { ...e, status: 'scheduled', publishedAt: now, publishedBy: publisherName } : e));
    setExamScheduleSlots(prev => prev.map(s => s.examId === id ? { ...s, status: 'published' } : s));

    logAudit('Principal', publisherName, 'EXAM_TIMETABLE_PUBLISHED', 'Examinations', `Published master examination timetable for "${exam.name}" with ${slots.length} scheduled exam slots.`, id);
    showToast(`Master schedule for "${exam.name}" published to faculty, students, and parents.`);
    return { success: true, message: `Schedule published successfully for "${exam.name}".` };
  };

  const archiveExamination = (id: string) => {
    setExaminations(prev => prev.map(e => e.id === id ? { ...e, status: 'archived' } : e));
    logAudit('Administrator', 'Dr. Evelyn Montgomery', 'EXAM_ARCHIVED', 'Examinations', `Archived examination ${id}`, id);
  };

  const duplicateExamination = (id: string, newName: string): { success: boolean; message: string } => {
    const target = examinations.find(e => e.id === id);
    if (!target) return { success: false, message: 'Source examination not found.' };

    const newId = `exam-${Date.now()}`;
    const duplicatedExam: Examination = {
      ...target,
      id: newId,
      name: newName,
      status: 'draft',
      publishedAt: undefined,
      publishedBy: undefined
    };

    const sourceAssessments = subjectAssessments.filter(sa => sa.examId === id);
    const duplicatedAssessments: SubjectAssessmentConfig[] = sourceAssessments.map((sa, idx) => ({
      ...sa,
      id: `sa-${newId}-${idx}`,
      examId: newId,
      examName: newName,
      marksEntryStatus: 'not_started',
      submittedAt: undefined,
      submittedBy: undefined,
      approvedAt: undefined,
      approvedBy: undefined,
      enteredCount: 0,
      absentCount: 0,
      exemptCount: 0
    }));

    setExaminations(prev => [duplicatedExam, ...prev]);
    setSubjectAssessments(prev => [...duplicatedAssessments, ...prev]);
    logAudit('Administrator', 'Academic Coordinator', 'EXAMINATION_DUPLICATED', 'Examinations', `Cloned examination "${target.name}" into new draft "${newName}"`, newId);
    return { success: true, message: `Duplicated "${target.name}" into "${newName}".` };
  };

  const createExamScheduleSlot = (slotData: Omit<ExamScheduleSlot, 'id'>): { success: boolean; message: string } => {
    const classConflict = examScheduleSlots.find(s => 
      s.date === slotData.date &&
      s.standard === slotData.standard &&
      s.section === slotData.section &&
      !(s.endTime <= slotData.startTime || s.startTime >= slotData.endTime)
    );
    if (classConflict) {
      return { success: false, message: `Conflict: Class ${slotData.standard}-${slotData.section} already has "${classConflict.subject}" scheduled on ${slotData.date} from ${classConflict.startTime} to ${classConflict.endTime}.` };
    }

    const teacherConflict = examScheduleSlots.find(s =>
      s.date === slotData.date &&
      s.examinerTeacherId === slotData.examinerTeacherId &&
      !(s.endTime <= slotData.startTime || s.startTime >= slotData.endTime)
    );
    if (teacherConflict) {
      return { success: false, message: `Faculty Conflict: ${slotData.examinerTeacherName} is already assigned to invigilate Std ${teacherConflict.standard}-${teacherConflict.section} (${teacherConflict.subject}) during overlapping time.` };
    }

    if (slotData.room) {
      const roomConflict = examScheduleSlots.find(s =>
        s.date === slotData.date &&
        s.room === slotData.room &&
        !(s.endTime <= slotData.startTime || s.startTime >= slotData.endTime)
      );
      if (roomConflict) {
        return { success: false, message: `Room Conflict: ${slotData.room} is already booked for Std ${roomConflict.standard}-${roomConflict.section} examination.` };
      }
    }

    const newSlot: ExamScheduleSlot = {
      ...slotData,
      id: `es-${Date.now()}`
    };
    setExamScheduleSlots(prev => [...prev, newSlot]);
    logAudit('Academic Coordinator', 'Prof. Marcus Vance', 'EXAM_SLOT_SCHEDULED', 'Exam Timetable', `Scheduled ${slotData.examName} for Std ${slotData.standard}-${slotData.section} (${slotData.subject}) on ${slotData.date}`, newSlot.id);
    return { success: true, message: `Examination session scheduled for ${slotData.subject} on ${slotData.date}.` };
  };

  const updateExamScheduleSlot = (id: string, data: Partial<ExamScheduleSlot>): { success: boolean; message: string } => {
    setExamScheduleSlots(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    return { success: true, message: 'Examination session updated.' };
  };

  const deleteExamScheduleSlot = (id: string) => {
    setExamScheduleSlots(prev => prev.filter(s => s.id !== id));
  };

  const detectExamScheduleConflicts = (): Array<{ type: 'class_overlap' | 'teacher_overlap' | 'room_overlap'; message: string; slotIds: string[] }> => {
    const conflicts: Array<{ type: 'class_overlap' | 'teacher_overlap' | 'room_overlap'; message: string; slotIds: string[] }> = [];

    for (let i = 0; i < examScheduleSlots.length; i++) {
      for (let j = i + 1; j < examScheduleSlots.length; j++) {
        const s1 = examScheduleSlots[i];
        const s2 = examScheduleSlots[j];

        if (s1.date !== s2.date) continue;
        const overlaps = !(s1.endTime <= s2.startTime || s1.startTime >= s2.endTime);
        if (!overlaps) continue;

        if (s1.standard === s2.standard && s1.section === s2.section) {
          conflicts.push({
            type: 'class_overlap',
            message: `Double Exam for Std ${s1.standard}-${s1.section}: "${s1.subject}" & "${s2.subject}" on ${s1.date}`,
            slotIds: [s1.id, s2.id]
          });
        }
        if (s1.examinerTeacherId === s2.examinerTeacherId) {
          conflicts.push({
            type: 'teacher_overlap',
            message: `Examiner Double-Booking: ${s1.examinerTeacherName} assigned to both Std ${s1.standard}-${s1.section} and Std ${s2.standard}-${s2.section} on ${s1.date}`,
            slotIds: [s1.id, s2.id]
          });
        }
        if (s1.room && s2.room && s1.room === s2.room) {
          conflicts.push({
            type: 'room_overlap',
            message: `Room Collision: ${s1.room} allocated to two simultaneous examinations on ${s1.date}`,
            slotIds: [s1.id, s2.id]
          });
        }
      }
    }
    return conflicts;
  };

  const saveSubjectAssessmentConfig = (config: Omit<SubjectAssessmentConfig, 'id'>) => {
    setSubjectAssessments(prev => {
      const idx = prev.findIndex(a => 
        a.examId === config.examId &&
        a.standard === config.standard &&
        a.section === config.section &&
        a.subjectId === config.subjectId
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...config };
        return copy;
      }
      return [{ ...config, id: `sa-${Date.now()}` }, ...prev];
    });
  };

  const saveMarksBatch = (
    assessmentId: string,
    records: Array<Partial<MarkRecord> & { studentId: string; marksObtained: number }>,
    teacherId: string,
    teacherName: string,
    isDraft: boolean = true
  ): { success: boolean; message: string } => {
    const assessment = subjectAssessments.find(a => a.id === assessmentId);
    if (!assessment) return { success: false, message: 'Assessment module configuration not found.' };

    const isLeadership = currentRole === 'principal' || currentRole === 'vice_principal';
    const isAssigned = assessment.assignedTeacherId === teacherId || canTeacherAccessSubject(teacherId, assessment.standard, assessment.section, assessment.subject);

    if (!isLeadership && !isAssigned) {
      return {
        success: false,
        message: `Permission Denied: You are not authorized to enter marks for ${assessment.subject} in Class ${assessment.standard}-${assessment.section}. This subject is assigned to ${assessment.assignedTeacherName}.`
      };
    }

    if (assessment.marksEntryStatus === 'approved' || assessment.marksEntryStatus === 'published') {
      if (!isLeadership) {
        return {
          success: false,
          message: 'This assessment has already been approved/published. Direct modification is locked. Please request a formal moderation correction.'
        };
      }
    }

    const timestamp = new Date().toISOString();
    const updatedMarks = [...marks];
    let enteredCount = 0;
    let absentCount = 0;
    let exemptCount = 0;

    records.forEach(rec => {
      if (rec.marksObtained < 0) {
        throw new Error(`Marks cannot be negative for student ${rec.studentName || rec.studentId}`);
      }
      if (rec.marksObtained > assessment.totalMax) {
        throw new Error(`Marks (${rec.marksObtained}) cannot exceed total maximum (${assessment.totalMax})`);
      }

      const percentage = assessment.totalMax > 0 ? Math.round((rec.marksObtained / assessment.totalMax) * 100 * 10) / 10 : 0;
      const { grade } = calculateGradeFromPercentage(percentage);

      const markStatus: MarkRecord['status'] = rec.isAbsent ? 'absent' : rec.isExempt ? 'exempt' : isDraft ? 'draft' : 'entered';
      if (rec.isAbsent) absentCount++;
      else if (rec.isExempt) exemptCount++;
      else if (rec.marksObtained !== undefined && rec.marksObtained !== null) enteredCount++;

      const existingIdx = updatedMarks.findIndex(m => 
        m.studentId === rec.studentId &&
        (m.assessmentId === assessmentId || (m.examName === assessment.examName && m.subject === assessment.subject))
      );

      if (existingIdx >= 0) {
        const existing = updatedMarks[existingIdx];
        const history = existing.history || [];
        if (existing.marksObtained !== rec.marksObtained && existing.status !== 'draft') {
          history.push({
            oldMarks: existing.marksObtained,
            newMarks: rec.marksObtained,
            oldStatus: existing.status,
            newStatus: markStatus,
            reason: rec.remarks || 'Teacher gradebook update',
            changedBy: teacherName,
            timestamp
          });
        }

        updatedMarks[existingIdx] = {
          ...existing,
          ...rec,
          examId: assessment.examId,
          examName: assessment.examName,
          assessmentId,
          standard: assessment.standard,
          section: assessment.section,
          subject: assessment.subject,
          maxMarks: assessment.totalMax,
          percentage,
          grade,
          status: markStatus,
          teacherId,
          teacherName,
          lastUpdated: timestamp,
          history
        };
      } else {
        const studentObj = students.find(s => s.id === rec.studentId);
        updatedMarks.unshift({
          id: `mrk-${Date.now()}-${rec.studentId}`,
          examId: assessment.examId,
          examName: assessment.examName,
          assessmentId,
          studentId: rec.studentId,
          studentName: rec.studentName || studentObj?.name || 'Student',
          rollNo: rec.rollNo || studentObj?.rollNo,
          admissionNo: rec.admissionNo || studentObj?.admissionNo,
          standard: assessment.standard,
          section: assessment.section,
          subject: assessment.subject,
          writtenMarks: rec.writtenMarks ?? rec.marksObtained,
          practicalMarks: rec.practicalMarks ?? 0,
          internalMarks: rec.internalMarks ?? 0,
          marksObtained: rec.marksObtained,
          maxMarks: assessment.totalMax,
          percentage,
          grade,
          status: markStatus,
          isAbsent: rec.isAbsent,
          isExempt: rec.isExempt,
          teacherRemarks: rec.teacherRemarks || rec.remarks,
          teacherId,
          teacherName,
          lastUpdated: timestamp
        });
      }
    });

    setMarks(updatedMarks);

    setSubjectAssessments(prev => prev.map(a => {
      if (a.id !== assessmentId) return a;
      return {
        ...a,
        marksEntryStatus: isDraft ? 'draft' : a.marksEntryStatus,
        enteredCount,
        absentCount,
        exemptCount
      };
    }));

    const msg = isDraft ? `Draft scores saved for ${records.length} students.` : `Scores recorded for ${records.length} students.`;
    return { success: true, message: msg };
  };

  const submitAssessmentMarks = (
    assessmentId: string,
    teacherId: string,
    teacherName: string
  ): { success: boolean; message: string; missingCount: number } => {
    const assessment = subjectAssessments.find(a => a.id === assessmentId);
    if (!assessment) return { success: false, message: 'Assessment not found.', missingCount: 0 };

    const isLeadership = currentRole === 'principal' || currentRole === 'vice_principal';
    const isAssigned = assessment.assignedTeacherId === teacherId || canTeacherAccessSubject(teacherId, assessment.standard, assessment.section, assessment.subject);
    if (!isLeadership && !isAssigned) {
      return { success: false, message: `Permission Denied: You are not authorized to submit marks for ${assessment.subject}.`, missingCount: 0 };
    }

    const classStudents = students.filter(s => s.standard === assessment.standard && s.section === assessment.section && s.status === 'Active');
    const existingMarks = marks.filter(m => 
      (m.assessmentId === assessmentId || (m.examName === assessment.examName && m.subject === assessment.subject)) &&
      m.standard === assessment.standard &&
      m.section === assessment.section
    );

    const missingStudents = classStudents.filter(s => {
      const mark = existingMarks.find(m => m.studentId === s.id);
      if (!mark) return true;
      if (mark.isAbsent || mark.isExempt) return false;
      return mark.marksObtained === undefined || mark.marksObtained === null || mark.status === 'not_entered';
    });

    if (missingStudents.length > 0) {
      return {
        success: false,
        message: `Validation Error: ${missingStudents.length} student(s) have missing marks (${missingStudents.slice(0, 3).map(s => s.name).join(', ')}${missingStudents.length > 3 ? '...' : ''}). All students must have marks entered or be explicitly marked Absent/Exempt before submission.`,
        missingCount: missingStudents.length
      };
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setMarks(prev => prev.map(m => {
      if ((m.assessmentId === assessmentId || (m.examName === assessment.examName && m.subject === assessment.subject)) &&
          m.standard === assessment.standard && m.section === assessment.section) {
        return { ...m, status: 'submitted', lastUpdated: now };
      }
      return m;
    }));

    setSubjectAssessments(prev => prev.map(a => {
      if (a.id !== assessmentId) return a;
      return {
        ...a,
        marksEntryStatus: 'submitted',
        submittedAt: now,
        submittedBy: teacherName,
        enteredCount: classStudents.length - existingMarks.filter(m => m.isAbsent).length,
        absentCount: existingMarks.filter(m => m.isAbsent).length,
        exemptCount: existingMarks.filter(m => m.isExempt).length
      };
    }));

    logAudit('Teacher', teacherName, 'MARKS_SUBMITTED_FOR_REVIEW', 'Examinations', `Submitted marks for ${assessment.subject} in Std ${assessment.standard}-${assessment.section} (${assessment.examName}) for moderation.`, assessmentId);
    showToast(`Marks for Std ${assessment.standard}-${assessment.section} (${assessment.subject}) submitted to Academic Coordinator for review.`);
    return { success: true, message: 'Marks submitted successfully for academic moderation.', missingCount: 0 };
  };

  const reviewAssessmentMarks = (
    assessmentId: string,
    decision: 'approved' | 'returned_for_correction',
    reviewerName: string,
    remarks?: string
  ): { success: boolean; message: string } => {
    const assessment = subjectAssessments.find(a => a.id === assessmentId);
    if (!assessment) return { success: false, message: 'Assessment not found.' };

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (decision === 'approved') {
      setSubjectAssessments(prev => prev.map(a => {
        if (a.id !== assessmentId) return a;
        return {
          ...a,
          marksEntryStatus: 'approved',
          approvedAt: now,
          approvedBy: reviewerName,
          rejectionReason: undefined
        };
      }));

      setMarks(prev => prev.map(m => {
        if ((m.assessmentId === assessmentId || (m.examName === assessment.examName && m.subject === assessment.subject)) &&
            m.standard === assessment.standard && m.section === assessment.section) {
          return { ...m, status: 'approved', lastUpdated: now };
        }
        return m;
      }));

      logAudit('Academic Leadership', reviewerName, 'MARKS_APPROVED', 'Examination Moderation', `Approved score ledger for Std ${assessment.standard}-${assessment.section} ${assessment.subject} (${assessment.examName}).`, assessmentId);
      showToast(`Marks approved for Std ${assessment.standard}-${assessment.section} (${assessment.subject}). Ready for result consolidation.`);
      return { success: true, message: 'Marks successfully endorsed and approved.' };
    } else {
      setSubjectAssessments(prev => prev.map(a => {
        if (a.id !== assessmentId) return a;
        return {
          ...a,
          marksEntryStatus: 'returned_for_correction',
          rejectionReason: remarks || 'Scores returned for recalculation or verification.'
        };
      }));

      setMarks(prev => prev.map(m => {
        if ((m.assessmentId === assessmentId || (m.examName === assessment.examName && m.subject === assessment.subject)) &&
            m.standard === assessment.standard && m.section === assessment.section) {
          return { ...m, status: 'draft', lastUpdated: now };
        }
        return m;
      }));

      logAudit('Academic Leadership', reviewerName, 'MARKS_RETURNED_FOR_CORRECTION', 'Examination Moderation', `Returned marks for Std ${assessment.standard}-${assessment.section} ${assessment.subject}: ${remarks || 'Review required'}`, assessmentId);
      showToast(`Marks returned to ${assessment.assignedTeacherName} for correction.`, 'warning');
      return { success: true, message: 'Assessment returned to faculty for correction.' };
    }
  };

  const publishExamResults = (
    examId: string,
    standard?: number,
    section?: 'A' | 'B',
    publisherName = 'Dr. Evelyn Montgomery'
  ): { success: boolean; message: string } => {
    const exam = examinations.find(e => e.id === examId);
    if (!exam) return { success: false, message: 'Examination not found.' };

    const classAssessments = subjectAssessments.filter(a => {
      if (a.examId !== examId) return false;
      if (standard !== undefined && a.standard !== standard) return false;
      if (section !== undefined && a.section !== section) return false;
      return true;
    });

    const unapproved = classAssessments.filter(a => a.marksEntryStatus !== 'approved' && a.marksEntryStatus !== 'published');
    if (unapproved.length > 0) {
      return {
        success: false,
        message: `Cannot Publish: ${unapproved.length} subject assessment(s) are not yet approved (${unapproved.map(u => `${u.subject} [${u.marksEntryStatus}]`).join(', ')}). All subjects must be reviewed and approved before publication.`
      };
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setMarks(prev => prev.map(m => {
      const matches = (m.examId === examId || m.examName === exam.name) &&
        (standard === undefined || m.standard === standard) &&
        (section === undefined || m.section === section);
      if (matches) {
        return { ...m, status: 'published', lastUpdated: now };
      }
      return m;
    }));

    setSubjectAssessments(prev => prev.map(a => {
      const matches = a.examId === examId &&
        (standard === undefined || a.standard === standard) &&
        (section === undefined || a.section === section);
      if (matches) {
        return { ...a, marksEntryStatus: 'published' };
      }
      return a;
    }));

    setExaminations(prev => prev.map(e => {
      if (e.id === examId) {
        return { ...e, status: 'published', publishedAt: now, publishedBy: publisherName };
      }
      return e;
    }));

    logAudit('Principal', publisherName, 'RESULTS_PUBLISHED', 'Examinations', `Published official results and report cards for ${exam.name} (Std ${standard ? standard + '-' + section : 'All Classes'}).`, examId);
    showToast(`Official results published for ${exam.name}! Report cards are now accessible to parents and students.`);
    return { success: true, message: `Results published for ${exam.name}.` };
  };

  const submitMarkCorrection = (markId: string, newMarks: number, reason: string, requestedByName: string) => {
    setMarks(prev => prev.map(m => {
      if (m.id !== markId) return m;
      const history = m.history || [];
      history.push({
        oldMarks: m.marksObtained,
        newMarks,
        reason,
        changedBy: requestedByName,
        timestamp: new Date().toISOString()
      });
      const percentage = m.maxMarks > 0 ? Math.round((newMarks / m.maxMarks) * 100 * 10) / 10 : 0;
      const { grade } = calculateGradeFromPercentage(percentage);
      return {
        ...m,
        marksObtained: newMarks,
        writtenMarks: newMarks,
        percentage,
        grade,
        history,
        lastUpdated: new Date().toISOString()
      };
    }));
    logAudit('Academic Leadership', requestedByName, 'MARK_CORRECTION_RATIFIED', 'Examinations', `Adjusted score for mark ${markId} to ${newMarks}: ${reason}`, markId);
    showToast(`Mark corrected to ${newMarks} with audit entry preserved.`);
  };

  const gradeAssignmentSubmission = (submissionId: string, marksObtained: number, maxMarks: number, feedback: string) => {
    const pct = maxMarks > 0 ? Math.round((marksObtained / maxMarks) * 100) : 0;
    const { grade } = calculateGradeFromPercentage(pct);
    setAssignmentSubmissions(prev => prev.map(s => {
      if (s.id !== submissionId) return s;
      return {
        ...s,
        status: 'graded',
        marksObtained,
        maxMarks,
        grade,
        teacherFeedback: feedback
      };
    }));
    showToast('Assignment grade and teacher feedback recorded.');
  };

  const updateAssessmentSettings = (settings: Partial<AssessmentSettingsConfig>) => {
    setAssessmentSettings(prev => ({ ...prev, ...settings }));
    showToast('Assessment configuration thresholds updated.');
  };

  const updateGradingScale = (scaleId: string, boundaries: GradingScaleBoundary[]) => {
    setGradingScales(prev => prev.map(s => s.id === scaleId ? { ...s, boundaries } : s));
    showToast('Grading boundaries updated.');
  };

  // Finance & Bursar Operational Handlers (Prompt 6)
  const createFeeStructure = (structureData: Omit<FeeStructureItem, 'id'>) => {
    const newStructure: FeeStructureItem = {
      ...structureData,
      id: `fs-${Date.now()}`
    };
    setFeeStructures(prev => [...prev, newStructure]);
    logAudit('Accountant', 'Mr. David Reynolds', 'FEE_STRUCTURE_CREATED', 'Finance', `Configured fee structure "${structureData.tierName}" for Standards ${structureData.applicableStandards.join(', ')} (₹${structureData.totalAnnualAmount}/yr).`, newStructure.id);
    showToast(`Fee structure "${structureData.tierName}" created.`);
  };

  const updateFeeStructure = (id: string, data: Partial<FeeStructureItem>) => {
    setFeeStructures(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    logAudit('Accountant', 'Mr. David Reynolds', 'FEE_STRUCTURE_UPDATED', 'Finance', `Updated fee structure ${id}.`, id);
    showToast('Fee structure updated successfully.');
  };

  const deleteFeeStructure = (id: string) => {
    setFeeStructures(prev => prev.filter(s => s.id !== id));
    logAudit('Accountant', 'Mr. David Reynolds', 'FEE_STRUCTURE_DELETED', 'Finance', `Archived fee structure ${id}.`, id);
    showToast('Fee structure removed.');
  };

  const assignFeeStructureToClass = (structureId: string, standard: number, section?: 'A' | 'B'): { count: number; message: string } => {
    const structure = feeStructures.find(s => s.id === structureId);
    if (!structure) return { count: 0, message: 'Fee structure not found.' };

    const targetStudents = students.filter(s => s.standard === standard && (section === undefined || s.section === section));
    if (targetStudents.length === 0) return { count: 0, message: 'No enrolled students found for the chosen standard/section.' };

    const today = new Date().toISOString().split('T')[0];
    const newInvoices: FeeInvoice[] = [];

    targetStudents.forEach(stu => {
      // Create Term 2 invoice if not already generated
      const existing = fees.find(f => f.studentId === stu.id && f.feeType === 'Tuition Fee' && f.academicYear === '2026-2027' && f.term === 'Term 2');
      if (!existing) {
        const tuitionComp = structure.components.find(c => c.name === 'Tuition Fee');
        const amount = tuitionComp ? tuitionComp.amount : Math.round(structure.totalAnnualAmount / 2);
        
        // Check if student has concession
        const concession = feeConcessions.find(c => c.studentId === stu.id && c.status === 'active');
        let concessionAmount = 0;
        let concessionText: string | undefined;

        if (concession) {
          if (concession.discountType === 'percentage') {
            concessionAmount = Math.round((amount * concession.discountValue) / 100);
          } else {
            concessionAmount = Math.min(amount, concession.discountValue);
          }
          concessionText = `${concession.concessionType} (${concession.discountType === 'percentage' ? concession.discountValue + '%' : '₹' + concession.discountValue})`;
        }

        const effectiveAmount = Math.max(0, amount - concessionAmount);

        newInvoices.push({
          id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          invoiceNo: `INV-2026-${String(fees.length + newInvoices.length + 850).padStart(4, '0')}`,
          studentId: stu.id,
          studentName: stu.name,
          standard: stu.standard,
          section: stu.section,
          feeType: 'Tuition Fee',
          amount: effectiveAmount,
          paidAmount: 0,
          remainingBalance: effectiveAmount,
          dueDate: structure.dueDateTerm2 || '2026-10-25',
          status: 'pending',
          academicYear: '2026-2027',
          term: 'Term 2',
          concessionApplied: concessionAmount > 0 ? concessionAmount : undefined,
          concessionType: concessionText
        });
      }
    });

    if (newInvoices.length > 0) {
      setFees(prev => [...newInvoices, ...prev]);
      logAudit('Accountant', 'Mr. David Reynolds', 'FEE_STRUCTURE_ASSIGNED', 'Finance', `Generated ${newInvoices.length} invoices for Standard ${standard}${section ? '-' + section : ''} based on "${structure.tierName}".`);
      showToast(`Batch assigned: ${newInvoices.length} student invoices generated.`);
      return { count: newInvoices.length, message: `Successfully generated ${newInvoices.length} invoices for Standard ${standard}.` };
    } else {
      showToast('All matching students already have invoices generated for this term.', 'info');
      return { count: 0, message: 'All matching students already have invoices generated for this term.' };
    }
  };

  const applyFeeConcession = (concessionData: Omit<FeeConcession, 'id' | 'concessionNo'>) => {
    const newConcession: FeeConcession = {
      ...concessionData,
      id: `con-${Date.now()}`,
      concessionNo: `CON-2026-${String(feeConcessions.length + 44).padStart(4, '0')}`
    };

    setFeeConcessions(prev => [newConcession, ...prev]);

    // Recalculate pending invoice for student if any
    setFees(prev => prev.map(inv => {
      if (inv.studentId === concessionData.studentId && (inv.status === 'pending' || inv.status === 'overdue')) {
        let deduction = 0;
        if (concessionData.discountType === 'percentage') {
          deduction = Math.round((inv.amount * concessionData.discountValue) / 100);
        } else {
          deduction = Math.min(inv.amount, concessionData.discountValue);
        }
        const newTotal = Math.max(0, inv.amount - deduction);
        const paid = inv.paidAmount || 0;
        return {
          ...inv,
          concessionApplied: deduction,
          concessionType: `${concessionData.concessionType} (${concessionData.discountType === 'percentage' ? concessionData.discountValue + '%' : '₹' + concessionData.discountValue})`,
          remainingBalance: Math.max(0, newTotal - paid),
          status: (newTotal - paid) <= 0 ? 'paid' : (paid > 0 ? 'partial' : inv.status)
        };
      }
      return inv;
    }));

    logAudit('Academic Leadership', concessionData.approvedBy, 'FEE_CONCESSION_GRANTED', 'Finance', `Approved ${concessionData.concessionType} for ${concessionData.studentName} (Std ${concessionData.standard}-${concessionData.section}): ${concessionData.reason}`, newConcession.id);
    showToast(`Concession ${newConcession.concessionNo} granted to ${concessionData.studentName}.`);
  };

  const revokeFeeConcession = (concessionId: string, reason: string) => {
    setFeeConcessions(prev => prev.map(c => c.id === concessionId ? { ...c, status: 'revoked', reason: `${c.reason} [REVOKED: ${reason}]` } : c));
    logAudit('Accountant', 'Mr. David Reynolds', 'FEE_CONCESSION_REVOKED', 'Finance', `Revoked concession ${concessionId}: ${reason}`, concessionId);
    showToast('Fee concession revoked.');
  };

  const createFeeInvoice = (invoiceData: Omit<FeeInvoice, 'id'>) => {
    const newInvoice: FeeInvoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      paidAmount: invoiceData.paidAmount ?? (invoiceData.status === 'paid' ? invoiceData.amount : 0),
      remainingBalance: invoiceData.remainingBalance ?? (invoiceData.status === 'paid' ? 0 : invoiceData.amount)
    };
    setFees(prev => [newInvoice, ...prev]);
    logAudit('Accountant', 'Mr. David Reynolds', 'FEE_INVOICE_GENERATED', 'Finance', `Generated invoice ${invoiceData.invoiceNo} for ${invoiceData.studentName} (₹${invoiceData.amount.toLocaleString()})`, newInvoice.id);
    showToast(`Invoice ${invoiceData.invoiceNo} generated for ${invoiceData.studentName}.`);
  };

  const recordFeePayment = (
    invoiceId: string,
    amount: number,
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash' | 'Cheque',
    transactionRef?: string,
    chequeNo?: string,
    notes?: string,
    collectedBy: string = 'Mr. David Reynolds (Accountant)'
  ): { success: boolean; receiptNo: string; remainingBalance: number } => {
    const invoice = fees.find(f => f.id === invoiceId);
    if (!invoice) return { success: false, receiptNo: '', remainingBalance: 0 };

    const receiptNo = `RCP-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timestampStr = `${today} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newPaymentRecord: FeePayment = {
      id: `pay-${Date.now()}`,
      invoiceId,
      receiptNo,
      studentId: invoice.studentId,
      studentName: invoice.studentName,
      amountPaid: amount,
      paymentMethod,
      transactionRef: transactionRef || (paymentMethod === 'UPI' ? `UPI-${Math.floor(100000 + Math.random() * 900000)}` : paymentMethod === 'Card' ? `POS-${Math.floor(1000 + Math.random() * 9000)}` : undefined),
      chequeNo,
      paymentDate: today,
      collectedBy,
      notes: notes || `Payment recorded via ${paymentMethod}`
    };

    const currentPaid = invoice.paidAmount || (invoice.status === 'paid' ? invoice.amount : 0);
    const newPaidTotal = currentPaid + amount;
    const remainingBalance = Math.max(0, invoice.amount - newPaidTotal);
    const newStatus: FeeInvoice['status'] = remainingBalance === 0 ? 'paid' : 'partial';

    // Update invoice
    setFees(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      const receiptList = inv.receiptNumbers || (inv.receiptNo ? [inv.receiptNo] : []);
      if (!receiptList.includes(receiptNo)) receiptList.push(receiptNo);
      const installmentsList = inv.installments || [];
      installmentsList.push(newPaymentRecord);

      return {
        ...inv,
        paidAmount: newPaidTotal,
        remainingBalance,
        status: newStatus,
        paidDate: today,
        paymentMethod,
        receiptNo,
        referenceNo: newPaymentRecord.transactionRef || newPaymentRecord.chequeNo,
        receiptNumbers: receiptList,
        installments: installmentsList
      };
    }));

    // Recalculate student overall feeStatus across all student fee invoices
    setStudents(prevStudents => {
      return prevStudents.map(stu => {
        if (stu.id !== invoice.studentId) return stu;
        const stuInvoices = fees.map(f => f.id === invoiceId ? { ...f, remainingBalance, status: newStatus } : f).filter(f => f.studentId === stu.id);
        const hasOverdue = stuInvoices.some(f => f.status === 'overdue' || (f.dueDate < today && f.status !== 'paid'));
        const hasPending = stuInvoices.some(f => f.status === 'pending' || f.status === 'partial');
        const updatedFeeStatus: Student['feeStatus'] = hasOverdue ? 'overdue' : hasPending ? 'pending' : 'paid';
        return { ...stu, feeStatus: updatedFeeStatus };
      });
    });

    // Record in Financial Daybook (Inflow)
    const lastDaybook = daybookEntries[daybookEntries.length - 1];
    const prevBalance = lastDaybook ? lastDaybook.runningBalance : 3165250;
    const newDaybookEntry: FinancialDaybookEntry = {
      id: `db-${Date.now()}`,
      timestamp: timestampStr,
      date: today,
      type: 'INCOME',
      category: `${invoice.feeType} Collection`,
      referenceNo: receiptNo,
      partyName: `${invoice.studentName} (Std ${invoice.standard}-${invoice.section})`,
      paymentMethod,
      debitAmount: 0,
      creditAmount: amount,
      runningBalance: prevBalance + amount,
      recordedBy: collectedBy,
      narration: `${invoice.feeType} (${newStatus === 'paid' ? 'Full Settlement' : 'Partial Installment'}) received from ${invoice.studentName}. Receipt: ${receiptNo}`
    };
    setDaybookEntries(prev => [...prev, newDaybookEntry]);

    logAudit('Accountant', collectedBy, 'FEE_PAYMENT_COLLECTED', 'Finance', `Settled ₹${amount.toLocaleString()} via ${paymentMethod} for ${invoice.studentName} (Receipt: ${receiptNo}, Balance: ₹${remainingBalance.toLocaleString()})`, invoiceId);
    showToast(`Payment of ₹${amount.toLocaleString()} recorded. Receipt: ${receiptNo}`);

    return { success: true, receiptNo, remainingBalance };
  };

  const collectFee = (invoiceId: string, paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash' | 'Cheque') => {
    const inv = fees.find(f => f.id === invoiceId);
    const amountToCollect = inv ? (inv.remainingBalance ?? (inv.status === 'paid' ? 0 : inv.amount)) : 0;
    recordFeePayment(invoiceId, amountToCollect, paymentMethod);
  };

  const sendFeeReminder = (invoiceId: string, channel: 'SMS' | 'WhatsApp' | 'Email' = 'SMS'): { success: boolean; message: string } => {
    const inv = fees.find(f => f.id === invoiceId);
    if (!inv) return { success: false, message: 'Invoice not found.' };

    const student = students.find(s => s.id === inv.studentId);
    const recipientPhone = student?.parentPhone || '+91 98450 11223';
    const amountDue = inv.remainingBalance ?? inv.amount;

    const noticeText = `Dear Parent, fee invoice ${inv.invoiceNo} for ${inv.studentName} (Std ${inv.standard}-${inv.section}) has an outstanding balance of ₹${amountDue.toLocaleString()}. Due Date: ${inv.dueDate}. Please clear at the earliest via Greenfield International School parent portal.`;

    logAudit('Accountant', 'Mr. David Reynolds', 'FEE_REMINDER_SENT', 'Finance', `Dispatched ${channel} payment reminder to ${student?.parentName || 'Parent'} (${recipientPhone}) for invoice ${inv.invoiceNo} (₹${amountDue.toLocaleString()}).`, invoiceId);
    showToast(`${channel} payment reminder dispatched to ${recipientPhone} for ${inv.studentName}.`);

    return { success: true, message: `Dispatched ${channel} reminder to ${recipientPhone}: "${noticeText}"` };
  };

  const recordExpense = (expenseData: Omit<ExpenseRecord, 'id' | 'voucherNo'>): { voucherNo: string } => {
    const voucherNo = `VCH-2026-${String(expenses.length + 819).padStart(4, '0')}`;
    const newExpense: ExpenseRecord = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      voucherNo
    };

    setExpenses(prev => [newExpense, ...prev]);

    // If approved, debit daybook and update category budget
    if (newExpense.status === 'approved') {
      const lastDaybook = daybookEntries[daybookEntries.length - 1];
      const prevBalance = lastDaybook ? lastDaybook.runningBalance : 3165250;
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const timestampStr = `${today} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newDaybookEntry: FinancialDaybookEntry = {
        id: `db-${Date.now()}`,
        timestamp: timestampStr,
        date: expenseData.expenseDate || today,
        type: 'EXPENSE',
        category: expenseData.category,
        referenceNo: voucherNo,
        partyName: expenseData.vendorName,
        paymentMethod: expenseData.paymentMethod,
        debitAmount: expenseData.amount,
        creditAmount: 0,
        runningBalance: prevBalance - expenseData.amount,
        recordedBy: expenseData.recordedBy || 'Mr. David Reynolds (Accountant)',
        narration: `${expenseData.description} (Voucher: ${voucherNo}, Bill Ref: ${expenseData.invoiceBillNo})`
      };
      setDaybookEntries(prev => [...prev, newDaybookEntry]);

      // Update budget category
      setBudgets(prev => prev.map(b => {
        if (b.categoryName === expenseData.category) {
          return { ...b, spentAmount: b.spentAmount + expenseData.amount };
        }
        return b;
      }));
    } else {
      // Add to committed amount in budget
      setBudgets(prev => prev.map(b => {
        if (b.categoryName === expenseData.category) {
          return { ...b, committedAmount: b.committedAmount + expenseData.amount };
        }
        return b;
      }));
    }

    logAudit('Accountant', expenseData.recordedBy, 'EXPENSE_RECORDED', 'Finance', `Recorded voucher ${voucherNo} for ${expenseData.category} (₹${expenseData.amount.toLocaleString()} to ${expenseData.vendorName}). Status: ${newExpense.status}.`, newExpense.id);
    showToast(`Expense voucher ${voucherNo} recorded (${newExpense.status === 'approved' ? 'Disbursed' : 'Awaiting Approval'}).`);

    return { voucherNo };
  };

  const approveExpense = (expenseId: string, approvedBy: string = 'Dr. Evelyn Montgomery (Principal)') => {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;

    const today = new Date().toISOString().split('T')[0];

    setExpenses(prev => prev.map(e => {
      if (e.id !== expenseId) return e;
      return {
        ...e,
        status: 'approved',
        approvedBy,
        approvedDate: today
      };
    }));

    // Update budget committed -> spent
    setBudgets(prev => prev.map(b => {
      if (b.categoryName === expense.category) {
        return {
          ...b,
          spentAmount: b.spentAmount + expense.amount,
          committedAmount: Math.max(0, b.committedAmount - expense.amount)
        };
      }
      return b;
    }));

    // Add debit entry to daybook
    const lastDaybook = daybookEntries[daybookEntries.length - 1];
    const prevBalance = lastDaybook ? lastDaybook.runningBalance : 3165250;
    const now = new Date();
    const timestampStr = `${today} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newDaybookEntry: FinancialDaybookEntry = {
      id: `db-${Date.now()}`,
      timestamp: timestampStr,
      date: today,
      type: 'EXPENSE',
      category: expense.category,
      referenceNo: expense.voucherNo,
      partyName: expense.vendorName,
      paymentMethod: expense.paymentMethod,
      debitAmount: expense.amount,
      creditAmount: 0,
      runningBalance: prevBalance - expense.amount,
      recordedBy: approvedBy,
      narration: `Voucher ${expense.voucherNo} endorsed and cleared for payment (${expense.description})`
    };
    setDaybookEntries(prev => [...prev, newDaybookEntry]);

    logAudit('Principal', approvedBy, 'EXPENSE_APPROVED', 'Finance', `Endorsed expense voucher ${expense.voucherNo} for ₹${expense.amount.toLocaleString()} (${expense.vendorName}).`, expenseId);
    showToast(`Expense voucher ${expense.voucherNo} approved for payment.`);
  };

  const rejectExpense = (expenseId: string, reason: string) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;

    setExpenses(prev => prev.map(e => e.id === expenseId ? { ...e, status: 'rejected', notes: `[REJECTED: ${reason}] ${e.notes || ''}` } : e));

    // Release committed amount
    setBudgets(prev => prev.map(b => {
      if (b.categoryName === expense.category) {
        return {
          ...b,
          committedAmount: Math.max(0, b.committedAmount - expense.amount)
        };
      }
      return b;
    }));

    logAudit('Principal', 'Dr. Evelyn Montgomery', 'EXPENSE_REJECTED', 'Finance', `Rejected voucher ${expense.voucherNo}: ${reason}`, expenseId);
    showToast(`Expense voucher ${expense.voucherNo} rejected.`, 'warning');
  };

  const updateBudgetCategory = (budgetId: string, allocatedAmount: number, alertThresholdPct: number = 85) => {
    setBudgets(prev => prev.map(b => b.id === budgetId ? { ...b, allocatedAmount, alertThresholdPct } : b));
    logAudit('Finance Committee', 'Dr. Evelyn Montgomery & Mr. David Reynolds', 'BUDGET_REVISED', 'Finance', `Adjusted budget ${budgetId} allocation to ₹${allocatedAmount.toLocaleString()}.`, budgetId);
    showToast('Department budget revised successfully.');
  };

  const checkInVisitor = (visitorData: Omit<VisitorEntry, 'id' | 'passNo' | 'status'>) => {
    const passNo = `VP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newVisitor: VisitorEntry = {
      ...visitorData,
      id: `vis-${Date.now()}`,
      passNo,
      status: 'inside'
    };
    setVisitors(prev => [newVisitor, ...prev]);

    // If visitor is linked to an appointment, mark appointment as checked in
    if (visitorData.appointmentRef) {
      setAppointments(prev => prev.map(a => 
        (a.appointmentNo === visitorData.appointmentRef || a.id === visitorData.appointmentRef)
          ? { ...a, status: 'checked_in', linkedVisitorPass: passNo }
          : a
      ));
    }

    logAudit('Receptionist', 'Ms. Clara Martinez', 'VISITOR_CHECKED_IN', 'Front Office', `Issued digital pass ${passNo} to ${visitorData.name} (${visitorData.category || 'Visitor'})`, newVisitor.id);
    showToast(`Visitor pass ${passNo} generated for ${visitorData.name}.`);
  };

  const checkOutVisitor = (id: string, notes?: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let visitorName = '';
    let passNo = '';
    let apptRef: string | undefined = undefined;

    setVisitors(prev =>
      prev.map(v => {
        if (v.id === id) {
          visitorName = v.name;
          passNo = v.passNo;
          apptRef = v.appointmentRef;
          return {
            ...v,
            status: 'completed',
            checkOut: timeStr,
            notes: notes ? (v.notes ? `${v.notes} | ${notes}` : notes) : v.notes
          };
        }
        return v;
      })
    );

    // If linked to an appointment, update appointment status to completed
    if (apptRef) {
      setAppointments(prev => prev.map(a => 
        (a.appointmentNo === apptRef || a.id === apptRef) && a.status === 'checked_in'
          ? { ...a, status: 'completed' }
          : a
      ));
    }

    logAudit('Receptionist', 'Ms. Clara Martinez', 'VISITOR_CHECKED_OUT', 'Front Office', `Visitor pass ${passNo || id} checked out at ${timeStr}`, id);
    showToast(`Visitor ${visitorName || passNo} checked out successfully.`);
  };

  const addEnquiry = (enquiryData: Omit<AdmissionEnquiry, 'id' | 'enquiryNo'>) => {
    const enquiryNo = `ENQ-2026-${String(enquiries.length + 45).padStart(4, '0')}`;
    const newEnquiry: AdmissionEnquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      enquiryNo,
      followUpNotes: enquiryData.notes ? [{
        id: `fn-${Date.now()}`,
        date: enquiryData.date || new Date().toISOString().split('T')[0],
        note: `Initial intake: ${enquiryData.notes}`,
        staff: 'Ms. Clara Martinez'
      }] : []
    };
    setEnquiries(prev => [newEnquiry, ...prev]);
    logAudit('Receptionist', 'Ms. Clara Martinez', 'ADMISSION_ENQUIRY_LOGGED', 'Front Office', `New enquiry ${enquiryNo} for candidate ${enquiryData.candidateName} (Std ${enquiryData.standardApplying})`, newEnquiry.id);
    showToast(`Enquiry ${enquiryNo} registered for ${enquiryData.candidateName}.`);
  };

  const updateEnquiryStatus = (id: string, status: AdmissionEnquiry['status']) => {
    setEnquiries(prev => prev.map(e => (e.id === id ? { ...e, status } : e)));
    logAudit('Receptionist', 'Ms. Clara Martinez', 'ENQUIRY_STATUS_UPDATED', 'Front Office', `Enquiry ${id} status updated to ${status}`, id);
    showToast(`Enquiry status updated to ${status}.`);
  };

  const addEnquiryFollowUp = (enquiryId: string, note: string, nextFollowUpDate?: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newFollowUp: EnquiryFollowUp = {
      id: `fn-${Date.now()}`,
      date: todayStr,
      note,
      staff: 'Ms. Clara Martinez',
      nextFollowUpDate
    };

    setEnquiries(prev => prev.map(e => {
      if (e.id === enquiryId) {
        const existingNotes = e.followUpNotes || [];
        return {
          ...e,
          followUpDate: nextFollowUpDate || e.followUpDate,
          status: e.status === 'new' ? 'followup_required' : e.status,
          followUpNotes: [newFollowUp, ...existingNotes]
        };
      }
      return e;
    }));

    logAudit('Receptionist', 'Ms. Clara Martinez', 'ENQUIRY_FOLLOWUP_ADDED', 'Front Office', `Follow-up note logged for enquiry ${enquiryId}`, enquiryId);
    showToast('Follow-up interaction recorded.');
  };

  const convertEnquiryToLead = (enquiryId: string): { success: boolean; leadId: string } => {
    const enquiry = enquiries.find(e => e.id === enquiryId);
    if (!enquiry) return { success: false, leadId: '' };

    const leadId = `ADM-LEAD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setEnquiries(prev => prev.map(e => e.id === enquiryId ? {
      ...e,
      status: 'converted',
      convertedLeadId: leadId
    } : e));

    logAudit('Receptionist', 'Ms. Clara Martinez', 'ENQUIRY_CONVERTED', 'Front Office', `Converted enquiry ${enquiry.enquiryNo} to official admission lead ${leadId}`, enquiryId);
    showToast(`Enquiry successfully converted to Admission Lead #${leadId}.`);
    return { success: true, leadId };
  };

    const admitStudentFromLead = (
    enquiryId: string,
    standard: number,
    section: 'A' | 'B',
    rollNo: number = 25
  ): { success: boolean; student?: Student; message: string } => {
    if (currentRole !== 'principal' && currentRole !== 'admin' && currentRole !== 'vice_principal') {
      showToast('Unauthorized: Only school leadership can finalize student admissions.', 'error');
      return { success: false, message: 'Unauthorized role.' };
    }

    const enquiry = enquiries.find(e => e.id === enquiryId);
    if (!enquiry) {
      showToast('Error: Enquiry record not found.', 'error');
      return { success: false, message: 'Enquiry not found.' };
    }

    if (enquiry.admittedStudentId) {
      showToast(`Conflict: Enquiry ${enquiry.enquiryNo} has already been enrolled.`, 'warning');
      return { success: false, message: 'Already enrolled.' };
    }

    const today = new Date().toISOString().split('T')[0];
    const newAdmissionNo = `GIS-2026-${String(students.length + 101).padStart(4, '0')}`;
    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      admissionNo: newAdmissionNo,
      name: enquiry.candidateName,
      standard,
      section,
      rollNo,
      gender: 'Male',
      dob: '2013-05-15',
      admissionDate: today,
      status: 'Active',
      parentName: enquiry.parentName,
      parentPhone: enquiry.phone,
      parentEmail: enquiry.email || '',
      address: 'Greenfield City, Sector 4',
      attendanceRate: 100,
      feeStatus: 'pending',
      bloodGroup: 'B+',
      emergencyContact: enquiry.phone,
      documentsSubmitted: ['Birth Certificate', 'Previous Academic Records', 'Transfer Certificate']
    };

    setStudents(prev => [newStudent, ...prev]);

    // Create initial Term Fee Invoice for this new student
    const classFeeStructure = feeStructures.find(fs => fs.applicableStandards.includes(standard)) || feeStructures[0];
    const termAmount = classFeeStructure ? Math.round(classFeeStructure.totalAnnualAmount / 2) : 45000;
    const newInvoice: FeeInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNo: `INV-2026-${String(fees.length + 501).padStart(4, '0')}`,
      studentId: newStudent.id,
      studentName: newStudent.name,
      standard: newStudent.standard,
      section: newStudent.section,
      feeType: 'Tuition Fee',
      amount: termAmount,
      dueDate: '2026-11-15',
      status: 'pending',
      term: 'Term 1',
      academicYear: '2026–2027',
      paidAmount: 0,
      remainingBalance: termAmount
    };
    setFees(prev => [newInvoice, ...prev]);

    // Mark enquiry closed & link admittedStudentId
    setEnquiries(prev => prev.map(e => e.id === enquiryId ? {
      ...e,
      status: 'closed' as const,
      admittedStudentId: newStudent.id,
      notes: `${e.notes} [Admitted as ${newStudent.name} (${newAdmissionNo}) in Std ${standard}-${section}]`
    } : e));

    logAudit(
      currentRole === 'vice_principal' ? 'Vice Principal' : 'Principal',
      'School Leadership',
      'STUDENT_ENROLLED_FROM_LEAD',
      'Admissions',
      `Officially enrolled ${newStudent.name} (${newAdmissionNo}) in Std ${standard}-${section} from enquiry ${enquiry.enquiryNo}`,
      newStudent.id
    );

    showToast(`Admissions: ${newStudent.name} enrolled in Std ${standard}-${section} (${newAdmissionNo}) with initial fee allocation.`, 'success');
    return { success: true, student: newStudent, message: 'Student successfully admitted.' };
  };

const scheduleAppointment = (data: Omit<ReceptionAppointment, 'id' | 'appointmentNo' | 'createdAt' | 'createdBy'>): { success: boolean; conflict?: ReceptionAppointment; appointmentId?: string } => {
    // Conflict check: does the faculty already have an active appointment at the same date and overlapping start time?
    const conflict = appointments.find(a => 
      a.staffId === data.staffId &&
      a.date === data.date &&
      a.startTime === data.startTime &&
      a.status !== 'cancelled' &&
      a.status !== 'no_show'
    );

    if (conflict) {
      return { success: false, conflict };
    }

    const appointmentNo = `APT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const nowStr = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    const newAppt: ReceptionAppointment = {
      ...data,
      id: `apt-${Date.now()}`,
      appointmentNo,
      createdAt: nowStr,
      createdBy: 'Ms. Clara Martinez'
    };

    setAppointments(prev => [newAppt, ...prev]);
    logAudit('Receptionist', 'Ms. Clara Martinez', 'APPOINTMENT_SCHEDULED', 'Front Office', `Scheduled ${appointmentNo} with ${data.staffName} for ${data.visitorName} on ${data.date} at ${data.startTime}`, newAppt.id);
    showToast(`Appointment ${appointmentNo} scheduled successfully.`);
    return { success: true, appointmentId: newAppt.id };
  };

  const updateAppointmentStatus = (id: string, status: ReceptionAppointment['status'], notes?: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? {
      ...a,
      status,
      notes: notes ? (a.notes ? `${a.notes} | ${notes}` : notes) : a.notes
    } : a));
    logAudit('Receptionist', 'Ms. Clara Martinez', 'APPOINTMENT_STATUS_CHANGED', 'Front Office', `Appointment ${id} status changed to ${status}`, id);
    showToast(`Appointment status updated to ${status}.`);
  };

  const rescheduleAppointment = (id: string, newDate: string, newStartTime: string, newEndTime: string): { success: boolean; conflict?: ReceptionAppointment } => {
    const existing = appointments.find(a => a.id === id);
    if (!existing) return { success: false };

    const conflict = appointments.find(a => 
      a.id !== id &&
      a.staffId === existing.staffId &&
      a.date === newDate &&
      a.startTime === newStartTime &&
      a.status !== 'cancelled' &&
      a.status !== 'no_show'
    );

    if (conflict) {
      return { success: false, conflict };
    }

    setAppointments(prev => prev.map(a => a.id === id ? {
      ...a,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      status: 'scheduled',
      notes: a.notes ? `${a.notes} | Rescheduled to ${newDate} ${newStartTime}` : `Rescheduled to ${newDate} ${newStartTime}`
    } : a));

    logAudit('Receptionist', 'Ms. Clara Martinez', 'APPOINTMENT_RESCHEDULED', 'Front Office', `Rescheduled ${existing.appointmentNo} to ${newDate} at ${newStartTime}`, id);
    showToast(`Appointment ${existing.appointmentNo} rescheduled.`);
    return { success: true };
  };

  const logPhoneCall = (callData: Omit<PhoneCallLog, 'id' | 'callNo'>) => {
    const callNo = `CAL-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newCall: PhoneCallLog = {
      ...callData,
      id: `cal-${Date.now()}`,
      callNo
    };
    setCallLogs(prev => [newCall, ...prev]);
    logAudit('Receptionist', 'Ms. Clara Martinez', 'PHONE_CALL_LOGGED', 'Front Office', `Logged ${callData.type} call ${callNo} from ${callData.callerName} (${callData.purpose})`, newCall.id);
    showToast(`Call log ${callNo} recorded.`);
  };

  const updateCallLogStatus = (id: string, status: PhoneCallLog['status']) => {
    setCallLogs(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    logAudit('Receptionist', 'Ms. Clara Martinez', 'CALL_STATUS_UPDATED', 'Front Office', `Call ${id} marked as ${status}`, id);
    showToast(`Call record marked as ${status}.`);
  };

  const createReceptionRequest = (reqData: Omit<ReceptionRequest, 'id' | 'ticketNo'>) => {
    const ticketNo = `REQ-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newReq: ReceptionRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      ticketNo
    };
    setReceptionRequests(prev => [newReq, ...prev]);
    logAudit('Receptionist', 'Ms. Clara Martinez', 'RECEPTION_REQUEST_CREATED', 'Front Office', `Created ticket ${ticketNo} for ${reqData.requesterName} (${reqData.category})`, newReq.id);
    showToast(`Front-desk request ticket ${ticketNo} created.`);
  };

  const updateReceptionRequestStatus = (id: string, status: ReceptionRequestStatus, resolutionNotes?: string) => {
    const nowStr = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    setReceptionRequests(prev => prev.map(r => r.id === id ? {
      ...r,
      status,
      resolutionNotes: resolutionNotes || r.resolutionNotes,
      resolvedAt: (status === 'Resolved' || status === 'Closed') ? (r.resolvedAt || nowStr) : undefined
    } : r));
    logAudit('Receptionist', 'Ms. Clara Martinez', 'RECEPTION_REQUEST_UPDATED', 'Front Office', `Request ticket ${id} status set to ${status}`, id);
    showToast(`Request ticket updated to ${status}.`);
  };

  const assignReceptionRequest = (id: string, department: ReceptionRequest['assignedDepartment'], staff?: string) => {
    setReceptionRequests(prev => prev.map(r => r.id === id ? {
      ...r,
      assignedDepartment: department,
      assignedStaff: staff,
      status: 'Assigned'
    } : r));
    logAudit('Receptionist', 'Ms. Clara Martinez', 'RECEPTION_REQUEST_ASSIGNED', 'Front Office', `Reassigned request ${id} to ${department} (${staff || 'Unassigned'})`, id);
    showToast(`Request assigned to ${department}.`);
  };

  const createDocumentRequest = (docData: Omit<FrontOfficeDocumentRequest, 'id' | 'requestNo'>) => {
    const requestNo = `DOC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newDocReq: FrontOfficeDocumentRequest = {
      ...docData,
      id: `doc-${Date.now()}`,
      requestNo
    };
    setDocumentRequests(prev => [newDocReq, ...prev]);
    logAudit('Receptionist', 'Ms. Clara Martinez', 'DOCUMENT_REQUEST_LOGGED', 'Front Office', `Registered certificate request ${requestNo} (${docData.documentType}) for student ${docData.studentName}`, newDocReq.id);
    showToast(`Certificate request ${requestNo} submitted for processing.`);
  };

  const updateDocumentRequestStatus = (id: string, status: FrontOfficeDocStatus, notes?: string, rejectionReason?: string) => {
    setDocumentRequests(prev => prev.map(d => d.id === id ? {
      ...d,
      status,
      resolutionNotes: notes || d.resolutionNotes,
      rejectionReason: rejectionReason || d.rejectionReason
    } : d));
    logAudit('Receptionist', 'Ms. Clara Martinez', 'DOCUMENT_REQUEST_STATUS_UPDATED', 'Front Office', `Document request ${id} status set to ${status}`, id);
    showToast(`Document request status changed to ${status}.`);
  };

  const addBook = (bookData: Omit<LibraryBook, 'id'>) => {
    const newBook: LibraryBook = {
      ...bookData,
      id: `bk-${Date.now()}`
    };
    setBooks(prev => [newBook, ...prev]);

    // Automatically generate physical copies for the newly cataloged book
    const newCopies: LibraryBookCopy[] = [];
    const today = new Date().toISOString().split('T')[0];
    for (let i = 1; i <= (bookData.totalCopies || 1); i++) {
      newCopies.push({
        id: `cpy-${newBook.id}-${i}`,
        bookId: newBook.id,
        barcode: `BC-${bookData.bookId.replace(/[^0-9]/g, '') || Math.floor(1000 + Math.random() * 9000)}-${String(i).padStart(2, '0')}`,
        shelfRack: bookData.locationRack || 'Shelf G-01',
        status: 'Available',
        acquisitionDate: today,
        condition: 'Mint',
        notes: `Accessioned under catalog entry ${bookData.bookId}`
      });
    }
    setBookCopies(prev => [...newCopies, ...prev]);

    // Record library transaction
    const newTxn: LibraryTransaction = {
      id: `tx-${Date.now()}`,
      txnNo: `TXN-LIB-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString(),
      type: 'COPY_ADDED',
      bookTitle: bookData.title,
      memberId: 'staff-lib',
      memberName: "Mr. Samuel O'Connor",
      memberRole: 'Teacher',
      recordedBy: "Mr. Samuel O'Connor",
      notes: `Cataloged ${bookData.totalCopies} copies to rack ${bookData.locationRack}`
    };
    setLibraryTransactions(prev => [newTxn, ...prev]);

    logAudit('Librarian', "Mr. Samuel O'Connor", 'BOOK_ACQUISITION', 'Library', `Cataloged "${bookData.title}" (${bookData.totalCopies} copies)`, newBook.id);
    showToast(`Book "${bookData.title}" added to catalogue with ${bookData.totalCopies} physical copies.`);
  };

  const updateBook = (id: string, updates: Partial<LibraryBook>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    logAudit('Librarian', "Mr. Samuel O'Connor", 'BOOK_UPDATED', 'Library', `Updated details for book record ${id}`, id);
    showToast('Book details updated successfully.');
  };

  const deleteBook = (id: string) => {
    const target = books.find(b => b.id === id);
    setBooks(prev => prev.filter(b => b.id !== id));
    setBookCopies(prev => prev.filter(c => c.bookId !== id));
    logAudit('Librarian', "Mr. Samuel O'Connor", 'BOOK_ARCHIVED', 'Library', `Archived book catalogue item ${target?.title || id}`, id);
    showToast(`Book "${target?.title || id}" removed from catalogue.`, 'warning');
  };

  const issueBook = (issueData: Omit<BookIssue, 'id' | 'issueNo' | 'status' | 'fineAmount'>) => {
    const issueNo = `ISS-2026-${Math.floor(300 + Math.random() * 700)}`;
    const newIssue: BookIssue = {
      ...issueData,
      id: `iss-${Date.now()}`,
      issueNo,
      status: 'borrowed',
      fineAmount: 0
    };
    setBookIssues(prev => [newIssue, ...prev]);

    // Update book availableCopies
    setBooks(prev =>
      prev.map(b => (b.id === issueData.bookId || b.bookId === issueData.bookId ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b))
    );

    // Update first available physical copy of this book to 'Issued'
    setBookCopies(prev => {
      let marked = false;
      return prev.map(cpy => {
        if (!marked && (cpy.bookId === issueData.bookId || cpy.barcode.includes(issueData.bookId)) && cpy.status === 'Available') {
          marked = true;
          return {
            ...cpy,
            status: 'Issued' as const,
            currentBorrowerId: issueData.memberId,
            currentBorrowerName: issueData.memberName,
            currentBorrowerRole: issueData.memberRole,
            currentIssueId: newIssue.id
          };
        }
        return cpy;
      });
    });

    // Record library transaction
    const newTxn: LibraryTransaction = {
      id: `tx-${Date.now()}`,
      txnNo: `TXN-LIB-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString(),
      type: 'ISSUE',
      bookTitle: issueData.bookTitle,
      memberId: issueData.memberId,
      memberName: issueData.memberName,
      memberRole: issueData.memberRole,
      dueDate: issueData.dueDate,
      recordedBy: "Mr. Samuel O'Connor",
      notes: `Book issued against ${issueData.memberRole} membership. Due: ${issueData.dueDate}`
    };
    setLibraryTransactions(prev => [newTxn, ...prev]);

    logAudit('Librarian', "Mr. Samuel O'Connor", 'BOOK_ISSUED', 'Library', `Issued "${issueData.bookTitle}" to ${issueData.memberName} (${issueNo})`, newIssue.id);
  };

  const returnBook = (issueId: string, condition?: string, fineAmount: number = 0) => {
    const today = new Date().toISOString().split('T')[0];
    const targetIssue = bookIssues.find(i => i.id === issueId);
    if (!targetIssue) return;

    setBookIssues(prev =>
      prev.map(i => (i.id === issueId ? { ...i, status: 'returned', returnDate: today, fineAmount } : i))
    );

    setBooks(prev =>
      prev.map(b => (b.id === targetIssue.bookId || b.bookId === targetIssue.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b))
    );

    // Update physical copy status
    const isDamaged = condition === 'Damaged' || condition === 'Worn';
    setBookCopies(prev =>
      prev.map(cpy => {
        if (cpy.currentIssueId === issueId || (cpy.currentBorrowerId === targetIssue.memberId && cpy.status === 'Issued')) {
          return {
            ...cpy,
            status: isDamaged ? ('Damaged' as const) : ('Available' as const),
            condition: (condition as any) || cpy.condition,
            currentBorrowerId: undefined,
            currentBorrowerName: undefined,
            currentBorrowerRole: undefined,
            currentIssueId: undefined
          };
        }
        return cpy;
      })
    );

    // Record library transaction
    const newTxn: LibraryTransaction = {
      id: `tx-${Date.now()}`,
      txnNo: `TXN-LIB-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString(),
      type: 'RETURN',
      bookTitle: targetIssue.bookTitle,
      memberId: targetIssue.memberId,
      memberName: targetIssue.memberName,
      memberRole: targetIssue.memberRole,
      returnCondition: condition || 'Good',
      fineAmount,
      recordedBy: "Mr. Samuel O'Connor",
      notes: fineAmount > 0 ? `Returned with fine of ₹${fineAmount}. Condition: ${condition}` : `Returned in ${condition || 'Good'} condition`
    };
    setLibraryTransactions(prev => [newTxn, ...prev]);

    logAudit('Librarian', "Mr. Samuel O'Connor", 'BOOK_RETURNED', 'Library', `Returned "${targetIssue.bookTitle}" from ${targetIssue.memberName}`, issueId);
    showToast(`"${targetIssue.bookTitle}" returned successfully by ${targetIssue.memberName}.`);
  };

  const addBookCopy = (copyData: Omit<LibraryBookCopy, 'id'>) => {
    const newCopy: LibraryBookCopy = {
      ...copyData,
      id: `cpy-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    setBookCopies(prev => [newCopy, ...prev]);
    setBooks(prev => prev.map(b => b.id === copyData.bookId ? { ...b, totalCopies: b.totalCopies + 1, availableCopies: copyData.status === 'Available' ? b.availableCopies + 1 : b.availableCopies } : b));
    showToast(`Physical copy ${copyData.barcode} added to library inventory.`);
  };

  const updateBookCopyStatus = (copyId: string, status: LibraryBookCopy['status'], notes?: string) => {
    setBookCopies(prev => prev.map(c => c.id === copyId ? { ...c, status, notes: notes || c.notes } : c));
    showToast(`Copy status updated to "${status}".`);
  };

  const createReservation = (resData: Omit<BookReservation, 'id' | 'reservationNo'>) => {
    const reservationNo = `RES-2026-${String(bookReservations.length + 51).padStart(4, '0')}`;
    const newRes: BookReservation = {
      ...resData,
      id: `res-${Date.now()}`,
      reservationNo
    };
    setBookReservations(prev => [newRes, ...prev]);

    // Record transaction
    const newTxn: LibraryTransaction = {
      id: `tx-${Date.now()}`,
      txnNo: `TXN-LIB-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString(),
      type: 'RESERVATION',
      bookTitle: resData.bookTitle,
      memberId: resData.memberId,
      memberName: resData.memberName,
      memberRole: resData.memberRole,
      recordedBy: "Mr. Samuel O'Connor",
      notes: `Placed on reservation hold (#${reservationNo}) at queue pos ${resData.queuePosition}`
    };
    setLibraryTransactions(prev => [newTxn, ...prev]);

    logAudit('Librarian', "Mr. Samuel O'Connor", 'BOOK_RESERVED', 'Library', `Reservation #${reservationNo} placed for ${resData.bookTitle} by ${resData.memberName}`, newRes.id);
    showToast(`Reservation #${reservationNo} confirmed for ${resData.memberName}.`);
  };

  const cancelReservation = (id: string) => {
    setBookReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' as const } : r));
    showToast('Reservation cancelled.');
  };

  const fulfillReservation = (id: string) => {
    setBookReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'fulfilled' as const } : r));
    showToast('Reservation fulfilled.');
  };

  const recordLostOrDamagedBook = (recordData: Omit<LostDamagedBookRecord, 'id' | 'incidentNo'>) => {
    const incidentNo = `INC-LIB-2026-${String(lostDamagedBooks.length + 10).padStart(2, '0')}`;
    const newRecord: LostDamagedBookRecord = {
      ...recordData,
      id: `ld-${Date.now()}`,
      incidentNo
    };
    setLostDamagedBooks(prev => [newRecord, ...prev]);

    // Mark copy status
    setBookCopies(prev => prev.map(c => c.barcode === recordData.copyBarcode ? { ...c, status: recordData.type === 'Lost' ? 'Lost' : 'Damaged', notes: recordData.description } : c));

    // Update book available copies
    setBooks(prev => prev.map(b => b.id === recordData.bookId || b.title === recordData.bookTitle ? {
      ...b,
      availableCopies: Math.max(0, b.availableCopies - 1)
    } : b));

    // Record library transaction
    const newTxn: LibraryTransaction = {
      id: `tx-${Date.now()}`,
      txnNo: `TXN-LIB-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString(),
      type: recordData.type === 'Lost' ? 'LOST_RECORDED' : 'DAMAGE_RECORDED',
      bookTitle: recordData.bookTitle,
      copyBarcode: recordData.copyBarcode,
      memberId: recordData.memberId || 'unknown',
      memberName: recordData.memberName || 'Not Specified',
      memberRole: recordData.memberRole || 'Student',
      fineAmount: recordData.assessedCost,
      recordedBy: recordData.recordedBy || "Mr. Samuel O'Connor",
      notes: recordData.description
    };
    setLibraryTransactions(prev => [newTxn, ...prev]);

    logAudit('Librarian', "Mr. Samuel O'Connor", `BOOK_${recordData.type.toUpperCase()}`, 'Library', `${recordData.type} reported for ${recordData.bookTitle} (${recordData.copyBarcode})`, newRecord.id);
    showToast(`Incident #${incidentNo} recorded: Copy marked as ${recordData.type}.`, 'warning');
  };

  const addLibraryTransaction = (txnData: Omit<LibraryTransaction, 'id' | 'txnNo' | 'timestamp'>) => {
    const newTxn: LibraryTransaction = {
      ...txnData,
      id: `tx-${Date.now()}`,
      txnNo: `TXN-LIB-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString()
    };
    setLibraryTransactions(prev => [newTxn, ...prev]);
  };

  // ==========================================
  // TRANSPORT ACTIONS (Prompt 7)
  // ==========================================

  const addTransportVehicle = (vehData: Omit<TransportVehicle, 'id'>) => {
    const vehicleCode = `BUS-${String(transportVehicles.length + 9).padStart(2, '0')}`;
    const newVeh: TransportVehicle = {
      ...vehData,
      id: `veh-${Date.now()}`,
      vehicleCode: vehData.vehicleCode || vehicleCode
    };
    setTransportVehicles(prev => [newVeh, ...prev]);
    logAudit('Transport Manager', 'Mr. S. K. Nair', 'VEHICLE_REGISTERED', 'Transport', `Registered vehicle ${newVeh.vehicleCode} (${newVeh.vehicleNo})`, newVeh.id);
    showToast(`Vehicle ${newVeh.vehicleCode} (${newVeh.vehicleNo}) added to fleet.`);
    return { vehicleCode: newVeh.vehicleCode };
  };

  const updateTransportVehicle = (id: string, updates: Partial<TransportVehicle>) => {
    setTransportVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    logAudit('Transport Manager', 'Mr. S. K. Nair', 'VEHICLE_UPDATED', 'Transport', `Updated details for vehicle ${id}`, id);
    showToast('Vehicle records updated successfully.');
  };

  const deleteTransportVehicle = (id: string) => {
    const target = transportVehicles.find(v => v.id === id);
    setTransportVehicles(prev => prev.filter(v => v.id !== id));
    logAudit('Transport Manager', 'Mr. S. K. Nair', 'VEHICLE_DECOMMISSIONED', 'Transport', `Decommissioned vehicle ${target?.vehicleCode || id}`, id);
    showToast(`Vehicle ${target?.vehicleCode || id} removed from fleet.`, 'warning');
  };

  const addTransportDriver = (drvData: Omit<TransportDriver, 'id'>) => {
    const newDrv: TransportDriver = {
      ...drvData,
      id: `drv-${Date.now()}`
    };
    setTransportDrivers(prev => [newDrv, ...prev]);
    logAudit('Transport Manager', 'Mr. S. K. Nair', 'DRIVER_ENROLLED', 'Transport', `Enrolled transport staff ${newDrv.name} (${newDrv.role})`, newDrv.id);
    showToast(`Staff member ${newDrv.name} added to transit crew.`);
  };

  const updateTransportDriver = (id: string, updates: Partial<TransportDriver>) => {
    setTransportDrivers(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    logAudit('Transport Manager', 'Mr. S. K. Nair', 'DRIVER_UPDATED', 'Transport', `Updated driver record ${id}`, id);
    showToast('Driver details updated successfully.');
  };

  const addTransportRoute = (routeData: Omit<TransportRoute, 'id'>) => {
    const routeCode = `Route ${transportRoutes.length + 1}`;
    const newRoute: TransportRoute = {
      ...routeData,
      id: `rt-${Date.now()}`,
      routeCode: routeData.routeCode || routeCode
    };
    setTransportRoutes(prev => [newRoute, ...prev]);
    logAudit('Transport Manager', 'Mr. S. K. Nair', 'ROUTE_CREATED', 'Transport', `Created transit route ${newRoute.routeCode} (${newRoute.routeName})`, newRoute.id);
    showToast(`Transit route ${newRoute.routeCode} configured successfully.`);
    return { routeCode: newRoute.routeCode };
  };

  const updateTransportRoute = (id: string, updates: Partial<TransportRoute>) => {
    setTransportRoutes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    logAudit('Transport Manager', 'Mr. S. K. Nair', 'ROUTE_MODIFIED', 'Transport', `Updated route configuration for ${id}`, id);
    showToast('Route details and stops updated.');
  };

  const deleteTransportRoute = (id: string) => {
    const target = transportRoutes.find(r => r.id === id);
    setTransportRoutes(prev => prev.filter(r => r.id !== id));
    logAudit('Transport Manager', 'Mr. S. K. Nair', 'ROUTE_DELETED', 'Transport', `Removed route ${target?.routeCode || id}`, id);
    showToast(`Route ${target?.routeCode || id} decommissioned.`, 'warning');
  };

  const assignStudentTransport = (assignData: Omit<StudentTransportAssignment, 'id'>) => {
    // Check vehicle/route capacity
    const targetRoute = transportRoutes.find(r => r.id === assignData.routeId || r.routeCode === assignData.routeCode);
    if (targetRoute && targetRoute.assignedStudentsCount >= targetRoute.capacity) {
      showToast(`Cannot assign: ${targetRoute.routeCode} is at maximum capacity (${targetRoute.capacity} students)!`, 'error');
      return { success: false, message: `Route capacity of ${targetRoute.capacity} reached.` };
    }

    const newAssignment: StudentTransportAssignment = {
      ...assignData,
      id: `tra-${Date.now()}`
    };

    setTransportAssignments(prev => [newAssignment, ...prev.filter(a => a.studentId !== assignData.studentId)]);

    // Update route student count
    if (targetRoute) {
      setTransportRoutes(prev => prev.map(r => r.id === targetRoute.id ? { ...r, assignedStudentsCount: r.assignedStudentsCount + 1 } : r));
    }

    // Update student transport route field in shared students
    setStudents(prev => prev.map(s => s.id === assignData.studentId ? { ...s, transportRoute: assignData.routeCode } : s));

    logAudit('Transport Manager', 'Mr. S. K. Nair', 'COMMUTER_ASSIGNED', 'Transport', `Assigned ${assignData.studentName} to ${assignData.routeCode} (Stop: ${assignData.pickupStopName})`, newAssignment.id);
    showToast(`Student ${assignData.studentName} assigned to ${assignData.routeCode}.`);
    return { success: true, message: 'Student successfully allocated to route.' };
  };

  const cancelStudentTransport = (id: string) => {
    const target = transportAssignments.find(a => a.id === id);
    if (!target) return;

    setTransportAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a));

    // Decrement route student count
    setTransportRoutes(prev => prev.map(r => r.routeCode === target.routeCode ? { ...r, assignedStudentsCount: Math.max(0, r.assignedStudentsCount - 1) } : r));

    // Clear transport route on student record
    setStudents(prev => prev.map(s => s.id === target.studentId ? { ...s, transportRoute: undefined } : s));

    logAudit('Transport Manager', 'Mr. S. K. Nair', 'COMMUTER_CANCELLED', 'Transport', `Cancelled route assignment for ${target.studentName}`, id);
    showToast(`Transport assignment for ${target.studentName} cancelled.`);
  };

  const recordVehicleMaintenance = (maintData: Omit<VehicleMaintenanceRecord, 'id' | 'maintenanceNo'>) => {
    const maintenanceNo = `MNT-2026-${String(vehicleMaintenance.length + 95).padStart(3, '0')}`;
    const newMaint: VehicleMaintenanceRecord = {
      ...maintData,
      id: `maint-${Date.now()}`,
      maintenanceNo
    };
    setVehicleMaintenance(prev => [newMaint, ...prev]);

    // If maintenance is In Progress, update vehicle status
    if (maintData.status === 'In Progress') {
      setTransportVehicles(prev => prev.map(v => v.id === maintData.vehicleId || v.vehicleNo === maintData.vehicleNo ? { ...v, status: 'Under Maintenance' } : v));
    }

    logAudit('Transport Manager', 'Mr. S. K. Nair', 'MAINTENANCE_LOGGED', 'Transport', `Logged ${maintData.maintenanceType} for ${maintData.vehicleNo} (#${maintenanceNo})`, newMaint.id);
    showToast(`Maintenance log #${maintenanceNo} recorded.`);
    return { maintenanceNo };
  };

  const updateVehicleMaintenanceStatus = (id: string, status: VehicleMaintenanceRecord['status']) => {
    setVehicleMaintenance(prev => prev.map(m => {
      if (m.id === id) {
        if (status === 'Completed') {
          // Restore vehicle to active
          setTransportVehicles(vPrev => vPrev.map(v => v.id === m.vehicleId || v.vehicleNo === m.vehicleNo ? { ...v, status: 'Active' } : v));
        }
        return { ...m, status };
      }
      return m;
    }));
    showToast(`Maintenance status updated to "${status}".`);
  };

  const recordTransportIncident = (incData: Omit<TransportIncident, 'id' | 'incidentRef'>) => {
    const incidentRef = `INC-TR-2026-${String(transportIncidents.length + 18).padStart(3, '0')}`;
    const newInc: TransportIncident = {
      ...incData,
      id: `inc-${Date.now()}`,
      incidentRef
    };
    setTransportIncidents(prev => [newInc, ...prev]);
    logAudit('Transport Manager', 'Mr. S. K. Nair', 'TRANSIT_INCIDENT_LOGGED', 'Transport', `Logged ${incData.category} on ${incData.routeCode} (${incidentRef})`, newInc.id);
    showToast(`Incident #${incidentRef} registered in transit safety logs.`, 'warning');
    return { incidentRef };
  };

  const publishTransportAnnouncement = (annData: Omit<TransportAnnouncement, 'id' | 'broadcastNo'>) => {
    const broadcastNo = `TR-BC-2026-${String(transportAnnouncements.length + 12).padStart(2, '0')}`;
    const newAnn: TransportAnnouncement = {
      ...annData,
      id: `tbr-${Date.now()}`,
      broadcastNo
    };
    setTransportAnnouncements(prev => [newAnn, ...prev]);

    // Also mirror to global school notices if it targets all routes
    if (annData.targetAudience === 'all_routes') {
      const notice: Notice = {
        id: `not-tr-${Date.now()}`,
        title: `[Transit Alert] ${annData.title}`,
        category: 'General',
        audience: 'all',
        date: annData.publishDate,
        content: annData.message,
        author: 'Transport Directorate (Mr. S. K. Nair)',
        priority: annData.priority,
        status: 'published'
      };
      setNotices(nPrev => [notice, ...nPrev]);
    }

    logAudit('Transport Manager', 'Mr. S. K. Nair', 'TRANSIT_BROADCAST', 'Transport', `Broadcasted #${broadcastNo}: "${annData.title}" to ${annData.targetAudience}`, newAnn.id);
    showToast(`Transit announcement #${broadcastNo} broadcasted.`);
  };

  const addNotice = (noticeData: Omit<Notice, 'id'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: `not-${Date.now()}`
    };
    setNotices(prev => [newNotice, ...prev]);
    logAudit('Principal', noticeData.author, 'CIRCULAR_PUBLISHED', 'Announcements', `Broadcasted notice "${noticeData.title}" to ${noticeData.audience}`, newNotice.id);
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  const sendMessage = (text: string, receiverId: string, receiverName: string) => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const isParent = currentRole === 'parent_mobile';
    const newMessage: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: isParent ? 'parent-01' : 'tch-01',
      senderName: isParent ? 'Dr. Rajesh Sharma (Parent)' : 'Mrs. Shalini Verma',
      senderRole: isParent ? 'Parent' : 'Teacher',
      receiverId,
      receiverName,
      timestamp,
      text,
      isRead: true
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const submitAttendanceDiscrepancy = (data: Omit<AttendanceDiscrepancyRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newReq: AttendanceDiscrepancyRequest = {
      ...data,
      id: `dis-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setAttendanceDiscrepancies(prev => [newReq, ...prev]);
    logAudit('Parent', 'Dr. Rajesh Sharma', 'ATTENDANCE_DISCREPANCY_FILED', 'Attendance', `Discrepancy reported for ${data.studentName} on ${data.date}: "${data.reason}"`, newReq.id);
  };

  const updateAttendanceDiscrepancy = (id: string, status: AttendanceDiscrepancyRequest['status'], responseNote?: string) => {
    setAttendanceDiscrepancies(prev => prev.map(d => (d.id === id ? { ...d, status, responseNote, reviewedBy: 'Mrs. Shalini Verma' } : d)));
    logAudit('Teacher', 'Mrs. Shalini Verma', 'ATTENDANCE_DISCREPANCY_REVIEWED', 'Attendance', `Updated discrepancy ${id} status to ${status}`, id);
  };

  const submitStudentInfoRequest = (data: Omit<StudentInfoChangeRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newReq: StudentInfoChangeRequest = {
      ...data,
      id: `req-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setStudentInfoRequests(prev => [newReq, ...prev]);
    logAudit('Parent', 'Dr. Rajesh Sharma', 'STUDENT_INFO_CHANGE_REQUESTED', 'Student Records', `Requested ${data.requestType} for ${data.studentName}`, newReq.id);
  };

  const updateStudentInfoRequest = (id: string, status: StudentInfoChangeRequest['status'], reviewRemarks?: string) => {
    setStudentInfoRequests(prev => prev.map(r => (r.id === id ? { ...r, status, reviewRemarks } : r)));
    logAudit('Admin', 'Academic Office', 'STUDENT_INFO_REQUEST_UPDATED', 'Student Records', `Updated request ${id} status to ${status}`, id);
  };

  const resetDemoData = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_students`);
      localStorage.removeItem(`${STORAGE_KEY}_teachers`);
      localStorage.removeItem(`${STORAGE_KEY}_timetables`);
      localStorage.removeItem(`${STORAGE_KEY}_tt_version`);
      localStorage.removeItem(`${STORAGE_KEY}_leaves`);
      localStorage.removeItem(`${STORAGE_KEY}_substitutions`);
      localStorage.removeItem(`${STORAGE_KEY}_attendance`);
      localStorage.removeItem(`${STORAGE_KEY}_marks`);
      localStorage.removeItem(`${STORAGE_KEY}_assignments`);
      localStorage.removeItem(`${STORAGE_KEY}_fees`);
      localStorage.removeItem(`${STORAGE_KEY}_visitors`);
      localStorage.removeItem(`${STORAGE_KEY}_enquiries`);
      localStorage.removeItem(`${STORAGE_KEY}_books`);
      localStorage.removeItem(`${STORAGE_KEY}_book_issues`);
      localStorage.removeItem(`${STORAGE_KEY}_notices`);
      localStorage.removeItem(`${STORAGE_KEY}_events`);
      localStorage.removeItem(`${STORAGE_KEY}_messages`);
      localStorage.removeItem(`${STORAGE_KEY}_audit`);
      localStorage.removeItem(`${STORAGE_KEY}_transfers`);
      localStorage.removeItem(`${STORAGE_KEY}_discrepancies`);
      localStorage.removeItem(`${STORAGE_KEY}_info_requests`);
      localStorage.removeItem(`${STORAGE_KEY}_academic_years`);
      localStorage.removeItem(`${STORAGE_KEY}_active_ay_id`);
      localStorage.removeItem(`${STORAGE_KEY}_classes`);
      localStorage.removeItem(`${STORAGE_KEY}_subjects`);
      localStorage.removeItem(`${STORAGE_KEY}_subject_allocations`);
      localStorage.removeItem(`${STORAGE_KEY}_period_definitions`);
      localStorage.removeItem(`${STORAGE_KEY}_rooms`);
      localStorage.removeItem(`${STORAGE_KEY}_timetable_revisions`);
      localStorage.removeItem(`${STORAGE_KEY}_student_movements`);
      localStorage.removeItem(`${STORAGE_KEY}_correction_requests`);
      localStorage.removeItem(`${STORAGE_KEY}_staff_attendance`);
      localStorage.removeItem(`${STORAGE_KEY}_attendance_sessions`);
      localStorage.removeItem(`${STORAGE_KEY}_attendance_settings`);
      localStorage.removeItem(`${STORAGE_KEY}_fee_structures`);
      localStorage.removeItem(`${STORAGE_KEY}_fee_concessions`);
      localStorage.removeItem(`${STORAGE_KEY}_expenses`);
      localStorage.removeItem(`${STORAGE_KEY}_budgets`);
      localStorage.removeItem(`${STORAGE_KEY}_daybook_entries`);
      localStorage.removeItem(`${STORAGE_KEY}_book_copies`);
      localStorage.removeItem(`${STORAGE_KEY}_book_reservations`);
      localStorage.removeItem(`${STORAGE_KEY}_lost_damaged_books`);
      localStorage.removeItem(`${STORAGE_KEY}_library_transactions`);
      localStorage.removeItem(`${STORAGE_KEY}_transport_vehicles`);
      localStorage.removeItem(`${STORAGE_KEY}_transport_drivers`);
      localStorage.removeItem(`${STORAGE_KEY}_transport_routes`);
      localStorage.removeItem(`${STORAGE_KEY}_transport_assignments`);
      localStorage.removeItem(`${STORAGE_KEY}_vehicle_maintenance`);
      localStorage.removeItem(`${STORAGE_KEY}_transport_incidents`);
      localStorage.removeItem(`${STORAGE_KEY}_transport_announcements`);
      localStorage.removeItem(`${STORAGE_KEY}_reception_appointments`);
      localStorage.removeItem(`${STORAGE_KEY}_reception_call_logs`);
      localStorage.removeItem(`${STORAGE_KEY}_reception_requests`);
      localStorage.removeItem(`${STORAGE_KEY}_reception_document_requests`);
    } catch (e) {
      console.warn(e);
    }
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setTimetables(INITIAL_TIMETABLE);
    setTimetableVersion(INITIAL_TIMETABLE_VERSION);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setSubstitutions(INITIAL_SUBSTITUTIONS);
    setAttendance(INITIAL_ATTENDANCE);
    setMarks(INITIAL_MARKS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setFees(INITIAL_FEES);
    setVisitors(INITIAL_VISITORS);
    setEnquiries(INITIAL_ENQUIRIES);
    setAppointments(INITIAL_RECEPTION_APPOINTMENTS);
    setCallLogs(INITIAL_PHONE_CALL_LOGS);
    setReceptionRequests(INITIAL_RECEPTION_REQUESTS);
    setDocumentRequests(INITIAL_DOCUMENT_REQUESTS);
    setBooks(INITIAL_BOOKS);
    setBookIssues(INITIAL_BOOK_ISSUES);
    setBookCopies(INITIAL_BOOK_COPIES);
    setBookReservations(INITIAL_BOOK_RESERVATIONS);
    setLostDamagedBooks(INITIAL_LOST_DAMAGED_BOOKS);
    setLibraryTransactions(INITIAL_LIBRARY_TRANSACTIONS);
    setTransportVehicles(INITIAL_TRANSPORT_VEHICLES);
    setTransportDrivers(INITIAL_TRANSPORT_DRIVERS);
    setTransportRoutes(INITIAL_TRANSPORT_ROUTES);
    setTransportAssignments(INITIAL_TRANSPORT_ASSIGNMENTS);
    setVehicleMaintenance(INITIAL_VEHICLE_MAINTENANCE);
    setTransportIncidents(INITIAL_TRANSPORT_INCIDENTS);
    setTransportAnnouncements(INITIAL_TRANSPORT_ANNOUNCEMENTS);
    setNotices(INITIAL_NOTICES);
    setEvents(INITIAL_EVENTS);
    setMessages(INITIAL_MESSAGES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setTransfers(INITIAL_TRANSFERS);
    setAttendanceDiscrepancies(INITIAL_DISCREPANCIES);
    setStudentInfoRequests(INITIAL_INFO_REQUESTS);
    setAcademicYears(INITIAL_ACADEMIC_YEARS);
    setActiveAcademicYearId('ay-2026-27');
    setClasses(INITIAL_CLASSES);
    setSubjects(INITIAL_SUBJECTS);
    setSubjectAllocations(INITIAL_SUBJECT_ALLOCATIONS);
    setPeriodDefinitions(INITIAL_PERIOD_DEFINITIONS);
    setRooms(INITIAL_ROOMS);
    setTimetableRevisions(INITIAL_TIMETABLE_REVISIONS);
    setStudentMovements(INITIAL_STUDENT_MOVEMENTS);
    setCorrectionRequests(INITIAL_CORRECTION_REQUESTS);
    setStaffAttendance(INITIAL_STAFF_ATTENDANCE);
    setAttendanceSessions(INITIAL_ATTENDANCE_SESSIONS);
    setAttendanceSettings(INITIAL_ATTENDANCE_SETTINGS);
    setExaminations(INITIAL_EXAMINATIONS);
    setExamScheduleSlots(INITIAL_EXAM_SCHEDULE_SLOTS);
    setSubjectAssessments(INITIAL_SUBJECT_ASSESSMENTS);
    setGradingScales(INITIAL_GRADING_SCALES);
    setAssessmentSettings(INITIAL_ASSESSMENT_SETTINGS);
    setAssignmentSubmissions(INITIAL_ASSIGNMENT_SUBMISSIONS);
    setFeeStructures(INITIAL_FEE_STRUCTURES);
    setFeeConcessions(INITIAL_FEE_CONCESSIONS);
    setExpenses(INITIAL_EXPENSES);
    setBudgets(INITIAL_BUDGETS);
    setDaybookEntries(INITIAL_DAYBOOK_ENTRIES);
  };

  const switchRole = (role: RoleType) => {
    setCurrentRole(role);
    if (role === 'teacher_mobile' || role === 'parent_mobile') {
      setCurrentPlatform('mobile');
    } else {
      setCurrentPlatform('web');
    }
    setActiveTab('dashboard');
  };

  const signOut = () => {
    setCurrentRole(null);
  };

  return (
    <SchoolContext.Provider
      value={{
        currentPlatform,
        setCurrentPlatform,
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        themeColor,
        setThemeColor,
        isSidebarCollapsed,
        toggleSidebar,
        phoneFrameMode,
        setPhoneFrameMode,
        activeChildId,
        setActiveChildId,
        globalSearch,
        setGlobalSearch,
        students,
        teachers,
        attendance,
        marks,
        assignments,
        timetables,
        timetableVersion,
        timetableConflicts,
        leaveRequests,
        substitutions,
        fees,
        visitors,
        enquiries,
        books,
        bookIssues,
        notices,
        events,
        messages,
        auditLogs,
        transfers,
        attendanceDiscrepancies,
        studentInfoRequests,
        academicYears,
        activeAcademicYearId,
        classes,
        subjects,
        subjectAllocations,
        periodDefinitions,
        rooms,
        timetableRevisions,
        studentMovements,
        correctionRequests,
        staffAttendance,
        attendanceSessions,
        attendanceSettings,
        examinations,
        examScheduleSlots,
        subjectAssessments,
        gradingScales,
        assessmentSettings,
        assignmentSubmissions,
        canTeacherAccessSubject,
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
        updateGradingScale,
        logStudentMovement,
        updateStudentMovement,
        submitCorrectionRequest,
        reviewCorrectionRequest,
        markStaffAttendance,
        bulkMarkStaffAttendance,
        saveAttendanceSession,
        updateAttendanceSettings: updateAttendanceSettings,
        setActiveAcademicYearId,
        addAcademicYear,
        updateAcademicYear,
        archiveAcademicYear,
        addClass,
        updateClass,
        addSection,
        updateSection,
        archiveSection,
        addSubject,
        updateSubject,
        deleteSubject,
        saveSubjectAllocation,
        deleteSubjectAllocation,
        updatePeriodDefinition,
        addPeriodDefinition,
        createTimetableRevision,
        addSchoolEvent,
        updateSchoolEvent,
        deleteSchoolEvent,
        submitAttendanceDiscrepancy,
        updateAttendanceDiscrepancy,
        submitStudentInfoRequest,
        updateStudentInfoRequest,
        addStudent,
        updateStudent,
        deleteStudent,
        transferStudent,
        withdrawStudent,
        previewPromotion,
        executePromotionRollover,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        updateTeacherWorkloadLimit,
        submitLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        cancelLeaveRequest,
        assignSubstitute,
        cancelSubstitute,
        updateTimetableSlot,
        addTimetableSlot,
        deleteTimetableSlot,
        swapTimetableSlots,
        validateTimetableConflicts,
        publishTimetable,
        rollbackTimetable,
        markAttendance,
        saveBulkAttendance,
        saveMark,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        feeStructures,
        feeConcessions,
        expenses,
        budgets,
        daybookEntries,
        createFeeStructure,
        updateFeeStructure,
        deleteFeeStructure,
        assignFeeStructureToClass,
        applyFeeConcession,
        revokeFeeConcession,
        createFeeInvoice,
        collectFee,
        recordFeePayment,
        sendFeeReminder,
        recordExpense,
        approveExpense,
        rejectExpense,
        updateBudgetCategory,
        checkInVisitor,
        checkOutVisitor,
        addEnquiry,
        updateEnquiryStatus,
        addEnquiryFollowUp,
        convertEnquiryToLead,
        admitStudentFromLead,
        appointments,
        scheduleAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        callLogs,
        logPhoneCall,
        updateCallLogStatus,
        receptionRequests,
        createReceptionRequest,
        updateReceptionRequestStatus,
        assignReceptionRequest,
        documentRequests,
        createDocumentRequest,
        updateDocumentRequestStatus,
        bookCopies,
        bookReservations,
        lostDamagedBooks,
        libraryTransactions,
        addBook,
        updateBook,
        deleteBook,
        issueBook,
        returnBook,
        addBookCopy,
        updateBookCopyStatus,
        createReservation,
        cancelReservation,
        fulfillReservation,
        recordLostOrDamagedBook,
        addLibraryTransaction,
        transportVehicles,
        transportDrivers,
        transportRoutes,
        transportAssignments,
        vehicleMaintenance,
        transportIncidents,
        transportAnnouncements,
        addTransportVehicle,
        updateTransportVehicle,
        deleteTransportVehicle,
        addTransportDriver,
        updateTransportDriver,
        addTransportRoute,
        updateTransportRoute,
        deleteTransportRoute,
        assignStudentTransport,
        cancelStudentTransport,
        recordVehicleMaintenance,
        updateVehicleMaintenanceStatus,
        recordTransportIncident,
        publishTransportAnnouncement,
        addNotice,
        deleteNotice,
        sendMessage,
        logAudit,
        resetDemoData,
        switchRole,
        signOut,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
