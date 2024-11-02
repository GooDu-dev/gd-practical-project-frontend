
import NavigatorService from "@/services/navigator/navigate.services";
import { Route } from "@/services/navigator/navigator.interface";
import { Coordinate, Position } from "@/services/tracking/tracking.interface";
import TrackingService from "@/services/tracking/tracking.services";
import common from "@/utils/common";
import { ClientCookie } from "@/utils/cookies/cookies.client";
import { Console } from "console";

export function GetMapFromCookie(cookie: ClientCookie): [building: number, floor: number, room: number] {
    let building = +common.decode(cookie.getCookie('building'))
    let floor = +common.decode(cookie.getCookie('floor'))
    let room = +common.decode(cookie.getCookie('room'))

    return [building, floor, room]
}

export function handleUserRoute(route: [number, number][], position: [Position, Position, Position], service: NavigatorService): Promise<[number, number][]> {
    return new Promise<[number, number][]>(async (resolve, reject) => {

        

        resolve(route)
    })
}

export function averagePosition(position: [Position, Position, Position], ratio: number = 0.2): Position {
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
    let size = 0;
    let power = 1

    position.forEach(pos => {
        if(pos){
            total = {
                gis: {
                    lat: total.gis.lat + (pos.gis.lat * power),
                    lng: total.gis.lng + (pos.gis.lng * power),
                },
                crdn: {
                    x: total.crdn.x + (pos.crdn.x * power),
                    y: total.crdn.y + (pos.crdn.y * power)
                }
            }
            size++
            power -= ratio
        }
    })

    console.log("total:", total, "size:", size)

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

export function isOutOfRoute(pos1: Coordinate, pos2: Coordinate, size: number = 5){
    // check out from size
    if(pos2.x + size > pos1.x || pos2.x - size < pos1.x){
        return true
    }
    else if(pos2.y + size > pos1.y || pos2.y - size < pos1.y){
        return true
    }
    return false
}

export function findNearestPoint(points: [number, number][], pos1: Coordinate, size: number = 5): Coordinate{
    const heuristic = (pos1: Coordinate, pos2: Coordinate) => Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y)

    let min = 1000
    let crdn: Coordinate = pos1;
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

    return crdn
}

export function addPosition(positions: Position[], new_pos: Position, index: number) {
    if (positions?.length != 3) {
        positions?.push({
          gis: new_pos.gis,
          crdn: new_pos.crdn
        })
      }
      else {
        positions[index] = {
          gis: new_pos.gis,
          crdn: new_pos.crdn
        }
      }
}