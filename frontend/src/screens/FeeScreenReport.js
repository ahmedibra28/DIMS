import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { getCompleteFeeReport } from '../api/reports'
import { useQuery, useMutation } from 'react-query'
import { getCourses } from '../api/courses'
import { useForm } from 'react-hook-form'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import { DateRangePicker } from 'react-date-range'
import { FaPrint, FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa'
import InvoicePrintScreen from './InvoicePrintScreen'

const FeeScreenReport = () => {
  const [message, setMessage] = useState(null)
  const [rollNo, setRollNo] = useState(null)
  const [sDate, setSDate] = useState(new Date())
  const [eDate, setEDate] = useState(new Date())
  const [stdPaymentInfo, setStdPaymentInfo] = useState(null)

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Report',
  })

  const handleSelect = (ranges) => {
    setSDate(ranges.selection.startDate)
    setEDate(ranges.selection.endDate)
  }

  const selectionRange = {
    startDate: sDate,
    endDate: eDate,
    key: 'selection',
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const {
    isLoading: isLoadingFeeReport,
    isError: isErrorFeeReport,
    error: errorFeeReport,
    isSuccess: isSuccessFeeReport,
    data: dataFeeReport,
    mutateAsync: getCompleteFeeReportMutateAsync,
  } = useMutation('feeReport', getCompleteFeeReport, {
    retry: 0,
    onSuccess: () => {},
  })

  const { data: dataCourse } = useQuery('courses', () => getCourses(), {
    retry: 0,
  })

  const submitHandler = (data) => {
    if (sDate) {
      setMessage(null)
      getCompleteFeeReportMutateAsync({
        course: data.course,
        semester: data.semester,
        shift: data.shift,
        sDate,
        eDate,
      })
    } else {
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setMessage('Date is required')
    }
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
          <button
            className='btn btn-success btn-sm'
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
        </td>
      </tr>
    )
  }

  return (
    <div>
      {message && <Message variant='danger'>{message}</Message>}
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row'>
          <div className='col-md-6 my-auto'>
            <DateRangePicker
              ranges={[selectionRange]}
              onChange={handleSelect}
              className='w-100'
            />
          </div>
          <div className='col-md-6 my-auto'>
            <div className='row'>
              <div className='col-md-12 col-12'>
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
              <div className='col-md-12 col-12'>
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
                    <span className='text-danger'>
                      {errors.semester.message}
                    </span>
                  )}
                </div>
              </div>

              <div className='col-md-12 col-12'>
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
              <div className='col-md-10 col-12'>
                <div className='mb-3'>
                  <label htmlFor='student'>Student Roll No</label>
                  <input
                    {...register('student', {})}
                    type='text'
                    min='0'
                    placeholder='Enter student roll no'
                    className='form-control'
                    onChange={(e) => setRollNo(e.target.value)}
                  />
                  {errors.student && (
                    <span className='text-danger'>
                      {errors.student.message}
                    </span>
                  )}
                </div>
              </div>
              <div className='col-md-2 col-2 mt-3'>
                <button
                  type='submit'
                  className='btn btn-primary float-end mt-2 btn-lg'
                  disabled={isLoadingFeeReport}
                >
                  {isLoadingFeeReport ? (
                    <span className='spinner-border spinner-border-sm' />
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <hr />

      {isErrorFeeReport && <Message variant='danger'>{errorFeeReport}</Message>}
      {isSuccessFeeReport && (
        <Message variant='success'>Student fee data found successfully</Message>
      )}
      {isLoadingFeeReport ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isErrorFeeReport ? (
        <Message variant='danger'>{errorFeeReport}</Message>
      ) : (
        <>
          {dataFeeReport && (
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
                      <th>INVOICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataFeeReport &&
                      dataFeeReport.map((data) =>
                        data.payment.map((student) =>
                          rollNo
                            ? student.student.rollNo === rollNo &&
                              filteredFee(student, data)
                            : filteredFee(student, data)
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

export default FeeScreenReport
