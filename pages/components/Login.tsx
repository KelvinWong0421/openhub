import React, { useState } from 'react'
import Image from 'next/image'
import icon from '../pic/logo.png'
import {ClientSafeProvider, LiteralUnion, signIn} from 'next-auth/react'
import { BuiltInProviderType } from 'next-auth/providers'
import Signup from './Signup'



type Props = {
    providers:Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
}

const Login = ({providers}: Props) => {

//     console.log(providers)

//    {Object.values(providers).map((provider)=>(
//         Object.values(provider).map((info:any)=>(
//             console.log(info.name)
//         ))
//     ))} 

    const [signup,setSignup]= useState(false);
    
    const clicked = () =>{
        setSignup(!signup)
    }


  return (
    <div className='flex flex-col items-center space-y-10 pt-24'>

        {!signup &&
        <Image src={icon} alt='icon'
        width={200}
        height={200}
        style={{ objectFit: "contain" }}
        />
        }
        

        {!signup &&
        <div>
            {Object.values(providers).map((provider) =>(
                Object.values(provider).map((info:any)=>(
                <div key={info.name}>
                    <button className="relative inline-flex items-center justify-start  px-5 py-3 overflow-hidden font-bold rounded-full group" 
                    onClick={() =>signIn(info.id, {callbackUrl: "/"})}>
                        <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"/>
                        <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-white opacity-100 group-hover:-translate-x-8"/>
                        <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900">
                        Sign in with {info.name}
                        </span>
                        <span className="absolute inset-0 border-2 border-white rounded-full"/>
                    </button>  
                </div>
                ))
            ))}
        </div>
        }
        
        <button onClick={()=> clicked()}>
            {!signup &&<h2 className='text-white'>Signup</h2>}
        </button>

         {signup &&
        <div className='pt-10'>
            <Signup/>
                <button onClick={()=> clicked()} >
                <h2 className='text-white'>back</h2>
            </button>
        </div> 
        }

        
    </div>
  )
}

export default Login