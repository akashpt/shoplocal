import { useEffect, useMemo, useRef, useState } from 'react'
import { AppIcon, type AppIconName } from '../components/ui/AppIcon'
import type { PageId } from '../types'
import type { Product as InventoryProduct } from './Inventory'

type CounterMode = 'dine' | 'takeaway'
type CounterStep = 'tables' | 'menu' | 'review'
type PaymentMethod = 'Cash' | 'UPI' | 'Card'
type CounterProduct = {
  id: string
  name: string
  category: string
  price: number
  stock: string
  count: number
}

type CounterTable = {
  area: 'Main Hall' | 'Floor 1' | 'Outdoor'
  id: string
  seats: number
  status: string
}

type SalesCounterProps = {
  inventoryProducts: InventoryProduct[]
  mode: CounterMode
  onExit: () => void
  onNavigate: (page: PageId) => void
}

const railNavItems: Array<{ icon: AppIconName; label: string; page: PageId }> = [
  { icon: 'dashboard', label: 'Dashboard', page: 'dashboard' },
  { icon: 'box', label: 'Inventory', page: 'inventory' },
  { icon: 'cart', label: 'Orders', page: 'orders' },
  { icon: 'tag', label: 'Offers', page: 'offers' },
  { icon: 'cash', label: 'Expenses', page: 'expenses' },
  { icon: 'invoice', label: 'Invoices', page: 'invoices' },
  { icon: 'shops', label: 'Manage Shops', page: 'shops' },
  { icon: 'settings', label: 'Settings', page: 'settings' },
]

const tables: CounterTable[] = [
  { area: 'Main Hall', id: 'T1', seats: 2, status: 'Occupied' },
  { area: 'Main Hall', id: 'T2', seats: 4, status: 'Available' },
  { area: 'Main Hall', id: 'T3', seats: 6, status: 'Reserved' },
  { area: 'Main Hall', id: 'T4', seats: 2, status: 'Occupied' },
  { area: 'Main Hall', id: 'T5', seats: 4, status: 'Available' },
  { area: 'Main Hall', id: 'T6', seats: 2, status: 'Reserved' },
  { area: 'Main Hall', id: 'T7', seats: 6, status: 'Available' },
  { area: 'Main Hall', id: 'T8', seats: 8, status: 'Available' },
  { area: 'Main Hall', id: 'T9', seats: 3, status: 'Reserved' },
  { area: 'Floor 1', id: 'T1', seats: 2, status: 'Available' },
  { area: 'Floor 1', id: 'T2', seats: 4, status: 'Available' },
  { area: 'Floor 1', id: 'T3', seats: 6, status: 'Reserved' },
  { area: 'Floor 1', id: 'T4', seats: 2, status: 'Occupied' },
  { area: 'Floor 1', id: 'T5', seats: 4, status: 'Available' },
  { area: 'Outdoor', id: 'T1', seats: 2, status: 'Available' },
  { area: 'Outdoor', id: 'T2', seats: 4, status: 'Reserved' },
  { area: 'Outdoor', id: 'T3', seats: 4, status: 'Available' },
]

function priceToNumber(price: string) {
  const normalizedPrice = price
    .replace(/^rs\.?/i, '')
    .replace(/[^\d.]/g, '')
    .replace(/^\./, '')

  return Number(normalizedPrice) || 0
}

function mapInventoryProducts(products: InventoryProduct[]): CounterProduct[] {
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price: priceToNumber(product.price),
    stock: product.stock > 0 ? `${product.stock} left` : 'Out',
    count: 0,
  }))
}

function initialProducts(inventoryProducts: InventoryProduct[]) {
  return mapInventoryProducts(inventoryProducts).map((product) => ({ ...product }))
}

