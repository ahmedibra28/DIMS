import React from 'react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import { Button, ButtonProps } from '@/components/ui/button'
import {
  FaCheck,
  FaEllipsis,
  FaFilePen,
  FaSort,
  FaSpinner,
  FaTrash,
} from 'react-icons/fa6'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import useApi from '@/hooks/useApi'
import { useDebounce } from 'use-debounce'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import ConfirmDialog from '../ConfirmDialog'
import useDataStore from '@/zustand/dataStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ListItem {
  label: string
  children: Array<{
    id: string
    label: string
    method?: string
    path?: string
  }>
}

export interface FormProps {
  form: UseFormReturn<any, any, undefined>
  name: any
  label: string
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
  cols?: number
  rows?: number
  step?: string
  fieldType?: 'command' | 'switch' | 'multipleCheckbox' | 'select'
  data?: {
    label: string
    value: string
  }[]
  key?: string
  url?: string
  items?: ListItem[]
}
export interface FormButtonProp {
  label: string
  className?: string
  icon?: React.ReactNode
  loading?: boolean
}

export default function CustomFormField({
  form,
  name,
  label,
  ...props
}: FormProps) {
  const [search, setSearch] = React.useState('')
  const [data, setData] = React.useState(props?.data)

  const getData = useApi({
    key: [props?.key!, props?.url!],
    method: 'GET',
    url: props?.url + `&q=${search}`,
  })?.get

  const [value] = useDebounce(search, 1000)

  React.useEffect(() => {
    if (props?.data?.length === 0 && props?.fieldType !== 'multipleCheckbox') {
      getData?.refetch()?.then((res) => {
        setData(
          res?.data?.data?.map((item: { name?: string; id?: string }) => ({
            label: item?.name,
            value: item?.id,
          }))
        )
      })
    }
    // eslint-disable-next-line
  }, [value])

  const items = useDataStore((state) => state)?.data.find(
    (item) => item.id === name
  )?.data as ListItem[]

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) =>
        props?.fieldType === 'multipleCheckbox' ? (
          <FormItem className='flex flex-col mb-3'>
            {items?.map((item, i) => (
              <div key={i} className='mb-2 bg-slate-100 p-3 gap-y-2'>
                <FormLabel className='mb-2 pb-3 font-bold text-gray-700'>
                  {item.label}
                </FormLabel>
                {item?.children?.map((child, childId) => (
                  <FormField
                    key={childId}
                    control={form.control}
                    name={name}
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={childId}
                          className='flex flex-row items-start space-x-3 space-y-0'
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(child.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, child.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: string) => value !== child.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className='text-sm font-normal'>
                            {child?.method || child?.path} {child.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
            ))}

            <FormMessage className='text-xs' />
          </FormItem>
        ) : (
          <FormItem className='flex flex-col mb-3'>
            <FormLabel className='text-gray-700'>{label}</FormLabel>

            {props?.fieldType === 'command' ? (
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? data?.find((item) => item.value === field.value)
                            ?.label
                        : 'Select item'}
                      <FaSort className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align='start' className='w-full p-0'>
                  <Command shouldFilter={true}>
                    <CommandInput
                      onValueChange={setSearch}
                      value={search}
                      placeholder='Search item...'
                      className='h-9'
                    />
                    <CommandEmpty>No item found.</CommandEmpty>
                    <CommandGroup>
                      {data?.map((item) => (
                        <CommandItem
                          value={item.label}
                          key={item.value}
                          onSelect={() => {
                            form.setValue(name, item.value)
                          }}
                        >
                          {item.label}

                          <FaCheck
                            className={cn(
                              'ml-auto h-4 w-4',
                              item.value === field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : props?.fieldType === 'switch' ? (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            ) : props?.fieldType === 'select' ? (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select item' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {props?.data?.map((item) => (
                    <SelectItem key={item.value} value={item?.value}>
                      {item?.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <FormControl>
                {props.cols && props.rows ? (
                  <Textarea {...field} {...props} />
                ) : (
                  <Input {...field} {...props} />
                )}
              </FormControl>
            )}

            <FormMessage className='text-xs' />
          </FormItem>
        )
      }
    />
  )
}

export const FormButton = ({
  label,
  className,
  type = 'submit',
  onClick,
  icon,
  loading,
  ...props
}: FormButtonProp & ButtonProps) => {
  return (
    <Button
      disabled={loading}
      type={type}
      onClick={onClick}
      className={`${loading ? 'bg-gray-500' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <FaSpinner className='mr-1 animate-spin' />
      ) : (
        icon && <span className='mr-1'>{icon}</span>
      )}

      {label}
    </Button>
  )
}

export const ActionButton = ({
  editHandler,
  isPending,
  deleteHandler,
  original,
}: {
  editHandler?: (item: any) => void
  isPending?: boolean
  deleteHandler?: (item: any) => void
  modal?: string
  original?: any
  formChildren?: React.ReactNode
}) => {
  const { setDialogOpen } = useDataStore((state) => state)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <FaEllipsis className='text-2xl' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {editHandler && (
          <DropdownMenuItem>
            <FormButton
              onClick={() => {
                editHandler(original)
                setDialogOpen(true)
              }}
              icon={<FaFilePen />}
              label='Edit'
              type='button'
              loading={isPending}
            />
          </DropdownMenuItem>
        )}

        {deleteHandler && (
          <AlertDialog>
            <AlertDialogTrigger>
              <div className='h-9 min-w-24 flex justify-start items-center gap-x-1 rounded-lg bg-red-500 text-white py-2 px-4 mx-2 text-sm'>
                {isPending ? (
                  <>
                    <FaSpinner className='mr-1 animate-spin' />
                    Loading
                  </>
                ) : (
                  <>
                    <FaTrash /> Delete
                  </>
                )}
              </div>
            </AlertDialogTrigger>
            <ConfirmDialog onClick={() => deleteHandler(original.id)} />
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
