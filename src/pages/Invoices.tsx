import { useEffect, useMemo, useRef, useState } from 'react'
import { AppIcon, type AppIconName } from '../components/ui/AppIcon'
import { FormField } from '../components/ui/FormField'
import { PageActions } from '../components/ui/PageActions'
import { Panel } from '../components/ui/Panel'

type InvoicesProps = {
  onViewChange: (view: 'list' | 'generate' | 'detail') => void
  searchQuery: string
  view: 'list' | 'generate' | 'detail'
}

type InvoiceStatus = 'Paid' | 'Pending'
type InvoiceDropdownId = 'status' | 'month' | 'sort' | 'currency'

type InvoiceRow = {
  id: string
  customer: string
  orderId: string
  amount: number
  status: InvoiceStatus
  date: string
  payment: string
  phone: string
  address: string
  items: Array<{ name: string; price: number; qty: number }>
}

type OrderRow = {
  id: string
  customer: string
  amount: number
  date: string
  payment: string
  status: InvoiceStatus
  items: Array<{ name: string; price: number; qty: number }>
}

const initialInvoices: InvoiceRow[] = [
  {
    id: 'INV-2026-0094',
    customer: 'Priya S',
    orderId: '#ORD-8821',
    amount: 340,
    status: 'Paid',
    date: '09 May 2026',
    payment: 'UPI',
    phone: '+91 98765 43210',
    address: '14, Gandhi Street, Tiruppur, TN 641601',
    items: [
      { name: 'Tata Salt 1kg', price: 28, qty: 2 },
      { name: 'Aashirvaad Atta 5kg', price: 265, qty: 1 },
    ],
  },
  {
    id: 'INV-2026-0097',
    customer: 'Rohan V',
    orderId: '#ORD-8824',
    amount: 1950,
    status: 'Pending',
    date: '12 May 2026',
    payment: 'Card',
    phone: '+91 91234 57890',
    address: '42, Cross Cut Road, Coimbatore, TN 641012',
    items: [
      { name: 'Rice Bag 10kg', price: 850, qty: 2 },
      { name: 'Cooking Oil 1L', price: 250, qty: 1 },
    ],
  },
  {
    id: 'INV-2026-0095',
    customer: 'Arjun M',
    orderId: '#ORD-8822',
    amount: 1250,
    status: 'Pending',
    date: '10 May 2026',
    payment: 'Cash',
    phone: '+91 90000 11122',
    address: '18, Lake View Road, Salem, TN 636001',
    items: [
      { name: 'Dove Soap 3pcs', price: 180, qty: 2 },
      { name: 'Patanjali Honey 500g', price: 245, qty: 2 },
      { name: 'Amul Butter 200g', price: 120, qty: 3 },
    ],
  },
  {
    id: 'INV-2026-0096',
    customer: 'Meera K',
    orderId: '#ORD-8823',
    amount: 560,
    status: 'Paid',
    date: '11 May 2026',
    payment: 'UPI',
    phone: '+91 81234 56789',
    address: '6, Park Avenue, Erode, TN 638001',
    items: [
      { name: 'Amul Butter 500g', price: 240, qty: 1 },
      { name: 'Maggi Noodles 12pcs', price: 160, qty: 2 },
    ],
  },
  {
    id: 'INV-2026-0098',
    customer: 'Anjali P',
    orderId: '#ORD-8825',
    amount: 780,
    status: 'Paid',
    date: '13 May 2026',
    payment: 'UPI',
    phone: '+91 77889 44556',
    address: '9, Market Road, Madurai, TN 625001',
    items: [
      { name: 'Aashirvaad Atta 5kg', price: 265, qty: 2 },
      { name: 'Tata Salt 1kg', price: 28, qty: 4 },
    ],
  },
]

