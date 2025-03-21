'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import useAuthorization from '@/hooks/useAuthorization'
import useApi from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import Message from '@/components/Message'
import Spinner from '@/components/Spinner'
import RTable from '@/components/RTable'
import { TopLoadingBar } from '@/components/TopLoadingBar'
import { columns } from './columns'
import PrintDialog from '@/components/PrintDialog'
import { InvoiceCard } from '@/components/InvoiceCard'
import { TransactionProp } from '@/types'
import useDataStore from '@/zustand/dataStore'

const Page = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [q, setQ] = useState('')
  const [printItem, setPrintItem] = React.useState<TransactionProp>()
  const { dialogOpen } = useDataStore(state => state)

  const path = useAuthorization()
  const router = useRouter()

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const getApi = useApi({
    key: ['tuitions'],
    method: 'GET',
    url: `tuition-fee?page=${page}&q=${q}&limit=${limit}&status=ACTIVE`,
  })?.get

  const updateApi = useApi({
    key: ['tuitions'],
    method: 'PUT',
    url: `tuition-fee`,
  })?.put

  const deleteApi = useApi({
    key: ['tuitions'],
    method: 'DELETE',
    url: `tuition-fee`,
  })?.deleteObj

  useEffect(() => {
    if (updateApi?.isSuccess || deleteApi?.isSuccess) {
      getApi?.refetch()
    }

    // eslint-disable-next-line
  }, [updateApi?.isSuccess, deleteApi?.isSuccess])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [limit])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line
  }, [q])

  React.useEffect(() => {
    if (!dialogOpen) {
      setPrintItem(undefined)
    }
  }, [dialogOpen])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const handleUpdate = ({
    id,
    status,
  }: {
    id: string
    status: 'PAID' | 'UNPAID'
  }) => {
    updateApi?.mutateAsync({
      id,
      status,
    })
  }

  const deleteHandler = (id: any) => deleteApi?.mutateAsync(id)

  const printHandler = (item: TransactionProp) => {
    setPrintItem(item)
  }

  return (
    <>
      {updateApi?.isSuccess && <Message value={updateApi?.data?.message} />}
      {updateApi?.isError && <Message value={updateApi?.error} />}
      {deleteApi?.isSuccess && <Message value={deleteApi?.data?.message} />}
      {deleteApi?.isError && <Message value={deleteApi?.error} />}

      <TopLoadingBar isFetching={getApi?.isFetching || getApi?.isPending} />

      {printItem && (
        <PrintDialog
          data={<InvoiceCard data={printItem} />}
          label='Invoice'
          width='md:min-w-[800px]'
          size='A4'
        />
      )}

      {getApi?.isPending ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message value={getApi?.error} />
      ) : (
        <div className='p-3 mt-2 overflow-x-auto bg-white'>
          <RTable
            data={getApi?.data}
            columns={columns({
              isPending: updateApi?.isPending || false,
              handleUpdate,
              deleteHandler,
              printHandler,
            })}
            setPage={setPage}
            setLimit={setLimit}
            limit={limit}
            q={q}
            setQ={setQ}
            searchHandler={searchHandler}
            caption='Tuitions List'
            searchType='text'
          />
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })
