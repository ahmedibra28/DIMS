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

export const getCourseTypes = async () => {
  try {
    const { data } = await axios.get(`/api/courseTypes`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addCourseType = async (obj) => {
  try {
    const { data } = await axios.post(`/api/courseTypes`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateCourseType = async (obj) => {
  try {
    const { data } = await axios.put(
      `/api/courseTypes/${obj._id}`,
      obj,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteCourseType = async (id) => {
  try {
    const { data } = await axios.delete(`/api/courseTypes/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