const orderOptions: OrderRow[] = [
  {
    id: '#ORD-8821',
    customer: 'Arjun Natarajan',
    amount: 337,
    date: '09 May 2026',
    payment: 'UPI - Paid',
    status: 'Paid',
    items: [
      { name: 'Tata Salt 1kg', price: 28, qty: 2 },
      { name: 'Aashirvaad Atta 5kg', price: 265, qty: 1 },
    ],
  },
  {
    id: '#ORD-8822',
    customer: 'Amit R',
    amount: 450,
    date: '10 May 2026',
    payment: 'Credit Card - Paid',
    status: 'Paid',
    items: [
      { name: 'Dove Soap 3pcs', price: 180, qty: 1 },
      { name: 'Patanjali Honey 500g', price: 135, qty: 2 },
    ],
  },
  {
    id: '#ORD-8823',
    customer: 'Sneha M',
    amount: 520,
    date: '11 May 2026',
    payment: 'UPI - Paid',
    status: 'Paid',
    items: [
      { name: 'Amul Butter 500g', price: 240, qty: 1 },
      { name: 'Maggi Noodles 12pcs', price: 140, qty: 2 },
    ],
  },
]

const statusOptions = ['All Statuses', 'Paid', 'Pending']
const monthOptions = ['This Month', 'Last Month', 'This Year']
const sortOptions = ['Sort: Newest First', 'Sort: Oldest First', 'Sort: Amount High', 'Sort: Amount Low']
const currencyOptions = ['INR (Rs)', 'USD ($)', 'AED']
const moneyFormatter = new Intl.NumberFormat('en-IN')

