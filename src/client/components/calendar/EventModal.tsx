import { DateTimePicker } from '@components/form'
import { GrClose } from 'react-icons/gr'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-query'
import { eventQuery, updateEventMutation } from '@client/shared/queries'
import { useAccount, useWindowSize } from '@client/hooks'
import { isSameDateTime } from '@client/utils'

import classNames from 'classnames/bind'
import styles from './style/EventModal.module.css'
import { queryClient } from '@client/shared/react-query'
const cx = classNames.bind(styles)

interface Props {
  eventId: string | number
  onClose: () => void
}

export default function EventModal({ eventId, onClose }: Props) {
  const [formState, setFormState] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
  })

  const { me } = useAccount()
  const { width } = useWindowSize()
  const isMobile = width <= 1024
  const { data } = useQuery(['event', { id: eventId }], eventQuery, { enabled: !!eventId })
  const event = data?.event
  const { mutate: updateEvent } = useMutation(updateEventMutation, {
    onSuccess: () => {
      onClose()
      queryClient.refetchQueries(['events'])
    },
  })

  /** editable events: events created by myself */
  const editable = me?.isAdmin && event?.creator?.id === me?.id
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
      id: event?.id,
      eventInput: {
        title: formState.title,
        start: formState.start,
        end: formState.end,
      },
    })
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
            <h1>Edit Event</h1>
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
              <div className={cx('label')}>Title</div>
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
          <div className={cx('item-wrapper')}>
            <div className={cx('label')}>Start</div>
            {editable ? (
              <DateTimePicker
                rightAlignDropdown={isMobile}
                value={formState.start}
                setValue={date => handleDateChange('start', date)}
                use24Hour={isMobile}
              />
            ) : (
              <div className={cx('value')}>
                {new Date(event?.start).toLocaleString('en-Us', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </div>
            )}
          </div>
          <div className={cx('item-wrapper')}>
            <div className={cx('label')}>End</div>
            {editable ? (
              <DateTimePicker
                rightAlignDropdown={isMobile}
                value={formState.end}
                setValue={date => handleDateChange('end', date)}
                use24Hour={isMobile}
              />
            ) : (
              <div className={cx('value')}>
                {new Date(event?.end).toLocaleString('en-Us', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {editable && (
        <div className={cx('footer')}>
          <button className={cx('button', 'success')} disabled={!changed} onClick={handleSubmit}>
            Update
          </button>
          <button className={cx('button', 'cancel')} onClick={onClose}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
