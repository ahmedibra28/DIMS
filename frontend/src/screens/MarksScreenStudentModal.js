import React from 'react'

const MarksScreenStudentModal = ({
  submitHandler,
  register,
  handleSubmit,
  watch,
  errors,
  formCleanMarksHandler,
  isLoadingUpdateMark,
  isLoadingAddMark,
  marks,
  dataSubject,
}) => {
  return marks ? (
    <div>
      <div
        className='modal fade'
        id='marksModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='marksModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h5 className='modal-title' id='marksModalLabel'>
                Mark Sheet
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={formCleanMarksHandler}
              ></button>
            </div>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className='modal-body'>
                <div className='row'>
                  <div className='col-md-4 col-12'>
                    <div className='mb-3'>
                      <label htmlFor='subject'>Subject</label>
                      <select
                        {...register('subject', {
                          required: 'Subject is required',
                        })}
                        type='text'
                        placeholder='Enter subject'
                        className='form-control'
                      >
                        <option value=''>-----------</option>
                        {dataSubject &&
                          marks &&
                          marks.course &&
                          dataSubject.map(
                            (subject) =>
                              subject.isActive &&
                              marks.course._id === subject.course._id &&
                              marks.semester === subject.semester && (
                                <option key={subject._id} value={subject._id}>
                                  {subject.name}
                                </option>
                              )
                          )}
                      </select>
                      {errors.subject && (
                        <span className='text-danger'>
                          {errors.subject.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='col-md-4 col-6'>
                    <div className='mb-3'>
                      <label htmlFor='theoryMarks'>Theory Marks</label>
                      <input
                        {...register('theoryMarks', {
                          required: 'Theory Marks is required',
                        })}
                        type='number'
                        placeholder='Enter theoryMarks'
                        className='form-control'
                        step='.01'
                      />
                      {errors.theoryMarks && (
                        <span className='text-danger'>
                          {errors.theoryMarks.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='col-md-4 col-6'>
                    <div className='mb-3'>
                      <label htmlFor='practicalMarks'>Practical Marks</label>
                      <input
                        {...register('practicalMarks', {
                          required: 'Practical Marks is required',

                          validate: (value) =>
                            Number(value) + Number(watch().theoryMarks) < 100 ||
                            'Total marks should be equal to 100',
                        })}
                        type='number'
                        placeholder='Enter practicalMarks'
                        className='form-control'
                        step='.01'
                      />
                      {errors.practicalMarks && (
                        <span className='text-danger'>
                          {errors.practicalMarks.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  data-bs-dismiss='modal'
                  onClick={formCleanMarksHandler}
                >
                  Close
                </button>
                <button
                  type='submit'
                  className='btn btn-primary '
                  disabled={isLoadingAddMark || isLoadingUpdateMark}
                >
                  {isLoadingAddMark || isLoadingUpdateMark ? (
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
    </div>
  ) : null
}

export default MarksScreenStudentModal
