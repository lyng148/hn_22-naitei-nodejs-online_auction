import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout.jsx';
import { auctionService } from '@/services/auction.service.js';
import { useUser } from '@/contexts/UserContext.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { AuctionGrid } from './components/AuctionGrid.jsx';
import { TopSeller } from './components/TopSeller.jsx';
import { TrustedSection } from './components/TrustedSection.jsx';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner.jsx';
import { Container } from '@/components/ui/Container.jsx';

export const Homepage = () => {
    const { user } = useUser();
    const [auctions, setAuctions] = useState([]);
    const [upcomingAuctions, setUpcomingAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [upcomingLoading, setUpcomingLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAuctions();
        fetchUpcomingAuctions();
    }, [searchQuery]);

    const fetchAuctions = async () => {
        try {
            setLoading(true);
            const params = {
                status: 'OPEN', // Only show open auctions
                title: searchQuery || undefined,
                page: 0,
                size: 8
            };

            const response = await auctionService.getAuctions(params);
            setAuctions(response.data || []);
        } catch (error) {
            console.error('Error fetching auctions:', error);
            setAuctions([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchUpcomingAuctions = async () => {
        try {
            setUpcomingLoading(true);
            const params = {
                status: 'READY', // Only show ready auctions
                title: searchQuery || undefined,
                page: 0,
                size: 8
            };

            const response = await auctionService.getAuctions(params);
            setUpcomingAuctions(response.data || []);
        } catch (error) {
            console.error('Error fetching upcoming auctions:', error);
            setUpcomingAuctions([]);
        } finally {
            setUpcomingLoading(false);
        }
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    if (!user) {
        return (
            <Layout>
                <Container>
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Please login to access the homepage
                        </h2>
                    </div>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <HeroSection onSearch={handleSearchChange} />

                {/* Live Auctions */}
                <section className="py-16 bg-white">
                    <Container>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Live Auctions</h2>
                            <p className="text-gray-600">Discover and bid on amazing items</p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <AuctionGrid auctions={auctions} />
                        )}
                    </Container>
                </section>

                {/* Upcoming Auctions */}
                <section className="py-16 bg-gray-50">
                    <Container>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Upcoming Auctions</h2>
                            <p className="text-gray-600">Get ready for exciting auctions starting soon</p>
                        </div>

                        {upcomingLoading ? (
                            <div className="flex justify-center py-20">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <AuctionGrid auctions={upcomingAuctions} />
                        )}
                    </Container>
                </section>

            </div>
        </Layout>
    );
};

export default Homepage;
