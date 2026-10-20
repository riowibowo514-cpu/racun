// --- DOM Elements ---
const modalProfile = document.getElementById('profile-modal');
const btnEditProfile = document.getElementById('btn-edit-profile');
const btnThemeToggle = document.getElementById('btn-theme-toggle');
const btnSaveProfile = document.getElementById('btn-save-profile');
const btnCloseProfile = document.getElementById('btn-close-profile');
const btnCancelProfile = document.getElementById('btn-cancel-profile');

const inputUserName = document.getElementById('input-user-name');
const inputProfilePhoto = document.getElementById('input-profile-photo');
const btnChoosePhoto = document.getElementById('btn-choose-photo');
const btnRemovePhoto = document.getElementById('btn-remove-photo');
const profileAvatarUploader = document.getElementById('profile-avatar-uploader');
const modalAvatarPreview = document.getElementById('modal-avatar-preview');
const headerAvatarContainer = document.getElementById('header-avatar-container');
const headerUserName = document.getElementById('header-user-name');
const headerTherapyBadge = document.getElementById('header-therapy-badge');
const therapyBtns = document.querySelectorAll('.therapy-btn');
const therapyPresetNotice = document.getElementById('therapy-preset-notice');

// Report DOM Elements
const btnOpenReport = document.getElementById('btn-open-report');
const reportModal = document.getElementById('report-modal');
const btnCloseReport = document.getElementById('btn-close-report');
const reportPeriodTabs = document.querySelectorAll('#report-period-tabs .tab-btn');
const reportPatientInfo = document.getElementById('report-patient-info');
const reportDateRange = document.getElementById('report-date-range');
const reportStatusBanner = document.getElementById('report-status-banner');
const reportStatusTitle = document.getElementById('report-status-title');
const reportStatusDesc = document.getElementById('report-status-desc');
const reportStatusIcon = document.getElementById('report-status-icon');
const reportTotalK = document.getElementById('report-total-k');
const reportTotalAir = document.getElementById('report-total-air');
const reportTotalP = document.getElementById('report-total-p');
const reportTotalNa = document.getElementById('report-total-na');
const reportTargetK = document.getElementById('report-target-k');
const reportTargetAir = document.getElementById('report-target-air');
const reportTargetP = document.getElementById('report-target-p');
const reportTargetNa = document.getElementById('report-target-na');
const reportTableBody = document.getElementById('report-table-body');
const btnPrintReport = document.getElementById('btn-print-report');
const btnExportCsv = document.getElementById('btn-export-csv');
const btnCopyWa = document.getElementById('btn-copy-wa');

// Backup & Restore DOM Elements
const btnBackupData = document.getElementById('btn-backup-data');
const btnTriggerRestore = document.getElementById('btn-trigger-restore');
const inputRestoreFile = document.getElementById('input-restore-file');

// Global Therapy Presets (Konsensus Nutrisi PGK PERNEFRI 2011 - Tabel 3 & Tabel 4)
const THERAPY_PRESETS = {
    HD: {
        name: "Hemodialisis",
        badge: "HD",
        kaliumPerKg: 17, // Tabel 4: 8 - 17 mg/kg/hari (pakai batas maksimal 17 mg/kg)
        fosfor: 800,     // Tabel 4: 800 - 1000 mg/hari
        natrium: 2000,   // Tabel 4: NaCl 5 - 6 g/hari (~2000 mg Natrium)
        airBase: 500,    // Tabel 3: 500 ml/hari + produksi urin
        useUrineForFluid: true,
        defaultWeight: 60,
        defaultUrine: 500,
        defaultPeriod: 3
    },
    CAPD: {
        name: "CAPD (PD)",
        badge: "CAPD",
        kaliumPerKg: 17, // Tabel 4: 8 - 17 mg/kg/hari (pakai batas maksimal 17 mg/kg)
        fosfor: 800,     // Tabel 4: 800 - 1000 mg/hari
        natrium: 2000,   // Tabel 4: NaCl 5 - 10 g/hari
        air: 1800,       // Tabel 3: Monitor; 1500 - 2000 ml/hari
        useUrineForFluid: false,
        defaultWeight: 60,
        defaultUrine: 500,
        defaultPeriod: 7
    },
    KONSERVATIF: {
        name: "Pre-Dialisis",
        badge: "Pre-HD",
        kaliumPerKg: 39, // Tabel 4: 39 mg/kg/hari, tergantung nilai laboratorium
        fosfor: 800,     // Tabel 4: 800 - 1000 mg/hari
        natrium: 1800,   // Tabel 4: NaCl <5 g/hari (<2000 mg Natrium)
        air: 2000,       // Tabel 3: Tidak dibatasi dengan produksi urin yang normal
        useUrineForFluid: false,
        defaultWeight: 60,
        defaultUrine: 1000,
        defaultPeriod: 7
    }
};

