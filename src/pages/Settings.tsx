import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AppIcon, type AppIconName } from '../components/ui/AppIcon'
import { Panel } from '../components/ui/Panel'
import { Toast } from '../components/ui/Toast'
import { ToggleSwitch } from '../components/ui/ToggleSwitch'

type SettingsTab = 'store' | 'preferences' | 'account'
type SettingsDropdownId = 'language' | 'dateFormat' | 'currency' | 'industry'

const preferenceDropdowns = {
  language: ['English (US)', 'English (IN)', 'Tamil', 'Hindi'],
  dateFormat: ['DD/MM/YYYY - 12h', 'DD/MM/YYYY - 24h', 'MM/DD/YYYY - 12h'],
  currency: ['INR (Rs)', 'USD ($)', 'EUR (€)'],
  industry: ['Retail - General', 'Grocery', 'Pharmacy', 'Bakery'],
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('store')
  const [savedAt, setSavedAt] = useState('')

  useEffect(() => {
    function handleSave() {
      setSavedAt('Changes saved')
      window.setTimeout(() => setSavedAt(''), 1600)
    }

    window.addEventListener('settings:save', handleSave)
    return () => window.removeEventListener('settings:save', handleSave)
  }, [])

  return (
    <section className="settings-page">
      <aside className="settings-side-nav">
        <SettingsTabButton activeTab={activeTab} id="store" icon="store" title="Store" subtitle="Profile · Payments · Team" onChange={setActiveTab} />
        <SettingsTabButton activeTab={activeTab} id="preferences" icon="sliders" title="Preferences" subtitle="App · Notifications · Invoice" onChange={setActiveTab} />
        <SettingsTabButton activeTab={activeTab} id="account" icon="user" title="Account" subtitle="Security · Export · Help · Legal" onChange={setActiveTab} />
      </aside>
      <div className="settings-content">
        {savedAt && <div className="settings-save-toast"><Toast message={savedAt} tone="success" /></div>}
        {activeTab === 'store' && <StoreSettings />}
        {activeTab === 'preferences' && <PreferencesSettings />}
        {activeTab === 'account' && <AccountSettings />}
      </div>
    </section>
  )
}

function SettingsTabButton({
  activeTab,
  id,
  icon,
  title,
  subtitle,
  onChange,
}: {
  activeTab: SettingsTab
  id: SettingsTab
  icon: string
  title: string
  subtitle: string
  onChange: (tab: SettingsTab) => void
}) {
  return (
    <button className={activeTab === id ? 'settings-tab active' : 'settings-tab'} type="button" onClick={() => onChange(id)}>
      <SettingsIcon icon={icon} />
      <span><strong>{title}</strong><small>{subtitle}</small></span>
    </button>
  )
}

