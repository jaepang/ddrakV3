import { useRouter } from 'next/router'
import { PATHNAME } from '@client/consts'
import { useAccount, useGlobal } from '@client/hooks'
import { IconType } from 'react-icons'
import {
  FaTools,
  FaPaperPlane,
  FaShare,
  FaSignInAlt,
  FaKey,
  FaQuestion,
  FaCalendarPlus,
  FaSignOutAlt,
} from 'react-icons/fa'

export enum USER_TYPE {
  SUPER,
  CLUB_ADMIN,
  CLUB_MEMBER,
  GUEST,
}

type MenuItem = {
  handler?: () => void
  icon: IconType
  label: string
}

export function useMenuItems() {
  const { enableDefaultMode, enableSetCalendarMode } = useGlobal()
  const { logout: logoutFunc } = useAccount()
  const router = useRouter()

  function handleLogout() {
    logoutFunc()
    enableDefaultMode()
  }

  function handleLogin() {
    router.push(PATHNAME.LOGIN)
  }

  function handleChangePassword() {
    router.push(PATHNAME.CHANGE_PASSWORD)
  }

  const adminPage: MenuItem = { /*handler: 'adminPage',*/ label: 'Admin Page', icon: FaTools }
  const rentalRequest: MenuItem = { /*handler: 'openBorrowRequestModal',*/ label: 'Rental Request', icon: FaPaperPlane }
  const rentalSubmit: MenuItem = { /*handler: 'enableBorrowTimeMode',*/ label: 'Register Rental', icon: FaShare }
  const login: MenuItem = { handler: handleLogin, label: 'Login', icon: FaSignInAlt }
  const changePassword: MenuItem = { handler: handleChangePassword, label: 'Change Password', icon: FaKey }
  const help: MenuItem = { /* handler: 'openHelpModal', */ label: 'Help', icon: FaQuestion }
  const setCalendar: MenuItem = { handler: enableSetCalendarMode, label: 'Register Schedule', icon: FaCalendarPlus }
  const logout: MenuItem = { handler: handleLogout, label: 'Logout', icon: FaSignOutAlt }

  const menuItems: { [key in USER_TYPE]: MenuItem[] } = {
    [USER_TYPE.SUPER]: [adminPage, setCalendar, changePassword, logout],
    [USER_TYPE.CLUB_ADMIN]: [setCalendar, rentalSubmit, rentalRequest, changePassword, logout],
    [USER_TYPE.CLUB_MEMBER]: [changePassword, logout],
    [USER_TYPE.GUEST]: [login, rentalRequest],
  }
  return {
    menuItems,
  }
}
