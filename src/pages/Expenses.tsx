import { useEffect, useMemo, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AppIcon, type AppIconName } from '../components/ui/AppIcon'
import { FormField } from '../components/ui/FormField'
import { PageActions } from '../components/ui/PageActions'
import { Panel } from '../components/ui/Panel'
import { showToast } from '../utils/toast'

type ExpensesProps = {
  onViewChange: (view: 'list' | 'add') => void
  searchQuery: string
  view: 'list' | 'add'
}

type ExpenseRow = {
  id: number
  name: string
  category: ExpenseCategory
  amount: number
  payment: PaymentMethod
  date: string
  notes: string
}

type ExpenseCategory = 'Inventory' | 'Shop rent' | 'Utilities' | 'Salaries' | 'Transport' | 'Maintenance' | 'Miscellaneous'
type PaymentMethod = 'Cash' | 'UPI' | 'Card'
type ExpenseRange = 'W' | 'M' | 'Y'
type ExpenseDropdownId = 'category' | 'payment' | 'date'

const categoryOptions: Array<{ name: ExpenseCategory; tone: string; icon: string }> = [
  { name: 'Inventory', tone: 'blue', icon: 'box' },
  { name: 'Shop rent', tone: 'amber', icon: 'home' },
  { name: 'Utilities', tone: 'rose', icon: 'bolt' },
  { name: 'Salaries', tone: 'green', icon: 'people' },
  { name: 'Transport', tone: 'violet', icon: 'truck' },
  { name: 'Maintenance', tone: 'red', icon: 'tools' },
  { name: 'Miscellaneous', tone: 'gray', icon: 'more' },
]

const paymentOptions: Array<{ name: PaymentMethod; tone: string; icon: string }> = [
  { name: 'Cash', tone: 'green', icon: 'cash' },
  { name: 'UPI', tone: 'violet', icon: 'phone' },
  { name: 'Card', tone: 'blue', icon: 'card' },
]

const initialExpenses: ExpenseRow[] = [
  { id: 1, name: 'Weekly inventory restock', category: 'Inventory', amount: 8400, payment: 'UPI', date: '15 May 2026', notes: 'Restocked groceries and dairy' },
  { id: 2, name: 'Staff salaries - May', category: 'Salaries', amount: 5200, payment: 'Card', date: '15 May 2026', notes: '2 staff members' },
  { id: 3, name: 'Shop rent - May', category: 'Shop rent', amount: 2500, payment: 'Cash', date: '10 May 2026', notes: 'Monthly rent paid' },
  { id: 4, name: 'Electricity bill', category: 'Utilities', amount: 900, payment: 'UPI', date: '12 May 2026', notes: 'TNEB bill, April cycle' },
  { id: 5, name: 'Delivery charges', category: 'Transport', amount: 320, payment: 'Card', date: '11 May 2026', notes: 'Delivery to 3 customers' },
  { id: 6, name: 'Shelf maintenance', category: 'Maintenance', amount: 180, payment: 'Cash', date: '11 May 2026', notes: 'Repaired 2 shelf brackets' },
]

const breakdownData = [
  { name: 'Inventory purchases', category: 'Inventory', value: 23000, color: '#3B6EF8' },
  { name: 'Staff salaries', category: 'Salaries', value: 5200, color: '#5b22e8' },
  { name: 'Shop rent', category: 'Shop rent', value: 2500, color: '#ff9d00' },
  { name: 'Utilities', category: 'Utilities', value: 900, color: '#00b82e' },
  { name: 'Other', category: 'Miscellaneous', value: 500, color: '#ff3030' },
]

const dailyExpenseData: Record<ExpenseRange, Array<{ date: string; amount: number }>> = {
  W: [
    { date: 'May 10', amount: 800 },
    { date: 'May 11', amount: 1180 },
    { date: 'May 12', amount: 960 },
    { date: 'May 13', amount: 2380 },
    { date: 'May 14', amount: 640 },
    { date: 'May 15', amount: 440 },
    { date: 'May 16', amount: 1580 },
  ],
  M: [
    { date: 'Week 1', amount: 7200 },
    { date: 'Week 2', amount: 8400 },
    { date: 'Week 3', amount: 6900 },
    { date: 'Week 4', amount: 9600 },
  ],
  Y: [
    { date: 'Jan', amount: 28000 },
    { date: 'Feb', amount: 31000 },
    { date: 'Mar', amount: 26500 },
    { date: 'Apr', amount: 34800 },
    { date: 'May', amount: 32100 },
    { date: 'Jun', amount: 29200 },
  ],
}

const currencyFormatter = new Intl.NumberFormat('en-IN')

const expenseTooltipFormatter = (value: unknown) => [`Rs${currencyFormatter.format(Number(value || 0))}`, 'Amount']
const expenseDateOptions = ['This month', 'Last month', 'This year']

