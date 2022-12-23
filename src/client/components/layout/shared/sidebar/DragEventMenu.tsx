import { useEffect, useState } from 'react'
import { useAccount, useCalendar } from '@client/hooks'
import { useQuery } from 'react-query'
import { clubsQuery } from '@client/shared/queries'

import classNames from 'classnames/bind'
import styles from './style/SectionMenu.module.css'
const cx = classNames.bind(styles)

const clubEvents = [
  {
    name: '합주',
    color: '#f76e11',
  },
  {
    name: '공연',
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
      <h2 className={cx('header')}>원하는 시간으로 드래그하세요</h2>
      <div className={cx('drag-event-menu-body')}>
        <div className={cx('duration-select')}>
          <h3>길이</h3>
          <div className={cx('duration-select-body')}>
            <select name="hour" value={duration.hour} onChange={handleDurationChange}>
              {Array.from(Array(24).keys()).map(hour => (
                <option key={hour} value={hour}>
                  {hour}시간
                </option>
              ))}
            </select>
          </div>
          <div className={cx('duration-select-body')}>
            <select name="minute" value={duration.minute} onChange={handleDurationChange}>
              <option value={0}>0분</option>
              <option value={30}>30분</option>
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
