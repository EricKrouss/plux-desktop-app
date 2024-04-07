import { data, categoryIcons } from './data.js';

mapboxgl.accessToken = 'pk.eyJ1IjoicGx1eHNvY2lhbCIsImEiOiJjbHRubXhiYWQwNjljMmpwZnByYWVhYjFoIn0.rQTutbi8HkK1un7bJYzVNw';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/pluxsocial/clupyr3v405ch01qqh4f46ede', // style URL
    center: [-70.8962810821839, 42.52135233325506], // Updated to center on one of the locations
    zoom: 14 // Adjusted zoom to show the area of interest
});

map.on('load', () => {
    data.forEach(location => {
        const el = document.createElement('div');
        el.className = 'marker';

        // Determine icon based on the first category listed for the location
        // This approach can be modified based on your requirements
        const icon = categoryIcons[location.category[0]] || categoryIcons.default;

        // Set the icon as the inner HTML of the marker element
        // Adjust this section if using image URLs instead of emojis
        el.innerHTML = icon;
        el.style.fontSize = '24px'; // Adjust size as needed for emojis
        // For image URLs, you would set background image properties here

        new mapboxgl.Marker(el)
            .setLngLat([location.lng, location.lat])
            .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setText(location.name))
            .addTo(map);
    });
});

// Add geolocate control to the map.
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
    })
);
