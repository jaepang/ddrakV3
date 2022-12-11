import { useGlobal } from '@client/hooks'

import classNames from 'classnames/bind'
import styles from './style/SwitchCalendarButtons.module.css'
const cx = classNames.bind(styles)

interface Props {
  isMobile?: boolean
  setShowSidebar?: (showSidebar: boolean) => void
}

export default function SwitchCalendarButtons({ isMobile = false, setShowSidebar }: Props) {
  const { mode, enableDefaultMode, enableClubCalendarMode } = useGlobal()

  function handleSwitchMode() {
    mode === 'clubCalendar' && enableDefaultMode()
    mode === 'default' && enableClubCalendarMode()

    if (isMobile) {
      setShowSidebar?.(false)
    }
  }

  return (
    <div className={cx('switch-calendar-buttons')}>
      <button disabled={mode === 'default'} className={cx('button', 'left')} onClick={handleSwitchMode}>
        default
      </button>
      <button
        disabled={mode === 'clubCalendar'}
        className={cx('button', 'right', { active: mode === 'clubCalendar' })}
        onClick={handleSwitchMode}>
        club
      </button>
    </div>
  )
}
