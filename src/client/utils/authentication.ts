export const STORAGE_TOKEN_KEY = 'token'

export function setAuthTokenForLocalStorage(authToken: string) {
  if (typeof window === 'undefined') return undefined

  window.localStorage.setItem(STORAGE_TOKEN_KEY, authToken)
}

export function removeAuthTokenFromLocalStorage() {
  if (typeof window === 'undefined') return undefined

  window.localStorage.removeItem(STORAGE_TOKEN_KEY)
}

export function getAuthTokenFromLocalStorage(): string | undefined {
  if (typeof window === 'undefined') return undefined

  return window.localStorage.getItem(STORAGE_TOKEN_KEY)
}

export function getIsLoggedInFromLocalStorage(): boolean | undefined {
  const authToken = getAuthTokenFromLocalStorage()

  if (typeof authToken === 'undefined') return undefined
  return Boolean(authToken)
}
