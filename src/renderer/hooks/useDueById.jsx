import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

const useDueById = (id) => {
    const axiosSecure = useAxiosSecure();
    const dataUrl = `/dueDetails/${id}`;

    const {
        isPending,
        error,
        data: dueById,
        refetch
    } = useQuery({
        queryKey: ['dueById', id],
        queryFn: async () => {
            try {
                const { data } = await axiosSecure.get(dataUrl);
                console.log('API Response:', data); // Debug log
                return data;
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        },
        enabled: !!id, // Only run query if id exists
        retry: 1, // Retry once on failure
    });

    return { isLoading: isPending, error, data: dueById, refetch };
}

export default useDueById;