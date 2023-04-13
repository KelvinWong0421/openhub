import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from "@headlessui/react";



//firebase api
import { db } from "@/firebase";
import {
  onSnapshot,
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { DocumentData, QueryDocumentSnapshot, getDocs, where } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { modalState, sidebarState } from '@/atoms/modalAtom';
import router from 'next/router';

import { TrashIcon } from '@heroicons/react/24/outline';



type Props = {}

function ListUser({}: Props ){
    const [users, setUsers] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [state, setState] = useRecoilState(sidebarState);

    useEffect(()=> onSnapshot
    (
      query(collection(db, 'users'),
      orderBy('type')),
      (snapshot) => {
        setUsers(snapshot.docs);
      }
    ),
    [db]
  );

  function redirectProfile(targetUser: string){
    router.push(`/user/${targetUser}`);
  }

  // modal
  function closeModal(e: { stopPropagation: () => void; }) {
    setIsOpen(false);
    e.stopPropagation();
  }
  

  function openModal() {
    setIsOpen(true);
  }

  function deleteUser(){
    const subColRef = collection(db, "collection_name", "doc_name", "subcollection_name");

   
    
    closeModal;
  }



  return (
    
<div className='pb-72'>
        {users.map((user) => (
          <div key={user.id} className=' grid grid-flow-col justify-stretch p-5 border-b border-gray-700 hover:opacity-70' onClick={() => redirectProfile(user.id)} >
            <img 
                    src={user?.get('image')} 
                    alt="Profile pic" 
                    className='h-10 w-10 rounded-full mr-4 flex-none'
                    />
            <div>
              <div className=' grid grid-flow-col justify-stretch'>
                <div className=' text-[#d9d9d9] font-semibold text-[20px] sm:text-base mt-0.5' >
                    {user?.get('name')}
                </div>
                <div className=' justify-self-end italic  text-[15px] text-[#d9d9d9] ' >
                  @{user?.get('tag')}
                </div>
                <div className=' justify-self-end italic  text-[15px] text-[#d9d9d9] '>
                  <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">

                    {user?.get('type')==='user'? 
                    <TrashIcon className="h-5  hover:rotate-45" onClick={(e) => {
                    e.stopPropagation();
                    openModal();
                    }} /> : null
                    }
                    
                  </div>
                </div>
                 
              </div>

              <div className='text-[#bccbe3] flex' >
                <div className=' flex-initial w-32'>Type:</div> <div className='flex-initial w-64'>{user?.get('type')}</div>
              </div>
              <div className='text-[#bccbe3] flex'>
                <div className=' flex-initial w-32'>UID:</div> <div className='flex-initial w-64'>{user?.id}</div>
              </div>

            </div>

            <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed z-50 inset-0 pt-8" onClose={setIsOpen}>
            <div className="min-h-screen px-4 text-center" onClick={(e) => {
                    e.stopPropagation();
                    }}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Warning
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 border-t pt-2">
                    Are you sure to delete all information of this user?
                  </p>
                </div>
                <div className='flex justify-end'>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 mr-3 text-sm text-red-900 bg-red-100  rounded-md hover:bg-red-200 duration-300"
                    onClick={deleteUser}
                  >
                    Yes
                  </button>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100  rounded-md hover:bg-red-200 duration-300"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
                </div>
              </div>
            </Transition.Child>
          </div>
            </Dialog>
            </Transition>
          </div>

          
        ))}

      </div>

  )
}

export default ListUser