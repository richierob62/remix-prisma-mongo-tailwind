import type { MessageStyle, User } from '@prisma/client'
import {
  backgroundColorMap,
  colorMap,
  emojiMap,
  zodiacMap
} from '../utils/constants'
import { useEffect, useState } from 'react'

const getOptions = (data: any) =>
  Object.keys(data).map((key) => ({
    name: key[0].toUpperCase() + key.slice(1).toLowerCase(),
    value: key
  }))

function useCreateMessage(
  actionData: any,
  loaderData: { recipient: User; currentUser: User }
) {
  const { recipient, currentUser } = loaderData

  const [formValues, setFormValues] = useState({
    messageText: actionData?.errors?.messageText || '',
    style: {
      backgroundColor: actionData?.errors?.backgroundColor || 'RED',
      textColor: actionData?.errors?.textColor || 'WHITE',
      emoji: actionData?.errors?.emoji || 'THUMBSUP'
    } as MessageStyle
  })

  const [formLevelError, setFormLevelError] = useState(actionData?.error || '')
  const [fieldLevelErrors, setFieldLevelErrors] = useState(
    actionData?.errors || {}
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleStyleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setFormValues((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        [field]: e.target.value
      }
    }))
  }

  const backgroundColors = getOptions(backgroundColorMap)
  const colors = getOptions(colorMap)
  const emojis = getOptions(emojiMap)

  const recipientName = `${recipient.profile.firstName} ${recipient.profile.lastName}`

  const zodiac = zodiacMap[recipient.profile.zodiac]

  useEffect(() => {
    if (actionData?.error) setFormLevelError(actionData.error)
    else setFormLevelError('')
    if (actionData?.errors) setFieldLevelErrors(actionData.errors)
    else setFieldLevelErrors({})
  }, [actionData])

  return {
    recipient,
    currentUser,
    formValues,
    handleChange,
    handleStyleChange,
    backgroundColors,
    colors,
    emojis,
    formLevelError,
    messageTextError: fieldLevelErrors?.messageText || '',
    backgroundColorError: fieldLevelErrors?.backgroundColor || '',
    textColorError: fieldLevelErrors?.textColor || '',
    emojiError: fieldLevelErrors?.emoji || '',
    recipientName,
    zodiac
  }
}

export default useCreateMessage
