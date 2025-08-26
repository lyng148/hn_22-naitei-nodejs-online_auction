import React from 'react';

const topSellers = [
    {
        id: 1,
        name: 'John Doe',
        totalSales: '$125,000',
        itemsSold: 45,
        avatar: '/images/sellers/seller-1.jpg',
        verified: true
    },
    {
        id: 2,
        name: 'Sarah Wilson',
        totalSales: '$98,500',
        itemsSold: 32,
        avatar: '/images/sellers/seller-2.jpg',
        verified: true
    },
    {
        id: 3,
        name: 'Mike Johnson',
        totalSales: '$87,200',
        itemsSold: 28,
        avatar: '/images/sellers/seller-3.jpg',
        verified: false
    },
    {
        id: 4,
        name: 'Emily Davis',
        totalSales: '$76,800',
        itemsSold: 24,
        avatar: '/images/sellers/seller-4.jpg',
        verified: true
    },
    {
        id: 5,
        name: 'David Chen',
        totalSales: '$65,400',
        itemsSold: 21,
        avatar: '/images/sellers/seller-5.jpg',
        verified: false
    },
    {
        id: 6,
        name: 'Lisa Wang',
        totalSales: '$58,900',
        itemsSold: 19,
        avatar: '/images/sellers/seller-6.jpg',
        verified: true
    },
    {
        id: 7,
        name: 'Alex Rivera',
        totalSales: '$52,300',
        itemsSold: 17,
        avatar: '/images/sellers/seller-7.jpg',
        verified: false
    },
    {
        id: 8,
        name: 'Maria Garcia',
        totalSales: '$48,700',
        itemsSold: 15,
        avatar: '/images/sellers/seller-8.jpg',
        verified: true
    },
    {
        id: 9,
        name: 'Robert Kim',
        totalSales: '$43,100',
        itemsSold: 13,
        avatar: '/images/sellers/seller-9.jpg',
        verified: false
    },
    {
        id: 10,
        name: 'Anna Brown',
        totalSales: '$39,800',
        itemsSold: 12,
        avatar: '/images/sellers/seller-10.jpg',
        verified: true
    }
];

export const TopSeller = () => {
    return (
        <div>
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Top Seller</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Meet our most successful sellers who have built amazing collections
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-6">
                {topSellers.map((seller, index) => (
                    <div key={seller.id} className="text-center group cursor-pointer">
                        {/* Rank Circle */}
                        <div className="relative inline-block mb-4">
                            <div className="relative">
                                <img
                                    src={seller.avatar}
                                    alt={seller.name}
                                    className="w-16 h-16 rounded-full object-cover mx-auto border-3 border-gray-200 group-hover:border-green transition-colors"
                                    onError={(e) => {
                                        e.target.src = `https://dummyimage.com/64x64/f3f4f6/9ca3af&text=${seller.name.charAt(0)}`;
                                    }}
                                />

                                {/* Verification Badge */}
                                {seller.verified && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Rank Number */}
                            <div className="absolute -top-2 -left-2 w-6 h-6 bg-green text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {index + 1}
                            </div>
                        </div>

                        {/* Seller Info */}
                        <div>
                            <h3 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-green transition-colors">
                                {seller.name}
                            </h3>
                            <p className="text-xs text-gray-500 mb-1">
                                {seller.totalSales}
                            </p>
                            <p className="text-xs text-gray-400">
                                {seller.itemsSold} items
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopSeller;
