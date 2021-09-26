import dynamicAPI from './dynamicAPI'

const url = '/api/admin/instructor/assign-subject'

export const getAssignSubjects = async (id) =>
  await dynamicAPI('get', `${url}/${id}`, {})

export const addAssignSubject = async (obj) =>
  await dynamicAPI('post', url, obj)

export const updateAssignSubject = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteAssignSubject = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
