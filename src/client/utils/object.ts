export function isEmptyObject(object) {
  if (object === null) return true
  if (object === undefined) return true
  if (object.length > 0) return false
  if (object.length === 0) return true
  if (typeof object !== 'object') return true
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) return false
  }
  return true
}
