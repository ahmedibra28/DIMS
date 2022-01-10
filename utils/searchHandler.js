import Pagination from '../components/Pagination'

const SearchHandler = ({
  data,
  setPage,
  searchHandler,
  setSearch,
  search,
  title,
  searchBy,
}) => {
  return (
    <div className='row my-2'>
      <div className='col-md-4 col-6 m-auto'>
        <h3 className='fw-light font-monospace'>{title}</h3>
      </div>
      {data && (
        <div className='col-md-4 col-6 m-auto'>
          <Pagination data={data} setPage={setPage} />
        </div>
      )}
      {searchHandler && (
        <div className='col-md-4 col-12 m-auto'>
          <form onSubmit={(e) => searchHandler(e)}>
            <input
              type='text'
              className='form-control py-2'
              placeholder={searchBy}
              name='search'
              value={search}
              onChange={(e) => (setSearch(e.target.value), setPage(1))}
              autoFocus
            />
          </form>
        </div>
      )}
    </div>
  )
}

export default SearchHandler
