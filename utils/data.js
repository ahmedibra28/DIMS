export const routes = () => {
  return [
    {
      isActive: true,
      menu: 'Hidden',
      path: '/',
      name: 'Home',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/logon',
      name: 'User Logs',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/users',
      name: 'Users',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/groups',
      name: 'Groups',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/routes',
      name: 'Routes',
    },
    {
      isActive: true,
      menu: 'Profile',
      path: '/profile',
      name: 'Profile',
    },
    {
      isActive: true,
      menu: 'Setting',
      path: '/setting/course-type',
      name: 'Course Type',
    },
    {
      isActive: true,
      menu: 'Setting',
      path: '/setting/course',
      name: 'Course',
    },
    {
      isActive: true,
      menu: 'Setting',
      path: '/setting/subject',
      name: 'Subject',
    },
    {
      isActive: true,
      menu: 'Setting',
      path: '/setting/instructor',
      name: 'Instructor',
    },
    {
      isActive: true,
      menu: 'Setting',
      path: '/setting/student',
      name: 'Student',
    },
    {
      isActive: true,
      menu: 'Normal',
      path: '/attendance',
      name: 'Attendance',
    },
    {
      isActive: true,
      menu: 'Setting',
      path: '/setting/notice',
      name: 'Notice',
    },
    {
      isActive: true,
      menu: 'Report',
      path: '/report/attendance-report',
      name: 'Attendance',
    },
    {
      isActive: true,
      menu: 'Setting',
      path: '/setting/tuition/generation',
      name: 'Generation Tuition',
    },
    {
      isActive: true,
      menu: 'Setting',
      path: '/setting/tuition/tuition',
      name: 'Tuition Fee',
    },
    {
      isActive: true,
      menu: 'Report',
      path: '/report/tuition-report',
      name: 'Tuition Fee',
    },
    {
      isActive: true,
      menu: 'Setting',
      path: '/setting/clearance-card-generator',
      name: 'Clearance Card Generator',
    },
    {
      isActive: true,
      menu: 'Normal',
      path: '/clearance-confirmation',
      name: 'Clearance Confirmation',
    },
  ]
}

export const groups = (ids) => {
  return [
    {
      name: 'admin',
      isActive: true,
      route: ids,
    },
    {
      name: 'instructor',
      isActive: true,
      route: [],
    },
    {
      name: 'finance',
      isActive: true,
      route: [],
    },
    {
      name: 'student',
      isActive: true,
      route: [],
    },
  ]
}

export const users = () => {
  return [
    {
      password: '123456',
      name: 'Ahmed',
      email: 'ahmaat19@gmail.com',
      group: 'admin',
    },
  ]
}
