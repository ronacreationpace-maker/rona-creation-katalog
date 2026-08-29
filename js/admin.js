// =========================
// ADMIN KATALOG
// =========================

// =========================
// CLOUDFLARE WORKER
// =========================

const API_URL =
    "https://rona-katalog-api.ronacreation-pace.workers.dev";

const ADMIN_KEY =
    "ronaadmin080888";


// =========================
// ELEMENT
// =========================

const productImage =
    document.getElementById("productImage");

const imagePreview =
    document.getElementById("imagePreview");

// =========================
// INFO UKURAN FOTO
// =========================

const imageSizeInfo =
    document.getElementById(
        "imageSizeInfo"
    );

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
    document.getElementById(
        "backupProductButton");

const compressProductsButton =
    document.getElementById(
    "compressProductsButton");

const restoreProductButton =
    document.getElementById(
        "restoreProductButton"
    );

const restoreProductInput =
    document.getElementById(
        "restoreProductInput"
    );

const adminSearchInput =
    document.getElementById(
        "adminSearchInput"
    );

    const statTotalProduk =
    document.getElementById(
        "statTotalProduk"
    );

const statProdukFoto =
    document.getElementById(
        "statProdukFoto"
    );

const statKategori =
    document.getElementById(
        "statKategori"
    );

// =========================
// KONEKSI CLOUDFLARE WORKER
// =========================

const WORKER_URL =
    "https://rona-katalog-api.ronacreation-pace.workers.dev/";


// =========================
// DATA PRODUK ADMIN
// =========================

let adminProducts =
    JSON.parse(
        localStorage.getItem("ronaProducts")
    ) || [];

// =========================
// SIMPAN PRODUK KE GITHUB
// =========================

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


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "Gagal simpan ke GitHub:",
                data
            );

            throw new Error(
                data.error ||
                "Gagal menyimpan ke GitHub."
            );

        }


        console.log(
            "GitHub berhasil diperbarui:",
            data
        );


        return true;


    } catch (error) {

        console.error(
            "Error simpan GitHub:",
            error
        );

        alert(
            "Produk tersimpan di HP, tetapi gagal dikirim ke GitHub.\n\n" +
            error.message
        );

        return false;

    }

}

// =========================
// AMBIL PRODUK DARI GITHUB
// JIKA ADMIN MASIH KOSONG
// =========================

async function muatProdukAwalAdmin() {

    // Kalau sudah ada data Admin,
    // gunakan data tersebut
    if (adminProducts.length > 0) {

        console.log(
            "Produk Admin dari localStorage:",
            adminProducts
        );

        EXPORT PRODUCTS.JSON();
        updateStatistikAdmin();

        return;
    }


    try {

        const response =
            await fetch("products.json");

        if (!response.ok) {

            throw new Error(
                "products.json tidak ditemukan"
            );

        }


        const data =
            await response.json();


        const produkDariGithub =
            data.products || data;


        if (
            !Array.isArray(
                produkDariGithub
            )
        ) {

            throw new Error(
                "Format products.json tidak valid"
            );

        }


        // Masukkan produk GitHub
        // ke data Admin

        adminProducts =
            produkDariGithub;


        localStorage.setItem(
            "ronaProducts",
            JSON.stringify(
                adminProducts
            )
        );


        console.log(
            "Produk dari GitHub berhasil dimuat ke Admin:",
            adminProducts
        );


        EXPORT PRODUCTS.JSON();

        updateStatistikAdmin();


    } catch (error) {

        console.error(
            "Gagal memuat produk dari GitHub:",
            error
        );


        EXPORT PRODUCTS.JSON();

        updateStatistikAdmin();

    }

}


// Jalankan saat Admin dibuka

muatProdukAwalAdmin();

// =========================
// DATA SUBKATEGORI ADMIN
// =========================

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

    "Lainnya": [
        "Yasin",
        "Banner",
        "Stiker",
        "Buket"
    ]

};


// =========================
// TAMPILKAN SUBKATEGORI
// SESUAI KATEGORI
// =========================

