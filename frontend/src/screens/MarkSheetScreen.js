import { useState } from 'react'
import { FaTrash, FaEdit } from 'react-icons/fa'
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
import { getSubjects } from '../api/subjects'
import MarksScreenStudentModal from './MarksScreenStudentModal'

const MarkSheetScreen = () => {
  const { studentId, assignedCourseId, semesterNo, shift } = useParams()

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
  } = useQuery(
    ['marks', studentId, semesterNo, shift],
    async () => await getMarks({ studentId, semesterNo, shift }),
    {
      retry: 0,
    }
  )

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
  const submitHandler = (data) => {
    const semester = semesterNo
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
          shift,
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

  const markSheetExamOne =
    dataMark && dataMark.filter((mark) => Number(mark.exam) === 1)
  const markSheetExamTwo =
    dataMark && dataMark.filter((mark) => Number(mark.exam) === 2)
  const markSheetExamThree =
    dataMark && dataMark.filter((mark) => Number(mark.exam) === 3)
  const markSheetExamFive =
    dataMark && dataMark.filter((mark) => Number(mark.exam) === 5)
  const markSheetExamFour =
    dataMark && dataMark.filter((mark) => Number(mark.exam) === 4)

  const markSheetExamHeader = (markSheet) => {
    const subjectTheoryMarks = () =>
      markSheet &&
      markSheet.reduce(
        (acc, cur) => Number(acc) + Number(cur.subject.theoryMarks),
        0
      )

    const subjectPracticalMarks = () =>
      markSheet &&
      markSheet.reduce(
        (acc, cur) => Number(acc) + Number(cur.subject.practicalMarks),
        0
      )

    const theoryMarks = () =>
      markSheet &&
      markSheet.reduce((acc, cur) => Number(acc) + Number(cur.theoryMarks), 0)
    const practicalMarks = () =>
      markSheet &&
      markSheet.reduce(
        (acc, cur) => Number(acc) + Number(cur.practicalMarks),
        0
      )

    const percentage = () => {
      const originalSum = subjectTheoryMarks() + subjectPracticalMarks()
      const obtainedSum = theoryMarks() + practicalMarks()
      return (100 * obtainedSum) / originalSum
    }

    return (
      markSheet &&
      markSheet[0] && (
        <div key={markSheet[0]._id} className='mb-5 text-primary   bg-light'>
          <div className='p-2'>
            <div className=''>
              <h4 className='fw-bold'>
                EXAM:{' '}
                <span className='text-decoration-underline'>
                  {markSheet[0].exam}{' '}
                </span>
              </h4>
              <div className='d-flex mx-auto text-primary fw-bold text-center bg-light p-2'>
                <span className='col'>
                  SEMESTER:{' '}
                  <span className='text-decoration-underline'>
                    {markSheet[0].semester}
                  </span>
                </span>
                <span className='col'>
                  EXAM DATE:{' '}
                  <span className='text-decoration-underline'>
                    {moment(markSheet[0].createdAt).format('lll')}
                  </span>
                </span>
              </div>
            </div>
            <h6 className='text-primary fw-bold text-center bg-light p-2'>
              STUDENT FULL NAME:{' '}
              <span className='text-decoration-underline'>
                {markSheet[0].student.fullName.toUpperCase()}
              </span>
            </h6>
          </div>
          <hr />
          <div className='table-responsive bg-light'>
            <table className='table table-sm hover bordered striped caption-top '>
              <thead>
                <tr>
                  <th>SUBJECT</th>
                  <th>THEORY MARKS</th>
                  <th>PRACTICAL MARKS</th>
                  <th>OBTAINED THEORY MARKS</th>
                  <th>OBTAINED PRACTICAL MARKS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {markSheet &&
                  markSheet.map((mark) => (
                    <tr key={mark._id}>
                      <td>{mark.subject.name}</td>
                      <td>{mark.subject.theoryMarks}</td>
                      <td>{mark.subject.practicalMarks}</td>
                      <td>{mark.theoryMarks}</td>
                      <td>{mark.practicalMarks}</td>
                      <td className='btn-group'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(mark)}
                          data-bs-toggle='modal'
                          data-bs-target='#marksModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm mx-1'
                          onClick={() => deleteHandler(mark._id)}
                          disabled={isLoadingDeleteMark}
                        >
                          {isLoadingDeleteMark ? (
                            <span className='spinner-border spinner-border-sm ' />
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
              <tfoot>
                <tr>
                  <td className='fw-bold'>TOTAL</td>
                  <td>{subjectTheoryMarks()}</td>
                  <td>{subjectPracticalMarks()}</td>
                  <td>{theoryMarks()}</td>
                  <td>{practicalMarks()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className='footer'>
            <h6 className='text-primary fw-bold text-decoration text-center bg-light p-2'>
              Percentage:{' '}
              <span className='text-decoration-underline'>{percentage()}%</span>
            </h6>
          </div>
        </div>
      )
    )
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
            {markSheetExamHeader(markSheetExamOne)}
            {markSheetExamHeader(markSheetExamTwo)}
            {markSheetExamHeader(markSheetExamThree)}
            {markSheetExamHeader(markSheetExamFour)}
            {markSheetExamHeader(markSheetExamFive)}
          </div>
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
        assignedCourseId={assignedCourseId}
        dataSubject={!isLoadingSubject && dataSubject}
        semesterNo={semesterNo}
      />
    </div>
  )
}

export default MarkSheetScreen
