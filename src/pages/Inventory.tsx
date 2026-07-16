import { useEffect, useMemo, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { AppIcon } from '../components/ui/AppIcon'
import { FormField } from '../components/ui/FormField'
import { PageActions } from '../components/ui/PageActions'
import { Panel } from '../components/ui/Panel'
import { ToggleSwitch } from '../components/ui/ToggleSwitch'
import heroImage from '../assets/hero.png'

type Product = {
  name: string
  id: string
  category: string
  price: string
  stock: number
  rating: number
  brand?: string
  model?: string
  supplier?: string
  expiration?: string
  description?: string
}

type UploadedFile = {
  id: string
  name: string
  previewUrl: string | null
  type: string
}

const initialProducts: Product[] = [
  { name: 'Tata Salt 1kg', id: 'PRD-0041', category: 'Grocery', price: 'Rs.28', stock: 48, rating: 4 },
  { name: 'Dairy Milk 60g', id: 'PRD-0045', category: 'Chocolates', price: 'Rs.50', stock: 120, rating: 4 },
  { name: 'Amul Butter 500g', id: 'PRD-0042', category: 'Dairy', price: 'Rs.150', stock: 30, rating: 4 },
  { name: 'Maggi Noodles 100g', id: 'PRD-0043', category: 'Snacks', price: 'Rs.40', stock: 100, rating: 4 },
  { name: 'Tata Urad Dhal 50g', id: 'PRD-0061', category: 'Grocery', price: 'Rs.35', stock: 48, rating: 4 },
  { name: 'Brooke Bond Tea 250g', id: 'PRD-0044', category: 'Grocery', price: 'Rs.95', stock: 75, rating: 4 },
  { name: 'Tata Salt 1kg', id: 'PRD-0075', category: 'Grocery', price: 'Rs.20', stock: 150, rating: 5 },
  { name: 'Amul Butter 200g', id: 'PRD-0110', category: 'Dairy', price: 'Rs.120', stock: 60, rating: 3 },
  { name: 'Maggi Masala 20g', id: 'PRD-0022', category: 'Grocery', price: 'Rs.15', stock: 200, rating: 4 },
  { name: 'Dabur Honey 500g', id: 'PRD-0099', category: 'Grocery', price: 'Rs.250', stock: 40, rating: 5 },
]

type InventoryProps = {
  onViewChange: (view: 'list' | 'add' | 'profile') => void
  searchQuery: string
  view: 'list' | 'add' | 'profile'
}

type DropdownId = 'category' | 'stock' | 'sort'

const productsPerPage = 5

const inventoryPanels = [
  {
    title: 'Low Stock Items',
    action: 'See all (26)',
    tone: 'orange',
    items: [
      { name: 'Surf Excel 1kg', id: 'PRD-0081', value: '8 Left' },
      { name: 'Aashirvaad Atta 5kg', id: 'PRD-0121', value: '12 Left' },
      { name: 'Colgate Toothpaste', id: 'PRD-0082', value: '12 Left' },
      { name: 'Life bouy Soap', id: 'PRD-0084', value: '13 Left' },
    ],
  },
  {
    title: 'Out of Stock Items',
    action: 'See all (11)',
    tone: 'red',
    items: [
      { name: 'Dettol Soap 75g', id: 'PRD-0012', value: 'High Demand' },
      { name: 'Lifebuoy Handwash 200ml', id: 'PRD-0078', value: 'Mid Demand' },
      { name: 'Dettol Soap 75g', id: 'PRD-0012', value: 'Mid Demand' },
      { name: 'Colgate Toothpaste 100g', id: 'PRD-0034', value: 'Mid Demand' },
    ],
  },
  {
    title: 'High Demand Items',
    action: 'See all (5)',
    tone: 'green',
    items: [
      { name: 'Amul Milk 500ml', id: 'PRD-0042', value: '+96.7%' },
      { name: 'Farm Fresh Butter 200g', id: 'PRD-0091', value: '+88.9%' },
      { name: 'Toilet Paper', id: 'PRD-0273', value: '+86.7%' },
      { name: 'Dairy Delight Yogurt 250g', id: 'PRD-0078', value: '+75.2%' },
    ],
  },
  {
    title: 'Expiring items',
    action: 'See all (8)',
    tone: 'red',
    items: [
      { name: 'Amul Butter 500g', id: 'PRD-0112', value: '4 Hrs' },
      { name: 'Nestle Curd 400g', id: 'PRD-0142', value: '4 Hrs' },
      { name: 'Britannia Cheese Slices 200g', id: 'PRD-0234', value: '6 Hrs' },
      { name: 'Dabur Honey 1kg', id: 'PRD-0456', value: '12 Hrs' },
    ],
  },
]

function ProductThumb() {
  return (
    <span className="product-thumb" aria-hidden="true">
      <span>TATA</span>
    </span>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="rating-stars" aria-label={`${rating} stars`}>
      {'\u2605'.repeat(5)} <b>{rating}</b>
    </span>
  )
}

function TrashIcon() {
  return <AppIcon name="trash" />
}

function ChevronIcon() {
  return <AppIcon name="chevron" />
}

function ImageIcon() {
  return <AppIcon name="image" />
}

function UploadIcon() {
  return <AppIcon name="upload" />
}

function DummyProductImage({ compact = false, name }: { compact?: boolean; name: string }) {
  return (
    <div className={compact ? 'dummy-product-image compact' : 'dummy-product-image'}>
      <img src={heroImage} alt={name} />
    </div>
  )
}

type FilterDropdownProps = {
  id: DropdownId
  label?: string
  options: string[]
  openDropdown: DropdownId | null
  value: string
  onChange: (value: string) => void
  onOpenChange: (id: DropdownId | null) => void
}

function FilterDropdown({
  id,
  label,
  options,
  openDropdown,
  value,
  onChange,
  onOpenChange,
}: FilterDropdownProps) {
  const isOpen = openDropdown === id

  return (
    <div
      className={`${label ? 'filter-control sort-control' : 'filter-control'}${isOpen ? ' open' : ''}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onOpenChange(null)
        }
      }}
    >
      <button
        className="filter-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => onOpenChange(isOpen ? null : id)}
      >
        {label && <span>{label}</span>}
        <strong>{value}</strong>
        <ChevronIcon />
      </button>

      {isOpen && (
        <div className="filter-menu" role="listbox" aria-label={label || value}>
          {options.map((option) => (
            <button
              className={option === value ? 'filter-option selected' : 'filter-option'}
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(option)
                onOpenChange(null)
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Inventory({ onViewChange, searchQuery, view }: InventoryProps) {
  const [products, setProducts] = useState(initialProducts)
  const [profileProductId, setProfileProductId] = useState(initialProducts[0].id)
  const [localSearchQuery, setLocalSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [stockFilter, setStockFilter] = useState('All Stock levels')
  const [sortMode, setSortMode] = useState('Name A -Z')
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [inventoryNotice, setInventoryNotice] = useState<string | null>(null)
  const categories = useMemo(
    () => ['All Categories', ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  )
  const stockOptions = ['All Stock levels', 'Low Stock', 'In Stock', 'High Stock', 'Out of Stock']
  const sortOptions = ['Name A -Z', 'Name Z -A', 'Stock Low -High', 'Stock High -Low']
  const filteredProducts = useMemo(() => {
    const normalizedSearch = `${searchQuery} ${localSearchQuery}`.trim().toLowerCase()

    return products
      .filter((product) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.id.toLowerCase().includes(normalizedSearch) ||
          product.category.toLowerCase().includes(normalizedSearch)
        const matchesCategory = categoryFilter === 'All Categories' || product.category === categoryFilter
        const matchesStock =
          stockFilter === 'All Stock levels' ||
          (stockFilter === 'Low Stock' && product.stock <= 50) ||
          (stockFilter === 'In Stock' && product.stock > 50) ||
          (stockFilter === 'High Stock' && product.stock >= 100) ||
          (stockFilter === 'Out of Stock' && product.stock === 0)

        return matchesSearch && matchesCategory && matchesStock
      })
      .sort((firstProduct, secondProduct) => {
        if (sortMode === 'Name Z -A') {
          return secondProduct.name.localeCompare(firstProduct.name)
        }

        if (sortMode === 'Stock Low -High') {
          return firstProduct.stock - secondProduct.stock
        }

        if (sortMode === 'Stock High -Low') {
          return secondProduct.stock - firstProduct.stock
        }

        return firstProduct.name.localeCompare(secondProduct.name)
      })
  }, [categoryFilter, localSearchQuery, products, searchQuery, sortMode, stockFilter])
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const visibleProducts = filteredProducts.slice(
    (safeCurrentPage - 1) * productsPerPage,
    safeCurrentPage * productsPerPage,
  )
  const allVisibleProductsSelected =
    visibleProducts.length > 0 && visibleProducts.every((product) => selectedProductIds.includes(product.id))

  function updateFilter(action: () => void) {
    action()
    setCurrentPage(1)
    setSelectedProductIds([])
  }

  function applyAlertPanel(panelTitle: string) {
    if (panelTitle === 'Low Stock Items') {
      updateFilter(() => setStockFilter('Low Stock'))
      setInventoryNotice('Showing low stock products from your product list.')
      return
    }

    if (panelTitle === 'Out of Stock Items') {
      updateFilter(() => setStockFilter('Out of Stock'))
      setInventoryNotice('Showing products with zero stock.')
      return
    }

    if (panelTitle === 'High Demand Items') {
      updateFilter(() => setSortMode('Stock High -Low'))
      setInventoryNotice('Sorted products by highest stock movement signal.')
      return
    }

    setInventoryNotice('Expiry tracking is selected. Add expiry dates to products to filter this list.')
  }

  function updateStock(productId: string, change: number) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId ? { ...product, stock: Math.max(0, product.stock + change) } : product,
      ),
    )
  }

  function deleteProduct(productId: string) {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId))
    setSelectedProductIds((currentIds) => currentIds.filter((id) => id !== productId))
  }

  function handleAddProduct(product: Product) {
    setProducts((currentProducts) => [product, ...currentProducts])
    setInventoryNotice(`${product.name} was added to inventory.`)
    onViewChange('list')
  }

  function handleDeleteProfileProduct(productId: string) {
    deleteProduct(productId)
    onViewChange('list')
    setInventoryNotice('Product deleted from inventory.')
  }

  function toggleProductSelection(productId: string) {
    setSelectedProductIds((currentIds) =>
      currentIds.includes(productId)
        ? currentIds.filter((id) => id !== productId)
        : [...currentIds, productId],
    )
  }

  function toggleVisibleSelection() {
    const visibleIds = visibleProducts.map((product) => product.id)

    setSelectedProductIds((currentIds) =>
      allVisibleProductsSelected
        ? currentIds.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...currentIds, ...visibleIds])),
    )
  }

  if (view === 'add') {
    return <AddProductView onCancel={() => onViewChange('list')} onSave={handleAddProduct} />
  }

  if (view === 'profile') {
    const profileProduct = products.find((product) => product.id === profileProductId) || products[0]

    if (!profileProduct) {
      return (
        <section className="inventory-page">
          <div className="inventory-empty">No product is available to preview.</div>
        </section>
      )
    }

    return (
      <ProductProfileView
        product={profileProduct}
        onDelete={() => handleDeleteProfileProduct(profileProduct.id)}
      />
    )
  }

  return (
    <section className="inventory-page">
      <label className="inventory-page-search">
        <AppIcon name="search" />
        <input
          type="search"
          placeholder="Search products by name or ID..."
          value={localSearchQuery}
          onChange={(event) => {
            setLocalSearchQuery(event.target.value)
            setCurrentPage(1)
            setSelectedProductIds([])
          }}
        />
      </label>
      <div className="inventory-filters">
        <FilterDropdown
          id="category"
          options={categories}
          openDropdown={openDropdown}
          value={categoryFilter}
          onChange={(value) => updateFilter(() => setCategoryFilter(value))}
          onOpenChange={setOpenDropdown}
        />
        <FilterDropdown
          id="stock"
          options={stockOptions}
          openDropdown={openDropdown}
          value={stockFilter}
          onChange={(value) => updateFilter(() => setStockFilter(value))}
          onOpenChange={setOpenDropdown}
        />
        <FilterDropdown
          id="sort"
          label="Sort:"
          options={sortOptions}
          openDropdown={openDropdown}
          value={sortMode}
          onChange={(value) => updateFilter(() => setSortMode(value))}
          onOpenChange={setOpenDropdown}
        />
      </div>
      {inventoryNotice && <div className="inventory-notice">{inventoryNotice}</div>}

      <div className="inventory-grid">
        <article className="panel inventory-list-panel">
          <div className="panel-header">
            <h2>Product List</h2>
          </div>

          <div className="inventory-table-scroll">
            <div className="inventory-table">
              <div className="inventory-table-head">
                <span>
                  <input
                    type="checkbox"
                    aria-label="Select all visible products"
                    checked={allVisibleProductsSelected}
                    onChange={toggleVisibleSelection}
                  />
                </span>
                <span></span>
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>Stock Left</span>
                <span>Rating</span>
                <span>Action</span>
              </div>

              {visibleProducts.map((product) => (
                <div
                  className={selectedProductIds.includes(product.id) ? 'inventory-row selected' : 'inventory-row'}
                  key={product.id}
                  onClick={() => {
                    setProfileProductId(product.id)
                    onViewChange('profile')
                  }}
                >
                  <span className="inventory-check">
                    <input
                      type="checkbox"
                      aria-label={`Select ${product.name}`}
                      checked={selectedProductIds.includes(product.id)}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => toggleProductSelection(product.id)}
                    />
                  </span>
                  <ProductThumb />
                  <div className="product-name">
                    <strong>{product.name}</strong>
                    <small>{product.id}</small>
                  </div>
                  <span className="product-category">{product.category}</span>
                  <span className="product-price">{product.price}</span>
                  <div className="stock-stepper">
                    <button
                      type="button"
                      aria-label={`Decrease ${product.name} stock`}
                      disabled={product.stock === 0}
                      onClick={(event) => {
                        event.stopPropagation()
                        updateStock(product.id, -1)
                      }}
                    >
                      -
                    </button>
                    <span>{product.stock}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${product.name} stock`}
                      onClick={(event) => {
                        event.stopPropagation()
                        updateStock(product.id, 1)
                      }}
                    >
                      +
                    </button>
                  </div>
                  <Stars rating={product.rating} />
                  <button
                    className="delete-product"
                    type="button"
                    aria-label={`Delete ${product.name}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      deleteProduct(product.id)
                    }}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
              {visibleProducts.length === 0 && (
                <div className="inventory-empty">
                  No products match your filters.
                </div>
              )}
            </div>
          </div>

          <div className="table-footer">
            <span>
              Showing {visibleProducts.length} of {filteredProducts.length} Items
              {selectedProductIds.length > 0 && ` • ${selectedProductIds.length} selected`}
            </span>
            <div className="pagination" aria-label="Inventory pagination">
              <button
                className={safeCurrentPage === 1 ? 'pagination-prev ghost' : 'pagination-prev'}
                type="button"
                aria-label="Previous"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                <ChevronIcon />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  className={safeCurrentPage === page ? 'active' : ''}
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                aria-label="Next"
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                <ChevronIcon />
              </button>
            </div>
          </div>
        </article>

        <aside className="inventory-side">
          {inventoryPanels.map((panel) => (
            <article className="panel inventory-alert-panel" key={panel.title}>
              <div className="panel-header compact">
                <h2>{panel.title}</h2>
                <button className="text-link small" type="button" onClick={() => applyAlertPanel(panel.title)}>
                  {panel.action}
                </button>
              </div>
              <div className="inventory-alert-list">
                {panel.items.map((item) => (
                  <div className="inventory-alert-row" key={`${panel.title}-${item.id}-${item.name}`}>
                    <div>
                      <strong>{item.name}</strong>
                      <small>{item.id}</small>
                    </div>
                    <span className={panel.tone}>{item.value}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </aside>
      </div>
    </section>
  )
}

type AddProductViewProps = {
  onCancel: () => void
  onSave: (product: Product) => void
}

function AddProductView({ onCancel, onSave }: AddProductViewProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const objectUrlsRef = useRef<string[]>([])
  const [form, setForm] = useState({
    name: '',
    brand: '',
    model: '',
    category: '',
    expiration: '',
    description: '',
    supplier: '',
    price: '',
    stock: '',
    threshold: '',
  })
  const [expirationDate, setExpirationDate] = useState<Date | null>(null)
  const [isAvailable, setIsAvailable] = useState(true)
  const [primaryImage, setPrimaryImage] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  function updateForm(field: keyof typeof form, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  function saveProduct() {
    const nextId = `PRD-${Math.floor(1000 + Math.random() * 9000)}`

    onSave({
      name: form.name || 'New Product',
      id: nextId,
      brand: form.brand || 'Local Brand',
      model: form.model || 'Standard',
      category: form.category || 'Grocery',
      price: `Rs.${form.price || '0'}`,
      stock: Number(form.stock || 0),
      rating: 4,
      supplier: form.supplier || 'Supplier Name',
      expiration: expirationDate ? expirationDate.toLocaleDateString('en-GB') : 'Not set',
      description: form.description || 'No product description added.',
    })
  }

  function addFiles(files: FileList | File[]) {
    const acceptedFiles = Array.from(files)
      .filter((file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) && file.size <= 5 * 1024 * 1024)
      .map((file) => {
        const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null

        if (previewUrl) {
          objectUrlsRef.current.push(previewUrl)
        }

        return { id: `${file.name}-${file.lastModified}-${Date.now()}-${Math.random()}`, name: file.name, previewUrl, type: file.type }
      })

    if (acceptedFiles.length > 0) {
      setUploadedFiles((currentFiles) => [...currentFiles, ...acceptedFiles])
    }
  }

  function deleteUploadedFile(fileId: string) {
    setUploadedFiles((currentFiles) => {
      const deletedFile = currentFiles.find((file) => file.id === fileId)

      if (deletedFile?.previewUrl) {
        URL.revokeObjectURL(deletedFile.previewUrl)
        objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== deletedFile.previewUrl)
      }

      const nextFiles = currentFiles.filter((file) => file.id !== fileId)
      setPrimaryImage((currentPrimaryImage) => Math.min(currentPrimaryImage, Math.max(0, nextFiles.length - 1)))

      return nextFiles
    })
  }

  useEffect(() => {
    window.addEventListener('inventory:save', saveProduct)
    return () => window.removeEventListener('inventory:save', saveProduct)
  })

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  return (
    <section className="inventory-detail-page add-product-page">
      <Panel className="product-form-panel">
        <h2>Product Entry Form</h2>
        <div className="product-form-grid">
          <FormField className="full" label="Product Name">
            <input placeholder="e.g. Tata Salt" value={form.name} onChange={(event) => updateForm('name', event.target.value)} />
          </FormField>
          <FormField label="Product Brand">
            <input placeholder="e.g. Tata" value={form.brand} onChange={(event) => updateForm('brand', event.target.value)} />
          </FormField>
          <FormField label="Product Model">
            <input placeholder="e.g. Iodised" value={form.model} onChange={(event) => updateForm('model', event.target.value)} />
          </FormField>
          <FormField label="Category">
            <select value={form.category} onChange={(event) => updateForm('category', event.target.value)}>
              <option value="" disabled>Select Category</option>
              <option>Grocery</option>
              <option>Dairy</option>
              <option>Snacks</option>
              <option>Chocolates</option>
            </select>
          </FormField>
          <FormField label="Expiration (If any)">
            <DatePicker
              calendarClassName="app-date-picker-calendar"
              className="date-picker-input"
              dateFormat="dd-MM-yyyy"
              minDate={new Date()}
              onChange={(date: Date | null) => {
                setExpirationDate(date)
                updateForm('expiration', date ? date.toLocaleDateString('en-GB') : '')
              }}
              placeholderText="dd-mm-yyyy"
              selected={expirationDate}
              showPopperArrow={false}
            />
          </FormField>
          <FormField className="full" label="Description">
            <textarea placeholder="Short Product description" rows={3} value={form.description} onChange={(event) => updateForm('description', event.target.value)}></textarea>
          </FormField>
          <FormField className="full" label="Supplier Name">
            <input placeholder="Supplier Name" value={form.supplier} onChange={(event) => updateForm('supplier', event.target.value)} />
          </FormField>
          <FormField label="Selling price (Rs)">
            <input type="number" placeholder="0.0" value={form.price} onChange={(event) => updateForm('price', event.target.value)} />
          </FormField>
          <FormField label="Stock quantity">
            <input type="number" placeholder="0" value={form.stock} onChange={(event) => updateForm('stock', event.target.value)} />
          </FormField>
          <FormField className="full" label="Low-stock alert threshold" help="Get notified when stock falls below this number">
            <input type="number" placeholder="e.g. 10" value={form.threshold} onChange={(event) => updateForm('threshold', event.target.value)} />
          </FormField>
        </div>

        <div className="availability-row">
          <div>
            <strong>Stock availability</strong>
            <span>Show this product as available for sale</span>
          </div>
          <ToggleSwitch checked={isAvailable} label="Stock availability" onChange={setIsAvailable} />
        </div>
      </Panel>

      <Panel className="image-upload-panel">
        <h2>Images</h2>
        <div
          className={isDragging ? 'upload-zone dragging' : 'upload-zone'}
          onDragEnter={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            event.preventDefault()
            setIsDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setIsDragging(false)
            addFiles(event.dataTransfer.files)
          }}
        >
          <UploadIcon />
          <p>
            Drag & drop to upload multiple images<br />or{' '}
            <button type="button" onClick={() => fileInputRef.current?.click()}>browse files</button>
          </p>
          <small>PDF, JPG, PNG • Max 5MB per file • Upload as many as needed</small>
          <input
            ref={fileInputRef}
            className="file-input"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={(event) => {
              if (event.target.files) {
                addFiles(event.target.files)
                event.target.value = ''
              }
            }}
          />
        </div>
        <div className="image-slot-grid">
          {uploadedFiles.map((file, slot) => (
            <div
              className={slot === primaryImage ? 'image-slot active' : 'image-slot'}
              key={file.id}
              role="button"
              tabIndex={0}
              onClick={() => setPrimaryImage(slot)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setPrimaryImage(slot)
                }
              }}
            >
              {file.previewUrl ? (
                <img
                  className="image-preview"
                  src={file.previewUrl}
                  alt={file.name}
                />
              ) : (
                <ImageIcon />
              )}
              <strong>{file.name}</strong>
              {slot === primaryImage && <span>Primary</span>}
              <button
                className="image-delete"
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={(event) => {
                  event.stopPropagation()
                  deleteUploadedFile(file.id)
                }}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
          <button className="image-slot add-more" type="button" onClick={() => fileInputRef.current?.click()}>
            <UploadIcon />
            <small>Add more</small>
          </button>
        </div>
        <p className="image-help">Drag images to reorder - first image is set as primary</p>
      </Panel>

      <PageActions onCancel={onCancel} onSave={saveProduct} />
    </section>
  )
}

type ProductProfileViewProps = {
  onDelete: () => void
  product: Product
}

function ProductProfileView({ onDelete, product }: ProductProfileViewProps) {
  const [threshold, setThreshold] = useState('5')
  const [isVisible, setIsVisible] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <section className="inventory-detail-page product-profile-page">
      <aside className="profile-left-column">
        <Panel className="image-gallery-panel">
          <div className="main-product-image">
            <DummyProductImage name={product.name} />
          </div>
          <div className="thumb-row">
            {[0, 1, 2, 3].map((thumb) => (
              <button
                className={thumb === selectedImage ? 'active' : ''}
                key={thumb}
                type="button"
              onClick={() => setSelectedImage(thumb)}
            >
                <DummyProductImage name={product.name} compact />
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="product-details-panel">
          <h2>Product Details</h2>
          {[
            ['Product ID', product.id],
            ['Brand', product.brand || product.name.split(' ')[0]],
            ['Model', product.model || product.name],
            ['Category', product.category],
            ['Supplier', product.supplier || 'ITC Foods ltd'],
            ['Expiration', product.expiration || '12 Aug, 2026'],
          ].map(([label, value]) => (
            <div className="detail-pair" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </Panel>

        <Panel className="compact-setting-panel">
          <div>
            <strong>Stock Threshold</strong>
            <span>Set low stock threshold for notification</span>
          </div>
          <input value={threshold} onChange={(event) => setThreshold(event.target.value)} />
        </Panel>
        <Panel className="compact-setting-panel">
          <div>
            <strong>Visibility Status</strong>
            <span>Show this product as available for sale</span>
          </div>
          <ToggleSwitch checked={isVisible} label="Visibility status" onChange={setIsVisible} />
        </Panel>
        <button className="delete-profile-button" type="button" onClick={onDelete}>Delete Product ? <TrashIcon /></button>
      </aside>

      <div className="profile-main-column">
        <Panel className="profile-summary-panel">
          <div>
            <h2>{product.name}</h2>
            <small>{product.id}&nbsp;&nbsp; Added 14 May 2026</small>
            <div className="profile-tags">
              <span>{product.category}</span>
              <span>{product.stock > 80 ? 'High Demand' : product.stock <= 50 ? 'Low Stock' : 'In Stock'}</span>
            </div>
          </div>
          <div className="profile-price">
            <strong>{product.price}</strong>
            <span>{product.stock} in Stock</span>
          </div>
        </Panel>

        <Panel className="profile-section">
          <h2>Description</h2>
          <p>{product.description || 'Premium product with reliable local supply and strong customer demand.'}</p>
        </Panel>

        <Panel className="profile-section">
          <h2>Metrics</h2>
          <div className="profile-metric-grid">
            <div><span>Total Units sold</span><strong>{Math.max(42, product.stock * 3)}</strong><small>+18% sold this month</small></div>
            <div><span>Revenue Generated</span><strong>Rs.{(product.stock * Number(product.price.replace(/\D/g, '') || 1)).toLocaleString('en-IN')}</strong><small>+22% this month</small></div>
          </div>
        </Panel>

        <Panel className="profile-section review-panel">
          <h2>Ratings and Review</h2>
          <div className="rating-summary"><strong>4.8</strong><span>{'\u2605'.repeat(5)}</span><small>Based on 142 Reviews</small></div>
          <div className="review-row"><b>Priya S</b><span>2 Days ago</span><p>Fresh and Good Quality</p></div>
          <div className="review-row"><b>Meera P</b><span>3 Days ago</span><p>Highly Recommend for soft rotis</p></div>
          <button className="text-link small" type="button">See all</button>
        </Panel>

        <Panel className="profile-section offer-status-panel">
          <h2>Offer and Discount status (1)</h2>
          <div className="offer-status-row">
            <span className="discount-icon">%</span>
            <div><strong>SAVE 20</strong><p>20% off - Valid upto May 15</p></div>
            <em>ACTIVE</em>
          </div>
        </Panel>

        <Panel className="profile-section activity-panel">
          <h2>Activity Log</h2>
          <div><strong>Stock Update</strong><p>New stock arrival <b>+20</b> on 9th May 2026 - Expiration on 29th May 2026</p><span>Overall stock <b>8 +20</b></span></div>
          <div><strong>Stock Update</strong><p>New stock arrival <b>+12</b> on 29th Apr 2026 - Expiration on 19th May 2026</p><span>Overall stock <b>2 +12</b></span></div>
        </Panel>
      </div>
    </section>
  )
}
