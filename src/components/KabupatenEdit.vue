<template>
    <div class="p-5">
        <h1 class="text-2xl mb-5">Edit Kabupaten</h1>

        <form v-if="kabupaten" @submit.prevent="updateKabupaten" class="max-w-full mx-auto mt-5">
            <div class="mb-4">
                <label for="nama_kabupaten" class="font-bold block mb-1">Nama Kabupaten</label>
                <input v-model="kabupaten.nama_kabupaten" type="text" name="nama_kabupaten" id="nama_kabupaten" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:shadow-outline">
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
    const kabupaten = ref(null);

    // Fetch the kabupaten data with the provided ID
    onMounted(async () => {
        const response = await axios.get(`http://localhost:8000/api/kabupatens/${route.params.id}`, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        kabupaten.value = response.data.data;
    });

    // Update the kabupaten data
    const updateKabupaten = async () => {
        try {
            await axios.put(`http://localhost:8000/api/kabupatens/${kabupaten.value.id}`, {
                nama_kabupaten: kabupaten.value.nama_kabupaten
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
                text: 'Data Kabupaten berhasil diedit!',
            });

            router.push(`/listkabupaten`);
        } catch (error) {
            console.error('Error updating kabupaten:', error);
        }
    };

    const cancel = () => {
        router.go(-1);
    };
</script>

