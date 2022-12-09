import Link from 'next/link'
import WeekNavigator from './WeekNavigator'
import { IoIosMenu } from 'react-icons/io'
import { calendarHeaderDateString } from '@client/utils'

import { useAccount, useCalendar } from '@client/hooks'
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
  const { date, mode, enableDefaultMode, enableClubCalendarMode } = useCalendar()
  const dateString = calendarHeaderDateString(date, isMobile)

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
          {isLoggedIn && me?.club && (
            <div className={cx('switch-calendar-buttons')}>
              <button disabled={mode === 'default'} className={cx('button', 'left')} onClick={enableDefaultMode}>
                default
              </button>
              <button
                disabled={mode === 'clubCalendar'}
                className={cx('button', 'right', { active: mode === 'clubCalendar' })}
                onClick={enableClubCalendarMode}>
                club
              </button>
            </div>
          )}
          {isMobile ? (
            <div className={cx('icon-wrapper')} onClick={() => setShowSidebar(true)}>
              <IoIosMenu size={35} />
            </div>
          ) : isLoggedIn ? (
            <button className={cx('account-button')} onClick={logout}>
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
