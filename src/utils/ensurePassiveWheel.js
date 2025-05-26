export function ensurePassiveWheel(target) {
  if (!target) return
  const noop = () => {}
  try {
    target.addEventListener('wheel', noop, { passive: true })
    target.removeEventListener('wheel', noop)
  } catch (e) {
    // older browsers 不支援 passive
  }
}