let selectedTherapy = 'HD';
let currentReportPeriod = 3;

const inputWeight = document.getElementById('input-weight');
const inputUrine = document.getElementById('input-urine');
const urineInputGroup = document.getElementById('urine-input-group');
const weightClinicalNote = document.getElementById('weight-clinical-note');
const formulaHintKalium = document.getElementById('formula-hint-kalium');
const formulaHintFosfor = document.getElementById('formula-hint-fosfor');
const formulaHintNatrium = document.getElementById('formula-hint-natrium');
const formulaHintAir = document.getElementById('formula-hint-air');

const inputLimitKalium = document.getElementById('limit-kalium');
const inputLimitFosfor = document.getElementById('limit-fosfor');
const inputLimitNatrium = document.getElementById('limit-natrium');
const inputLimitAir = document.getElementById('limit-air');

let tempProfilePhoto = null;

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
        if (inputWeight) inputWeight.value = 60;
        if (inputUrine) inputUrine.value = 500;
        selectTherapyType('HD', true);
        renderModalAvatarPreview(null, "");
    } else {
        renderUserProfileHeader();
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
        if (!userProfile.name) userProfile.name = "Pasien";
        if (!userProfile.therapyType) userProfile.therapyType = 'HD';
        if (!userProfile.weightKg) userProfile.weightKg = 60;
        if (userProfile.urineMl === undefined || userProfile.urineMl === null) userProfile.urineMl = 500;
        if (!userProfile.natriumLimit) userProfile.natriumLimit = 2000;
        if (!userProfile.airLimit) userProfile.airLimit = 1000;
        selectedTherapy = userProfile.therapyType;
        if (inputUserName) inputUserName.value = userProfile.name;
        if (inputWeight) inputWeight.value = userProfile.weightKg;
        if (inputUrine) inputUrine.value = userProfile.urineMl;
        inputLimitKalium.value = userProfile.kaliumLimit;
        inputLimitFosfor.value = userProfile.fosforLimit;
        inputLimitNatrium.value = userProfile.natriumLimit;
        inputLimitAir.value = userProfile.airLimit;
        selectTherapyType(selectedTherapy, false);
        renderUserProfileHeader();
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
    const name = (inputUserName.value.trim()) || "Pasien";
    const weightKg = parseFloat(inputWeight ? inputWeight.value : 60) || 60;
    const urineMl = parseFloat(inputUrine ? inputUrine.value : 0) || 0;
    const kLimit = parseInt(inputLimitKalium.value);
    const pLimit = parseInt(inputLimitFosfor.value);
    const naLimit = parseInt(inputLimitNatrium.value) || 2000;
    const airLimit = parseInt(inputLimitAir.value) || 1000;

    if (!kLimit || !pLimit || kLimit <= 0 || pLimit <= 0 || naLimit <= 0 || airLimit <= 0) {
        alert("Harap masukkan angka yang valid untuk semua batas harian.");
        return;
    }

    let photoToSave = userProfile ? userProfile.photo : null;
    if (tempProfilePhoto === "") {
        photoToSave = null;
    } else if (tempProfilePhoto) {
        photoToSave = tempProfilePhoto;
    }

    userProfile = {
        name: name,
        photo: photoToSave,
        therapyType: selectedTherapy,
        weightKg: weightKg,
        urineMl: urineMl,
        kaliumLimit: kLimit,
        fosforLimit: pLimit,
        natriumLimit: naLimit,
        airLimit: airLimit
    };

    localStorage.setItem('ggk_user_profile', JSON.stringify(userProfile));
    tempProfilePhoto = null;
    modalProfile.classList.add('hidden');
    renderUserProfileHeader();
    updateDashboard();
}

