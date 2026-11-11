import React, { useState, useMemo } from 'react';
import {
  Library,
  BookOpen,
  Search,
  Plus,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  DollarSign,
  ArrowRightLeft,
  Barcode,
  Layers,
  Bookmark,
  Printer,
  Download,
  Clock,
  ShieldCheck,
  Eye,
  Edit,
  Trash2,
  Filter,
  Building2,
  Receipt,
  User,
  Check,
  X,
  FileText,
  AlertTriangle,
  TrendingUp,
  Tag
} from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { LibraryBook, LibraryBookCopy, BookIssue, BookReservation, LostDamagedBookRecord, Student, Teacher } from '../../../types/school';
import { getThemeClasses } from '../../../utils/themeHelper';
import { StudentProfileModal } from '../../common/StudentProfileModal';
import { StaffProfileModal } from '../../common/StaffProfileModal';

export const LibrarianView: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    themeColor,
    books,
    bookCopies,
    bookIssues,
    bookReservations,
    lostDamagedBooks,
    libraryTransactions,
    students,
    teachers,
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
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Search & Filter States
  const [catalogueSearch, setCatalogueSearch] = useState('');
  const [catalogueCategory, setCatalogueCategory] = useState('all');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryStatus, setInventoryStatus] = useState('all');
  const [loanSearch, setLoanSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');

  // Modals & Drawers
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState<LibraryBook | null>(null);
  const [detailBook, setDetailBook] = useState<LibraryBook | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showLostDamagedModal, setShowLostDamagedModal] = useState(false);
  const [showAddCopyModal, setShowAddCopyModal] = useState<LibraryBook | null>(null);

  // Member dossier modals
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [viewingStaff, setViewingStaff] = useState<Teacher | null>(null);

  // Return Desk State
  const [returnSearchTerm, setReturnSearchTerm] = useState('');
  const [selectedReturnIssue, setSelectedReturnIssue] = useState<BookIssue | null>(null);
  const [returnCondition, setReturnCondition] = useState('Good');
  const [manualFineOverride, setManualFineOverride] = useState<number | ''>('');

  // Add / Edit Book Form State
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    category: 'Science & Cosmology',
    isbn: '978-0123456789',
    publisher: 'Academic Press Ltd.',
    publicationYear: 2024,
    edition: '1st Edition',
    language: 'English',
    locationRack: 'Shelf S-04',
    totalCopies: 4,
    description: ''
  });

  // Add Physical Copy Form State
  const [newCopyForm, setNewCopyForm] = useState({
    shelfRack: 'Shelf S-04',
    condition: 'Mint' as LibraryBookCopy['condition']
  });

  // Issue Book Form State
  const [issueForm, setIssueForm] = useState({
    bookId: books[0]?.id || '',
    selectedBarcode: '',
    memberRole: 'Student' as 'Student' | 'Teacher',
    memberId: students[0]?.id || '',
    borrowDays: 14,
    notes: 'Regular academic loan'
  });

  // Reservation Form State
  const [resForm, setResForm] = useState({
    bookId: books[0]?.id || '',
    memberRole: 'Student' as 'Student' | 'Teacher',
    memberId: students[0]?.id || '',
    notes: 'Requested for exam preparation'
  });

  // Lost / Damaged Form State
  const [incidentForm, setIncidentForm] = useState({
    bookCopyId: bookCopies[0]?.id || '',
    recordedBy: "Mr. Samuel O'Connor (Librarian)",
    memberId: students[0]?.id || '',
    type: 'Lost' as LostDamagedBookRecord['type'],
    cost: 350,
    description: 'Book reported misplaced during term break'
  });

  // Helper title lookup
  const getBookTitleForCopy = (copy: LibraryBookCopy): string => {
    const b = books.find(item => item.id === copy.bookId || item.bookId === copy.bookId);
    return b?.title || 'Library Asset';
  };

  // Calculated Metrics
  const totalCatalogueTitles = books.length;
  const totalPhysicalCopies = bookCopies.length;
  const availableCopiesCount = bookCopies.filter(c => c.status === 'Available').length;
  const activeLoansList = bookIssues.filter(i => i.status === 'borrowed' || i.status === 'overdue');
  const activeLoansCount = activeLoansList.length;
  const overdueLoansList = bookIssues.filter(i => {
    if (i.status === 'returned') return false;
    const due = new Date(i.dueDate).getTime();
    return due < new Date().setHours(0, 0, 0, 0);
  });
  const overdueCount = overdueLoansList.length;
  const lostDamagedCount = lostDamagedBooks.length;
  const totalFinesAccumulated = bookIssues.reduce((acc, i) => acc + (i.fineAmount || 0), 0);

  // Available categories
  const categoriesList = useMemo(() => {
    const map = new Map<string, { titles: number; copies: number; available: number }>();
    books.forEach(b => {
      const prev = map.get(b.category) || { titles: 0, copies: 0, available: 0 };
      const copiesOfBook = bookCopies.filter(c => c.bookId === b.id || c.bookId === b.bookId);
      const availOfBook = copiesOfBook.filter(c => c.status === 'Available').length;
      map.set(b.category, {
        titles: prev.titles + 1,
        copies: prev.copies + (copiesOfBook.length || b.totalCopies),
        available: prev.available + availOfBook
      });
    });
    return Array.from(map.entries()).map(([category, stats]) => ({ category, ...stats }));
  }, [books, bookCopies]);

  // Authors & Publishers
  const authorsList = useMemo(() => {
    const map = new Map<string, { booksCount: number; titles: string[]; publisher: string }>();
    books.forEach(b => {
      const prev = map.get(b.author) || { booksCount: 0, titles: [], publisher: b.publisher || 'Independent' };
      map.set(b.author, {
        booksCount: prev.booksCount + 1,
        titles: [...prev.titles, b.title],
        publisher: b.publisher || prev.publisher
      });
    });
    return Array.from(map.entries()).map(([author, data]) => ({ author, ...data }));
  }, [books]);

  // Filtered Catalogue
  const filteredBooks = books.filter(b => {
    const matchesSearch =
      b.title.toLowerCase().includes(catalogueSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(catalogueSearch.toLowerCase()) ||
      b.isbn.includes(catalogueSearch) ||
      b.bookId.toLowerCase().includes(catalogueSearch.toLowerCase());
    const matchesCategory = catalogueCategory === 'all' || b.category === catalogueCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered Inventory Copies
  const filteredCopies = bookCopies.filter(c => {
    const title = getBookTitleForCopy(c).toLowerCase();
    const matchesSearch =
      c.barcode.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      title.includes(inventorySearch.toLowerCase()) ||
      c.shelfRack.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesStatus = inventoryStatus === 'all' || c.status === inventoryStatus;
    return matchesSearch && matchesStatus;
  });

  // Filtered Loans
  const filteredLoans = activeLoansList.filter(l => {
    return (
      l.bookTitle.toLowerCase().includes(loanSearch.toLowerCase()) ||
      l.memberName.toLowerCase().includes(loanSearch.toLowerCase()) ||
      l.bookId.toLowerCase().includes(loanSearch.toLowerCase()) ||
      (l.copyBarcode && l.copyBarcode.toLowerCase().includes(loanSearch.toLowerCase())) ||
      (l.issueNo && l.issueNo.toLowerCase().includes(loanSearch.toLowerCase()))
    );
  });

  // Helper for overdue days calculation
  const getDaysOverdue = (dueDateStr: string): number => {
    const due = new Date(dueDateStr).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    const diffTime = today - due;
    if (diffTime <= 0) return 0;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Handle Book Form Submit (Add or Edit)
  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title.trim() || !bookForm.author.trim()) {
      showToast('Please fill in title and author name.', 'error');
      return;
    }

    if (editingBook) {
      updateBook(editingBook.id, {
        title: bookForm.title,
        author: bookForm.author,
        category: bookForm.category,
        isbn: bookForm.isbn,
        publisher: bookForm.publisher,
        publicationYear: Number(bookForm.publicationYear),
        edition: bookForm.edition,
        language: bookForm.language,
        locationRack: bookForm.locationRack,
        description: bookForm.description
      });
      showToast(`Updated '${bookForm.title}' in library catalogue.`, 'success');
      setEditingBook(null);
    } else {
      addBook({
        bookId: `GIS-LIB-${String(books.length + 801).padStart(4, '0')}`,
        title: bookForm.title,
        author: bookForm.author,
        category: bookForm.category,
        isbn: bookForm.isbn,
        totalCopies: Number(bookForm.totalCopies),
        availableCopies: Number(bookForm.totalCopies),
        locationRack: bookForm.locationRack,
        publisher: bookForm.publisher,
        publicationYear: Number(bookForm.publicationYear),
        edition: bookForm.edition,
        language: bookForm.language,
        description: bookForm.description,
        status: 'active'
      });
      showToast(`Added '${bookForm.title}' with ${bookForm.totalCopies} physical barcode copies.`, 'success');
      setShowAddBookModal(false);
    }
  };

  // Open Edit Book modal
  const openEditBook = (b: LibraryBook) => {
    setEditingBook(b);
    setBookForm({
      title: b.title,
      author: b.author,
      category: b.category,
      isbn: b.isbn,
      publisher: b.publisher || 'Academic Press',
      publicationYear: b.publicationYear || 2024,
      edition: b.edition || '1st Edition',
      language: b.language || 'English',
      locationRack: b.locationRack,
      totalCopies: b.totalCopies,
      description: b.description || ''
    });
  };

  // Handle Add Physical Copy Submit
  const handleAddCopySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddCopyModal) return;
    const copiesForThisBook = bookCopies.filter(c => c.bookId === showAddCopyModal.id || c.bookId === showAddCopyModal.bookId);
    const nextCopyNumber = copiesForThisBook.length + 1;
    const barcode = `BC-${showAddCopyModal.bookId.replace('GIS-LIB-', '').replace('bk-', '')}-${String(nextCopyNumber).padStart(2, '0')}`;

    addBookCopy({
      bookId: showAddCopyModal.id,
      barcode,
      shelfRack: newCopyForm.shelfRack || showAddCopyModal.locationRack,
      status: 'Available',
      condition: newCopyForm.condition,
      acquisitionDate: new Date().toISOString().split('T')[0]
    });

    showToast(`Registered new physical copy ${barcode} for '${showAddCopyModal.title}'.`, 'success');
    setShowAddCopyModal(null);
  };

  // Handle Fast Checkout / Issue Book
  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBook = books.find(b => b.id === issueForm.bookId);
    if (!targetBook) {
      showToast('Selected book could not be found.', 'error');
      return;
    }

    // Check borrower limits
    const memberLoans = bookIssues.filter(
      i => i.memberId === issueForm.memberId && (i.status === 'borrowed' || i.status === 'overdue')
    );
    const maxAllowed = issueForm.memberRole === 'Student' ? 3 : 6;
    if (memberLoans.length >= maxAllowed) {
      showToast(
        `Borrowing limit exceeded! ${issueForm.memberRole} has reached max limit of ${maxAllowed} active loans.`,
        'error'
      );
      return;
    }

    // Check for overdue fines blocking borrowing
    const memberOverdue = memberLoans.some(i => i.status === 'overdue');
    if (memberOverdue) {
      showToast('Member has outstanding overdue books. Must return overdue items first.', 'error');
      return;
    }

    // Get available physical copy
    const availableCopies = bookCopies.filter(
      c => (c.bookId === targetBook.id || c.bookId === targetBook.bookId) && c.status === 'Available'
    );
    if (availableCopies.length === 0) {
      showToast('All physical copies of this title are currently on loan or reserved.', 'error');
      return;
    }

    const copyToIssue = issueForm.selectedBarcode
      ? availableCopies.find(c => c.barcode === issueForm.selectedBarcode) || availableCopies[0]
      : availableCopies[0];

    const targetMember =
      issueForm.memberRole === 'Student'
        ? students.find(s => s.id === issueForm.memberId)
        : teachers.find(t => t.id === issueForm.memberId);

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Number(issueForm.borrowDays));

    issueBook({
      bookId: targetBook.bookId,
      bookTitle: targetBook.title,
      memberId: targetMember?.id || 'm-01',
      memberName: targetMember?.name || 'Member',
      memberRole: issueForm.memberRole,
      issuedDate: issueDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      copyBarcode: copyToIssue.barcode
    });

    setShowIssueModal(false);
    showToast(`Checked out ${copyToIssue.barcode} to ${targetMember?.name}. Due: ${dueDate.toISOString().split('T')[0]}`, 'success');
  };

  // Handle Return Processing
  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturnIssue) return;

    const daysOverdue = getDaysOverdue(selectedReturnIssue.dueDate);
    const calculatedFine = daysOverdue > 0 ? daysOverdue * 5 : 0;
    const finalFine = manualFineOverride !== '' ? Number(manualFineOverride) : calculatedFine;

    returnBook(selectedReturnIssue.id, returnCondition, finalFine);

    showToast(
      `Check-in complete for ${selectedReturnIssue.bookTitle}. Condition: ${returnCondition}. Fine: ₹${finalFine}`,
      'success'
    );
    setSelectedReturnIssue(null);
    setReturnCondition('Good');
    setManualFineOverride('');
  };

  // Handle Reservation Submit
  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBook = books.find(b => b.id === resForm.bookId);
    if (!targetBook) return;

    const targetMember =
      resForm.memberRole === 'Student'
        ? students.find(s => s.id === resForm.memberId)
        : teachers.find(t => t.id === resForm.memberId);

    const existingRes = bookReservations.filter(
      r => (r.bookId === targetBook.id || r.bookId === targetBook.bookId) && r.status === 'active'
    );
    const queuePos = existingRes.length + 1;

    createReservation({
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      memberId: targetMember?.id || 'm-01',
      memberName: targetMember?.name || 'Member',
      memberRole: resForm.memberRole,
      reservationDate: new Date().toISOString().split('T')[0],
      queuePosition: queuePos,
      status: 'active',
      notes: resForm.notes
    });

    setShowReservationModal(false);
    showToast(`Reservation queued for '${targetBook.title}' (Position #${queuePos}).`, 'success');
  };

  // Handle Lost / Damaged Submit
  const handleLostDamagedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCopy = bookCopies.find(c => c.id === incidentForm.bookCopyId);
    if (!targetCopy) return;

    const targetMember = students.find(s => s.id === incidentForm.memberId) || teachers.find(t => t.id === incidentForm.memberId);
    const bookTitle = getBookTitleForCopy(targetCopy);

    recordLostOrDamagedBook({
      bookId: targetCopy.bookId,
      copyBarcode: targetCopy.barcode,
      bookTitle,
      recordedBy: incidentForm.recordedBy,
      memberId: targetMember?.id,
      memberName: targetMember?.name,
      memberRole: students.some(s => s.id === incidentForm.memberId) ? 'Student' : 'Teacher',
      type: incidentForm.type,
      dateReported: new Date().toISOString().split('T')[0],
      assessedCost: Number(incidentForm.cost),
      fineStatus: 'pending',
      status: 'investigating',
      description: incidentForm.description
    });

    setShowLostDamagedModal(false);
    showToast(`Recorded incident ${incidentForm.type} for ${targetCopy.barcode}.`, 'success');
  };

  // Export CSV Report
  const exportCirculationReportCSV = () => {
    const headers = ['Issue No', 'Book Title', 'Accession ID', 'Barcode', 'Member Name', 'Role', 'Issued Date', 'Due Date', 'Status', 'Fine (INR)'];
    const rows = bookIssues.map(i => [
      i.issueNo || `ISS-${i.id.slice(-4)}`,
      `"${i.bookTitle}"`,
      i.bookId,
      i.copyBarcode || 'N/A',
      `"${i.memberName}"`,
      i.memberRole,
      i.issuedDate,
      i.dueDate,
      i.status.toUpperCase(),
      i.fineAmount || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SCHLAR_Library_Circulation_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Library circulation report exported successfully.', 'success');
  };

  // Open member profile
  const openMemberProfile = (role: 'Student' | 'Teacher', memberId: string, memberName: string) => {
    if (role === 'Student') {
      const std = students.find(s => s.id === memberId || s.name.toLowerCase() === memberName.toLowerCase());
      if (std) setViewingStudent(std);
      else showToast(`Student dossier for ${memberName} not found in active roll.`, 'error');
    } else {
      const tch = teachers.find(t => t.id === memberId || t.name.toLowerCase() === memberName.toLowerCase());
      if (tch) setViewingStaff(tch);
      else showToast(`Faculty record for ${memberName} not found.`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Notice Banner if Overdue loans exist */}
      {overdueCount > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">
                {overdueCount} Overdue Library Book{overdueCount > 1 ? 's' : ''} Pending Return
              </p>
              <p className="text-[11px] text-amber-700">
                Statutory fine accumulating at ₹5/day. Check the Overdue Desk to dispatch return notices.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('overdue_books')}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition shrink-0"
          >
            Review Overdue Desk
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CIRCULATION TERMINAL & DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Catalogue Titles</span>
                <Library className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">{totalCatalogueTitles} Titles</div>
              <div className="text-xs text-slate-500 mt-1">{totalPhysicalCopies} registered physical copies</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Copies On Shelf</span>
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-700 tabular-nums">{availableCopiesCount}</div>
              <div className="text-xs text-emerald-600 mt-1">Available for immediate issue</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Loans</span>
                <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-indigo-700 tabular-nums">{activeLoansCount}</div>
              <div className="text-xs text-indigo-600 mt-1">{overdueCount} marked overdue</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Fines & Incidents</span>
                <DollarSign className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">₹{totalFinesAccumulated}</div>
              <div className="text-xs text-slate-500 mt-1">{lostDamagedCount} lost/damaged records</div>
            </div>
          </div>

          {/* Quick Action Dock */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Circulation Operations Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <button
                onClick={() => setShowIssueModal(true)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition text-center group ${themeClasses.primaryBg} text-white`}
              >
                <ArrowRightLeft className="w-5 h-5 mb-1 text-white" />
                <span className="text-xs font-bold">Issue Book</span>
                <span className="text-[10px] opacity-80">New Checkout</span>
              </button>

              <button
                onClick={() => setActiveTab('return_books')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-center group text-slate-800"
              >
                <RotateCcw className="w-5 h-5 mb-1 text-emerald-600" />
                <span className="text-xs font-bold">Return Book</span>
                <span className="text-[10px] text-slate-400">Check-in Desk</span>
              </button>

              <button
                onClick={() => setShowAddBookModal(true)}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-center group text-slate-800"
              >
                <Plus className="w-5 h-5 mb-1 text-indigo-600" />
                <span className="text-xs font-bold">Add Title</span>
                <span className="text-[10px] text-slate-400">Catalogue Entry</span>
              </button>

              <button
                onClick={() => setShowReservationModal(true)}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-center group text-slate-800"
              >
                <Bookmark className="w-5 h-5 mb-1 text-amber-600" />
                <span className="text-xs font-bold">Reserve Title</span>
                <span className="text-[10px] text-slate-400">Queue Hold</span>
              </button>

              <button
                onClick={() => setShowLostDamagedModal(true)}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-center group text-slate-800"
              >
                <AlertCircle className="w-5 h-5 mb-1 text-rose-600" />
                <span className="text-xs font-bold">Log Incident</span>
                <span className="text-[10px] text-slate-400">Lost / Damaged</span>
              </button>

              <button
                onClick={exportCirculationReportCSV}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-center group text-slate-800"
              >
                <Download className="w-5 h-5 mb-1 text-slate-600" />
                <span className="text-xs font-bold">Export CSV</span>
                <span className="text-[10px] text-slate-400">Audit Manifest</span>
              </button>
            </div>
          </div>

          {/* Dual Panel: Active Borrowers & Latest Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Borrowed Books */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Current Circulation Loans</h3>
                  <p className="text-xs text-slate-500">Live active checkouts across students and faculty</p>
                </div>
                <button
                  onClick={() => setActiveTab('active_loans')}
                  className="text-xs font-semibold text-teal-700 hover:underline"
                >
                  View All ({activeLoansCount})
                </button>
              </div>

              <div className="space-y-2">
                {activeLoansList.slice(0, 5).map(issue => (
                  <div
                    key={issue.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">{issue.bookTitle}</span>
                        {issue.copyBarcode && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {issue.copyBarcode}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Borrowed by <span className="font-semibold text-slate-700">{issue.memberName}</span> ({issue.memberRole}) · Due: <span className="font-mono text-slate-600">{issue.dueDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {issue.status === 'overdue' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          Overdue
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedReturnIssue(issue);
                          setActiveTab('return_books');
                        }}
                        className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium"
                      >
                        Return
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Audit Transactions */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Circulation Activity</h3>
                  <p className="text-xs text-slate-500">Live immutable transaction register</p>
                </div>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs font-semibold text-teal-700 hover:underline"
                >
                  Full Log
                </button>
              </div>

              <div className="space-y-2">
                {libraryTransactions.slice(0, 5).map(txn => (
                  <div key={txn.id} className="p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          txn.type === 'ISSUE'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : txn.type === 'RETURN'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : txn.type === 'RESERVATION'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {txn.type}
                        </span>
                        <span className="font-semibold text-slate-900 truncate max-w-[200px]">{txn.bookTitle}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {txn.memberName} ({txn.memberRole}) · {txn.timestamp.slice(0, 16)}
                      </p>
                    </div>
                    {txn.fineAmount && txn.fineAmount > 0 ? (
                      <span className="text-[11px] font-mono font-bold text-rose-600">₹{txn.fineAmount} Fine</span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">{txn.txnNo}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ISSUE BOOKS (FAST CHECKOUT DESK) */}
      {/* ========================================================================= */}
      {activeTab === 'issue_books' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6 max-w-4xl mx-auto">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-teal-700" />
              Circulation Fast Checkout Desk
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Issue books to authorized students (max 3 books, 14 days) or faculty staff (max 6 books, 30 days).
            </p>
          </div>

          <form onSubmit={handleIssueSubmit} className="space-y-5">
            {/* Member Selection */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">1. Borrower Identification</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Borrower Type</label>
                  <select
                    value={issueForm.memberRole}
                    onChange={e => {
                      const newRole = e.target.value as 'Student' | 'Teacher';
                      setIssueForm({
                        ...issueForm,
                        memberRole: newRole,
                        memberId: newRole === 'Student' ? students[0]?.id : teachers[0]?.id,
                        borrowDays: newRole === 'Student' ? 14 : 30
                      });
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Student">Student (Limit: 3 Books / 14 Days)</option>
                    <option value="Teacher">Faculty / Staff (Limit: 6 Books / 30 Days)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Select Member Account</label>
                  <select
                    value={issueForm.memberId}
                    onChange={e => setIssueForm({ ...issueForm, memberId: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    {issueForm.memberRole === 'Student'
                      ? students.map(s => {
                          const currentLoans = bookIssues.filter(i => i.memberId === s.id && i.status !== 'returned').length;
                          return (
                            <option key={s.id} value={s.id}>
                              {s.name} (Std {s.standard}-{s.section}, Roll #{s.rollNo}) — [{currentLoans}/3 Books Borrowed]
                            </option>
                          );
                        })
                      : teachers.map(t => {
                          const currentLoans = bookIssues.filter(i => i.memberId === t.id && i.status !== 'returned').length;
                          return (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.department}, {t.empId}) — [{currentLoans}/6 Books Borrowed]
                            </option>
                          );
                        })}
                  </select>
                </div>
              </div>
            </div>

            {/* Book & Physical Barcode Copy Selection */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">2. Title & Physical Barcode Copy Selection</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Select Catalogue Title</label>
                  <select
                    value={issueForm.bookId}
                    onChange={e => {
                      const bookId = e.target.value;
                      const avail = bookCopies.filter(c => (c.bookId === bookId) && c.status === 'Available');
                      setIssueForm({
                        ...issueForm,
                        bookId,
                        selectedBarcode: avail[0]?.barcode || ''
                      });
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    {books.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.title} — {b.availableCopies} Copies Available ({b.locationRack})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Specific Physical Copy (Barcode)</label>
                  <select
                    value={issueForm.selectedBarcode}
                    onChange={e => setIssueForm({ ...issueForm, selectedBarcode: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                  >
                    {bookCopies
                      .filter(c => (c.bookId === issueForm.bookId) && c.status === 'Available')
                      .map(c => (
                        <option key={c.id} value={c.barcode}>
                          {c.barcode} ({c.condition} · {c.shelfRack})
                        </option>
                      ))}
                    {bookCopies.filter(c => (c.bookId === issueForm.bookId) && c.status === 'Available').length === 0 && (
                      <option value="">No Available Physical Copies in Rack!</option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Loan Duration & Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Loan Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={issueForm.borrowDays}
                  onChange={e => setIssueForm({ ...issueForm, borrowDays: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Calculated Due Date: {(() => {
                    const d = new Date();
                    d.setDate(d.getDate() + Number(issueForm.borrowDays));
                    return d.toISOString().split('T')[0];
                  })()}
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Checkout Reference Notes</label>
                <input
                  type="text"
                  value={issueForm.notes}
                  onChange={e => setIssueForm({ ...issueForm, notes: e.target.value })}
                  placeholder="e.g. Regular academic loan, term paper reference"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-sm ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
              >
                Complete Book Issue & Record Loan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RETURN BOOKS (CHECK-IN DESK) */}
      {/* ========================================================================= */}
      {activeTab === 'return_books' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-emerald-700" />
                Book Return & Check-In Desk
              </h2>
              <p className="text-xs text-slate-500">
                Search active loans by copy barcode, accession code, book title, or borrower name to process returns and calculate fines.
              </p>
            </div>

            {/* Fast Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Scan or type barcode, issue number, book title, or borrower name..."
                value={returnSearchTerm}
                onChange={e => setReturnSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Matching Active Loans */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Select Active Loan to Check-in:
              </span>
              {activeLoansList
                .filter(l => {
                  if (!returnSearchTerm) return true;
                  const term = returnSearchTerm.toLowerCase();
                  return (
                    l.bookTitle.toLowerCase().includes(term) ||
                    l.memberName.toLowerCase().includes(term) ||
                    (l.copyBarcode && l.copyBarcode.toLowerCase().includes(term)) ||
                    (l.issueNo && l.issueNo.toLowerCase().includes(term))
                  );
                })
                .map(loan => {
                  const isOverdue = getDaysOverdue(loan.dueDate) > 0;
                  const isSelected = selectedReturnIssue?.id === loan.id;
                  return (
                    <div
                      key={loan.id}
                      onClick={() => setSelectedReturnIssue(loan)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{loan.bookTitle}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {loan.copyBarcode || loan.bookId}
                          </span>
                          {isOverdue && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                              Overdue by {getDaysOverdue(loan.dueDate)} Days
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Borrower: <span className="font-semibold text-slate-700">{loan.memberName}</span> ({loan.memberRole}) · Due: {loan.dueDate}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        isSelected ? 'bg-teal-700 text-white' : 'border border-slate-200 text-slate-700'
                      }`}>
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Return Action Card when an issue is selected */}
          {selectedReturnIssue && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Process Check-in for: {selectedReturnIssue.bookTitle}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {selectedReturnIssue.copyBarcode}
                </span>
              </div>

              <form onSubmit={handleReturnSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Return Date</label>
                    <input
                      type="text"
                      readOnly
                      value={new Date().toISOString().split('T')[0]}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Inspected Physical Condition</label>
                    <select
                      value={returnCondition}
                      onChange={e => setReturnCondition(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Good">Good / Like Issued</option>
                      <option value="Fair">Fair / Minor Wear</option>
                      <option value="Damaged">Damaged (Needs Repair / Maintenance)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Overdue Fine (₹5/day)</label>
                    {(() => {
                      const days = getDaysOverdue(selectedReturnIssue.dueDate);
                      const calculated = days * 5;
                      return (
                        <div>
                          <input
                            type="number"
                            min="0"
                            placeholder={`Calculated: ₹${calculated}`}
                            value={manualFineOverride}
                            onChange={e => setManualFineOverride(e.target.value ? Number(e.target.value) : '')}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                          />
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            {days > 0 ? `${days} days overdue (Std fine: ₹${calculated})` : 'Returned on or before due date (₹0)'}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedReturnIssue(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel Selection
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm"
                  >
                    Confirm Return & Restock Copy to Shelf
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ACTIVE LOANS */}
      {/* ========================================================================= */}
      {activeTab === 'active_loans' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Active Library Loans Register</h2>
              <p className="text-xs text-slate-500">Currently issued titles circulating with students and staff members</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowIssueModal(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
              >
                <Plus className="w-3.5 h-3.5" /> Issue Book
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, borrower name, copy barcode, or issue reference..."
              value={loanSearch}
              onChange={e => setLoanSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="p-3 font-semibold">Issue Ref</th>
                  <th className="p-3 font-semibold">Book Title & Barcode</th>
                  <th className="p-3 font-semibold">Borrower Member</th>
                  <th className="p-3 font-semibold">Issued Date</th>
                  <th className="p-3 font-semibold">Due Date</th>
                  <th className="p-3 font-semibold">Status / Days</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLoans.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      No active loans match the specified search term.
                    </td>
                  </tr>
                ) : (
                  filteredLoans.map(issue => {
                    const daysOver = getDaysOverdue(issue.dueDate);
                    const isOver = daysOver > 0;
                    return (
                      <tr key={issue.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-mono font-medium text-slate-600">
                          {issue.issueNo || `ISS-${issue.id.slice(-4)}`}
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{issue.bookTitle}</div>
                          <div className="text-[10px] font-mono text-slate-500">{issue.copyBarcode || issue.bookId}</div>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => openMemberProfile(issue.memberRole, issue.memberId, issue.memberName)}
                            className="font-semibold text-teal-800 hover:underline flex items-center gap-1"
                          >
                            <span>{issue.memberName}</span>
                            <Eye className="w-3 h-3 text-slate-400" />
                          </button>
                          <span className="text-[10px] text-slate-500">{issue.memberRole}</span>
                        </td>
                        <td className="p-3 font-mono text-slate-600">{issue.issuedDate}</td>
                        <td className="p-3 font-mono text-slate-600">{issue.dueDate}</td>
                        <td className="p-3">
                          {isOver ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              {daysOver}d Overdue (₹{daysOver * 5})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active Loan
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedReturnIssue(issue);
                              setActiveTab('return_books');
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition"
                          >
                            Process Return
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. OVERDUE BOOKS */}
      {/* ========================================================================= */}
      {activeTab === 'overdue_books' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-rose-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-600" />
                Overdue Loans & Fine Recovery Register
              </h2>
              <p className="text-xs text-slate-500">
                Books past due date. Statutory late return fee: ₹5 per calendar day.
              </p>
            </div>
            <button
              onClick={() => {
                showToast(`Return reminder notices dispatched to ${overdueLoansList.length} members via SMS/App.`, 'success');
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition shadow-2xs"
            >
              Broadcast Return Reminders ({overdueLoansList.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-rose-50/50">
                  <th className="p-3 font-semibold">Issue Ref</th>
                  <th className="p-3 font-semibold">Book Title</th>
                  <th className="p-3 font-semibold">Barcode</th>
                  <th className="p-3 font-semibold">Borrower</th>
                  <th className="p-3 font-semibold">Due Date</th>
                  <th className="p-3 font-semibold">Days Overdue</th>
                  <th className="p-3 font-semibold">Accumulated Fine</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {overdueLoansList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-emerald-700 font-medium">
                      All borrowed books are currently within their due dates. No overdue loans pending!
                    </td>
                  </tr>
                ) : (
                  overdueLoansList.map(issue => {
                    const days = getDaysOverdue(issue.dueDate);
                    const fine = days * 5;
                    return (
                      <tr key={issue.id} className="hover:bg-rose-50/30 transition">
                        <td className="p-3 font-mono font-medium text-slate-600">
                          {issue.issueNo || `ISS-${issue.id.slice(-4)}`}
                        </td>
                        <td className="p-3 font-bold text-slate-900">{issue.bookTitle}</td>
                        <td className="p-3 font-mono text-slate-600">{issue.copyBarcode || 'N/A'}</td>
                        <td className="p-3">
                          <button
                            onClick={() => openMemberProfile(issue.memberRole, issue.memberId, issue.memberName)}
                            className="font-semibold text-teal-800 hover:underline"
                          >
                            {issue.memberName}
                          </button>
                          <span className="text-[10px] text-slate-400 block">{issue.memberRole}</span>
                        </td>
                        <td className="p-3 font-mono text-rose-700 font-semibold">{issue.dueDate}</td>
                        <td className="p-3 font-bold text-rose-700">{days} Days</td>
                        <td className="p-3 font-mono font-bold text-slate-900">₹{fine}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedReturnIssue(issue);
                              setActiveTab('return_books');
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-2xs"
                          >
                            Return Now
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. BOOK RESERVATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'reservations' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-600" />
                Book Reservation & Hold Queue
              </h2>
              <p className="text-xs text-slate-500">
                Queued reservations when all copies are checked out. Automatically notifies borrowers on check-in.
              </p>
            </div>
            <button
              onClick={() => setShowReservationModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
            >
              <Plus className="w-3.5 h-3.5" /> New Reservation
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="p-3 font-semibold">Res No</th>
                  <th className="p-3 font-semibold">Book Title</th>
                  <th className="p-3 font-semibold">Member</th>
                  <th className="p-3 font-semibold">Reserved Date</th>
                  <th className="p-3 font-semibold">Queue Position</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookReservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      No active book reservations queued in system.
                    </td>
                  </tr>
                ) : (
                  bookReservations.map(res => (
                    <tr key={res.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-mono font-medium text-slate-600">{res.reservationNo}</td>
                      <td className="p-3 font-bold text-slate-900">{res.bookTitle}</td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-800">{res.memberName}</span>
                        <span className="text-[10px] text-slate-400 block">{res.memberRole}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{res.reservationDate}</td>
                      <td className="p-3 font-bold text-amber-700">#{res.queuePosition} in Queue</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          res.status === 'active'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : res.status === 'fulfilled'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        {res.status === 'active' && (
                          <>
                            <button
                              onClick={() => {
                                fulfillReservation(res.id);
                                showToast(`Reservation ${res.reservationNo} fulfilled. Ready for checkout.`, 'success');
                              }}
                              className="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                            >
                              Fulfill
                            </button>
                            <button
                              onClick={() => {
                                cancelReservation(res.id);
                                showToast(`Reservation ${res.reservationNo} cancelled.`, 'info');
                              }}
                              className="px-2 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. BOOK CATALOGUE MASTER */}
      {/* ========================================================================= */}
      {activeTab === 'catalogue' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Master Central Book Catalogue</h2>
              <p className="text-xs text-slate-500">
                Institutional catalogue with standard ISBNs, rack assignments, and physical copy tracking
              </p>
            </div>
            <button
              onClick={() => {
                setEditingBook(null);
                setBookForm({
                  title: '',
                  author: '',
                  category: 'Science & Cosmology',
                  isbn: '978-0123456789',
                  publisher: 'Academic Press Ltd.',
                  publicationYear: 2024,
                  edition: '1st Edition',
                  language: 'English',
                  locationRack: 'Shelf S-04',
                  totalCopies: 4,
                  description: ''
                });
                setShowAddBookModal(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
            >
              <Plus className="w-3.5 h-3.5" /> Add New Title
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalogue by title, author, ISBN, or accession ID..."
                value={catalogueSearch}
                onChange={e => setCatalogueSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <select
              value={catalogueCategory}
              onChange={e => setCatalogueCategory(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 bg-white w-full sm:w-auto"
            >
              <option value="all">All Categories ({books.length})</option>
              {categoriesList.map(c => (
                <option key={c.category} value={c.category}>
                  {c.category} ({c.titles})
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="p-3 font-semibold">Accession ID</th>
                  <th className="p-3 font-semibold">Title & Author</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">ISBN</th>
                  <th className="p-3 font-semibold">Rack Shelf</th>
                  <th className="p-3 font-semibold">Stock (Avail / Total)</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooks.map(book => {
                  const copiesOfBook = bookCopies.filter(c => c.bookId === book.id || c.bookId === book.bookId);
                  const availableCopies = copiesOfBook.filter(c => c.status === 'Available').length;
                  return (
                    <tr key={book.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-mono font-medium text-slate-600">{book.bookId}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{book.title}</div>
                        <div className="text-[11px] text-slate-500">{book.author} · {book.publisher || 'Publisher N/A'}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {book.category}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{book.isbn}</td>
                      <td className="p-3 font-mono text-slate-700">{book.locationRack}</td>
                      <td className="p-3">
                        <span className={`font-bold tabular-nums ${availableCopies > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {availableCopies}
                        </span>
                        <span className="text-slate-400"> / {copiesOfBook.length || book.totalCopies} copies</span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => setDetailBook(book)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                          title="View Copies & Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShowAddCopyModal(book)}
                          className="p-1.5 text-teal-600 hover:text-teal-900 hover:bg-teal-50 rounded-lg"
                          title="Add Physical Copy"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditBook(book)}
                          className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg"
                          title="Edit Book Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const borrowedCopies = bookCopies.filter(c => (c.bookId === book.id || c.bookId === book.bookId) && c.status === 'Issued');
                            if (borrowedCopies.length > 0) {
                              showToast(`Cannot delete title: ${borrowedCopies.length} physical copies are currently borrowed!`, 'error');
                              return;
                            }
                            deleteBook(book.id);
                            showToast(`Deleted '${book.title}' from catalogue.`, 'info');
                          }}
                          className="p-1.5 text-rose-600 hover:text-rose-900 hover:bg-rose-50 rounded-lg"
                          title="Delete Title"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* ========================================================================= */}
      {/* 8. PHYSICAL COPY INVENTORY */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Barcode className="w-5 h-5 text-teal-700" />
                Physical Copy Inventory & Barcode Register
              </h2>
              <p className="text-xs text-slate-500">
                Individual physical assets tracked by unique barcode, rack placement, and physical condition.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
              {bookCopies.length} Total Physical Copies Registered
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by barcode, book title, or shelf rack..."
                value={inventorySearch}
                onChange={e => setInventorySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <select
              value={inventoryStatus}
              onChange={e => setInventoryStatus(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 bg-white w-full sm:w-auto"
            >
              <option value="all">All Copy Statuses ({bookCopies.length})</option>
              <option value="Available">Available On Shelf</option>
              <option value="Issued">Currently Issued</option>
              <option value="Reserved">Reserved On Hold</option>
              <option value="Damaged">Damaged / Repair</option>
              <option value="Lost">Lost / Missing</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="p-3 font-semibold">Barcode</th>
                  <th className="p-3 font-semibold">Book Title</th>
                  <th className="p-3 font-semibold">Rack Location</th>
                  <th className="p-3 font-semibold">Condition</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Current Borrower</th>
                  <th className="p-3 font-semibold text-right">Quick Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCopies.map(copy => (
                  <tr key={copy.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{copy.barcode}</td>
                    <td className="p-3 font-semibold text-slate-800">{getBookTitleForCopy(copy)}</td>
                    <td className="p-3 font-mono text-slate-700">{copy.shelfRack}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        copy.condition === 'Mint'
                          ? 'bg-emerald-50 text-emerald-700'
                          : copy.condition === 'Good'
                          ? 'bg-blue-50 text-blue-700'
                          : copy.condition === 'Fair'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {copy.condition}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        copy.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : copy.status === 'Issued'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : copy.status === 'Reserved'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {copy.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">
                      {copy.currentBorrowerName ? (
                        <span className="font-medium text-teal-800">{copy.currentBorrowerName}</span>
                      ) : (
                        <span className="text-slate-400">— In Rack —</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {copy.status === 'Available' ? (
                        <button
                          onClick={() => {
                            updateBookCopyStatus(copy.id, 'Damaged', 'Marked damaged during physical inventory audit');
                            showToast(`Copy ${copy.barcode} marked Damaged.`, 'info');
                          }}
                          className="px-2 py-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg"
                        >
                          Mark Damaged
                        </button>
                      ) : copy.status === 'Damaged' ? (
                        <button
                          onClick={() => {
                            updateBookCopyStatus(copy.id, 'Available', 'Repaired and restored to shelf');
                            showToast(`Copy ${copy.barcode} restored to Available.`, 'success');
                          }}
                          className="px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                        >
                          Restore Shelf
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. CATEGORIES & GENRES */}
      {/* ========================================================================= */}
      {activeTab === 'categories' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-600" />
              Library Categories & Genre Breakdown
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Distribution of catalogue titles and physical copies across academic and literary disciplines
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoriesList.map(cat => (
              <div key={cat.category} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">{cat.category}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {cat.titles} Titles
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Total Copies</span>
                    <span className="font-bold text-slate-900">{cat.copies}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">On Shelf</span>
                    <span className="font-bold text-emerald-700">{cat.available}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCatalogueCategory(cat.category);
                    setActiveTab('catalogue');
                  }}
                  className="w-full mt-2 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-center"
                >
                  Filter Catalogue by {cat.category}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. AUTHORS & PUBLISHERS */}
      {/* ========================================================================= */}
      {activeTab === 'authors' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-700" />
              Authors & Publishers Index
            </h2>
            <p className="text-xs text-slate-500">
              Directory of recognized literary authors and institutional publishing houses
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {authorsList.map(item => (
              <div key={item.author} className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">{item.author}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-semibold">
                    {item.booksCount} {item.booksCount === 1 ? 'Book' : 'Books'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Primary Publisher: {item.publisher}</p>
                <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-100">
                  {item.titles.map((t, idx) => (
                    <div key={idx} className="truncate text-slate-700">· {t}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. LOST & DAMAGED BOOKS */}
      {/* ========================================================================= */}
      {activeTab === 'lost_damaged' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                Lost & Damaged Books Register
              </h2>
              <p className="text-xs text-slate-500">
                Official loss and damage incident records, assessment costs, and replacement settlements
              </p>
            </div>
            <button
              onClick={() => setShowLostDamagedModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition shadow-2xs"
            >
              Report Lost / Damaged Book
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="p-3 font-semibold">Incident Ref</th>
                  <th className="p-3 font-semibold">Book Title</th>
                  <th className="p-3 font-semibold">Barcode</th>
                  <th className="p-3 font-semibold">Member</th>
                  <th className="p-3 font-semibold">Incident Type</th>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Replacement Cost</th>
                  <th className="p-3 font-semibold">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lostDamagedBooks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-400">
                      No lost or damaged book incidents on record.
                    </td>
                  </tr>
                ) : (
                  lostDamagedBooks.map(inc => (
                    <tr key={inc.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-mono font-medium text-slate-600">{inc.incidentNo}</td>
                      <td className="p-3 font-bold text-slate-900">{inc.bookTitle}</td>
                      <td className="p-3 font-mono text-slate-600">{inc.copyBarcode}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{inc.memberName || 'N/A'}</div>
                        <div className="text-[10px] text-slate-400">Rec: {inc.recordedBy}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {inc.type}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{inc.dateReported}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">₹{inc.assessedCost}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inc.fineStatus === 'cleared'
                            ? 'bg-emerald-50 text-emerald-700'
                            : inc.fineStatus === 'waived'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {inc.fineStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. LIBRARY MEMBERS */}
      {/* ========================================================================= */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Library Members Directory
              </h2>
              <p className="text-xs text-slate-500">
                Authorized students and faculty borrowers with active circulation entitlements
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search member by name, roll, or ID..."
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="p-3 font-semibold">Member</th>
                  <th className="p-3 font-semibold">Role</th>
                  <th className="p-3 font-semibold">Identifier</th>
                  <th className="p-3 font-semibold">Active Loans</th>
                  <th className="p-3 font-semibold">Borrowing Limit</th>
                  <th className="p-3 font-semibold">Standing</th>
                  <th className="p-3 font-semibold text-right">View Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Students */}
                {students
                  .filter(s => s.name.toLowerCase().includes(memberSearch.toLowerCase()) || s.rollNo.toString().includes(memberSearch))
                  .map(s => {
                    const activeCount = bookIssues.filter(i => i.memberId === s.id && i.status !== 'returned').length;
                    const hasOverdue = bookIssues.some(i => i.memberId === s.id && i.status === 'overdue');
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-bold text-slate-900">{s.name}</td>
                        <td className="p-3 text-slate-600">Student (Std {s.standard}-{s.section})</td>
                        <td className="p-3 font-mono text-slate-500">Roll #{s.rollNo}</td>
                        <td className="p-3 font-bold text-teal-800">{activeCount} Books</td>
                        <td className="p-3 text-slate-600">Max 3 Books</td>
                        <td className="p-3">
                          {hasOverdue ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700">
                              Overdue Block
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              Good Standing
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setViewingStudent(s)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                          >
                            Dossier
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

      {/* ========================================================================= */}
      {/* 13. TRANSACTIONS AUDIT REGISTER */}
      {/* ========================================================================= */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-teal-700" />
                Library Circulation Transactions Log
              </h2>
              <p className="text-xs text-slate-500">
                Chronological ledger of checkouts, check-ins, reservations, and lost book incident settlements
              </p>
            </div>
            <button
              onClick={exportCirculationReportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              <Download className="w-3.5 h-3.5" /> Export Ledger
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="p-3 font-semibold">Txn Ref</th>
                  <th className="p-3 font-semibold">Timestamp</th>
                  <th className="p-3 font-semibold">Action</th>
                  <th className="p-3 font-semibold">Book Title</th>
                  <th className="p-3 font-semibold">Barcode</th>
                  <th className="p-3 font-semibold">Member</th>
                  <th className="p-3 font-semibold">Fine Amount</th>
                  <th className="p-3 font-semibold">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {libraryTransactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-medium text-slate-600">{txn.txnNo}</td>
                    <td className="p-3 font-mono text-slate-500">{txn.timestamp.slice(0, 16)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        txn.type === 'ISSUE'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : txn.type === 'RETURN'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : txn.type === 'RESERVATION'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">{txn.bookTitle}</td>
                    <td className="p-3 font-mono text-slate-600">{txn.copyBarcode || 'N/A'}</td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-800">{txn.memberName}</span>
                      <span className="text-[10px] text-slate-400 block">{txn.memberRole}</span>
                    </td>
                    <td className="p-3 font-mono">
                      {txn.fineAmount && txn.fineAmount > 0 ? (
                        <span className="font-bold text-rose-600">₹{txn.fineAmount}</span>
                      ) : (
                        <span className="text-slate-400">₹0</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-600">{txn.recordedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 14. LIBRARY REPORTS */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-700" />
                Library Circulation Analytics & Compliance Reports
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Real-time circulation metrics, physical asset loss audits, and late return fine registers.
              </p>
            </div>
            <button
              onClick={exportCirculationReportCSV}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-sm ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
            >
              <Download className="w-4 h-4" /> Export Circulation CSV
            </button>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-400 font-medium">Turnover Rate</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {((activeLoansCount / (totalPhysicalCopies || 1)) * 100).toFixed(1)}%
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Percentage of physical assets in circulation</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-400 font-medium">Overdue Rate</span>
              <div className="text-2xl font-bold text-rose-700 mt-1">
                {activeLoansCount > 0 ? ((overdueCount / activeLoansCount) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-[11px] text-rose-600 mt-1">{overdueCount} out of {activeLoansCount} active loans</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-400 font-medium">Total Fines Assessed</span>
              <div className="text-2xl font-bold text-amber-700 mt-1">₹{totalFinesAccumulated}</div>
              <p className="text-[11px] text-amber-600 mt-1">Accrued from late check-in records</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-400 font-medium">Total Physical Assets</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">{totalPhysicalCopies}</div>
              <p className="text-[11px] text-emerald-600 mt-1">Across {totalCatalogueTitles} distinct titles</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 15. LIBRARIAN PROFILE */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div className="w-16 h-16 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              SO
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Mr. Samuel O’Connor</h2>
              <p className="text-xs text-teal-800 font-semibold">Senior Head Librarian & Information Specialist</p>
              <p className="text-xs text-slate-500 mt-0.5">Staff ID: EMP-LIB-001 · Department: Library & Learning Resources</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-slate-400 font-medium block mb-1">Official Email</span>
              <span className="font-semibold text-slate-900">library.desk@schlar.edu</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-slate-400 font-medium block mb-1">Internal Phone Extension</span>
              <span className="font-semibold text-slate-900">+91 124 498 2210 (Desk Ext. 104)</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-slate-400 font-medium block mb-1">Library Operating Hours</span>
              <span className="font-semibold text-slate-900">Monday – Saturday: 07:45 AM – 04:45 PM</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-slate-400 font-medium block mb-1">Professional Credentials</span>
              <span className="font-semibold text-slate-900">M.Lib.Sc. (Master of Library Science), CILIP Certified</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-900 space-y-1">
            <span className="font-bold block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Role Entitlements & Security Scope
            </span>
            <p className="text-amber-800 leading-relaxed">
              Authorized for full circulation management, catalogue maintenance, physical copy barcode audits, and reservation queues.
              Strictly restricted from fee collection registers, student academic marks/report cards, HR payroll files, and transport route schedules.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Add / Edit Book Catalogue Modal */}
      {(showAddBookModal || editingBook) && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingBook ? 'Edit Book Catalogue Entry' : 'Add New Title to Catalogue'}
              </h3>
              <button
                onClick={() => {
                  setShowAddBookModal(false);
                  setEditingBook(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={bookForm.title}
                  onChange={e => setBookForm({ ...bookForm, title: e.target.value })}
                  placeholder="e.g. Brief Answers to the Big Questions"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.author}
                    onChange={e => setBookForm({ ...bookForm, author: e.target.value })}
                    placeholder="e.g. Stephen Hawking"
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category / Genre</label>
                  <select
                    value={bookForm.category}
                    onChange={e => setBookForm({ ...bookForm, category: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  >
                    <option value="Science & Cosmology">Science & Cosmology</option>
                    <option value="Mathematics & Logic">Mathematics & Logic</option>
                    <option value="World Literature & Fiction">World Literature & Fiction</option>
                    <option value="Social Sciences & Civics">Social Sciences & Civics</option>
                    <option value="Computer Science & AI">Computer Science & AI</option>
                    <option value="General Reference & Encyclopedia">General Reference</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ISBN Barcode</label>
                  <input
                    type="text"
                    value={bookForm.isbn}
                    onChange={e => setBookForm({ ...bookForm, isbn: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Shelf Rack Location</label>
                  <input
                    type="text"
                    value={bookForm.locationRack}
                    onChange={e => setBookForm({ ...bookForm, locationRack: e.target.value })}
                    placeholder="e.g. Shelf S-05"
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Publisher</label>
                  <input
                    type="text"
                    value={bookForm.publisher}
                    onChange={e => setBookForm({ ...bookForm, publisher: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Publication Year</label>
                  <input
                    type="number"
                    value={bookForm.publicationYear}
                    onChange={e => setBookForm({ ...bookForm, publicationYear: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {!editingBook && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Initial Physical Copies to Generate</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={bookForm.totalCopies}
                    onChange={e => setBookForm({ ...bookForm, totalCopies: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Will auto-generate barcodes BC-XXX-01, BC-XXX-02...
                  </span>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description / Abstract</label>
                <textarea
                  rows={2}
                  value={bookForm.description}
                  onChange={e => setBookForm({ ...bookForm, description: e.target.value })}
                  placeholder="Optional brief description of this reference title..."
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddBookModal(false);
                    setEditingBook(null);
                  }}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  {editingBook ? 'Save Changes' : 'Add to Catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Physical Copy Modal */}
      {showAddCopyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Add Physical Copy: {showAddCopyModal.title}
              </h3>
              <button onClick={() => setShowAddCopyModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCopySubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Rack / Shelf Location</label>
                <input
                  type="text"
                  value={newCopyForm.shelfRack}
                  onChange={e => setNewCopyForm({ ...newCopyForm, shelfRack: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Initial Condition</label>
                <select
                  value={newCopyForm.condition}
                  onChange={e => setNewCopyForm({ ...newCopyForm, condition: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                >
                  <option value="Mint">Mint / Pristine</option>
                  <option value="Good">Good / Like Issued</option>
                  <option value="Fair">Fair / Minor Wear</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCopyModal(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  Register Physical Copy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Details Modal */}
      {detailBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{detailBook.title}</h3>
                <p className="text-xs text-slate-500">by {detailBook.author} · {detailBook.bookId}</p>
              </div>
              <button onClick={() => setDetailBook(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px]">Category</span>
                <span className="font-semibold text-slate-800">{detailBook.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">ISBN</span>
                <span className="font-mono text-slate-800">{detailBook.isbn}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Publisher</span>
                <span className="font-semibold text-slate-800">{detailBook.publisher || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Shelf Rack</span>
                <span className="font-mono font-semibold text-teal-800">{detailBook.locationRack}</span>
              </div>
            </div>

            {detailBook.description && (
              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                {detailBook.description}
              </p>
            )}

            {/* Individual Physical Copies List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Physical Inventory Barcode Assets
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {bookCopies
                  .filter(c => c.bookId === detailBook.id || c.bookId === detailBook.bookId)
                  .map(c => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 text-xs bg-slate-50/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800">{c.barcode}</span>
                        <span className="text-[11px] text-slate-500">({c.shelfRack})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700'
                            : c.status === 'Issued'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {c.status} {c.currentBorrowerName ? `(${c.currentBorrowerName})` : ''}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDetailBook(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Queue Book Reservation</h3>
              <button onClick={() => setShowReservationModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReservationSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Title</label>
                <select
                  value={resForm.bookId}
                  onChange={e => setResForm({ ...resForm, bookId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  {books.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.author})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Borrower Type</label>
                <select
                  value={resForm.memberRole}
                  onChange={e => setResForm({ ...resForm, memberRole: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Faculty Staff</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Member</label>
                <select
                  value={resForm.memberId}
                  onChange={e => setResForm({ ...resForm, memberId: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                >
                  {resForm.memberRole === 'Student'
                    ? students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} (Std {s.standard}-{s.section})
                        </option>
                      ))
                    : teachers.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.department})
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reservation Notes</label>
                <input
                  type="text"
                  value={resForm.notes}
                  onChange={e => setResForm({ ...resForm, notes: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReservationModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg}`}
                >
                  Confirm Reservation Hold
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lost / Damaged Modal */}
      {showLostDamagedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Record Lost or Damaged Book</h3>
              <button onClick={() => setShowLostDamagedModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLostDamagedSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Physical Copy (Barcode)</label>
                <select
                  value={incidentForm.bookCopyId}
                  onChange={e => setIncidentForm({ ...incidentForm, bookCopyId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                >
                  {bookCopies.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.barcode} — {getBookTitleForCopy(c)} ({c.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Incident Type</label>
                  <select
                    value={incidentForm.type}
                    onChange={e => setIncidentForm({ ...incidentForm, type: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  >
                    <option value="Lost">Lost / Missing</option>
                    <option value="Damaged">Damaged / Destroyed</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Replacement Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={incidentForm.cost}
                    onChange={e => setIncidentForm({ ...incidentForm, cost: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Member Account Responsible</label>
                <select
                  value={incidentForm.memberId}
                  onChange={e => setIncidentForm({ ...incidentForm, memberId: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      Student: {s.name} (Std {s.standard}-{s.section})
                    </option>
                  ))}
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      Faculty: {t.name} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Incident Description</label>
                <input
                  type="text"
                  value={incidentForm.description}
                  onChange={e => setIncidentForm({ ...incidentForm, description: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLostDamagedModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-xl"
                >
                  Record Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Dossier Modals */}
      <StudentProfileModal
        isOpen={!!viewingStudent}
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        initialTab="overview"
      />

      <StaffProfileModal
        isOpen={!!viewingStaff}
        staff={viewingStaff}
        onClose={() => setViewingStaff(null)}
      />
    </div>
  );
};
