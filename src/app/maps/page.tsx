'use client'
import React, { useEffect, useState } from 'react'
import { ClientCookie } from '@/utils/cookies/cookies.client'
import MapServices from '@/services/maps/maps.services'
import common from '@/utils/common'
import { Destination, Maps } from '@/services/maps/maps.interface'

export default function MapPage() {

  const [destination, setDestination] = useState<Destination | undefined>(undefined);
  const [maps, setMaps] = useState<Maps | undefined>(undefined);

  useEffect(() => {
      (async () => {
        let cookie = new ClientCookie()
        let building = +common.decode(cookie.getCookie('building'))
        let floor = +common.decode(cookie.getCookie('floor'))
        let room = +common.decode(cookie.getCookie('room'))
      
        let mapService = new MapServices(building, floor, room)
        await mapService.initMapAndDest()
  
        let dest = mapService.getDestination()
        let map = mapService.getMap()
      
        setDestination(dest)
        setMaps(map)
        console.log(dest, map)
      })()
  }, [])

  return (
    <div>
      {maps && <h1>{JSON.stringify(maps)}</h1>}
      {destination && <h1>{JSON.stringify(destination)}</h1>}
    </div>
  )
}