export function Invoices({ onViewChange, searchQuery, view }: InvoicesProps) {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(initialInvoices[0].id)
  const [selectedOrderId, setSelectedOrderId] = useState(orderOptions[0].id)
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [monthFilter, setMonthFilter] = useState('This Month')
  const [sortFilter, setSortFilter] = useState('Sort: Newest First')
  const [openDropdown, setOpenDropdown] = useState<InvoiceDropdownId | null>(null)
  const [feedback, setFeedback] = useState('')
  const filterRef = useRef<HTMLDivElement | null>(null)

  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId) || invoices[0]
  const selectedOrder = orderOptions.find((order) => order.id === selectedOrderId) || orderOptions[0]

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()
    const visibleInvoices = invoices.filter((invoice) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        invoice.id.toLowerCase().includes(normalizedSearch) ||
        invoice.customer.toLowerCase().includes(normalizedSearch) ||
        invoice.orderId.toLowerCase().includes(normalizedSearch)
      const matchesStatus = statusFilter === 'All Statuses' || invoice.status === statusFilter
      return matchesSearch && matchesStatus
    })

    return [...visibleInvoices].sort((first, second) => {
      if (sortFilter === 'Sort: Amount High') return second.amount - first.amount
      if (sortFilter === 'Sort: Amount Low') return first.amount - second.amount
      if (sortFilter === 'Sort: Oldest First') return first.id.localeCompare(second.id)
      return second.id.localeCompare(first.id)
    })
  }, [invoices, searchQuery, sortFilter, statusFilter])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (openDropdown && !filterRef.current?.contains(event.target as Node)) {
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

  useEffect(() => {
    function handleSave() {
      createInvoiceFromOrder()
    }

    function handleShare() {
      showFeedback('Invoice share link copied')
    }

    function handleDownload() {
      showFeedback('Invoice PDF is ready')
    }

    window.addEventListener('invoices:save', handleSave)
    window.addEventListener('invoices:share', handleShare)
    window.addEventListener('invoices:download', handleDownload)
    return () => {
      window.removeEventListener('invoices:save', handleSave)
      window.removeEventListener('invoices:share', handleShare)
      window.removeEventListener('invoices:download', handleDownload)
    }
  })

  function showFeedback(message: string) {
    setFeedback(message)
    window.setTimeout(() => setFeedback(''), 1800)
  }

  function createInvoiceFromOrder() {
    const nextInvoice: InvoiceRow = {
      id: 'INV-2026-0094',
      customer: selectedOrder.customer,
      orderId: selectedOrder.id,
      amount: selectedOrder.amount,
      status: selectedOrder.status,
      date: selectedOrder.date,
      payment: selectedOrder.payment.split(' - ')[0],
      phone: '+91 123 465 7890',
      address: 'Flat No. 3B, Venkatasamy Road West, Coimbatore - 641002',
      items: selectedOrder.items,
    }
    setInvoices((currentInvoices) => {
      const withoutDuplicate = currentInvoices.filter((invoice) => invoice.id !== nextInvoice.id)
      return [nextInvoice, ...withoutDuplicate]
    })
    setSelectedInvoiceId(nextInvoice.id)
    onViewChange('detail')
  }

  function deleteInvoice(invoiceId: string) {
    setInvoices((currentInvoices) => currentInvoices.filter((invoice) => invoice.id !== invoiceId))
    setSelectedInvoiceId(invoices.find((invoice) => invoice.id !== invoiceId)?.id || initialInvoices[0].id)
    onViewChange('list')
  }

  if (view === 'generate') {
    return (
      <GenerateInvoiceView
        openDropdown={openDropdown}
        selectedOrder={selectedOrder}
        selectedOrderId={selectedOrderId}
        onCancel={() => onViewChange('list')}
        onGenerate={createInvoiceFromOrder}
        onOpenDropdown={setOpenDropdown}
        onSelectOrder={setSelectedOrderId}
      />
    )
  }

  if (view === 'detail') {
    return (
      <InvoiceDetailView
        invoice={selectedInvoice}
        feedback={feedback}
        onBack={() => onViewChange('list')}
        onDelete={() => deleteInvoice(selectedInvoice.id)}
        onDownload={() => showFeedback('Invoice PDF is ready')}
        onPrint={() => window.print()}
        onShare={() => showFeedback('Invoice share link copied')}
      />
    )
  }

  return (
    <section className="invoices-page">
      {feedback && <div className="inline-feedback">{feedback}</div>}
      <div className="invoice-metric-grid">
        <InvoiceMetric label="Total invoices" value="1,284" note="All time" tone="blue" icon="file" />
        <InvoiceMetric label="Invoices this month" value="94" note="May 2026" tone="violet" icon="calendar" />
        <InvoiceMetric label="Paid invoices" value="87" note="This month" tone="green" icon="check" />
        <InvoiceMetric label="Pending invoices" value="7" note="Awaiting payment" tone="amber" icon="clock" />
      </div>

      <Panel className="invoice-list-panel">
        <h2>Invoice list</h2>
        <div className="invoice-filter-row" ref={filterRef}>
          <InvoiceDropdown id="status" openDropdown={openDropdown} options={statusOptions} value={statusFilter} onChange={setStatusFilter} onOpenChange={setOpenDropdown} />
          <InvoiceDropdown id="month" openDropdown={openDropdown} options={monthOptions} value={monthFilter} onChange={setMonthFilter} onOpenChange={setOpenDropdown} />
          <InvoiceDropdown id="sort" openDropdown={openDropdown} options={sortOptions} value={sortFilter} onChange={setSortFilter} onOpenChange={setOpenDropdown} />
        </div>

        <div className="invoice-table">
          <div className="invoice-table-head">
            <span>Invoice No.</span>
            <span>Customer</span>
            <span>Order ID</span>
            <span>Total Amount</span>
            <span>Status</span>
            <span>Invoice Date</span>
            <span>Actions</span>
          </div>
          {filteredInvoices.map((invoice) => (
            <div className="invoice-table-row" key={invoice.id}>
              <button
                className="invoice-link"
                type="button"
                onClick={() => {
                  setSelectedInvoiceId(invoice.id)
                  onViewChange('detail')
                }}
              >
                {invoice.id}
              </button>
              <span>{invoice.customer}</span>
              <span>{invoice.orderId}</span>
              <strong>Rs{moneyFormatter.format(invoice.amount)}.00</strong>
              <span className={invoice.status === 'Paid' ? 'invoice-status paid' : 'invoice-status pending'}>{invoice.status}</span>
              <span>{invoice.date}</span>
              <div className="invoice-row-actions">
                <IconButton label="View invoice" icon="eye" onClick={() => {
                  setSelectedInvoiceId(invoice.id)
                  onViewChange('detail')
                }} />
                <IconButton label="Download invoice" icon="download" onClick={() => showFeedback('Invoice PDF is ready')} />
                <IconButton label="Share invoice" icon="share" onClick={() => showFeedback('Invoice share link copied')} />
                <IconButton label="Print invoice" icon="print" onClick={() => window.print()} />
              </div>
            </div>
          ))}
          {filteredInvoices.length === 0 && (
            <div className="invoice-empty-row">
              <strong>No invoices found</strong>
              <span>Try another status or search.</span>
            </div>
          )}
        </div>

        <div className="table-footer">
          <span>Showing 1 - {filteredInvoices.length} of 94 Orders</span>
          <div className="pagination">
            <button type="button" disabled>&lt;</button>
            <button className="active" type="button">1</button>
            <button type="button">2</button>
            <button type="button">...</button>
            <button type="button">14</button>
            <button type="button">&gt;</button>
          </div>
        </div>
      </Panel>
    </section>
  )
}

