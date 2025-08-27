import axiosClient from "@/utils/axios.js";

const COMMENT_REPORT_API = {
    CREATE_REPORT: '/api/auction-comments/reports',
    GET_REPORTS: '/api/auction-comments/reports',
    GET_REPORT_STATS: '/api/auction-comments/reports/stats',
    UPDATE_REPORT_STATUS: (reportId) => `/api/auction-comments/reports/${reportId}/status`,
    HIDE_COMMENT: (commentId) => `/api/auction-comments/${commentId}/hide`,
    UNHIDE_COMMENT: (commentId) => `/api/auction-comments/${commentId}/unhide`,
};

export const REPORT_TYPES = {
    INAPPROPRIATE_LANGUAGE: 'INAPPROPRIATE_LANGUAGE',
    SPAM: 'SPAM', 
    HARASSMENT: 'HARASSMENT',
    UNRELATED_CONTENT: 'UNRELATED_CONTENT',
    OTHER: 'OTHER'
};

export const REPORT_STATUS = {
    PENDING: 'PENDING',
    RESOLVED: 'RESOLVED',
    DISMISSED: 'DISMISSED'
};

export const commentReportService = {
    // Create a new comment report
    createReport: async (reportData) => {
        try {
            const response = await axiosClient.post(COMMENT_REPORT_API.CREATE_REPORT, reportData);
            return response.data;
        } catch (err) {
            const statusCode = err?.response?.status || err?.status;
            const { message, code } = err?.response?.data || {};
            return Promise.reject({
                statusCode: statusCode || 500,
                message: message || 'Failed to create report',
                errorCode: code || 'INTERNAL_SERVER_ERROR',
            });
        }
    },

    // Get all reports (admin only)
    getReports: async (params = {}) => {
        try {
            const response = await axiosClient.get(COMMENT_REPORT_API.GET_REPORTS, {
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    status: params.status || undefined,
                    type: params.type || undefined,
                }
            });
            return response.data;
        } catch (err) {
            const statusCode = err?.response?.status || err?.status;
            const { message, code } = err?.response?.data || {};
            return Promise.reject({
                statusCode: statusCode || 500,
                message: message || 'Failed to fetch reports',
                errorCode: code || 'INTERNAL_SERVER_ERROR',
            });
        }
    },

    // Get report statistics (admin only)
    getReportStats: async () => {
        try {
            const response = await axiosClient.get(COMMENT_REPORT_API.GET_REPORT_STATS);
            return response.data;
        } catch (err) {
            const statusCode = err?.response?.status || err?.status;
            const { message, code } = err?.response?.data || {};
            return Promise.reject({
                statusCode: statusCode || 500,
                message: message || 'Failed to fetch report statistics',
                errorCode: code || 'INTERNAL_SERVER_ERROR',
            });
        }
    },

    // Update report status (admin only)
    updateReportStatus: async (reportId, statusData) => {
        try {
            const response = await axiosClient.patch(
                COMMENT_REPORT_API.UPDATE_REPORT_STATUS(reportId), 
                statusData
            );
            return response.data;
        } catch (err) {
            const statusCode = err?.response?.status || err?.status;
            const { message, code } = err?.response?.data || {};
            return Promise.reject({
                statusCode: statusCode || 500,
                message: message || 'Failed to update report status',
                errorCode: code || 'INTERNAL_SERVER_ERROR',
            });
        }
    },

    // Hide comment manually (admin only)
    hideComment: async (commentId) => {
        try {
            const response = await axiosClient.patch(COMMENT_REPORT_API.HIDE_COMMENT(commentId));
            return response.data;
        } catch (err) {
            const statusCode = err?.response?.status || err?.status;
            const { message, code } = err?.response?.data || {};
            return Promise.reject({
                statusCode: statusCode || 500,
                message: message || 'Failed to hide comment',
                errorCode: code || 'INTERNAL_SERVER_ERROR',
            });
        }
    },

    // Unhide comment manually (admin only)
    unhideComment: async (commentId) => {
        try {
            const response = await axiosClient.patch(COMMENT_REPORT_API.UNHIDE_COMMENT(commentId));
            return response.data;
        } catch (err) {
            const statusCode = err?.response?.status || err?.status;
            const { message, code } = err?.response?.data || {};
            return Promise.reject({
                statusCode: statusCode || 500,
                message: message || 'Failed to unhide comment',
                errorCode: code || 'INTERNAL_SERVER_ERROR',
            });
        }
    },
};
