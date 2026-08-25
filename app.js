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

    // Jika harga sudah berupa teks seperti:
    // "Mulai Rp150.000"
    if (
        harga.toLowerCase().includes("mulai")
    ) {

        return harga;

    }

    // Ambil angka saja
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
// DATA PRODUK DEFAULT
// =========================

const defaultProducts = [
    // PINDAHKAN SEMUA DATA PRODUK LAMA KE SINI

];

// =========================
// PRODUK ADMIN
// =========================

let adminProducts =
    JSON.parse(
        localStorage.getItem("ronaProducts")
    ) || [];


// =========================
// SEMUA PRODUK
// =========================

let products = [
    ...defaultProducts,
    ...adminProducts
];

// =========================
// STATUS FILTER KATALOG
// =========================

let kataPencarian = "";

let kategoriAktif = "Semua";

let subkategoriAktif = "Semua";

// =========================
// DATA SUBKATEGORI KATALOG
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
// TAMPILKAN PRODUK
// =========================

function tampilkanProduk(data) {

    productContainer.innerHTML = "";

    if (data.length === 0) {

        productContainer.innerHTML = `
            <p style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 30px;
                color: #888;
            ">
                Produk tidak ditemukan.
            </p>
        `;

        return;
    }

    data.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-image"
            >

            <div class="product-info">

                <div class="product-category">
                    ${product.category}
                </div>

                <div class="product-name">
                    ${product.name}
                </div>

                <div class="product-subcategory">
                    ${product.subcategory || ""}
                </div>

                <div class="product-price">
                    ${formatHarga(product)}
                </div>

                <button
                    class="detail-button"
                    type="button"
                >
                    Lihat Detail
                </button>

            </div>
        `;

        card.addEventListener("click", () => {

            tampilkanDetail(product);

        });

        productContainer.appendChild(card);

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

            <button class="close-detail">
                ✕
            </button>

            <img
                src="${product.image}"
                alt="${product.name}"
                class="detail-image"
            >

            <div class="detail-content">

                <div class="detail-category">
                    ${product.category}
                </div>

                <h2>
                    ${product.name}
                </h2>

                <div class="detail-price">
                 ${formatHarga(product)}
                </div>

                <p>
                    ${product.description ||
                    "Deskripsi produk belum tersedia."}
                </p>

<button
    class="whatsapp-button"
    id="tombolWhatsApp"
>
    💬 Pesan via WhatsApp
</button>

${
    product.subcategory === "Undangan Website Online"
    && product.website
    ? `
        <button
            class="website-button"
            id="tombolWebsite"
            type="button"
        >
            🌐 Lihat Website Undangan
        </button>
    `
    : ""
}

            </div>

        </div>
    `;


    document.body.appendChild(detail);


    // TOMBOL TUTUP

    const tombolTutup =
        detail.querySelector(".close-detail");


    tombolTutup.addEventListener("click", () => {

        detail.remove();

    });


    // KLIK DI LUAR POPUP

    detail.addEventListener("click", (event) => {

        if (event.target === detail) {

            detail.remove();

        }

    });


    // WHATSAPP

    const tombolWhatsApp =
        detail.querySelector("#tombolWhatsApp");


    tombolWhatsApp.addEventListener("click", () => {

        const pesan =
            `Halo RONA CREATION, saya tertarik dengan produk ${product.name}. Mohon informasi lebih lanjut.`;

        const url =
            `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

        window.open(url, "_blank");

    });

}



// =========================
// SINKRONISASI PRODUK
// =========================

function sinkronisasiProduk() {

    adminProducts =
        JSON.parse(
            localStorage.getItem("ronaProducts")
        ) || [];


    products = [
        ...defaultProducts,
        ...adminProducts
    ];


    // =========================
    // TERAPKAN FILTER KEMBALI
    // =========================

    tampilkanProdukTerfilter();

}

// =========================
// TAMPILKAN PRODUK TERFILTER
// =========================

function tampilkanProdukTerfilter() {

    const keyword =
        kataPencarian
            .toLowerCase()
            .trim();


    let hasil =
        products.filter(product => {

            // =========================
            // PENCARIAN
            // =========================

            const cocokPencarian =
                !keyword ||

                product.name
                    .toLowerCase()
                    .includes(keyword)

                ||

                product.category
                    .toLowerCase()
                    .includes(keyword)

                ||

                (
                    product.description || ""
                )
                .toLowerCase()
                .includes(keyword);


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
                product.subcategory
                    .toString()
                    .trim()
                    .toLowerCase() ===
                subkategoriAktif
                    .toString()
                    .trim()
                    .toLowerCase()
            );


            // =========================
            // HASIL
            // =========================

            return (
                cocokPencarian &&
                cocokKategori &&
                cocokSubkategori
            );

        });


    tampilkanProduk(hasil);

}


// =========================
// PENCARIAN
// =========================

const searchInput =
    document.getElementById("searchInput");


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
    document.querySelectorAll(".category");

categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            // Hapus active dari semua kategori
            categoryButtons.forEach(btn => {

                btn.classList.remove("active");

            });

            // Aktifkan kategori yang dipilih
            button.classList.add("active");

            // Simpan kategori
            kategoriAktif =
                button.textContent.trim();

            // Reset subkategori
            subkategoriAktif =
                "Semua";

            // Tampilkan subkategori
            tampilkanSubkategoriKatalog(
                kategoriAktif
            );

            // Tampilkan produk
            tampilkanProdukTerfilter();

        }
    );

});


// =========================
// TAMPILKAN SUBKATEGORI KATALOG
// =========================

function tampilkanSubkategoriKatalog(kategori) {

    const container =
        document.getElementById(
            "subcategoryFilter"
        );

    if (!container) {

        console.error(
            "Container subkategori tidak ditemukan."
        );

        return;

    }

    // Kosongkan terlebih dahulu
    container.innerHTML = "";

    // =========================
    // SEMUA KATEGORI
    // =========================

    if (
        !kategori ||
        kategori === "Semua"
    ) {

        return;

    }

    // =========================
    // AMBIL DATA SUBKATEGORI
    // =========================

    const daftar =
        subkategoriProduk[kategori] || [];

    // Jika belum ada subkategori
    if (daftar.length === 0) {

        return;

    }

    // =========================
    // TOMBOL SEMUA
    // =========================

    const tombolSemua =
        document.createElement("button");

    tombolSemua.type = "button";

    tombolSemua.className =
        "subcategory-button active";

    tombolSemua.textContent =
        `Semua ${kategori}`;

    tombolSemua.dataset.subcategory =
        "Semua";

    container.appendChild(
        tombolSemua
    );

    // =========================
    // EVENT TOMBOL SEMUA
    // =========================

    tombolSemua.addEventListener(
        "click",
        () => {

            subkategoriAktif =
                "Semua";

            // Active
            container
                .querySelectorAll(
                    ".subcategory-button"
                )
                .forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });

            tombolSemua.classList.add(
                "active"
            );

            tampilkanProdukTerfilter();

        }
    );

    // =========================
    // TOMBOL SUBKATEGORI
    // =========================

    daftar.forEach(subkategori => {

        const tombol =
            document.createElement("button");

        tombol.type = "button";

        tombol.className =
            "subcategory-button";

        tombol.textContent =
            subkategori;

        tombol.dataset.subcategory =
            subkategori;

        container.appendChild(
            tombol
        );

        // =========================
        // KLIK SUBKATEGORI
        // =========================

        tombol.addEventListener(
            "click",
            () => {

                subkategoriAktif =
                    subkategori;

                container
                    .querySelectorAll(
                        ".subcategory-button"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });

                tombol.classList.add(
                    "active"
                );

                tampilkanProdukTerfilter();

            }
        );

    });

}

// =========================
// EVENT STORAGE
// =========================

window.addEventListener(
    "storage",
    (event) => {

        if (
            event.key === "ronaProducts"
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
// TAMPILKAN PRODUK SAAT AWAL
// =========================

tampilkanProdukTerfilter();

// =========================
// BAGIKAN KATALOG
// =========================

const tombolBagikan =
    document.getElementById("shareCatalogButton");

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

            if (navigator.share) {

                try {

                    await navigator.share(
                        dataBagikan
                    );

                } catch (error) {

                    console.log(
                        "Share dibatalkan."
                    );

                }

                return;

            }


            // =========================
            // BROWSER TANPA SHARE
            // =========================

            try {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                alert(
                    "Link katalog berhasil disalin.\n\nSilakan kirim link tersebut ke customer."
                );

            } catch (error) {

                alert(
                    "Silakan salin alamat katalog dari browser."
                );

            }

        }
    );

}