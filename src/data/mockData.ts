import {
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
  RoleMeta,
  ThemeConfig,
  PermissionRule,
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
  AttendanceSessionEntity,
  AttendanceSettingsConfig,
  AttendanceCorrectionRequest,
  Examination,
  ExamScheduleSlot,
  SubjectAssessmentConfig,
  GradingScaleConfig,
  AssessmentSettingsConfig,
  AssignmentSubmission,
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
  FrontOfficeDocumentRequest
} from '../types/school';

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  navy: {
    id: 'navy',
    name: 'Campus Navy',
    primary: '#1e40af',
    primaryHover: '#1d4ed8',
    lightBg: '#eff6ff',
    border: '#bfdbfe',
    ring: '#3b82f6',
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    accentText: 'text-blue-800'
  },
  slate: {
    id: 'slate',
    name: 'Modern Slate',
    primary: '#334155',
    primaryHover: '#1e293b',
    lightBg: '#f8fafc',
    border: '#cbd5e1',
    ring: '#64748b',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    accentText: 'text-slate-800'
  },
  emerald: {
    id: 'emerald',
    name: 'Academic Emerald',
    primary: '#047857',
    primaryHover: '#065f46',
    lightBg: '#ecfdf5',
    border: '#a7f3d0',
    ring: '#10b981',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    accentText: 'text-emerald-800'
  },
  indigo: {
    id: 'indigo',
    name: 'Royal Indigo',
    primary: '#4338ca',
    primaryHover: '#3730a3',
    lightBg: '#eef2ff',
    border: '#c7d2fe',
    ring: '#6366f1',
    badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    accentText: 'text-indigo-800'
  },
  amber: {
    id: 'amber',
    name: 'Warm Amber',
    primary: '#b45309',
    primaryHover: '#92400e',
    lightBg: '#fffbeb',
    border: '#fde68a',
    ring: '#f59e0b',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    accentText: 'text-amber-800'
  },
  rose: {
    id: 'rose',
    name: 'Heritage Rose',
    primary: '#be123c',
    primaryHover: '#9f1239',
    lightBg: '#fff1f2',
    border: '#fecdd3',
    ring: '#f43f5e',
    badge: 'bg-rose-50 text-rose-800 border-rose-200',
    accentText: 'text-rose-800'
  }
};

export const ROLE_DEFINITIONS: RoleMeta[] = [
  {
    id: 'principal',
    title: 'Admin / Principal',
    subtitle: 'Institutional Leadership & Governance',
    platform: 'web',
    description: 'High-level administration across all standards 1–10. Oversees student rosters, faculty governance, master timetable publishing, staff leaves, fee overview, and compliance audit trail.',
    modules: ['School Dashboard', 'Complete Student Directory', 'Teacher & Staff Management', 'Class & Section Allocations', 'Full Timetable Oversight', 'Leave & Substitution Approval', 'Admissions & Transfers', 'Finance Overview', 'Audit History', 'School Settings'],
    demoUser: {
      name: 'Dr. Evelyn Montgomery',
      designation: 'Principal & Head of School',
      email: 'principal@greenfield.edu'
    },
    iconName: 'ShieldAlert'
  },
  {
    id: 'vice_principal',
    title: 'Vice Principal / Academic Dean',
    subtitle: 'Curriculum Pacing, Timetable Coordination & Moderation',
    platform: 'web',
    description: 'Direct pedagogical oversight, teacher substitutions, weekly timetable matrix editor with conflict validation, marks moderation, syllabus coverage tracking, and admit card fee clearance.',
    modules: ['Academic Dashboard', 'Teacher Academic Allocations', 'Full Timetable Editor', 'Conflict Validation Engine', 'Leave & Substitution Management', 'Exams & Marks Moderation', 'Admit Card Clearance', 'Academic Calendar'],
    demoUser: {
      name: 'Prof. Marcus Vance',
      designation: 'Vice Principal & Academic Dean',
      email: 'vp.academic@greenfield.edu'
    },
    iconName: 'Award'
  },
  {
    id: 'teacher_web',
    title: 'Teacher — Web Portal',
    subtitle: 'Classroom & Gradebook Management',
    platform: 'web',
    description: 'Class teacher workspace for attendance roll call, entering unit test and term marks, publishing homework assignments, viewing schedules, and submitting leave requests.',
    modules: ['Teacher Dashboard', 'My Classes & Rosters', 'Daily Attendance Register', 'Marks & Gradebook', 'Assignments & Homework', 'My Weekly Timetable', 'Leave Request Submission', 'Parent Messages'],
    demoUser: {
      name: 'Mrs. Shalini Verma',
      designation: 'Senior Faculty — Mathematics (Class 8-A & 9-B)',
      email: 'shalini.verma@greenfield.edu'
    },
    iconName: 'BookOpen'
  },
  {
    id: 'teacher_mobile',
    title: 'Teacher — Mobile App',
    subtitle: 'On-the-go Classroom Companion',
    platform: 'mobile',
    description: 'Fast mobile companion for rapid attendance marking from the classroom floor, instant grade input, lesson timetable reminders, leave requests, and push announcements.',
    modules: ['Home Feed', 'Today\'s Classes', 'Quick Roll Call', 'Instant Marks', 'Assignments', 'Day Timetable', 'Submit Leave', 'Tasks & Notices'],
    demoUser: {
      name: 'Mrs. Shalini Verma',
      designation: 'Class Teacher (8-A)',
      email: 'shalini.verma@greenfield.edu'
    },
    iconName: 'Smartphone'
  },
  {
    id: 'parent_web',
    title: 'Parent — Web Portal',
    subtitle: 'Child Progress, Fee Payments & Academic Records',
    platform: 'web',
    description: 'Multi-child guardian portal for reviewing academic performance, CBSE report cards, detailed tuition fee ledgers, online payment verification, and teacher communications.',
    modules: ['Multi-Child Switcher', 'Academic Progress', 'Detailed Fee Ledger', 'Online Payment Checkout', 'Official Receipt Vault', 'CBSE Report Cards', 'Attendance Calendar', 'Teacher Messaging'],
    demoUser: {
      name: 'Dr. Rajesh Sharma',
      designation: 'Guardian of Aarav (8-A) & Ananya (5-B)',
      email: 'rajesh.sharma@medmail.com'
    },
    iconName: 'Users'
  },
  {
    id: 'parent_mobile',
    title: 'Parent — Mobile App',
    subtitle: 'Child Progress & Guardian Companion',
    platform: 'mobile',
    description: 'Track academic report cards, daily attendance alerts, pay term tuition with instant UPI receipts, view class timetables, and direct-chat with class teachers.',
    modules: ['Multi-Child Switcher', 'Academic Progress', 'Attendance Record', 'Report Cards & Marks', 'Homework Feed', 'UPI Fee Checkout & Receipts', 'Teacher Chat', 'Notices'],
    demoUser: {
      name: 'Dr. Rajesh Sharma',
      designation: 'Guardian of Aarav (8-A) & Ananya (5-B)',
      email: 'rajesh.sharma@medmail.com'
    },
    iconName: 'Smartphone'
  },
  {
    id: 'accountant',
    title: 'Accountant / Fee Manager',
    subtitle: 'Bursar, Fee Collections, Vouchers & Daybook',
    platform: 'web',
    description: 'Tuition fee structures, student ledger cards, fee collection receipts, concession sanctioning, departmental expense vouchers, and double-entry daybook.',
    modules: ['Finance Dashboard', 'Students & Fee Ledgers', 'Approved Fee Structure', 'Concessions & Scholarships', 'Collections & Transactions', 'Expense Vouchers', 'Department Budgets', 'Daily Daybook', 'Financial Reports'],
    demoUser: {
      name: 'Mr. David Reynolds',
      designation: 'Chief Bursar & Finance Officer',
      email: 'finance@greenfield.edu'
    },
    iconName: 'DollarSign'
  },
  {
    id: 'hr_manager',
    title: 'HR / Staff Manager',
    subtitle: 'Staff Rosters, Leaves & Biometric Records',
    platform: 'web',
    description: 'Human resources management: faculty dossiers, biometric gate attendance, leave quota tracking and approvals, substitutions, and payroll readiness rosters.',
    modules: ['Staff Roster Directory', 'Biometric Gate Attendance', 'Leave Balance & Approvals', 'Faculty Substitutions', 'Staff Appraisals', 'Department Allocations', 'Payroll Readiness'],
    demoUser: {
      name: 'Ms. Anita Desai',
      designation: 'Director of Human Resources',
      email: 'hr@greenfield.edu'
    },
    iconName: 'UserCheck'
  },
  {
    id: 'librarian',
    title: 'Librarian',
    subtitle: 'Catalog, Borrowings & Overdue Fines',
    platform: 'web',
    description: 'School library repository management, barcode check-out, member cards, tracking due books, fine collections, and catalog procurement.',
    modules: ['Library Dashboard', 'Book Catalog & Volumes', 'Circulation Desk (Issue/Return)', 'Due & Overdue Tracking', 'Fine Collection Ledger', 'Member Cards & Reports'],
    demoUser: {
      name: 'Mr. Samuel O\'Connor',
      designation: 'Head Librarian',
      email: 'library@greenfield.edu'
    },
    iconName: 'Library'
  },
  {
    id: 'transport_manager',
    title: 'Transport Manager',
    subtitle: 'Transit Logistics, Fleet Routes & Transit Safety',
    platform: 'web',
    description: 'Campus vehicle fleet tracking, bus route planning, driver and conductor allocations, student pickup/drop manifests, and vehicle maintenance logs.',
    modules: ['Fleet Operations Dashboard', 'Bus Routes & Stops', 'Vehicle Fleet Inventory', 'Driver & Conductor Roster', 'Student Transit Roster', 'Maintenance Logs', 'Safety Incident Alerts'],
    demoUser: {
      name: 'Mr. Harpreet Singh',
      designation: 'Director of Campus Logistics & Fleet',
      email: 'transport@greenfield.edu'
    },
    iconName: 'Bus'
  },
  {
    id: 'receptionist',
    title: 'Receptionist / Front Office',
    subtitle: 'Visitor Passes, Enquiries & Admissions Desk',
    platform: 'web',
    description: 'Front gate digital visitor badges, new student admission enquiries pipeline, gate passes, student movement logging, and emergency contact directories.',
    modules: ['Front Desk Dashboard', 'Admission Enquiries Pipeline', 'Visitor Passes & Check-in', 'Gate Passes & Movement Log', 'Appointments Schedule', 'Student Fee Clearance', 'Emergency Contacts'],
    demoUser: {
      name: 'Ms. Clara Martinez',
      designation: 'Front Office Executive',
      email: 'reception@greenfield.edu'
    },
    iconName: 'PhoneCall'
  },
  {
    id: 'exam_coordinator',
    title: 'Exam Coordinator',
    subtitle: 'Exam Schedules, Seating & CBSE Grading',
    platform: 'web',
    description: 'Institutional examination control: datesheet planning, seating plans, invigilation duty rosters, marks moderation, and CBSE 9-point grading scale report cards.',
    modules: ['Exam Control Dashboard', 'Exam Datesheet Scheduler', 'Seating & Room Allocations', 'Invigilation Roster', 'Marks Tabulation & Moderation', 'Grading Scale Setup', 'CBSE Report Cards'],
    demoUser: {
      name: 'Dr. Sunita Kulkarni',
      designation: 'Chief Examination Controller',
      email: 'exams@greenfield.edu'
    },
    iconName: 'CheckSquare'
  }
];

// Helper to generate 100 realistic students
const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Meera', 'Kabir', 'Dia', 'Aditya', 'Tanvi', 'Zayn', 'Pooja',
  'Ishaan', 'Kavya', 'Vihaan', 'Sanya', 'Arjun', 'Rhea', 'Dhruv', 'Tara', 'Reyansh', 'Navya',
  'Aryan', 'Isha', 'Krishna', 'Avani', 'Advait', 'Myra', 'Ayush', 'Kiara', 'Shaurya', 'Anika',
  'Manav', 'Sara', 'Pranav', 'Tanvi', 'Siddharth', 'Prisha', 'Kunal', 'Roshni', 'Neil', 'Samaira',
  'Varun', 'Divya', 'Harsh', 'Trisha', 'Dev', 'Aditi', 'Samar', 'Khushi', 'Tejas', 'Shreya'
];

const LAST_NAMES = [
  'Sharma', 'Deshmukh', 'Iyer', 'Patel', 'Fernandez', 'Singhania', 'Nair', 'Khan', 'Reddy', 'Chopra',
  'Joshi', 'Verma', 'Agarwal', 'Menon', 'Kulkarni', 'Bhatia', 'Malhotra', 'Sengupta', 'Pillai', 'Rao'
];

function generate100Students(): Student[] {
  const list: Student[] = [];
  // Ensure the 2 primary parent demo children exist first
  list.push(
    {
      id: 'stu-101',
      admissionNo: 'GIS-2022-0142',
      name: 'Aarav Sharma',
      standard: 8,
      section: 'A',
      rollNo: 1,
      gender: 'Male',
      dob: '2013-05-14',
      admissionDate: '2022-04-10',
      status: 'Active',
      parentName: 'Dr. Rajesh Sharma',
      parentPhone: '+91 98765 43210',
      parentEmail: 'rajesh.sharma@medmail.com',
      address: 'Flat 402, Oakwood Enclave, Greenfield City',
      attendanceRate: 96,
      feeStatus: 'paid',
      bloodGroup: 'O+',
      emergencyContact: '+91 98765 43211',
      previousClass: 'Class 7-A (94% Marks)',
      documentsSubmitted: ['Birth Certificate', 'Transfer Certificate', 'Immunization Card']
    },
    {
      id: 'stu-102',
      admissionNo: 'GIS-2024-0089',
      name: 'Ananya Sharma',
      standard: 5,
      section: 'B',
      rollNo: 4,
      gender: 'Female',
      dob: '2016-08-22',
      admissionDate: '2024-04-12',
      status: 'Active',
      parentName: 'Dr. Rajesh Sharma',
      parentPhone: '+91 98765 43210',
      parentEmail: 'rajesh.sharma@medmail.com',
      address: 'Flat 402, Oakwood Enclave, Greenfield City',
      attendanceRate: 94,
      feeStatus: 'pending',
      bloodGroup: 'B+',
      emergencyContact: '+91 98765 43211',
      previousClass: 'Class 4-A (91% Marks)',
      documentsSubmitted: ['Birth Certificate', 'Aadhaar Copy']
    }
  );

  let idCounter = 103;
  // Generate across Standards 1 to 10
  for (let std = 1; std <= 10; std++) {
    for (let sec of ['A', 'B'] as const) {
      // 5 students per section to reach 100 students total (10 * 2 * 5 = 100)
      for (let r = 1; r <= 5; r++) {
        // Skip duplicate of stu-101 and stu-102 if already added
        if ((std === 8 && sec === 'A' && r === 1) || (std === 5 && sec === 'B' && r === 4)) {
          continue;
        }

        const fn = FIRST_NAMES[(std * 7 + r * 3) % FIRST_NAMES.length];
        const ln = LAST_NAMES[(std * 3 + r * 5) % LAST_NAMES.length];
        const gender: 'Male' | 'Female' = r % 2 === 0 ? 'Female' : 'Male';
        const feeStatus = r === 5 ? 'overdue' : r === 4 ? 'pending' : 'paid';
        const attRate = 82 + ((std * 13 + r * 7) % 17);

        list.push({
          id: `stu-${idCounter}`,
          admissionNo: `GIS-${2020 + (std % 6)}-${String(idCounter).padStart(4, '0')}`,
          name: `${fn} ${ln}`,
          standard: std,
          section: sec,
          rollNo: r,
          gender,
          dob: `${2021 - std}-0${(r % 9) + 1}-15`,
          admissionDate: `${2020 + (std % 5)}-04-10`,
          status: 'Active',
          parentName: `Mr. Suresh ${ln}`,
          parentPhone: `+91 98${std}${r}0 11${idCounter % 90}`,
          parentEmail: `parent.${fn.toLowerCase()}@example.com`,
          address: `House ${r * 12}, Sector ${std}, Greenfield City`,
          attendanceRate: attRate,
          feeStatus,
          bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'O-'][r % 5],
          emergencyContact: `+91 98${std}${r}0 99999`,
          previousClass: std > 1 ? `Class ${std - 1}-${sec}` : 'Kindergarten',
          documentsSubmitted: ['Birth Certificate', 'Medical Form']
        });
        idCounter++;
      }
    }
  }

  return list;
}

export const INITIAL_STUDENTS: Student[] = generate100Students();

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-01',
    empId: 'TCH-2016-042',
    name: 'Mrs. Shalini Verma',
    designation: 'Senior Faculty',
    department: 'Mathematics',
    staffCategory: 'Teaching',
    qualification: 'M.Sc. Mathematics, B.Ed.',
    experience: '12 Years',
    joiningDate: '2016-06-01',
    employmentStatus: 'Active',
    subjects: ['Mathematics', 'Vedic Math'],
    classesAssigned: ['8-A', '8-B', '9-B'],
    classTeacherOf: '8-A',
    maxWeeklyWorkload: 26,
    currentWeeklyWorkload: 22,
    phone: '+91 98221 44550',
    email: 'shalini.verma@greenfield.edu',
    emergencyContact: '+91 98221 44559'
  },
  {
    id: 'tch-02',
    empId: 'TCH-2018-067',
    name: 'Dr. Alok Sen',
    designation: 'Head of Department',
    department: 'Science',
    staffCategory: 'Teaching',
    qualification: 'Ph.D. Physics, M.Sc.',
    experience: '15 Years',
    joiningDate: '2018-04-15',
    employmentStatus: 'Active',
    subjects: ['Physics', 'Integrated Science'],
    classesAssigned: ['8-A', '9-A', '10-A'],
    classTeacherOf: '10-A',
    maxWeeklyWorkload: 26,
    currentWeeklyWorkload: 24,
    phone: '+91 98112 55660',
    email: 'alok.sen@greenfield.edu',
    emergencyContact: '+91 98112 55669'
  },
  {
    id: 'tch-03',
    empId: 'TCH-2019-089',
    name: 'Ms. Rebecca D\'Souza',
    designation: 'Senior Faculty',
    department: 'English & Literature',
    staffCategory: 'Teaching',
    qualification: 'M.A. English Literature, CELTA',
    experience: '9 Years',
    joiningDate: '2019-07-01',
    employmentStatus: 'On Leave', // currently on medical leave to trigger substitution workflow
    subjects: ['English Language', 'Literature'],
    classesAssigned: ['7-A', '8-A', '10-A'],
    classTeacherOf: '7-A',
    maxWeeklyWorkload: 24,
    currentWeeklyWorkload: 18,
    phone: '+91 98334 66770',
    email: 'rebecca.dsouza@greenfield.edu'
  },
  {
    id: 'tch-04',
    empId: 'TCH-2020-104',
    name: 'Mr. Arvind Saxena',
    designation: 'Faculty',
    department: 'Social Science',
    staffCategory: 'Teaching',
    qualification: 'M.A. History, B.Ed.',
    experience: '8 Years',
    joiningDate: '2020-03-10',
    employmentStatus: 'Active',
    subjects: ['History', 'Civics', 'Geography'],
    classesAssigned: ['6-A', '7-B', '8-A'],
    classTeacherOf: '8-B',
    maxWeeklyWorkload: 26,
    currentWeeklyWorkload: 20,
    phone: '+91 98445 77880',
    email: 'arvind.saxena@greenfield.edu'
  },
  {
    id: 'tch-05',
    empId: 'TCH-2021-118',
    name: 'Ms. Neha Gupta',
    designation: 'Lead Faculty',
    department: 'Computer Science & AI',
    staffCategory: 'Teaching',
    qualification: 'B.Tech IT, M.Tech CSE',
    experience: '6 Years',
    joiningDate: '2021-08-16',
    employmentStatus: 'Active',
    subjects: ['Computer Science', 'Coding & Robotics'],
    classesAssigned: ['5-A', '6-A', '8-A', '9-A'],
    maxWeeklyWorkload: 24,
    currentWeeklyWorkload: 19,
    phone: '+91 98556 88990',
    email: 'neha.gupta@greenfield.edu'
  },
  {
    id: 'tch-06',
    empId: 'TCH-2017-055',
    name: 'Mr. Pradeep Kulkarni',
    designation: 'Faculty',
    department: 'Hindi & Sanskrit',
    staffCategory: 'Teaching',
    qualification: 'M.A. Hindi, B.Ed.',
    experience: '11 Years',
    joiningDate: '2017-05-15',
    employmentStatus: 'Active',
    subjects: ['Hindi', 'Sanskrit'],
    classesAssigned: ['5-B', '7-A', '8-A'],
    maxWeeklyWorkload: 26,
    currentWeeklyWorkload: 21,
    phone: '+91 98667 99001',
    email: 'pradeep.kulkarni@greenfield.edu'
  },
  {
    id: 'tch-07',
    empId: 'TCH-2022-132',
    name: 'Coach Vikram Rawat',
    designation: 'Director of Physical Education',
    department: 'Sports & Athletics',
    staffCategory: 'Teaching',
    qualification: 'M.P.Ed., NIS Certified',
    experience: '10 Years',
    joiningDate: '2022-01-10',
    employmentStatus: 'Active',
    subjects: ['Physical Education', 'Athletics'],
    classesAssigned: ['6-A', '7-A', '8-A', '9-A', '10-A'],
    maxWeeklyWorkload: 28,
    currentWeeklyWorkload: 20,
    phone: '+91 98778 00112',
    email: 'vikram.rawat@greenfield.edu'
  },
  {
    id: 'tch-08',
    empId: 'TCH-2023-145',
    name: 'Ms. Arundhati Roy',
    designation: 'Faculty',
    department: 'Fine Arts & Craft',
    staffCategory: 'Teaching',
    qualification: 'B.F.A., M.F.A.',
    experience: '5 Years',
    joiningDate: '2023-04-01',
    employmentStatus: 'Active',
    subjects: ['Fine Arts', 'Craft & Design'],
    classesAssigned: ['1-A', '2-A', '3-A', '4-A', '5-A'],
    maxWeeklyWorkload: 24,
    currentWeeklyWorkload: 18,
    phone: '+91 98889 11223',
    email: 'arundhati.roy@greenfield.edu'
  },
  {
    id: 'stf-09',
    empId: 'ADM-2015-012',
    name: 'Dr. Evelyn Montgomery',
    designation: 'Principal & Head of School',
    department: 'School Leadership',
    staffCategory: 'Administrative',
    qualification: 'Ph.D. Education Leadership, M.A., B.Ed.',
    experience: '22 Years',
    joiningDate: '2015-03-01',
    employmentStatus: 'Active',
    subjects: ['Leadership Ethics'],
    classesAssigned: ['10-A'],
    maxWeeklyWorkload: 10,
    currentWeeklyWorkload: 4,
    phone: '+91 98100 00111',
    email: 'principal@greenfield.edu'
  },
  {
    id: 'stf-10',
    empId: 'ADM-2017-024',
    name: 'Prof. Marcus Vance',
    designation: 'Vice Principal & Academic Dean',
    department: 'Academic Coordination',
    staffCategory: 'Administrative',
    qualification: 'M.Phil., M.Sc., B.Ed.',
    experience: '18 Years',
    joiningDate: '2017-06-15',
    employmentStatus: 'Active',
    subjects: ['Curriculum Coordination'],
    classesAssigned: ['9-A', '10-A'],
    maxWeeklyWorkload: 12,
    currentWeeklyWorkload: 6,
    phone: '+91 98200 00222',
    email: 'vp.academic@greenfield.edu'
  },
  {
    id: 'stf-11',
    empId: 'FIN-2019-035',
    name: 'Mr. David Reynolds',
    designation: 'Chief Bursar & Finance Officer',
    department: 'Finance & Accounts',
    staffCategory: 'Non-Teaching',
    qualification: 'M.Com, Chartered Accountant (Inter)',
    experience: '14 Years',
    joiningDate: '2019-02-01',
    employmentStatus: 'Active',
    subjects: [],
    classesAssigned: [],
    maxWeeklyWorkload: 0,
    currentWeeklyWorkload: 0,
    phone: '+91 98300 00333',
    email: 'finance@greenfield.edu'
  },
  {
    id: 'stf-12',
    empId: 'LIB-2018-041',
    name: 'Mr. Samuel O\'Connor',
    designation: 'Head Librarian',
    department: 'Library Sciences',
    staffCategory: 'Non-Teaching',
    qualification: 'M.Lib.Sc., UGC-NET',
    experience: '11 Years',
    joiningDate: '2018-09-01',
    employmentStatus: 'Active',
    subjects: ['Library Literacy'],
    classesAssigned: ['5-A', '6-A', '7-A', '8-A'],
    maxWeeklyWorkload: 16,
    currentWeeklyWorkload: 12,
    phone: '+91 98400 00444',
    email: 'library@greenfield.edu'
  },
  {
    id: 'stf-13',
    empId: 'REC-2022-088',
    name: 'Ms. Clara Martinez',
    designation: 'Front Office Executive',
    department: 'Front Desk & Reception',
    staffCategory: 'Non-Teaching',
    qualification: 'B.A. Public Relations',
    experience: '5 Years',
    joiningDate: '2022-05-10',
    employmentStatus: 'Active',
    subjects: [],
    classesAssigned: [],
    maxWeeklyWorkload: 0,
    currentWeeklyWorkload: 0,
    phone: '+91 98500 00555',
    email: 'reception@greenfield.edu'
  }
];

export const INITIAL_LEAVE_REQUESTS: StaffLeaveRequest[] = [
  {
    id: 'lvr-01',
    staffId: 'tch-03',
    staffName: 'Ms. Rebecca D\'Souza',
    leaveType: 'Sick Leave',
    startDate: '2026-10-14',
    endDate: '2026-10-14',
    daysCount: 1,
    reason: 'Severe throat infection and doctor advised rest.',
    status: 'approved',
    appliedAt: '2026-10-13 18:20',
    reviewedBy: 'Dr. Evelyn Montgomery',
    reviewRemarks: 'Approved. Substitution required for Period 3 (8-A English).',
    affectedPeriodsCount: 3
  },
  {
    id: 'lvr-02',
    staffId: 'tch-04',
    staffName: 'Mr. Arvind Saxena',
    leaveType: 'Casual Leave',
    startDate: '2026-10-17',
    endDate: '2026-10-18',
    daysCount: 2,
    reason: 'Family wedding out of station.',
    status: 'pending',
    appliedAt: '2026-10-14 08:30',
    affectedPeriodsCount: 4
  }
];

