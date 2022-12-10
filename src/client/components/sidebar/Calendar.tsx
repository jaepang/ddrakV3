import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

import { useState, useEffect } from 'react'
import { useCalendar } from '@client/hooks'
import { isSameDate } from '@client/utils'

import classNames from 'classnames/bind'
import styles from './style/Calendar.module.css'
const cx = classNames.bind(styles)

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface Props {
  setShowSidebar?: (show: boolean) => void
  isInForm?: boolean
  value?: Date
  setValue?: (date: Date) => void
}

export default function Calendar({ setShowSidebar, isInForm = false, value, setValue }: Props) {
  const { date: globalDate, handleGoToDate } = useCalendar()
  const [date, setDate] = useState(globalDate)
  const year = date.getFullYear()
  const month = date.getMonth()

  const firstDay = new Date(new Date(date).setDate(1)).getDay()
  const prevPadding = firstDay > 0 ? firstDay - 1 : 6
  const prevMonthLength = new Date(year, month, 0).getDate()

  const lastDay = new Date(year, month + 1, 0).getDay()
  const nextPadding = 6 - (lastDay > 0 ? lastDay - 1 : 5)

  useEffect(() => {
    !isInForm && setDate(globalDate)
  }, [globalDate])

  useEffect(() => {
    if (isInForm && value) {
      setDate(value)
    }
  }, [value])

  function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const year = Number(e.target.value)
    const newDate = new Date(date)
    newDate.setFullYear(year)
    setDate(newDate)
    setShowSidebar?.(false)
  }

  function handleMonthForward() {
    const newDate = new Date(date)
    newDate.setMonth(month + 1)
    setDate(newDate)
  }

  function handleMonthBackward() {
    const newDate = new Date(date)
    newDate.setMonth(month - 1)
    setDate(newDate)
  }

  function handleChangeDate(date: Date) {
    setDate(date)
    isInForm ? setValue(date) : handleGoToDate(date)
    setShowSidebar?.(false)
  }

  return (
    <div className={cx('calendar', { datetime: isInForm })}>
      <div className={cx('header')}>
        <div className={cx('left')}>
          <div className={cx('icon-wrapper')}>
            <IoChevronBack size={!isInForm ? 25 : 16} onClick={handleMonthBackward} />
          </div>
          <h2>{date.toLocaleString('en-Us', { month: 'long' })}</h2>
          <div className={cx('icon-wrapper')}>
            <IoChevronForward size={!isInForm ? 25 : 16} onClick={handleMonthForward} />
          </div>
        </div>
        <div className={cx('select-wrapper')}>
          <select value={date.getFullYear()} onChange={handleYearChange}>
            {Array.from({ length: 10 }, (_, i) => {
              const year = date.getFullYear() - 5 + i
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            })}
          </select>
        </div>
      </div>
      <div className={cx('body')}>
        <div className={cx('thead')}>
          {weekdays.map(day => (
            <div key={day} className={cx('day', 'head')}>
              {day}
            </div>
          ))}
        </div>
        <div className={cx('tbody')}>
          {Array.from({ length: prevPadding }, (_, i) => {
            const currDate = new Date(year, month, 1)
            currDate.setDate(i + 1 - prevPadding)

            return (
              <div key={currDate.getDate()} onClick={() => handleChangeDate(currDate)} className={cx('day', 'padding')}>
                <div className={cx('inner')}>{prevMonthLength - prevPadding + i + 1}</div>
              </div>
            )
          })}
          {Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => {
            const currDate = new Date(year, month, i + 1)
            const day = currDate.getDate()

            return (
              <div
                className={cx('day', 'active', {
                  current: isSameDate(currDate, isInForm ? value : globalDate),
                  today: isSameDate(currDate, new Date()),
                  sunday: currDate.getDay() === 0,
                })}
                onClick={() => handleChangeDate(currDate)}
                key={`c${day}`}>
                <div className={cx('inner')}>
                  {day}
                  <div className={cx('today-dot')} />
                </div>
              </div>
            )
          })}
          {Array.from({ length: nextPadding }, (_, i) => {
            const currDate = new Date(year, month + 1, i + 1)
            return (
              <div key={currDate.getDate()} onClick={() => handleChangeDate(currDate)} className={cx('day', 'padding')}>
                <div className={cx('inner')}>{i + 1}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
