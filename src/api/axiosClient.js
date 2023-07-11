import axios from "axios";
import Cookies from 'js-cookie';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

axiosClient.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        let res = error.response;
        if (res.status === 401) {
            window.location.href = process.env.REACT_APP_URL;
        }
        console.error("Looks like there was a problem. Status Code:" + res.status);
        return Promise.reject(error);
    }
);

axiosClient.interceptors.request.use(function (config) {
    const token = Cookies.get('x-access-token');
    config.headers['x-access-token'] = token || '';
    return config;
});

export default axiosClient;