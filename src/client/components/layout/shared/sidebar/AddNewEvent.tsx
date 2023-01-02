import { DateTimePicker } from '@components/form'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

import React, { useEffect, useState } from 'react'
import { useAccount, useCalendar, useEvent, useGlobal, useWindowSize } from '@client/hooks'
import { useQuery } from 'react-query'
import { clubsQuery } from '@client/shared/queries'

import classNames from 'classnames/bind'
import styles from './style/SectionMenu.module.css'
const cx = classNames.bind(styles)

export default function AddNewEventsSlot() {
  const [timeSlotIndex, setTimeSlotIndex] = useState(0)
  const { renderNewEvents, setTimeSlots } = useCalendar()
  const { mode, date } = useGlobal()
  const { timeSlots } = useEvent()
  const { width } = useWindowSize()
  const isMobile = width <= 670
  const isRental = mode === 'rental'
  const { me } = useAccount()
  const { data } = useQuery('clubs', clubsQuery, { enabled: isRental })
  const clubs = data?.clubs?.filter(club => club.id !== me?.club?.id)
  const clubOptions = [
    ...clubs?.map(club => {
      return { label: club.name, value: club.id }
    }),
    { label: '기타', value: undefined },
  ]

  useEffect(() => {
    setTimeSlots([
      {
        start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0),
        end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0),
        title: clubs?.[0]?.name ?? '기타',
        rentalClubId: clubs?.[0].id,
        color: clubs?.[0]?.color,
      },
    ])
  }, [])

  useEffect(() => {
    renderNewEvents()
  }, [timeSlots, date])

  function handlePrevSlot() {
    setTimeSlotIndex(timeSlotIndex - 1)
  }

  function handleNextSlot() {
    if (timeSlotIndex + 1 === timeSlots?.length) {
      setTimeSlots([
        ...timeSlots,
        {
          start: timeSlots[timeSlotIndex].end,
          end: timeSlots[timeSlotIndex].end,
          title: '',
          rentalClubId: clubs?.[0].id,
        },
      ])
    }
    setTimeSlotIndex(timeSlotIndex + 1)
  }

  function handleStartTimeChange(value: Date) {
    const newSlot = [...timeSlots]
    newSlot[timeSlotIndex] = {
      ...newSlot[timeSlotIndex],
      start: value,
    }
    setTimeSlots(newSlot)
  }

  function handleEndTimeChange(value: Date) {
    const newSlot = [...timeSlots]
    newSlot[timeSlotIndex] = {
      ...newSlot[timeSlotIndex],
      end: value,
    }
    setTimeSlots(newSlot)
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newSlot = [...timeSlots]
    newSlot[timeSlotIndex] = {
      ...newSlot[timeSlotIndex],
      title: e.target.value,
    }
    setTimeSlots(newSlot)
  }

  function handleRentalClubChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value === '기타' ? undefined : parseInt(e.target.value)
    const targetClub = clubs?.find(club => club.id === value)

    const newSlot = [...timeSlots]
    newSlot[timeSlotIndex] = {
      ...newSlot[timeSlotIndex],
      title: targetClub?.name ?? '',
      rentalClubId: value,
      color: targetClub?.color,
    }
    setTimeSlots(newSlot)
  }

  return (
    <div className={cx('menu', 'padding-top')}>
      <div className={cx('header')}>
        <h2>{isRental ? '새로운 대여 등록' : '새로운 일정 등록'}</h2>
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
            <div className={cx('label')}>시작 날짜 / 시간</div>
            <DateTimePicker
              value={timeSlots[timeSlotIndex]?.start as Date}
              minuteInterval={10}
              setValue={handleStartTimeChange}
              use24Hour={isMobile}
            />
          </div>
          <div className={cx('time-picker-wrapper')}>
            <div className={cx('label')}>끝 날짜 / 시간</div>
            <DateTimePicker
              value={timeSlots[timeSlotIndex]?.end as Date}
              minuteInterval={10}
              setValue={handleEndTimeChange}
              use24Hour={isMobile}
            />
          </div>
        </div>
        <div className={cx('new-event-title')}>
          <div className={cx('label')}>{isRental ? '대여 대상' : '제목'}</div>
          {isRental && (
            <select
              className={cx('rental-club-select')}
              value={timeSlots[timeSlotIndex]?.rentalClubId}
              onChange={handleRentalClubChange}>
              {clubOptions.map(({ label, value }, idx) => (
                <option key={idx} value={value}>
                  {label}
                </option>
              ))}
            </select>
          )}
          {(!isRental || timeSlots[timeSlotIndex]?.rentalClubId === undefined) && (
            <input
              className={cx('title-input')}
              placeholder={isRental ? '타 동아리 / 단체에 뜨락을 대여합니다' : '동아리 내 새로운 일정을 설정합니다'}
              type="text"
              value={timeSlots[timeSlotIndex]?.title ?? ''}
              onChange={handleTitleChange}
            />
          )}
        </div>
      </div>
    </div>
  )
}
