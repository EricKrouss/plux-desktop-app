import { categoryIcons } from './data.js';

mapboxgl.accessToken = 'pk.eyJ1IjoicGx1eHNvY2lhbCIsImEiOiJjbHRubXhiYWQwNjljMmpwZnByYWVhYjFoIn0.rQTutbi8HkK1un7bJYzVNw';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/pluxsocial/clupyr3v405ch01qqh4f46ede',
    center: [-70.8962810821839, 42.52135233325506],
    zoom: 16,
});

map.on('load', () => {
    updateLocationsBasedOnMapCenter(); // Fetch and display locations based on the initial map center
    map.on('moveend', updateLocationsBasedOnMapCenter); // Update locations when the map is moved
});

async function fetchDynamicLocations(searchTerm, lng, lat) {
    const proximity = `${lng},${lat}`;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?access_token=${mapboxgl.accessToken}&limit=5&proximity=${proximity}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.features.map(feature => ({
            name: feature.text,
            type: categorizeLocation(feature), // Utilize categorizeLocation function here
            coordinates: feature.geometry.coordinates
        }));
    } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
    }
}

function updateLocationsBasedOnMapCenter() {
    const center = map.getCenter();
    const searchTerms = ['Coffee', 'Bookstore', 'Restaurant'];
    searchTerms.forEach(async term => {
        const locations = await fetchDynamicLocations(term, center.lng, center.lat);
        locations.forEach(location => createMarker(location));
    });
}

function createMarker(location) {
    const el = document.createElement('div');
    el.className = 'marker';
    const icon = categoryIcons[location.type] || categoryIcons.default;
    el.innerHTML = icon;
    el.style.fontSize = '24px';

    new mapboxgl.Marker(el)
        .setLngLat(location.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(location.name))
        .addTo(map);
}

function categorizeLocation(feature) {
    // Implement categorization logic based on feature's properties or name
    // This example uses simple includes checks; extend or adjust as needed
    const nameLower = feature.text.toLowerCase();
    if (nameLower.includes('cafe') || nameLower.includes('coffee')) {
        return 'coffee';
    } else if (nameLower.includes('book')) {
        return 'bookstore';
    } else if (nameLower.includes('brewery')) {
        return 'brewery';
    } else if (nameLower.includes('restaurant') || nameLower.includes('diner')) {
        return 'food';
    }
    return 'default'; // Default category for unmatched types
}

// Add geolocate control to the map for user's location
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    })
);
