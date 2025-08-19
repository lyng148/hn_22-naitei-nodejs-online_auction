import React from "react";
import { formatVND, formatDate } from "@/utils/format.js";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/constants/orderStatus.js";
import { 
  IoCloseOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoReceiptOutline,
  IoPersonOutline,
  IoLocationOutline,
  IoCalendarOutline
} from "react-icons/io5";

const OrderDetailModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <IoTimeOutline className="w-5 h-5" />;
      case "PAID":
      case "SHIPPING":
        return <IoReceiptOutline className="w-5 h-5" />;
      case "COMPLETED":
        return <IoCheckmarkCircleOutline className="w-5 h-5" />;
      default:
        return <IoReceiptOutline className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
        onClick={onClose}
      ></div>

      {/* Modal panel - Compact design with ~80% height reduction */}
      <div className="relative w-full max-w-3xl h-[75vh] bg-white shadow-xl rounded-lg overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
            <p className="text-sm text-gray-500">Order #{order.orderId?.slice(-8)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Payment Information - Compact */}
            {order.paymentDueDate && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <IoTimeOutline className="w-4 h-4 text-yellow-600" />
                  <div>
                    <h5 className="text-xs font-medium text-yellow-800">Payment Due</h5>
                    <p className="text-xs text-yellow-700">
                      {formatDate(order.paymentDueDate)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* Order Status and Info - Compact grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <IoReceiptOutline className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">Status</span>
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                  {getStatusIcon(order.status)}
                  {ORDER_STATUS_LABELS[order.status]}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <IoCalendarOutline className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">Order Date</span>
                </div>
                <p className="text-xs text-gray-900">{formatDate(order.createdAt)}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <IoReceiptOutline className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">Total</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{formatVND(order.totalAmount)}</p>
              </div>
            </div>

            {/* Auction Details - Horizontal layout */}
            {order.auction && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-base font-semibold text-gray-900 mb-3">Auction Details</h4>
                <div className="flex gap-4">
                  {/* Product Image - Smaller */}
                  {order.auction.product?.images?.[0] && (
                    <div className="flex-shrink-0">
                      <img 
                        src={order.auction.product.images[0]} 
                        alt={order.auction.product?.name || "Product"}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Product Info - Compact */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-900 text-sm truncate">
                      {order.auction.title}
                    </h5>
                    <p className="text-gray-600 text-xs truncate">
                      {order.auction.product?.name}
                    </p>
                    {order.auction.description && (
                      <p className="text-gray-500 text-xs mt-1 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {order.auction.description}
                      </p>
                    )}
                  </div>

                  {/* Pricing Info - Compact */}
                  <div className="flex-shrink-0 text-right">
                    <div className="space-y-1">
                      <div>
                        <span className="text-xs text-gray-600">Starting:</span>
                        <p className="text-xs font-medium">{formatVND(order.auction.startingPrice)}</p>
                      </div>
                      {order.auction.winningBid && (
                        <div>
                          <span className="text-xs text-gray-600">Winning:</span>
                          <p className="text-xs font-semibold text-green-600">{formatVND(order.auction.winningBid)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Auction Period */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <IoCalendarOutline className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">Period:</span>
                    <span className="text-xs text-gray-600">
                      {formatDate(order.auction.startDate)} - {formatDate(order.auction.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Seller Information - Compact */}
            {order.auction?.seller && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-base font-semibold text-gray-900 mb-3">Seller Information</h4>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <IoPersonOutline className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <p className="font-medium text-gray-900 truncate">
                          {order.auction.seller.profile?.fullName || order.auction.seller.email}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="text-gray-900 truncate">{order.auction.seller.email}</p>
                      </div>
                      {order.auction.seller.profile?.phoneNumber && (
                        <div className="col-span-2">
                          <span className="text-gray-600">Phone:</span>
                          <p className="text-gray-900">{order.auction.seller.profile.phoneNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            
          </div>
        </div>

        {/* Footer Actions - Fixed */}
        <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {order.status === "PENDING" && (
            <button className="px-4 py-2 text-sm font-medium text-white bg-green rounded-lg hover:bg-green-600 transition-colors">
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
