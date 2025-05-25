import { GifIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useRef, useState } from 'react'

import { db, storage } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { useSession } from 'next-auth/react';





type Props = {}


function Input({}: Props) {
    
    //use session
    const {data: session} = useSession();


    
    // hook
    const [input,setInput] = useState('');
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [showGif, setShowGif] = useState(false);
    const [loading, setLoading] = useState(false);

    const filePickerRef = useRef<HTMLInputElement>(null);

    // send post function
    const sendPost = async() => {
        if(loading) return;
        setLoading(true);
        const docRef = await addDoc(collection(db,'posts'),{
            id: (session?.user as any)?.uid,
            username: session?.user?.name,
            userImg: session?.user?.image,
            tag: (session?.user as any)?.tag,
            text: input,
            timestamp: serverTimestamp(),
            views: 0
        });

        const imageRef = ref(storage, `posts/${docRef.id}/image`);

        if (selectedFile){
            await uploadString(imageRef,selectedFile,'data_url').
            then(async () =>{
                const downloadURL = await getDownloadURL(imageRef) 
                await updateDoc(doc(db,'posts',docRef.id),{
                    image:downloadURL,
                }) 
            })
        }

        setLoading(false)
        setInput('')
        setSelectedFile(null)
        setShowGif(false)
    }

    const addImageToPost = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        if (e.target.files && e.target.files[0]) {
          reader.readAsDataURL(e.target.files[0]);
      
          reader.onload = (readerEvent) => {
            const originalImage = new Image();
            originalImage.src = readerEvent.target?.result as string;
      
            originalImage.onload = () => {
              // Resize the image
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 800; // Adjust as needed
              const MAX_HEIGHT = 800;
      
              let width = originalImage.width;
              let height = originalImage.height;
      
              // Calculate the new width and height while maintaining the aspect ratio
              if (width > height) {
                if (width > MAX_WIDTH) {
                  height = (MAX_WIDTH / width) * height;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width = (MAX_HEIGHT / height) * width;
                  height = MAX_HEIGHT;
                }
              }
      
              // Set the canvas dimensions
              canvas.width = width;
              canvas.height = height;
      
              const ctx = canvas.getContext('2d');
              if (ctx) {
                // Draw the resized image on the canvas
                ctx.drawImage(originalImage, 0, 0, width, height);
      
                // Convert the canvas to a data URL
                const resizedImageDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 0.7 = 70% quality
      
                // Save the resized image to state
                setSelectedFile(resizedImageDataUrl);
              }
            };
          };
        }
      };
      
        


  return (
    <div className={`border-b border-gray-700 p-3 flex space-x-4 /overflow-y-scroll/ ${loading &&" opacity-40"}`}>
        {/* user */}
        <img src={session?.user?.image??""}  
          alt="" 
          className='h-11 w-11 rounded-full cursor-pointer' 
        />
        {/* input */}
        <div className='w-full divide-y-2 divide-gray-700'>
            <div>
                <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)} 
                rows={2}
                placeholder="Share your Idea?" 
                className='bg-transparent outline-none 
                text-[#d9d9d9] text-lg placeholder-gray-700 
                tracking-wide w-full min-h-[60px]' 
                />

                {selectedFile &&(
                <div className='relative'>

                    <div className='absolute w-7 h-7 bg-[#15181c] hover:bg-[#27226]
                    bg-opacity-75 rounded-full flex items-center justify-center top-1
                    left-1 cursor-pointer' onClick={() => (setSelectedFile(null))}>
                        <XMarkIcon className='text-white h-5'/>
                    </div>

                    <img 
                    src={selectedFile} 
                    alt="" 
                    className='rounded-2xl max-h-80 object-contain'
                    />

                </div>
                )}
            </div>

            {/* icon */}

            {!loading && (
            <div className='flex items-center justify-between pt-2.5'>
                <div className=' flex items-center '>

                    <div className='icon' 
                    onClick={() => filePickerRef.current?.click()}>
                        <PhotoIcon className='h-[22px] text-[#1d9bf0]'/>
                        <input type="file"
                        hidden 
                        onChange={addImageToPost} 
                        ref={filePickerRef}/>
                        
                    </div>


                    <div className='icon' 
                    onClick={()=> setShowGif(!showGif)}>
                        <GifIcon className='h-[22px] text-[#1d9bf0]'/>
                    </div>




                </div>

                {/* Sending */}
                <button
                className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 
                font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] 
                disabled:opacity-50 disabled:cursor-default flex"
                disabled={!input && !selectedFile}
                onClick={sendPost}
                >
                    Send
                </button>
            </div>
            )}
            
        </div>

        
    </div>
  )
}

export default Input