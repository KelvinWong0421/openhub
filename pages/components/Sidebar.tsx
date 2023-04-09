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
  EllipsisHorizontalIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'
import { useRecoilState } from 'recoil'
import {  sidebarState } from '@/atoms/modalAtom'
import { useRouter } from 'next/router'




type Props = {}

const Sidebar = (props: Props) => {
  //use session
  const {data: session} = useSession();
  const [state, setState] = useRecoilState(sidebarState);
  const router = useRouter();

  const uid = (session?.user as any).uid

  const ProfileClick = () => {
    router.push(`/user/${uid}`);     //  navigate to the user setting
  };


  
  return (
    <div className='hidden sm:flex flex-col items-center 
    xl:items-start xl:w-[340px] p-2 fixed h-full'>

        <div className='flex items-center  w-16 
        h-16 hoverAnimation p-0 xl:ml-24'>
            <Image src={logo} width={65} height={65} alt='logo' /> 
            <h1 className=' text-white font-bold hidden xl:inline ml-2 text-xl'>OpenHub</h1>
        </div>

        <div className='space-y-2.5 mt-4 mb-2.5 xl:ml-24'>
          <button onClick={()=>{setState('Home');router.push('/');}} className='flex'>
            <SidebarLink text='Home' Icon={HomeIcon} active={state=='Home'}/>
          </button>

          <button onClick={()=>setState('Explore')} className='flex'>
            <SidebarLink text='Explore' Icon={HashtagIcon} active={state=='Explore'}/>
          </button>

          <button onClick={()=>setState('Notifications')} className='flex'>
            <SidebarLink text='Notifications' Icon={BellIcon} active={state=='Notifications'}/>
          </button>

          <button onClick={()=>{setState('Profile');ProfileClick()}} className='flex'>
            <SidebarLink text='Profile' Icon={UserIcon} active={state=='Profile'}/>
          </button>

          <button onClick={() =>signOut()} className='flex'>
            <SidebarLink text='Logout' Icon={ArrowLeftOnRectangleIcon} active={false} />
          </button>
          
        </div>

        <button className=' w-12 h-12 hidden xl:inline ml-auto bg-[#1d9bf0] text-white 
        rounded-xl xl:w-56 xl:h-[52px] xl:font-bold shadow-md hover:bg-[#1a8cd8] '>
          Tweet
        </button>

        <div className='text-[#d9d9d9] flex items-center justify-center 
        hoverAnimation xl:ml-auto xl:-mr-5 mt-auto' >

          <img src={session?.user?.image??""} 
          alt="" 
          className='h-10 w-10 rounded-full xl:mr-2.5' 
          />

          <div className='hidden xl:inline leading-5'>
            <h4 className='font-bold'>{session?.user?.name}</h4>
            <p className='text-[#6e767d]'>@{(session?.user as any)?.tag}</p>
          </div>
          <EllipsisHorizontalIcon className='h-5 hidden xl:inline ml-10'/> 
        </div>
    </div>
  )
}

export default Sidebar