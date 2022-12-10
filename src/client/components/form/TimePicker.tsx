import { AiOutlineClockCircle } from 'react-icons/ai'

import { useState, useEffect } from 'react'
import { useOutsideClickHandler } from '@client/hooks'

import classNames from 'classnames/bind'
import styles from './style/TimePicker.module.css'
const cx = classNames.bind(styles)

interface Props {
  value: string
  setValue: (value: string) => void
  hourInterval?: number
  minuteInterval?: number
  use24Hour?: boolean
}

export default function TimePicker({ value, setValue, hourInterval, minuteInterval = 10, use24Hour = false }: Props) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [meridiem, setMeridiem] = useState<'AM' | 'PM'>('AM')
  const [hour, setHour] = useState<string>('00')
  const [minute, setMinute] = useState<string>('00')
  const dropdownDom = useOutsideClickHandler<HTMLDivElement>(() => setShowDropdown(false), [setShowDropdown])

  /** Synchronize value and local state */
  useEffect(() => {
    const [hour, minute] = value?.split(':') ?? ['00', '00']
    const hour24 = parseInt(hour)
    const meridiem = hour24 >= 12 ? 'PM' : 'AM'
    const hour12 = hour24 > 12 ? hour24 - 12 : hour24

    setHour(hour12.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }))
    setMinute(minute)
    setMeridiem(meridiem)
  }, [value])

  function handleHourChange(hour: string) {
    const hour24 = parseInt(hour) + (meridiem === 'PM' ? 12 : 0)
    setValue(`${hour24}:${minute}`)
  }

  function handleMinuteChange(minute: string) {
    setValue(`${hour}:${minute}`)
  }

  function handleMeridiemChange(meridiem: 'AM' | 'PM') {
    const hour24 = parseInt(hour) + (meridiem === 'PM' ? 12 : 0)
    setValue(`${hour24}:${minute}`)
  }

  return (
    <div className={cx('root')} onClick={() => setShowDropdown(true)} ref={dropdownDom}>
      <div className={cx('input')}>
        <div className={cx('data')}>
          <input type="text" value={hour} onChange={e => handleHourChange(e.target.value)} placeholder="--" />
          {':'}
          <input type="text" value={minute} onChange={e => handleMinuteChange(e.target.value)} placeholder="--" />
          {!use24Hour && <div className={cx('meridiem')}>{meridiem ?? '--'}</div>}
        </div>
        <div className={cx('icon-wrapper')}>
          <AiOutlineClockCircle size={15} />
        </div>
      </div>
      <div className={cx('dropdown', { show: showDropdown })}>
        <div className={cx('dropdown-column')}>
          {Array.from({ length: hourInterval ? Math.ceil(12 / hourInterval) : 12 }, (_, idx) =>
            hourInterval ? (idx + 1) * hourInterval : idx + 1,
          ).map(h => {
            const hourString = h.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

            return (
              <div
                key={h}
                className={cx('dropdown-item', 'hour', {
                  selected: h === parseInt(hour),
                })}
                onClick={() => handleHourChange(hourString)}>
                {hourString}
              </div>
            )
          })}
        </div>
        <div className={cx('dropdown-column')}>
          {Array.from({ length: minuteInterval ? Math.ceil(60 / minuteInterval) : 60 }, (_, idx) =>
            minuteInterval ? idx * minuteInterval : idx,
          ).map(m => {
            const minuteString = m.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

            return (
              <div
                key={m}
                className={cx('dropdown-item', {
                  selected: m === parseInt(minute),
                })}
                onClick={() => handleMinuteChange(minuteString)}>
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
