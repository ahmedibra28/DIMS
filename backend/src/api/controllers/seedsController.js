import asyncHandler from 'express-async-handler'
import GroupModel from '../models/groupModel.js'
import User from '../models/userModel.js'
import RouteModel from '../models/routeModel.js'

const routes = () => {
  return [
    {
      isActive: true,
      component: 'HomeScreen',
      path: '/',
      name: 'Dashboard',
    },
    {
      isActive: true,
      component: 'UserLogHistoryScreen',
      path: '/admin/users/logs',
      name: 'User Logs',
    },
    {
      isActive: true,
      component: 'ProfileScreen',
      path: '/profile',
      name: 'Profile',
    },
    {
      isActive: true,
      component: 'UserListScreen',
      path: '/admin/users',
      name: 'Users',
    },
    {
      isActive: true,
      component: 'StudentScreen',
      path: '/student',
      name: 'Student',
    },
    {
      isActive: true,
      component: 'GroupScreen',
      path: '/admin/groups',
      name: 'Group',
    },
    {
      isActive: true,
      component: 'RouteScreen',
      path: '/admin/routes',
      name: 'Routes',
    },
    {
      isActive: true,
      component: 'InstructorScreen',
      path: '/instructor',
      name: 'Instructor',
    },
    {
      isActive: true,
      component: 'CourseScreen',
      path: '/course',
      name: 'Course',
    },
    {
      isActive: true,
      component: 'SubjectScreen',
      path: '/subject',
      name: 'Subject',
    },
    {
      isActive: true,
      component: 'StudentDetailScreen',
      path: '/student/:id',
      name: 'Student Details',
    },
    {
      isActive: true,
      component: 'InstructorDetailScreen',
      path: '/instructor/:id',
      name: 'Instructor Details',
    },
    {
      isActive: true,
      component: 'MarkSheetScreen',
      path: '/student/mark-sheet/:studentId/:assignedCourseId/:semesterNo/:shift/:semesterStatus',
      name: 'Mark Sheet',
    },
    {
      isActive: true,
      component: 'AttendanceScreen',
      path: '/attendance',
      name: 'Attendance',
    },
    {
      isActive: true,
      component: 'MarkSheetScreenReport',
      path: '/mark-sheet/report',
      name: 'Mark Sheet Report',
    },
    {
      isActive: true,
      component: 'FeeScreenReport',
      path: '/fee/report',
      name: 'Fee Report',
    },
    {
      isActive: true,
      component: 'FeeScreen',
      path: '/fee',
      name: 'Fee',
    },
    {
      isActive: true,
      component: 'FeeGenerationScreen',
      path: '/fee/generate',
      name: 'Fee Generation',
    },
    {
      isActive: true,
      component: 'NoticeScreen',
      path: '/notice',
      name: 'Notice',
    },
    {
      isActive: true,
      component: 'CourseTypeScreen',
      path: '/course-type',
      name: 'Course Type',
    },
    {
      isActive: true,
      component: 'AttendanceScreenReport',
      path: '/attendance/report',
      name: 'Attendance Report',
    },
  ]
}

const groups = (ids) => {
  return [
    {
      name: 'admin',
      isActive: true,
      route: ids,
    },
  ]
}

const users = () => {
  return [
    {
      password: '123456',
      name: 'Ahmed',
      email: 'ahmaat19@gmail.com',
      group: 'admin',
    },
  ]
}

export const seeds = asyncHandler(async (req, res) => {
  await RouteModel.deleteMany()
  const routeInsertion = await RouteModel.insertMany(routes())

  if (routeInsertion) {
    const routesId = await RouteModel.find({})

    await GroupModel.deleteMany()
    const groupInsertion = await GroupModel.insertMany(
      groups(routesId.map((r) => r._id))
    )

    if (groupInsertion) {
      await User.deleteMany()
      const userInsertion = await User.create(users())

      if (userInsertion) {
        res.status(201).json({ status: 'success data insertion' })
      } else {
        res.status(400)
        throw new Error('Invalid users data')
      }
    } else {
      res.status(400)
      throw new Error('Invalid groups data')
    }
  } else {
    res.status(400)
    throw new Error('Invalid routes data')
  }
})
