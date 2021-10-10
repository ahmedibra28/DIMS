import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import Message from '../../../components/Message'

import { useQuery, useMutation } from 'react-query'

import { useForm } from 'react-hook-form'
import { getCourses } from '../../../api/course'
import { getCourseTypes } from '../../../api/courseType'
import {
  dynamicInputSelect,
  dynamicInputSelectNumber,
  staticInputSelect,
} from '../../../utils/dynamicForm'
import { generateTuition } from '../../../api/tuition'

const Generation = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
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
  } = useMutation(generateTuition, {
    retry: 0,
    onSuccess: () => {},
  })

  const submitHandler = (data) => {
    postMutateAsync(data)
  }

  const semesterDuration =
    courseData && courseData.filter((c) => c._id === watch().course)

  return (
    <div className='container'>
      <Head>
        <title>Tuition Generator</title>
        <meta property='og:title' content='Tuition Generator' key='title' />
      </Head>
      {isSuccessPost && (
        <Message variant='success'>
          Tuition has been generated successfully.
        </Message>
      )}
      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row'>
          <div className='col-md-6 col-6'>
            {dynamicInputSelect({
              register,
              label: 'Course Type',
              errors,
              name: 'courseType',
              data: courseTypeData && courseTypeData,
            })}
          </div>
          <div className='col-md-6 col-6'>
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
          <div className='col-md-4 col-4'>
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

          <div className='col-md-4 col-4'>
            {watch().semester &&
              staticInputSelect({
                register,
                label: 'Shift',
                errors,
                name: 'shift',
                data: [{ name: 'Morning' }, { name: 'Afternoon' }],
              })}
          </div>

          {watch().shift && (
            <div className='col-md-4 col-4 my-auto'>
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
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Generation)), {
  ssr: false,
})
