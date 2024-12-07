"use client";
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs'
import { Avatar } from '@nextui-org/react'
import { usePathname } from 'next/navigation'
import React from 'react'

const SigningAvatar = () => {
    const pathname = usePathname();
  return (
    <div className="flex items-center gap-3">
        <LoginLink>
        <Avatar
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              aria-hidden="true"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path d="M12 12a4.8 4.8 0 1 0 0-9.6 4.8 4.8 0 0 0 0 9.6m0-8.4c1.985 0 3.6 1.615 3.6 3.6s-1.615 3.6-3.6 3.6a3.605 3.605 0 0 1-3.6-3.6c0-1.985 1.616-3.6 3.6-3.6m1.901 10.2H10.1a6.5 6.5 0 0 0-6.5 6.499 1.3 1.3 0 0 0 1.3 1.3h14.2a1.297 1.297 0 0 0 1.299-1.3 6.5 6.5 0 0 0-6.499-6.5Zm5.198 6.6h-14.2a.1.1 0 0 1-.099-.101 5.305 5.305 0 0 1 5.299-5.3h3.799a5.306 5.306 0 0 1 5.302 5.3.1.1 0 0 1-.101.1Z"></path>
            </svg>
          }
          className={pathname == "/" ? "animate-shadowPulse" : "animate-shadowPulseBlue"}
          color="primary"
          isBordered
          alt="Se connecter"
          size="md"
        />
        </LoginLink>
    </div>
  )
}

export default SigningAvatar