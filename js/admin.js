/* =========================================================
   RONA CREATION - ADMIN.JS FINAL
   =========================================================
   SISTEM:
   Admin → Cloudflare Worker → GitHub → products.json

   MEDIA:
   - 6 Foto
   - 1 Video

   STORAGE:
   - localStorage: ronaProducts
   - localStorage: ronaKategori

   PROMO:
   - price       = harga normal
   - pricePromo  = harga promo
   - Harga promo TIDAK otomatis berubah.
   ========================================================= */


/* =========================================================
   KONFIGURASI
   ========================================================= */

const API_URL =
    "https://rona-katalog-api.ronacreation-pace.workers.dev";

const ADMIN_KEY =
    "ronaadmin080888";

const MAX_VIDEO_SIZE =
    2 * 1024 * 1024;

const MAX_STORAGE_MB =
    4.0;


/* =========================================================
   ELEMENT HTML
   ========================================================= */

const productImage =
    document.getElementById("productImage");

const productImage2 =
    document.getElementById("productImage2");

const productImage3 =
    document.getElementById("productImage3");

const productImage4 =
    document.getElementById("productImage4");

const productImage5 =
    document.getElementById("productImage5");

const productImage6 =
    document.getElementById("productImage6");

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


/* =========================================================
   ELEMENT KATEGORI
   ========================================================= */

const newCategory =
    document.getElementById("newCategory");

const newSubcategory =
    document.getElementById("newSubcategory");

const addCategoryButton =
    document.getElementById("addCategoryButton");

const adminCategoryList =
    document.getElementById("adminCategoryList");


/* =========================================================
   DATA
   ========================================================= */

let adminProducts = [];

let editingProductId = null;

let kategoriData = {};


/* =========================================================
   KATEGORI DEFAULT
   ========================================================= */

const defaultKategori = {

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


/* =========================================================
   PRODUK DEFAULT
   ========================================================= */

const defaultProducts = [];


/* =========================================================
   FORMAT RUPIAH
   ========================================================= */

function formatRupiah(angka) {

    if (
        angka === null ||
        angka === undefined ||
        angka === ""
    ) {
        return "";
    }

    const number =
        Number(
            String(angka)
                .replace(/\D/g, "")
        );

    if (!number) {
        return "";
    }

    return new Intl.NumberFormat(
        "id-ID"
    ).format(number);
}


/* =========================================================
   AMBIL ANGKA DARI RUPIAH
   ========================================================= */

function angkaRupiah(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    return Number(
        String(value)
            .replace(/\D/g, "")
    ) || 0;
}


/* =========================================================
   FORMAT INPUT HARGA
   ========================================================= */

function formatInputHarga(input) {

    if (!input) {
        return;
    }

    input.addEventListener(
        "input",
        function () {

            let angka =
                this.value.replace(/\D/g, "");

            if (!angka) {
                this.value = "";
                return;
            }

            this.value =
                new Intl.NumberFormat(
                    "id-ID"
                ).format(Number(angka));

        }
    );
}


formatInputHarga(productPrice);
formatInputHarga(productPricePromo);


/* =========================================================
   NORMALISASI PRODUK
   ========================================================= */

function normalisasiProduk(product) {

    if (!product) {
        return null;
    }

    const hasil = {
        ...product
    };


    /* -----------------------------------------------------
       PROMO PRICE
       ----------------------------------------------------- */

    if (
        !hasil.pricePromo &&
        hasil.promoPrice
    ) {
        hasil.pricePromo =
            hasil.promoPrice;
    }

    delete hasil.promoPrice;


    /* -----------------------------------------------------
       ID
       ----------------------------------------------------- */

    if (!hasil.id) {
        hasil.id =
            Date.now() +
            Math.random();
    }


    /* -----------------------------------------------------
       FOTO
       ----------------------------------------------------- */

    hasil.image =
        hasil.image || "";

    hasil.image2 =
        hasil.image2 || "";

    hasil.image3 =
        hasil.image3 || "";

    hasil.image4 =
        hasil.image4 || "";

    hasil.image5 =
        hasil.image5 || "";

    hasil.image6 =
        hasil.image6 || "";


    /* -----------------------------------------------------
       VIDEO
       ----------------------------------------------------- */

    hasil.video =
        hasil.video || "";


    /* -----------------------------------------------------
       HARGA
       ----------------------------------------------------- */

    hasil.price =
        angkaRupiah(hasil.price);

    hasil.pricePromo =
        angkaRupiah(hasil.pricePromo);


    return hasil;
}


/* =========================================================
   LOAD LOCAL STORAGE
   ========================================================= */

function muatProdukLocal() {

    try {

        const data =
            localStorage.getItem(
                "ronaProducts"
            );

        if (!data) {

            adminProducts =
                [...defaultProducts];

            simpanProdukLocal();

            return;
        }

        const parsed =
            JSON.parse(data);

        if (Array.isArray(parsed)) {

            adminProducts =
                parsed
                    .map(normalisasiProduk)
                    .filter(Boolean);

        } else if (
            parsed &&
            Array.isArray(parsed.products)
        ) {

            adminProducts =
                parsed.products
                    .map(normalisasiProduk)
                    .filter(Boolean);

        } else {

            adminProducts =
                [...defaultProducts];

        }

    } catch (error) {

        console.error(
            "Gagal membaca produk:",
            error
        );

        adminProducts =
            [...defaultProducts];
    }
}


/* =========================================================
   SIMPAN LOCAL STORAGE
   ========================================================= */

function simpanProdukLocal() {

    try {

        const data =
            JSON.stringify(
                adminProducts
            );

        localStorage.setItem(
            "ronaProducts",
            data
        );

        return true;

    } catch (error) {

        console.error(
            "Gagal menyimpan localStorage:",
            error
        );

        alert(
            "❌ Gagal menyimpan produk di perangkat."
        );

        return false;
    }
}


/* =========================================================
   CEK STORAGE
   ========================================================= */

function ukuranStorageMB(data) {

    const text =
        JSON.stringify(data);

    const bytes =
        new Blob([text]).size;

    return bytes /
        (1024 * 1024);
}


function storageMasihAman(data) {

    const ukuran =
        ukuranStorageMB(data);

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
            "⚠️ Penyimpanan terlalu besar.\n\n" +
            "Ukuran saat ini: " +
            ukuran.toFixed(2) +
            " MB\n\n" +
            "Batas aman: " +
            MAX_STORAGE_MB +
            " MB\n\n" +
            "Silakan kompres foto terlebih dahulu."
        );

        return false;
    }

    return true;
}


/* =========================================================
   LOAD KATEGORI
   ========================================================= */

function muatKategori() {

    try {

        const data =
            localStorage.getItem(
                "ronaKategori"
            );

        if (data) {

            kategoriData =
                JSON.parse(data);

        } else {

            kategoriData =
                JSON.parse(
                    JSON.stringify(
                        defaultKategori
                    )
                );

            simpanKategori();
        }

    } catch (error) {

        console.error(
            "Gagal memuat kategori:",
            error
        );

        kategoriData =
            JSON.parse(
                JSON.stringify(
                    defaultKategori
                )
            );
    }
}


/* =========================================================
   SIMPAN KATEGORI
   ========================================================= */

function simpanKategori() {

    localStorage.setItem(
        "ronaKategori",
        JSON.stringify(
            kategoriData
        )
    );
}


/* =========================================================
   RENDER KATEGORI SELECT
   ========================================================= */

function renderKategoriSelect() {

    if (!productCategory) {
        return;
    }

    const nilaiLama =
        productCategory.value;

    productCategory.innerHTML =
        `<option value="">Pilih Kategori</option>`;


    Object.keys(
        kategoriData
    ).forEach(
        function (kategori) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                kategori;

            option.textContent =
                kategori;

            productCategory.appendChild(
                option
            );
        }
    );


    if (
        nilaiLama &&
        kategoriData[nilaiLama]
    ) {

        productCategory.value =
            nilaiLama;
    }


    renderSubkategori();
}


