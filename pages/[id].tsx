import { modalState } from '@/atoms/modalAtom'
import { onSnapshot } from 'firebase/firestore'
import { ClientSafeProvider, getProviders, getSession, LiteralUnion, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import Modal from './components/Modal'
import Sidebar from './components/Sidebar'
import Comment from './components/Comment'

//firebase api
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";

import Auth from './Auth'
import { GetServerSidePropsContext } from 'next'
import { BuiltInProviderType } from 'next-auth/providers'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Post from './components/Post'

type Props = {
    providers:Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
}

function PostPage({providers}: Props) {
    const {data: session} = useSession();
    const [post, setPost] = useState<any>();
    const [comments,setComments] =useState([]);
    const [isOpen,setIsOpen] = useRecoilState(modalState);
    const router = useRouter();
    const {id} = router.query;

    if(!session) return <Auth providers={providers}/>

    useEffect(()=>
        onSnapshot(doc(db,'posts',id as any),(snapshot)=>{
            setPost(snapshot.data())
        }),
        [db]
    )
    useEffect(()=>
        onSnapshot(
            query(
                collection(db,'posts',id as any,'comments'),
                orderBy('timestamp','desc')
            )
            ,(snapshot)=>{
            setComments(snapshot.docs as any)
        }),
        [db,id]
    )



  return (
    <div>
        <Head>
            <title>{post?.username} on Twitter:'{post?.text}'</title>
            <link rel="icon" href="/favicon.ico "  />
        </Head>
      
        <main className='bg-black min-h-screen flex max-w-[1500px] mx-auto'>
            {/*Sidebar*/}
            <Sidebar />
            <div className='flex-grow broder-l border-l border-r border-gray-700 
            max-w-2xl sm:ml-[73px] xl:ml-[370px]'>
                <div className='flex items-center px-1.5 py-2 border border-gray-700 
                text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black'>
                    <div className='hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0'
                    onClick={()=>{router.push('/')}}>
                        <ArrowLeftIcon className='h-5 text-white'/>
                    </div>
                    Tweet
                </div>
                <Post id={id as string} post={post} postPage/>
                
                {comments.length > 0 && (
                    <div className='pd-72'>
                        {comments.map((comment:any) =>(
                            <Comment 
                                key={comment.id} 
                                id={comment.id} 
                                comment={comment.data()}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/*Modal*/}
            {isOpen&&<Modal/>}
        
        </main>
    </div>
  )
}

export default PostPage

export async function getServerSideProps(context:GetServerSidePropsContext) {

  
  const providers = await getProviders();
  const session = await getSession(context)
  
  return {
    props: {
      providers,
      session
    }, 
  }
}