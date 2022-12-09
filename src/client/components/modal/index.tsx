import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useOutsideClickHandler } from '@client/hooks/useOutsideClickHandler'

import classNames from 'classnames/bind'
import styles from './style/Modal.module.css'

const defaultCx = classNames.bind(styles)

interface ModalOptions {
  dimmed?: boolean
  cx?: boolean
  isDefaultLayout?: boolean
}

interface Props {
  children?: JSX.Element | JSX.Element[] | string
  useDefaultLayout?: boolean
  onClose?: () => void
  options?: ModalOptions
}

export default function Modal({ children, onClose, options = {} }: Props) {
  const [targetElement, setTargetElement] = useState<HTMLElement>(null)
  const { dimmed = true, cx = defaultCx, isDefaultLayout = true } = options

  useEffect(() => {
    const target = document.getElementById('modal')
    if (target) {
      setTargetElement(target)
    }
  }, [])
  const modalContentDom = useOutsideClickHandler<HTMLDivElement>(() => onClose(), [onClose])

  return targetElement && children
    ? createPortal(
        isDefaultLayout ? (
          <div className={cx('modal-root', { dimmed })}>
            <div className={cx('content-wrapper')}>
              <div ref={modalContentDom} className={cx('inner-wrapper')}>
                {children}
              </div>
            </div>
          </div>
        ) : (
          children
        ),
        targetElement,
      )
    : null
}
