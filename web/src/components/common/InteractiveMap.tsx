import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import { Plus, Minus, Crosshair, Loader2 } from "lucide-react";
import type { Coordinates } from "../../types";

interface InteractiveMapProps {
  value: Coordinates;
  onChange: (coords: Coordinates) => void;
  destination?: Coordinates;
  destinationLabel?: string;
  pinLabel?: string;
  heightClass?: string;
}

const userPinIcon = L.divIcon({
  className: "",
  html: `<div style="transform:translate(-50%,-100%)" class="pin-marker">
    <svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 45C17 45 33 27.5 33 17C33 7.6 25.4 0 17 0C8.6 0 1 7.6 1 17C1 27.5 17 45 17 45Z" fill="#F2B233"/>
      <circle cx="17" cy="17" r="6.2" fill="#12295E"/>
    </svg>
  </div>`,
  iconSize: [34, 46],
  iconAnchor: [0, 0],
});

const destPinIcon = L.divIcon({
  className: "",
  html: `<div style="transform:translate(-50%,-50%)" class="pin-marker">
    <span style="display:grid;place-items:center;width:26px;height:26px;border-radius:9999px;background:#12295E;border:3px solid #ffffff">
      <span style="width:8px;height:8px;border-radius:9999px;background:#F2B233"></span>
    </span>
  </div>`,
  iconSize: [26, 26],
  iconAnchor: [0, 0],
});

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  value,
  onChange,
  destination,
  destinationLabel,
  pinLabel = "موقعك",
  heightClass = "h-[320px]",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const [locating, setLocating] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        center: [value.lat, value.lng],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Handle map clicks to update marker
      map.on("click", (e) => {
        onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      // User Draggable Marker
      const userMarker = L.marker([value.lat, value.lng], {
        icon: userPinIcon,
        draggable: true,
      }).addTo(map);

      userMarker.bindTooltip(pinLabel, {
        permanent: true,
        direction: "bottom",
        offset: [0, 6],
      });

      userMarker.on("dragend", (e) => {
        const marker = e.target as L.Marker;
        const latlng = marker.getLatLng();
        onChange({ lat: latlng.lat, lng: latlng.lng });
      });

      userMarkerRef.current = userMarker;
      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update User Marker position
  useEffect(() => {
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([value.lat, value.lng]);
    }
  }, [value.lat, value.lng]);

  // Update Destination & Polyline
  useEffect(() => {
    if (!mapRef.current) return;

    if (destination) {
      if (!destMarkerRef.current) {
        const destMarker = L.marker([destination.lat, destination.lng], {
          icon: destPinIcon,
        }).addTo(mapRef.current);

        if (destinationLabel) {
          destMarker.bindTooltip(destinationLabel, {
            permanent: true,
            direction: "top",
            offset: [0, -12],
          });
        }
        destMarkerRef.current = destMarker;
      } else {
        destMarkerRef.current.setLatLng([destination.lat, destination.lng]);
      }

      if (!polylineRef.current) {
        const poly = L.polyline(
          [
            [value.lat, value.lng],
            [destination.lat, destination.lng],
          ],
          {
            color: "#12295E",
            weight: 3,
            dashArray: "8 8",
            opacity: 0.7,
          }
        ).addTo(mapRef.current);
        polylineRef.current = poly;
      } else {
        polylineRef.current.setLatLngs([
          [value.lat, value.lng],
          [destination.lat, destination.lng],
        ]);
      }
    } else {
      if (destMarkerRef.current) {
        destMarkerRef.current.remove();
        destMarkerRef.current = null;
      }
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }
    }
  }, [destination, destinationLabel, value.lat, value.lng]);

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleLocateMe = useCallback(() => {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onChange(coords);
        mapRef.current?.panTo([coords.lat, coords.lng], { animate: true });
        setLocating(false);
      },
      (err) => {
        console.warn("تعذر الحصول على الموقع الحالي", err.code);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [onChange]);

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl border border-border ${heightClass}`}>
      <div ref={containerRef} className="h-full w-full" />

      {/* Floating Instructions Banner */}
      <p className="pointer-events-none absolute inset-x-0 top-3 z-[400] mx-auto w-fit rounded-full bg-card/90 px-4 py-1.5 text-xs font-bold text-foreground shadow-md backdrop-blur-md">
        اسحب الدبوس أو انقر على الخريطة لتحديد موقعك بدقة
      </p>

      {/* Map Controls */}
      <div className="absolute top-3 left-3 z-[500] flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="تكبير الخريطة"
          className="grid h-9 w-9 place-items-center text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="تصغير الخريطة"
          className="grid h-9 w-9 place-items-center border-t border-border text-foreground transition-colors hover:bg-muted"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleLocateMe}
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
    </div>
  );
};
