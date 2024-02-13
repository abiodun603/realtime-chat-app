"use client"

import { chatHrefconstructor } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import React, { FC, useEffect, useState } from 'react'

interface SidebarChatListProps {
  friends: User[]
  sessionId: string
}
const SidebarChatList: FC<SidebarChatListProps> = ({friends, sessionId}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages ] = useState<Message[]>([])

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId))
      })
    }
  
  }, [pathname])
  
  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
      {
        friends.sort().map((friend) => {
          const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
            return unseenMsg.senderId === friend.id
          }).length

          return (
            <li key={friend.id}>
              <a 
                href={`/dashboard/chat/${chatHrefconstructor(sessionId, friend.id)}`} 
                className='capitalize text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>{friend.name}</a>
              {
                unseenMessagesCount > 0 ? (
                  <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex items-center justify-center">
                    {unseenMessagesCount}
                  </div>
                ) : null
              }
            </li>
          )
        })
      }
    </ul>
  )
}

export default SidebarChatList