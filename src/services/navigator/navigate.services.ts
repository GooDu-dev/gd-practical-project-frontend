import { Area, MapArray, MapData, Room } from '../maps/maps.interface'
import { Route, Point } from './navigator.interface';
import MinHeap from '../../utils/class/minheap';
import { MyError } from '../../utils/myerror'
import { aStar } from './navigate.aStar'

class NavigatorService {
    private mapData: MapData
    private map: MapArray;
    private route!: Route
    private target: [number, number]
    private start: [number, number]

    constructor(mapData: MapData, map: MapArray, start: [number, number], target: [number, number]) {
        this.mapData = mapData
        this.map = map
        this.route = {
            queue: [],
            visited: new Uint8Array((map.row + 1) * (map.column + 1)),
            start: this.findCurrentRoom(mapData.rooms, start),
            target: this.findCurrentRoom(mapData.rooms, target)
        }
        this.target = target
        this.start = start
    }

    findRoute(): Promise<[number, number][]> {
        return new Promise<[number, number][]>(async (resolve, reject) => {

            // let entrances = await this.findEntrances()
            let start: [number, number] = [this.start[1], this.start[0]]
            let target: [number, number] = [this.target[1], this.target[0]]
            
            let path = aStar(this.map, start, target)

            console.log("path:", path)

            if(path.length == 0){
                reject()
            }
            
            this.route.queue.push(...path)

            resolve(this.route.queue)

        })
    }

    getStart(): [number, number] {
        return this.start
    }

    setStart(start: [number, number]) {
        this.start = start
    }

    private findEntrances(): Promise<Area[]> {
        return new Promise<Area[]>((resolve, reject) => {
            
            if (!this.route.start || !this.route.target) {
                reject(null)
            }

            const start: Room = this.route.start!
            const target: Room = this.route.target!
            let entrances: Area[] = target.entrances
            let container_entrances: Area[] = []

            // if start != target and target.entrance is valid then find entrances
            while (entrances && entrances.length > 0 && start != target) {
                // find the shortest entrances
                let ent = this.findShortestEntrance(entrances, [start.x, start.y])
                container_entrances.push(ent)

                // entrances is not in any area -> ent is invalid
                if (!ent.in_area_id) break;

                // room represent of door's room
                let room = this.findRoom(ent.in_area_id)
                // check that if ent.in_area_id is link to invalid room -> ent is invalid
                if(!room) break;
                
                // check that the room is inside another room or not
                if(!room.in_area_id){
                    // the room is not in any room -> no need to find next entrances
                    break    
                }

                // find parent room when room is inside another room
                let parent_area = this.findRoom(room.in_area_id)
                // if parent_area is invalid -> cannot find next entrances
                if (!parent_area) break
                // set entrances to parent room's entrances
                entrances = parent_area.entrances
            }

            resolve(container_entrances)
        })
    }

    getIndex(row: number, col: number, col_size: number = this.map.column): number {
        return row * col_size + col
    }

    
    private heuristic(p1: [number, number], p2: [number, number]): number {
        return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1])
    }
    private findShortestEntrance(entrances: Area[], current_position: [number, number]): Area {
        let area: Area;
        let min = 1000;
        for (let ent of entrances) {
            let ent_pos: [number, number] = [ent.x, ent.y]
            let hx = this.heuristic(current_position, ent_pos)
            if (min > hx) {
                min = hx
                area = ent
            }
        }
        return area!

    }

    private findCurrentRoom(rooms: Room[], current_position: [number, number]): Room | null {
        let r: Room | null = null
        
        for (let room of rooms) {
            let top = room.y
            let left = room.x
            let width = room.width
            let height = room.height

            let right = left + width
            let bottom = top + height

            let x = current_position[0], y = current_position[1]
            if (left <= x && x <= right && top <= y && y <= bottom) {
                r = room
                break
            }
        }

        if (r) {
            return r
        }
        else{
            return null
        }
    }

    private findRoom(in_area_id: number): Room | undefined {
        let r: Room | undefined = this.mapData.rooms.find(room => room.id == in_area_id)
        return r
    }

}

export default NavigatorService