function StoreSettings() {
  const [payments, setPayments] = useState({ upi: true, card: true, cash: true })
  const [team, setTeam] = useState([
    { id: 1, initials: 'ON', name: 'Owner_name (You)', email: 'owner_name@store.in', role: 'Owner', tone: 'violet' },
    { id: 2, initials: 'E1', name: 'Employee1', email: 'employee1@gmail.com', role: 'Staff', tone: 'green' },
    { id: 3, initials: 'E2', name: 'Employee2', email: 'employee2@gmail.com', role: 'Staff', tone: 'amber' },
  ])
  const [photoName, setPhotoName] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function addMember() {
    const id = Date.now()
    setTeam((currentTeam) => [...currentTeam, { id, initials: `E${currentTeam.length}`, name: `Employee${currentTeam.length}`, email: `employee${currentTeam.length}@gmail.com`, role: 'Staff', tone: 'blue' }])
  }

  return (
    <>
      <SettingsHeading title="Store" subtitle="Manage your store profile, payment methods, and team" />
      <Panel className="settings-panel">
        <SettingsPanelHeader title="Store profile" subtitle="Your store's public information" action={<SaveButton label="Save" />} />
        <div className="store-profile-upload">
          <div className="store-photo">{photoPreview ? <img src={photoPreview} alt="Store" /> : <SettingsIcon icon="store" />}</div>
          <div>
            <input
              ref={fileInputRef}
              className="file-input"
              type="file"
              accept="image/png,image/jpeg"
              onChange={(event) => {
                const file = event.target.files?.[0]
                setPhotoName(file?.name || '')
                setPhotoPreview(file ? URL.createObjectURL(file) : '')
              }}
            />
            <button className="action-button primary" type="button" onClick={() => fileInputRef.current?.click()}>Upload Photo</button>
            <button className="action-button" type="button" onClick={() => {
              setPhotoName('')
              setPhotoPreview('')
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}>Remove</button>
            <small>{photoName || 'JPG or PNG · Max 2MB · Appears on profile & directory'}</small>
          </div>
        </div>
        <div className="settings-form-grid">
          <label>Store name<input placeholder="Store name" /></label>
          <label>Contact number<input placeholder="Contact number" /></label>
          <label className="full">Store description<input placeholder="Enter description" /></label>
          <label>Store address<input placeholder="Store address" /></label>
          <label>Operating hours<input placeholder="Operating hours" /></label>
          <label>Hotline contact<input placeholder="Hotline contact" /></label>
          <label>Store coordinates (optional)<input placeholder="Store coordinates" /></label>
        </div>
      </Panel>
      <Panel className="settings-panel">
        <SettingsPanelHeader title="Purchase payment methods" subtitle="Toggle which payment modes your store accepts" />
        <SettingsToggleRow title="UPI" subtitle="Google Pay, PhonePe, BHIM, etc.." checked={payments.upi} onChange={(checked) => setPayments((value) => ({ ...value, upi: checked }))} size="sm" />
        <SettingsToggleRow title="Debit / Credit card" subtitle="Visa, Mastercard, Rupay" checked={payments.card} onChange={(checked) => setPayments((value) => ({ ...value, card: checked }))} size="sm" />
        <SettingsToggleRow title="Cash" subtitle="Physical currency payments" checked={payments.cash} onChange={(checked) => setPayments((value) => ({ ...value, cash: checked }))} size="sm" />
      </Panel>
      <Panel className="settings-panel">
        <SettingsPanelHeader title="Team members" subtitle="Manage who has access to this store" action={<button className="action-button primary" type="button" onClick={addMember}>Add member</button>} />
        <div className="team-list">
          {team.map((member) => (
            <div className="team-row" key={member.id}>
              <span className={`team-avatar ${member.tone}`}>{member.initials}</span>
              <div><strong>{member.name}</strong><small>{member.email}</small></div>
              <em>{member.role}</em>
              {member.role !== 'Owner' && <button type="button" onClick={() => setTeam((currentTeam) => currentTeam.filter((item) => item.id !== member.id))}>Remove</button>}
            </div>
          ))}
        </div>
        <div className="upgrade-box"><span>Team size depends on your subscription plan</span><button className="action-button" type="button" onClick={() => window.dispatchEvent(new Event('settings:save'))}>Upgrade Plan</button></div>
      </Panel>
    </>
  )
}

function PreferencesSettings() {
  const [openDropdown, setOpenDropdown] = useState<SettingsDropdownId | null>(null)
  const [language, setLanguage] = useState('English (US)')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY - 12h')
  const [currency, setCurrency] = useState('INR (Rs)')
  const [industry, setIndustry] = useState('Retail - General')
  const [notifications, setNotifications] = useState([true, true, true, true, true])
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function closeDropdown(event: PointerEvent) {
      if (!(event.target as Element).closest('.settings-select')) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('pointerdown', closeDropdown)
    return () => document.removeEventListener('pointerdown', closeDropdown)
  }, [])

  return (
    <>
      <SettingsHeading title="Preferences" subtitle="App behaviour, notifications, and invoice defaults" />
      <Panel className="settings-panel">
        <SettingsPanelHeader title="App preferences" subtitle="Customise your ShopLocal experience" action={<SaveButton label="Save" />} />
        <div className="settings-form-grid three" ref={dropdownRef}>
          <label>Language<SettingsDropdown id="language" openDropdown={openDropdown} options={preferenceDropdowns.language} value={language} onChange={setLanguage} onOpenChange={setOpenDropdown} /></label>
          <label>Date & time format<SettingsDropdown id="dateFormat" openDropdown={openDropdown} options={preferenceDropdowns.dateFormat} value={dateFormat} onChange={setDateFormat} onOpenChange={setOpenDropdown} /></label>
          <label>Default currency<SettingsDropdown id="currency" openDropdown={openDropdown} options={preferenceDropdowns.currency} value={currency} onChange={setCurrency} onOpenChange={setOpenDropdown} /></label>
        </div>
      </Panel>
      <Panel className="settings-panel">
        <SettingsPanelHeader title="Notification preferences" subtitle="Choose what alerts you receive" action={<SaveButton label="Save" />} />
        {['New order alerts', 'Low stock alerts', 'Out of stock alerts', 'Payment confirmation', 'Offer expiry reminders'].map((title, index) => (
          <SettingsToggleRow key={title} title={title} subtitle={notificationSubtitles[index]} checked={notifications[index]} onChange={(checked) => setNotifications((items) => items.map((item, itemIndex) => itemIndex === index ? checked : item))} />
        ))}
      </Panel>
      <Panel className="settings-panel">
        <SettingsPanelHeader title="Invoice settings" subtitle="Invoice settings" action={<SaveButton label="Save" />} />
        <div className="settings-form-grid">
          <label>Invoice prefix<input defaultValue="INV-2026" /></label>
          <label>Industry category<SettingsDropdown id="industry" openDropdown={openDropdown} options={preferenceDropdowns.industry} value={industry} onChange={setIndustry} onOpenChange={setOpenDropdown} /></label>
          <label>Tax Percentage - SGST<input defaultValue="2.5%" /></label>
          <label>Tax Percentage - CGST<input defaultValue="2.5%" /></label>
          <label className="full">Registered address<input defaultValue="No. 12, Gandhi Bazaar Road, Near Central Bus Stand, Coimbatore - 641001, Tamil Nadu, India" /></label>
        </div>
      </Panel>
    </>
  )
}

