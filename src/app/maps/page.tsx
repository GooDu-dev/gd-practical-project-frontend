'use client'
import React from 'react'
import { GetServerSideProps } from 'next'
import { ClientCookie } from '@/utils/cookies/cookies.client'
import { useRouter } from 'next/navigation'

function MapPage() {

  let cookie = new ClientCookie()
  let building = cookie.getCookie('building')

  return (
    <div>Map</div>
  )
}

export default MapPage