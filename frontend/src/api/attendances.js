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

export const getClassInfo = async (obj) => {
  try {
    const { data } = await axios.post(`/api/attendances`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addAttendance = async (obj) => {
  try {
    const { data } = await axios.post(`/api/attendances/submit`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

// export const updateAssignToCourse = async (obj) => {
//   try {
//     const { data } = await axios.put(
//       `/api/assign-to-courses/${obj._id}`,
//       obj,
//       config()
//     )
//     return data
//   } catch (error) {
//     throw error.response.data.message
//   }
// }

// export const deleteAssignToCourse = async (id) => {
//   try {
//     const { data } = await axios.delete(
//       `/api/assign-to-courses/${id}`,
//       config()
//     )
//     return data
//   } catch (error) {
//     throw error.response.data.message
//   }
// }

// export const upgradeSemester = async (id) => {
//   try {
//     const { data } = await axios.put(
//       `/api/assign-to-courses/upgrade-semester/${id}`,
//       {},
//       config()
//     )
//     return data
//   } catch (error) {
//     throw error.response.data.message
//   }
// }
