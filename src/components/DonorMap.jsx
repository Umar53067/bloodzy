import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AlertCircle } from "lucide-react";

/**
 * DonorMap Component - Display donors and hospitals on an interactive map
 * @param {Array} locations - Array of locations { id, name, type, lat, lng, info }
 * type can be: 'donor', 'hospital', 'bloodbank'
 */
export default function DonorMap({ locations = [], title = "Location Map" }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Initialize map centered on New York (default)
      const defaultCenter = [40.7128, -74.006];

      map.current = L.map(mapContainer.current).setView(defaultCenter, 10);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map.current);

      setMapReady(true);
      setError(null);
    } catch (err) {
      console.error("Map initialization error:", err);
      setError("Failed to initialize map");
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!mapReady || !map.current) return;

    // Clear existing markers
    markers.current.forEach((marker) => {
      map.current.removeLayer(marker);
    });
    markers.current = [];

    if (!locations || locations.length === 0) return;

    // Add new markers
    const bounds = L.latLngBounds();

    locations.forEach((location) => {
      try {
        const { id, name, type, lat, lng, info } = location;

        // Determine marker color and icon based on type
        let markerColor, markerIcon;
        if (type === "donor") {
          markerColor = "#EF4444"; // Red for donors
          markerIcon = "🩸";
        } else if (type === "hospital") {
          markerColor = "#3B82F6"; // Blue for hospitals
          markerIcon = "🏥";
        } else if (type === "bloodbank") {
          markerColor = "#DC2626"; // Dark red for blood banks
          markerIcon = "🩹";
        } else {
          markerColor = "#6B7280"; // Gray for unknown
          markerIcon = "📍";
        }

        // Create custom marker HTML
        const markerHTML = `
          <div style="
            background-color: ${markerColor};
            color: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            ${markerIcon}
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHTML,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(
          map.current
        );

        // Create popup content
        const popupContent = `
          <div style="font-family: Arial, sans-serif; min-width: 200px;">
            <h4 style="margin: 0 0 8px 0; color: #1F2937; font-weight: bold;">${name}</h4>
            <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
              <strong>Type:</strong> ${type.charAt(0).toUpperCase() + type.slice(1)}
            </p>
            ${
              info
                ? `<p style="margin: 4px 0; color: #6B7280; font-size: 12px;">${info}</p>`
                : ""
            }
            <p style="margin: 4px 0; color: #6B7280; font-size: 11px;">
              Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}
            </p>
          </div>
        `;

        marker.bindPopup(popupContent);

        // Add marker to array for cleanup
        markers.current.push(marker);

        // Add to bounds
        bounds.extend([lat, lng]);
      } catch (err) {
        console.error(`Error adding marker for ${location.name}:`, err);
      }
    });

    // Fit map to bounds if there are locations
    if (markers.current.length > 0) {
      try {
        map.current.fitBounds(bounds, { padding: [50, 50] });
      } catch (err) {
        console.error("Error fitting bounds:", err);
      }
    }
  }, [locations, mapReady]);

  return (
    <div className="w-full h-full">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "400px",
          backgroundColor: "#F3F4F6",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />

      {!mapReady && (
        <div className="flex items-center justify-center" style={{ height: "400px" }}>
          <p className="text-gray-600">Loading map...</p>
        </div>
      )}

      {/* Legend */}
      {mapReady && (
        <div className="mt-4 bg-white rounded-lg shadow-md p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Map Legend</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">🩸</span>
              <span className="text-gray-700">Blood Donor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🏥</span>
              <span className="text-gray-700">Hospital</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🩹</span>
              <span className="text-gray-700">Blood Bank</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
