// --- DOM Elements ---
const modalProfile = document.getElementById('profile-modal');
const btnEditProfile = document.getElementById('btn-edit-profile');
const btnThemeToggle = document.getElementById('btn-theme-toggle');
const btnSaveProfile = document.getElementById('btn-save-profile');
const inputLimitKalium = document.getElementById('limit-kalium');
const inputLimitFosfor = document.getElementById('limit-fosfor');
const inputLimitNatrium = document.getElementById('limit-natrium');
const inputLimitAir = document.getElementById('limit-air');

const loadingOverlay = document.getElementById('loading-overlay');
const currentDateEl = document.getElementById('current-date');

const kaliumText = document.getElementById('kalium-text');
const fosforText = document.getElementById('fosfor-text');
const kaliumBar = document.getElementById('kalium-bar');
const fosforBar = document.getElementById('fosfor-bar');
const kaliumAlert = document.getElementById('kalium-alert');
const fosforAlert = document.getElementById('fosfor-alert');

const natriumText = document.getElementById('natrium-text');
const natriumBar = document.getElementById('natrium-bar');
const natriumAlert = document.getElementById('natrium-alert');

const airText = document.getElementById('air-text');
const airBar = document.getElementById('air-bar');
const airAlert = document.getElementById('air-alert');

const searchLabel = document.getElementById('search-label');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const selectedCard = document.getElementById('selected-ingredient-card');
const selName = document.getElementById('sel-name');
const selCategory = document.getElementById('sel-category');
const selKalium = document.getElementById('sel-kalium');
const selFosfor = document.getElementById('sel-fosfor');
const selNatrium = document.getElementById('sel-natrium');
const selAir = document.getElementById('sel-air');
const nullWarning = document.getElementById('null-warning');

const portionInput = document.getElementById('portion-input');
const previewKalium = document.getElementById('preview-kalium');
const previewFosfor = document.getElementById('preview-fosfor');
const previewNatrium = document.getElementById('preview-natrium');
const previewAir = document.getElementById('preview-air');
const btnAddEntry = document.getElementById('btn-add-entry');

const logList = document.getElementById('log-list');
const logCount = document.getElementById('log-count');

// --- Tab & Recipe DOM Elements ---
const tabSemua = document.getElementById('tab-semua');
const tabMentah = document.getElementById('tab-mentah');
const tabOlahan = document.getElementById('tab-olahan');
const btnOpenRecipe = document.getElementById('btn-open-recipe');
const recipeModal = document.getElementById('recipe-modal');
const btnCancelRecipe = document.getElementById('btn-cancel-recipe');
const btnSaveRecipe = document.getElementById('btn-save-recipe');

const recipeNameInput = document.getElementById('recipe-name');
const recipeSearchInput = document.getElementById('recipe-search');
const recipeSearchResults = document.getElementById('recipe-search-results');
const recipeSelectedCard = document.getElementById('recipe-selected-card');
const recipeSelName = document.getElementById('recipe-sel-name');
const recipePortionInput = document.getElementById('recipe-portion');
const btnAddRecipeItem = document.getElementById('btn-add-recipe-item');

const recipeItemsList = document.getElementById('recipe-items-list');
const recipeEmpty = document.getElementById('recipe-empty');
const recipeTotalWeight = document.getElementById('recipe-total-weight');
const recipeK100 = document.getElementById('recipe-k-100');
const recipeP100 = document.getElementById('recipe-p-100');
const recipeNa100 = document.getElementById('recipe-na-100');
const recipeAir100 = document.getElementById('recipe-air-100');

// --- State Variables ---
let foodDatabase = [];
let customFoods = [];
let userProfile = null;
let dailyLogs = {};
let selectedIngredient = null;
let currentDateStr = "";
let searchMode = "Semua"; // "Semua", "Mentah", or "Olahan"

// Recipe Builder State
let currentRecipeItems = [];
let recipeSelectedIngredient = null;


