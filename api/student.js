import dynamicAPI from './dynamicAPI'

const url = '/api/admin/student'

export const getStudents = async (page, search) =>
  await dynamicAPI('get', `${url}?page=${page}&search=${search}`, {})

export const addStudent = async (obj) => await dynamicAPI('post', url, obj)

export const updateStudent = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj.formData)

export const deleteStudent = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})

export const getStudent = async (_id) =>
  await dynamicAPI('get', `${url}/${_id}`, {})

export const getAllStudents = async () =>
  await dynamicAPI('get', `${url}/all-students`, {})
