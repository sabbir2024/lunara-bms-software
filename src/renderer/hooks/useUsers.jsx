
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

const useUsers = () => {
    const AxiosSecure = useAxiosSecure();

    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return null;  // token না থাকলে user null

            const res = await AxiosSecure.get('/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    return { isLoading: isPending, error, users: data, refetch };
};


export default useUsers;
