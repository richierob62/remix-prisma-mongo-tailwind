import type { ActionFunction, LoaderFunction } from '@remix-run/node'

import { logout } from '~/services/user/auth.server'
import { redirect } from '@remix-run/node'

export const action: ActionFunction = async ({ request }) => logout(request)

export const loader: LoaderFunction = async () => {
  return redirect('/')
}
