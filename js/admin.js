// ============================================================
// RONA CREATION - ADMIN KATALOG
// ============================================================
// VERSI FINAL
//
// Fitur:
// - Tambah produk
// - Edit produk
// - Hapus produk
// - 3 foto produk
// - 1 video produk
// - Kompres foto otomatis
// - Subkategori
// - Kategori custom
// - Backup
// - Restore
// - Export products.json
// - Optimalkan foto lama
// - Pencarian
// - Statistik
// - Load products.json dari GitHub
// - Simpan ke GitHub melalui Cloudflare Worker
// - Anti duplikat produk
// - Aman jika elemen tertentu tidak ada di admin.html
// ============================================================


// ============================================================
// CLOUDFLARE WORKER
// ============================================================

const API_URL =
    "https://rona-katalog-api.ronacreation-pace.workers.dev";

const ADMIN_KEY =
    "ronaadmin080888";


// ============================================================
// ELEMENT HTML
// ============================================================

const productImage =
    document.getElementById("productImage");

const productImage2 =
    document.getElementById("productImage2");

const productImage3 =
    document.getElementById("productImage3");

const productVideo =
    document.getElementById("productVideo");

const imagePreview =
    document.getElementById("imagePreview");

const imagePreview2 =
    document.getElementById("imagePreview2");

const imagePreview3 =
    document.getElementById("imagePreview3");

const imagePreview4 =
    document.getElementById("imagePreview4");

const imagePreview5 =
    document.getElementById("imagePreview5");

const imagePreview6 =
    document.getElementById("imagePreview6");

const videoPreview =
    document.getElementById("videoPreview");

const imageSizeInfo =
    document.getElementById("imageSizeInfo");

const productName =
    document.getElementById("productName");

const productCategory =
    document.getElementById("productCategory");

const productSubcategory =
    document.getElementById("productSubcategory");

const productWebsite =
    document.getElementById("productWebsite");

const websiteLinkGroup =
    document.getElementById("websiteLinkGroup");

const productPrice =
    document.getElementById("productPrice");

const productPricePromo =
    document.getElementById("productPricePromo");

const productDescription =
    document.getElementById("productDescription");

const saveProductButton =
    document.getElementById("saveProductButton");

const cancelEditButton =
    document.getElementById("cancelEditButton");

const adminProductList =
    document.getElementById("adminProductList");

const productCount =
    document.getElementById("productCount");

const backupProductButton =
    document.getElementById("backupProductButton");

const compressProductsButton =
    document.getElementById("compressProductsButton");

const restoreProductButton =
    document.getElementById("restoreProductButton");

const restoreProductInput =
    document.getElementById("restoreProductInput");

const adminSearchInput =
    document.getElementById("adminSearchInput");

const statTotalProduk =
    document.getElementById("statTotalProduk");

const statProdukFoto =
    document.getElementById("statProdukFoto");

const statKategori =
    document.getElementById("statKategori");

const exportProductsButton =
    document.getElementById("exportProductsButton");


// ============================================================
// ELEMENT KELOLA KATEGORI
// Jika belum ada di HTML, tidak akan menyebabkan error
// ============================================================

const newCategory =
    document.getElementById("newCategory");

const newSubcategory =
    document.getElementById("newSubcategory");

const addCategoryButton =
    document.getElementById("addCategoryButton");

const adminCategoryList =
    document.getElementById("adminCategoryList");


// ============================================================
// BATAS VIDEO
// ============================================================

const MAX_VIDEO_SIZE =
    2 * 1024 * 1024;


// ============================================================
// BATAS STORAGE
// ============================================================

const MAX_STORAGE_MB =
    4.0;


// ============================================================
// DATA PRODUK
// ============================================================

let adminProducts = [];

try {

    const dataLocal =
        JSON.parse(
            localStorage.getItem("ronaProducts")
        );

    if (Array.isArray(dataLocal)) {

        adminProducts =
            dataLocal;

    }

} catch (error) {

    console.warn(
        "localStorage produk tidak valid:",
        error
    );

    adminProducts = [];

}


// ============================================================
// MODE EDIT
// ============================================================

window.editingProductId = null;


// ============================================================
// DATA KATEGORI & SUBKATEGORI
// ============================================================

const subkategoriAdmin = {

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

    "Cetak Foto": [
        "Cetak Foto 2R",
        "Cetak Foto 3R",
        "Cetak Foto 4R",
        "Cetak Foto Custom"
    ],

    "Yasin": [
        "Yasin Softcover",
        "Yasin Hardcover",
        "Yasin Custom"
    ],

    "Lainnya": [
        "Banner",
        "Stiker",
        "Buket",
        "Custom"
    ]

};


// ============================================================
// LOAD KATEGORI DARI LOCAL STORAGE
// ============================================================

try {

    const kategoriTersimpan =
        JSON.parse(
            localStorage.getItem("ronaKategori")
        );

    if (
        kategoriTersimpan &&
        typeof kategoriTersimpan === "object" &&
        !Array.isArray(kategoriTersimpan)
    ) {

        Object.keys(kategoriTersimpan)
            .forEach(function(kategori) {

                if (
                    Array.isArray(
                        kategoriTersimpan[kategori]
                    )
                ) {

                    subkategoriAdmin[kategori] =
                        kategoriTersimpan[kategori];

                }

            });

    }

} catch (error) {

    console.warn(
        "Data kategori tidak valid:",
        error
    );

}


// ============================================================
// SIMPAN KATEGORI
// ============================================================

function simpanKategori() {

    try {

        localStorage.setItem(
            "ronaKategori",
            JSON.stringify(subkategoriAdmin)
        );

    } catch (error) {

        console.error(
            "Gagal menyimpan kategori:",
            error
        );

    }

}


// ============================================================
// UPDATE PILIHAN KATEGORI
// ============================================================

function perbaruiPilihanKategori() {

    if (!productCategory) {
        return;
    }

    const nilaiLama =
        productCategory.value;

    productCategory.innerHTML = "";

    const optionAwal =
        document.createElement("option");

    optionAwal.value = "";
    optionAwal.textContent =
        "Pilih kategori";

    productCategory.appendChild(
        optionAwal
    );

    Object.keys(subkategoriAdmin)
        .forEach(function(kategori) {

            const option =
                document.createElement("option");

            option.value =
                kategori;

            option.textContent =
                kategori;

            if (kategori === nilaiLama) {

                option.selected =
                    true;

            }

            productCategory.appendChild(
                option
            );

        });

}


// ============================================================
// TAMPILKAN DAFTAR KATEGORI
// ============================================================

