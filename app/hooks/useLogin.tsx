import { useEffect, useRef, useState } from 'react'

function useLogin(actionData: any) {
  const [formValues, setFormValues] = useState({
    email: actionData?.errors?.email || '',
    password: actionData?.errors?.password || '',
    firstName: actionData?.errors?.firstName || '',
    lastName: actionData?.errors?.lastName || ''
  })
  const [action, setAction] = useState('login')
  const [formLevelError, setFormLevelError] = useState(actionData?.error || '')
  const [fieldLevelErrors, setFieldLevelErrors] = useState(
    actionData?.errors || {}
  )

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormValues((current) => ({
      ...current,
      [field]: e.target.value
    }))
  }

  const firstLoad = useRef(true)

  useEffect(() => {
    if (!firstLoad.current) {
      setFieldLevelErrors({})
      setFormLevelError('')
    }
  }, [action])

  useEffect(() => {
    firstLoad.current = false
  }, [])

  useEffect(() => {
    if (actionData?.error) setFormLevelError(actionData.error)
    else setFormLevelError('')
    if (actionData?.errors) setFieldLevelErrors(actionData.errors)
    else setFieldLevelErrors({})
  }, [actionData])

  return {
    formValues,
    action,
    setAction,
    handleInputChange,
    formLevelError,
    fieldLevelErrors
  }
}

export default useLogin
