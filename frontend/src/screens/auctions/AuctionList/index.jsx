import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout.jsx';
import { Container } from '@/components/ui/Container.jsx';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner.jsx';
import { auctionService } from '@/services/auction.service.js';
import { AuctionGrid } from '@/screens/Homepage/components/AuctionGrid.jsx';
import { IoSearchOutline, IoFunnelOutline, IoGridOutline, IoListOutline } from 'react-icons/io5';

const AuctionList = () => {
    const navigate = useNavigate();
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('NEWEST');
    const [viewMode, setViewMode] = useState('GRID'); // GRID or LIST
    const [pagination, setPagination] = useState({
        page: 0,
        size: 12,
        totalPages: 0,
        totalElements: 0
    });

    // Fetch auctions
    const fetchAuctions = async (page = 0) => {
        try {
            setLoading(true);
            const sortParams = getSortParams(sortBy);
            const params = {
                page,
                size: pagination.size,
                title: searchTerm || undefined,
                status: statusFilter !== 'ALL' ? statusFilter : undefined,
                ...sortParams
            };

            // Remove undefined values
            Object.keys(params).forEach(key => {
                if (params[key] === undefined) {
                    delete params[key];
                }
            });

            const response = await auctionService.getAuctions(params);
            setAuctions(response.data || []);
            
            // Calculate totalPages from total and size
            const totalPages = Math.ceil((response.total || 0) / (response.size || 12));
            
            setPagination({
                page: response.page || 0,
                size: response.size || 12,
                totalPages: totalPages,
                totalElements: response.total || 0
            });
        } catch (error) {
            console.error('Error fetching auctions:', error);
            setAuctions([]);
        } finally {
            setLoading(false);
        }
    };

    // Get sort parameter for API
    const getSortParams = (sortValue) => {
        switch (sortValue) {
            case 'NEWEST': return { sortField: 'startTime', sortDirection: 'desc' };
            case 'OLDEST': return { sortField: 'startTime', sortDirection: 'asc' };
            case 'PRICE_HIGH': return { sortField: 'currentPrice', sortDirection: 'desc' };
            case 'PRICE_LOW': return { sortField: 'currentPrice', sortDirection: 'asc' };
            case 'ENDING_SOON': return { sortField: 'endTime', sortDirection: 'asc' };
            default: return { sortField: 'startTime', sortDirection: 'desc' };
        }
    };

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        fetchAuctions(0);
    };

    // Handle filter change
    const handleFilterChange = (newFilter) => {
        setStatusFilter(newFilter);
    };

    // Handle sort change
    const handleSortChange = (newSort) => {
        setSortBy(newSort);
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        fetchAuctions(newPage);
    };

    // Initial load and when filters change
    useEffect(() => {
        fetchAuctions(0);
    }, [statusFilter, sortBy]);

    return (
        <Layout>
            <Container className="py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">All Auctions</h1>
                    <p className="text-gray-600">Discover and bid on amazing items from sellers worldwide</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="relative max-w-2xl">
                            <input
                                type="text"
                                placeholder="Search auctions by title or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            <IoSearchOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Filters and View Options */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Status Filter */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <IoFunnelOutline className="text-gray-500" size={18} />
                                <span className="text-sm text-gray-700 font-medium">Status:</span>
                            </div>
                            <div className="flex gap-2">
                                {[
                                    { value: 'ALL', label: 'All' },
                                    { value: 'OPEN', label: 'Live' },
                                    { value: 'READY', label: 'Upcoming' },
                                    { value: 'CLOSED', label: 'Ended' }
                                ].map((filter) => (
                                    <button
                                        key={filter.value}
                                        onClick={() => handleFilterChange(filter.value)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === filter.value
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort and View Mode */}
                        <div className="flex items-center gap-4">
                            {/* Sort Dropdown */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="NEWEST">Newest First</option>
                                    <option value="OLDEST">Oldest First</option>
                                    <option value="PRICE_HIGH">Price: High to Low</option>
                                    <option value="PRICE_LOW">Price: Low to High</option>
                                    <option value="ENDING_SOON">Ending Soon</option>
                                </select>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('GRID')}
                                    className={`p-2 ${viewMode === 'GRID' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <IoGridOutline size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('LIST')}
                                    className={`p-2 ${viewMode === 'LIST' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <IoListOutline size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                {!loading && (
                    <div className="mb-6">
                        <p className="text-gray-600">
                            Showing {auctions.length} of {pagination.totalElements} auctions
                        </p>
                    </div>
                )}

                {/* Auctions Display */}
                <div className="mb-8">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <LoadingSpinner />
                        </div>
                    ) : viewMode === 'GRID' ? (
                        <AuctionGrid auctions={auctions} />
                    ) : (
                        <AuctionListView auctions={auctions} navigate={navigate} />
                    )}
                </div>

                {/* Pagination */}
                {!loading && pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 0}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}
                        {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                            const pageNumber = Math.max(0, pagination.page - 2) + index;
                            if (pageNumber >= pagination.totalPages) return null;

                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-4 py-2 border rounded-lg ${pagination.page === pageNumber
                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                            : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNumber + 1}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages - 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </Container>
        </Layout>
    );
};

// List View Component
const AuctionListView = ({ auctions, navigate }) => {
    if (auctions.length === 0) {
        return (
            <div className="text-center py-20 flex flex-col items-center">
                <div className="text-6xl mb-4 flex justify-center items-center">
                    <IoSearchOutline />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No auctions found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {auctions.map((auction) => (
                <AuctionListItem key={auction.auctionId} auction={auction} navigate={navigate} />
            ))}
        </div>
    );
};

// List Item Component
const AuctionListItem = ({ auction, navigate }) => {

    const getStatusBadge = (status) => {
        const statusConfig = {
            OPEN: { label: 'Live', class: 'bg-emerald-100 text-emerald-800' },
            READY: { label: 'Upcoming', class: 'bg-blue-100 text-blue-800' },
            CLOSED: { label: 'Ended', class: 'bg-gray-100 text-gray-800' },
            PENDING: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800' }
        };

        const config = statusConfig[status] || { label: status, class: 'bg-gray-100 text-gray-800' };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.class}`}>
                {config.label}
            </span>
        );
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price || 0);
    };

    const getTimeRemaining = (endDate) => {
        if (!endDate) return 'Unknown';

        const now = new Date();
        const end = new Date(endDate);
        const diff = end - now;

        if (diff <= 0) return 'Ended';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days}d ${hours}h`;
        return `${hours}h`;
    };

    return (
        <div
            onClick={() => navigate(`/auctions/${auction.auctionId}`)}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
            <div className="flex gap-6">
                {/* Image */}
                <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                        src={auction.imageUrl || 'https://dummyimage.com/300x300/f3f4f6/9ca3af&text=No+Image'}
                        alt={auction.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://dummyimage.com/300x300/f3f4f6/9ca3af&text=No+Image';
                        }}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors line-clamp-2">
                            {auction.title}
                        </h3>
                        {getStatusBadge(auction.status)}
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                        {auction.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Current Price</p>
                            <p className="font-bold text-emerald-600 text-lg">
                                {formatPrice(auction.currentPrice || auction.startingPrice)}
                            </p>
                        </div>

                        {auction.bidCount > 0 && (
                            <div>
                                <p className="text-xs text-gray-500">Bids</p>
                                <p className="font-semibold text-gray-800">{auction.bidCount}</p>
                            </div>
                        )}

                        {auction.status === 'OPEN' && (
                            <div>
                                <p className="text-xs text-gray-500">Time Remaining</p>
                                <p className="font-semibold text-gray-800">{getTimeRemaining(auction.endTime)}</p>
                            </div>
                        )}

                        {auction.sellerName && (
                            <div>
                                <p className="text-xs text-gray-500">Seller</p>
                                <p className="font-semibold text-gray-800">{auction.sellerName}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionList;
