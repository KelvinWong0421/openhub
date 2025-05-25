import { ClientSafeProvider, LiteralUnion, getProviders, getSession, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import Auth from '@/pages/Auth';
import { GetServerSidePropsContext } from 'next';
import { BuiltInProviderType } from 'next-auth/providers';
import { useRouter } from 'next/router';
import Head from 'next/head'
import Sidebar from '@/pages/components/Sidebar'

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import User from '@/pages/components/User';
import { DocumentData, QueryDocumentSnapshot, collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/firebase';




type Props = {
    providers:Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
}

const Followers = ({providers}: Props) => {
    const {data: session} = useSession();
    const router = useRouter();
    const uid = router.query.uid;
    const [users, setUsers] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
    const [usersid, setUsersid] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
    
    //fetch followers id
    useEffect(()=> {
        if (uid) {
            return onSnapshot(
                query(collection(db, 'users',uid as string,'followers')),
                (snapshot) => {
                    setUsersid(snapshot.docs);
                }
            );
        }
    }, [uid]);


    //fetch followers user data
    useEffect(() => {
        if (usersid.length > 0) {
            const followersIds = usersid.map(doc => doc.id);
            return onSnapshot(
                query(collection(db, 'users'), where('uid', "in", followersIds)),
                (snapshot) => {
                    setUsers(snapshot.docs);
                }
            );
        }
    }, [usersid]);
    
    if(!session) return <Auth providers={providers}/>
    




  return (
    <div>
        
        <div>
            <div>
              <Head>
              <title>Followers</title>
              <link rel="icon" href="/favicon.ico "  />
              </Head>

              <main className='bg-black min-h-screen flex max-w-[1500px] mx-auto'>
              <Sidebar />
              <div className='flex-grow broder-l border-l border-r border-gray-700 
                max-w-2xl sm:ml-[73px] xl:ml-[370px]'>

                <div className=' flex items-center px-1.5 py-2 border border-gray-700 
                text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black'>
                    <div className='hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0'
                    onClick={()=>{router.push('/')}}>
                        <ArrowLeftIcon className='h-5 text-white'/>
                    </div>
                    Followers
                </div>

                <div className='pb-72'>
                    {users.map((user) => (
                    <User key={user.id} user={user} />
                    ))}

                </div>

              </div>
              </main>

            </div>
            
 

            
            
        </div>
        
        
    </div>
  )
}

export default Followers

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