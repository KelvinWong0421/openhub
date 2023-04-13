import { deleteDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { ClientSafeProvider, getProviders, getSession, LiteralUnion, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'

import { db, storage } from "@/firebase";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";


import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";

import Auth from '../Auth'
import { GetServerSidePropsContext } from 'next'
import { BuiltInProviderType } from 'next-auth/providers'
import { ArrowLeftIcon, CameraIcon, Cog6ToothIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Popover } from '@headlessui/react'
import { Animate } from 'react-simple-animate'
import { BeatLoader } from 'react-spinners'


type Props = {
    providers:Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
}


function User({providers}: Props) {


  //for follow system
  const [loading, setLoading] = useState(false);
  const [follow, setFollow] = useState('Follow');
  const [isfollowed, setIsfollowed] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  //edit function
  const [name, setName] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [bio, setBio] = useState('');
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [inputBanner, setInputBanner] = useState<string | null>(null);
  const [index, setIndex] = useState('userTweets');

  //session and user info
  const {data: session} = useSession();
  const router = useRouter();
  const {uid} = router.query;

  interface user {
  uid: string,
  name: string,
  image: string,
  tag: string,
  bio: string,
  type: string,
  }
  const [user,setUser] = useState<user|any>(null);

  if(!session) return <Auth providers={providers}/>

  //fetch user data
  useEffect(()=>
    onSnapshot(doc(db,'users',uid as string),(snapshot)=>{
      setUser(snapshot.data())
    }),
    [uid]
  )

  //fetch user following
  useEffect(()=> 
    onSnapshot(collection(db,'users',uid as string,'following'),(snapshot)=> setFollowing(snapshot.docs as any)),
    [db,uid]
  );
  
  //fetch user followers
  useEffect(()=> 
    onSnapshot(collection(db,'users',uid as string,'followers'),(snapshot)=> setFollowers(snapshot.docs as any)),
    [db,uid]
  );
  
  //update the state of following
  useEffect(()=> {
    setIsfollowed(followers.findIndex((followers : any) => followers.id === (session.user as any).uid) !== -1),
    [uid,following]
      {isfollowed ? setFollow('UnFollow'):setFollow('Follow')} 
    }
  );

  
  //handle Follow
  const handleFollowClick = async () => {
    setLoading(true);
    if(isfollowed)
    { 
      // delete target ac followers
      await deleteDoc(doc(db,'users',uid as string,'followers',(session?.user as any).uid));

      // delete session-user following
      await deleteDoc(doc(db,'users',(session?.user as any).uid,'following',uid as string));
      setLoading(false);
    } 
    else 
    { 
      //target
      await setDoc(doc(db,'users',uid as string,'followers',(session?.user as any).uid) ,{
        username: session?.user?.name
      });
      //session
      await setDoc(doc(db,'users',(session?.user as any).uid,'following',uid as string) ,{
        username: user.name
      });
      setLoading(false);
    }
  };

  //add Profile image
  const ProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if(e.target.files&&e.target.files[0]){
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) =>{
      setInputImage(readerEvent.target?.result as string);
    } 
  };
  //add banner image
  const BannerImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if(e.target.files&&e.target.files[0]){
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) =>{
      setInputBanner(readerEvent.target?.result as string);
    } 
  };

  // handle user Profile change
  const handleSave = async() => {
    setLoading(true);

    const docRef = doc(db,'users',user.uid);

    const profileRef = ref(storage, `users/${user.uid}/profile`);
    const bannerRef = ref(storage, `users/${user.uid}/banner`);

    if (inputImage){
      await uploadString(profileRef,inputImage,'data_url').
      then(async () =>{
          const downloadURL = await getDownloadURL(profileRef) 
          await updateDoc(doc(db,'users',docRef.id),{
              image:downloadURL,
          }) 
      })
    }

    if (inputBanner){
      await uploadString(bannerRef,inputBanner,'data_url').
      then(async () =>{
          const downloadURL = await getDownloadURL(bannerRef) 
          await updateDoc(doc(db,'users',docRef.id),{
              banner:downloadURL,
          }) 
      })
    }


    if (bio !== user.bio){
      await updateDoc(doc(db,'users',docRef.id),{
        bio:bio,
      }) 
    }


    if (name !== user.name){
      await updateDoc(doc(db,'users',docRef.id),{
        name:name,
        tag:name.split(" ").join("").toLocaleLowerCase(),
      }) 
    }

    setInputBanner(null);
    setInputImage(null);
    setBio(user.bio);
    setName(user.name);
    setLoading(false);
  }



  return (
    <div>
      <Head>
        <title>{user?.name}</title>
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
              Profile
          </div>
          
          {/* show personal info */}
          <div className="h-44 w-35 bg-gray-800 bg-cover bg-center" 
          style={{backgroundImage:user?.banner? `url('${user?.banner}')`: ''}}
          />

          <div className="relative ml-5 ">
            <Popover>
              <Popover.Button>
              <img
                src={user?.image}
                alt="profile-picture"
                className="absolute rounded-full h-36 w-36 object-cover border-black border-4 top-[-3em] ml-0.5"
              />
              </Popover.Button>

              <Popover.Overlay className="fixed inset-0 bg-gray-700 bg-opacity-80 z-40" />

              <Popover.Panel>
                <Animate play start={{ opacity: 0 }} end={{ opacity: 1 }}>
                <img alt="profile-picture"
                src={(user as any)?.image}
                className="fixed top-1/2 h-max-80 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl mb-2 mr-1 max-w-[45em] z-50"
                />
                </Animate>
              </Popover.Panel>
            </Popover>

            {/* if is user is session user  */}
            {user?.uid === (session?.user as any).uid ? (
              <Cog6ToothIcon 
                className="ml-11 absolute left-[20.5em] p-1 text-2xl w-8 h-8 text-white hover:bg-gray-800 border rounded-full border-gray-500 cursor-pointer"
                onClick={() => {
                  setShowEditor(true);
                  setName(user?.name);
                  setBio(user?.bio);
                  setInputBanner(null);
                  setInputImage(null);
                }}
              />
            ) : null}
            
            {/* if is user is not session user  */}
            {user?.uid !== (session?.user as any).uid ? (
              <button className="ml-12 absolute left-[23.5em] text-black bg-white font-bold border rounded-full py-1 px-4 cursor-pointer hover:bg-gray-200" onClick={handleFollowClick}>
                {!loading ? <p>{follow}</p> : <BeatLoader color="black" size={10} />}
              </button>
            ) : null}

          </div>

          <div className="ml-5 mr-5 mt-20 flex flex-col gap-1">
            <div>
              <p className="font-bold text-white">{user?.name}</p>
              <div className="font-light text-gray-400 flex">
                @{user?.tag}
                {user?.type === 'admin'? 
                  <p className='text-red-600 rounded-full font-mono ml-6 flex mt-0 '>
                    <UserIcon className='flex h-4 w-4 mt-1'/>
                    Admin
                  </p>
                :null }
              </div>
            </div>
            <p className='text-white font-mono'>{user?.bio}</p>

            <div className="flex gap-2">
              <div onClick={() => router.push(`/user/${user?.uid}/following`)} className="flex items-center gap-1 cursor-pointer">
                {following? <p className='text-white'>{following.length}</p> : 0}
                <p className="text-gray-400 font-light">Following</p>
              </div>

              <div onClick={() => router.push(`/user/${user?.uid}/followers`)} className="flex items-center gap-1 cursor-pointer">
                {followers? <p className='text-white'>{followers.length}</p> : 0}{' '}
                <p className="text-gray-400 font-light">Followers</p>
              </div>
            </div>
          </div>

          <div className="flex mx-10 mt-8 mb-4 justify-between text-gray-400 font-bold text-sm">
            <p
              onClick={() => setIndex('userTweets')}
              style={{ color: index === 'userTweets' ? 'white' : '#9ca3af' }}
              className="cursor-pointer py-1 px-3"
            >
              Tweet
            </p>
            <p
              onClick={() => setIndex('userReplies')}
              style={{ color: index === 'userReplies' ? 'white' : '#9ca3af' }}
              className="cursor-pointer py-1 px-3"
            >
              Tweets & replies
            </p>
            <p
              onClick={() => setIndex('userMedia')}
              style={{ color: index === 'userMedia' ? 'white' : '#9ca3af' }}
              className="cursor-pointer py-1 px-3"
            >
              Media
            </p>
            <p
              onClick={() => setIndex('userLikes')}
              style={{ color: index === 'userLikes' ? 'white' : '#9ca3af' }}
              className="cursor-pointer py-1 px-3"
            >
              Likes
            </p>
          </div>

          {!showEditor ? null : (
            <div
              onClick={() => {
                setName(user?.name);
                setBio(user?.bio);
                setInputBanner(null);
                setInputImage(null);
                setShowEditor(false);
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-gray-700 bg-opacity-80 z-50"
            >
              <Animate play start={{ opacity: 0 }} end={{ opacity: 1 }}>
                <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-black pt-6 px-5 pb-10 rounded-xl w-[35em] h-[40em]"
                >
                  <div className="flex justify-between">
                    <div className="flex gap-8 text-xl items-center">
                      <XMarkIcon
                        className="text-xl font-light cursor-pointer bg-white rounded-full hover:bg-gray-300"
                        onClick={() => {
                          setName(user?.name);
                          setBio(user?.bio);
                          setInputBanner(null);
                          setInputImage(null);
                          setShowEditor(false);
                        }}
                      />
                      <p className="font-bold">Edit Profile</p>
                    </div>
                    <button
                      onClick={() => {
                        handleSave();
                      }}
                      className="text-base font-bold border rounded-full bg-white text-black  py-1 px-4 cursor-pointer hover:bg-gray-300"
                    >
                      {!loading ? 'Save' : <BeatLoader color="black" size={10} />}
                    </button>
                  </div>
                  <div className="flex flex-col gap-5 mt-5 relative">
                    <div
                      style={{backgroundImage:inputBanner? `url('${inputBanner}')`: `url('${user.banner}')`}}
                      className="bg-gray-600 h-40 bg-cover bg-center"
                    />
                    <img
                      src={inputImage ? inputImage : user?.image}
                      alt="profile-picture"
                      className="absolute top-32 rounded-full h-24 w-24 border-black border-4 object-cover"
                    />
                    <label className="absolute rounded-full p-3 cursor-pointer top-[10.4em] left-[2.2em] opacity-80">
                      <CameraIcon className=" text-white text-xl"/>
                      <input
                        type="file"
                        name="myfile"
                        className="hidden"
                        onChange={ProfileImage}
                      />
                    </label>
                    <label className="absolute rounded-full p-3 cursor-pointer top-[4.4em] left-[15em] opacity-80">
                      <CameraIcon className= 'bg-white text-white'/>
                      <input
                        type="file"
                        name="myfile"
                        className="hidden"
                        onChange={BannerImage}
                      />
                    </label>
                    <div className="border border-gray-700 rounded p-2 mt-[4em]">
                      <p className="text-gray-400 font-light text-sm">Name</p>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-black text-white outline-none mt-1 w-full placeholder:text-xl placeholder:text-gray-500"
                      />
                    </div>
                    <div className="border border-gray-700 rounded p-2 ">
                      <p className="text-gray-400 font-light text-sm">Bio</p>
                      <input
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="bg-black text-white outline-none mt-1 w-full placeholder:text-xl placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </Animate>
            </div>
          )}



        </div>

      </main>
    </div>
  )
}

export default User

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