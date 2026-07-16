import { useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { AppIcon, type AppIconName } from '../components/ui/AppIcon'
import { FormField } from '../components/ui/FormField'
import { PageActions } from '../components/ui/PageActions'
import { Panel } from '../components/ui/Panel'
import { ToggleSwitch } from '../components/ui/ToggleSwitch'
import { showToast } from '../utils/toast'

type OffersProps = {
  onViewChange: (view: 'list' | 'create') => void
  searchQuery: string
  view: 'list' | 'create'
}

type OfferType = 'Flat discount' | 'Percentage discount' | 'Combo discount' | 'Add-ons combo' | 'Freebie offer'

const productOptions = [
  'Tata Salt 1kg',
  'Aashirvaad Atta 5kg',
  'Amul Butter 200g',
  'Amul Milk 500ml',
]

const couponAllowedTypes: OfferType[] = ['Flat discount', 'Percentage discount']

const offerRows = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  name: 'SAVE20',
  code: 'SAVE20',
  summary: '25% off, max Rs150 cap',
  products: 'All products',
  type: '25% off',
  validity: 'Until May 15',
  dates: 'May 1 - May 15',
  active: true,
  usage: 48,
}))

const chartData = [
  { date: 'May 2', orders: 41 },
  { date: 'May 3', orders: 25 },
  { date: 'May 4', orders: 31 },
  { date: 'May 5', orders: 15 },
  { date: 'May 6', orders: 36 },
  { date: 'May 7', orders: 18 },
  { date: 'May 8', orders: 47 },
]

function OfferIcon({ icon, tone }: { icon: 'document' | 'cart' | 'money' | 'warning'; tone: 'blue' | 'violet' | 'green' | 'amber' }) {
  const icons: Record<typeof icon, AppIconName> = {
    document: 'invoice',
    cart: 'cart',
    money: 'cash',
    warning: 'alert',
  }

  return (
    <span className={`offer-metric-icon ${tone}`}>
      <AppIcon name={icons[icon]} />
    </span>
  )
}

