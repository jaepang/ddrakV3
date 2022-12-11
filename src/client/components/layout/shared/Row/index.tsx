import classNames from 'classnames/bind'
import styles from './style/Row.module.css'
const cx = classNames.bind(styles)

export enum ROW_TYPE {
  FULL_SCREEN = 'full-screen',
  NORMAL = 'normal',
}

interface Props {
  children?: React.ReactNode
  type?: ROW_TYPE
  style?: object
}

export default function Row({ children, type = ROW_TYPE.NORMAL, style }: Props) {
  return (
    <div className={cx(type)} style={style ? style : {}}>
      {children}
    </div>
  )
}
