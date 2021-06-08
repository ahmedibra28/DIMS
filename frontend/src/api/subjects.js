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

export const getSubjects = async () => {
  try {
    const { data } = await axios.get(`/api/subjects`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addSubject = async (obj) => {
  try {
    const { data } = await axios.post(`/api/subjects`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateSubject = async (obj) => {
  try {
    const { data } = await axios.put(`/api/subjects/${obj._id}`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteSubject = async (id) => {
  try {
    const { data } = await axios.delete(`/api/subjects/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
