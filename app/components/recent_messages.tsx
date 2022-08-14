import type { MessageWithRecipient } from '../utils/types.server'
import React from 'react'
import { UserAvatar } from './user_avatar'
import { emojiMap } from '../utils/constants'

interface RecentMessagesProps {
  messages: MessageWithRecipient[]
}

export const RecentMessages: React.FC<RecentMessagesProps> = ({ messages }) => {
  return (
    <div className="w-1/5 border-l-4 border-l-yellow-300 flex flex-col items-center ">
      <h2 className="text-xl text-yellow-300 font-semibold px-6 my-6 text-center">
        Recent Messages
      </h2>

      <div className="h-full flex flex-col gap-y-10 mt-10">
        {messages.map((message) => (
          <div className="h-24 w-24 relative" key={message.recipient.id}>
            <UserAvatar
              classname="w-20 h-20"
              profile={message.recipient.profile}
            />
            <div className="h-8 w-8 text-3xl bottom-2 right-4 rounded-full absolute flex justify-center items-center">
              {emojiMap[message.style?.emoji || 'THUMBSUP']}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
