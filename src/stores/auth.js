// Import the necessary libraries
import { defineStore } from "pinia";
import axios from "axios";

// Define a new store called "useAuthStore"
export const useAuthStore = defineStore({
    // Assign an ID to the store
    id: "auth",

    // Define the initial state of the store
    state: () => ({
        accessToken: null,
        user: null, // Initialize user object with null
        userRole: null, // Initialize user role with null
        error: null, // Initialize error object with null
    }),

    // Define a getter to check if the user is logged in
    getters: {
        isLoggedIn() {
            return this.accessToken !== null;
        },
        isAdmin() {
            return this.userRole === 1;
        },
        isKaryawan1() {
            return this.userRole === 2;
        },
        isKaryawan2() {
            return this.userRole === 3;
        },
        iskaryawan3() {
            return this.userRole === 4;
        },
        isBaru() {
            return this.userRole === 5;
        },
        getError() {
            return this.error;
        }
    },

    // Define actions to set, remove, and logout the access token
    actions: {
        async setAccessToken(token) {
            this.accessToken = token;
            await this.fetchUser(); // Call fetchUser after setting the access token
        },

        setUser(user) {
            this.user = user;
        },

        setUserRole(role) {
            this.userRole = role;
        },

        removeAccessToken() {
            this.accessToken = null;
            this.user = null;
            this.userRole = null; // Reset user role on logout
        },

        async fetchUser() {
            try {
                const response = await axios.get("http://localhost:8000/api/user", {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                    },
                });

                // console.log("User Token:", this.accessToken);
                // console.log("User Data:", response.data);
                // Assuming your API returns user data in response.data
                this.setUser(response.data);
                this.setUserRole(response.data.id_role); // Assuming your API returns user role ID
                this.error = null; // Clear any previous errors
            } catch (error) {
                console.error("An error occurred while fetching user data:", error.message);
                this.error = error.message; // Set error message for user feedback
            }
        },

        async logout() {
            try {
                await axios.post("http://localhost:8000/api/logout", null, {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                    },
                });
                this.removeAccessToken();
                console.log("Logout successful");
                this.error = null; // Clear any previous errors
            } catch (error) {
                console.error("An error occurred during logout:", error.message);
                this.error = error.message; // Set error message for user feedback
            }
        },
    },
});
