import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout.jsx";
import { Container, Title, LoadingSpinner } from "@/components/ui/index.js";
import { useUser } from "@/contexts/UserContext.jsx";
import { useNotification } from "@/contexts/NotificationContext.jsx";
import { auctionService } from "@/services/auction.service.js";
import { IoHeartOutline, IoHeart, IoTimeOutline } from "react-icons/io5";

const Watchlist = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { showToastNotification } = useNotification();

    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingIds, setRemovingIds] = useState(new Set());

    // Redirect non-bidders
    useEffect(() => {
        if (user && user.role !== "BIDDER") {
            navigate("/");
            return;
        }
    }, [user, navigate]);

    // Fetch watchlist
    const fetchWatchlist = async () => {
        try {
            setLoading(true);
            const response = await auctionService.getWatchlist();
            setWatchlist(response.data || []);
        } catch (error) {
            console.error("Failed to fetch watchlist:", error);
            showToastNotification(error.message || "Failed to fetch watchlist", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === "BIDDER") {
            fetchWatchlist();
        }
    }, [user]);

    // Remove from watchlist
    const handleRemoveFromWatchlist = async (auctionId) => {
        try {
            setRemovingIds(prev => new Set(prev).add(auctionId));
            await auctionService.removeFromWatchlist(auctionId);

            setWatchlist(prev => prev.filter(item => item.auctionId !== auctionId));
            showToastNotification("Removed from watchlist", "success");
        } catch (error) {
            console.error("Failed to remove from watchlist:", error);
            showToastNotification(error.message || "Failed to remove from watchlist", "error");
        } finally {
            setRemovingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(auctionId);
                return newSet;
            });
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status badge class
    const getStatusBadgeClass = (status) => {
        const classes = {
            PENDING: "bg-yellow-100 text-yellow-800",
            READY: "bg-blue-100 text-blue-800",
            OPEN: "bg-green-100 text-green-800",
            CLOSED: "bg-gray-100 text-gray-800",
            CANCELED: "bg-red-100 text-red-800",
            COMPLETED: "bg-purple-100 text-purple-800",
            EXTENDED: "bg-orange-100 text-orange-800",
        };
        return classes[status] || "bg-gray-100 text-gray-800";
    };

    // Calculate time remaining
    const getTimeRemaining = (endTime) => {
        const now = new Date();
        const end = new Date(endTime);
        const diff = end - now;

        if (diff <= 0) return "Ended";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    // Don't render for non-bidders
    if (!user || user.role !== "BIDDER") {
        return null;
    }

    if (loading) {
        return (
            <Layout>
                <Container className="py-8">
                    <LoadingSpinner text="Loading watchlist..." />
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container className="py-8">
                {/* Header */}
                <div className="mb-8">
                    <Title level={1} className="text-3xl font-bold text-gray-900 mb-2">
                        My Watchlist
                    </Title>
                    <p className="text-gray-600">
                        Keep track of auctions you're interested in
                    </p>
                </div>

                {/* Watchlist Content */}
                {watchlist.length === 0 ? (
                    <div className="text-center py-12">
                        <IoHeartOutline className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <Title level={3} className="text-gray-900 mb-2">
                            Your watchlist is empty
                        </Title>
                        <p className="text-gray-600 mb-6">
                            Start adding auctions to your watchlist to keep track of items you're interested in.
                        </p>
                        <button
                            onClick={() => navigate("/search?status=OPEN")}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Browse Auctions
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {watchlist.map((auction) => (
                            <div
                                key={auction.auctionId}
                                onClick={() => navigate(`/auctions/${auction.auctionId}`)}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-green-300 transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
                            >
                                {/* Auction Image */}
                                <div className="relative h-48 bg-gray-200">
                                    {auction.imageUrl ? (
                                        <img
                                            src={auction.imageUrl}
                                            alt={auction.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <span className="text-sm">No Image</span>
                                        </div>
                                    )}

                                    {/* Remove from watchlist button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent card click
                                            handleRemoveFromWatchlist(auction.auctionId);
                                        }}
                                        disabled={removingIds.has(auction.auctionId)}
                                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                                        title="Remove from watchlist"
                                    >
                                        {removingIds.has(auction.auctionId) ? (
                                            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <IoHeart className="w-5 h-5 text-red-500" />
                                        )}
                                    </button>

                                    {/* Status badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(auction.status)}`}>
                                            {auction.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Auction Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {auction.title}
                                    </h3>

                                    <div className="space-y-2 mb-4">
                                        {/* Current Price */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Current Price:</span>
                                            <span className="font-semibold text-green-600">
                                                {formatCurrency(auction.currentPrice)}
                                            </span>
                                        </div>

                                        {/* Starting Price */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Starting Price:</span>
                                            <span className="text-sm text-gray-900">
                                                {formatCurrency(auction.startingPrice)}
                                            </span>
                                        </div>

                                        {/* Time Remaining */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 flex items-center gap-1">
                                                <IoTimeOutline className="w-4 h-4" />
                                                Time Left:
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {getTimeRemaining(auction.endTime)}
                                            </span>
                                        </div>

                                        {/* Seller */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Seller:</span>
                                            <span className="text-sm text-gray-900">
                                                {auction.sellerName || auction.sellerEmail}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Auction Period */}
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <div className="text-xs text-gray-500">
                                            <div>Start: {formatDate(auction.startTime)}</div>
                                            <div>End: {formatDate(auction.endTime)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </Layout>
    );
};

export default Watchlist;
