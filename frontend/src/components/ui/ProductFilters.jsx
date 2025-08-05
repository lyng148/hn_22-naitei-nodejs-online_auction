import React, { useState } from "react";
import { IoSearchOutline, IoChevronDownOutline } from "react-icons/io5";
import { PrimaryButton } from "../ui/index.js";

export const ProductFilters = () => {
  const [searchBy, setSearchBy] = useState("product");
  const [period, setPeriod] = useState("90days");
  const [sortBy, setSortBy] = useState("current_price");

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        {/* Period Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Period:</span>
          <div className="relative">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="6months">Last 6 months</option>
              <option value="1year">Last year</option>
            </select>
            <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Search Filter */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <span className="text-sm text-gray-700">Search by:</span>
          <div className="relative">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="product">Product title</option>
              <option value="category">Category</option>
              <option value="status">Status</option>
            </select>
            <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Sort Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Sorted by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="current_price">Current price</option>
              <option value="name">Name</option>
              <option value="date_created">Date created</option>
              <option value="stock">Stock quantity</option>
            </select>
            <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};
