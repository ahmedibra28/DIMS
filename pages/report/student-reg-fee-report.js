import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'
import InvoiceTemplate from '../../components/RegFeeTemplate'
import { useMutation } from 'react-query'

import { useForm } from 'react-hook-form'
import { inputText } from '../../utils/dynamicForm'
import { getRegFee } from '../../api/report'
import { FaPrint } from 'react-icons/fa'

const RegistrationFee = () => {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const [stdPaymentInfo, setStdPaymentInfo] = useState(null)
  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    isSuccess: isSuccessPost,
    mutateAsync: postMutateAsync,
    data,
  } = useMutation(getRegFee, {
    retry: 0,
    onSuccess: () => {},
  })

  const submitHandler = (data) => {
    postMutateAsync(data)
  }

  const filteredTuitionDisplay = (std) => {
    return (
      <tr key={std._id}>
        <td>{std.student && std.student.rollNo}</td>
        <td>{std.student && std.student.fullName}</td>
        <td>${std.amount.toFixed(2)}</td>
        <td>{std.createdAt.slice(0, 10)}</td>

        <td>
          <button
            className='btn btn-success btn-sm'
            onClick={() => {
              setStdPaymentInfo(std)
              // handlePrint()
            }}
            data-bs-toggle='modal'
            data-bs-target='#invoicePrint'
            // onClick={handlePrint}
          >
            <FaPrint className='mb-1' />
          </button>
        </td>
      </tr>
    )
  }

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Invoice',
  })

  return (
    <div className='container'>
      <Head>
        <title>Registration Fee Report</title>
        <meta
          property='og:title'
          content='Registration Fee Report'
          key='title'
        />
      </Head>
      {isSuccessPost && (
        <Message variant='success'>
          Registration fee record has been fetched successfully.
        </Message>
      )}
      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row'>
          <div className='col-8'>
            {inputText({
              register,
              label: 'Student',
              errors,
              name: 'student',
              isRequired: false,
            })}
          </div>

          <div className='col-4 my-auto'>
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
                    <th>TUITION FEE</th>
                    <th>DATE</th>
                    <th>INVOICE</th>
                  </tr>
                </thead>
                <tbody>{filteredTuitionDisplay(data)}</tbody>
              </table>
            </div>
          )}

          <div
            className='modal fade'
            id='invoicePrint'
            data-bs-backdrop='static'
            data-bs-keyboard='false'
            tabIndex='-1'
            aria-labelledby='invoicePrint'
            aria-hidden='true'
          >
            <div className='modal-dialog modal-lg'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='invoicePrint'>
                    Tuition Fee Invoice
                  </h5>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'
                  ></button>
                </div>
                <div ref={componentRef}>
                  <InvoiceTemplate stdPaymentInfo={stdPaymentInfo} />
                </div>
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    data-bs-dismiss='modal'
                  >
                    Close
                  </button>

                  <button
                    onClick={handlePrint}
                    type='submit'
                    className='btn btn-success '
                  >
                    <FaPrint className='mb-1' />
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(RegistrationFee)), {
  ssr: false,
})
