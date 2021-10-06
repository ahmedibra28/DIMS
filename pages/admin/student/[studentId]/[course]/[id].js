import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'
import Message from '../../../../../components/Message'
import Loader from 'react-loader-spinner'

import { getSubjects } from '../../../../../api/subject'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { useForm } from 'react-hook-form'
import { getCourses } from '../../../../../api/course'
import {
  dynamicInputSelect,
  inputNumber,
} from '../../../../../utils/dynamicForm'
import { getExams } from '../../../../../api/exam'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import SubPageAccess from '../../../../../utils/SubPageAccess'

const Exam = () => {
  SubPageAccess()
  const router = useRouter()

  const { course: assignCourseId, id: courseId } = router.query

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    ['exams', assignCourseId],
    async () => await getExams({ assignCourseId }),
    {
      enabled: !!assignCourseId,
      retry: 0,
    }
  )

  const { data: subjectData } = useQuery('subjects', () => getSubjects(), {
    retry: 0,
  })

  const { data: courseData } = useQuery('courses', () => getCourses(), {
    retry: 0,
  })

  const submitHandler = (data) => {
    // MutateAsync(data)
    console.log(data)
  }

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

  const examData =
    courseData && courseData.filter((p) => p._id === courseId && p.exam)

  return (
    <div className='container'>
      <Head>
        <title>Attendance Report</title>
        <meta property='og:title' content='Attendance Report' key='title' />
      </Head>
      {/* {isSuccess && (
        <Message variant='success'>
          Attendance record has been fetched successfully.
        </Message>
      )} */}
      {isError && <Message variant='danger'>{error}</Message>}

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row'>
          <div className='col-md-3 col-6'>
            <div className='mb-3'>
              {courseId && (
                <>
                  <label htmlFor='exam'>Exam</label>
                  <select
                    {...register('exam', {
                      required: 'Exam is required',
                    })}
                    type='text'
                    placeholder='Enter exam'
                    className='form-control'
                  >
                    <option value=''>-----------</option>
                    {examData &&
                      examData[0] &&
                      examData[0].exam.map((exam) => (
                        <option key={exam} value={exam}>
                          {exam}
                        </option>
                      ))}
                  </select>
                  {errors.exam && (
                    <span className='text-danger'>{errors.exam.message}</span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className='col-md-2 col-4'>
            {watch().exam &&
              dynamicInputSelect({
                register,
                label: 'Subject',
                errors,
                name: 'subject',
                data:
                  subjectData &&
                  subjectData.filter(
                    (p) => p.course._id === courseId && p.semester === 1
                  ),
              })}
          </div>
          <div className='col-md-2 col-4'>
            {watch().exam &&
              inputNumber({
                register,
                label: 'Theory',
                errors,
                name: 'theoryMarks',
              })}
          </div>
          <div className='col-md-2 col-4'>
            {watch().exam &&
              inputNumber({
                register,
                label: 'Practical',
                errors,
                name: 'practicalMarks',
              })}
          </div>

          {watch().subject && (
            <div className='col-md-2 col-4 my-auto'>
              <button
                type='submit'
                className='btn btn-primary btn-lg mt-2 form-control shadow'
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  'Search'
                )}
              </button>
            </div>
          )}
        </div>
      </form>

      {isLoading ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
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

export default Exam
