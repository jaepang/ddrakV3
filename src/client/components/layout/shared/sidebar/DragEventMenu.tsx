import { useEffect, useState } from 'react'
import { useAccount, useCalendar } from '@client/hooks'
import { useQuery } from 'react-query'
import { clubsQuery } from '@client/shared/queries'

import classNames from 'classnames/bind'
import styles from './style/SectionMenu.module.css'
const cx = classNames.bind(styles)

const clubEvents = [
  {
    name: 'practice',
    color: '#f76e11',
  },
  {
    name: 'performance',
    color: '#79A3F4',
  },
]

export default function DragEventMenu() {
  const [duration, setDuration] = useState({
    hour: 2,
    minute: 0,
  })
  const { isLoggedIn, me } = useAccount()
  const { setDraggableDuration } = useCalendar()
  const { data } = useQuery('clubs', clubsQuery, { enabled: isLoggedIn && me?.isSuper })
  const { clubs } = data ?? {}

  function handleDurationChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target
    setDuration(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    setDraggableDuration(
      `${duration.hour.toLocaleString('ko-kr', {
        minimumIntegerDigits: 2,
      })}:${duration.minute.toLocaleString('ko-kr', {
        minimumIntegerDigits: 2,
      })}`,
    )
  }, [duration])

  return (
    <div className={cx('menu')}>
      <h2 className={cx('header')}>Drag Event to Calendar</h2>
      <div className={cx('drag-event-menu-body')}>
        <div className={cx('duration-select')}>
          <h3>Duration:</h3>
          <div className={cx('duration-select-body')}>
            <select name="hour" value={duration.hour} onChange={handleDurationChange}>
              {Array.from(Array(24).keys()).map(hour => (
                <option key={hour} value={hour}>
                  {hour} Hour
                </option>
              ))}
            </select>
          </div>
          <div className={cx('duration-select-body')}>
            <select name="minute" value={duration.minute} onChange={handleDurationChange}>
              <option value={0}>0 Minute</option>
              <option value={30}>30 Minutes</option>
            </select>
          </div>
        </div>
        <div id="draggable-events" className={cx('draggable-events')}>
          {me?.isSuper
            ? clubs?.map(club => (
                <div
                  key={club.name}
                  draggable
                  style={{
                    backgroundColor: club.color,
                  }}
                  className={cx('draggable-event')}>
                  {club.name}
                </div>
              ))
            : clubEvents.map(event => (
                <div
                  key={event.name}
                  draggable
                  style={{
                    backgroundColor: event.color,
                  }}
                  className={cx('draggable-event')}>
                  {event.name}
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}
