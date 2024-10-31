export interface MapData{
    floor_id: number,
    floor_name: string,
    size_x: number,
    size_y: number,
    rooms: Room[]
    danger_zone: Room[]
}
export interface Area{
    id: number,
    name: string,
    latitude: string,
    longitude: string,
    width: number,
    height: number,
    area_type: string,
    x: number,
    y: number,
    in_area_id: number
}

export interface Destination{
    building_id: number,
    name: string,
    latitude: string,
    longitude: string,
    area: Area & { floor: Floor }
}
interface Floor{
    id: number,
    name: string
}

export interface MapArray {
    data: Uint8Array,
    row: number,
    column: number
}

export interface Room extends Area {
    entrances: Area[]
}