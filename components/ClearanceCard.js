import moment from 'moment'
import { FaCheckCircle, FaPhone, FaAward } from 'react-icons/fa'
import ImageLazyLoad from './LazyLoad'

const ClearanceCard = ({ clearancesData }) => {
  if (clearancesData && clearancesData.course) {
    const d = clearancesData && clearancesData.course ? clearancesData : {}
    return (
      <div className='modal-body'>
        <div className='row gy-5'>
          {d && d.course && (
            <>
              <div className='col-lg-6 col-md-10 col-12 mx-auto'>
                <div className='card shadow-lg clearance'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-auto border border-primary border-start-0 border-top-0 border-bottom-0 d-flex flex-column justify-content-around'>
                        <ImageLazyLoad
                          height={100}
                          width={100}
                          image='/samtec-logo.png'
                          alt='logo'
                        />
                        <ImageLazyLoad
                          height={100}
                          width={100}
                          image={d.student.picture.picturePath}
                          alt={d.student.picture.picturePath}
                          circle={true}
                        />
                      </div>
                      <div className='col-8'>
                        <div className='text-center'>
                          <div className='approved bg-success text-uppercase'>
                            <FaCheckCircle className='me-1' />
                            Approved
                          </div>
                          <h4 className='card-title text-primary fw-bold fs-6 font-monospace patientID'>
                            {d.student.rollNo}
                          </h4>
                          <h6 className='card-title text-primary fw-bold font-monospace text-uppercase'>
                            EXAM CLEARANCE CARD @{' '}
                            {moment(d.generatedAt).format('LL')}
                          </h6>
                          <h5 className='card-title text-primary fw-bold text-uppercase'>
                            SAYID MOHAMED TECHNICAL EDUCATION COLLEGE <br />
                            (SaMTEC)
                          </h5>{' '}
                          <hr />
                          <h4 className='card-title text-primary fw-bold font-monospace text-uppercase'>
                            {d.student.fullName}
                          </h4>
                          <span className='  fs-6 text-uppercase'>
                            {d.course}
                          </span>
                          <br />
                          <span className='  fs-6 text-uppercase'>
                            {d.exam} - {d.academic}
                          </span>
                        </div>
                        <hr />

                        <div className='card border-0'>
                          <ul className='list-group list-group-flush'>
                            <li className='list-group-item'>
                              <FaAward className='mb-1 me-1 text-primary' />
                              <span className='  fs-6'>
                                Semester {d.semester}, {d.shift} Shift
                              </span>
                            </li>

                            <li className='list-group-item'>
                              <FaPhone className='mb-1 me-1 text-primary' />
                              <span className='  fs-6'>
                                {d.student.mobileNumber}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  } else return <span>Nothing</span>
}

export default ClearanceCard
