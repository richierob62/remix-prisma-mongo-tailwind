import { useState } from 'react'

function useLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  })
  const [action, setAction] = useState('login')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: e.target.value
    }))
  }

  return {
    formData,
    action,
    setAction,
    handleInputChange
  }
}

export default useLogin
