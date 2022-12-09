import Navbar from '@components/navbar'
import Sidebar from '@components/sidebar'
import { useState } from 'react'
import { useWindowSize } from '@client/hooks'

import dynamic from 'next/dynamic'
const Calendar = dynamic(() => import('@components/calendar'), { ssr: false })

import classNames from 'classnames/bind'
import styles from './style/Home.module.css'
const cx = classNames.bind(styles)

export default function HomePageComponent() {
  const [showSidebar, setShowSidebar] = useState(false)
  const { width } = useWindowSize()
  const isMobile = width <= 1024

  return (
    <div className={cx('root')}>
      <Navbar {...{ isMobile, setShowSidebar }} />
      <div className={cx('body')}>
        <div className={cx('calendar-wrapper')}>
          <Calendar />
        </div>
        <Sidebar {...{ showSidebar, setShowSidebar, isMobile }} />
      </div>
    </div>
  )
}
