import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { getStudentDetail } from '../api/students'
import { useQuery } from 'react-query'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'
import moment from 'moment'
import {
  FaArrowAltCircleLeft,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa'

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
          <div className='row'>
            <div className='col-md-7 col-12'>
              <p className='d-flex justify-content-between'>
                <Link to='/student' className=''>
                  <FaArrowAltCircleLeft className='mb-1' /> Go Back
                </Link>
                <span className='fw-bold'>Background Education</span>{' '}
              </p>{' '}
              <hr />
              <table className='table table-sm hover bordered striped caption-top '>
                <thead>
                  <tr>
                    <th>LEVEL OF EDUCATION</th>
                    <th>INTERESTED COURSE</th>
                    <th>LANGUAGE</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{data.levelOfEducation}</td>

                    <td>
                      {data.course.map((crs, index) => (
                        <span key={index + 1}>
                          {index + 1}.{' '}
                          {crs.name.charAt(0).toUpperCase() + crs.name.slice(1)}
                          <br />
                        </span>
                      ))}
                    </td>
                    <td>
                      Somali - {data.languageSkills.somali} <br />
                      Arabic - {data.languageSkills.arabic} <br />
                      English - {data.languageSkills.english} <br />
                      Kiswahili - {data.languageSkills.kiswahili}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan='3'>{data.comment}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className='col-md-4 col-12 border-start border-info'>
              <p className=''>
                <span className='fw-bold'>Student Info </span>
              </p>
              <hr />
              <p className=''>
                <img
                  src={data.picture.picturePath}
                  alt={data.picture.pictureName}
                  className='img-fluid w-50 rounded-pill'
                />
              </p>
              <p className='fs-3 mb-1 fw-light'>
                {data.fullName.toUpperCase()}
              </p>
              <div>
                <span className='fw-bold'>Place Of Birth: </span>{' '}
                {data.placeOfBirth}
                <br />
                <span className='fw-bold'>Date Of Birth: </span>{' '}
                {moment(data.dateOfBirth).format('lll')}
                <br />
                <span className='fw-bold'>Gender: </span> {data.gender}
                <br />
                <span className='fw-bold'>Admission Date-In: </span>
                {moment(data.dateOfAdmission).format('lll')} <br />
                <span className='fw-bold'>District: </span> {data.district}
                <br />
                <span className='fw-bold'>Mobile Number: </span>{' '}
                {data.mobileNumber}
                <br />
                <span className='fw-bold'>Status: </span>{' '}
                <span className='px-2 rounded-1 text-light'>
                  {data.isActive ? (
                    <FaCheckCircle className='text-success' />
                  ) : (
                    <FaTimesCircle className='text-danger' />
                  )}{' '}
                  <br />
                </span>
                <span className='fw-bold'>Contact Person: </span>
                {data.contactFullName} <br />
                <span className='fw-bold'>Contact Mobile: </span>
                {data.contactMobileNumber} <br />
                <span className='fw-bold'>Contact Email: </span>
                {data.contactEmail} <br />
                <span className='fw-bold'>Contact Relationship: </span>
                {data.contactRelationship} <br />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default StudentDetailScreen
