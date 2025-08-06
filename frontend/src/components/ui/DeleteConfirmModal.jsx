import React from "react";
import { IoWarningOutline, IoTrashOutline, IoCloseOutline } from "react-icons/io5";
import { PrimaryButton, SecondaryButton } from "@/components/ui/index.js";

export const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productName,
  isLoading = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <IoWarningOutline className="text-red-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600">
            Are you sure you want to delete "<span className="font-semibold">{productName}</span>"?
          </p>
          <p className="text-gray-500 text-sm mt-2">
            This action cannot be undone. The product will be permanently removed from your listings.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <SecondaryButton
            onClick={onClose}
            disabled={isLoading}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg"
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              <>
                <IoTrashOutline size={16} />
                Delete Product
              </>
            )}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