// --- Initialization ---
async function initApp() {
    // Set Current Date
    const today = new Date();
    currentDateStr = today.toISOString().split('T')[0];
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = today.toLocaleDateString('id-ID', options);

    // Load Local Storage
    loadLocalStorage();

    // Fetch Database
    try {
        const response = await fetch('data_gizi_ggk_final.json');
        const json = await response.json();
        // Assuming the structure has "data" array as per user's prompt
        foodDatabase = json.data || [];
        loadingOverlay.classList.add('hidden');
    } catch (error) {
        console.error("Gagal memuat data gizi:", error);
        alert("Terjadi kesalahan saat memuat data gizi. Pastikan file JSON tersedia.");
        loadingOverlay.classList.add('hidden');
    }

    // Check Profile
    if (!userProfile) {
        modalProfile.classList.remove('hidden');
    } else {
        updateDashboard();
    }
    
    // Check Theme
    const isDark = localStorage.getItem('ggk_dark_mode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        btnThemeToggle.textContent = '☀️';
    }
}


// --- Local Storage Operations ---
function loadLocalStorage() {
    const savedProfile = localStorage.getItem('ggk_user_profile');
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
        if (!userProfile.natriumLimit) userProfile.natriumLimit = 2000;
        if (!userProfile.airLimit) userProfile.airLimit = 1500;
        inputLimitKalium.value = userProfile.kaliumLimit;
        inputLimitFosfor.value = userProfile.fosforLimit;
        inputLimitNatrium.value = userProfile.natriumLimit;
        inputLimitAir.value = userProfile.airLimit;
    }

    const savedLogs = localStorage.getItem('ggk_daily_logs');
    if (savedLogs) {
        dailyLogs = JSON.parse(savedLogs);
    }
    
    // Ensure array exists for today
    if (!dailyLogs[currentDateStr]) {
        dailyLogs[currentDateStr] = [];
    }

    // Load Custom Foods (Recipes)
    const savedCustomFoods = localStorage.getItem('ggk_custom_foods');
    if (savedCustomFoods) {
        customFoods = JSON.parse(savedCustomFoods);
    }
}

function saveProfile() {
    const kLimit = parseInt(inputLimitKalium.value);
    const pLimit = parseInt(inputLimitFosfor.value);
    const naLimit = parseInt(inputLimitNatrium.value) || 2000;
    const airLimit = parseInt(inputLimitAir.value) || 1500;

    if (!kLimit || !pLimit || kLimit <= 0 || pLimit <= 0 || naLimit <= 0 || airLimit <= 0) {
        alert("Harap masukkan angka yang valid untuk semua batas harian.");
        return;
    }

    userProfile = { kaliumLimit: kLimit, fosforLimit: pLimit, natriumLimit: naLimit, airLimit: airLimit };
    localStorage.setItem('ggk_user_profile', JSON.stringify(userProfile));
    modalProfile.classList.add('hidden');
    updateDashboard();
}

function saveLogs() {
    localStorage.setItem('ggk_daily_logs', JSON.stringify(dailyLogs));
}

function saveCustomFoods() {
    localStorage.setItem('ggk_custom_foods', JSON.stringify(customFoods));
}


