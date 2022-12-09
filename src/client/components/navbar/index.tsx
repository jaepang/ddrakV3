import WeekNavigator from './WeekNavigator'
import { IoIosMenu } from 'react-icons/io'
import { calendarHeaderDateString } from '@client/utils'
import dynamic from 'next/dynamic'
const AccountMenu = dynamic(() => import('./AccountMenu'), { ssr: false })

import { useCalendar } from '@client/hooks'

import classNames from 'classnames/bind'
import styles from './style/Navbar.module.css'
const cx = classNames.bind(styles)

interface Props {
  isMobile: boolean
  setShowSidebar: (showSidebar: boolean) => void
}

export default function Navbar({ isMobile, setShowSidebar }: Props) {
  const { date, mode } = useCalendar()
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
          {isMobile ? (
            <div className={cx('icon-wrapper')} onClick={() => setShowSidebar(true)}>
              <IoIosMenu size={35} />
            </div>
          ) : (
            <AccountMenu />
          )}
        </div>
      </div>
    </div>
  )
}
