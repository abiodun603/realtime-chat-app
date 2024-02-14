import Messages from '@/components/Messages'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { messageArrayValidator } from '@/lib/validation/messages'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface PageProps {
  params : {
    chatId: string
  }
}

async function getChatMessages(chatId: string) {
  // zrange is a redis structure for sorted array
  try {
    const results: string[] = await fetchRedis(
      "zrange",
     `chat:${chatId}:messages`,
     0,
     -1
    )
    //ordered messages. last message is at the top
    const dbMessages = results.map((message) => JSON.parse(message) as Message)
    // display the message is reverse order we are going to implement this using CSS tricks
    const reversedDbMessages = dbMessages.reverse()

    const messages = messageArrayValidator.parse(reversedDbMessages)

    return messages

  } catch (error) {
    
    notFound()
  }
}

const page = async ({params}: PageProps) => {
  const { chatId } = params

  const session = await getServerSession(authOptions)

  if(!session) notFound();

  const {user} = session

  // /dashboard/chat/userId1--userId2 --
  const [userId1, userId2] = chatId.split("--")

  // user should only be able to view this chat if on of this ids is theirs
  if(user.id !== userId1 && user.id !== userId2){
    notFound()
  }

  //determind which of the ids is the user current id
  const chatParnterId = user.id === userId1 ? userId2 : userId1

  // get the image and data of the chat partner
  const chatPartner = (await db.get(`user:${chatParnterId}`)) as User

  const initialMessages = await getChatMessages(chatId)



  return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6remo)]'>
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
                fill
                referrerPolicy='no-referrer'
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className='rounded-full'
              />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-centr">
              <span className='text-gray-700 mr-3 font-semibold'>{chatPartner.name}</span>
            </div>
            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>

      <Messages initialMessages={initialMessages} sessionId={session.user.id} />
      
    </div>
  )
}

export default page