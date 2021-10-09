import dynamicAPI from './dynamicAPI'

const url = '/api/tuition'

export const getTuitions = async (obj) => await dynamicAPI('post', url, obj)
export const getAllTuitions = async () => await dynamicAPI('get', url, {})

export const generateTuition = async (obj) =>
  await dynamicAPI('post', `${url}/generation`, obj)

export const updateTuition = async (obj) => await dynamicAPI('put', url, obj)
