import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/components/Dashboard.vue'

import KabupatenList from '@/components/KabupatenList.vue'
import KabupatenCreate from '@/components/KabupatenCreate.vue'
import KabupatenEdit from '@/components/KabupatenEdit.vue'

import KecamatanList from '@/components/KecamatanList.vue'
import KecamatanCreate from '@/components/KecamatanCreate.vue'
import KecamatanEdit from '@/components/KecamatanEdit.vue'

import DesaList from '@/components/DesaList.vue'
import DesaCreate from '@/components/DesaCreate.vue'
import DesaEdit from '@/components/DesaEdit.vue'

import JalanList from '@/components/JalanList.vue'
import JalanCreate from '@/components/JalanCreate.vue'
import JalanEdit from '@/components/JalanEdit.vue'

import JembatanList from '@/components/JembatanList.vue'
import JembatanCreate from '@/components/JembatanCreate.vue'
import JembatanEdit from '@/components/JembatanEdit.vue'

import DanaList from '@/components/DanaList.vue'
import DanaCreate from '@/components/DanaCreate.vue'
import DanaEdit from '@/components/DanaEdit.vue'

import LaporanList from '@/components/LaporanList.vue'
import LaporanJalanCreate from '@/components/LaporanJalanCreate.vue'
import LaporanJalanEdit from '@/components/LaporanJalanEdit.vue'
import LaporanJembatanCreate from '@/components/LaporanJembatanCreate.vue'
import LaporanJembatanEdit from '@/components/LaporanJembatanEdit.vue'

import PengaduanCreate from '@/components/PengaduanCreate.vue'
import PengaduanList from '@/components/PengaduanList.vue'
import RatingList from '@/components/RatingList.vue'

import GuestLogin from '@/components/GuestLogin.vue'
import GuestView from '@/components/GuestView.vue'
import GuestRegister from '@/components/GuestRegister.vue'
import GuestReportList from '@/components/GuestReportList.vue'
import GuestRating from '@/components/GuestRating.vue'
import GuestList from '@/components/GuestList.vue'

import Login from '@/components/Login.vue'
import UserCreate from '@/components/UserCreate.vue'
import UserEdit from '@/components/UserEdit.vue'
import UserEditDetail from '@/components/UserEditDetail.vue'
import UserList from '@/components/UserList.vue'
import UserProfile from '@/components/UserProfile.vue'
import EditProfilUser from '@/components/EditProfilUser.vue'

