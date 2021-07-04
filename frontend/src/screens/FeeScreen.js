import { useState } from 'react'
import { FaDollarSign } from 'react-icons/fa'
import { pay, searchStudentToPay } from '../api/fees'
import { useQuery, useMutation } from 'react-query'
import { getCourses } from '../api/courses'
import { useForm } from 'react-hook-form'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'

const FeeScreen = () => {
  const [paymentDate, setPaymentDate] = useState()
  const [message, setMessage] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const {
    isLoading: isLoadingSearchStudentToPay,
    isError: isErrorSearchStudentToPay,
    error: errorSearchStudentToPay,
    isSuccess: isSuccessSearchStudentToPay,
    data: dataSearchStudentToPay,
    mutateAsync: searchStudentToPayMutateAsync,
  } = useMutation('searchStudentsToPay', searchStudentToPay, {
    retry: 0,
    onSuccess: () => {},
  })

  const {
    isLoading: isLoadingPay,
    isError: isErrorPay,
    error: errorPay,
    isSuccess: isSuccessPay,
    mutateAsync: payMutateAsync,
  } = useMutation(['pay'], pay, {
    retry: 0,
  })

  const { data: dataCourse } = useQuery('courses', () => getCourses(), {
    retry: 0,
  })

  const submitHandler = (data) => {
    searchStudentToPayMutateAsync({
      course: data.course,
      paymentDate: data.paymentDate,
      semester: data.semester,
      shift: data.shift,
    })
  }

  const courseFromServer =
    dataSearchStudentToPay && dataSearchStudentToPay.course
  const paymentFromServer =
    dataSearchStudentToPay && dataSearchStudentToPay.payment
  const semesterFromServer =
    dataSearchStudentToPay && dataSearchStudentToPay.semester
  const shiftFromServer = dataSearchStudentToPay && dataSearchStudentToPay.shift

  const paymentHandler = (student) => {
    if (paymentDate) {
      setMessage(null)
      payMutateAsync({
        student,
        semesterFromServer,
        courseFromServer,
        shiftFromServer,
        paymentDate,
      })
    } else {
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setMessage('Payment date is required')
    }
  }

  return (
    <div>
      {message && <Message variant='danger'>{message}</Message>}
      {isSuccessPay && (
        <Message variant='success'>Payment has been done successfully.</Message>
      )}
      {isErrorPay && <Message variant='danger'>{errorPay}</Message>}
      {isErrorPay && <Message variant='danger'>{errorPay}</Message>}
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row'>
          <div className='col-md-4 col-12'>
            <div className='mb-3'>
              <label htmlFor='course'>Course</label>
              <select
                {...register('course', {
                  required: 'Course is required',
                })}
                type='text'
                placeholder='Enter course'
                className='form-control'
              >
                <option value=''>-----------</option>
                {dataCourse &&
                  dataCourse.map(
                    (course) =>
                      course.isActive && (
                        <option key={course._id} value={course._id}>
                          {course.name}
                        </option>
                      )
                  )}
              </select>
              {errors.course && (
                <span className='text-danger'>{errors.course.message}</span>
              )}
            </div>
          </div>
          <div className='col-md-2 col-12'>
            <div className='mb-3'>
              <label htmlFor='semester'>Semester</label>
              <select
                {...register('semester', {
                  required: 'Semester is required',
                })}
                type='text'
                placeholder='Enter name'
                className='form-control'
              >
                <option value=''>-----------</option>
                {dataCourse &&
                  dataCourse.map(
                    (semester) =>
                      semester.isActive &&
                      semester._id === watch().course &&
                      [...Array(semester.duration).keys()].map((sem) => (
                        <option key={sem + 1} value={sem + 1}>
                          {sem + 1}
                        </option>
                      ))
                  )}
              </select>
              {errors.semester && (
                <span className='text-danger'>{errors.semester.message}</span>
              )}
            </div>
          </div>
          <div className='col-md-3 col-12'>
            <div className='mb-3'>
              <label htmlFor='paymentDate'>Payment Date</label>
              <input
                {...register('paymentDate', {
                  required: 'Payment Date is required',
                })}
                type='date'
                placeholder='Enter payment date'
                className='form-control'
                onChange={(e) => setPaymentDate(e.target.value)}
              />

              {errors.paymentDate && (
                <span className='text-danger'>
                  {errors.paymentDate.message}
                </span>
              )}
            </div>
          </div>
          <div className='col-md-2 col-12'>
            <div className='mb-3'>
              <label htmlFor='shift'>Shift</label>
              <select
                {...register('shift', {
                  required: 'Shift is required',
                })}
                type='text'
                placeholder='Enter shift'
                className='form-control'
              >
                <option value=''>-----------</option>
                <option value='Morning'>Morning</option>
                <option value='Afternoon'>Afternoon</option>
              </select>
              {errors.shift && (
                <span className='text-danger'>{errors.shift.message}</span>
              )}
            </div>
          </div>
          <div className='col-md-1 col-1 mt-3'>
            <button
              type='submit'
              className='btn btn-primary mt-2 btn-lg'
              disabled={isLoadingSearchStudentToPay}
            >
              {isLoadingSearchStudentToPay ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>
      </form>
      <hr />

      {isErrorSearchStudentToPay && (
        <Message variant='danger'>{errorSearchStudentToPay}</Message>
      )}
      {isSuccessSearchStudentToPay && (
        <Message variant='success'>
          Student attendance data found successfully
        </Message>
      )}
      {isLoadingSearchStudentToPay ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isErrorSearchStudentToPay ? (
        <Message variant='danger'>{errorSearchStudentToPay}</Message>
      ) : (
        <>
          {dataSearchStudentToPay && (
            <div className='table-responsive '>
              <table className='table table-sm hover bordered striped caption-top '>
                <caption>
                  {dataSearchStudentToPay &&
                    dataSearchStudentToPay.payment.length}{' '}
                  students were found
                </caption>
                <thead>
                  <tr>
                    <th>PHOTO</th>
                    <th>SID</th>
                    <th>NAME</th>
                    <th>SEMESTER</th>
                    <th>COURSE</th>
                    <th>FEE</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentFromServer &&
                    paymentFromServer.map((student) => (
                      <tr key={student._id}>
                        <td>
                          <img
                            src={
                              student.student &&
                              student.student.picture.picturePath
                            }
                            className='img-fluid'
                            style={{ width: '25px' }}
                            alt={
                              student.student &&
                              student.student.picture.pictureName
                            }
                          />
                        </td>
                        <td>
                          {student.student && student.student.studentIdNo}
                        </td>
                        <td>{student.student && student.student.fullName}</td>
                        <td>{semesterFromServer && semesterFromServer}</td>
                        <td>{courseFromServer && courseFromServer.name}</td>
                        <td>
                          $
                          {courseFromServer &&
                            courseFromServer.price.toFixed(2)}
                        </td>
                        <td>
                          {!student.isPaid && (
                            <button
                              disabled={isLoadingPay}
                              onClick={() => paymentHandler(student)}
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
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default FeeScreen
