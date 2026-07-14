import { inventoryItems } from '../data/shopData'

export function Inventory() {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Product inventory</h2>
        <button className="secondary-action" type="button">
          Add product
        </button>
      </div>

      <div className="data-table">
        <div className="data-row table-heading">
          <span>Product</span>
          <span>SKU</span>
          <span>Stock</span>
          <span>Status</span>
          <span>Price</span>
        </div>
        {inventoryItems.map((item) => (
          <div className="data-row" key={item.sku}>
            <strong>{item.name}</strong>
            <span>{item.sku}</span>
            <span>{item.stock}</span>
            <span className={item.status === 'In stock' ? 'status' : 'status warning'}>{item.status}</span>
            <span>{item.price}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

