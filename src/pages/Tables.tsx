import { useEffect, useMemo, useRef, useState } from 'react'
import type { DragEvent, MouseEvent } from 'react'
import { AppIcon } from '../components/ui/AppIcon'
import { showToast } from '../utils/toast'

type ModalMode = 'add' | 'edit'
type ModalStep = 1 | 2 | 3
type FloorType = 'Indoor' | 'Outdoor'
type TableKind = 'small' | 'wide' | 'tall'
type PendingPlacement = { kind: TableKind; x: number; y: number; col: number; row: number; rotate?: number }
type DragPayload = { source: 'palette'; kind: TableKind } | { source: 'existing'; id: string }
type BottomMode = 'select' | 'reservation' | 'detail'

type LayoutTable = {
  id: string
  name: string
  kind: TableKind
  status: 'available' | 'busy' | 'reserved'
  x: number
  y: number
  col?: number
  row?: number
  rotate?: number
  order?: string
}

type FloorLayout = {
  id: string
  number: number
  type: FloorType
  enabled: boolean
  tables: LayoutTable[]
}

const tableKinds: Array<{ id: TableKind; label: string; note: string; cells: string }> = [
  { id: 'small', label: 'Small Table', note: '1-4 People', cells: '2 cells' },
  { id: 'wide', label: 'Large Table (H)', note: '6+ People', cells: '6 cells' },
  { id: 'tall', label: 'Large Table (V)', note: '6+ People', cells: '6 cells' },
]

const initialTables: LayoutTable[] = [
  { id: 'a1', name: 'A1', kind: 'small', status: 'available', x: 7, y: 15, col: 1, row: 2 },
  { id: 'a2', name: 'A2', kind: 'wide', status: 'reserved', x: 26, y: 12, col: 4, row: 1 },
  { id: 'a3', name: 'A3', kind: 'wide', status: 'available', x: 46, y: 15, col: 8, row: 1 },
  { id: 'a6', name: 'A6', kind: 'small', status: 'busy', x: 69, y: 13, col: 11, row: 1, order: 'D1104' },
  { id: 'a7', name: 'A7', kind: 'tall', status: 'reserved', x: 86, y: 12, col: 13, row: 1 },
  { id: 'a4', name: 'A4', kind: 'small', status: 'available', x: 9, y: 44, col: 1, row: 5 },
  { id: 'a5', name: 'A5', kind: 'small', status: 'available', x: 25, y: 44, col: 4, row: 5 },
  { id: 'a8', name: 'A8', kind: 'small', status: 'available', x: 44, y: 44, col: 7, row: 5 },
  { id: 'a9', name: 'A9', kind: 'small', status: 'available', x: 69, y: 44, col: 10, row: 5 },
  { id: 'a10', name: 'A10', kind: 'small', status: 'available', x: 9, y: 74, col: 1, row: 8 },
  { id: 'a11', name: 'A11', kind: 'wide', status: 'busy', x: 26, y: 70, col: 4, row: 8, order: 'D1105' },
  { id: 'a12', name: 'A12', kind: 'small', status: 'available', x: 44, y: 74, col: 8, row: 8 },
  { id: 'a13', name: 'A13', kind: 'wide', status: 'busy', x: 60, y: 72, col: 10, row: 8, order: 'D1106' },
  { id: 'a14', name: 'A14', kind: 'tall', status: 'available', x: 89, y: 68, col: 13, row: 7 },
]

const initialFloors: FloorLayout[] = [
  { id: 'floor-1', number: 1, type: 'Indoor', enabled: true, tables: initialTables },
  { id: 'floor-2', number: 2, type: 'Indoor', enabled: true, tables: [] },
  { id: 'floor-3', number: 3, type: 'Outdoor', enabled: true, tables: [] },
]

function floorName(number: number) {
  return `Floor #${number}`
}

function floorTabLabel(number: number) {
  if (number === 1) return '1st Floor'
  if (number === 2) return '2nd Floor'
  if (number === 3) return '3rd Floor'
  return `${number}th Floor`
}

