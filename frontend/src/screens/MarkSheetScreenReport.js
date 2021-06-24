import { getCompleteMarkSheetReport } from '../api/reports'
import { useQuery, useMutation } from 'react-query'
import { getCourses } from '../api/courses'
import { useForm } from 'react-hook-form'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'
import logo from '../logo.png'
import moment from 'moment'

const MarkSheetScreenReport = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const {
    isLoading: isLoadingGetMarkSheetReport,
    isError: isErrorGetMarkSheetReport,
    error: errorGetMarkSheetReport,
    isSuccess: isSuccessGetMarkSheetReport,
    data: dataGetMarkSheetReport,
    mutateAsync: getMarkSheetReportMutateAsync,
  } = useMutation(['getMarkSheetReport'], getCompleteMarkSheetReport, {
    retry: 0,
    onSuccess: () => {},
  })

  const { data: dataCourse } = useQuery('courses', () => getCourses(), {
    retry: 0,
  })

  const submitHandler = (data) => {
    getMarkSheetReportMutateAsync(data)
  }

  console.log(dataGetMarkSheetReport && dataGetMarkSheetReport)

  // const noOfSemester =
  //   dataGetMarkSheetReport && dataGetMarkSheetReport[0].course.duration

  // console.log(noOfSemester)

  const markSheetReport =
    dataGetMarkSheetReport &&
    dataGetMarkSheetReport.filter(
      (mark) =>
        dataGetMarkSheetReport &&
        dataGetMarkSheetReport.map((c) =>
          [...Array(c.duration).keys()].map(
            (sem) => sem + 1 === Number(mark.semester)
          )
        )
    )

  const marks = (marks) => {
    return (
      <div className='col-md-6'>
        <div className='table-responsive'>
          <table className='table table-bordered border-primary'>
            <thead>
              <tr className='fw-bold text-center'>
                Semester {marks && marks[0].semester}
              </tr>
              <tr>
                <th>Course Name</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {marks &&
                marks.map((mark, index) => (
                  <tr key={index}>
                    <td>{mark.subject.name}</td>
                    <td>{mark.theoryMarks + mark.practicalMarks}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className='col-md-6'></div>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row '>
          <div className='col-md-4 col-12'>
            <div className='mb-3'>
              <label htmlFor='student'>Student ID</label>
              <input
                {...register('student', {
                  required: 'Student ID is required',
                })}
                type='number'
                min='0'
                placeholder='Enter student ID'
                className='form-control'
              />
              {errors.student && (
                <span className='text-danger'>{errors.student.message}</span>
              )}
            </div>
          </div>
          <div className='col-md-6 col-12'>
            <div className='mb-3'>
              <label htmlFor='course'>Course</label>
              <select
                {...register('course', {
                  required: 'Course is required',
                })}
                type='text'
                placeholder='Enter course'
                className='form-control'
              >
                <option value=''>-----------</option>
                {dataCourse &&
                  dataCourse.map(
                    (course) =>
                      course.isActive && (
                        <option key={course._id} value={course._id}>
                          {course.name}
                        </option>
                      )
                  )}
              </select>
              {errors.course && (
                <span className='text-danger'>{errors.course.message}</span>
              )}
            </div>
          </div>
          <div className='col-md-1 col-1 mt-3'>
            <button
              type='submit'
              className='btn btn-primary mt-2 btn-lg'
              disabled={isLoadingGetMarkSheetReport}
            >
              {isLoadingGetMarkSheetReport ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>
      </form>

      {isErrorGetMarkSheetReport && (
        <Message variant='danger'>{errorGetMarkSheetReport}</Message>
      )}
      {isSuccessGetMarkSheetReport && (
        <Message variant='success'>
          Student mark sheet found successfully
        </Message>
      )}

      {isLoadingGetMarkSheetReport ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isErrorGetMarkSheetReport ? (
        <Message variant='danger'>{errorGetMarkSheetReport}</Message>
      ) : (
        dataGetMarkSheetReport &&
        dataGetMarkSheetReport.length > 0 && (
          <>
            <div className='container'>
              <hr />
              <div className='row'>
                <div className='col-md-2'>
                  <img
                    src={logo}
                    alt='logo'
                    className='img-fluid'
                    style={{ width: '8rem' }}
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
                    {dataGetMarkSheetReport &&
                      dataGetMarkSheetReport[0].course.name}
                  </h5>
                </div>
                <div className='col-md-2'>
                  <img
                    src={
                      dataGetMarkSheetReport &&
                      dataGetMarkSheetReport[0].student.picture.picturePath
                    }
                    alt={
                      dataGetMarkSheetReport &&
                      dataGetMarkSheetReport[0].student.picture.pictureName
                    }
                    className='img-fluid'
                    style={{ width: '8rem' }}
                  />
                </div>
              </div>
              <hr />

              <h4 className='text-center'>Official Transcript</h4>
              <div className='table-responsive'>
                <table className='table table-bordered border-primary'>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <td>
                        {dataGetMarkSheetReport &&
                          dataGetMarkSheetReport[0].student.fullName}
                      </td>
                      <th>ID. No.</th>
                      <td>
                        {' '}
                        {dataGetMarkSheetReport &&
                          dataGetMarkSheetReport[0].student.studentIdNo}
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>Sex</th>
                      <td>
                        {' '}
                        {dataGetMarkSheetReport &&
                          dataGetMarkSheetReport[0].student.gender}
                      </td>
                      <th>Qualification</th>
                      <td>
                        {' '}
                        {dataGetMarkSheetReport &&
                          dataGetMarkSheetReport[0].course.name}
                      </td>
                    </tr>
                    <tr>
                      <th>Admission</th>
                      <td>
                        {moment(
                          dataGetMarkSheetReport &&
                            dataGetMarkSheetReport[0].createdAt
                        ).format('lll')}
                      </td>
                      <th>Graduation Date</th>
                      <td>
                        {moment(
                          dataGetMarkSheetReport &&
                            dataGetMarkSheetReport[0].createdAt
                        ).format('lll')}
                      </td>
                    </tr>
                    <tr>
                      <th>Transcript No.</th>
                      <td>
                        {dataGetMarkSheetReport &&
                          dataGetMarkSheetReport[0]._id}
                      </td>
                      <th>Issue Date</th>
                      <td>{moment(new Date()).format('lll')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className='row'>{marks(markSheetReport)}</div>
            </div>
          </>
        )
      )}
    </div>
  )
}

export default MarkSheetScreenReport
