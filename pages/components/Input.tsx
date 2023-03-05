import { ArrowLongRightIcon, GifIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useRef, useState } from 'react'


type Props = {}

function Input({}: Props) {
        // hook
        const [input,setInput] = useState('');
        const [selectedFile, setSelectedFile] = useState(null);
        const [showGif, setShowGif] = useState(false);

        const filePickerRef = useRef<HTMLInputElement>(null);


        const addImageToPost = () => {
            setSelectedFile(selectedFile);
        };
        


  return (
    <div className={`border-b border-gray-700 p-3 flex space-x-4 /overflow-y-scroll/`}>
        {/* user */}
        <img src="https://media.moddb.com/cache/images/members/5/4550/4549205/thumb_620x2000/duck.jpg" 
          alt="" 
          className='h-10 w-10 rounded-full cursor-pointer' 
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
                <div className='icon flex justify-center'> 
                    <ArrowLongRightIcon className='h-[22px] text-[#1d9bf0]'/>
                </div>

            </div>
            
            
        </div>

        

    </div>
  )
}

export default Input