function renderUserProfileHeader() {
    const name = (userProfile && userProfile.name) ? userProfile.name.trim() : "Pasien";
    if (headerUserName) headerUserName.textContent = name;
    
    const initial = name ? name.charAt(0).toUpperCase() : "P";
    if (headerAvatarContainer) {
        if (userProfile && userProfile.photo) {
            headerAvatarContainer.innerHTML = `<img src="${userProfile.photo}" alt="${name}">`;
        } else {
            headerAvatarContainer.innerHTML = `<span id="header-avatar-initial">${initial}</span>`;
        }
    }

    const therapy = THERAPY_PRESETS[userProfile ? userProfile.therapyType : 'HD'] || THERAPY_PRESETS.HD;
    if (headerTherapyBadge) {
        headerTherapyBadge.textContent = therapy.badge;
    }
}

function calculateConsensusLimits(recalcAll = true) {
    const preset = THERAPY_PRESETS[selectedTherapy] || THERAPY_PRESETS.HD;
    const weight = parseFloat(inputWeight ? inputWeight.value : 0) || preset.defaultWeight;
    const urine = parseFloat(inputUrine ? inputUrine.value : 0) || 0;

    // 1. Kalium: Tabel 4 PERNEFRI (HD & CAPD: 17 mg/kgBB, Pre-dialisis: 39 mg/kgBB)
    const calculatedKalium = Math.round(weight * preset.kaliumPerKg);
    inputLimitKalium.value = calculatedKalium;

    if (recalcAll) {
        // 2. Fosfor: Tabel 4 PERNEFRI (800 - 1000 mg/hari)
        inputLimitFosfor.value = preset.fosfor;
        // 3. Natrium: Tabel 4 PERNEFRI
        inputLimitNatrium.value = preset.natrium;
    }

    // 4. Cairan / Air: Tabel 3 PERNEFRI
    if (preset.useUrineForFluid) {
        // HD: 500 ml + produksi urin 24 jam
        inputLimitAir.value = Math.round(preset.airBase + urine);
    } else if (recalcAll) {
        inputLimitAir.value = preset.air;
    }

    updateFormulaHints(preset, weight, urine, calculatedKalium);
}

function updateFormulaHints(preset, weight, urine, calculatedKalium) {
    if (formulaHintKalium) {
        if (selectedTherapy === 'KONSERVATIF') {
            formulaHintKalium.textContent = `39 mg × ${weight} kg = ${calculatedKalium} mg (Tabel 4)`;
        } else {
            formulaHintKalium.textContent = `17 mg × ${weight} kg = ${calculatedKalium} mg (Tabel 4: 8-17 mg/kg)`;
        }
    }

    if (formulaHintFosfor) {
        formulaHintFosfor.textContent = `800 – 1000 mg/hari (Tabel 4)`;
    }

    if (formulaHintNatrium) {
        if (selectedTherapy === 'KONSERVATIF') {
            formulaHintNatrium.textContent = `NaCl <5 g/hari (Tabel 4)`;
        } else if (selectedTherapy === 'CAPD') {
            formulaHintNatrium.textContent = `NaCl 5 – 10 g/hari (Tabel 4)`;
        } else {
            formulaHintNatrium.textContent = `NaCl 5 – 6 g/hari (Tabel 4)`;
        }
    }

    if (formulaHintAir) {
        if (selectedTherapy === 'HD') {
            formulaHintAir.textContent = `500 ml + ${urine} ml urin = ${500 + urine} ml (Tabel 3)`;
        } else if (selectedTherapy === 'CAPD') {
            formulaHintAir.textContent = `Monitor: 1500 – 2000 ml/hari (Tabel 3)`;
        } else {
            formulaHintAir.textContent = `Urin normal: Tidak dibatasi / ~2000 ml (Tabel 3)`;
        }
    }

    if (urineInputGroup) {
        if (selectedTherapy === 'HD') {
            urineInputGroup.style.opacity = '1';
        } else {
            urineInputGroup.style.opacity = '0.65';
        }
    }

    if (weightClinicalNote) {
        if (selectedTherapy === 'KONSERVATIF') {
            weightClinicalNote.innerHTML = `ℹ️ <strong>Penting (Pre-Dialisis):</strong> Gunakan <strong>Berat Badan Ideal / Tanpa Edema</strong> untuk menghitung batas Kalium (39 mg/kgBB/hari).`;
        } else {
            weightClinicalNote.innerHTML = `ℹ️ <strong>Penting (HD / CAPD):</strong> Gunakan <strong>Berat Badan Kering</strong> (berat badan sesudah cuci darah / setelah cairan drain keluar tanpa bengkak).`;
        }
    }

    if (therapyPresetNotice) {
        if (selectedTherapy === 'HD') {
            therapyPresetNotice.innerHTML = `💡 <strong>Standar PERNEFRI (HD):</strong> Kalium <strong>17 mg/kgBB</strong> (maks dari 8–17 mg/kg), Cairan <strong>500 ml + Produksi Urin</strong>, Fosfor <strong>800–1000 mg</strong>.`;
        } else if (selectedTherapy === 'CAPD') {
            therapyPresetNotice.innerHTML = `💡 <strong>Standar PERNEFRI (CAPD):</strong> Kalium <strong>17 mg/kgBB</strong> (maks dari 8–17 mg/kg), Cairan <strong>1500–2000 ml/hari</strong>, Fosfor <strong>800–1000 mg</strong>.`;
        } else {
            therapyPresetNotice.innerHTML = `💡 <strong>Standar PERNEFRI (Pre-Dialisis):</strong> Kalium <strong>39 mg/kgBB/hari</strong>, Fosfor <strong>800–1000 mg</strong>, Cairan disesuaikan urin.`;
        }
    }
}

