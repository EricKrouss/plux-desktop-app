import { categoryMappings } from './CategoryMappings.js';

// First, set your Mapbox access token and style
mapboxgl.accessToken = 'pk.eyJ1IjoicGx1eHNvY2lhbCIsImEiOiJjbHRubXhiYWQwNjljMmpwZnByYWVhYjFoIn0.rQTutbi8HkK1un7bJYzVNw';
const mapStyle = 'mapbox://styles/pluxsocial/cluqbo9v8002s01ql1is253ih';

// Function to initialize the map
function initializeMap(longitude, latitude) {
    const map = new mapboxgl.Map({
        container: 'map',
        style: mapStyle,
        center: [longitude, latitude],
        zoom: 16,
    });

    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    });

    map.addControl(geolocate);

    map.on('load', () => {
        geolocate.trigger(); // Ensure user's location is centered
        updateLocationsBasedOnMapCenter(map);
    });

    map.on('moveend', () => {
        throttleUpdateLocations(map);
    });
}

let isThrottled = false;
const throttleDuration = 3000; // milliseconds

function throttleUpdateLocations(map) {
    if (!isThrottled) {
        updateLocationsBasedOnMapCenter(map);
        isThrottled = true;
        setTimeout(() => { isThrottled = false; }, throttleDuration);
    }
}

async function fetchDynamicLocations(searchTerm, lng, lat) {
    const proximity = `${lng},${lat}`;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?access_token=${mapboxgl.accessToken}&limit=5&proximity=${proximity}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.features.map(feature => ({
            name: feature.text,
            type: categorizeLocation(feature),
            coordinates: feature.geometry.coordinates
        }));
    } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
    }
}

function updateLocationsBasedOnMapCenter(map) {
    const center = map.getCenter();
    const searchTerms = ['Coffee', 'Bookstore', 'Restaurant'];
    searchTerms.forEach(async term => {
        const locations = await fetchDynamicLocations(term, center.lng, center.lat);
        locations.forEach(location => createMarker(location, map));
    });
}

function createMarker(location, map) {
    const el = document.createElement('div');
    el.className = 'marker';
    const icon = matchCategoryToEmoji(location.type) || '❓'; // Using a question mark as a fallback
    el.innerHTML = icon;
    el.style.fontSize = '24px';

    new mapboxgl.Marker(el)
        .setLngLat(location.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(location.name))
        .addTo(map);
}

function categorizeLocation(feature) {
    let category = feature.properties?.category || feature.text;
    return category.toLowerCase(); 
}

function matchCategoryToEmoji(category) {
    for (const [key, emoji] of Object.entries(categoryMappings)) {
        if (category.includes(key.toLowerCase())) {
            return emoji;
        }
    }
    console.log("Unmatched category:", category);
    return '❓';
}

// Function to get the user's location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            initializeMap(position.coords.longitude, position.coords.latitude);
        }, () => {
            console.error("Geolocation is not supported by this browser or user has denied the geolocation request.");
            initializeMap(-98.5795, 39.8283); // Fallback location
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        initializeMap(-98.5795, 39.8283); // Fallback location
    }
}

// Call getLocation to start the process
getLocation();