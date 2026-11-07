const dataVila = [
    { nama: "Vila Salak", tipe: "Deluxe (2 Kamar)", lokasi: "Puncak", harga: 1000000, fasilitas: "Wi-Fi, Kolam Renang", status: "Tersedia" },
    { nama: "Vila Halimun", tipe: "Standard (1 Kamar)", lokasi: "Citeko", harga: 500000, fasilitas: "Wi-Fi, Parkir Luas", status: "Tersedia" },
    { nama: "Vila Di atas langit", tipe: "Family (3 Kamar)", lokasi: "Megamendung", harga: 1900000, fasilitas: "Wi-fi, Kolam Renang, Karaoke, Aula", status: "Tersedia" }
];

window.onload = function() {
    tampilkanVila(dataVila);
    isiDropdownVila();
    muatLocalStorage();
};

function tampilkanVila(daftar) {
    const container = document.getElementById("containerVila");
    container.innerHTML = ""; 

    try {
        if (daftar.length === 0) {
            container.innerHTML = "<p>Vila tidak ditemukan.</p>";
            return;
        }

        daftar.forEach(vila => {
            const article = document.createElement("article");
            article.className = "villa-card";

            const h3 = document.createElement("h3");
            h3.className = "villa-card__title";
            h3.innerText = vila.nama;

            const pTipe = document.createElement("p");
            pTipe.innerHTML = `<strong>Tipe:</strong> ${vila.tipe}`;

            const pLokasi = document.createElement("p");
            pLokasi.innerHTML = `<strong>Lokasi:</strong> ${vila.lokasi}`;

            const pHarga = document.createElement("p");
            pHarga.innerHTML = `<strong>Harga:</strong> Rp ${vila.harga.toLocaleString()} / malam`;

            const pFasilitas = document.createElement("p");
            pFasilitas.innerHTML = `<strong>Fasilitas:</strong> ${vila.fasilitas}`;

            const pStatus = document.createElement("p");
            pStatus.innerHTML = `<strong>Status:</strong> ${vila.status}`;
            pStatus.style.color = "green";

            article.appendChild(h3);
            article.appendChild(pTipe);
            article.appendChild(pLokasi);
            article.appendChild(pHarga);
            article.appendChild(pFasilitas);
            article.appendChild(pStatus)

            container.appendChild(article);
        });
    } catch (error) {
        console.error("Gagal memuat data vila:", error);
    }
}

function cariVila() {
    const keyword = document.getElementById("inputPencarian").value.toLowerCase();
    const hasilFilter = dataVila.filter(v => 
        v.nama.toLowerCase().includes(keyword) || v.lokasi.toLowerCase().includes(keyword)
    );
    tampilkanVila(hasilFilter);
}

function isiDropdownVila() {
    const select = document.getElementById("pilihVila");
    dataVila.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v.nama;
        opt.innerText = `${v.nama} - Rp ${v.harga.toLocaleString()}/malam`;
        select.appendChild(opt);
    });
}

function hitungTotalHarga() {
    const namaVila = document.getElementById("pilihVila").value;
    const checkIn = new Date(document.getElementById("checkIn").value);
    const checkOut = new Date(document.getElementById("checkOut").value);
    const jumlahTamu = parseInt(document.getElementById("jumlahTamu").value);
    const hasilDiv = document.getElementById("hasilHitung");

    if (!namaVila || isNaN(checkIn) || isNaN(checkOut)) {
        hasilDiv.innerText = "Mohon lengkapi pilihan vila dan tanggal terlebih dahulu!";
        hasilDiv.style.color = "red";
        return 0;
    }

    const selisihWaktu = checkOut - checkIn;
    const jumlahMalam = selisihWaktu / (1000 * 60 * 60 * 24);

    if (jumlahMalam <= 0) {
        hasilDiv.innerText = "Tanggal check-out harus setelah tanggal check-in!";
        hasilDiv.style.color = "red";
        return 0;
    }

    const vilaDipilih = dataVila.find(v => v.nama === namaVila);
    const total = vilaDipilih.harga * jumlahMalam;

    hasilDiv.innerText = `Estimasi Biaya: Rp ${total.toLocaleString()} (${jumlahMalam} malam)`;
    hasilDiv.style.color = "green";
    return total;
}

document.getElementById("formPemesanan").addEventListener("submit", function(event) {
    event.preventDefault();

    const namaTamu = document.getElementById("namaTamu").value.trim();
    const checkInVal = document.getElementById("checkIn").value;
    const checkOutVal = document.getElementById("checkOut").value;
    const jumlahTamu = parseInt(document.getElementById("jumlahTamu").value);

    if (namaTamu === "") {
        alert("Nama wajib diisi!");
        return;
    }
    if (new Date(checkOutVal) <= new Date(checkInVal)) {
        alert("Tanggal check-out harus setelah tanggal check-in!");
        return;
    }
    if (jumlahTamu < 1 || jumlahTamu > 10) {
        alert("Jumlah tamu harus di antara 1 sampai 10 orang!");
        return;
    }

    const totalBiaya = hitungTotalHarga();
    if (totalBiaya === 0) return;

    const dataPesanan = {
        nama: namaTamu,
        vila: document.getElementById("pilihVila").value,
        checkIn: checkInVal,
        checkOut: checkOutVal,
        tamu: jumlahTamu,
        total: totalBiaya
    };

    localStorage.setItem("pesananTerakhir", JSON.stringify(dataPesanan));

    alert("Pemesanan berhasil disimpan!");
    muatLocalStorage();
    this.reset();
});

function muatLocalStorage() {
    const simpanan = localStorage.getItem("pesananTerakhir");
    if (simpanan) {
        const pesanan = JSON.parse(simpanan);
        document.getElementById("tampilRiwayat").innerHTML = `
            Nama: ${pesanan.nama} <br>
            Vila: ${pesanan.vila} <br>
            Check-in: ${pesanan.checkIn} | Check-out: ${pesanan.checkOut} <br>
            Jumlah Tamu: ${pesanan.tamu} orang <br>
            Total Bayar: Rp ${pesanan.total.toLocaleString()}
        `;
    }
}