import { useEffect, useState } from 'react'
import { AppIcon } from '../components/ui/AppIcon'
import { showToast } from '../utils/toast'

type ShopStatus = 'Open' | 'Closed'

type Shop = {
  id: number
  name: string
  address: string
  contact: string
  hours: string
  mapLink: string
  revenue: number
  orders: number
  status: ShopStatus
  tone: 'blue' | 'violet' | 'rose'
}

const initialShops: Shop[] = [
  { id: 1, name: 'Store_name - location', address: '14, Gandhi Street, Tiruppur, TN 641601', contact: '+91 98765 43210', hours: '9 AM - 9 PM', mapLink: '', revenue: 18420, orders: 94, status: 'Open', tone: 'blue' },
  { id: 2, name: 'Store_name - location', address: '14, Gandhi Street, Coimbatore, TN 641002', contact: '+91 98765 43211', hours: '10 AM - 8 PM', mapLink: '', revenue: 12580, orders: 61, status: 'Open', tone: 'violet' },
  { id: 3, name: 'Store_name - location', address: '14, Gandhi Street, Chennai, TN 123456', contact: '+91 98765 43212', hours: 'Closed today', mapLink: '', revenue: 0, orders: 0, status: 'Closed', tone: 'rose' },
]

const currencyFormatter = new Intl.NumberFormat('en-IN')

export function ManageShops() {
  const [shops, setShops] = useState(initialShops)
  const [activeShopId, setActiveShopId] = useState(initialShops[0].id)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const activeShop = shops.find((shop) => shop.id === activeShopId) || shops[0]

  useEffect(() => {
    function openModal() {
      setEditingShop(null)
      setIsModalOpen(true)
    }

    window.addEventListener('shops:add', openModal)
    return () => window.removeEventListener('shops:add', openModal)
  }, [])

  function saveShop(shop: Shop) {
    setShops((currentShops) => {
      const exists = currentShops.some((item) => item.id === shop.id)
      return exists ? currentShops.map((item) => (item.id === shop.id ? shop : item)) : [...currentShops, shop]
    })
    setIsModalOpen(false)
    setEditingShop(null)
    showToast(editingShop ? 'Shop details updated.' : 'New shop added successfully.', 'success')
  }

  function openSettings(shop: Shop) {
    setEditingShop(shop)
    setIsModalOpen(true)
  }

  return (
    <section className="shops-page">
      <div className="shops-heading">
        <h2>Your shops</h2>
        <p>Switch between shops or add a new location to your account</p>
      </div>

      <div className="active-shop-banner">
        <ShopIcon tone="blue" />
        <div>
          <span>Currently active</span>
          <strong>{activeShop.name}</strong>
          <small>{activeShop.address}</small>
        </div>
        <div className="active-shop-stats">
          <div><strong>Rs{currencyFormatter.format(activeShop.revenue)}</strong><span>Today's revenue</span></div>
          <div><strong>{activeShop.orders}</strong><span>Today's orders</span></div>
          <em><i></i>{activeShop.status}</em>
        </div>
      </div>

      <h3 className="shops-section-title">All shops ({shops.length})</h3>
      <div className="shops-grid">
        {shops.map((shop) => (
          <article className="shop-card" key={shop.id}>
            {shop.id === activeShopId && <span className="active-check">✓</span>}
            <div className="shop-card-top">
              <ShopIcon tone={shop.tone} />
              <span className={shop.status === 'Open' ? 'shop-status open' : 'shop-status'}><i></i>{shop.status}</span>
            </div>
            <h3>{shop.name}</h3>
            <p>{shop.address}</p>
            <div className="shop-mini-stats">
              <div><span>Today's revenue</span><strong>Rs{currencyFormatter.format(shop.revenue)}</strong></div>
              <div><span>Today's orders</span><strong>{shop.orders}</strong></div>
            </div>
            <div className="shop-actions">
              {shop.id === activeShopId ? (
                <button className="active-shop-button" type="button"><CheckIcon />Active shop</button>
              ) : (
                <button className="switch-shop-button" type="button" onClick={() => {
                  setActiveShopId(shop.id)
                  showToast(`${shop.name} is now active.`, 'success')
                }}><SwitchIcon />Switch</button>
              )}
              <button className="shop-settings-button" type="button" onClick={() => openSettings(shop)}><GearIcon />Settings</button>
            </div>
          </article>
        ))}
        <button className="add-shop-card" type="button" onClick={() => {
          setEditingShop(null)
          setIsModalOpen(true)
          showToast('New shop form opened.', 'info')
        }}>
          <span>+</span>
          <strong>Add a new shop</strong>
          <small>Register a new store location under your account</small>
        </button>
      </div>

      <div className="shops-plan-note">
        <InfoIcon />
        You are on the Pro plan (up to 5 shops allowed). You have {Math.max(0, 5 - shops.length)} more slots available. Upgrade to Business for unlimited shops.
      </div>

      {isModalOpen && (
        <ShopModal
          shop={editingShop}
          onClose={() => {
            setIsModalOpen(false)
            setEditingShop(null)
          }}
          onSave={saveShop}
        />
      )}
    </section>
  )
}

