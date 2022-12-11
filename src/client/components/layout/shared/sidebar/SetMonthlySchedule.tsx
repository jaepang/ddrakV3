import { TimePicker } from '@components/form'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

import { useEffect, useState } from 'react'
import { useCalendar, useEvent, useGlobal } from '@client/hooks'
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
  const { renderMonthlyEvents, setTimeSlots } = useCalendar()
  const { timeSlots } = useEvent()
  const { date } = useGlobal()
  const { data } = useQuery('clubs', clubsQuery)
  const { clubs } = data ?? {}

  useEffect(() => {
    setTimeSlots([
      {
        start: '00:00',
        end: '00:00',
        club: ['', '', '', '', '', '', ''],
      },
    ])
  }, [])

  useEffect(() => {
    renderMonthlyEvents(clubs)
  }, [timeSlots, clubs, date])

  function handlePrevSlot() {
    setTimeSlotIndex(timeSlotIndex - 1)
  }

  function handleNextSlot() {
    if (timeSlotIndex + 1 === timeSlotLength) {
      setTimeSlotLength(timeSlotLength + 1)
      setTimeSlots([
        ...timeSlots,
        {
          start: timeSlots[timeSlotIndex].end,
          end: timeSlots[timeSlotIndex].end,
          club: ['', '', '', '', '', '', ''],
        },
      ])
    }
    setTimeSlotIndex(timeSlotIndex + 1)
  }

  function handleClickClub(day: number, clubName: string) {
    const newSlot = [...timeSlots]
    const newClub = [...newSlot[timeSlotIndex].club]
    newClub[day] = clubName
    newSlot[timeSlotIndex] = {
      ...newSlot[timeSlotIndex],
      club: newClub,
    }
    setTimeSlots(newSlot)
  }

  function handleStartTimeChange(value: string) {
    const newSlot = [...timeSlots]
    const [hour, minute] = value.split(':')
    newSlot[timeSlotIndex] = {
      ...newSlot[timeSlotIndex],
      start: [leftPadZero(hour), leftPadZero(minute)].join(':'),
    }
    setTimeSlots(newSlot)
  }

  function handleEndTimeChange(value: string) {
    const newSlot = [...timeSlots]
    const [hour, minute] = value.split(':')
    newSlot[timeSlotIndex] = {
      ...newSlot[timeSlotIndex],
      end: [leftPadZero(hour), leftPadZero(minute)].join(':'),
    }
    setTimeSlots(newSlot)
  }

  return (
    <div className={cx('menu', 'padding-top')}>
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
            <TimePicker
              value={timeSlots[timeSlotIndex]?.start as string}
              minuteInterval={10}
              setValue={handleStartTimeChange}
            />
          </div>
          <div className={cx('time-picker-wrapper')}>
            <div className={cx('label')}>End Time</div>
            <TimePicker
              value={timeSlots[timeSlotIndex]?.end as string}
              minuteInterval={10}
              setValue={handleEndTimeChange}
            />
          </div>
        </div>
        <div className={cx('time-slots')}>
          {tableHeader.map((day, index) => (
            <div key={day} className={cx('time-slot')}>
              <div className={cx('day')}>{day}</div>
              {clubs?.map(club => (
                <button
                  key={club.name}
                  disabled={timeSlots[timeSlotIndex].club[index] === club.name}
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
