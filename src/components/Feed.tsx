import { db } from '@/firebase';
import { SparklesIcon } from '@heroicons/react/24/outline'
import { collection, DocumentData, onSnapshot, orderBy, query, QueryDocumentSnapshot, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Input from './Input'
import Post from './Post';
import { sidebarState } from '@/atoms/modalAtom';
import { useRecoilState } from 'recoil';
import { useSession } from 'next-auth/react';

type Props = {}

function Feed({}: Props) {
  const [posts, setPosts] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [state, setState] = useRecoilState(sidebarState);
  const {data: session} = useSession();
  const [followedusersid,setFollowedusersid] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);


    //fetch following id
    useEffect(()=> onSnapshot
      (
        query(collection(db, 'users',(session?.user as any).uid ,'following')),
        (snapshot) => {
        setFollowedusersid(snapshot.docs);
        }
      ),
      [db]
    );

    //fetch following user post data
    useEffect(() => {
      if (followedusersid.length > 0 && state!=='Explore') {
        const FollowedPost = followedusersid.map(doc => doc.id);
        FollowedPost.push(`${(session?.user as any).uid}`)
        onSnapshot(
        query(collection(db, 'posts'),where('id', "in", FollowedPost)),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
        );
      }
      }, [followedusersid,state]
    );
    
    //Explore

    useEffect(()=> onSnapshot
      (
        query(collection(db, 'posts'),
        orderBy('views','desc')),
        (snapshot) => {
          state==='Explore'?
            setPosts(snapshot.docs)
            :
            null
        }
      ),
      [db,state]
    );
    
    



  return (
    <div className='text-white flex-grow border-l border-r border-gray-700
    max-w-2xl sm:ml-[73px] xl:ml-[360px]'>
      <div className='text-[#d9d9d9] flex items-center sm:justify-between 
      py-2 px-3 sticky top-0 z-50 bg-black border-b border-gray-700'>

        <h2 className='text-lg sm:text-xl font-bold'>{state}</h2>
            
          <div className='hoverAnimation w-9 h-9 flex 
            items-center justify-center xl:px-0 ml-auto'>
            <SparklesIcon className='h-5 text-white'/>
          </div>
      </div>
      <Input/>

      <div className='pb-72'>
        {posts.length > 0? posts.map((post) => (
          <Post key={post.id} id={post.id} post={post.data()} postPage={false}/>
        ))
        :
        <p className='text-xl text-gray-500 text-center justify-center font-extralight'>Find other user?</p>
      }
      
      </div>
        
        
    </div>
  )
}

export default Feed


