import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import Sidebar from './components/Sidebar'
import Feed from './components/Feed'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>OpenHub</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico "  />
      </Head>
      
      <main className='bg-black min-h-screen flex max-w-[1500px] mx-auto'>
        {/*Sidebar*/}
        <Sidebar />

        {/*Feed*/}
        <Feed/>

        {/*Widgets*/}

        {/*Modal*/}

      </main>
      
      
    </>
  )
}
