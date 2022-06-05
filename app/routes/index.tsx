import type { LoaderFunction } from '@remix-run/node'
import { requireUserId } from '~/services/user/auth.server'

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  return null
}

export default function Index() {
  return (
    <div className="h-screen w-full bg-slate-600">
      <h1 className="font-bold text-5xl text-blue-300">Welcome to Remix</h1>
    </div>
  )
}
