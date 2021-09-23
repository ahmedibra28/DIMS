import dynamicAPI from './dynamicAPI'

const url = '/api/admin/course'

export const getCourses = async () => await dynamicAPI('get', url, {})

export const addCourse = async (obj) => await dynamicAPI('post', url, obj)

export const updateCourse = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteCourse = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