// --- UI Updates ---
function updateDashboard() {
    if (!userProfile) return;

    const todayLogs = dailyLogs[currentDateStr] || [];
    let totalKalium = 0;
    let totalFosfor = 0;
    let totalNatrium = 0;
    let totalAir = 0;

    todayLogs.forEach(log => {
        totalKalium += log.kalium_konsumsi || 0;
        totalFosfor += log.fosfor_konsumsi || 0;
        totalNatrium += log.natrium_konsumsi || 0;
        totalAir += log.air_konsumsi || 0;
    });

    const naLimit = userProfile.natriumLimit || 2000;
    const airLimit = userProfile.airLimit || 1500;

    // Update Text
    kaliumText.textContent = `${totalKalium.toFixed(1)} / ${userProfile.kaliumLimit} mg`;
    fosforText.textContent = `${totalFosfor.toFixed(1)} / ${userProfile.fosforLimit} mg`;
    natriumText.textContent = `${totalNatrium.toFixed(1)} / ${naLimit} mg`;
    airText.textContent = `${totalAir.toFixed(1)} / ${airLimit} ml`;

    // Update Progress Bars
    let kPercent = (totalKalium / userProfile.kaliumLimit) * 100;
    let pPercent = (totalFosfor / userProfile.fosforLimit) * 100;
    let naPercent = (totalNatrium / naLimit) * 100;
    let airPercent = (totalAir / airLimit) * 100;
    
    // Cap at 100% for visual width
    kaliumBar.style.width = `${Math.min(kPercent, 100)}%`;
    fosforBar.style.width = `${Math.min(pPercent, 100)}%`;
    natriumBar.style.width = `${Math.min(naPercent, 100)}%`;
    airBar.style.width = `${Math.min(airPercent, 100)}%`;

    // Color and Alert Logic
    updateProgressBarState(kPercent, kaliumBar, kaliumAlert, "Kalium");
    updateProgressBarState(pPercent, fosforBar, fosforAlert, "Fosfor");
    updateProgressBarState(naPercent, natriumBar, natriumAlert, "Natrium");
    updateProgressBarState(airPercent, airBar, airAlert, "Cairan");

    renderLogList(todayLogs);
}

function updateProgressBarState(percent, barElement, alertElement, nutrientName) {
    // Reset classes
    barElement.style.backgroundColor = ""; // rely on CSS class if empty, or override
    alertElement.classList.add('hidden');
    alertElement.classList.remove('alert-warning', 'alert-danger');

    if (percent >= 100) {
        barElement.style.backgroundColor = 'var(--danger)';
        alertElement.textContent = `⚠ Batas ${nutrientName} harian telah terlampaui!`;
        alertElement.classList.add('alert-danger');
        alertElement.classList.remove('hidden');
    } else if (percent >= 80) {
        barElement.style.backgroundColor = 'var(--warning)';
        alertElement.textContent = `⚠ Anda hampir mendekati batas ${nutrientName} harian.`;
        alertElement.classList.add('alert-warning');
        alertElement.classList.remove('hidden');
    } else {
        // Reset to original color via CSS variables
        if(nutrientName === "Kalium") barElement.style.backgroundColor = 'var(--kalium-color)';
        if(nutrientName === "Fosfor") barElement.style.backgroundColor = 'var(--fosfor-color)';
        if(nutrientName === "Natrium") barElement.style.backgroundColor = 'var(--natrium-color)';
        if(nutrientName === "Cairan") barElement.style.backgroundColor = 'var(--air-color)';
    }
}

function renderLogList(logs) {
    logList.innerHTML = '';
    logCount.textContent = logs.length;

    if (logs.length === 0) {
        logList.innerHTML = '<li class="empty-state">Belum ada catatan asupan hari ini.</li>';
        return;
    }

    // Render in reverse chronological order (newest first)
    const reversedLogs = [...logs].reverse();

    reversedLogs.forEach(log => {
        const li = document.createElement('li');
        li.className = 'log-item';
        const kVal = (log.kalium_konsumsi || 0).toFixed(1);
        const pVal = (log.fosfor_konsumsi || 0).toFixed(1);
        const naVal = (log.natrium_konsumsi || 0).toFixed(1);
        const airVal = (log.air_konsumsi || 0).toFixed(1);
        li.innerHTML = `
            <div class="log-item-info">
                <div class="log-item-name">${log.nama_bahan} <span class="text-sm font-normal text-gray">(${log.porsi_g}g)</span></div>
                <div class="log-item-details" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px;">
                    <span class="kalium-text font-semibold">K: ${kVal} mg</span>
                    <span class="fosfor-text font-semibold">P: ${pVal} mg</span>
                    <span class="natrium-text font-semibold">Na: ${naVal} mg</span>
                    <span class="air-text font-semibold">Air: ${airVal} ml</span>
                </div>
            </div>
            <div>
                <button class="btn-warning-sm" onclick="editEntry('${log.id}')">Edit</button>
                <button class="btn-danger-sm" onclick="deleteEntry('${log.id}')">Hapus</button>
            </div>
        `;
        logList.appendChild(li);
    });
}


