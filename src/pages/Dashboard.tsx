import { inventoryItems, metrics, recentOrders } from '../data/shopData'

export function Dashboard() {
  return (
    <section className="page-stack">
      <div className="metric-grid">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.change}</small>
          </article>
        ))}
      </div>

      <div className="two-column">
        <article className="panel">
          <div className="panel-header">
            <h2>Recent orders</h2>
            <span>Live queue</span>
          </div>
          <div className="table-list">
            {recentOrders.slice(0, 3).map((order) => (
              <div className="table-row" key={order.id}>
                <strong>{order.id}</strong>
                <span>{order.customer}</span>
                <span>{order.total}</span>
                <span className="status">{order.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Inventory alerts</h2>
            <span>Needs attention</span>
          </div>
          <div className="table-list">
            {inventoryItems
              .filter((item) => item.status !== 'In stock')
              .map((item) => (
                <div className="table-row" key={item.sku}>
                  <strong>{item.name}</strong>
                  <span>{item.sku}</span>
                  <span>{item.stock} left</span>
                  <span className="status warning">{item.status}</span>
                </div>
              ))}
          </div>
        </article>
      </div>
    </section>
  )
}

