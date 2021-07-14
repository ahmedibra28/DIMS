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

const Routes = () => {
  return (
    <section className='mx-auto mt-2'>
      <Switch>
        <PrivateRoute exact path='/' component={HomeScreen} role={['admin']} />
        <Route path='/forgotpassword' component={ForgotPasswordScreen} />
        <Route path='/login' component={LoginScreen} />
        <Route path='/register' component={RegisterScreen} />

        <PrivateRoute
          role={['admin', 'user', 'instructor']}
          path='/profile'
          component={ProfileScreen}
        />

        <Route
          path='/resetpassword/:resetToken'
          component={ResetPasswordScreen}
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
          path='/admin/users/page/:pageNumber'
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
          path='/admin/users/groups'
          exact
          component={GroupScreen}
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
        />

        <Route component={NotFound} />
      </Switch>
    </section>
  )
}

export default Routes
