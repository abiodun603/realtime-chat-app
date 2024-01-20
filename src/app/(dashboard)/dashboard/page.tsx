import React from 'react'

// ** libs
import { authOptions } from '@/lib/auth'

// ** Thired Party
import { getServerSession } from 'next-auth'

const Dashboard = async ({}) => {
  const session = await getServerSession(authOptions)

  return (
    <p>{JSON.stringify(session)}</p>
  )
}

export default Dashboard