import React, { useState } from 'react';
import { IoCloseOutline, IoSettingsOutline } from 'react-icons/io5';
import { PrimaryButton, SecondaryButton } from '@/components/ui/index.js';
import { REPORT_STATUS } from '@/services/commentReport.service.js';

const UpdateReportStatusModal = ({
    isOpen,
    onClose,
    report,
    onConfirm,
    loading = false
}) => {
    const [status, setStatus] = useState(REPORT_STATUS.RESOLVED);
    const [adminNote, setAdminNote] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (report && status) {
            onConfirm(report.reportId, {
                status,
                adminNote: adminNote.trim() || undefined
            });
        }
    };

    const handleClose = () => {
        setStatus(REPORT_STATUS.RESOLVED);
        setAdminNote('');
        onClose();
    };

    if (!isOpen || !report) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <IoSettingsOutline className="text-blue-600" size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Update Report Status
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
                    {/* Report Details */}
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Report Details</h4>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                            <div>
                                <span className="text-xs text-gray-500">Report ID:</span>
                                <p className="text-sm font-mono text-gray-900">{report.reportId}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">Reported Comment:</span>
                                <p className="text-sm text-gray-800 italic">
                                    "{report.comment?.content || 'Comment content not available'}"
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">Reporter:</span>
                                <p className="text-sm text-gray-900">
                                    {report.reporter?.profile?.fullName || 'Unknown User'}
                                    {report.reporter?.email && (
                                        <span className="text-gray-500"> ({report.reporter.email})</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">Report Type:</span>
                                <p className="text-sm text-gray-900">{report.type}</p>
                            </div>
                            {report.reason && (
                                <div>
                                    <span className="text-xs text-gray-500">Reason:</span>
                                    <p className="text-sm text-gray-800">{report.reason}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={loading}
                        >
                            <option value={REPORT_STATUS.RESOLVED}>
                                Resolved (Comment violates guidelines - will be hidden)
                            </option>
                            <option value={REPORT_STATUS.DISMISSED}>
                                Dismissed (Comment is appropriate - no action needed)
                            </option>
                        </select>
                    </div>

                    {/* Admin Note */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Note (optional)
                        </label>
                        <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Add any additional notes about your decision..."
                            disabled={loading}
                        />
                    </div>

                    {/* Information Box */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <p className="text-sm text-blue-800 font-medium mb-1">Action Summary:</p>
                                <p className="text-sm text-blue-700">
                                    {status === REPORT_STATUS.RESOLVED 
                                        ? 'Selecting "Resolved" will hide the comment from public view and mark the report as handled.'
                                        : 'Selecting "Dismissed" will keep the comment visible and mark the report as reviewed with no violation found.'
                                    }
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
                            disabled={loading || !status}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <IoSettingsOutline size={16} className="mr-1" />
                                    Update Status
                                </>
                            )}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateReportStatusModal;
