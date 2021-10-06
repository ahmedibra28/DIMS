import { useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'

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
import { getTuitionsReport } from '../../api/tuition-report'
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
  } = useMutation(getTuitionsReport, {
    retry: 0,
    onSuccess: () => {},
  })

  const submitHandler = (data) => {
    postMutateAsync(data)
  }

  const semesterDuration =
    courseData && courseData.filter((c) => c._id === watch().course)

  const filteredTuitionDisplay = (std) => {
    return (
      <tr key={std._id}>
        <td>{std.student && std.student.rollNo}</td>
        <td>{std.student && std.student.fullName}</td>
        <td>{std.course && std.course.name}</td>
        <td>${std.amount.toFixed(2)}</td>
        <td>{std.createdAt.slice(0, 10)}</td>
        <td>
          {std.isPaid ? (
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
        <title>Tuition Report</title>
        <meta property='og:title' content='Tuition Report' key='title' />
      </Head>
      {isSuccessPost && (
        <Message variant='success'>
          Tuition record has been fetched successfully.
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
          <div className='col-md-3 col-4'>
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
          <div className='col-md-3 col-4'>
            {watch().semester &&
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
                  name='option'
                  onChange={(e) => setOption(e.target.value)}
                  value={option}
                  placeholder='Enter option'
                  className='form-control'
                >
                  <option value='none'>-----------</option>
                  <option value='true'>Paid</option>
                  <option value='false'>UnPaid</option>
                </select>
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
                <caption>{data && data.length} records were found</caption>
                <thead>
                  <tr>
                    <th>ROLL NO. </th>
                    <th>STUDENT</th>
                    <th>COURSE</th>
                    <th>TUITION FEE</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((std) =>
                      watch().student
                        ? watch().student === std.student.rollNo &&
                          option !== 'none'
                          ? std.isPaid.toString() === option &&
                            filteredTuitionDisplay(std)
                          : watch().student === std.student.rollNo &&
                            filteredTuitionDisplay(std)
                        : option !== 'none'
                        ? std.isPaid.toString() === option &&
                          filteredTuitionDisplay(std)
                        : filteredTuitionDisplay(std)
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
