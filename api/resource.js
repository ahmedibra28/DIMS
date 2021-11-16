import dynamicAPI from './dynamicAPI'

const url = '/api/resource'

export const getResources = async () => await dynamicAPI('get', url, {})

export const addResource = async (obj) => await dynamicAPI('post', url, obj)

export const updateResource = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj.formData)

export const deleteResource = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
