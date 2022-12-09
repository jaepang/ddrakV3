import Row from '@components/layout/shared/row'
import { Input } from '@client/components/form'
import { useMutation } from 'react-query'
import { useState } from 'react'
import { InputChangeParams } from '@shared/types'
import { REG_EXP } from '@root/src/client/consts'
import { signupMutation } from '@client/shared/queries'
import { useAccount } from '@client/hooks'

import classNames from 'classnames/bind'
import styles from '@components/pages/acount/style/Account.module.css'
const cx = classNames.bind(styles)

export default function SignupPageComponent() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
  })
  const [formErrorState, setFormErrorState] = useState({
    email: undefined,
    password: undefined,
    passwordConfirm: undefined,
    name: undefined,
  })
  const { login } = useAccount({
    isUnauthRequired: true,
  })

  const { mutate, isLoading, isError, error, isSuccess } = useMutation(signupMutation, {
    onSuccess: (data, _variables, _context) => {
      const {
        signup: { token },
      } = data
      login(token)
    },
    onError: ({ response }, _variables, _context) => {
      const message = response?.errors?.[0]?.message
      if (message === 'Duplicate email') {
        alert('이미 사용중인 이메일입니다.')
        return
      }

      alert('회원가입에 실패하였습니다.')
    },
  })

  function handleInputChange({ name, value }: InputChangeParams) {
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (isLoading) return

    if (getIsFormValid()) {
      mutate({
        email: formState.email,
        password: formState.password,
        name: formState.name,
      })
    }
  }

  function getIsFormValid() {
    let isValid = true
    const curFormErrorState = {
      email: undefined,
      password: undefined,
      passwordConfirm: undefined,
      name: undefined,
    }

    if (!REG_EXP.email.test(formState.email)) {
      curFormErrorState.email = '올바른 이메일 주소를 입력해주세요.'
      isValid = false
    }

    if (formState.password !== formState.passwordConfirm) {
      curFormErrorState.passwordConfirm = '비밀번호가 일치하지 않습니다.'
      isValid = false
    }

    setFormErrorState({
      ...curFormErrorState,
    })

    return isValid
  }
  const PASSWORD_INPUT_MAX_LENGTH = 15

  return (
    <Row>
      <div className={cx('root')}>
        <div className={cx('container')}>
          <div className={cx('header-title')}>
            <h1>회원가입</h1>
          </div>
          <form className={cx('login-form')} name="signup">
            <div className={cx('input-wrapper')}>
              <label>아이디(이메일)</label>
              <Input
                value={formState.email}
                name="email"
                onChange={handleInputChange}
                placeholder="이메일 주소를 입력해주세요"
                errorMsg={formErrorState.email}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label>비밀번호</label>
              <Input
                type="password"
                value={formState.password}
                name="password"
                onChange={handleInputChange}
                maxLength={PASSWORD_INPUT_MAX_LENGTH}
                errorMsg={formErrorState.password}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label>비밀번호 확인</label>
              <Input
                type="password"
                value={formState.passwordConfirm}
                name="passwordConfirm"
                onChange={handleInputChange}
                placeholder="비밀번호를 다시 입력해주세요"
                maxLength={PASSWORD_INPUT_MAX_LENGTH}
                errorMsg={formErrorState.passwordConfirm}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label>이름</label>
              <Input
                type="text"
                value={formState.name}
                name="name"
                placeholder="이름을 입력해주세요"
                onChange={handleInputChange}
                errorMsg={formErrorState.name}
              />
            </div>
            <div className={cx('buttons-container', { disabled: isLoading })}>
              <button className={cx('button', 'signup')} type="submit" onClick={handleSubmit} disabled={isLoading}>
                가입하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </Row>
  )
}
