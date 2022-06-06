import dynamicAPI from './dynamicAPI'

const url = '/api/report/'

export const getAttendancesReport = async (obj) =>
  await dynamicAPI('post', `${url}/attendance`, obj)

export const getTuitionsReport = async (obj) =>
  await dynamicAPI('post', `${url}/tuition`, obj)

export const getSingleStudentTuitionsReport = async (obj) =>
  await dynamicAPI('post', `${url}/student-tuition-fee-report`, obj)

export const getStudentTuitionsReport = async () =>
  await dynamicAPI('get', `${url}/student-tuition`, {})

export const getStudentMarkSheetReport = async () =>
  await dynamicAPI('get', `${url}/student-marksheet`, {})

export const getMarkSheetReport = async (obj) =>
  await dynamicAPI('post', `${url}/student-marksheet`, obj)

export const getStudentClearanceReport = async () =>
  await dynamicAPI('get', `${url}/student-clearance`, {})

export const getStudentAttendanceReport = async () =>
  await dynamicAPI('get', `${url}/student-attendance`, {})

export const getPayments = async (obj) =>
  await dynamicAPI('post', `${url}/payment-status`, obj)

export const getRegFee = async (obj) =>
  await dynamicAPI('post', `${url}/reg-fee`, obj)