function tampilkanDaftarKategori() {

    if (!adminCategoryList) {
        return;
    }

    adminCategoryList.innerHTML = "";

    const semuaKategori =
        Object.keys(
            subkategoriAdmin
        );

    if (!semuaKategori.length) {

        adminCategoryList.innerHTML = `
            <div class="empty-product">
                Belum ada kategori.
            </div>
        `;

        return;
    }

    semuaKategori.forEach(
        function(kategori) {

            const box =
                document.createElement("div");

            box.className =
                "admin-category-item";

            const judul =
                document.createElement("h3");

            judul.textContent =
                kategori;

            box.appendChild(
                judul
            );

            const daftar =
                Array.isArray(
                    subkategoriAdmin[kategori]
                )
                    ? subkategoriAdmin[kategori]
                    : [];

            if (!daftar.length) {

                const kosong =
                    document.createElement("p");

                kosong.textContent =
                    "Belum ada subkategori.";

                box.appendChild(
                    kosong
                );

            }

            daftar.forEach(
                function(
                    subkategori,
                    index
                ) {

                    const baris =
                        document.createElement("div");

                    baris.className =
                        "admin-subcategory-item";

                    const nama =
                        document.createElement("span");

                    nama.textContent =
                        subkategori;

                    const tombolBox =
                        document.createElement("div");

                    const tombolEdit =
                        document.createElement("button");

                    tombolEdit.type =
                        "button";

                    tombolEdit.textContent =
                        "✏️";

                    tombolEdit.className =
                        "edit-subcategory-button";

                    const tombolHapus =
                        document.createElement("button");

                    tombolHapus.type =
                        "button";

                    tombolHapus.textContent =
                        "🗑️";

                    tombolHapus.className =
                        "delete-subcategory-button";

                    tombolBox.appendChild(
                        tombolEdit
                    );

                    tombolBox.appendChild(
                        tombolHapus
                    );

                    baris.appendChild(
                        nama
                    );

                    baris.appendChild(
                        tombolBox
                    );


                    // EDIT SUBKATEGORI

                    tombolEdit.addEventListener(
                        "click",
                        function() {

                            const namaBaru =
                                prompt(
                                    "Edit subkategori:",
                                    subkategori
                                );

                            if (
                                namaBaru ===
                                null
                            ) {

                                return;

                            }

                            const hasil =
                                namaBaru.trim();

                            if (!hasil) {

                                alert(
                                    "Nama subkategori tidak boleh kosong."
                                );

                                return;

                            }

                            const duplikat =
                                subkategoriAdmin[
                                    kategori
                                ].some(
                                    function(
                                        item,
                                        i
                                    ) {

                                        return (
                                            i !== index &&
                                            item
                                                .toLowerCase() ===
                                            hasil
                                                .toLowerCase()
                                        );

                                    }
                                );

                            if (duplikat) {

                                alert(
                                    "Subkategori tersebut sudah ada."
                                );

                                return;

                            }

                            subkategoriAdmin[
                                kategori
                            ][index] =
                                hasil;

                            simpanKategori();

                            tampilkanDaftarKategori();

                            tampilkanSubkategoriAdmin();

                        }
                    );


                    // HAPUS SUBKATEGORI

                    tombolHapus.addEventListener(
                        "click",
                        function() {

                            const yakin =
                                confirm(
                                    'Hapus subkategori "' +
                                    subkategori +
                                    '"?'
                                );

                            if (!yakin) {
                                return;
                            }

                            subkategoriAdmin[
                                kategori
                            ].splice(
                                index,
                                1
                            );

                            simpanKategori();

                            tampilkanDaftarKategori();

                            tampilkanSubkategoriAdmin();

                        }
                    );


                    box.appendChild(
                        baris
                    );

                }
            );

            adminCategoryList.appendChild(
                box
            );

        }
    );

}


// ============================================================
// TAMBAH KATEGORI / SUBKATEGORI
// ============================================================

if (addCategoryButton) {

    addCategoryButton.addEventListener(
        "click",
        function() {

            const kategori =
                newCategory
                    ? newCategory.value.trim()
                    : "";

            const subkategori =
                newSubcategory
                    ? newSubcategory.value.trim()
                    : "";

            if (!kategori) {

                alert(
                    "Nama kategori belum diisi."
                );

                if (newCategory) {
                    newCategory.focus();
                }

                return;

            }

            if (!subkategori) {

                alert(
                    "Nama subkategori belum diisi."
                );

                if (newSubcategory) {
                    newSubcategory.focus();
                }

                return;

            }

            let namaKategoriAsli =
                Object.keys(
                    subkategoriAdmin
                ).find(
                    function(item) {

                        return (
                            item.toLowerCase() ===
                            kategori.toLowerCase()
                        );

                    }
                );

            if (!namaKategoriAsli) {

                namaKategoriAsli =
                    kategori;

                subkategoriAdmin[
                    namaKategoriAsli
                ] = [];

            }

            const sudahAda =
                subkategoriAdmin[
                    namaKategoriAsli
                ].some(
                    function(item) {

                        return (
                            item.toLowerCase() ===
                            subkategori.toLowerCase()
                        );

                    }
                );

            if (sudahAda) {

                alert(
                    "Subkategori tersebut sudah ada."
                );

                return;

            }

            subkategoriAdmin[
                namaKategoriAsli
            ].push(
                subkategori
            );

            simpanKategori();

            perbaruiPilihanKategori();

            tampilkanDaftarKategori();

            tampilkanSubkategoriAdmin();

            if (newCategory) {
                newCategory.value = "";
            }

            if (newSubcategory) {
                newSubcategory.value = "";
            }

            alert(
                "✅ Subkategori berhasil ditambahkan."
            );

        }
    );

}


// ============================================================
// FORMAT RUPIAH
// ============================================================

function formatRupiah(angka) {

    const nilai =
        Number(
            String(
                angka ?? ""
            ).replace(
                /[^\d]/g,
                ""
            )
        );

    if (!Number.isFinite(nilai)) {

        return "Rp0";

    }

    return nilai.toLocaleString(
        "id-ID",
        {
            style:
                "currency",

            currency:
                "IDR",

            minimumFractionDigits:
                0
        }
    );

}


// ============================================================
// TAMPILKAN SUBKATEGORI
// ============================================================

function tampilkanSubkategoriAdmin(
    nilaiTerpilih = ""
) {

    if (!productSubcategory) {
        return;
    }

    const kategori =
        productCategory
            ? productCategory.value
            : "";

    productSubcategory.innerHTML = "";

    const pilihanAwal =
        document.createElement("option");

    pilihanAwal.value =
        "";

    pilihanAwal.textContent =
        "Pilih subkategori";

    productSubcategory.appendChild(
        pilihanAwal
    );

    const daftar =
        Array.isArray(
            subkategoriAdmin[kategori]
        )
            ? subkategoriAdmin[kategori]
            : [];

    daftar.forEach(
        function(subkategori) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                subkategori;

            option.textContent =
                subkategori;

            if (
                subkategori ===
                nilaiTerpilih
            ) {

                option.selected =
                    true;

            }

            productSubcategory.appendChild(
                option
            );

        }
    );

}


// ============================================================
// TAMPILKAN FIELD WEBSITE
// ============================================================

function tampilkanFieldWebsite() {

    if (!websiteLinkGroup) {
        return;
    }

    const kategori =
        productCategory
            ? productCategory.value
            : "";

    const subkategori =
        productSubcategory
            ? productSubcategory.value
            : "";

    const tampil =
        kategori === "Undangan" &&
        subkategori ===
        "Undangan Website Online";

    if (tampil) {

        websiteLinkGroup.style.display =
            "block";

    } else {

        websiteLinkGroup.style.display =
            "none";

        if (productWebsite) {

            productWebsite.value =
                "";

        }

    }

}


// ============================================================
// EVENT KATEGORI
// ============================================================

if (productCategory) {

    productCategory.addEventListener(
        "change",
        function() {

            tampilkanSubkategoriAdmin();

            tampilkanFieldWebsite();

        }
    );

}


// ============================================================
// EVENT SUBKATEGORI
// ============================================================

if (productSubcategory) {

    productSubcategory.addEventListener(
        "change",
        function() {

            tampilkanFieldWebsite();

        }
    );

}


// ============================================================
// FORMAT HARGA
// ============================================================

if (productPrice) {

    productPrice.addEventListener(
        "input",
        function() {

            const angka =
                this.value.replace(
                    /[^\d]/g,
                    ""
                );

            if (!angka) {

                this.value =
                    "";

                return;

            }

            this.value =
                Number(
                    angka
                ).toLocaleString(
                    "id-ID"
                );

        }
    );

}

// ============================================================
// FORMAT HARGA PROMO
// ============================================================

if (productPricePromo) {

    productPricePromo.addEventListener(
        "input",
        function() {

            const angka =
                this.value.replace(
                    /[^\d]/g,
                    ""
                );

            if (!angka) {

                this.value =
                    "";

                return;

            }

            this.value =
                Number(
                    angka
                ).toLocaleString(
                    "id-ID"
                );

        }
    );

}

// ============================================================
// UKURAN DATA
// ============================================================

function ukuranDataMB(data) {

    return (
        new Blob(
            [data]
        ).size /
        1024 /
        1024
    );

}


// ============================================================
// CEK STORAGE
// ============================================================

function storageMasihAman(data) {

    const ukuran =
        ukuranDataMB(data);

    console.log(
        "Ukuran ronaProducts:",
        ukuran.toFixed(2),
        "MB"
    );

    if (
        ukuran >
        MAX_STORAGE_MB
    ) {

        alert(
            "⚠️ Data katalog terlalu besar.\n\n" +
            "Ukuran saat ini: " +
            ukuran.toFixed(2) +
            " MB\n\n" +
            "Maksimal aman: " +
            MAX_STORAGE_MB +
            " MB\n\n" +
            "Silakan optimalkan foto atau kurangi ukuran media."
        );

        return false;

    }

    return true;

}


// ============================================================
// KOMPRES FOTO
// ============================================================

