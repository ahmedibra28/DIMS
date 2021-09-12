import { Link } from 'react-router-dom'
import {
  FaBook,
  FaChalkboardTeacher,
  FaCog,
  FaFileContract,
  FaLeanpub,
  FaTable,
  FaClock,
  FaUser,
  FaUserCircle,
  FaUserGraduate,
  FaUsers,
  FaDollarSign,
  FaChartBar,
  FaBullhorn,
  FaRoute,
  FaClipboardCheck,
} from 'react-icons/fa'
import logo from '../logo.png'
import { getGroups } from '../api/groups'
import { useQuery } from 'react-query'
import Loader from 'react-loader-spinner'

const HeaderAuthorized = () => {
  const { data: groupData, isLoading } = useQuery('groups', () => getGroups(), {
    retry: 0,
  })

  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

  const switchSideBarItems = (route) => {
    const { name, path } = route

    switch (name) {
      case 'Notice':
        return (
          <li className='nav-item'>
            <Link to={path} className='nav-link'>
              <FaBullhorn className='mb-1' /> {name}
            </Link>
          </li>
        )
      case 'Course Type':
        return (
          <li className='nav-item'>
            <Link to={path} className='nav-link'>
              <FaLeanpub className='mb-1' /> {name}
            </Link>
          </li>
        )
      case 'Course':
        return (
          <li className='nav-item'>
            <Link to={path} className='nav-link'>
              <FaLeanpub className='mb-1' /> {name}
            </Link>
          </li>
        )
      case 'Subject':
        return (
          <li className='nav-item'>
            <Link to={path} className='nav-link'>
              <FaBook className='mb-1' /> {name}
            </Link>
          </li>
        )
      case 'Student':
        return (
          <li className='nav-item'>
            <Link to={path} className='nav-link'>
              <FaUserGraduate className='mb-1' /> {name}
            </Link>
          </li>
        )
      case 'Instructor':
        return (
          <li className='nav-item'>
            <Link to={path} className='nav-link'>
              <FaChalkboardTeacher className='mb-1' /> {name}
            </Link>
          </li>
        )
      case 'Fee Generation':
        return (
          <li className='nav-item'>
            <Link to={path} className='nav-link'>
              <FaDollarSign className='mb-1' /> {name}
            </Link>
          </li>
        )
      case 'Fee':
        return (
          <li className='nav-item'>
            <Link to={path} className='nav-link'>
              <FaDollarSign className='mb-1' /> {name}
            </Link>
          </li>
        )
      case 'Attendance':
        return (
          <li className='nav-item'>
            <Link to={path} className='nav-link'>
              <FaClock className='mb-1' /> {name}
            </Link>
          </li>
        )
      case 'Ticket Activation':
        return (
          <li className='nav-item'>
            <Link to={path} className='nav-link'>
              <FaClipboardCheck className='mb-1' /> {name}
            </Link>
          </li>
        )
      case 'Ticket':
        return (
          <li className='nav-item'>
            <Link to={path} className='nav-link'>
              <FaClipboardCheck className='mb-1' /> {name}
            </Link>
          </li>
        )
      default:
        return null
    }
  }

  const switchSideBarDropdown = (route) => {
    const { name, path } = route

    switch (name) {
      case 'Fee Report':
        return (
          <li className='nav-item'>
            <Link to={path} className='dropdown-item'>
              <FaDollarSign className='mb-1' /> {name}
            </Link>
          </li>
        )
      case 'Attendance Report':
        return (
          <li className='nav-item'>
            <Link to={path} className='dropdown-item'>
              <FaClock className='mb-1' /> {name}
            </Link>
          </li>
        )
      case 'Mark Sheet Report':
        return (
          <li className='nav-item'>
            <Link to={path} className='dropdown-item'>
              <FaTable className='mb-1' /> {name}
            </Link>
          </li>
        )
      default:
        return null
    }
  }

  const switchSideBarDropdownAdmin = (route) => {
    const { name, path } = route

    switch (name) {
      case 'Routes':
        return (
          <li className='nav-item'>
            <Link to={path} className='dropdown-item'>
              <FaRoute className='mb-1' /> {name}
            </Link>
          </li>
        )
      case 'Group':
        return (
          <li className='nav-item'>
            <Link to={path} className='dropdown-item'>
              <FaUsers className='mb-1' /> {name}
            </Link>
          </li>
        )
      case 'Users':
        return (
          <li className='nav-item'>
            <Link to={path} className='dropdown-item'>
              <FaUsers className='mb-1' /> {name}
            </Link>
          </li>
        )
      case 'User Logs':
        return (
          <li className='nav-item'>
            <Link to={path} className='dropdown-item'>
              <FaFileContract className='mb-1' /> {name}
            </Link>
          </li>
        )
      default:
        return null
    }
  }

  const switchSideBarDropdownProfile = (route) => {
    const { name, path } = route

    switch (name) {
      case 'Profile':
        return (
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
                <Link to={path} className='dropdown-item'>
                  <FaUser className='mb-1' /> {name}
                </Link>
              </li>
            </ul>
          </li>
        )
      default:
        return null
    }
  }

  return (
    <>
      {isLoading ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : (
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
                {groupData &&
                  groupData.map(
                    (route) =>
                      route.name === userInfo.group &&
                      route.isActive &&
                      route.route.map((r) => (
                        <div key={r._id}> {switchSideBarItems(r)}</div>
                      ))
                  )}

                {['admin', 'finance', 'instructor'].includes(
                  userInfo && userInfo.group
                ) && (
                  <li className='nav-item dropdown '>
                    <span
                      className='nav-link dropdown-toggle'
                      id='navbarDropdown'
                      role='button'
                      data-bs-toggle='dropdown'
                      aria-expanded='false'
                    >
                      <FaChartBar className='mb-1' /> Reports
                    </span>
                    <ul
                      className='dropdown-menu'
                      aria-labelledby='navbarDropdown'
                    >
                      {groupData &&
                        groupData.map(
                          (route) =>
                            route.name === userInfo.group &&
                            route.isActive &&
                            route.route.map((r) => (
                              <div key={r._id}> {switchSideBarDropdown(r)}</div>
                            ))
                        )}
                    </ul>
                  </li>
                )}
              </div>

              <div style={{ marginBottom: '-3rem' }}>
                {groupData &&
                  groupData.map(
                    (route) =>
                      route.name === userInfo.group &&
                      route.isActive &&
                      route.route.map((r) => (
                        <div key={r._id}>
                          {' '}
                          {switchSideBarDropdownProfile(r)}
                        </div>
                      ))
                  )}

                {userInfo && userInfo.group === 'admin' && (
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
                      {groupData &&
                        groupData.map(
                          (route) =>
                            route.name === userInfo.group &&
                            route.isActive &&
                            route.route.map((r) => (
                              <div key={r._id}>
                                {switchSideBarDropdownAdmin(r)}
                              </div>
                            ))
                        )}
                    </ul>
                  </li>
                )}
              </div>
            </ul>
          </div>
        </nav>
      )}
    </>
  )
}

export default HeaderAuthorized
