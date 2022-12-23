import Row from '@client/components/layout/shared/Row'
import { Input, Select } from '@client/components/form'

import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useAccount } from '@client/hooks'
import { useQuery, useMutation } from 'react-query'
import { signupMutation, clubsQuery } from '@client/shared/queries'

import { InputChangeParams } from '@shared/types'
import { PATHNAME, REG_EXP } from '@root/src/client/consts'
import { PASSWORD_INPUT_MAX_LENGTH } from '@client/consts'

import classNames from 'classnames/bind'
import styles from './style/Account.module.css'
const cx = classNames.bind(styles)

export default function RegisterPageComponent() {
  const [formState, setFormState] = useState({
    name: '',
    password: '',
    passwordConfirm: '',
    clubId: 1,
    isAdmin: false,
  })
  const [formErrorState, setFormErrorState] = useState({
    name: undefined,
    password: undefined,
    passwordConfirm: undefined,
  })
  const router = useRouter()
  const { isLoggedIn, me } = useAccount()

  const { data } = useQuery('clubs', clubsQuery)
  const clubs = data?.clubs ?? []
  const clubOptions = clubs.map(club => ({
    value: club.id,
    label: club.name,
  }))

  const { mutate, isLoading } = useMutation(signupMutation, {
    onSuccess: (_, _variables, _context) => {
      alert('사용자 등록이 완료되었습니다!')
      router.push(PATHNAME.HOME)
    },
    onError: (_, _variables, _context) => {
      alert('Signup failed. Please try again.')
    },
  })

  function handleInputChange({ name, value }: InputChangeParams) {
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: checked,
    }))
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (isLoading) return

    if (getIsFormValid()) {
      mutate({
        password: formState.password,
        name: formState.name,
        clubId: formState.clubId,
        isAdmin: formState.isAdmin,
      })
    }
  }

  function getIsFormValid() {
    let isValid = true
    const curFormErrorState = {
      password: undefined,
      passwordConfirm: undefined,
      name: undefined,
    }

    const password = formState.password

    if (password.search(/\s/) != -1) {
      curFormErrorState.password = '비밀번호에는 공백이 허용되지 않습니다'
      isValid = false
    } else if (formState.password !== formState.passwordConfirm) {
      curFormErrorState.passwordConfirm = '비밀번호가 일치하지 않습니다'
      isValid = false
    }

    if (formState.name.length < 1) {
      curFormErrorState.name = 'Enter Username'
      isValid = false
    }

    setFormErrorState({
      ...curFormErrorState,
    })

    return isValid
  }

  function goHome(e: React.SyntheticEvent) {
    e.preventDefault()
    router.push(PATHNAME.HOME)
  }

  if (!isLoggedIn || !me?.isSuper) {
    return (
      <Row>
        <div className={cx('root')}>
          <div className={cx('container')}>
            <div className={cx('header-title')}>
              <h1>권한이 없습니다</h1>
            </div>
            <div className={cx('buttons-container', { disabled: isLoading })}>
              <button className={cx('button', 'home')} onClick={() => router.push(PATHNAME.HOME)} disabled={isLoading}>
                뒤로
              </button>
              {!isLoggedIn && (
                <button
                  className={cx('button', 'login')}
                  onClick={() => router.push(PATHNAME.LOGIN)}
                  disabled={isLoading}>
                  로그인
                </button>
              )}
            </div>
          </div>
        </div>
      </Row>
    )
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <Row>
      <div className={cx('root')}>
        <div className={cx('container')}>
          <div className={cx('header-title')}>
            <h1>새로운 사용자 등록</h1>
          </div>
          <form className={cx('login-form')} name="signup">
            <div className={cx('misc-container')}>
              <div className={cx('misc-wrapper')}>
                <div>동아리</div>
                <Select
                  className={cx('select', 'short')}
                  name="club"
                  onChange={handleInputChange}
                  value={formState.clubId}
                  options={clubOptions}
                />
              </div>
              <div className={cx('misc-wrapper')}>
                <label htmlFor="admin">관리자</label>
                <input type="checkbox" name="isAdmin" checked={formState.isAdmin} onChange={handleCheckboxChange} />
              </div>
            </div>
            <div className={cx('input-wrapper')}>
              <label>사용자 이름</label>
              <Input
                value={formState.name}
                name="name"
                onChange={handleInputChange}
                placeholder="사용자 이름을 입력하세요"
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
                placeholder="비밀번호를 입력하세요"
                maxLength={PASSWORD_INPUT_MAX_LENGTH}
                onKeyPress={handleKeyPress}
                errorMsg={formErrorState.password}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label>비밀번호 확인</label>{' '}
              <Input
                type="password"
                value={formState.passwordConfirm}
                name="passwordConfirm"
                onChange={handleInputChange}
                placeholder="비밀번호를 다시 입력하세요"
                maxLength={PASSWORD_INPUT_MAX_LENGTH}
                onKeyPress={handleKeyPress}
                errorMsg={formErrorState.passwordConfirm}
              />
            </div>
            <div className={cx('buttons-container', { disabled: isLoading })}>
              <button className={cx('button', 'home')} onClick={goHome}>
                뒤로
              </button>
              <button className={cx('button', 'signup')} type="submit" onClick={handleSubmit} disabled={isLoading}>
                등록
              </button>
            </div>
          </form>
        </div>
      </div>
    </Row>
  )
}
