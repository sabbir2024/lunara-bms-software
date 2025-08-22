import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from '@tanstack/react-query';

const useProducts = () => {
    const AxiosSecure = useAxiosSecure();

    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await AxiosSecure.get('/products');
            return res.data;
        }
    });

    return { isLoading: isPending, error, products: data, refetch };
};

export default useProducts;