function kompresFoto(file) {

    return new Promise(
        function(resolve, reject) {

            if (!file) {

                reject(
                    new Error(
                        "File gambar tidak ditemukan."
                    )
                );

                return;

            }

            const reader =
                new FileReader();

            reader.onload =
                function(event) {

                    const img =
                        new Image();

                    img.onload =
                        function() {

                            const maxWidth =
                                1000;

                            const maxHeight =
                                1000;

                            let width =
                                img.width;

                            let height =
                                img.height;

                            if (
                                width >
                                    maxWidth ||
                                height >
                                    maxHeight
                            ) {

                                const rasio =
                                    Math.min(
                                        maxWidth /
                                            width,

                                        maxHeight /
                                            height
                                    );

                                width =
                                    Math.round(
                                        width *
                                            rasio
                                    );

                                height =
                                    Math.round(
                                        height *
                                            rasio
                                    );

                            }

                            const canvas =
                                document.createElement(
                                    "canvas"
                                );

                            canvas.width =
                                width;

                            canvas.height =
                                height;

                            const ctx =
                                canvas.getContext(
                                    "2d"
                                );

                            if (!ctx) {

                                reject(
                                    new Error(
                                        "Canvas tidak tersedia."
                                    )
                                );

                                return;

                            }

                            ctx.drawImage(
                                img,
                                0,
                                0,
                                width,
                                height
                            );

                            let hasil;

                            try {

                                hasil =
                                    canvas.toDataURL(
                                        "image/jpeg",
                                        0.75
                                    );

                            } catch (error) {

                                reject(
                                    error
                                );

                                return;

                            }

                            resolve(
                                hasil
                            );

                        };

                    img.onerror =
                        function() {

                            reject(
                                new Error(
                                    "Gagal membaca gambar."
                                )
                            );

                        };

                    img.src =
                        event.target.result;

                };

            reader.onerror =
                function() {

                    reject(
                        new Error(
                            "Gagal membaca file."
                        )
                    );

                };

            reader.readAsDataURL(
                file
            );

        }
    );

}


// ============================================================
// BACA FILE DATA URL
// ============================================================

function bacaFileDataURL(file) {

    return new Promise(
        function(resolve, reject) {

            if (!file) {

                resolve("");

                return;

            }

            const reader =
                new FileReader();

            reader.onload =
                function(event) {

                    resolve(
                        event.target.result
                    );

                };

            reader.onerror =
                function() {

                    reject(
                        new Error(
                            "Gagal membaca file."
                        )
                    );

                };

            reader.readAsDataURL(
                file
            );

        }
    );

}


// ============================================================
// PREVIEW FOTO
// ============================================================

function previewFoto(
    file,
    previewElement
) {

    if (!previewElement) {
        return;
    }

    previewElement.innerHTML =
        "";

    if (!file) {
        return;
    }

    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "Silakan pilih file gambar."
        );

        return;

    }

    const reader =
        new FileReader();

    reader.onload =
        function(event) {

            previewElement.innerHTML = `
                <img
                    src="${event.target.result}"
                    alt="Preview Produk"
                >
            `;

        };

    reader.readAsDataURL(
        file
    );

}


// ============================================================
// EVENT FOTO 1
// ============================================================

if (productImage) {

    productImage.addEventListener(
        "change",
        async function() {

            const file =
                productImage.files[0];

            previewFoto(
                file,
                imagePreview
            );

            if (!file) {
                return;
            }

            if (imageSizeInfo) {

                imageSizeInfo.innerHTML =
                    "⏳ Mengoptimalkan foto...";

            }

            try {

                const hasilKompres =
                    await kompresFoto(
                        file
                    );

                const ukuranAsli =
                    (
                        file.size /
                        1024 /
                        1024
                    ).toFixed(2);

                const ukuranKompres =
                    (
                        new Blob(
                            [hasilKompres]
                        ).size /
                        1024 /
                        1024
                    ).toFixed(2);

                if (imageSizeInfo) {

                    imageSizeInfo.innerHTML =
                        `
                        Foto 1 —
                        Ukuran asli:
                        <strong>
                            ${ukuranAsli} MB
                        </strong>
                        &nbsp;→&nbsp;
                        Setelah kompres:
                        <strong>
                            ±${ukuranKompres} MB
                        </strong>
                        `;

                }

            } catch (error) {

                console.error(
                    "Preview kompres gagal:",
                    error
                );

                if (imageSizeInfo) {

                    imageSizeInfo.textContent =
                        "Foto siap digunakan.";

                }

            }

        }
    );

}


// ============================================================
// EVENT FOTO 2
// ============================================================

if (productImage2) {

    productImage2.addEventListener(
        "change",
        function() {

            previewFoto(
                productImage2.files[0],
                imagePreview2
            );

        }
    );

}


// ============================================================
// EVENT FOTO 3
// ============================================================

if (productImage3) {

    productImage3.addEventListener(
        "change",
        function() {

            previewFoto(
                productImage3.files[0],
                imagePreview3
            );

        }
    );

}



// ============================================================
// EVENT FOTO 4
// ============================================================

if (productImage4) {

    productImage4.addEventListener(
        "change",
        function() {

            previewFoto(
                productImage4.files[0],
                imagePreview4
            );

        }
    );

}


// ============================================================
// EVENT FOTO 5
// ============================================================

if (productImage5) {

    productImage4.addEventListener(
        "change",
        function() {

            previewFoto(
                productImage5.files[0],
                imagePreview5
            );

        }
    );

}


// ============================================================
// EVENT FOTO 6
// ============================================================

if (productImage6) {

    productImage4.addEventListener(
        "change",
        function() {

            previewFoto(
                productImage6.files[0],
                imagePreview6
            );

        }
    );

}

// ============================================================
// EVENT VIDEO
// ============================================================

if (productVideo) {

    productVideo.addEventListener(
        "change",
        function() {

            if (videoPreview) {

                videoPreview.innerHTML =
                    "";

            }

            const file =
                productVideo.files[0];

            if (!file) {
                return;
            }

            if (
                !file.type.startsWith(
                    "video/"
                )
            ) {

                alert(
                    "Silakan pilih file video."
                );

                productVideo.value =
                    "";

                return;

            }

            const ukuran =
                file.size /
                1024 /
                1024;

            if (
                file.size >
                MAX_VIDEO_SIZE
            ) {

                alert(
                    "⚠️ Ukuran video terlalu besar.\n\n" +
                    "Maksimal video: 2 MB\n" +
                    "Ukuran video Anda: " +
                    ukuran.toFixed(2) +
                    " MB"
                );

                productVideo.value =
                    "";

                return;

            }

            const url =
                URL.createObjectURL(
                    file
                );

            if (videoPreview) {

                videoPreview.innerHTML = `
                    <video
                        src="${url}"
                        controls
                        playsinline
                        style="
                            width:100%;
                            max-width:500px;
                            border-radius:12px;
                            display:block;
                            margin:10px auto;
                        "
                    ></video>

                    <div
                        style="
                            text-align:center;
                            font-size:13px;
                            color:#777;
                        "
                    >
                        🎥 Video siap digunakan
                        (${ukuran.toFixed(2)} MB)
                    </div>
                `;

            }

        }
    );

}


// ============================================================
// SIMPAN KE GITHUB
// ============================================================

async function simpanKeGitHub() {

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "X-Admin-Key":
                            ADMIN_KEY
                    },

                    body:
                        JSON.stringify({
                            products:
                                adminProducts
                        })
                }
            );

        let data = {};

        try {

            data =
                await response.json();

        } catch (error) {

            data = {};

        }

        console.log(
            "Response Worker:",
            data
        );

        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message ||
                "Gagal menyimpan ke GitHub."
            );

        }

        return true;

    } catch (error) {

        console.error(
            "Gagal simpan ke GitHub:",
            error
        );

        alert(
            "❌ Gagal menyimpan ke GitHub.\n\n" +
            error.message
        );

        return false;

    }

}


// ============================================================
// LOAD PRODUK ADMIN - VERSI AMAN
// ============================================================

