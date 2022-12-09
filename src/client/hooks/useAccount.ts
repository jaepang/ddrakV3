import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { accountState } from '@client/recoil/authentication/atoms'
import {
  getAuthTokenFromLocalStorage,
  setAuthTokenForLocalStorage,
  removeAuthTokenFromLocalStorage,
  getIsLoggedInFromLocalStorage,
} from '../utils'
import { meQuery } from '@client/shared/queries'
import { useQuery } from 'react-query'
import { graphQLClient } from '@client/utils'
import { USER_TYPE, PATHNAME } from '../consts'

interface UseAccountParams {
  isAuthRequired?: boolean
  isUnauthRequired?: boolean
  authRequiredRedirectUrl?: string
  unauthRequiredRedirectUrl?: string
  refetchOnWindowFocus?: boolean
}

export function useAccount({
  isAuthRequired,
  isUnauthRequired,
  authRequiredRedirectUrl,
  unauthRequiredRedirectUrl,
  refetchOnWindowFocus = false,
}: UseAccountParams = {}) {
  const router = useRouter()
  const [account, setAccount] = useRecoilState(accountState)

  useEffect(() => {
    if (account.isLoggedIn === undefined) return

    if (isUnauthRequired && account.isLoggedIn) {
      router.push(unauthRequiredRedirectUrl ?? PATHNAME.HOME)
      return
    }

    if (isAuthRequired && !account.isLoggedIn) {
      router.push(authRequiredRedirectUrl ?? PATHNAME.LOGIN)
      return
    }
  }, [account.isLoggedIn])

  const { data, isLoading, refetch } = useQuery('me', meQuery, {
    onError: ({ response }) => {
      logout()
    },
    retry: false,
    enabled: account.isLoggedIn,
    refetchOnMount: false,
    staleTime: 30000,
    refetchOnWindowFocus,
  })

  const userType = !account.isLoggedIn
    ? USER_TYPE.GUEST
    : data?.me?.isSuper
    ? USER_TYPE.SUPER
    : data?.me?.isAdmin
    ? USER_TYPE.CLUB_ADMIN
    : USER_TYPE.CLUB_MEMBER

  const displayName =
    account.isLoggedIn && (data?.me?.club?.name ?? '' + (data?.me?.isAdmin || data?.me?.isSuper ? ' Admin' : ''))

  function syncHeaders() {
    graphQLClient.setHeaders({
      authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
    })
  }

  function login(authToken: string) {
    setAuthTokenForLocalStorage(authToken)
    syncHeaders()
    setAccount({
      isLoggedIn: getIsLoggedInFromLocalStorage(),
    })
  }

  function logout() {
    removeAuthTokenFromLocalStorage()
    syncHeaders()
    setAccount({
      isLoggedIn: getIsLoggedInFromLocalStorage(),
    })
  }

  return {
    isLoggedIn: account.isLoggedIn,
    me: data?.me,
    isMeLoading: isLoading,
    displayName,
    userType,
    refetchMe: refetch,
    login,
    logout,
  }
}
