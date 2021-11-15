import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'
import Message from '../../../../../../components/Message'
import Loader from 'react-loader-spinner'

import { getSubjects } from '../../../../../../api/subject'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { useForm } from 'react-hook-form'
import { getCourses } from '../../../../../../api/course'
import {
  dynamicInputSelect,
  dynamicOneOptionInputSelect,
  inputNumber,
} from '../../../../../../utils/dynamicForm'
import {
  getExams,
  addExam,
  updateExam,
  deleteExam,
} from '../../../../../../api/exam'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import SubPageAccess from '../../../../../../utils/SubPageAccess'
import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../../../../../components/Confirm'

const Exam = () => {
  SubPageAccess()
  const router = useRouter()

  const { assignId, courseId, semester } = router.query

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    ['exams', assignId],
    async () => await getExams({ assignId }),
    {
      enabled: !!assignId && !!courseId && !!semester,
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addExam, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['exams', assignId])
    },
  })

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = useMutation(updateExam, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['exams', assignId])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteExam, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['exams', assignId]),
  })

  const { data: subjectData } = useQuery('subjects', () => getSubjects(), {
    retry: 0,
    enabled: !!assignId && !!courseId && !!semester,
  })

  const { data: courseData } = useQuery('courses', () => getCourses(), {
    retry: 0,
    enabled: !!assignId && !!courseId && !!semester,
  })

  const submitHandler = (data) => {
    edit
      ? updateMutateAsync({
          _id: id,
          exam: data.exam,
          practicalMarks: data.practicalMarks,
          theoryMarks: data.theoryMarks,
          subject: data.subject,
          assignId,
          courseId,
        })
      : addMutateAsync({
          exam: data.exam,
          practicalMarks: data.practicalMarks,
          theoryMarks: data.theoryMarks,
          subject: data.subject,
          assignId,
          courseId,
        })
  }

  const editHandler = (exam) => {
    setId(exam._id)
    setEdit(true)
    setValue('exam', exam.exam)
    setValue('theoryMarks', exam.theoryMarks)
    setValue('practicalMarks', exam.practicalMarks)
    setValue('subject', exam.subject._id)
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteMutateAsync(id)))
  }

  const examData =
    courseId &&
    courseData &&
    courseData.filter((c) => c._id === courseId && c.exam)

  const rowAverage = (exam) => {
    const totalEarnedMarks =
      Number(exam.theoryMarks) + Number(exam.practicalMarks)
    const totalOriginalMarks =
      Number(exam.subject && exam.subject.theoryMarks) +
      Number(exam.subject && exam.subject.practicalMarks)
    return (totalEarnedMarks / totalOriginalMarks) * 100
  }

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  // const dup_and_sum = (arr) => {
  //   let seen = {},
  //     order = []
  //   arr.forEach((o) => {
  //     var subject = o['subject'].name
  //     if (subject in seen) {
  //       var theoryMarks = seen[subject].theoryMarks + o.theoryMarks
  //       var practicalMarks = seen[subject].practicalMarks + o.practicalMarks
  //       seen[subject] = o
  //       seen[subject].theoryMarks = theoryMarks
  //       seen[subject].practicalMarks = practicalMarks
  //       order.push(order.splice(order.indexOf(subject), 1))
  //     } else {
  //       seen[subject] = o
  //       order.push(subject)
  //     }
  //   })

  //   return order.map((k) => {
  //     return seen[k]
  //   })
  // }

  // console.log(dup_and_sum(data))

  return (
    <div className='container'>
      <Head>
        <title>Exam</title>
        <meta property='og:title' content='Exam' key='title' />
      </Head>
      {isSuccessAdd && (
        <Message variant='success'>
          Exam has been recorded successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isError && <Message variant='danger'>{error}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>
          Exam record has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {isSuccessUpdate && (
        <Message variant='success'>
          Exam record has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

      <div className='d-flex justify-content-between align-items-center'>
        <h3 className=''>Exam</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editExamModal'
        >
          <FaPlus className='mb-1' />
        </button>
      </div>

      <div
        className='modal fade'
        id='editExamModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editExamModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editExamModalLabel'>
                {edit ? 'Edit Exam Record' : 'Add Exam Record'}
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
                  <div className='row'>
                    {dynamicOneOptionInputSelect({
                      register,
                      label: 'Exam',
                      errors,
                      name: 'exam',
                      data: examData && examData[0] && examData[0].exam,
                    })}

                    {watch().exam &&
                      dynamicInputSelect({
                        register,
                        label: 'Subject',
                        errors,
                        name: 'subject',
                        data:
                          subjectData &&
                          subjectData.filter(
                            (p) =>
                              p.course._id === courseId &&
                              p.semester === Number(semester)
                          ),
                      })}

                    {watch().exam &&
                      inputNumber({
                        register,
                        label: 'Theory',
                        errors,
                        name: 'theoryMarks',
                      })}

                    {watch().exam &&
                      inputNumber({
                        register,
                        label: 'Practical',
                        errors,
                        name: 'practicalMarks',
                      })}
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
                      disabled={isLoadingAdd || isLoadingUpdate}
                    >
                      {isLoadingAdd || isLoadingUpdate ? (
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
          {data && (
            <div className='table-responsive '>
              <table className='table table-striped table-hover table-sm caption-top '>
                <caption>{data && data.length} records were found</caption>
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>EXAM </th>
                    <th>SUBJECT</th>
                    <th>TH. MARKS</th>
                    <th>P. MARKS</th>
                    <th>AVERAGE</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((exam) => (
                      <tr key={exam._id}>
                        <td>{exam.createdAt.slice(0, 10)}</td>
                        <td>{exam.exam}</td>
                        <td>{exam.subject && exam.subject.name}</td>
                        <td>{exam.theoryMarks}</td>
                        <td>{exam.practicalMarks}</td>
                        <td>{rowAverage(exam).toFixed(2)}%</td>
                        <td className='btn-group'>
                          <button
                            className='btn btn-primary btn-sm'
                            onClick={() => editHandler(exam)}
                            data-bs-toggle='modal'
                            data-bs-target='#editExamModal'
                          >
                            <FaEdit className='mb-1' /> Edit
                          </button>

                          <button
                            className='btn btn-danger btn-sm ms-1'
                            onClick={() => deleteHandler(exam._id)}
                            disabled={isLoadingDelete}
                          >
                            {isLoadingDelete ? (
                              <span className='spinner-border spinner-border-sm' />
                            ) : (
                              <span>
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
          )}
        </div>
      )}
    </div>
  )
}

export default Exam
