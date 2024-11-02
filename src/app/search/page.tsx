'use client'

import common from '@/utils/common'
import { ClientCookie } from '@/utils/cookies/cookies.client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const SearchPage = () => {
  let router = useRouter()

    useEffect(() => {
        let cookie = new ClientCookie()
        cookie.setCookie('building', common.encode('3'))
        cookie.setCookie('floor', common.encode('1'))
        cookie.setCookie('room', common.encode('96'))

        router.push('/maps-v2')
    })
  
    return (
        <>
            <h1>This is a prototype, there are some error</h1>
        </>
    )
}

export default SearchPage