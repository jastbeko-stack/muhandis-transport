import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Crosshair, Loader2, Minus, Plus } from "lucide-react";
import "leaflet/dist/leaflet.css";

import type { Coordinates } from "@/lib/types";

interface PickupMapProps {
  value: Coordinates;
  onChange: (next: Coordinates) => void;
  destination?: Coordinates;
  destinationLabel?: string;
  pinLabel?: string;
  heightClass?: string;
}

const pinIcon = L.divIcon({
  className: "",
  html: `<div class="pin-marker" style="transform:translate(-50%,-100%)">
    <svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 45C17 45 33 27.5 33 17C33 7.6 25.4 0 17 0C8.6 0 1 7.6 1 17C1 27.5 17 45 17 45Z" fill="#F2B233"/>
      <circle cx="17" cy="17" r="6.2" fill="#12295E"/>
    </svg>
  </div>`,
  iconSize: [34, 46],
  iconAnchor: [0, 0],
});

const destIcon = L.divIcon({
  className: "",
  html: `<div style="transform:translate(-50%,-50%)" class="pin-marker">
    <span style="display:grid;place-items:center;width:26px;height:26px;border-radius:9999px;background:#12295E;border:3px solid #ffffff">
      <span style="width:8px;height:8px;border-radius:9999px;background:#F2B233"></span>
    </span>
  </div>`,
  iconSize: [26, 26],
  iconAnchor: [0, 0],
});

function MapClickHandler({ onChange }: { onChange: (next: Coordinates) => void }) {
  useMapEvents({
    click(event) {
      onChange({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
}

function MapControls({ onLocate, locating }: { onLocate: () => void; locating: boolean }) {
  const map = useMap();

  return (
    <div className="absolute top-3 left-3 z-[500] flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      <button
        type="button"
        onClick={() => map.zoomIn()}
        aria-label="تكبير الخريطة"
        className="grid h-9 w-9 place-items-center text-foreground transition-colors hover:bg-muted"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        aria-label="تصغير الخريطة"
        className="grid h-9 w-9 place-items-center border-t border-border text-foreground transition-colors hover:bg-muted"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onLocate}
        aria-label="استخدام موقعي الحالي"
        className="grid h-9 w-9 place-items-center border-t border-border text-primary transition-colors hover:bg-muted"
      >
        {locating ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Crosshair className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

function Recenter({ point }: { point: Coordinates }) {
  const map = useMap();
  useEffect(() => {
    map.panTo([point.lat, point.lng], { animate: true });
  }, [map, point]);
  return null;
}

/** Interactive OpenStreetMap picker used to set the student's pickup point. */
export function PickupMap({
  value,
  onChange,
  destination,
  destinationLabel,
  pinLabel,
  heightClass = "h-[320px]",
}: PickupMapProps) {
  const [locating, setLocating] = useState<boolean>(false);
  const [recenterTo, setRecenterTo] = useState<Coordinates | null>(null);

  const handleLocate = useCallback((): void => {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next: Coordinates = { lat: position.coords.latitude, lng: position.coords.longitude };
        onChange(next);
        setRecenterTo(next);
        setLocating(false);
      },
      (error) => {
        console.warn("تعذر الحصول على الموقع الحالي", error.code);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, [onChange]);

  const markerHandlers = useMemo(
    () => ({
      dragend(event: L.DragEndEvent) {
        const marker = event.target as L.Marker;
        const position = marker.getLatLng();
        onChange({ lat: position.lat, lng: position.lng });
      },
    }),
    [onChange],
  );

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl border border-border ${heightClass}`}>
      <MapContainer
        center={[value.lat, value.lng]}
        zoom={12}
        scrollWheelZoom
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onChange={onChange} />
        <MapControls onLocate={handleLocate} locating={locating} />
        {recenterTo ? <Recenter point={recenterTo} /> : null}

        {destination ? (
          <>
            <Polyline
              positions={[
                [value.lat, value.lng],
                [destination.lat, destination.lng],
              ]}
              pathOptions={{ color: "#12295E", weight: 3, dashArray: "8 8", opacity: 0.7 }}
            />
            <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
              {destinationLabel ? (
                <Tooltip direction="top" offset={[0, -12]} permanent>
                  {destinationLabel}
                </Tooltip>
              ) : null}
            </Marker>
          </>
        ) : null}

        <Marker position={[value.lat, value.lng]} icon={pinIcon} draggable eventHandlers={markerHandlers}>
          <Tooltip direction="bottom" offset={[0, 6]} permanent>
            {pinLabel ?? "موقعك"}
          </Tooltip>
        </Marker>
      </MapContainer>

      <p className="pointer-events-none absolute inset-x-0 top-3 z-[400] mx-auto w-fit rounded-full bg-card/95 px-4 py-1.5 text-xs font-semibold text-foreground shadow">
        اسحب الدبوس أو انقر على الخريطة لتحديد موقعك بدقة
      </p>
    </div>
  );
}
