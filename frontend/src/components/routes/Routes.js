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
import feeGenerationScreen from '../../screens/feeGenerationScreen'

const Routes = () => {
  return (
    <section className='mx-auto mt-5'>
      <Switch>
        <Route exact path='/' component={HomeScreen} />
        <Route path='/forgotpassword' component={ForgotPasswordScreen} />
        <Route path='/login' component={LoginScreen} />
        <Route path='/register' r component={RegisterScreen} />

        <PrivateRoute
          role={['Admin', 'User', 'Instructor']}
          path='/profile'
          component={ProfileScreen}
        />

        <Route
          path='/resetpassword/:resetToken'
          component={ResetPasswordScreen}
        />
        <PrivateRoute
          path='/admin/users/logs'
          role={['Admin']}
          component={UserLogHistoryScreen}
        />
        <PrivateRoute
          exact
          path='/admin/users'
          role={['Admin']}
          component={UserListScreen}
        />
        <PrivateRoute
          path='/admin/users/page/:pageNumber'
          role={['Admin']}
          component={UserListScreen}
        />
        <PrivateRoute
          role={['Admin', 'User']}
          path='/student'
          exact
          component={StudentScreen}
        />
        <PrivateRoute
          role={['Admin', 'User']}
          path='/instructor'
          exact
          component={InstructorScreen}
        />
        <PrivateRoute
          role={['Admin', 'User']}
          path='/course-type'
          component={CourseTypeScreen}
        />
        <PrivateRoute
          role={['Admin', 'User']}
          path='/course'
          component={CourseScreen}
        />
        <PrivateRoute
          role={['Admin', 'User']}
          path='/subject'
          component={SubjectScreen}
        />
        <PrivateRoute
          exact
          role={['Admin', 'User']}
          path='/student/:id'
          component={StudentDetailScreen}
        />
        <PrivateRoute
          exact
          role={['Admin', 'User']}
          path='/instructor/:id'
          component={InstructorDetailScreen}
        />

        <PrivateRoute
          exact
          role={['Admin', 'User']}
          path='/student/mark-sheet/:studentId/:assignedCourseId/:semesterNo/:shift/:semesterStatus'
          component={MarkSheetScreen}
        />

        <PrivateRoute
          exact
          role={['Admin', 'Instructor']}
          path='/attendance'
          component={AttendanceScreen}
        />
        <PrivateRoute
          exact
          role={['Admin', 'Instructor']}
          path='/attendance/report'
          component={AttendanceScreenReport}
        />
        <PrivateRoute
          exact
          role={['Admin']}
          path='/mark-sheet/report'
          component={MarkSheetScreenReport}
        />
        <PrivateRoute
          exact
          role={['Admin']}
          path='/fee'
          component={FeeScreen}
        />
        <PrivateRoute
          exact
          role={['Admin']}
          path='/fee/generate'
          component={feeGenerationScreen}
        />

        <Route component={NotFound} />
      </Switch>
    </section>
  )
}

export default Routes
