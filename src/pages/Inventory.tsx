import { useMemo, useState } from 'react'

const initialProducts = [
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
  searchQuery: string
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
      {'★'.repeat(5)} <b>{rating}</b>
    </span>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
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
      className={label ? 'filter-control sort-control' : 'filter-control'}
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

export function Inventory({ searchQuery }: InventoryProps) {
  const [products, setProducts] = useState(initialProducts)
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
    const normalizedSearch = searchQuery.trim().toLowerCase()

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
  }, [categoryFilter, products, searchQuery, sortMode, stockFilter])
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

  return (
    <section className="inventory-page">
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
                >
                  <span className="inventory-check">
                    <input
                      type="checkbox"
                      aria-label={`Select ${product.name}`}
                      checked={selectedProductIds.includes(product.id)}
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
                      onClick={() => updateStock(product.id, -1)}
                    >
                      -
                    </button>
                    <span>{product.stock}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${product.name} stock`}
                      onClick={() => updateStock(product.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <Stars rating={product.rating} />
                  <button
                    className="delete-product"
                    type="button"
                    aria-label={`Delete ${product.name}`}
                    onClick={() => deleteProduct(product.id)}
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
                className={safeCurrentPage === 1 ? 'ghost' : ''}
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
