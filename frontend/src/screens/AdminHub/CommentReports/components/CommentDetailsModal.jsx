import React from 'react';
import { IoCloseOutline, IoEyeOutline, IoPersonOutline, IoTimeOutline } from 'react-icons/io5';
import { SecondaryButton } from '@/components/ui/index.js';

const CommentDetailsModal = ({
    isOpen,
    onClose,
    report,
    formatDate
}) => {
    if (!isOpen || !report) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <IoEyeOutline className="text-blue-600" size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Comment Report Details
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <IoCloseOutline size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Report Information */}
                    <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Report Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Report ID</p>
                                <p className="font-mono text-sm text-gray-900">{report.reportId}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Report Type</p>
                                <p className="text-sm text-gray-900">{report.type}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Status</p>
                                <p className="text-sm text-gray-900">{report.status}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Created At</p>
                                <p className="text-sm text-gray-900">{formatDate(report.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Report Reason */}
                    {report.reason && (
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 mb-3">Report Reason</h4>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-gray-800">{report.reason}</p>
                            </div>
                        </div>
                    )}

                    {/* Comment Details */}
                    <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Reported Comment</h4>
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                    <IoPersonOutline className="text-gray-600" size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-gray-900">
                                            {report.comment?.user?.profile?.fullName || 'Anonymous User'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {report.comment?.user?.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <IoTimeOutline size={12} />
                                        {formatDate(report.comment?.createdAt)}
                                    </div>
                                </div>
                            </div>
                            <div className="pl-13">
                                <p className="text-gray-800 mb-3 whitespace-pre-wrap">
                                    {report.comment?.content || 'Comment content not available'}
                                </p>
                                {report.comment?.isHidden && (
                                    <div className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                        Currently Hidden
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Auction Context */}
                    {report.comment?.auction && (
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 mb-3">Auction Context</h4>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="font-medium text-blue-900 mb-1">
                                    {report.comment.auction.title}
                                </p>
                                <p className="text-sm text-blue-700">
                                    Auction ID: {report.comment.auction.auctionId}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Reporter Information */}
                    <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Reporter Information</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Name</p>
                                    <p className="text-sm text-gray-900">
                                        {report.reporter?.profile?.fullName || 'Unknown User'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Email</p>
                                    <p className="text-sm text-gray-900">
                                        {report.reporter?.email || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Admin Review Information */}
                    {(report.reviewedAt || report.adminNote) && (
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 mb-3">Admin Review</h4>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                                {report.reviewedAt && (
                                    <div>
                                        <p className="text-sm text-green-700 mb-1">Reviewed At</p>
                                        <p className="text-sm text-green-900">{formatDate(report.reviewedAt)}</p>
                                    </div>
                                )}
                                {report.reviewer && (
                                    <div>
                                        <p className="text-sm text-green-700 mb-1">Reviewed By</p>
                                        <p className="text-sm text-green-900">
                                            {report.reviewer.profile?.fullName || report.reviewer.email}
                                        </p>
                                    </div>
                                )}
                                {report.adminNote && (
                                    <div>
                                        <p className="text-sm text-green-700 mb-1">Admin Note</p>
                                        <p className="text-sm text-green-900">{report.adminNote}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                    <SecondaryButton
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </SecondaryButton>
                </div>
            </div>
        </div>
    );
};

export default CommentDetailsModal;
