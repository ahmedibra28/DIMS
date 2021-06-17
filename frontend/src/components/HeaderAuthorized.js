import { Link } from 'react-router-dom'
import {
  FaBook,
  FaChalkboardTeacher,
  FaCog,
  FaFileContract,
  FaLeanpub,
  FaTable,
  FaUser,
  FaUserCircle,
  FaUserGraduate,
  FaUsers,
} from 'react-icons/fa'
import logo from '../logo.png'

const HeaderAuthorized = () => {
  const userInfo =
    localStorage.getItem('userInfo') &&
    JSON.parse(localStorage.getItem('userInfo'))

  return (
    <div>
      <nav className='sticky-top' id='sidebar'>
        <div className='container-fluid pt-3'>
          <Link to='/' className='navbar-brand fw-bold fs-6'>
            <img src={logo} alt='logo' width='30' /> SaMTEC - DIMS
          </Link>
          <ul
            className='navbar-nav text-light d-flex justify-content-between'
            style={{ height: 'calc(100vh - 100px)' }}
          >
            <div>
              <li className='nav-item'>
                <Link to='/course-type' className='nav-link'>
                  <FaLeanpub className='mb-1' /> Course Type
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/course' className='nav-link'>
                  <FaLeanpub className='mb-1' /> Courses
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/subject' className='nav-link'>
                  <FaBook className='mb-1' /> Subjects
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/student' className='nav-link'>
                  <FaUserGraduate className='mb-1' /> Students
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/instructor' className='nav-link'>
                  <FaChalkboardTeacher className='mb-1' /> Instructor
                </Link>
              </li>
              <li className='nav-item'>
                <Link to='/mark-sheet' className='nav-link'>
                  <FaTable className='mb-1' /> Mark Sheet Report
                </Link>
              </li>
            </div>

            <div style={{ marginBottom: '-3rem' }}>
              <li className='nav-item dropdown'>
                <span
                  className='nav-link dropdown-toggle'
                  id='navbarDropdown'
                  role='button'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  <FaUserCircle className='mb-1' /> {userInfo && userInfo.name}
                </span>
                <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
                  <li>
                    <Link to='/profile' className='dropdown-item'>
                      <FaUser className='mb-1' /> Profile
                    </Link>
                  </li>
                </ul>
              </li>
              {userInfo && userInfo.roles.includes('Admin') && (
                <li className='nav-item dropdown '>
                  <span
                    className='nav-link dropdown-toggle'
                    id='navbarDropdown'
                    role='button'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'
                  >
                    <FaCog className='mb-1' /> Admin
                  </span>
                  <ul
                    className='dropdown-menu '
                    aria-labelledby='navbarDropdown'
                  >
                    <li>
                      <Link to='/admin/users' className='dropdown-item'>
                        <FaUsers className='mb-1' /> Users
                      </Link>
                    </li>
                    <li>
                      <Link to='/admin/users/logs' className='dropdown-item'>
                        <FaFileContract className='mb-1' /> Users Log
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
            </div>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default HeaderAuthorized
