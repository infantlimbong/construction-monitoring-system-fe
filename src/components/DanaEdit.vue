<template>
    <div class="p-5">
        <h1 class="text-2xl mb-5">Edit Sumber Dana</h1>

        <form v-if="sumber_dana" @submit.prevent="updateSumberDana" class="max-w-full mx-auto mt-5">
            <div class="mb-4">
                <label for="sumber_dana" class="font-bold block mb-1">Sumber dana</label>
                <input v-model="sumber_dana.sumber_dana" type="text" name="sumber_dana" id="sumber_dana" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:shadow-outline">
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
    const sumber_dana = ref(null);

    // Fetch the sumber_dana data with the provided ID
    onMounted(async () => {
        const response = await axios.get(
            `http://localhost:8000/api/sumber_danas/${route.params.id}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            }
        );
        sumber_dana.value = response.data.data;
    });

    // Update the sumber_dana data
    const updateSumberDana = async () => {
        try {
            await axios.put(`http://localhost:8000/api/sumber_danas/${sumber_dana.value.id}`, {
                sumber_dana: sumber_dana.value.sumber_dana
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
                text: 'Data sumber dana berhasil diedit!',
            });

            router.push(`/listdana`);
        } catch (error) {
            console.error('Error updating sumber dana:', error);
        }
    };

    const cancel = () => {
        router.go(-1);
    };
</script>

