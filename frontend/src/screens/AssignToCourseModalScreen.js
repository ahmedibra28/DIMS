import React from 'react'

const AssignToCourseModalScreen = ({
  submitHandler,
  register,
  handleSubmit,
  watch,
  errors,
  isLoadingUpdateAssignToCourse,
  isLoadingAddAssignToCourse,
  formCleanHandler,
  dataCourse,
}) => {
  return (
    <div
      className='modal fade'
      id='assignToCourseModal'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      tabIndex='-1'
      aria-labelledby='assignToCourseModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content modal-background'>
          <div className='modal-header'>
            <h5 className='modal-title' id='assignToCourseModalLabel'>
              Assign To Course
            </h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
              onClick={formCleanHandler}
            ></button>
          </div>
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className='modal-body'>
              <div className='row'>
                <div className='col-md-6 col-12'>
                  <div className='mb-3'>
                    <label htmlFor='course'>Interested course</label>
                    <select
                      {...register('course', {
                        required: 'Interested course Type is required',
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
                      <span className='text-danger'>
                        {errors.course.message}
                      </span>
                    )}
                  </div>
                </div>
                {watch().course && (
                  <div className='col-md-6 col-12'>
                    <div className='mb-3'>
                      <label htmlFor='semester'>Semester</label>
                      <select
                        {...register('semester', {
                          required: 'Semester is required',
                        })}
                        type='text'
                        placeholder='Enter name'
                        className='form-control'
                      >
                        <option value=''>-----------</option>
                        {dataCourse &&
                          dataCourse.map(
                            (semester) =>
                              semester.isActive &&
                              semester._id === watch().course &&
                              [...Array(semester.duration).keys()].map(
                                (sem) => (
                                  <option key={sem + 1} value={sem + 1}>
                                    {sem + 1}
                                  </option>
                                )
                              )
                          )}
                      </select>
                      {errors.semester && (
                        <span className='text-danger'>
                          {errors.semester.message}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className='col-md-6 col-12'>
                  <div className='mb-3'>
                    <label htmlFor='dateOfAdmission'>Date of admission</label>
                    <input
                      {...register('dateOfAdmission', {
                        required: 'Date of admission is required',
                      })}
                      type='date'
                      placeholder='Enter date of admission'
                      className='form-control'
                    />
                    {errors.dateOfAdmission && (
                      <span className='text-danger'>
                        {errors.dateOfAdmission.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className='col-md-6 col-12'>
                  <div className='mb-3'>
                    <label htmlFor='shift'>Shift</label>
                    <select
                      {...register('shift', {
                        required: 'Shift is required',
                      })}
                      type='text'
                      placeholder='Enter date of admission'
                      className='form-control'
                    >
                      <option value=''>-----------</option>
                      <option value='Morning'>Morning</option>
                      <option value='Afternoon'>Afternoon</option>
                    </select>
                    {errors.shift && (
                      <span className='text-danger'>
                        {errors.shift.message}
                      </span>
                    )}
                  </div>
                </div>
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
                  isLoadingAddAssignToCourse || isLoadingUpdateAssignToCourse
                }
              >
                {isLoadingAddAssignToCourse || isLoadingUpdateAssignToCourse ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AssignToCourseModalScreen
