import { recentOrders, offers } from '../data/shopData'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const chartData = [
  { date: 'May 2', revenue: 12000, expenses: 8000 },
  { date: 'May 3', revenue: 15000, expenses: 9000 },
  { date: 'May 4', revenue: 18000, expenses: 11000 },
  { date: 'May 5', revenue: 14000, expenses: 8500 },
  { date: 'May 6', revenue: 20000, expenses: 12000 },
  { date: 'May 7', revenue: 16000, expenses: 9500 },
  { date: 'May 8', revenue: 13000, expenses: 8000 },
]

export function Dashboard() {
  return (
    <section className="page-stack">
      <div className="metric-grid">
        <article className="metric-card">
          <div className="metric-card-icon" style={{ backgroundColor: '#dbeafe', color: '#374151', fontSize: '20px' }}>
            📋
          </div>
          <span className="metric-card-label">Today's Revenue</span>
          <strong>₹18,420</strong>
          <small>9.4% vs Yesterday</small>
        </article>
        <article className="metric-card">
          <div className="metric-card-icon" style={{ backgroundColor: '#e9d5ff', color: '#374151', fontSize: '20px' }}>
            🛒
          </div>
          <span className="metric-card-label">Low Stock</span>
          <strong>26</strong>
          <small>Items need restocking</small>
        </article>
        <article className="metric-card">
          <div className="metric-card-icon" style={{ backgroundColor: '#bbf7d0', color: '#374151', fontSize: '20px' }}>
            📈
          </div>
          <span className="metric-card-label">High Demand</span>
          <strong>5</strong>
          <small>Items are selling out rapidly!</small>
        </article>
        <article className="metric-card">
          <div className="metric-card-icon" style={{ backgroundColor: '#fef3c7', color: '#374151', fontSize: '20px' }}>
            ⚠️
          </div>
          <span className="metric-card-label">Out of Stock</span>
          <strong>11</strong>
          <small>Items are out of Stock! Needs Attention</small>
        </article>
      </div>

      <div className="two-column">
        <article className="panel">
          <div className="panel-header">
            <h2>Earnings Overview</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ background: '#5B5FFF', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>W</button>
              <button style={{ background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>M</button>
              <button style={{ background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Y</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '13px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '13px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} cursor={{ fill: 'rgba(91, 95, 255, 0.05)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="revenue" fill="#5B5FFF" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="#c4b5fd" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Pending Orders</h2>
            <span>View all</span>
          </div>
          <div className="table-list">
            {recentOrders.filter(order => order.status === 'Pending').slice(0, 4).map((order) => (
              <div className="table-row" key={order.id}>
                <strong>{order.id}</strong>
                <span>{order.customer}</span>
                <span>{order.total}</span>
                <span className="status pending">{order.status}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="two-column">
        <article className="panel">
          <div className="panel-header">
            <h2>Today's Orders</h2>
          </div>
          <div className="table-list">
            {recentOrders.map((order) => (
              <div className="table-row" key={order.id}>
                <strong>{order.id}</strong>
                <span>{order.customer}</span>
                <span>{order.total}</span>
                <span className={`status ${order.status === 'Completed' ? '' : order.status === 'Pending' ? 'pending' : ''}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Active Offers</h2>
            <span style={{ color: '#3b82f6' }}>Manage</span>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {offers.slice(0, 3).map((offer) => (
              <div key={offer.title} style={{ padding: '14px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '14px' }}>{offer.title}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Expires May15 · {offer.uses} Uses</div>
                <div style={{ marginTop: '8px', padding: '6px 10px', background: '#e0e7ff', color: '#5B5FFF', borderRadius: '4px', display: 'inline-block', fontSize: '13px', fontWeight: 600 }}>
                  {offer.discount}
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="panel">
        <div className="panel-header">
          <h2>Export Report</h2>
          <span style={{ color: '#6b7280', fontSize: '13px' }}>Download store data as CSV or PDF</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px', color: '#a78bfa' }}>
              🛒
            </div>
            <div style={{ fontWeight: 600, color: '#1f2937' }}>Orders</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>All order records</div>
            <button style={{ marginTop: '12px', background: '#5B5FFF', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
              ⬇ Export
            </button>
          </div>
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px', color: '#fcd34d' }}>
              📄
            </div>
            <div style={{ fontWeight: 600, color: '#1f2937' }}>Invoices</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Invoice History</div>
            <button style={{ marginTop: '12px', background: '#5B5FFF', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
              ⬇ Export
            </button>
          </div>
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px', color: '#fb7185' }}>
              💰
            </div>
            <div style={{ fontWeight: 600, color: '#1f2937' }}>Expenses</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Expenses Log</div>
            <button style={{ marginTop: '12px', background: '#5B5FFF', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
              ⬇ Export
            </button>
          </div>
        </div>
      </article>
    </section>
  )
}
