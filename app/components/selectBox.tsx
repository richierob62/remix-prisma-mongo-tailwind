import React from 'react'

interface SelectBoxProps {
  options: {
    name: string
    value: any
  }[]
  className?: string
  containerClassName?: string
  id?: string
  name?: string
  label?: string
  value?: any
  onChange?: (...args: any) => any
}

export const SelectBox: React.FC<SelectBoxProps> = (props) => {
  const {
    options = [],
    onChange = () => {},
    className = '',
    containerClassName = '',
    id,
    name,
    label,
    value
  } = props

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-blue-600 font-semibold">
        {label}
      </label>
      <div className={`flex items-center ${containerClassName} my-2`}>
        <select
          className={`${className} appearance-none`}
          id={id}
          name={name}
          onChange={onChange}
          value={value || ''}
        >
          {options.map((option) => (
            <option key={option.name} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
