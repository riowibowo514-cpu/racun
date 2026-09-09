// --- DOM Elements ---
const modalProfile = document.getElementById('profile-modal');
const btnEditProfile = document.getElementById('btn-edit-profile');
const btnSaveProfile = document.getElementById('btn-save-profile');
const inputLimitKalium = document.getElementById('limit-kalium');
const inputLimitFosfor = document.getElementById('limit-fosfor');

const loadingOverlay = document.getElementById('loading-overlay');
const currentDateEl = document.getElementById('current-date');

const kaliumText = document.getElementById('kalium-text');
const fosforText = document.getElementById('fosfor-text');
const kaliumBar = document.getElementById('kalium-bar');
const fosforBar = document.getElementById('fosfor-bar');
const kaliumAlert = document.getElementById('kalium-alert');
const fosforAlert = document.getElementById('fosfor-alert');

const searchLabel = document.getElementById('search-label');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const selectedCard = document.getElementById('selected-ingredient-card');
const selName = document.getElementById('sel-name');
const selCategory = document.getElementById('sel-category');
const selKalium = document.getElementById('sel-kalium');
const selFosfor = document.getElementById('sel-fosfor');
const nullWarning = document.getElementById('null-warning');

const portionInput = document.getElementById('portion-input');
const previewKalium = document.getElementById('preview-kalium');
const previewFosfor = document.getElementById('preview-fosfor');
const btnAddEntry = document.getElementById('btn-add-entry');

const logList = document.getElementById('log-list');
const logCount = document.getElementById('log-count');

// --- Tab & Recipe DOM Elements ---
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

// --- State Variables ---
let foodDatabase = [];
let customFoods = [];
let userProfile = null;
let dailyLogs = {};
let selectedIngredient = null;
let currentDateStr = "";
let searchMode = "Mentah"; // "Mentah" or "Olahan"

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
}


