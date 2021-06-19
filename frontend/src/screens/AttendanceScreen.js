import React from 'react'
import { getClassInfo } from '../api/attendances'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getSubjects } from '../api/subjects'
import { getCourses } from '../api/courses'
import { useForm } from 'react-hook-form'

const AttendanceScreen = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
    mutateAsync: getAttendanceMutateAsync,
  } = useMutation(['getAttendance'], getClassInfo, {
    retry: 0,
    onSuccess: () => {
      // reset()
      // queryClient.invalidateQueries(['attendances'])
    },
  })

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
          <div className='col-md-3 col-12'>
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
          <div className='col-md-4 col-12'>
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
          <div className='col-md-1 col-1 my-auto'>
            <button
              type='submit'
              className='btn btn-primary mt-2 btn-lg'
              // disabled={
              //   isLoadingAddAssignToSubject || isLoadingUpdateAssignToSubject
              // }
            >
              {/* {isLoadingAddAssignToSubject ||
                isLoadingUpdateAssignToSubject ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  'Submit'
                )} */}
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AttendanceScreen
