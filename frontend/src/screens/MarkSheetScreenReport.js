import { getCompleteMarkSheetReport } from '../api/reports'
import { useQuery, useMutation } from 'react-query'
import { getCourses } from '../api/courses'
import { useForm } from 'react-hook-form'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'
import logo from '../logo.png'
import moment from 'moment'
import { FaTimesCircle } from 'react-icons/fa'

const MarkSheetScreenReport = () => {
  const {
    register,
    watch,
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
    data: obj,
    mutateAsync: getMarkSheetReportMutateAsync,
  } = useMutation(['getMarkSheetReport'], getCompleteMarkSheetReport, {
    retry: 0,
    onSuccess: () => {},
  })

  const graduateStatus = obj && obj.graduateStatus
  const dataGetMarkSheetReport = obj && obj.markSheet

  const { data: dataCourse } = useQuery('courses', () => getCourses(), {
    retry: 0,
  })

  const submitHandler = (data) => {
    getMarkSheetReportMutateAsync(data)
  }

  const duration =
    dataGetMarkSheetReport &&
    dataGetMarkSheetReport.map((mark) => mark.course.duration)

  const marks = (obj) => {
    const { marks, sms } = obj

    const filteredMarks = marks && marks.filter((m) => m.semester === sms)

    const percentage = (mark) => {
      const totalMarks = Number(mark.theoryMarks) + Number(mark.practicalMarks)

      const constantMarks =
        Number(mark.subject.theoryMarks) + Number(mark.subject.practicalMarks)

      return ((100 * totalMarks) / constantMarks).toFixed(1)
    }

    const grandTotalPercentage = () => {
      const totalObtained =
        filteredMarks &&
        filteredMarks.reduce(
          (acc, cur) =>
            Number(acc) + Number(cur.theoryMarks) + Number(cur.practicalMarks),
          0
        )

      const totalMarks =
        filteredMarks &&
        filteredMarks.reduce(
          (acc, cur) =>
            Number(acc) +
            Number(cur.subject.theoryMarks) +
            Number(cur.subject.practicalMarks),
          0
        )

      return ((100 * totalObtained) / totalMarks).toFixed(1)
    }

    const grandTotal = () => {
      const grand =
        filteredMarks &&
        filteredMarks.reduce(
          (acc, cur) =>
            Number(acc) + Number(cur.theoryMarks) + Number(cur.practicalMarks),
          0
        )

      return grand
    }

    return (
      <div className='table-responsives'>
        <table className='table table-bordered border-primary'>
          <thead>
            <tr className='fw-bold text-center '>
              <th colSpan='3'>Semester {sms}</th>
            </tr>
            <tr className=''>
              <th>Course Name</th>
              <th>Total Marks</th>
              <th>Average Marks</th>
            </tr>
          </thead>
          <tbody>
            {filteredMarks &&
              filteredMarks.map((mark, index) => (
                <tr key={index}>
                  <td>{mark.subject.name}</td>
                  <td>
                    {Number(mark.theoryMarks) + Number(mark.practicalMarks)}
                  </td>
                  <td>{percentage(mark)}%</td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Total:</th>
              <th>{grandTotal()}</th>
              <th>{grandTotalPercentage()}%</th>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row '>
          <div className='col-md-4 col-12'>
            <div className='mb-3'>
              <label htmlFor='student'>Student Roll No</label>
              <input
                {...register('student', {
                  required: 'Student Roll No is required',
                })}
                type='text'
                min='0'
                placeholder='Enter student roll no'
                className='form-control'
              />
              {errors.student && (
                <span className='text-danger'>{errors.student.message}</span>
              )}
            </div>
          </div>
          <div className='col-md-4 col-12'>
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

          <div className='col-md-2 col-12'>
            <div className='mb-3'>
              <label htmlFor='semester'>Semester</label>
              <select
                {...register('semester', {
                  required: 'Semester is required',
                })}
                type='text'
                placeholder='Enter semester'
                className='form-control'
              >
                <option value=''>-----------</option>
                {dataCourse &&
                  dataCourse.map(
                    (course) =>
                      course._id === watch().course &&
                      [...Array(course.duration).keys()].map((semester) => (
                        <option key={semester + 1} value={semester + 1}>
                          {semester + 1} Semester
                        </option>
                      ))
                  )}
              </select>
              {errors.exam && (
                <span className='text-danger'>{errors.exam.message}</span>
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
                          dataGetMarkSheetReport[0].student.rollNo}
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
                        {graduateStatus && graduateStatus.isGraduated ? (
                          moment(
                            graduateStatus && graduateStatus.graduateDate
                          ).format('lll')
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
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
              {Number(watch().semester) === 0 ? (
                <div className='row'>
                  {[...Array(duration[0]).keys()].map((sms) => (
                    <div key={sms + 1} className='col-md-6'>
                      {marks({ marks: dataGetMarkSheetReport, sms: sms + 1 })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className='row'>
                  {marks({
                    marks: dataGetMarkSheetReport,
                    sms: Number(watch().semester),
                  })}
                </div>
              )}
            </div>
            {/* {console.log(dataGetMarkSheetReport)} */}
          </>
        )
      )}
    </div>
  )
}

export default MarkSheetScreenReport
