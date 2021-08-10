import AdminDashboard from './AdminDashboard'
// import InstructorDashboard from './InstructorDashboard'
import FinanceDashboard from './FinanceDashboard'
import StudentDashboard from './StudentDashboard'
import AttendanceScreen from './AttendanceScreen'

const HomeScreen = () => {
  const group =
    localStorage.getItem('userInfo') &&
    JSON.parse(localStorage.getItem('userInfo')).group

  if (group === 'admin') {
    return <AdminDashboard />
  }
  if (group === 'instructor') {
    return <AttendanceScreen />
  }
  if (group === 'finance') {
    return <FinanceDashboard />
  }
  if (group === 'student') {
    return <StudentDashboard />
  } else {
    return <h1>You don't have any privilege to view this page</h1>
  }
}

export default HomeScreen
