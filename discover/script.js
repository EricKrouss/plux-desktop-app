import { categoryMappings } from './CategoryMappings.js';

mapboxgl.accessToken = 'pk.eyJ1IjoicGx1eHNvY2lhbCIsImEiOiJjbHRubXhiYWQwNjljMmpwZnByYWVhYjFoIn0.rQTutbi8HkK1un7bJYzVNw';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/pluxsocial/clupyr3v405ch01qqh4f46ede',
    center: [-70.8962810821839, 42.52135233325506],
    zoom: 16,
});

map.on('load', () => {
    updateLocationsBasedOnMapCenter();
    map.on('moveend', updateLocationsBasedOnMapCenter);
});

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

map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    })
);