/* =========================================================
   RENDER SUBKATEGORI
   ========================================================= */

function renderSubkategori() {

    if (!productSubcategory) {
        return;
    }

    const kategori =
        productCategory
            ? productCategory.value
            : "";

    const nilaiLama =
        productSubcategory.value;

    productSubcategory.innerHTML =
        `<option value="">Pilih Subkategori</option>`;


    if (
        kategori &&
        kategoriData[kategori]
    ) {

        kategoriData[kategori]
            .forEach(
                function (sub) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        sub;

                    option.textContent =
                        sub;

                    productSubcategory
                        .appendChild(
                            option
                        );
                }
            );
    }


    if (
        nilaiLama &&
        kategori &&
        kategoriData[kategori] &&
        kategoriData[kategori]
            .includes(nilaiLama)
    ) {

        productSubcategory.value =
            nilaiLama;
    }


    tampilkanWebsiteInput();
}


/* =========================================================
   WEBSITE UNDANGAN
   ========================================================= */

function tampilkanWebsiteInput() {

    if (
        !websiteLinkGroup ||
        !productCategory ||
        !productSubcategory
    ) {
        return;
    }

    const tampil =
        productCategory.value ===
            "Undangan" &&
        productSubcategory.value ===
            "Undangan Website Online";


    websiteLinkGroup.style.display =
        tampil
            ? "block"
            : "none";


    if (!tampil && productWebsite) {

        productWebsite.value =
            "";
    }
}


/* =========================================================
   EVENT KATEGORI
   ========================================================= */

if (productCategory) {

    productCategory.addEventListener(
        "change",
        function () {

            renderSubkategori();

        }
    );
}


if (productSubcategory) {

    productSubcategory.addEventListener(
        "change",
        function () {

            tampilkanWebsiteInput();

        }
    );
}


/* =========================================================
   PREVIEW FOTO
   ========================================================= */

function previewFoto(
    file,
    previewElement
) {

    if (
        !previewElement
    ) {
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

        previewElement.innerHTML =
            `<span style="color:red;">
                ❌ File bukan gambar
            </span>`;

        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            const img =
                document.createElement(
                    "img"
                );

            img.src =
                event.target.result;

            img.style.maxWidth =
                "100%";

            img.style.maxHeight =
                "220px";

            img.style.objectFit =
                "contain";

            img.style.borderRadius =
                "10px";

            previewElement.appendChild(
                img
            );
        };


    reader.readAsDataURL(file);
}


/* =========================================================
   EVENT FOTO 1-6
   ========================================================= */

if (productImage) {

    productImage.addEventListener(
        "change",
        function () {

            previewFoto(
                productImage.files[0],
                imagePreview
            );

        }
    );
}


if (productImage2) {

    productImage2.addEventListener(
        "change",
        function () {

            previewFoto(
                productImage2.files[0],
                imagePreview2
            );

        }
    );
}


if (productImage3) {

    productImage3.addEventListener(
        "change",
        function () {

            previewFoto(
                productImage3.files[0],
                imagePreview3
            );

        }
    );
}


if (productImage4) {

    productImage4.addEventListener(
        "change",
        function () {

            previewFoto(
                productImage4.files[0],
                imagePreview4
            );

        }
    );
}


if (productImage5) {

    productImage5.addEventListener(
        "change",
        function () {

            previewFoto(
                productImage5.files[0],
                imagePreview5
            );

        }
    );
}


if (productImage6) {

    productImage6.addEventListener(
        "change",
        function () {

            previewFoto(
                productImage6.files[0],
                imagePreview6
            );

        }
    );
}


/* =========================================================
   KOMPRES FOTO
   ========================================================= */

