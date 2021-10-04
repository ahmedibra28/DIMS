import dynamicAPI from './dynamicAPI'

const url = '/api/report/attendance'

export const getAttendancesReport = async (obj) =>
  await dynamicAPI('post', url, obj)
