import React, { useState, useEffect } from 'react';
import { auctionService } from '../../../services/auction.service';
import AuctionGrid from '../../Homepage/components/AuctionGrid';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

const AuctionWinning = () => {
    const [wonAuctions, setWonAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWonAuctions();
    }, []);

    const fetchWonAuctions = async () => {
        try {
            setLoading(true);
            const response = await auctionService.getWonAuctions();
            setWonAuctions(response.data || []);
        } catch (err) {
            console.error('Error fetching won auctions:', err);
            setError('Failed to load won auctions');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="text-red-500 text-center">
                    <p className="text-lg font-medium">Error</p>
                    <p className="text-sm mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Auction Winning</h2>
                <span className="text-sm text-gray-500">
                    {wonAuctions.length} won auction{wonAuctions.length !== 1 ? 's' : ''}
                </span>
            </div>

            {wonAuctions.length === 0 ? (
                <div className="text-center py-16">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Won Auctions
                    </h3>
                    <p className="text-gray-500">
                        You haven't won any auctions yet. Keep bidding to win some great items!
                    </p>
                </div>
            ) : (
                <AuctionGrid
                    auctions={wonAuctions}
                    showTitle={false}
                />
            )}
        </div>
    );
};

export default AuctionWinning;
