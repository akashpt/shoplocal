type PageActionsProps = {
  onCancel: () => void
  onSave: () => void
  saveLabel?: string
}

export function PageActions({ onCancel, onSave, saveLabel = 'Save & Publish' }: PageActionsProps) {
  return (
    <div className="detail-bottom-bar">
      <span>Draft Auto-saved as you type</span>
      <div>
        <button className="action-button" type="button" onClick={onCancel}>Cancel</button>
        <button className="action-button primary" type="button" onClick={onSave}>{saveLabel}</button>
      </div>
    </div>
  )
}

