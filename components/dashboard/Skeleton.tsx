import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Table, TableBody, TableRow } from '@/components/ui/table'

export default function Skeleton() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='h-7 w-36 animate-pulse bg-gray-300' />
        <CardDescription className='h-3 w-[90%] animate-pulse bg-gray-300' />
        <CardDescription className='h-3 w-[70%] animate-pulse bg-gray-300' />
      </CardHeader>

      <CardContent>
        <Table>
          <TableBody className='flex flex-wrap gap-2'>
            {[...Array(5 * 10)].map((_, i) => (
              <TableRow
                key={i}
                className='h-4 w-[18%] animate-pulse bg-gray-300'
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
