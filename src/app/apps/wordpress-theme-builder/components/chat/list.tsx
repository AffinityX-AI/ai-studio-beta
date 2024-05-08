import React from 'react'

import { ChatMessage } from './message'

interface ChatListProps {
  messages: any[]
  aiResponseComplete: boolean
}

export const ChatList: React.FC<ChatListProps> = ({
  messages,
  aiResponseComplete,
}) => {
  return (
    <div className='flex flex-col items-start justify-start gap-4 pb-24 w-full'>
      {messages.length > 0 ? (
        <div className='flex flex-col gap-4 h-full w-full'>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              sender={message.role}
              message={message.content}
              aiResponseComplete={aiResponseComplete}
            />
          ))}
        </div>
      ) : (
        <div className='flex items-center justify-center w-full h-full p-4'>
          <p className='text-gray-300 text-2xl font-normal'>
            Send a message to customize your theme.
          </p>
        </div>
      )}
    </div>
  )
}
