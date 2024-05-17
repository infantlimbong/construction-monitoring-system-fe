<template>
    <div class="p-5">
        <h1 class="text-2xl mb-5">Edit Laporan Jalan</h1>

        <form v-if="lap_kondisi_jalan" @submit.prevent="updateLapKondisiJalan" class="max-w-full mx-auto mt-5">
            <div class="mb-4">
                <label for="no_ruas_jalan" class="font-bold block mb-1">No. Ruas Jalan</label>
                <input :disabled="!isAdmin && !isKaryawan1" v-model="lap_kondisi_jalan.no_ruas_jalan" name="no_ruas_jalan" id="no_ruas_jalan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="nama_ruas_jalan" class="font-bold block mb-1">Nama Ruas Jalan</label>
                <input :disabled="!isAdmin && !isKaryawan1" v-model="lap_kondisi_jalan.nama_ruas_jalan" name="nama_ruas_jalan" id="nama_ruas_jalan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="panjang_ruas_jalan" class="font-bold block mb-1">Panjang Ruas Jalan</label>
                <input v-model="lap_kondisi_jalan.panjang_ruas_jalan" name="panjang_ruas_jalan" id="panjang_ruas_jalan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="id_desa" class="font-bold block mb-1">Desa</label>
                <select disabled v-model="lap_kondisi_jalan.id_desa" id="id_desa" name="id_desa" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                    <option v-for="desa in desas" :key="desa.id" :value="desa.id">{{ desa.nama_desa }}</option>
                </select>
            </div>
            <div class="mb-4">
                <label for="status_jalan" class="font-bold block mb-1">Status Jalan</label>
                <input v-model="lap_kondisi_jalan.status_jalan" name="status_jalan" id="status_jalan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="flex flex-col md:flex-row md:gap-x-5 md:mt-10">
                <div class="mb-4 w-full">
                    <label for="kondisi_baik" class="font-bold block mb-1">Kondisi Baik (<span>{{ lap_kondisi_jalan.kondisi_baik }}</span>%)</label>
                    <input v-model="lap_kondisi_jalan.kondisi_baik" name="kondisi_baik" id="kondisi_baik" type="range" class="w-full">
                </div>
                <div class="mb-4 w-full">
                    <label for="kondisi_cukup_baik" class="font-bold block mb-1">Kondisi Cukup Baik (<span>{{ lap_kondisi_jalan.kondisi_cukup_baik }}</span>%)</label>
                    <input v-model="lap_kondisi_jalan.kondisi_cukup_baik" name="kondisi_cukup_baik" id="kondisi_cukup_baik" type="range" class="w-full">
                </div>
            </div>
            <div class="flex flex-col md:flex-row md:gap-x-5 md:mb-5">
                <div class="mb-4 w-full">
                    <label for="kondisi_rusak_ringan" class="font-bold block mb-1">Kondisi Rusak Ringan (<span>{{ lap_kondisi_jalan.kondisi_rusak_ringan }}</span>%)</label>
                    <input v-model="lap_kondisi_jalan.kondisi_rusak_ringan" name="kondisi_rusak_ringan" id="kondisi_rusak_ringan" type="range" class="w-full">
                </div>
                <div class="mb-4 w-full">
                    <label for="kondisi_rusak_berat" class="font-bold block mb-1">Kondisi Rusak Berat (<span>{{ lap_kondisi_jalan.kondisi_rusak_berat }}</span>%)</label>
                    <input v-model="lap_kondisi_jalan.kondisi_rusak_berat" name="kondisi_rusak_berat" id="kondisi_rusak_berat" type="range" class="w-full">
                </div>
            </div>
            <div class="mb-4">
                <label for="keseluruhan_kondisi" class="font-bold block mb-1">Keseluruhan Kondisi</label>
                <!-- <input v-model="lap_kondisi_jalan.keseluruhan_kondisi" name="keseluruhan_kondisi" id="keseluruhan_kondisi" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline"> -->
                <select id="keseluruhan_kondisi" v-model="lap_kondisi_jalan.keseluruhan_kondisi" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                    <option value="Baik">Baik</option>
                    <option value="Cukup Baik">Cukup Baik</option>
                    <option value="Buruk">Buruk</option>
                    <option value="Sangat Buruk">Sangat Buruk</option>
                </select>
            </div>
            <div class="mb-4">
                <label for="progress" class="font-bold block mb-1">Progress Pembangunan (<span>{{ lap_kondisi_jalan.progress }}</span>%)</label>
                <input v-model="lap_kondisi_jalan.progress" name="progress" id="progress" type="range" class="w-full">
            </div>
            <div class="mb-4">
                <label for="tahun_pembangunan" class="font-bold block mb-1">Tahun Pembangunan</label>
                <select id="tahun_pembangunan" v-model="lap_kondisi_jalan.tahun_pembangunan" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                    <option v-for="year in years" :key="year">{{ year }}</option>
                </select>
            </div>
            <div class="mb-4">
                <label for="koordinat_jalan" class="font-bold block mb-1">Koordinat Jalan</label>
                <input v-model="lap_kondisi_jalan.koordinat_jalan" name="koordinat_jalan" id="koordinat_jalan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4 hidden">
                <label for="gambar_jalan" class="font-bold block mb-1">Gambar Jalan</label>
                <!-- <input type="file" id="gambar_jalan" @change="handleFileUpload" accept="image/*" multiple class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline"> -->
                <input disabled v-model="lap_kondisi_jalan.gambar_jalan" name="gambar_jalan" id="gambar_jalan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
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
    import { ref, onMounted, computed, watch } from "vue";
    import { useRouter, useRoute } from "vue-router";
    import { useAuthStore } from "@/stores/auth";

    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();

    const lap_kondisi_jalan = ref(null);
    const desas = ref([]);
    const years = ref([]);


    // Function to generate an array of years
    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const startYear = 2015; // Change this if you want to start from a different year
        const yearRange = currentYear - startYear + 1;
        years.value = Array.from({ length: yearRange }, (_, index) => startYear + index).reverse();
    };

    // Fetch desas data and initialize lap_kondisi_jalan
    onMounted(async () => {
        const response = await axios.get(`http://localhost:8000/api/lap_kondisi_jalans/${route.params.id}`, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        lap_kondisi_jalan.value = response.data.data;

        const desaResponse = await axios.get("http://localhost:8000/api/desas", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        desas.value = desaResponse.data.data;

        generateYears();
    });

    // Update the lap_kondisi_jalan data
    const updateLapKondisiJalan = async () => {

        // Alert message if the form empty / invalid
        if (!lap_kondisi_jalan.value.no_ruas_jalan) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Nomor ruas jalan harus diisi'
            });
            return;
        }

        if (!lap_kondisi_jalan.value.nama_ruas_jalan) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Nama ruas jalan harus diisi'
            });
            return;
        }

        if (!lap_kondisi_jalan.value.panjang_ruas_jalan) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Panjang ruas jalan harus diisi'
            });
            return;
        }

        if (!lap_kondisi_jalan.value.id_desa) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Desa harus dipilih'
            });
            return;
        }

        if (!lap_kondisi_jalan.value.status_jalan) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Status jalan harus diisi'
            });
            return;
        }

        if (!lap_kondisi_jalan.value.tahun_pembangunan) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Tahun pembangunan harus diisi'
            });
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/lap_kondisi_jalans/${lap_kondisi_jalan.value.id}`, {
                no_ruas_jalan: lap_kondisi_jalan.value.no_ruas_jalan,
                nama_ruas_jalan: lap_kondisi_jalan.value.nama_ruas_jalan,
                panjang_ruas_jalan: lap_kondisi_jalan.value.panjang_ruas_jalan,
                id_desa: lap_kondisi_jalan.value.id_desa,
                status_jalan: lap_kondisi_jalan.value.status_jalan,
                kondisi_baik: lap_kondisi_jalan.value.kondisi_baik,
                kondisi_cukup_baik: lap_kondisi_jalan.value.kondisi_cukup_baik,
                kondisi_rusak_ringan: lap_kondisi_jalan.value.kondisi_rusak_ringan,
                kondisi_rusak_berat: lap_kondisi_jalan.value.kondisi_rusak_berat,
                keseluruhan_kondisi: lap_kondisi_jalan.value.keseluruhan_kondisi,
                tahun_pembangunan: lap_kondisi_jalan.value.tahun_pembangunan,
                koordinat_jalan: lap_kondisi_jalan.value.koordinat_jalan,
                progress: lap_kondisi_jalan.value.progress,
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
                text: 'Data kondisi jalan berhasil diedit!',
            });

            // Redirect to the desired route after successful update
            router.push(`/listjalan`);
        } catch (error) {
            console.error('Error updating laporan jalan:', error);
            // Show error message to the user using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Gagal Memperbarui Data',
                text: 'Terjadi kesalahan saat memperbarui data.',
            });
        }
    };

    // Check user's role level
    const isAdmin = computed(() => {
        return authStore.user && authStore.user.data && authStore.user.data.id_role === 1;
    });
    const isKaryawan1 = computed(() => {
        return authStore.user && authStore.user.data && authStore.user.data.id_role === 2;
    });

    const cancel = () => {
        router.go(-1);
    };
</script>