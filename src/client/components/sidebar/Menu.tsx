import { useAccount } from '@client/hooks'
import { useMenuItems } from '@root/src/client/hooks/useMenuItems'

import classNames from 'classnames/bind'
import styles from './style/SectionMenu.module.css'
const cx = classNames.bind(styles)

export default function Menu() {
  const { me, isMeLoading, displayName, userType } = useAccount()
  const { menuItems } = useMenuItems()
  const menuContent = menuItems[userType]

  return (
    <>
      {!isMeLoading && (
        <div className={cx('menu')}>
          <h2 className={cx('header')}>{displayName?.length > 0 ? `${displayName}` : 'Welcome to DDrak!'}</h2>
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
