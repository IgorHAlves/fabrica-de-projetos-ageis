import axios from 'axios'

// Axios instance prepared for Swagger API integration
// Uses Vite env var: VITE_API_URL
export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Request interceptor
http.interceptors.request.use(
    (config) => {
        // Add any authentication token here if needed
        // const token = localStorage.getItem('authToken')
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`
        // }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
http.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Handle common errors
        if (error.response) {
            // Server responded with error status
            console.error('API Error:', error.response.data)
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network Error:', error.message)
        } else {
            // Something else happened
            console.error('Error:', error.message)
        }
        return Promise.reject(error)
    }
)

export default http


