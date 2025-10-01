import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useC } from "../contexts/ContextProvider";
import { useGeolocation } from "../hooks/useGeoLocation";
import Button from "./button";

function ChangeCenter({ center }) {
  const map = useMap(); // gives you direct access to the map instance

  useEffect(() => {
    map.setView(center); // update the map's center
  }, [center, map]);

  return null; // this component doesn't render anything visually
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
  return null;
}
function Map() {
  const {
    position: geoLocationPosition,
    getPosition,
    isLoading: isLoadingPosition,
  } = useGeolocation();
  const [searchParams] = useSearchParams();
  const { cities, currentCity } = useC();
  const maplat = searchParams.get("lat");
  const maplng = searchParams.get("lng");
  const [mapPosition, setMapPosition] = useState(function () {
    const averageLat =
      cities.reduce((sum, city) => sum + city.position.lat, 0) / cities.length;

    const averageLng =
      cities.reduce((sum, city) => sum + city.position.lng, 0) / cities.length;
    if (Object.keys(currentCity).length === 0) {
      return cities.length === 0 ? [40, 0] : [averageLat, averageLng];
    }
    return [40, 0];
  });

  useEffect(
    function () {
      if (geoLocationPosition !== null) {
        setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
      }
    },
    [geoLocationPosition, setMapPosition]
  );
  useEffect(
    function () {
      if (maplat !== null && maplng !== null) {
        setMapPosition([maplat, maplng]);
      }
    },
    [cities, maplat, maplng, currentCity]
  );

  return (
    <div id="map" className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use Your Position"}
        </Button>
      )}

      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
      >
        <ChangeCenter center={mapPosition} />
        <DetectClick />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((c) => (
          <Marker key={c.id} position={[c.position.lat, c.position.lng]}>
            <Popup>
              <>
                <span>{c.emoji}</span>
                <span>{c.cityName}</span>
              </>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
//rm -rf node_modules/.vite

export default Map;
