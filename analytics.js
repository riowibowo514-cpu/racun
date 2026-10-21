/*
 * Fase 3 — Penghitung kunjungan anonim (Vercel Web Analytics, paket gratis Hobby).
 *
 * Prinsip:
 * - TIDAK memakai cookie (Vercel Web Analytics bersifat cookieless).
 * - TIDAK mengirim nama, foto, berat badan, atau isi catatan asupan.
 *   Yang dikirim hanya "jalur virtual" (contoh: /pwa/src-rs-sardjito) + data standar
 *   Vercel (negara, jenis perangkat, OS, browser, referrer).
 * - Semua query string asli dibuang sebelum dikirim.
 * - Pengguna bisa mematikan penghitung kapan saja dari menu Profil.
 *
 * Karena paket Hobby tidak mendukung Custom Events & UTM, informasi
 * "mode aplikasi" dan "sumber tautan" dikodekan ke dalam jalur halaman,
 * sehingga terlihat pada panel "Pages" di dashboard Vercel:
 *   /web            -> dibuka lewat browser biasa
 *   /pwa            -> dibuka dari ikon aplikasi terpasang (layar utama)
 *   /.../src-<nama> -> pengguna pertama kali datang dari tautan ?src=<nama>
 *   /event/terpasang -> momen aplikasi dipasang (Chrome/Android)
 */
(function () {
    'use strict';

    var OPT_OUT_KEY = 'ggk_analytics_optout';
    var SRC_KEY = 'ggk_first_src';

    function safeGet(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }
    function safeSet(key, val) {
        try { localStorage.setItem(key, val); } catch (e) { /* abaikan */ }
    }

    // Hormati pilihan pengguna & sinyal "Do Not Track" peramban
    if (safeGet(OPT_OUT_KEY) === '1') return;
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

    // Hanya aktif di hosting Vercel (bukan localhost / file lokal)
    var host = location.hostname;
    if (!host || host === 'localhost' || host === '127.0.0.1' || location.protocol === 'file:') return;

    var params = new URLSearchParams(location.search);

    // Simpan sumber pertama (first-touch) agar kunjungan berikutnya tetap teratribusi
    var rawSrc = params.get('src');
    if (rawSrc) {
        var cleanSrc = rawSrc.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
        if (cleanSrc && !safeGet(SRC_KEY)) safeSet(SRC_KEY, cleanSrc);
    }

    function isStandalone() {
        return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
            window.navigator.standalone === true ||
            params.get('mode') === 'pwa';
    }

    function buildVirtualPath() {
        var path = isStandalone() ? '/pwa' : '/web';
        var src = safeGet(SRC_KEY);
        if (src) path += '/src-' + src;
        return path;
    }

    // Antrean resmi Vercel Web Analytics
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };

    // Ubah URL sebelum dikirim: buang query string & ganti dengan jalur virtual anonim
    window.va('beforeSend', function (event) {
        try {
            var u = new URL(event.url);
            if (u.pathname.indexOf('/event/') === 0) {
                event.url = u.origin + u.pathname; // event manual, tanpa query
            } else {
                event.url = u.origin + buildVirtualPath();
            }
        } catch (e) { /* biarkan apa adanya */ }
        return event;
    });

    // Catat momen pemasangan PWA sebagai "page view" khusus (gratis di paket Hobby)
    window.addEventListener('appinstalled', function () {
        window.va('pageview', { route: '/event/terpasang', path: '/event/terpasang' });
    });

    var s = document.createElement('script');
    s.defer = true;
    s.src = '/_vercel/insights/script.js';
    document.head.appendChild(s);
})();
