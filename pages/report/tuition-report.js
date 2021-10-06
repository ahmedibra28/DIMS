import { useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'

import { getSubjects } from '../../api/subject'
import { useQuery, useMutation } from 'react-query'

import { useForm } from 'react-hook-form'
import { getCourses } from '../../api/course'
import { getCourseTypes } from '../../api/courseType'
import {
  dynamicInputSelect,
  dynamicInputSelectNumber,
  inputDate,
  inputText,
  staticInputSelect,
} from '../../utils/dynamicForm'
import { getAttendancesReport } from '../../api/attendance-report'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const Tuition = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })
  const [option, setOption] = useState('none')

  const { data: subjectData } = useQuery('subjects', () => getSubjects(), {
    retry: 0,
  })

  const { data: courseData } = useQuery('courses', () => getCourses(), {
    retry: 0,
  })

  const { data: courseTypeData } = useQuery(
    'courseTypes',
    () => getCourseTypes(),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    isSuccess: isSuccessPost,
    mutateAsync: postMutateAsync,
    data,
  } = useMutation(getAttendancesReport, {
    retry: 0,
    onSuccess: () => {},
  })

  const submitHandler = (data) => {
    postMutateAsync(data)
  }

  const semesterDuration =
    courseData && courseData.filter((c) => c._id === watch().course)

  const filteredAttendanceDisplay = (data, d, std) => {
    return (
      <tr key={std.student && std.student._id}>
        <td>{std.student && std.student.rollNo}</td>
        <td>{std.student && std.student.fullName}</td>
        <td>{data && data[0].course && data && data[0].course.name}</td>
        <td>{data && data[0].subject && data && data[0].subject.name}</td>
        <td>{d.createdAt.slice(0, 10)}</td>
        <td>
          {std.isAttended ? (
            <FaCheckCircle className='text-success mb-1' />
          ) : (
            <FaTimesCircle className='text-danger mb-1' />
          )}
        </td>
      </tr>
    )
  }

  return (
    <div className='container'>
      <Head>
        <title>Attendance Report</title>
        <meta property='og:title' content='Attendance Report' key='title' />
      </Head>
      {isSuccessPost && (
        <Message variant='success'>
          Attendance record has been fetched successfully.
        </Message>
      )}
      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row'>
          <div className='col-md-3 col-6'>
            {dynamicInputSelect({
              register,
              label: 'Course Type',
              errors,
              name: 'courseType',
              data: courseTypeData && courseTypeData,
            })}
          </div>
          <div className='col-md-3 col-6'>
            {watch().courseType &&
              dynamicInputSelect({
                register,
                label: 'Course',
                errors,
                name: 'course',
                data:
                  courseData &&
                  courseData.filter(
                    (p) => p.courseType._id === watch().courseType
                  ),
              })}
          </div>
          <div className='col-md-2 col-4'>
            {watch().course &&
              dynamicInputSelectNumber({
                register,
                label: 'Semester',
                errors,
                name: 'semester',
                data:
                  semesterDuration &&
                  semesterDuration[0] &&
                  semesterDuration[0].duration,
              })}
          </div>
          <div className='col-md-2 col-4'>
            {watch().semester &&
              dynamicInputSelect({
                register,
                label: 'Subject',
                errors,
                name: 'subject',
                data:
                  subjectData &&
                  subjectData.filter(
                    (p) =>
                      p.course._id === watch().course &&
                      p.semester === Number(watch().semester)
                  ),
              })}
          </div>
          <div className='col-md-2 col-4'>
            {watch().subject &&
              staticInputSelect({
                register,
                label: 'Shift',
                errors,
                name: 'shift',
                data: [{ name: 'Morning' }, { name: 'Afternoon' }],
              })}
          </div>

          <div className='col-md-3 col-6'>
            {watch().shift &&
              inputDate({
                register,
                label: 'Start Date',
                errors,
                name: 'startDate',
              })}
          </div>
          <div className='col-md-3 col-6'>
            {watch().shift &&
              inputDate({
                register,
                label: 'End Date',
                errors,
                name: 'endDate',
              })}
          </div>
          <div className='col-md-2 col-6'>
            {watch().shift &&
              inputText({
                register,
                label: 'Student',
                errors,
                name: 'student',
                isRequired: false,
              })}
          </div>
          <div className='col-md-2 col-6'>
            {watch().shift && (
              <div className='mb-3'>
                <label htmlFor='option'>Option</label>
                <select
                  type='text'
                  // {...register('option', { required: 'Option is required' })}
                  name='option'
                  onChange={(e) => setOption(e.target.value)}
                  value={option}
                  placeholder='Enter option'
                  className='form-control'
                >
                  <option value='none'>-----------</option>
                  <option value='true'>Present</option>
                  <option value='false'>Absent</option>
                </select>
                {errors.option && (
                  <span className='text-danger'>{errors.option.message}</span>
                )}
              </div>
            )}
          </div>
          {watch().shift && (
            <div className='col-md-2 col-4 my-auto'>
              <button
                type='submit'
                className='btn btn-primary btn-lg mt-2 form-control shadow'
                disabled={isLoadingPost}
              >
                {isLoadingPost ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  'Search'
                )}
              </button>
            </div>
          )}
        </div>
      </form>

      {isLoadingPost ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isErrorPost ? (
        <Message variant='danger'>{errorPost}</Message>
      ) : (
        <div>
          {data && (
            <div className='table-responsive '>
              <table className='table table-striped table-hover table-sm caption-top '>
                <caption>
                  {data && data[0] && data[0].student.length} records were found
                </caption>
                <thead>
                  <tr>
                    <th>ROLL NO. </th>
                    <th>STUDENT</th>
                    <th>COURSE</th>
                    <th>SUBJECT</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data &&
                    data.map((d) =>
                      d.student.map((std) =>
                        watch().student
                          ? watch().student === std.student.rollNo &&
                            option !== 'none'
                            ? std.isAttended.toString() === option &&
                              filteredAttendanceDisplay(data, d, std)
                            : watch().student === std.student.rollNo &&
                              filteredAttendanceDisplay(data, d, std)
                          : option !== 'none'
                          ? std.isAttended.toString() === option &&
                            filteredAttendanceDisplay(data, d, std)
                          : filteredAttendanceDisplay(data, d, std)
                      )
                    )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Tuition)), {
  ssr: false,
})
