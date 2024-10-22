import React from 'react'
import Image from 'next/image'

export const Navbar = () => {
  return (
    <nav className='w-screen bg-p_dark fixed bottom-0 rounded-t-3xl'>
        <ul className='w-full flex flex-row justify-evenly h-auto items-center'>
            <li className='h-fit'>
                <a href="">
                    <Image
                        width={50}
                        height={50}
                        src="/businessman.png"
                        alt='about wunnyGo developer'
                    />
                </a>
            </li>
            <li className='-translate-y-1/3 bg-p_dark p-5 rounded-full border-4 border-p_white h-fit'>
                <a href="">
                    <Image
                        width={50}
                        height={50}
                        src="/map.png"
                        alt='show map button'
                    />
                </a>
            </li>
            <li className='h-fit'>
                <a href="">
                    <Image
                        width={50}
                        height={50}
                        src="/share.png"
                        alt='share to other app'
                    />
                </a>
            </li>
        </ul>
    </nav>
  )
}
