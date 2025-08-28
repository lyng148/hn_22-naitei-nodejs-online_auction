import React from 'react';

const trustedBrands = [
    { name: 'Samsung', logo: '/images/brands/samsung.png' },
    { name: 'Alibaba', logo: '/images/brands/alibaba.png' },
    { name: 'Layerbird', logo: '/images/brands/layerbird.png' },
    { name: 'Discord', logo: '/images/brands/discord.png' },
    { name: 'Behance', logo: '/images/brands/behance.png' },
    { name: 'Microsoft', logo: '/images/brands/microsoft.png' },
    { name: 'Intel', logo: '/images/brands/intel.png' },
    { name: 'Tesla', logo: '/images/brands/tesla.png' }
];

const features = [
    {
        icon: '🎨',
        title: 'Easy & Quick Listing',
        description: 'List your digital assets quickly with our streamlined process'
    },
    {
        icon: '🔒',
        title: 'Safe & Secure',
        description: 'Advanced security measures to protect your investments'
    },
    {
        icon: '🌟',
        title: 'Top Rated Service',
        description: 'Highly rated by thousands of satisfied users worldwide'
    },
    {
        icon: '💎',
        title: 'Premium Quality',
        description: 'Curated collection of high-quality digital items'
    }
];

const topCollections = [
    {
        id: 1,
        name: 'CryptoPunks',
        image: '/images/collections/cryptopunks.jpg',
        items: 10000,
        floorPrice: '15.2 ETH'
    },
    {
        id: 2,
        name: 'Bored Apes',
        image: '/images/collections/boredapes.jpg',
        items: 8500,
        floorPrice: '12.8 ETH'
    },
    {
        id: 3,
        name: 'Art Blocks',
        image: '/images/collections/artblocks.jpg',
        items: 7200,
        floorPrice: '8.4 ETH'
    },
    {
        id: 4,
        name: 'Cool Cats',
        image: '/images/collections/coolcats.jpg',
        items: 9999,
        floorPrice: '5.2 ETH'
    }
];

export const TrustedSection = () => {
    return (
        <div className="space-y-16">
            {/* Trusted by 50k+ Business */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                    Trusted by 50k+ Business.
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center opacity-60">
                    {trustedBrands.map((brand, index) => (
                        <div key={index} className="flex justify-center">
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                                onError={(e) => {
                                    e.target.src = `https://dummyimage.com/120x32/f3f4f6/9ca3af&text=${brand.name}`;
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* How it Works */}
            <div className="bg-primary text-white rounded-3xl p-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">How it Works</h2>
                    <p className="text-gray-100 max-w-2xl mx-auto">
                        Our platform makes it easy to buy, sell, and discover unique digital assets
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-gray-100 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Collections */}
            <div>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Top Collections</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover the most popular and valuable collections on our platform
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {topCollections.map((collection) => (
                        <div key={collection.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={collection.image}
                                    alt={collection.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        e.target.src = 'https://dummyimage.com/300x300/f3f4f6/9ca3af&text=Collection';
                                    }}
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-green transition-colors">
                                    {collection.name}
                                </h3>
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>{collection.items.toLocaleString()} items</span>
                                    <span className="font-semibold text-green">{collection.floorPrice}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrustedSection;
