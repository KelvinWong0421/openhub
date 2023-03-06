import React from 'react'
import Image from 'next/image'
import logo from '../pic/logo.svg'
import SidebarLink from './SidebarLink'

import { HomeIcon } from '@heroicons/react/24/solid'
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  UserIcon,
  EllipsisVerticalIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline'


type Props = {}

const Sidebar = (props: Props) => {
  return (
    <div className='hidden sm:flex flex-col items-center 
    xl:items-start xl:w-[340px] p-2 fixed h-full'>

        <div className='flex items-center justify-center w-12 
        h-12 hoverAnimation p-0 xl:ml-24'>
            <Image src={logo} width={40} height={40} alt='logo' /> 
        </div>
        <div className='space-y-2.5 mt-4 mb-2.5 xl:ml-24'>
          <SidebarLink text='Home' Icon={HomeIcon} active/>
          <SidebarLink text='Explore' Icon={HashtagIcon} active={false}/>
          <SidebarLink text='Notifications' Icon={BellIcon} active={false}/>
          <SidebarLink text='Messages' Icon={InboxIcon} active={false}/>
          <SidebarLink text='Bookmarks' Icon={BookmarkIcon} active={false}/>
          <SidebarLink text='Profile' Icon={UserIcon} active={false}/>
          <SidebarLink text='More' Icon={EllipsisVerticalIcon} active={false}/>
        </div>

        <button className=' w-12 h-12 hidden xl:inline ml-auto bg-[#1d9bf0] text-white 
        rounded-xl xl:w-56 xl:h-[52px] xl:font-bold shadow-md hover:bg-[#1a8cd8] '>
          Tweet
        </button>

        <div className='text-[#d9d9d9] flex items-center justify-center hoverAnimation xl:ml-auto xl:-mr-5 mt-auto '>

          <img src="https://media.moddb.com/cache/images/members/5/4550/4549205/thumb_620x2000/duck.jpg" 
          alt="" 
          className='h-10 w-10 rounded-full xl:mr-2.5' 
          />

          <div className='hidden xl:inline leading-5'>
            <h4 className='font-bold'>firebase 123</h4>
            <p className='text-[#6e767d]'>@firebase 123</p>
          </div>
          <EllipsisHorizontalIcon className='h-5 hidden xl:inline ml-10'/> 
        </div>
    </div>
  )
}

export default Sidebar