import dynamicAPI from './dynamicAPI'

const url = '/api/admin/instructor'

export const getInstructors = async (page) =>
  await dynamicAPI('get', `${url}?page=${page}`, {})

export const addInstructor = async (obj) => await dynamicAPI('post', url, obj)

export const updateInstructor = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj.formData)

export const deleteInstructor = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})

export const getInstructor = async (_id) =>
  await dynamicAPI('get', `${url}/${_id}`, {})
