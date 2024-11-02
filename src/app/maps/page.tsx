'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { ClientCookie } from '@/utils/cookies/cookies.client'
import MapServices from '@/services/maps/maps.services'
import common from '@/utils/common'
import { Destination, MapArray, MapData } from '@/services/maps/maps.interface'
import MapMarker from '../component/map/map.room'
import NavigatorService from '@/services/navigator/navigate.services'
import { averagePosition, GetMapFromCookie, findNearestPoint, isOutOfRoute, addPosition } from './maps.page.services'
import TrackingService from '@/services/tracking/tracking.services'
import { GISData, Position, Coordinate } from '@/services/tracking/tracking.interface'
import Image from 'next/image'
import SvgMap from '../component/map/map.image'

export default function MapPage() {

  const [destination, setDestination] = useState<Destination | undefined>(undefined);
  const [maps, setMaps] = useState<MapData | undefined>(undefined);
  const [route, setRoute] = useState<[number, number][]>([])
  const [location, setLocation] = useState<GISData>({lat: 0, lng: 0})
  const [position, setPosition] = useState<Position[]>([])
  
  const [trackingService, setTrackingService] = useState<TrackingService | null>(null)
  const [navigatorService, setNavigatorService] = useState<NavigatorService | null>(null)
  const [positionIndex, setPositionIndex] = useState<number>(0)
  const [crdnPosition, setCrdnPosition] = useState<Coordinate>({x: 21, y: 28})

  useEffect(() => {
      (async () => {
        
        let cookie = new ClientCookie()
        const [building, floor, room] = GetMapFromCookie(cookie)

        let mapService = new MapServices(building, floor, room)
        await mapService.initMapServices()
        
        let dest = mapService.getDestination()
        let map = mapService.getMapData()
        setDestination(dest)
        setMaps(map)
        
        // show map in console
        let mapArray = await mapService.getMapArray()
        mapService.printMap(mapArray)

        let start: [number, number] = [21, 28]
        let target: [number, number] = [8, 31]
        let navigatorService = new NavigatorService(map, mapArray, start, target)
        setNavigatorService(navigatorService)

        let route = await navigatorService.findRoute()
        setRoute(route)
        console.log("route:", route)

        let trackingService = new TrackingService(map.floor_id, map.size_x, map.size_y)
        setTrackingService(trackingService)
        
        await trackingService.initTrackingService()

        // const lct = {
        //   etat: {
        //     lat: 13.728911975717,
        //     lng: 100.780312140992
        //   },
        //   chair: {
        //     lat: 13.728992796838,
        //     lng: 100.7800228170451
        //   },
        //   KDAI: {
        //     lat: 13.728931,
        //     lng: 100.7801104
        //   }
        // }

        // let {x, y} = trackingService.changeGISToCoordinate(lct.KDAI)
        // x = Math.round(x)
        // y = Math.round(y)

        // console.log("x:",x , "y:", y)
      })()

      if (typeof window === "undefined" && !("geolocation" in navigator)) {
        return 
      }

      let watchId = navigator.geolocation.watchPosition( position => {
        const { latitude, longitude } = position.coords
        let data: GISData = {
          lat: latitude,
          lng: longitude
        }
        setLocation(data)

        console.log("data: GISData", data)
        
      }, (err) => {
        console.log(err)
      }, {
        enableHighAccuracy: true,
        timeout: 5000
      })

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
  }, [])

  useEffect(() => {
    if(!location || !trackingService){
      return
    }

    let gis: GISData = {lat: location!.lat, lng: location!.lng}
    let crdn: Coordinate = trackingService.changeGISToCoordinate(gis)
    let pos3: Position[] = position

    console.log('current_pos:', gis, 'positionIndex:', positionIndex)

    addPosition(position, { gis: gis, crdn: crdn }, positionIndex)

    let index = positionIndex
    index++
    index %= 3
    setPositionIndex(index)
    setPosition(pos3)

    console.log(position)

  }, [location])
  
  useEffect( () => {
    console.log("position:", position)
    
    if(!position || !navigatorService){
      return
    }
    
    if(!trackingService){
      return
    }
    
    let pos = averagePosition([position[0], position[1], position[2]])
    let point = findNearestPoint(route, pos.crdn)
    
    console.log('handleUserRoute:: \npos:', pos, 'point:', point);
    
    (async () => {
      if (isOutOfRoute(point, pos.crdn)) {
        console.log('out from route')
        await navigatorService.setStart([Math.round(pos.crdn.x), Math.round(pos.crdn.y)])
        console.log(navigatorService.getStart())
        let r = await navigatorService.findRoute()
        setRoute(r)
      }
      else {
        setCrdnPosition(point)
      }

    })()
    
    console.log('useEffect:pos', pos)
    setCrdnPosition(pos.crdn)
  }, [positionIndex])

  return (
    <Suspense>
      <SvgMap
        width={1700}
        height={1950}
        position={crdnPosition}
      />
    </Suspense>
  )
}