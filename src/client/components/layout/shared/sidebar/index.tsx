import Calendar from './Calendar'
import DragEventMenu from './DragEventMenu'
import Menu from './Menu'
import SetMonthlyScheduleSlot from './SetMonthlySchedule'
import AddNewEvent from './AddNewEvent'

import { useAccount, useCalendar, useGlobal } from '@client/hooks'

import classNames from 'classnames/bind'
import styles from './style/Sidebar.module.css'
const cx = classNames.bind(styles)

interface Props {
  showSidebar: boolean
  setShowSidebar: (showSidebar: boolean) => void
  isMobile: boolean
}

export default function Sidebar({ showSidebar, setShowSidebar, isMobile }: Props) {
  const { me } = useAccount()
  const { mutateMonthlyEvents, mutateNewEvents } = useCalendar()
  const { mode, enableDefaultMode } = useGlobal()

  return (
    <>
      {isMobile && <div className={cx('mobile-bg', { show: showSidebar })} onClick={() => setShowSidebar(false)} />}
      <div className={cx('sidebar', mode, { show: showSidebar })}>
        <div className={cx('body')}>
          <div className={cx('section', 'top')}>
            {(mode === 'default' || mode === 'clubCalendar') && <Calendar setShowSidebar={setShowSidebar} />}
            {me?.isSuper && mode === 'setCalendar' && <SetMonthlyScheduleSlot />}
            {!me?.isSuper && mode === 'setCalendar' && (isMobile ? <AddNewEvent /> : <DragEventMenu />)}
          </div>
          <div className={cx('section', 'bottom')}>
            {(mode === 'default' || mode === 'clubCalendar') && <Menu setShowSidebar={setShowSidebar} />}
            {!me?.isSuper && mode === 'setCalendar' && !isMobile && <AddNewEvent />}
          </div>
          <div className={cx('section', 'footer')}>
            {mode === 'setCalendar' && (
              <>
                <button
                  className={cx('button', 'success')}
                  onClick={me?.isSuper ? mutateMonthlyEvents : mutateNewEvents}>
                  적용
                </button>
                <button className={cx('button', 'cancel')} onClick={enableDefaultMode}>
                  취소
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
