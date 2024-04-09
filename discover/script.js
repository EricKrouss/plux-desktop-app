import { categoryMappings } from './CategoryMappings.js';
import { data } from './business_data.js';

// Set your Mapbox access token and style
mapboxgl.accessToken = 'pk.eyJ1IjoicGx1eHNvY2lhbCIsImEiOiJjbHRubXhiYWQwNjljMmpwZnByYWVhYjFoIn0.rQTutbi8HkK1un7bJYzVNw';
const mapStyle = 'mapbox://styles/pluxsocial/cluqbo9v8002s01ql1is253ih';

let map;
export function initializeMap(longitude, latitude) {
    map = new mapboxgl.Map({
        container: 'map',
        style: mapStyle,
        center: [longitude, latitude],
        zoom: 16
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', () => {
        addBusinessMarkers(map);

        map.on('zoom', () => {
            adjustMarkerContentBasedOnZoom(map);
        });
    });
}

function addBusinessMarkers(map) {
    data.forEach(business => {
        const categoryKeys = Object.keys(categoryMappings);
        let emoji = '❓'; // Default emoji
        categoryKeys.forEach(key => {
            if (key.split(', ').includes(business.category.toLowerCase())) {
                emoji = categoryMappings[key];
            }
        });

        createMarker(map, business.coordinates, emoji, `${emoji} ${business.name}`);
    });
}

function createMarker(map, coordinates, emojiContent, fullContent) {
    const markerEl = document.createElement('div');
    markerEl.className = 'marker';

    const emojiEl = document.createElement('div');
    emojiEl.className = 'emoji';
    emojiEl.innerHTML = emojiContent; // Set emoji content

    const nameEl = document.createElement('div');
    nameEl.className = 'name';
    nameEl.innerHTML = fullContent.split(' ').slice(1).join(' '); // Set business name

    // Append the emoji and name elements to the marker
    markerEl.appendChild(emojiEl);
    markerEl.appendChild(nameEl);

    new mapboxgl.Marker(markerEl)
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .addTo(map);
}

export function adjustMarkerContentBasedOnZoom(map) {
    const zoomLevel = map.getZoom();
    const zoomThreshold = 15;

    document.querySelectorAll('.marker').forEach(marker => {
        const nameEl = marker.querySelector('.name');
        if (zoomLevel > zoomThreshold) {
            nameEl.style.display = 'block'; // Show the name
        } else {
            nameEl.style.display = 'none'; // Hide the name, only show the emoji
        }
    });
}

export function recenterMapOnBusiness(coordinates) {
    if (map) {
        map.flyTo({
            center: [coordinates.longitude, coordinates.latitude],
            essential: true,
            zoom: 15
        });
    }
}


initializeMap(-70.894579, 42.521524);
