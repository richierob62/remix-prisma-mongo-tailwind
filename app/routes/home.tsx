import { Outlet, useLoaderData } from '@remix-run/react'
import {
  getFilteredMessages,
  getRecentMessages
} from '../services/messages/message.server'

import Layout from '../components/layout'
import type { LoaderFunction } from '@remix-run/node'
import Message from '../components/message'
import type { MessageWithAuthor } from '../utils/types.server'
import type { Prisma } from '@prisma/client'
import { RecentMessages } from '../components/recent-messages'
import { SearchBar } from '../components/searchbar'
import UserPanel from '../components/userPanel'
import { getOtherUsers } from '../services/user/user.server'
import { getUserId } from '~/services/user/auth.server'
import { json } from '@remix-run/node'

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)

  if (!userId) return null

  const users = await getOtherUsers(userId)

  const url = new URL(request.url)
  const filter = url.searchParams.get('filter')
  const sort = url.searchParams.get('sort')

  let sortOptions: Prisma.MessageOrderByWithRelationInput = {}

  if (sort) {
    if (sort === 'date') {
      sortOptions = {
        createdAt: 'desc'
      }
    } else if (sort === 'name') {
      sortOptions = {
        author: {
          profile: {
            firstName: 'asc'
          }
        }
      }
    } else if (sort === 'emoji') {
      sortOptions = {
        style: {
          emoji: 'asc'
        }
      }
    }
  }

  let textFilter: Prisma.MessageWhereInput = {}

  if (filter) {
    textFilter = {
      OR: [
        {
          messageText: {
            mode: 'insensitive',
            contains: filter
          }
        },
        {
          author: {
            OR: [
              {
                profile: {
                  is: { firstName: { mode: 'insensitive', contains: filter } }
                }
              },
              {
                profile: {
                  is: { lastName: { mode: 'insensitive', contains: filter } }
                }
              }
            ]
          }
        }
      ]
    }
  }

  const messages = await getFilteredMessages(userId, sortOptions, textFilter)
  const recentMessages = await getRecentMessages()

  return json({ users, messages, recentMessages })
}

const Home = () => {
  const { users, messages, recentMessages } = useLoaderData()

  return (
    <Layout>
      <div className="h-full flex">
        <Outlet />
        <UserPanel users={users} />
        <div className="flex flex-col flex-1">
          <SearchBar />
          <div className="flex-1 flex">
            <div className="w-full p-10 flex flex-col gap-y-4">
              {messages.map((message: MessageWithAuthor) => (
                <Message
                  key={message.id}
                  message={message}
                  profile={message.author.profile}
                />
              ))}
            </div>
            <RecentMessages messages={recentMessages} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
