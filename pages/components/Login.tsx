import React from 'react'
import Image from 'next/image'
import icon from '../pic/logo.png'
import {ClientSafeProvider, LiteralUnion, signIn} from 'next-auth/react'
import { BuiltInProviderType } from 'next-auth/providers'


type Props = {
    providers:Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
}

const Login = ({providers}: Props) => {
  return (
    <div className='flex flex-col items-center space-y-20 pt-48 '>


        <Image src={icon} alt='icon'
        width={150}
        height={150}
        style={{ objectFit: "contain" }}
        />



        <div>
            {Object.values(providers).map((provider) =>(
                <div key={provider.name}>
                    <button className="relative inline-flex items-center justify-start  px-5 py-3 overflow-hidden font-bold rounded-full group" 
                    onClick={() =>signIn(provider.id, {callbackUrl: "/"})}>
                        <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"/>
                        <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-white opacity-100 group-hover:-translate-x-8"/>
                        <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900">
                        Sign in with Google
                        {provider.name}
                        </span>
                        <span className="absolute inset-0 border-2 border-white rounded-full"/>
                    </button>  
                </div>
            ))}
        </div>

        
    </div>
  )
}

export default Login