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
  FaUserPlus,
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
  const { enableDefaultMode, enableSetCalendarMode, enableRentalMode } = useGlobal()
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

  function handleRegisterUser() {
    router.push(PATHNAME.REGISTER)
  }

  const adminPage: MenuItem = { /*handler: 'adminPage',*/ label: '관리자 페이지', icon: FaTools }
  const rentalRequest: MenuItem = { /*handler: 'openBorrowRequestModal',*/ label: '대여 요청', icon: FaPaperPlane }
  const rentalSubmit: MenuItem = { handler: enableRentalMode, label: '대여 등록', icon: FaShare }
  const login: MenuItem = { handler: handleLogin, label: '로그인', icon: FaSignInAlt }
  const logout: MenuItem = { handler: handleLogout, label: '로그아웃', icon: FaSignOutAlt }
  const changePassword: MenuItem = { handler: handleChangePassword, label: '비밀번호 변경', icon: FaKey }
  const register: MenuItem = { handler: handleRegisterUser, label: '새 사용자 등록', icon: FaUserPlus }
  const help: MenuItem = { /* handler: 'openHelpModal', */ label: '도움말', icon: FaQuestion }
  const setCalendar: MenuItem = { handler: enableSetCalendarMode, label: '시간표 설정', icon: FaCalendarPlus }

  const menuItems: { [key in USER_TYPE]: MenuItem[] } = {
    [USER_TYPE.SUPER]: [setCalendar, register, changePassword, logout],
    [USER_TYPE.CLUB_ADMIN]: [setCalendar, rentalSubmit, changePassword, logout],
    [USER_TYPE.CLUB_MEMBER]: [changePassword, logout],
    [USER_TYPE.GUEST]: [login],
  }
  return {
    menuItems,
  }
}
