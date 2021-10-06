import dynamicAPI from './dynamicAPI'

const url = '/api/report/tuition'

export const getTuitionsReport = async (obj) =>
  await dynamicAPI('post', url, obj)
