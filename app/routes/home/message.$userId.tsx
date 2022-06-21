import * as _ from 'lodash'

import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { getUser, requireUserId } from '~/services/user/auth.server'
import { json, redirect } from '@remix-run/node'
import {
  validateBackgroundColor,
  validateEmoji,
  validateMessageText,
  validateTextColor
} from '~/validators.server'

import Message from '~/components/message'
import type { MessageErrors } from '~/utils/types.server'
import Modal from '~/components/modal'
import { SelectBox } from '~/components/selectBox'
import UserAvatar from '~/components/userAvatar'
import { getUserById } from '~/services/user/user.server'
import useCreateMessage from '../../hooks/useCreateMessage'

export const loader: LoaderFunction = async ({ params, request }) => {
  const { userId } = params

  if (typeof userId !== 'string') return redirect('/home')

  const recipient = await getUserById(userId)

  if (!recipient) return redirect('/home')

  const currentUser = await getUser(request)

  return json({ recipient, currentUser })
}

export const action: ActionFunction = async ({ request }) => {
  const formValues = await request.formData()
  const currentUserId = await requireUserId(request)

  const errors: MessageErrors = {}

  const recipientId = formValues.get('recipientId')

  const { value: messageText, error: e2 } = validateMessageText(
    formValues.get('messageText')
  )
  if (e2) errors.messageText = e2

  const { value: backgroundColor, error: e3 } = validateBackgroundColor(
    formValues.get('backgroundColor')
  )
  if (e3) errors.backgroundColor = e3

  const { value: textColor, error: e4 } = validateTextColor(
    formValues.get('textColor')
  )
  if (e4) errors.textColor = e4

  const { value: emoji, error: e5 } = validateEmoji(formValues.get('emoji'))
  if (e5) errors.emoji = e5

  if (!_.isEmpty(errors))
    return json(
      {
        errors,
        fields: { recipientId, messageText, backgroundColor, textColor, emoji }
      },
      { status: 400 }
    )

  // create message

  return {}
}

const MessageModal = () => {
  const loaderData = useLoaderData()

  const actionData = useActionData()

  const {
    recipient,
    currentUser,
    formValues,
    handleChange,
    handleStyleChange,
    backgroundColors,
    colors,
    emojis,
    formLevelError,
    messageTextError,
    backgroundColorError,
    textColorError,
    emojiError,
    zodiac,
    recipientName
  } = useCreateMessage(actionData, loaderData)

  return (
    <Modal isOpen={true} className="w-2/3 p-10">
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
        {formLevelError}
      </div>

      <Form method="post">
        <input type="hidden" value={recipient.id} name="recipientId" />
        <div className="flex flex-col md:flex-row gap-y-2 md:gap-y-8 ">
          <div className="text-center flex flex-col items-center gap-y-2 mr-8 ">
            <UserAvatar profile={recipient.profile} classname="h-24 w-24" />
            <p className="text-blue-500 flex justify-between gap-4 items-center">
              {recipientName}
              {recipient.profile.zodiac && (
                <span className="text-2xl">{zodiac}</span>
              )}
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-y-4">
            <textarea
              name="messageText"
              className="w-full rounded-xl h-40 p-4"
              value={formValues.messageText}
              onChange={(e) => handleChange(e, 'messageText')}
              placeholder={`Send ${recipient.profile.firstName} a message`}
            />
            <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
              {messageTextError || ''}
            </div>
            <div className="flex flex-col items-center md:flex-row md:justify-around gap-x-8 w-full">
              <div className="flex flex-col w-full">
                <SelectBox
                  options={backgroundColors}
                  name="backgroundColor"
                  value={formValues.style.backgroundColor}
                  label="Background Color"
                  containerClassName="w-full"
                  className="w-full rounded-xl px-3 py-2 text-gray-400"
                  onChange={(e) => handleStyleChange(e, 'backgroundColor')}
                />
                <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
                  {backgroundColorError || ''}
                </div>
              </div>
              <div className="flex flex-col  w-full">
                <SelectBox
                  options={colors}
                  name="textColor"
                  value={formValues.style.textColor}
                  label="Text Color"
                  containerClassName="w-full"
                  className="w-full rounded-xl px-3 py-2 text-gray-400"
                  onChange={(e) => handleStyleChange(e, 'textColor')}
                />

                <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
                  {textColorError || ''}
                </div>
              </div>
              <div className="flex flex-col w-full">
                <SelectBox
                  options={emojis}
                  name="emoji"
                  value={formValues.style.emoji}
                  label="Emoji"
                  containerClassName="w-full"
                  className="w-full rounded-xl px-3 py-2 text-gray-400"
                  onChange={(e) => handleStyleChange(e, 'emoji')}
                />
                <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
                  {emojiError || ''}
                </div>
              </div>
            </div>
            <br />
            <p className="text-blue-600 font-semibold mb-2">Preview</p>

            <div className="flex flex-col items-center md:flex-row gap-x-24 gap-y-2 md:gap-y-0">
              <Message message={formValues} profile={currentUser.profile} />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:translate-y-1"
            >
              Send
            </button>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default MessageModal
