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

export const getCourses = async () => {
  try {
    const { data } = await axios.get(`/api/courses`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addCourse = async (obj) => {
  try {
    const { data } = await axios.post(`/api/courses`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateCourse = async (obj) => {
  try {
    const { data } = await axios.put(`/api/courses/${obj._id}`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteCourse = async (id) => {
  try {
    const { data } = await axios.delete(`/api/courses/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
