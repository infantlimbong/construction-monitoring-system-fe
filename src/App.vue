<template v-if="authStore.isLoggedIn">
    <header v-if="authStore.isLoggedIn && isAdmin || isKaryawan1 || isKaryawan2 || isKaryawan3 || isBaru" class="sticky top-0 z-50 flex flex-col md:flex-row md:bg-main-black md:justify-between md:items-center md:px-0 md:py-0">
      <div class="flex justify-between items-center bg-profile-color py-3 px-4 md:py-5 md:px-5 md:w-56 md:justify-normal md:relative">
        <div class="flex items-center gap-x-2">
          <img src="./assets/logo.png" alt="logo" class="w-7">
          <h3 class="text-black text-sm font-bold">DINAS BINAMARGA</h3>
        </div>
        <button @click="toggleMobileNav" class="text-black md:ms-5 md:absolute md:-right-4 md:bg-profile-color md:rounded-full md:text-xs md:w-8 md:aspect-square">
          <span class="text-2xl md:text-xl"><i class='bx bx-menu'></i></span>
        </button>
      </div>
      <div class="px-4 py-2 md:mt-0 bg-main-black">
        <div class="text-right flex justify-end">
          <h4 v-if="authStore.user && authStore.user.data && authStore.user.data.nama" class="text-right flex items-center border px-2 rounded-2xl gap-x-2">
              <i class='bx bxs-user-circle text-2xl'></i>
              {{ authStore.user.data.nama }}
          </h4>
        </div>
      </div>
    </header>
    <!-- authStore.isLoggedIn -->
    <div>
      <aside v-if="authStore.isLoggedIn && isAdmin || isKaryawan1 || isKaryawan2 || isKaryawan3" :class="{ 'fixed left-0 transition-all duration-300 md:-left-full': isMobileNavOpen, 'fixed -ms-80 transition-all duration-500 md:block md:ms-0 md:duration-200': !isMobileNavOpen }" class="aside-nav text-sm fixed z-50 bg-main-black left-0 top-14 overflow-y-scroll w-1/2 sm:w-1/3 md:top-16 md:mt-1 md:w-56">
        <RouterLink @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/' }" class="block md:hidden py-2 px-4 border-b border-stone-800" to="/">Dashboard</RouterLink>
        <RouterLink @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/profileuser' }" class="block md:hidden py-2 px-4 border-b border-stone-800" to="/profileuser">Profile</RouterLink>
        <RouterLink @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/listjalan' }" class="block md:hidden py-2 px-4 border-b border-stone-800" to="/listjalan">Laporan Jalan</RouterLink>
        <RouterLink @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/listjembatan' }" class="block md:hidden py-2 px-4 border-b border-stone-800" to="/listjembatan">Laporan Jembatan</RouterLink>
        <button v-if="isAdmin || isKaryawan1 || isKaryawan2" @click="toggleDaerah" class="flex items-center justify-between md:hidden py-2 px-4 border-b border-stone-800 w-full text-start">
            Daerah
            <i v-if="!daerahOpen" class='bx bx-chevron-down'></i>
            <i v-else class='bx bx-chevron-up'></i>
        </button>
          <div v-if="daerahOpen" class="md:hidden">
            <RouterLink @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/listkabupaten' }" class="block py-2 ps-8 border-b border-stone-800" to="/listkabupaten">Kabupaten</RouterLink>
            <RouterLink @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/listkecamatan' }" class="block py-2 ps-8 border-b border-stone-800" to="/listkecamatan">Kecamatan</RouterLink>
            <RouterLink @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/listdesa' }" class="block py-2 ps-8 border-b border-stone-800" to="/listdesa">Desa</RouterLink>
          </div>
        <RouterLink @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/listdana' }" class="block md:hidden py-2 px-4 border-b border-stone-800" to="/listdana">Sumber Dana</RouterLink>
        <RouterLink @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/listlaporan' }" class="block md:hidden py-2 px-4 border-b border-stone-800" to="/listlaporan">Laporan Kegiatan Bulanan</RouterLink>
        <RouterLink v-if="isAdmin || isKaryawan1" @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/listuser' }" class="block md:hidden py-2 px-4 border-b border-stone-800" to="/listuser">User</RouterLink>
        <RouterLink v-if="isAdmin || isKaryawan1" @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/listpengunjung' }" class="block md:hidden py-2 px-4 border-b border-stone-800" to="/listpengunjung">Pengunjung</RouterLink>
        <RouterLink v-if="isAdmin || isKaryawan1" @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/listpengaduan' }" class="block md:hidden py-2 px-4 border-b border-stone-800" to="/listpengaduan">Pengaduan Pengunjung</RouterLink>
        <RouterLink v-if="isAdmin || isKaryawan1" @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/listrating' }" class="block md:hidden py-2 px-4 border-b border-stone-800" to="/listrating">Rating Pengunjung</RouterLink>
        <button @click.native="toggleMobileNav" @click="logout" class="block md:hidden py-2 px-4 border-b border-stone-800 w-full text-start">Logout</button>

        <RouterLink :class="{ 'bg-stone-950': $route.path === '/' }" class="hidden md:flex items-center gap-x-1 py-2 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/"><i class='text-xl w-6 bx bxs-dashboard'></i>Dashboard</RouterLink>
        <RouterLink :class="{ 'bg-stone-950': $route.path === '/profileuser' }" class="hidden md:flex items-center gap-x-1 py-2 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/profileuser"><i class='text-xl w-6 bx bxs-user-detail'></i>Profile</RouterLink>
        <RouterLink :class="{ 'bg-stone-950': $route.path === '/listjalan' }" class="hidden md:flex items-center gap-x-1 py-2 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/listjalan"><i class='text-xl w-6 bx bxs-report' ></i>Laporan Jalan</RouterLink>
        <RouterLink :class="{ 'bg-stone-950': $route.path === '/listjembatan' }" class="hidden md:flex items-center gap-x-1 py-2 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/listjembatan"><i class='text-xl w-6 bx bxs-report' ></i>Laporan Jembatan</RouterLink>
        <button v-if="isAdmin || isKaryawan1 || isKaryawan2" @click="toggleDaerah" class="hidden md:flex md:justify-between md:items-center py-2 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300 w-full text-start">
            <div class="flex items-center gap-x-1">
              <i class='text-xl w-6 bx bxs-business' ></i>Daerah
            </div>
            <i v-if="!daerahOpen" class='bx bx-chevron-down'></i>
            <i v-else class='bx bx-chevron-up'></i>
        </button>
        <div v-if="daerahOpen" class="hidden md:block">
          <RouterLink :class="{ 'bg-stone-950': $route.path === '/listkabupaten' }" class="hidden md:block py-3 ps-8 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/listkabupaten">Kabupaten</RouterLink>
          <RouterLink :class="{ 'bg-stone-950': $route.path === '/listkecamatan' }" class="hidden md:block py-3 ps-8 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/listkecamatan">Kecamatan</RouterLink>
          <RouterLink :class="{ 'bg-stone-950': $route.path === '/listdesa' }" class="hidden md:block py-3 ps-8 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/listdesa">Desa</RouterLink>
        </div>
        <RouterLink :class="{ 'bg-stone-950': $route.path === '/listdana' }" class="hidden md:flex items-center gap-x-1 py-2 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/listdana"><i class='text-xl w-6 bx bx-money'></i>Sumber Dana</RouterLink>
        <RouterLink :class="{ 'bg-stone-950': $route.path === '/listlaporan' }" class="hidden md:flex items-center gap-x-1 py-2 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/listlaporan"><i class='text-xl w-6 bx bxs-calendar-check'></i>Laporan Kegiatan Bulanan</RouterLink>
        <RouterLink v-if="isAdmin || isKaryawan1" :class="{ 'bg-stone-950': $route.path === '/listuser' }" class="hidden md:flex items-center gap-x-1 py-2 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/listuser"><i class='text-xl w-6 bx bxs-user-account'></i>User</RouterLink>
        <RouterLink v-if="isAdmin || isKaryawan1" :class="{ 'bg-stone-950': $route.path === '/listpengunjung' }" class="hidden md:flex items-center gap-x-1 py-2 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/listpengunjung"><i class='text-xl w-6 bx bxs-user-x'></i>Pengunjung</RouterLink>
        <RouterLink v-if="isAdmin || isKaryawan1" :class="{ 'bg-stone-950': $route.path === '/listpengaduan' }" class="hidden md:flex items-center gap-x-1 py-2 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/listpengaduan"><i class='text-xl w-6 bx bxs-user-voice'></i>Pengaduan Pengunjung</RouterLink>
        <RouterLink v-if="isAdmin || isKaryawan1" :class="{ 'bg-stone-950': $route.path === '/listrating' }" class="hidden md:flex items-center gap-x-1 py-2 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/listrating"><i class='text-xl w-6 bx bxs-star-half'></i>Rating Pengunjung</RouterLink>
        <button @click="logout" class="hidden md:flex items-center gap-x-1 py-2 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300 w-full text-start"><i class='text-xl w-6 bx bx-log-out-circle'></i>Logout</button>
      </aside>

      <aside v-if="isBaru" :class="{ 'fixed left-0 transition-all duration-300 md:-left-full': isMobileNavOpen, 'fixed -ms-80 transition-all duration-500 md:block md:ms-0 md:duration-200': !isMobileNavOpen }" class="text-sm fixed z-50 bg-main-black left-0 top-14 h-full w-1/2 sm:w-1/3 md:top-16 md:mt-1 md:w-56">
        <RouterLink @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/' }" class="block md:hidden py-2 px-4 border-b border-stone-800" to="/">Dashboard</RouterLink>
        <RouterLink @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/listpengaduanpengunjung' }" class="block md:hidden py-2 px-4 border-b border-stone-800" to="/listpengaduanpengunjung">Pengaduan Saya</RouterLink>
        <RouterLink @click.native="toggleMobileNav" :class="{ 'bg-stone-950': $route.path === '/ratingpengunjung' }" class="block md:hidden py-2 px-4 border-b border-stone-800" to="/ratingpengunjung">Beri Rating</RouterLink>
        <button @click.native="toggleMobileNav" @click="logout" class="block md:hidden py-2 px-4 border-b border-stone-800 w-full text-start">Logout</button>

        <RouterLink :class="{ 'bg-stone-950': $route.path === '/' }" class="hidden md:block py-3 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/">Dashboard</RouterLink>
        <RouterLink :class="{ 'bg-stone-950': $route.path === '/listpengaduanpengunjung' }" class="hidden md:block py-3 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/listpengaduanpengunjung">Pengaduan Saya</RouterLink>
        <RouterLink :class="{ 'bg-stone-950': $route.path === '/ratingpengunjung' }" class="hidden md:block py-3 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300" to="/ratingpengunjung">Beri Rating</RouterLink>
        <button @click="logout" class="hidden md:block py-3 px-4 border-b border-stone-800 hover:bg-stone-950 transition duration-300 w-full text-start">Logout</button>
      </aside>

      <!-- Main Content -->
      <div :class="{ 'md:ms-0': isMobileNavOpen, 'md:ms-56':!isMobileNavOpen }" class="transition-all duration-300">
        <RouterView />
      </div>
    </div>
</template>

<script setup>
    import { useAuthStore } from "@/stores/auth";
    import { ref, computed } from 'vue';
    import { RouterLink, RouterView, useRouter } from 'vue-router';

    const router = useRouter();
    const authStore = useAuthStore();

    const isMobileNavOpen = ref(false);
    const daerahOpen = ref(false);

    const toggleMobileNav = () => {
      isMobileNavOpen.value = !isMobileNavOpen.value;
    };

    const toggleDaerah = () => {
      daerahOpen.value = !daerahOpen.value;
    };

    // Define logout method
    const logout = () => {
      authStore.logout();
      router.push({ name: "dashboardguest" });
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
    const isKaryawan3 = computed(() => {
        return authStore.user && authStore.user.data && authStore.user.data.id_role === 4;
    });
    const isBaru = computed(() => {
        return authStore.user && authStore.user.data && authStore.user.data.id_role === 5;
    });
</script>

<style scoped>
  .aside-nav{
      height: 100%;
  }

  .overflow-y-scroll::-webkit-scrollbar {
    width: 0;
  }

  @media(min-width: 768px){
    .aside-nav{
      height: calc(100% - 4.4rem);
    }
  }
</style>