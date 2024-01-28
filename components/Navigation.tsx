'use client'
import useUserInfoStore from '@/zustand/userStore'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { FaBars, FaPowerOff } from 'react-icons/fa6'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  MenubarPortal,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '@/components/ui/menubar'

const Navigation = () => {
  const { userInfo } = useUserInfoStore(state => state)
  const [menu, setMenu] = React.useState<any>(userInfo.menu)

  const handleLogout = () => {
    useUserInfoStore.getState().logout()
  }

  React.useEffect(() => {
    const label = document.querySelector(`[data-drawer-target="bars"]`)
    if (userInfo.id) {
      setMenu(userInfo.menu)
      label?.classList.remove('hidden')
    } else {
      label?.classList.add('hidden')
    }
  }, [userInfo])

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const auth = (
    <>
      <div className='hidden flex-row lg:block'>
        <ul className='flex items-center space-x-4 px-1'>
          {menu.map((item: any, i: number) => (
            <Fragment key={i}>
              {!item?.children && <Link href={item.path}>{item.name}</Link>}

              {item?.children && (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger className='outline-none'>
                    {capitalizeFirstLetter(item.name)}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='hidden lg:block'>
                    {item.children.map((child: any, i: number) => (
                      <DropdownMenuItem key={i}>
                        <Link href={child.path} className='justify-between'>
                          {child.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </Fragment>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger className='outline-none'>
              <Avatar>
                <AvatarImage
                  src={
                    userInfo.image ||
                    `https://ui-avatars.com/api/?uppercase=true&name=${userInfo?.name}`
                  }
                />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='hidden lg:block'>
              <DropdownMenuItem>
                <Link href='/account/profile' className='justify-between'>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button onClick={() => handleLogout()}>
                  <Link
                    href='/auth/login'
                    className='flex flex-row items-center justify-start gap-x-1 text-red-500'
                  >
                    <FaPowerOff /> <span>Logout</span>
                  </Link>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ul>
      </div>

      <div className='lg:hidden'>
        <Menubar className='border-none lg:hidden'>
          <MenubarMenu>
            <MenubarTrigger>
              <FaBars className='text-2xl text-gray-500' />
            </MenubarTrigger>
            <MenubarContent className='lg:hidden'>
              <ul>
                <MenubarItem>
                  <Link href='/account/profile' className='justify-between'>
                    Profile
                  </Link>
                </MenubarItem>
                {menu.map((item: any, i: number) => (
                  <Fragment key={i}>
                    {!item?.children && (
                      <MenubarItem>
                        <Link href={item.path}>{item.name}</Link>
                      </MenubarItem>
                    )}

                    {item?.children && (
                      <MenubarSub key={item.name}>
                        <MenubarSubTrigger className='flex flex-row items-center px-2 py-1.5 text-sm outline-none'>
                          {capitalizeFirstLetter(item.name)}
                        </MenubarSubTrigger>
                        <MenubarPortal>
                          <MenubarSubContent className='z-50 w-auto rounded-md border border-gray-200 bg-white p-1 lg:hidden'>
                            {item.children.map((child: any, i: number) => (
                              <MenubarItem key={i}>
                                <Link
                                  href={child.path}
                                  className='justify-between'
                                >
                                  {child.name}
                                </Link>
                              </MenubarItem>
                            ))}
                          </MenubarSubContent>
                        </MenubarPortal>
                      </MenubarSub>
                    )}
                  </Fragment>
                ))}

                <MenubarSeparator />
                <MenubarItem>
                  <li>
                    <button onClick={() => handleLogout()}>
                      <Link
                        href='/auth/login'
                        className='flex flex-row items-center justify-start gap-x-1 text-red-500'
                      >
                        <FaPowerOff /> <span>Logout</span>
                      </Link>
                    </button>
                  </li>
                </MenubarItem>
              </ul>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </>
  )

  return (
    <div className='flex-none'>
      <ul className='w-full px-1'>
        {!userInfo.id && (
          <li>
            <Link href='/auth/login'>Login</Link>
          </li>
        )}
      </ul>
      {userInfo.id && auth}
    </div>
  )
}

export default dynamic(() => Promise.resolve(Navigation), { ssr: false })
