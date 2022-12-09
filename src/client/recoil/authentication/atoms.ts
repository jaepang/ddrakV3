import { atom } from 'recoil'
import { getIsLoggedInFromLocalStorage } from '@client/utils'

interface Account {
  isLoggedIn?: boolean
}

export const accountState = atom<Account>({
  key: 'account',
  default: {
    isLoggedIn: getIsLoggedInFromLocalStorage(),
  },
})