function AccountSettings() {
  const [twoFactor, setTwoFactor] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState('Premium')
  return (
    <>
      <SettingsHeading title="Account" subtitle="Subscriptions, Security, data, support, and compliance" />
      <Panel className="settings-panel">
        <SettingsPanelHeader title="Account & security" subtitle="Manage your login credentials and active sessions" />
        <SettingsActionRow title="Change password" subtitle="Last changed 3 months ago" action={<SaveButton className="action-button" label="Change" />} />
        <SettingsToggleRow title="Two-factor authentication" subtitle="Add an extra layer of security to your account" checked={twoFactor} onChange={setTwoFactor} />
        <SettingsActionRow title="Login activity" subtitle="View recent sign-in history" action={<SaveButton className="action-button" label="View" />} />
        <SettingsActionRow title="Connected devices" subtitle="1 device currently active" action={<SaveButton className="action-button" label="Manage" />} />
        <SettingsActionRow title="Delete account" subtitle="Permanently delete your ShopLocal account and all data" action={<SaveButton className="action-button danger" label="Delete" />} />
      </Panel>
      <Panel className="settings-panel">
        <SettingsPanelHeader title="Subscription Plans" subtitle="Manage your work better with premium plans" />
        <div className="plan-grid">
          <PlanCard title="Free" price="$0" action="Sign Up" selected={selectedPlan === 'Free'} onSelect={setSelectedPlan} />
          <PlanCard title="Premium" price="$4.99" action="Get Premium" featured selected={selectedPlan === 'Premium'} onSelect={setSelectedPlan} />
          <PlanCard title="Ultra" price="$12.99" action="Get Ultra" selected={selectedPlan === 'Ultra'} onSelect={setSelectedPlan} />
        </div>
      </Panel>
      <Panel className="settings-panel">
        <SettingsPanelHeader title="Data export" subtitle="Download your store data as CSV or PDF" />
        {['Orders', 'Invoices', 'Expenses', 'Inventory'].map((item) => <SettingsActionRow key={item} title={item} subtitle={item === 'Inventory' ? 'Full product catalogue' : item === 'Orders' ? 'All order records' : item === 'Expenses' ? 'Expense tracker log' : 'Generated invoice history'} action={<><SaveButton className="action-button" label="CSV" /><SaveButton className="action-button" label="PDF" /></>} />)}
      </Panel>
      <Panel className="settings-panel">
        <SettingsPanelHeader title="Help, support & legal compliance" subtitle="Get help, report issues, or review compliance documents" />
        {['FAQ', 'Contact support', 'Quick chat', 'Report an issue', 'Legal & compliance', 'Terms & conditions', 'Privacy policy'].map((item) => <SettingsActionRow key={item} title={item} subtitle={supportSubtitles[item]} action={<button className="settings-arrow" type="button" onClick={() => window.dispatchEvent(new Event('settings:save'))}><SettingsIcon icon="chevron" /></button>} />)}
      </Panel>
    </>
  )
}

