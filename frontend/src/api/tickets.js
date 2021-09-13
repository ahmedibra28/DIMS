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

export const getTicketActivations = async () => {
  try {
    const { data } = await axios.get(`/api/tickets/activate`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addTicketActivation = async (obj) => {
  try {
    const { data } = await axios.post(`/api/tickets/activate`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateTicketActivation = async (obj) => {
  try {
    const { data } = await axios.put(
      `/api/tickets/activate/${obj._id}`,
      obj,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteTicketActivation = async (id) => {
  try {
    const { data } = await axios.delete(`/api/tickets/activate/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
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
