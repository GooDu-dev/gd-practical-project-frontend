"use client"
import React, { useState, useEffect } from "react";
import SearchBar from "./form.input";
import formServices, {Room, Building, Floor, FormAnswer} from "./form.services";
import { MyError } from "@/utils/myerror";
import { ClientCookie } from "@/utils/cookies/cookies.client";
import { useRouter } from "next/navigation";
import common from "@/utils/common";

export default function SearchForm(){
    let [buildings, setBuildings] = useState<Building[]>();
    let [room_list, setRoomList] = useState<Room[]>()
    let [floors, setFloorList] = useState<Floor[]>()
    let [target, setTarget] = useState<FormAnswer>()

    const router = useRouter()

    useEffect(() => {
        if(!buildings){
            initDataInForm()
        }
    })

    const initDataInForm = async () => {
        const building = await formServices.getBuildingList()
        if(building instanceof MyError){
            throw building
        }
        await setBuildings(building)
    }

    const handleBuildingBlur = async (building_id: string) => {
        if(!buildings) return

        let id = Number(common.decode(building_id))
        const building = await buildings.find(building => building.id == id)
        if(!building) return
        
        setTarget({
            building: building,
            floor: target?.floor,
            room: target?.room
        })
        
        const floor = await formServices.getFloorList({building_id: building.id})
        await setFloorList(floor)
        const rooms = await formServices.getRoomList({building_id: building.id})
        await setRoomList(rooms)
    }
    const handleFloorBlur = (floor_id: string) => {
        let id = Number(common.decode(floor_id))
        const floor = floors?.find(f => f.id == id)
        if(!floor) return

        setTarget({
            building: target?.building,
            floor: floor,
            room: target?.room
        })
        
    }

    const handleRoomBlur = (room_id: string) => {
        let id = Number(common.decode(room_id))
        const room = room_list?.find(r => r.id == id)

        if(!room) return

        setTarget({
            building: target?.building,
            floor: target?.floor,
            room: room
        })
    }
    const goToMaps = () => {
        if(!target?.building || !target.room){
            // alert error
            return
        }
        let data = {
            building: common.encode(target?.building?.id),
            room: common.encode(target?.room?.id),
            floor: common.encode(target?.floor?.id)
        }
        let cookie = new ClientCookie()
        
        cookie.setCookie("building", data.building)
        cookie.setCookie("room", data.room)
        cookie.setCookie("floor", data.floor)

        router.push('/maps-v2')
    }

    return (
        <form className="flex flex-col w-2/3 md:w-1/2 self-center items-center justify-center mt-4">
            <div className="flex flex-col w-full items-start justify-center mt-4">
                <label className="self-start mb-1 xl:mb-4 text-base xl:text-4xl" htmlFor="building">Building*</label>
                <SearchBar 
                    lists={buildings!}
                    onBlur={handleBuildingBlur}
                />
            </div>
            <div className="flex flex-col w-full items-start justify-center mt-4">
                <label  className="self-start mb-1 xl:mb-4 text-base xl:text-4xl" htmlFor="floor">Floor(Optional)</label>
                <SearchBar
                    lists={floors || []}
                    onBlur={handleFloorBlur}
                />
            </div>
            <div className="flex flex-col w-full items-start justify-center mt-4">
                <label  className="self-start mb-1 xl:mb-4 text-base xl:text-4xl"  htmlFor="Room">Room*</label>
                <SearchBar
                    lists={room_list || []}
                    onBlur={handleRoomBlur}
                />
            </div>
            <button onClick={goToMaps} type="button" className="rounded-3xl bg-p_border px-5 py-1 mt-8">Let's go</button>
        </form> 
    )
}    