// --- Tab Switching ---
function switchTab(mode) {
    searchMode = mode;
    searchInput.value = '';
    searchResults.classList.add('hidden');
    selectedCard.classList.add('hidden');
    selectedIngredient = null;
    
    if (tabSemua) tabSemua.classList.remove('active');
    tabMentah.classList.remove('active');
    tabOlahan.classList.remove('active');

    if (mode === "Semua") {
        if (tabSemua) tabSemua.classList.add('active');
        searchLabel.textContent = "Cari Semua Bahan & Masakan";
        searchInput.placeholder = "Ketik nama bahan/masakan (misal: kangkung)...";
        btnOpenRecipe.classList.remove('hidden');
    } else if (mode === "Mentah") {
        tabMentah.classList.add('active');
        searchLabel.textContent = "Cari Bahan Mentah";
        searchInput.placeholder = "Ketik nama bahan mentah...";
        btnOpenRecipe.classList.add('hidden');
    } else {
        tabOlahan.classList.add('active');
        searchLabel.textContent = "Cari Masakan / Resep Olahan";
        searchInput.placeholder = "Ketik nama masakan / resep...";
        btnOpenRecipe.classList.remove('hidden');
    }
}

if (tabSemua) tabSemua.addEventListener('click', () => switchTab("Semua"));
tabMentah.addEventListener('click', () => switchTab("Mentah"));
tabOlahan.addEventListener('click', () => switchTab("Olahan"));


