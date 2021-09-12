import { useState } from 'react'
import {
  deleteTicketActivation,
  addTicketActivation,
  updateTicketActivation,
  getTicketActivations,
} from '../api/tickets'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getCourses } from '../api/courses'
import { useForm } from 'react-hook-form'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'
import { Confirm } from '../components/Confirm'
import { confirmAlert } from 'react-confirm-alert'
import {
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'
import {
  dynamicInputSelect,
  dynamicInputSelectNumber,
  inputCheckBox,
  staticInputSelect,
} from '../components/dynamicForm'

const TicketActivationScreen = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
    },
  })

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'ticket activations',
    () => getTicketActivations(),
    {
      retry: 0,
    }
  )

  const { data: courseData } = useQuery('courses', () => getCourses(), {
    retry: 0,
  })

  const {
    isLoading: isLoadingUpdateTicketActivation,
    isError: isErrorUpdateTicketActivation,
    error: errorUpdateTicketActivation,
    isSuccess: isSuccessUpdateTicketActivation,
    mutateAsync: updateTicketActivationMutateAsync,
  } = useMutation(['updateTicketActivation'], updateTicketActivation, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['ticket activations'])
    },
  })

  const {
    isLoading: isLoadingDeleteTicketActivation,
    isError: isErrorDeleteTicketActivation,
    error: errorDeleteTicketActivation,
    isSuccess: isSuccessDeleteTicketActivation,
    mutateAsync: deleteTicketActivationMutateAsync,
  } = useMutation(['deleteTicketActivation'], deleteTicketActivation, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['ticket activations']),
  })

  const {
    isLoading: isLoadingAddTicketActivation,
    isError: isErrorAddTicketActivation,
    error: errorAddTicketActivation,
    isSuccess: isSuccessAddTicketActivation,
    mutateAsync: addTicketActivationMutateAsync,
  } = useMutation(['addTicketActivation'], addTicketActivation, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['ticket activations'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteTicketActivationMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateTicketActivationMutateAsync({
          _id: id,
          isActive: data.isActive,
        })
      : addTicketActivationMutateAsync(data)
  }

  const editHandler = (data) => {
    setId(data._id)
    setEdit(true)
    setValue('course', data.course && data.course._id)
    setValue('shift', data.shift)
    setValue('semester', data.semester)
    setValue('isActive', data.isActive)
  }

  const durationArr =
    watch().course &&
    courseData &&
    courseData.filter((p) => p._id === watch().course)

  return (
    <div className='container'>
      {isSuccessUpdateTicketActivation && (
        <Message variant='success'>
          TicketActivation has been updated successfully.
        </Message>
      )}
      {isErrorUpdateTicketActivation && (
        <Message variant='danger'>{errorUpdateTicketActivation}</Message>
      )}
      {isSuccessAddTicketActivation && (
        <Message variant='success'>
          TicketActivation has been Created successfully.
        </Message>
      )}
      {isErrorAddTicketActivation && (
        <Message variant='danger'>{errorAddTicketActivation}</Message>
      )}
      {isSuccessDeleteTicketActivation && (
        <Message variant='success'>
          TicketActivation has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteTicketActivation && (
        <Message variant='danger'>{errorDeleteTicketActivation}</Message>
      )}
      <div
        className='modal fade'
        id='editTicketActivationModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editTicketActivationModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editTicketActivationModalLabel'>
                {edit ? 'Edit Ticket Activation' : 'Add Ticket Activation'}
              </h3>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={formCleanHandler}
              ></button>
            </div>
            <div className='modal-body'>
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
                <form onSubmit={handleSubmit(submitHandler)}>
                  {dynamicInputSelect({
                    register,
                    errors,
                    name: 'course',
                    label: 'Course',
                    data: courseData && courseData,
                  })}

                  {watch().course &&
                    dynamicInputSelectNumber({
                      register,
                      label: 'Semester',
                      errors,
                      name: 'semester',
                      data:
                        durationArr &&
                        durationArr[0] &&
                        durationArr[0].duration,
                    })}

                  {watch().semester &&
                    staticInputSelect({
                      register,
                      label: 'Shift',
                      errors,
                      name: 'shift',
                      data: [{ name: 'Morning' }, { name: 'Afternoon' }],
                    })}

                  <div className='row'>
                    <div className='col'>
                      {inputCheckBox({
                        register,
                        errors,
                        label: 'isActive',
                        name: 'isActive',
                        isRequired: false,
                      })}
                    </div>
                  </div>

                  <div className='modal-footer'>
                    <button
                      type='button'
                      className='btn btn-secondary '
                      data-bs-dismiss='modal'
                      onClick={formCleanHandler}
                    >
                      Close
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary '
                      disabled={
                        isLoadingAddTicketActivation ||
                        isLoadingUpdateTicketActivation
                      }
                    >
                      {isLoadingAddTicketActivation ||
                      isLoadingUpdateTicketActivation ? (
                        <span className='spinner-border spinner-border-sm' />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='d-flex justify-content-between align-items-center'>
        <h3 className=''>Ticket Activations</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editTicketActivationModal'
        >
          <FaPlus className='mb-1' />
        </button>
      </div>

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
        <>
          <div className='table-responsive '>
            <table className='table table-sm hover bordered striped caption-top '>
              <caption>{data && data.length} records were found</caption>
              <thead>
                <tr>
                  <th>COURSE</th>
                  <th>SEMESTER</th>
                  <th>SHIFT</th>
                  <th>ACTIVE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((course) => (
                    <tr key={course._id}>
                      <td>{course.course && course.course.name}</td>
                      <td>{course.semester} Semester</td>
                      <td>{course.shift}</td>
                      <td>
                        {course.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>

                      <td className='btn-group'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(course)}
                          data-bs-toggle='modal'
                          data-bs-target='#editTicketActivationModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(course._id)}
                          disabled={isLoadingDeleteTicketActivation}
                        >
                          {isLoadingDeleteTicketActivation ? (
                            <span className='spinner-border spinner-border-sm' />
                          ) : (
                            <span>
                              {' '}
                              <FaTrash className='mb-1' /> Delete
                            </span>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default TicketActivationScreen