// --- Local Storage Operations ---
function loadLocalStorage() {
    const savedProfile = localStorage.getItem('ggk_user_profile');
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
        inputLimitKalium.value = userProfile.kaliumLimit;
        inputLimitFosfor.value = userProfile.fosforLimit;
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

    if (!kLimit || !pLimit || kLimit <= 0 || pLimit <= 0) {
        alert("Harap masukkan angka yang valid untuk batas harian.");
        return;
    }

    userProfile = { kaliumLimit: kLimit, fosforLimit: pLimit };
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

    todayLogs.forEach(log => {
        totalKalium += log.kalium_konsumsi;
        totalFosfor += log.fosfor_konsumsi;
    });

    // Update Text
    kaliumText.textContent = `${totalKalium.toFixed(1)} / ${userProfile.kaliumLimit} mg`;
    fosforText.textContent = `${totalFosfor.toFixed(1)} / ${userProfile.fosforLimit} mg`;

    // Update Progress Bars
    let kPercent = (totalKalium / userProfile.kaliumLimit) * 100;
    let pPercent = (totalFosfor / userProfile.fosforLimit) * 100;
    
    // Cap at 100% for visual width
    kaliumBar.style.width = `${Math.min(kPercent, 100)}%`;
    fosforBar.style.width = `${Math.min(pPercent, 100)}%`;

    // Color and Alert Logic
    updateProgressBarState(kPercent, kaliumBar, kaliumAlert, "Kalium");
    updateProgressBarState(pPercent, fosforBar, fosforAlert, "Fosfor");

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
        li.innerHTML = `
            <div class="log-item-info">
                <div class="log-item-name">${log.nama_bahan} <span class="text-sm font-normal text-gray">(${log.porsi_g}g)</span></div>
                <div class="log-item-details">
                    <span class="kalium-text font-semibold">K: ${log.kalium_konsumsi.toFixed(1)} mg</span> | 
                    <span class="fosfor-text font-semibold">P: ${log.fosfor_konsumsi.toFixed(1)} mg</span>
                </div>
            </div>
            <button class="btn-danger-sm" onclick="deleteEntry('${log.id}')">Hapus</button>
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
    
    if (mode === "Mentah") {
        tabMentah.classList.add('active');
        tabOlahan.classList.remove('active');
        searchLabel.textContent = "Cari Bahan Mentah";
        btnOpenRecipe.classList.add('hidden');
    } else {
        tabOlahan.classList.add('active');
        tabMentah.classList.remove('active');
        searchLabel.textContent = "Cari Masakan / Resep Olahan";
        btnOpenRecipe.classList.remove('hidden');
    }
}

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
    } else {
        // Combine Olahan from JSON + Custom User Foods
        const dbOlahan = foodDatabase.filter(d => d.tipe === "Olahan");
        targetData = [...customFoods, ...dbOlahan];
    }

    const keywords = query.split(' ').filter(k => k.length > 0);
    const matched = targetData.filter(item => {
        const itemName = item.nama_bahan.toLowerCase();
        return keywords.every(kw => itemName.includes(kw));
    }).slice(0, 10); // Limit to 10 results

    if (matched.length > 0) {
        searchResults.classList.remove('hidden');
        matched.forEach(item => {
            const li = document.createElement('li');
            const isCustom = item.isCustom ? '<span style="color:var(--primary); font-size:0.7rem;">⭐ Resep Pribadi</span>' : '';
            li.innerHTML = `
                <div>${item.nama_bahan} ${isCustom}</div>
                <span class="item-cat">${item.kelompok || "Masakan Olahan"}</span>
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
    
    // Handle null values
    const kVal = item.kalium_mg;
    const pVal = item.fosfor_mg;
    
    selKalium.textContent = kVal !== null && kVal !== undefined ? `${kVal.toFixed(1)} mg` : 'N/A';
    selFosfor.textContent = pVal !== null && pVal !== undefined ? `${pVal.toFixed(1)} mg` : 'N/A';

    if (kVal === null || pVal === null || kVal === undefined || pVal === undefined) {
        nullWarning.classList.remove('hidden');
    } else {
        nullWarning.classList.add('hidden');
    }

    // Reset portion
    portionInput.value = '';
    previewKalium.textContent = '0';
    previewFosfor.textContent = '0';
    
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

    const kTotal = (kBase / 100) * portion;
    const pTotal = (pBase / 100) * portion;

    previewKalium.textContent = kTotal.toFixed(1);
    previewFosfor.textContent = pTotal.toFixed(1);
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

    const kTotal = (kBase / 100) * portion;
    const pTotal = (pBase / 100) * portion;

    const entry = {
        id: Date.now().toString(),
        kode: selectedIngredient.kode || "CUSTOM",
        nama_bahan: selectedIngredient.nama_bahan,
        porsi_g: portion,
        kalium_konsumsi: kTotal,
        fosfor_konsumsi: pTotal,
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
    }).slice(0, 10);

    if (matched.length > 0) {
        recipeSearchResults.classList.remove('hidden');
        matched.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>${item.nama_bahan}</div>
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

    const itemTotalK = (kBase / 100) * portion;
    const itemTotalP = (pBase / 100) * portion;

    currentRecipeItems.push({
        id: Date.now().toString(),
        nama_bahan: recipeSelectedIngredient.nama_bahan,
        porsi_g: portion,
        kalium_total: itemTotalK,
        fosfor_total: itemTotalP
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

    if (currentRecipeItems.length === 0) {
        recipeEmpty.style.display = 'block';
    } else {
        recipeEmpty.style.display = 'none';
        currentRecipeItems.forEach(item => {
            totalWeight += item.porsi_g;
            totalK += item.kalium_total;
            totalP += item.fosfor_total;

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
        recipeK100.textContent = kPer100.toFixed(1);
        recipeP100.textContent = pPer100.toFixed(1);
    } else {
        recipeK100.textContent = '0';
        recipeP100.textContent = '0';
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

    const newRecipe = {
        kode: "CUSTOM_" + Date.now(),
        nama_bahan: name,
        kelompok: "Masakan Olahan (Custom)",
        tipe: "Olahan",
        isCustom: true,
        kalium_mg: kPer100,
        fosfor_mg: pPer100
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
btnEditProfile.addEventListener('click', () => {
    modalProfile.classList.remove('hidden');
    if (userProfile) {
        inputLimitKalium.value = userProfile.kaliumLimit;
        inputLimitFosfor.value = userProfile.fosforLimit;
    }
});

btnSaveProfile.addEventListener('click', saveProfile);


// Start app
document.addEventListener('DOMContentLoaded', initApp);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('PWA Service Worker registered'))
            .catch(err => console.error('PWA SW registration failed:', err));
    });
}