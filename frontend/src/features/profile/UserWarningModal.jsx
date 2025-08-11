import React from 'react';
import { Title, Caption } from "@/components/ui/index.js";
import { FaExclamationTriangle, FaCalendarAlt, FaTimes, FaInfoCircle } from "react-icons/fa";

export const UserWarningModal = ({ isOpen, onClose, warnings, warningStatus }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = () => {
    if (warningStatus?.isBanned) return 'red';
    if (warningStatus?.warningCount >= 2) return 'orange';
    if (warningStatus?.warningCount >= 1) return 'yellow';
    return 'green';
  };

  const getStatusMessage = () => {
    if (warningStatus?.isBanned) {
      return 'Your account has been banned due to multiple warnings.';
    }
    if (warningStatus?.warningCount >= 2) {
      return `You have ${warningStatus.warningCount} warnings. One more warning may result in account suspension.`;
    }
    if (warningStatus?.warningCount >= 1) {
      return `You have ${warningStatus.warningCount} warning(s). Please follow our community guidelines.`;
    }
    return 'Your account is in good standing.';
  };

  const statusColor = getStatusColor();
  const statusBgColor = {
    red: 'bg-red-50 border-red-200',
    orange: 'bg-orange-50 border-orange-200', 
    yellow: 'bg-yellow-50 border-yellow-200',
    green: 'bg-green-50 border-green-200'
  };

  const statusTextColor = {
    red: 'text-red-800',
    orange: 'text-orange-800',
    yellow: 'text-yellow-800', 
    green: 'text-green-800'
  };

  const statusIconColor = {
    red: 'text-red-600',
    orange: 'text-orange-600',
    yellow: 'text-yellow-600',
    green: 'text-green-600'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full modal-overlay flex items-start justify-center p-4 pt-20">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all duration-300 ease-out modal-content overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${statusBgColor[statusColor]}`}>
              {warningStatus?.isBanned || warningStatus?.warningCount > 0 ? (
                <FaExclamationTriangle className={`text-lg ${statusIconColor[statusColor]}`} />
              ) : (
                <FaInfoCircle className={`text-lg ${statusIconColor[statusColor]}`} />
              )}
            </div>
            <div>
              <Title level={3} className="text-gray-900 font-semibold">
                Account Warnings
              </Title>
              <p className="text-sm text-gray-600">
                {warningStatus ? `${warningStatus.warningCount}/3 warnings` : 'Loading...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Status Section */}
        {warningStatus && (
          <div className={`p-6 border-b border-gray-200 ${statusBgColor[statusColor]}`}>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Title level={4} className={`font-semibold mb-2 ${statusTextColor[statusColor]}`}>
                  Current Status
                </Title>
                <p className={`${statusTextColor[statusColor]} text-sm mb-3`}>
                  {getStatusMessage()}
                </p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  warningStatus.isBanned 
                    ? 'bg-red-100 text-red-800' 
                    : warningStatus.warningCount >= 2
                    ? 'bg-orange-100 text-orange-800'
                    : warningStatus.warningCount >= 1
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {warningStatus.warningCount}/3 Warnings
                  {warningStatus.isBanned && ' - BANNED'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {warnings && warnings.length > 0 ? (
              <div>
                <Title level={4} className="text-gray-800 font-semibold mb-4">
                  Warning History ({warnings.length})
                </Title>
                
                <div className="space-y-4">
                  {warnings.map((warning, index) => (
                    <div 
                      key={warning.warningId} 
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow bg-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <FaExclamationTriangle className="text-yellow-600 text-lg" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">
                              Warning #{warnings.length - index}
                            </h5>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <FaCalendarAlt size={12} />
                              {formatDate(warning.createdAt)}
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <Caption className="text-gray-600 font-medium">Reason:</Caption>
                              <p className="text-gray-800 mt-1">{warning.reason}</p>
                            </div>
                            
                            {warning.description && (
                              <div>
                                <Caption className="text-gray-600 font-medium">Details:</Caption>
                                <p className="text-gray-700 mt-1 text-sm">{warning.description}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FaInfoCircle className="text-4xl text-green-500 mx-auto mb-4" />
                <Title level={4} className="text-gray-800 mb-2">No Warnings</Title>
                <p className="text-gray-600">
                  Great! You don't have any warnings. Keep following our community guidelines to maintain a good standing.
                </p>
              </div>
            )}
          </div>

          {/* Guidelines Footer */}
          <div className="border-t border-gray-200 bg-blue-50 p-6">
            <Title level={5} className="text-blue-800 font-semibold mb-3">
              Community Guidelines Reminder
            </Title>
            <div className="text-blue-700 space-y-1 text-sm">
              <p>• Follow all auction rules and policies</p>
              <p>• Be respectful to other users and staff</p>
              <p>• Provide accurate information in your listings</p>
              <p>• Complete transactions in good faith</p>
            </div>
            <p className="text-blue-600 text-xs mt-3 font-medium">
              Remember: 3 warnings may result in account suspension. If you have questions about our policies, 
              please contact our support team.
            </p>
          </div>

          {/* Close Button */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
