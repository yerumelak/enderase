import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/',
    //baseURL: process.env.REACT_APP_API_URL || 'http://192.168.25.129:8000/',
});

// Set initial Authorization header if token exists
const accessToken = localStorage.getItem('access_token');
if (accessToken) {
    api.defaults.headers.Authorization = `Bearer ${accessToken}`;
}

// Flag to prevent multiple refreshes at the same time
let isRefreshing = false;
let failedQueue = [];

// Helper function to process queued requests after refresh
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Axios response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');

            if (!refreshToken) {
                // no refresh token, logout maybe
                return Promise.reject(error);
            }

            try {
                const response = await api.post(
                    '/api/token/refresh/',
                    { refresh: refreshToken }
                );

                const newAccessToken = response.data.access;

                localStorage.setItem('access_token', newAccessToken);
                api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);

                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                // Refresh token expired too - force logout if you want
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;

