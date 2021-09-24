import dynamicAPI from './dynamicAPI'

const url = '/api/admin/student'

export const getStudents = async (page) =>
  await dynamicAPI('get', `${url}?page=${page}`, {})

export const addStudent = async (obj) => await dynamicAPI('post', url, obj)

export const updateStudent = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj.formData)

export const deleteStudent = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
