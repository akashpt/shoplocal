import { recentOrders } from '../data/shopData'

export function Orders() {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Order management</h2>
        <button className="secondary-action" type="button">
          Export
        </button>
      </div>

      <div className="data-table">
        <div className="data-row table-heading">
          <span>Order</span>
          <span>Customer</span>
          <span>Total</span>
          <span>Status</span>
          <span>Time</span>
        </div>
        {recentOrders.map((order) => (
          <div className="data-row" key={order.id}>
            <strong>{order.id}</strong>
            <span>{order.customer}</span>
            <span>{order.total}</span>
            <span className="status">{order.status}</span>
            <span>{order.time}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

