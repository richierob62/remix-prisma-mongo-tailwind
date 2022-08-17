import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { bumpNumber, getCurrentNumber } from '~/services/other/number'
import {
  getFilteredMessages,
  getRecentMessages
} from '~/services/messages/message.server'
import { getUser, getUserId, requireUserId } from '~/services/user/auth.server'
import { json, redirect } from '@remix-run/node'

import Layout from '~/components/layout'
import Message from '~/components/message'
import type { MessageWithAuthor } from '../utils/types.server'
import { NonNavForm } from '~/components/non_nav_form'
import type { Prisma } from '@prisma/client'
import { RecentMessages } from '~/components/recent_messages'
import { SearchBar } from '~/components/search_bar'
import UserPanel from '~/components/user_panel'
import { getOtherUsers } from '~/services/user/user.server'

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  const userId = await getUserId(request)

  if (!userId) return null

  const users = await getOtherUsers(userId)

  const user = await getUser(request)

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

  const number = await getCurrentNumber()

  return json({ users, messages, recentMessages, user, number })
}

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request)

  const formData = await request.formData()

  const formAction = formData.get('_action')

  switch (formAction) {
    case 'increase':
      await bumpNumber(1)
      return redirect(`/home`)

    case 'decrease':
      await bumpNumber(-1)
      return redirect(`/home`)

    default:
      return json({ error: 'Invalid action' }, { status: 400 })
  }
}

const Home = () => {
  const { users, messages, recentMessages, user } = useLoaderData()

  return (
    <Layout>
      <div className="h-full flex">
        <Outlet />
        <UserPanel users={users} />
        <div className="flex flex-col flex-1">
          <SearchBar profile={user.profile} />
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
          {/* <NonNavForm /> */}
        </div>
      </div>
    </Layout>
  )
}

export default Home
