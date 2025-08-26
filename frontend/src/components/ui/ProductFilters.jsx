import React from "react";
import { IoSearchOutline, IoChevronDownOutline } from "react-icons/io5";

export const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  searchBy,
  setSearchBy,
  period,
  setPeriod,
  sortBy,
  setSortBy,
  statusFilter,
  setStatusFilter,
  onClearFilters
}) => {
  const handleClearAll = () => {
    setSearchTerm("");
    setSearchBy("name");
    setPeriod("");
    setSortBy("createdAt");
    setStatusFilter("");
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Period Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Period:</span>
          <div className="relative">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All time</option>
              <option value="7days">Last 7 days</option>
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
              <option value="name">Product name</option>
              <option value="description">Description</option>
              <option value="category">Category</option>
              <option value="status">Status</option>
            </select>
            <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Status:</span>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Sort Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="createdAt">Date created</option>
              <option value="updatedAt">Date updated</option>
              <option value="name">Name</option>
              <option value="stockQuantity">Stock quantity</option>
              <option value="status">Status</option>
            </select>
            <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={handleClearAll}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear all
        </button>
      </div>
    </div>
  );
};
