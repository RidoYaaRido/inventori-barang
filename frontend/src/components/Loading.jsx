function Loading({ message = 'Memuat data...' }) {
  return (
    <div className="d-flex align-items-center justify-content-center py-5">
      <div className="spinner-border text-primary me-2" role="status" aria-hidden="true" />
      <span className="text-secondary">{message}</span>
    </div>
  )
}

export default Loading
