import { CSVLink } from 'react-csv'
import { FaFileDownload, FaPlus } from 'react-icons/fa'

const FooterActionButtons = ({ target, data, fileName }) => {
  return (
    <div className='position-relative'>
      <button
        className='btn btn-primary position-fixed rounded-3 animate__bounceIn'
        style={{
          bottom: '20px',
          right: '25px',
        }}
        data-bs-toggle='modal'
        data-bs-target={target}
      >
        <FaPlus className='mb-1' />
      </button>
      {data && (
        <CSVLink data={data} filename={fileName}>
          <button
            className='btn btn-success position-fixed rounded-3 animate__bounceIn'
            style={{
              bottom: '60px',
              right: '25px',
            }}
          >
            <FaFileDownload className='mb-1' />
          </button>
        </CSVLink>
      )}
    </div>
  )
}

export default FooterActionButtons