async function muatProdukAwalAdmin() {

    console.log(
        "🔄 Memuat data produk Admin..."
    );

    // ========================================================
    // 1. CEK DATA LOCAL TERLEBIH DAHULU
    // ========================================================

    let produkLocal = [];

    try {

        const dataLocal =
            JSON.parse(
                localStorage.getItem(
                    "ronaProducts"
                )
            );

        if (
            Array.isArray(
                dataLocal
            )
        ) {

            produkLocal =
                dataLocal;

        }

    } catch (error) {

        console.warn(
            "Data localStorage tidak valid:",
            error
        );

    }


    // ========================================================
    // 2. JIKA ADA DATA LOCAL
    //    GUNAKAN DATA LOCAL DAHULU
    // ========================================================

    if (
        produkLocal.length > 0
    ) {

        adminProducts =
            produkLocal;

        console.log(
            "✅ Produk dimuat dari localStorage:",
            adminProducts.length
        );

        tampilkanProdukAdmin();

        updateStatistikAdmin();

    }


    // ========================================================
    // 3. JIKA LOCAL KOSONG
    //    BARU AMBIL DARI GITHUB
    // ========================================================

    if (
        produkLocal.length === 0
    ) {

        try {

            const response =
                await fetch(
                    "products.json?cache=" +
                    Date.now()
                );

            if (!response.ok) {

                throw new Error(
                    "products.json tidak ditemukan."
                );

            }

            const data =
                await response.json();

            const produkDariGithub =
                Array.isArray(data)
                    ? data
                    : data.products;


            if (
                !Array.isArray(
                    produkDariGithub
                )
            ) {

                throw new Error(
                    "Format products.json tidak valid."
                );

            }


            // =================================================
            // NORMALISASI HARGA PROMO
            // =================================================

            adminProducts =
                produkDariGithub.map(
                    function(product) {

                        const produk =
                            {
                                ...product
                            };

                        // Jika data lama menggunakan promoPrice
                        // pindahkan ke pricePromo

                        if (
                            (
                                produk.pricePromo ===
                                undefined ||
                                produk.pricePromo ===
                                null
                            ) &&
                            produk.promoPrice !==
                                undefined
                        ) {

                            produk.pricePromo =
                                Number(
                                    produk.promoPrice ||
                                    0
                                );

                        }

                        // Pastikan field selalu ada

                        if (
                            produk.pricePromo ===
                            undefined
                        ) {

                            produk.pricePromo =
                                0;

                        }

                        return produk;

                    }
                );


            // =================================================
            // SIMPAN LOCAL
            // =================================================

            const dataLocalBaru =
                JSON.stringify(
                    adminProducts
                );

            if (
                storageMasihAman(
                    dataLocalBaru
                )
            ) {

                localStorage.setItem(
                    "ronaProducts",
                    dataLocalBaru
                );

            }


            console.log(
                "☁️ Produk berhasil dimuat dari GitHub:",
                adminProducts.length
            );


            tampilkanProdukAdmin();

            updateStatistikAdmin();


        } catch (error) {

            console.warn(
                "❌ Tidak bisa mengambil products.json:",
                error
            );


            // =================================================
            // FALLBACK LOCAL STORAGE
            // =================================================

            try {

                const dataLocal =
                    JSON.parse(
                        localStorage.getItem(
                            "ronaProducts"
                        )
                    );

                if (
                    Array.isArray(
                        dataLocal
                    )
                ) {

                    adminProducts =
                        dataLocal;

                } else {

                    adminProducts =
                        [];

                }

            } catch (errorLocal) {

                adminProducts =
                    [];

            }


            tampilkanProdukAdmin();

            updateStatistikAdmin();

        }

    }

}


// ============================================================
// BACKUP PRODUK
// ============================================================

if (backupProductButton) {

    backupProductButton.addEventListener(
        "click",
        function() {

            const dataBackup = {

                aplikasi:
                    "RONA CREATION",

                tanggal:
                    new Date().toISOString(),

                products:
                    adminProducts

            };

            const json =
                JSON.stringify(
                    dataBackup,
                    null,
                    2
                );

            const blob =
                new Blob(
                    [json],
                    {
                        type:
                            "application/json"
                    }
                );

            const url =
                URL.createObjectURL(
                    blob
                );

            const link =
                document.createElement(
                    "a"
                );

            link.href =
                url;

            link.download =
                "backup-rona-creation-" +
                new Date()
                    .toISOString()
                    .slice(0, 10) +
                ".json";

            document.body.appendChild(
                link
            );

            link.click();

            link.remove();

            URL.revokeObjectURL(
                url
            );

            alert(
                "✅ Backup produk berhasil dibuat."
            );

        }
    );

}


// ============================================================
// EXPORT PRODUCTS.JSON
// ============================================================

if (exportProductsButton) {

    exportProductsButton.addEventListener(
        "click",
        function() {

const produk =
    Array.isArray(
        adminProducts
    )
        ? adminProducts.map(
            function(product) {

                const produk =
                    {
                        ...product
                    };

                // Satukan format harga promo

                if (
                    (
                        produk.pricePromo ===
                        undefined ||
                        produk.pricePromo ===
                        null
                    ) &&
                    produk.promoPrice !==
                        undefined
                ) {

                    produk.pricePromo =
                        Number(
                            produk.promoPrice ||
                            0
                        );

                }

                if (
                    produk.pricePromo ===
                    undefined
                ) {

                    produk.pricePromo =
                        0;

                }

                // Hapus format lama

                delete produk.promoPrice;

                return produk;

            }
        )
        : [];

            if (!produk.length) {

                alert(
                    "Belum ada produk di Admin."
                );

                return;

            }

            const dataExport = {

                products:
                    produk

            };

            const json =
                JSON.stringify(
                    dataExport,
                    null,
                    2
                );

            const blob =
                new Blob(
                    [json],
                    {
                        type:
                            "application/json"
                    }
                );

            const url =
                URL.createObjectURL(
                    blob
                );

            const link =
                document.createElement(
                    "a"
                );

            link.href =
                url;

            link.download =
                "products.json";

            document.body.appendChild(
                link
            );

            link.click();

            link.remove();

            URL.revokeObjectURL(
                url
            );

            alert(
                "✅ products.json berhasil dibuat.\n\n" +
                produk.length +
                " produk siap digunakan."
            );

        }
    );

}


// ============================================================
// RESTORE BUTTON
// ============================================================

if (restoreProductButton) {

    restoreProductButton.addEventListener(
        "click",
        function() {

            if (restoreProductInput) {

                restoreProductInput.click();

            }

        }
    );

}


// ============================================================
// RESTORE FILE
// ============================================================

if (restoreProductInput) {

    restoreProductInput.addEventListener(
        "change",
        function() {

            const file =
                restoreProductInput.files[0];

            if (!file) {
                return;
            }

            const reader =
                new FileReader();

            reader.onload =
                async function(event) {

                    try {

                        const data =
                            JSON.parse(
                                event.target.result
                            );

                        let produkRestore;

                        if (
                            Array.isArray(
                                data
                            )
                        ) {

                            produkRestore =
                                data;

                        } else if (
                            Array.isArray(
                                data.products
                            )
                        ) {

                            produkRestore =
                                data.products;

                        } else {

                            alert(
                                "File backup tidak valid."
                            );

                            return;

                        }

                        const yakin =
                            confirm(
                                "Restore backup akan mengganti produk Admin saat ini.\n\n" +
                                "Lanjutkan?"
                            );

                        if (!yakin) {
                            return;
                        }

                        const dataProduk =
                            JSON.stringify(
                                produkRestore
                            );

                        if (
                            !storageMasihAman(
                                dataProduk
                            )
                        ) {

                            return;

                        }

                        adminProducts =
                            produkRestore;

                        localStorage.setItem(
                            "ronaProducts",
                            dataProduk
                        );

                        tampilkanProdukAdmin();

                        updateStatistikAdmin();

                        if (saveProductButton) {

                            saveProductButton.disabled =
                                true;

                            saveProductButton.textContent =
                                "☁️ Menyimpan ke GitHub...";

                        }

                        const berhasil =
                            await simpanKeGitHub();

                        if (saveProductButton) {

                            saveProductButton.disabled =
                                false;

                            saveProductButton.textContent =
                                "💾 Simpan Produk";

                        }

                        if (berhasil) {

                            alert(
                                "✅ Backup berhasil dipulihkan dan disimpan ke GitHub."
                            );

                        }

                    } catch (error) {

                        console.error(
                            "Restore error:",
                            error
                        );

                        alert(
                            "❌ File backup tidak dapat dibaca."
                        );

                    }

                    restoreProductInput.value =
                        "";

                };

            reader.readAsText(
                file
            );

        }
    );

}


// ============================================================
// NORMALISASI NAMA PRODUK
// ============================================================

