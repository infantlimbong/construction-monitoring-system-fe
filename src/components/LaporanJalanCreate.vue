<template>
    <div class="p-5">
        <h1 class="text-2xl mb-5">Tambah Laporan Kegiatan</h1>

        <form @submit.prevent="createLaporanKegiatan" class="max-w-full mx-auto mt-5">
            <div class="mb-4">
                <label for="kegiatan" class="font-bold block mb-1">Nama Kegiatan</label>
                <input v-model="kegiatan" name="kegiatan" id="kegiatan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="id_jalan" class="font-bold block mb-1">Nama Ruas Jalan</label>
                <div class="flex gap-2">
                    <select v-model="id_jalan" id="id_jalan" class="shadow border rounded w-2/3 py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                        <option v-for="lap_kondisi_jalan in filteredLapKondisiJalans" :key="lap_kondisi_jalan.id" :value="lap_kondisi_jalan.id">{{ lap_kondisi_jalan.nama_ruas_jalan }}</option>
                    </select>
                    <input v-model="searchLapKondisiJalan" name="searchLapKondisiJalan" id="searchLapKondisiJalan" @input="filterLapKondisiJalan" placeholder="Cari Nama Ruas Jalan..." type="text" class="shadow appearance-none border rounded w-1/3 py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                </div>
            </div>
            <div class="mb-4">
                <label for="id_sumber_dana" class="font-bold block mb-1">Sumber Dana</label>
                <div class="flex gap-2">
                    <select v-model="id_sumber_dana" id="id_sumber_dana" class="shadow border rounded w-2/3 py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">-</option>
                        <option v-for="sumber_dana in filteredSumberDanas" :key="sumber_dana.id" :value="sumber_dana.id">{{ sumber_dana.sumber_dana }}</option>
                    </select>
                    <input v-model="searchDana" name="searchDana" id="searchDana" @input="filterDana" placeholder="Cari Sumber Dana..." type="text" class="shadow appearance-none border rounded w-1/3 py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                </div>
            </div>
            <div class="mb-4">
                <label for="lokasi" class="font-bold block mb-1">Lokasi</label>
                <textarea v-model="lokasi" rows="4" name="lokasi" id="lokasi" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline"></textarea>
            </div>
            <div class="mb-4">
                <label for="anggaran_kes" class="font-bold block mb-1">Anggaran Keseluruhan</label>
                <input v-model="anggaran_kes" name="anggaran_kes" id="anggaran_kes" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="anggaran_fisik" class="font-bold block mb-1">Anggaran Fisik</label>
                <input v-model="anggaran_fisik" name="anggaran_fisik" id="anggaran_fisik" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="nilai_kontrak" class="font-bold block mb-1">Nilai Kontrak</label>
                <input v-model="nilai_kontrak" name="nilai_kontrak" id="nilai_kontrak" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="realisasi" class="font-bold block mb-1">Realisasi</label>
                <input v-model="realisasi" name="realisasi" id="realisasi" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="total_anggaran" class="font-bold block mb-1">Total Anggaran</label>
                <input v-model="total_anggaran" name="total_anggaran" id="total_anggaran" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="sisa_anggaran" class="font-bold block mb-1">Sisa Anggaran</label>
                <input v-model="sisa_anggaran" name="sisa_anggaran" id="sisa_anggaran" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="sisa_tender" class="font-bold block mb-1">Sisa Tender</label>
                <input v-model="sisa_tender" name="sisa_tender" id="sisa_tender" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="realisasi_fisik" class="font-bold block mb-1">Realisasi Fisik</label>
                <input v-model="realisasi_fisik" name="realisasi_fisik" id="realisasi_fisik" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="denda_keterlambatan" class="font-bold block mb-1">Denda Keterlambatan</label>
                <input v-model="denda_keterlambatan" name="denda_keterlambatan" id="denda_keterlambatan" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="kontrak_pelaksana" class="font-bold block mb-1">Kontrak Pelaksana</label>
                <input v-model="kontrak_pelaksana" name="kontrak_pelaksana" id="kontrak_pelaksana" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="tanggal_kontrak" class="font-bold block mb-1">Tanggal Kontrak</label>
                <input v-model="tanggal_kontrak" name="tanggal_kontrak" id="tanggal_kontrak" type="date" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="tanggal_spmk" class="font-bold block mb-1">Tanggal SPMK</label>
                <input v-model="tanggal_spmk" name="tanggal_spmk" id="tanggal_spmk" type="date" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="tanggal_selesai_kontrak" class="font-bold block mb-1">Tanggal Selesai Kontrak</label>
                <input v-model="tanggal_selesai_kontrak" name="tanggal_selesai_kontrak" id="tanggal_selesai_kontrak" type="date" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="keterangan" class="font-bold block mb-1">Keterangan</label>
                <textarea v-model="keterangan" rows="4" name="keterangan" id="keterangan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline"></textarea>
            </div>
            <div class="mb-4">
                <label for="tanggal_laporan" class="font-bold block mb-1">Tanggal Laporan</label>
                <input v-model="tanggal_laporan" name="tanggal_laporan" id="tanggal_laporan" type="date" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>

            <div class="flex items-center gap-2">
                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded focus:outline-none focus:shadow-outline">Simpan</button>
                <button type="button" @click="cancel" class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded inline-block">Batal</button>
            </div>
        </form>
    </div>
