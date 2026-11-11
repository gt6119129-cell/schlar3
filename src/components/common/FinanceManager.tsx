import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  CreditCard,
  FileText,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Download,
  Plus,
  Printer,
  Calendar,
  Send,
  Eye,
  TrendingUp,
  Receipt,
  Users,
  ShieldCheck,
  RotateCcw,
  Clock,
  Layers,
  Sparkles,
  PieChart,
  BarChart2,
  Check,
  X,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  TrendingDown,
  Building2,
  Percent,
  PhoneCall,
  CheckCheck,
  ShieldAlert,
  Wallet
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import {
  FeeInvoice,
  FeePayment,
  FeeStructureItem,
  FeeConcession,
  ExpenseRecord,
  BudgetCategory,
  FinancialDaybookEntry,
  Student
} from '../../types/school';
import { getThemeClasses } from '../../utils/themeHelper';
import { BRANDING } from '../../constants/branding';

interface FinanceManagerProps {
  initialTab?: 'overview' | 'collections' | 'structures' | 'concessions' | 'defaulters' | 'expenses' | 'budgets' | 'daybook' | 'reports';
  readOnly?: boolean;
}

export const FinanceManager: React.FC<FinanceManagerProps> = ({
  initialTab = 'overview',
  readOnly = false
}) => {
  const {
    currentRole,
    themeColor,
    students,
    fees,
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
    recordFeePayment,
    sendFeeReminder,
    recordExpense,
    approveExpense,
    rejectExpense,
    updateBudgetCategory,
    showToast
  } = useSchool();

  const themeClasses = getThemeClasses(themeColor);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'collections' | 'structures' | 'concessions' | 'defaulters' | 'expenses' | 'budgets' | 'daybook' | 'reports'>(initialTab);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'pending' | 'overdue'>('all');
  const [selectedStandard, setSelectedStandard] = useState<number | 'all'>('all');
  const [selectedFeeType, setSelectedFeeType] = useState<string>('all');
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState<string>('all');
  const [daybookDateFilter, setDaybookDateFilter] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Modals
  const [collectPaymentModalInvoice, setCollectPaymentModalInvoice] = useState<FeeInvoice | null>(null);
  const [partialPaymentAmount, setPartialPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<FeePayment['paymentMethod']>('UPI');
  const [paymentTxnRef, setPaymentTxnRef] = useState('');
  const [paymentChequeNo, setPaymentChequeNo] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Receipt Modal
  const [viewReceiptModalInvoice, setViewReceiptModalInvoice] = useState<FeeInvoice | null>(null);
  const [viewReceiptRecord, setViewReceiptRecord] = useState<FeePayment | null>(null);

  // Expense Modal
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpCategory, setNewExpCategory] = useState<ExpenseRecord['category']>('Campus Infrastructure & Utilities');
  const [newExpVendor, setNewExpVendor] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAmount, setNewExpAmount] = useState<number>(15000);
  const [newExpDate, setNewExpDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newExpPayMethod, setNewExpPayMethod] = useState<ExpenseRecord['paymentMethod']>('NetBanking');
  const [newExpBillNo, setNewExpBillNo] = useState('');
  const [newExpChequeRef, setNewExpChequeRef] = useState('');

  // Voucher Viewer Modal
  const [viewVoucherModal, setViewVoucherModal] = useState<ExpenseRecord | null>(null);

  // Concession Modal
  const [showAddConcessionModal, setShowAddConcessionModal] = useState(false);
  const [concessionStudentId, setConcessionStudentId] = useState('stu-104');
  const [concessionType, setConcessionType] = useState<FeeConcession['concessionType']>('Merit Scholarship');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [concessionReason, setConcessionReason] = useState('Academic Excellence & Top Quartile Performance');

  // Batch Assign Modal
  const [showBatchAssignModal, setShowBatchAssignModal] = useState(false);
  const [batchStructureId, setBatchStructureId] = useState(feeStructures[0]?.id || 'fs-04');
  const [batchStandard, setBatchStandard] = useState<number>(8);
  const [batchSection, setBatchSection] = useState<'A' | 'B' | 'all'>('all');

  // Reminder Modal
  const [reminderModalInvoice, setReminderModalInvoice] = useState<FeeInvoice | null>(null);
  const [reminderChannel, setReminderChannel] = useState<'SMS' | 'WhatsApp' | 'Email'>('SMS');

  // Budget Adjust Modal
  const [adjustingBudget, setAdjustingBudget] = useState<BudgetCategory | null>(null);
  const [newBudgetAllocated, setNewBudgetAllocated] = useState<number>(0);
  const [newBudgetThreshold, setNewBudgetThreshold] = useState<number>(85);

  // Role permissions
  const isPrincipal = currentRole === 'principal';
  const isAccountant = currentRole === 'accountant';
  const canModifyFinances = !readOnly && (isAccountant || isPrincipal);

  // Financial Analytics Calculations
  const totalBilled = useMemo(() => fees.reduce((sum, f) => sum + f.amount, 0), [fees]);
  const totalCollected = useMemo(() => {
    return fees.reduce((sum, f) => sum + (f.paidAmount || (f.status === 'paid' ? f.amount : 0)), 0);
  }, [fees]);
  const totalOutstanding = useMemo(() => {
    return fees.reduce((sum, f) => sum + (f.remainingBalance ?? (f.status === 'paid' ? 0 : f.amount)), 0);
  }, [fees]);
  const totalOverdue = useMemo(() => {
    return fees.filter(f => f.status === 'overdue').reduce((sum, f) => sum + (f.remainingBalance ?? f.amount), 0);
  }, [fees]);

  const totalExpensesApproved = useMemo(() => {
    return expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);
  const totalExpensesPending = useMemo(() => {
    return expenses.filter(e => e.status === 'pending_approval').reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const netOperatingSurplus = totalCollected - totalExpensesApproved;
  const collectionVelocityPct = Math.round((totalCollected / (totalBilled || 1)) * 100);

  // Filtered Invoices
  const filteredFees = useMemo(() => {
    return fees.filter(f => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        f.studentName.toLowerCase().includes(q) ||
        f.invoiceNo.toLowerCase().includes(q) ||
        (f.receiptNo && f.receiptNo.toLowerCase().includes(q)) ||
        f.feeType.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
      const matchesStd = selectedStandard === 'all' || f.standard === selectedStandard;
      const matchesFeeType = selectedFeeType === 'all' || f.feeType === selectedFeeType;

      return matchesSearch && matchesStatus && matchesStd && matchesFeeType;
    });
  }, [fees, searchQuery, statusFilter, selectedStandard, selectedFeeType]);

  // Defaulters list (Overdue and Pending past grace period)
  const defaulterList = useMemo(() => {
    return fees.filter(f => f.status === 'overdue' || (f.status === 'pending' && f.dueDate < '2026-10-20'));
  }, [fees]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        e.voucherNo.toLowerCase().includes(q) ||
        e.vendorName.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.invoiceBillNo.toLowerCase().includes(q);

      const matchesCat = selectedExpenseCategory === 'all' || e.category === selectedExpenseCategory;

      return matchesSearch && matchesCat;
    });
  }, [expenses, searchQuery, selectedExpenseCategory]);

  // Filtered Daybook Entries
  const filteredDaybook = useMemo(() => {
    if (!daybookDateFilter) return daybookEntries;
    return daybookEntries.filter(d => d.date === daybookDateFilter || d.timestamp.includes(daybookDateFilter));
  }, [daybookEntries, daybookDateFilter]);

  // Handlers
  const handleOpenCollectPayment = (invoice: FeeInvoice) => {
    setCollectPaymentModalInvoice(invoice);
    const balance = invoice.remainingBalance ?? (invoice.status === 'paid' ? 0 : invoice.amount);
    setPartialPaymentAmount(balance);
    setPaymentMode('UPI');
    setPaymentTxnRef('');
    setPaymentChequeNo('');
    setPaymentNotes('');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectPaymentModalInvoice) return;

    if (partialPaymentAmount <= 0) {
      showToast('Payment amount must be greater than zero.', 'error');
      return;
    }

    const currentDue = collectPaymentModalInvoice.remainingBalance ?? collectPaymentModalInvoice.amount;
    if (partialPaymentAmount > currentDue) {
      showToast(`Amount exceeds outstanding balance (₹${currentDue.toLocaleString()}).`, 'error');
      return;
    }

    const res = recordFeePayment(
      collectPaymentModalInvoice.id,
      partialPaymentAmount,
      paymentMode,
      paymentTxnRef,
      paymentChequeNo,
      paymentNotes,
      currentRole === 'principal' ? 'Dr. Evelyn Montgomery (Principal)' : 'Mr. David Reynolds (Accountant)'
    );

    if (res.success) {
      setCollectPaymentModalInvoice(null);
    }
  };

  const handleOpenReceipt = (invoice: FeeInvoice, installment?: FeePayment) => {
    setViewReceiptModalInvoice(invoice);
    setViewReceiptRecord(installment || invoice.installments?.[invoice.installments.length - 1] || null);
  };

  const handleCreateExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpVendor.trim() || newExpAmount <= 0) {
      showToast('Please provide valid vendor name and positive expense amount.', 'error');
      return;
    }

    // Expenses > 25,000 recorded by accountant require Principal approval unless recorded by Principal
    const status: ExpenseRecord['status'] =
      isPrincipal || newExpAmount < 25000 ? 'approved' : 'pending_approval';

    recordExpense({
      category: newExpCategory,
      vendorName: newExpVendor.trim(),
      description: newExpDesc.trim() || `${newExpCategory} operational expense`,
      amount: newExpAmount,
      expenseDate: newExpDate,
      paymentMethod: newExpPayMethod,
      chequeOrRefNo: newExpChequeRef.trim() || `${newExpPayMethod}-${Math.floor(10000 + Math.random() * 90000)}`,
      invoiceBillNo: newExpBillNo.trim() || `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
      status,
      recordedBy: isPrincipal ? 'Dr. Evelyn Montgomery (Principal)' : 'Mr. David Reynolds (Accountant)',
      fiscalQuarter: 'Q3',
      approvedBy: status === 'approved' ? (isPrincipal ? 'Dr. Evelyn Montgomery' : 'Mr. David Reynolds') : undefined,
      approvedDate: status === 'approved' ? newExpDate : undefined
    });

    setShowAddExpenseModal(false);
    setNewExpVendor('');
    setNewExpDesc('');
    setNewExpBillNo('');
    setNewExpChequeRef('');
  };

  const handleAddConcessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stu = students.find(s => s.id === concessionStudentId);
    if (!stu) return;

    applyFeeConcession({
      studentId: stu.id,
      studentName: stu.name,
      standard: stu.standard,
      section: stu.section,
      concessionType,
      discountType,
      discountValue,
      appliedComponent: 'Tuition Fee',
      calculatedDeduction: discountType === 'percentage' ? Math.round((28500 * discountValue) / 100) : discountValue,
      validAcademicYear: '2026-2027',
      status: 'active',
      approvedBy: isPrincipal ? 'Dr. Evelyn Montgomery (Principal)' : 'Mr. David Reynolds (Bursar)',
      approvedDate: new Date().toISOString().split('T')[0],
      reason: concessionReason.trim() || 'Approved institutional concession policy.'
    });

    setShowAddConcessionModal(false);
    setConcessionReason('');
  };

  const handleBatchAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sec = batchSection === 'all' ? undefined : batchSection;
    assignFeeStructureToClass(batchStructureId, batchStandard, sec);
    setShowBatchAssignModal(false);
  };

  const handleSendReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderModalInvoice) return;
    sendFeeReminder(reminderModalInvoice.id, reminderChannel);
    setReminderModalInvoice(null);
  };

  const handleAdjustBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingBudget) return;
    updateBudgetCategory(adjustingBudget.id, newBudgetAllocated, newBudgetThreshold);
    setAdjustingBudget(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Module Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl ${themeClasses.primaryBg} text-white flex items-center justify-center shadow-sm shrink-0`}>
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Finance & Fee Administration
              </h2>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                AY 2026–2027 · Term 2
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                CBSE Affiliation #1930284
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Greenfield International School institutional bursar management: tuition collections, partial installments, operational expenditure, budgeting, and daybook.
            </p>
          </div>
        </div>

        {/* Quick Action CTA Bar */}
        {canModifyFinances && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4 text-slate-600" />
              <span>Record Expense</span>
            </button>
            <button
              onClick={() => setShowBatchAssignModal(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Layers className="w-4 h-4 text-blue-700" />
              <span>Assign Fee Structure</span>
            </button>
            <button
              onClick={() => setShowAddConcessionModal(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Percent className="w-4 h-4 text-amber-700" />
              <span>Grant Concession</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Executive Dashboard', icon: TrendingUp },
          { id: 'collections', label: 'Fee Collections & Cashbook', icon: CreditCard },
          { id: 'structures', label: 'Fee Structures & Tiers', icon: Building2 },
          { id: 'concessions', label: 'Concessions & Scholarships', icon: Percent },
          { id: 'defaulters', label: `Defaulters (${defaulterList.length})`, icon: AlertTriangle },
          { id: 'expenses', label: 'Expenses & Vouchers', icon: Wallet },
          { id: 'budgets', label: 'Budget & Variance', icon: PieChart },
          { id: 'daybook', label: 'Daily Daybook', icon: Receipt },
          { id: 'reports', label: 'Financial Statements', icon: BarChart2 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? `${themeClasses.primaryBg} text-white shadow-2xs`
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW / EXECUTIVE DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Total Fee Realized</span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-50 text-emerald-700">
                  {collectionVelocityPct}% Collected
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-700">
                ₹{totalCollected.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                <span>Total Billed:</span>
                <span className="font-mono font-semibold text-slate-800">₹{totalBilled.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Outstanding Dues</span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-50 text-amber-700">
                  {fees.filter(f => f.status === 'pending' || f.status === 'partial').length} Accounts
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-amber-700">
                ₹{totalOutstanding.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                <span>Strict Overdue:</span>
                <span className="font-mono font-semibold text-rose-700">₹{totalOverdue.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Approved Expenses</span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-50 text-blue-700">
                  {expenses.filter(e => e.status === 'approved').length} Vouchers
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">
                ₹{totalExpensesApproved.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                <span>Pending Approval:</span>
                <span className="font-mono font-semibold text-amber-700">₹{totalExpensesPending.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Operating Surplus</span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-purple-50 text-purple-700">
                  Cash In Hand
                </span>
              </div>
              <div className={`text-2xl font-bold font-mono ${netOperatingSurplus >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                ₹{netOperatingSurplus.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                <span>Statutory Standing:</span>
                <span className="font-semibold text-emerald-700">Solvent & Audited</span>
              </div>
            </div>
          </div>

          {/* Collection Health Progress & Defaulter Alert Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Term 2 Fee Realization Target Progress</h3>
                <p className="text-xs text-slate-500">Real-time tuition, transport, and lab fee collections against sanctioned budget</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                Target: ₹{totalBilled.toLocaleString()} (90% target date: Oct 30)
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Collected: ₹{totalCollected.toLocaleString()} ({collectionVelocityPct}%)</span>
                <span>Outstanding: ₹{totalOutstanding.toLocaleString()} ({100 - collectionVelocityPct}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-600 h-full transition-all"
                  style={{ width: `${collectionVelocityPct}%` }}
                />
                <div
                  className="bg-amber-400 h-full transition-all"
                  style={{ width: `${Math.min(100 - collectionVelocityPct, 30)}%` }}
                />
                <div
                  className="bg-rose-500 h-full transition-all"
                  style={{ width: `${Math.max(0, 100 - collectionVelocityPct - 30)}%` }}
                />
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Cleared (Realized)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Pending Installment
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Overdue Defaulter
                </span>
              </div>
            </div>
          </div>

          {/* Dual Ledger Columns: Recent Collections & Recent Expenditures */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Payments Settled */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Recent Cleared Collections</span>
                  </h3>
                  <p className="text-xs text-slate-500">Real-time receipts from UPI, Cards, and NetBanking</p>
                </div>
                <button
                  onClick={() => setActiveTab('collections')}
                  className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {fees.filter(f => f.status === 'paid' || f.status === 'partial').slice(0, 5).map(inv => (
                  <div key={inv.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{inv.studentName}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                          Std {inv.standard}-{inv.section}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {inv.feeType} · {inv.receiptNo || inv.invoiceNo} · Method: {inv.paymentMethod || 'UPI'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold font-mono text-emerald-700">
                        +₹{(inv.paidAmount || inv.amount).toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleOpenReceipt(inv)}
                        className="text-[11px] text-blue-700 font-semibold hover:underline"
                      >
                        Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Expenses Disbursed */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <span>Operational Disbursements</span>
                  </h3>
                  <p className="text-xs text-slate-500">Recent vendor settlements and departmental vouchers</p>
                </div>
                <button
                  onClick={() => setActiveTab('expenses')}
                  className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {expenses.slice(0, 5).map(exp => (
                  <div key={exp.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{exp.vendorName}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                          exp.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {exp.status === 'approved' ? 'Approved' : 'Pending Review'}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5 truncate max-w-xs">
                        {exp.voucherNo} · {exp.category} · {exp.expenseDate}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold font-mono text-slate-900">
                        -₹{exp.amount.toLocaleString()}
                      </div>
                      <button
                        onClick={() => setViewVoucherModal(exp)}
                        className="text-[11px] text-blue-700 font-semibold hover:underline"
                      >
                        Voucher
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FEE COLLECTIONS & CASHBOOK */}
      {/* ========================================================================= */}
      {activeTab === 'collections' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Student Fee Ledger & Invoicing Register
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Record full or partial fee payments, view transaction histories, and generate official receipts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('Fee ledger exported to Excel (CSV format).', 'success')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search student, invoice # or receipt #..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="all">All Payment Statuses</option>
                <option value="paid">Paid (Fully Settled)</option>
                <option value="partial">Partial (Installment Paid)</option>
                <option value="pending">Pending (Awaiting Payment)</option>
                <option value="overdue">Overdue (Defaulter)</option>
              </select>
            </div>

            <div>
              <select
                value={selectedStandard}
                onChange={e => setSelectedStandard(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="all">All Standards (1 to 10)</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                  <option key={s} value={s}>Standard {s}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedFeeType}
                onChange={e => setSelectedFeeType(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="all">All Fee Heads</option>
                <option value="Tuition Fee">Tuition Fee</option>
                <option value="Lab & Library">Lab & Library</option>
                <option value="Transport">Transport</option>
                <option value="Annual Activity">Annual Activity</option>
              </select>
            </div>
          </div>

          {/* Invoices & Collections Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Invoice No</th>
                  <th className="py-2.5 px-3">Student & Class</th>
                  <th className="py-2.5 px-3">Fee Particular</th>
                  <th className="py-2.5 px-3 text-right">Total Billed</th>
                  <th className="py-2.5 px-3 text-right">Amount Paid</th>
                  <th className="py-2.5 px-3 text-right">Remaining Balance</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredFees.map(inv => {
                  const paid = inv.paidAmount || (inv.status === 'paid' ? inv.amount : 0);
                  const bal = inv.remainingBalance ?? (inv.status === 'paid' ? 0 : inv.amount);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                        {inv.invoiceNo}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{inv.studentName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Std {inv.standard}-{inv.section} · {inv.academicYear || '2026-27'}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-800">{inv.feeType}</div>
                        {inv.concessionType && (
                          <div className="text-[10px] text-amber-700 font-semibold">
                            Waiver: {inv.concessionType}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-right">
                        ₹{inv.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold text-right">
                        ₹{paid.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-right">
                        <span className={bal > 0 ? (inv.status === 'overdue' ? 'text-rose-700' : 'text-amber-700') : 'text-slate-400'}>
                          ₹{bal.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {inv.dueDate}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] uppercase ${
                          inv.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : inv.status === 'partial'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : inv.status === 'overdue'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {canModifyFinances && bal > 0 && (
                            <button
                              onClick={() => handleOpenCollectPayment(inv)}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1 shadow-2xs"
                            >
                              <CreditCard className="w-3 h-3" />
                              <span>Collect</span>
                            </button>
                          )}

                          {paid > 0 && (
                            <button
                              onClick={() => handleOpenReceipt(inv)}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                              title="View Official Receipt"
                            >
                              <Receipt className="w-3 h-3" />
                              <span>Receipt</span>
                            </button>
                          )}

                          {bal > 0 && canModifyFinances && (
                            <button
                              onClick={() => setReminderModalInvoice(inv)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                              title="Send Payment Reminder"
                            >
                              <Send className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FEE STRUCTURES & TIERS */}
      {/* ========================================================================= */}
      {activeTab === 'structures' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Board-Sanctioned Fee Tiers & Structure Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard-wise fee templates, component breakdown (Tuition, Lab, Transport, Activities), and batch invoicing
              </p>
            </div>
            {canModifyFinances && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBatchAssignModal(true)}
                  className={`px-3.5 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors flex items-center gap-1.5 shadow-2xs`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Assign Structure to Class</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feeStructures.map(tier => (
              <div key={tier.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{tier.tierName}</h4>
                      <span className="text-[11px] font-mono font-semibold text-blue-700 block mt-0.5">
                        {tier.wingName} · Standards {tier.applicableStandards.join(', ')}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-100 text-emerald-800">
                      {tier.status}
                    </span>
                  </div>

                  <div className="pt-3 space-y-1.5 text-xs text-slate-600">
                    {tier.components.map(comp => (
                      <div key={comp.id} className="flex justify-between py-1 border-b border-slate-200/70">
                        <span className="flex items-center gap-1.5">
                          <span>{comp.name}</span>
                          {!comp.mandatory && (
                            <span className="text-[9px] text-slate-400 font-mono">(Opt)</span>
                          )}
                        </span>
                        <span className="font-mono font-semibold text-slate-900">
                          ₹{comp.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/{comp.term}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Annual Structure:</span>
                    <span className="text-base font-bold font-mono text-slate-900">
                      ₹{tier.totalAnnualAmount.toLocaleString()}
                    </span>
                  </div>
                  {canModifyFinances && (
                    <button
                      onClick={() => {
                        setBatchStructureId(tier.id);
                        setBatchStandard(tier.applicableStandards[0] || 8);
                        setShowBatchAssignModal(true);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Assign Invoices
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CONCESSIONS & SCHOLARSHIPS */}
      {/* ========================================================================= */}
      {activeTab === 'concessions' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Sanctioned Fee Concessions & Scholarships
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Merit scholarships, sibling discounts, staff ward concessions, and EWS waivers with approval controls
              </p>
            </div>
            {canModifyFinances && (
              <button
                onClick={() => setShowAddConcessionModal(true)}
                className={`px-3.5 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors flex items-center gap-1.5 shadow-2xs`}
              >
                <Plus className="w-4 h-4" />
                <span>Grant New Concession</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Concession No</th>
                  <th className="py-2.5 px-3">Student & Standard</th>
                  <th className="py-2.5 px-3">Category Type</th>
                  <th className="py-2.5 px-3">Benefit Rate</th>
                  <th className="py-2.5 px-3">Applied Component</th>
                  <th className="py-2.5 px-3">Approved By & Date</th>
                  <th className="py-2.5 px-3">Reason / Justification</th>
                  <th className="py-2.5 px-3">Status</th>
                  {canModifyFinances && <th className="py-2.5 px-3 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {feeConcessions.map(con => (
                  <tr key={con.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                      {con.concessionNo}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{con.studentName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Std {con.standard}-{con.section}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {con.concessionType}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-800">
                      {con.discountType === 'percentage' ? `${con.discountValue}% Off` : `₹${con.discountValue.toLocaleString()} Flat`}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {con.appliedComponent}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <div>{con.approvedBy}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{con.approvedDate}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={con.reason}>
                      {con.reason}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] uppercase ${
                        con.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {con.status}
                      </span>
                    </td>
                    {canModifyFinances && (
                      <td className="py-2.5 px-3 text-center">
                        {con.status === 'active' && (
                          <button
                            onClick={() => revokeFeeConcession(con.id, 'Management review revision')}
                            className="text-xs font-semibold text-rose-700 hover:underline"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. OUTSTANDING BALANCES & DEFAULTERS */}
      {/* ========================================================================= */}
      {activeTab === 'defaulters' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Overdue Fee Defaulters Register ({defaulterList.length} Accounts)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Students with unpaid dues past designated deadline; instant automated SMS/Email reminder dispatch
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  defaulterList.forEach(inv => sendFeeReminder(inv.id, 'SMS'));
                  showToast(`Batch SMS reminder alerts dispatched to all ${defaulterList.length} parents.`, 'success');
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Reminders to All</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Invoice No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Standard / Roll</th>
                  <th className="py-2.5 px-3">Parent / Contact</th>
                  <th className="py-2.5 px-3">Fee Type</th>
                  <th className="py-2.5 px-3 text-right">Balance Due</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3 text-center">Dispatch Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {defaulterList.map(inv => {
                  const stu = students.find(s => s.id === inv.studentId);
                  const bal = inv.remainingBalance ?? inv.amount;
                  return (
                    <tr key={inv.id} className="hover:bg-rose-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                        {inv.invoiceNo}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {inv.studentName}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        Std {inv.standard}-{inv.section}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800">{stu?.parentName || 'Parent / Guardian'}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{stu?.parentPhone || '+91 98450 11223'}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {inv.feeType}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-rose-700 text-right">
                        ₹{bal.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-rose-600 font-semibold">
                        {inv.dueDate}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => setReminderModalInvoice(inv)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors inline-flex items-center gap-1"
                        >
                          <Send className="w-3 h-3 text-rose-600" /> Send Alert
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
      {/* 6. EXPENSES & VOUCHERS */}
      {/* ========================================================================= */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Operational Expenditure & Payment Vouchers
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Vendor bills, faculty payroll records, campus utilities, and administrative disbursements
              </p>
            </div>
            {canModifyFinances && (
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className={`px-3.5 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors flex items-center gap-1.5 shadow-2xs`}
              >
                <Plus className="w-4 h-4" />
                <span>Record New Expense</span>
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search vendor, voucher # or bill reference..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <select
                value={selectedExpenseCategory}
                onChange={e => setSelectedExpenseCategory(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="all">All Expense Categories</option>
                <option value="Faculty & Staff Salaries">Faculty & Staff Salaries</option>
                <option value="Campus Infrastructure & Utilities">Campus Infrastructure & Utilities</option>
                <option value="Science & Computer Labs">Science & Computer Labs</option>
                <option value="Library & Learning Resources">Library & Learning Resources</option>
                <option value="Sports & Co-Curricular">Sports & Co-Curricular</option>
                <option value="School Transport & Fleet">School Transport & Fleet</option>
                <option value="Repairs & Facility Maintenance">Repairs & Facility Maintenance</option>
                <option value="Administration & Compliance">Administration & Compliance</option>
              </select>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Voucher No</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Vendor / Payee</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3">Date & Method</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {exp.voucherNo}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {exp.category}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{exp.vendorName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Bill: {exp.invoiceBillNo}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={exp.description}>
                      {exp.description}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-right">
                      ₹{exp.amount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      <div>{exp.expenseDate}</div>
                      <div className="text-[11px] text-slate-400">{exp.paymentMethod}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] uppercase ${
                        exp.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : exp.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {exp.status === 'pending_approval' ? 'Pending Review' : exp.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewVoucherModal(exp)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        >
                          View Voucher
                        </button>

                        {/* Approval buttons for Principal */}
                        {isPrincipal && exp.status === 'pending_approval' && (
                          <>
                            <button
                              onClick={() => approveExpense(exp.id, 'Dr. Evelyn Montgomery (Principal)')}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectExpense(exp.id, 'Requisition requires board re-evaluation')}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors"
                            >
                              Reject
                            </button>
                          </>
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

      {/* ========================================================================= */}
      {/* 7. SCHOOL BUDGETING & VARIANCE */}
      {/* ========================================================================= */}
      {activeTab === 'budgets' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Departmental Budget Allocations & Variance Performance
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring committed vs. spent amounts across academic, operational, and capital heads
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
              FY 2026–2027 Annual Budget
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map(b => {
              const totalUtilized = b.spentAmount + b.committedAmount;
              const pctUtilized = Math.round((totalUtilized / (b.allocatedAmount || 1)) * 100);
              const remaining = Math.max(0, b.allocatedAmount - totalUtilized);
              const isOverAlert = pctUtilized >= b.alertThresholdPct;

              return (
                <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{b.categoryName}</h4>
                      <span className="text-[11px] text-slate-500">
                        Head: {b.departmentHead} · {b.fiscalQuarter}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isOverAlert ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {pctUtilized}% Used (Threshold: {b.alertThresholdPct}%)
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Spent: ₹{b.spentAmount.toLocaleString()}</span>
                      <span className="font-semibold text-slate-900 font-mono">
                        Limit: ₹{b.allocatedAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full transition-all ${isOverAlert ? 'bg-rose-600' : 'bg-emerald-600'}`}
                        style={{ width: `${Math.min(100, pctUtilized)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>Committed: ₹{b.committedAmount.toLocaleString()}</span>
                      <span className="font-semibold font-mono text-emerald-700">
                        Remaining: ₹{remaining.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {canModifyFinances && (
                    <div className="pt-2 border-t border-slate-200/80 flex justify-end">
                      <button
                        onClick={() => {
                          setAdjustingBudget(b);
                          setNewBudgetAllocated(b.allocatedAmount);
                          setNewBudgetThreshold(b.alertThresholdPct);
                        }}
                        className="text-xs font-semibold text-blue-700 hover:underline"
                      >
                        Adjust Allocation
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. DAILY DAYBOOK */}
      {/* ========================================================================= */}
      {activeTab === 'daybook' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Official Daily Daybook & Cash Register
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chronological ledger of cash, bank, and digital movements with running closing balances
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={daybookDateFilter}
                onChange={e => setDaybookDateFilter(e.target.value)}
                className="text-xs font-mono p-1.5 rounded-lg border border-slate-200"
              />
              <button
                onClick={() => setDaybookDateFilter('')}
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                Clear Date Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Timestamp / Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Reference No</th>
                  <th className="py-2.5 px-3">Party / Account</th>
                  <th className="py-2.5 px-3">Narration</th>
                  <th className="py-2.5 px-3 text-right">Debit (Outflow)</th>
                  <th className="py-2.5 px-3 text-right">Credit (Inflow)</th>
                  <th className="py-2.5 px-3 text-right">Running Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDaybook.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                      {entry.timestamp}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase ${
                        entry.type === 'INCOME' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                      {entry.referenceNo}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {entry.partyName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={entry.narration}>
                      {entry.narration}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-right text-rose-700">
                      {entry.debitAmount > 0 ? `₹${entry.debitAmount.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-right text-emerald-700">
                      {entry.creditAmount > 0 ? `+₹${entry.creditAmount.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-right">
                      ₹{entry.runningBalance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. FINANCIAL STATEMENTS & REPORTS */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Institutional Financial Statements & Bursar Reports
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Audited Income vs. Expense statement, wing-wise revenue realization, and statutory compliance
              </p>
            </div>
            <button
              onClick={() => showToast('Audited Bursar Financial Statement exported as PDF.', 'success')}
              className={`px-3.5 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors flex items-center gap-1.5 shadow-2xs`}
            >
              <Download className="w-4 h-4" /> Export Report (PDF)
            </button>
          </div>

          {/* Income vs Expense Statement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Revenue Breakdown (Term 2)</span>
                <span className="text-emerald-700 font-mono">₹{totalCollected.toLocaleString()}</span>
              </h4>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Tuition Fee Collections:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    ₹{fees.filter(f => f.feeType === 'Tuition Fee').reduce((s, f) => s + (f.paidAmount || (f.status === 'paid' ? f.amount : 0)), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Science & Computer Lab Fees:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    ₹{fees.filter(f => f.feeType === 'Lab & Library').reduce((s, f) => s + (f.paidAmount || (f.status === 'paid' ? f.amount : 0)), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>School Transport Services:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    ₹{fees.filter(f => f.feeType === 'Transport').reduce((s, f) => s + (f.paidAmount || (f.status === 'paid' ? f.amount : 0)), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Activities & Co-Curricular:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    ₹{fees.filter(f => f.feeType === 'Annual Activity').reduce((s, f) => s + (f.paidAmount || (f.status === 'paid' ? f.amount : 0)), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Expenditure Summary (Term 2)</span>
                <span className="text-rose-700 font-mono">₹{totalExpensesApproved.toLocaleString()}</span>
              </h4>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Faculty & Staff Salaries:</span>
                  <span className="font-mono font-semibold text-slate-900">₹18,50,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Campus Utilities & Infrastructure:</span>
                  <span className="font-mono font-semibold text-slate-900">₹62,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Fleet Maintenance & Fuel:</span>
                  <span className="font-mono font-semibold text-slate-900">₹85,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Labs, Library & Athletics:</span>
                  <span className="font-mono font-semibold text-slate-900">₹1,10,700</span>
                </div>
                <div className="flex justify-between py-1 text-slate-900 font-bold border-t border-slate-300 pt-2">
                  <span>Net Operating Surplus:</span>
                  <span className="font-mono text-emerald-700">₹{netOperatingSurplus.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Compliance Notice */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4 text-xs">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">Statutory Audit & Tax Compliance Standing</h4>
              <p className="text-slate-600">
                Audited by M/s Kulkarni & Associates, Chartered Accountants. Unqualified clean audit opinion for FY 2025–2026.
              </p>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 font-mono">
                <span>GSTIN: 27AABCG1930M1Z8</span>
                <span>PAN: AABTG4192M</span>
                <span>12A / 80G Educational Trust Exemption Active</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs shrink-0">
              Compliant · Clean Audit
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: COLLECT PAYMENT */}
      {/* ========================================================================= */}
      {collectPaymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-xl ${themeClasses.primaryBg} text-white flex items-center justify-center`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Record Fee Collection</h3>
                  <p className="text-xs text-slate-500 font-mono">Invoice: {collectPaymentModalInvoice.invoiceNo}</p>
                </div>
              </div>
              <button
                onClick={() => setCollectPaymentModalInvoice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-900">{collectPaymentModalInvoice.studentName} (Std {collectPaymentModalInvoice.standard}-{collectPaymentModalInvoice.section})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fee Particular:</span>
                  <span className="font-semibold text-slate-800">{collectPaymentModalInvoice.feeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Invoice Amount:</span>
                  <span className="font-mono font-bold text-slate-900">₹{collectPaymentModalInvoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Outstanding Balance:</span>
                  <span className="font-mono font-bold text-rose-700">
                    ₹{(collectPaymentModalInvoice.remainingBalance ?? collectPaymentModalInvoice.amount).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Payment Amount to Collect (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  max={collectPaymentModalInvoice.remainingBalance ?? collectPaymentModalInvoice.amount}
                  value={partialPaymentAmount}
                  onChange={e => setPartialPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Support partial installments. Enter exact amount tendered by parent.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value as typeof paymentMode)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Card">Debit / Credit Card (POS)</option>
                    <option value="NetBanking">NetBanking / NEFT</option>
                    <option value="Cheque">Cheque / Demand Draft</option>
                    <option value="Cash">Cash (Counter)</option>
                  </select>
                </div>

                {paymentMode === 'Cheque' ? (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Cheque Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CHQ-890124"
                      value={paymentChequeNo}
                      onChange={e => setPaymentChequeNo(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Txn / UTR Reference</label>
                    <input
                      type="text"
                      placeholder="Optional transaction ID..."
                      value={paymentTxnRef}
                      onChange={e => setPaymentTxnRef(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cashier Remarks / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Term 2 installment 1 cleared at counter..."
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCollectPaymentModalInvoice(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors flex items-center gap-1.5 shadow-2xs`}
                >
                  <Check className="w-4 h-4" />
                  <span>Generate Receipt (₹{partialPaymentAmount.toLocaleString()})</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: OFFICIAL FEE RECEIPT VIEWER & PRINTABLE */}
      {/* ========================================================================= */}
      {viewReceiptModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Official School Fee Receipt
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={() => {
                    showToast(`Receipt PDF saved: ${viewReceiptModalInvoice.receiptNo || 'Receipt'}.pdf`, 'success');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} flex items-center gap-1.5`}
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
                <button
                  onClick={() => setViewReceiptModalInvoice(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formal Receipt Letterhead */}
            <div className="border border-slate-300 p-5 rounded-xl bg-white space-y-4 text-xs font-sans">
              <div className="text-center space-y-1 border-b pb-3 border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-blue-900 text-white font-bold font-serif flex items-center justify-center mx-auto text-lg shadow-sm">
                  GIS
                </div>
                <h3 className="text-base font-bold font-serif text-slate-900 uppercase tracking-tight">
                  Greenfield International School
                </h3>
                <p className="text-[11px] text-slate-500">
                  Affiliated to CBSE, New Delhi (Affiliation No: 1930284 · School Code: 45129)
                </p>
                <p className="text-[10px] text-slate-400">
                  Sector 12, Pradhikaran Campus, Pune, Maharashtra 411044 · accounts@greenfield.edu.in
                </p>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500">Receipt No: </span>
                  <strong className="font-mono text-slate-900">
                    {viewReceiptRecord?.receiptNo || viewReceiptModalInvoice.receiptNo || 'RCP-88310'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Date of Settlement: </span>
                  <strong className="font-mono text-slate-900">
                    {viewReceiptRecord?.paymentDate || viewReceiptModalInvoice.paidDate || '2026-10-14'}
                  </strong>
                </div>
              </div>

              {/* Student Demographics */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <strong className="text-slate-900">{viewReceiptModalInvoice.studentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Standard & Section:</span>
                  <span>Std {viewReceiptModalInvoice.standard}-{viewReceiptModalInvoice.section} (Roll #{students.find(s => s.id === viewReceiptModalInvoice.studentId)?.rollNo || '14'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admission No:</span>
                  <span className="font-mono">{students.find(s => s.id === viewReceiptModalInvoice.studentId)?.admissionNo || 'GIS-2023-0101'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Academic Term:</span>
                  <span>AY 2026–2027 · {viewReceiptModalInvoice.term || 'Term 2'}</span>
                </div>
              </div>

              {/* Fee Particulars Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-semibold text-slate-700">
                    <tr>
                      <th className="py-2 px-3">Fee Particular / Component</th>
                      <th className="py-2 px-3 text-right">Sanctioned</th>
                      <th className="py-2 px-3 text-right">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">{viewReceiptModalInvoice.feeType}</td>
                      <td className="py-2 px-3 font-mono text-right text-slate-600">₹{viewReceiptModalInvoice.amount.toLocaleString()}</td>
                      <td className="py-2 px-3 font-mono text-right font-bold text-slate-900">
                        ₹{(viewReceiptRecord?.amountPaid || viewReceiptModalInvoice.paidAmount || viewReceiptModalInvoice.amount).toLocaleString()}
                      </td>
                    </tr>
                    {viewReceiptModalInvoice.concessionApplied && (
                      <tr className="bg-amber-50/50">
                        <td className="py-1.5 px-3 text-amber-800 text-[11px]">
                          Less Concession: {viewReceiptModalInvoice.concessionType}
                        </td>
                        <td className="py-1.5 px-3 text-right font-mono text-amber-800 text-[11px]">-₹{viewReceiptModalInvoice.concessionApplied.toLocaleString()}</td>
                        <td className="py-1.5 px-3 text-right font-mono text-amber-800 text-[11px]">Adjusted</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td className="py-2 px-3 text-slate-900">Total Cleared in this Transaction:</td>
                      <td colSpan={2} className="py-2 px-3 text-right font-mono text-emerald-700 text-sm">
                        ₹{(viewReceiptRecord?.amountPaid || viewReceiptModalInvoice.paidAmount || viewReceiptModalInvoice.amount).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 text-slate-500 font-normal">Remaining Outstanding Balance:</td>
                      <td colSpan={2} className="py-1.5 px-3 text-right font-mono text-slate-700">
                        ₹{(viewReceiptModalInvoice.remainingBalance ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Settlement Method Details */}
              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                <span>Method: <strong>{viewReceiptRecord?.paymentMethod || viewReceiptModalInvoice.paymentMethod || 'UPI'}</strong></span>
                <span>Txn / Ref: <strong>{viewReceiptRecord?.transactionRef || viewReceiptRecord?.chequeNo || viewReceiptModalInvoice.referenceNo || 'UPI-REF-992144'}</strong></span>
              </div>

              {/* Stamp and Authorization */}
              <div className="pt-6 flex justify-between items-end border-t border-slate-200">
                <div className="text-[10px] text-slate-400">
                  <p>Computer-generated official receipt.</p>
                  <p>Preserve this document for taxation and school records.</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="font-serif italic font-bold text-slate-700 text-sm">
                    {viewReceiptRecord?.collectedBy || 'Mr. David Reynolds'}
                  </div>
                  <div className="border-t border-slate-400 pt-0.5 text-[10px] text-slate-600 uppercase font-semibold">
                    Authorized Bursar / Cashier Seal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RECORD EXPENSE */}
      {/* ========================================================================= */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Record Operational Expenditure</h3>
                  <p className="text-xs text-slate-500">Generate disbursement voucher and adjust department budget</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Expenditure Category *</label>
                <select
                  value={newExpCategory}
                  onChange={e => setNewExpCategory(e.target.value as ExpenseRecord['category'])}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Campus Infrastructure & Utilities">Campus Infrastructure & Utilities</option>
                  <option value="Faculty & Staff Salaries">Faculty & Staff Salaries</option>
                  <option value="Science & Computer Labs">Science & Computer Labs</option>
                  <option value="Library & Learning Resources">Library & Learning Resources</option>
                  <option value="Sports & Co-Curricular">Sports & Co-Curricular</option>
                  <option value="School Transport & Fleet">School Transport & Fleet</option>
                  <option value="Repairs & Facility Maintenance">Repairs & Facility Maintenance</option>
                  <option value="Administration & Compliance">Administration & Compliance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Vendor / Payee Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Scientific Labs Ltd"
                    value={newExpVendor}
                    onChange={e => setNewExpVendor(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={newExpAmount}
                    onChange={e => setNewExpAmount(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description / Requisition Details *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Items procured, service rendered, or departmental requisition..."
                  value={newExpDesc}
                  onChange={e => setNewExpDesc(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Expense Date</label>
                  <input
                    type="date"
                    required
                    value={newExpDate}
                    onChange={e => setNewExpDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={newExpPayMethod}
                    onChange={e => setNewExpPayMethod(e.target.value as ExpenseRecord['paymentMethod'])}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="NetBanking">NetBanking / NEFT</option>
                    <option value="Cheque">Bank Cheque</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash Voucher</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Vendor Bill Ref #</label>
                  <input
                    type="text"
                    placeholder="e.g. INV-9941"
                    value={newExpBillNo}
                    onChange={e => setNewExpBillNo(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono text-[11px]"
                  />
                </div>
              </div>

              {newExpAmount >= 25000 && !isPrincipal && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    Disbursements above ₹25,000 are recorded as <strong>Pending Approval</strong> and forwarded to Dr. Evelyn Montgomery (Principal) for formal endorsement before fund release.
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors flex items-center gap-1.5`}
                >
                  <Check className="w-4 h-4" />
                  <span>Issue Voucher (₹{newExpAmount.toLocaleString()})</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW PAYMENT VOUCHER */}
      {/* ========================================================================= */}
      {viewVoucherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-700" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Official Payment Voucher</h3>
                  <p className="text-xs text-slate-500 font-mono">{viewVoucherModal.voucherNo}</p>
                </div>
              </div>
              <button
                onClick={() => setViewVoucherModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 space-y-3 text-xs bg-slate-50/50">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Payee / Vendor:</span>
                <strong className="text-slate-900">{viewVoucherModal.vendorName}</strong>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Head of Account:</span>
                <span className="font-semibold text-slate-800">{viewVoucherModal.category}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Voucher Amount:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">₹{viewVoucherModal.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-mono">{viewVoucherModal.paymentMethod} (Ref: {viewVoucherModal.chequeOrRefNo})</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Vendor Bill Ref:</span>
                <span className="font-mono">{viewVoucherModal.invoiceBillNo}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Approval Status:</span>
                <span className="font-bold uppercase text-emerald-700">{viewVoucherModal.status}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Particulars:</span>
                <p className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700">
                  {viewVoucherModal.description}
                </p>
              </div>
              <div className="pt-2 text-[11px] text-slate-500 flex justify-between">
                <span>Recorded By: {viewVoucherModal.recordedBy}</span>
                <span>Endorsed By: {viewVoucherModal.approvedBy || 'Pending'}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  showToast(`Voucher ${viewVoucherModal.voucherNo} sent to printer.`, 'success');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Voucher
              </button>
              <button
                onClick={() => setViewVoucherModal(null)}
                className={`px-4 py-1.5 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: GRANT CONCESSION */}
      {/* ========================================================================= */}
      {showAddConcessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Grant Fee Concession / Scholarship</h3>
                  <p className="text-xs text-slate-500">Apply institutional fee waiver to student ledger</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddConcessionModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddConcessionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Beneficiary Student *</label>
                <select
                  value={concessionStudentId}
                  onChange={e => setConcessionStudentId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Std {s.standard}-{s.section}, Roll #{s.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Concession Category *</label>
                <select
                  value={concessionType}
                  onChange={e => setConcessionType(e.target.value as FeeConcession['concessionType'])}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Merit Scholarship">Merit Scholarship (Board Rank / Scholastic Topper)</option>
                  <option value="Sibling Discount">Sibling Policy (Second Enrolled Ward)</option>
                  <option value="Staff Ward Concession">Staff Ward Concession</option>
                  <option value="EWS / Need-Based Waiver">EWS / State Trust Financial Aid</option>
                  <option value="Sports & Arts Excellence">Sports & Arts Excellence Award</option>
                  <option value="Special Management Discretion">Special Management Discretion</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Benefit Mode</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed">Fixed Deduction (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {discountType === 'percentage' ? 'Percentage (e.g. 15%)' : 'Amount (₹)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={discountType === 'percentage' ? 100 : 50000}
                    value={discountValue}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Justification & Official Reason *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Record board approval, certificate verification, or trust resolution..."
                  value={concessionReason}
                  onChange={e => setConcessionReason(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddConcessionModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors flex items-center gap-1.5`}
                >
                  <Check className="w-4 h-4" />
                  <span>Authorize Concession</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BATCH ASSIGN FEE STRUCTURE */}
      {/* ========================================================================= */}
      {showBatchAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-700" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Batch Assign Fee Structure</h3>
                  <p className="text-xs text-slate-500">Auto-generate Term 2 student invoices with concessions</p>
                </div>
              </div>
              <button
                onClick={() => setShowBatchAssignModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBatchAssignSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Choose Fee Structure Tier</label>
                <select
                  value={batchStructureId}
                  onChange={e => setBatchStructureId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  {feeStructures.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.tierName} (₹{s.totalAnnualAmount.toLocaleString()}/yr)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Standard (Grade)</label>
                  <select
                    value={batchStandard}
                    onChange={e => setBatchStandard(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                      <option key={s} value={s}>Standard {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Section</label>
                  <select
                    value={batchSection}
                    onChange={e => setBatchSection(e.target.value as 'A' | 'B' | 'all')}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="all">All Sections (A & B)</option>
                    <option value="A">Section A Only</option>
                    <option value="B">Section B Only</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1 text-[11px]">
                <span className="font-bold block">Batch Processing Rules:</span>
                <p>
                  - Automatically applies active scholarships and concessions for matching students.
                  <br />- Skips students who already have an existing Term 2 invoice to prevent duplicate billing.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBatchAssignModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors flex items-center gap-1.5`}
                >
                  <Check className="w-4 h-4" />
                  <span>Execute Invoicing</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SEND PAYMENT REMINDER */}
      {/* ========================================================================= */}
      {reminderModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-rose-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Send Payment Reminder</h3>
                  <p className="text-xs text-slate-500 font-mono">Invoice: {reminderModalInvoice.invoiceNo}</p>
                </div>
              </div>
              <button
                onClick={() => setReminderModalInvoice(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendReminderSubmit} className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <strong>{reminderModalInvoice.studentName} (Std {reminderModalInvoice.standard}-{reminderModalInvoice.section})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Outstanding:</span>
                  <strong className="text-rose-700 font-mono">₹{(reminderModalInvoice.remainingBalance ?? reminderModalInvoice.amount).toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Parent Contact:</span>
                  <span className="font-mono">{students.find(s => s.id === reminderModalInvoice.studentId)?.parentPhone || '+91 98450 11223'}</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Dispatch Channel</label>
                <select
                  value={reminderChannel}
                  onChange={e => setReminderChannel(e.target.value as typeof reminderChannel)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="SMS">SMS Notification (Priority Gateway)</option>
                  <option value="WhatsApp">WhatsApp Business Message</option>
                  <option value="Email">Official Email Statement</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-700 block text-[11px]">Message Template Preview:</span>
                <p className="text-slate-600 text-[11px] leading-relaxed italic">
                  "Dear Parent, fee invoice {reminderModalInvoice.invoiceNo} for {reminderModalInvoice.studentName} has an outstanding dues of ₹{(reminderModalInvoice.remainingBalance ?? reminderModalInvoice.amount).toLocaleString()}. Due Date: {reminderModalInvoice.dueDate}. Please clear at earliest via Greenfield portal."
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReminderModalInvoice(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white rounded-xl bg-rose-600 hover:bg-rose-700 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADJUST BUDGET ALLOCATION */}
      {/* ========================================================================= */}
      {adjustingBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-700" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Adjust Department Budget</h3>
                  <p className="text-xs text-slate-500">{adjustingBudget.categoryName}</p>
                </div>
              </div>
              <button
                onClick={() => setAdjustingBudget(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustBudgetSubmit} className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Spent:</span>
                  <span className="font-mono font-bold text-slate-900">₹{adjustingBudget.spentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department Head:</span>
                  <span>{adjustingBudget.departmentHead}</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">New Allocated Limit (₹) *</label>
                <input
                  type="number"
                  required
                  min={adjustingBudget.spentAmount}
                  value={newBudgetAllocated}
                  onChange={e => setNewBudgetAllocated(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alert Threshold (%)</label>
                <input
                  type="number"
                  required
                  min={50}
                  max={95}
                  value={newBudgetThreshold}
                  onChange={e => setNewBudgetThreshold(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Triggers visual warning badge when spent exceeds this percentage.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingBudget(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${themeClasses.primaryBg} ${themeClasses.primaryHoverBg} transition-colors flex items-center gap-1.5`}
                >
                  <Check className="w-4 h-4" />
                  <span>Update Allocation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