function normalisasiNamaProduk(
    namaProduk
) {

    return String(
        namaProduk || ""
    )
        .toLowerCase()
        .trim()
        .replace(
            /\s+/g,
            " "
        );

}


// ============================================================
// CEK DUPLIKAT
// ============================================================

function cekProdukDuplikat(
    nama,
    kategori,
    idYangDikecualikan = null
) {

    const namaNormal =
        normalisasiNamaProduk(
            nama
        );

    return adminProducts.some(
        function(product) {

            if (
                idYangDikecualikan !== null &&
                String(product.id) ===
                String(idYangDikecualikan)
            ) {

                return false;

            }

            return (
                normalisasiNamaProduk(
                    product.name
                ) === namaNormal &&
                String(
                    product.category || ""
                ).toLowerCase() ===
                String(
                    kategori || ""
                ).toLowerCase()
            );

        }
    );

}


// ============================================================
// SIMPAN / UPDATE PRODUK
// ============================================================

if (saveProductButton) {

    saveProductButton.addEventListener(
        "click",
        async function() {

            const file1 =
                productImage
                    ? productImage.files[0]
                    : null;

            const file2 =
                productImage2
                    ? productImage2.files[0]
                    : null;

            const file3 =
                productImage3
                    ? productImage3.files[0]
                    : null;
            
            const file4 =
                productImage4
                    ? productImage4.files[0]
                    : null;

            const file5 =
                productImage5
                    ? productImage5.files[0]
                    : null;

            const file6 =
                productImage6
                    ? productImage6.files[0]
                    : null;
            
            const videoFile =
                productVideo
                    ? productVideo.files[0]
                    : null;

            const nama =
                productName
                    ? productName.value.trim()
                    : "";

            const kategori =
                productCategory
                    ? productCategory.value
                    : "";

            const subkategori =
                productSubcategory
                    ? productSubcategory.value
                    : "";

            const website =
                productWebsite
                    ? productWebsite.value.trim()
                    : "";

            const harga =
                productPrice
                    ? Number(
                        productPrice.value.replace(
                            /[^\d]/g,
                            ""
                        )
                    )
                    : 0;

            const hargaPromo =
                productPricePromo
                    ? Number(
                        productPricePromo.value.replace(
                            /[^\d]/g,
                            ""
                        )
                    )
                    : 0;

            const deskripsi =
                productDescription
                    ? productDescription.value.trim()
                    : "";


            // ====================================================
            // VALIDASI NAMA
            // ====================================================

            if (!nama) {

                alert(
                    "Nama produk belum diisi."
                );

                if (productName) {
                    productName.focus();
                }

                return;

            }


            // ====================================================
            // VALIDASI KATEGORI
            // ====================================================

            if (!kategori) {

                alert(
                    "Silakan pilih kategori."
                );

                if (productCategory) {
                    productCategory.focus();
                }

                return;

            }


            // ====================================================
            // VALIDASI SUBKATEGORI
            // ====================================================

            if (!subkategori) {

                alert(
                    "Silakan pilih subkategori."
                );

                if (productSubcategory) {
                    productSubcategory.focus();
                }

                return;

            }


            // ====================================================
            // VALIDASI HARGA
            // ====================================================

            if (!harga || harga <= 0) {

                alert(
                    "Harga belum diisi."
                );

                if (productPrice) {
                    productPrice.focus();
                }

                return;

            }

            // ====================================================
            // VALIDASI HARGA PROMO
            // ====================================================

            if (
                hargaPromo &&
                hargaPromo >= harga
            ) {

                alert(
                    "⚠️ Harga promo harus lebih murah daripada harga normal."
                );

                if (productPricePromo) {
                    productPricePromo.focus();
                }

                return;

            }

            // ====================================================
            // VALIDASI DESKRIPSI
            // ====================================================

            if (!deskripsi) {

                alert(
                    "Deskripsi produk belum diisi."
                );

                if (productDescription) {
                    productDescription.focus();
                }

                return;

            }


            // ====================================================
            // VALIDASI WEBSITE
            // ====================================================

            if (
                kategori ===
                    "Undangan" &&
                subkategori ===
                    "Undangan Website Online"
            ) {

                if (!website) {

                    alert(
                        "Silakan masukkan link website undangan."
                    );

                    if (productWebsite) {
                        productWebsite.focus();
                    }

                    return;

                }

                if (
                    !website.startsWith(
                        "http://"
                    ) &&
                    !website.startsWith(
                        "https://"
                    )
                ) {

                    alert(
                        "Link website harus diawali http:// atau https://"
                    );

                    if (productWebsite) {
                        productWebsite.focus();
                    }

                    return;

                }

            }


            // ====================================================
            // VALIDASI FOTO
            // ====================================================

            const daftarFileFoto = [
                file1,
                file2,
                file3
            ];

            for (
                let i = 0;
                i <
                daftarFileFoto.length;
                i++
            ) {

                const file =
                    daftarFileFoto[i];

                if (!file) {
                    continue;
                }

                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    alert(
                        "Foto " +
                        (i + 1) +
                        " bukan file gambar."
                    );

                    return;

                }

            }


            // ====================================================
            // VALIDASI VIDEO
            // ====================================================

            if (videoFile) {

                if (
                    !videoFile.type.startsWith(
                        "video/"
                    )
                ) {

                    alert(
                        "File video tidak valid."
                    );

                    return;

                }

                if (
                    videoFile.size >
                    MAX_VIDEO_SIZE
                ) {

                    alert(
                        "⚠️ Video terlalu besar.\n\n" +
                        "Maksimal video adalah 2 MB."
                    );

                    return;

                }

            }


            // ====================================================
            // CEK DUPLIKAT
            // ====================================================

            if (
                cekProdukDuplikat(
                    nama,
                    kategori,
                    window.editingProductId
                )
            ) {

                alert(
                    "Produk dengan nama dan kategori tersebut sudah ada."
                );

                if (productName) {
                    productName.focus();
                }

                return;

            }


            // ====================================================
            // MULAI PROSES
            // ====================================================

            try {

                saveProductButton.disabled =
                    true;

                saveProductButton.textContent =
                    "⏳ Memproses media...";


                // ====================================================
                // MODE EDIT
                // ====================================================

                if (
                    window.editingProductId !==
                    null
                ) {

                    const index =
                        adminProducts.findIndex(
                            function(product) {

                                return (
                                    String(
                                        product.id
                                    ) ===
                                    String(
                                        window.editingProductId
                                    )
                                );

                            }
                        );

                    if (index === -1) {

                        alert(
                            "Produk yang diedit tidak ditemukan."
                        );

                        return;

                    }

                    const produkLama =
                        adminProducts[index];

                    let gambar1 =
                        produkLama.image ||
                        "";

                    let gambar2 =
                        produkLama.image2 ||
                        "";

                    let gambar3 =
                        produkLama.image3 ||
                        "";

                     let gambar4 =
                        produkLama.image4 ||
                        "";

                    let gambar5 =
                        produkLama.image5 ||
                        "";

                    let gambar6 =
                        produkLama.image6 ||
                        "";
                    let video =
                        produkLama.video ||
                        "";


                    // FOTO 1

                    if (file1) {

                        saveProductButton.textContent =
                            "⏳ Mengompres Foto 1...";

                        gambar1 =
                            await kompresFoto(
                                file1
                            );

                    }


                    // FOTO 2

                    if (file2) {

                        saveProductButton.textContent =
                            "⏳ Mengompres Foto 2...";

                        gambar2 =
                            await kompresFoto(
                                file2
                            );

                    }


                    // FOTO 3

                    if (file3) {

                        saveProductButton.textContent =
                            "⏳ Mengompres Foto 3...";

                        gambar3 =
                            await kompresFoto(
                                file3
                            );

                    }


                    // FOTO 4

                    if (file4) {

                        saveProductButton.textContent =
                            "⏳ Mengompres Foto 4...";

                        gambar4 =
                            await kompresFoto(
                                file4
                            );

                    }

                    // FOTO 5

                    if (file5) {

                        saveProductButton.textContent =
                            "⏳ Mengompres Foto 5...";

                        gambar5 =
                            await kompresFoto(
                                file5
                            );

                    }

                     // FOTO 6

                    if (file6) {

                        saveProductButton.textContent =
                            "⏳ Mengompres Foto 6...";

                        gambar6 =
                            await kompresFoto(
                                file6
                            );

                    }
                    
                    // VIDEO

                    if (videoFile) {

                        saveProductButton.textContent =
                            "⏳ Memproses Video...";

                        video =
                            await bacaFileDataURL(
                                videoFile
                            );

                    }


                    const produkUpdate = {

                        ...produkLama,

                        name:
                            nama,

                        category:
                            kategori,

                        subcategory:
                            subkategori,

                        price:
                            harga,

                         pricePromo:
                            hargaPromo,

                        image:
                            gambar1,

                        image2:
                            gambar2,

                        image3:
                            gambar3,

                        image4:
                            gambar4,

                        image5:
                            gambar5,

                        image6:
                            gambar6,
                        
                        video:
                            video,

                        description:
                            deskripsi,

                        website:
                            website

                    };


                    const dataPercobaan =
                        adminProducts.slice();

                    dataPercobaan[index] =
                        produkUpdate;

                    const dataProduk =
                        JSON.stringify(
                            dataPercobaan
                        );


                    if (
                        !storageMasihAman(
                            dataProduk
                        )
                    ) {

                        return;

                    }


                    adminProducts =
                        dataPercobaan;

                    localStorage.setItem(
                        "ronaProducts",
                        dataProduk
                    );

                    tampilkanProdukAdmin();

                    updateStatistikAdmin();


                    // GITHUB

                    saveProductButton.textContent =
                        "☁️ Menyimpan ke GitHub...";

                    const berhasil =
                        await simpanKeGitHub();

                    if (berhasil) {

                        resetFormProduk();

                        alert(
                            "✅ Produk berhasil diperbarui dan disimpan ke GitHub."
                        );

                    } else {

                        alert(
                            "⚠️ Produk diperbarui di perangkat,\n" +
                            "tetapi gagal dikirim ke GitHub."
                        );

                    }

                    return;

                }


                // ====================================================
                // MODE TAMBAH
                // ====================================================

                if (!file1) {

                    alert(
                        "Silakan pilih Foto 1 sebagai foto utama."
                    );

                    return;

                }


                // FOTO 1

                saveProductButton.textContent =
                    "⏳ Mengompres Foto 1...";

                const gambar1 =
                    await kompresFoto(
                        file1
                    );


                // FOTO 2

                let gambar2 =
                    "";

                if (file2) {

                    saveProductButton.textContent =
                        "⏳ Mengompres Foto 2...";

                    gambar2 =
                        await kompresFoto(
                            file2
                        );

                }


                // FOTO 3

                let gambar3 =
                    "";

                if (file3) {

                    saveProductButton.textContent =
                        "⏳ Mengompres Foto 3...";

                    gambar3 =
                        await kompresFoto(
                            file3
                        );

                }


                // VIDEO

                let video =
                    "";

                if (videoFile) {

                    saveProductButton.textContent =
                        "⏳ Memproses Video...";

                    video =
                        await bacaFileDataURL(
                            videoFile
                        );

                }


                // PRODUK BARU

                const produkBaru = {

                    id:
                        Date.now(),

                    name:
                        nama,

                    category:
                        kategori,

                    subcategory:
                        subkategori,

                    price:
                        harga,

                    pricePromo:
                        hargaPromo,

                    image:
                        gambar1,

                    image2:
                        gambar2,

                    image3:
                        gambar3,

                    image4:
                        gambar4,

                    image5:
                        gambar5,

                    image6:
                        gambar6,

                    video:
                        video,

                    description:
                        deskripsi,

                    website:
                        website

                };


                adminProducts.push(
                    produkBaru
                );


                const dataProduk =
                    JSON.stringify(
                        adminProducts
                    );


                if (
                    !storageMasihAman(
                        dataProduk
                    )
                ) {

                    adminProducts.pop();

                    return;

                }


                try {

                    localStorage.setItem(
                        "ronaProducts",
                        dataProduk
                    );

                } catch (error) {

                    adminProducts.pop();

                    throw new Error(
                        "Penyimpanan perangkat penuh."
                    );

                }


                tampilkanProdukAdmin();

                updateStatistikAdmin();


                // GITHUB

                saveProductButton.textContent =
                    "☁️ Menyimpan ke GitHub...";

                const berhasilGitHub =
                    await simpanKeGitHub();


                if (berhasilGitHub) {

                    resetFormProduk();

                    alert(
                        "✅ Produk berhasil ditambahkan!\n\n" +
                        "Foto 1: Ya\n" +
                        "Foto 2: " +
                        (
                            gambar2
                                ? "Ya"
                                : "Tidak"
                        ) +
                        "\n" +
                        "Foto 3: " +
                        (
                            gambar3
                                ? "Ya"
                                : "Tidak"
                        ) +
                        "\n" +
                        "Video: " +
                        (
                            video
                                ? "Ya"
                                : "Tidak"
                        ) +
                        "\n\n" +
                        "Data sudah tersimpan ke GitHub."
                    );

                } else {

                    alert(
                        "⚠️ Produk tersimpan di perangkat,\n" +
                        "tetapi gagal dikirim ke GitHub."
                    );

                }

            } catch (error) {

                console.error(
                    "Gagal menyimpan produk:",
                    error
                );

                alert(
                    "❌ Gagal menyimpan produk.\n\n" +
                    error.message
                );

            } finally {

                saveProductButton.disabled =
                    false;

                if (
                    window.editingProductId ===
                    null
                ) {

                    saveProductButton.textContent =
                        "💾 Simpan Produk";

                }

            }

        }
    );

}


