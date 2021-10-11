import dynamicAPI from './dynamicAPI'

const url = '/api/setting/clearance-card-generator'

export const getClearanceCardGenerators = async () =>
  await dynamicAPI('get', url, {})

export const addClearanceCardGenerator = async (obj) =>
  await dynamicAPI('post', url, obj)

export const updateClearanceCardGenerator = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteClearanceCardGenerator = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
