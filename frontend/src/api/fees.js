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

export const searchStudentToPay = async (obj) => {
  try {
    const { data } = await axios.post(`/api/fees/student`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const pay = async (obj) => {
  try {
    const { data } = await axios.post(`/api/fees/pay`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
