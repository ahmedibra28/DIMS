import { FaSearch } from 'react-icons/fa'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import { useQuery, useQueries, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { getCourses } from '../api/courses'
import { getSubjects } from '../api/subjects'
import { getAssignToSubjects } from '../api/assignToSubject'
import {
  getStudentBySubjectInstructor,
  getSubjectByInstructor,
} from '../api/marks'

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
    defaultValues: {},
  })

  const { data: dataSubjectInstructor } = useQuery(
    'courses',
    () => getSubjectByInstructor(userInfo && userInfo.email),
    {
      retry: 0,
    }
  )

  const { isLoading, isError, error, isSuccess, mutateAsync, data } =
    useMutation(
      ['student-by-subject-instructor'],
      getStudentBySubjectInstructor,
      {
        retry: 0,
        onSuccess: () => {
          reset()
        },
      }
    )

  console.log(!isLoading && data && data)

  const semesterFunc = () => {
    let uniqueSemester = []
    dataSubjectInstructor &&
      dataSubjectInstructor.filter((subject) =>
        uniqueSemester.push(subject.semester)
      )

    return [...new Set(uniqueSemester)].map((sms, index) => (
      <option key={index} value={sms.semester}>
        {sms}
      </option>
    ))
  }

  const submitHandler = (data) => {
    mutateAsync(data)
    console.log(data)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row'>
          <div className='col-md-5 col-12'>
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
                {semesterFunc()}
              </select>
              {errors.semester && (
                <span className='text-danger'>{errors.semester.message}</span>
              )}
            </div>
          </div>

          <div className='col-md-5 col-12'>
            <div className='mb-3'>
              <label htmlFor='subject'>Subject</label>
              <select
                {...register('subject', {
                  required: 'Subject is required',
                })}
                type='text'
                placeholder='Enter subject'
                className='form-control'
              >
                <option value=''>-----------</option>
                {dataSubjectInstructor &&
                  dataSubjectInstructor.map(
                    (subject, index) =>
                      subject.semester === Number(watch().semester) && (
                        <option key={index} value={subject.subject._id}>
                          {subject.subject.name}
                        </option>
                      )
                  )}
              </select>
              {errors.subject && (
                <span className='text-danger'>{errors.subject.message}</span>
              )}
            </div>
          </div>
          <div className='col-md-2 col-4 mt-4 text-end'>
            <button className='btn btn-primary mt-1 py-2'>
              <FaSearch className='mb-1' /> Search
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default MarksScreen
