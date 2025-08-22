import { useState, useEffect } from 'react';
import { productService } from '@/services/product.service';
import { commentService } from '@/services/comment.service';
import { useUser } from '@/contexts/UserContext';
import { useNotification } from '@/contexts/NotificationContext';

export const useProductDetail = (productId) => {
    const { user } = useUser();
    const { showNotification } = useNotification();

    // Product state
    const [product, setProduct] = useState(null);
    const [productLoading, setProductLoading] = useState(true);
    const [productError, setProductError] = useState(null);

    // Comments state
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentsError, setCommentsError] = useState(null);

    // Comment form state
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [submittingComment, setSubmittingComment] = useState(false);

    // Image gallery state
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Fetch product details
    const fetchProduct = async () => {
        try {
            setProductLoading(true);
            setProductError(null);
            const response = await productService.getProductById(productId);
            setProduct(response);

            // Set first image as selected if available
            if (response.images && response.images.length > 0) {
                const primaryImageIndex = response.images.findIndex(img => img.isPrimary);
                setSelectedImageIndex(primaryImageIndex >= 0 ? primaryImageIndex : 0);
            }
        } catch (error) {
            setProductError(error.message || 'Failed to load product');
            showNotification('Failed to load product details', 'error');
        } finally {
            setProductLoading(false);
        }
    };

    // Fetch comments
    const fetchComments = async () => {
        try {
            setCommentsLoading(true);
            setCommentsError(null);
            const response = await commentService.getCommentsByProductId(productId);
            setComments(response.comments || []);
        } catch (error) {
            setCommentsError(error.message || 'Failed to load comments');
            // Don't show notification for comments as it's not critical
        } finally {
            setCommentsLoading(false);
        }
    };

    // Submit new comment
    const submitComment = async (e) => {
        e.preventDefault();

        if (!user) {
            showNotification('Please login to comment', 'error');
            return;
        }

        if (!newComment.trim()) {
            showNotification('Please enter a comment', 'error');
            return;
        }

        try {
            setSubmittingComment(true);

            const commentData = {
                productId: productId,
                content: newComment.trim(),
                rating: newRating
            };

            const response = await commentService.createComment(commentData);

            // Add new comment to the list
            setComments(prev => [response, ...prev]);

            // Reset form
            setNewComment('');
            setNewRating(5);

            showNotification('Comment added successfully', 'success');
        } catch (error) {
            showNotification(error.message || 'Failed to add comment', 'error');
        } finally {
            setSubmittingComment(false);
        }
    };

    // Delete comment
    const deleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            await commentService.deleteComment(commentId);
            setComments(prev => prev.filter(comment => comment.commentId !== commentId));
            showNotification('Comment deleted successfully', 'success');
        } catch (error) {
            showNotification(error.message || 'Failed to delete comment', 'error');
        }
    };

    // Calculate average rating
    const averageRating = comments.length > 0
        ? comments.reduce((sum, comment) => sum + (comment.rating || 0), 0) / comments.length
        : 0;

    // Get rating distribution
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => {
        const count = comments.filter(comment => comment.rating === rating).length;
        const percentage = comments.length > 0 ? (count / comments.length) * 100 : 0;
        return { rating, count, percentage };
    }).reverse(); // Show 5 stars first

    // Load data on mount
    useEffect(() => {
        if (productId) {
            fetchProduct();
            fetchComments();
        }
    }, [productId]);

    return {
        // Product data
        product,
        productLoading,
        productError,

        // Comments data
        comments,
        commentsLoading,
        commentsError,
        averageRating,
        ratingDistribution,

        // Comment form
        newComment,
        setNewComment,
        newRating,
        setNewRating,
        submittingComment,
        submitComment,
        deleteComment,

        // Image gallery
        selectedImageIndex,
        setSelectedImageIndex,

        // Actions
        refetchProduct: fetchProduct,
        refetchComments: fetchComments,
    };
};
