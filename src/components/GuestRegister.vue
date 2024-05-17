<template>
    <div class="grid place-items-center mt-16 md:mt-10 md:-ms-56">
        <div class="rounded-xl overflow-hidden bg-main-black w-80 md:w-96">
            <h1 class="bg-profile-color text-black text-center font-bold py-3">DINAS BINAMARGA</h1>
            <h2 class="text-lg font-semibold mt-5 mb-3 text-center">Mendaftar Sebagai Pelapor</h2>
            <form class="px-5 pb-5" @submit.prevent="addPengunjung">
                <div class="mb-2">
                    <label for="nama" class="font-bold block">Nama</label>
                    <input type="text" id="nama" name="nama" v-model="nama" placeholder="Ketik nama lengkap Anda" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-2">
                    <label for="email" class="font-bold block">Email <span v-if="emailError" class="text-red-400 font-normal"><small>*{{ emailError }}*</small></span></label>
                    <input type="email" id="email" name="email" v-model="email" placeholder="Ketik email Anda" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline" autocomplete="on">
                </div>
                <div class="mb-2 relative">
                    <label for="password" class="font-bold block">Password</label>
                    <input :type="passwordVisible ? 'text' : 'password'" id="password" name="password" v-model="password" placeholder="Ketik password Anda" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                    <button type="button" @click="passwordVisible = !passwordVisible" class="absolute text-white right-2 top-7" style="padding-top: 2px;">
                        <span v-show="!passwordVisible"><i class='bx bx-low-vision'></i></span>
                        <span v-show="passwordVisible"><i class='bx bx-low-vision text-profile-color'></i></span>
                    </button>
                </div>
                <div class="mb-4 relative">
                    <label for="password_confirmation" class="font-bold block">Konfirmasi Password <span v-if="error" class="text-red-400 font-normal"><small>*{{ error }}*</small></span></label>
                    <input :type="passwordVisible2 ? 'text' : 'password'" type="password" id="password_confirmation" name="password_confirmation" v-model="passwordConfirmation" placeholder="Konfirmasi password Anda" class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
                    <button type="button" @click="passwordVisible2 = !passwordVisible2" class="absolute text-white right-2 top-7" style="padding-top: 2px;">
                        <span v-show="!passwordVisible2"><i class='bx bx-low-vision'></i></span>
                        <span v-show="passwordVisible2"><i class='bx bx-low-vision text-profile-color'></i></span>
                    </button>
                </div>
                <div class="grid gap-y-2">
                    <button type="submit" class="bg-profile-color hover:bg-opacity-70 transition-all duration-300 font-semibold text-black py-2 px-3 rounded focus:outline-none focus:shadow-outline">Daftar</button>
                    <button type="button" @click="cancel" class="bg-gray-300 hover:bg-opacity-70 transition-all duration-300 font-semibold text-gray-800 py-2 px-3 rounded inline-block">Batal</button>
                    <p class="text-center">Sudah mendaftar? <RouterLink class="text-blue-500 hover:underline" to="/loginpengunjung">Login</RouterLink></p>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import axios from 'axios';
    import Swal from "sweetalert2";
    import { useRouter } from "vue-router";

    const router = useRouter();
    const nama = ref("");
    const email = ref("");
    const password = ref("");
    const passwordConfirmation = ref("");
    const error = ref("");
    const emailError = ref("");
    const mainError = ref("");
    const passwordVisible = ref(false);
    const passwordVisible2 = ref(false);


    const addPengunjung = async () => {
        try {
            // Client-side validation
            if (password.value !== passwordConfirmation.value) {
                error.value = 'Password tidak cocok';
                return;
            }

            if (!nama.value) {
                alert('Nama tidak boleh kosong');
                return;
            }

            if (!email.value) {
                alert('Email tidak boleh kosong');
                return;
            }

            if (!password.value) {
                alert('Password tidak boleh kosong');
                return;
            }

            // Send registration request to the backend
            const response = await axios.post('http://localhost:8000/api/registers', {
                nama: nama.value,
                email: email.value,
                password: password.value
            });

            // SweetAlert notification after successful update
            Swal.fire({
                icon: 'success',
                title: 'Berhasil Mendaftar',
                text: 'Silahkan Login kembali',
            });

            router.push(`/loginpengunjung`);

            console.log(response.data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.error(error.response.data.message);
                // Check if the error message is specific to email registration
                if (error.response.data.message === 'Email telah terdaftar') {
                    emailError.value = error.response.data.message;
                } else {
                    mainError.value = error.response.data.message;
                }
            } else {
                console.error("An unexpected error occurred:", error);
                mainError.value = "An unexpected error occurred. Please try again later.";
            }
        }
    };

    const cancel = () => {
        router.go(-1);
    };
</script>
  