'use client'

import Student from '@/components/dashboard/Student'
import SuperAdmin from '@/components/dashboard/SuperAdmin'
import useUserInfoStore from '@/zustand/userStore'

export default function Home() {
  const { userInfo } = useUserInfoStore(state => state)
  return (
    <div>
      {/* {userInfo.role === 'STUDENT' && <Student />} */}
      {/* {userInfo.role === 'SUPER_ADMIN' && <SuperAdmin />} */}
      <Student />
    </div>
  )
}
