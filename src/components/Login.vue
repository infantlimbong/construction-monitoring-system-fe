<template>
    <div class="login">
        <div class="w-80 bg-main-black rounded-xl overflow-hidden">
            <h2 class="bg-profile-color text-main-black text-center py-2 font-bold">DINAS BIMANARGA</h2>
            <form @submit.prevent="login" class="px-5 py-4">
                <div class="mb-4" v-if="errorMessage">
                    <p class="bg-red-100 text-red-700 rounded-lg p-4 text-center">{{ errorMessage }}</p>
                </div>
                <input type="hidden" name="remember" value="true" />
                <div class="mb-4">
                    <label for="email" class="font-bold block mb-1">Email</label>
                    <input type="text" id="email" v-model="email" required class="shadow appearance-none rounded w-full py-2 px-3 bg-white text-main-black leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-4 relative">
                    <label for="password" class="font-bold block mb-1">Password</label>
                    <input :type="passwordVisible ? 'text' : 'password'" id="password" v-model="password" required class="shadow appearance-none rounded w-full py-2 px-3 bg-white text-main-black leading-tight focus:outline-none focus:shadow-outline">
                    <button type="button" @click="passwordVisible = !passwordVisible" class="absolute text-gray-900 right-2 top-8" style="padding-top: 2px;">
                        <span v-show="!passwordVisible"><i class='bx bx-low-vision'></i></span>
                        <span v-show="passwordVisible"><i class='bx bx-low-vision text-profile-color'></i></span>
                    </button>
                </div>
                <div class="flex justify-center">
                    <button type="submit" class="bg-profile-color text-main-black font-semibold py-1 px-3 mt-5 rounded focus:outline-none focus:shadow-outline">LOGIN</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref } from "vue";
    import axios from "axios";
    import { useRouter, useRoute } from "vue-router";
    import { useAuthStore } from "@/stores/auth";

    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();

    const email = ref("");
    const password = ref("");
    const errorMessage = ref(null);
    const passwordVisible = ref(false);

    async function login() {
        try {
            await axios.get("http://localhost:8000/sanctum/csrf-cookie");
            const response = await axios.post("http://localhost:8000/api/login", {
                email: email.value,
                password: password.value,
            });
            authStore.setAccessToken(response.data.access_token);
            console.log("Login successful");
            router.push({ name: "dashboard" });
        } catch (error) {
            if (error.response && error.response.status === 422 && error.response.data.errors && error.response.data.errors.email) {
                errorMessage.value = error.response.data.errors.email[0];
            } else {
                errorMessage.value = "An error occurred: " + error.message;
            }
            console.error(errorMessage.value);
        }
    }
</script>

<style scoped>
    .login{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>