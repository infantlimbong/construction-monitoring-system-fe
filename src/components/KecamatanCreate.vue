<template>
    <div class="p-5">
        <h1 class="text-2xl mb-5">Tambah Kecamatan</h1>

        <form @submit.prevent="createKecamatan" class="max-w-full mx-auto mt-5">
            <div class="mb-4">
                <label for="nama_kecamatan" class="font-bold block mb-1">Nama kecamatan</label>
                <input v-model="nama_kecamatan" name="nama_kecamatan" id="nama_kecamatan" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="id_kabupaten" class="font-bold block mb-1">Kabupaten</label>
                <select id="id_kabupaten" v-model="selectedKabupaten" @change="fetchKabupatenName" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                    <option v-for="kabupaten in kabupatens" :key="kabupaten.id" :value="kabupaten.id">{{ kabupaten.nama_kabupaten }}</option>
                </select>
            </div>
            <!-- Display kabupaten name -->
            <p v-if="kabupatenName">{{ kabupatenName }}</p>
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
    const nama_kecamatan = ref("");
    const selectedKabupaten = ref("");
    const kabupatenName = ref("");
    const kabupatens = ref([]);

    const createKecamatan = async () => {
        // Alert message if the form empty / invalid
        if (!nama_kecamatan.value) {
            alert('Nama Kecamatan harus diisi');
            return;
        }

        if (!selectedKabupaten.value) {
            alert('Kabupaten harus dipilih');
            return;
        }

        try {
            await axios.post("http://localhost:8000/api/kecamatans", {
                id_kabupaten: selectedKabupaten.value,
                nama_kecamatan: nama_kecamatan.value
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
                text: 'Data kecamatan berhasil dibuat!',
            });

            router.push("/listkecamatan");
        } catch (error) {
            console.error('Error creating kecamatan:', error);
        }
    };

    // Fetch kabupatens on component mount
    onMounted(async () => {
        const response = await axios.get("http://localhost:8000/api/kabupatens", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        kabupatens.value = response.data.data;
    });

    // Fetch kabupaten name based on selected ID
    const fetchKabupatenName = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/kabupatens/${selectedKabupaten.value}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            kabupatenName.value = response.data.nama_kabupaten;
        } catch (error) {
            console.error("Error fetching kabupaten name:", error);
            kabupatenName.value = ""; // Clear kabupaten name if error occurs
        }
    };

    // Watch for changes in id_kabupaten and fetch kabupaten name
    watch(selectedKabupaten, fetchKabupatenName);

    const cancel = () => {
        router.go(-1);
    };

</script>