function parseExpenseDate(value: string) {
  const parsedDate = new Date(value)
  return Number.isNaN(parsedDate.getTime()) ? new Date(2026, 4, 14) : parsedDate
}

export function Expenses({ onViewChange, searchQuery, view }: ExpensesProps) {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [paymentFilter, setPaymentFilter] = useState('All Payment Modes')
  const [dateFilter, setDateFilter] = useState('This month')
  const [range, setRange] = useState<ExpenseRange>('W')
  const [editingExpense, setEditingExpense] = useState<ExpenseRow | null>(null)
  const [openDropdown, setOpenDropdown] = useState<ExpenseDropdownId | null>(null)
  const filterRowRef = useRef<HTMLDivElement | null>(null)

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const filteredExpenses = useMemo(
    () =>
      expenses.filter((expense) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          expense.name.toLowerCase().includes(normalizedSearch) ||
          expense.category.toLowerCase().includes(normalizedSearch) ||
          expense.payment.toLowerCase().includes(normalizedSearch) ||
          expense.notes.toLowerCase().includes(normalizedSearch)
        const matchesCategory = categoryFilter === 'All Categories' || expense.category === categoryFilter
        const matchesPayment = paymentFilter === 'All Payment Modes' || expense.payment === paymentFilter
        const matchesDate =
          dateFilter === 'This year' ||
          (dateFilter === 'This month' && expense.date.includes('May 2026')) ||
          (dateFilter === 'Last month' && expense.date.includes('Apr 2026'))
        return matchesSearch && matchesCategory && matchesPayment && matchesDate
      }),
    [categoryFilter, dateFilter, expenses, normalizedSearch, paymentFilter],
  )

  function deleteExpense(id: number) {
    setExpenses((currentExpenses) => currentExpenses.filter((expense) => expense.id !== id))
    showToast('Expense deleted successfully.', 'error')
  }

  function resetFilters() {
    setCategoryFilter('All Categories')
    setPaymentFilter('All Payment Modes')
    setDateFilter('This month')
    showToast('Expense filters reset.', 'info')
  }

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (openDropdown && !filterRowRef.current?.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openDropdown])

  function openEditExpense(expense: ExpenseRow) {
    setEditingExpense(expense)
    onViewChange('add')
    showToast('Expense opened for editing.', 'info')
  }

  function saveExpense(expense: ExpenseRow) {
    setExpenses((currentExpenses) => {
      const existingExpense = currentExpenses.find((item) => item.id === expense.id)
      if (existingExpense) {
        return currentExpenses.map((item) => (item.id === expense.id ? expense : item))
      }
      return [expense, ...currentExpenses]
    })
    setEditingExpense(null)
    onViewChange('list')
    showToast(expense.id === editingExpense?.id ? 'Expense updated successfully.' : 'Expense added successfully.', 'success')
  }

  if (view === 'add') {
    return (
      <AddExpenseView
        expense={editingExpense}
        onCancel={() => {
          setEditingExpense(null)
          onViewChange('list')
        }}
        onSave={saveExpense}
      />
    )
  }

  return (
    <section className="expenses-page">
      <div className="expense-metric-grid">
        <Panel className="expense-metric-card">
          <span>Total expenses</span>
          <strong>Rs32,100</strong>
          <small><b>+8.2%</b> vs last month</small>
          <ExpenseMetricIcon tone="blue" icon="receipt" />
        </Panel>
        <Panel className="expense-metric-card">
          <span>Average daily expense</span>
          <strong>Rs1,036</strong>
          <small><b>+3.4%</b> vs last month</small>
          <ExpenseMetricIcon tone="amber" icon="warning" />
        </Panel>
      </div>

      <div className="expense-chart-grid">
        <Panel className="expense-breakdown-panel">
          <div className="panel-header compact"><h2>Category breakdown</h2><span>May 2026</span></div>
          <div className="expense-donut-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip formatter={expenseTooltipFormatter} />
                <Pie data={breakdownData} dataKey="value" innerRadius={68} outerRadius={112} paddingAngle={0}>
                  {breakdownData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="expense-legend-list">
            {breakdownData.map((item) => (
              <div key={item.name}>
                <span><i style={{ background: item.color }}></i>{item.name}</span>
                <strong>Rs{currencyFormatter.format(item.value)}</strong>
                <small>{((item.value / 32100) * 100).toFixed(1)}%</small>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="daily-expense-panel">
          <div className="panel-header compact">
            <div><h2>Daily expenses</h2><span>Last 7 days</span></div>
            <div className="expense-range-tabs">
              {(['W', 'M', 'Y'] as ExpenseRange[]).map((item) => (
                <button className={range === item ? 'active' : ''} key={item} type="button" onClick={() => setRange(item)}>{item}</button>
              ))}
            </div>
          </div>
          <div className="daily-expense-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyExpenseData[range]} margin={{ top: 18, right: 6, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#d9d9d9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `Rs${value}`} />
                <Tooltip formatter={expenseTooltipFormatter} labelStyle={{ color: '#111111' }} />
                <Bar dataKey="amount" fill="#3B6EF8" barSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel className="expenses-list-panel">
        <h2>Expenses list</h2>
        <div className="expense-filter-row" ref={filterRowRef}>
          <ExpenseDropdown
            id="category"
            openDropdown={openDropdown}
            options={['All Categories', ...categoryOptions.map((category) => category.name)]}
            value={categoryFilter}
            onChange={setCategoryFilter}
            onOpenChange={setOpenDropdown}
          />
          <ExpenseDropdown
            id="payment"
            openDropdown={openDropdown}
            options={['All Payment Modes', ...paymentOptions.map((payment) => payment.name)]}
            value={paymentFilter}
            onChange={setPaymentFilter}
            onOpenChange={setOpenDropdown}
          />
          <ExpenseDropdown
            id="date"
            openDropdown={openDropdown}
            options={expenseDateOptions}
            value={dateFilter}
            onChange={setDateFilter}
            onOpenChange={setOpenDropdown}
          />
          <button className="expense-reset-filter" type="button" onClick={resetFilters}>Reset</button>
        </div>

        <div className="expense-table">
          <div>
            <span>Expense Name</span><span>Category</span><span>Amount</span><span>Payment</span><span>Date</span><span>Notes</span><span>Actions</span>
          </div>
          {filteredExpenses.map((expense) => (
            <div key={expense.id}>
              <strong>{expense.name}</strong>
              <a href="#" onClick={(event) => {
                event.preventDefault()
                setCategoryFilter(expense.category)
              }}>{expense.category}</a>
              <span>Rs{currencyFormatter.format(expense.amount)}</span>
              <span>{expense.payment}</span>
              <span>{expense.date}</span>
              <span>{expense.notes}</span>
              <div className="expense-row-actions">
                <button type="button" onClick={() => openEditExpense(expense)} aria-label={`Edit ${expense.name}`}>
                  <AppIcon name="pencil" />
                </button>
                <button type="button" onClick={() => deleteExpense(expense.id)} aria-label={`Delete ${expense.name}`}>
                  <AppIcon name="trash" />
                </button>
              </div>
            </div>
          ))}
          {filteredExpenses.length === 0 && (
            <div className="expense-empty-row">
              <strong>No expenses found</strong>
              <span>Try changing filters or search.</span>
            </div>
          )}
        </div>
        <div className="table-footer">
          <span>Showing 1 - {filteredExpenses.length} of 31 Expenses</span>
          <div className="pagination"><button type="button" disabled>&lt;</button><button className="active" type="button">1</button><button type="button">2</button><button type="button">...</button><button type="button">6</button><button type="button">&gt;</button></div>
        </div>
      </Panel>
    </section>
  )
}

function AddExpenseView({
  expense,
  onCancel,
  onSave,
}: {
  expense: ExpenseRow | null
  onCancel: () => void
  onSave: (expense: ExpenseRow) => void
}) {
  const [title, setTitle] = useState(expense?.name || '')
  const [amount, setAmount] = useState(expense ? String(expense.amount) : '')
  const [date, setDate] = useState<Date | null>(expense ? parseExpenseDate(expense.date) : new Date(2026, 4, 14))
  const [category, setCategory] = useState<ExpenseCategory>(expense?.category || 'Utilities')
  const [payment, setPayment] = useState<PaymentMethod>(expense?.payment || 'UPI')
  const [notes, setNotes] = useState(expense?.notes || '')

  const previewDate = date ? date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '---'
  const saveLabel = expense ? 'Save Expense' : 'Add Expense'

  useEffect(() => {
    setTitle(expense?.name || '')
    setAmount(expense ? String(expense.amount) : '')
    setDate(expense ? parseExpenseDate(expense.date) : new Date(2026, 4, 14))
    setCategory(expense?.category || 'Utilities')
    setPayment(expense?.payment || 'UPI')
    setNotes(expense?.notes === '---' ? '' : expense?.notes || '')
  }, [expense])

  function handleSave() {
    const parsedAmount = Number(amount.replace(/[^\d.]/g, ''))
    if (!title.trim()) {
      showToast('Expense title is required.', 'error')
      return
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      showToast('Enter a valid expense amount.', 'error')
      return
    }

    onSave({
      id: expense?.id || Date.now(),
      name: title.trim(),
      category,
      amount: parsedAmount,
      payment,
      date: previewDate,
      notes: notes.trim() || '---',
    })
  }

  useEffect(() => {
    function handleExternalSave() {
      handleSave()
    }

    window.addEventListener('expenses:save', handleExternalSave)
    return () => window.removeEventListener('expenses:save', handleExternalSave)
  })

  return (
    <section className="add-expense-page">
      <div className="add-expense-main">
        <Panel className="expense-form-panel">
          <h2>Expense details</h2>
          <FormField label="Expense title" className="full"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Electricity Bill" /></FormField>
          <div className="product-form-grid">
            <FormField label="Amount (Rs)"><input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Rs 0.0" /></FormField>
            <FormField label="Date"><DatePicker calendarClassName="app-date-picker-calendar" className="date-picker-input" selected={date} onChange={(nextDate: Date | null) => setDate(nextDate)} dateFormat="dd/MM/yyyy" showPopperArrow={false} /></FormField>
          </div>
        </Panel>

        <Panel className="expense-form-panel">
          <h2>Category</h2>
          <div className="expense-category-grid">
            {categoryOptions.map((item) => (
              <button className={category === item.name ? 'expense-choice-card active' : 'expense-choice-card'} key={item.name} type="button" onClick={() => setCategory(item.name)}>
                <ExpenseChoiceIcon tone={item.tone} icon={item.icon} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="expense-form-panel">
          <h2>Payment method</h2>
          <div className="expense-payment-grid">
            {paymentOptions.map((item) => (
              <button className={payment === item.name ? 'expense-payment-card active' : 'expense-payment-card'} key={item.name} type="button" onClick={() => setPayment(item.name)}>
                <ExpenseChoiceIcon tone={item.tone} icon={item.icon} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="expense-form-panel">
          <h2>Notes</h2>
          <FormField label="Additional notes (optional)">
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Any additional details about the expense..." rows={3}></textarea>
          </FormField>
        </Panel>
        <PageActions onCancel={onCancel} onSave={handleSave} saveLabel={saveLabel} />
      </div>

      <aside className="expense-preview-panel">
        <Panel>
          <h2>Expense preview</h2>
          <div className="expense-preview-summary">
            <span>Rs</span>
            <div><strong>{amount ? `Rs${amount}` : 'Rs'}</strong><p>Fill in the details to preview</p></div>
          </div>
          <PreviewRow label="Title" value={title || '---'} />
          <PreviewRow label="Category" value={category} />
          <PreviewRow label="Amount" value={amount ? `Rs${amount}` : '---'} />
          <PreviewRow label="Payment" value={payment} />
          <PreviewRow label="Date" value={previewDate} />
          <PreviewRow label="Notes" value={notes || '---'} />
        </Panel>
      </aside>
    </section>
  )
}

function ExpenseDropdown({
  id,
  openDropdown,
  options,
  value,
  onChange,
  onOpenChange,
}: {
  id: ExpenseDropdownId
  openDropdown: ExpenseDropdownId | null
  options: string[]
  value: string
  onChange: (value: string) => void
  onOpenChange: (id: ExpenseDropdownId | null) => void
}) {
  const isOpen = openDropdown === id

  return (
    <div className={isOpen ? 'filter-control expense-filter-control open' : 'filter-control expense-filter-control'}>
      <button
        className="filter-trigger"
        type="button"
        aria-expanded={isOpen}
        onClick={() => onOpenChange(isOpen ? null : id)}
      >
        <strong>{value}</strong>
        <ChevronIcon />
      </button>
      {isOpen && (
        <div className="filter-menu" role="listbox" aria-label={value}>
          {options.map((option) => (
            <button
              className={option === value ? 'filter-option selected' : 'filter-option'}
              key={option}
              type="button"
              onClick={() => {
                onChange(option)
                onOpenChange(null)
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ChevronIcon() {
  return <AppIcon name="chevron" />
}

function ExpenseMetricIcon({ icon, tone }: { icon: string; tone: string }) {
  return (
    <span className={`expense-metric-icon ${tone}`}>
      <ExpenseSvg icon={icon} />
    </span>
  )
}

function ExpenseChoiceIcon({ icon, tone }: { icon: string; tone: string }) {
  return (
    <span className={`expense-choice-icon ${tone}`}>
      <ExpenseSvg icon={icon} />
    </span>
  )
}

function ExpenseSvg({ icon }: { icon: string }) {
  const iconMap: Record<string, AppIconName> = {
    warning: 'alert',
    home: 'home',
    bolt: 'zap',
    people: 'users',
    truck: 'truck',
    tools: 'wrench',
    more: 'more',
    cash: 'cash',
    phone: 'smartphone',
    card: 'credit-card',
    box: 'box',
  }

  return <AppIcon name={iconMap[icon] || 'box'} />
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return <div className="preview-row"><span>{label}</span><strong>{value}</strong></div>
}

