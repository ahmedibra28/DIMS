import dynamicAPI from './dynamicAPI'

const url = '/api/admin/student/assign-course'

export const getAssignCourses = async (id) =>
  await dynamicAPI('get', `${url}/${id}`, {})

export const addAssignCourse = async (obj) => await dynamicAPI('post', url, obj)

export const updateAssignCourse = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteAssignCourse = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
