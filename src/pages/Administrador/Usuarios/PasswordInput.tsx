// src/components/PasswordInput.tsx
import React, { useState } from 'react'

interface PasswordInputProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  placeholder?: string
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  value,
  onChange,
  required = false,
  placeholder = ''
}) => {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border px-2 py-1 rounded pr-10"
      />
      <button
        type="button"
        onClick={() => setShow(prev => !prev)}
        className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
      >
        {show ? '🙈' : '👁️'} 
        {/* puedes cambiar los emojis por íconos de heroicons o fontawesome */}
      </button>
    </div>
  )
}

export default PasswordInput
