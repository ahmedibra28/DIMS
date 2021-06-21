import { FaCheckCircle } from 'react-icons/fa'
import { addAttendance, getAttendanceReport } from '../api/attendances'
import { useQuery, useMutation } from 'react-query'
import { getSubjects } from '../api/subjects'
import { getCourses } from '../api/courses'
import { useForm } from 'react-hook-form'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'
import { FaPaperPlane } from 'react-icons/fa'
import moment from 'moment'

const AttendanceScreenReport = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const {
    isLoading: isLoadingGetAttendance,
    isError: isErrorGetAttendance,
    error: errorGetAttendance,
    isSuccess: isSuccessGetAttendance,
    data: dataGetAttendance,
    mutateAsync: getAttendanceMutateAsync,
  } = useMutation(['getAttendance'], getAttendanceReport, {
    retry: 0,
    onSuccess: () => {},
  })

  // const studentData =
  //   !isLoadingGetAttendance && dataGetAttendance && dataGetAttendance.student

  console.log(dataGetAttendance && dataGetAttendance)

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
          <div className='table-responsive '>
            <table className='table table-sm hover bordered striped caption-top '>
              <caption>
                {dataGetAttendance && dataGetAttendance.length} students were
                found
              </caption>
              <thead>
                <tr>
                  <th>STD ID</th>
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
                    data.student.map((student, index) => (
                      <tr key={student._id}>
                        {/* <td>{index + 1}</td> */}
                        {console.log(student)}
                        <td>
                          <img
                            src={student.picture.picturePath}
                            className='img-fluid'
                            style={{ width: '30px' }}
                            alt={student.picture.pictureName}
                          />
                        </td>
                        <td>{student.fullName}</td>
                        <td>{data.semester}</td>
                        <td>{data.subject.name}</td>
                        <td>
                          <FaCheckCircle className='text-success mb-1' />
                        </td>
                        <td>{moment(data.createdAt).format('lll')}</td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default AttendanceScreenReport
