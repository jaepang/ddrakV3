import { DateTimePicker } from '@components/form'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

import { useEffect, useState } from 'react'
import { useCalendar } from '@client/hooks'

import classNames from 'classnames/bind'
import styles from './style/SectionMenu.module.css'
const cx = classNames.bind(styles)

interface Props {
  isRental?: boolean
}

export default function AddNewEventsSlot({ isRental = false }: Props) {
  const [timeSlotLength, setTimeSlotLength] = useState(1)
  const [timeSlotIndex, setTimeSlotIndex] = useState(0)
  const [timeSlot, setTimeSlot] = useState([
    {
      start: new Date(),
      end: new Date(),
      title: '',
    },
  ])
  const { date, renderNewEvents } = useCalendar()

  useEffect(() => {
    renderNewEvents(timeSlot)
  }, [timeSlot, date])

  function handlePrevSlot() {
    setTimeSlotIndex(timeSlotIndex - 1)
  }

  function handleNextSlot() {
    if (timeSlotIndex + 1 === timeSlotLength) {
      setTimeSlotLength(timeSlotLength + 1)
      timeSlot.push({
        start: timeSlot[timeSlotIndex].end,
        end: timeSlot[timeSlotIndex].end,
        title: '',
      })
    }
    setTimeSlotIndex(timeSlotIndex + 1)
  }

  function handleStartTimeChange(value: Date) {
    setTimeSlot(prev => {
      const newSlot = [...prev]
      newSlot[timeSlotIndex].start = value
      return newSlot
    })
  }

  function handleEndTimeChange(value: Date) {
    setTimeSlot(prev => {
      const newSlot = [...prev]
      newSlot[timeSlotIndex].end = value
      return newSlot
    })
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTimeSlot(prev => {
      const newSlot = [...prev]
      newSlot[timeSlotIndex].title = e.target.value
      return newSlot
    })
  }

  return (
    <div className={cx('menu')}>
      <div className={cx('header')}>
        <h2>{isRental ? 'Add New Rental' : 'Add New Event'}</h2>
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
            <div className={cx('label')}>Start Date / Time</div>
            <DateTimePicker
              value={timeSlot[timeSlotIndex].start}
              minuteInterval={10}
              setValue={handleStartTimeChange}
            />
          </div>
          <div className={cx('time-picker-wrapper')}>
            <div className={cx('label')}>End Date / Time</div>
            <DateTimePicker value={timeSlot[timeSlotIndex].end} minuteInterval={10} setValue={handleEndTimeChange} />
          </div>
        </div>
        <div className={cx('new-event-title')}>
          <div className={cx('label')}>Title</div>
          <input
            className={cx('title-input')}
            placeholder="New Event"
            type="text"
            value={timeSlot[timeSlotIndex].title}
            onChange={handleTitleChange}
          />
        </div>
      </div>
    </div>
  )
}
