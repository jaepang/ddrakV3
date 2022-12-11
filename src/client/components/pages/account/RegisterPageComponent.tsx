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

  const { mutate, isLoading, isError, error, isSuccess } = useMutation(signupMutation, {
    onSuccess: (data, _variables, _context) => {
      const {
        signup: { token },
      } = data
      alert('register success!')
      router.push(PATHNAME.HOME)
    },
    onError: ({ response }, _variables, _context) => {
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

  async function handleSubmit(e) {
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
    var num = password.search(REG_EXP.passwordNum)
    var eng = password.search(REG_EXP.passwordEng)
    var spe = password.search(REG_EXP.passwordSpe)

    if (password.length < 8 || password.length > 15) {
      curFormErrorState.password = 'English, Number, Special Character 2 or more, 8 or more total'
      isValid = false
    } else if (password.search(/\s/) != -1) {
      curFormErrorState.password = 'No spaces allowed in password'
      isValid = false
    } else if ((num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0)) {
      curFormErrorState.password = 'English, Number, Special Character 2 or more, 8 or more total'
      isValid = false
    } else if (formState.password !== formState.passwordConfirm) {
      curFormErrorState.passwordConfirm = 'Password does not match'
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

  function goHome(e) {
    e.preventDefault()
    router.push(PATHNAME.HOME)
  }

  if (!isLoggedIn || !me?.isSuper) {
    return (
      <Row>
        <div className={cx('root')}>
          <div className={cx('container')}>
            <div className={cx('header-title')}>
              <h1>Permission Denied</h1>
            </div>
            <div className={cx('buttons-container', { disabled: isLoading })}>
              <button className={cx('button', 'home')} onClick={() => router.push(PATHNAME.HOME)} disabled={isLoading}>
                Home
              </button>
              {!isLoggedIn && (
                <button
                  className={cx('button', 'login')}
                  onClick={() => router.push(PATHNAME.LOGIN)}
                  disabled={isLoading}>
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </Row>
    )
  }

  return (
    <Row>
      <div className={cx('root')}>
        <div className={cx('container')}>
          <div className={cx('header-title')}>
            <h1>Register New User</h1>
          </div>
          <form className={cx('login-form')} name="signup">
            <div className={cx('misc-container')}>
              <div className={cx('misc-wrapper')}>
                <div>Club</div>
                <Select
                  className={cx('select', 'short')}
                  name="club"
                  onChange={handleInputChange}
                  value={formState.clubId}
                  options={clubOptions}
                />
              </div>
              <div className={cx('misc-wrapper')}>
                <label htmlFor="admin">Admin</label>
                <input type="checkbox" name="isAdmin" checked={formState.isAdmin} onChange={handleCheckboxChange} />
              </div>
            </div>
            <div className={cx('input-wrapper')}>
              <label>Username</label>
              <Input
                value={formState.name}
                name="name"
                onChange={handleInputChange}
                placeholder="Enter Username"
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
                placeholder="English, Number, Special Character 2 or more, 8 or more total"
                maxLength={PASSWORD_INPUT_MAX_LENGTH}
                errorMsg={formErrorState.password}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label>Confirm Password</label>
              <Input
                type="password"
                value={formState.passwordConfirm}
                name="passwordConfirm"
                onChange={handleInputChange}
                placeholder="Re-enter Password"
                maxLength={PASSWORD_INPUT_MAX_LENGTH}
                errorMsg={formErrorState.passwordConfirm}
              />
            </div>
            <div className={cx('buttons-container', { disabled: isLoading })}>
              <button className={cx('button', 'home')} onClick={goHome}>
                Back
              </button>
              <button className={cx('button', 'signup')} type="submit" onClick={handleSubmit} disabled={isLoading}>
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </Row>
  )
}