export const INITIAL_SUBSTITUTIONS: SubstitutionAssignment[] = [
  {
    id: 'sub-01',
    leaveRequestId: 'lvr-01',
    originalTeacherId: 'tch-03',
    originalTeacherName: 'Ms. Rebecca D\'Souza',
    substituteTeacherId: 'tch-07',
    substituteTeacherName: 'Coach Vikram Rawat',
    date: '2026-10-14',
    day: 'Wednesday',
    period: 3,
    time: '10:15 - 11:00',
    standard: 8,
    section: 'A',
    subject: 'English (Reading Practice)',
    room: 'Room 204',
    status: 'scheduled',
    notes: 'Covering library silent reading period during illness.'
  }
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Class 8-A Timetable (Monday)
  { id: 'tt-1', standard: 8, section: 'A', day: 'Monday', period: 1, time: '08:30 - 09:15', subject: 'Mathematics', teacherId: 'tch-01', teacherName: 'Mrs. Shalini Verma', room: 'Room 204' },
  { id: 'tt-2', standard: 8, section: 'A', day: 'Monday', period: 2, time: '09:15 - 10:00', subject: 'Science (Physics)', teacherId: 'tch-02', teacherName: 'Dr. Alok Sen', room: 'Physics Lab 1' },
  { id: 'tt-3', standard: 8, section: 'A', day: 'Monday', period: 3, time: '10:15 - 11:00', subject: 'English Literature', teacherId: 'tch-03', teacherName: 'Ms. Rebecca D\'Souza', room: 'Room 204' },
  { id: 'tt-4', standard: 8, section: 'A', day: 'Monday', period: 4, time: '11:00 - 11:45', subject: 'Social Studies', teacherId: 'tch-04', teacherName: 'Mr. Arvind Saxena', room: 'Room 204' },
  { id: 'tt-5', standard: 8, section: 'A', day: 'Monday', period: 5, time: '12:30 - 01:15', subject: 'Computer Science', teacherId: 'tch-05', teacherName: 'Ms. Neha Gupta', room: 'Computer Lab B' },
  { id: 'tt-6', standard: 8, section: 'A', day: 'Monday', period: 6, time: '01:15 - 02:00', subject: 'Physical Education', teacherId: 'tch-07', teacherName: 'Coach Vikram Rawat', room: 'Main Field' },

  // Class 8-A Timetable (Tuesday)
  { id: 'tt-7', standard: 8, section: 'A', day: 'Tuesday', period: 1, time: '08:30 - 09:15', subject: 'English Language', teacherId: 'tch-03', teacherName: 'Ms. Rebecca D\'Souza', room: 'Room 204' },
  { id: 'tt-8', standard: 8, section: 'A', day: 'Tuesday', period: 2, time: '09:15 - 10:00', subject: 'Mathematics', teacherId: 'tch-01', teacherName: 'Mrs. Shalini Verma', room: 'Room 204' },
  { id: 'tt-9', standard: 8, section: 'A', day: 'Tuesday', period: 3, time: '10:15 - 11:00', subject: 'Science (Physics)', teacherId: 'tch-02', teacherName: 'Dr. Alok Sen', room: 'Physics Lab 1' },
  { id: 'tt-10', standard: 8, section: 'A', day: 'Tuesday', period: 4, time: '11:00 - 11:45', subject: 'Hindi', teacherId: 'tch-06', teacherName: 'Mr. Pradeep Kulkarni', room: 'Room 204' },
  { id: 'tt-11', standard: 8, section: 'A', day: 'Tuesday', period: 5, time: '12:30 - 01:15', subject: 'Library Session', teacherId: 'stf-12', teacherName: 'Mr. Samuel O\'Connor', room: 'Central Library' },
  { id: 'tt-12', standard: 8, section: 'A', day: 'Tuesday', period: 6, time: '01:15 - 02:00', subject: 'Social Studies', teacherId: 'tch-04', teacherName: 'Mr. Arvind Saxena', room: 'Room 204' },

  // Class 8-A Timetable (Wednesday)
  { id: 'tt-13', standard: 8, section: 'A', day: 'Wednesday', period: 1, time: '08:30 - 09:15', subject: 'Science (Physics)', teacherId: 'tch-02', teacherName: 'Dr. Alok Sen', room: 'Physics Lab 1' },
  { id: 'tt-14', standard: 8, section: 'A', day: 'Wednesday', period: 2, time: '09:15 - 10:00', subject: 'Mathematics', teacherId: 'tch-01', teacherName: 'Mrs. Shalini Verma', room: 'Room 204' },
  { id: 'tt-15', standard: 8, section: 'A', day: 'Wednesday', period: 3, time: '10:15 - 11:00', subject: 'English Literature', teacherId: 'tch-03', teacherName: 'Ms. Rebecca D\'Souza', room: 'Room 204' },
  { id: 'tt-16', standard: 8, section: 'A', day: 'Wednesday', period: 4, time: '11:00 - 11:45', subject: 'Hindi', teacherId: 'tch-06', teacherName: 'Mr. Pradeep Kulkarni', room: 'Room 204' },
  { id: 'tt-17', standard: 8, section: 'A', day: 'Wednesday', period: 5, time: '12:30 - 01:15', subject: 'Computer Science', teacherId: 'tch-05', teacherName: 'Ms. Neha Gupta', room: 'Computer Lab B' },
  { id: 'tt-18', standard: 8, section: 'A', day: 'Wednesday', period: 6, time: '01:15 - 02:00', subject: 'Fine Arts', teacherId: 'tch-08', teacherName: 'Ms. Arundhati Roy', room: 'Art Studio' },

  // Class 8-A Timetable (Thursday)
  { id: 'tt-19', standard: 8, section: 'A', day: 'Thursday', period: 1, time: '08:30 - 09:15', subject: 'Mathematics', teacherId: 'tch-01', teacherName: 'Mrs. Shalini Verma', room: 'Room 204' },
  { id: 'tt-20', standard: 8, section: 'A', day: 'Thursday', period: 2, time: '09:15 - 10:00', subject: 'Social Studies', teacherId: 'tch-04', teacherName: 'Mr. Arvind Saxena', room: 'Room 204' },
  { id: 'tt-21', standard: 8, section: 'A', day: 'Thursday', period: 3, time: '10:15 - 11:00', subject: 'English Language', teacherId: 'tch-03', teacherName: 'Ms. Rebecca D\'Souza', room: 'Room 204' },
  { id: 'tt-22', standard: 8, section: 'A', day: 'Thursday', period: 4, time: '11:00 - 11:45', subject: 'Science (Physics)', teacherId: 'tch-02', teacherName: 'Dr. Alok Sen', room: 'Physics Lab 1' },
  { id: 'tt-23', standard: 8, section: 'A', day: 'Thursday', period: 5, time: '12:30 - 01:15', subject: 'Physical Education', teacherId: 'tch-07', teacherName: 'Coach Vikram Rawat', room: 'Main Field' },
  { id: 'tt-24', standard: 8, section: 'A', day: 'Thursday', period: 6, time: '01:15 - 02:00', subject: 'Hindi', teacherId: 'tch-06', teacherName: 'Mr. Pradeep Kulkarni', room: 'Room 204' },

  // Class 8-A Timetable (Friday)
  { id: 'tt-25', standard: 8, section: 'A', day: 'Friday', period: 1, time: '08:30 - 09:15', subject: 'Social Studies', teacherId: 'tch-04', teacherName: 'Mr. Arvind Saxena', room: 'Room 204' },
  { id: 'tt-26', standard: 8, section: 'A', day: 'Friday', period: 2, time: '09:15 - 10:00', subject: 'Mathematics', teacherId: 'tch-01', teacherName: 'Mrs. Shalini Verma', room: 'Room 204' },
  { id: 'tt-27', standard: 8, section: 'A', day: 'Friday', period: 3, time: '10:15 - 11:00', subject: 'Science (Physics)', teacherId: 'tch-02', teacherName: 'Dr. Alok Sen', room: 'Physics Lab 1' },
  { id: 'tt-28', standard: 8, section: 'A', day: 'Friday', period: 4, time: '11:00 - 11:45', subject: 'English Literature', teacherId: 'tch-03', teacherName: 'Ms. Rebecca D\'Souza', room: 'Room 204' },
  { id: 'tt-29', standard: 8, section: 'A', day: 'Friday', period: 5, time: '12:30 - 01:15', subject: 'Computer Science', teacherId: 'tch-05', teacherName: 'Ms. Neha Gupta', room: 'Computer Lab B' },
  { id: 'tt-30', standard: 8, section: 'A', day: 'Friday', period: 6, time: '01:15 - 02:00', subject: 'Co-Curricular Club', teacherId: 'stf-10', teacherName: 'Prof. Marcus Vance', room: 'Auditorium' },

  // Class 9-A Sample Slots for Conflict Engine & Schedule
  { id: 'tt-31', standard: 9, section: 'A', day: 'Tuesday', period: 3, time: '10:15 - 11:00', subject: 'Science (Physics)', teacherId: 'tch-02', teacherName: 'Dr. Alok Sen', room: 'Room 302' },
  { id: 'tt-32', standard: 10, section: 'A', day: 'Wednesday', period: 2, time: '09:15 - 10:00', subject: 'Physics Practical', teacherId: 'tch-02', teacherName: 'Dr. Alok Sen', room: 'Physics Lab 1' }
];

