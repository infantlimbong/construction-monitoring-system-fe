<template>
    <div class="px-5">
        <div class="mt-8 flex items-center justify-between">
            <h1 class="text-3xl">List Rating Pengunjung</h1>
            <div class="flex gap-x-5 items-center">
                <p>Total Ratings: <span class="text-profile-color">({{ totalLength }})</span></p>
                <select id="ratingFilter" v-model="selectedRating" :class="{ 'text-profile-color': selectedRating > 0 }" class="py-1 border bg-main-black rounded">
                    <option class="text-white" value="">Semua</option>
                    <option class="text-profile-color" v-for="star in 5" :key="star" :value="star">
                        <span v-for="i in star" :key="i" >★</span>
                    </option>
                </select>
            </div>
        </div>
        <!-- Display rating data -->
        <div v-if="filteredRatings.length > 0" class="mt-8">
            <ul>
                <li class="mt-3 border-b border-1 border-gray-500" v-for="(rating, index) in filteredRatings" :key="index">
                    <p class="font-bold text-xl">{{ getUserName(rating.id_user) }}</p>
                    <!-- <p class="font-bold">Rating:</p> -->
                    <!-- Render stars based on rating value -->
                    <div class="flex items-center mb-2">
                        <span v-for="star in 5" :key="star" class="text-xl text-profile-color">
                            <i :class="[star <= rating.rate ? 'bx bxs-star' : 'bx bx-star']"></i>
                        </span>
                    </div>
                    <p class="font-bold mb-2">Ulasan:<br> <span class=" font-normal">{{ rating.review }}</span></p>
                    <p class="font-bold mb-3">Diulas pada: <span class=" font-normal">{{ formatDate(rating.created_at) }}</span></p>
                </li>
            </ul>
        </div>

        <div v-else class="text-center mt-8">
            Belum ada Rating
        </div>
    </div>
</template>

<script setup>
    import axios from "axios";
    import { ref, onMounted, computed } from "vue";
    import { useAuthStore } from "@/stores/auth";

    const authStore = useAuthStore();
    const ratings = ref([]);
    const usersMap = ref({});
    const selectedRating = ref('');


    const fetchratings = async () => {
        const response = await axios.get("http://localhost:8000/api/ratings", {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });

        ratings.value = response.data.data.reverse();

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
    onMounted(fetchratings);

    const getUserName = (userId) => {
        return usersMap.value[userId] || 'Unknown';
    };

    // Computed property to filter ratings based on selected rating
    const filteredRatings = computed(() => {
        if (!selectedRating.value) {
            return ratings.value;
        } else {
            return ratings.value.filter(rating => rating.rate === parseInt(selectedRating.value));
        }
    });

    // Computed property to calculate the total length of filtered ratings
    const totalLength = computed(() => {
        return filteredRatings.value.length;
    });

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