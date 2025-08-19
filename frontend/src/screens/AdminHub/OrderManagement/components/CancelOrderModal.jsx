import React, { useState } from "react";
import { IoCloseOutline, IoWarningOutline } from "react-icons/io5";

const CancelOrderModal = ({ 
  isOpen, 
  onClose, 
  order, 
  onConfirm,
  loading 
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(order.orderId, reason);
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <IoWarningOutline className="text-red-600" size={24} />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Cancel Order</h2>
              <p className="text-sm text-gray-600">Order #{order.orderId?.slice(-8)}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            
            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">
                  {order.auction?.title || "N/A"}
                </div>
                <div className="text-gray-600">
                  Buyer: {order.user?.profile?.fullName || "N/A"}
                </div>
                <div className="text-gray-600">
                  Amount: {order.totalAmount ? new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(order.totalAmount) : "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Cancellation Reason (Optional)
            </label>
            <textarea
              id="reason"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 resize-none"
              placeholder="Enter reason for cancellation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {reason.length}/500 characters
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              disabled={loading}
            >
              Keep Order
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Canceling...
                </div>
              ) : (
                "Cancel Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelOrderModal;
