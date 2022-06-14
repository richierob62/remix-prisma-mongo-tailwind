import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { requireUserId } from '~/services/user/auth.server'

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  return redirect('/home')
}
