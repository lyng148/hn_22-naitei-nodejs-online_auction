import React, { useState, useEffect, useRef } from 'react';
import { LoadingSpinner, SecondaryButton } from '@/components/ui/index.js';
import { AuctionCommentForm } from './AuctionCommentForm.jsx';
import { AuctionCommentItem } from './AuctionCommentItem.jsx';
import ReportCommentModal from './ReportCommentModal.jsx';
import { useAuctionComments } from '@/hooks/useAuctionComments.js';
import { useUser } from '@/contexts/UserContext.jsx';
import { useNotification } from '@/contexts/NotificationContext.jsx';
import { commentReportService } from '@/services/commentReport.service.js';
import { IoChatbubbleOutline, IoLockClosedOutline } from 'react-icons/io5';
import '@/styles/AuctionComments.css';

export const AuctionCommentSection = ({ auctionId, highlightCommentId }) => {
    const { user } = useUser();
    const { showToastNotification } = useNotification();
    const [reportModal, setReportModal] = useState({ isOpen: false, comment: null });
    const [reportLoading, setReportLoading] = useState(false);
    const commentsRef = useRef(null);
    const {
        comments,
        loading,
        submitting,
        error,
        newComment,
        setNewComment,
        submitComment,
        updateComment,
        deleteComment,
        loadMoreComments,
        hasMoreComments,
        hideComment,
        unhideComment
    } = useAuctionComments(auctionId);

    // Check if user can comment (only bidders and sellers can comment)
    const canComment = user && (user.role === 'BIDDER' || user.role === 'SELLER');

    // Handle comment highlighting and scrolling
    useEffect(() => {
        if (highlightCommentId && comments.length > 0 && commentsRef.current) {
            // Wait for the DOM to update
            const timer = setTimeout(() => {
                const commentElement = commentsRef.current.querySelector(`[data-comment-id="${highlightCommentId}"]`);
                if (commentElement) {
                    // Calculate scroll position with offset for header/navbar
                    const elementTop = commentElement.getBoundingClientRect().top + window.pageYOffset;
                    const offset = 100; // Offset for header/navbar
                    
                    // Smooth scroll to the comment
                    window.scrollTo({
                        top: elementTop - offset,
                        behavior: 'smooth'
                    });
                    
                    // Add highlight effect
                    commentElement.classList.add('comment-highlight');
                    
                    // Remove highlight after 6 seconds for better visibility
                    setTimeout(() => {
                        commentElement.classList.remove('comment-highlight');
                    }, 6000);
                } else {
                    // If comment not found in current page, may need pagination
                    console.log(`Comment ${highlightCommentId} not found in current comments. Total comments: ${comments.length}`);
                }
            }, 500); // Increased timeout for better DOM rendering and API response

            return () => clearTimeout(timer);
        }
    }, [highlightCommentId, comments]);

    const handleReport = (comment) => {
        console.log('Report button clicked for comment:', comment);
        setReportModal({ isOpen: true, comment });
    };

    const handleSubmitReport = async (reportData) => {
        try {
            setReportLoading(true);
            await commentReportService.createReport(reportData);
            showToastNotification('Report submitted successfully', 'success');
            setReportModal({ isOpen: false, comment: null });
        } catch (error) {
            let errorMessage = 'Failed to submit report';
            
            if (error.statusCode === 409) {
                errorMessage = 'You have already reported this comment';
            } else if (error.statusCode === 403) {
                errorMessage = 'You cannot report your own comment';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            showToastNotification(errorMessage, 'error');
        } finally {
            setReportLoading(false);
        }
    };

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center text-red-600">
                    <p>Failed to load comments: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="auction-comments bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <IoChatbubbleOutline size={20} />
                    Comments ({comments.length})
                </h3>
            </div>

            {/* Comment Form */}
            {canComment ? (
                <div className="mb-6">
                    <AuctionCommentForm
                        comment={newComment}
                        setComment={setNewComment}
                        onSubmit={submitComment}
                        isSubmitting={submitting}
                        placeholder="Share your thoughts about this auction..."
                    />
                </div>
            ) : (
                <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <IoLockClosedOutline size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600 text-sm">
                        {user 
                            ? "Only bidders and sellers can comment on auctions"
                            : "Please login as a bidder or seller to comment"
                        }
                    </p>
                </div>
            )}

            {/* Loading State */}
            {loading && comments.length === 0 && (
                <div className="flex justify-center py-8">
                    <LoadingSpinner />
                </div>
            )}

            {/* Comments List */}
            {comments.length > 0 ? (
                <div className="space-y-6" ref={commentsRef}>
                    {comments.map((comment) => (
                        <AuctionCommentItem
                            key={comment.commentId}
                            comment={comment}
                            onDelete={deleteComment}
                            onEdit={updateComment}
                            onReport={handleReport}
                            onHide={hideComment}
                            onUnhide={unhideComment}
                            highlightCommentId={highlightCommentId}
                        />
                    ))}

                    {/* Load More Button */}
                    {hasMoreComments && (
                        <div className="text-center pt-4">
                            <SecondaryButton
                                onClick={loadMoreComments}
                                disabled={loading}
                                className="load-more-button px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Loading...
                                    </>
                                ) : (
                                    'Load More Comments'
                                )}
                            </SecondaryButton>
                        </div>
                    )}
                </div>
            ) : !loading && (
                <div className="empty-comments text-center py-8">
                    <IoChatbubbleOutline size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No comments yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                        {canComment 
                            ? "Be the first to comment on this auction"
                            : "Login to see and add comments"
                        }
                    </p>
                </div>
            )}

            {/* Report Comment Modal */}
            <ReportCommentModal
                isOpen={reportModal.isOpen}
                onClose={() => setReportModal({ isOpen: false, comment: null })}
                onConfirm={handleSubmitReport}
                comment={reportModal.comment}
                loading={reportLoading}
            />
        </div>
    );
};
