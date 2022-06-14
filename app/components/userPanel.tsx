import { Form, useNavigate } from '@remix-run/react'

import type { User } from '@prisma/client'
import UserAvatar from './userAvatar'

interface UserPanelProps {
  users: User[]
}

const UserPanel = ({ users }: UserPanelProps) => {
  const navigate = useNavigate()

  return (
    <div className="w-1/6 bg-gray-200 flex flex-col">
      <div className="text-center bg-gray-300 h-20 flex items-center justify-center">
        <div className="text-xl text-blue-600 font-semibold">My Friends</div>
      </div>

      <div className="flex-1 overflow-y-scroll py-4 flex flex-col gap-y-10">
        {users.map((user) => (
          <UserAvatar
            key={user.id}
            profile={user.profile}
            classname={'h-24 w-24 mx-auto flex-shrink-0'}
            onClick={() => navigate(`/home/message/${user.id}`)}
          />
        ))}
      </div>

      <div className="text-center p-6 bg-gray-300">
        <Form method="post" action="/logout">
          <button
            type="submit"
            className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:translate-y-1"
          >
            Sign Out
          </button>
        </Form>
      </div>
    </div>
  )
}

export default UserPanel
