import React from 'react'
import { InputChangeParams } from '@shared/types/form'

//https://css-tricks.com/striking-a-balance-between-native-and-custom-select-elements/

interface Props {
  name: string
  value: any
  className?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLSelectElement>) => void
  onChange?: ({ value, name }: InputChangeParams) => void
  options?: { value: any; label: string }[]
  children?: React.ReactNode
}

export default function Select({ name, value, className, onClick, onChange, options, children, ...restProps }: Props) {
  function handleInputChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange({ name, value: e.target.value })
  }

  return (
    <select
      {...{
        name,
        className,
        value,
        ...restProps,
        onClick,
        onChange: handleInputChange,
      }}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
      {!options && children}
    </select>
  )
}
