export function getApiData(response, fallback = []) {
  const payload = response?.data

  if (payload?.data?.data !== undefined) {
    return payload.data.data
  }

  if (payload?.data !== undefined) {
    return payload.data
  }

  return fallback
}

export function getApiMessage(error, fallback = 'Terjadi kesalahan saat memuat data.') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  )
}

export function asArray(value) {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  return []
}

export function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('id-ID')
}

export function getItemName(row) {
  return row?.item?.name || row?.barang?.name || row?.item_name || row?.name || '-'
}

export function getUserName(row) {
  return row?.user?.name || row?.created_by?.name || row?.user_name || '-'
}