function selectTherapyType(type, applyPresets = true) {
    selectedTherapy = type;
    therapyBtns.forEach(btn => {
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const preset = THERAPY_PRESETS[type] || THERAPY_PRESETS.HD;
    const weight = parseFloat(inputWeight ? inputWeight.value : 0) || preset.defaultWeight;
    const urine = parseFloat(inputUrine ? inputUrine.value : 0) || 0;
    const calculatedKalium = Math.round(weight * preset.kaliumPerKg);

    if (applyPresets) {
        calculateConsensusLimits(true);
    } else {
        updateFormulaHints(preset, weight, urine, calculatedKalium);
    }
}

function renderModalAvatarPreview(photoUrl, name) {
    const initial = (name && name.trim()) ? name.trim().charAt(0).toUpperCase() : "P";
    if (!modalAvatarPreview) return;
    if (photoUrl) {
        modalAvatarPreview.innerHTML = `<img src="${photoUrl}" alt="Foto Profil">`;
        if (btnRemovePhoto) btnRemovePhoto.classList.remove('hidden');
    } else {
        modalAvatarPreview.innerHTML = `<span id="modal-avatar-initial" class="avatar-initial-large">${initial}</span>`;
        if (btnRemovePhoto) btnRemovePhoto.classList.add('hidden');
    }
}

function processImageFile(file, callback) {
    if (!file || !file.type.startsWith('image/')) {
        alert("Harap pilih file gambar (JPG/PNG/WebP).");
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const maxSize = 200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxSize) {
                    height = Math.round((height * maxSize) / width);
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = Math.round((width * maxSize) / height);
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            callback(dataUrl);
        };
        img.onerror = function() {
            alert("Gagal memproses gambar. Coba gunakan foto lain.");
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// --- Cumulative Report Functions ---
function generateCumulativeReport(days) {
    currentReportPeriod = days;
    
    // Update active tab in report modal
    reportPeriodTabs.forEach(tab => {
        if (parseInt(tab.dataset.period) === days) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    const patientName = (userProfile && userProfile.name) ? userProfile.name : "Pasien";
    const therapy = THERAPY_PRESETS[userProfile ? userProfile.therapyType : 'HD'] || THERAPY_PRESETS.HD;
    if (reportPatientInfo) {
        reportPatientInfo.textContent = `Pasien: ${patientName} • Terapi: ${therapy.name} (${therapy.badge})`;
    }

    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }

    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);
    const dateOpts = { day: 'numeric', month: 'short', year: 'numeric' };
    const dateRangeStr = `Periode: ${startDate.toLocaleDateString('id-ID', dateOpts)} s/d ${endDate.toLocaleDateString('id-ID', dateOpts)} (${days} Hari)`;
    if (reportDateRange) reportDateRange.textContent = dateRangeStr;

    let cumK = 0, cumAir = 0, cumP = 0, cumNa = 0;
    const dailyBreakdown = [];

    dates.forEach(dateStr => {
        const logs = dailyLogs[dateStr] || [];
        let dayK = 0, dayAir = 0, dayP = 0, dayNa = 0;
        logs.forEach(item => {
            dayK += item.kalium_konsumsi || 0;
            dayAir += item.air_konsumsi || 0;
            dayP += item.fosfor_konsumsi || 0;
            dayNa += item.natrium_konsumsi || 0;
        });

        cumK += dayK;
        cumAir += dayAir;
        cumP += dayP;
        cumNa += dayNa;

        dailyBreakdown.push({
            date: dateStr,
            k: dayK,
            air: dayAir,
            p: dayP,
            na: dayNa,
            count: logs.length
        });
    });

    const kLimitDay = (userProfile && userProfile.kaliumLimit) ? userProfile.kaliumLimit : Math.round((therapy.defaultWeight || 60) * therapy.kaliumPerKg);
    const airLimitDay = (userProfile && userProfile.airLimit) ? userProfile.airLimit : (therapy.useUrineForFluid ? (therapy.airBase + (therapy.defaultUrine || 500)) : therapy.air);
    const pLimitDay = (userProfile && userProfile.fosforLimit) ? userProfile.fosforLimit : therapy.fosfor;
    const naLimitDay = (userProfile && userProfile.natriumLimit) ? userProfile.natriumLimit : therapy.natrium;

    const targetK = kLimitDay * days;
    const targetAir = airLimitDay * days;
    const targetP = pLimitDay * days;
    const targetNa = naLimitDay * days;

    if (reportTotalK) reportTotalK.textContent = `${cumK.toFixed(1)} mg`;
    if (reportTotalAir) reportTotalAir.textContent = `${cumAir.toFixed(1)} ml`;
    if (reportTotalP) reportTotalP.textContent = `${cumP.toFixed(1)} mg`;
    if (reportTotalNa) reportTotalNa.textContent = `${cumNa.toFixed(1)} mg`;

    if (reportTargetK) reportTargetK.textContent = `Batas: max ${targetK} mg (${(cumK / targetK * 100).toFixed(0)}%)`;
    if (reportTargetAir) reportTargetAir.textContent = `Batas: max ${targetAir} ml (${(cumAir / targetAir * 100).toFixed(0)}%)`;
    if (reportTargetP) reportTargetP.textContent = `Batas: max ${targetP} mg (${(cumP / targetP * 100).toFixed(0)}%)`;
    if (reportTargetNa) reportTargetNa.textContent = `Batas: max ${targetNa} mg (${(cumNa / targetNa * 100).toFixed(0)}%)`;

    const maxRatio = Math.max(cumK / targetK, cumAir / targetAir, cumP / targetP, cumNa / targetNa);
    reportStatusBanner.classList.remove('status-safe', 'status-warning', 'status-danger');

    if (maxRatio > 1.0) {
        reportStatusBanner.classList.add('status-danger');
        reportStatusIcon.textContent = '🚨';
        reportStatusTitle.textContent = 'Akumulasi Asupan Melebihi Target';
        reportStatusDesc.textContent = `Akumulasi zat gizi melebihi batas kumulatif ${days} hari. Konsultasikan dengan dokter/ahli gizi Anda.`;
    } else if (maxRatio >= 0.85) {
        reportStatusBanner.classList.add('status-warning');
        reportStatusIcon.textContent = '⚠️';
        reportStatusTitle.textContent = 'Akumulasi Asupan Mendekati Batas';
        reportStatusDesc.textContent = `Asupan kumulatif berada di ${Math.round(maxRatio * 100)}% dari batas aman. Pertahankan pemilihan menu rendah kalium/cairan.`;
    } else {
        reportStatusBanner.classList.add('status-safe');
        reportStatusIcon.textContent = '🌿';
        reportStatusTitle.textContent = 'Akumulasi Asupan Aman Terkendali';
        reportStatusDesc.textContent = `Seluruh zat gizi kumulatif terjaga di bawah batas aman periode ${days} hari.`;
    }

    if (reportTableBody) {
        reportTableBody.innerHTML = '';
        dailyBreakdown.forEach(row => {
            const tr = document.createElement('tr');
            const dObj = new Date(row.date);
            const formattedDate = dObj.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
            
            const kWarning = row.k > kLimitDay ? 'style="color:var(--danger); font-weight:bold;"' : '';
            const airWarning = row.air > airLimitDay ? 'style="color:var(--danger); font-weight:bold;"' : '';

            tr.innerHTML = `
                <td><strong>${formattedDate}</strong> <br><small class="text-gray">${row.count} item</small></td>
                <td ${kWarning}>${row.k.toFixed(1)} mg</td>
                <td ${airWarning}>${row.air.toFixed(1)} ml</td>
                <td>${row.p.toFixed(1)} mg</td>
                <td>${row.na.toFixed(1)} mg</td>
            `;
            reportTableBody.appendChild(tr);
        });
    }
}

function exportReportCSV() {
    const patientName = (userProfile && userProfile.name) ? userProfile.name : "Pasien";
    const therapy = THERAPY_PRESETS[userProfile ? userProfile.therapyType : 'HD'] || THERAPY_PRESETS.HD;
    let csvContent = `Laporan Asupan Pasien GGK\n`;
    csvContent += `Nama Pasien,${patientName}\n`;
    csvContent += `Terapi,${therapy.name} (${therapy.badge})\n`;
    csvContent += `Periode,${currentReportPeriod} Hari\n`;
    csvContent += `Tanggal Cetak,${new Date().toLocaleString('id-ID')}\n\n`;

    csvContent += `Tanggal,Waktu,Nama Makanan,Porsi (g),Kalium (mg),Fosfor (mg),Natrium (mg),Air (ml)\n`;

    for (let i = currentReportPeriod - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const logs = dailyLogs[dateStr] || [];
        logs.forEach(log => {
            const time = log.timestamp ? new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';
            csvContent += `"${dateStr}","${time}","${log.nama_bahan.replace(/"/g, '""')}","${log.porsi_g}","${log.kalium_konsumsi.toFixed(1)}","${log.fosfor_konsumsi.toFixed(1)}","${(log.natrium_konsumsi || 0).toFixed(1)}","${(log.air_konsumsi || 0).toFixed(1)}"\n`;
        });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Gizi_GGK_${patientName}_${currentReportPeriod}Hari.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function copyReportToWhatsApp() {
    const patientName = (userProfile && userProfile.name) ? userProfile.name : "Pasien";
    const therapy = THERAPY_PRESETS[userProfile ? userProfile.therapyType : 'HD'] || THERAPY_PRESETS.HD;
    const totalK = reportTotalK ? reportTotalK.textContent : '0';
    const totalAir = reportTotalAir ? reportTotalAir.textContent : '0';
    const totalP = reportTotalP ? reportTotalP.textContent : '0';
    const totalNa = reportTotalNa ? reportTotalNa.textContent : '0';

    let msg = `*📊 LAPORAN ASUPAN GIZI PASIEN GGK*\n`;
    msg += `👤 *Nama:* ${patientName}\n`;
    msg += `🩺 *Terapi:* ${therapy.name} (${therapy.badge})\n`;
    msg += `📅 *Periode:* ${currentReportPeriod} Hari Terakhir\n\n`;
    msg += `*Akumulasi Zat Gizi:*\n`;
    msg += `• Kalium: ${totalK}\n`;
    msg += `• Cairan: ${totalAir}\n`;
    msg += `• Fosfor: ${totalP}\n`;
    msg += `• Natrium: ${totalNa}\n\n`;
    msg += `_Dipantau melalui Pemantau Asupan GGK_`;

    navigator.clipboard.writeText(msg).then(() => {
        alert("✅ Ringkasan berhasil disalin! Anda dapat menempelkannya (paste) langsung ke chat WhatsApp dokter atau keluarga.");
    }).catch(() => {
        prompt("Salin teks berikut untuk WhatsApp:", msg);
    });
}

// --- Data Backup & Restore Operations ---
function backupAppData() {
    const backupObj = {
        app: "Pemantau Asupan GGK",
        version: "6.0.0",
        backupTimestamp: new Date().toISOString(),
        userProfile: userProfile,
        dailyLogs: dailyLogs,
        customFoods: customFoods
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    const patientName = (userProfile && userProfile.name) ? userProfile.name.trim().replace(/\s+/g, '_') : 'Pasien';
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Backup_GGK_${patientName}_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function restoreAppData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const parsed = JSON.parse(event.target.result);
            if (!parsed.dailyLogs && !parsed.userProfile) {
                alert("File cadangan tidak valid atau format salah.");
                return;
            }

            if (confirm("Pulihkan data dari file ini? Data di perangkat Anda saat ini akan diselaraskan dengan cadangan.")) {
                if (parsed.userProfile) {
                    userProfile = parsed.userProfile;
                    localStorage.setItem('ggk_user_profile', JSON.stringify(userProfile));
                }
                if (parsed.dailyLogs) {
                    dailyLogs = parsed.dailyLogs;
                    localStorage.setItem('ggk_daily_logs', JSON.stringify(dailyLogs));
                }
                if (parsed.customFoods) {
                    customFoods = parsed.customFoods;
                    localStorage.setItem('ggk_custom_foods', JSON.stringify(customFoods));
                }

                loadLocalStorage();
                updateDashboard();
                renderUserProfileHeader();
                alert("✅ Seluruh data berhasil dipulihkan secara utuh!");
                modalProfile.classList.add('hidden');
            }
        } catch (err) {
            alert("Gagal membaca file cadangan: " + err.message);
        }
        inputRestoreFile.value = '';
    };
    reader.readAsText(file);
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

    // Kidney Companion Indicator Status
    updateKidneyStatus(kPercent, pPercent, naPercent, airPercent);

    renderLogList(todayLogs);
}

function updateKidneyStatus(kPercent, pPercent, naPercent, airPercent) {
    const statusCard = document.getElementById('kidney-status-card');
    const statusLabel = document.getElementById('kidney-status-label');
    const statusDesc = document.getElementById('kidney-status-desc');
    const statusBadge = document.getElementById('kidney-badge');
    if (!statusCard || !statusLabel || !statusDesc || !statusBadge) return;

    const nutrients = [
        { name: 'Kalium', pct: kPercent },
        { name: 'Fosfor', pct: pPercent },
        { name: 'Natrium', pct: naPercent },
        { name: 'Cairan', pct: airPercent }
    ];
    nutrients.sort((a, b) => b.pct - a.pct);
    const topNutrient = nutrients[0];

    statusCard.classList.remove('status-safe', 'status-warning', 'status-danger');

    if (topNutrient.pct >= 100) {
        statusCard.classList.add('status-danger');
        statusLabel.textContent = 'Beban Ginjal: Melebihi Batas';
        statusBadge.textContent = 'Perhatian 🚨';
        statusDesc.textContent = `${topNutrient.name} telah melampaui batas harian (${Math.round(topNutrient.pct)}%). Batasi asupan tinggi ${topNutrient.name.toLowerCase()} untuk sisa hari ini.`;
    } else if (topNutrient.pct >= 80) {
        statusCard.classList.add('status-warning');
        statusLabel.textContent = 'Beban Ginjal: Mendekati Batas';
        statusBadge.textContent = 'Waspada ⚠️';
        statusDesc.textContent = `${topNutrient.name} sudah mencapai ${Math.round(topNutrient.pct)}% batas harian. Pilih menu rendah ${topNutrient.name.toLowerCase()} untuk berikutnya.`;
    } else {
        statusCard.classList.add('status-safe');
        statusLabel.textContent = 'Beban Ginjal: Optimal';
        statusBadge.textContent = 'Aman 🌿';
        statusDesc.textContent = 'Semua asupan (Kalium, Fosfor, Natrium & Cairan) berada dalam batas aman.';
    }
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
    tempProfilePhoto = null;
    if (userProfile) {
        if (inputUserName) inputUserName.value = userProfile.name || "";
        if (inputWeight) inputWeight.value = userProfile.weightKg || 60;
        if (inputUrine) inputUrine.value = (userProfile.urineMl !== undefined && userProfile.urineMl !== null) ? userProfile.urineMl : 500;
        inputLimitKalium.value = userProfile.kaliumLimit;
        inputLimitFosfor.value = userProfile.fosforLimit;
        inputLimitNatrium.value = userProfile.natriumLimit || 2000;
        inputLimitAir.value = userProfile.airLimit || 1000;
        selectTherapyType(userProfile.therapyType || 'HD', false);
        renderModalAvatarPreview(userProfile.photo, userProfile.name);
    } else {
        if (inputUserName) inputUserName.value = "";
        if (inputWeight) inputWeight.value = 60;
        if (inputUrine) inputUrine.value = 500;
        selectTherapyType('HD', true);
        renderModalAvatarPreview(null, "");
    }
});

// Therapy selection buttons
therapyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        selectTherapyType(btn.dataset.type, true);
    });
});

