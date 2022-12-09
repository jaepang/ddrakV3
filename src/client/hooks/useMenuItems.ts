import { useCalendar } from '@client/hooks'
import { IconType } from 'react-icons'
import { FaTools, FaPaperPlane, FaShare, FaSignInAlt, FaKey, FaQuestion, FaCalendarPlus } from 'react-icons/fa'

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
  const { enableSetCalendarMode } = useCalendar()

  const adminPage: MenuItem = { /*handler: 'adminPage',*/ label: 'Admin Page', icon: FaTools }
  const borrowRequest: MenuItem = { /*handler: 'openBorrowRequestModal',*/ label: 'Rental Request', icon: FaPaperPlane }
  const borrowSubmit: MenuItem = { /*handler: 'enableBorrowTimeMode',*/ label: 'Register Rental', icon: FaShare }
  const login: MenuItem = { /*handler: 'openLoginModal',*/ label: 'Login', icon: FaSignInAlt }
  const changePassword: MenuItem = { /* handler: 'openChangePasswordModal', */ label: 'Change Password', icon: FaKey }
  const help: MenuItem = { /* handler: 'openHelpModal', */ label: 'Help', icon: FaQuestion }
  const setCalendar: MenuItem = { handler: enableSetCalendarMode, label: 'Register Schedule', icon: FaCalendarPlus }

  const menuItems: { [key in USER_TYPE]: MenuItem[] } = {
    [USER_TYPE.SUPER]: [adminPage, setCalendar, changePassword],
    [USER_TYPE.CLUB_ADMIN]: [setCalendar, borrowSubmit, borrowRequest, help, changePassword],
    [USER_TYPE.CLUB_MEMBER]: [help, changePassword],
    [USER_TYPE.GUEST]: [login, borrowRequest, help],
  }
  return {
    menuItems,
  }
}
