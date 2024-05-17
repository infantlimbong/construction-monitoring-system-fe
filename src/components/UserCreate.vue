<template>
  <div class="p-5">
    <h2 class="mb-5 font-bold text-3xl">Tambah User</h2>
    <form @submit.prevent="addUser">
      <div class="mb-4">
        <label for="nama" class="font-bold block mb-1">Nama Lengkap</label>
        <input type="text" id="nama" name="nama" v-model="nama" required class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label for="email" class="font-bold block mb-1">Email <span v-if="emailError" class="text-red-400 font-normal"><small>*{{ emailError }}*</small></span></label>
        <input type="email" id="email" name="email" v-model="email" required class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline" autocomplete="on">
      </div>
      <div class="mb-4">
        <label for="role" class="font-bold block mb-1">Select Role</label>
        <select id="role" v-model="selectedRoleId" class="shadow capitalize border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
            <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="password" class="font-bold block mb-1">Password</label>
        <input type="password" id="password" name="password" v-model="password" required class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label for="password_confirmation" class="font-bold block mb-1">Confirm Password <span v-if="error" class="text-red-400 font-normal"><small>*{{ error }}*</small></span></label>
        <input type="password" id="password_confirmation" name="password_confirmation" v-model="passwordConfirmation" required class="shadow appearance-none border rounded w-full py-2 px-3 bg-secondary-black text-white leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="flex items-center gap-2">
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded focus:outline-none focus:shadow-outline">Simpan</button>
        <button type="button" @click="cancel" class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded inline-block">Batal</button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue';
  import axios from 'axios';
  import Swal from "sweetalert2";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "@/stores/auth";

  const authStore = useAuthStore();
  const router = useRouter();
  const nama = ref("");
  const email = ref("");
  const password = ref("");
  const passwordConfirmation = ref("");
  const error = ref("");
  const emailError = ref("");
  const mainError = ref("");
  const roles = ref([]);
  const selectedRoleId = ref(null);

  const addUser = async () => {
    try {
      // Client-side validation
      if (password.value !== passwordConfirmation.value) {
        error.value = 'Password tidak sama';
        return;
      }

      // Send registration request to the backend
      const response = await axios.post('http://localhost:8000/api/users', {
        nama: nama.value,
        email: email.value,
        id_role: selectedRoleId.value,
        password: password.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });

      // SweetAlert notification after successful update
      Swal.fire({
          icon: 'success',
          title: 'User ditambah',
          text: 'Berhasil menambahkan user',
      });

      router.push(`/listuser`);

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

  // Fetch roles on component mount
  onMounted(async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/roles", {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });
      const filteredRole = response.data.data.filter(role => role.id !== 5)
      
      roles.value = filteredRole;
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  });

  // Watch for changes in selected role
  watch(selectedRoleId, (newVal, oldVal) => {
    // Perform any necessary actions when the selected role ID changes
    console.log('Selected role ID changed from', oldVal, 'to', newVal);
  });

  const cancel = () => {
      router.go(-1);
  };

</script>
