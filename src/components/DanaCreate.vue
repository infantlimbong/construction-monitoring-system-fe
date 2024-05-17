<template>
    <div class="p-5">
        <h1 class="text-2xl mb-5">Tambah Sumber Dana</h1>

        <form @submit.prevent="createSumberDana" class="max-w-full mx-auto mt-5">
            <div class="mb-4">
                <label for="sumber_dana" class="font-bold block mb-1">Sumber Dana</label>
                <input v-model="sumber_dana" name="sumber_dana" id="sumber_dana" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
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
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { useAuthStore } from "@/stores/auth";

    const authStore = useAuthStore();
    const router = useRouter();
    const sumber_dana = ref("");

    const createSumberDana = async () => {
        // Alert message if the form empty / invalid
        if (!sumber_dana.value) {
            alert('Sumber dana harus diisi');
            return;
        }

        try {
            await axios.post("http://localhost:8000/api/sumber_danas", {
                sumber_dana: sumber_dana.value
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
                text: 'Data Sumber Dana berhasil dibuat!',
            });

            router.push("/listdana");
        } catch (error) {
            console.error('Error creating sumber dana:', error);
        }
    };

    const cancel = () => {
        router.go(-1);
    };

</script>