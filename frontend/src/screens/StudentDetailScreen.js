import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { getStudentDetail } from '../api/students'
import { useQuery } from 'react-query'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'

const StudentDetailScreen = () => {
  const { id } = useParams()

  const { data, error, isLoading, isError } = useQuery(
    ['studentDetails', id],
    async () => await getStudentDetail(id),
    { retry: 0 }
  )

  return (
    <div>
      {isLoading ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <div className='row'>{data && data.fullName} </div>
        </>
      )}
    </div>
  )
}

export default StudentDetailScreen
