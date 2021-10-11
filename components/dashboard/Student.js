import { FaDollarSign, FaPrint } from 'react-icons/fa'
import Message from '../Message'
import Loader from 'react-loader-spinner'
import { getNotices } from '../../api/notice'
import {
  getStudentTuitionsReport,
  getStudentMarkSheetReport,
  getStudentClearanceReport,
  getStudentAttendanceReport,
} from '../../api/report'

import { useQuery } from 'react-query'
import moment from 'moment'
import { useRef, useState } from 'react'
import InvoiceTemplate from '../InvoiceTemplate'
import ClearanceCard from '../ClearanceCard'
import { useReactToPrint } from 'react-to-print'

const Student = () => {
  const [stdPaymentInfo, setStdPaymentInfo] = useState(null)
  const [clearanceCardData, setClearanceCardData] = useState(null)
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

  const {
    data: clearancesData,
    isLoading: isLoadingClearance,
    isError: isErrorClearance,
    error: errorClearance,
  } = useQuery(['student clearance'], () => getStudentClearanceReport(), {
    retry: 0,
  })
  const clearanceData = clearancesData && clearancesData.clearance
  const studentData = clearancesData && clearancesData.student

  const {
    data: attendanceData,
    isLoading: isLoadingAttendance,
    isError: isErrorAttendance,
    error: errorAttendance,
  } = useQuery(['student attendance'], () => getStudentAttendanceReport(), {
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

  const componentRefClearance = useRef()
  const handlePrintClearance = useReactToPrint({
    content: () => componentRefClearance.current,
    documentTitle: 'Clearance Card',
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
          <div className='col-12'>
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
                                <td>
                                  {moment(exam.createdAt).format('MMM Do YY')}
                                </td>
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
            <hr />
          </div>
          <div className='col-12 mt-3'>
            <h5>Student Exam Clearance Card</h5> <hr />
            {isLoadingClearance ? (
              <div className='text-center'>
                <Loader
                  type='ThreeDots'
                  color='#00BFFF'
                  height={100}
                  width={100}
                  timeout={3000} //3 secs
                />
              </div>
            ) : isErrorClearance ? (
              <Message variant='danger'>{errorClearance}</Message>
            ) : (
              <>
                <div className='table-responsive'>
                  <table className='table table-striped table-hover table-sm'>
                    <thead>
                      <tr>
                        <th>COURSE</th>
                        <th>EXAM</th>
                        <th>ACADEMIC </th>
                        <th>PRINT </th>
                      </tr>
                    </thead>
                    <tbody>
                      {clearanceData &&
                        clearanceData.map((data) =>
                          data.map((clearance) => (
                            <tr key={clearance._id}>
                              <td>{clearance.exam}</td>
                              <td>{clearance.course.name}</td>
                              <td>{clearance.academic}</td>
                              <td>
                                <button
                                  className='btn btn-success btn-sm'
                                  onClick={() => {
                                    setClearanceCardData(clearance)
                                  }}
                                  data-bs-toggle='modal'
                                  data-bs-target='#clearanceCardPrint'
                                >
                                  <FaPrint className='mb-1' />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                    </tbody>
                  </table>
                </div>
                <div
                  className='modal fade'
                  id='clearanceCardPrint'
                  data-bs-backdrop='static'
                  data-bs-keyboard='false'
                  tabIndex='-1'
                  aria-labelledby='clearanceCardPrint'
                  aria-hidden='true'
                >
                  <div className='modal-dialog modal-lg'>
                    <div className='modal-content'>
                      <div className='modal-header'>
                        <h5 className='modal-title' id='clearanceCardPrint'>
                          Clearance Card
                        </h5>
                        <button
                          type='button'
                          className='btn-close'
                          data-bs-dismiss='modal'
                          aria-label='Close'
                        ></button>
                      </div>
                      <div ref={componentRefClearance}>
                        <ClearanceCard
                          clearance={clearanceCardData}
                          studentData={studentData}
                        />
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
                          onClick={handlePrintClearance}
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
          <div className='col-12 mt-3'>
            <h5>Attendance Status Average</h5> <hr />
            {isLoadingAttendance ? (
              <div className='text-center'>
                <Loader
                  type='ThreeDots'
                  color='#00BFFF'
                  height={100}
                  width={100}
                  timeout={3000} //3 secs
                />
              </div>
            ) : isErrorAttendance ? (
              <Message variant='danger'>{errorAttendance}</Message>
            ) : (
              <>
                <div className='table-responsive '>
                  <table className='table table-striped table-hover table-sm'>
                    <thead>
                      <tr>
                        <th>DATE</th>
                        <th>ATTENDED</th>
                        <th>ABSENT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{moment(new Date()).format('MMMM YYYY')}</td>
                        <td>
                          {attendanceData && attendanceData.attend.length}
                        </td>
                        <td>
                          {attendanceData && attendanceData.absent.length}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className='col-md-4 col-12  border border-primary border-bottom-0 border-top-0 border-end-0'>
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

      <div className='col-md-3 col-12  border border-primary border-bottom-0 border-top-0 border-end-0'>
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
