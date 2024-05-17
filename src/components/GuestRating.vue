<template>
    <div v-if="ratings.length == 0" class="p-5">
        <h1 class="text-2xl mb-5">Beri Rating</h1>

        <form @submit.prevent="createRating" class="max-w-full mx-auto mt-5">
            <div class="mb-4">
                <label class="font-semibold block mb-1">Rating <span class="text-red-500">*</span></label>
                <div class="flex items-center gap-2">
                    <span v-for="star in 5" :key="star" @click="rate = star" :class="{ 'text-profile-color': star <= rate, 'text-gray-400': star > rate }" class="cursor-pointer text-xl">
                        <i :class="[star <= rate ? 'bx bxs-star' : 'bx bx-star']"></i>
                    </span>
                </div>
            </div>
            <div class="mb-4">
                <label for="review" class="font-semibold block mb-1">Review & Masuk <span class="text-red-500">*</span></label>
                <textarea v-model="review" rows="4" name="review" id="review" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline"></textarea>
            </div>

            <div class="flex items-center gap-2">
                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded focus:outline-none focus:shadow-outline">Kirim</button>
                <button type="button" @click="resetForm" class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded inline-block">Reset</button>
            </div>
        </form>
    </div>

    <!-- Display rating data -->
    <div v-else class="mt-8 px-5">
        <h2 class="text-xl font-semibold mb-3">Rating Anda</h2>
        <ul>
            <li v-for="(rating, index) in ratings" :key="index">
                <p class="font-semibold">Rating:</p>
                <!-- Render stars based on rating value -->
                <div class="flex items-center">
                    <span
                        v-for="star in 5"
                        :key="star"
                        :class="{
                            'text-yellow-500': star <= rating.rate,
                            'text-gray-400': star > rating.rate
                        }"
                        class="text-xl"
                    >
                        <i :class="[star <= rating.rate ? 'bx bxs-star' : 'bx bx-star']"></i>
                    </span>
                </div>
                <p class="font-semibold mt-3">Review:<br> <span class=" font-normal">{{ rating.review }}</span></p>
            </li>
        </ul>
    </div>
</template>

<script setup>
    import axios from "axios";
    import Swal from "sweetalert2";
    import { ref, onMounted } from "vue";
    import { useRouter } from "vue-router";
    import { useAuthStore } from "@/stores/auth";

    const authStore = useAuthStore();
    const router = useRouter();
    const rate = ref(0);
    const review = ref("");
    const ratings = ref([]);

    const createRating = async () => {
        // Alert message if the form empty / invalid
        if (!rate.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Mohon beri rating Anda',
            });
            return;
        }

        if (!review.value) {
            Swal.fire({
                icon: 'warning',
                title: 'Data tidak valid',
                text: 'Mohon beri review Anda',
            });
            return;
        }

        try {
            await axios.post("http://localhost:8000/api/ratings", {
                id_user: authStore.user.id,
                rate: rate.value,
                review: review.value
            },
            {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });

            // SweetAlert notification after successful creation
            Swal.fire({
                icon: 'success',
                title: 'Rating berhasil dikirim!',
                text: 'Terimakasih atas masukan Anda',
            });

            router.push("/listpengaduanpengunjung");
        } catch (error) {
            console.error('Error creating rating:', error);
        }
    };

    // Fetch ratings data when component mounts
    onMounted(async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/ratings", {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            const allRatings = response.data.data;
    
            ratings.value = allRatings.filter(rating => rating.id_user === authStore.user.data.id);
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    });

    const resetForm = () => {
        rate.value = 0;
        review.value = "";

        // Reset form element
        if ($refs.ratingForm) {
            $refs.ratingForm.reset();
        }
    };

</script>