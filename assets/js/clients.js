/* ========================================
   CLIENT SHOWCASE COMPONENTS
   ======================================== */

// Client data with coordinates and categories
const clientsData = {
    hospitality: [
        { name: "Tsebafrica Solutions", location: "TUT Soshanguve", lat: -25.5125, lng: 28.1058, featured: false },
        { name: "Maakeal Tuck Shop", location: "Laudium", lat: -25.7562, lng: 28.1058, featured: false },
        { name: "Fix Me Coffee", location: "Centurion", lat: -25.8598, lng: 28.1883, featured: false },
        { name: "45 Mobile Kitchens", location: "Centurion/Midrand/PTA", lat: -25.8598, lng: 28.1883, featured: true },
        { name: "Plan B Cafe", location: "Mabopane", lat: -25.4920, lng: 28.1058, featured: false },
        { name: "Lime Tree Schwarma", location: "R55 Mall", lat: -25.8598, lng: 28.1883, featured: true },
        { name: "Cooked Baked", location: "Centurion", lat: -25.8598, lng: 28.1883, featured: false },
        { name: "Little Heaven Donuts", location: "Centurion", lat: -25.8598, lng: 28.1883, featured: false },
        { name: "Sout en Peper Enterprise", location: "Centurion", lat: -25.8598, lng: 28.1883, featured: false }
    ],
    healthcare: [
        { name: "Phoenix Healthcare", location: "Edenvale", lat: -26.1410, lng: 28.1510, featured: false },
        { name: "Local Choice Bronberrik Apteek", location: "Centurion", lat: -25.8598, lng: 28.1883, featured: false },
        { name: "Maboea Street Pharmacy", location: "Attridgeville", lat: -25.7739, lng: 28.0553, featured: false }
    ],
    education: [
        { name: "Bakwena Students Residence", location: "PTA", lat: -25.7479, lng: 28.2293, featured: false },
        { name: "Footprints Early Learning", location: "PTA West", lat: -25.7479, lng: 28.1293, featured: false },
        { name: "Doves Nest Place of Safety", location: "Centurion", lat: -25.8598, lng: 28.1883, featured: false },
        { name: "Kwa Pretty Students", location: "UJ Soweto", lat: -26.2667, lng: 27.8633, featured: true },
        { name: "Maake Properties", location: "PTA West", lat: -25.7479, lng: 28.1293, featured: false }
    ],
    general: [
        { name: "EMRC Group", location: "PTA", lat: -25.7479, lng: 28.2293, featured: false },
        { name: "Alawt International", location: "Centurion", lat: -25.8598, lng: 28.1883, featured: false },
        { name: "Umqwayto Biltong", location: "Centurion", lat: -25.8598, lng: 28.1883, featured: false },
        { name: "JG Supermarket", location: "Olieven", lat: -25.8598, lng: 28.1883, featured: false },
        { name: "Ikemisetse Mocha Events", location: "Centurion", lat: -25.8598, lng: 28.1883, featured: false },
        { name: "Madina Supermarket", location: "Centurion", lat: -25.8598, lng: 28.1883, featured: false },
        { name: "Post link Sinoville", location: "Sinoville", lat: -25.7000, lng: 28.2500, featured: false },
        { name: "Home Industry Eternal Moments", location: "Centurion", lat: -25.8598, lng: 28.1883, featured: false },
        { name: "Seperi Wa Rona", location: "Hammanskraal", lat: -25.4111, lng: 28.2756, featured: false },
        { name: "St Mary General Dealer", location: "Centurion", lat: -25.8598, lng: 28.1883, featured: false },
        { name: "Thuto ke Khumo", location: "PTA", lat: -25.7479, lng: 28.2293, featured: false }
    ]
};

// Get all clients in a single array
function getAllClients() {
    const all = [];
    Object.keys(clientsData).forEach(category => {
        clientsData[category].forEach(client => {
            all.push({ ...client, category });
        });
    });
    return all;
}

