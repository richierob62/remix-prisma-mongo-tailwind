import * as _ from 'lodash'

import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { getUser, login, register } from '../services/user/auth.server'
import {
  validateAction,
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePassword
} from '../validators.server'

import FormField from '~/components/formField'
import Layout from '~/components/layout'
import type { LoginErrors } from '../utils/types.server'
import { json } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import useLogin from '~/hooks/useLogin'

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect('/') : null
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const errors: LoginErrors = {}

  const { value: action, error: e1 } = validateAction(formData.get('_action'))
  if (e1) errors._action = e1

  const { value: email, error: e2 } = validateEmail(formData.get('email'))
  if (e2) errors.email = e2

  const { value: password, error: e3 } = validatePassword(
    formData.get('password')
  )
  if (e3) errors.password = e3

  let firstName, lastName

  if (action === 'register') {
    const { value: fn, error: e4 } = validateFirstName(
      formData.get('firstName')
    )
    firstName = fn
    if (e4) errors.firstName = e4

    const { value: ln, error: e5 } = validateLastName(formData.get('lastName'))
    lastName = ln
    if (e5) errors.lastName = e5
  }

  if (!_.isEmpty(errors))
    return json(
      {
        errors,
        formAction: action,
        fields: { email, password, firstName, lastName }
      },
      { status: 400 }
    )

  switch (action) {
    case 'login':
      return await login({ email, password })

    case 'register':
      return await register({ email, password, firstName, lastName })
  }
}

export default function Login() {
  const actionData = useActionData()

  const {
    action,
    formValues,
    setAction,
    handleInputChange,
    formLevelError,
    fieldLevelErrors
  } = useLogin(actionData)

  return (
    <Layout>
      <div className="h-full flex flex-col justify-center items-center gap-y-4">
        <button
          onClick={() => setAction(action === 'login' ? 'register' : 'login')}
          className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:translate-y-1"
        >
          {action === 'login' ? 'I need to Sign Up' : "I'm already Registered"}
        </button>
        <h2 className="text-5xl font-extrabold text-yellow-300">
          Welcome to Sample App
        </h2>
        <p className="font-semibold text-slate-300">{`${
          action === 'login' ? 'Log In' : 'Sign Up'
        } To Use The Site`}</p>

        <Form method="post" className="rounded-2xl bg-gray-200 p-6 w-96">
          <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
            {formLevelError}
          </div>
          {action !== 'login' ? (
            <>
              <FormField
                htmlFor="firstName"
                label="First Name"
                value={formValues.firstName}
                onChange={(e) => handleInputChange(e, 'firstName')}
                error={fieldLevelErrors.firstName}
              />
              <FormField
                htmlFor="lastName"
                label="Last Name"
                value={formValues.lastName}
                onChange={(e) => handleInputChange(e, 'lastName')}
                error={fieldLevelErrors.lastName}
              />
            </>
          ) : null}
          <FormField
            htmlFor="email"
            label="Email"
            value={formValues.email}
            onChange={(e) => handleInputChange(e, 'email')}
            error={fieldLevelErrors.email}
          />
          <FormField
            htmlFor="password"
            label="Password"
            type="password"
            value={formValues.password}
            onChange={(e) => handleInputChange(e, 'password')}
            error={fieldLevelErrors.password}
          />
          <div className="w-full text-center">
            <button
              className="rounded-xl mt-2 bg-yellow-500 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:translate-y-1"
              type="submit"
              name="_action"
              value={action}
            >
              {action === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </Form>
      </div>
    </Layout>
  )
}
