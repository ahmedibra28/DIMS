import { useState } from 'react'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { getAttendanceReport } from '../api/reports'
import { useQuery, useMutation } from 'react-query'
import { getSubjects } from '../api/subjects'
import { getCourses } from '../api/courses'
import { useForm } from 'react-hook-form'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'
import moment from 'moment'

import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import { DateRangePicker } from 'react-date-range'

const AttendanceScreenReport = () => {
  const [sDate, setSDate] = useState(new Date())
  const [eDate, setEDate] = useState(new Date())
  const [option, setOption] = useState('')

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
    isLoading: isLoadingGetAttendance,
    isError: isErrorGetAttendance,
    error: errorGetAttendance,
    isSuccess: isSuccessGetAttendance,
    data: dataGetAttendanceAll,
    mutateAsync: getAttendanceMutateAsync,
  } = useMutation(['getAttendance'], getAttendanceReport, {
    retry: 0,
    onSuccess: () => {},
  })

  const dataGetAttendance =
    dataGetAttendanceAll && dataGetAttendanceAll.attendanceObj
  const studentId = dataGetAttendanceAll && dataGetAttendanceAll.studentId

  const { data: dataSubject } = useQuery('subjects', () => getSubjects(), {
    retry: 0,
  })

  const { data: dataCourse } = useQuery('courses', () => getCourses(), {
    retry: 0,
  })

  const submitHandler = (data) => {
    getAttendanceMutateAsync({
      course: data.course,
      subject: data.subject,
      semester: data.semester,
      shift: data.shift,
      student: data.student,
      sDate,
      eDate,
    })
  }

  const filteredAttendance = (student, data) => {
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
        <td>{data.subject.name}</td>
        <td>
          {student.isPresent ? (
            <FaCheckCircle className='text-success mb-1' />
          ) : (
            <FaTimesCircle className='text-danger mb-1' />
          )}
        </td>
        <td>{moment(data.createdAt).format('lll')}</td>
      </tr>
    )
  }
  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row'>
          <div className='col-md-6 my-auto'>
            <DateRangePicker
              ranges={[selectionRange]}
              onChange={handleSelect}
              className='w-100'
            />
          </div>
          <div className='col-md-6'>
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
              <div className='col-md-7 col-12'>
                <div className='mb-3'>
                  <label htmlFor='subject'>Subject</label>
                  <select
                    {...register('subject', {
                      required: 'Subject Type is required',
                    })}
                    type='text'
                    placeholder='Enter subject'
                    className='form-control'
                  >
                    <option value=''>-----------</option>
                    {dataSubject &&
                      dataSubject.map(
                        (subject) =>
                          subject.isActive &&
                          subject.course._id === watch().course &&
                          subject.semester === Number(watch().semester) && (
                            <option key={subject._id} value={subject._id}>
                              {subject.name}
                            </option>
                          )
                      )}
                  </select>
                  {errors.subject && (
                    <span className='text-danger'>
                      {errors.subject.message}
                    </span>
                  )}
                </div>
              </div>
              <div className='col-md-5 col-6'>
                <div className='mb-3'>
                  <label htmlFor='option'>Option</label>
                  <select
                    type='text'
                    {...register('option', { required: 'Option is required' })}
                    onChange={(e) => setOption(e.target.value)}
                    value={option}
                    placeholder='Enter option'
                    className='form-control'
                  >
                    <option value=''>-----------</option>
                    <option value='true'>Present</option>
                    <option value='false'>Absent</option>
                  </select>
                  {errors.option && (
                    <span className='text-danger'>{errors.option.message}</span>
                  )}
                </div>
              </div>

              <div className='col-md-5 col-12'>
                <div className='mb-3'>
                  <label htmlFor='shift'>Shift</label>
                  <select
                    {...register('shift', {
                      required: 'Shift is required',
                    })}
                    type='text'
                    placeholder='Enter date of admission'
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
              <div className='col-md-5 col-12'>
                <div className='mb-3'>
                  <label htmlFor='student'>Student Roll No</label>
                  <input
                    {...register('student', {})}
                    type='text'
                    min='0'
                    placeholder='Enter student roll no'
                    className='form-control'
                  />
                  {errors.student && (
                    <span className='text-danger'>
                      {errors.student.message}
                    </span>
                  )}
                </div>
              </div>
              <div className='col-md-1 col-1 mt-3'>
                <button
                  type='submit'
                  className='btn btn-primary mt-2 btn-lg'
                  disabled={isLoadingGetAttendance}
                >
                  {isLoadingGetAttendance ? (
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

      {isErrorGetAttendance && (
        <Message variant='danger'>{errorGetAttendance}</Message>
      )}
      {isSuccessGetAttendance && (
        <Message variant='success'>
          Student attendance data found successfully
        </Message>
      )}

      {isLoadingGetAttendance ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isErrorGetAttendance ? (
        <Message variant='danger'>{errorGetAttendance}</Message>
      ) : (
        <>
          {dataGetAttendance && (
            <div className='table-responsive '>
              <table className='table table-sm hover bordered striped caption-top '>
                <thead>
                  <tr>
                    <th>PHOTO</th>
                    <th>SID</th>
                    <th>NAME</th>
                    <th>SEMESTER</th>
                    <th>SUBJECT</th>
                    <th>ATTENDED?</th>
                    <th>ATTENDED DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {dataGetAttendance &&
                    dataGetAttendance.map((data) =>
                      data.student.map((student) =>
                        student.isPresent.toString() === option && studentId
                          ? student.student._id === studentId &&
                            filteredAttendance(student, data)
                          : student.isPresent.toString() === option &&
                            filteredAttendance(student, data)
                      )
                    )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AttendanceScreenReport