export function Offers({ onViewChange, searchQuery, view }: OffersProps) {
  const [activeOffers, setActiveOffers] = useState(() => offerRows.map((offer) => offer.id))
  const [selectedOffers, setSelectedOffers] = useState<number[]>([])
  const normalizedSearch = searchQuery.trim().toLowerCase()
  const filteredOffers = useMemo(
    () =>
      offerRows.filter(
        (offer) =>
          normalizedSearch.length === 0 ||
          offer.name.toLowerCase().includes(normalizedSearch) ||
          offer.code.toLowerCase().includes(normalizedSearch),
      ),
    [normalizedSearch],
  )
  const visibleOfferIds = filteredOffers.map((offer) => offer.id)
  const selectedVisibleCount = selectedOffers.filter((offerId) => visibleOfferIds.includes(offerId)).length
  const areVisibleOffersSelected = visibleOfferIds.length > 0 && selectedVisibleCount === visibleOfferIds.length

  function toggleOffer(id: number, checked: boolean) {
    setActiveOffers((currentOffers) =>
      checked ? Array.from(new Set([...currentOffers, id])) : currentOffers.filter((offerId) => offerId !== id),
    )
    showToast(checked ? 'Offer activated successfully.' : 'Offer paused successfully.', checked ? 'success' : 'warning')
  }

  function toggleSelection(id: number, checked: boolean) {
    setSelectedOffers((currentOffers) =>
      checked ? Array.from(new Set([...currentOffers, id])) : currentOffers.filter((offerId) => offerId !== id),
    )
  }

  function toggleVisibleSelection(checked: boolean) {
    setSelectedOffers((currentOffers) =>
      checked
        ? Array.from(new Set([...currentOffers, ...visibleOfferIds]))
        : currentOffers.filter((offerId) => !visibleOfferIds.includes(offerId)),
    )
  }

  function updateSelectedOffers(checked: boolean) {
    if (selectedOffers.length === 0) {
      showToast('Select at least one offer first.', 'warning')
      return
    }

    setActiveOffers((currentOffers) =>
      checked
        ? Array.from(new Set([...currentOffers, ...selectedOffers]))
        : currentOffers.filter((offerId) => !selectedOffers.includes(offerId)),
    )
    showToast(checked ? 'Selected offers activated.' : 'Selected offers paused.', checked ? 'success' : 'warning')
  }

  if (view === 'create') {
    return <CreateOfferView onCancel={() => onViewChange('list')} onSave={() => onViewChange('list')} />
  }

  return (
    <section className="offers-page">
      <div className="offer-metric-grid">
        <Panel className="offer-metric-card"><span>Active Offers</span><strong>{activeOffers.length}</strong><OfferIcon icon="document" tone="blue" /></Panel>
        <Panel className="offer-metric-card"><span>Coupons used today</span><strong>31</strong><OfferIcon icon="cart" tone="violet" /></Panel>
        <Panel className="offer-metric-card"><span>Revenue from offers</span><strong>Rs.6,240</strong><OfferIcon icon="money" tone="green" /></Panel>
        <Panel className="offer-metric-card"><span>Expiring this week</span><strong>2</strong><OfferIcon icon="warning" tone="amber" /></Panel>
      </div>

      <Panel className="active-offers-panel">
        <div className="active-offers-heading">
          <div>
            <h2>Active offers</h2>
            <p>Currently running promotions</p>
          </div>
          <label className="offer-select-all">
            <input
              type="checkbox"
              checked={areVisibleOffersSelected}
              onChange={(event) => toggleVisibleSelection(event.target.checked)}
            />
            <span>All</span>
          </label>
        </div>
        {selectedOffers.length > 0 && (
          <div className="offer-selection-bar">
            <span>{selectedOffers.length} selected</span>
            <button type="button" onClick={() => updateSelectedOffers(true)}>Activate</button>
            <button type="button" onClick={() => updateSelectedOffers(false)}>Pause</button>
            <button type="button" onClick={() => {
              setSelectedOffers([])
              showToast('Offer selection cleared.', 'info')
            }}>Clear</button>
          </div>
        )}
        <div className="offer-card-list">
          {filteredOffers.map((offer) => (
            <div className={selectedOffers.includes(offer.id) ? 'offer-list-card selected' : 'offer-list-card'} key={`active-${offer.id}`}>
              <div className="offer-list-grid">
                <div><small>Offer Name</small><strong>{offer.name}</strong></div>
                <div><small>Coupon Code</small><strong>{offer.code}</strong></div>
                <div><small>Offer Type</small><strong>{offer.type}</strong></div>
                <div><small>Validity</small><strong>{offer.validity}</strong></div>
                <div><small>Status</small><span className={activeOffers.includes(offer.id) ? '' : 'inactive'}>{activeOffers.includes(offer.id) ? 'Active' : 'Inactive'}</span></div>
                <label><input type="checkbox" checked={selectedOffers.includes(offer.id)} onChange={(event) => toggleSelection(offer.id, event.target.checked)} /></label>
              </div>
              <div className="offer-usage-row">
                <small>Usage</small>
                <span><i></i>{offer.usage} Used</span>
                <span><i></i>Limit 100</span>
                <span><i></i>Min Order Rs200</span>
                <ToggleSwitch checked={activeOffers.includes(offer.id)} label={`${offer.name} active`} onChange={(checked) => toggleOffer(offer.id, checked)} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="all-offers-panel">
        <h2>All offers</h2>
        <div className="all-offers-table">
          <div><span>Offer Name</span><span>Discount Summary</span><span>Products Affected</span><span>Validity Dates</span><span>Status</span><span></span></div>
          {filteredOffers.map((offer) => (
            <div key={`all-${offer.id}`}>
              <strong>{offer.name}</strong>
              <span>{offer.summary}</span>
              <span>{offer.products}</span>
              <span>{offer.dates}</span>
              <em className={activeOffers.includes(offer.id) ? '' : 'inactive'}>{activeOffers.includes(offer.id) ? 'Active' : 'Inactive'}</em>
              <ToggleSwitch checked={activeOffers.includes(offer.id)} label={`${offer.name} active`} onChange={(checked) => toggleOffer(offer.id, checked)} />
            </div>
          ))}
        </div>
        <div className="table-footer">
          <span>Showing 1 - 6 of 16 Offers</span>
          <div className="pagination"><button type="button">&lt;</button><button className="active" type="button">1</button><button type="button">2</button><button type="button">3</button><button type="button">&gt;</button></div>
        </div>
      </Panel>

      <div className="offers-bottom-grid">
        <Panel className="offer-chart-panel">
          <div className="panel-header compact"><h2>Orders generated per offer</h2><span>Last 7 days</span></div>
          <div className="offer-chart-canvas">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e2e2e2" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 60]} ticks={[0, 10, 20, 30, 40, 50, 60]} />
                <Bar dataKey="orders" fill="#3B6EF8" radius={[12, 12, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel className="performance-panel">
          <h2>Performance insights</h2>
          {offerRows.map((offer) => (
            <div key={`insight-${offer.id}`}><strong>{offer.name}</strong><span>{offer.usage} orders generated</span><em>+Rs.2,940</em></div>
          ))}
        </Panel>
      </div>
    </section>
  )
}

function CreateOfferView({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  const [offerName, setOfferName] = useState('')
  const [hasCoupon, setHasCoupon] = useState(true)
  const [couponCode, setCouponCode] = useState('WEEKEND50')
  const [offerType, setOfferType] = useState<OfferType>('Flat discount')
  const [discountValue, setDiscountValue] = useState('20')
  const [applyTo, setApplyTo] = useState('Specific Products')
  const [minOrder, setMinOrder] = useState('200')
  const [maxCap, setMaxCap] = useState('100')
  const [usageLimit, setUsageLimit] = useState('1')
  const [overallUsageLimit, setOverallUsageLimit] = useState('500')
  const [selectedProducts, setSelectedProducts] = useState(productOptions.slice(0, 2))
  const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 4, 15))
  const [endDate, setEndDate] = useState<Date | null>(new Date(2026, 5, 15))

  function generateCode() {
    setCouponCode(`${(offerName || 'WEEKEND').replace(/\s+/g, '').slice(0, 7).toUpperCase()}${Math.floor(10 + Math.random() * 89)}`)
    showToast('Coupon code generated.', 'success')
  }

  function toggleCoupon(checked: boolean) {
    setHasCoupon(checked)
    if (checked && !couponAllowedTypes.includes(offerType)) {
      setOfferType('Flat discount')
    }
    showToast(checked ? 'Coupon code enabled.' : 'Coupon code disabled.', 'info')
  }

  function addProduct() {
    const nextProduct = productOptions.find((product) => !selectedProducts.includes(product))
    if (nextProduct) {
      setSelectedProducts((currentProducts) => [...currentProducts, nextProduct])
      showToast(`${nextProduct} added to offer.`, 'success')
      return
    }

    showToast('All products are already selected.', 'warning')
  }

  function removeProduct(product: string) {
    setSelectedProducts((currentProducts) => currentProducts.filter((selectedProduct) => selectedProduct !== product))
    showToast(`${product} removed from offer.`, 'error')
  }

  function formatPreviewDate(date: Date | null) {
    return date ? date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not set'
  }

  return (
    <section className="create-offer-page">
      <div className="create-offer-main">
        <Panel className="offer-form-panel">
          <h2>Basic information</h2>
          <FormField label="Offer name"><input value={offerName} onChange={(event) => setOfferName(event.target.value)} placeholder="e.g. Weekend sale" /></FormField>
          <div className="coupon-toggle-row">
            <div><strong>Has a coupon code?</strong><span>Customers apply this code at checkout</span></div>
            <ToggleSwitch checked={hasCoupon} label="Has coupon code" onChange={toggleCoupon} />
          </div>
          {hasCoupon && (
            <FormField label="Coupon code" help="Customers enter this code at checkout to apply the offer">
              <div className="coupon-code-row"><input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} /><button type="button" onClick={generateCode}>Generate Code</button></div>
            </FormField>
          )}
        </Panel>

        <Panel className="offer-form-panel">
          <div className="section-title-row"><h2>Offer type</h2><span>Select one</span></div>
          <div className="offer-type-grid">
            {[
              ['Flat discount', 'Fixed amount off the total'],
              ['Percentage discount', '% off cart total or item price'],
              ['Combo discount', 'Discount on a set of items'],
              ['Add-ons combo', 'Bundle add-ons at reduced price'],
              ['Freebie offer', 'Free item when conditions met'],
            ].map(([title, detail]) => (
              <button
                className={offerType === title ? 'offer-type-card active' : 'offer-type-card'}
                disabled={hasCoupon && !couponAllowedTypes.includes(title as OfferType)}
                key={title}
                type="button"
                onClick={() => setOfferType(title as OfferType)}
              >
                <div><strong>{title}</strong><span>{detail}</span></div><i></i>
              </button>
            ))}
          </div>
          <p className="offer-warning">* Combo discount, Add-ons combo and Freebie Offer are not applicable for coupon codes</p>
        </Panel>

        <Panel className="offer-form-panel">
          <h2>Offer value</h2>
          <div className="product-form-grid">
            <FormField label="Discount value (%)"><input value={discountValue} onChange={(event) => setDiscountValue(event.target.value)} /></FormField>
            <FormField label="Apply to"><select value={applyTo} onChange={(event) => setApplyTo(event.target.value)}><option>Specific Products</option><option>All Products</option></select></FormField>
            <FormField label="Selling price (Rs)"><input placeholder="0.0" /></FormField>
            <FormField label="Stock quantity"><input placeholder="0" /></FormField>
          </div>
          <div className="selected-products">
            {selectedProducts.map((product) => (
              <span key={product}>{product} <button type="button" aria-label={`Remove ${product}`} onClick={() => removeProduct(product)}>x</button></span>
            ))}
            <button type="button" disabled={selectedProducts.length === productOptions.length} onClick={addProduct}>+ Add Product</button>
          </div>
        </Panel>

        <Panel className="offer-form-panel">
          <h2>Rules</h2>
          <div className="product-form-grid">
            <FormField label="Min order value (Rs)"><input value={minOrder} onChange={(event) => setMinOrder(event.target.value)} placeholder="e.g. 200" /></FormField>
            <FormField label="Max discount cap (Rs)"><input value={maxCap} onChange={(event) => setMaxCap(event.target.value)} placeholder="e.g. 100" /></FormField>
            <FormField label="Usage limit per customer"><input value={usageLimit} onChange={(event) => setUsageLimit(event.target.value)} placeholder="e.g. 1" /></FormField>
            <FormField label="Overall usage limit"><input value={overallUsageLimit} onChange={(event) => setOverallUsageLimit(event.target.value)} placeholder="e.g. 500" /></FormField>
          </div>
        </Panel>

        <Panel className="offer-form-panel">
          <h2>Time validity</h2>
          <div className="product-form-grid">
            <FormField label="Start date"><DatePicker calendarClassName="app-date-picker-calendar" className="date-picker-input" selected={startDate} onChange={(date: Date | null) => setStartDate(date)} dateFormat="dd / MM / yyyy" showPopperArrow={false} /></FormField>
            <FormField label="End date"><DatePicker calendarClassName="app-date-picker-calendar" className="date-picker-input" selected={endDate} onChange={(date: Date | null) => setEndDate(date)} dateFormat="dd / MM / yyyy" minDate={startDate || undefined} showPopperArrow={false} /></FormField>
          </div>
        </Panel>
        <PageActions
          onCancel={onCancel}
          onSave={() => {
            if (!offerName.trim()) {
              showToast('Offer name is required.', 'error')
              return
            }

            if (applyTo === 'Specific Products' && selectedProducts.length === 0) {
              showToast('Select at least one product for this offer.', 'error')
              return
            }

            onSave()
          }}
          saveLabel="Create Offer"
        />
      </div>

      <aside className="offer-preview-panel">
        <Panel>
          <h2>Offer preview</h2>
          <div className="preview-coupon"><span>%</span><div><strong>{hasCoupon ? couponCode : 'NO COUPON'}</strong><p>{discountValue}% off {applyTo.toLowerCase()}</p></div></div>
          <PreviewRow label="Type" value={offerType.includes('Percentage') ? 'Percentage' : 'Flat'} />
          <PreviewRow label="Discount" value={`${discountValue}%`} />
          <PreviewRow label="Min order" value={`Rs${minOrder}`} />
          <PreviewRow label="Max savings" value={`Rs${maxCap}`} />
          <PreviewRow label="Products" value={applyTo === 'All Products' ? 'All products' : `${selectedProducts.length} selected`} />
          <PreviewRow label="Valid until" value={formatPreviewDate(endDate)} />
          <PreviewRow label="Limit" value={`${usageLimit} per customer`} />
          <PreviewRow label="Overall limit" value={overallUsageLimit} />
        </Panel>
      </aside>
    </section>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return <div className="preview-row"><span>{label}</span><strong>{value}</strong></div>
}


