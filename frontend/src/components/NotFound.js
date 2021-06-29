import { FaExclamationCircle } from 'react-icons/fa'
import Loader from 'react-loader-spinner'

const NotFound = () => {
  return (
    <div>
      <div className='text-danger text-center mt-5 '>
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={0} //3 secs
          />
        </div>
      </div>
      <h1 className='text-danger text-center  display-1'>
        <FaExclamationCircle />
      </h1>
      <h1 className='text-danger text-center  display-3'>Page Not Found</h1>
      <p className='text-center text-muted'>Sorry, this page does not exist</p>
    </div>
  )
}

export default NotFound
