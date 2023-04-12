import { ClientSafeProvider, LiteralUnion, getProviders, getSession, useSession } from 'next-auth/react';
import React from 'react'
import Auth from './Auth';
import { GetServerSidePropsContext } from 'next';
import { BuiltInProviderType } from 'next-auth/providers';

type Props = {
    providers:Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
}

const admin = ({providers}: Props) => {
    const {data: session} = useSession();
    if(!session) return <Auth providers={providers}/>



  return (
    <div>
        {(session?.user as any).type !=='admin'? 
        <div className=' justify-center items-center text-center'>
            <p className=' text-red-600 text-xl justify-center text-center mt-80'> Access Denied</p>
        </div>
        :
        <div>
            {/* show admin context */}
            
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