import dynamicAPI from './dynamicAPI'

const url = '/api/exam'

export const getExams = async (obj) =>
  await dynamicAPI('get', `${url}/${obj.assignId}`, {})

export const addExam = async (obj) => await dynamicAPI('post', url, obj)

export const updateExam = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteExam = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
