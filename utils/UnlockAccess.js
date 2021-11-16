import { customLocalStorage } from './customLocalStorage'

export const UnlockAccess = (roles) => {
  return roles.includes(
    customLocalStorage() &&
      customLocalStorage().userInfo &&
      customLocalStorage().userInfo.group
  )
}

export const Access = {
  admin: ['admin'],
  user: ['user'],
  student: ['student'],
  instructor: ['instructor'],
  adminUser: ['admin', 'user'],
  adminFinance: ['admin', 'finance'],
  adminFinanceInstructor: ['admin', 'finance', 'instructor'],
  superAdmin: ['admin', 'user', 'instructor', 'finance', 'student'],
}
