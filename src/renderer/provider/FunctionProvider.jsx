import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import useCustomer from '../hooks/useCustomer';
import useDue from '../hooks/useDue';
import useSale from '../hooks/useSale';

const fuctonContext = createContext();

export const usefucton = () => {
    const context = useContext(fuctonContext);
    if (!context) {
        throw new Error(`usefucton must be used within a fuctonProvider`);
    }
    return context;
};

export const FuctonProvider = ({ children }) => {
    const [isLoading, setisLoading] = useState(true);
    const { customers, isLoading: isPending } = useCustomer();
    const { dueList, isLoading: isWaiting } = useDue();
    const { sale, isLoading: isLazy } = useSale();

    // Update loading state based on hooks
    useEffect(() => {
        setisLoading(isPending || isWaiting || isLazy);
    }, [isPending, isWaiting, isLazy]);

    // Use useMemo to calculate customer details
    const customersDetails = useMemo(() => {
        if (isLoading || !dueList?.data) return [0, 0];

        const customerLength = customers?.data?.length || 0;
        let totalDue = 0;

        // Loop through each customer in dueList
        dueList.data.forEach(customer => {
            if (customer.entries && Array.isArray(customer.entries)) {
                customer.entries.forEach(entry => {
                    totalDue += entry.due ?? 0;
                });
            }
        });

        return [customerLength, totalDue];
    }, [customers, dueList, isLoading]);

    const [customerCount, totalDueAmount] = customersDetails;

    const saleDetails = useMemo(() => {
        if (isLazy || !sale?.data) return {
            getOverallTotals: () => ({ totalSales: 0, totalPaid: 0, totalDue: 0, transactions: 0 }),
            getDailyTotals: () => [],
            getDateTotals: () => ({ totalSales: 0, totalPaid: 0, totalDue: 0, transactions: 0, items: [] })
        };

        // Calculate overall totals
        const overall = sale.data.reduce((acc, item) => ({
            totalSales: acc.totalSales + (item.total || 0),
            totalPaid: acc.totalPaid + (item.paid || 0),
            totalDue: acc.totalDue + (item.due || 0),
            transactions: acc.transactions + 1
        }), { totalSales: 0, totalPaid: 0, totalDue: 0, transactions: 0 });

        // Group by date
        const salesByDateMap = sale.data.reduce((acc, item) => {
            const date = item.date;
            if (!acc[date]) {
                acc[date] = {
                    totalSales: 0,
                    totalPaid: 0,
                    totalDue: 0,
                    transactions: 0,
                    items: []
                };
            }

            acc[date].totalSales += item.total || 0;
            acc[date].totalPaid += item.paid || 0;
            acc[date].totalDue += item.due || 0;
            acc[date].transactions += 1;
            acc[date].items.push(item);

            return acc;
        }, {});

        const byDate = Object.entries(salesByDateMap).map(([date, data]) => ({
            date,
            ...data
        })).sort((a, b) => new Date(b.date) - new Date(a.date));

        return {
            getOverallTotals: () => overall,
            getDailyTotals: () => byDate,
            getDateTotals: (date) => salesByDateMap[date] || {
                totalSales: 0,
                totalPaid: 0,
                totalDue: 0,
                transactions: 0,
                items: []
            }
        };
    }, [sale, isLazy]);

    // CORRECTED: dayWaysSale - array of daily sales
    const dayWaysSale = useMemo(() => {
        return saleDetails.getDailyTotals().map(day => ({
            date: day.date,
            totalSales: day.totalSales,
            totalPaid: day.totalPaid,
            totalDue: day.totalDue,
            transactions: day.transactions
        }));
    }, [saleDetails]);

    // Function to get sales for a specific date
    const getDaySales = useMemo(() => {
        return (date) => {
            const dayData = saleDetails.getDateTotals(date);
            return {
                date: date,
                totalSales: dayData.totalSales,
                totalPaid: dayData.totalPaid,
                totalDue: dayData.totalDue,
                transactions: dayData.transactions,
                items: dayData.items
            };
        };
    }, [saleDetails]);

    // Overall sales totals
    const overallSales = useMemo(() => {
        return saleDetails.getOverallTotals();
    }, [saleDetails]);

    const value = {
        isLoading,
        setisLoading,

        // Customer data
        customersDetails,
        customerCount,
        totalDueAmount,

        // Sales data
        dayWaysSale,        // Array of daily sales: [{date, totalSales, totalPaid, totalDue, transactions}]
        getDaySales,        // Function to get sales for specific date: (date) => {...}
        overallSales,       // Overall totals: {totalSales, totalPaid, totalDue, transactions}

        // Raw data (if needed)
        saleDetails         // The full saleDetails object
    };

    return (
        <fuctonContext.Provider value={value}>
            {children}
        </fuctonContext.Provider>
    );
};