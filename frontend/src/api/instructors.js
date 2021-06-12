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

export const getInstructors = async (page) => {
  try {
    const { data } = await axios.get(`/api/instructors?page=${page}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const getInstructorDetail = async (id) => {
  try {
    const { data } = await axios.get(`/api/instructors/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addInstructor = async (obj) => {
  try {
    const { data } = await axios.post(`/api/instructors`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateInstructor = async (obj) => {
  try {
    const { data } = await axios.put(
      `/api/instructors/${obj._id}`,
      obj.formData,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteInstructor = async (id) => {
  try {
    const { data } = await axios.delete(`/api/instructors/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
