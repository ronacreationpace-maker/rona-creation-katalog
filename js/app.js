"use strict";

// =========================
// NOMOR WHATSAPP
// =========================

const nomorWhatsApp = "6281255739197";


// =========================
// FORMAT HARGA RUPIAH
// =========================

function formatHarga(product) {

    const harga =
        String(product.price || "").trim();

    if (
        harga.toLowerCase().includes("mulai")
    ) {

        return harga;

    }

    const angka =
        Number(
            harga.replace(/[^\d]/g, "")
        );

    if (!angka) {

        return harga;

    }

    return angka.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    });

}
// =========================
// FORMAT HARGA PROMO
// =========================

function tampilkanHargaPromo(product) {

    console.log("CEK PRODUK PROMO:", product);

    // =========================
    // HARGA NORMAL
    // =========================

    const hargaNormal =
        Number(
            String(product.price || "")
                .replace(/[^\d]/g, "")
        ) || 0;


    // =========================
    // HARGA PROMO
    // =========================

    const hargaPromo =
        Number(
            String(
                product.pricePromo ??
                product.promoPrice ??
                ""
            )
            .replace(/[^\d]/g, "")
        ) || 0;


    console.log(
        "HARGA NORMAL:",
        hargaNormal,
        "HARGA PROMO:",
        hargaPromo
    );


    // =========================
    // TIDAK ADA PROMO
    // =========================

    if (
        !hargaPromo ||
        hargaPromo <= 0 ||
        hargaPromo >= hargaNormal
    ) {

        return `
            <div class="product-price">
                ${formatHarga({
                    price: hargaNormal
                })}
            </div>
        `;

    }


    // =========================
    // ADA PROMO
    // =========================

    return `
        <div class="product-price-promo">

            <div class="harga-coret">
                ${formatHarga({
                    price: hargaNormal
                })}
            </div>

            <div class="harga-promo">
                ${formatHarga({
                    price: hargaPromo
                })}

                  <div class="label-promo">
                🔥 PROMO
            </div>
        </div>
    `;

}
// =========================
// DATA PRODUK
// =========================

let defaultProducts = [];

let adminProducts = [];

let products = [];


// =========================
// STATUS FILTER
// =========================

let kataPencarian = "";

let kategoriAktif = "Semua";

let subkategoriAktif = "Semua";

let urutanAktif = "terbaru";


// =========================
// DATA SUBKATEGORI
// =========================

const subkategoriProduk = {

    "Mahar": [
        "Mahar Akrilik",
        "Mahar Jawa",
        "Mahar Custom"
    ],

    "Undangan": [
        "Undangan Blangko",
        "Undangan Custom",
        "Undangan Website Online"
    ],

    "Hantaran": [
        "Hantaran Akrilik",
        "Hantaran Rotan",
        "Hantaran Box Mika"
    ],

    "Pigura & Cetak Foto": [
        "Pigura",
        "Cetak Foto",
        "Pigura Custom"
    ],

    "Lainnya": [
        "Yasin",
        "Banner",
        "Stiker",
        "Buket"
    ]

};


// =========================
// CONTAINER PRODUK
// =========================

const productContainer =
    document.getElementById("productContainer");


// =========================
// LOAD PRODUK DARI GITHUB
// =========================

