import _axios from "@/utils/axios";
import { Room, Destination, MapData, MapArray, Area } from "./maps.interface";
import { MyError } from "@/utils/myerror";

class MapServices {

    private building_id: number;
    private floor_id: number;
    private room_id: number;
    private maps!: MapData;
    private destination!: Destination;
    private booths!: Area[];

    // map array
    private mapArray!: MapArray;

    constructor(building: number, floor: number, room: number){
        this.building_id = building
        this.floor_id = floor
        this.room_id = room
    }

    async initMapServices(){
        this.maps = await this.requestMapData()
        this.destination = await this.requestDestination()
        this.booths = await this.requestBooth()
        this.mapArray = await this.initMapArray()
    }

    private requestMapData(): Promise<MapData> {
        return new Promise<MapData>( async (resolve, reject) => {
            let data = {
                building: this.building_id,
                floor: this.floor_id
            }
            const response = await _axios.get('/maps', data)
            if (response instanceof MyError) {
                console.log(response)
                reject(response)
            }

            let maps: MapData = {
                floor_id: response['floor_id'],
                floor_name: response['floor_name'],
                rooms: [],
                danger_zone: [],
                size_x: response['size_x'],
                size_y: response['size_y']
            }
            for (let room of response['rooms']) {
                let r: Room = this.createRoom(room)
                maps.rooms.push(r)
            }
            
            for (let danger_zone of response['unwalkable_zone']) {
                let dz: Room = this.createRoom(danger_zone)
                maps.danger_zone.push(dz)
            }

            resolve(maps)
        })
    }

    private requestDestination() : Promise<Destination> {
        return new Promise<Destination>( async (resolve, reject) => {
            let data = {
                booth: this.room_id
            }
        
            const response = await _axios.get('/search', data)
            if (response instanceof MyError) {
                console.log(response)
                reject(response)
            }
    
            const res_room = response['area'][0]
            let dest: Destination = {
                building_id: response['building_id'],
                name: response['name'],
                latitude: response['latitude'],
                longitude: response['longitude'],
                area: {
                    ...this.createArea(res_room), 
                    floor: { 
                        id: res_room['floor']['floor_id'], 
                        name: res_room['floor']['floor']
                    }
                }, 
            }
            resolve(dest)
        })
    }

    private requestBooth(): Promise<Area[]> {
        return new Promise<Area[]>(async (resolve, reject) => {
            let data = {
                building: this.building_id,
                floor: this.floor_id
            }
            let uri = '/maps/booths'

            let response = await _axios.get(uri, data)
            if(response instanceof MyError){
                reject(response)
            }
            
            let areas: Area[] = []
            for(let res of response){
                let a: Area = this.createArea(res)
                areas.push(a)
            }

            resolve(areas)
        })
    }

    private initMapArray(): Promise<MapArray> {
        return new Promise<MapArray>(async (resolve, reject) => {
            let map = this.maps
            if(!map){
                reject(MyError.InternalServerError)
            }
            
            
            let col = Number(map.size_x)
            let row = Number(map.size_y)
            let mapArray = new Uint8Array((row + 1) * (col + 1))
            
            let m: MapArray = {
                data: mapArray,
                row: row,
                column: col
            }
            
            // set room as unwalkable area
            // set only room's border
            for (let room of this.maps.rooms) {
                let width = room.width
                let height = room.height
                let top = room.y
                let left = room.x
                
                // set left border // west
                await this.setAreaType(top, left, left, top + height, 1, m)
                // set right border // east
                await this.setAreaType(top, left + width, left + width, top + height, 1, m)
                // set top border // north
                await this.setAreaType(top, left, left + width, top, 1, m)
                // set bottom borDer // south
                await this.setAreaType(top + height, left, left + width, top + height, 1, m)
                
                // set entrances
                if (room.entrances) {
                    for(let ent of room.entrances) {
                        let x = ent.x
                        let y = ent.y
                        await this.setPointType(y, x, 4, m)!
                    }
                }
            }
            
            // set unwalkable area
            for (let dz of this.maps.danger_zone) {
                let width = dz.width
                let height =dz.height
                let top = dz.y
                let left = dz.x
                let areaType = 1

                // change number in map for each area_type
                switch (dz.area_type) {
                    case "connector":
                        areaType = 2
                        break
                    case "restroom":
                        areaType = 3
                        break
                }

                this.setAreaType(top, left, left + width, top + height, areaType, m)
                
                // set entrances
                if (dz.entrances) {
                    for (let ent of dz.entrances) {
                        let x = ent.x
                        let y = ent.y
                        this.setPointType(y, x, 4, m)!
                    }
                }
            }

            // hardcode
            await this.setAreaType(31, 12, 16, 31, 0, m)
            
            for(let booth of this.booths) { 
                let width = booth.width
                let height = booth.height
                let top = booth.y
                let left = booth.x
                let area_type = 5
                
                this.setAreaType(top, left, left + width, top + height, area_type, m)
            }
            
            await this.setPointType(16, 31, 0, m)
            this.printMap(m)

            resolve(m)
        })
    }
    
