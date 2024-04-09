import { categoryMappings } from './CategoryMappings.js';
import { toggleMarkerVisibility } from './script.js';

const filterBtn = document.getElementById('filterToggle');
const filterContainer = document.createElement('div');
filterContainer.id = 'filter-container';
document.body.appendChild(filterContainer);

Object.entries(categoryMappings).forEach(([category, emoji]) => {
    const label = document.createElement('label');
    label.innerHTML = `${emoji} ${category.split(',')[0]}`;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.addEventListener('change', () => toggleMarkerVisibility(category, checkbox.checked));
    
    label.prepend(checkbox);
    filterContainer.appendChild(label);
});

filterContainer.style.display = 'none'; // Initially hidden
filterBtn.addEventListener('click', () => {
    filterContainer.style.display = filterContainer.style.display === 'none' ? 'block' : 'none';
});

// Styling updates for vertical stacking and appearance
filterContainer.style.position = 'absolute';
filterContainer.style.right = '10px';
filterContainer.style.top = '100px';
filterContainer.style.backgroundColor = '#fff';
filterContainer.style.borderRadius = '8px';
filterContainer.style.padding = '10px';
filterContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
filterContainer.style.display = 'flex';
filterContainer.style.flexDirection = 'column';