export const INITIAL_TIMETABLE_VERSION: TimetableVersion = {
  id: 'tv-2026-t2',
  academicYear: '2026–2027',
  term: 'Term 2',
  status: 'published',
  publishedAt: '2026-09-01 10:00',
  publishedBy: 'Dr. Evelyn Montgomery',
  conflictsCount: 0
};

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // 2026-10-16 (Friday) - Std 8-A (Morning Session)
  { id: 'att-8a-101-16', date: '2026-10-16', standard: 8, section: 'A', studentId: 'stu-101', studentName: 'Aarav Sharma', rollNo: 1, status: 'present', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:15 AM' },
  { id: 'att-8a-103-16', date: '2026-10-16', standard: 8, section: 'A', studentId: 'stu-103', studentName: 'Rohan Deshmukh', rollNo: 2, status: 'late', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:52 AM', remarks: 'Late entry authorized: Route 14 bus tire puncture' },
  { id: 'att-8a-104-16', date: '2026-10-16', standard: 8, section: 'A', studentId: 'stu-104', studentName: 'Meera Iyer', rollNo: 3, status: 'present', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:20 AM' },
  { id: 'att-8a-105-16', date: '2026-10-16', standard: 8, section: 'A', studentId: 'stu-105', studentName: 'Kabir Patel', rollNo: 4, status: 'absent', session: 'morning', markedBy: 'Mrs. Shalini Verma', remarks: 'Medical rest - verified parent note' },
  { id: 'att-8a-106-16', date: '2026-10-16', standard: 8, section: 'A', studentId: 'stu-106', studentName: 'Dia Fernandez', rollNo: 5, status: 'present', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:18 AM' },
  { id: 'att-8a-107-16', date: '2026-10-16', standard: 8, section: 'A', studentId: 'stu-107', studentName: 'Aditya Singhania', rollNo: 6, status: 'half_day', session: 'morning', markedBy: 'Mrs. Shalini Verma', departureTime: '12:30 PM', remarks: 'Early release for Inter-School Debate competition' },
  { id: 'att-8a-108-16', date: '2026-10-16', standard: 8, section: 'A', studentId: 'stu-108', studentName: 'Tanvi Nair', rollNo: 7, status: 'present', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:10 AM' },
  { id: 'att-8a-109-16', date: '2026-10-16', standard: 8, section: 'A', studentId: 'stu-109', studentName: 'Zayn Khan', rollNo: 8, status: 'present', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:22 AM' },
  { id: 'att-8a-110-16', date: '2026-10-16', standard: 8, section: 'A', studentId: 'stu-110', studentName: 'Pooja Reddy', rollNo: 9, status: 'excused', session: 'morning', markedBy: 'Mrs. Shalini Verma', remarks: 'Junior tennis tournament championship' },

  // 2026-10-15 (Thursday) - Std 8-A
  { id: 'att-8a-101-15', date: '2026-10-15', standard: 8, section: 'A', studentId: 'stu-101', studentName: 'Aarav Sharma', rollNo: 1, status: 'present', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:12 AM' },
  { id: 'att-8a-103-15', date: '2026-10-15', standard: 8, section: 'A', studentId: 'stu-103', studentName: 'Rohan Deshmukh', rollNo: 2, status: 'present', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:25 AM' },
  { id: 'att-8a-104-15', date: '2026-10-15', standard: 8, section: 'A', studentId: 'stu-104', studentName: 'Meera Iyer', rollNo: 3, status: 'present', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:15 AM' },
  { id: 'att-8a-105-15', date: '2026-10-15', standard: 8, section: 'A', studentId: 'stu-105', studentName: 'Kabir Patel', rollNo: 4, status: 'absent', session: 'morning', markedBy: 'Mrs. Shalini Verma', remarks: 'Severe viral fever' },
  { id: 'att-8a-106-15', date: '2026-10-15', standard: 8, section: 'A', studentId: 'stu-106', studentName: 'Dia Fernandez', rollNo: 5, status: 'present', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:16 AM' },
  { id: 'att-8a-107-15', date: '2026-10-15', standard: 8, section: 'A', studentId: 'stu-107', studentName: 'Aditya Singhania', rollNo: 6, status: 'present', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:18 AM' },
  { id: 'att-8a-108-15', date: '2026-10-15', standard: 8, section: 'A', studentId: 'stu-108', studentName: 'Tanvi Nair', rollNo: 7, status: 'present', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:14 AM' },

  // 2026-10-14 (Wednesday) - Std 8-A & Std 5-B
  { id: 'att-1', date: '2026-10-14', standard: 8, section: 'A', studentId: 'stu-101', studentName: 'Aarav Sharma', rollNo: 1, status: 'present', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:15 AM' },
  { id: 'att-2', date: '2026-10-14', standard: 8, section: 'A', studentId: 'stu-103', studentName: 'Rohan Deshmukh', rollNo: 2, status: 'present', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:20 AM' },
  { id: 'att-3', date: '2026-10-14', standard: 8, section: 'A', studentId: 'stu-104', studentName: 'Meera Iyer', rollNo: 3, status: 'present', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:10 AM' },
  { id: 'att-4', date: '2026-10-14', standard: 8, section: 'A', studentId: 'stu-105', studentName: 'Kabir Patel', rollNo: 4, status: 'absent', session: 'morning', remarks: 'Medical leave', markedBy: 'Mrs. Shalini Verma' },
  { id: 'att-5', date: '2026-10-14', standard: 5, section: 'B', studentId: 'stu-102', studentName: 'Ananya Sharma', rollNo: 4, status: 'present', session: 'morning', markedBy: 'Mr. Arvind Saxena', arrivalTime: '08:20 AM' },

  // 2026-10-13 (Tuesday)
  { id: 'att-6', date: '2026-10-13', standard: 8, section: 'A', studentId: 'stu-101', studentName: 'Aarav Sharma', rollNo: 1, status: 'present', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:14 AM' },
  { id: 'att-7', date: '2026-10-13', standard: 8, section: 'A', studentId: 'stu-103', studentName: 'Rohan Deshmukh', rollNo: 2, status: 'late', session: 'morning', remarks: 'Bus delayed', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:48 AM' },
  { id: 'att-8', date: '2026-10-13', standard: 5, section: 'B', studentId: 'stu-102', studentName: 'Ananya Sharma', rollNo: 4, status: 'present', session: 'morning', markedBy: 'Mr. Arvind Saxena', arrivalTime: '08:25 AM' },

  // 2026-10-12 (Monday)
  { id: 'att-9', date: '2026-10-12', standard: 8, section: 'A', studentId: 'stu-101', studentName: 'Aarav Sharma', rollNo: 1, status: 'late', session: 'morning', markedBy: 'Mrs. Shalini Verma', arrivalTime: '08:50 AM', remarks: 'Route 4 flyover traffic' },
  { id: 'att-10', date: '2026-10-12', standard: 5, section: 'B', studentId: 'stu-102', studentName: 'Ananya Sharma', rollNo: 4, status: 'present', session: 'morning', markedBy: 'Mr. Arvind Saxena', arrivalTime: '08:18 AM' },
  { id: 'att-11', date: '2026-10-12', standard: 8, section: 'A', studentId: 'stu-105', studentName: 'Kabir Patel', rollNo: 4, status: 'absent', session: 'morning', markedBy: 'Mrs. Shalini Verma', remarks: 'High fever' }
];

export const INITIAL_MARKS: MarkRecord[] = [
  { id: 'mrk-01', studentId: 'stu-101', studentName: 'Aarav Sharma', standard: 8, section: 'A', examName: 'Mid-Term Exam', subject: 'Mathematics', marksObtained: 94, maxMarks: 100, grade: 'A1', status: 'published', remarks: 'Exceptional in Algebra', teacherId: 'tch-01' },
  { id: 'mrk-02', studentId: 'stu-101', studentName: 'Aarav Sharma', standard: 8, section: 'A', examName: 'Mid-Term Exam', subject: 'Science', marksObtained: 91, maxMarks: 100, grade: 'A1', status: 'published', remarks: 'Very thorough lab report', teacherId: 'tch-02' },
  { id: 'mrk-03', studentId: 'stu-101', studentName: 'Aarav Sharma', standard: 8, section: 'A', examName: 'Mid-Term Exam', subject: 'English', marksObtained: 88, maxMarks: 100, grade: 'A2', status: 'published', remarks: 'Strong creative writing', teacherId: 'tch-03' },
  { id: 'mrk-04', studentId: 'stu-101', studentName: 'Aarav Sharma', standard: 8, section: 'A', examName: 'Mid-Term Exam', subject: 'Social Studies', marksObtained: 86, maxMarks: 100, grade: 'A2', status: 'published', remarks: 'Good map work', teacherId: 'tch-04' },
  { id: 'mrk-05', studentId: 'stu-101', studentName: 'Aarav Sharma', standard: 8, section: 'A', examName: 'Mid-Term Exam', subject: 'Computer Science', marksObtained: 98, maxMarks: 100, grade: 'A1', status: 'published', remarks: 'Outstanding Python project', teacherId: 'tch-05' },

  { id: 'mrk-06', studentId: 'stu-102', studentName: 'Ananya Sharma', standard: 5, section: 'B', examName: 'Mid-Term Exam', subject: 'Mathematics', marksObtained: 92, maxMarks: 100, grade: 'A1', status: 'published', remarks: 'Excellent mental math', teacherId: 'tch-01' },
  { id: 'mrk-07', studentId: 'stu-102', studentName: 'Ananya Sharma', standard: 5, section: 'B', examName: 'Mid-Term Exam', subject: 'Environmental Studies', marksObtained: 95, maxMarks: 100, grade: 'A1', status: 'published', remarks: 'Active participation', teacherId: 'tch-02' },
  { id: 'mrk-08', studentId: 'stu-102', studentName: 'Ananya Sharma', standard: 5, section: 'B', examName: 'Mid-Term Exam', subject: 'English', marksObtained: 90, maxMarks: 100, grade: 'A1', status: 'published', remarks: 'Great phonetic expression', teacherId: 'tch-03' },

  { id: 'mrk-09', studentId: 'stu-103', studentName: 'Rohan Deshmukh', standard: 8, section: 'A', examName: 'Mid-Term Exam', subject: 'Mathematics', marksObtained: 82, maxMarks: 100, grade: 'B1', status: 'endorsed', teacherId: 'tch-01' },
  { id: 'mrk-10', studentId: 'stu-104', studentName: 'Meera Iyer', standard: 8, section: 'A', examName: 'Mid-Term Exam', subject: 'Mathematics', marksObtained: 96, maxMarks: 100, grade: 'A1', status: 'endorsed', teacherId: 'tch-01' },
  { id: 'mrk-11', studentId: 'stu-105', studentName: 'Kabir Patel', standard: 8, section: 'A', examName: 'Mid-Term Exam', subject: 'Mathematics', marksObtained: 68, maxMarks: 100, grade: 'C1', status: 'submitted', remarks: 'Needs extra geometry sessions', teacherId: 'tch-01' }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    title: 'Linear Equations in One Variable — Problem Set 4',
    standard: 8,
    section: 'A',
    subject: 'Mathematics',
    assignedDate: '2026-10-10',
    dueDate: '2026-10-18',
    description: 'Solve questions 1 through 20 from Chapter 4 textbook exercises on page 62.',
    submissionCount: 28,
    totalStudents: 32,
    teacherName: 'Mrs. Shalini Verma',
    status: 'published'
  },
  {
    id: 'asg-02',
    title: 'Cell Structure and Microorganisms Diagram Chart',
    standard: 8,
    section: 'A',
    subject: 'Science',
    assignedDate: '2026-10-11',
    dueDate: '2026-10-19',
    description: 'Neatly labeled diagram of plant and animal cell with comparison notes.',
    submissionCount: 22,
    totalStudents: 32,
    teacherName: 'Dr. Alok Sen',
    status: 'published'
  },
  {
    id: 'asg-03',
    title: 'Essay: The Impact of Industrialization on Cities',
    standard: 8,
    section: 'A',
    subject: 'Social Studies',
    assignedDate: '2026-10-08',
    dueDate: '2026-10-16',
    description: '300-word reflective essay examining urban transformation during 19th century.',
    submissionCount: 30,
    totalStudents: 32,
    teacherName: 'Mr. Arvind Saxena',
    status: 'published'
  },
  {
    id: 'asg-04',
    title: 'Fractions and Decimals Multiplication Sheet',
    standard: 5,
    section: 'B',
    subject: 'Mathematics',
    assignedDate: '2026-10-12',
    dueDate: '2026-10-18',
    description: 'Complete the printed worksheet with step-by-step working.',
    submissionCount: 24,
    totalStudents: 28,
    teacherName: 'Mrs. Shalini Verma',
    status: 'published'
  }
];

export const INITIAL_FEES: FeeInvoice[] = [
  {
    id: 'inv-01',
    invoiceNo: 'INV-2026-0841',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    standard: 8,
    section: 'A',
    feeType: 'Tuition Fee',
    amount: 28500,
    paidAmount: 28500,
    remainingBalance: 0,
    dueDate: '2026-10-05',
    status: 'paid',
    paidDate: '2026-10-03',
    paymentMethod: 'UPI',
    receiptNo: 'RCP-88310',
    referenceNo: 'UPI-REF-992144',
    academicYear: '2026-2027',
    term: 'Term 2',
    concessionApplied: 4275,
    concessionType: 'Merit Scholarship (15%)',
    receiptNumbers: ['RCP-88310'],
    installments: [
      {
        id: 'pay-01',
        invoiceId: 'inv-01',
        receiptNo: 'RCP-88310',
        studentId: 'stu-101',
        studentName: 'Aarav Sharma',
        amountPaid: 28500,
        paymentMethod: 'UPI',
        transactionRef: 'UPI-REF-992144',
        paymentDate: '2026-10-03',
        collectedBy: 'Mr. David Reynolds',
        notes: 'Full Term 2 tuition fee settled online via UPI'
      }
    ]
  },
  {
    id: 'inv-02',
    invoiceNo: 'INV-2026-0842',
    studentId: 'stu-102',
    studentName: 'Ananya Sharma',
    standard: 5,
    section: 'B',
    feeType: 'Tuition Fee',
    amount: 22000,
    paidAmount: 11000,
    remainingBalance: 11000,
    dueDate: '2026-10-25',
    status: 'partial',
    paidDate: '2026-10-12',
    paymentMethod: 'NetBanking',
    receiptNo: 'RCP-88313',
    referenceNo: 'HDFC-IMPS-8872',
    academicYear: '2026-2027',
    term: 'Term 2',
    receiptNumbers: ['RCP-88313'],
    installments: [
      {
        id: 'pay-02',
        invoiceId: 'inv-02',
        receiptNo: 'RCP-88313',
        studentId: 'stu-102',
        studentName: 'Ananya Sharma',
        amountPaid: 11000,
        paymentMethod: 'NetBanking',
        transactionRef: 'HDFC-IMPS-8872',
        paymentDate: '2026-10-12',
        collectedBy: 'Mr. David Reynolds',
        notes: 'Installment 1 of 2 settled. Second installment due Oct 25.'
      }
    ]
  },
  {
    id: 'inv-03',
    invoiceNo: 'INV-2026-0843',
    studentId: 'stu-105',
    studentName: 'Kabir Patel',
    standard: 8,
    section: 'A',
    feeType: 'Tuition Fee',
    amount: 28500,
    paidAmount: 0,
    remainingBalance: 28500,
    dueDate: '2026-09-30',
    status: 'overdue',
    academicYear: '2026-2027',
    term: 'Term 2',
    concessionApplied: 8550,
    concessionType: 'EWS / Need-Based Waiver (30%)'
  },
  {
    id: 'inv-04',
    invoiceNo: 'INV-2026-0844',
    studentId: 'stu-104',
    studentName: 'Meera Iyer',
    standard: 8,
    section: 'A',
    feeType: 'Lab & Library',
    amount: 6500,
    paidAmount: 6500,
    remainingBalance: 0,
    dueDate: '2026-10-10',
    status: 'paid',
    paidDate: '2026-10-08',
    paymentMethod: 'NetBanking',
    receiptNo: 'RCP-88311',
    referenceNo: 'HDFC-TXN-44210',
    academicYear: '2026-2027',
    term: 'Term 2',
    receiptNumbers: ['RCP-88311'],
    installments: [
      {
        id: 'pay-03',
        invoiceId: 'inv-04',
        receiptNo: 'RCP-88311',
        studentId: 'stu-104',
        studentName: 'Meera Iyer',
        amountPaid: 6500,
        paymentMethod: 'NetBanking',
        transactionRef: 'HDFC-TXN-44210',
        paymentDate: '2026-10-08',
        collectedBy: 'Mr. David Reynolds',
        notes: 'Annual Computer and Science Lab fee'
      }
    ]
  },
  {
    id: 'inv-05',
    invoiceNo: 'INV-2026-0845',
    studentId: 'stu-107',
    studentName: 'Aditya Singhania',
    standard: 10,
    section: 'A',
    feeType: 'Tuition Fee',
    amount: 32000,
    paidAmount: 32000,
    remainingBalance: 0,
    dueDate: '2026-10-05',
    status: 'paid',
    paidDate: '2026-10-04',
    paymentMethod: 'Card',
    receiptNo: 'RCP-88312',
    referenceNo: 'CARD-APPR-9921',
    academicYear: '2026-2027',
    term: 'Term 2',
    receiptNumbers: ['RCP-88312'],
    installments: [
      {
        id: 'pay-04',
        invoiceId: 'inv-05',
        receiptNo: 'RCP-88312',
        studentId: 'stu-107',
        studentName: 'Aditya Singhania',
        amountPaid: 32000,
        paymentMethod: 'Card',
        transactionRef: 'CARD-APPR-9921',
        paymentDate: '2026-10-04',
        collectedBy: 'Mr. David Reynolds',
        notes: 'POS swipe at Accounts Counter'
      }
    ]
  },
  {
    id: 'inv-06',
    invoiceNo: 'INV-2026-0846',
    studentId: 'stu-103',
    studentName: 'Rohan Deshmukh',
    standard: 8,
    section: 'A',
    feeType: 'Transport',
    amount: 9500,
    paidAmount: 0,
    remainingBalance: 9500,
    dueDate: '2026-10-28',
    status: 'pending',
    academicYear: '2026-2027',
    term: 'Term 2'
  },
  {
    id: 'inv-07',
    invoiceNo: 'INV-2026-0847',
    studentId: 'stu-106',
    studentName: 'Dia Fernandez',
    standard: 8,
    section: 'A',
    feeType: 'Tuition Fee',
    amount: 28500,
    paidAmount: 28500,
    remainingBalance: 0,
    dueDate: '2026-10-05',
    status: 'paid',
    paidDate: '2026-10-01',
    paymentMethod: 'UPI',
    receiptNo: 'RCP-88314',
    referenceNo: 'GPAY-AXIS-2041',
    academicYear: '2026-2027',
    term: 'Term 2',
    receiptNumbers: ['RCP-88314']
  },
  {
    id: 'inv-08',
    invoiceNo: 'INV-2026-0848',
    studentId: 'stu-108',
    studentName: 'Ishaan Verma',
    standard: 9,
    section: 'B',
    feeType: 'Tuition Fee',
    amount: 28500,
    paidAmount: 14250,
    remainingBalance: 14250,
    dueDate: '2026-10-15',
    status: 'partial',
    paidDate: '2026-10-10',
    paymentMethod: 'Cheque',
    receiptNo: 'RCP-88315',
    referenceNo: 'CHQ-890421',
    academicYear: '2026-2027',
    term: 'Term 2',
    receiptNumbers: ['RCP-88315'],
    installments: [
      {
        id: 'pay-05',
        invoiceId: 'inv-08',
        receiptNo: 'RCP-88315',
        studentId: 'stu-108',
        studentName: 'Ishaan Verma',
        amountPaid: 14250,
        paymentMethod: 'Cheque',
        chequeNo: 'CHQ-890421',
        paymentDate: '2026-10-10',
        collectedBy: 'Mr. David Reynolds',
        notes: 'Cheque cleared on Oct 12, ICICI Bank'
      }
    ]
  }
];

export const INITIAL_FEE_STRUCTURES: FeeStructureItem[] = [
  {
    id: 'fs-01',
    tierName: 'Primary Wing Structure (Standards 1 – 3)',
    wingName: 'Primary Wing',
    applicableStandards: [1, 2, 3],
    academicYear: '2026-2027',
    totalAnnualAmount: 48000,
    dueDateTerm1: '2026-04-15',
    dueDateTerm2: '2026-10-15',
    status: 'active',
    components: [
      { id: 'c-1', name: 'Tuition Fee', term: 'Term 2', amount: 18000, mandatory: true },
      { id: 'c-2', name: 'Laboratory & Computer', term: 'Term 2', amount: 2500, mandatory: true },
      { id: 'c-3', name: 'School Transport', term: 'Term 2', amount: 8000, mandatory: false },
      { id: 'c-4', name: 'Sports & Co-Curricular', term: 'Annual', amount: 3500, mandatory: true },
      { id: 'c-5', name: 'Annual Development', term: 'Annual', amount: 4000, mandatory: true },
      { id: 'c-6', name: 'Library & Learning', term: 'Annual', amount: 2000, mandatory: true }
    ]
  },
  {
    id: 'fs-02',
    tierName: 'Junior Wing Structure (Standards 4 – 5)',
    wingName: 'Junior Wing',
    applicableStandards: [4, 5],
    academicYear: '2026-2027',
    totalAnnualAmount: 56000,
    dueDateTerm1: '2026-04-15',
    dueDateTerm2: '2026-10-15',
    status: 'active',
    components: [
      { id: 'c-11', name: 'Tuition Fee', term: 'Term 2', amount: 22000, mandatory: true },
      { id: 'c-12', name: 'Laboratory & Computer', term: 'Term 2', amount: 3500, mandatory: true },
      { id: 'c-13', name: 'School Transport', term: 'Term 2', amount: 8500, mandatory: false },
      { id: 'c-14', name: 'Sports & Co-Curricular', term: 'Annual', amount: 4000, mandatory: true },
      { id: 'c-15', name: 'Annual Development', term: 'Annual', amount: 5000, mandatory: true },
      { id: 'c-16', name: 'Library & Learning', term: 'Annual', amount: 2500, mandatory: true }
    ]
  },
  {
    id: 'fs-03',
    tierName: 'Middle Wing Structure (Standards 6 – 7)',
    wingName: 'Middle Wing',
    applicableStandards: [6, 7],
    academicYear: '2026-2027',
    totalAnnualAmount: 64000,
    dueDateTerm1: '2026-04-15',
    dueDateTerm2: '2026-10-15',
    status: 'active',
    components: [
      { id: 'c-21', name: 'Tuition Fee', term: 'Term 2', amount: 25000, mandatory: true },
      { id: 'c-22', name: 'Laboratory & Computer', term: 'Term 2', amount: 4500, mandatory: true },
      { id: 'c-23', name: 'School Transport', term: 'Term 2', amount: 9000, mandatory: false },
      { id: 'c-24', name: 'Sports & Co-Curricular', term: 'Annual', amount: 4500, mandatory: true },
      { id: 'c-25', name: 'Annual Development', term: 'Annual', amount: 6000, mandatory: true },
      { id: 'c-26', name: 'Examination Fee', term: 'Term 2', amount: 2000, mandatory: true }
    ]
  },
  {
    id: 'fs-04',
    tierName: 'Secondary Wing Structure (Standards 8 – 9)',
    wingName: 'Secondary Wing',
    applicableStandards: [8, 9],
    academicYear: '2026-2027',
    totalAnnualAmount: 74500,
    dueDateTerm1: '2026-04-15',
    dueDateTerm2: '2026-10-15',
    status: 'active',
    components: [
      { id: 'c-31', name: 'Tuition Fee', term: 'Term 2', amount: 28500, mandatory: true },
      { id: 'c-32', name: 'Laboratory & Computer', term: 'Term 2', amount: 6500, mandatory: true },
      { id: 'c-33', name: 'School Transport', term: 'Term 2', amount: 9500, mandatory: false },
      { id: 'c-34', name: 'Sports & Co-Curricular', term: 'Annual', amount: 5000, mandatory: true },
      { id: 'c-35', name: 'Annual Development', term: 'Annual', amount: 7000, mandatory: true },
      { id: 'c-36', name: 'Examination Fee', term: 'Term 2', amount: 2500, mandatory: true }
    ]
  },
  {
    id: 'fs-05',
    tierName: 'Senior Secondary Wing Structure (Standard 10)',
    wingName: 'Senior Secondary Wing',
    applicableStandards: [10],
    academicYear: '2026-2027',
    totalAnnualAmount: 84000,
    dueDateTerm1: '2026-04-15',
    dueDateTerm2: '2026-10-15',
    status: 'active',
    components: [
      { id: 'c-41', name: 'Tuition Fee', term: 'Term 2', amount: 32000, mandatory: true },
      { id: 'c-42', name: 'Laboratory & Computer', term: 'Term 2', amount: 8000, mandatory: true },
      { id: 'c-43', name: 'School Transport', term: 'Term 2', amount: 10000, mandatory: false },
      { id: 'c-44', name: 'Sports & Co-Curricular', term: 'Annual', amount: 6000, mandatory: true },
      { id: 'c-45', name: 'Annual Development', term: 'Annual', amount: 8000, mandatory: true },
      { id: 'c-46', name: 'Examination Fee', term: 'Term 2', amount: 3500, mandatory: true }
    ]
  }
];

export const INITIAL_FEE_CONCESSIONS: FeeConcession[] = [
  {
    id: 'con-01',
    concessionNo: 'CON-2026-0041',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    standard: 8,
    section: 'A',
    concessionType: 'Merit Scholarship',
    discountType: 'percentage',
    discountValue: 15,
    appliedComponent: 'Tuition Fee',
    calculatedDeduction: 4275,
    validAcademicYear: '2026-2027',
    status: 'active',
    approvedBy: 'Dr. Evelyn Montgomery (Principal)',
    approvedDate: '2026-04-20',
    reason: 'Academic Excellence: Ranked 1st in Standard 7 Final Board Assessment with 94.8% aggregate.'
  },
  {
    id: 'con-02',
    concessionNo: 'CON-2026-0042',
    studentId: 'stu-102',
    studentName: 'Ananya Sharma',
    standard: 5,
    section: 'B',
    concessionType: 'Sibling Discount',
    discountType: 'percentage',
    discountValue: 10,
    appliedComponent: 'Tuition Fee',
    calculatedDeduction: 2200,
    validAcademicYear: '2026-2027',
    status: 'active',
    approvedBy: 'Mr. David Reynolds (Bursar)',
    approvedDate: '2026-04-18',
    reason: 'Sibling policy: Younger sibling of Aarav Sharma (Std 8-A, GIS-2023-0101).'
  },
  {
    id: 'con-03',
    concessionNo: 'CON-2026-0043',
    studentId: 'stu-105',
    studentName: 'Kabir Patel',
    standard: 8,
    section: 'A',
    concessionType: 'EWS / Need-Based Waiver',
    discountType: 'percentage',
    discountValue: 30,
    appliedComponent: 'Tuition Fee',
    calculatedDeduction: 8550,
    validAcademicYear: '2026-2027',
    status: 'active',
    approvedBy: 'Dr. Evelyn Montgomery (Principal)',
    approvedDate: '2026-05-02',
    reason: 'State EWS certificate verified; special school trust assistance approved.'
  }
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-01',
    voucherNo: 'VCH-2026-0811',
    category: 'Faculty & Staff Salaries',
    vendorName: 'Greenfield Faculty & Staff Payroll Account',
    description: 'Faculty, Administrative & Support Staff Remuneration for September 2026',
    amount: 1850000,
    expenseDate: '2026-10-01',
    paymentMethod: 'NetBanking',
    chequeOrRefNo: 'NEFT-AXIS-992140',
    invoiceBillNo: 'GIS-PAYROLL-SEP-26',
    status: 'approved',
    recordedBy: 'Mr. David Reynolds (Accountant)',
    approvedBy: 'Dr. Evelyn Montgomery (Principal)',
    approvedDate: '2026-10-01',
    fiscalQuarter: 'Q3',
    notes: 'Direct credit to 68 faculty and 22 non-teaching staff accounts.'
  },
  {
    id: 'exp-02',
    voucherNo: 'VCH-2026-0812',
    category: 'Science & Computer Labs',
    vendorName: 'Apex Scientific Instruments Pvt Ltd',
    description: 'Compound optical microscopes, glass test apparatus, and chemical reagents for Secondary Lab',
    amount: 48500,
    expenseDate: '2026-10-04',
    paymentMethod: 'NetBanking',
    chequeOrRefNo: 'HDFC-TXN-884102',
    invoiceBillNo: 'APX-2026-4412',
    status: 'approved',
    recordedBy: 'Mr. David Reynolds (Accountant)',
    approvedBy: 'Dr. Evelyn Montgomery (Principal)',
    approvedDate: '2026-10-05',
    fiscalQuarter: 'Q3',
    notes: 'Delivered and verified by Science Department HOD Mrs. Verma.'
  },
  {
    id: 'exp-03',
    voucherNo: 'VCH-2026-0813',
    category: 'Campus Infrastructure & Utilities',
    vendorName: 'State Electricity Distribution Co & Solar Grid',
    description: 'Campus power consumption, 50kW solar maintenance charge, and municipal water tariff',
    amount: 62000,
    expenseDate: '2026-10-06',
    paymentMethod: 'NetBanking',
    chequeOrRefNo: 'NEFT-EB-773199',
    invoiceBillNo: 'MSEDCL-OCT-26-88',
    status: 'approved',
    recordedBy: 'Mr. David Reynolds (Accountant)',
    approvedBy: 'Dr. Evelyn Montgomery (Principal)',
    approvedDate: '2026-10-07',
    fiscalQuarter: 'Q3'
  },
  {
    id: 'exp-04',
    voucherNo: 'VCH-2026-0814',
    category: 'Library & Learning Resources',
    vendorName: 'National Book Depot & NCERT Distributors',
    description: 'CBSE Reference question banks, science encyclopedia set, and student journals',
    amount: 34200,
    expenseDate: '2026-10-08',
    paymentMethod: 'Cheque',
    chequeOrRefNo: 'CHQ-882103',
    invoiceBillNo: 'NBD-INV-9901',
    status: 'approved',
    recordedBy: 'Mr. David Reynolds (Accountant)',
    approvedBy: 'Dr. Evelyn Montgomery (Principal)',
    approvedDate: '2026-10-09',
    fiscalQuarter: 'Q3',
    notes: 'Books accessioned by Librarian Mrs. Anita Desai.'
  },
  {
    id: 'exp-05',
    voucherNo: 'VCH-2026-0815',
    category: 'Sports & Co-Curricular',
    vendorName: 'Cosco Sports & Athletic Goods Hub',
    description: 'Inter-school district basketball tournament jerseys, footballs, and championship trophies',
    amount: 28000,
    expenseDate: '2026-10-10',
    paymentMethod: 'UPI',
    chequeOrRefNo: 'UPI-SPORTS-7741',
    invoiceBillNo: 'COS-8842',
    status: 'approved',
    recordedBy: 'Mr. David Reynolds (Accountant)',
    approvedBy: 'Dr. Evelyn Montgomery (Principal)',
    approvedDate: '2026-10-11',
    fiscalQuarter: 'Q3'
  },
  {
    id: 'exp-06',
    voucherNo: 'VCH-2026-0816',
    category: 'School Transport & Fleet',
    vendorName: 'Indian Oil Fleet Card & GPS Mobility Solutions',
    description: 'High-speed diesel for 8 school buses, AIS-140 GPS sensor calibration, and speed governor certification',
    amount: 85000,
    expenseDate: '2026-10-12',
    paymentMethod: 'NetBanking',
    chequeOrRefNo: 'HDFC-IOC-44102',
    invoiceBillNo: 'IOC-FLEET-26-10',
    status: 'approved',
    recordedBy: 'Mr. David Reynolds (Accountant)',
    approvedBy: 'Dr. Evelyn Montgomery (Principal)',
    approvedDate: '2026-10-13',
    fiscalQuarter: 'Q3'
  },
  {
    id: 'exp-07',
    voucherNo: 'VCH-2026-0817',
    category: 'Repairs & Facility Maintenance',
    vendorName: 'CoolBreeze HVAC & Air Filtration Services',
    description: 'Semi-annual central chiller servicing, auditorium air-conditioning duct cleaning, and fire extinguisher re-filling',
    amount: 38000,
    expenseDate: '2026-10-14',
    paymentMethod: 'Cheque',
    chequeOrRefNo: 'CHQ-882104',
    invoiceBillNo: 'CBZ-SER-4418',
    status: 'approved',
    recordedBy: 'Mr. David Reynolds (Accountant)',
    approvedBy: 'Dr. Evelyn Montgomery (Principal)',
    approvedDate: '2026-10-14',
    fiscalQuarter: 'Q3'
  },
  {
    id: 'exp-08',
    voucherNo: 'VCH-2026-0818',
    category: 'Science & Computer Labs',
    vendorName: 'Dell Precision Systems & Networking',
    description: 'Replacement Gigabit network switches and UPS battery array for Computer Lab 2',
    amount: 42500,
    expenseDate: '2026-10-16',
    paymentMethod: 'NetBanking',
    chequeOrRefNo: 'PENDING-APPROVAL',
    invoiceBillNo: 'DELL-CORP-99120',
    status: 'pending_approval',
    recordedBy: 'Mr. David Reynolds (Accountant)',
    fiscalQuarter: 'Q3',
    notes: 'Requisition submitted by IT Coordinator Mr. Anand Joshi. Awaiting Principal endorsement.'
  }
];

export const INITIAL_BUDGETS: BudgetCategory[] = [
  {
    id: 'bgt-01',
    categoryName: 'Faculty & Staff Salaries',
    academicYear: '2026-2027',
    allocatedAmount: 22000000,
    spentAmount: 11100000,
    committedAmount: 1850000,
    alertThresholdPct: 90,
    departmentHead: 'Dr. Evelyn Montgomery',
    fiscalQuarter: 'Full Year'
  },
  {
    id: 'bgt-02',
    categoryName: 'Campus Infrastructure & Utilities',
    academicYear: '2026-2027',
    allocatedAmount: 1500000,
    spentAmount: 780000,
    committedAmount: 62000,
    alertThresholdPct: 85,
    departmentHead: 'Mr. David Reynolds',
    fiscalQuarter: 'Full Year'
  },
  {
    id: 'bgt-03',
    categoryName: 'Science & Computer Labs',
    academicYear: '2026-2027',
    allocatedAmount: 1200000,
    spentAmount: 685000,
    committedAmount: 42500,
    alertThresholdPct: 80,
    departmentHead: 'Mrs. Shalini Verma',
    fiscalQuarter: 'Full Year'
  },
  {
    id: 'bgt-04',
    categoryName: 'Library & Learning Resources',
    academicYear: '2026-2027',
    allocatedAmount: 600000,
    spentAmount: 294000,
    committedAmount: 35000,
    alertThresholdPct: 85,
    departmentHead: 'Mrs. Anita Desai',
    fiscalQuarter: 'Full Year'
  },
  {
    id: 'bgt-05',
    categoryName: 'Sports & Co-Curricular',
    academicYear: '2026-2027',
    allocatedAmount: 800000,
    spentAmount: 420000,
    committedAmount: 28000,
    alertThresholdPct: 80,
    departmentHead: 'Mr. Rakesh Rana',
    fiscalQuarter: 'Full Year'
  },
  {
    id: 'bgt-06',
    categoryName: 'School Transport & Fleet',
    academicYear: '2026-2027',
    allocatedAmount: 1800000,
    spentAmount: 960000,
    committedAmount: 85000,
    alertThresholdPct: 85,
    departmentHead: 'Mr. S. K. Nair',
    fiscalQuarter: 'Full Year'
  },
  {
    id: 'bgt-07',
    categoryName: 'Repairs & Facility Maintenance',
    academicYear: '2026-2027',
    allocatedAmount: 900000,
    spentAmount: 490000,
    committedAmount: 38000,
    alertThresholdPct: 85,
    departmentHead: 'Mr. David Reynolds',
    fiscalQuarter: 'Full Year'
  },
  {
    id: 'bgt-08',
    categoryName: 'Administration & Compliance',
    academicYear: '2026-2027',
    allocatedAmount: 700000,
    spentAmount: 340000,
    committedAmount: 25000,
    alertThresholdPct: 85,
    departmentHead: 'Mr. David Reynolds',
    fiscalQuarter: 'Full Year'
  }
];

export const INITIAL_DAYBOOK_ENTRIES: FinancialDaybookEntry[] = [
  {
    id: 'db-01',
    timestamp: '2026-10-01 10:30 AM',
    date: '2026-10-01',
    type: 'EXPENSE',
    category: 'Faculty & Staff Salaries',
    referenceNo: 'VCH-2026-0811',
    partyName: 'Greenfield Staff Payroll (NEFT)',
    paymentMethod: 'NetBanking',
    debitAmount: 1850000,
    creditAmount: 0,
    runningBalance: 3240000,
    recordedBy: 'Mr. David Reynolds',
    narration: 'Disbursement of faculty & staff remuneration for September 2026'
  },
  {
    id: 'db-02',
    timestamp: '2026-10-01 02:15 PM',
    date: '2026-10-01',
    type: 'INCOME',
    category: 'Tuition Fee Collection',
    referenceNo: 'RCP-88314',
    partyName: 'Dia Fernandez (Std 8-A)',
    paymentMethod: 'UPI',
    debitAmount: 0,
    creditAmount: 28500,
    runningBalance: 3268500,
    recordedBy: 'Mr. David Reynolds',
    narration: 'Term 2 tuition fee collected via UPI'
  },
  {
    id: 'db-03',
    timestamp: '2026-10-03 11:20 AM',
    date: '2026-10-03',
    type: 'INCOME',
    category: 'Tuition Fee Collection',
    referenceNo: 'RCP-88310',
    partyName: 'Aarav Sharma (Std 8-A)',
    paymentMethod: 'UPI',
    debitAmount: 0,
    creditAmount: 28500,
    runningBalance: 3297000,
    recordedBy: 'Mr. David Reynolds',
    narration: 'Term 2 tuition fee collected via UPI (Merit Scholarship accounted)'
  },
  {
    id: 'db-04',
    timestamp: '2026-10-04 03:45 PM',
    date: '2026-10-04',
    type: 'INCOME',
    category: 'Tuition Fee Collection',
    referenceNo: 'RCP-88312',
    partyName: 'Aditya Singhania (Std 10-A)',
    paymentMethod: 'Card',
    debitAmount: 0,
    creditAmount: 32000,
    runningBalance: 3329000,
    recordedBy: 'Mr. David Reynolds',
    narration: 'Senior Secondary Term 2 tuition fee paid at POS counter'
  },
  {
    id: 'db-05',
    timestamp: '2026-10-04 04:30 PM',
    date: '2026-10-04',
    type: 'EXPENSE',
    category: 'Science & Computer Labs',
    referenceNo: 'VCH-2026-0812',
    partyName: 'Apex Scientific Instruments Pvt Ltd',
    paymentMethod: 'NetBanking',
    debitAmount: 48500,
    creditAmount: 0,
    runningBalance: 3280500,
    recordedBy: 'Mr. David Reynolds',
    narration: 'Optical microscopes and lab glassware payment'
  },
  {
    id: 'db-06',
    timestamp: '2026-10-06 01:10 PM',
    date: '2026-10-06',
    type: 'EXPENSE',
    category: 'Campus Infrastructure & Utilities',
    referenceNo: 'VCH-2026-0813',
    partyName: 'State Electricity Distribution Co & Solar Grid',
    paymentMethod: 'NetBanking',
    debitAmount: 62000,
    creditAmount: 0,
    runningBalance: 3218500,
    recordedBy: 'Mr. David Reynolds',
    narration: 'Campus HT electricity and solar maintenance settlement'
  },
  {
    id: 'db-07',
    timestamp: '2026-10-08 10:15 AM',
    date: '2026-10-08',
    type: 'INCOME',
    category: 'Lab & Library Fee Collection',
    referenceNo: 'RCP-88311',
    partyName: 'Meera Iyer (Std 8-A)',
    paymentMethod: 'NetBanking',
    debitAmount: 0,
    creditAmount: 6500,
    runningBalance: 3225000,
    recordedBy: 'Mr. David Reynolds',
    narration: 'Lab & Library annual fee settled via NetBanking'
  },
  {
    id: 'db-08',
    timestamp: '2026-10-10 11:30 AM',
    date: '2026-10-10',
    type: 'INCOME',
    category: 'Tuition Fee Collection',
    referenceNo: 'RCP-88315',
    partyName: 'Ishaan Verma (Std 9-B)',
    paymentMethod: 'Cheque',
    debitAmount: 0,
    creditAmount: 14250,
    runningBalance: 3239250,
    recordedBy: 'Mr. David Reynolds',
    narration: 'Partial installment (50%) settled via Cheque No. CHQ-890421'
  },
  {
    id: 'db-09',
    timestamp: '2026-10-12 04:00 PM',
    date: '2026-10-12',
    type: 'INCOME',
    category: 'Tuition Fee Collection',
    referenceNo: 'RCP-88313',
    partyName: 'Ananya Sharma (Std 5-B)',
    paymentMethod: 'NetBanking',
    debitAmount: 0,
    creditAmount: 11000,
    runningBalance: 3250250,
    recordedBy: 'Mr. David Reynolds',
    narration: 'First installment of Term 2 tuition settled via IMPS'
  },
  {
    id: 'db-10',
    timestamp: '2026-10-12 05:15 PM',
    date: '2026-10-12',
    type: 'EXPENSE',
    category: 'School Transport & Fleet',
    referenceNo: 'VCH-2026-0816',
    partyName: 'Indian Oil Fleet Card & GPS Mobility Solutions',
    paymentMethod: 'NetBanking',
    debitAmount: 85000,
    creditAmount: 0,
    runningBalance: 3165250,
    recordedBy: 'Mr. David Reynolds',
    narration: 'Fleet diesel and AIS-140 GPS tracking maintenance'
  }
];

export const INITIAL_VISITORS: VisitorEntry[] = [
  {
    id: 'vis-01',
    passNo: 'VP-2026-102',
    name: 'Mr. Rajesh Mehra',
    phone: '+91 98221 88990',
    category: 'Prospective Parent',
    organization: 'Fintech Solutions Ltd',
    email: 'rajesh.mehra@fintech.in',
    purpose: 'Enquiry for Standard 6 Admission & Campus Tour',
    meetingWith: 'Front Office / Admissions',
    department: 'Admissions Office',
    visitorsCount: 2,
    vehicleNo: 'DL-04-AB-3921',
    date: '2026-10-14',
    checkIn: '09:45 AM',
    idProof: 'Aadhaar Card (9921)',
    notes: 'Father of candidate Rohan Mehra. Touring science labs and sports complex.',
    status: 'inside'
  },
  {
    id: 'vis-02',
    passNo: 'VP-2026-101',
    name: 'Mrs. Sunita Roy',
    phone: '+91 98440 22331',
    category: 'Parent / Guardian',
    email: 'sunita.roy@gmail.com',
    purpose: 'Parent-Teacher Interaction regarding Term Marks',
    meetingWith: 'Mrs. Shalini Verma',
    department: 'Senior Academic Faculty',
    appointmentRef: 'APT-2026-101',
    visitorsCount: 1,
    date: '2026-10-14',
    checkIn: '09:00 AM',
    checkOut: '09:35 AM',
    idProof: 'Driver License (DL-8291)',
    notes: 'Discussion on Mathematics Term 1 performance. Satisfactory discussion.',
    status: 'completed'
  },
  {
    id: 'vis-03',
    passNo: 'VP-2026-103',
    name: 'Dr. Ashok Bansal',
    phone: '+91 98110 55443',
    category: 'Guest / Speaker',
    organization: 'City Medical Council',
    email: 'dr.bansal@cityhealth.org',
    purpose: 'Annual Health & Eye Checkup Coordination Meeting',
    meetingWith: 'Principal Dr. Evelyn Montgomery',
    department: 'Principal Secretariat',
    appointmentRef: 'APT-2026-103',
    visitorsCount: 1,
    vehicleNo: 'HR-26-CM-1002',
    date: '2026-10-14',
    checkIn: '10:15 AM',
    idProof: 'IMA Identity Card (MC-4409)',
    notes: 'Campus health camp schedule finalize for November 2026.',
    status: 'inside'
  },
  {
    id: 'vis-04',
    passNo: 'VP-2026-104',
    name: 'Mr. Arvind Swaminathan',
    phone: '+91 97112 34509',
    category: 'Vendor / Supplier',
    organization: 'Oxford University Press Depot',
    email: 'arvind.s@oup-distrib.com',
    purpose: 'Library Academic Textbooks Delivery & Invoice Submission',
    meetingWith: 'Mr. Gabriel Vance',
    department: 'Central Library',
    visitorsCount: 2,
    vehicleNo: 'DL-1L-AA-5582',
    date: '2026-10-14',
    checkIn: '10:30 AM',
    idProof: 'Company ID Card (OUP-928)',
    notes: 'Consignment of 140 science & literature volumes received at bay 2.',
    status: 'inside'
  },
  {
    id: 'vis-05',
    passNo: 'VP-2026-098',
    name: 'Mrs. Kavita Narang',
    phone: '+91 98993 11200',
    category: 'Parent / Guardian',
    email: 'kavita.narang@yahoo.com',
    purpose: 'Early Pickup for Medical Appointment',
    meetingWith: 'Vice Principal Mr. Robert Sterling',
    department: 'Vice Principal Office',
    visitorsCount: 1,
    date: '2026-10-14',
    checkIn: '08:15 AM',
    checkOut: '08:40 AM',
    idProof: 'Parent ID Badge #P-402',
    notes: 'Collected student Ananya Narang (Std 8-A) after dental emergency authorization.',
    status: 'completed'
  },
  {
    id: 'vis-06',
    passNo: 'VP-2026-092',
    name: 'Mr. Deepak Chhabra',
    phone: '+91 99100 88221',
    category: 'Service Provider',
    organization: 'Apex Fire & Safety Systems',
    purpose: 'Quarterly Fire Extinguisher Inspection & Certification',
    meetingWith: 'Mr. Robert Sterling',
    department: 'Campus Administration',
    visitorsCount: 2,
    vehicleNo: 'HR-55-AF-9021',
    date: '2026-10-13',
    checkIn: '11:00 AM',
    checkOut: '01:30 PM',
    idProof: 'Safety Contractor License',
    notes: 'Inspected 48 extinguishers across academic wings A, B and Science Block.',
    status: 'completed'
  }
];

export const INITIAL_ENQUIRIES: AdmissionEnquiry[] = [
  {
    id: 'enq-01',
    enquiryNo: 'ENQ-2026-0041',
    candidateName: 'Vivaan Agarwal',
    standardApplying: 6,
    parentName: 'Ramesh Agarwal',
    phone: '+91 98210 33445',
    email: 'ramesh.ag@innovate.co',
    date: '2026-10-12',
    source: 'Walk-in',
    academicYear: '2026-2027',
    assignedStaff: 'Ms. Clara Martinez',
    status: 'followup_required',
    notes: 'Father transferred from Delhi. Seeking prospectus and bus route details. Wants confirmation on Route 2 stop.',
    followUpDate: '2026-10-14',
    documentsProvided: ['Previous Marksheet Copy', 'Address Proof'],
    followUpNotes: [
      {
        id: 'fn-01',
        date: '2026-10-12',
        note: 'Walk-in reception interaction. Handed admission brochure and standard 6 fee structure.',
        staff: 'Ms. Clara Martinez'
      }
    ]
  },
  {
    id: 'enq-02',
    enquiryNo: 'ENQ-2026-0042',
    candidateName: 'Tara Sen',
    standardApplying: 1,
    parentName: 'Debabrata Sen',
    phone: '+91 98300 77889',
    email: 'dsen@researchlab.in',
    date: '2026-10-13',
    source: 'Website',
    academicYear: '2026-2027',
    assignedStaff: 'Ms. Clara Martinez',
    status: 'new',
    notes: 'Inquiry for primary wing admissions for academic year 2026-27. Inquired about co-curricular arts.',
    followUpDate: '2026-10-15',
    documentsProvided: []
  },
  {
    id: 'enq-03',
    enquiryNo: 'ENQ-2026-0039',
    candidateName: 'Samarjeet Chauhan',
    standardApplying: 9,
    parentName: 'Col. V.S. Chauhan',
    phone: '+91 94191 22334',
    email: 'vs.chauhan@armedforces.nic.in',
    date: '2026-10-09',
    source: 'Referral',
    academicYear: '2026-2027',
    assignedStaff: 'Ms. Clara Martinez',
    status: 'admitted',
    notes: 'Admission test cleared with 92% score. Fee paid and enrolled.',
    followUpDate: '2026-10-14',
    documentsProvided: ['Transfer Certificate', 'Birth Certificate', 'Defense Category Form']
  },
  {
    id: 'enq-04',
    enquiryNo: 'ENQ-2026-0043',
    candidateName: 'Meera Iyer',
    standardApplying: 11,
    parentName: 'S. Ramanathan Iyer',
    phone: '+91 98711 00293',
    email: 's.iyer@finsearch.org',
    date: '2026-10-14',
    source: 'Phone',
    academicYear: '2026-2027',
    assignedStaff: 'Ms. Clara Martinez',
    status: 'visit_scheduled',
    notes: 'Enquiry for Science Stream (Physics, Chemistry, Maths, Computer Science). Scheduled lab tour.',
    followUpDate: '2026-10-16',
    documentsProvided: ['Grade 10 Board Marksheet Copy']
  },
  {
    id: 'enq-05',
    enquiryNo: 'ENQ-2026-0038',
    candidateName: 'Aditya Bhatnagar',
    standardApplying: 4,
    parentName: 'Mrs. Prerna Bhatnagar',
    phone: '+91 98102 77441',
    email: 'prerna.bhatnagar@gmail.com',
    date: '2026-10-06',
    source: 'School Event',
    academicYear: '2026-2027',
    assignedStaff: 'Ms. Clara Martinez',
    status: 'info_shared',
    notes: 'Attended Autumn Open House. Prospectus and scholarship details shared via email.',
    followUpDate: '2026-10-13',
    documentsProvided: []
  }
];

export const INITIAL_BOOKS: LibraryBook[] = [
  { id: 'bk-01', bookId: 'GIS-LIB-0104', title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science & Cosmology', isbn: '978-0553380163', totalCopies: 6, availableCopies: 4, locationRack: 'Shelf S-04', publisher: 'Bantam Books' },
  { id: 'bk-02', bookId: 'GIS-LIB-0219', title: 'The Discovery of India', author: 'Jawaharlal Nehru', category: 'History & Society', isbn: '978-0143031031', totalCopies: 8, availableCopies: 5, locationRack: 'Shelf H-02', publisher: 'Penguin Classics' },
  { id: 'bk-03', bookId: 'GIS-LIB-0345', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Classic Literature', isbn: '978-0061120084', totalCopies: 10, availableCopies: 7, locationRack: 'Shelf L-01', publisher: 'Harper Perennial' },
  { id: 'bk-04', bookId: 'GIS-LIB-0412', title: 'Mathematical Circles: Russian Experience', author: 'Dmitri Fomin', category: 'Mathematics', isbn: '978-0821804308', totalCopies: 5, availableCopies: 2, locationRack: 'Shelf M-03', publisher: 'AMS Press' },
  { id: 'bk-05', bookId: 'GIS-LIB-0520', title: 'Wings of Fire', author: 'Dr. A.P.J. Abdul Kalam', category: 'Biography', isbn: '978-8173711466', totalCopies: 12, availableCopies: 8, locationRack: 'Shelf B-02', publisher: 'Universities Press' },
  { id: 'bk-06', bookId: 'GIS-LIB-0601', title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest', category: 'Computer Science', isbn: '978-0262033848', totalCopies: 4, availableCopies: 1, locationRack: 'Shelf CS-01', publisher: 'MIT Press' },
  { id: 'bk-07', bookId: 'GIS-LIB-0733', title: 'The Wonder That Was India', author: 'A.L. Basham', category: 'History & Society', isbn: '978-0330439091', totalCopies: 5, availableCopies: 4, locationRack: 'Shelf H-03', publisher: 'Picador' }
];

export const INITIAL_BOOK_ISSUES: BookIssue[] = [
  {
    id: 'iss-01',
    issueNo: 'ISS-2026-0312',
    bookId: 'bk-01',
    bookTitle: 'A Brief History of Time',
    memberId: 'stu-101',
    memberName: 'Aarav Sharma (8-A)',
    memberRole: 'Student',
    issuedDate: '2026-10-01',
    dueDate: '2026-10-15',
    status: 'borrowed',
    fineAmount: 0
  },
  {
    id: 'iss-02',
    issueNo: 'ISS-2026-0298',
    bookId: 'bk-04',
    bookTitle: 'Mathematical Circles: Russian Experience',
    memberId: 'tch-01',
    memberName: 'Mrs. Shalini Verma',
    memberRole: 'Teacher',
    issuedDate: '2026-09-22',
    dueDate: '2026-10-22',
    status: 'borrowed',
    fineAmount: 0
  },
  {
    id: 'iss-03',
    issueNo: 'ISS-2026-0275',
    bookId: 'bk-03',
    bookTitle: 'To Kill a Mockingbird',
    memberId: 'stu-105',
    memberName: 'Kabir Patel (8-A)',
    memberRole: 'Student',
    issuedDate: '2026-09-15',
    dueDate: '2026-09-29',
    status: 'overdue',
    fineAmount: 75
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-01',
    title: 'Mid-Term Examinations: Consolidated Scorecard Release',
    category: 'Exam',
    audience: 'all',
    date: '2026-10-12',
    content: 'Consolidated report cards for Mid-Term examinations are now published. Parents can review marks and teacher feedback through the SCHLAR portal or mobile app.',
    author: 'Vice Principal Marcus Vance',
    priority: 'high',
    status: 'published'
  },
  {
    id: 'not-02',
    title: 'Annual Inter-House Athletics Meet 2026 Schedule',
    category: 'Academic',
    audience: 'all',
    date: '2026-10-10',
    content: 'The 27th Annual Sports Carnival will be held on Friday, November 6th. Practice sessions for Track & Field start tomorrow after Period 6.',
    author: 'Principal Dr. Evelyn Montgomery',
    priority: 'normal',
    status: 'published'
  },
  {
    id: 'not-03',
    title: 'Second Term Tuition Fee Due Date Reminder',
    category: 'Fee',
    audience: 'parents',
    date: '2026-10-08',
    content: 'Parents are reminded that the grace period for Second Term Tuition Fee collection ends on October 25, 2026. Online payments via UPI/Card are instant.',
    author: 'Bursar David Reynolds',
    priority: 'urgent',
    status: 'published'
  },
  {
    id: 'not-04',
    title: 'Departmental Faculty Curriculum Alignment Review',
    category: 'Academic',
    audience: 'teachers',
    date: '2026-10-11',
    content: 'All faculty members are requested to upload Q3 lesson plans and verify syllabus completion rates before Friday 4:00 PM.',
    author: 'Academic Coordinator',
    priority: 'normal',
    status: 'published'
  }
];

export const INITIAL_EVENTS: SchoolEvent[] = [
  {
    id: 'ev-01',
    title: 'Inter-School Science & Robotics Expo',
    date: '2026-10-24',
    time: '09:00 AM - 03:30 PM',
    location: 'Auditorium & Innovation Hub',
    description: 'Annual project showcase with over 40 innovative student projects from Standards 6 to 10.',
    category: 'Academic'
  },
  {
    id: 'ev-02',
    title: 'Parent-Teacher Conference (Term 2)',
    date: '2026-10-31',
    time: '08:30 AM - 01:30 PM',
    location: 'Senior Wing Classrooms',
    description: 'One-on-one consultation with subject teachers and holistic performance appraisal.',
    category: 'Meeting'
  },
  {
    id: 'ev-03',
    title: 'Annual Greenfield Cultural Evening',
    date: '2026-11-14',
    time: '05:00 PM - 08:30 PM',
    location: 'Open Air Amphitheatre',
    description: 'Music ensemble, classical dance, theatrical drama, and art showcase.',
    category: 'Cultural'
  }
];

export const INITIAL_MESSAGES: DirectMessage[] = [
  {
    id: 'msg-01',
    senderId: 'parent-01',
    senderName: 'Dr. Rajesh Sharma (Parent)',
    senderRole: 'Parent',
    receiverId: 'tch-01',
    receiverName: 'Mrs. Shalini Verma',
    timestamp: '2026-10-13 16:30',
    text: 'Good evening Mrs. Verma, thank you for Aarav\'s mid-term math report. He is very excited about the upcoming Olympiad!',
    isRead: true
  },
  {
    id: 'msg-02',
    senderId: 'tch-01',
    senderName: 'Mrs. Shalini Verma',
    senderRole: 'Teacher',
    receiverId: 'parent-01',
    receiverName: 'Dr. Rajesh Sharma (Parent)',
    timestamp: '2026-10-13 17:15',
    text: 'Hello Dr. Sharma! Aarav performed exceptionally well in Algebra (94/100). I have given him extra problem sets for Olympiad training.',
    isRead: true
  },
  {
    id: 'msg-03',
    senderId: 'parent-01',
    senderName: 'Dr. Rajesh Sharma (Parent)',
    senderRole: 'Parent',
    receiverId: 'tch-01',
    receiverName: 'Mrs. Shalini Verma',
    timestamp: '2026-10-14 09:20',
    text: 'Wonderful, thank you. Could you also please share the timing for this Thursday\'s remedial session?',
    isRead: false
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-01',
    timestamp: '2026-10-14 08:30',
    actorRole: 'Teacher',
    actorName: 'Mr. Arvind Saxena',
    action: 'LEAVE_REQUESTED',
    module: 'Staff Management',
    entityId: 'lvr-02',
    details: 'Applied for 2 days Casual Leave from Oct 17 to Oct 18.'
  },
  {
    id: 'aud-02',
    timestamp: '2026-10-13 18:45',
    actorRole: 'Principal',
    actorName: 'Dr. Evelyn Montgomery',
    action: 'LEAVE_APPROVED',
    module: 'Staff Management',
    entityId: 'lvr-01',
    details: 'Approved 1 day Medical Leave for Ms. Rebecca D\'Souza.'
  },
  {
    id: 'aud-03',
    timestamp: '2026-10-13 19:00',
    actorRole: 'Vice Principal',
    actorName: 'Prof. Marcus Vance',
    action: 'SUBSTITUTION_ASSIGNED',
    module: 'Timetable Coordination',
    entityId: 'sub-01',
    details: 'Assigned Coach Vikram Rawat as substitute for Period 3 (8-A English).'
  },
  {
    id: 'aud-04',
    timestamp: '2026-10-12 16:00',
    actorRole: 'Accountant',
    actorName: 'Mr. David Reynolds',
    action: 'FEE_COLLECTED',
    module: 'Finance & Accounts',
    entityId: 'inv-01',
    details: 'Received ₹28,500 via UPI for Aarav Sharma (RCP-88310).'
  },
  {
    id: 'aud-05',
    timestamp: '2026-10-12 11:30',
    actorRole: 'Vice Principal',
    actorName: 'Prof. Marcus Vance',
    action: 'MARKS_ENDORSED',
    module: 'Examination Moderation',
    entityId: 'mrk-01',
    details: 'Endorsed Mid-Term Mathematics marks for Class 8-A.'
  },
  {
    id: 'aud-06',
    timestamp: '2026-10-11 14:15',
    actorRole: 'Receptionist',
    actorName: 'Ms. Clara Martinez',
    action: 'VISITOR_CHECKED_IN',
    module: 'Front Office',
    entityId: 'vis-01',
    details: 'Issued digital badge VP-2026-102 to Mr. Rajesh Mehra.'
  },
  {
    id: 'aud-07',
    timestamp: '2026-10-10 10:00',
    actorRole: 'Principal',
    actorName: 'Dr. Evelyn Montgomery',
    action: 'TIMETABLE_PUBLISHED',
    module: 'Timetable Management',
    entityId: 'tv-2026-t2',
    details: 'Published Term 2 Master Timetable for Standards 1–10.'
  }
];

export const INITIAL_TRANSFERS: StudentTransferRecord[] = [
  {
    id: 'trf-01',
    studentId: 'stu-103',
    studentName: 'Rohan Deshmukh',
    admissionNo: 'GIS-2022-0155',
    fromClass: 'Class 8-B',
    toClass: 'Class 8-A',
    effectiveDate: '2026-09-01',
    reason: 'Elective alignment and language section consolidation',
    authorizedBy: 'Dr. Evelyn Montgomery'
  }
];

export const PERMISSION_MATRIX: PermissionRule[] = [
  { module: 'Student Records', role: 'principal', canView: true, canCreate: true, canEdit: true, canSubmit: true, canApprove: true, canPublish: true, canArchive: true, canExport: true, scope: 'school_wide', notes: 'Full school-wide administrative authority' },
  { module: 'Student Records', role: 'vice_principal', canView: true, canCreate: false, canEdit: true, canSubmit: true, canApprove: false, canPublish: false, canArchive: false, canExport: true, scope: 'school_wide', notes: 'Academic coordination and section viewing' },
  { module: 'Student Records', role: 'teacher_web', canView: true, canCreate: false, canEdit: false, canSubmit: false, canApprove: false, canPublish: false, canArchive: false, canExport: false, scope: 'assigned_records', notes: 'Restricted to assigned classes (e.g. 8-A, 8-B, 9-B)' },
  { module: 'Student Records', role: 'teacher_mobile', canView: true, canCreate: false, canEdit: false, canSubmit: false, canApprove: false, canPublish: false, canArchive: false, canExport: false, scope: 'assigned_records', notes: 'Same as Teacher Web' },
  { module: 'Student Records', role: 'accountant', canView: true, canCreate: false, canEdit: false, canSubmit: false, canApprove: false, canPublish: false, canArchive: false, canExport: true, scope: 'finance_only', notes: 'Only name, roll, standard for billing' },
  { module: 'Student Records', role: 'receptionist', canView: true, canCreate: true, canEdit: false, canSubmit: true, canApprove: false, canPublish: false, canArchive: false, canExport: false, scope: 'front_office', notes: 'Enrollment enquiry creation and directory search' },
  { module: 'Student Records', role: 'librarian', canView: true, canCreate: false, canEdit: false, canSubmit: false, canApprove: false, canPublish: false, canArchive: false, canExport: false, scope: 'library_only', notes: 'Circulation verification only' },
  { module: 'Student Records', role: 'parent_mobile', canView: true, canCreate: false, canEdit: false, canSubmit: false, canApprove: false, canPublish: false, canArchive: false, canExport: false, scope: 'linked_child', notes: 'Strictly limited to explicitly linked children' },

  { module: 'Staff & Teachers', role: 'principal', canView: true, canCreate: true, canEdit: true, canSubmit: true, canApprove: true, canPublish: true, canArchive: true, canExport: true, scope: 'school_wide', notes: 'Hire, edit, workload limits, leave approval' },
  { module: 'Staff & Teachers', role: 'vice_principal', canView: true, canCreate: false, canEdit: true, canSubmit: true, canApprove: true, canPublish: false, canArchive: false, canExport: true, scope: 'school_wide', notes: 'Academic workloads, substitute allocations' },
  { module: 'Staff & Teachers', role: 'teacher_web', canView: true, canCreate: false, canEdit: false, canSubmit: true, canApprove: false, canPublish: false, canArchive: false, canExport: false, scope: 'assigned_records', notes: 'View own profile and submit leave requests' },
  { module: 'Staff & Teachers', role: 'teacher_mobile', canView: true, canCreate: false, canEdit: false, canSubmit: true, canApprove: false, canPublish: false, canArchive: false, canExport: false, scope: 'assigned_records', notes: 'View own profile and submit leave requests' },
  { module: 'Staff & Teachers', role: 'accountant', canView: true, canCreate: false, canEdit: false, canSubmit: false, canApprove: false, canPublish: false, canArchive: false, canExport: false, scope: 'finance_only', notes: 'Staff roster directory view' },
  { module: 'Staff & Teachers', role: 'receptionist', canView: true, canCreate: false, canEdit: false, canSubmit: false, canApprove: false, canPublish: false, canArchive: false, canExport: false, scope: 'front_office', notes: 'Staff directory for visitor appointments' },
  { module: 'Staff & Teachers', role: 'librarian', canView: true, canCreate: false, canEdit: false, canSubmit: false, canApprove: false, canPublish: false, canArchive: false, canExport: false, scope: 'library_only', notes: 'Staff borrowing card lookup' },
  { module: 'Staff & Teachers', role: 'parent_mobile', canView: true, canCreate: false, canEdit: false, canSubmit: false, canApprove: false, canPublish: false, canArchive: false, canExport: false, scope: 'linked_child', notes: 'Only class teachers of linked children' },

  { module: 'Timetable Management', role: 'principal', canView: true, canCreate: true, canEdit: true, canSubmit: true, canApprove: true, canPublish: true, canArchive: true, canExport: true, scope: 'school_wide', notes: 'Final publication authority & conflict sign-off' },
  { module: 'Timetable Management', role: 'vice_principal', canView: true, canCreate: true, canEdit: true, canSubmit: true, canApprove: true, canPublish: true, canArchive: true, canExport: true, scope: 'school_wide', notes: 'Primary timetable editor & conflict resolution' },
  { module: 'Timetable Management', role: 'teacher_web', canView: true, canCreate: false, canEdit: false, canSubmit: false, canApprove: false, canPublish: false, canArchive: false, canExport: true, scope: 'assigned_records', notes: 'View own schedule and assigned classes' },
  { module: 'Timetable Management', role: 'teacher_mobile', canView: true, canCreate: false, canEdit: false, canSubmit: false, canApprove: false, canPublish: false, canArchive: false, canExport: false, scope: 'assigned_records', notes: 'Today timetable and periods' },
  { module: 'Timetable Management', role: 'parent_mobile', canView: true, canCreate: false, canEdit: false, canSubmit: false, canApprove: false, canPublish: false, canArchive: false, canExport: false, scope: 'linked_child', notes: 'View linked child class timetable' },

  { module: 'Attendance Register', role: 'principal', canView: true, canCreate: false, canEdit: true, canSubmit: true, canApprove: true, canPublish: true, canArchive: false, canExport: true, scope: 'school_wide', notes: 'Audit, correction workflow and compliance' },
  { module: 'Attendance Register', role: 'vice_principal', canView: true, canCreate: false, canEdit: true, canSubmit: true, canApprove: false, canPublish: false, canArchive: false, canExport: true, scope: 'school_wide', notes: 'Missing submissions monitoring' },
  { module: 'Attendance Register', role: 'teacher_web', canView: true, canCreate: true, canEdit: true, canSubmit: true, canApprove: false, canPublish: false, canArchive: false, canExport: true, scope: 'assigned_records', notes: 'Mark daily roll-call register' },
  { module: 'Attendance Register', role: 'teacher_mobile', canView: true, canCreate: true, canEdit: true, canSubmit: true, canApprove: false, canPublish: false, canArchive: false, canExport: false, scope: 'assigned_records', notes: 'One-tap classroom floor roll call' },
  { module: 'Attendance Register', role: 'parent_mobile', canView: true, canCreate: false, canEdit: false, canSubmit: false, canApprove: false, canPublish: false, canArchive: false, canExport: false, scope: 'linked_child', notes: 'View child attendance percentage & history' },

  { module: 'Finance & Fees', role: 'principal', canView: true, canCreate: false, canEdit: false, canSubmit: false, canApprove: true, canPublish: false, canArchive: false, canExport: true, scope: 'school_wide', notes: 'High-level financial summaries & balances' },
  { module: 'Finance & Fees', role: 'accountant', canView: true, canCreate: true, canEdit: true, canSubmit: true, canApprove: true, canPublish: true, canArchive: true, canExport: true, scope: 'finance_only', notes: 'Complete ledger control, invoices & receipts' },
  { module: 'Finance & Fees', role: 'parent_mobile', canView: true, canCreate: false, canEdit: false, canSubmit: true, canApprove: false, canPublish: false, canArchive: false, canExport: true, scope: 'linked_child', notes: 'View invoices, simulated payment & receipts' }
];

// ==========================================
// ACADEMIC MANAGEMENT MOCK DATA (PROMPT 3)
// ==========================================

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: 'ay-2026-27',
    name: '2026–2027',
    code: 'AY-2026-27',
    startDate: '2026-06-01',
    endDate: '2027-04-30',
    status: 'active',
    totalWorkingDays: 224,
    description: 'Current academic calendar session under CBSE curriculum standard regulations.',
    examinationWindowsCount: 3,
    terms: [
      {
        id: 't-2026-1',
        name: 'Term 1 (Foundational)',
        code: 'T1',
        startDate: '2026-06-01',
        endDate: '2026-10-15',
        examStartDate: '2026-09-20',
        examEndDate: '2026-09-30',
        status: 'completed',
        isCurrent: false
      },
      {
        id: 't-2026-2',
        name: 'Term 2 (Intermediate)',
        code: 'T2',
        startDate: '2026-10-25',
        endDate: '2027-02-28',
        examStartDate: '2027-02-15',
        examEndDate: '2027-02-26',
        status: 'active',
        isCurrent: true
      },
      {
        id: 't-2026-3',
        name: 'Term 3 (Annual Finals)',
        code: 'T3',
        startDate: '2027-03-05',
        endDate: '2027-04-30',
        examStartDate: '2027-04-16',
        examEndDate: '2027-04-28',
        status: 'upcoming',
        isCurrent: false
      }
    ]
  },
  {
    id: 'ay-2025-26',
    name: '2025–2026',
    code: 'AY-2025-26',
    startDate: '2025-06-02',
    endDate: '2026-04-28',
    status: 'archived',
    totalWorkingDays: 222,
    description: 'Archived institutional academic year. Promotion ledgers sealed and stored in compliance repository.',
    examinationWindowsCount: 3,
    terms: [
      {
        id: 't-2025-1',
        name: 'Term 1',
        code: 'T1',
        startDate: '2025-06-02',
        endDate: '2025-10-10',
        status: 'completed'
      },
      {
        id: 't-2025-2',
        name: 'Term 2',
        code: 'T2',
        startDate: '2025-10-20',
        endDate: '2026-02-25',
        status: 'completed'
      },
      {
        id: 't-2025-3',
        name: 'Term 3',
        code: 'T3',
        startDate: '2026-03-01',
        endDate: '2026-04-28',
        status: 'completed'
      }
    ]
  },
  {
    id: 'ay-2027-28',
    name: '2027–2028',
    code: 'AY-2027-28',
    startDate: '2027-06-01',
    endDate: '2028-04-30',
    status: 'upcoming',
    totalWorkingDays: 226,
    description: 'Upcoming academic year. Admissions intake and provisional seat allocation draft.',
    examinationWindowsCount: 3,
    terms: [
      {
        id: 't-2027-1',
        name: 'Term 1',
        code: 'T1',
        startDate: '2027-06-01',
        endDate: '2027-10-15',
        status: 'upcoming'
      },
      {
        id: 't-2027-2',
        name: 'Term 2',
        code: 'T2',
        startDate: '2027-10-25',
        endDate: '2028-02-28',
        status: 'upcoming'
      }
    ]
  }
];

export const INITIAL_PERIOD_DEFINITIONS: PeriodDefinition[] = [
  { id: 'prd-1', periodNumber: 1, name: 'Period 1 (Morning Core)', startTime: '08:30', endTime: '09:15', type: 'lesson', displayOrder: 1, isActive: true, applicableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
  { id: 'prd-2', periodNumber: 2, name: 'Period 2 (Science & Math)', startTime: '09:15', endTime: '10:00', type: 'lesson', displayOrder: 2, isActive: true, applicableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
  { id: 'prd-3', periodNumber: 0, name: 'Morning Recess & Fruit Break', startTime: '10:00', endTime: '10:15', type: 'break', displayOrder: 3, isActive: true, applicableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  { id: 'prd-4', periodNumber: 3, name: 'Period 3 (Language Arts)', startTime: '10:15', endTime: '11:00', type: 'lesson', displayOrder: 4, isActive: true, applicableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
  { id: 'prd-5', periodNumber: 4, name: 'Period 4 (Social Sciences)', startTime: '11:00', endTime: '11:45', type: 'lesson', displayOrder: 5, isActive: true, applicableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
  { id: 'prd-6', periodNumber: 0, name: 'Campus Lunch Break', startTime: '11:45', endTime: '12:30', type: 'lunch', displayOrder: 6, isActive: true, applicableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  { id: 'prd-7', periodNumber: 5, name: 'Period 5 (Computing & Lab)', startTime: '12:30', endTime: '01:15', type: 'lesson', displayOrder: 7, isActive: true, applicableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  { id: 'prd-8', periodNumber: 6, name: 'Period 6 (Sports / Activity)', startTime: '01:15', endTime: '02:00', type: 'lesson', displayOrder: 8, isActive: true, applicableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  { id: 'prd-9', periodNumber: 7, name: 'Period 7 (Remedial & Pacing)', startTime: '02:00', endTime: '02:45', type: 'lesson', displayOrder: 9, isActive: true, applicableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
];

export const INITIAL_ROOMS: ClassroomRoom[] = [
  { id: 'rm-101', roomNumber: 'Room 101', wing: 'Primary Wing', floor: 'Ground Floor', type: 'Classroom', capacity: 35 },
  { id: 'rm-102', roomNumber: 'Room 102', wing: 'Primary Wing', floor: 'Ground Floor', type: 'Classroom', capacity: 35 },
  { id: 'rm-201', roomNumber: 'Room 201', wing: 'Middle Wing', floor: '1st Floor', type: 'Classroom', capacity: 38 },
  { id: 'rm-202', roomNumber: 'Room 202', wing: 'Middle Wing', floor: '1st Floor', type: 'Classroom', capacity: 38 },
  { id: 'rm-203', roomNumber: 'Room 203', wing: 'Middle Wing', floor: '1st Floor', type: 'Classroom', capacity: 38 },
  { id: 'rm-204', roomNumber: 'Room 204', wing: 'Middle Wing', floor: '2nd Floor', type: 'Classroom', capacity: 40 },
  { id: 'rm-205', roomNumber: 'Room 205', wing: 'Middle Wing', floor: '2nd Floor', type: 'Classroom', capacity: 40 },
  { id: 'rm-301', roomNumber: 'Room 301', wing: 'Secondary Wing', floor: '2nd Floor', type: 'Classroom', capacity: 40 },
  { id: 'rm-302', roomNumber: 'Room 302', wing: 'Secondary Wing', floor: '2nd Floor', type: 'Classroom', capacity: 40 },
  { id: 'rm-303', roomNumber: 'Room 303', wing: 'Secondary Wing', floor: '3rd Floor', type: 'Classroom', capacity: 40 },
  { id: 'rm-phy', roomNumber: 'Physics Lab 1', wing: 'Science Block', floor: '1st Floor', type: 'Science Lab', capacity: 32 },
  { id: 'rm-chem', roomNumber: 'Chemistry Lab 1', wing: 'Science Block', floor: '1st Floor', type: 'Science Lab', capacity: 32 },
  { id: 'rm-bio', roomNumber: 'Biology Lab 1', wing: 'Science Block', floor: '1st Floor', type: 'Science Lab', capacity: 32 },
  { id: 'rm-csa', roomNumber: 'Computer Lab A', wing: 'Tech Wing', floor: '2nd Floor', type: 'Computer Lab', capacity: 42 },
  { id: 'rm-csb', roomNumber: 'Computer Lab B', wing: 'Tech Wing', floor: '2nd Floor', type: 'Computer Lab', capacity: 42 },
  { id: 'rm-lib', roomNumber: 'Central Library', wing: 'Academic Central', floor: 'Ground Floor', type: 'Library', capacity: 80 },
  { id: 'rm-art', roomNumber: 'Art Studio', wing: 'Cultural Wing', floor: '3rd Floor', type: 'Art Studio', capacity: 35 },
  { id: 'rm-aud', roomNumber: 'Auditorium', wing: 'Main Block', floor: 'Ground Floor', type: 'Auditorium', capacity: 450 },
  { id: 'rm-field', roomNumber: 'Main Field', wing: 'Athletic Ground', floor: 'Outdoor', type: 'Sports Field', capacity: 200 }
];

export const INITIAL_CLASSES: ClassEntity[] = [
  {
    id: 'cls-1',
    standard: 1,
    name: 'Standard 1',
    code: 'STD-01',
    wing: 'Primary Wing',
    academicYear: '2026–2027',
    coordinatorId: 'tch-03',
    coordinatorName: "Ms. Rebecca D'Souza",
    status: 'active',
    sections: [
      { id: 'sec-1-a', classId: 'cls-1', standard: 1, section: 'A', name: '1-A', classTeacherId: 'tch-03', classTeacherName: "Ms. Rebecca D'Souza", room: 'Room 101', capacity: 35, enrolledCount: 16, status: 'active' },
      { id: 'sec-1-b', classId: 'cls-1', standard: 1, section: 'B', name: '1-B', classTeacherId: 'tch-06', classTeacherName: 'Mr. Pradeep Kulkarni', room: 'Room 102', capacity: 35, enrolledCount: 16, status: 'active' }
    ]
  },
  {
    id: 'cls-2',
    standard: 2,
    name: 'Standard 2',
    code: 'STD-02',
    wing: 'Primary Wing',
    academicYear: '2026–2027',
    coordinatorId: 'tch-03',
    coordinatorName: "Ms. Rebecca D'Souza",
    status: 'active',
    sections: [
      { id: 'sec-2-a', classId: 'cls-2', standard: 2, section: 'A', name: '2-A', classTeacherId: 'tch-08', classTeacherName: 'Ms. Arundhati Roy', room: 'Room 103', capacity: 35, enrolledCount: 16, status: 'active' },
      { id: 'sec-2-b', classId: 'cls-2', standard: 2, section: 'B', name: '2-B', classTeacherId: 'tch-05', classTeacherName: 'Ms. Neha Gupta', room: 'Room 104', capacity: 35, enrolledCount: 16, status: 'active' }
    ]
  },
  {
    id: 'cls-3',
    standard: 3,
    name: 'Standard 3',
    code: 'STD-03',
    wing: 'Primary Wing',
    academicYear: '2026–2027',
    coordinatorId: 'tch-03',
    coordinatorName: "Ms. Rebecca D'Souza",
    status: 'active',
    sections: [
      { id: 'sec-3-a', classId: 'cls-3', standard: 3, section: 'A', name: '3-A', classTeacherId: 'tch-04', classTeacherName: 'Mr. Arvind Saxena', room: 'Room 105', capacity: 35, enrolledCount: 16, status: 'active' },
      { id: 'sec-3-b', classId: 'cls-3', standard: 3, section: 'B', name: '3-B', classTeacherId: 'tch-01', classTeacherName: 'Mrs. Shalini Verma', room: 'Room 106', capacity: 35, enrolledCount: 16, status: 'active' }
    ]
  },
  {
    id: 'cls-4',
    standard: 4,
    name: 'Standard 4',
    code: 'STD-04',
    wing: 'Primary Wing',
    academicYear: '2026–2027',
    coordinatorId: 'tch-03',
    coordinatorName: "Ms. Rebecca D'Souza",
    status: 'active',
    sections: [
      { id: 'sec-4-a', classId: 'cls-4', standard: 4, section: 'A', name: '4-A', classTeacherId: 'tch-02', classTeacherName: 'Dr. Alok Sen', room: 'Room 201', capacity: 35, enrolledCount: 16, status: 'active' },
      { id: 'sec-4-b', classId: 'cls-4', standard: 4, section: 'B', name: '4-B', classTeacherId: 'tch-07', classTeacherName: 'Coach Vikram Rawat', room: 'Room 202', capacity: 35, enrolledCount: 16, status: 'active' }
    ]
  },
  {
    id: 'cls-5',
    standard: 5,
    name: 'Standard 5',
    code: 'STD-05',
    wing: 'Middle Wing',
    academicYear: '2026–2027',
    coordinatorId: 'tch-01',
    coordinatorName: 'Mrs. Shalini Verma',
    status: 'active',
    sections: [
      { id: 'sec-5-a', classId: 'cls-5', standard: 5, section: 'A', name: '5-A', classTeacherId: 'tch-05', classTeacherName: 'Ms. Neha Gupta', room: 'Room 203', capacity: 38, enrolledCount: 16, status: 'active' },
      { id: 'sec-5-b', classId: 'cls-5', standard: 5, section: 'B', name: '5-B', classTeacherId: 'tch-06', classTeacherName: 'Mr. Pradeep Kulkarni', room: 'Room 204', capacity: 38, enrolledCount: 16, status: 'active' }
    ]
  },
  {
    id: 'cls-6',
    standard: 6,
    name: 'Standard 6',
    code: 'STD-06',
    wing: 'Middle Wing',
    academicYear: '2026–2027',
    coordinatorId: 'tch-01',
    coordinatorName: 'Mrs. Shalini Verma',
    status: 'active',
    sections: [
      { id: 'sec-6-a', classId: 'cls-6', standard: 6, section: 'A', name: '6-A', classTeacherId: 'tch-08', classTeacherName: 'Ms. Arundhati Roy', room: 'Room 205', capacity: 38, enrolledCount: 16, status: 'active' },
      { id: 'sec-6-b', classId: 'cls-6', standard: 6, section: 'B', name: '6-B', classTeacherId: 'tch-04', classTeacherName: 'Mr. Arvind Saxena', room: 'Room 206', capacity: 38, enrolledCount: 16, status: 'active' }
    ]
  },
  {
    id: 'cls-7',
    standard: 7,
    name: 'Standard 7',
    code: 'STD-07',
    wing: 'Middle Wing',
    academicYear: '2026–2027',
    coordinatorId: 'tch-01',
    coordinatorName: 'Mrs. Shalini Verma',
    status: 'active',
    sections: [
      { id: 'sec-7-a', classId: 'cls-7', standard: 7, section: 'A', name: '7-A', classTeacherId: 'tch-03', classTeacherName: "Ms. Rebecca D'Souza", room: 'Room 207', capacity: 40, enrolledCount: 16, status: 'active' },
      { id: 'sec-7-b', classId: 'cls-7', standard: 7, section: 'B', name: '7-B', classTeacherId: 'tch-07', classTeacherName: 'Coach Vikram Rawat', room: 'Room 208', capacity: 40, enrolledCount: 16, status: 'active' }
    ]
  },
  {
    id: 'cls-8',
    standard: 8,
    name: 'Standard 8',
    code: 'STD-08',
    wing: 'Middle Wing',
    academicYear: '2026–2027',
    coordinatorId: 'tch-01',
    coordinatorName: 'Mrs. Shalini Verma',
    status: 'active',
    sections: [
      { id: 'sec-8-a', classId: 'cls-8', standard: 8, section: 'A', name: '8-A', classTeacherId: 'tch-01', classTeacherName: 'Mrs. Shalini Verma', room: 'Room 204', capacity: 40, enrolledCount: 16, status: 'active' },
      { id: 'sec-8-b', classId: 'cls-8', standard: 8, section: 'B', name: '8-B', classTeacherId: 'tch-04', classTeacherName: 'Mr. Arvind Saxena', room: 'Room 205', capacity: 40, enrolledCount: 16, status: 'active' },
      { id: 'sec-8-c', classId: 'cls-8', standard: 8, section: 'C', name: '8-C', classTeacherId: 'tch-02', classTeacherName: 'Dr. Alok Sen', room: 'Room 206', capacity: 35, enrolledCount: 8, status: 'active' }
    ]
  },
  {
    id: 'cls-9',
    standard: 9,
    name: 'Standard 9',
    code: 'STD-09',
    wing: 'Secondary Wing',
    academicYear: '2026–2027',
    coordinatorId: 'tch-02',
    coordinatorName: 'Dr. Alok Sen',
    status: 'active',
    sections: [
      { id: 'sec-9-a', classId: 'cls-9', standard: 9, section: 'A', name: '9-A', classTeacherId: 'tch-02', classTeacherName: 'Dr. Alok Sen', room: 'Room 301', capacity: 40, enrolledCount: 16, status: 'active' },
      { id: 'sec-9-b', classId: 'cls-9', standard: 9, section: 'B', name: '9-B', classTeacherId: 'tch-05', classTeacherName: 'Ms. Neha Gupta', room: 'Room 302', capacity: 40, enrolledCount: 16, status: 'active' }
    ]
  },
  {
    id: 'cls-10',
    standard: 10,
    name: 'Standard 10',
    code: 'STD-10',
    wing: 'Secondary Wing',
    academicYear: '2026–2027',
    coordinatorId: 'tch-02',
    coordinatorName: 'Dr. Alok Sen',
    status: 'active',
    sections: [
      { id: 'sec-10-a', classId: 'cls-10', standard: 10, section: 'A', name: '10-A', classTeacherId: 'tch-06', classTeacherName: 'Mr. Pradeep Kulkarni', room: 'Room 303', capacity: 40, enrolledCount: 16, status: 'active' },
      { id: 'sec-10-b', classId: 'cls-10', standard: 10, section: 'B', name: '10-B', classTeacherId: 'tch-08', classTeacherName: 'Ms. Arundhati Roy', room: 'Room 304', capacity: 40, enrolledCount: 16, status: 'active' }
    ]
  }
];

export const INITIAL_SUBJECTS: SubjectEntity[] = [
  {
    id: 'sub-math',
    name: 'Mathematics',
    code: 'MATH-CORE',
    category: 'Core Academic',
    applicableStandards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    weeklyPeriodsRequired: 6,
    description: 'CBSE mathematics curriculum covering algebraic structures, geometric theorems, arithmetic reasoning, and trigonometry.',
    status: 'active'
  },
  {
    id: 'sub-phy',
    name: 'Science (Physics)',
    code: 'SCI-PHY',
    category: 'Science & Tech',
    applicableStandards: [6, 7, 8, 9, 10],
    weeklyPeriodsRequired: 5,
    description: 'Theoretical physics principles and applied laboratory experiments covering mechanics, optics, electricity and magnetism.',
    status: 'active'
  },
  {
    id: 'sub-chem',
    name: 'Science (Chemistry)',
    code: 'SCI-CHEM',
    category: 'Science & Tech',
    applicableStandards: [6, 7, 8, 9, 10],
    weeklyPeriodsRequired: 4,
    description: 'Inorganic, organic and physical chemistry foundations with mandatory wet-lab safety drills and stoichiometry experiments.',
    status: 'active'
  },
  {
    id: 'sub-bio',
    name: 'Science (Biology)',
    code: 'SCI-BIO',
    category: 'Science & Tech',
    applicableStandards: [6, 7, 8, 9, 10],
    weeklyPeriodsRequired: 4,
    description: 'Cell biology, human physiology, botanical systems, genetics and environmental ecology experiments.',
    status: 'active'
  },
  {
    id: 'sub-eng-lit',
    name: 'English Literature',
    code: 'ENG-LIT',
    category: 'Languages',
    applicableStandards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    weeklyPeriodsRequired: 5,
    description: 'Classical and contemporary prose, drama analysis, poetry appreciation, and critical textual comprehension.',
    status: 'active'
  },
  {
    id: 'sub-eng-lang',
    name: 'English Language',
    code: 'ENG-LANG',
    category: 'Languages',
    applicableStandards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    weeklyPeriodsRequired: 4,
    description: 'Grammar mechanics, vocabulary enrichment, formal letter writing, report crafting, and oral rhetoric.',
    status: 'active'
  },
  {
    id: 'sub-hin',
    name: 'Hindi',
    code: 'HIN-CORE',
    category: 'Languages',
    applicableStandards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    weeklyPeriodsRequired: 4,
    description: 'National language grammar, classical devanagari composition, sahitya appreciation and communicative fluency.',
    status: 'active'
  },
  {
    id: 'sub-soc',
    name: 'Social Studies',
    code: 'SOC-SCI',
    category: 'Social Sciences',
    applicableStandards: [4, 5, 6, 7, 8, 9, 10],
    weeklyPeriodsRequired: 5,
    description: 'World & Indian History, Constitutional Civics, Physical & Human Geography, and Foundations of Economics.',
    status: 'active'
  },
  {
    id: 'sub-cs',
    name: 'Computer Science',
    code: 'CS-AI',
    category: 'Science & Tech',
    applicableStandards: [3, 4, 5, 6, 7, 8, 9, 10],
    weeklyPeriodsRequired: 3,
    description: 'Computational thinking, Python algorithmic programming, database querying (SQL), and digital ethics.',
    status: 'active'
  },
  {
    id: 'sub-pe',
    name: 'Physical Education',
    code: 'PE-SPORTS',
    category: 'Physical Education',
    applicableStandards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    weeklyPeriodsRequired: 3,
    description: 'Fitness drills, track & field coaching, sportsmanship, competitive football, basketball and cricket instruction.',
    status: 'active'
  },
  {
    id: 'sub-art',
    name: 'Fine Arts',
    code: 'FINE-ART',
    category: 'Arts & Co-Curricular',
    applicableStandards: [1, 2, 3, 4, 5, 6, 7, 8],
    weeklyPeriodsRequired: 2,
    description: 'Watercolor painting, sketching fundamentals, ceramic pottery, sculpture and cultural design expressions.',
    status: 'active'
  }
];

export const INITIAL_SUBJECT_ALLOCATIONS: SubjectAllocation[] = [
  // Class 8-A Allocations
  { id: 'sa-8a-math', academicYear: '2026–2027', standard: 8, section: 'A', subjectId: 'sub-math', subjectName: 'Mathematics', subjectCode: 'MATH-CORE', teacherId: 'tch-01', teacherName: 'Mrs. Shalini Verma', weeklyPeriods: 6, room: 'Room 204', status: 'assigned' },
  { id: 'sa-8a-phy', academicYear: '2026–2027', standard: 8, section: 'A', subjectId: 'sub-phy', subjectName: 'Science (Physics)', subjectCode: 'SCI-PHY', teacherId: 'tch-02', teacherName: 'Dr. Alok Sen', weeklyPeriods: 5, room: 'Physics Lab 1', status: 'assigned' },
  { id: 'sa-8a-eng', academicYear: '2026–2027', standard: 8, section: 'A', subjectId: 'sub-eng-lit', subjectName: 'English Literature', subjectCode: 'ENG-LIT', teacherId: 'tch-03', teacherName: "Ms. Rebecca D'Souza", weeklyPeriods: 5, room: 'Room 204', status: 'assigned' },
  { id: 'sa-8a-soc', academicYear: '2026–2027', standard: 8, section: 'A', subjectId: 'sub-soc', subjectName: 'Social Studies', subjectCode: 'SOC-SCI', teacherId: 'tch-04', teacherName: 'Mr. Arvind Saxena', weeklyPeriods: 5, room: 'Room 204', status: 'assigned' },
  { id: 'sa-8a-cs', academicYear: '2026–2027', standard: 8, section: 'A', subjectId: 'sub-cs', subjectName: 'Computer Science', subjectCode: 'CS-AI', teacherId: 'tch-05', teacherName: 'Ms. Neha Gupta', weeklyPeriods: 3, room: 'Computer Lab B', status: 'assigned' },
  { id: 'sa-8a-hin', academicYear: '2026–2027', standard: 8, section: 'A', subjectId: 'sub-hin', subjectName: 'Hindi', subjectCode: 'HIN-CORE', teacherId: 'tch-06', teacherName: 'Mr. Pradeep Kulkarni', weeklyPeriods: 4, room: 'Room 204', status: 'assigned' },
  { id: 'sa-8a-pe', academicYear: '2026–2027', standard: 8, section: 'A', subjectId: 'sub-pe', subjectName: 'Physical Education', subjectCode: 'PE-SPORTS', teacherId: 'tch-07', teacherName: 'Coach Vikram Rawat', weeklyPeriods: 3, room: 'Main Field', status: 'assigned' },
  { id: 'sa-8a-art', academicYear: '2026–2027', standard: 8, section: 'A', subjectId: 'sub-art', subjectName: 'Fine Arts', subjectCode: 'FINE-ART', teacherId: 'tch-08', teacherName: 'Ms. Arundhati Roy', weeklyPeriods: 2, room: 'Art Studio', status: 'assigned' },

  // Class 8-B Allocations
  { id: 'sa-8b-math', academicYear: '2026–2027', standard: 8, section: 'B', subjectId: 'sub-math', subjectName: 'Mathematics', subjectCode: 'MATH-CORE', teacherId: 'tch-01', teacherName: 'Mrs. Shalini Verma', weeklyPeriods: 6, room: 'Room 205', status: 'assigned' },
  { id: 'sa-8b-soc', academicYear: '2026–2027', standard: 8, section: 'B', subjectId: 'sub-soc', subjectName: 'Social Studies', subjectCode: 'SOC-SCI', teacherId: 'tch-04', teacherName: 'Mr. Arvind Saxena', weeklyPeriods: 5, room: 'Room 205', status: 'assigned' },
  { id: 'sa-8b-phy', academicYear: '2026–2027', standard: 8, section: 'B', subjectId: 'sub-phy', subjectName: 'Science (Physics)', subjectCode: 'SCI-PHY', teacherId: 'tch-02', teacherName: 'Dr. Alok Sen', weeklyPeriods: 5, room: 'Physics Lab 1', status: 'assigned' },
  { id: 'sa-8b-eng', academicYear: '2026–2027', standard: 8, section: 'B', subjectId: 'sub-eng-lit', subjectName: 'English Literature', subjectCode: 'ENG-LIT', teacherId: 'tch-03', teacherName: "Ms. Rebecca D'Souza", weeklyPeriods: 5, room: 'Room 205', status: 'assigned' },

  // Class 9-A Allocations
  { id: 'sa-9a-math', academicYear: '2026–2027', standard: 9, section: 'A', subjectId: 'sub-math', subjectName: 'Mathematics', subjectCode: 'MATH-CORE', teacherId: 'tch-01', teacherName: 'Mrs. Shalini Verma', weeklyPeriods: 6, room: 'Room 301', status: 'assigned' },
  { id: 'sa-9a-phy', academicYear: '2026–2027', standard: 9, section: 'A', subjectId: 'sub-phy', subjectName: 'Science (Physics)', subjectCode: 'SCI-PHY', teacherId: 'tch-02', teacherName: 'Dr. Alok Sen', weeklyPeriods: 5, room: 'Room 301', status: 'assigned' },
  { id: 'sa-9a-cs', academicYear: '2026–2027', standard: 9, section: 'A', subjectId: 'sub-cs', subjectName: 'Computer Science', subjectCode: 'CS-AI', teacherId: 'tch-05', teacherName: 'Ms. Neha Gupta', weeklyPeriods: 3, room: 'Computer Lab A', status: 'assigned' },

  // Class 9-B Allocations
  { id: 'sa-9b-math', academicYear: '2026–2027', standard: 9, section: 'B', subjectId: 'sub-math', subjectName: 'Mathematics', subjectCode: 'MATH-CORE', teacherId: 'tch-01', teacherName: 'Mrs. Shalini Verma', weeklyPeriods: 6, room: 'Room 302', status: 'assigned' },
  { id: 'sa-9b-cs', academicYear: '2026–2027', standard: 9, section: 'B', subjectId: 'sub-cs', subjectName: 'Computer Science', subjectCode: 'CS-AI', teacherId: 'tch-05', teacherName: 'Ms. Neha Gupta', weeklyPeriods: 3, room: 'Computer Lab A', status: 'assigned' }
];

export const INITIAL_TIMETABLE_REVISIONS: TimetableRevision[] = [
  {
    id: 'rev-2.0',
    versionNo: 'v2.0',
    academicYear: '2026–2027',
    term: 'Term 2',
    status: 'published',
    createdAt: '2026-09-01 09:30',
    createdBy: 'Prof. Marcus Vance',
    publishedAt: '2026-09-01 10:00',
    publishedBy: 'Dr. Evelyn Montgomery',
    notes: 'Initial Term 2 Master Timetable ratified by Board of Governors.',
    slotsCount: 32,
    conflictsCount: 0
  },
  {
    id: 'rev-2.1',
    versionNo: 'v2.1',
    academicYear: '2026–2027',
    term: 'Term 2',
    status: 'draft',
    createdAt: '2026-10-14 11:15',
    createdBy: 'Prof. Marcus Vance',
    notes: 'Incorporating mid-term faculty leave substitutions and computer lab reconfiguration.',
    slotsCount: 32,
    conflictsCount: 0
  }
];

export const INITIAL_STUDENT_MOVEMENTS: StudentMovementRecord[] = [
  {
    id: 'mov-01',
    passNo: 'GP-2026-101',
    studentId: 'stu-103',
    studentName: 'Rohan Deshmukh',
    standard: 8,
    section: 'A',
    type: 'late_arrival',
    date: '2026-10-16',
    time: '08:52 AM',
    reason: 'School Bus Route 14 delayed due to major flyover maintenance.',
    category: 'Transport Delay',
    authorizedBy: 'Ms. Clara Martinez (Receptionist)',
    pickupPersonName: 'Sanjay Deshmukh',
    pickupPersonPhone: '+91 98220 11223',
    pickupRelationship: 'Father',
    status: 'approved',
    createdAt: '2026-10-16T08:52:00Z'
  },
  {
    id: 'mov-02',
    passNo: 'GP-2026-102',
    studentId: 'stu-107',
    studentName: 'Aditya Singhania',
    standard: 8,
    section: 'A',
    type: 'early_departure',
    date: '2026-10-16',
    time: '12:30 PM',
    reason: 'Selected for State Inter-School Debate Championship reporting session.',
    category: 'School Event',
    authorizedBy: 'Prof. Marcus Vance (Vice Principal)',
    pickupPersonName: 'Vikram Singhania',
    pickupPersonPhone: '+91 98110 33445',
    pickupRelationship: 'Father',
    status: 'approved',
    createdAt: '2026-10-16T12:30:00Z'
  },
  {
    id: 'mov-03',
    passNo: 'GP-2026-103',
    studentId: 'stu-105',
    studentName: 'Kabir Patel',
    standard: 8,
    section: 'A',
    type: 'temporary_pass',
    date: '2026-10-15',
    time: '11:15 AM',
    reason: 'Visited campus health infirmary for asthma inhalation nebulizer.',
    category: 'Medical',
    authorizedBy: 'Nurse Sushila (School Infirmary)',
    status: 'recorded',
    createdAt: '2026-10-15T11:15:00Z'
  },
  {
    id: 'mov-04',
    passNo: 'GP-2026-104',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    standard: 8,
    section: 'A',
    type: 'late_arrival',
    date: '2026-10-12',
    time: '08:50 AM',
    reason: 'Dental emergency checkup in early morning.',
    category: 'Medical',
    authorizedBy: 'Ms. Clara Martinez (Receptionist)',
    pickupPersonName: 'Dr. Meenakshi Sharma',
    pickupPersonPhone: '+91 98765 43211',
    pickupRelationship: 'Mother',
    status: 'approved',
    createdAt: '2026-10-12T08:50:00Z'
  }
];

export const INITIAL_CORRECTION_REQUESTS: AttendanceCorrectionRequest[] = [
  {
    id: 'cor-01',
    attendanceRecordId: 'att-8a-103-16',
    studentId: 'stu-103',
    studentName: 'Rohan Deshmukh',
    standard: 8,
    section: 'A',
    date: '2026-10-16',
    session: 'morning',
    originalStatus: 'absent',
    requestedStatus: 'late',
    reason: 'Student arrived at 08:52 AM via Route 14 bus with Gate Pass #GP-2026-101. Was incorrectly flagged absent before gate arrival sync.',
    requestedByRole: 'teacher_web',
    requestedByName: 'Mrs. Shalini Verma',
    requestedAt: '2026-10-16T10:15:00Z',
    status: 'pending'
  },
  {
    id: 'cor-02',
    attendanceRecordId: 'att-8a-107-16',
    studentId: 'stu-107',
    studentName: 'Aditya Singhania',
    standard: 8,
    section: 'A',
    date: '2026-10-16',
    session: 'morning',
    originalStatus: 'present',
    requestedStatus: 'half_day',
    reason: 'Left at 12:30 PM with Gate Pass #GP-2026-102 for Inter-School Debate competition.',
    requestedByRole: 'receptionist',
    requestedByName: 'Ms. Clara Martinez',
    requestedAt: '2026-10-16T13:00:00Z',
    status: 'approved',
    reviewedBy: 'Prof. Marcus Vance',
    reviewDecisionDate: '2026-10-16T13:30:00Z',
    reviewRemarks: 'Verified competition deputation order.'
  },
  {
    id: 'cor-03',
    attendanceRecordId: 'att-9',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    standard: 8,
    section: 'A',
    date: '2026-10-12',
    session: 'morning',
    originalStatus: 'absent',
    requestedStatus: 'late',
    reason: 'Parent submitted Gate Pass slip for medical appointment; student attended Periods 2 through 6.',
    requestedByRole: 'vice_principal',
    requestedByName: 'Prof. Marcus Vance',
    requestedAt: '2026-10-12T14:00:00Z',
    status: 'approved',
    reviewedBy: 'Dr. Evelyn Montgomery',
    reviewDecisionDate: '2026-10-12T15:00:00Z',
    reviewRemarks: 'Medical certificate verified and archived.'
  }
];

export const INITIAL_STAFF_ATTENDANCE: StaffAttendanceRecord[] = [
  { id: 'stf-att-01', staffId: 'tch-01', staffName: 'Mrs. Shalini Verma', empId: 'TCH-2016-042', department: 'Mathematics', staffCategory: 'Teaching', date: '2026-10-16', status: 'present', checkInTime: '07:50 AM', checkOutTime: '03:45 PM', markedBy: 'Biometric Gate Sensor & Front Desk' },
  { id: 'stf-att-02', staffId: 'tch-02', staffName: 'Dr. Alok Sen', empId: 'TCH-2018-067', department: 'Science', staffCategory: 'Teaching', date: '2026-10-16', status: 'present', checkInTime: '07:55 AM', checkOutTime: '04:00 PM', markedBy: 'Biometric Gate Sensor & Front Desk' },
  { id: 'stf-att-03', staffId: 'tch-03', staffName: "Ms. Rebecca D'Souza", empId: 'TCH-2019-089', department: 'English & Literature', staffCategory: 'Teaching', date: '2026-10-16', status: 'on_leave', leaveType: 'Sick Leave', leaveRequestId: 'lvr-01', remarks: 'Approved medical rest', markedBy: 'Academic Office' },
  { id: 'stf-att-04', staffId: 'tch-04', staffName: 'Mr. Arvind Saxena', empId: 'TCH-2020-104', department: 'Social Science', staffCategory: 'Teaching', date: '2026-10-16', status: 'present', checkInTime: '08:02 AM', checkOutTime: '03:30 PM', markedBy: 'Biometric Gate Sensor' },
  { id: 'stf-att-05', staffId: 'tch-05', staffName: 'Ms. Neha Gupta', empId: 'TCH-2021-118', department: 'Computer Science', staffCategory: 'Teaching', date: '2026-10-16', status: 'late', checkInTime: '08:25 AM', remarks: 'Metro signal failure', markedBy: 'Front Desk' },
  { id: 'stf-att-06', staffId: 'tch-07', staffName: 'Coach Vikram Rawat', empId: 'TCH-2022-140', department: 'Physical Education', staffCategory: 'Teaching', date: '2026-10-16', status: 'present', checkInTime: '07:30 AM', checkOutTime: '04:15 PM', markedBy: 'Biometric Gate Sensor' },
  { id: 'stf-att-07', staffId: 'tch-adm-01', staffName: 'Dr. Evelyn Montgomery', empId: 'ADM-2012-001', department: 'Administration', staffCategory: 'Administrative', date: '2026-10-16', status: 'present', checkInTime: '07:45 AM', markedBy: 'Executive Suite Log' },
  { id: 'stf-att-08', staffId: 'tch-adm-02', staffName: 'Prof. Marcus Vance', empId: 'ADM-2015-015', department: 'Academic Office', staffCategory: 'Administrative', date: '2026-10-16', status: 'present', checkInTime: '07:48 AM', markedBy: 'Executive Suite Log' },
  { id: 'stf-att-09', staffId: 'tch-adm-04', staffName: 'Ms. Clara Martinez', empId: 'ADM-2022-088', department: 'Front Office', staffCategory: 'Non-Teaching', date: '2026-10-16', status: 'present', checkInTime: '07:35 AM', markedBy: 'Front Desk Terminal' }
];

export const INITIAL_ATTENDANCE_SESSIONS: AttendanceSessionEntity[] = [
  {
    id: '8-A-2026-10-16-morning',
    standard: 8,
    section: 'A',
    date: '2026-10-16',
    session: 'morning',
    status: 'submitted',
    submittedBy: 'Mrs. Shalini Verma',
    submittedAt: '2026-10-16T09:05:00Z',
    lastSavedAt: '2026-10-16T09:05:00Z',
    presentCount: 6,
    absentCount: 1,
    lateCount: 1,
    excusedCount: 1,
    halfDayCount: 1,
    unmarkedCount: 0,
    totalStudents: 10
  },
  {
    id: '8-A-2026-10-15-morning',
    standard: 8,
    section: 'A',
    date: '2026-10-15',
    session: 'morning',
    status: 'submitted',
    submittedBy: 'Mrs. Shalini Verma',
    submittedAt: '2026-10-15T09:00:00Z',
    lastSavedAt: '2026-10-15T09:00:00Z',
    presentCount: 8,
    absentCount: 1,
    lateCount: 0,
    excusedCount: 1,
    halfDayCount: 0,
    unmarkedCount: 0,
    totalStudents: 10
  }
];

export const INITIAL_ATTENDANCE_SETTINGS: AttendanceSettingsConfig = {
  lateCutoffTime: '08:45',
  warningAttendancePercent: 75,
  healthyAttendancePercent: 90,
  allowTeacherDraftSave: true,
  requireRemarkForAbsence: true,
  enableHalfDay: true,
  enableExcusedAbsence: true,
  attendanceRateFormula: 'cbse_standard',
  defaultAttendanceMode: 'daily_sessions'
};

export const INITIAL_EXAMINATIONS: Examination[] = [
  {
    id: 'exam-01',
    name: 'Mid-Term Examination',
    academicYear: '2026–2027',
    term: 'Term 1',
    applicableClasses: [
      { standard: 8, section: 'A' },
      { standard: 8, section: 'B' },
      { standard: 9, section: 'A' },
      { standard: 9, section: 'B' },
      { standard: 5, section: 'B' },
      { standard: 10, section: 'A' }
    ],
    startDate: '2026-09-20',
    endDate: '2026-09-30',
    status: 'published',
    instructions: 'CBSE Term 1 Summative Assessment. Standard examination duration is 2.5 hours. Blue/black ballpoint pens mandatory.',
    publishedAt: '2026-10-05 10:00 AM',
    publishedBy: 'Dr. Evelyn Montgomery',
    totalAssessmentsCount: 24,
    completedAssessmentsCount: 24,
    notes: 'Results approved and published to parent portal.'
  },
  {
    id: 'exam-02',
    name: 'Unit Test 2',
    academicYear: '2026–2027',
    term: 'Term 2',
    applicableClasses: [
      { standard: 8, section: 'A' },
      { standard: 8, section: 'B' },
      { standard: 9, section: 'A' },
      { standard: 9, section: 'B' }
    ],
    startDate: '2026-10-25',
    endDate: '2026-10-30',
    status: 'in_progress',
    instructions: 'Continuous periodic assessment. 25 marks per subject component. Evaluates Chapters 3 through 6.',
    publishedAt: '2026-10-15 09:00 AM',
    publishedBy: 'Prof. Marcus Vance',
    totalAssessmentsCount: 16,
    completedAssessmentsCount: 6,
    notes: 'Faculty score entry currently in progress.'
  },
  {
    id: 'exam-03',
    name: 'Term 2 Board Mock Examination',
    academicYear: '2026–2027',
    term: 'Term 2',
    applicableClasses: [
      { standard: 8, section: 'A' },
      { standard: 8, section: 'B' },
      { standard: 9, section: 'A' },
      { standard: 9, section: 'B' },
      { standard: 10, section: 'A' }
    ],
    startDate: '2027-01-15',
    endDate: '2027-01-25',
    status: 'scheduled',
    instructions: 'Pre-board simulation with strict CBSE examination hall guidelines and external invigilation.',
    publishedAt: '2026-10-10 11:30 AM',
    publishedBy: 'Dr. Evelyn Montgomery',
    totalAssessmentsCount: 20,
    completedAssessmentsCount: 0,
    notes: 'Seating arrangements in main auditorium finalized.'
  },
  {
    id: 'exam-04',
    name: 'Annual Final Examination',
    academicYear: '2026–2027',
    term: 'Term 2',
    applicableClasses: [
      { standard: 8, section: 'A' },
      { standard: 8, section: 'B' },
      { standard: 9, section: 'A' },
      { standard: 9, section: 'B' },
      { standard: 5, section: 'B' }
    ],
    startDate: '2027-03-10',
    endDate: '2027-03-25',
    status: 'draft',
    instructions: 'Final promotional academic examination across standards 1 through 10.',
    totalAssessmentsCount: 28,
    completedAssessmentsCount: 0,
    notes: 'Draft timetable undergoing department reviews.'
  }
];

export const INITIAL_EXAM_SCHEDULE_SLOTS: ExamScheduleSlot[] = [
  // Unit Test 2 Schedule for Class 8-A
  {
    id: 'es-ut2-8a-math',
    examId: 'exam-02',
    examName: 'Unit Test 2',
    date: '2026-10-26',
    standard: 8,
    section: 'A',
    subjectId: 'sub-math',
    subject: 'Mathematics',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    durationMinutes: 90,
    room: 'Room 204',
    examinerTeacherId: 'tch-01',
    examinerTeacherName: 'Mrs. Shalini Verma',
    status: 'published',
    instructions: 'Bring geometry box, calculator not permitted.'
  },
  {
    id: 'es-ut2-8a-phy',
    examId: 'exam-02',
    examName: 'Unit Test 2',
    date: '2026-10-27',
    standard: 8,
    section: 'A',
    subjectId: 'sub-phy',
    subject: 'Science (Physics)',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    durationMinutes: 90,
    room: 'Physics Lab 1',
    examinerTeacherId: 'tch-02',
    examinerTeacherName: 'Dr. Alok Sen',
    status: 'published',
    instructions: 'Theoretical & formula derivation section.'
  },
  {
    id: 'es-ut2-8a-eng',
    examId: 'exam-02',
    examName: 'Unit Test 2',
    date: '2026-10-28',
    standard: 8,
    section: 'A',
    subjectId: 'sub-eng-lit',
    subject: 'English Literature',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    durationMinutes: 90,
    room: 'Room 204',
    examinerTeacherId: 'tch-03',
    examinerTeacherName: "Ms. Rebecca D'Souza",
    status: 'published'
  },
  {
    id: 'es-ut2-8a-soc',
    examId: 'exam-02',
    examName: 'Unit Test 2',
    date: '2026-10-29',
    standard: 8,
    section: 'A',
    subjectId: 'sub-soc',
    subject: 'Social Studies',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    durationMinutes: 90,
    room: 'Room 204',
    examinerTeacherId: 'tch-04',
    examinerTeacherName: 'Mr. Arvind Saxena',
    status: 'published'
  },
  {
    id: 'es-ut2-8a-cs',
    examId: 'exam-02',
    examName: 'Unit Test 2',
    date: '2026-10-30',
    standard: 8,
    section: 'A',
    subjectId: 'sub-cs',
    subject: 'Computer Science',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    durationMinutes: 90,
    room: 'Computer Lab B',
    examinerTeacherId: 'tch-05',
    examinerTeacherName: 'Ms. Neha Gupta',
    status: 'published'
  },

  // Unit Test 2 for Class 8-B
  {
    id: 'es-ut2-8b-math',
    examId: 'exam-02',
    examName: 'Unit Test 2',
    date: '2026-10-26',
    standard: 8,
    section: 'B',
    subjectId: 'sub-math',
    subject: 'Mathematics',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    durationMinutes: 90,
    room: 'Room 205',
    examinerTeacherId: 'tch-01',
    examinerTeacherName: 'Mrs. Shalini Verma',
    status: 'published'
  },
  {
    id: 'es-ut2-8b-phy',
    examId: 'exam-02',
    examName: 'Unit Test 2',
    date: '2026-10-27',
    standard: 8,
    section: 'B',
    subjectId: 'sub-phy',
    subject: 'Science (Physics)',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    durationMinutes: 90,
    room: 'Physics Lab 1',
    examinerTeacherId: 'tch-02',
    examinerTeacherName: 'Dr. Alok Sen',
    status: 'published'
  },

  // Mid-Term Exam Historic Slots (September 2026)
  {
    id: 'es-mt-8a-math',
    examId: 'exam-01',
    examName: 'Mid-Term Exam',
    date: '2026-09-21',
    standard: 8,
    section: 'A',
    subjectId: 'sub-math',
    subject: 'Mathematics',
    startTime: '09:00 AM',
    endTime: '11:30 AM',
    durationMinutes: 150,
    room: 'Exam Hall 1',
    examinerTeacherId: 'tch-01',
    examinerTeacherName: 'Mrs. Shalini Verma',
    status: 'completed'
  },
  {
    id: 'es-mt-8a-sci',
    examId: 'exam-01',
    examName: 'Mid-Term Exam',
    date: '2026-09-23',
    standard: 8,
    section: 'A',
    subjectId: 'sub-phy',
    subject: 'Science',
    startTime: '09:00 AM',
    endTime: '11:30 AM',
    durationMinutes: 150,
    room: 'Exam Hall 1',
    examinerTeacherId: 'tch-02',
    examinerTeacherName: 'Dr. Alok Sen',
    status: 'completed'
  }
];

export const INITIAL_SUBJECT_ASSESSMENTS: SubjectAssessmentConfig[] = [
  // Mid-Term Exam (Exam 01) - Class 8-A (Published)
  {
    id: 'sa-exam01-8a-math',
    examId: 'exam-01',
    examName: 'Mid-Term Exam',
    standard: 8,
    section: 'A',
    subjectId: 'sub-math',
    subject: 'Mathematics',
    maxWritten: 80,
    maxInternal: 20,
    maxPractical: 0,
    totalMax: 100,
    passingMarks: 33,
    examDate: '2026-09-21',
    assignedTeacherId: 'tch-01',
    assignedTeacherName: 'Mrs. Shalini Verma',
    marksEntryStatus: 'published',
    submittedAt: '2026-10-02 11:00 AM',
    submittedBy: 'Mrs. Shalini Verma',
    approvedAt: '2026-10-04 02:30 PM',
    approvedBy: 'Prof. Marcus Vance',
    totalStudents: 16,
    enteredCount: 16,
    absentCount: 0,
    exemptCount: 0
  },
  {
    id: 'sa-exam01-8a-sci',
    examId: 'exam-01',
    examName: 'Mid-Term Exam',
    standard: 8,
    section: 'A',
    subjectId: 'sub-phy',
    subject: 'Science',
    maxWritten: 70,
    maxPractical: 30,
    maxInternal: 0,
    totalMax: 100,
    passingMarks: 33,
    examDate: '2026-09-23',
    assignedTeacherId: 'tch-02',
    assignedTeacherName: 'Dr. Alok Sen',
    marksEntryStatus: 'published',
    submittedAt: '2026-10-02 04:00 PM',
    submittedBy: 'Dr. Alok Sen',
    approvedAt: '2026-10-04 03:00 PM',
    approvedBy: 'Prof. Marcus Vance',
    totalStudents: 16,
    enteredCount: 16,
    absentCount: 0,
    exemptCount: 0
  },
  {
    id: 'sa-exam01-8a-eng',
    examId: 'exam-01',
    examName: 'Mid-Term Exam',
    standard: 8,
    section: 'A',
    subjectId: 'sub-eng-lit',
    subject: 'English',
    maxWritten: 80,
    maxInternal: 20,
    maxPractical: 0,
    totalMax: 100,
    passingMarks: 33,
    examDate: '2026-09-25',
    assignedTeacherId: 'tch-03',
    assignedTeacherName: "Ms. Rebecca D'Souza",
    marksEntryStatus: 'published',
    submittedAt: '2026-10-03 10:15 AM',
    submittedBy: "Ms. Rebecca D'Souza",
    approvedAt: '2026-10-04 03:30 PM',
    approvedBy: 'Prof. Marcus Vance',
    totalStudents: 16,
    enteredCount: 16,
    absentCount: 0,
    exemptCount: 0
  },
  {
    id: 'sa-exam01-8a-soc',
    examId: 'exam-01',
    examName: 'Mid-Term Exam',
    standard: 8,
    section: 'A',
    subjectId: 'sub-soc',
    subject: 'Social Studies',
    maxWritten: 80,
    maxInternal: 20,
    maxPractical: 0,
    totalMax: 100,
    passingMarks: 33,
    examDate: '2026-09-27',
    assignedTeacherId: 'tch-04',
    assignedTeacherName: 'Mr. Arvind Saxena',
    marksEntryStatus: 'published',
    submittedAt: '2026-10-03 01:20 PM',
    submittedBy: 'Mr. Arvind Saxena',
    approvedAt: '2026-10-04 03:45 PM',
    approvedBy: 'Prof. Marcus Vance',
    totalStudents: 16,
    enteredCount: 16,
    absentCount: 0,
    exemptCount: 0
  },
  {
    id: 'sa-exam01-8a-cs',
    examId: 'exam-01',
    examName: 'Mid-Term Exam',
    standard: 8,
    section: 'A',
    subjectId: 'sub-cs',
    subject: 'Computer Science',
    maxWritten: 60,
    maxPractical: 40,
    maxInternal: 0,
    totalMax: 100,
    passingMarks: 33,
    examDate: '2026-09-29',
    assignedTeacherId: 'tch-05',
    assignedTeacherName: 'Ms. Neha Gupta',
    marksEntryStatus: 'published',
    submittedAt: '2026-10-03 03:00 PM',
    submittedBy: 'Ms. Neha Gupta',
    approvedAt: '2026-10-04 04:00 PM',
    approvedBy: 'Prof. Marcus Vance',
    totalStudents: 16,
    enteredCount: 16,
    absentCount: 0,
    exemptCount: 0
  },

  // Unit Test 2 (Exam 02) Assessments
  {
    id: 'sa-exam02-8a-math',
    examId: 'exam-02',
    examName: 'Unit Test 2',
    standard: 8,
    section: 'A',
    subjectId: 'sub-math',
    subject: 'Mathematics',
    maxWritten: 25,
    maxInternal: 0,
    maxPractical: 0,
    totalMax: 25,
    passingMarks: 9,
    examDate: '2026-10-26',
    assignedTeacherId: 'tch-01',
    assignedTeacherName: 'Mrs. Shalini Verma',
    marksEntryStatus: 'draft',
    totalStudents: 16,
    enteredCount: 6,
    absentCount: 1,
    exemptCount: 0
  },
  {
    id: 'sa-exam02-8a-phy',
    examId: 'exam-02',
    examName: 'Unit Test 2',
    standard: 8,
    section: 'A',
    subjectId: 'sub-phy',
    subject: 'Science (Physics)',
    maxWritten: 25,
    maxInternal: 0,
    maxPractical: 0,
    totalMax: 25,
    passingMarks: 9,
    examDate: '2026-10-27',
    assignedTeacherId: 'tch-02',
    assignedTeacherName: 'Dr. Alok Sen',
    marksEntryStatus: 'not_started',
    totalStudents: 16,
    enteredCount: 0,
    absentCount: 0,
    exemptCount: 0
  },
  {
    id: 'sa-exam02-8b-math',
    examId: 'exam-02',
    examName: 'Unit Test 2',
    standard: 8,
    section: 'B',
    subjectId: 'sub-math',
    subject: 'Mathematics',
    maxWritten: 25,
    maxInternal: 0,
    maxPractical: 0,
    totalMax: 25,
    passingMarks: 9,
    examDate: '2026-10-26',
    assignedTeacherId: 'tch-01',
    assignedTeacherName: 'Mrs. Shalini Verma',
    marksEntryStatus: 'submitted',
    submittedAt: '2026-10-28 01:15 PM',
    submittedBy: 'Mrs. Shalini Verma',
    totalStudents: 16,
    enteredCount: 15,
    absentCount: 1,
    exemptCount: 0
  },
  {
    id: 'sa-exam02-9a-math',
    examId: 'exam-02',
    examName: 'Unit Test 2',
    standard: 9,
    section: 'A',
    subjectId: 'sub-math',
    subject: 'Mathematics',
    maxWritten: 25,
    maxInternal: 0,
    maxPractical: 0,
    totalMax: 25,
    passingMarks: 9,
    examDate: '2026-10-27',
    assignedTeacherId: 'tch-01',
    assignedTeacherName: 'Mrs. Shalini Verma',
    marksEntryStatus: 'under_review',
    submittedAt: '2026-10-28 03:40 PM',
    submittedBy: 'Mrs. Shalini Verma',
    totalStudents: 16,
    enteredCount: 16,
    absentCount: 0,
    exemptCount: 0
  }
];

export const INITIAL_GRADING_SCALES: GradingScaleConfig[] = [
  {
    id: 'cbse-standard-9point',
    name: 'CBSE Secondary 9-Point Grading Scale (Standards 6–10)',
    boundaries: [
      { grade: 'A1', minPercentage: 91, maxPercentage: 100, gradePoint: 10.0, description: 'Outstanding performance', isPassing: true },
      { grade: 'A2', minPercentage: 81, maxPercentage: 90, gradePoint: 9.0, description: 'Excellent understanding', isPassing: true },
      { grade: 'B1', minPercentage: 71, maxPercentage: 80, gradePoint: 8.0, description: 'Very Good grasp of concepts', isPassing: true },
      { grade: 'B2', minPercentage: 61, maxPercentage: 70, gradePoint: 7.0, description: 'Good comprehension', isPassing: true },
      { grade: 'C1', minPercentage: 51, maxPercentage: 60, gradePoint: 6.0, description: 'Fair / Satisfactory', isPassing: true },
      { grade: 'C2', minPercentage: 41, maxPercentage: 50, gradePoint: 5.0, description: 'Average performance', isPassing: true },
      { grade: 'D', minPercentage: 33, maxPercentage: 40, gradePoint: 4.0, description: 'Marginal Pass', isPassing: true },
      { grade: 'E1', minPercentage: 21, maxPercentage: 32, gradePoint: 0.0, description: 'Compartment / Essential Repeat', isPassing: false },
      { grade: 'E2', minPercentage: 0, maxPercentage: 20, gradePoint: 0.0, description: 'Remedial Repeat Required', isPassing: false }
    ]
  }
];

export const INITIAL_ASSESSMENT_SETTINGS: AssessmentSettingsConfig = {
  passingPercentage: 33,
  minAttendanceRequiredForExam: 75,
  allowGraceMarks: true,
  maxGraceMarks: 5,
  requireDualModeration: true,
  publishDiscrepancyWindowDays: 15
};

export const INITIAL_ASSIGNMENT_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub-01',
    assignmentId: 'asg-01',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    rollNo: 1,
    admissionNo: 'GIS-2023-0101',
    submittedDate: '2026-10-16 04:30 PM',
    status: 'graded',
    marksObtained: 20,
    maxMarks: 20,
    grade: 'A1',
    teacherFeedback: 'Flawless step-by-step substitution and elimination solutions. Excellent work!',
    attachmentName: 'Aarav_Math_ProblemSet4.pdf'
  },
  {
    id: 'sub-02',
    assignmentId: 'asg-01',
    studentId: 'stu-103',
    studentName: 'Rohan Deshmukh',
    rollNo: 2,
    admissionNo: 'GIS-2023-0103',
    submittedDate: '2026-10-17 06:10 PM',
    status: 'graded',
    marksObtained: 17,
    maxMarks: 20,
    grade: 'A2',
    teacherFeedback: 'Minor calculation error in Question 14; otherwise well presented.',
    attachmentName: 'Rohan_Deshmukh_Ch4.pdf'
  },
  {
    id: 'sub-03',
    assignmentId: 'asg-01',
    studentId: 'stu-104',
    studentName: 'Meera Iyer',
    rollNo: 3,
    admissionNo: 'GIS-2023-0104',
    submittedDate: '2026-10-17 08:00 PM',
    status: 'graded',
    marksObtained: 19,
    maxMarks: 20,
    grade: 'A1',
    teacherFeedback: 'Clean graphs and clearly stated algebraic variables.',
    attachmentName: 'Meera_Math_LinearEquations.pdf'
  },
  {
    id: 'sub-04',
    assignmentId: 'asg-01',
    studentId: 'stu-105',
    studentName: 'Kabir Patel',
    rollNo: 4,
    admissionNo: 'GIS-2023-0105',
    submittedDate: '2026-10-18 10:15 AM',
    status: 'submitted',
    marksObtained: undefined,
    maxMarks: 20,
    teacherFeedback: '',
    attachmentName: 'Kabir_Homework_4.pdf'
  },
  {
    id: 'sub-05',
    assignmentId: 'asg-01',
    studentId: 'stu-106',
    studentName: 'Dia Fernandez',
    rollNo: 5,
    admissionNo: 'GIS-2023-0106',
    submittedDate: '2026-10-18 02:20 PM',
    status: 'submitted',
    marksObtained: undefined,
    maxMarks: 20,
    teacherFeedback: '',
    attachmentName: 'Dia_Fernandez_Set4.pdf'
  }
];

// ==========================================
// LIBRARY INITIAL MOCK DATA
// ==========================================

export const INITIAL_BOOK_COPIES: LibraryBookCopy[] = [
  // A Brief History of Time (bk-01) - 6 copies
  { id: 'cpy-01-1', bookId: 'bk-01', barcode: 'BC-0104-01', shelfRack: 'Shelf S-04', status: 'Issued', currentBorrowerId: 'stu-101', currentBorrowerName: 'Aarav Sharma (8-A)', currentBorrowerRole: 'Student', currentIssueId: 'iss-01', acquisitionDate: '2024-03-15', condition: 'Good' },
  { id: 'cpy-01-2', bookId: 'bk-01', barcode: 'BC-0104-02', shelfRack: 'Shelf S-04', status: 'Available', acquisitionDate: '2024-03-15', condition: 'Good' },
  { id: 'cpy-01-3', bookId: 'bk-01', barcode: 'BC-0104-03', shelfRack: 'Shelf S-04', status: 'Available', acquisitionDate: '2024-03-15', condition: 'Mint' },
  { id: 'cpy-01-4', bookId: 'bk-01', barcode: 'BC-0104-04', shelfRack: 'Shelf S-04', status: 'Available', acquisitionDate: '2024-03-15', condition: 'Good' },
  { id: 'cpy-01-5', bookId: 'bk-01', barcode: 'BC-0104-05', shelfRack: 'Shelf S-04', status: 'Available', acquisitionDate: '2025-07-10', condition: 'Mint' },
  { id: 'cpy-01-6', bookId: 'bk-01', barcode: 'BC-0104-06', shelfRack: 'Shelf S-04', status: 'Damaged', acquisitionDate: '2023-01-20', condition: 'Damaged', notes: 'Spine loose, binding repair scheduled' },

  // The Discovery of India (bk-02) - 8 copies
  { id: 'cpy-02-1', bookId: 'bk-02', barcode: 'BC-0219-01', shelfRack: 'Shelf H-02', status: 'Available', acquisitionDate: '2023-08-11', condition: 'Good' },
  { id: 'cpy-02-2', bookId: 'bk-02', barcode: 'BC-0219-02', shelfRack: 'Shelf H-02', status: 'Available', acquisitionDate: '2023-08-11', condition: 'Good' },
  { id: 'cpy-02-3', bookId: 'bk-02', barcode: 'BC-0219-03', shelfRack: 'Shelf H-02', status: 'Available', acquisitionDate: '2023-08-11', condition: 'Fair' },
  { id: 'cpy-02-4', bookId: 'bk-02', barcode: 'BC-0219-04', shelfRack: 'Shelf H-02', status: 'Available', acquisitionDate: '2024-02-05', condition: 'Mint' },
  { id: 'cpy-02-5', bookId: 'bk-02', barcode: 'BC-0219-05', shelfRack: 'Shelf H-02', status: 'Available', acquisitionDate: '2024-02-05', condition: 'Good' },
  { id: 'cpy-02-6', bookId: 'bk-02', barcode: 'BC-0219-06', shelfRack: 'Shelf H-02', status: 'Issued', currentBorrowerId: 'stu-104', currentBorrowerName: 'Meera Iyer (8-A)', currentBorrowerRole: 'Student', acquisitionDate: '2024-02-05', condition: 'Good' },
  { id: 'cpy-02-7', bookId: 'bk-02', barcode: 'BC-0219-07', shelfRack: 'Shelf H-02', status: 'Issued', currentBorrowerId: 'tch-04', currentBorrowerName: 'Mr. Arvind Saxena', currentBorrowerRole: 'Teacher', acquisitionDate: '2025-01-15', condition: 'Mint' },
  { id: 'cpy-02-8', bookId: 'bk-02', barcode: 'BC-0219-08', shelfRack: 'Shelf H-02', status: 'Issued', currentBorrowerId: 'stu-106', currentBorrowerName: 'Dia Fernandez (8-A)', currentBorrowerRole: 'Student', acquisitionDate: '2025-01-15', condition: 'Good' },

  // To Kill a Mockingbird (bk-03) - 10 copies
  { id: 'cpy-03-1', bookId: 'bk-03', barcode: 'BC-0345-01', shelfRack: 'Shelf L-01', status: 'Issued', currentBorrowerId: 'stu-105', currentBorrowerName: 'Kabir Patel (8-A)', currentBorrowerRole: 'Student', currentIssueId: 'iss-03', acquisitionDate: '2023-04-10', condition: 'Fair' },
  { id: 'cpy-03-2', bookId: 'bk-03', barcode: 'BC-0345-02', shelfRack: 'Shelf L-01', status: 'Available', acquisitionDate: '2023-04-10', condition: 'Good' },
  { id: 'cpy-03-3', bookId: 'bk-03', barcode: 'BC-0345-03', shelfRack: 'Shelf L-01', status: 'Available', acquisitionDate: '2023-04-10', condition: 'Good' },
  { id: 'cpy-03-4', bookId: 'bk-03', barcode: 'BC-0345-04', shelfRack: 'Shelf L-01', status: 'Available', acquisitionDate: '2024-01-12', condition: 'Mint' },
  { id: 'cpy-03-5', bookId: 'bk-03', barcode: 'BC-0345-05', shelfRack: 'Shelf L-01', status: 'Available', acquisitionDate: '2024-01-12', condition: 'Mint' },
  { id: 'cpy-03-6', bookId: 'bk-03', barcode: 'BC-0345-06', shelfRack: 'Shelf L-01', status: 'Available', acquisitionDate: '2024-01-12', condition: 'Good' },
  { id: 'cpy-03-7', bookId: 'bk-03', barcode: 'BC-0345-07', shelfRack: 'Shelf L-01', status: 'Available', acquisitionDate: '2025-03-20', condition: 'Mint' },
  { id: 'cpy-03-8', bookId: 'bk-03', barcode: 'BC-0345-08', shelfRack: 'Shelf L-01', status: 'Reserved', acquisitionDate: '2025-03-20', condition: 'Good', notes: 'Reserved for Tanvi Nair' },
  { id: 'cpy-03-9', bookId: 'bk-03', barcode: 'BC-0345-09', shelfRack: 'Shelf L-01', status: 'Issued', currentBorrowerId: 'tch-03', currentBorrowerName: "Ms. Rebecca D'Souza", currentBorrowerRole: 'Teacher', acquisitionDate: '2025-03-20', condition: 'Mint' },
  { id: 'cpy-03-10', bookId: 'bk-03', barcode: 'BC-0345-10', shelfRack: 'Shelf L-01', status: 'Lost', acquisitionDate: '2022-11-04', condition: 'Fair', notes: 'Lost by alumnus GIS-2022-092. Replacement cost assessed.' },

  // Mathematical Circles (bk-04) - 5 copies
  { id: 'cpy-04-1', bookId: 'bk-04', barcode: 'BC-0412-01', shelfRack: 'Shelf M-03', status: 'Issued', currentBorrowerId: 'tch-01', currentBorrowerName: 'Mrs. Shalini Verma', currentBorrowerRole: 'Teacher', currentIssueId: 'iss-02', acquisitionDate: '2024-06-18', condition: 'Good' },
  { id: 'cpy-04-2', bookId: 'bk-04', barcode: 'BC-0412-02', shelfRack: 'Shelf M-03', status: 'Available', acquisitionDate: '2024-06-18', condition: 'Good' },
  { id: 'cpy-04-3', bookId: 'bk-04', barcode: 'BC-0412-03', shelfRack: 'Shelf M-03', status: 'Available', acquisitionDate: '2024-06-18', condition: 'Mint' },
  { id: 'cpy-04-4', bookId: 'bk-04', barcode: 'BC-0412-04', shelfRack: 'Shelf M-03', status: 'Issued', currentBorrowerId: 'stu-103', currentBorrowerName: 'Rohan Deshmukh (8-A)', currentBorrowerRole: 'Student', acquisitionDate: '2025-02-10', condition: 'Good' },
  { id: 'cpy-04-5', bookId: 'bk-04', barcode: 'BC-0412-05', shelfRack: 'Shelf M-03', status: 'Issued', currentBorrowerId: 'stu-107', currentBorrowerName: 'Aditya Singhania (8-A)', currentBorrowerRole: 'Student', acquisitionDate: '2025-02-10', condition: 'Good' },

  // Wings of Fire (bk-05) - 12 copies
  { id: 'cpy-05-1', bookId: 'bk-05', barcode: 'BC-0520-01', shelfRack: 'Shelf B-02', status: 'Available', acquisitionDate: '2023-05-15', condition: 'Good' },
  { id: 'cpy-05-2', bookId: 'bk-05', barcode: 'BC-0520-02', shelfRack: 'Shelf B-02', status: 'Available', acquisitionDate: '2023-05-15', condition: 'Good' },
  { id: 'cpy-05-3', bookId: 'bk-05', barcode: 'BC-0520-03', shelfRack: 'Shelf B-02', status: 'Available', acquisitionDate: '2023-05-15', condition: 'Fair' },
  { id: 'cpy-05-4', bookId: 'bk-05', barcode: 'BC-0520-04', shelfRack: 'Shelf B-02', status: 'Available', acquisitionDate: '2024-04-01', condition: 'Mint' },
  { id: 'cpy-05-5', bookId: 'bk-05', barcode: 'BC-0520-05', shelfRack: 'Shelf B-02', status: 'Available', acquisitionDate: '2024-04-01', condition: 'Mint' },
  { id: 'cpy-05-6', bookId: 'bk-05', barcode: 'BC-0520-06', shelfRack: 'Shelf B-02', status: 'Available', acquisitionDate: '2024-04-01', condition: 'Good' },
  { id: 'cpy-05-7', bookId: 'bk-05', barcode: 'BC-0520-07', shelfRack: 'Shelf B-02', status: 'Available', acquisitionDate: '2025-01-10', condition: 'Good' },
  { id: 'cpy-05-8', bookId: 'bk-05', barcode: 'BC-0520-08', shelfRack: 'Shelf B-02', status: 'Available', acquisitionDate: '2025-01-10', condition: 'Mint' },
  { id: 'cpy-05-9', bookId: 'bk-05', barcode: 'BC-0520-09', shelfRack: 'Shelf B-02', status: 'Issued', currentBorrowerId: 'stu-108', currentBorrowerName: 'Tanvi Nair (8-A)', currentBorrowerRole: 'Student', acquisitionDate: '2025-01-10', condition: 'Good' },
  { id: 'cpy-05-10', bookId: 'bk-05', barcode: 'BC-0520-10', shelfRack: 'Shelf B-02', status: 'Issued', currentBorrowerId: 'stu-109', currentBorrowerName: 'Zayn Khan (8-A)', currentBorrowerRole: 'Student', acquisitionDate: '2025-01-10', condition: 'Good' },
  { id: 'cpy-05-11', bookId: 'bk-05', barcode: 'BC-0520-11', shelfRack: 'Shelf B-02', status: 'Issued', currentBorrowerId: 'tch-02', currentBorrowerName: 'Dr. Alok Sen', currentBorrowerRole: 'Teacher', acquisitionDate: '2025-01-10', condition: 'Mint' },
  { id: 'cpy-05-12', bookId: 'bk-05', barcode: 'BC-0520-12', shelfRack: 'Shelf B-02', status: 'Issued', currentBorrowerId: 'stu-102', currentBorrowerName: 'Ananya Sharma (5-B)', currentBorrowerRole: 'Student', acquisitionDate: '2025-01-10', condition: 'Good' },

  // Introduction to Algorithms (bk-06) - 4 copies
  { id: 'cpy-06-1', bookId: 'bk-06', barcode: 'BC-0601-01', shelfRack: 'Shelf CS-01', status: 'Available', acquisitionDate: '2024-08-20', condition: 'Mint' },
  { id: 'cpy-06-2', bookId: 'bk-06', barcode: 'BC-0601-02', shelfRack: 'Shelf CS-01', status: 'Issued', currentBorrowerId: 'tch-05', currentBorrowerName: 'Ms. Neha Gupta', currentBorrowerRole: 'Teacher', acquisitionDate: '2024-08-20', condition: 'Mint' },
  { id: 'cpy-06-3', bookId: 'bk-06', barcode: 'BC-0601-03', shelfRack: 'Shelf CS-01', status: 'Issued', currentBorrowerId: 'stu-101', currentBorrowerName: 'Aarav Sharma (8-A)', currentBorrowerRole: 'Student', acquisitionDate: '2024-08-20', condition: 'Good' },
  { id: 'cpy-06-4', bookId: 'bk-06', barcode: 'BC-0601-04', shelfRack: 'Shelf CS-01', status: 'Issued', currentBorrowerId: 'stu-107', currentBorrowerName: 'Aditya Singhania (8-A)', currentBorrowerRole: 'Student', acquisitionDate: '2025-05-12', condition: 'Good' },

  // The Wonder That Was India (bk-07) - 5 copies
  { id: 'cpy-07-1', bookId: 'bk-07', barcode: 'BC-0733-01', shelfRack: 'Shelf H-03', status: 'Available', acquisitionDate: '2023-10-05', condition: 'Good' },
  { id: 'cpy-07-2', bookId: 'bk-07', barcode: 'BC-0733-02', shelfRack: 'Shelf H-03', status: 'Available', acquisitionDate: '2023-10-05', condition: 'Good' },
  { id: 'cpy-07-3', bookId: 'bk-07', barcode: 'BC-0733-03', shelfRack: 'Shelf H-03', status: 'Available', acquisitionDate: '2024-03-14', condition: 'Mint' },
  { id: 'cpy-07-4', bookId: 'bk-07', barcode: 'BC-0733-04', shelfRack: 'Shelf H-03', status: 'Available', acquisitionDate: '2024-03-14', condition: 'Fair' },
  { id: 'cpy-07-5', bookId: 'bk-07', barcode: 'BC-0733-05', shelfRack: 'Shelf H-03', status: 'Issued', currentBorrowerId: 'tch-06', currentBorrowerName: 'Mr. Pradeep Kulkarni', currentBorrowerRole: 'Teacher', acquisitionDate: '2025-02-18', condition: 'Good' }
];

export const INITIAL_BOOK_RESERVATIONS: BookReservation[] = [
  {
    id: 'res-01',
    reservationNo: 'RES-2026-0042',
    bookId: 'bk-03',
    bookTitle: 'To Kill a Mockingbird',
    memberId: 'stu-108',
    memberName: 'Tanvi Nair (8-A)',
    memberRole: 'Student',
    reservationDate: '2026-10-12',
    queuePosition: 1,
    status: 'active',
    notifiedAt: '2026-10-14 09:30',
    notes: 'Member requested notification on return'
  },
  {
    id: 'res-02',
    reservationNo: 'RES-2026-0043',
    bookId: 'bk-06',
    bookTitle: 'Introduction to Algorithms (CLRS)',
    memberId: 'stu-104',
    memberName: 'Meera Iyer (8-A)',
    memberRole: 'Student',
    reservationDate: '2026-10-15',
    queuePosition: 1,
    status: 'active',
    notes: 'Python Club reading list'
  }
];

export const INITIAL_LOST_DAMAGED_BOOKS: LostDamagedBookRecord[] = [
  {
    id: 'ld-01',
    incidentNo: 'INC-LIB-2026-01',
    bookId: 'bk-03',
    bookTitle: 'To Kill a Mockingbird',
    copyBarcode: 'BC-0345-10',
    memberId: 'stu-alumnus',
    memberName: 'Vikram Sethi (Alumnus)',
    memberRole: 'Student',
    type: 'Lost',
    dateReported: '2026-09-18',
    description: 'Book mislaid during inter-city house relocation.',
    assessedCost: 450,
    fineStatus: 'cleared',
    recordedBy: "Mr. Samuel O'Connor",
    status: 'written_off',
    resolutionNotes: 'Replacement charge reimbursed under Receipt #RCP-LIB-8841.'
  },
  {
    id: 'ld-02',
    incidentNo: 'INC-LIB-2026-02',
    bookId: 'bk-01',
    bookTitle: 'A Brief History of Time',
    copyBarcode: 'BC-0104-06',
    type: 'Damaged',
    dateReported: '2026-10-08',
    description: 'Severe spine break and water damage on pages 40-75.',
    assessedCost: 200,
    fineStatus: 'waived',
    recordedBy: "Mr. Samuel O'Connor",
    status: 'confirmed',
    resolutionNotes: 'Scheduled for in-house bookbinding repair in November.'
  }
];

export const INITIAL_LIBRARY_TRANSACTIONS: LibraryTransaction[] = [
  {
    id: 'tx-01',
    txnNo: 'TXN-LIB-2026-108',
    timestamp: '2026-10-15 02:40 PM',
    type: 'ISSUE',
    bookTitle: 'Mathematical Circles: Russian Experience',
    copyBarcode: 'BC-0412-05',
    memberId: 'stu-107',
    memberName: 'Aditya Singhania (8-A)',
    memberRole: 'Student',
    dueDate: '2026-10-29',
    recordedBy: "Mr. Samuel O'Connor",
    notes: 'Loan issued against Student Card #GIS-2023-0107'
  },
  {
    id: 'tx-02',
    txnNo: 'TXN-LIB-2026-107',
    timestamp: '2026-10-14 11:15 AM',
    type: 'RETURN',
    bookTitle: 'The Discovery of India',
    copyBarcode: 'BC-0219-03',
    memberId: 'stu-103',
    memberName: 'Rohan Deshmukh (8-A)',
    memberRole: 'Student',
    returnCondition: 'Fair',
    fineAmount: 0,
    recordedBy: "Mr. Samuel O'Connor",
    notes: 'Returned on time in satisfactory condition'
  },
  {
    id: 'tx-03',
    txnNo: 'TXN-LIB-2026-106',
    timestamp: '2026-10-12 09:30 AM',
    type: 'RESERVATION',
    bookTitle: 'To Kill a Mockingbird',
    copyBarcode: 'BC-0345-08',
    memberId: 'stu-108',
    memberName: 'Tanvi Nair (8-A)',
    memberRole: 'Student',
    recordedBy: "Mr. Samuel O'Connor",
    notes: 'Hold placed for 3 days upon copy availability'
  },
  {
    id: 'tx-04',
    txnNo: 'TXN-LIB-2026-105',
    timestamp: '2026-10-01 10:15 AM',
    type: 'ISSUE',
    bookTitle: 'A Brief History of Time',
    copyBarcode: 'BC-0104-01',
    memberId: 'stu-101',
    memberName: 'Aarav Sharma (8-A)',
    memberRole: 'Student',
    dueDate: '2026-10-15',
    recordedBy: "Mr. Samuel O'Connor",
    notes: 'Regular 14-day student checkout'
  }
];

// ==========================================
// TRANSPORT INITIAL MOCK DATA
// ==========================================

export const INITIAL_TRANSPORT_VEHICLES: TransportVehicle[] = [
  {
    id: 'veh-01',
    vehicleNo: 'DL-01-TA-4820',
    vehicleCode: 'BUS-01',
    type: 'Standard 45-Seater Bus',
    makeModel: 'Tata Starbus Ultra 2023',
    capacity: 45,
    assignedRouteId: 'rt-01',
    assignedRouteCode: 'Route 1',
    primaryDriverId: 'drv-01',
    primaryDriverName: 'Mr. Ramesh Chand',
    status: 'Active',
    insuranceExpiry: '2027-04-30',
    fitnessExpiry: '2027-02-15',
    pucExpiry: '2027-01-10',
    speedGovernorCert: 'SG-DL-99214',
    fuelType: 'Diesel',
    lastServiceDate: '2026-09-15',
    notes: 'All 8 CCTV cameras verified; emergency exit alarm inspected.'
  },
  {
    id: 'veh-02',
    vehicleNo: 'DL-01-TA-5114',
    vehicleCode: 'BUS-02',
    type: 'Standard 45-Seater Bus',
    makeModel: 'Ashok Leyland Oyster 2023',
    capacity: 45,
    assignedRouteId: 'rt-02',
    assignedRouteCode: 'Route 2',
    primaryDriverId: 'drv-02',
    primaryDriverName: 'Mr. Baljit Singh',
    status: 'Active',
    insuranceExpiry: '2027-05-20',
    fitnessExpiry: '2027-03-10',
    pucExpiry: '2027-02-05',
    speedGovernorCert: 'SG-DL-99215',
    fuelType: 'Diesel',
    lastServiceDate: '2026-09-18'
  },
  {
    id: 'veh-03',
    vehicleNo: 'DL-01-TA-6029',
    vehicleCode: 'BUS-03',
    type: 'Mini Bus 30-Seater',
    makeModel: 'Tata Marcopolo 2022',
    capacity: 40,
    assignedRouteId: 'rt-03',
    assignedRouteCode: 'Route 3',
    primaryDriverId: 'drv-03',
    primaryDriverName: 'Mr. Dharamvir Yadav',
    status: 'Active',
    insuranceExpiry: '2027-03-15',
    fitnessExpiry: '2026-12-20',
    pucExpiry: '2026-11-28',
    speedGovernorCert: 'SG-DL-99182',
    fuelType: 'CNG',
    lastServiceDate: '2026-08-25',
    notes: 'CNG cylinder hydro-tested in July 2026'
  },
  {
    id: 'veh-04',
    vehicleNo: 'DL-01-TA-7741',
    vehicleCode: 'BUS-04',
    type: 'Standard 45-Seater Bus',
    makeModel: 'Eicher Skyline Pro 2024',
    capacity: 45,
    assignedRouteId: 'rt-04',
    assignedRouteCode: 'Route 4',
    primaryDriverId: 'drv-04',
    primaryDriverName: 'Mr. Satish Kumar',
    status: 'Active',
    insuranceExpiry: '2027-08-10',
    fitnessExpiry: '2027-06-12',
    pucExpiry: '2027-04-18',
    speedGovernorCert: 'SG-DL-99411',
    fuelType: 'Diesel',
    lastServiceDate: '2026-10-02'
  },
  {
    id: 'veh-05',
    vehicleNo: 'DL-01-TA-8820',
    vehicleCode: 'BUS-05',
    type: 'Mini Bus 30-Seater',
    makeModel: 'Tata Starbus City 2022',
    capacity: 40,
    assignedRouteId: 'rt-05',
    assignedRouteCode: 'Route 5',
    primaryDriverId: 'drv-05',
    primaryDriverName: 'Mr. Gurpreet Sandhu',
    status: 'Active',
    insuranceExpiry: '2027-02-18',
    fitnessExpiry: '2027-01-20',
    pucExpiry: '2026-12-15',
    speedGovernorCert: 'SG-DL-99052',
    fuelType: 'Diesel',
    lastServiceDate: '2026-09-08'
  },
  {
    id: 'veh-06',
    vehicleNo: 'DL-01-TA-9104',
    vehicleCode: 'BUS-06',
    type: 'Van 18-Seater',
    makeModel: 'Force Traveller 2023',
    capacity: 18,
    status: 'Under Maintenance',
    insuranceExpiry: '2027-01-15',
    fitnessExpiry: '2026-11-30',
    pucExpiry: '2026-11-15',
    speedGovernorCert: 'SG-DL-98841',
    fuelType: 'Diesel',
    lastServiceDate: '2026-10-14',
    notes: 'Brake booster overhaul in progress at Autoriders Service Centre'
  },
  {
    id: 'veh-07',
    vehicleNo: 'DL-01-TA-9220',
    vehicleCode: 'BUS-07',
    type: 'Standard 45-Seater Bus',
    makeModel: 'Ashok Leyland Viking 2021',
    capacity: 45,
    status: 'Active',
    insuranceExpiry: '2027-06-25',
    fitnessExpiry: '2027-04-10',
    pucExpiry: '2027-03-01',
    speedGovernorCert: 'SG-DL-98711',
    fuelType: 'Diesel',
    lastServiceDate: '2026-08-10',
    notes: 'Standby relief vehicle for school excursions and field trips'
  },
  {
    id: 'veh-08',
    vehicleNo: 'DL-01-EV-3310',
    vehicleCode: 'VAN-01',
    type: 'Electric Shuttle 24-Seater',
    makeModel: 'Switch Mobility EiV 12 2024',
    capacity: 24,
    status: 'Active',
    insuranceExpiry: '2027-09-10',
    fitnessExpiry: '2027-09-10',
    pucExpiry: '2028-09-10',
    speedGovernorCert: 'SG-EV-00124',
    fuelType: 'Electric',
    lastServiceDate: '2026-07-20',
    notes: 'Zero emission pilot vehicle for Junior Wing campus transit'
  }
];

export const INITIAL_TRANSPORT_DRIVERS: TransportDriver[] = [
  {
    id: 'drv-01',
    staffId: 'stf-tr-01',
    name: 'Mr. Ramesh Chand',
    role: 'Lead Bus Driver',
    phone: '+91 98110 44211',
    emergencyPhone: '+91 98110 99881',
    licenseNo: 'DL-042011003412',
    licenseExpiry: '2028-06-15',
    assignedVehicleId: 'veh-01',
    assignedVehicleNo: 'DL-01-TA-4820',
    assignedRouteCode: 'Route 1',
    status: 'Active',
    joiningDate: '2016-04-10',
    badgeNumber: 'BDG-DL-084',
    bloodGroup: 'O+',
    experienceYears: 16
  },
  {
    id: 'drv-02',
    staffId: 'stf-tr-02',
    name: 'Mr. Baljit Singh',
    role: 'Lead Bus Driver',
    phone: '+91 98112 55322',
    emergencyPhone: '+91 98112 88771',
    licenseNo: 'DL-042013008910',
    licenseExpiry: '2027-11-20',
    assignedVehicleId: 'veh-02',
    assignedVehicleNo: 'DL-01-TA-5114',
    assignedRouteCode: 'Route 2',
    status: 'Active',
    joiningDate: '2018-05-12',
    badgeNumber: 'BDG-DL-112',
    bloodGroup: 'B+',
    experienceYears: 14
  },
  {
    id: 'drv-03',
    staffId: 'stf-tr-03',
    name: 'Mr. Dharamvir Yadav',
    role: 'Lead Bus Driver',
    phone: '+91 98115 88901',
    emergencyPhone: '+91 98115 77610',
    licenseNo: 'DL-042015004455',
    licenseExpiry: '2029-01-10',
    assignedVehicleId: 'veh-03',
    assignedVehicleNo: 'DL-01-TA-6029',
    assignedRouteCode: 'Route 3',
    status: 'Active',
    joiningDate: '2019-07-01',
    badgeNumber: 'BDG-DL-149',
    bloodGroup: 'A+',
    experienceYears: 12
  },
  {
    id: 'drv-04',
    staffId: 'stf-tr-04',
    name: 'Mr. Satish Kumar',
    role: 'Lead Bus Driver',
    phone: '+91 98118 77634',
    emergencyPhone: '+91 98118 44102',
    licenseNo: 'DL-042012007788',
    licenseExpiry: '2028-09-05',
    assignedVehicleId: 'veh-04',
    assignedVehicleNo: 'DL-01-TA-7741',
    assignedRouteCode: 'Route 4',
    status: 'Active',
    joiningDate: '2017-03-15',
    badgeNumber: 'BDG-DL-096',
    bloodGroup: 'AB+',
    experienceYears: 15
  },
  {
    id: 'drv-05',
    staffId: 'stf-tr-05',
    name: 'Mr. Gurpreet Sandhu',
    role: 'Lead Bus Driver',
    phone: '+91 98119 12399',
    emergencyPhone: '+91 98119 55612',
    licenseNo: 'DL-042017002234',
    licenseExpiry: '2027-08-30',
    assignedVehicleId: 'veh-05',
    assignedVehicleNo: 'DL-01-TA-8820',
    assignedRouteCode: 'Route 5',
    status: 'Active',
    joiningDate: '2021-02-10',
    badgeNumber: 'BDG-DL-188',
    bloodGroup: 'O+',
    experienceYears: 9
  },
  {
    id: 'drv-06',
    staffId: 'stf-tr-06',
    name: 'Mr. Jagdish Prasad',
    role: 'Relief Driver',
    phone: '+91 98122 33441',
    emergencyPhone: '+91 98122 77651',
    licenseNo: 'DL-042014006677',
    licenseExpiry: '2028-12-14',
    assignedVehicleId: 'veh-07',
    assignedVehicleNo: 'DL-01-TA-9220',
    status: 'Active',
    joiningDate: '2020-11-01',
    badgeNumber: 'BDG-DL-162',
    bloodGroup: 'B+',
    experienceYears: 11
  }
];

export const INITIAL_TRANSPORT_ROUTES: TransportRoute[] = [
  {
    id: 'rt-01',
    routeCode: 'Route 1',
    routeName: 'Sector 14 — Green Glen & DLF Phase 2',
    startPoint: 'Sector 14 Community Centre',
    endPoint: 'Campus Gate 3',
    assignedVehicleId: 'veh-01',
    assignedVehicleNo: 'DL-01-TA-4820',
    driverName: 'Mr. Ramesh Chand',
    driverPhone: '+91 98110 44211',
    conductorName: 'Suraj Bhan',
    capacity: 45,
    assignedStudentsCount: 38,
    morningDeparture: '06:45 AM',
    eveningArrival: '04:15 PM',
    status: 'Active',
    operatingDays: 'Monday – Friday',
    stops: [
      { id: 'stp-01-1', routeId: 'rt-01', stopName: 'Sector 14 Gate 1', areaLandmark: 'Opposite Mother Dairy', morningPickupTime: '06:45 AM', eveningDropTime: '04:15 PM', sequence: 1, status: 'active' },
      { id: 'stp-01-2', routeId: 'rt-01', stopName: 'DLF Phase 2 Court', areaLandmark: 'Near Sikanderpur Metro', morningPickupTime: '07:00 AM', eveningDropTime: '04:00 PM', sequence: 2, status: 'active' },
      { id: 'stp-01-3', routeId: 'rt-01', stopName: 'Cyber Hub Circle', areaLandmark: 'Building 10 Roundabout', morningPickupTime: '07:12 AM', eveningDropTime: '03:48 PM', sequence: 3, status: 'active' },
      { id: 'stp-01-4', routeId: 'rt-01', stopName: 'Green Glen Society', areaLandmark: 'Main Gate Security Post', morningPickupTime: '07:25 AM', eveningDropTime: '03:35 PM', sequence: 4, status: 'active' },
      { id: 'stp-01-5', routeId: 'rt-01', stopName: 'Campus Gate 3', areaLandmark: 'Senior School Bus Bay', morningPickupTime: '07:45 AM', eveningDropTime: '03:15 PM', sequence: 5, status: 'active' }
    ]
  },
  {
    id: 'rt-02',
    routeCode: 'Route 2',
    routeName: 'Golf Course Extension & Nirvana Country',
    startPoint: 'Nirvana Square Clock Tower',
    endPoint: 'Campus Gate 3',
    assignedVehicleId: 'veh-02',
    assignedVehicleNo: 'DL-01-TA-5114',
    driverName: 'Mr. Baljit Singh',
    driverPhone: '+91 98112 55322',
    conductorName: 'Mohan Lal',
    capacity: 45,
    assignedStudentsCount: 41,
    morningDeparture: '06:50 AM',
    eveningArrival: '04:10 PM',
    status: 'Active',
    operatingDays: 'Monday – Friday',
    stops: [
      { id: 'stp-02-1', routeId: 'rt-02', stopName: 'Nirvana Square Clock Tower', areaLandmark: 'Main Commercial Plaza', morningPickupTime: '06:50 AM', eveningDropTime: '04:10 PM', sequence: 1, status: 'active' },
      { id: 'stp-02-2', routeId: 'rt-02', stopName: 'South City 2 Block E', areaLandmark: 'Community Park Gate', morningPickupTime: '07:05 AM', eveningDropTime: '03:55 PM', sequence: 2, status: 'active' },
      { id: 'stp-02-3', routeId: 'rt-02', stopName: 'Fresher Greens Society', areaLandmark: 'Tower 4 Dropzone', morningPickupTime: '07:18 AM', eveningDropTime: '03:42 PM', sequence: 3, status: 'active' },
      { id: 'stp-02-4', routeId: 'rt-02', stopName: 'Rosewood Circle', areaLandmark: 'Police Post 5 Junction', morningPickupTime: '07:30 AM', eveningDropTime: '03:30 PM', sequence: 4, status: 'active' },
      { id: 'stp-02-5', routeId: 'rt-02', stopName: 'Campus Gate 3', areaLandmark: 'Senior School Bus Bay', morningPickupTime: '07:45 AM', eveningDropTime: '03:15 PM', sequence: 5, status: 'active' }
    ]
  },
  {
    id: 'rt-03',
    routeCode: 'Route 3',
    routeName: 'Sohna Road — Vatika City & Malibu Town',
    startPoint: 'Malibu Town Gate 1',
    endPoint: 'Campus Gate 3',
    assignedVehicleId: 'veh-03',
    assignedVehicleNo: 'DL-01-TA-6029',
    driverName: 'Mr. Dharamvir Yadav',
    driverPhone: '+91 98115 88901',
    conductorName: 'Raj Kumar',
    capacity: 40,
    assignedStudentsCount: 35,
    morningDeparture: '07:00 AM',
    eveningArrival: '04:20 PM',
    status: 'Active',
    operatingDays: 'Monday – Friday',
    stops: [
      { id: 'stp-03-1', routeId: 'rt-03', stopName: 'Malibu Town Gate 1', areaLandmark: 'Clubhouse Entrance', morningPickupTime: '07:00 AM', eveningDropTime: '04:20 PM', sequence: 1, status: 'active' },
      { id: 'stp-03-2', routeId: 'rt-03', stopName: 'Vatika City Market', areaLandmark: 'Near Standard Chartered Bank', morningPickupTime: '07:12 AM', eveningDropTime: '04:08 PM', sequence: 2, status: 'active' },
      { id: 'stp-03-3', routeId: 'rt-03', stopName: 'Park View Spa', areaLandmark: 'Sector 47 T-Point', morningPickupTime: '07:22 AM', eveningDropTime: '03:58 PM', sequence: 3, status: 'active' },
      { id: 'stp-03-4', routeId: 'rt-03', stopName: 'Badshahpur Cross', areaLandmark: 'Flyover Pillar 42', morningPickupTime: '07:32 AM', eveningDropTime: '03:48 PM', sequence: 4, status: 'active' },
      { id: 'stp-03-5', routeId: 'rt-03', stopName: 'Campus Gate 3', areaLandmark: 'Senior School Bus Bay', morningPickupTime: '07:45 AM', eveningDropTime: '03:15 PM', sequence: 5, status: 'active' }
    ]
  },
  {
    id: 'rt-04',
    routeCode: 'Route 4',
    routeName: 'Civil Lines & Old Railway Station',
    startPoint: 'Civil Lines Fountain Chowk',
    endPoint: 'Campus Gate 3',
    assignedVehicleId: 'veh-04',
    assignedVehicleNo: 'DL-01-TA-7741',
    driverName: 'Mr. Satish Kumar',
    driverPhone: '+91 98118 77634',
    conductorName: 'Deepak Verma',
    capacity: 45,
    assignedStudentsCount: 32,
    morningDeparture: '06:40 AM',
    eveningArrival: '04:25 PM',
    status: 'Active',
    operatingDays: 'Monday – Friday',
    stops: [
      { id: 'stp-04-1', routeId: 'rt-04', stopName: 'Civil Lines Fountain', areaLandmark: 'Officers Mess Circle', morningPickupTime: '06:40 AM', eveningDropTime: '04:25 PM', sequence: 1, status: 'active' },
      { id: 'stp-04-2', routeId: 'rt-04', stopName: 'Court Complex Gate', areaLandmark: 'Judicial Complex Red Light', morningPickupTime: '06:55 AM', eveningDropTime: '04:10 PM', sequence: 2, status: 'active' },
      { id: 'stp-04-3', routeId: 'rt-04', stopName: 'Railway Colony Entry', areaLandmark: 'Platform 1 Footbridge', morningPickupTime: '07:10 AM', eveningDropTime: '03:55 PM', sequence: 3, status: 'active' },
      { id: 'stp-04-4', routeId: 'rt-04', stopName: 'Subhash Chowk', areaLandmark: 'Auto Stand Flyover Junction', morningPickupTime: '07:25 AM', eveningDropTime: '03:40 PM', sequence: 4, status: 'active' },
      { id: 'stp-04-5', routeId: 'rt-04', stopName: 'Campus Gate 3', areaLandmark: 'Senior School Bus Bay', morningPickupTime: '07:45 AM', eveningDropTime: '03:15 PM', sequence: 5, status: 'active' }
    ]
  },
  {
    id: 'rt-05',
    routeCode: 'Route 5',
    routeName: 'Palam Vihar & Sector 23 A-Block',
    startPoint: 'Palam Vihar Plaza',
    endPoint: 'Campus Gate 3',
    assignedVehicleId: 'veh-05',
    assignedVehicleNo: 'DL-01-TA-8820',
    driverName: 'Mr. Gurpreet Sandhu',
    driverPhone: '+91 98119 12399',
    conductorName: 'Mukesh Sharma',
    capacity: 40,
    assignedStudentsCount: 39,
    morningDeparture: '06:35 AM',
    eveningArrival: '04:30 PM',
    status: 'Active',
    operatingDays: 'Monday – Friday',
    stops: [
      { id: 'stp-05-1', routeId: 'rt-05', stopName: 'Palam Vihar Plaza', areaLandmark: 'Block C Community Market', morningPickupTime: '06:35 AM', eveningDropTime: '04:30 PM', sequence: 1, status: 'active' },
      { id: 'stp-05-2', routeId: 'rt-05', stopName: 'Sector 23 Market', areaLandmark: 'Near Post Office', morningPickupTime: '06:50 AM', eveningDropTime: '04:15 PM', sequence: 2, status: 'active' },
      { id: 'stp-05-3', routeId: 'rt-05', stopName: 'Ansal Galleria', areaLandmark: 'Rotary Club Crossing', morningPickupTime: '07:08 AM', eveningDropTime: '03:57 PM', sequence: 3, status: 'active' },
      { id: 'stp-05-4', routeId: 'rt-05', stopName: 'Carterpuri Flyover', areaLandmark: 'Cantonment Checkpoint', morningPickupTime: '07:22 AM', eveningDropTime: '03:43 PM', sequence: 4, status: 'active' },
      { id: 'stp-05-5', routeId: 'rt-05', stopName: 'Campus Gate 3', areaLandmark: 'Senior School Bus Bay', morningPickupTime: '07:45 AM', eveningDropTime: '03:15 PM', sequence: 5, status: 'active' }
    ]
  }
];

export const INITIAL_TRANSPORT_ASSIGNMENTS: StudentTransportAssignment[] = [
  {
    id: 'tra-01',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    admissionNo: 'GIS-2023-0101',
    standard: 8,
    section: 'A',
    routeId: 'rt-01',
    routeCode: 'Route 1',
    pickupStopId: 'stp-01-4',
    pickupStopName: 'Green Glen Society',
    dropStopId: 'stp-01-4',
    dropStopName: 'Green Glen Society',
    guardianName: 'Dr. Rajesh Sharma',
    guardianPhone: '+91 98765 43210',
    effectiveFrom: '2026-04-01',
    status: 'active',
    annualFeePaid: true
  },
  {
    id: 'tra-02',
    studentId: 'stu-102',
    studentName: 'Ananya Sharma',
    admissionNo: 'GIS-2023-0102',
    standard: 5,
    section: 'B',
    routeId: 'rt-01',
    routeCode: 'Route 1',
    pickupStopId: 'stp-01-4',
    pickupStopName: 'Green Glen Society',
    dropStopId: 'stp-01-4',
    dropStopName: 'Green Glen Society',
    guardianName: 'Dr. Rajesh Sharma',
    guardianPhone: '+91 98765 43210',
    effectiveFrom: '2026-04-01',
    status: 'active',
    annualFeePaid: true
  },
  {
    id: 'tra-03',
    studentId: 'stu-103',
    studentName: 'Rohan Deshmukh',
    admissionNo: 'GIS-2023-0103',
    standard: 8,
    section: 'A',
    routeId: 'rt-02',
    routeCode: 'Route 2',
    pickupStopId: 'stp-02-1',
    pickupStopName: 'Nirvana Square Clock Tower',
    dropStopId: 'stp-02-1',
    dropStopName: 'Nirvana Square Clock Tower',
    guardianName: 'Sanjay Deshmukh',
    guardianPhone: '+91 98220 11223',
    effectiveFrom: '2026-04-01',
    status: 'active',
    annualFeePaid: true
  },
  {
    id: 'tra-04',
    studentId: 'stu-104',
    studentName: 'Meera Iyer',
    admissionNo: 'GIS-2023-0104',
    standard: 8,
    section: 'A',
    routeId: 'rt-03',
    routeCode: 'Route 3',
    pickupStopId: 'stp-03-2',
    pickupStopName: 'Vatika City Market',
    dropStopId: 'stp-03-2',
    dropStopName: 'Vatika City Market',
    guardianName: 'K. V. Iyer',
    guardianPhone: '+91 98401 55667',
    effectiveFrom: '2026-04-01',
    status: 'active',
    annualFeePaid: true
  },
  {
    id: 'tra-05',
    studentId: 'stu-106',
    studentName: 'Dia Fernandez',
    admissionNo: 'GIS-2023-0106',
    standard: 8,
    section: 'A',
    routeId: 'rt-04',
    routeCode: 'Route 4',
    pickupStopId: 'stp-04-1',
    pickupStopName: 'Civil Lines Fountain',
    dropStopId: 'stp-04-1',
    dropStopName: 'Civil Lines Fountain',
    guardianName: 'Carlos Fernandez',
    guardianPhone: '+91 98118 99882',
    effectiveFrom: '2026-04-01',
    status: 'active',
    annualFeePaid: true
  },
  {
    id: 'tra-06',
    studentId: 'stu-107',
    studentName: 'Aditya Singhania',
    admissionNo: 'GIS-2023-0107',
    standard: 8,
    section: 'A',
    routeId: 'rt-05',
    routeCode: 'Route 5',
    pickupStopId: 'stp-05-1',
    pickupStopName: 'Palam Vihar Plaza',
    dropStopId: 'stp-05-1',
    dropStopName: 'Palam Vihar Plaza',
    guardianName: 'Vikram Singhania',
    guardianPhone: '+91 98110 33445',
    effectiveFrom: '2026-04-01',
    status: 'active',
    annualFeePaid: true
  }
];

export const INITIAL_VEHICLE_MAINTENANCE: VehicleMaintenanceRecord[] = [
  {
    id: 'maint-01',
    maintenanceNo: 'MNT-2026-088',
    vehicleId: 'veh-06',
    vehicleNo: 'DL-01-TA-9104',
    maintenanceType: 'Brake & Tire Overhaul',
    serviceDate: '2026-10-14',
    nextDueDate: '2027-04-14',
    serviceCenter: 'Autoriders Commercial Service Depot, Sector 18',
    cost: 24500,
    status: 'In Progress',
    odometerReading: 48200,
    workDescription: 'Front disc pad replacement, brake drum resurfacing, pneumatic hose inspection, and 2 rear tire rotation.',
    technicianNotes: 'Parts received from Force Motors authorized distributor.',
    authorizedBy: 'Mr. S. K. Nair (Transport Manager)'
  },
  {
    id: 'maint-02',
    maintenanceNo: 'MNT-2026-082',
    vehicleId: 'veh-01',
    vehicleNo: 'DL-01-TA-4820',
    maintenanceType: 'Routine 10,000 km Service',
    serviceDate: '2026-09-15',
    nextDueDate: '2027-03-15',
    serviceCenter: 'Tata Motors Authorized Commercial Workshop',
    cost: 16800,
    status: 'Completed',
    odometerReading: 51200,
    workDescription: 'Engine oil flush (15W-40), primary & secondary diesel filter replacement, coolant top-up, battery health diagnosis.',
    technicianNotes: 'Engine health 96%. All 4 battery cells at 12.8V.',
    authorizedBy: 'Mr. S. K. Nair (Transport Manager)'
  },
  {
    id: 'maint-03',
    maintenanceNo: 'MNT-2026-079',
    vehicleId: 'veh-04',
    vehicleNo: 'DL-01-TA-7741',
    maintenanceType: 'Annual Fitness Inspection',
    serviceDate: '2026-10-02',
    nextDueDate: '2027-10-02',
    serviceCenter: 'Government RTO Inspection Station & Fitness Track',
    cost: 8500,
    status: 'Completed',
    odometerReading: 32400,
    workDescription: 'Full RTO compliance fitness testing: smoke emission analyzer, headlamp alignment, emergency door buzzer, speed limiter test.',
    technicianNotes: 'RTO fitness certificate passed for 12 months.',
    authorizedBy: 'Mr. S. K. Nair (Transport Manager)'
  }
];

export const INITIAL_TRANSPORT_INCIDENTS: TransportIncident[] = [
  {
    id: 'inc-01',
    incidentRef: 'INC-TR-2026-014',
    dateTime: '2026-10-16 08:35 AM',
    routeCode: 'Route 1',
    vehicleNo: 'DL-01-TA-4820',
    category: 'Traffic Delay',
    description: 'Cyber Hub flyover undergoing emergency lane resurfacing by municipal corporation. Morning bus stuck in heavy crawl.',
    delayMinutes: 22,
    status: 'Resolved',
    actionTakenNotes: 'Driver contacted School Receptionist at 08:32 AM. Gate movement pass #GP-2026-101 issued to 38 commuter students to waive morning late-slip penalties.',
    reportedBy: 'Mr. Ramesh Chand (Driver)',
    affectedStudentsCount: 38
  },
  {
    id: 'inc-02',
    incidentRef: 'INC-TR-2026-012',
    dateTime: '2026-10-08 07:15 AM',
    routeCode: 'Route 3',
    vehicleNo: 'DL-01-TA-6029',
    category: 'Minor Tire Puncture',
    description: 'Rear left tire puncture near Badshahpur Cross stop. Vehicle pulled over safely to shoulder.',
    delayMinutes: 15,
    status: 'Resolved',
    actionTakenNotes: 'Conductor and driver replaced with onboard spare stepney in 12 minutes. Relief bus stood by on radio. Students reached campus at 08:05 AM safely.',
    reportedBy: 'Mr. Dharamvir Yadav (Driver)',
    affectedStudentsCount: 35
  }
];

export const INITIAL_TRANSPORT_ANNOUNCEMENTS: TransportAnnouncement[] = [
  {
    id: 'tbr-01',
    broadcastNo: 'TR-BC-2026-09',
    title: 'Advisory: Sector 14 Flyover Morning Lane Closure',
    message: 'Due to municipal road repairs on the Cyber Hub elevated loop, Route 1 bus is expected to operate on a 15-minute diversion via Mehrauli Road tomorrow morning. Pickup times remain unchanged.',
    targetAudience: 'specific_route',
    targetRouteCode: 'Route 1',
    publishDate: '2026-10-16',
    priority: 'high',
    status: 'published',
    createdBy: 'Mr. S. K. Nair (Transport Manager)'
  },
  {
    id: 'tbr-02',
    broadcastNo: 'TR-BC-2026-08',
    title: 'Autumn Fog Safety Speed Protocol in Effect',
    message: 'Starting Monday, all Greenfield school buses will adhere to mandatory 35 km/h fog safety speed limits with fog lamps and yellow flasher beacons active on morning routes.',
    targetAudience: 'all_routes',
    publishDate: '2026-10-10',
    priority: 'normal',
    status: 'published',
    createdBy: 'Mr. S. K. Nair (Transport Manager)'
  }
];

// ==========================================
// FRONT OFFICE / RECEPTION INITIAL DATASETS
// ==========================================

export const INITIAL_RECEPTION_APPOINTMENTS: ReceptionAppointment[] = [
  {
    id: 'apt-01',
    appointmentNo: 'APT-2026-101',
    visitorName: 'Mrs. Sunita Roy',
    visitorPhone: '+91 98440 22331',
    visitorCategory: 'Parent / Guardian',
    staffId: 'tch-01',
    staffName: 'Mrs. Shalini Verma',
    department: 'Senior Academic Faculty',
    purpose: 'Parent-Teacher Interaction regarding Term Marks',
    date: '2026-10-14',
    startTime: '09:00 AM',
    endTime: '09:30 AM',
    status: 'completed',
    notes: 'Discussion on Mathematics Term 1 performance. Satisfactory discussion.',
    linkedVisitorPass: 'VP-2026-101',
    createdAt: '2026-10-12 11:30 AM',
    createdBy: 'Ms. Clara Martinez'
  },
  {
    id: 'apt-02',
    appointmentNo: 'APT-2026-102',
    visitorName: 'Mr. Rajesh Mehra',
    visitorPhone: '+91 98221 88990',
    visitorCategory: 'Prospective Parent',
    organization: 'Fintech Solutions Ltd',
    staffId: 'tch-01',
    staffName: 'Mrs. Shalini Verma',
    department: 'Admissions Office',
    purpose: 'Enquiry for Standard 6 Admission & Campus Tour',
    date: '2026-10-14',
    startTime: '09:45 AM',
    endTime: '10:30 AM',
    status: 'checked_in',
    notes: 'Father of candidate Rohan Mehra. Touring science labs and sports complex.',
    linkedVisitorPass: 'VP-2026-102',
    createdAt: '2026-10-13 02:15 PM',
    createdBy: 'Ms. Clara Martinez'
  },
  {
    id: 'apt-03',
    appointmentNo: 'APT-2026-103',
    visitorName: 'Dr. Ashok Bansal',
    visitorPhone: '+91 98110 55443',
    visitorCategory: 'Guest / Speaker',
    organization: 'City Medical Council',
    staffId: 'admin-01',
    staffName: 'Dr. Evelyn Montgomery',
    department: 'Principal Secretariat',
    purpose: 'Annual Health & Eye Checkup Coordination Meeting',
    date: '2026-10-14',
    startTime: '10:15 AM',
    endTime: '11:00 AM',
    status: 'checked_in',
    notes: 'Campus health camp schedule finalize for November 2026.',
    linkedVisitorPass: 'VP-2026-103',
    createdAt: '2026-10-11 04:00 PM',
    createdBy: 'Ms. Clara Martinez'
  },
  {
    id: 'apt-04',
    appointmentNo: 'APT-2026-104',
    visitorName: 'Mrs. Anita Kulkarni',
    visitorPhone: '+91 98204 11223',
    visitorCategory: 'Parent / Guardian',
    staffId: 'tch-02',
    staffName: 'Mr. Rajesh Sharma',
    department: 'Science & Physics Dept',
    purpose: 'Science Olympiad Preparation & Lab Mentorship',
    date: '2026-10-14',
    startTime: '11:30 AM',
    endTime: '12:00 PM',
    status: 'scheduled',
    notes: 'Parent requesting special lab access hours for national science competition.',
    createdAt: '2026-10-13 09:30 AM',
    createdBy: 'Ms. Clara Martinez'
  },
  {
    id: 'apt-05',
    appointmentNo: 'APT-2026-105',
    visitorName: 'Mr. Vikramaditya Rathore',
    visitorPhone: '+91 99880 44332',
    visitorCategory: 'Prospective Parent',
    staffId: 'vp-01',
    staffName: 'Mr. Robert Sterling',
    department: 'Vice Principal Office',
    purpose: 'High School Sports Scholarship & Boarding Inquiry',
    date: '2026-10-14',
    startTime: '02:00 PM',
    endTime: '02:45 PM',
    status: 'scheduled',
    notes: 'Candidate is state-level badminton champion seeking Std 9 admission.',
    createdAt: '2026-10-14 08:30 AM',
    createdBy: 'Ms. Clara Martinez'
  },
  {
    id: 'apt-06',
    appointmentNo: 'APT-2026-106',
    visitorName: 'Mrs. Deepa Saxena',
    visitorPhone: '+91 98118 77665',
    visitorCategory: 'Parent / Guardian',
    staffId: 'tch-01',
    staffName: 'Mrs. Shalini Verma',
    department: 'Senior Academic Faculty',
    purpose: 'Standard 8 Attendance & Leave Discrepancy Discussion',
    date: '2026-10-15',
    startTime: '10:00 AM',
    endTime: '10:30 AM',
    status: 'scheduled',
    notes: 'Requested slot to review student attendance certificate for travel grant.',
    createdAt: '2026-10-14 10:00 AM',
    createdBy: 'Ms. Clara Martinez'
  }
];

export const INITIAL_PHONE_CALL_LOGS: PhoneCallLog[] = [
  {
    id: 'cal-01',
    callNo: 'CAL-2026-089',
    dateTime: '2026-10-14 08:20 AM',
    date: '2026-10-14',
    type: 'incoming',
    callerName: 'Mrs. Anita Kulkarni',
    callerPhone: '+91 98204 11223',
    callerCategory: 'Parent',
    relatedStudentName: 'Aarav Sharma',
    relatedStudentId: 'std-01',
    purpose: 'Bus Route 1 Delay Inquiry',
    summary: 'Inquired about Route 1 bus running 10 mins late due to rain diversion near Cyber City. Reassured parent that driver notified dispatch and students are safe.',
    assignedStaff: 'Transport Desk',
    followUpRequired: false,
    status: 'resolved',
    recordedBy: 'Ms. Clara Martinez'
  },
  {
    id: 'cal-02',
    callNo: 'CAL-2026-090',
    dateTime: '2026-10-14 09:10 AM',
    date: '2026-10-14',
    type: 'incoming',
    callerName: 'Mr. S. Ramanathan Iyer',
    callerPhone: '+91 98711 00293',
    callerCategory: 'Prospective Parent',
    purpose: 'Std 11 Science Stream Cutoff & Labs',
    summary: 'Inquired about eligibility cutoff marks for CBSE Class 11 Science stream. Scheduled appointment tour for Oct 16 with Academic Head.',
    assignedStaff: 'Ms. Clara Martinez',
    followUpRequired: true,
    followUpDate: '2026-10-16',
    status: 'pending_followup',
    recordedBy: 'Ms. Clara Martinez'
  },
  {
    id: 'cal-03',
    callNo: 'CAL-2026-091',
    dateTime: '2026-10-14 10:05 AM',
    date: '2026-10-14',
    type: 'outgoing',
    callerName: 'Ms. Clara Martinez',
    callerPhone: 'Extension 102',
    callerCategory: 'Staff',
    relatedStudentName: 'Vivaan Agarwal',
    purpose: 'Follow-up on Standard 6 Prospectus & Tour',
    summary: 'Called parent Mr. Ramesh Agarwal regarding campus visit and document verification. Confirmed scheduled visit for tomorrow at 10 AM.',
    assignedStaff: 'Ms. Clara Martinez',
    followUpRequired: true,
    followUpDate: '2026-10-15',
    status: 'pending_followup',
    recordedBy: 'Ms. Clara Martinez'
  },
  {
    id: 'cal-04',
    callNo: 'CAL-2026-088',
    dateTime: '2026-10-13 03:40 PM',
    date: '2026-10-13',
    type: 'incoming',
    callerName: 'Dr. Ashok Bansal',
    callerPhone: '+91 98110 55443',
    callerCategory: 'General',
    purpose: 'Confirm Principal Appointment',
    summary: 'Confirmed arrival at 10:15 AM today for Annual Medical Checkup Camp coordination meeting.',
    assignedStaff: 'Principal Secretariat',
    followUpRequired: false,
    status: 'resolved',
    recordedBy: 'Ms. Clara Martinez'
  }
];

export const INITIAL_RECEPTION_REQUESTS: ReceptionRequest[] = [
  {
    id: 'req-01',
    ticketNo: 'REQ-2026-042',
    date: '2026-10-14',
    category: 'Teacher Meeting',
    requesterName: 'Mrs. Meenakshi Joshi',
    requesterPhone: '+91 98220 33411',
    requesterRole: 'Parent',
    studentReference: 'Std 8-A · Ananya Sharma',
    summary: 'Request 15-minute slot with Science Teacher',
    description: 'Parent requests a short meeting to discuss daughter physics practical project guidance before mid-terms.',
    assignedDepartment: 'Academic',
    assignedStaff: 'Mr. Rajesh Sharma',
    priority: 'medium',
    status: 'Assigned',
    resolutionNotes: 'Slot proposed for Thursday 02:30 PM in Staff Room 102.'
  },
  {
    id: 'req-02',
    ticketNo: 'REQ-2026-043',
    date: '2026-10-14',
    category: 'Lost & Found',
    requesterName: 'Master Kabir Khanna',
    requesterPhone: '+91 98111 22334',
    requesterRole: 'Student',
    studentReference: 'Std 7-B · Roll 14',
    summary: 'Lost Blue Parker Fountain Pen in Library Corridor',
    description: 'Reported missing during 3rd period library transition. Engraved with initials K.K.',
    assignedDepartment: 'Front Office',
    priority: 'low',
    status: 'In Progress',
    resolutionNotes: 'Security desk checking reception lost & found box and CCTV corridor entry.'
  },
  {
    id: 'req-03',
    ticketNo: 'REQ-2026-041',
    date: '2026-10-13',
    category: 'Parent Complaint',
    requesterName: 'Mr. Sanjay Singhania',
    requesterPhone: '+91 98440 99887',
    requesterRole: 'Parent',
    studentReference: 'Std 9-A · Rohan Singhania',
    summary: 'Bus Route 2 Evening Drop Delay Concern',
    description: 'Parent noted evening drop was delayed by 25 mins on Monday without real-time broadcast message to guardians.',
    assignedDepartment: 'Transport',
    assignedStaff: 'Mr. S. K. Nair',
    priority: 'high',
    status: 'Waiting Response',
    resolutionNotes: 'Referred to Transport Manager for route log audit. Driver experienced route diversion.'
  },
  {
    id: 'req-04',
    ticketNo: 'REQ-2026-040',
    date: '2026-10-12',
    category: 'Document Enquiry',
    requesterName: 'Mrs. Shalini Gupta',
    requesterPhone: '+91 98332 55667',
    requesterRole: 'Parent',
    studentReference: 'Std 6-A · Vihaan Gupta',
    summary: 'Inquiry on Bonafide Certificate Processing Time',
    description: 'Informed parent that standard turnaround is 2 working days after administrative signoff.',
    assignedDepartment: 'Administration',
    priority: 'low',
    status: 'Resolved',
    resolutionNotes: 'Certificate submitted to administration office and completed.',
    resolvedAt: '2026-10-13 11:30 AM'
  }
];

export const INITIAL_DOCUMENT_REQUESTS: FrontOfficeDocumentRequest[] = [
  {
    id: 'doc-01',
    requestNo: 'DOC-2026-015',
    requesterName: 'Mr. Arvind Roy',
    requesterPhone: '+91 98440 22331',
    studentId: 'std-01',
    studentName: 'Aarav Sharma',
    standard: 8,
    section: 'A',
    documentType: 'Bonafide Certificate',
    requestDate: '2026-10-14',
    assignedDepartment: 'Administration Office',
    status: 'Under Review',
    followUpDate: '2026-10-16',
    purposeRemarks: 'Required for passport renewal application with Regional Passport Office.'
  },
  {
    id: 'doc-02',
    requestNo: 'DOC-2026-016',
    requesterName: 'Mrs. Sunita Narang',
    requesterPhone: '+91 98993 11200',
    studentId: 'std-02',
    studentName: 'Ananya Narang',
    standard: 8,
    section: 'A',
    documentType: 'Fee Receipt Copy',
    requestDate: '2026-10-14',
    assignedDepartment: 'Accounts Dept',
    status: 'Ready for Collection',
    followUpDate: '2026-10-15',
    purposeRemarks: 'Duplicate stamped receipt of Term 1 Composite Fee for corporate reimbursement.'
  },
  {
    id: 'doc-03',
    requestNo: 'DOC-2026-012',
    requesterName: 'Col. V.S. Chauhan',
    requesterPhone: '+91 94191 22334',
    studentId: 'std-03',
    studentName: 'Samarjeet Chauhan',
    standard: 9,
    section: 'A',
    documentType: 'Study Certificate',
    requestDate: '2026-10-10',
    assignedDepartment: 'Administration Office',
    status: 'Completed',
    purposeRemarks: 'Defense Education Allowance reimbursement certification.',
    resolutionNotes: 'Handed over to Col. Chauhan on Oct 12 with Principal signature.'
  },
  {
    id: 'doc-04',
    requestNo: 'DOC-2026-014',
    requesterName: 'Mr. Harish Chandra',
    requesterPhone: '+91 98765 43210',
    studentId: 'std-04',
    studentName: 'Diya Chandra',
    standard: 6,
    section: 'B',
    documentType: 'Transfer Certificate Enquiry',
    requestDate: '2026-10-13',
    assignedDepartment: 'Administration Office',
    status: 'Referred to Department',
    followUpDate: '2026-10-17',
    purposeRemarks: 'Prospective transfer to Pune branch in December 2026 due to parent job relocation.'
  }
];



