'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { FormButton } from './ui/CustomForm'
import React from 'react'
import useDataStore from '@/zustand/dataStore'
import { FaPrint } from 'react-icons/fa6'
import { useReactToPrint } from 'react-to-print'

interface Props {
  label: string
  height?: string
  width?: string
  data: React.JSX.Element
}

const PrintDialog = ({ data, label, height, width }: Props) => {
  const { dialogOpen, setDialogOpen } = useDataStore(state => state)

  const componentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current!,
    documentTitle: `Clearance Card`,
    pageStyle: `
    @page {
      size: auto;
      margin-left: 31mm;
      margin-right: 31mm;
      min-width: 180mm;
    }
  `,
  })

  return (
    <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
      <DialogContent className={`${height} ${width} overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div ref={componentRef}>{data}</div>
        <DialogFooter className='mt-4 gap-y-2'>
          <DialogClose asChild>
            <Button type='button' variant='secondary' id='dialog-close'>
              Close
            </Button>
          </DialogClose>

          <FormButton
            type='submit'
            label='Print'
            icon={<FaPrint />}
            onClick={handlePrint}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PrintDialog
