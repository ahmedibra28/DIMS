import { useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Message from '../components/Message'
import { useMutation } from 'react-query'
import { useForm } from 'react-hook-form'
import { inputText } from '../utils/dynamicForm'
import { clearanceCard } from '../api/clearanceCard'
import { FaCheckCircle, FaPrint, FaPhone, FaAward } from 'react-icons/fa'

import moment from 'moment'
import { useReactToPrint } from 'react-to-print'
import ImageLazyLoad from '../components/LazyLoad'

const ClearanceCard = () => {
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
  } = useMutation(clearanceCard, {
    retry: 0,
    onSuccess: () => {},
  })

  const submitHandler = (data) => {
    postMutateAsync(data)
  }

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Examination Card',
    pageStyle: `
    @page {
      size: A4 portrait !important;
    }
    `,
  })

  return (
    <div className='container'>
      <Head>
        <title>Student Clearance Card</title>
        <meta
          property='og:title'
          content='Student Clearance Card'
          key='title'
        />
      </Head>
      {isSuccessPost && (
        <Message variant='success'>
          Clearance card has been confirmed successfully.
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

      <div className='text-center p-2'>
        <button
          className='btn btn-success btn-lg rounded-pill shadow'
          onClick={() => {
            handlePrint()
          }}
        >
          <FaPrint className='mb-1' />
        </button>
      </div>
      <div className='row gy-5' ref={componentRef}>
        {data &&
          data.length > 0 &&
          data.map((d) => (
            <>
              <div className='col-lg-6 col-md-10 col-12'>
                <div className='card shadow-lg clearance'>
                  <div className='card-body'>
                    <div className='row'>
                      <div className='col-auto border border-primary border-start-0 border-top-0 border-bottom-0 d-flex flex-column justify-content-around'>
                        <Image
                          width='100'
                          height='100'
                          src='/samtec-logo.png'
                          alt='logo'
                          className='img-fluid '
                        />

                        <ImageLazyLoad
                          height={100}
                          width={100}
                          image={d.student.picture.picturePath}
                          alt={d.student.picture.pictureName}
                          circle={true}
                        />
                      </div>
                      <div className='col-8'>
                        <div className='text-center'>
                          <div className='approved bg-success text-uppercase'>
                            <FaCheckCircle className='me-1' />
                            Approved
                          </div>
                          <h4 className='card-title text-primary fw-bold fs-6 font-monospace patientID'>
                            {d.student.rollNo}
                          </h4>
                          <h6 className='card-title text-primary fw-bold font-monospace text-uppercase'>
                            EXAM CLEARANCE CARD @{' '}
                            {moment(d.generatedAt).format('LL')}
                          </h6>
                          <h5 className='card-title text-primary fw-bold text-uppercase'>
                            SAYID MOHAMED TECHNICAL EDUCATION COLLEGE <br />
                            (SaMTEC)
                          </h5>{' '}
                          <hr />
                          <h4 className='card-title text-primary fw-light font-monospace text-uppercase'>
                            {d.student.fullName}
                          </h4>
                          <span className='  fs-6 text-uppercase'>
                            {d.course}
                          </span>
                          <br />
                          <span className='  fs-6 text-uppercase'>
                            {d.exam} - {d.academic}
                          </span>
                        </div>
                        <hr />

                        <div className='card border-0'>
                          <ul className='list-group list-group-flush'>
                            <li className='list-group-item'>
                              <FaAward className='mb-1 me-1 text-primary' />
                              <span className='  fs-6'>
                                Semester {d.semester}, {d.shift} Shift
                              </span>
                            </li>

                            <li className='list-group-item'>
                              <FaPhone className='mb-1 me-1 text-primary' />
                              <span className='  fs-6'>
                                {d.student.mobileNumber}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(ClearanceCard)), {
  ssr: false,
})
