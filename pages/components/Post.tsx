import { db } from '@/firebase'
import { deleteDoc, onSnapshot, setDoc } from '@firebase/firestore'
import { ArrowsRightLeftIcon, ChartBarIcon, ChatBubbleBottomCenterTextIcon, EllipsisHorizontalIcon, ShareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { collection, doc } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Moment from 'react-moment'
import { useRecoilState } from 'recoil'
import { modalState, postIdState } from 'atoms/modalAtom';
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconFill } from '@heroicons/react/24/solid'

type Props = {
    id:string
    post:any
    postPage:any
}

function Post({id,post,postPage}: Props) {
    const {data: session} = useSession();
    const [isOpen, setIsOpen] = useRecoilState(modalState);
    const [postId, setPostId] = useRecoilState(postIdState);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] =useState([]);
    const [liked, setLiked] =useState(false);
    const router = useRouter();

    useEffect(()=> 
        onSnapshot(collection(db,'posts',id,'likes'),(snapshot)=> setLikes(snapshot.docs as any)),
        [db,id]
    );

    useEffect(()=> 
        setLiked(likes.findIndex((like : any) => like.id === (session?.user as any).uid) !== -1),
        [likes]
    );

    const likePost = async () => {
        if(liked)
        {
            await deleteDoc(doc(db,'posts',id,'likes',(session?.user as any).uid))
        } 
        else 
        {
            await setDoc(doc(db,'posts',id,'likes',(session?.user as any).uid) ,{
                username: session?.user?.name
            });
        }
    }

  return (
    <div className='p-3 flex cursor-pointer border-b border-gray-700' onClick={() => router.push(`/${id}`)}>
        {!postPage && (
            <img 
            src={post?.userImg} 
            alt="" 
            className='h-11 w-11 rounded-full mr-4' 
            />
        )}

        <div className='flex flex-col space-y-2 w-full'>
            <div className={`flex ${!postPage && 'justify-between'}`}>
                {postPage && (
                    <img 
                    src={post?.userImg} 
                    alt="Profile pic" 
                    className='h-10 w-10 rounded-full mr-4' 
                    />
                    
                )}

                <div className='text-[#6e767d]'>
                    <div className=' inline-block group'>
                        <h4 className={`font-bold text-[15px] sm:text-base 
                        text-[#d9d9d9] group-hover:underline ${!postPage &&'inline-block'}`}>
                            {post?.username}
                        </h4>
                        <span className={`text-sm sm:text-[15px] ${!postPage &&'ml-1.5'}`}>@{post?.tag}</span>
                    </div>{" "}
                    
                    <span className='hover:underline text-sm sm:text-[15px]'>
                    {<Moment fromNow>{post?.timestamp?.toDate()}</Moment>}
                    </span>

                    {!postPage && (
                    <p className='text-[#d9d9d9] text-[15px] sm:text-base mt-0.5'>
                        {post?.text}
                    </p>
                    )}
                </div>

                <div className="icon group flex-shrink-0 ml-auto">
                    <EllipsisHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
                </div>

            </div>

            {postPage &&(
                <p className='text-[#d9d9d9] text-[15px] sm:text-base mt-0.5'>
                    {post?.text}
                </p>
            )}

            <img src={post?.image} alt="" className='rounded-2xl max-h-[700] object-cover mr-2'/>
            
            <div className={`text-[#6e767d] flex justify-between w-10/12 
            ${postPage && 'mx-auto'}`}>

                {/* chat icon */}

                <div className="flex items-center space-x-1 group"
                onClick={(e) => {
                 e.stopPropagation();
                 setPostId(id);
                 setIsOpen(true);
                }}>

                    <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
                        <ChatBubbleBottomCenterTextIcon className="h-5 group-hover:text-[#1d9bf0]" />
                    </div>

                    {comments.length > 0 && (
                        <span className="group-hover:text-[#1d9bf0] text-sm">
                            {comments.length}
                        </span>
                    )}
                </div>
                
                {/*Delete Post */}

                {(session?.user as any).uid === post?.id ? (
                    <div className="flex items-center space-x-1 group"
                    onClick={(e) => {
                    e.stopPropagation();
                    deleteDoc(doc(db, "posts", id));
                    router.push("/");
                    }}>
                    <div className="icon group-hover:bg-red-600/10">
                        <TrashIcon className="h-5 group-hover:text-red-600" />
                    </div>
                    </div>) 
                : (
                    <div className="flex items-center space-x-1 group">
                        <div className="icon group-hover:bg-green-500/10">
                            <ArrowsRightLeftIcon className="h-5 group-hover:text-green-500" />
                        </div>
                    </div>
                )}

                {/* Like Post */}

                <div className="flex items-center space-x-1 group" 
                    onClick={(e) => {
                    e.stopPropagation();
                    likePost();
                    }}>

                    <div className="icon group-hover:bg-pink-600/10">
                        {liked ? (
                        <HeartIconFill className="h-5 text-pink-600" />
                        ) : (
                        <HeartIcon className="h-5 group-hover:text-pink-600" />
                        )}

                    </div>

                    {likes.length > 0 && (
                    <span className={`group-hover:text-pink-600 text-sm ${liked && "text-pink-600"}`}>
                        {likes.length}
                    </span>
                    )}

                </div>

                <div className="icon group">
                    <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
                </div>

                <div className="icon group">
                    <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
                </div>

            </div>
            

        </div>

    </div>
  )
}

export default Post