import React from 'react';
import { useEffect } from 'react';
import './index.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import '../../../node_modules/leaflet/dist/leaflet.css';
import '../../../node_modules/leaflet/dist/images/marker-icon.png';

interface P {}

export default (props: P) => {
	useEffect(() => {}, []);

	return (
		<>
			<div style={{ height: '1000px', width: '1000px' }}>
				<MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
					<TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
					<Marker position={[51.505, -0.09]}>
						<Popup>
							popup
						</Popup>
					</Marker>
				</MapContainer>
			</div>
		</>
	);
};