// ========== LAYOUT A: INTERACTIVE LEAFLET MAP ==========
function initClientsMap() {
    const mapContainer = document.getElementById('client-map'); // Fixed ID (was 'clients-map')
    if (!mapContainer) {
        console.error('Map container #client-map not found');
        return;
    }
    
    const allClients = getAllClients();
    
    // Initialize Leaflet map centered on Gauteng
    const map = L.map('client-map').setView([-25.7479, 28.2293], 10);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        minZoom: 9
    }).addTo(map);
    
    // Custom icon colors for different categories
    const categoryColors = {
        hospitality: '#FF6B35',  // Orange
        healthcare: '#DC3545',   // Red
        education: '#28A745',    // Green
        general: '#5A6E5A'       // Sage
    };
    
    // Create custom marker icons
    function createCustomIcon(category, featured) {
        const color = categoryColors[category] || '#5A6E5A';
        const size = featured ? 14 : 10;
        
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                ${featured ? 'animation: pulse 2s infinite;' : ''}
            "></div>`,
            iconSize: [size, size],
            iconAnchor: [size/2, size/2]
        });
    }
    
    // Category icons for popups
    const categoryIcons = {
        hospitality: 'utensils',
        healthcare: 'heart-pulse',
        education: 'school',
        general: 'briefcase'
    };
    
    // Add markers for all clients
    allClients.forEach(client => {
        const icon = createCustomIcon(client.category, client.featured);
        
        const marker = L.marker([client.lat, client.lng], { icon: icon })
            .addTo(map);
        
        // Create popup content
        const popupContent = `
            <div style="min-width: 200px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <div style="
                        width: 32px;
                        height: 32px;
                        background: ${categoryColors[client.category]};
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                    ">
                        <i data-lucide="${categoryIcons[client.category]}" style="width: 18px; height: 18px;"></i>
                    </div>
                    <strong style="font-size: 16px; color: #2C3E2C;">${client.name}</strong>
                </div>
                <div style="display: flex; align-items: center; gap: 4px; color: #5A6E5A; margin-bottom: 4px;">
                    <i data-lucide="map-pin" style="width: 14px; height: 14px;"></i>
                    <span style="font-size: 14px;">${client.location}</span>
                </div>
                <div style="font-size: 12px; color: #7A8A7A; text-transform: capitalize;">
                    ${client.category}
                </div>
                ${client.featured ? '<div style="display: inline-block; background: #FF6B35; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-top: 8px;">Featured Client ⭐</div>' : ''}
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Initialize Lucide icons in popup after it opens
        marker.on('popupopen', function() {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });
    
    // Add legend
    const legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'map-legend');
        div.innerHTML = `
            <div style="background: white; padding: 12px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Client Categories</h4>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <div style="width: 12px; height: 12px; background: ${categoryColors.hospitality}; border-radius: 50%; border: 2px solid white;"></div>
                        <span style="font-size: 12px;">Hospitality</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <div style="width: 12px; height: 12px; background: ${categoryColors.healthcare}; border-radius: 50%; border: 2px solid white;"></div>
                        <span style="font-size: 12px;">Healthcare</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <div style="width: 12px; height: 12px; background: ${categoryColors.education}; border-radius: 50%; border: 2px solid white;"></div>
                        <span style="font-size: 12px;">Education</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <div style="width: 12px; height: 12px; background: ${categoryColors.general}; border-radius: 50%; border: 2px solid white;"></div>
                        <span style="font-size: 12px;">General</span>
                    </div>
                    <hr style="margin: 6px 0; border: none; border-top: 1px solid #e0e0e0;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <div style="width: 14px; height: 14px; background: #FF6B35; border-radius: 50%; border: 2px solid white;"></div>
                        <span style="font-size: 12px; font-weight: 600;">Featured</span>
                    </div>
                </div>
            </div>
        `;
        return div;
    };
    
    legend.addTo(map);
    
    console.log(`Leaflet map initialized with ${allClients.length} client markers`);
}

// ========== LAYOUT B: TABBED INTERFACE ==========
function initClientsTabs() {
    const tabsContainer = document.getElementById('clients-tabs');
    if (!tabsContainer) return;
    
    const categories = {
        hospitality: { name: 'Hospitality', icon: 'utensils' },
        healthcare: { name: 'Healthcare', icon: 'heart-pulse' },
        education: { name: 'Housing/Education', icon: 'school' },
        general: { name: 'General', icon: 'briefcase' }
    };
    
    // Create tabs header
    const tabsHeader = document.createElement('div');
    tabsHeader.className = 'tabs-header';
    
    Object.keys(categories).forEach((key, index) => {
        const button = document.createElement('button');
        button.className = `tab-button ${index === 0 ? 'active' : ''}`;
        button.setAttribute('data-tab', key);
        button.innerHTML = `<i data-lucide="${categories[key].icon}"></i> ${categories[key].name}`;
        button.addEventListener('click', () => switchTab(key));
        tabsHeader.appendChild(button);
    });
    
    tabsContainer.appendChild(tabsHeader);
    
    // Create tab contents
    const tabsContent = document.createElement('div');
    tabsContent.className = 'tabs-contents';
    
    Object.keys(categories).forEach((key, index) => {
        const content = document.createElement('div');
        content.className = `tab-content ${index === 0 ? 'active' : ''}`;
        content.setAttribute('data-content', key);
        
        const slider = document.createElement('div');
        slider.className = 'clients-slider';
        
        const track = document.createElement('div');
        track.className = 'slider-track';
        
        // Sort: featured first
        const clients = [...clientsData[key]].sort((a, b) => b.featured - a.featured);
        
        clients.forEach(client => {
            const card = createClientCard(client);
            track.appendChild(card);
        });
        
        slider.appendChild(track);
        content.appendChild(slider);
        tabsContent.appendChild(content);
    });
    
    tabsContainer.appendChild(tabsContent);
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function createClientCard(client) {
    const card = document.createElement('div');
    card.className = `client-card ${client.featured ? 'featured' : ''} fade-in`;
    
    const iconMap = {
        hospitality: 'utensils',
        healthcare: 'heart-pulse',
        education: 'school',
        general: 'briefcase'
    };
    
    card.innerHTML = `
        <div class="client-card-header">
            <div class="client-icon">
                <i data-lucide="${iconMap[client.category] || 'building-2'}"></i>
            </div>
            <div class="client-info">
                <h4>${client.name}</h4>
                <div class="client-location">
                    <i data-lucide="map-pin"></i>
                    <span>${client.location}</span>
                </div>
            </div>
        </div>
        ${client.featured ? '<span class="client-badge">Featured</span>' : ''}
    `;
    
    return card;
}

function switchTab(tabKey) {
    // Update buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabKey}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelector(`[data-content="${tabKey}"]`).classList.add('active');
    
    // Trigger scroll animations
    const activeContent = document.querySelector(`[data-content="${tabKey}"]`);
    const cards = activeContent.querySelectorAll('.client-card');
    
    // Reset animations
    cards.forEach(card => {
        card.classList.remove('visible');
    });
    
    // Trigger animations with delay
    setTimeout(() => {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 50);
        });
    }, 50);
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Export functions to global scope for inline handlers
window.switchTab = switchTab;

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initClientsMap();
        initClientsTabs();
    });
} else {
    initClientsMap();
    initClientsTabs();
}