// ============================================================
// RESET FORM
// ============================================================

function resetFormProduk() {

    if (productImage) {
        productImage.value = "";
    }

    if (productImage2) {
        productImage2.value = "";
    }

    if (productImage3) {
        productImage3.value = "";
    }

    if (productImage4) {
        productImage4.value = "";
    }

    if (productImage5) {
        productImage5.value = "";
    }

    if (productImage6) {
        productImage6.value = "";
    }
    
    if (productVideo) {
        productVideo.value = "";
    }

    if (productName) {
        productName.value = "";
    }

    if (productCategory) {
        productCategory.value = "";
    }

    if (productSubcategory) {

        productSubcategory.innerHTML = `
            <option value="">
                Pilih subkategori
            </option>
        `;

    }

    if (productPrice) {
        productPrice.value = "";
    }

    if (productPricePromo) {
    productPricePromo.value = "";
    }

    if (productDescription) {
        productDescription.value = "";
    }

    if (productWebsite) {
        productWebsite.value = "";
    }

    if (websiteLinkGroup) {

        websiteLinkGroup.style.display =
            "none";

    }

    if (imagePreview) {
        imagePreview.innerHTML = "";
    }

    if (imagePreview2) {
        imagePreview2.innerHTML = "";
    }

    if (imagePreview3) {
        imagePreview3.innerHTML = "";
    }

    if (imagePreview4) {
        imagePreview4.innerHTML = "";
    }

    if (imagePreview5) {
        imagePreview5.innerHTML = "";
    }

    if (imagePreview6) {
        imagePreview6.innerHTML = "";
    }
    if (videoPreview) {
        videoPreview.innerHTML = "";
    }

    if (imageSizeInfo) {
        imageSizeInfo.textContent = "";
    }

    if (saveProductButton) {

        saveProductButton.textContent =
            "💾 Simpan Produk";

    }

    if (cancelEditButton) {

        cancelEditButton.style.display =
            "none";

    }

    window.editingProductId =
        null;

}


// ============================================================
// TAMPILKAN MEDIA EDIT
// ============================================================

