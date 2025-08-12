"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function JobsMap({ jobs }: { jobs: any[] }) {
  const centre: [number, number] = [53.4, -7.9];
  return (
    <MapContainer center={centre} zoom={6.5} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {jobs.map((j) => (
        <Marker key={j.id} position={[j.lat, j.lng]} icon={icon}>
          <Popup>
            <div style={{minWidth:200}}>
              <strong>{j.title}</strong><br/>
              {j.sport} · {j.level}<br/>
              {j.locationName}<br/>
              €{j.fee} · {new Date(j.date).toLocaleString()}<br/>
              <Link className="btn" href={`/jobs/${j.id}`} style={{marginTop:6, display:"inline-block"}}>View</Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
