import { useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Message from '../components/Message'
import { useMutation } from 'react-query'
import { useForm } from 'react-hook-form'
import { inputText } from '../utils/dynamicForm'
import { tuitionConfirmation } from '../api/clearanceConfirmation'
import { FaCheckCircle, FaPrint } from 'react-icons/fa'

import logo from '../images/logo.png'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print'

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

  console.log({ data })

  const submitHandler = (data) => {
    postMutateAsync(data)
  }

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Examination Card',
    pageStyle: `
    @page {
      size: A4 landscape !important;
    }
    `,
  })

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

      <div className='text-end'>
        <button
          className='btn btn-success btn-lg'
          onClick={() => {
            handlePrint()
          }}
        >
          <FaPrint className='mb-1' />
        </button>
      </div>

      <div ref={componentRef}>
        {data &&
          data.length > 0 &&
          data.map((d) => (
            <>
              <div key={d._id} className='my-5 border border-primary p-2 '>
                <div className='row'>
                  <div className='col-md-2'>
                    <Image
                      width='128'
                      height='128'
                      priority
                      src={logo}
                      alt='logo'
                      className='img-fluid'
                    />
                  </div>
                  <div className='col-md-8'>
                    <h1 className='text-center mark-sheet-title text-primary'>
                      Sayid Mohamed Technical Education College
                    </h1>
                    <h4 className='text-center mark-sheet-title-2 text-primary'>
                      SaMTEC
                    </h4>
                    <h5 className='text-center mark-sheet-title-2 text-primary'>
                      {d.course.name}
                    </h5>
                  </div>
                  <div className='col-md-2'>
                    <Image
                      width='128'
                      height='128'
                      priority
                      src={d.student.picture.picturePath}
                      alt={d.student.picture.pictureName}
                      className='img-fluid'
                      style={{ width: '8rem' }}
                    />
                  </div>
                </div>
                <hr />

                <h4 className='text-center'>Official Transcript</h4>
                <div className='table-responsive'>
                  <table className='table table-bordered border-primary'>
                    <tbody>
                      <tr>
                        <th>Name</th>
                        <td>{d.student.fullName}</td>
                        <th>ID. No.</th>
                        <td> {d.student.rollNo}</td>
                      </tr>
                      <tr>
                        <th>Shift</th>
                        <td> {d.shift}</td>
                        <th>Semester</th>
                        <td> {d.semester}</td>
                      </tr>
                      <tr>
                        <th>Sex</th>
                        <td> {d.student.gender}</td>
                        <th>Qualification</th>
                        <td> {d.course.name}</td>
                      </tr>

                      <tr>
                        <th>Status</th>
                        <td>
                          <button className='btn btn-success btn-sm'>
                            <FaCheckCircle className='mb-1' /> Clean
                          </button>
                        </td>
                        <th>Printing Date</th>
                        <td>{moment(new Date()).format('lll')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ))}
      </div>

      {/* {data && data.tuition && data.tuition.length > 0
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
          )} */}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(ClearanceConfirmation)), {
  ssr: false,
})
