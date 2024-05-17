<template>
    <div class="p-5">
        <h1 class="text-2xl mb-5">Edit Laporan Kegiatan Jalan</h1>

        <form v-if="laporan_kegiatan" @submit.prevent="updateLaporanKegiatan" class="max-w-full mx-auto mt-5">
            <div class="mb-4">
                <label for="kegiatan" class="font-bold block mb-1">Kegiatan</label>
                <input v-model="laporan_kegiatan.kegiatan" name="kegiatan" id="kegiatan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="id_jalan" class="font-bold block mb-1">Nama Ruas Jalan</label>
                <div class="flex gap-2">
                    <select disabled v-model="laporan_kegiatan.id_jalan" id="id_jalan" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">-</option>
                        <option v-for="lap_kondisi_jalan in lapKondisiJalans" :key="lap_kondisi_jalan.id" :value="lap_kondisi_jalan.id">{{ lap_kondisi_jalan.nama_ruas_jalan }}</option>
                    </select>
                </div>
            </div>
            <div class="mb-4">
                <label for="id_sumber_dana" class="font-bold block mb-1">Sumber Dana</label>
                <div class="flex gap-2">
                    <select v-model="laporan_kegiatan.id_sumber_dana" id="id_sumber_dana" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">-</option>
                        <option v-for="sumber_dana in sumberDanas" :key="sumber_dana.id" :value="sumber_dana.id">{{ sumber_dana.sumber_dana }}</option>
                    </select>
                </div>
            </div>
            <div class="mb-4">
                <label for="lokasi" class="font-bold block mb-1">Lokasi</label>
                <textarea v-model="laporan_kegiatan.lokasi" rows="4" name="lokasi" id="lokasi" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline"></textarea>
            </div>
            <div class="mb-4">
                <label for="anggaran_kes" class="font-bold block mb-1">Anggaran Kes</label>
                <input v-model="laporan_kegiatan.anggaran_kes" name="anggaran_kes" id="anggaran_kes" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="anggaran_fisik" class="font-bold block mb-1">Anggaran Fisik</label>
                <input v-model="laporan_kegiatan.anggaran_fisik" name="anggaran_fisik" id="anggaran_fisik" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="nilai_kontrak" class="font-bold block mb-1">Nilai Kontrak</label>
                <input v-model="laporan_kegiatan.nilai_kontrak" name="nilai_kontrak" id="nilai_kontrak" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="realisasi" class="font-bold block mb-1">Realisasi</label>
                <input v-model="laporan_kegiatan.realisasi" name="realisasi" id="realisasi" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="total_anggaran" class="font-bold block mb-1">Total Anggaran</label>
                <input v-model="laporan_kegiatan.total_anggaran" name="total_anggaran" id="total_anggaran" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="sisa_anggaran" class="font-bold block mb-1">Sisa Anggaran</label>
                <input v-model="laporan_kegiatan.sisa_anggaran" name="sisa_anggaran" id="sisa_anggaran" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="sisa_tender" class="font-bold block mb-1">Sisa Tender</label>
                <input v-model="laporan_kegiatan.sisa_tender" name="sisa_tender" id="sisa_tender" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="realisasi_fisik" class="font-bold block mb-1">Realisasi Fisik</label>
                <input v-model="laporan_kegiatan.realisasi_fisik" name="realisasi_fisik" id="realisasi_fisik" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="denda_keterlambatan" class="font-bold block mb-1">Denda Keterlambatan</label>
                <input v-model="laporan_kegiatan.denda_keterlambatan" name="denda_keterlambatan" id="denda_keterlambatan" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="kontrak_pelaksana" class="font-bold block mb-1">Kontrak Pelaksana</label>
                <input v-model="laporan_kegiatan.kontrak_pelaksana" name="kontrak_pelaksana" id="kontrak_pelaksana" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="tanggal_kontrak" class="font-bold block mb-1">Tanggal Kontrak</label>
                <input v-model="laporan_kegiatan.tanggal_kontrak" name="tanggal_kontrak" id="tanggal_kontrak" type="date" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="tanggal_spmk" class="font-bold block mb-1">Tanggal SPMK</label>
                <input v-model="laporan_kegiatan.tanggal_spmk" name="tanggal_spmk" id="tanggal_spmk" type="date" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="tanggal_selesai_kontrak" class="font-bold block mb-1">Tanggal Selesai Kontrak</label>
                <input v-model="laporan_kegiatan.tanggal_selesai_kontrak" name="tanggal_selesai_kontrak" id="tanggal_selesai_kontrak" type="date" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="tanggal_laporan" class="font-bold block mb-1">Tanggal Laporan</label>
                <input v-model="laporan_kegiatan.tanggal_laporan" name="tanggal_laporan" id="tanggal_laporan" type="date" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="keterangan" class="font-bold block mb-1">Keterangan</label>
                <textarea v-model="laporan_kegiatan.keterangan" rows="4" name="keterangan" id="keterangan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline"></textarea>
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
    import { ref, onMounted } from "vue";
    import { useRouter, useRoute } from "vue-router";
    import { useAuthStore } from "@/stores/auth";

    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();
    const laporan_kegiatan = ref(null);
    const lapKondisiJalans = ref([]);
    const sumberDanas = ref([]);

    // Update the laporan_kegiatan data
    const updateLaporanKegiatan = async () => {

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

        try {
            await axios.put(`http://localhost:8000/api/laporan_kegiatans/${laporan_kegiatan.value.id}`, {
                id_jalan: laporan_kegiatan.value.id_jalan,
                id_sumber_dana: laporan_kegiatan.value.id_sumber_dana,
                kegiatan: laporan_kegiatan.value.kegiatan,
                lokasi: laporan_kegiatan.value.lokasi,
                anggaran_kes: laporan_kegiatan.value.anggaran_kes,
                anggaran_fisik: laporan_kegiatan.value.anggaran_fisik,
                nilai_kontrak: laporan_kegiatan.value.nilai_kontrak,
                realisasi: laporan_kegiatan.value.realisasi,
                total_anggaran: laporan_kegiatan.value.total_anggaran,
                sisa_anggaran: laporan_kegiatan.value.sisa_anggaran,
                sisa_tender: laporan_kegiatan.value.sisa_tender,
                realisasi_fisik: laporan_kegiatan.value.realisasi_fisik,
                denda_keterlambatan: laporan_kegiatan.value.denda_keterlambatan,
                kontrak_pelaksana: laporan_kegiatan.value.kontrak_pelaksana,
                tanggal_kontrak: laporan_kegiatan.value.tanggal_kontrak,
                tanggal_spmk: laporan_kegiatan.value.tanggal_spmk,
                tanggal_selesai_kontrak: laporan_kegiatan.value.tanggal_selesai_kontrak,
                keterangan: laporan_kegiatan.value.keterangan,
                tanggal_laporan: laporan_kegiatan.value.tanggal_laporan,
            },
            {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            // SweetAlert notification after successful update
            Swal.fire({
                icon: 'success',
                title: 'Data diedit',
                text: 'Data Laporan berhasil diedit!',
            });

            router.push(`/listlaporan`);
        } catch (error) {
            console.error('Error updating laporan laporan:', error);
            // Show error message to the user using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Gagal Memperbarui Data',
                text: errorMessage,
            });
        }
    };

    onMounted(async () => {
        try {
            // Fetch laporan_kegiatan, lap_kondisi_jalans, and sumber_danas
            const [
                laporanResponse,
                jalanResponse,
                danaResponse
            ] = await Promise.all([
                axios.get(`http://localhost:8000/api/laporan_kegiatans/${route.params.id}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`,
                    },
                }),
                axios.get("http://localhost:8000/api/lap_kondisi_jalans", {
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`,
                    },
                }),
                axios.get("http://localhost:8000/api/sumber_danas", {
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`,
                    },
                })
            ]);

            // Set laporan_kegiatan value
            laporan_kegiatan.value = laporanResponse.data.data;
            lapKondisiJalans.value = jalanResponse.data.data;
            sumberDanas.value = danaResponse.data.data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    const cancel = () => {
        router.go(-1);
    };
</script>