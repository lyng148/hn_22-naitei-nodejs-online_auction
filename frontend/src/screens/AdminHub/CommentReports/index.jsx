import React, { useState, useEffect, useCallback } from 'react';
import { Title } from '@/components/ui/index.js';
import { commentReportService, REPORT_STATUS, REPORT_TYPES } from '@/services/commentReport.service.js';
import { useNotification } from '@/contexts/NotificationContext.jsx';
import ReportsTable from './components/ReportsTable.jsx';
import ReportsFilters from './components/ReportsFilters.jsx';
import ReportsStats from './components/ReportsStats.jsx';
import UpdateReportStatusModal from './components/UpdateReportStatusModal.jsx';
import CommentDetailsModal from './components/CommentDetailsModal.jsx';
import Pagination from '@/components/ui/Pagination.jsx';

const CommentReportsManagement = () => {
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [error, setError] = useState('');

    // Pagination state
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    // Filter states  
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    // Modal states
    const [updateModal, setUpdateModal] = useState({ isOpen: false, report: null });
    const [detailsModal, setDetailsModal] = useState({ isOpen: false, report: null });

    const { showToastNotification } = useNotification();

    // Fetch statistics
    const fetchStats = useCallback(async () => {
        try {
            setStatsLoading(true);
            const response = await commentReportService.getReportStats();
            setStats(response);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    // Fetch reports
    const fetchReports = useCallback(async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            setError('');
            
            const response = await commentReportService.getReports({
                page,
                limit,
                status: statusFilter || undefined,
                type: typeFilter || undefined
            });

            setReports(response.data || []);
            setPagination({
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: Math.ceil(response.total / response.limit)
            });
        } catch (error) {
            console.error('Error fetching reports:', error);
            setError(error.message || 'Failed to fetch reports');
            setReports([]);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, typeFilter]);

    // Initialize data
    useEffect(() => {
        fetchReports(1);
        fetchStats();
    }, [fetchReports, fetchStats]);

    // Handle pagination
    const handlePageChange = (newPage) => {
        fetchReports(newPage, pagination.limit);
    };

    // Handle report status update
    const handleUpdateStatus = (report) => {
        setUpdateModal({ isOpen: true, report });
    };

    const handleConfirmUpdateStatus = async (reportId, statusData) => {
        try {
            setUpdateLoading(true);
            await commentReportService.updateReportStatus(reportId, statusData);
            
            showToastNotification('Report status updated successfully', 'success');
            setUpdateModal({ isOpen: false, report: null });
            
            // Refresh data
            await fetchReports(pagination.page);
            await fetchStats();
        } catch (error) {
            console.error('Error updating report status:', error);
            showToastNotification(error.message || 'Failed to update report status', 'error');
        } finally {
            setUpdateLoading(false);
        }
    };

    // Handle comment details view
    const handleViewCommentDetails = (report) => {
        setDetailsModal({ isOpen: true, report });
    };

    // Handle comment hide/unhide
    const handleToggleCommentVisibility = async (commentId, isCurrentlyHidden) => {
        try {
            if (isCurrentlyHidden) {
                await commentReportService.unhideComment(commentId);
                showToastNotification('Comment unhidden successfully', 'success');
            } else {
                await commentReportService.hideComment(commentId);
                showToastNotification('Comment hidden successfully', 'success');
            }
            
            // Refresh reports to get updated data
            await fetchReports(pagination.page);
            await fetchStats();
        } catch (error) {
            console.error('Error toggling comment visibility:', error);
            showToastNotification(error.message || 'Failed to update comment visibility', 'error');
        }
    };

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Title level={2} className="text-3xl font-bold text-gray-900">
                    Comment Reports Management
                </Title>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                        Total: {pagination.total} reports
                    </div>
                    <button 
                        onClick={() => {
                            fetchReports(pagination.page, pagination.limit);
                            fetchStats();
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                        disabled={loading}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <ReportsStats 
                stats={stats}
                loading={statsLoading}
            />

            {/* Filters */}
            <div className="mb-6">
                <ReportsFilters 
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    onClear={() => {
                        setStatusFilter('');
                        setTypeFilter('');
                    }}
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Reports Table */}
            <div className="mb-6">
                <ReportsTable 
                    reports={reports}
                    loading={loading}
                    onUpdateStatus={handleUpdateStatus}
                    onViewDetails={handleViewCommentDetails}
                    onToggleVisibility={handleToggleCommentVisibility}
                    formatDate={formatDate}
                />
            </div>

            {/* Pagination */}
            {reports.length > 0 && (
                <div className="mb-6">
                    <Pagination 
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        hasNext={pagination.page < pagination.totalPages}
                        hasPrevious={pagination.page > 1}
                        onPageChange={handlePageChange}
                        totalItems={pagination.total}
                        limit={pagination.limit}
                    />
                </div>
            )}

            {/* Empty State */}
            {!loading && reports.length === 0 && (
                <div className="text-center py-12">
                    <Title level={3} className="text-xl font-medium text-gray-900 mb-2">
                        No reports found
                    </Title>
                    <p className="text-gray-600">
                        {statusFilter || typeFilter 
                            ? 'Try adjusting your filter criteria'
                            : 'No comment reports have been submitted yet'
                        }
                    </p>
                </div>
            )}

            {/* Modals */}
            <UpdateReportStatusModal 
                isOpen={updateModal.isOpen}
                onClose={() => setUpdateModal({ isOpen: false, report: null })}
                report={updateModal.report}
                onConfirm={handleConfirmUpdateStatus}
                loading={updateLoading}
            />

            <CommentDetailsModal 
                isOpen={detailsModal.isOpen}
                onClose={() => setDetailsModal({ isOpen: false, report: null })}
                report={detailsModal.report}
                formatDate={formatDate}
            />
        </div>
    );
};

export default CommentReportsManagement;
