import dynamicAPI from './dynamicAPI'

const url = '/api/admin/course-type'

export const getCourseTypes = async () => await dynamicAPI('get', url, {})

export const addCourseType = async (obj) => await dynamicAPI('post', url, obj)

export const updateCourseType = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteCourseType = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
