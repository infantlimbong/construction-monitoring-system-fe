<template>
    <div class="px-5">
        <div v-if="showModal" class="fixed z-50 inset-0 flex justify-center items-center bg-black bg-opacity-70">
            <div :class="{ 'h-auto overflow-y-hidden': selectedLapKondisiJalan.gambar_jalan.length === 0 }" class="bg-main-black rounded-lg px-4 py-2 relative mx-4 h-5/6 lg:mx-8">
                <button @click="closeModal" class="absolute right-3 hover:text-gray-300">
                    <i class="bx bx-x-circle text-2xl"></i>
                </button>
                <div :class="{ 'mt-10 mb-3 flex justify-center flex-wrap items-center h-5/6 gap-y-6 gap-x-2 overflow-y-scroll': selectedLapKondisiJalan.gambar_jalan.length > 0 }" class="mt-10 mb-3">
                    <template v-if="selectedLapKondisiJalan && selectedLapKondisiJalan.gambar_jalan">
                        <img v-for="(gambar, index) in selectedLapKondisiJalan.gambar_jalan.split(',')" :key="index" :src="getGambarUrl(gambar.trim())" alt="Gambar Jalan" class="lg:h-80 h-40 md:h-60 object-cover rounded-lg mx-2">
                    </template>
                    <template v-else>
                        <p>Gambar kosong 💀</p>
                    </template>
                </div>
                <a :class="{ 'ms-5' : selectedLapKondisiJalan.gambar_jalan.length > 0 }" class="hover:underline text-sm text-blue-400" :href="generateGoogleMapsLink(selectedLapKondisiJalan.koordinat_jalan)" target="_blank">Link Koordinat</a>
            </div>
        </div>

        <h1 class="text-3xl my-5">List Jalan</h1>
        <div class="flex flex-wrap gap-y-2 md:flex-nowrap md:justify-between">
            <div class="flex items-center gap-2">
                <router-link v-if="isAdmin || isKaryawan1 ||isKaryawan2" class="bg-blue-500 hover:bg-blue-700 text-md px-3 py-1 rounded transition-all duration-200" to="/createjalan">Tambah</router-link>
                <button v-if="!isBaru" @click="exportToExcel()" class="border border-green-500 hover:bg-green-500 text-md px-3 py-1 rounded transition-all duration-200">Excel</button>
                <select v-model="selectedYear" name="selectedYear" @change="filterByYear" class="block py-1 px-1 border border-white rounded bg-main-black text-white focus:outline-1">
                    <option value="">Semua</option>
                    <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>
            <div class="flex items-center justify-between w-full sm:justify-normal sm:gap-x-2 md:justify-normal md:gap-2 md:w-min">
                <input type="text" v-model="searchQuery" name="searchQuery" placeholder="Cari jalan..." class="block py-1 px-3 border border-white rounded bg-main-black focus:outline-1">
                <select v-model="entitiesPerPage" name="entitiesPerPage" class="block py-1 px-3 border border-white rounded bg-main-black text-white focus:outline-1">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <!-- Toggle detail button -->
                <button @click="toggleDetail" :class="showDetail ? 'bg-blue-500 hover:bg-blue-700 border border-blue-500' : 'border border-blue-500 hover:bg-blue-700'" class="text-md px-3 py-1 rounded transition-all duration-200">
                    Detail
                </button>
            </div>
        </div>

        <div class="overflow-x-scroll">
            <table id="lap_kondisi_jalanTable" class="min-w-full divide-y mt-2 divide-white">
                <thead>
                    <tr class="bg-stone-800">
                        <th scope="col" class="px-2 py-5 text-left text-xs font-medium uppercase tracking-wider">
                            <div class="flex items-center">
                                No.
                                <button @click="reverseOrder" v-if="reverseOrder" class="px-1 block text-profile-color">
                                    <i v-if="!ascendingOrder" class="bx bxs-up-arrow"></i>
                                    <i v-else class="bx bxs-down-arrow"></i>
                                </button>
                            </div>
                        </th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            <div class="flex items-center">
                                Nama Jalan
                                <button @click="sortByName('lap_kondisi_jalan')" class="ml-1 block text-profile-color">
                                    <i v-if="jalanSortOrder === 'desc'" class="bx bxs-up-arrow"></i>
                                    <i v-else class="bx bxs-down-arrow"></i>
                                </button>
                            </div>
                        </th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            <div class="flex items-center">
                                Nomor Ruas
                                <button @click="sortNomorRuas()" class="ml-1 block text-profile-color">
                                    <i v-if="nomorRuasSortOrder === 'desc'" class="bx bxs-up-arrow"></i>
                                    <i v-else class="bx bxs-down-arrow"></i>
                                </button>
                            </div>
                        </th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            <div class="flex items-center">
                                Panjang
                                <button @click="sortPanjang()" class="ml-1 block text-profile-color">
                                    <i v-if="panjangSortOrder === 'desc'" class="bx bxs-up-arrow"></i>
                                    <i v-else class="bx bxs-down-arrow"></i>
                                </button>
                            </div>
                        </th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            <div class="flex items-center">
                                Desa
                                <button @click="sortDesa()" class="ml-1 block text-profile-color">
                                    <i v-if="desaSortOrder === 'desc'" class="bx bxs-up-arrow"></i>
                                    <i v-else class="bx bxs-down-arrow"></i>
                                </button>
                            </div>
                        </th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Baik</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Cukup Baik</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Rusak Ringan</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Rusak Berat</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Kondisi</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            <div class="flex items-center">
                                Tahun
                                <button @click="sortTahunPembangunan()" class="ml-1 block text-profile-color">
                                    <i v-if="tahunPembangunanSortOrder === 'desc'" class="bx bxs-up-arrow"></i>
                                    <i v-else class="bx bxs-down-arrow"></i>
                                </button>
                            </div>
                        </th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            <div class="flex items-center">
                                Progress
                                <button @click="sortProgress()" class="ml-1 block text-profile-color">
                                    <i v-if="progressSortOrder === 'desc'" class="bx bxs-up-arrow"></i>
                                    <i v-else class="bx bxs-down-arrow"></i>
                                </button>
                            </div>
                        </th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Koordinat</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Gambar</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Dibuat</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Terakhir Diedit</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Pembuat</th>
                        <th v-if="isAdmin || isKaryawan1 || isKaryawan2" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-white" v-if="paginatedLapKondisiJalan.length > 0">
                    <tr v-for="(lap_kondisi_jalan, loop) in paginatedLapKondisiJalan" :key="lap_kondisi_jalan.id" class="odd:bg-main-black hover:bg-stone-950">
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ loop + 1 }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ lap_kondisi_jalan.nama_ruas_jalan }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ lap_kondisi_jalan.no_ruas_jalan }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ lap_kondisi_jalan.panjang_ruas_jalan }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ getDesaName(lap_kondisi_jalan.id_desa) }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ lap_kondisi_jalan.status_jalan }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ lap_kondisi_jalan.kondisi_baik }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ lap_kondisi_jalan.kondisi_cukup_baik }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ lap_kondisi_jalan.kondisi_rusak_ringan }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ lap_kondisi_jalan.kondisi_rusak_berat }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ lap_kondisi_jalan.keseluruhan_kondisi || '-' }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ lap_kondisi_jalan.tahun_pembangunan || '-' }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">
                            <div v-if="lap_kondisi_jalan.progress > 0" class="w-full bg-gray-600 rounded">
                                <div v-if="lap_kondisi_jalan.progress < 100" :style="{ width: lap_kondisi_jalan.progress + '%' }" class="text-xs leading-none py-1 px-1 text-center text-white rounded" :class="{ 'rounded-r-none': lap_kondisi_jalan.progress < 100, 'bg-red-500': lap_kondisi_jalan.progress <= 25, 'bg-orange-500': lap_kondisi_jalan.progress > 25 && lap_kondisi_jalan.progress <= 50, 'bg-yellow-500': lap_kondisi_jalan.progress > 50 && lap_kondisi_jalan.progress <= 75, 'bg-lime-500': lap_kondisi_jalan.progress > 75 && lap_kondisi_jalan.progress < 100 }">
                                    {{ lap_kondisi_jalan.progress }}%
                                </div>
                                <div v-else class="bg-green-700 text-center rounded text-xs py-1">
                                    Selesai
                                </div>
                            </div>
                            <div v-else class="w-full bg-gray-600 rounded text-center">
                                <small class="text-gray-300">Belum dimulai</small>
                            </div>
                        </td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">
                            <a class="hover:underline" :href="generateGoogleMapsLink(lap_kondisi_jalan.koordinat_jalan)" target="_blank">{{ lap_kondisi_jalan.koordinat_jalan || '-' }}</a>
                        </td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">
                            <button v-if="lap_kondisi_jalan.gambar_jalan.length > 0" @click="openModal(lap_kondisi_jalan)" class="flex justify-center items-center border p-1 w-16 rounded-sm overflow-hidden">
                                <span v-for="(gambar, index) in lap_kondisi_jalan.gambar_jalan.split(',').slice(0, 2)" :key="index">
                                    <img :src="getGambarUrl(gambar.trim())" alt="" class="h-5 object-cover mr-2">
                                </span>
                            </button>
                            <button v-else @click="openModal(lap_kondisi_jalan)" class="flex justify-center items-center text-xs text-gray-500 border p-1 w-16 rounded-sm overflow-hidden">
                                No image
                            </button>
                        </td>
                        <!-- <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ lap_kondisi_jalan.gambar_jalan }}</td> -->
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ formatDate(lap_kondisi_jalan.created_at) }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ formatDate(lap_kondisi_jalan.updated_at) }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ getUserName(lap_kondisi_jalan.id_user) }}</td>
                        <td v-if="isAdmin || isKaryawan1 || isKaryawan2" class="px-4 py-2 whitespace-nowrap text-sm">
                            <router-link title="Edit" :to="`/editjalan/${lap_kondisi_jalan.id}`" class="text-profile-color mr-3 hover:underline">
                                Edit
                            </router-link>
                            <button title="Hapus" v-if="isAdmin || isKaryawan1" @click="deleteLapKondisiJalan(lap_kondisi_jalan)" class="text-red-500 hover:underline">
                                Hapus
                            </button>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="16" class="text-center col-span-full py-4">Data Kosong.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="flex justify-end flex-wrap my-5">
            <button @click="previousPage" :disabled="currentPage === 1" class="px-3 py-1 mr-1 bg-blue-500 hover:bg-blue-700 text-white rounded focus:outline-none">Prev</button>
            <div class="flex gap-1">
                <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)" :class="{ 'border border-blue-500 hover:bg-blue-700': currentPage !== pageNumber, 'bg-blue-500 hover:bg-blue-700 text-white': currentPage === pageNumber }" class="px-3 py-1 rounded focus:outline-none">{{ pageNumber }}</button>
            </div>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 ml-1 bg-blue-500 hover:bg-blue-700 text-white rounded focus:outline-none">Next</button>
        </div>
    </div>
