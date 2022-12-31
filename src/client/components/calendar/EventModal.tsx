import { EventApi } from '@fullcalendar/common'
import { DateTimePicker } from '@components/form'
import { GrClose } from 'react-icons/gr'
import { TbCalendarEvent, TbClock } from 'react-icons/tb'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-query'
import { userQuery, updateEventMutation, deleteEventMutation } from '@client/shared/queries'
import { useAccount, useWindowSize } from '@client/hooks'
import { isSameDate, isSameDateTime } from '@client/utils'

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
  })
  const { me } = useAccount()
  const { width } = useWindowSize()
  const isMobile = width <= 1024
  const { data } = useQuery(['user', { id: event?.extendedProps?.creatorId }], userQuery, { enabled: !!event })
  const creator = data?.user
  const clubId = event?.extendedProps?.clubId

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

  /** editable events: events created by club admin */
  const editable = me?.isAdmin && !creator?.isSuper && (clubId === me?.club?.id || creator?.id === me?.id)

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
      })
    }
  }, [event])

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

  function handleDateChange(name: string, date: Date) {
    setFormState(prev => ({ ...prev, [name]: date }))
  }

  return (
    <div className={cx('root')}>
      <div className={cx('header')}>
        {editable ? (
          <div className={cx('head-wrapper')}>
            <h1>이벤트 수정</h1>
            <button className={cx('delete-button')} onClick={handleDelete}>
              삭제
            </button>
          </div>
        ) : (
          <h1>{event?.title}</h1>
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
