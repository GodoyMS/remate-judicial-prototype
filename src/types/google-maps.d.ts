export {};

declare global {
  namespace google {
    namespace maps {
      class Map {
        constructor(el: HTMLElement, opts?: MapOptions);
        setCenter(latLng: LatLng | LatLngLiteral): void;
        panTo(latLng: LatLng | LatLngLiteral): void;
        setZoom(zoom: number): void;
        addListener(event: string, handler: (e: MapMouseEvent) => void): MapsEventListener;
      }

      class Marker {
        constructor(opts?: MarkerOptions);
        setMap(map: Map | null): void;
        setPosition(latLng: LatLng | LatLngLiteral): void;
        getPosition(): LatLng | null | undefined;
        addListener(event: string, handler: () => void): MapsEventListener;
      }

      class LatLng {
        constructor(lat: number, lng: number);
        lat(): number;
        lng(): number;
      }

      class Autocomplete {
        constructor(input: HTMLInputElement, opts?: AutocompleteOptions);
        addListener(event: string, handler: () => void): MapsEventListener;
        getPlace(): PlaceResult;
      }

      interface MapOptions {
        center?: LatLng | LatLngLiteral;
        zoom?: number;
        mapTypeControl?: boolean;
        streetViewControl?: boolean;
        fullscreenControl?: boolean;
        zoomControl?: boolean;
        gestureHandling?: string;
      }

      interface MarkerOptions {
        map?: Map;
        position?: LatLng | LatLngLiteral;
        draggable?: boolean;
        title?: string;
        animation?: Animation;
      }

      interface LatLngLiteral {
        lat: number;
        lng: number;
      }

      interface MapMouseEvent {
        latLng: LatLng | null;
      }

      interface MapsEventListener {
        remove(): void;
      }

      interface AutocompleteOptions {
        fields?: string[];
        types?: string[];
        componentRestrictions?: { country: string | string[] };
      }

      interface PlaceResult {
        geometry?: { location: LatLng };
        formatted_address?: string;
      }

      enum Animation {
        DROP = 1,
      }

      namespace event {
        function clearInstanceListeners(instance: object): void;
      }
    }
  }

  interface Window {
    google?: typeof google;
  }
}
