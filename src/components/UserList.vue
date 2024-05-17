<template>
    <div class="px-5">
        <h1 class="text-3xl my-5">List Karyawan</h1>
        
        <div class="flex flex-wrap gap-y-2 md:flex-nowrap md:justify-between">
            <div class="flex items-center gap-2">
                <router-link v-if="isAdmin" class="bg-blue-500 hover:bg-blue-700 text-md px-3 py-1 rounded transition-all duration-200" to="/createuser">Tambah</router-link>
                <button @click="exportToExcel()" class="border border-green-500 hover:bg-green-500 text-md px-3 py-1 rounded transition-all duration-200">Excel</button>
            </div>
            <div class="flex items-center justify-between w-full md:justify-normal md:gap-2 md:w-min">
                <input type="text" v-model="searchQuery" name="searchQuery" placeholder="Cari user..." class="block py-1 px-3 border border-white rounded bg-main-black focus:outline-1">
                <select v-model="entitiesPerPage" name="entitiesPerPage" class="block py-1 px-3 border border-white rounded bg-main-black text-white focus:outline-1">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
        </div>

        <div class="overflow-x-scroll">
            <table id="userTable" class="min-w-full divide-y mt-2 divide-white">
                <thead>
                    <tr class=" bg-stone-800">
                        <th scope="col" class="px-2 py-5 text-left text-xs font-medium uppercase tracking-wider">
                            <div class="flex">
                                No.
                                <button @click="reverseOrder" v-if="reverseOrder" class="px-1 block text-profile-color">
                                    <i v-if="!ascendingOrder" class='bx bxs-up-arrow'></i>
                                    <i v-else class='bx bxs-down-arrow'></i>
                                </button>
                            </div>
                        </th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                            <div class="flex">
                                User
                                <button @click="sortByName('user')" class="px-1 block text-profile-color">
                                    <i v-if="userSortOrder === 'desc'" class='bx bxs-up-arrow'></i>
                                    <i v-else class='bx bxs-down-arrow'></i>
                                </button>
                            </div>
                        </th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Password</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Dibuat</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Diedit</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Profil</th>
                        <th v-if="isAdmin" scope="col" class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white" v-if="paginatedUsers.length > 0">
                    <tr v-for="(user, loop) in paginatedUsers" :key="user.id" :class="{ 'bg-profile-color bg-opacity-10': user.id === authStore.user.data.id }" class="odd:bg-main-black hover:bg-stone-950">
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ loop + 1 }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ user.nama}}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ user.email}}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm capitalize">{{ getRole(user.id_role) }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm italic text-gray-500">Tidak diizinkan</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ formatDate(user.created_at) }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm">{{ formatDate(user.updated_at) }}</td>
                        <td v-if="isAdmin" class="px-4 py-0 whitespace-nowrap text-sm">
                            <router-link v-if="!hasKaryawan(user.id)" :to="`/editdetailuser/${user.id}`" class="text-green-500 hover:underline mr-4">Isi Profil</router-link>
                            <div v-else class="text-green-500">
                                <!-- <router-link :to="`/editprofileuser/${user.id}`" class="text-profile-color hover:underline mr-4">Edit Profil</router-link> -->
                                <i class='bx bxs-check-circle text-lg'></i>
                            </div>
                        </td>
                        <td v-if="isAdmin" class="px-4 py-2 whitespace-nowrap text-sm">
                            <router-link :to="`/edituser/${user.id}`" class="text-profile-color hover:underline mr-4">Edit</router-link>
                            <button v-if="isAdmin && user.id !== authStore.user.data.id" @click="deleteUser(user)" class="text-red-500 hover:underline">Hapus</button>
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
    const users = ref([]);
    const searchQuery = ref('');
    const ascendingOrder = ref(true);
    let currentPage = ref(1);
    const entitiesPerPage = ref(10);
    const rolesMap = ref({});
    const karyawans = ref([]);

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
    const totalPages = computed(() => Math.ceil(filteredUsers.value.length / entitiesPerPage.value));

    const fetchUsers = async () => {
        const response = await axios.get("http://localhost:8000/api/users", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });

        const filteredUsers = response.data.data.filter(user => user.id_role !== 5);

        users.value = filteredUsers.reverse();

        // users.value = response.data.data.reverse();

        // Fetch and store roles
        const roleResponse = await axios.get("http://localhost:8000/api/roles", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });

        const roles = roleResponse.data.data;
        for (const role of roles) {
            rolesMap.value[role.id] = role.name;
        }
    };

    // Function to get role Name based on role Id
    const getRole = (roleId) => {
        return rolesMap.value[roleId] || '-';
    };
    const fetchKaryawans = async () => {
        const response = await axios.get("http://localhost:8000/api/karyawans", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });

        karyawans.value = response.data.data;
    };

    onMounted(async () => {
        await fetchUsers();
        await fetchKaryawans();
    });

    // Method to check if a user has a corresponding entry in the karyawans table
    const hasKaryawan = (userId) => {
        return karyawans.value.some(karyawan => karyawan.id_user === userId);
    };


    // Computed property to filter users based on searchQuery
    const filteredUsers = computed(() => {
        return users.value.filter(user => {
            return user.nama.toLowerCase().includes(searchQuery.value.toLowerCase());
        });
    });

    // Computed property for paginated users
    const paginatedUsers = computed(() => {
        const startIndex = (currentPage.value - 1) * entitiesPerPage.value;
        const endIndex = startIndex + entitiesPerPage.value;
        return filteredUsers.value.slice(startIndex, endIndex);
    });

    // Sweet alert for delete
    const deleteUser = async (user) => {
        // Show SweetAlert confirmation dialog
        const result = await Swal.fire({
            title: 'Konfirmasi Penghapusan',
            text: 'Ingin menghapus User?',
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
                await axios.delete(`http://localhost:8000/api/users/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`,
                    },
                });
                Swal.fire(
                    'Berhasil dihapus!',
                    'User telah dihapus.',
                    'success'
                );
                // Reload list after deletion.
                await fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                Swal.fire(
                    'Gagal menghapus!',
                    'Terjadi kesalahan saat menghapus user.',
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
        users.value.reverse();
    };

    // Variables for sorting order
    let userSortOrder = ref('asc');

    // Sorting method
    const sortByName = (type) => {
        if (type === 'user') {
            if (userSortOrder.value === 'asc') {
                users.value.sort((a, b) => a.nama.localeCompare(b.nama));
                userSortOrder.value = 'desc';
            } else {
                users.value.sort((a, b) => b.nama.localeCompare(a.nama));
                userSortOrder.value = 'asc';
            }
        }
    };

    // Check user's role level
    const isAdmin = computed(() => {
        return authStore.user && authStore.user.data && authStore.user.data.id_role === 1;
    });

    // Function to make table exportable to MS Excel
    function exportToExcel() {
        console.log("Exporting to Excel...");

        // Get table element
        var table = document.getElementById("userTable");
        console.log("Table Element:", table);

        // Convert table to Excel workbook
        var wb = XLSX.utils.table_to_book(table);
        console.log("Workbook:", wb);

        // Save workbook to file
        XLSX.writeFile(wb, "list_user.xlsx");
        console.log("File berhasil Diexport.");
    }
</script>