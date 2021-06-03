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

export const getStudents = async () => {
  try {
    const { data } = await axios.get(`/api/students`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const getStudentDetail = async (id) => {
  try {
    const { data } = await axios.get(`/api/students/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addStudent = async (obj) => {
  try {
    const { data } = await axios.post(`/api/students`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateStudent = async (obj) => {
  try {
    const { data } = await axios.put(`/api/students/${obj._id}`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteStudent = async (id) => {
  try {
    const { data } = await axios.delete(`/api/students/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
