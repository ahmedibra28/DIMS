import axios from 'axios'

const config = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${
        localStorage.getItem('userInfo') &&
        JSON.parse(localStorage.getItem('userInfo')).token
      }`,
    },
  }
}

export const getAttendanceReport = async (obj) => {
  try {
    const { data } = await axios.post(`/api/reports/attendance`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const getCompleteMarkSheetReport = async (obj) => {
  try {
    const { data } = await axios.post(`/api/reports/marksheet`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
