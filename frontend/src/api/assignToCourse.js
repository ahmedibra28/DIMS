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

export const getAssignToCourses = async (student) => {
  try {
    const { data } = await axios.get(
      `/api/assign-to-courses/${student}`,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addAssignToCourse = async (obj) => {
  try {
    const { data } = await axios.post(`/api/assign-to-courses`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateAssignToCourse = async (obj) => {
  try {
    const { data } = await axios.put(
      `/api/assign-to-courses/${obj._id}`,
      obj,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteAssignToCourse = async (id) => {
  try {
    const { data } = await axios.delete(
      `/api/assign-to-courses/${id}`,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
