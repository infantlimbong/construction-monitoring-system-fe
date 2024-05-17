<template>
    <div class="p-5">
        <h1 class="text-2xl mb-5">Buat Detail User</h1>

        <form v-if="user" @submit.prevent="createKaryawan" class="max-w-full mx-auto mt-5">
            <div class="mb-4">
                <label for="nama" class="font-bold block mb-1">Nama Lengkap</label>
                <input readonly type="text" name="nama" id="nama" v-model="user.nama" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="nip" class="font-bold block mb-1">NIP</label>
                <input type="text" v-model="nip" id="nip" name="nip" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline" autocomplete="on">
            </div>
            <div class="mb-4">
                <label for="no_telepon" class="font-bold block mb-1">No. Telepon</label>
                <input type="text" v-model="no_telepon" id="no_telepon" name="no_telepon" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label class="font-bold block mb-1">Jenis Kelamin</label>
                <div>
                    <label for="laki-laki" class="mr-2">
                        <input type="radio" v-model="jenis_kelamin" id="laki-laki" name="jenis_kelamin" value="Laki-laki">
                        Laki-laki
                    </label>
                    <label for="perempuan">
                        <input type="radio" v-model="jenis_kelamin" id="perempuan" name="jenis_kelamin" value="Perempuan">
                        Perempuan
                    </label>
                </div>
            </div>
            <div class="mb-4">
                <label for="foto" class="font-bold block mb-1">Foto</label>
                <input type="file" id="foto" name="foto" @change="handleFileChange" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
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
    const user = ref(null);

    let nip = ref("");
    let no_telepon = ref("");
    let jenis_kelamin = ref("");
    let foto = ref(null);

    // Fetch the user data with the provided ID
    onMounted(async () => {
        const response = await axios.get(`http://localhost:8000/api/users/${route.params.id}`, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        user.value = response.data.data;
        // console.log('User ID:', user.value.id);
    });

    // Create karyawan detail data
    const createKaryawan = async () => {
        // Client-side validation
        if (!nip.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'NIP harus diisi',
            });
            return;
        }

        if (!no_telepon.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'No. Telepon harus diisi',
            });
            return;
        }

        if (!jenis_kelamin.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Jenis Kelamin harus dipilih',
            });
            return;
        }

        if (!foto.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Foto harus dipilih',
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("id_user", user.value.id);
            formData.append("nip", nip.value);
            formData.append("no_telepon", no_telepon.value);
            formData.append("jenis_kelamin", jenis_kelamin.value);
            formData.append("foto", foto.value);

            await axios.post(`http://localhost:8000/api/karyawans`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            
            // SweetAlert notification after successful creation
            Swal.fire({
                icon: 'success',
                title: 'Profil Dibuat',
                text: 'Profil Karyawan berhasil dibuat',
            });

            router.push(`/listuser`);
        } catch (error) {
            console.error('Error creating karyawan detail:', error);
        }
    };

    const cancel = () => {
        router.go(-1);
    };

    const handleFileChange = (event) => {
        foto.value = event.target.files[0];
    };
</script>