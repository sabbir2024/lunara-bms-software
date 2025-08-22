import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from '@tanstack/react-query';

const useSale = () => {
    const AxiosSecure = useAxiosSecure();

    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['sale'],
        queryFn: async () => {
            const res = await AxiosSecure.get('/sale');
            return res.data;
        }
    });

    return { isLoading: isPending, error, sale: data, refetch };
};

export default useSale;
