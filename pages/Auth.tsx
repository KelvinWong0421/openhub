import React, { useState } from 'react'
import Image from 'next/image'
import icon from './pic/logo.png'
import {ClientSafeProvider, LiteralUnion, signIn} from 'next-auth/react'
import { BuiltInProviderType } from 'next-auth/providers'
import { useRouter } from 'next/router'






type Props = {
    providers:Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
}

const Auth = ({providers}: Props) => {



    const router = useRouter();
    
    const Signup = () =>{
        
        router.push('/signup')
    }

    const forgot_password = () =>{
        window.open("https://support.google.com/accounts/answer/41078?hl=en&co=GENIE.Platform%3DDesktop",'_blank');
    }

    const open_google_ac = () =>{
        window.open("https://support.google.com/accounts/answer/27441?hl=en", "_blank");
    }


  return (
    <div className='bg-gray-800 text-white h-screen w-screen flex justify-center items-center'>

        
        <div className="flex flex-col bg-black pb-32 px-32 pt-8 rounded-3xl gap-3">
        <Image src={icon} alt='icon' className='w-[150px] h-[150px] self-center'/>
         <p className="text-xl font-bold mb-4 xl:text-2xl self-center">Login to OpenHub</p>


            <div className='flex items-center justify-center gap-3 w-full cursor-pointer'>
            {Object.values(providers?? []).map((provider) =>(
                
                <div key={provider.name}>
                    <button className="relative inline-flex items-center justify-start  px-5 py-3 overflow-hidden font-bold rounded-full group" 
                    onClick={() =>signIn(provider.id, {callbackUrl: "/"})}>
                        <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"/>
                        <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-white opacity-100 group-hover:-translate-x-8"/>
                        <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900">
                        Sign in with {provider.name}
                        </span>
                        <span className="absolute inset-0 border-2 border-white rounded-full"/>
                    </button>  
                </div>

            ))}
            </div>
            
            <div className='flex items-center justify-center gap-3 w-full cursor-pointer'>
                <button className="relative inline-flex items-center justify-start  px-5 py-3 overflow-hidden font-bold rounded-full group cursor-not-allowed">
                    <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"/>
                    <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-white opacity-100 group-hover:-translate-x-8"/>
                    <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900">
                        Sign in with email
                    </span>
                    <span className="absolute inset-0 border-2 border-white rounded-full"/>
                </button>
            </div>

            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-b border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-black px-1 text-sm text-white">or</span>
                </div>
            </div>

            <input
            className="bg-black border text-gray-700 border-gray-700 px-2 py-3 rounded cursor-not-allowed"
            placeholder="Phone, email or username"
            />
              
            <button onClick={forgot_password} className="mt-2 w-full text-white  hover:bg-gray-800 hover:bg-opacity-30 focus:ring-4 focus:outline-none focus:ring-blue-300 border border-white font-medium rounded-3xl text-sm px-5 py-1.5 text-center ">
                Forgot pasword?
            </button>

            <div className="flex gap-2 mt-10">
                <p>Don&apos;t have an account?</p>
                <p onClick={open_google_ac} className="text-blue-500 hover:text-white">Sign up</p>
            </div>
        
        </div>




        
    </div>
  )
}

export default Auth