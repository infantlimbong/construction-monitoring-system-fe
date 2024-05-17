<template>
    <div class="px-5">
        <h1 class="text-3xl my-5">List Laporan</h1>
        
        <div class="flex flex-wrap gap-y-2 md:flex-nowrap md:justify-between">
            <div class="flex items-center gap-2">
                <router-link v-if="isAdmin || isKaryawan1" class="bg-blue-500 hover:bg-blue-700 text-md px-3 py-1 rounded transition-all duration-200" to="/createlaporanjalan">+Jalan</router-link>
                <router-link v-if="isAdmin || isKaryawan1" class="bg-blue-500 hover:bg-blue-700 text-md px-3 py-1 rounded transition-all duration-200" to="/createlaporanjembatan">+Jembatan</router-link>
                <button v-if="!isBaru" @click="exportToExcel()" class="border border-green-500 hover:bg-green-500 text-md px-3 py-1 rounded transition-all duration-200">Excel</button>
            </div>
            <div class="flex items-center justify-between w-full md:justify-normal md:gap-2 md:w-min">
                <input type="text" v-model="searchQuery" name="searchQuery" placeholder="Cari laporan..." class="block py-1 px-3 border border-white rounded bg-main-black focus:outline-1">
                <select v-model="entitiesPerPage" name="entitiesPerPage" class="block py-1 px-1 border border-white rounded bg-main-black text-white focus:outline-1">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
        </div>
        <div class="flex items-center justify-between gap-2 mt-2">
            <select v-model="dataType" name="dataType" id="dataType" class="block py-1 px-1 border border-white rounded bg-main-black text-white focus:outline-1">
                <option value="semua">Semua</option>
                <option value="jalan">Jalan</option>
                <option value="jembatan">Jembatan</option>
            </select>
            <button @click="toggleDetail" :class="showDetail ? 'bg-blue-500 hover:bg-blue-700 border border-blue-500' : 'border border-blue-500 hover:bg-blue-700'" class="text-md px-3 py-1 rounded transition-all duration-200">
                Detail
            </button>
        </div>
        <div class="overflow-x-scroll">
            <table id="laporan_kegiatanTable" class="min-w-full divide-y mt-2 divide-white">
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
                                Kegiatan
                                <button @click="sortKegiatan()" class="ml-1 block text-profile-color">
                                    <i v-if="kegiatanSortOrder === 'desc'" class="bx bxs-up-arrow"></i>
                                    <i v-else class="bx bxs-down-arrow"></i>
                                </button>
                            </div>
                        </th>
                        <th v-if="dataType === 'jalan' || dataType === 'semua'" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            <div class="flex items-center">
                                Jalan
                                <button @click="sortJalan()" class="ml-1 block text-profile-color">
                                    <i v-if="jalanSortOrder === 'desc'" class="bx bxs-up-arrow"></i>
                                    <i v-else class="bx bxs-down-arrow"></i>
                                </button>
                            </div>
                        </th>
                        <th v-if="dataType === 'jembatan' || dataType === 'semua'" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            <div class="flex items-center">
                                Jembatan
                                <button @click="sortJembatan()" class="ml-1 block text-profile-color">
                                    <i v-if="jembatanSortOrder === 'desc'" class="bx bxs-up-arrow"></i>
                                    <i v-else class="bx bxs-down-arrow"></i>
                                </button>
                            </div>
                        </th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            <div class="flex items-center">
                                Sumber dana
                                <button @click="sortDana()" class="ml-1 block text-profile-color">
                                    <i v-if="danaSortOrder === 'desc'" class="bx bxs-up-arrow"></i>
                                    <i v-else class="bx bxs-down-arrow"></i>
                                </button>
                            </div>
                        </th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Lokasi</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Anggaran Kes</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Anggaran Fisik</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Nilai Kontrak</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Realisasi</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            <div class="flex items-center">
                                Total Anggaran
                                <button @click="sortAnggaran()" class="ml-1 block text-profile-color">
                                    <i v-if="anggaranSortOrder === 'desc'" class="bx bxs-up-arrow"></i>
                                    <i v-else class="bx bxs-down-arrow"></i>
                                </button>
                            </div>
                        </th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Sisa Anggaran</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Realisasi Fisik</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Denda Keterlambatan</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Kontrak Pelaksana</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Tanggal Kontrak</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Tanggal SPMK</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Tanggal Selesai Kontrak</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Tanggal laporan</th>
                        <th v-if="showDetail" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Keterangan</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Dibuat</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Terakhir Diedit</th>
                        <th v-if="isAdmin || isKaryawan1" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-white" v-if="paginatedLaporanKegiatans.length > 0">
                    <tr v-for="(laporan_kegiatan, loop) in paginatedLaporanKegiatans" :key="laporan_kegiatan.id" class="odd:bg-main-black hover:bg-stone-950">
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ loop + 1 }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.kegiatan }}</td>
                        <td v-if="dataType === 'jalan' || dataType === 'semua'" class="px-4 py-2 whitespace-nowrap text-sm">{{ getJalanName(laporan_kegiatan.id_jalan) }}</td>
                        <td v-if="dataType === 'jembatan' || dataType === 'semua'" class="px-4 py-2 whitespace-nowrap text-sm">{{ getJembatanName(laporan_kegiatan.id_jembatan) }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ getSumberDana(laporan_kegiatan.id_sumber_dana) }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.lokasi }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.anggaran_kes }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.anggaran_fisik }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.nilai_kontrak }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.realisasi }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.total_anggaran }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.sisa_anggaran }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.realisasi_fisik }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.denda_keterlambatan }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.kontrak_pelaksana }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.tanggal_kontrak }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.tanggal_spmk }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.tanggal_selesai_kontrak }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.tanggal_laporan }}</td>
                        <td v-if="showDetail" class="px-4 py-2 whitespace-nowrap text-sm">{{ laporan_kegiatan.keterangan }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ formatDate(laporan_kegiatan.created_at) }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ formatDate(laporan_kegiatan.updated_at) }}</td>
                        <td v-if="isAdmin || isKaryawan1" class="px-4 py-2 whitespace-nowrap text-sm">
                            <router-link :to="getEditRoute(laporan_kegiatan)" class="text-profile-color mr-3">
                                <i class='bx bxs-edit'></i>
                            </router-link>
                            <button v-if="isAdmin" @click="deleteLaporanKegiatan(laporan_kegiatan)" class="text-red-500">
                                <i class='bx bxs-trash'></i>
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
    const laporan_kegiatans = ref([]);
    const searchQuery = ref('');
    const ascendingOrder = ref(true);
    let currentPage = ref(1);
    const entitiesPerPage = ref(10);
    const showDetail = ref(false);
    const jalanSortOrder = ref('asc');
    const jembatanSortOrder = ref('asc');
    const danaSortOrder = ref('asc');
    const anggaranSortOrder = ref('asc');
    const kegiatanSortOrder = ref('asc');
    const jalanNamesMap = ref({});
    const jembatanNamesMap = ref({});
    const sumberDanasMap = ref({});
    const dataType = ref('semua');

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
    const totalPages = computed(() => Math.ceil(filteredLaporanKegiatans.value.length / entitiesPerPage.value));

    const fetchLaporanKegiatans = async () => {
        const response = await axios.get("http://localhost:8000/api/laporan_kegiatans", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        laporan_kegiatans.value = response.data.data.reverse();

        // Fetch and store desas
        const jalanResponse = await axios.get("http://localhost:8000/api/lap_kondisi_jalans", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        const jalans = jalanResponse.data.data;
        for (const jalan of jalans) {
            jalanNamesMap.value[jalan.id] = jalan.nama_ruas_jalan;
        }

        // Fetch and store jalans
        const jembatanResponse = await axios.get("http://localhost:8000/api/lap_kondisi_jembatans", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        const jembatans = jembatanResponse.data.data;
        for (const jembatan of jembatans) {
            jembatanNamesMap.value[jembatan.id] = jembatan.nama_ruas_jembatan;
        }

        // Fetch and store sumber_danas
        const danaResponse = await axios.get("http://localhost:8000/api/sumber_danas", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });
        const danas = danaResponse.data.data;
        for (const dana of danas) {
            sumberDanasMap.value[dana.id] = dana.sumber_dana;
        }
    };

    // Fetch data from the API on component mount
    onMounted(fetchLaporanKegiatans);
    
    // Fetch data from the API on component mount
    onMounted(async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/laporan_kegiatans", {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            laporan_kegiatans.value = response.data.data.reverse();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    // Computed property to filter laporan_kegiatans based on selected dataType
    const filteredData = computed(() => {
        if (dataType.value === 'jalan') {
            return laporan_kegiatans.value.filter(item => item.id_jalan !== null);
        } else if (dataType.value === 'jembatan') {
            return laporan_kegiatans.value.filter(item => item.id_jembatan !== null);
        } else {
            return laporan_kegiatans.value;
        }
    });

    // Computed property to filter laporan_kegiatans based on searchQuery
    const filteredLaporanKegiatans = computed(() => {
        return filteredData.value.filter(laporan_kegiatan => {
            // Check if any of the fields include the searchQuery
            const kegiatanMatches = laporan_kegiatan.kegiatan.toLowerCase().includes(searchQuery.value.toLowerCase());
            const jalanMatches = getJalanName(laporan_kegiatan.id_jalan).toLowerCase().includes(searchQuery.value.toLowerCase());
            const jembatanMatches = getJembatanName(laporan_kegiatan.id_jembatan).toLowerCase().includes(searchQuery.value.toLowerCase());
            const danaMatches = getSumberDana(laporan_kegiatan.id_sumber_dana).toLowerCase().includes(searchQuery.value.toLowerCase());
            const anggaranMatches = laporan_kegiatan.total_anggaran.toLowerCase().includes(searchQuery.value.toLowerCase());

            // Return true if any of the fields match the searchQuery
            return kegiatanMatches || jalanMatches || jembatanMatches || danaMatches || anggaranMatches;
        });
    });

    // Function to get Jalan Name based on Jalan Id
    const getJalanName = (jalanId) => {
        return jalanNamesMap.value[jalanId] || '-';
    };

    // Function to get Jalan Name based on Jalan Id
    const getJembatanName = (jembatanId) => {
        return jembatanNamesMap.value[jembatanId] || '-';
    };

    // Function to get Jalan Name based on Jalan Id
    const getSumberDana = (danaId) => {
        return sumberDanasMap.value[danaId] || '-';
    };

    // Sorting method for Jalan Name
    const sortJalan = () => {
        if (jalanSortOrder.value === 'asc') {
            laporan_kegiatans.value.sort((a, b) => getJalanName(a.id_jalan).localeCompare(getJalanName(b.id_jalan)));
            jalanSortOrder.value = 'desc';
        } else {
            laporan_kegiatans.value.sort((a, b) => getJalanName(b.id_jalan).localeCompare(getJalanName(a.id_jalan)));
            jalanSortOrder.value = 'asc';
        }
    };

    // Sorting method for Jembatan Name
    const sortJembatan = () => {
        if (jembatanSortOrder.value === 'asc') {
            laporan_kegiatans.value.sort((a, b) => getJembatanName(a.id_jembatan).localeCompare(getJembatanName(b.id_jembatan)));
            jembatanSortOrder.value = 'desc';
        } else {
            laporan_kegiatans.value.sort((a, b) => getJembatanName(b.id_jembatan).localeCompare(getJembatanName(a.id_jembatan)));
            jembatanSortOrder.value = 'asc';
        }
    };

    // Sorting method for dana
    const sortDana = () => {
        if (danaSortOrder.value === 'asc') {
            laporan_kegiatans.value.sort((a, b) => getSumberDana(a.id_sumber_dana).localeCompare(getSumberDana(b.id_sumber_dana)));
            danaSortOrder.value = 'desc';
        } else {
            laporan_kegiatans.value.sort((a, b) => getSumberDana(b.id_sumber_dana).localeCompare(getSumberDana(a.id_sumber_dana)));
            danaSortOrder.value = 'asc';
        }
    };

    // Sorting method for kegiatan
    const sortKegiatan = () => {
        if (kegiatanSortOrder.value === 'asc') {
            laporan_kegiatans.value.sort((a, b) => a.kegiatan.localeCompare(b.kegiatan));
            kegiatanSortOrder.value = 'desc';
        } else {
            laporan_kegiatans.value.sort((a, b) => b.kegiatan.localeCompare(a.kegiatan));
            kegiatanSortOrder.value = 'asc';
        }
    };

    // Sorting method for anggaran
    const sortAnggaran = () => {
        if (anggaranSortOrder.value === 'asc') {
            laporan_kegiatans.value.sort((a, b) => a.total_anggaran.localeCompare(b.total_anggaran));
            anggaranSortOrder.value = 'desc';
        } else {
            laporan_kegiatans.value.sort((a, b) => b.total_anggaran.localeCompare(a.total_anggaran));
            anggaranSortOrder.value = 'asc';
        }
    };

    // Computed property for paginated laporan_kegiatans
    const paginatedLaporanKegiatans = computed(() => {
        const startIndex = (currentPage.value - 1) * entitiesPerPage.value;
        const endIndex = startIndex + entitiesPerPage.value;
        return filteredLaporanKegiatans.value.slice(startIndex, endIndex);
    });

    // Sweet alert for delete
    const deleteLaporanKegiatan = async (laporan_kegiatan) => {
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
                await axios.delete(`http://localhost:8000/api/laporan_kegiatans/${laporan_kegiatan.id}`, {
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
                await fetchLaporanKegiatans();
            } catch (error) {
                console.error('Error deleting laporan kegiatan:', error);
                Swal.fire(
                    'Gagal menghapus!',
                    'Terjadi kesalahan saat menghapus laporan.',
                    'error'
                );
            }
        }
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
        laporan_kegiatans.value.reverse();
    };

    const getEditRoute = (laporan_kegiatan) => {
        if (laporan_kegiatan.id_jalan !== null) {
            return `/editlaporanjalan/${laporan_kegiatan.id}`;
        } else {
            return `/editlaporanjembatan/${laporan_kegiatan.id}`;
        }
    };

    // Check user's role level
    const isAdmin = computed(() => {
        return authStore.user && authStore.user.data && authStore.user.data.id_role === 1;
    });
    const isKaryawan1 = computed(() => {
        return authStore.user && authStore.user.data && authStore.user.data.id_role === 2;
    });
    const isBaru = computed(() => {
        return authStore.user && authStore.user.data && authStore.user.data.id_role === 5;
    });

    // Function to make table exportable to MS Excel
    function exportToExcel() {
        console.log("Exporting to Excel...");

        // Get table element
        var table = document.getElementById("laporan_kegiatanTable");
        console.log("Table Element:", table);

        // Convert table to Excel workbook
        var wb = XLSX.utils.table_to_book(table);
        console.log("Workbook:", wb);

        // Save workbook to file
        XLSX.writeFile(wb, "list_laporan_kegiatan.xlsx");
        console.log("File berhasil Diexport.");
    }
</script>
