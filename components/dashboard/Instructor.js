import Message from '../Message'
import Loader from 'react-loader-spinner'
import { getNotices } from '../../api/notice'
import { useQuery } from 'react-query'
import moment from 'moment'
import Resource from './Resource'

const Instructor = () => {
  const {
    data: noticeData,
    isLoading: isLoadingNotice,
    isError: isErrorNotice,
    error: errorNotice,
  } = useQuery('notices', () => getNotices(), {
    retry: 0,
  })

  return (
    <div className='row mt-1'>
      <div className='col-md-9 col-12'>
        <Resource />
      </div>

      <div className='col-md-3 col-12  border border-primary border-bottom-0 border-top-0 border-end-0'>
        <h5>Latest Notices</h5> <hr />
        {isLoadingNotice ? (
          <div className='text-center'>
            <Loader
              type='ThreeDots'
              color='#00BFFF'
              height={100}
              width={100}
              timeout={3000} //3 secs
            />
          </div>
        ) : isErrorNotice ? (
          <Message variant='danger'>{errorNotice}</Message>
        ) : (
          noticeData?.slice(0, 2)?.map(
            (notice) =>
              notice.isActive && (
                <div key={notice._id} className='card-text'>
                  <p className='badge rounded-pill bg-primary'>
                    {moment(notice.createdAt).format('llll')}
                  </p>
                  <p>
                    <span className='fw-bold'>{notice.title}</span> <br />
                    <span>{notice.description}</span>
                    <br />
                    <span className='text-muted'>
                      {notice.createdBy.name} -{' '}
                      {moment(notice.createdAt).fromNow()}
                    </span>
                  </p>
                </div>
              )
          )
        )}
      </div>
    </div>
  )
}

export default Instructor
