import { useState, useRef } from 'react'
import { getSingleStudentFeeReport } from '../api/reports'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import {
  FaDollarSign,
  FaPrint,
  FaRegCheckCircle,
  FaRegTimesCircle,
} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'
import { useReactToPrint } from 'react-to-print'
import InvoicePrintScreen from './InvoicePrintScreen'
import { pay } from '../api/fees'

const StudentDashboard = () => {
  const [stdPaymentInfo, setStdPaymentInfo] = useState(null)

  const {
    data: studentData,
    isLoading: isLoadingStudent,
    isError: isErrorStudent,
    error: errorStudent,
  } = useQuery('student', () => getSingleStudentFeeReport(), {
    retry: 0,
  })

  const studentId =
    localStorage.getItem('userInfo') &&
    JSON.parse(localStorage.getItem('userInfo')).student

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Report',
  })

  const queryClient = useQueryClient()

  const {
    isLoading: isLoadingPay,
    isError: isErrorPay,
    error: errorPay,
    isSuccess: isSuccessPay,
    mutateAsync: payMutateAsync,
  } = useMutation(['digitalPay'], pay, {
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries(['student'])
    },
  })

  const paymentHandler = (student, studentDataRef) => {
    const courseFromServer = studentDataRef && studentDataRef.course
    const semesterFromServer = studentDataRef && studentDataRef.semester
    const shiftFromServer = studentDataRef && studentDataRef.shift

    payMutateAsync({
      student,
      paymentMethod: 'mwallet_account',
      semesterFromServer,
      courseFromServer,
      shiftFromServer,
      paymentDate: student.paymentDate,
    })
  }

  const filteredFee = (student, data) => {
    return (
      <tr key={student._id}>
        <td>
          <img
            src={student.student && student.student.picture.picturePath}
            className='img-fluid'
            style={{ width: '25px' }}
            alt={student.student && student.student.picture.pictureName}
          />
        </td>
        <td>{student.student && student.student.rollNo}</td>
        <td>{student.student && student.student.fullName}</td>
        <td>{data.semester}</td>
        <td>{data.course && data.course.name}</td>
        <td>${data.course && data.course.price.toFixed(2)}</td>
        <td>{student.paymentDate.slice(0, 10)}</td>
        <td>
          {student.isPaid ? (
            <FaRegCheckCircle className='text-success mb-1' />
          ) : (
            <FaRegTimesCircle className='text-danger mb-1' />
          )}
        </td>
        <td>
          {!student.isPaid && (
            <button
              disabled={isLoadingPay}
              onClick={() => paymentHandler(student, data)}
              className='btn btn-success btn-sm '
            >
              {isLoadingPay ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                <>
                  <FaDollarSign className='mb-1' /> Pay{' '}
                </>
              )}
            </button>
          )}
        </td>
        <td>
          {student.isPaid && (
            <button
              className='btn btn-primary btn-sm'
              onClick={() => {
                setStdPaymentInfo({ student, data })
                // handlePrint()
              }}
              data-bs-toggle='modal'
              data-bs-target='#invoicePrint'
              // onClick={handlePrint}
            >
              <FaPrint className='mb-1' />
            </button>
          )}
        </td>
      </tr>
    )
  }

  return (
    <div>
      <h3 className='text-center'>Payment History</h3> <hr />
      {isSuccessPay && (
        <Message variant='success'>Payment has been done successfully.</Message>
      )}
      {isErrorPay && <Message variant='danger'>{errorPay}</Message>}
      {isLoadingStudent ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isErrorStudent ? (
        <Message variant='danger'>{errorStudent}</Message>
      ) : (
        <>
          {studentData && (
            <>
              <div className='table-responsive '>
                <table className='table table-sm hover bordered striped caption-top '>
                  <thead>
                    <tr>
                      <th>PHOTO</th>
                      <th>SID</th>
                      <th>NAME</th>
                      <th>SEMESTER</th>
                      <th>COURSE</th>
                      <th>FEE</th>
                      <th>PAYMENT DATE</th>
                      <th>P. STATUS</th>
                      <th>PAY</th>
                      <th>INVOICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData &&
                      studentData.map((data) =>
                        data.payment.map(
                          (student) =>
                            student.student._id === studentId &&
                            filteredFee(student, data)
                        )
                      )}
                  </tbody>
                </table>
              </div>
            </>
          )}
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
                  <InvoicePrintScreen stdPaymentInfo={stdPaymentInfo} />
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
  )
}

export default StudentDashboard
