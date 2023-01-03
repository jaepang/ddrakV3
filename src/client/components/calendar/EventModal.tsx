import { EventApi } from '@fullcalendar/common'
import { DateTimePicker } from '@components/form'
import { GrClose } from 'react-icons/gr'
import { TbCalendarEvent, TbClock } from 'react-icons/tb'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-query'
import { userQuery, clubsQuery, updateEventMutation, deleteEventMutation } from '@client/shared/queries'
import { useAccount, useWindowSize } from '@client/hooks'
import { isSameDateTime } from '@client/utils'

import classNames from 'classnames/bind'
import styles from './style/EventModal.module.css'
import { queryClient } from '@client/shared/react-query'
const cx = classNames.bind(styles)

interface Props {
  event: EventApi
  onClose: () => void
}

export default function EventModal({ event, onClose }: Props) {
  const [formState, setFormState] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    clubId: undefined,
  })
  const [showRentalTooltip, setShowRentalTooltip] = useState(false)
  const { me } = useAccount()
  const { width } = useWindowSize()
  const isMobile = width <= 1024
  const { data: creatorData } = useQuery(['user', { id: event?.extendedProps?.creatorId }], userQuery, {
    enabled: !!event,
  })
  const creator = creatorData?.user

  const { data: clubsData } = useQuery(['club', { id: event?.extendedProps?.clubId }], clubsQuery, { enabled: !!event })
  const clubId = event?.extendedProps?.clubId
  const { clubs } = clubsData ?? {}
  const club = clubs?.find(club => club.id === clubId)
  const clubsWithoutMe = clubs?.filter(club => club.id !== me?.club?.id)

  const { mutate: updateEvent } = useMutation(updateEventMutation, {
    onSuccess: () => {
      queryClient.refetchQueries(['events'])
      onClose()
    },
  })

  const { mutate: deleteEvent } = useMutation(deleteEventMutation, {
    onSuccess: () => {
      queryClient.refetchQueries(['events'])
      onClose()
    },
  })

  const editable = me?.isAdmin && !creator?.isSuper && (clubId === me?.club?.id || creator?.id === me?.id)
  const isRental = event?.extendedProps?.isRental

  const clubOptions = isRental && [
    ...clubsWithoutMe?.map(club => {
      return { label: club.name, value: club.id }
    }),
    { label: '기타', value: undefined },
  ]

  const changed =
    !isSameDateTime(new Date(event?.start), formState.start) ||
    !isSameDateTime(new Date(event?.end), formState.end) ||
    event?.title !== formState.title

  useEffect(() => {
    if (event) {
      setFormState({
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        clubId: club?.id,
      })
    }
  }, [event, club])

  function handleSubmit() {
    updateEvent({
      id: parseInt(event?.id),
      eventInput: {
        title: formState.title,
        start: formState.start,
        end: formState.end,
      },
    })
  }

  function handleDelete() {
    if (confirm('정말 삭제하시겠습니까?')) deleteEvent({ id: parseInt(event?.id) })
  }

  function handleFormStateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  function handleRentalClubChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value === '기타' ? undefined : parseInt(e.target.value)
    setFormState(prev => ({
      ...prev,
      title: value ? clubs.find(club => club.id === value)?.name : '기타',
      clubId: value,
    }))
  }

  function handleDateChange(name: string, date: Date) {
    setFormState(prev => ({ ...prev, [name]: date }))
  }

  return (
    <div className={cx('root')}>
      <div className={cx('header')}>
        {editable ? (
          <div className={cx('head-wrapper', 'editable')}>
            <h1>이벤트 수정</h1>
            <button className={cx('delete-button')} onClick={handleDelete}>
              삭제
            </button>
          </div>
        ) : (
          <div className={cx('head-wrapper')}>
            <h1>{event?.title}</h1>
            {isRental && (
              <>
                <div
                  onMouseEnter={() => setShowRentalTooltip(true)}
                  onMouseLeave={() => setShowRentalTooltip(false)}
                  className={cx('rental-badge')}>
                  대여
                  {showRentalTooltip && (
                    <div className={cx('rental-tooltip')}>
                      {creator?.club?.name}
                      {' → '}
                      {club?.name ?? event?.title}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        <div className={cx('close')} onClick={onClose}>
          <GrClose size={30} />
        </div>
      </div>
      <div className={cx('body')}>
        {editable && (
          <div className={cx('row')}>
            <div className={cx('item-wrapper')}>
              <div className={cx('label')}>제목</div>
              <input
                className={cx('title', 'input')}
                type="text"
                name="title"
                value={formState.title}
                onChange={handleFormStateChange}
              />
            </div>
            {isRental && (
              <div className={cx('item-wrapper')}>
                <div className={cx('label')}>대여 대상</div>
                <select
                  className={cx('select')}
                  name={'clubId'}
                  value={formState.clubId}
                  onChange={handleRentalClubChange}>
                  {clubOptions.map(({ label, value }, idx) => (
                    <option key={idx} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
        <div className={cx('row')}>
          {editable ? (
            <>
              <div className={cx('item-wrapper')}>
                <div className={cx('label')}>시작</div>
                <DateTimePicker
                  rightAlignDropdown={isMobile}
                  value={formState.start}
                  setValue={date => handleDateChange('start', date)}
                  use24Hour={isMobile}
                />
              </div>
              <div className={cx('item-wrapper')}>
                <div className={cx('label')}>끝</div>
                <DateTimePicker
                  rightAlignDropdown={isMobile}
                  value={formState.end}
                  setValue={date => handleDateChange('end', date)}
                  use24Hour={isMobile}
                />
              </div>
            </>
          ) : (
            <>
              <div className={cx('item-wrapper')}>
                <div className={cx('item')}>
                  <TbCalendarEvent size={20} />
                  {new Date(event?.start).toLocaleString('ko-kr', {
                    dateStyle: 'long',
                  })}
                </div>
              </div>
              <div className={cx('item-wrapper')}>
                <div className={cx('item')}>
                  <TbClock size={20} />
                  {new Date(event?.start).toLocaleString('ko-kr', {
                    timeStyle: 'short',
                  })}
                  {' - '}
                  {new Date(event?.end).toLocaleString('ko-kr', {
                    timeStyle: 'short',
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {editable && (
        <div className={cx('footer')}>
          <button className={cx('button', 'success')} disabled={!changed} onClick={handleSubmit}>
            적용
          </button>
          <button className={cx('button', 'cancel')} onClick={onClose}>
            취소
          </button>
        </div>
      )}
    </div>
  )
}
