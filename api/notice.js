import dynamicAPI from './dynamicAPI'

const url = '/api/admin/notice'

export const getNotices = async () => await dynamicAPI('get', url, {})

export const addNotice = async (obj) => await dynamicAPI('post', url, obj)

export const updateNotice = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteNotice = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
