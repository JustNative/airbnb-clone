'use client'


import L from 'leaflet'
import {
    MapContainer,
    TileLayer,
    Marker
} from 'react-leaflet'

import "leaflet/dist/leaflet.css"
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useEffect, useState } from 'react'


// @ts-ignore
// delete L.Icon.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x.src,
    iconUrl: markerIcon.src,
    shadowUrl: markerShadow.src
})

interface MapProps {
    center?: L.LatLngExpression
}

const Map: React.FC<MapProps> = ({
    center
}) => {
    const [isMouted, setIsMouted] = useState(false);

    useEffect(() => {
        if (!isMouted) {
            setIsMouted(true)
        }

    }, [isMouted])

    if (!isMouted) return null;

    return (
        <MapContainer
            center={center || [51, -0.09]}
            zoom={center ? 4 : 2}
            scrollWheelZoom={false}
            className='h-[35vh] rounded-lg'
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {center && (
                <Marker
                    position={center}
                />
            )}

        </MapContainer>
    )
}

export default Map