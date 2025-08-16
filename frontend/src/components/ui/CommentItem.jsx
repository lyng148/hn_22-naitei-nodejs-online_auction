import React, { useState } from 'react';
import { StarRating } from '@/components/ui/StarRating';
import { useUser } from '@/contexts/UserContext';
import { IoTrashOutline, IoCreateOutline } from 'react-icons/io5';

export const CommentItem = ({ comment, onDelete, onEdit }) => {
    const { user } = useUser();
    const [isEditing, setIsEditing] = useState(false);

    const canModifyComment = user && (user.userId === comment.userId || user.role === 'ADMIN');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const handleDelete = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
            onDelete(comment.commentId);
        }
    };

    return (
        <div className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-start space-x-3">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                    {comment.user?.profileImageUrl ? (
                        <img
                            src={comment.user.profileImageUrl}
                            alt={comment.user.fullName || 'User'}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium text-sm">
                                {comment.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                                {comment.user?.fullName || 'Anonymous User'}
                            </span>
                            {comment.rating && (
                                <StarRating rating={comment.rating} size={14} showValue={false} />
                            )}
                        </div>

                        {/* Action Buttons */}
                        {canModifyComment && (
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                    title="Edit comment"
                                >
                                    <IoCreateOutline size={16} />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Delete comment"
                                >
                                    <IoTrashOutline size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="text-gray-700 text-sm mb-2 whitespace-pre-wrap">
                        {comment.content}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                            {comment.updatedAt !== comment.createdAt && (
                                <span className="ml-1">(đã chỉnh sửa)</span>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
