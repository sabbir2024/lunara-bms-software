import axios from 'axios';

const useAxiosSecure = () => {
    const token = localStorage.getItem('access-token');
    const instance = axios.create({
        baseURL: 'http://localhost:3001/api/v1',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        withCredentials: true,
    });

    return instance;
};

export default useAxiosSecure;
