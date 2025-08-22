import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from '@tanstack/react-query';

const useCustomer = () => {
    const AxiosSecure = useAxiosSecure();

    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['customers'],
        queryFn: async () => {
            const res = await AxiosSecure.get('/customers');
            return res.data;
        }
    });

    return { isLoading: isPending, error, customers: data, refetch };
};

export default useCustomer;
