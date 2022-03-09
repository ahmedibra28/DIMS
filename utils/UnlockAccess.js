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
  adminFinance: ['admin', 'finance', 'super admin', 'examination'],
  adminFinanceInstructor: ['admin', 'finance', 'instructor', 'super admin'],
  superAdmin: ['super admin'],
  admins: ['super admin', 'admin'],
}
