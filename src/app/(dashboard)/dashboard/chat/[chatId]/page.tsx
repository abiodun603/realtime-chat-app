import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { messageArrayValidator } from '@/lib/validation/messages'
import { getServerSession } from 'next-auth'
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
    <div>page</div>
  )
}

export default page