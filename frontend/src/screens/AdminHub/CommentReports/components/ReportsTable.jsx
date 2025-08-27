import React from 'react';
import { IoEyeOutline, IoSettingsOutline, IoEyeOffOutline, IoEyeSharp } from 'react-icons/io5';
import { REPORT_STATUS, REPORT_TYPES } from '@/services/commentReport.service.js';

const ReportsTable = ({ 
    reports, 
    loading, 
    onUpdateStatus, 
    onViewDetails, 
    onToggleVisibility, 
    formatDate 
}) => {
    const getStatusBadge = (status) => {
        const config = {
            [REPORT_STATUS.PENDING]: { 
                bg: 'bg-yellow-100', 
                text: 'text-yellow-800', 
                label: 'Pending' 
            },
            [REPORT_STATUS.RESOLVED]: { 
                bg: 'bg-green-100', 
                text: 'text-green-800', 
                label: 'Resolved' 
            },
            [REPORT_STATUS.DISMISSED]: { 
                bg: 'bg-gray-100', 
                text: 'text-gray-800', 
                label: 'Dismissed' 
            }
        };

        const { bg, text, label } = config[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${bg} ${text}`}>
                {label}
            </span>
        );
    };

    const getTypeBadge = (type) => {
        const typeLabels = {
            [REPORT_TYPES.SPAM]: 'Spam',
            [REPORT_TYPES.INAPPROPRIATE_LANGUAGE]: 'Offensive Language',
            [REPORT_TYPES.HARASSMENT]: 'Harassment',
            [REPORT_TYPES.UNRELATED_CONTENT]: 'Irrelevant Content',
            [REPORT_TYPES.OTHER]: 'Other'
        };

        return (
            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {typeLabels[type] || type}
            </span>
        );
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return 'N/A';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-300 rounded mb-4"></div>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex space-x-4 mb-4">
                                <div className="flex-1 h-4 bg-gray-300 rounded"></div>
                                <div className="flex-1 h-4 bg-gray-300 rounded"></div>
                                <div className="flex-1 h-4 bg-gray-300 rounded"></div>
                                <div className="w-20 h-4 bg-gray-300 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Report ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Comment Content
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reporter
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reports.map((report) => (
                            <tr key={report.reportId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                    {report.reportId.slice(-8)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div className="max-w-xs">
                                        <p className="truncate">
                                            {truncateText(report.comment?.content, 80)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            in {report.comment?.auction?.title || 'Unknown Auction'}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div>
                                        <p className="font-medium">
                                            {report.reporter?.profile?.fullName || 'Unknown User'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {report.reporter?.email}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getTypeBadge(report.type)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(report.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(report.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center space-x-2">
                                        {/* View Details */}
                                        <button
                                            onClick={() => onViewDetails(report)}
                                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                            title="View details"
                                        >
                                            <IoEyeOutline size={16} />
                                        </button>

                                        {/* Update Status */}
                                        {report.status === REPORT_STATUS.PENDING && (
                                            <button
                                                onClick={() => onUpdateStatus(report)}
                                                className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                                title="Update status"
                                            >
                                                <IoSettingsOutline size={16} />
                                            </button>
                                        )}

                                        {/* Toggle Comment Visibility */}
                                        <button
                                            onClick={() => onToggleVisibility(
                                                report.comment?.commentId || report.commentId, 
                                                report.comment?.isHidden
                                            )}
                                            className={`p-1 transition-colors ${
                                                report.comment?.isHidden 
                                                    ? 'text-green-600 hover:text-green-800' 
                                                    : 'text-red-600 hover:text-red-800'
                                            }`}
                                            title={report.comment?.isHidden ? 'Show comment' : 'Hide comment'}
                                        >
                                            {report.comment?.isHidden ? (
                                                <IoEyeSharp size={16} />
                                            ) : (
                                                <IoEyeOffOutline size={16} />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportsTable;
