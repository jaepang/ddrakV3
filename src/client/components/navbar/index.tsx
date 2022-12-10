import Link from 'next/link'
import WeekNavigator from './WeekNavigator'
import SwitchCalendarButtons from '@components/SwitchCalendarButtons'
import { IoIosMenu } from 'react-icons/io'
import { calendarHeaderDateString } from '@client/utils'

import { useAccount, useGlobal } from '@client/hooks'
import { PATHNAME } from '@client/consts'

import classNames from 'classnames/bind'
import styles from './style/Navbar.module.css'
const cx = classNames.bind(styles)

interface Props {
  isMobile: boolean
  setShowSidebar: (showSidebar: boolean) => void
}

export default function Navbar({ isMobile, setShowSidebar }: Props) {
  const { isLoggedIn, me, logout } = useAccount()
  const { date, mode, enableDefaultMode } = useGlobal()
  const dateString = calendarHeaderDateString(date, isMobile)

  function handleLogout() {
    logout()
    enableDefaultMode()
  }

  return (
    <div className={cx('navbar')}>
      <div className={cx('content-wrapper')}>
        <div className={cx('left-area')}>
          <WeekNavigator />
          <h2 className={cx('date')}>
            {dateString} {mode === 'setCalendar' && <div className={cx('preview')}>Preview</div>}
          </h2>
        </div>
        <div className={cx('right-area')}>
          {!isMobile && isLoggedIn && me?.club && mode !== 'setCalendar' && <SwitchCalendarButtons />}
          {isMobile ? (
            <div className={cx('icon-wrapper')} onClick={() => setShowSidebar(true)}>
              <IoIosMenu size={35} />
            </div>
          ) : isLoggedIn ? (
            <button className={cx('account-button')} onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link href={PATHNAME.LOGIN}>
              <div className={cx('account-button')}>Login</div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
