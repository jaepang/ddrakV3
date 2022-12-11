import Row from '@components/layout/shared/Row'
import { Input } from '@components/form'

import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { useState } from 'react'
import { useAccount } from '@client/hooks'
import { InputChangeParams } from '@shared/types'
import { loginMutation } from '@client/shared/queries'
import { PATHNAME } from '@root/src/client/consts'

import classNames from 'classnames/bind'
import styles from './style/Account.module.css'
const cx = classNames.bind(styles)

export default function LoginPageComponent() {
  const router = useRouter()
  const [formState, setFormState] = useState({
    name: '',
    password: '',
  })
  const [formErrorState, setFormErrorState] = useState({
    name: undefined,
    password: undefined,
  })
  const { isLoggedIn, login } = useAccount({
    isUnauthRequired: true,
    unauthRequiredRedirectUrl: getRedirectUrl(),
  })

  const { mutate, isLoading, isError, error, isSuccess } = useMutation(loginMutation, {
    onSuccess: (data, _variables, _context) => {
      const {
        login: { token },
      } = data
      login(token)
    },
    onError: (_error, _variables, _context) => {
      alert('로그인에 실패하였습니다.')
    },
  })

  function getRedirectUrl(): string {
    if (router.query && router.query.redirect) {
      return router.query.redirect as string
    } else {
      return PATHNAME.HOME
    }
  }

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
        ...formState,
      })
    }
  }

  function getIsFormValid() {
    let isValid = true
    const curFormErrorState = {
      name: undefined,
      password: undefined,
    }

    if (formState.password.length < 1) {
      curFormErrorState.password = 'Enter Password'
      isValid = false
    }
    if (formState.name.length < 1) {
      curFormErrorState.name = 'Enter Username'
      isValid = false
    }

    setFormErrorState(curFormErrorState)
    return isValid
  }

  return (
    <Row>
      <div className={cx('root')}>
        <div className={cx('container')}>
          <div className={cx('header-title')}>
            <h1>Login</h1>
          </div>
          <form className={cx('login-form')} name="login">
            <div className={cx('input-wrapper')}>
              <label>Club Name</label>
              <Input
                value={formState.name}
                name="name"
                onChange={handleInputChange}
                placeholder="enter club name"
                disabled={isLoading}
                errorMsg={formErrorState.name}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label>Password</label>
              <Input
                type="password"
                value={formState.password}
                name="password"
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="enter password"
                errorMsg={formErrorState.password}
              />
            </div>
            <div className={cx('buttons-container')}>
              <button className={cx('button', 'login')} type="submit" onClick={handleSubmit} disabled={isLoading}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </Row>
  )
}
