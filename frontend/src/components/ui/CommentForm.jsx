import React from 'react';
import { StarRating } from '@/components/ui/StarRating';
import { PrimaryButton } from '@/components/ui/index.js';
import { useUser } from '@/contexts/UserContext';
import { IoSendOutline } from 'react-icons/io5';

export const CommentForm = ({
    comment,
    setComment,
    rating,
    setRating,
    onSubmit,
    isSubmitting = false,
    placeholder = "Viết bình luận của bạn..."
}) => {
    const { user } = useUser();

    if (!user) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">Vui lòng đăng nhập để viết bình luận</p>
                <PrimaryButton
                    onClick={() => window.location.href = '/auth/login'}
                    className="bg-green hover:bg-green-600"
                >
                    Đăng nhập
                </PrimaryButton>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Viết bình luận</h3>

            <form onSubmit={onSubmit} className="space-y-4">
                {/* Rating Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đánh giá sản phẩm
                    </label>
                    <StarRating
                        rating={rating}
                        readonly={false}
                        onRatingChange={setRating}
                        size={24}
                        className="mb-2"
                    />
                    <p className="text-xs text-gray-500">
                        Nhấp vào sao để đánh giá ({rating}/5 sao)
                    </p>
                </div>

                {/* Comment Text */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung bình luận
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={placeholder}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent resize-vertical"
                        required
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <PrimaryButton
                        type="submit"
                        disabled={isSubmitting || !comment.trim()}
                        className="bg-green hover:bg-green-600 disabled:bg-gray-400 flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <IoSendOutline size={16} />
                                Gửi bình luận
                            </>
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
};