</template>

<script setup>
    import axios from "axios";
    import Swal from "sweetalert2";
    import { ref, watch, onMounted } from "vue";
    import { useRouter } from "vue-router";
    import { useAuthStore } from "@/stores/auth";

    const authStore = useAuthStore();

    function currentTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        let month = now.getMonth() + 1;
        let day = now.getDate();

        // Add leading zero if month or day is less than 10
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }

        return `${year}-${month}-${day}`;
    };

    const router = useRouter();
    const id_jalan = ref("");
    const id_sumber_dana = ref("");
    const kegiatan = ref("");
    const lokasi = ref("");
    const anggaran_kes = ref("0");
    const anggaran_fisik = ref("0");
    const nilai_kontrak = ref("0");
    const realisasi = ref("0");
    const total_anggaran = ref("0");
    const sisa_anggaran = ref("0");
    const sisa_tender = ref("0");
    const realisasi_fisik = ref("0");
    const denda_keterlambatan = ref("0");
    const kontrak_pelaksana = ref("0");
    const tanggal_kontrak = ref("");
    const tanggal_spmk = ref("");
    const tanggal_selesai_kontrak = ref("");
    const keterangan = ref("-");
    const tanggal_laporan = ref("");
    const searchLapKondisiJalan = ref("");
    const searchDana = ref("");
    const lapKondisiJalans = ref([]);
    const sumberDanas = ref([]);

    // Fetch lap_kondisi_jalans on component mount
    onMounted(async () => {
        const response = await axios.get("http://localhost:8000/api/lap_kondisi_jalans", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        lapKondisiJalans.value = response.data.data;
    });

    // Fetch sumber_danas on component mount
    onMounted(async () => {
        const response = await axios.get("http://localhost:8000/api/sumber_danas", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        sumberDanas.value = response.data.data;
    });

    // Filter lap_kondisi_jalans based on user input
    const filteredLapKondisiJalans = ref([]);
    const filterLapKondisiJalan = () => {
        filteredLapKondisiJalans.value = lapKondisiJalans.value.filter(lap_kondisi_jalan =>
            lap_kondisi_jalan.nama_ruas_jalan.toLowerCase().includes(searchLapKondisiJalan.value.toLowerCase())
        );
    };

    // Filter sumber_danas based on user input
    const filteredSumberDanas = ref([]);
    const filterDana = () => {
        filteredSumberDanas.value = sumberDanas.value.filter(dana =>
            dana.sumber_dana.toLowerCase().includes(searchDana.value.toLowerCase())
        );
    };

    // Watch for changes in lap_kondisi_jalans and update filteredLapKondisiJalans accordingly etc.
    watch(lapKondisiJalans, () => {
        filterLapKondisiJalan();
    });

    watch(sumberDanas, () => {
        filterDana();
    });

    // Fetch lap_kondisi_jalan name based on selected ID
    const fetchLapKondisiJalanName = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/lap_kondisi_jalans/${id_jalan.value}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            kegiatan.value = response.data.nama_ruas_jalan;
        } catch (error) {
            console.error("Error fetching lap_kondisi_jalan name:", error);
            kegiatan.value = ""; // Clear lap_kondisi_jalan name if error occurs
        }
    };

    // Watch for changes in id_jalan and fetch lap_kondisi_jalan name
    watch(id_jalan, fetchLapKondisiJalanName);

    // Fetch sumber_dana name based on selected ID
    const fetchSumberDanaName = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/sumber_danas/${id_sumber_dana.value}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            keterangan.value = response.data.sumber_dana;
        } catch (error) {
            console.error("Error fetching sumber_dana name:", error);
            keterangan.value = ""; // Clear sumber_dana name if error occurs
        }
    };

    // Watch for changes in id_sumber_dana and fetch sumber_dana name
    watch(id_sumber_dana, fetchSumberDanaName);

    const createLaporanKegiatan = async () => {
        // Alert message if the form empty / invalid
        if (!kegiatan.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Nama kegiatan harus diisi'
            });
            return;
        }

        if (!id_jalan.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Laporan jalan harus dipilih'
            });
            return;
        }
        
        if (!lokasi.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Lokasi harus diisi'
            });
            return;
        }

        if (!anggaran_kes.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Anggaran Keseluruhan harus diisi'
            });
            return;
        }

        if (!anggaran_fisik.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Anggaran fisik harus diisi'
            });
            return;
        }

        if (!nilai_kontrak.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Nilai kontrak harus diisi'
            });
            return;
        }

        if (!realisasi.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Realisasi harus diisi'
            });
            return;
        }

        if (!total_anggaran.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Total anggaran harus diisi'
            });
            return;
        }

        if (!sisa_anggaran.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Sisa anggaran harus diisi'
            });
            return;
        }

        if (!realisasi_fisik.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Realisasi fisik harus diisi'
            });
            return;
        }

        if (!denda_keterlambatan.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Denda keterlambatan harus diisi'
            });
            return;
        }

        if (!kontrak_pelaksana.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Kontrak Pelaksana harus diisi'
            });
            return;
        }

        if (!keterangan.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Keterangan harus diisi'
            });
            return;
        }

        if (!denda_keterlambatan.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Denda keterlambatan harus diisi'
            });
            return;
        }

        if (!tanggal_kontrak.value) {
           tanggal_kontrak.value = currentTimestamp();
        }

        if (!tanggal_spmk.value) {
           tanggal_spmk.value = currentTimestamp();
        }

        if (!tanggal_selesai_kontrak.value) {
           tanggal_selesai_kontrak.value = currentTimestamp();
        }

        if (!tanggal_laporan.value) {
           tanggal_laporan.value = currentTimestamp();
        }

        // Your API endpoint to post the data
        const endpoint = "http://localhost:8000/api/laporan_kegiatans";

        try {
            await axios.post(endpoint, {
                id_jalan: id_jalan.value,
                id_sumber_dana: id_sumber_dana.value,
                kegiatan: kegiatan.value,
                lokasi: lokasi.value,
                anggaran_kes: anggaran_kes.value,
                anggaran_fisik: anggaran_fisik.value,
                nilai_kontrak: nilai_kontrak.value,
                realisasi: realisasi.value,
                total_anggaran: total_anggaran.value,
                sisa_anggaran: sisa_anggaran.value,
                sisa_tender: sisa_tender.value,
                realisasi_fisik: realisasi_fisik.value,
                denda_keterlambatan: denda_keterlambatan.value,
                kontrak_pelaksana: kontrak_pelaksana.value,
                tanggal_kontrak: tanggal_kontrak.value,
                tanggal_spmk: tanggal_spmk.value,
                tanggal_selesai_kontrak: tanggal_selesai_kontrak.value,
                keterangan: keterangan.value,
                tanggal_laporan: tanggal_laporan.value,
            },
            {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            // SweetAlert notification after successful creation
            Swal.fire({
                icon: 'success',
                title: 'Data dibuat',
                text: 'Data laporan kegiatan berhasil dibuat!',
            });

            router.push("/listlaporan");
        } catch (error) {
            console.error('Error creating laporan kegiatan:', error);
        }
    };

    const cancel = () => {
        router.go(-1);
    };
</script>

