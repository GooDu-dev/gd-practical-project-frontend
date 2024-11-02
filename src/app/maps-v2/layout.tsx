import React, { ReactNode } from 'react'
import { Navbar } from '../component/navbar/navbar.component'

const MapV2Layout = ({children}: {children: ReactNode}) => {
  return (
    <div className='w-screen h-screen'>
        {children}
        <Navbar />
    </div>
  )
}

export default MapV2Layout