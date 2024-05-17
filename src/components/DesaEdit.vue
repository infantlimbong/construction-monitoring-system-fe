<template>
    <div class="p-5">
        <h1 class="text-2xl mb-5">Edit Desa</h1>

        <form v-if="desa" @submit.prevent="updateDesa" class="max-w-full mx-auto mt-5">
            <div class="mb-4">
                <label for="nama_desa" class="font-bold block mb-1">Nama Desa</label>
                <input v-model="desa.nama_desa" type="text" name="nama_desa" id="nama_desa" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="id_kecamatan" class="font-bold block mb-1">kecamatan</label>
                <select v-model="desa.id_kecamatan" name="id_kecamatan" id="id_kecamatan" class="shadow border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:shadow-outline">
                    <option v-for="kecamatan in kecamatans" :key="kecamatan.id" :value="kecamatan.id">{{ kecamatan.nama_kecamatan }}</option>
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
    const desa = ref(null);
    const kecamatans = ref([]);

    // Fetch the desa data with the provided ID
    onMounted(async () => {
        const response = await axios.get(`http://localhost:8000/api/desas/${route.params.id}`, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        desa.value = response.data.data;

        // Fetch kecamatans data
        const kecamatanResponse = await axios.get("http://localhost:8000/api/kecamatans", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        kecamatans.value = kecamatanResponse.data.data;
    });

    // Update the desa data
    const updateDesa = async () => {
        try {
            await axios.put(`http://localhost:8000/api/desas/${desa.value.id}`, {
                nama_desa: desa.value.nama_desa,
                id_kecamatan: desa.value.id_kecamatan,
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
                text: 'Data desa berhasil diedit!',
            });

            router.push(`/listdesa`);
        } catch (error) {
            console.error('Error updating desa:', error);
        }
    };

    const cancel = () => {
        router.go(-1);
    };
</script>

