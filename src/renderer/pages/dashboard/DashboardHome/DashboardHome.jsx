import AnalyticsChart from "../AnalyticsChart/AnalyticsChart";
import RecentActivity from "../RecentActivity/RecentActivity";
import StatsGrid from "../StatsGrid/StatsGrid";

// Dashboard Home Component
export const DashboardHome = () => {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
            </div>

            <StatsGrid />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <AnalyticsChart />
                <RecentActivity />
            </div>
        </div>
    );
};

export default DashboardHome;