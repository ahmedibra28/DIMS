import {
  FaSchool,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaMoneyCheckAlt,
  FaDollarSign,
  FaPrint,
} from 'react-icons/fa'
import Message from '../Message'
import Loader from 'react-loader-spinner'
import { getNotices } from '../../api/notice'
import {
  getStudentTuitionsReport,
  getStudentMarkSheetReport,
} from '../../api/report'

import { useQuery } from 'react-query'
import moment from 'moment'
import CountUp from 'react-countup'
import { useRef, useState } from 'react'
import InvoiceTemplate from '../InvoiceTemplate'
import { useReactToPrint } from 'react-to-print'

const Student = () => {
  const [stdPaymentInfo, setStdPaymentInfo] = useState(null)
  const {
    data: noticeData,
    isLoading: isLoadingNotice,
    isError: isErrorNotice,
    error: errorNotice,
  } = useQuery('notices', () => getNotices(), {
    retry: 0,
  })

  const {
    data: tuitionData,
    isLoading: isLoadingTuition,
    isError: isErrorTuition,
    error: errorTuition,
  } = useQuery(['student tuitions'], () => getStudentTuitionsReport(), {
    retry: 0,
  })

  const {
    data: markSheetData,
    isLoading: isLoadingMarkSheet,
    isError: isErrorMarkSheet,
    error: errorMarkSheet,
  } = useQuery(['student markSheets'], () => getStudentMarkSheetReport(), {
    retry: 0,
  })

  const payHandler = (data) => {
    console.log(data)
  }

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Invoice',
  })

  const rowAverage = (exam) => {
    const totalEarnedMarks =
      Number(exam.theoryMarks) + Number(exam.practicalMarks)
    const totalOriginalMarks =
      Number(exam.subject && exam.subject.theoryMarks) +
      Number(exam.subject && exam.subject.practicalMarks)
    return (totalEarnedMarks / totalOriginalMarks) * 100
  }

  return (
    <div className='row mt-1'>
      <div className='col-md-5 col-12'>
        <div className='row'>
          <div className='col-12 shadow pb-2'>
            <h5>Latest Current Semester Exam Records</h5> <hr />
            {isLoadingMarkSheet ? (
              <div className='text-center'>
                <Loader
                  type='ThreeDots'
                  color='#00BFFF'
                  height={100}
                  width={100}
                  timeout={3000} //3 secs
                />
              </div>
            ) : isErrorMarkSheet ? (
              <Message variant='danger'>{errorMarkSheet}</Message>
            ) : (
              <>
                <div className='table-responsive dashboard_student_exam'>
                  <table className='table table-striped table-hover table-sm'>
                    <thead>
                      <tr>
                        <th>DATE</th>
                        <th>EXAM </th>
                        <th>SUBJECT</th>
                        <th>TH.</th>
                        <th>P.</th>
                        <th>AVERAGE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {markSheetData &&
                        markSheetData.map(
                          (data) =>
                            data &&
                            data.map((exam) => (
                              <tr key={exam._id}>
                                <td>{exam.createdAt.slice(0, 10)}</td>
                                <td>{exam.exam}</td>
                                <td>{exam.subject && exam.subject.name}</td>
                                <td>{exam.theoryMarks}</td>
                                <td>{exam.practicalMarks}</td>
                                <td>{rowAverage(exam).toFixed(2)}%</td>
                              </tr>
                            ))
                        )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          <div className='col-12'>Exam Clearance Card</div>
          <div className='col-12'>Attendance Status Average </div>
        </div>
      </div>

      <div className='col-md-4 col-6  border border-primary border-bottom-0 border-top-0 border-end-0'>
        <h5>Latest Tuition Fee Transactions</h5> <hr />
        {isLoadingTuition ? (
          <div className='text-center'>
            <Loader
              type='ThreeDots'
              color='#00BFFF'
              height={100}
              width={100}
              timeout={3000} //3 secs
            />
          </div>
        ) : isErrorTuition ? (
          <Message variant='danger'>{errorTuition}</Message>
        ) : (
          <>
            <div className='table-responsive '>
              <table className='table table-striped table-hover table-sm'>
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>AMOUNT</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {tuitionData &&
                    tuitionData.map(
                      (tuition) =>
                        tuition.isActive && (
                          <tr key={tuition._id}>
                            <td>
                              {moment(tuition.createdAt).format('MMM Do YY')}
                            </td>
                            <td>${tuition.amount.toFixed(2)}</td>
                            {tuition.isPaid ? (
                              <td>
                                {' '}
                                <button
                                  className='btn btn-success btn-sm'
                                  onClick={() => {
                                    setStdPaymentInfo(tuition)
                                  }}
                                  data-bs-toggle='modal'
                                  data-bs-target='#invoicePrint'
                                >
                                  <FaPrint className='mb-1' />
                                </button>
                              </td>
                            ) : (
                              <td>
                                <button className='btn btn-primary btn-sm'>
                                  <FaDollarSign classNam='mb-1' /> Pay
                                </button>
                              </td>
                            )}
                          </tr>
                        )
                    )}
                </tbody>
              </table>
            </div>
            <div
              className='modal fade'
              id='invoicePrint'
              data-bs-backdrop='static'
              data-bs-keyboard='false'
              tabIndex='-1'
              aria-labelledby='invoicePrint'
              aria-hidden='true'
            >
              <div className='modal-dialog modal-lg'>
                <div className='modal-content'>
                  <div className='modal-header'>
                    <h5 className='modal-title' id='invoicePrint'>
                      Tuition Fee Invoice
                    </h5>
                    <button
                      type='button'
                      className='btn-close'
                      data-bs-dismiss='modal'
                      aria-label='Close'
                    ></button>
                  </div>
                  <div ref={componentRef}>
                    <InvoiceTemplate stdPaymentInfo={stdPaymentInfo} />
                  </div>
                  <div className='modal-footer'>
                    <button
                      type='button'
                      className='btn btn-secondary'
                      data-bs-dismiss='modal'
                    >
                      Close
                    </button>

                    <button
                      onClick={handlePrint}
                      type='submit'
                      className='btn btn-success '
                    >
                      <FaPrint className='mb-1' />
                      Print
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className='col-md-3 col-6  border border-primary border-bottom-0 border-top-0 border-end-0'>
        <h5>Latest Notices</h5> <hr />
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
          noticeData.map(
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
  )
}

export default Student
