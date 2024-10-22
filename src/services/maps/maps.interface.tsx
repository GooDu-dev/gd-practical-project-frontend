export interface Maps{
    floor_id: number,
    floor_name: string,
    size_x: number,
    size_y: number,
    rooms: Area[]
    danger_zone: Area[]
}
export interface Area{
    id: number,
    name: string,
    latitude: string,
    longitude: string,
    width: number,
    height: number,
    area_type: string
}

export interface Destination{
    building_id: number,
    name: string,
    latitude: string,
    longitude: string,
    area: Room
}
interface Room{
    id: number,
    name: string,
    latitude: string,
    longitude: string,
    width: number,
    height: number,
    floor: Floor,
    area_type: string
}
interface Floor{
    id: number,
    name: string
}