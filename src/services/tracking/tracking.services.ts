import _axios from "@/utils/axios";
import MapServices from "../maps/maps.services";
import { MyError } from "@/utils/myerror";
import { Position, GISData, Coordinate } from "./tracking.interface";

class TrackingService {

    private floor_id: number;
    private bounds!: Position[];

    private width: number;
    private height: number;

    private lngRatio: number = 1;
    private latRatio: number = 1;

    constructor(floor_id: number, width: number, height: number) {
        this.floor_id = floor_id
        this.width = width
        this.height = height
    }

    async initTrackingService(width: number=this.width, height: number=this.width) {
        this.bounds = await this.requestBoundGIS(this.floor_id, width, height)
        this.latRatio = Math.abs(( this.bounds[3].gis.lat - this.bounds[0].gis.lat ) / height) 
        this.lngRatio = Math.abs(( this.bounds[3].gis.lng - this.bounds[0].gis.lng ) / width) 
    }

    getBounds(): Position[] {
        return this.bounds
    }

    trackingPosition() {
        
    }

    changeGISToCoordinate(gis: GISData, width: number=this.width, height: number=this.height): Coordinate {

        //! OPTIMIZED LATER

        const [top_left, top_right, bottom_left, bottom_right] = this.bounds
        
        console.log("gis:", gis)
        console.log("width:", width, "height:", height)

        let lat_diff = Math.abs(gis.lat - top_left.gis.lat)
        let lng_diff = Math.abs(gis.lng - top_left.gis.lng)
        let lat_full_diff = Math.abs(bottom_left.gis.lat - top_left.gis.lat)
        let lng_full_diff = Math.abs(top_right.gis.lng - top_left.gis.lng)
        
        // console.log("diff (lng, lat)", lng_diff, lat_diff)
        // console.log("full diff (lng, lat)", lng_full_diff, lat_full_diff)

        let x = (lng_diff / lng_full_diff) * width
        let y = (lat_diff / lat_full_diff) * height

        x = Math.min(x, width)
        y = Math.min(y, height)

        return { x: x, y: y };
    }

    private requestBoundGIS(floor_id: number, width: number, height: number): Promise<[Position, Position, Position, Position]> {
        return new Promise<[Position, Position, Position, Position]>( async (resolve, reject) => {
            let data = {
                floor: floor_id
            }
            let uri: string = '/maps/bounds/gis'

            const response = await _axios.get(uri, data)
            if (response instanceof MyError) {
                console.log(response)
                reject(response)
            }

            let positions: [Position, Position, Position, Position] = [
                { gis: { lat: 0, lng: 9 }, crdn: { x: 0, y: 0 } }, // top left
                { gis: { lat: 0, lng: 9 }, crdn: { x: width, y: 0 } }, // top right
                { gis: { lat: 0, lng: 9 }, crdn: { x: 0, y: height } }, // bottom left
                { gis: { lat: 0, lng: 9 }, crdn: { x: width, y: height } }, // bottom right
            ]

            const gis = response['gis']
            for (let index in positions) {
                positions[index].gis = {
                    lat: Number(gis[index]['lat']),
                    lng: Number(gis[index]['lng'])
                }
            }

            console.log(positions)
            resolve(positions)
        })
    }
}

export default TrackingService