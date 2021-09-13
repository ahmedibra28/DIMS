import { FaPrint } from 'react-icons/fa'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import { getStudentTicket } from '../api/tickets'
import { useQuery } from 'react-query'

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
        <div className='text-center'>
          <div className='card w-50 text-center mx-auto shadow'>
            <div className='card-img-top'>
              <img
                src='https://www.qr-code-generator.com/wp-content/themes/qr/new_structure/markets/core_market_full/generator/dist/generator/assets/images/websiteQRCode_noFrame.png'
                alt='qr code'
                className='img-fluid w-50'
              />
            </div>

            <div className='card-body'>
              <h4 className='card-title fw-bold font-monospace'>
                {data.student.rollNo.toUpperCase()}
              </h4>
              <h4 className='card-title fw-bold font-monospace'>
                {data.student.fullName.toUpperCase()}
              </h4>
            </div>
          </div>
          <button className='btn btn-primary mt-2 form-control w-50 shadow'>
            <FaPrint className='mb-1' /> Print
          </button>
        </div>
      )}
    </div>
  )
}

export default TicketScreen
