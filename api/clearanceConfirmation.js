import dynamicAPI from './dynamicAPI'

const url = '/api/clearance-confirmation'

export const tuitionConfirmation = async (obj) =>
  await dynamicAPI('post', url, obj)
