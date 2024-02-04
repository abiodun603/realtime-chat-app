'use client'

import { ButtonHTMLAttributes, FC, useState } from 'react'


// ** Third Party
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Loader, LogOut } from 'lucide-react'

// ** Component
import Button from './ui/Button'


interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({...props}) => {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false)

  return (
   <Button 
    {...props} 
    variant="ghost" 
    onClick={async () => {
      setIsSigningOut(false)
      try {
        await signOut()
      } catch (e) {
        toast.error("There was a problem sigining out")
      } finally {
        setIsSigningOut(false)
      }
    }}
   >
    {isSigningOut ? <Loader className="animate-spin h-4 w-4" /> : <LogOut className="w-4 h-4" />}
   </Button>
  )
}

export default SignOutButton