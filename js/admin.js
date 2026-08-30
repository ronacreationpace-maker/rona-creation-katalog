// ============================================================
// RONA CREATION - ADMIN KATALOG
// admin.js
// BAGIAN 1
// ============================================================

"use strict";


// ============================================================
// CLOUDFLARE WORKER
// ============================================================

const API_URL =
    "https://rona-katalog-api.ronacreation-pace.workers.dev";

const ADMIN_KEY =
    "ronaadmin080888";


// ============================================================
// ELEMENT
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


// ============================================================
// PRODUK YANG SEDANG DIEDIT
// ============================================================

window.editingProductId = null;


// ============================================================
// SUBKATEGORI DEFAULT
// ============================================================

const subkategoriDefault = {

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
// DATA SUBKATEGORI
// ============================================================

let subkategoriAdmin = {};


// ============================================================
// MUAT KATEGORI DARI LOCALSTORAGE
// ============================================================

function muatKategori() {

    try {

        const tersimpan =
            localStorage.getItem(
                "ronaKategori"
            );

        if (tersimpan) {

            const data =
                JSON.parse(
                    tersimpan
                );

            if (
                data &&
                typeof data === "object" &&
                !Array.isArray(data)
            ) {

                subkategoriAdmin = data;

                console.log(
                    "Kategori berhasil dimuat:",
                    subkategoriAdmin
                );

                return;

            }

        }

    } catch (error) {

        console.error(
            "Gagal membaca kategori:",
            error
        );

    }


    // Jika belum ada,
    // gunakan kategori default

    subkategoriAdmin =
        JSON.parse(
            JSON.stringify(
                subkategoriDefault
            )
        );

}


// ============================================================
// SIMPAN KATEGORI
// ============================================================

function simpanKategori() {

    try {

        localStorage.setItem(
            "ronaKategori",
            JSON.stringify(
                subkategoriAdmin
            )
        );

        console.log(
            "Kategori berhasil disimpan."
        );

        return true;

    } catch (error) {

        console.error(
            "Gagal menyimpan kategori:",
            error
        );

        alert(
            "Gagal menyimpan kategori."
        );

        return false;

    }

}


// ============================================================
// MUAT KATEGORI
// ============================================================

muatKategori();


// ============================================================
// FORMAT RUPIAH
// ============================================================

function formatRupiah(angka) {

    if (
        angka === null ||
        angka === undefined ||
        angka === ""
    ) {

        return "Rp0";

    }


    const nilai =
        Number(
            String(angka)
                .replace(
                    /[^\d]/g,
                    ""
                )
        );


    if (
        isNaN(nilai)
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


    // Hapus semua pilihan lama

    productSubcategory.innerHTML =
        "";


    // Pilihan awal

    const pilihanAwal =
        document.createElement(
            "option"
        );

    pilihanAwal.value =
        "";

    pilihanAwal.textContent =
        "Pilih subkategori";

    productSubcategory.appendChild(
        pilihanAwal
    );


    // Ambil daftar subkategori

    const daftar =
        subkategoriAdmin[kategori] || [];


    // Buat option

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
// KATEGORI BERUBAH
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
// SUBKATEGORI BERUBAH
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
// INISIALISASI SUBKATEGORI
// ============================================================

tampilkanSubkategoriAdmin();

tampilkanFieldWebsite();


// ============================================================
// FORMAT INPUT HARGA
// ============================================================

if (productPrice) {

    productPrice.addEventListener(
        "input",
        function() {

            let angka =
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
// UKURAN DATA MB
// ============================================================

function ukuranDataMB(data) {

    return (
        data.length /
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


    const batasAman =
        4.0;


    if (
        ukuran >
        batasAman
    ) {

        alert(
            "Penyimpanan katalog terlalu besar.\n\n" +
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


                            const hasil =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.75
                                );


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
// PREVIEW FOTO
// ============================================================

if (productImage) {

    productImage.addEventListener(
        "change",
        function() {

            if (imagePreview) {

                imagePreview.innerHTML =
                    "";

            }


            if (imageSizeInfo) {

                imageSizeInfo.textContent =
                    "";

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


                productImage.value =
                    "";


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
                                style="
                                    max-width:100%;
                                    max-height:300px;
                                    object-fit:contain;
                                    display:block;
                                    margin:auto;
                                "
                            >
                        `;

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
                                hasilKompres.length *
                                0.75 /
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
                            "Preview gagal:",
                            error
                        );


                        if (imageSizeInfo) {

                            imageSizeInfo.textContent =
                                "Gagal menghitung ukuran foto.";

                        }

                    }

                };


            reader.readAsDataURL(
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
// CEK STORAGE DAN SIMPAN LOCAL
// ============================================================

function simpanProdukLocal() {

    const data =
        JSON.stringify(
            adminProducts
        );


    if (
        !storageMasihAman(
            data
        )
    ) {

        return false;

    }


    try {

        localStorage.setItem(
            "ronaProducts",
            data
        );

        return true;

    } catch (error) {

        console.error(
            "LocalStorage gagal:",
            error
        );


        alert(
            "Gagal menyimpan produk di perangkat.\n\n" +
            error.message
        );


        return false;

    }

}


// ============================================================
// RESET FORM
// ============================================================

function resetFormProduk() {

    if (productImage) {

        productImage.value =
            "";

    }


    if (productName) {

        productName.value =
            "";

    }


    if (productCategory) {

        productCategory.value =
            "";

    }


    if (productSubcategory) {

        productSubcategory.innerHTML = `
            <option value="">
                Pilih subkategori
            </option>
        `;

    }


    if (productWebsite) {

        productWebsite.value =
            "";

    }


    if (productPrice) {

        productPrice.value =
            "";

    }


    if (productDescription) {

        productDescription.value =
            "";

    }


    if (websiteLinkGroup) {

        websiteLinkGroup.style.display =
            "none";

    }


    if (imagePreview) {

        imagePreview.innerHTML =
            "";

    }


    if (imageSizeInfo) {

        imageSizeInfo.textContent =
            "";

    }


    if (cancelEditButton) {

        cancelEditButton.style.display =
            "none";

    }


    if (saveProductButton) {

        saveProductButton.disabled =
            false;

        saveProductButton.textContent =
            "💾 Simpan Produk";

    }


    window.editingProductId =
        null;

}


// ============================================================
// LOG ADMIN
// ============================================================

console.log(
    "RONA CREATION Admin - Bagian 1 berhasil dimuat."
);
