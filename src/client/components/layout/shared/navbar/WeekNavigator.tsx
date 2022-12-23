import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import { useAccount, useCalendar, useGlobal } from '@client/hooks'
import { isSameDate, findFirstMondayOfMonth } from '@client/utils'

import classNames from 'classnames/bind'
import styles from './style/Navbar.module.css'
const cx = classNames.bind(styles)

export default function WeekNavigator() {
  const { handlePrevWeek, handleNextWeek, handleToday, handleGoToDate } = useCalendar()
  const { date, mode } = useGlobal()
  const { me } = useAccount()
  const adminTimeSetMode = mode === 'setCalendar' && me?.isSuper
  const disableTodayButton = adminTimeSetMode ? date.getMonth() === new Date().getMonth() : isSameDate(date, new Date())

  function handleNextMonth() {
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    handleGoToDate(findFirstMondayOfMonth(nextMonth))
  }

  function handlePrevMonth() {
    const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1)
    handleGoToDate(findFirstMondayOfMonth(prevMonth))
  }

  return (
    <div className={cx('week-navigator')}>
      <button disabled={disableTodayButton} onClick={handleToday} className={cx('today')}>
        {adminTimeSetMode ? '이번 달' : '오늘'}
      </button>
      <div onClick={adminTimeSetMode ? handlePrevMonth : handlePrevWeek} className={cx('button', 'back')}>
        <IoChevronBackOutline size={25} />
      </div>
      <div onClick={adminTimeSetMode ? handleNextMonth : handleNextWeek} className={cx('button', 'forward')}>
        <IoChevronForwardOutline size={25} />
      </div>
    </div>
  )
}
