import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type UserInfo = {
  readonly id?: string
  name: string
  email: string
  token: null
  role: string
  mobile: number
  routes: any[]
  menu: any[]
  image?: string
  instructorId?: string
  studentId?: string
}

type UserInfoStore = {
  userInfo: UserInfo
  updateUserInfo: (userInfo: UserInfo) => void
  logout: () => void
}

const useUserInfoStore = create(
  persist<UserInfoStore>(
    (set) => ({
      userInfo: {
        id: '',
        name: '',
        email: '',
        token: null,
        role: '',
        mobile: 0,
        routes: [],
        menu: [],
        image: '',
        instructorId: '',
        studentId: '',
      },
      updateUserInfo: (userInfo) => {
        return set((state) => ({
          userInfo: {
            ...state.userInfo,
            ...userInfo,
          },
        }))
      },
      logout: () => {
        return set((state) => ({
          userInfo: {
            ...state.userInfo,
            id: '',
            name: '',
            email: '',
            token: null,
            role: '',
            mobile: 0,
            routes: [],
            menu: [],
            image: '',
            instructorId: '',
            studentId: '',
          },
        }))
      },
    }),
    {
      name: 'userInfo',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useUserInfoStore