async function loadProducts() {

    try {

        const response =
            await fetch(
                "products.json?versi=" +
                Date.now()
            );

        if (!response.ok) {

            throw new Error(
                "products.json tidak ditemukan"
            );

        }

        const data =
            await response.json();


        // =========================
        // SUPPORT 2 FORMAT JSON
        // =========================

        if (Array.isArray(data)) {

            defaultProducts = data;

        }

        else if (
            data &&
            Array.isArray(data.products)
        ) {

            defaultProducts =
                data.products;

        }

        else {

            defaultProducts = [];

        }


        console.log(
            "Produk dari GitHub:",
            defaultProducts.length
        );


        // =========================
        // AMBIL LOCAL STORAGE
        // =========================

        try {

            adminProducts =
                JSON.parse(
                    localStorage.getItem(
                        "ronaProducts"
                    )
                ) || [];

        }

        catch (error) {

            adminProducts = [];

        }


        // =========================
        // GUNAKAN DATA GITHUB
        // =========================
        //
        // Jika GitHub mempunyai produk,
        // gunakan produk GitHub saja.
        //
        // Ini mencegah produk DOUBLE.
        //
        // Jika GitHub kosong,
        // gunakan localStorage sebagai cadangan.
        // =========================

        if (
            defaultProducts.length > 0
        ) {

            products =
                defaultProducts;

        }

        else {

            products =
                adminProducts;

        }


        console.log(
            "TOTAL PRODUK DITAMPILKAN:",
            products.length
        );


        tampilkanProdukTerfilter();


    }

    catch (error) {

        console.error(
            "Gagal memuat products.json:",
            error
        );


        // =========================
        // FALLBACK LOCAL STORAGE
        // =========================

        try {

            adminProducts =
                JSON.parse(
                    localStorage.getItem(
                        "ronaProducts"
                    )
                ) || [];

        }

        catch (e) {

            adminProducts = [];

        }


        products =
            adminProducts;


        console.log(
            "Menggunakan produk LocalStorage:",
            products.length
        );


        tampilkanProdukTerfilter();

    }

}

// =========================
// TAMPILKAN PRODUK
// =========================

function tampilkanProduk(data) {

    if (!productContainer) {

        console.error(
            "productContainer tidak ditemukan."
        );

        return;

    }

    productContainer.innerHTML = "";


    // =========================
    // PRODUK KOSONG
    // =========================

    if (!data || data.length === 0) {

        productContainer.innerHTML = `

            <div
                style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                    color: #888;
                "
            >

                <div
                    style="
                        font-size: 45px;
                        margin-bottom: 10px;
                    "
                >
                    🔍
                </div>

                <strong
                    style="
                        display: block;
                        color: #555;
                        font-size: 16px;
                        margin-bottom: 5px;
                    "
                >
                    Produk tidak ditemukan
                </strong>

                <span
                    style="
                        font-size: 12px;
                    "
                >
                    Coba gunakan kata pencarian atau
                    kategori yang berbeda.
                </span>

            </div>

        `;

        return;

    }


    // =========================
    // LOOP PRODUK
    // =========================

    data.forEach(product => {

        const card =
            document.createElement("div");


        card.className =
            "product-card";


        // =========================
        // DATA PRODUK
        // =========================

        const image =
            product.image || "";


        const nama =
            product.name ||
            "Produk RONA CREATION";


        const kategori =
            product.category ||
            "";


        const subkategori =
            product.subcategory ||
            "";


        // =========================
        // CARD
        // =========================

        card.innerHTML = `

            <!-- FOTO PRODUK -->

            <div class="product-image-wrapper">

                ${
                    image

                    ?

                    `
                    <img
                        src="${image}"
                        alt="${nama}"
                        class="product-image"
                        loading="lazy"
                    >
                    `

                    :

                    `
                    <div class="product-no-image">

                        <span>
                            📦
                        </span>

                        <small>
                            RONA CREATION
                        </small>

                    </div>
                    `

                }

            </div>


            <!-- INFO PRODUK -->

            <div class="product-info">


                <!-- KATEGORI -->

                ${
                    kategori

                    ?

                    `
                    <div class="product-category">

                        ${kategori}

                    </div>
                    `

                    :

                    ""

                }


                <!-- NAMA PRODUK -->

                <div class="product-name">

                    ${nama}

                </div>


                <!-- SUBKATEGORI -->

                ${
                    subkategori

                    ?

                    `
                    <div class="product-subcategory">

                        ${subkategori}

                    </div>
                    `

                    :

                    ""

                }


                <!-- HARGA -->

                ${tampilkanHargaPromo(product)}

                <!-- TOMBOL -->

                <button
                    class="detail-button"
                    type="button"
                >

                    Lihat Detail

                </button>


            </div>

        `;


        // =========================
        // KLIK CARD
        // =========================

        card.addEventListener(
            "click",
            () => {

                tampilkanDetail(product);

            }
        );


        // =========================
        // TOMBOL DETAIL
        // =========================

        const tombolDetail =
            card.querySelector(
                ".detail-button"
            );


        if (tombolDetail) {

            tombolDetail.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    tampilkanDetail(product);

                }
            );

        }


        // =========================
        // MASUKKAN CARD
        // =========================

        productContainer.appendChild(
            card
        );

    });

}

