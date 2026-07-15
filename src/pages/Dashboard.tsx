import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type ChartRange = 'W' | 'M' | 'Y'

const chartData: Record<ChartRange, Array<{ date: string; revenue: number; expenses: number }>> = {
  W: [
    { date: 'May 2', revenue: 16800, expenses: 10800 },
    { date: 'May 3', revenue: 8400, expenses: 9800 },
    { date: 'May 4', revenue: 14600, expenses: 10800 },
    { date: 'May 5', revenue: 11000, expenses: 8200 },
    { date: 'May 6', revenue: 17800, expenses: 16000 },
    { date: 'May 7', revenue: 9600, expenses: 7000 },
    { date: 'May 8', revenue: 6800, expenses: 4900 },
  ],
  M: [
    { date: 'Week 1', revenue: 56000, expenses: 34000 },
    { date: 'Week 2', revenue: 73000, expenses: 48000 },
    { date: 'Week 3', revenue: 61500, expenses: 41000 },
    { date: 'Week 4', revenue: 84200, expenses: 53000 },
  ],
  Y: [
    { date: 'Jan', revenue: 180000, expenses: 112000 },
    { date: 'Feb', revenue: 224000, expenses: 141000 },
    { date: 'Mar', revenue: 198000, expenses: 126000 },
    { date: 'Apr', revenue: 246000, expenses: 158000 },
    { date: 'May', revenue: 262000, expenses: 171000 },
    { date: 'Jun', revenue: 238000, expenses: 149000 },
  ],
}

const metricCards = [
  {
    label: "Today's Revenue",
    value: 'Rs.18,420',
    note: '9.4%',
    suffix: 'vs Yesterday',
    tone: 'blue',
    icon: 'receipt',
  },
  {
    label: 'Low Stock',
    value: '26',
    note: 'Items need restocking',
    tone: 'violet',
    icon: 'cart',
  },
  {
    label: 'High Demand',
    value: '5',
    note: 'Items are selling out rapidly!',
    tone: 'green',
    icon: 'cash',
  },
  {
    label: 'Out of Stock',
    value: '11',
    note: 'Items are out of Stock!',
    suffix: 'Needs Attention',
    tone: 'amber',
    icon: 'alert',
  },
]

const pendingOrders = [
  { id: '#ORD-8825', customer: 'Neha P', total: 'Rs.980' },
  { id: '#ORD-8846', customer: 'Priya Ashok', total: 'Rs.640' },
  { id: '#ORD-8848', customer: 'Ashok Mani', total: 'Rs.325' },
  { id: '#ORD-8856', customer: 'Mani Saravanan', total: 'Rs.460' },
  { id: '#ORD-8861', customer: 'Kavya R', total: 'Rs.720' },
  { id: '#ORD-8870', customer: 'Arjun V', total: 'Rs.510' },
]

const todayOrders = [
  { id: '#ORD-8821', customer: 'Priya S', total: 'Rs.340', status: 'Completed' },
  { id: '#ORD-8822', customer: 'Rohan M', total: 'Rs.1200', status: 'Out for Delivery' },
  { id: '#ORD-8823', customer: 'Anita K', total: 'Rs.760', status: 'Completed' },
  { id: '#ORD-8824', customer: 'Vikram L', total: 'Rs.430', status: 'Completed' },
  { id: '#ORD-8825', customer: 'Neha P', total: 'Rs.980', status: 'Pending' },
  { id: '#ORD-8826', customer: 'Sameer D', total: 'Rs.1500', status: 'Completed' },
]

const ordersPerPage = 4

const activeOffers = [
  { title: 'SAVE20', meta: 'Expires May15 - 48 Uses', discount: '20% off' },
  { title: 'WEEKEND50', meta: 'Expires May11 - 26 Uses', discount: 'Rs.50 flat' },
  { title: 'COMBO3', meta: 'No expiry - 7 Uses', discount: 'Combo' },
  { title: 'CELE46', meta: 'Expires May25 - 4 Uses', discount: '46% off' },
]

const exportReports = [
  { title: 'Orders', meta: 'All order records', tone: 'violet', icon: 'cart' },
  { title: 'Invoices', meta: 'Invoice History', tone: 'amber', icon: 'invoice' },
  { title: 'Expenses', meta: 'Expenses Log', tone: 'rose', icon: 'receipt' },
]

type IconName = 'receipt' | 'cart' | 'cash' | 'alert' | 'invoice' | 'download' | 'chevron'

