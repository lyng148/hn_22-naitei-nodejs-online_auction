import React from "react";
import { IoWarningOutline, IoTrashOutline, IoCloseOutline } from "react-icons/io5";
import { PrimaryButton, SecondaryButton } from "@/components/ui/index.js";

const DeleteChatModal = ({
    isOpen,
    onClose,
    onConfirm,
    chatRoom,
    isLoading = false
}) => {
    if (!isOpen || !chatRoom) return null;

    const otherUserName = chatRoom.otherUser?.profile?.fullName ||
        chatRoom.otherUser?.email ||
        'Unknown User';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                            <IoWarningOutline className="text-red-600" size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Delete Conversation</h3>
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
                        Are you sure you want to delete your conversation with{" "}
                        <span className="font-semibold">{otherUserName}</span>?
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        This will hide the conversation from your chat list. The other person can still see and send messages.
                    </p>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-6">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        {chatRoom.otherUser?.profile?.profileImageUrl ? (
                            <img
                                src={chatRoom.otherUser.profile.profileImageUrl}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                    {otherUserName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {otherUserName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            Room ID: {chatRoom.chatRoomId.substring(0, 8)}...
                        </p>
                    </div>
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
                                Delete Conversation
                            </>
                        )}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default DeleteChatModal;