function kompresFoto(file) {

    return new Promise(
        function (resolve, reject) {

            if (!file) {

                resolve("");

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const img =
                        new Image();


                    img.onload =
                        function () {

                            const maxSize =
                                1000;

                            let width =
                                img.width;

                            let height =
                                img.height;


                            if (
                                width >
                                    maxSize ||
                                height >
                                    maxSize
                            ) {

                                if (
                                    width >
                                    height
                                ) {

                                    height =
                                        Math.round(
                                            height *
                                            maxSize /
                                            width
                                        );

                                    width =
                                        maxSize;

                                } else {

                                    width =
                                        Math.round(
                                            width *
                                            maxSize /
                                            height
                                        );

                                    height =
                                        maxSize;
                                }
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


                            resolve(hasil);
                        };


                    img.onerror =
                        function () {

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
                function () {

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


/* =========================================================
   VIDEO → BASE64
   ========================================================= */

function bacaVideo(file) {

    return new Promise(
        function (resolve, reject) {

            if (!file) {

                resolve("");

                return;
            }


            if (
                file.size >
                MAX_VIDEO_SIZE
            ) {

                reject(
                    new Error(
                        "Ukuran video maksimal 2 MB."
                    )
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    resolve(
                        event.target.result
                    );
                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Gagal membaca video."
                        )
                    );
                };


            reader.readAsDataURL(file);
        }
    );
}


/* =========================================================
   PREVIEW VIDEO
   ========================================================= */

if (productVideo) {

    productVideo.addEventListener(
        "change",
        function () {

            const file =
                productVideo.files[0];


            if (
                !videoPreview
            ) {
                return;
            }


            videoPreview.innerHTML =
                "";


            if (!file) {
                return;
            }


            if (
                file.size >
                MAX_VIDEO_SIZE
            ) {

                videoPreview.innerHTML =
                    `<span style="color:red;">
                        ❌ Video terlalu besar.
                        Maksimal 2 MB.
                    </span>`;

                return;
            }


            const url =
                URL.createObjectURL(
                    file
                );


            const video =
                document.createElement(
                    "video"
                );

            video.src =
                url;

            video.controls =
                true;

            video.style.maxWidth =
                "100%";

            video.style.maxHeight =
                "250px";

            video.style.borderRadius =
                "10px";


            videoPreview.appendChild(
                video
            );
        }
    );
}


/* =========================================================
   VALIDASI FILE FOTO
   ========================================================= */

function validasiFoto(file) {

    if (!file) {
        return true;
    }

    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "❌ Semua file foto harus berupa gambar."
        );

        return false;
    }

    return true;
}


/* =========================================================
   RESET FORM
   ========================================================= */

function resetFormProduk() {

    editingProductId =
        null;


    if (productName) {
        productName.value =
            "";
    }

    if (productCategory) {
        productCategory.value =
            "";
    }

    if (productSubcategory) {
        productSubcategory.innerHTML =
            `<option value="">Pilih Subkategori</option>`;
    }

    if (productWebsite) {
        productWebsite.value =
            "";
    }

    if (productPrice) {
        productPrice.value =
            "";
    }

    if (productPricePromo) {
        productPricePromo.value =
            "";
    }

    if (productDescription) {
        productDescription.value =
            "";
    }


    const daftarInput =
        [
            productImage,
            productImage2,
            productImage3,
            productImage4,
            productImage5,
            productImage6,
            productVideo
        ];


    daftarInput.forEach(
        function (input) {

            if (input) {
                input.value =
                    "";
            }
        }
    );


    const daftarPreview =
        [
            imagePreview,
            imagePreview2,
            imagePreview3,
            imagePreview4,
            imagePreview5,
            imagePreview6,
            videoPreview
        ];


    daftarPreview.forEach(
        function (preview) {

            if (preview) {
                preview.innerHTML =
                    "";
            }
        }
    );


    if (websiteLinkGroup) {

        websiteLinkGroup.style.display =
            "none";
    }


    if (saveProductButton) {

        saveProductButton.textContent =
            "💾 Simpan Produk";
    }


    if (cancelEditButton) {

        cancelEditButton.style.display =
            "none";
    }
}


/* =========================================================
   TAMPILKAN MEDIA EDIT
   ========================================================= */

function tampilkanMediaEdit(product) {

    const foto =
        [
            product.image,
            product.image2,
            product.image3,
            product.image4,
            product.image5,
            product.image6
        ];


    const previews =
        [
            imagePreview,
            imagePreview2,
            imagePreview3,
            imagePreview4,
            imagePreview5,
            imagePreview6
        ];


    foto.forEach(
        function (src, index) {

            const preview =
                previews[index];


            if (!preview) {
                return;
            }


            preview.innerHTML =
                "";


            if (!src) {
                return;
            }


            const img =
                document.createElement(
                    "img"
                );

            img.src =
                src;

            img.style.maxWidth =
                "100%";

            img.style.maxHeight =
                "220px";

            img.style.objectFit =
                "contain";

            img.style.borderRadius =
                "10px";


            preview.appendChild(
                img
            );
        }
    );


    if (
        videoPreview
    ) {

        videoPreview.innerHTML =
            "";


        if (product.video) {

            const video =
                document.createElement(
                    "video"
                );

            video.src =
                product.video;

            video.controls =
                true;

            video.style.maxWidth =
                "100%";

            video.style.maxHeight =
                "250px";

            video.style.borderRadius =
                "10px";


            videoPreview.appendChild(
                video
            );
        }
    }
}


/* =========================================================
   EDIT PRODUK
   ========================================================= */

function editProduk(id) {

    const product =
        adminProducts.find(
            function (item) {

                return String(item.id) ===
                    String(id);
            }
        );


    if (!product) {

        alert(
            "❌ Produk tidak ditemukan."
        );

        return;
    }


    editingProductId =
        product.id;


    if (productName) {

        productName.value =
            product.name ||
            product.nama ||
            "";
    }


    if (productCategory) {

        productCategory.value =
            product.category ||
            "";
    }


    renderSubkategori();


    if (productSubcategory) {

        productSubcategory.value =
            product.subcategory ||
            "";
    }


    tampilkanWebsiteInput();


    if (productWebsite) {

        productWebsite.value =
            product.website ||
            product.link ||
            "";
    }


    if (productPrice) {

        productPrice.value =
            formatRupiah(
                product.price
            );
    }


    if (productPricePromo) {

        productPricePromo.value =
            formatRupiah(
                product.pricePromo
            );
    }


    if (productDescription) {

        productDescription.value =
            product.description ||
            product.deskripsi ||
            "";
    }


    tampilkanMediaEdit(
        product
    );


    if (saveProductButton) {

        saveProductButton.textContent =
            "✏️ Update Produk";
    }


    if (cancelEditButton) {

        cancelEditButton.style.display =
            "inline-block";
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   BATAL EDIT
   ========================================================= */

if (cancelEditButton) {

    cancelEditButton.addEventListener(
        "click",
        function () {

            resetFormProduk();

        }
    );
}


/* =========================================================
   DUPLIKAT PRODUK
   ========================================================= */

function produkDuplikat(
    nama,
    kategori,
    subkategori,
    idLama
) {

    const namaNormal =
        nama
            .trim()
            .toLowerCase();


    return adminProducts.some(
        function (product) {

            if (
                idLama !== null &&
                String(product.id) ===
                    String(idLama)
            ) {

                return false;
            }


            return (
                String(
                    product.name ||
                    ""
                )
                    .trim()
                    .toLowerCase() ===
                    namaNormal
                &&
                String(
                    product.category ||
                    ""
                ) ===
                    String(kategori)
                &&
                String(
                    product.subcategory ||
                    ""
                ) ===
                    String(subkategori)
            );
        }
    );
}


/* =========================================================
   SIMPAN PRODUK
   ========================================================= */

if (saveProductButton) {

    saveProductButton.addEventListener(
        "click",
        async function () {

            try {

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
                    angkaRupiah(
                        productPrice
                            ? productPrice.value
                            : ""
                    );


                const hargaPromo =
                    angkaRupiah(
                        productPricePromo
                            ? productPricePromo.value
                            : ""
                    );


                const deskripsi =
                    productDescription
                        ? productDescription.value.trim()
                        : "";


                /* -------------------------------------------------
                   VALIDASI DASAR
                   ------------------------------------------------- */

                if (!nama) {

                    alert(
                        "❌ Nama produk wajib diisi."
                    );

                    return;
                }


                if (!kategori) {

                    alert(
                        "❌ Kategori wajib dipilih."
                    );

                    return;
                }


                if (!subkategori) {

                    alert(
                        "❌ Subkategori wajib dipilih."
                    );

                    return;
                }


                if (!harga) {

                    alert(
                        "❌ Harga normal wajib diisi."
                    );

                    return;
                }


                /* -------------------------------------------------
                   VALIDASI PROMO
                   ------------------------------------------------- */

                if (
                    hargaPromo &&
                    hargaPromo >= harga
                ) {

                    alert(
                        "❌ Harga promo harus lebih rendah dari harga normal."
                    );

                    return;
                }


                /* -------------------------------------------------
                   VALIDASI WEBSITE
                   ------------------------------------------------- */

                if (
                    kategori ===
                        "Undangan" &&
                    subkategori ===
                        "Undangan Website Online"
                ) {

                    if (!website) {

                        alert(
                            "❌ Link website undangan wajib diisi."
                        );

                        return;
                    }


                    try {

                        new URL(
                            website
                        );

                    } catch (error) {

                        alert(
                            "❌ Link website tidak valid."
                        );

                        return;
                    }
                }


                /* -------------------------------------------------
                   FILE FOTO
                   ------------------------------------------------- */

                const file1 =
                    productImage &&
                    productImage.files
                        ? productImage.files[0]
                        : null;

                const file2 =
                    productImage2 &&
                    productImage2.files
                        ? productImage2.files[0]
                        : null;

                const file3 =
                    productImage3 &&
                    productImage3.files
                        ? productImage3.files[0]
                        : null;

                const file4 =
                    productImage4 &&
                    productImage4.files
                        ? productImage4.files[0]
                        : null;

                const file5 =
                    productImage5 &&
                    productImage5.files
                        ? productImage5.files[0]
                        : null;

                const file6 =
                    productImage6 &&
                    productImage6.files
                        ? productImage6.files[0]
                        : null;


                const daftarFileFoto =
                    [
                        file1,
                        file2,
                        file3,
                        file4,
                        file5,
                        file6
                    ];


                for (
                    const file
                    of daftarFileFoto
                ) {

                    if (
                        !validasiFoto(file)
                    ) {

                        return;
                    }
                }


                /* -------------------------------------------------
                   FILE VIDEO
                   ------------------------------------------------- */

                const fileVideo =
                    productVideo &&
                    productVideo.files
                        ? productVideo.files[0]
                        : null;


                if (
                    fileVideo &&
                    fileVideo.size >
                        MAX_VIDEO_SIZE
                ) {

                    alert(
                        "❌ Ukuran video maksimal 2 MB."
                    );

                    return;
                }


                /* -------------------------------------------------
                   CEK DUPLIKAT
                   ------------------------------------------------- */

                if (
                    produkDuplikat(
                        nama,
                        kategori,
                        subkategori,
                        editingProductId
                    )
                ) {

                    const lanjut =
                        confirm(
                            "⚠️ Produk dengan nama, kategori, dan subkategori yang sama sudah ada.\n\nTetap simpan?"
                        );


                    if (!lanjut) {
                        return;
                    }
                }


                /* =================================================
                   MODE EDIT
                   ================================================= */

                if (
                    editingProductId !== null
                ) {

                    const index =
                        adminProducts.findIndex(
                            function (item) {

                                return String(
                                    item.id
                                ) ===
                                    String(
                                        editingProductId
                                    );
                            }
                        );


                    if (index === -1) {

                        alert(
                            "❌ Produk yang diedit tidak ditemukan."
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


                    /* -------------------------------------------------
                       KOMPRES FOTO EDIT
                       ------------------------------------------------- */

                    if (file1) {

                        saveProductButton.textContent =
                            "⏳ Mengompres Foto 1...";

                        gambar1 =
                            await kompresFoto(
                                file1
                            );
                    }


                    if (file2) {

                        saveProductButton.textContent =
                            "⏳ Mengompres Foto 2...";

                        gambar2 =
                            await kompresFoto(
                                file2
                            );
                    }


                    if (file3) {

                        saveProductButton.textContent =
                            "⏳ Mengompres Foto 3...";

                        gambar3 =
                            await kompresFoto(
                                file3
                            );
                    }


                    if (file4) {

                        saveProductButton.textContent =
                            "⏳ Mengompres Foto 4...";

                        gambar4 =
                            await kompresFoto(
                                file4
                            );
                    }


                    if (file5) {

                        saveProductButton.textContent =
                            "⏳ Mengompres Foto 5...";

                        gambar5 =
                            await kompresFoto(
                                file5
                            );
                    }


                    if (file6) {

                        saveProductButton.textContent =
                            "⏳ Mengompres Foto 6...";

                        gambar6 =
                            await kompresFoto(
                                file6
                            );
                    }


                    /* -------------------------------------------------
                       VIDEO EDIT
                       ------------------------------------------------- */

                    if (fileVideo) {

                        saveProductButton.textContent =
                            "⏳ Memproses Video...";

                        video =
                            await bacaVideo(
                                fileVideo
                            );
                    }


                    /* -------------------------------------------------
                       PRODUK UPDATE
                       ------------------------------------------------- */

                    const produkUpdate = {

                        ...produkLama,

                        name:
                            nama,

                        category:
                            kategori,

                        subcategory:
                            subkategori,

                        website:
                            website,

                        price:
                            harga,

                        pricePromo:
                            hargaPromo,

                        description:
                            deskripsi,

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
                            video
                    };


                    const dataSementara =
                        [
                            ...adminProducts
                        ];


                    dataSementara[index] =
                        produkUpdate;


                    if (
                        !storageMasihAman(
                            dataSementara
                        )
                    ) {

                        saveProductButton.textContent =
                            "✏️ Update Produk";

                        return;
                    }


                    adminProducts =
                        dataSementara;


                    simpanProdukLocal();


                    saveProductButton.textContent =
                        "⏳ Mengirim ke GitHub...";


                    const berhasil =
                        await simpanKeGitHub();


                    if (berhasil) {

                        alert(
                            "✅ Produk berhasil diperbarui dan dikirim ke GitHub."
                        );

                        resetFormProduk();

                        tampilkanProdukAdmin();

                    } else {

                        alert(
                            "⚠️ Produk tersimpan di perangkat, tetapi gagal dikirim ke GitHub."
                        );

                        tampilkanProdukAdmin();
                    }


                    return;
                }


                /* =================================================
                   MODE TAMBAH
                   ================================================= */

                let gambar1 = "";
                let gambar2 = "";
                let gambar3 = "";
                let gambar4 = "";
                let gambar5 = "";
                let gambar6 = "";
                let video = "";


                /* -------------------------------------------------
                   FOTO 1
                   ------------------------------------------------- */

                if (file1) {

                    saveProductButton.textContent =
                        "⏳ Mengompres Foto 1...";

                    gambar1 =
                        await kompresFoto(
                            file1
                        );
                }


                /* -------------------------------------------------
                   FOTO 2
                   ------------------------------------------------- */

                if (file2) {

                    saveProductButton.textContent =
                        "⏳ Mengompres Foto 2...";

                    gambar2 =
                        await kompresFoto(
                            file2
                        );
                }


                /* -------------------------------------------------
                   FOTO 3
                   ------------------------------------------------- */

                if (file3) {

                    saveProductButton.textContent =
                        "⏳ Mengompres Foto 3...";

                    gambar3 =
                        await kompresFoto(
                            file3
                        );
                }


                /* -------------------------------------------------
                   FOTO 4
                   ------------------------------------------------- */

                if (file4) {

                    saveProductButton.textContent =
                        "⏳ Mengompres Foto 4...";

                    gambar4 =
                        await kompresFoto(
                            file4
                        );
                }


                /* -------------------------------------------------
                   FOTO 5
                   ------------------------------------------------- */

                if (file5) {

                    saveProductButton.textContent =
                        "⏳ Mengompres Foto 5...";

                    gambar5 =
                        await kompresFoto(
                            file5
                        );
                }


                /* -------------------------------------------------
                   FOTO 6
                   ------------------------------------------------- */

                if (file6) {

                    saveProductButton.textContent =
                        "⏳ Mengompres Foto 6...";

                    gambar6 =
                        await kompresFoto(
                            file6
                        );
                }


                /* -------------------------------------------------
                   VIDEO
                   ------------------------------------------------- */

                if (fileVideo) {

                    saveProductButton.textContent =
                        "⏳ Memproses Video...";

                    video =
                        await bacaVideo(
                            fileVideo
                        );
                }


                /* -------------------------------------------------
                   PRODUK BARU
                   ------------------------------------------------- */

                const produkBaru = {

                    id:
                        Date.now(),

                    name:
                        nama,

                    category:
                        kategori,

                    subcategory:
                        subkategori,

                    website:
                        website,

                    price:
                        harga,

                    pricePromo:
                        hargaPromo,

                    description:
                        deskripsi,

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
                        video
                };


                const dataBaru =
                    [
                        ...adminProducts,
                        produkBaru
                    ];


                if (
                    !storageMasihAman(
                        dataBaru
                    )
                ) {

                    saveProductButton.textContent =
                        "💾 Simpan Produk";

                    return;
                }


                adminProducts =
                    dataBaru;


                simpanProdukLocal();


                saveProductButton.textContent =
                    "⏳ Mengirim ke GitHub...";


                const berhasil =
                    await simpanKeGitHub();


                if (berhasil) {

                    alert(
                        "✅ Produk berhasil ditambahkan dan dikirim ke GitHub."
                    );

                } else {

                    alert(
                        "⚠️ Produk tersimpan di perangkat, tetapi gagal dikirim ke GitHub."
                    );
                }


                resetFormProduk();

                tampilkanProdukAdmin();


            } catch (error) {

                console.error(
                    "ERROR SIMPAN PRODUK:",
                    error
                );


                alert(
                    "❌ Terjadi kesalahan:\n\n" +
                    error.message
                );


                if (saveProductButton) {

                    saveProductButton.textContent =
                        editingProductId !== null
                            ? "✏️ Update Produk"
                            : "💾 Simpan Produk";
                }
            }
        }
    );
}


/* =========================================================
   KIRIM DATA KE CLOUDFLARE WORKER
   ========================================================= */

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


        const text =
            await response.text();


        let data = {};


        try {

            data =
                JSON.parse(text);

        } catch (error) {

            data = {
                message: text
            };
        }


        if (!response.ok) {

            console.error(
                "GitHub Worker Error:",
                data
            );

            return false;
        }


        console.log(
            "✅ Produk berhasil dikirim:",
            data
        );


        return true;


    } catch (error) {

        console.error(
            "❌ Gagal terhubung Worker:",
            error
        );

        return false;
    }
}


/* =========================================================
   TAMPILKAN PRODUK ADMIN
   ========================================================= */

function tampilkanProdukAdmin(
    data = adminProducts
) {

    if (!adminProductList) {
        return;
    }


    adminProductList.innerHTML =
        "";


    if (!data.length) {

        adminProductList.innerHTML =
            `
            <div style="
                padding:20px;
                text-align:center;
                color:#777;
            ">
                Belum ada produk.
            </div>
            `;

        updateStatistik();

        return;
    }


    data.forEach(
        function (product) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "admin-product-item";


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


            const hargaNormal =
                formatRupiah(
                    product.price
                );


            const hargaPromo =
                formatRupiah(
                    product.pricePromo
                );


            let hargaHTML =
                "";


            if (
                product.pricePromo &&
                product.pricePromo <
                    product.price
            ) {

                hargaHTML =
                    `
                    <div>
                        <span style="
                            text-decoration:line-through;
                            color:#999;
                        ">
                            Rp ${hargaNormal}
                        </span>

                        <br>

                        <strong style="
                            color:#d60000;
                            font-size:17px;
                        ">
                            Rp ${hargaPromo}
                        </strong>
                    </div>
                    `;

            } else {

                hargaHTML =
                    `
                    <strong>
                        Rp ${hargaNormal}
                    </strong>
                    `;
            }


            const fotoPertama =
                product.image ||
                product.image2 ||
                product.image3 ||
                product.image4 ||
                product.image5 ||
                product.image6 ||
                "";


            let mediaHTML =
                "";


            if (fotoPertama) {

                mediaHTML =
                    `
                    <img
                        src="${fotoPertama}"
                        alt="${escapeHTML(
                            product.name ||
                            ""
                        )}"
                        style="
                            width:80px;
                            height:80px;
                            object-fit:cover;
                            border-radius:10px;
                        "
                    >
                    `;

            } else {

                mediaHTML =
                    `
                    <div style="
                        width:80px;
                        height:80px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background:#f1f1f1;
                        border-radius:10px;
                        font-size:12px;
                        color:#999;
                    ">
                        Tanpa Foto
                    </div>
                    `;
            }


            item.innerHTML =
                `
                <div style="
                    display:flex;
                    gap:12px;
                    align-items:center;
                ">

                    ${mediaHTML}

                    <div style="
                        flex:1;
                        min-width:0;
                    ">

                        <div style="
                            font-weight:700;
                            margin-bottom:4px;
                        ">
                            ${escapeHTML(
                                product.name ||
                                ""
                            )}
                        </div>

                        <div style="
                            font-size:13px;
                            color:#777;
                            margin-bottom:5px;
                        ">
                            ${escapeHTML(
                                product.category ||
                                ""
                            )}
                            -
                            ${escapeHTML(
                                product.subcategory ||
                                ""
                            )}
                        </div>

                        ${hargaHTML}

                        <div style="
                            font-size:12px;
                            color:#777;
                            margin-top:4px;
                        ">
                            📷 ${jumlahFoto} Foto
                            ${product.video
                                ? " • 🎥 Video"
                                : ""}
                        </div>

                    </div>

                    <div style="
                        display:flex;
                        gap:5px;
                        flex-wrap:wrap;
                    ">

                        <button
                            type="button"
                            onclick="editProduk('${String(
                                product.id
                            ).replace(/'/g, "\\'")}')"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            onclick="hapusProduk('${String(
                                product.id
                            ).replace(/'/g, "\\'")}')"
                        >
                            🗑️
                        </button>

                    </div>

                </div>
                `;


            adminProductList.appendChild(
                item
            );
        }
    );


    updateStatistik();
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(
        value || ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );
}


/* =========================================================
   HAPUS PRODUK
   ========================================================= */

async function hapusProduk(id) {

    const product =
        adminProducts.find(
            function (item) {

                return String(item.id) ===
                    String(id);
            }
        );


    if (!product) {

        alert(
            "❌ Produk tidak ditemukan."
        );

        return;
    }


    const yakin =
        confirm(
            "Hapus produk:\n\n" +
            (
                product.name ||
                ""
            ) +
            "\n\nProduk akan dihapus dari perangkat dan GitHub."
        );


    if (!yakin) {
        return;
    }


    const dataLama =
        [...adminProducts];


    adminProducts =
        adminProducts.filter(
            function (item) {

                return String(item.id) !==
                    String(id);
            }
        );


    if (
        !storageMasihAman(
            adminProducts
        )
    ) {

        adminProducts =
            dataLama;

        return;
    }


    simpanProdukLocal();


    const berhasil =
        await simpanKeGitHub();


    if (berhasil) {

        alert(
            "✅ Produk berhasil dihapus."
        );

    } else {

        alert(
            "⚠️ Produk terhapus dari perangkat, tetapi gagal mengirim perubahan ke GitHub."
        );
    }


    tampilkanProdukAdmin();
}


/* =========================================================
   PENCARIAN
   ========================================================= */

if (adminSearchInput) {

    adminSearchInput.addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .trim()
                    .toLowerCase();


            if (!keyword) {

                tampilkanProdukAdmin();

                return;
            }


            const hasil =
                adminProducts.filter(
                    function (product) {

                        const teks =
                            [
                                product.name,
                                product.category,
                                product.subcategory,
                                product.description
                            ]
                            .join(" ")
                            .toLowerCase();


                        return teks.includes(
                            keyword
                        );
                    }
                );


            tampilkanProdukAdmin(
                hasil
            );
        }
    );
}


/* =========================================================
   STATISTIK
   ========================================================= */

function updateStatistik() {

    const total =
        adminProducts.length;


    const foto =
        adminProducts.filter(
            function (product) {

                return [
                    product.image,
                    product.image2,
                    product.image3,
                    product.image4,
                    product.image5,
                    product.image6
                ]
                .some(Boolean);
            }
        ).length;


    const kategori =
        new Set(
            adminProducts
                .map(
                    function (product) {

                        return product.category;
                    }
                )
                .filter(Boolean)
        ).size;


    if (productCount) {

        productCount.textContent =
            total;
    }


    if (statTotalProduk) {

        statTotalProduk.textContent =
            total;
    }


    if (statProdukFoto) {

        statProdukFoto.textContent =
            foto;
    }


    if (statKategori) {

        statKategori.textContent =
            kategori;
    }
}


/* =========================================================
   BACKUP PRODUK
   ========================================================= */

if (backupProductButton) {

    backupProductButton.addEventListener(
        "click",
        function () {

            const data = {

                exportedAt:
                    new Date()
                        .toISOString(),

                products:
                    adminProducts,

                kategori:
                    kategoriData
            };


            const blob =
                new Blob(
                    [
                        JSON.stringify(
                            data,
                            null,
                            2
                        )
                    ],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const a =
                document.createElement(
                    "a"
                );


            a.href =
                url;

            a.download =
                "rona-backup-" +
                new Date()
                    .toISOString()
                    .slice(
                        0,
                        10
                    ) +
                ".json";


            a.click();


            URL.revokeObjectURL(
                url
            );
        }
    );
}


/* =========================================================
   RESTORE PRODUK
   ========================================================= */

if (restoreProductButton) {

    restoreProductButton.addEventListener(
        "click",
        function () {

            if (restoreProductInput) {

                restoreProductInput.click();
            }
        }
    );
}


if (restoreProductInput) {

    restoreProductInput.addEventListener(
        "change",
        async function () {

            const file =
                this.files[0];


            if (!file) {
                return;
            }


            try {

                const text =
                    await file.text();


                const data =
                    JSON.parse(text);


                let produkRestore =
                    null;


                if (
                    Array.isArray(
                        data
                    )
                ) {

                    produkRestore =
                        data;

                } else if (
                    data &&
                    Array.isArray(
                        data.products
                    )
                ) {

                    produkRestore =
                        data.products;
                }


                if (
                    !produkRestore
                ) {

                    alert(
                        "❌ File backup tidak memiliki data products yang valid."
                    );

                    return;
                }


                produkRestore =
                    produkRestore
                        .map(
                            normalisasiProduk
                        )
                        .filter(Boolean);


                const yakin =
                    confirm(
                        "Restore akan mengganti semua produk yang sekarang.\n\nJumlah produk backup: " +
                        produkRestore.length +
                        "\n\nLanjutkan?"
                    );


                if (!yakin) {
                    return;
                }


                if (
                    !storageMasihAman(
                        produkRestore
                    )
                ) {

                    return;
                }


                adminProducts =
                    produkRestore;


                if (
                    data.kategori &&
                    typeof data.kategori ===
                        "object"
                ) {

                    kategoriData =
                        data.kategori;

                    simpanKategori();

                    renderKategoriSelect();
                }


                simpanProdukLocal();


                const berhasil =
                    await simpanKeGitHub();


                tampilkanProdukAdmin();


                if (berhasil) {

                    alert(
                        "✅ Backup berhasil dipulihkan dan dikirim ke GitHub."
                    );

                } else {

                    alert(
                        "⚠️ Backup berhasil dipulihkan di perangkat, tetapi gagal dikirim ke GitHub."
                    );
                }


            } catch (error) {

                console.error(
                    "Restore error:",
                    error
                );


                alert(
                    "❌ File backup tidak valid."
                );

            } finally {

                this.value =
                    "";
            }
        }
    );
}


/* =========================================================
   KOMPRES SEMUA FOTO LAMA
   ========================================================= */

async function kompresProdukLama() {

    if (!adminProducts.length) {

        alert(
            "Belum ada produk."
        );

        return;
    }


    const yakin =
        confirm(
            "Kompres semua foto produk?\n\nFoto 1-6 akan diproses ulang agar ukuran penyimpanan lebih kecil."
        );


    if (!yakin) {
        return;
    }


    if (compressProductsButton) {

        compressProductsButton.disabled =
            true;

        compressProductsButton.textContent =
            "⏳ Mengompres...";
    }


    try {

        let jumlah =
            0;


        for (
            let i = 0;
            i < adminProducts.length;
            i++
        ) {

            const product =
                adminProducts[i];


            const daftarFoto =
                [
                    "image",
                    "image2",
                    "image3",
                    "image4",
                    "image5",
                    "image6"
                ];


            for (
                const field
                of daftarFoto
            ) {

                const src =
                    product[field];


                if (
                    !src ||
                    !src.startsWith(
                        "data:image"
                    )
                ) {

                    continue;
                }


                try {

                    const blob =
                        await fetch(
                            src
                        ).then(
                            function (res) {
                                return res.blob();
                            }
                        );


                    const file =
                        new File(
                            [
                                blob
                            ],
                            field +
                            ".jpg",
                            {
                                type:
                                    "image/jpeg"
                            }
                        );


                    product[field] =
                        await kompresFoto(
                            file
                        );


                    jumlah++;

                } catch (error) {

                    console.warn(
                        "Gagal kompres:",
                        field,
                        error
                    );
                }
            }
        }


        if (
            !storageMasihAman(
                adminProducts
            )
        ) {

            return;
        }


        simpanProdukLocal();


        const berhasil =
            await simpanKeGitHub();


        tampilkanProdukAdmin();


        if (berhasil) {

            alert(
                "✅ Kompresi selesai.\n\n" +
                jumlah +
                " foto berhasil diproses dan perubahan dikirim ke GitHub."
            );

        } else {

            alert(
                "⚠️ Kompresi selesai dan tersimpan di perangkat, tetapi gagal dikirim ke GitHub."
            );
        }


    } catch (error) {

        console.error(
            "Kompres error:",
            error
        );


        alert(
            "❌ Gagal melakukan kompresi."
        );

    } finally {

        if (compressProductsButton) {

            compressProductsButton.disabled =
                false;

            compressProductsButton.textContent =
                "🗜️ Kompres Foto";
        }
    }
}


if (compressProductsButton) {

    compressProductsButton.addEventListener(
        "click",
        kompresProdukLama
    );
}


/* =========================================================
   EXPORT PRODUCTS.JSON
   ========================================================= */

if (exportProductsButton) {

    exportProductsButton.addEventListener(
        "click",
        function () {

            const products =
                adminProducts.map(
                    function (product) {

                        const hasil =
                            {
                                ...product
                            };

                        delete hasil.promoPrice;

                        return hasil;
                    }
                );


            const data = {

                products:
                    products
            };


            const blob =
                new Blob(
                    [
                        JSON.stringify(
                            data,
                            null,
                            2
                        )
                    ],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const a =
                document.createElement(
                    "a"
                );


            a.href =
                url;

            a.download =
                "products.json";


            document.body.appendChild(
                a
            );

            a.click();

            a.remove();


            URL.revokeObjectURL(
                url
            );


            alert(
                "✅ products.json berhasil dibuat."
            );
        }
    );
}


/* =========================================================
   KELOLA KATEGORI
   TAMBAH / EDIT / HAPUS KATEGORI & SUBKATEGORI
   ========================================================= */


/* =========================================================
   TAMBAH KATEGORI / SUBKATEGORI
   ========================================================= */

if (addCategoryButton) {

    addCategoryButton.addEventListener(
        "click",
        function () {

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
                    "❌ Nama kategori wajib diisi."
                );

                return;
            }


            /* =================================================
               CEK KATEGORI BARU
               ================================================= */

            if (
                !kategoriData[kategori]
            ) {

                kategoriData[kategori] =
                    [];

            }


            /* =================================================
               TAMBAH SUBKATEGORI
               ================================================= */

            if (subkategori) {

                if (
                    kategoriData[kategori]
                        .includes(subkategori)
                ) {

                    alert(
                        "⚠️ Subkategori tersebut sudah ada."
                    );

                    return;
                }


                kategoriData[kategori]
                    .push(
                        subkategori
                    );

            }


            /* =================================================
               SIMPAN
               ================================================= */

            simpanKategori();

            renderKategoriSelect();

            tampilkanDaftarKategori();


            if (newCategory) {

                newCategory.value =
                    "";

            }


            if (newSubcategory) {

                newSubcategory.value =
                    "";

            }


            alert(
                "✅ Kategori berhasil disimpan."
            );

        }
    );

}


/* =========================================================
   EDIT KATEGORI
   ========================================================= */

function editKategori(
    namaLama
) {

    const namaBaru =
        prompt(
            "✏️ Edit nama kategori:",
            namaLama
        );


    if (
        namaBaru === null
    ) {

        return;

    }


    const hasil =
        namaBaru.trim();


    if (!hasil) {

        alert(
            "❌ Nama kategori tidak boleh kosong."
        );

        return;
    }


    if (
        hasil === namaLama
    ) {

        return;
    }


    if (
        kategoriData[hasil]
    ) {

        alert(
            "❌ Kategori dengan nama tersebut sudah ada."
        );

        return;
    }


    /* =================================================
       SIMPAN SUBKATEGORI LAMA
       ================================================= */

    kategoriData[hasil] =
        kategoriData[namaLama] ||
        [];


    delete kategoriData[namaLama];


    /* =================================================
       UPDATE PRODUK YANG MEMAKAI KATEGORI LAMA
       ================================================= */

    let jumlahProduk =
        0;


    adminProducts.forEach(
        function (product) {

            if (
                String(
                    product.category ||
                    ""
                ) ===
                String(namaLama)
            ) {

                product.category =
                    hasil;

                jumlahProduk++;

            }

        }
    );


    simpanKategori();

    simpanProdukLocal();


    renderKategoriSelect();

    tampilkanDaftarKategori();

    tampilkanProdukAdmin();


    /* =================================================
       KIRIM PERUBAHAN PRODUK KE GITHUB
       ================================================= */

    if (
        jumlahProduk > 0
    ) {

        simpanKeGitHub()
            .then(
                function (berhasil) {

                    if (berhasil) {

                        console.log(
                            "✅ Perubahan kategori dan produk berhasil dikirim ke GitHub."
                        );

                    } else {

                        console.warn(
                            "⚠️ Kategori berubah di perangkat, tetapi gagal mengirim produk ke GitHub."
                        );

                    }

                }
            );

    }


    alert(
        "✅ Kategori berhasil diubah."
    );

}


/* =========================================================
   HAPUS KATEGORI
   ========================================================= */

function hapusKategori(
    namaKategori
) {

    const jumlahProduk =
        adminProducts.filter(
            function (product) {

                return String(
                    product.category ||
                    ""
                ) ===
                String(
                    namaKategori
                );

            }
        ).length;


    let pesan =
        "⚠️ Hapus kategori:\n\n" +
        namaKategori +
        "\n\n";


    if (
        jumlahProduk > 0
    ) {

        pesan +=
            "Kategori ini sedang dipakai oleh " +
            jumlahProduk +
            " produk.\n\n" +
            "Jika dihapus, produk tersebut akan tetap ada tetapi kategorinya menjadi kosong.\n\n";

    }


    pesan +=
        "Yakin ingin menghapus?";


    const yakin =
        confirm(
            pesan
        );


    if (!yakin) {

        return;

    }


    /* =================================================
       KOSONGKAN KATEGORI PRODUK
       ================================================= */

    if (
        jumlahProduk > 0
    ) {

        adminProducts.forEach(
            function (product) {

                if (
                    String(
                        product.category ||
                        ""
                    ) ===
                    String(
                        namaKategori
                    )
                ) {

                    product.category =
                        "";

                    product.subcategory =
                        "";

                }

            }
        );

    }


    /* =================================================
       HAPUS KATEGORI
       ================================================= */

    delete kategoriData[
        namaKategori
    ];


    simpanKategori();

    simpanProdukLocal();


    renderKategoriSelect();

    tampilkanDaftarKategori();

    tampilkanProdukAdmin();


    /* =================================================
       SINKRONISASI GITHUB
       ================================================= */

    if (
        jumlahProduk > 0
    ) {

        simpanKeGitHub();

    }


    alert(
        "✅ Kategori berhasil dihapus."
    );

}


/* =========================================================
   EDIT SUBKATEGORI
   ========================================================= */

function editSubkategori(
    namaKategori,
    namaSubkategori
) {

    const namaBaru =
        prompt(
            "✏️ Edit nama subkategori:",
            namaSubkategori
        );


    if (
        namaBaru === null
    ) {

        return;

    }


    const hasil =
        namaBaru.trim();


    if (!hasil) {

        alert(
            "❌ Nama subkategori tidak boleh kosong."
        );

        return;
    }


    if (
        hasil === namaSubkategori
    ) {

        return;
    }


    if (
        !kategoriData[namaKategori]
    ) {

        alert(
            "❌ Kategori tidak ditemukan."
        );

        return;
    }


    if (
        kategoriData[namaKategori]
            .includes(hasil)
    ) {

        alert(
            "❌ Subkategori dengan nama tersebut sudah ada."
        );

        return;
    }


    /* =================================================
       GANTI NAMA SUBKATEGORI
       ================================================= */

    const index =
        kategoriData[namaKategori]
            .indexOf(
                namaSubkategori
            );


    if (
        index === -1
    ) {

        alert(
            "❌ Subkategori tidak ditemukan."
        );

        return;
    }


    kategoriData[namaKategori]
        [index] =
        hasil;


    /* =================================================
       UPDATE PRODUK
       ================================================= */

    let jumlahProduk =
        0;


    adminProducts.forEach(
        function (product) {

            if (
                String(
                    product.category ||
                    ""
                ) ===
                String(
                    namaKategori
                ) &&
                String(
                    product.subcategory ||
                    ""
                ) ===
                String(
                    namaSubkategori
                )
            ) {

                product.subcategory =
                    hasil;

                jumlahProduk++;

            }

        }
    );


    simpanKategori();

    simpanProdukLocal();


    renderKategoriSelect();

    tampilkanDaftarKategori();

    tampilkanProdukAdmin();


    /* =================================================
       SINKRONISASI GITHUB
       ================================================= */

    if (
        jumlahProduk > 0
    ) {

        simpanKeGitHub()
            .then(
                function (berhasil) {

                    if (berhasil) {

                        console.log(
                            "✅ Perubahan subkategori berhasil dikirim ke GitHub."
                        );

                    }

                }
            );

    }


    alert(
        "✅ Subkategori berhasil diubah."
    );

}


/* =========================================================
   HAPUS SUBKATEGORI
   ========================================================= */

function hapusSubkategori(
    namaKategori,
    namaSubkategori
) {

    if (
        !kategoriData[namaKategori]
    ) {

        alert(
            "❌ Kategori tidak ditemukan."
        );

        return;
    }


    const jumlahProduk =
        adminProducts.filter(
            function (product) {

                return (
                    String(
                        product.category ||
                        ""
                    ) ===
                    String(
                        namaKategori
                    )
                    &&
                    String(
                        product.subcategory ||
                        ""
                    ) ===
                    String(
                        namaSubkategori
                    )
                );

            }
        ).length;


    let pesan =
        "⚠️ Hapus subkategori:\n\n" +
        namaSubkategori +
        "\n\n";


    if (
        jumlahProduk > 0
    ) {

        pesan +=
            "Subkategori ini sedang dipakai oleh " +
            jumlahProduk +
            " produk.\n\n" +
            "Jika dihapus, subkategori produk tersebut akan dikosongkan.\n\n";

    }


    pesan +=
        "Yakin ingin menghapus?";


    const yakin =
        confirm(
            pesan
        );


    if (!yakin) {

        return;

    }


    /* =================================================
       HAPUS DARI DATA KATEGORI
       ================================================= */

    kategoriData[namaKategori] =
        kategoriData[namaKategori]
            .filter(
                function (sub) {

                    return sub !==
                        namaSubkategori;

                }
            );


    /* =================================================
       UPDATE PRODUK
       ================================================= */

    if (
        jumlahProduk > 0
    ) {

        adminProducts.forEach(
            function (product) {

                if (
                    String(
                        product.category ||
                        ""
                    ) ===
                    String(
                        namaKategori
                    ) &&
                    String(
                        product.subcategory ||
                        ""
                    ) ===
                    String(
                        namaSubkategori
                    )
                ) {

                    product.subcategory =
                        "";

                }

            }
        );

    }


    simpanKategori();

    simpanProdukLocal();


    renderKategoriSelect();

    tampilkanDaftarKategori();

    tampilkanProdukAdmin();


    /* =================================================
       SINKRONISASI GITHUB
       ================================================= */

    if (
        jumlahProduk > 0
    ) {

        simpanKeGitHub();

    }


    alert(
        "✅ Subkategori berhasil dihapus."
    );

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


            // ====================================================
            // HEADER KATEGORI
            // ====================================================

            const header =
                document.createElement("div");

            header.className =
                "admin-category-header";


            // NAMA KATEGORI
            const judul =
                document.createElement("h3");

            judul.textContent =
                kategori;


            // ====================================================
            // TOMBOL KATEGORI
            // ====================================================

            const tombolKategori =
                document.createElement("div");

            tombolKategori.className =
                "admin-category-actions";


            // TOMBOL EDIT KATEGORI
            const tombolEditKategori =
                document.createElement("button");

            tombolEditKategori.type =
                "button";

            tombolEditKategori.textContent =
                "✏️";

            tombolEditKategori.className =
                "edit-category-button";


            // TOMBOL HAPUS KATEGORI
            const tombolHapusKategori =
                document.createElement("button");

            tombolHapusKategori.type =
                "button";

            tombolHapusKategori.textContent =
                "🗑️";

            tombolHapusKategori.className =
                "delete-category-button";


            tombolKategori.appendChild(
                tombolEditKategori
            );

            tombolKategori.appendChild(
                tombolHapusKategori
            );


            header.appendChild(
                judul
            );

            header.appendChild(
                tombolKategori
            );

            box.appendChild(
                header
            );


            // ====================================================
            // EDIT KATEGORI
            // ====================================================

            tombolEditKategori.addEventListener(
                "click",
                function() {

                    const namaBaru =
                        prompt(
                            "Edit nama kategori:",
                            kategori
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
                            "Nama kategori tidak boleh kosong."
                        );

                        return;
                    }


                    // CEK DUPLIKAT KATEGORI
                    const duplikat =
                        Object.keys(
                            subkategoriAdmin
                        ).some(
                            function(item) {

                                return (
                                    item !== kategori &&
                                    item.toLowerCase() ===
                                    hasil.toLowerCase()
                                );

                            }
                        );

                    if (duplikat) {

                        alert(
                            "Kategori tersebut sudah ada."
                        );

                        return;
                    }


                    // SIMPAN SUBKATEGORI LAMA
                    subkategoriAdmin[
                        hasil
                    ] =
                        subkategoriAdmin[
                            kategori
                        ];


                    // HAPUS KATEGORI LAMA
                    delete subkategoriAdmin[
                        kategori
                    ];


                    // SIMPAN
                    simpanKategori();


                    // REFRESH
                    perbaruiPilihanKategori();

                    tampilkanDaftarKategori();

                    tampilkanSubkategoriAdmin();


                    alert(
                        "✅ Nama kategori berhasil diubah."
                    );

                }
            );


            // ====================================================
            // HAPUS KATEGORI
            // ====================================================

            tombolHapusKategori.addEventListener(
                "click",
                function() {

                    const daftarSubkategori =
                        Array.isArray(
                            subkategoriAdmin[
                                kategori
                            ]
                        )
                            ? subkategoriAdmin[
                                kategori
                            ]
                            : [];


                    let pesan =
                        'Hapus kategori "' +
                        kategori +
                        '"?';


                    if (
                        daftarSubkategori.length
                    ) {

                        pesan +=
                            "\n\nKategori ini memiliki " +
                            daftarSubkategori.length +
                            " subkategori.";

                        pesan +=
                            "\nSemua subkategori juga akan dihapus.";
                    }


                    const yakin =
                        confirm(
                            pesan
                        );

                    if (!yakin) {
                        return;
                    }


                    // HAPUS KATEGORI
                    delete subkategoriAdmin[
                        kategori
                    ];


                    // SIMPAN
                    simpanKategori();


                    // REFRESH
                    perbaruiPilihanKategori();

                    tampilkanDaftarKategori();

                    tampilkanSubkategoriAdmin();


                    alert(
                        "✅ Kategori berhasil dihapus."
                    );

                }
            );


            // ====================================================
            // DAFTAR SUBKATEGORI
            // ====================================================

            const daftar =
                Array.isArray(
                    subkategoriAdmin[
                        kategori
                    ]
                )
                    ? subkategoriAdmin[
                        kategori
                    ]
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


                    // NAMA SUBKATEGORI
                    const nama =
                        document.createElement("span");

                    nama.textContent =
                        subkategori;


                    // =================================================
                    // TOMBOL SUBKATEGORI
                    // =================================================

                    const tombolBox =
                        document.createElement("div");


                    // TOMBOL EDIT SUBKATEGORI
                    const tombolEdit =
                        document.createElement("button");

                    tombolEdit.type =
                        "button";

                    tombolEdit.textContent =
                        "✏️";

                    tombolEdit.className =
                        "edit-subcategory-button";


                    // TOMBOL HAPUS SUBKATEGORI
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


                    // =================================================
                    // EDIT SUBKATEGORI
                    // =================================================

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


                            // CEK DUPLIKAT
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


                            // UBAH NAMA
                            subkategoriAdmin[
                                kategori
                            ][index] =
                                hasil;


                            // SIMPAN
                            simpanKategori();


                            // REFRESH
                            tampilkanDaftarKategori();

                            tampilkanSubkategoriAdmin();

                        }
                    );


                    // =================================================
                    // HAPUS SUBKATEGORI
                    // =================================================

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


                            // HAPUS
                            subkategoriAdmin[
                                kategori
                            ].splice(
                                index,
                                1
                            );


                            // SIMPAN
                            simpanKategori();


                            // REFRESH
                            tampilkanDaftarKategori();

                            tampilkanSubkategoriAdmin();

                        }
                    );


                    box.appendChild(
                        baris
                    );

                }
            );


            // MASUKKAN KATEGORI KE LIST
            adminCategoryList.appendChild(
                box
            );

        }
    );

}

