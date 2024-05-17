<template>
    <div v-if="isAdmin || isKaryawan1" class="flex flex-wrap gap-3 p-4">
        <div class="w-full bg-main-black px-4 py-3 rounded-2xl flex-grow basis-52">
            <h5 class="font-semibold">Karyawan Terdaftar</h5>
            <div class="grid place-items-center py-8">
                <p class="text-3xl font-bold md:text-4xl">{{ formatNumber(totalUsers) }}</p>
            </div>
        </div>

        <div class="w-full bg-main-black px-4 py-3 rounded-2xl flex-grow basis-52">
            <h5 class="font-semibold">Pengunjung Terdaftar</h5>
            <div class="grid place-items-center py-8">
                <p class="text-3xl font-bold md:text-4xl">{{ formatNumber(totalVisitors) }}</p>
            </div>
        </div>

        <div class="w-full bg-main-black px-4 py-3 rounded-2xl flex-grow basis-52">
            <h5 class="font-semibold">Total Pengaduan</h5>
            <div class="grid place-items-center py-8">
                <p class="text-3xl font-bold md:text-4xl">{{ formatNumber(totalComplaints) }}</p>
            </div>
        </div>

        <div class="w-full bg-main-black px-4 py-3 rounded-2xl flex-grow basis-52">
            <h5 class="font-semibold">Total Ratings</h5>
            <div class="grid place-items-center py-8">
                <p class="text-3xl font-bold md:text-4xl">{{ formatNumber(totalRatings) }}</p>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-3 p-4 lg:flex-row">
        <div class="w-full bg-main-black p-5 rounded-2xl lg:w-3/5">
            <div class="flex justify-between mb-4">
                <h5 class="font-semibold">Data Kondisi Jalan</h5>
                <!-- Add select dropdown for year selection -->
                <select id="year" v-model="selectedYear" class="border rounded px-2 bg-secondary-black text-white focus:outline-none">
                    <option value="">Semua</option>
                    <option v-for="year in uniqueYears" :value="year">{{ year }}</option>
                </select>
            </div>
            <div class="hidden bg-custom-green"></div>
            <div class="hidden bg-custom-yellow"></div>
            <div class="hidden bg-custom-pink"></div>
            <div class="hidden bg-custom-red"></div>
            <div class="flex flex-col gap-y-5 sm:flex-row sm:gap-x-5">
                <div class="sm:w-7/12 sm:flex sm:flex-col sm:justify-center md:w-3/5 lg:w-7/12">
                    <div class="grid gap-y-2">
                        <div v-for="condition in conditions">
                            <div :key="condition.color" :class="['bg-' + 'custom-' + condition.color, 'flex', 'justify-between', 'items-center', 'p-2', 'rounded-2xl']">
                                <p class="flex items-center gap-x-3"><i class='bx bx-circle' style="font-size: 8px;"></i>{{ condition.label }}</p>
                                <button class="bg-white bg-opacity-25 px-5 rounded-xl">{{ condition.count }}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative flex justify-center sm:w-5/12 md:w-2/5 lg:w-5/12">
                    <div class="w-72 aspect-square flex justify-center items-center align-middle md:w-52 z-10">
                        <canvas id="donutChart" class="w-full h-full p-0 m-0 mt-1"></canvas>
                    </div>
                    <div class="text-center absolute top-0 left-0 w-full h-full grid items-center z-0">
                        <div>
                            <h2 class="text-7xl font-bold md:text-5xl">{{ formatNumber(totalKeseluruhanKondisi) }}</h2>
                            <p>Total</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-main-black p-5 rounded-2xl lg:w-2/5">
            <div class="font-semibold mb-2 flex justify-between">
                <h5>Jalan</h5>
                <h5>Proses Pembangunan</h5>
            </div>
            <!-- Display filtered and sorted data -->
            <div v-for="(jalan, index) in filteredAndSortedData.slice(0, 8)" :key="index" class="flex justify-between items-center">
                <p class="flex items-center gap-x-3">{{ jalan.nama_ruas_jalan }}</p>
                <div class="flex items-center gap-x-2">
                    <div class="w-20 h-1 bg-stone-700 rounded-xl overflow-hidden flex justify-end">
                        <div class="h-full bg-profile-color rounded-s-full" :style="{ width: jalan.progress + '%' }"></div>
                    </div>
                    <p class="w-8 text-end">{{ jalan.progress }}%</p>
                </div>
            </div>
        </div>
    </div>

    <div class="flex flex-col gap-3 p-4 lg:flex-row">
        <div class="w-full bg-main-black p-5 rounded-2xl lg:w-3/5">
            <div class="flex justify-between mb-4">
                <h5 class="font-semibold">Data Kondisi Jembatan</h5>
                <!-- Add select dropdown for year selection -->
                <select id="jemYear" v-model="selectedJembatanYear" class="border rounded px-2 bg-secondary-black text-white focus:outline-none">
                    <option value="">Semua</option>
                    <option v-for="jemYear in uniqueYearsJembatan" :value="jemYear">{{ jemYear }}</option>
                </select>
            </div>
            <div class="hidden bg-custom-green"></div>
            <div class="hidden bg-custom-yellow"></div>
            <div class="hidden bg-custom-pink"></div>
            <div class="hidden bg-custom-red"></div>
            <div class="flex flex-col gap-y-5 sm:flex-row sm:gap-x-5">
                <div class="sm:w-7/12 sm:flex sm:flex-col sm:justify-center md:w-3/5 lg:w-7/12">
                    <div class="grid gap-y-2">
                        <div v-for="jembatanCondition in jembatanConditions">
                            <div :key="jembatanCondition.color" :class="['bg-' + 'custom-' + jembatanCondition.color, 'flex', 'justify-between', 'items-center', 'p-2', 'rounded-2xl']">
                                <p class="flex items-center gap-x-3"><i class='bx bx-circle' style="font-size: 8px;"></i>{{ jembatanCondition.label }}</p>
                                <button class="bg-white bg-opacity-25 px-5 rounded-xl">{{ jembatanCondition.count }}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative flex justify-center sm:w-5/12 md:w-2/5 lg:w-5/12">
                    <div class="w-72 aspect-square flex justify-center items-center align-middle md:w-52 z-10">
                        <canvas id="donutChartJembatan" class="w-full h-full p-0 m-0 mt-1"></canvas>
                    </div>
                    <div class="text-center absolute top-0 left-0 w-full h-full grid items-center z-0">
                        <div>
                            <h2 class="text-7xl font-bold md:text-5xl">{{ formatNumber(totalKeseluruhanKondisiJembatan) }}</h2>
                            <p>Total</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-main-black p-5 rounded-2xl lg:w-2/5">
            <div class="font-semibold mb-2 flex justify-between">
                <h5>Jembatan</h5>
                <h5>Proses Pembangunan</h5>
            </div>
            <!-- Display filtered and sorted data -->
            <div v-for="(jembatan, index) in filteredAndSortedDataJembatan.slice(0, 8)" :key="index" class="flex justify-between items-center">
                <p class="flex items-center gap-x-3">{{ jembatan.nama_ruas_jembatan }}</p>
                <div class="flex items-center gap-x-2">
                    <div class="w-20 h-1 bg-stone-700 rounded-xl overflow-hidden flex justify-end">
                        <div class="h-full bg-profile-color rounded-s-full" :style="{ width: jembatan.progress + '%' }"></div>
                    </div>
                    <p class="w-8 text-end">{{ jembatan.progress }}%</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, nextTick, watch } from "vue";
    import axios from "axios";
    import Chart from 'chart.js/auto';
    import { useAuthStore } from "@/stores/auth";

    const authStore = useAuthStore();

    // initialize for data User
    const dataUser = ref([]);

    const totalUsers = ref(0);
    const totalVisitors = ref(0);
    const totalComplaints = ref(0);
    const totalRatings = ref(0);

    const dataJalan = ref([]);
    const selectedYear = ref("");

    // initialize for data jembatan
    const dataJembatan = ref([]);
    const selectedJembatanYear = ref("");

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Fetch user data from API
    const fetchUser = async () => {
        const apiUrl = `http://localhost:8000/api/users`;

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            const filteredUsers = response.data.data.filter(user => user.id_role !== 5);

            dataUser.value = filteredUsers;

            // Calculate total number of users
            totalUsers.value = filteredUsers.length;

            totalVisitors.value = response.data.data.length - filteredUsers.length;
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // Fetch complaint data from API
    const fetchComplaints = async () => {
        const apiUrl = `http://localhost:8000/api/pengaduans`;

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            totalComplaints.value = response.data.data.length;
        } catch (error) {
            console.error('Error fetching complaint data:', error);
        }
    };

    // Fetch ratings data from API
    const fetchRatings = async () => {
        const apiUrl = `http://localhost:8000/api/ratings`;

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            totalRatings.value = response.data.data.length;
        } catch (error) {
            console.error('Error fetching ratings data:', error);
        }
    };

    // Fetch road condition data from API
    const fetchJalan = async () => {
        const apiUrl = `http://localhost:8000/api/lap_kondisi_jalans`;

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            dataJalan.value = response.data.data;
            // Render the chart after data is fetched
            nextTick(renderDonutChart);
        } catch (error) {
            console.error('Error fetching jalan condition data:', error);
        }
    };

    // Filter out records with progress of 100
    const filteredDataJalan = computed(() => {
        return dataJalan.value.filter(jalan => jalan.progress < 100 && jalan.progress > 0);
    });

    // Get unique years from data
    const uniqueYears = computed(() => {
        const years = [...new Set(dataJalan.value.map(jalan => jalan.tahun_pembangunan))];
        return years.sort((a, b) => b - a);
    });

    // Filter out records based on the selected year
    const filteredDataJalanYear = computed(() => {
        return dataJalan.value.filter(jalan => (!selectedYear.value || jalan.tahun_pembangunan === selectedYear.value));
    });

    // Calculate total amount of keseluruhan_kondisi data for the selected year
    const totalKeseluruhanKondisi = computed(() => {
        return filteredDataJalanYear.value.length;
    });

    // Combine filtering and sorting
    const filteredAndSortedData = computed(() => {
        return filteredDataJalan.value.slice().sort((a, b) => b.progress - a.progress);
    });

    // Compute the conditions for keseluruhan_kondisi based on the selected year
    const conditions = computed(() => {
        const counts = {
            'Baik': 0,
            'Cukup Baik': 0,
            'Buruk': 0,
            'Sangat Buruk': 0
        };

        filteredDataJalanYear.value.forEach(jalan => {
            counts[jalan.keseluruhan_kondisi]++;
        });

        return [
            { color: 'green', label: 'Baik', count: counts['Baik'] },
            { color: 'yellow', label: 'Cukup Baik', count: counts['Cukup Baik'] },
            { color: 'pink', label: 'Buruk', count: counts['Buruk'] },
            { color: 'red', label: 'Sangat Buruk', count: counts['Sangat Buruk'] }
        ];
    });

    // Function to render data chart
    const renderDonutChart = () => {
        const ctx = document.getElementById('donutChart').getContext('2d');

        if (!ctx) {
            console.error('Canvas context not found');
            return;
        }

        const data = {
            datasets: [{
                label: 'Jumlah',
                data: conditions.value.map(condition => condition.count),
                backgroundColor: [
                    '#06D6A0',   // green
                    '#FCBF49',    // yellow
                    '#EF476F',    // pink
                    '#D90429'     // red
                ],
                borderColor: 'transparent',
                borderWidth: 0,
            }]
        };

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
            cutout: '65%', // Adjust the size of the hole in the center
        };

        // Destroy existing chart if exists
        if (window.myDonutChart) {
            window.myDonutChart.destroy();
        }

        window.myDonutChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: options
        });
    };

    // Jembatan
    // Fetch road condition data from API
    const fetchJembatan = async () => {
        const apiUrlJembatan = `http://localhost:8000/api/lap_kondisi_jembatans`;

        try {
            const JemResponse = await axios.get(apiUrlJembatan, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            dataJembatan.value = JemResponse.data.data;
            // Render the chart after data is fetched
            nextTick(renderDonutChartJembatan);
        } catch (error) {
            console.error('Error fetching jembatan condition data:', error);
        }
    };

    // Filter out records with progress of 100
    const filteredDataJembatan = computed(() => {
        return dataJembatan.value.filter(jembatan => jembatan.progress < 100 && jembatan.progress > 0);
    });

    // Get unique years from data
    const uniqueYearsJembatan = computed(() => {
        const jemYears = [...new Set(dataJembatan.value.map(jembatan => jembatan.tahun_pembangunan))];
        return jemYears.sort((a, b) => b - a);
    });

    // Filter out records based on the selected year
    const filteredDataJembatanYear = computed(() => {
        return dataJembatan.value.filter(jembatan => (!selectedJembatanYear.value || jembatan.tahun_pembangunan === selectedJembatanYear.value));
    });

    // Calculate total amount of keseluruhan_kondisi data for the selected year
    const totalKeseluruhanKondisiJembatan = computed(() => {
        return filteredDataJembatanYear.value.length;
    });

    // Combine filtering and sorting
    const filteredAndSortedDataJembatan = computed(() => {
        return filteredDataJembatan.value.slice().sort((a, b) => b.progress - a.progress);
    });

    // Compute the conditions for keseluruhan_kondisi based on the selected year
    const jembatanConditions = computed(() => {
        const jembatanCounts = {
            'Baik': 0,
            'Cukup Baik': 0,
            'Buruk': 0,
            'Sangat Buruk': 0
        };

        filteredDataJembatanYear.value.forEach(jembatan => {
            jembatanCounts[jembatan.keseluruhan_kondisi]++;
        });

        return [
            { color: 'green', label: 'Baik', count: jembatanCounts['Baik'] },
            { color: 'yellow', label: 'Cukup Baik', count: jembatanCounts['Cukup Baik'] },
            { color: 'pink', label: 'Buruk', count: jembatanCounts['Buruk'] },
            { color: 'red', label: 'Sangat Buruk', count: jembatanCounts['Sangat Buruk'] }
        ];
    });

    // Function to render the donut chart
    const renderDonutChartJembatan = () => {
        const jemCtx = document.getElementById('donutChartJembatan').getContext('2d');

        if (!jemCtx) {
            console.error('Canvas context not found');
            return;
        }

        const jemData = {
            datasets: [{
                label: 'Jumlah',
                data: jembatanConditions.value.map(jembatanCondition => jembatanCondition.count), // Here, use jembatanConditions instead of JembatanCondition
                backgroundColor: [
                    '#06D6A0',   // green
                    '#FCBF49',    // yellow
                    '#EF476F',    // pink
                    '#D90429'     // red
                ],
                borderColor: 'transparent',
                borderWidth: 0,
            }]
        };

        const jemOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
            cutout: '65%', // Adjust the size of the hole in the center
        };

        // Destroy existing chart if exists
        if (window.myDonutChartJembatan) {
            window.myDonutChartJembatan.destroy();
        }

        window.myDonutChartJembatan = new Chart(jemCtx, {
            type: 'doughnut',
            data: jemData,
            options: jemOptions
        });
    };


    // Fetch initial data when component is mounted
    onMounted(() => {
        fetchUser();
        fetchComplaints();
        fetchJalan();
        fetchJembatan();
        fetchRatings();
    });

    // Watch for changes in selected year and re-render the chart
    watch(selectedYear, () => {
        renderDonutChart();
    });

    watch(selectedJembatanYear, () => {
        renderDonutChartJembatan();
    });

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
    const isKaryawan3 = computed(() => {
        return authStore.user && authStore.user.data && authStore.user.data.id_role === 4;
    });
    const isBaru = computed(() => {
        return authStore.user && authStore.user.data && authStore.user.data.id_role === 5;
    });
</script>