import { useAuthStore } from "@/stores/auth"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    // Login
    {
      path: '/login',
      name: 'login',
      component: Login
    },

    // User
    {
      path: '/createuser',
      name: 'usercreate',
      component: UserCreate
    },
    {
      path: '/listuser',
      name: 'userlist',
      component: UserList
    },
    {
      path: '/edituser/:id',
      name: 'useredit',
      component: UserEdit
    },
    {
      path: '/editdetailuser/:id',
      name: 'usereditdetail',
      component: UserEditDetail
    },
    {
      path: '/editprofileuser/:id',
      name: 'usereditprofile',
      component: EditProfilUser
    },
    {
      path: '/profileuser',
      name: 'userprofile',
      component: UserProfile
    },

    // Dashboard
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },

    // Guest
    {
      path: '/loginpengunjung',
      name: 'pengunjunglogin',
      component: GuestLogin
    },
    {
      path: '/guestdashboard',
      name: 'dashboardguest',
      component: GuestView
    },
    {
      path: '/guestregister',
      name: 'registerguest',
      component: GuestRegister
    },
    {
      path: '/listpengaduanpengunjung',
      name: 'pengaduanpengunjunglist',
      component: GuestReportList
    },
    {
      path: '/listpengunjung',
      name: 'pengunjunglist',
      component: GuestList
    },
    {
      path: '/ratingpengunjung',
      name: 'pengunjungrating',
      component: GuestRating
    },
    {
      path: '/listrating',
      name: 'ratinglist',
      component: RatingList
    },

    // Pengaduan
    {
      path: '/createpengaduan',
      name: 'pengaduancreate',
      component: PengaduanCreate
    },
    {
      path: '/listpengaduan',
      name: 'pengaduanlist',
      component: PengaduanList
    },

    // Kabupaten
    {
      path: '/listkabupaten',
      name: 'kabupatenlist',
      component: KabupatenList
    },
    {
      path: '/createkabupaten',
      name: 'kabupatencreate',
      component: KabupatenCreate
    },
    {
      path: '/editkabupaten/:id',
      name: 'kabupatenedit',
      component: KabupatenEdit
    },

    // Kecamatan
    {
      path: '/listkecamatan',
      name: 'kecamatanlist',
      component: KecamatanList
    },
    {
      path: '/createkecamatan',
      name: 'kecamatancreate',
      component: KecamatanCreate
    },
    {
      path: '/editkecamatan/:id',
      name: 'kecamatanedit',
      component: KecamatanEdit
    },

    // Desa
    {
      path: '/listdesa',
      name: 'desalist',
      component: DesaList
    },
    {
      path: '/createdesa',
      name: 'desacreate',
      component: DesaCreate
    },
    {
      path: '/editdesa/:id',
      name: 'desaedit',
      component: DesaEdit
    },

    // Jalan
    {
      path: '/listjalan',
      name: 'jalanlist',
      component: JalanList
    },
    {
      path: '/createjalan',
      name: 'jalancreate',
      component: JalanCreate
    },
    {
      path: '/editjalan/:id',
      name: 'jalanedit',
      component: JalanEdit
    },

    // Jembatan
    {
      path: '/listjembatan',
      name: 'jembatanlist',
      component: JembatanList
    },
    {
      path: '/createjembatan',
      name: 'jembatancreate',
      component: JembatanCreate
    },
    {
      path: '/editjembatan/:id',
      name: 'jembatanedit',
      component: JembatanEdit
    },

    // Sumber Dana
    {
      path: '/listdana',
      name: 'danalist',
      component: DanaList
    },
    {
      path: '/createdana',
      name: 'danacreate',
      component: DanaCreate
    },
    {
      path: '/editdana/:id',
      name: 'danaedit',
      component: DanaEdit
    },

    // Laporan Kegiatan
    {
      path: '/listlaporan',
      name: 'laporanlist',
      component: LaporanList
    },

    // Laporan Kegiatan Jalan
    {
      path: '/createlaporanjalan',
      name: 'laporanjalancreate',
      component: LaporanJalanCreate
    },
    {
      path: '/editlaporanjalan/:id',
      name: 'laporanjalanedit',
      component: LaporanJalanEdit
    },

    // Laporan Kegiatan Jembatan
    {
      path: '/createlaporanjembatan',
      name: 'laporanjemabatancreate',
      component: LaporanJembatanCreate
    },
    {
      path: '/editlaporanjembatan/:id',
      name: 'laporanjembatanedit',
      component: LaporanJembatanEdit
    },
  ]
});

// Add global navigation guards to the router
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name !== "login" && to.name !== "dashboardguest" && to.name !== "registerguest" && to.name !== "pengunjunglogin" && !authStore.isLoggedIn) {
    // next({ name: "login" });
    next({ name: "dashboardguest" });
  } else {
    next();
  }
});

// // Add global navigation guards to the router
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();
//   const pengunjungAuthStore = usePengunjungAuthStore();
  
//   // Check if the user is logged in as admin or other users
//   if (to.name !== "login" && to.name !== "dashboardguest" && to.name !== "registerguest" && to.name !== "pengunjunglogin" && !authStore.isLoggedIn && !pengunjungAuthStore.isPengunjungLoggedIn) {
//     next({ name: "dashboardguest" });
//   } 
//   // Check if the user is logged in as pengunjung
//   else if (to.name === "pengaduancreate" && !pengunjungAuthStore.isPengunjungLoggedIn) {
//     next({ name: "pengunjunglogin" });
//   } 
//   // Redirect to the intended route
//   else {
//     next();
//   }
// });

  

export default router
