import React from 'react';

const categories = [
    {
        id: 'ELECTRONICS',
        name: 'Electronics',
        icon: '📱',
        description: 'Phones, laptops, gadgets'
    },
    {
        id: 'FASHION',
        name: 'Fashion',
        icon: '👕',
        description: 'Clothing and accessories'
    },
    {
        id: 'COLLECTIBLES',
        name: 'Collectibles',
        icon: '🎨',
        description: 'Art and collectibles'
    },
    {
        id: 'HOME_APPLIANCES',
        name: 'Home Appliances',
        icon: '🏠',
        description: 'Kitchen and home items'
    },
    {
        id: 'SPORTS_EQUIPMENT',
        name: 'Sports',
        icon: '⚽',
        description: 'Sports equipment'
    },
    {
        id: 'TOYS_AND_GAMES',
        name: 'Toys & Games',
        icon: '🎮',
        description: 'Games and toys'
    },
    {
        id: 'VEHICLES',
        name: 'Vehicles',
        icon: '🚗',
        description: 'Cars and motorcycles'
    },
    {
        id: 'REAL_ESTATE',
        name: 'Real Estate',
        icon: '�️',
        description: 'Properties and land'
    },
    {
        id: 'ART_AND_CRAFTS',
        name: 'Art & Crafts',
        icon: '🎨',
        description: 'Handmade and crafts'
    },
    {
        id: 'JEWELRY_AND_ACCESSORIES',
        name: 'Jewelry',
        icon: '💎',
        description: 'Jewelry and accessories'
    }
];

export const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
    return (
        <div>
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Browse the categories</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore different categories to find the perfect auction for you
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id === selectedCategory ? '' : category.id)}
                        className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${selectedCategory === category.id
                                ? 'border-green bg-green-50 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-green hover:shadow-md'
                            }`}
                    >
                        <div className={`text-4xl mb-4 transition-transform group-hover:scale-110 ${selectedCategory === category.id ? 'scale-110' : ''
                            }`}>
                            {category.icon}
                        </div>
                        <h3 className={`font-semibold mb-2 transition-colors ${selectedCategory === category.id ? 'text-green' : 'text-gray-800'
                            }`}>
                            {category.name}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {category.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;