function formatCounterDate(date: Date) {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatCounterTime(date: Date) {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function getTableKey(table: CounterTable) {
  return `${table.area}:${table.id}`
}

function getTableLabel(tableKey: string) {
  const table = tables.find((item) => getTableKey(item) === tableKey)
  return table ? `${table.area} ${table.id.replace('T', 'Table ')}` : tableKey
}

function getTableShortLabel(tableKey: string) {
  const table = tables.find((item) => getTableKey(item) === tableKey)
  return table ? table.id.replace('T', 'Table ') : tableKey
}

export function SalesCounter({ mode, inventoryProducts, onExit, onNavigate }: SalesCounterProps) {
  const [step, setStep] = useState<CounterStep>(mode === 'dine' ? 'tables' : 'menu')
  const [selectedTable, setSelectedTable] = useState(getTableKey(tables[1]))
  const [payment, setPayment] = useState<PaymentMethod>('Cash')
  const [coupon, setCoupon] = useState(mode === 'takeaway' ? 'SAVE20' : '')
  const [isCouponApplied, setIsCouponApplied] = useState(mode === 'takeaway')
  const [isComplete, setIsComplete] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date())
  const [products, setProducts] = useState(() => initialProducts(inventoryProducts))
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const orderItems = products.filter((item) => item.count > 0)
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.count, 0)
  const discount = isCouponApplied ? Math.round(subtotal * 0.2) : 0
  const taxable = subtotal - discount
  const tax = Math.round(taxable * 0.025)
  const total = taxable + tax * 2
  const received = mode === 'dine' ? 800 : 100

  const categories = useMemo(
    () => ['All Products', ...Array.from(new Set(inventoryProducts.map((product) => product.category)))],
    [inventoryProducts],
  )

  const title = step === 'tables' ? 'Select a Table' : 'Sales Counter'

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentDateTime(new Date()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function resetBill() {
    setProducts(initialProducts(inventoryProducts))
    setCoupon(mode === 'takeaway' ? 'SAVE20' : '')
    setIsCouponApplied(mode === 'takeaway')
    setIsComplete(false)
    setStep(mode === 'dine' ? 'tables' : 'menu')
  }

  function updateQuantity(productId: string, delta: number) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? { ...product, count: Math.max(0, product.count + delta) }
          : product,
      ),
    )
  }

  function clearCart() {
    setProducts((currentProducts) => currentProducts.map((product) => ({ ...product, count: 0 })))
  }

  return (
    <div className="counter-shell">
      <CounterRail onNavigate={onNavigate} />
      <main className="counter-main">
        <header className="counter-topbar">
          <div>
            <h1>{title}</h1>
            <span>{mode === 'dine' ? 'Dine in' : 'Takeaway'}</span>
          </div>
          <div className="counter-meta">
            <time dateTime={currentDateTime.toISOString()}>{formatCounterDate(currentDateTime)}</time>
            <time dateTime={currentDateTime.toISOString()}>{formatCounterTime(currentDateTime)}</time>
            <div className="header-menu counter-profile-menu" ref={profileMenuRef}>
              <button
                className={isProfileOpen ? 'user-avatar active' : 'user-avatar'}
                type="button"
                aria-expanded={isProfileOpen}
                onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
              >
                AM
              </button>
              {isProfileOpen && (
                <div className="dropdown-panel profile-dropdown">
                  <div className="profile-menu-card">
                    <span className="profile-menu-avatar">AM</span>
                    <div>
                      <strong>Anita Mani</strong>
                      <small>Store manager</small>
                      <em>{mode === 'dine' ? 'Dine in counter' : 'Takeaway counter'}</em>
                    </div>
                  </div>
                  <button type="button" onClick={() => onNavigate('settings')}><AppIcon name="user" /> Manage profile</button>
                  <button type="button" onClick={() => onNavigate('shops')}><AppIcon name="shops" /> Switch shop</button>
                  <button className="danger-menu-action" type="button" onClick={onExit}><AppIcon name="x" /> Exit counter</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {step === 'tables' ? (
          <TableSelection selectedTable={selectedTable} onSelect={setSelectedTable} onTakeOrder={() => setStep('menu')} />
        ) : (
          <div className={step === 'menu' ? 'counter-workspace' : 'counter-workspace review'}>
            <section className="counter-stage">
              {step === 'menu' ? (
                <MenuStage
                  categories={categories}
                  mode={mode}
                  products={products}
                  selectedTable={selectedTable}
                  onAddProduct={(productId) => updateQuantity(productId, 1)}
                  onDecreaseProduct={(productId) => updateQuantity(productId, -1)}
                  onBack={() => mode === 'dine' ? setStep('tables') : onExit()}
                />
              ) : (
                <ReviewStage
                  mode={mode}
                  orderItems={orderItems}
                  selectedTable={selectedTable}
                  onDecrease={(productId) => updateQuantity(productId, -1)}
                  onIncrease={(productId) => updateQuantity(productId, 1)}
                  onBack={() => setStep('menu')}
                />
              )}
            </section>
            <PaymentSidebar
              coupon={coupon}
              discount={discount}
              isCouponApplied={isCouponApplied}
              mode={mode}
              orderItems={orderItems}
              payment={payment}
              received={received}
              subtotal={subtotal}
              tax={tax}
              total={total}
              variant={step}
              onClearCart={clearCart}
              onDecrease={(productId) => updateQuantity(productId, -1)}
              onIncrease={(productId) => updateQuantity(productId, 1)}
              onRemove={(productId) => {
                setProducts((currentProducts) =>
                  currentProducts.map((product) => product.id === productId ? { ...product, count: 0 } : product),
                )
              }}
              onApplyCoupon={() => setIsCouponApplied(coupon.trim().length > 0)}
              onCouponChange={setCoupon}
              onPaymentChange={setPayment}
              primaryLabel={step === 'menu' ? (mode === 'dine' ? 'Create KOT' : 'Proceed to Payment') : 'Print Bill'}
              onPrimary={() => step === 'menu' ? setStep('review') : setIsComplete(true)}
            />
          </div>
        )}
      </main>

      {isComplete && (
        <CompletionModal
          mode={mode}
          itemCount={orderItems.reduce((sum, item) => sum + item.count, 0)}
          payment={payment}
          selectedTable={selectedTable}
          total={total}
          onNewBill={resetBill}
        />
      )}
    </div>
  )
}

function CounterRail({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <aside className="counter-rail">
      <span className="brand-mark" aria-hidden="true"><span className="brand-stack"><span></span><span></span><span></span></span></span>
      <nav aria-label="Counter navigation">
        {railNavItems.map((item) => (
          <button className="counter-rail-button" type="button" key={item.page} aria-label={item.label} onClick={() => onNavigate(item.page)}>
            <AppIcon name={item.icon} />
            <span className="counter-rail-tooltip" role="tooltip">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

function TableSelection({ selectedTable, onSelect, onTakeOrder }: { selectedTable: string; onSelect: (table: string) => void; onTakeOrder: () => void }) {
  const [activeArea, setActiveArea] = useState<'Main Hall' | 'Floor 1' | 'Outdoor' | 'Reserved'>('Main Hall')
  const [searchQuery, setSearchQuery] = useState('')
  const normalizedSearch = searchQuery.trim().toLowerCase()
  const filteredByArea = activeArea === 'Reserved'
    ? tables.filter((table) => table.status === 'Reserved')
    : tables.filter((table) => table.area === activeArea)
  const visibleTables = filteredByArea.filter((table) => {
    if (normalizedSearch.length === 0) {
      return true
    }

    return (
      table.id.toLowerCase().includes(normalizedSearch) ||
      table.id.replace('T', 'Table ').toLowerCase().includes(normalizedSearch) ||
      table.area.toLowerCase().includes(normalizedSearch) ||
      table.status.toLowerCase().includes(normalizedSearch)
    )
  })
  const sectionTitle = activeArea === 'Reserved' ? 'Reserved Tables' : activeArea

  return (
    <div className="table-select-layout">
      <aside className="counter-table-sidebar">
        <label><AppIcon name="search" /><input placeholder="Search table" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /></label>
        {['Main Hall', 'Floor 1', 'Outdoor', 'Reserved'].map((area, index) => (
          <button className={activeArea === area ? 'active' : ''} type="button" key={area} onClick={() => setActiveArea(area as typeof activeArea)}>
            <AppIcon name={index === 0 ? 'dashboard' : index === 1 ? 'table' : index === 2 ? 'store' : 'clock'} />
            {area}
          </button>
        ))}
      </aside>
      <div className="table-select-screen">
        <div className="table-select-body">
          <section>
            <h2>{sectionTitle}</h2>
            <div className="counter-table-grid">
              {visibleTables.map((table) => <TableCard key={getTableKey(table)} table={table} selected={selectedTable === getTableKey(table)} onSelect={() => onSelect(getTableKey(table))} />)}
            </div>
            {visibleTables.length === 0 && <div className="inventory-empty">No tables found.</div>}
          </section>
        </div>
        <footer className="table-select-footer">
          <button type="button">{getTableLabel(selectedTable)} selected</button>
          <span>Ready to take Order</span>
          <button className="counter-primary" type="button" onClick={onTakeOrder}>Take Order</button>
        </footer>
      </div>
    </div>
  )
}

function TableCard({ selected, table, onSelect }: { selected: boolean; table: CounterTable; onSelect: () => void }) {
  return (
    <button className={selected ? 'counter-table-card selected' : 'counter-table-card'} type="button" onClick={onSelect}>
      <strong className={table.status.toLowerCase()}>{table.id}</strong>
      <span>{table.seats} Seats <AppIcon name="users" /></span>
      <em className={table.status.toLowerCase()}>{table.status}</em>
    </button>
  )
}

function MenuStage({ categories, mode, products, selectedTable, onAddProduct, onDecreaseProduct, onBack }: {
  categories: string[]
  mode: CounterMode
  products: CounterProduct[]
  selectedTable: string
  onAddProduct: (productId: string) => void
  onDecreaseProduct: (productId: string) => void
  onBack: () => void
}) {
  const [activeCategory, setActiveCategory] = useState('All Products')
  const [searchQuery, setSearchQuery] = useState('')
  const normalizedSearch = searchQuery.trim().toLowerCase()
  const visibleProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'All Products' || product.category === activeCategory
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.category.toLowerCase().includes(normalizedSearch)

    return matchesCategory && matchesSearch
  })

  return (
    <div className="menu-stage">
      <div className="counter-tabs">
        <button type="button" onClick={onBack}><AppIcon name="chevron" /> Back</button>
        <button className="active" type="button">
          {mode === 'dine' ? getTableShortLabel(selectedTable) : 'Takeaway Bill'}
        </button>
      </div>
      <div className="counter-menu-grid">
        <aside className="counter-category-sidebar">
          <label><AppIcon name="search" /><input placeholder="Search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /></label>
          {categories.map((category, index) => (
            <button className={activeCategory === category ? 'active' : ''} type="button" key={category} onClick={() => setActiveCategory(category)}>
              <AppIcon name={index === 0 ? 'dashboard' : index === 1 ? 'box' : index === 2 ? 'zap' : index === 3 ? 'store' : index === 4 ? 'smartphone' : 'more'} />
              {category}
            </button>
          ))}
        </aside>
        <section>
          <h2>{activeCategory}</h2>
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className={product.count > 0 ? 'counter-product-card selected' : 'counter-product-card'} key={product.id}>
                {product.count > 0 && <span className="product-count">{product.count}</span>}
                <div className="product-image"><AppIcon name="image" /></div>
                <span className={product.stock === 'Out' ? 'stock-badge out' : 'stock-badge'}>{product.stock}</span>
                <strong>{product.name}</strong>
                <b>₹{product.price}</b>
                <div className="counter-product-actions">
                  {product.count > 0 && <button type="button" aria-label={`Remove ${product.name}`} onClick={() => onDecreaseProduct(product.id)}>-</button>}
                  <button type="button" aria-label={`Add ${product.name}`} onClick={() => onAddProduct(product.id)}><AppIcon name="plus" /></button>
                </div>
              </article>
            ))}
            {visibleProducts.length === 0 && <div className="inventory-empty">No products match this category.</div>}
          </div>
        </section>
      </div>
    </div>
  )
}

function ReviewStage({ mode, orderItems, onBack, onDecrease, onIncrease }: {
  mode: CounterMode
  orderItems: CounterProduct[]
  selectedTable: string
  onBack: () => void
  onDecrease: (productId: string) => void
  onIncrease: (productId: string) => void
}) {
  return (
    <div className="review-stage">
      <button className="review-back" type="button" onClick={onBack}><AppIcon name="chevron" /> Back</button>
      <h2>Order Review</h2>
      <p>Confirm items before collecting payment</p>
      <section className="review-card">
        <header><h3>Items</h3><span>{mode === 'dine' ? 'Dine in' : 'Takeaway'}</span></header>
        <div className="review-table heading"><span>#</span><span>Products</span><span>Price</span><span>Qty</span><span>Total</span></div>
        {orderItems.map((item, index) => (
          <div className="review-table" key={item.id}>
            <span>{index + 1}</span><span>{item.name}</span><span>₹{item.price}</span>
            <span><button type="button" onClick={() => onDecrease(item.id)}>-</button>{item.count}<button type="button" onClick={() => onIncrease(item.id)}>+</button></span>
            <span>₹{item.price * item.count}</span>
          </div>
        ))}
      </section>
      <section className="customer-card">
        <h3>Customer Details <span>(Optional)</span></h3>
        <label>Customer Name<input placeholder="Enter Name" /></label>
        <label>Customer Mobile Number<input placeholder="Enter Mobile Number" /></label>
      </section>
    </div>
  )
}

function PaymentSidebar({ coupon, discount, isCouponApplied, orderItems, payment, received, subtotal, tax, total, variant, onClearCart, onDecrease, onIncrease, onRemove, onApplyCoupon, onCouponChange, onPaymentChange, primaryLabel, onPrimary }: {
  coupon: string
  discount: number
  isCouponApplied: boolean
  mode: CounterMode
  orderItems: CounterProduct[]
  payment: PaymentMethod
  received: number
  subtotal: number
  tax: number
  total: number
  variant: CounterStep
  onClearCart: () => void
  onDecrease: (productId: string) => void
  onIncrease: (productId: string) => void
  onRemove: (productId: string) => void
  onApplyCoupon: () => void
  onCouponChange: (value: string) => void
  onPaymentChange: (method: PaymentMethod) => void
  primaryLabel: string
  onPrimary: () => void
}) {
  const change = Math.max(received - total, 0)
  const showCart = variant === 'menu'
  return (
    <aside className={showCart ? 'payment-sidebar' : 'payment-sidebar payment-only'}>
      {showCart && (
        <section className="order-mini">
          <div><h2>Order ({orderItems.length} item)</h2><button type="button" onClick={onClearCart}>Clear cart</button></div>
          {orderItems.map((item) => (
            <article key={item.id}>
              <div><strong>{item.name}</strong><small>₹{item.price} each</small></div>
              <span><button type="button" onClick={() => onDecrease(item.id)}>-</button>{item.count}<button type="button" onClick={() => onIncrease(item.id)}>+</button></span>
              <b>₹{item.price * item.count}</b>
              <button type="button" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.id)}><AppIcon name="x" /></button>
            </article>
          ))}
        </section>
      )}
      {showCart && (
        <section className="coupon-box">
          <h2>Coupon / Discount</h2>
          <div><input value={coupon} placeholder="Enter Coupon code" onChange={(event) => onCouponChange(event.target.value)} /><button type="button" onClick={onApplyCoupon}>Apply</button></div>
          {isCouponApplied && <p><AppIcon name="check-circle" /> SAVE20 applied - ₹{discount} saved</p>}
        </section>
      )}
      <section className="payment-summary">
        <h2>Payment Summary</h2>
        <p><span>Subtotal</span><b>₹{subtotal.toFixed(2)}</b></p>
        <p><span>Discount</span><b>{isCouponApplied && <small>[-20%]</small>}-₹{discount.toFixed(2)}</b></p>
        <p><span>SGST (2.5%)</span><b>₹{tax.toFixed(2)}</b></p>
        <p><span>CGST (2.5%)</span><b>₹{tax.toFixed(2)}</b></p>
        <p className="summary-total"><span>Total</span><b>₹{total.toFixed(2)}</b></p>
      </section>
      {!showCart && (
        <>
      <section className="payment-methods">
        <h2>Payment Method</h2>
        {(['Cash', 'UPI', 'Card'] as const).map((method) => (
          <button className={payment === method ? 'active' : ''} type="button" key={method} onClick={() => onPaymentChange(method)}>
            <AppIcon name={method === 'Cash' ? 'cash' : method === 'UPI' ? 'smartphone' : 'credit-card'} />
            {method}
          </button>
        ))}
      </section>
      <section className="amount-box">
        <h2>Amount Received</h2>
        <strong>₹{received}</strong>
        <p><span>Change to return</span><b>₹{change}</b></p>
      </section>
        </>
      )}
      <button className="counter-primary" type="button" onClick={onPrimary} disabled={orderItems.length === 0}>
        {primaryLabel === 'Print Bill' && <AppIcon name="printer" />}
        {primaryLabel}
      </button>
    </aside>
  )
}

function CompletionModal({ itemCount, mode, payment, selectedTable, total, onNewBill }: {
  itemCount: number
  mode: CounterMode
  payment: PaymentMethod
  selectedTable: string
  total: number
  onNewBill: () => void
}) {
  return (
    <div className="counter-modal-backdrop">
      <section className="counter-complete-modal">
        <h2>{mode === 'dine' ? 'Order Complete!' : 'Sale Complete!'}</h2>
        <p>Bill is ready to print and share with the customer</p>
        <dl>
          <div><dt>Bill no</dt><dd>#BILL-0046</dd></div>
          <div><dt>Type</dt><dd>{mode === 'dine' ? 'Dine In' : 'Takeaway'}</dd></div>
          {mode === 'dine' && <div><dt>Table No.</dt><dd>{getTableLabel(selectedTable)}</dd></div>}
          <div><dt>Items</dt><dd>{itemCount} item</dd></div>
          <div><dt>Total Paid</dt><dd>₹{total}</dd></div>
          <div><dt>Payment</dt><dd>{payment}</dd></div>
        </dl>
        <button className="counter-primary" type="button" onClick={onNewBill}><AppIcon name="plus" /> New Bill</button>
      </section>
    </div>
  )
}
