import React from 'react'


type Props = {
  text: string;
  Icon: React.ElementType;
  active : boolean;
  
}

function SidebarLink({text,Icon,active}: Props) {
  return (
    
    <div className={`text-[#d9d9d9] flex items-center justify-center xl:justify-start 
    text-xl space-x-3 hoverAnimation ${active && 'font-bold'}`}>
      <Icon className='h-7 '/>
      <span className='hidden xl:inline'>{text}</span>
    </div>
  )
}

export default SidebarLink