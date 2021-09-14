import React from 'react'
import { Route, Switch } from 'react-router-dom'

import HomeScreen from '../../screens/HomeScreen'
import LoginScreen from '../../screens/LoginScreen'
import ProfileScreen from '../../screens/ProfileScreen'
import RegisterScreen from '../../screens/RegisterScreen'
import UserListScreen from '../../screens/UserListScreen'
import NotFound from '../NotFound'

import PrivateRoute from './PrivateRoute'
import UserLogHistoryScreen from '../../screens/LogHistoryScreen'
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen'
import ResetPasswordScreen from '../../screens/ResetPasswordScreen'
import StudentScreen from '../../screens/StudentScreen'
import CourseTypeScreen from '../../screens/CourseTypeScreen'
import CourseScreen from '../../screens/CourseScreen'
import StudentDetailScreen from '../../screens/StudentDetailScreen'
import SubjectScreen from '../../screens/SubjectScreen'
import InstructorScreen from '../../screens/InstructorScreen'
import InstructorDetailScreen from '../../screens/InstructorDetailScreen'
import MarkSheetScreen from '../../screens/MarkSheetScreen'
import AttendanceScreen from '../../screens/AttendanceScreen'
import AttendanceScreenReport from '../../screens/AttendanceScreenReport'
import MarkSheetScreenReport from '../../screens/MarkSheetScreenReport'
import FeeScreen from '../../screens/FeeScreen'
import FeeGenerationScreen from '../../screens/FeeGenerationScreen'
import FeeScreenReport from '../../screens/FeeScreenReport'
import NoticeScreen from '../../screens/NoticeScreen'
import GroupScreen from '../../screens/GroupScreen'
import RouteScreen from '../../screens/RouteScreen'
import TicketScreen from '../../screens/TicketScreen'
import { getGroups } from '../../api/groups'
import { useQuery } from 'react-query'
import ClearanceScreen from '../../screens/ClearanceScreen'

const Routes = () => {
  const { data: groupData, isLoading } = useQuery('groups', () => getGroups(), {
    retry: 0,
  })

  let group = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')).group
    : null

  const switchRoutes = (component) => {
    switch (component) {
      case 'ProfileScreen':
        return ProfileScreen
      case 'HomeScreen':
        return HomeScreen
      case 'UserListScreen':
        return UserListScreen
      case 'UserLogHistoryScreen':
        return UserLogHistoryScreen
      case 'GroupScreen':
        return GroupScreen
      case 'RouteScreen':
        return RouteScreen
      case 'StudentScreen':
        return StudentScreen
      case 'CourseTypeScreen':
        return CourseTypeScreen
      case 'CourseScreen':
        return CourseScreen
      case 'StudentDetailScreen':
        return StudentDetailScreen
      case 'SubjectScreen':
        return SubjectScreen
      case 'InstructorScreen':
        return InstructorScreen
      case 'MarkSheetScreen':
        return MarkSheetScreen
      case 'AttendanceScreen':
        return AttendanceScreen
      case 'InstructorDetailScreen':
        return InstructorDetailScreen
      case 'AttendanceScreenReport':
        return AttendanceScreenReport
      case 'MarkSheetScreenReport':
        return MarkSheetScreenReport
      case 'FeeScreen':
        return FeeScreen
      case 'FeeGenerationScreen':
        return FeeGenerationScreen
      case 'FeeScreenReport':
        return FeeScreenReport
      case 'NoticeScreen':
        return NoticeScreen
      case 'TicketScreen':
        return TicketScreen
      case 'ClearanceScreen':
        return ClearanceScreen
      default:
        return NotFound
    }
  }

  return (
    <section className='mx-auto mt-2'>
      {isLoading ? (
        'Loading...'
      ) : (
        <Switch>
          {groupData &&
            groupData.map(
              (route) =>
                route.name === group &&
                route.isActive &&
                route.route.map((r) => (
                  <PrivateRoute
                    exact
                    path={r.path}
                    component={switchRoutes(r.component)}
                    role={[route.name]}
                  />
                ))
            )}

          <Route
            exact
            path='/forgotpassword'
            component={ForgotPasswordScreen}
          />
          <Route exact path='/login' component={LoginScreen} />
          {/* <Route exact path='/clearance/:student' component={ClearanceScreen} /> */}
          <Route exact path='/register' component={RegisterScreen} />
          <Route
            exact
            path='/resetpassword/:resetToken'
            component={ResetPasswordScreen}
          />
          <Route component={NotFound} />

          {/* <PrivateRoute exact path='/' component={HomeScreen} role={['admin']} />
        <PrivateRoute
          role={['admin', 'user', 'instructor']}
          path='/profile'
          component={ProfileScreen}
        />

        <PrivateRoute
          path='/admin/users/logs'
          role={['admin']}
          component={UserLogHistoryScreen}
        />
        <PrivateRoute
          exact
          path='/admin/users'
          role={['admin']}
          component={UserListScreen}
        />
        <PrivateRoute
          role={['admin', 'user']}
          path='/student'
          exact
          component={StudentScreen}
        />
        <PrivateRoute
          role={['admin']}
          path='/admin/groups'
          exact
          component={GroupScreen}
        />
        <PrivateRoute
          role={['admin']}
          path='/admin/routes'
          exact
          component={RouteScreen}
        />
        <PrivateRoute
          role={['admin', 'user']}
          path='/instructor'
          exact
          component={InstructorScreen}
        />
        <PrivateRoute
          role={['admin', 'user']}
          path='/course-type'
          component={CourseTypeScreen}
        />
        <PrivateRoute
          role={['admin', 'user']}
          path='/course'
          component={CourseScreen}
        />
        <PrivateRoute
          role={['admin', 'user']}
          path='/subject'
          component={SubjectScreen}
        />
        <PrivateRoute
          exact
          role={['admin', 'user']}
          path='/student/:id'
          component={StudentDetailScreen}
        />
        <PrivateRoute
          exact
          role={['admin', 'user']}
          path='/instructor/:id'
          component={InstructorDetailScreen}
        />

        <PrivateRoute
          exact
          role={['admin', 'user']}
          path='/student/mark-sheet/:studentId/:assignedCourseId/:semesterNo/:shift/:semesterStatus'
          component={MarkSheetScreen}
        />

        <PrivateRoute
          exact
          role={['admin', 'instructor']}
          path='/attendance'
          component={AttendanceScreen}
        />
        <PrivateRoute
          exact
          role={['admin', 'instructor']}
          path='/attendance/report'
          component={AttendanceScreenReport}
        />
        <PrivateRoute
          exact
          role={['admin']}
          path='/mark-sheet/report'
          component={MarkSheetScreenReport}
        />
        <PrivateRoute
          exact
          role={['admin']}
          path='/fee/report'
          component={FeeScreenReport}
        />
        <PrivateRoute
          exact
          role={['admin']}
          path='/fee'
          component={FeeScreen}
        />
        <PrivateRoute
          exact
          role={['admin']}
          path='/fee/generate'
          component={FeeGenerationScreen}
        />

        <PrivateRoute
          exact
          role={['admin']}
          path='/notice'
          component={NoticeScreen}
        /> */}
        </Switch>
      )}
    </section>
  )
}

export default Routes
