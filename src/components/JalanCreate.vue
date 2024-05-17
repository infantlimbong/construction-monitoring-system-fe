<template>
    <div class="p-5">
        <h1 class="text-2xl mb-5">Tambah Laporan Jalan</h1>

        <form @submit.prevent="createLapKondisiJalan" class="max-w-full mx-auto mt-5">
            <div class="mb-4">
                <label for="no_ruas_jalan" class="font-bold block mb-1">No. Ruas Jalan <span class="text-red-500 text-xs">*</span></label>
                <input v-model="no_ruas_jalan" name="no_ruas_jalan" id="no_ruas_jalan" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="nama_ruas_jalan" class="font-bold block mb-1">Nama Ruas Jalan <span class="text-red-500 text-xs">*</span></label>
                <input v-model="nama_ruas_jalan" name="nama_ruas_jalan" id="nama_ruas_jalan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="panjang_ruas_jalan" class="font-bold block mb-1">Panjang Ruas Jalan (M) <span class="text-red-500 text-xs">*</span></label>
                <input v-model="panjang_ruas_jalan" name="panjang_ruas_jalan" id="panjang_ruas_jalan" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <!-- Kabupaten Selection -->
            <div class="mb-4">
                <label for="id_kabupaten" class="font-bold block mb-1">Kabupaten <span class="text-red-500 text-xs">*</span></label>
                <select id="id_kabupaten" v-model="selectedKabupaten" @change="fetchKecamatans" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                    <option value="">Select Kabupaten</option>
                    <option v-for="kabupaten in kabupatens" :key="kabupaten.id" :value="kabupaten.id">{{ kabupaten.nama_kabupaten }}</option>
                </select>
            </div>

            <!-- Kecamatan Selection -->
            <div class="mb-4">
                <label for="id_kecamatan" class="font-bold block mb-1">Kecamatan <span class="text-red-500 text-xs">*</span></label>
                <select id="id_kecamatan" v-model="selectedKecamatan" @change="fetchDesas" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                    <option value="">Select Kecamatan</option>
                    <option v-for="kecamatan in kecamatans" :key="kecamatan.id" :value="kecamatan.id">{{ kecamatan.nama_kecamatan }}</option>
                </select>
            </div>

            <!-- Desa Selection -->
            <div class="mb-4">
                <label for="id_desa" class="font-bold block mb-1">Desa <span class="text-red-500 text-xs">*</span></label>
                <select id="id_desa" v-model="selectedDesa" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                    <option value="">Select Desa</option>
                    <option v-for="desa in desas" :key="desa.id" :value="desa.id">{{ desa.nama_desa }}</option>
                </select>
            </div>
            <div class="mb-4">
                <label for="status_jalan" class="font-bold block mb-1">Status Jalan <span class="text-red-500 text-xs">*</span></label>
                <input v-model="status_jalan" name="status_jalan" id="status_jalan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="flex flex-col md:flex-row md:gap-x-5 md:mb-5">
                <div class="mb-4 w-full">
                    <label for="kondisi_baik" class="font-bold block mb-1">Kondisi Baik (<span>{{ kondisi_baik }}</span>%)</label>
                    <input v-model="kondisi_baik" name="kondisi_baik" id="kondisi_baik" type="range" class="w-full">
                </div>
                <div class="mb-4 w-full">
                    <label for="kondisi_cukup_baik" class="font-bold block mb-1">Kondisi Cukup Baik (<span>{{ kondisi_cukup_baik }}</span>%)</label>
                    <input v-model="kondisi_cukup_baik" name="kondisi_cukup_baik" id="kondisi_cukup_baik" type="range" class="w-full">
                </div>
            </div>
            <div class="flex flex-col md:flex-row md:gap-x-5">
                <div class="mb-4 w-full">
                    <label for="kondisi_rusak_ringan" class="font-bold block mb-1">Kondisi Rusak Ringan (<span>{{ kondisi_rusak_ringan }}</span>%)</label>
                    <input v-model="kondisi_rusak_ringan" name="kondisi_rusak_ringan" id="kondisi_rusak_ringan" type="range" class="w-full">
                </div>
                <div class="mb-4 w-full">
                    <label for="kondisi_rusak_berat" class="font-bold block mb-1">Kondisi Rusak Berat (<span>{{ kondisi_rusak_berat }}</span>%)</label>
                    <input v-model="kondisi_rusak_berat" name="kondisi_rusak_berat" id="kondisi_rusak_berat" type="range" class="w-full">
                </div>
            </div>
            <div class="mb-4">
                <label for="keseluruhan_kondisi" class="font-bold block mb-1">Keseluruhan Kondisi</label>
                <select id="keseluruhan_kondisi" v-model="keseluruhan_kondisi" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                    <option value="Baik">Baik</option>
                    <option value="Cukup Baik">Cukup Baik</option>
                    <option value="Buruk">Buruk</option>
                    <option value="Sangat Buruk">Sangat Buruk</option>
                </select>
            </div>
            <div class="mb-4">
                <label for="progress" class="font-bold block mb-1">Progress Pembangunan (<span>{{ progress }}</span>%)</label>
                <input v-model="progress" name="progress" id="progress" type="range" class="w-full">
            </div>
            <div class="mb-4">
                <label for="tahun_pembangunan" class="font-bold block mb-1">Tahun Pembangunan <span class="text-red-500 text-xs">*</span></label>
                <select id="tahun_pembangunan" v-model="tahun_pembangunan" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>
            <div class="mb-4">
                <label for="koordinat_jalan" class="font-bold block mb-1">Koordinat Jalan</label>
                <input v-model="koordinat_jalan" name="koordinat_jalan" id="koordinat_jalan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="gambar_jalan" class="font-bold block mb-1">Gambar Jalan</label>
                <input type="file" id="gambar_jalan" @change="handleFileChange" ref="gambar_jalan" accept="image/*" multiple class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                <!-- <input v-model="gambar_jalan" name="gambar_jalan" id="gambar_jalan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline"> -->
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
    const router = useRouter();
    const no_ruas_jalan = ref("");
    const nama_ruas_jalan = ref("");
    const panjang_ruas_jalan = ref("");
    const status_jalan = ref("");
    const kondisi_baik = ref("0");
    const kondisi_cukup_baik = ref("0");
    const kondisi_rusak_ringan = ref("0");
    const kondisi_rusak_berat = ref("0");
    const keseluruhan_kondisi = ref("");
    const progress = ref("0");
    const tahun_pembangunan = ref(new Date().getFullYear());
    const years = ref([]);
    const koordinat_jalan = ref("");
    const gambar_jalan = ref([]);
    const desas = ref([]);
    const kabupatens = ref([]);
    const kecamatans = ref([]);
    const selectedKabupaten = ref("");
    const selectedKecamatan = ref("");
    const selectedDesa = ref("");

    const handleFileChange = (event) => {
        const files = event.target.files;
        // Set the selected files to the gambar_jalan variable
        gambar_jalan.value = files;
    };

    // Watch for changes in the selected files
    watch(gambar_jalan, (newValue) => {
        console.log("Selected files:", newValue);
    });

    const fetchKabupatens = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/kabupatens", {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`
                }
            });
            kabupatens.value = response.data.data;
        } catch (error) {
            console.error("Error fetching kabupatens:", error);
        }
    };

    const fetchKecamatans = async () => {
        if (!selectedKabupaten.value) return;
        try {
            const response = await axios.get(`http://localhost:8000/api/kecamatans/by-kabupaten/${selectedKabupaten.value}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`
                }
            });
            kecamatans.value = response.data.data;
        } catch (error) {
            console.error("Error fetching kecamatans:", error);
        }
    };

    const fetchDesas = async () => {
        if (!selectedKecamatan.value) return;
        try {
            const response = await axios.get(`http://localhost:8000/api/desas/by-kecamatan/${selectedKecamatan.value}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`
                }
            });
            desas.value = response.data.data;
        } catch (error) {
            console.error("Error fetching desas:", error);
        }
    };

    onMounted(fetchKabupatens);

    // Function to generate an array of years
    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const startYear = 2015; // Change this if you want to start from a different year
        const yearRange = currentYear - startYear + 1;
        years.value = Array.from({ length: yearRange }, (_, index) => startYear + index).reverse();
    };

    // Call the function to generate the years array
    generateYears();

    // Watch for changes in kondisi fields and update keseluruhan_kondisi
    watch([kondisi_baik, kondisi_cukup_baik, kondisi_rusak_ringan, kondisi_rusak_berat], () => {
        let totalBaikCukupBaik = Number(kondisi_baik.value * 0.75) + Number(kondisi_cukup_baik.value * 0.25);
        let totalRusakBeratRingan = Number(kondisi_rusak_ringan.value * 0.25) + Number(kondisi_rusak_berat.value * 0.75);

        if (totalBaikCukupBaik >= 70) {
            keseluruhan_kondisi.value = "Baik";
        } else if (totalBaikCukupBaik >= 30 && totalBaikCukupBaik < 70) {
            keseluruhan_kondisi.value = "Cukup Baik";
        } else if (totalRusakBeratRingan >= 70) {
            keseluruhan_kondisi.value = "Sangat Buruk";
        } else {
            keseluruhan_kondisi.value = "Buruk";
        }
    });

    const createLapKondisiJalan = async () => {
        // Alert message if the form empty / invalid
        if (!no_ruas_jalan.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Nomor ruas jalan harus diisi'
            });
            return;
        }

        if (!nama_ruas_jalan.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Nama ruas jalan harus diisi'
            });
            return;
        }

        if (!panjang_ruas_jalan.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Panjang ruas harus diisi'
            });
            return;
        }

        if (!selectedDesa.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Desa harus dipilih'
            });
            return;
        }

        if (!status_jalan.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Status jalan harus diisi'
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

        if (!gambar_jalan.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Pilih setidaknya 1 gambar'
            });
            return;
        }

        // Create a FormData object to handle file uploads
        const formData = new FormData();
        for (let i = 0; i < gambar_jalan.value.length; i++) {
            formData.append("gambar_jalan[]", gambar_jalan.value[i]);
        }

        // Append other form data to the FormData object
        formData.append("id_user", authStore.user.id);
        formData.append("no_ruas_jalan", no_ruas_jalan.value);
        formData.append("nama_ruas_jalan", nama_ruas_jalan.value);
        formData.append("panjang_ruas_jalan", panjang_ruas_jalan.value);
        formData.append("id_desa", selectedDesa.value);
        formData.append("status_jalan", status_jalan.value);
        formData.append("kondisi_baik", kondisi_baik.value);
        formData.append("kondisi_cukup_baik", kondisi_cukup_baik.value);
        formData.append("kondisi_rusak_ringan", kondisi_rusak_ringan.value);
        formData.append("kondisi_rusak_berat", kondisi_rusak_berat.value);
        formData.append("keseluruhan_kondisi", keseluruhan_kondisi.value);
        formData.append("tahun_pembangunan", tahun_pembangunan.value);
        formData.append("koordinat_jalan", koordinat_jalan.value);
        formData.append("progress", progress.value);

        try {
            await axios.post("http://localhost:8000/api/lap_kondisi_jalans", formData, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // SweetAlert notification after successful creation
            Swal.fire({
                icon: 'success',
                title: 'Data dibuat',
                text: 'Data laporan jalan berhasil dibuat!',
            });

            router.push("/listjalan");
        } catch (error) {
            console.error('Error creating data:', error);
        }
    };

    const cancel = () => {
        router.go(-1);
    };
</script>