function tampilkanSubkategoriAdmin(
    nilaiTerpilih = ""
) {

    if (!productSubcategory) {
        return;
    }

    const kategori =
        productCategory.value;

    // Kosongkan pilihan lama
    productSubcategory.innerHTML = `
        <option value="">
            Pilih subkategori
        </option>
    `;

    // Ambil subkategori sesuai kategori
    const daftar =
        subkategoriAdmin[kategori] || [];

    // Buat pilihan
    daftar.forEach(subkategori => {

        const option =
            document.createElement("option");

        option.value =
            subkategori;

        option.textContent =
            subkategori;

        if (
            subkategori === nilaiTerpilih
        ) {

            option.selected = true;

        }

        productSubcategory.appendChild(
            option
        );

    });

}

// =========================
// TAMPILKAN LINK WEBSITE
// =========================

function tampilkanFieldWebsite() {

    if (!websiteLinkGroup) {
        return;
    }

    if (
        productCategory.value === "Undangan" &&
        productSubcategory.value ===
        "Undangan Website Online"
    ) {

        websiteLinkGroup.style.display = "block";

    } else {

        websiteLinkGroup.style.display = "none";

        if (productWebsite) {
            productWebsite.value = "";
        }

    }

}

// =========================
// KATEGORI BERUBAH
// =========================

productCategory.addEventListener(
    "change",
    () => {

        tampilkanSubkategoriAdmin();

        tampilkanFieldWebsite();
    }
);

// =========================
// TAMPILKAN INPUT WEBSITE
// KHUSUS UNDANGAN WEBSITE ONLINE
// =========================

function tampilkanInputWebsite() {

    if (!websiteLinkGroup) {
        return;
    }

    if (
        productCategory.value === "Undangan" &&
        productSubcategory.value === "Undangan Website Online"
    ) {

        websiteLinkGroup.style.display = "block";

    } else {

        websiteLinkGroup.style.display = "none";

        if (productWebsite) {
            productWebsite.value = "";
        }

    }

}

productSubcategory.addEventListener(
    "change",
    () => {

        tampilkanInputWebsite();

    }
);

// =========================
// FORMAT INPUT HARGA
// =========================

productPrice.addEventListener("input", function () {

    let angka =
        this.value.replace(/[^\d]/g, "");

    if (!angka) {

        this.value = "";

        return;

    }

    this.value =
        Number(angka).toLocaleString("id-ID");

});




// =========================
// FORMAT HARGA RUPIAH
// =========================

function formatRupiah(angka) {

    const nilai = Number(
        String(angka)
            .replace(/[^\d]/g, "")
    );

    if (isNaN(nilai)) {
        return "Rp0";
    }

    return nilai.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    });

}

// =========================
// BACKUP PRODUK
// =========================

backupProductButton.addEventListener(
    "click",
    () => {

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


        link.href = url;


        link.download =
            `backup-rona-creation-${new Date()
                .toISOString()
                .slice(0, 10)}.json`;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );


        alert(
            "Backup produk berhasil dibuat."
        );

    }
);

// =========================
// EXPORT PRODUCTS.JSON
// =========================

const exportProductsButton =
    document.getElementById(
        "exportProductsButton"
    );

if (exportProductsButton) {

    exportProductsButton.addEventListener(
        "click",
        () => {

            // Ambil data terbaru dari Admin
            const produk =
                adminProducts || [];

            if (!produk.length) {

                alert(
                    "Belum ada produk di Admin untuk diekspor."
                );

                return;
            }

            // Format products.json
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
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "products.json";

            document.body.appendChild(link);

            link.click();

            link.remove();

            URL.revokeObjectURL(url);

            alert(
                `products.json berhasil dibuat.\n\n${produk.length} produk siap di-upload ke GitHub.`
            );

        }
    );

}
// =========================
// RESTORE PRODUK
// =========================

restoreProductButton.addEventListener(
    "click",
    () => {

        restoreProductInput.click();

    }
);


