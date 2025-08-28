import React from 'react';
import { AuctionCard } from './AuctionCard.jsx';
import { IoSearch } from 'react-icons/io5';

export const AuctionGrid = ({ auctions = [] }) => {
    if (auctions.length === 0) {
        return (
            <div className="text-center py-20 flex flex-col items-center">
            <div className="text-6xl mb-4 flex justify-center items-center"><IoSearch /></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No auctions found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {auctions.map((auction) => (
                <AuctionCard key={auction.auctionId} auction={auction} />
            ))}
        </div>
    );
};

export default AuctionGrid;
