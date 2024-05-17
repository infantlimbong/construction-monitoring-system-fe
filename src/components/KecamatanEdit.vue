<template>
    <div class="p-5">
        <h1 class="text-2xl mb-5">Edit Kecamatan</h1>

        <form v-if="kecamatan" @submit.prevent="updateKecamatan" class="max-w-full mx-auto mt-5">
            <div class="mb-4">
                <label for="nama_kecamatan" class="font-bold block mb-1">Nama Kecamatan</label>
                <input v-model="kecamatan.nama_kecamatan" type="text" name="nama_kecamatan" id="nama_kecamatan" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="id_kabupaten" class="font-bold block mb-1">Kabupaten</label>
                <select v-model="kecamatan.id_kabupaten" name="id_kabupaten" id="id_kabupaten" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:shadow-outline">
                    <option v-for="kabupaten in kabupatens" :key="kabupaten.id" :value="kabupaten.id">{{ kabupaten.nama_kabupaten }}</option>
                </select>
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
    const kecamatan = ref(null);
    const kabupatens = ref([]);

    // Fetch the kecamatan data with the provided ID
    onMounted(async () => {
        const response = await axios.get(`http://localhost:8000/api/kecamatans/${route.params.id}`, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        kecamatan.value = response.data.data;

        // Fetch kabupatens data
        const kabupatenResponse = await axios.get("http://localhost:8000/api/kabupatens", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        kabupatens.value = kabupatenResponse.data.data;
    });

    // Update the kecamatan data
    const updateKecamatan = async () => {
        try {
            await axios.put(`http://localhost:8000/api/kecamatans/${kecamatan.value.id}`, {
                nama_kecamatan: kecamatan.value.nama_kecamatan,
                id_kabupaten: kecamatan.value.id_kabupaten,
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
                text: 'Data Kecamatan berhasil diedit!',
            });

            router.push(`/listkecamatan`);
        } catch (error) {
            console.error('Error updating kecamatan:', error);
        }
    };

    const cancel = () => {
        router.go(-1);
    };
</script>

