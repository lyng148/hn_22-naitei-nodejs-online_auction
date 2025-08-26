import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoHeart, IoHeartOutline, IoTime } from 'react-icons/io5';
import { auctionService } from '@/services/auction.service.js';
import { useUser } from '@/contexts/UserContext.jsx';

export const AuctionCard = ({ auction }) => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Calculate time remaining
    const getTimeRemaining = (endDate) => {
        if (!endDate) return 'Unknown';

        const now = new Date();
        const end = new Date(endDate);

        // Check if date is valid
        if (isNaN(end.getTime())) return 'Unknown';

        const diff = end - now;

        if (diff <= 0) return 'Ended';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        // Check for NaN values
        if (isNaN(days) || isNaN(hours) || isNaN(minutes)) return 'Unknown';

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    // Format price
    const formatPrice = (price) => {
        if (price >= 1000000) {
            return `$${(price / 1000000).toFixed(1)}M`;
        }
        if (price >= 1000) {
            return `$${(price / 1000).toFixed(1)}K`;
        }
        return `$${price}`;
    };

    // Handle watchlist toggle
    const handleWatchlistToggle = async (e) => {
        e.stopPropagation();
        if (!user) return;

        setIsLoading(true);
        try {
            if (isWatchlisted) {
                await auctionService.removeFromWatchlist(auction.auctionId);
                setIsWatchlisted(false);
            } else {
                await auctionService.addToWatchlist(auction.auctionId);
                setIsWatchlisted(true);
            }
        } catch (error) {
            console.error('Error toggling watchlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle card click
    const handleCardClick = () => {
        navigate(`/auctions/${auction.auctionId}`);
    };

    const timeRemaining = getTimeRemaining(auction.endTime);
    const currentBid = auction.currentPrice || auction.startingPrice;
    const isActive = auction.status === 'OPEN';
    const isUpcoming = auction.status === 'READY';

    // Calculate time until start for upcoming auctions
    const getTimeUntilStart = (startDate) => {
        if (!startDate) return 'Unknown';

        const now = new Date();
        const start = new Date(startDate);

        if (isNaN(start.getTime())) return 'Unknown';

        const diff = start - now;

        if (diff <= 0) return 'Starting soon';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (isNaN(days) || isNaN(hours) || isNaN(minutes)) return 'Unknown';

        if (days > 0) return `Starts in ${days}d ${hours}h`;
        if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
        return `Starts in ${minutes}m`;
    };

    const timeUntilStart = getTimeUntilStart(auction.startTime);

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={auction.imageUrl || 'https://dummyimage.com/300x300/f3f4f6/9ca3af&text=No+Image'}
                    alt={auction.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = 'https://dummyimage.com/300x300/f3f4f6/9ca3af&text=No+Image';
                    }}
                />

                {/* Watchlist Button */}
                {user && (
                    <button
                        onClick={handleWatchlistToggle}
                        disabled={isLoading}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200"
                    >
                        {isWatchlisted ? (
                            <IoHeart className="text-red-500" size={20} />
                        ) : (
                            <IoHeartOutline className="text-gray-600" size={20} />
                        )}
                    </button>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isActive
                            ? 'bg-green-100 text-green-800'
                            : isUpcoming
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                        {isActive ? 'Live' : isUpcoming ? 'Upcoming' : auction.status}
                    </span>
                </div>

                {/* Time Remaining/Until Start */}
                {(isActive || isUpcoming) && (
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <IoTime size={14} />
                        {isActive ? timeRemaining : timeUntilStart}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-green transition-colors">
                    {auction.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {auction.description}
                </p>

                {/* Price Info */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500">
                            {isUpcoming ? 'Starting price' : 'Current bid'}
                        </p>
                        <p className="font-bold text-green text-lg">
                            {formatPrice(currentBid)}
                        </p>
                    </div>

                    {auction.bidCount > 0 && isActive && (
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Bids</p>
                            <p className="font-semibold text-gray-800">
                                {auction.bidCount}
                            </p>
                        </div>
                    )}

                    {isUpcoming && (
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Status</p>
                            <p className="font-semibold text-blue-600">
                                Ready to start
                            </p>
                        </div>
                    )}
                </div>

                {/* Seller Info */}
                {auction.sellerName && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        <div className="w-6 h-6 bg-gray-300 rounded-full overflow-hidden">
                            <img
                                src={auction.profileImageUrl}
                                alt={auction.sellerName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://dummyimage.com/24x24/f3f4f6/9ca3af&text=?';
                                }}
                            />
                        </div>
                        <span className="text-xs text-gray-600">
                            by {auction.sellerName || 'Unknown'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuctionCard;
