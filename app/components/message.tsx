import type { Message as IMessage, Profile } from '@prisma/client'
import { backgroundColorMap, colorMap, emojiMap } from '../utils/constants'

import React from 'react'
import UserAvatar from './userAvatar'
import { formatDistanceToNowStrict } from 'date-fns'

interface MessageProps {
  profile: Profile
  message: Partial<IMessage>
}

const Message: React.FC<MessageProps> = ({ profile, message }) => {
  return (
    <div
      className={`flex ${
        backgroundColorMap[message.style?.backgroundColor || 'RED']
      } py-4 px-4 rounded-xl w-full gap-x-2 relative`}
    >
      <div>
        <UserAvatar profile={profile} classname="w-16 h-16" />
      </div>
      <div className="flex flex-col">
        <p
          className={`${
            colorMap[message.style?.textColor || 'WHITE']
          } font-bold text-lg whitespace-pre-wrap break-all`}
        >{`${profile.firstName} ${profile.lastName}`}</p>
        <p
          className={`${
            colorMap[message.style?.textColor || 'WHITE']
          } whitespace-pre-wrap break-all`}
        >
          {message.messageText}
        </p>
        <p className="italic text-sm text-gray-200">
          {message.createdAt &&
            `${formatDistanceToNowStrict(new Date(message.createdAt))} ago`}
        </p>
        <div className="absolute bottom-4 right-4 bg-white rounded-full h-10 w-10 flex items-center justify-center text-2xl">
          {emojiMap[message.style?.emoji || 'THUMBSUP']}
        </div>
      </div>
    </div>
  )
}

export default Message
