import { TimePicker } from '@components/form'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

import { useEffect, useState } from 'react'
import { useCalendar } from '@client/hooks'
import { useQuery } from 'react-query'
import { clubsQuery } from '@client/shared/queries'
import { leftPadZero } from '@client/utils'

import classNames from 'classnames/bind'
import styles from './style/SectionMenu.module.css'
const cx = classNames.bind(styles)

const tableHeader = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function SetMonthlyScheduleSlot() {
  const [timeSlotLength, setTimeSlotLength] = useState(1)
  const [timeSlotIndex, setTimeSlotIndex] = useState(0)
  const [timeSlot, setTimeSlot] = useState([
    {
      start: '00:00',
      end: '00:00',
      club: ['', '', '', '', '', '', ''],
    },
  ])
  const { date, renderMonthlyEvents } = useCalendar()
  const { data } = useQuery('clubs', clubsQuery)
  const { clubs } = data ?? {}

  useEffect(() => {
    renderMonthlyEvents(timeSlot, clubs)
  }, [timeSlot, clubs, date])

  function handlePrevSlot() {
    setTimeSlotIndex(timeSlotIndex - 1)
  }

  function handleNextSlot() {
    if (timeSlotIndex + 1 === timeSlotLength) {
      setTimeSlotLength(timeSlotLength + 1)
      timeSlot.push({
        start: timeSlot[timeSlotIndex].end,
        end: timeSlot[timeSlotIndex].end,
        club: ['', '', '', '', '', '', ''],
      })
    }
    setTimeSlotIndex(timeSlotIndex + 1)
  }

  function handleClickClub(day: number, clubName: string) {
    setTimeSlot(prev => {
      const newSlot = [...prev]
      newSlot[timeSlotIndex].club[day] = clubName
      return newSlot
    })
  }

  function handleStartTimeChange(value: string) {
    setTimeSlot(prev => {
      const newSlot = [...prev]
      const [hour, minute] = value.split(':')
      newSlot[timeSlotIndex].start = [leftPadZero(hour), leftPadZero(minute)].join(':')
      return newSlot
    })
  }

  function handleEndTimeChange(value: string) {
    setTimeSlot(prev => {
      const newSlot = [...prev]
      const [hour, minute] = value.split(':')
      newSlot[timeSlotIndex].end = [leftPadZero(hour), leftPadZero(minute)].join(':')
      return newSlot
    })
  }

  return (
    <div className={cx('menu')}>
      <div className={cx('header')}>
        <h2>Set Monthly Schedule</h2>
        <div className={cx('buttons')}>
          <button onClick={handlePrevSlot} disabled={timeSlotIndex === 0} className={cx('icon-wrapper', 'back')}>
            <IoChevronBack size={20} />
          </button>
          <button onClick={handleNextSlot} className={cx('icon-wrapper', 'forward')}>
            <IoChevronForward size={20} />
          </button>
        </div>
      </div>
      <div className={cx('time-slots-body')}>
        <div className={cx('time-slots-header')}>
          <div className={cx('time-picker-wrapper')}>
            <div className={cx('label')}>Start Time</div>
            <TimePicker value={timeSlot[timeSlotIndex].start} minuteInterval={10} setValue={handleStartTimeChange} />
          </div>
          <div className={cx('time-picker-wrapper')}>
            <div className={cx('label')}>End Time</div>
            <TimePicker value={timeSlot[timeSlotIndex].end} minuteInterval={10} setValue={handleEndTimeChange} />
          </div>
        </div>
        <div className={cx('time-slots')}>
          {tableHeader.map((day, index) => (
            <div key={day} className={cx('time-slot')}>
              <div className={cx('day')}>{day}</div>
              {clubs?.map(club => (
                <button
                  key={club.name}
                  disabled={timeSlot[timeSlotIndex].club[index] === club.name}
                  onClick={() => handleClickClub(index, club.name)}
                  className={cx('club')}>
                  <div className={cx('inner')}>{club.name[0]}</div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
