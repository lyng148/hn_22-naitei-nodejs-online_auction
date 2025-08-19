import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Container, Title, PrimaryButton, LoadingSpinner } from '@/components/ui/index.js';
import { StarRating } from '@/components/ui/StarRating';
import { CommentItem } from '@/components/ui/CommentItem';
import { CommentForm } from '@/components/ui/CommentForm';
import { RatingSummary } from '@/components/ui/RatingSummary';
import { useProductDetail } from '@/hooks/useProductDetail';
import { useUser } from '@/contexts/UserContext';
import { useNotification } from '@/contexts/NotificationContext';
import { chatApiService } from '@/services/chat.service';
import '@/styles/ProductDetail.css';
import {
    IoArrowBackOutline,
    IoShareOutline,
    IoHeartOutline,
    IoImageOutline,
    IoPersonOutline,
    IoChatbubbleOutline,
    IoStarOutline
} from 'react-icons/io5';

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const { showToastNotification } = useNotification();

    const {
        product,
        productLoading,
        productError,
        comments,
        commentsLoading,
        averageRating,
        ratingDistribution,
        newComment,
        setNewComment,
        newRating,
        setNewRating,
        submittingComment,
        submitComment,
        deleteComment,
        selectedImageIndex,
        setSelectedImageIndex,
    } = useProductDetail(productId);

    const [chatLoading, setChatLoading] = React.useState(false);

    if (productLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    <LoadingSpinner />
                </div>
            </Layout>
        );
    }

    if (productError || !product) {
        return (
            <Layout>
                <Container>
                    <div className="flex flex-col items-center justify-center min-h-screen">
                        <div className="text-center">
                            <Title level={2} className="text-gray-900 mb-4">
                                Không tìm thấy sản phẩm
                            </Title>
                            <p className="text-gray-600 mb-6">
                                Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                            </p>
                            <PrimaryButton
                                onClick={() => navigate('/dashboard')}
                                className="bg-green hover:bg-green-600"
                            >
                                <IoArrowBackOutline size={16} className="mr-2" />
                                Về trang chủ
                            </PrimaryButton>
                        </div>
                    </div>
                </Container>
            </Layout>
        );
    }

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
    };

    const handleContactSeller = async () => {
        if (!user) {
            showToastNotification('Vui lòng đăng nhập để liên hệ người bán', 'error');
            navigate('/auth/login');
            return;
        }

        if (user.id === product.seller.userId) {
            showToastNotification('Bạn không thể chat với chính mình', 'error');
            return;
        }

        setChatLoading(true);
        try {
            const response = await chatApiService.createOrGetChatRoom({
                otherUserId: product.seller.userId
            });

            if (response.success) {
                showToastNotification('Đang mở cuộc trò chuyện với người bán...', 'success');
                // Chuyển hướng đến trang chat với query parameter để tự động select room
                navigate(`/chat?sellerId=${product.seller.userId}`);
            } else {
                throw new Error(response.message || 'Không thể tạo cuộc trò chuyện');
            }
        } catch (error) {
            console.error('Error creating chat with seller:', error);
            showToastNotification(error.message || 'Không thể liên hệ người bán', 'error');
        } finally {
            setChatLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            ACTIVE: { label: 'Còn hàng', color: 'bg-green-100 text-green-800' },
            INACTIVE: { label: 'Hết hàng', color: 'bg-red-100 text-red-800' },
            SOLD: { label: 'Đã bán', color: 'bg-gray-100 text-gray-800' },
        };

        const config = statusConfig[status] || statusConfig.INACTIVE;
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    return (
        <Layout>
            <Container>
                <div className="py-8 product-detail">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                    >
                        <IoArrowBackOutline size={20} className="mr-2" />
                        Quay lại
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 product-detail-grid">
                        {/* Product Images */}
                        <div className="space-y-4 product-image-gallery">
                            {/* Main Image */}
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[selectedImageIndex]?.imageUrl || product.images[0].imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <IoImageOutline size={64} className="text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Images */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto product-thumbnails">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={image.imageId}
                                            onClick={() => handleImageClick(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors product-thumbnail ${index === selectedImageIndex
                                                ? 'border-green'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={image.imageUrl}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Information */}
                        <div className="space-y-6">
                            {/* Product Title & Status */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Title level={1} className="text-2xl lg:text-3xl font-bold text-gray-900">
                                        {product.name}
                                    </Title>
                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                            <IoHeartOutline size={24} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                                            <IoShareOutline size={24} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 mb-4">
                                    {getStatusBadge(product.status)}
                                    <div className="flex items-center space-x-2">
                                        <StarRating rating={averageRating} size={16} />
                                        <span className="text-sm text-gray-600">
                                            ({comments.length} đánh giá)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Product Description */}
                            {product.description && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Product Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Số lượng còn lại</h4>
                                    <p className="text-lg font-semibold text-gray-900">{product.stockQuantity} sản phẩm</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Danh mục</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {product.categories && product.categories.length > 0 ? (
                                            product.categories.map((category) => (
                                                <span
                                                    key={category.categoryId}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                                                >
                                                    {category.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                                                Chưa phân loại
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Seller Information */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin người bán</h3>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                        <IoPersonOutline size={20} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {product.seller.fullName || 'Người bán'}
                                        </p>
                                        <button
                                            onClick={() => navigate(`/seller/${product.seller.userId}`)}
                                            className="text-sm text-green hover:text-green-600 transition-colors"
                                        >
                                            Xem shop
                                        </button>
                                    </div>
                                </div>

                                <PrimaryButton
                                    onClick={handleContactSeller}
                                    disabled={chatLoading}
                                    className="w-full bg-green hover:bg-green-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {chatLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                            Đang kết nối...
                                        </>
                                    ) : (
                                        <>
                                            <IoChatbubbleOutline size={16} className="mr-2" />
                                            Liên hệ người bán
                                        </>
                                    )}
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="space-y-6">
                        {/* Rating Summary */}
                        <RatingSummary
                            averageRating={averageRating}
                            totalComments={comments.length}
                            ratingDistribution={ratingDistribution}
                        />

                        {/* Comment Form */}
                        <CommentForm
                            comment={newComment}
                            setComment={setNewComment}
                            rating={newRating}
                            setRating={setNewRating}
                            onSubmit={submitComment}
                            isSubmitting={submittingComment}
                        />

                        {/* Comments List */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Bình luận ({comments.length})
                                </h3>
                            </div>

                            {commentsLoading ? (
                                <div className="flex justify-center py-8">
                                    <LoadingSpinner />
                                </div>
                            ) : comments.length > 0 ? (
                                <div className="space-y-6">
                                    {comments.map((comment) => (
                                        <CommentItem
                                            key={comment.commentId}
                                            comment={comment}
                                            onDelete={deleteComment}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <IoStarOutline size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">Chưa có bình luận nào</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Hãy là người đầu tiên bình luận về sản phẩm này
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </Layout>
    );
};

export default ProductDetail;