// Real-time Consensus Calculation when Weight or Urine changes
if (inputWeight) {
    inputWeight.addEventListener('input', () => {
        calculateConsensusLimits(false);
    });
}

if (inputUrine) {
    inputUrine.addEventListener('input', () => {
        calculateConsensusLimits(false);
    });
}

// Report Modal Event Listeners
if (btnOpenReport) {
    btnOpenReport.addEventListener('click', () => {
        const therapyType = (userProfile && userProfile.therapyType) ? userProfile.therapyType : 'HD';
        const defaultPeriod = THERAPY_PRESETS[therapyType] ? THERAPY_PRESETS[therapyType].defaultPeriod : 3;
        reportModal.classList.remove('hidden');
        generateCumulativeReport(defaultPeriod);
    });
}

if (btnCloseReport) {
    btnCloseReport.addEventListener('click', () => {
        reportModal.classList.add('hidden');
    });
}

reportPeriodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const period = parseInt(tab.dataset.period);
        generateCumulativeReport(period);
    });
});

if (btnPrintReport) {
    btnPrintReport.addEventListener('click', () => {
        window.print();
    });
}

if (btnExportCsv) {
    btnExportCsv.addEventListener('click', exportReportCSV);
}

if (btnCopyWa) {
    btnCopyWa.addEventListener('click', copyReportToWhatsApp);
}

