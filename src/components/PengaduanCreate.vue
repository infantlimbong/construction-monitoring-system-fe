<template>
    <div class="">
        <div class="p-5">
            <h1 class="text-2xl mb-5">Tambah Laporan Jalan</h1>

            <form @submit.prevent="createPengaduan" class="max-w-full mx-auto mt-5">
                <!-- Kabupaten Selection -->
                <div class="mb-4">
                    <label for="id_kabupaten" class="font-bold block mb-1">Kabupaten <span class="text-red-500 text-xs">*</span></label>
                    <select id="id_kabupaten" v-model="selectedKabupaten" @change="fetchKecamatans" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                        <option disabled value="">Select Kabupaten</option>
                        <option v-for="kabupaten in kabupatens" :key="kabupaten.id" :value="kabupaten.id">{{ kabupaten.nama_kabupaten }}</option>
                    </select>
                </div>

                <!-- Kecamatan Selection -->
                <div class="mb-4">
                    <label for="id_kecamatan" class="font-bold block mb-1">Kecamatan <span class="text-red-500 text-xs">*</span></label>
                    <select id="id_kecamatan" v-model="selectedKecamatan" @change="fetchDesas" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                        <option disabled value="">Select Kecamatan</option>
                        <option v-for="kecamatan in kecamatans" :key="kecamatan.id" :value="kecamatan.id">{{ kecamatan.nama_kecamatan }}</option>
                    </select>
                </div>

                <!-- Desa Selection -->
                <div class="mb-4">
                    <label for="id_desa" class="font-bold block mb-1">Desa <span class="text-red-500 text-xs">*</span></label>
                    <select id="id_desa" v-model="selectedDesa" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                        <option disabled value="">Select Desa</option>
                        <option v-for="desa in desas" :key="desa.id" :value="desa.id">{{ desa.nama_desa }}</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label for="koordinat" class="font-bold block mb-1">Koordinat / Lokasi Maps  <em>(Opsional)</em></label>
                    <input v-model="koordinat" name="koordinat" id="koordinat" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4">
                    <label for="kondisi" class="font-bold block mb-1">Kondisi <span class="text-red-500 text-xs">*</span></label>
                    <select id="kondisi" v-model="kondisi" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Pilih Kondisi</option>
                        <option value="Baik">Baik</option>
                        <option value="Cukup Baik">Cukup Baik</option>
                        <option value="Buruk">Buruk</option>
                        <option value="Sangat Buruk">Sangat Buruk</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label for="keterangan" class="font-bold block mb-1">Keterangan / Detail Alamat dll. <em>(Opsional)</em></label>
                    <textarea v-model="keterangan" rows="3" name="keterangan" id="keterangan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline"></textarea>
                </div>
                <div class="mb-4">
                    <label for="gambar" class="font-bold block mb-1">Gambar <span class="text-red-500 text-xs">*</span></label>
                    <input type="file" id="gambar" @change="handleFileChange" ref="gambar" accept="image/*" multiple class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="flex items-center gap-2">
                    <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded focus:outline-none focus:shadow-outline">Simpan</button>
                    <button type="button" @click="cancel" class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded inline-block">Batal</button>
                </div>
            </form>
        </div>
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
    const koordinat = ref("");
    const kondisi = ref("");
    const keterangan = ref("");
    const gambar = ref([]);
    const desas = ref([]);
    const kabupatens = ref([]);
    const kecamatans = ref([]);
    const selectedKabupaten = ref("");
    const selectedKecamatan = ref("");
    const selectedDesa = ref("");

    const handleFileChange = (event) => {
        const files = event.target.files;
        gambar.value = files;
    };

    watch(gambar, (newValue) => {
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

    const createPengaduan = async () => {
        if (!selectedDesa.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Desa harus dipilih'
            });
            return;
        }

        if (!kondisi.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Kondisi harus dipilih'
            });
            return;
        }

        if (!gambar.value || gambar.value.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Pilih setidaknya 1 gambar'
            });
            return;
        }

        // const pengunjungId = authStore.pengunjung.id; 
        const formData = new FormData();
        for (let i = 0; i < gambar.value.length; i++) {
            formData.append("gambar[]", gambar.value[i]);
        }

        formData.append("id_user", authStore.user.id);
        formData.append("koordinat", koordinat.value);
        formData.append("kondisi", kondisi.value);
        formData.append("keterangan", keterangan.value);
        formData.append("id_desa", selectedDesa.value);

        try {
            await axios.post("http://localhost:8000/api/pengaduans", formData, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Data dibuat',
                text: 'Pengaduan berhasil dibuat!',
            });

            router.push("/listpengaduanpengunjung");
        } catch (error) {
            console.error('Error creating desa:', error);
        }
    };

    const cancel = () => {
        router.go(-1);
    };
</script>