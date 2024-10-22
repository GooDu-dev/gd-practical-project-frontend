import _axios from "@/utils/axios";
import { Area, Destination, Maps } from "./maps.interface";
import { MyError } from "@/utils/myerror";

class MapServices {

    private building_id: number;
    private floor_id: number;
    private room_id: number;
    private maps!: Maps;
    private destination!: Destination;

    constructor(building: number, floor: number, room: number){
        this.building_id = building
        this.floor_id = floor
        this.room_id = room
    }

    async initMapAndDest(){
        this.maps = await this.requestMap()
        this.destination = await this.requestDestination()
    }

    private requestMap(): Promise<Maps> {
        return new Promise<Maps>( async (resolve, reject) => {
            let data = {
                building: this.building_id,
                floor: this.floor_id
            }
            const response = await _axios.get('/maps', data)
            if(response instanceof MyError){
                console.log(response)
                reject(undefined)
            }
    
            let maps: Maps = {
                floor_id: response['floor_id'],
                floor_name: response['floor_name'],
                rooms: [],
                danger_zone: [],
                size_x: response['size_x'],
                size_y: response['size_y']
            }
            for(let room of response['rooms']){
                let r: Area = {
                    id: room['area_id'],
                    name: room['name'],
                    latitude: room['latitude'],
                    longitude: room['longtitude'],
                    width: room['width'],
                    height: room['height'],
                    area_type: room['area_type']
                }
                maps.rooms.push(r)
            }
            for(let danger_zone of response['danger_zone']){
                let dz: Area = {
                    id: danger_zone['area_id'],
                    name: danger_zone['name'],
                    latitude: danger_zone['latitude'],
                    longitude: danger_zone['longtitude'],
                    width: danger_zone['width'],
                    height: danger_zone['height'],
                    area_type: danger_zone['area_type']
                }
                maps.danger_zone.push(dz)
            }
            resolve(maps)
        })
    }

    private requestDestination() : Promise<Destination> {
        return new Promise<Destination>( async (resolve, reject) => {
            let data = {
                room: this.room_id
            }
        
            const response = await _axios.get('/search', data)
            if(response instanceof MyError){
                console.log(response)
                reject()
            }
    
            const res_room = response['area'][0]
            let dest: Destination = {
                building_id: response['building_id'],
                name: response['name'],
                latitude: response['latitude'],
                longitude: response['longitude'],
                area: {
                    id: res_room['area_id'],
                    name: res_room['name'],
                    latitude: res_room['latitude'],
                    longitude: res_room['longitude'],
                    width: res_room['width'],
                    height: res_room['height'],
                    floor: {
                        id: res_room['floor']['floor_id'],
                        name: res_room['floor']['floor'],
                    },
                    area_type: res_room['area_type']
                }
            }
            resolve(dest)
        })
    }

    getMap(): Maps {
        return this.maps
    }
    getDestination(): Destination {
        return this.destination
    }

}

export default MapServices