restoreProductInput.addEventListener(
    "change",
    () => {

        const file =
            restoreProductInput.files[0];


        if (!file) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload = function(event) {

            try {

                const data =
                    JSON.parse(
                        event.target.result
                    );


                if (
                    !data.products ||
                    !Array.isArray(
                        data.products
                    )
                ) {

                    alert(
                        "File backup tidak valid."
                    );

                    return;

                }


                const yakin =
                    confirm(
                        "Restore backup akan mengganti produk Admin saat ini.\n\n" +
                        "Apakah Anda yakin ingin melanjutkan?"
                    );


                if (!yakin) {

                    return;

                }


                const dataProduk =
                    JSON.stringify(
                        data.products
                    );


                if (
                    !storageMasihAman(
                        dataProduk
                    )
                ) {

                    return;

                }


                localStorage.setItem(
                    "ronaProducts",
                    dataProduk
                );


                adminProducts =
                    data.products;


                EXPORT PRODUCTS.JSON();


                window.dispatchEvent(
                    new Event(
                        "produkBerubah"
                    )
                );


                alert(
                    "Backup produk berhasil dipulihkan."
                );


            } catch (error) {

                console.error(
                    "Gagal restore:",
                    error
                );


                alert(
                    "File backup tidak dapat dibaca."
                );

            }


            restoreProductInput.value = "";

        };

        reader.readAsText(file);

    }
);

// =========================
// KOMPRES FOTO PRODUK
// =========================

function kompresFoto(file) {

    return new Promise((resolve, reject) => {

        const reader =
            new FileReader();


        reader.onload = function(event) {

            const img =
                new Image();


            img.onload = function() {

                const maxWidth = 1000;
                const maxHeight = 1000;

                let width =
                    img.width;

                let height =
                    img.height;


                // =========================
                // SESUAIKAN UKURAN
                // =========================

                if (
                    width > maxWidth ||
                    height > maxHeight
                ) {

                    const rasio =
                        Math.min(
                            maxWidth / width,
                            maxHeight / height
                        );


                    width =
                        Math.round(
                            width * rasio
                        );


                    height =
                        Math.round(
                            height * rasio
                        );

                }


                // =========================
                // CANVAS
                // =========================

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


                // =========================
                // HASIL KOMPRESI
                // =========================

                const hasil =
                    canvas.toDataURL(
                        "image/jpeg",
                        0.75
                    );


                resolve(hasil);

            };


            img.onerror = function() {

                reject(
                    new Error(
                        "Gagal membaca gambar."
                    )
                );

            };


            img.src =
                event.target.result;

        };


        reader.onerror = function() {

            reject(
                new Error(
                    "Gagal membaca file."
                )
            );

        };


        reader.readAsDataURL(file);

    });

}

// =========================
// KOMPRES ULANG PRODUK LAMA
// =========================

async function kompresProdukLama() {

    if (!adminProducts.length) {

        alert("Belum ada produk Admin.");

        return;

    }


    const yakin =
        confirm(
            `Kompres ulang ${adminProducts.length} foto produk lama?`
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
                `Memproses ${i + 1}/${adminProducts.length}:`,
                product.name
            );


            // =========================
            // DATA PRODUK
            // =========================

            const produkUpdate = {

                ...product

            };


            // =========================
            // KOMPRES FOTO
            // =========================

            if (
                product.image &&
                product.image.startsWith("data:image")
            ) {

                // Ubah Base64 menjadi File

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
                            type: "image/jpeg"
                        }
                    );


                // Kompres ulang

                produkUpdate.image =
                    await kompresFoto(file);

            }


            produkBaru.push(
                produkUpdate
            );

        }


        // =========================
        // SIMPAN HASIL
        // =========================

        const dataBaru =
    JSON.stringify(produkBaru);


// =========================
// CEK STORAGE
// =========================

if (
    !storageMasihAman(dataBaru)
) {

    return;
}


// =========================
// SIMPAN HASIL
// =========================

