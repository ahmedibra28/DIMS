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

export const getMarks = async () => {
  try {
    const { data } = await axios.get(`/api/marks`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addMark = async (obj) => {
  try {
    const { data } = await axios.post(`/api/marks`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateMark = async (obj) => {
  try {
    const { data } = await axios.put(`/api/marks/${obj._id}`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteMark = async (id) => {
  try {
    const { data } = await axios.delete(`/api/marks/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const getSubjectByInstructor = async (id) => {
  try {
    const { data } = await axios.get(`/api/marks/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
