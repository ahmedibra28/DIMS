import { feeGeneration } from '../api/fees'
import { useQuery, useMutation } from 'react-query'
import { getCourses } from '../api/courses'
import { useForm } from 'react-hook-form'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'

const FeeGenerationScreen = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const {
    isLoading: isLoadingFeeGeneration,
    isError: isErrorFeeGeneration,
    error: errorFeeGeneration,
    isSuccess: isSuccessFeeGeneration,
    mutateAsync: feeGenerationMutateAsync,
  } = useMutation(['feeGeneration'], feeGeneration, {
    retry: 0,
    onSuccess: () => {},
  })

  const { data: dataCourse } = useQuery('courses', () => getCourses(), {
    retry: 0,
  })

  const submitHandler = (data) => {
    feeGenerationMutateAsync({
      course: data.course,
      semester: data.semester,
      shift: data.shift,
    })
  }

  return (
    <div>
      {isErrorFeeGeneration && (
        <Message variant='danger'>{errorFeeGeneration}</Message>
      )}
      {isSuccessFeeGeneration && (
        <Message variant='success'>Fee has been generated successfully</Message>
      )}
      {isLoadingFeeGeneration && (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      )}
      {isErrorFeeGeneration && (
        <Message variant='danger'>{errorFeeGeneration}</Message>
      )}
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row'>
          <div className='col-md-6 col-12 mx-auto'>
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
            <button
              type='submit'
              className='btn btn-primary mt-2  float-end'
              disabled={isLoadingFeeGeneration}
            >
              {isLoadingFeeGeneration ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                'Generate Fee Collection'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FeeGenerationScreen
