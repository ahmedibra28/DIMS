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

export const getStudentTicket = async (student) => {
  try {
    const { data } = await axios.get(`/api/tickets/${student}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
