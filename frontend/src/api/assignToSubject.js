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

export const getAssignToSubjects = async (instructor) => {
  try {
    const { data } = await axios.get(
      `/api/assign-to-subjects/${instructor}`,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addAssignToSubject = async (obj) => {
  try {
    const { data } = await axios.post(`/api/assign-to-subjects`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateAssignToSubject = async (obj) => {
  try {
    const { data } = await axios.put(
      `/api/assign-to-subjects/${obj._id}`,
      obj,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteAssignToSubject = async (id) => {
  try {
    const { data } = await axios.delete(
      `/api/assign-to-subjects/${id}`,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