function tampilkanMediaEdit(
    product
) {

    // FOTO 1

    if (imagePreview) {

        if (product.image) {

            imagePreview.innerHTML = `
                <img
                    src="${product.image}"
                    alt="Foto Produk 1"
                >
            `;

        } else {

            imagePreview.innerHTML =
                "";

        }

    }


    // FOTO 2

    if (imagePreview2) {

        if (product.image2) {

            imagePreview2.innerHTML = `
                <img
                    src="${product.image2}"
                    alt="Foto Produk 2"
                >
            `;

        } else {

            imagePreview2.innerHTML =
                "";

        }

    }


    // FOTO 3

    if (imagePreview3) {

        if (product.image3) {

            imagePreview3.innerHTML = `
                <img
                    src="${product.image3}"
                    alt="Foto Produk 3"
                >
            `;

        } else {

            imagePreview3.innerHTML =
                "";

        }

    }

        // FOTO 4

    if (imagePreview4) {

        if (product.image4) {

            imagePreview4.innerHTML = `
                <img
                    src="${product.image4}"
                    alt="Foto Produk 4"
                >
            `;

        } else {

            imagePreview4.innerHTML =
                "";

        }

    }

        // FOTO 5

    if (imagePreview5) {

        if (product.image5) {

            imagePreview5.innerHTML = `
                <img
                    src="${product.image5}"
                    alt="Foto Produk 5"
                >
            `;

        } else {

            imagePreview5.innerHTML =
                "";

        }

    }

        // FOTO 6

    if (imagePreview6) {

        if (product.image6) {

            imagePreview6.innerHTML = `
                <img
                    src="${product.image6}"
                    alt="Foto Produk 6"
                >
            `;

        } else {

            imagePreview6.innerHTML =
                "";

        }

    }

    // VIDEO

    if (videoPreview) {

        if (product.video) {

            videoPreview.innerHTML = `
                <video
                    src="${product.video}"
                    controls
                    playsinline
                    style="
                        width:100%;
                        max-width:500px;
                        border-radius:12px;
                        display:block;
                        margin:10px auto;
                    "
                ></video>
            `;

        } else {

            videoPreview.innerHTML =
                "";

        }

    }

}


// ============================================================
// TAMPILKAN PRODUK ADMIN
// ============================================================

function tampilkanProdukAdmin(
    data = adminProducts
) {

    if (productCount) {

        productCount.textContent =
            `${adminProducts.length} Produk`;

    }

    if (!adminProductList) {
        return;
    }

    if (!Array.isArray(data)) {
        data = [];
    }

    if (!data.length) {

        adminProductList.innerHTML = `
            <div class="empty-product">
                Belum ada produk tambahan.
            </div>
        `;

        return;

    }

    adminProductList.innerHTML =
        "";

    data.forEach(
        function(product) {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "admin-product-item";

            const gambar =
                product.image ||
                "";

            const namaProduk =
                product.name ||
                "Tanpa Nama";


            // =================================================
            // BUAT ELEMENT TANPA INNERHTML DATA USER
            // =================================================

            const img =
                document.createElement(
                    "img"
                );

            img.src =
                gambar;

            img.alt =
                namaProduk;

            img.onerror =
                function() {

                    this.style.display =
                        "none";

                };


            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "admin-product-info";


            const kategoriDiv =
                document.createElement(
                    "div"
                );

            kategoriDiv.className =
                "admin-product-category";

            kategoriDiv.textContent =
                product.category ||
                "";


            const judul =
                document.createElement(
                    "h3"
                );

            judul.textContent =
                namaProduk;


const harga =
    document.createElement(
        "p"
    );

const hargaNormal =
    Number(
        product.price || 0
    );

const hargaPromo =
    Number(
        product.pricePromo ??
        product.promoPrice ??
        0
    );

if (
    hargaPromo > 0 &&
    hargaPromo < hargaNormal
) {

    harga.innerHTML =
        `
        <span style="
            text-decoration: line-through;
            color: #999;
            font-size: 13px;
            margin-right: 6px;
        ">
            ${formatRupiah(hargaNormal)}
        </span>

        <strong style="
            color: #c62828;
            font-size: 16px;
        ">
            ${formatRupiah(hargaPromo)}
        </strong>
        `;

} else {

    harga.textContent =
        formatRupiah(
            hargaNormal
        );

}

            const jumlahFoto =
                [
                    product.image,
                    product.image2,
                    product.image3,
                    product.image4,
                    product.image5,
                    product.image6
                    
                ]
                    .filter(Boolean)
                    .length;

            const mediaInfo =
                document.createElement(
                    "small"
                );

            mediaInfo.textContent =
                "📸 " +
                jumlahFoto +
                " foto" +
                (
                    product.video
                        ? " • 🎥 Ada video"
                        : ""
                );


            info.appendChild(
                kategoriDiv
            );

            info.appendChild(
                judul
            );

            info.appendChild(
                harga
            );

            info.appendChild(
                mediaInfo
            );


            // ACTIONS

            const actions =
                document.createElement(
                    "div"
                );

            actions.className =
                "admin-product-actions";


            const tombolEdit =
                document.createElement(
                    "button"
                );

            tombolEdit.type =
                "button";

            tombolEdit.className =
                "edit-product-button";

            tombolEdit.textContent =
                "✏️ Edit";


            const tombolHapus =
                document.createElement(
                    "button"
                );

            tombolHapus.type =
                "button";

            tombolHapus.className =
                "delete-product-button";

            tombolHapus.textContent =
                "🗑️ Hapus";


            actions.appendChild(
                tombolEdit
            );

            actions.appendChild(
                tombolHapus
            );


            item.appendChild(
                img
            );

            item.appendChild(
                info
            );

            item.appendChild(
                actions
            );


            // =================================================
            // EDIT
            // =================================================

            tombolEdit.addEventListener(
                "click",
                function() {

                    if (productName) {

                        productName.value =
                            product.name ||
                            "";

                    }

                    if (productCategory) {

                        productCategory.value =
                            product.category ||
                            "";

                    }

                    tampilkanSubkategoriAdmin(
                        product.subcategory ||
                        ""
                    );

                    if (productWebsite) {

                        productWebsite.value =
                            product.website ||
                            "";

                    }

                    tampilkanFieldWebsite();

                    if (productPrice) {

                        productPrice.value =
                            Number(
                                product.price ||
                                0
                            ).toLocaleString(
                                "id-ID"
                            );

                    }

if (productPricePromo) {

    const hargaPromoEdit =
        Number(
            product.pricePromo ??
            product.promoPrice ??
            0
        );

    productPricePromo.value =
        hargaPromoEdit > 0
            ? hargaPromoEdit.toLocaleString(
                "id-ID"
            )
            : "";

}

                    if (productDescription) {

                        productDescription.value =
                            product.description ||
                            "";

                    }

                    tampilkanMediaEdit(
                        product
                    );

                    if (imageSizeInfo) {

                        imageSizeInfo.textContent =
                            "";

                    }

                    if (productImage) {
                        productImage.value =
                            "";
                    }

                    if (productImage2) {
                        productImage2.value =
                            "";
                    }

                    if (productImage3) {
                        productImage3.value =
                            "";
                    }

                    if (productImage4) {
                        productImage4.value =
                            "";
                    }

                    if (productImage5) {
                        productImage5.value =
                            "";
                    }

                    if (productImage6) {
                        productImage6.value =
                            "";
                    }

                    if (productVideo) {
                        productVideo.value =
                            "";
                    }

                    window.editingProductId =
                        product.id;

                    if (saveProductButton) {

                        saveProductButton.textContent =
                            "💾 Simpan Perubahan";

                    }

                    if (cancelEditButton) {

                        cancelEditButton.style.display =
                            "inline-block";

                    }

                    if (saveProductButton) {

                        saveProductButton.scrollIntoView(
                            {
                                behavior:
                                    "smooth",

                                block:
                                    "center"
                            }
                        );

                    }

                }
            );


            // =================================================
            // HAPUS
            // =================================================

            tombolHapus.addEventListener(
                "click",
                async function() {

                    const yakin =
                        confirm(
                            'Hapus produk "' +
                            namaProduk +
                            '"?'
                        );

                    if (!yakin) {
                        return;
                    }

                    const dataSebelum =
                        adminProducts.slice();

                    adminProducts =
                        adminProducts.filter(
                            function(item) {

                                return (
                                    String(
                                        item.id
                                    ) !==
                                    String(
                                        product.id
                                    )
                                );

                            }
                        );

                    const dataProduk =
                        JSON.stringify(
                            adminProducts
                        );

                    try {

                        localStorage.setItem(
                            "ronaProducts",
                            dataProduk
                        );

                    } catch (error) {

                        adminProducts =
                            dataSebelum;

                        alert(
                            "❌ Gagal menyimpan perubahan."
                        );

                        return;

                    }

                    tampilkanProdukAdmin();

                    updateStatistikAdmin();

                    tombolHapus.disabled =
                        true;

                    tombolHapus.textContent =
                        "⏳";

                    const berhasil =
                        await simpanKeGitHub();

                    tombolHapus.disabled =
                        false;

                    tombolHapus.textContent =
                        "🗑️ Hapus";

                    if (berhasil) {

                        alert(
                            "✅ Produk berhasil dihapus dari katalog dan GitHub."
                        );

                    } else {

                        alert(
                            "⚠️ Produk terhapus dari perangkat,\n" +
                            "tetapi gagal memperbarui GitHub."
                        );

                    }

                }
            );


            adminProductList.appendChild(
                item
            );

        }
    );

}


