import { DayHeaderContentArg } from '@fullcalendar/common'
import { useAccount, useGlobal } from '@client/hooks'

import classNames from 'classnames/bind'
import styles from './style/Calendar.module.css'
import { NexusGenObjects } from '@root/src/shared/generated/nexus-typegen'
const cx = classNames.bind(styles)

export default function DayHeaderContent(
  arg: DayHeaderContentArg,
  me: NexusGenObjects['User'],
  mode: 'default' | 'clubCalendar' | 'rental' | 'setCalendar',
) {
  return (
    <div className={cx('col-header')}>
      <div className={cx('day', { 'set-calendar-mode': mode === 'setCalendar' && me?.isSuper })}>
        {arg.date.toLocaleString('en-Us', {
          weekday: 'short',
        })}
      </div>
      {!(me?.isSuper && mode === 'setCalendar') && (
        <h2>
          {arg.date.toLocaleString('en-Us', {
            day: 'numeric',
          })}
        </h2>
      )}
    </div>
  )
}
