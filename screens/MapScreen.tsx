import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from '../components/UIComponents';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: icon,
    shadowUrl: iconShadow,
});

// Custom Icon for User Location
const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface Supplier {
    id: number;
    name: string;
    lat: number;
    lng: number;
    type: string;
}

// Helper to generate random suppliers near a location
const generateSuppliers = (lat: number, lng: number): Supplier[] => {
    const types = ['Supermarket', 'Mall', 'Grocery Store', 'Pharmacy', 'Electronics'];
    const names = ['Uno Hypermarket', 'Ardis Center', 'Carrefour City', 'Suprette El Baraka', 'Pharmacie Centrale', 'Tech Store'];

    return Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        name: names[Math.floor(Math.random() * names.length)],
        type: types[Math.floor(Math.random() * types.length)],
        lat: lat + (Math.random() - 0.5) * 0.02, // Random offset approx 1-2km
        lng: lng + (Math.random() - 0.5) * 0.02
    }));
};

// Component to handle map view updates
const RecenterMap = ({ lat, lng }: { lat: number, lng: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], 13);
    }, [lat, lng, map]);
    return null;
};

export const MapScreen = ({ onBack }: { onBack: () => void }) => {
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    setSuppliers(generateSuppliers(latitude, longitude));
                    setLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // Fallback to Algiers
                    const defaultLat = 36.752887;
                    const defaultLng = 3.042048;
                    setLocation({ lat: defaultLat, lng: defaultLng });
                    setSuppliers(generateSuppliers(defaultLat, defaultLng));
                    setLoading(false);
                }
            );
        } else {
            // Fallback if no geolocation support
            const defaultLat = 36.752887;
            const defaultLng = 3.042048;
            setLocation({ lat: defaultLat, lng: defaultLng });
            setSuppliers(generateSuppliers(defaultLat, defaultLng));
            setLoading(false);
        }
    }, []);

    return (
        <div className="h-full flex flex-col relative">
            <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-start pointer-events-none">
                <button onClick={onBack} className="pointer-events-auto text-slate-700 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg hover:scale-110 transition-transform border border-white/50">
                    <Icon name="arrow_back" />
                </button>
                <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/50 pointer-events-auto">
                    <h2 className="font-bold text-slate-800 text-sm">Nearby Suppliers</h2>
                </div>
            </div>

            <div className="h-[70vh] w-full rounded-3xl overflow-hidden shadow-inner border border-white/50 relative">
                {loading && (
                    <div className="absolute inset-0 z-[1001] bg-slate-100/50 backdrop-blur-sm flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {location && (
                    <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <RecenterMap lat={location.lat} lng={location.lng} />

                        {/* User Location */}
                        <Marker position={[location.lat, location.lng]} icon={userIcon}>
                            <Popup>
                                <div className="font-sans font-bold text-slate-800">You are here</div>
                            </Popup>
                        </Marker>

                        {/* Suppliers */}
                        {suppliers.map(supplier => (
                            <Marker key={supplier.id} position={[supplier.lat, supplier.lng]}>
                                <Popup>
                                    <div className="font-sans">
                                        <h3 className="font-bold text-slate-800">{supplier.name}</h3>
                                        <p className="text-slate-500 text-xs">{supplier.type}</p>
                                        <span className="text-green-600 text-xs font-bold">Credit Available</span>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>

            <div className="mt-4 px-2">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <Icon name="my_location" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Real-time Location</h4>
                        <p className="text-xs text-slate-500">Showing suppliers near you</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