// --- Main Search & Autocomplete ---
searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    searchResults.innerHTML = '';
    
    if (query.length < 2) {
        searchResults.classList.add('hidden');
        return;
    }

    // Determine target dataset based on tab
    let targetData = [];
    if (searchMode === "Mentah") {
        targetData = foodDatabase.filter(d => d.tipe === "Mentah");
    } else if (searchMode === "Olahan") {
        // Combine Olahan from JSON + Custom User Foods
        const dbOlahan = foodDatabase.filter(d => d.tipe === "Olahan");
        targetData = [...customFoods, ...dbOlahan];
    } else {
        // "Semua": All food database + Custom foods
        targetData = [...foodDatabase, ...customFoods];
    }

    const keywords = query.split(' ').filter(k => k.length > 0);
    const matched = targetData.filter(item => {
        const itemName = item.nama_bahan.toLowerCase();
        return keywords.every(kw => itemName.includes(kw));
    });

    // Smart Relevance Sorting
    matched.sort((a, b) => {
        const aName = a.nama_bahan.toLowerCase();
        const bName = b.nama_bahan.toLowerCase();

        // 1. Exact match
        if (aName === query && bName !== query) return -1;
        if (bName === query && aName !== query) return 1;

        // 2. Starts with query (e.g. "kangkung..." vs "pelecing kangkung")
        const aStarts = aName.startsWith(query);
        const bStarts = bName.startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        // 3. Prioritize raw/fresh/standard items containing "segar"
        const aIsSegar = aName.includes("segar");
        const bIsSegar = bName.includes("segar");
        if (aIsSegar && !bIsSegar) return -1;
        if (!aIsSegar && bIsSegar) return 1;

        // 4. Shorter name length
        if (Math.abs(aName.length - bName.length) > 5) {
            return aName.length - bName.length;
        }

        // 5. Alphabetical
        return aName.localeCompare(bName, 'id');
    });

    const displayResults = matched.slice(0, 15);

    if (displayResults.length > 0) {
        searchResults.classList.remove('hidden');
        displayResults.forEach(item => {
            const li = document.createElement('li');
            const isCustom = item.isCustom ? '<span style="color:var(--primary); font-size:0.7rem; font-weight:600;">⭐ Resep Pribadi</span>' : '';
            const tipeBadge = item.tipe ? `<span class="badge ${item.tipe === 'Mentah' ? 'badge-mentah' : 'badge-olahan'}" style="font-size:0.65rem; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">${item.tipe}</span>` : '';
            li.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div><strong>${item.nama_bahan}</strong> ${tipeBadge} ${isCustom}</div>
                </div>
                <span class="item-cat">${item.kelompok || (item.tipe === "Olahan" ? "Masakan Olahan" : "Bahan Mentah")}</span>
            `;
            li.addEventListener('click', () => selectIngredient(item));
            searchResults.appendChild(li);
        });
    } else {
        searchResults.classList.remove('hidden');
        searchResults.innerHTML = '<li class="text-gray text-sm text-center">Bahan tidak ditemukan</li>';
    }
});

// Hide autocomplete when clicking outside
document.addEventListener('click', (e) => {
    if (e.target !== searchInput && e.target !== searchResults) {
        searchResults.classList.add('hidden');
    }
    if (e.target !== recipeSearchInput && e.target !== recipeSearchResults) {
        recipeSearchResults.classList.add('hidden');
    }
});

function selectIngredient(item) {
    selectedIngredient = item;
    searchInput.value = item.nama_bahan;
    searchResults.classList.add('hidden');
    selectedCard.classList.remove('hidden');

    selName.textContent = item.nama_bahan;
    selCategory.textContent = item.kelompok || "Masakan Olahan";
    
    // Handle values
    const kVal = item.kalium_mg;
    const pVal = item.fosfor_mg;
    const naVal = item.natrium_mg;
    const airVal = item.air_g;
    
    selKalium.textContent = kVal !== null && kVal !== undefined ? `${kVal.toFixed(1)} mg` : 'N/A';
    selFosfor.textContent = pVal !== null && pVal !== undefined ? `${pVal.toFixed(1)} mg` : 'N/A';
    selNatrium.textContent = naVal !== null && naVal !== undefined ? `${naVal.toFixed(1)} mg` : 'N/A';
    selAir.textContent = airVal !== null && airVal !== undefined ? `${airVal.toFixed(1)} ml` : 'N/A';

    if (kVal === null || pVal === null || kVal === undefined || pVal === undefined) {
        nullWarning.classList.remove('hidden');
    } else {
        nullWarning.classList.add('hidden');
    }

    // Reset portion
    portionInput.value = '';
    previewKalium.textContent = '0';
    previewFosfor.textContent = '0';
    previewNatrium.textContent = '0';
    previewAir.textContent = '0';
    
    // Focus portion input
    portionInput.focus();
}


// --- Main Portion Calculation ---
portionInput.addEventListener('input', function() {
    if (!selectedIngredient) return;
    
    const portion = parseFloat(this.value) || 0;
    
    // Treat null as 0 for calculation
    const kBase = selectedIngredient.kalium_mg || 0;
    const pBase = selectedIngredient.fosfor_mg || 0;
    const naBase = selectedIngredient.natrium_mg || 0;
    const airBase = selectedIngredient.air_g || 0;

    const kTotal = (kBase / 100) * portion;
    const pTotal = (pBase / 100) * portion;
    const naTotal = (naBase / 100) * portion;
    const airTotal = (airBase / 100) * portion;

    previewKalium.textContent = kTotal.toFixed(1);
    previewFosfor.textContent = pTotal.toFixed(1);
    previewNatrium.textContent = naTotal.toFixed(1);
    previewAir.textContent = airTotal.toFixed(1);
});


// --- Main Add Entry ---
btnAddEntry.addEventListener('click', () => {
    if (!selectedIngredient) return;
    
    const portion = parseFloat(portionInput.value);
    if (!portion || portion <= 0) {
        alert("Harap masukkan berat porsi yang valid (lebih dari 0).");
        return;
    }

    const kBase = selectedIngredient.kalium_mg || 0;
    const pBase = selectedIngredient.fosfor_mg || 0;
    const naBase = selectedIngredient.natrium_mg || 0;
    const airBase = selectedIngredient.air_g || 0;

    const kTotal = (kBase / 100) * portion;
    const pTotal = (pBase / 100) * portion;
    const naTotal = (naBase / 100) * portion;
    const airTotal = (airBase / 100) * portion;

    const entry = {
        id: Date.now().toString(),
        kode: selectedIngredient.kode || "CUSTOM",
        nama_bahan: selectedIngredient.nama_bahan,
        porsi_g: portion,
        kalium_konsumsi: kTotal,
        fosfor_konsumsi: pTotal,
        natrium_konsumsi: naTotal,
        air_konsumsi: airTotal,
        timestamp: new Date().toISOString()
    };

    dailyLogs[currentDateStr].push(entry);
    saveLogs();
    updateDashboard();

    // Reset UI
    selectedIngredient = null;
    searchInput.value = '';
    selectedCard.classList.add('hidden');
});

// --- Main Delete Entry ---
window.deleteEntry = function(id) {
    if (confirm("Hapus catatan asupan ini?")) {
        dailyLogs[currentDateStr] = dailyLogs[currentDateStr].filter(log => log.id !== id);
        saveLogs();
        updateDashboard();
    }
};

window.editEntry = function(id) {
    const logIndex = dailyLogs[currentDateStr].findIndex(log => log.id === id);
    if (logIndex === -1) return;
    
    const log = dailyLogs[currentDateStr][logIndex];
    const newPortion = prompt(`Masukkan berat porsi baru (gram) untuk ${log.nama_bahan}:`, log.porsi_g);
    
    if (newPortion !== null && newPortion.trim() !== "") {
        const portion = parseFloat(newPortion);
        if (portion > 0) {
            const kBase = (log.kalium_konsumsi / log.porsi_g) * 100;
            const pBase = (log.fosfor_konsumsi / log.porsi_g) * 100;
            const naBase = ((log.natrium_konsumsi || 0) / log.porsi_g) * 100;
            const airBase = ((log.air_konsumsi || 0) / log.porsi_g) * 100;
            
            log.porsi_g = portion;
            log.kalium_konsumsi = (kBase / 100) * portion;
            log.fosfor_konsumsi = (pBase / 100) * portion;
            log.natrium_konsumsi = (naBase / 100) * portion;
            log.air_konsumsi = (airBase / 100) * portion;
            
            saveLogs();
            updateDashboard();
        } else {
            alert("Berat porsi tidak valid.");
        }
    }
};


// --- Recipe Builder Logic ---
btnOpenRecipe.addEventListener('click', () => {
    recipeModal.classList.remove('hidden');
    resetRecipeBuilder();
});

btnCancelRecipe.addEventListener('click', () => {
    recipeModal.classList.add('hidden');
});

function resetRecipeBuilder() {
    recipeNameInput.value = '';
    recipeSearchInput.value = '';
    recipeSearchResults.classList.add('hidden');
    recipeSelectedCard.classList.add('hidden');
    recipePortionInput.value = '';
    currentRecipeItems = [];
    recipeSelectedIngredient = null;
    renderRecipeItems();
}

recipeSearchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    recipeSearchResults.innerHTML = '';
    
    if (query.length < 2) {
        recipeSearchResults.classList.add('hidden');
        return;
    }

    // Only search raw ingredients (Mentah)
    const targetData = foodDatabase.filter(d => d.tipe === "Mentah");
    const keywords = query.split(' ').filter(k => k.length > 0);
    const matched = targetData.filter(item => {
        const itemName = item.nama_bahan.toLowerCase();
        return keywords.every(kw => itemName.includes(kw));
    });

    // Smart Relevance Sorting
    matched.sort((a, b) => {
        const aName = a.nama_bahan.toLowerCase();
        const bName = b.nama_bahan.toLowerCase();
        if (aName === query && bName !== query) return -1;
        if (bName === query && aName !== query) return 1;
        const aStarts = aName.startsWith(query);
        const bStarts = bName.startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        const aIsSegar = aName.includes("segar");
        const bIsSegar = bName.includes("segar");
        if (aIsSegar && !bIsSegar) return -1;
        if (!aIsSegar && bIsSegar) return 1;
        return aName.localeCompare(bName, 'id');
    });

    const displayResults = matched.slice(0, 15);

    if (displayResults.length > 0) {
        recipeSearchResults.classList.remove('hidden');
        displayResults.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div><strong>${item.nama_bahan}</strong></div>
                <span class="item-cat">${item.kelompok}</span>
            `;
            li.addEventListener('click', () => selectRecipeIngredient(item));
            recipeSearchResults.appendChild(li);
        });
    } else {
        recipeSearchResults.classList.remove('hidden');
        recipeSearchResults.innerHTML = '<li class="text-gray text-sm text-center">Bahan tidak ditemukan</li>';
    }
});

