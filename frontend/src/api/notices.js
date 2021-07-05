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

export const getNotices = async () => {
  try {
    const { data } = await axios.get(`/api/notices`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addNotice = async (obj) => {
  try {
    const { data } = await axios.post(`/api/notices`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateNotice = async (obj) => {
  try {
    const { data } = await axios.put(`/api/notices/${obj._id}`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteNotice = async (id) => {
  try {
    const { data } = await axios.delete(`/api/notices/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
