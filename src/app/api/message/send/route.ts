import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Message, messageValidator } from "@/lib/validation/messages";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const { text, chatId } = await req.json();
    const session = await getServerSession(authOptions)

    if(!session) return new Response("Unauthorized", {status: 401})

    const [userId1, userId2] = chatId.split('--')

    if(session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response("Unauthorized", {status: 401})
    }

    const friendId = session.user.id === userId1 ? userId2 :  userId1
    
    // check if the friendId is in the friend list
    const friendList = await fetchRedis('smembers', `user:${session.user.id}:friends`) as string[]
    const isFriend = friendList.includes(friendId)

    if(!isFriend) {
      return new Response('Unauthorized', { status: 401 })
    }

    // get some information of the sender the display it to the friend the user is chatting with
    const rawSender = await fetchRedis('get', `user:${session.user.id}`) as string
    const sender = JSON.parse(rawSender) as User

    /**
     * end message to the user
     *  1. Notify the user recievning the user in real time 
     * 2. Persist the message in the database
     * 
     * NOTE: zadd means we are adding to a sorted list
     */
    const timestamp = Date.now();
    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp
    }

    const message = messageValidator.parse(messageData)

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message)
    })

    return new Response("OK")

  } catch (error) {
    if(error instanceof Error) {
      return new Response(error.message, { status: 500})
    }

    return new Response("Internal Server Error", {status: 500})
  }
}