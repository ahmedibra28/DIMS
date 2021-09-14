import { FaSchool, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa'
import { Bar } from 'react-chartjs-2'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import { getNotices } from '../api/notices'
import { getFees } from '../api/fees'
import { getSSIReport } from '../api/reports'
import { useQuery } from 'react-query'
import moment from 'moment'
import CountUp from 'react-countup'

const FinanceDashboard = () => {
  const {
    data: noticeData,
    isLoading: isLoadingNotice,
    isError: isErrorNotice,
    error: errorNotice,
  } = useQuery('notices', () => getNotices(), {
    retry: 0,
  })

  const {
    data: feeData,
    isLoading: isLoadingFee,
    isError: isErrorFee,
    error: errorFee,
  } = useQuery('fees', () => getFees(), {
    retry: 0,
  })

  const { data: multipleData } = useQuery('counts', () => getSSIReport(), {
    retry: 0,
  })

  const studentData = multipleData && multipleData.students
  const courseTypeData = multipleData && multipleData.courseTypes
  const instructorData = multipleData && multipleData.instructors

  const lastSixMonths = () => {
    let months = []
    moment().startOf('month')
    for (let i = 0; i < 6; i++) {
      months.push(
        moment().startOf('month').subtract(i, 'month').format('MMMM YYYY')
      )
    }
    return months.reverse()
  }

  const month = (index, isPaid) => {
    const mth = []
    feeData &&
      feeData
        .filter(
          (f) =>
            moment(f.createdAt).format('MMMM YYYY') ===
            lastSixMonths().reverse()[index]
        )
        .map((m) => mth.push(m))

    return mth.reduce(
      (acc, curr) =>
        acc + Number(curr && curr.isPaid === isPaid && curr.paidFeeAmount),
      0
    )
  }

  const data = {
    labels: lastSixMonths(),
    datasets: [
      {
        label: 'Collected Fees',
        data: [
          month(5, true),
          month(4, true),
          month(3, true),
          month(2, true),
          month(1, true),
          month(0, true),
        ],
        backgroundColor: '#005aab',
        borderWidth: 0,
      },
      {
        label: 'Un-Collected Fees',
        data: [
          month(5, false),
          month(4, false),
          month(3, false),
          month(2, false),
          month(1, false),
          month(0, false),
        ],
        backgroundColor: '#ff6384',
        borderWidth: 0,
      },
    ],
  }

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
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
                <Bar data={data} options={options} />
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
              noticeData.map((notice) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinanceDashboard
