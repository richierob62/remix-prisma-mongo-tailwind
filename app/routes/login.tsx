import { Form } from '@remix-run/react'
import FormField from '../components/formField'
import Layout from '~/components/layout'
import useLogin from '../hooks/useLogin'

export default function Login() {
  const { action, formData, setAction, handleInputChange } = useLogin()

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

        <Form className="rounded-2xl bg-gray-200 p-6 w-96">
          {action !== 'login' ? (
            <>
              <FormField
                htmlFor="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, 'firstName')}
              />
              <FormField
                htmlFor="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, 'lastName')}
              />
            </>
          ) : null}
          <FormField
            htmlFor="email"
            label="Email"
            value={formData.email}
            onChange={(e) => handleInputChange(e, 'email')}
          />
          <FormField
            htmlFor="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, 'password')}
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
