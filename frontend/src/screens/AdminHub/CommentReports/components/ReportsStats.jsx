import React from 'react';
import { IoStatsChartOutline, IoTimeOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoEyeOffOutline } from 'react-icons/io5';

const ReportsStats = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                <div className="h-6 bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const statItems = [
        {
            label: 'Total Reports',
            value: stats.totalReports,
            icon: IoStatsChartOutline,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            label: 'Pending',
            value: stats.pendingReports,
            icon: IoTimeOutline,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        },
        {
            label: 'Resolved',
            value: stats.resolvedReports,
            icon: IoCheckmarkCircleOutline,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            label: 'Dismissed',
            value: stats.dismissedReports,
            icon: IoCloseCircleOutline,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100'
        },
        {
            label: 'Hidden Comments',
            value: stats.autoHiddenComments,
            icon: IoEyeOffOutline,
            color: 'text-red-600',
            bgColor: 'bg-red-100'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {statItems.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center mr-4`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">{item.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReportsStats;