</template>

<script setup>
    import axios from "axios";
    import Swal from "sweetalert2";
    import * as XLSX from "xlsx";
    import { ref, onMounted, computed } from "vue";
    import { useAuthStore } from "@/stores/auth";

    const authStore = useAuthStore();
    const lap_kondisi_jalans = ref([]);
    const desasMap = ref({});
    const usersMap = ref({});
    const searchQuery = ref('');
    const ascendingOrder = ref(true);
    let currentPage = ref(1);
    const entitiesPerPage = ref(10);
    const googleMapsBaseUrl = 'https://www.google.com/maps/search/?api=1&query=';
    const showDetail = ref(false);
    const showModal = ref(false);
    const selectedLapKondisiJalan = ref(null);

    const selectedYear = ref('');
    
    // Computed property to get unique years from the data
    const uniqueYears = computed(() => {
        const years = new Set();
        lap_kondisi_jalans.value.forEach(item => {
            if (item.tahun_pembangunan) {
                years.add(item.tahun_pembangunan);
            }
        });
        return Array.from(years).sort((a, b) => b - a); // Sort in descending order
    });

    // Function to filter data based on selected year
    const filterByYear = () => {
        currentPage.value = 1; // Reset currentPage when filtering
    };

    const getGambarUrl = (fileName) => {
        // Assuming the images are stored in the public folder of your Laravel project
        return `http://localhost/fp_dputr_nias/public${fileName}`;
    };

    const openModal = (lap_kondisi_jalan) => {
        selectedLapKondisiJalan.value = lap_kondisi_jalan;
        showModal.value = true;
    };

    const closeModal = () => {
        showModal.value = false;
    };

    // Function to toggle the visibility state of additional columns
    const toggleDetail = () => {
        showDetail.value = !showDetail.value;
    };

    // Pagination controls functions
    const previousPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    };

    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value++;
        }
    };

    const goToPage = (pageNumber) => {
        currentPage.value = pageNumber;
    };

    // Computed property for total pages
    const totalPages = computed(() => Math.ceil(filteredlap_kondisi_jalans.value.length / entitiesPerPage.value));

    const fetchlap_kondisi_jalans = async () => {
        const response = await axios.get("http://localhost:8000/api/lap_kondisi_jalans", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        lap_kondisi_jalans.value = response.data.data.reverse();

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

        // Fetch and store users
        const userResponse = await axios.get("http://localhost:8000/api/users", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        const users = userResponse.data.data;
        for (const user of users) {
            usersMap.value[user.id] = user.nama;
        }
    };

    // Fetch data from the API on component mount
    onMounted(fetchlap_kondisi_jalans);

    // Generate Google Maps link based on coordinates
    const generateGoogleMapsLink = (coordinates) => {
        return `${googleMapsBaseUrl}${encodeURIComponent(coordinates)}`;
    };

    // Computed property to filter lap_kondisi_jalans based on searchQuery and selected year
    const filteredlap_kondisi_jalans = computed(() => {
        let filteredData = lap_kondisi_jalans.value;
        
        if (selectedYear.value) {
            filteredData = filteredData.filter(item => item.tahun_pembangunan === selectedYear.value);
        }
        // Filter by searchQuery
        filteredData = filteredData.filter(lap_kondisi_jalan => {
            const namaRuasJalanMatches = lap_kondisi_jalan.nama_ruas_jalan.toLowerCase().includes(searchQuery.value.toLowerCase());
            const desaMatches = getDesaName(lap_kondisi_jalan.id_desa).toLowerCase().includes(searchQuery.value.toLowerCase());

            return namaRuasJalanMatches || desaMatches;
        });

        return filteredData;
    });

    // Computed property for paginated lap_kondisi_jalans
    const paginatedLapKondisiJalan = computed(() => {
        const startIndex = (currentPage.value - 1) * entitiesPerPage.value;
        const endIndex = startIndex + entitiesPerPage.value;
        return filteredlap_kondisi_jalans.value.slice(startIndex, endIndex);
    });

    // Sweet alert for delete
    const deleteLapKondisiJalan = async (lap_kondisi_jalan) => {
        // Show SweetAlert confirmation dialog
        const result = await Swal.fire({
            title: 'Konfirmasi Penghapusan',
            text: 'Ingin menghapus laporan?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        });

        // If user confirms deletion
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8000/api/lap_kondisi_jalans/${lap_kondisi_jalan.id}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`,
                    },
                });
                Swal.fire(
                    'Berhasil dihapus!',
                    'Laporan telah dihapus.',
                    'success'
                );
                // Reload list after deletion.
                await fetchlap_kondisi_jalans();
            } catch (error) {
                console.error('Error deleting lap_kondisi_jalan:', error);
                Swal.fire(
                    'Gagal menghapus!',
                    'Terjadi kesalahan saat menghapus laporan.',
                    'error'
                );
            }
        }
    };

    const getDesaName = (desaId) => {
        return desasMap.value[desaId] || 'Unknown';
    };
    const getUserName = (userId) => {
        return usersMap.value[userId] || 'Unknown';
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

    // Function to reverse the table orders from the latest to newest
    const reverseOrder = () => {
        ascendingOrder.value = !ascendingOrder.value;
        lap_kondisi_jalans.value.reverse();
    };

    // Variables for sorting
    let jalanSortOrder = ref('asc');
    let desaSortOrder = ref('asc');
    let nomorRuasSortOrder = ref('asc');
    let panjangSortOrder = ref('asc');
    let tahunPembangunanSortOrder = ref('asc');
    let progressSortOrder = ref('asc');

    // Sorting method for nama jalan
    const sortByName = (type) => {
        if (type === 'lap_kondisi_jalan') {
            if (jalanSortOrder.value === 'asc') {
                lap_kondisi_jalans.value.sort((a, b) => a.nama_ruas_jalan.localeCompare(b.nama_ruas_jalan));
                jalanSortOrder.value = 'desc';
            } else {
                lap_kondisi_jalans.value.sort((a, b) => b.nama_ruas_jalan.localeCompare(a.nama_ruas_jalan));
                jalanSortOrder.value = 'asc';
            }
        } 
    };

    // Sorting method for Desa Name
    const sortDesa = () => {
        if (desaSortOrder.value === 'asc') {
            lap_kondisi_jalans.value.sort((a, b) => getDesaName(a.id_desa).localeCompare(getDesaName(b.id_desa)));
            desaSortOrder.value = 'desc';
        } else {
            lap_kondisi_jalans.value.sort((a, b) => getDesaName(b.id_desa).localeCompare(getDesaName(a.id_desa)));
            desaSortOrder.value = 'asc';
        }
    };

    // Sorting method for Nomor Ruas
    const sortNomorRuas = () => {
        if (nomorRuasSortOrder.value === 'asc') {
            lap_kondisi_jalans.value.sort((a, b) => a.no_ruas_jalan.localeCompare(b.no_ruas_jalan));
            nomorRuasSortOrder.value = 'desc';
        } else {
            lap_kondisi_jalans.value.sort((a, b) => b.no_ruas_jalan.localeCompare(a.no_ruas_jalan));
            nomorRuasSortOrder.value = 'asc';
        }
    };

    // Sorting method for Panjang
    const sortPanjang = () => {
        if (panjangSortOrder.value === 'asc') {
            lap_kondisi_jalans.value.sort((a, b) => parseFloat(a.panjang_ruas_jalan) - parseFloat(b.panjang_ruas_jalan));
            panjangSortOrder.value = 'desc';
        } else {
            lap_kondisi_jalans.value.sort((a, b) => parseFloat(b.panjang_ruas_jalan) - parseFloat(a.panjang_ruas_jalan));
            panjangSortOrder.value = 'asc';
        }
    };

    // Sorting method for Tahun Pembangunan
    const sortTahunPembangunan = () => {
        if (tahunPembangunanSortOrder.value === 'asc') {
            lap_kondisi_jalans.value.sort((a, b) => parseInt(a.tahun_pembangunan) - parseInt(b.tahun_pembangunan));
            tahunPembangunanSortOrder.value = 'desc';
        } else {
            lap_kondisi_jalans.value.sort((a, b) => parseInt(b.tahun_pembangunan) - parseInt(a.tahun_pembangunan));
            tahunPembangunanSortOrder.value = 'asc';
        }
    };

    // Sorting method for Progress
    const sortProgress = () => {
        if (progressSortOrder.value === 'asc') {
            lap_kondisi_jalans.value.sort((a, b) => parseInt(a.progress) - parseInt(b.progress));
            progressSortOrder.value = 'desc';
        } else {
            lap_kondisi_jalans.value.sort((a, b) => parseInt(b.progress) - parseInt(a.progress));
            progressSortOrder.value = 'asc';
        }
    };

    // Check user's role level
    const isAdmin = computed(() => {
        return authStore.user && authStore.user.data && authStore.user.data.id_role === 1;
    });
    const isKaryawan1 = computed(() => {
        return authStore.user && authStore.user.data && authStore.user.data.id_role === 2;
    });
    const isKaryawan2 = computed(() => {
        return authStore.user && authStore.user.data && authStore.user.data.id_role === 3;
    });
    const isBaru = computed(() => {
        return authStore.user && authStore.user.data && authStore.user.data.id_role === 5;
    });
    
    // Function to make table exportable to MS Excel
    function exportToExcel() {
        console.log("Exporting to Excel...");

        var table = document.getElementById("lap_kondisi_jalanTable");
        console.log("Table Element:", table);

        var wb = XLSX.utils.table_to_book(table);
        console.log("Workbook:", wb);

        XLSX.writeFile(wb, "list_lap_kondisi_jalan.xlsx");
        console.log("File berhasil Diexport.");

    }
</script>