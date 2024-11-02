'use client'
import MapServices from '@/services/maps/maps.services'
import NavigatorService from '@/services/navigator/navigate.services'
import TrackingService from '@/services/tracking/tracking.services'
import { ClientCookie } from '@/utils/cookies/cookies.client'
import React, { useState, useEffect, useRef } from 'react'
import { GetMapFromCookie } from '../maps/maps.page.services'
import { Destination, MapData } from '@/services/maps/maps.interface'
import { Route } from '@/services/navigator/navigator.interface'
import { describeRoute } from './map.v2.services'
import { RouteDescription } from './map.v2.interface'
import Image from 'next/image'
import { Coordinate } from '@/services/tracking/tracking.interface'
import MapLine from '../component/map/map.line'
import ReactDOM from 'react-dom'

const MapV2Page = () => {

    let [mapServices, setMapService] = useState<MapServices>()
    let [navigatorService, setNavigatorService] = useState<NavigatorService>()
    let [route, setRoute] = useState<[number, number][]>([])
    let [currentDes, setCurrentDes] = useState<Coordinate>()
    let [routeDes, setRouteDes] = useState<RouteDescription[]>()    

    // init value
    useEffect(() => {
        (async () => {
            let cookie = new ClientCookie()
            const [building, floor, room] = GetMapFromCookie(cookie)

            let ms = new MapServices(building, floor, room)
            await ms.initMapServices()
            
            let md: MapData = ms.getMapData()
            let ts = new TrackingService(floor, md.size_x, md.size_y)
            await ts.initTrackingService()



            let ma = ms.getMapArray()
            let start: [number, number] = [21, 28]
            let dest: Destination = ms.getDestination()
            let target: [number, number] = [dest.area.x, dest.area.y]
            let ns = new NavigatorService(md, ma, start, target)
        
            setMapService(ms)
            setNavigatorService(ns)
        })()
    }, [])

    // create map
    useEffect(() => {

        if(!navigatorService || !mapServices){
            return
        }

        navigatorService.findRoute().then(r => {
            console.log("route:", r)
            setRoute(r)

            let current = r[0]
            let mp = mapServices.getMapData()
            let width = mp.size_x
            let height = mp.size_y
            console.log("current: ", current)
            console.log("width: ", width, 'height', height)
            console.log("x: ", current[1] / width, 'y', current[0] / height)
            let x =  Math.ceil(current[0] / height * 100) // x
            let y =  Math.ceil(current[1] / width * 100) // y

            setCurrentDes({x: x, y: y})
        })

    }, [navigatorService])

    useEffect(() => {

        let des = describeRoute(route)
        console.log(des)
        setRouteDes(des)
        
    }, [route])

  return (
    <div className='flex flex-col'>
        <div className='w-screen overflow-hidden relative'>
            <div className="absolute"
                style={{
                    top: `${currentDes?.x}%`,
                    left: `${currentDes?.y}%`,
                }}>
                <Image  
                    src='/marker-icon.png'
                    width={25}
                    height={25}
                    alt='map marker'
                />
            </div>
            {/* <div 
                className='relative w-full h-full'
                style={{
                    top: `${currentDes?.x}%`,
                    left: `${currentDes?.y}%`,
                }}> */}
                {routeDes && (
                    routeDes.map((rd, index) => {

                        let d = rd.direction
                        let dg = 0
                        let s = 1
                        let md = mapServices!.getMapData()
                        let pos = rd.position
                        let top = 0, left = 0
                        if(d == "up" || d == "down"){
                            dg = 90
                            s = Math.ceil((rd.count / md.size_y) * 100)

                            top = d == "down" ? Math.ceil(((pos.y - rd.count) / md.size_y) * 100) : Math.ceil((pos.y / md.size_y) * 100) 
                            left = Math.ceil((pos.x / md.size_x) * 100)
                        }
                        else if(d == "left" || d == "right"){
                            dg = 0
                            s = Math.ceil((rd.count / md.size_x) * 100)
                            
                            top = Math.ceil((pos.y / md.size_y) * 100)
                            left = d == "right" ? Math.ceil(((pos.x - rd.count) / md.size_x) * 100) : Math.ceil((pos.x / md.size_x) * 100) 
                        }


                        return <MapLine
                            key={index}  
                            degree={dg}
                            size={s}  
                            start={{top:top, left:left}}
                        />
                    })
                )}
            {/* </div> */}
            <Image
                className='w-full'
                src="/map.svg"
                width={1700}
                height={1950}
                alt='wunnyGo map'
            />
        </div>
        {/* <div>
           {routeDes && (
            routeDes.map(rd => {
                let text = ["ให้หันหน้าไปตามทางของเส้น"]

                while(rd){

                }

                return <h3>{text}</h3>
            })
           )} 
        </div> */}
    </div>
  )
}

export default MapV2Page