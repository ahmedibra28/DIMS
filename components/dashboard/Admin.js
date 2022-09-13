import { FaSchool, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa'
import { Bar } from 'react-chartjs-2'
import Message from '../Message'
import Loader from 'react-loader-spinner'
import { getNotices } from '../../api/notice'
import { getAllTuitions } from '../../api/tuition'
import { getCourseTypes } from '../../api/courseType'
import { getAllStudents } from '../../api/student'
import { getAllInstructors } from '../../api/instructor'

import { useQuery } from 'react-query'
import moment from 'moment'
import CountUp from 'react-countup'

const Admin = () => {
  const {
    data: noticeData,
    isLoading: isLoadingNotice,
    isError: isErrorNotice,
    error: errorNotice,
  } = useQuery('notices', () => getNotices(), {
    retry: 0,
  })

  const {
    data: chartData,
    isLoading: isLoadingFee,
    isError: isErrorFee,
    error: errorFee,
  } = useQuery('fees', () => getAllTuitions(), {
    retry: 0,
  })

  const courseTypeQuery = useQuery('courseTypes', getCourseTypes)
  const allStudentQuery = useQuery('all-students', getAllStudents)
  const allInstructorQuery = useQuery('all-instructors', getAllInstructors)

  const studentData = allStudentQuery?.data?.length
  const courseTypeData = courseTypeQuery?.data?.length
  const instructorData = allInstructorQuery?.data?.length

  const data = {
    labels: chartData?.lastSixMonths,
    datasets: [
      {
        label: 'Collected Fees',
        data: chartData?.totalCollected,
        backgroundColor: '#005aab',
        borderWidth: 0,
      },
      {
        label: 'Un-Collected Fees',
        data: chartData?.totalUnCollected,
        backgroundColor: '#ff6384',
        borderWidth: 0,
      },
    ],
  }

  return (
    <div className='row'>
      <div className='col-md-9 col-12'>
        <div className='row'>
          <div className='col-md-4 col-6'>
            <div className='card mb-3 bg-transparent shadow border-0'>
              <div className='card-body d-flex'>
                <div className='shadow-lg p-2 rounded-pill'>
                  <FaSchool className='mb-1 fs-1 text-primary' />
                </div>
                <div>
                  <div className='ms-3 text-muted'>
                    <span className='fw-bold letter font-monospace'>
                      Schools
                    </span>
                    <br />
                    <span className='fw-light'>
                      <CountUp
                        separator=','
                        end={courseTypeData && courseTypeData}
                        duration={1}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-4 col-6'>
            <div className='card mb-3 bg-transparent shadow border-0'>
              <div className='card-body d-flex'>
                <div className='shadow-lg p-2 rounded-pill'>
                  <FaUserGraduate className='mb-1 fs-1 text-primary' />
                </div>
                <div>
                  <div className='ms-3 text-muted'>
                    <span className='fw-bold letter font-monospace'>
                      Students
                    </span>
                    <br />

                    <span className='fw-light'>
                      <CountUp
                        separator=','
                        end={studentData && studentData}
                        duration={1}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-4 col-6'>
            <div className='card mb-3 bg-transparent shadow border-0'>
              <div className='card-body d-flex'>
                <div className='shadow-lg p-2 rounded-pill'>
                  <FaChalkboardTeacher className='mb-1 fs-1 text-primary' />
                </div>
                <div>
                  <div className='ms-3 text-muted'>
                    <span className='fw-bold letter font-monospace'>
                      Instructors
                    </span>
                    <br />
                    <span className='fw-light'>
                      <CountUp
                        separator=','
                        end={instructorData && instructorData}
                        duration={1}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 mt-3'>
            <div className='card bg-transparent border-0'>
              <h5 className='card-title text-muted'>Fees Collections</h5>
              {isLoadingFee ? (
                <div className='text-center'>
                  <Loader
                    type='ThreeDots'
                    color='#00BFFF'
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                  />
                </div>
              ) : isErrorFee ? (
                <Message variant='danger'>{errorFee}</Message>
              ) : (
                <Bar
                  data={data}
                  // options={options}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='col-md-3 col-12 border border-primary border-bottom-0 border-top-0 border-end-0'>
        <div className='card bg-transparent border-0'>
          <div className='card-body'>
            <h4 className='card-title font-monospace text-center'>
              Notice Board
            </h4>
            <hr />
            {isLoadingNotice ? (
              <div className='text-center'>
                <Loader
                  type='ThreeDots'
                  color='#00BFFF'
                  height={100}
                  width={100}
                  timeout={3000} //3 secs
                />
              </div>
            ) : isErrorNotice ? (
              <Message variant='danger'>{errorNotice}</Message>
            ) : (
              noticeData &&
              noticeData?.slice(0, 2)?.map(
                (notice) =>
                  notice.isActive && (
                    <div key={notice._id} className='card-text'>
                      <p className='badge rounded-pill bg-primary'>
                        {moment(notice.createdAt).format('llll')}
                      </p>
                      <p>
                        <span className='fw-bold'>{notice.title}</span> <br />
                        <span>{notice.description}</span>
                        <br />
                        <span className='text-muted'>
                          {notice.createdBy.name} -{' '}
                          {moment(notice.createdAt).fromNow()}
                        </span>
                      </p>
                    </div>
                  )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
