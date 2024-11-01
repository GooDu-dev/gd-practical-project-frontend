'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { ClientCookie } from '@/utils/cookies/cookies.client'
import MapServices from '@/services/maps/maps.services'
import common from '@/utils/common'
import { Destination, MapArray, MapData } from '@/services/maps/maps.interface'
import MapMarker from '../component/map/map.room'
import NavigatorService from '@/services/navigator/navigate.services'
import { GetMapFromCookie, handleUserRoute } from './maps.page.services'
import TrackingService from '@/services/tracking/tracking.services'
import { GISData, Position, Coordinate } from '@/services/tracking/tracking.interface'

export default function MapPage() {

  const [destination, setDestination] = useState<Destination | undefined>(undefined);
  const [maps, setMaps] = useState<MapData | undefined>(undefined);
  const [route, setRoute] = useState<[number, number][]>([])
  const [location, setLocation] = useState<GISData>()
  const [position, setPosition] = useState<[Position, Position, Position]>()
  
  let trackingService: TrackingService;
  let navigatorService: NavigatorService;
  let positionIndex = 0;


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

        let start: [number, number] = [26, 21]
        let target: [number, number] = [30, 5]
        navigatorService = new NavigatorService(map, mapArray, start, target)
        let route = await navigatorService.findRoute()
        setRoute(route)
        console.log("route:", route)

        trackingService = new TrackingService(map.floor_id, map.size_x, map.size_y)
        await trackingService.initTrackingService()

        const lct = {
          etat: {
            lat: 13.728911975717,
            lng: 100.780312140992
          },
          chair: {
            lat: 13.728992796838,
            lng: 100.7800228170451
          },
          KDAI: {
            lat: 13.728931,
            lng: 100.7801104
          }
        }

        let {x, y} = trackingService.changeGISToCoordinate(lct.KDAI)
        x = Math.round(x)
        y = Math.round(y)

        console.log("x:",x , "y:", y)
      })()

      if (typeof window === "undefined" && !("geolocation" in navigator)) {
        return
      }
      console.log("window", window)
      navigator.geolocation.watchPosition( position => {
        const { latitude, longitude } = position.coords
        let data: GISData = {
          lat: latitude,
          lng: longitude
        }
        setLocation(data)
      }, (err) => {
        console.log(err)
      }, {
        enableHighAccuracy: true
      })
  }, [])

  useEffect(() => {
    let gis: GISData = {lat: location!.lat, lng: location!.lng}
    let crdn: Coordinate = trackingService.changeGISToCoordinate(gis)
    console.log('current_pos:', gis)
    if (position?.length != 3) {
      position?.push({
        gis: gis,
        crdn: crdn
      })
    }
    else {
      position[positionIndex] = {
        gis: gis,
        crdn: crdn
      }
    }
    positionIndex++
    positionIndex %= 3
  }, [location])

  useEffect(() => {
    handleUserRoute(route, position!, navigatorService)
  }, [position])

  return (
      <h1>Hello world</h1>
  )
}