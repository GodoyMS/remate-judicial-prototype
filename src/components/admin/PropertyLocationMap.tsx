"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { loadGoogleMaps, getGoogleMapsApiKey } from "@/lib/google-maps/loader";
import { cn } from "@/lib/utils";

interface PropertyLocationMapProps {
  lat: number;
  lng: number;
  address?: string;
  onLocationChange?: (lat: number, lng: number) => void;
  onAddressChange?: (address: string) => void;
  readOnly?: boolean;
  className?: string;
}

const LIMA_CENTER = { lat: -12.0464, lng: -77.0428 };

export function PropertyLocationMap({
  lat,
  lng,
  address,
  onLocationChange,
  onAddressChange,
  readOnly = false,
  className,
}: PropertyLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.Autocomplete | null>(null);
  const onLocationChangeRef = useRef(onLocationChange);
  const onAddressChangeRef = useRef(onAddressChange);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const hasApiKey = Boolean(getGoogleMapsApiKey());

  onLocationChangeRef.current = onLocationChange;
  onAddressChangeRef.current = onAddressChange;

  const updateMarkerPosition = useCallback((nextLat: number, nextLng: number) => {
    markerRef.current?.setPosition({ lat: nextLat, lng: nextLng });
    mapRef.current?.panTo({ lat: nextLat, lng: nextLng });
  }, []);

  useEffect(() => {
    if (!hasApiKey) {
      setLoading(false);
      setLoadError("missing_key");
      return;
    }

    let cancelled = false;

    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !mapContainerRef.current) return;

        const initialLat = Number.isFinite(lat) ? lat : LIMA_CENTER.lat;
        const initialLng = Number.isFinite(lng) ? lng : LIMA_CENTER.lng;
        const center = { lat: initialLat, lng: initialLng };

        const map = new maps.Map(mapContainerRef.current, {
          center,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: "greedy",
        });

        const marker = new maps.Marker({
          map,
          position: center,
          draggable: !readOnly,
          title: "Ubicación de la propiedad",
          animation: maps.Animation.DROP,
        });

        if (!readOnly) {
          marker.addListener("dragend", () => {
            const pos = marker.getPosition();
            if (!pos) return;
            onLocationChangeRef.current?.(pos.lat(), pos.lng());
          });

          map.addListener("click", (event: google.maps.MapMouseEvent) => {
            const pos = event.latLng;
            if (!pos) return;
            marker.setPosition(pos);
            onLocationChangeRef.current?.(pos.lat(), pos.lng());
          });
        }

        if (!readOnly && searchInputRef.current) {
          const autocomplete = new maps.Autocomplete(searchInputRef.current, {
            fields: ["geometry", "formatted_address"],
            types: ["geocode"],
            componentRestrictions: { country: "pe" },
          });

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            const location = place.geometry?.location;
            if (!location) return;

            const nextLat = location.lat();
            const nextLng = location.lng();
            marker.setPosition({ lat: nextLat, lng: nextLng });
            map.panTo({ lat: nextLat, lng: nextLng });
            map.setZoom(16);
            onLocationChangeRef.current?.(nextLat, nextLng);
            if (place.formatted_address) {
              onAddressChangeRef.current?.(place.formatted_address);
            }
          });

          autocompleteRef.current = autocomplete;
        }

        mapRef.current = map;
        markerRef.current = marker;
        setLoadError(null);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setLoadError(err.message);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      if (window.google?.maps) {
        if (markerRef.current) {
          google.maps.event.clearInstanceListeners(markerRef.current);
          markerRef.current.setMap(null);
        }
        if (mapRef.current) {
          google.maps.event.clearInstanceListeners(mapRef.current);
        }
      }
      markerRef.current = null;
      mapRef.current = null;
      autocompleteRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasApiKey]);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || loading) return;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    updateMarkerPosition(lat, lng);
  }, [lat, lng, loading, updateMarkerPosition]);

  const embedSrc =
    Number.isFinite(lat) && Number.isFinite(lng)
      ? `https://maps.google.com/maps?q=${lat},${lng}&hl=es&z=15&output=embed`
      : `https://maps.google.com/maps?q=Lima,Peru&hl=es&z=12&output=embed`;

  const mapsUrl =
    Number.isFinite(lat) && Number.isFinite(lng)
      ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
      : undefined;

  return (
    <div className={cn("space-y-3", className)}>
      {!readOnly && (
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium">Ubicación en mapa</p>
            <p className="text-xs text-muted-foreground">
              Busca una dirección, haz clic en el mapa o arrastra el marcador.
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] shrink-0">
            Google Maps
          </Badge>
        </div>
      )}

      {!readOnly && hasApiKey && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none z-10" />
          <Input
            ref={searchInputRef}
            defaultValue={address}
            placeholder="Buscar dirección en Google Maps..."
            className="pl-9 rounded-xl"
          />
        </div>
      )}

      <div className="relative rounded-xl border border-border/60 overflow-hidden bg-muted/30">
        {hasApiKey && !loadError ? (
          <>
            <div
              ref={mapContainerRef}
              className={cn("w-full", readOnly ? "h-[220px]" : "h-[280px]")}
            />
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-sm">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Cargando mapa...</p>
              </div>
            )}
          </>
        ) : (
          <div className="relative">
            <iframe
              title="Google Maps"
              src={embedSrc}
              className={cn("w-full border-0", readOnly ? "h-[220px]" : "h-[280px]")}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            {/* {!hasApiKey && (
              <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-background/95 border border-border/60 px-3 py-2 shadow-sm">
                <p className="text-[11px] text-muted-foreground">
                  Configura{" "}
                  <code className="text-[10px] bg-muted px-1 py-0.5 rounded">
                    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                  </code>{" "}
                  para buscar direcciones y mover el marcador.
                </p>
              </div>
            )} */}
          </div>
        )}

        {loadError && loadError !== "missing_key" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/90 p-4 text-center">
            <MapPin className="size-8 text-muted-foreground/50" />
            <p className="text-sm font-medium">No se pudo cargar el mapa</p>
            <p className="text-xs text-muted-foreground max-w-xs">{loadError}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5 text-xs gap-2">
        <span className="text-muted-foreground flex items-center gap-1.5 min-w-0">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{address ?? "Coordenadas"}</span>
        </span>
        <span className="font-mono font-medium tabular-nums shrink-0 text-[10px]">
          {Number.isFinite(lat) ? lat.toFixed(5) : "—"},{" "}
          {Number.isFinite(lng) ? lng.toFixed(5) : "—"}
        </span>
      </div>

      {readOnly && mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-border/60 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
        >
          <MapPin className="size-3.5" />
          Abrir en Google Maps
        </a>
      )}
    </div>
  );
}