/* =========================================================
   LOAD PRODUCTS.JSON
   ========================================================= */

async function muatProdukAwalAdmin() {

    try {

        const response =
            await fetch(
                "products.json?ts=" +
                Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status
            );
        }


        const data =
            await response.json();


        let products =
            data.products ||
            data;


        if (
            !Array.isArray(
                products
            )
        ) {

            throw new Error(
                "Format products.json tidak valid."
            );
        }


        products =
            products
                .map(
                    normalisasiProduk
                )
                .filter(Boolean);


        if (
            products.length
        ) {

            adminProducts =
                products;

            simpanProdukLocal();
        }


        console.log(
            "Produk berhasil dimuat dari GitHub:",
            adminProducts
        );


    } catch (error) {

        console.warn(
            "Tidak bisa mengambil products.json:",
            error
        );

        /*
         * Jika gagal mengambil products.json,
         * tetap gunakan localStorage.
         */
    }


    tampilkanProdukAdmin();
}


/* =========================================================
   CEK UKURAN FOTO
   ========================================================= */

function tampilkanUkuranFoto(file) {

    if (!imageSizeInfo) {
        return;
    }


    if (!file) {

        imageSizeInfo.textContent =
            "";

        return;
    }


    const ukuranMB =
        file.size /
        (1024 * 1024);


    imageSizeInfo.textContent =
        "Ukuran asli: " +
        ukuranMB.toFixed(2) +
        " MB • Setelah kompresi akan lebih kecil.";
}


/* =========================================================
   EVENT UKURAN FOTO
   ========================================================= */

[
    productImage,
    productImage2,
    productImage3,
    productImage4,
    productImage5,
    productImage6
]
.forEach(
    function (input) {

        if (!input) {
            return;
        }


        input.addEventListener(
            "change",
            function () {

                tampilkanUkuranFoto(
                    this.files[0]
                );
            }
        );
    }
);


/* =========================================================
   DEBUG INFO
   ========================================================= */

console.log(
    "=========================================="
);

console.log(
    "✅ RONA CREATION Admin aktif."
);

console.log(
    "📷 Sistem foto: 6"
);

console.log(
    "🎥 Sistem video: 1"
);

console.log(
    "💰 Promo price: manual"
);

console.log(
    "☁️ Cloudflare Worker:",
    API_URL
);

console.log(
    "=========================================="
);


/* =========================================================
   INISIALISASI
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        muatKategori();

        renderKategoriSelect();

        tampilkanDaftarKategori();

        muatProdukLocal();

        muatProdukAwalAdmin();

        resetFormProduk();

    }
);