// ============================================================
// PENCARIAN PRODUK
// ============================================================

if (adminSearchInput) {

    adminSearchInput.addEventListener(
        "input",
        function() {

            const keyword =
                adminSearchInput.value
                    .toLowerCase()
                    .trim();

            const hasil =
                adminProducts.filter(
                    function(product) {

                        const nama =
                            String(
                                product.name ||
                                ""
                            ).toLowerCase();

                        const kategori =
                            String(
                                product.category ||
                                ""
                            ).toLowerCase();

                        const subkategori =
                            String(
                                product.subcategory ||
                                ""
                            ).toLowerCase();

                        const harga =
                            String(
                                product.price ||
                                ""
                            ).toLowerCase();

                        const deskripsi =
                            String(
                                product.description ||
                                ""
                            ).toLowerCase();

                        return (
                            nama.includes(
                                keyword
                            ) ||
                            kategori.includes(
                                keyword
                            ) ||
                            subkategori.includes(
                                keyword
                            ) ||
                            harga.includes(
                                keyword
                            ) ||
                            deskripsi.includes(
                                keyword
                            )
                        );

                    }
                );

            tampilkanProdukAdmin(
                hasil
            );

        }
    );

}


// ============================================================
// BATAL EDIT
// ============================================================

if (cancelEditButton) {

    cancelEditButton.addEventListener(
        "click",
        function() {

            resetFormProduk();

        }
    );

}


// ============================================================
// KOMPRES PRODUK LAMA
// ============================================================

async function kompresProdukLama() {

    if (!adminProducts.length) {

        alert(
            "Belum ada produk Admin."
        );

        return;

    }

    const yakin =
        confirm(
            "Kompres ulang foto semua produk?\n\n" +
            adminProducts.length +
            " produk akan diproses."
        );

    if (!yakin) {
        return;
    }

    try {

        const produkBaru = [];

        for (
            let i = 0;
            i <
            adminProducts.length;
            i++
        ) {

            const product =
                adminProducts[i];

            console.log(
                "Memproses " +
                (i + 1) +
                "/" +
                adminProducts.length +
                ": " +
                product.name
            );

            const produkUpdate = {
                ...product
            };


            // FOTO 1

            if (
                product.image &&
                product.image.startsWith(
                    "data:image"
                )
            ) {

                const response =
                    await fetch(
                        product.image
                    );

                const blob =
                    await response.blob();

                const file =
                    new File(
                        [blob],
                        `produk-${product.id}-1.jpg`,
                        {
                            type:
                                "image/jpeg"
                        }
                    );

                produkUpdate.image =
                    await kompresFoto(
                        file
                    );

            }


            // FOTO 2

            if (
                product.image2 &&
                product.image2.startsWith(
                    "data:image"
                )
            ) {

                const response =
                    await fetch(
                        product.image2
                    );

                const blob =
                    await response.blob();

                const file =
                    new File(
                        [blob],
                        `produk-${product.id}-2.jpg`,
                        {
                            type:
                                "image/jpeg"
                        }
                    );

                produkUpdate.image2 =
                    await kompresFoto(
                        file
                    );

            }


            // FOTO 3

            if (
                product.image3 &&
                product.image3.startsWith(
                    "data:image"
                )
            ) {

                const response =
                    await fetch(
                        product.image3
                    );

                const blob =
                    await response.blob();

                const file =
                    new File(
                        [blob],
                        `produk-${product.id}-3.jpg`,
                        {
                            type:
                                "image/jpeg"
                        }
                    );

                produkUpdate.image3 =
                    await kompresFoto(
                        file
                    );

            }

// FOTO 4

            if (
                product.image4 &&
                product.image4.startsWith(
                    "data:image"
                )
            ) {

                const response =
                    await fetch(
                        product.image4
                    );

                const blob =
                    await response.blob();

                const file =
                    new File(
                        [blob],
                        `produk-${product.id}-4.jpg`,
                        {
                            type:
                                "image/jpeg"
                        }
                    );

                produkUpdate.image4 =
                    await kompresFoto(
                        file
                    );

            }

            // FOTO 5

            if (
                product.image5 &&
                product.image5.startsWith(
                    "data:image"
                )
            ) {

                const response =
                    await fetch(
                        product.image5
                    );

                const blob =
                    await response.blob();

                const file =
                    new File(
                        [blob],
                        `produk-${product.id}-5.jpg`,
                        {
                            type:
                                "image/jpeg"
                        }
                    );

                produkUpdate.image5 =
                    await kompresFoto(
                        file
                    );

            }

            // FOTO 6

            if (
                product.image6 &&
                product.image6.startsWith(
                    "data:image"
                )
            ) {
 
                const response =
                    await fetch(
                        product.image6
                    );

                const blob =
                    await response.blob();

                const file =
                    new File(
                        [blob],
                        `produk-${product.id}-6.jpg`,
                        {
                            type:
                                "image/jpeg"
                        }
                    );

                produkUpdate.image6 =
                    await kompresFoto(
                        file
                    );

            }
            produkBaru.push(
                produkUpdate
            );

        }


        const dataBaru =
            JSON.stringify(
                produkBaru
            );

        if (
            !storageMasihAman(
                dataBaru
            )
        ) {

            return;

        }

        adminProducts =
            produkBaru;

        localStorage.setItem(
            "ronaProducts",
            dataBaru
        );

        tampilkanProdukAdmin();

        updateStatistikAdmin();


        if (compressProductsButton) {

            compressProductsButton.disabled =
                true;

            compressProductsButton.textContent =
                "☁️ Menyimpan ke GitHub...";

        }


        const berhasil =
            await simpanKeGitHub();


        if (compressProductsButton) {

            compressProductsButton.disabled =
                false;

            compressProductsButton.textContent =
                "🗜️ Optimalkan Foto Produk";

        }


        if (berhasil) {

            alert(
                "✅ Semua foto produk berhasil dioptimalkan dan disimpan ke GitHub."
            );

        } else {

            alert(
                "⚠️ Foto berhasil dioptimalkan di perangkat,\n" +
                "tetapi gagal memperbarui GitHub."
            );

        }

    } catch (error) {

        console.error(
            "Gagal kompres:",
            error
        );

        if (compressProductsButton) {

            compressProductsButton.disabled =
                false;

            compressProductsButton.textContent =
                "🗜️ Optimalkan Foto Produk";

        }

        alert(
            "❌ Gagal melakukan kompresi.\n\n" +
            error.message
        );

    }

}


// ============================================================
// BUTTON KOMPRES
// ============================================================

if (compressProductsButton) {

    compressProductsButton.addEventListener(
        "click",
        function() {

            kompresProdukLama();

        }
    );

}


// ============================================================
// STATISTIK ADMIN
// ============================================================

function updateStatistikAdmin() {

    const total =
        adminProducts.length;

    const jumlahFoto =
        adminProducts.filter(
            function(product) {

                return (
                    product.image &&
                    String(
                        product.image
                    ).trim() !== ""
                );

            }
        ).length;

    const daftarKategori =
        [
            ...new Set(
                adminProducts
                    .map(
                        function(product) {

                            return product.category;

                        }
                    )
                    .filter(Boolean)
            )
        ];


    if (statTotalProduk) {

        statTotalProduk.textContent =
            total;

    }

    if (statProdukFoto) {

        statProdukFoto.textContent =
            jumlahFoto;

    }

    if (statKategori) {

        statKategori.textContent =
            daftarKategori.length;

    }

}


// ============================================================
// SINKRONISASI
// ============================================================

function sinkronisasiProduk() {

    tampilkanProdukAdmin();

    updateStatistikAdmin();

}


// ============================================================
// INISIALISASI
// ============================================================

perbaruiPilihanKategori();

tampilkanDaftarKategori();

tampilkanSubkategoriAdmin();

tampilkanFieldWebsite();

tampilkanProdukAdmin();

updateStatistikAdmin();


// ============================================================
// LOAD DARI GITHUB
// ============================================================

muatProdukAwalAdmin();


// ============================================================
// SELESAI
// ============================================================

console.log(
    "✅ RONA CREATION Admin aktif."
);
