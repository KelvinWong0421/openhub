import React, { useEffect, useState } from 'react'

//firebase api
import { db } from "@/firebase";
import {
  onSnapshot,
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { sidebarState } from '@/atoms/modalAtom';
import { type } from 'os';


type Props = {}

function ListUser({}: Props ){
    const [users, setUsers] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
    const [state, setState] = useRecoilState(sidebarState);

    useEffect(()=> onSnapshot
    (
      query(collection(db, 'users'),
      orderBy('type')),
      (snapshot) => {
        setUsers(snapshot.docs);
      }
    ),
    [db]
  );

  return (
    
<div className='pb-72'>
        {users.map((user) => (
          <div className=' flex p-5 border-b border-gray-700 hover:opacity-70'>
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
                  <div className=' flex-initial w-32 italic  text-[15px] text-[#d9d9d9] '>
                    @{user?.get('tag')}
                  </div>
                </div>

                <div className='text-[#bccbe3] flex'>
                  <div className=' flex-initial w-32'>Type:</div> <div className='flex-initial w-64'>{user?.get('type')}</div>
                </div>
                <div className='text-[#bccbe3] flex'>
                  <div className=' flex-initial w-32'>UID:</div> <div className='flex-initial w-64'>{user?.id}</div>
                </div>

            </div>
          </div>
        ))}

      </div>

  )
}

export default ListUser