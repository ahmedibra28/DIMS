// import { getUsers } from '../api/users'
// import { useQuery } from 'react-query'

const HomeScreen = () => {
  // const { data, isLoading } = useQuery('users', getUsers, { retry: 0 })
  // console.log(!isLoading && data)

  return (
    <div className='text-center'>
      <h1 className='fs-6 fw-lighter'>Welcome To</h1>
      <p className='fw-lighter display-6 '>
        Digital Information Management System{' '}
      </p>
      <h1 className='fw-lighter display-1 text-primary'>DIMS</h1>
      <span className='spinner-grow mt-5' /> <br />
    </div>
  )
}

export default HomeScreen