export function Tables() {
  const [floors, setFloors] = useState<FloorLayout[]>(initialFloors)
  const [activeFloorId, setActiveFloorId] = useState('floor-1')
  const [selectedTableId, setSelectedTableId] = useState('a11')
  const [bottomMode, setBottomMode] = useState<BottomMode>('detail')
  const [isFloorMenuOpen, setIsFloorMenuOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode | null>(null)
  const [modalStep, setModalStep] = useState<ModalStep>(1)
  const [floorNumber, setFloorNumber] = useState('4')
  const [draftFloorType, setDraftFloorType] = useState<FloorType>('Indoor')
  const [selectedKind, setSelectedKind] = useState<TableKind>('wide')
  const [nameDraft, setNameDraft] = useState('')
  const [isNamePromptOpen, setIsNamePromptOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedLayout, setUploadedLayout] = useState(false)
  const [layoutImageUrl, setLayoutImageUrl] = useState('')
  const [pendingPlacement, setPendingPlacement] = useState<PendingPlacement | null>(null)
  const floorMenuRef = useRef<HTMLDivElement | null>(null)
  const activeFloor = floors.find((floor) => floor.id === activeFloorId) || floors[0]
  const tables = activeFloor.tables
  const floorType = activeFloor.type
  const selectedTable = tables.find((table) => table.id === selectedTableId) || null

  function updateActiveTables(updater: (tables: LayoutTable[]) => LayoutTable[]) {
    setFloors((currentFloors) =>
      currentFloors.map((floor) =>
        floor.id === activeFloor.id ? { ...floor, tables: updater(floor.tables) } : floor,
      ),
    )
  }

  function switchFloor(floorId: string) {
    setActiveFloorId(floorId)
    setSelectedTableId('')
    setBottomMode('select')
  }

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!floorMenuRef.current?.contains(event.target as Node)) {
        setIsFloorMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsFloorMenuOpen(false)
        setModalMode(null)
        setIsNamePromptOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (layoutImageUrl) {
        URL.revokeObjectURL(layoutImageUrl)
      }
    }
  }, [layoutImageUrl])

  function uploadLayoutImage(file: File | null) {
    if (!file) {
      showToast('Choose a layout image first.', 'warning')
      return
    }

    if (!file.type.startsWith('image/')) {
      showToast('Only image files can be uploaded for layout.', 'error')
      return
    }

    if (layoutImageUrl) {
      URL.revokeObjectURL(layoutImageUrl)
    }
    setLayoutImageUrl(URL.createObjectURL(file))
    setUploadedLayout(true)
    showToast('Layout image uploaded successfully.', 'success')
  }

  function openModal(mode: ModalMode, step: ModalStep = 1) {
    const nextFloorNumber = Math.max(1, ...floors.map((floor) => floor.number)) + 1
    setModalMode(mode)
    setModalStep(step)
    setFloorNumber(mode === 'add' ? String(nextFloorNumber) : String(activeFloor.number))
    setDraftFloorType(mode === 'add' ? 'Indoor' : activeFloor.type)
    setIsAnalyzing(mode === 'add' && step === 1 && !uploadedLayout)
    if (mode === 'add' && step === 1 && !uploadedLayout) {
      window.setTimeout(() => setIsAnalyzing(false), 900)
    }
  }

  function addTableFromPrompt() {
    const nextNumber = tables.length + 1
    const placement = pendingPlacement || { kind: selectedKind, x: 54, y: 48, col: 8, row: 5, rotate: selectedKind === 'wide' ? -14 : 0 }
    const nextId = `new-${Date.now()}`
    updateActiveTables((currentTables) => [
      ...currentTables,
      {
        id: nextId,
        name: nameDraft.trim() || `F${nextNumber}`,
        kind: placement.kind,
        status: 'available',
        x: placement.x,
        y: placement.y,
        col: placement.col,
        row: placement.row,
        rotate: placement.rotate,
      },
    ])
    setNameDraft('')
    setPendingPlacement(null)
    setIsNamePromptOpen(false)
    setSelectedTableId(nextId)
    setBottomMode('detail')
    showToast(`Table ${nameDraft.trim() || `F${nextNumber}`} added to layout.`, 'success')
  }

  function cancelTableNamePrompt() {
    setNameDraft('')
    setPendingPlacement(null)
    setIsNamePromptOpen(false)
  }

  function placeTable(kind: TableKind, x: number, y: number, col = 8, row = 5) {
    setSelectedKind(kind)
    setPendingPlacement({ kind, x, y, col, row, rotate: kind === 'wide' ? -14 : 0 })
    setIsNamePromptOpen(true)
  }

  function moveTable(id: string, x: number, y: number, col = 8, row = 5) {
    updateActiveTables((currentTables) => currentTables.map((table) => (table.id === id ? { ...table, x, y, col, row } : table)))
  }

  function setTableRotation(id: string, angle: number) {
    const normalizedAngle = ((Math.round(angle) % 360) + 360) % 360
    updateActiveTables((currentTables) =>
      currentTables.map((table) => (table.id === id ? { ...table, rotate: normalizedAngle } : table)),
    )
  }

  function deleteTable(id: string) {
    updateActiveTables((currentTables) => currentTables.filter((table) => table.id !== id))
    if (selectedTableId === id) {
      setSelectedTableId('')
    }
    showToast('Table deleted from layout.', 'error')
  }

  function setSelectedTableStatus(status: LayoutTable['status']) {
    if (!selectedTableId) {
      showToast('Select a table before changing status.', 'warning')
      return
    }

    updateActiveTables((currentTables) =>
      currentTables.map((table) =>
        table.id === selectedTableId
          ? {
              ...table,
              status,
              order: status === 'busy' ? table.order || `D${1100 + currentTables.indexOf(table) + 1}` : undefined,
            }
          : table,
      ),
    )
    showToast(`Table status changed to ${status === 'busy' ? 'not available' : status}.`, status === 'available' ? 'success' : 'warning')
  }

  function createOrderForSelectedTable() {
    const targetId = selectedTableId || tables.find((table) => table.status === 'available')?.id
    if (!targetId) {
      showToast('Select an available table before creating an order.', 'warning')
      return
    }

    setSelectedTableId(targetId)
    updateActiveTables((currentTables) =>
      currentTables.map((table) =>
        table.id === targetId
          ? { ...table, status: 'busy', order: table.order || `D${1100 + currentTables.indexOf(table) + 1}` }
          : table,
      ),
    )
    showToast('New table order created successfully.', 'success')
  }

  function saveFloorInfo() {
    const parsedNumber = Math.max(1, Number(floorNumber) || activeFloor.number)
    const existingFloor = floors.find((floor) => floor.number === parsedNumber && floor.id !== activeFloor.id)

    if (modalMode === 'add' && !existingFloor) {
      const nextFloor: FloorLayout = {
        id: `floor-${parsedNumber}`,
        number: parsedNumber,
        type: draftFloorType,
        enabled: true,
        tables: [],
      }
      setFloors((currentFloors) => [...currentFloors, nextFloor].sort((first, second) => first.number - second.number))
      setActiveFloorId(nextFloor.id)
      setSelectedTableId('')
      setBottomMode('select')
      showToast(`Floor ${parsedNumber} created successfully.`, 'success')
      return
    }

    if (existingFloor) {
      setFloors((currentFloors) =>
        currentFloors.map((floor) => (floor.id === existingFloor.id ? { ...floor, type: draftFloorType } : floor)),
      )
      setActiveFloorId(existingFloor.id)
      showToast(`Floor ${parsedNumber} already existed, so its type was updated.`, 'warning')
      return
    }

    setFloors((currentFloors) =>
      currentFloors
        .map((floor) =>
          floor.id === activeFloor.id ? { ...floor, number: parsedNumber, type: draftFloorType } : floor,
        )
        .sort((first, second) => first.number - second.number),
    )
    showToast('Floor details saved successfully.', 'success')
  }

  return (
    <section className="tables-page">
      <div className="table-screen-toolbar">
        <button className="table-tab active" type="button" onClick={() => setBottomMode('select')}><TableIcon /> Table</button>
        <div className="table-status-legend">
          <button className={selectedTable?.status === 'available' ? 'active' : ''} type="button" onClick={() => setSelectedTableStatus('available')}><i></i>Available</button>
          <button className={selectedTable?.status === 'busy' ? 'active' : ''} type="button" onClick={() => setSelectedTableStatus('busy')}><i></i>Not Available</button>
          <button className={selectedTable?.status === 'reserved' ? 'active' : ''} type="button" onClick={() => setSelectedTableStatus('reserved')}><i></i>Reserved</button>
        </div>
        <div className="floor-switcher">
          {floors.map((floor) => (
            <button
              className={floor.id === activeFloor.id ? 'active' : ''}
              disabled={!floor.enabled}
              key={floor.id}
              type="button"
              onClick={() => switchFloor(floor.id)}
            >
              {floorTabLabel(floor.number)}
            </button>
          ))}
        </div>
        <button className="blue-action" type="button" onClick={createOrderForSelectedTable}>+ Create New Order</button>
        <div className="floor-menu-wrap" ref={floorMenuRef}>
          <button className="icon-only-button" type="button" aria-label="Manage floors" onClick={() => setIsFloorMenuOpen((open) => !open)}><GearIcon /></button>
          {isFloorMenuOpen && (
            <div className="floor-menu">
              <button className="floor-add" type="button" onClick={() => openModal('add')}>+ Add New Floor</button>
              {floors.map((floor) => (
                <div className="floor-menu-row" key={floor.id}>
                  <button type="button" onClick={() => {
                    setActiveFloorId(floor.id)
                    setSelectedTableId('')
                    setFloorNumber(String(floor.number))
                    setDraftFloorType(floor.type)
                    setModalMode('edit')
                    setModalStep(2)
                  }}><PencilIcon />{floorName(floor.number)}</button>
                  <label className="mini-switch">
                    <input
                      checked={floor.enabled}
                      type="checkbox"
                      onChange={(event) => setFloors((currentFloors) =>
                        currentFloors.map((item) => (item.id === floor.id ? { ...item, enabled: event.target.checked } : item)),
                      )}
                    />
                    <span></span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="table-floor-bar">
        <button type="button" onClick={() => {
          setFloorNumber(String(activeFloor.number))
          openModal('edit', 1)
        }}>Floor Info: <span>{floorName(activeFloor.number)} / Floor Type {floorType}</span><ChevronRight /></button>
      </div>

      <div className="table-canvas-scroll">
        <div className="table-canvas">
          {tables.map((table) => (
            <RestaurantTable
              isSelected={table.id === selectedTableId}
              key={table.id}
              table={table}
              onSelect={() => {
                setSelectedTableId(table.id)
                setBottomMode('detail')
              }}
            />
          ))}
        </div>
      </div>

      <div className="table-bottom-actions">
        <button className={bottomMode === 'select' ? 'active' : ''} type="button" onClick={() => setBottomMode('select')}>Table Select</button>
        {selectedTable && <button type="button" onClick={() => setSelectedTableId('')}>Table {selectedTable.name} <span>x</span></button>}
        <button className={bottomMode === 'reservation' ? 'active' : ''} type="button" onClick={() => setBottomMode('reservation')}>Info Reservation</button>
        <button className={bottomMode === 'detail' ? 'active' : ''} type="button" onClick={() => setBottomMode('detail')}>Detail Table</button>
      </div>

      {modalMode && (
        <TableLayoutModal
          activeFloor={activeFloor}
          bottomMode={bottomMode}
          floorNumber={floorNumber}
          floorType={draftFloorType}
          isAnalyzing={isAnalyzing}
          isNamePromptOpen={isNamePromptOpen}
          layoutImageUrl={layoutImageUrl}
          mode={modalMode}
          nameDraft={nameDraft}
          selectedKind={selectedKind}
          selectedTableId={selectedTable?.id || null}
          selectedTableName={selectedTable?.name || null}
          selectedTableRotation={selectedTable?.rotate || 0}
          step={modalStep}
          tables={tables}
          uploadedLayout={uploadedLayout}
          onAddTable={addTableFromPrompt}
          onBottomModeChange={setBottomMode}
          onCancelTableName={cancelTableNamePrompt}
          onClearSelectedTable={() => setSelectedTableId('')}
          onClose={() => setModalMode(null)}
          onDeleteTable={deleteTable}
          onFloorNumberChange={setFloorNumber}
          onFloorTypeChange={setDraftFloorType}
          onNameDraftChange={setNameDraft}
          onMoveTable={moveTable}
          onPlaceTable={placeTable}
          onSetTableRotation={setTableRotation}
          onSelectTable={setSelectedTableId}
          onSelectKind={setSelectedKind}
          onSaveFloorInfo={saveFloorInfo}
          onStepChange={setModalStep}
          onUpload={uploadLayoutImage}
        />
      )}
    </section>
  )
}

function TableLayoutModal({
  activeFloor,
  bottomMode,
  floorNumber,
  floorType,
  isAnalyzing,
  isNamePromptOpen,
  layoutImageUrl,
  mode,
  nameDraft,
  onAddTable,
  onBottomModeChange,
  onCancelTableName,
  onClearSelectedTable,
  onClose,
  onDeleteTable,
  onFloorNumberChange,
  onFloorTypeChange,
  onMoveTable,
  onNameDraftChange,
  onPlaceTable,
  onSelectKind,
  onSelectTable,
  onSetTableRotation,
  onSaveFloorInfo,
  onStepChange,
  onUpload,
  selectedKind,
  selectedTableId,
  selectedTableName,
  selectedTableRotation,
  step,
  tables,
  uploadedLayout,
}: {
  activeFloor: FloorLayout
  bottomMode: 'select' | 'reservation' | 'detail'
  floorNumber: string
  floorType: FloorType
  isAnalyzing: boolean
  isNamePromptOpen: boolean
  layoutImageUrl: string
  mode: ModalMode
  nameDraft: string
  onAddTable: () => void
  onBottomModeChange: (mode: 'select' | 'reservation' | 'detail') => void
  onCancelTableName: () => void
  onClearSelectedTable: () => void
  onClose: () => void
  onDeleteTable: (id: string) => void
  onFloorNumberChange: (value: string) => void
  onFloorTypeChange: (value: FloorType) => void
  onMoveTable: (id: string, x: number, y: number, col?: number, row?: number) => void
  onNameDraftChange: (value: string) => void
  onPlaceTable: (kind: TableKind, x: number, y: number, col?: number, row?: number) => void
  onSelectKind: (kind: TableKind) => void
  onSelectTable: (id: string) => void
  onSetTableRotation: (id: string, angle: number) => void
  onSaveFloorInfo: () => void
  onStepChange: (step: ModalStep) => void
  onUpload: (file: File | null) => void
  selectedKind: TableKind
  selectedTableId: string | null
  selectedTableName: string | null
  selectedTableRotation: number
  step: ModalStep
  tables: LayoutTable[]
  uploadedLayout: boolean
}) {
  const title = mode === 'add' ? 'Add New Layout Table' : 'Edit Layout Table'
  const largeTables = tables.filter((table) => table.kind !== 'small').length
  const smallTables = tables.filter((table) => table.kind === 'small').length
  const canvasRef = useRef<HTMLDivElement | null>(null)

  function getTableSpan(kind: TableKind) {
    if (kind === 'wide') return { cols: 3, rows: 2 }
    if (kind === 'tall') return { cols: 2, rows: 3 }
    return { cols: 2, rows: 1 }
  }

  function getCellPosition(col: number, row: number) {
    const canvas = canvasRef.current
    if (!canvas) {
      return { x: 50, y: 50, col, row }
    }

    const firstCell = canvas.querySelector('i')
    const cellRect = firstCell?.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()
    if (!cellRect) {
      return { x: 50, y: 50, col, row }
    }

    const cellStep = cellRect.width + 16
    const left = cellRect.left - canvasRect.left + (col - 1) * cellStep
    const top = cellRect.top - canvasRect.top + (row - 1) * cellStep
    return {
      x: Math.round((left / canvasRect.width) * 100),
      y: Math.round((top / canvasRect.height) * 100),
      col,
      row,
    }
  }

  function getDropCell(event: { clientX: number; clientY: number }) {
    const canvas = canvasRef.current
    const firstCell = canvas?.querySelector('i')
    if (!canvas || !firstCell) {
      return { col: 1, row: 1 }
    }

    const canvasRect = canvas.getBoundingClientRect()
    const cellRect = firstCell.getBoundingClientRect()
    const cellStep = cellRect.width + 16
    const localX = event.clientX - cellRect.left
    const localY = event.clientY - cellRect.top
    const col = Math.min(14, Math.max(1, Math.round(localX / cellStep) + 1))
    const row = Math.min(10, Math.max(1, Math.round(localY / cellStep) + 1))
    if (event.clientX < canvasRect.left || event.clientY < canvasRect.top) {
      return { col: 1, row: 1 }
    }
    return { col, row }
  }

  function cellsFor(kind: TableKind, col: number, row: number) {
    const span = getTableSpan(kind)
    const cells: string[] = []
    for (let yIndex = 0; yIndex < span.rows; yIndex += 1) {
      for (let xIndex = 0; xIndex < span.cols; xIndex += 1) {
        cells.push(`${col + xIndex}:${row + yIndex}`)
      }
    }
    return cells
  }

  function findFreePlacement(kind: TableKind, startCol: number, startRow: number, movingId?: string) {
    const span = getTableSpan(kind)
    const occupied = new Set<string>()
    tables
      .filter((table) => table.id !== movingId)
      .forEach((table) => {
        const tableCol = table.col || 1
        const tableRow = table.row || 1
        cellsFor(table.kind, tableCol, tableRow).forEach((cell) => occupied.add(cell))
      })

    const maxCol = 14 - span.cols + 1
    const maxRow = 10 - span.rows + 1
    const candidates: Array<{ col: number; row: number; score: number }> = []
    for (let row = 1; row <= maxRow; row += 1) {
      for (let col = 1; col <= maxCol; col += 1) {
        candidates.push({ col, row, score: Math.abs(col - startCol) + Math.abs(row - startRow) })
      }
    }

    const match = candidates
      .sort((first, second) => first.score - second.score)
      .find((candidate) => cellsFor(kind, candidate.col, candidate.row).every((cell) => !occupied.has(cell)))

    return getCellPosition(match?.col || Math.min(startCol, maxCol), match?.row || Math.min(startRow, maxRow))
  }

  function readDragPayload(event: DragEvent<HTMLElement>): DragPayload | null {
    const rawPayload = event.dataTransfer.getData('application/x-table-layout')
    if (!rawPayload) {
      return null
    }

    try {
      return JSON.parse(rawPayload) as DragPayload
    } catch {
      return null
    }
  }

  function writeDragPayload(event: DragEvent<HTMLElement>, payload: DragPayload) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/x-table-layout', JSON.stringify(payload))
  }

  function handleCanvasDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const payload = readDragPayload(event)
    if (!payload) {
      return
    }

    const targetCell = getDropCell(event)
    if (payload.source === 'palette') {
      const point = findFreePlacement(payload.kind, targetCell.col, targetCell.row)
      onPlaceTable(payload.kind, point.x, point.y, point.col, point.row)
      return
    }

    const movingTable = tables.find((table) => table.id === payload.id)
    if (!movingTable) {
      return
    }
    const point = findFreePlacement(movingTable.kind, targetCell.col, targetCell.row, payload.id)
    onMoveTable(payload.id, point.x, point.y, point.col, point.row)
  }

  function handleCanvasClick(event: MouseEvent<HTMLDivElement>) {
    if (isNamePromptOpen) {
      return
    }

    const target = event.target as HTMLElement
    if (target.closest('.layout-table-preview') || target.closest('.delete-drop')) {
      return
    }

    const targetCell = getDropCell(event)
    const point = findFreePlacement(selectedKind, targetCell.col, targetCell.row)
    onPlaceTable(selectedKind, point.x, point.y, point.col, point.row)
  }

  function handleDeleteDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    const payload = readDragPayload(event)
    if (payload?.source === 'existing') {
      onDeleteTable(payload.id)
    }
  }

  function goToNextStep() {
    if (mode === 'edit') {
      if (step === 1) {
        onSaveFloorInfo()
      }
      onClose()
      return
    }

    if (step === 1) {
      onSaveFloorInfo()
    }
    onStepChange(step === 1 ? 2 : 3)
  }

  return (
    <div className="table-modal-backdrop">
      <div className="table-layout-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="table-modal-title">
          <h2>{title}</h2>
          <button type="button" aria-label="Close modal" onClick={onClose}>x</button>
        </div>

        {mode === 'add' ? <StepIndicator step={step} /> : <EditTabs step={step} onStepChange={onStepChange} />}

        <div className="layout-modal-card">
          {step === 1 && (
            <>
              <div className="layout-card-header"><h3>Table Info</h3></div>
              {isAnalyzing ? (
                <div className="layout-analyzing"><span></span><strong>Analyzing Your Layout</strong></div>
              ) : (
                <div className="table-info-form">
                  <label>Floor Number<input value={floorNumber} onChange={(event) => onFloorNumberChange(event.target.value)} /></label>
                  <div>
                    <span>Floor Type</span>
                    <div className="table-segment">
                      <button className={floorType === 'Indoor' ? 'active' : ''} type="button" onClick={() => onFloorTypeChange('Indoor')}>Indoor</button>
                      <button className={floorType === 'Outdoor' ? 'active' : ''} type="button" onClick={() => onFloorTypeChange('Outdoor')}>Outdoor</button>
                    </div>
                  </div>
                  <div>
                    <span>Upload your layout <small>(Optional)</small></span>
                    <label className={uploadedLayout ? 'layout-upload uploaded' : 'layout-upload'}>
                      <input
                        accept="image/*"
                        type="file"
                        onChange={(event) => onUpload(event.target.files?.[0] || null)}
                      />
                      {layoutImageUrl ? <img alt="Uploaded layout preview" src={layoutImageUrl} /> : <><ImageIcon /><strong>Tap here <span>to upload Photo</span></strong></>}
                    </label>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="layout-card-header inline"><h3>Layout Arrange</h3><span>{floorName(activeFloor.number)} / Floor Type <b>{floorType}</b></span></div>
              <div className="layout-arrange-area">
                <aside className="table-picker">
                  <h4>Table selection</h4>
                  <p>Select a table type, then tap a grid cell or drag it onto the layout.</p>
                  {tableKinds.map((kind) => (
                    <button
                      className={selectedKind === kind.id ? 'active' : ''}
                      draggable
                      key={kind.id}
                      type="button"
                      onClick={() => {
                        onSelectKind(kind.id)
                      }}
                      onDragStart={(event) => {
                        onSelectKind(kind.id)
                        writeDragPayload(event, { source: 'palette', kind: kind.id })
                      }}
                    >
                      <TableShape kind={kind.id} ghost />
                      <span>{kind.label}<small>{kind.note}</small><b>{kind.cells}</b></span>
                    </button>
                  ))}
                </aside>
                <div
                  className="layout-grid-canvas"
                  ref={canvasRef}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleCanvasDrop}
                  onClick={handleCanvasClick}
                >
                  <GridBlocks />
                  {tables.map((table) => (
                    <DraggableTablePreview
                      key={table.id}
                      isSelected={selectedTableId === table.id}
                      table={table}
                      onDragStart={(event) => writeDragPayload(event, { source: 'existing', id: table.id })}
                      onSelect={() => onSelectTable(table.id)}
                    />
                  ))}
                  <div className="delete-drop" onDragOver={(event) => event.preventDefault()} onDrop={handleDeleteDrop}><TrashIcon />Drag here to delete</div>
                </div>
                <div className="modal-table-bottom-actions">
                  <button className={bottomMode === 'select' ? 'active' : ''} type="button" onClick={() => onBottomModeChange('select')}>Table Select</button>
                  {selectedTableName && <button type="button" onClick={onClearSelectedTable}>Table {selectedTableName} <span>x</span></button>}
                  {selectedTableId && <button type="button" onClick={() => {
                    onDeleteTable(selectedTableId)
                  }}>Delete Selected</button>}
                  {selectedTableId && (
                    <label className="manual-rotate-control">
                      <span>Rotate</span>
                      <button
                        type="button"
                        aria-label="Rotate table left"
                        onClick={() => {
                          onSetTableRotation(selectedTableId, selectedTableRotation - 15)
                        }}
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="359"
                        value={selectedTableRotation}
                        onChange={(event) => {
                          onSetTableRotation(selectedTableId, Number(event.target.value))
                        }}
                      />
                      <button
                        type="button"
                        aria-label="Rotate table right"
                        onClick={() => {
                          onSetTableRotation(selectedTableId, selectedTableRotation + 15)
                        }}
                      >
                        +
                      </button>
                      <input
                        type="number"
                        min="0"
                        max="359"
                        value={selectedTableRotation}
                        onChange={(event) => {
                          onSetTableRotation(selectedTableId, Number(event.target.value))
                        }}
                      />
                    </label>
                  )}
                  <button className={bottomMode === 'reservation' ? 'active' : ''} type="button" onClick={() => onBottomModeChange('reservation')}>Info Reservation</button>
                  <button className={bottomMode === 'detail' ? 'active' : ''} type="button" onClick={() => onBottomModeChange('detail')}>Detail Table</button>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="table-success-state">
              <StepCheckIcon />
              <h3>Table Successfully Created</h3>
              <p>Yeay! a new table already added to <b>Table Menu</b></p>
              <div className="table-summary-box">
                <span>Floor<b>#{floorNumber}</b></span>
                <span>Large Table<b>{largeTables}</b></span>
                <span>Small Table<b>{smallTables}</b></span>
                <span>Table Total<b>{tables.length}</b></span>
              </div>
              <button className="blue-action" type="button" onClick={onClose}>Go to Table Screen</button>
            </div>
          )}

          {isNamePromptOpen && (
            <div className="table-name-popover">
              <h3>Table Name</h3>
              <input value={nameDraft} onChange={(event) => onNameDraftChange(event.target.value)} placeholder="Enter Table Name" autoFocus />
              <div className="table-name-actions">
                <button className="ghost-action" type="button" onClick={onCancelTableName}>Cancel</button>
                <button className="blue-action" type="button" onClick={onAddTable}>Confirm</button>
              </div>
            </div>
          )}
        </div>

        {step !== 3 && !isAnalyzing && (
          <div className="table-modal-actions">
            {step === 2 && <button className="ghost-action" type="button" onClick={() => onStepChange(1)}>Back</button>}
            {mode === 'edit' ? (
              <button className="blue-action" type="button" onClick={goToNextStep}>Save Information</button>
            ) : (
              <button className="blue-action" type="button" onClick={goToNextStep}>Next {'->'}</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function RestaurantTable({ isSelected, onSelect, table }: { isSelected: boolean; onSelect: () => void; table: LayoutTable }) {
  return (
    <button
      className={isSelected ? `restaurant-table ${table.kind} ${table.status} selected` : `restaurant-table ${table.kind} ${table.status}`}
      style={{ left: `${table.x}%`, top: `${table.y}%` }}
      type="button"
      onClick={onSelect}
    >
      <TableShape kind={table.kind} />
      <strong>{table.name}</strong>
      {table.order && <span>{table.order}</span>}
      {table.status === 'busy' && <em>In Progress</em>}
      {table.status === 'reserved' && <small>17:00 PM</small>}
    </button>
  )
}

function StepIndicator({ step }: { step: ModalStep }) {
  return (
    <div className="table-stepper">
      {['Table Info', 'Layout Arrange', 'Success Add Table'].map((label, index) => {
        const currentStep = (index + 1) as ModalStep
        return (
          <div className={step === currentStep ? 'active' : step > currentStep ? 'done' : ''} key={label}>
            <span>{step > currentStep ? '✓' : currentStep}</span>{label}
          </div>
        )
      })}
    </div>
  )
}

function EditTabs({ step, onStepChange }: { step: ModalStep; onStepChange: (step: ModalStep) => void }) {
  return (
    <div className="edit-layout-tabs">
      <button className={step === 1 ? 'active' : ''} type="button" onClick={() => onStepChange(1)}><TableIcon /> Table Info</button>
      <button className={step === 2 ? 'active' : ''} type="button" onClick={() => onStepChange(2)}><MoveIcon /> Layout Arrange</button>
    </div>
  )
}

function GridBlocks() {
  return <>{Array.from({ length: 140 }).map((_, index) => <i key={index} data-cell-index={index}></i>)}</>
}

function DraggableTablePreview({
  isSelected,
  onDragStart,
  onSelect,
  table,
}: {
  isSelected: boolean
  onDragStart: (event: DragEvent<HTMLDivElement>) => void
  onSelect: () => void
  table: LayoutTable
}) {
  const style = useMemo(() => ({ left: `${table.x}%`, top: `${table.y}%`, transform: `rotate(${table.rotate || 0}deg)` }), [table.rotate, table.x, table.y])
  return (
    <div className={isSelected ? `layout-table-preview ${table.kind} selected` : `layout-table-preview ${table.kind}`} draggable style={style} onClick={onSelect} onDragStart={onDragStart}>
      <button type="button" aria-label={`Move ${table.name}`} title="Drag to move"><MoveIcon /></button>
      <TableShape kind={table.kind} />
      <strong>{table.name}</strong>
    </div>
  )
}

function TableShape({ ghost = false, kind }: { ghost?: boolean; kind: TableKind }) {
  return <span className={ghost ? `table-shape ${kind} ghost` : `table-shape ${kind}`}><i></i><i></i><i></i><i></i></span>
}

function StepCheckIcon() {
  return <span className="success-check"><AppIcon name="check" /></span>
}

function TableIcon() {
  return <AppIcon name="monitor" />
}

function GearIcon() {
  return <AppIcon name="settings" />
}

function PencilIcon() {
  return <AppIcon name="pencil" />
}

function ChevronRight() {
  return <AppIcon name="chevron" />
}

function ImageIcon() {
  return <AppIcon name="image" />
}

function TrashIcon() {
  return <AppIcon name="trash" />
}

function MoveIcon() {
  return <AppIcon name="move" />
}
