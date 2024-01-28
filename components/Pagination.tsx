'use client'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

interface Props {
  data: {
    startIndex: number
    endIndex: number
    total: number
    page: number
    pages: number
  }
  setPage: (page: number) => void
}

const Pagination = ({ data, setPage }: Props) => {
  return data ? (
    <div className='my-1 text-end'>
      <span className='btn bg-white shadow'>
        {data.startIndex} - {data.endIndex} of {data.total}
      </span>
      <button
        disabled={data.page === 1}
        onClick={() => setPage(data.page - 1)}
        className='btn mx-1 bg-white shadow'
      >
        <FaChevronLeft className='mb-1' />
      </button>
      <button
        disabled={data.page === data.pages}
        onClick={() => setPage(data.page + 1)}
        className='btn bg-white shadow'
      >
        <FaChevronRight className='mb-1' />
      </button>
    </div>
  ) : null
}

export default Pagination
