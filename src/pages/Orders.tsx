import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { AppIcon } from '../components/ui/AppIcon'
import { Panel } from '../components/ui/Panel'
import { showToast } from '../utils/toast'

type OrdersProps = {
  onViewChange: (view: 'list' | 'details') => void
  searchQuery: string
  view: 'list' | 'details'
}

type OrderStatus = 'Preparing' | 'Out of Delivery' | 'Delivered' | 'Return' | 'Cancelled'
type OrderDropdownId = 'date' | 'type' | 'price' | 'payment' | 'status'
type OrderType = 'Dine in' | 'Takeaway' | 'Online'

const statusOptions: OrderStatus[] = ['Preparing', 'Out of Delivery', 'Delivered', 'Return', 'Cancelled']
const statusFilterOptions = ['Status: All', ...statusOptions]
const progressSteps = ['Order Placed', 'Confirmed', 'Preparing', 'Out of Delivery', 'Delivered']
const statusOrder = new Map<OrderStatus, number>(statusOptions.map((status, index) => [status, index]))
const orderTypeOptions: OrderType[] = ['Dine in', 'Takeaway', 'Online']

const orderItems = [
  { name: 'Flower Fabric', quantity: 2, mrp: 60 },
  { name: 'Plastic Mug', quantity: 2, mrp: 70 },
  { name: 'Plastic Bucket', quantity: 1, mrp: 160 },
  { name: 'Amul Milk 500ml', quantity: 2, mrp: 30 },
]

const initialOrders = [
  { id: '#ORD-123456', customer: 'Jade Gloud', date: '24 May', time: '02:59 PM', total: 480, paymentType: 'Online', paymentStatus: 'Paid', status: 'Preparing' as OrderStatus, type: 'Dine in' as OrderType },
  { id: '#ORD-123457', customer: 'Jade Gloud', date: '24 May', time: '02:59 PM', total: 480, paymentType: 'COD', paymentStatus: 'Not Paid', status: 'Preparing' as OrderStatus, type: 'Takeaway' as OrderType },
  { id: '#ORD-123458', customer: 'Gade Jloud', date: '25 May', time: '03:59 PM', total: 1480, paymentType: 'Online', paymentStatus: 'Not Paid', status: 'Preparing' as OrderStatus, type: 'Online' as OrderType },
  { id: '#ORD-123459', customer: 'Jade Gloud', date: '24 May', time: '02:59 PM', total: 480, paymentType: 'Online', paymentStatus: 'Paid', status: 'Preparing' as OrderStatus, type: 'Takeaway' as OrderType },
  { id: '#ORD-123460', customer: 'Gade Jloud', date: '25 May', time: '03:59 PM', total: 1480, paymentType: 'Online', paymentStatus: 'Not Paid', status: 'Preparing' as OrderStatus, type: 'Dine in' as OrderType },
]

type Order = (typeof initialOrders)[number]

function ChevronIcon() {
  return <AppIcon name="chevron" />
}

