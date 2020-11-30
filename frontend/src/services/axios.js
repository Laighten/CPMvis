import axios from 'axios'

const instance = axios.create({
    timeout: 30000,
    baseURL: '/d/'
});

instance.interceptors.response.use(response => {
    return response.data
})

export default instance;