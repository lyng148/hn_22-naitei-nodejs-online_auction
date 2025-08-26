import React, { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { Container } from '@/components/ui/Container.jsx';
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx';

export const HeroSection = ({ onSearch }) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchValue);
    };

    return (
        <section className="relative bg-primary min-h-[500px] flex items-center">


            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-white">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                            Your Trusted Online Auction Platform
                        </h1>
                        <p className="text-lg mb-8 text-gray-100 leading-relaxed">
                            Fair auctions, safe transactions, and valuable finds.
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="mb-8">
                            <div className="flex items-center bg-white rounded-full overflow-hidden shadow-lg max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search auctions"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="flex-1 px-6 py-4 text-gray-800 outline-none"
                                />
                                <button
                                    type="submit"
                                    className="p-5 bg-green text-white hover:bg-green-600 transition-colors"
                                >
                                    <IoSearchOutline size={20} />
                                </button>
                            </div>
                        </form>

                        {/* Stats */}
                        <div className="flex gap-8">
                            <div>
                                <div className="text-2xl font-bold">$42.9k</div>
                                <div className="text-gray-300 text-sm">Items</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">25.4k</div>
                                <div className="text-gray-300 text-sm">Auctions</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">9.4k</div>
                                <div className="text-gray-300 text-sm">Sellers</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Featured Items */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Main Featured Item */}
                            <div className="col-span-2 bg-white rounded-2xl p-4 shadow-xl">
                                <div className="aspect-video bg-gray-200 rounded-xl mb-3 overflow-hidden">
                                    <img
                                        src="https://ictv.1cdn.vn/2020/04/27/ictvietnam-mediacdn-vn-huan-hoa-hong-15879586607891232678525-1587963275952-1587963276262647446450.jpg"
                                        alt="Featured Item"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://dummyimage.com/400x225/f3f4f6/9ca3af&text=Featured+Item';
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Đệ nhất kiếm tiền</h3>
                                        <p className="text-sm text-gray-500">Ending in: 2h 4m 32s</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Current bid</div>
                                        <div className="font-bold text-green">$1.00</div>
                                    </div>
                                </div>
                            </div>

                            {/* Small Featured Items */}
                            <div className="bg-white rounded-xl p-3 shadow-lg">
                                <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden">
                                    <img
                                        src="https://akuma.vn/wp-content/uploads/2025/07/hoang-cuu-bao-6.jpg.webp"
                                        alt="Featured Item 1"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://dummyimage.com/150x150/f3f4f6/9ca3af&text=Item+1';
                                        }}
                                    />
                                </div>
                                <h4 className="text-sm font-medium text-gray-800">Colorful Dog</h4>
                                <p className="text-xs text-green font-semibold">$0.4</p>
                            </div>

                            <div className="bg-white rounded-xl p-3 shadow-lg">
                                <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden">
                                    <img
                                        src="https://static.toiimg.com/thumb/msid-122619371,imgsize-22304,width-400,resizemode-4/122619371.jpg"
                                        alt="Featured Item 2"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://dummyimage.com/150x150/f3f4f6/9ca3af&text=Item+2';
                                        }}
                                    />
                                </div>
                                <h4 className="text-sm font-medium text-gray-800">Aura pack</h4>
                                <p className="text-xs text-green font-semibold">$2.45</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default HeroSection;
