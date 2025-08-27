import React from 'react';
import { IoFilterOutline, IoRefreshOutline, IoChevronDownOutline } from 'react-icons/io5';
import { REPORT_STATUS, REPORT_TYPES } from '@/services/commentReport.service.js';

const ReportsFilters = ({ 
    statusFilter, 
    setStatusFilter, 
    typeFilter, 
    setTypeFilter, 
    onClear 
}) => {
    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: REPORT_STATUS.PENDING, label: 'Pending' },
        { value: REPORT_STATUS.RESOLVED, label: 'Resolved' },
        { value: REPORT_STATUS.DISMISSED, label: 'Dismissed' }
    ];

    const typeOptions = [
        { value: '', label: 'All Types' },
        { value: REPORT_TYPES.SPAM, label: 'Spam' },
        { value: REPORT_TYPES.INAPPROPRIATE_LANGUAGE, label: 'Offensive Language' },
        { value: REPORT_TYPES.HARASSMENT, label: 'Harassment' },
        { value: REPORT_TYPES.UNRELATED_CONTENT, label: 'Irrelevant Content' },
        { value: REPORT_TYPES.OTHER, label: 'Other' }
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 flex flex-wrap items-center gap-4">
                {/* Filter Icon and Title */}
                <div className="flex items-center gap-2 text-gray-700">
                    <IoFilterOutline size={16} />
                    <span className="text-sm font-medium">Filters:</span>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[120px]"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                    </div>
                </div>

                {/* Type Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Type:</span>
                    <div className="relative">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[150px]"
                        >
                            {typeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                    </div>
                </div>

                {/* Clear Filters Button */}
                {(statusFilter || typeFilter) && (
                    <button
                        onClick={onClear}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                        <IoRefreshOutline size={14} />
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReportsFilters;
