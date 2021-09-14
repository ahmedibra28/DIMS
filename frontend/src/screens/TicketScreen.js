import { FaPrint } from 'react-icons/fa'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import { getStudentTicket } from '../api/tickets'
import { useQuery } from 'react-query'
import QRCode from 'react-qr-code'

const TicketScreen = () => {
  const student = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

  const { data, isLoading, isError, error } = useQuery(
    'student-ticket',
    () => getStudentTicket(student && student.student),
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
        <Message variant='danger'>{error}</Message>
      ) : (
        <div className='row'>
          <div className='col-8 mx-auto'>
            <div className='row shadow p-3'>
              <div className='col-6'>
                <img
                  src={
                    data.student &&
                    data.student.picture &&
                    data.student.picture.picturePath
                  }
                  alt={
                    data.student &&
                    data.student.picture &&
                    data.student.picture.pictureName
                  }
                  className='img-fluid'
                />
              </div>
              <div className='col-6'>
                <QRCode
                  fgColor='#005aab'
                  value={`http://localhost:3006/clearance/${data.student._id}`}
                />
              </div>
              <div className='col-12 text-center'>
                <hr />
                <h4 className='card-title fw-bold font-monospace'>
                  {data.student.rollNo.toUpperCase()}
                </h4>
                <h4 className='card-title fw-bold font-monospace'>
                  {data.student.fullName.toUpperCase()}
                </h4>
                <h4
                  className='card-title fw-lighter font-monospace'
                  style={{ letterSpacing: '1rem' }}
                >
                  {data.student.mobileNumber}
                </h4>
                <button className='btn btn-primary mt-2 form-control shadow'>
                  <FaPrint className='mb-1' /> Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TicketScreen
