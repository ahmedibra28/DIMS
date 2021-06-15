import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { FaPlus } from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'
import moment from 'moment'
import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'
import { addMark, deleteMark, getMarks, updateMark } from '../api/marks'
import { getAssignToCourses } from '../api/assignToCourse'
import { getSubjects } from '../api/subjects'
import MarksScreenStudentModal from './MarksScreenStudentModal'

const MarkSheetScreen = () => {
  const { studentId, assignedCourseId } = useParams()
  const [edit, setEdit] = useState(false)
  const [id, setId] = useState(null)
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm()

  const { data: dataAssignToCourse } = useQuery(
    ['assign-to-course', studentId],
    () => getAssignToCourses(studentId),
    { retry: 0 }
  )

  const { data: dataSubject, isLoading: isLoadingSubject } = useQuery(
    'subjects',
    async () => await getSubjects(),
    {
      retry: 0,
    }
  )

  const {
    data: dataMark,
    isLoading: isLoadingGetMark,
    isError: isErrorGetMark,
    error: errorGetMark,
  } = useQuery(['marks', studentId], async () => await getMarks(studentId), {
    retry: 0,
  })

  const {
    isLoading: isLoadingUpdateMark,
    isError: isErrorUpdateMark,
    error: errorUpdateMark,
    isSuccess: isSuccessUpdateMark,
    mutateAsync: updateMarkMutateAsync,
  } = useMutation(['updateMark'], updateMark, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['marks'])
    },
  })

  const {
    isLoading: isLoadingDeleteMark,
    isError: isErrorDeleteMark,
    error: errorDeleteMark,
    isSuccess: isSuccessDeleteMark,
    mutateAsync: deleteMarkMutateAsync,
  } = useMutation(['deleteMark'], deleteMark, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['marks']),
  })

  const {
    isLoading: isLoadingAddMark,
    isError: isErrorAddMark,
    error: errorAddMark,
    isSuccess: isSuccessAddMark,
    mutateAsync: addMarkMutateAsync,
  } = useMutation(['addMark'], addMark, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['marks'])
    },
  })

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteMarkMutateAsync(id)))
  }
  //   console.log(dataAssignToCourse && dataAssignToCourse)
  const submitHandler = (data) => {
    const semester = dataAssignToCourse && dataAssignToCourse[0].semester
    const course = assignedCourseId
    const student = studentId
    const { practicalMarks, theoryMarks, subject, exam } = data

    edit
      ? updateMarkMutateAsync({
          _id: id,
        })
      : addMarkMutateAsync({
          practicalMarks,
          theoryMarks,
          subject,
          student,
          course,
          exam,
          semester,
        })
  }

  const editHandler = (assign) => {
    setId(assign._id)
    setEdit(true)
    setValue('course', assign.course._id)
    setValue('exam', assign.exam)
    setValue('semester', assign.semester)
    setValue('shift', assign.shift)
    setValue('dateOfAdmission', assign.dateOfAdmission)
    setValue('status', assign.status)
    setValue(
      'dateOfAdmission',
      moment(assign.dateOfAdmission).format('YYYY-MM-DD')
    )
  }

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  return (
    <div>
      {isSuccessUpdateMark && (
        <Message variant='success'>
          Marks has been updated successfully.
        </Message>
      )}
      {isErrorUpdateMark && (
        <Message variant='danger'>{errorUpdateMark}</Message>
      )}
      {isSuccessAddMark && (
        <Message variant='success'>Marks has been done successfully.</Message>
      )}
      {isErrorAddMark && <Message variant='danger'>{errorAddMark}</Message>}
      {isSuccessDeleteMark && (
        <Message variant='success'>
          Marks has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteMark && (
        <Message variant='danger'>{errorDeleteMark}</Message>
      )}

      <div className='d-flex justify-content-between align-items-center'>
        <h3 className=''>Student Mark Sheet</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#marksModal'
        >
          <FaPlus className='mb-1' />
        </button>
      </div>

      {isLoadingGetMark ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isErrorGetMark ? (
        <Message variant='danger'>{errorGetMark}</Message>
      ) : (
        <>
          <div className='mt-2'>
            {dataMark &&
              dataMark.map((mark) => (
                <>
                  <div className='text-primary  text-center bg-light p-2'>
                    <h4 className='fw-bold'>
                      EXAM:{' '}
                      <span className='text-decoration-underline'>
                        {mark.exam}{' '}
                      </span>
                    </h4>
                    <div className='d-flex mx-auto text-primary fw-bold text-center bg-light p-2'>
                      <span className='col'>
                        SEMESTER:{' '}
                        <span className='text-decoration-underline'>
                          {mark.semester}
                        </span>
                      </span>
                      <span className='col'>
                        EXAM DATE:{' '}
                        <span className='text-decoration-underline'>
                          {moment(mark.createdAt).format('lll')}
                        </span>
                      </span>
                    </div>
                  </div>
                  <h6 className='text-primary fw-bold text-center bg-light p-2'>
                    STUDENT FULL NAME:{' '}
                    <span className='text-decoration-underline'>
                      {mark.student.fullName.toUpperCase()}
                    </span>
                  </h6>
                </>
              ))}

            <div className='table-responsive bg-light'>
              <table className='table table-sm hover bordered striped caption-top '>
                <thead>
                  <tr>
                    <th>SUBJECT</th>
                    <th>THEORY MARKS</th>
                    <th>PRACTICAL MARKS</th>
                    <th>OBTAINED THEORY MARKS</th>
                    <th>OBTAINED PRACTICAL MARKS</th>
                    <th>GRADE</th>
                    <th>REMARKS</th>
                  </tr>
                </thead>
                <tbody>
                  {dataMark &&
                    dataMark.map((mark) => (
                      <tr key={mark._id}>
                        <td>{mark.subject.name}</td>
                        <td>{mark.subject.theoryMarks}</td>
                        <td>{mark.subject.practicalMarks}</td>
                        <td>{mark.theoryMarks}</td>
                        <td>{mark.practicalMarks}</td>
                        <td>A+</td>
                        <td>Very Good</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className='footer mb-5'>
              <h6 className='text-primary fw-bold text-decoration text-center bg-light p-2'>
                Percentage:{' '}
                <span className='text-decoration-underline'> 80%</span>
              </h6>
            </div>
          </div>
          ))}
        </>
      )}

      <MarksScreenStudentModal
        submitHandler={submitHandler}
        register={register}
        handleSubmit={handleSubmit}
        watch={watch}
        errors={errors}
        formCleanHandler={formCleanHandler}
        isLoadingUpdateMark={isLoadingUpdateMark}
        isLoadingAddMark={isLoadingAddMark}
        marks={dataAssignToCourse && dataAssignToCourse[0]}
        dataSubject={!isLoadingSubject && dataSubject}
      />
    </div>
  )
}

export default MarkSheetScreen
