import Row from '@components/layout/shared/Row'
import { Input } from '@components/form'

import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import React, { useState } from 'react'
import { useAccount } from '@client/hooks'
import { InputChangeParams } from '@shared/types'
import { changePasswordMutation } from '@client/shared/queries'
import { PATHNAME } from '@root/src/client/consts'

import classNames from 'classnames/bind'
import styles from './style/Account.module.css'
const cx = classNames.bind(styles)

export default function ChangePasswordPageComponent() {
  const router = useRouter()
  const [formState, setFormState] = useState({
    password: '',
    newPassword: '',
    newPasswordConfirm: '',
  })
  const [formErrorState, setFormErrorState] = useState({
    password: undefined,
    newPassword: undefined,
    newPasswordConfirm: undefined,
  })
  const { me } = useAccount()

  const { mutate, isLoading } = useMutation(changePasswordMutation, {
    onSuccess: (data, _variables, _context) => {
      alert('비밀번호가 변경되었습니다!')
      router.push(PATHNAME.HOME)
    },
    onError: (_error, _variables, _context) => {
      alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.')
    },
  })

  function handleInputChange({ name, value }: InputChangeParams) {
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (isLoading) return

    if (getIsFormValid()) {
      mutate({
        id: me?.id,
        ...formState,
      })
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  function getIsFormValid() {
    let isValid = true
    const curFormErrorState = {
      password: undefined,
      newPassword: undefined,
      newPasswordConfirm: undefined,
    }
    const password = formState.password
    const newPassword = formState.newPassword
    const newPasswordConfirm = formState.newPasswordConfirm

    if (password.length < 1) {
      curFormErrorState.password = '비밀번호를 입력하세요'
      isValid = false
    }

    if (newPassword.length < 1) {
      curFormErrorState.newPassword = '새 비밀번호를 입력하세요'
      isValid = false
    }

    if (newPassword.search(/\s/) != -1) {
      curFormErrorState.password = '비밀번호에는 공백이 허용되지 않습니다'
      isValid = false
    } else if (newPassword !== newPasswordConfirm) {
      curFormErrorState.newPasswordConfirm = '비밀번호가 일치하지 않습니다'
      isValid = false
    }

    setFormErrorState(curFormErrorState)
    return isValid
  }

  function goHome(e: React.SyntheticEvent) {
    e.preventDefault()
    router.push(PATHNAME.HOME)
  }

  return (
    <Row>
      <div className={cx('root')}>
        <div className={cx('container')}>
          <div className={cx('header-title')}>
            <h1>비밀번호 변경</h1>
          </div>
          <form className={cx('login-form')} name="login">
            <div className={cx('input-wrapper')}>
              <label>비밀번호</label>
              <Input
                type="password"
                value={formState.password}
                name="password"
                onChange={handleInputChange}
                placeholder="비밀번호를 입력하세요"
                disabled={isLoading}
                onKeyPress={handleKeyPress}
                errorMsg={formErrorState.password}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label>새 비밀번호</label>
              <Input
                type="password"
                value={formState.newPassword}
                name="newPassword"
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="새로운 비밀번호를 입력하세요"
                onKeyPress={handleKeyPress}
                errorMsg={formErrorState.newPassword}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label>새 비밀번호 확인</label>
              <Input
                type="password"
                value={formState.newPasswordConfirm}
                name="newPasswordConfirm"
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="새 비밀번호를 다시 입력해주세요"
                onKeyPress={handleKeyPress}
                errorMsg={formErrorState.newPasswordConfirm}
              />
            </div>
            <div className={cx('buttons-container')}>
              <button className={cx('button', 'home')} onClick={goHome}>
                뒤로
              </button>
              <button className={cx('button')} type="submit" onClick={handleSubmit} disabled={isLoading}>
                비밀번호 변경
              </button>
            </div>
          </form>
        </div>
      </div>
    </Row>
  )
}