export function Orders({ onViewChange, searchQuery, view }: OrdersProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'new'>('all')
  const [dateFilter, setDateFilter] = useState('Order Date')
  const [typeFilter, setTypeFilter] = useState('Order Type: All')
  const [priceFilter, setPriceFilter] = useState('Price Range')
  const [paymentFilter, setPaymentFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('Status: All')
  const [openDropdown, setOpenDropdown] = useState<OrderDropdownId | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrders[0].id)
  const [orders, setOrders] = useState(initialOrders)
  const [pendingStatusChange, setPendingStatusChange] = useState<{ orderId: string; status: OrderStatus } | null>(null)
  const normalizedSearch = searchQuery.trim().toLowerCase()
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) || orders[0]
  const visibleOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          order.id.toLowerCase().includes(normalizedSearch) ||
          order.customer.toLowerCase().includes(normalizedSearch)
        const matchesPayment = paymentFilter === 'All' || order.paymentType === paymentFilter
        const matchesType = typeFilter === 'Order Type: All' || order.type === typeFilter
        const matchesStatus = statusFilter === 'Status: All' || order.status === statusFilter
        const matchesPrice =
          priceFilter === 'Price Range' ||
          (priceFilter === 'Under Rs.500' && order.total < 500) ||
          (priceFilter === 'Rs.500 - Rs.1000' && order.total >= 500 && order.total <= 1000) ||
          (priceFilter === 'Above Rs.1000' && order.total > 1000)
        const matchesDate = dateFilter === 'Order Date' || order.date === dateFilter
        const matchesTab = activeTab === 'all' || order.status === 'Preparing'

        return matchesSearch && matchesPayment && matchesType && matchesStatus && matchesPrice && matchesDate && matchesTab
      }),
    [activeTab, dateFilter, normalizedSearch, orders, paymentFilter, priceFilter, statusFilter, typeFilter],
  )

  function requestOrderStatusChange(order: Order, status: OrderStatus) {
    const currentStatusStep = statusOrder.get(order.status) ?? 0
    const nextStatusStep = statusOrder.get(status) ?? 0

    if (status === order.status) {
      return
    }

    if (nextStatusStep < currentStatusStep) {
      showToast(`Cannot move ${order.id} back from ${order.status} to ${status}.`, 'warning')
      return
    }

    setPendingStatusChange({ orderId: order.id, status })
  }

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    setOrders((currentOrders) =>
      currentOrders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    )
    showToast(
      `${orderId} changed to ${status}.`,
      status === 'Cancelled' ? 'error' : status === 'Delivered' ? 'success' : 'warning',
    )
  }

  function confirmPendingStatusChange() {
    if (!pendingStatusChange) {
      return
    }

    updateOrderStatus(pendingStatusChange.orderId, pendingStatusChange.status)
    setPendingStatusChange(null)
  }

  if (view === 'details') {
    return <OrderDetails order={selectedOrder} />
  }

  return (
    <section className="orders-page">
      <div className="orders-tabs">
        <button className={activeTab === 'all' ? 'active' : ''} type="button" onClick={() => setActiveTab('all')}>
          All Orders
        </button>
        <button className={activeTab === 'new' ? 'active' : ''} type="button" onClick={() => setActiveTab('new')}>
          New Orders
        </button>
      </div>

      {activeTab === 'new' && (
        <p className="orders-subtitle">Incoming orders ({visibleOrders.length}) <span>awaiting information...</span></p>
      )}

      <div className="orders-filter-row">
        {activeTab === 'all' && (
          <>
            <OrderDropdown id="date" options={['Order Date', '24 May', '25 May']} openDropdown={openDropdown} value={dateFilter} onChange={setDateFilter} onOpenChange={setOpenDropdown} />
            <OrderDropdown id="type" options={['Order Type: All', ...orderTypeOptions]} openDropdown={openDropdown} value={typeFilter} onChange={setTypeFilter} onOpenChange={setOpenDropdown} />
            <OrderDropdown id="price" options={['Price Range', 'Under Rs.500', 'Rs.500 - Rs.1000', 'Above Rs.1000']} openDropdown={openDropdown} value={priceFilter} onChange={setPriceFilter} onOpenChange={setOpenDropdown} />
            <OrderDropdown id="status" options={statusFilterOptions} openDropdown={openDropdown} value={statusFilter} onChange={setStatusFilter} onOpenChange={setOpenDropdown} />
          </>
        )}
        <OrderDropdown id="payment" options={['All', 'Online', 'COD']} openDropdown={openDropdown} value={paymentFilter} labelPrefix="Payment Type:" onChange={setPaymentFilter} onOpenChange={setOpenDropdown} />
      </div>

      <div className="orders-list">
        {visibleOrders.map((order) => (
          <button
            className="order-card"
            key={order.id}
            type="button"
            onClick={() => {
              setSelectedOrderId(order.id)
              onViewChange('details')
            }}
          >
            <OrderCardHeader order={order} />
            {activeTab === 'all' && (
              <div className="order-status-row" onClick={(event) => event.stopPropagation()}>
                <span>Status:</span>
                {statusOptions.map((status) => {
                  const isBeforeCurrentStatus = (statusOrder.get(status) ?? 0) < (statusOrder.get(order.status) ?? 0)
                  return (
                    <label className={`order-status-choice ${statusClassName(status)}${isBeforeCurrentStatus ? ' disabled' : ''}`} key={status}>
                      <input
                        type="radio"
                        name={`${order.id}-status`}
                        checked={order.status === status}
                        disabled={isBeforeCurrentStatus}
                        onChange={() => requestOrderStatusChange(order, status)}
                      />
                      {status}
                    </label>
                  )
                })}
              </div>
            )}
          </button>
        ))}
      </div>
      {pendingStatusChange && (
        <StatusConfirmModal
          orderId={pendingStatusChange.orderId}
          status={pendingStatusChange.status}
          onCancel={() => setPendingStatusChange(null)}
          onConfirm={confirmPendingStatusChange}
        />
      )}
    </section>
  )
}

