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
import { getTuitions, updateTuition } from '../../../api/tuition'
import { FaDollarSign } from 'react-icons/fa'
import Loader from 'react-loader-spinner'

const Tuition = () => {
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
    data,
  } = useMutation(getTuitions, {
    retry: 0,
    onSuccess: () => {},
  })

  const submitHandler = (data) => {
    postMutateAsync(data)
  }

  const semesterDuration =
    courseData && courseData.filter((c) => c._id === watch().course)

  const {
    isLoading: isLoadingPay,
    isError: isErrorPay,
    error: errorPay,
    isSuccess: isSuccessPay,
    mutateAsync: payMutateAsync,
  } = useMutation(['payment update'], updateTuition, {
    retry: 0,
  })

  const paymentHandler = (fee) => {
    payMutateAsync(fee)
  }

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

      {isSuccessPay && (
        <Message variant='success'>
          Tuition has been received successfully.
        </Message>
      )}
      {isErrorPay && <Message variant='danger'>{errorPay}</Message>}

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
                    <th>ROLL NO.</th>
                    <th>NAME</th>
                    <th>SEMESTER</th>
                    <th>COURSE</th>
                    <th>FEE</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((fee) => (
                      <tr key={fee._id}>
                        <td>{fee.student && fee.student.rollNo}</td>
                        <td>{fee.student && fee.student.fullName}</td>
                        <td>{fee.semester}</td>
                        <td>{fee.course && fee.course.name}</td>
                        <td>${fee.amount.toFixed(2)}</td>
                        <td>
                          <button
                            disabled={isLoadingPay}
                            onClick={() => paymentHandler(fee)}
                            className='btn btn-success btn-sm '
                          >
                            {isLoadingPay ? (
                              <span className='spinner-border spinner-border-sm' />
                            ) : (
                              <>
                                <FaDollarSign className='mb-1' /> Pay{' '}
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
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
