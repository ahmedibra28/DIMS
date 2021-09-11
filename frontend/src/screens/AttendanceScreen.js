import { useState, useEffect } from 'react'
import { addAttendance, getClassInfo } from '../api/attendances'
import { useQuery, useMutation } from 'react-query'
import { getSubjects } from '../api/subjects'
import { getCourses } from '../api/courses'
import { useForm } from 'react-hook-form'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'
import { FaPaperPlane } from 'react-icons/fa'

const AttendanceScreen = () => {
  const [selected, setSelected] = useState([])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const { handleSubmit: attendanceHandleSubmit } = useForm({
    defaultValues: {},
  })

  const {
    isLoading: isLoadingGetAttendance,
    isError: isErrorGetAttendance,
    error: errorGetAttendance,
    isSuccess: isSuccessGetAttendance,
    data: dataGetAttendance,
    mutateAsync: getAttendanceMutateAsync,
  } = useMutation(['getAttendance'], getClassInfo, {
    retry: 0,
    onSuccess: () => {
      setSelected([])
    },
  })

  useEffect(() => {
    isErrorGetAttendance && setSelected([])
  }, [isErrorGetAttendance])

  const { data: dataSubject } = useQuery('subjects', () => getSubjects(), {
    retry: 0,
  })

  const { data: dataCourse } = useQuery('courses', () => getCourses(), {
    retry: 0,
  })

  const {
    isLoading: isLoadingAddAttendance,
    isError: isErrorAddAttendance,
    error: errorAddAttendance,
    isSuccess: isSuccessAddAttendance,
    mutateAsync: addAttendanceMutateAsync,
  } = useMutation(['addAttendance'], addAttendance, {
    retry: 0,
    onSuccess: () => {},
  })

  const submitHandler = (data) => {
    getAttendanceMutateAsync({
      course: data.course,
      subject: data.subject,
      semester: data.semester,
      shift: data.shift,
    })
  }

  const attendCheck = ({ target: { id } }) => {
    if (!selected.includes(id)) {
      setSelected((prevSelected) => [...prevSelected, id])
    } else {
      setSelected((prevSelected) =>
        prevSelected.filter((stdId) => stdId !== id)
      )
    }
  }

  const attendanceSubmit = () => {
    const absentStudentsFilter =
      dataGetAttendance &&
      dataGetAttendance.filter(
        (student) => !selected.includes(student.student._id)
      )

    const absentStudents = absentStudentsFilter.map((std) => std.student._id)
    const attendedStudents = selected
    const course = dataGetAttendance && dataGetAttendance[0].course._id
    const semester = dataGetAttendance && dataGetAttendance[0].semester
    const shift = dataGetAttendance && dataGetAttendance[0].shift
    const subject = watch().subject

    addAttendanceMutateAsync({
      absentStudents,
      attendedStudents,
      course,
      semester,
      shift,
      subject,
    })
  }

  return (
    <div>
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
                <span className='text-danger'>{errors.subject.message}</span>
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
      </form>
      {isErrorGetAttendance && (
        <Message variant='danger'>{errorGetAttendance}</Message>
      )}
      {isSuccessGetAttendance && (
        <Message variant='success'>
          Student information fetched successfully.
        </Message>
      )}
      {isErrorAddAttendance && (
        <Message variant='danger'>{errorAddAttendance}</Message>
      )}
      {isSuccessAddAttendance && (
        <Message variant='success'>
          Student attendance has been stored successfully.
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
          {dataGetAttendance && dataGetAttendance.length > 0 ? (
            <form onSubmit={attendanceHandleSubmit(attendanceSubmit)}>
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

              <button
                disabled={isLoadingAddAttendance}
                className='btn btn-success float-end '
              >
                {isLoadingAddAttendance ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  <>
                    <FaPaperPlane className='mb-1' /> Save
                  </>
                )}
              </button>
              <div className='table-responsive '>
                <table className='table table-sm hover bordered striped caption-top '>
                  <caption>
                    {dataGetAttendance && dataGetAttendance.length} students
                    were found
                  </caption>
                  <thead>
                    <tr>
                      <th>STD ID</th>
                      <th>NAME</th>
                      <th>SEMESTER</th>
                      <th>ATTENDED?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataGetAttendance &&
                      dataGetAttendance.map((student, index) => (
                        <tr key={student._id}>
                          <td>{index + 1}</td>
                          <td>{student.student.fullName}</td>
                          <td>{student.semester}</td>
                          <td>
                            <input
                              className='form-check-input me-1'
                              type='checkbox'
                              id={student.student._id}
                              onChange={(e) => attendCheck(e)}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </form>
          ) : (
            <div className='text-center text-danger'>
              No students in this class
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AttendanceScreen
