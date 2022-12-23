import SwitchCalendarButtons from '@components/layout/shared/SwitchCalendarButtons'

import { useAccount, useMenuItems, useWindowSize } from '@client/hooks'

import classNames from 'classnames/bind'
import styles from './style/SectionMenu.module.css'
const cx = classNames.bind(styles)

interface Props {
  setShowSidebar: (showSidebar: boolean) => void
}

export default function Menu({ setShowSidebar }: Props) {
  const { me, isMeLoading, isLoggedIn, userType } = useAccount()
  const { menuItems } = useMenuItems()
  const menuContent = menuItems[userType]
  const { width } = useWindowSize()
  const isMobile = width <= 1024

  return (
    <>
      {!isMeLoading && (
        <div className={cx('menu')}>
          <div className={cx('header')}>
            <h2>
              {isLoggedIn ? `${me?.club?.name ?? ''} ${me?.isAdmin || me?.isSuper ? ' 관리자' : ''}` : '환영합니다!'}
            </h2>
            {isMobile && isLoggedIn && me?.club && <SwitchCalendarButtons isMobile setShowSidebar={setShowSidebar} />}
          </div>
          <div className={cx('body')}>
            {menuContent.map(item => (
              <div key={item.label} className={cx('menu-item')} onClick={() => item.handler()}>
                <item.icon size={40} />
                <div className={cx('label')}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
