import Calendar from '@components/sidebar/Calendar'
import { TbCalendarTime } from 'react-icons/tb'

import { useState, useEffect } from 'react'
import { useOutsideClickHandler } from '@client/hooks'

import classNames from 'classnames/bind'
import styles from './style/TimePicker.module.css'
const cx = classNames.bind(styles)

interface Props {
  value: Date
  setValue: (value: Date) => void
  hourInterval?: number
  minuteInterval?: number
  use24Hour?: boolean
}

export default function DateTimePicker({
  value,
  setValue,
  hourInterval,
  minuteInterval = 10,
  use24Hour = false,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [meridiem, setMeridiem] = useState<'AM' | 'PM'>('AM')
  const dropdownDom = useOutsideClickHandler<HTMLDivElement>(() => setShowDropdown(false), [setShowDropdown])

  /** Synchronize value and local state */
  useEffect(() => {
    const meridiem = value.getHours() >= 12 ? 'PM' : 'AM'
    setMeridiem(meridiem)
  }, [value])

  function handleDateChange(date: Date) {
    setValue(new Date(new Date(date).setHours(value.getHours(), value.getMinutes())))
  }

  function handleHourChange(hour: number) {
    const hour24 = hour + (meridiem === 'PM' ? 12 : 0)
    setValue(new Date(new Date(value).setHours(hour24)))
  }

  function handleMinuteChange(minute: number) {
    setValue(new Date(new Date(value).setMinutes(minute)))
  }

  function handleMeridiemChange(newMeridiem: 'AM' | 'PM') {
    const hour24 = value.getHours() + (newMeridiem === 'PM' ? 12 : -12)
    setMeridiem(newMeridiem)
    setValue(new Date(new Date(value).setHours(hour24)))
  }

  return (
    <div className={cx('root')} onClick={() => setShowDropdown(true)} ref={dropdownDom}>
      <div className={cx('input')}>
        <div className={cx('data')}>
          {value?.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short', hour12: false })}
        </div>
        <div className={cx('icon-wrapper')}>
          <TbCalendarTime size={15} />
        </div>
      </div>
      <div className={cx('dropdown', 'datetime', { show: showDropdown })}>
        <div className={cx('dropdown-column')}>
          <div className={cx('calendar')}>
            <Calendar isInForm value={value} setValue={handleDateChange} />
          </div>
        </div>
        <div className={cx('dropdown-column')}>
          {Array.from({ length: hourInterval ? Math.ceil(12 / hourInterval) : 12 }, (_, idx) =>
            hourInterval ? (idx + 1) * hourInterval : idx + 1,
          ).map(hour => {
            const hourString = hour.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

            return (
              <div
                key={hour}
                className={cx('dropdown-item', {
                  selected: hour === (value?.getHours() > 12 ? value?.getHours() - 12 : value?.getHours()),
                })}
                onClick={() => handleHourChange(hour)}>
                {hourString}
              </div>
            )
          })}
        </div>
        <div className={cx('dropdown-column')}>
          {Array.from({ length: minuteInterval ? Math.ceil(60 / minuteInterval) : 60 }, (_, idx) =>
            minuteInterval ? idx * minuteInterval : idx,
          ).map(minute => {
            const minuteString = minute.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

            return (
              <div
                key={minute}
                className={cx('dropdown-item', {
                  selected: minute === value?.getMinutes(),
                })}
                onClick={() => handleMinuteChange(minute)}>
                {minuteString}
              </div>
            )
          })}
        </div>
        {!use24Hour && (
          <div className={cx('dropdown-column')}>
            <div
              className={cx('dropdown-item', 'top-right', {
                selected: meridiem === 'AM',
              })}
              onClick={() => handleMeridiemChange('AM')}>
              {'AM'}
            </div>
            <div
              className={cx('dropdown-item', {
                selected: meridiem === 'PM',
              })}
              onClick={() => handleMeridiemChange('PM')}>
              {'PM'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}