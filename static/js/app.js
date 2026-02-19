/**
 * DinerPlacemat Main Application
 * Handles listings, search, and UI interactions
 */

// State
let allListings = [];
let filteredListings = [];
let searchTimeout = null;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const placematGrid = document.getElementById('placematGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.getElementById('mainNav');

// Initialize
async function init() {
    setupEventListeners();
    await fetchListings();
}

// Event Listeners
function setupEventListeners() {
    // Hamburger menu toggle
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
            mainNav.classList.remove('active');
        }
    });
    
    // Search input with debounce
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            handleSearch(e.target.value);
        }, 300);
    });
    
    // Search button
    document.querySelector('.search-btn').addEventListener('click', () => {
        handleSearch(searchInput.value);
    });
    
    // Enter key in search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            clearTimeout(searchTimeout);
            handleSearch(searchInput.value);
        }
    });
}

// Fetch listings from API
async function fetchListings(searchTerm = '') {
    showLoading();
    hideError();
    
    try {
        const url = searchTerm 
            ? `/api/listings?search=${encodeURIComponent(searchTerm)}`
            : '/api/listings';
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allListings = data.listings || [];
        filteredListings = [...allListings];
        
        renderPlacemat();
    } catch (error) {
        console.error('Failed to fetch listings:', error);
        showError('Failed to load listings. Please try refreshing the page.');
    } finally {
        hideLoading();
    }
}

// Handle search
function handleSearch(searchTerm) {
    fetchListings(searchTerm.trim());
}

// Render the placemat grid with listings and games
function renderPlacemat() {
    // Shuffle listings for random order
    const shuffledListings = shuffleArray([...filteredListings]);
    
    // Clear grid
    placematGrid.innerHTML = '';
    
    // Reset games for fresh generation
    gameManager.reset();
    
    // Build array of items to render (listings + games interspersed)
    const itemsToRender = [];
    let gameCount = 0;
    const maxGames = Math.max(3, Math.min(gameManager.getAvailableTypeCount(), Math.ceil(shuffledListings.length / 3)));
    
    // Always add at least one game at the start
    itemsToRender.push({ type: 'game' });
    gameCount++;
    
    // Add listings and intersperse games
    for (let i = 0; i < shuffledListings.length; i++) {
        itemsToRender.push({ type: 'listing', data: shuffledListings[i] });
        
        // Add game after every 2-4 listings (random), up to maxGames
        if (gameCount < maxGames && (i + 1) % (Math.floor(Math.random() * 3) + 2) === 0) {
            itemsToRender.push({ type: 'game' });
            gameCount++;
        }
    }
    
    // Add remaining games if we haven't hit max
    while (gameCount < Math.min(3, maxGames)) {
        itemsToRender.push({ type: 'game' });
        gameCount++;
    }
    
    // Render all items
    itemsToRender.forEach(item => {
        if (item.type === 'listing') {
            const cardSize = getRandomCardSize();
            placematGrid.appendChild(createListingCard(item.data, cardSize));
        } else {
            const game = gameManager.generateRandomGame();
            if (game) placematGrid.appendChild(createGameCard(game));
        }
    });
    
    // If no listings or games, show message
    if (itemsToRender.length === 0 || (shuffledListings.length === 0 && gameCount === 0)) {
        placematGrid.innerHTML = '<div class="no-results">No businesses found. Check back soon!</div>';
    }
}

// Create listing card element
function createListingCard(listing, size) {
    const card = document.createElement('div');
    card.className = `card listing-card card-${size}`;
    
    // Generate initials from business name
    const initials = listing.business_name
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    
    // Logo or placeholder
    const logoHtml = listing.logo_url 
        ? `<img src="${escapeHtml(listing.logo_url)}" alt="${escapeHtml(listing.business_name)} logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
        : '';
    
    const placeholderHtml = `<div class="logo-placeholder" style="${listing.logo_url ? 'display:none;' : ''}">${initials}</div>`;
    
    // Location string
    const location = [];
    if (listing.location_city) location.push(escapeHtml(listing.location_city));
    if (listing.location_state) location.push(escapeHtml(listing.location_state));
    const locationStr = location.join(', ');
    
    // Website link (truncated)
    const websiteHtml = listing.website_url 
        ? `<div class="contact"><a href="${escapeHtml(listing.website_url)}" target="_blank" rel="noopener">${escapeHtml(truncateUrl(listing.website_url))}</a></div>`
        : '';
    
    card.innerHTML = `
        <div class="logo-container">
            ${logoHtml}
            ${placeholderHtml}
        </div>
        <span class="business-type">${escapeHtml(listing.business_type)}</span>
        <h3 class="business-name">${escapeHtml(listing.business_name)}</h3>
        <p class="parish">⛪ ${escapeHtml(listing.parish)}</p>
        ${locationStr ? `<p class="location">📍 ${locationStr}</p>` : ''}
        <p class="description">${escapeHtml(truncateText(listing.description, 120))}</p>
        <div class="contact">✉️ ${escapeHtml(listing.contact_email)}</div>
        ${listing.contact_phone ? `<div class="contact">📞 ${escapeHtml(listing.contact_phone)}</div>` : ''}
        ${websiteHtml}
    `;
    
    return card;
}

// Create game card element
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = `card game-card card-${game.height}`;

    card.innerHTML = `
        <h3>${game.title}</h3>
        <div class="game-container">
            ${game.content}
        </div>
    `;

    // Initialize game if needed (e.g., for canvas-based games)
    if (game.init) {
        requestAnimationFrame(() => {
            const gameContainer = card.querySelector('.game-container');
            if (gameContainer) {
                game.init(gameContainer);
            }
        });
    }

    return card;
}

// Get random card size
function getRandomCardSize() {
    const sizes = ['small', 'small', 'medium', 'medium', 'large'];
    return sizes[Math.floor(Math.random() * sizes.length)];
}

// Shuffle array (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Utility: Truncate text
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Utility: Truncate URL for display
function truncateUrl(url) {
    if (!url) return '';
    return url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
}

// Loading state
function showLoading() {
    loadingIndicator.classList.remove('hidden');
    placematGrid.classList.add('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
    placematGrid.classList.remove('hidden');
}

// Error state
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    placematGrid.classList.add('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
