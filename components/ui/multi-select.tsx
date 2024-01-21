'use client'

import * as React from 'react'
import { X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { Command as CommandPrimitive } from 'cmdk'
import { Label } from '@/components/ui/label'
import { UseFormReturn } from 'react-hook-form'
import { FormMessage } from './form'

type Prop = Record<'value' | 'label', string>

export function MultiSelect({
  data,
  selected,
  setSelected,
  label,
  form,
  name,
  edit,
}: {
  data: Prop[]
  selected: Prop[]
  setSelected: React.Dispatch<React.SetStateAction<Prop[]>>
  label?: string
  form?: UseFormReturn<any>
  name: string
  edit?: boolean
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  // const [selected, setSelected] = React.useState<Prop[]>([])
  const [inputValue, setInputValue] = React.useState('')

  const handleUnselect = React.useCallback((item: Prop) => {
    setSelected((prev) => prev.filter((s) => s.value !== item.value))
  }, [])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            setSelected((prev) => {
              const newSelected = [...prev]
              newSelected.pop()
              return newSelected
            })
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === 'Escape') {
          input.blur()
        }
      }
    },
    []
  )

  const selectables = data?.filter((item) => !selected.includes(item))

  React.useEffect(() => {
    if (form) {
      form.setValue(
        name,
        selected.map((item) => item.value)
      )
    }
    // eslint-disable-next-line
  }, [selected, form])

  return (
    <React.Fragment>
      {label && <Label className='mb-2'>{label}</Label>}

      <Command
        onKeyDown={handleKeyDown}
        className='overflow-visible bg-transparent mb-2'
      >
        <div className='group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-whites'>
          <div className='flex gap-1 flex-wrap'>
            {selected.map((item) => {
              return (
                <Badge key={item.value} variant='secondary'>
                  {item.label}
                  <button
                    className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUnselect(item)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                  </button>
                </Badge>
              )
            })}
            {/* Avoid having the "Search" Icon */}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder='Select items...'
              className='ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1'
            />
          </div>
        </div>
        <div className='relative mt-2'>
          {open && selectables.length > 0 ? (
            <div className='absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in'>
              <CommandGroup className='h-full overflow-auto'>
                {selectables.map((item) => {
                  return (
                    <CommandItem
                      key={item.value}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onSelect={(value) => {
                        setInputValue('')
                        setSelected((prev) => [...prev, item])
                      }}
                      className={'cursor-pointer'}
                    >
                      {item.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </div>
          ) : null}
        </div>
      </Command>
      <FormMessage className='text-xs mb-2 -mt-2'>
        {form?.formState.errors?.[name]?.message as string}
      </FormMessage>
    </React.Fragment>
  )
}
