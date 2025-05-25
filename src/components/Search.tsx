import React, { useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { db } from '@/firebase';
import { DocumentData, QueryDocumentSnapshot, collection, onSnapshot, query, where } from 'firebase/firestore';
import User from './User';


type Props = {}

const Search = (props: Props) => {
  const [search,setSearch] = useState('');
  const [pressed,setPressed] = useState(false);
  const [users, setUsers] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  //ping pong effect
  const enter = (e:any) =>{
    if(e.key==='Enter'){
        setPressed(!pressed);
    }
  }
  
    useEffect(() => {
        onSnapshot(
        query(collection(db, 'users'), where('tag', "==", search)),   //"array-contains" need to change the tag:String to tag:array
        (snapshot) => {
            setUsers(snapshot.docs);
        }
        );
        }, [pressed]
    );

  return (
    <div className="hidden lg:inline ml-8 xl:w-[450px] py-1 space-y-5">
      <div className="sticky top-0 py-1.5 bg-black z-50 w-11/12 xl:w-9/12">
        <div className="flex items-center bg-[#202327] p-3 rounded-full relative">
          <MagnifyingGlassIcon className="text-gray-500 h-5 z-50" />
          <input
            type="text"
            className="bg-transparent placeholder-gray-500 outline-none text-[#d9d9d9] absolute inset-0 pl-11 border border-transparent w-full focus:border-[#1d9bf0] rounded-full focus:bg-black focus:shadow-lg"
            placeholder="Search Users"
            onChange={(e) => setSearch(e.target.value)} 
            onKeyDown={enter}
          />
        </div>
      </div>

        <div className='pb-72'>
            {users.map((user) => (
            <User key={user.id} user={user} />
            ))}
        </div>

      

    </div>
  )
}

export default Search