function StatusConfirmModal({ orderId, status, onCancel, onConfirm }: {
  orderId: string
  status: OrderStatus
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="order-status-modal-backdrop" role="presentation" onClick={onCancel}>
      <section className="order-status-modal" role="dialog" aria-modal="true" aria-labelledby="order-status-modal-title" onClick={(event) => event.stopPropagation()}>
        <span className={`order-status-modal-badge ${statusClassName(status)}`}>{status}</span>
        <h2 id="order-status-modal-title">Confirm status change</h2>
        <p>Change {orderId} to <strong>{status}</strong>?</p>
        <div className="order-status-modal-actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button className="primary" type="button" onClick={onConfirm}>Confirm</button>
        </div>
      </section>
    </div>
  )
}

function OrderDropdown({
  id,
  labelPrefix,
  onChange,
  onOpenChange,
  openDropdown,
  options,
  value,
}: {
  id: OrderDropdownId
  labelPrefix?: string
  onChange: (value: string) => void
  onOpenChange: (id: OrderDropdownId | null) => void
  openDropdown: OrderDropdownId | null
  options: string[]
  value: string
}) {
  const isOpen = openDropdown === id
  const displayValue = labelPrefix && value === 'All' ? `${labelPrefix} All` : value

  return (
    <div
      className={isOpen ? 'filter-control order-filter-control open' : 'filter-control order-filter-control'}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onOpenChange(null)
        }
      }}
    >
      <button className="filter-trigger" type="button" aria-expanded={isOpen} onClick={() => onOpenChange(isOpen ? null : id)}>
        <strong>{displayValue}</strong>
        <ChevronIcon />
      </button>
      {isOpen && (
        <div className="filter-menu" role="listbox" aria-label={displayValue}>
          {options.map((option) => (
            <button
              className={option === value ? 'filter-option selected' : 'filter-option'}
              key={option}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(option)
                onOpenChange(null)
              }}
            >
              {labelPrefix && option !== 'All' ? `${labelPrefix} ${option}` : option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function OrderCardHeader({ order }: { order: Order }) {
  return (
    <div className="order-card-grid">
      <div><small>Order ID</small><strong>{order.id}</strong><span>{order.type}</span></div>
      <div><small>Customer</small><strong>{order.customer}</strong></div>
      <div><small>Items</small>{orderItems.map((item) => <span key={item.name}>{item.quantity} x {item.name}</span>)}</div>
      <div><small>Time</small><strong>{order.date}</strong><span>{order.time}</span></div>
      <div><small>Total Price</small><strong>Rs.{order.total}.00</strong></div>
      <div><small>Payment Type</small><strong>{order.paymentType}</strong></div>
      <div><small>Payment Status</small><em className={order.paymentStatus === 'Paid' ? 'paid' : 'not-paid'}>{order.paymentStatus}</em></div>
    </div>
  )
}

function statusClassName(status: OrderStatus) {
  return status.toLowerCase().replace(/\s+/g, '-')
}

function OrderDetails({ order }: { order: Order }) {
  const subtotal = orderItems.reduce((sum, item) => sum + item.quantity * item.mrp, 0)
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + tax
  const completedStepIndex = order.status === 'Delivered'
    ? 4
    : order.status === 'Out of Delivery'
      ? 3
      : order.status === 'Preparing'
        ? 2
        : 1
  const isClosedStatus = order.status === 'Return' || order.status === 'Cancelled'

  return (
    <section className="order-detail-page">
      <div className="order-detail-main">
        <Panel className="order-progress-panel">
          <div className="order-detail-title">
            <div>
              <h2>{order.id}</h2>
              <p>Placed on {order.date} 2026 · {order.time} · {order.type} order</p>
            </div>
            <span className={`order-detail-status ${statusClassName(order.status)}${isClosedStatus ? ' closed' : ''}`}>{order.status}</span>
          </div>
          <div
            className={isClosedStatus ? 'order-timeline closed' : 'order-timeline'}
            style={{ '--completed-steps': completedStepIndex } as CSSProperties}
          >
            {progressSteps.map((step, index) => (
              <div className={index <= completedStepIndex && !isClosedStatus ? 'timeline-step complete' : 'timeline-step'} key={step}>
                <b>{index <= completedStepIndex && !isClosedStatus ? '✓' : index + 1}</b>
                <strong>{step}</strong>
                <span>{order.date} 2026<br />{index === 0 ? order.time : index === 1 ? '3:05 PM' : index === 2 ? '3:15 PM' : index === 3 ? '3:45 PM' : order.status === 'Delivered' ? '5:30 PM' : 'Pending'}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="order-items-panel">
          <h2>Item List</h2>
          <div className="order-items-table">
            <div><span>Item</span><span>Quantity</span><span>MRP</span><span>Selling Price</span><span>Subtotal</span></div>
            {orderItems.map((item) => (
              <div key={item.name}>
                <strong>{item.name}</strong>
                <span>{item.quantity}</span>
                <span>Rs.{item.mrp}</span>
                <span>Rs.{item.mrp}</span>
                <span>Rs.{item.quantity * item.mrp}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="order-summary-panel">
          <h2>Order Summary</h2>
          <div><span>Subtotal</span><strong>Rs.{subtotal}.0</strong></div>
          <div><span>Discount</span><em>- Rs.0.0</em></div>
          <div><span>Tax (GST 5%)</span><b>+ Rs.{tax}.0</b></div>
          <div><span>Delivery</span><strong>Rs.0.0</strong></div>
          <div className="total"><span>Total amount</span><strong>Rs.{total}.0</strong></div>
        </Panel>
      </div>

      <aside className="order-detail-side">
        <Panel className="customer-panel">
          <h2>Customer Details</h2>
          <div className="customer-card"><span>{order.customer.slice(0, 2).toUpperCase()}</span><div><strong>{order.customer}</strong><small>+123 465 7890</small></div></div>
          <p><span>Phone</span><strong>+123 456 7890</strong></p>
          <p><span>Destination</span><strong>*Address</strong></p>
          <p><span>Delivery</span><strong>24th May 2026 5:30PM</strong></p>
          <p><span>Payment Status</span><em>{order.paymentStatus}</em></p>
        </Panel>
        <Panel className="payment-panel">
          <h2>Payment</h2>
          <p><span>Payment method</span><strong>{order.paymentType === 'COD' ? 'Cash on Delivery' : 'UPI'}</strong></p>
          <p><span>Transaction ID</span><strong>TXN48821093</strong></p>
          <p><span>Order type</span><strong>{order.type}</strong></p>
        </Panel>
      </aside>
    </section>
  )
}
