import { useEffect, useRef, useState } from 'react'

import { zodiacMap } from '../utils/constants'

function useLogin(actionData: any) {
  const [formValues, setFormValues] = useState({
    email: actionData?.errors?.email || '',
    password: actionData?.errors?.password || '',
    firstName: actionData?.errors?.firstName || '',
    lastName: actionData?.errors?.lastName || '',
    zodiac: actionData?.errors?.zodiac || ''
  })

  const [action, setAction] = useState('login')
  const [formLevelError, setFormLevelError] = useState(actionData?.error || '')
  const [fieldLevelErrors, setFieldLevelErrors] = useState(
    actionData?.errors || {}
  )

  const zodiacs = Object.keys(zodiacMap).map((z) => ({
    name: z[0].toUpperCase() + z.slice(1).toLowerCase(),
    value: z
  }))

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
    fieldLevelErrors,
    zodiacs
  }
}

export default useLogin
