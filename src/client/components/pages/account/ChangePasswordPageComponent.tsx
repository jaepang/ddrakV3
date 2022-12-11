import Link from 'next/link'
import Row from '@components/layout/shared/Row'
import { Input } from '@components/form'

import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { useState } from 'react'
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
  const { isLoggedIn, me } = useAccount()

  const { mutate, isLoading, isError, error, isSuccess } = useMutation(changePasswordMutation, {
    onSuccess: (data, _variables, _context) => {
      alert('Password successfully changed!')
      router.push(PATHNAME.HOME)
    },
    onError: (_error, _variables, _context) => {
      alert('Password Change failed. Please try again.')
    },
  })

  function handleInputChange({ name, value }: InputChangeParams) {
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  function handleSubmit(e) {
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

    if (formState.password.length < 1) {
      curFormErrorState.password = 'Enter Password'
      isValid = false
    }

    if (formState.newPassword.length < 1) {
      curFormErrorState.newPassword = 'Enter New Password'
      isValid = false
    }

    if (formState.newPassword !== formState.newPasswordConfirm) {
      curFormErrorState.newPasswordConfirm = 'New Password does not match'
      isValid = false
    }

    setFormErrorState(curFormErrorState)
    return isValid
  }

  function goHome(e) {
    e.preventDefault()
    router.push(PATHNAME.HOME)
  }

  return (
    <Row>
      <div className={cx('root')}>
        <div className={cx('container')}>
          <div className={cx('header-title')}>
            <h1>Change Password</h1>
          </div>
          <form className={cx('login-form')} name="login">
            <div className={cx('input-wrapper')}>
              <label>Password</label>
              <Input
                type="password"
                value={formState.password}
                name="password"
                onChange={handleInputChange}
                placeholder="enter password"
                disabled={isLoading}
                onKeyPress={handleKeyPress}
                errorMsg={formErrorState.password}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label>New Password</label>
              <Input
                type="password"
                value={formState.newPassword}
                name="newPassword"
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="enter new password"
                onKeyPress={handleKeyPress}
                errorMsg={formErrorState.newPassword}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label>New Password Confirm</label>
              <Input
                type="password"
                value={formState.newPasswordConfirm}
                name="newPasswordConfirm"
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="enter new password again"
                onKeyPress={handleKeyPress}
                errorMsg={formErrorState.newPasswordConfirm}
              />
            </div>
            <div className={cx('buttons-container')}>
              <button className={cx('button', 'home')} onClick={goHome}>
                Back
              </button>
              <button className={cx('button')} type="submit" onClick={handleSubmit} disabled={isLoading}>
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </Row>
  )
}
