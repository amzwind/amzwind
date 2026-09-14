export function isMissingRpcError(error: unknown): boolean {
  const message = typeof error === 'object' && error !== null && 'message' in error
    ? String((error as { message?: string }).message ?? '')
    : String(error ?? '')

  if (!message) return false

  const normalized = message.toLowerCase()

  return (
    normalized.includes('could not find the function') ||
    normalized.includes('no function matches the given name') ||
    normalized.includes('function public.') && normalized.includes('schema cache') ||
    (normalized.includes('does not exist') && normalized.includes('function'))
  )
}