function ShopModal({ shop, onClose, onSave }: { shop: Shop | null; onClose: () => void; onSave: (shop: Shop) => void }) {
  const [name, setName] = useState(shop?.name || '')
  const [address, setAddress] = useState(shop?.address || '')
  const [contact, setContact] = useState(shop?.contact || '')
  const [hours, setHours] = useState(shop?.hours || '')
  const [mapLink, setMapLink] = useState(shop?.mapLink || '')

  function submit() {
    if (!name.trim() || !address.trim() || !contact.trim()) {
      showToast('Shop name, address, and contact number are required.', 'error')
      return
    }

    onSave({
      id: shop?.id || Date.now(),
      name: name.trim(),
      address: address.trim(),
      contact,
      hours,
      mapLink,
      revenue: shop?.revenue || 0,
      orders: shop?.orders || 0,
      status: shop?.status || 'Open',
      tone: shop?.tone || 'blue',
    })
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="shop-modal-backdrop" role="presentation" onClick={onClose}>
      <div className="shop-modal" role="dialog" aria-modal="true" aria-labelledby="shop-modal-title" onClick={(event) => event.stopPropagation()}>
        <button className="shop-modal-close" type="button" aria-label="Close modal" onClick={onClose}>x</button>
        <h2 id="shop-modal-title">{shop ? 'Shop settings' : 'Add a new shop'}</h2>
        <p>{shop ? 'Update this store location' : "Fill in your new store's details"}</p>
        <label>Shop name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="shop_name" /></label>
        <label>Store address<input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Full address with pincode" /></label>
        <div className="shop-modal-grid">
          <label>Contact number<input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Contact number" /></label>
          <label>Operating hours<input value={hours} onChange={(event) => setHours(event.target.value)} placeholder="Enter timings" /></label>
        </div>
        <label>Google Maps link (optional)<input value={mapLink} onChange={(event) => setMapLink(event.target.value)} placeholder="Paste link" /></label>
        <div className="shop-modal-actions">
          <button className="action-button" type="button" onClick={onClose}>Cancel</button>
          <button className="action-button primary" type="button" onClick={submit}>{shop ? 'Save Shop' : 'Add Shop'}</button>
        </div>
      </div>
    </div>
  )
}

function ShopIcon({ tone }: { tone: 'blue' | 'violet' | 'rose' }) {
  return <span className={`shop-icon ${tone}`}><AppIcon name="store" /></span>
}

function CheckIcon() {
  return <AppIcon name="check" />
}

function SwitchIcon() {
  return <AppIcon name="refresh" />
}

function GearIcon() {
  return <AppIcon name="settings" />
}

function InfoIcon() {
  return <AppIcon name="file-question" />
}
