import React, { useMemo } from 'react'
import { InputChangeParams } from '@shared/types/form'

interface Props {
  name: string
  value: any
  readOnly?: boolean
  type?: string
  className?: string
  placeholder?: string
  errorClassName?: string
  errorMsg?: string
  disabled?: boolean
  maxLength?: number
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void
  onChange?: ({ value, name }: InputChangeParams) => void
}

export default function Input({
  type = 'text',
  name,
  value,
  className,
  errorClassName,
  errorMsg,
  onClick,
  onChange,
  disabled,
  ...restProps
}: Props) {
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value

    switch (type) {
      case 'number':
        let newNumberValue = parseInt(value, 10)
        if (value === '') {
          newNumberValue = 0
        }

        onChange({ name, value: newNumberValue })
        return
      case 'percent':
        let newPercentValue = parseInt(value, 10)
        if (value === '') {
          newPercentValue = 0
        } else if (newPercentValue > 100) {
          newPercentValue = 1
        } else if (newPercentValue < 0) {
          newPercentValue = 0
        } else {
          newPercentValue = parseFloat((newPercentValue / 100).toFixed(2))
        }

        onChange({ name, value: newPercentValue })
        return
      default:
        onChange({ name, value })
        return
    }
  }

  const inputType = useMemo(() => {
    switch (type) {
      case 'percent':
        return 'number'
      default:
        return type
    }
  }, [type])

  function getValue() {
    switch (type) {
      case 'number':
        return value.toString()
      case 'percent':
        return (value.toFixed(2) * 100).toString()
      default:
        return value
    }
  }

  return (
    <>
      <input
        {...{
          type: inputType,
          name,
          className,
          value: getValue(),
          disabled,
          ...restProps,
          onClick,
          onChange: handleInputChange,
        }}
      />
      {errorMsg && <div className={errorClassName ?? 'error-msg'}>{errorMsg}</div>}
    </>
  )
}