function selectRecipeIngredient(item) {
    recipeSelectedIngredient = item;
    recipeSearchInput.value = item.nama_bahan;
    recipeSearchResults.classList.add('hidden');
    recipeSelectedCard.classList.remove('hidden');
    recipeSelName.textContent = item.nama_bahan;
    recipePortionInput.value = '';
    recipePortionInput.focus();
}

btnAddRecipeItem.addEventListener('click', () => {
    if (!recipeSelectedIngredient) return;
    
    const portion = parseFloat(recipePortionInput.value);
    if (!portion || portion <= 0) {
        alert("Masukkan berat bahan mentah yang valid.");
        return;
    }

    const kBase = recipeSelectedIngredient.kalium_mg || 0;
    const pBase = recipeSelectedIngredient.fosfor_mg || 0;
    const naBase = recipeSelectedIngredient.natrium_mg || 0;
    const airBase = recipeSelectedIngredient.air_g || 0;

    const itemTotalK = (kBase / 100) * portion;
    const itemTotalP = (pBase / 100) * portion;
    const itemTotalNa = (naBase / 100) * portion;
    const itemTotalAir = (airBase / 100) * portion;

    currentRecipeItems.push({
        id: Date.now().toString(),
        nama_bahan: recipeSelectedIngredient.nama_bahan,
        porsi_g: portion,
        kalium_total: itemTotalK,
        fosfor_total: itemTotalP,
        natrium_total: itemTotalNa,
        air_total: itemTotalAir
    });

    // Reset Add Input
    recipeSearchInput.value = '';
    recipeSelectedCard.classList.add('hidden');
    recipeSelectedIngredient = null;
    
    renderRecipeItems();
});

