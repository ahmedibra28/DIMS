'use client'

import Instructor from '@/components/dashboard/Instructor'
import Student from '@/components/dashboard/Student'
import SuperAdmin from '@/components/dashboard/SuperAdmin'
import useUserInfoStore from '@/zustand/userStore'
import dynamic from 'next/dynamic'

function Home() {
  const { userInfo } = useUserInfoStore(state => state)

  return (
    <div>
      {userInfo.role === 'STUDENT' && <Student />}
      {userInfo.role === 'SUPER_ADMIN' && <SuperAdmin />}
      {userInfo.role === 'INSTRUCTOR' && <Instructor />}
    </div>
  )
}

export default dynamic(() => Promise.resolve(Home), { ssr: false })