localStorage.setItem(
    "ronaProducts",
    dataBaru
);

        // UPDATE DATA AKTIF

        adminProducts =
            produkBaru;


        EXPORT PRODUCTS.JSON();


        alert(
            "Foto produk lama berhasil dikompres."
        );


        console.log(
            "Ukuran baru:",
            (
                dataBaru.length /
                1024 /
                1024
            ).toFixed(2),
            "MB"
        );


    } catch (error) {

        console.error(
            "Gagal kompres produk lama:",
            error
        );


        alert(
            "Gagal melakukan kompresi. Data lama tetap dipertahankan."
        );

    }

}

// =========================
// CEK UKURAN STORAGE
// =========================

function ukuranDataMB(data) {

    return (
        data.length /
        1024 /
        1024
    );

}

// =========================
// CEK STORAGE SEBELUM SIMPAN
// =========================

function storageMasihAman(data) {

    const ukuran =
        ukuranDataMB(data);


    console.log(
        "Ukuran data:",
        ukuran.toFixed(2),
        "MB"
    );


    // Batas aman aplikasi

    const batasAman =
        4.0;


    if (ukuran > batasAman) {

        alert(
            "Penyimpanan katalog hampir penuh.\n\n" +
            "Silakan optimalkan foto produk terlebih dahulu."
        );

        return false;

    }


    return true;

}

// =========================
// PREVIEW FOTO
// =========================