function GenerateInvoiceView({
  onCancel,
  onGenerate,
  onOpenDropdown,
  onSelectOrder,
  openDropdown,
  selectedOrder,
  selectedOrderId,
}: {
  onCancel: () => void
  onGenerate: () => void
  onOpenDropdown: (id: InvoiceDropdownId | null) => void
  onSelectOrder: (id: string) => void
  openDropdown: InvoiceDropdownId | null
  selectedOrder: OrderRow
  selectedOrderId: string
}) {
  const [orderSearch, setOrderSearch] = useState('')
  const [prefix, setPrefix] = useState('INV-2026')
  const [currency, setCurrency] = useState('INR (Rs)')
  const [sgst, setSgst] = useState('2.5%')
  const [cgst, setCgst] = useState('2.5%')
  const [address, setAddress] = useState('No. 12, Gandhi Bazaar Road, Near Central Bus Stand, Coimbatore - 641001, Tamil Nadu, India')
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const filteredOrders = orderOptions.filter((order) => {
    const query = orderSearch.trim().toLowerCase()
    return query.length === 0 || order.id.toLowerCase().includes(query) || order.customer.toLowerCase().includes(query)
  })

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (openDropdown === 'currency' && !dropdownRef.current?.contains(event.target as Node)) {
        onOpenDropdown(null)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [onOpenDropdown, openDropdown])

  return (
    <section className="generate-invoice-page">
      <div className="generate-invoice-main">
        <Panel className="select-order-panel">
          <h2>Select order</h2>
          <label className="invoice-order-search">
            <AppIcon name="search" />
            <input value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder="Search by Order ID or Customer Name..." />
          </label>
          <div className="invoice-order-list">
            {filteredOrders.map((order) => (
              <button className={selectedOrderId === order.id ? 'invoice-order-card active' : 'invoice-order-card'} key={order.id} type="button" onClick={() => onSelectOrder(order.id)}>
                <span className="invoice-radio" aria-hidden="true"></span>
                <span>
                  <strong>{order.id}</strong>
                  <b>{order.customer}</b>
                  <small>{order.items.map((item) => `${item.name} x ${item.qty}`).join(', ')}</small>
                </span>
                <span>
                  <strong>Rs{moneyFormatter.format(order.amount)}.00</strong>
                  <small>{order.date}</small>
                  <small>{order.payment}</small>
                </span>
              </button>
            ))}
          </div>
        </Panel>

        <InvoiceOrderDetails order={selectedOrder} />

        <Panel className="invoice-settings-panel">
          <h2>Invoice settings</h2>
          <div className="product-form-grid">
            <FormField label="Invoice prefix"><input value={prefix} onChange={(event) => setPrefix(event.target.value)} /></FormField>
            <FormField label="Default currency">
              <div ref={dropdownRef}>
                <InvoiceDropdown id="currency" openDropdown={openDropdown} options={currencyOptions} value={currency} onChange={setCurrency} onOpenChange={onOpenDropdown} />
              </div>
            </FormField>
            <FormField label="Tax Percentage - SGST"><input value={sgst} onChange={(event) => setSgst(event.target.value)} /></FormField>
            <FormField label="Tax Percentage - CGST"><input value={cgst} onChange={(event) => setCgst(event.target.value)} /></FormField>
          </div>
          <FormField label="Registered address" className="full"><input value={address} onChange={(event) => setAddress(event.target.value)} /></FormField>
        </Panel>

        <PageActions onCancel={onCancel} onSave={onGenerate} saveLabel="Generate Invoice" />
      </div>

      <aside className="invoice-preview-side">
        <Panel className="invoice-details-preview">
          <h2>Invoice details</h2>
          <PreviewRow label="Invoice no." value={`${prefix}-0094`} link />
          <PreviewRow label="Customer" value={selectedOrder.customer} />
          <PreviewRow label="Order ID" value={selectedOrder.id} />
          <PreviewRow label="Date" value={selectedOrder.date} />
          <PreviewRow label="Payment" value={selectedOrder.payment.split(' - ')[0]} />
          <PreviewRow label="Status" value={selectedOrder.status} />
          <PreviewRow label="Items" value={String(selectedOrder.items.length)} />
          <PreviewRow label="Subtotal" value={`Rs${moneyFormatter.format(selectedOrder.amount - 16)}.00`} />
          <PreviewRow label="SGST" value="Rs8.00" />
          <PreviewRow label="CGST" value="Rs8.00" />
          <PreviewRow label="Total" value={`Rs${moneyFormatter.format(selectedOrder.amount)}.00`} strong />
        </Panel>
      </aside>
    </section>
  )
}

