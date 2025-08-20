import React from "react";
import { 
  IoSearchOutline, 
  IoCalendarOutline, 
  IoFilterOutline, 
  IoChevronDownOutline,
  IoSwapVerticalOutline
} from "react-icons/io5";

const OrderManagementFilters = ({
  searchTerm,
  setSearchTerm,
  period,
  setPeriod,
  searchBy,
  setSearchBy,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  statusFilter,
  setStatusFilter
}) => {
  const searchByOptions = [
    { value: "auction_title", label: "Auction Title" },
    { value: "order_id", label: "Order ID" },
    { value: "buyer_email", label: "Buyer Email" },
    { value: "seller_email", label: "Seller Email" },
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "PAID", label: "Paid" },
    { value: "SHIPPING", label: "Shipping" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELED", label: "Canceled" },
  ];

  const sortByOptions = [
    { value: "createdAt", label: "Created Date" },
    { value: "updatedAt", label: "Updated Date" },
    { value: "totalAmount", label: "Total Amount" },
  ];

  const periodOptions = [
    { value: "", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "3months", label: "Last 3 Months" },
  ];

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6">
      {/* Main Filter Row */}
      <div className="p-4 flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div className="relative">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[130px]"
            >
              {searchByOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[120px]"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort:</span>
          <div className="flex items-center gap-1">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-l-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[140px]"
              >
                {sortByOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            </div>
            <button
              onClick={toggleSortOrder}
              className="px-3 py-2.5 border border-l-0 border-gray-300 rounded-r-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
              title={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
            >
              <IoSwapVerticalOutline 
                className={`transform transition-transform duration-200 ${sortOrder === "asc" ? "rotate-180" : ""}`} 
                size={16} 
              />
            </button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <IoCalendarOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[140px]"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <IoChevronDownOutline className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagementFilters;
