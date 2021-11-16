import dynamicAPI from './dynamicAPI'

const url = '/api/admin/student/upgrade'

// export const getUpgrades = async () => await dynamicAPI('get', url, {})

// export const addUpgrade = async (obj) => await dynamicAPI('post', url, obj)

export const updateUpgrade = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

// export const deleteUpgrade = async (id) =>
//   await dynamicAPI('delete', `${url}/${id}`, {})