// Backup & Restore Listeners
if (btnBackupData) {
    btnBackupData.addEventListener('click', backupAppData);
}

if (btnTriggerRestore) {
    btnTriggerRestore.addEventListener('click', () => inputRestoreFile.click());
}

if (inputRestoreFile) {
    inputRestoreFile.addEventListener('change', restoreAppData);
}

if (btnCloseProfile) {
    btnCloseProfile.addEventListener('click', () => {
        if (userProfile) {
            modalProfile.classList.add('hidden');
            tempProfilePhoto = null;
        } else {
            alert("Harap lengkapi profil Anda terlebih dahulu.");
        }
    });
}

if (btnCancelProfile) {
    btnCancelProfile.addEventListener('click', () => {
        if (userProfile) {
            modalProfile.classList.add('hidden');
            tempProfilePhoto = null;
        } else {
            alert("Harap lengkapi profil Anda terlebih dahulu.");
        }
    });
}

if (profileAvatarUploader) {
    profileAvatarUploader.addEventListener('click', () => inputProfilePhoto.click());
}

if (btnChoosePhoto) {
    btnChoosePhoto.addEventListener('click', () => inputProfilePhoto.click());
}

if (btnRemovePhoto) {
    btnRemovePhoto.addEventListener('click', () => {
        tempProfilePhoto = "";
        renderModalAvatarPreview(null, inputUserName.value);
        inputProfilePhoto.value = '';
    });
}

if (inputProfilePhoto) {
    inputProfilePhoto.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        processImageFile(file, (dataUrl) => {
            tempProfilePhoto = dataUrl;
            renderModalAvatarPreview(dataUrl, inputUserName.value);
        });
    });
}

if (inputUserName) {
    inputUserName.addEventListener('input', function() {
        const currentPhoto = (tempProfilePhoto === "") ? null : (tempProfilePhoto || (userProfile && userProfile.photo) || null);
        if (!currentPhoto) {
            renderModalAvatarPreview(null, this.value);
        }
    });
}

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