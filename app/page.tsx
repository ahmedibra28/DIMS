'use client'

import Instructor from '@/components/dashboard/Instructor'
import Student from '@/components/dashboard/Student'
import SuperAdmin from '@/components/dashboard/SuperAdmin'
import useAuthorization from '@/hooks/useAuthorization'
import useUserInfoStore from '@/zustand/userStore'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React from 'react'

function Home() {
  const path = useAuthorization()
  const router = useRouter()

  const { userInfo } = useUserInfoStore(state => state)

  React.useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  return (
    <div>
      {userInfo.role === 'STUDENT' && <Student />}
      {['SUPER_ADMIN', 'ADMIN', 'FINANCE'].includes(userInfo.role) && (
        <SuperAdmin />
      )}
      {userInfo.role === 'INSTRUCTOR' && <Instructor />}
    </div>
  )
}

export default dynamic(() => Promise.resolve(Home), { ssr: false })
