import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getUnpaidRegFee, payStudentRegFee } from '../../api/student'
import { FaDollarSign } from 'react-icons/fa'
import Loader from 'react-loader-spinner'

const Admission = () => {
  const queryClient = useQueryClient()

  const {
    data: students,
    isLoading,
    isError,
    error,
  } = useQuery('unpaid-reg-fee', () => getUnpaidRegFee(), {
    retry: 0,
  })

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    isSuccess: isSuccessPost,
    mutateAsync: postMutateAsync,
  } = useMutation(payStudentRegFee, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['unpaid-reg-fee']),
  })

  const paymentHandler = (id) => {
    postMutateAsync(id)
  }

  return (
    <div className='container'>
      <Head>
        <title>Student Registration Fee</title>
        <meta
          property='og:title'
          content='Student Registration Fee'
          key='title'
        />
      </Head>
      {isSuccessPost && (
        <Message variant='success'>
          Registration fee has been paid successfully.
        </Message>
      )}
      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}

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
          {students && (
            <div className='table-responsive '>
              <table className='table table-striped table-hover table-sm caption-top '>
                <caption>
                  {students && students.length} records were found
                </caption>
                <thead>
                  <tr>
                    <th>ROLL NO.</th>
                    <th>NAME</th>
                    <th>CONTACT MOBILE</th>
                    <th>REGISTRATION FEE</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {students &&
                    students.map((fee) => (
                      <tr key={fee._id}>
                        <td>{fee.rollNo}</td>
                        <td>{fee.fullName}</td>
                        <td>{fee.contactMobileNumber}</td>
                        <td>$5.00</td>
                        <td>
                          <button
                            disabled={isLoadingPost}
                            onClick={() => paymentHandler(fee._id)}
                            className='btn btn-success btn-sm '
                          >
                            {isLoadingPost ? (
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

export default dynamic(() => Promise.resolve(withAuth(Admission)), {
  ssr: false,
})
