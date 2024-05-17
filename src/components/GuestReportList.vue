<template>
    <div class="px-5">
        <div v-if="showModal" class="absolute z-50 inset-0 flex justify-center items-center bg-black bg-opacity-70">
            <div :class="{ 'h-auto overflow-y-hidden': selectedPengaduan.gambar.length === 0 }" class="bg-main-black rounded-lg px-4 py-2 relative mx-4 h-5/6 lg:mx-8">
                <button @click="closeModal" class="absolute right-3 hover:text-gray-300">
                    <i class="bx bx-x-circle text-2xl"></i>
                </button>
                <div :class="{ 'mt-10 mb-3 flex justify-center flex-wrap items-center h-5/6 gap-y-6 gap-x-2 overflow-y-scroll': selectedPengaduan.gambar.length > 0 }" class="mt-10 mb-3">
                    <template v-if="selectedPengaduan && selectedPengaduan.gambar">
                        <img v-for="(gambar, index) in selectedPengaduan.gambar.split(',')" :key="index" :src="getGambarUrl(gambar.trim())" alt="Gambar" class="lg:h-80 h-40 md:h-60 object-cover rounded-lg mx-2">
                    </template>
                    <template v-else>
                        <p>Gambar kosong 💀</p>
                    </template>
                </div>
                <a :class="{ 'ms-5' : selectedPengaduan.gambar.length > 0 }" class="hover:underline text-sm text-blue-400" :href="generateGoogleMapsLink(selectedPengaduan.koordinat)" target="_blank">Link Koordinat</a>
            </div>
        </div>

        <div class="my-5 flex justify-between items-center flex-wrap">
            <h1 class="text-3xl">List Pengaduan</h1>
            <RouterLink v-if="activate === 1" class="bg-blue-500 hover:bg-blue-700 transition-all duration-200 rounded py-2 px-3" to="/createpengaduan">Buat Pengaduan</RouterLink>
            <div v-else>
                <span class="text-gray-400">Form Pengaduan Sedang Dinonaktifkan</span>
            </div>
        </div>
        <div class="overflow-x-scroll">
            <table class="min-w-full divide-y mt-2 divide-white">
                <thead>
                    <tr class="bg-stone-800">
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Nomor</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Desa</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Koordinat</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Kondisi</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Keterangan</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Gambar</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Waktu Laporan</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-white" v-if="pengaduans.length > 0">
                    <tr v-for="(pengaduan, loop) in pengaduans" :key="pengaduan.id" class="odd:bg-main-black hover:bg-stone-950">
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ loop + 1 }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ getDesaName(pengaduan.id_desa) }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">
                            <a class="hover:underline" :href="generateGoogleMapsLink(pengaduan.koordinat)" target="_blank">{{ pengaduan.koordinat || '-' }}</a>
                        </td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ pengaduan.kondisi }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ pengaduan.keterangan }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">
                            <button v-if="pengaduan.gambar.length > 0" @click="openModal(pengaduan)" class="flex justify-center items-center border p-1 w-16 rounded-sm overflow-hidden">
                                <span v-for="(gambar, index) in pengaduan.gambar.split(',').slice(0, 2)" :key="index">
                                    <img :src="getGambarUrl(gambar.trim())" alt="" class="h-5 object-cover mr-2">
                                </span>
                            </button>
                            <button v-else @click="openModal(pengaduan)" class="flex justify-center items-center text-xs text-gray-500 border p-1 w-16 rounded-sm overflow-hidden">
                                No image
                            </button>
                        </td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ formatDate(pengaduan.created_at) }}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="16" class="text-center col-span-full py-4">Belum ada pengaduan.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
    import axios from "axios";
    import { ref, onMounted } from "vue";
    import { useAuthStore } from "@/stores/auth";

    const authStore = useAuthStore();
    const pengaduans = ref([]);
    const activate = ref([]);
    const desasMap = ref({});
    const googleMapsBaseUrl = 'https://www.google.com/maps/search/?api=1&query=';
    const showModal = ref(false);
    const selectedPengaduan = ref(null);


    const getGambarUrl = (fileName) => {
        // Assuming the images are stored in the public folder of your Laravel project
        return `http://localhost/fp_dputr_nias/public${fileName}`;
    };

    const openModal = (pengaduan) => {
        selectedPengaduan.value = pengaduan;
        showModal.value = true;
    };

    const closeModal = () => {
        showModal.value = false;
    };

    const fetchPengaduans = async () => {
        const response = await axios.get("http://localhost:8000/api/pengaduans", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        const allPengaduans = response.data.data.reverse();
    
        pengaduans.value = allPengaduans.filter(pengaduan => pengaduan.id_user === authStore.user.data.id);

        // Fetch and store desas
        const desaResponse = await axios.get("http://localhost:8000/api/desas", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        const desas = desaResponse.data.data;
        for (const desa of desas) {
            desasMap.value[desa.id] = desa.nama_desa;
        }
    };

    const fetchActivationStatus = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/activate", {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            activate.value = response.data.activate;

            console.log("Activate:", activate.value)

        } catch (error) {
            console.error('Error fetching activation status:', error);
            // Handle error if needed
        }
    };

    // Fetch data from the API on component mount
    onMounted(() => {
        fetchPengaduans();
        fetchActivationStatus();
    });

    // Generate Google Maps link based on coordinates
    const generateGoogleMapsLink = (coordinates) => {
        return `${googleMapsBaseUrl}${encodeURIComponent(coordinates)}`;
    };

    const getDesaName = (desaId) => {
        return desasMap.value[desaId] || 'Unknown';
    };

    // Function to format date as per requirement
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (isSameDay(date, today)) {
            return "Hari ini";
        } else if (isSameDay(date, yesterday)) {
            return "Kemarin";
        } else {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
    };

    // Function to check if two dates are the same day
    const isSameDay = (date1, date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };
</script>