import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'
import InvoiceTemplate from '../../components/InvoiceTemplate'
import { useMutation, useQueryClient } from 'react-query'

import { useForm } from 'react-hook-form'

import { inputText, staticInputSelect } from '../../utils/dynamicForm'
import { getSingleStudentTuitionsReport } from '../../api/report'
import { deleteTuition } from '../../api/tuition'
import { FaCheckCircle, FaTimesCircle, FaPrint, FaTrash } from 'react-icons/fa'
import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../components/Confirm'

const Tuition = () => {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const [stdPaymentInfo, setStdPaymentInfo] = useState(null)
  const queryClient = useQueryClient()
  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    isSuccess: isSuccessPost,
    mutateAsync: postMutateAsync,
    data,
  } = useMutation(getSingleStudentTuitionsReport, {
    retry: 0,
    onSuccess: () => {},
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteTuition, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['tuitions']),
  })

  const submitHandler = (data) => {
    postMutateAsync(data)
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteMutateAsync(id)))
  }

  const filteredTuitionDisplay = (std) => {
    return (
      <tr key={std._id}>
        <td>{std.student && std.student.rollNo}</td>
        <td>{std.student && std.student.fullName}</td>
        <td>{std && std.shift}</td>
        <td>{std && std.semester}</td>
        <td>{std.course && std.course.name}</td>
        <td>${std.amount.toFixed(2)}</td>
        <td>{std.createdAt.slice(0, 10)}</td>
        <td>
          {std.isPaid ? (
            <FaCheckCircle className='text-success mb-1' />
          ) : (
            <FaTimesCircle className='text-danger mb-1' />
          )}
        </td>
        <td>
          {std.isPaid && (
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
          )}
          <button
            className='btn btn-danger btn-sm ms-1'
            onClick={() => deleteHandler(std._id)}
            disabled={isLoadingDelete}
          >
            {isLoadingDelete ? (
              <span className='spinner-border spinner-border-sm' />
            ) : (
              <span>
                {' '}
                <FaTrash className='mb-1' />
              </span>
            )}
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
        <title>Tuition Report</title>
        <meta property='og:title' content='Tuition Report' key='title' />
      </Head>
      {isSuccessPost && (
        <Message variant='success'>
          Tuition record has been fetched successfully.
        </Message>
      )}
      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}

      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>Tuition has been cancelled.</Message>
      )}

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row'>
          <div className='col-md-5 col-12'>
            {inputText({
              register,
              label: 'Student',
              errors,
              name: 'student',
              isRequired: false,
            })}
          </div>
          <div className='col-md-5 col-12'>
            {staticInputSelect({
              register,
              label: 'Option',
              errors,
              name: 'option',
              data: [{ name: 'Paid' }, { name: 'Unpaid' }],
              isRequired: false,
            })}
          </div>

          <div className='col-md-2 col-12 my-auto'>
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
                    <th>SHIFT</th>
                    <th>SEMESTER</th>
                    <th>COURSE</th>
                    <th>TUITION FEE</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>INVOICE</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.map((std) => filteredTuitionDisplay(std))}
                </tbody>
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

export default dynamic(() => Promise.resolve(withAuth(Tuition)), {
  ssr: false,
})
