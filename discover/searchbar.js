// Import the data and the function to recenter the map on a business
import { data } from './business_data.js';
import { recenterMapOnBusiness } from './script.js';

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResultsContainer = document.getElementById('searchResults');

    searchInput.addEventListener('input', function() {
        const searchValue = searchInput.value.toLowerCase().trim();

        // If the search input is empty, clear the search results and return early
        if (!searchValue) {
            searchResultsContainer.innerHTML = '';
            return;
        }

        // Filter businesses based on the search value
        const filteredBusinesses = data.filter(business =>
            business.name.toLowerCase().includes(searchValue) || business.category.toLowerCase().includes(searchValue)
        );

        // Clear previous results
        searchResultsContainer.innerHTML = '';

        // Populate search results
        filteredBusinesses.forEach(business => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result-item');
            resultItem.textContent = business.name;

            // Clicking on a result re-centers the map on the business's coordinates and clears the results
            resultItem.addEventListener('click', () => {
                recenterMapOnBusiness(business.coordinates);
                searchResultsContainer.innerHTML = ''; // Clear the results container
                searchInput.value = ''; // Optionally clear the search input
            });

            searchResultsContainer.appendChild(resultItem);
        });

        // Show "no results found" if no businesses match the search
        if (filteredBusinesses.length === 0) {
            searchResultsContainer.innerHTML = '<div class="search-result-item">No results found</div>';
        }
    });
});
