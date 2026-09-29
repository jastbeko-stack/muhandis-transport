import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  ChevronDown,
  Bell,
  Check,
  Search,
  UserPlus,
  Compass,
  Plus,
  Minus,
  X,
  Layers,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePlatform } from "../context/PlatformContext";
import { UNIVERSITIES, AREAS, AREA_COORDINATES } from "../data/initialData";
import { AddLineModal } from "../components/modals/AddLineModal";
import { BookingModal } from "../components/modals/BookingModal";
import { RequestCoverageModal } from "../components/modals/RequestCoverageModal";
import { RegisterTripSheet } from "../components/modals/RegisterTripSheet";
import type { TransportLine } from "../types";
import { toast } from "sonner";
import { cn } from "../utils/formatters";

// Basra Center coordinates matching user screenshot (Al-Ma'qil / Al-Ablat / Al-Hindiyah)
const MAP_DEFAULT_CENTER = { lat: 30.528, lng: 47.795 };
const MAP_DEFAULT_ZOOM = 13;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lines } = usePlatform();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);

  // Map layer mode: 'streets' (Google Roads) or 'satellite' (Google Hybrid)
  const [mapType, setMapType] = useState<"streets" | "satellite">("streets");

  // Form State matching screenshot
  const [fromArea, setFromArea] = useState<string>("");
  const [toUniversity, setToUniversity] = useState<string>("");

  // Modals & Sheets
  const [areaSheetOpen, setAreaSheetOpen] = useState(false);
  const [uniSheetOpen, setUniSheetOpen] = useState(false);
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [addLineModalOpen, setAddLineModalOpen] = useState(false);
  const [bookingLine, setBookingLine] = useState<TransportLine | null>(null);
  const [coverageModalOpen, setCoverageModalOpen] = useState(false);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [registerTripSheetOpen, setRegisterTripSheetOpen] = useState(false);

  // Selected City Pill
  const [selectedCity, setSelectedCity] = useState("البصرة");

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create Map instance with mobile-touch options enabled
    const map = L.map(mapContainerRef.current, {
      center: [MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng],
      zoom: MAP_DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
    });

    // Real Google Maps Road Tile Layer with authentic Arabic street names & colors
    const tileLayer = L.tileLayer(
      "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=ar",
      {
        subdomains: ["0", "1", "2", "3"],
        maxZoom: 20,
      }
    ).addTo(map);

    currentTileLayerRef.current = tileLayer;

    // Call invalidateSize multiple times to guarantee immediate loading without grey screen
    setTimeout(() => map.invalidateSize(), 50);
    setTimeout(() => map.invalidateSize(), 250);
    setTimeout(() => map.invalidateSize(), 600);

    // Pulsing Blue Location Dot in the Center (matching user screenshot)
    const pulsingDotIcon = L.divIcon({
      className: "custom-pulse-marker",
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
          <div style="position: absolute; width: 40px; height: 40px; border-radius: 9999px; background-color: rgba(59, 130, 246, 0.28); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 24px; height: 24px; border-radius: 9999px; background-color: rgba(59, 130, 246, 0.35);"></div>
          <div style="position: relative; width: 14px; height: 14px; border-radius: 9999px; background-color: #3b82f6; border: 2.5px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.35);"></div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [0, 0],
    });

    L.marker([MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng], {
      icon: pulsingDotIcon,
      interactive: false,
    }).addTo(map);

    // Add Interactive University Markers across Basra
    UNIVERSITIES.forEach((uni) => {
      const uniIcon = L.divIcon({
        className: "custom-uni-pin",
        html: `
          <div style="transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="background: #12295E; color: #F2B233; padding: 4px 9px; border-radius: 9999px; font-size: 11px; font-weight: 800; border: 2px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
              <span>🎓</span>
              <span>${uni.short}</span>
            </div>
            <div style="width: 2px; height: 6px; background: #12295E;"></div>
            <div style="width: 6px; height: 6px; border-radius: 9999px; background: #F2B233;"></div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [0, 0],
      });

      const m = L.marker([uni.location.lat, uni.location.lng], { icon: uniIcon }).addTo(map);
      m.on("click", () => {
        setToUniversity(uni.name);
        toast.success(`تم اختيار الوجهة: ${uni.name}`);
      });
    });

    // Add Active Lines Markers across Basra
    lines.forEach((line) => {
      const coords = AREA_COORDINATES[line.fromArea];
      if (!coords) return;
      const lat = coords.lat + (Math.random() - 0.5) * 0.005;
      const lng = coords.lng + (Math.random() - 0.5) * 0.005;

      const lineIcon = L.divIcon({
        className: "custom-line-pin",
        html: `
          <div style="transform: translate(-50%, -50%); cursor: pointer; display: flex; align-items: center; gap: 3px; background: #286058; color: #fff; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; border: 1.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25); white-space: nowrap;">
            <span>🚐</span>
            <span>خط ${line.fromArea}</span>
          </div>
        `,
        iconSize: [30, 24],
        iconAnchor: [0, 0],
      });

      const lm = L.marker([lat, lng], { icon: lineIcon }).addTo(map);
      lm.on("click", () => {
        setBookingLine(line);
      });
    });

    // Map Click: pick nearest area
    map.on("click", (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      let closestArea = "البصرة";
      let minDist = Infinity;
      Object.entries(AREA_COORDINATES).forEach(([area, c]) => {
        const d = Math.hypot(c.lat - lat, c.lng - lng);
        if (d < minDist) {
          minDist = d;
          closestArea = area;
        }
      });
      setFromArea(closestArea);
      toast.info(`تم اختيار منطقة الانطلاق: ${closestArea}`);
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lines]);

  // Toggle Satellite vs Streets map
  const toggleMapLayer = () => {
    if (!mapInstanceRef.current) return;
    const newType = mapType === "streets" ? "satellite" : "streets";
    setMapType(newType);

    if (currentTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
    }

    const tileUrl =
      newType === "satellite"
        ? "https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&hl=ar" // Google Hybrid (Satellite + Roads & Arabic labels)
        : "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=ar"; // Google Standard Roads

    const newLayer = L.tileLayer(tileUrl, {
      subdomains: ["0", "1", "2", "3"],
      maxZoom: 20,
    }).addTo(mapInstanceRef.current);

    currentTileLayerRef.current = newLayer;
    toast.info(newType === "satellite" ? "تم تفعيل عرض القمر الصناعي" : "تم تفعيل عرض الشوارع الحقيقي");
  };

  // Pan map when an area is selected
  const handleSelectArea = (area: string) => {
    setFromArea(area);
    setAreaSheetOpen(false);
    if (AREA_COORDINATES[area] && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [AREA_COORDINATES[area].lat, AREA_COORDINATES[area].lng],
        14,
        { duration: 1.2 }
      );
    }
  };

  const handleSelectUniversity = (uniName: string) => {
    setToUniversity(uniName);
    setUniSheetOpen(false);
    const uniObj = UNIVERSITIES.find((u) => u.name === uniName || u.short === uniName);
    if (uniObj && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([uniObj.location.lat, uniObj.location.lng], 14, {
        duration: 1.2,
      });
    }
  };

  // Geolocation button (Current user position in Basra)
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng], MAP_DEFAULT_ZOOM, { duration: 0.8 });
      }
      return;
    }

    toast.info("جاري تحديد موقعك...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 15, { duration: 1.2 });
        }
        toast.success("تم الانتقال إلى موقعك في البصرة!");
      },
      () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng], MAP_DEFAULT_ZOOM, { duration: 0.8 });
        }
        toast.info("تم ضبط الخريطة على مركز البصرة");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // Main CTA Button Click ("سجّل خطك")
  const handleMainActionClick = () => {
    if (user?.role === "driver") {
      setAddLineModalOpen(true);
      return;
    }
    setRegisterTripSheetOpen(true);
  };

  const handleSearchMatchingLines = () => {
    setActionSheetOpen(false);
    const params = new URLSearchParams();
    if (fromArea) params.set("area", fromArea);
    const matchedUni = UNIVERSITIES.find((u) => u.name === toUniversity || u.short === toUniversity);
    if (matchedUni) params.set("university", matchedUni.id);
    navigate(`/services?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] overflow-hidden bg-[#eef3f2]">
      {/* 1. Fullscreen Google Map Container */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing touch-none"
        style={{ touchAction: "none" }}
      />

      {/* 2. Top Floating Controls (Pill & Notification Bell) */}
      <header className="absolute top-2.5 sm:top-4 inset-x-3 sm:inset-x-4 z-30 flex items-center justify-between pointer-events-none pt-[max(0.2rem,env(safe-area-inset-top,0px))]">
        {/* Right side in RTL: City Selector Pill (📍 البصرة ⌄) */}
        <div className="relative pointer-events-auto">
          <button
            type="button"
            onClick={() => setCityMenuOpen(!cityMenuOpen)}
            className="flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-black text-gray-800 shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-gray-150 backdrop-blur-md transition-all hover:bg-white active:scale-95"
            aria-label="اختيار المدينة"
          >
            <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 stroke-[2.5]" />
            <span className="font-display font-extrabold">{selectedCity}</span>
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#246158]" />
          </button>

          {/* City Dropdown Menu */}
          {cityMenuOpen && (
            <div className="absolute top-11 sm:top-12 right-0 w-44 rounded-2xl bg-white p-2 shadow-2xl border border-gray-150 z-50 animate-fade-up">
              <p className="px-2 py-1 text-[11px] font-bold text-gray-400">المناطق المتاحة:</p>
              {["البصرة", "الزبير", "شط العرب", "الهارثة", "القرنة", "أبو الخصيب"].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setSelectedCity(city);
                    setCityMenuOpen(false);
                    if (city === "الزبير" && mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([30.3897, 47.708], 13);
                    } else if (mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng], 13);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors",
                    selectedCity === city
                      ? "bg-[#eaf4f2] text-[#246158]"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span>{city}</span>
                  {selectedCity === city && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Left side in RTL: Circular Notification Bell with Badge (🔔 19) */}
        <div className="relative pointer-events-auto">
          <button
            type="button"
            onClick={() => setNotifModalOpen(true)}
            className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-gray-150 backdrop-blur-md transition-all hover:bg-white active:scale-95"
            aria-label="التنبيهات والإشعارات"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 stroke-[2]" />
            <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] sm:h-5 sm:min-w-[20px] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[9px] sm:text-[10px] font-black text-white shadow-sm border-2 border-white">
              19
            </span>
          </button>
        </div>
      </header>

      {/* Floating Map Controls: Zoom In, Zoom Out, Layer Toggle, Geolocation */}
      <div className="absolute bottom-[calc(16.5rem+env(safe-area-inset-bottom,0px))] right-3 sm:right-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        {/* Layer toggle (Satellite / Road) */}
        <button
          type="button"
          onClick={toggleMapLayer}
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md border border-gray-150 active:scale-95 transition-all"
          title="تبديل الخريطة / قمر صناعي"
          aria-label="تبديل الخريطة"
        >
          <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-[#246158]" />
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md border border-gray-150 active:scale-95 transition-all font-bold"
          aria-label="تكبير الخريطة"
        >
          <Plus className="h-4 w-4 text-gray-700" />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md border border-gray-150 active:scale-95 transition-all font-bold"
          aria-label="تصغير الخريطة"
        >
          <Minus className="h-4 w-4 text-gray-700" />
        </button>

        {/* Recenter / Geolocation */}
        <button
          type="button"
          onClick={handleLocateMe}
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md border border-gray-150 active:scale-95 transition-all"
          title="موقعي الحالي"
          aria-label="إعادة ضبط الخريطة"
        >
          <Compass className="h-4 w-4 sm:h-5 sm:w-5 text-[#246158]" />
        </button>
      </div>

      {/* 3. Bottom Floating Card ("وين خطك اليومي؟") */}
      <div className="absolute bottom-[calc(3.85rem+env(safe-area-inset-bottom,0px))] sm:bottom-20 inset-x-3 sm:inset-x-6 z-30 max-w-md mx-auto pointer-events-auto">
        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-card p-3.5 sm:p-5 shadow-[0_10px_35px_rgba(0,0,0,0.14)] border border-gray-150/90 dark:border-border transition-all">
          {/* Card Title */}
          <div
            onClick={() => setRegisterTripSheetOpen(true)}
            className="flex items-center justify-between cursor-pointer group mb-2.5 sm:mb-4"
          >
            <h2 className="text-base sm:text-2xl font-black text-[#1e293b] dark:text-foreground text-start font-display group-hover:text-[#246158] transition-colors">
              وين خطك اليومي؟
            </h2>
            <span className="text-[11px] sm:text-xs font-black text-[#286058] bg-[#eaf4f2] px-2.5 py-0.5 rounded-full border border-[#286058]/20">
              سجّل الآن
            </span>
          </div>

          {/* Inputs Section */}
          <div className="rounded-xl sm:rounded-2xl border border-gray-150 dark:border-border bg-white dark:bg-card overflow-hidden divide-y divide-gray-100 dark:divide-border shadow-inner-sm">
            {/* Row 1: Start Location (منين تطلع؟) */}
            <button
              type="button"
              onClick={() => setRegisterTripSheetOpen(true)}
              className="w-full flex items-center justify-between p-2.5 sm:p-3.5 text-start hover:bg-gray-50/60 dark:hover:bg-muted/40 transition-colors"
            >
              <span
                className={cn(
                  "text-xs sm:text-sm font-bold flex-1 truncate",
                  fromArea ? "text-foreground font-black" : "text-gray-400 dark:text-muted-foreground"
                )}
              >
                {fromArea ? `منطقة: ${fromArea}` : "منين تطلع؟"}
              </span>
              {/* Teal Ring Icon on Right (RTL) */}
              <span className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full border-[2.5px] border-[#246158] inline-block shrink-0 ml-1" />
            </button>

            {/* Row 2: Destination Location (وين تروح؟) */}
            <button
              type="button"
              onClick={() => setRegisterTripSheetOpen(true)}
              className="w-full flex items-center justify-between p-2.5 sm:p-3.5 text-start hover:bg-gray-50/60 dark:hover:bg-muted/40 transition-colors"
            >
              <span
                className={cn(
                  "text-xs sm:text-sm font-bold flex-1 truncate",
                  toUniversity ? "text-foreground font-black" : "text-gray-400 dark:text-muted-foreground"
                )}
              >
                {toUniversity ? `الجامعة: ${toUniversity}` : "وين تروح؟"}
              </span>
              {/* Terracotta Solid Square Icon on Right (RTL) */}
              <span className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-[3px] bg-[#9e4a2e] inline-block shrink-0 ml-1" />
            </button>
          </div>

          {/* Primary Action Button (سجّل خطك) */}
          <button
            type="button"
            onClick={handleMainActionClick}
            className="w-full mt-3 sm:mt-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#286058] hover:bg-[#204e47] active:scale-[0.98] text-white font-black text-sm sm:text-base shadow-[0_4px_16px_rgba(40,96,88,0.3)] transition-all flex items-center justify-center gap-2"
          >
            سجّل خطك
          </button>
        </div>
      </div>

      {/* Area Picker Bottom Sheet */}
      {areaSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-card rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col animate-fade-up border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-black text-base text-foreground font-display flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-[#246158]" />
                اختر منطقة الانطلاق (منين تطلع؟)
              </h3>
              <button
                type="button"
                onClick={() => setAreaSheetOpen(false)}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="overflow-y-auto py-3 space-y-1.5 flex-1 pr-1">
              {AREAS.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleSelectArea(area)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-start transition-all",
                    fromArea === area
                      ? "bg-[#eaf4f2] text-[#246158] font-black"
                      : "hover:bg-muted/60 text-foreground"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {area}
                  </span>
                  {fromArea === area && <Check className="h-4 w-4 text-[#246158]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* University Picker Bottom Sheet */}
      {uniSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-card rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col animate-fade-up border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-black text-base text-foreground font-display flex items-center gap-2">
                <span className="h-3 w-3 rounded-[3px] bg-[#9e4a2e]" />
                اختر جامعتك أو كليتك (وين تروح؟)
              </h3>
              <button
                type="button"
                onClick={() => setUniSheetOpen(false)}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="overflow-y-auto py-3 space-y-1.5 flex-1 pr-1">
              {UNIVERSITIES.map((uni) => (
                <button
                  key={uni.id}
                  type="button"
                  onClick={() => handleSelectUniversity(uni.name)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-start transition-all",
                    toUniversity === uni.name
                      ? "bg-[#eaf4f2] text-[#246158] font-black"
                      : "hover:bg-muted/60 text-foreground"
                  )}
                >
                  <div>
                    <p className="font-bold">{uni.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{uni.short}</p>
                  </div>
                  {toUniversity === uni.name && <Check className="h-4 w-4 text-[#246158]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Sheet on "سجّل خطك" */}
      {actionSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-card rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-fade-up border border-border space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <h3 className="font-black text-base text-foreground font-display">
                  {fromArea && toUniversity
                    ? `المسار: ${fromArea} ⟵ ${toUniversity}`
                    : "اختيار الإجراء المطلوب"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  اختر ما إذا كنت ترغب بالبحث عن مقعد أو تسجيل خطك كـ كابتن
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActionSheetOpen(false)}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-2.5 pt-1">
              {/* Option 1: Search available lines */}
              <button
                type="button"
                onClick={handleSearchMatchingLines}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#eaf4f2] dark:bg-[#246158]/20 text-[#246158] font-bold text-sm hover:bg-[#dcefe9] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-card flex items-center justify-center shadow-sm">
                    <Search className="h-5 w-5 text-[#246158]" />
                  </div>
                  <div className="text-start">
                    <p className="font-black">تصفح الخطوط المتوفرة</p>
                    <p className="text-[11px] text-[#246158]/80 font-normal">
                      عرض مقاعد الباصات والصالون المتوفرة لهذا المسار
                    </p>
                  </div>
                </div>
              </button>

              {/* Option 2: Add Line as Captain */}
              <button
                type="button"
                onClick={() => {
                  setActionSheetOpen(false);
                  setAddLineModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/60 hover:bg-muted text-foreground font-bold text-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-card flex items-center justify-center shadow-sm border border-border">
                    <UserPlus className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="text-start">
                    <p className="font-black">أضف خطك كـ كابتن جديد</p>
                    <p className="text-[11px] text-muted-foreground font-normal">
                      سجّل مركبتك ومقاعدك لتظهر للطلاب فوراً في المنصة
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal (Bell 🔔 19) */}
      {notifModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-card rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-fade-up border border-border max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <Bell className="h-4 w-4" />
                </div>
                <h3 className="font-black text-base text-foreground font-display">
                  التنبيهات والإشعارات (19)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setNotifModalOpen(false)}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="overflow-y-auto py-3 space-y-2.5 flex-1 pr-1 text-xs">
              {[
                { title: "تم تأكيد تسجيل خط جديد", desc: "كابتن أبو مصطفى أضاف خط الزبير - كرمة علي", time: "منذ 10 دقائق" },
                { title: "مقاعد شاغرة محدودة", desc: "تبقى مقعدين فقط في خط الجنينة - باب الزبير", time: "منذ 35 دقيقة" },
                { title: "تنبيه مواعيد الدوام", desc: "الانطلاق الصباحي غداً يبدأ الساعة 07:15 ص", time: "منذ ساعتين" },
                { title: "طلب تغطية جديد", desc: "تم تسجيل طلب تغطية جديد لحي المهندسين", time: "أمس" },
              ].map((n, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{n.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <AddLineModal open={addLineModalOpen} onOpenChange={setAddLineModalOpen} />
      <BookingModal
        line={bookingLine}
        open={!!bookingLine}
        onOpenChange={(open) => !open && setBookingLine(null)}
      />
      <RequestCoverageModal open={coverageModalOpen} onOpenChange={setCoverageModalOpen} />

      {/* Register Trip Sheet matching the user screenshot design */}
      <RegisterTripSheet
        open={registerTripSheetOpen}
        onClose={() => setRegisterTripSheetOpen(false)}
        initialFromArea={fromArea}
        initialToUniversity={toUniversity}
      />
    </div>
  );
};
