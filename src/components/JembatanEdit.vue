<template>
    <div class="p-5">
        <h1 class="text-2xl mb-5">Edit Laporan Jembatan</h1>

        <form v-if="lap_kondisi_jembatan" @submit.prevent="updateLapKondisiJembatan" class="max-w-full mx-auto mt-5">
            <div class="mb-4">
                <label for="no_ruas_jembatan" class="font-bold block mb-1">No. Jembatan</label>
                <input :disabled="!isAdmin && !isKaryawan1" v-model="lap_kondisi_jembatan.no_ruas_jembatan" name="no_ruas_jembatan" id="no_ruas_jembatan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="nama_ruas_jembatan" class="font-bold block mb-1">Nama Jembatan</label>
                <input :disabled="!isAdmin && !isKaryawan1" v-model="lap_kondisi_jembatan.nama_ruas_jembatan" name="nama_ruas_jembatan" id="nama_ruas_jembatan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="panjang_ruas_jembatan" class="font-bold block mb-1">Panjang Ruas Jembatan</label>
                <input v-model="lap_kondisi_jembatan.panjang_ruas_jembatan" name="panjang_ruas_jembatan" id="panjang_ruas_jembatan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="id_desa" class="font-bold block mb-1">Desa</label>
                <select disabled v-model="lap_kondisi_jembatan.id_desa" id="id_desa" name="id_desa" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                    <option v-for="desa in desas" :key="desa.id" :value="desa.id">{{ desa.nama_desa }}</option>
                </select>
            </div>
            <div class="mb-4">
                <label for="status_jembatan" class="font-bold block mb-1">Status Jembatan</label>
                <input v-model="lap_kondisi_jembatan.status_jembatan" name="status_jembatan" id="status_jembatan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="flex flex-col md:flex-row md:gap-x-5 md:mb-5">
                <div class="mb-4 w-full">
                    <label for="kondisi_baik" class="font-bold block mb-1">Kondisi Baik (<span>{{ lap_kondisi_jembatan.kondisi_baik }}</span>%)</label>
                    <input v-model="lap_kondisi_jembatan.kondisi_baik" name="kondisi_baik" id="kondisi_baik" type="range" class="w-full">
                </div>
                <div class="mb-4 w-full">
                    <label for="kondisi_cukup_baik" class="font-bold block mb-1">Kondisi Cukup Baik (<span>{{ lap_kondisi_jembatan.kondisi_cukup_baik }}</span>%)</label>
                    <input v-model="lap_kondisi_jembatan.kondisi_cukup_baik" name="kondisi_cukup_baik" id="kondisi_cukup_baik" type="range" class="w-full">
                </div>
            </div>
            <div class="flex flex-col md:flex-row md:gap-x-5 md:mb-5">
                <div class="mb-4 w-full">
                    <label for="kondisi_rusak_ringan" class="font-bold block mb-1">Kondisi Rusak Ringan (<span>{{ lap_kondisi_jembatan.kondisi_rusak_ringan }}</span>%)</label>
                    <input v-model="lap_kondisi_jembatan.kondisi_rusak_ringan" name="kondisi_rusak_ringan" id="kondisi_rusak_ringan" type="range" class="w-full">
                </div>
                <div class="mb-4 w-full">
                    <label for="kondisi_rusak_berat" class="font-bold block mb-1">Kondisi Rusak Berat (<span>{{ lap_kondisi_jembatan.kondisi_rusak_berat }}</span>%)</label>
                    <input v-model="lap_kondisi_jembatan.kondisi_rusak_berat" name="kondisi_rusak_berat" id="kondisi_rusak_berat" type="range" class="w-full">
                </div>
            </div>
            <div class="mb-4">
                <label for="keseluruhan_kondisi" class="font-bold block mb-1">Keseluruhan Kondisi</label>
                <select id="keseluruhan_kondisi" v-model="lap_kondisi_jembatan.keseluruhan_kondisi" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                    <option value="Baik">Baik</option>
                    <option value="Cukup Baik">Cukup Baik</option>
                    <option value="Buruk">Buruk</option>
                    <option value="Sangat Buruk">Sangat Buruk</option>
                </select>
            </div>
            <div class="mb-4">
                <label for="progress" class="font-bold block mb-1">Progress Pembangunan (<span>{{ lap_kondisi_jembatan.progress }}</span>%)</label>
                <input v-model="lap_kondisi_jembatan.progress" name="progress" id="progress" type="range" class="w-full">
            </div>
            <div class="mb-4">
                <label for="tahun_pembangunan" class="font-bold block mb-1">Tahun Pembangunan</label>
                <select id="tahun_pembangunan" v-model="lap_kondisi_jembatan.tahun_pembangunan" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                    <option v-for="year in years" :key="year">{{ year }}</option>
                </select>
            </div>
            <div class="mb-4">
                <label for="koordinat_jembatan" class="font-bold block mb-1">Koordinat Jembatan</label>
                <input v-model="lap_kondisi_jembatan.koordinat_jembatan" name="koordinat_jembatan" id="koordinat_jembatan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4 hidden">
                <label for="gambar_jembatan" class="font-bold block mb-1">Gambar Jembatan</label>
                <!-- <input type="file" id="gambar_jembatan" ref="gambar_jembatan" accept="image/*" multiple class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline"> -->
                <input v-model="lap_kondisi_jembatan.gambar_jembatan" name="gambar_jembatan" id="gambar_jembatan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
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
    import { ref, onMounted, computed } from "vue";
    import { useRouter, useRoute } from "vue-router";
    import { useAuthStore } from "@/stores/auth";

    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();

    const lap_kondisi_jembatan = ref(null);
    const desas = ref([]);
    const years = ref([]);

    // Function to generate an array of years
    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const startYear = 2010; // Change this if you want to start from a different year
        const yearRange = currentYear - startYear + 1;
        years.value = Array.from({ length: yearRange }, (_, index) => startYear + index).reverse();
    };

    // Fetch desas data and initialize lap_kondisi_jembatan
    onMounted(async () => {
        const response = await axios.get(`http://localhost:8000/api/lap_kondisi_jembatans/${route.params.id}`, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        lap_kondisi_jembatan.value = response.data.data;

        const desaResponse = await axios.get("http://localhost:8000/api/desas", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        desas.value = desaResponse.data.data;

        generateYears();
    });

    // Update the lap_kondisi_jembatan data
    const updateLapKondisiJembatan = async () => {

        // Alert message if the form empty / invalid
        if (!nama_ruas_jembatan.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Nama jembatan harus diisi'
            });
            return;
        }

        if (!no_ruas_jembatan.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Nomor jembatan harus diisi'
            });
            return;
        }

        if (!panjang_ruas_jembatan.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Panjang jembatan harus diisi'
            });
            return;
        }

        if (!id_desa.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Desa harus dipilih'
            });
            return;
        }

        if (!status_jembatan.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Status jembatan harus diisi'
            });
            return;
        }

        if (!tahun_pembangunan.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Tahun pembangunan harus diisi'
            });
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/lap_kondisi_jembatans/${lap_kondisi_jembatan.value.id}`, {
                no_ruas_jembatan: lap_kondisi_jembatan.value.no_ruas_jembatan,
                nama_ruas_jembatan: lap_kondisi_jembatan.value.nama_ruas_jembatan,
                panjang_ruas_jembatan: lap_kondisi_jembatan.value.panjang_ruas_jembatan,
                id_desa: lap_kondisi_jembatan.value.id_desa,
                status_jembatan: lap_kondisi_jembatan.value.status_jembatan,
                kondisi_baik: lap_kondisi_jembatan.value.kondisi_baik,
                kondisi_cukup_baik: lap_kondisi_jembatan.value.kondisi_cukup_baik,
                kondisi_rusak_ringan: lap_kondisi_jembatan.value.kondisi_rusak_ringan,
                kondisi_rusak_berat: lap_kondisi_jembatan.value.kondisi_rusak_berat,
                keseluruhan_kondisi: lap_kondisi_jembatan.value.keseluruhan_kondisi,
                tahun_pembangunan: lap_kondisi_jembatan.value.tahun_pembangunan,
                koordinat_jembatan: lap_kondisi_jembatan.value.koordinat_jembatan,
                progress: lap_kondisi_jembatan.value.progress,
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
                text: 'Data kondisi jembatan berhasil diedit!',
            });

            router.push(`/listjembatan`);
        } catch (error) {
            console.error('Error updating laporan jembatan:', error);
            // Show error message to the user using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Gagal Memperbarui Data',
                text: errorMessage,
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