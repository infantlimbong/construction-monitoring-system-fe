<template>
    <div v-if="karyawans.length > 0" class="flex justify-center mt-10">
        <div v-for="karyawan in karyawans" :key="karyawan.id" class="bg-main-black px-3 py-5 rounded-xl w-80 grid gap-y-5">
            <div v-for="(gambar, index) in karyawan.foto.split(',')" :key="index" class="flex justify-center">
                <img :src="getGambarUrl(gambar)" alt="" class="w-40 mr-2 rounded-full object-cover aspect-square">
            </div>
            <div class="grid grid-cols-6">
                <div class="col-span-2 flex justify-between">
                    <p>Nama</p>
                    <p>:</p>
                </div>
                <p class="col-span-4 text-end">{{ authStore.user.data.nama }}</p>
            </div>
            <div class="grid grid-cols-6">
                <div class="col-span-2 flex justify-between">
                    <p>Email</p>
                    <p>:</p>
                </div>
                <p class="col-span-4 text-end">{{ authStore.user.data.email }}</p>
            </div>
            <div class="grid grid-cols-6">
                <div class="col-span-2 flex justify-between">
                    <p>NIP</p>
                    <p>:</p>
                </div>
                <p class="col-span-4 text-end">{{ karyawan.nip }}</p>
            </div>
            <div class="grid grid-cols-6">
                <div class="col-span-2 flex justify-between">
                    <p>No. Telepon</p>
                    <p>:</p>
                </div>
                <p class="col-span-4 text-end">{{ karyawan.no_telepon }}</p>
            </div>
            <div class="grid grid-cols-6">
                <div class="col-span-2 flex justify-between">
                    <p>Gender</p>
                    <p>:</p>
                </div>
                <p class="col-span-4 text-end">{{ karyawan.jenis_kelamin }}</p>
            </div>
            <div class="grid grid-cols-6">
                <div class="col-span-2 flex justify-between">
                    <p>Role</p>
                    <p>:</p>
                </div>
                <p v-if="authStore.user.data.id_role === 1" class="col-span-4 text-end">Admin</p>
                <p v-if="authStore.user.data.id_role === 2" class="col-span-4 text-end">Karyawan Dalam</p>
                <p v-if="authStore.user.data.id_role === 3" class="col-span-4 text-end">Karyawan Pemerintah</p>
                <p v-if="authStore.user.data.id_role === 4" class="col-span-4 text-end">Karyawan Tingkat 3</p>
                <p v-if="authStore.user.data.id_role === 5" class="col-span-4 text-end">Pengunjung</p>
            </div>
        </div>
    </div>

    <div v-else class="font-bold text-2xl text-center mt-40">
        <h1>Silahkan minta Admin untuk melengkapi profil Anda.</h1>
    </div>
</template>

<script setup>
    import axios from "axios";
    import { useAuthStore } from "@/stores/auth";
    import { ref, onMounted } from "vue";

    const authStore = useAuthStore();
    const karyawans = ref([]);
    const getGambarUrl = (fileName) => {
        return `http://localhost/fp_dputr_nias/public/${fileName}`;
    };

    const fetchKaryawans = async () => {
        const response = await axios.get("http://localhost:8000/api/karyawans", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });

        const filteredKaraywans = response.data.data.filter(karyawan => karyawan.id_user === authStore.user.data.id);

        karyawans.value = filteredKaraywans.reverse();

    };

    onMounted(fetchKaryawans);
</script>