function InvoiceOrderDetails({ order }: { order: OrderRow }) {
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  return (
    <Panel className="invoice-order-details-panel">
      <h2>Order Details - <span>{order.id}</span></h2>
      <h3>Item List</h3>
      <div className="invoice-mini-table">
        <div><span>SL.No</span><span>Products</span><span>Price</span><span>Qty</span><span>Amount</span></div>
        {order.items.map((item, index) => (
          <div key={item.name}>
            <span>{index + 1}</span>
            <strong>{item.name}</strong>
            <span>Rs{item.price}</span>
            <span>{item.qty}</span>
            <span>Rs{item.price * item.qty}</span>
          </div>
        ))}
      </div>
      <PreviewRow label="Subtotal" value={`Rs${moneyFormatter.format(subtotal)}.00`} />
      <PreviewRow label="SGST (2.5%)" value="Rs8.00" />
      <PreviewRow label="CGST (2.5%)" value="Rs8.00" />
      <PreviewRow label="Total" value={`Rs${moneyFormatter.format(order.amount)}.00`} strong />
    </Panel>
  )
}

function InvoiceDetailView({
  feedback,
  invoice,
  onBack,
  onDelete,
  onDownload,
  onPrint,
  onShare,
}: {
  feedback: string
  invoice: InvoiceRow
  onBack: () => void
  onDelete: () => void
  onDownload: () => void
  onPrint: () => void
  onShare: () => void
}) {
  const subtotal = invoice.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  return (
    <section className="invoice-detail-page">
      {feedback && <div className="inline-feedback">{feedback}</div>}
      <button className="invoice-back-button" type="button" onClick={onBack}>Back to invoices</button>
      <article className="invoice-document">
        <div className="invoice-doc-header">
          <div className="invoice-store-brand">
            <span></span>
            <strong>Sample Stores</strong>
          </div>
          <p>No. 12, Gandhi Bazaar Road<br />Near Central Bus Stand<br />Coimbatore - 641001<br />Tamil Nadu, India<br />+91 987 654 3210<br />sample@stores.com<br />GSTIN: 33ABCDF1234F1Z5</p>
        </div>
        <div className="invoice-doc-body">
          <section>
            <h2>Customer</h2>
            <p>Mr. {invoice.customer}<br />{invoice.address}<br />{invoice.phone}</p>
          </section>
          <div className="invoice-doc-meta">
            <div><span>Invoice Date</span><strong>{invoice.date}</strong></div>
            <div><span>Invoice No</span><strong>{invoice.id}</strong></div>
            <div><span>Order ID</span><strong>{invoice.orderId}</strong></div>
            <div><span>Payment Mode</span><strong>{invoice.payment} <small>TXN90234817</small></strong></div>
          </div>
          <h2>Item List</h2>
          <div className="invoice-doc-table">
            <div><span>SL.No</span><span>Products</span><span>Price</span><span>Qty</span><span>Amount</span></div>
            {invoice.items.map((item, index) => (
              <div key={item.name}>
                <span>{index + 1}</span><span>{item.name}</span><span>Rs{item.price}</span><span>{item.qty}</span><span>Rs{item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div className="invoice-doc-totals">
            <PreviewRow label="Subtotal" value={`Rs${moneyFormatter.format(subtotal)}.00`} />
            <PreviewRow label="SGST (2.5%)" value="Rs8.00" />
            <PreviewRow label="CGST (2.5%)" value="Rs8.00" />
            <PreviewRow label="Total" value={`Rs${moneyFormatter.format(invoice.amount)}.00`} strong />
          </div>
          <div className="invoice-words">
            <span>Amount chargeable (in words)</span>
            <strong>E. & O.E&nbsp;&nbsp; Three Hundred Thirty Seven Only</strong>
          </div>
          <div className="invoice-declaration">
            <h2>Declaration</h2>
            <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
            <span></span>
            <small>Authorised Signatory</small>
          </div>
          <p className="invoice-generated-note">This is a Computer Generated Invoice</p>
        </div>
      </article>

      <aside className="invoice-detail-side">
        <Panel className="invoice-side-panel">
          <h2>Quick actions</h2>
          <button className="invoice-quick-action primary" type="button" onClick={onDownload}><ActionSvg icon="download" />Download PDF</button>
          <button className="invoice-quick-action" type="button" onClick={onPrint}><ActionSvg icon="print" />Print Invoice</button>
          <button className="invoice-quick-action" type="button" onClick={onShare}><ActionSvg icon="share" />Share as PDF</button>
          <button className="invoice-quick-action danger" type="button" onClick={onDelete}><ActionSvg icon="trash" />Delete Invoice</button>
        </Panel>
        <Panel className="invoice-side-panel">
          <h2>Invoice details</h2>
          <PreviewRow label="Invoice no." value={invoice.id} link />
          <PreviewRow label="Status" value={invoice.status} />
          <PreviewRow label="Order ID" value={invoice.orderId} />
          <PreviewRow label="Date" value={invoice.date} />
          <PreviewRow label="Total" value={`Rs${moneyFormatter.format(invoice.amount)}.00`} />
          <PreviewRow label="Payment" value={invoice.payment} />
        </Panel>
        <Panel className="invoice-side-panel">
          <h2>Customer</h2>
          <PreviewRow label="Name" value={invoice.customer} />
          <PreviewRow label="Phone" value={invoice.phone} />
          <PreviewRow label="Address" value={invoice.address} />
        </Panel>
      </aside>
    </section>
  )
}

function InvoiceMetric({ icon, label, note, tone, value }: { icon: string; label: string; note: string; tone: string; value: string }) {
  return (
    <Panel className="invoice-metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
      <span className={`invoice-metric-icon ${tone}`}><ActionSvg icon={icon} /></span>
    </Panel>
  )
}

function InvoiceDropdown({
  id,
  openDropdown,
  options,
  value,
  onChange,
  onOpenChange,
}: {
  id: InvoiceDropdownId
  openDropdown: InvoiceDropdownId | null
  options: string[]
  value: string
  onChange: (value: string) => void
  onOpenChange: (id: InvoiceDropdownId | null) => void
}) {
  const isOpen = openDropdown === id
  return (
    <div className={isOpen ? 'filter-control invoice-filter-control open' : 'filter-control invoice-filter-control'}>
      <button className="filter-trigger" type="button" aria-expanded={isOpen} onClick={() => onOpenChange(isOpen ? null : id)}>
        <strong>{value}</strong>
        <AppIcon name="chevron" />
      </button>
      {isOpen && (
        <div className="filter-menu" role="listbox" aria-label={value}>
          {options.map((option) => (
            <button className={option === value ? 'filter-option selected' : 'filter-option'} key={option} type="button" onClick={() => {
              onChange(option)
              onOpenChange(null)
            }}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PreviewRow({ label, link = false, strong = false, value }: { label: string; link?: boolean; strong?: boolean; value: string }) {
  return <div className={strong ? 'preview-row strong' : 'preview-row'}><span>{label}</span><strong className={link ? 'link-value' : ''}>{value}</strong></div>
}

function IconButton({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return <button type="button" aria-label={label} onClick={onClick}><ActionSvg icon={icon} /></button>
}

function ActionSvg({ icon }: { icon: string }) {
  const iconMap: Record<string, AppIconName> = {
    eye: 'eye',
    download: 'download',
    share: 'share',
    print: 'printer',
    trash: 'trash',
    calendar: 'calendar',
    check: 'check-circle',
    clock: 'clock',
    invoice: 'invoice',
  }

  return <AppIcon name={iconMap[icon] || 'invoice'} />
}
