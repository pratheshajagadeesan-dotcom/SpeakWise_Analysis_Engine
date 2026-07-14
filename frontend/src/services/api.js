import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
})

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('speakwise_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem('speakwise_token')
            sessionStorage.removeItem('speakwise_user')
        }
        return Promise.reject(error)
    }
)

export default api