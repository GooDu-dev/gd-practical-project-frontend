import React, { ReactNode } from 'react'
import { Navbar } from '../component/navbar/navbar.component'

const MapLayout = ({children}: {children: ReactNode}) => {
  return (
    <html>
        <body className='w-screen'>
            <main className='w-full'>
                {children}
            </main>
            <Navbar />
        </body>
    </html>
  )
}

export default MapLayout