function renderRecipeItems() {
    recipeItemsList.innerHTML = '';
    let totalWeight = 0;
    let totalK = 0;
    let totalP = 0;
    let totalNa = 0;
    let totalAir = 0;

    if (currentRecipeItems.length === 0) {
        recipeEmpty.style.display = 'block';
    } else {
        recipeEmpty.style.display = 'none';
        currentRecipeItems.forEach(item => {
            totalWeight += item.porsi_g;
            totalK += item.kalium_total || 0;
            totalP += item.fosfor_total || 0;
            totalNa += item.natrium_total || 0;
            totalAir += item.air_total || 0;

            const li = document.createElement('li');
            li.className = 'log-item py-2';
            li.style.padding = '8px 12px';
            li.innerHTML = `
                <div class="log-item-info">
                    <div class="font-semibold text-sm">${item.nama_bahan} <span class="font-normal text-gray">(${item.porsi_g}g)</span></div>
                </div>
                <button class="btn-danger-sm" onclick="removeRecipeItem('${item.id}')" style="padding:2px 6px; font-size:0.75rem;">Hapus</button>
            `;
            recipeItemsList.appendChild(li);
        });
    }

    recipeTotalWeight.textContent = totalWeight.toString();
    
    // Calculate per 100g for the final recipe
    if (totalWeight > 0) {
        const kPer100 = (totalK / totalWeight) * 100;
        const pPer100 = (totalP / totalWeight) * 100;
        const naPer100 = (totalNa / totalWeight) * 100;
        const airPer100 = (totalAir / totalWeight) * 100;
        recipeK100.textContent = kPer100.toFixed(1);
        recipeP100.textContent = pPer100.toFixed(1);
        recipeNa100.textContent = naPer100.toFixed(1);
        recipeAir100.textContent = airPer100.toFixed(1);
    } else {
        recipeK100.textContent = '0';
        recipeP100.textContent = '0';
        recipeNa100.textContent = '0';
        recipeAir100.textContent = '0';
    }
}