function DashboardIcon({ name }: { name: IconName }) {
  if (name === 'cart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 8H7" />
        <circle cx="10" cy="20" r="1.3" />
        <circle cx="17" cy="20" r="1.3" />
      </svg>
    )
  }

  if (name === 'cash') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M7 9h.01M17 15h.01" />
      </svg>
    )
  }

  if (name === 'alert') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 4 9 16H3L12 4Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    )
  }

  if (name === 'invoice') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3h8l3 3v15l-2-1-2 1-2-1-2 1-2-1-2 1V3Z" />
        <path d="M14 3v4h4M9 11h6M9 15h6" />
      </svg>
    )
  }

  if (name === 'download') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4v10M8 10l4 4 4-4M5 19h14" />
      </svg>
    )
  }

  if (name === 'chevron') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m9 6 6 6-6 6" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  )
}

export function Dashboard() {
  const [chartRange, setChartRange] = useState<ChartRange>('W')
  const [enabledOffers, setEnabledOffers] = useState(() => activeOffers.map((offer) => offer.title))
  const [ordersPage, setOrdersPage] = useState(1)
  const [showAllPendingOrders, setShowAllPendingOrders] = useState(false)
  const [showOnlyEnabledOffers, setShowOnlyEnabledOffers] = useState(false)
  const [lastExport, setLastExport] = useState<string | null>(null)
  const activeChartData = chartData[chartRange]
  const maxChartValue = Math.max(...activeChartData.flatMap((item) => [item.revenue, item.expenses]))
  const totalOrderPages = Math.ceil(todayOrders.length / ordersPerPage)
  const visibleTodayOrders = todayOrders.slice((ordersPage - 1) * ordersPerPage, ordersPage * ordersPerPage)
  const visiblePendingOrders = showAllPendingOrders ? pendingOrders : pendingOrders.slice(0, 4)
  const visibleOffers = showOnlyEnabledOffers
    ? activeOffers.filter((offer) => enabledOffers.includes(offer.title))
    : activeOffers
  const chartTicks =
    chartRange === 'W'
      ? [0, 5000, 10000, 15000, 20000]
      : chartRange === 'M'
        ? [0, 25000, 50000, 75000, 100000]
        : [0, 75000, 150000, 225000, 300000]

  function toggleOffer(title: string) {
    setEnabledOffers((currentOffers) =>
      currentOffers.includes(title)
        ? currentOffers.filter((offerTitle) => offerTitle !== title)
        : [...currentOffers, title],
    )
  }

  function exportReport(reportTitle: string) {
    const rows =
      reportTitle === 'Orders'
        ? todayOrders.map((order) => [order.id, order.customer, order.total, order.status])
        : reportTitle === 'Invoices'
          ? todayOrders.map((order) => [`INV-${order.id.replace('#ORD-', '')}`, order.customer, order.total, 'Paid'])
          : [
              ['EXP-101', 'Packaging', 'Rs.240', 'Today'],
              ['EXP-102', 'Delivery', 'Rs.380', 'Today'],
              ['EXP-103', 'Utilities', 'Rs.900', 'This week'],
            ]
    const csv = [['ID', 'Name', 'Amount', 'Status'], ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `${reportTitle.toLowerCase()}-report.csv`
    link.click()
    URL.revokeObjectURL(url)
    setLastExport(reportTitle)
  }

  return (
    <section className="dashboard-page">
      <div className="metric-grid">
        {metricCards.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span className={`metric-card-icon ${metric.tone}`}>
              <DashboardIcon name={metric.icon as IconName} />
            </span>
            <span className="metric-card-label">{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>
              {metric.suffix && metric.label !== 'Out of Stock' ? (
                <>
                  <b>{metric.note}</b> {metric.suffix}
                </>
              ) : (
                metric.note
              )}
              {metric.label === 'Out of Stock' && <b className="attention"> {metric.suffix}</b>}
            </small>
          </article>
        ))}
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-left">
          <article className="panel earnings-panel">
            <div className="panel-header">
              <h2>Earnings Overview</h2>
              <div className="range-tabs" aria-label="Chart range">
                {(['W', 'M', 'Y'] as const).map((range) => (
                  <button
                    className={chartRange === range ? 'active' : ''}
                    key={range}
                    type="button"
                    aria-pressed={chartRange === range}
                    onClick={() => setChartRange(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={238}>
              <BarChart data={activeChartData} margin={{ top: 6, right: 6, left: -26, bottom: 0 }} barGap={8}>
                <CartesianGrid vertical={false} stroke="#dedee4" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#676767', fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#676767', fontSize: 12 }}
                  domain={[0, Math.max(maxChartValue, chartTicks[chartTicks.length - 1])]}
                  ticks={chartTicks}
                  tickFormatter={(value) => (value === 0 ? '0' : `${Number(value) / 1000}K`)}
                />
                <Tooltip
                  contentStyle={{ border: '1px solid #dddddd', borderRadius: 8, boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)' }}
                  cursor={{ fill: 'rgba(67, 107, 245, 0.06)' }}
                  formatter={(value) => [`Rs.${Number(value ?? 0).toLocaleString('en-IN')}`, '']}
                />
                <Bar dataKey="revenue" fill="#416df4" radius={[9, 9, 0, 0]} barSize={20} animationDuration={450} />
                <Bar dataKey="expenses" fill="#b8c9ff" radius={[9, 9, 0, 0]} barSize={20} animationDuration={450} />
              </BarChart>
            </ResponsiveContainer>

            <div className="chart-legend">
              <span><i className="revenue-dot"></i>Revenue</span>
              <span><i className="expense-dot"></i>Expenses</span>
            </div>
          </article>

          <article className="panel orders-panel">
            <div className="panel-header">
              <h2>Today's Orders</h2>
            </div>
            <div className="orders-table">
              <div className="orders-table-head">
                <span>Order ID</span>
                <span>Customer Name</span>
                <span>Total Amount</span>
                <span>Status</span>
              </div>
              {visibleTodayOrders.map((order) => (
                <div className="orders-table-row" key={order.id}>
                  <strong>{order.id}</strong>
                  <span>{order.customer}</span>
                  <span>{order.total}</span>
                  <span className={`order-status ${order.status.toLowerCase().replaceAll(' ', '-')}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="table-footer">
              <span>
                Showing {(ordersPage - 1) * ordersPerPage + 1} -{' '}
                {Math.min(ordersPage * ordersPerPage, todayOrders.length)} of {todayOrders.length} Orders
              </span>
              <div className="pagination" aria-label="Pagination">
                <button
                  className={ordersPage === 1 ? 'ghost' : ''}
                  type="button"
                  aria-label="Previous"
                  disabled={ordersPage === 1}
                  onClick={() => setOrdersPage((page) => Math.max(1, page - 1))}
                >
                  <DashboardIcon name="chevron" />
                </button>
                {Array.from({ length: totalOrderPages }, (_, index) => index + 1).map((page) => (
                  <button
                    className={ordersPage === page ? 'active' : ''}
                    key={page}
                    type="button"
                    onClick={() => setOrdersPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="Next"
                  disabled={ordersPage === totalOrderPages}
                  onClick={() => setOrdersPage((page) => Math.min(totalOrderPages, page + 1))}
                >
                  <DashboardIcon name="chevron" />
                </button>
              </div>
            </div>
          </article>
        </div>

        <aside className="dashboard-right">
          <article className="panel pending-panel">
            <div className="panel-header">
              <h2>Pending Orders</h2>
              <button
                className="text-link"
                type="button"
                onClick={() => setShowAllPendingOrders((isShowingAll) => !isShowingAll)}
              >
                {showAllPendingOrders ? 'Show less' : 'View all'}
              </button>
            </div>
            <div className="pending-list">
              {visiblePendingOrders.map((order) => (
                <div className="pending-row" key={order.id}>
                  <div>
                    <strong>{order.id}</strong>
                    <small>{order.customer}</small>
                  </div>
                  <span>{order.total}</span>
                  <em>Pending</em>
                </div>
              ))}
            </div>
          </article>

          <article className="panel offers-panel">
            <div className="panel-header compact">
              <h2>Active Offers</h2>
              <button
                className="text-link small"
                type="button"
                onClick={() => setShowOnlyEnabledOffers((showOnlyEnabled) => !showOnlyEnabled)}
              >
                {showOnlyEnabledOffers ? 'Show all' : 'Enabled only'}
              </button>
            </div>
            <div className="active-offers-list">
              {visibleOffers.map((offer) => (
                <div className="active-offer-row" key={offer.title}>
                  <div>
                    <strong>{offer.title}</strong>
                    <small>{offer.meta}</small>
                  </div>
                  <span>{offer.discount}</span>
                  <button
                    className={enabledOffers.includes(offer.title) ? 'offer-toggle active' : 'offer-toggle'}
                    type="button"
                    aria-label={`${offer.title} ${enabledOffers.includes(offer.title) ? 'enabled' : 'disabled'}`}
                    aria-pressed={enabledOffers.includes(offer.title)}
                    onClick={() => toggleOffer(offer.title)}
                  >
                    <i></i>
                  </button>
                </div>
              ))}
            </div>
          </article>

          <article className="panel export-panel">
            <div className="panel-header compact">
              <div>
                <h2>Export Report</h2>
                <p>{lastExport ? `${lastExport} report exported` : 'Download store data as CSV'}</p>
              </div>
              <button className="text-link small" type="button" onClick={() => setLastExport(null)}>Clear</button>
            </div>
            <div className="export-list">
              {exportReports.map((report) => (
                <div className="export-row" key={report.title}>
                  <span className={`export-icon ${report.tone}`}>
                    <DashboardIcon name={report.icon as IconName} />
                  </span>
                  <div>
                    <strong>{report.title}</strong>
                    <small>{report.meta}</small>
                  </div>
                  <button type="button" onClick={() => exportReport(report.title)}>
                    <DashboardIcon name="download" />
                    Export
                  </button>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </div>
    </section>
  )
}
