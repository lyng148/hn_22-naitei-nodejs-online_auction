import axiosClient from "@/utils/axios.js";

const COMMENT_API = {
    GET_COMMENTS: (productId) => `/api/comments/product/${productId}`,
    CREATE_COMMENT: '/api/comments',
    UPDATE_COMMENT: (commentId) => `/api/comments/${commentId}`,
    DELETE_COMMENT: (commentId) => `/api/comments/${commentId}`,
    GET_COMMENT: (commentId) => `/api/comments/${commentId}`,
    HIDE_COMMENT: (commentId) => `/api/comments/${commentId}/hide`,
    UNHIDE_COMMENT: (commentId) => `/api/comments/${commentId}/unhide`,
};

export const commentService = {
    // Get comments by product ID
    getCommentsByProductId: async (productId) => {
        try {
            const response = await axiosClient.get(COMMENT_API.GET_COMMENTS(productId));
            return response.data;
        } catch (err) {
            const statusCode = err?.status;
            const { message, code } = err?.response?.data || {};
            return Promise.reject({
                statusCode: statusCode || 500,
                message: message || 'Failed to fetch comments',
                errorCode: code || 'INTERNAL_SERVER_ERROR',
            });
        }
    },

    // Create comment
    createComment: async (commentData) => {
        try {
            const response = await axiosClient.post(COMMENT_API.CREATE_COMMENT, commentData);
            return response.data;
        } catch (err) {
            const statusCode = err?.status;
            const { message, code } = err?.response?.data || {};
            return Promise.reject({
                statusCode: statusCode || 500,
                message: message || 'Failed to create comment',
                errorCode: code || 'INTERNAL_SERVER_ERROR',
            });
        }
    },

    // Update comment
    updateComment: async (commentId, commentData) => {
        try {
            const response = await axiosClient.put(COMMENT_API.UPDATE_COMMENT(commentId), commentData);
            return response.data;
        } catch (err) {
            const statusCode = err?.status;
            const { message, code } = err?.response?.data || {};
            return Promise.reject({
                statusCode: statusCode || 500,
                message: message || 'Failed to update comment',
                errorCode: code || 'INTERNAL_SERVER_ERROR',
            });
        }
    },

    // Delete comment
    deleteComment: async (commentId) => {
        try {
            const response = await axiosClient.delete(COMMENT_API.DELETE_COMMENT(commentId));
            return response.data;
        } catch (err) {
            const statusCode = err?.status;
            const { message, code } = err?.response?.data || {};
            return Promise.reject({
                statusCode: statusCode || 500,
                message: message || 'Failed to delete comment',
                errorCode: code || 'INTERNAL_SERVER_ERROR',
            });
        }
    },

    // Get comment by ID
    getCommentById: async (commentId) => {
        try {
            const response = await axiosClient.get(COMMENT_API.GET_COMMENT(commentId));
            return response.data;
        } catch (err) {
            const statusCode = err?.status;
            const { message, code } = err?.response?.data || {};
            return Promise.reject({
                statusCode: statusCode || 500,
                message: message || 'Failed to fetch comment',
                errorCode: code || 'INTERNAL_SERVER_ERROR',
            });
        }
    },

    // Hide comment (admin only) - independent of reports
    hideComment: async (commentId) => {
        try {
            const response = await axiosClient.patch(COMMENT_API.HIDE_COMMENT(commentId));
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

    // Unhide comment (admin only) - independent of reports  
    unhideComment: async (commentId) => {
        try {
            const response = await axiosClient.patch(COMMENT_API.UNHIDE_COMMENT(commentId));
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
