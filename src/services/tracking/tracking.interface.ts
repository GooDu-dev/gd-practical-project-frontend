export interface Position {
    gis: GISData
    crdn: Coordinate
}

export interface GISData {
    lat: number
    lng: number
}

export interface Coordinate {
    x: number 
    y: number
}