import Row from '@components/layout/shared/Row'
import { Input } from '@components/form'

import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import React, { useState } from 'react'
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
  const { login } = useAccount({
    isUnauthRequired: true,
    unauthRequiredRedirectUrl: getRedirectUrl(),
  })

  const { mutate, isLoading } = useMutation(loginMutation, {
    onSuccess: (data, _variables, _context) => {
      const {
        login: { token },
      } = data
      login(token)
    },
    onError: (_error, _variables, _context) => {
      alert('Login failed. Please try again.')
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

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  function handleSubmit(e: React.SyntheticEvent) {
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
      curFormErrorState.password = '비밀번호를 입력하세요'
      isValid = false
    }
    if (formState.name.length < 1) {
      curFormErrorState.name = '사용자 이름을 입력하세요'
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
            <h1>로그인</h1>
          </div>
          <form className={cx('login-form')} name="login">
            <div className={cx('input-wrapper')}>
              <label>사용자 이름</label>
              <Input
                value={formState.name}
                name="name"
                onChange={handleInputChange}
                placeholder="사용자 이름을 입력하세요"
                disabled={isLoading}
                onKeyPress={handleKeyPress}
                errorMsg={formErrorState.name}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label>비밀번호</label>
              <Input
                type="password"
                value={formState.password}
                name="password"
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="비밀번호를 입력하세요"
                onKeyPress={handleKeyPress}
                errorMsg={formErrorState.password}
              />
            </div>
            <div className={cx('buttons-container')}>
              <button className={cx('button', 'home')} onClick={goHome}>
                뒤로
              </button>
              <button className={cx('button', 'login')} type="submit" onClick={handleSubmit} disabled={isLoading}>
                로그인
              </button>
            </div>
          </form>
        </div>
      </div>
    </Row>
  )
}
