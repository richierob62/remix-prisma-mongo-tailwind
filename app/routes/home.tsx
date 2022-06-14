import { Outlet, useLoaderData } from '@remix-run/react'

import Layout from '../components/layout'
import type { LoaderFunction } from '@remix-run/node'
import UserPanel from '../components/userPanel'
import { getOtherUsers } from '../services/user/user.server'
import { getUserId } from '~/services/user/auth.server'
import { json } from '@remix-run/node'

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)

  if (!userId) return null

  const users = await getOtherUsers(userId)

  return json({ users })
}

const Home = () => {
  const { users } = useLoaderData()

  return (
    <Layout>
      <div className="h-full flex">
        <Outlet />
        <UserPanel users={users} />
      </div>
    </Layout>
  )
}

export default Home
