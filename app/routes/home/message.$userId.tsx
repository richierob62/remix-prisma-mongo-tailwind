import { json, redirect } from '@remix-run/node'

import type { LoaderFunction } from '@remix-run/node'
import Modal from '../../components/modal'
import type { User } from '@prisma/client'
import { getUserById } from '../../services/user/user.server'
import { useLoaderData } from '@remix-run/react'

export const loader: LoaderFunction = async ({ params }) => {
  const { userId } = params

  if (typeof userId !== 'string') return redirect('/home')

  const user = await getUserById(userId)

  if (!user) return redirect('/home')

  return json({ user })
}

const MessageModal = () => {
  const { user }: { user: User } = useLoaderData()
  return (
    <Modal isOpen={true}>
      <div>
        Modal
        <br />
        {`${user.profile.firstName} ${user.profile.lastName}`}
      </div>
    </Modal>
  )
}

export default MessageModal