window.removeRecipeItem = function(id) {
    currentRecipeItems = currentRecipeItems.filter(i => i.id !== id);
    renderRecipeItems();
};

btnSaveRecipe.addEventListener('click', () => {
    const name = recipeNameInput.value.trim();
    if (!name) {
        alert("Harap masukkan nama masakan.");
        return;
    }
    if (currentRecipeItems.length === 0) {
        alert("Harap tambahkan minimal satu bahan mentah ke dalam resep.");
        return;
    }

    const kPer100 = parseFloat(recipeK100.textContent);
    const pPer100 = parseFloat(recipeP100.textContent);
    const naPer100 = parseFloat(recipeNa100.textContent);
    const airPer100 = parseFloat(recipeAir100.textContent);

    const newRecipe = {
        kode: "CUSTOM_" + Date.now(),
        nama_bahan: name,
        kelompok: "Masakan Olahan (Custom)",
        tipe: "Olahan",
        isCustom: true,
        kalium_mg: kPer100,
        fosfor_mg: pPer100,
        natrium_mg: naPer100,
        air_g: airPer100
    };

    customFoods.push(newRecipe);
    saveCustomFoods();
    
    alert(`Resep "${name}" berhasil disimpan!`);
    recipeModal.classList.add('hidden');
    
    // Switch to Olahan tab and pre-fill search
    switchTab("Olahan");
    searchInput.value = name;
    searchInput.dispatchEvent(new Event('input'));
});


// --- Other Event Listeners ---
btnThemeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('ggk_dark_mode', isDark);
    btnThemeToggle.textContent = isDark ? '☀️' : '🌙';
});

btnEditProfile.addEventListener('click', () => {
    modalProfile.classList.remove('hidden');
    if (userProfile) {
        inputLimitKalium.value = userProfile.kaliumLimit;
        inputLimitFosfor.value = userProfile.fosforLimit;
        inputLimitNatrium.value = userProfile.natriumLimit || 2000;
        inputLimitAir.value = userProfile.airLimit || 1500;
    }
});

btnSaveProfile.addEventListener('click', saveProfile);


// Start app
document.addEventListener('DOMContentLoaded', initApp);

// Register Service Worker for PWA with Auto-Update Detection
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                console.log('PWA Service Worker registered');
                
                // If there's already a waiting worker
                if (reg.waiting) {
                    showUpdateToast(reg.waiting);
                }

                // Listen for new updates
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateToast(newWorker);
                            }
                        });
                    }
                });
            })
            .catch(err => console.error('PWA SW registration failed:', err));
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}

function showUpdateToast(worker) {
    const toast = document.getElementById('update-toast');
    const btnUpdate = document.getElementById('btn-update-app');
    if (!toast || !btnUpdate) return;

    toast.classList.remove('hidden');
    btnUpdate.onclick = () => {
        worker.postMessage({ action: 'skipWaiting' });
        toast.classList.add('hidden');
    };
}