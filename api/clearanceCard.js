import dynamicAPI from './dynamicAPI'

const url = '/api/clearance-card'

export const clearanceCard = async (obj) => await dynamicAPI('post', url, obj)
