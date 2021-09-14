import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import { studentClearance } from '../api/tickets'
import { useQuery } from 'react-query'

const ClearanceScreen = ({ match }) => {
  const { student } = match.params

  const { data, isLoading, isError, error } = useQuery(
    'student-clearance',
    () => studentClearance(student && student),
    {
      retry: 0,
    }
  )

  return (
    <div>
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
      ) : isError ? (
        <>
          <Message variant='danger'>{error}</Message>
          <div
            className='alert alert-danger m-5 text-center shadow'
            role='alert'
          >
            <h4 className='alert-heading'>Sorry!</h4>
            <p>This student is not clean</p>
            <hr />
          </div>
        </>
      ) : (
        <div
          className='alert alert-success m-5 text-center shadow'
          role='alert'
        >
          <h4 className='alert-heading'>Well done!</h4>
          <p>This student {data && data.fullName.toUpperCase()} is clean.</p>
          <hr />

          <div className='card w-50 mx-auto'>
            <img
              src={data && data.picture && data.picture.picturePath}
              alt={data && data.picture && data.picture.pictureName}
              className='img-fluid  card-img-top'
            />
            <div className='card-body'>
              <h5 className='card-title'>{data && data.rollNo}</h5>
              <h5 className='card-title'>
                {data && data.fullName.toUpperCase()}
              </h5>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClearanceScreen
