import * as _ from 'lodash'

import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { deleteUser, updateUser } from '../../services/user/user.server'
import { getUser, logout, requireUserId } from '~/services/user/auth.server'
import { json, redirect } from '@remix-run/node'
import {
  validateFirstName,
  validateLastName,
  validateZodiac
} from '../../validators.server'

import FormField from '~/components/formField'
import { ImageUploader } from '~/components/imageUploader'
import Modal from '~/components/modal'
import type { ProfileEditErrors } from '../../utils/types.server'
import React from 'react'
import { SelectBox } from '~/components/selectBox'
import type { User } from '@prisma/client'
import { zodiacMap } from '../../utils/constants'

interface LoaderProps {
  user: Partial<User>
}

const zodiacs = Object.keys(zodiacMap).map((z) => ({
  name: z[0].toUpperCase() + z.slice(1).toLowerCase(),
  value: z
}))

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  if (!user) {
    return redirect('/login')
  }

  return json<LoaderProps>({ user })
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)

  const formData = await request.formData()

  let firstName, lastName, zodiac

  const formAction = formData.get('_action')

  switch (formAction) {
    case 'save':
      const errors: ProfileEditErrors = {}

      const { value: fn, error: e4 } = validateFirstName(
        formData.get('firstName')
      )
      firstName = fn
      if (e4) errors.firstName = e4

      const { value: ln, error: e5 } = validateLastName(
        formData.get('lastName')
      )
      lastName = ln
      if (e5) errors.lastName = e5

      const { value: z, error: e6 } = validateZodiac(formData.get('zodiac'))
      zodiac = z
      if (e6) errors.zodiac = e6

      if (!_.isEmpty(errors))
        return json(
          {
            errors,
            formAction: formAction,
            fields: { firstName, lastName, zodiac }
          },
          { status: 400 }
        )

      await updateUser(userId, {
        firstName,
        lastName,
        zodiac
      })

      return redirect(`/home`)

    case 'delete':
      await deleteUser(userId)
      return logout(request)

    default:
      return json({ error: 'Invalid action' }, { status: 400 })
  }
}

const ProfileModal = () => {
  const { user } = useLoaderData<LoaderProps>()

  const actionData = useActionData()

  const [formData, setFormData] = React.useState({
    firstName: actionData?.fields?.firstName || user?.profile?.firstName || '',
    lastName: actionData?.fields?.lastName || user?.profile?.lastName || '',
    zodiac: user?.profile?.zodiac || '',
    profilePicture: user?.profile?.profilePicture || ''
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((current) => ({ ...current, [field]: e.target.value }))
  }

  const handleFileUpload = async (file: File) => {
    let inputFormData = new FormData()
    inputFormData.append('profile-pic', file)

    const response = await fetch('/avatar', {
      method: 'POST',
      body: inputFormData
    })

    const { imageUrl } = await response.json()

    setFormData((current) => ({ ...current, profilePicture: imageUrl }))
  }

  return (
    <Modal isOpen={true} className="w-1/2 p-10">
      <div className="p-3">
        <h2 className="text-4xl font-semibold text-blue-600 text-center mb-4">
          Your Profile
        </h2>
        <div className="text-xs font-semibold text-clip tracking-wide text-red-500 w-full mb-2">
          {actionData?.error}
        </div>

        <div className="flex">
          <div className="w-1/3">
            <ImageUploader
              onChange={handleFileUpload}
              imageUrl={formData.profilePicture || ''}
            />
          </div>
          <div className="flex-1">
            <Form
              method="post"
              onSubmit={(e) =>
                !confirm('Are you sure?') ? e.preventDefault() : true
              }
            >
              <FormField
                htmlFor="firstName"
                label={'First Name'}
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, 'firstName')}
                error={actionData?.errors?.firstName}
              />
              <FormField
                htmlFor="lastName"
                label={'Last Name'}
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, 'lastName')}
                error={actionData?.errors?.lastName}
              />
              <SelectBox
                className="w-full rounded-xl px-3 py-2 text-gray-400"
                id="zodiac"
                label="Zodiac Sign"
                name="zodiac"
                options={zodiacs}
                value={formData.zodiac}
                onChange={(e) => handleInputChange(e, 'zodiac')}
              />
              <button
                name="_action"
                value="delete"
                className="rounded-xl w-full bg-red-300 font-semibold text-white px-16 py-2 transition duration-300 ease-in-out hover:bg-red-400 hover:translate-y-1"
              >
                Delete
              </button>

              <div className="w-full text-right mt-4">
                <button
                  name="_action"
                  value="save"
                  className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-16 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:translate-y-1"
                >
                  Save
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ProfileModal
