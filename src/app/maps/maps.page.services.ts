
import NavigatorService from "@/services/navigator/navigate.services";
import { Route } from "@/services/navigator/navigator.interface";
import { Coordinate, Position } from "@/services/tracking/tracking.interface";
import TrackingService from "@/services/tracking/tracking.services";
import common from "@/utils/common";
import { ClientCookie } from "@/utils/cookies/cookies.client";

export function GetMapFromCookie(cookie: ClientCookie): [building: number, floor: number, room: number] {
    let building = +common.decode(cookie.getCookie('building'))
    let floor = +common.decode(cookie.getCookie('floor'))
    let room = +common.decode(cookie.getCookie('room'))

    return [building, floor, room]
}

export function handleUserRoute(route: [number, number][], position: [Position, Position, Position], service: NavigatorService): Promise<[number, number][]> {
    return new Promise<[number, number][]>(async (resolve, reject) => {

        let pos = averagePosition(position)
        let point = findNearestPoint(route, pos.crdn)
        
        if (isOutOfRoute(point, pos.crdn)) {
            console.log('out from route')
            service.setStart([pos.crdn.x, pos.crdn.y])
            route = await service.findRoute()
        }
        resolve(route)
    })
}

function averagePosition(position: [Position, Position, Position]): Position {
    let total: Position = {
        gis: {
            lat: 0,
            lng: 0
        },
        crdn: {
            x: 0,
            y: 0
        }
    }
    let size = position.length;

    position.forEach(pos => {
        total = {
            gis: {
                lat: total.gis.lat + pos.gis.lat,
                lng: total.gis.lng + pos.gis.lng,
            },
            crdn: {
                x: total.crdn.x + pos.crdn.x,
                y: total.crdn.y + pos.crdn.y
            }
        }
    })

    total = {
        gis: {
            lat: total.gis.lat / size,
            lng: total.gis.lng / size
        },
        crdn: {
            x: total.crdn.x / size,
            y: total.crdn.y / size
        }
    }

    return total
}

function isOutOfRoute(pos1: Coordinate, pos2: Coordinate, size: number = 5){
    if(pos2.x + size > pos1.x || pos2.x - size < pos1.x){
        return true
    }
    else if(pos2.y + size > pos1.y || pos2.y - size < pos1.y){
        return true
    }
    return false
}

function findNearestPoint(points: [number, number][], pos1: Coordinate, size: number = 5): Coordinate{
    const heuristic = (pos1: Coordinate, pos2: Coordinate) => Math.abs(pos1.x - pos2.x) - Math.abs(pos1.y - pos2.y)

    let min = 1000
    let crdn: Coordinate;
    points.forEach(point => {
        let h = heuristic({x: point[1], y: point[0]}, pos1)
        if(min > h){
            min = h
            crdn = {
                x: point[1],
                y: point[0]
            }
        }
    })

    return crdn!
}