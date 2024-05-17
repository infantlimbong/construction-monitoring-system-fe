<template>
    <div class="p-5">
        <h1 class="text-2xl mb-5">Tambah Desa</h1>

        <form @submit.prevent="createDesa" class="max-w-full mx-auto mt-5">
            <div class="mb-4">
                <label for="nama_desa" class="font-bold block mb-1">Nama desa</label>
                <input v-model="nama_desa" name="nama_desa" id="nama_desa" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="id_kecamatan" class="font-bold block mb-1">Kecamatan</label>
                <select id="id_kecamatan" v-model="selectedKecamatan" @change="fetchKecamatanName" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                    <option v-for="kecamatan in kecamatans" :key="kecamatan.id" :value="kecamatan.id">{{ kecamatan.nama_kecamatan }}</option>
                </select>
            </div>
            <!-- Display kecamatan name -->
            <p v-if="kecamatanName">{{ kecamatanName }}</p>
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
    const nama_desa = ref("");
    const selectedKecamatan = ref("");
    const kecamatanName = ref("");
    const kecamatans = ref([]);

    const createDesa = async () => {
        // Alert message if the form empty / invalid
        if (!nama_desa.value) {
            alert('Nama Desa harus diisi');
            return;
        }

        if (!selectedKecamatan.value) {
            alert('kecamatan harus dipilih');
            return;
        }

        try {
            await axios.post("http://localhost:8000/api/desas", {
                id_kecamatan: selectedKecamatan.value,
                nama_desa: nama_desa.value
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
                text: 'Data desa berhasil dibuat!',
            });

            router.push("/listdesa");
        } catch (error) {
            console.error('Error creating desa:', error);
        }
    };

    // Fetch kecamatans on component mount
    onMounted(async () => {
        const response = await axios.get("http://localhost:8000/api/kecamatans", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        kecamatans.value = response.data.data;
    });

    // Fetch kecamatan name based on selected ID
    const fetchKecamatanName = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/kecamatans/${selectedKecamatan.value}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            
            kecamatanName.value = response.data.nama_kecamatan;
        } catch (error) {
            console.error("Error fetching kecamatan name:", error);
            kecamatanName.value = ""; // Clear kecamatan name if error occurs
        }
    };

    // Watch for changes in id_kecamatan and fetch kecamatan name
    watch(selectedKecamatan, fetchKecamatanName);

    const cancel = () => {
        router.go(-1);
    };

</script>
