<template>
    <div class="p-5">
        <h1 class="text-2xl mb-5">Edit User</h1>

        <form v-if="user" @submit.prevent="updateUser" class="max-w-full mx-auto mt-5">
            <div class="mb-4">
                <label for="nama" class="font-bold block mb-1">Nama Lengkap</label>
                <input type="text" name="nama" id="nama" v-model="user.nama" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:shadow-outline">
            </div>
            <div class="mb-4">
                <label for="email" class="font-bold block mb-1">Email</label>
                <input type="email" id="email" name="email" v-model="user.email" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline" autocomplete="on">
            </div>
            <div class="mb-4">
                <label for="id_role" class="font-bold block mb-1">Role</label>
                <select v-model="user.id_role" name="id_role" id="id_role" class="shadow capitalize border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:shadow-outline">
                    <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
                </select>
            </div>
            <div class="mb-4">
                <label for="password" class="font-bold block mb-1">Password <small class="font-normal italic text-yellow-500">Kosongkan jika tidak ingin mengubah password</small></label>
                <input type="password" id="password" name="password" v-model="user.password" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
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
    const roles = ref([]);

    // Fetch the user data with the provided ID
    onMounted(async () => {
        const response = await axios.get(`http://localhost:8000/api/users/${route.params.id}`, {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        user.value = response.data.data;

        // Fetch roles data
        const roleResponse = await axios.get("http://localhost:8000/api/roles", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        const filteredRole = roleResponse.data.data.filter(role => role.id !== 5)
      
        roles.value = filteredRole;
    });

    // Update the user data
    const updateUser = async () => {
        if (!user.value.nama) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Nama Harus Diisi',
            });
            return;
        }
        if (!user.value.email) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Email Harus Diisi',
            });
            return;
        }
        
        try {
            await axios.put(`http://localhost:8000/api/users/${user.value.id}`, {
                nama: user.value.nama,
                jenis_kelamin: user.value.jenis_kelamin, // Corrected line
                email: user.value.email,
                nip: user.value.nip,
                id_role: user.value.id_role,
                no_telp: user.value.no_telp,
                password: user.value.password,
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
                text: 'Data user berhasil diedit!',
            });

            router.push(`/listuser`);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const cancel = () => {
        router.go(-1);
    };
</script>