    getMapData(): MapData {
        return this.maps
    }
    getDestination(): Destination {
        return this.destination
    }
    
    getMapArray(): MapArray {
        return this.mapArray;
    }
    
    static getIndex(row: number, col: number, col_size: number): number {
        return row * col_size + col
    }
    
    /**
     * 0 : Walkable
     * 1 : Unwalable - danger_zone
     * 2 : connector
     * 3 : restroom
     * 4 : entrance
    */
    private setAreaType(top: number, left: number, right: number, bottom: number, areaType: number = 1, map?: MapArray): Promise<MapArray> {
       return new Promise((resolve, reject) => {
           let m: MapArray; 
           if (map) {
               m = map
            }
            else {
                m = this.mapArray
            }
            
            if(!m) reject(null)
            
            // check the area length
            if (bottom > m.row || right > m.column) {
                bottom = Math.min(bottom, m.row)
                right = Math.min(right, m.column)
            }
            
            // fill the area
            for (let i = top; i < bottom + 1; i++) {
                for (let j = left; j < right + 1; j++) {
                    let data = m.data[MapServices.getIndex(i, j, m.column)]
                    // ignore the others room's door
                    if (data == 4) {
                        continue
                    }
                    m.data[MapServices.getIndex(i, j, m.column)] = areaType
                }
            }
            
            resolve(m)
       })
    }
    
    private setPointType(row: number, col: number, areaType: number = 1, map?: MapArray): Promise<MapArray> {
        return new Promise((resolve, reject) => {
            let m: MapArray
           if (map) {
               m = map
            }
            else {
                m = this.mapArray
            }

            if(!m) reject(null)
                
            // check the point bounds
            if (row > m.row || col > m.column) {
                resolve(m)
            }
            
            // fill the point
            m.data[MapServices.getIndex(row, col, m.column)] = areaType
    
           resolve(m)
        })
    }

    printMap(map: MapArray = this.mapArray) {
        for(let r = 0; r < map.row; r++){
            let s = `${(""+r).padStart(2, ' ')} | `
            let style: string[] = []
            for (let c = 0; c < map.column; c++) {
                let index = r * map.column + c
                let data = map.data[index]
                switch(data) {
                    case 0:
                        style.push("color: #4CAF50;")
                        break
                    case 1:
                        style.push("color: #FF6B6B;")
                        break
                    case 2:
                        style.push("color: #FFEB3B;")
                        break
                    case 3:
                        style.push("color: #FF80AB;")
                        break
                    case 4:
                        style.push("color: #FFB74D;")
                        break
                    default:
                        style.push("color: white;")
                        break;
                }
                s += `%c${data}`
            }
            console.log(s, ...style)  
        }
    }

    toString(map: MapArray = this.mapArray): string[] {
        let output = []
        for (let r = 0; r < map.row; r++) {
            let s = ""
            for (let c = 0; c < map.column; c++) {
                let index = r * map.column + c
                s += map.data[index] + " "
            }
            output.push(s)  
        }

        return output
    }

    private createRoom(data: any): Room {
        return {
            id: data['area_id'],
            name: data['name'],
            latitude: data['latitude'],
            longitude: data['longtitude'],
            width: data['width'],
            height: data['height'],
            area_type: data['area_type'],
            x: data['x'],
            y: data['y'],
            in_area_id: data['in_area_id'],
            entrances: (data['entrances'] || []).map((ent: any) => this.createArea(ent))
        }
    };
    private createArea(data: any): Area {
        return {
            id: data['area_id'],
            name: data['name'],
            latitude: data['latitude'],
            longitude: data['longtitude'],
            width: data['width'],
            height: data['height'],
            area_type: data['area_type'],
            x: data['x'],
            y: data['y'],
            in_area_id: data['in_area_id']
        }
    };
}

export default MapServices