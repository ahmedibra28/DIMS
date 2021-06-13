import React from 'react'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { getCourses } from '../api/courses'
import { getAssignToSubjects } from '../api/assignToSubject'
import { getSubjectByInstructor } from '../api/marks'

const MarksScreen = () => {
  const userInfo =
    localStorage.getItem('userInfo') &&
    JSON.parse(localStorage.getItem('userInfo'))
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
    },
  })

  const { data: dataSubjByInstructor } = useQuery(
    ['subject-by-instructor', userInfo._id],
    () => getSubjectByInstructor(userInfo && userInfo.email),
    {
      retry: 0,
    }
  )

  // console.log(userInfo && userInfo)

  console.log(dataSubjByInstructor && dataSubjByInstructor)

  return (
    <div>
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
              {dataSubjByInstructor &&
                dataSubjByInstructor.map(
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
      </div>
    </div>
  )
}

export default MarksScreen
