import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from '@tanstack/react-query';

const useDue = () => {
    const AxiosSecure = useAxiosSecure();

    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['due'],
        queryFn: async () => {
            const res = await AxiosSecure.get('/dueDetails');
            return res.data;
        }
    });

    return { isLoading: isPending, error, dueList: data, refetch };
};

export default useDue;
