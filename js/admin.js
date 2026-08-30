// ============================================================
// RONA CREATION - ADMIN KATALOG
// ============================================================
// Fitur:
// - Tambah produk
// - Edit produk
// - Hapus produk
// - Foto otomatis dikompres
// - Subkategori
// - Kelola kategori & subkategori
// - Backup
// - Restore
// - Export products.json
// - Optimalkan foto lama
// - Pencarian
// - Statistik
// - Load products.json
// - Simpan ke GitHub melalui Cloudflare Worker
// ============================================================


// ============================================================
// CLOUDFLARE WORKER
// ============================================================

const API_URL =
    "https://rona-katalog-api.ronacreation-pace.workers.dev";

const ADMIN_KEY =
    "ronaadmin080888";


// ============================================================
// AMBIL ELEMENT HTML
// ============================================================

const productImage =
    document.getElementById("productImage");

const imagePreview =
    document.getElementById("imagePreview");

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
// ELEMENT KATEGORI
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
// DATA PRODUK
// ============================================================

let adminProducts = [];

try {

    const dataLocal =
        JSON.parse(
            localStorage.getItem("ronaProducts")
        );

    if (Array.isArray(dataLocal)) {
        adminProducts = dataLocal;
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
// PASTIKAN KATEGORI ADA DI SELECT
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
    optionAwal.textContent = "Pilih kategori";

    productCategory.appendChild(
        optionAwal
    );

    Object.keys(subkategoriAdmin)
        .forEach(function(kategori) {

            const option =
                document.createElement("option");

            option.value = kategori;
            option.textContent = kategori;

            if (kategori === nilaiLama) {
                option.selected = true;
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
        Object.keys(subkategoriAdmin);

    if (!semuaKategori.length) {

        adminCategoryList.innerHTML = `
            <div class="empty-product">
                Belum ada kategori.
            </div>
        `;

        return;
    }

    semuaKategori.forEach(function(kategori) {

        const box =
            document.createElement("div");

        box.className =
            "admin-category-item";

        const judul =
            document.createElement("h3");

        judul.textContent =
            kategori;

        box.appendChild(judul);

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

            box.appendChild(kosong);

        }

        daftar.forEach(function(
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

            tombolEdit.type = "button";
            tombolEdit.textContent = "✏️";
            tombolEdit.className =
                "edit-subcategory-button";

            const tombolHapus =
                document.createElement("button");

            tombolHapus.type = "button";
            tombolHapus.textContent = "🗑️";
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

                    if (namaBaru === null) {
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
                        subkategoriAdmin[kategori]
                            .some(
                                function(item, i) {

                                    return (
                                        i !== index &&
                                        item.toLowerCase() ===
                                        hasil.toLowerCase()
                                    );

                                }
                            );

                    if (duplikat) {

                        alert(
                            "Subkategori tersebut sudah ada."
                        );

                        return;
                    }

                    subkategoriAdmin[kategori][index] =
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

                    subkategoriAdmin[kategori]
                        .splice(index, 1);

                    simpanKategori();

                    tampilkanDaftarKategori();

                    tampilkanSubkategoriAdmin();

                }
            );

            box.appendChild(baris);

        });

        adminCategoryList.appendChild(box);

    });

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

            // Cari kategori tanpa membedakan huruf besar kecil

            let namaKategoriAsli =
                Object.keys(subkategoriAdmin)
                    .find(function(item) {

                        return (
                            item.toLowerCase() ===
                            kategori.toLowerCase()
                        );

                    });

            if (!namaKategoriAsli) {

                namaKategoriAsli =
                    kategori;

                subkategoriAdmin[
                    namaKategoriAsli
                ] = [];

            }

            const sudahAda =
                subkategoriAdmin[namaKategoriAsli]
                    .some(function(item) {

                        return (
                            item.toLowerCase() ===
                            subkategori.toLowerCase()
                        );

                    });

            if (sudahAda) {

                alert(
                    "Subkategori tersebut sudah ada."
                );

                return;
            }

            subkategoriAdmin[
                namaKategoriAsli
            ].push(subkategori);

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
            String(angka ?? "")
                .replace(/[^\d]/g, "")
        );

    if (
        !Number.isFinite(nilai)
    ) {
        return "Rp0";
    }

    return nilai.toLocaleString(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
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

    // Kosongkan

    productSubcategory.innerHTML = "";

    // Pilihan awal

    const pilihanAwal =
        document.createElement("option");

    pilihanAwal.value = "";
    pilihanAwal.textContent =
        "Pilih subkategori";

    productSubcategory.appendChild(
        pilihanAwal
    );

    // Ambil daftar

    const daftar =
        Array.isArray(
            subkategoriAdmin[kategori]
        )
            ? subkategoriAdmin[kategori]
            : [];

    daftar.forEach(function(
        subkategori
    ) {

        const option =
            document.createElement("option");

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

    });

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
            productWebsite.value = "";
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
// FORMAT HARGA SAAT DIKETIK
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

                this.value = "";

                return;
            }

            this.value =
                Number(
                    angka
                ).toLocaleString("id-ID");

        }
    );

}