// =========================
// DETAIL PRODUK
// =========================

function tampilkanDetail(product) {

    const detail =
        document.createElement("div");


    detail.className =
        "detail-overlay";


    detail.innerHTML = `

        <div class="detail-modal">

            <button
                class="close-detail"
                type="button"
            >

                ✕

            </button>


            <img
                src="${product.image || ""}"
                alt="${product.name || "Produk"}"
                class="detail-image"
            >


            <div class="detail-content">

                <div class="detail-category">

                    ${product.category || ""}

                </div>


                <h2>

                    ${product.name || "Produk"}

                </h2>


                <div class="detail-price">

                     ${tampilkanHargaPromo(product)}

                </div>


                <p>

                    ${
                        product.description ||
                        "Deskripsi produk belum tersedia."
                    }

                </p>


                <button
                    class="whatsapp-button"
                    id="tombolWhatsApp"
                    type="button"
                >

                    💬 Pesan via WhatsApp

                </button>


                ${
                    product.subcategory ===
                        "Undangan Website Online"
                    &&
                    product.website
                    ?

                    `

                    <button
                        class="website-button"
                        id="tombolWebsite"
                        type="button"
                    >

                        🌐 Lihat Website Undangan

                    </button>

                    `

                    :

                    ""

                }

            </div>

        </div>

    `;


    document.body.appendChild(
        detail
    );


    // =========================
    // TOMBOL TUTUP
    // =========================

    const tombolTutup =
        detail.querySelector(
            ".close-detail"
        );


    tombolTutup.addEventListener(
        "click",
        () => {

            detail.remove();

        }
    );


    // =========================
    // KLIK DI LUAR POPUP
    // =========================

    detail.addEventListener(
        "click",
        event => {

            if (
                event.target === detail
            ) {

                detail.remove();

            }

        }
    );


    // =========================
    // WHATSAPP
    // =========================

    const tombolWhatsApp =
        detail.querySelector(
            "#tombolWhatsApp"
        );


    if (tombolWhatsApp) {

        tombolWhatsApp.addEventListener(
            "click",
            () => {

const pesan = `Halo RONA CREATION 👋

Saya tertarik dengan produk:

📦 ${product.name || "Produk RONA CREATION"}

🏷️ Kategori:
${product.category || "-"}

📂 Subkategori:
${product.subcategory || "-"}

💰 Harga:
${
    product.promoPrice &&
    Number(product.promoPrice) > 0 &&
    Number(product.promoPrice) <
    Number(
        String(product.price || "")
            .replace(/[^\d]/g, "")
    )
        ? formatHarga({
            price: product.promoPrice
        }) + " 🔥 PROMO"
        : formatHarga(product)
}

Mohon informasi lebih lanjut mengenai produk tersebut.

Terima kasih 🙏`;
                const url =
                    `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

                window.open(
                    url,
                    "_blank"
                );

            }
        );

    }


    // =========================
    // WEBSITE UNDANGAN
    // =========================

    const tombolWebsite =
        detail.querySelector(
            "#tombolWebsite"
        );


    if (tombolWebsite) {

        tombolWebsite.addEventListener(
            "click",
            () => {

                window.open(
                    product.website,
                    "_blank"
                );

            }
        );

    }

}


// =========================
// FILTER + URUTKAN
// =========================

function tampilkanProdukTerfilter() {

    const keyword =
        kataPencarian
            .toLowerCase()
            .trim();


    let hasil =
        products.filter(
            product => {


                // =========================
                // PENCARIAN
                // =========================

                const nama =
                    String(
                        product.name || ""
                    )
                    .toLowerCase();


                const kategori =
                    String(
                        product.category || ""
                    )
                    .toLowerCase();


                const subkategori =
                    String(
                        product.subcategory || ""
                    )
                    .toLowerCase();


                const deskripsi =
                    String(
                        product.description || ""
                    )
                    .toLowerCase();


                const cocokPencarian =
                    !keyword ||

                    nama.includes(keyword) ||

                    kategori.includes(keyword) ||

                    subkategori.includes(keyword) ||

                    deskripsi.includes(keyword);


                // =========================
                // KATEGORI
                // =========================

                const cocokKategori =
                    kategoriAktif === "Semua" ||

                    product.category ===
                    kategoriAktif;


                // =========================
                // SUBKATEGORI
                // =========================

                const cocokSubkategori =
                    subkategoriAktif === "Semua" ||

                    (
                        product.subcategory &&

                        String(
                            product.subcategory
                        )
                        .trim()
                        .toLowerCase() ===

                        String(
                            subkategoriAktif
                        )
                        .trim()
                        .toLowerCase()
                    );


                return (

                    cocokPencarian &&

                    cocokKategori &&

                    cocokSubkategori

                );

            }
        );


    // =========================
    // URUTKAN
    // =========================

    hasil.sort(
        (a, b) => {


            // =========================
            // TERBARU
            // =========================

            if (
                urutanAktif ===
                "terbaru"
            ) {

                const idA =
                    Number(a.id) || 0;


                const idB =
                    Number(b.id) || 0;


                return idB - idA;

            }


            // =========================
            // NAMA A-Z
            // =========================

            if (
                urutanAktif ===
                "nama-az"
            ) {

                return String(
                    a.name || ""
                )
                .localeCompare(
                    String(
                        b.name || ""
                    ),
                    "id",
                    {
                        sensitivity:
                            "base"
                    }
                );

            }


            // =========================
            // NAMA Z-A
            // =========================

            if (
                urutanAktif ===
                "nama-za"
            ) {

                return String(
                    b.name || ""
                )
                .localeCompare(
                    String(
                        a.name || ""
                    ),
                    "id",
                    {
                        sensitivity:
                            "base"
                    }
                );

            }


            // =========================
            // HARGA
            // =========================

            const hargaA =
                Number(
                    String(
                        a.price || ""
                    )
                    .replace(
                        /[^\d]/g,
                        ""
                    )
                ) || 0;


            const hargaB =
                Number(
                    String(
                        b.price || ""
                    )
                    .replace(
                        /[^\d]/g,
                        ""
                    )
                ) || 0;


            // =========================
            // TERMURAH
            // =========================

            if (
                urutanAktif ===
                "harga-rendah"
            ) {

                return (
                    hargaA -
                    hargaB
                );

            }


            // =========================
            // TERMAHAL
            // =========================

            if (
                urutanAktif ===
                "harga-tinggi"
            ) {

                return (
                    hargaB -
                    hargaA
                );

            }


            return 0;

        }
    );


    tampilkanProduk(
        hasil
    );

}


// =========================
// URUTKAN PRODUK
// =========================

const sortSelect =
    document.getElementById(
        "sortSelect"
    );


if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        () => {

            urutanAktif =
                sortSelect.value;


            tampilkanProdukTerfilter();

        }
    );

}


// =========================
// PENCARIAN
// =========================

const searchInput =
    document.getElementById(
        "searchInput"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            kataPencarian =
                searchInput.value;


            tampilkanProdukTerfilter();

        }
    );

}


// =========================
// FILTER KATEGORI
// =========================

const categoryButtons =
    document.querySelectorAll(
        ".category"
    );


categoryButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {


                // =========================
                // ACTIVE KATEGORI
                // =========================

                categoryButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                // =========================
                // SIMPAN KATEGORI
                // =========================

                kategoriAktif =
                    button.textContent.trim();


                // =========================
                // RESET SUBKATEGORI
                // =========================

                subkategoriAktif =
                    "Semua";


                // =========================
                // TAMPILKAN SUBKATEGORI
                // =========================

                tampilkanSubkategoriKatalog(
                    kategoriAktif
                );


                // =========================
                // FILTER PRODUK
                // =========================

                tampilkanProdukTerfilter();

            }
        );

    }
);


// =========================
// SUBKATEGORI
// =========================

function tampilkanSubkategoriKatalog(
    kategori
) {

    const container =
        document.getElementById(
            "subcategoryFilter"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    // =========================
    // SEMUA
    // =========================

    if (
        !kategori ||
        kategori === "Semua"
    ) {

        return;

    }


    const daftar =
        subkategoriProduk[
            kategori
        ] || [];


    if (
        daftar.length === 0
    ) {

        return;

    }


    // =========================
    // TOMBOL SEMUA
    // =========================

    const tombolSemua =
        document.createElement(
            "button"
        );


    tombolSemua.type =
        "button";


    tombolSemua.className =
        "subcategory-button active";


    tombolSemua.textContent =
        `Semua ${kategori}`;


    tombolSemua.dataset.subcategory =
        "Semua";


    container.appendChild(
        tombolSemua
    );


    tombolSemua.addEventListener(
        "click",
        () => {

            subkategoriAktif =
                "Semua";


            container
                .querySelectorAll(
                    ".subcategory-button"
                )
                .forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


            tombolSemua.classList.add(
                "active"
            );


            tampilkanProdukTerfilter();

        }
    );


    // =========================
    // SUBKATEGORI
    // =========================

    daftar.forEach(
        subkategori => {


            const tombol =
                document.createElement(
                    "button"
                );


            tombol.type =
                "button";


            tombol.className =
                "subcategory-button";


            tombol.textContent =
                subkategori;


            tombol.dataset.subcategory =
                subkategori;


            container.appendChild(
                tombol
            );


            tombol.addEventListener(
                "click",
                () => {


                    subkategoriAktif =
                        subkategori;


                    container
                        .querySelectorAll(
                            ".subcategory-button"
                        )
                        .forEach(
                            btn => {

                                btn.classList.remove(
                                    "active"
                                );

                            }
                        );


                    tombol.classList.add(
                        "active"
                    );


                    tampilkanProdukTerfilter();

                }
            );

        }
    );

}


// =========================
// SINKRONISASI LOCAL STORAGE
// =========================

function sinkronisasiProduk() {

    try {

        adminProducts =
            JSON.parse(
                localStorage.getItem(
                    "ronaProducts"
                )
            ) || [];

    }

    catch (error) {

        adminProducts = [];

    }


    // Jika data GitHub ada,
    // jangan gabungkan lagi
    // agar tidak double.

    if (
        defaultProducts.length > 0
    ) {

        products =
            defaultProducts;

    }

    else {

        products =
            adminProducts;

    }


    tampilkanProdukTerfilter();

}


// =========================
// EVENT STORAGE
// =========================

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            "ronaProducts"
        ) {

            sinkronisasiProduk();

        }

    }
);


// =========================
// EVENT PRODUK BERUBAH
// =========================

window.addEventListener(
    "produkBerubah",
    () => {

        sinkronisasiProduk();

    }
);


// =========================
// BAGIKAN KATALOG
// =========================

const tombolBagikan =
    document.getElementById(
        "shareCatalogButton"
    );


if (tombolBagikan) {

    tombolBagikan.addEventListener(
        "click",
        async () => {


            const dataBagikan = {

                title:
                    "RONA CREATION - Katalog Produk",

                text:
                    "✨ Lihat katalog produk RONA CREATION\nMahar • Undangan • Hantaran • Custom",

                url:
                    window.location.href

            };


            // =========================
            // SHARE HP
            // =========================

            if (
                navigator.share
            ) {

                try {

                    await navigator.share(
                        dataBagikan
                    );

                }

                catch (error) {

                    console.log(
                        "Share dibatalkan."
                    );

                }

                return;

            }


            // =========================
            // COPY LINK
            // =========================

            try {

                await navigator.clipboard.writeText(
                    window.location.href
                );


                alert(
                    "Link katalog berhasil disalin.\n\nSilakan kirim link tersebut ke customer."
                );

            }

            catch (error) {

                alert(
                    "Silakan salin alamat katalog dari browser."
                );

            }

        }
    );

}


// =========================
// MULAI KATALOG
// =========================

loadProducts();

// =========================
// HERO PRODUK
// =========================

function tampilkanProdukHero() {

    const heroImage =
        document.getElementById(
            "heroProductImage"
        );

    const heroName =
        document.getElementById(
            "heroProductName"
        );

    const heroCategory =
        document.getElementById(
            "heroProductCategory"
        );


    if (!heroImage || !heroName || !heroCategory) {
        return;
    }


    if (
        !products ||
        products.length === 0
    ) {
        return;
    }


    // Ambil produk terbaru
    const produkHero =
        [...products].sort(
            (a, b) =>
                (Number(b.id) || 0) -
                (Number(a.id) || 0)
        )[0];


    // FOTO

    if (produkHero.image) {

        heroImage.src =
            produkHero.image;

        heroImage.alt =
            produkHero.name ||
            "Produk RONA CREATION";

    }


    // NAMA

    heroName.textContent =
        produkHero.name ||
        "RONA CREATION";


    // KATEGORI

    heroCategory.textContent =
        [
            produkHero.category,
            produkHero.subcategory
        ]
        .filter(Boolean)
        .join(" • ");

}


// =========================
// JALANKAN HERO
// =========================

const heroCek =
    setInterval(
        () => {

            if (
                products &&
                products.length > 0
            ) {

                tampilkanProdukHero();

                clearInterval(heroCek);

            }

        },
        100
    );

// =========================================================
// TOMBOL WHATSAPP HERO + CTA
// =========================================================

function bukaWhatsAppRona() {

    const pesan =
        "Halo RONA CREATION, saya ingin konsultasi mengenai produk. Mohon informasi lebih lanjut.";

    const url =
        `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

    window.open(
        url,
        "_blank"
    );

}


// =========================================================
// TOMBOL HERO
// =========================================================

const heroWhatsappButton =
    document.getElementById(
        "heroWhatsappButton"
    );

if (heroWhatsappButton) {

    heroWhatsappButton.addEventListener(
        "click",
        bukaWhatsAppRona
    );

}


// =========================================================
// TOMBOL CTA
// =========================================================

const ctaWhatsappButton =
    document.getElementById(
        "ctaWhatsappButton"
    );

if (ctaWhatsappButton) {

    ctaWhatsappButton.addEventListener(
        "click",
        bukaWhatsAppRona
    );

}       

/* =========================================================
   PROMO HARIAN - COUNTDOWN OTOMATIS
   ========================================================= */

function jalankanPromoHarian() {

    const promoDay =
        document.getElementById("promoDay");

    const promoHours =
        document.getElementById("promoHours");

    const promoMinutes =
        document.getElementById("promoMinutes");

    const promoSeconds =
        document.getElementById("promoSeconds");


    // Jika elemen promo belum ada,
    // hentikan agar tidak menyebabkan error
    if (
        !promoDay ||
        !promoHours ||
        !promoMinutes ||
        !promoSeconds
    ) {
        return;
    }


    function updatePromo() {

        const sekarang =
            new Date();

        // =====================================================
        // NAMA HARI
        // =====================================================

        const namaHari = [
            "MINGGU",
            "SENIN",
            "SELASA",
            "RABU",
            "KAMIS",
            "JUMAT",
            "SABTU"
        ];

        promoDay.textContent =
            "PROMO " +
            namaHari[
                sekarang.getDay()
            ] +
            "!";


        // =====================================================
        // TARGET JAM 00:00 BERIKUTNYA
        // =====================================================

        const besok =
            new Date(
                sekarang
            );

        besok.setDate(
            besok.getDate() + 1
        );

        besok.setHours(
            0,
            0,
            0,
            0
        );


        // =====================================================
        // HITUNG SELISIH WAKTU
        // =====================================================

        let selisih =
            besok.getTime() -
            sekarang.getTime();


        if (selisih < 0) {

            selisih =
                0;

        }


        const totalDetik =
            Math.floor(
                selisih / 1000
            );


        const jam =
            Math.floor(
                totalDetik / 3600
            );

        const menit =
            Math.floor(
                (totalDetik % 3600) / 60
            );

        const detik =
            totalDetik % 60;


        // =====================================================
        // TAMPILKAN
        // =====================================================

        promoHours.textContent =
            String(jam).padStart(
                2,
                "0"
            );

        promoMinutes.textContent =
            String(menit).padStart(
                2,
                "0"
            );

        promoSeconds.textContent =
            String(detik).padStart(
                2,
                "0"
            );

    }


    // Jalankan langsung
    updatePromo();


    // Update setiap detik
    setInterval(
        updatePromo,
        1000
    );

}


// =========================================================
// JALANKAN SAAT HALAMAN SIAP
// =========================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        jalankanPromoHarian
    );

} else {

    jalankanPromoHarian();

}
