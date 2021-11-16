import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Message from '../components/Message'
import { useMutation } from 'react-query'
import { useForm } from 'react-hook-form'
import { inputText } from '../utils/dynamicForm'
import { tuitionConfirmation } from '../api/clearanceConfirmation'

const ClearanceConfirmation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    isSuccess: isSuccessPost,
    data,
    mutateAsync: postMutateAsync,
  } = useMutation(tuitionConfirmation, {
    retry: 0,
    onSuccess: () => {},
  })

  const studentData = data && data.student

  const submitHandler = (data) => {
    postMutateAsync(data)
  }

  return (
    <div className='container'>
      <Head>
        <title>Student Clearance Confirmation</title>
        <meta
          property='og:title'
          content='Student Clearance Confirmation'
          key='title'
        />
      </Head>
      {isSuccessPost && (
        <Message variant='success'>
          Clearance confirmation has been confirmed successfully.
        </Message>
      )}
      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row'>
          <div className='col-md-10 col-12'>
            {inputText({
              register,
              label: 'Student Roll No.',
              errors,
              name: 'rollNo',
            })}
          </div>

          <div className='col-md-2 col-12 my-auto'>
            <button
              type='submit'
              className='btn btn-primary btn-lg form-control shadow mt-2'
              disabled={isLoadingPost}
            >
              {isLoadingPost ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>
      </form>

      {data && data.tuition && data.tuition.length > 0
        ? data &&
          data.student && (
            <div className='row'>
              <div className='col-12'>
                <div className='card mb-3 bg-danger text-light'>
                  <div className='row g-0'>
                    <div className='col-md-4'>
                      <Image
                        width='260'
                        height='260'
                        priority
                        src={studentData && studentData.picture.picturePath}
                        alt={studentData && studentData.picture.pictureName}
                        className='img-fluid rounded-start px-2 pt-2 rounded-circle'
                      />
                    </div>
                    <div className='col-md-8 my-auto'>
                      <div className='card-body'>
                        <h5 className='card-title'>
                          {studentData && studentData.fullName.toUpperCase()}
                        </h5>
                        <p className='card-text'>
                          This student {studentData && studentData.fullName} is
                          not clean from the finance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        : data &&
          data.student && (
            <div className='row'>
              <div className='col-12'>
                <div className='card mb-3'>
                  <div className='row g-0'>
                    <div className='col-md-4'>
                      <Image
                        width='260'
                        height='260'
                        priority
                        src={studentData && studentData.picture.picturePath}
                        alt={studentData && studentData.picture.pictureName}
                        className='img-fluid rounded-start'
                      />
                    </div>
                    <div className='col-md-8 my-auto'>
                      <div className='card-body'>
                        <h5 className='card-title'>
                          {studentData && studentData.fullName.toUpperCase()}
                        </h5>
                        <p className='card-text'>
                          This student {studentData && studentData.fullName} is
                          clean from the finance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(ClearanceConfirmation)), {
  ssr: false,
})