// ============================================================
// CEK UKURAN DATA
// ============================================================

function ukuranDataMB(data) {

    return (
        new Blob([data]).size /
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

    // Batas aman localStorage

    const batasAman =
        4.0;

    if (ukuran > batasAman) {

        alert(
            "⚠️ Data katalog terlalu besar.\n\n" +
            "Ukuran saat ini: " +
            ukuran.toFixed(2) +
            " MB\n\n" +
            "Silakan optimalkan foto produk terlebih dahulu."
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

                                reject(error);

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

            reader.readAsDataURL(file);

        }
    );

}


// ============================================================
// PREVIEW FOTO
// ============================================================

if (productImage) {

    productImage.addEventListener(
        "change",
        function() {

            if (imagePreview) {
                imagePreview.innerHTML = "";
            }

            if (imageSizeInfo) {
                imageSizeInfo.textContent = "";
            }

            const file =
                productImage.files[0];

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

                productImage.value = "";

                return;
            }

            const reader =
                new FileReader();

            reader.onload =
                async function(event) {

                    if (imagePreview) {

                        imagePreview.innerHTML = `
                            <img
                                src="${event.target.result}"
                                alt="Preview Produk"
                            >
                        `;

                    }

                    if (imageSizeInfo) {

                        imageSizeInfo.innerHTML =
                            "⏳ Mengoptimalkan foto...";

                    }

                    try {

                        const hasilKompres =
                            await kompresFoto(file);

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

                };

            reader.readAsDataURL(file);

        }
    );

}


// ============================================================
// SIMPAN KE GITHUB MELALUI CLOUDFLARE WORKER
// ============================================================

async function simpanKeGitHub() {

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

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
// MUAT PRODUK DARI GITHUB
// ============================================================

async function muatProdukAwalAdmin() {

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

        adminProducts =
            produkDariGithub;

        try {

            const dataLocal =
                JSON.stringify(
                    adminProducts
                );

            if (
                storageMasihAman(
                    dataLocal
                )
            ) {

                localStorage.setItem(
                    "ronaProducts",
                    dataLocal
                );

            }

        } catch (error) {

            console.warn(
                "Tidak dapat menyimpan produk ke localStorage:",
                error
            );

        }

        console.log(
            "Produk berhasil dimuat dari GitHub:",
            adminProducts
        );

        tampilkanProdukAdmin();

        updateStatistikAdmin();

    } catch (error) {

        console.warn(
            "Tidak bisa mengambil products.json:",
            error
        );

        // Gunakan localStorage

        try {

            const dataLocal =
                JSON.parse(
                    localStorage.getItem(
                        "ronaProducts"
                    )
                );

            if (Array.isArray(dataLocal)) {

                adminProducts =
                    dataLocal;

            } else {

                adminProducts = [];

            }

        } catch (errorLocal) {

            adminProducts = [];

        }

        tampilkanProdukAdmin();

        updateStatistikAdmin();

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
                document.createElement("a");

            link.href = url;

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
                Array.isArray(adminProducts)
                    ? adminProducts
                    : [];

            if (!produk.length) {

                alert(
                    "Belum ada produk di Admin."
                );

                return;
            }

            const dataExport = {
                products: produk
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
                document.createElement("a");

            link.href = url;

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
                            Array.isArray(data)
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

            reader.readAsText(file);

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

            const file =
                productImage
                    ? productImage.files[0]
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
                        productPrice.value
                            .replace(
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
            // VALIDASI
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

            if (!kategori) {

                alert(
                    "Silakan pilih kategori."
                );

                if (productCategory) {
                    productCategory.focus();
                }

                return;
            }

            if (!subkategori) {

                alert(
                    "Silakan pilih subkategori."
                );

                if (productSubcategory) {
                    productSubcategory.focus();
                }

                return;
            }

            if (!harga || harga <= 0) {

                alert(
                    "Harga belum diisi."
                );

                if (productPrice) {
                    productPrice.focus();
                }

                return;
            }

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
                kategori === "Undangan" &&
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
            // CEK DUPLIKAT
            // ====================================================

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

            const namaNormal =
                normalisasiNamaProduk(
                    nama
                );

            const produkDuplikat =
                adminProducts.some(
                    function(product) {

                        if (
                            window.editingProductId !==
                                null &&
                            String(product.id) ===
                                String(
                                    window.editingProductId
                                )
                        ) {

                            return false;

                        }

                        return (
                            normalisasiNamaProduk(
                                product.name
                            ) === namaNormal &&
                            product.category ===
                                kategori
                        );

                    }
                );

            if (produkDuplikat) {

                alert(
                    "Produk dengan nama dan kategori tersebut sudah ada."
                );

                if (productName) {
                    productName.focus();
                }

                return;
            }


            // ====================================================
            // MODE EDIT
            // ====================================================

            if (
                window.editingProductId !== null
            ) {

                const index =
                    adminProducts.findIndex(
                        function(product) {

                            return (
                                String(product.id) ===
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

                let gambar =
                    adminProducts[index].image ||
                    "";


                // FOTO BARU

                if (file) {

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

                    try {

                        saveProductButton.disabled =
                            true;

                        saveProductButton.textContent =
                            "⏳ Mengompres foto...";

                        gambar =
                            await kompresFoto(
                                file
                            );

                    } catch (error) {

                        console.error(
                            error
                        );

                        alert(
                            "❌ Gagal memproses foto."
                        );

                        saveProductButton.disabled =
                            false;

                        saveProductButton.textContent =
                            "💾 Simpan Perubahan";

                        return;
                    }

                }


                // UPDATE

                const produkLama =
                    adminProducts[index];

                adminProducts[index] = {

                    ...produkLama,

                    name:
                        nama,

                    category:
                        kategori,

                    subcategory:
                        subkategori,

                    price:
                        harga,

                    image:
                        gambar,

                    description:
                        deskripsi,

                    website:
                        website

                };


                const dataProduk =
                    JSON.stringify(
                        adminProducts
                    );

                if (
                    !storageMasihAman(
                        dataProduk
                    )
                ) {

                    // Kembalikan data lama

                    adminProducts[index] =
                        produkLama;

                    return;
                }


                try {

                    localStorage.setItem(
                        "ronaProducts",
                        dataProduk
                    );

                } catch (error) {

                    console.error(
                        error
                    );

                    alert(
                        "❌ Gagal menyimpan data di perangkat."
                    );

                    adminProducts[index] =
                        produkLama;

                    return;
                }


                tampilkanProdukAdmin();

                updateStatistikAdmin();


                // KIRIM GITHUB

                saveProductButton.textContent =
                    "☁️ Menyimpan ke GitHub...";

                const berhasil =
                    await simpanKeGitHub();

                if (berhasil) {

                    resetFormProduk();

                    alert(
                        "✅ Produk berhasil diperbarui.\n\n" +
                        "Data juga sudah tersimpan ke GitHub."
                    );

                } else {

                    alert(
                        "⚠️ Produk diperbarui di perangkat,\n" +
                        "tetapi gagal dikirim ke GitHub."
                    );

                }

                saveProductButton.disabled =
                    false;

                saveProductButton.textContent =
                    "💾 Simpan Produk";

                return;

            }


            // ====================================================
            // MODE TAMBAH
            // ====================================================

            if (!file) {

                alert(
                    "Silakan pilih foto produk."
                );

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


            try {

                saveProductButton.disabled =
                    true;

                saveProductButton.textContent =
                    "⏳ Mengompres foto...";


                // KOMPRES FOTO

                const gambar =
                    await kompresFoto(
                        file
                    );


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

                    image:
                        gambar,

                    description:
                        deskripsi,

                    website:
                        website

                };


                // SIMPAN SEMENTARA

                adminProducts.push(
                    produkBaru
                );


                // CEK STORAGE

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


                // SIMPAN LOCAL

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


                // KIRIM KE GITHUB

                saveProductButton.textContent =
                    "☁️ Menyimpan ke GitHub...";

                const berhasilGitHub =
                    await simpanKeGitHub();


                if (berhasilGitHub) {

                    resetFormProduk();

                    alert(
                        "✅ Produk berhasil ditambahkan!\n\n" +
                        "Produk juga sudah tersimpan ke GitHub."
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

    adminProductList.innerHTML = "";

    data.forEach(
        function(product) {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "admin-product-item";


            // FOTO

            const gambar =
                product.image || "";

            const namaProduk =
                product.name || "Tanpa Nama";


            item.innerHTML = `

                <img
                    src="${gambar}"
                    alt="${namaProduk}"
                >

                <div class="admin-product-info">

                    <div class="admin-product-category">
                        ${product.category || ""}
                    </div>

                    <h3>
                        ${namaProduk}
                    </h3>

                    <p>
                        ${formatRupiah(
                            product.price
                        )}
                    </p>

                </div>

                <div class="admin-product-actions">

                    <button
                        type="button"
                        class="edit-product-button"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        type="button"
                        class="delete-product-button"
                    >
                        🗑️ Hapus
                    </button>

                </div>

            `;


            // =================================================
            // EDIT
            // =================================================

            const tombolEdit =
                item.querySelector(
                    ".edit-product-button"
                );

            if (tombolEdit) {

                tombolEdit.addEventListener(
                    "click",
                    function() {

                        if (productName) {

                            productName.value =
                                product.name || "";

                        }

                        if (productCategory) {

                            productCategory.value =
                                product.category || "";

                        }

                        tampilkanSubkategoriAdmin(
                            product.subcategory || ""
                        );

                        if (productWebsite) {

                            productWebsite.value =
                                product.website || "";

                        }

                        tampilkanFieldWebsite();

                        if (productPrice) {

                            productPrice.value =
                                Number(
                                    product.price || 0
                                ).toLocaleString(
                                    "id-ID"
                                );

                        }

                        if (productDescription) {

                            productDescription.value =
                                product.description || "";

                        }

                        if (imagePreview) {

                            if (product.image) {

                                imagePreview.innerHTML = `
                                    <img
                                        src="${product.image}"
                                        alt="Foto Produk"
                                    >
                                `;

                            } else {

                                imagePreview.innerHTML =
                                    "";

                            }

                        }

                        if (imageSizeInfo) {

                            imageSizeInfo.textContent =
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

            }


            // =================================================
            // HAPUS
            // =================================================

            const tombolHapus =
                item.querySelector(
                    ".delete-product-button"
                );

            if (tombolHapus) {

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
                                        String(item.id) !==
                                        String(product.id)
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

            }


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
                                product.name || ""
                            ).toLowerCase();

                        const kategori =
                            String(
                                product.category || ""
                            ).toLowerCase();

                        const subkategori =
                            String(
                                product.subcategory || ""
                            ).toLowerCase();

                        const harga =
                            String(
                                product.price || ""
                            ).toLowerCase();

                        const deskripsi =
                            String(
                                product.description || ""
                            ).toLowerCase();

                        return (
                            nama.includes(keyword) ||
                            kategori.includes(keyword) ||
                            subkategori.includes(keyword) ||
                            harga.includes(keyword) ||
                            deskripsi.includes(keyword)
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
            `Kompres ulang ${adminProducts.length} foto produk?`
        );

    if (!yakin) {
        return;
    }

    try {

        const produkBaru = [];

        for (
            let i = 0;
            i < adminProducts.length;
            i++
        ) {

            const product =
                adminProducts[i];

            console.log(
                `Memproses ${i + 1}/${adminProducts.length}: ${product.name}`
            );

            const produkUpdate = {
                ...product
            };

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
                        `produk-${product.id}.jpg`,
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


        // SIMPAN GITHUB

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
                "✅ Foto produk berhasil dikompres dan disimpan ke GitHub."
            );

        } else {

            alert(
                "⚠️ Foto berhasil dikompres di perangkat,\n" +
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
// SINKRONISASI DATA
// ============================================================

function sinkronisasiProduk() {

    tampilkanProdukAdmin();

    updateStatistikAdmin();

}


// ============================================================
// INISIALISASI KATEGORI
// ============================================================

perbaruiPilihanKategori();

tampilkanDaftarKategori();

tampilkanSubkategoriAdmin();

tampilkanFieldWebsite();


// ============================================================
// TAMPILKAN DATA AWAL
// ============================================================

tampilkanProdukAdmin();

updateStatistikAdmin();


// ============================================================
// MUAT PRODUK DARI GITHUB
// ============================================================

muatProdukAwalAdmin();


// ============================================================
// SELESAI
// ============================================================

console.log(
    "✅ RONA CREATION Admin aktif."
);
