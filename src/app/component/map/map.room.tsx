'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


type Props = {
    draggable: boolean,
    lat: number,
    lng: number,
    setLat: (lat: number) => void,
    setLng: (lng: number) => void
}

export default function MapMarker({draggable, lat, lng, setLat, setLng}: Props) {
    // const [draggable, setDraggable] = useState(false)
    const [position, setPosition] = useState(center)
    const markerRef = useRef(null)

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',})

    const handleMapClick = (event: any) => {
        setPosition(event.latlng);
        console.log('Coordinates:', event.latlng.lat, event.latlng.lng); // Log coordinates
    };


    return (
        <div className = "overflow-hidden h-screen">
            <MapContainer
              center={center} // Initial coordinates
              zoom={13}
              style={{ height: '80%', width: '100%',  }}
          >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {position && (
              <DraggableMarker draggable ={draggable} lat={lat} lng={lng} setLat={setLat} setLng={setLng}/>
            )}
        </MapContainer>
        </div>
    );
}

const center = {
    lat: 13.74,
    lng: 100.52,
}



function DraggableMarker({ draggable, lat, lng, setLat, setLng }: Props) {
const [position, setPosition] = useState(center)
const markerRef = useRef<L.Marker>(null)
const eventHandlers = useMemo(
    () => ({
    dragend() {
        const marker = markerRef.current
        if (marker != null) {
        setPosition(marker.getLatLng())
        setLat(marker.getLatLng().lat)
        setLng(marker.getLatLng().lng)
        alert(marker.getLatLng())
        }
    },
    }),
    [],
)
return (
    <Marker
    draggable={draggable}
    eventHandlers={eventHandlers}
    position={position}
    ref={markerRef}>
    <Popup minWidth={90} autoClose keepInView>
        <h3 className = "text-xl">Drag this pin to last known location</h3>
    </Popup>
    </Marker>
)
}