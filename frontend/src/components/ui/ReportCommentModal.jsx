import React, { useState } from 'react';
import { IoCloseOutline, IoWarningOutline } from 'react-icons/io5';
import { PrimaryButton, SecondaryButton } from './index.js';
import { REPORT_TYPES } from '@/services/commentReport.service.js';

const ReportCommentModal = ({
    isOpen,
    onClose,
    onConfirm,
    comment,
    loading = false
}) => {
    const [reportType, setReportType] = useState('');
    const [reason, setReason] = useState('');

    const reportTypeOptions = [
        { value: REPORT_TYPES.SPAM, label: 'Spam' },
        { value: REPORT_TYPES.INAPPROPRIATE_LANGUAGE, label: 'Offensive Language' },
        { value: REPORT_TYPES.HARASSMENT, label: 'Harassment' },
        { value: REPORT_TYPES.UNRELATED_CONTENT, label: 'Irrelevant Content' },
        { value: REPORT_TYPES.OTHER, label: 'Other' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (reportType && comment) {
            onConfirm({
                commentId: comment.commentId,
                type: reportType,
                reason: reason.trim() || undefined
            });
        }
    };

    const handleClose = () => {
        setReportType('');
        setReason('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <IoWarningOutline className="text-red-600" size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Report Comment
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        <IoCloseOutline size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 mb-2">
                            You are reporting the following comment:
                        </p>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="text-sm text-gray-800 italic">
                                "{comment?.content || 'Comment content'}"
                            </p>
                            {comment?.user?.profile && (
                                <p className="text-xs text-gray-500 mt-1">
                                    by {comment.user.profile.firstName} {comment.user.profile.lastName}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Report Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            required
                            disabled={loading}
                        >
                            <option value="">Select a reason</option>
                            {reportTypeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Details (optional)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="Please provide additional details about why you're reporting this comment..."
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <p className="text-sm text-yellow-800 font-medium mb-1">Important Note:</p>
                                <p className="text-sm text-yellow-700">
                                    False reports may result in restrictions on your account. 
                                    Please only report content that violates our community guidelines.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                        <SecondaryButton
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            disabled={loading || !reportType}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <IoWarningOutline size={16} className="mr-1" />
                                    Submit Report
                                </>
                            )}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportCommentModal;
