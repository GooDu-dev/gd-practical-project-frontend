import { MyError } from "@/utils/myerror";
import myaxios from "@/utils/axios";
import { rejects } from "assert";

export interface Building {
    id: number,
    name: string
}
export interface Floor {
    id: number,
    name: string
}

export interface Room {
    id: number,
    name: string,
    floor: string
}

export interface FormAnswer {
    building?: Building,
    floor?: Floor,
    room?: Room
}

const getBuildingList = () : Promise<Building[]> => {
    return new Promise( async (resolve, reject) => {
        const building_number = 5;

        const response = await myaxios.get("/search/buildinglist", {count: building_number})
        if(response instanceof MyError){
            reject(response)
        }

        let building: Building[] = []
        for (let res of response) {
            building.push({id: res['building_id'], name: res['building_name']})
        }
        resolve(building)  
    })
}

const getFloorList = ({
    building_id
} : {
    building_id: number
}) : Promise<Floor[]> => {
    return new Promise( async (resolve, reject) => {
        const response = await myaxios.get("/search/floorlist", {building: building_id})
        if(response instanceof MyError){
            reject(response)
        }
        let floor: Floor[] = []
        for(let res of response){
            floor.push({id: res['floor_id'],name: res['floor']})
        }
        resolve(floor)
    })
}

const getRoomList = ({
    building_id,
    floor,
} : {
    building_id: number,
    floor?: string
}): Promise<Room[]> => {
    return new Promise( async (resolve, reject) => {
        if(building_id == 0) return {room_list: [], error: undefined}
        
        let data: {} = {
            building: building_id
        }
        if(floor) data = {...data, floor: floor}
        const response = await myaxios.get('/search/roomlist', data)
        if(response instanceof MyError){
            reject(response)
        }
        let room_Lists: Room[] = []
        for(let res of response){
            let room: Room = {
                id: res['room_id'],
                name: res['room_name'],
                floor: res['room_floor']
            }
            room_Lists.push(room)
        }
        resolve(room_Lists)
    })
}

export default { getBuildingList, getRoomList, getFloorList }