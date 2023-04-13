import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React from 'react'

type Props = {
    user:QueryDocumentSnapshot<DocumentData>
}

const User = ({user}: Props) => {
    const router = useRouter();
  return (
    <div className=' flex p-5 border-b border-gray-700 hover:opacity-70' onClick={()=>{router.push(`/user/${user?.get('uid')}`)}} >
        <img 
        src={user?.get('image')} 
        alt="Profile pic" 
        className='h-10 w-10 rounded-full mr-4 flex-none'
        />

        <div>
            <div className='flex'>
                <div className='flex-initial w-64  text-[#d9d9d9] font-semibold text-[20px] sm:text-base mt-0.5'>
                    {user?.get('name')}
                    
                </div>
            </div>

            <div className='w-32 italic  text-[15px] text-[#d9d9d9] '>
                @{user?.get('tag')}
            </div>    

        </div>
    </div>
  )
}

export default User