productImage.addEventListener("change", () => {

    imagePreview.innerHTML = "";

    const file =
        productImage.files[0];


    if (imageSizeInfo) {

        imageSizeInfo.textContent = "";

    }


    if (!file) {

        return;

    }


    if (!file.type.startsWith("image/")) {

        alert(
            "Silakan pilih file gambar."
        );

        productImage.value = "";

        return;

    }


    const reader =
        new FileReader();


    reader.onload = async function(event) {

        imagePreview.innerHTML = `
            <img
                src="${event.target.result}"
                alt="Preview Produk"
            >
        `;

// =========================
// STATUS KOMPRESI
// =========================

if (imageSizeInfo) {

    imageSizeInfo.innerHTML = `
        ⏳ Mengoptimalkan foto...
    `;

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
                    hasilKompres.length *
                    0.75 /
                    1024 /
                    1024
                ).toFixed(2);


            if (imageSizeInfo) {

                imageSizeInfo.innerHTML = `
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
                "Gagal menghitung ukuran kompresi:",
                error
            );

        }

    };


    reader.readAsDataURL(file);

});

// =========================
// FORMAT HARGA
// =========================

function formatRupiah(angka) {

    return Number(angka).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    });

}

// =========================
// SIMPAN / UPDATE PRODUK
// =========================

saveProductButton.addEventListener("click", async () => {

    const file =
        productImage.files[0];

    const nama =
        productName.value.trim();

    const kategori =
        productCategory.value;

    const subkategori =
    productSubcategory.value;

    const website =
    productWebsite
        ? productWebsite.value.trim()
        : "";

        if (!subkategori) {

        alert("Silakan pilih subkategori.");

        productSubcategory.focus();

        return;
         }

    // =========================
// VALIDASI LINK WEBSITE
// =========================

if (
    kategori === "Undangan" &&
    subkategori === "Undangan Website Online"
) {

    if (!website) {

        alert(
            "Silakan masukkan link website undangan."
        );

        productWebsite.focus();

        return;

    }

    if (
        !website.startsWith("http://") &&
        !website.startsWith("https://")
    ) {

        alert(
            "Link website harus diawali http:// atau https://"
        );

        productWebsite.focus();

        return;

    }

}

    const harga =
    Number(
        productPrice.value.replace(/[^\d]/g, "")
    );

    const deskripsi =
        productDescription.value.trim();



// =========================
// FORMAT INPUT HARGA
// =========================

productPrice.addEventListener("input", function () {

    let angka =
        this.value.replace(/[^\d]/g, "");

    if (!angka) {

        this.value = "";

        return;

    }

    this.value =
        Number(angka).toLocaleString("id-ID");

});

    // =========================
    // VALIDASI
    // =========================

    if (!nama) {

        alert("Nama produk belum diisi.");

        productName.focus();

        return;
    }


    if (!kategori) {

        alert("Silakan pilih kategori.");

        productCategory.focus();

        return;
    }


    if (!harga) {

        alert("Harga belum diisi.");

        productPrice.focus();

        return;
    }


    if (!deskripsi) {

        alert("Deskripsi produk belum diisi.");

        productDescription.focus();

        return;
    }

 // =========================
// CEK PRODUK DUPLIKAT
// =========================

function normalisasiNamaProduk(namaProduk) {

    return namaProduk
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

}


const namaProdukNormal =
    normalisasiNamaProduk(nama);


const produkDuplikat =
    adminProducts.some(product => {

        const namaLamaNormal =
            normalisasiNamaProduk(
                product.name
            );


        return (
            namaLamaNormal ===
            namaProdukNormal

            &&

            product.category ===
            kategori
        );

    });


if (produkDuplikat) {

    alert(
        "Produk dengan nama dan kategori tersebut sudah ada."
    );

    productName.focus();

    return;

}



    // =========================
    // MODE EDIT
    // =========================

    if (window.editingProductId) {

        const index =
            adminProducts.findIndex(
                product =>
                    product.id ===
                    window.editingProductId
            );


        if (index === -1) {

            alert(
                "Produk yang diedit tidak ditemukan."
            );

            return;
        }


        // FOTO LAMA

        let gambar =
            adminProducts[index].image;


        // JIKA MEMILIH FOTO BARU

        if (file) {

            if (!file.type.startsWith("image/")) {

                alert(
                    "Silakan pilih file gambar."
                );

                return;
            }


            try {

                saveProductButton.disabled = true;

                saveProductButton.textContent =
                    "⏳  Mengompres & menyimpan...";


                gambar =
                    await kompresFoto(file);


                adminProducts[index] = {

                ...adminProducts[index],

                name: nama,

                category: kategori,

                subcategory: subkategori,

                price: harga,

                image: gambar,

                 description: deskripsi,
   
                  website: website

            };

                const dataProduk =
                JSON.stringify(adminProducts);

                if (
                 !storageMasihAman(dataProduk)
                ) {

                return;
                }

                localStorage.setItem(
                    "ronaProducts",
                    JSON.stringify(adminProducts)
                );


                window.editingProductId = null;

                resetFormProduk();

                EXPORT PRODUCTS.JSON();


                alert(
                    "Produk berhasil diperbarui."
                );


            } catch (error) {

                console.error(error);

                alert(
                    "Gagal memproses foto."
                );


            } finally {

                saveProductButton.disabled = false;

                 saveProductButton.textContent =
                 "💾 Simpan Produk";

            }


            return;
        }


        // =========================
        // EDIT TANPA GANTI FOTO
        // =========================

        adminProducts[index] = {
        ...adminProducts[index],

        name: nama,
        category: kategori,
        subcategory: subkategori,
        price: harga,
        description: deskripsi,
         website: website
        };


// =========================
// CEK SEBELUM SIMPAN
// =========================

const dataProduk =
    JSON.stringify(adminProducts);


if (
    !storageMasihAman(dataProduk)
) {

    return;
}


// =========================
// SIMPAN
// =========================

localStorage.setItem(
    "ronaProducts",
    dataProduk
);


        window.editingProductId = null;

        resetFormProduk();

        EXPORT PRODUCTS.JSON();


        alert(
            "Produk berhasil diperbarui."
        );


        return;
    }


    // =========================
    // MODE TAMBAH PRODUK
    // =========================

    if (!file) {

        alert(
            "Silakan pilih foto produk."
        );

        return;
    }


    if (!file.type.startsWith("image/")) {

        alert(
            "Silakan pilih file gambar."
        );

        return;
    }


    try {

        saveProductButton.disabled = true;

        saveProductButton.textContent =
            "⏳ Mengompres foto...";


        // =========================
        // KOMPRES FOTO
        // =========================

        const gambar =
            await kompresFoto(file);


        // =========================
        // PRODUK BARU
        // =========================

        const produkBaru = {

        id: Date.now(),

        name: nama,

        category: kategori,

        subcategory: subkategori,

        price: harga,

        image: gambar,

         description: deskripsi,

          website: website

         };


        // =========================
        // SIMPAN
        // =========================

        adminProducts.push(
            produkBaru
        );


        localStorage.setItem(
            "ronaProducts",
            JSON.stringify(adminProducts)
        );


        // =========================
        // SELESAI
        // =========================

        resetFormProduk();

        EXPORT PRODUCTS.JSON();


        alert(
            "Produk berhasil disimpan."
        );


    } catch (error) {

        console.error(error);

        alert(
            "Gagal menyimpan produk. Ukuran penyimpanan mungkin sudah penuh."
        );


    } finally {

        saveProductButton.disabled = false;

    }

});
// =========================
// UPDATE PRODUK
// =========================

function updateProduk(index, gambar) {

    adminProducts[index] = {

        ...adminProducts[index],

        name:
            productName.value.trim(),

        category:
            productCategory.value,

        price:
            productPrice.value.trim(),

        image:
            gambar,

        description:
            productDescription.value.trim(),

        website: website

    };


    // SIMPAN KE LOCAL STORAGE

    localStorage.setItem(
        "ronaProducts",
        JSON.stringify(adminProducts)
    );


    // RESET MODE EDIT

    window.editingProductId = null;


    // RESET FORM

    resetFormProduk();


    // TAMPILKAN ULANG

    EXPORT PRODUCTS.JSON();


    alert(
        "Produk berhasil diperbarui."
    );

}

// =========================
// RESET FORM PRODUK
// =========================

function resetFormProduk() {

    productImage.value = "";

    productName.value = "";

    productCategory.value = "";

    productSubcategory.innerHTML = `
    <option value="">
        Pilih subkategori
    </option>
    `;


    productPrice.value = "";

    productDescription.value = "";

    if (productWebsite) {

    productWebsite.value = "";

}

if (websiteLinkGroup) {

    websiteLinkGroup.style.display = "none";

}

    imagePreview.innerHTML = "";


    saveProductButton.textContent =
        "💾 Simpan Produk";

    cancelEditButton.style.display =
    "none";

    window.editingProductId = null;

}

// =========================
// TAMPILKAN PRODUK ADMIN
// =========================

// =========================
// TAMPILKAN PRODUK ADMIN
// =========================

// =========================
// TAMPILKAN PRODUK ADMIN
// =========================

function EXPORT PRODUCTS.JSON(
    data = adminProducts
) {

    productCount.textContent =
        `${adminProducts.length} Produk`;


    if (adminProducts.length === 0) {

        adminProductList.innerHTML = `
            <div class="empty-product">
                Belum ada produk tambahan.
            </div>
        `;

        return;
    }


    adminProductList.innerHTML = "";


    data.forEach(product => {

        const item =
            document.createElement("div");

        item.className =
            "admin-product-item";


        item.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="admin-product-info">

                <div class="admin-product-category">
                    ${product.category}
                </div>

                <h3>
                    ${product.name}
                </h3>

                <p>
                     ${formatRupiah(product.price)}
                </p>

            </div>

            <div class="admin-product-actions">

                <button
                    class="edit-product-button"
                    data-id="${product.id}"
                >
                    ✏️ Edit
                </button>

                <button
                    class="delete-product-button"
                    data-id="${product.id}"
                >
                    🗑️ Hapus
                </button>

            </div>

        `;


        // =========================
        // TOMBOL EDIT
        // =========================

        const tombolEdit =
            item.querySelector(
                ".edit-product-button"
            );


tombolEdit.addEventListener(
    "click",
    () => {

        // ISI FORM

        productName.value =
            product.name;

        productCategory.value =
            product.category;

        // Tampilkan subkategori sesuai kategori
        tampilkanSubkategoriAdmin(
            product.subcategory || ""
        );

        // Isi link website lama
        if (productWebsite) {

            productWebsite.value =
                product.website || "";

        }

        // Tampilkan / sembunyikan field website
        tampilkanFieldWebsite();

        productPrice.value =
            product.price;

        productDescription.value =
            product.description || "";

            if (productWebsite) {

             productWebsite.value =
              product.website || "";

            }

            tampilkanInputWebsite();

                // TAMPILKAN FOTO LAMA

                imagePreview.innerHTML = `

                    <img
                        src="${product.image}"
                        alt="Foto Produk"
                    >

                `;


                // SIMPAN ID PRODUK YANG SEDANG DIEDIT

                window.editingProductId =
                    product.id;


                // UBAH TEKS TOMBOL

                saveProductButton.textContent =
                    "💾 Simpan Perubahan";


                // BATAL TEKS TOMBOL

                cancelEditButton.style.display =
                "inline-block";


                // SCROLL KE FORM

                saveProductButton.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }
        );


        // =========================
        // TOMBOL HAPUS
        // =========================

        const tombolHapus =
            item.querySelector(
                ".delete-product-button"
            );


        tombolHapus.addEventListener(
            "click",
            () => {

                const yakin =
                    confirm(
                        `Hapus produk "${product.name}"?`
                    );


                if (!yakin) {
                    return;
                }


                adminProducts =
                    adminProducts.filter(
                        item =>
                            item.id !== product.id
                    );


                localStorage.setItem(
                    "ronaProducts",
                    JSON.stringify(adminProducts)
                );


                EXPORT PRODUCTS.JSON();


                alert(
                    "Produk berhasil dihapus."
                );

            }
        );


        adminProductList.appendChild(item);

    });

}

// =========================
// PENCARIAN PRODUK ADMIN
// =========================

adminSearchInput.addEventListener(
    "input",
    () => {

        const keyword =
            adminSearchInput.value
                .toLowerCase()
                .trim();


        const hasil =
            adminProducts.filter(
                product => {

                    return (

                        product.name
                            .toLowerCase()
                            .includes(
                                keyword
                            )

                        ||

                        product.category
                            .toLowerCase()
                            .includes(
                                keyword
                            )

                        ||

                        String(product.price)
                        .toLowerCase()
                        .includes(
                            keyword
                        )

                    );

                }
            );


        EXPORT PRODUCTS.JSON(
            hasil
        );

    }
);

// =========================
// BATAL EDIT
// =========================

cancelEditButton.addEventListener(
    "click",
    () => {

        resetFormProduk();

    }
);

// =========================
// TOMBOL OPTIMALKAN FOTO
// =========================

compressProductsButton.addEventListener(
    "click",
    () => {

        kompresProdukLama();

    }
);

// =========================
// HAPUS PRODUK
// =========================

function hapusProduk(id) {

    const product =
        adminProducts.find(
            product => product.id === id
        );


    if (!product) {

        alert(
            "Produk tidak ditemukan."
        );

        return;

    }


    const yakin =
        confirm(
            `Yakin ingin menghapus produk "${product.name}"?`
        );


    if (!yakin) {

        return;

    }


    adminProducts =
        adminProducts.filter(
            product => product.id !== id
        );


    const dataProduk =
        JSON.stringify(adminProducts);


    if (
        !storageMasihAman(dataProduk)
    ) {

        return;

    }


    localStorage.setItem(
        "ronaProducts",
        dataProduk
    );

// =========================
// BERITAHU KATALOG
// =========================

window.dispatchEvent(
    new Event("produkBerubah")
);
    EXPORT PRODUCTS.JSON();


    alert(
        "Produk berhasil dihapus."
    );

}

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
// STATISTIK ADMIN
// =========================

function updateStatistikAdmin() {

    const total =
        adminProducts.length;


    const jumlahFoto =
        adminProducts.filter(
            product =>
                product.image &&
                product.image.trim() !== ""
        ).length;


    const daftarKategori =
        [
            ...new Set(
                adminProducts.map(
                    product =>
                        product.category
                )
            )
        ];


    statTotalProduk.textContent =
        total;


    statProdukFoto.textContent =
        jumlahFoto;


    statKategori.textContent =
        daftarKategori.length;

}

// =========================
// FORMAT HARGA RUPIAH
// =========================

function formatRupiah(angka) {

    const nilai =
        Number(
            String(angka)
                .replace(/[^\d]/g, "")
        );

    if (isNaN(nilai)) {
        return "Rp0";
    }

    return nilai.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    });

}

