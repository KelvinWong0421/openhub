import { ClientSafeProvider, LiteralUnion, getProviders, getSession, useSession } from 'next-auth/react';
import React from 'react'
import Auth from './Auth';
import { GetServerSidePropsContext } from 'next';
import { BuiltInProviderType } from 'next-auth/providers';
import router from 'next/router';
import Head from 'next/head'
import Sidebar from './components/Sidebar'

//icon
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import ListUser from './components/ListUser';



type Props = {
    providers:Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
}

const admin = ({providers}: Props) => {
    const {data: session} = useSession();
    if(!session) return <Auth providers={providers}/>

const redirectHomeClick = () => {
      router.push(`/`);     //  navigate to the user setting
    };

const reloadClick = () => {
    window.location.reload();
};




  return (
    <div>
        {(session?.user as any).type !=='admin'? 
        <div>
          <Head>
          <title> 404 Access Denied</title>
          <link rel="icon" href="/favicon.ico "  />
          </Head>
          <main className='bg-black min-h-screen flex max-w-[1500px] mx-auto'>
            <Sidebar />
            <div className='flex-grow broder-l border-l border-r border-gray-700 
            max-w-2xl sm:ml-[73px] xl:ml-[370px]'>
              <p className=' text-red-600 text-xl justify-center text-center mt-80'> 404 Access denied.😭😭</p>
              <div className= ' flex justify-center'>
                <button onClick={redirectHomeClick} className=' bg-white rounded-full p-4 mt-5 hover:bg-green-200' >back to home</button>
              </div>
            </div>
          </main>
        </div>
        :
        <div>
            {/* show admin context */
            <div>
              <Head>
              <title> List User Account</title>
              <link rel="icon" href="/favicon.ico "  />
              </Head>

              <main className='bg-black min-h-screen flex max-w-[1500px] mx-auto'>
              <Sidebar />
              <div className='flex-grow broder-l border-l border-r border-gray-700 
            max-w-2xl sm:ml-[73px] xl:ml-[370px]'>

                <div className=' flex justify-normal px-1.5 py-5 border border-gray-700 
                text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black'>
                  <div className=' flex-auto w-80'>
                    User Infomation
                  </div>
                  <div  className='flex-auto w-10 icon hover:rotate-45'>
                      <ArrowPathIcon className="h-5 text-white" onClick={reloadClick}/>
                  </div>
                  <div className="flex-auto w-10 icon hover:rotate-45">
                        <PlusIcon className="h-5 text-white" />
                    </div>
                </div>

                <ListUser/>

              </div>
              </main>

            </div>
            
 

            }
            
        </div>
        }
        
    </div>
  )
}

export default admin

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