const notificationSubtitles = ['Notify when a new order is placed', 'Notify when stock falls below threshold', 'Notify when an item reaches zero', 'Notify when a payment is received', 'Notify 24h before an offer expires']
const supportSubtitles: Record<string, string> = {
  FAQ: 'Browse common questions',
  'Contact support': 'support@shoplocal.in',
  'Quick chat': 'Chat with our support team',
  'Report an issue': 'Let us know about a bug or problem',
  'Legal & compliance': 'Business info, GSTIN, platform agreements',
  'Terms & conditions': 'Read our terms of service',
  'Privacy policy': 'How we handle your data',
}

function SettingsDropdown({ id, openDropdown, options, value, onChange, onOpenChange }: { id: SettingsDropdownId; openDropdown: SettingsDropdownId | null; options: string[]; value: string; onChange: (value: string) => void; onOpenChange: (id: SettingsDropdownId | null) => void }) {
  const isOpen = openDropdown === id
  return (
    <div className={isOpen ? 'filter-control settings-select open' : 'filter-control settings-select'}>
      <button className="filter-trigger" type="button" aria-expanded={isOpen} onClick={() => onOpenChange(isOpen ? null : id)}>
        <strong>{value}</strong><SettingsIcon icon="chevron" />
      </button>
      {isOpen && <div className="filter-menu">{options.map((option) => <button className={option === value ? 'filter-option selected' : 'filter-option'} key={option} type="button" onClick={() => { onChange(option); onOpenChange(null) }}>{option}</button>)}</div>}
    </div>
  )
}

function SettingsHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="settings-heading"><h2>{title}</h2><p>{subtitle}</p></div>
}

function SettingsPanelHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return <div className="settings-panel-header"><div><h3>{title}</h3><p>{subtitle}</p></div>{action}</div>
}

function SettingsToggleRow({ title, subtitle, checked, onChange }: { title: string; subtitle: string; checked: boolean; onChange: (checked: boolean) => void; size?: 'sm' | 'md' }) {
  return <div className="settings-row"><div><strong>{title}</strong><small>{subtitle}</small></div><ToggleSwitch checked={checked} label={title} onChange={onChange} /></div>
}

function SettingsActionRow({ title, subtitle, action }: { title: string; subtitle: string; action: ReactNode }) {
  return <div className="settings-row"><div><strong>{title}</strong><small>{subtitle}</small></div><div className="settings-row-actions">{action}</div></div>
}

function PlanCard({ title, price, action, featured = false, selected, onSelect }: { title: string; price: string; action: string; featured?: boolean; selected: boolean; onSelect: (plan: string) => void }) {
  return <div className={`${featured ? 'plan-card featured' : 'plan-card'}${selected ? ' selected' : ''}`}><h3>{title}</h3><p>Lorem ipsum dolor sit</p><strong>{price}</strong><button type="button" onClick={() => { onSelect(title); window.dispatchEvent(new Event('settings:save')) }}>{selected ? 'Current plan' : action}</button><small>Includes everything in {featured ? 'Free' : title === 'Ultra' ? 'Premium' : 'Starter'}</small><span>dolor sit amet</span><span>consectetur</span><span>adipiscing</span></div>
}

function SaveButton({ className = 'action-button primary', label }: { className?: string; label: string }) {
  return <button className={className} type="button" onClick={() => window.dispatchEvent(new Event('settings:save'))}>{label}</button>
}

function SettingsIcon({ icon }: { icon: string }) {
  const iconMap: Record<string, AppIconName> = {
    store: 'store',
    sliders: 'sliders',
    user: 'user',
    chevron: 'chevron',
  }

  return <AppIcon name={iconMap[icon] || 'settings'} />
}
